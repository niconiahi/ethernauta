const script = document.createElement("script")
script.src = chrome.runtime.getURL("wallet.mjs")
script.onload = () => script.remove()
document.head.appendChild(script)

window.addEventListener("message", (event) => {
  if (event.source !== window) return
  if (event.data?.type?.startsWith("ETHERNAUTA_REQUEST")) {
    console.log("sending request", event.data)
    chrome.runtime.sendMessage(event.data)
  }
})

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type?.startsWith("ETHERNAUTA_RESPONSE")) {
    console.log("receiving response", message)
    window.postMessage(message, "*")
  }
})
