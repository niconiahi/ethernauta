// https://eips.ethereum.org/EIPS/eip-2255

export { wallet_getPermissions } from "./method/wallet_getPermissions"
export { wallet_requestPermissions } from "./method/wallet_requestPermissions"
export {
  type Caveat,
  CaveatSchema,
  type Permission,
  PermissionSchema,
  RequestedPermissionSchema,
  type RequestedPermissions,
} from "./permission"
