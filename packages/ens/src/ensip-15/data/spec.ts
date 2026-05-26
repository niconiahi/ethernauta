// ENSIP-15 spec metadata.
//
// The full spec data (script groups, confusables, wholes, NSM rules)
// used to live here as TypeScript const literals (~4.5 MB raw). The
// algorithm now delegates to `@adraffy/ens-normalize`, which ships
// the same data in a packed-binary encoding. The version constants
// below stay for callers that want to surface the bundled spec
// version. They reflect the adraffy build we depend on; update
// alongside any `@adraffy/ens-normalize` version bump.

export const SPEC_CREATED =
  "2025-09-14T17:56:22.939Z" as const
export const SPEC_UNICODE =
  "17.0.0 (2025-09-10T16:58:18.331Z)" as const
