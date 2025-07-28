export type SignResponse = {
  id: string
  error?: string
  signature?: string
}

export type Cryptoman = {
  sign: (
    method: string,
    params: unknown[],
  ) => Promise<string>
  connect: () => Promise<void>
}

declare global {
  interface Window {
    cryptoman: Cryptoman
  }
}
