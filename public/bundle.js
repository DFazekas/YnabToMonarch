(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/papaparse/papaparse.min.js
  var require_papaparse_min = __commonJS({
    "node_modules/papaparse/papaparse.min.js"(exports, module) {
      ((e, t) => {
        "function" == typeof define && define.amd ? define([], t) : "object" == typeof module && "undefined" != typeof exports ? module.exports = t() : e.Papa = t();
      })(exports, function r() {
        var n = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== n ? n : {};
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
            this.isFirstChunk && U(this._config.beforeFirstChunk) && void 0 !== (r2 = this._config.beforeFirstChunk(t)) && (t = r2), this.isFirstChunk = false, this._halted = false;
            var i2 = this._partialLine + t, r2 = (this._partialLine = "", this._handle.parse(i2, this._baseIndex, !this._finished));
            if (!this._handle.paused() && !this._handle.aborted()) {
              t = r2.meta.cursor, i2 = (this._finished || (this._partialLine = i2.substring(t - this._baseIndex), this._baseIndex = t), r2 && r2.data && (this._rowCount += r2.data.length), this._finished || this._config.preview && this._rowCount >= this._config.preview);
              if (a) n.postMessage({ results: r2, workerId: v.WORKER_ID, finished: i2 });
              else if (U(this._config.chunk) && !e2) {
                if (this._config.chunk(r2, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = true);
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
            if (this._finished) this._chunkLoaded();
            else {
              if (r2 = new XMLHttpRequest(), this._config.withCredentials && (r2.withCredentials = this._config.withCredentials), s || (r2.onload = y(this._chunkLoaded, this), r2.onerror = y(this._chunkError, this)), r2.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !s), this._config.downloadRequestHeaders) {
                var e2, t = this._config.downloadRequestHeaders;
                for (e2 in t) r2.setRequestHeader(e2, t[e2]);
              }
              var i2;
              this._config.chunkSize && (i2 = this._start + this._config.chunkSize - 1, r2.setRequestHeader("Range", "bytes=" + this._start + "-" + i2));
              try {
                r2.send(this._config.downloadRequestBody);
              } catch (e3) {
                this._chunkError(e3.message);
              }
              s && 0 === r2.status && this._chunkError();
            }
          }, this._chunkLoaded = function() {
            4 === r2.readyState && (r2.status < 200 || 400 <= r2.status ? this._chunkError() : (this._start += this._config.chunkSize || r2.responseText.length, this._finished = !this._config.chunkSize || this._start >= ((e2) => null !== (e2 = e2.getResponseHeader("Content-Range")) ? parseInt(e2.substring(e2.lastIndexOf("/") + 1)) : -1)(r2), this.parseChunk(r2.responseText)));
          }, this._chunkError = function(e2) {
            e2 = r2.statusText || e2;
            this._sendError(new Error(e2));
          };
        }
        function l(e) {
          (e = e || {}).chunkSize || (e.chunkSize = v.LocalChunkSize), u.call(this, e);
          var i2, r2, n2 = "undefined" != typeof FileReader;
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
            if (!this._finished) return e2 = this._config.chunkSize, i2 = e2 ? (t = i2.substring(0, e2), i2.substring(e2)) : (t = i2, ""), this._finished = !i2, this.parseChunk(t);
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
            r2 && 1 === t.length && (this._finished = true);
          }, this._nextChunk = function() {
            this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i2 = true;
          }, this._streamData = y(function(e2) {
            try {
              t.push("string" == typeof e2 ? e2 : e2.toString(this._config.encoding)), i2 && (i2 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
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
            return "greedy" === m2.skipEmptyLines ? "" === e2.join("").trim() : 1 === e2.length && 0 === e2[0].length;
          }
          function g2() {
            if (p2 && a2 && (k("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + v.DefaultDelimiter + "'"), a2 = false), m2.skipEmptyLines && (p2.data = p2.data.filter(function(e3) {
              return !y2(e3);
            })), _2()) {
              let t3 = function(e3, t4) {
                U(m2.transformHeader) && (e3 = m2.transformHeader(e3, t4)), c2.push(e3);
              };
              var t2 = t3;
              if (p2) if (Array.isArray(p2.data[0])) {
                for (var e2 = 0; _2() && e2 < p2.data.length; e2++) p2.data[e2].forEach(t3);
                p2.data.splice(0, 1);
              } else p2.data.forEach(t3);
            }
            function i3(e3, t3) {
              for (var i4 = m2.header ? {} : [], r4 = 0; r4 < e3.length; r4++) {
                var n3 = r4, s3 = e3[r4], s3 = ((e4, t4) => ((e5) => (m2.dynamicTypingFunction && void 0 === m2.dynamicTyping[e5] && (m2.dynamicTyping[e5] = m2.dynamicTypingFunction(e5)), true === (m2.dynamicTyping[e5] || m2.dynamicTyping)))(e4) ? "true" === t4 || "TRUE" === t4 || "false" !== t4 && "FALSE" !== t4 && (((e5) => {
                  if (u2.test(e5)) {
                    e5 = parseFloat(e5);
                    if (h2 < e5 && e5 < o2) return 1;
                  }
                })(t4) ? parseFloat(t4) : d2.test(t4) ? new Date(t4) : "" === t4 ? null : t4) : t4)(n3 = m2.header ? r4 >= c2.length ? "__parsed_extra" : c2[r4] : n3, s3 = m2.transform ? m2.transform(s3, n3) : s3);
                "__parsed_extra" === n3 ? (i4[n3] = i4[n3] || [], i4[n3].push(s3)) : i4[n3] = s3;
              }
              return m2.header && (r4 > c2.length ? k("FieldMismatch", "TooManyFields", "Too many fields: expected " + c2.length + " fields but parsed " + r4, f2 + t3) : r4 < c2.length && k("FieldMismatch", "TooFewFields", "Too few fields: expected " + c2.length + " fields but parsed " + r4, f2 + t3)), i4;
            }
            var r3;
            p2 && (m2.header || m2.dynamicTyping || m2.transform) && (r3 = 1, !p2.data.length || Array.isArray(p2.data[0]) ? (p2.data = p2.data.map(i3), r3 = p2.data.length) : p2.data = i3(p2.data, 0), m2.header && p2.meta && (p2.meta.fields = c2), f2 += r3);
          }
          function _2() {
            return m2.header && 0 === c2.length;
          }
          function k(e2, t2, i3, r3) {
            e2 = { type: e2, code: t2, message: i3 };
            void 0 !== r3 && (e2.row = r3), p2.errors.push(e2);
          }
          U(m2.step) && (t = m2.step, m2.step = function(e2) {
            p2 = e2, _2() ? g2() : (g2(), 0 !== p2.data.length && (r2 += e2.data.length, m2.preview && r2 > m2.preview ? s2.abort() : (p2.data = p2.data[0], t(p2, i2))));
          }), this.parse = function(e2, t2, i3) {
            var r3 = m2.quoteChar || '"', r3 = (m2.newline || (m2.newline = this.guessLineEndings(e2, r3)), a2 = false, m2.delimiter ? U(m2.delimiter) && (m2.delimiter = m2.delimiter(e2), p2.meta.delimiter = m2.delimiter) : ((r3 = ((e3, t3, i4, r4, n3) => {
              var s3, a3, o3, h3;
              n3 = n3 || [",", "	", "|", ";", v.RECORD_SEP, v.UNIT_SEP];
              for (var u3 = 0; u3 < n3.length; u3++) {
                for (var d3, f3 = n3[u3], l3 = 0, c3 = 0, p3 = 0, g3 = (o3 = void 0, new E({ comments: r4, delimiter: f3, newline: t3, preview: 10 }).parse(e3)), _3 = 0; _3 < g3.data.length; _3++) i4 && y2(g3.data[_3]) ? p3++ : (d3 = g3.data[_3].length, c3 += d3, void 0 === o3 ? o3 = d3 : 0 < d3 && (l3 += Math.abs(d3 - o3), o3 = d3));
                0 < g3.data.length && (c3 /= g3.data.length - p3), (void 0 === a3 || l3 <= a3) && (void 0 === h3 || h3 < c3) && 1.99 < c3 && (a3 = l3, s3 = f3, h3 = c3);
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
            if (1 === i3.length || e2) return "\n";
            for (var r3 = 0, n3 = 0; n3 < i3.length; n3++) "\n" === i3[n3][0] && r3++;
            return r3 >= i3.length / 2 ? "\r\n" : "\r";
          };
        }
        function P(e) {
          return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        function E(C) {
          var S = (C = C || {}).delimiter, O = C.newline, x = C.comments, I = C.step, A = C.preview, T = C.fastMode, D = null, L = false, F = null == C.quoteChar ? '"' : C.quoteChar, j = F;
          if (void 0 !== C.escapeChar && (j = C.escapeChar), ("string" != typeof S || -1 < v.BAD_DELIMITERS.indexOf(S)) && (S = ","), x === S) throw new Error("Comment character same as delimiter");
          true === x ? x = "#" : ("string" != typeof x || -1 < v.BAD_DELIMITERS.indexOf(x)) && (x = false), "\n" !== O && "\r" !== O && "\r\n" !== O && (O = "\n");
          var z = 0, M = false;
          this.parse = function(i2, t, r2) {
            if ("string" != typeof i2) throw new Error("Input must be a string");
            var n2 = i2.length, e = S.length, s2 = O.length, a2 = x.length, o2 = U(I), h2 = [], u2 = [], d2 = [], f2 = z = 0;
            if (!i2) return b();
            if (T || false !== T && -1 === i2.indexOf(F)) {
              for (var l2 = i2.split(O), c2 = 0; c2 < l2.length; c2++) {
                if (d2 = l2[c2], z += d2.length, c2 !== l2.length - 1) z += O.length;
                else if (r2) return b();
                if (!x || d2.substring(0, a2) !== x) {
                  if (o2) {
                    if (h2 = [], k(d2.split(S)), R(), M) return b();
                  } else k(d2.split(S));
                  if (A && A <= c2) return h2 = h2.slice(0, A), b(true);
                }
              }
              return b();
            }
            for (var p2 = i2.indexOf(S, z), g2 = i2.indexOf(O, z), _2 = new RegExp(P(j) + P(F), "g"), m2 = i2.indexOf(F, z); ; ) if (i2[z] === F) for (m2 = z, z++; ; ) {
              if (-1 === (m2 = i2.indexOf(F, m2 + 1))) return r2 || u2.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: h2.length, index: z }), E2();
              if (m2 === n2 - 1) return E2(i2.substring(z, m2).replace(_2, F));
              if (F === j && i2[m2 + 1] === j) m2++;
              else if (F === j || 0 === m2 || i2[m2 - 1] !== j) {
                -1 !== p2 && p2 < m2 + 1 && (p2 = i2.indexOf(S, m2 + 1));
                var y2 = v2(-1 === (g2 = -1 !== g2 && g2 < m2 + 1 ? i2.indexOf(O, m2 + 1) : g2) ? p2 : Math.min(p2, g2));
                if (i2.substr(m2 + 1 + y2, e) === S) {
                  d2.push(i2.substring(z, m2).replace(_2, F)), i2[z = m2 + 1 + y2 + e] !== F && (m2 = i2.indexOf(F, z)), p2 = i2.indexOf(S, z), g2 = i2.indexOf(O, z);
                  break;
                }
                y2 = v2(g2);
                if (i2.substring(m2 + 1 + y2, m2 + 1 + y2 + s2) === O) {
                  if (d2.push(i2.substring(z, m2).replace(_2, F)), w2(m2 + 1 + y2 + s2), p2 = i2.indexOf(S, z), m2 = i2.indexOf(F, z), o2 && (R(), M)) return b();
                  if (A && h2.length >= A) return b(true);
                  break;
                }
                u2.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: h2.length, index: z }), m2++;
              }
            }
            else if (x && 0 === d2.length && i2.substring(z, z + a2) === x) {
              if (-1 === g2) return b();
              z = g2 + s2, g2 = i2.indexOf(O, z), p2 = i2.indexOf(S, z);
            } else if (-1 !== p2 && (p2 < g2 || -1 === g2)) d2.push(i2.substring(z, p2)), z = p2 + e, p2 = i2.indexOf(S, z);
            else {
              if (-1 === g2) break;
              if (d2.push(i2.substring(z, g2)), w2(g2 + s2), o2 && (R(), M)) return b();
              if (A && h2.length >= A) return b(true);
            }
            return E2();
            function k(e2) {
              h2.push(e2), f2 = z;
            }
            function v2(e2) {
              var t2 = 0;
              return t2 = -1 !== e2 && (e2 = i2.substring(m2 + 1, e2)) && "" === e2.trim() ? e2.length : t2;
            }
            function E2(e2) {
              return r2 || (void 0 === e2 && (e2 = i2.substring(z)), d2.push(e2), z = n2, k(d2), o2 && R()), b();
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
                    for (; e3 = i3 + "_" + t2, t2++, o3.has(e3); ) ;
                    o3.add(e3), s3[r3] = e3, a3[i3]++, n3 = true, (D = null === D ? {} : D)[e3] = i3;
                  } else a3[i3] = 1, s3[r3] = i3;
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
          if (t.error) i2.userError(t.error, t.file);
          else if (t.results && t.results.data) {
            var n2 = { abort: function() {
              r2 = true, _(t.workerId, { data: [], errors: [], meta: { aborted: true } });
            }, pause: m, resume: m };
            if (U(i2.userStep)) {
              for (var s2 = 0; s2 < t.results.data.length && (i2.userStep({ data: t.results.data[s2], errors: t.results.errors, meta: t.results.meta }, n2), !r2); s2++) ;
              delete t.results;
            } else U(i2.userChunk) && (i2.userChunk(t.results, n2, t.file), delete t.results);
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
          if ("object" != typeof e || null === e) return e;
          var t, i2 = Array.isArray(e) ? [] : {};
          for (t in e) i2[t] = w(e[t]);
          return i2;
        }
        function y(e, t) {
          return function() {
            e.apply(t, arguments);
          };
        }
        function U(e) {
          return "function" == typeof e;
        }
        return v.parse = function(e, t) {
          var i2 = (t = t || {}).dynamicTyping || false;
          U(i2) && (t.dynamicTypingFunction = i2, i2 = {});
          if (t.dynamicTyping = i2, t.transform = !!U(t.transform) && t.transform, !t.worker || !v.WORKERS_SUPPORTED) return i2 = null, v.NODE_STREAM_INPUT, "string" == typeof e ? (e = ((e2) => 65279 !== e2.charCodeAt(0) ? e2 : e2.slice(1))(e), i2 = new (t.download ? f : c)(t)) : true === e.readable && U(e.read) && U(e.on) ? i2 = new p(t) : (n.File && e instanceof File || e instanceof Object) && (i2 = new l(t)), i2.stream(e);
          (i2 = (() => {
            var e2;
            return !!v.WORKERS_SUPPORTED && (e2 = (() => {
              var e3 = n.URL || n.webkitURL || null, t2 = r.toString();
              return v.BLOB_URL || (v.BLOB_URL = e3.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", t2, ")();"], { type: "text/javascript" })));
            })(), (e2 = new n.Worker(e2)).onmessage = g, e2.id = h++, o[e2.id] = e2);
          })()).userStep = t.step, i2.userChunk = t.chunk, i2.userComplete = t.complete, i2.userError = t.error, t.step = U(t.step), t.chunk = U(t.chunk), t.complete = U(t.complete), t.error = U(t.error), delete t.worker, i2.postMessage({ input: e, config: t, workerId: i2.id });
        }, v.unparse = function(e, t) {
          var n2 = false, _2 = true, m2 = ",", y2 = "\r\n", s2 = '"', a2 = s2 + s2, i2 = false, r2 = null, o2 = false, h2 = ((() => {
            if ("object" == typeof t) {
              if ("string" != typeof t.delimiter || v.BAD_DELIMITERS.filter(function(e2) {
                return -1 !== t.delimiter.indexOf(e2);
              }).length || (m2 = t.delimiter), "boolean" != typeof t.quotes && "function" != typeof t.quotes && !Array.isArray(t.quotes) || (n2 = t.quotes), "boolean" != typeof t.skipEmptyLines && "string" != typeof t.skipEmptyLines || (i2 = t.skipEmptyLines), "string" == typeof t.newline && (y2 = t.newline), "string" == typeof t.quoteChar && (s2 = t.quoteChar), "boolean" == typeof t.header && (_2 = t.header), Array.isArray(t.columns)) {
                if (0 === t.columns.length) throw new Error("Option columns is empty");
                r2 = t.columns;
              }
              void 0 !== t.escapeChar && (a2 = t.escapeChar + s2), t.escapeFormulae instanceof RegExp ? o2 = t.escapeFormulae : "boolean" == typeof t.escapeFormulae && t.escapeFormulae && (o2 = /^[=+\-@\t\r].*$/);
            }
          })(), new RegExp(P(s2), "g"));
          "string" == typeof e && (e = JSON.parse(e));
          if (Array.isArray(e)) {
            if (!e.length || Array.isArray(e[0])) return u2(null, e, i2);
            if ("object" == typeof e[0]) return u2(r2 || Object.keys(e[0]), e, i2);
          } else if ("object" == typeof e) return "string" == typeof e.data && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields || r2), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : "object" == typeof e.data[0] ? Object.keys(e.data[0]) : []), Array.isArray(e.data[0]) || "object" == typeof e.data[0] || (e.data = [e.data])), u2(e.fields || [], e.data || [], i2);
          throw new Error("Unable to serialize unrecognized input");
          function u2(e2, t2, i3) {
            var r3 = "", n3 = ("string" == typeof e2 && (e2 = JSON.parse(e2)), "string" == typeof t2 && (t2 = JSON.parse(t2)), Array.isArray(e2) && 0 < e2.length), s3 = !Array.isArray(t2[0]);
            if (n3 && _2) {
              for (var a3 = 0; a3 < e2.length; a3++) 0 < a3 && (r3 += m2), r3 += k(e2[a3], a3);
              0 < t2.length && (r3 += y2);
            }
            for (var o3 = 0; o3 < t2.length; o3++) {
              var h3 = (n3 ? e2 : t2[o3]).length, u3 = false, d2 = n3 ? 0 === Object.keys(t2[o3]).length : 0 === t2[o3].length;
              if (i3 && !n3 && (u3 = "greedy" === i3 ? "" === t2[o3].join("").trim() : 1 === t2[o3].length && 0 === t2[o3][0].length), "greedy" === i3 && n3) {
                for (var f2 = [], l2 = 0; l2 < h3; l2++) {
                  var c2 = s3 ? e2[l2] : l2;
                  f2.push(t2[o3][c2]);
                }
                u3 = "" === f2.join("").trim();
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
            return null == e2 ? "" : e2.constructor === Date ? JSON.stringify(e2).slice(1, 25) : (r3 = false, o2 && "string" == typeof e2 && o2.test(e2) && (e2 = "'" + e2, r3 = true), i3 = e2.toString().replace(h2, a2), (r3 = r3 || true === n2 || "function" == typeof n2 && n2(e2, t2) || Array.isArray(n2) && n2[t2] || ((e3, t3) => {
              for (var i4 = 0; i4 < t3.length; i4++) if (-1 < e3.indexOf(t3[i4])) return true;
              return false;
            })(i3, v.BAD_DELIMITERS) || -1 < i3.indexOf(m2) || " " === i3.charAt(0) || " " === i3.charAt(i3.length - 1)) ? s2 + i3 + s2 : i3);
          }
        }, v.RECORD_SEP = String.fromCharCode(30), v.UNIT_SEP = String.fromCharCode(31), v.BYTE_ORDER_MARK = "\uFEFF", v.BAD_DELIMITERS = ["\r", "\n", '"', v.BYTE_ORDER_MARK], v.WORKERS_SUPPORTED = !s && !!n.Worker, v.NODE_STREAM_INPUT = 1, v.LocalChunkSize = 10485760, v.RemoteChunkSize = 5242880, v.DefaultDelimiter = ",", v.Parser = E, v.ParserHandle = i, v.NetworkStreamer = f, v.FileStreamer = l, v.StringStreamer = c, v.ReadableStreamStreamer = p, n.jQuery && ((d = n.jQuery).fn.parse = function(o2) {
          var i2 = o2.config || {}, h2 = [];
          return this.each(function(e2) {
            if (!("INPUT" === d(this).prop("tagName").toUpperCase() && "file" === d(this).attr("type").toLowerCase() && n.FileReader) || !this.files || 0 === this.files.length) return true;
            for (var t = 0; t < this.files.length; t++) h2.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, i2) });
          }), e(), this;
          function e() {
            if (0 === h2.length) U(o2.complete) && o2.complete();
            else {
              var e2, t, i3, r2, n2 = h2[0];
              if (U(o2.before)) {
                var s2 = o2.before(n2.file, n2.inputElem);
                if ("object" == typeof s2) {
                  if ("abort" === s2.action) return e2 = "AbortError", t = n2.file, i3 = n2.inputElem, r2 = s2.reason, void (U(o2.error) && o2.error({ name: e2 }, t, i3, r2));
                  if ("skip" === s2.action) return void u2();
                  "object" == typeof s2.config && (n2.instanceConfig = d.extend(n2.instanceConfig, s2.config));
                } else if ("skip" === s2) return void u2();
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
          void 0 === v.WORKER_ID && e && (v.WORKER_ID = e.workerId);
          "string" == typeof e.input ? n.postMessage({ workerId: v.WORKER_ID, results: v.parse(e.input, e.config), finished: true }) : (n.File && e.input instanceof File || e.input instanceof Object) && (e = v.parse(e.input, e.config)) && n.postMessage({ workerId: v.WORKER_ID, results: e, finished: true });
        }), (f.prototype = Object.create(u.prototype)).constructor = f, (l.prototype = Object.create(u.prototype)).constructor = l, (c.prototype = Object.create(c.prototype)).constructor = c, (p.prototype = Object.create(u.prototype)).constructor = p, v;
      });
    }
  });

  // src/state.js
  var state_default = {
    deviceUuid: "550e8400-e29b-51d4-a716-446655440000",
    //null,
    awaitingOtp: false,
    credentials: { email: "fazekas.devon+monarch3@gmail.com", password: "n90WJLg1Eotii*", otp: "" },
    apiToken: "67af1cb416aefd7cf83bd206e3e29e40b9f3727386d6756efefad800ab8486a9",
    // registerData: [], // Original data from the YNAB register file
    registerData: [
      {
        "id": "id-bx041a1aw",
        "name": "Dummy Account 1",
        "modifiedName": "New account 1",
        "type": "brokerage",
        "subtype": "cryptocurrency",
        "transactions": [
          {
            "Account": "Dummy Account 1",
            "Flag": "",
            "Date": "01/01/2025",
            "Payee": "Dummy Payee",
            "Category Group/Category": "Dummy Category",
            "Category Group": "Dummy Group",
            "Category": "Dummy Category",
            "Memo": "Dummy Memo",
            "Outflow": "100.00",
            "Inflow": "0.00",
            "Cleared": "Cleared"
          }
        ],
        "transactionCount": 1,
        "balanceCents": -1e4,
        "excluded": false,
        "balance": -100
      },
      {
        "id": "id-j252a4p84",
        "name": "Dummy Account 2",
        "modifiedName": "Dummy Account 2",
        "type": "depository",
        "subtype": "checking",
        "transactions": [
          {
            "Account": "Dummy Account 2",
            "Flag": "",
            "Date": "01/01/2025",
            "Payee": "Dummy Payee",
            "Category Group/Category": "Dummy Category",
            "Category Group": "Dummy Group",
            "Category": "Dummy Category",
            "Memo": "Dummy Memo",
            "Outflow": "100.00",
            "Inflow": "0.00",
            "Cleared": "Cleared"
          }
        ],
        "transactionCount": 1,
        "balanceCents": -1e4,
        "excluded": true,
        "balance": -100
      },
      {
        "id": "id-5c55ur3w4",
        "name": "Dummy Account 3",
        "modifiedName": "New account 2",
        "type": "brokerage",
        "subtype": "cryptocurrency",
        "transactions": [
          {
            "Account": "Dummy Account 3",
            "Flag": "",
            "Date": "01/01/2025",
            "Payee": "Dummy Payee",
            "Category Group/Category": "Dummy Category",
            "Category Group": "Dummy Group",
            "Category": "Dummy Category",
            "Memo": "Dummy Memo",
            "Outflow": "100.00",
            "Inflow": "0.00",
            "Cleared": "Cleared"
          }
        ],
        "transactionCount": 1,
        "balanceCents": -1e4,
        "excluded": false,
        "balance": -100
      }
    ],
    monarchAccounts: null,
    selectedYnabAccounts: /* @__PURE__ */ new Set()
    // Accounts locally selected for editing purposes
  };

  // src/services/ynabParser.js
  var import_papaparse = __toESM(require_papaparse_min(), 1);
  function generateId() {
    return "id-" + Math.random().toString(36).substr(2, 9);
  }
  function parseCurrencyToCents(str) {
    if (!str) return 0;
    const normalized = str.replace(/[^0-9.-]+/g, "").trim();
    const floatVal = parseFloat(normalized);
    return Math.round(floatVal * 100);
  }
  async function parseYNABCSV(file, monarchAccountTypes) {
    return new Promise((resolve, reject) => {
      import_papaparse.default.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          if (!data || data.length === 0) {
            return reject(new Error("CSV file appears empty"));
          }
          const groupedAccounts = {};
          data.forEach((row) => {
            const accountName = row["Account"]?.trim() || "Unknown";
            const inflowCents = parseCurrencyToCents(row["Inflow"]);
            const outflowCents = parseCurrencyToCents(row["Outflow"]);
            const amountCents = inflowCents - outflowCents;
            if (!groupedAccounts[accountName]) {
              const { type, subtype } = inferMonarchType(accountName, monarchAccountTypes);
              groupedAccounts[accountName] = {
                id: generateId(),
                name: accountName,
                modifiedName: accountName,
                type,
                // Monarch compatible type (ex: 'depository')
                subtype,
                // Monarch compatible subtype (ex: 'checking')
                transactions: [],
                transactionCount: 0,
                balanceCents: amountCents,
                excluded: false
              };
            }
            groupedAccounts[accountName].transactions.push(row);
            groupedAccounts[accountName].transactionCount += 1;
          });
          const accountArray = Object.values(groupedAccounts).map((acc) => ({
            ...acc,
            balance: acc.balanceCents / 100,
            excluded: acc.transactionCount === 0
          }));
          resolve(accountArray);
        },
        error: (err) => reject(err)
      });
    });
  }
  function inferMonarchType(accountName, monarchAccountTypes) {
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

  // src/components/button.js
  function enhanceButtons() {
    document.querySelectorAll(".ui-button").forEach((button) => {
      const type = button.dataset.type || "primary";
      const size = button.dataset.size || "medium";
      const fixedWidth = button.dataset.fixedWidth;
      const fullWidth = button.hasAttribute("data-fullwidth");
      const disabled = button.hasAttribute("disabled");
      button.className = "ui-button";
      button.type = "button";
      button.classList.add("font-semibold", "rounded-lg", "transition");
      button.style.transform = "none";
      switch (size) {
        case "small":
          button.classList.add("px-3", "py-1.5", "text-sm");
          break;
        case "large":
          button.classList.add("px-6", "py-3", "text-base");
          break;
        case "medium":
        default:
          button.classList.add("px-5", "py-2", "text-sm");
          break;
      }
      if (disabled) {
        button.classList.add("opacity-50", "cursor-not-allowed");
        button.style.boxShadow = "none";
      } else {
        button.classList.add("cursor-pointer");
      }
      switch (type) {
        case "primary":
          button.classList.add("bg-[#1993e5]", "text-white", "border", "border-[#1993e5]");
          if (!disabled) button.classList.add("hover:bg-blue-600");
          break;
        case "secondary":
          button.classList.add("bg-white", "text-[#111518]", "border", "border-gray-300");
          if (!disabled) button.classList.add("hover:bg-gray-100");
          break;
        case "text":
          button.classList.remove("px-3", "px-5", "px-6", "py-1.5", "py-2", "py-3");
          button.classList.add("bg-transparent", "text-blue-600");
          if (!disabled) button.classList.add("hover:underline");
          break;
        case "danger":
          button.classList.add("bg-red-500", "text-white");
          if (!disabled) button.classList.add("hover:bg-red-600");
          break;
        default:
          break;
      }
      if (fixedWidth) {
        button.style.width = `${fixedWidth}px`;
      }
      if (fullWidth) {
        button.classList.add("w-full");
      }
    });
  }

  // src/views/Upload/upload.js
  function initUploadView() {
    const browseButton = document.getElementById("browseButton");
    const fileInput = document.getElementById("fileInput");
    const uploadBox = document.getElementById("uploadBox");
    const errorMessage = document.getElementById("errorMessage");
    const howItWorksBtn = document.getElementById("howItWorksBtn");
    const closeModalBtn = document.getElementById("closeHowItWorksModal");
    enhanceButtons();
    howItWorksBtn.addEventListener("click", () => {
      openModal("howItWorksModal");
    });
    closeModalBtn.addEventListener("click", () => {
      closeModal("howItWorksModal");
    });
    uploadBox.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadBox.classList.add("border-blue-400", "bg-blue-50");
    });
    uploadBox.addEventListener("dragleave", () => {
      uploadBox.classList.remove("border-blue-400", "bg-blue-50");
    });
    uploadBox.addEventListener("drop", async (e) => {
      e.preventDefault();
      uploadBox.classList.remove("border-blue-400", "bg-blue-50");
      const file = e.dataTransfer.files[0];
      if (file) await handleFile(file);
    });
    browseButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) await handleFile(file);
    });
    async function handleFile(file) {
      if (!file.name.endsWith(".csv")) {
        errorMessage.textContent = "Please upload a valid CSV file.";
        errorMessage.classList.remove("hidden");
        return;
      }
      try {
        const parsedData = await parseYNABCSV(file);
        state_default.registerData = parsedData;
        console.log("State:", state_default);
        navigate("reviewView");
      } catch (err) {
        errorMessage.textContent = "Failed to parse file. Please ensure it is a valid YNAB register export.";
        errorMessage.classList.remove("hidden");
        console.error(err);
      }
    }
  }

  // src/views/Upload/upload.html
  var upload_default = '<div class="flex flex-col items-center justify-center py-10 px-4">\n\n  <div class="text-center max-w-1xl w-full">\n    <h2 class="text-3xl font-bold mb-4">Migrate your YNAB data</h2>\n    <p class="text-gray-600 text-base max-w-md mx-auto leading-relaxed">\n      Upload your exported YNAB register file to begin the migration process into Monarch Money.\n    </p>\n\n    <a id="howItWorksBtn" class="ui-button" data-type="text">How does this work?</a>\n  </div>\n\n  <!-- Upload Box -->\n  <div id="uploadBox" class="w-full max-w-md border-2 border-dashed border-gray-300 rounded-xl p-10 mt-10 flex flex-col items-center gap-3 transition-all">\n    <p class="text-lg font-semibold">Drag & Drop your Register CSV</p>\n    <p class="text-sm text-gray-500">or</p>\n    <input id="fileInput" type="file" accept=".csv" hidden>\n    <button id="browseButton" class="ui-button" data-type="primary">Browse Files</button>\n\n    <p class="text-xs text-gray-400 mt-2">Your file stays local. We never store or transmit your data.</p>\n  </div>\n\n  <div id="errorMessage" class="hidden text-red-500 text-sm mt-4">Some error</div>\n\n</div>\n\n<!-- Modal -->\n<div id="howItWorksModal" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">\n  <!-- Overlay -->\n  <div class="absolute inset-0 bg-[rgba(0,0,0,0.3)] transition-opacity duration-300"></div>\n\n  <!-- Modal Content -->\n  <div class="relative z-10 bg-white rounded-lg p-8 max-w-lg w-full shadow-xl transform translate-y-full transition-transform duration-500">\n    <a href="#" id="closeHowItWorksModal" class="absolute top-3 right-3 text-gray-400 text-xl font-bold cursor-pointer hover:text-black">&times;</a>\n    <h3 class="text-xl font-bold mb-4">How does this work?</h3>\n    <ol class="list-decimal pl-5 space-y-2 text-sm text-gray-700">\n      <li>Export your YNAB data.</li>\n      <li>Unzip the YNAB data on your computer.</li>\n      <li>Upload the Register CSV file here.</li>\n      <li>Choose between manual import or guided auto-import into Monarch Money.</li>\n    </ol>\n    <p class="mt-4 text-xs text-gray-500">Your files are never uploaded or stored externally.</p>\n  </div>\n</div>\n';

  // public/static-data/monarchAccountTypes.json
  var monarchAccountTypes_default = {
    generatedAt: "2025-06-02T06:26:29.704Z",
    generatedBy: "tools/fetchMonarchAccountTypes.js",
    data: [
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
    ]
  };

  // src/views/AccountReview/review.js
  var reviewTableBody;
  var importBtn;
  var searchInput;
  var currentFilter = "all";
  var searchQuery = "";
  var filteredData = [];
  function initAccountReviewView() {
    reviewTableBody = document.getElementById("reviewTableBody");
    importBtn = document.getElementById("importBtn");
    searchInput = document.getElementById("searchInput");
    enhanceButtons();
    document.getElementById("filterAll").classList.add("bg-blue-500", "text-white");
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value.toLowerCase();
      renderTable();
    });
    document.getElementById("filterAll").addEventListener("click", () => {
      currentFilter = "all";
      updateFilters();
    });
    document.getElementById("filterIncluded").addEventListener("click", () => {
      currentFilter = "included";
      updateFilters();
    });
    document.getElementById("filterExcluded").addEventListener("click", () => {
      currentFilter = "excluded";
      updateFilters();
    });
    document.getElementById("unselectAllBtn").addEventListener("click", () => {
      state_default.selectedYnabAccounts.clear();
      renderTable();
    });
    document.getElementById("bulkIncludeBtn").addEventListener("click", () => {
      state_default.registerData.forEach((acc) => {
        if (state_default.selectedYnabAccounts.has(acc.id)) acc.excluded = false;
      });
      renderTable();
    });
    document.getElementById("bulkExcludeBtn").addEventListener("click", () => {
      state_default.registerData.forEach((acc) => {
        if (state_default.selectedYnabAccounts.has(acc.id)) acc.excluded = true;
      });
      renderTable();
    });
    document.getElementById("bulkRenameBtn").addEventListener("click", () => {
      openBulkRenameModal();
    });
    document.getElementById("bulkTypeBtn").addEventListener("click", () => {
      openBulkTypeModal();
    });
    document.getElementById("masterCheckbox").addEventListener("change", masterCheckboxChange);
    backBtn.addEventListener("click", () => {
      navigate("uploadView");
    });
    importBtn.addEventListener("click", () => {
      navigate("methodView");
    });
    renderTable();
  }
  function updateFilters() {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("bg-blue-500", "text-white", "hover:bg-blue-100");
      btn.classList.add("bg-transparent", "text-gray-700", "hover:bg-blue-100");
    });
    const activeBtn = document.getElementById(`filter${capitalize(currentFilter)}`);
    activeBtn.classList.remove("bg-transparent", "text-gray-700", "hover:bg-blue-100");
    activeBtn.classList.add("bg-blue-500", "text-white");
    renderTable();
  }
  function renderTable() {
    reviewTableBody.innerHTML = "";
    filteredData = state_default.registerData.filter((acc) => {
      if (acc.transactionCount === 0) acc.excluded = true;
      if (currentFilter === "included" && acc.excluded) return false;
      if (currentFilter === "excluded" && !acc.excluded) return false;
      if (searchQuery && !acc.name.toLowerCase().includes(searchQuery)) return false;
      return true;
    });
    filteredData.forEach((account) => {
      const row = document.createElement("tr");
      row.classList.add("border-t", "border-[#dce1e5]");
      const checkboxTd = document.createElement("td");
      checkboxTd.className = "px-2 py-2 text-center";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "w-5 h-5 cursor-pointer";
      checkbox.checked = state_default.selectedYnabAccounts.has(account.id);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) state_default.selectedYnabAccounts.add(account.id);
        else state_default.selectedYnabAccounts.delete(account.id);
        console.log("State.SelectedYnabAccount:", state_default.selectedYnabAccounts);
        updateBulkBar();
        updateMasterCheckbox();
      });
      checkboxTd.appendChild(checkbox);
      row.appendChild(checkboxTd);
      const nameTd = document.createElement("td");
      nameTd.className = "px-2 py-2 max-w-[300px] truncate cursor-pointer";
      nameTd.title = account.modifiedName;
      nameTd.textContent = account.modifiedName;
      nameTd.addEventListener("click", () => openNameEditor(account, nameTd));
      row.appendChild(nameTd);
      const typeTd = document.createElement("td");
      typeTd.className = "px-2 py-2";
      const typeSelect = document.createElement("select");
      typeSelect.className = "border rounded px-2 py-1 w-full cursor-pointer";
      monarchAccountTypes_default.data.forEach((type) => {
        const opt = document.createElement("option");
        opt.value = type.typeName;
        opt.textContent = type.typeDisplay;
        if (type.typeName === account.type) opt.selected = true;
        typeSelect.appendChild(opt);
      });
      typeSelect.addEventListener("change", () => {
        account.type = typeSelect.value;
        const selectedType2 = monarchAccountTypes_default.data.find((t) => t.typeName === account.type);
        account.subtype = selectedType2?.subtypes[0]?.name || null;
        renderTable();
      });
      typeTd.appendChild(typeSelect);
      row.appendChild(typeTd);
      const subtypeTd = document.createElement("td");
      subtypeTd.className = "px-2 py-2";
      const subtypeSelect = document.createElement("select");
      subtypeSelect.className = "border rounded px-2 py-1 w-full cursor-pointer";
      const selectedType = monarchAccountTypes_default.data.find((t) => t.typeName === account.type);
      (selectedType?.subtypes || []).forEach((sub) => {
        const opt = document.createElement("option");
        opt.value = sub.name;
        opt.textContent = sub.display;
        if (sub.name === account.subtype) opt.selected = true;
        subtypeSelect.appendChild(opt);
      });
      subtypeSelect.addEventListener("change", () => {
        account.subtype = subtypeSelect.value;
      });
      subtypeTd.appendChild(subtypeSelect);
      row.appendChild(subtypeTd);
      const txTd = document.createElement("td");
      txTd.className = "px-2 py-2 text-center";
      txTd.textContent = account.transactionCount;
      row.appendChild(txTd);
      const balanceTd = document.createElement("td");
      balanceTd.className = "px-2 py-2 text-[#637988]";
      const formattedBalance = Math.abs(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      balanceTd.textContent = (account.balance < 0 ? "-$" : "$") + formattedBalance;
      row.appendChild(balanceTd);
      const includeTd = document.createElement("td");
      includeTd.className = "px-2 py-2";
      const toggleBtn = document.createElement("button");
      toggleBtn.classList.add("ui-button");
      toggleBtn.dataset.type = account.excluded ? "secondary" : "primary";
      toggleBtn.dataset.size = "small";
      toggleBtn.dataset.fixedWidth = "100";
      toggleBtn.textContent = account.excluded ? "Excluded" : "Included";
      toggleBtn.addEventListener("click", () => {
        account.excluded = !account.excluded;
        renderTable();
      });
      includeTd.appendChild(toggleBtn);
      row.appendChild(includeTd);
      reviewTableBody.appendChild(row);
    });
    updateMasterCheckbox();
    updateBulkBar();
    const anyIncluded = state_default.registerData.some((acc) => !acc.excluded);
    importBtn.disabled = !anyIncluded;
    enhanceButtons();
  }
  function masterCheckboxChange(e) {
    const checked = e.target.checked;
    if (checked) {
      filteredData.forEach((acc) => state_default.selectedYnabAccounts.add(acc.id));
    } else {
      filteredData.forEach((acc) => state_default.selectedYnabAccounts.delete(acc.id));
    }
    renderTable();
  }
  function updateMasterCheckbox() {
    const masterCheckbox = document.getElementById("masterCheckbox");
    const visible = filteredData;
    const allSelected = visible.every((acc) => state_default.selectedYnabAccounts.has(acc.id));
    const anySelected = visible.some((acc) => state_default.selectedYnabAccounts.has(acc.id));
    masterCheckbox.checked = allSelected;
    masterCheckbox.indeterminate = !allSelected && anySelected;
  }
  function updateBulkBar() {
    const bar = document.getElementById("bulkActionBar");
    const countSpan = document.getElementById("selectedCount");
    const count = state_default.selectedYnabAccounts.size;
    countSpan.textContent = count;
    if (count > 0) {
      bar.classList.remove("hidden");
      requestAnimationFrame(() => bar.classList.add("active"));
    } else {
      bar.classList.remove("active");
      setTimeout(() => bar.classList.add("hidden"), 300);
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
    input.value = account.name;
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
      if (e.key === "Escape") closeEditor();
      if (e.key === "Enter") save();
    });
    function closeEditor() {
      overlay.classList.remove("opacity-100");
      overlay.classList.add("opacity-0");
      setTimeout(() => document.body.removeChild(overlay), 200);
    }
    function save() {
      account.name = input.value.trim();
      nameCell.textContent = account.name;
      nameCell.title = account.name;
      closeEditor();
    }
  }
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
    const selectedAccounts = state_default.registerData.filter((acc) => state_default.selectedYnabAccounts.has(acc.id));
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
      renderTable();
    };
  }
  function applyPattern(pattern, account, index) {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return pattern.replace(/{{YNAB}}/g, account.originalYnabName || account.name).replace(/{{Index}}/g, index).replace(/{{Upper}}/g, (account.originalYnabName || account.name).toUpperCase()).replace(/{{Date}}/g, today);
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
      const selectedType = monarchAccountTypes_default.data.find((t) => t.typeName === typeSelect.value);
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
      const selectedAccounts = state_default.registerData.filter((acc) => state_default.selectedYnabAccounts.has(acc.id));
      selectedAccounts.forEach((acc) => {
        acc.type = typeValue;
        acc.subtype = subtypeValue || null;
      });
      modal.classList.add("hidden");
      renderTable();
    };
  }

  // src/views/AccountReview/review.html
  var review_default = '<div class="px-40 flex flex-1 justify-center py-5">\n  <div class="layout-content-container flex flex-col max-w-[960px] flex-1">\n    <div class="flex justify-between items-center p-4">\n      <h2 class="text-[#111518] text-[32px] font-bold">Review Accounts</h2>\n    </div>\n\n    <p class="text-[#111518] text-base px-4">\n      Review detected accounts and adjust their Monarch types before importing.\n    </p>\n\n    <!-- Control bar -->\n    <div class="flex items-center justify-between px-4 py-2">\n      <!-- Search -->\n      <input id="searchInput" type="text" placeholder="Search accounts..." class="border rounded px-3 py-2 w-1/3">\n\n      <!-- Filters & Bulk -->\n      <div class="flex items-center gap-6">\n\n        <!-- Filters -->\n        <div class="flex bg-gray-100 rounded-lg p-1 space-x-1">\n          <button id="filterAll" class="filter-btn px-4 py-2 text-sm font-medium rounded-md transition"\n            data-filter="all">All</button>\n\n          <button id="filterIncluded" class="filter-btn px-4 py-2 text-sm font-medium rounded-md transition"\n            data-filter="included">Included</button>\n\n          <button id="filterExcluded" class="filter-btn px-4 py-2 text-sm font-medium rounded-md transition"\n            data-filter="excluded">Excluded</button>\n        </div>\n\n      </div>\n    </div>\n\n    <div class="px-4 py-3 @container">\n      <div class="flex overflow-hidden rounded-lg border border-[#dce1e5] bg-white">\n        <table class="flex-1">\n          <thead>\n            <tr class="bg-white">\n              <th class="px-2 py-3 text-left text-sm font-medium w-[50px]">\n                <input type="checkbox" id="masterCheckbox" class="w-5 h-5 cursor-pointer">\n              </th>\n              <th class="px-2 py-3 text-left text-sm font-medium w-[230px]">Account Name</th>\n              <th class="px-2 py-3 text-left text-sm font-medium w-[250px]">Type</th>\n              <th class="px-2 py-3 text-left text-sm font-medium w-[250px]">Subtype</th>\n              <th class="px-2 py-3 text-left text-sm font-medium w-[140px]">Transactions</th>\n              <th class="px-2 py-3 text-left text-sm font-medium w-[200px]">Balance</th>\n              <th class="px-2 py-3 text-left text-sm font-medium w-[150px]">Include</th>\n            </tr>\n          </thead>\n          <tbody id="reviewTableBody">\n            <!-- populated dynamically -->\n          </tbody>\n        </table>\n      </div>\n\n      <div id="bulkActionBar"\n        class="hidden bulk-bar fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg flex items-center px-6 py-3 gap-4 border border-gray-300 transition-all duration-300">\n\n        <!-- Unselect -->\n        <button id="unselectAllBtn"\n          class="text-sm font-medium px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer" title="Unselect All">\n          <span id="selectedCount">0</span> selected\n        </button>\n\n        <!-- Separator -->\n        <div class="h-5 border-l border-gray-300"></div>\n\n        <!-- Bulk Rename -->\n        <button id="bulkRenameBtn"\n          class="text-sm font-medium px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer">\n          Rename\n        </button>\n\n        <!-- Bulk Edit Type -->\n        <button id="bulkTypeBtn" class="text-sm font-medium px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer">\n          Edit Type\n        </button>\n\n        <!-- Bulk Include -->\n        <button id="bulkIncludeBtn"\n          class="text-sm font-medium px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer">\n          Include\n        </button>\n\n        <!-- Bulk Exclude -->\n        <button id="bulkExcludeBtn"\n          class="text-sm font-medium px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer">\n          Exclude\n        </button>\n      </div>\n    </div>\n\n    <div class="flex justify-between items-center px-4 py-6 mt-6">\n      <!-- Back Button -->\n      <button id="backBtn" class="ui-button" data-type="secondary" data-size="large">\u2190 Back</button>\n\n      <!-- Forward Button -->\n      <button id="importBtn" class="ui-button" data-type="primary" data-size="large" disabled>Import Accounts</button>\n    </div>\n  </div>\n</div>\n\n<div id="bulkRenameModal" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 hidden">\n  <div class="bg-white rounded-lg shadow-lg w-[500px] p-6 relative">\n\n    <h2 class="text-xl font-bold mb-4">Bulk Rename Accounts</h2>\n\n    <label class="font-medium text-sm">Pattern:</label>\n    <input id="renamePattern" type="text" class="border rounded w-full px-3 py-2 mb-3"\n      placeholder="e.g. {{YNAB}} - {{Index}}">\n\n    <!-- Token shortcuts -->\n    <div class="flex flex-col gap-2 mb-4">\n      <button class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm w-max cursor-pointer"\n        data-token="{{YNAB}}">YNAB\n        Name</button>\n      <button class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm w-max cursor-pointer"\n        data-token="{{Index}}">Index</button>\n      <button class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm w-max cursor-pointer"\n        data-token="{{Upper}}">Uppercase YNAB</button>\n      <button class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm w-max cursor-pointer"\n        data-token="{{Date}}">Today (YYYY-MM-DD)</button>\n    </div>\n\n    <!-- Index start -->\n    <div class="flex items-center gap-3 mb-4">\n      <label class="text-sm">Index Start:</label>\n      <input id="indexStart" type="number" class="border rounded px-3 py-1 w-24" value="1" />\n    </div>\n\n    <!-- Preview -->\n    <div class="border rounded p-3 bg-gray-50 mb-4">\n      <div class="font-medium text-sm mb-2">Preview:</div>\n      <div id="renamePreview" class="text-sm text-gray-700 space-y-1"></div>\n    </div>\n\n    <div class="flex justify-end gap-3">\n      <button id="renameCancel" class="ui-button" data-type="secondary">Cancel</button>\n      <button id="renameApply" class="ui-button">Apply</button>\n    </div>\n\n  </div>\n</div>\n\n<div id="bulkTypeModal" class="fixed inset-0 bg-black bg-opacity-40 hidden z-50 flex items-center justify-center">\n  <div class="bg-white rounded-lg p-6 w-[400px]">\n    <h2 class="text-lg font-bold mb-4">Bulk Edit Account Type</h2>\n\n    <div class="mb-4">\n      <label class="block mb-1 font-medium">Account Type</label>\n      <select id="bulkTypeSelect" class="border rounded w-full px-3 py-2 cursor-pointer"></select>\n    </div>\n\n    <div class="mb-4">\n      <label class="block mb-1 font-medium">Subtype</label>\n      <select id="bulkSubtypeSelect" class="border rounded w-full px-3 py-2 cursor-pointer"></select>\n    </div>\n\n    <div class="flex justify-end gap-2">\n      <button id="bulkTypeCancel" class="ui-button" data-type="secondary">Cancel</button>\n      <button id="bulkTypeApply" class="ui-button">Apply</button>\n    </div>\n  </div>\n</div>\n\n<style>\n  /* Scoped only for this view */\n\n  .bulk-bar {\n    opacity: 1;\n    transform: translateY(75px);\n    pointer-events: none;\n    transition: opacity 0.3s ease, transform 0.3s ease;\n  }\n\n  .bulk-bar.active {\n    opacity: 1;\n    transform: translateY(0);\n    pointer-events: auto;\n  }\n</style>';

  // src/views/MethodSelect/method.js
  function initMethodSelectView() {
    console.log("State:", state_default);
    enhanceButtons();
    const manualBtn = document.getElementById("manualImportBtn");
    const autoBtn = document.getElementById("autoImportBtn");
    const totalCount = state_default.registerData.length;
    const selectedCount = state_default.registerData.filter((acc) => !acc.excluded).length;
    document.getElementById("totalCountDisplay").textContent = totalCount;
    document.getElementById("filesCountDisplay").textContent = selectedCount;
    document.getElementById("manualFileCount").textContent = selectedCount;
    manualBtn.addEventListener("click", () => {
      console.log("User selected Manual Import");
      navigate("manualInstructionsView");
    });
    autoBtn.addEventListener("click", () => {
      console.log("User selected Auto Import");
      navigate("monarchCredentialsView");
    });
    backBtn.addEventListener("click", () => {
      navigate("reviewView");
    });
  }

  // src/views/MethodSelect/method.html
  var method_default = `<div class="flex flex-col items-center justify-center py-16 space-y-8">

  <!-- Header -->
  <div class="text-center space-y-3">
    <h2 class="text-3xl font-bold">Choose Your Migration Method</h2>
    <p class="text-gray-600 text-base max-w-md mx-auto">
      You can either manually import your accounts into Monarch or let us automatically import your data.
    </p>
  </div>

  <!-- Summary Counts -->
  <div
    class="flex flex-col sm:flex-row items-center justify-center gap-10 bg-gray-50 rounded-lg p-6 border border-gray-200">

    <div class="text-center">
      <div class="text-4xl font-bold" id="totalCountDisplay">0</div>
      <div class="text-gray-500 text-sm">Total Accounts</div>
    </div>

    <div class="text-center">
      <div class="text-4xl font-bold text-green-600" id="filesCountDisplay">0</div>
      <div class="text-gray-500 text-sm">Files To Export</div>
    </div>
  </div>


  <!-- Migration Options -->
  <div class="flex flex-col sm:flex-row gap-8">

    <!-- Manual Import -->
    <div class="w-80 p-6 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white"
      id="manualImportBtn">
      <h3 class="text-xl font-semibold mb-2">Manual Import</h3>
      <p class="text-gray-500 text-sm mb-4">Download <span id="manualFileCount">0</span> CSVs and upload them directly
        into Monarch yourself.</p>
      <div class="mt-auto text-blue-600 font-semibold text-sm text-right">Select \u2192</div>
    </div>

    <!-- Auto Import -->
    <div class="w-80 p-6 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white"
      id="autoImportBtn">
      <h3 class="text-xl font-semibold mb-2">Auto Import</h3>
      <p class="text-gray-500 text-sm mb-4">We'll connect to Monarch and automatically import your selected accounts on
        your behalf.</p>
      <div class="mt-auto text-blue-600 font-semibold text-sm text-right">Select \u2192</div>
    </div>

  </div>

  <!-- Back Button -->
  <div class="flex justify-between items-center px-4 py-2 w-full">
    <!-- Back Button -->
    <button id="backBtn" class="ui-button" data-type="secondary" data-size="large">
      \u2190 Back
    </button>
  </div>
</div>

</div>`;

  // src/views/ManualInstructions/manualInstructions.js
  function initManualInstructionsView() {
    const countSpan = document.getElementById("accountCount");
    const downloadBtn = document.getElementById("downloadBtn");
    const switchBtn = document.getElementById("switchToAuto");
    const backBtn2 = document.getElementById("backBtn");
    enhanceButtons();
    const includedAccounts = state_default.registerData.filter((acc) => !acc.excluded);
    countSpan.textContent = `${includedAccounts.length} account${includedAccounts.length !== 1 ? "s" : ""}`;
    downloadBtn.addEventListener("click", () => {
      alert("Generating ZIP file (not yet implemented)");
    });
    switchBtn.addEventListener("click", () => {
      navigate("monarchCredentialsView");
    });
    backBtn2.addEventListener("click", () => {
      navigate("methodView");
    });
  }

  // src/views/ManualInstructions/manualInstructions.html
  var manualInstructions_default = `<div class="flex flex-col items-center justify-center py-16 px-6 space-y-12 max-w-2xl mx-auto">

  <!-- Progress -->
  <div class="text-center space-y-2">
    <h2 class="text-3xl font-bold text-[#111518]">You're Ready to Import</h2>
    <p class="text-gray-600 text-base">
      <span id="accountCount"></span> prepared for migration.
    </p>
  </div>

  <!-- Manual Import Card -->
  <div class="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">

    <!-- Download -->
    <div>
      <h3 class="text-xl font-semibold mb-2">Step 1 \u2014 Download Files</h3>
      <p class="text-gray-500 mb-4">
        Download a ZIP containing one CSV per account.
      </p>

      <a id="downloadBtn" class="ui-button" data-type="primary" data-size="large" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" class="inline-block h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 4v12" />
        </svg>Download CSV Bundle
      </a>
    </div>

    <!-- Upload Instructions -->
    <div class="mt-12">
      <h3 class="text-xl font-semibold mb-2">Step 2 \u2014 Import into Monarch</h3>
      <p class="text-gray-500 mb-2">In Monarch:</p>

      <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
        <li>Go to <strong>Accounts \u2192 Add account</strong></li>
        <li>Choose <strong>Add manual account</strong></li>
        <li>Select your desire <strong>account type</strong></li>
        <li>Give it a name and starting balance of <strong>$0.00</strong></li>
        <li>Go to <strong>Edit \u2192 Upload transactions</strong></li>
        <li>Upload your account CSV file</li>
        <li>Enable <strong>Adjust account's balances based on these transactions</strong></li>
        <li>Click <strong>Add to account</strong></li>
        <li>Repeat for all your accounts</li>
      </ul>
    </div>
  </div>

  <!-- Auto Import Promo -->
  <div class="flex flex-col items-center text-center gap-3 bg-[#f9fafb] rounded-lg p-6 border border-gray-200">
    <h4 class="text-lg font-semibold text-[#111518]">Looking for the easiest way?</h4>
    <p class="text-sm text-gray-600">
      Our Auto Import tool transfers your accounts directly into Monarch with zero file handling.
    </p>

    <button id="switchToAuto" class="ui-button" data-size="large">Use Auto Import Instead</button>
  </div>

  <!-- Footer -->
  <div class="flex justify-between items-center px-4 py-2 w-full">
    <button id="backBtn" class="ui-button" data-type="secondary" data-size="large">
      \u2190 Back
    </button>

    <a href="https://app.monarchmoney.com" target="_blank" class="ui-button" data-type="secondary" data-size="large">
      <svg xmlns="http://www.w3.org/2000/svg" class="inline-block h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M14 3h7m0 0v7m0-7L10 14M5 5h14v14H5V5z" />
      </svg>Open Monarch
    </a>
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

  // src/api/config.js
  var base = location.hostname === "localhost" ? "http://localhost:3000/dev/" : "/.netlify/functions/";
  var API = {
    login: base + "monarchLogin",
    fetchAccounts: base + "fetchMonarchAccounts",
    createAccounts: base + "createMonarchAccounts",
    generateStatements: base + "generateStatements"
  };

  // src/api/utils.js
  async function postJson(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const errorRes = await res.json();
    if (!res.ok) throw new Error(errorRes.error || errorRes.message || "API error");
    return res.json();
  }

  // src/api/monarchApi.js
  var monarchApi = {
    login: (email, password, deviceUuid, otp) => postJson(API.login, { email, password, deviceUuid, otp }),
    fetchMonarchAccounts: (token) => postJson(API.fetchAccounts, { token }),
    createAccounts: (token, accounts) => postJson(API.createAccounts, { token, accounts }),
    generateAccounts: (accounts) => fetch(API.generateStatements, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accounts })
    })
  };

  // src/views/MonarchCredentials/monarchCredentials.js
  function initMonarchCredentialsView() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const connectBtn = document.getElementById("connectBtn");
    const backBtn2 = document.getElementById("backBtn");
    const form = document.getElementById("credentialsForm");
    const errorBox = document.getElementById("errorBox");
    enhanceButtons();
    if (!state_default.deviceUuid) {
      state_default.deviceUuid = v4_default();
    }
    if (state_default.credentials.email) {
      emailInput.value = state_default.credentials.email;
    }
    if (state_default.credentials.password) {
      passwordInput.value = state_default.credentials.password;
    }
    validateForm();
    function validateForm() {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const valid = email.length > 0 && password.length > 0;
      connectBtn.disabled = !valid;
      enhanceButtons();
      console.log("State:", state_default, "email:", email, "password:", password);
    }
    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      connectBtn.click();
    });
    connectBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      errorBox.classList.add("hidden");
      connectBtn.disabled = true;
      connectBtn.textContent = "Connecting\u2026";
      try {
        const response = await monarchApi.login(email, password, state_default.deviceUuid);
        console.log("Login response:", response);
        if (response.otpRequired) {
          state_default.credentials.email = email;
          state_default.credentials.password = password;
          state_default.awaitingOtp = true;
          navigate("monarchOtpView");
          return;
        }
        if (response.token) {
          state_default.apiToken = response.token;
          state_default.credentials.email = email;
          state_default.credentials.password = password;
          state_default.awaitingOtp = false;
          navigate("monarchCompleteView");
          return;
        }
        throw new Error("Unknown login response.");
      } catch (err) {
        console.error("Login error", err);
        errorBox.textContent = err?.message || "An unexpected error occurred.";
        errorBox.classList.remove("hidden");
      } finally {
        connectBtn.disabled = false;
        connectBtn.textContent = "Connect to Monarch";
      }
    });
    backBtn2.addEventListener("click", () => {
      navigate("methodView");
    });
  }

  // src/views/MonarchCredentials/monarchCredentials.html
  var monarchCredentials_default = '<div class="flex flex-col items-center justify-center py-3 px-6 space-y-7 max-w-lg mx-auto">\n\n  <div class="text-center">\n    <h2 class="text-3xl font-bold mb-2">Auto Import: Connect Your Monarch Account</h2>\n    <p class="text-gray-600 text-base max-w-md">\n      Authorize your Monarch account so we can directly import your accounts and transactions.\n    </p>\n  </div>\n\n  <div class="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">\n\n    <form id="credentialsForm" class="space-y-4">\n      <div>\n        <label class="block font-medium text-sm text-[#111518] mb-1 cursor-pointer" for="email">Email</label>\n        <input id="email" type="email" class="border rounded-lg w-full px-4 py-3 text-sm" placeholder="you@email.com" autocomplete="username">\n      </div>\n\n      <div>\n        <label class="block font-medium text-sm text-[#111518] mb-1 cursor-pointer" for="password">Password</label>\n        <input id="password" type="password" class="border rounded-lg w-full px-4 py-3 text-sm" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" autocomplete="current-password">\n      </div>\n\n      <div class="flex items-center gap-2 mt-1">\n        <div class="w-5 h-5 text-green-600">\n          <svg viewBox="0 0 24 24" fill="currentColor">\n            <path\n              d="M12 1a11 11 0 100 22 11 11 0 000-22zm0 20a9 9 0 110-18 9 9 0 010 18zm-1-5h2v2h-2v-2zm0-10h2v8h-2V6z" />\n          </svg>\n        </div>\n        <p class="text-xs text-gray-500">\n          Your credentials are never stored and used only for this import session.\n        </p>\n      </div>\n\n      <div id="errorBox" class="hidden text-red-500 text-sm mt-4"></div>\n\n    </form>\n\n    <button id="connectBtn" class="ui-button" data-type="primary" data-size="large" data-fullWidth disabled>\n      Connect & Start Import\n    </button>\n\n  </div>\n\n  <div class="flex justify-between w-full max-w-md">\n    <button id="backBtn" class="ui-button" data-type="secondary" data-size="large">\u2190 Back</button>\n  </div>\n\n</div>';

  // src/views/MonarchOtp/monarchOtp.js
  function initMonarchOtpView() {
    const otpInput = document.getElementById("otpInput");
    const submitOtpBtn = document.getElementById("submitOtpBtn");
    const otpError = document.getElementById("otpError");
    const backBtn2 = document.getElementById("backBtn");
    enhanceButtons();
    otpInput.addEventListener("input", () => {
      otpInput.value = otpInput.value.replace(/\D/g, "").slice(0, 6);
      submitOtpBtn.disabled = otpInput.value.length !== 6;
      enhanceButtons();
    });
    submitOtpBtn.addEventListener("click", async () => {
      otpError.classList.add("hidden");
      state_default.credentials.otp = otpInput.value;
      try {
        const response = await monarchApi.login(state_default.credentials.email, state_default.credentials.password, state_default.deviceUuid, state_default.credentials.otp);
        console.log("Login response:", response);
        if (response.token) {
          state_default.apiToken = response.token;
          state_default.awaitingOtp = false;
          navigate("monarchCompleteView");
          return;
        }
        console.error("Login failed:", response);
        throw new Error("Unknown login response.");
      } catch (err) {
        otpError.classList.remove("hidden");
        otpError.textContent = "Invalid OTP. Please try again.";
        console.error("OTP verification error", err);
      }
    });
    backBtn2.addEventListener("click", () => {
      navigate("monarchCredentialsView");
    });
  }

  // src/views/MonarchOtp/monarchOtp.html
  var monarchOtp_default = '<div class="flex flex-col items-center justify-center py-16 space-y-10">\n\n  <div class="text-center">\n    <h2 class="text-3xl font-bold mb-2">Enter Your Verification Code</h2>\n    <p class="text-gray-600 text-base max-w-md">\n      Monarch has sent a 6-digit verification code to your email address. Enter it below to continue.\n    </p>\n  </div>\n\n  <div class="flex flex-col items-center space-y-5 w-80">\n\n    <input id="otpInput" type="text" maxlength="6" pattern="[0-9]*" inputmode="numeric"\n      class="border rounded px-4 py-3 text-center text-2xl tracking-widest w-full focus:ring-2 focus:ring-blue-400"\n      placeholder="______">\n\n    <div id="otpError" class="text-red-500 text-sm hidden">Invalid code. Please try again.</div>\n\n    <button id="submitOtpBtn"\n      class="ui-button" data-type="primary" data-size="large" data-fullWidth\n      disabled>\n      Verify & Start Import\n    </button>\n\n  </div>\n\n  <div class="flex justify-between items-center px-4 py-4 w-full max-w-lg">\n    <button id="backBtn"\n      class="ui-button" data-type="secondary" data-size="large">\n      \u2190 Back\n    </button>\n  </div>\n\n</div>\n';

  // src/views/MonarchComplete/monarchComplete.js
  function initAutoImportCompleteView() {
    const restartBtn = document.getElementById("restartBtn");
    const successContainer = document.getElementById("successContainer");
    const errorContainer = document.getElementById("errorContainer");
    const errorMessageBox = document.getElementById("errorMessage");
    successContainer.classList.add("hidden");
    errorContainer.classList.add("hidden");
    enhanceButtons();
    createAccounts();
    async function createAccounts() {
      try {
        console.log("State:", state_default);
        const accounts = state_default.registerData.filter((account) => !account.excluded);
        console.log("Importing filtered accounts:", accounts);
        const response = await monarchApi.createAccounts(state_default.apiToken, accounts);
        console.log("CreateAccounts response:", response);
        if (response.error) {
          errorMessageBox.textContent = response.error || "An unexpected error occurred while migrating your accounts.";
          errorContainer.classList.remove("hidden");
          return;
        }
        successContainer.classList.remove("hidden");
      } catch (err) {
        console.error("Mapping error", err);
        errorMessageBox.textContent = err?.message || "An unexpected error occurred while migrating your accounts.";
        errorContainer.classList.remove("hidden");
      }
    }
    backBtn.addEventListener("click", () => {
      navigate("monarchCredentialsView");
    });
    restartBtn.addEventListener("click", () => {
      navigate("uploadView");
    });
  }

  // src/views/MonarchComplete/monarchComplete.html
  var monarchComplete_default = `<div class="flex flex-col items-center justify-center py-24 space-y-10">

  <!-- \u2705 Success State -->
  <div id="successContainer" class="text-center">
    <div class="w-20 h-20 mx-auto mb-6">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" class="w-full h-full text-green-500">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
    </div>

    <h2 class="text-3xl font-bold mb-4">Migration Started</h2>

    <p class="text-gray-600 text-base max-w-md mx-auto">
      Your accounts are being imported into Monarch Money. This process may take a few minutes depending on the size of
      your data.
      <br /><br />
      You can refresh Monarch periodically to see your accounts appear as they're processed.
    </p>
  </div>

  <!-- \u274C Error State -->
  <div id="errorContainer" class="text-center hidden">
    <div class="w-20 h-20 mx-auto mb-6">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" class="w-full h-full text-red-500">
        <path d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"></path>
      </svg>
    </div>

    <h2 class="text-3xl font-bold mb-4">Migration Failed</h2>

    <p id="errorMessage" class="text-gray-600 text-base max-w-md mx-auto mb-6"></p>

    <div class="flex justify-between w-full max-w-md">
      <button id="backBtn" class="ui-button" data-type="secondary" data-size="large">\u2190 Back</button>
      <button id="restartBtn" class="ui-button" data-type="primary" data-size="large">Restart</button>
    </div>

  </div>
