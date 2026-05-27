const modules = import.meta.glob("$content/**/*.md", { eager: true });

function read_string(record, key) {
  const value = record[key];
  if (typeof value !== "string") {
    throw new Error(`Missing string frontmatter "${key}"`);
  }
  return value;
}

function read_number(record, key) {
  const value = record[key];
  if (typeof value !== "number") {
    throw new Error(`Missing number frontmatter "${key}"`);
  }
  return value;
}

export function get_docs() {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const slug = path.replace(/^.*\/docs\//, "").replace(/\.md$/, "");
      const metadata = mod.metadata ?? {};
      return {
        slug,
        href: `/${slug}`,
        title: read_string(metadata, "title"),
        section: read_string(metadata, "section"),
        section_order: read_number(metadata, "section_order"),
        order: read_number(metadata, "order"),
        component: mod.default,
      };
    })
    .sort((a, b) => {
      if (a.section_order !== b.section_order) {
        return a.section_order - b.section_order;
      }
      return a.order - b.order;
    });
}

export function get_doc_by_slug(slug) {
  return get_docs().find((doc) => doc.slug === slug);
}

export function group_by_section(docs) {
  const groups = new Map();
  for (const doc of docs) {
    const list = groups.get(doc.section) ?? [];
    list.push(doc);
    groups.set(doc.section, list);
  }
  return Array.from(groups.entries()).map(([section, items]) => ({
    section,
    items,
  }));
}
