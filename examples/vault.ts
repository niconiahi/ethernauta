// //if you had to be extremely simplistic, what method names do you think a POC for a wallet extension like metamask, should expose as API
//
// the idea here is a wallet that allows you to sign, and returns the signed transaction (for whichever transaction, doesn't matter, for example one being token transfer, so the method trasnfer with parameters from, to, amout, right) 
//
// that would immediately be returned to the application to be used. In my case, i'll grab that and send the transaction server side. As i like doing my application's logic on the server
//
//
// ChatGPT said:
//
// Thought for 8 seconds
// Here’s a super‑minimal API surface your POC extension might expose on window.myWallet:
//
// ts
// Copy
// Edit
// interface WalletAPI {
//   // 1. Ask user to connect and return their address(es)
//   connect(): Promise<string[]>;
//
//   // 2. Sign any raw transaction payload and return the serialized, signed hex
//   signTransaction(txParams: {
//     from: string;
//     to: string;
//     value?: string;      // in wei
//     data?: string;       // calldata / token‑transfer ABI
//     gas?: string;
//     gasPrice?: string;
//     chainId: number;
//   }): Promise<string>;
//
//   // 3. (Optional) Convenience wrapper for ERC‑20 transfers
//   transferToken(params: {
//     tokenAddress: string; // ERC‑20 contract
//     from: string;
//     to: string;
//     amount: string;       // in token’s decimals
//     chainId: number;
//   }): Promise<string>;
//
//   // 4. (Optional) Sign an arbitrary message (for off‑chain auth)
//   signMessage(message: string): Promise<string>;
// }
// — connect() lets the dApp trigger your approval UX and get back the user’s address.
//
// — signTransaction(...) is the only “must‑have” if you just want the signed blob to ship to your server.
//
// — transferToken(...) simply builds the standard ERC‑20 transfer(to, amount) call for you and returns the signed TX.
//
// — signMessage(...) covers things like signing non‑tx payloads (e.g. login challenges).
//
// With this surface, your front‑end can do:
//
// js
// Copy
// Edit
// const [addr] = await window.myWallet.connect();
// const signed = await window.myWallet.transferToken({
//   tokenAddress: USDT_ADDR,
//   from: addr,
//   to: recipient,
//   amount: "100",
//   chainId: 1
// });
// // send `signed` to your backend for broadcast…
//
//
//
//
//
//
//
// Sources
// You said:
// and what would , in general terms, do the connect method?
//
//
// ChatGPT said:
//
// Thought for a few seconds
// In broad strokes, connect() does three things:
//
// Prompt for permission
// When your dApp calls await window.myWallet.connect(), the extension opens its “Connect” UI (a popup or sidebar). There you:
//
// Show which network(s) you support (e.g. Ethereum Mainnet, BSC, etc.)
//
// Show the user’s available accounts (from their seed or key‑store)
//
// Ask them to pick one or more addresses and approve your dApp’s access
//
// Establish the session
// Once they hit “Approve,” the extension:
//
// Records that your origin is allowed to see those address(es)
//
// (Optionally) wires up listeners so your dApp can get events when the user switches accounts or networks
//
// Return the addresses
// Finally, connect() resolves with an array of the selected address strings:
//
// ts
// Copy
// Edit
// const accounts = await window.myWallet.connect();
// console.log(accounts); // e.g. ["0x123…", "0xABC…"]
// If the user rejects or closes the popup, the promise rejects with an error you can catch.
//
// Key points to handle in your POC
//
// UI/UX: show clear “Connect” messaging, network selector, and account list.
//
// Permissions: record which sites are allowed; subsequent calls to connect() could just resolve immediately if already approved.
//
// Events: fire a window.myWallet.on(‘accountsChanged’, …) or on(‘chainChanged’, …) so your dApp can react if the user switches.
//
// Error handling: if they cancel, throw a descriptive error (e.g. { code: 4001, message: 'User rejected connection' }).
//
//
//
//
// MetaMask doesn’t ever persist your bare mnemonic or password in plaintext. Here’s what actually happens under the hood:
//
// Mnemonic (“seed phrase”)
//
// You enter your 12‑ or 24‑word phrase.
//
// MetaMask uses your vault password to derive an encryption key (via PBKDF2).
//
// It encrypts the seed with AES‑256 and stores that ciphertext in your browser’s extension storage (e.g. chrome.storage.local under the “vault” key, or in your profile’s Local Extension Settings folder).
//
// Vault password
//
// It isn’t stored anywhere.
//
// Instead, when you unlock the extension, MetaMask runs the same PBKDF2 derivation on the password you type and tries to decrypt the stored vault. If decryption succeeds, you’re in; if not, it fails.
//
// So in short:
//
// Where’s the seed? Encrypted blob in your extension’s local storage on disk.
//
// Where’s the password? It’s never written to disk—only used at runtime to decrypt that blob.
//
//
//
//
//
//
//
//
// Sources
// You said:
// so the pneumonics + the password i set up, Metamask work cryptographically together to allow me to enter? am i understanding it correctly?
//
//
// ChatGPT said:
//
// Thought for a few seconds
// Yes – you’ve got it. MetaMask uses your password to derive an encryption key (via PBKDF2) which it then uses to AES‑encrypt your mnemonic. When you enter the password, it decrypts the mnemonic so the wallet can generate your keys. Without that password, the seed stays locked.

