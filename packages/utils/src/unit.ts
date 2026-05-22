export function format_unit(
  value: bigint,
  decimals = 18,
): string {
  if (value === 0n) {
    return "0"
  }
  const negative = value < 0n
  const abs = negative ? -value : value
  const base = 10n ** BigInt(decimals)
  const integer_part = abs / base
  const fraction_part = abs % base
  const sign = negative ? "-" : ""
  if (fraction_part === 0n) {
    return `${sign}${integer_part.toString()}`
  }
  const fraction = fraction_part
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "")
  return `${sign}${integer_part.toString()}.${fraction}`
}

export function format_ether(value: bigint): string {
  return format_unit(value, 18)
}

export function format_gwei(value: bigint): string {
  return format_unit(value, 9)
}

export function parse_ether(value: string): bigint {
  return parse_unit(value, 18)
}

export function parse_gwei(value: string): bigint {
  return parse_unit(value, 9)
}

export function parse_unit(
  value: string,
  decimals = 18,
): bigint {
  if (value === "") {
    throw new Error("parse_unit: empty string")
  }
  const negative = value.startsWith("-")
  const unsigned = negative ? value.slice(1) : value
  if (!/^(\d+\.?\d*|\.\d+)$/.test(unsigned)) {
    throw new Error(`parse_unit: invalid number "${value}"`)
  }
  const [integer_str, fraction_str = ""] =
    unsigned.split(".")
  if (fraction_str.length > decimals) {
    throw new Error(
      `parse_unit: "${value}" has more than ${decimals} fractional digits`,
    )
  }
  const integer = integer_str === "" ? "0" : integer_str
  const padded = fraction_str.padEnd(decimals, "0")
  const base = 10n ** BigInt(decimals)
  const fraction_bigint =
    padded === "" ? 0n : BigInt(padded)
  const result = BigInt(integer) * base + fraction_bigint
  return negative ? -result : result
}
