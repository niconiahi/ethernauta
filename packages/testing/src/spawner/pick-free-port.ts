import { createServer } from "node:net"

// Open a TCP socket on port 0, let the kernel pick a free port,
// close the socket, and return the number. The race window
// between "we closed it" and "anvil binds it" is irrelevant: if
// the kernel reused the port we'd fail loudly on bind, and in
// practice it does not within the spawn latency. `--port <fixed>`
// remains as an escape hatch for cases where deterministic
// ports are needed (e.g. RPC caching upstream of a fork).

export function pick_free_port(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.unref()
    server.on("error", reject)
    server.listen(0, () => {
      const address = server.address()
      if (address === null || typeof address === "string") {
        server.close()
        reject(new Error("no tcp port assigned"))
        return
      }
      const port = address.port
      server.close(() => resolve(port))
    })
  })
}
