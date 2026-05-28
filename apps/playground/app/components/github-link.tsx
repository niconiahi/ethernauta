import { ButtonLink } from "./button"

export const REPO_URL = "https://github.com/niconiahi/ethernauta"
const REPO_BLOB = `${REPO_URL}/blob/main/`

export function GithubLink({
  path,
  label = "View on GitHub",
  className,
}: {
  // Path inside the repo (e.g. "apps/playground/.../demo.tsx"). When
  // omitted, links to the repo root — for header / sidebar use.
  path?: string
  label?: string
  className?: string
}) {
  const href = path ? `${REPO_BLOB}${path}` : REPO_URL
  return (
    <ButtonLink
      variant="ghost"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className={className}
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
        style={{ marginRight: 10 }}
      >
        <path
          fill="currentColor"
          d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.02c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.22 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"
        />
      </svg>
      <span style={{ fontSize: 14 }}>{label}</span>
    </ButtonLink>
  )
}
