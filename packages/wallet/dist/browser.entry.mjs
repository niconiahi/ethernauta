const t = document.createElement("script");
t.src = chrome.runtime.getURL("cryptoman.mjs");
t.onload = () => t.remove();
document.head.appendChild(t);
window.addEventListener("message", (e) => {
  e.source === window && (console.log("event.data", e.data), e.data?.type?.startsWith("CRYPTOMAN_") && chrome.runtime.sendMessage(e.data));
});
