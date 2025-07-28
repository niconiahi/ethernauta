const script = document.createElement("script")
script.src = chrome.runtime.getURL("cryptoman.mjs")
script.onload = () => script.remove()
document.head.appendChild(script)

window.addEventListener("message", (event) => {
  if (event.source !== window) return
  console.log("event.data", event.data)
  if (event.data?.type?.startsWith("CRYPTOMAN_")) {
    chrome.runtime.sendMessage(event.data)
  }
})
