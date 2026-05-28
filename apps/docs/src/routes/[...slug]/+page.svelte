<script>
import { page } from "$app/state"
import { get_doc_by_slug } from "$lib/docs.js"

const doc = $derived(get_doc_by_slug(page.params.slug))
const Doc = $derived(doc?.component)
const edit_url = $derived(
  doc
    ? `https://github.com/niconiahi/ethernauta/edit/main/docs/${doc.slug}.md`
    : "",
)
</script>

{#if doc && Doc}
  <article>
    <p class="crumbs body-sm-medium">{doc.section}</p>
    <Doc />
    <footer class="edit-footer">
      <a
        href={edit_url}
        target="_blank"
        rel="noreferrer noopener"
        class="edit-link body-sm-medium"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.02c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.22 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"
          />
        </svg>
        Edit this page on GitHub
      </a>
    </footer>
  </article>
{/if}

<style>
  .crumbs {
    margin: 0 0 0.5rem;
    text-transform: uppercase;
    color: #6b6b6b;
  }

  .edit-footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .edit-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted);
    text-decoration: none;
  }

  .edit-link:hover {
    color: var(--text);
  }
</style>
