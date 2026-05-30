// https://eips.ethereum.org/EIPS/eip-1967

import {
  type Address,
  AddressSchema,
  type NotFound,
} from "@ethernauta/core"
import {
  type Readable,
  type ResolvedReader,
} from "@ethernauta/transport"
import { parse } from "valibot"

import { read_address_slot } from "./read-address-slot"
import { BEACON_SLOT } from "./slots"

export function get_beacon(
  _address: Address,
): Readable<Address | NotFound> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Address | NotFound> => {
    const address = parse(AddressSchema, _address)
    return read_address_slot(
      dispatcher,
      address,
      BEACON_SLOT,
    )
  }
}
