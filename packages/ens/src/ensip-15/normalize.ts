// https://docs.ens.domains/ensip/15
//
// ENSIP-15 name normalization. Delegates to `@adraffy/ens-normalize`
// (the reference implementation maintained alongside the ENS spec).
//
// We re-export only the two operations we expose at the package
// boundary: `ens_normalize` for canonicalization and `ens_beautify`
// for display. Adraffy ships the same algorithm in ~80 KB gzipped
// by storing the spec tables as packed binary instead of as JS
// const literals; this swap reduces our `@ethernauta/ens` bundle
// from ~5 MB to ~80 KB without any API change for these two
// functions.

export {
  ens_beautify,
  ens_normalize,
} from "@adraffy/ens-normalize"
