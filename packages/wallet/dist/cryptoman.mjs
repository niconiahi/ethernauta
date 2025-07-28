window.cryptoman = {
  sign: async (o, s) => new Promise((n, t) => {
    const a = crypto.randomUUID();
    window.addEventListener(
      "message",
      function d(e) {
        e.data.id === a && (window.removeEventListener("message", d), e.data.error && t(new Error(e.data.error)), e.data.signature && n(e.data.signature));
      }
    );
    const r = {
      type: "CRYPTOMAN_SIGN_TRANSACTION",
      id: a,
      method: o,
      params: s
    };
    window.postMessage(r, "*");
  }),
  connect: async () => new Promise((o, s) => {
    const n = crypto.randomUUID();
    window.addEventListener(
      "message",
      function a(r) {
        r.data.id === n && (window.removeEventListener("message", a), r.data.error && s(new Error(r.data.error)), o());
      }
    );
    const t = {
      type: "CRYPTOMAN_CONNECT",
      id: n
    };
    window.postMessage(t, "*");
  })
};
