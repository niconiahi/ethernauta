import { eip155_11155111 } from "@ethernauta/chain"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import {
  register_transaction,
  type Transaction,
  watch_transaction,
} from "@ethernauta/transaction"
import {
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { number_to_hex } from "@ethernauta/wallet"
import { useEffect, useRef, useState } from "react"
import { Button, ButtonLink } from "../components/button"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://ethereum-sepolia-rpc.publicnode.com"
const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const writer = create_writer([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])

export default function () {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([])
  const [error, set_error] = useState<string | null>(null)
  const last_transaction =
    transactions[transactions.length - 1]
  const dialog_ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialog_ref.current
    if (!dialog) return
    if (last_transaction || error) {
      dialog.show()
    } else {
      dialog.close()
    }
  }, [last_transaction, error])

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        color: "#1a1a1a",
        background: "#faf5f0",
        minHeight: "100vh",
      }}
    >
      {/* Hero */}
      <section
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "80px 24px 48px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            margin: "0 0 16px",
            letterSpacing: -1,
          }}
        >
          Ethernauta
        </h1>
        <p
          style={{
            fontSize: 20,
            color: "#555",
            maxWidth: 480,
            margin: "0 auto 40px",
            lineHeight: 1.5,
          }}
        >
          A minimal Ethereum wallet extension. Create a
          wallet, keep your keys encrypted on your device,
          and sign transactions — nothing ever leaves your
          browser.
        </p>
        <ButtonLink href="https://chromewebstore.google.com">
          Add to Chrome
        </ButtonLink>
      </section>

      {/* Demo */}
      <section
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Try it here
        </h2>
        <p
          style={{
            color: "#666",
            fontSize: 14,
            marginBottom: 32,
          }}
        >
          Install the extension, then use the buttons below
          to connect your wallet and send a test transfer on
          Sepolia.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <TestWalletButton />
          <Button
            variant="secondary"
            onClick={() => {
              window.wallet.connect()
            }}
          >
            Connect wallet
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              set_error(null)
              try {
                const METHOD = "transfer"
                const ADDRESS =
                  "0x636c0fcd6da2207abfa80427b556695a4ad0af94"
                const params = [ADDRESS, number_to_hex(1)]
                const signed_transaction =
                  await window.wallet.sign(METHOD, params)
                const writable = eth_sendRawTransaction([
                  signed_transaction,
                ])
                const hash = await writable(
                  writer(SEPOLIA_CHAIN_ID),
                )
                const transaction =
                  register_transaction(hash)
                setTransactions([transaction])
                watch_transaction(
                  transaction.hash,
                  (transaction) => {
                    setTransactions((prev) => [
                      ...prev,
                      transaction,
                    ])
                  },
                )
              } catch (e) {
                set_error(
                  e instanceof Error
                    ? e.message
                    : "Unknown error",
                )
              }
            }}
          >
            Send transfer
          </Button>
        </div>
        <dialog
          ref={dialog_ref}
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            top: "auto",
            left: "auto",
            border: "2px solid #ddd",
            borderRadius: 8,
            padding: "12px 16px",
            background: "#fff",
            margin: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              {error
                ? render_error(error)
                : last_transaction
                  ? render_transaction(last_transaction)
                  : null}
            </div>
            <Button
              variant="ghost"
              squared
              onClick={() => {
                set_error(null)
                dialog_ref.current?.close()
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </div>
        </dialog>
      </section>

      {/* How it works */}
      <section
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          How it works
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 32,
          }}
        >
          {[
            {
              step: "1",
              title: "Create your wallet",
              desc: "Generate a mnemonic phrase and protect it with a password. Stored encrypted on your device.",
            },
            {
              step: "2",
              title: "Unlock with password",
              desc: "Enter your password to unlock the vault and access your Ethereum address and balance.",
            },
            {
              step: "3",
              title: "Connect to a site",
              desc: "Click Connect wallet on any supported site to link your Ethernauta wallet.",
            },
            {
              step: "4",
              title: "Review and sign",
              desc: "See exactly what you're signing — method, params, address — then confirm with one click.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#FF5005",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                {step}
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#666",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshots */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          See it in action
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24,
            justifyItems: "center",
          }}
        >
          <ExtensionMockup label="Save wallet">
            <MockInput placeholder="smile price bomb movie" />
            <MockInput placeholder="Password" />
            <MockButton>Save wallet</MockButton>
          </ExtensionMockup>

          <ExtensionMockup label="Unlock">
            <MockInput placeholder="Password" />
            <MockButton>Unlock</MockButton>
          </ExtensionMockup>

          <ExtensionMockup label="Wallet">
            <div
              style={{
                fontSize: 11,
                color: "#333",
                marginBottom: 6,
              }}
            >
              <div>
                <b>Address</b>
              </div>
              <div
                style={{
                  wordBreak: "break-all",
                  color: "#555",
                  fontSize: 10,
                }}
              >
                0x636c0fcd6da2207abfa8...
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#333" }}>
              <b>Balance</b> 0.09551 ETH
            </div>
          </ExtensionMockup>

          <ExtensionMockup label="Sign">
            <div
              style={{
                fontSize: 11,
                color: "#333",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              You are about to sign
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#555",
                marginBottom: 4,
              }}
            >
              <b>Method</b>
              <div>transfer</div>
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#555",
                marginBottom: 8,
              }}
            >
              <b>Params</b>
              <div style={{ wordBreak: "break-all" }}>
                0 0x636c0fcd...
              </div>
              <div>1 0x1</div>
            </div>
            <MockButton>Sign</MockButton>
          </ExtensionMockup>
        </div>
      </section>

      {/* Security */}
      <section
        style={{
          background: "#fff",
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "48px 24px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 32,
          }}
        >
          {[
            {
              icon: "🔒",
              title: "Fully local",
              desc: "Your keys never leave your browser. No servers, no cloud.",
            },
            {
              icon: "🔑",
              title: "AES-GCM encrypted",
              desc: "Your mnemonic is encrypted with a key derived from your password via PBKDF2.",
            },
            {
              icon: "✍️",
              title: "Sign only what you see",
              desc: "Every transaction shows you the method and params before you confirm.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title}>
              <div
                style={{ fontSize: 28, marginBottom: 8 }}
              >
                {icon}
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#666",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #eee",
          textAlign: "center",
          padding: "24px",
          fontSize: 13,
          color: "#999",
        }}
      >
        <a
          href="/privacy-policy"
          style={{
            color: "#999",
            textDecoration: "underline",
          }}
        >
          Privacy Policy
        </a>
      </footer>
    </div>
  )
}

