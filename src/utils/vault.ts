// Vault utilities for secure mnemonic storage using IndexedDB
// Based on MetaMask's approach: password + PBKDF2 + AES-GCM encryption
export type VaultRecord = {
  salt: string // Base64-encoded salt for PBKDF2
  iv: string // Base64-encoded initialization vector for AES-GCM
  cipher: string // Base64-encoded encrypted mnemonic
}

const PBKDF2_CONFIG = {
  iterations: 100_000,
  hash: "SHA-256",
} as const
const DB_CONFIG = {
  name: "walle",
  version: 1,
  storeName: "vault",
  vaultKey: "vault",
} as const

function buffer_to_base_64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
function base_64_to_buffer(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

async function derive_key(
  password: string,
  salt: Uint8Array,
  keyUsages: KeyUsage[],
): Promise<CryptoKey> {
  const buffer = new TextEncoder().encode(password)
  const key = await crypto.subtle.importKey(
    "raw",
    buffer,
    "PBKDF2",
    false,
    ["deriveKey"],
  )
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_CONFIG.iterations,
      hash: PBKDF2_CONFIG.hash,
    },
    key,
    { name: "AES-GCM", length: 256 },
    false,
    keyUsages,
  )
}

function open_database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(
      DB_CONFIG.name,
      DB_CONFIG.version,
    )
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (
        !db.objectStoreNames.contains(DB_CONFIG.storeName)
      ) {
        db.createObjectStore(DB_CONFIG.storeName)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () =>
      reject(
        new Error(
          `Failed to open database: ${req.error?.message}`,
        ),
      )
  })
}

export async function set_vault(
  mnemonic: string,
  password: string,
): Promise<void> {
  if (!mnemonic.trim()) {
    throw new Error("Mnemonic cannot be empty")
  }
  if (!password.trim()) {
    throw new Error("Password cannot be empty")
  }
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await derive_key(password, salt, ["encrypt"])
  const data = new TextEncoder().encode(mnemonic)
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data,
  )
  const record: VaultRecord = {
    salt: buffer_to_base_64(salt),
    iv: buffer_to_base_64(iv),
    cipher: buffer_to_base_64(cipher),
  }
  const database = await open_database()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      DB_CONFIG.storeName,
      "readwrite",
    )
    const store = transaction.objectStore(
      DB_CONFIG.storeName,
    )
    const request = store.put(record, DB_CONFIG.vaultKey)
    request.onsuccess = () => resolve()
    request.onerror = () =>
      reject(
        new Error(
          `Failed to save vault: ${request.error?.message}`,
        ),
      )
  })
}

/**
 * Load and decrypt vault from IndexedDB
 */
export async function get_vault(
  password: string,
): Promise<string> {
  if (!password.trim()) {
    throw new Error("Password cannot be empty")
  }
  const database = await open_database()
  const record = await new Promise<VaultRecord>(
    (resolve, reject) => {
      const transaction = database.transaction(
        DB_CONFIG.storeName,
        "readonly",
      )
      const store = transaction.objectStore(
        DB_CONFIG.storeName,
      )
      const request = store.get(DB_CONFIG.vaultKey)
      request.onsuccess = () => {
        const result = request.result as
          | VaultRecord
          | undefined
        if (!result) {
          reject(new Error("No vault found"))
        } else {
          resolve(result)
        }
      }
      request.onerror = () =>
        reject(
          new Error(
            `Failed to load vault: ${request.error?.message}`,
          ),
        )
    },
  )
  const salt_buffer = base_64_to_buffer(record.salt)
  const iv_buffer = base_64_to_buffer(record.iv)
  const cipher_buffer = base_64_to_buffer(record.cipher)
  const key = await derive_key(password, salt_buffer, [
    "decrypt",
  ])
  const content_buffer = await crypto.subtle
    .decrypt(
      { name: "AES-GCM", iv: iv_buffer },
      key,
      cipher_buffer,
    )
    .catch((error) => {
      if (error instanceof Error) {
        throw new Error(
          "Invalid password or corrupted vault",
        )
      }
      throw new Error("invalid unkwown error")
    })
  return new TextDecoder().decode(content_buffer)
}

export async function vault_exists(): Promise<boolean> {
  try {
    const db = await open_database()
    return new Promise((resolve) => {
      const tx = db.transaction(
        DB_CONFIG.storeName,
        "readonly",
      )
      const store = tx.objectStore(DB_CONFIG.storeName)
      const getReq = store.get(DB_CONFIG.vaultKey)

      getReq.onsuccess = () => resolve(!!getReq.result)
      getReq.onerror = () => resolve(false)
    })
  } catch {
    return false
  }
}

export async function delete_vault(): Promise<void> {
  const db = await open_database()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      DB_CONFIG.storeName,
      "readwrite",
    )
    const store = tx.objectStore(DB_CONFIG.storeName)
    const deleteReq = store.delete(DB_CONFIG.vaultKey)

    deleteReq.onsuccess = () => resolve()
    deleteReq.onerror = () =>
      reject(
        new Error(
          `Failed to delete vault: ${deleteReq.error?.message}`,
        ),
      )
  })
}

export function validate_mnemonic(
  mnemonic: string,
): boolean {
  const words = mnemonic.trim().split(/\s+/)
  // Standard mnemonic lengths: 12, 15, 18, 21, 24 words
  return [12, 15, 18, 21, 24].includes(words.length)
}
