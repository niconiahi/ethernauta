<script lang="ts">
import { onMount } from "svelte"
import { array, parse, safeParse, string } from "valibot"

const STORAGE_KEY = "ethernauta-docs-recents"
const MAX_RECENTS = 5

const RecentsSchema = array(string())

let dialog: HTMLDialogElement
let container: HTMLDivElement
let unavailable = $state(false)
let initialized = false
let pagefind_ui: PagefindUI | null = null
let query = $state("")
let recents = $state<string[]>([])

function strip_html(url: string): string {
  return url.replace(/\.html(#|$)/, "$1")
}

function load_recents(): string[] {
  if (typeof localStorage === "undefined") {
    return []
  }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }
  try {
    const result = safeParse(RecentsSchema, JSON.parse(raw))
    return result.success ? result.output : []
  } catch {
    return []
  }
}

function save_recents(items: string[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(parse(RecentsSchema, items)),
    )
  } catch {
    // quota exceeded or storage disabled
  }
}

function add_recent(value: string): void {
  const trimmed = value.trim()
  if (!trimmed) {
    return
  }
  const next = [
    trimmed,
    ...recents.filter((r) => r !== trimmed),
  ].slice(0, MAX_RECENTS)
  recents = next
  save_recents(next)
}

function remove_recent(value: string): void {
  const next = recents.filter((r) => r !== value)
  recents = next
  save_recents(next)
}

async function ensure_pagefind(): Promise<void> {
  if (initialized) {
    return
  }
  initialized = true
  const ui_js = "/pagefind/pagefind-ui.js"
  const ui_css = "/pagefind/pagefind-ui.css"
  try {
    const head_response = await fetch(ui_js, {
      method: "HEAD",
    })
    if (!head_response.ok) {
      unavailable = true
      return
    }
    const css = document.createElement("link")
    css.rel = "stylesheet"
    css.href = ui_css
    document.head.appendChild(css)
    await import(/* @vite-ignore */ ui_js)
    pagefind_ui = new window.PagefindUI({
      element: container,
      showSubResults: true,
      showImages: false,
      processResult: (result) => {
        result.url = strip_html(result.url)
        if (result.sub_results) {
          for (const sub of result.sub_results) {
            sub.url = strip_html(sub.url)
          }
        }
        return result
      },
    })
  } catch {
    unavailable = true
  }
}

async function open(): Promise<void> {
  await ensure_pagefind()
  recents = load_recents()
  dialog.showModal()
  requestAnimationFrame(() => {
    const input = dialog.querySelector("input")
    input?.focus()
  })
}

function handle_dialog_click(event: MouseEvent): void {
  if (event.target === dialog) {
    dialog.close()
    return
  }
  if (!(event.target instanceof Element)) {
    return
  }
  const link = event.target.closest("a")
  if (link) {
    add_recent(query)
    dialog.close()
  }
}

function handle_dialog_input(event: Event): void {
  if (event.target instanceof HTMLInputElement) {
    query = event.target.value
  }
}

function handle_dialog_close(): void {
  query = ""
  if (pagefind_ui) {
    pagefind_ui.triggerSearch("")
  }
}

function select_recent(value: string): void {
  if (!pagefind_ui) {
    return
  }
  pagefind_ui.triggerSearch(value)
  query = value
  requestAnimationFrame(() => {
    dialog.querySelector("input")?.focus()
  })
}

function delete_recent(event: MouseEvent, value: string): void {
  event.stopPropagation()
  remove_recent(value)
}

onMount(() => {
  function handle_keydown(event: KeyboardEvent): void {
    const is_open = dialog?.open
    const is_shortcut =
      (event.metaKey || event.ctrlKey) &&
      event.key.toLowerCase() === "k"
    if (is_shortcut) {
      event.preventDefault()
      if (is_open) {
        dialog.close()
      } else {
        open()
      }
    }
  }
  window.addEventListener("keydown", handle_keydown)
  return () => {
    window.removeEventListener("keydown", handle_keydown)
  }
})
</script>

