export default function () {
  return (
    <>
      <p>
        <button
          type="button"
          onClick={() => {
            console.log("clicking connect")
            window.cryptoman.connect()
          }}
        >
          connect
        </button>
      </p>
      <p>
        <button
          type="button"
          onClick={() => {
            console.log("clicking send transfer")
            const method = "transfer"
            const params = ["0x", "1x", 3]
            window.cryptoman.sign(method, params)
          }}
        >
          send transfer
        </button>
      </p>
    </>
  )
}
