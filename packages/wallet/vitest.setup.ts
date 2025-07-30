import { hmac } from "@noble/hashes/hmac"
import { sha256 } from "@noble/hashes/sha256"
import * as secp from "@noble/secp256k1"

// Set up HMAC for secp256k1 globally for tests
secp.utils.hmacSha256Sync = (key, ...messages) =>
  hmac(sha256, key, secp.utils.concatBytes(...messages))