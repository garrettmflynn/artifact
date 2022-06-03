/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2 = window.ShadowRoot && (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
      e$3 = Symbol(),
      n$4 = new Map();

class s$3 {
  constructor(t, n) {
    if (this._$cssResult$ = !0, n !== e$3) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t;
  }

  get styleSheet() {
    let e = n$4.get(this.cssText);
    return t$2 && void 0 === e && (n$4.set(this.cssText, e = new CSSStyleSheet()), e.replaceSync(this.cssText)), e;
  }

  toString() {
    return this.cssText;
  }

}

const o$4 = t => new s$3("string" == typeof t ? t : t + "", e$3),
      r$2 = (t, ...n) => {
  const o = 1 === t.length ? t[0] : n.reduce((e, n, s) => e + (t => {
    if (!0 === t._$cssResult$) return t.cssText;
    if ("number" == typeof t) return t;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[s + 1], t[0]);
  return new s$3(o, e$3);
},
      i$3 = (e, n) => {
  t$2 ? e.adoptedStyleSheets = n.map(t => t instanceof CSSStyleSheet ? t : t.styleSheet) : n.forEach(t => {
    const n = document.createElement("style"),
          s = window.litNonce;
    void 0 !== s && n.setAttribute("nonce", s), n.textContent = t.cssText, e.appendChild(n);
  });
},
      S$1 = t$2 ? t => t : t => t instanceof CSSStyleSheet ? (t => {
  let e = "";

  for (const n of t.cssRules) e += n.cssText;

  return o$4(e);
})(t) : t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

var s$2;

const e$2 = window.trustedTypes,
      r$1 = e$2 ? e$2.emptyScript : "",
      h$1 = window.reactiveElementPolyfillSupport,
      o$3 = {
  toAttribute(t, i) {
    switch (i) {
      case Boolean:
        t = t ? r$1 : null;
        break;

      case Object:
      case Array:
        t = null == t ? t : JSON.stringify(t);
    }

    return t;
  },

  fromAttribute(t, i) {
    let s = t;

    switch (i) {
      case Boolean:
        s = null !== t;
        break;

      case Number:
        s = null === t ? null : Number(t);
        break;

      case Object:
      case Array:
        try {
          s = JSON.parse(t);
        } catch (t) {
          s = null;
        }

    }

    return s;
  }

},
      n$3 = (t, i) => i !== t && (i == i || t == t),
      l$2 = {
  attribute: !0,
  type: String,
  converter: o$3,
  reflect: !1,
  hasChanged: n$3
};

class a$1 extends HTMLElement {
  constructor() {
    super(), this._$Et = new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$Ei = null, this.o();
  }

  static addInitializer(t) {
    var i;
    null !== (i = this.l) && void 0 !== i || (this.l = []), this.l.push(t);
  }

  static get observedAttributes() {
    this.finalize();
    const t = [];
    return this.elementProperties.forEach((i, s) => {
      const e = this._$Eh(s, i);

      void 0 !== e && (this._$Eu.set(e, s), t.push(e));
    }), t;
  }

  static createProperty(t, i = l$2) {
    if (i.state && (i.attribute = !1), this.finalize(), this.elementProperties.set(t, i), !i.noAccessor && !this.prototype.hasOwnProperty(t)) {
      const s = "symbol" == typeof t ? Symbol() : "__" + t,
            e = this.getPropertyDescriptor(t, s, i);
      void 0 !== e && Object.defineProperty(this.prototype, t, e);
    }
  }

  static getPropertyDescriptor(t, i, s) {
    return {
      get() {
        return this[i];
      },

      set(e) {
        const r = this[t];
        this[i] = e, this.requestUpdate(t, r, s);
      },

      configurable: !0,
      enumerable: !0
    };
  }

  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || l$2;
  }

  static finalize() {
    if (this.hasOwnProperty("finalized")) return !1;
    this.finalized = !0;
    const t = Object.getPrototypeOf(this);

    if (t.finalize(), this.elementProperties = new Map(t.elementProperties), this._$Eu = new Map(), this.hasOwnProperty("properties")) {
      const t = this.properties,
            i = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];

      for (const s of i) this.createProperty(s, t[s]);
    }

    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }

  static finalizeStyles(i) {
    const s = [];

    if (Array.isArray(i)) {
      const e = new Set(i.flat(1 / 0).reverse());

      for (const i of e) s.unshift(S$1(i));
    } else void 0 !== i && s.push(S$1(i));

    return s;
  }

  static _$Eh(t, i) {
    const s = i.attribute;
    return !1 === s ? void 0 : "string" == typeof s ? s : "string" == typeof t ? t.toLowerCase() : void 0;
  }

  o() {
    var t;
    this._$Ep = new Promise(t => this.enableUpdating = t), this._$AL = new Map(), this._$Em(), this.requestUpdate(), null === (t = this.constructor.l) || void 0 === t || t.forEach(t => t(this));
  }

  addController(t) {
    var i, s;
    (null !== (i = this._$Eg) && void 0 !== i ? i : this._$Eg = []).push(t), void 0 !== this.renderRoot && this.isConnected && (null === (s = t.hostConnected) || void 0 === s || s.call(t));
  }

  removeController(t) {
    var i;
    null === (i = this._$Eg) || void 0 === i || i.splice(this._$Eg.indexOf(t) >>> 0, 1);
  }

  _$Em() {
    this.constructor.elementProperties.forEach((t, i) => {
      this.hasOwnProperty(i) && (this._$Et.set(i, this[i]), delete this[i]);
    });
  }

  createRenderRoot() {
    var t;
    const s = null !== (t = this.shadowRoot) && void 0 !== t ? t : this.attachShadow(this.constructor.shadowRootOptions);
    return i$3(s, this.constructor.elementStyles), s;
  }

  connectedCallback() {
    var t;
    void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), null === (t = this._$Eg) || void 0 === t || t.forEach(t => {
      var i;
      return null === (i = t.hostConnected) || void 0 === i ? void 0 : i.call(t);
    });
  }

  enableUpdating(t) {}

  disconnectedCallback() {
    var t;
    null === (t = this._$Eg) || void 0 === t || t.forEach(t => {
      var i;
      return null === (i = t.hostDisconnected) || void 0 === i ? void 0 : i.call(t);
    });
  }

  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }

  _$ES(t, i, s = l$2) {
    var e, r;

    const h = this.constructor._$Eh(t, s);

    if (void 0 !== h && !0 === s.reflect) {
      const n = (null !== (r = null === (e = s.converter) || void 0 === e ? void 0 : e.toAttribute) && void 0 !== r ? r : o$3.toAttribute)(i, s.type);
      this._$Ei = t, null == n ? this.removeAttribute(h) : this.setAttribute(h, n), this._$Ei = null;
    }
  }

  _$AK(t, i) {
    var s, e, r;

    const h = this.constructor,
          n = h._$Eu.get(t);

    if (void 0 !== n && this._$Ei !== n) {
      const t = h.getPropertyOptions(n),
            l = t.converter,
            a = null !== (r = null !== (e = null === (s = l) || void 0 === s ? void 0 : s.fromAttribute) && void 0 !== e ? e : "function" == typeof l ? l : null) && void 0 !== r ? r : o$3.fromAttribute;
      this._$Ei = n, this[n] = a(i, t.type), this._$Ei = null;
    }
  }

  requestUpdate(t, i, s) {
    let e = !0;
    void 0 !== t && (((s = s || this.constructor.getPropertyOptions(t)).hasChanged || n$3)(this[t], i) ? (this._$AL.has(t) || this._$AL.set(t, i), !0 === s.reflect && this._$Ei !== t && (void 0 === this._$EC && (this._$EC = new Map()), this._$EC.set(t, s))) : e = !1), !this.isUpdatePending && e && (this._$Ep = this._$E_());
  }

  async _$E_() {
    this.isUpdatePending = !0;

    try {
      await this._$Ep;
    } catch (t) {
      Promise.reject(t);
    }

    const t = this.scheduleUpdate();
    return null != t && (await t), !this.isUpdatePending;
  }

  scheduleUpdate() {
    return this.performUpdate();
  }

  performUpdate() {
    var t;
    if (!this.isUpdatePending) return;
    this.hasUpdated, this._$Et && (this._$Et.forEach((t, i) => this[i] = t), this._$Et = void 0);
    let i = !1;
    const s = this._$AL;

    try {
      i = this.shouldUpdate(s), i ? (this.willUpdate(s), null === (t = this._$Eg) || void 0 === t || t.forEach(t => {
        var i;
        return null === (i = t.hostUpdate) || void 0 === i ? void 0 : i.call(t);
      }), this.update(s)) : this._$EU();
    } catch (t) {
      throw i = !1, this._$EU(), t;
    }

    i && this._$AE(s);
  }

  willUpdate(t) {}

  _$AE(t) {
    var i;
    null === (i = this._$Eg) || void 0 === i || i.forEach(t => {
      var i;
      return null === (i = t.hostUpdated) || void 0 === i ? void 0 : i.call(t);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }

  _$EU() {
    this._$AL = new Map(), this.isUpdatePending = !1;
  }

  get updateComplete() {
    return this.getUpdateComplete();
  }

  getUpdateComplete() {
    return this._$Ep;
  }

  shouldUpdate(t) {
    return !0;
  }

  update(t) {
    void 0 !== this._$EC && (this._$EC.forEach((t, i) => this._$ES(i, this[i], t)), this._$EC = void 0), this._$EU();
  }

  updated(t) {}

  firstUpdated(t) {}

}

a$1.finalized = !0, a$1.elementProperties = new Map(), a$1.elementStyles = [], a$1.shadowRootOptions = {
  mode: "open"
}, null == h$1 || h$1({
  ReactiveElement: a$1
}), (null !== (s$2 = globalThis.reactiveElementVersions) && void 0 !== s$2 ? s$2 : globalThis.reactiveElementVersions = []).push("1.3.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$1;

const i$2 = globalThis.trustedTypes,
      s$1 = i$2 ? i$2.createPolicy("lit-html", {
  createHTML: t => t
}) : void 0,
      e$1 = `lit$${(Math.random() + "").slice(9)}$`,
      o$2 = "?" + e$1,
      n$2 = `<${o$2}>`,
      l$1 = document,
      h = (t = "") => l$1.createComment(t),
      r = t => null === t || "object" != typeof t && "function" != typeof t,
      d = Array.isArray,
      u = t => {
  var i;
  return d(t) || "function" == typeof (null === (i = t) || void 0 === i ? void 0 : i[Symbol.iterator]);
},
      c = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
      v = /-->/g,
      a = />/g,
      f = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,
      _ = /'/g,
      m = /"/g,
      g = /^(?:script|style|textarea|title)$/i,
      p = t => (i, ...s) => ({
  _$litType$: t,
  strings: i,
  values: s
}),
      $ = p(1),
      b = Symbol.for("lit-noChange"),
      w = Symbol.for("lit-nothing"),
      T = new WeakMap(),
      x = (t, i, s) => {
  var e, o;
  const n = null !== (e = null == s ? void 0 : s.renderBefore) && void 0 !== e ? e : i;
  let l = n._$litPart$;

  if (void 0 === l) {
    const t = null !== (o = null == s ? void 0 : s.renderBefore) && void 0 !== o ? o : null;
    n._$litPart$ = l = new N(i.insertBefore(h(), t), t, void 0, null != s ? s : {});
  }

  return l._$AI(t), l;
},
      A = l$1.createTreeWalker(l$1, 129, null, !1),
      C = (t, i) => {
  const o = t.length - 1,
        l = [];
  let h,
      r = 2 === i ? "<svg>" : "",
      d = c;

  for (let i = 0; i < o; i++) {
    const s = t[i];
    let o,
        u,
        p = -1,
        $ = 0;

    for (; $ < s.length && (d.lastIndex = $, u = d.exec(s), null !== u);) $ = d.lastIndex, d === c ? "!--" === u[1] ? d = v : void 0 !== u[1] ? d = a : void 0 !== u[2] ? (g.test(u[2]) && (h = RegExp("</" + u[2], "g")), d = f) : void 0 !== u[3] && (d = f) : d === f ? ">" === u[0] ? (d = null != h ? h : c, p = -1) : void 0 === u[1] ? p = -2 : (p = d.lastIndex - u[2].length, o = u[1], d = void 0 === u[3] ? f : '"' === u[3] ? m : _) : d === m || d === _ ? d = f : d === v || d === a ? d = c : (d = f, h = void 0);

    const y = d === f && t[i + 1].startsWith("/>") ? " " : "";
    r += d === c ? s + n$2 : p >= 0 ? (l.push(o), s.slice(0, p) + "$lit$" + s.slice(p) + e$1 + y) : s + e$1 + (-2 === p ? (l.push(void 0), i) : y);
  }

  const u = r + (t[o] || "<?>") + (2 === i ? "</svg>" : "");
  if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return [void 0 !== s$1 ? s$1.createHTML(u) : u, l];
};

class E {
  constructor({
    strings: t,
    _$litType$: s
  }, n) {
    let l;
    this.parts = [];
    let r = 0,
        d = 0;
    const u = t.length - 1,
          c = this.parts,
          [v, a] = C(t, s);

    if (this.el = E.createElement(v, n), A.currentNode = this.el.content, 2 === s) {
      const t = this.el.content,
            i = t.firstChild;
      i.remove(), t.append(...i.childNodes);
    }

    for (; null !== (l = A.nextNode()) && c.length < u;) {
      if (1 === l.nodeType) {
        if (l.hasAttributes()) {
          const t = [];

          for (const i of l.getAttributeNames()) if (i.endsWith("$lit$") || i.startsWith(e$1)) {
            const s = a[d++];

            if (t.push(i), void 0 !== s) {
              const t = l.getAttribute(s.toLowerCase() + "$lit$").split(e$1),
                    i = /([.?@])?(.*)/.exec(s);
              c.push({
                type: 1,
                index: r,
                name: i[2],
                strings: t,
                ctor: "." === i[1] ? M : "?" === i[1] ? H : "@" === i[1] ? I : S
              });
            } else c.push({
              type: 6,
              index: r
            });
          }

          for (const i of t) l.removeAttribute(i);
        }

        if (g.test(l.tagName)) {
          const t = l.textContent.split(e$1),
                s = t.length - 1;

          if (s > 0) {
            l.textContent = i$2 ? i$2.emptyScript : "";

            for (let i = 0; i < s; i++) l.append(t[i], h()), A.nextNode(), c.push({
              type: 2,
              index: ++r
            });

            l.append(t[s], h());
          }
        }
      } else if (8 === l.nodeType) if (l.data === o$2) c.push({
        type: 2,
        index: r
      });else {
        let t = -1;

        for (; -1 !== (t = l.data.indexOf(e$1, t + 1));) c.push({
          type: 7,
          index: r
        }), t += e$1.length - 1;
      }

      r++;
    }
  }

  static createElement(t, i) {
    const s = l$1.createElement("template");
    return s.innerHTML = t, s;
  }

}

function P(t, i, s = t, e) {
  var o, n, l, h;
  if (i === b) return i;
  let d = void 0 !== e ? null === (o = s._$Cl) || void 0 === o ? void 0 : o[e] : s._$Cu;
  const u = r(i) ? void 0 : i._$litDirective$;
  return (null == d ? void 0 : d.constructor) !== u && (null === (n = null == d ? void 0 : d._$AO) || void 0 === n || n.call(d, !1), void 0 === u ? d = void 0 : (d = new u(t), d._$AT(t, s, e)), void 0 !== e ? (null !== (l = (h = s)._$Cl) && void 0 !== l ? l : h._$Cl = [])[e] = d : s._$Cu = d), void 0 !== d && (i = P(t, d._$AS(t, i.values), d, e)), i;
}

class V {
  constructor(t, i) {
    this.v = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }

  get parentNode() {
    return this._$AM.parentNode;
  }

  get _$AU() {
    return this._$AM._$AU;
  }

  p(t) {
    var i;
    const {
      el: {
        content: s
      },
      parts: e
    } = this._$AD,
          o = (null !== (i = null == t ? void 0 : t.creationScope) && void 0 !== i ? i : l$1).importNode(s, !0);
    A.currentNode = o;
    let n = A.nextNode(),
        h = 0,
        r = 0,
        d = e[0];

    for (; void 0 !== d;) {
      if (h === d.index) {
        let i;
        2 === d.type ? i = new N(n, n.nextSibling, this, t) : 1 === d.type ? i = new d.ctor(n, d.name, d.strings, this, t) : 6 === d.type && (i = new L(n, this, t)), this.v.push(i), d = e[++r];
      }

      h !== (null == d ? void 0 : d.index) && (n = A.nextNode(), h++);
    }

    return o;
  }

  m(t) {
    let i = 0;

    for (const s of this.v) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }

}

class N {
  constructor(t, i, s, e) {
    var o;
    this.type = 2, this._$AH = w, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cg = null === (o = null == e ? void 0 : e.isConnected) || void 0 === o || o;
  }

  get _$AU() {
    var t, i;
    return null !== (i = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) && void 0 !== i ? i : this._$Cg;
  }

  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return void 0 !== i && 11 === t.nodeType && (t = i.parentNode), t;
  }

  get startNode() {
    return this._$AA;
  }

  get endNode() {
    return this._$AB;
  }

  _$AI(t, i = this) {
    t = P(this, t, i), r(t) ? t === w || null == t || "" === t ? (this._$AH !== w && this._$AR(), this._$AH = w) : t !== this._$AH && t !== b && this.$(t) : void 0 !== t._$litType$ ? this.T(t) : void 0 !== t.nodeType ? this.k(t) : u(t) ? this.S(t) : this.$(t);
  }

  A(t, i = this._$AB) {
    return this._$AA.parentNode.insertBefore(t, i);
  }

  k(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.A(t));
  }

  $(t) {
    this._$AH !== w && r(this._$AH) ? this._$AA.nextSibling.data = t : this.k(l$1.createTextNode(t)), this._$AH = t;
  }

  T(t) {
    var i;
    const {
      values: s,
      _$litType$: e
    } = t,
          o = "number" == typeof e ? this._$AC(t) : (void 0 === e.el && (e.el = E.createElement(e.h, this.options)), e);
    if ((null === (i = this._$AH) || void 0 === i ? void 0 : i._$AD) === o) this._$AH.m(s);else {
      const t = new V(o, this),
            i = t.p(this.options);
      t.m(s), this.k(i), this._$AH = t;
    }
  }

  _$AC(t) {
    let i = T.get(t.strings);
    return void 0 === i && T.set(t.strings, i = new E(t)), i;
  }

  S(t) {
    d(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s,
        e = 0;

    for (const o of t) e === i.length ? i.push(s = new N(this.A(h()), this.A(h()), this, this.options)) : s = i[e], s._$AI(o), e++;

    e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
  }

  _$AR(t = this._$AA.nextSibling, i) {
    var s;

    for (null === (s = this._$AP) || void 0 === s || s.call(this, !1, !0, i); t && t !== this._$AB;) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }

  setConnected(t) {
    var i;
    void 0 === this._$AM && (this._$Cg = t, null === (i = this._$AP) || void 0 === i || i.call(this, t));
  }

}

class S {
  constructor(t, i, s, e, o) {
    this.type = 1, this._$AH = w, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = o, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = w;
  }

  get tagName() {
    return this.element.tagName;
  }

  get _$AU() {
    return this._$AM._$AU;
  }

  _$AI(t, i = this, s, e) {
    const o = this.strings;
    let n = !1;
    if (void 0 === o) t = P(this, t, i, 0), n = !r(t) || t !== this._$AH && t !== b, n && (this._$AH = t);else {
      const e = t;
      let l, h;

      for (t = o[0], l = 0; l < o.length - 1; l++) h = P(this, e[s + l], i, l), h === b && (h = this._$AH[l]), n || (n = !r(h) || h !== this._$AH[l]), h === w ? t = w : t !== w && (t += (null != h ? h : "") + o[l + 1]), this._$AH[l] = h;
    }
    n && !e && this.C(t);
  }

  C(t) {
    t === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t ? t : "");
  }

}

class M extends S {
  constructor() {
    super(...arguments), this.type = 3;
  }

  C(t) {
    this.element[this.name] = t === w ? void 0 : t;
  }

}

const k = i$2 ? i$2.emptyScript : "";

class H extends S {
  constructor() {
    super(...arguments), this.type = 4;
  }

  C(t) {
    t && t !== w ? this.element.setAttribute(this.name, k) : this.element.removeAttribute(this.name);
  }

}

class I extends S {
  constructor(t, i, s, e, o) {
    super(t, i, s, e, o), this.type = 5;
  }

  _$AI(t, i = this) {
    var s;
    if ((t = null !== (s = P(this, t, i, 0)) && void 0 !== s ? s : w) === b) return;
    const e = this._$AH,
          o = t === w && e !== w || t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive,
          n = t !== w && (e === w || o);
    o && this.element.removeEventListener(this.name, this, e), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }

  handleEvent(t) {
    var i, s;
    "function" == typeof this._$AH ? this._$AH.call(null !== (s = null === (i = this.options) || void 0 === i ? void 0 : i.host) && void 0 !== s ? s : this.element, t) : this._$AH.handleEvent(t);
  }

}

class L {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }

  get _$AU() {
    return this._$AM._$AU;
  }

  _$AI(t) {
    P(this, t);
  }

}

const z = window.litHtmlPolyfillSupport;
null == z || z(E, N), (null !== (t$1 = globalThis.litHtmlVersions) && void 0 !== t$1 ? t$1 : globalThis.litHtmlVersions = []).push("2.2.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

var l, o$1;

class s extends a$1 {
  constructor() {
    super(...arguments), this.renderOptions = {
      host: this
    }, this._$Dt = void 0;
  }

  createRenderRoot() {
    var t, e;
    const i = super.createRenderRoot();
    return null !== (t = (e = this.renderOptions).renderBefore) && void 0 !== t || (e.renderBefore = i.firstChild), i;
  }

  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Dt = x(i, this.renderRoot, this.renderOptions);
  }

  connectedCallback() {
    var t;
    super.connectedCallback(), null === (t = this._$Dt) || void 0 === t || t.setConnected(!0);
  }

  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), null === (t = this._$Dt) || void 0 === t || t.setConnected(!1);
  }

  render() {
    return b;
  }

}

s.finalized = !0, s._$litElement$ = !0, null === (l = globalThis.litElementHydrateSupport) || void 0 === l || l.call(globalThis, {
  LitElement: s
});
const n$1 = globalThis.litElementPolyfillSupport;
null == n$1 || n$1({
  LitElement: s
});
(null !== (o$1 = globalThis.litElementVersions) && void 0 !== o$1 ? o$1 : globalThis.litElementVersions = []).push("3.2.0");

class Volume extends s {
    constructor(props = {}) {
        var _a, _b, _c;
        super();
        this.volume = (_a = props.volume) !== null && _a !== void 0 ? _a : 0;
        this.backgroundColor = (_b = props.backgroundColor) !== null && _b !== void 0 ? _b : '#69ce2b';
        this.count = (_c = props.count) !== null && _c !== void 0 ? _c : 10;
    }
    static get styles() {
        return r$2 `

      :host {
        width: 100%;
      }

      #wrapper{
        width: 100%;
      }

      `;
    }
    static get properties() {
        return {
            volume: {
                type: Number,
            },
            count: {
                type: Number,
            },
            backgroundColor: {
                type: String,
                reflect: true,
            },
        };
    }
    willUpdate(changedProps) {
        // console.log(changedProps)
        if (changedProps.has('volume')) {
            // const oldValue = changedProps.get('volume');
            if (!this.volume || this.volume < 0)
                this.volume = 0;
            else if (this.volume > 1)
                this.volume = 1;
        }
    }
    render() {
        var _a;
        const numToColor = Math.round(this.count * ((_a = this.volume) !== null && _a !== void 0 ? _a : 0));
        return $ `
      <style>
        .target{
          width: calc(${100 / this.count}% - 10px);
          height: 10px;
          display: inline-block;
          margin: 5px;
          background-color: #e6e7e8;
        }

        .active {
          background-color: ${this.backgroundColor};
        }
        
      </style>

        <div id="wrapper">
          ${Array.from({ length: this.count }, (_, i) => $ `<div class=${i < numToColor ? 'target active' : 'target'}></div>`)}
        </div>
    `;
    }
}
customElements.define('visualscript-audio-volume', Volume);

var index$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Volume: Volume
});