</div>`;

  // src/router.js
  var routes = {
    uploadView: { template: upload_default, init: initUploadView, scroll: false },
    reviewView: { template: review_default, init: initAccountReviewView, scroll: true },
    methodView: { template: method_default, init: initMethodSelectView, scroll: false },
    manualInstructionsView: { template: manualInstructions_default, init: initManualInstructionsView, scroll: true },
    monarchCredentialsView: { template: monarchCredentials_default, init: initMonarchCredentialsView, scroll: false },
    monarchOtpView: { template: monarchOtp_default, init: initMonarchOtpView, scroll: false },
    monarchCompleteView: { template: monarchComplete_default, init: initAutoImportCompleteView, scroll: false }
  };
  async function navigate(view) {
    const app = document.getElementById("app");
    app.innerHTML = "";
    const route = routes[view];
    if (!route) {
      app.innerHTML = "<p>404 - View not found</p>";
      return;
    }
    if (route.scroll) {
      document.body.classList.add("always-scroll");
    } else {
      document.body.classList.remove("always-scroll");
    }
    document.getElementById("app").innerHTML = route.template;
    route.init();
  }

  // src/main.js
  window.addEventListener("DOMContentLoaded", () => {
    navigate("monarchCompleteView");
  });
})();
/*! Bundled license information:

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.5.2
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/