const TEST_MNEMONIC =
  "smile price bomb movie minimum treat hurdle adult wing come space cross"

function TestWalletButton() {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="primary"
      onClick={async () => {
        await navigator.clipboard.writeText(TEST_MNEMONIC)
        setCopied(true)
        window.wallet.connect()
      }}
    >
      {copied
        ? "Test mnemonics copied — paste in the extension"
        : "Connect with test wallet"}
    </Button>
  )
}

function ExtensionMockup({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <div
      style={{
        width: 180,
        background: "#faf5f0",
        border: "1px solid #ddd",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: "#2d2d2d",
          padding: "6px 10px",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#ff5f57",
          }}
        />
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#febc2e",
          }}
        />
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#28c840",
          }}
        />
        <span
          style={{
            marginLeft: "auto",
            fontSize: 9,
            color: "#aaa",
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  )
}

function MockInput({
  placeholder,
}: {
  placeholder: string
}) {
  return (
    <div
      style={{
        border: "1.5px solid #333",
        borderRadius: 4,
        padding: "6px 8px",
        fontSize: 11,
        color: "#999",
        marginBottom: 8,
        background: "#fff",
      }}
    >
      {placeholder}
    </div>
  )
}

function MockButton({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: "#FF5005",
        borderRadius: 4,
        padding: "7px 0",
        fontSize: 12,
        fontWeight: 700,
        color: "#fff",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  )
}

function render_error(message: string) {
  return (
    <p
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        margin: 0,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#e53e3e",
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {message}
    </p>
  )
}

function render_transaction(transaction: Transaction) {
  const key = `transaction-${transaction.hash}-${transaction.status}`
  switch (transaction.status) {
    case "pending": {
      return (
        <p
          key={key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: 0,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FF5005",
              display: "inline-block",
              animation: "pulse 1.2s ease-in-out infinite",
            }}
          />
          Pending —{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#FF5005",
              fontFamily: "monospace",
              fontSize: 13,
            }}
          >
            {transaction.hash.slice(0, 8)}…
            {transaction.hash.slice(-6)}
          </a>
        </p>
      )
    }
    case "mined": {
      return (
        <p
          key={key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: 0,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#0FA05C",
              display: "inline-block",
            }}
          />
          Successful transaction{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
            style={{ color: "#FF5005" }}
          >
            See on Etherscan
          </a>
        </p>
      )
    }
    default: {
      return (
        <p key={key}>
          unhandled status: {transaction.status}
        </p>
      )
    }
  }
}
