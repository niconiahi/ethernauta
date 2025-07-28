var h;
// @__NO_SIDE_EFFECTS__
function b(s) {
  return {
    lang: h?.lang,
    message: s?.message,
    abortEarly: h?.abortEarly,
    abortPipeEarly: h?.abortPipeEarly
  };
}
var _;
// @__NO_SIDE_EFFECTS__
function j(s) {
  return _?.get(s);
}
var x;
// @__NO_SIDE_EFFECTS__
function P(s) {
  return x?.get(s);
}
var $;
// @__NO_SIDE_EFFECTS__
function A(s, t) {
  return $?.get(s)?.get(t);
}
// @__NO_SIDE_EFFECTS__
function d(s) {
  const t = typeof s;
  return t === "string" ? `"${s}"` : t === "number" || t === "bigint" || t === "boolean" ? `${s}` : t === "object" || t === "function" ? (s && Object.getPrototypeOf(s)?.constructor?.name) ?? "null" : t;
}
function p(s, t, e, i, n) {
  const r = n && "input" in n ? n.input : e.value, u = n?.expected ?? s.expects ?? null, l = n?.received ?? /* @__PURE__ */ d(r), a = {
    kind: s.kind,
    type: s.type,
    input: r,
    expected: u,
    received: l,
    message: `Invalid ${t}: ${u ? `Expected ${u} but r` : "R"}eceived ${l}`,
    requirement: s.requirement,
    path: n?.path,
    issues: n?.issues,
    lang: i.lang,
    abortEarly: i.abortEarly,
    abortPipeEarly: i.abortPipeEarly
  }, o = s.kind === "schema", c = n?.message ?? s.message ?? /* @__PURE__ */ A(s.reference, a.lang) ?? (o ? /* @__PURE__ */ P(a.lang) : null) ?? i.message ?? /* @__PURE__ */ j(a.lang);
  c !== void 0 && (a.message = typeof c == "function" ? (
    // @ts-expect-error
    c(a)
  ) : c), o && (e.typed = !1), e.issues ? e.issues.push(a) : e.issues = [a];
}
// @__NO_SIDE_EFFECTS__
function f(s) {
  return {
    version: 1,
    vendor: "valibot",
    validate(t) {
      return s["~run"]({ value: t }, /* @__PURE__ */ b());
    }
  };
}
// @__NO_SIDE_EFFECTS__
function C(s, t) {
  const e = [...new Set(s)];
  return e.length > 1 ? `(${e.join(` ${t} `)})` : e[0] ?? "never";
}
var M = class extends Error {
  /**
   * Creates a Valibot error with useful information.
   *
   * @param issues The error issues.
   */
  constructor(s) {
    super(s[0].message), this.name = "ValiError", this.issues = s;
  }
};
// @__NO_SIDE_EFFECTS__
function N(s, t, e) {
  return typeof s.fallback == "function" ? (
    // @ts-expect-error
    s.fallback(t, e)
  ) : (
    // @ts-expect-error
    s.fallback
  );
}
// @__NO_SIDE_EFFECTS__
function O(s, t, e) {
  return typeof s.default == "function" ? (
    // @ts-expect-error
    s.default(t, e)
  ) : (
    // @ts-expect-error
    s.default
  );
}
// @__NO_SIDE_EFFECTS__
function k(s, t) {
  return {
    kind: "schema",
    type: "array",
    reference: k,
    expects: "Array",
    async: !1,
    item: s,
    message: t,
    get "~standard"() {
      return /* @__PURE__ */ f(this);
    },
    "~run"(e, i) {
      const n = e.value;
      if (Array.isArray(n)) {
        e.typed = !0, e.value = [];
        for (let r = 0; r < n.length; r++) {
          const u = n[r], l = this.item["~run"]({ value: u }, i);
          if (l.issues) {
            const a = {
              type: "array",
              origin: "value",
              input: n,
              key: r,
              value: u
            };
            for (const o of l.issues)
              o.path ? o.path.unshift(a) : o.path = [a], e.issues?.push(o);
            if (e.issues || (e.issues = l.issues), i.abortEarly) {
              e.typed = !1;
              break;
            }
          }
          l.typed || (e.typed = !1), e.value.push(l.value);
        }
      } else
        p(this, "type", e, i);
      return e;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function g(s, t) {
  return {
    kind: "schema",
    type: "literal",
    reference: g,
    expects: /* @__PURE__ */ d(s),
    async: !1,
    literal: s,
    message: t,
    get "~standard"() {
      return /* @__PURE__ */ f(this);
    },
    "~run"(e, i) {
      return e.value === this.literal ? e.typed = !0 : p(this, "type", e, i), e;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function v(s, t) {
  return {
    kind: "schema",
    type: "object",
    reference: v,
    expects: "Object",
    async: !1,
    entries: s,
    message: t,
    get "~standard"() {
      return /* @__PURE__ */ f(this);
    },
    "~run"(e, i) {
      const n = e.value;
      if (n && typeof n == "object") {
        e.typed = !0, e.value = {};
        for (const r in this.entries) {
          const u = this.entries[r];
          if (r in n || (u.type === "exact_optional" || u.type === "optional" || u.type === "nullish") && // @ts-expect-error
          u.default !== void 0) {
            const l = r in n ? (
              // @ts-expect-error
              n[r]
            ) : /* @__PURE__ */ O(u), a = u["~run"]({ value: l }, i);
            if (a.issues) {
              const o = {
                type: "object",
                origin: "value",
                input: n,
                key: r,
                value: l
              };
              for (const c of a.issues)
                c.path ? c.path.unshift(o) : c.path = [o], e.issues?.push(c);
              if (e.issues || (e.issues = a.issues), i.abortEarly) {
                e.typed = !1;
                break;
              }
            }
            a.typed || (e.typed = !1), e.value[r] = a.value;
          } else if (u.fallback !== void 0)
            e.value[r] = /* @__PURE__ */ N(u);
          else if (u.type !== "exact_optional" && u.type !== "optional" && u.type !== "nullish" && (p(this, "key", e, i, {
            input: void 0,
            expected: `"${r}"`,
            path: [
              {
                type: "object",
                origin: "key",
                input: n,
                key: r,
                // @ts-expect-error
                value: n[r]
              }
            ]
          }), i.abortEarly))
            break;
        }
      } else
        p(this, "type", e, i);
      return e;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function y(s) {
  return {
    kind: "schema",
    type: "string",
    reference: y,
    expects: "string",
    async: !1,
    message: s,
    get "~standard"() {
      return /* @__PURE__ */ f(this);
    },
    "~run"(t, e) {
      return typeof t.value == "string" ? t.typed = !0 : p(this, "type", t, e), t;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function m(s) {
  let t;
  if (s)
    for (const e of s)
      t ? t.push(...e.issues) : t = e.issues;
  return t;
}
// @__NO_SIDE_EFFECTS__
function E(s, t) {
  return {
    kind: "schema",
    type: "union",
    reference: E,
    expects: /* @__PURE__ */ C(
      s.map((e) => e.expects),
      "|"
    ),
    async: !1,
    options: s,
    message: t,
    get "~standard"() {
      return /* @__PURE__ */ f(this);
    },
    "~run"(e, i) {
      let n, r, u;
      for (const l of this.options) {
        const a = l["~run"]({ value: e.value }, i);
        if (a.typed)
          if (a.issues)
            r ? r.push(a) : r = [a];
          else {
            n = a;
            break;
          }
        else
          u ? u.push(a) : u = [a];
      }
      if (n)
        return n;
      if (r) {
        if (r.length === 1)
          return r[0];
        p(this, "type", e, i, {
          issues: /* @__PURE__ */ m(r)
        }), e.typed = !0;
      } else {
        if (u?.length === 1)
          return u[0];
        p(this, "type", e, i, {
          issues: /* @__PURE__ */ m(u)
        });
      }
      return e;
    }
  };
}
// @__NO_SIDE_EFFECTS__
function S() {
  return {
    kind: "schema",
    type: "unknown",
    reference: S,
    expects: "unknown",
    async: !1,
    get "~standard"() {
      return /* @__PURE__ */ f(this);
    },
    "~run"(s) {
      return s.typed = !0, s;
    }
  };
}
function R(s, t, e) {
  const i = s["~run"]({ value: t }, /* @__PURE__ */ b(e));
  if (i.issues)
    throw new M(i.issues);
  return i.value;
}
const q = /* @__PURE__ */ v({
  id: /* @__PURE__ */ y(),
  type: /* @__PURE__ */ g("CRYPTOMAN_SIGN_TRANSACTION"),
  method: /* @__PURE__ */ y(),
  params: /* @__PURE__ */ k(/* @__PURE__ */ S())
}), D = /* @__PURE__ */ v({
  id: /* @__PURE__ */ y(),
  type: /* @__PURE__ */ g("CRYPTOMAN_CONNECT")
}), I = /* @__PURE__ */ E([
  q,
  D
]);
chrome.runtime.onMessage.addListener(
  (s, t, e) => {
    if (R(I, s).type.startsWith("CRYPTOMAN_"))
      return chrome.action.openPopup().then(() => {
        chrome.runtime.sendMessage(s);
      }).catch((n) => {
        e({ error: n.message });
      }), !0;
  }
);
