import type { Component } from "svelte"
import {
  type InferOutput,
  custom,
  number,
  object,
  parse,
  string,
} from "valibot"

const FrontmatterSchema = object({
  title: string(),
  section: string(),
  section_order: number(),
  order: number(),
})
type Frontmatter = InferOutput<typeof FrontmatterSchema>

const DocModuleSchema = object({
  metadata: FrontmatterSchema,
  default: custom<Component>(
    (value) => typeof value === "function",
    "svelte component",
  ),
})
type DocModule = InferOutput<typeof DocModuleSchema>

export type Doc = Frontmatter & {
  slug: string
  href: string
  component: Component
}

const modules: Record<string, unknown> = import.meta.glob(
  "$content/**/*.md",
  { eager: true },
)

export function get_docs(): Doc[] {
  return Object.entries(modules)
    .map(([path, _mod]): Doc => {
      const mod: DocModule = parse(DocModuleSchema, _mod)
      const slug = path
        .replace(/^.*\/docs\//, "")
        .replace(/\.md$/, "")
      return {
        slug,
        href: `/${slug}`,
        title: mod.metadata.title,
        section: mod.metadata.section,
        section_order: mod.metadata.section_order,
        order: mod.metadata.order,
        component: mod.default,
      }
    })
    .sort((a, b) => {
      if (a.section_order !== b.section_order) {
        return a.section_order - b.section_order
      }
      return a.order - b.order
    })
}

export function get_doc_by_slug(
  slug: string | undefined,
): Doc | undefined {
  if (!slug) return undefined
  return get_docs().find((doc) => doc.slug === slug)
}

export type DocSection = {
  section: string
  items: Doc[]
}

export function group_by_section(docs: Doc[]): DocSection[] {
  const groups = new Map<string, Doc[]>()
  for (const doc of docs) {
    const list = groups.get(doc.section) ?? []
    list.push(doc)
    groups.set(doc.section, list)
  }
  return Array.from(groups.entries()).map(
    ([section, items]) => ({ section, items }),
  )
}
