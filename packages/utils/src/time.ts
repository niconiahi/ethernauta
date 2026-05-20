export function seconds_to_big(seconds: number): bigint {
  return BigInt(Math.floor(seconds))
}

export function now_to_big(): bigint {
  return seconds_to_big(Date.now() / 1000)
}

export function deadline_in(seconds: number): bigint {
  return seconds_to_big(Date.now() / 1000 + seconds)
}
