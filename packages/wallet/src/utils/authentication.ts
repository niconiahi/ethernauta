import * as v from "valibot"

export async function set_timestamp() {
  const now = Date.now()
  await chrome.storage.sync.set({ timestamp: now })
}

export async function get_timestamp() {
  const storage = v.parse(
    v.object({
      timestamp: v.optional(v.number()),
    }),
    await chrome.storage.sync.get("timestamp"),
  )
  return storage.timestamp
}

export async function is_authenticated() {
  const now = Date.now()
  const timestamp = await get_timestamp()
  if (!timestamp) {
    return false
  }
  const elapsed = now - timestamp
  const FIVE_MINUTES = 5 * 60 * 1000
  if (elapsed < FIVE_MINUTES) {
    return true
  }
  return false
}
