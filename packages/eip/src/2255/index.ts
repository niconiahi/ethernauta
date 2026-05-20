// https://eips.ethereum.org/EIPS/eip-2255

export {
  type Caveat,
  caveatSchema,
  type Permission,
  permissionSchema,
  type RequestedPermissions,
  requestedPermissionSchema,
} from "./permission"
export { wallet_getPermissions } from "./method/wallet_getPermissions"
export { wallet_requestPermissions } from "./method/wallet_requestPermissions"
