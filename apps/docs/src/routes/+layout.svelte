<script>
import { page } from "$app/state"
import { get_docs, group_by_section } from "$lib/docs.js"
import Search from "$lib/Search.svelte"
import "@fontsource/fira-mono/400.css"
import "@fontsource/fira-mono/500.css"
import "@fontsource/fira-mono/700.css"
import "$lib/tokens.css"
import "$lib/text_styles.css"
import "$lib/button.css"

let { children } = $props()

const sections = group_by_section(get_docs())
</script>

<div class="shell">
  <aside>
    <a class="brand" href="/" aria-label="Ethernauta">
      <img src="/logo.svg" alt="" width="56" height="56" />
      <span>Ethernauta</span>
    </a>
    <Search />
    <a
      class="button ghost github-link"
      href="https://github.com/niconiahi/ethernauta"
      target="_blank"
      rel="noreferrer noopener"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.02c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.22 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"
        />
      </svg>
      <span>Star on GitHub</span>
    </a>
    <nav>
      {#each sections as section (section.section)}
        <section>
          <h3 class="body-sm-medium">{section.section}</h3>
          <ul>
            {#each section.items as doc (doc.slug)}
              <li>
                <a
                  href={doc.href}
                  class="body-md-regular"
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
    color: var(--text);
    background: var(--bg);
    font-family: var(--font-family-body);
  }

  :global(*) {
    box-sizing: border-box;
  }

  .shell {
    display: grid;
    grid-template-columns: auto 1fr;
    min-height: 100vh;
  }

  aside {
    border-right: 1px solid var(--border);
    padding: 0.75rem 1rem 1.5rem;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    background: var(--surface);
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 0.75rem;
    color: var(--text);
    text-decoration: none;
    line-height: 1;
  }

  .brand img {
    display: block;
    background: var(--neutral-950);
    border-radius: 10px;
    padding: 6px;
  }

  .github-link {
    width: 100%;
    height: 42px;
    gap: 10px;
    margin: 0.75rem 0 1.5rem;
    border: 1px solid var(--border);
    color: var(--text);
  }

  .brand span {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  nav section {
    margin-bottom: 1.5rem;
  }

  nav h3 {
    text-transform: uppercase;
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
    line-height: 1.55;
  }

  :global(main code) {
    font-family: var(--font-mono);
    font-size: 1em;
  }

  :global(main :not(pre) > code) {
    background: var(--code-bg);
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
  }
</style>