class Player extends s {
    constructor(props = {}) {
        super();
        this.source = props.source;
        this.autoplay = props.autoplay;
        this.controls = props.controls;
    }
    static get styles() {
        return r$2 `

      video {
        width: 100%;
      }

      `;
    }
    static get properties() {
        return {
            source: {
                converter: {
                    toAttribute(value) {
                        return value;
                    },
                    fromAttribute(value) {
                        return value;
                    }
                }
            },
            autoplay: { type: Boolean },
            controls: { type: Boolean }
        };
    }
    willUpdate(_) {
        // console.log(changedProps)
        // if (changedProps.has('volume')) {
        //     // const oldValue = changedProps.get('volume');
        //     if (!this.volume || this.volume < 0) this.volume = 0
        //     else if (this.volume > 1) this.volume = 1
        // }
    }
    render() {
        let video = document.createElement('video');
        // Live Input | NOTE: Not Working in Storybook
        if (typeof this.source === 'object')
            video.srcObject = this.source;
        // Video Source
        else {
            if (this.source) {
                const source = document.createElement('source');
                source.src = this.source;
                video.insertAdjacentElement('beforeend', source);
            }
        }
        if (this.autoplay)
            video.autoplay = this.autoplay;
        if (this.controls)
            video.controls = this.controls;
        return video;
    }
}
customElements.define('visualscript-video-player', Player);

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Player: Player
});

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class ColorRGBA {
  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

}
/**
 * Baseline class
 */


class WebglBase {
  /**
   * @internal
   */
  constructor() {
    this.scaleX = 1;
    this.scaleY = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.loop = false;
    this._vbuffer = 0;
    this._coord = 0;
    this.visible = true;
    this.intensity = 1;
    this.xy = new Float32Array([]);
    this.numPoints = 0;
    this.color = new ColorRGBA(0, 0, 0, 1);
    this.webglNumPoints = 0;
  }

}
/**
 * The standard Line class
 */


class WebglLine extends WebglBase {
  /**
   * Create a new line
   * @param c - the color of the line
   * @param numPoints - number of data pints
   * @example
   * ```typescript
   * x= [0,1]
   * y= [1,2]
   * line = new WebglLine( new ColorRGBA(0.1,0.1,0.1,1), 2);
   * ```
   */
  constructor(c, numPoints) {
    super();
    this.currentIndex = 0;
    this.webglNumPoints = numPoints;
    this.numPoints = numPoints;
    this.color = c;
    this.xy = new Float32Array(2 * this.webglNumPoints);
  }
  /**
   * Set the X value at a specific index
   * @param index - the index of the data point
   * @param x - the horizontal value of the data point
   */


  setX(index, x) {
    this.xy[index * 2] = x;
  }
  /**
   * Set the Y value at a specific index
   * @param index : the index of the data point
   * @param y : the vertical value of the data point
   */


  setY(index, y) {
    this.xy[index * 2 + 1] = y;
  }
  /**
   * Get an X value at a specific index
   * @param index - the index of X
   */


  getX(index) {
    return this.xy[index * 2];
  }
  /**
   * Get an Y value at a specific index
   * @param index - the index of Y
   */


  getY(index) {
    return this.xy[index * 2 + 1];
  }
  /**
   * Make an equally spaced array of X points
   * @param start  - the start of the series
   * @param stepSize - step size between each data point
   *
   * @example
   * ```typescript
   * //x = [-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8]
   * const numX = 10;
   * line.lineSpaceX(-1, 2 / numX);
   * ```
   */


  lineSpaceX(start, stepSize) {
    for (let i = 0; i < this.numPoints; i++) {
      // set x to -num/2:1:+num/2
      this.setX(i, start + stepSize * i);
    }
  }
  /**
   * Automatically generate X between -1 and 1
   * equal to lineSpaceX(-1, 2/ number of points)
   */


  arrangeX() {
    this.lineSpaceX(-1, 2 / this.numPoints);
  }
  /**
   * Set a constant value for all Y values in the line
   * @param c - constant value
   */


  constY(c) {
    for (let i = 0; i < this.numPoints; i++) {
      // set x to -num/2:1:+num/2
      this.setY(i, c);
    }
  }
  /**
   * Add a new Y values to the end of current array and shift it, so that the total number of the pair remains the same
   * @param data - the Y array
   *
   * @example
   * ```typescript
   * yArray = new Float32Array([3, 4, 5]);
   * line.shiftAdd(yArray);
   * ```
   */


  shiftAdd(data) {
    const shiftSize = data.length;

    for (let i = 0; i < this.numPoints - shiftSize; i++) {
      this.setY(i, this.getY(i + shiftSize));
    }

    for (let i = 0; i < shiftSize; i++) {
      this.setY(i + this.numPoints - shiftSize, data[i]);
    }
  }
  /**
   * Add new Y values to the line and maintain the position of the last data point
   */


  addArrayY(yArray) {
    if (this.currentIndex + yArray.length <= this.numPoints) {
      for (let i = 0; i < yArray.length; i++) {
        this.setY(this.currentIndex, yArray[i]);
        this.currentIndex++;
      }
    }
  }
  /**
   * Replace the all Y values of the line
   */


  replaceArrayY(yArray) {
    if (yArray.length == this.numPoints) {
      for (let i = 0; i < this.numPoints; i++) {
        this.setY(i, yArray[i]);
      }
    }
  }

}
/**
 * Author Danial Chitnis 2019-20
 *
 * inspired by:
 * https://codepen.io/AzazelN28
 * https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm
 */

/**
 * The main class for the webgl-plot library
 */


class WebglPlot {
  /**
   * Create a webgl-plot instance
   * @param canvas - the canvas in which the plot appears
   * @param debug - (Optional) log debug messages to console
   *
   * @example
   *
   * For HTMLCanvas
   * ```typescript
   * const canvas = document.getElementbyId("canvas");
   *
   * const devicePixelRatio = window.devicePixelRatio || 1;
   * canvas.width = canvas.clientWidth * devicePixelRatio;
   * canvas.height = canvas.clientHeight * devicePixelRatio;
   *
   * const webglp = new WebGLplot(canvas);
   * ...
   * ```
   * @example
   *
   * For OffScreenCanvas
   * ```typescript
   * const offscreen = htmlCanvas.transferControlToOffscreen();
   *
   * offscreen.width = htmlCanvas.clientWidth * window.devicePixelRatio;
   * offscreen.height = htmlCanvas.clientHeight * window.devicePixelRatio;
   *
   * const worker = new Worker("offScreenCanvas.js", { type: "module" });
   * worker.postMessage({ canvas: offscreen }, [offscreen]);
   * ```
   * Then in offScreenCanvas.js
   * ```typescript
   * onmessage = function (evt) {
   * const wglp = new WebGLplot(evt.data.canvas);
   * ...
   * }
   * ```
   */
  constructor(canvas, options) {
    /**
     * log debug output
     */
    this.debug = false;
    this.addLine = this.addDataLine;

    if (options == undefined) {
      this.webgl = canvas.getContext("webgl", {
        antialias: true,
        transparent: false
      });
    } else {
      this.webgl = canvas.getContext("webgl", {
        antialias: options.antialias,
        transparent: options.transparent,
        desynchronized: options.deSync,
        powerPerformance: options.powerPerformance,
        preserveDrawing: options.preserveDrawing
      });
      this.debug = options.debug == undefined ? false : options.debug;
    }

    this.log("canvas type is: " + canvas.constructor.name);
    this.log(`[webgl-plot]:width=${canvas.width}, height=${canvas.height}`);
    this._linesData = [];
    this._linesAux = [];
    this._thickLines = [];
    this._surfaces = []; //this.webgl = webgl;

    this.gScaleX = 1;
    this.gScaleY = 1;
    this.gXYratio = 1;
    this.gOffsetX = 0;
    this.gOffsetY = 0;
    this.gLog10X = false;
    this.gLog10Y = false; // Clear the color

    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT); // Set the view port

    this.webgl.viewport(0, 0, canvas.width, canvas.height);
    this._progLine = this.webgl.createProgram();
    this.initThinLineProgram(); //https://learnopengl.com/Advanced-OpenGL/Blending

    this.webgl.enable(this.webgl.BLEND);
    this.webgl.blendFunc(this.webgl.SRC_ALPHA, this.webgl.ONE_MINUS_SRC_ALPHA);
  }

  get linesData() {
    return this._linesData;
  }

  get linesAux() {
    return this._linesAux;
  }

  get thickLines() {
    return this._thickLines;
  }

  get surfaces() {
    return this._surfaces;
  }
  /**
   * updates and redraws the content of the plot
   */


  _drawLines(lines) {
    const webgl = this.webgl;
    lines.forEach(line => {
      if (line.visible) {
        webgl.useProgram(this._progLine);
        const uscale = webgl.getUniformLocation(this._progLine, "uscale");
        webgl.uniformMatrix2fv(uscale, false, new Float32Array([line.scaleX * this.gScaleX * (this.gLog10X ? 1 / Math.log(10) : 1), 0, 0, line.scaleY * this.gScaleY * this.gXYratio * (this.gLog10Y ? 1 / Math.log(10) : 1)]));
        const uoffset = webgl.getUniformLocation(this._progLine, "uoffset");
        webgl.uniform2fv(uoffset, new Float32Array([line.offsetX + this.gOffsetX, line.offsetY + this.gOffsetY]));
        const isLog = webgl.getUniformLocation(this._progLine, "is_log");
        webgl.uniform2iv(isLog, new Int32Array([this.gLog10X ? 1 : 0, this.gLog10Y ? 1 : 0]));
        const uColor = webgl.getUniformLocation(this._progLine, "uColor");
        webgl.uniform4fv(uColor, [line.color.r, line.color.g, line.color.b, line.color.a]);
        webgl.bufferData(webgl.ARRAY_BUFFER, line.xy, webgl.STREAM_DRAW);
        webgl.drawArrays(line.loop ? webgl.LINE_LOOP : webgl.LINE_STRIP, 0, line.webglNumPoints);
      }
    });
  }

  _drawSurfaces(squares) {
    const webgl = this.webgl;
    squares.forEach(square => {
      if (square.visible) {
        webgl.useProgram(this._progLine);
        const uscale = webgl.getUniformLocation(this._progLine, "uscale");
        webgl.uniformMatrix2fv(uscale, false, new Float32Array([square.scaleX * this.gScaleX * (this.gLog10X ? 1 / Math.log(10) : 1), 0, 0, square.scaleY * this.gScaleY * this.gXYratio * (this.gLog10Y ? 1 / Math.log(10) : 1)]));
        const uoffset = webgl.getUniformLocation(this._progLine, "uoffset");
        webgl.uniform2fv(uoffset, new Float32Array([square.offsetX + this.gOffsetX, square.offsetY + this.gOffsetY]));
        const isLog = webgl.getUniformLocation(this._progLine, "is_log");
        webgl.uniform2iv(isLog, new Int32Array([this.gLog10X ? 1 : 0, this.gLog10Y ? 1 : 0]));
        const uColor = webgl.getUniformLocation(this._progLine, "uColor");
        webgl.uniform4fv(uColor, [square.color.r, square.color.g, square.color.b, square.color.a]);
        webgl.bufferData(webgl.ARRAY_BUFFER, square.xy, webgl.STREAM_DRAW);
        webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, square.webglNumPoints);
      }
    });
  }

  _drawTriangles(thickLine) {
    const webgl = this.webgl;
    webgl.bufferData(webgl.ARRAY_BUFFER, thickLine.xy, webgl.STREAM_DRAW);
    webgl.useProgram(this._progLine);
    const uscale = webgl.getUniformLocation(this._progLine, "uscale");
    webgl.uniformMatrix2fv(uscale, false, new Float32Array([thickLine.scaleX * this.gScaleX * (this.gLog10X ? 1 / Math.log(10) : 1), 0, 0, thickLine.scaleY * this.gScaleY * this.gXYratio * (this.gLog10Y ? 1 / Math.log(10) : 1)]));
    const uoffset = webgl.getUniformLocation(this._progLine, "uoffset");
    webgl.uniform2fv(uoffset, new Float32Array([thickLine.offsetX + this.gOffsetX, thickLine.offsetY + this.gOffsetY]));
    const isLog = webgl.getUniformLocation(this._progLine, "is_log");
    webgl.uniform2iv(isLog, new Int32Array([0, 0]));
    const uColor = webgl.getUniformLocation(this._progLine, "uColor");
    webgl.uniform4fv(uColor, [thickLine.color.r, thickLine.color.g, thickLine.color.b, thickLine.color.a]);
    webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, thickLine.xy.length / 2);
  }

  _drawThickLines() {
    this._thickLines.forEach(thickLine => {
      if (thickLine.visible) {
        const calibFactor = Math.min(this.gScaleX, this.gScaleY); //const calibFactor = 10;
        //console.log(thickLine.getThickness());

        thickLine.setActualThickness(thickLine.getThickness() / calibFactor);
        thickLine.convertToTriPoints();

        this._drawTriangles(thickLine);
      }
    });
  }
  /**
   * Draw and clear the canvas
   */


  update() {
    this.clear();
    this.draw();
  }
  /**
   * Draw without clearing the canvas
   */


  draw() {
    this._drawLines(this.linesData);

    this._drawLines(this.linesAux);

    this._drawThickLines();

    this._drawSurfaces(this.surfaces);
  }
  /**
   * Clear the canvas
   */


  clear() {
    //this.webgl.clearColor(0.1, 0.1, 0.1, 1.0);
    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);
  }
  /**
   * adds a line to the plot
   * @param line - this could be any of line, linestep, histogram, or polar
   *
   * @example
   * ```typescript
   * const line = new line(color, numPoints);
   * wglp.addLine(line);
   * ```
   */


  _addLine(line) {
    //line.initProgram(this.webgl);
    line._vbuffer = this.webgl.createBuffer();
    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, line._vbuffer);
    this.webgl.bufferData(this.webgl.ARRAY_BUFFER, line.xy, this.webgl.STREAM_DRAW); //this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, line._vbuffer);

    line._coord = this.webgl.getAttribLocation(this._progLine, "coordinates");
    this.webgl.vertexAttribPointer(line._coord, 2, this.webgl.FLOAT, false, 0, 0);
    this.webgl.enableVertexAttribArray(line._coord);
  }

  addDataLine(line) {
    this._addLine(line);

    this.linesData.push(line);
  }

  addAuxLine(line) {
    this._addLine(line);

    this.linesAux.push(line);
  }

  addThickLine(thickLine) {
    this._addLine(thickLine);

    this._thickLines.push(thickLine);
  }

  addSurface(surface) {
    this._addLine(surface);

    this.surfaces.push(surface);
  }

  initThinLineProgram() {
    const vertCode = `
      attribute vec2 coordinates;
      uniform mat2 uscale;
      uniform vec2 uoffset;
      uniform ivec2 is_log;

      void main(void) {
         float x = (is_log[0]==1) ? log(coordinates.x) : coordinates.x;
         float y = (is_log[1]==1) ? log(coordinates.y) : coordinates.y;
         vec2 line = vec2(x, y);
         gl_Position = vec4(uscale*line + uoffset, 0.0, 1.0);
      }`; // Create a vertex shader object

    const vertShader = this.webgl.createShader(this.webgl.VERTEX_SHADER); // Attach vertex shader source code

    this.webgl.shaderSource(vertShader, vertCode); // Compile the vertex shader

    this.webgl.compileShader(vertShader); // Fragment shader source code

    const fragCode = `
         precision mediump float;
         uniform highp vec4 uColor;
         void main(void) {
            gl_FragColor =  uColor;
         }`;
    const fragShader = this.webgl.createShader(this.webgl.FRAGMENT_SHADER);
    this.webgl.shaderSource(fragShader, fragCode);
    this.webgl.compileShader(fragShader);
    this._progLine = this.webgl.createProgram();
    this.webgl.attachShader(this._progLine, vertShader);
    this.webgl.attachShader(this._progLine, fragShader);
    this.webgl.linkProgram(this._progLine);
  }
  /**
   * remove the last data line
   */


  popDataLine() {
    this.linesData.pop();
  }
  /**
   * remove all the lines
   */


  removeAllLines() {
    this._linesData = [];
    this._linesAux = [];
    this._thickLines = [];
    this._surfaces = [];
  }
  /**
   * remove all data lines
   */


  removeDataLines() {
    this._linesData = [];
  }
  /**
   * remove all auxiliary lines
   */


  removeAuxLines() {
    this._linesAux = [];
  }
  /**
   * Change the WbGL viewport
   * @param a
   * @param b
   * @param c
   * @param d
   */


  viewport(a, b, c, d) {
    this.webgl.viewport(a, b, c, d);
  }

  log(str) {
    if (this.debug) {
      console.log("[webgl-plot]:" + str);
    }
  }

}

/**
 * importnat WebglPlot functions
 * addLine(line)
 * addDataLine(line)
 * addAuxLine(line)
 * popDataLine()
 * removeAllLines()
 * linesData() //returns data line obj array
 * linesAux() //returns aux line obj array
 * removeDataLines()
 * removeAuxLines()
 * update()
 * 
 * 
 * important WebglLine functions
 * setX(i,x)
 * setY(j,y)
 * constY(c) 
 * replaceArrayX(xarr)
 * replaceArrayY(yarr)
 * arrangeX()
 * linSpaceX(start, stepsize);
 */

var WebglLinePlotUtils = /*#__PURE__*/function () {
  function WebglLinePlotUtils(canvas) {
    var _this = this;

    var overlay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    _classCallCheck(this, WebglLinePlotUtils);

    _defineProperty(this, "updateAllLines", function () {
      var newAmplitudes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var linesSPS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var autoscale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var centerZero = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var passed = true;

      var sps = _toConsumableArray(linesSPS);

      newAmplitudes.forEach(function (arr, i) {
        var _this$linesY$i;

        if (arr.length !== ((_this$linesY$i = _this.linesY[i]) === null || _this$linesY$i === void 0 ? void 0 : _this$linesY$i.length)) {
          var _this$linesY$i2;

          //let absmax = WebglLinePlotUtils.absmax(arr);
          if (arr.length > ((_this$linesY$i2 = _this.linesY[i]) === null || _this$linesY$i2 === void 0 ? void 0 : _this$linesY$i2.length)) {
            _this.linesY[i] = WebglLinePlotUtils.downsample(arr, _this.linesY[i].length);
          } else _this.linesY[i] = WebglLinePlotUtils.upsample(arr, _this.linesY[i]);

          sps[i] = Math.ceil(arr.length / _this.nSecGraph);

          if (autoscale) {
            _this.linesY[i] = _this.autoscale(arr, i, _this.nLines, centerZero); //autoscale the array to -1,+1
          }

          passed = false;
        } else {
          if (autoscale) {
            _this.linesY[i] = _this.autoscale(arr, i, _this.nLines, centerZero); //autoscale the array to -1,+1
          } else _this.linesY[i] = arr; //
          //console.log('line set')

        }
      });

      if (!passed) {
        _this.deinitPlot();

        _this.initPlot(newAmplitudes.length, sps); //console.log('reinit');

      }

      if (_this.useOverlay) {
        _this.overlayctx.clearRect(0, 0, _this.overlay.width, _this.overlay.height);

        _this.overlayctx.font = '1em Courier';
        _this.overlayctx.fillStyle = 'white';
      }

      _this.linesY.forEach(function (arr, i) {
        for (var j = 0; j < arr.length; j++) {
          _this.lines[i].setY(j, arr[j]);
        } //now update x-axes and y-axes on the canvas


        if (_this.useOverlay) {
          _this.overlayctx.fillText(_this.lineSettings[i].ymax.toFixed(2), _this.overlay.width - 70, _this.overlay.height * (i + 0.1) / _this.lines.length);

          _this.overlayctx.fillText(_this.lineSettings[i].ymin.toFixed(2), _this.overlay.width - 70, _this.overlay.height * (i + 0.9) / _this.lines.length);
        }
      }); //console.log('lines updated')

    });

    _defineProperty(this, "updateLine", function () {
      var newAmplitudes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var lineSPS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
      var lineIdx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var autoscale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var centerZero = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (newAmplitudes.length !== lineSPS * _this.nSecGraph) {
        lineSPS = newAmplitudes.length / _this.nSecGraph;
        _this.linesSPS[lineIdx] = lineSPS;

        _this.deinitPlot();

        _this.initPlot(_this.lines.length, _this.linesSPS); //console.log('reinit');

      } //console.log(this.linesY[lineIdx])


      if (newAmplitudes.length !== _this.linesY[lineIdx].length) {
        if (newAmplitudes.length > _this.linesY[lineIdx].length) {
          _this.linesY[lineIdx] = WebglLinePlotUtils.downsample(newAmplitudes, _this.linesY[lineIdx].length); //downsample and autoscale the array to -1,+1
        } else _this.linesY[lineIdx] = WebglLinePlotUtils.upsample(newAmplitudes, _this.linesY[lineIdx]); //upsample and autoscale the array to -1,+1


        if (autoscale) _this.linesY[lineIdx] = _this.autoscale(newAmplitudes, lineIdx, _this.nLines, centerZero); //autoscale the array to -1,+1
        //console.log('resampled', this.linesY[lineIdx]);
      } else {
        if (autoscale) _this.linesY[lineIdx] = _this.autoscale(newAmplitudes, lineIdx, _this.nLines, centerZero); //autoscale the array to -1,+1
        else _this.linesY[lineIdx] = newAmplitudes; //console.log('set lineY[i]', this.linesY[lineIdx]);
      }

      for (var i = 0; i < _this.linesY[lineIdx].length; i++) {
        _this.lines[lineIdx].setY(i, _this.linesY[lineIdx][i]);
      } //now update x-axes and y-axes on the canvas


      if (_this.useOverlay) {
        _this.overlayctx.clearRect(0, _this.overlay.height * lineIdx / _this.lines.length, _this.overlay.width, _this.overlay.height * (lineIdx + 1) / _this.lines.length);

        _this.overlayctx.fillText(_this.lineSettings[lineIdx].ymax.toFixed(2), _this.overlay.width - 70, _this.overlay.height * (lineIdx + 0.1) / _this.lines.length);

        _this.overlayctx.fillText(_this.lineSettings[lineIdx].ymin.toFixed(2), _this.overlay.width - 70, _this.overlay.height * (lineIdx + 0.9) / _this.lines.length);
      } //console.log('line updated', lineIdx);

    });

    if (!canvas) throw new Error('Supply a canvas to the webgl plot!');
    this.canvas = canvas;
    this.useOverlay = overlay;
    this.overlay;
    this.overlayctx;
    this.plot = new WebglPlot(canvas);

    if (this.useOverlay) {
      this.overlay = document.createElement('canvas');
      this.overlay.style = this.canvas.style; // this.overlay.style.width = this.canvas.style.width;
      // this.overlay.style.height = this.canvas.style.height;

      this.overlay.width = this.canvas.width;
      this.overlay.height = this.canvas.height;
      this.overlay.style.position = 'absolute';
      this.overlay.style.zIndex = this.canvas.style.zIndex + 1; // this.overlay.style.offsetX = this.canvas.style.offsetX;
      // this.overlay.style.offsetY = this.canvas.style.offsetY;

      this.overlayctx = this.overlay.getContext('2d');
      this.canvas.parentNode.insertAdjacentElement('afterbegin', this.overlay);
    }

    this.lines = []; //array of WebglLine objects

    this.linesY = []; //raw data arrays

    this.linesSPS = []; // [];

    this.axes = [];
    this.dividers = [];
    this.colors = [];
    this.lineSettings = [];
    this.axisscalar = 1; // chart axis scalar

    this.nLines = 0;
    this.nSecGraph = 10; //default

    this.nMaxPointsPerSec = 512;
    this.animationSpeed = 6.9; //ms
  } //autoscale array to -1 and 1


  _createClass(WebglLinePlotUtils, [{
    key: "autoscale",
    value: function autoscale(array) {
      var lineIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var nLines = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var centerZero = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var max = Math.max.apply(Math, _toConsumableArray(array));
      var min = Math.min.apply(Math, _toConsumableArray(array));
      this.lineSettings[lineIdx].ymax = max;
      this.lineSettings[lineIdx].ymin = min;

      var _lines = 1 / nLines;

      var scalar;

      if (centerZero) {
        var absmax = Math.max(Math.abs(min), Math.abs(max));
        scalar = _lines / absmax;
        return array.map(function (y) {
          return y * scalar + (_lines * (lineIdx + 1) * 2 - 1 - _lines);
        }); //scaled array
      } else {
        scalar = _lines / (max - min);
        return array.map(function (y) {
          return 2 * ((y - min) * scalar - 1 / (2 * nLines)) + (_lines * (lineIdx + 1) * 2 - 1 - _lines);
        }); //scaled array
      }
    } //absolute value maximum of array (for a +/- valued array)

  }, {
    key: "deinitPlot",
    value: function deinitPlot() {
      var _this$plot, _this$plot2;

      (_this$plot = this.plot) === null || _this$plot === void 0 ? void 0 : _this$plot.clear();
      (_this$plot2 = this.plot) === null || _this$plot2 === void 0 ? void 0 : _this$plot2.removeAllLines();
    }
  }, {
    key: "HSLToRGB",
    value: function HSLToRGB(h, s, l) {
      // Must be fractions of 1
      s /= 100;
      l /= 100;
      var c = (1 - Math.abs(2 * l - 1)) * s,
          x = c * (1 - Math.abs(h / 60 % 2 - 1)),
          m = l - c / 2,
          r = 0,
          g = 0,
          b = 0;

      if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
      return [r, g, b];
    } //charts. need to set sample rate and number of seconds, this creates lines with set numbers of coordinates you can update data into

  }, {
    key: "initPlot",
    value: function initPlot() {
      var nLines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var linesSPS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var nSecGraph = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.nSecGraph;
      var nMaxPointsPerSec = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.nMaxPointsPerSec;
      this.nSecGraph = nSecGraph;
      this.nMaxPointsPerSec = nMaxPointsPerSec;
      var xaxisColor = new ColorRGBA(1, 1, 1, 0.3);
      var dividerColor = new ColorRGBA(1, 1, 1, 1); //scale line heights with number of lines

      var axisscalar = 1 / nLines;
      this.nLines = nLines;
      this.lines = [];
      this.linesSPS = linesSPS;

      for (var i = 0; i < nLines; i++) {
        var rgb = this.HSLToRGB(360 * (i / nLines) % 360, 100, 50);
        var color = new ColorRGBA(rgb[0], rgb[1], rgb[2], 1);
        this.colors.push(color);
        var numX = 10;
        if (linesSPS[i] > nMaxPointsPerSec) numX = nSecGraph * nMaxPointsPerSec;else numX = linesSPS[i] * nSecGraph;
        numX = Math.floor(numX);
        var line = new WebglLine(color, numX);
        line.arrangeX();
        this.lines.push(line);

        if (this.linesY.length < this.lines.length) {
          this.linesY.push(new Array(numX));
        }

        this.plot.addDataLine(line);
        var xaxisY = axisscalar * (i + 1) * 2 - 1 - axisscalar; //console.log('lineidx',i);

        var xaxis = new WebglLine(xaxisColor, 2);
        xaxis.constY(xaxisY);
        xaxis.arrangeX();
        xaxis.xy[2] = 1; //console.log('xaxisY',xaxisY,xaxis)

        this.plot.addAuxLine(xaxis);
        this.axes.push(xaxis);

        if (i !== nLines - 1) {
          var dividerY = axisscalar * (i + 1) * 2 - 1;
          var divider = new WebglLine(dividerColor, 2);
          divider.constY(dividerY);
          divider.arrangeX();
          divider.xy[2] = 1; //console.log('dividerY',dividerY,divider)

          this.plot.addAuxLine(divider);
          this.dividers.push(divider);
        }

        this.lineSettings[i] = {
          color: color,
          sps: linesSPS[i],
          ymin: -1,
          ymax: 1
        }; //console.log(i,xaxisY,xaxis)
      }

      if (this.linesY.length > this.lines.length) this.linesY.splice(this.lines.length); //console.log('plot setup', this.lines,this.linesY, this.axes,this.dividers);

      return true;
    }
  }, {
    key: "update",
    value: function update() {
      //draw
      this.plot.update();
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this2 = this;

      this.update();
      setTimeout(function () {
        requestAnimationFrame(_this2.animate);
      }, this.animationSpeed);
    }
  }], [{
    key: "absmax",
    value: function absmax(array) {
      return Math.max(Math.abs(Math.min.apply(Math, _toConsumableArray(array))), Math.max.apply(Math, _toConsumableArray(array)));
    } //averages values when downsampling.

  }, {
    key: "downsample",
    value: function downsample(array, fitCount) {
      var scalar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      if (array.length > fitCount) {
        var output = new Array(fitCount);
        var incr = array.length / fitCount;
        var lastIdx = array.length - 1;
        var last = 0;
        var counter = 0;

        for (var i = incr; i < array.length; i += incr) {
          var rounded = Math.round(i);
          if (rounded > lastIdx) rounded = lastIdx;

          for (var j = last; j < rounded; j++) {
            output[counter] += array[j];
          }

          output[counter] /= (rounded - last) * scalar;
          counter++;
          last = rounded;
        }

        return output;
      } else return array; //can't downsample a smaller array

    } //Linear upscaling interpolation from https://stackoverflow.com/questions/26941168/javascript-interpolate-an-array-of-numbers. Input array and number of samples to fit the data to

  }, {
    key: "upsample",
    value: function upsample(array, fitCount) {
      var scalar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      var linearInterpolate = function linearInterpolate(before, after, atPoint) {
        return (before + (after - before) * atPoint) * scalar;
      };

      var newData = new Array(fitCount);
      var springFactor = new Number((array.length - 1) / (fitCount - 1));
      newData[0] = array[0]; // for new allocation

      for (var i = 1; i < fitCount - 1; i++) {
        var tmp = i * springFactor;
        var before = new Number(Math.floor(tmp)).toFixed();
        var after = new Number(Math.ceil(tmp)).toFixed();
        var atPoint = tmp - before;
        newData[i] = linearInterpolate(array[before], array[after], atPoint);
      }

      newData[fitCount - 1] = array[array.length - 1]; // for new allocation

      return newData;
    }
  }, {
    key: "test",
    value: function test(canvasId) {
      var canvas = document.getElementById(canvasId);
      var devicePixelRatio = globalThis.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
      var sps = 512;
      var sps2 = 256;
      var nSec = 3;
      var nPointsRenderedPerSec = 512;
      var freq = 1;
      var amp = 0.5;
      var noise = 0.5;
      var line = new Array(sps * nSec);
      var line2 = new Array(sps2 * nSec);
      var plotutil = new WebglLinePlotUtils(canvas);
      plotutil.initPlot(2, [sps, sps2], nSec, nPointsRenderedPerSec);

      function update() {
        var line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var sps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 512;
        var sec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
        var len = sps * sec;
        var tincr = sec / len;
        var time = 0;

        for (var i = 0; i < sps * sec; i++) {
          var ySin = Math.sin(Math.PI * time * freq * Math.PI * 2 + performance.now() * 0.001);
          var yNoise = Math.random() - 0.5;
          line[i] = ySin * amp + yNoise * noise;
          time += tincr;
        }
      }

      var newFrame = function newFrame() {
        update(line, sps, nSec);
        update(line2, sps2, nSec); //console.log(line);

        plotutil.updateAllLines([line, line2], [sps, sps2], true);
        plotutil.update();
        requestAnimationFrame(newFrame);
      };

      requestAnimationFrame(newFrame);
    }
  }]);

  return WebglLinePlotUtils;
}();

