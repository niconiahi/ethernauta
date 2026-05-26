<script>
  import { get_docs } from "$lib/docs.js";

  const docs = get_docs();
  const first = docs[0];
</script>

<h1>Ethernauta docs</h1>
<p>
  This is a placeholder home page. Jump into the docs:
</p>
{#if first}
  <p><a href={first.href}>Start with “{first.title}” →</a></p>
{/if}

<h2>All pages</h2>
<ul>
  {#each docs as doc (doc.slug)}
    <li>
      <a href={doc.href}>{doc.section} / {doc.title}</a>
    </li>
  {/each}
</ul>
