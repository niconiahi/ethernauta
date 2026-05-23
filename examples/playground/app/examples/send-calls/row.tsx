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
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "8px 0",
        borderBottom: "1px solid #f0f0f0",
        fontSize: 13,
      }}
    >
      <span style={{ color: "#666", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: mono
            ? "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            : "inherit",
          color: "#1a1a1a",
          textAlign: "right",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}
      >
        {value}
      </span>
    </div>
  )
}