class TimeSeries$1 extends s {
    constructor(props = { seconds: 5, sps: 512 }) {
        var _a, _b, _c;
        super();
        this.data = [];
        this.spss = [];
        this.buffers = [];
        this.updateData = (data) => {
            this.data = data;
        };
        // Only run when changed
        this.init = () => {
            const length = this.data.length;
            let nPointsRenderedPerSec = 60;
            this.sps = this.seconds * nPointsRenderedPerSec;
            // let nPointsRenderedPerSec = Math.ceil(this.seconds / this.sps)
            this.spss = Array.from({ length }, _ => this.sps);
            this.buffers = Array.from({ length }, _ => []);
            this.util.initPlot(length, this.spss, this.seconds, nPointsRenderedPerSec);
        };
        this.clear = () => {
            this.util.plot.clear();
            this.buffers = [];
            this.data = [];
        };
        this.draw = () => {
            // Plot the Lines
            if (this.data.length != this.buffers.length)
                this.init();
            this.data.forEach((data, i) => {
                if (this.buffers[i].length === 0)
                    this.buffers[i] = Array.from({ length: this.spss[i] }, _ => data);
                else {
                    if (!Array.isArray(data))
                        data = [data];
                    data.forEach(() => this.buffers[i].pop());
                    this.buffers[i].unshift(...data);
                }
            });
        };
        this.canvas = document.createElement('canvas');
        this.util = new WebglLinePlotUtils(this.canvas, false);
        this.sps = (_a = props.sps) !== null && _a !== void 0 ? _a : 512;
        this.seconds = (_b = props.seconds) !== null && _b !== void 0 ? _b : 5;
        this.backgroundColor = (_c = props.backgroundColor) !== null && _c !== void 0 ? _c : '#69ce2b';
        let newFrame = () => {
            if (this.buffers.length > 0) {
                this.util.updateAllLines(this.buffers, this.spss, true);
                this.util.update();
            }
            requestAnimationFrame(newFrame);
        };
        requestAnimationFrame(newFrame);
    }
    static get styles() {
        return r$2 `

      canvas{
        background: black;
      }

      `;
    }
    static get properties() {
        return {
            data: {
                type: Array,
                reflect: true,
            },
            sps: {
                type: Number,
                reflect: true,
            },
            seconds: {
                type: Number,
                reflect: true,
            },
            backgroundColor: {
                type: String,
                reflect: true,
            },
        };
    }
    willUpdate(updatedProps) {
        if (updatedProps.has('data'))
            this.draw();
        // if (updatedProps.has('sps')) this.init()
        if (updatedProps.has('seconds')) {
            if (!this.seconds)
                this.seconds = 0.001;
            this.init();
        }
    }
    render() {
        return this.canvas;
    }
}
customElements.define('visualscript-timeseries-stream', TimeSeries$1);

class Spectrogram$1 extends s {
    constructor(props = {}) {
        var _a, _b, _c;
        super();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.reset = false;
        this.offset = true; //automatic DC offset based on mininum 
        //256 key Chromajs generated color scale from: https://vis4.net/labs/multihue/
        this.colorScale = ['#000000', '#030106', '#06010c', '#090211', '#0c0215', '#0e0318', '#10031b', '#12041f', '#130522', '#140525', '#150628', '#15072c', '#16082f', '#160832', '#160936', '#160939', '#17093d', '#170a40', '#170a44', '#170a48', '#17094b', '#17094f', '#170953', '#170956', '#16085a', '#16085e', '#150762', '#140766', '#140669', '#13066d', '#110571', '#100475', '#0e0479', '#0b037d', '#080281', '#050185', '#020089', '#00008d', '#000090', '#000093', '#000096', '#000099', '#00009c', '#00009f', '#0000a2', '#0000a5', '#0000a8', '#0000ab', '#0000ae', '#0000b2', '#0000b5', '#0000b8', '#0000bb', '#0000be', '#0000c1', '#0000c5', '#0000c8', '#0000cb', '#0000ce', '#0000d1', '#0000d5', '#0000d8', '#0000db', '#0000de', '#0000e2', '#0000e5', '#0000e8', '#0000ec', '#0000ef', '#0000f2', '#0000f5', '#0000f9', '#0000fc', '#0803fe', '#2615f9', '#3520f4', '#3f29ef', '#4830eb', '#4e37e6', '#543ee1', '#5944dc', '#5e49d7', '#614fd2', '#6554cd', '#6759c8', '#6a5ec3', '#6c63be', '#6e68b9', '#6f6db4', '#7072af', '#7177aa', '#717ba5', '#7180a0', '#71859b', '#718996', '#708e91', '#6f928b', '#6e9786', '#6c9b80', '#6aa07b', '#68a475', '#65a96f', '#62ad69', '#5eb163', '#5ab65d', '#55ba56', '#4fbf4f', '#48c347', '#40c73f', '#36cc35', '#34ce32', '#37cf31', '#3ad130', '#3cd230', '#3fd32f', '#41d52f', '#44d62e', '#46d72d', '#48d92c', '#4bda2c', '#4ddc2b', '#4fdd2a', '#51de29', '#53e029', '#55e128', '#58e227', '#5ae426', '#5ce525', '#5ee624', '#60e823', '#62e922', '#64eb20', '#66ec1f', '#67ed1e', '#69ef1d', '#6bf01b', '#6df11a', '#6ff318', '#71f416', '#73f614', '#75f712', '#76f810', '#78fa0d', '#7afb0a', '#7cfd06', '#7efe03', '#80ff00', '#85ff00', '#89ff00', '#8eff00', '#92ff00', '#96ff00', '#9aff00', '#9eff00', '#a2ff00', '#a6ff00', '#aaff00', '#adff00', '#b1ff00', '#b5ff00', '#b8ff00', '#bcff00', '#bfff00', '#c3ff00', '#c6ff00', '#c9ff00', '#cdff00', '#d0ff00', '#d3ff00', '#d6ff00', '#daff00', '#ddff00', '#e0ff00', '#e3ff00', '#e6ff00', '#e9ff00', '#ecff00', '#efff00', '#f3ff00', '#f6ff00', '#f9ff00', '#fcff00', '#ffff00', '#fffb00', '#fff600', '#fff100', '#ffec00', '#ffe700', '#ffe200', '#ffdd00', '#ffd800', '#ffd300', '#ffcd00', '#ffc800', '#ffc300', '#ffbe00', '#ffb900', '#ffb300', '#ffae00', '#ffa900', '#ffa300', '#ff9e00', '#ff9800', '#ff9300', '#ff8d00', '#ff8700', '#ff8100', '#ff7b00', '#ff7500', '#ff6f00', '#ff6800', '#ff6100', '#ff5a00', '#ff5200', '#ff4900', '#ff4000', '#ff3600', '#ff2800', '#ff1500', '#ff0004', '#ff000c', '#ff0013', '#ff0019', '#ff001e', '#ff0023', '#ff0027', '#ff002b', '#ff012f', '#ff0133', '#ff0137', '#ff013b', '#ff023e', '#ff0242', '#ff0246', '#ff0349', '#ff034d', '#ff0450', '#ff0454', '#ff0557', '#ff065b', '#ff065e', '#ff0762', '#ff0865', '#ff0969', '#ff0a6c', '#ff0a70', '#ff0b73', '#ff0c77', '#ff0d7a', '#ff0e7e', '#ff0f81', '#ff1085', '#ff1188', '#ff128c', '#ff138f', '#ff1493'];
        this.data = [];
        this.dynNormalize = true;
        this.init = () => {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.offscreenctx.fillStyle = "black";
            this.offscreenctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };
        // test = () => {
        //   const length = 100
        //   this.data = Array.from({length}, (_,i) => (i === Math.floor(length*(0.5 + 0.5*Math.sin(Date.now()/1000)))) ? 1 : 0)
        //   setTimeout(this.test, 100)
        // }
        // Helper to Update Data
        this.updateData = (data) => {
            this.data = data;
        };
        this.onresize = () => {
            var _a, _b, _c, _d;
            const width = (_a = this.canvas.parentNode) === null || _a === void 0 ? void 0 : _a.clientWidth;
            const height = (_b = this.canvas.parentNode) === null || _b === void 0 ? void 0 : _b.clientHeight;
            if (width) {
                this.canvas.width = (_c = this.canvas.parentNode) === null || _c === void 0 ? void 0 : _c.clientWidth;
                this.canvas.style.width = width.toString();
            }
            if (height) {
                this.canvas.height = (_d = this.canvas.parentNode) === null || _d === void 0 ? void 0 : _d.clientHeight;
                this.canvas.style.height = height.toString();
            }
        };
        //Adapted from Spectrogram.js by Miguel Mota https://github.com/miguelmota/spectrogram
        this.draw = () => {
            var width = this.canvas.width;
            var height = Math.floor(this.canvas.height);
            var tempCanvasContext = this.offscreenctx;
            var tempCanvas = tempCanvasContext.canvas;
            tempCanvasContext.drawImage(this.canvas, 0, 0, width, height);
            var data = [...Array.from(this.data)]; //set spectrogram.data = [...newdata]
            if (data.length !== height) { //Fit data to height
                var interp = data;
                data = this.interpolateArray(interp, height);
            }
            var offset = 0;
            if (this.offset === true) {
                offset = Math.pow(10, Math.floor(Math.log10(Math.min(...data))));
            }
            if (this.dynNormalize === true) {
                this.normalizeFactor = 1 / Math.pow(10, Math.floor(Math.log10(Math.max(...data)) + .5));
            }
            for (var i = 0; i < data.length; i++) {
                var value = Math.floor((data[i] - offset) * this.normalizeFactor * 255);
                if (value > 255) {
                    value = 255;
                }
                else if (value < 0) {
                    value = 0;
                }
                this.ctx.fillStyle = this.colorScale[value];
                this.ctx.fillRect(width - 1, height - i, 1, 1);
            }
            if (this.reset === false) {
                this.ctx.translate(-1, 0);
                // draw prev canvas before translation
                this.ctx.drawImage(tempCanvas, 0, 0, width, height);
                // reset transformation matrix
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            else {
                this.reset = false;
            }
        };
        this.max = (_a = props.max) !== null && _a !== void 0 ? _a : 1;
        this.normalizeFactor = (props.max) ? 1 / props.max : 1;
        this.backgroundColor = (_b = props.backgroundColor) !== null && _b !== void 0 ? _b : '#69ce2b';
        window.addEventListener('resize', () => {
            this.onresize();
        });
        this.offscreen = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        this.offscreenctx = this.offscreen.getContext("2d");
        this.init();
        this.data = (_c = props.data) !== null && _c !== void 0 ? _c : new Array(this.canvas.height).fill(0);
        // this.test()
        this.onresize();
    }
    static get styles() {
        return r$2 `

      canvas{
        background: black;
      }

      `;
    }
    static get properties() {
        return {
            max: {
                type: Number,
                reflect: true
            },
            data: {
                type: Array,
                reflect: true
            },
            backgroundColor: {
                type: String,
                reflect: true,
            },
        };
    }
    willUpdate(changedProps) {
        if (changedProps.has('data'))
            this.draw(); // Only draw on new data
    }
    //Linear interpolation from https://stackoverflow.com/questions/26941168/javascript-interpolate-an-array-of-numbers
    interpolateArray(data, fitCount) {
        var norm = this.canvas.height / data.length;
        var linearInterpolate = function (before, after, atPoint) {
            return (before + (after - before) * atPoint) * norm;
        };
        var newData = new Array();
        var springFactor = new Number((data.length - 1) / (fitCount - 1));
        newData[0] = data[0]; // for new allocation
        for (var i = 1; i < fitCount - 1; i++) {
            var tmp = i * springFactor;
            var beforeNum = new Number(Math.floor(tmp));
            var before = beforeNum.toFixed();
            var after = new Number(Math.ceil(tmp)).toFixed();
            var atPoint = tmp - beforeNum;
            newData[i] = linearInterpolate(data[before], data[after], atPoint);
        }
        newData[fitCount - 1] = data[data.length - 1]; // for new allocation
        return newData;
    }
    ;
    render() {
        return this.canvas;
    }
}
customElements.define('visualscript-spectrogram-stream', Spectrogram$1);

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  TimeSeries: TimeSeries$1,
  Spectrogram: Spectrogram$1
});

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  audio: index$3,
  video: index$2,
  data: index$1
});

// Note: Inspired by the Red Hat website https://www.redhat.com/en
class Nav extends s {
    constructor(props = { brand: {}, primary: { menu: [], options: [] }, secondary: [] }) {
        var _a, _b, _c, _d;
        super();
        this.getElement = (o) => {
            switch (o.type) {
                case 'button':
                    return $ `<a href="${o.link}" target=${(o.external) ? "_blank" : "_self"}><button>${o.content}</button></a>`;
                default:
                    return $ `<a href="${o.link}" target=${(o.external) ? "_blank" : "_self"} class="decorate">${o.content}</a>`;
            }
        };
        this.primary = (_a = props.primary) !== null && _a !== void 0 ? _a : { menu: [], options: [] };
        this.secondary = (_b = props.secondary) !== null && _b !== void 0 ? _b : [];
        this.color = (_c = props.color) !== null && _c !== void 0 ? _c : 'blue';
        this.brand = (_d = props.brand) !== null && _d !== void 0 ? _d : { content: 'My Brand' };
    }
    static get styles() {
        return r$2 `

    
    :host {
      z-index: 2;
      border-bottom: 1px solid rgb(180,180,180);
      background: white;
      color: black;
      display:flex;
      align-items: center;
      width: 100%;
      grid-area: nav;
      z-index: 100;
    }

    header {
      width: 100%;
    }

    :host * {
      box-sizing: border-box;
    }
    
    h1 {
      margin: 0;
    }

    nav {
      width: 100%;
      padding:  0px 25px;
      display: flex;
      align-items: center;
    }

    #primary {
      position: sticky; 
      top: 0;
      left: 0;
      height: 70px;
      max-height: 100px;
      justify-content: space-between;
      font-size: 80%;
    }

    #primary > * {
      flex-grow: 1;
      display: flex;
    }

    #primary > div:lastchild {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row-reverse;
    }

    #menu, #options {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #secondary {
      height: 50px;
      justify-content: flex-end;
      border-bottom: 1px solid #3d3d3d;
      font-size: 75%;
    }

    a{
      color: black;
      text-decoration: none;
    }

    .brand {
      padding-right: 15px;
    }

    a:not(.brand) {
      height: 100%;
      display: flex;
      align-items: center; 
      justify-content: center;
      text-align: center;
    }

    .decorate {
      padding: 10px 15px;
    }

    #primary .decorate:hover {
      box-shadow: 0 4px 0 #0fb3ff inset;
    }

    #secondary .decorate:hover {
      box-shadow: 0 3px 0 #c4c4c4 inset;
    }

    button {
      border: 1px solid white;
      border-radius: 3px;
      background: transparent;
      padding: 5px 10px;
      margin-left: 10px;
      font-size: 95%;
    }
    
    nav button:last-child {
      margin-right: 0px;
    }

    button:hover {
      outline: 1.1px solid white;
      cursor: pointer;
    }

    @media only screen and (max-width: 800px) {
      #primary #menu {
        display: none;
      }
    }

    @media (prefers-color-scheme: dark) {
      :host {
        background: #060606;
        color: white;
      }

      a {
        color: white;
      }
    }

    `;
    }
    static get properties() {
        return {
            primary: {
                type: Object,
                // reflect: true,
            },
            secondary: {
                type: Array,
                reflect: true,
            },
            brand: {
                type: Object,
            },
            color: {
                type: String,
                reflect: true,
            },
        };
    }
    willUpdate(changedProps) {
        // console.log(changedProps)
        if (changedProps.has('primary')) ;
    }
    render() {
        // console.log('Primary', this.primary)
        // console.log('secondary', this.secondary)
        // console.log('brand', this.brand)
        var _a, _b, _c;
        return $ `
      <header>
      ${(this.secondary.length > 0) ? $ `<nav id="secondary">${(_a = this.secondary) === null || _a === void 0 ? void 0 : _a.map(o => this.getElement(o))}</nav>` : ``}
      <nav id="primary">
      ${$ `<div><a class="brand" target=${(this.brand.external) ? "_blank" : "_self"} href=${this.brand.link}>${(this.brand.content) ? ((/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(this.brand.content)) ? $ `<img src="${this.brand.content}"></img>` : $ `<h1>${this.brand.content}</h1><slot></slot>`) : $ `<h1><slot></slot></h1>`}</a></div>`}
        <div>
          <div id="options">
          ${(_b = this.primary.options) === null || _b === void 0 ? void 0 : _b.map(o => this.getElement(o))}
          </div>
          <div id="menu">
            ${(_c = this.primary.menu) === null || _c === void 0 ? void 0 : _c.map(o => this.getElement(o))}
          </div>
        </div>

      </nav>
      </header>
    `;
    }
}
customElements.define('visualscript-nav', Nav);

