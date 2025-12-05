(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // node_modules/papaparse/papaparse.min.js
  var require_papaparse_min = __commonJS({
    "node_modules/papaparse/papaparse.min.js"(exports, module) {
      ((e, t) => {
        typeof define == "function" && define.amd ? define([], t) : typeof module == "object" && typeof exports != "undefined" ? module.exports = t() : e.Papa = t();
      })(exports, function r() {
        var n = typeof self != "undefined" ? self : typeof window != "undefined" ? window : n !== void 0 ? n : {};
        var d, s = !n.document && !!n.postMessage, a = n.IS_PAPA_WORKER || false, o = {}, h = 0, v = {};
        function u(e) {
          this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, function(e2) {
            var t = w(e2);
            t.chunkSize = parseInt(t.chunkSize), e2.step || e2.chunk || (t.chunkSize = null);
            this._handle = new i(t), (this._handle.streamer = this)._config = t;
          }.call(this, e), this.parseChunk = function(t, e2) {
            var i2 = parseInt(this._config.skipFirstNLines) || 0;
            if (this.isFirstChunk && 0 < i2) {
              let e3 = this._config.newline;
              e3 || (r2 = this._config.quoteChar || '"', e3 = this._handle.guessLineEndings(t, r2)), t = [...t.split(e3).slice(i2)].join(e3);
            }
            this.isFirstChunk && U(this._config.beforeFirstChunk) && (r2 = this._config.beforeFirstChunk(t)) !== void 0 && (t = r2), this.isFirstChunk = false, this._halted = false;
            var i2 = this._partialLine + t, r2 = (this._partialLine = "", this._handle.parse(i2, this._baseIndex, !this._finished));
            if (!this._handle.paused() && !this._handle.aborted()) {
              t = r2.meta.cursor, i2 = (this._finished || (this._partialLine = i2.substring(t - this._baseIndex), this._baseIndex = t), r2 && r2.data && (this._rowCount += r2.data.length), this._finished || this._config.preview && this._rowCount >= this._config.preview);
              if (a)
                n.postMessage({ results: r2, workerId: v.WORKER_ID, finished: i2 });
              else if (U(this._config.chunk) && !e2) {
                if (this._config.chunk(r2, this._handle), this._handle.paused() || this._handle.aborted())
                  return void (this._halted = true);
                this._completeResults = r2 = void 0;
              }
              return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(r2.data), this._completeResults.errors = this._completeResults.errors.concat(r2.errors), this._completeResults.meta = r2.meta), this._completed || !i2 || !U(this._config.complete) || r2 && r2.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), i2 || r2 && r2.meta.paused || this._nextChunk(), r2;
            }
            this._halted = true;
          }, this._sendError = function(e2) {
            U(this._config.error) ? this._config.error(e2) : a && this._config.error && n.postMessage({ workerId: v.WORKER_ID, error: e2, finished: false });
          };
        }
        function f(e) {
          var r2;
          (e = e || {}).chunkSize || (e.chunkSize = v.RemoteChunkSize), u.call(this, e), this._nextChunk = s ? function() {
            this._readChunk(), this._chunkLoaded();
          } : function() {
            this._readChunk();
          }, this.stream = function(e2) {
            this._input = e2, this._nextChunk();
          }, this._readChunk = function() {
            if (this._finished)
              this._chunkLoaded();
            else {
              if (r2 = new XMLHttpRequest(), this._config.withCredentials && (r2.withCredentials = this._config.withCredentials), s || (r2.onload = y(this._chunkLoaded, this), r2.onerror = y(this._chunkError, this)), r2.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !s), this._config.downloadRequestHeaders) {
                var e2, t = this._config.downloadRequestHeaders;
                for (e2 in t)
                  r2.setRequestHeader(e2, t[e2]);
              }
              var i2;
              this._config.chunkSize && (i2 = this._start + this._config.chunkSize - 1, r2.setRequestHeader("Range", "bytes=" + this._start + "-" + i2));
              try {
                r2.send(this._config.downloadRequestBody);
              } catch (e3) {
                this._chunkError(e3.message);
              }
              s && r2.status === 0 && this._chunkError();
            }
          }, this._chunkLoaded = function() {
            r2.readyState === 4 && (r2.status < 200 || 400 <= r2.status ? this._chunkError() : (this._start += this._config.chunkSize || r2.responseText.length, this._finished = !this._config.chunkSize || this._start >= ((e2) => (e2 = e2.getResponseHeader("Content-Range")) !== null ? parseInt(e2.substring(e2.lastIndexOf("/") + 1)) : -1)(r2), this.parseChunk(r2.responseText)));
          }, this._chunkError = function(e2) {
            e2 = r2.statusText || e2;
            this._sendError(new Error(e2));
          };
        }
        function l(e) {
          (e = e || {}).chunkSize || (e.chunkSize = v.LocalChunkSize), u.call(this, e);
          var i2, r2, n2 = typeof FileReader != "undefined";
          this.stream = function(e2) {
            this._input = e2, r2 = e2.slice || e2.webkitSlice || e2.mozSlice, n2 ? ((i2 = new FileReader()).onload = y(this._chunkLoaded, this), i2.onerror = y(this._chunkError, this)) : i2 = new FileReaderSync(), this._nextChunk();
          }, this._nextChunk = function() {
            this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
          }, this._readChunk = function() {
            var e2 = this._input, t = (this._config.chunkSize && (t = Math.min(this._start + this._config.chunkSize, this._input.size), e2 = r2.call(e2, this._start, t)), i2.readAsText(e2, this._config.encoding));
            n2 || this._chunkLoaded({ target: { result: t } });
          }, this._chunkLoaded = function(e2) {
            this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e2.target.result);
          }, this._chunkError = function() {
            this._sendError(i2.error);
          };
        }
        function c(e) {
          var i2;
          u.call(this, e = e || {}), this.stream = function(e2) {
            return i2 = e2, this._nextChunk();
          }, this._nextChunk = function() {
            var e2, t;
            if (!this._finished)
              return e2 = this._config.chunkSize, i2 = e2 ? (t = i2.substring(0, e2), i2.substring(e2)) : (t = i2, ""), this._finished = !i2, this.parseChunk(t);
          };
        }
        function p(e) {
          u.call(this, e = e || {});
          var t = [], i2 = true, r2 = false;
          this.pause = function() {
            u.prototype.pause.apply(this, arguments), this._input.pause();
          }, this.resume = function() {
            u.prototype.resume.apply(this, arguments), this._input.resume();
          }, this.stream = function(e2) {
            this._input = e2, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
          }, this._checkIsFinished = function() {
            r2 && t.length === 1 && (this._finished = true);
          }, this._nextChunk = function() {
            this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i2 = true;
          }, this._streamData = y(function(e2) {
            try {
              t.push(typeof e2 == "string" ? e2 : e2.toString(this._config.encoding)), i2 && (i2 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
            } catch (e3) {
              this._streamError(e3);
            }
          }, this), this._streamError = y(function(e2) {
            this._streamCleanUp(), this._sendError(e2);
          }, this), this._streamEnd = y(function() {
            this._streamCleanUp(), r2 = true, this._streamData("");
          }, this), this._streamCleanUp = y(function() {
            this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
          }, this);
        }
        function i(m2) {
          var n2, s2, a2, t, o2 = Math.pow(2, 53), h2 = -o2, u2 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, d2 = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, i2 = this, r2 = 0, f2 = 0, l2 = false, e = false, c2 = [], p2 = { data: [], errors: [], meta: {} };
          function y2(e2) {
            return m2.skipEmptyLines === "greedy" ? e2.join("").trim() === "" : e2.length === 1 && e2[0].length === 0;
          }
          function g2() {
            if (p2 && a2 && (k("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + v.DefaultDelimiter + "'"), a2 = false), m2.skipEmptyLines && (p2.data = p2.data.filter(function(e3) {
              return !y2(e3);
            })), _2()) {
              let t3 = function(e3, t4) {
                U(m2.transformHeader) && (e3 = m2.transformHeader(e3, t4)), c2.push(e3);
              };
              var t2 = t3;
              if (p2)
                if (Array.isArray(p2.data[0])) {
                  for (var e2 = 0; _2() && e2 < p2.data.length; e2++)
                    p2.data[e2].forEach(t3);
                  p2.data.splice(0, 1);
                } else
                  p2.data.forEach(t3);
            }
            function i3(e3, t3) {
              for (var i4 = m2.header ? {} : [], r4 = 0; r4 < e3.length; r4++) {
                var n3 = r4, s3 = e3[r4], s3 = ((e4, t4) => ((e5) => (m2.dynamicTypingFunction && m2.dynamicTyping[e5] === void 0 && (m2.dynamicTyping[e5] = m2.dynamicTypingFunction(e5)), (m2.dynamicTyping[e5] || m2.dynamicTyping) === true))(e4) ? t4 === "true" || t4 === "TRUE" || t4 !== "false" && t4 !== "FALSE" && (((e5) => {
                  if (u2.test(e5)) {
                    e5 = parseFloat(e5);
                    if (h2 < e5 && e5 < o2)
                      return 1;
                  }
                })(t4) ? parseFloat(t4) : d2.test(t4) ? new Date(t4) : t4 === "" ? null : t4) : t4)(n3 = m2.header ? r4 >= c2.length ? "__parsed_extra" : c2[r4] : n3, s3 = m2.transform ? m2.transform(s3, n3) : s3);
                n3 === "__parsed_extra" ? (i4[n3] = i4[n3] || [], i4[n3].push(s3)) : i4[n3] = s3;
              }
              return m2.header && (r4 > c2.length ? k("FieldMismatch", "TooManyFields", "Too many fields: expected " + c2.length + " fields but parsed " + r4, f2 + t3) : r4 < c2.length && k("FieldMismatch", "TooFewFields", "Too few fields: expected " + c2.length + " fields but parsed " + r4, f2 + t3)), i4;
            }
            var r3;
            p2 && (m2.header || m2.dynamicTyping || m2.transform) && (r3 = 1, !p2.data.length || Array.isArray(p2.data[0]) ? (p2.data = p2.data.map(i3), r3 = p2.data.length) : p2.data = i3(p2.data, 0), m2.header && p2.meta && (p2.meta.fields = c2), f2 += r3);
          }
          function _2() {
            return m2.header && c2.length === 0;
          }
          function k(e2, t2, i3, r3) {
            e2 = { type: e2, code: t2, message: i3 };
            r3 !== void 0 && (e2.row = r3), p2.errors.push(e2);
          }
          U(m2.step) && (t = m2.step, m2.step = function(e2) {
            p2 = e2, _2() ? g2() : (g2(), p2.data.length !== 0 && (r2 += e2.data.length, m2.preview && r2 > m2.preview ? s2.abort() : (p2.data = p2.data[0], t(p2, i2))));
          }), this.parse = function(e2, t2, i3) {
            var r3 = m2.quoteChar || '"', r3 = (m2.newline || (m2.newline = this.guessLineEndings(e2, r3)), a2 = false, m2.delimiter ? U(m2.delimiter) && (m2.delimiter = m2.delimiter(e2), p2.meta.delimiter = m2.delimiter) : ((r3 = ((e3, t3, i4, r4, n3) => {
              var s3, a3, o3, h3;
              n3 = n3 || [",", "	", "|", ";", v.RECORD_SEP, v.UNIT_SEP];
              for (var u3 = 0; u3 < n3.length; u3++) {
                for (var d3, f3 = n3[u3], l3 = 0, c3 = 0, p3 = 0, g3 = (o3 = void 0, new E({ comments: r4, delimiter: f3, newline: t3, preview: 10 }).parse(e3)), _3 = 0; _3 < g3.data.length; _3++)
                  i4 && y2(g3.data[_3]) ? p3++ : (d3 = g3.data[_3].length, c3 += d3, o3 === void 0 ? o3 = d3 : 0 < d3 && (l3 += Math.abs(d3 - o3), o3 = d3));
                0 < g3.data.length && (c3 /= g3.data.length - p3), (a3 === void 0 || l3 <= a3) && (h3 === void 0 || h3 < c3) && 1.99 < c3 && (a3 = l3, s3 = f3, h3 = c3);
              }
              return { successful: !!(m2.delimiter = s3), bestDelimiter: s3 };
            })(e2, m2.newline, m2.skipEmptyLines, m2.comments, m2.delimitersToGuess)).successful ? m2.delimiter = r3.bestDelimiter : (a2 = true, m2.delimiter = v.DefaultDelimiter), p2.meta.delimiter = m2.delimiter), w(m2));
            return m2.preview && m2.header && r3.preview++, n2 = e2, s2 = new E(r3), p2 = s2.parse(n2, t2, i3), g2(), l2 ? { meta: { paused: true } } : p2 || { meta: { paused: false } };
          }, this.paused = function() {
            return l2;
          }, this.pause = function() {
            l2 = true, s2.abort(), n2 = U(m2.chunk) ? "" : n2.substring(s2.getCharIndex());
          }, this.resume = function() {
            i2.streamer._halted ? (l2 = false, i2.streamer.parseChunk(n2, true)) : setTimeout(i2.resume, 3);
          }, this.aborted = function() {
            return e;
          }, this.abort = function() {
            e = true, s2.abort(), p2.meta.aborted = true, U(m2.complete) && m2.complete(p2), n2 = "";
          }, this.guessLineEndings = function(e2, t2) {
            e2 = e2.substring(0, 1048576);
            var t2 = new RegExp(P(t2) + "([^]*?)" + P(t2), "gm"), i3 = (e2 = e2.replace(t2, "")).split("\r"), t2 = e2.split("\n"), e2 = 1 < t2.length && t2[0].length < i3[0].length;
            if (i3.length === 1 || e2)
              return "\n";
            for (var r3 = 0, n3 = 0; n3 < i3.length; n3++)
              i3[n3][0] === "\n" && r3++;
            return r3 >= i3.length / 2 ? "\r\n" : "\r";
          };
        }
        function P(e) {
          return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        function E(C) {
          var S = (C = C || {}).delimiter, O = C.newline, x = C.comments, I = C.step, A = C.preview, T = C.fastMode, D = null, L = false, F = C.quoteChar == null ? '"' : C.quoteChar, j = F;
          if (C.escapeChar !== void 0 && (j = C.escapeChar), (typeof S != "string" || -1 < v.BAD_DELIMITERS.indexOf(S)) && (S = ","), x === S)
            throw new Error("Comment character same as delimiter");
          x === true ? x = "#" : (typeof x != "string" || -1 < v.BAD_DELIMITERS.indexOf(x)) && (x = false), O !== "\n" && O !== "\r" && O !== "\r\n" && (O = "\n");
          var z = 0, M = false;
          this.parse = function(i2, t, r2) {
            if (typeof i2 != "string")
              throw new Error("Input must be a string");
            var n2 = i2.length, e = S.length, s2 = O.length, a2 = x.length, o2 = U(I), h2 = [], u2 = [], d2 = [], f2 = z = 0;
            if (!i2)
              return b();
            if (T || T !== false && i2.indexOf(F) === -1) {
              for (var l2 = i2.split(O), c2 = 0; c2 < l2.length; c2++) {
                if (d2 = l2[c2], z += d2.length, c2 !== l2.length - 1)
                  z += O.length;
                else if (r2)
                  return b();
                if (!x || d2.substring(0, a2) !== x) {
                  if (o2) {
                    if (h2 = [], k(d2.split(S)), R(), M)
                      return b();
                  } else
                    k(d2.split(S));
                  if (A && A <= c2)
                    return h2 = h2.slice(0, A), b(true);
                }
              }
              return b();
            }
            for (var p2 = i2.indexOf(S, z), g2 = i2.indexOf(O, z), _2 = new RegExp(P(j) + P(F), "g"), m2 = i2.indexOf(F, z); ; )
              if (i2[z] === F)
                for (m2 = z, z++; ; ) {
                  if ((m2 = i2.indexOf(F, m2 + 1)) === -1)
                    return r2 || u2.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: h2.length, index: z }), E2();
                  if (m2 === n2 - 1)
                    return E2(i2.substring(z, m2).replace(_2, F));
                  if (F === j && i2[m2 + 1] === j)
                    m2++;
                  else if (F === j || m2 === 0 || i2[m2 - 1] !== j) {
                    p2 !== -1 && p2 < m2 + 1 && (p2 = i2.indexOf(S, m2 + 1));
                    var y2 = v2((g2 = g2 !== -1 && g2 < m2 + 1 ? i2.indexOf(O, m2 + 1) : g2) === -1 ? p2 : Math.min(p2, g2));
                    if (i2.substr(m2 + 1 + y2, e) === S) {
                      d2.push(i2.substring(z, m2).replace(_2, F)), i2[z = m2 + 1 + y2 + e] !== F && (m2 = i2.indexOf(F, z)), p2 = i2.indexOf(S, z), g2 = i2.indexOf(O, z);
                      break;
                    }
                    y2 = v2(g2);
                    if (i2.substring(m2 + 1 + y2, m2 + 1 + y2 + s2) === O) {
                      if (d2.push(i2.substring(z, m2).replace(_2, F)), w2(m2 + 1 + y2 + s2), p2 = i2.indexOf(S, z), m2 = i2.indexOf(F, z), o2 && (R(), M))
                        return b();
                      if (A && h2.length >= A)
                        return b(true);
                      break;
                    }
                    u2.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: h2.length, index: z }), m2++;
                  }
                }
              else if (x && d2.length === 0 && i2.substring(z, z + a2) === x) {
                if (g2 === -1)
                  return b();
                z = g2 + s2, g2 = i2.indexOf(O, z), p2 = i2.indexOf(S, z);
              } else if (p2 !== -1 && (p2 < g2 || g2 === -1))
                d2.push(i2.substring(z, p2)), z = p2 + e, p2 = i2.indexOf(S, z);
              else {
                if (g2 === -1)
                  break;
                if (d2.push(i2.substring(z, g2)), w2(g2 + s2), o2 && (R(), M))
                  return b();
                if (A && h2.length >= A)
                  return b(true);
              }
            return E2();
            function k(e2) {
              h2.push(e2), f2 = z;
            }
            function v2(e2) {
              var t2 = 0;
              return t2 = e2 !== -1 && (e2 = i2.substring(m2 + 1, e2)) && e2.trim() === "" ? e2.length : t2;
            }
            function E2(e2) {
              return r2 || (e2 === void 0 && (e2 = i2.substring(z)), d2.push(e2), z = n2, k(d2), o2 && R()), b();
            }
            function w2(e2) {
              z = e2, k(d2), d2 = [], g2 = i2.indexOf(O, z);
            }
            function b(e2) {
              if (C.header && !t && h2.length && !L) {
                var s3 = h2[0], a3 = {}, o3 = new Set(s3);
                let n3 = false;
                for (let r3 = 0; r3 < s3.length; r3++) {
                  let i3 = s3[r3];
                  if (a3[i3 = U(C.transformHeader) ? C.transformHeader(i3, r3) : i3]) {
                    let e3, t2 = a3[i3];
                    for (; e3 = i3 + "_" + t2, t2++, o3.has(e3); )
                      ;
                    o3.add(e3), s3[r3] = e3, a3[i3]++, n3 = true, (D = D === null ? {} : D)[e3] = i3;
                  } else
                    a3[i3] = 1, s3[r3] = i3;
                  o3.add(i3);
                }
                n3 && console.warn("Duplicate headers found and renamed."), L = true;
              }
              return { data: h2, errors: u2, meta: { delimiter: S, linebreak: O, aborted: M, truncated: !!e2, cursor: f2 + (t || 0), renamedHeaders: D } };
            }
            function R() {
              I(b()), h2 = [], u2 = [];
            }
          }, this.abort = function() {
            M = true;
          }, this.getCharIndex = function() {
            return z;
          };
        }
        function g(e) {
          var t = e.data, i2 = o[t.workerId], r2 = false;
          if (t.error)
            i2.userError(t.error, t.file);
          else if (t.results && t.results.data) {
            var n2 = { abort: function() {
              r2 = true, _(t.workerId, { data: [], errors: [], meta: { aborted: true } });
            }, pause: m, resume: m };
            if (U(i2.userStep)) {
              for (var s2 = 0; s2 < t.results.data.length && (i2.userStep({ data: t.results.data[s2], errors: t.results.errors, meta: t.results.meta }, n2), !r2); s2++)
                ;
              delete t.results;
            } else
              U(i2.userChunk) && (i2.userChunk(t.results, n2, t.file), delete t.results);
          }
          t.finished && !r2 && _(t.workerId, t.results);
        }
        function _(e, t) {
          var i2 = o[e];
          U(i2.userComplete) && i2.userComplete(t), i2.terminate(), delete o[e];
        }
        function m() {
          throw new Error("Not implemented.");
        }
        function w(e) {
          if (typeof e != "object" || e === null)
            return e;
          var t, i2 = Array.isArray(e) ? [] : {};
          for (t in e)
            i2[t] = w(e[t]);
          return i2;
        }
        function y(e, t) {
          return function() {
            e.apply(t, arguments);
          };
        }
        function U(e) {
          return typeof e == "function";
        }
        return v.parse = function(e, t) {
          var i2 = (t = t || {}).dynamicTyping || false;
          U(i2) && (t.dynamicTypingFunction = i2, i2 = {});
          if (t.dynamicTyping = i2, t.transform = !!U(t.transform) && t.transform, !t.worker || !v.WORKERS_SUPPORTED)
            return i2 = null, v.NODE_STREAM_INPUT, typeof e == "string" ? (e = ((e2) => e2.charCodeAt(0) !== 65279 ? e2 : e2.slice(1))(e), i2 = new (t.download ? f : c)(t)) : e.readable === true && U(e.read) && U(e.on) ? i2 = new p(t) : (n.File && e instanceof File || e instanceof Object) && (i2 = new l(t)), i2.stream(e);
          (i2 = (() => {
            var e2;
            return !!v.WORKERS_SUPPORTED && (e2 = (() => {
              var e3 = n.URL || n.webkitURL || null, t2 = r.toString();
              return v.BLOB_URL || (v.BLOB_URL = e3.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", t2, ")();"], { type: "text/javascript" })));
            })(), (e2 = new n.Worker(e2)).onmessage = g, e2.id = h++, o[e2.id] = e2);
          })()).userStep = t.step, i2.userChunk = t.chunk, i2.userComplete = t.complete, i2.userError = t.error, t.step = U(t.step), t.chunk = U(t.chunk), t.complete = U(t.complete), t.error = U(t.error), delete t.worker, i2.postMessage({ input: e, config: t, workerId: i2.id });
        }, v.unparse = function(e, t) {
          var n2 = false, _2 = true, m2 = ",", y2 = "\r\n", s2 = '"', a2 = s2 + s2, i2 = false, r2 = null, o2 = false, h2 = ((() => {
            if (typeof t == "object") {
              if (typeof t.delimiter != "string" || v.BAD_DELIMITERS.filter(function(e2) {
                return t.delimiter.indexOf(e2) !== -1;
              }).length || (m2 = t.delimiter), typeof t.quotes != "boolean" && typeof t.quotes != "function" && !Array.isArray(t.quotes) || (n2 = t.quotes), typeof t.skipEmptyLines != "boolean" && typeof t.skipEmptyLines != "string" || (i2 = t.skipEmptyLines), typeof t.newline == "string" && (y2 = t.newline), typeof t.quoteChar == "string" && (s2 = t.quoteChar), typeof t.header == "boolean" && (_2 = t.header), Array.isArray(t.columns)) {
                if (t.columns.length === 0)
                  throw new Error("Option columns is empty");
                r2 = t.columns;
              }
              t.escapeChar !== void 0 && (a2 = t.escapeChar + s2), t.escapeFormulae instanceof RegExp ? o2 = t.escapeFormulae : typeof t.escapeFormulae == "boolean" && t.escapeFormulae && (o2 = /^[=+\-@\t\r].*$/);
            }
          })(), new RegExp(P(s2), "g"));
          typeof e == "string" && (e = JSON.parse(e));
          if (Array.isArray(e)) {
            if (!e.length || Array.isArray(e[0]))
              return u2(null, e, i2);
            if (typeof e[0] == "object")
              return u2(r2 || Object.keys(e[0]), e, i2);
          } else if (typeof e == "object")
            return typeof e.data == "string" && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields || r2), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : typeof e.data[0] == "object" ? Object.keys(e.data[0]) : []), Array.isArray(e.data[0]) || typeof e.data[0] == "object" || (e.data = [e.data])), u2(e.fields || [], e.data || [], i2);
          throw new Error("Unable to serialize unrecognized input");
          function u2(e2, t2, i3) {
            var r3 = "", n3 = (typeof e2 == "string" && (e2 = JSON.parse(e2)), typeof t2 == "string" && (t2 = JSON.parse(t2)), Array.isArray(e2) && 0 < e2.length), s3 = !Array.isArray(t2[0]);
            if (n3 && _2) {
              for (var a3 = 0; a3 < e2.length; a3++)
                0 < a3 && (r3 += m2), r3 += k(e2[a3], a3);
              0 < t2.length && (r3 += y2);
            }
            for (var o3 = 0; o3 < t2.length; o3++) {
              var h3 = (n3 ? e2 : t2[o3]).length, u3 = false, d2 = n3 ? Object.keys(t2[o3]).length === 0 : t2[o3].length === 0;
              if (i3 && !n3 && (u3 = i3 === "greedy" ? t2[o3].join("").trim() === "" : t2[o3].length === 1 && t2[o3][0].length === 0), i3 === "greedy" && n3) {
                for (var f2 = [], l2 = 0; l2 < h3; l2++) {
                  var c2 = s3 ? e2[l2] : l2;
                  f2.push(t2[o3][c2]);
                }
                u3 = f2.join("").trim() === "";
              }
              if (!u3) {
                for (var p2 = 0; p2 < h3; p2++) {
                  0 < p2 && !d2 && (r3 += m2);
                  var g2 = n3 && s3 ? e2[p2] : p2;
                  r3 += k(t2[o3][g2], p2);
                }
                o3 < t2.length - 1 && (!i3 || 0 < h3 && !d2) && (r3 += y2);
              }
            }
            return r3;
          }
          function k(e2, t2) {
            var i3, r3;
            return e2 == null ? "" : e2.constructor === Date ? JSON.stringify(e2).slice(1, 25) : (r3 = false, o2 && typeof e2 == "string" && o2.test(e2) && (e2 = "'" + e2, r3 = true), i3 = e2.toString().replace(h2, a2), (r3 = r3 || n2 === true || typeof n2 == "function" && n2(e2, t2) || Array.isArray(n2) && n2[t2] || ((e3, t3) => {
              for (var i4 = 0; i4 < t3.length; i4++)
                if (-1 < e3.indexOf(t3[i4]))
                  return true;
              return false;
            })(i3, v.BAD_DELIMITERS) || -1 < i3.indexOf(m2) || i3.charAt(0) === " " || i3.charAt(i3.length - 1) === " ") ? s2 + i3 + s2 : i3);
          }
        }, v.RECORD_SEP = String.fromCharCode(30), v.UNIT_SEP = String.fromCharCode(31), v.BYTE_ORDER_MARK = "\uFEFF", v.BAD_DELIMITERS = ["\r", "\n", '"', v.BYTE_ORDER_MARK], v.WORKERS_SUPPORTED = !s && !!n.Worker, v.NODE_STREAM_INPUT = 1, v.LocalChunkSize = 10485760, v.RemoteChunkSize = 5242880, v.DefaultDelimiter = ",", v.Parser = E, v.ParserHandle = i, v.NetworkStreamer = f, v.FileStreamer = l, v.StringStreamer = c, v.ReadableStreamStreamer = p, n.jQuery && ((d = n.jQuery).fn.parse = function(o2) {
          var i2 = o2.config || {}, h2 = [];
          return this.each(function(e2) {
            if (!(d(this).prop("tagName").toUpperCase() === "INPUT" && d(this).attr("type").toLowerCase() === "file" && n.FileReader) || !this.files || this.files.length === 0)
              return true;
            for (var t = 0; t < this.files.length; t++)
              h2.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, i2) });
          }), e(), this;
          function e() {
            if (h2.length === 0)
              U(o2.complete) && o2.complete();
            else {
              var e2, t, i3, r2, n2 = h2[0];
              if (U(o2.before)) {
                var s2 = o2.before(n2.file, n2.inputElem);
                if (typeof s2 == "object") {
                  if (s2.action === "abort")
                    return e2 = "AbortError", t = n2.file, i3 = n2.inputElem, r2 = s2.reason, void (U(o2.error) && o2.error({ name: e2 }, t, i3, r2));
                  if (s2.action === "skip")
                    return void u2();
                  typeof s2.config == "object" && (n2.instanceConfig = d.extend(n2.instanceConfig, s2.config));
                } else if (s2 === "skip")
                  return void u2();
              }
              var a2 = n2.instanceConfig.complete;
              n2.instanceConfig.complete = function(e3) {
                U(a2) && a2(e3, n2.file, n2.inputElem), u2();
              }, v.parse(n2.file, n2.instanceConfig);
            }
          }
          function u2() {
            h2.splice(0, 1), e();
          }
        }), a && (n.onmessage = function(e) {
          e = e.data;
          v.WORKER_ID === void 0 && e && (v.WORKER_ID = e.workerId);
          typeof e.input == "string" ? n.postMessage({ workerId: v.WORKER_ID, results: v.parse(e.input, e.config), finished: true }) : (n.File && e.input instanceof File || e.input instanceof Object) && (e = v.parse(e.input, e.config)) && n.postMessage({ workerId: v.WORKER_ID, results: e, finished: true });
        }), (f.prototype = Object.create(u.prototype)).constructor = f, (l.prototype = Object.create(u.prototype)).constructor = l, (c.prototype = Object.create(c.prototype)).constructor = c, (p.prototype = Object.create(u.prototype)).constructor = p, v;
      });
    }
  });

  // node_modules/jszip/dist/jszip.min.js
  var require_jszip_min = __commonJS({
    "node_modules/jszip/dist/jszip.min.js"(exports, module) {
      !function(e) {
        if (typeof exports == "object" && typeof module != "undefined")
          module.exports = e();
        else if (typeof define == "function" && define.amd)
          define([], e);
        else {
          (typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this).JSZip = e();
        }
      }(function() {
        return function s(a, o, h) {
          function u(r, e2) {
            if (!o[r]) {
              if (!a[r]) {
                var t = typeof __require == "function" && __require;
                if (!e2 && t)
                  return t(r, true);
                if (l)
                  return l(r, true);
                var n = new Error("Cannot find module '" + r + "'");
                throw n.code = "MODULE_NOT_FOUND", n;
              }
              var i = o[r] = { exports: {} };
              a[r][0].call(i.exports, function(e3) {
                var t2 = a[r][1][e3];
                return u(t2 || e3);
              }, i, i.exports, s, a, o, h);
            }
            return o[r].exports;
          }
          for (var l = typeof __require == "function" && __require, e = 0; e < h.length; e++)
            u(h[e]);
          return u;
        }({ 1: [function(e, t, r) {
          "use strict";
          var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
          r.encode = function(e2) {
            for (var t2, r2, n, i, s, a, o, h = [], u = 0, l = e2.length, f = l, c2 = d.getTypeOf(e2) !== "string"; u < e2.length; )
              f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
            return h.join("");
          }, r.decode = function(e2) {
            var t2, r2, n, i, s, a, o = 0, h = 0, u = "data:";
            if (e2.substr(0, u.length) === u)
              throw new Error("Invalid base64 input, it looks like a data url.");
            var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
            if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0)
              throw new Error("Invalid base64 input, bad content length.");
            for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; )
              t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h++] = t2, s !== 64 && (l[h++] = r2), a !== 64 && (l[h++] = n);
            return l;
          };
        }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
          "use strict";
          var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
          function o(e2, t2, r2, n2, i2) {
            this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
          }
          o.prototype = { getContentWorker: function() {
            var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
            return e2.on("end", function() {
              if (this.streamInfo.data_length !== t2.uncompressedSize)
                throw new Error("Bug : uncompressed data size mismatch");
            }), e2;
          }, getCompressedWorker: function() {
            return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
          } }, o.createWorkerFrom = function(e2, t2, r2) {
            return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
          }, t.exports = o;
        }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
          "use strict";
          var n = e("./stream/GenericWorker");
          r.STORE = { magic: "\0\0", compressWorker: function() {
            return new n("STORE compression");
          }, uncompressWorker: function() {
            return new n("STORE decompression");
          } }, r.DEFLATE = e("./flate");
        }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
          "use strict";
          var n = e("./utils");
          var o = function() {
            for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
              e2 = r2;
              for (var n2 = 0; n2 < 8; n2++)
                e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r2] = e2;
            }
            return t2;
          }();
          t.exports = function(e2, t2) {
            return e2 !== void 0 && e2.length ? n.getTypeOf(e2) !== "string" ? function(e3, t3, r2, n2) {
              var i = o, s = n2 + r2;
              e3 ^= -1;
              for (var a = n2; a < s; a++)
                e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
              return -1 ^ e3;
            }(0 | t2, e2, e2.length, 0) : function(e3, t3, r2, n2) {
              var i = o, s = n2 + r2;
              e3 ^= -1;
              for (var a = n2; a < s; a++)
                e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
              return -1 ^ e3;
            }(0 | t2, e2, e2.length, 0) : 0;
          };
        }, { "./utils": 32 }], 5: [function(e, t, r) {
          "use strict";
          r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
        }, {}], 6: [function(e, t, r) {
          "use strict";
          var n = null;
          n = typeof Promise != "undefined" ? Promise : e("lie"), t.exports = { Promise: n };
        }, { lie: 37 }], 7: [function(e, t, r) {
          "use strict";
          var n = typeof Uint8Array != "undefined" && typeof Uint16Array != "undefined" && typeof Uint32Array != "undefined", i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
          function h(e2, t2) {
            a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
          }
          r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e2) {
            this.meta = e2.meta, this._pako === null && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
          }, h.prototype.flush = function() {
            a.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], true);
          }, h.prototype.cleanUp = function() {
            a.prototype.cleanUp.call(this), this._pako = null;
          }, h.prototype._createPako = function() {
            this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
            var t2 = this;
            this._pako.onData = function(e2) {
              t2.push({ data: e2, meta: t2.meta });
            };
          }, r.compressWorker = function(e2) {
            return new h("Deflate", e2);
          }, r.uncompressWorker = function() {
            return new h("Inflate", {});
          };
        }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
          "use strict";
          function A(e2, t2) {
            var r2, n2 = "";
            for (r2 = 0; r2 < t2; r2++)
              n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
            return n2;
          }
          function n(e2, t2, r2, n2, i2, s2) {
            var a, o, h = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
            t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
            var S = 0;
            t2 && (S |= 8), l || !_ && !g || (S |= 2048);
            var z = 0, C = 0;
            w && (z |= 16), i2 === "UNIX" ? (C = 798, z |= function(e3, t3) {
              var r3 = e3;
              return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
            }(h.unixPermissions, w)) : (C = 20, z |= function(e3) {
              return 63 & (e3 || 0);
            }(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
            var E = "";
            return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
          }
          var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
          function s(e2, t2, r2, n2) {
            i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
          }
          I.inherits(s, i), s.prototype.push = function(e2) {
            var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
            this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
          }, s.prototype.openedSource = function(e2) {
            this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
            var t2 = this.streamFiles && !e2.file.dir;
            if (t2) {
              var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
              this.push({ data: r2.fileRecord, meta: { percent: 0 } });
            } else
              this.accumulate = true;
          }, s.prototype.closedSource = function(e2) {
            this.accumulate = false;
            var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            if (this.dirRecords.push(r2.dirRecord), t2)
              this.push({ data: function(e3) {
                return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
              }(e2), meta: { percent: 100 } });
            else
              for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; )
                this.push(this.contentBuffer.shift());
            this.currentFile = null;
          }, s.prototype.flush = function() {
            for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++)
              this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
            var r2 = this.bytesWritten - e2, n2 = function(e3, t3, r3, n3, i2) {
              var s2 = I.transformTo("string", i2(n3));
              return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
            }(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
            this.push({ data: n2, meta: { percent: 100 } });
          }, s.prototype.prepareNextSource = function() {
            this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
          }, s.prototype.registerPrevious = function(e2) {
            this._sources.push(e2);
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
          }, s.prototype.error = function(e2) {
            var t2 = this._sources;
            if (!i.prototype.error.call(this, e2))
              return false;
            for (var r2 = 0; r2 < t2.length; r2++)
              try {
                t2[r2].error(e2);
              } catch (e3) {
              }
            return true;
          }, s.prototype.lock = function() {
            i.prototype.lock.call(this);
            for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++)
              e2[t2].lock();
          }, t.exports = s;
        }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
          "use strict";
          var u = e("../compressions"), n = e("./ZipFileWorker");
          r.generateWorker = function(e2, a, t2) {
            var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h = 0;
            try {
              e2.forEach(function(e3, t3) {
                h++;
                var r2 = function(e4, t4) {
                  var r3 = e4 || t4, n3 = u[r3];
                  if (!n3)
                    throw new Error(r3 + " is not a valid compression method !");
                  return n3;
                }(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
                t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
              }), o.entriesCount = h;
            } catch (e3) {
              o.error(e3);
            }
            return o;
          };
        }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
          "use strict";
          function n() {
            if (!(this instanceof n))
              return new n();
            if (arguments.length)
              throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
            this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
              var e2 = new n();
              for (var t2 in this)
                typeof this[t2] != "function" && (e2[t2] = this[t2]);
              return e2;
            };
          }
          (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(e2, t2) {
            return new n().loadAsync(e2, t2);
          }, n.external = e("./external"), t.exports = n;
        }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
          "use strict";
          var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
          function f(n2) {
            return new i.Promise(function(e2, t2) {
              var r2 = n2.decompressed.getContentWorker().pipe(new a());
              r2.on("error", function(e3) {
                t2(e3);
              }).on("end", function() {
                r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
              }).resume();
            });
          }
          t.exports = function(e2, o) {
            var h = this;
            return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
              var t2 = new s(o);
              return t2.load(e3), t2;
            }).then(function(e3) {
              var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
              if (o.checkCRC32)
                for (var n2 = 0; n2 < r2.length; n2++)
                  t2.push(f(r2[n2]));
              return i.Promise.all(t2);
            }).then(function(e3) {
              for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
                var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
                h.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h.file(a2).unsafeOriginalName = s2);
              }
              return t2.zipComment.length && (h.comment = t2.zipComment), h;
            });
          };
        }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("../stream/GenericWorker");
          function s(e2, t2) {
            i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
          }
          n.inherits(s, i), s.prototype._bindStream = function(e2) {
            var t2 = this;
            (this._stream = e2).pause(), e2.on("data", function(e3) {
              t2.push({ data: e3, meta: { percent: 0 } });
            }).on("error", function(e3) {
              t2.isPaused ? this.generatedError = e3 : t2.error(e3);
            }).on("end", function() {
              t2.isPaused ? t2._upstreamEnded = true : t2.end();
            });
          }, s.prototype.pause = function() {
            return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
          }, t.exports = s;
        }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
          "use strict";
          var i = e("readable-stream").Readable;
          function n(e2, t2, r2) {
            i.call(this, t2), this._helper = e2;
            var n2 = this;
            e2.on("data", function(e3, t3) {
              n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
            }).on("error", function(e3) {
              n2.emit("error", e3);
            }).on("end", function() {
              n2.push(null);
            });
          }
          e("../utils").inherits(n, i), n.prototype._read = function() {
            this._helper.resume();
          }, t.exports = n;
        }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
          "use strict";
          t.exports = { isNode: typeof Buffer != "undefined", newBufferFrom: function(e2, t2) {
            if (Buffer.from && Buffer.from !== Uint8Array.from)
              return Buffer.from(e2, t2);
            if (typeof e2 == "number")
              throw new Error('The "data" argument must not be a number');
            return new Buffer(e2, t2);
          }, allocBuffer: function(e2) {
            if (Buffer.alloc)
              return Buffer.alloc(e2);
            var t2 = new Buffer(e2);
            return t2.fill(0), t2;
          }, isBuffer: function(e2) {
            return Buffer.isBuffer(e2);
          }, isStream: function(e2) {
            return e2 && typeof e2.on == "function" && typeof e2.pause == "function" && typeof e2.resume == "function";
          } };
        }, {}], 15: [function(e, t, r) {
          "use strict";
          function s(e2, t2, r2) {
            var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
            s2.date = s2.date || new Date(), s2.compression !== null && (s2.compression = s2.compression.toUpperCase()), typeof s2.unixPermissions == "string" && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
            var a2 = i2 === "string" && s2.binary === false && s2.base64 === false;
            r2 && r2.binary !== void 0 || (s2.binary = !a2), (t2 instanceof c && t2.uncompressedSize === 0 || s2.dir || !t2 || t2.length === 0) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
            var o2 = null;
            o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
            var h2 = new d(e2, o2, s2);
            this.files[e2] = h2;
          }
          var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
            e2.slice(-1) === "/" && (e2 = e2.substring(0, e2.length - 1));
            var t2 = e2.lastIndexOf("/");
            return 0 < t2 ? e2.substring(0, t2) : "";
          }, g = function(e2) {
            return e2.slice(-1) !== "/" && (e2 += "/"), e2;
          }, b = function(e2, t2) {
            return t2 = t2 !== void 0 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
          };
          function h(e2) {
            return Object.prototype.toString.call(e2) === "[object RegExp]";
          }
          var n = { load: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, forEach: function(e2) {
            var t2, r2, n2;
            for (t2 in this.files)
              n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
          }, filter: function(r2) {
            var n2 = [];
            return this.forEach(function(e2, t2) {
              r2(e2, t2) && n2.push(t2);
            }), n2;
          }, file: function(e2, t2, r2) {
            if (arguments.length !== 1)
              return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
            if (h(e2)) {
              var n2 = e2;
              return this.filter(function(e3, t3) {
                return !t3.dir && n2.test(e3);
              });
            }
            var i2 = this.files[this.root + e2];
            return i2 && !i2.dir ? i2 : null;
          }, folder: function(r2) {
            if (!r2)
              return this;
            if (h(r2))
              return this.filter(function(e3, t3) {
                return t3.dir && r2.test(e3);
              });
            var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
            return n2.root = t2.name, n2;
          }, remove: function(r2) {
            r2 = this.root + r2;
            var e2 = this.files[r2];
            if (e2 || (r2.slice(-1) !== "/" && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir)
              delete this.files[r2];
            else
              for (var t2 = this.filter(function(e3, t3) {
                return t3.name.slice(0, r2.length) === r2;
              }), n2 = 0; n2 < t2.length; n2++)
                delete this.files[t2[n2].name];
            return this;
          }, generate: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, generateInternalStream: function(e2) {
            var t2, r2 = {};
            try {
              if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), r2.type === "binarystring" && (r2.type = "string"), !r2.type)
                throw new Error("No output type specified.");
              u.checkSupport(r2.type), r2.platform !== "darwin" && r2.platform !== "freebsd" && r2.platform !== "linux" && r2.platform !== "sunos" || (r2.platform = "UNIX"), r2.platform === "win32" && (r2.platform = "DOS");
              var n2 = r2.comment || this.comment || "";
              t2 = o.generateWorker(this, r2, n2);
            } catch (e3) {
              (t2 = new l("error")).error(e3);
            }
            return new a(t2, r2.type || "string", r2.mimeType);
          }, generateAsync: function(e2, t2) {
            return this.generateInternalStream(e2).accumulate(t2);
          }, generateNodeStream: function(e2, t2) {
            return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
          } };
          t.exports = n;
        }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
          "use strict";
          t.exports = e("stream");
        }, { stream: void 0 }], 17: [function(e, t, r) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
            for (var t2 = 0; t2 < this.data.length; t2++)
              e2[t2] = 255 & e2[t2];
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data[this.zero + e2];
          }, i.prototype.lastIndexOfSignature = function(e2) {
            for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s)
              if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2)
                return s - this.zero;
            return -1;
          }, i.prototype.readAndCheckSignature = function(e2) {
            var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
            return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
          }, i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), e2 === 0)
              return [];
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
          "use strict";
          var n = e("../utils");
          function i(e2) {
            this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
          }
          i.prototype = { checkOffset: function(e2) {
            this.checkIndex(this.index + e2);
          }, checkIndex: function(e2) {
            if (this.length < this.zero + e2 || e2 < 0)
              throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
          }, setIndex: function(e2) {
            this.checkIndex(e2), this.index = e2;
          }, skip: function(e2) {
            this.setIndex(this.index + e2);
          }, byteAt: function() {
          }, readInt: function(e2) {
            var t2, r2 = 0;
            for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--)
              r2 = (r2 << 8) + this.byteAt(t2);
            return this.index += e2, r2;
          }, readString: function(e2) {
            return n.transformTo("string", this.readData(e2));
          }, readData: function() {
          }, lastIndexOfSignature: function() {
          }, readAndCheckSignature: function() {
          }, readDate: function() {
            var e2 = this.readInt(4);
            return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
          } }, t.exports = i;
        }, { "../utils": 32 }], 19: [function(e, t, r) {
          "use strict";
          var n = e("./Uint8ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data.charCodeAt(this.zero + e2);
          }, i.prototype.lastIndexOfSignature = function(e2) {
            return this.data.lastIndexOf(e2) - this.zero;
          }, i.prototype.readAndCheckSignature = function(e2) {
            return e2 === this.readData(4);
          }, i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
          "use strict";
          var n = e("./ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), e2 === 0)
              return new Uint8Array(0);
            var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
          t.exports = function(e2) {
            var t2 = n.getTypeOf(e2);
            return n.checkSupport(t2), t2 !== "string" || i.uint8array ? t2 === "nodebuffer" ? new o(e2) : i.uint8array ? new h(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
          };
        }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
          "use strict";
          r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
        }, {}], 24: [function(e, t, r) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../utils");
          function s(e2) {
            n.call(this, "ConvertWorker to " + e2), this.destType = e2;
          }
          i.inherits(s, n), s.prototype.processChunk = function(e2) {
            this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../crc32");
          function s() {
            n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
          }
          e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
            this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
          }, t.exports = s;
        }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
          }
          n.inherits(s, i), s.prototype.processChunk = function(e2) {
            if (e2) {
              var t2 = this.streamInfo[this.propName] || 0;
              this.streamInfo[this.propName] = t2 + e2.data.length;
            }
            i.prototype.processChunk.call(this, e2);
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataWorker");
            var t2 = this;
            this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
              t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
            }, function(e3) {
              t2.error(e3);
            });
          }
          n.inherits(s, i), s.prototype.cleanUp = function() {
            i.prototype.cleanUp.call(this), this.data = null;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
          }, s.prototype._tickAndRepeat = function() {
            this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
          }, s.prototype._tick = function() {
            if (this.isPaused || this.isFinished)
              return false;
            var e2 = null, t2 = Math.min(this.max, this.index + 16384);
            if (this.index >= this.max)
              return this.end();
            switch (this.type) {
              case "string":
                e2 = this.data.substring(this.index, t2);
                break;
              case "uint8array":
                e2 = this.data.subarray(this.index, t2);
                break;
              case "array":
              case "nodebuffer":
                e2 = this.data.slice(this.index, t2);
            }
            return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
          "use strict";
          function n(e2) {
            this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
          }
          n.prototype = { push: function(e2) {
            this.emit("data", e2);
          }, end: function() {
            if (this.isFinished)
              return false;
            this.flush();
            try {
              this.emit("end"), this.cleanUp(), this.isFinished = true;
            } catch (e2) {
              this.emit("error", e2);
            }
            return true;
          }, error: function(e2) {
            return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
          }, on: function(e2, t2) {
            return this._listeners[e2].push(t2), this;
          }, cleanUp: function() {
            this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
          }, emit: function(e2, t2) {
            if (this._listeners[e2])
              for (var r2 = 0; r2 < this._listeners[e2].length; r2++)
                this._listeners[e2][r2].call(this, t2);
          }, pipe: function(e2) {
            return e2.registerPrevious(this);
          }, registerPrevious: function(e2) {
            if (this.isLocked)
              throw new Error("The stream '" + this + "' has already been used.");
            this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, pause: function() {
            return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
          }, resume: function() {
            if (!this.isPaused || this.isFinished)
              return false;
            var e2 = this.isPaused = false;
            return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
          }, flush: function() {
          }, processChunk: function(e2) {
            this.push(e2);
          }, withStreamInfo: function(e2, t2) {
            return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
          }, mergeStreamInfo: function() {
            for (var e2 in this.extraStreamInfo)
              Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
          }, lock: function() {
            if (this.isLocked)
              throw new Error("The stream '" + this + "' has already been used.");
            this.isLocked = true, this.previous && this.previous.lock();
          }, toString: function() {
            var e2 = "Worker " + this.name;
            return this.previous ? this.previous + " -> " + e2 : e2;
          } }, t.exports = n;
        }, {}], 29: [function(e, t, r) {
          "use strict";
          var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
          if (n.nodestream)
            try {
              o = e("../nodejs/NodejsStreamOutputAdapter");
            } catch (e2) {
            }
          function l(e2, o2) {
            return new a.Promise(function(t2, r2) {
              var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
              e2.on("data", function(e3, t3) {
                n2.push(e3), o2 && o2(t3);
              }).on("error", function(e3) {
                n2 = [], r2(e3);
              }).on("end", function() {
                try {
                  var e3 = function(e4, t3, r3) {
                    switch (e4) {
                      case "blob":
                        return h.newBlob(h.transformTo("arraybuffer", t3), r3);
                      case "base64":
                        return u.encode(t3);
                      default:
                        return h.transformTo(e4, t3);
                    }
                  }(s2, function(e4, t3) {
                    var r3, n3 = 0, i3 = null, s3 = 0;
                    for (r3 = 0; r3 < t3.length; r3++)
                      s3 += t3[r3].length;
                    switch (e4) {
                      case "string":
                        return t3.join("");
                      case "array":
                        return Array.prototype.concat.apply([], t3);
                      case "uint8array":
                        for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++)
                          i3.set(t3[r3], n3), n3 += t3[r3].length;
                        return i3;
                      case "nodebuffer":
                        return Buffer.concat(t3);
                      default:
                        throw new Error("concat : unsupported type '" + e4 + "'");
                    }
                  }(i2, n2), a2);
                  t2(e3);
                } catch (e4) {
                  r2(e4);
                }
                n2 = [];
              }).resume();
            });
          }
          function f(e2, t2, r2) {
            var n2 = t2;
            switch (t2) {
              case "blob":
              case "arraybuffer":
                n2 = "uint8array";
                break;
              case "base64":
                n2 = "string";
            }
            try {
              this._internalType = n2, this._outputType = t2, this._mimeType = r2, h.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
            } catch (e3) {
              this._worker = new s("error"), this._worker.error(e3);
            }
          }
          f.prototype = { accumulate: function(e2) {
            return l(this, e2);
          }, on: function(e2, t2) {
            var r2 = this;
            return e2 === "data" ? this._worker.on(e2, function(e3) {
              t2.call(r2, e3.data, e3.meta);
            }) : this._worker.on(e2, function() {
              h.delay(t2, arguments, r2);
            }), this;
          }, resume: function() {
            return h.delay(this._worker.resume, [], this._worker), this;
          }, pause: function() {
            return this._worker.pause(), this;
          }, toNodejsStream: function(e2) {
            if (h.checkSupport("nodestream"), this._outputType !== "nodebuffer")
              throw new Error(this._outputType + " is not supported by this method");
            return new o(this, { objectMode: this._outputType !== "nodebuffer" }, e2);
          } }, t.exports = f;
        }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
          "use strict";
          if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = typeof ArrayBuffer != "undefined" && typeof Uint8Array != "undefined", r.nodebuffer = typeof Buffer != "undefined", r.uint8array = typeof Uint8Array != "undefined", typeof ArrayBuffer == "undefined")
            r.blob = false;
          else {
            var n = new ArrayBuffer(0);
            try {
              r.blob = new Blob([n], { type: "application/zip" }).size === 0;
            } catch (e2) {
              try {
                var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                i.append(n), r.blob = i.getBlob("application/zip").size === 0;
              } catch (e3) {
                r.blob = false;
              }
            }
          }
          try {
            r.nodestream = !!e("readable-stream").Readable;
          } catch (e2) {
            r.nodestream = false;
          }
        }, { "readable-stream": 16 }], 31: [function(e, t, s) {
          "use strict";
          for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++)
            u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
          u[254] = u[254] = 1;
          function a() {
            n.call(this, "utf-8 decode"), this.leftOver = null;
          }
          function l() {
            n.call(this, "utf-8 encode");
          }
          s.utf8encode = function(e2) {
            return h.nodebuffer ? r.newBufferFrom(e2, "utf-8") : function(e3) {
              var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
              for (i2 = 0; i2 < a2; i2++)
                (64512 & (r2 = e3.charCodeAt(i2))) == 55296 && i2 + 1 < a2 && (64512 & (n2 = e3.charCodeAt(i2 + 1))) == 56320 && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
              for (t2 = h.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++)
                (64512 & (r2 = e3.charCodeAt(i2))) == 55296 && i2 + 1 < a2 && (64512 & (n2 = e3.charCodeAt(i2 + 1))) == 56320 && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
              return t2;
            }(e2);
          }, s.utf8decode = function(e2) {
            return h.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : function(e3) {
              var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
              for (t2 = r2 = 0; t2 < s2; )
                if ((n2 = e3[t2++]) < 128)
                  a2[r2++] = n2;
                else if (4 < (i2 = u[n2]))
                  a2[r2++] = 65533, t2 += i2 - 1;
                else {
                  for (n2 &= i2 === 2 ? 31 : i2 === 3 ? 15 : 7; 1 < i2 && t2 < s2; )
                    n2 = n2 << 6 | 63 & e3[t2++], i2--;
                  1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
                }
              return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
            }(e2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2));
          }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
            var t2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2.data);
            if (this.leftOver && this.leftOver.length) {
              if (h.uint8array) {
                var r2 = t2;
                (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
              } else
                t2 = this.leftOver.concat(t2);
              this.leftOver = null;
            }
            var n2 = function(e3, t3) {
              var r3;
              for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && (192 & e3[r3]) == 128; )
                r3--;
              return r3 < 0 ? t3 : r3 === 0 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
            }(t2), i2 = t2;
            n2 !== t2.length && (h.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
          }, a.prototype.flush = function() {
            this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
          }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
            this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
          }, s.Utf8EncodeWorker = l;
        }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
          "use strict";
          var o = e("./support"), h = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
          function n(e2) {
            return e2;
          }
          function l(e2, t2) {
            for (var r2 = 0; r2 < e2.length; ++r2)
              t2[r2] = 255 & e2.charCodeAt(r2);
            return t2;
          }
          e("setimmediate"), a.newBlob = function(t2, r2) {
            a.checkSupport("blob");
            try {
              return new Blob([t2], { type: r2 });
            } catch (e2) {
              try {
                var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                return n2.append(t2), n2.getBlob(r2);
              } catch (e3) {
                throw new Error("Bug : can't construct the Blob.");
              }
            }
          };
          var i = { stringifyByChunk: function(e2, t2, r2) {
            var n2 = [], i2 = 0, s2 = e2.length;
            if (s2 <= r2)
              return String.fromCharCode.apply(null, e2);
            for (; i2 < s2; )
              t2 === "array" || t2 === "nodebuffer" ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
            return n2.join("");
          }, stringifyByChar: function(e2) {
            for (var t2 = "", r2 = 0; r2 < e2.length; r2++)
              t2 += String.fromCharCode(e2[r2]);
            return t2;
          }, applyCanBeUsed: { uint8array: function() {
            try {
              return o.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
            } catch (e2) {
              return false;
            }
          }(), nodebuffer: function() {
            try {
              return o.nodebuffer && String.fromCharCode.apply(null, r.allocBuffer(1)).length === 1;
            } catch (e2) {
              return false;
            }
          }() } };
          function s(e2) {
            var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
            if (r2 === "uint8array" ? n2 = i.applyCanBeUsed.uint8array : r2 === "nodebuffer" && (n2 = i.applyCanBeUsed.nodebuffer), n2)
              for (; 1 < t2; )
                try {
                  return i.stringifyByChunk(e2, r2, t2);
                } catch (e3) {
                  t2 = Math.floor(t2 / 2);
                }
            return i.stringifyByChar(e2);
          }
          function f(e2, t2) {
            for (var r2 = 0; r2 < e2.length; r2++)
              t2[r2] = e2[r2];
            return t2;
          }
          a.applyFromCharCode = s;
          var c = {};
          c.string = { string: n, array: function(e2) {
            return l(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.string.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return l(e2, new Uint8Array(e2.length));
          }, nodebuffer: function(e2) {
            return l(e2, r.allocBuffer(e2.length));
          } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
            return new Uint8Array(e2).buffer;
          }, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r.newBufferFrom(e2);
          } }, c.arraybuffer = { string: function(e2) {
            return s(new Uint8Array(e2));
          }, array: function(e2) {
            return f(new Uint8Array(e2), new Array(e2.byteLength));
          }, arraybuffer: n, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r.newBufferFrom(new Uint8Array(e2));
          } }, c.uint8array = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return e2.buffer;
          }, uint8array: n, nodebuffer: function(e2) {
            return r.newBufferFrom(e2);
          } }, c.nodebuffer = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.nodebuffer.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return f(e2, new Uint8Array(e2.length));
          }, nodebuffer: n }, a.transformTo = function(e2, t2) {
            if (t2 = t2 || "", !e2)
              return t2;
            a.checkSupport(e2);
            var r2 = a.getTypeOf(t2);
            return c[r2][e2](t2);
          }, a.resolve = function(e2) {
            for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
              var i2 = t2[n2];
              i2 === "." || i2 === "" && n2 !== 0 && n2 !== t2.length - 1 || (i2 === ".." ? r2.pop() : r2.push(i2));
            }
            return r2.join("/");
          }, a.getTypeOf = function(e2) {
            return typeof e2 == "string" ? "string" : Object.prototype.toString.call(e2) === "[object Array]" ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && e2 instanceof Uint8Array ? "uint8array" : o.arraybuffer && e2 instanceof ArrayBuffer ? "arraybuffer" : void 0;
          }, a.checkSupport = function(e2) {
            if (!o[e2.toLowerCase()])
              throw new Error(e2 + " is not supported by this platform");
          }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
            var t2, r2, n2 = "";
            for (r2 = 0; r2 < (e2 || "").length; r2++)
              n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
            return n2;
          }, a.delay = function(e2, t2, r2) {
            setImmediate(function() {
              e2.apply(r2 || null, t2 || []);
            });
          }, a.inherits = function(e2, t2) {
            function r2() {
            }
            r2.prototype = t2.prototype, e2.prototype = new r2();
          }, a.extend = function() {
            var e2, t2, r2 = {};
            for (e2 = 0; e2 < arguments.length; e2++)
              for (t2 in arguments[e2])
                Object.prototype.hasOwnProperty.call(arguments[e2], t2) && r2[t2] === void 0 && (r2[t2] = arguments[e2][t2]);
            return r2;
          }, a.prepareContent = function(r2, e2, n2, i2, s2) {
            return u.Promise.resolve(e2).then(function(n3) {
              return o.blob && (n3 instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3)) !== -1) && typeof FileReader != "undefined" ? new u.Promise(function(t2, r3) {
                var e3 = new FileReader();
                e3.onload = function(e4) {
                  t2(e4.target.result);
                }, e3.onerror = function(e4) {
                  r3(e4.target.error);
                }, e3.readAsArrayBuffer(n3);
              }) : n3;
            }).then(function(e3) {
              var t2 = a.getTypeOf(e3);
              return t2 ? (t2 === "arraybuffer" ? e3 = a.transformTo("uint8array", e3) : t2 === "string" && (s2 ? e3 = h.decode(e3) : n2 && i2 !== true && (e3 = function(e4) {
                return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
              }(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
            });
          };
        }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
          "use strict";
          var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
          function h(e2) {
            this.files = [], this.loadOptions = e2;
          }
          h.prototype = { checkSignature: function(e2) {
            if (!this.reader.readAndCheckSignature(e2)) {
              this.reader.index -= 4;
              var t2 = this.reader.readString(4);
              throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
            }
          }, isSignature: function(e2, t2) {
            var r2 = this.reader.index;
            this.reader.setIndex(e2);
            var n2 = this.reader.readString(4) === t2;
            return this.reader.setIndex(r2), n2;
          }, readBlockEndOfCentral: function() {
            this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
            var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
            this.zipComment = this.loadOptions.decodeFileName(r2);
          }, readBlockZip64EndOfCentral: function() {
            this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
            for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; )
              e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
          }, readBlockZip64EndOfCentralLocator: function() {
            if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount)
              throw new Error("Multi-volumes zip are not supported");
          }, readLocalFiles: function() {
            var e2, t2;
            for (e2 = 0; e2 < this.files.length; e2++)
              t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
          }, readCentralDir: function() {
            var e2;
            for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); )
              (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
            if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0)
              throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
          }, readEndOfCentral: function() {
            var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
            if (e2 < 0)
              throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
            this.reader.setIndex(e2);
            var t2 = e2;
            if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
              if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0)
                throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
              if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0))
                throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
              this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
            }
            var r2 = this.centralDirOffset + this.centralDirSize;
            this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
            var n2 = t2 - r2;
            if (0 < n2)
              this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
            else if (n2 < 0)
              throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
          }, prepareReader: function(e2) {
            this.reader = n(e2);
          }, load: function(e2) {
            this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
          } }, t.exports = h;
        }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
          "use strict";
          var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
          function l(e2, t2) {
            this.options = e2, this.loadOptions = t2;
          }
          l.prototype = { isEncrypted: function() {
            return (1 & this.bitFlag) == 1;
          }, useUTF8: function() {
            return (2048 & this.bitFlag) == 2048;
          }, readLocalPart: function(e2) {
            var t2, r2;
            if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), this.compressedSize === -1 || this.uncompressedSize === -1)
              throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
            if ((t2 = function(e3) {
              for (var t3 in h)
                if (Object.prototype.hasOwnProperty.call(h, t3) && h[t3].magic === e3)
                  return h[t3];
              return null;
            }(this.compressionMethod)) === null)
              throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
            this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
          }, readCentralPart: function(e2) {
            this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
            var t2 = e2.readInt(2);
            if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted())
              throw new Error("Encrypted zip are not supported");
            e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
          }, processAttributes: function() {
            this.unixPermissions = null, this.dosPermissions = null;
            var e2 = this.versionMadeBy >> 8;
            this.dir = !!(16 & this.externalFileAttributes), e2 == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), e2 == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = true);
          }, parseZIP64ExtraField: function() {
            if (this.extraFields[1]) {
              var e2 = n(this.extraFields[1].value);
              this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
            }
          }, readExtraFields: function(e2) {
            var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
            for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; )
              t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
            e2.setIndex(i2);
          }, handleUTF8: function() {
            var e2 = u.uint8array ? "uint8array" : "array";
            if (this.useUTF8())
              this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
            else {
              var t2 = this.findExtraFieldUnicodePath();
              if (t2 !== null)
                this.fileNameStr = t2;
              else {
                var r2 = s.transformTo(e2, this.fileName);
                this.fileNameStr = this.loadOptions.decodeFileName(r2);
              }
              var n2 = this.findExtraFieldUnicodeComment();
              if (n2 !== null)
                this.fileCommentStr = n2;
              else {
                var i2 = s.transformTo(e2, this.fileComment);
                this.fileCommentStr = this.loadOptions.decodeFileName(i2);
              }
            }
          }, findExtraFieldUnicodePath: function() {
            var e2 = this.extraFields[28789];
            if (e2) {
              var t2 = n(e2.value);
              return t2.readInt(1) !== 1 ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          }, findExtraFieldUnicodeComment: function() {
            var e2 = this.extraFields[25461];
            if (e2) {
              var t2 = n(e2.value);
              return t2.readInt(1) !== 1 ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          } }, t.exports = l;
        }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
          "use strict";
          function n(e2, t2, r2) {
            this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
          }
          var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
          n.prototype = { internalStream: function(e2) {
            var t2 = null, r2 = "string";
            try {
              if (!e2)
                throw new Error("No output type specified.");
              var n2 = (r2 = e2.toLowerCase()) === "string" || r2 === "text";
              r2 !== "binarystring" && r2 !== "text" || (r2 = "string"), t2 = this._decompressWorker();
              var i2 = !this._dataBinary;
              i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
            } catch (e3) {
              (t2 = new h("error")).error(e3);
            }
            return new s(t2, r2, "");
          }, async: function(e2, t2) {
            return this.internalStream(e2).accumulate(t2);
          }, nodeStream: function(e2, t2) {
            return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
          }, _compressWorker: function(e2, t2) {
            if (this._data instanceof o && this._data.compression.magic === e2.magic)
              return this._data.getCompressedWorker();
            var r2 = this._decompressWorker();
            return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
          }, _decompressWorker: function() {
            return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
          } };
          for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, f = 0; f < u.length; f++)
            n.prototype[u[f]] = l;
          t.exports = n;
        }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
          (function(t2) {
            "use strict";
            var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
            if (e2) {
              var i = 0, s = new e2(u), a = t2.document.createTextNode("");
              s.observe(a, { characterData: true }), r = function() {
                a.data = i = ++i % 2;
              };
            } else if (t2.setImmediate || t2.MessageChannel === void 0)
              r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
                var e3 = t2.document.createElement("script");
                e3.onreadystatechange = function() {
                  u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
                }, t2.document.documentElement.appendChild(e3);
              } : function() {
                setTimeout(u, 0);
              };
            else {
              var o = new t2.MessageChannel();
              o.port1.onmessage = u, r = function() {
                o.port2.postMessage(0);
              };
            }
            var h = [];
            function u() {
              var e3, t3;
              n = true;
              for (var r2 = h.length; r2; ) {
                for (t3 = h, h = [], e3 = -1; ++e3 < r2; )
                  t3[e3]();
                r2 = h.length;
              }
              n = false;
            }
            l.exports = function(e3) {
              h.push(e3) !== 1 || n || r();
            };
          }).call(this, typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
        }, {}], 37: [function(e, t, r) {
          "use strict";
          var i = e("immediate");
          function u() {
          }
          var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
          function o(e2) {
            if (typeof e2 != "function")
              throw new TypeError("resolver must be a function");
            this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
          }
          function h(e2, t2, r2) {
            this.promise = e2, typeof t2 == "function" && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), typeof r2 == "function" && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
          }
          function f(t2, r2, n2) {
            i(function() {
              var e2;
              try {
                e2 = r2(n2);
              } catch (e3) {
                return l.reject(t2, e3);
              }
              e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
            });
          }
          function c(e2) {
            var t2 = e2 && e2.then;
            if (e2 && (typeof e2 == "object" || typeof e2 == "function") && typeof t2 == "function")
              return function() {
                t2.apply(e2, arguments);
              };
          }
          function d(t2, e2) {
            var r2 = false;
            function n2(e3) {
              r2 || (r2 = true, l.reject(t2, e3));
            }
            function i2(e3) {
              r2 || (r2 = true, l.resolve(t2, e3));
            }
            var s2 = p(function() {
              e2(i2, n2);
            });
            s2.status === "error" && n2(s2.value);
          }
          function p(e2, t2) {
            var r2 = {};
            try {
              r2.value = e2(t2), r2.status = "success";
            } catch (e3) {
              r2.status = "error", r2.value = e3;
            }
            return r2;
          }
          (t.exports = o).prototype.finally = function(t2) {
            if (typeof t2 != "function")
              return this;
            var r2 = this.constructor;
            return this.then(function(e2) {
              return r2.resolve(t2()).then(function() {
                return e2;
              });
            }, function(e2) {
              return r2.resolve(t2()).then(function() {
                throw e2;
              });
            });
          }, o.prototype.catch = function(e2) {
            return this.then(null, e2);
          }, o.prototype.then = function(e2, t2) {
            if (typeof e2 != "function" && this.state === a || typeof t2 != "function" && this.state === s)
              return this;
            var r2 = new this.constructor(u);
            this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h(r2, e2, t2));
            return r2;
          }, h.prototype.callFulfilled = function(e2) {
            l.resolve(this.promise, e2);
          }, h.prototype.otherCallFulfilled = function(e2) {
            f(this.promise, this.onFulfilled, e2);
          }, h.prototype.callRejected = function(e2) {
            l.reject(this.promise, e2);
          }, h.prototype.otherCallRejected = function(e2) {
            f(this.promise, this.onRejected, e2);
          }, l.resolve = function(e2, t2) {
            var r2 = p(c, t2);
            if (r2.status === "error")
              return l.reject(e2, r2.value);
            var n2 = r2.value;
            if (n2)
              d(e2, n2);
            else {
              e2.state = a, e2.outcome = t2;
              for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; )
                e2.queue[i2].callFulfilled(t2);
            }
            return e2;
          }, l.reject = function(e2, t2) {
            e2.state = s, e2.outcome = t2;
            for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; )
              e2.queue[r2].callRejected(t2);
            return e2;
          }, o.resolve = function(e2) {
            if (e2 instanceof this)
              return e2;
            return l.resolve(new this(u), e2);
          }, o.reject = function(e2) {
            var t2 = new this(u);
            return l.reject(t2, e2);
          }, o.all = function(e2) {
            var r2 = this;
            if (Object.prototype.toString.call(e2) !== "[object Array]")
              return this.reject(new TypeError("must be an array"));
            var n2 = e2.length, i2 = false;
            if (!n2)
              return this.resolve([]);
            var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
            for (; ++t2 < n2; )
              h2(e2[t2], t2);
            return o2;
            function h2(e3, t3) {
              r2.resolve(e3).then(function(e4) {
                s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
              }, function(e4) {
                i2 || (i2 = true, l.reject(o2, e4));
              });
            }
          }, o.race = function(e2) {
            var t2 = this;
            if (Object.prototype.toString.call(e2) !== "[object Array]")
              return this.reject(new TypeError("must be an array"));
            var r2 = e2.length, n2 = false;
            if (!r2)
              return this.resolve([]);
            var i2 = -1, s2 = new this(u);
            for (; ++i2 < r2; )
              a2 = e2[i2], t2.resolve(a2).then(function(e3) {
                n2 || (n2 = true, l.resolve(s2, e3));
              }, function(e3) {
                n2 || (n2 = true, l.reject(s2, e3));
              });
            var a2;
            return s2;
          };
        }, { immediate: 36 }], 38: [function(e, t, r) {
          "use strict";
          var n = {};
          (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
        }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
          "use strict";
          var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
          function p(e2) {
            if (!(this instanceof p))
              return new p(e2);
            this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
            var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
            if (r2 !== l)
              throw new Error(i[r2]);
            if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
              var n2;
              if (n2 = typeof t2.dictionary == "string" ? h.string2buf(t2.dictionary) : u.call(t2.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l)
                throw new Error(i[r2]);
              this._dict_set = true;
            }
          }
          function n(e2, t2) {
            var r2 = new p(t2);
            if (r2.push(e2, true), r2.err)
              throw r2.msg || i[r2.err];
            return r2.result;
          }
          p.prototype.push = function(e2, t2) {
            var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
            if (this.ended)
              return false;
            n2 = t2 === ~~t2 ? t2 : t2 === true ? 4 : 0, typeof e2 == "string" ? i2.input = h.string2buf(e2) : u.call(e2) === "[object ArrayBuffer]" ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
            do {
              if (i2.avail_out === 0 && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), (r2 = a.deflate(i2, n2)) !== 1 && r2 !== l)
                return this.onEnd(r2), !(this.ended = true);
              i2.avail_out !== 0 && (i2.avail_in !== 0 || n2 !== 4 && n2 !== 2) || (this.options.to === "string" ? this.onData(h.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
            } while ((0 < i2.avail_in || i2.avail_out === 0) && r2 !== 1);
            return n2 === 4 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : n2 !== 2 || (this.onEnd(l), !(i2.avail_out = 0));
          }, p.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, p.prototype.onEnd = function(e2) {
            e2 === l && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, n(e2, t2);
          }, r.gzip = function(e2, t2) {
            return (t2 = t2 || {}).gzip = true, n(e2, t2);
          };
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
          "use strict";
          var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
          function a(e2) {
            if (!(this instanceof a))
              return new a(e2);
            this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, t2.windowBits === 0 && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && (15 & t2.windowBits) == 0 && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
            var r2 = c.inflateInit2(this.strm, t2.windowBits);
            if (r2 !== m.Z_OK)
              throw new Error(n[r2]);
            this.header = new s(), c.inflateGetHeader(this.strm, this.header);
          }
          function o(e2, t2) {
            var r2 = new a(t2);
            if (r2.push(e2, true), r2.err)
              throw r2.msg || n[r2.err];
            return r2.result;
          }
          a.prototype.push = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
            if (this.ended)
              return false;
            n2 = t2 === ~~t2 ? t2 : t2 === true ? m.Z_FINISH : m.Z_NO_FLUSH, typeof e2 == "string" ? h.input = p.binstring2buf(e2) : _.call(e2) === "[object ArrayBuffer]" ? h.input = new Uint8Array(e2) : h.input = e2, h.next_in = 0, h.avail_in = h.input.length;
            do {
              if (h.avail_out === 0 && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r2 = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = typeof l == "string" ? p.string2buf(l) : _.call(l) === "[object ArrayBuffer]" ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && f === true && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK)
                return this.onEnd(r2), !(this.ended = true);
              h.next_out && (h.avail_out !== 0 && r2 !== m.Z_STREAM_END && (h.avail_in !== 0 || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || (this.options.to === "string" ? (i2 = p.utf8border(h.output, h.next_out), s2 = h.next_out - i2, a2 = p.buf2string(h.output, i2), h.next_out = s2, h.avail_out = u - s2, s2 && d.arraySet(h.output, h.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), h.avail_in === 0 && h.avail_out === 0 && (f = true);
            } while ((0 < h.avail_in || h.avail_out === 0) && r2 !== m.Z_STREAM_END);
            return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
          }, a.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, a.prototype.onEnd = function(e2) {
            e2 === m.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, o(e2, t2);
          }, r.ungzip = o;
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
          "use strict";
          var n = typeof Uint8Array != "undefined" && typeof Uint16Array != "undefined" && typeof Int32Array != "undefined";
          r.assign = function(e2) {
            for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
              var r2 = t2.shift();
              if (r2) {
                if (typeof r2 != "object")
                  throw new TypeError(r2 + "must be non-object");
                for (var n2 in r2)
                  r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
              }
            }
            return e2;
          }, r.shrinkBuf = function(e2, t2) {
            return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
          };
          var i = { arraySet: function(e2, t2, r2, n2, i2) {
            if (t2.subarray && e2.subarray)
              e2.set(t2.subarray(r2, r2 + n2), i2);
            else
              for (var s2 = 0; s2 < n2; s2++)
                e2[i2 + s2] = t2[r2 + s2];
          }, flattenChunks: function(e2) {
            var t2, r2, n2, i2, s2, a;
            for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++)
              n2 += e2[t2].length;
            for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++)
              s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
            return a;
          } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
            for (var s2 = 0; s2 < n2; s2++)
              e2[i2 + s2] = t2[r2 + s2];
          }, flattenChunks: function(e2) {
            return [].concat.apply([], e2);
          } };
          r.setTyped = function(e2) {
            e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
          }, r.setTyped(n);
        }, {}], 42: [function(e, t, r) {
          "use strict";
          var h = e("./common"), i = true, s = true;
          try {
            String.fromCharCode.apply(null, [0]);
          } catch (e2) {
            i = false;
          }
          try {
            String.fromCharCode.apply(null, new Uint8Array(1));
          } catch (e2) {
            s = false;
          }
          for (var u = new h.Buf8(256), n = 0; n < 256; n++)
            u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
          function l(e2, t2) {
            if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i))
              return String.fromCharCode.apply(null, h.shrinkBuf(e2, t2));
            for (var r2 = "", n2 = 0; n2 < t2; n2++)
              r2 += String.fromCharCode(e2[n2]);
            return r2;
          }
          u[254] = u[254] = 1, r.string2buf = function(e2) {
            var t2, r2, n2, i2, s2, a = e2.length, o = 0;
            for (i2 = 0; i2 < a; i2++)
              (64512 & (r2 = e2.charCodeAt(i2))) == 55296 && i2 + 1 < a && (64512 & (n2 = e2.charCodeAt(i2 + 1))) == 56320 && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
            for (t2 = new h.Buf8(o), i2 = s2 = 0; s2 < o; i2++)
              (64512 & (r2 = e2.charCodeAt(i2))) == 55296 && i2 + 1 < a && (64512 & (n2 = e2.charCodeAt(i2 + 1))) == 56320 && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
            return t2;
          }, r.buf2binstring = function(e2) {
            return l(e2, e2.length);
          }, r.binstring2buf = function(e2) {
            for (var t2 = new h.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++)
              t2[r2] = e2.charCodeAt(r2);
            return t2;
          }, r.buf2string = function(e2, t2) {
            var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
            for (r2 = n2 = 0; r2 < a; )
              if ((i2 = e2[r2++]) < 128)
                o[n2++] = i2;
              else if (4 < (s2 = u[i2]))
                o[n2++] = 65533, r2 += s2 - 1;
              else {
                for (i2 &= s2 === 2 ? 31 : s2 === 3 ? 15 : 7; 1 < s2 && r2 < a; )
                  i2 = i2 << 6 | 63 & e2[r2++], s2--;
                1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
              }
            return l(o, n2);
          }, r.utf8border = function(e2, t2) {
            var r2;
            for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && (192 & e2[r2]) == 128; )
              r2--;
            return r2 < 0 ? t2 : r2 === 0 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
          };
        }, { "./common": 41 }], 43: [function(e, t, r) {
          "use strict";
          t.exports = function(e2, t2, r2, n) {
            for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; r2 !== 0; ) {
              for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; )
                ;
              i %= 65521, s %= 65521;
            }
            return i | s << 16 | 0;
          };
        }, {}], 44: [function(e, t, r) {
          "use strict";
          t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
        }, {}], 45: [function(e, t, r) {
          "use strict";
          var o = function() {
            for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
              e2 = r2;
              for (var n = 0; n < 8; n++)
                e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r2] = e2;
            }
            return t2;
          }();
          t.exports = function(e2, t2, r2, n) {
            var i = o, s = n + r2;
            e2 ^= -1;
            for (var a = n; a < s; a++)
              e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
            return -1 ^ e2;
          };
        }, {}], 46: [function(e, t, r) {
          "use strict";
          var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
          function R(e2, t2) {
            return e2.msg = n[t2], t2;
          }
          function T(e2) {
            return (e2 << 1) - (4 < e2 ? 9 : 0);
          }
          function D(e2) {
            for (var t2 = e2.length; 0 <= --t2; )
              e2[t2] = 0;
          }
          function F(e2) {
            var t2 = e2.state, r2 = t2.pending;
            r2 > e2.avail_out && (r2 = e2.avail_out), r2 !== 0 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, t2.pending === 0 && (t2.pending_out = 0));
          }
          function N(e2, t2) {
            u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F(e2.strm);
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = t2;
          }
          function P(e2, t2) {
            e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
          }
          function L(e2, t2) {
            var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h2 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
            e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
            do {
              if (u2[(r2 = t2) + a2] === p2 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
                s2 += 2, r2++;
                do {
                } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
                if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
                  if (e2.match_start = t2, o2 <= (a2 = n2))
                    break;
                  d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
                }
              }
            } while ((t2 = f2[t2 & l2]) > h2 && --i2 != 0);
            return a2 <= e2.lookahead ? a2 : e2.lookahead;
          }
          function j(e2) {
            var t2, r2, n2, i2, s2, a2, o2, h2, u2, l2, f2 = e2.w_size;
            do {
              if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
                for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; )
                  ;
                for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; )
                  ;
                i2 += f2;
              }
              if (e2.strm.avail_in === 0)
                break;
              if (a2 = e2.strm, o2 = e2.window, h2 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = l2 === 0 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h2), a2.state.wrap === 1 ? a2.adler = d(a2.adler, o2, l2, h2) : a2.state.wrap === 2 && (a2.adler = p(a2.adler, o2, l2, h2)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x)
                for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); )
                  ;
            } while (e2.lookahead < z && e2.strm.avail_in !== 0);
          }
          function Z(e2, t2) {
            for (var r2, n2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l)
                  return A;
                if (e2.lookahead === 0)
                  break;
              }
              if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), r2 !== 0 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x)
                if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
                  for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, --e2.match_length != 0; )
                    ;
                  e2.strstart++;
                } else
                  e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
              else
                n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
              if (n2 && (N(e2, false), e2.strm.avail_out === 0))
                return A;
            }
            return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), e2.strm.avail_out === 0 ? O : B) : e2.last_lit && (N(e2, false), e2.strm.avail_out === 0) ? A : I;
          }
          function W(e2, t2) {
            for (var r2, n2, i2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l)
                  return A;
                if (e2.lookahead === 0)
                  break;
              }
              if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, r2 !== 0 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (e2.strategy === 1 || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
                for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), --e2.prev_length != 0; )
                  ;
                if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), e2.strm.avail_out === 0))
                  return A;
              } else if (e2.match_available) {
                if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, e2.strm.avail_out === 0)
                  return A;
              } else
                e2.match_available = 1, e2.strstart++, e2.lookahead--;
            }
            return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), e2.strm.avail_out === 0 ? O : B) : e2.last_lit && (N(e2, false), e2.strm.avail_out === 0) ? A : I;
          }
          function M(e2, t2, r2, n2, i2) {
            this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
          }
          function H() {
            this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
          }
          function G(e2) {
            var t2;
            return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = t2.wrap === 2 ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
          }
          function K(e2) {
            var t2 = G(e2);
            return t2 === m && function(e3) {
              e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h[e3.level].max_lazy, e3.good_match = h[e3.level].good_length, e3.nice_match = h[e3.level].nice_length, e3.max_chain_length = h[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
            }(e2.state), t2;
          }
          function Y(e2, t2, r2, n2, i2, s2) {
            if (!e2)
              return _;
            var a2 = 1;
            if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2)
              return R(e2, _);
            n2 === 8 && (n2 = 9);
            var o2 = new H();
            return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
          }
          h = [new M(0, 0, 0, 0, function(e2, t2) {
            var r2 = 65535;
            for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
              if (e2.lookahead <= 1) {
                if (j(e2), e2.lookahead === 0 && t2 === l)
                  return A;
                if (e2.lookahead === 0)
                  break;
              }
              e2.strstart += e2.lookahead, e2.lookahead = 0;
              var n2 = e2.block_start + r2;
              if ((e2.strstart === 0 || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), e2.strm.avail_out === 0))
                return A;
              if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), e2.strm.avail_out === 0))
                return A;
            }
            return e2.insert = 0, t2 === f ? (N(e2, true), e2.strm.avail_out === 0 ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
          }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
            return Y(e2, t2, v, 15, 8, 0);
          }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e2, t2) {
            return e2 && e2.state ? e2.state.wrap !== 2 ? _ : (e2.state.gzhead = t2, m) : _;
          }, r.deflate = function(e2, t2) {
            var r2, n2, i2, s2;
            if (!e2 || !e2.state || 5 < t2 || t2 < 0)
              return e2 ? R(e2, _) : _;
            if (n2 = e2.state, !e2.output || !e2.input && e2.avail_in !== 0 || n2.status === 666 && t2 !== f)
              return R(e2, e2.avail_out === 0 ? -5 : _);
            if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C)
              if (n2.wrap === 2)
                e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, n2.level === 9 ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, n2.level === 9 ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
              else {
                var a2 = v + (n2.w_bits - 8 << 4) << 8;
                a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : n2.level === 6 ? 2 : 3) << 6, n2.strstart !== 0 && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), n2.strstart !== 0 && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
              }
            if (n2.status === 69)
              if (n2.gzhead.extra) {
                for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); )
                  U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
                n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
              } else
                n2.status = 73;
            if (n2.status === 73)
              if (n2.gzhead.name) {
                i2 = n2.pending;
                do {
                  if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                    s2 = 1;
                    break;
                  }
                  s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
                } while (s2 !== 0);
                n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), s2 === 0 && (n2.gzindex = 0, n2.status = 91);
              } else
                n2.status = 91;
            if (n2.status === 91)
              if (n2.gzhead.comment) {
                i2 = n2.pending;
                do {
                  if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                    s2 = 1;
                    break;
                  }
                  s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
                } while (s2 !== 0);
                n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), s2 === 0 && (n2.status = 103);
              } else
                n2.status = 103;
            if (n2.status === 103 && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), n2.pending !== 0) {
              if (F(e2), e2.avail_out === 0)
                return n2.last_flush = -1, m;
            } else if (e2.avail_in === 0 && T(t2) <= T(r2) && t2 !== f)
              return R(e2, -5);
            if (n2.status === 666 && e2.avail_in !== 0)
              return R(e2, -5);
            if (e2.avail_in !== 0 || n2.lookahead !== 0 || t2 !== l && n2.status !== 666) {
              var o2 = n2.strategy === 2 ? function(e3, t3) {
                for (var r3; ; ) {
                  if (e3.lookahead === 0 && (j(e3), e3.lookahead === 0)) {
                    if (t3 === l)
                      return A;
                    break;
                  }
                  if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), e3.strm.avail_out === 0))
                    return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), e3.strm.avail_out === 0 ? O : B) : e3.last_lit && (N(e3, false), e3.strm.avail_out === 0) ? A : I;
              }(n2, t2) : n2.strategy === 3 ? function(e3, t3) {
                for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
                  if (e3.lookahead <= S) {
                    if (j(e3), e3.lookahead <= S && t3 === l)
                      return A;
                    if (e3.lookahead === 0)
                      break;
                  }
                  if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                    s3 = e3.strstart + S;
                    do {
                    } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                    e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
                  }
                  if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), e3.strm.avail_out === 0))
                    return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), e3.strm.avail_out === 0 ? O : B) : e3.last_lit && (N(e3, false), e3.strm.avail_out === 0) ? A : I;
              }(n2, t2) : h[n2.level].func(n2, t2);
              if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O)
                return e2.avail_out === 0 && (n2.last_flush = -1), m;
              if (o2 === I && (t2 === 1 ? u._tr_align(n2) : t2 !== 5 && (u._tr_stored_block(n2, 0, 0, false), t2 === 3 && (D(n2.head), n2.lookahead === 0 && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F(e2), e2.avail_out === 0))
                return n2.last_flush = -1, m;
            }
            return t2 !== f ? m : n2.wrap <= 0 ? 1 : (n2.wrap === 2 ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), n2.pending !== 0 ? m : 1);
          }, r.deflateEnd = function(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state.status) !== C && t2 !== 69 && t2 !== 73 && t2 !== 91 && t2 !== 103 && t2 !== E && t2 !== 666 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
          }, r.deflateSetDictionary = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h2, u2, l2 = t2.length;
            if (!e2 || !e2.state)
              return _;
            if ((s2 = (r2 = e2.state).wrap) === 2 || s2 === 1 && r2.status !== C || r2.lookahead)
              return _;
            for (s2 === 1 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (s2 === 0 && (D(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h2 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
              for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; )
                ;
              r2.strstart = n2, r2.lookahead = x - 1, j(r2);
            }
            return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h2, e2.avail_in = a2, r2.wrap = s2, m;
          }, r.deflateInfo = "pako deflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
          "use strict";
          t.exports = function() {
            this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
          };
        }, {}], 48: [function(e, t, r) {
          "use strict";
          t.exports = function(e2, t2) {
            var r2, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
            r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
            e:
              do {
                p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
                t:
                  for (; ; ) {
                    if (d >>>= y = v >>> 24, p -= y, (y = v >>> 16 & 255) === 0)
                      C[s++] = 65535 & v;
                    else {
                      if (!(16 & y)) {
                        if ((64 & y) == 0) {
                          v = m[(65535 & v) + (d & (1 << y) - 1)];
                          continue t;
                        }
                        if (32 & y) {
                          r2.mode = 12;
                          break e;
                        }
                        e2.msg = "invalid literal/length code", r2.mode = 30;
                        break e;
                      }
                      w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
                      r:
                        for (; ; ) {
                          if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                            if ((64 & y) == 0) {
                              v = _[(65535 & v) + (d & (1 << y) - 1)];
                              continue r;
                            }
                            e2.msg = "invalid distance code", r2.mode = 30;
                            break e;
                          }
                          if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                            e2.msg = "invalid distance too far back", r2.mode = 30;
                            break e;
                          }
                          if (d >>>= y, p -= y, (y = s - a) < k) {
                            if (l < (y = k - y) && r2.sane) {
                              e2.msg = "invalid distance too far back", r2.mode = 30;
                              break e;
                            }
                            if (S = c, (x = 0) === f) {
                              if (x += u - y, y < w) {
                                for (w -= y; C[s++] = c[x++], --y; )
                                  ;
                                x = s - k, S = C;
                              }
                            } else if (f < y) {
                              if (x += u + f - y, (y -= f) < w) {
                                for (w -= y; C[s++] = c[x++], --y; )
                                  ;
                                if (x = 0, f < w) {
                                  for (w -= y = f; C[s++] = c[x++], --y; )
                                    ;
                                  x = s - k, S = C;
                                }
                              }
                            } else if (x += f - y, y < w) {
                              for (w -= y; C[s++] = c[x++], --y; )
                                ;
                              x = s - k, S = C;
                            }
                            for (; 2 < w; )
                              C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                            w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                          } else {
                            for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); )
                              ;
                            w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                          }
                          break;
                        }
                    }
                    break;
                  }
              } while (n < i && s < o);
            n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p;
          };
        }, {}], 49: [function(e, t, r) {
          "use strict";
          var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
          function L(e2) {
            return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
          }
          function s() {
            this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
          }
          function a(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
          }
          function o(e2) {
            var t2;
            return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
          }
          function h(e2, t2) {
            var r2, n2;
            return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (n2.window !== null && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
          }
          function u(e2, t2) {
            var r2, n2;
            return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h(e2, t2)) !== N && (e2.state = null), r2) : U;
          }
          var l, f, c = true;
          function j(e2) {
            if (c) {
              var t2;
              for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; )
                e2.lens[t2++] = 8;
              for (; t2 < 256; )
                e2.lens[t2++] = 9;
              for (; t2 < 280; )
                e2.lens[t2++] = 7;
              for (; t2 < 288; )
                e2.lens[t2++] = 8;
              for (T(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; )
                e2.lens[t2++] = 5;
              T(F, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
            }
            e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
          }
          function Z(e2, t2, r2, n2) {
            var i2, s2 = e2.state;
            return s2.window === null && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
          }
          r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(e2) {
            return u(e2, 15);
          }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h2, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
            if (!e2 || !e2.state || !e2.output || !e2.input && e2.avail_in !== 0)
              return U;
            (r2 = e2.state).mode === 12 && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h2, x = N;
            e:
              for (; ; )
                switch (r2.mode) {
                  case P:
                    if (r2.wrap === 0) {
                      r2.mode = 13;
                      break;
                    }
                    for (; l2 < 16; ) {
                      if (o2 === 0)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (2 & r2.wrap && u2 === 35615) {
                      E[r2.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0), l2 = u2 = 0, r2.mode = 2;
                      break;
                    }
                    if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
                      e2.msg = "incorrect header check", r2.mode = 30;
                      break;
                    }
                    if ((15 & u2) != 8) {
                      e2.msg = "unknown compression method", r2.mode = 30;
                      break;
                    }
                    if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), r2.wbits === 0)
                      r2.wbits = k;
                    else if (k > r2.wbits) {
                      e2.msg = "invalid window size", r2.mode = 30;
                      break;
                    }
                    r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
                    break;
                  case 2:
                    for (; l2 < 16; ) {
                      if (o2 === 0)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (r2.flags = u2, (255 & r2.flags) != 8) {
                      e2.msg = "unknown compression method", r2.mode = 30;
                      break;
                    }
                    if (57344 & r2.flags) {
                      e2.msg = "unknown header flags set", r2.mode = 30;
                      break;
                    }
                    r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 3;
                  case 3:
                    for (; l2 < 32; ) {
                      if (o2 === 0)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    r2.head && (r2.head.time = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r2.check = B(r2.check, E, 4, 0)), l2 = u2 = 0, r2.mode = 4;
                  case 4:
                    for (; l2 < 16; ) {
                      if (o2 === 0)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 5;
                  case 5:
                    if (1024 & r2.flags) {
                      for (; l2 < 16; ) {
                        if (o2 === 0)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0;
                    } else
                      r2.head && (r2.head.extra = null);
                    r2.mode = 6;
                  case 6:
                    if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length))
                      break e;
                    r2.length = 0, r2.mode = 7;
                  case 7:
                    if (2048 & r2.flags) {
                      if (o2 === 0)
                        break e;
                      for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; )
                        ;
                      if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k)
                        break e;
                    } else
                      r2.head && (r2.head.name = null);
                    r2.length = 0, r2.mode = 8;
                  case 8:
                    if (4096 & r2.flags) {
                      if (o2 === 0)
                        break e;
                      for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; )
                        ;
                      if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k)
                        break e;
                    } else
                      r2.head && (r2.head.comment = null);
                    r2.mode = 9;
                  case 9:
                    if (512 & r2.flags) {
                      for (; l2 < 16; ) {
                        if (o2 === 0)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (u2 !== (65535 & r2.check)) {
                        e2.msg = "header crc mismatch", r2.mode = 30;
                        break;
                      }
                      l2 = u2 = 0;
                    }
                    r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
                    break;
                  case 10:
                    for (; l2 < 32; ) {
                      if (o2 === 0)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
                  case 11:
                    if (r2.havedict === 0)
                      return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
                    e2.adler = r2.check = 1, r2.mode = 12;
                  case 12:
                    if (t2 === 5 || t2 === 6)
                      break e;
                  case 13:
                    if (r2.last) {
                      u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
                      break;
                    }
                    for (; l2 < 3; ) {
                      if (o2 === 0)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
                      case 0:
                        r2.mode = 14;
                        break;
                      case 1:
                        if (j(r2), r2.mode = 20, t2 !== 6)
                          break;
                        u2 >>>= 2, l2 -= 2;
                        break e;
                      case 2:
                        r2.mode = 17;
                        break;
                      case 3:
                        e2.msg = "invalid block type", r2.mode = 30;
                    }
                    u2 >>>= 2, l2 -= 2;
                    break;
                  case 14:
                    for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
                      if (o2 === 0)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
                      e2.msg = "invalid stored block lengths", r2.mode = 30;
                      break;
                    }
                    if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, t2 === 6)
                      break e;
                  case 15:
                    r2.mode = 16;
                  case 16:
                    if (d = r2.length) {
                      if (o2 < d && (d = o2), h2 < d && (d = h2), d === 0)
                        break e;
                      I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h2 -= d, a2 += d, r2.length -= d;
                      break;
                    }
                    r2.mode = 12;
                    break;
                  case 17:
                    for (; l2 < 14; ) {
                      if (o2 === 0)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
                      e2.msg = "too many length or distance symbols", r2.mode = 30;
                      break;
                    }
                    r2.have = 0, r2.mode = 18;
                  case 18:
                    for (; r2.have < r2.ncode; ) {
                      for (; l2 < 3; ) {
                        if (o2 === 0)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
                    }
                    for (; r2.have < 19; )
                      r2.lens[A[r2.have++]] = 0;
                    if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                      e2.msg = "invalid code lengths set", r2.mode = 30;
                      break;
                    }
                    r2.have = 0, r2.mode = 19;
                  case 19:
                    for (; r2.have < r2.nlen + r2.ndist; ) {
                      for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                        if (o2 === 0)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (b < 16)
                        u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
                      else {
                        if (b === 16) {
                          for (z = _ + 2; l2 < z; ) {
                            if (o2 === 0)
                              break e;
                            o2--, u2 += n2[s2++] << l2, l2 += 8;
                          }
                          if (u2 >>>= _, l2 -= _, r2.have === 0) {
                            e2.msg = "invalid bit length repeat", r2.mode = 30;
                            break;
                          }
                          k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                        } else if (b === 17) {
                          for (z = _ + 3; l2 < z; ) {
                            if (o2 === 0)
                              break e;
                            o2--, u2 += n2[s2++] << l2, l2 += 8;
                          }
                          l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                        } else {
                          for (z = _ + 7; l2 < z; ) {
                            if (o2 === 0)
                              break e;
                            o2--, u2 += n2[s2++] << l2, l2 += 8;
                          }
                          l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                        }
                        if (r2.have + d > r2.nlen + r2.ndist) {
                          e2.msg = "invalid bit length repeat", r2.mode = 30;
                          break;
                        }
                        for (; d--; )
                          r2.lens[r2.have++] = k;
                      }
                    }
                    if (r2.mode === 30)
                      break;
                    if (r2.lens[256] === 0) {
                      e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
                      break;
                    }
                    if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                      e2.msg = "invalid literal/lengths set", r2.mode = 30;
                      break;
                    }
                    if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T(F, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
                      e2.msg = "invalid distances set", r2.mode = 30;
                      break;
                    }
                    if (r2.mode = 20, t2 === 6)
                      break e;
                  case 20:
                    r2.mode = 21;
                  case 21:
                    if (6 <= o2 && 258 <= h2) {
                      e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, r2.mode === 12 && (r2.back = -1);
                      break;
                    }
                    for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                      if (o2 === 0)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (g && (240 & g) == 0) {
                      for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                        if (o2 === 0)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      u2 >>>= v, l2 -= v, r2.back += v;
                    }
                    if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, g === 0) {
                      r2.mode = 26;
                      break;
                    }
                    if (32 & g) {
                      r2.back = -1, r2.mode = 12;
                      break;
                    }
                    if (64 & g) {
                      e2.msg = "invalid literal/length code", r2.mode = 30;
                      break;
                    }
                    r2.extra = 15 & g, r2.mode = 22;
                  case 22:
                    if (r2.extra) {
                      for (z = r2.extra; l2 < z; ) {
                        if (o2 === 0)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                    }
                    r2.was = r2.length, r2.mode = 23;
                  case 23:
                    for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                      if (o2 === 0)
                        break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if ((240 & g) == 0) {
                      for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                        if (o2 === 0)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      u2 >>>= v, l2 -= v, r2.back += v;
                    }
                    if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
                      e2.msg = "invalid distance code", r2.mode = 30;
                      break;
                    }
                    r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
                  case 24:
                    if (r2.extra) {
                      for (z = r2.extra; l2 < z; ) {
                        if (o2 === 0)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                    }
                    if (r2.offset > r2.dmax) {
                      e2.msg = "invalid distance too far back", r2.mode = 30;
                      break;
                    }
                    r2.mode = 25;
                  case 25:
                    if (h2 === 0)
                      break e;
                    if (d = c2 - h2, r2.offset > d) {
                      if ((d = r2.offset - d) > r2.whave && r2.sane) {
                        e2.msg = "invalid distance too far back", r2.mode = 30;
                        break;
                      }
                      p = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
                    } else
                      m = i2, p = a2 - r2.offset, d = r2.length;
                    for (h2 < d && (d = h2), h2 -= d, r2.length -= d; i2[a2++] = m[p++], --d; )
                      ;
                    r2.length === 0 && (r2.mode = 21);
                    break;
                  case 26:
                    if (h2 === 0)
                      break e;
                    i2[a2++] = r2.length, h2--, r2.mode = 21;
                    break;
                  case 27:
                    if (r2.wrap) {
                      for (; l2 < 32; ) {
                        if (o2 === 0)
                          break e;
                        o2--, u2 |= n2[s2++] << l2, l2 += 8;
                      }
                      if (c2 -= h2, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h2, (r2.flags ? u2 : L(u2)) !== r2.check) {
                        e2.msg = "incorrect data check", r2.mode = 30;
                        break;
                      }
                      l2 = u2 = 0;
                    }
                    r2.mode = 28;
                  case 28:
                    if (r2.wrap && r2.flags) {
                      for (; l2 < 32; ) {
                        if (o2 === 0)
                          break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (u2 !== (4294967295 & r2.total)) {
                        e2.msg = "incorrect length check", r2.mode = 30;
                        break;
                      }
                      l2 = u2 = 0;
                    }
                    r2.mode = 29;
                  case 29:
                    x = 1;
                    break e;
                  case 30:
                    x = -3;
                    break e;
                  case 31:
                    return -4;
                  case 32:
                  default:
                    return U;
                }
            return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || t2 !== 4)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (r2.mode === 12 ? 128 : 0) + (r2.mode === 20 || r2.mode === 15 ? 256 : 0), (f2 == 0 && c2 === 0 || t2 === 4) && x === N && (x = -5), x);
          }, r.inflateEnd = function(e2) {
            if (!e2 || !e2.state)
              return U;
            var t2 = e2.state;
            return t2.window && (t2.window = null), e2.state = null, N;
          }, r.inflateGetHeader = function(e2, t2) {
            var r2;
            return e2 && e2.state ? (2 & (r2 = e2.state).wrap) == 0 ? U : ((r2.head = t2).done = false, N) : U;
          }, r.inflateSetDictionary = function(e2, t2) {
            var r2, n2 = t2.length;
            return e2 && e2.state ? (r2 = e2.state).wrap !== 0 && r2.mode !== 11 ? U : r2.mode === 11 && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
          }, r.inflateInfo = "pako inflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
          "use strict";
          var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
          t.exports = function(e2, t2, r2, n, i, s, a, o) {
            var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
            for (b = 0; b <= 15; b++)
              O[b] = 0;
            for (v = 0; v < n; v++)
              O[t2[r2 + v]]++;
            for (k = g, w = 15; 1 <= w && O[w] === 0; w--)
              ;
            if (w < k && (k = w), w === 0)
              return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
            for (y = 1; y < w && O[y] === 0; y++)
              ;
            for (k < y && (k = y), b = z = 1; b <= 15; b++)
              if (z <<= 1, (z -= O[b]) < 0)
                return -1;
            if (0 < z && (e2 === 0 || w !== 1))
              return -1;
            for (B[1] = 0, b = 1; b < 15; b++)
              B[b + 1] = B[b] + O[b];
            for (v = 0; v < n; v++)
              t2[r2 + v] !== 0 && (a[B[t2[r2 + v]]++] = v);
            if (d = e2 === 0 ? (A = R = a, 19) : e2 === 1 ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, e2 === 1 && 852 < C || e2 === 2 && 592 < C)
              return 1;
            for (; ; ) {
              for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, u !== 0; )
                ;
              for (h = 1 << b - 1; E & h; )
                h >>= 1;
              if (h !== 0 ? (E &= h - 1, E += h) : E = 0, v++, --O[b] == 0) {
                if (b === w)
                  break;
                b = t2[r2 + a[v]];
              }
              if (k < b && (E & f) !== l) {
                for (S === 0 && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); )
                  x++, z <<= 1;
                if (C += 1 << x, e2 === 1 && 852 < C || e2 === 2 && 592 < C)
                  return 1;
                i[l = E & f] = k << 24 | x << 16 | c - s | 0;
              }
            }
            return E !== 0 && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
          };
        }, { "../utils/common": 41 }], 51: [function(e, t, r) {
          "use strict";
          t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
        }, {}], 52: [function(e, t, r) {
          "use strict";
          var i = e("../utils/common"), o = 0, h = 1;
          function n(e2) {
            for (var t2 = e2.length; 0 <= --t2; )
              e2[t2] = 0;
          }
          var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
          n(z);
          var C = new Array(2 * f);
          n(C);
          var E = new Array(512);
          n(E);
          var A = new Array(256);
          n(A);
          var I = new Array(a);
          n(I);
          var O, B, R, T = new Array(f);
          function D(e2, t2, r2, n2, i2) {
            this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
          }
          function F(e2, t2) {
            this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
          }
          function N(e2) {
            return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
          }
          function P(e2, t2, r2) {
            e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
          }
          function L(e2, t2, r2) {
            P(e2, r2[2 * t2], r2[2 * t2 + 1]);
          }
          function j(e2, t2) {
            for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; )
              ;
            return r2 >>> 1;
          }
          function Z(e2, t2, r2) {
            var n2, i2, s2 = new Array(g + 1), a2 = 0;
            for (n2 = 1; n2 <= g; n2++)
              s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
            for (i2 = 0; i2 <= t2; i2++) {
              var o2 = e2[2 * i2 + 1];
              o2 !== 0 && (e2[2 * i2] = j(s2[o2]++, o2));
            }
          }
          function W(e2) {
            var t2;
            for (t2 = 0; t2 < l; t2++)
              e2.dyn_ltree[2 * t2] = 0;
            for (t2 = 0; t2 < f; t2++)
              e2.dyn_dtree[2 * t2] = 0;
            for (t2 = 0; t2 < c; t2++)
              e2.bl_tree[2 * t2] = 0;
            e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
          }
          function M(e2) {
            8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
          }
          function H(e2, t2, r2, n2) {
            var i2 = 2 * t2, s2 = 2 * r2;
            return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
          }
          function G(e2, t2, r2) {
            for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H(t2, n2, e2.heap[i2], e2.depth)); )
              e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
            e2.heap[r2] = n2;
          }
          function K(e2, t2, r2) {
            var n2, i2, s2, a2, o2 = 0;
            if (e2.last_lit !== 0)
              for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, n2 === 0 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), (a2 = w[s2]) !== 0 && P(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), (a2 = k[s2]) !== 0 && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; )
                ;
            L(e2, m, t2);
          }
          function Y(e2, t2) {
            var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h2 = t2.stat_desc.elems, u2 = -1;
            for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h2; r2++)
              s2[2 * r2] !== 0 ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
            for (; e2.heap_len < 2; )
              s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
            for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--)
              G(e2, s2, r2);
            for (i2 = h2; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G(e2, s2, 1), 2 <= e2.heap_len; )
              ;
            e2.heap[--e2.heap_max] = e2.heap[1], function(e3, t3) {
              var r3, n3, i3, s3, a3, o3, h3 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
              for (s3 = 0; s3 <= g; s3++)
                e3.bl_count[s3] = 0;
              for (h3[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++)
                p2 < (s3 = h3[2 * h3[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p2, m2++), h3[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h3[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
              if (m2 !== 0) {
                do {
                  for (s3 = p2 - 1; e3.bl_count[s3] === 0; )
                    s3--;
                  e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
                } while (0 < m2);
                for (s3 = p2; s3 !== 0; s3--)
                  for (n3 = e3.bl_count[s3]; n3 !== 0; )
                    u3 < (i3 = e3.heap[--r3]) || (h3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
              }
            }(e2, t2), Z(s2, u2, e2.bl_count);
          }
          function X(e2, t2, r2) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (a2 === 0 && (h2 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++)
              i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h2 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : i2 !== 0 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4));
          }
          function V(e2, t2, r2) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (a2 === 0 && (h2 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++)
              if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h2 && i2 === a2)) {
                if (o2 < u2)
                  for (; L(e2, i2, e2.bl_tree), --o2 != 0; )
                    ;
                else
                  i2 !== 0 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
                s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4);
              }
          }
          n(T);
          var q = false;
          function J(e2, t2, r2, n2) {
            P(e2, (s << 1) + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
              M(e3), n3 && (U(e3, r3), U(e3, ~r3)), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
            }(e2, t2, r2, true);
          }
          r._tr_init = function(e2) {
            q || (function() {
              var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
              for (n2 = r2 = 0; n2 < a - 1; n2++)
                for (I[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++)
                  A[r2++] = n2;
              for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++)
                for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++)
                  E[i2++] = n2;
              for (i2 >>= 7; n2 < f; n2++)
                for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++)
                  E[256 + i2++] = n2;
              for (t2 = 0; t2 <= g; t2++)
                s2[t2] = 0;
              for (e3 = 0; e3 <= 143; )
                z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (; e3 <= 255; )
                z[2 * e3 + 1] = 9, e3++, s2[9]++;
              for (; e3 <= 279; )
                z[2 * e3 + 1] = 7, e3++, s2[7]++;
              for (; e3 <= 287; )
                z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++)
                C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
              O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
            }(), q = true), e2.l_desc = new F(e2.dyn_ltree, O), e2.d_desc = new F(e2.dyn_dtree, B), e2.bl_desc = new F(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
          }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
            var i2, s2, a2 = 0;
            0 < e2.level ? (e2.strm.data_type === 2 && (e2.strm.data_type = function(e3) {
              var t3, r3 = 4093624447;
              for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1)
                if (1 & r3 && e3.dyn_ltree[2 * t3] !== 0)
                  return o;
              if (e3.dyn_ltree[18] !== 0 || e3.dyn_ltree[20] !== 0 || e3.dyn_ltree[26] !== 0)
                return h;
              for (t3 = 32; t3 < u; t3++)
                if (e3.dyn_ltree[2 * t3] !== 0)
                  return h;
              return o;
            }(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = function(e3) {
              var t3;
              for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && e3.bl_tree[2 * S[t3] + 1] === 0; t3--)
                ;
              return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
            }(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && t2 !== -1 ? J(e2, t2, r2, n2) : e2.strategy === 4 || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), function(e3, t3, r3, n3) {
              var i3;
              for (P(e3, t3 - 257, 5), P(e3, r3 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++)
                P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
              V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
            }(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
          }, r._tr_tally = function(e2, t2, r2) {
            return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, t2 === 0 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
          }, r._tr_align = function(e2) {
            P(e2, 2, 3), L(e2, m, z), function(e3) {
              e3.bi_valid === 16 ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
            }(e2);
          };
        }, { "../utils/common": 41 }], 53: [function(e, t, r) {
          "use strict";
          t.exports = function() {
            this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
          };
        }, {}], 54: [function(e, t, r) {
          (function(e2) {
            !function(r2, n) {
              "use strict";
              if (!r2.setImmediate) {
                var i, s, t2, a, o = 1, h = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
                e3 = e3 && e3.setTimeout ? e3 : r2, i = {}.toString.call(r2.process) === "[object process]" ? function(e4) {
                  process.nextTick(function() {
                    c(e4);
                  });
                } : function() {
                  if (r2.postMessage && !r2.importScripts) {
                    var e4 = true, t3 = r2.onmessage;
                    return r2.onmessage = function() {
                      e4 = false;
                    }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
                  }
                }() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
                  r2.postMessage(a + e4, "*");
                }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
                  c(e4.data);
                }, function(e4) {
                  t2.port2.postMessage(e4);
                }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
                  var t3 = l.createElement("script");
                  t3.onreadystatechange = function() {
                    c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
                  }, s.appendChild(t3);
                }) : function(e4) {
                  setTimeout(c, 0, e4);
                }, e3.setImmediate = function(e4) {
                  typeof e4 != "function" && (e4 = new Function("" + e4));
                  for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++)
                    t3[r3] = arguments[r3 + 1];
                  var n2 = { callback: e4, args: t3 };
                  return h[o] = n2, i(o), o++;
                }, e3.clearImmediate = f;
              }
              function f(e4) {
                delete h[e4];
              }
              function c(e4) {
                if (u)
                  setTimeout(c, 0, e4);
                else {
                  var t3 = h[e4];
                  if (t3) {
                    u = true;
                    try {
                      !function(e5) {
                        var t4 = e5.callback, r3 = e5.args;
                        switch (r3.length) {
                          case 0:
                            t4();
                            break;
                          case 1:
                            t4(r3[0]);
                            break;
                          case 2:
                            t4(r3[0], r3[1]);
                            break;
                          case 3:
                            t4(r3[0], r3[1], r3[2]);
                            break;
                          default:
                            t4.apply(n, r3);
                        }
                      }(t3);
                    } finally {
                      f(e4), u = false;
                    }
                  }
                }
              }
              function d(e4) {
                e4.source === r2 && typeof e4.data == "string" && e4.data.indexOf(a) === 0 && c(+e4.data.slice(a.length));
              }
            }(typeof self == "undefined" ? e2 === void 0 ? this : e2 : self);
          }).call(this, typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {});
        }, {}] }, {}, [10])(10);
      });
    }
  });

  // src/components/modal.js
  function openModal(id) {
    const modal = document.getElementById(id);
    const content = modal.querySelector(".relative");
    modal.classList.remove("pointer-events-none", "opacity-0");
    modal.classList.add("pointer-events-auto", "opacity-100");
    requestAnimationFrame(() => {
      content.classList.remove("translate-y-full");
      content.classList.add("translate-y-0");
    });
  }
  function closeModal(id) {
    const modal = document.getElementById(id);
    const content = modal.querySelector(".relative");
    content.classList.remove("translate-y-0");
    content.classList.add("translate-y-full");
    setTimeout(() => {
      modal.classList.add("pointer-events-none", "opacity-0");
      modal.classList.remove("pointer-events-auto", "opacity-100");
    }, 500);
  }

  // src/state.js
  var state_default = {
    credentials: { email: "", encryptedPassword: "", otp: "", remember: false, apiToken: "", awaitingOtp: false, deviceUuid: "" },
    monarchAccounts: null,
    accounts: {},
    ynabOauth: { code: null, state: null, error: null }
  };

  // src/utils/storage.js
  var STORAGE_KEYS = {
    EMAIL: "monarchEmail",
    ENCRYPTED_PASSWORD: "monarchPasswordBase64",
    TOKEN: "monarchApiToken",
    UUID: "monarchDeviceUuid",
    REMEMBER: "monarchRememberMe",
    TEMP_FOR_OTP: "monarchTempForOtp"
  };
  function getLocalStorage() {
    return {
      email: get(STORAGE_KEYS.EMAIL),
      encryptedPassword: get(STORAGE_KEYS.ENCRYPTED_PASSWORD),
      token: get(STORAGE_KEYS.TOKEN),
      uuid: get(STORAGE_KEYS.UUID),
      remember: get(STORAGE_KEYS.REMEMBER) === "true",
      tempForOtp: get(STORAGE_KEYS.TEMP_FOR_OTP) === "true"
    };
  }
  function saveToLocalStorage({ email, encryptedPassword, token, uuid, remember, tempForOtp }) {
    if (email)
      set(STORAGE_KEYS.EMAIL, email);
    if (encryptedPassword)
      set(STORAGE_KEYS.ENCRYPTED_PASSWORD, encryptedPassword);
    if (token)
      set(STORAGE_KEYS.TOKEN, token);
    if (uuid)
      set(STORAGE_KEYS.UUID, uuid);
    if (typeof remember === "boolean")
      set(STORAGE_KEYS.REMEMBER, remember ? "true" : "false");
    if (typeof tempForOtp === "boolean")
      set(STORAGE_KEYS.TEMP_FOR_OTP, tempForOtp ? "true" : "false");
  }
  function clearStorage() {
    Object.values(STORAGE_KEYS).forEach(remove);
  }
  function get(key) {
    return localStorage.getItem(key);
  }
  function set(key, value) {
    localStorage.setItem(key, value);
  }
  function remove(key) {
    localStorage.removeItem(key);
  }

  // src/components/button.js
  function renderButtons() {
    document.querySelectorAll(".ui-button").forEach((button) => {
      const type = button.dataset.type || "primary";
      const size = button.dataset.size || "medium";
      const fixedWidth = button.dataset.fixedWidth;
      const fullWidth = button.hasAttribute("data-fullwidth");
      const isDisabled = button.hasAttribute("disabled") || button.disabled;
      button.className = "ui-button";
      button.type = "button";
      button.classList.add("font-semibold", "rounded-lg", "transition-all", "duration-200", "ease-in-out", "flex", "items-center", "justify-center");
      button.style.transform = "none";
      switch (size) {
        case "small":
          button.classList.add("px-2", "py-1", "text-xs", "sm:px-3", "sm:py-1.5", "sm:text-sm");
          break;
        case "large":
          button.classList.add("px-4", "py-2.5", "text-sm", "sm:px-6", "sm:py-3", "sm:text-base", "md:px-8", "md:py-4");
          break;
        case "medium":
        default:
          button.classList.add("px-3", "py-2", "text-sm", "sm:px-5", "sm:py-2", "sm:text-sm");
          break;
      }
      if (isDisabled) {
        button.setAttribute("disabled", "");
        button.classList.add("opacity-50", "cursor-not-allowed");
        button.style.boxShadow = "none";
      } else {
        button.removeAttribute("disabled");
        button.classList.add("cursor-pointer");
      }
      switch (type) {
        case "primary":
          button.classList.add("bg-[#1993e5]", "text-white", "border", "border-[#1993e5]", "shadow-sm");
          if (!isDisabled) {
            button.classList.add("hover:bg-blue-600", "hover:border-blue-600", "hover:shadow-md", "focus:ring-2", "focus:ring-blue-500", "focus:ring-offset-2", "active:bg-blue-700", "transform", "hover:scale-105");
          }
          break;
        case "secondary":
          button.classList.add("bg-white", "text-gray-700", "border", "border-gray-300", "shadow-sm");
          if (!isDisabled) {
            button.classList.add("hover:bg-gray-50", "hover:border-gray-400", "hover:text-gray-800", "focus:ring-2", "focus:ring-gray-500", "focus:ring-offset-2", "active:bg-gray-100");
          }
          break;
        case "text":
          button.classList.remove("px-2", "px-3", "px-4", "px-5", "px-6", "px-8", "py-1", "py-1.5", "py-2", "py-2.5", "py-3", "py-4", "sm:px-3", "sm:px-5", "sm:px-6", "sm:px-8", "sm:py-1.5", "sm:py-2", "sm:py-3", "sm:py-4", "md:px-8", "md:py-4");
          button.classList.add("bg-transparent", "text-blue-600", "px-2", "py-1", "sm:px-3", "sm:py-1.5");
          if (!isDisabled) {
            button.classList.add("hover:underline", "hover:text-blue-700", "focus:ring-2", "focus:ring-blue-500", "focus:ring-offset-2");
          }
          break;
        case "danger":
          button.classList.add("bg-red-500", "text-white", "border", "border-red-500", "shadow-sm");
          if (!isDisabled) {
            button.classList.add("hover:bg-red-600", "hover:border-red-600", "hover:shadow-md", "focus:ring-2", "focus:ring-red-500", "focus:ring-offset-2", "active:bg-red-700", "transform", "hover:scale-105");
          }
          break;
        case "warning":
          button.classList.add("bg-orange-500", "text-white", "border", "border-orange-500", "shadow-sm");
          if (!isDisabled) {
            button.classList.add("hover:bg-orange-600", "hover:border-orange-600", "hover:shadow-md", "focus:ring-2", "focus:ring-orange-500", "focus:ring-offset-2", "active:bg-orange-700", "transform", "hover:scale-105");
          }
          break;
      }
      if (fixedWidth) {
        button.style.width = `${fixedWidth}px`;
      }
      if (fullWidth) {
        button.classList.add("w-full");
      }
      if (!isDisabled) {
        button.classList.add("touch-manipulation", "select-none");
        button.style.minHeight = "44px";
        button.style.minWidth = "44px";
      }
    });
  }

  // src/components/pageLayout.js
  function renderPageLayout(options = {}) {
    const {
      containerId = "pageLayout",
      navbar = null,
      header = null,
      className = ""
    } = options;
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Page layout container #${containerId} not found`);
      return;
    }
    const pageContent = [];
    let sibling = container.nextElementSibling;
    while (sibling) {
      pageContent.push(sibling);
      sibling = sibling.nextElementSibling;
    }
    container.className = `min-h-screen flex flex-col ${className}`;
    container.innerHTML = `
    <main class="flex-1 w-full mx-auto px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-6 lg:py-8 max-w-6xl">
      <div class="flex flex-col space-y-6 sm:space-y-8 md:space-y-10">
        <!-- Navigation Bar -->
        <div id="navigationBar"></div>

        <!-- Page Header -->
        <div id="pageHeader"></div>

        <!-- Page Content Slot -->
        <div id="pageContent"></div>
      </div>
    </main>
  `;
    if (navbar != null)
      renderNavigationBar(navbar);
    if (header != null)
      renderPageHeader(header);
    const contentContainer = document.getElementById("pageContent");
    if (contentContainer) {
      pageContent.forEach((element) => {
        contentContainer.appendChild(element);
      });
    }
    renderButtons();
  }
  function renderNavigationBar(options = {}) {
    const {
      showBackButton = true,
      showDataButton = true,
      backText = "Back",
      containerId = "navigationBar"
    } = options;
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Navigation container with id "${containerId}" not found`);
      return;
    }
    const hasData = checkForStoredData();
    const dataButtonText = hasData ? "Manage your data" : "No data currently stored";
    let navHTML = '<div class="flex flex-wrap items-center justify-between gap-2 mb-4">';
    if (showBackButton) {
      navHTML += `
      <button 
        id="navBackBtn" 
        class="ui-button flex items-center text-sm"
        data-type="text"
        data-size="small"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        ${backText}
      </button>
    `;
    } else {
      navHTML += "<div></div>";
    }
    if (showDataButton) {
      navHTML += `
      <button 
        id="navDataBtn" 
        class="ui-button text-xs sm:text-sm"
        data-type="text"
        data-size="small"
        ${!hasData ? 'style="opacity: 0.6; cursor: default;"' : ""}
      >
        ${dataButtonText}
      </button>
    `;
    }
    navHTML += "</div>";
    container.innerHTML = navHTML;
    renderButtons();
    if (showBackButton) {
      const backBtn = document.getElementById("navBackBtn");
      backBtn?.addEventListener("click", () => {
        goBack();
      });
    }
    if (showDataButton) {
      const dataBtn = document.getElementById("navDataBtn");
      dataBtn?.addEventListener("click", () => {
        if (hasData) {
          navigate("/data-management");
        }
      });
    }
  }
  function checkForStoredData() {
    const hasStateAccounts = state_default.accounts && Object.keys(state_default.accounts).length > 0;
    const hasMonarchAccounts = state_default.monarchAccounts !== null;
    const hasSessionAccounts = sessionStorage.getItem("ynab_accounts") !== null;
    const hasSessionMonarch = sessionStorage.getItem("monarch_accounts") !== null;
    const localStorage2 = getLocalStorage();
    const hasLocalStorageData = !!(localStorage2.email || localStorage2.encryptedPassword || localStorage2.token || localStorage2.uuid);
    return hasStateAccounts || hasMonarchAccounts || hasSessionAccounts || hasSessionMonarch || hasLocalStorageData;
  }
  function renderPageHeader(options = {}) {
    const {
      title = "",
      description = "",
      containerId = "pageHeader",
      className = ""
    } = options;
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Page header container with id "${containerId}" not found`);
      return;
    }
    const headerHTML = `
    <section class="text-center mb-2 ${className}">
      <div class="inline-flex items-center justify-center gap-2 mb-6">
        <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          ${escapeHtml(title)}
        </h2>
      </div>

      <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 leading-relaxed">
        ${escapeHtml(description)}
      </p>
    </section>
  `;
    container.innerHTML = headerHTML;
  }
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // src/views/Home/home.js
  function initUploadView() {
    const getStartedButton = document.getElementById("getStartedButton");
    const privacyInfoModalButton = document.getElementById("privacyInfoModalButton");
    const migrationInfoModalButton = document.getElementById("migrationInfoModalButton");
    const closePrivacyInfoModal = document.getElementById("closePrivacyInfoModal");
    const closeMigrationInfoModal = document.getElementById("closeMigrationInfoModal");
    renderPageLayout({
      header: {
        title: "YNAB to Monarch Migration",
        description: "Moving your financial data from YNAB to Monarch made simple and secure. Choose the method that works best for you, and we'll guide you through each step.",
        containerId: "pageHeader"
      }
    });
    getStartedButton?.addEventListener("click", (event) => {
      event.preventDefault();
      navigate("/upload");
    });
    privacyInfoModalButton?.addEventListener("click", () => openModal("privacyInfoModal"));
    closePrivacyInfoModal?.addEventListener("click", () => closeModal("privacyInfoModal"));
    migrationInfoModalButton?.addEventListener("click", () => openModal("migrationInfoModal"));
    closeMigrationInfoModal?.addEventListener("click", () => closeModal("migrationInfoModal"));
  }

  // src/views/Home/home.html
  var home_default = `<div id="pageLayout"></div>

<!-- Get Started Btn -->
<section class="container-responsive flex flex-col items-center mb-6">
  <button id="getStartedButton" class="ui-button w-full" data-type="primary" data-size="large">
    Start Migrating Your Data
  </button>

  <a id="migrationInfoModalButton" class="ui-button mt-4 sm:mt-6 inline-block" data-type="text">
    How does this work?
  </a>
</section>

<!-- Privacy Info -->
<section class="text-center">
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-3xl mx-auto mb-8 text-left">
    <div class="flex items-start gap-4">
      <div class="bg-green-100 rounded-full p-3 shrink-0">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z" stroke-linecap="round"
            stroke-linejoin="round"></path>
          <path d="M8.5 12.5l1.5 1.5 4-4" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-gray-900 mb-2 text-left text-lg font-semibold">Your data stays yours, always</h3>
        <p class="text-gray-600 text-sm mb-3">
          We never store, sell, or share your financial information. You remain in control of your data from start
          to finish.
        </p>
        <button id="privacyInfoModalButton"
          class="text-blue-600 hover:text-blue-700 transition-colors text-sm underline">
          Learn more about how we protect your privacy
        </button>
      </div>
    </div>
  </div>
</section>

<!-- Privacy Info Modal -->
<div id="privacyInfoModal" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none opacity-0 
            transition-opacity duration-300 p-3 sm:p-4 md:p-6">
  <!-- Overlay -->
  <div class="absolute inset-0 bg-black/30 transition-opacity duration-300"></div>

  <!-- Modal Content -->
  <div
    class="relative z-10 bg-white rounded-xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md md:max-w-lg w-full shadow-2xl transform translate-y-full transition-transform duration-500 max-h-[90vh] overflow-y-auto">

    <!-- Close Btn -->
    <button id="closePrivacyInfoModal"
      class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Close modal">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Title -->
    <h3 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 pr-8 text-gray-900">
      Privacy is our top priority
    </h3>

    <!-- Body -->
    <div class="space-y-4 text-sm text-gray-600">
      <div>
        <h4 class="text-gray-900 font-semibold mb-1">No Data Collection</h4>
        <p>We never collect, store, or share your financial data.</p>
      </div>
      <div>
        <h4 class="text-gray-900 font-semibold mb-1">Secure Connections</h4>
        <p>We use secure, encrypted, and read-only connections when accessing your YNAB data.
        </p>
      </div>
      <div>
        <h4 class="text-gray-900 font-semibold mb-1">You're in Control</h4>
        <p>At any point in time you have full control to wipe your data and stop the migration process.</p>
      </div>
      <div>
        <h4 class="text-gray-900 font-semibold mb-1">Open Source & Auditable</h4>
        <p>Everything is transparent and can be reviewed by security experts. We have nothing to hide because we keep
          no copies. See <a href="https://github.com/your-repo" class="text-blue-600 hover:underline">our source
            code</a>.</p>
      </div>
    </div>

    <div class="mt-6 sm:mt-8 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-start gap-2 sm:gap-3">
        <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        <p class="text-xs sm:text-sm text-green-800 leading-relaxed">
          <strong>100% Private:</strong> Your financial data is sensitive, and we treat it that way. You remain the
          sole owner of every byte.
        </p>
      </div>
    </div>
  </div>
</div>

<!-- Migration Info Modal -->
<div id="migrationInfoModal"
  class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300 p-3 sm:p-4 md:p-6">

  <!-- Overlay -->
  <div class="absolute inset-0 bg-black/30 transition-opacity duration-300"></div>

  <!-- Modal Content -->
  <div
    class="relative z-10 bg-white rounded-xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md md:max-w-lg w-full shadow-2xl transform translate-y-full transition-transform duration-500 max-h-[90vh] overflow-y-auto">

    <!-- Close Btn -->
    <button id="closeMigrationInfoModal"
      class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Close modal">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Title -->
    <h3 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 pr-8 text-gray-900">
      How the Migration Process Works
    </h3>

    <!-- Body -->
    <div class="space-y-4 text-sm text-gray-600">
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">Step 1: Access Your Data</h4>
        <p class="text-gray-600 text-sm">Connect your YNAB account or upload your data manually. We'll retrieve your
          budgets, transactions, categories, and accounts.</p>
      </div>
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">Step 2: Filter & Process</h4>
        <p class="text-gray-600 text-sm">Decide what to migrate and make edits as needed.</p>
      </div>
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">Step 3: Download or Import</h4>
        <p class="text-gray-600 text-sm">Decide to receive a ready-to-import file that you can upload into Monarch
          Money yourself, or connect to your Monarch Money account to automatically migrate your data.</p>
      </div>
    </div>
  </div>
</div>`;

  // src/services/ynabParser.js
  var import_papaparse = __toESM(require_papaparse_min(), 1);
  var import_jszip = __toESM(require_jszip_min(), 1);
  function generateId() {
    return "id-" + Math.random().toString(36).slice(2, 11);
  }
  function parseCurrencyToCents(str) {
    if (!str)
      return 0;
    const normalized = str.replace(/[^0-9.-]+/g, "").trim();
    const floatVal = parseFloat(normalized);
    return isNaN(floatVal) ? 0 : Math.round(floatVal * 100);
  }
  function inferMonarchType(accountName) {
    const lowered = accountName.toLowerCase();
    if (lowered.includes("credit")) {
      return { type: "credit", subtype: "credit_card" };
    }
    if (lowered.includes("loan") || lowered.includes("mortgage") || lowered.includes("student loan")) {
      return { type: "loan", subtype: "loan" };
    }
    if (lowered.includes("savings")) {
      return { type: "depository", subtype: "savings" };
    }
    if (lowered.includes("checking") || lowered.includes("debit")) {
      return { type: "depository", subtype: "checking" };
    }
    return { type: "depository", subtype: "checking" };
  }
  async function parseYNABCSV(zipFile, monarchAccountTypes) {
    console.group("parseYNABCSV");
    const zip = await import_jszip.default.loadAsync(zipFile);
    const targetFile = Object.keys(zip.files).find((name) => name.toLowerCase().includes("register") && name.toLowerCase().endsWith(".csv"));
    if (!targetFile) {
      console.error("\u274C No register CSV found in the ZIP file");
      console.groupEnd("parseYNABCSV");
      throw new Error("No register CSV found in the ZIP file");
    }
    const csvContent = await zip.files[targetFile].async("string");
    console.groupEnd("parseYNABCSV");
    return parseCSV(csvContent, monarchAccountTypes);
  }
  function parseCSV(csvContent, monarchAccountTypes) {
    console.group("parseCSV");
    return new Promise((resolve, reject) => {
      import_papaparse.default.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data: data2 }) => {
          if (!data2 || data2.length === 0) {
            console.groupEnd("parseCSV");
            return reject(new Error("\u274C CSV file appears to be empty or invalid."));
          }
          const accounts2 = /* @__PURE__ */ new Map();
          for (const row of data2) {
            const accountName = row["Account"]?.trim();
            if (!accountName) {
              console.warn("\u274C Skipping row with missing account name:", row);
              continue;
            }
            if (row["Date"]) {
              const [mm, dd, yyyy] = row["Date"].split("/");
              if (mm && dd && yyyy) {
                row["Date"] = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
              }
            }
            const inflowCents = parseCurrencyToCents(row["Inflow"]);
            const outflowCents = parseCurrencyToCents(row["Outflow"]);
            const netCents = inflowCents - outflowCents;
            if (inflowCents > 0) {
              row.Amount = (inflowCents / 100).toFixed(2);
            } else if (outflowCents > 0) {
              row.Amount = (-outflowCents / 100).toFixed(2);
            } else {
              row.Amount = "0.00";
            }
            if (!accounts2.has(accountName)) {
              const { type, subtype } = inferMonarchType(accountName, monarchAccountTypes);
              accounts2.set(accountName, {
                id: generateId(),
                name: accountName,
                modifiedName: accountName,
                type,
                subtype,
                transactions: [],
                transactionCount: 0,
                balanceCents: 0,
                included: true,
                selected: false,
                status: "unprocessed"
              });
            }
            const account = accounts2.get(accountName);
            account.transactions.push({
              Date: row.Date,
              Merchant: row.Payee || "",
              Category: row.Category || "",
              "Category Group": row["Category Group"] || "",
              Notes: row.Memo || "",
              Amount: row.Amount,
              Tags: row.Flag || ""
            });
            account.transactionCount += 1;
            account.balanceCents += netCents;
          }
          ;
          for (const account of accounts2.values()) {
            account.balance = account.balanceCents / 100;
            account.included = account.transactionCount > 0;
          }
          ;
          console.groupEnd("parseCSV");
          resolve(Object.fromEntries(accounts2));
        },
        error: (err) => reject(err)
      });
    });
  }

  // src/api/config.js
  var config = null;
  async function fetchConfig() {
    if (config) {
      return config;
    }
    try {
      const response = await fetch("/.netlify/functions/config");
      if (!response.ok) {
        throw new Error("Failed to fetch configuration");
      }
      config = await response.json();
      return config;
    } catch (error) {
      console.error("Could not fetch app configuration:", error);
      return {
        ynabClientId: "FALLBACK_CLIENT_ID",
        ynabRedirectUri: "http://localhost:8888/oauth/ynab/callback"
      };
    }
  }
  async function getConfig() {
    return await fetchConfig();
  }
  var base = location.hostname === "localhost" ? "http://localhost:3000/dev/" : "/.netlify/functions/";
  var API = {
    login: base + "monarchLogin",
    fetchAccounts: base + "fetchMonarchAccounts",
    createAccounts: base + "createMonarchAccounts",
    generateStatements: base + "generateStatements",
    getUploadStatus: base + "getUploadStatus"
  };

  // src/api/ynabApi.js
  var YNAB_API_BASE_URL = "https://api.ynab.com/v1";
  function generateCsrfToken() {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  async function redirectToYnabOauth() {
    const { ynabClientId, ynabRedirectUri } = await getConfig();
    console.log("Redirecting to YNAB OAuth with Client ID:", ynabClientId);
    console.log("Redirect URI:", ynabRedirectUri);
    const csrfToken = generateCsrfToken();
    sessionStorage.setItem("ynab_csrf_token", csrfToken);
    const authUrl = new URL("https://app.ynab.com/oauth/authorize");
    authUrl.searchParams.append("client_id", ynabClientId);
    authUrl.searchParams.append("redirect_uri", ynabRedirectUri);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", "read-only");
    authUrl.searchParams.append("state", csrfToken);
    window.location.href = authUrl.toString();
  }
  async function getAccounts(accessToken, budgetId) {
    const url = new URL(`${YNAB_API_BASE_URL}/${budgetId}/accounts`);
    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching YNAB accounts:", errorData);
        throw new Error(`Failed to fetch YNAB accounts. Status: ${response.status}`);
      }
      const data2 = await response.json();
      return data2.data.accounts;
    } catch (error) {
      console.error("YNAB API call failed:", error);
      navigate("/upload");
      return null;
    }
  }
  async function exchangeCodeForToken(code) {
    try {
      const response = await fetch("/.netlify/functions/ynabTokenExchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code
        })
      });
      const data2 = await response.json();
      if (!response.ok) {
        console.error("YNAB token exchange failed:", data2);
        throw new Error("Failed to exchange authorization code for a token.");
      }
      return data2;
    } catch (error) {
      console.error("Error during token exchange:", error);
      return null;
    }
  }
  async function handleOauthCallback() {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    const stateToken = queryParams.get("state");
    const storedState = sessionStorage.getItem("ynab_csrf_token");
    sessionStorage.removeItem("ynab_csrf_token");
    if (!stateToken || stateToken !== storedState) {
      console.error("Invalid CSRF token on OAuth callback.");
      alert("Security error. Please try connecting to YNAB again.");
      navigate("/upload", true);
      return;
    }
    if (!code) {
      console.error("OAuth callback did not contain an authorization code.");
      alert("Could not authenticate with YNAB. Please try again.");
      navigate("/upload", true);
      return;
    }
    const tokenData = await exchangeCodeForToken(code);
    if (tokenData && tokenData.access_token) {
      state_default.ynab_access_token = tokenData.access_token;
      sessionStorage.setItem("ynab_access_token", tokenData.access_token);
      sessionStorage.setItem("ynab_refresh_token", tokenData.refresh_token);
      sessionStorage.setItem("ynab_token_expires_at", Date.now() + tokenData.expires_in * 1e3);
      const accounts2 = await getAccounts(tokenData.access_token);
      if (accounts2 && accounts2.length > 0) {
        state_default.accounts = accounts2.reduce((acc, account) => {
          if (!account.deleted) {
            acc[account.id] = {
              ...account,
              selected: true,
              transactions: []
            };
          }
          return acc;
        }, {});
        console.table(state_default.accounts);
        navigate("/review");
      } else {
        alert("No budgets found in your YNAB account.");
        navigate("/upload");
      }
    } else {
      alert("Failed to get access token from YNAB. Please try again.");
      navigate("/upload", true);
    }
  }

  // src/views/Upload/upload.js
  function initUploadView2() {
    const hasExistingAccounts = state_default.accounts && Object.keys(state_default.accounts).length > 0;
    renderPageLayout({
      navbar: {
        showBackButton: hasExistingAccounts,
        showDataButton: true
      },
      header: {
        title: "Step 1: Import YNAB Data",
        description: "Choose how you'd like to bring your YNAB data into Monarch Money. You can either connect your YNAB account for a seamless transfer or manually upload a file.",
        containerId: "pageHeader"
      }
    });
    const existingDataAlert = document.getElementById("existingDataAlert");
    if (hasExistingAccounts && existingDataAlert) {
      existingDataAlert.classList.remove("hidden");
    }
    const continueWithExistingBtn = document.getElementById("continueWithExistingBtn");
    const connectButton = document.getElementById("connectButton");
    const manualUploadButton = document.getElementById("manualUploadButton");
    const manualFileInput = document.getElementById("manualFileInput");
    const oauthInfoModalButton = document.getElementById("oauthInfoModalButton");
    const manualImportInfoModalButton = document.getElementById("manualImportInfoModalButton");
    const closeOauthInfoModal = document.getElementById("closeOauthInfoModal");
    const closeManualImportInfoModal = document.getElementById("closeManualImportInfoModal");
    continueWithExistingBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      navigate("/review", false, true);
    });
    connectButton?.addEventListener("click", (event) => {
      event.preventDefault();
      redirectToYnabOauth();
    });
    oauthInfoModalButton?.addEventListener("click", () => openModal("oauthInfoModal"));
    manualImportInfoModalButton?.addEventListener("click", () => openModal("manualImportInfoModal"));
    closeOauthInfoModal?.addEventListener("click", () => closeModal("oauthInfoModal"));
    closeManualImportInfoModal?.addEventListener("click", () => closeModal("manualImportInfoModal"));
    manualUploadButton?.addEventListener("click", (e) => {
      e.preventDefault();
      manualFileInput?.click();
    });
    manualFileInput?.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file)
        await handleFile(file);
    });
    async function handleFile(csvFile) {
      const fileName = csvFile.name.toLowerCase();
      const fileType = csvFile.type.toLowerCase();
      console.log("File upload debug:", {
        name: csvFile.name,
        type: csvFile.type,
        size: csvFile.size,
        fileName,
        fileType
      });
      const isZipByExtension = fileName.endsWith(".zip") || fileName.endsWith(".bin") || fileName.includes("ynab") || fileName.includes("register") || fileName.includes("export");
      const isZipByMimeType = [
        "application/zip",
        "application/x-zip-compressed",
        "application/octet-stream",
        "application/x-zip",
        "multipart/x-zip",
        "application/x-compressed",
        "application/binary"
      ].includes(fileType);
      const isPotentialZip = isZipByExtension || isZipByMimeType || csvFile.size > 1e3;
      console.log("File validation debug:", {
        isZipByExtension,
        isZipByMimeType,
        isPotentialZip,
        fileSize: csvFile.size
      });
      if (!isPotentialZip) {
        console.log("File rejected - not a potential ZIP");
        errorMessage.textContent = "Please upload a ZIP export from YNAB.";
        errorMessage.classList.remove("hidden");
        return;
      }
      console.log("File accepted, attempting to parse...");
      try {
        const accounts2 = await parseYNABCSV(csvFile);
        state_default.accounts = accounts2;
        persistState();
        if (accounts2 && Object.keys(accounts2).length > 0) {
          navigate("/review", false, true);
        } else {
          errorMessage.textContent = "No accounts found in the uploaded file.";
          errorMessage.classList.remove("hidden");
        }
      } catch (err) {
        errorMessage.textContent = "Failed to parse file. Please ensure it's a valid YNAB ZIP export with register.csv and plan.csv.";
        errorMessage.classList.remove("hidden");
        console.error(err);
      }
    }
  }

  // src/views/Upload/upload.html
  var upload_default = `<div id="pageLayout"></div>

<!-- Existing Data Alert -->
<div id="existingDataAlert" class="hidden">
  <div class="p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg mb-8">
    <div class="flex items-start gap-4">
      <div class="flex-shrink-0">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-green-900 mb-1">You have existing data</h3>
        <p class="text-sm text-green-700 mb-4">
          We found your previously uploaded YNAB accounts, continue where you left off.
        </p>
        <button id="continueWithExistingBtn" class="ui-button" data-type="primary" data-size="medium">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Continue with Existing Data
        </button>
      </div>
    </div>
  </div>

  <!-- Divider -->
  <div class="relative mb-8">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t border-gray-200"></div>
    </div>
    <div class="relative flex justify-center">
      <div class="px-4 bg-white">
        <span class="w-5 h-5 text-gray-400">OR</span>
      </div>
    </div>
  </div>

</div>

<!-- Upload Options -->
<section class="mb-12">
  <div class="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
    <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg space-y-4 flex flex-col text-left">
      <div class="flex items-start gap-4">
        <span class="bg-blue-50 text-blue-600 rounded-2xl p-3">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M10 17l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M14 7h6" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M14 17h6" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </span>
        <div>
          <p class="text-sm uppercase tracking-[0.4em] text-gray-400">Automatic</p>
          <h3 class="text-xl font-semibold text-slate-900">Connect to YNAB</h3>
        </div>
      </div>
      <div class="space-y-1 pt-4">
        <button id="connectButton" class="ui-button w-full" data-type="primary" data-size="large">
          Connect YNAB Account
        </button>
        <a id="oauthInfoModalButton" data-type="text" class="ui-button">
          How does this work?
        </a>
      </div>
    </div>

    <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg space-y-4 flex flex-col text-left">
      <div class="flex items-start gap-4">
        <span class="bg-purple-50 text-purple-600 rounded-2xl p-3">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke-linecap="round" stroke-linejoin="round">
            </path>
            <path d="M12 3v12" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M9 10l3-3 3 3" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </span>
        <div>
          <p class="text-sm uppercase tracking-[0.4em] text-gray-400">Manual</p>
          <h3 class="text-xl font-semibold text-slate-900">Upload a File</h3>
        </div>
      </div>
      <div class="space-y-1 pt-4">
        <button id="manualUploadButton" class="ui-button w-full" data-type="secondary" data-size="large">
          Choose File to Upload
        </button>
        <input id="manualFileInput" type="file"
          accept=".zip,.bin,application/zip,application/x-zip-compressed,application/octet-stream,application/binary"
          class="hidden" />
        <a id="manualImportInfoModalButton" data-type="text" class="ui-button">
          What's the process?
        </a>
      </div>
    </div>
  </div>
</section>

<!-- OAuth Info Modal -->
<div id="oauthInfoModal"
  class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300 p-3 sm:p-4 md:p-6">

  <!-- Overlay -->
  <div class="absolute inset-0 bg-black/30 transition-opacity duration-300"></div>

  <!-- Modal Content -->
  <div
    class="relative z-10 bg-white rounded-xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md md:max-w-lg w-full shadow-2xl transform translate-y-full transition-transform duration-500 max-h-[90vh] overflow-y-auto">

    <!-- Close Btn -->
    <button id="closeOauthInfoModal"
      class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Close modal">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Title -->
    <h3 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 pr-8 text-gray-900">
      How does connecting my YNAB account work?
    </h3>

    <!-- Body -->
    <div class="space-y-4 text-sm text-gray-600">
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">1: Securely Connect</h4>
        <p class="text-gray-600 text-sm">Using YNAB's official authentication process, securely connect your account.
        </p>
      </div>
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">2: Grant Permissions</h4>
        <p class="text-gray-600 text-sm">We'll prompt you to authorize access to your YNAB data and thoroughly explain
          every permission and how it is used.</p>
      </div>
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">3: Review & Filter</h4>
        <p class="text-gray-600 text-sm">Decide which accounts and transactions to migrate.</p>
      </div>
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">4: Process</h4>
        <p class="text-gray-600 text-sm">Decide how to migrate your data.</p>
      </div>
    </div>
  </div>
</div>

<!-- Manual Import Info Modal -->
<div id="manualImportInfoModal"
  class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300 p-3 sm:p-4 md:p-6">

  <!-- Overlay -->
  <div class="absolute inset-0 bg-black/30 transition-opacity duration-300"></div>

  <!-- Modal Content -->
  <div
    class="relative z-10 bg-white rounded-xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md md:max-w-lg w-full shadow-2xl transform translate-y-full transition-transform duration-500 max-h-[90vh] overflow-y-auto">

    <!-- Close Btn -->
    <button id="closeManualImportInfoModal"
      class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Close modal">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Title -->
    <h3 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 pr-8 text-gray-900">
      Where do I find my YNAB data file?
    </h3>

    <!-- Body -->
    <div class="space-y-4 text-sm text-gray-600">
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">1: Visit YNAB.com</h4>
        <p class="text-gray-600 text-sm">Visit <a href="https://www.ynab.com" target="_blank"
            rel="noopener noreferrer">YNAB.com</a> and log into your account.</p>
      </div>
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">2: Export your YNAB Data</h4>
        <p class="text-gray-600 text-sm">Click on your name in the top-left corner to reveal the menu, then click
          "Export Plan". This will download a ZIP file containing all your data.</p>
      </div>
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">3: Upload the File</h4>
        <p class="text-gray-600 text-sm">On this page, click the "Choose File to Upload" button, navigate to where the
          ZIP file was downloaded, and select it.</p>
      </div>
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">4: Review & Filter</h4>
        <p class="text-gray-600 text-sm">Decide which accounts and transactions to migrate.</p>
      </div>
      <div>
        <h4 class="text-gray-900 text-sm font-semibold mb-1">5: Process</h4>
        <p class="text-gray-600 text-sm">Decide how to migrate your data.</p>
      </div>
    </div>
  </div>
</div>`;

  // public/static-data/monarchAccountTypes.json
  var generatedAt = "2025-06-02T06:26:29.704Z";
  var generatedBy = "tools/fetchMonarchAccountTypes.js";
  var data = [
    {
      typeName: "depository",
      typeDisplay: "Cash",
      group: "asset",
      subtypes: [
        {
          name: "cd",
          display: "CD"
        },
        {
          name: "checking",
          display: "Checking"
        },
        {
          name: "savings",
          display: "Savings"
        },
        {
          name: "money_market",
          display: "Money Market"
        },
        {
          name: "paypal",
          display: "Mobile Payment System"
        },
        {
          name: "prepaid",
          display: "Prepaid"
        },
        {
          name: "cash_management",
          display: "Cash Management"
        }
      ]
    },
    {
      typeName: "brokerage",
      typeDisplay: "Investments",
      group: "asset",
      subtypes: [
        {
          name: "st_401a",
          display: "401a"
        },
        {
          name: "st_401k",
          display: "401k"
        },
        {
          name: "st_403b",
          display: "403b"
        },
        {
          name: "st_457b",
          display: "457b"
        },
        {
          name: "st_529",
          display: "529 Plan"
        },
        {
          name: "brokerage",
          display: "Brokerage (Taxable)"
        },
        {
          name: "cash_isa",
          display: "Individual Savings Account (ISA) - Cash"
        },
        {
          name: "cryptocurrency",
          display: "Cryptocurrency"
        },
        {
          name: "education_savings_account",
          display: "Coverdell Education Savings Account (ESA)"
        },
        {
          name: "gic",
          display: "Guaranteed Investment Certificate (GIC)"
        },
        {
          name: "fixed_annuity",
          display: "Fixed Annuity"
        },
        {
          name: "health_reimbursement_arrangement",
          display: "Health Reimbursement Arrangement (HRA)"
        },
        {
          name: "health_savings_account",
          display: "Health Savings Account (HSA)"
        },
        {
          name: "iso",
          display: "Incentive Stock Options (ISO)"
        },
        {
          name: "ira",
          display: "Individual Retirement Account (IRA)"
        },
        {
          name: "isa",
          display: "Individual Savings Account (ISA) - Non-cash"
        },
        {
          name: "lif",
          display: "Life Income Fund (LIF) Retirement Account"
        },
        {
          name: "lira",
          display: "Locked-in Retirement Account (LIRA)"
        },
        {
          name: "lrif",
          display: "Locked-in Retirement Income Fund (LRIF)"
        },
        {
          name: "lrsp",
          display: "Locked-in Retirement Savings Plan (LRSP)"
        },
        {
          name: "keogh_plan",
          display: "Keogh Plan"
        },
        {
          name: "mutual_fund",
          display: "Mutual Fund"
        },
        {
          name: "nso",
          display: "Non-qualified Stock Options (NSO)"
        },
        {
          name: "non_taxable_brokerage_account",
          display: "Brokerage (Non-taxable)"
        },
        {
          name: "other",
          display: "Other"
        },
        {
          name: "prif",
          display: "Prescribed Registered Retirement Income Fund (PRIF)"
        },
        {
          name: "rdsp",
          display: "Registered Disability Savings Plan (RDSP)"
        },
        {
          name: "resp",
          display: "Registered Education Savings Plan (RESP)"
        },
        {
          name: "rlif",
          display: "Restricted Life Income Fund (RLIF)"
        },
        {
          name: "rrif",
          display: "Registered Retirement Income Fund (RRIF)"
        },
        {
          name: "pension",
          display: "Pension"
        },
        {
          name: "profit_sharing_plan",
          display: "Profit Sharing Plan"
        },
        {
          name: "qualifying_share_account",
          display: "Qualifying Share Account"
        },
        {
          name: "retirement",
          display: "Retirement"
        },
        {
          name: "roth",
          display: "Roth IRA"
        },
        {
          name: "roth_401k",
          display: "Roth 401k"
        },
        {
          name: "rrsp",
          display: "Registered Retirement Savings Plan (RRSP)"
        },
        {
          name: "sarsep_pension",
          display: "Salary Reduction Simplified Employee Pension Plan (SARSEP)"
        },
        {
          name: "sep_ira",
          display: "Simplified Employee Pension IRA (SEP IRA)"
        },
        {
          name: "simple_ira",
          display: "Simple IRA"
        },
        {
          name: "sipp",
          display: "Self-Invested Personal Pension (SIPP)"
        },
        {
          name: "stock_plan",
          display: "Stock Plan"
        },
        {
          name: "thrift_savings_plan",
          display: "Thrift Savings Plan (TSP)"
        },
        {
          name: "trust",
          display: "Trust"
        },
        {
          name: "tfsa",
          display: "Tax-Free Savings Account (TFSA)"
        },
        {
          name: "ugma",
          display: "Uniform Gift to Minors Act (UGMA)"
        },
        {
          name: "utma",
          display: "Uniform Transfers to Minors Act (UTMA)"
        },
        {
          name: "variable_annuity",
          display: "Variable Annuity"
        },
        {
          name: "fhsa",
          display: "First Home Savings Account (FHSA)"
        }
      ]
    },
    {
      typeName: "real_estate",
      typeDisplay: "Real Estate",
      group: "asset",
      subtypes: [
        {
          name: "primary_home",
          display: "Primary Home"
        },
        {
          name: "secondary_home",
          display: "Secondary Home"
        },
        {
          name: "rental_property",
          display: "Rental Property"
        }
      ]
    },
    {
      typeName: "vehicle",
      typeDisplay: "Vehicles",
      group: "asset",
      subtypes: [
        {
          name: "car",
          display: "Car"
        },
        {
          name: "boat",
          display: "Boat"
        },
        {
          name: "motorcycle",
          display: "Motorcycle"
        },
        {
          name: "snowmobile",
          display: "Snowmobile"
        },
        {
          name: "bicycle",
          display: "Bicycle"
        },
        {
          name: "other",
          display: "Other"
        }
      ]
    },
    {
      typeName: "valuables",
      typeDisplay: "Valuables",
      group: "asset",
      subtypes: [
        {
          name: "art",
          display: "Art"
        },
        {
          name: "jewelry",
          display: "Jewelry"
        },
        {
          name: "collectibles",
          display: "Collectibles"
        },
        {
          name: "furniture",
          display: "Furniture"
        },
        {
          name: "other",
          display: "Other"
        }
      ]
    },
    {
      typeName: "credit",
      typeDisplay: "Credit Cards",
      group: "liability",
      subtypes: [
        {
          name: "credit_card",
          display: "Credit Card"
        }
      ]
    },
    {
      typeName: "loan",
      typeDisplay: "Loans",
      group: "liability",
      subtypes: [
        {
          name: "auto",
          display: "Auto"
        },
        {
          name: "business",
          display: "Business"
        },
        {
          name: "commercial",
          display: "Commercial"
        },
        {
          name: "construction",
          display: "Construction"
        },
        {
          name: "consumer",
          display: "Consumer"
        },
        {
          name: "home",
          display: "Home"
        },
        {
          name: "home_equity",
          display: "Home Equity"
        },
        {
          name: "loan",
          display: "Loan"
        },
        {
          name: "mortgage",
          display: "Mortgage"
        },
        {
          name: "overdraft",
          display: "Overdraft"
        },
        {
          name: "line_of_credit",
          display: "Line of Credit"
        },
        {
          name: "student",
          display: "Student"
        }
      ]
    },
    {
      typeName: "other_asset",
      typeDisplay: "Other Assets",
      group: "asset",
      subtypes: [
        {
          name: "other",
          display: "Other"
        }
      ]
    },
    {
      typeName: "other_liability",
      typeDisplay: "Other Liabilities",
      group: "liability",
      subtypes: [
        {
          name: "other",
          display: "Other"
        }
      ]
    }
  ];
  var monarchAccountTypes_default = {
    generatedAt,
    generatedBy,
    data
  };

  // src/utils/string.js
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // src/utils/format.js
  var currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // src/utils/accountTypeUtils.js
  function getAccountTypeByName(typeName) {
    return monarchAccountTypes_default.data.find((t) => t.typeName === typeName);
  }
  function getSubtypeByName(typeName, subtypeName) {
    const type = getAccountTypeByName(typeName);
    return type?.subtypes.find((s) => s.name === subtypeName);
  }

  // src/utils/dom.js
  function toggleDisabled(el, disabled) {
    el.disabled = disabled;
    el.classList.toggle("cursor-default", disabled);
    el.classList.toggle("cursor-pointer", !disabled);
    el.classList.toggle("opacity-50", disabled);
  }
  function toggleElementVisibility(el, show) {
    if (show) {
      el.classList.remove("hidden");
      el.removeAttribute("aria-hidden");
      el.removeAttribute("hidden");
    } else {
      el.classList.add("hidden");
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("hidden", "true");
    }
  }

  // src/views/AccountReview/review.js
  var reviewTableBody;
  var mobileAccountList;
  var importBtn;
  var searchInput;
  var activeFilters = {
    accountName: "",
    nameMatchType: "contains",
    nameCaseSensitive: false,
    types: /* @__PURE__ */ new Set(),
    subtypes: /* @__PURE__ */ new Set(),
    transactionsMin: null,
    transactionsMax: null,
    balanceMin: null,
    balanceMax: null,
    inclusion: "all"
  };
  var searchQuery = "";
  function initAccountReviewView() {
    if (!state_default.accounts || Object.keys(state_default.accounts).length === 0) {
      navigate("/upload", true);
      return;
    }
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Step 2: Review Accounts",
        description: "Review detected accounts and adjust their Monarch types before importing.",
        containerId: "pageHeader"
      }
    });
    reviewTableBody = document.getElementById("reviewTableBody");
    mobileAccountList = document.getElementById("mobileAccountList");
    importBtn = document.getElementById("continueBtn");
    searchInput = document.getElementById("searchInput");
    renderAccountTable();
    setTimeout(() => {
      initializeFiltersModal();
      const totalAccounts = Object.keys(state_default.accounts).length;
      updateAccountCountDisplay(totalAccounts, totalAccounts);
    }, 100);
    let debounceTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = searchInput.value.toLowerCase();
        renderAccountTable();
        persistState();
      }, 200);
    });
    setTimeout(() => {
      const filtersBtn = document.getElementById("filtersBtn");
      if (filtersBtn) {
        console.log("Adding click listener to filters button");
        filtersBtn.addEventListener("click", (e) => {
          console.log("Filters button clicked!");
          e.preventDefault();
          openFiltersModal();
        });
      } else {
        console.error("Filters button not found!");
      }
      const filtersModalClose = document.getElementById("filtersModalClose");
      if (filtersModalClose) {
        filtersModalClose.addEventListener("click", closeFiltersModal);
      }
      const filtersApply = document.getElementById("filtersApply");
      if (filtersApply) {
        filtersApply.addEventListener("click", applyFilters);
      }
      const filtersReset = document.getElementById("filtersReset");
      if (filtersReset) {
        filtersReset.addEventListener("click", resetFilters);
      }
      const clearAllFilters2 = document.getElementById("clearAllFilters");
      if (clearAllFilters2) {
        clearAllFilters2.addEventListener("click", clearAllFilters2);
      }
      const filtersModal = document.getElementById("filtersModal");
      if (filtersModal) {
        filtersModal.addEventListener("click", (e) => {
          if (e.target.id === "filtersModal") {
            closeFiltersModal();
          }
        });
      }
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && filtersModal && !filtersModal.classList.contains("hidden")) {
          closeFiltersModal();
        }
      });
      const clearFiltersBtn = document.getElementById("clearFiltersBtn");
      if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
          resetFilters();
          closeFiltersModal();
        });
      }
    }, 100);
    document.getElementById("unselectAllBtnMobile").addEventListener("click", () => updateSelection(false));
    document.getElementById("unselectAllBtnDesktop").addEventListener("click", () => updateSelection(false));
    document.getElementById("bulkIncludeBtnMobile").addEventListener("click", () => updateInclusion(true));
    document.getElementById("bulkIncludeBtnDesktop").addEventListener("click", () => updateInclusion(true));
    document.getElementById("bulkExcludeBtnMobile").addEventListener("click", () => updateInclusion(false));
    document.getElementById("bulkExcludeBtnDesktop").addEventListener("click", () => updateInclusion(false));
    document.getElementById("bulkRenameBtnMobile").addEventListener("click", openBulkRenameModal);
    document.getElementById("bulkRenameBtnDesktop").addEventListener("click", openBulkRenameModal);
    document.getElementById("bulkTypeBtnMobile").addEventListener("click", openBulkTypeModal);
    document.getElementById("bulkTypeBtnDesktop").addEventListener("click", openBulkTypeModal);
    document.getElementById("masterCheckbox").addEventListener("change", masterCheckboxChange);
    const masterCheckboxMobile = document.getElementById("masterCheckboxMobile");
    if (masterCheckboxMobile) {
      masterCheckboxMobile.addEventListener("change", masterCheckboxChange);
    }
    document.getElementById("continueBtn").addEventListener("click", () => navigate("/method"));
    renderAccountTable();
  }
  function updateSelection(shouldSelect) {
    Object.values(state_default.accounts).forEach((acc) => {
      if (acc.status !== "processed")
        acc.selected = shouldSelect;
    });
    persistState();
    renderAccountTable();
  }
  function updateInclusion(include) {
    Object.values(state_default.accounts).forEach((acc) => {
      if (acc.selected)
        acc.included = include;
    });
    persistState();
    renderAccountTable();
  }
  function renderAccountTable() {
    const fragment = document.createDocumentFragment();
    const mobileFragment = document.createDocumentFragment();
    const accounts2 = Object.values(state_default.accounts);
    let visibleCount2 = 0;
    reviewTableBody.innerHTML = "";
    if (mobileAccountList)
      mobileAccountList.innerHTML = "";
    for (const account of accounts2) {
      if (!passesFilters(account))
        continue;
      if (searchQuery && !account.modifiedName.toLowerCase().includes(searchQuery))
        continue;
      visibleCount2++;
      fragment.appendChild(createAccountRowElement(account));
      if (mobileAccountList) {
        mobileFragment.appendChild(createMobileAccountCard(account));
      }
    }
    reviewTableBody.appendChild(fragment);
    if (mobileAccountList) {
      mobileAccountList.appendChild(mobileFragment);
    }
    updateAccountCountDisplay(visibleCount2, accounts2.length);
    updateMasterCheckbox(getVisibleAccounts());
    refreshBulkActionBar();
    updateMobileSelectionCount();
    const includedCount = accounts2.filter(isIncludedAndUnprocessed).length;
    const hasIncludedAccounts = includedCount > 0;
    toggleDisabled(importBtn, !hasIncludedAccounts);
    importBtn.title = importBtn.disabled ? "At least one account must be included to proceed" : "";
    if (hasIncludedAccounts) {
      importBtn.textContent = `Continue with ${includedCount} account${includedCount !== 1 ? "s" : ""}`;
    } else {
      importBtn.textContent = "Continue";
    }
  }
  function isIncludedAndUnprocessed(account) {
    return account.included && account.status !== "processed";
  }
  function createAccountRowElement(account) {
    const row = document.createElement("tr");
    row.setAttribute("role", "row");
    row.className = "border-t border-[#dce1e5]";
    const isProcessed = account.status === "processed";
    const isFailed = account.status === "failed";
    const checkboxTd = document.createElement("td");
    checkboxTd.className = "px-2 py-2 text-center";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const checkboxId = `account-checkbox-${account.id || account.modifiedName.replace(/\s+/g, "-")}`;
    checkbox.id = checkboxId;
    checkbox.name = checkboxId;
    checkbox.setAttribute("aria-label", `Select account: ${account.modifiedName}`);
    checkbox.className = "w-5 h-5";
    toggleDisabled(checkbox, isProcessed);
    checkbox.checked = account.selected;
    checkbox.addEventListener("change", () => {
      account.selected = checkbox.checked;
      refreshBulkActionBar();
      updateMasterCheckbox(getVisibleAccounts());
    });
    checkboxTd.appendChild(checkbox);
    row.appendChild(checkboxTd);
    const nameTd = document.createElement("td");
    nameTd.className = "px-2 py-2 max-w-[300px] truncate";
    nameTd.textContent = account.modifiedName;
    if (!isProcessed) {
      nameTd.classList.add("cursor-pointer");
      nameTd.title = `Click to rename '${account.modifiedName}'`;
      nameTd.addEventListener("click", () => openNameEditor(account, nameTd));
    } else {
      nameTd.classList.add("text-gray-400", "cursor-default");
    }
    row.appendChild(nameTd);
    const typeTd = document.createElement("td");
    typeTd.className = "px-2 py-2";
    const typeSelect = document.createElement("select");
    const typeId = `type-select-${account.id || account.modifiedName.replace(/\s+/g, "-")}`;
    typeSelect.id = typeId;
    typeSelect.name = typeId;
    typeSelect.title = getAccountTypeByName(account.type)?.typeDisplay || "";
    typeSelect.className = "border rounded px-2 py-1 w-full";
    typeSelect.disabled = isProcessed;
    if (isProcessed)
      typeSelect.classList.add("text-gray-300", "cursor-default");
    else
      typeSelect.classList.add("cursor-pointer");
    monarchAccountTypes_default.data.forEach((type) => {
      const opt = document.createElement("option");
      opt.value = type.typeName;
      opt.textContent = type.typeDisplay;
      if (type.typeName === account.type)
        opt.selected = true;
      typeSelect.appendChild(opt);
    });
    typeSelect.addEventListener("change", () => {
      account.type = typeSelect.value;
      const selectedType2 = getAccountTypeByName(account.type);
      account.subtype = selectedType2?.subtypes[0]?.name || null;
      renderAccountTable();
    });
    typeTd.appendChild(typeSelect);
    row.appendChild(typeTd);
    const subtypeTd = document.createElement("td");
    subtypeTd.className = "px-2 py-2";
    const subtypeSelect = document.createElement("select");
    const subtypeId = `subtype-select-${account.id || account.modifiedName.replace(/\s+/g, "-")}`;
    subtypeSelect.id = subtypeId;
    subtypeSelect.name = subtypeId;
    subtypeSelect.className = "border rounded px-2 py-1 w-full";
    subtypeSelect.disabled = isProcessed;
    if (isProcessed)
      subtypeSelect.classList.add("text-gray-300", "cursor-default");
    else
      subtypeSelect.classList.add("cursor-pointer");
    const selectedType = getAccountTypeByName(account.type);
    subtypeSelect.title = getSubtypeByName(account.type, account.subtype)?.display || "";
    (selectedType?.subtypes || []).forEach((sub) => {
      const opt = document.createElement("option");
      opt.value = sub.name;
      opt.textContent = sub.display;
      if (sub.name === account.subtype)
        opt.selected = true;
      subtypeSelect.appendChild(opt);
    });
    subtypeSelect.addEventListener("change", () => {
      account.subtype = subtypeSelect.value;
      renderAccountTable();
    });
    subtypeTd.appendChild(subtypeSelect);
    row.appendChild(subtypeTd);
    const txTd = document.createElement("td");
    txTd.className = "px-2 py-2 text-center cursor-default";
    txTd.textContent = account.transactionCount;
    txTd.title = `${account.transactionCount} transaction${account.transactionCount !== 1 ? "s" : ""}`;
    if (isProcessed)
      txTd.classList.add("text-gray-400");
    row.appendChild(txTd);
    const balanceTd = document.createElement("td");
    balanceTd.className = "px-2 py-2 text-[#637988] cursor-default";
    balanceTd.textContent = currencyFormatter.format(account.balance);
    balanceTd.title = `Balance: ${currencyFormatter.format(account.balance)}`;
    if (isProcessed)
      balanceTd.classList.add("text-gray-400");
    row.appendChild(balanceTd);
    const includeTd = document.createElement("td");
    includeTd.className = "px-2 py-2 flex items-center gap-2";
    const toggleBtn = document.createElement("button");
    toggleBtn.classList.add("ui-button");
    toggleBtn.dataset.type = account.included ? "primary" : "secondary";
    toggleBtn.dataset.size = "small";
    toggleBtn.textContent = isProcessed ? "Processed" : account.included ? "Included" : "Excluded";
    toggleBtn.disabled = isProcessed;
    toggleBtn.title = isProcessed ? "This account has already been processed" : account.included ? "Click to exclude this account" : "Click to include this account";
    if (!isProcessed) {
      toggleBtn.addEventListener("click", () => {
        account.included = !account.included;
        persistState();
        renderAccountTable();
      });
    }
    includeTd.appendChild(toggleBtn);
    if (isFailed) {
      const errorIcon = document.createElement("span");
      errorIcon.className = "text-red-600 text-xl cursor-default";
      errorIcon.innerHTML = "\u26A0\uFE0F";
      errorIcon.title = "Previously failed to process";
      includeTd.appendChild(errorIcon);
    }
    row.appendChild(includeTd);
    return row;
  }
  function createMobileAccountCard(account) {
    const card = document.createElement("div");
    card.className = "mobile-account-card";
    const isProcessed = account.status === "processed";
    const isFailed = account.status === "failed";
    const checkboxContainer = document.createElement("label");
    checkboxContainer.className = "custom-checkbox-container flex-shrink-0";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "custom-checkbox-input";
    const checkboxId = `mobile-account-checkbox-${account.id || account.modifiedName.replace(/\s+/g, "-")}`;
    checkbox.id = checkboxId;
    checkbox.name = checkboxId;
    checkbox.setAttribute("aria-label", `Select account: ${account.modifiedName}`);
    checkbox.disabled = isProcessed;
    checkbox.checked = account.selected || false;
    checkbox.addEventListener("change", () => {
      account.selected = checkbox.checked;
      persistState();
      refreshBulkActionBar();
      updateMasterCheckbox(getVisibleAccounts());
      updateMobileSelectionCount();
    });
    const checkboxVisual = document.createElement("span");
    checkboxVisual.className = "custom-checkbox-visual";
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkboxVisual);
    card.appendChild(checkboxContainer);
    const contentDiv = document.createElement("div");
    contentDiv.className = "card-content";
    const nameDiv = document.createElement("div");
    nameDiv.className = "account-name";
    nameDiv.textContent = account.modifiedName;
    if (!isProcessed) {
      nameDiv.classList.add("cursor-pointer", "hover:text-blue-600", "transition-colors", "duration-200");
      nameDiv.title = `Click to rename '${account.modifiedName}'`;
      nameDiv.addEventListener("click", () => openNameEditor(account, nameDiv));
    } else {
      nameDiv.classList.add("text-gray-400", "cursor-default");
    }
    contentDiv.appendChild(nameDiv);
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "account-details";
    const typeRow = document.createElement("div");
    typeRow.className = "flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4";
    const typeContainer = document.createElement("div");
    typeContainer.className = "flex items-center gap-2 flex-1 min-w-0";
    const typeLabel = document.createElement("span");
    typeLabel.textContent = "Type:";
    typeLabel.className = "text-xs font-medium text-gray-500 flex-shrink-0";
    const typeSelect = document.createElement("select");
    const typeId = `mobile-type-select-${account.id || account.modifiedName.replace(/\s+/g, "-")}`;
    typeSelect.id = typeId;
    typeSelect.name = typeId;
    typeSelect.title = getAccountTypeByName(account.type)?.typeDisplay || "";
    typeSelect.className = "border border-gray-300 rounded-lg px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white";
    typeSelect.disabled = isProcessed;
    if (isProcessed)
      typeSelect.classList.add("text-gray-300", "bg-gray-50", "cursor-not-allowed");
    else
      typeSelect.classList.add("cursor-pointer");
    monarchAccountTypes_default.data.forEach((type) => {
      const opt = document.createElement("option");
      opt.value = type.typeName;
      opt.textContent = type.typeDisplay;
      if (type.typeName === account.type)
        opt.selected = true;
      typeSelect.appendChild(opt);
    });
    typeSelect.addEventListener("change", () => {
      account.type = typeSelect.value;
      const selectedType2 = getAccountTypeByName(account.type);
      account.subtype = selectedType2?.subtypes[0]?.name || null;
      renderAccountTable();
    });
    typeContainer.appendChild(typeLabel);
    typeContainer.appendChild(typeSelect);
    typeRow.appendChild(typeContainer);
    const subtypeContainer = document.createElement("div");
    subtypeContainer.className = "flex items-center gap-2 flex-1 min-w-0";
    const subtypeLabel = document.createElement("span");
    subtypeLabel.textContent = "Sub:";
    subtypeLabel.className = "text-xs font-medium text-gray-500 flex-shrink-0";
    const subtypeSelect = document.createElement("select");
    const subtypeId = `mobile-subtype-select-${account.id || account.modifiedName.replace(/\s+/g, "-")}`;
    subtypeSelect.id = subtypeId;
    subtypeSelect.name = subtypeId;
    subtypeSelect.className = "border border-gray-300 rounded-lg px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white";
    subtypeSelect.disabled = isProcessed;
    if (isProcessed)
      subtypeSelect.classList.add("text-gray-300", "bg-gray-50", "cursor-not-allowed");
    else
      subtypeSelect.classList.add("cursor-pointer");
    const selectedType = getAccountTypeByName(account.type);
    subtypeSelect.title = getSubtypeByName(account.type, account.subtype)?.display || "";
    (selectedType?.subtypes || []).forEach((sub) => {
      const opt = document.createElement("option");
      opt.value = sub.name;
      opt.textContent = sub.display;
      if (sub.name === account.subtype)
        opt.selected = true;
      subtypeSelect.appendChild(opt);
    });
    subtypeSelect.addEventListener("change", () => {
      account.subtype = subtypeSelect.value;
      renderAccountTable();
    });
    subtypeContainer.appendChild(subtypeLabel);
    subtypeContainer.appendChild(subtypeSelect);
    typeRow.appendChild(subtypeContainer);
    detailsDiv.appendChild(typeRow);
    const statsRow = document.createElement("div");
    statsRow.className = "flex justify-between items-center";
    const transactionInfo = document.createElement("span");
    transactionInfo.className = isProcessed ? "text-gray-400" : "text-gray-600";
    transactionInfo.textContent = `${account.transactionCount} transaction${account.transactionCount !== 1 ? "s" : ""}`;
    const balanceInfo = document.createElement("span");
    balanceInfo.className = `account-balance ${isProcessed ? "text-gray-400" : "text-gray-900"}`;
    balanceInfo.textContent = currencyFormatter.format(account.balance);
    statsRow.appendChild(transactionInfo);
    statsRow.appendChild(balanceInfo);
    detailsDiv.appendChild(statsRow);
    const actionRow = document.createElement("div");
    actionRow.className = "flex items-center justify-end pt-1";
    if (!isProcessed) {
      const toggleBtn = document.createElement("button");
      toggleBtn.className = `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${account.included ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-500" : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 focus:ring-green-500"}`;
      toggleBtn.textContent = account.included ? "Exclude" : "Include";
      toggleBtn.title = account.included ? "Click to exclude this account" : "Click to include this account";
      toggleBtn.addEventListener("click", () => {
        account.included = !account.included;
        renderAccountTable();
      });
      actionRow.appendChild(toggleBtn);
    }
    if (isFailed) {
      const errorIcon = document.createElement("span");
      errorIcon.className = "text-red-600 text-lg cursor-default ml-2";
      errorIcon.innerHTML = "\u26A0\uFE0F";
      errorIcon.title = "Previously failed to process";
      actionRow.appendChild(errorIcon);
    }
    detailsDiv.appendChild(actionRow);
    contentDiv.appendChild(detailsDiv);
    card.appendChild(contentDiv);
    return card;
  }
  function updateMasterCheckbox(visibleAccounts) {
    const masterCheckbox = document.getElementById("masterCheckbox");
    const masterCheckboxMobile = document.getElementById("masterCheckboxMobile");
    const selectedCount = visibleAccounts.filter((acc) => acc.selected).length;
    const isChecked = selectedCount > 0 && selectedCount === visibleAccounts.length;
    const isIndeterminate = selectedCount > 0 && selectedCount < visibleAccounts.length;
    if (masterCheckbox) {
      masterCheckbox.checked = isChecked;
      masterCheckbox.indeterminate = isIndeterminate;
    }
    if (masterCheckboxMobile) {
      masterCheckboxMobile.checked = isChecked;
      masterCheckboxMobile.indeterminate = isIndeterminate;
    }
    updateMobileSelectionCount();
  }
  function updateMobileSelectionCount() {
    const countElement = document.getElementById("mobileSelectionCount");
    if (countElement) {
      const selectedCount = Object.values(state_default.accounts).filter((acc) => acc.selected).length;
      countElement.textContent = `${selectedCount} selected`;
    }
  }
  function getVisibleAccounts() {
    return Object.values(state_default.accounts).filter((account) => {
      if (account.status === "processed")
        return false;
      if (!passesFilters(account))
        return false;
      if (searchQuery && !account.modifiedName.toLowerCase().includes(searchQuery))
        return false;
      return true;
    });
  }
  function masterCheckboxChange(e) {
    const checked = e.target.checked;
    getVisibleAccounts().forEach((acc) => {
      acc.selected = checked;
    });
    renderAccountTable();
  }
  function refreshBulkActionBar() {
    const bar = document.getElementById("bulkActionBar");
    const selectedCount = Object.values(state_default.accounts).filter((acc) => acc.selected).length;
    const mobileCountSpan = document.getElementById("selectedCountMobile");
    if (mobileCountSpan) {
      mobileCountSpan.textContent = selectedCount;
    }
    const desktopCountSpan = document.getElementById("selectedCountDesktop");
    if (desktopCountSpan) {
      desktopCountSpan.textContent = selectedCount;
    }
    if (selectedCount > 0) {
      bar.classList.remove("hidden");
      bar.classList.add("active");
    } else {
      bar.classList.remove("active");
      setTimeout(() => {
        if (!bar.classList.contains("active")) {
          bar.classList.add("hidden");
        }
      }, 300);
    }
  }
  function openNameEditor(account, nameCell) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 opacity-0 transition-opacity duration-200";
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("opacity-100"));
    const popup = document.createElement("div");
    popup.className = "bg-white rounded-lg shadow-lg p-5 w-[400px]";
    const title = document.createElement("h2");
    title.className = "font-bold mb-3 text-lg";
    title.textContent = "Edit Account Name";
    popup.appendChild(title);
    const input = document.createElement("input");
    input.type = "text";
    input.value = account.modifiedName;
    input.setAttribute("aria-label", "Account name input");
    input.className = "border rounded w-full px-3 py-2 mb-4";
    popup.appendChild(input);
    const buttonRow = document.createElement("div");
    buttonRow.className = "flex justify-end gap-2";
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "bg-gray-300 px-4 py-2 rounded";
    cancelBtn.addEventListener("click", () => closeEditor());
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "bg-blue-500 text-white px-4 py-2 rounded font-bold";
    saveBtn.addEventListener("click", save);
    buttonRow.appendChild(cancelBtn);
    buttonRow.appendChild(saveBtn);
    popup.appendChild(buttonRow);
    overlay.appendChild(popup);
    input.focus();
    input.select();
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape")
        closeEditor();
      if (e.key === "Enter")
        save();
    });
    function closeEditor() {
      overlay.classList.remove("opacity-100");
      overlay.classList.add("opacity-0");
      setTimeout(() => document.body.removeChild(overlay), 200);
    }
    function save() {
      account.modifiedName = input.value.trim();
      nameCell.textContent = account.modifiedName;
      nameCell.title = `Click to rename '${account.modifiedName}'`;
      closeEditor();
    }
  }
  function openBulkRenameModal() {
    const modal = document.getElementById("bulkRenameModal");
    const renamePattern = document.getElementById("renamePattern");
    const indexStartInput = document.getElementById("indexStart");
    const previewDiv = document.getElementById("renamePreview");
    const cancelBtn = document.getElementById("renameCancel");
    const applyBtn = document.getElementById("renameApply");
    const tokenButtons = modal.querySelectorAll(".token-btn");
    modal.classList.remove("hidden");
    renamePattern.focus();
    const selectedAccounts = Object.values(state_default.accounts).filter((acc) => acc.selected);
    tokenButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const token = btn.dataset.token;
        renamePattern.value += token;
        updatePreview();
      });
    });
    renamePattern.addEventListener("input", updatePreview);
    indexStartInput.addEventListener("input", updatePreview);
    updatePreview();
    function updatePreview() {
      previewDiv.innerHTML = "";
      const pattern = renamePattern.value;
      const indexStart = parseInt(indexStartInput.value, 10) || 1;
      selectedAccounts.slice(0, 3).forEach((acc, i) => {
        const previewName = applyPattern(pattern, acc, i + indexStart);
        const div = document.createElement("div");
        div.textContent = previewName;
        previewDiv.appendChild(div);
      });
    }
    cancelBtn.onclick = () => modal.classList.add("hidden");
    applyBtn.onclick = () => {
      const pattern = renamePattern.value;
      const indexStart = parseInt(indexStartInput.value, 10) || 1;
      selectedAccounts.forEach((acc, i) => {
        acc.modifiedName = applyPattern(pattern, acc, i + indexStart);
      });
      modal.classList.add("hidden");
      renderAccountTable();
    };
  }
  function applyPattern(pattern, account, index) {
    const today = new Date().toISOString().split("T")[0];
    return pattern.replace(/{{YNAB}}/g, account.originalYnabName?.trim() || account.name || "Account").replace(/{{Index}}/g, index).replace(/{{Upper}}/g, (account.originalYnabName?.trim() || account.name || "Account").toUpperCase()).replace(/{{Date}}/g, today);
  }
  function openBulkTypeModal() {
    const modal = document.getElementById("bulkTypeModal");
    const typeSelect = document.getElementById("bulkTypeSelect");
    const subtypeSelect = document.getElementById("bulkSubtypeSelect");
    const cancelBtn = document.getElementById("bulkTypeCancel");
    const applyBtn = document.getElementById("bulkTypeApply");
    modal.classList.remove("hidden");
    typeSelect.innerHTML = "";
    monarchAccountTypes_default.data.forEach((type) => {
      const opt = document.createElement("option");
      opt.value = type.typeName;
      opt.textContent = type.typeDisplay;
      typeSelect.appendChild(opt);
    });
    function updateSubtypeOptions() {
      const selectedType = getAccountTypeByName(typeSelect.value);
      subtypeSelect.innerHTML = "";
      (selectedType?.subtypes || []).forEach((sub) => {
        const opt = document.createElement("option");
        opt.value = sub.name;
        opt.textContent = sub.display;
        subtypeSelect.appendChild(opt);
      });
      if ((selectedType?.subtypes || []).length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "-";
        subtypeSelect.appendChild(opt);
      }
    }
    typeSelect.addEventListener("change", updateSubtypeOptions);
    updateSubtypeOptions();
    cancelBtn.onclick = () => modal.classList.add("hidden");
    applyBtn.onclick = () => {
      const typeValue = typeSelect.value;
      const subtypeValue = subtypeSelect.value;
      const selectedAccounts = Object.values(state_default.accounts).filter((acc) => acc.selected);
      selectedAccounts.forEach((acc) => {
        acc.type = typeValue;
        acc.subtype = subtypeValue || null;
      });
      modal.classList.add("hidden");
      renderAccountTable();
    };
  }
  function initializeFiltersModal() {
    console.log("Initializing filters modal...");
    try {
      populateTypeFilters();
      populateSubtypeFilters();
      updateFilterDisplay();
      console.log("Filters modal initialized successfully");
    } catch (error) {
      console.error("Error initializing filters modal:", error);
    }
  }
  function populateTypeFilters() {
    const container = document.getElementById("typeFiltersContainer");
    if (!container) {
      console.error("typeFiltersContainer not found");
      return;
    }
    const types = [...new Set(monarchAccountTypes_default.data.map((type) => type.typeDisplay))].sort();
    container.innerHTML = "";
    types.forEach((type) => {
      const checkbox = createFilterCheckbox("type", type, type);
      container.appendChild(checkbox);
    });
    console.log(`Populated ${types.length} type filters`);
  }
  function populateSubtypeFilters() {
    const container = document.getElementById("subtypeFiltersContainer");
    if (!container) {
      console.error("subtypeFiltersContainer not found");
      return;
    }
    const subtypes = /* @__PURE__ */ new Set();
    monarchAccountTypes_default.data.forEach((type) => {
      type.subtypes.forEach((subtype) => {
        subtypes.add(subtype.display);
      });
    });
    const sortedSubtypes = [...subtypes].sort();
    container.innerHTML = "";
    sortedSubtypes.forEach((subtype) => {
      const checkbox = createFilterCheckbox("subtype", subtype, subtype);
      container.appendChild(checkbox);
    });
    console.log(`Populated ${sortedSubtypes.length} subtype filters`);
  }
  function createFilterCheckbox(filterType, value, label) {
    const div = document.createElement("div");
    div.className = "flex items-center";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `filter-${filterType}-${value.replace(/\s+/g, "-")}`;
    checkbox.value = value;
    checkbox.className = "w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded";
    checkbox.addEventListener("change", updateFilterDisplay);
    const labelEl = document.createElement("label");
    labelEl.htmlFor = checkbox.id;
    labelEl.className = "ml-2 text-sm text-gray-700 cursor-pointer";
    labelEl.textContent = label;
    div.appendChild(checkbox);
    div.appendChild(labelEl);
    return div;
  }
  function openFiltersModal() {
    console.log("Opening filters modal...");
    try {
      const filterAccountName = document.getElementById("filterAccountName");
      if (filterAccountName) {
        filterAccountName.value = activeFilters.accountName;
      }
      const nameMatchType = document.querySelector(`input[name="nameMatchType"][value="${activeFilters.nameMatchType}"]`);
      if (nameMatchType) {
        nameMatchType.checked = true;
      }
      const nameCaseSensitive = document.getElementById("nameCaseSensitive");
      if (nameCaseSensitive) {
        nameCaseSensitive.checked = activeFilters.nameCaseSensitive;
      }
      document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach((cb) => {
        cb.checked = activeFilters.types.has(cb.value);
      });
      document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach((cb) => {
        cb.checked = activeFilters.subtypes.has(cb.value);
      });
      const filterTransactionsMin = document.getElementById("filterTransactionsMin");
      if (filterTransactionsMin) {
        filterTransactionsMin.value = activeFilters.transactionsMin || "";
      }
      const filterTransactionsMax = document.getElementById("filterTransactionsMax");
      if (filterTransactionsMax) {
        filterTransactionsMax.value = activeFilters.transactionsMax || "";
      }
      const filterBalanceMin = document.getElementById("filterBalanceMin");
      if (filterBalanceMin) {
        filterBalanceMin.value = activeFilters.balanceMin || "";
      }
      const filterBalanceMax = document.getElementById("filterBalanceMax");
      if (filterBalanceMax) {
        filterBalanceMax.value = activeFilters.balanceMax || "";
      }
      const inclusionFilter = document.querySelector(`input[name="inclusionFilter"][value="${activeFilters.inclusion}"]`);
      if (inclusionFilter) {
        inclusionFilter.checked = true;
      }
      const modal = document.getElementById("filtersModal");
      if (modal) {
        console.log("Found modal, showing it...");
        modal.classList.remove("hidden");
        setTimeout(() => modal.classList.add("show"), 10);
      } else {
        console.error("Modal not found!");
      }
    } catch (error) {
      console.error("Error opening filters modal:", error);
    }
  }
  window.openFiltersModal = openFiltersModal;
  function closeFiltersModal() {
    const modal = document.getElementById("filtersModal");
    modal.classList.remove("show");
    setTimeout(() => modal.classList.add("hidden"), 300);
  }
  window.closeFiltersModal = closeFiltersModal;
  function applyFilters() {
    console.log("Apply filters button clicked!");
    try {
      const filterAccountName = document.getElementById("filterAccountName");
      activeFilters.accountName = filterAccountName ? filterAccountName.value.trim() : "";
      const nameMatchType = document.querySelector('input[name="nameMatchType"]:checked');
      activeFilters.nameMatchType = nameMatchType ? nameMatchType.value : "contains";
      const nameCaseSensitive = document.getElementById("nameCaseSensitive");
      activeFilters.nameCaseSensitive = nameCaseSensitive ? nameCaseSensitive.checked : false;
      activeFilters.types.clear();
      document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]:checked').forEach((cb) => {
        activeFilters.types.add(cb.value);
      });
      activeFilters.subtypes.clear();
      document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]:checked').forEach((cb) => {
        activeFilters.subtypes.add(cb.value);
      });
      const transMin = document.getElementById("filterTransactionsMin");
      const transMax = document.getElementById("filterTransactionsMax");
      activeFilters.transactionsMin = transMin && transMin.value ? parseInt(transMin.value) : null;
      activeFilters.transactionsMax = transMax && transMax.value ? parseInt(transMax.value) : null;
      const balMin = document.getElementById("filterBalanceMin");
      const balMax = document.getElementById("filterBalanceMax");
      activeFilters.balanceMin = balMin && balMin.value ? parseFloat(balMin.value) : null;
      activeFilters.balanceMax = balMax && balMax.value ? parseFloat(balMax.value) : null;
      const inclusionFilter = document.querySelector('input[name="inclusionFilter"]:checked');
      activeFilters.inclusion = inclusionFilter ? inclusionFilter.value : "all";
      console.log("Applied filters:", activeFilters);
      closeFiltersModal();
      renderAccountTable();
      updateFilterDisplay();
      persistState();
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  }
  window.applyFilters = applyFilters;
  function resetFilters() {
    console.log("Reset filters button clicked!");
    try {
      const filterAccountName = document.getElementById("filterAccountName");
      if (filterAccountName)
        filterAccountName.value = "";
      const containsRadio = document.querySelector('input[name="nameMatchType"][value="contains"]');
      if (containsRadio)
        containsRadio.checked = true;
      const nameCaseSensitive = document.getElementById("nameCaseSensitive");
      if (nameCaseSensitive)
        nameCaseSensitive.checked = false;
      document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach((cb) => cb.checked = false);
      document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach((cb) => cb.checked = false);
      const filterTransactionsMin = document.getElementById("filterTransactionsMin");
      if (filterTransactionsMin)
        filterTransactionsMin.value = "";
      const filterTransactionsMax = document.getElementById("filterTransactionsMax");
      if (filterTransactionsMax)
        filterTransactionsMax.value = "";
      const filterBalanceMin = document.getElementById("filterBalanceMin");
      if (filterBalanceMin)
        filterBalanceMin.value = "";
      const filterBalanceMax = document.getElementById("filterBalanceMax");
      if (filterBalanceMax)
        filterBalanceMax.value = "";
      const allRadio = document.querySelector('input[name="inclusionFilter"][value="all"]');
      if (allRadio)
        allRadio.checked = true;
      activeFilters = {
        accountName: "",
        nameMatchType: "contains",
        nameCaseSensitive: false,
        types: /* @__PURE__ */ new Set(),
        subtypes: /* @__PURE__ */ new Set(),
        transactionsMin: null,
        transactionsMax: null,
        balanceMin: null,
        balanceMax: null,
        inclusion: "all"
      };
      renderAccountTable();
      updateFilterDisplay();
      persistState();
      closeFiltersModal();
      console.log("Filters reset successfully");
    } catch (error) {
      console.error("Error resetting filters:", error);
    }
  }
  window.resetFilters = resetFilters;
  function clearAllFilters() {
    console.log("Clear all filters clicked!");
    resetFilters();
    closeFiltersModal();
  }
  window.clearAllFilters = clearAllFilters;
  function updateFilterDisplay() {
    const filterCount = document.getElementById("filterCount");
    const activeFiltersSection = document.getElementById("activeFiltersSection");
    const activeFiltersContainer = document.getElementById("activeFiltersContainer");
    let activeFilterCount = 0;
    const filterChips = [];
    if (activeFilters.accountName) {
      activeFilterCount++;
      filterChips.push(createFilterChip("Name", `${activeFilters.nameMatchType}: "${activeFilters.accountName}"`, () => {
        activeFilters.accountName = "";
        document.getElementById("filterAccountName").value = "";
        renderAccountTable();
        updateFilterDisplay();
      }));
    }
    if (activeFilters.types.size > 0) {
      activeFilterCount++;
      const typeList = [...activeFilters.types].join(", ");
      filterChips.push(createFilterChip("Types", typeList, () => {
        activeFilters.types.clear();
        document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach((cb) => cb.checked = false);
        renderAccountTable();
        updateFilterDisplay();
      }));
    }
    if (activeFilters.subtypes.size > 0) {
      activeFilterCount++;
      const subtypeList = [...activeFilters.subtypes].join(", ");
      filterChips.push(createFilterChip("Subtypes", subtypeList, () => {
        activeFilters.subtypes.clear();
        document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach((cb) => cb.checked = false);
        renderAccountTable();
        updateFilterDisplay();
      }));
    }
    if (activeFilters.transactionsMin !== null || activeFilters.transactionsMax !== null) {
      activeFilterCount++;
      const min = activeFilters.transactionsMin || 0;
      const max = activeFilters.transactionsMax || "\u221E";
      filterChips.push(createFilterChip("Transactions", `${min} - ${max}`, () => {
        activeFilters.transactionsMin = null;
        activeFilters.transactionsMax = null;
        document.getElementById("filterTransactionsMin").value = "";
        document.getElementById("filterTransactionsMax").value = "";
        renderAccountTable();
        updateFilterDisplay();
      }));
    }
    if (activeFilters.balanceMin !== null || activeFilters.balanceMax !== null) {
      activeFilterCount++;
      const min = activeFilters.balanceMin !== null ? `$${activeFilters.balanceMin}` : "$0";
      const max = activeFilters.balanceMax !== null ? `$${activeFilters.balanceMax}` : "\u221E";
      filterChips.push(createFilterChip("Balance", `${min} - ${max}`, () => {
        activeFilters.balanceMin = null;
        activeFilters.balanceMax = null;
        document.getElementById("filterBalanceMin").value = "";
        document.getElementById("filterBalanceMax").value = "";
        renderAccountTable();
        updateFilterDisplay();
      }));
    }
    if (activeFilters.inclusion !== "all") {
      activeFilterCount++;
      filterChips.push(createFilterChip("Status", capitalize(activeFilters.inclusion), () => {
        activeFilters.inclusion = "all";
        document.querySelector('input[name="inclusionFilter"][value="all"]').checked = true;
        renderAccountTable();
        updateFilterDisplay();
      }));
    }
    if (activeFilterCount > 0) {
      filterCount.textContent = activeFilterCount;
      filterCount.classList.remove("hidden");
    } else {
      filterCount.classList.add("hidden");
    }
    if (filterChips.length > 0) {
      activeFiltersSection.classList.remove("hidden");
      activeFiltersContainer.innerHTML = "";
      filterChips.forEach((chip) => activeFiltersContainer.appendChild(chip));
    } else {
      activeFiltersSection.classList.add("hidden");
    }
    updateAccountCountDisplay(visibleCount, accounts.length);
  }
  function createFilterChip(label, value, onRemove) {
    const chip = document.createElement("div");
    chip.className = "filter-chip";
    const content = document.createElement("span");
    content.textContent = `${label}: ${value}`;
    const removeBtn = document.createElement("button");
    removeBtn.onclick = onRemove;
    removeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
    chip.appendChild(content);
    chip.appendChild(removeBtn);
    return chip;
  }
  function passesFilters(account) {
    if (activeFilters.accountName) {
      const accountName = activeFilters.nameCaseSensitive ? account.modifiedName : account.modifiedName.toLowerCase();
      const filterName = activeFilters.nameCaseSensitive ? activeFilters.accountName : activeFilters.accountName.toLowerCase();
      if (activeFilters.nameMatchType === "exact") {
        if (accountName !== filterName)
          return false;
      } else {
        if (!accountName.includes(filterName))
          return false;
      }
    }
    if (activeFilters.types.size > 0) {
      const accountType = getAccountTypeByName(account.type);
      const typeDisplay = accountType ? accountType.typeDisplay : account.type || "";
      if (!activeFilters.types.has(typeDisplay))
        return false;
    }
    if (activeFilters.subtypes.size > 0) {
      const accountSubtype = getSubtypeByName(account.subtype);
      const subtypeDisplay = accountSubtype ? accountSubtype.display : account.subtype || "";
      if (!activeFilters.subtypes.has(subtypeDisplay))
        return false;
    }
    const transactionCount = account.transactionCount || 0;
    if (activeFilters.transactionsMin !== null && transactionCount < activeFilters.transactionsMin)
      return false;
    if (activeFilters.transactionsMax !== null && transactionCount > activeFilters.transactionsMax)
      return false;
    const balance = parseFloat(account.balance) || 0;
    if (activeFilters.balanceMin !== null && balance < activeFilters.balanceMin)
      return false;
    if (activeFilters.balanceMax !== null && balance > activeFilters.balanceMax)
      return false;
    if (activeFilters.inclusion === "included" && !account.included)
      return false;
    if (activeFilters.inclusion === "excluded" && account.included)
      return false;
    return true;
  }
  function updateAccountCountDisplay(visibleCount2, totalCount) {
    const visibleAccountCount = document.getElementById("visibleAccountCount");
    const totalAccountCount = document.getElementById("totalAccountCount");
    const filterResultsSummary = document.getElementById("filterResultsSummary");
    const filterNotificationBadge = document.getElementById("filterNotificationBadge");
    const clearFiltersBtn = document.getElementById("clearFiltersBtn");
    if (visibleAccountCount)
      visibleAccountCount.textContent = visibleCount2;
    if (totalAccountCount)
      totalAccountCount.textContent = totalCount;
    const hasFilters = hasActiveFilters();
    const filterCount = countActiveFilters();
    if (hasFilters && filterCount > 0 && filterNotificationBadge) {
      filterNotificationBadge.textContent = filterCount;
      filterNotificationBadge.classList.remove("hidden");
    } else if (filterNotificationBadge) {
      filterNotificationBadge.classList.add("hidden");
    }
    if (hasFilters && clearFiltersBtn) {
      clearFiltersBtn.classList.remove("hidden");
    } else if (clearFiltersBtn) {
      clearFiltersBtn.classList.add("hidden");
    }
    if (hasFilters && filterResultsSummary) {
      filterResultsSummary.classList.add("filtered");
    } else if (filterResultsSummary) {
      filterResultsSummary.classList.remove("filtered");
    }
  }
  function hasActiveFilters() {
    return activeFilters.accountName || activeFilters.types.size > 0 || activeFilters.subtypes.size > 0 || activeFilters.transactionsMin !== null || activeFilters.transactionsMax !== null || activeFilters.balanceMin !== null || activeFilters.balanceMax !== null || activeFilters.inclusion !== "all";
  }
  function countActiveFilters() {
    let count = 0;
    if (activeFilters.accountName) {
      count++;
    }
    if (activeFilters.types.size > 0) {
      count++;
    }
    if (activeFilters.subtypes.size > 0) {
      count++;
    }
    if (activeFilters.transactionsMin !== null || activeFilters.transactionsMax !== null) {
      count++;
    }
    if (activeFilters.balanceMin !== null || activeFilters.balanceMax !== null) {
      count++;
    }
    if (activeFilters.inclusion !== "all") {
      count++;
    }
    return count;
  }

  // src/views/AccountReview/review.html
  var review_default = '<div id="pageLayout"></div>\n\n<!-- Control Bar -->\n<div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between \n                p-4 sm:p-6 gap-4 lg:gap-6 bg-white rounded-lg mb-4 sm:mb-6 \n                border border-gray-100 shadow-sm">\n\n  <!-- Filters, Search and Account Summary -->\n  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1">\n    <!-- Filters Button -->\n    <div class="flex-shrink-0">\n      <button id="filtersBtn" class="flex items-center gap-2 px-4 py-2 sm:py-3 text-sm sm:text-base\n                         border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer \n                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500\n                         relative whitespace-nowrap" title="Open advanced filters"\n        onclick="window.openFiltersModal && window.openFiltersModal()">\n        <!-- Notification Badge -->\n        <div id="filterNotificationBadge" class="hidden"></div>\n\n        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />\n        </svg>\n        <span>Filters</span>\n      </button>\n    </div>\n\n    <!-- Search Input -->\n    <div class="flex-1 max-w-md">\n      <div class="relative">\n        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">\n          <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />\n          </svg>\n        </div>\n        <input id="searchInput" type="text" placeholder="Search accounts..." style="padding-left: 2.75rem !important;"\n          class="block w-full pr-3 py-2 sm:py-3 text-sm sm:text-base\n                          border border-gray-300 rounded-lg placeholder-gray-400 \n                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 \n                          transition-colors duration-200">\n      </div>\n    </div>\n\n    <!-- Account Count Summary -->\n    <div id="filterResultsSummary" class="text-sm text-gray-600 whitespace-nowrap">\n      Showing <span id="visibleAccountCount" class="font-medium text-gray-900">0</span>\n      of <span id="totalAccountCount" class="font-medium text-gray-900">0</span> accounts\n    </div>\n  </div>\n\n  <!-- Clear Filter Controls -->\n  <div class="flex items-center gap-3">\n    <!-- Clear All Filters Button (only shown when filters are active) -->\n    <button id="clearFiltersBtn" class="hidden px-3 py-2 sm:py-3 text-sm text-red-600 hover:text-red-800 \n                       hover:bg-red-50 rounded-lg transition-colors duration-200 \n                       focus:outline-none focus:ring-2 focus:ring-red-500" title="Clear all filters"\n      onclick="window.clearAllFilters && window.clearAllFilters()">\n      Clear\n    </button>\n  </div>\n</div>\n\n<!-- Table Container -->\n<div class="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">\n\n  <!-- Mobile Card View (hidden on larger screens) -->\n  <div id="mobileView" class="block lg:hidden">\n    <!-- Mobile Header with Master Checkbox -->\n    <div class="border-b border-gray-200 bg-gray-50 p-4">\n      <div class="flex items-center justify-between">\n        <label class="custom-checkbox-container">\n          <input type="checkbox" id="masterCheckboxMobile" class="custom-checkbox-input">\n          <span class="custom-checkbox-visual"></span>\n          <span class="text-sm font-medium text-gray-700 pl-2">Select All</span>\n        </label>\n        <div class="text-xs text-gray-500 font-medium" id="mobileSelectionCount">0 selected</div>\n      </div>\n    </div>\n\n    <div id="mobileAccountList" class="divide-y divide-gray-100">\n      <!-- populated dynamically for mobile -->\n    </div>\n  </div>\n\n  <!-- Desktop Table View (hidden on mobile) -->\n  <div class="hidden lg:block overflow-x-auto">\n    <table class="w-full min-w-[800px]" role="grid">\n      <thead>\n        <tr class="bg-gray-50 border-b border-gray-200" role="row">\n          <th\n            class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 w-[50px] sm:w-[60px]">\n            <input type="checkbox" id="masterCheckbox" class="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer rounded border-gray-300 \n                              text-blue-600 focus:ring-blue-500 focus:ring-2">\n          </th>\n          <th scope="col"\n            class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[200px]">\n            Account Name\n          </th>\n          <th scope="col"\n            class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[150px]">\n            Type\n          </th>\n          <th scope="col"\n            class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[150px]">\n            Subtype\n          </th>\n          <th scope="col"\n            class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[100px] text-center">\n            Transactions\n          </th>\n          <th scope="col"\n            class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[120px] text-right">\n            Balance\n          </th>\n          <th scope="col"\n            class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[100px] text-center">\n            Include\n          </th>\n        </tr>\n      </thead>\n      <tbody id="reviewTableBody" class="divide-y divide-gray-100">\n        <!-- populated dynamically -->\n      </tbody>\n    </table>\n  </div>\n</div>\n\n<button id="continueBtn" class="ui-button">\n  Continue\n</button>\n\n<!-- Bulk Action Bar -->\n<div id="bulkActionBar"\n  class="hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">\n\n  <!-- Mobile Bulk Actions (visible on mobile/tablet) -->\n  <div\n    class="block lg:hidden bg-white shadow-2xl rounded-xl border border-gray-200 w-[calc(100vw-2rem)] max-w-md mx-auto">\n    <div class="p-4">\n      <div class="flex flex-col gap-3">\n        <!-- Selection Info -->\n        <div class="flex items-center justify-between">\n          <span class="text-sm font-medium text-gray-900">\n            <span id="selectedCountMobile">0</span> selected\n          </span>\n          <button id="unselectAllBtnMobile" class="text-xs font-medium px-3 py-1.5 border border-gray-300 text-gray-700 \n                             bg-white rounded-md hover:bg-gray-50 cursor-pointer transition-colors \n                             duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"\n            title="Unselect all accounts">\n            Clear\n          </button>\n        </div>\n\n        <!-- Action Buttons Grid -->\n        <div class="grid grid-cols-2 gap-2">\n          <button id="bulkRenameBtnMobile" class="flex items-center justify-center gap-2 px-3 py-3 border border-gray-300 \n                             bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors \n                             duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"\n            title="Bulk rename accounts">\n            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />\n            </svg>\n            <span class="text-sm font-medium">Rename</span>\n          </button>\n\n          <button id="bulkTypeBtnMobile" class="flex items-center justify-center gap-2 px-3 py-3 border border-gray-300 \n                             bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors \n                             duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"\n            title="Bulk edit account types">\n            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />\n            </svg>\n            <span class="text-sm font-medium">Edit Type</span>\n          </button>\n\n          <button id="bulkIncludeBtnMobile" class="flex items-center justify-center gap-2 px-3 py-3 border border-green-300 \n                             text-green-700 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer \n                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"\n            title="Include selected accounts">\n            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />\n            </svg>\n            <span class="text-sm font-medium">Include</span>\n          </button>\n\n          <button id="bulkExcludeBtnMobile" class="flex items-center justify-center gap-2 px-3 py-3 border border-red-300 \n                             text-red-700 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer \n                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"\n            title="Exclude selected accounts">\n            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />\n            </svg>\n            <span class="text-sm font-medium">Exclude</span>\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Desktop Bulk Actions (visible on desktop) -->\n  <div class="hidden lg:block bg-white shadow-2xl rounded-xl border border-gray-200">\n    <div class="px-6 py-4">\n      <div class="flex items-center gap-6">\n        <!-- Selection Count -->\n        <button id="unselectAllBtnDesktop" class="text-sm font-medium px-4 py-2 border border-gray-300 \n                           rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors \n                           duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"\n          title="Unselect all accounts">\n          <span id="selectedCountDesktop">0</span> selected\n        </button>\n\n        <!-- Separator -->\n        <div class="h-6 border-l border-gray-300"></div>\n\n        <!-- Action Buttons -->\n        <div class="flex items-center gap-3">\n          <button id="bulkRenameBtnDesktop" class="text-sm font-medium px-4 py-2 border border-gray-300 \n                             rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200\n                             focus:outline-none focus:ring-2 focus:ring-blue-500" title="Bulk rename accounts">\n            Rename\n          </button>\n\n          <button id="bulkTypeBtnDesktop" class="text-sm font-medium px-4 py-2 border border-gray-300 \n                             rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200\n                             focus:outline-none focus:ring-2 focus:ring-blue-500" title="Bulk edit account types">\n            Edit Type\n          </button>\n\n          <button id="bulkIncludeBtnDesktop" class="text-sm font-medium px-4 py-2 border border-green-300 \n                             text-green-700 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer \n                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"\n            title="Include selected accounts">\n            Include\n          </button>\n\n          <button id="bulkExcludeBtnDesktop" class="text-sm font-medium px-4 py-2 border border-red-300 \n                             text-red-700 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer \n                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"\n            title="Exclude selected accounts">\n            Exclude\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- Bulk Rename Modal -->\n<div id="bulkRenameModal"\n  class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 hidden p-3 sm:p-4">\n  <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">\n\n    <h2 class="text-lg sm:text-xl font-bold mb-4">Bulk Rename Accounts</h2>\n\n    <label for="renamePattern" class="font-medium text-sm">Pattern:</label>\n    <input id="renamePattern" name="renamePattern" type="text"\n      class="border rounded w-full px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"\n      placeholder="e.g. {{YNAB}} - {{Index}}">\n\n    <!-- Token shortcuts -->\n    <div class="grid grid-cols-2 gap-2 mb-4">\n      <button\n        class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-xs sm:text-sm cursor-pointer transition-colors duration-200"\n        data-token="{{YNAB}}">YNAB Name</button>\n      <button\n        class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-xs sm:text-sm cursor-pointer transition-colors duration-200"\n        data-token="{{Index}}">Index</button>\n      <button\n        class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-xs sm:text-sm cursor-pointer transition-colors duration-200"\n        data-token="{{Upper}}">Uppercase YNAB</button>\n      <button\n        class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-xs sm:text-sm cursor-pointer transition-colors duration-200"\n        data-token="{{Date}}">Today (YYYY-MM-DD)</button>\n    </div>\n\n    <!-- Index start -->\n    <div class="flex items-center gap-3 mb-4">\n      <label for="indexStart" class="text-sm">Index Start:</label>\n      <input id="indexStart" type="number"\n        class="border rounded px-3 py-2 w-20 sm:w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"\n        value="1" />\n    </div>\n\n    <!-- Preview -->\n    <div class="border rounded p-3 bg-gray-50 mb-4">\n      <div class="font-medium text-sm mb-2">Preview:</div>\n      <div id="renamePreview" class="text-xs sm:text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto"\n        aria-live="polite"></div>\n    </div>\n\n    <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">\n      <button id="renameCancel" class="ui-button order-2 sm:order-1 w-full sm:w-auto"\n        data-type="secondary">Cancel</button>\n      <button id="renameApply" class="ui-button order-1 sm:order-2 w-full sm:w-auto" data-type="primary">Apply</button>\n    </div>\n\n  </div>\n</div>\n\n<!-- Bulk Type Edit Modal -->\n<div id="bulkTypeModal"\n  class="fixed inset-0 bg-black bg-opacity-40 hidden z-50 flex items-center justify-center p-3 sm:p-4">\n  <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">\n    <h2 class="text-lg font-bold mb-4">Bulk Edit Account Type</h2>\n\n    <div class="mb-4">\n      <label for="bulkTypeSelect" class="block mb-2 font-medium text-sm">Account Type</label>\n      <select id="bulkTypeSelect" name="bulkSubtypeSelect"\n        class="border rounded w-full px-3 py-2 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></select>\n    </div>\n\n    <div class="mb-6">\n      <label for="bulkSubtypeSelect" class="block mb-2 font-medium text-sm">Subtype</label>\n      <select id="bulkSubtypeSelect"\n        class="border rounded w-full px-3 py-2 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></select>\n    </div>\n\n    <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">\n      <button id="bulkTypeCancel" class="ui-button order-2 sm:order-1 w-full sm:w-auto"\n        data-type="secondary">Cancel</button>\n      <button id="bulkTypeApply" class="ui-button order-1 sm:order-2 w-full sm:w-auto"\n        data-type="primary">Apply</button>\n    </div>\n  </div>\n</div>\n\n<!-- Advanced Filters Modal -->\n<div id="filtersModal"\n  class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 hidden p-3 sm:p-4">\n  <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col relative">\n\n    <!-- Modal Header -->\n    <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0 rounded-t-lg">\n      <h2 class="text-lg sm:text-xl font-bold text-gray-900">Advanced Filters</h2>\n      <button id="filtersModalClose"\n        class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"\n        title="Close filters" onclick="window.closeFiltersModal && window.closeFiltersModal()">\n        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />\n        </svg>\n      </button>\n    </div>\n\n    <!-- Modal Content - Scrollable -->\n    <div class="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 min-h-0">\n\n      <!-- Active Filters Display -->\n      <div id="activeFiltersSection" class="hidden">\n        <div class="flex items-center justify-between mb-3">\n          <h3 class="text-sm font-medium text-gray-700">Active Filters</h3>\n          <button id="clearAllFilters"\n            class="text-xs text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"\n            onclick="window.clearAllFilters && window.clearAllFilters()">\n            Clear All\n          </button>\n        </div>\n        <div id="activeFiltersContainer" class="flex flex-wrap gap-2"></div>\n        <hr class="mt-4">\n      </div>\n\n      <!-- Account Name Filter -->\n      <div class="space-y-3">\n        <h3 class="text-sm font-medium text-gray-900">Account Name</h3>\n        <div class="space-y-3">\n          <input id="filterAccountName" type="text" placeholder="Enter account name..."\n            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">\n\n          <div class="flex flex-wrap gap-4">\n            <label class="flex items-center">\n              <input type="radio" name="nameMatchType" value="contains" checked\n                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">\n              <span class="ml-2 text-sm text-gray-700">Contains</span>\n            </label>\n            <label class="flex items-center">\n              <input type="radio" name="nameMatchType" value="exact"\n                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">\n              <span class="ml-2 text-sm text-gray-700">Exact match</span>\n            </label>\n            <label class="flex items-center">\n              <input type="checkbox" id="nameCaseSensitive"\n                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">\n              <span class="ml-2 text-sm text-gray-700">Case sensitive</span>\n            </label>\n          </div>\n        </div>\n      </div>\n\n      <!-- Account Type Filter -->\n      <div class="space-y-3">\n        <h3 class="text-sm font-medium text-gray-900">Account Type</h3>\n        <div class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">\n          <div id="typeFiltersContainer" class="space-y-2">\n            <!-- Populated dynamically -->\n          </div>\n        </div>\n      </div>\n\n      <!-- Account Subtype Filter -->\n      <div class="space-y-3">\n        <h3 class="text-sm font-medium text-gray-900">Account Subtype</h3>\n        <div class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">\n          <div id="subtypeFiltersContainer" class="space-y-2">\n            <!-- Populated dynamically -->\n          </div>\n        </div>\n      </div>\n\n      <!-- Transactions Count Filter -->\n      <div class="space-y-3">\n        <h3 class="text-sm font-medium text-gray-900">Transaction Count</h3>\n        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">\n          <div>\n            <label class="block text-xs text-gray-600 mb-1">Minimum</label>\n            <input id="filterTransactionsMin" type="number" placeholder="0" min="0"\n              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">\n          </div>\n          <div>\n            <label class="block text-xs text-gray-600 mb-1">Maximum</label>\n            <input id="filterTransactionsMax" type="number" placeholder="999999" min="0"\n              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">\n          </div>\n        </div>\n      </div>\n\n      <!-- Balance Filter -->\n      <div class="space-y-3">\n        <h3 class="text-sm font-medium text-gray-900">Balance</h3>\n        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">\n          <div>\n            <label class="block text-xs text-gray-600 mb-1">Minimum ($)</label>\n            <input id="filterBalanceMin" type="number" placeholder="0.00" step="0.01"\n              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">\n          </div>\n          <div>\n            <label class="block text-xs text-gray-600 mb-1">Maximum ($)</label>\n            <input id="filterBalanceMax" type="number" placeholder="999999.99" step="0.01"\n              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">\n          </div>\n        </div>\n      </div>\n\n      <!-- Inclusion Status Filter -->\n      <div class="space-y-3">\n        <h3 class="text-sm font-medium text-gray-900">Include Status</h3>\n        <div class="flex flex-wrap gap-4">\n          <label class="flex items-center">\n            <input type="radio" name="inclusionFilter" value="all" checked\n              class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">\n            <span class="ml-2 text-sm text-gray-700">All accounts</span>\n          </label>\n          <label class="flex items-center">\n            <input type="radio" name="inclusionFilter" value="included"\n              class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">\n            <span class="ml-2 text-sm text-gray-700">Included only</span>\n          </label>\n          <label class="flex items-center">\n            <input type="radio" name="inclusionFilter" value="excluded"\n              class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">\n            <span class="ml-2 text-sm text-gray-700">Excluded only</span>\n          </label>\n        </div>\n      </div>\n    </div>\n\n    <!-- Modal Footer - Fixed at bottom -->\n    <div\n      class="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg flex-shrink-0">\n      <button id="filtersReset" class="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 \n                     cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"\n        onclick="window.resetFilters && window.resetFilters()">\n        Reset Filters\n      </button>\n      <button id="filtersApply" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer \n                     transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"\n        onclick="window.applyFilters && window.applyFilters()">\n        Apply Filters\n      </button>\n    </div>\n  </div>\n</div>\n\n<style>\n  /* Filter chip styles */\n  .filter-chip {\n    display: inline-flex;\n    align-items: center;\n    gap: 0.5rem;\n    background-color: #dbeafe;\n    color: #1e40af;\n    padding: 0.25rem 0.75rem;\n    border-radius: 9999px;\n    font-size: 0.75rem;\n    font-weight: 500;\n    max-width: 250px;\n  }\n\n  .filter-chip span {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  /* Mini filter chips for status bar */\n  .filter-chip-mini {\n    display: inline-flex;\n    align-items: center;\n    background-color: #1e40af;\n    color: white;\n    padding: 0.125rem 0.5rem;\n    border-radius: 9999px;\n    font-size: 0.625rem;\n    font-weight: 500;\n    max-width: 120px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  /* Filter results summary styling */\n  #filterResultsSummary {\n    transition: all 0.3s ease;\n  }\n\n  #filterResultsSummary.filtered {\n    color: #1e40af;\n    font-weight: 500;\n  }\n\n  /* Filter notification badge */\n  #filtersBtn {\n    position: relative;\n  }\n\n  #filterNotificationBadge {\n    position: absolute;\n    top: -8px;\n    right: -8px;\n    background-color: #dc2626;\n    color: white;\n    border-radius: 50%;\n    width: 20px;\n    height: 20px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 0.75rem;\n    font-weight: 600;\n    line-height: 1;\n    border: 2px solid white;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n    transition: all 0.2s ease;\n    z-index: 10;\n  }\n\n  #filterNotificationBadge.hidden {\n    display: none;\n  }\n\n  /* Clear filters button animation */\n  #clearFiltersBtn {\n    transition: all 0.3s ease;\n    transform: scale(0.95);\n    opacity: 0;\n  }\n\n  #clearFiltersBtn:not(.hidden) {\n    transform: scale(1);\n    opacity: 1;\n  }\n\n  .filter-chip button {\n    background: none;\n    border: none;\n    color: inherit;\n    cursor: pointer;\n    padding: 0;\n    margin-left: 0.25rem;\n    border-radius: 50%;\n    width: 1rem;\n    height: 1rem;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    transition: background-color 0.2s;\n  }\n\n  .filter-chip button:hover {\n    background-color: rgba(59, 130, 246, 0.2);\n  }\n\n  .filter-chip svg {\n    width: 0.75rem;\n    height: 0.75rem;\n  }\n\n  /* Modal animation and layout */\n  #filtersModal {\n    transition: opacity 0.3s ease;\n    opacity: 0;\n  }\n\n  #filtersModal.show {\n    opacity: 1;\n  }\n\n  #filtersModal.hide {\n    opacity: 0;\n  }\n\n  /* Ensure proper modal sizing and scrolling */\n  #filtersModal .max-w-2xl {\n    min-height: 300px;\n  }\n\n  /* Improve mobile modal experience */\n  @media (max-width: 640px) {\n    #filtersModal .max-w-2xl {\n      max-width: calc(100vw - 1.5rem);\n      margin: 0.75rem;\n    }\n\n    #filtersModal .max-h-\\[90vh\\] {\n      max-height: calc(100vh - 1.5rem);\n    }\n\n    /* Ensure footer buttons are properly sized on mobile */\n    #filtersModal .flex-col.sm\\:flex-row button {\n      min-height: 44px;\n    }\n  }\n\n  /* Bulk action bar styling */\n  #bulkActionBar {\n    transition: opacity 0.3s ease, transform 0.3s ease;\n  }\n\n  #bulkActionBar:not(.active) {\n    opacity: 0;\n    transform: translateY(-10px);\n    pointer-events: none;\n  }\n\n  #bulkActionBar.active {\n    opacity: 1;\n    transform: translateY(0);\n    pointer-events: auto;\n  }\n\n  /* Enhanced button hover effects */\n  #bulkActionBar button:hover {\n    transform: translateY(-1px);\n    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  }\n\n  #bulkActionBar button:active {\n    transform: translateY(0);\n  }\n\n  /* Mobile grid button sizing */\n  @media (max-width: 1024px) {\n    #bulkActionBar .grid button {\n      min-height: 48px;\n    }\n  }\n\n  /* Mobile card styles for accounts */\n  .mobile-account-card {\n    padding: 1rem;\n    border-bottom: 1px solid #f3f4f6;\n    position: relative;\n    display: flex;\n    align-items: flex-start;\n    gap: 0.75rem;\n  }\n\n  .mobile-account-card:last-child {\n    border-bottom: none;\n  }\n\n  .mobile-account-card .card-content {\n    flex: 1;\n    min-width: 0;\n  }\n\n  .mobile-account-card .account-name {\n    font-weight: 500;\n    color: #111827;\n    margin-bottom: 0.5rem;\n    word-wrap: break-word;\n  }\n\n  .mobile-account-card .account-details {\n    font-size: 0.875rem;\n    color: #6b7280;\n  }\n\n  .mobile-account-card .account-details>div {\n    margin-bottom: 0.5rem;\n  }\n\n  .mobile-account-card .account-balance {\n    font-weight: 500;\n    text-align: right;\n  }\n\n  /* Custom checkbox styling */\n  .custom-checkbox-container {\n    display: flex;\n    align-items: center;\n    cursor: pointer;\n    user-select: none;\n    position: relative;\n  }\n\n  .custom-checkbox-input {\n    position: absolute;\n    opacity: 0;\n    cursor: pointer;\n    height: 0;\n    width: 0;\n  }\n\n  .custom-checkbox-visual {\n    position: relative;\n    height: 20px;\n    width: 20px;\n    background-color: #ffffff;\n    border: 2px solid #d1d5db;\n    border-radius: 4px;\n    transition: all 0.2s ease;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  .custom-checkbox-visual::after {\n    content: "";\n    position: absolute;\n    display: none;\n    left: 6px;\n    top: 2px;\n    width: 4px;\n    height: 8px;\n    border: solid white;\n    border-width: 0 2px 2px 0;\n    transform: rotate(45deg);\n  }\n\n  .custom-checkbox-input:checked+.custom-checkbox-visual {\n    background-color: #3b82f6;\n    border-color: #3b82f6;\n  }\n\n  .custom-checkbox-input:checked+.custom-checkbox-visual::after {\n    display: block;\n  }\n\n  .custom-checkbox-input:focus+.custom-checkbox-visual {\n    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);\n    outline: none;\n  }\n\n  .custom-checkbox-input:disabled+.custom-checkbox-visual {\n    background-color: #f3f4f6;\n    border-color: #e5e7eb;\n    cursor: not-allowed;\n  }\n\n  .custom-checkbox-container:hover .custom-checkbox-input:not(:disabled)+.custom-checkbox-visual {\n    border-color: #3b82f6;\n  }\n\n  /* Mobile specific enhancements */\n  @media (max-width: 1024px) {\n    .custom-checkbox-visual {\n      height: 24px;\n      width: 24px;\n      min-width: 24px;\n      min-height: 24px;\n    }\n\n    .custom-checkbox-visual::after {\n      left: 8px;\n      top: 3px;\n      width: 5px;\n      height: 10px;\n    }\n\n    button,\n    select {\n      min-height: 44px;\n      padding: 0.75rem;\n    }\n\n    .token-btn {\n      min-height: 44px;\n    }\n\n    input[type="text"],\n    input[type="number"] {\n      min-height: 44px;\n      padding: 0.75rem;\n    }\n  }\n</style>';

  // src/components/navigationBar.js
  function renderNavigationBar2(options = {}) {
    const {
      showBackButton = true,
      showDataButton = true,
      backText = "Back",
      containerId = "navigationBar"
    } = options;
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Navigation container with id "${containerId}" not found`);
      return;
    }
    const hasData = checkForStoredData2();
    const dataButtonText = hasData ? "Manage your data" : "No data currently stored";
    let navHTML = '<div class="flex flex-wrap items-center justify-between gap-2 mb-4">';
    if (showBackButton) {
      navHTML += `
      <button 
        id="navBackBtn" 
        class="ui-button flex items-center text-sm"
        data-type="text"
        data-size="small"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        ${backText}
      </button>
    `;
    } else {
      navHTML += "<div></div>";
    }
    if (showDataButton) {
      navHTML += `
      <button 
        id="navDataBtn" 
        class="ui-button text-xs sm:text-sm"
        data-type="text"
        data-size="small"
        ${!hasData ? 'style="opacity: 0.6; cursor: default;"' : ""}
      >
        ${dataButtonText}
      </button>
    `;
    }
    navHTML += "</div>";
    container.innerHTML = navHTML;
    renderButtons();
    if (showBackButton) {
      const backBtn = document.getElementById("navBackBtn");
      backBtn?.addEventListener("click", () => {
        goBack();
      });
    }
    if (showDataButton) {
      const dataBtn = document.getElementById("navDataBtn");
      dataBtn?.addEventListener("click", () => {
        if (hasData) {
          navigate("/data-management");
        }
      });
    }
  }
  function checkForStoredData2() {
    const hasStateAccounts = state_default.accounts && Object.keys(state_default.accounts).length > 0;
    const hasMonarchAccounts = state_default.monarchAccounts !== null;
    const hasSessionAccounts = sessionStorage.getItem("ynab_accounts") !== null;
    const hasSessionMonarch = sessionStorage.getItem("monarch_accounts") !== null;
    const localStorage2 = getLocalStorage();
    const hasLocalStorageData = !!(localStorage2.email || localStorage2.encryptedPassword || localStorage2.token || localStorage2.uuid);
    return hasStateAccounts || hasMonarchAccounts || hasSessionAccounts || hasSessionMonarch || hasLocalStorageData;
  }

  // src/components/pageHeader.js
  function renderPageHeader2(options = {}) {
    const {
      title = "",
      description = "",
      containerId = "pageHeader",
      className = ""
    } = options;
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Page header container with id "${containerId}" not found`);
      return;
    }
    const headerHTML = `
    <section class="text-center mb-5 ${className}">
      <div class="inline-flex items-center justify-center gap-2 mb-6">
        <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          ${escapeHtml2(title)}
        </h2>
      </div>

      <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 leading-relaxed">
        ${escapeHtml2(description)}
      </p>
    </section>
  `;
    container.innerHTML = headerHTML;
  }
  function escapeHtml2(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // src/views/MethodSelect/method.js
  function initMethodSelectView() {
    if (!state_default.accounts || Object.keys(state_default.accounts).length === 0) {
      navigate("/upload", true);
      return;
    }
    renderPageLayout();
    renderNavigationBar2({
      showBackButton: true,
      showDataButton: true
    });
    renderPageHeader2({
      title: "Choose Your Migration Method",
      description: "You can either manually import your accounts into Monarch or let us automatically import your data.",
      containerId: "pageHeader"
    });
    renderButtons();
    const totalCount = Object.keys(state_default.accounts).length;
    const selectedCount = Object.values(state_default.accounts).filter((acc) => acc.included).length;
    document.getElementById("totalCountDisplay").textContent = totalCount;
    document.getElementById("filesCountDisplay").textContent = selectedCount;
    document.getElementById("manualFileCount").textContent = selectedCount;
    const manualBtn = document.getElementById("manualImportBtn");
    const autoBtn = document.getElementById("autoImportBtn");
    manualBtn.addEventListener("click", () => {
      navigate("/manual");
    });
    autoBtn.addEventListener("click", () => {
      navigate("/login");
    });
  }

  // src/views/MethodSelect/method.html
  var method_default = `<div id="pageLayout"></div>

<!-- Summary Counts -->
<div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10 
          bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 md:p-8 
          border border-blue-100 w-full max-w-2xl mx-auto shadow-sm">

  <div class="text-center">
    <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800" id="totalCountDisplay">0</div>
    <div class="text-gray-600 text-xs sm:text-sm md:text-base font-medium">Total Accounts</div>
  </div>

  <div class="hidden sm:block w-px h-12 bg-gray-300"></div>
  <div class="sm:hidden w-full h-px bg-gray-300"></div>

  <div class="text-center">
    <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600" id="filesCountDisplay">0</div>
    <div class="text-gray-600 text-xs sm:text-sm md:text-base font-medium">Accounts To Migrate</div>
  </div>
</div>

<!-- Migration Options -->
<div class="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl mx-auto">

  <!-- Manual Import -->
  <div class="w-full lg:flex-1 group cursor-pointer" id="manualImportBtn">
      <div class="h-full p-4 sm:p-6 md:p-8 border-2 border-gray-200 rounded-xl shadow-sm 
                hover:shadow-lg hover:border-blue-300 transition-all duration-300 
                bg-white group-hover:bg-blue-50/30 relative overflow-hidden">

        <div class="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <h3 class="text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-gray-900">Manual Import</h3>
          <p class="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed min-h-[3rem]">
            Download <span id="manualFileCount" class="font-semibold text-blue-600">0</span> CSV files and upload them directly into Monarch yourself. Perfect for users who prefer full control.
          </p>

          <div class="flex items-center text-blue-600 font-semibold text-sm sm:text-base group-hover:text-blue-700 transition-colors duration-300">
            Select Manual Import
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Auto Import -->
    <div class="w-full lg:flex-1 group cursor-pointer" id="autoImportBtn">
      <div class="h-full p-4 sm:p-6 md:p-8 border-2 border-gray-200 rounded-xl shadow-sm 
                hover:shadow-lg hover:border-green-300 transition-all duration-300 
                bg-white group-hover:bg-green-50/30 relative overflow-hidden">

        <div class="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

        <div class="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          Recommended
        </div>

        <div class="relative z-10 pt-6">
          <div class="flex items-start justify-between mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="text-green-600 group-hover:text-green-700 transition-colors duration-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <h3 class="text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-gray-900">Auto Import</h3>
          <p class="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed min-h-[3rem]">
            We'll connect to Monarch and automatically import your selected accounts on your behalf. Fast, secure, and hassle-free.
          </p>

          <div class="flex items-center text-green-600 font-semibold text-sm sm:text-base group-hover:text-green-700 transition-colors duration-300">
            Select Auto Import
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

</div>`;

  // src/views/ManualInstructions/manualInstructions.js
  var import_jszip2 = __toESM(require_jszip_min(), 1);

  // shared/generateCsv.js
  function generateCSV(accountName, transactions) {
    const headers = `"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"`;
    const rows = transactions.map((tx) => `"${tx.Date}","${tx.Merchant}","${tx.Category}","${accountName}","","${tx.Notes}","${tx.Amount}","${tx.Tags}"`);
    return [headers, ...rows].join("\n");
  }

  // src/views/ManualInstructions/manualInstructions.js
  function initManualInstructionsView() {
    if (!state_default.accounts || Object.keys(state_default.accounts).length === 0) {
      navigate("/upload", true);
      return;
    }
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "You're Ready to Import",
        description: "Choose how you'd like to bring your YNAB data into Monarch Money. You can either connect your YNAB account for a seamless transfer or manually upload a file.",
        containerId: "pageHeader"
      }
    });
    const downloadBtn = document.getElementById("downloadBtn");
    const switchBtn = document.getElementById("switchToAuto");
    const includedAccounts = Object.values(state_default.accounts).filter((acc) => acc.included);
    countSpan.textContent = `${includedAccounts.length} account${includedAccounts.length !== 1 ? "s" : ""}`;
    downloadBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const zip = new import_jszip2.default();
      const MAX_ROWS_PER_FILE = 1e3;
      includedAccounts.forEach((account) => {
        const safeName = account.name.replace(/[\\/:*?"<>|]/g, "_");
        const transactions = account.transactions;
        const total = transactions.length;
        if (total <= MAX_ROWS_PER_FILE) {
          const csv = generateCSV(account.name, transactions);
          zip.file(`${safeName}.csv`, csv);
        } else {
          const chunks = Math.ceil(total / MAX_ROWS_PER_FILE);
          for (let i = 0; i < chunks; i++) {
            const start = i * MAX_ROWS_PER_FILE;
            const end = start + MAX_ROWS_PER_FILE;
            const chunk = transactions.slice(start, end);
            const chunkCsv = generateCSV(account.name, chunk);
            zip.file(`${safeName}_part${i + 1}.csv`, chunkCsv);
          }
        }
      });
      try {
        const content = await zip.generateAsync({ type: "blob" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(content);
        downloadLink.download = "accounts_export.zip";
        downloadLink.click();
      } catch (e2) {
        console.error("\u274C ZIP generation failed", e2);
        alert("Failed to generate ZIP file.");
      }
    });
    switchBtn.addEventListener("click", () => {
      navigate("/login");
    });
  }

  // src/views/ManualInstructions/manualInstructions.html
  var manualInstructions_default = `<div id="pageLayout"></div>

<!-- Main Instructions Card -->
<div
  class="w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 md:p-10 space-y-8 sm:space-y-10">

  <!-- Step 1: Download -->
  <div class="relative">
    <!-- Step Number -->
    <div class="flex items-center mb-4 sm:mb-6">
      <div
        class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 text-blue-600 rounded-full font-bold text-sm sm:text-base mr-3 sm:mr-4">
        1
      </div>
      <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Download Files</h3>
    </div>

    <div class="ml-11 sm:ml-14">
      <p class="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
        Download a ZIP file containing one CSV per account. Each CSV is formatted
        specifically for Monarch Money import.
      </p>

      <a id="downloadBtn" class="ui-button inline-flex items-center btn-responsive" data-type="primary"
        data-size="large" href="#">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 4v12" />
        </svg>
        Download CSV Bundle
      </a>
    </div>
  </div>

  <!-- Divider -->
  <div class="relative">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t border-gray-200"></div>
    </div>
    <div class="relative flex justify-center">
      <div class="px-4 bg-white">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </div>

  <!-- Step 2: Import Instructions -->
  <div class="relative">
    <!-- Step Number -->
    <div class="flex items-center mb-4 sm:mb-6">
      <div
        class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-100 text-green-600 rounded-full font-bold text-sm sm:text-base mr-3 sm:mr-4">
        2
      </div>
      <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Import into Monarch</h3>
    </div>

    <div class="ml-11 sm:ml-14">
      <p class="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
        Follow these steps in your Monarch Money account to import each CSV file:
      </p>

      <div class="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-100">
        <ol class="space-y-3 sm:space-y-4">
          <li class="flex items-start gap-3">
            <span
              class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
              a
            </span>
            <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
              Go to <strong class="text-gray-900">Accounts \u2192 Add account</strong>
            </div>
          </li>

          <li class="flex items-start gap-3">
            <span
              class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
              b
            </span>
            <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
              Choose <strong class="text-gray-900">Add manual account</strong>
            </div>
          </li>

          <li class="flex items-start gap-3">
            <span
              class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
              c
            </span>
            <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
              Select your desired <strong class="text-gray-900">account type</strong>
            </div>
          </li>

          <li class="flex items-start gap-3">
            <span
              class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
              d
            </span>
            <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
              Give it a name and starting balance of <strong
                class="text-gray-900 bg-yellow-100 px-1 rounded">$0.00</strong>
            </div>
          </li>

          <li class="flex items-start gap-3">
            <span
              class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
              e
            </span>
            <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
              Go to <strong class="text-gray-900">Edit \u2192 Upload transactions</strong>
            </div>
          </li>

          <li class="flex items-start gap-3">
            <span
              class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
              f
            </span>
            <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
              Upload your account CSV file
            </div>
          </li>

          <li class="flex items-start gap-3">
            <span
              class="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
              g
            </span>
            <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
              <strong class="text-green-700">Enable</strong>
              <em>"Adjust account's balances based on these transactions"</em>
            </div>
          </li>

          <li class="flex items-start gap-3">
            <span
              class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
              h
            </span>
            <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
              Click <strong class="text-gray-900">Add to account</strong>
            </div>
          </li>

          <li class="flex items-start gap-3">
            <span
              class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
              i
            </span>
            <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
              <strong class="text-blue-600">Repeat for all your accounts</strong>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</div>

<!-- Auto Import Promotion -->
<div
  class="flex flex-col items-center text-center gap-4 sm:gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 md:p-10 border border-blue-100 w-full max-w-4xl shadow-sm">

  <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
    <svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  </div>

  <div>
    <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
      Want us to do this automatically?
    </h3>
    <p class="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
      Skip the manual work! Our auto-import feature can handle all of this for you
      securely and automatically.
    </p>
  </div>

  <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
    <button id="switchToAuto" class="ui-button btn-responsive" data-type="primary" data-size="large">
      Try Auto Import Instead
    </button>
  </div>
</div>`;

  // node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }

  // node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      if (typeof crypto === "undefined" || !crypto.getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
      getRandomValues = crypto.getRandomValues.bind(crypto);
    }
    return getRandomValues(rnds8);
  }

  // node_modules/uuid/dist/esm-browser/native.js
  var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  var native_default = { randomUUID };

  // node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    if (native_default.randomUUID && !buf && !options) {
      return native_default.randomUUID();
    }
    options = options || {};
    const rnds = options.random ?? options.rng?.() ?? rng();
    if (rnds.length < 16) {
      throw new Error("Random bytes length must be >= 16");
    }
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      if (offset < 0 || offset + 16 > buf.length) {
        throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
      }
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  var v4_default = v4;

  // src/api/utils.js
  async function postJson(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data2 = await res.json();
    if (!res.ok) {
      throw new Error(data2.error || data2.message || "API error");
    }
    return data2;
  }

  // src/api/monarchApi.js
  var monarchApi = {
    login: (email, encryptedPassword, deviceUuid, otp) => postJson(API.login, { email, encryptedPassword, deviceUuid, otp }),
    fetchMonarchAccounts: (token) => postJson(API.fetchAccounts, { token }),
    createAccounts: (token, accounts2) => postJson(API.createAccounts, { token, accounts: accounts2 }),
    generateAccounts: (accounts2) => fetch(API.generateStatements, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accounts: accounts2 })
    }),
    queryUploadStatus: (token, sessionKey) => postJson(API.getUploadStatus, { token, sessionKey })
  };

  // shared/cryptoSpec.js
  var SALT = "monarch-app-salt";
  var PBKDF2_ITERATIONS = 1e5;
  var ALGORITHM_WEB = "AES-GCM";
  var AUTH_TAG_LENGTH = 16;
  var IV_LENGTH = 12;
  var DIGEST = "SHA-256";

  // shared/crypto.js
  function concatBuffers(...buffers) {
    let totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
    let combined = new Uint8Array(totalLength);
    let offset = 0;
    for (let b of buffers) {
      combined.set(b, offset);
      offset += b.length;
    }
    return combined;
  }
  async function encryptPassword(email, plaintextPassword) {
    console.group("encryptPassword");
    try {
      const encoder = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
      const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(email), { name: "PBKDF2" }, false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey({
        name: "PBKDF2",
        salt: encoder.encode(SALT),
        iterations: PBKDF2_ITERATIONS,
        hash: DIGEST
      }, keyMaterial, { name: ALGORITHM_WEB, length: 256 }, true, ["encrypt"]);
      const encoded = encoder.encode(plaintextPassword);
      const encrypted = await crypto.subtle.encrypt({ name: ALGORITHM_WEB, iv }, key, encoded);
      const bytes = new Uint8Array(encrypted);
      const tag = bytes.slice(-AUTH_TAG_LENGTH);
      const ciphertext = bytes.slice(0, -AUTH_TAG_LENGTH);
      const full = concatBuffers(iv, ciphertext, tag);
      return btoa(String.fromCharCode(...full));
    } catch (err) {
      console.error("\u274C Error encrypting password:", err);
      console.groupEnd("encryptPassword");
      throw new Error("Failed to encrypt password. Please try again.");
    }
  }

  // src/utils/state.js
  function patchState(target, updates) {
    if (!target || typeof target !== "object")
      throw new Error("Target must be an object");
    Object.entries(updates).forEach(([key, value]) => {
      target[key] = value;
    });
  }
  function clearState(target) {
    if (!target || typeof target !== "object")
      throw new Error("Target must be an object");
    Object.keys(target).forEach((key) => {
      const value = target[key];
      if (Array.isArray(value))
        target[key] = [];
      else if (typeof value === "object" && value !== null)
        target[key] = {};
      else if (typeof value === "boolean")
        target[key] = false;
      else
        target[key] = "";
    });
  }

  // src/views/MonarchCredentials/monarchCredentials.js
  async function initMonarchCredentialsView() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Auto Import: Connect Your Monarch Account",
        description: "Authorize your Monarch account so we can directly import your accounts and transactions.",
        containerId: "pageHeader"
      }
    });
    const $ = (id) => document.getElementById(id);
    const UI = {
      emailInput: $("email"),
      passwordInput: $("password"),
      connectBtn: $("connectBtn"),
      backBtn: $("backBtn"),
      form: $("credentialsForm"),
      errorBox: $("errorBox"),
      errorContainer: $("credentialsError"),
      rememberCheckbox: $("rememberCredentials"),
      rememberMeContainer: $("rememberMe"),
      notYouContainer: $("notYouContainer"),
      rememberedEmail: $("rememberedEmail"),
      clearCredentialsBtn: $("clearCredentialsBtn"),
      toggleBtn: $("togglePassword"),
      eyeShow: $("eyeShow"),
      eyeHide: $("eyeHide"),
      securityNoteMsg: $("securityNote"),
      securityNoteIcon: $("securityNoteIcon")
    };
    const { credentials: creds } = state_default;
    const { token, email, encryptedPassword, uuid, remember } = getLocalStorage();
    patchState(creds, {
      email,
      encryptedPassword,
      apiToken: creds.apiToken || token,
      deviceUuid: creds.deviceUuid || uuid,
      remember
    });
    if (!creds.deviceUuid || creds.deviceUuid === "") {
      creds.deviceUuid = v4_default();
      saveToLocalStorage({ uuid: creds.deviceUuid });
    }
    if (email && encryptedPassword) {
      UI.emailInput.value = email;
      UI.passwordInput.value = "";
      UI.rememberedEmail.textContent = `Signed in as ${email}`;
      UI.rememberCheckbox.checked = creds.remember;
      toggleDisabled(UI.emailInput, true);
      toggleDisabled(UI.passwordInput, true);
      toggleElementVisibility(UI.rememberMeContainer, false);
      toggleElementVisibility(UI.notYouContainer, true);
      toggleElementVisibility(UI.toggleBtn, false);
      updateSecurityNote("signed-in");
    } else {
      toggleElementVisibility(UI.notYouContainer, false);
      updateSecurityNote();
    }
    function validateForm() {
      const hasEmail = UI.emailInput.value.trim();
      const hasPassword = UI.passwordInput.value.trim() || creds.encryptedPassword;
      toggleDisabled(UI.connectBtn, !(hasEmail && hasPassword));
      toggleElementVisibility(UI.errorContainer, false);
    }
    function updateSecurityNote(status) {
      const COLOR = {
        GREEN: "#006400",
        BLUE: "#1993e5",
        ORANGE: "#ff8c00"
      };
      switch (status) {
        case "remembered":
          UI.securityNoteMsg.textContent = "Your credentials will be stored securely on this device.";
          UI.securityNoteIcon.setAttribute("fill", COLOR.ORANGE);
          break;
        case "signed-in":
          UI.securityNoteMsg.textContent = 'You are signed in. To use different credentials, click "Not you?".';
          UI.securityNoteIcon.setAttribute("fill", COLOR.BLUE);
          break;
        default:
          UI.securityNoteMsg.textContent = "Your credentials will not be stored.";
          UI.securityNoteIcon.setAttribute("fill", COLOR.GREEN);
      }
    }
    function onSubmitForm(e) {
      e.preventDefault();
      UI.connectBtn.click();
    }
    async function handleLoginAttempt() {
      const storage = getLocalStorage();
      const email2 = UI.emailInput.value.trim() || storage.email;
      const plaintextPassword = UI.passwordInput.value.trim();
      let encryptedPassword2 = creds.encryptedPassword || storage.encryptedPassword;
      const uuid2 = creds.deviceUuid || storage.uuid;
      if (!encryptedPassword2 && plaintextPassword) {
        try {
          encryptedPassword2 = await encryptPassword(email2, plaintextPassword);
        } catch (err) {
          showError("Failed to encrypt password.");
          return;
        }
      }
      toggleDisabled(UI.connectBtn, true);
      UI.connectBtn.textContent = "Connecting\u2026";
      toggleElementVisibility(UI.errorContainer, false);
      try {
        const response = await monarchApi.login(email2, encryptedPassword2, uuid2);
        if (response?.otpRequired) {
          saveToLocalStorage({
            email: email2,
            encryptedPassword: encryptedPassword2,
            uuid: uuid2,
            remember: creds.remember,
            tempForOtp: !creds.remember
          });
          creds.awaitingOtp = true;
          return navigate("/otp");
        }
        if (response?.token) {
          patchState(creds, {
            email: email2,
            encryptedPassword: encryptedPassword2,
            otp: "",
            remember: UI.rememberCheckbox.checked,
            apiToken: response.token,
            awaitingOtp: false
          });
          if (creds.remember) {
            saveToLocalStorage({ email: email2, encryptedPassword: encryptedPassword2, token: response.token, remember: true });
          }
          return navigate("/complete");
        }
        const apiError = response?.detail || response?.error || "Unexpected login response.";
        throw new Error(apiError);
      } catch (err) {
        showError(err.message);
      } finally {
        toggleDisabled(UI.connectBtn, false);
        UI.connectBtn.textContent = "Connect to Monarch";
      }
    }
    async function onClickConnect(e) {
      e.preventDefault();
      await handleLoginAttempt();
    }
    function onClickClearCredentials(e) {
      e.preventDefault();
      clearStorage();
      clearState(creds);
      creds.deviceUuid = v4_default();
      saveToLocalStorage({ uuid: creds.deviceUuid });
      UI.emailInput.value = "";
      UI.passwordInput.value = "";
      UI.rememberCheckbox.checked = false;
      toggleDisabled(UI.emailInput, false);
      toggleDisabled(UI.passwordInput, false);
      toggleDisabled(UI.connectBtn, true);
      toggleElementVisibility(UI.toggleBtn, true);
      toggleElementVisibility(UI.notYouContainer, false);
      toggleElementVisibility(UI.rememberMeContainer, true);
      updateSecurityNote();
      UI.emailInput.focus();
    }
    function onChangeRemember() {
      creds.remember = UI.rememberCheckbox.checked;
      updateSecurityNote(creds.remember ? "remembered" : "not-remembered");
      const target = UI.emailInput.value.trim() === "" ? UI.emailInput : UI.passwordInput.value.trim() === "" ? UI.passwordInput : UI.connectBtn;
      target.focus();
    }
    function onTogglePassword() {
      const isHidden = UI.passwordInput.type === "password";
      UI.passwordInput.type = isHidden ? "text" : "password";
      UI.toggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      toggleElementVisibility(UI.eyeShow, !isHidden);
      toggleElementVisibility(UI.eyeHide, isHidden);
    }
    function showError(message) {
      UI.errorBox.textContent = message;
      toggleElementVisibility(UI.errorContainer, true);
    }
    UI.form.addEventListener("submit", onSubmitForm);
    UI.connectBtn.addEventListener("click", onClickConnect);
    UI.clearCredentialsBtn.addEventListener("click", onClickClearCredentials);
    UI.rememberCheckbox.addEventListener("change", onChangeRemember);
    UI.toggleBtn.addEventListener("click", onTogglePassword);
    [UI.emailInput, UI.passwordInput].forEach((input) => {
      input.addEventListener("input", validateForm);
      input.addEventListener("focus", () => input.classList.add("ring-2", "ring-blue-500", "outline-none"));
      input.addEventListener("blur", () => input.classList.remove("ring-2", "ring-blue-500", "outline-none"));
    });
    validateForm();
  }

  // src/views/MonarchCredentials/monarchCredentials.html
  var monarchCredentials_default = `<div id="pageLayout"></div>

<!-- Main Form Container -->
<div class="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 md:p-10">

  <form id="credentialsForm" class="space-y-4 sm:space-y-6">

    <!-- Email Field -->
    <div class="space-y-2">
      <label class="block font-semibold text-sm sm:text-base text-gray-900 cursor-pointer" for="email">
        Email Address
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </div>
        <input id="email" type="email" class="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base 
                        border border-gray-300 rounded-lg placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-colors duration-200" placeholder="you@email.com" autocomplete="username" required>
      </div>
    </div>

    <!-- Password Field -->
    <div class="space-y-2">
      <label class="block font-semibold text-sm sm:text-base text-gray-900 cursor-pointer" for="password">
        Password
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <input id="password" type="password" class="block w-full pl-9 sm:pl-10 pr-12 sm:pr-14 py-2.5 sm:py-3 text-sm sm:text-base 
                        border border-gray-300 rounded-lg placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-colors duration-200" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" autocomplete="current-password"
          required>

        <button type="button" id="togglePassword" aria-label="Toggle password visibility" class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer 
                         text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 
                         transition-colors duration-200">
          <!-- Show Icon -->
          <svg id="eyeShow" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>

          <!-- Hide Icon -->
          <svg id="eyeHide" class="h-4 w-4 sm:h-5 sm:w-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.27-2.945-9.543-7a9.966 9.966 0 012.398-4.442M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L17.9 17.9" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Remember Me Checkbox -->
    <div id="rememberMe" class="flex items-start gap-3">
      <div class="flex items-center h-5">
        <input id="rememberCredentials" type="checkbox" class="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer rounded border-gray-300 
                        text-blue-600 focus:ring-blue-500 focus:ring-2">
      </div>
      <div class="text-sm sm:text-base">
        <label for="rememberCredentials" class="text-gray-700 cursor-pointer leading-relaxed">
          Remember me for this session
          <span class="block text-xs text-gray-500 mt-1">
            We'll securely store your credentials locally for convenience
          </span>
        </label>
      </div>
    </div>

    <!-- Not You? -->
    <div id="notYouContainer" class="mt-2 text-sm text-gray-500 hidden">
      <span id="rememberedEmail">"some@thing.com"</span>
      <button type="button" id="clearCredentialsBtn" class="ml-2 text-blue-600 cursor-pointer hover:underline">Not
        You?</button>
    </div>

    <!-- Error Message -->
    <div id="credentialsError" class="hidden bg-red-50 border border-red-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd" />
        </svg>
        <p id="errorBox" class="text-sm text-red-800">Error message will appear here</p>
      </div>
    </div>

    <!-- Submit Button -->
    <button id="connectBtn" type="submit" class="ui-button w-full btn-responsive" data-type="primary" data-size="large">
      <span id="loginBtnText">Connect to Monarch</span>
      <svg id="loginSpinner" class="hidden animate-spin ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </button>
  </form>

  <!-- Security Note -->
  <div class="flex items-start gap-3 mt-6 sm:mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
    <div class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
      <svg id="securityNoteIcon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none" />
      </svg>
    </div>
    <div>
      <p id="securityNote" class="text-xs sm:text-sm text-green-800 leading-relaxed">
        <strong>Secure Connection:</strong> Your credentials are transmitted using bank-level encryption
        and are never stored on our servers. We use the same security standards as major financial institutions.
      </p>
    </div>
  </div>

</div>

<style>
  input[type="password"]::-ms-reveal,
  input[type="password"]::-ms-clear,
  input[type="password"]::-webkit-credentials-auto-fill-button,
  input[type="password"]::-webkit-inner-spin-button,
  input[type="password"]::-webkit-clear-button {
    display: none !important;
    appearance: none;
  }

  input[type="password"]::-webkit-credentials-auto-fill-button {
    display: none !important;
    visibility: hidden;
  }

  #togglePassword,
  #clearCredentialsBtn {
    transition: none !important;
    box-shadow: none !important;
    transform: none !important;
  }
</style>`;

  // src/views/MonarchOtp/monarchOtp.js
  function initMonarchOtpView() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Enter Your Verification Code",
        description: "Monarch has sent a 6-digit verification code to your email address. Enter it below to continue with the secure import process.",
        containerId: "pageHeader"
      }
    });
    const $ = (id) => document.getElementById(id);
    const UI = {
      otpInput: $("otpInput"),
      submitOtpBtn: $("submitOtpBtn"),
      otpError: $("otpError"),
      backBtn: $("backBtn")
    };
    const { credentials } = state_default;
    const storage = getLocalStorage();
    const { email, encryptedPassword, uuid, remember, tempForOtp } = storage;
    patchState(credentials, {
      email: credentials.email || email,
      encryptedPassword: credentials.encryptedPassword || encryptedPassword,
      deviceUuid: credentials.deviceUuid || uuid,
      remember
    });
    if (tempForOtp && !remember) {
    }
    if (!credentials.email || !credentials.encryptedPassword) {
      console.warn("Missing credentials for OTP flow, redirecting to login");
      return navigate("/credentials");
    }
    async function onClickSubmitOtp(e) {
      console.group("MonarchOtpView");
      e.preventDefault();
      toggleElementVisibility(UI.otpError, false);
      credentials.otp = UI.otpInput.value;
      try {
        const response = await monarchApi.login(credentials.email, credentials.encryptedPassword, credentials.deviceUuid, credentials.otp);
        if (response?.token) {
          patchState(credentials, {
            apiToken: response.token,
            awaitingOtp: false
          });
          if (credentials.remember) {
            saveToLocalStorage({
              email: credentials.email,
              encryptedPassword: credentials.encryptedPassword,
              uuid: credentials.deviceUuid,
              token: response.token,
              remember: true
            });
          } else {
            clearStorage();
          }
          console.groupEnd("MonarchOtpView");
          return navigate("/complete");
        }
        throw new Error("Unknown login response.");
      } catch (err) {
        toggleElementVisibility(UI.otpError, true);
        UI.otpError.textContent = "Invalid OTP. Please try again.";
        console.error("\u274C OTP verification error", err);
        console.groupEnd("MonarchOtpView");
      }
    }
    function onClickBack() {
      const storage2 = getLocalStorage();
      if (storage2.tempForOtp && !storage2.remember) {
        clearStorage();
      }
      goBack();
    }
    function onOtpInput() {
      UI.otpInput.value = UI.otpInput.value.replace(/\D/g, "").slice(0, 6);
      toggleDisabled(UI.submitOtpBtn, UI.otpInput.value.length !== 6);
    }
    function onOtpKeyDown(e) {
      if (e.key === "Enter" && UI.otpInput.value.length === 6) {
        UI.submitOtpBtn.click();
      }
    }
    UI.otpInput.addEventListener("input", onOtpInput);
    UI.otpInput.addEventListener("keydown", onOtpKeyDown);
    UI.submitOtpBtn.addEventListener("click", onClickSubmitOtp);
    UI.backBtn.addEventListener("click", onClickBack);
    toggleDisabled(UI.submitOtpBtn, true);
  }

  // src/views/MonarchOtp/monarchOtp.html
  var monarchOtp_default = `<div id="pageLayout"></div>

<!-- OTP Input Section -->
<div class="flex flex-col items-center space-y-6 sm:space-y-8 w-full max-w-sm mx-auto">

  <!-- OTP Input Field -->
  <div class="relative w-full">
    <input id="otpInput" type="text" maxlength="6" pattern="[0-9]*" inputmode="numeric" class="w-full px-4 py-4 sm:py-5 text-center text-xl sm:text-2xl md:text-3xl 
                    tracking-widest font-mono border-2 border-gray-300 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-colors duration-200 bg-gray-50 focus:bg-white" placeholder="\u2022 \u2022 \u2022 \u2022 \u2022 \u2022"
      autocomplete="one-time-code">

    <!-- Input hint -->
    <div class="absolute -bottom-6 left-0 right-0 text-center">
      <span class="text-xs sm:text-sm text-gray-500">6-digit code from your email</span>
    </div>
  </div>

  <!-- Error Message -->
  <div id="otpError" class="hidden bg-red-50 border border-red-200 rounded-lg p-3 w-full">
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd" />
      </svg>
      <p class="text-sm text-red-800">Invalid code. Please try again.</p>
    </div>
  </div>

  <!-- Important Warning -->
  <div class="w-full bg-amber-50 border border-amber-200 rounded-lg p-3">
    <div class="flex items-start gap-2">
      <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      <div>
        <p class="text-xs sm:text-sm text-amber-800 leading-relaxed">
          <strong>Important:</strong> Too many failed attempts will trigger Monarch Money's security system,
          temporarily blocking access to your account for up to 24 hours. Please enter the code carefully.
        </p>
      </div>
    </div>
  </div>

  <!-- Submit Button -->
  <button id="submitOtpBtn" class="ui-button w-full btn-responsive" data-type="primary" data-size="large" disabled>
    <span id="submitOtpBtnText">Verify & Start Import</span>
    <svg id="submitOtpSpinner" class="hidden animate-spin ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
      </path>
    </svg>
  </button>

</div>

<!-- Security Note -->
<div class="w-full max-w-md mx-auto">
  <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clip-rule="evenodd" />
    </svg>
    <div>
      <p class="text-xs sm:text-sm text-blue-800 leading-relaxed">
        <strong>Security Notice:</strong> This verification step ensures your account's security.
        The code expires in 10 minutes for your protection.
      </p>
    </div>
  </div>
</div>`;

  // src/views/MonarchComplete/monarchComplete.js
  function initMonarchCompleteView() {
    if (!state_default.accounts || Object.keys(state_default.accounts).length === 0) {
      navigate("/upload", true);
      return;
    }
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Migration Status",
        containerId: "pageHeader"
      }
    });
    const resultsContainer = document.getElementById("resultsContainer");
    const accountList = document.getElementById("accountList");
    const actionButtonsContainer = document.getElementById("actionButtonsContainer");
    const header = document.getElementById("header");
    const subheader = document.getElementById("subheader");
    const overallStatus = document.getElementById("overallStatus");
    const loadingContainer = document.getElementById("loadingContainer");
    if (loadingContainer) {
      loadingContainer.style.display = "none";
    }
    if (resultsContainer) {
      resultsContainer.style.display = "block";
      resultsContainer.style.opacity = "1";
    }
    initializeProcessing();
    function initializeProcessing() {
      Object.keys(state_default.accounts).forEach((accountName) => {
        if (!state_default.accounts[accountName].status) {
          state_default.accounts[accountName].status = "pending";
        }
      });
      updateStatusOverview();
      updateAccountList();
      updateActionButtons();
      processAccountsInBatches();
    }
    async function processAccountsInBatches() {
      const BATCH_SIZE = 5;
      const token = state_default.credentials.apiToken;
      if (!token) {
        console.error("No API token available");
        Object.keys(state_default.accounts).forEach((accountName) => {
          if (state_default.accounts[accountName].included) {
            state_default.accounts[accountName].status = "failed";
            state_default.accounts[accountName].errorMessage = "Authentication required. Please login again.";
          }
        });
        updateStatusOverview();
        updateAccountList();
        updateActionButtons();
        return;
      }
      const allAccountsToProcess = Object.entries(state_default.accounts).filter(([_, account]) => account.included && account.status !== "completed").map(([accountName, account]) => ({ accountName, ...account }));
      if (allAccountsToProcess.length === 0) {
        console.log("No accounts to process");
        updateStatusOverview();
        updateActionButtons();
        return;
      }
      const batches = [];
      for (let i = 0; i < allAccountsToProcess.length; i += BATCH_SIZE) {
        batches.push(allAccountsToProcess.slice(i, i + BATCH_SIZE));
      }
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        batch.forEach((account) => {
          if (state_default.accounts[account.accountName]) {
            state_default.accounts[account.accountName].status = "processing";
          }
        });
        updateStatusOverview();
        updateAccountList();
        await processBatch(token, batch, batchIndex + 1, batches.length);
        if (batchIndex < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1e3));
        }
      }
      updateStatusOverview();
      updateAccountList();
      updateActionButtons();
    }
    async function processBatch(token, batch, batchNumber, totalBatches) {
      try {
        const response = await monarchApi.createAccounts(token, batch);
        if (response.success || response.failed) {
          if (response.failed && response.failed.length > 0) {
            response.failed.forEach((result) => {
              const matchingAccount = batch.find((acc) => acc.name === result.name || acc.modifiedName === result.name);
              if (matchingAccount && state_default.accounts[matchingAccount.accountName]) {
                state_default.accounts[matchingAccount.accountName].status = "failed";
                state_default.accounts[matchingAccount.accountName].errorMessage = result.error || "Account creation failed";
              }
            });
          }
          if (response.success && response.success.length > 0) {
            response.success.forEach((result) => {
              const matchingAccount = batch.find((acc) => acc.name === result.name || acc.modifiedName === result.name);
              if (matchingAccount && state_default.accounts[matchingAccount.accountName]) {
                state_default.accounts[matchingAccount.accountName].status = "uploading";
                state_default.accounts[matchingAccount.accountName].sessionKeys = result.sessionKeys || [];
              }
            });
            updateStatusOverview();
            updateAccountList();
            await Promise.all(response.success.map(async (result) => {
              const matchingAccount = batch.find((acc) => acc.name === result.name || acc.modifiedName === result.name);
              if (matchingAccount && state_default.accounts[matchingAccount.accountName] && result.sessionKeys) {
                try {
                  await monitorUploadStatus(token, matchingAccount.accountName, result.sessionKeys);
                  state_default.accounts[matchingAccount.accountName].status = "completed";
                } catch (error) {
                  state_default.accounts[matchingAccount.accountName].status = "failed";
                  state_default.accounts[matchingAccount.accountName].errorMessage = error.message || "Transaction upload failed";
                }
              }
            }));
          }
          batch.forEach((account) => {
            if (state_default.accounts[account.accountName] && state_default.accounts[account.accountName].status === "processing") {
              tate.accounts[account.accountName].status = "failed";
              state_default.accounts[account.accountName].errorMessage = "Account not processed by server";
            }
          });
        } else {
          const errorMessage2 = response.error || "Failed to create accounts in Monarch Money";
          batch.forEach((account) => {
            if (state_default.accounts[account.accountName]) {
              state_default.accounts[account.accountName].status = "failed";
              state_default.accounts[account.accountName].errorMessage = errorMessage2;
            }
          });
        }
      } catch (error) {
        batch.forEach((account) => {
          if (state_default.accounts[account.accountName]) {
            state_default.accounts[account.accountName].status = "failed";
            state_default.accounts[account.accountName].errorMessage = "Network error. Please check your connection and try again.";
          }
        });
      }
    }
    async function monitorUploadStatus(token, accountName, sessionKeys) {
      await Promise.all(sessionKeys.map(async (sessionKey) => {
        let attempts = 0;
        const maxAttempts = 60;
        while (attempts < maxAttempts) {
          try {
            const statusResponse = await monarchApi.queryUploadStatus(token, sessionKey);
            if (statusResponse.data?.uploadStatementSession) {
              const session = statusResponse.data.uploadStatementSession;
              const status = session.status;
              if (status === "completed") {
                return;
              } else if (status === "failed" || status === "error") {
                const errorMessage2 = session.errorMessage || "Transaction upload failed";
                throw new Error(errorMessage2);
              }
            }
            await new Promise((resolve) => setTimeout(resolve, 5e3));
            attempts++;
          } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
              throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, 5e3));
          }
        }
        throw new Error(`Upload status check timed out for account ${accountName}`);
      }));
    }
    function updateStatusOverview() {
      const accounts2 = state_default.accounts || {};
      const includedAccounts = Object.values(accounts2).filter((acc) => acc.included);
      const totalAccounts = includedAccounts.length;
      const completedAccounts = includedAccounts.filter((acc) => acc.status === "completed").length;
      const failedAccounts = includedAccounts.filter((acc) => acc.status === "failed").length;
      const processingAccounts = includedAccounts.filter((acc) => acc.status === "processing").length;
      const uploadingAccounts = includedAccounts.filter((acc) => acc.status === "uploading").length;
      const pendingAccounts = totalAccounts - completedAccounts - failedAccounts - processingAccounts - uploadingAccounts;
      let statusText = "Processing...";
      let statusSubtext = "Please wait while we process your accounts.";
      let statusIcon = "\u23F3";
      if (processingAccounts > 0) {
        statusText = "Creating accounts...";
        statusSubtext = `Creating ${processingAccounts} account${processingAccounts !== 1 ? "s" : ""}. Please wait.`;
        statusIcon = "\u23F3";
      } else if (uploadingAccounts > 0) {
        statusText = "Uploading transactions...";
        statusSubtext = `Uploading transactions for ${uploadingAccounts} account${uploadingAccounts !== 1 ? "s" : ""}. Please wait.`;
        statusIcon = "\u{1F4E4}";
      } else if (pendingAccounts === 0) {
        if (failedAccounts === 0) {
          statusText = "All accounts migrated successfully!";
          statusSubtext = `Successfully created ${completedAccounts} account${completedAccounts !== 1 ? "s" : ""} in Monarch Money.`;
          statusIcon = "\u2705";
        } else if (completedAccounts === 0) {
          statusText = "Migration failed for all accounts";
          statusSubtext = "None of your accounts could be migrated. Please try again.";
          statusIcon = "\u274C";
        } else {
          statusText = "Migration completed with some failures";
          statusSubtext = `${completedAccounts} successful, ${failedAccounts} failed. You can retry the failed accounts.`;
          statusIcon = "\u26A0\uFE0F";
        }
      }
      if (header) {
        header.textContent = statusText;
      }
      if (subheader) {
        subheader.textContent = statusSubtext;
      }
      if (overallStatus) {
        overallStatus.innerHTML = `<div class="text-6xl">${statusIcon}</div>`;
      }
    }
    function updateAccountList() {
      if (!accountList)
        return;
      const accounts2 = state_default.accounts || {};
      accountList.innerHTML = "";
      Object.entries(accounts2).forEach(([accountId, account]) => {
        if (!account.included)
          return;
        const accountItem = document.createElement("div");
        accountItem.className = "bg-white border border-gray-200 rounded-lg p-4";
        let statusIcon = "";
        let statusClass = "";
        let statusText = "";
        switch (account.status) {
          case "completed":
            statusIcon = "\u2705";
            statusClass = "text-green-600";
            statusText = "Successfully migrated";
            break;
          case "failed":
            statusIcon = "\u274C";
            statusClass = "text-red-600";
            statusText = account.errorMessage || "Migration failed";
            break;
          case "processing":
            statusIcon = "\u23F3";
            statusClass = "text-blue-600";
            statusText = "Creating account...";
            break;
          case "uploading":
            statusIcon = "\u{1F4E4}";
            statusClass = "text-purple-600";
            statusText = "Uploading transactions...";
            break;
          default:
            statusIcon = "\u23F3";
            statusClass = "text-gray-600";
            statusText = "Pending";
        }
        let accountTypeDisplay = "Unknown Type";
        if (account.type) {
          const typeInfo = getAccountTypeByName(account.type);
          if (typeInfo) {
            accountTypeDisplay = typeInfo.typeDisplay || typeInfo.displayName || typeInfo.display;
            if (account.subtype) {
              const subtypeInfo = getSubtypeByName(account.type, account.subtype);
              if (subtypeInfo) {
                accountTypeDisplay = subtypeInfo.display || subtypeInfo.displayName;
              }
            }
          }
        } else {
          console.log(`Account ${accountId} has no type property`);
        }
        accountItem.innerHTML = `
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0 pr-4">
            <div class="font-medium text-gray-900 mb-1">${account.modifiedName || account.account_name || account.name || "Unknown Account"}</div>
            <div class="text-sm text-gray-500">${accountTypeDisplay}</div>
            ${account.monarchAccountId ? `<div class="text-xs text-gray-400 mt-1">Monarch ID: ${account.monarchAccountId}</div>` : ""}
          </div>
          <div class="flex-shrink-0">
            <span class="text-2xl">${statusIcon}</span>
          </div>
        </div>
        <div class="pt-2 border-t border-gray-100">
          <div class="${statusClass} text-sm font-medium leading-relaxed">${statusText}</div>
        </div>
      `;
        accountList.appendChild(accountItem);
      });
    }
    function updateActionButtons() {
      if (!actionButtonsContainer)
        return;
      const accounts2 = state_default.accounts || {};
      const failedAccounts = Object.values(accounts2).filter((acc) => acc.included && acc.status === "failed");
      const completedAccounts = Object.values(accounts2).filter((acc) => acc.included && acc.status === "completed");
      actionButtonsContainer.innerHTML = "";
      if (failedAccounts.length > 0) {
        const retryBtn = document.createElement("button");
        retryBtn.className = "ui-button";
        retryBtn.dataset.type = "primary";
        retryBtn.dataset.size = "medium";
        retryBtn.textContent = "Retry Failed Accounts";
        retryBtn.addEventListener("click", () => retryFailedAccounts());
        actionButtonsContainer.appendChild(retryBtn);
      }
      if (completedAccounts.length > 0) {
        const viewBtn = document.createElement("button");
        viewBtn.className = "ui-button";
        viewBtn.dataset.type = "secondary";
        viewBtn.dataset.size = "medium";
        viewBtn.textContent = "View in Monarch Money";
        viewBtn.addEventListener("click", () => window.open("https://app.monarchmoney.com", "_blank"));
        actionButtonsContainer.appendChild(viewBtn);
      }
      const startOverBtn = document.createElement("button");
      startOverBtn.className = "ui-button";
      startOverBtn.dataset.type = "secondary";
      startOverBtn.dataset.size = "medium";
      startOverBtn.textContent = "Start Over";
      startOverBtn.addEventListener("click", () => navigate("/upload", true));
      actionButtonsContainer.appendChild(startOverBtn);
    }
    function retryFailedAccounts() {
      const failedAccounts = Object.entries(state_default.accounts).filter(([accountName, acc]) => acc.included && acc.status === "failed");
      if (failedAccounts.length === 0)
        return;
      failedAccounts.forEach(([accountName, account]) => {
        state_default.accounts[accountName].status = "pending";
        delete state_default.accounts[accountName].errorMessage;
      });
      updateStatusOverview();
      updateAccountList();
      updateActionButtons();
      processAccountsInBatches();
    }
  }
  var monarchComplete_default = initMonarchCompleteView;

  // src/views/MonarchComplete/monarchComplete.html
  var monarchComplete_default2 = `<div id="pageLayout"></div>

<!-- Results Container -->
<div id="resultsContainer" class="text-center transition-opacity duration-500 ease-in-out w-full max-w-5xl opacity-0">

  <!-- Status Icon -->
  <div id="overallStatus" class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-6 sm:mb-8 
                transition-all duration-500 ease-in-out">
    <!-- Updated dynamically -->
  </div>

  <!-- Header -->
  <div class="mb-6 sm:mb-8 md:mb-10">
    <h2 id="header" class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
      <!-- Updated dynamically -->
    </h2>
    <p id="subheader" class="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
      <!-- Updated dynamically -->
    </p>
  </div>

  <!-- Account Status List -->
  <div id="accountList"
    class="text-left max-w-3xl w-full mx-auto space-y-3 sm:space-y-4 transition-all duration-300 mb-8 sm:mb-10 md:mb-12">
    <!-- Account rows inserted by JavaScript -->
  </div>

  <!-- Action Buttons Container -->
  <div id="actionButtonsContainer"
    class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-2xl">
    <!-- Buttons inserted dynamically -->
  </div>

</div>

<!-- Loading State -->
<div id="loadingContainer" class="text-center w-full max-w-md">

  <div class="mb-6 sm:mb-8">
    <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
      <svg class="animate-spin w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>

    <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">
      Processing Your Import
    </h2>
    <p class="text-gray-600 text-sm sm:text-base leading-relaxed">
      We're securely importing your accounts into Monarch Money. This may take a few moments...
    </p>
  </div>

  <!-- Progress Steps -->
  <div class="space-y-3 sm:space-y-4 text-left">
    <div id="step1" class="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
      <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
        <svg class="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span class="text-sm sm:text-base text-blue-800 font-medium">Authenticating with Monarch</span>
    </div>

    <div id="step2" class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
      <div
        class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
        <div class="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
      </div>
      <span class="text-sm sm:text-base text-gray-600">Creating accounts</span>
    </div>

    <div id="step3" class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
      <div
        class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
        <div class="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
      </div>
      <span class="text-sm sm:text-base text-gray-600">Importing transactions</span>
    </div>

    <div id="step4" class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
      <div
        class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
        <div class="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
      </div>
      <span class="text-sm sm:text-base text-gray-600">Finalizing import</span>
    </div>
  </div>

  <!-- Security Note -->
  <div class="mt-6 sm:mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
    <div class="flex items-start gap-3">
      <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd" />
      </svg>
      <p class="text-xs sm:text-sm text-green-800 leading-relaxed">
        <strong>Secure Process:</strong> Your data is encrypted during transfer and we never store your Monarch
        credentials.
      </p>
    </div>
  </div>

</div>

<button id="continueBtn" class="ui-button">
  Continue
</button>`;

  // src/views/YnabOauthCallback/ynabOauthCallback.js
  async function initYnabOauthCallbackView() {
    const heroMessage = document.querySelector("[data-ynab-oauth-message]");
    if (heroMessage) {
      heroMessage.textContent = "Processing YNAB authorization...";
    }
    await handleOauthCallback();
  }

  // src/views/YnabOauthCallback/ynabOauthCallback.html
  var ynabOauthCallback_default = '<div class="container-responsive flex flex-col items-center justify-center space-y-6 py-8 sm:py-10 lg:py-14 min-h-[calc(100vh-220px)]">\n  <section class="w-full max-w-4xl space-y-6">\n    <header class="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-transparent rounded-3xl shadow-2xl p-6 sm:p-8">\n      <div class="flex items-start gap-4">\n        <div class="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-100 text-blue-600" data-ynab-oauth-icon>\n          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z" />\n          </svg>\n        </div>\n        <div class="flex-1 space-y-2">\n          <p class="text-xs sm:text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold">Authorization flow</p>\n          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Finish connecting YNAB</h1>\n          <p class="text-sm sm:text-base text-gray-600 leading-relaxed">We returned here immediately after you granted access inside YNAB. This page safely captures the authorization code so the app can continue.</p>\n        </div>\n        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-white/70 text-blue-700 border border-blue-100">Secure</span>\n      </div>\n    </header>\n\n    <article class="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">\n      <div class="flex items-start justify-between gap-4">\n        <div class="flex items-center gap-3">\n          <div class="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600" data-ynab-oauth-hero-icon>\n            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-3.866 0-7 1.79-7 4v1h14v-1c0-2.21-3.134-4-7-4z" />\n            </svg>\n          </div>\n          <div>\n            <p class="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold">Callback status</p>\n            <p class="text-lg font-bold text-gray-900 leading-tight" data-ynab-oauth-message>Receiving the authorization code\u2026</p>\n            <p class="text-sm text-gray-500 leading-relaxed" data-ynab-oauth-subtext aria-live="polite">Hang tight while we confirm the details sent back from YNAB.</p>\n          </div>\n        </div>\n        <span class="rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600" data-ynab-oauth-badge>Pending</span>\n      </div>\n\n      <div class="rounded-2xl border border-dashed border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-800" data-ynab-oauth-callout>\n        We are securely capturing the authorization code so you can continue the import without typing credentials again.\n      </div>\n\n      <div class="flex flex-wrap gap-3" aria-live="polite">\n        <button class="ui-button btn-responsive" data-type="primary" data-size="large" data-ynab-oauth-continue>\n          Return to the app\n        </button>\n        <a class="ui-button" data-type="text" data-size="medium" data-ynab-oauth-open href="https://app.youneedabudget.com" target="_blank" rel="noopener noreferrer">\n          Open YNAB in a new tab\n        </a>\n      </div>\n\n      <div class="space-y-2" aria-live="polite">\n        <label for="ynabOauthCode" class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Authorization code</label>\n        <div class="flex gap-3">\n          <input id="ynabOauthCode" class="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700" type="text" value="" readonly placeholder="Awaiting code" data-ynab-oauth-code>\n          <button class="ui-button" data-type="secondary" data-size="small" data-ynab-oauth-copy disabled>\n            Copy code\n          </button>\n          <span class="text-xs font-semibold text-green-600 hidden" data-ynab-oauth-copy-status>Copied!</span>\n        </div>\n      </div>\n    </article>\n\n    <div class="grid gap-4 sm:grid-cols-3">\n      <article class="border border-gray-200 rounded-3xl bg-white p-4 space-y-2" data-ynab-oauth-step="request">\n        <div class="flex items-center gap-2">\n          <span class="inline-flex items-center justify-center w-8 h-8 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600" data-ynab-oauth-step-indicator data-step-index="1">1</span>\n          <h3 class="text-sm font-semibold text-gray-900">Request issued</h3>\n        </div>\n        <p class="text-xs text-gray-500 leading-relaxed">You clicked continue inside YNAB to begin the OAuth handshake.</p>\n      </article>\n      <article class="border border-gray-200 rounded-3xl bg-white p-4 space-y-2" data-ynab-oauth-step="approval">\n        <div class="flex items-center gap-2">\n          <span class="inline-flex items-center justify-center w-8 h-8 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600" data-ynab-oauth-step-indicator data-step-index="2">2</span>\n          <h3 class="text-sm font-semibold text-gray-900">Authorization granted</h3>\n        </div>\n        <p class="text-xs text-gray-500 leading-relaxed">YNAB verified your identity and confirmed we can access your budget.</p>\n      </article>\n      <article class="border border-gray-200 rounded-3xl bg-white p-4 space-y-2" data-ynab-oauth-step="storage">\n        <div class="flex items-center gap-2">\n          <span class="inline-flex items-center justify-center w-8 h-8 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600" data-ynab-oauth-step-indicator data-step-index="3">3</span>\n          <h3 class="text-sm font-semibold text-gray-900">Code captured</h3>\n        </div>\n        <p class="text-xs text-gray-500 leading-relaxed">We store the code in sessionStorage so the SPA can finalize the login flow.</p>\n      </article>\n    </div>\n  </section>\n</div>\n';

  // src/views/DataManagement/dataManagement.js
  function initDataManagementView() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Data Management",
        description: "View and manage all data stored in your browser. This includes session data, local storage, and application state.",
        containerId: "pageHeader"
      }
    });
    displayStateData();
    displaySessionStorageData();
    displayLocalStorageData();
    const exportBtn = document.getElementById("exportDataBtn");
    const clearBtn = document.getElementById("clearAllDataBtn");
    const confirmClearBtn = document.getElementById("confirmClearBtn");
    const cancelClearBtn = document.getElementById("cancelClearBtn");
    exportBtn?.addEventListener("click", handleExportData);
    clearBtn?.addEventListener("click", () => openModal("confirmClearModal"));
    confirmClearBtn?.addEventListener("click", handleClearAllData);
    cancelClearBtn?.addEventListener("click", () => closeModal("confirmClearModal"));
    window.toggleCollapse = toggleCollapse;
  }
  function toggleCollapse(id) {
    const element = document.getElementById(id);
    const button = element?.previousElementSibling;
    const icon = button?.querySelector(".collapse-icon");
    if (element && icon) {
      const isHidden = element.classList.contains("hidden");
      if (isHidden) {
        element.classList.remove("hidden");
        icon.style.transform = "rotate(90deg)";
      } else {
        element.classList.add("hidden");
        icon.style.transform = "rotate(0deg)";
      }
    }
  }
  function displayStateData() {
    const container = document.getElementById("stateDataSection");
    if (!container)
      return;
    const stateData = {
      credentials: {
        email: state_default.credentials.email || "(not set)",
        hasEncryptedPassword: !!state_default.credentials.encryptedPassword,
        hasApiToken: !!state_default.credentials.apiToken,
        hasDeviceUuid: !!state_default.credentials.deviceUuid,
        remember: state_default.credentials.remember,
        awaitingOtp: state_default.credentials.awaitingOtp
      },
      accounts: state_default.accounts,
      monarchAccounts: state_default.monarchAccounts,
      ynabOauth: state_default.ynabOauth
    };
    const accountCount = state_default.accounts ? Object.keys(state_default.accounts).length : 0;
    const monarchCount = state_default.monarchAccounts ? Array.isArray(state_default.monarchAccounts) ? state_default.monarchAccounts.length : Object.keys(state_default.monarchAccounts).length : 0;
    const summary = `${accountCount} YNAB accounts, ${monarchCount} Monarch accounts, ${state_default.credentials.email ? "logged in" : "not logged in"}`;
    const html = `
    <div class="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p class="text-sm text-blue-800 font-medium">Summary: ${summary}</p>
    </div>
    ${renderDataObject(stateData, "state")}
  `;
    container.innerHTML = html || '<p class="text-gray-500 text-sm italic">No application state data</p>';
  }
  function displaySessionStorageData() {
    const container = document.getElementById("sessionStorageSection");
    if (!container)
      return;
    const sessionData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      try {
        const value = sessionStorage.getItem(key);
        sessionData[key] = JSON.parse(value);
      } catch {
        sessionData[key] = sessionStorage.getItem(key);
      }
    }
    const itemCount = sessionStorage.length;
    const summary = itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? "s" : ""} stored` : "No items stored";
    const html = itemCount > 0 ? `
    <div class="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
      <p class="text-sm text-purple-800 font-medium">Summary: ${summary}</p>
    </div>
    ${renderDataObject(sessionData, "session")}
  ` : '<p class="text-gray-500 text-sm italic">No session storage data</p>';
    container.innerHTML = html;
  }
  function displayLocalStorageData() {
    const container = document.getElementById("localStorageSection");
    if (!container)
      return;
    const localData = getLocalStorage();
    const appStateRaw = localStorage.getItem("app_state");
    if (appStateRaw) {
      try {
        localData.app_state = JSON.parse(appStateRaw);
      } catch {
        localData.app_state = appStateRaw;
      }
    }
    const sanitizedData = {
      email: localData.email || "(not set)",
      hasEncryptedPassword: !!localData.encryptedPassword,
      hasToken: !!localData.token,
      hasUuid: !!localData.uuid,
      remember: localData.remember,
      tempForOtp: localData.tempForOtp,
      app_state: localData.app_state
    };
    const hasData = localData.email || localData.encryptedPassword || localData.token || localData.uuid;
    const summary = hasData ? `Credentials stored (${localData.email || "no email"}), Remember: ${localData.remember ? "Yes" : "No"}` : "No credentials stored";
    const html = hasData ? `
    <div class="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
      <p class="text-sm text-green-800 font-medium">Summary: ${summary}</p>
    </div>
    ${renderDataObject(sanitizedData, "local")}
  ` : '<p class="text-gray-500 text-sm italic">No local storage data</p>';
    container.innerHTML = html;
  }
  function renderDataObject(data2, prefix = "", depth = 0) {
    if (data2 === null || data2 === void 0) {
      return `<span class="text-gray-400 italic">null</span>`;
    }
    if (typeof data2 === "boolean") {
      return `<span class="font-mono text-${data2 ? "green" : "red"}-600">${data2}</span>`;
    }
    if (typeof data2 === "number" || typeof data2 === "string") {
      const displayValue = String(data2).length > 100 ? String(data2).substring(0, 100) + "..." : String(data2);
      return `<span class="font-mono text-gray-700">${escapeHtml3(displayValue)}</span>`;
    }
    if (Array.isArray(data2)) {
      if (data2.length === 0) {
        return `<span class="text-gray-400 italic">[ ] (empty array)</span>`;
      }
      const collapsibleId = `collapse_${prefix}_${Math.random().toString(36).substr(2, 9)}`;
      return `
      <div class="ml-2">
        <button 
          class="collapsible-toggle text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium mb-1"
          onclick="toggleCollapse('${collapsibleId}')"
        >
          <svg class="collapse-icon w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          Array (${data2.length} items)
        </button>
        <div id="${collapsibleId}" class="collapsible-content hidden ml-4 space-y-2">
          ${data2.map((item, index) => `
            <div class="border-l-2 border-gray-200 pl-3">
              <span class="text-gray-500 font-medium">[${index}]:</span>
              ${renderDataObject(item, `${prefix}_${index}`, depth + 1)}
            </div>
          `).join("")}
        </div>
      </div>
    `;
    }
    if (typeof data2 === "object") {
      const entries = Object.entries(data2);
      if (entries.length === 0) {
        return `<span class="text-gray-400 italic">{ } (empty object)</span>`;
      }
      const collapsibleId = `collapse_${prefix}_${Math.random().toString(36).substr(2, 9)}`;
      const hasNestedObjects = entries.some(([_, value]) => typeof value === "object" && value !== null);
      if (hasNestedObjects || depth === 0) {
        return `
        <div class="${depth > 0 ? "ml-2 mt-2" : ""}">
          <button 
            class="collapsible-toggle text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium mb-1"
            onclick="toggleCollapse('${collapsibleId}')"
          >
            <svg class="collapse-icon w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            Object (${entries.length} properties)
          </button>
          <div id="${collapsibleId}" class="collapsible-content hidden ml-4 space-y-2">
            ${entries.map(([key, value]) => {
          const isNested = typeof value === "object" && value !== null;
          return `
                <div class="border-l-2 ${depth === 0 ? "border-blue-300" : "border-gray-200"} pl-3 py-1">
                  <div class="flex items-start">
                    <span class="font-semibold text-gray-700 mr-2">${escapeHtml3(key)}:</span>
                    ${!isNested ? renderDataObject(value, `${prefix}_${key}`, depth + 1) : ""}
                  </div>
                  ${isNested ? renderDataObject(value, `${prefix}_${key}`, depth + 1) : ""}
                </div>
              `;
        }).join("")}
          </div>
        </div>
      `;
      }
      return `
      <div class="space-y-2 ${depth > 0 ? "ml-4 mt-1" : ""}">
        ${entries.map(([key, value]) => `
          <div class="border-l-2 border-gray-200 pl-3 py-1">
            <span class="font-semibold text-gray-700 mr-2">${escapeHtml3(key)}:</span>
            ${renderDataObject(value, `${prefix}_${key}`, depth + 1)}
          </div>
        `).join("")}
      </div>
    `;
    }
    return `<span class="text-gray-400 italic">(unknown type)</span>`;
  }
  function handleExportData() {
    const allData = {
      exportedAt: new Date().toISOString(),
      state: state_default,
      sessionStorage: {},
      localStorage: {}
    };
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      try {
        allData.sessionStorage[key] = JSON.parse(sessionStorage.getItem(key));
      } catch {
        allData.sessionStorage[key] = sessionStorage.getItem(key);
      }
    }
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        allData.localStorage[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        allData.localStorage[key] = localStorage.getItem(key);
      }
    }
    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ynab-monarch-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  function handleClearAllData() {
    try {
      clearStorage();
      clearAppState();
      sessionStorage.clear();
      state_default.credentials = {
        email: "",
        encryptedPassword: "",
        otp: "",
        remember: false,
        apiToken: "",
        awaitingOtp: false,
        deviceUuid: ""
      };
      state_default.monarchAccounts = null;
      state_default.accounts = {};
      state_default.ynabOauth = { code: null, state: null, error: null };
      closeModal("confirmClearModal");
      console.log("All data cleared successfully");
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("An error occurred while clearing data. Please try again.");
    }
  }
  function escapeHtml3(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // src/views/DataManagement/dataManagement.html
  var dataManagement_default = `<div id="pageLayout"></div>

