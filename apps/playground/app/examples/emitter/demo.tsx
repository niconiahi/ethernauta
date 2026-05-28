import "./demo.css"
// The standalone EIP-1193 event emitter — without a wallet, without a
// chain, without an HTTP roundtrip. `create_emitter()` is the in-memory
// primitive the wallet uses to build its `on / removeListener / emit`
// surface; this demo wires two listeners to it and lets you fire each
// of the standard 1193 events by hand.

import {
  create_emitter,
  type Emitter,
} from "@ethernauta/eip/1193"
import { useEffect, useMemo, useState } from "react"
import { Button } from "../../components/button"

type LogEntry = {
  event: "accountsChanged" | "chainChanged"
  payload: string
  at: string
}

const SAMPLE_ACCOUNTS_A: string[] = [
  "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045",
]
const SAMPLE_ACCOUNTS_B: string[] = [
  "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045",
  "0x1111111254EEB25477B68fb85Ed929f73A960582",
]
const EMPTY_ACCOUNTS: string[] = []

const CHAIN_MAINNET = "0x1"
const CHAIN_BASE = "0x2105"
const CHAIN_OP = "0xa"

function now_iso(): string {
  return new Date().toISOString().slice(11, 19)
}

export function EmitterDemo() {
  // useMemo so the emitter is created once per mount; useEffect
  // below subscribes and tears down with the component.
  const emitter: Emitter = useMemo(() => create_emitter(), [])
  const [log, set_log] = useState<LogEntry[]>([])

  useEffect(() => {
    function on_accounts(accounts: string[]): void {
      set_log((prev) => [
        {
          event: "accountsChanged",
          payload: JSON.stringify(accounts),
          at: now_iso(),
        },
        ...prev,
      ])
    }
    function on_chain(chain_id: string): void {
      set_log((prev) => [
        {
          event: "chainChanged",
          payload: chain_id,
          at: now_iso(),
        },
        ...prev,
      ])
    }
    emitter.on("accountsChanged", on_accounts)
    emitter.on("chainChanged", on_chain)
    return () => {
      emitter.removeListener("accountsChanged", on_accounts)
      emitter.removeListener("chainChanged", on_chain)
    }
  }, [emitter])

  return (
    <div className="emitter-root">
      <p className="emitter-description">
        A locally-constructed <code>create_emitter()</code>{" "}
        with two listeners attached. Click a button to fire
        an event; the listener pushes a row into the log
        below. No wallet, no chain — pure in-memory.
      </p>
      <div className="emitter-buttons">
        <Button
          onClick={() => {
            emitter.emit("accountsChanged", SAMPLE_ACCOUNTS_A)
          }}
        >
          accountsChanged (1 account)
        </Button>
        <Button
          onClick={() => {
            emitter.emit("accountsChanged", SAMPLE_ACCOUNTS_B)
          }}
        >
          accountsChanged (2 accounts)
        </Button>
        <Button
          onClick={() => {
            emitter.emit("accountsChanged", EMPTY_ACCOUNTS)
          }}
        >
          accountsChanged ([])
        </Button>
        <Button
          onClick={() => {
            emitter.emit("chainChanged", CHAIN_MAINNET)
          }}
        >
          chainChanged → mainnet (0x1)
        </Button>
        <Button
          onClick={() => {
            emitter.emit("chainChanged", CHAIN_BASE)
          }}
        >
          chainChanged → Base (0x2105)
        </Button>
        <Button
          onClick={() => {
            emitter.emit("chainChanged", CHAIN_OP)
          }}
        >
          chainChanged → Optimism (0xa)
        </Button>
      </div>
      <Button
        onClick={() => {
          set_log([])
        }}
        disabled={log.length === 0}
      >
        Clear log
      </Button>
      {log.length > 0 && (
        <table className="emitter-log-table">
          <thead>
            <tr className="emitter-log-head">
              <th className="emitter-log-cell">time</th>
              <th className="emitter-log-cell">event</th>
              <th className="emitter-log-cell">payload</th>
            </tr>
          </thead>
          <tbody>
            {log.map((entry, i) => (
              <tr
                // biome-ignore lint/suspicious/noArrayIndexKey: display-only, prepended in order
                key={i}
                className="emitter-log-row"
              >
                <td className="emitter-log-cell">
                  {entry.at}
                </td>
                <td className="emitter-log-cell">
                  {entry.event}
                </td>
                <td className="emitter-log-payload">
                  {entry.payload}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