// Note: Inspired by the Red Hat website https://www.redhat.com/en
class Loader extends s {
    constructor(props = {}) {
        var _a, _b, _c, _d;
        super();
        this.progress = props.progress;
        this.color = props.color;
        this.background = (_a = props.background) !== null && _a !== void 0 ? _a : '#f3f3f3';
        this.type = (_b = props.type) !== null && _b !== void 0 ? _b : 'default';
        this.showPercent = (_c = props.showPercent) !== null && _c !== void 0 ? _c : true;
        this.text = props.text;
        this.textBackground = props.textBackground;
        this.textColor = props.textColor;
        this.size = (_d = props.size) !== null && _d !== void 0 ? _d : '13px';
        // Conditionally change default color
        if (!this.color) {
            if (this.type === 'default')
                this.color = 'blue';
            else
                this.color = '#7aff80';
        }
    }
    static get styles() {
        return r$2 `
    
    :host {
      
    }

    #container {  
      width: 100%;
    }

    #indicator { 
      width: 100%;
      overflow: hidden;
      animate: 0.5s;
      opacity: 0.7;
    }

    #indicator > div {
      width: 100%;
      height: 100%;
    }

    #linear-text {  
      padding: 10px 15px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      font-size: 75%;
      background: white;
    }

    .loader-container {
      width: 80px;
      height: 80px;
      position: relative;
      color: #5b5b5b;
    }

    .loader {
      width: 100%;
      height: 100%;
      border: 4px solid;
      background: white;
      border-right: none;
      border-top: none;
      border-left: none;
      z-index: 2000;
      background-color: transparent;
      border-radius: 100%;
      transform: rotateZ(0);
    }

    .loader-container > span{
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 80%;
      transform: translate(-50%, -50%);
      user-select: none;
    }

    .loader.active {
      opacity: 0.45;
      -webkit-animation: spin 2s linear infinite;
      animation: spin 2s linear infinite;
    }

    /* @-moz-keyframes spin {  . . . } */
    
    
    /* @-ms-keyframes spin {  . . . } */
    
    
    /* @-o-keyframes spin { . . . } */
    
    @-webkit-keyframes spin {
      from {
        transform: rotateZ(0deg) scale(1);
      }
      50% {
        transform: rotateZ(540deg) scale(0.9);
        filter: brightness(50%);        
      }
      to {
        transform: rotateZ(1080deg) scale(1);
      }
    }
    
    @keyframes spin {
      from {
        transform: rotateZ(0deg) scale(1);
      }
      50% {
        transform: rotateZ(540deg) scale(0.9);
        filter: brightness(50%);
      }
      to {
        transform: rotateZ(1080deg) scale(1);
      }
    }
    `;
    }
    static get properties() {
        return {
            progress: {
                type: Number,
                reflect: true,
            },
            text: {
                type: String,
                reflect: true,
            },
            type: {
                type: String,
                reflect: true,
            },
            color: {
                type: String,
                reflect: true,
            },
            background: {
                type: String,
                reflect: true,
            },
            textBackground: {
                type: String,
                reflect: true,
            },
            textColor: {
                type: String,
                reflect: true,
            },
            size: {
                type: String,
                reflect: true,
            },
        };
    }
    willUpdate(_) {
        // console.log(changedProps)
        // if (changedProps.has('type')) {
        // }
    }
    render() {
        var _a;
        const progress = (_a = this.progress) !== null && _a !== void 0 ? _a : 0;
        const text = (this.text != undefined) ? this.text : (this.showPercent) ? `${(progress * 100).toFixed(1)}%` : '';
        switch (this.type) {
            case 'linear':
                return $ `
            ${(text) ? $ `<div id="linear-text" style="background: ${this.textBackground}; color: ${this.textColor};">${text}</div>` : ''}
            <div id="indicator" style="height:${this.size}; background:${this.background}; opacity:${(progress === 1) ? 1 : ''};">
                <div style="width:${progress * 100}%; background: ${this.color}"></div>
              </div>
            `;
            default:
                // if (progress < 1) 
                return $ `
            <div class="loader-container" style="height:${this.size}; width:${this.size}; background: ${this.textBackground};">
              ${(text) ? $ `<span style="color: ${this.textColor};">${text}</span>` : ''}
              <div class="loader active" style="border-color: ${this.color};"></div>
            </div>
            `;
        }
    }
}
customElements.define('visualscript-loader', Loader);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = {
  ATTRIBUTE: 1,
  CHILD: 2,
  PROPERTY: 3,
  BOOLEAN_ATTRIBUTE: 4,
  EVENT: 5,
  ELEMENT: 6
},
      e = t => (...e) => ({
  _$litDirective$: t,
  values: e
});

class i$1 {
  constructor(t) {}

