const script = document.createElement("script")
script.src = chrome.runtime.getURL("wallet.mjs")
script.onload = () => script.remove()
document.head.appendChild(script)

window.addEventListener("message", (event) => {
  if (event.source !== window) return
  if (event.data?.type?.startsWith("ETHERNAUTA_REQUEST")) {
    chrome.runtime.sendMessage(event.data)
  }
})

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type?.startsWith("ETHERNAUTA_RESPONSE")) {
    window.postMessage(message, window.location.origin)
  }
})
