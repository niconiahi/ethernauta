<script>
  import { get_docs } from "$lib/docs.js";

  const docs = get_docs();
</script>

<section class="hero">
  <h1>Ethernauta</h1>
  <p class="tagline">
    Primitive-first TypeScript for Ethereum. Every wallet operation, also
    available without one.
  </p>
  <div class="cta">
    <a class="primary" href="/getting-started/introduction">Introduction →</a>
    <a class="secondary" href="/getting-started/installation">Install</a>
  </div>
</section>

<section class="pitch">
  <div class="card">
    <h3>Two consumer paths</h3>
    <p>
      Every signable operation can go through a wallet
      (<code>eth_sendTransaction</code>) <strong>or</strong> through a
      primitive pair the dapp composes itself
      (<code>eth_signTransaction</code> + <code>eth_sendRawTransaction</code>).
      The library refuses to pick for you.
    </p>
    <a href="/concepts/two-paths">Read about the paths →</a>
  </div>

  <div class="card">
    <h3>Four resolver shapes</h3>
    <p>
      <code>Readable&lt;T&gt;</code>, <code>Writable&lt;T&gt;</code>,
      <code>Signable&lt;T&gt;</code>, <code>Callable&lt;T&gt;</code>. Three
      of them work without a wallet at all.
    </p>
    <a href="/concepts/resolver-shapes">Read about the shapes →</a>
  </div>

  <div class="card">
    <h3>Standards are folders</h3>
    <p>
      Every EIP / ERC lives under <code>packages/eip/src/&lt;n&gt;/</code> or
      <code>packages/erc/src/&lt;n&gt;/</code>. Adding a new one is a
      folder-shaped operation. No hosted infra, no server coordination.
    </p>
    <a href="/concepts/folder-shaped-standards">Read about the shape →</a>
  </div>

  <div class="card">
    <h3>Schemas are the types</h3>
    <p>
      Valibot schemas first; <code>v.InferOutput</code> second. Every wire
      boundary validates with <code>parse</code>. No
      hand-rolled <code>{"type X = { … }"}</code>.
    </p>
    <a href="/concepts/schemas-are-types">Read about the rule →</a>
  </div>
</section>

<section class="all">
  <h2>Browse everything</h2>
  <ul class="grid">
    {#each docs as doc (doc.slug)}
      <li>
        <a href={doc.href}>
          <span class="section">{doc.section}</span>
          <span class="title">{doc.title}</span>
        </a>
      </li>
    {/each}
  </ul>
</section>

<style>
  .hero {
    padding: 2rem 0 3rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2.5rem;
  }

  .hero h1 {
    font-size: 2.75rem;
    margin: 0 0 0.5rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .tagline {
    font-size: 1.15rem;
    color: var(--text-muted);
    max-width: 38rem;
    margin: 0 0 1.75rem;
  }

  .cta {
    display: flex;
    gap: 0.75rem;
  }

  .cta a {
    display: inline-block;
    padding: 0.55rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .cta .primary {
    background: var(--active-bg);
    color: var(--active-text);
  }

  .cta .secondary {
    border: 1px solid var(--border);
    color: var(--text);
  }

  .pitch {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 720px) {
    .pitch {
      grid-template-columns: 1fr;
    }
  }

  .card {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem 1.25rem 1rem;
    background: var(--surface);
  }

  .card h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
  }

  .card p {
    margin: 0 0 0.75rem;
    color: var(--text-muted);
    font-size: 0.9rem;
    line-height: 1.55;
  }

  .card a {
    font-size: 0.85rem;
    color: var(--text);
    text-decoration: none;
  }

  .card a:hover {
    text-decoration: underline;
  }

  .card code {
    background: var(--code-bg);
    padding: 0.05rem 0.3rem;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.85em;
  }

  .all h2 {
    margin: 0 0 1rem;
    font-size: 1.1rem;
  }

  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem;
  }

  @media (max-width: 720px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  .grid a {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    padding: 0.5rem 0.65rem;
    border-radius: 6px;
    text-decoration: none;
    color: var(--text);
  }

  .grid a:hover {
    background: var(--link-hover-bg);
  }

  .grid .section {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
  }

  .grid .title {
    font-size: 0.92rem;
  }
</style>