<!-- Warning Banner -->
<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
  <div class="flex items-start">
    <svg class="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clip-rule="evenodd" />
    </svg>
    <div>
      <h3 class="text-sm font-medium text-yellow-800 mb-1">Privacy Notice</h3>
      <p class="text-sm text-yellow-700">
        All data shown below is stored locally in your browser only. No data is sent to our servers or any third-party
        services.
      </p>
    </div>
  </div>
</div>

<!-- Data Sections Container -->
<div class="space-y-6">

  <!-- Application State Section -->
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
      <h2 class="text-xl font-semibold text-white flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Application State
      </h2>
      <p class="text-blue-100 text-sm mt-1">Current session data and account information</p>
    </div>
    <div id="stateDataSection" class="p-6">
      <!-- Populated by JavaScript -->
    </div>
  </div>

  <!-- Session Storage Section -->
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
      <h2 class="text-xl font-semibold text-white flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
        Session Storage
      </h2>
      <p class="text-purple-100 text-sm mt-1">Data cleared when browser tab is closed</p>
    </div>
    <div id="sessionStorageSection" class="p-6">
      <!-- Populated by JavaScript -->
    </div>
  </div>

  <!-- Local Storage Section -->
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
      <h2 class="text-xl font-semibold text-white flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Local Storage
      </h2>
      <p class="text-green-100 text-sm mt-1">Persistent data saved across sessions</p>
    </div>
    <div id="localStorageSection" class="p-6">
      <!-- Populated by JavaScript -->
    </div>
  </div>