<button class="trigger body-md-regular" type="button" onclick={open}>
  <span>Search</span>
  <kbd>⌘K</kbd>
</button>

<dialog
  bind:this={dialog}
  onclick={handle_dialog_click}
  oninput={handle_dialog_input}
  onclose={handle_dialog_close}
>
  <div class="panel">
    <div class="search" bind:this={container}>
      {#if unavailable}
        <p class="hint body-md-regular">
          Search is only available after <code>pnpm build</code>.
        </p>
      {/if}
    </div>

    {#if !query && recents.length > 0}
      <section class="recents">
        <h3 class="body-sm-medium">Recent searches</h3>
        <ul>
          {#each recents as recent (recent)}
            <li>
              <button
                type="button"
                class="recent"
                onclick={() => select_recent(recent)}
              >
                {recent}
              </button>
              <button
                type="button"
                class="delete"
                aria-label="Remove {recent}"
                onclick={(event) => delete_recent(event, recent)}
              >
                ×
              </button>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  </div>
</dialog>

<style>
  .trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    background: var(--surface-strong);
    color: var(--text-muted);
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 1.25rem;
  }

  .trigger:hover {
    color: var(--text);
    border-color: var(--neutral-500);
  }

  .trigger kbd {
    font-family: var(--font-mono);
    color: var(--text-muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.05rem 0.35rem;
  }

  dialog {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    border-radius: 12px;
    padding: 0;
    width: min(640px, calc(100vw - 2rem));
    max-height: 70vh;
    margin: 6vh auto auto;
    overflow: hidden;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(2px);
  }

  .panel {
    padding: 1rem;
    max-height: 70vh;
    overflow-y: auto;
  }

  .hint {
    margin: 0;
    color: var(--text-muted);
  }

  .hint code {
    font-family: var(--font-mono);
    background: var(--surface-strong);
    padding: 0.05rem 0.3rem;
    border-radius: 4px;
  }

  .recents {
    margin-top: 0.75rem;
    border-top: 1px solid var(--border);
    padding-top: 0.75rem;
  }

  .recents h3 {
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0 0 0.5rem;
    padding: 0 0.5rem;
  }

  .recents ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .recents li {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .recents .recent {
    flex: 1;
    height: 2.5rem;
    display: flex;
    align-items: center;
    text-align: left;
    background: transparent;
    border: 0;
    padding: 0 0.75rem;
    color: var(--text);
    font: inherit;
    cursor: pointer;
    border-radius: 8px;
  }

  .recents .recent:hover {
    background: var(--surface-strong);
  }

  .recents .delete {
    flex: 0 0 auto;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0;
    color: var(--text-muted);
    cursor: pointer;
    font: inherit;
    font-size: 1rem;
    line-height: 1;
    border-radius: 8px;
  }

  .recents .delete:hover {
    background: var(--surface-strong);
    color: var(--text);
  }

  /* Re-skin the default Pagefind UI to match our tokens. */
  :global(.search .pagefind-ui) {
    --pagefind-ui-primary: var(--text);
    --pagefind-ui-text: var(--text);
    --pagefind-ui-background: var(--surface);
    --pagefind-ui-border: var(--border);
    --pagefind-ui-tag: var(--surface-strong);
    --pagefind-ui-border-width: 1px;
    --pagefind-ui-border-radius: 6px;
    --pagefind-ui-image-border-radius: 6px;
    --pagefind-ui-image-box-ratio: 3 / 2;
    --pagefind-ui-font: var(--font-sans);
  }

  /* Make the whole result row clickable + hoverable. */
  :global(.search .pagefind-ui__result) {
    position: relative;
    padding: 0.75rem 0.5rem;
    border-radius: 8px;
    border: 0;
    transition: background-color 0.1s ease;
  }

  :global(.search .pagefind-ui__result:hover) {
    background: var(--surface-strong);
  }

  :global(.search .pagefind-ui__result-link) {
    text-decoration: none;
  }

  :global(.search .pagefind-ui__result-link::after) {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }
</style>