  get _$AU() {
    return this._$AM._$AU;
  }

  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }

  _$AS(t, e) {
    return this.update(t, e);
  }

  update(t, e) {
    return this.render(...e);
  }

}

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const i = e(class extends i$1 {
  constructor(t$1) {
    var e;
    if (super(t$1), t$1.type !== t.ATTRIBUTE || "style" !== t$1.name || (null === (e = t$1.strings) || void 0 === e ? void 0 : e.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }

  render(t) {
    return Object.keys(t).reduce((e, r) => {
      const s = t[r];
      return null == s ? e : e + `${r = r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
    }, "");
  }

  update(e, [r]) {
    const {
      style: s
    } = e.element;

    if (void 0 === this.ct) {
      this.ct = new Set();

      for (const t in r) this.ct.add(t);

      return this.render(r);
    }

    this.ct.forEach(t => {
      null == r[t] && (this.ct.delete(t), t.includes("-") ? s.removeProperty(t) : s[t] = "");
    });

    for (const t in r) {
      const e = r[t];
      null != e && (this.ct.add(t), t.includes("-") ? s.setProperty(t, e) : s[t] = e);
    }

    return b;
  }

});

class Button extends s {
    constructor(props = {}) {
        super();
        this.primary = props.primary;
        this.backgroundColor = props.backgroundColor;
        this.size = props.size;
        this.onClick = props.onClick;
    }
    static get styles() {
        return r$2 `

    .storybook-button {
      font-weight: 700;
      border: 0;
      border-radius: 1em;
      cursor: pointer;
      display: inline-block;
      line-height: 1;
      overflow: hidden;
    }

    .storybook-button--primary {
      color: white;
      background-color: #1ea7fd;
    }
    .storybook-button--secondary {
      color: #333;
      background-color: transparent;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
    }
    .storybook-button--extra-small {
      font-size: 10px;
      padding: 7px 12px;
    }

    .storybook-button--small {
      font-size: 12px;
      padding: 10px 16px;
    }
    .storybook-button--medium {
      font-size: 14px;
      padding: 11px 20px;
    }
    .storybook-button--large {
      font-size: 16px;
      padding: 12px 24px;
    }


    @media (prefers-color-scheme: dark) {
      .storybook-button--secondary {
        color: #cccccc;
        background-color: transparent;
        box-shadow: rgba(255, 255, 255, 0.50) 0px 0px 0px 1px inset;
      }
    }

    `;
    }
    static get properties() {
        return {
            primary: {
                type: Boolean,
                reflect: true
            },
            backgroundColor: {
                type: String,
                reflect: true
            },
            size: {
                type: String,
                reflect: true
            },
            onClick: {
                type: Function,
                reflect: true
            }
        };
    }
    willUpdate(_) {
        // console.log(changedProps)
        // if (changedProps.has('type')) {
        // }
    }
    render() {
        const mode = (this.primary) ? 'storybook-button--primary' : 'storybook-button--secondary';
        return $ `
      <button
           type="button"
            class=${['storybook-button', `storybook-button--${this.size || 'medium'}`, mode].join(' ')}
            style=${i({ backgroundColor: this.backgroundColor })}
            @click=${this.onClick}
      >
        <slot>Button</slot>
      </button>
    `;
    }
}
customElements.define('visualscript-button', Button);

class Modal extends s {
    constructor(props = {}) {
        super();
        this.toggle = () => this.open = !this.open;
        this.open = props.open;
        this.header = props.header;
        this.footer = props.footer;
    }
    static get styles() {
        return r$2 `
/* Modal Header */

  :host {
    
    z-index: 101;
  }
  
  :host * {
    box-sizing: border-box;
    
  }

.modal-header {
  padding: 12px 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid #e3e3e3;
}

.modal-header span {
  font-weight: 800;
  font-size: 120%;
}


/* Modal Body */
.modal-body {
  padding: 16px;
  overflow: scroll;
  width: 100%;
  flex-grow: 1;
}

/* Modal Footer */
.modal-footer {
  border-top: 1px solid #e3e3e3;
  padding: 12px 16px;
  width: 100%;
}

.modal-footer span {
  font-size: 80%;
}

/* Modal Content */
.modal-content {
  
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);

  background-color: #fefefe;
  margin: auto;
  border-radius: 4px;
  padding: 0;
  width: 80vw;
  height: 80vh;
  box-shadow: 0 1px 5px 0 rgb(0 0 0 / 20%);
  transition: opacity 0.5s;
  display: flex; 
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  pointer-events: none;
  z-index: 102;
  opacity: 0;
}

.modal-content.open {
  opacity: 1;
  pointer-events: all;
}

    `;
    }
    static get properties() {
        return {
            open: {
                type: Boolean,
                reflect: true
            },
            header: {
                type: Object,
                reflect: true
            },
            footer: {
                type: String,
                reflect: true
            },
        };
    }
    willUpdate(_) {
        // console.log(changedProps)
        // if (changedProps.has('type')) {
        // }
    }
    render() {
        return $ `
      <div class="modal-content ${this.open ? 'open' : ''}">
        ${(this.header) ? $ `<div class="modal-header">
          <span>${this.header}</span>
          <visualscript-button secondary size="extra-small" @click="${this.toggle}">Close</visualscript-button>
        </div>` : ''}
        <div class="modal-body">
          <slot>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fringilla dolor vitae hendrerit feugiat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer ultricies arcu nec nibh commodo aliquam at in felis. Mauris lorem dui, porttitor et lectus vel, ornare sodales risus. Sed eu rhoncus ex. Donec tristique nibh lacus, sed dictum lacus lacinia eu. Nunc imperdiet a ante et feugiat. Praesent euismod tortor lacus, et euismod turpis mollis vitae. Etiam sagittis vehicula pulvinar. Aliquam id tincidunt tortor, sed feugiat nulla. Donec sollicitudin tincidunt viverra. Nunc condimentum molestie massa a feugiat. Nam mattis bibendum sodales. Nulla at maximus arcu, quis tempus lacus.

Vestibulum pharetra pretium neque eu faucibus. Morbi aliquam urna non lacinia congue. Donec sed odio interdum, imperdiet tellus in, porttitor erat. Mauris erat velit, facilisis ut luctus sit amet, laoreet vitae ligula. Morbi a mi ultrices, feugiat ante in, convallis enim. Etiam sollicitudin leo purus, ut commodo ex placerat et. Proin ut nulla non risus luctus eleifend eu id orci.

Ut aliquam tristique massa. Nullam a ipsum tincidunt, malesuada ipsum non, suscipit lectus. Suspendisse sit amet risus ut lectus efficitur feugiat in ut urna. Suspendisse odio felis, efficitur eu molestie eu, malesuada nec nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque fermentum sit amet odio id convallis. Donec luctus risus ac pretium ultrices. Quisque congue velit sed hendrerit posuere. Integer dictum felis eu tortor mattis scelerisque. Fusce facilisis justo nec velit vehicula gravida sit amet at erat. Suspendisse sit amet nibh metus. Aenean euismod, tortor a venenatis laoreet, sapien arcu semper turpis, non molestie risus ligula nec velit.

Nulla eget ultrices justo, non posuere dui. Praesent ultrices dui eget erat accumsan varius. Ut ut mi arcu. Integer porttitor, neque vitae fermentum dictum, tellus quam tincidunt mauris, eget tristique turpis mauris nec magna. Phasellus ut tortor eros. Ut vehicula non purus in efficitur. Quisque justo elit, varius id luctus et, pulvinar eget ipsum. Sed tristique et odio eu facilisis.

Phasellus sodales eros at erat elementum, a semper ligula facilisis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi at maximus nunc. In porttitor rutrum rhoncus. Ut dignissim viverra erat in aliquet. Suspendisse potenti. Donec lorem sem, vulputate non diam a, facilisis luctus tortor. In pellentesque ut eros id vulputate. Proin rutrum tincidunt libero, vel dictum libero ullamcorper in. Nam nec ultricies tortor, sit amet pellentesque ante. Sed tellus purus, pharetra vitae purus quis, accumsan vestibulum tellus. Vivamus porttitor urna a odio tincidunt tristique. Integer ut metus finibus, ultricies magna sed, congue eros. Duis velit velit, consectetur at faucibus ac, scelerisque nec diam.
</slot>
        </div>
        ${(this.footer) ? $ `<div class="modal-footer">
          <span>${this.footer}</span>
        </div>` : ''}
      </div>
      <visualscript-overlay .open=${this.open}></visualscript-overlay>
    `;
    }
}
customElements.define('visualscript-modal', Modal);

class Footer extends s {
    static get styles() {
        return r$2 `

    :host {
      padding: 25px;
      border-top: 1px solid rgb(180,180,180);
      background: white;
      color: black;
      display:flex;
      align-items: center;
      width: 100%;
      font-size: 70%;
      box-sizing: border-box;
      z-index: 100;
      grid-area: foot;
    }

    :host * {
      box-sizing: border-box;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        background: #060606;
        color: white;
      }

      a {
        color: white;
      }
    }
    `;
    }
    static get properties() {
        return {};
    }
    constructor(props = {}) {
        super();
    }
    render() {
        return $ `

      <slot></slot>
    `;
    }
}
customElements.define('visualscript-footer', Footer);

class Overlay extends s {
    constructor(props = {}) {
        var _a;
        super();
        this.open = false;
        this.open = (_a = props.open) !== null && _a !== void 0 ? _a : false;
    }
    static get styles() {
        return r$2 `

    div {
      opacity: 0;
      width: 100vw;
      height: 100vh;
      transition: 0.5s;
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 50;
      color: black;
      background: rgb(255,255, 255, 0.7);
    }
    

    div[open] {
      opacity: 1;
      pointer-events: all;
      backdrop-filter: blur(3px);
    }

    @media (prefers-color-scheme: dark) {
      div {
        color: white;
        background: rgb(0,0,0, 0.5);
      }
    }

    `;
    }
    static get properties() {
        return {
            open: {
                type: Boolean,
                reflect: true,
            }
        };
    }
    render() {
        return $ `
      <div ?open=${this.open ? true : false}>
        <slot></slot>
      </div>
    `;
    }
}
customElements.define('visualscript-overlay', Overlay);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

var n;
null != (null === (n = window.HTMLSlotElement) || void 0 === n ? void 0 : n.prototype.assignedElements) ? (o, n) => o.assignedElements(n) : (o, n) => o.assignedNodes(n).filter(o => o.nodeType === Node.ELEMENT_NODE);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

console.warn("The main 'lit-element' module entrypoint is deprecated. Please update your imports to use the 'lit' package: 'lit' and 'lit/decorators.ts' or import from 'lit-element/lit-element.ts'. See https://lit.dev/msg/deprecated-import-path for more information.");

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const o = e(class extends i$1 {
  constructor(t$1) {
    var i;
    if (super(t$1), t$1.type !== t.ATTRIBUTE || "class" !== t$1.name || (null === (i = t$1.strings) || void 0 === i ? void 0 : i.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }

  render(t) {
    return " " + Object.keys(t).filter(i => t[i]).join(" ") + " ";
  }

  update(i, [s]) {
    var r, o;

    if (void 0 === this.et) {
      this.et = new Set(), void 0 !== i.strings && (this.st = new Set(i.strings.join(" ").split(/\s/).filter(t => "" !== t)));

      for (const t in s) s[t] && !(null === (r = this.st) || void 0 === r ? void 0 : r.has(t)) && this.et.add(t);

      return this.render(s);
    }

    const e = i.element.classList;
    this.et.forEach(t => {
      t in s || (e.remove(t), this.et.delete(t));
    });

    for (const t in s) {
      const i = !!s[t];
      i === this.et.has(t) || (null === (o = this.st) || void 0 === o ? void 0 : o.has(t)) || (i ? (e.add(t), this.et.add(t)) : (e.remove(t), this.et.delete(t)));
    }

    return b;
  }

});

const PersistableProps = {
    label: {
        type: String,
        reflect: true
    },
    persist: {
        type: Boolean,
        reflect: true
    },
    value: {
        type: String,
        reflect: true
    },
    onChange: {
        type: Function,
        reflect: true
    }
};
const setPersistent = (o) => {
    if (o.persist && o.label)
        localStorage.setItem(o.label, String(o.value));
};
const getPersistent = (props) => {
    if (props.value)
        return props.value;
    else if (props.persist && props.label) {
        const val = localStorage.getItem(props.label);
        if (val === 'null')
            return null;
        else if (val === 'undefined')
            return undefined;
        else
            return val;
    }
};

class Input extends s {
    constructor(props = {}) {
        var _a, _b, _c;
        super();
        this.value = (_a = props.value) !== null && _a !== void 0 ? _a : "";
        this.outline = (_b = props.outline) !== null && _b !== void 0 ? _b : false;
        this.disabled = (_c = props.disabled) !== null && _c !== void 0 ? _c : false;
        this.label = props.label;
        this.persist = props.persist;
        const val = getPersistent(props);
        if (val)
            this.value = val;
    }
    // properties getter
    static get properties() {
        return Object.assign(PersistableProps, {
            disabled: { type: Boolean, reflect: true },
            outline: { type: Boolean, reflect: true }
        });
    }
    willUpdate(changedProps) {
        if (changedProps.has('value'))
            setPersistent(this);
    }
    static get styles() {
        return r$2 `

        :host {
            width: 100%;
            font-size: 15px;

        }
*{
box-sizing: border-box;
}
.form-group {
position: relative;
margin: 15px 0;
}
input.outline {
border: 1px solid  #333333;
border-radius: 5px;
}
label {
position: absolute;
left: 0;
top: 50%;
transform: translateY(-50%);
color: gray;
padding: 0 0.3rem;
margin: 0 0.5rem;
transition: 0.1s ease-out;
transform-origin: left top;
pointer-events: none;
}
input {
outline: none;
border: none;
border-radius: 0px;
padding: 15px 0.6rem 10px 0.6rem;
transition: 0.1s ease-out;
border-bottom: 1px solid  #333333;
background: transparent;
cursor: text;
margin-left: auto;
width: 95%;
margin-right: auto;
}
input::placeholder {
    color: transparent;
}
input:focus{
border-color:  #b949d5;
}
input:focus + label{
color:  #b949d5;
top: 0;
transform: translateY(-50%) scale(0.9);
}
input:not(:placeholder-shown) + label{
top: 0;
transform: translateY(-50%) scale(0.9);
}
input:focus:not(.outline) ~ label,
input:not(:placeholder-shown):not(.outline) ~ label
{
padding-left: 0px;
}
input:disabled,  input:disabled ~ .label {
opacity: 0.5;
}

@media (prefers-color-scheme: dark) {
    label {
      color: rgb(120,120,120);
    }
  }
`;
    }
    render() {
        return $ `
            <div class="form-group">
                <input
                class=${o({
            outline: this.outline
        })}
                type="${this.type}"
                placeholder="${this.label}"
                .value=${(this.value != 'null' && this.value != 'undefined') ? this.value : ''}
                ?disabled="${this.disabled}"

                @change=${(ev) => {
            this.value = ev.target.value;
        }}
                />
                <label>${this.label}</label>
            </div>
        `;
    }
}
customElements.define("visualscript-input", Input);

class Search extends s {
    constructor(props = {}) {
        super();
        this.getModal = () => {
            return this.shadowRoot.querySelector('visualscript-modal');
        };
        if (props.items)
            this.items = props.items;
        window.onkeydown = (ev) => {
            switch (ev.code) {
                case 'Enter':
                    this.modal.open = false;
                    break;
                case 'ArrowUp':
                    console.log('Up!');
                    break;
                case 'ArrowDown':
                    console.log('Down!');
                    break;
                case 'Escape':
                    this.modal.open = false;
                    break;
            }
        };
    }
    static get styles() {
        return r$2 `

    :host {
      display: flex;
      align-items: center;
      padding: 10px;
    }

    :host * {
      
      box-sizing: border-box;
      
    }

    button {
      padding: 5px;
      border-radius: 5px;
    }

    `;
    }
    static get properties() {
        return {
            placeholder: {
                type: String
            },
            items: {
                type: Object,
                // reflect: true
            },
            value: {
                type: String,
                reflect: true
            }
        };
    }
    render() {
        const regex = new RegExp(this.value, 'i');
        return $ `
        <visualscript-button @click=${() => {
            this.modal = this.getModal();
            this.modal.toggle();
        }}>Search</visualscript-button>
        <visualscript-modal 
          .header=${$ `<visualscript-input label="Search" @input=${(ev) => {
            this.value = ev.composedPath()[0].value;
        }}></visualscript-input>`}
          .footer=${$ `<div id=commands>Enter to select. Up and Down Arrows to navigate. Esc to close.</div>`}
        >
        <div>${this.items.map(i => {
            var _a;
            let matched = false;
            if (this.value) {
                if (i.tags)
                    i.tags.forEach((v) => { if (v.match(regex))
                        matched = true; });
                if (i.name.match(regex))
                    matched = true;
            }
            else
                matched = true;
            if (matched)
                return $ `<div><h3>${i.name}</h3><small>${(_a = i.tags) !== null && _a !== void 0 ? _a : 'No Tags'}</small></div>`;
        })}</div>
        </visualscript-modal>
      `;
    }
}
customElements.define('visualscript-search', Search);

/*
Largely from https://css-tricks.com/striking-a-balance-between-native-and-custom-select-elements/

Features to make the selectCustom work for mouse users.

- Toggle custom select visibility when clicking the "box"
- Update custom select value when clicking in a option
- Navigate through options when using keyboard up/down
- Pressing Enter or Space selects the current hovered option
- Close the select when clicking outside of it
- Sync both selects values when selecting a option. (native or custom)

*/
class Select extends s {
    constructor(props = {}) {
        var _a;
        super();
        this.persist = false;
        this.optionChecked = "";
        this.optionHoveredIndex = -1;
        this.options = [];
        this.onChange = () => { };
        this.add = (option) => {
            this.options = [...this.options, option];
        };
        this.openSelectCustom = () => {
            this.elements.elSelectCustom.classList.add("isActive");
            // Remove aria-hidden in case this was opened by a user
            // who uses AT (e.g. Screen Reader) and a mouse at the same time.
            this.elements.elSelectCustom.setAttribute("aria-hidden", 'false');
            if (this.optionChecked) {
                const optionCheckedIndex = this.elements.customOptsList.findIndex((el) => el.getAttribute("data-value") === this.optionChecked);
                this.updateCustomSelectHovered(optionCheckedIndex);
            }
            // Add related event listeners
            // document.addEventListener("click", this.watchClickOutside);
            document.addEventListener("keydown", this.supportKeyboardNavigation);
        };
        this.closeSelectCustom = () => {
            this.elements.elSelectCustom.classList.remove("isActive");
            this.elements.elSelectCustom.setAttribute("aria-hidden", 'true');
            this.updateCustomSelectHovered(-1);
            // Remove related event listeners
            // document.removeEventListener("click", this.watchClickOutside);
            document.removeEventListener("keydown", this.supportKeyboardNavigation);
        };
        this.updateCustomSelectHovered = (newIndex) => {
            const prevOption = this.elements.elSelectCustomOpts.children[this.optionHoveredIndex];
            const option = this.elements.elSelectCustomOpts.children[newIndex];
            if (prevOption) {
                prevOption.classList.remove("isHover");
            }
            if (option) {
                option.classList.add("isHover");
            }
            this.optionHoveredIndex = newIndex;
        };
        this.updateCustomSelectChecked = (value, text) => {
            var _a;
            if (this.elements) {
                if (!text)
                    text = (_a = this.elements.elSelectCustomOpts.querySelectorAll(`[data-value="${value}"]`)[0]) === null || _a === void 0 ? void 0 : _a.textContent;
                const prevValue = this.optionChecked;
                const elPrevOption = this.elements.elSelectCustomOpts.querySelector(`[data-value="${prevValue}"`);
                const elOption = this.elements.elSelectCustomOpts.querySelector(`[data-value="${value}"`);
                if (elPrevOption) {
                    elPrevOption.classList.remove("isActive");
                }
                if (elOption) {
                    elOption.classList.add("isActive");
                }
                const elSelectCustomBox = this.elements.elSelectCustom.children[0].children[0];
                elSelectCustomBox.textContent = text;
                this.optionChecked = value;
            }
        };
        this.watchClickOutside = (e) => {
            const didClickedOutside = !this.contains(e.target);
            if (didClickedOutside) {
                this.closeSelectCustom();
            }
        };
        this.supportKeyboardNavigation = (e) => {
            // TODO: Move these to globals and check existence
            // press down -> go next
            if (e.keyCode === 40 && this.optionHoveredIndex < this.optionsCount - 1) {
                this.optionHoveredIndex;
                e.preventDefault(); // prevent page scrolling
                this.updateCustomSelectHovered(this.optionHoveredIndex + 1);
            }
            // press up -> go previous
            if (e.keyCode === 38 && this.optionHoveredIndex > 0) {
                e.preventDefault(); // prevent page scrolling
                this.updateCustomSelectHovered(this.optionHoveredIndex - 1);
            }
            // press Enter or space -> select the option
            if (e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                const option = this.elements.elSelectCustomOpts.children[this.optionHoveredIndex];
                const value = option && option.getAttribute("data-value");
                if (value) {
                    this.elements.elSelectNative.value = value;
                    this.updateCustomSelectChecked(value, option.textContent);
                }
                this.closeSelectCustom();
            }
            // press ESC -> close selectCustom
            if (e.keyCode === 27) {
                this.closeSelectCustom();
            }
        };
        this.options = (_a = props.options) !== null && _a !== void 0 ? _a : [];
        if (props.onChange)
            this.onChange = props.onChange;
        if (props.label)
            this.label = props.label;
        if (props.persist)
            this.persist = props.persist;
        const val = getPersistent(props);
        // Only Use Cached Value if Included In Options
        if (val && this.options.includes(val))
            this.value = val;
    }
    static get styles() {
        return r$2 `

    #container { 
      position: relative;
    }

    :host * {
      box-sizing: border-box;
    }

    .selectNative, .selectCustom {
      position: relative;
      width: 100%;
      font-size: 15px;
    }

    
    .selectCustom {
      position: absolute;
      top: 0;
      left: 0;
      display: none;
      background: white;
    }
    
    .selectNative:focus,
    .selectCustom.isActive .selectCustom-trigger {
      outline: none;
      box-shadow: white 0 0 5px 2px;
    }
    

    .select {
      position: relative;
    }
    
    .selectLabel {
      display: block;
      font-weight: bold;
      margin-bottom: 0.4rem;
    }
    
    .selectNative, .selectCustom-trigger {
      border: 1px solid #6f6f6f;
      border-radius: 0.4rem;
    }
    
    .selectNative {
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
      background-repeat: no-repeat;
      background-position-x: 100%;
      background-position-y: 0.45rem;
      padding: 10px 10px;
    }
    
    .selectCustom-trigger  > div {
      overflow: scroll;
      white-space: nowrap;
    }

    .selectCustom-trigger {
      display: flex;
      align-items: center;
      position: relative;
      padding: 0px 10px;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    
    .selectCustom-trigger::after {
      content: "▾";
      position: absolute;
      top: 0;
      line-height: 3.2rem;
      right: 0.5rem;
    }
    
    .selectCustom-trigger:hover {
      border-color: #028ee6;
    }
    
    .selectCustom-options {
      position: absolute;
      top: calc(2.8rem + 0.8rem);
      left: 0;
      width: 100%;
      border: 1px solid #6f6f6f;
      border-radius: 0.4rem;
      background-color: whitesmoke;
      box-shadow: 0 0 4px #e9e1f8;
      z-index: 1;
      padding: 0.8rem 0;
      display: none;
    }
    
    .selectCustom.isActive .selectCustom-options {
      display: block;
    }
    
    .selectCustom-option {
      position: relative;
      padding: 0.8rem;
      padding-left: 2.5rem;
      font-size: 80%;
    }

    .selectCustom-option.isHover,
    .selectCustom-option:hover {
      background-color: #1ea7fd; // contrast AA
      color: white;
      cursor: default;
    }
    
    .selectCustom-option:not(:last-of-type)::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-bottom: 1px solid #d3d3d3;
    }
    
    .selectCustom-option.isActive::before {
      content: "✓";
      position: absolute;
      left: 0.8rem;
    }


    /* This makes the Custom Select work... 
      Issues: Doesn't work inside of another component (e.g. Control), it clicks on that instead
    @media (hover: hover) {
      
      .selectCustom {
        display: block;
      }
    
      .selectNative:focus + .selectCustom {
        display: none;
      }
    }
    */

    @media (prefers-color-scheme: dark) {
      .selectCustom {
        background: rgb(59, 59, 59);
      }

      .selectNative {
        background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
      }

      .selectCustom-options {
        background: rgb(45, 45, 45);
      }
    }
    `;
    }
    static get properties() {
        return Object.assign({
            options: {
                type: Array,
                reflect: true
            }
        }, PersistableProps);
    }
    willUpdate(changedProps) {
        var _a, _b, _c;
        if (changedProps.has('value'))
            setPersistent(this);
        if (changedProps.has('options')) {
            const firstOption = ((_b = (_a = this.options[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : this.options[0]);
            this.value = (_c = this.value) !== null && _c !== void 0 ? _c : firstOption;
        }
    }
    updated(changedProperties) {
        const elSelectNative = this.shadowRoot.querySelectorAll(".js-selectNative")[0];
        const elSelectCustom = this.shadowRoot.querySelectorAll(".js-selectCustom")[0];
        const elSelectCustomOpts = elSelectCustom.children[1];
        const customOptsList = Array.from(elSelectCustomOpts.children);
        this.optionsCount = customOptsList.length;
        this.elements = {
            elSelectNative,
            elSelectCustom,
            elSelectCustomOpts,
            customOptsList,
        };
        if (this.value)
            this.updateCustomSelectChecked(this.value);
    }
    render() {
        return $ `
      <div id=container>
      <select class="selectNative js-selectNative" aria-labelledby="${this.label}Label" 
      @change=${(e) => {
            // Update selectCustom value when selectNative is changed.
            const value = e.target.value;
            const elRespectiveCustomOption = this.elements.elSelectCustomOpts.querySelectorAll(`[data-value="${value}"]`)[0];
            this.updateCustomSelectChecked(value, elRespectiveCustomOption.textContent);
            // Original
            this.value = e.target.value;
            this.onChange(e); // forward change
        }}>
      ${(this.options.length === 0) ? $ `<slot></slot>` : this.options.map((o, i) => {
            if (typeof o != 'object')
                o = { value: o, text: o };
            return $ `<option 
          value=${o.value} 
          ?selected=${(o.value === this.value)} 
          >
            ${o.text}
          </option>`;
        })}
    </select>

    <div class="selectCustom js-selectCustom" aria-hidden="true"}>
      <div class="selectCustom-trigger" @click=${(e) => {
            const isClosed = !e.target.parentNode.classList.contains("isActive");
            if (isClosed) {
                this.openSelectCustom();
            }
            else {
                this.closeSelectCustom();
            }
        }}>
        <div></div>
      </div>
        <div class="selectCustom-options">
        ${this.options.map((o, i) => {
            if (typeof o != 'object')
                o = { value: o, text: o };
            return $ ` <div 
          class="selectCustom-option" 
          data-value=${o.value}
          @mouseenter=${(e) => {
                this.updateCustomSelectHovered(i);
            }}
          @click=${(e) => {
                const value = e.target.getAttribute("data-value");
                // Sync native select to have the same value
                this.elements.elSelectNative.value = value;
                this.updateCustomSelectChecked(value, e.target.textContent);
                this.closeSelectCustom();
            }}
          >
            ${o.text}
          </div>`;
        })}
          </div>
        </div>
      </div>
    </div>
    `;
    }
}
customElements.define('visualscript-select', Select);

class File extends s {
    constructor(props = {}) {
        super();
        this.onChange = () => { };
        if (props.accept)
            this.accept = props.accept;
        if (props.onChange)
            this.onChange = props.onChange;
        if (props.webkitdirectory)
            this.webkitdirectory = props.webkitdirectory;
        if (props.directory)
            this.directory = props.directory;
        if (props.multiple)
            this.multiple = props.multiple;
    }
    static get styles() {
        return r$2 `

    :host {
      display: flex;
      justify-content: center;
      overflow: hidden;
    }
    
    input[type=file] {
      display: none;
    }

    :host * {
      box-sizing: border-box;
    }
    
    button {
      flex: auto;
      padding: 8px 12px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      border: none;  
      color: #ffffff;
      background-color: #1ea7fd;
      width: 100%;
      cursor: pointer;    
      /* white-space: nowrap; */
      font-weight: bold;
    }

    .hide {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      border: 0;
    }

    input[type=text] {
      flex-grow: 1;
      padding: 10px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      border: none;
      overflow: hidden;
    }

    input[type=text] {
      flex-grow: 1;
      padding: 8px 8px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      border: none;
      color: black;
      background-color: white;
    }

    @media (prefers-color-scheme: dark) {
      input[type=text] {
        color: white;
        background-color: rgb(59, 59, 59);
      }
    }
    
    `;
    }
    static get properties() {
        return {
            accept: {
                type: String,
                reflect: true
            },
            onChange: {
                type: Function,
                reflect: true
            },
            webkitdirectory: {
                type: Boolean,
                reflect: true
            },
            directory: {
                type: Boolean,
                reflect: true
            },
            multiple: {
                type: Boolean,
                reflect: true
            },
        };
    }
    render() {
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'fileupload';
        input.accept = this.accept;
        input.webkitdirectory = this.webkitdirectory;
        input.directory = this.directory;
        input.multiple = this.multiple;
        input.onchange = (ev) => {
            const lenFiles = ev.target.files.length;
            const fileUploaded = ev.target.files[0];
            const input = this.shadowRoot.querySelector('input[type=text]');
            var filename = (lenFiles === 1) ? fileUploaded.name : `${lenFiles} files`;
            input.value = filename;
            input.placeholder = filename;
            input.focus();
            this.onChange(ev);
        };
        return $ `
      <label for="fileupload" id="buttonlabel">
        <button aria-controls="filename" tabindex="0" @click=${() => {
            if (input)
                input.click();
        }}>Choose File</button>
      </label>
      ${input}
      <label for="filename" class="hide">
        uploaded file
      </label>
      <input type="text" id="filename" autocomplete="off" readonly placeholder="no file chosen">  
    `;
    }
}
customElements.define('visualscript-file', File);

class Switch extends s {
    constructor(props = {}) {
        super();
        this.persist = false;
        this.onChange = () => { };
        if (props.onChange)
            this.onChange = props.onChange;
        if (props.label)
            this.label = props.label;
        if (props.persist)
            this.persist = props.persist;
        // Inside Control
        const val = getPersistent(props);
        if (val)
            this.value = val;
    }
    static get styles() {
        return r$2 `

    :host * {
      box-sizing: border-box;
    }

    [role="switch"] {  
      position: relative;
      border-radius: 0.5rem;
      padding: 1em 2em;
      cursor: pointer;
      background-color: white;
      border: none;
      border-radius: 14px;
      -webkit-transition: .4s;
      transition: .4s;
    }

    [role="switch"] * {
      pointer-events: none;
    }


    [role="switch"][aria-pressed="true"] {
      background-color: #1ea7fd;
    }

    [role="switch"][aria-pressed="true"] > .slider{
      -webkit-transform: translateY(-50%) translateX(100%);
      -ms-transform: translateY(-50%) translateX(100%);
      transform: translateY(-50%) translateX(100%);
    }

    /* Remove the default outline and 
    add the outset shadow */  
    [aria-pressed]:focus {
      outline: none;
      box-shadow: white 0 0 5px 2px;
    }

    /* The slider */
    .slider {
      padding: 3px;
      position: absolute;
      cursor: pointer;
      top: 50%;
      left: 0;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      -webkit-transition: .4s;
      transition: .4s;
      height: 100%;
      aspect-ratio: 1/1;
    }
    .slider > * {
      background-color: #ccc;
      width: 100%;
      height: 100%;
    }

    /* Rounded sliders */
    .slider.round > * {
      border-radius: 34px;
    }

    `;
    }
    static get properties() {
        return PersistableProps;
    }
    willUpdate(changedProps) {
        if (changedProps.has('value'))
            setPersistent(this);
    }
    render() {
        return $ `
      <button class="switch" role="switch" aria-pressed="${String(this.value)}" aria-labelledby=${this.label} @click=${(e) => {
            let pressed = e.target.getAttribute('aria-pressed') === 'true';
            this.value = !pressed;
            e.target.setAttribute('aria-pressed', String(this.value));
            this.onChange(e);
        }}>
        <div class="slider round"><div></div></div>
    </button>
    `;
    }
}
customElements.define('visualscript-switch', Switch);

class Range extends s {
    constructor(props = {}) {
        super();
        this.persist = false;
        this.value = 0;
        this.min = 0;
        this.max = 100;
        this.onChange = () => { };
        this.onInput = () => { };
        if (props.onChange)
            this.onChange = props.onChange;
        if (props.label)
            this.label = props.label;
        if (props.persist)
            this.persist = props.persist;
        if (props.min)
            this.min = props.min;
        if (props.max)
            this.max = props.max;
        const val = getPersistent(props);
        if (val)
            this.value = val;
    }
    static get styles() {
        return r$2 `

    :host {
      width: 100%;
      height: 100%;
    }

    :host * {
      box-sizing: border-box;
    }

    .wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    input[type="range"] {
      -webkit-appearance: none;
      position: relative;
      overflow: hidden;
      height: 30%;
      width: 100%;
      cursor: pointer;
      border: none;
      margin: 0;
  }
  
  output {
      position: absolute; 
      user-select: none; 
      pointer-events: none; 
      z-index: 1;
      top: 50%;
      left: 10px;
      transform: translate(0%, calc(-50% - 0.12rem));
      font-size: 80%;
  }
  
  input[type="range"]::-webkit-slider-runnable-track {
  }
  
  input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 0; /* 1 */
      height: 20px;
      box-shadow: -100vw 0 0 100vw #1ea7fd;
      opacity: 0.9;
      transition: opacity 0.5s;
  }
  
  input[type="range"]:hover::-webkit-slider-thumb{
      opacity: 1;
  }
  
  input[type="range"]::-moz-range-track {

  }
  
    .visually-hidden { 
        position: absolute !important;
        height: 1px; 
        width: 1px;
        overflow: hidden;
        clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
        clip: rect(1px, 1px, 1px, 1px);
        white-space: nowrap; /* added line */
    }

    `;
    }
    static get properties() {
        return Object.assign(PersistableProps, {
            min: {
                type: Number,
                reflect: true
            },
            max: {
                type: Number,
                reflect: true
            }
        });
    }
    willUpdate(changedProps) {
        if (changedProps.has('value'))
            setPersistent(this);
    }
    render() {
        return $ `
      <div class="wrapper">
        <input type="range" min="${this.min}" max="${this.max}" id="${this.label}" @change=${(ev) => {
            this.value = ev.target.value;
            this.onChange(ev);
        }} @input=${(ev) => {
            this.onInput(ev);
        }}/>
        <output for="${this.label}">${this.value}</output>
        <label class="visually-hidden" for="${this.label}">${this.label}</label>
      </div>
    `;
    }
}
customElements.define('visualscript-range', Range);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

const colorscales$1 = ['Hot', 'Cold', 'YlGnBu', 'YlOrRd', 'RdBu', 'Portland', 'Picnic', 'Jet', 'Greys', 'Greens', 'Electric', 'Earth', 'Bluered', 'Blackbody'];
class TimeSeries extends s {
    constructor(props = {}) {
        var _a;
        super();
        this.colorscale = 'Electric';
        this.div = document.createElement('div');
        this.data = [];
        this.plotData = [];
        this.layout = {};
        this.windowSize = 300;
        this.binWidth = 256;
        this.colorscales = colorscales$1;
        this.config = {};
        this.getTraces = () => {
            return this.data.map(o => Object.assign({
                type: "scatter",
                mode: "lines",
                // line: {color: '#000000'}
                // name: 'Voltage',
            }, o));
        };
        this.getConfig = () => {
            return Object.assign({
                displaylogo: false,
                responsive: true
            }, this.config);
        };
        this.getLayout = () => {
            return Object.assign({
            // title: 'Basic Time Series',
            // responsive: true,
            // autosize: true
            }, this.layout);
        };
        this.data = (_a = props.data) !== null && _a !== void 0 ? _a : [];
        if (props.layout)
            this.layout = props.layout;
        if (window.Plotly)
            props.Plotly = window.Plotly;
        if (props.colorscale)
            this.colorscale = props.colorscale;
        if (props.onClick)
            this.onClick = props.onClick;
        if (props.onLegendClick)
            this.onLegendClick = props.onLegendClick;
        if (props.config)
            this.config = props.config;
        if (props.Plotly) {
            this.Plotly = props.Plotly;
            this.Plotly.newPlot(this.div, this.getTraces(), this.getLayout(), this.getConfig());
        }
        else
            console.warn('<visualscript-timeseries->: Plotly instance not provided...');
        // window.addEventListener('resize', this.resize)
        // let observer = new ResizeObserver(() => this.resize());
        // observer.observe(this.div);
    }
    static get styles() {
        return r$2 `

      :host {
        overflow: hidden;
      }
      
      `;
    }
    createRenderRoot() {
        return this;
    }
    static get properties() {
        return {
            max: {
                type: Number,
                reflect: true
            },
            data: {
                type: Array,
                reflect: true
            },
            layout: {
                type: Object,
                reflect: true,
            },
            config: {
                type: Object,
                reflect: true,
            },
            colorscale: {
                type: Object,
                reflect: true
            },
            backgroundColor: {
                type: String,
                reflect: true,
            },
            onLegendClick: {
                type: Function,
                reflect: true,
            },
            onClick: {
                type: Function,
                reflect: true,
            },
        };
    }
    // resize = () => {
    //   this.Plotly.relayout(this.div, {
    //     'xaxis.autorange': true,
    //     'yaxis.autorange': true
    //   })
    // }
    transpose(a) {
        return Object.keys(a[0]).map(function (c) {
            return a.map(function (r) { return r[c]; });
        });
    }
    willUpdate(changedProps) {
        if (changedProps.has('data')) {
            this.Plotly.newPlot(this.div, this.getTraces(), this.getLayout(), this.getConfig());
        }
        if (changedProps.has('onClick')) {
            this.div.on('plotly_click', this.onClick);
        }
        if (changedProps.has('onLegendClick')) {
            this.div.on('plotly_legendclick', this.onLegendClick);
        }
    }
    //   updateData = (newData) => {
    //     // For a fixed window size,
    //     // Push the latest data and remove the first element
    //     if (!Array.isArray(newData[0])) newData = [newData]
    //     newData.forEach(d => {
    //       if(this.data.length > this.windowSize) {
    //         this.data.push(d)
    //         this.data.splice(0, 1)
    //       } else {
    //         this.data.push(d);
    //       }
    //     })
    //   this.plotData[0].z[0] = transpose(this.data)
    //     const ticRes = performance.now()
    //     Plotly.restyle(this.div, 'z', this.plotData[0].z);
    //     const tocRes = performance.now()
    //     console.log('Restyle', tocRes - ticRes)
    //     // const ticUp = performance.now()
    //     // Plotly.update(this.div, this.plotData[0])
    //     // const tocUp = performance.now()
    //     // console.log('Update', tocUp - ticUp)
    // //     const ticAn = performance.now()
    // //     Plotly.animate(this.div, {
    // //       data: [{z: this.plotData[0].z, type: 'heatmap'}],
    // //   }, {
    // //       transition: {duration: 0},
    // //       frame: {duration: 0, redraw: true}
    // //   });
    // //   const tocAn = performance.now()
    //   // console.log('Animate', tocAn - ticAn)
    //   }
    render() {
        return this.div;
    }
}
TimeSeries.colorscales = colorscales$1;
customElements.define('visualscript-timeseries', TimeSeries);

const colorscales = ['Hot', 'Cold', 'YlGnBu', 'YlOrRd', 'RdBu', 'Portland', 'Picnic', 'Jet', 'Greys', 'Greens', 'Electric', 'Earth', 'Bluered', 'Blackbody'];
class Spectrogram extends s {
    constructor(props = {}) {
        var _a;
        super();
        this.colorscale = 'Electric';
        this.div = document.createElement('div');
        this.data = [];
        this.plotData = [];
        this.layout = {};
        this.windowSize = 300;
        this.binWidth = 256;
        this.config = {};
        this.colorscales = colorscales;
        this.getConfig = () => {
            return Object.assign({
                displaylogo: false,
                responsive: true
            }, this.config);
        };
        this.data = (_a = props.data) !== null && _a !== void 0 ? _a : [[]];
        if (props.colorscale)
            this.colorscale = props.colorscale;
        if (props.config)
            this.config = props.config;
        if (window.Plotly)
            props.Plotly = window.Plotly;
        this.plotData = [
            {
                x: [1, 2],
                z: this.transpose(this.data),
                showscale: true,
                colorscale: this.colorscale,
                type: 'heatmap'
            }
        ];
        this.layout = {
        // responsive: true,
        // autosize: true // set autosize to rescale
        };
        if (props.Plotly) {
            this.Plotly = props.Plotly;
            this.Plotly.newPlot(this.div, this.plotData, this.layout, this.getConfig());
        }
        else
            console.warn('<-spectrogram>: Plotly instance not provided...');
        // window.addEventListener('resize', this.resize)
        // let observer = new ResizeObserver(() => this.resize());
        // observer.observe(this.div);
    }
    static get styles() {
        return r$2 `

      `;
    }
    createRenderRoot() {
        return this;
    }
    static get properties() {
        return {
            max: {
                type: Number,
                reflect: true
            },
            data: {
                type: Array,
                reflect: true
            },
            config: {
                type: Object,
                reflect: true
            },
            colorscale: {
                type: Object,
                reflect: true
            },
            backgroundColor: {
                type: String,
                reflect: true,
            },
        };
    }
    // resize = () => {
    //   this.Plotly.relayout(this.div, {
    //     'xaxis.autorange': true,
    //     'yaxis.autorange': true
    //   })
    // }
    transpose(a) {
        return Object.keys(a[0]).map(function (c) {
            return a.map(function (r) { return r[c]; });
        });
    }
    willUpdate(changedProps) {
        if (changedProps.has('colorscale')) {
            if (!Array.isArray(this.colorscale) && !this.colorscales.includes(this.colorscale))
                this.colorscale = 'Electric';
            this.Plotly.restyle(this.div, 'colorscale', this.colorscale);
        }
        if (changedProps.has('data')) {
            this.plotData[0].z = this.transpose(this.data);
            this.Plotly.newPlot(this.div, this.plotData, this.layout, this.getConfig());
        }
    }
    //   updateData = (newData) => {
    //     // For a fixed window size,
    //     // Push the latest data and remove the first element
    //     if (!Array.isArray(newData[0])) newData = [newData]
    //     newData.forEach(d => {
    //       if(this.data.length > this.windowSize) {
    //         this.data.push(d)
    //         this.data.splice(0, 1)
    //       } else {
    //         this.data.push(d);
    //       }
    //     })
    //   this.plotData[0].z[0] = transpose(this.data)
    //     const ticRes = performance.now()
    //     Plotly.restyle(this.div, 'z', this.plotData[0].z);
    //     const tocRes = performance.now()
    //     console.log('Restyle', tocRes - ticRes)
    //     // const ticUp = performance.now()
    //     // Plotly.update(this.div, this.plotData[0])
    //     // const tocUp = performance.now()
    //     // console.log('Update', tocUp - ticUp)
    // //     const ticAn = performance.now()
    // //     Plotly.animate(this.div, {
    // //       data: [{z: this.plotData[0].z, type: 'heatmap'}],
    // //   }, {
    // //       transition: {duration: 0},
    // //       frame: {duration: 0, redraw: true}
    // //   });
    // //   const tocAn = performance.now()
    //   // console.log('Animate', tocAn - ticAn)
    //   }
    render() {
        return this.div;
    }
}
Spectrogram.colorscales = colorscales;
customElements.define('visualscript-spectrogram', Spectrogram);

class ObjectEditor extends s {
    constructor(props = { target: {}, header: 'Object' }) {
        var _a, _b, _c;
        super();
        this.history = [];
        this.getMode = (target, plot) => {
            return (plot) ? 'plot' : 'view';
        };
        this.set = (target = {}, plot = false) => __awaiter(this, void 0, void 0, function* () {
            if (this.preprocess instanceof Function)
                this.target = yield this.preprocess(target);
            else
                this.target = target;
            this.keys = Object.keys(this.target);
            this.mode = this.getMode(this.target, plot);
        });
        this.checkToPlot = (key, o) => this.plot.reduce((a, f) => a + f(key, o), 0) === this.plot.length;
        this.getActions = (key, o) => {
            let actions;
            if (typeof o[key] === 'object') {
                const mode = this.getMode(o[key], this.checkToPlot(key, o));
                actions = $ `<visualscript-button primary=true size="small" @click="${() => __awaiter(this, void 0, void 0, function* () {
                    this.history.push({ parent: o, key: this.header });
                    yield this.set(o[key], this.checkToPlot(key, o));
                    this.header = key;
                })}">${mode[0].toUpperCase() + mode.slice(1)}</visualscript-button>`;
            }
            return $ `
      <div class="actions">
            ${actions}
      </div>
      `;
        };
        this.getElement = (key, o) => {
            let display;
            if (typeof o[key] === 'string' && o[key].includes('data:image')) {
                display = document.createElement('img');
                display.src = o[key];
                display.style.height = '100%';
            }
            else {
                display = new Input();
                display.value = o[key];
                display.oninput = () => {
                    o[key] = display.value; // Modify original data
                };
            }
            const isObject = typeof o[key] === 'object';
            return $ `
        <div class="attribute separate">
        <div class="info">
          <span class="name">${key}</span><br>
          <span class="value">${(isObject
                ? (Object.keys(o[key]).length ? o[key].constructor.name : $ `Empty ${o[key].constructor.name}`)
                : '')}</span>
        </div>
          ${isObject ? this.getActions(key, o) : display}
        </div>`;
        };
        this.set(props.target);
        this.header = (_a = props.header) !== null && _a !== void 0 ? _a : 'Object';
        this.mode = (_b = props.mode) !== null && _b !== void 0 ? _b : 'view';
        this.plot = (_c = props.plot) !== null && _c !== void 0 ? _c : [];
        this.onPlot = props.onPlot;
        if (props.preprocess)
            this.preprocess = props.preprocess;
        this.timeseries = new TimeSeries({
            data: []
        });
    }
    static get styles() {
        return r$2 `

    :host * {
      box-sizing: border-box;
    }

    :host > * {
      background: white;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 1px 5px 0 rgb(0 0 0 / 20%);
    }

    img {
      max-height: 100px;
    }

    .header {
      padding: 10px 20px;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      font-size: 70%;
      border-bottom: 1px solid #e3e3e3;
    }

    .header span {
      font-weight: 800;
      font-size: 120%;
    }

    .container {
      width: 100%;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      position: relative;
    }

    .separate {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .attribute {
      width: 100%;
      font-size: 90%;
      padding: 15px;
      flex-grow: 1;
      flex-wrap: wrap;
    }

    .info {
      display: flex;
      align-items: center;
    }

    .name {
      font-weight: 800;
      padding-right: 10px;
    }

    .value {
      font-size: 80%;
    }

    @media (prefers-color-scheme: dark) {
      :host > * {
        background-color: rgb(60, 60, 60);
        box-shadow: 0 1px 5px 0 rgb(255 255 255 / 20%);
      }

      .header {
        border-bottom: 1px solid gray;
      }
    }

    `;
    }
    static get properties() {
        return {
            // target: {
            //   type: Object,
            //   reflect: false,
            // },
            keys: {
                type: Object,
                reflect: true,
            },
            plot: {
                type: Object,
                reflect: true,
            },
            header: {
                type: String,
                reflect: true,
            },
            mode: {
                type: String,
                reflect: true,
            },
            onPlot: {
                type: Function,
                reflect: true,
            },
            preprocess: {
                type: Function,
                reflect: true,
            },
        };
    }
    render() {
        var _a;
        if (this.mode === 'plot') {
            if (this.onPlot instanceof Function)
                this.onPlot(this);
            this.insertAdjacentElement('afterend', this.timeseries);
        }
        else
            this.timeseries.remove();
        return $ `
      <div>
        <div class="header separate">
          <span>${this.header}</span>
          ${(this.history.length > 0) ? $ `<visualscript-button size="extra-small" @click="${() => {
            const historyItem = this.history.pop();
            this.set(historyItem.parent);
            this.header = historyItem.key;
        }}">Go Back</visualscript-button>` : ``}
        </div>
        <div class="container">
              ${(this.mode === 'view'
            ? (_a = this.keys) === null || _a === void 0 ? void 0 : _a.map(key => this.getElement(key, this.target))
            : '')}
        </div>
      </div>
    `;
    }
}
customElements.define('visualscript-object-editor', ObjectEditor);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var prism = {exports: {}};

(function (module) {
  /* **********************************************
       Begin prism-core.js
  ********************************************** */
  /// <reference lib="WebWorker"/>
  var _self = typeof window !== 'undefined' ? window // if in browser
  : typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self // if in worker
  : {} // if in node js
  ;
  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   */


  var Prism = function (_self) {
    // Private helper vars
    var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
    var uniqueId = 0; // The grammar object for plaintext

    var plainTextGrammar = {};
    var _ = {
      /**
       * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
       * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
       * additional languages or plugins yourself.
       *
       * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
       *
       * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.manual = true;
       * // add a new <script> to load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      manual: _self.Prism && _self.Prism.manual,

      /**
       * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
       * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
       * own worker, you don't want it to do this.
       *
       * By setting this value to `true`, Prism will not add its own listeners to the worker.
       *
       * You obviously have to change this value before Prism executes. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.disableWorkerMessageHandler = true;
       * // Load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,

      /**
       * A namespace for utility methods.
       *
       * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
       * change or disappear at any time.
       *
       * @namespace
       * @memberof Prism
       */
      util: {
        encode: function encode(tokens) {
          if (tokens instanceof Token) {
            return new Token(tokens.type, encode(tokens.content), tokens.alias);
          } else if (Array.isArray(tokens)) {
            return tokens.map(encode);
          } else {
            return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
          }
        },

        /**
         * Returns the name of the type of the given value.
         *
         * @param {any} o
         * @returns {string}
         * @example
         * type(null)      === 'Null'
         * type(undefined) === 'Undefined'
         * type(123)       === 'Number'
         * type('foo')     === 'String'
         * type(true)      === 'Boolean'
         * type([1, 2])    === 'Array'
         * type({})        === 'Object'
         * type(String)    === 'Function'
         * type(/abc+/)    === 'RegExp'
         */
        type: function (o) {
          return Object.prototype.toString.call(o).slice(8, -1);
        },

        /**
         * Returns a unique number for the given object. Later calls will still return the same number.
         *
         * @param {Object} obj
         * @returns {number}
         */
        objId: function (obj) {
          if (!obj['__id']) {
            Object.defineProperty(obj, '__id', {
              value: ++uniqueId
            });
          }

          return obj['__id'];
        },

        /**
         * Creates a deep clone of the given object.
         *
         * The main intended use of this function is to clone language definitions.
         *
         * @param {T} o
         * @param {Record<number, any>} [visited]
         * @returns {T}
         * @template T
         */
        clone: function deepClone(o, visited) {
          visited = visited || {};
          var clone;
          var id;

          switch (_.util.type(o)) {
            case 'Object':
              id = _.util.objId(o);

              if (visited[id]) {
                return visited[id];
              }

              clone =
              /** @type {Record<string, any>} */
              {};
              visited[id] = clone;

              for (var key in o) {
                if (o.hasOwnProperty(key)) {
                  clone[key] = deepClone(o[key], visited);
                }
              }

              return (
                /** @type {any} */
                clone
              );

            case 'Array':
              id = _.util.objId(o);

              if (visited[id]) {
                return visited[id];
              }

              clone = [];
              visited[id] = clone;

              /** @type {Array} */

              /** @type {any} */
              o.forEach(function (v, i) {
                clone[i] = deepClone(v, visited);
              });
              return (
                /** @type {any} */
                clone
              );

            default:
              return o;
          }
        },

        /**
         * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
         *
         * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
         *
         * @param {Element} element
         * @returns {string}
         */
        getLanguage: function (element) {
          while (element) {
            var m = lang.exec(element.className);

            if (m) {
              return m[1].toLowerCase();
            }

            element = element.parentElement;
          }

          return 'none';
        },

        /**
         * Sets the Prism `language-xxxx` class of the given element.
         *
         * @param {Element} element
         * @param {string} language
         * @returns {void}
         */
        setLanguage: function (element, language) {
          // remove all `language-xxxx` classes
          // (this might leave behind a leading space)
          element.className = element.className.replace(RegExp(lang, 'gi'), ''); // add the new `language-xxxx` class
          // (using `classList` will automatically clean up spaces for us)

          element.classList.add('language-' + language);
        },

        /**
         * Returns the script element that is currently executing.
         *
         * This does __not__ work for line script element.
         *
         * @returns {HTMLScriptElement | null}
         */
        currentScript: function () {
          if (typeof document === 'undefined') {
            return null;
          }

          if ('currentScript' in document && 1 < 2
          /* hack to trip TS' flow analysis */
          ) {
            return (
              /** @type {any} */
              document.currentScript
            );
          } // IE11 workaround
          // we'll get the src of the current script by parsing IE11's error stack trace
          // this will not work for inline scripts


          try {
            throw new Error();
          } catch (err) {
            // Get file src url from stack. Specifically works with the format of stack traces in IE.
            // A stack will look like this:
            //
            // Error
            //    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
            //    at Global code (http://localhost/components/prism-core.js:606:1)
            var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];

            if (src) {
              var scripts = document.getElementsByTagName('script');

              for (var i in scripts) {
                if (scripts[i].src == src) {
                  return scripts[i];
                }
              }
            }

            return null;
          }
        },

        /**
         * Returns whether a given class is active for `element`.
         *
         * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
         * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
         * given class is just the given class with a `no-` prefix.
         *
         * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
         * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
         * ancestors have the given class or the negated version of it, then the default activation will be returned.
         *
         * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
         * version of it, the class is considered active.
         *
         * @param {Element} element
         * @param {string} className
         * @param {boolean} [defaultActivation=false]
         * @returns {boolean}
         */
        isActive: function (element, className, defaultActivation) {
          var no = 'no-' + className;

          while (element) {
            var classList = element.classList;

            if (classList.contains(className)) {
              return true;
            }

            if (classList.contains(no)) {
              return false;
            }

            element = element.parentElement;
          }

          return !!defaultActivation;
        }
      },

      /**
       * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
       *
       * @namespace
       * @memberof Prism
       * @public
       */
      languages: {
        /**
         * The grammar for plain, unformatted text.
         */
        plain: plainTextGrammar,
        plaintext: plainTextGrammar,
        text: plainTextGrammar,
        txt: plainTextGrammar,

        /**
         * Creates a deep copy of the language with the given id and appends the given tokens.
         *
         * If a token in `redef` also appears in the copied language, then the existing token in the copied language
         * will be overwritten at its original position.
         *
         * ## Best practices
         *
         * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
         * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
         * understand the language definition because, normally, the order of tokens matters in Prism grammars.
         *
         * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
         * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
         *
         * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
         * @param {Grammar} redef The new tokens to append.
         * @returns {Grammar} The new language created.
         * @public
         * @example
         * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
         *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
         *     // at its original position
         *     'comment': { ... },
         *     // CSS doesn't have a 'color' token, so this token will be appended
         *     'color': /\b(?:red|green|blue)\b/
         * });
         */
        extend: function (id, redef) {
          var lang = _.util.clone(_.languages[id]);

          for (var key in redef) {
            lang[key] = redef[key];
          }

          return lang;
        },

        /**
         * Inserts tokens _before_ another token in a language definition or any other grammar.
         *
         * ## Usage
         *
         * This helper method makes it easy to modify existing languages. For example, the CSS language definition
         * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
         * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
         * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
         * this:
         *
         * ```js
         * Prism.languages.markup.style = {
         *     // token
         * };
         * ```
         *
         * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
         * before existing tokens. For the CSS example above, you would use it like this:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'cdata', {
         *     'style': {
         *         // token
         *     }
         * });
         * ```
         *
         * ## Special cases
         *
         * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
         * will be ignored.
         *
         * This behavior can be used to insert tokens after `before`:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'comment', {
         *     'comment': Prism.languages.markup.comment,
         *     // tokens after 'comment'
         * });
         * ```
         *
         * ## Limitations
         *
         * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
         * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
         * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
         * deleting properties which is necessary to insert at arbitrary positions.
         *
         * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
         * Instead, it will create a new object and replace all references to the target object with the new one. This
         * can be done without temporarily deleting properties, so the iteration order is well-defined.
         *
         * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
         * you hold the target object in a variable, then the value of the variable will not change.
         *
         * ```js
         * var oldMarkup = Prism.languages.markup;
         * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
         *
         * assert(oldMarkup !== Prism.languages.markup);
         * assert(newMarkup === Prism.languages.markup);
         * ```
         *
         * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
         * object to be modified.
         * @param {string} before The key to insert before.
         * @param {Grammar} insert An object containing the key-value pairs to be inserted.
         * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
         * object to be modified.
         *
         * Defaults to `Prism.languages`.
         * @returns {Grammar} The new grammar object.
         * @public
         */
        insertBefore: function (inside, before, insert, root) {
          root = root ||
          /** @type {any} */
          _.languages;
          var grammar = root[inside];
          /** @type {Grammar} */

          var ret = {};

          for (var token in grammar) {
            if (grammar.hasOwnProperty(token)) {
              if (token == before) {
                for (var newToken in insert) {
                  if (insert.hasOwnProperty(newToken)) {
                    ret[newToken] = insert[newToken];
                  }
                }
              } // Do not insert token which also occur in insert. See #1525


              if (!insert.hasOwnProperty(token)) {
                ret[token] = grammar[token];
              }
            }
          }

          var old = root[inside];
          root[inside] = ret; // Update references in other language definitions

          _.languages.DFS(_.languages, function (key, value) {
            if (value === old && key != inside) {
              this[key] = ret;
            }
          });

          return ret;
        },
        // Traverse a language definition with Depth First Search
        DFS: function DFS(o, callback, type, visited) {
          visited = visited || {};
          var objId = _.util.objId;

          for (var i in o) {
            if (o.hasOwnProperty(i)) {
              callback.call(o, i, o[i], type || i);
              var property = o[i];

              var propertyType = _.util.type(property);

              if (propertyType === 'Object' && !visited[objId(property)]) {
                visited[objId(property)] = true;
                DFS(property, callback, null, visited);
              } else if (propertyType === 'Array' && !visited[objId(property)]) {
                visited[objId(property)] = true;
                DFS(property, callback, i, visited);
              }
            }
          }
        }
      },
      plugins: {},

      /**
       * This is the most high-level function in Prism’s API.
       * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
       * each one of them.
       *
       * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
       *
       * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
       * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
       * @memberof Prism
       * @public
       */
      highlightAll: function (async, callback) {
        _.highlightAllUnder(document, async, callback);
      },

      /**
       * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
       * {@link Prism.highlightElement} on each one of them.
       *
       * The following hooks will be run:
       * 1. `before-highlightall`
       * 2. `before-all-elements-highlight`
       * 3. All hooks of {@link Prism.highlightElement} for each element.
       *
       * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
       * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
       * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
       * @memberof Prism
       * @public
       */
      highlightAllUnder: function (container, async, callback) {
        var env = {
          callback: callback,
          container: container,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };

        _.hooks.run('before-highlightall', env);

        env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

        _.hooks.run('before-all-elements-highlight', env);

        for (var i = 0, element; element = env.elements[i++];) {
          _.highlightElement(element, async === true, env.callback);
        }
      },

      /**
       * Highlights the code inside a single element.
       *
       * The following hooks will be run:
       * 1. `before-sanity-check`
       * 2. `before-highlight`
       * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
       * 4. `before-insert`
       * 5. `after-highlight`
       * 6. `complete`
       *
       * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
       * the element's language.
       *
       * @param {Element} element The element containing the code.
       * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
       * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
       * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
       * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
       *
       * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
       * asynchronous highlighting to work. You can build your own bundle on the
       * [Download page](https://prismjs.com/download.html).
       * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
       * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
       * @memberof Prism
       * @public
       */
      highlightElement: function (element, async, callback) {
        // Find language
        var language = _.util.getLanguage(element);

        var grammar = _.languages[language]; // Set language on the element, if not present

        _.util.setLanguage(element, language); // Set language on the parent, for styling


        var parent = element.parentElement;

        if (parent && parent.nodeName.toLowerCase() === 'pre') {
          _.util.setLanguage(parent, language);
        }

        var code = element.textContent;
        var env = {
          element: element,
          language: language,
          grammar: grammar,
          code: code
        };

        function insertHighlightedCode(highlightedCode) {
          env.highlightedCode = highlightedCode;

          _.hooks.run('before-insert', env);

          env.element.innerHTML = env.highlightedCode;

          _.hooks.run('after-highlight', env);

          _.hooks.run('complete', env);

          callback && callback.call(env.element);
        }

        _.hooks.run('before-sanity-check', env); // plugins may change/add the parent/element


        parent = env.element.parentElement;

        if (parent && parent.nodeName.toLowerCase() === 'pre' && !parent.hasAttribute('tabindex')) {
          parent.setAttribute('tabindex', '0');
        }

        if (!env.code) {
          _.hooks.run('complete', env);

          callback && callback.call(env.element);
          return;
        }

        _.hooks.run('before-highlight', env);

        if (!env.grammar) {
          insertHighlightedCode(_.util.encode(env.code));
          return;
        }

        if (async && _self.Worker) {
          var worker = new Worker(_.filename);

          worker.onmessage = function (evt) {
            insertHighlightedCode(evt.data);
          };

          worker.postMessage(JSON.stringify({
            language: env.language,
            code: env.code,
            immediateClose: true
          }));
        } else {
          insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
        }
      },

      /**
       * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
       * and the language definitions to use, and returns a string with the HTML produced.
       *
       * The following hooks will be run:
       * 1. `before-tokenize`
       * 2. `after-tokenize`
       * 3. `wrap`: On each {@link Token}.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @param {string} language The name of the language definition passed to `grammar`.
       * @returns {string} The highlighted HTML.
       * @memberof Prism
       * @public
       * @example
       * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
       */
      highlight: function (text, grammar, language) {
        var env = {
          code: text,
          grammar: grammar,
          language: language
        };

        _.hooks.run('before-tokenize', env);

        if (!env.grammar) {
          throw new Error('The language "' + env.language + '" has no grammar.');
        }

        env.tokens = _.tokenize(env.code, env.grammar);

        _.hooks.run('after-tokenize', env);

        return Token.stringify(_.util.encode(env.tokens), env.language);
      },

      /**
       * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
       * and the language definitions to use, and returns an array with the tokenized code.
       *
       * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
       *
       * This method could be useful in other contexts as well, as a very crude parser.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @returns {TokenStream} An array of strings and tokens, a token stream.
       * @memberof Prism
       * @public
       * @example
       * let code = `var foo = 0;`;
       * let tokens = Prism.tokenize(code, Prism.languages.javascript);
       * tokens.forEach(token => {
       *     if (token instanceof Prism.Token && token.type === 'number') {
       *         console.log(`Found numeric literal: ${token.content}`);
       *     }
       * });
       */
      tokenize: function (text, grammar) {
        var rest = grammar.rest;

        if (rest) {
          for (var token in rest) {
            grammar[token] = rest[token];
          }

          delete grammar.rest;
        }

        var tokenList = new LinkedList();
        addAfter(tokenList, tokenList.head, text);
        matchGrammar(text, tokenList, grammar, tokenList.head, 0);
        return toArray(tokenList);
      },

      /**
       * @namespace
       * @memberof Prism
       * @public
       */
      hooks: {
        all: {},

        /**
         * Adds the given callback to the list of callbacks for the given hook.
         *
         * The callback will be invoked when the hook it is registered for is run.
         * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
         *
         * One callback function can be registered to multiple hooks and the same hook multiple times.
         *
         * @param {string} name The name of the hook.
         * @param {HookCallback} callback The callback function which is given environment variables.
         * @public
         */
        add: function (name, callback) {
          var hooks = _.hooks.all;
          hooks[name] = hooks[name] || [];
          hooks[name].push(callback);
        },

        /**
         * Runs a hook invoking all registered callbacks with the given environment variables.
         *
         * Callbacks will be invoked synchronously and in the order in which they were registered.
         *
         * @param {string} name The name of the hook.
         * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
         * @public
         */
        run: function (name, env) {
          var callbacks = _.hooks.all[name];

          if (!callbacks || !callbacks.length) {
            return;
          }

          for (var i = 0, callback; callback = callbacks[i++];) {
            callback(env);
          }
        }
      },
      Token: Token
    };
    _self.Prism = _; // Typescript note:
    // The following can be used to import the Token type in JSDoc:
    //
    //   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

    /**
     * Creates a new token.
     *
     * @param {string} type See {@link Token#type type}
     * @param {string | TokenStream} content See {@link Token#content content}
     * @param {string|string[]} [alias] The alias(es) of the token.
     * @param {string} [matchedStr=""] A copy of the full string this token was created from.
     * @class
     * @global
     * @public
     */

    function Token(type, content, alias, matchedStr) {
      /**
       * The type of the token.
       *
       * This is usually the key of a pattern in a {@link Grammar}.
       *
       * @type {string}
       * @see GrammarToken
       * @public
       */
      this.type = type;
      /**
       * The strings or tokens contained by this token.
       *
       * This will be a token stream if the pattern matched also defined an `inside` grammar.
       *
       * @type {string | TokenStream}
       * @public
       */

      this.content = content;
      /**
       * The alias(es) of the token.
       *
       * @type {string|string[]}
       * @see GrammarToken
       * @public
       */

      this.alias = alias; // Copy of the full string this token was created from

      this.length = (matchedStr || '').length | 0;
    }
    /**
     * A token stream is an array of strings and {@link Token Token} objects.
     *
     * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
     * them.
     *
     * 1. No adjacent strings.
     * 2. No empty strings.
     *
     *    The only exception here is the token stream that only contains the empty string and nothing else.
     *
     * @typedef {Array<string | Token>} TokenStream
     * @global
     * @public
     */

    /**
     * Converts the given token or token stream to an HTML representation.
     *
     * The following hooks will be run:
     * 1. `wrap`: On each {@link Token}.
     *
     * @param {string | Token | TokenStream} o The token or token stream to be converted.
     * @param {string} language The name of current language.
     * @returns {string} The HTML representation of the token or token stream.
     * @memberof Token
     * @static
     */


    Token.stringify = function stringify(o, language) {
      if (typeof o == 'string') {
        return o;
      }

      if (Array.isArray(o)) {
        var s = '';
        o.forEach(function (e) {
          s += stringify(e, language);
        });
        return s;
      }

      var env = {
        type: o.type,
        content: stringify(o.content, language),
        tag: 'span',
        classes: ['token', o.type],
        attributes: {},
        language: language
      };
      var aliases = o.alias;

      if (aliases) {
        if (Array.isArray(aliases)) {
          Array.prototype.push.apply(env.classes, aliases);
        } else {
          env.classes.push(aliases);
        }
      }

      _.hooks.run('wrap', env);

      var attributes = '';

      for (var name in env.attributes) {
        attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
      }

      return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
    };
    /**
     * @param {RegExp} pattern
     * @param {number} pos
     * @param {string} text
     * @param {boolean} lookbehind
     * @returns {RegExpExecArray | null}
     */


    function matchPattern(pattern, pos, text, lookbehind) {
      pattern.lastIndex = pos;
      var match = pattern.exec(text);

      if (match && lookbehind && match[1]) {
        // change the match to remove the text matched by the Prism lookbehind group
        var lookbehindLength = match[1].length;
        match.index += lookbehindLength;
        match[0] = match[0].slice(lookbehindLength);
      }

      return match;
    }
    /**
     * @param {string} text
     * @param {LinkedList<string | Token>} tokenList
     * @param {any} grammar
     * @param {LinkedListNode<string | Token>} startNode
     * @param {number} startPos
     * @param {RematchOptions} [rematch]
     * @returns {void}
     * @private
     *
     * @typedef RematchOptions
     * @property {string} cause
     * @property {number} reach
     */


    function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
      for (var token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue;
        }

        var patterns = grammar[token];
        patterns = Array.isArray(patterns) ? patterns : [patterns];

        for (var j = 0; j < patterns.length; ++j) {
          if (rematch && rematch.cause == token + ',' + j) {
            return;
          }

          var patternObj = patterns[j];
          var inside = patternObj.inside;
          var lookbehind = !!patternObj.lookbehind;
          var greedy = !!patternObj.greedy;
          var alias = patternObj.alias;

          if (greedy && !patternObj.pattern.global) {
            // Without the global flag, lastIndex won't work
            var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
            patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
          }
          /** @type {RegExp} */


          var pattern = patternObj.pattern || patternObj;

          for ( // iterate the token list and keep track of the current token/string position
          var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
            if (rematch && pos >= rematch.reach) {
              break;
            }

            var str = currentNode.value;

            if (tokenList.length > text.length) {
              // Something went terribly wrong, ABORT, ABORT!
              return;
            }

            if (str instanceof Token) {
              continue;
            }

            var removeCount = 1; // this is the to parameter of removeBetween

            var match;

            if (greedy) {
              match = matchPattern(pattern, pos, text, lookbehind);

              if (!match || match.index >= text.length) {
                break;
              }

              var from = match.index;
              var to = match.index + match[0].length;
              var p = pos; // find the node that contains the match

              p += currentNode.value.length;

              while (from >= p) {
                currentNode = currentNode.next;
                p += currentNode.value.length;
              } // adjust pos (and p)


              p -= currentNode.value.length;
              pos = p; // the current node is a Token, then the match starts inside another Token, which is invalid

              if (currentNode.value instanceof Token) {
                continue;
              } // find the last node which is affected by this match


              for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === 'string'); k = k.next) {
                removeCount++;
                p += k.value.length;
              }

              removeCount--; // replace with the new match

              str = text.slice(pos, p);
              match.index -= pos;
            } else {
              match = matchPattern(pattern, 0, str, lookbehind);

              if (!match) {
                continue;
              }
            } // eslint-disable-next-line no-redeclare


            var from = match.index;
            var matchStr = match[0];
            var before = str.slice(0, from);
            var after = str.slice(from + matchStr.length);
            var reach = pos + str.length;

            if (rematch && reach > rematch.reach) {
              rematch.reach = reach;
            }

            var removeFrom = currentNode.prev;

            if (before) {
              removeFrom = addAfter(tokenList, removeFrom, before);
              pos += before.length;
            }

            removeRange(tokenList, removeFrom, removeCount);
            var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
            currentNode = addAfter(tokenList, removeFrom, wrapped);

            if (after) {
              addAfter(tokenList, currentNode, after);
            }

            if (removeCount > 1) {
              // at least one Token object was removed, so we have to do some rematching
              // this can only happen if the current pattern is greedy

              /** @type {RematchOptions} */
              var nestedRematch = {
                cause: token + ',' + j,
                reach: reach
              };
              matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch); // the reach might have been extended because of the rematching

              if (rematch && nestedRematch.reach > rematch.reach) {
                rematch.reach = nestedRematch.reach;
              }
            }
          }
        }
      }
    }
    /**
     * @typedef LinkedListNode
     * @property {T} value
     * @property {LinkedListNode<T> | null} prev The previous node.
     * @property {LinkedListNode<T> | null} next The next node.
     * @template T
     * @private
     */

    /**
     * @template T
     * @private
     */


    function LinkedList() {
      /** @type {LinkedListNode<T>} */
      var head = {
        value: null,
        prev: null,
        next: null
      };
      /** @type {LinkedListNode<T>} */

      var tail = {
        value: null,
        prev: head,
        next: null
      };
      head.next = tail;
      /** @type {LinkedListNode<T>} */

      this.head = head;
      /** @type {LinkedListNode<T>} */

      this.tail = tail;
      this.length = 0;
    }
    /**
     * Adds a new node with the given value to the list.
     *
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {T} value
     * @returns {LinkedListNode<T>} The added node.
     * @template T
     */


    function addAfter(list, node, value) {
      // assumes that node != list.tail && values.length >= 0
      var next = node.next;
      var newNode = {
        value: value,
        prev: node,
        next: next
      };
      node.next = newNode;
      next.prev = newNode;
      list.length++;
      return newNode;
    }
    /**
     * Removes `count` nodes after the given node. The given node will not be removed.
     *
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {number} count
     * @template T
     */


    function removeRange(list, node, count) {
      var next = node.next;

      for (var i = 0; i < count && next !== list.tail; i++) {
        next = next.next;
      }

      node.next = next;
      next.prev = node;
      list.length -= i;
    }
    /**
     * @param {LinkedList<T>} list
     * @returns {T[]}
     * @template T
     */


    function toArray(list) {
      var array = [];
      var node = list.head.next;

      while (node !== list.tail) {
        array.push(node.value);
        node = node.next;
      }

      return array;
    }

    if (!_self.document) {
      if (!_self.addEventListener) {
        // in Node.js
        return _;
      }

      if (!_.disableWorkerMessageHandler) {
        // In worker
        _self.addEventListener('message', function (evt) {
          var message = JSON.parse(evt.data);
          var lang = message.language;
          var code = message.code;
          var immediateClose = message.immediateClose;

          _self.postMessage(_.highlight(code, _.languages[lang], lang));

          if (immediateClose) {
            _self.close();
          }
        }, false);
      }

      return _;
    } // Get current script and highlight


    var script = _.util.currentScript();

    if (script) {
      _.filename = script.src;

      if (script.hasAttribute('data-manual')) {
        _.manual = true;
      }
    }

    function highlightAutomaticallyCallback() {
      if (!_.manual) {
        _.highlightAll();
      }
    }

    if (!_.manual) {
      // If the document state is "loading", then we'll use DOMContentLoaded.
      // If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
      // DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
      // might take longer one animation frame to execute which can create a race condition where only some plugins have
      // been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
      // See https://github.com/PrismJS/prism/issues/2102
      var readyState = document.readyState;

      if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
        document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
      } else {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(highlightAutomaticallyCallback);
        } else {
          window.setTimeout(highlightAutomaticallyCallback, 16);
        }
      }
    }

    return _;
  }(_self);

  if (module.exports) {
    module.exports = Prism;
  } // hack for components to work correctly in node.js


  if (typeof commonjsGlobal !== 'undefined') {
    commonjsGlobal.Prism = Prism;
  } // some additional documentation/types

  /**
   * The expansion of a simple `RegExp` literal to support additional properties.
   *
   * @typedef GrammarToken
   * @property {RegExp} pattern The regular expression of the token.
   * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
   * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
   * @property {boolean} [greedy=false] Whether the token is greedy.
   * @property {string|string[]} [alias] An optional alias or list of aliases.
   * @property {Grammar} [inside] The nested grammar of this token.
   *
   * The `inside` grammar will be used to tokenize the text value of each token of this kind.
   *
   * This can be used to make nested and even recursive language definitions.
   *
   * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
   * each another.
   * @global
   * @public
   */

  /**
   * @typedef Grammar
   * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
   * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
   * @global
   * @public
   */

  /**
   * A function which will invoked after an element was successfully highlighted.
   *
   * @callback HighlightCallback
   * @param {Element} element The element successfully highlighted.
   * @returns {void}
   * @global
   * @public
   */

  /**
   * @callback HookCallback
   * @param {Object<string, any>} env The environment variables of the hook.
   * @returns {void}
   * @global
   * @public
   */

  /* **********************************************
       Begin prism-markup.js
  ********************************************** */


  Prism.languages.markup = {
    'comment': {
      pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
      greedy: true
    },
    'prolog': {
      pattern: /<\?[\s\S]+?\?>/,
      greedy: true
    },
    'doctype': {
      // https://www.w3.org/TR/xml/#NT-doctypedecl
      pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: true,
      inside: {
        'internal-subset': {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: true,
          greedy: true,
          inside: null // see below

        },
        'string': {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: true
        },
        'punctuation': /^<!|>$|[[\]]/,
        'doctype-tag': /^DOCTYPE/i,
        'name': /[^\s<>'"]+/
      }
    },
    'cdata': {
      pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
      greedy: true
    },
    'tag': {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: true,
      inside: {
        'tag': {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            'punctuation': /^<\/?/,
            'namespace': /^[^\s>\/:]+:/
          }
        },
        'special-attr': [],
        'attr-value': {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            'punctuation': [{
              pattern: /^=/,
              alias: 'attr-equals'
            }, /"|'/]
          }
        },
        'punctuation': /\/?>/,
        'attr-name': {
          pattern: /[^\s>\/]+/,
          inside: {
            'namespace': /^[^\s>\/:]+:/
          }
        }
      }
    },
    'entity': [{
      pattern: /&[\da-z]{1,8};/i,
      alias: 'named-entity'
    }, /&#x?[\da-f]{1,8};/i]
  };
  Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] = Prism.languages.markup['entity'];
  Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup; // Plugin to make entity title show the real entity, idea by Roman Komarov

  Prism.hooks.add('wrap', function (env) {
    if (env.type === 'entity') {
      env.attributes['title'] = env.content.replace(/&amp;/, '&');
    }
  });
  Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function addInlined(tagName, lang) {
      var includedCdataInside = {};
      includedCdataInside['language-' + lang] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: true,
        inside: Prism.languages[lang]
      };
      includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;
      var inside = {
        'included-cdata': {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: includedCdataInside
        }
      };
      inside['language-' + lang] = {
        pattern: /[\s\S]+/,
        inside: Prism.languages[lang]
      };
      var def = {};
      def[tagName] = {
        pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () {
          return tagName;
        }), 'i'),
        lookbehind: true,
        greedy: true,
        inside: inside
      };
      Prism.languages.insertBefore('markup', 'cdata', def);
    }
  });
  Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
    /**
     * Adds an pattern to highlight languages embedded in HTML attributes.
     *
     * An example of an inlined language is CSS with `style` attributes.
     *
     * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addAttribute('style', 'css');
     */
    value: function (attrName, lang) {
      Prism.languages.markup.tag.inside['special-attr'].push({
        pattern: RegExp(/(^|["'\s])/.source + '(?:' + attrName + ')' + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source, 'i'),
        lookbehind: true,
        inside: {
          'attr-name': /^[^\s=]+/,
          'attr-value': {
            pattern: /=[\s\S]+/,
            inside: {
              'value': {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: true,
                alias: [lang, 'language-' + lang],
                inside: Prism.languages[lang]
              },
              'punctuation': [{
                pattern: /^=/,
                alias: 'attr-equals'
              }, /"|'/]
            }
          }
        }
      });
    }
  });
  Prism.languages.html = Prism.languages.markup;
  Prism.languages.mathml = Prism.languages.markup;
  Prism.languages.svg = Prism.languages.markup;
  Prism.languages.xml = Prism.languages.extend('markup', {});
  Prism.languages.ssml = Prism.languages.xml;
  Prism.languages.atom = Prism.languages.xml;
  Prism.languages.rss = Prism.languages.xml;
  /* **********************************************
       Begin prism-css.js
  ********************************************** */

  (function (Prism) {
    var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
    Prism.languages.css = {
      'comment': /\/\*[\s\S]*?\*\//,
      'atrule': {
        pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
        inside: {
          'rule': /^@[\w-]+/,
          'selector-function-argument': {
            pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
            lookbehind: true,
            alias: 'selector'
          },
          'keyword': {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: true
          } // See rest below

        }
      },
      'url': {
        // https://drafts.csswg.org/css-values-3/#urls
        pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
        greedy: true,
        inside: {
          'function': /^url/i,
          'punctuation': /^\(|\)$/,
          'string': {
            pattern: RegExp('^' + string.source + '$'),
            alias: 'url'
          }
        }
      },
      'selector': {
        pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + string.source + ')*(?=\\s*\\{)'),
        lookbehind: true
      },
      'string': {
        pattern: string,
        greedy: true
      },
      'property': {
        pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
        lookbehind: true
      },
      'important': /!important\b/i,
      'function': {
        pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
        lookbehind: true
      },
      'punctuation': /[(){};:,]/
    };
    Prism.languages.css['atrule'].inside.rest = Prism.languages.css;
    var markup = Prism.languages.markup;

    if (markup) {
      markup.tag.addInlined('style', 'css');
      markup.tag.addAttribute('style', 'css');
    }
  })(Prism);
  /* **********************************************
       Begin prism-clike.js
  ********************************************** */


  Prism.languages.clike = {
    'comment': [{
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
      greedy: true
    }, {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }],
    'string': {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true
    },
    'class-name': {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: true,
      inside: {
        'punctuation': /[.\\]/
      }
    },
    'keyword': /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    'boolean': /\b(?:false|true)\b/,
    'function': /\b\w+(?=\()/,
    'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    'punctuation': /[{}[\];(),.:]/
  };
  /* **********************************************
       Begin prism-javascript.js
  ********************************************** */

  Prism.languages.javascript = Prism.languages.extend('clike', {
    'class-name': [Prism.languages.clike['class-name'], {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
      lookbehind: true
    }],
    'keyword': [{
      pattern: /((?:^|\})\s*)catch\b/,
      lookbehind: true
    }, {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: true
    }],
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    'number': {
      pattern: RegExp(/(^|[^\w$])/.source + '(?:' + ( // constant
      /NaN|Infinity/.source + '|' + // binary integer
      /0[bB][01]+(?:_[01]+)*n?/.source + '|' + // octal integer
      /0[oO][0-7]+(?:_[0-7]+)*n?/.source + '|' + // hexadecimal integer
      /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + '|' + // decimal bigint
      /\d+(?:_\d+)*n/.source + '|' + // decimal number (integer or float) but no bigint
      /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ')' + /(?![\w$])/.source),
      lookbehind: true
    },
    'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  });
  Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
  Prism.languages.insertBefore('javascript', 'keyword', {
    'regex': {
      // eslint-disable-next-line regexp/no-dupe-characters-character-class
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
      lookbehind: true,
      greedy: true,
      inside: {
        'regex-source': {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: true,
          alias: 'language-regex',
          inside: Prism.languages.regex
        },
        'regex-delimiter': /^\/|\/$/,
        'regex-flags': /^[a-z]+$/
      }
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    'function-variable': {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: 'function'
    },
    'parameter': [{
      pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
      lookbehind: true,
      inside: Prism.languages.javascript
    }, {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
      lookbehind: true,
      inside: Prism.languages.javascript
    }, {
      pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    }, {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    }],
    'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  });
  Prism.languages.insertBefore('javascript', 'string', {
    'hashbang': {
      pattern: /^#!.*/,
      greedy: true,
      alias: 'comment'
    },
    'template-string': {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: true,
      inside: {
        'template-punctuation': {
          pattern: /^`|`$/,
          alias: 'string'
        },
        'interpolation': {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: true,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\$\{|\}$/,
              alias: 'punctuation'
            },
            rest: Prism.languages.javascript
          }
        },
        'string': /[\s\S]+/
      }
    },
    'string-property': {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: true,
      greedy: true,
      alias: 'property'
    }
  });
  Prism.languages.insertBefore('javascript', 'operator', {
    'literal-property': {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: true,
      alias: 'property'
    }
  });

  if (Prism.languages.markup) {
    Prism.languages.markup.tag.addInlined('script', 'javascript'); // add attribute support for all DOM events.
    // https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events

    Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, 'javascript');
  }

  Prism.languages.js = Prism.languages.javascript;
  /* **********************************************
       Begin prism-file-highlight.js
  ********************************************** */

  (function () {
    if (typeof Prism === 'undefined' || typeof document === 'undefined') {
      return;
    } // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill


    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    var LOADING_MESSAGE = 'Loading…';

    var FAILURE_MESSAGE = function (status, message) {
      return '✖ Error ' + status + ' while fetching file: ' + message;
    };

    var FAILURE_EMPTY_MESSAGE = '✖ Error: File does not exist or is empty';
    var EXTENSIONS = {
      'js': 'javascript',
      'py': 'python',
      'rb': 'ruby',
      'ps1': 'powershell',
      'psm1': 'powershell',
      'sh': 'bash',
      'bat': 'batch',
      'h': 'c',
      'tex': 'latex'
    };
    var STATUS_ATTR = 'data-src-status';
    var STATUS_LOADING = 'loading';
    var STATUS_LOADED = 'loaded';
    var STATUS_FAILED = 'failed';
    var SELECTOR = 'pre[data-src]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])' + ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';
    /**
     * Loads the given file.
     *
     * @param {string} src The URL or path of the source file to load.
     * @param {(result: string) => void} success
     * @param {(reason: string) => void} error
     */

    function loadFile(src, success, error) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', src, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status < 400 && xhr.responseText) {
            success(xhr.responseText);
          } else {
            if (xhr.status >= 400) {
              error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
            } else {
              error(FAILURE_EMPTY_MESSAGE);
            }
          }
        }
      };

      xhr.send(null);
    }
    /**
     * Parses the given range.
     *
     * This returns a range with inclusive ends.
     *
     * @param {string | null | undefined} range
     * @returns {[number, number | undefined] | undefined}
     */


    function parseRange(range) {
      var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || '');

      if (m) {
        var start = Number(m[1]);
        var comma = m[2];
        var end = m[3];

        if (!comma) {
          return [start, start];
        }

        if (!end) {
          return [start, undefined];
        }

        return [start, Number(end)];
      }

      return undefined;
    }

    Prism.hooks.add('before-highlightall', function (env) {
      env.selector += ', ' + SELECTOR;
    });
    Prism.hooks.add('before-sanity-check', function (env) {
      var pre =
      /** @type {HTMLPreElement} */
      env.element;

      if (pre.matches(SELECTOR)) {
        env.code = ''; // fast-path the whole thing and go to complete

        pre.setAttribute(STATUS_ATTR, STATUS_LOADING); // mark as loading
        // add code element with loading message

        var code = pre.appendChild(document.createElement('CODE'));
        code.textContent = LOADING_MESSAGE;
        var src = pre.getAttribute('data-src');
        var language = env.language;

        if (language === 'none') {
          // the language might be 'none' because there is no language set;
          // in this case, we want to use the extension as the language
          var extension = (/\.(\w+)$/.exec(src) || [, 'none'])[1];
          language = EXTENSIONS[extension] || extension;
        } // set language classes


        Prism.util.setLanguage(code, language);
        Prism.util.setLanguage(pre, language); // preload the language

        var autoloader = Prism.plugins.autoloader;

        if (autoloader) {
          autoloader.loadLanguages(language);
        } // load file


        loadFile(src, function (text) {
          // mark as loaded
          pre.setAttribute(STATUS_ATTR, STATUS_LOADED); // handle data-range

          var range = parseRange(pre.getAttribute('data-range'));

          if (range) {
            var lines = text.split(/\r\n?|\n/g); // the range is one-based and inclusive on both ends

            var start = range[0];
            var end = range[1] == null ? lines.length : range[1];

            if (start < 0) {
              start += lines.length;
            }

            start = Math.max(0, Math.min(start - 1, lines.length));

            if (end < 0) {
              end += lines.length;
            }

            end = Math.max(0, Math.min(end, lines.length));
            text = lines.slice(start, end).join('\n'); // add data-start for line numbers

            if (!pre.hasAttribute('data-start')) {
              pre.setAttribute('data-start', String(start + 1));
            }
          } // highlight code


          code.textContent = text;
          Prism.highlightElement(code);
        }, function (error) {
          // mark as failed
          pre.setAttribute(STATUS_ATTR, STATUS_FAILED);
          code.textContent = error;
        });
      }
    });
    Prism.plugins.fileHighlight = {
      /**
       * Executes the File Highlight plugin for all matching `pre` elements under the given container.
       *
       * Note: Elements which are already loaded or currently loading will not be touched by this method.
       *
       * @param {ParentNode} [container=document]
       */
      highlight: function highlight(container) {
        var elements = (container || document).querySelectorAll(SELECTOR);

        for (var i = 0, element; element = elements[i++];) {
          Prism.highlightElement(element);
        }
      }
    };
    var logged = false;
    /** @deprecated Use `Prism.plugins.fileHighlight.highlight` instead. */

    Prism.fileHighlight = function () {
      if (!logged) {
        console.warn('Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.');
        logged = true;
      }

      Prism.plugins.fileHighlight.highlight.apply(this, arguments);
    };
  })();
})(prism);

var Prism = prism.exports;

class CodeEditor extends s {
    constructor(props = { instance: {}, header: 'Object' }) {
        var _a, _b, _c;
        super();
        this.history = [];
        this.getControls = () => {
            let controls = ['Save', 'Reset', 'Close'];
            // let buttonType = ['primary', 'primary', 'primary']
            return $ `
      <div class="actions">
            ${controls.map((name, i) => $ `<visualscript-button  size="small" @click="${() => {
                console.log('Clicked', name, i);
            }}">${name}</visualscript-button>`)}
      </div>
      `;
        };
        this.text = (text) => {
            const highlight = this.shadowRoot.getElementById('highlight');
            if (highlight) {
                const el = highlight.querySelector('code');
                let replacedText = text.replace(new RegExp("\&", "g"), "&amp").replace(new RegExp("\<", "g"), "&lt;"); // Don't Actually Create New HTML
                el.innerHTML = replacedText;
                Prism.highlightElement(el);
            }
        };
        this.scroll = (element) => {
            const highlight = this.shadowRoot.getElementById('highlight');
            if (highlight) {
                highlight.scrollTop = element.scrollTop;
                if (highlight.scrollTop < element.scrollTop)
                    element.scrollTop = highlight.scrollTop;
                highlight.scrollLeft = element.scrollLeft;
            }
        };
        this.instance = (_a = props.instance) !== null && _a !== void 0 ? _a : {};
        this.header = (_b = props.header) !== null && _b !== void 0 ? _b : 'Object';
        this.mode = (_c = props.mode) !== null && _c !== void 0 ? _c : 'view';
    }
    static get styles() {
        return r$2 `

    
    :host {
      
      width: 100%; 
      height: 100%; 
      z-index: 100000; 
      overflow: scroll;
    }

    :host * {
      box-sizing: border-box;
      
    }

    :host > * {
      background: white;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 1px 5px 0 rgb(0 0 0 / 20%);
    }

    h3 {
      margin: 0;
    }

    #controls {
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      padding: 10px 25px;
      z-index: 2;
    }

  button {
      margin: 0px;
      border-radius: 0px;
      border: 1px solid rgb(35,35,35);
      padding: 0px 15px;
      font-size: 60%;
  }
  
  textarea {
      border: none;
  }
  
  #editor {
      // color: transparent;
      background: transparent;
      opacity: 0.5;
      caret-color: black;
      z-index: 1;
  }
  
  
  #highlight {
      // background-color: rgba(0,0,0,0.8) !important; 
      z-index: -1 !important;
      white-space: pre !important;
      position:absolute !important;
      top: 0 !important;
      left: 0 !important;
  }
  
  #editor, #highlight {
    margin: 0px !important;
    width: 100% !important;
    height: 100% !important;
    overflow: auto !important;
    white-space: nowrap !important;
    padding: 25px !important;
    resize: none !important;
    -moz-tab-size : 4 !important;
      -o-tab-size : 4 !important;
         tab-size : 4 !important;
  }
  
  #editor, #highlight, #highlight code {
      font-size: 12px !important;
      font-family: monospace !important;
      line-height: 20pt !important;
      box-sizing: border-box !important;
  }
  

    `;
    }
    static get properties() {
        return {
            instance: {
                type: Object,
                reflect: true,
            },
            header: {
                type: String,
                reflect: true,
            },
            mode: {
                type: String,
                reflect: true,
            },
        };
    }
    willUpdate(changedProps) {
        // console.log(changedProps)
        if (changedProps.has('instance')) ;
    }
    render() {
        const language = 'javascript';
        return $ `
      <div id="controls">
        <h3>${language[0].toUpperCase() + language.slice(1)} Editor</h3>
        ${this.getControls()}
      </div>
      <div id='editorContainer' style="position: relative; width: 100%; height: 100%;">
        <textarea 
        id='editor' 
        spellcheck="false" 
        placeholder='Write your ${language} code...'
        @input="${(ev) => {
            console.error('input detected');
            this.text(ev.target.value);
            this.scroll(ev.target);
            // this.oninput(ev.target.value)
        }}"
      
      ></textarea>
        <pre id="highlight" aria-hidden="true">
            <code class="language-${language}"></code>
        </pre>
    </div>
    `;
    }
}
customElements.define('visualscript-code-editor', CodeEditor);

class GraphEditor extends s {
    constructor(props = { graph: {}, header: 'Object' }) {
        var _a, _b, _c;
        super();
        this.history = [];
        this.getActions = (key, o) => {
            let actions;
            if (typeof o[key] === 'object') {
                actions = $ `<visualscript-button primary=true size="small" @click="${() => {
                    this.history.push({ parent: o, key: this.header });
                    this.graph = o[key];
                    this.header = key;
                    this.mode = (Array.isArray(o[key])) ? 'plot' : 'view';
                }}">${Array.isArray(o[key]) ? $ `Plot` : $ `View`}</visualscript-button>`;
            }
            return $ `
      <div class="actions">
            ${actions}
      </div>
      `;
        };
        this.getElement = (key, o) => {
            return $ `
        <div class="attribute separate">
        <div>
          <span class="name">${key}</span><br>
          <span class="value">${(typeof o[key] === 'object'
                ? (Object.keys(o[key]).length ? o[key].constructor.name : $ `Empty ${o[key].constructor.name}`)
                : o[key])}</span>
        </div>
          ${this.getActions(key, o)}
        </div>`;
        };
        this.graph = (_a = props.graph) !== null && _a !== void 0 ? _a : {};
        this.header = (_b = props.header) !== null && _b !== void 0 ? _b : 'Object';
        this.mode = (_c = props.mode) !== null && _c !== void 0 ? _c : 'view';
    }
    static get styles() {
        return r$2 `

    
    :host {
      
    }
    :host * {
      box-sizing: border-box;
      
    }

    :host > * {
      background: white;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 1px 5px 0 rgb(0 0 0 / 20%);
    }

    .main {
      
    }

    .header {
      padding: 10px 20px;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      font-size: 70%;
      border-bottom: 1px solid #e3e3e3;
    }

    .header span {
      font-weight: 800;
      font-size: 120%;
    }

    .container {
      background: white;
      width: 100%;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    }

    .separate {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .attribute {
      width: 100%;
      font-size: 90%;
      padding: 15px;
      flex-grow: 1;
      flex-wrap: wrap;
    }

    .name {
      font-weight: 800;
      padding-right: 10px;
    }

    .value {
      font-size: 80%;
    }

    `;
    }
    static get properties() {
        return {
            graph: {
                type: Object,
                reflect: true,
            },
            header: {
                type: String,
                reflect: true,
            },
            mode: {
                type: String,
                reflect: true,
            },
        };
    }
    willUpdate(changedProps) {
        // console.log(changedProps)
        if (changedProps.has('graph')) ;
    }
    render() {
        var _a, _b;
        return $ `
      <div>
        <div class="header separate">
          <span>${this.header}</span>
          ${(this.history.length > 0) ? $ `<visualscript-button size="extra-small" @click="${() => {
            const historyItem = this.history.pop();
            this.header = historyItem.key;
            this.graph = historyItem.parent;
        }}">Go Back</visualscript-button>` : ``}
        </div>
        <div class="container">
              ${(this.mode === 'view'
            ? (_a = Object.keys(this.graph)) === null || _a === void 0 ? void 0 : _a.map(key => this.getElement(key, this.graph))
            : (_b = Object.keys(this.graph)) === null || _b === void 0 ? void 0 : _b.map(key => this.getElement(key, this.graph)) // TODO: Implement plot
        )}
        </div>
      </div>
    `;
    }
}
customElements.define('visualscript-graph-editor', GraphEditor);

class DeviceEditor extends s {
    static get styles() {
        return r$2 `
    :host {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    :host * {
      
      box-sizing: border-box;
      
    }
    `;
    }
    static get properties() {
        return {};
    }
    constructor(props = { target: {}, header: 'Object' }) {
        super();
    }
    render() {
        return $ `

      <slot></slot>
    `;
    }
}
customElements.define('visualscript-device-editor', DeviceEditor);

class SessionEditor extends s {
    static get styles() {
        return r$2 `
    :host {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    :host * {
      
      box-sizing: border-box;
      
    }
    `;
    }
    static get properties() {
        return {};
    }
    constructor(props = { target: {}, header: 'Object' }) {
        super();
    }
    render() {
        return $ `

      <slot></slot>
    `;
    }
}
customElements.define('visualscript-session-editor', SessionEditor);

const slotGrid = r$2 `

slot {
  display: grid;
  grid-template-columns: 1fr fit-content(100%);
  grid-template-rows: fit-content(75px) 1fr fit-content(75px);
  grid-template-areas: 
          "nav nav"
          "main side"
          "foot foot";

  width: 100%;
  height: 100%;
}

`;
class Dashboard extends s {
    constructor(props = {}) {
        var _a, _b;
        super();
        this.apps = new Map();
        this.open = (_a = props.open) !== null && _a !== void 0 ? _a : true;
        this.closeHandler = (_b = props.closeHandler) !== null && _b !== void 0 ? _b : (() => { });
        if (props.toggletext)
            this.toggletext = props.toggletext;
        this.toggle = (typeof props.toggle === 'string') ? document.getElementById(props.toggle) : props.toggle;
    }
    static get styles() {
        return r$2 `
    
    :host {
      color-scheme: light dark;
      position: relative;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      grid-area: main;
      overflow: hidden;
    }

    :host([global]) {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
      pointer-events: none;
    }

    :host([open]) {
      pointer-events: all;
    }


    :host([global]) slot {
      opacity: 0;
      pointer-events: none;
    }

    :host([open]) #close {
      display: block;
    }

    :host * {
      box-sizing: border-box;
    }

    slot {
      background: white;
      color: black;
    }

    ${slotGrid}

    :host([open]) slot {
      opacity: 1;
      pointer-events: all;
    }

    #close {
      position: absolute; 
      top: 22px;
      right: 22px;
      z-index: 101;
      display: none;
    }

    #dashboard-toggle {
      background: white;
      position: absolute; 
      pointer-events: all;
      top: 0px;
      right: 22px;
      z-index: 1000;
      color: black;
      border: 1px solid black;
      border-top: none;
      padding: 10px 15px;
      cursor: pointer;
      font-size: 70%;
      font-weight: bold;
      border-bottom-left-radius: 7px;
      border-bottom-right-radius: 7px;
      box-shadow: 0 1px 5px 0 rgb(0 0 0 / 20%);
    }

    :host([open]) #dashboard-toggle {
      display: none;
    }

    @media (prefers-color-scheme: dark) {
      slot {
        color: white;
        background: black;
      }

      #dashboard-toggle { 
        border: 1px solid white;
        border-top: none;
        color: white;
        box-shadow: 0 1px 5px 0 rgb(255 255 255 / 20%);
        background: black;
      }
    }
    `;
    }
    static get properties() {
        return {
            toggletext: {
                type: String,
                reflect: true
            },
            toggle: {
                type: Object,
                reflect: true
            },
            open: {
                type: Boolean,
                reflect: true,
            },
            closeHandler: {
                type: Function,
                reflect: true,
            },
            global: {
                type: Boolean,
                reflect: true,
            },
        };
    }
    render() {
        var _a;
        // Add Global Class
        if (this.global)
            this.classList.add('global');
        else
            this.classList.remove('global');
        if (this.global) {
            const apps = document.querySelectorAll('visualscript-app');
            for (var i = 0; i < apps.length; i++) {
                const app = apps[i];
                if (!this.apps.has(app.name))
                    this.apps.set(app.name, app);
            }
        }
        // Add Open Class
        if (this.open)
            this.classList.add('open');
        else {
            this.classList.remove('open');
            this.dispatchEvent(new CustomEvent('close'));
        }
        this.main = this.querySelector('visualscript-main');
        this.footer = this.querySelector('visualscript-footer');
        this.nav = this.querySelector('visualscript-nav');
        this.sidebar = this.querySelector('visualscript-sidebar');
        const onClick = () => {
            this.open = true;
            const selectedApp = this.apps.values().next().value;
            // Always open the app first!
            selectedApp.toggle.shadowRoot.querySelector('button').click();
        };
        if (this.toggle)
            this.toggle.onclick = onClick;
        return $ `
      ${(this.global && !this.toggle) ? $ `<div id="dashboard-toggle" @click=${onClick}>${(_a = this.toggletext) !== null && _a !== void 0 ? _a : 'Edit'}</div>` : ''}
      ${this.global ? $ `<visualscript-button id='close' secondary size="small" @click=${() => this.open = false}>Close</visualscript-button>` : ``}
      <slot>
      </slot>
    `;
    }
}
customElements.define('visualscript-dashboard', Dashboard);

const TabTogglePropsLit = {
    name: {
        type: String,
        reflect: true
    },
};
class TabToggle extends s {
    constructor(tab) {
        super();
        this.to = tab;
    }
    static get styles() {
        return r$2 `

    :host {
      flex-grow: 1;
      min-width: 100px;
    }

    :host * {
      box-sizing: border-box;
    }

    button {
        color: black;
        background: rgb(205,205,205);
        border-right: 1px solid rgb(230,230,230);
        border: 0px;
        padding: 6px 20px;
        text-align: center;
        font-size: 80%;
        cursor: pointer;
        width: 100%;
        height: 100%;
    }

    button > span {
      font-size: 60%;
    }

    button:hover {
        background: rgb(230,230,230);
      }
  
      button:active {
        background: rgb(210,210,210);
      }
  
      button.selected {
        background: rgb(230,230,230);
      }


      @media (prefers-color-scheme: dark) {
        button {
            color: white;
            background: rgb(50,50,50);
            border-right: 1px solid rgb(25,25,25);
        }

        button:hover {
            background: rgb(60,60,60);
        }
      
        button:active {
        background: rgb(75,75,75);
        }
      
        button.selected {
        background: rgb(60,60,60);
        }

      }
    `;
    }
    static get properties() {
        return TabTogglePropsLit;
    }
    render() {
        var _a;
        return $ `
      <button class="${(this.selected) ? 'selected' : ''}"  @click=${(ev) => {
            this.to.on(ev);
            // Show Correct Tab
            const tabs = this.to.dashboard.main.shadowRoot.querySelector('visualscript-tab-bar');
            if (tabs) {
                this.to.toggle.shadowRoot.querySelector('button').classList.add('selected');
                // if (this.to.style.display === 'none') {
                this.to.dashboard.main.tabs.forEach(t => {
                    if (t != this.to) {
                        t.toggle.shadowRoot.querySelector('button').classList.remove('selected');
                        t.style.display = 'none';
                        t.off(ev);
                    }
                    else {
                        t.style.display = '';
                    } // hide other tabs
                });
                // }
            }
            else
                console.warn('No TabBar instance in the global Main');
            // Swap Sidebar Content
            const dashboard = this.to.dashboard;
            if (dashboard) {
                const sidebar = dashboard.querySelector('visualscript-sidebar');
                if (sidebar) {
                    sidebar.content = (this.to.controlPanel.children.length) ? this.to.controlPanel : '';
                }
            }
        }}>${(_a = this.to.name) !== null && _a !== void 0 ? _a : `Tab`} <span>${this.to.type}</span></button>
    `;
    }
}
customElements.define('visualscript-tab-toggle', TabToggle);

class Control extends s {
    constructor(props = {}) {
        super();
        this.label = 'Control';
        this.type = 'button';
        this.persist = false;
        this.options = [];
        // File / Select
        this.onChange = () => { };
        // NOTE: Must do this so that custom Select trigger can be recognized as the target of a window.onclick event.
        // createRenderRoot() {
        //   return this;
        // }
        this.getElement = () => {
            if (this.type === 'select')
                this.element = new Select(this);
            else if (this.type === 'file')
                this.element = new File(this);
            else if (this.type === 'switch')
                this.element = new Switch(this);
            else if (this.type === 'range')
                this.element = new Range(this);
            else if (['input', 'text', 'number'].includes(this.type))
                this.element = new Input(this);
            else
                this.element = new Button(this);
        };
        this.willUpdate = (changedProps) => {
            changedProps.forEach((v, k) => {
                if (this.element)
                    this.element[k] = this[k];
            }); // TODO: Make sure this actually passes relevant changes
        };
        if (props.label)
            this.label = props.label;
        if (props.type)
            this.type = props.type;
        if (props.park)
            this.park = props.park;
        if (props.persist)
            this.persist = props.persist;
        // Select
        if (props.options)
            this.options = props.options;
        if (props.value)
            this.value = props.value;
        // File / Select
        if (props.onChange)
            this.onChange = props.onChange;
        if (props.accept)
            this.accept = props.accept;
        if (props.webkitdirectory)
            this.webkitdirectory = props.webkitdirectory;
        if (props.directory)
            this.directory = props.directory;
        if (props.multiple)
            this.multiple = props.multiple;
        // Button
        if (props.onClick)
            this.onClick = props.onClick;
        if (props.primary)
            this.primary = props.primary;
        if (props.backgroundColor)
            this.backgroundColor = props.backgroundColor;
        if (props.size)
            this.size = props.size;
        // this.getElement()
    }
    static get styles() {
        return r$2 `

    :host {
      width: 100%;
      height: 100%;
    }

    slot {
      display: none;
    }

    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 5px;
      margin: 10px;
      border: 1px solid rgb(180,180,180);
      /* white-space: nowrap; */
    }

    h5 {
      margin: 0;
    }


    div > * {
      padding: 10px;
    }

    span { 
      flex-grow: 1;
    }

    @media (prefers-color-scheme: dark) {
      div {
        border: 1px solid rgb(120,120,120);
      }
    }

    `;
    }
    static get properties() {
        return {
            label: {
                type: String,
                reflect: true
            },
            type: {
                type: String,
                reflect: true
            },
            persist: {
                type: Boolean,
                reflect: true
            },
            park: {
                type: Boolean,
                reflect: true
            },
            // Select
            value: {
                type: Object,
                reflect: true
            },
            options: {
                type: Object,
                reflect: true
            },
            // File / Select
            onChange: {
                type: Object,
                reflect: true
            },
            accept: {
                type: String,
                reflect: true
            },
            webkitdirectory: {
                type: Boolean,
                reflect: true
            },
            directory: {
                type: Boolean,
                reflect: true
            },
            multiple: {
                type: Boolean,
                reflect: true
            },
            // Button
            primary: {
                type: Boolean,
                reflect: true
            },
            backgroundColor: {
                type: String,
                reflect: true
            },
            size: {
                type: String,
                reflect: true
            },
            onClick: {
                type: Object,
                reflect: true
            },
        };
    }
    render() {
        this.getElement();
        return $ `<div><h5>${this.label}</h5>${this.element}</div><slot></slot>`;
    }
    updated(changedProperties) {
        const slot = this.shadowRoot.querySelector("slot");
        const nodes = slot.assignedNodes();
        // Manually Place Slot Text in Button
        if (this.type === 'button' && nodes.length)
            nodes.forEach(el => this.element.appendChild(el));
    }
}
customElements.define('visualscript-control', Control);

const tabStyle = r$2 `