</div>

<!-- Action Buttons -->
<div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
  <button id="exportDataBtn" class="ui-button" data-type="secondary" data-size="medium">
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    Export Data (JSON)
  </button>

  <button id="clearAllDataBtn" class="ui-button" data-type="danger" data-size="medium">
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
    Clear All Data
  </button>
</div>

<!-- Info Footer -->
<div class="mt-8 text-center text-sm text-gray-500">
  <p>Clearing data will remove all accounts, credentials, and session information.</p>
  <p class="mt-1">You'll need to re-upload your YNAB data and re-authenticate with Monarch.</p>
</div>

<!-- Confirmation Modal -->
<div id="confirmClearModal"
  class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 pointer-events-none opacity-0 transition-opacity duration-500">
  <div
    class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform translate-y-full transition-transform duration-500">
    <div class="flex items-start mb-4">
      <div class="flex-shrink-0">
        <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div class="ml-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Clear All Data?</h3>
        <p class="text-sm text-gray-600 mb-4">
          This action cannot be undone. All your YNAB accounts, Monarch credentials, and session data will be
          permanently deleted from your browser.
        </p>
        <div class="flex gap-3 justify-end">
          <button id="cancelClearBtn" class="ui-button" data-type="secondary" data-size="small">
            Cancel
          </button>
          <button id="confirmClearBtn" class="ui-button" data-type="danger" data-size="small">
            Yes, Clear Everything
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`;

  // src/router.js
  var routes = {
    "/": {
      template: home_default,
      init: initUploadView,
      scroll: false,
      title: "Home - YNAB to Monarch",
      requiresAuth: false
    },
    "/upload": {
      template: upload_default,
      init: initUploadView2,
      scroll: false,
      title: "Upload - YNAB to Monarch",
      requiresAuth: false
    },
    "/review": {
      template: review_default,
      init: initAccountReviewView,
      scroll: true,
      title: "Review Accounts - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true
    },
    "/method": {
      template: method_default,
      init: initMethodSelectView,
      scroll: false,
      title: "Select Method - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true
    },
    "/manual": {
      template: manualInstructions_default,
      init: initManualInstructionsView,
      scroll: true,
      title: "Manual Import - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true
    },
    "/login": {
      template: monarchCredentials_default,
      init: initMonarchCredentialsView,
      scroll: false,
      title: "Login to Monarch - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true
    },
    "/otp": {
      template: monarchOtp_default,
      init: initMonarchOtpView,
      scroll: false,
      title: "Enter OTP - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true
    },
    "/complete": {
      template: monarchComplete_default2,
      init: monarchComplete_default,
      scroll: false,
      title: "Migration Complete - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true
    },
    "/oauth/ynab/callback": {
      template: ynabOauthCallback_default,
      init: initYnabOauthCallbackView,
      scroll: false,
      title: "Authorize YNAB - YNAB to Monarch",
      requiresAuth: false
    },
    "/data-management": {
      template: dataManagement_default,
      init: initDataManagementView,
      scroll: true,
      title: "Data Management - YNAB to Monarch",
      requiresAuth: false
    }
  };
  var isNavigating = false;
  var stateLoaded = false;
  var navigationHistory = [];
  var MAX_HISTORY_SIZE = 50;
  async function navigate(path, replace = false, skipRouteGuards = false) {
    if (isNavigating)
      return;
    isNavigating = true;
    try {
      if (!path.startsWith("/")) {
        path = "/" + path;
      }
      const route = routes[path];
      if (!route) {
        console.error(`Route not found: ${path}`);
        path = "/upload";
        return navigate(path, replace);
      }
      if (!stateLoaded) {
        await loadPersistedState();
        stateLoaded = true;
      }
      if (!skipRouteGuards && route.requiresAccounts) {
        const hasAccounts = state_default.accounts && Object.keys(state_default.accounts).length > 0;
        if (!hasAccounts) {
          console.warn(`Route ${path} requires accounts but none found. Redirecting to upload.`);
          return navigate("/upload", true);
        }
      }
      const currentPath = getCurrentPath();
      if (replace) {
        history.replaceState({ path }, "", path);
      } else {
        if (currentPath && currentPath !== path) {
          navigationHistory.push(currentPath);
          if (navigationHistory.length > MAX_HISTORY_SIZE) {
            navigationHistory.shift();
          }
        }
        history.pushState({ path }, "", path);
      }
      await renderRoute(path);
    } catch (error) {
      console.error("Navigation error:", error);
      if (path !== "/upload") {
        return navigate("/upload", true);
      }
    } finally {
      isNavigating = false;
    }
  }
  async function renderRoute(path) {
    const app = document.getElementById("app");
    const route = routes[path] || routes["/upload"];
    document.title = route.title;
    if (!stateLoaded) {
      await loadPersistedState();
      stateLoaded = true;
    }
    if (route.scroll) {
      document.body.classList.add("always-scroll");
    } else {
      document.body.classList.remove("always-scroll");
    }
    app.innerHTML = "";
    app.innerHTML = route.template;
    try {
      await route.init();
    } catch (error) {
      console.error(`Error initializing route ${path}:`, error);
      if (path !== "/upload") {
        navigate("/upload", true);
      }
    }
  }
  function persistState() {
    try {
      if (Object.keys(state_default.accounts).length > 0) {
        sessionStorage.setItem("ynab_accounts", JSON.stringify(state_default.accounts));
      }
      if (state_default.monarchAccounts) {
        sessionStorage.setItem("monarch_accounts", JSON.stringify(state_default.monarchAccounts));
      }
      const persistentState = {
        lastPath: getCurrentPath(),
        timestamp: Date.now()
      };
      localStorage.setItem("app_state", JSON.stringify(persistentState));
    } catch (error) {
      console.error("Error persisting state:", error);
    }
  }
  async function loadPersistedState() {
    try {
      if (!state_default.accounts) {
        state_default.accounts = {};
      }
      const localStorageData = getLocalStorage();
      if (localStorageData.email || localStorageData.token) {
        state_default.credentials.email = localStorageData.email || state_default.credentials.email;
        state_default.credentials.encryptedPassword = localStorageData.encryptedPassword || state_default.credentials.encryptedPassword;
        state_default.credentials.apiToken = localStorageData.token || state_default.credentials.apiToken;
        state_default.credentials.deviceUuid = localStorageData.uuid || state_default.credentials.deviceUuid;
        state_default.credentials.remember = localStorageData.remember || state_default.credentials.remember;
      }
      const accountsData = sessionStorage.getItem("ynab_accounts");
      if (accountsData) {
        try {
          const parsedAccounts = JSON.parse(accountsData);
          if (parsedAccounts && typeof parsedAccounts === "object") {
            state_default.accounts = parsedAccounts;
          }
        } catch (e) {
          console.warn("Failed to parse accounts from sessionStorage:", e);
          sessionStorage.removeItem("ynab_accounts");
          state_default.accounts = {};
        }
      }
      const monarchAccountsData = sessionStorage.getItem("monarch_accounts");
      if (monarchAccountsData) {
        try {
          const parsedMonarchAccounts = JSON.parse(monarchAccountsData);
          if (parsedMonarchAccounts && typeof parsedMonarchAccounts === "object") {
            state_default.monarchAccounts = parsedMonarchAccounts;
          }
        } catch (e) {
          console.warn("Failed to parse monarch accounts from sessionStorage:", e);
          sessionStorage.removeItem("monarch_accounts");
          state_default.monarchAccounts = null;
        }
      }
      const appStateData = localStorage.getItem("app_state");
      if (appStateData) {
        try {
          const appState = JSON.parse(appStateData);
          if (appState.timestamp && Date.now() - appState.timestamp < 24 * 60 * 60 * 1e3) {
            console.log("Loaded recent app state from localStorage");
          } else {
            localStorage.removeItem("app_state");
          }
        } catch (e) {
          console.warn("Failed to parse app state from localStorage:", e);
          localStorage.removeItem("app_state");
        }
      }
    } catch (error) {
      console.error("Error loading persisted state:", error);
      state_default.accounts = {};
      state_default.monarchAccounts = null;
    }
  }
  function getCurrentPath() {
    return window.location.pathname;
  }
  function isValidRoute(path) {
    return routes.hasOwnProperty(path);
  }
  function clearAppState() {
    try {
      sessionStorage.removeItem("ynab_accounts");
      sessionStorage.removeItem("monarch_accounts");
      localStorage.removeItem("app_state");
      state_default.accounts = {};
      state_default.monarchAccounts = null;
      console.log("Application state cleared");
    } catch (error) {
      console.error("Error clearing app state:", error);
    }
  }
  function goBack() {
    if (navigationHistory.length > 0) {
      const previousPath = navigationHistory.pop();
      if (isValidRoute(previousPath)) {
        navigate(previousPath, true);
        return;
      }
    }
    navigate("/", true);
  }
  window.addEventListener("popstate", async (event) => {
    if (!isNavigating) {
      const path = event.state?.path || window.location.pathname;
      try {
        if (navigationHistory.length > 0) {
          navigationHistory.pop();
        }
        await renderRoute(path);
      } catch (error) {
        console.error("Error handling popstate:", error);
        navigate("/upload", true);
      }
    }
  });
  window.addEventListener("DOMContentLoaded", async () => {
    const path = window.location.pathname;
    const route = routes[path];
    try {
      if (route) {
        if (!history.state) {
          history.replaceState({ path }, "", path);
        }
        await renderRoute(path);
      } else {
        navigate("/upload", true);
      }
    } catch (error) {
      console.error("Error on initial load:", error);
      navigate("/upload", true);
    }
  });
})();
/* @license
Papa Parse
v5.5.2
https://github.com/mholt/PapaParse
License: MIT
*/
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
