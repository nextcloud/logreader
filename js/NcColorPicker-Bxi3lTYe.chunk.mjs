/*! third party licenses: js/vendor.LICENSE.txt */
import{c as gt,n as Ft,d as Ot,r as At,u as Et,b as jt,e as Lt,f as Mt,l as Pt,t as xt,N as Dt,h as Bt,i as Nt,m as Rt,j as Tt,k as Ht,o as It}from"./logreader-main.mjs";import{d as mt,C as _t,a as yt}from"./colors-BMiIMYXK-Dwr2Mei3.chunk.mjs";var bt={exports:{}},$t=bt.exports,wt;function zt(){return wt||(wt=1,function(B,N){(function(o,a){B.exports=a()})(typeof self<"u"?self:$t,function(){return function(o){function a(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return o[r].call(i.exports,i,i.exports,a),i.l=!0,i.exports}var e={};return a.m=o,a.c=e,a.d=function(r,i,s){a.o(r,i)||Object.defineProperty(r,i,{configurable:!1,enumerable:!0,get:s})},a.n=function(r){var i=r&&r.__esModule?function(){return r.default}:function(){return r};return a.d(i,"a",i),i},a.o=function(r,i){return Object.prototype.hasOwnProperty.call(r,i)},a.p="",a(a.s=60)}([function(o,a){function e(i,s){var t=i[1]||"",f=i[3];if(!f)return t;if(s&&typeof btoa=="function"){var n=r(f);return[t].concat(f.sources.map(function(c){return"/*# sourceURL="+f.sourceRoot+c+" */"})).concat([n]).join(`
`)}return[t].join(`
`)}function r(i){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"}o.exports=function(i){var s=[];return s.toString=function(){return this.map(function(t){var f=e(t,i);return t[2]?"@media "+t[2]+"{"+f+"}":f}).join("")},s.i=function(t,f){typeof t=="string"&&(t=[[null,t,""]]);for(var n={},c=0;c<this.length;c++){var p=this[c][0];typeof p=="number"&&(n[p]=!0)}for(c=0;c<t.length;c++){var d=t[c];typeof d[0]=="number"&&n[d[0]]||(f&&!d[2]?d[2]=f:f&&(d[2]="("+d[2]+") and ("+f+")"),s.push(d))}},s}},function(o,a,e){function r(O){for(var L=0;L<O.length;L++){var M=O[L],A=p[M.id];if(A){A.refs++;for(var g=0;g<A.parts.length;g++)A.parts[g](M.parts[g]);for(;g<M.parts.length;g++)A.parts.push(s(M.parts[g]));A.parts.length>M.parts.length&&(A.parts.length=M.parts.length)}else{for(var j=[],g=0;g<M.parts.length;g++)j.push(s(M.parts[g]));p[M.id]={id:M.id,refs:1,parts:j}}}}function i(){var O=document.createElement("style");return O.type="text/css",d.appendChild(O),O}function s(O){var L,M,A=document.querySelector("style["+F+'~="'+O.id+'"]');if(A){if(v)return m;A.parentNode.removeChild(A)}if(I){var g=w++;A=b||(b=i()),L=t.bind(null,A,g,!1),M=t.bind(null,A,g,!0)}else A=i(),L=f.bind(null,A),M=function(){A.parentNode.removeChild(A)};return L(O),function(j){if(j){if(j.css===O.css&&j.media===O.media&&j.sourceMap===O.sourceMap)return;L(O=j)}else M()}}function t(O,L,M,A){var g=M?"":A.css;if(O.styleSheet)O.styleSheet.cssText=J(L,g);else{var j=document.createTextNode(g),D=O.childNodes;D[L]&&O.removeChild(D[L]),D.length?O.insertBefore(j,D[L]):O.appendChild(j)}}function f(O,L){var M=L.css,A=L.media,g=L.sourceMap;if(A&&O.setAttribute("media",A),y.ssrId&&O.setAttribute(F,L.id),g&&(M+=`
/*# sourceURL=`+g.sources[0]+" */",M+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(g))))+" */"),O.styleSheet)O.styleSheet.cssText=M;else{for(;O.firstChild;)O.removeChild(O.firstChild);O.appendChild(document.createTextNode(M))}}var n=typeof document<"u";if(typeof DEBUG<"u"&&DEBUG&&!n)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var c=e(64),p={},d=n&&(document.head||document.getElementsByTagName("head")[0]),b=null,w=0,v=!1,m=function(){},y=null,F="data-vue-ssr-id",I=typeof navigator<"u"&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());o.exports=function(O,L,M,A){v=M,y=A||{};var g=c(O,L);return r(g),function(j){for(var D=[],R=0;R<g.length;R++){var U=g[R],P=p[U.id];P.refs--,D.push(P)}j?(g=c(O,j),r(g)):g=[];for(var R=0;R<D.length;R++){var P=D[R];if(P.refs===0){for(var Y=0;Y<P.parts.length;Y++)P.parts[Y]();delete p[P.id]}}}};var J=function(){var O=[];return function(L,M){return O[L]=M,O.filter(Boolean).join(`
`)}}()},function(o,a){o.exports=function(e,r,i,s,t,f){var n,c=e=e||{},p=typeof e.default;p!=="object"&&p!=="function"||(n=e,c=e.default);var d=typeof c=="function"?c.options:c;r&&(d.render=r.render,d.staticRenderFns=r.staticRenderFns,d._compiled=!0),i&&(d.functional=!0),t&&(d._scopeId=t);var b;if(f?(b=function(m){m=m||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,m||typeof __VUE_SSR_CONTEXT__>"u"||(m=__VUE_SSR_CONTEXT__),s&&s.call(this,m),m&&m._registeredComponents&&m._registeredComponents.add(f)},d._ssrRegister=b):s&&(b=s),b){var w=d.functional,v=w?d.render:d.beforeCreate;w?(d._injectStyles=b,d.render=function(m,y){return b.call(y),v(m,y)}):d.beforeCreate=v?[].concat(v,b):[b]}return{esModule:n,exports:c,options:d}}},function(o,a,e){function r(t,f){var n,c=t&&t.a;!(n=t&&t.hsl?(0,s.default)(t.hsl):t&&t.hex&&t.hex.length>0?(0,s.default)(t.hex):t&&t.hsv?(0,s.default)(t.hsv):t&&t.rgba?(0,s.default)(t.rgba):t&&t.rgb?(0,s.default)(t.rgb):(0,s.default)(t))||n._a!==void 0&&n._a!==null||n.setAlpha(c||1);var p=n.toHsl(),d=n.toHsv();return p.s===0&&(d.h=p.h=t.h||t.hsl&&t.hsl.h||f||0),{hsl:p,hex:n.toHexString().toUpperCase(),hex8:n.toHex8String().toUpperCase(),rgba:n.toRgb(),hsv:d,oldHue:t.h||f||p.h,source:t.source,a:t.a||n.getAlpha()}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(65),s=function(t){return t&&t.__esModule?t:{default:t}}(i);a.default={props:["value"],data:function(){return{val:r(this.value)}},computed:{colors:{get:function(){return this.val},set:function(t){this.val=t,this.$emit("input",t)}}},watch:{value:function(t){this.val=r(t)}},methods:{colorChange:function(t,f){this.oldHue=this.colors.hsl.h,this.colors=r(t,f||this.oldHue)},isValidHex:function(t){return(0,s.default)(t).isValid()},simpleCheckForValidColor:function(t){for(var f=["r","g","b","a","h","s","l","v"],n=0,c=0,p=0;p<f.length;p++){var d=f[p];t[d]&&(n++,isNaN(t[d])||c++)}if(n===c)return t},paletteUpperCase:function(t){return t.map(function(f){return f.toUpperCase()})},isTransparent:function(t){return(0,s.default)(t).getAlpha()===0}}}},function(o,a){var e=o.exports=typeof window<"u"&&window.Math==Math?window:typeof self<"u"&&self.Math==Math?self:Function("return this")();typeof __g=="number"&&(__g=e)},function(o,a,e){function r(d){e(66)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(36),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(68),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/common/EditableInput.vue",a.default=p.exports},function(o,a){var e={}.hasOwnProperty;o.exports=function(r,i){return e.call(r,i)}},function(o,a,e){var r=e(8),i=e(18);o.exports=e(9)?function(s,t,f){return r.f(s,t,i(1,f))}:function(s,t,f){return s[t]=f,s}},function(o,a,e){var r=e(16),i=e(42),s=e(25),t=Object.defineProperty;a.f=e(9)?Object.defineProperty:function(f,n,c){if(r(f),n=s(n,!0),r(c),i)try{return t(f,n,c)}catch{}if("get"in c||"set"in c)throw TypeError("Accessors not supported!");return"value"in c&&(f[n]=c.value),f}},function(o,a,e){o.exports=!e(17)(function(){return Object.defineProperty({},"a",{get:function(){return 7}}).a!=7})},function(o,a,e){var r=e(90),i=e(24);o.exports=function(s){return r(i(s))}},function(o,a,e){var r=e(29)("wks"),i=e(19),s=e(4).Symbol,t=typeof s=="function";(o.exports=function(f){return r[f]||(r[f]=t&&s[f]||(t?s:i)("Symbol."+f))}).store=r},function(o,a){o.exports=function(e){return typeof e=="object"?e!==null:typeof e=="function"}},function(o,a,e){function r(d){e(111)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(51),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(113),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/common/Hue.vue",a.default=p.exports},function(o,a){o.exports=!0},function(o,a){var e=o.exports={version:"2.6.11"};typeof __e=="number"&&(__e=e)},function(o,a,e){var r=e(12);o.exports=function(i){if(!r(i))throw TypeError(i+" is not an object!");return i}},function(o,a){o.exports=function(e){try{return!!e()}catch{return!0}}},function(o,a){o.exports=function(e,r){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:r}}},function(o,a){var e=0,r=Math.random();o.exports=function(i){return"Symbol(".concat(i===void 0?"":i,")_",(++e+r).toString(36))}},function(o,a,e){function r(d){e(123)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(54),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(127),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/common/Saturation.vue",a.default=p.exports},function(o,a,e){function r(d){e(128)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(55),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(133),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/common/Alpha.vue",a.default=p.exports},function(o,a,e){function r(d){e(130)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(56),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(132),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/common/Checkboard.vue",a.default=p.exports},function(o,a){var e=Math.ceil,r=Math.floor;o.exports=function(i){return isNaN(i=+i)?0:(i>0?r:e)(i)}},function(o,a){o.exports=function(e){if(e==null)throw TypeError("Can't call method on  "+e);return e}},function(o,a,e){var r=e(12);o.exports=function(i,s){if(!r(i))return i;var t,f;if(s&&typeof(t=i.toString)=="function"&&!r(f=t.call(i))||typeof(t=i.valueOf)=="function"&&!r(f=t.call(i))||!s&&typeof(t=i.toString)=="function"&&!r(f=t.call(i)))return f;throw TypeError("Can't convert object to primitive value")}},function(o,a){o.exports={}},function(o,a,e){var r=e(46),i=e(30);o.exports=Object.keys||function(s){return r(s,i)}},function(o,a,e){var r=e(29)("keys"),i=e(19);o.exports=function(s){return r[s]||(r[s]=i(s))}},function(o,a,e){var r=e(15),i=e(4),s=i["__core-js_shared__"]||(i["__core-js_shared__"]={});(o.exports=function(t,f){return s[t]||(s[t]=f!==void 0?f:{})})("versions",[]).push({version:r.version,mode:e(14)?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},function(o,a){o.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(o,a,e){var r=e(8).f,i=e(6),s=e(11)("toStringTag");o.exports=function(t,f,n){t&&!i(t=n?t:t.prototype,s)&&r(t,s,{configurable:!0,value:f})}},function(o,a,e){a.f=e(11)},function(o,a,e){var r=e(4),i=e(15),s=e(14),t=e(32),f=e(8).f;o.exports=function(n){var c=i.Symbol||(i.Symbol=s?{}:r.Symbol||{});n.charAt(0)=="_"||n in c||f(c,n,{value:t.f(n)})}},function(o,a){a.f={}.propertyIsEnumerable},function(o,a,e){function r(c){return c&&c.__esModule?c:{default:c}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(3),s=r(i),t=e(5),f=r(t),n=["#4D4D4D","#999999","#FFFFFF","#F44E3B","#FE9200","#FCDC00","#DBDF00","#A4DD00","#68CCCA","#73D8FF","#AEA1FF","#FDA1FF","#333333","#808080","#CCCCCC","#D33115","#E27300","#FCC400","#B0BC00","#68BC00","#16A5A5","#009CE0","#7B64FF","#FA28FF","#000000","#666666","#B3B3B3","#9F0500","#C45100","#FB9E00","#808900","#194D33","#0C797D","#0062B1","#653294","#AB149E"];a.default={name:"Compact",mixins:[s.default],props:{palette:{type:Array,default:function(){return n}}},components:{"ed-in":f.default},computed:{pick:function(){return this.colors.hex.toUpperCase()}},methods:{handlerClick:function(c){this.colorChange({hex:c,source:"hex"})}}}},function(o,a,e){Object.defineProperty(a,"__esModule",{value:!0}),a.default={name:"editableInput",props:{label:String,labelText:String,desc:String,value:[String,Number],max:Number,min:Number,arrowOffset:{type:Number,default:1}},computed:{val:{get:function(){return this.value},set:function(r){if(!(this.max!==void 0&&+r>this.max))return r;this.$refs.input.value=this.max}},labelId:function(){return"input__label__"+this.label+"__"+Math.random().toString().slice(2,5)},labelSpanText:function(){return this.labelText||this.label}},methods:{update:function(r){this.handleChange(r.target.value)},handleChange:function(r){var i={};i[this.label]=r,i.hex===void 0&&i["#"]===void 0?this.$emit("change",i):r.length>5&&this.$emit("change",i)},handleKeyDown:function(r){var i=this.val,s=Number(i);if(s){var t=this.arrowOffset||1;r.keyCode===38&&(i=s+t,this.handleChange(i),r.preventDefault()),r.keyCode===40&&(i=s-t,this.handleChange(i),r.preventDefault())}}}}},function(o,a,e){Object.defineProperty(a,"__esModule",{value:!0});var r=e(3),i=function(t){return t&&t.__esModule?t:{default:t}}(r),s=["#FFFFFF","#F2F2F2","#E6E6E6","#D9D9D9","#CCCCCC","#BFBFBF","#B3B3B3","#A6A6A6","#999999","#8C8C8C","#808080","#737373","#666666","#595959","#4D4D4D","#404040","#333333","#262626","#0D0D0D","#000000"];a.default={name:"Grayscale",mixins:[i.default],props:{palette:{type:Array,default:function(){return s}}},components:{},computed:{pick:function(){return this.colors.hex.toUpperCase()}},methods:{handlerClick:function(t){this.colorChange({hex:t,source:"hex"})}}}},function(o,a,e){function r(n){return n&&n.__esModule?n:{default:n}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(5),s=r(i),t=e(3),f=r(t);a.default={name:"Material",mixins:[f.default],components:{"ed-in":s.default},methods:{onChange:function(n){n&&(n.hex?this.isValidHex(n.hex)&&this.colorChange({hex:n.hex,source:"hex"}):(n.r||n.g||n.b)&&this.colorChange({r:n.r||this.colors.rgba.r,g:n.g||this.colors.rgba.g,b:n.b||this.colors.rgba.b,a:n.a||this.colors.rgba.a,source:"rgba"}))}}}},function(o,a,e){function r(p){return p&&p.__esModule?p:{default:p}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(81),s=r(i),t=e(3),f=r(t),n=e(13),c=r(n);a.default={name:"Slider",mixins:[f.default],props:{swatches:{type:Array,default:function(){return[{s:.5,l:.8},{s:.5,l:.65},{s:.5,l:.5},{s:.5,l:.35},{s:.5,l:.2}]}}},components:{hue:c.default},computed:{normalizedSwatches:function(){return this.swatches.map(function(p){return(p===void 0?"undefined":(0,s.default)(p))!=="object"?{s:.5,l:p}:p})}},methods:{isActive:function(p,d){var b=this.colors.hsl;return b.l===1&&p.l===1||b.l===0&&p.l===0||Math.abs(b.l-p.l)<.01&&Math.abs(b.s-p.s)<.01},hueChange:function(p){this.colorChange(p)},handleSwClick:function(p,d){this.colorChange({h:this.colors.hsl.h,s:d.s,l:d.l,source:"hsl"})}}}},function(o,a,e){var r=e(14),i=e(41),s=e(44),t=e(7),f=e(26),n=e(88),c=e(31),p=e(95),d=e(11)("iterator"),b=!([].keys&&"next"in[].keys()),w=function(){return this};o.exports=function(v,m,y,F,I,J,O){n(y,m,F);var L,M,A,g=function(V){if(!b&&V in U)return U[V];switch(V){case"keys":case"values":return function(){return new y(this,V)}}return function(){return new y(this,V)}},j=m+" Iterator",D=I=="values",R=!1,U=v.prototype,P=U[d]||U["@@iterator"]||I&&U[I],Y=P||g(I),$=I?D?g("entries"):Y:void 0,ct=m=="Array"&&U.entries||P;if(ct&&(A=p(ct.call(new v)))!==Object.prototype&&A.next&&(c(A,j,!0),r||typeof A[d]=="function"||t(A,d,w)),D&&P&&P.name!=="values"&&(R=!0,Y=function(){return P.call(this)}),r&&!O||!b&&!R&&U[d]||t(U,d,Y),f[m]=Y,f[j]=w,I)if(L={values:D?Y:g("values"),keys:J?Y:g("keys"),entries:$},O)for(M in L)M in U||s(U,M,L[M]);else i(i.P+i.F*(b||R),m,L);return L}},function(o,a,e){var r=e(4),i=e(15),s=e(86),t=e(7),f=e(6),n=function(c,p,d){var b,w,v,m=c&n.F,y=c&n.G,F=c&n.S,I=c&n.P,J=c&n.B,O=c&n.W,L=y?i:i[p]||(i[p]={}),M=L.prototype,A=y?r:F?r[p]:(r[p]||{}).prototype;y&&(d=p);for(b in d)(w=!m&&A&&A[b]!==void 0)&&f(L,b)||(v=w?A[b]:d[b],L[b]=y&&typeof A[b]!="function"?d[b]:J&&w?s(v,r):O&&A[b]==v?function(g){var j=function(D,R,U){if(this instanceof g){switch(arguments.length){case 0:return new g;case 1:return new g(D);case 2:return new g(D,R)}return new g(D,R,U)}return g.apply(this,arguments)};return j.prototype=g.prototype,j}(v):I&&typeof v=="function"?s(Function.call,v):v,I&&((L.virtual||(L.virtual={}))[b]=v,c&n.R&&M&&!M[b]&&t(M,b,v)))};n.F=1,n.G=2,n.S=4,n.P=8,n.B=16,n.W=32,n.U=64,n.R=128,o.exports=n},function(o,a,e){o.exports=!e(9)&&!e(17)(function(){return Object.defineProperty(e(43)("div"),"a",{get:function(){return 7}}).a!=7})},function(o,a,e){var r=e(12),i=e(4).document,s=r(i)&&r(i.createElement);o.exports=function(t){return s?i.createElement(t):{}}},function(o,a,e){o.exports=e(7)},function(o,a,e){var r=e(16),i=e(89),s=e(30),t=e(28)("IE_PROTO"),f=function(){},n=function(){var c,p=e(43)("iframe"),d=s.length;for(p.style.display="none",e(94).appendChild(p),p.src="javascript:",c=p.contentWindow.document,c.open(),c.write("<script>document.F=Object<\/script>"),c.close(),n=c.F;d--;)delete n.prototype[s[d]];return n()};o.exports=Object.create||function(c,p){var d;return c!==null?(f.prototype=r(c),d=new f,f.prototype=null,d[t]=c):d=n(),p===void 0?d:i(d,p)}},function(o,a,e){var r=e(6),i=e(10),s=e(91)(!1),t=e(28)("IE_PROTO");o.exports=function(f,n){var c,p=i(f),d=0,b=[];for(c in p)c!=t&&r(p,c)&&b.push(c);for(;n.length>d;)r(p,c=n[d++])&&(~s(b,c)||b.push(c));return b}},function(o,a){var e={}.toString;o.exports=function(r){return e.call(r).slice(8,-1)}},function(o,a,e){var r=e(24);o.exports=function(i){return Object(r(i))}},function(o,a){a.f=Object.getOwnPropertySymbols},function(o,a,e){var r=e(46),i=e(30).concat("length","prototype");a.f=Object.getOwnPropertyNames||function(s){return r(s,i)}},function(o,a,e){Object.defineProperty(a,"__esModule",{value:!0}),a.default={name:"Hue",props:{value:Object,direction:{type:String,default:"horizontal"}},data:function(){return{oldHue:0,pullDirection:""}},computed:{colors:function(){var r=this.value.hsl.h;return r!==0&&r-this.oldHue>0&&(this.pullDirection="right"),r!==0&&r-this.oldHue<0&&(this.pullDirection="left"),this.oldHue=r,this.value},directionClass:function(){return{"vc-hue--horizontal":this.direction==="horizontal","vc-hue--vertical":this.direction==="vertical"}},pointerTop:function(){return this.direction==="vertical"?this.colors.hsl.h===0&&this.pullDirection==="right"?0:-100*this.colors.hsl.h/360+100+"%":0},pointerLeft:function(){return this.direction==="vertical"?0:this.colors.hsl.h===0&&this.pullDirection==="right"?"100%":100*this.colors.hsl.h/360+"%"}},methods:{handleChange:function(r,i){!i&&r.preventDefault();var s=this.$refs.container;if(s){var t,f,n=s.clientWidth,c=s.clientHeight,p=s.getBoundingClientRect().left+window.pageXOffset,d=s.getBoundingClientRect().top+window.pageYOffset,b=r.pageX||(r.touches?r.touches[0].pageX:0),w=r.pageY||(r.touches?r.touches[0].pageY:0),v=b-p,m=w-d;this.direction==="vertical"?(m<0?t=360:m>c?t=0:(f=-100*m/c+100,t=360*f/100),this.colors.hsl.h!==t&&this.$emit("change",{h:t,s:this.colors.hsl.s,l:this.colors.hsl.l,a:this.colors.hsl.a,source:"hsl"})):(v<0?t=0:v>n?t=360:(f=100*v/n,t=360*f/100),this.colors.hsl.h!==t&&this.$emit("change",{h:t,s:this.colors.hsl.s,l:this.colors.hsl.l,a:this.colors.hsl.a,source:"hsl"}))}},handleMouseDown:function(r){this.handleChange(r,!0),window.addEventListener("mousemove",this.handleChange),window.addEventListener("mouseup",this.handleMouseUp)},handleMouseUp:function(r){this.unbindEventListeners()},unbindEventListeners:function(){window.removeEventListener("mousemove",this.handleChange),window.removeEventListener("mouseup",this.handleMouseUp)}}}},function(o,a,e){function r(d){return d&&d.__esModule?d:{default:d}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(118),s=r(i),t=e(3),f=r(t),n=["red","pink","purple","deepPurple","indigo","blue","lightBlue","cyan","teal","green","lightGreen","lime","yellow","amber","orange","deepOrange","brown","blueGrey","black"],c=["900","700","500","300","100"],p=function(){var d=[];return n.forEach(function(b){var w=[];b.toLowerCase()==="black"||b.toLowerCase()==="white"?w=w.concat(["#000000","#FFFFFF"]):c.forEach(function(v){var m=s.default[b][v];w.push(m.toUpperCase())}),d.push(w)}),d}();a.default={name:"Swatches",mixins:[f.default],props:{palette:{type:Array,default:function(){return p}}},computed:{pick:function(){return this.colors.hex}},methods:{equal:function(d){return d.toLowerCase()===this.colors.hex.toLowerCase()},handlerClick:function(d){this.colorChange({hex:d,source:"hex"})}}}},function(o,a,e){function r(v){return v&&v.__esModule?v:{default:v}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(3),s=r(i),t=e(5),f=r(t),n=e(20),c=r(n),p=e(13),d=r(p),b=e(21),w=r(b);a.default={name:"Photoshop",mixins:[s.default],props:{head:{type:String,default:"Color Picker"},disableFields:{type:Boolean,default:!1},hasResetButton:{type:Boolean,default:!1},acceptLabel:{type:String,default:"OK"},cancelLabel:{type:String,default:"Cancel"},resetLabel:{type:String,default:"Reset"},newLabel:{type:String,default:"new"},currentLabel:{type:String,default:"current"}},components:{saturation:c.default,hue:d.default,alpha:w.default,"ed-in":f.default},data:function(){return{currentColor:"#FFF"}},computed:{hsv:function(){var v=this.colors.hsv;return{h:v.h.toFixed(),s:(100*v.s).toFixed(),v:(100*v.v).toFixed()}},hex:function(){var v=this.colors.hex;return v&&v.replace("#","")}},created:function(){this.currentColor=this.colors.hex},methods:{childChange:function(v){this.colorChange(v)},inputChange:function(v){v&&(v["#"]?this.isValidHex(v["#"])&&this.colorChange({hex:v["#"],source:"hex"}):v.r||v.g||v.b||v.a?this.colorChange({r:v.r||this.colors.rgba.r,g:v.g||this.colors.rgba.g,b:v.b||this.colors.rgba.b,a:v.a||this.colors.rgba.a,source:"rgba"}):(v.h||v.s||v.v)&&this.colorChange({h:v.h||this.colors.hsv.h,s:v.s/100||this.colors.hsv.s,v:v.v/100||this.colors.hsv.v,source:"hsv"}))},clickCurrentColor:function(){this.colorChange({hex:this.currentColor,source:"hex"})},handleAccept:function(){this.$emit("ok")},handleCancel:function(){this.$emit("cancel")},handleReset:function(){this.$emit("reset")}}}},function(o,a,e){function r(n){return n&&n.__esModule?n:{default:n}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(125),s=r(i),t=e(126),f=r(t);a.default={name:"Saturation",props:{value:Object},computed:{colors:function(){return this.value},bgColor:function(){return"hsl("+this.colors.hsv.h+", 100%, 50%)"},pointerTop:function(){return-100*this.colors.hsv.v+1+100+"%"},pointerLeft:function(){return 100*this.colors.hsv.s+"%"}},methods:{throttle:(0,f.default)(function(n,c){n(c)},20,{leading:!0,trailing:!1}),handleChange:function(n,c){!c&&n.preventDefault();var p=this.$refs.container;if(p){var d=p.clientWidth,b=p.clientHeight,w=p.getBoundingClientRect().left+window.pageXOffset,v=p.getBoundingClientRect().top+window.pageYOffset,m=n.pageX||(n.touches?n.touches[0].pageX:0),y=n.pageY||(n.touches?n.touches[0].pageY:0),F=(0,s.default)(m-w,0,d),I=(0,s.default)(y-v,0,b),J=F/d,O=(0,s.default)(-I/b+1,0,1);this.throttle(this.onChange,{h:this.colors.hsv.h,s:J,v:O,a:this.colors.hsv.a,source:"hsva"})}},onChange:function(n){this.$emit("change",n)},handleMouseDown:function(n){window.addEventListener("mousemove",this.handleChange),window.addEventListener("mouseup",this.handleChange),window.addEventListener("mouseup",this.handleMouseUp)},handleMouseUp:function(n){this.unbindEventListeners()},unbindEventListeners:function(){window.removeEventListener("mousemove",this.handleChange),window.removeEventListener("mouseup",this.handleChange),window.removeEventListener("mouseup",this.handleMouseUp)}}}},function(o,a,e){Object.defineProperty(a,"__esModule",{value:!0});var r=e(22),i=function(s){return s&&s.__esModule?s:{default:s}}(r);a.default={name:"Alpha",props:{value:Object,onChange:Function},components:{checkboard:i.default},computed:{colors:function(){return this.value},gradientColor:function(){var s=this.colors.rgba,t=[s.r,s.g,s.b].join(",");return"linear-gradient(to right, rgba("+t+", 0) 0%, rgba("+t+", 1) 100%)"}},methods:{handleChange:function(s,t){!t&&s.preventDefault();var f=this.$refs.container;if(f){var n,c=f.clientWidth,p=f.getBoundingClientRect().left+window.pageXOffset,d=s.pageX||(s.touches?s.touches[0].pageX:0),b=d-p;n=b<0?0:b>c?1:Math.round(100*b/c)/100,this.colors.a!==n&&this.$emit("change",{h:this.colors.hsl.h,s:this.colors.hsl.s,l:this.colors.hsl.l,a:n,source:"rgba"})}},handleMouseDown:function(s){this.handleChange(s,!0),window.addEventListener("mousemove",this.handleChange),window.addEventListener("mouseup",this.handleMouseUp)},handleMouseUp:function(){this.unbindEventListeners()},unbindEventListeners:function(){window.removeEventListener("mousemove",this.handleChange),window.removeEventListener("mouseup",this.handleMouseUp)}}}},function(o,a,e){function r(t,f,n){if(typeof document>"u")return null;var c=document.createElement("canvas");c.width=c.height=2*n;var p=c.getContext("2d");return p?(p.fillStyle=t,p.fillRect(0,0,c.width,c.height),p.fillStyle=f,p.fillRect(0,0,n,n),p.translate(n,n),p.fillRect(0,0,n,n),c.toDataURL()):null}function i(t,f,n){var c=t+","+f+","+n;if(s[c])return s[c];var p=r(t,f,n);return s[c]=p,p}Object.defineProperty(a,"__esModule",{value:!0});var s={};a.default={name:"Checkboard",props:{size:{type:[Number,String],default:8},white:{type:String,default:"#fff"},grey:{type:String,default:"#e6e6e6"}},computed:{bgStyle:function(){return{"background-image":"url("+i(this.white,this.grey,this.size)+")"}}}}},function(o,a,e){function r(F){return F&&F.__esModule?F:{default:F}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(3),s=r(i),t=e(5),f=r(t),n=e(20),c=r(n),p=e(13),d=r(p),b=e(21),w=r(b),v=e(22),m=r(v),y=["#D0021B","#F5A623","#F8E71C","#8B572A","#7ED321","#417505","#BD10E0","#9013FE","#4A90E2","#50E3C2","#B8E986","#000000","#4A4A4A","#9B9B9B","#FFFFFF","rgba(0,0,0,0)"];a.default={name:"Sketch",mixins:[s.default],components:{saturation:c.default,hue:d.default,alpha:w.default,"ed-in":f.default,checkboard:m.default},props:{presetColors:{type:Array,default:function(){return y}},disableAlpha:{type:Boolean,default:!1},disableFields:{type:Boolean,default:!1}},computed:{hex:function(){var F=void 0;return F=this.colors.a<1?this.colors.hex8:this.colors.hex,F.replace("#","")},activeColor:function(){var F=this.colors.rgba;return"rgba("+[F.r,F.g,F.b,F.a].join(",")+")"}},methods:{handlePreset:function(F){this.colorChange({hex:F,source:"hex"})},childChange:function(F){this.colorChange(F)},inputChange:function(F){F&&(F.hex?this.isValidHex(F.hex)&&this.colorChange({hex:F.hex,source:"hex"}):(F.r||F.g||F.b||F.a)&&this.colorChange({r:F.r||this.colors.rgba.r,g:F.g||this.colors.rgba.g,b:F.b||this.colors.rgba.b,a:F.a||this.colors.rgba.a,source:"rgba"}))}}}},function(o,a,e){function r(y){return y&&y.__esModule?y:{default:y}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(3),s=r(i),t=e(5),f=r(t),n=e(20),c=r(n),p=e(13),d=r(p),b=e(21),w=r(b),v=e(22),m=r(v);a.default={name:"Chrome",mixins:[s.default],props:{disableAlpha:{type:Boolean,default:!1},disableFields:{type:Boolean,default:!1}},components:{saturation:c.default,hue:d.default,alpha:w.default,"ed-in":f.default,checkboard:m.default},data:function(){return{fieldsIndex:0,highlight:!1}},computed:{hsl:function(){var y=this.colors.hsl,F=y.h,I=y.s,J=y.l;return{h:F.toFixed(),s:(100*I).toFixed()+"%",l:(100*J).toFixed()+"%"}},activeColor:function(){var y=this.colors.rgba;return"rgba("+[y.r,y.g,y.b,y.a].join(",")+")"},hasAlpha:function(){return this.colors.a<1}},methods:{childChange:function(y){this.colorChange(y)},inputChange:function(y){if(y){if(y.hex)this.isValidHex(y.hex)&&this.colorChange({hex:y.hex,source:"hex"});else if(y.r||y.g||y.b||y.a)this.colorChange({r:y.r||this.colors.rgba.r,g:y.g||this.colors.rgba.g,b:y.b||this.colors.rgba.b,a:y.a||this.colors.rgba.a,source:"rgba"});else if(y.h||y.s||y.l){var F=y.s?y.s.replace("%","")/100:this.colors.hsl.s,I=y.l?y.l.replace("%","")/100:this.colors.hsl.l;this.colorChange({h:y.h||this.colors.hsl.h,s:F,l:I,source:"hsl"})}}},toggleViews:function(){if(this.fieldsIndex>=2)return void(this.fieldsIndex=0);this.fieldsIndex++},showHighlight:function(){this.highlight=!0},hideHighlight:function(){this.highlight=!1}}}},function(o,a,e){function r(c){return c&&c.__esModule?c:{default:c}}Object.defineProperty(a,"__esModule",{value:!0});var i=e(5),s=r(i),t=e(3),f=r(t),n=["#FF6900","#FCB900","#7BDCB5","#00D084","#8ED1FC","#0693E3","#ABB8C3","#EB144C","#F78DA7","#9900EF"];a.default={name:"Twitter",mixins:[f.default],components:{editableInput:s.default},props:{width:{type:[String,Number],default:276},defaultColors:{type:Array,default:function(){return n}},triangle:{default:"top-left",validator:function(c){return["hide","top-left","top-right"].includes(c)}}},computed:{hsv:function(){var c=this.colors.hsv;return{h:c.h.toFixed(),s:(100*c.s).toFixed(),v:(100*c.v).toFixed()}},hex:function(){var c=this.colors.hex;return c&&c.replace("#","")}},methods:{equal:function(c){return c.toLowerCase()===this.colors.hex.toLowerCase()},handlerClick:function(c){this.colorChange({hex:c,source:"hex"})},inputChange:function(c){c&&(c["#"]?this.isValidHex(c["#"])&&this.colorChange({hex:c["#"],source:"hex"}):c.r||c.g||c.b||c.a?this.colorChange({r:c.r||this.colors.rgba.r,g:c.g||this.colors.rgba.g,b:c.b||this.colors.rgba.b,a:c.a||this.colors.rgba.a,source:"rgba"}):(c.h||c.s||c.v)&&this.colorChange({h:c.h||this.colors.hsv.h,s:c.s/100||this.colors.hsv.s,v:c.v/100||this.colors.hsv.v,source:"hsv"}))}}}},function(o,a,e){function r(Z){return Z&&Z.__esModule?Z:{default:Z}}var i=e(61),s=r(i),t=e(70),f=r(t),n=e(74),c=r(n),p=e(78),d=r(p),b=e(115),w=r(b),v=e(120),m=r(v),y=e(135),F=r(y),I=e(139),J=r(I),O=e(143),L=r(O),M=e(21),A=r(M),g=e(22),j=r(g),D=e(5),R=r(D),U=e(13),P=r(U),Y=e(20),$=r(Y),ct=e(3),V=r(ct),K={version:"2.8.1",Compact:s.default,Grayscale:f.default,Twitter:L.default,Material:c.default,Slider:d.default,Swatches:w.default,Photoshop:m.default,Sketch:F.default,Chrome:J.default,Alpha:A.default,Checkboard:j.default,EditableInput:R.default,Hue:P.default,Saturation:$.default,ColorMixin:V.default};o.exports=K},function(o,a,e){function r(d){e(62)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(35),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(69),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/Compact.vue",a.default=p.exports},function(o,a,e){var r=e(63);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("6ce8a5a8",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-compact {
  padding-top: 5px;
  padding-left: 5px;
  width: 245px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
  background-color: #fff;
}
.vc-compact-colors {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.vc-compact-color-item {
  list-style: none;
  width: 15px;
  height: 15px;
  float: left;
  margin-right: 5px;
  margin-bottom: 5px;
  position: relative;
  cursor: pointer;
}
.vc-compact-color-item--white {
  box-shadow: inset 0 0 0 1px #ddd;
}
.vc-compact-color-item--white .vc-compact-dot {
  background: #000;
}
.vc-compact-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  bottom: 5px;
  left: 5px;
  border-radius: 50%;
  opacity: 1;
  background: #fff;
}
`,""])},function(o,a){o.exports=function(e,r){for(var i=[],s={},t=0;t<r.length;t++){var f=r[t],n=f[0],c=f[1],p=f[2],d=f[3],b={id:e+":"+t,css:c,media:p,sourceMap:d};s[n]?s[n].parts.push(b):i.push(s[n]={id:n,parts:[b]})}return i}},function(o,a,e){var r;(function(i){function s(l,h){if(l=l||"",h=h||{},l instanceof s)return l;if(!(this instanceof s))return new s(l,h);var u=t(l);this._originalInput=l,this._r=u.r,this._g=u.g,this._b=u.b,this._a=u.a,this._roundA=E(100*this._a)/100,this._format=h.format||u.format,this._gradientType=h.gradientType,this._r<1&&(this._r=E(this._r)),this._g<1&&(this._g=E(this._g)),this._b<1&&(this._b=E(this._b)),this._ok=u.ok,this._tc_id=ft++}function t(l){var h={r:0,g:0,b:0},u=1,x=null,S=null,C=null,H=!1,G=!1;return typeof l=="string"&&(l=it(l)),typeof l=="object"&&(rt(l.r)&&rt(l.g)&&rt(l.b)?(h=f(l.r,l.g,l.b),H=!0,G=String(l.r).substr(-1)==="%"?"prgb":"rgb"):rt(l.h)&&rt(l.s)&&rt(l.v)?(x=Z(l.s),S=Z(l.v),h=d(l.h,x,S),H=!0,G="hsv"):rt(l.h)&&rt(l.s)&&rt(l.l)&&(x=Z(l.s),C=Z(l.l),h=c(l.h,x,C),H=!0,G="hsl"),l.hasOwnProperty("a")&&(u=l.a)),u=U(u),{ok:H,format:l.format||G,r:tt(255,T(h.r,0)),g:tt(255,T(h.g,0)),b:tt(255,T(h.b,0)),a:u}}function f(l,h,u){return{r:255*P(l,255),g:255*P(h,255),b:255*P(u,255)}}function n(l,h,u){l=P(l,255),h=P(h,255),u=P(u,255);var x,S,C=T(l,h,u),H=tt(l,h,u),G=(C+H)/2;if(C==H)x=S=0;else{var X=C-H;switch(S=G>.5?X/(2-C-H):X/(C+H),C){case l:x=(h-u)/X+(h<u?6:0);break;case h:x=(u-l)/X+2;break;case u:x=(l-h)/X+4}x/=6}return{h:x,s:S,l:G}}function c(l,h,u){function x(lt,_,k){return k<0&&(k+=1),k>1&&(k-=1),k<1/6?lt+6*(_-lt)*k:k<.5?_:k<2/3?lt+(_-lt)*(2/3-k)*6:lt}var S,C,H;if(l=P(l,360),h=P(h,100),u=P(u,100),h===0)S=C=H=u;else{var G=u<.5?u*(1+h):u+h-u*h,X=2*u-G;S=x(X,G,l+1/3),C=x(X,G,l),H=x(X,G,l-1/3)}return{r:255*S,g:255*C,b:255*H}}function p(l,h,u){l=P(l,255),h=P(h,255),u=P(u,255);var x,S,C=T(l,h,u),H=tt(l,h,u),G=C,X=C-H;if(S=C===0?0:X/C,C==H)x=0;else{switch(C){case l:x=(h-u)/X+(h<u?6:0);break;case h:x=(u-l)/X+2;break;case u:x=(l-h)/X+4}x/=6}return{h:x,s:S,v:G}}function d(l,h,u){l=6*P(l,360),h=P(h,100),u=P(u,100);var x=i.floor(l),S=l-x,C=u*(1-h),H=u*(1-S*h),G=u*(1-(1-S)*h),X=x%6;return{r:255*[u,H,C,C,G,u][X],g:255*[G,u,u,H,C,C][X],b:255*[C,C,G,u,u,H][X]}}function b(l,h,u,x){var S=[K(E(l).toString(16)),K(E(h).toString(16)),K(E(u).toString(16))];return x&&S[0].charAt(0)==S[0].charAt(1)&&S[1].charAt(0)==S[1].charAt(1)&&S[2].charAt(0)==S[2].charAt(1)?S[0].charAt(0)+S[1].charAt(0)+S[2].charAt(0):S.join("")}function w(l,h,u,x,S){var C=[K(E(l).toString(16)),K(E(h).toString(16)),K(E(u).toString(16)),K(W(x))];return S&&C[0].charAt(0)==C[0].charAt(1)&&C[1].charAt(0)==C[1].charAt(1)&&C[2].charAt(0)==C[2].charAt(1)&&C[3].charAt(0)==C[3].charAt(1)?C[0].charAt(0)+C[1].charAt(0)+C[2].charAt(0)+C[3].charAt(0):C.join("")}function v(l,h,u,x){return[K(W(x)),K(E(l).toString(16)),K(E(h).toString(16)),K(E(u).toString(16))].join("")}function m(l,h){h=h===0?0:h||10;var u=s(l).toHsl();return u.s-=h/100,u.s=Y(u.s),s(u)}function y(l,h){h=h===0?0:h||10;var u=s(l).toHsl();return u.s+=h/100,u.s=Y(u.s),s(u)}function F(l){return s(l).desaturate(100)}function I(l,h){h=h===0?0:h||10;var u=s(l).toHsl();return u.l+=h/100,u.l=Y(u.l),s(u)}function J(l,h){h=h===0?0:h||10;var u=s(l).toRgb();return u.r=T(0,tt(255,u.r-E(-h/100*255))),u.g=T(0,tt(255,u.g-E(-h/100*255))),u.b=T(0,tt(255,u.b-E(-h/100*255))),s(u)}function O(l,h){h=h===0?0:h||10;var u=s(l).toHsl();return u.l-=h/100,u.l=Y(u.l),s(u)}function L(l,h){var u=s(l).toHsl(),x=(u.h+h)%360;return u.h=x<0?360+x:x,s(u)}function M(l){var h=s(l).toHsl();return h.h=(h.h+180)%360,s(h)}function A(l){var h=s(l).toHsl(),u=h.h;return[s(l),s({h:(u+120)%360,s:h.s,l:h.l}),s({h:(u+240)%360,s:h.s,l:h.l})]}function g(l){var h=s(l).toHsl(),u=h.h;return[s(l),s({h:(u+90)%360,s:h.s,l:h.l}),s({h:(u+180)%360,s:h.s,l:h.l}),s({h:(u+270)%360,s:h.s,l:h.l})]}function j(l){var h=s(l).toHsl(),u=h.h;return[s(l),s({h:(u+72)%360,s:h.s,l:h.l}),s({h:(u+216)%360,s:h.s,l:h.l})]}function D(l,h,u){h=h||6,u=u||30;var x=s(l).toHsl(),S=360/u,C=[s(l)];for(x.h=(x.h-(S*h>>1)+720)%360;--h;)x.h=(x.h+S)%360,C.push(s(x));return C}function R(l,h){h=h||6;for(var u=s(l).toHsv(),x=u.h,S=u.s,C=u.v,H=[],G=1/h;h--;)H.push(s({h:x,s:S,v:C})),C=(C+G)%1;return H}function U(l){return l=parseFloat(l),(isNaN(l)||l<0||l>1)&&(l=1),l}function P(l,h){ct(l)&&(l="100%");var u=V(l);return l=tt(h,T(0,parseFloat(l))),u&&(l=parseInt(l*h,10)/100),i.abs(l-h)<1e-6?1:l%h/parseFloat(h)}function Y(l){return tt(1,T(0,l))}function $(l){return parseInt(l,16)}function ct(l){return typeof l=="string"&&l.indexOf(".")!=-1&&parseFloat(l)===1}function V(l){return typeof l=="string"&&l.indexOf("%")!=-1}function K(l){return l.length==1?"0"+l:""+l}function Z(l){return l<=1&&(l=100*l+"%"),l}function W(l){return i.round(255*parseFloat(l)).toString(16)}function ut(l){return $(l)/255}function rt(l){return!!at.CSS_UNIT.exec(l)}function it(l){l=l.replace(nt,"").replace(Q,"").toLowerCase();var h=!1;if(st[l])l=st[l],h=!0;else if(l=="transparent")return{r:0,g:0,b:0,a:0,format:"name"};var u;return(u=at.rgb.exec(l))?{r:u[1],g:u[2],b:u[3]}:(u=at.rgba.exec(l))?{r:u[1],g:u[2],b:u[3],a:u[4]}:(u=at.hsl.exec(l))?{h:u[1],s:u[2],l:u[3]}:(u=at.hsla.exec(l))?{h:u[1],s:u[2],l:u[3],a:u[4]}:(u=at.hsv.exec(l))?{h:u[1],s:u[2],v:u[3]}:(u=at.hsva.exec(l))?{h:u[1],s:u[2],v:u[3],a:u[4]}:(u=at.hex8.exec(l))?{r:$(u[1]),g:$(u[2]),b:$(u[3]),a:ut(u[4]),format:h?"name":"hex8"}:(u=at.hex6.exec(l))?{r:$(u[1]),g:$(u[2]),b:$(u[3]),format:h?"name":"hex"}:(u=at.hex4.exec(l))?{r:$(u[1]+""+u[1]),g:$(u[2]+""+u[2]),b:$(u[3]+""+u[3]),a:ut(u[4]+""+u[4]),format:h?"name":"hex8"}:!!(u=at.hex3.exec(l))&&{r:$(u[1]+""+u[1]),g:$(u[2]+""+u[2]),b:$(u[3]+""+u[3]),format:h?"name":"hex"}}function q(l){var h,u;return l=l||{level:"AA",size:"small"},h=(l.level||"AA").toUpperCase(),u=(l.size||"small").toLowerCase(),h!=="AA"&&h!=="AAA"&&(h="AA"),u!=="small"&&u!=="large"&&(u="small"),{level:h,size:u}}var nt=/^\s+/,Q=/\s+$/,ft=0,E=i.round,tt=i.min,T=i.max,ot=i.random;s.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var l=this.toRgb();return(299*l.r+587*l.g+114*l.b)/1e3},getLuminance:function(){var l,h,u,x,S,C,H=this.toRgb();return l=H.r/255,h=H.g/255,u=H.b/255,x=l<=.03928?l/12.92:i.pow((l+.055)/1.055,2.4),S=h<=.03928?h/12.92:i.pow((h+.055)/1.055,2.4),C=u<=.03928?u/12.92:i.pow((u+.055)/1.055,2.4),.2126*x+.7152*S+.0722*C},setAlpha:function(l){return this._a=U(l),this._roundA=E(100*this._a)/100,this},toHsv:function(){var l=p(this._r,this._g,this._b);return{h:360*l.h,s:l.s,v:l.v,a:this._a}},toHsvString:function(){var l=p(this._r,this._g,this._b),h=E(360*l.h),u=E(100*l.s),x=E(100*l.v);return this._a==1?"hsv("+h+", "+u+"%, "+x+"%)":"hsva("+h+", "+u+"%, "+x+"%, "+this._roundA+")"},toHsl:function(){var l=n(this._r,this._g,this._b);return{h:360*l.h,s:l.s,l:l.l,a:this._a}},toHslString:function(){var l=n(this._r,this._g,this._b),h=E(360*l.h),u=E(100*l.s),x=E(100*l.l);return this._a==1?"hsl("+h+", "+u+"%, "+x+"%)":"hsla("+h+", "+u+"%, "+x+"%, "+this._roundA+")"},toHex:function(l){return b(this._r,this._g,this._b,l)},toHexString:function(l){return"#"+this.toHex(l)},toHex8:function(l){return w(this._r,this._g,this._b,this._a,l)},toHex8String:function(l){return"#"+this.toHex8(l)},toRgb:function(){return{r:E(this._r),g:E(this._g),b:E(this._b),a:this._a}},toRgbString:function(){return this._a==1?"rgb("+E(this._r)+", "+E(this._g)+", "+E(this._b)+")":"rgba("+E(this._r)+", "+E(this._g)+", "+E(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:E(100*P(this._r,255))+"%",g:E(100*P(this._g,255))+"%",b:E(100*P(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return this._a==1?"rgb("+E(100*P(this._r,255))+"%, "+E(100*P(this._g,255))+"%, "+E(100*P(this._b,255))+"%)":"rgba("+E(100*P(this._r,255))+"%, "+E(100*P(this._g,255))+"%, "+E(100*P(this._b,255))+"%, "+this._roundA+")"},toName:function(){return this._a===0?"transparent":!(this._a<1)&&(pt[b(this._r,this._g,this._b,!0)]||!1)},toFilter:function(l){var h="#"+v(this._r,this._g,this._b,this._a),u=h,x=this._gradientType?"GradientType = 1, ":"";if(l){var S=s(l);u="#"+v(S._r,S._g,S._b,S._a)}return"progid:DXImageTransform.Microsoft.gradient("+x+"startColorstr="+h+",endColorstr="+u+")"},toString:function(l){var h=!!l;l=l||this._format;var u=!1,x=this._a<1&&this._a>=0;return h||!x||l!=="hex"&&l!=="hex6"&&l!=="hex3"&&l!=="hex4"&&l!=="hex8"&&l!=="name"?(l==="rgb"&&(u=this.toRgbString()),l==="prgb"&&(u=this.toPercentageRgbString()),l!=="hex"&&l!=="hex6"||(u=this.toHexString()),l==="hex3"&&(u=this.toHexString(!0)),l==="hex4"&&(u=this.toHex8String(!0)),l==="hex8"&&(u=this.toHex8String()),l==="name"&&(u=this.toName()),l==="hsl"&&(u=this.toHslString()),l==="hsv"&&(u=this.toHsvString()),u||this.toHexString()):l==="name"&&this._a===0?this.toName():this.toRgbString()},clone:function(){return s(this.toString())},_applyModification:function(l,h){var u=l.apply(null,[this].concat([].slice.call(h)));return this._r=u._r,this._g=u._g,this._b=u._b,this.setAlpha(u._a),this},lighten:function(){return this._applyModification(I,arguments)},brighten:function(){return this._applyModification(J,arguments)},darken:function(){return this._applyModification(O,arguments)},desaturate:function(){return this._applyModification(m,arguments)},saturate:function(){return this._applyModification(y,arguments)},greyscale:function(){return this._applyModification(F,arguments)},spin:function(){return this._applyModification(L,arguments)},_applyCombination:function(l,h){return l.apply(null,[this].concat([].slice.call(h)))},analogous:function(){return this._applyCombination(D,arguments)},complement:function(){return this._applyCombination(M,arguments)},monochromatic:function(){return this._applyCombination(R,arguments)},splitcomplement:function(){return this._applyCombination(j,arguments)},triad:function(){return this._applyCombination(A,arguments)},tetrad:function(){return this._applyCombination(g,arguments)}},s.fromRatio=function(l,h){if(typeof l=="object"){var u={};for(var x in l)l.hasOwnProperty(x)&&(u[x]=x==="a"?l[x]:Z(l[x]));l=u}return s(l,h)},s.equals=function(l,h){return!(!l||!h)&&s(l).toRgbString()==s(h).toRgbString()},s.random=function(){return s.fromRatio({r:ot(),g:ot(),b:ot()})},s.mix=function(l,h,u){u=u===0?0:u||50;var x=s(l).toRgb(),S=s(h).toRgb(),C=u/100;return s({r:(S.r-x.r)*C+x.r,g:(S.g-x.g)*C+x.g,b:(S.b-x.b)*C+x.b,a:(S.a-x.a)*C+x.a})},s.readability=function(l,h){var u=s(l),x=s(h);return(i.max(u.getLuminance(),x.getLuminance())+.05)/(i.min(u.getLuminance(),x.getLuminance())+.05)},s.isReadable=function(l,h,u){var x,S,C=s.readability(l,h);switch(S=!1,x=q(u),x.level+x.size){case"AAsmall":case"AAAlarge":S=C>=4.5;break;case"AAlarge":S=C>=3;break;case"AAAsmall":S=C>=7}return S},s.mostReadable=function(l,h,u){var x,S,C,H,G=null,X=0;u=u||{},S=u.includeFallbackColors,C=u.level,H=u.size;for(var lt=0;lt<h.length;lt++)(x=s.readability(l,h[lt]))>X&&(X=x,G=s(h[lt]));return s.isReadable(l,G,{level:C,size:H})||!S?G:(u.includeFallbackColors=!1,s.mostReadable(l,["#fff","#000"],u))};var st=s.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},pt=s.hexNames=function(l){var h={};for(var u in l)l.hasOwnProperty(u)&&(h[l[u]]=u);return h}(st),at=function(){var l="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",h="[\\s|\\(]+("+l+")[,|\\s]+("+l+")[,|\\s]+("+l+")\\s*\\)?",u="[\\s|\\(]+("+l+")[,|\\s]+("+l+")[,|\\s]+("+l+")[,|\\s]+("+l+")\\s*\\)?";return{CSS_UNIT:new RegExp(l),rgb:new RegExp("rgb"+h),rgba:new RegExp("rgba"+u),hsl:new RegExp("hsl"+h),hsla:new RegExp("hsla"+u),hsv:new RegExp("hsv"+h),hsva:new RegExp("hsva"+u),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();o!==void 0&&o.exports?o.exports=s:(r=function(){return s}.call(a,e,a,o))!==void 0&&(o.exports=r)})(Math)},function(o,a,e){var r=e(67);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("0f73e73c",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-editable-input {
  position: relative;
}
.vc-input__input {
  padding: 0;
  border: 0;
  outline: none;
}
.vc-input__label {
  text-transform: capitalize;
}
`,""])},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{staticClass:"vc-editable-input"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.val,expression:"val"}],ref:"input",staticClass:"vc-input__input",attrs:{"aria-labelledby":t.labelId},domProps:{value:t.val},on:{keydown:t.handleKeyDown,input:[function(c){c.target.composing||(t.val=c.target.value)},t.update]}}),t._v(" "),n("span",{staticClass:"vc-input__label",attrs:{for:t.label,id:t.labelId}},[t._v(t._s(t.labelSpanText))]),t._v(" "),n("span",{staticClass:"vc-input__desc"},[t._v(t._s(t.desc))])])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{staticClass:"vc-compact",attrs:{role:"application","aria-label":"Compact color picker"}},[n("ul",{staticClass:"vc-compact-colors",attrs:{role:"listbox"}},t._l(t.paletteUpperCase(t.palette),function(c){return n("li",{key:c,staticClass:"vc-compact-color-item",class:{"vc-compact-color-item--white":c==="#FFFFFF"},style:{background:c},attrs:{role:"option","aria-label":"color:"+c,"aria-selected":c===t.pick},on:{click:function(p){return t.handlerClick(c)}}},[n("div",{directives:[{name:"show",rawName:"v-show",value:c===t.pick,expression:"c === pick"}],staticClass:"vc-compact-dot"})])}),0)])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){function r(d){e(71)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(37),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(73),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/Grayscale.vue",a.default=p.exports},function(o,a,e){var r=e(72);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("21ddbb74",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-grayscale {
  width: 125px;
  border-radius: 2px;
  box-shadow: 0 2px 15px rgba(0,0,0,.12), 0 2px 10px rgba(0,0,0,.16);
  background-color: #fff;
}
.vc-grayscale-colors {
  border-radius: 2px;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.vc-grayscale-color-item {
  list-style: none;
  width: 25px;
  height: 25px;
  float: left;
  position: relative;
  cursor: pointer;
}
.vc-grayscale-color-item--white .vc-grayscale-dot {
  background: #000;
}
.vc-grayscale-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -2px;
  border-radius: 50%;
  opacity: 1;
  background: #fff;
}
`,""])},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{staticClass:"vc-grayscale",attrs:{role:"application","aria-label":"Grayscale color picker"}},[n("ul",{staticClass:"vc-grayscale-colors",attrs:{role:"listbox"}},t._l(t.paletteUpperCase(t.palette),function(c){return n("li",{key:c,staticClass:"vc-grayscale-color-item",class:{"vc-grayscale-color-item--white":c=="#FFFFFF"},style:{background:c},attrs:{role:"option","aria-label":"Color:"+c,"aria-selected":c===t.pick},on:{click:function(p){return t.handlerClick(c)}}},[n("div",{directives:[{name:"show",rawName:"v-show",value:c===t.pick,expression:"c === pick"}],staticClass:"vc-grayscale-dot"})])}),0)])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){function r(d){e(75)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(38),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(77),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/Material.vue",a.default=p.exports},function(o,a,e){var r=e(76);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("1ff3af73",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-material {
  width: 98px;
  height: 98px;
  padding: 16px;
  font-family: "Roboto";
  position: relative;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
  background-color: #fff;
}
.vc-material .vc-input__input {
  width: 100%;
  margin-top: 12px;
  font-size: 15px;
  color: #333;
  height: 30px;
}
.vc-material .vc-input__label {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 11px;
  color: #999;
  text-transform: capitalize;
}
.vc-material-hex {
  border-bottom-width: 2px;
  border-bottom-style: solid;
}
.vc-material-split {
  display: flex;
  margin-right: -10px;
  padding-top: 11px;
}
.vc-material-third {
  flex: 1;
  padding-right: 10px;
}
`,""])},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{staticClass:"vc-material",attrs:{role:"application","aria-label":"Material color picker"}},[n("ed-in",{staticClass:"vc-material-hex",style:{borderColor:t.colors.hex},attrs:{label:"hex"},on:{change:t.onChange},model:{value:t.colors.hex,callback:function(c){t.$set(t.colors,"hex",c)},expression:"colors.hex"}}),t._v(" "),n("div",{staticClass:"vc-material-split"},[n("div",{staticClass:"vc-material-third"},[n("ed-in",{attrs:{label:"r"},on:{change:t.onChange},model:{value:t.colors.rgba.r,callback:function(c){t.$set(t.colors.rgba,"r",c)},expression:"colors.rgba.r"}})],1),t._v(" "),n("div",{staticClass:"vc-material-third"},[n("ed-in",{attrs:{label:"g"},on:{change:t.onChange},model:{value:t.colors.rgba.g,callback:function(c){t.$set(t.colors.rgba,"g",c)},expression:"colors.rgba.g"}})],1),t._v(" "),n("div",{staticClass:"vc-material-third"},[n("ed-in",{attrs:{label:"b"},on:{change:t.onChange},model:{value:t.colors.rgba.b,callback:function(c){t.$set(t.colors.rgba,"b",c)},expression:"colors.rgba.b"}})],1)])],1)},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){function r(d){e(79)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(39),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(114),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/Slider.vue",a.default=p.exports},function(o,a,e){var r=e(80);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("7982aa43",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-slider {
  position: relative;
  width: 410px;
}
.vc-slider-hue-warp {
  height: 12px;
  position: relative;
}
.vc-slider-hue-warp .vc-hue-picker {
  width: 14px;
  height: 14px;
  border-radius: 6px;
  transform: translate(-7px, -2px);
  background-color: rgb(248, 248, 248);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
.vc-slider-swatches {
  display: flex;
  margin-top: 20px;
}
.vc-slider-swatch {
  margin-right: 1px;
  flex: 1;
  width: 20%;
}
.vc-slider-swatch:first-child {
  margin-right: 1px;
}
.vc-slider-swatch:first-child .vc-slider-swatch-picker {
  border-radius: 2px 0px 0px 2px;
}
.vc-slider-swatch:last-child {
  margin-right: 0;
}
.vc-slider-swatch:last-child .vc-slider-swatch-picker {
  border-radius: 0px 2px 2px 0px;
}
.vc-slider-swatch-picker {
  cursor: pointer;
  height: 12px;
}
.vc-slider-swatch:nth-child(n) .vc-slider-swatch-picker.vc-slider-swatch-picker--active {
  transform: scaleY(1.8);
  border-radius: 3.6px/2px;
}
.vc-slider-swatch-picker--white {
  box-shadow: inset 0 0 0 1px #ddd;
}
.vc-slider-swatch-picker--active.vc-slider-swatch-picker--white {
  box-shadow: inset 0 0 0 0.6px #ddd;
}
`,""])},function(o,a,e){function r(c){return c&&c.__esModule?c:{default:c}}a.__esModule=!0;var i=e(82),s=r(i),t=e(100),f=r(t),n=typeof f.default=="function"&&typeof s.default=="symbol"?function(c){return typeof c}:function(c){return c&&typeof f.default=="function"&&c.constructor===f.default&&c!==f.default.prototype?"symbol":typeof c};a.default=typeof f.default=="function"&&n(s.default)==="symbol"?function(c){return c===void 0?"undefined":n(c)}:function(c){return c&&typeof f.default=="function"&&c.constructor===f.default&&c!==f.default.prototype?"symbol":c===void 0?"undefined":n(c)}},function(o,a,e){o.exports={default:e(83),__esModule:!0}},function(o,a,e){e(84),e(96),o.exports=e(32).f("iterator")},function(o,a,e){var r=e(85)(!0);e(40)(String,"String",function(i){this._t=String(i),this._i=0},function(){var i,s=this._t,t=this._i;return t>=s.length?{value:void 0,done:!0}:(i=r(s,t),this._i+=i.length,{value:i,done:!1})})},function(o,a,e){var r=e(23),i=e(24);o.exports=function(s){return function(t,f){var n,c,p=String(i(t)),d=r(f),b=p.length;return d<0||d>=b?s?"":void 0:(n=p.charCodeAt(d),n<55296||n>56319||d+1===b||(c=p.charCodeAt(d+1))<56320||c>57343?s?p.charAt(d):n:s?p.slice(d,d+2):c-56320+(n-55296<<10)+65536)}}},function(o,a,e){var r=e(87);o.exports=function(i,s,t){if(r(i),s===void 0)return i;switch(t){case 1:return function(f){return i.call(s,f)};case 2:return function(f,n){return i.call(s,f,n)};case 3:return function(f,n,c){return i.call(s,f,n,c)}}return function(){return i.apply(s,arguments)}}},function(o,a){o.exports=function(e){if(typeof e!="function")throw TypeError(e+" is not a function!");return e}},function(o,a,e){var r=e(45),i=e(18),s=e(31),t={};e(7)(t,e(11)("iterator"),function(){return this}),o.exports=function(f,n,c){f.prototype=r(t,{next:i(1,c)}),s(f,n+" Iterator")}},function(o,a,e){var r=e(8),i=e(16),s=e(27);o.exports=e(9)?Object.defineProperties:function(t,f){i(t);for(var n,c=s(f),p=c.length,d=0;p>d;)r.f(t,n=c[d++],f[n]);return t}},function(o,a,e){var r=e(47);o.exports=Object("z").propertyIsEnumerable(0)?Object:function(i){return r(i)=="String"?i.split(""):Object(i)}},function(o,a,e){var r=e(10),i=e(92),s=e(93);o.exports=function(t){return function(f,n,c){var p,d=r(f),b=i(d.length),w=s(c,b);if(t&&n!=n){for(;b>w;)if((p=d[w++])!=p)return!0}else for(;b>w;w++)if((t||w in d)&&d[w]===n)return t||w||0;return!t&&-1}}},function(o,a,e){var r=e(23),i=Math.min;o.exports=function(s){return s>0?i(r(s),9007199254740991):0}},function(o,a,e){var r=e(23),i=Math.max,s=Math.min;o.exports=function(t,f){return t=r(t),t<0?i(t+f,0):s(t,f)}},function(o,a,e){var r=e(4).document;o.exports=r&&r.documentElement},function(o,a,e){var r=e(6),i=e(48),s=e(28)("IE_PROTO"),t=Object.prototype;o.exports=Object.getPrototypeOf||function(f){return f=i(f),r(f,s)?f[s]:typeof f.constructor=="function"&&f instanceof f.constructor?f.constructor.prototype:f instanceof Object?t:null}},function(o,a,e){e(97);for(var r=e(4),i=e(7),s=e(26),t=e(11)("toStringTag"),f="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),n=0;n<f.length;n++){var c=f[n],p=r[c],d=p&&p.prototype;d&&!d[t]&&i(d,t,c),s[c]=s.Array}},function(o,a,e){var r=e(98),i=e(99),s=e(26),t=e(10);o.exports=e(40)(Array,"Array",function(f,n){this._t=t(f),this._i=0,this._k=n},function(){var f=this._t,n=this._k,c=this._i++;return!f||c>=f.length?(this._t=void 0,i(1)):n=="keys"?i(0,c):n=="values"?i(0,f[c]):i(0,[c,f[c]])},"values"),s.Arguments=s.Array,r("keys"),r("values"),r("entries")},function(o,a){o.exports=function(){}},function(o,a){o.exports=function(e,r){return{value:r,done:!!e}}},function(o,a,e){o.exports={default:e(101),__esModule:!0}},function(o,a,e){e(102),e(108),e(109),e(110),o.exports=e(15).Symbol},function(o,a,e){var r=e(4),i=e(6),s=e(9),t=e(41),f=e(44),n=e(103).KEY,c=e(17),p=e(29),d=e(31),b=e(19),w=e(11),v=e(32),m=e(33),y=e(104),F=e(105),I=e(16),J=e(12),O=e(48),L=e(10),M=e(25),A=e(18),g=e(45),j=e(106),D=e(107),R=e(49),U=e(8),P=e(27),Y=D.f,$=U.f,ct=j.f,V=r.Symbol,K=r.JSON,Z=K&&K.stringify,W=w("_hidden"),ut=w("toPrimitive"),rt={}.propertyIsEnumerable,it=p("symbol-registry"),q=p("symbols"),nt=p("op-symbols"),Q=Object.prototype,ft=typeof V=="function"&&!!R.f,E=r.QObject,tt=!E||!E.prototype||!E.prototype.findChild,T=s&&c(function(){return g($({},"a",{get:function(){return $(this,"a",{value:7}).a}})).a!=7})?function(_,k,z){var et=Y(Q,k);et&&delete Q[k],$(_,k,z),et&&_!==Q&&$(Q,k,et)}:$,ot=function(_){var k=q[_]=g(V.prototype);return k._k=_,k},st=ft&&typeof V.iterator=="symbol"?function(_){return typeof _=="symbol"}:function(_){return _ instanceof V},pt=function(_,k,z){return _===Q&&pt(nt,k,z),I(_),k=M(k,!0),I(z),i(q,k)?(z.enumerable?(i(_,W)&&_[W][k]&&(_[W][k]=!1),z=g(z,{enumerable:A(0,!1)})):(i(_,W)||$(_,W,A(1,{})),_[W][k]=!0),T(_,k,z)):$(_,k,z)},at=function(_,k){I(_);for(var z,et=y(k=L(k)),dt=0,ht=et.length;ht>dt;)pt(_,z=et[dt++],k[z]);return _},l=function(_,k){return k===void 0?g(_):at(g(_),k)},h=function(_){var k=rt.call(this,_=M(_,!0));return!(this===Q&&i(q,_)&&!i(nt,_))&&(!(k||!i(this,_)||!i(q,_)||i(this,W)&&this[W][_])||k)},u=function(_,k){if(_=L(_),k=M(k,!0),_!==Q||!i(q,k)||i(nt,k)){var z=Y(_,k);return!z||!i(q,k)||i(_,W)&&_[W][k]||(z.enumerable=!0),z}},x=function(_){for(var k,z=ct(L(_)),et=[],dt=0;z.length>dt;)i(q,k=z[dt++])||k==W||k==n||et.push(k);return et},S=function(_){for(var k,z=_===Q,et=ct(z?nt:L(_)),dt=[],ht=0;et.length>ht;)!i(q,k=et[ht++])||z&&!i(Q,k)||dt.push(q[k]);return dt};ft||(V=function(){if(this instanceof V)throw TypeError("Symbol is not a constructor!");var _=b(arguments.length>0?arguments[0]:void 0),k=function(z){this===Q&&k.call(nt,z),i(this,W)&&i(this[W],_)&&(this[W][_]=!1),T(this,_,A(1,z))};return s&&tt&&T(Q,_,{configurable:!0,set:k}),ot(_)},f(V.prototype,"toString",function(){return this._k}),D.f=u,U.f=pt,e(50).f=j.f=x,e(34).f=h,R.f=S,s&&!e(14)&&f(Q,"propertyIsEnumerable",h,!0),v.f=function(_){return ot(w(_))}),t(t.G+t.W+t.F*!ft,{Symbol:V});for(var C="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),H=0;C.length>H;)w(C[H++]);for(var G=P(w.store),X=0;G.length>X;)m(G[X++]);t(t.S+t.F*!ft,"Symbol",{for:function(_){return i(it,_+="")?it[_]:it[_]=V(_)},keyFor:function(_){if(!st(_))throw TypeError(_+" is not a symbol!");for(var k in it)if(it[k]===_)return k},useSetter:function(){tt=!0},useSimple:function(){tt=!1}}),t(t.S+t.F*!ft,"Object",{create:l,defineProperty:pt,defineProperties:at,getOwnPropertyDescriptor:u,getOwnPropertyNames:x,getOwnPropertySymbols:S});var lt=c(function(){R.f(1)});t(t.S+t.F*lt,"Object",{getOwnPropertySymbols:function(_){return R.f(O(_))}}),K&&t(t.S+t.F*(!ft||c(function(){var _=V();return Z([_])!="[null]"||Z({a:_})!="{}"||Z(Object(_))!="{}"})),"JSON",{stringify:function(_){for(var k,z,et=[_],dt=1;arguments.length>dt;)et.push(arguments[dt++]);if(z=k=et[1],(J(k)||_!==void 0)&&!st(_))return F(k)||(k=function(ht,vt){if(typeof z=="function"&&(vt=z.call(this,ht,vt)),!st(vt))return vt}),et[1]=k,Z.apply(K,et)}}),V.prototype[ut]||e(7)(V.prototype,ut,V.prototype.valueOf),d(V,"Symbol"),d(Math,"Math",!0),d(r.JSON,"JSON",!0)},function(o,a,e){var r=e(19)("meta"),i=e(12),s=e(6),t=e(8).f,f=0,n=Object.isExtensible||function(){return!0},c=!e(17)(function(){return n(Object.preventExtensions({}))}),p=function(m){t(m,r,{value:{i:"O"+ ++f,w:{}}})},d=function(m,y){if(!i(m))return typeof m=="symbol"?m:(typeof m=="string"?"S":"P")+m;if(!s(m,r)){if(!n(m))return"F";if(!y)return"E";p(m)}return m[r].i},b=function(m,y){if(!s(m,r)){if(!n(m))return!0;if(!y)return!1;p(m)}return m[r].w},w=function(m){return c&&v.NEED&&n(m)&&!s(m,r)&&p(m),m},v=o.exports={KEY:r,NEED:!1,fastKey:d,getWeak:b,onFreeze:w}},function(o,a,e){var r=e(27),i=e(49),s=e(34);o.exports=function(t){var f=r(t),n=i.f;if(n)for(var c,p=n(t),d=s.f,b=0;p.length>b;)d.call(t,c=p[b++])&&f.push(c);return f}},function(o,a,e){var r=e(47);o.exports=Array.isArray||function(i){return r(i)=="Array"}},function(o,a,e){var r=e(10),i=e(50).f,s={}.toString,t=typeof window=="object"&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],f=function(n){try{return i(n)}catch{return t.slice()}};o.exports.f=function(n){return t&&s.call(n)=="[object Window]"?f(n):i(r(n))}},function(o,a,e){var r=e(34),i=e(18),s=e(10),t=e(25),f=e(6),n=e(42),c=Object.getOwnPropertyDescriptor;a.f=e(9)?c:function(p,d){if(p=s(p),d=t(d,!0),n)try{return c(p,d)}catch{}if(f(p,d))return i(!r.f.call(p,d),p[d])}},function(o,a){},function(o,a,e){e(33)("asyncIterator")},function(o,a,e){e(33)("observable")},function(o,a,e){var r=e(112);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("7c5f1a1c",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-hue {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 2px;
}
.vc-hue--horizontal {
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.vc-hue--vertical {
  background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
}
.vc-hue-container {
  cursor: pointer;
  margin: 0 2px;
  position: relative;
  height: 100%;
}
.vc-hue-pointer {
  z-index: 2;
  position: absolute;
}
.vc-hue-picker {
  cursor: pointer;
  margin-top: 1px;
  width: 4px;
  border-radius: 1px;
  height: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .6);
  background: #fff;
  transform: translateX(-2px) ;
}
`,""])},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{class:["vc-hue",t.directionClass]},[n("div",{ref:"container",staticClass:"vc-hue-container",attrs:{role:"slider","aria-valuenow":t.colors.hsl.h,"aria-valuemin":"0","aria-valuemax":"360"},on:{mousedown:t.handleMouseDown,touchmove:t.handleChange,touchstart:t.handleChange}},[n("div",{staticClass:"vc-hue-pointer",style:{top:t.pointerTop,left:t.pointerLeft},attrs:{role:"presentation"}},[n("div",{staticClass:"vc-hue-picker"})])])])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{staticClass:"vc-slider",attrs:{role:"application","aria-label":"Slider color picker"}},[n("div",{staticClass:"vc-slider-hue-warp"},[n("hue",{on:{change:t.hueChange},model:{value:t.colors,callback:function(c){t.colors=c},expression:"colors"}})],1),t._v(" "),n("div",{staticClass:"vc-slider-swatches",attrs:{role:"group"}},t._l(t.normalizedSwatches,function(c,p){return n("div",{key:p,staticClass:"vc-slider-swatch",attrs:{"data-index":p,"aria-label":"color:"+t.colors.hex,role:"button"},on:{click:function(d){return t.handleSwClick(p,c)}}},[n("div",{staticClass:"vc-slider-swatch-picker",class:{"vc-slider-swatch-picker--active":t.isActive(c,p),"vc-slider-swatch-picker--white":c.l===1},style:{background:"hsl("+t.colors.hsl.h+", "+100*c.s+"%, "+100*c.l+"%)"}})])}),0)])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){function r(d){e(116)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(52),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(119),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/Swatches.vue",a.default=p.exports},function(o,a,e){var r=e(117);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("10f839a2",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-swatches {
  width: 320px;
  height: 240px;
  overflow-y: scroll;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
}
.vc-swatches-box {
  padding: 16px 0 6px 16px;
  overflow: hidden;
}
.vc-swatches-color-group {
  padding-bottom: 10px;
  width: 40px;
  float: left;
  margin-right: 10px;
}
.vc-swatches-color-it {
  box-sizing: border-box;
  width: 40px;
  height: 24px;
  cursor: pointer;
  background: #880e4f;
  margin-bottom: 1px;
  overflow: hidden;
  -ms-border-radius: 2px 2px 0 0;
  -moz-border-radius: 2px 2px 0 0;
  -o-border-radius: 2px 2px 0 0;
  -webkit-border-radius: 2px 2px 0 0;
  border-radius: 2px 2px 0 0;
}
.vc-swatches-color--white {
  border: 1px solid #DDD;
}
.vc-swatches-pick {
  fill: rgb(255, 255, 255);
  margin-left: 8px;
  display: block;
}
.vc-swatches-color--white .vc-swatches-pick {
  fill: rgb(51, 51, 51);
}
`,""])},function(o,a,e){Object.defineProperty(a,"__esModule",{value:!0}),e.d(a,"red",function(){return r}),e.d(a,"pink",function(){return i}),e.d(a,"purple",function(){return s}),e.d(a,"deepPurple",function(){return t}),e.d(a,"indigo",function(){return f}),e.d(a,"blue",function(){return n}),e.d(a,"lightBlue",function(){return c}),e.d(a,"cyan",function(){return p}),e.d(a,"teal",function(){return d}),e.d(a,"green",function(){return b}),e.d(a,"lightGreen",function(){return w}),e.d(a,"lime",function(){return v}),e.d(a,"yellow",function(){return m}),e.d(a,"amber",function(){return y}),e.d(a,"orange",function(){return F}),e.d(a,"deepOrange",function(){return I}),e.d(a,"brown",function(){return J}),e.d(a,"grey",function(){return O}),e.d(a,"blueGrey",function(){return L}),e.d(a,"darkText",function(){return M}),e.d(a,"lightText",function(){return A}),e.d(a,"darkIcons",function(){return g}),e.d(a,"lightIcons",function(){return j}),e.d(a,"white",function(){return D}),e.d(a,"black",function(){return R});var r={50:"#ffebee",100:"#ffcdd2",200:"#ef9a9a",300:"#e57373",400:"#ef5350",500:"#f44336",600:"#e53935",700:"#d32f2f",800:"#c62828",900:"#b71c1c",a100:"#ff8a80",a200:"#ff5252",a400:"#ff1744",a700:"#d50000"},i={50:"#fce4ec",100:"#f8bbd0",200:"#f48fb1",300:"#f06292",400:"#ec407a",500:"#e91e63",600:"#d81b60",700:"#c2185b",800:"#ad1457",900:"#880e4f",a100:"#ff80ab",a200:"#ff4081",a400:"#f50057",a700:"#c51162"},s={50:"#f3e5f5",100:"#e1bee7",200:"#ce93d8",300:"#ba68c8",400:"#ab47bc",500:"#9c27b0",600:"#8e24aa",700:"#7b1fa2",800:"#6a1b9a",900:"#4a148c",a100:"#ea80fc",a200:"#e040fb",a400:"#d500f9",a700:"#aa00ff"},t={50:"#ede7f6",100:"#d1c4e9",200:"#b39ddb",300:"#9575cd",400:"#7e57c2",500:"#673ab7",600:"#5e35b1",700:"#512da8",800:"#4527a0",900:"#311b92",a100:"#b388ff",a200:"#7c4dff",a400:"#651fff",a700:"#6200ea"},f={50:"#e8eaf6",100:"#c5cae9",200:"#9fa8da",300:"#7986cb",400:"#5c6bc0",500:"#3f51b5",600:"#3949ab",700:"#303f9f",800:"#283593",900:"#1a237e",a100:"#8c9eff",a200:"#536dfe",a400:"#3d5afe",a700:"#304ffe"},n={50:"#e3f2fd",100:"#bbdefb",200:"#90caf9",300:"#64b5f6",400:"#42a5f5",500:"#2196f3",600:"#1e88e5",700:"#1976d2",800:"#1565c0",900:"#0d47a1",a100:"#82b1ff",a200:"#448aff",a400:"#2979ff",a700:"#2962ff"},c={50:"#e1f5fe",100:"#b3e5fc",200:"#81d4fa",300:"#4fc3f7",400:"#29b6f6",500:"#03a9f4",600:"#039be5",700:"#0288d1",800:"#0277bd",900:"#01579b",a100:"#80d8ff",a200:"#40c4ff",a400:"#00b0ff",a700:"#0091ea"},p={50:"#e0f7fa",100:"#b2ebf2",200:"#80deea",300:"#4dd0e1",400:"#26c6da",500:"#00bcd4",600:"#00acc1",700:"#0097a7",800:"#00838f",900:"#006064",a100:"#84ffff",a200:"#18ffff",a400:"#00e5ff",a700:"#00b8d4"},d={50:"#e0f2f1",100:"#b2dfdb",200:"#80cbc4",300:"#4db6ac",400:"#26a69a",500:"#009688",600:"#00897b",700:"#00796b",800:"#00695c",900:"#004d40",a100:"#a7ffeb",a200:"#64ffda",a400:"#1de9b6",a700:"#00bfa5"},b={50:"#e8f5e9",100:"#c8e6c9",200:"#a5d6a7",300:"#81c784",400:"#66bb6a",500:"#4caf50",600:"#43a047",700:"#388e3c",800:"#2e7d32",900:"#1b5e20",a100:"#b9f6ca",a200:"#69f0ae",a400:"#00e676",a700:"#00c853"},w={50:"#f1f8e9",100:"#dcedc8",200:"#c5e1a5",300:"#aed581",400:"#9ccc65",500:"#8bc34a",600:"#7cb342",700:"#689f38",800:"#558b2f",900:"#33691e",a100:"#ccff90",a200:"#b2ff59",a400:"#76ff03",a700:"#64dd17"},v={50:"#f9fbe7",100:"#f0f4c3",200:"#e6ee9c",300:"#dce775",400:"#d4e157",500:"#cddc39",600:"#c0ca33",700:"#afb42b",800:"#9e9d24",900:"#827717",a100:"#f4ff81",a200:"#eeff41",a400:"#c6ff00",a700:"#aeea00"},m={50:"#fffde7",100:"#fff9c4",200:"#fff59d",300:"#fff176",400:"#ffee58",500:"#ffeb3b",600:"#fdd835",700:"#fbc02d",800:"#f9a825",900:"#f57f17",a100:"#ffff8d",a200:"#ffff00",a400:"#ffea00",a700:"#ffd600"},y={50:"#fff8e1",100:"#ffecb3",200:"#ffe082",300:"#ffd54f",400:"#ffca28",500:"#ffc107",600:"#ffb300",700:"#ffa000",800:"#ff8f00",900:"#ff6f00",a100:"#ffe57f",a200:"#ffd740",a400:"#ffc400",a700:"#ffab00"},F={50:"#fff3e0",100:"#ffe0b2",200:"#ffcc80",300:"#ffb74d",400:"#ffa726",500:"#ff9800",600:"#fb8c00",700:"#f57c00",800:"#ef6c00",900:"#e65100",a100:"#ffd180",a200:"#ffab40",a400:"#ff9100",a700:"#ff6d00"},I={50:"#fbe9e7",100:"#ffccbc",200:"#ffab91",300:"#ff8a65",400:"#ff7043",500:"#ff5722",600:"#f4511e",700:"#e64a19",800:"#d84315",900:"#bf360c",a100:"#ff9e80",a200:"#ff6e40",a400:"#ff3d00",a700:"#dd2c00"},J={50:"#efebe9",100:"#d7ccc8",200:"#bcaaa4",300:"#a1887f",400:"#8d6e63",500:"#795548",600:"#6d4c41",700:"#5d4037",800:"#4e342e",900:"#3e2723"},O={50:"#fafafa",100:"#f5f5f5",200:"#eeeeee",300:"#e0e0e0",400:"#bdbdbd",500:"#9e9e9e",600:"#757575",700:"#616161",800:"#424242",900:"#212121"},L={50:"#eceff1",100:"#cfd8dc",200:"#b0bec5",300:"#90a4ae",400:"#78909c",500:"#607d8b",600:"#546e7a",700:"#455a64",800:"#37474f",900:"#263238"},M={primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.54)",disabled:"rgba(0, 0, 0, 0.38)",dividers:"rgba(0, 0, 0, 0.12)"},A={primary:"rgba(255, 255, 255, 1)",secondary:"rgba(255, 255, 255, 0.7)",disabled:"rgba(255, 255, 255, 0.5)",dividers:"rgba(255, 255, 255, 0.12)"},g={active:"rgba(0, 0, 0, 0.54)",inactive:"rgba(0, 0, 0, 0.38)"},j={active:"rgba(255, 255, 255, 1)",inactive:"rgba(255, 255, 255, 0.5)"},D="#ffffff",R="#000000";a.default={red:r,pink:i,purple:s,deepPurple:t,indigo:f,blue:n,lightBlue:c,cyan:p,teal:d,green:b,lightGreen:w,lime:v,yellow:m,amber:y,orange:F,deepOrange:I,brown:J,grey:O,blueGrey:L,darkText:M,lightText:A,darkIcons:g,lightIcons:j,white:D,black:R}},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{staticClass:"vc-swatches",attrs:{role:"application","aria-label":"Swatches color picker","data-pick":t.pick}},[n("div",{staticClass:"vc-swatches-box",attrs:{role:"listbox"}},t._l(t.palette,function(c,p){return n("div",{key:p,staticClass:"vc-swatches-color-group"},t._l(c,function(d){return n("div",{key:d,class:["vc-swatches-color-it",{"vc-swatches-color--white":d==="#FFFFFF"}],style:{background:d},attrs:{role:"option","aria-label":"Color:"+d,"aria-selected":t.equal(d),"data-color":d},on:{click:function(b){return t.handlerClick(d)}}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.equal(d),expression:"equal(c)"}],staticClass:"vc-swatches-pick"},[n("svg",{staticStyle:{width:"24px",height:"24px"},attrs:{viewBox:"0 0 24 24"}},[n("path",{attrs:{d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}})])])])}),0)}),0)])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){function r(d){e(121)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(53),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(134),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/Photoshop.vue",a.default=p.exports},function(o,a,e){var r=e(122);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("080365d4",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-photoshop {
  background: #DCDCDC;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15);
  box-sizing: initial;
  width: 513px;
  font-family: Roboto;
}
.vc-photoshop__disable-fields {
  width: 390px;
}
.vc-ps-head {
  background-image: linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%);
  border-bottom: 1px solid #B1B1B1;
  box-shadow: inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02);
  height: 23px;
  line-height: 24px;
  border-radius: 4px 4px 0 0;
  font-size: 13px;
  color: #4D4D4D;
  text-align: center;
}
.vc-ps-body {
  padding: 15px;
  display: flex;
}
.vc-ps-saturation-wrap {
  width: 256px;
  height: 256px;
  position: relative;
  border: 2px solid #B3B3B3;
  border-bottom: 2px solid #F0F0F0;
  overflow: hidden;
}
.vc-ps-saturation-wrap .vc-saturation-circle {
  width: 12px;
  height: 12px;
}
.vc-ps-hue-wrap {
  position: relative;
  height: 256px;
  width: 19px;
  margin-left: 10px;
  border: 2px solid #B3B3B3;
  border-bottom: 2px solid #F0F0F0;
}
.vc-ps-hue-pointer {
  position: relative;
}
.vc-ps-hue-pointer--left,
.vc-ps-hue-pointer--right {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 0 5px 8px;
  border-color: transparent transparent transparent #555;
}
.vc-ps-hue-pointer--left:after,
.vc-ps-hue-pointer--right:after {
  content: "";
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 6px;
  border-color: transparent transparent transparent #fff;
  position: absolute;
  top: 1px;
  left: 1px;
  transform: translate(-8px, -5px);
}
.vc-ps-hue-pointer--left {
  transform: translate(-13px, -4px);
}
.vc-ps-hue-pointer--right {
  transform: translate(20px, -4px) rotate(180deg);
}
.vc-ps-controls {
  width: 180px;
  margin-left: 10px;
  display: flex;
}
.vc-ps-controls__disable-fields {
  width: auto;
}
.vc-ps-actions {
  margin-left: 20px;
  flex: 1;
}
.vc-ps-ac-btn {
  cursor: pointer;
  background-image: linear-gradient(-180deg, #FFFFFF 0%, #E6E6E6 100%);
  border: 1px solid #878787;
  border-radius: 2px;
  height: 20px;
  box-shadow: 0 1px 0 0 #EAEAEA;
  font-size: 14px;
  color: #000;
  line-height: 20px;
  text-align: center;
  margin-bottom: 10px;
}
.vc-ps-previews {
  width: 60px;
}
.vc-ps-previews__swatches {
  border: 1px solid #B3B3B3;
  border-bottom: 1px solid #F0F0F0;
  margin-bottom: 2px;
  margin-top: 1px;
}
.vc-ps-previews__pr-color {
  height: 34px;
  box-shadow: inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000;
}
.vc-ps-previews__label {
  font-size: 14px;
  color: #000;
  text-align: center;
}
.vc-ps-fields {
  padding-top: 5px;
  padding-bottom: 9px;
  width: 80px;
  position: relative;
}
.vc-ps-fields .vc-input__input {
  margin-left: 40%;
  width: 40%;
  height: 18px;
  border: 1px solid #888888;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC;
  margin-bottom: 5px;
  font-size: 13px;
  padding-left: 3px;
  margin-right: 10px;
}
.vc-ps-fields .vc-input__label, .vc-ps-fields .vc-input__desc {
  top: 0;
  text-transform: uppercase;
  font-size: 13px;
  height: 18px;
  line-height: 22px;
  position: absolute;
}
.vc-ps-fields .vc-input__label {
  left: 0;
  width: 34px;
}
.vc-ps-fields .vc-input__desc {
  right: 0;
  width: 0;
}
.vc-ps-fields__divider {
  height: 5px;
}
.vc-ps-fields__hex .vc-input__input {
  margin-left: 20%;
  width: 80%;
  height: 18px;
  border: 1px solid #888888;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC;
  margin-bottom: 6px;
  font-size: 13px;
  padding-left: 3px;
}
.vc-ps-fields__hex .vc-input__label {
  position: absolute;
  top: 0;
  left: 0;
  width: 14px;
  text-transform: uppercase;
  font-size: 13px;
  height: 18px;
  line-height: 22px;
}
`,""])},function(o,a,e){var r=e(124);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("b5380e52",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-saturation,
.vc-saturation--white,
.vc-saturation--black {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.vc-saturation--white {
  background: linear-gradient(to right, #fff, rgba(255,255,255,0));
}
.vc-saturation--black {
  background: linear-gradient(to top, #000, rgba(0,0,0,0));
}
.vc-saturation-pointer {
  cursor: pointer;
  position: absolute;
}
.vc-saturation-circle {
  cursor: head;
  width: 4px;
  height: 4px;
  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4);
  border-radius: 50%;
  transform: translate(-2px, -2px);
}
`,""])},function(o,a){function e(r,i,s){return i<s?r<i?i:r>s?s:r:r<s?s:r>i?i:r}o.exports=e},function(o,a){function e(g,j,D){function R(T){var ot=W,st=ut;return W=ut=void 0,Q=T,it=g.apply(st,ot)}function U(T){return Q=T,q=setTimeout($,j),ft?R(T):it}function P(T){var ot=T-nt,st=T-Q,pt=j-ot;return E?M(pt,rt-st):pt}function Y(T){var ot=T-nt,st=T-Q;return nt===void 0||ot>=j||ot<0||E&&st>=rt}function $(){var T=A();if(Y(T))return ct(T);q=setTimeout($,P(T))}function ct(T){return q=void 0,tt&&W?R(T):(W=ut=void 0,it)}function V(){q!==void 0&&clearTimeout(q),Q=0,W=nt=ut=q=void 0}function K(){return q===void 0?it:ct(A())}function Z(){var T=A(),ot=Y(T);if(W=arguments,ut=this,nt=T,ot){if(q===void 0)return U(nt);if(E)return q=setTimeout($,j),R(nt)}return q===void 0&&(q=setTimeout($,j)),it}var W,ut,rt,it,q,nt,Q=0,ft=!1,E=!1,tt=!0;if(typeof g!="function")throw new TypeError(n);return j=f(j)||0,i(D)&&(ft=!!D.leading,E="maxWait"in D,rt=E?L(f(D.maxWait)||0,j):rt,tt="trailing"in D?!!D.trailing:tt),Z.cancel=V,Z.flush=K,Z}function r(g,j,D){var R=!0,U=!0;if(typeof g!="function")throw new TypeError(n);return i(D)&&(R="leading"in D?!!D.leading:R,U="trailing"in D?!!D.trailing:U),e(g,j,{leading:R,maxWait:j,trailing:U})}function i(g){var j=typeof g;return!!g&&(j=="object"||j=="function")}function s(g){return!!g&&typeof g=="object"}function t(g){return typeof g=="symbol"||s(g)&&O.call(g)==p}function f(g){if(typeof g=="number")return g;if(t(g))return c;if(i(g)){var j=typeof g.valueOf=="function"?g.valueOf():g;g=i(j)?j+"":j}if(typeof g!="string")return g===0?g:+g;g=g.replace(d,"");var D=w.test(g);return D||v.test(g)?m(g.slice(2),D?2:8):b.test(g)?c:+g}var n="Expected a function",c=NaN,p="[object Symbol]",d=/^\s+|\s+$/g,b=/^[-+]0x[0-9a-f]+$/i,w=/^0b[01]+$/i,v=/^0o[0-7]+$/i,m=parseInt,y=typeof gt=="object"&&gt&&gt.Object===Object&&gt,F=typeof self=="object"&&self&&self.Object===Object&&self,I=y||F||Function("return this")(),J=Object.prototype,O=J.toString,L=Math.max,M=Math.min,A=function(){return I.Date.now()};o.exports=r},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{ref:"container",staticClass:"vc-saturation",style:{background:t.bgColor},on:{mousedown:t.handleMouseDown,touchmove:t.handleChange,touchstart:t.handleChange}},[n("div",{staticClass:"vc-saturation--white"}),t._v(" "),n("div",{staticClass:"vc-saturation--black"}),t._v(" "),n("div",{staticClass:"vc-saturation-pointer",style:{top:t.pointerTop,left:t.pointerLeft}},[n("div",{staticClass:"vc-saturation-circle"})])])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){var r=e(129);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("4dc1b086",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-alpha {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.vc-alpha-checkboard-wrap {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
}
.vc-alpha-gradient {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.vc-alpha-container {
  cursor: pointer;
  position: relative;
  z-index: 2;
  height: 100%;
  margin: 0 3px;
}
.vc-alpha-pointer {
  z-index: 2;
  position: absolute;
}
.vc-alpha-picker {
  cursor: pointer;
  width: 4px;
  border-radius: 1px;
  height: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .6);
  background: #fff;
  margin-top: 1px;
  transform: translateX(-2px);
}
`,""])},function(o,a,e){var r=e(131);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("7e15c05b",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-checkerboard {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-size: contain;
}
`,""])},function(o,a,e){var r=function(){var t=this,f=t.$createElement;return(t._self._c||f)("div",{staticClass:"vc-checkerboard",style:t.bgStyle})},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{staticClass:"vc-alpha"},[n("div",{staticClass:"vc-alpha-checkboard-wrap"},[n("checkboard")],1),t._v(" "),n("div",{staticClass:"vc-alpha-gradient",style:{background:t.gradientColor}}),t._v(" "),n("div",{ref:"container",staticClass:"vc-alpha-container",on:{mousedown:t.handleMouseDown,touchmove:t.handleChange,touchstart:t.handleChange}},[n("div",{staticClass:"vc-alpha-pointer",style:{left:100*t.colors.a+"%"}},[n("div",{staticClass:"vc-alpha-picker"})])])])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{class:["vc-photoshop",t.disableFields?"vc-photoshop__disable-fields":""],attrs:{role:"application","aria-label":"PhotoShop color picker"}},[n("div",{staticClass:"vc-ps-head",attrs:{role:"heading"}},[t._v(t._s(t.head))]),t._v(" "),n("div",{staticClass:"vc-ps-body"},[n("div",{staticClass:"vc-ps-saturation-wrap"},[n("saturation",{on:{change:t.childChange},model:{value:t.colors,callback:function(c){t.colors=c},expression:"colors"}})],1),t._v(" "),n("div",{staticClass:"vc-ps-hue-wrap"},[n("hue",{attrs:{direction:"vertical"},on:{change:t.childChange},model:{value:t.colors,callback:function(c){t.colors=c},expression:"colors"}},[n("div",{staticClass:"vc-ps-hue-pointer"},[n("i",{staticClass:"vc-ps-hue-pointer--left"}),n("i",{staticClass:"vc-ps-hue-pointer--right"})])])],1),t._v(" "),n("div",{class:["vc-ps-controls",t.disableFields?"vc-ps-controls__disable-fields":""]},[n("div",{staticClass:"vc-ps-previews"},[n("div",{staticClass:"vc-ps-previews__label"},[t._v(t._s(t.newLabel))]),t._v(" "),n("div",{staticClass:"vc-ps-previews__swatches"},[n("div",{staticClass:"vc-ps-previews__pr-color",style:{background:t.colors.hex},attrs:{"aria-label":"New color is "+t.colors.hex}}),t._v(" "),n("div",{staticClass:"vc-ps-previews__pr-color",style:{background:t.currentColor},attrs:{"aria-label":"Current color is "+t.currentColor},on:{click:t.clickCurrentColor}})]),t._v(" "),n("div",{staticClass:"vc-ps-previews__label"},[t._v(t._s(t.currentLabel))])]),t._v(" "),t.disableFields?t._e():n("div",{staticClass:"vc-ps-actions"},[n("div",{staticClass:"vc-ps-ac-btn",attrs:{role:"button","aria-label":t.acceptLabel},on:{click:t.handleAccept}},[t._v(t._s(t.acceptLabel))]),t._v(" "),n("div",{staticClass:"vc-ps-ac-btn",attrs:{role:"button","aria-label":t.cancelLabel},on:{click:t.handleCancel}},[t._v(t._s(t.cancelLabel))]),t._v(" "),n("div",{staticClass:"vc-ps-fields"},[n("ed-in",{attrs:{label:"h",desc:"°",value:t.hsv.h},on:{change:t.inputChange}}),t._v(" "),n("ed-in",{attrs:{label:"s",desc:"%",value:t.hsv.s,max:100},on:{change:t.inputChange}}),t._v(" "),n("ed-in",{attrs:{label:"v",desc:"%",value:t.hsv.v,max:100},on:{change:t.inputChange}}),t._v(" "),n("div",{staticClass:"vc-ps-fields__divider"}),t._v(" "),n("ed-in",{attrs:{label:"r",value:t.colors.rgba.r},on:{change:t.inputChange}}),t._v(" "),n("ed-in",{attrs:{label:"g",value:t.colors.rgba.g},on:{change:t.inputChange}}),t._v(" "),n("ed-in",{attrs:{label:"b",value:t.colors.rgba.b},on:{change:t.inputChange}}),t._v(" "),n("div",{staticClass:"vc-ps-fields__divider"}),t._v(" "),n("ed-in",{staticClass:"vc-ps-fields__hex",attrs:{label:"#",value:t.hex},on:{change:t.inputChange}})],1),t._v(" "),t.hasResetButton?n("div",{staticClass:"vc-ps-ac-btn",attrs:{"aria-label":"reset"},on:{click:t.handleReset}},[t._v(t._s(t.resetLabel))]):t._e()])])])])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){function r(d){e(136)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(57),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(138),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/Sketch.vue",a.default=p.exports},function(o,a,e){var r=e(137);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("612c6604",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-sketch {
  position: relative;
  width: 200px;
  padding: 10px 10px 0;
  box-sizing: initial;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 8px 16px rgba(0, 0, 0, .15);
}
.vc-sketch-saturation-wrap {
  width: 100%;
  padding-bottom: 75%;
  position: relative;
  overflow: hidden;
}
.vc-sketch-controls {
  display: flex;
}
.vc-sketch-sliders {
  padding: 4px 0;
  flex: 1;
}
.vc-sketch-sliders .vc-hue,
.vc-sketch-sliders .vc-alpha-gradient {
  border-radius: 2px;
}
.vc-sketch-hue-wrap {
  position: relative;
  height: 10px;
}
.vc-sketch-alpha-wrap {
  position: relative;
  height: 10px;
  margin-top: 4px;
  overflow: hidden;
}
.vc-sketch-color-wrap {
  width: 24px;
  height: 24px;
  position: relative;
  margin-top: 4px;
  margin-left: 4px;
  border-radius: 3px;
}
.vc-sketch-active-color {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25);
  z-index: 2;
}
.vc-sketch-color-wrap .vc-checkerboard {
  background-size: auto;
}
.vc-sketch-field {
  display: flex;
  padding-top: 4px;
}
.vc-sketch-field .vc-input__input {
  width: 90%;
  padding: 4px 0 3px 10%;
  border: none;
  box-shadow: inset 0 0 0 1px #ccc;
  font-size: 10px;
}
.vc-sketch-field .vc-input__label {
  display: block;
  text-align: center;
  font-size: 11px;
  color: #222;
  padding-top: 3px;
  padding-bottom: 4px;
  text-transform: capitalize;
}
.vc-sketch-field--single {
  flex: 1;
  padding-left: 6px;
}
.vc-sketch-field--double {
  flex: 2;
}
.vc-sketch-presets {
  margin-right: -10px;
  margin-left: -10px;
  padding-left: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
.vc-sketch-presets-color {
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  display: inline-block;
  margin: 0 10px 10px 0;
  vertical-align: top;
  cursor: pointer;
  width: 16px;
  height: 16px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);
}
.vc-sketch-presets-color .vc-checkerboard {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);
  border-radius: 3px;
}
.vc-sketch__disable-alpha .vc-sketch-color-wrap {
  height: 10px;
}
`,""])},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{class:["vc-sketch",t.disableAlpha?"vc-sketch__disable-alpha":""],attrs:{role:"application","aria-label":"Sketch color picker"}},[n("div",{staticClass:"vc-sketch-saturation-wrap"},[n("saturation",{on:{change:t.childChange},model:{value:t.colors,callback:function(c){t.colors=c},expression:"colors"}})],1),t._v(" "),n("div",{staticClass:"vc-sketch-controls"},[n("div",{staticClass:"vc-sketch-sliders"},[n("div",{staticClass:"vc-sketch-hue-wrap"},[n("hue",{on:{change:t.childChange},model:{value:t.colors,callback:function(c){t.colors=c},expression:"colors"}})],1),t._v(" "),t.disableAlpha?t._e():n("div",{staticClass:"vc-sketch-alpha-wrap"},[n("alpha",{on:{change:t.childChange},model:{value:t.colors,callback:function(c){t.colors=c},expression:"colors"}})],1)]),t._v(" "),n("div",{staticClass:"vc-sketch-color-wrap"},[n("div",{staticClass:"vc-sketch-active-color",style:{background:t.activeColor},attrs:{"aria-label":"Current color is "+t.activeColor}}),t._v(" "),n("checkboard")],1)]),t._v(" "),t.disableFields?t._e():n("div",{staticClass:"vc-sketch-field"},[n("div",{staticClass:"vc-sketch-field--double"},[n("ed-in",{attrs:{label:"hex",value:t.hex},on:{change:t.inputChange}})],1),t._v(" "),n("div",{staticClass:"vc-sketch-field--single"},[n("ed-in",{attrs:{label:"r",value:t.colors.rgba.r},on:{change:t.inputChange}})],1),t._v(" "),n("div",{staticClass:"vc-sketch-field--single"},[n("ed-in",{attrs:{label:"g",value:t.colors.rgba.g},on:{change:t.inputChange}})],1),t._v(" "),n("div",{staticClass:"vc-sketch-field--single"},[n("ed-in",{attrs:{label:"b",value:t.colors.rgba.b},on:{change:t.inputChange}})],1),t._v(" "),t.disableAlpha?t._e():n("div",{staticClass:"vc-sketch-field--single"},[n("ed-in",{attrs:{label:"a",value:t.colors.a,"arrow-offset":.01,max:1},on:{change:t.inputChange}})],1)]),t._v(" "),n("div",{staticClass:"vc-sketch-presets",attrs:{role:"group","aria-label":"A color preset, pick one to set as current color"}},[t._l(t.presetColors,function(c){return[t.isTransparent(c)?n("div",{key:c,staticClass:"vc-sketch-presets-color",attrs:{"aria-label":"Color:"+c},on:{click:function(p){return t.handlePreset(c)}}},[n("checkboard")],1):n("div",{key:c,staticClass:"vc-sketch-presets-color",style:{background:c},attrs:{"aria-label":"Color:"+c},on:{click:function(p){return t.handlePreset(c)}}})]})],2)])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){function r(d){e(140)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(58),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(142),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/Chrome.vue",a.default=p.exports},function(o,a,e){var r=e(141);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("1cd16048",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-chrome {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3);
  box-sizing: initial;
  width: 225px;
  font-family: Menlo;
  background-color: #fff;
}
.vc-chrome-controls {
  display: flex;
}
.vc-chrome-color-wrap {
  position: relative;
  width: 36px;
}
.vc-chrome-active-color {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
  z-index: 1;
}
.vc-chrome-color-wrap .vc-checkerboard {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-size: auto;
}
.vc-chrome-sliders {
  flex: 1;
}
.vc-chrome-fields-wrap {
  display: flex;
  padding-top: 16px;
}
.vc-chrome-fields {
  display: flex;
  margin-left: -6px;
  flex: 1;
}
.vc-chrome-field {
  padding-left: 6px;
  width: 100%;
}
.vc-chrome-toggle-btn {
  width: 32px;
  text-align: right;
  position: relative;
}
.vc-chrome-toggle-icon {
  margin-right: -4px;
  margin-top: 12px;
  cursor: pointer;
  position: relative;
  z-index: 2;
}
.vc-chrome-toggle-icon-highlight {
  position: absolute;
  width: 24px;
  height: 28px;
  background: #eee;
  border-radius: 4px;
  top: 10px;
  left: 12px;
}
.vc-chrome-hue-wrap {
  position: relative;
  height: 10px;
  margin-bottom: 8px;
}
.vc-chrome-alpha-wrap {
  position: relative;
  height: 10px;
}
.vc-chrome-hue-wrap .vc-hue {
  border-radius: 2px;
}
.vc-chrome-alpha-wrap .vc-alpha-gradient {
  border-radius: 2px;
}
.vc-chrome-hue-wrap .vc-hue-picker, .vc-chrome-alpha-wrap .vc-alpha-picker {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  transform: translate(-6px, -2px);
  background-color: rgb(248, 248, 248);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
.vc-chrome-body {
  padding: 16px 16px 12px;
  background-color: #fff;
}
.vc-chrome-saturation-wrap {
  width: 100%;
  padding-bottom: 55%;
  position: relative;
  border-radius: 2px 2px 0 0;
  overflow: hidden;
}
.vc-chrome-saturation-wrap .vc-saturation-circle {
  width: 12px;
  height: 12px;
}
.vc-chrome-fields .vc-input__input {
  font-size: 11px;
  color: #333;
  width: 100%;
  border-radius: 2px;
  border: none;
  box-shadow: inset 0 0 0 1px #dadada;
  height: 21px;
  text-align: center;
}
.vc-chrome-fields .vc-input__label {
  text-transform: uppercase;
  font-size: 11px;
  line-height: 11px;
  color: #969696;
  text-align: center;
  display: block;
  margin-top: 12px;
}
.vc-chrome__disable-alpha .vc-chrome-active-color {
  width: 18px;
  height: 18px;
}
.vc-chrome__disable-alpha .vc-chrome-color-wrap {
  width: 30px;
}
.vc-chrome__disable-alpha .vc-chrome-hue-wrap {
  margin-top: 4px;
  margin-bottom: 4px;
}
`,""])},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{class:["vc-chrome",t.disableAlpha?"vc-chrome__disable-alpha":""],attrs:{role:"application","aria-label":"Chrome color picker"}},[n("div",{staticClass:"vc-chrome-saturation-wrap"},[n("saturation",{on:{change:t.childChange},model:{value:t.colors,callback:function(c){t.colors=c},expression:"colors"}})],1),t._v(" "),n("div",{staticClass:"vc-chrome-body"},[n("div",{staticClass:"vc-chrome-controls"},[n("div",{staticClass:"vc-chrome-color-wrap"},[n("div",{staticClass:"vc-chrome-active-color",style:{background:t.activeColor},attrs:{"aria-label":"current color is "+t.colors.hex}}),t._v(" "),t.disableAlpha?t._e():n("checkboard")],1),t._v(" "),n("div",{staticClass:"vc-chrome-sliders"},[n("div",{staticClass:"vc-chrome-hue-wrap"},[n("hue",{on:{change:t.childChange},model:{value:t.colors,callback:function(c){t.colors=c},expression:"colors"}})],1),t._v(" "),t.disableAlpha?t._e():n("div",{staticClass:"vc-chrome-alpha-wrap"},[n("alpha",{on:{change:t.childChange},model:{value:t.colors,callback:function(c){t.colors=c},expression:"colors"}})],1)])]),t._v(" "),t.disableFields?t._e():n("div",{staticClass:"vc-chrome-fields-wrap"},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.fieldsIndex===0,expression:"fieldsIndex === 0"}],staticClass:"vc-chrome-fields"},[n("div",{staticClass:"vc-chrome-field"},[t.hasAlpha?t._e():n("ed-in",{attrs:{label:"hex",value:t.colors.hex},on:{change:t.inputChange}}),t._v(" "),t.hasAlpha?n("ed-in",{attrs:{label:"hex",value:t.colors.hex8},on:{change:t.inputChange}}):t._e()],1)]),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.fieldsIndex===1,expression:"fieldsIndex === 1"}],staticClass:"vc-chrome-fields"},[n("div",{staticClass:"vc-chrome-field"},[n("ed-in",{attrs:{label:"r",value:t.colors.rgba.r},on:{change:t.inputChange}})],1),t._v(" "),n("div",{staticClass:"vc-chrome-field"},[n("ed-in",{attrs:{label:"g",value:t.colors.rgba.g},on:{change:t.inputChange}})],1),t._v(" "),n("div",{staticClass:"vc-chrome-field"},[n("ed-in",{attrs:{label:"b",value:t.colors.rgba.b},on:{change:t.inputChange}})],1),t._v(" "),t.disableAlpha?t._e():n("div",{staticClass:"vc-chrome-field"},[n("ed-in",{attrs:{label:"a",value:t.colors.a,"arrow-offset":.01,max:1},on:{change:t.inputChange}})],1)]),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.fieldsIndex===2,expression:"fieldsIndex === 2"}],staticClass:"vc-chrome-fields"},[n("div",{staticClass:"vc-chrome-field"},[n("ed-in",{attrs:{label:"h",value:t.hsl.h},on:{change:t.inputChange}})],1),t._v(" "),n("div",{staticClass:"vc-chrome-field"},[n("ed-in",{attrs:{label:"s",value:t.hsl.s},on:{change:t.inputChange}})],1),t._v(" "),n("div",{staticClass:"vc-chrome-field"},[n("ed-in",{attrs:{label:"l",value:t.hsl.l},on:{change:t.inputChange}})],1),t._v(" "),t.disableAlpha?t._e():n("div",{staticClass:"vc-chrome-field"},[n("ed-in",{attrs:{label:"a",value:t.colors.a,"arrow-offset":.01,max:1},on:{change:t.inputChange}})],1)]),t._v(" "),n("div",{staticClass:"vc-chrome-toggle-btn",attrs:{role:"button","aria-label":"Change another color definition"},on:{click:t.toggleViews}},[n("div",{staticClass:"vc-chrome-toggle-icon"},[n("svg",{staticStyle:{width:"24px",height:"24px"},attrs:{viewBox:"0 0 24 24"},on:{mouseover:t.showHighlight,mouseenter:t.showHighlight,mouseout:t.hideHighlight}},[n("path",{attrs:{fill:"#333",d:"M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"}})])]),t._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:t.highlight,expression:"highlight"}],staticClass:"vc-chrome-toggle-icon-highlight"})])])])])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s},function(o,a,e){function r(d){e(144)}Object.defineProperty(a,"__esModule",{value:!0});var i=e(59),s=e.n(i);for(var t in i)t!=="default"&&function(d){e.d(a,d,function(){return i[d]})}(t);var f=e(146),n=e(2),c=r,p=n(s.a,f.a,!1,c,null,null);p.options.__file="src/components/Twitter.vue",a.default=p.exports},function(o,a,e){var r=e(145);typeof r=="string"&&(r=[[o.i,r,""]]),r.locals&&(o.exports=r.locals),e(1)("669a48a5",r,!1,{})},function(o,a,e){a=o.exports=e(0)(!1),a.push([o.i,`
.vc-twitter {
  background: #fff;
  border: 0 solid rgba(0,0,0,0.25);
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  border-radius: 4px;
  position: relative;
}
.vc-twitter-triangle {
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0 9px 10px 9px;
  border-color: transparent transparent #fff transparent;
  position: absolute;
}
.vc-twitter-triangle-shadow {
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0 9px 10px 9px;
  border-color: transparent transparent rgba(0, 0, 0, .1) transparent;
  position: absolute;
}
.vc-twitter-body {
  padding: 15px 9px 9px 15px;
}
.vc-twitter .vc-editable-input {
  position: relative;
}
.vc-twitter .vc-editable-input input {
  width: 100px;
  font-size: 14px;
  color: #666;
  border: 0px;
  outline: none;
  height: 28px;
  box-shadow: inset 0 0 0 1px #F0F0F0;
  box-sizing: content-box;
  border-radius: 0 4px 4px 0;
  float: left;
  padding: 1px;
  padding-left: 8px;
}
.vc-twitter .vc-editable-input span {
  display: none;
}
.vc-twitter-hash {
  background: #F0F0F0;
  height: 30px;
  width: 30px;
  border-radius: 4px 0 0 4px;
  float: left;
  color: #98A1A4;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vc-twitter-swatch {
  width: 30px;
  height: 30px;
  float: left;
  border-radius: 4px;
  margin: 0 6px 6px 0;
  cursor: pointer;
  position: relative;
  outline: none;
}
.vc-twitter-clear {
  clear: both;
}
.vc-twitter-hide-triangle .vc-twitter-triangle {
  display: none;
}
.vc-twitter-hide-triangle .vc-twitter-triangle-shadow {
  display: none;
}
.vc-twitter-top-left-triangle .vc-twitter-triangle{
  top: -10px;
  left: 12px;
}
.vc-twitter-top-left-triangle .vc-twitter-triangle-shadow{
  top: -11px;
  left: 12px;
}
.vc-twitter-top-right-triangle .vc-twitter-triangle{
  top: -10px;
  right: 12px;
}
.vc-twitter-top-right-triangle .vc-twitter-triangle-shadow{
  top: -11px;
  right: 12px;
}
`,""])},function(o,a,e){var r=function(){var t=this,f=t.$createElement,n=t._self._c||f;return n("div",{staticClass:"vc-twitter",class:{"vc-twitter-hide-triangle ":t.triangle==="hide","vc-twitter-top-left-triangle ":t.triangle==="top-left","vc-twitter-top-right-triangle ":t.triangle==="top-right"},style:{width:typeof t.width=="number"?t.width+"px":t.width}},[n("div",{staticClass:"vc-twitter-triangle-shadow"}),t._v(" "),n("div",{staticClass:"vc-twitter-triangle"}),t._v(" "),n("div",{staticClass:"vc-twitter-body"},[t._l(t.defaultColors,function(c,p){return n("span",{key:p,staticClass:"vc-twitter-swatch",style:{background:c,boxShadow:"0 0 4px "+(t.equal(c)?c:"transparent")},on:{click:function(d){return t.handlerClick(c)}}})}),t._v(" "),n("div",{staticClass:"vc-twitter-hash"},[t._v("#")]),t._v(" "),n("editable-input",{attrs:{label:"#",value:t.hex},on:{change:t.inputChange}}),t._v(" "),n("div",{staticClass:"vc-twitter-clear"})],2)])},i=[];r._withStripped=!0;var s={render:r,staticRenderFns:i};a.a=s}])})}(bt)),bt.exports}var Ut=zt(),Ct;window._nc_vue_element_id=(Ct=window._nc_vue_element_id)!=null?Ct:0;function Gt(){return"nc-vue-".concat(window._nc_vue_element_id++)}At();var Vt=Object.defineProperty,Wt=Object.defineProperties,Xt=Object.getOwnPropertyDescriptors,kt=Object.getOwnPropertySymbols,Yt=Object.prototype.hasOwnProperty,qt=Object.prototype.propertyIsEnumerable,St=(B,N,o)=>N in B?Vt(B,N,{enumerable:!0,configurable:!0,writable:!0,value:o}):B[N]=o,Jt=(B,N)=>{for(var o in N||(N={}))Yt.call(N,o)&&St(B,o,N[o]);if(kt)for(var o of kt(N))qt.call(N,o)&&St(B,o,N[o]);return B},Kt=(B,N)=>Wt(B,Xt(N));const Qt={model:{event:"update:modelValue",prop:"modelValue"}},Zt=Ot(Kt(Jt({},Qt),{__name:"NcColorPicker",props:{advancedFields:{type:Boolean},clearable:{type:Boolean},container:{default:"body"},modelValue:{default:""},value:{default:void 0},open:{type:Boolean},palette:{default:()=>[]},paletteOnly:{type:Boolean}},emits:["submit","close","update:modelValue","update:value"],setup(B,{emit:N}){const o=B,a=Et("value","update:value",!0),e=jt(o,"open",N,{passive:!0,eventName:"update:open"}),r=/^#([a-f0-9]{3}|[a-f0-9]{6})$/i,i=Gt(),s=Lt(!1),t=Mt(()=>{var w;let v=o.palette;for(const m of v)if(typeof m=="string"&&!m.match(r)||typeof m=="object"&&!((w=m.color)!=null&&w.match(r))){Pt.error("[NcColorPicker] Invalid palette passed",{color:m}),v=[];break}return v.length===0&&(v=o.clearable?[...mt,_t,yt]:[...mt]),v.map(m=>({color:typeof m=="object"?m.color:m,name:typeof m=="object"&&m.name?m.name:xt("A color with a HEX value {hex}",{hex:typeof m=="string"?m:m.color})}))});function f(w){N("submit",a.value),w(),s.value=!1}function n(w){w=typeof w=="string"?w:w.color,o.clearable&&a.value===w?a.value=void 0:a.value=w}function c(w){a.value=w.hex}function p(w){return d(w)>.5?_t.color:yt.color}function d(w){const[v,m,y]=b(w);return(.2126*v+.7152*m+.0722*y)/255}function b(w){const v=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(w);return v?[parseInt(v[1],16),parseInt(v[2],16),parseInt(v[3],16)]:[0,0,0]}return{__sfc:!0,props:o,emit:N,currentColor:a,modelOpen:e,HEX_REGEX:r,id:i,advanced:s,normalizedPalette:t,handleConfirm:f,toggleColor:n,pickCustomColor:c,getContrastColor:p,calculateLuma:d,hexToRGB:b,mdiArrowLeft:It,mdiCheck:Ht,mdiCloseCircleOutline:Tt,mdiDotsHorizontal:Rt,Chrome:Ut.Chrome,NcButton:Nt,NcIconSvgWrapper:Bt,NcPopover:Dt,t:xt}}}));var te=function(){var B=this,N=B._self._c,o=B._self._setupProxy;return N(o.NcPopover,B._g(B._b({attrs:{shown:o.modelOpen,container:B.container,"popup-role":"dialog"},on:{"update:shown":function(a){o.modelOpen=a},"apply-hide":function(a){return o.emit("close")}},scopedSlots:B._u([{key:"trigger",fn:function(a){return[B._t("default",null,null,a)]}},{key:"default",fn:function(a){var e;return[N("div",{staticClass:"color-picker",class:{"color-picker--advanced-fields":o.advanced&&B.advancedFields,"color-picker--clearable":B.clearable},attrs:{role:"dialog","aria-modal":"true","aria-label":o.t("Color picker")}},[N("Transition",{attrs:{name:"slide",mode:"out-in"}},[o.advanced?N(o.Chrome,{staticClass:"color-picker__advanced",attrs:{"disable-alpha":!0,"disable-fields":!B.advancedFields,value:(e=o.currentColor)!=null?e:"#000000"},on:{input:o.pickCustomColor}}):N("div",{staticClass:"color-picker__simple"},[B._l(o.normalizedPalette,function({color:r,name:i},s){return N("label",{key:s,staticClass:"color-picker__simple-color-circle",class:{"color-picker__simple-color-circle--active":r===o.currentColor},style:{backgroundColor:r,color:o.getContrastColor(r)}},[N("span",{staticClass:"hidden-visually"},[B._v(" "+B._s(r)+" -- "+B._s(o.currentColor)+" ")]),r===o.currentColor?N(o.NcIconSvgWrapper,{attrs:{path:o.mdiCheck}}):B._e(),N("input",{staticClass:"hidden-visually",attrs:{type:"radio","aria-label":i,name:"color-picker-".concat(o.id)},domProps:{checked:r===o.currentColor},on:{click:function(t){return o.toggleColor(r)}}})],1)}),B.clearable?N("label",{staticClass:"color-picker__clear",attrs:{title:o.t("No color")}},[N(o.NcIconSvgWrapper,{attrs:{size:o.currentColor?28:34,path:o.mdiCloseCircleOutline}}),N("input",{staticClass:"hidden-visually",attrs:{type:"radio","aria-label":o.t("No color"),name:"color-picker-".concat(o.id)},domProps:{checked:!o.currentColor},on:{click:function(r){o.currentColor=void 0}}})],1):B._e()],2)],1),B.paletteOnly?B._e():N("div",{staticClass:"color-picker__navigation"},[o.advanced?N(o.NcButton,{attrs:{"aria-label":o.t("Back"),title:o.t("Back"),variant:"tertiary"},on:{click:function(r){o.advanced=!1}},scopedSlots:B._u([{key:"icon",fn:function(){return[N(o.NcIconSvgWrapper,{attrs:{directional:"",path:o.mdiArrowLeft}})]},proxy:!0}],null,!0)}):N(o.NcButton,{attrs:{"aria-label":o.t("More options"),title:o.t("More options"),variant:"tertiary"},on:{click:function(r){o.advanced=!0}},scopedSlots:B._u([{key:"icon",fn:function(){return[N(o.NcIconSvgWrapper,{attrs:{path:o.mdiDotsHorizontal}})]},proxy:!0}],null,!0)}),N(o.NcButton,{attrs:{variant:"primary"},on:{click:function(r){return o.handleConfirm(a.hide)}}},[B._v(" "+B._s(o.t("Choose"))+" ")])],1)],1)]}}],null,!0)},"NcPopover",B.$attrs,!1),B.$listeners))},ee=[],re=Ft(Zt,te,ee,!1,null,"01d41e75");const ae=re.exports;export{ae as default};
//# sourceMappingURL=NcColorPicker-Bxi3lTYe.chunk.mjs.map