:host {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: inherit;
}

slot {
  overflow: scroll;
}

:host * {
  
  box-sizing: border-box;
  
}
`;
const TabPropsLit = {
    name: {
        type: String,
        reflect: true
    },
    controls: {
        type: Array,
        reflect: true
    },
    on: {
        type: Function,
        reflect: true
    },
    off: {
        type: Function,
        reflect: true
    }
};
class Tab extends s {
    constructor(props = {}) {
        var _a;
        super();
        this.controls = [];
        this.on = () => { };
        this.off = () => { };
        this.type = 'tab';
        this.addControl = (instance) => {
            this.controlPanel.appendChild(instance);
        };
        this.updated = () => {
            const controls = this.querySelectorAll('visualscript-control');
            controls.forEach((control) => {
                if (this.type === 'app')
                    control.park = true; // Park all controls within an app
                else if (!control.park)
                    this.addControl(control);
            });
        };
        if (props.name)
            this.name = props.name;
        if (props.controls)
            this.controls = props.controls; // Will also check for controls in the <slot> later
        if (props.on)
            this.on = props.on;
        if (props.off)
            this.off = props.off;
        // Allow dashboards inside apps!
        let dashboards = document.body.querySelectorAll('visualscript-dashboard');
        this.dashboard = (_a = Array.from(dashboards).find(o => o.parentNode === document.body)) !== null && _a !== void 0 ? _a : new Dashboard(); // Find global dashboard
        this.dashboard.global = true;
        this.dashboard.open = false;
        // Create a toggle
        this.toggle = new TabToggle(this);
        this.dashboard.addEventListener('close', (ev) => {
            this.off(ev);
        });
    }
    static get styles() {
        return tabStyle;
    }
    static get properties() {
        return TabPropsLit;
    }
    willUpdate(changedProps) {
        if (changedProps.has('controls')) {
            this.controlPanel = document.createElement('div');
            this.controls.forEach(o => {
                this.addControl(new Control(o));
            });
        }
    }
    render() {
        return $ `
      <slot></slot>
    `;
    }
}
customElements.define('visualscript-tab', Tab);

class App extends Tab {
    constructor(props = {}) {
        const tabProps = Object.assign({
            on: (ev) => {
                this.dashboard.main.appendChild(this);
                if (props.on instanceof Function)
                    props.on(ev);
            },
            off: (ev) => {
                this.style.display = '';
                this.parent.appendChild(this); // Replace App element
                if (props.off instanceof Function)
                    props.off(ev);
            }
        }, props);
        tabProps.name = props.name;
        super(tabProps);
        this.name = props.name;
        this.type = 'app';
        this.parent = this.parentNode; // Grab original parent
    }
    static get styles() {
        return r$2 `
    :host {
      color-scheme: light dark;
      max-width: 100vw;
      max-height: 100vh;
    }


    slot {
      overflow: hidden !important;
    }

    ${tabStyle}
    ${slotGrid}
    `;
    }
    static get properties() {
        return Object.assign({}, TabPropsLit);
    }
    render() {
        if (!parent)
            this.parent = this.parentNode; // Grab original parent
        return $ `
        <slot></slot>
      `;
    }
}
customElements.define('visualscript-app', App);

const TabBarPropsLit = {};
class TabBar extends s {
    // tabs: TabBarProps['tabs']
    static get styles() {
        return r$2 `

    :host {
      background: whitesmoke;
      overflow-y: hidden;
      overflow-x: scroll;
      display: flex;
      position: sticky;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1000;
    }

    /* Tab Scrollbar */
    :host::-webkit-scrollbar {
      height: 2px;
      position: absolute;
      bottom: 0;
      left: 0;
    }

    :host::-webkit-scrollbar-track {
      background: transparent;
    }

    :host::-webkit-scrollbar-thumb {
      border-radius: 10px;
    }

    /* Handle on hover */
    :host(:hover)::-webkit-scrollbar-thumb {
      background: rgb(118, 222, 255);
    }

      @media (prefers-color-scheme: dark) {

        :host {
          background: rgb(25,25,25);
        }

        :host(:hover)::-webkit-scrollbar-thumb {
          background: rgb(240, 240, 240);
        }

      }
    `;
    }
    static get properties() {
        return TabBarPropsLit;
    }
    constructor(props = {}) {
        super();
        // this.tabs = props.tabs ?? []
    }
    render() {
        return $ `
      <slot></slot>
    `;
    }
}
customElements.define('visualscript-tab-bar', TabBar);

class Main extends s {
    constructor(props = { target: {}, header: 'Object' }) {
        super();
        this.tabs = new Map();
        this.getTabs = () => {
            var _a;
            const tabs = [];
            // Apps (only for global Main)
            if ((_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.global) {
                const apps = document.querySelectorAll('visualscript-app');
                for (var i = 0; i < apps.length; i++) {
                    if (!tabs.includes(apps[i]))
                        tabs.push(apps[i]);
                }
            }
            // Tabs
            for (var i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                if (child instanceof Tab)
                    tabs.push(child);
            }
            tabs.forEach(tab => this.tabs.set(tab.name, tab));
            return tabs;
        };
    }
    static get styles() {
        return r$2 `

    :host {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      grid-area: main;
      overflow: hidden;
      background: inherit;
      color: inherit;
      position: relative;
    }

    :host * {
      box-sizing: border-box;
    }
    `;
    }
    static get properties() {
        return {
            tabs: {
                type: Object,
                // reflect: true
            }
        };
    }
    render() {
        const tabs = this.getTabs();
        const toggles = tabs.map((t, i) => {
            if (i !== 0)
                t.style.display = 'none'; // Hide tabs other than the first
            return t.toggle;
        });
        return $ `
      <visualscript-tab-bar style="${toggles.length < 1 ? 'display: none;' : ''}">${toggles}</visualscript-tab-bar>
      <slot></slot>
    `;
    }
}
customElements.define('visualscript-main', Main);

class Gallery extends s {
    constructor(props = {}) {
        super();
        this.things = [];
        this.search = false;
        this.load = (thing, i) => {
            // if (i !== 0) thing.style.display = 'none' // Hide tabs other than the first
            // return html`<button class="tab" @click=${() => {
            //   // Toggle between Tabs
            //   if (thing.style.display === 'none') {
            //     this.things.forEach(t => (t != thing) ? t.style.display = 'none' : t.style.display = '') // hide other tabs
            //   }
            // }}>${thing.name ?? `Tab ${i}`}</button>`
            thing.style.display = 'none'; // Hide thing content
            return $ `<div id=tile @click=${() => { console.log('clicked!'); }}>
        <div>
          <h3>${thing.name}</h3>
          <p>Item #${i}.</p>
        <div>
      </div>`;
        };
        this.getThings = () => {
            this.things = [];
            for (var i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                if (child.name)
                    this.things.push(child); // Must have name to be a Thing
            }
            return this.things;
        };
        if (props.search)
            this.search = props.search;
    }
    static get styles() {
        return r$2 `

    :host {
      width: 100%;
      height: 100%;
    } 

    #things {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
    }

    #tile {
      box-sizing: border-box;
      flex: 1 0 auto;
      aspect-ratio: 1 / 1 ;
      max-width: 200px;
      border-radius: 10px;
      margin: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.2);
      cursor: pointer;
      transition: 0.5s;
    }

    #tile:hover{
      background: rgba(0,0,0,0.1);
    }

    #tile > div {
      padding: 25px;
    }
    `;
    }
    static get properties() {
        return {};
    }
    render() {
        this.getThings();
        return $ `
      <visualscript-search .items=${this.things}></visualscript-search>
      <div id=things>
      ${this.things.map(this.load)}
      </div>
      <section>
        <slot></slot>
      </section>
    `;
    }
}
customElements.define('visualscript-gallery', Gallery);

