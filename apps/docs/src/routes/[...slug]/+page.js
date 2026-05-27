import { error } from "@sveltejs/kit"
import { get_doc_by_slug, get_docs } from "$lib/docs.js"

export const prerender = true

export function entries() {
  return get_docs().map((doc) => ({ slug: doc.slug }))
}

export function load({ params }) {
  const doc = get_doc_by_slug(params.slug)
  if (!doc) {
    throw error(404, `Doc not found: ${params.slug}`)
  }
  return {
    slug: doc.slug,
    title: doc.title,
    section: doc.section,
  }
}