// vault-indexeddb.js

// Helpers to convert between ArrayBuffer ↔︎ Base64
const buf2b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const b642buf = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

// Derive an AES-GCM key from password + salt via PBKDF2
easync function deriveKey(password, salt, keyUsage) {
  const pwUtf8 = new TextEncoder().encode(password);
  const baseKey = await crypto.subtle.importKey(
    'raw', pwUtf8, 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    keyUsage
  );
}

// Open (or upgrade) IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('vaultDB', 1);
    req.onupgradeneeded = (event) => {
      event.target.result.createObjectStore('vaultStore');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Save encrypted vault to IndexedDB
async function saveVault(mnemonic, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const key  = await deriveKey(password, salt, ['encrypt']);
  const data = new TextEncoder().encode(mnemonic);
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  const record = {
    salt:   buf2b64(salt),
    iv:     buf2b64(iv),
    cipher: buf2b64(cipher)
  };

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('vaultStore', 'readwrite');
    const store = tx.objectStore('vaultStore');
    const putReq = store.put(record, 'vault');
    putReq.onsuccess = () => resolve();
    putReq.onerror = () => reject(putReq.error);
  });
}

// Load and decrypt vault from IndexedDB
async function loadVault(password) {
  const db = await openDB();
  const record = await new Promise((resolve, reject) => {
    const tx = db.transaction('vaultStore', 'readonly');
    const store = tx.objectStore('vaultStore');
    const getReq = store.get('vault');
    getReq.onsuccess = () => {
      if (!getReq.result) reject(new Error('No vault found'));
      else resolve(getReq.result);
    };
    getReq.onerror = () => reject(getReq.error);
  });

  const saltBuf   = b642buf(record.salt);
  const ivBuf     = b642buf(record.iv);
  const cipherBuf = b642buf(record.cipher);

  const key = await deriveKey(password, saltBuf, ['decrypt']);
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuf },
    key,
    cipherBuf
  );

  return new TextDecoder().decode(plain);
}

// Example usage:
(async () => {
  // Save vault
  await saveVault(
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    'myStrongPassword!'
  );
  console.log('Vault saved.');

  // Load vault
  try {
    const mnemonic = await loadVault('myStrongPassword!');
    console.log('Decrypted mnemonic:', mnemonic);
  } catch (e) {
    console.error('Failed to unlock:', e.message);
  }
})();