const collapseThreshold = 600;
class Sidebar extends s {
    constructor(props = {}) {
        super();
        this.content = '';
        this.interacted = false;
        this.closed = props.closed;
        this.classList.add('default');
    }
    static get styles() {
        return r$2 `

    
    :host {

      --collapse-width: ${collapseThreshold}px;
      --dark-color: rgb(25, 25, 25);
      --light-color: rgb(240, 240, 240);

      --blue-spiral: repeating-linear-gradient(
        45deg,
        rgb(30, 167, 253),
        rgb(30, 167, 253) 10px,
        rgb(118, 222, 255) 10px,
        rgb(118, 222, 255) 20px
      );

      /* Light Hue: 118, 222, 255 */
      /* Dark Hue: 0, 116, 196 */

      --light-spiral: repeating-linear-gradient(
        45deg,
        rgb(190, 190, 190),
        rgb(190, 190, 190) 10px,
        rgb(240, 240, 240) 10px,
        rgb(240, 240, 240) 20px
      );

      --dark-spiral: repeating-linear-gradient(
        45deg,
        rgb(25, 25, 25),
        rgb(25, 25, 25) 10px,
        rgb(75, 75, 75) 10px,
        rgb(75, 75, 75) 20px
      );

      --final-toggle-width: 15px;

      color: black;
      grid-area: side;
      background: var(--light-color);
      position: relative;
      display: flex;
      overflow: hidden;
      max-width: 50vw;
    }


    :host > * {
      box-sizing: border-box;
    }

    :host([closed]) > #main {
        width: 0px;
        overflow: hidden;
    }

    :host([closed]) > #toggle {
      width: var(--final-toggle-width);
    }

    #main {
      overflow: hidden;
    }

    #toggle:hover { 
      background: var(--blue-spiral)
    }

    .hidden {
      display: none;
    }

    #toggle {
      height: 100%;
      width: 10px;
      background: rgb(25, 25, 25);
      cursor: pointer;
      background: var(--light-spiral);
      border:none;
    }

    #toggle:active {
      background: var(--blue-spiral)
    }

    #controls {
      overflow-x: hidden;
      overflow-y: scroll;
      height: 100%;
    }

    @media only screen and (max-width: ${collapseThreshold}px) {
      :host {
        max-width: 100%;
      }

      :host(.default) > #main {
          width: 0px;
          overflow: hidden;
      }

      :host(.default) > #toggle {
        width: var(--final-toggle-width);
      }
    }


    #toggle {
      position: sticky;
      left:0;
      top: 0;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        color: white;
        background: var(--dark-color);
      }

      #toggle {
        background: var(--dark-spiral)
      }
    }

    `;
    }
    static get properties() {
        return {
            closed: {
                type: Boolean,
                reflect: true
            },
            content: {
                type: Object,
                reflect: true
            },
        };
    }
    render() {
        var _a;
        const renderToggle = this.content || ((_a = this.children) === null || _a === void 0 ? void 0 : _a.length); // Note: May also need to check the slot generally...
        return $ `
        <button id=toggle class="${!!renderToggle ? '' : 'hidden'}" @click=${() => {
            const wasDefault = this.classList.contains('default');
            this.classList.remove('default'); // Closed only added after user interaction
            if (window.innerWidth < collapseThreshold) {
                if (!wasDefault)
                    this.closed = !this.closed; // Closed only added after user interaction
            }
            else
                this.closed = !this.closed; // Closed only added after user interaction
        }}></button>
        <div id=main>
          <div id=controls>
          ${this.content}
          <slot></slot>
          </div>
        </div>
      `;
    }
}
customElements.define('visualscript-sidebar', Sidebar);

class SidebarHeader extends s {
    static get styles() {
        return r$2 `

    :host {
      width: 100%;
    }

    h4 {
      background: rgb(25, 25, 25);
      color: white;
      margin: 0px;
      padding: 10px 25px;
    }

    @media (prefers-color-scheme: dark) {
      h4 {
        color: black;
        background: rgb(60, 60, 60);
      }
    }

    `;
    }
    static get properties() {
        return {};
    }
    constructor(props = {}) {
        super();
    }
    render() {
        return $ `
          <h4><slot></slot></h4>
      `;
    }
}
customElements.define('visualscript-sidebar-header', SidebarHeader);

export { App, Button, CodeEditor, Control, Dashboard, DeviceEditor, File, Footer, Gallery, GraphEditor, Input, Loader, Main, Modal, Nav, ObjectEditor, Overlay, Range, Search, Select, SessionEditor, Sidebar, SidebarHeader, Spectrogram, Switch, Tab, TabBar, TabBarPropsLit, TabPropsLit, TabToggle, TabTogglePropsLit, TimeSeries, slotGrid, index as streams, tabStyle };
