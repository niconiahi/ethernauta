<script>
  import { page } from "$app/state";
  import { get_doc_by_slug } from "$lib/docs.js";

  const doc = $derived(get_doc_by_slug(page.params.slug));
  const Doc = $derived(doc?.component);
</script>

{#if doc && Doc}
  <article>
    <p class="crumbs">{doc.section}</p>
    <Doc />
  </article>
{/if}

<style>
  .crumbs {
    margin: 0 0 0.5rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b6b6b;
  }
</style>
