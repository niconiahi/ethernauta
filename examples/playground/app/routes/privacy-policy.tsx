const h2 = {
  fontSize: 18,
  fontWeight: 700,
  marginTop: 40,
  marginBottom: 8,
}
const p = { marginBottom: 12 }
const ul = { paddingLeft: 20, marginBottom: 12 }
const li = { marginBottom: 6 }

export default function () {
  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "40px 24px",
        fontFamily: "sans-serif",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        Privacy Policy
      </h1>
      <p style={{ marginBottom: 32, color: "#666" }}>
        <strong>Last updated: May 11, 2026</strong>
      </p>

      <h2 style={h2}>Overview</h2>
      <p style={p}>
        Ethernauta is a browser extension that functions as a
        self-custody Ethereum wallet. We are committed to
        protecting your privacy. This policy explains what
        data is handled and how.
      </p>

      <h2 style={h2}>Data We Do Not Collect</h2>
      <p style={p}>
        Ethernauta does <strong>not</strong> collect, transmit,
        or share <em>any</em> personal data. Specifically:
      </p>
      <ul style={ul}>
        <li style={li}>
          We do <em>not</em> collect your name, email, or any
          identifying information.
        </li>
        <li style={li}>
          We do <em>not</em> transmit your private keys, seed
          phrases, or passwords to <em>any</em> server.
        </li>
        <li style={li}>
          We do <em>not</em> use analytics, tracking, or
          telemetry of any kind.
        </li>
        <li style={li}>
          We do <em>not</em> share any data with third parties.
        </li>
      </ul>

      <h2 style={h2}>Data Stored Locally</h2>
      <p style={p}>
        All wallet data is stored <em>exclusively</em> on your
        device and <em>never</em> leaves it. Specifically:
      </p>
      <ul style={ul}>
        <li style={li}>
          Your encrypted mnemonic phrase is stored in{" "}
          <strong>IndexedDB</strong>, encrypted with{" "}
          <strong>AES-GCM</strong> using a key derived from
          your password via <strong>PBKDF2</strong> (100,000
          iterations).
        </li>
        <li style={li}>
          Your derived wallet address and session state are
          stored in{" "}
          <strong>
            <code>chrome.storage.local</code>
          </strong>{" "}
          — local to your device only, <em>never</em> synced
          to any Google account or external server.
        </li>
      </ul>

      <h2 style={h2}>Network Requests</h2>
      <p style={p}>
        The extension connects <em>only</em> to
        Ethereum-compatible <strong>RPC</strong> endpoints,
        solely to read blockchain state and broadcast signed
        transactions. <em>No</em> user-identifying data is
        included in these requests.
      </p>

      <h2 style={h2}>Permissions</h2>
      <p style={p}>
        The extension requests the following browser
        permissions:
      </p>
      <ul style={ul}>
        <li style={li}>
          <strong>storage</strong> — to persist your encrypted
          wallet data locally on your device.
        </li>
      </ul>

      <h2 style={h2}>Your Responsibility</h2>
      <p style={p}>
        Because Ethernauta is a self-custody wallet, you are{" "}
        <em>solely</em> responsible for safeguarding your seed
        phrase and password. We <em>cannot</em> recover lost
        credentials.
      </p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>
        If you have questions about this policy, contact us
        at{" "}
        <a href="mailto:nicolas.accetta@gmail.com">
          nicolas.accetta@gmail.com
        </a>
        .
      </p>
    </div>
  )
}
