import { it, expect, beforeEach } from "vitest"
import "fake-indexeddb/auto"
import {
  set_vault,
  get_vault,
  vault_exists,
  delete_vault,
  validate_mnemonic,
  validate_password,
} from "./vault"

const TEST_MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
const TEST_PASSWORD = "test123"

beforeEach(async () => {
  await delete_vault()
})

it("should validate correct mnemonic lengths", () => {
  expect(validate_mnemonic("word ".repeat(12).trim())).toBe(
    true,
  )
  expect(validate_mnemonic("word ".repeat(15).trim())).toBe(
    true,
  )
  expect(validate_mnemonic("word ".repeat(18).trim())).toBe(
    true,
  )
  expect(validate_mnemonic("word ".repeat(21).trim())).toBe(
    true,
  )
  expect(validate_mnemonic("word ".repeat(24).trim())).toBe(
    true,
  )
})

it("should reject invalid mnemonic lengths", () => {
  expect(validate_mnemonic("word ".repeat(11).trim())).toBe(
    false,
  )
  expect(validate_mnemonic("word ".repeat(13).trim())).toBe(
    false,
  )
  expect(validate_mnemonic("word ".repeat(25).trim())).toBe(
    false,
  )
  expect(validate_mnemonic("")).toBe(false)
  expect(validate_mnemonic("   ")).toBe(false)
})

it("should return false when vault doesn't exist", async () => {
  const exists = await vault_exists()
  expect(exists).toBe(false)
})

it("should save and retrieve vault successfully", async () => {
  await set_vault(TEST_MNEMONIC, TEST_PASSWORD)

  const exists = await vault_exists()
  expect(exists).toBe(true)

  const retrieved = await get_vault(TEST_PASSWORD)
  expect(retrieved).toBe(TEST_MNEMONIC)
})

it("should throw error when saving empty mnemonic", async () => {
  await expect(
    set_vault("", TEST_PASSWORD),
  ).rejects.toThrow("Mnemonic cannot be empty")
  await expect(
    set_vault("   ", TEST_PASSWORD),
  ).rejects.toThrow("Mnemonic cannot be empty")
})

it("should throw error when saving with empty password", async () => {
  await expect(
    set_vault(TEST_MNEMONIC, ""),
  ).rejects.toThrow("Password cannot be empty")
  await expect(
    set_vault(TEST_MNEMONIC, "   "),
  ).rejects.toThrow("Password cannot be empty")
})

it("should throw error when retrieving with empty password", async () => {
  await expect(get_vault("")).rejects.toThrow(
    "Password cannot be empty",
  )
  await expect(get_vault("   ")).rejects.toThrow(
    "Password cannot be empty",
  )
})

it("should throw error when retrieving with wrong password", async () => {
  await set_vault(TEST_MNEMONIC, TEST_PASSWORD)

  await expect(get_vault("wrong_password")).rejects.toThrow(
    "Invalid password or corrupted vault",
  )
})

it("should delete vault successfully", async () => {
  await set_vault(TEST_MNEMONIC, TEST_PASSWORD)

  let exists = await vault_exists()
  expect(exists).toBe(true)

  await delete_vault()

  exists = await vault_exists()
  expect(exists).toBe(false)
})

it("should handle multiple save/retrieve cycles", async () => {
  const mnemonic1 =
    "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
  const mnemonic2 =
    "legal winner thank year wave sausage worth useful legal winner thank yellow"
  const password1 = "password1"
  const password2 = "password2"

  await set_vault(mnemonic1, password1)
  let retrieved = await get_vault(password1)
  expect(retrieved).toBe(mnemonic1)

  await set_vault(mnemonic2, password2)
  retrieved = await get_vault(password2)
  expect(retrieved).toBe(mnemonic2)

  await expect(get_vault(password1)).rejects.toThrow(
    "Invalid password or corrupted vault",
  )
})

it("should preserve exact mnemonic whitespace and casing", async () => {
  const mnemonicWithSpaces =
    "  abandon   abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about  "
  const mnemonicMixed =
    "Abandon ABANDON abandon Abandon abandon abandon abandon abandon abandon abandon abandon about"

  await set_vault(mnemonicWithSpaces, TEST_PASSWORD)
  let retrieved = await get_vault(TEST_PASSWORD)
  expect(retrieved).toBe(mnemonicWithSpaces)

  await set_vault(mnemonicMixed, TEST_PASSWORD)
  retrieved = await get_vault(TEST_PASSWORD)
  expect(retrieved).toBe(mnemonicMixed)
})

it("should validate correct password", async () => {
  await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
  const isValid = await validate_password(TEST_PASSWORD)
  expect(isValid).toBe(true)
})

it("should return false for incorrect password", async () => {
  await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
  const isValid = await validate_password("wrong_password")
  expect(isValid).toBe(false)
})

it("should return false when no vault exists", async () => {
  const isValid = await validate_password(TEST_PASSWORD)
  expect(isValid).toBe(false)
})

it("should return false for empty password", async () => {
  await set_vault(TEST_MNEMONIC, TEST_PASSWORD)

  const isValid = await validate_password("")
  expect(isValid).toBe(false)
})

it("should return false for whitespace-only password", async () => {
  await set_vault(TEST_MNEMONIC, TEST_PASSWORD)

  const isValid = await validate_password("   ")
  expect(isValid).toBe(false)
})
