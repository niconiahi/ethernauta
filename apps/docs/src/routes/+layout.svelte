<script>
  import { page } from "$app/state";
  import { get_docs, group_by_section } from "$lib/docs.js";
  import Search from "$lib/Search.svelte";
  import "@fontsource/fira-mono/400.css";
  import "@fontsource/fira-mono/500.css";
  import "@fontsource/fira-mono/700.css";
  import "$lib/tokens.css";

  let { children } = $props();

  const sections = group_by_section(get_docs());
</script>

<div class="shell">
  <aside>
    <a class="brand" href="/">Ethernauta</a>
    <Search />
    <nav>
      {#each sections as section (section.section)}
        <section>
          <h3>{section.section}</h3>
          <ul>
            {#each section.items as doc (doc.slug)}
              <li>
                <a
                  href={doc.href}
                  class:active={page.url.pathname === doc.href}
                >
                  {doc.title}
                </a>
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    </nav>
  </aside>
  <main>
    {@render children()}
  </main>
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    font-family: var(--font-sans);
    color: var(--text);
    background: var(--bg);
  }

  :global(*) {
    box-sizing: border-box;
  }

  .shell {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
  }

  aside {
    border-right: 1px solid var(--border);
    padding: 1.5rem 1rem;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    background: var(--surface);
  }

  .brand {
    display: block;
    font-weight: 600;
    font-size: 1.1rem;
    color: inherit;
    text-decoration: none;
    margin-bottom: 1.5rem;
  }

  nav section {
    margin-bottom: 1.5rem;
  }

  nav h3 {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin: 0 0 0.5rem;
  }

  nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  nav li {
    margin: 0;
  }

  nav a {
    display: block;
    padding: 0.35rem 0.5rem;
    border-radius: 6px;
    color: var(--text);
    text-decoration: none;
    font-size: 0.9rem;
  }

  nav a:hover {
    background: var(--link-hover-bg);
  }

  nav a.active {
    background: var(--active-bg);
    color: var(--active-text);
  }

  main {
    padding: 2.5rem 3rem;
    max-width: 760px;
  }

  :global(main h1) {
    margin-top: 0;
  }

  :global(main pre) {
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.85em;
    line-height: 1.55;
  }

  :global(main code) {
    font-family: var(--font-mono);
    font-size: 0.9em;
  }

  :global(main :not(pre) > code) {
    background: var(--code-bg);
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
  }
</style>
