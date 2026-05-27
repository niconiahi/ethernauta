// Inline placeholder demos render in place of their old
// "Connect wallet" button when no SIWE session exists.
// Points the user at the global header where sign-in lives
// now.

export function SignInHint() {
  return (
    <p
      style={{
        margin: 0,
        padding: "10px 12px",
        borderRadius: 6,
        background: "var(--surface-strong)",
        border: "1px solid var(--active-bg)",
        color: "var(--text)",
        fontSize: 13,
      }}
    >
      Sign in via <strong>Connect wallet</strong> at the top
      right to run this demo.
    </p>
  )
}
