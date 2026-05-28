type PagefindResult = {
  url: string
  sub_results?: { url: string }[]
}
type PagefindUI = {
  triggerSearch: (value: string) => void
}
type PagefindUIOptions = {
  element: HTMLElement
  showSubResults: boolean
  showImages: boolean
  processResult: (result: PagefindResult) => PagefindResult
}
type PagefindUIConstructor = new (
  options: PagefindUIOptions,
) => PagefindUI

// allow-violation: R4-decl-merging
interface Window {
  PagefindUI: PagefindUIConstructor
}
