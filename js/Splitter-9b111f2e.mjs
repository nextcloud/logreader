/*! third party licenses: js/vendor.LICENSE.txt */
import { g as d } from "./index-707acbaa.mjs";
var h = function(a) {
  for (var c = 0, n = 1, o = 2, b = 3, e = c, s = 0, i = null, t = [], r = 0; r < a.length; ++r)
    switch (e) {
      case c:
        switch (a[r]) {
          case "{":
            ++s, e = n, i = r;
            break;
        }
        break;
      case n:
        switch (a[r]) {
          case "{":
            ++s;
            break;
          case "}":
            --s, s === 0 && (e = c, t.push({ start: i, end: r + 1 }));
            break;
          case '"':
            e = o;
            break;
        }
        break;
      case o:
        switch (a[r]) {
          case '"':
            e = n;
            break;
          case "\\":
            e = b;
            break;
        }
        break;
      case b:
        e = o;
        break;
    }
  var u = { jsons: [], remainder: a.substring(t[t.length - 1].end) };
  return t.forEach(function(k) {
    u.jsons.push(a.substring(k.start, k.end));
  }), u;
};
const l = d(h), g = Object.freeze(Object.defineProperty({ __proto__: null, default: l }, Symbol.toStringTag, { value: "Module" }));
export {
  g as S
};
