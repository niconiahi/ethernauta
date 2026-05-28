import "./row.css"

export function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="send-calls-row">
      <span className="send-calls-row-label">
        {label}
      </span>
      <span
        className={
          mono
            ? "send-calls-row-value is-mono"
            : "send-calls-row-value"
        }
      >
        {value}
      </span>
    </div>
  )
}
