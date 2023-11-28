type ObjectValues<T> = T[keyof T];
const EIP1102_METHOD = {
  REQUEST_ACCOUNTS: "eth_requestAccounts",
} as const;
type Eip1102Method = ObjectValues<typeof EIP1102_METHOD>;
type Eip1102Params = {
  [EIP1102_METHOD.REQUEST_ACCOUNTS]: [];
};
type Eip1102Call = {
  [M in Eip1102Method]: [M, ...Eip1102Params[M]];
}[Eip1102Method];

// https://eips.ethereum.org/EIPS/eip-1102
export function createEip1102Client() {
  function send(call: [typeof EIP1102_METHOD.REQUEST_ACCOUNTS]): string[];
  function send(call: Eip1102Call): string[] {
    const method = call[0];
    switch (method) {
      // https://eips.ethereum.org/EIPS/eip-1102
      case "eth_requestAccounts": {
        return ["0x442660DDf67dd90f9a75885b2e2312F991b3027B"];
      }
      default: {
        const _exhaustiveCheck: never = method;
        return _exhaustiveCheck; // this will cause a compile-time error if any method is unhandled
      }
    }
  }

  return { send };
}
