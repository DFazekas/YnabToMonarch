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

  // src/core/ComponentRegistry.js
  var ComponentRegistry = class {
    constructor() {
      this.components = /* @__PURE__ */ new Map();
      this.initialized = /* @__PURE__ */ new WeakSet();
      this.observer = null;
    }
    register(selector, init) {
      this.components.set(selector, init);
    }
    start() {
      if (this.observer)
        return;
      this.scanAndInit(document.body);
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.scanAndInit(node);
            }
          });
        });
      });
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    stop() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
    scanAndInit(root) {
      this.components.forEach((init, selector) => {
        const elements = root.matches?.(selector) ? [root] : Array.from(root.querySelectorAll?.(selector) || []);
        elements.forEach((element) => {
          if (!this.initialized.has(element)) {
            try {
              init(element);
              this.initialized.add(element);
            } catch (error) {
              console.error(`Failed to initialize component ${selector}:`, error);
            }
          }
        });
      });
    }
    init(element) {
      this.scanAndInit(element);
    }
  };
  var registry = new ComponentRegistry();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => registry.start());
  } else {
    registry.start();
  }

  // src/components/AutoStyledButton.js
  var buttonStyles = {
    base: [
      "font-semibold",
      "rounded-lg",
      "transition-all",
      "duration-200",
      "ease-in-out",
      "flex",
      "items-center",
      "justify-center"
    ],
    sizes: {
      small: ["px-2", "py-1", "text-xs", "sm:px-3", "sm:py-1.5", "sm:text-sm"],
      medium: ["px-3", "py-2", "text-sm", "sm:px-5", "sm:py-2", "sm:text-sm"],
      large: ["px-4", "py-2.5", "text-sm", "sm:px-6", "sm:py-3", "sm:text-base", "md:px-8", "md:py-4"]
    },
    colors: {
      blue: {
        solid: {
          base: ["bg-[#1993e5]", "text-white", "shadow-sm"],
          hover: [
            "hover:bg-blue-600",
            "hover:shadow-md",
            "focus:ring-2",
            "focus:ring-blue-500",
            "focus:ring-offset-2",
            "active:bg-blue-700"
          ]
        },
        outline: {
          base: ["bg-transparent", "text-blue-600", "border", "border-blue-600", "shadow-none"],
          hover: [
            "hover:bg-blue-50",
            "hover:border-blue-700",
            "hover:text-blue-700",
            "focus:ring-2",
            "focus:ring-blue-500",
            "focus:ring-offset-2",
            "active:bg-blue-100"
          ]
        },
        text: {
          base: ["bg-transparent", "text-blue-600", "border-none", "shadow-none"],
          hover: [
            "hover:underline",
            "hover:text-blue-700",
            "focus:ring-2",
            "focus:ring-blue-500",
            "focus:ring-offset-2"
          ]
        }
      },
      red: {
        solid: {
          base: ["bg-red-500", "text-white", "shadow-sm"],
          hover: [
            "hover:bg-red-600",
            "hover:shadow-md",
            "focus:ring-2",
            "focus:ring-red-500",
            "focus:ring-offset-2",
            "active:bg-red-700"
          ]
        },
        outline: {
          base: ["bg-transparent", "text-red-600", "border", "border-red-600", "shadow-none"],
          hover: [
            "hover:bg-red-50",
            "hover:border-red-700",
            "hover:text-red-700",
            "focus:ring-2",
            "focus:ring-red-500",
            "focus:ring-offset-2",
            "active:bg-red-100"
          ]
        },
        text: {
          base: ["bg-transparent", "text-red-600", "border-none", "shadow-none"],
          hover: [
            "hover:underline",
            "hover:text-red-700",
            "focus:ring-2",
            "focus:ring-red-500",
            "focus:ring-offset-2"
          ]
        }
      },
      black: {
        solid: {
          base: ["bg-gray-800", "text-white", "shadow-sm"],
          hover: [
            "hover:bg-gray-700",
            "hover:shadow-md",
            "focus:ring-2",
            "focus:ring-black",
            "focus:ring-offset-2",
            "active:bg-gray-800"
          ]
        },
        outline: {
          base: ["bg-transparent", "text-black", "border", "border-black", "shadow-none"],
          hover: [
            "hover:bg-gray-100",
            "hover:border-gray-700",
            "hover:text-gray-700",
            "focus:ring-2",
            "focus:ring-black",
            "focus:ring-offset-2",
            "active:bg-gray-200"
          ]
        },
        text: {
          base: ["bg-transparent", "text-black", "border-none", "shadow-none"],
          hover: [
            "hover:underline",
            "hover:text-gray-700",
            "focus:ring-2",
            "focus:ring-black",
            "focus:ring-offset-2"
          ]
        }
      },
      yellow: {
        solid: {
          base: ["bg-yellow-500", "text-white", "shadow-sm"],
          hover: [
            "hover:bg-yellow-600",
            "hover:shadow-md",
            "focus:ring-2",
            "focus:ring-yellow-500",
            "focus:ring-offset-2",
            "active:bg-yellow-700"
          ]
        },
        outline: {
          base: ["bg-transparent", "text-yellow-600", "border", "border-yellow-600", "shadow-none"],
          hover: [
            "hover:bg-yellow-50",
            "hover:border-yellow-700",
            "hover:text-yellow-700",
            "focus:ring-2",
            "focus:ring-yellow-500",
            "focus:ring-offset-2",
            "active:bg-yellow-100"
          ]
        },
        text: {
          base: ["bg-transparent", "text-yellow-600", "border-none", "shadow-none"],
          hover: [
            "hover:underline",
            "hover:text-yellow-700",
            "focus:ring-2",
            "focus:ring-yellow-500",
            "focus:ring-offset-2"
          ]
        }
      },
      grey: {
        solid: {
          base: ["bg-gray-500", "text-white", "shadow-sm"],
          hover: [
            "hover:bg-gray-600",
            "hover:shadow-md",
            "focus:ring-2",
            "focus:ring-gray-500",
            "focus:ring-offset-2",
            "active:bg-gray-700"
          ]
        },
        outline: {
          base: ["bg-transparent", "text-gray-700", "border", "border-gray-300", "shadow-none"],
          hover: [
            "hover:bg-gray-50",
            "hover:border-gray-400",
            "hover:text-gray-800",
            "focus:ring-2",
            "focus:ring-gray-500",
            "focus:ring-offset-2",
            "active:bg-gray-100"
          ]
        },
        text: {
          base: ["bg-transparent", "text-gray-600", "border-none", "shadow-none"],
          hover: [
            "hover:underline",
            "hover:text-gray-700",
            "focus:ring-2",
            "focus:ring-gray-500",
            "focus:ring-offset-2"
          ]
        }
      },
      white: {
        solid: {
          base: ["bg-white", "text-gray-700", "border", "border-gray-300", "shadow-sm"],
          hover: [
            "hover:bg-gray-50",
            "hover:border-gray-400",
            "hover:text-gray-800",
            "focus:ring-2",
            "focus:ring-gray-500",
            "focus:ring-offset-2",
            "active:bg-gray-100"
          ]
        },
        outline: {
          base: ["bg-transparent", "text-gray-700", "border", "border-gray-300", "shadow-none"],
          hover: [
            "hover:bg-gray-50",
            "hover:border-gray-400",
            "hover:text-gray-800",
            "focus:ring-2",
            "focus:ring-gray-500",
            "focus:ring-offset-2",
            "active:bg-gray-100"
          ]
        },
        text: {
          base: ["bg-transparent", "text-white", "border-none", "shadow-none"],
          hover: [
            "hover:underline",
            "hover:text-white",
            "focus:ring-2",
            "focus:ring-gray-500",
            "focus:ring-offset-2"
          ]
        }
      },
      purple: {
        solid: {
          base: ["bg-purple-500", "text-white", "shadow-sm"],
          hover: [
            "hover:bg-purple-600",
            "hover:shadow-md",
            "focus:ring-2",
            "focus:ring-purple-500",
            "focus:ring-offset-2",
            "active:bg-purple-700"
          ]
        },
        outline: {
          base: ["bg-transparent", "text-purple-600", "border", "border-purple-600", "shadow-none"],
          hover: [
            "hover:bg-purple-50",
            "hover:border-purple-700",
            "hover:text-purple-700",
            "focus:ring-2",
            "focus:ring-purple-500",
            "focus:ring-offset-2",
            "active:bg-purple-100"
          ]
        },
        text: {
          base: ["bg-transparent", "text-purple-600", "border-none", "shadow-none"],
          hover: [
            "hover:underline",
            "hover:text-purple-700",
            "focus:ring-2",
            "focus:ring-purple-500",
            "focus:ring-offset-2"
          ]
        }
      },
      green: {
        solid: {
          base: ["bg-green-500", "text-white", "shadow-sm"],
          hover: [
            "hover:bg-green-600",
            "hover:shadow-md",
            "focus:ring-2",
            "focus:ring-green-500",
            "focus:ring-offset-2",
            "active:bg-green-700"
          ]
        },
        outline: {
          base: ["bg-transparent", "text-green-600", "border", "border-green-600", "shadow-none"],
          hover: [
            "hover:bg-green-50",
            "hover:border-green-700",
            "hover:text-green-700",
            "focus:ring-2",
            "focus:ring-green-500",
            "focus:ring-offset-2",
            "active:bg-green-100"
          ]
        },
        text: {
          base: ["bg-transparent", "text-green-600", "border-none", "shadow-none"],
          hover: [
            "hover:underline",
            "hover:text-green-700",
            "focus:ring-2",
            "focus:ring-green-500",
            "focus:ring-offset-2"
          ]
        }
      },
      amber: {
        solid: {
          base: ["bg-amber-500", "text-white", "shadow-sm"],
          hover: [
            "hover:bg-amber-600",
            "hover:shadow-md",
            "focus:ring-2",
            "focus:ring-amber-500",
            "focus:ring-offset-2",
            "active:bg-amber-700"
          ]
        },
        outline: {
          base: ["bg-transparent", "text-amber-600", "border", "border-amber-600", "shadow-none"],
          hover: [
            "hover:bg-amber-50",
            "hover:border-amber-700",
            "hover:text-amber-700",
            "focus:ring-2",
            "focus:ring-amber-500",
            "focus:ring-offset-2",
            "active:bg-amber-100"
          ]
        },
        text: {
          base: ["bg-transparent", "text-amber-600", "border-none", "shadow-none"],
          hover: [
            "hover:underline",
            "hover:text-amber-700",
            "focus:ring-2",
            "focus:ring-amber-500",
            "focus:ring-offset-2"
          ]
        }
      },
      transparent: {
        solid: {
          base: ["bg-transparent", "text-white"],
          hover: [
            "hover:bg-white/10",
            "hover:shadow-md",
            "focus:ring-2",
            "focus:ring-gray-500",
            "focus:ring-offset-2",
            "active:bg-gray-700"
          ]
        },
        outline: {
          base: ["bg-transparent", "text-white", "border", "border-gray-300", "shadow-none"],
          hover: [
            "hover:bg-gray-50",
            "hover:border-gray-400",
            "hover:text-gray-800",
            "focus:ring-2",
            "focus:ring-gray-500",
            "focus:ring-offset-2",
            "active:bg-gray-100"
          ]
        },
        text: {
          base: ["bg-transparent", "text-gray-600", "border-none", "shadow-none"],
          hover: [
            "hover:underline",
            "hover:text-gray-700",
            "focus:ring-2",
            "focus:ring-gray-500",
            "focus:ring-offset-2"
          ]
        }
      }
    }
  };
  var AutoStyledButton = class extends HTMLElement {
    constructor() {
      super();
      this._initialized = false;
    }
    connectedCallback() {
      if (!this._initialized) {
        this.applyStyles();
        this._initialized = true;
        this._observer = new MutationObserver((mutations) => {
          if (this._applyingStyles)
            return;
          this.applyStyles();
        });
        this._observer.observe(this, {
          attributes: true,
          attributeFilter: ["data-type", "data-color", "data-size", "disabled", "data-fullwidth"]
        });
        this._overrideDisabledProperty();
      }
    }
    _overrideDisabledProperty() {
      Object.defineProperty(this, "disabled", {
        get() {
          return this.hasAttribute("disabled");
        },
        set(value) {
          const currentValue = this.hasAttribute("disabled");
          const newValue = Boolean(value);
          if (currentValue !== newValue) {
            if (newValue) {
              this.setAttribute("disabled", "");
            } else {
              this.removeAttribute("disabled");
            }
          }
        },
        configurable: true
      });
    }
    disconnectedCallback() {
      if (this._observer) {
        this._observer.disconnect();
      }
    }
    applyStyles() {
      if (this._applyingStyles)
        return;
      this._applyingStyles = true;
      try {
        const type = this.dataset.type || "solid";
        const color = this.dataset.color || "blue";
        const size = this.dataset.size || "medium";
        const isDisabled = this.hasAttribute("disabled");
        const fullWidth = this.hasAttribute("data-fullwidth");
        this.className = "ui-button";
        this.classList.add(...buttonStyles.base);
        if (type !== "text") {
          this.classList.add(...buttonStyles.sizes[size] || buttonStyles.sizes.medium);
        }
        const colorStyles = buttonStyles.colors[color] || buttonStyles.colors.blue;
        const typeStyle = colorStyles[type] || colorStyles.solid;
        this.classList.add(...typeStyle.base);
        if (!isDisabled) {
          this.classList.add("cursor-pointer", ...typeStyle.hover);
        } else {
          this.classList.add("opacity-50", "cursor-not-allowed");
        }
        if (fullWidth) {
          this.classList.add("w-full");
        }
        if (!this.hasAttribute("type")) {
          this.setAttribute("type", "button");
        }
      } finally {
        this._applyingStyles = false;
      }
    }
    updateStyle() {
      this.applyStyles();
    }
  };
  customElements.define("ui-button", AutoStyledButton);

  // src/components/Card.js
  var Card = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this._render();
    }
    static get observedAttributes() {
      return ["data-color", "data-width"];
    }
    attributeChangedCallback() {
      if (this.shadowRoot.innerHTML) {
        this._updateStyles();
      }
    }
    _getColorClasses() {
      const color = this.getAttribute("data-color") || "blue";
      const colorMap = {
        blue: {
          border: "#93c5fd",
          bg: "rgba(219, 234, 254, 0.3)",
          iconBg: "#bfdbfe",
          iconColor: "#1d4ed8",
          textColor: "#2563eb",
          decorBg: "#dbeafe"
        },
        green: {
          border: "#86efac",
          bg: "rgba(220, 252, 231, 0.3)",
          iconBg: "#bbf7d0",
          iconColor: "#16a34a",
          textColor: "#16a34a",
          decorBg: "#dcfce7"
        },
        purple: {
          border: "#c4b5fd",
          bg: "rgba(237, 233, 254, 0.3)",
          iconBg: "#ddd6fe",
          iconColor: "#7c3aed",
          textColor: "#7c3aed",
          decorBg: "#ede9fe"
        },
        red: {
          border: "#fca5a5",
          bg: "rgba(254, 226, 226, 0.3)",
          iconBg: "#fecaca",
          iconColor: "#dc2626",
          textColor: "#dc2626",
          decorBg: "#fee2e2"
        }
      };
      return colorMap[color] || colorMap.blue;
    }
    _updateStyles() {
      const colors = this._getColorClasses();
      const width = this.getAttribute("data-width") || "full";
      const widthStyles = {
        full: "width: 100%;",
        auto: "width: auto;",
        fixed: "width: 300px;"
      };
      const root = this.shadowRoot.querySelector(".card-container");
      if (root) {
        root.style.cssText = widthStyles[width] || widthStyles.full;
      }
      if (this.shadowRoot.styleSheets[0]) {
        const sheet = this.shadowRoot.styleSheets[0];
        const rule = sheet.cssRules[0];
        if (rule && rule.style) {
          rule.style.setProperty("--card-border", colors.border);
          rule.style.setProperty("--card-bg", colors.bg);
          rule.style.setProperty("--icon-bg", colors.iconBg);
          rule.style.setProperty("--icon-color", colors.iconColor);
          rule.style.setProperty("--text-color", colors.textColor);
          rule.style.setProperty("--decor-bg", colors.decorBg);
        }
      }
    }
    _render() {
      const colors = this._getColorClasses();
      const width = this.getAttribute("data-width") || "full";
      const widthStyles = {
        full: "width: 100%;",
        auto: "width: auto; min-width: 280px;",
        fixed: "width: 300px;"
      };
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          --card-border: ${colors.border};
          --card-bg: ${colors.bg};
          --icon-bg: ${colors.iconBg};
          --icon-color: ${colors.iconColor};
          --text-color: ${colors.textColor};
          --decor-bg: ${colors.decorBg};
          --card-title-font-size: 1.125rem;
          --card-title-margin-bottom: 0;
          display: block;
        }

        .card-container {
          ${widthStyles[width] || widthStyles.full}
          user-select: none;
        }

        @media (min-width: 640px) {
          :host {
            --card-title-font-size: 1.25rem;
            --card-title-margin-bottom: 1rem;
          }
        }

        @media (min-width: 768px) {
          :host {
            --card-title-font-size: 1.5rem;
            --card-title-margin-bottom: 1.5rem;
          }
        }

        .card-inner {
          height: 100%;
          padding: 1rem;
          border: 2px solid var(--card-border);
          border-radius: 0.75rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          background-color: var(--card-bg);
          position: relative;
          overflow: hidden;
          transition: all 300ms;
        }

        @media (min-width: 640px) {
          .card-inner {
            padding: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .card-inner {
            padding: 2rem;
          }
        }

        .decoration {
          position: absolute;
          top: 0;
          right: 0;
          width: 5rem;
          height: 5rem;
          background-color: var(--decor-bg);
          border-radius: 9999px;
          transform: translateY(-2.5rem) translateX(2.5rem);
          opacity: 0.5;
          transition: opacity 300ms;
        }

        .card-content {
          position: relative;
          z-index: 10;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .card-title-wrapper {
          flex: 1;
          padding-right: 1rem;
          font-size: var(--card-title-font-size);
          font-weight: 700;
          color: #111827;
          line-height: 1.5;
        }

        .card-title-wrapper ::slotted(*) {
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          line-height: inherit;
          margin: 0;
          margin-bottom: var(--card-title-margin-bottom);
          display: block;
        }

        .icon-wrapper {
          width: 2.5rem;
          height: 2.5rem;
          background-color: var(--icon-bg);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 300ms;
        }

        @media (min-width: 640px) {
          .icon-wrapper {
            width: 3rem;
            height: 3rem;
          }
        }

        ::slotted([slot="icon"]) {
          width: 1.25rem;
          height: 1.25rem;
          color: var(--icon-color);
        }

        @media (min-width: 640px) {
          ::slotted([slot="icon"]) {
            width: 1.5rem;
            height: 1.5rem;
          }
        }

        .card-title {
          margin-bottom: 0.75rem;
        }

        .card-eyebrow {
          font-size: 0.875rem;
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: #9ca3af;
          margin-bottom: 0.25rem;
        }

        ::slotted([slot="title"]) {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
          line-height: 1.4;
        }

        @media (min-width: 640px) {
          ::slotted([slot="title"]) {
            font-size: 1.25rem;
          }
        }

        @media (min-width: 768px) {
          ::slotted([slot="title"]) {
            font-size: 1.5rem;
          }
        }

        .card-description {
          margin-bottom: 1.5rem;
          min-height: 3rem;
        }

        ::slotted([slot="description"]) {
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0;
        }

        @media (min-width: 640px) {
          ::slotted([slot="description"]) {
            font-size: 1rem;
          }
        }

        .card-actions {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        ::slotted([slot="actions"]) {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
      </style>

      <div class="card-container">
        <div class="card-inner">
          <div class="decoration"></div>
          
          <div class="card-content">
            <div class="card-header">
              <div class="icon-wrapper">
                <slot name="icon"></slot>
              </div>
              <div class="card-title-wrapper">
                <slot class="card-eyebrow" name="eyebrow"></slot>
                <slot class="card-title" name="title"></slot>
              </div>
            </div>

            <div class="card-description">
              <slot name="description"></slot>
            </div>

            <div class="card-actions">
              <slot name="actions"></slot>
              <slot name="action-info"></slot>
            </div>
          </div>
        </div>
      </div>
    `;
    }
  };
  if (!customElements.get("ui-card")) {
    customElements.define("ui-card", Card);
  }

  // src/components/ClickableCard.js
  var ClickableCard = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this._render();
      this._setupEventListeners();
    }
    static get observedAttributes() {
      return ["data-color", "data-width"];
    }
    attributeChangedCallback() {
      if (this.shadowRoot.innerHTML) {
        this._updateStyles();
      }
    }
    _getColorClasses() {
      const color = this.getAttribute("data-color") || "blue";
      const colorMap = {
        blue: {
          border: "#93c5fd",
          bg: "rgba(219, 234, 254, 0.3)",
          iconBg: "#dbeafe",
          iconBgHover: "#bfdbfe",
          iconColor: "#2563eb",
          textColor: "#2563eb",
          textColorHover: "#1d4ed8",
          decorBg: "#dbeafe"
        },
        green: {
          border: "#86efac",
          bg: "rgba(220, 252, 231, 0.3)",
          iconBg: "#dcfce7",
          iconBgHover: "#bbf7d0",
          iconColor: "#16a34a",
          textColor: "#16a34a",
          textColorHover: "#15803d",
          decorBg: "#dcfce7"
        },
        purple: {
          border: "#c4b5fd",
          bg: "rgba(237, 233, 254, 0.3)",
          iconBg: "#ede9fe",
          iconBgHover: "#ddd6fe",
          iconColor: "#7c3aed",
          textColor: "#7c3aed",
          textColorHover: "#6d28d9",
          decorBg: "#ede9fe"
        },
        red: {
          border: "#fca5a5",
          bg: "rgba(254, 226, 226, 0.3)",
          iconBg: "#fee2e2",
          iconBgHover: "#fecaca",
          iconColor: "#dc2626",
          textColor: "#dc2626",
          textColorHover: "#b91c1c",
          decorBg: "#fee2e2"
        }
      };
      return colorMap[color] || colorMap.blue;
    }
    _updateStyles() {
      const colors = this._getColorClasses();
      const width = this.getAttribute("data-width") || "full";
      const widthStyles = {
        full: "width: 100%;",
        auto: "width: auto;",
        fixed: "width: 300px;"
      };
      const root = this.shadowRoot.querySelector(".card-container");
      if (root) {
        root.style.cssText = widthStyles[width] || widthStyles.full;
      }
      if (this.shadowRoot.styleSheets[0]) {
        const sheet = this.shadowRoot.styleSheets[0];
        const rule = sheet.cssRules[0];
        if (rule && rule.style) {
          rule.style.setProperty("--card-border", colors.border);
          rule.style.setProperty("--card-bg-hover", colors.bg);
          rule.style.setProperty("--icon-bg", colors.iconBg);
          rule.style.setProperty("--icon-bg-hover", colors.iconBgHover);
          rule.style.setProperty("--icon-color", colors.iconColor);
          rule.style.setProperty("--text-color", colors.textColor);
          rule.style.setProperty("--text-color-hover", colors.textColorHover);
          rule.style.setProperty("--decor-bg", colors.decorBg);
        }
      }
    }
    _render() {
      const colors = this._getColorClasses();
      const width = this.getAttribute("data-width") || "full";
      const widthStyles = {
        full: "width: 100%;",
        auto: "width: auto; min-width: 280px;",
        fixed: "width: 300px;"
      };
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          --card-border: ${colors.border};
          --card-bg-hover: ${colors.bg};
          --icon-bg: ${colors.iconBg};
          --icon-bg-hover: ${colors.iconBgHover};
          --icon-color: ${colors.iconColor};
          --text-color: ${colors.textColor};
          --text-color-hover: ${colors.textColorHover};
          --decor-bg: ${colors.decorBg};
          display: block;
        }

        .card-container {
          ${widthStyles[width] || widthStyles.full}
          cursor: pointer;
          user-select: none;
        }

        @media (min-width: 1024px) {
          .card-container {
            flex: 1;
          }
        }

        .card-inner {
          height: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          background-color: white;
          position: relative;
          overflow: hidden;
          transition: all 300ms;
        }

        @media (min-width: 640px) {
          .card-inner {
            padding: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .card-inner {
            padding: 2rem;
          }
        }

        .card-container:hover .card-inner {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: var(--card-border);
          background-color: var(--card-bg-hover);
        }

        .decoration {
          position: absolute;
          top: 0;
          right: 0;
          width: 5rem;
          height: 5rem;
          background-color: var(--decor-bg);
          border-radius: 9999px;
          transform: translateY(-2.5rem) translateX(2.5rem);
          opacity: 0.5;
          transition: opacity 300ms;
        }

        .card-container:hover .decoration {
          opacity: 0.75;
        }

        .card-content {
          position: relative;
          z-index: 10;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .icon-wrapper {
          width: 2.5rem;
          height: 2.5rem;
          background-color: var(--icon-bg);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 300ms;
        }

        @media (min-width: 640px) {
          .icon-wrapper {
            width: 3rem;
            height: 3rem;
          }
        }

        .card-container:hover .icon-wrapper {
          background-color: var(--icon-bg-hover);
        }

        ::slotted([slot="icon"]) {
          width: 1.25rem;
          height: 1.25rem;
          color: var(--icon-color);
        }

        @media (min-width: 640px) {
          ::slotted([slot="icon"]) {
            width: 1.5rem;
            height: 1.5rem;
          }
        }

        .arrow-wrapper {
          color: var(--text-color);
          transition: color 300ms;
        }

        .card-container:hover .arrow-wrapper {
          color: var(--text-color-hover);
        }

        ::slotted([slot="arrow"]) {
          width: 1.25rem;
          height: 1.25rem;
        }

        .card-title {
          margin-bottom: 0.75rem;
        }

        ::slotted([slot="title"]) {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
          line-height: 1.4;
        }

        @media (min-width: 640px) {
          ::slotted([slot="title"]) {
            font-size: 1.25rem;
          }
        }

        @media (min-width: 768px) {
          ::slotted([slot="title"]) {
            font-size: 1.5rem;
          }
        }

        .card-description {
          margin-bottom: 1.5rem;
          min-height: 3rem;
        }

        ::slotted([slot="description"]) {
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0;
        }

        @media (min-width: 640px) {
          ::slotted([slot="description"]) {
            font-size: 1rem;
          }
        }

        .card-action {
          display: flex;
          align-items: center;
        }

        ::slotted([slot="action"]) {
          color: var(--text-color);
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 300ms;
          margin: 0;
        }

        @media (min-width: 640px) {
          ::slotted([slot="action"]) {
            font-size: 1rem;
          }
        }

        .card-container:hover ::slotted([slot="action"]) {
          color: var(--text-color-hover);
        }

        .action-arrow {
          width: 1rem;
          height: 1rem;
          transition: transform 300ms;
        }

        .card-container:hover .action-arrow {
          transform: translateX(0.25rem);
        }
      </style>

      <div class="card-container">
        <div class="card-inner">
          <div class="decoration"></div>
          
          <div class="card-content">
            <div class="card-header">
              <div class="icon-wrapper">
                <slot name="icon"></slot>
              </div>
              <div class="arrow-wrapper">
                <slot name="arrow"></slot>
              </div>
            </div>

            <div class="card-title">
              <slot name="title"></slot>
            </div>

            <div class="card-description">
              <slot name="description"></slot>
            </div>

            <div class="card-action">
              <slot name="action"></slot>
              <svg class="action-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    _setupEventListeners() {
      const container = this.shadowRoot.querySelector(".card-container");
      container.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("card-click", {
          bubbles: true,
          composed: true
        }));
      });
    }
  };
  if (!customElements.get("clickable-card")) {
    customElements.define("clickable-card", ClickableCard);
  }

  // src/components/Divider.js
  var Divider = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this._render();
    }
    static get observedAttributes() {
      return ["data-color"];
    }
    attributeChangedCallback() {
      if (this.shadowRoot.innerHTML) {
        this._updateStyles();
      }
    }
    _getColor() {
      const color = this.getAttribute("data-color") || "gray-400";
      const colorMap = {
        "gray-300": "#d1d5db",
        "gray-400": "#9ca3af",
        "gray-500": "#6b7280",
        "gray-600": "#4b5563",
        "blue-400": "#60a5fa",
        "purple-400": "#c084fc"
      };
      return colorMap[color] || colorMap["gray-400"];
    }
    _updateStyles() {
      const color = this._getColor();
      if (this.shadowRoot.styleSheets[0]) {
        const sheet = this.shadowRoot.styleSheets[0];
        const rule = sheet.cssRules[0];
        if (rule && rule.style) {
          rule.style.setProperty("--divider-color", color);
        }
      }
    }
    _render() {
      const color = this._getColor();
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          --divider-color: ${color};
          display: block;
          width: 100%;
        }

        .divider-container {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 1rem;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background-color: var(--divider-color);
        }

        .divider-text {
          color: var(--divider-color);
          font-size: 0.875rem;
          font-weight: 400;
          white-space: nowrap;
          user-select: none;
        }
      </style>

      <div class="divider-container">
        <div class="divider-line"></div>
        <span class="divider-text">
          <slot></slot>
        </span>
        <div class="divider-line"></div>
      </div>
    `;
    }
  };
  if (!customElements.get("ui-divider")) {
    customElements.define("ui-divider", Divider);
  }

  // src/components/ErrorMessage.js
  var ErrorMessage = class extends HTMLElement {
    constructor() {
      super();
      this._message = "";
      this._solution = "";
      this._severity = "error";
      this._autoDismissTimeout = null;
    }
    static get observedAttributes() {
      return ["data-severity"];
    }
    connectedCallback() {
      this._severity = this.getAttribute("data-severity") || "error";
      this._render();
      this._attachEventListeners();
    }
    disconnectedCallback() {
      if (this._autoDismissTimeout) {
        clearTimeout(this._autoDismissTimeout);
      }
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "data-severity" && oldValue !== newValue) {
        this._severity = newValue;
        this._updateSeverityStyles();
      }
    }
    _render() {
      this.className = "error-message-container hidden";
      this.setAttribute("role", "alert");
      this.setAttribute("aria-live", "polite");
      this.setAttribute("aria-atomic", "true");
      this.innerHTML = `
      <div class="error-message-content rounded-lg p-4 shadow-lg border transition-all duration-300 transform">
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0 error-icon">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="error-message-text text-sm font-medium"></p>
            <p class="error-solution-text text-sm mt-1 hidden"></p>
          </div>

          <!-- Close Button -->
          <button type="button" class="error-close-btn flex-shrink-0 rounded-lg p-1.5 inline-flex items-center justify-center hover:bg-opacity-20 focus:outline-none focus:ring-2 transition-colors"
                  aria-label="Dismiss error message">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    `;
      this._updateSeverityStyles();
    }
    _updateSeverityStyles() {
      const content = this.querySelector(".error-message-content");
      const icon = this.querySelector(".error-icon");
      const messageText = this.querySelector(".error-message-text");
      const solutionText = this.querySelector(".error-solution-text");
      const closeBtn = this.querySelector(".error-close-btn");
      if (!content)
        return;
      content.classList.remove("bg-red-50", "bg-yellow-50", "bg-blue-50", "border-red-200", "border-yellow-200", "border-blue-200");
      icon?.classList.remove("text-red-400", "text-yellow-400", "text-blue-400");
      messageText?.classList.remove("text-red-800", "text-yellow-800", "text-blue-800");
      solutionText?.classList.remove("text-red-700", "text-yellow-700", "text-blue-700");
      closeBtn?.classList.remove("text-red-500", "text-yellow-500", "text-blue-500", "hover:bg-red-200", "hover:bg-yellow-200", "hover:bg-blue-200", "focus:ring-red-400", "focus:ring-yellow-400", "focus:ring-blue-400");
      switch (this._severity) {
        case "error":
          content.classList.add("bg-red-50", "border-red-200");
          icon?.classList.add("text-red-400");
          messageText?.classList.add("text-red-800");
          solutionText?.classList.add("text-red-700");
          closeBtn?.classList.add("text-red-500", "hover:bg-red-200", "focus:ring-red-400");
          break;
        case "warning":
          content.classList.add("bg-yellow-50", "border-yellow-200");
          icon?.classList.add("text-yellow-400");
          messageText?.classList.add("text-yellow-800");
          solutionText?.classList.add("text-yellow-700");
          closeBtn?.classList.add("text-yellow-500", "hover:bg-yellow-200", "focus:ring-yellow-400");
          break;
        case "info":
          content.classList.add("bg-blue-50", "border-blue-200");
          icon?.classList.add("text-blue-400");
          messageText?.classList.add("text-blue-800");
          solutionText?.classList.add("text-blue-700");
          closeBtn?.classList.add("text-blue-500", "hover:bg-blue-200", "focus:ring-blue-400");
          break;
      }
    }
    _attachEventListeners() {
      const closeBtn = this.querySelector(".error-close-btn");
      closeBtn?.addEventListener("click", () => this.hide());
    }
    show(message, solution = "", autoDismiss = 0) {
      this._message = message;
      this._solution = solution;
      const messageText = this.querySelector(".error-message-text");
      const solutionText = this.querySelector(".error-solution-text");
      if (messageText)
        messageText.textContent = message;
      if (solutionText) {
        if (solution) {
          solutionText.textContent = solution;
          solutionText.classList.remove("hidden");
        } else {
          solutionText.classList.add("hidden");
        }
      }
      this.classList.remove("hidden");
      requestAnimationFrame(() => {
        this.classList.add("visible");
      });
      if (autoDismiss > 0) {
        if (this._autoDismissTimeout) {
          clearTimeout(this._autoDismissTimeout);
        }
        this._autoDismissTimeout = setTimeout(() => this.hide(), autoDismiss);
      }
      this.dispatchEvent(new CustomEvent("error-shown", {
        detail: { message, solution },
        bubbles: true
      }));
    }
    hide() {
      if (this._autoDismissTimeout) {
        clearTimeout(this._autoDismissTimeout);
        this._autoDismissTimeout = null;
      }
      this.classList.remove("visible");
      setTimeout(() => {
        this.classList.add("hidden");
        this._message = "";
        this._solution = "";
        this.dispatchEvent(new CustomEvent("error-hidden", {
          bubbles: true
        }));
      }, 300);
    }
    get isVisible() {
      return this.classList.contains("visible");
    }
    get message() {
      return this._message;
    }
    set severity(value) {
      this._severity = value;
      this.setAttribute("data-severity", value);
    }
    get severity() {
      return this._severity;
    }
  };
  customElements.define("error-message", ErrorMessage);

  // src/components/InfoBanner.js
  var InfoBanner = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    static get observedAttributes() {
      return ["color", "icon-type", "has-border"];
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      if (this.shadowRoot.innerHTML) {
        this.render();
      }
    }
    getColorClasses() {
      const color = this.getAttribute("color") || "green";
      const colorMap = {
        green: {
          bg: "bg-green-50",
          border: "border-green-200",
          iconText: "text-green-600",
          textDark: "text-green-800",
          cssVar: "--banner-color: #166534"
        },
        blue: {
          bg: "bg-blue-50",
          border: "border-blue-200",
          iconText: "text-blue-600",
          textDark: "text-blue-800",
          cssVar: "--banner-color: #1e40af"
        },
        yellow: {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          iconText: "text-yellow-600",
          textDark: "text-yellow-800",
          cssVar: "--banner-color: #854d0e"
        },
        red: {
          bg: "bg-red-50",
          border: "border-red-200",
          iconText: "text-red-600",
          textDark: "text-red-800",
          cssVar: "--banner-color: #991b1b"
        },
        gray: {
          bg: "bg-gray-50",
          border: "border-gray-200",
          iconText: "text-gray-600",
          textDark: "text-gray-800",
          cssVar: "--banner-color: #1f2937"
        }
      };
      return colorMap[color] || colorMap.green;
    }
    getIconSvg() {
      const iconType = this.getAttribute("icon-type") || "checkmark";
      const iconMap = {
        checkmark: `
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      `,
        info: `
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      `,
        warning: `
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      `,
        lock: `
        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
      `,
        shield: `
        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      `
      };
      return iconMap[iconType] || iconMap.checkmark;
    }
    render() {
      const colors = this.getColorClasses();
      const iconSvg = this.getIconSvg();
      const hasBorder = this.hasAttribute("has-border");
      this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }

        .banner {
          border-radius: 0.5rem;
          padding: 0.75rem;
          width: 100%;
        }

        .banner.has-border {
          border-width: 1px;
          border-style: solid;
        }

        .banner-content {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .content-wrapper {
          flex: 1;
          min-width: 0;
        }

        .text {
          font-size: 0.75rem;
          line-height: 1.5;
        }

        .action-slot {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        ::slotted([slot="action"]) {
          font-size: 0.75rem !important;
          font-weight: 400 !important;
          color: var(--banner-color) !important;
        }

        ::slotted(ui-button[slot="action"]) {
          color: var(--banner-color) !important;
        }

        ::slotted(ui-modal[slot="action"]) {
          color: var(--banner-color) !important;
        }

        @media (min-width: 640px) {
          ::slotted([slot="action"]) {
            font-size: 0.875rem !important;
          }
        }

        /* Color classes */
        .bg-green-50 { background-color: #f0fdf4; }
        .border-green-200 { border-color: #bbf7d0; }
        .text-green-600 { color: #16a34a; }
        .text-green-800 { color: #166534; }

        .bg-blue-50 { background-color: #eff6ff; }
        .border-blue-200 { border-color: #bfdbfe; }
        .text-blue-600 { color: #2563eb; }
        .text-blue-800 { color: #1e40af; }

        .bg-yellow-50 { background-color: #fefce8; }
        .border-yellow-200 { border-color: #fde68a; }
        .text-yellow-600 { color: #ca8a04; }
        .text-yellow-800 { color: #854d0e; }

        .bg-red-50 { background-color: #fef2f2; }
        .border-red-200 { border-color: #fecaca; }
        .text-red-600 { color: #dc2626; }
        .text-red-800 { color: #991b1b; }

        .bg-gray-50 { background-color: #f9fafb; }
        .border-gray-200 { border-color: #e5e7eb; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-800 { color: #1f2937; }

        ::slotted(*) {
          margin: 0;
        }

        @media (min-width: 640px) {
          .banner {
            padding: 1rem;
          }
          
          .banner-content {
            gap: 0.75rem;
          }

          .text {
            font-size: 0.875rem;
          }
        }
      </style>

      <div class="banner ${colors.bg} ${hasBorder ? `has-border ${colors.border}` : ""}" style="${colors.cssVar}">
        <div class="banner-content">
          <svg class="icon ${colors.iconText}" fill="currentColor" viewBox="0 0 20 20">
            ${iconSvg}
          </svg>
          <div class="content-wrapper">
            <div class="text ${colors.textDark}">
              <slot></slot>
            </div>
            <div class="action-slot">
              <slot name="action"></slot>
            </div>
          </div>
        </div>
      </div>
    `;
      setTimeout(() => {
        const color = this.getAttribute("color") || "green";
        const colorMap = {
          green: "green",
          blue: "blue",
          yellow: "yellow",
          red: "red",
          gray: "grey"
        };
        const actionSlot = this.shadowRoot.querySelector('slot[name="action"]');
        if (actionSlot) {
          const assignedElements = actionSlot.assignedElements();
          assignedElements.forEach((el) => {
            if (el.tagName === "UI-BUTTON") {
              el.setAttribute("data-color", colorMap[color]);
              if (typeof el.applyStyles === "function") {
                el.applyStyles();
              } else if (typeof el.updateStyle === "function") {
                el.updateStyle();
              }
            } else if (el.tagName === "UI-MODAL") {
              const button = el.querySelector('[slot="trigger"]');
              if (button && button.tagName === "UI-BUTTON") {
                button.setAttribute("data-color", colorMap[color]);
                if (typeof button.applyStyles === "function") {
                  button.applyStyles();
                } else if (typeof button.updateStyle === "function") {
                  button.updateStyle();
                }
              }
            }
          });
        }
      }, 0);
    }
  };
  customElements.define("info-banner", InfoBanner);

  // src/components/LoadingOverlay.js
  var LoadingOverlay = class {
    constructor() {
      this.overlay = null;
      this.isVisible = false;
      this.init();
    }
    init() {
      this.overlay = document.createElement("div");
      this.overlay.id = "loadingOverlay";
      this.overlay.className = "loading-overlay";
      this.overlay.innerHTML = `
      <style>
        .loading-overlay {
          display: flex;
          position: fixed;
          inset: 0;
          z-index: 99999;
          background-color: rgba(0, 0, 0, 0);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms ease-out, background-color 200ms ease-out;
        }

        .loading-overlay.show {
          opacity: 1;
          pointer-events: auto;
          background-color: rgba(0, 0, 0, 0.3);
        }

        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: #005B96;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .spinner-text {
          color: white;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
      </style>

      <div class="spinner-container">
        <div class="spinner"></div>
        <div class="spinner-text">Loading...</div>
      </div>
    `;
      document.body.appendChild(this.overlay);
    }
    show(message = "Loading...") {
      if (!this.overlay) {
        this.init();
      }
      if (message) {
        const spinnerText = this.overlay.querySelector(".spinner-text");
        if (spinnerText) {
          spinnerText.textContent = message;
        }
      }
      this.overlay.classList.add("show");
      this.isVisible = true;
      document.body.style.overflow = "hidden";
    }
    hide() {
      if (!this.overlay)
        return;
      this.overlay.classList.remove("show");
      this.isVisible = false;
      document.body.style.overflow = "";
    }
    reset() {
      if (!this.overlay)
        return;
      this.overlay.style.transition = "none";
      this.overlay.classList.remove("show");
      this.isVisible = false;
      setTimeout(() => {
        if (this.overlay) {
          this.overlay.style.transition = "opacity 200ms ease-out, background-color 200ms ease-out";
        }
      }, 0);
      document.body.style.overflow = "";
    }
    destroy() {
      if (this.overlay) {
        this.overlay.remove();
        this.overlay = null;
      }
      document.body.style.overflow = "";
    }
  };
  var loadingOverlay = new LoadingOverlay();
  var LoadingOverlay_default = loadingOverlay;

  // src/views/Home/home.js
  function initHomeView() {
    document.getElementById("getStartedButton")?.addEventListener("click", (e) => {
      e.preventDefault();
      navigate("/upload");
    });
  }

  // src/views/Home/home.html
  var home_default = `<div id="pageLayout"></div>

<section class="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 -mt-2">
  <div class="max-w-7xl mx-auto px-6 py-20 md:py-28">
    <div class="text-center max-w-4xl mx-auto">
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Migrate from YNAB to Monarch
        <span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
          Safely & Privately
        </span>
      </h1>
      <p class="text-xl text-gray-600 mb-4 leading-relaxed max-w-3xl mx-auto">
        Your data never leaves your browser. We don't store, sell, or even see your financial information.
        100% read-only access ensures complete peace of mind during migration.
      </p>
      <p class="text-base text-blue-600 mb-10 flex items-center justify-center gap-2">
        <span class="inline-flex h-5 w-5 items-center justify-center text-blue-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
        </span>
        <span>Zero server storage \u2022 Zero data collection \u2022 Zero risk</span>
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <ui-button id="getStartedButton" data-size="large">Start Migration</ui-button>
        <a href="#how-it-works" class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-8 py-3 text-lg text-gray-700 hover:bg-gray-50">Learn How It Works</a>
      </div>
    </div>
  </div>

  <section class="max-w-7xl mx-auto px-6 py-16 mb-12">
    <div class="bg-white rounded-2xl shadow-xl p-10 border border-blue-100">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Privacy Is Our Promise</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Built with privacy-first architecture. Every decision we make prioritizes your data security.
        </p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-md text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <circle cx="12" cy="12" r="10" />
              <path d="m4.9 4.9 14.2 14.2" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Data Stored</h3>
          <p class="text-sm text-gray-600">Everything runs in your browser. We have no servers storing your financial data.</p>
        </div>
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4 shadow-md text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Data Sold</h3>
          <p class="text-sm text-gray-600">We don't collect your data, so there's nothing to sell. Ever.</p>
        </div>
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-md text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Read-Only Access</h3>
          <p class="text-sm text-gray-600">We can only read your YNAB data\u2014never modify, delete, or write to it.</p>
        </div>
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
          <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4 shadow-md text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <path d="M14 2H6a2 2 0 0 0-2 2v16" />
              <path d="M20 8V4a2 2 0 0 0-2-2h-2" />
              <path d="M20 8H8a2 2 0 0 0-2 2v12" />
              <path d="M12 18h8" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Open-Source & Auditable</h3>
          <p class="text-sm text-gray-600">Our code is public on GitHub. Verify our security claims yourself.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-6 py-16">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <div class="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">The Problem</div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Switching Budgeting Apps Shouldn't Be Painful</h2>
        <div class="space-y-4 text-gray-600">
          <p class="text-lg">You've spent months or years building your budget in YNAB. Categories, transactions, payees\u2014all that valuable history.</p>
          <p class="text-lg">Moving to Monarch Money means starting over... unless you deal with messy CSV exports, manual formatting, and data loss.</p>
          <p class="text-lg">Most tools require uploading your sensitive financial data to unknown servers. That's a privacy nightmare.</p>
        </div>
      </div>
      <div>
        <div class="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">The Solution</div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Migrate Safely in Minutes</h2>
        <div class="space-y-4 text-gray-600">
          <p class="text-lg">Our tool connects directly to YNAB's API with read-only permissions, pulls your data, and transforms it into Monarch-ready format.</p>
          <p class="text-lg">Everything happens in your browser. No servers. No uploads. No third-party access to your financial information.</p>
          <p class="text-lg">In just a few clicks, you'll have all your YNAB history ready to import into Monarch Money, maintaining complete privacy throughout.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="how-it-works" class="max-w-7xl mx-auto px-6 py-20 mb-12">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">Three simple steps to complete your migration safely and quickly</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow h-full">
        <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-md">1</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Connect YNAB</h3>
        <p class="text-gray-600 leading-relaxed">Securely connect to your YNAB account with read-only API access. You maintain full control\u2014we can only view, never modify.</p>
      </div>
      <div class="bg-white rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow h-full">
        <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-md">2</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Review & Select Data</h3>
        <p class="text-gray-600 leading-relaxed">Choose which budgets, accounts, and date ranges to migrate. Preview your data before export\u2014full transparency every step.</p>
      </div>
      <div class="bg-white rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow h-full">
        <div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-md">3</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Export to Monarch</h3>
        <p class="text-gray-600 leading-relaxed">Download formatted files or use our automatic import feature. Your data flows from YNAB to Monarch without touching our servers.</p>
      </div>
    </div>
  </section>

  <section class="max-w-4xl mx-auto px-6 py-16">
    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-10 text-white shadow-2xl">
      <div class="flex items-start gap-4 mb-6">
        <div class="w-12 h-12 flex-shrink-0 mt-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-white">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl md:text-3xl font-bold mb-4">Complete Transparency & Control</h2>
          <p class="text-lg text-blue-100 leading-relaxed mb-4">We've built this tool with one core principle: your data is yours alone. Our client-side architecture means your financial information never reaches any server\u2014ours or anyone else's.</p>
          <p class="text-lg text-blue-100 leading-relaxed mb-4">Clear your browser data anytime to instantly remove all local information. Review our open-source code to verify every security claim we make.</p>
          <p class="text-lg text-blue-100 leading-relaxed">We believe transparency builds trust. That's why we've made every line of code publicly auditable, and why we'll never ask you to compromise your privacy for convenience.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-4xl mx-auto px-6 py-16">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
    <div class="space-y-6">
      <div class="bg-white rounded-xl p-8 shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Is my YNAB data really safe?</h3>
        <p class="text-gray-600 leading-relaxed">Absolutely. Your YNAB data is processed entirely in your browser using read-only API access. We have no servers to store your data, and we never see your transactions, account balances, or personal information. You can disconnect access at any time through YNAB's developer settings.</p>
      </div>
      <div class="bg-white rounded-xl p-8 shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-900 mb-3">What data gets migrated?</h3>
        <p class="text-gray-600 leading-relaxed">We migrate your budgets, accounts, categories, payees, and transaction history. You have full control over what data to include\u2014select specific accounts, date ranges, or budgets. The tool shows you exactly what will be exported before you confirm.</p>
      </div>
      <div class="bg-white rounded-xl p-8 shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Do I need to pay for this tool?</h3>
        <p class="text-gray-600 leading-relaxed">The migration tool is completely free to use. If you find it valuable and want to support ongoing development and maintenance, you can optionally buy us a coffee. No payment is required to access any features.</p>
      </div>
    </div>
  </section>
</section>`;

  // src/utils/logger.js
  var DEFAULT_CONFIG = {
    enabled: true,
    levels: {
      log: false,
      debug: false,
      warn: true,
      error: true,
      group: false,
      groupEnd: false
    },
    namespaces: {},
    methods: {}
  };
  function getConfig() {
    const g = globalThis;
    if (!g.__LOG_CFG) {
      g.__LOG_CFG = { ...DEFAULT_CONFIG };
    }
    return g.__LOG_CFG;
  }
  function setLoggerConfig(partial) {
    const current = getConfig();
    globalThis.__LOG_CFG = {
      ...current,
      ...partial,
      levels: { ...current.levels, ...partial?.levels || {} },
      namespaces: { ...current.namespaces, ...partial?.namespaces || {} },
      methods: { ...current.methods, ...partial?.methods || {} }
    };
  }
  function asBool(v) {
    if (v === true || v === false)
      return v;
    if (typeof v === "number")
      return v !== 0;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      if (s === "false" || s === "0" || s === "off" || s === "no")
        return false;
      if (s === "true" || s === "1" || s === "on" || s === "yes")
        return true;
      return Boolean(s);
    }
    return Boolean(v);
  }
  function isEnabled(level, ns, methodName) {
    const cfg = getConfig();
    if (!cfg.enabled)
      return false;
    const lvl = asBool(cfg.levels[level]);
    if (!lvl)
      return false;
    const methodKey = methodName ? `${ns}.${methodName}` : ns;
    if (Object.prototype.hasOwnProperty.call(cfg.methods, methodKey)) {
      return asBool(cfg.methods[methodKey]);
    }
    if (Object.prototype.hasOwnProperty.call(cfg.namespaces, ns)) {
      return asBool(cfg.namespaces[ns]);
    }
    if (Object.prototype.hasOwnProperty.call(cfg.namespaces, "*")) {
      return asBool(cfg.namespaces["*"]);
    }
    return true;
  }
  function getLogger(namespace) {
    const ns = String(namespace || "log");
    const buildPrefix = (m) => `[${ns}${m ? `.${m}` : ""}]`;
    return {
      group(methodName, ...args) {
        if (!isEnabled("group", ns, methodName))
          return;
        console.group(buildPrefix(methodName), ...args);
      },
      groupEnd(methodName) {
        const cfg = getConfig();
        if (!cfg.enabled)
          return;
        if (isEnabled("group", ns, methodName) || asBool(cfg.levels.groupEnd)) {
          console.groupEnd();
        }
      },
      log(methodName, ...args) {
        if (!isEnabled("log", ns, methodName))
          return;
        console.log(buildPrefix(methodName), ...args);
      },
      debug(methodName, ...args) {
        if (!isEnabled("debug", ns, methodName))
          return;
        console.debug(buildPrefix(methodName), ...args);
      },
      warn(methodName, ...args) {
        if (!isEnabled("warn", ns, methodName))
          return;
        console.warn(buildPrefix(methodName), ...args);
      },
      error(methodName, ...args) {
        if (!isEnabled("error", ns, methodName))
          return;
        console.error(buildPrefix(methodName), ...args);
      }
    };
  }
  var logger_default = getLogger;

  // src/utils/enumYnabAccountType.js
  var AccountType = Object.freeze({
    CHECKING: "checking",
    SAVINGS: "savings",
    CASH: "cash",
    CREDIT_CARD: "creditCard",
    LINE_OF_CREDIT: "lineOfCredit",
    OTHER_ASSET: "otherAsset",
    OTHER_LIABILITY: "otherLiability",
    MORTGAGE: "mortgage",
    AUTO_LOAN: "autoLoan",
    STUDENT_LOAN: "studentLoan",
    PERSONAL_LOAN: "personalLoan",
    MEDICAL_DEBT: "medicalDebt",
    OTHER_DEBT: "otherDebt"
  });
  var AccountTypeValues = Object.freeze(Object.values(AccountType));

  // src/utils/enumAccountMigrationStatus.js
  var AccountMigrationStatus = Object.freeze({
    UNPROCESSED: "unprocessed",
    IN_PROGRESS: "inProgress",
    COMPLETED: "completed",
    FAILED: "failed"
  });
  var AccountMigrationStatusValues = Object.freeze(Object.values(AccountMigrationStatus));

  // src/utils/currency.js
  var currencyLogger = logger_default("Currency");
  setLoggerConfig({ methods: { "Currency.parseCurrencyToCents": false } });
  function parseCurrencyToCents(str) {
    currencyLogger.group("parseCurrencyToCents", str);
    const sanitizedStr = str?.trim() || "";
    if (sanitizedStr.length === 0) {
      currencyLogger.error("parseCurrencyToCents", `Invalid currency string -- Empty input: "${str}"`);
      currencyLogger.groupEnd("parseCurrencyToCents");
      throw new Error(`Invalid currency string -- Empty input: "${str}"`);
    }
    const normalized = str.replace(/[^0-9.-]+/g, "").trim();
    const floatVal = parseFloat(normalized);
    if (isNaN(floatVal)) {
      currencyLogger.error("parseCurrencyToCents", `Invalid currency string -- Not a number: "${str}"`);
      currencyLogger.groupEnd("parseCurrencyToCents");
      throw new Error(`Invalid currency string -- Not a number: "${str}"`);
    }
    const cents = Math.round(floatVal * 100);
    currencyLogger.debug("parseCurrencyToCents", `parseCurrencyToCents: '${str}' -> '${cents}' cents`);
    currencyLogger.groupEnd("parseCurrencyToCents");
    return cents;
  }
  function centsToDollars(cents) {
    if (cents === null || cents === void 0) {
      return parseFloat(0 .toFixed(2));
    }
    if (typeof cents !== "number" || isNaN(cents)) {
      throw new Error(`Invalid cents value: ${cents}`);
    }
    return parseFloat((cents / 100).toFixed(2));
  }

  // src/utils/date.js
  var dateLogger = logger_default("Date");
  setLoggerConfig({ methods: { "Date.parseDate": false } });
  function parseDate(dateStr) {
    dateLogger.group("parseDate", dateStr);
    if (!dateStr) {
      dateLogger.groupEnd("parseDate");
      return null;
    }
    const trimmed = dateStr.trim();
    const mmddyyyyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mmddyyyyMatch) {
      const [, mm, dd, yyyy] = mmddyyyyMatch;
      const result = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
      dateLogger.debug("parseDate", `Date '${dateStr}' parsed as MM/DD/YYYY -> ${result}`);
      dateLogger.groupEnd("parseDate");
      return result;
    }
    dateLogger.debug("parseDate", `parseDate: unrecognized format -> ${trimmed}`);
    dateLogger.groupEnd("parseDate");
    return null;
  }

  // src/utils/idGenerator.js
  function generateId() {
    return "id-" + Math.random().toString(36).slice(2, 11);
  }

  // src/utils/enumTransactionClearedStatus.js
  var TransactionClearedStatus = Object.freeze({
    CLEARED: "cleared",
    UNCLEARED: "uncleared",
    RECONCILED: "reconciled"
  });
  var TransactionClearedStatusValues = Object.freeze(Object.values(TransactionClearedStatus));

  // src/utils/enumFlagColor.js
  var FlagColor = Object.freeze({
    RED: "red",
    ORANGE: "orange",
    YELLOW: "yellow",
    GREEN: "green",
    BLUE: "blue",
    PURPLE: "purple"
  });
  var FlagColorValues = Object.freeze(Object.values(FlagColor));

  // src/utils/enumTransactionType.js
  var TransactionType = Object.freeze({
    PAYMENT: "payment",
    REFUND: "refund",
    FEE: "fee",
    INTEREST: "interest",
    ESCROW: "escrow",
    BALANCE_ADJUSTMENT: "balanceAdjustment",
    CREDIT: "credit",
    CHARGE: "charge"
  });
  var TransactionTypeValues = Object.freeze(Object.values(TransactionType));

  // src/schemas/transaction.js
  var txnLogger = logger_default("Transaction");
  setLoggerConfig({
    namespaces: { Transaction: false },
    methods: {},
    levels: { debug: true, group: true, groupEnd: true }
  });
  var Transaction = class {
    constructor(id = null) {
      this.id = id || generateId();
      this._date = null;
      this._amountDollars = 0;
      this._memo = null;
      this._clearedStatus = TransactionClearedStatus.CLEARED;
      this._isApproved = true;
      this._flagColor = null;
      this._flagName = null;
      this._accountId = null;
      this._payeeId = null;
      this._categoryId = null;
      this._transferAccountId = null;
      this._transferTransactionId = null;
      this._debtTransactionType = null;
      this._subtransactionIds = [];
    }
    get date() {
      return this._date;
    }
    set date(date) {
      const methodName = "setDate";
      txnLogger.group(methodName);
      const formattedDate = parseDate(date);
      if (!formattedDate) {
        txnLogger.error(methodName, "Attempted to set invalid date for transaction ID:", this.id, "Input date:", date);
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting date to '${formattedDate}'`);
      this._date = formattedDate;
      txnLogger.groupEnd(methodName);
    }
    get amount() {
      return this._amountDollars;
    }
    set amount(amountDollars) {
      const methodName = "setAmount";
      txnLogger.group(methodName);
      if (typeof amountDollars !== "number" || isNaN(amountDollars)) {
        txnLogger.error(methodName, "Attempted to set invalid amount for transaction ID:", this.id, "Amount:", amountDollars);
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting amount to '${amountDollars}'`);
      this._amountDollars = amountDollars;
      txnLogger.groupEnd(methodName);
    }
    get memo() {
      return this._memo;
    }
    set memo(memo) {
      const methodName = "setMemo";
      txnLogger.group(methodName);
      const sanitizedMemo = memo?.trim() || null;
      if (!sanitizedMemo || sanitizedMemo.length === 0) {
        txnLogger.debug(methodName, "Setting empty memo for transaction ID:", this.id);
        this._memo = null;
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting memo to '${sanitizedMemo}'`);
      this._memo = sanitizedMemo;
      txnLogger.groupEnd(methodName);
    }
    get clearedStatus() {
      return this._clearedStatus;
    }
    set clearedStatus(status) {
      const methodName = "setClearedStatus";
      txnLogger.group(methodName);
      const standardizedStatus = status.trim().toLowerCase();
      if (!TransactionClearedStatusValues.includes(standardizedStatus)) {
        txnLogger.warn(methodName, `Attempted to set invalid status for transaction ID: '${this.id}', Status: '${standardizedStatus}'. Valid values are: ${TransactionClearedStatusValues.join(", ")}`);
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting status to '${standardizedStatus}'`);
      this._clearedStatus = standardizedStatus;
      txnLogger.groupEnd(methodName);
    }
    get isApproved() {
      return this._isApproved;
    }
    set isApproved(isApproved) {
      const methodName = "setIsApproved";
      txnLogger.group(methodName);
      if (typeof isApproved !== "boolean") {
        txnLogger.error(methodName, "Attempted to set invalid isApproved value for transaction ID:", this.id, "Value:", isApproved);
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting isApproved to '${isApproved}'`);
      this._isApproved = isApproved;
      txnLogger.groupEnd(methodName);
    }
    get flagColor() {
      return this._flagColor;
    }
    set flagColor(color) {
      const methodName = "setFlagColor";
      txnLogger.group(methodName);
      const standardizedColor = color?.trim().toLowerCase() || null;
      if (!standardizedColor) {
        txnLogger.debug(methodName, "Setting empty flag color for transaction ID:", this.id);
        this._flagColor = null;
        txnLogger.groupEnd(methodName);
        return;
      }
      if (!FlagColorValues.includes(standardizedColor)) {
        txnLogger.warn(methodName, `Attempted to set invalid flag color for transaction ID: '${this.id}', Color: '${standardizedColor}'. Valid values are: ${FlagColorValues.join(", ")}`);
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting flag color to '${standardizedColor}'`);
      this._flagColor = standardizedColor;
      txnLogger.groupEnd(methodName);
    }
    get flagName() {
      return this._flagName;
    }
    set flagName(flagName) {
      const methodName = "setFlagName";
      txnLogger.group(methodName);
      const sanitizedFlagName = flagName?.trim() || null;
      if (!sanitizedFlagName || sanitizedFlagName.length === 0) {
        txnLogger.debug(methodName, "Setting empty flag name for transaction ID:", this.id);
        this._flagName = null;
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting flag name to '${sanitizedFlagName}'`);
      this._flagName = sanitizedFlagName;
      txnLogger.groupEnd(methodName);
    }
    get accountId() {
      return this._accountId;
    }
    set accountId(accountId) {
      const methodName = "setAccountId";
      txnLogger.group(methodName);
      if (!accountId || accountId.trim().length === 0) {
        txnLogger.warn(methodName, "Attempted to set empty account ID for transaction ID:", this.id);
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting account ID to '${accountId}'`);
      this._accountId = accountId;
      txnLogger.groupEnd(methodName);
    }
    get payeeId() {
      return this._payeeId;
    }
    set payeeId(payeeId) {
      const methodName = "setPayeeId";
      txnLogger.group(methodName);
      if (!payeeId || payeeId.trim().length === 0) {
        txnLogger.warn(methodName, "Attempted to set empty payee ID for transaction ID:", this.id);
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting payee ID to '${payeeId}'`);
      this._payeeId = payeeId;
      txnLogger.groupEnd(methodName);
    }
    get categoryId() {
      return this._categoryId;
    }
    set categoryId(categoryId) {
      const methodName = "setCategoryId";
      txnLogger.group(methodName);
      if (!categoryId || categoryId.trim().length === 0) {
        txnLogger.warn(methodName, "Attempted to set empty category ID for transaction ID:", this.id);
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting category ID to '${categoryId}'`);
      this._categoryId = categoryId;
      txnLogger.groupEnd(methodName);
    }
    get transferAccountId() {
      return this._transferAccountId;
    }
    set transferAccountId(transferAccountId) {
      const methodName = "setTransferAccountId";
      txnLogger.group(methodName);
      txnLogger.debug(methodName, `Setting transfer account ID to '${transferAccountId}'`);
      this._transferAccountId = transferAccountId;
      txnLogger.groupEnd(methodName);
    }
    get transferTransactionId() {
      return this._transferTransactionId;
    }
    set transferTransactionId(transferTransactionId) {
      const methodName = "setTransferTransactionId";
      txnLogger.group(methodName);
      txnLogger.debug(methodName, `Setting transfer transaction ID to '${transferTransactionId}'`);
      this._transferTransactionId = transferTransactionId;
      txnLogger.groupEnd(methodName);
    }
    get debtTransactionType() {
      return this._debtTransactionType;
    }
    set debtTransactionType(type) {
      const methodName = "setDebtTransactionType";
      txnLogger.group(methodName);
      const standardizedType = type?.trim().toLowerCase() || null;
      if (!standardizedType) {
        txnLogger.debug(methodName, "Setting empty debt transaction type for transaction ID:", this.id);
        this._debtTransactionType = null;
        txnLogger.groupEnd(methodName);
        return;
      }
      if (!TransactionTypeValues.includes(standardizedType)) {
        txnLogger.warn(methodName, `Attempted to set invalid debt transaction type for transaction ID: '${this.id}', Type: '${standardizedType}'. Valid values are: ${TransactionTypeValues.join(", ")}`);
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting debt transaction type to '${standardizedType}'`);
      this._debtTransactionType = standardizedType;
      txnLogger.groupEnd(methodName);
    }
    get subtransactionIds() {
      return this._subtransactionIds;
    }
    set subtransactionIds(subtransactionIds) {
      const methodName = "setSubtransactionIds";
      txnLogger.group(methodName);
      if (!Array.isArray(subtransactionIds)) {
        txnLogger.error(methodName, "Attempted to set invalid subtransaction IDs for transaction ID:", this.id, "Value:", subtransactionIds);
        txnLogger.groupEnd(methodName);
        return;
      }
      txnLogger.debug(methodName, `Setting subtransaction IDs to '${subtransactionIds.join(", ")}'`);
      this._subtransactionIds = subtransactionIds;
      txnLogger.groupEnd(methodName);
    }
    init(data2) {
      txnLogger.group("init");
      this._setTransferAccount(data2["Payee"]);
      this.setDate(data2["Date"]);
      this.setPayee(data2["Payee"]);
      this.setFlagName(data2["Flag"]);
      this.setCategory(data2["Category"], data2["Category Group"]);
      this.setMemo(data2["Memo"]);
      this.setState(data2["Cleared"]);
      this.setAccountId(data2["Account"]);
      const txnInflowCents = parseCurrencyToCents(data2["Inflow"]);
      const txnOutflowCents = parseCurrencyToCents(data2["Outflow"]);
      const txnNetDollars = (txnInflowCents - txnOutflowCents) / 100;
      this.setAmount(txnNetDollars);
      txnLogger.groupEnd("init");
    }
    initFromApiData(data2) {
      this.date = data2["date"];
      this.amount = centsToDollars(data2["amount"]);
      this.memo = data2["memo"];
      this.clearedStatus = data2["cleared"];
      this.isApproved = data2["approved"];
      this.flagColor = data2["flag_color"];
      this.flagName = data2["flag_name"];
      this.accountId = data2["account_id"];
      this.payeeId = data2["payee_id"];
      this.categoryId = data2["category_id"];
      this.transferAccountId = data2["transfer_account_id"];
      this.transferTransactionId = data2["transfer_transaction_id"];
      this.matchedTransactionId = data2["matched_transaction_id"];
      this.importId = data2["import_id"];
      this.debtTransactionType = data2["debt_transaction_type"];
      this.subtransactionIds = data2["subtransactions"];
    }
    toObject() {
      return {
        id: this.id,
        date: this._date,
        amountDollars: this._amountDollars,
        memo: this._memo,
        clearedStatus: this._clearedStatus,
        isApproved: this._isApproved,
        flagColor: this._flagColor,
        flagName: this._flagName,
        accountId: this._accountId,
        payeeId: this._payeeId,
        categoryId: this._categoryId,
        transferAccountId: this._transferAccountId,
        transferTransactionId: this._transferTransactionId,
        debtTransactionType: this._debtTransactionType,
        subtransactionIds: this._subtransactionIds
      };
    }
  };

  // src/schemas/account.js
  var logger = logger_default("Account");
  setLoggerConfig({
    namespaces: { Account: true },
    methods: {},
    levels: { debug: true, group: true, groupEnd: true }
  });
  var Account = class {
    constructor(id) {
      this.id = id;
      this._ynabName = "";
      this._monarchName = "";
      this._balanceDollars = 0;
      this._clearedBalanceDollars = 0;
      this._unclearedBalanceDollars = 0;
      this._isDirectImportLinked = false;
      this._lastReconciledAt = null;
      this._ynabType = null;
      this._ynabOriginalType = null;
      this._monarchType = null;
      this._monarchOriginalType = null;
      this._monarchSubtype = null;
      this._monarchOriginalSubtype = null;
      this._transactions = /* @__PURE__ */ new Map();
      this._migrationStatus = AccountMigrationStatus.UNPROCESSED;
      this._isSelected = false;
      this._isUserApproved = false;
      this._isIncluded = true;
      this._isYnabClosed = false;
      this._isMonarchClosed = false;
      this._isDeleted = false;
      this._note = null;
      this._isModified = false;
      this._isOnBudget = true;
      this._transferPayeeId = null;
    }
    get ynabName() {
      return this._ynabName;
    }
    set ynabName(name) {
      const methodName = "set ynab name";
      logger.group(methodName);
      const sanitizedName = name.trim();
      if (sanitizedName.length === 0) {
        logger.error(methodName, "Attempted to set empty name for account ID:", this.id);
        logger.groupEnd(methodName);
        throw new Error("Account name cannot be empty.");
      }
      logger.debug(methodName, `Setting name to '${sanitizedName}'`);
      this._ynabName = sanitizedName;
      logger.groupEnd(methodName);
    }
    set monarchName(name) {
      const methodName = "set monarch name";
      logger.group(methodName);
      const sanitizedName = name.trim();
      if (sanitizedName.length === 0) {
        logger.error(methodName, "Attempted to set empty monarch name for account ID:", this.id);
        logger.groupEnd(methodName);
        throw new Error("Monarch account name cannot be empty.");
      }
      logger.debug(methodName, `Setting monarch name to '${sanitizedName}'`);
      this._monarchName = sanitizedName;
      logger.groupEnd(methodName);
    }
    get monarchName() {
      return this._monarchName;
    }
    get ynabType() {
      return this._ynabType ?? this._type ?? null;
    }
    set ynabType(type) {
      const methodName = "set ynab type";
      logger.group(methodName);
      if (!Object.values(AccountType).includes(type)) {
        logger.error(methodName, `Invalid type '${type}' for account ID: '${this.id}'`);
        logger.groupEnd(methodName);
        throw new Error(`Type must be one of: ${AccountTypeValues.join(", ")}`);
      }
      logger.debug(methodName, `Setting type to '${type}'`);
      this._ynabType = type;
      if (this._ynabOriginalType === null) {
        this._ynabOriginalType = type;
      }
      logger.groupEnd(methodName);
    }
    get ynabOriginalType() {
      return this._ynabOriginalType;
    }
    get monarchType() {
      return this._monarchType;
    }
    set monarchType(type) {
      const methodName = "set monarch type";
      logger.group(methodName);
      this._monarchType = type;
      if (this._monarchOriginalType === null) {
        this._monarchOriginalType = type;
      }
      logger.groupEnd(methodName);
    }
    get monarchOriginalType() {
      return this._monarchOriginalType;
    }
    get monarchSubtype() {
      return this._monarchSubtype;
    }
    set monarchSubtype(subtype) {
      const methodName = "set monarch subtype";
      logger.group(methodName);
      this._monarchSubtype = subtype;
      if (this._monarchOriginalSubtype === null) {
        this._monarchOriginalSubtype = subtype;
      }
      logger.groupEnd(methodName);
    }
    get monarchOriginalSubtype() {
      return this._monarchOriginalSubtype;
    }
    get categoryGroup() {
      return this._categoryGroup;
    }
    set categoryGroup(categoryGroup) {
      logger.group("set categoryGroup");
      if (!categoryGroup || categoryGroup.trim().length === 0) {
        logger.error("set categoryGroup", "Attempted to set empty categoryGroup for account ID:", this.id);
        logger.groupEnd("set categoryGroup");
        throw new Error("Category group cannot be empty.");
      }
      logger.debug("set categoryGroup", `Setting categoryGroup to '${categoryGroup}'`);
      this._categoryGroup = categoryGroup;
      logger.groupEnd("set categoryGroup");
    }
    get originalCategoryGroup() {
      return this._originalCategoryGroup;
    }
    get balance() {
      return this._balanceDollars;
    }
    set balance(amountDollars) {
      logger.group("set balance");
      if (typeof amountDollars !== "number" || isNaN(amountDollars)) {
        logger.error("set balance", `Attempted to set invalid balance for account ID: '${this.id}', Amount: '${amountDollars}'`);
        logger.groupEnd("set balance");
        throw new Error("Account balance must be a valid number.");
      }
      logger.debug("set balance", `Setting balance to '${amountDollars}'`);
      this._balanceDollars = amountDollars;
      logger.groupEnd("set balance");
    }
    addToBalance(amountDollars) {
      logger.group("addToBalance");
      if (typeof amountDollars !== "number" || isNaN(amountDollars)) {
        logger.error("addToBalance", `Attempted to add invalid amount to balance for account ID: '${this.id}', Amount: '${amountDollars}'`);
        logger.groupEnd("addToBalance");
        throw new Error("Amount to add to account balance must be a valid number.");
      }
      logger.debug("addToBalance", `Adding '${amountDollars}' to current balance '${this._balanceDollars}'`);
      this._balanceDollars += amountDollars;
      logger.debug("addToBalance", `New balance is '${this._balanceDollars}'`);
      logger.groupEnd("addToBalance");
    }
    set clearedBalance(amountDollars) {
      logger.group("set clearedBalance");
      if (typeof amountDollars !== "number" || isNaN(amountDollars)) {
        logger.error("set clearedBalance", `Attempted to set invalid cleared balance for account ID: '${this.id}', Amount: '${amountDollars}'`);
        logger.groupEnd("set clearedBalance");
        throw new Error("Account cleared balance must be a valid number.");
      }
      logger.debug("set clearedBalance", `Setting cleared balance to '${amountDollars}'`);
      this._clearedBalanceDollars = amountDollars;
      logger.groupEnd("set clearedBalance");
    }
    set unclearedBalance(amountDollars) {
      logger.group("set unclearedBalance");
      if (typeof amountDollars !== "number" || isNaN(amountDollars)) {
        logger.error("set unclearedBalance", `Attempted to set invalid uncleared balance for account ID: '${this.id}', Amount: '${amountDollars}'`);
        logger.groupEnd("set unclearedBalance");
        throw new Error("Account uncleared balance must be a valid number.");
      }
      logger.debug("set unclearedBalance", `Setting uncleared balance to '${amountDollars}'`);
      this._unclearedBalanceDollars = amountDollars;
      logger.groupEnd("set unclearedBalance");
    }
    get migrationStatus() {
      return this._migrationStatus;
    }
    set migrationStatus(status) {
      const methodName = "set migrationStatus";
      logger.group(methodName);
      if (!Object.values(AccountMigrationStatus).includes(status)) {
        logger.error(methodName, `Attempted to set invalid migration status for account ID: '${this.id}', Status: '${status}'`);
        logger.groupEnd(methodName);
        throw new Error(`Migration status must be one of: ${Object.values(AccountMigrationStatus).join(", ")}`);
      }
      logger.debug(methodName, `Setting migration status to '${status}'`);
      this._migrationStatus = status;
      logger.groupEnd(methodName);
    }
    get included() {
      return this._isIncluded;
    }
    set included(value) {
      logger.group("set included");
      if (typeof value !== "boolean") {
        logger.error("set included", `Attempted to set invalid included value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("Included value must be a boolean.");
      }
      this._isIncluded = value;
      logger.groupEnd("set included");
    }
    get selected() {
      return this._isSelected;
    }
    set selected(value) {
      logger.group("set selected");
      if (typeof value !== "boolean") {
        logger.error("set selected", `Attempted to set invalid selected value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("Selected value must be a boolean.");
      }
      this._isSelected = value;
      logger.groupEnd("set selected");
    }
    get isUserApproved() {
      return this._isUserApproved;
    }
    set isUserApproved(value) {
      logger.group("set user approved");
      if (typeof value !== "boolean") {
        logger.error("set user approved", `Attempted to set invalid isUserApproved value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("isUserApproved value must be a boolean.");
      }
      this._isUserApproved = value;
      logger.groupEnd("set user approved");
    }
    get closed() {
      return this._isClosed === "closed";
    }
    set closed(value) {
      logger.group("set closed");
      if (typeof value !== "boolean") {
        logger.error("set closed", `Attempted to set invalid closed value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("Closed value must be a boolean.");
      }
      this._isClosed = value;
      logger.groupEnd("set closed");
    }
    get transactions() {
      return Array.from(this._transactions.values());
    }
    get transactionCount() {
      return this._transactions.size;
    }
    set transactions(transactions) {
      logger.group("set transactions");
      if (!Array.isArray(transactions)) {
        logger.error("set transactions", `Attempted to set invalid transactions for account ID: '${this.id}'. Type '${typeof transactions}'. Transactions: '${transactions}'`);
        logger.groupEnd("set transactions");
        throw new Error("Transactions must be an array of Transaction objects.");
      }
      transactions.forEach((txn) => this._transactions.set(txn.id, txn));
      logger.groupEnd("set transactions");
    }
    addTransaction(transaction) {
      logger.group("addTransaction");
      if (!(transaction instanceof Transaction)) {
        logger.error("addTransaction", `Attempted to add invalid transaction to account ID: '${this.id}', Transaction: ${transaction}`);
        logger.groupEnd("addTransaction");
        return new Error(`Invalid transaction object for account ID: '${this.id}':`, transaction);
      }
      logger.debug("addTransaction", `Adding transaction ID '${transaction.id}' to account ID '${this.id}'`);
      this._transactions.set(transaction.id, transaction);
      logger.groupEnd("addTransaction");
    }
    get isOnBudget() {
      return this._isOnBudget;
    }
    set isOnBudget(value) {
      logger.group("set isOnBudget");
      if (typeof value !== "boolean") {
        logger.error("set isOnBudget", `Attempted to set invalid isOnBudget value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("isOnBudget value must be a boolean.");
      }
      this._isOnBudget = value;
      logger.groupEnd("set isOnBudget");
    }
    set note(value) {
      logger.group("set note");
      if (value !== null && typeof value !== "string") {
        logger.error("set note", `Attempted to set invalid note value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("Note value must be a string or null.");
      }
      this._note = value;
      logger.groupEnd("set note");
    }
    set debtOriginalBalance(value) {
      logger.group("set debtOriginalBalance");
      if (value !== null && typeof value !== "number") {
        logger.error("set debtOriginalBalance", `Attempted to set invalid debtOriginalBalance value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("debtOriginalBalance value must be a number or null.");
      }
      this._debtOriginalBalance = value;
      logger.groupEnd("set debtOriginalBalance");
    }
    set debtInterestRates(value) {
      logger.group("set debtInterestRates");
      if (value !== null && (typeof value !== "object" || Array.isArray(value))) {
        logger.error("set debtInterestRates", `Attempted to set invalid debtInterestRates value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("debtInterestRates value must be an object or null.");
      }
      this._debtInterestRates = value;
      logger.groupEnd("set debtInterestRates");
    }
    set debtMinimumPayments(value) {
      logger.group("set debtMinimumPayments");
      if (value !== null && (typeof value !== "object" || Array.isArray(value))) {
        logger.error("set debtMinimumPayments", `Attempted to set invalid debtMinimumPayments value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("debtMinimumPayments value must be an object or null.");
      }
      this._debtMinimumPayments = value;
      logger.groupEnd("set debtMinimumPayments");
    }
    set debtEscrowAmounts(value) {
      logger.group("set debtEscrowAmounts");
      if (value !== null && (typeof value !== "object" || Array.isArray(value))) {
        logger.error("set debtEscrowAmounts", `Attempted to set invalid debtEscrowAmounts value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("debtEscrowAmounts value must be an object or null.");
      }
      this._debtEscrowAmounts = value;
      logger.groupEnd("set debtEscrowAmounts");
    }
    set transferPayeeId(value) {
      logger.group("set transferPayeeId");
      if (value !== null && typeof value !== "string") {
        logger.error("set transferPayeeId", `Attempted to set invalid transferPayeeId value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("transferPayeeId value must be a string or null.");
      }
      this._transferPayeeId = value;
      logger.groupEnd("set transferPayeeId");
    }
    set isDirectImportLinked(value) {
      logger.group("set isDirectImportLinked");
      if (typeof value !== "boolean") {
        logger.error("set isDirectImportLinked", `Attempted to set invalid isDirectImportLinked value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("isDirectImportLinked value must be a boolean.");
      }
      this._isDirectImportLinked = value;
      logger.groupEnd("set isDirectImportLinked");
    }
    get isDirectImportLinked() {
      return this._isDirectImportLinked;
    }
    set isDirectImportOnError(value) {
      logger.group("set isDirectImportOnError");
      if (typeof value !== "boolean") {
        logger.error("set isDirectImportOnError", `Attempted to set invalid isDirectImportOnError value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("isDirectImportOnError value must be a boolean.");
      }
      this._isDirectImportOnError = value;
      logger.groupEnd("set isDirectImportOnError");
    }
    set lastReconciledAt(value) {
      logger.group("set lastReconciledAt");
      if (value !== null && !(value instanceof Date)) {
        logger.error("set lastReconciledAt", `Attempted to set invalid lastReconciledAt value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("lastReconciledAt value must be a Date object or null.");
      }
      this._lastReconciledAt = value;
      logger.groupEnd("set lastReconciledAt");
    }
    get isYnabClosed() {
      return this._isYnabClosed;
    }
    set isYnabClosed(value) {
      logger.group("set isYnabClosed");
      if (typeof value !== "boolean") {
        logger.error("set isYnabClosed", `Attempted to set invalid isYnabClosed value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("isYnabClosed value must be a boolean.");
      }
      this._isYnabClosed = value;
      logger.groupEnd("set isYnabClosed");
    }
    get isMonarchClosed() {
      return this._isMonarchClosed;
    }
    set isMonarchClosed(value) {
      logger.group("set isMonarchClosed");
      if (typeof value !== "boolean") {
        logger.error("set isMonarchClosed", `Attempted to set invalid isMonarchClosed value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("isMonarchClosed value must be a boolean.");
      }
      this._isMonarchClosed = value;
      logger.groupEnd("set isMonarchClosed");
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(value) {
      logger.group("set isDeleted");
      if (typeof value !== "boolean") {
        logger.error("set isDeleted", `Attempted to set invalid isDeleted value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("isDeleted value must be a boolean.");
      }
      this._isDeleted = value;
      logger.groupEnd("set isDeleted");
    }
    get isModified() {
      const methodName = "get isModified";
      logger.group(methodName);
      const hasNameChanged = this._ynabName !== this._monarchName;
      const hasTypeChanged = this._ynabType !== this._ynabOriginalType;
      const hasSubtypeChanged = this._subtype !== this._originalSubtype;
      const modified = hasNameChanged || hasTypeChanged || hasSubtypeChanged;
      logger.debug(methodName, `Account ID: '${this.id}', isModified: '${modified}'`);
      logger.groupEnd(methodName);
      return modified;
    }
    set isModified(value) {
      logger.group("set modified");
      if (typeof value !== "boolean") {
        logger.error("set modified", `Attempted to set invalid modified value for account ID: '${this.id}', Value: '${value}'`);
        throw new Error("Modified value must be a boolean.");
      }
      this._isModified = value;
      logger.groupEnd("set modified");
    }
    async undoChanges() {
      logger.group("undoChanges");
      this._ynabName = this._monarchName;
      this._category = this._originalCategory;
      this._categoryGroup = this._originalCategoryGroup;
      this._isModified = false;
      await indexedDB_default.updateAccountModification(this.id, {
        name: this._ynabName,
        type: this._category,
        subtype: this._categoryGroup,
        modified: this._isModified
      });
      logger.groupEnd("undoChanges");
    }
    async syncDbModifications() {
      logger.group("syncDbModifications");
      const accountInDb = await indexedDB_default.getAccount(this.id);
      if (!accountInDb) {
        logger.error("syncDbModifications", `Account ID '${this.id}' not found in database; cannot sync modifications.`);
        logger.groupEnd("syncDbModifications");
        throw new Error(`Account ID '${this.id}' not found in database.`);
      }
      const modifications = {};
      if (this._ynabName !== this._monarchName && this._ynabName !== accountInDb.name) {
        modifications.name = this._ynabName;
      }
      if (this._ynabType !== this._ynabOriginalType && this._ynabType !== accountInDb.type) {
        modifications.type = this._ynabType;
      }
      if (this._subtype !== this._originalSubtype && this._subtype !== accountInDb.subtype) {
        modifications.subtype = this._subtype;
      }
      if (Object.keys(modifications).length > 0) {
        if (this._isModified === false) {
          modifications.modified = true;
          this._isModified = true;
        }
      } else {
        if (this._isModified === true) {
          modifications.modified = false;
          this._isModified = false;
        }
      }
      modifications.included = this._isIncluded;
      modifications.selected = this._isSelected;
      if (Object.keys(modifications).length > 0) {
        logger.debug("syncDbModifications", `Updating account ID '${this.id}' with modifications:`, modifications);
        await indexedDB_default.updateAccountModification(this.id, modifications);
      } else {
        logger.debug("syncDbModifications", `No modifications to sync for account ID '${this.id}'`);
      }
      logger.groupEnd("syncDbModifications");
    }
    initFromApiData(data2) {
      console.warn("Account initFromApiData, data:", data2);
      this.ynabName = data2["name"];
      this.monarchName = data2["name"];
      this.ynabType = data2["type"];
      this.isOnBudget = data2["on_budget"];
      this.note = data2["note"];
      this.balance = centsToDollars(data2["balance"]);
      this.clearedBalance = centsToDollars(data2["cleared_balance"]);
      this.unclearedBalance = centsToDollars(data2["uncleared_balance"]);
      this.transferPayeeId = data2["transfer_payee_id"];
      this.isDirectImportLinked = data2["direct_import_linked"];
      this.isDirectImportOnError = data2["direct_import_in_error"];
      this.lastReconciledAt = parseDate(data2["last_reconciled_at"]);
      this.debtOriginalBalance = data2["debt_original_balance"];
      this.debtInterestRates = data2["debt_interest_rates"];
      this.debtMinimumPayments = data2["debt_minimum_payments"];
      this.debtEscrowAmounts = data2["debt_escrow_amounts"];
      this.isYnabClosed = data2["closed"];
      this.isMonarchClosed = data2["closed"];
      this.isUserApproved = false;
    }
    toObject() {
      const serialized = {};
      Object.entries(this).forEach(([key, value]) => {
        const normalizedKey = key.startsWith("_") ? key.slice(1) : key;
        serialized[normalizedKey] = this._serializeForStorage(normalizedKey, value);
      });
      return serialized;
    }
    _serializeForStorage(key, value) {
      if (value instanceof Map) {
        if (key === "transactions") {
          return Array.from(value.values()).map((txn) => txn && typeof txn === "object" && "id" in txn ? txn.id : txn);
        }
        return Array.from(value.entries());
      }
      if (value instanceof Set) {
        return Array.from(value);
      }
      return value;
    }
  };

  // src/utils/indexedDB.js
  var DB_NAME = "YnabToMonarchDB";
  var DB_VERSION = 2;
  var isIndexedDBAvailable = typeof indexedDB !== "undefined";
  var FinancialDataDB = class {
    constructor() {
      this.db = null;
    }
    async init() {
      console.group("Initializing IndexedDB:");
      if (!isIndexedDBAvailable) {
        console.warn("IndexedDB not available in this environment");
        console.groupEnd();
        return;
      }
      if (this.db) {
        console.log("\u2705 IndexedDB already initialized, skipping");
        console.groupEnd();
        return;
      }
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => {
          console.error("IndexedDB failed to open:", request.error);
          console.groupEnd();
          reject(request.error);
        };
        request.onsuccess = () => {
          this.db = request.result;
          console.log("\u2705 IndexedDB initialized");
          console.groupEnd();
          resolve();
        };
        request.onupgradeneeded = (event) => {
          const db2 = event.target.result;
          let accountStore;
          if (!db2.objectStoreNames.contains("accounts")) {
            accountStore = db2.createObjectStore("accounts", { keyPath: "id" });
            console.log('Created "accounts" object store');
          } else {
            accountStore = event.target.transaction.objectStore("accounts");
            console.log('Upgrading "accounts" object store');
          }
          if (accountStore && !accountStore.indexNames.contains("name")) {
            accountStore.createIndex("name", "name", { unique: false });
          }
          if (accountStore && !accountStore.indexNames.contains("type")) {
            accountStore.createIndex("type", "type", { unique: false });
          }
          if (accountStore && !accountStore.indexNames.contains("included")) {
            accountStore.createIndex("included", "included", { unique: false });
          }
          if (accountStore && !accountStore.indexNames.contains("modified")) {
            accountStore.createIndex("modified", "modified", { unique: false });
          }
          if (accountStore && !accountStore.indexNames.contains("syncedAt")) {
            accountStore.createIndex("syncedAt", "syncedAt", { unique: false });
          }
          if (!db2.objectStoreNames.contains("transactions")) {
            const txnStore = db2.createObjectStore("transactions", { keyPath: "id", autoIncrement: true });
            txnStore.createIndex("accountId", "accountId", { unique: false });
            txnStore.createIndex("date", "date", { unique: false });
            console.log('Created "transactions" object store');
          }
          if (!db2.objectStoreNames.contains("uploadStates")) {
            const uploadStore = db2.createObjectStore("uploadStates", { keyPath: "itemId" });
            uploadStore.createIndex("status", "status", { unique: false });
            uploadStore.createIndex("timestamp", "timestamp", { unique: false });
            console.log('Created "uploadStates" object store');
          }
          if (!db2.objectStoreNames.contains("metadata")) {
            db2.createObjectStore("metadata", { keyPath: "key" });
            console.log('Created "metadata" object store');
          }
          console.groupEnd();
        };
      });
    }
    async saveAccounts(accountsData) {
      console.group("saveAccounts:");
      if (!(accountsData instanceof Accounts)) {
        console.error("Invalid accountsData provided, expected Accounts instance");
        console.groupEnd();
        throw new Error("Invalid accountsData provided, expected Accounts instance");
      }
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized, skipping save");
        console.groupEnd();
        return;
      }
      console.log(`Saving ${accountsData.accounts.length} accounts to IndexedDB`);
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(["accounts", "transactions"], "readwrite");
        const accountStore = tx.objectStore("accounts");
        const txnStore = tx.objectStore("transactions");
        console.log("Clearing existing accounts and transactions...");
        accountStore.clear();
        txnStore.clear();
        for (const account of accountsData.accounts) {
          console.debug(`Account data for '${account.id}':`, account);
          const transactionIds = /* @__PURE__ */ new Set();
          console.log(`Processing (${account.transactions.length}) transactions for account '${account.id}'`);
          for (const txn of account.transactions) {
            try {
              console.debug(`Storing transaction:`, txn);
              txnStore.put(txn.toObject());
              transactionIds.add(txn.id);
            } catch (e) {
              console.error(`Error storing transaction for account ${account.id}:`, e);
            }
          }
          console.log(`Saving account '${account.ynabName}' with ID '${account.id}' with (${transactionIds.size}) transaction IDs`);
          accountStore.put(account.toObject());
        }
        tx.oncomplete = () => {
          console.log(`Saved (${accountsData.accounts.length}) accounts to IndexedDB.`);
          console.groupEnd();
          resolve();
        };
        tx.onerror = () => {
          console.error("Error saving accounts to IndexedDB:", tx.error);
          console.groupEnd();
          reject(tx.error);
        };
      });
    }
    async getAccounts() {
      console.group("getAccounts:");
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized, returning empty Accounts");
        console.groupEnd();
        throw new Error("IndexedDB not initialized");
      }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(["accounts", "transactions"], "readonly");
        const accountStore = tx.objectStore("accounts");
        const txnStore = tx.objectStore("transactions");
        const accountsData = {};
        const cursorRequest = accountStore.openCursor();
        cursorRequest.onsuccess = async (event) => {
          const cursor = event.target.result;
          if (!cursor) {
            console.debug(`\u2705 Retrieved ${Object.keys(accountsData).length} accounts from IndexedDB`);
            const accounts = new Accounts();
            await accounts.init(accountsData);
            console.groupEnd();
            resolve(accounts);
            return;
          }
          const accountData = cursor.value;
          const accountId = accountData.id;
          const txnIndex = txnStore.index("accountId");
          const txnRequest = txnIndex.getAll(accountId);
          txnRequest.onsuccess = () => {
            const { transactionIds, ...restAccountData } = accountData;
            accountsData[accountId] = {
              ...restAccountData,
              transactions: txnRequest.result.map((txn) => {
                const { accountId: accountId2, ...rest } = txn;
                return rest;
              })
            };
            console.debug(`Retrieved account ${accountId} with ${txnRequest.result.length} transactions`);
            cursor.continue();
          };
          txnRequest.onerror = () => {
            console.error("Error retrieving transactions:", txnRequest.error);
            console.groupEnd();
            reject(txnRequest.error);
          };
        };
        cursorRequest.onerror = () => {
          console.error("Error opening cursor:", cursorRequest.error);
          console.groupEnd();
          reject(cursorRequest.error);
        };
      });
    }
    async getAccount(accountId) {
      console.group("getAccount:");
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized");
        console.groupEnd();
        return null;
      }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(["accounts", "transactions"], "readonly");
        const accountStore = tx.objectStore("accounts");
        const txnStore = tx.objectStore("transactions");
        const getRequest = accountStore.get(accountId);
        getRequest.onsuccess = () => {
          const account = getRequest.result;
          if (!account) {
            console.warn(`Account ${accountId} not found`);
            console.groupEnd();
            resolve(null);
            return;
          }
          const txnIndex = txnStore.index("accountId");
          const txnRequest = txnIndex.getAll(accountId);
          txnRequest.onsuccess = () => {
            const { transactionIds, ...accountData } = account;
            const result = {
              ...accountData,
              transactions: txnRequest.result.map((txn) => {
                const { accountId: accountId2, ...rest } = txn;
                return rest;
              })
            };
            console.log(`\u2705 Retrieved account ${accountId} with ${txnRequest.result.length} transactions`);
            console.groupEnd();
            resolve(result);
          };
          txnRequest.onerror = () => {
            console.error("Error retrieving transactions:", txnRequest.error);
            console.groupEnd();
            reject(txnRequest.error);
          };
        };
        getRequest.onerror = () => {
          console.error("Error retrieving account:", getRequest.error);
          console.groupEnd();
          reject(getRequest.error);
        };
      });
    }
    async hasAccounts() {
      console.group("hasAccounts:");
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized");
        console.groupEnd();
        return false;
      }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction("accounts", "readonly");
        const store = tx.objectStore("accounts");
        const request = store.count();
        request.onsuccess = () => {
          const hasAccounts = request.result > 0;
          console.log(`\u2705 Database has ${request.result} accounts`);
          console.groupEnd();
          resolve(hasAccounts);
        };
        request.onerror = () => {
          console.error("Error checking accounts:", request.error);
          console.groupEnd();
          resolve(false);
        };
      });
    }
    async updateAccountModification(accountId, updates = {}) {
      console.group("updateAccountModification:");
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized");
        console.groupEnd();
        return;
      }
      const tx = this.db.transaction("accounts", "readwrite");
      const store = tx.objectStore("accounts");
      return new Promise((resolve, reject) => {
        console.log(`Updating account ${accountId} with`, updates);
        const getRequest = store.get(accountId);
        getRequest.onsuccess = () => {
          const current = getRequest.result;
          console.log("Current account data:", current);
          if (!current) {
            console.warn(`Account ${accountId} not found`);
            console.groupEnd();
            resolve();
            return;
          }
          const now = Date.now();
          const updated = {
            ...current,
            ..."included" in updates ? { included: updates.included } : {},
            ..."selected" in updates ? { selected: updates.selected } : {},
            ..."name" in updates ? { name: updates.name } : {},
            ..."type" in updates ? { type: updates.type } : {},
            ..."subtype" in updates ? { subtype: updates.subtype } : {},
            modified: updates.modified !== void 0 ? updates.modified : false,
            lastModified: now
          };
          console.log("Updated account data:", updated);
          const putRequest = store.put(updated);
          putRequest.onsuccess = () => {
            console.log(`\u2705 Account ${accountId} updated successfully`);
            console.groupEnd();
            resolve();
          };
          putRequest.onerror = () => {
            console.error("Error updating account modification:", putRequest.error);
            console.groupEnd();
            reject(putRequest.error);
          };
        };
        getRequest.onerror = () => {
          console.error("Error retrieving account:", getRequest.error);
          console.groupEnd();
          reject(getRequest.error);
        };
      });
    }
    async saveAccount(account) {
      console.group("saveAccount:", account.id);
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized");
        console.groupEnd();
        return;
      }
      const tx = this.db.transaction(["accounts", "transactions"], "readwrite");
      const accountStore = tx.objectStore("accounts");
      const transactionStore = tx.objectStore("transactions");
      return new Promise((resolve, reject) => {
        const accountData = account.toObject ? account.toObject() : account.toJSON ? account.toJSON() : account;
        const putRequest = accountStore.put(accountData);
        putRequest.onsuccess = () => {
          console.log(`\u2705 Account ${account.id} saved successfully`);
          if (account.transactions && Array.isArray(account.transactions)) {
            account.transactions.forEach((transaction) => {
              const txnData = transaction.toJSON ? transaction.toJSON() : transaction;
              txnData.accountId = account.id;
              transactionStore.put(txnData);
            });
          }
        };
        putRequest.onerror = () => {
          console.error("Error saving account:", putRequest.error);
          console.groupEnd();
          reject(putRequest.error);
          return;
        };
        tx.oncomplete = () => {
          console.log(`\u2705 Account ${account.id} and its transactions saved to IndexedDB`);
          console.groupEnd();
          resolve();
        };
        tx.onerror = () => {
          console.error("Transaction error:", tx.error);
          console.groupEnd();
          reject(tx.error);
        };
      });
    }
    async clearAccounts() {
      console.group("clearAccounts:");
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized, nothing to clear");
        console.groupEnd();
        return;
      }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(["accounts", "transactions"], "readwrite");
        tx.objectStore("accounts").clear();
        tx.objectStore("transactions").clear();
        tx.oncomplete = () => {
          console.log("\u2705 Cleared all accounts from IndexedDB");
          console.groupEnd();
          resolve();
        };
        tx.onerror = () => {
          console.error("Error clearing accounts:", tx.error);
          console.groupEnd();
          reject(tx.error);
        };
      });
    }
    async deleteAccounts(accountIds) {
      console.group("deleteAccounts:", accountIds);
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized, cannot delete accounts");
        console.groupEnd();
        return;
      }
      if (!Array.isArray(accountIds) || accountIds.length === 0) {
        console.warn("No account IDs provided");
        console.groupEnd();
        return;
      }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(["accounts", "transactions"], "readwrite");
        const accountStore = tx.objectStore("accounts");
        const transactionStore = tx.objectStore("transactions");
        const accountIndex = transactionStore.index("accountId");
        accountIds.forEach((accountId) => {
          accountStore.delete(accountId);
          const range = IDBKeyRange.only(accountId);
          const request = accountIndex.openCursor(range);
          request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              cursor.delete();
              cursor.continue();
            }
          };
        });
        tx.oncomplete = () => {
          console.log(`\u2705 Deleted ${accountIds.length} accounts and their transactions from IndexedDB`);
          console.groupEnd();
          resolve();
        };
        tx.onerror = () => {
          console.error("Error deleting accounts:", tx.error);
          console.groupEnd();
          reject(tx.error);
        };
      });
    }
    async saveUploadState(itemId, status, errorMsg = null) {
      console.group("saveUploadState:");
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized, skipping upload state save");
        console.groupEnd();
        return;
      }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction("uploadStates", "readwrite");
        const store = tx.objectStore("uploadStates");
        const getRequest = store.get(itemId);
        getRequest.onsuccess = () => {
          const existing = getRequest.result;
          const retryCount = existing ? (existing.retryCount || 0) + 1 : 0;
          const putRequest = store.put({
            itemId,
            status,
            retryCount,
            lastError: errorMsg,
            timestamp: Date.now()
          });
          putRequest.onsuccess = () => {
            console.log(`\u2705 Upload state for item ${itemId} saved as "${status}"`);
            console.groupEnd();
            resolve();
          };
          putRequest.onerror = () => {
            console.error("Error saving upload state:", putRequest.error);
            console.groupEnd();
            reject(putRequest.error);
          };
        };
        getRequest.onerror = () => {
          console.error("Error retrieving existing upload state:", getRequest.error);
          console.groupEnd();
          reject(getRequest.error);
        };
      });
    }
    async getUploadStatesByStatus(status) {
      console.group("getUploadStatesByStatus:");
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized, returning empty list");
        console.groupEnd();
        return [];
      }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction("uploadStates", "readonly");
        const store = tx.objectStore("uploadStates");
        const index = store.index("status");
        const request = index.getAll(status);
        request.onsuccess = () => {
          console.log(`\u2705 Retrieved ${request.result.length} upload states with status "${status}"`);
          console.groupEnd();
          resolve(request.result || []);
        };
        request.onerror = () => {
          console.error("Error retrieving upload states:", request.error);
          console.groupEnd();
          resolve([]);
        };
      });
    }
    async clearUploadStates() {
      console.group("clearUploadStates:");
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized, nothing to clear");
        console.groupEnd();
        return;
      }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction("uploadStates", "readwrite");
        tx.objectStore("uploadStates").clear();
        tx.oncomplete = () => {
          console.log("\u2705 Cleared upload states");
          console.groupEnd();
          resolve();
        };
        tx.onerror = () => {
          console.error("Error clearing upload states:", tx.error);
          console.groupEnd();
          reject(tx.error);
        };
      });
    }
    async saveMetadata(key, value) {
      console.group("saveMetadata:");
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized, skipping metadata save");
        console.groupEnd();
        return;
      }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction("metadata", "readwrite");
        const store = tx.objectStore("metadata");
        const request = store.put({ key, value, timestamp: Date.now() });
        request.onsuccess = () => {
          console.log(`\u2705 Metadata for key "${key}" saved`);
          console.groupEnd();
          resolve();
        };
        request.onerror = () => {
          console.error("Error saving metadata:", request.error);
          console.groupEnd();
          reject(request.error);
        };
      });
    }
    async getMetadata(key) {
      console.group("getMetadata:");
      if (!isIndexedDBAvailable || !this.db) {
        console.warn("IndexedDB not initialized, returning null");
        console.groupEnd();
        return null;
      }
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction("metadata", "readonly");
        const store = tx.objectStore("metadata");
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          console.log(`\u2705 Retrieved metadata for key "${key}":`, result);
          console.groupEnd();
          resolve(result ? result.value : null);
        };
        request.onerror = () => {
          console.error("Error retrieving metadata:", request.error);
          console.groupEnd();
          resolve(null);
        };
      });
    }
    close() {
      console.group("close IndexedDB:");
      if (this.db) {
        this.db.close();
        this.db = null;
        console.log("\u2705 IndexedDB connection closed");
      } else {
        console.log("IndexedDB was not open");
      }
      console.groupEnd();
    }
  };
  var db = new FinancialDataDB();
  var indexedDB_default = db;

  // src/schemas/accounts.js
  var accountsLogger = logger_default("Accounts");
  setLoggerConfig({
    namespaces: { Accounts: false },
    methods: { "Accounts.getByName": true },
    levels: { debug: true, group: true, groupEnd: true }
  });
  var Accounts = class {
    static from(accountList) {
      if (accountList instanceof Accounts) {
        return accountList;
      }
      const instance = new Accounts();
      if (!Array.isArray(accountList)) {
        return instance;
      }
      accountList.forEach((entry) => {
        if (entry instanceof Account) {
          instance._accounts.set(entry.id, entry);
          return;
        }
        if (entry && typeof entry === "object") {
          const account = new Account(entry.id);
          instance._populateAccount(account, entry);
          instance._accounts.set(account.id, account);
        }
      });
      return instance;
    }
    constructor() {
      this._accounts = /* @__PURE__ */ new Map();
      this._transactionIds = /* @__PURE__ */ new Set();
    }
    async init(accountsData) {
      let normalized;
      if (accountsData instanceof Accounts) {
        normalized = accountsData;
      } else if (Array.isArray(accountsData)) {
        normalized = Accounts.from(accountsData);
      } else if (accountsData && typeof accountsData === "object") {
        normalized = Accounts.from(Object.values(accountsData));
      } else {
        normalized = new Accounts();
      }
      this._accounts = new Map(normalized._accounts);
      this._transactionIds = new Set(normalized._transactionIds || []);
      return this;
    }
    get accounts() {
      return Array.from(this._accounts.values());
    }
    _populateAccount(account, data2) {
      const numberFrom = (...fields) => {
        for (const field of fields) {
          const value = data2[field];
          if (value !== void 0 && value !== null) {
            const numeric = typeof value === "number" ? value : Number(value);
            return isNaN(numeric) ? 0 : numeric;
          }
        }
        return 0;
      };
      account._ynabName = data2.ynabName;
      account._monarchName = data2.monarchName;
      account._ynabType = data2.ynabType;
      account._ynabOriginalType = data2.ynabOriginalType ?? data2.originalType ?? account._ynabType;
      account._subtype = data2.subtype ?? data2.originalSubtype ?? null;
      account._balanceDollars = numberFrom("balanceDollars", "balance");
      account._clearedBalanceDollars = numberFrom("clearedBalanceDollars", "clearedBalance");
      account._unclearedBalanceDollars = numberFrom("unclearedBalanceDollars", "unclearedBalance");
      account._migrationStatus = data2.migrationStatus ?? data2.status ?? account._migrationStatus;
      account._isIncluded = data2.isIncluded ?? data2.included ?? true;
      account._isSelected = data2.isSelected ?? data2.selected ?? false;
      account._isUserApproved = data2.isUserApproved ?? false;
      account._isOnBudget = data2.isOnBudget ?? data2.onBudget ?? account._isOnBudget;
      account._isYnabClosed = data2.isYnabClosed ?? data2.isClosed ?? data2.closed ?? account._isYnabClosed;
      account._isMonarchClosed = data2.isMonarchClosed ?? false;
      account._isModified = data2.modified || false;
      account._isDirectImportLinked = data2.isDirectImportLinked ?? false;
      if (data2.transactions && Array.isArray(data2.transactions)) {
        data2.transactions.forEach((txnData) => {
          const txn = new Transaction();
          Object.assign(txn, {
            id: txnData.id,
            _accountId: txnData.accountId,
            _flagName: txnData.flagName,
            _date: txnData.date,
            _payee: txnData.payee,
            _categoryGroup: txnData.categoryGroup,
            _category: txnData.category,
            _memo: txnData.memo,
            _amountDollars: txnData.amountDollars,
            _state: txnData.state,
            _deleted: txnData.deleted,
            _transferAccountName: txnData.transferAccountName
          });
          account._transactions.set(txn.id, txn);
        });
      }
    }
    add(account) {
      accountsLogger.group("add");
      if (!this._accounts.has(account.id)) {
        accountsLogger.debug("add", `Adding account with ID '${account.id}' to Accounts`);
        this._accounts.set(account.id, account);
      } else {
        accountsLogger.warn("add", `Account with ID ${account.id} already exists:
AccountData:`, account, `
Existing Account:`, this._accounts.get(account.id));
      }
      accountsLogger.groupEnd("add");
    }
    has(accountName) {
      accountsLogger.group("has");
      const sanitizedName = accountName.trim();
      if (sanitizedName.length === 0) {
        accountsLogger.warn("has", "\u274C Attempted to check empty name in Accounts.has");
        accountsLogger.groupEnd("has");
        return false;
      }
      const result = Array.from(this._accounts.values()).some((acc) => acc.ynabName === sanitizedName);
      accountsLogger.debug("has", `Accounts.has: checking for "${sanitizedName}" ->`, result);
      accountsLogger.groupEnd("has");
      return result;
    }
    getByName(accountName) {
      accountsLogger.group("getByName");
      const sanitizedName = accountName.trim();
      if (sanitizedName.length === 0) {
        accountsLogger.error("getByName", "Attempted to get empty name in Accounts.getByName");
        accountsLogger.groupEnd("getByName");
        throw new Error("Account name cannot be empty.");
      }
      const account = Array.from(this._accounts.values()).find((acc) => acc._ynabName === sanitizedName) || null;
      accountsLogger.debug("getByName", `Accounts.getByName: retrieving "${sanitizedName}" ->`, account);
      accountsLogger.groupEnd("getByName");
      return account;
    }
    async loadFromDb() {
      console.warn("Loading accounts from DB");
      await indexedDB_default.init();
      const accountsData = await indexedDB_default.getAccounts();
      return this.init(accountsData);
    }
    async saveToDb() {
      accountsLogger.group("saveToDb");
      await indexedDB_default.init();
      await indexedDB_default.saveAccounts(this);
      accountsLogger.log("saveToDb", "\u2705 All accounts saved successfully");
      accountsLogger.groupEnd("saveToDb");
    }
    async forEach(callback) {
      for (const account of this._accounts.values()) {
        await callback(account);
      }
    }
    length() {
      return this._accounts.size;
    }
    totalTransactionCount() {
      return this._transactionIds.size;
    }
    async hasChanges() {
      return Array.from(this._accounts.values()).some((acc) => acc.isModified);
    }
    async isAccountModified(accountId) {
      const account = this._accounts.get(accountId);
      return account ? account.isModified : false;
    }
    async includeAll() {
      await Promise.all(Array.from(this._accounts.values()).map((account) => {
        account._included = true;
        return indexedDB_default.updateAccountModification(account.id, { included: true });
      }));
    }
    async excludeAll() {
      await Promise.all(Array.from(this._accounts.values()).map((account) => {
        account._included = false;
        return indexedDB_default.updateAccountModification(account.id, { included: false });
      }));
    }
    async setInclusion(accountId, included) {
      const account = this._accounts.get(accountId);
      if (!account || typeof included !== "boolean") {
        return;
      }
      account.included = included;
      await indexedDB_default.updateAccountModification(account.id, { included });
    }
    async toggleInclusion(accountId) {
      const account = this._accounts.get(accountId);
      if (!account) {
        return false;
      }
      const nextState = !account.included;
      await this.setInclusion(account.id, nextState);
      return nextState;
    }
    async setInclusionFor(accountIds, included) {
      if (!Array.isArray(accountIds) || accountIds.length === 0) {
        return;
      }
      await Promise.all(accountIds.map((id) => this.setInclusion(id, included)));
    }
    async setSelected(accountId, selected) {
      const account = this._accounts.get(accountId);
      if (!account)
        return;
      account.selected = selected;
      await indexedDB_default.updateAccountModification(account.id, { selected });
    }
    async setSelectedFor(accountIds, selected) {
      if (!Array.isArray(accountIds) || accountIds.length === 0) {
        return;
      }
      await Promise.all(accountIds.map((id) => this.setSelected(id, selected)));
    }
    async bulkRename(pattern, indexStart) {
      const selected = Array.from(this._accounts.values()).filter((acc) => acc.selected);
      await Promise.all(selected.map((acc, i) => {
        const newName = applyPattern(pattern, acc, i + indexStart);
        acc.ynabName = newName;
        acc.isModified = true;
        return indexedDB_default.updateAccountModification(acc.id, { name: newName });
      }));
    }
    async bulkEditType(type, subtype) {
      const selected = Array.from(this._accounts.values()).filter((acc) => acc.selected);
      await Promise.all(selected.map((acc) => {
        acc.ynabType = type;
        acc.monarchSubtype = subtype;
        acc.isModified = true;
        return indexedDB_default.updateAccountModification(acc.id, { type, subtype });
      }));
    }
    getSelected() {
      return Array.from(this._accounts.values()).filter((acc) => acc.selected);
    }
    getVisible(filters) {
      console.warn("Accounts.getVisible called");
      console.log("Filters:", filters);
      console.log("Accounts:", this._accounts);
      const result = Array.from(this._accounts.values()).filter((acc) => filters.passesFilters(acc));
      return result;
    }
    getIncludedAndUnprocessed() {
      return Array.from(this._accounts.values()).filter((acc) => acc.included && acc.migrationStatus !== "processed");
    }
    async undoAccountChanges(accountId) {
      const account = this._accounts.get(accountId);
      if (account) {
        await account.undoChanges();
      }
    }
    async undoAllChanges() {
      await Promise.all(Array.from(this._accounts.values()).map((account) => account.undoChanges()));
    }
    async deselectAll() {
      await Promise.all(Array.from(this._accounts.values()).map((account) => {
        account.selected = false;
        return indexedDB_default.updateAccountModification(account.id, { selected: false });
      }));
    }
    async selectAll() {
      await Promise.all(Array.from(this._accounts.values()).map((account) => {
        account.selected = true;
        return indexedDB_default.updateAccountModification(account.id, { selected: true });
      }));
    }
    async clear() {
      await indexedDB_default.clearAccounts();
      this._accounts = /* @__PURE__ */ new Map();
    }
    async removeAccounts(accountIds) {
      if (!Array.isArray(accountIds) || accountIds.length === 0) {
        return;
      }
      await indexedDB_default.deleteAccounts(accountIds);
      accountIds.forEach((id) => this._accounts.delete(id));
    }
    async updateAccount(account) {
      if (!account || !account.id) {
        return;
      }
      await indexedDB_default.saveAccount(account);
      this._accounts.set(account.id, account);
    }
    addTransaction(transactionId) {
      accountsLogger.group("addTransaction");
      if (this._transactionIds.has(transactionId)) {
        accountsLogger.warn("addTransaction", "\u274C Attempted to add duplicate transaction ID to Accounts:", transactionId);
        accountsLogger.groupEnd("addTransaction");
        return;
      }
      this._transactionIds.add(transactionId);
      accountsLogger.groupEnd("addTransaction");
    }
  };
  function applyPattern(pattern, account, index) {
    return pattern.replace(/{name}/g, account.name).replace(/{type}/g, account.type).replace(/{index}/g, index);
  }

  // src/api/ynabOauth.js
  var AUTHORIZE_BASE_URL = "https://app.ynab.com/oauth/authorize";
  var CALLBACK_PATH = "/oauth/ynab/callback";
  var EXPECTED_STATE_KEY = "ynab_oauth_expected_state";
  var ALERT_MESSAGE = "Could not retrieve YNAB OAuth client ID. Please try again.";
  var cachedClientId = null;
  function getRedirectUri() {
    return `${location.origin}${CALLBACK_PATH}`;
  }
  async function getClientId() {
    if (cachedClientId) {
      return cachedClientId;
    }
    try {
      const response = await fetch("/.netlify/functions/config");
      if (!response.ok) {
        throw new Error("Failed to fetch config");
      }
      const config = await response.json();
      cachedClientId = config.ynabClientId;
      return cachedClientId;
    } catch (error) {
      console.error("Error fetching YNAB client ID:", error);
      return null;
    }
  }
  function safeSessionStorage() {
    try {
      return window.sessionStorage;
    } catch (error) {
      console.warn("Session storage unavailable:", error);
      return null;
    }
  }
  function persistExpectedState(state2) {
    const storage = safeSessionStorage();
    if (!storage)
      return;
    storage.setItem(EXPECTED_STATE_KEY, state2);
  }
  function grabExpectedState() {
    const storage = safeSessionStorage();
    if (!storage)
      return null;
    return storage.getItem(EXPECTED_STATE_KEY);
  }
  function dropExpectedState() {
    const storage = safeSessionStorage();
    if (!storage)
      return;
    storage.removeItem(EXPECTED_STATE_KEY);
  }
  function buildState() {
    const cryptoSource = window.crypto || window.msCrypto;
    if (cryptoSource?.randomUUID) {
      return cryptoSource.randomUUID();
    }
    if (cryptoSource?.getRandomValues) {
      const array = new Uint8Array(16);
      cryptoSource.getRandomValues(array);
      return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }
  function buildAuthorizeUrl(clientId, stateValue) {
    const base2 = new URL(AUTHORIZE_BASE_URL);
    base2.searchParams.set("client_id", clientId);
    base2.searchParams.set("response_type", "code");
    base2.searchParams.set("redirect_uri", getRedirectUri());
    base2.searchParams.set("state", stateValue);
    return base2.toString();
  }
  async function startYnabOauth() {
    const clientId = await getClientId();
    if (!clientId) {
      window.alert(ALERT_MESSAGE);
      return null;
    }
    const state2 = buildState();
    persistExpectedState(state2);
    const url = buildAuthorizeUrl(clientId, state2);
    window.location.assign(url);
    return url;
  }
  function getExpectedState() {
    return grabExpectedState();
  }
  function clearExpectedState() {
    return dropExpectedState();
  }

  // src/api/ynabTokens.js
  var isRefreshing = false;
  var refreshPromise = null;
  var logger2 = getLogger("YnabTokens");
  setLoggerConfig({
    namespaces: { "YnabTokens": false }
  });
  async function exchangeYnabToken(code) {
    const methodName = "exchangeYnabToken";
    logger2.group(methodName);
    try {
      const response = await fetch("/.netlify/functions/ynabTokenExchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code })
      });
      if (!response.ok) {
        const error = await response.json();
        logger2.error(methodName, "Token exchange failed:", error);
        logger2.groupEnd(methodName);
        return false;
      }
      const data2 = await response.json();
      logger2.log(methodName, "\u2705 YNAB tokens stored in HttpOnly cookies");
      return data2.success;
    } catch (error) {
      logger2.error(methodName, "Token exchange error:", error);
      return false;
    } finally {
      logger2.groupEnd(methodName);
    }
  }
  async function refreshYnabToken() {
    const methodName = "refreshYnabToken";
    logger2.group(methodName);
    if (isRefreshing) {
      logger2.debug(methodName, "Refresh already in progress, waiting for result...");
      logger2.groupEnd(methodName);
      return refreshPromise;
    }
    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const response = await fetch("/.netlify/functions/ynabTokenRefresh", {
          method: "POST",
          credentials: "include"
        });
        if (!response.ok) {
          logger2.error(methodName, "Token refresh failed - redirecting to login");
          isRefreshing = false;
          logger2.groupEnd(methodName);
          window.location.href = "/";
          return false;
        }
        const data2 = await response.json();
        logger2.log(methodName, "\u2705 YNAB tokens refreshed");
        logger2.groupEnd(methodName);
        return data2.success;
      } catch (error) {
        logger2.error(methodName, "Token refresh error:", error);
        isRefreshing = false;
        window.location.href = "/";
        logger2.groupEnd(methodName);
        return false;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();
    logger2.groupEnd(methodName);
    return refreshPromise;
  }
  async function ynabApiCall(endpoint, options = {}) {
    const methodName = "ynabApiCall";
    logger2.group(methodName, `Endpoint: ${endpoint}`);
    try {
      const url = `/.netlify/functions/ynabProxy?endpoint=${encodeURIComponent(endpoint)}`;
      let response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        }
      });
      if (response.status === 401) {
        const errorData = await response.json();
        if (errorData.error && errorData.error.includes("No access token found")) {
          logger2.warn(methodName, "No YNAB tokens found - user needs to authenticate");
          logger2.groupEnd(methodName);
          return null;
        }
        logger2.log(methodName, "Access token expired, refreshing...");
        const refreshed = await refreshYnabToken();
        if (!refreshed) {
          logger2.error(methodName, "Token refresh failed");
          logger2.groupEnd(methodName);
          return null;
        }
        response = await fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...options.headers
          }
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        logger2.error(methodName, `YNAB API error (${endpoint}):`, errorData);
        logger2.groupEnd(methodName);
        throw new Error(`YNAB API request failed: ${response.status}`);
      }
      const data2 = await response.json();
      logger2.log(methodName, "Response received");
      logger2.groupEnd(methodName);
      return data2;
    } finally {
      logger2.groupEnd(methodName);
    }
  }
  async function isYnabAuthenticated() {
    const methodName = "isYnabAuthenticated";
    logger2.group(methodName);
    try {
      const result = await ynabApiCall("/user");
      const authenticated = result !== null;
      if (authenticated) {
        logger2.log(methodName, "YNAB authenticated");
      } else {
        logger2.warn(methodName, "YNAB not authenticated");
      }
      logger2.groupEnd(methodName);
      return authenticated;
    } catch (error) {
      logger2.warn(methodName, "YNAB authentication check failed:", error.message);
      logger2.groupEnd(methodName);
      return false;
    }
  }

  // src/state.js
  var StorageManager = class {
    constructor() {
      this.monarchCredentials = {
        email: null,
        encryptedPassword: null,
        accessToken: null,
        uuid: null,
        otp: null
      };
      this.history = [];
      this.userPreferences = {};
    }
    _lsGet(key) {
      return localStorage.getItem(key);
    }
    _lsSet(key, value) {
      localStorage.setItem(key, value);
    }
    _lsRemove(key) {
      localStorage.removeItem(key);
    }
    _ssGet(key) {
      return sessionStorage.getItem(key);
    }
    _ssSet(key, value) {
      sessionStorage.setItem(key, value);
    }
    _ssRemove(key) {
      sessionStorage.removeItem(key);
    }
  };
  var State = new StorageManager();
  var state_default = State;

  // src/api/ynabApi.js
  async function redirectToYnabOauth() {
    await startYnabOauth();
  }
  async function getBudgets(includeAccounts = false) {
    const endpoint = includeAccounts ? "/budgets?include_accounts=true" : "/budgets";
    try {
      const data2 = await ynabApiCall(endpoint);
      return data2.data.budgets;
    } catch (error) {
      console.error("YNAB API call failed:", error);
      return null;
    }
  }
  async function getAccounts() {
    try {
      const response = await ynabApiCall("/budgets/default/accounts");
      if (response.error) {
        throw new Error(response.error.id, response.error.name, response.error.detail);
      }
      console.warn("getAccounts response:", response);
      const accountData = response.data.accounts;
      console.warn("getAccounts accountData:", accountData);
      const accountList = new Accounts();
      accountData.forEach((acc) => {
        const account = new Account(acc["id"]);
        account.initFromApiData(acc);
        accountList.add(account);
      });
      return accountList;
    } catch (error) {
      console.error("YNAB API call (getAccounts) failed:", error);
      throw new Error("Failed to fetch accounts from YNAB API");
    }
  }
  async function getTransactions(accountId) {
    try {
      const response = await ynabApiCall(`/budgets/default/accounts/${accountId}/transactions`);
      if (response.error) {
        throw new Error(response.error.id, response.error.name, response.error.detail);
      }
      const transactionsData = response.data.transactions;
      const transactionsList = /* @__PURE__ */ new Set();
      transactionsData.forEach((txn) => {
        const transaction = new Transaction(txn["id"]);
        transaction.initFromApiData(txn);
        transactionsList.add(transaction);
      });
      return transactionsList;
    } catch (error) {
      console.error(`YNAB API call (getTransactions) failed for account ${accountId}:`, error);
      throw new Error("Failed to fetch transactions from YNAB API");
    }
  }
  async function getAllData() {
    const accountList = await getAccounts();
    await Promise.all(accountList.accounts.map(async (account) => {
      const transactions = await getTransactions(account.id);
      console.log(`Fetched transactions for account '${account.id}':`, transactions);
      account.transactions = Array.from(transactions);
    }));
    return accountList;
  }
  async function handleOauthCallback() {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    const stateToken = queryParams.get("state");
    const storedState = getExpectedState();
    if (!stateToken || stateToken !== storedState) {
      console.error("Invalid CSRF token on OAuth callback.", { stateToken, storedState });
      clearExpectedState();
      throw new Error("Invalid CSRF token on OAuth callback.");
    }
    clearExpectedState();
    if (!code) {
      console.error("OAuth callback did not contain an authorization code.");
      throw new Error("OAuth callback did not contain an authorization code.");
    }
    const success = await exchangeYnabToken(code);
    if (!success) {
      console.error("Failed to exchange authorization code for tokens.");
      throw new Error("Failed to exchange authorization code for tokens.");
    }
    console.table(state_default);
    return "success";
  }
  var ynabApi = {
    redirectToYnabOauth,
    getBudgets,
    getAccounts,
    getTransactions,
    handleOauthCallback,
    getAllData
  };
  var ynabApi_default = ynabApi;

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
    container.className = `flex flex-col w-full max-w-full mx-auto ${className}`;
    container.innerHTML = `
    <main class="flex-1 w-full max-w-full mx-auto px-4 py-2 overflow-x-hidden">
      <div class="max-w-6xl mx-auto w-full min-w-0 flex flex-col space-y-4">
        <div id="navigationBar" class="flex items-center gap-3">
          <div id="navBackContainer" class="flex-1 min-w-0"></div>
          <div id="pageHeader" class="flex-[2] min-w-0 text-center"></div>
          <div id="navDataContainer" class="flex-1 min-w-0 flex justify-end"></div>
        </div>

        <!-- Page Content Slot -->
        <div id="pageContent" class="min-w-0 mx-auto w-full"></div>
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
    const backContainer = container.querySelector("#navBackContainer");
    const dataContainer = container.querySelector("#navDataContainer");
    const hasData = checkForStoredData();
    const dataButtonText = hasData ? "Manage your data" : "No data currently stored";
    const backHTML = showBackButton ? `
      <ui-button id="navBackBtn" data-type="text">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        ${backText}
      </ui-button>
    ` : "";
    const dataHTML = showDataButton ? `
      <ui-button id="navDataBtn" data-type="text" ${!hasData ? 'style="opacity: 0.6;"' : ""}>
        ${dataButtonText}
      </ui-button>
    ` : "";
    if (backContainer && dataContainer) {
      backContainer.innerHTML = backHTML;
      dataContainer.innerHTML = dataHTML;
    } else {
      container.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>${backHTML || ""}</div>
        <div>${dataHTML || ""}</div>
      </div>
    `;
    }
    if (showBackButton) {
      const backBtn = document.getElementById("navBackBtn");
      backBtn?.addEventListener("click", () => {
        goBack();
      });
    }
    if (showDataButton) {
      const dataBtn = document.getElementById("navDataBtn");
      dataBtn?.addEventListener("click", () => {
        navigate("/data-management");
      });
    }
  }
  function checkForStoredData() {
    const hasStateAccounts = state_default.accounts && state_default.accounts.length() > 0;
    const hasMonarchAccounts = state_default.monarchAccounts !== null;
    const hasMonarchEmail = !!sessionStorage.getItem("monarch_email");
    const hasMonarchToken = !!sessionStorage.getItem("monarch_token");
    return hasStateAccounts || hasMonarchAccounts || hasMonarchEmail || hasMonarchToken;
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
    <section class="text-center ${className}">
      <h2 class="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
        ${escapeHtml(title)}
      </h2>
      <p class="text-gray-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
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

  // src/views/Upload/upload.js
  async function initUploadView() {
    const isYnabTokenValid = await hasYnabAccess();
    renderLayout();
    setupYnabContinueButton(isYnabTokenValid);
    setupYnabConnectButton(isYnabTokenValid);
  }
  async function hasYnabAccess() {
    try {
      return await isYnabAuthenticated();
    } catch (error) {
      console.warn("Error checking YNAB authentication:", error);
      return false;
    }
  }
  function renderLayout() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Step 1: Import YNAB Data",
        description: "Start by bringing over your YNAB data. Next, you'll review the data, filter and edit as needed.",
        containerId: "pageHeader"
      }
    });
  }
  function setupYnabContinueButton(isYnabTokenValid) {
    const continueWithYnabBtn = document.getElementById("continueWithYnabBtn");
    const oauthError = document.getElementById("oauthError");
    continueWithYnabBtn.hidden = !isYnabTokenValid;
    document.getElementById("automaticUploadDivider").hidden = !isYnabTokenValid;
    continueWithYnabBtn?.addEventListener("click", async (event) => {
      event.preventDefault();
      oauthError.hide();
      LoadingOverlay_default.show("Fetching accounts...");
      try {
        const accounts = await uploadController.fetchYnabAccountsAndTransactions();
        if (!accounts || Object.keys(accounts).length === 0) {
          LoadingOverlay_default.hide();
          oauthError.show("No accounts found in your YNAB profile.", "Make sure you have at least one account in your YNAB budget, then try again.");
          return;
        }
        Accounts.init(accounts);
        navigate("/review", false, true);
      } catch (error) {
        console.error("Error fetching YNAB accounts:", error);
        LoadingOverlay_default.hide();
        oauthError.show("Could not fetch accounts from YNAB.", "Your session may have expired. Try connecting to YNAB again below.");
      }
    });
  }
  function setupYnabConnectButton(isYnabTokenValid) {
    const connectYnabBtn = document.getElementById("connectYnabBtn");
    const oauthError = document.getElementById("oauthError");
    connectYnabBtn.textContent = isYnabTokenValid ? "Connect new YNAB Profile" : "Connect to YNAB";
    connectYnabBtn.setAttribute("data-color", isYnabTokenValid ? "white" : "purple");
    connectYnabBtn.applyStyles();
    connectYnabBtn?.addEventListener("click", async (event) => {
      event.preventDefault();
      oauthError.hide();
      try {
        await redirectToYnabOauth();
      } catch (error) {
        console.error("Error initiating YNAB OAuth:", error);
        oauthError.show("Could not connect to YNAB.", "Please check your internet connection and try again.");
      }
    });
  }

  // src/views/Upload/upload.html
  var upload_default = `<div id="pageLayout"></div>

<!-- Upload Options -->
<section class="w-full">
  <div class="flex flex-col md:flex-row justify-center gap-4 sm:gap-6 md:gap-8 w-full">

    <!-- Automatic Upload -->
    <ui-card id="automaticUploadCard" data-color="purple" data-width="full">
      
      <!-- Error message for OAuth errors -->
      <error-message id="oauthError" data-severity="error" style="margin-bottom: 1rem;"></error-message>
      <svg slot="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
        <path d="M10 17l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M14 7h6" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M14 17h6" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <p slot="eyebrow">Automatic</p>
      <h3 slot="title">Connect to YNAB</h3>
      <p slot="description">
        Automatically import your YNAB data via secure OAuth connection.
      </p>

      <span slot="actions">
        <ui-button id="continueWithYnabBtn" data-type="solid" data-size="large" data-color="purple" data-fullwidth>
          Continue with Active Profile
        </ui-button>

        <ui-divider id="automaticUploadDivider" data-color="purple-400">OR</ui-divider>

        <ui-button id="connectYnabBtn" data-type="solid" data-size="large" data-color="white" data-fullwidth>
          Connect to YNAB
        </ui-button>
      </span>

      <span slot="action-info">
        <!-- OAuth Info Modal -->
        <ui-modal id="oauthInfoModal">
          <ui-button slot="trigger" data-type="text">
            How does this work?
          </ui-button>

          <h3 slot="title">How does connecting my YNAB account work?</h3>

          <div slot="content">
            <div class="space-y-4 text-sm text-gray-600">
              <div>
                <h4 class="text-gray-900 text-sm font-semibold mb-1">1: Securely Connect</h4>
                <p class="text-gray-600 text-sm">Using YNAB's official authentication process, securely connect your
                  account.</p>
              </div>
              <div>
                <h4 class="text-gray-900 text-sm font-semibold mb-1">2: Grant Permissions</h4>
                <p class="text-gray-600 text-sm">We'll prompt you to authorize access to your YNAB data and thoroughly
                  explain every permission and how it is used.</p>
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
        </ui-modal>
      </span>
    </ui-card>
  </div>
</section>`;

  // src/utils/format.js
  var currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // public/static-data/monarchAccountTypes.json
  var generatedAt = "2025-06-02T06:26:29.704Z";
  var generatedBy = "tools/fetchMonarchAccountTypes.js";
  var data = [
    {
      group: "asset",
      typeDisplay: "Cash",
      typeName: "depository",
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

  // src/utils/filters.js
  var Filters = class {
    constructor() {
      this.pendingFilters = new FilterCriteria();
      this.activeFilters = new FilterCriteria();
      this.searchQuery = "";
    }
    clearPendingFilters() {
      this.pendingFilters.clear();
    }
    clearActiveFilters() {
      this.activeFilters.clear();
    }
    applyPendingToActive() {
      this.activeFilters = Object.assign(new FilterCriteria(), this.pendingFilters);
    }
    getNumberOfActiveFilters() {
      let count = 0;
      if (this.activeFilters.accountName)
        count++;
      if (this.activeFilters.types.size > 0)
        count++;
      if (this.activeFilters.subtypes.size > 0)
        count++;
      if (this.activeFilters.transactionsMin !== null)
        count++;
      if (this.activeFilters.transactionsMax !== null)
        count++;
      if (this.activeFilters.balanceMin !== null)
        count++;
      if (this.activeFilters.balanceMax !== null)
        count++;
      if (this.activeFilters.inclusion !== "all")
        count++;
      return count;
    }
    hasPendingChanges() {
      return this.accountNameHasPendingChange() || this.typesHavePendingChange() || this.subtypesHavePendingChange() || this.transactionMinHasPendingChange() || this.transactionMaxHasPendingChange() || this.balanceMinHasPendingChange() || this.balanceMaxHasPendingChange() || this.inclusionHasPendingChange();
    }
    passesFilters(account) {
      if (this.activeFilters.accountName) {
        const accountName = this.activeFilters.nameCaseSensitive ? account.current.name : account.current.name.toLowerCase();
        const filterName = this.activeFilters.nameCaseSensitive ? this.activeFilters.accountName : this.activeFilters.accountName.toLowerCase();
        if (this.activeFilters.nameMatchType === "exact") {
          if (accountName !== filterName)
            return false;
        } else {
          if (!accountName.includes(filterName))
            return false;
        }
      }
      if (this.activeFilters.types.size > 0) {
        const accountType = getAccountTypeByName(account.current.type);
        const typeDisplay = accountType ? accountType.typeDisplay : account.current.type || "";
        if (!this.activeFilters.types.has(typeDisplay))
          return false;
      }
      if (this.activeFilters.subtypes.size > 0) {
        const accountSubtype = getSubtypeByName(account.current.type, account.current.subtype);
        const subtypeDisplay = accountSubtype ? accountSubtype.display : account.current.subtype || "";
        if (!this.activeFilters.subtypes.has(subtypeDisplay))
          return false;
      }
      const transactionCount = account.transactionCount || 0;
      if (this.activeFilters.transactionsMin !== null && transactionCount < this.activeFilters.transactionsMin)
        return false;
      if (this.activeFilters.transactionsMax !== null && transactionCount > this.activeFilters.transactionsMax)
        return false;
      const balance = parseFloat(account.balance) || 0;
      if (this.activeFilters.balanceMin !== null && balance < this.activeFilters.balanceMin)
        return false;
      if (this.activeFilters.balanceMax !== null && balance > this.activeFilters.balanceMax)
        return false;
      if (this.activeFilters.inclusion === "included" && !account.included)
        return false;
      if (this.activeFilters.inclusion === "excluded" && account.included)
        return false;
      return true;
    }
    accountNameHasPendingChange() {
      return this.activeFilters.accountName !== this.pendingFilters.accountName || this.activeFilters.nameMatchType !== this.pendingFilters.nameMatchType || this.activeFilters.nameCaseSensitive !== this.pendingFilters.nameCaseSensitive;
    }
    transactionMinHasPendingChange() {
      return this.activeFilters.transactionsMin !== this.pendingFilters.transactionsMin;
    }
    transactionMaxHasPendingChange() {
      return this.activeFilters.transactionsMax !== this.pendingFilters.transactionsMax;
    }
    balanceMinHasPendingChange() {
      return this.activeFilters.balanceMin !== this.pendingFilters.balanceMin;
    }
    balanceMaxHasPendingChange() {
      return this.activeFilters.balanceMax !== this.pendingFilters.balanceMax;
    }
    typesHavePendingChange() {
      const af = this.activeFilters;
      const pf = this.pendingFilters;
      if (af.types.size !== pf.types.size)
        return true;
      return ![...pf.types].every((t) => af.types.has(t));
    }
    subtypesHavePendingChange() {
      const af = this.activeFilters;
      const pf = this.pendingFilters;
      if (af.subtypes.size !== pf.subtypes.size)
        return true;
      return ![...pf.subtypes].every((s) => af.subtypes.has(s));
    }
    inclusionHasPendingChange() {
      return this.activeFilters.inclusion !== this.pendingFilters.inclusion;
    }
    setSearchQuery(str) {
      this.searchQuery = str.toLowerCase();
    }
  };
  var FilterCriteria = class {
    constructor() {
      this.accountName = "";
      this.nameMatchType = "contains";
      this.nameCaseSensitive = false;
      this.types = /* @__PURE__ */ new Set();
      this.subtypes = /* @__PURE__ */ new Set();
      this.transactionsMin = null;
      this.transactionsMax = null;
      this.balanceMin = null;
      this.balanceMax = null;
      this.inclusion = "all";
    }
    clear() {
      this.accountName = "";
      this.nameMatchType = "contains";
      this.nameCaseSensitive = false;
      this.types.clear();
      this.subtypes.clear();
      this.transactionsMin = null;
      this.transactionsMax = null;
      this.balanceMin = null;
      this.balanceMax = null;
      this.inclusion = "all";
    }
  };

  // src/views/AccountReview/modals/FiltersModal.js
  var FiltersModal = class {
    constructor(filters, onApply, onReset) {
      this.filters = filters;
      this.onApply = onApply;
      this.onReset = onReset;
      this.modal = null;
    }
    open() {
      this.modal = document.getElementById("filtersModal");
      this.modal.open();
      setTimeout(() => {
        this._setupEventListeners();
        this._populateFilters();
        this._updatePendingFilterStyles();
      }, 10);
    }
    _setupEventListeners() {
      const modalOverlay = this.modal._modalOverlay;
      const resetBtn = modalOverlay.querySelector("#filtersResetBtn");
      const applyBtn = modalOverlay.querySelector("#filtersApplyBtn");
      resetBtn.onclick = () => this._handleReset();
      applyBtn.onclick = () => this._handleApply();
      const filterAccountName = modalOverlay.querySelector("#filterAccountName");
      const clearAccountNameBtn = modalOverlay.querySelector("#clearAccountNameBtn");
      filterAccountName.addEventListener("input", () => {
        this.filters.pendingFilters.accountName = filterAccountName.value;
        clearAccountNameBtn.classList.toggle("hidden", !filterAccountName.value.trim());
        this._updatePendingFilterStyles();
      });
      clearAccountNameBtn.addEventListener("click", () => {
        filterAccountName.value = "";
        filterAccountName.dispatchEvent(new Event("input"));
      });
      const nameMatchTypeRadios = modalOverlay.querySelectorAll('input[name="nameMatchType"]');
      nameMatchTypeRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
          this.filters.pendingFilters.nameMatchType = radio.value;
          this._updatePendingFilterStyles();
        });
      });
      const nameCaseSensitive = modalOverlay.querySelector("#nameCaseSensitive");
      nameCaseSensitive.addEventListener("change", () => {
        this.filters.pendingFilters.nameCaseSensitive = nameCaseSensitive.checked;
        this._updatePendingFilterStyles();
      });
      const typeSelectAllBtn = modalOverlay.querySelector("#accountTypeSelectAllBtn");
      const typeDeselectAllBtn = modalOverlay.querySelector("#accountTypeDeselectAllBtn");
      typeSelectAllBtn.onclick = () => this._selectAllTypes(modalOverlay);
      typeDeselectAllBtn.onclick = () => this._deselectAllTypes(modalOverlay);
      const subtypeSelectAllBtn = modalOverlay.querySelector("#accountSubtypeSelectAllBtn");
      const subtypeDeselectAllBtn = modalOverlay.querySelector("#accountSubtypeDeselectAllBtn");
      subtypeSelectAllBtn.onclick = () => this._selectAllSubtypes(modalOverlay);
      subtypeDeselectAllBtn.onclick = () => this._deselectAllSubtypes(modalOverlay);
      modalOverlay.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach((cb) => {
        cb.addEventListener("change", () => {
          if (cb.checked) {
            this.filters.pendingFilters.types.add(cb.value);
          } else {
            this.filters.pendingFilters.types.delete(cb.value);
          }
          this._updatePendingFilterStyles();
        });
      });
      modalOverlay.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach((cb) => {
        cb.addEventListener("change", () => {
          if (cb.checked) {
            this.filters.pendingFilters.subtypes.add(cb.value);
          } else {
            this.filters.pendingFilters.subtypes.delete(cb.value);
          }
          this._updatePendingFilterStyles();
        });
      });
      const filterTransactionsMin = modalOverlay.querySelector("#filterTransactionsMin");
      const filterTransactionsMax = modalOverlay.querySelector("#filterTransactionsMax");
      filterTransactionsMin.addEventListener("input", () => {
        this.filters.pendingFilters.transactionsMin = filterTransactionsMin.value ? parseInt(filterTransactionsMin.value, 10) : null;
        this._updatePendingFilterStyles();
      });
      filterTransactionsMax.addEventListener("input", () => {
        this.filters.pendingFilters.transactionsMax = filterTransactionsMax.value ? parseInt(filterTransactionsMax.value, 10) : null;
        this._updatePendingFilterStyles();
      });
      const filterBalanceMin = modalOverlay.querySelector("#filterBalanceMin");
      const filterBalanceMax = modalOverlay.querySelector("#filterBalanceMax");
      filterBalanceMin.addEventListener("input", () => {
        this.filters.pendingFilters.balanceMin = filterBalanceMin.value ? parseFloat(filterBalanceMin.value) : null;
        this._updatePendingFilterStyles();
      });
      filterBalanceMax.addEventListener("input", () => {
        this.filters.pendingFilters.balanceMax = filterBalanceMax.value ? parseFloat(filterBalanceMax.value) : null;
        this._updatePendingFilterStyles();
      });
      const inclusionRadios = modalOverlay.querySelectorAll('input[name="inclusionFilter"]');
      inclusionRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
          this.filters.pendingFilters.inclusion = radio.value;
          this._updatePendingFilterStyles();
        });
      });
    }
    _populateFilters() {
      const modalOverlay = this.modal._modalOverlay;
      const filterAccountName = modalOverlay.querySelector("#filterAccountName");
      filterAccountName.value = this.filters.activeFilters.accountName;
      const containsRadio = modalOverlay.querySelector('input[name="nameMatchType"][value="contains"]');
      const exactRadio = modalOverlay.querySelector('input[name="nameMatchType"][value="exact"]');
      containsRadio.checked = this.filters.activeFilters.nameMatchType === "contains";
      exactRadio.checked = this.filters.activeFilters.nameMatchType === "exact";
      const nameCaseSensitive = modalOverlay.querySelector("#nameCaseSensitive");
      nameCaseSensitive.checked = this.filters.activeFilters.nameCaseSensitive;
      const isEmpty = !this.filters.activeFilters.accountName.trim();
      const nameMatchTypeRadios = modalOverlay.querySelectorAll('input[name="nameMatchType"]');
      nameMatchTypeRadios.forEach((radio) => radio.disabled = isEmpty);
      nameCaseSensitive.disabled = isEmpty;
      this._populateTypeFilters(modalOverlay);
      this._populateSubtypeFilters(modalOverlay);
      const filterTransactionsMin = modalOverlay.querySelector("#filterTransactionsMin");
      filterTransactionsMin.value = this.filters.activeFilters.transactionsMin || "";
      const filterTransactionsMax = modalOverlay.querySelector("#filterTransactionsMax");
      filterTransactionsMax.value = this.filters.activeFilters.transactionsMax || "";
      const filterBalanceMin = modalOverlay.querySelector("#filterBalanceMin");
      filterBalanceMin.value = this.filters.activeFilters.balanceMin || "";
      const filterBalanceMax = modalOverlay.querySelector("#filterBalanceMax");
      filterBalanceMax.value = this.filters.activeFilters.balanceMax || "";
      const inclusionRadios = modalOverlay.querySelectorAll('input[name="inclusionFilter"]');
      inclusionRadios.forEach((radio) => {
        radio.checked = radio.value === this.filters.activeFilters.inclusion;
      });
    }
    _populateTypeFilters(modalOverlay) {
      const container = modalOverlay.querySelector("#typeFiltersContainer");
      const types = [...new Set(monarchAccountTypes_default.data.map((type) => type.typeDisplay))].sort();
      container.innerHTML = "";
      types.forEach((type) => {
        const isChecked = this.filters.activeFilters.types.has(type);
        const checkbox = this._createFilterCheckbox("type", type, type, isChecked);
        container.appendChild(checkbox);
      });
    }
    _populateSubtypeFilters(modalOverlay) {
      const container = modalOverlay.querySelector("#subtypeFiltersContainer");
      const subtypes = /* @__PURE__ */ new Set();
      monarchAccountTypes_default.data.forEach((type) => {
        type.subtypes.forEach((subtype) => subtypes.add(subtype.display));
      });
      const sortedSubtypes = [...subtypes].sort();
      container.innerHTML = "";
      sortedSubtypes.forEach((subtype) => {
        const isChecked = this.filters.activeFilters.subtypes.has(subtype);
        const checkbox = this._createFilterCheckbox("subtype", subtype, subtype, isChecked);
        container.appendChild(checkbox);
      });
    }
    _createFilterCheckbox(filterType, value, label, isChecked = false) {
      const div = document.createElement("div");
      div.className = "flex items-center";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `filter-${filterType}-${value.replace(/\s+/g, "-")}`;
      checkbox.value = value;
      checkbox.className = "w-4 h-4 border-gray-300 rounded";
      checkbox.style.accentColor = "#111827";
      checkbox.checked = isChecked;
      const labelEl = document.createElement("label");
      labelEl.htmlFor = checkbox.id;
      labelEl.className = "ml-2 text-sm text-gray-700 cursor-pointer";
      labelEl.textContent = label;
      div.appendChild(checkbox);
      div.appendChild(labelEl);
      return div;
    }
    _selectAllTypes(modalOverlay) {
      modalOverlay.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach((cb) => {
        cb.checked = true;
        this.filters.pendingFilters.types.add(cb.value);
      });
      this._updatePendingFilterStyles();
    }
    _deselectAllTypes(modalOverlay) {
      modalOverlay.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach((cb) => {
        cb.checked = false;
        this.filters.pendingFilters.types.delete(cb.value);
      });
      this._updatePendingFilterStyles();
    }
    _selectAllSubtypes(modalOverlay) {
      modalOverlay.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach((cb) => {
        cb.checked = true;
        this.filters.pendingFilters.subtypes.add(cb.value);
      });
      this._updatePendingFilterStyles();
    }
    _deselectAllSubtypes(modalOverlay) {
      modalOverlay.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach((cb) => {
        cb.checked = false;
        this.filters.pendingFilters.subtypes.delete(cb.value);
      });
      this._updatePendingFilterStyles();
    }
    _updatePendingFilterStyles() {
      const modalOverlay = this.modal._modalOverlay;
      const filterAccountName = modalOverlay.querySelector("#filterAccountName");
      filterAccountName.classList.toggle("filter-modified", this.filters.accountNameHasPendingChange());
      const transMin = modalOverlay.querySelector("#filterTransactionsMin");
      transMin.classList.toggle("filter-modified", this.filters.transactionMinHasPendingChange());
      const transMax = modalOverlay.querySelector("#filterTransactionsMax");
      transMax.classList.toggle("filter-modified", this.filters.transactionMaxHasPendingChange());
      const balMin = modalOverlay.querySelector("#filterBalanceMin");
      balMin.classList.toggle("filter-modified", this.filters.balanceMinHasPendingChange());
      const balMax = modalOverlay.querySelector("#filterBalanceMax");
      balMax.classList.toggle("filter-modified", this.filters.balanceMaxHasPendingChange());
      const typeContainer = modalOverlay.querySelector("#typeFiltersContainer").parentElement;
      typeContainer.classList.toggle("filter-modified", this.filters.typesHavePendingChange());
      const subtypeContainer = modalOverlay.querySelector("#subtypeFiltersContainer").parentElement;
      subtypeContainer.classList.toggle("filter-modified", this.filters.subtypesHavePendingChange());
      const resetBtn = modalOverlay.querySelector("#filtersResetBtn");
      resetBtn.disabled = !this.filters.hasPendingChanges();
    }
    _handleApply() {
      this.filters.applyPendingToActive();
      this.modal.close();
      if (this.onApply)
        this.onApply();
    }
    _handleReset() {
      this.filters.clearPendingFilters();
      this._populateFilters();
      this._updatePendingFilterStyles();
      if (this.onReset)
        this.onReset();
    }
  };

  // src/views/AccountReview/modals/BulkRenameModal.js
  var BulkRenameModal = class {
    constructor(accounts, onApply) {
      this.accounts = accounts;
      this.onApply = onApply;
      this.modal = null;
    }
    open() {
      this.modal = document.getElementById("bulkRenameModal");
      this.modal.open();
      setTimeout(() => {
        this._setupEventListeners();
        this._updatePreview();
      }, 300);
    }
    _setupEventListeners() {
      const modalOverlay = this.modal._modalOverlay;
      const renamePattern = modalOverlay.querySelector("#renamePattern");
      const indexStartInput = modalOverlay.querySelector("#indexStart");
      const cancelBtn = modalOverlay.querySelector("#renameCancel");
      const applyBtn = modalOverlay.querySelector("#renameApply");
      const tokenButtons = modalOverlay.querySelectorAll(".token-btn");
      tokenButtons.forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const token = btn.dataset.token;
          const cursorPos = renamePattern.selectionStart;
          const before = renamePattern.value.substring(0, cursorPos);
          const after = renamePattern.value.substring(renamePattern.selectionEnd);
          renamePattern.value = before + token + after;
          renamePattern.selectionStart = renamePattern.selectionEnd = cursorPos + token.length;
          renamePattern.focus();
          this._updatePreview();
        };
      });
      renamePattern.oninput = () => this._updatePreview();
      indexStartInput.oninput = () => this._updatePreview();
      cancelBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.modal.close();
      };
      applyBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._handleApply(modalOverlay);
      };
      renamePattern.focus();
    }
    _updatePreview() {
      const modalOverlay = this.modal._modalOverlay;
      const preview = modalOverlay.querySelector("#renamePreview");
      const patternInput = modalOverlay.querySelector("#renamePattern");
      const indexInput = modalOverlay.querySelector("#indexStart");
      preview.innerHTML = "";
      const pattern = patternInput.value;
      const indexStart = parseInt(indexInput.value, 10) || 1;
      const selectedAccounts = this.accounts.getSelected();
      selectedAccounts.slice(0, 3).forEach((acc, i) => {
        const previewName = this._applyPattern(pattern, acc, indexStart + i);
        const div = document.createElement("div");
        div.className = "p-2 bg-gray-50 rounded text-sm text-gray-700 border border-gray-200";
        div.textContent = previewName || "(empty)";
        preview.appendChild(div);
      });
      if (selectedAccounts.length > 3) {
        const div = document.createElement("div");
        div.className = "p-2 text-xs text-gray-500 italic";
        div.textContent = `...and ${selectedAccounts.length - 3} more`;
        preview.appendChild(div);
      }
    }
    _applyPattern(pattern, account, index) {
      const today = new Date().toISOString().split("T")[0];
      return pattern.replace(/{{YNAB}}/g, account.originalYnabName?.trim() || account.current.name || "Account").replace(/{{Index}}/g, index).replace(/{{Upper}}/g, (account.originalYnabName?.trim() || account.current.name || "Account").toUpperCase()).replace(/{{Date}}/g, today);
    }
    _handleApply(modalOverlay) {
      const patternInput = modalOverlay.querySelector("#renamePattern");
      const indexStartInput = modalOverlay.querySelector("#indexStart");
      const pattern = patternInput.value;
      const indexStart = parseInt(indexStartInput.value, 10) || 1;
      this.accounts.bulkRename(pattern, indexStart);
      this.modal.close();
      if (this.onApply)
        this.onApply();
    }
  };

  // src/views/AccountReview/modals/BulkTypeModal.js
  var BulkTypeModal = class {
    constructor(accounts, onApply) {
      this.accounts = accounts;
      this.onApply = onApply;
      this.modal = null;
    }
    open() {
      this.modal = document.getElementById("bulkTypeModal");
      this.modal.open();
      setTimeout(() => {
        this._setupEventListeners();
        this._populateTypeDropdown();
        this._updateSubtypeOptions();
      }, 300);
    }
    _setupEventListeners() {
      const modalOverlay = this.modal._modalOverlay;
      const typeSelect = modalOverlay.querySelector("#bulkTypeSelect");
      const cancelBtn = modalOverlay.querySelector("#bulkTypeCancel");
      const applyBtn = modalOverlay.querySelector("#bulkTypeApply");
      typeSelect.onchange = () => this._updateSubtypeOptions();
      cancelBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.modal.close();
      };
      applyBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._handleApply(modalOverlay);
      };
    }
    _populateTypeDropdown() {
      const modalOverlay = this.modal._modalOverlay;
      const typeSelect = modalOverlay.querySelector("#bulkTypeSelect");
      typeSelect.innerHTML = "";
      monarchAccountTypes_default.data.forEach((type) => {
        const opt = document.createElement("option");
        opt.value = type.typeName;
        opt.textContent = type.typeDisplay;
        typeSelect.appendChild(opt);
      });
    }
    _updateSubtypeOptions() {
      const modalOverlay = this.modal._modalOverlay;
      const typeSelect = modalOverlay.querySelector("#bulkTypeSelect");
      const subtypeSelect = modalOverlay.querySelector("#bulkSubtypeSelect");
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
        opt.textContent = "(No subtypes available)";
        opt.disabled = true;
        opt.selected = true;
        subtypeSelect.appendChild(opt);
      }
    }
    _handleApply(modalOverlay) {
      const typeSelect = modalOverlay.querySelector("#bulkTypeSelect");
      const subtypeSelect = modalOverlay.querySelector("#bulkSubtypeSelect");
      const typeValue = typeSelect.value;
      const subtypeValue = subtypeSelect.value;
      this.accounts.bulkEditType(typeValue, subtypeValue);
      this.modal.close();
      if (this.onApply)
        this.onApply();
    }
  };

  // src/views/AccountReview/modals/NameEditorModal.js
  var NameEditorModal = class {
    constructor(account, onSave) {
      this.account = account;
      this.onSave = onSave;
      this.overlay = null;
      this.input = null;
    }
    open() {
      this._createDOM();
      this._setupEventListeners();
      this._show();
      this.input.focus();
      this.input.select();
    }
    _createDOM() {
      this.overlay = document.createElement("div");
      this.overlay.className = "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 opacity-0 transition-opacity duration-200";
      document.body.appendChild(this.overlay);
      const popup = document.createElement("div");
      popup.className = "bg-white rounded-lg shadow-lg p-5 w-[400px]";
      const title = document.createElement("h2");
      title.className = "font-bold mb-3 text-lg";
      title.textContent = "Edit Account Name";
      popup.appendChild(title);
      this.input = document.createElement("input");
      this.input.type = "text";
      this.input.value = this.account.current.name;
      this.input.setAttribute("aria-label", "Account name input");
      this.input.className = "border rounded w-full px-3 py-2 mb-4";
      popup.appendChild(this.input);
      const buttonRow = document.createElement("div");
      buttonRow.className = "flex justify-end gap-2";
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "bg-gray-300 px-4 py-2 rounded";
      cancelBtn.addEventListener("click", () => this.close());
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.className = "bg-blue-500 text-white px-4 py-2 rounded font-bold";
      saveBtn.addEventListener("click", () => this._handleSave());
      buttonRow.appendChild(cancelBtn);
      buttonRow.appendChild(saveBtn);
      popup.appendChild(buttonRow);
      this.overlay.appendChild(popup);
    }
    _setupEventListeners() {
      this.overlay.addEventListener("keydown", (e) => {
        if (e.key === "Escape")
          this.close();
        if (e.key === "Enter")
          this._handleSave();
      });
    }
    _show() {
      requestAnimationFrame(() => this.overlay.classList.add("opacity-100"));
    }
    _handleSave() {
      this.account.setName(this.input.value);
      if (this.onSave)
        this.onSave(this.account);
      this.close();
    }
    close() {
      this.overlay.classList.remove("opacity-100");
      this.overlay.classList.add("opacity-0");
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          document.body.removeChild(this.overlay);
        }
      }, 200);
    }
  };

  // src/views/AccountReview/controllers/AccountReviewController.js
  var logger3 = getLogger("AccountReviewController");
  setLoggerConfig({
    namespaces: { AccountReviewController: true },
    methods: {},
    levels: { debug: true, group: true, groupEnd: true }
  });
  var AccountReviewController = class {
    constructor() {
      this.filters = new Filters();
      this.accounts = new Accounts();
      this.accountsTable = null;
      this.importBtn = null;
      this.searchInput = null;
      this.bulkActionBar = null;
      this.filtersModal = null;
      this.bulkRenameModal = null;
      this.bulkTypeModal = null;
    }
    async init() {
      const methodName = "init";
      logger3.group(methodName, "Initializing AccountReviewController");
      await this.accounts.loadFromDb();
      this._renderLayout();
      this._cacheElements();
      this._setupTableColumns();
      this._initializeModals();
      this._setupEventListeners();
      this._renderTable();
      logger3.groupEnd(methodName);
    }
    _renderLayout() {
      logger3.group("_renderLayout", "AccountReviewController._renderLayout()");
      try {
        logger3.log("_renderLayout", "Rendering page layout for Account Review");
        renderPageLayout({
          navbar: {
            showBackButton: true,
            showDataButton: true
          },
          header: {
            title: "Step 2: Review Accounts",
            description: "Review and adjust your accounts. Next, we'll choose how to migrate to Monarch.",
            containerId: "pageHeader"
          }
        });
        logger3.log("_renderLayout", "Page layout rendered successfully");
      } catch (error) {
        logger3.error("_renderLayout", "Error rendering layout:", error);
      } finally {
        logger3.groupEnd("_renderLayout");
      }
    }
    _cacheElements() {
      logger3.group("_cacheElements", "AccountReviewController._cacheElements()");
      try {
        this.accountsTable = document.getElementById("accountsTable");
        this.importBtn = document.getElementById("continueBtn");
        this.searchInput = document.getElementById("searchInput");
        this.bulkActionBar = document.getElementById("bulkActionBar");
        logger3.debug("_cacheElements", `Cached elements: accountsTable=${!!this.accountsTable}, importBtn=${!!this.importBtn}, searchInput=${!!this.searchInput}, bulkActionBar=${!!this.bulkActionBar}`);
        logger3.log("_cacheElements", "DOM elements cached successfully");
      } catch (error) {
        logger3.error("_cacheElements", "Error caching DOM elements:", error);
      } finally {
        logger3.groupEnd("_cacheElements");
      }
    }
    _initializeModals() {
      logger3.group("_initializeModals", "AccountReviewController._initializeModals()");
      try {
        logger3.log("_initializeModals", "Initializing modal instances");
        this.filtersModal = new FiltersModal(this.filters, () => this._onFiltersApplied(), () => this._onFiltersReset());
        logger3.debug("_initializeModals", "FiltersModal initialized");
        this.bulkRenameModal = new BulkRenameModal(this.accounts, () => this._renderTable());
        logger3.debug("_initializeModals", "BulkRenameModal initialized");
        this.bulkTypeModal = new BulkTypeModal(this.accounts, () => this._renderTable());
        logger3.debug("_initializeModals", "BulkTypeModal initialized");
        logger3.log("_initializeModals", "All modals initialized successfully");
      } catch (error) {
        logger3.error("_initializeModals", "Error initializing modals:", error);
      } finally {
        logger3.groupEnd("_initializeModals");
      }
    }
    _setupEventListeners() {
      logger3.group("_setupEventListeners", "Setting up event listeners");
      let debounceTimer;
      this.searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.filters.searchQuery = this.searchInput.value.toLowerCase();
          this._renderTable();
        }, 200);
      });
      setTimeout(() => {
        document.getElementById("filtersBtn")?.addEventListener("click", (e) => {
          e.preventDefault();
          this.filtersModal.open();
        });
      }, 100);
      this._setupBulkActionListeners();
      this.accountsTable.addEventListener("selectionchange", (e) => this._handleTableSelectionChange(e));
      this.importBtn.addEventListener("click", () => navigate("/method"));
      this._setupUndoListeners();
      setTimeout(async () => {
        this._updateFilterDisplay();
        const totalAccounts = this.accounts.length();
        this._updateAccountCountDisplay(totalAccounts, totalAccounts);
      }, 100);
      logger3.groupEnd("_setupEventListeners");
    }
    _setupBulkActionListeners() {
      logger3.group("_setupBulkActionListeners", "AccountReviewController._setupBulkActionListeners()");
      try {
        const buttonConfigs = [
          { selectors: ["#unselectAllBtnMobile", "#unselectAllBtnDesktop"], handler: () => this._updateAccountSelection(false), name: "Unselect All" },
          { selectors: ["#bulkIncludeBtnMobile", "#bulkIncludeBtnDesktop"], handler: () => this._updateInclusion(true), name: "Bulk Include" },
          { selectors: ["#bulkExcludeBtnMobile", "#bulkExcludeBtnDesktop"], handler: () => this._updateInclusion(false), name: "Bulk Exclude" },
          { selectors: ["#bulkRenameBtnMobile", "#bulkRenameBtnDesktop"], handler: () => this.bulkRenameModal.open(), name: "Bulk Rename" },
          { selectors: ["#bulkTypeBtnMobile", "#bulkTypeBtnDesktop"], handler: () => this.bulkTypeModal.open(), name: "Bulk Type" }
        ];
        buttonConfigs.forEach((config) => {
          config.selectors.forEach((selector) => {
            const btn = document.getElementById(selector.slice(1));
            if (btn) {
              btn.addEventListener("click", config.handler);
              logger3.debug("_setupBulkActionListeners", `Event listener attached to ${selector}`);
            }
          });
        });
        logger3.log("_setupBulkActionListeners", "All bulk action listeners set up successfully");
      } catch (error) {
        logger3.error("_setupBulkActionListeners", "Error setting up bulk action listeners:", error);
      } finally {
        logger3.groupEnd("_setupBulkActionListeners");
      }
    }
    _setupUndoListeners() {
      logger3.group("_setupUndoListeners", "AccountReviewController._setupUndoListeners()");
      try {
        const undoAllBtn = document.getElementById("undoAllBtn");
        if (undoAllBtn) {
          undoAllBtn.addEventListener("click", () => {
            logger3.log("_setupUndoListeners", "Undo all button clicked");
            if (confirm("Are you sure you want to undo all changes? This action cannot be reversed.")) {
              logger3.debug("_setupUndoListeners", "User confirmed undo all changes");
              this._undoAllChanges();
            } else {
              logger3.debug("_setupUndoListeners", "User cancelled undo all changes");
            }
          });
          logger3.debug("_setupUndoListeners", "Undo all button listener attached");
        }
        this.accountsTable.addEventListener("click", (e) => {
          const undoBtn = e.target.closest("[data-undo-button]");
          if (undoBtn) {
            logger3.debug("_setupUndoListeners", `Undo button clicked for row ${undoBtn.dataset.rowId}`);
            this._undoRowChanges(undoBtn.dataset.rowId);
          }
        });
        logger3.log("_setupUndoListeners", "Undo listeners set up successfully");
      } catch (error) {
        logger3.error("_setupUndoListeners", "Error setting up undo listeners:", error);
      } finally {
        logger3.groupEnd("_setupUndoListeners");
      }
    }
    _handleTableSelectionChange(e) {
      logger3.group("_handleTableSelectionChange", "AccountReviewController._handleTableSelectionChange()", { detail: e.detail });
      try {
        const selectedCount = e.detail.count;
        logger3.log("_handleTableSelectionChange", `Selection changed: ${selectedCount} account(s) selected`);
        document.getElementById("selectedCountMobile").textContent = selectedCount;
        document.getElementById("selectCountMobileLabel").textContent = selectedCount === 1 ? "Account" : "Accounts";
        document.getElementById("selectedCountDesktop").textContent = selectedCount;
        document.getElementById("selectCountDesktopLabel").textContent = selectedCount === 1 ? "Account" : "Accounts";
        logger3.debug("_handleTableSelectionChange", "Selection count displays updated");
        this.accounts.forEach((acc) => {
          acc.selected = e.detail.selectedRows.some((row) => row.id === acc.id);
        });
        logger3.debug("_handleTableSelectionChange", `Account selected states updated: ${e.detail.selectedRows.map((r) => r.id).join(", ") || "none"}`);
        this._toggleBulkActionBar(selectedCount > 0);
      } catch (err) {
        logger3.error("_handleTableSelectionChange", "Error handling selection change:", err);
      } finally {
        logger3.groupEnd("_handleTableSelectionChange");
      }
    }
    _toggleBulkActionBar(isVisible) {
      if (!this.bulkActionBar) {
        this.bulkActionBar = document.getElementById("bulkActionBar");
      }
      if (!this.bulkActionBar) {
        logger3.warn("_toggleBulkActionBar", "Bulk action bar element not found");
        return;
      }
      if (isVisible) {
        this.bulkActionBar.classList.remove("hidden");
        this.bulkActionBar.classList.add("flex", "active");
        logger3.debug("_toggleBulkActionBar", "Bulk action bar shown");
      } else {
        this.bulkActionBar.classList.remove("flex", "active");
        this.bulkActionBar.classList.add("hidden");
        logger3.debug("_toggleBulkActionBar", "Bulk action bar hidden");
      }
    }
    _setupTableColumns() {
      const methodName = "_setupTableColumns";
      console.group(methodName);
      this.accountsTable.columns = [
        {
          key: "select",
          type: "checkbox",
          header: "",
          width: "60px",
          masterCheckbox: true,
          disabled: (account) => {
            logger3.group(methodName, "Determining disabled state for select checkbox", { accountId: account.id });
            const isDisabled = account.migrationStatus === AccountMigrationStatus.COMPLETED;
            logger3.groupEnd(methodName);
            return isDisabled;
          },
          mobileHidden: true
        },
        {
          key: "name",
          type: "text",
          header: "Account Name",
          minWidth: "200px",
          cellClass: "px-2 py-2 max-w-[300px]",
          disabled: (account) => {
            logger3.group(methodName, "Determining disabled state for name", { accountId: account.id });
            const isDisabled = account.migrationStatus === AccountMigrationStatus.COMPLETED;
            logger3.groupEnd(methodName);
            return isDisabled;
          },
          clickable: (account) => {
            logger3.group(methodName, "Determining clickable state for name", { accountId: account.id });
            const isClickable = account.migrationStatus !== AccountMigrationStatus.COMPLETED;
            logger3.groupEnd(methodName);
            return isClickable;
          },
          getValue: (account) => account.ynabName,
          tooltip: (account) => {
            logger3.group(methodName, "Getting tooltip for name", { accountId: account.id });
            const tooltip = account.migrationStatus === AccountMigrationStatus.COMPLETED ? account.ynabName : `Click to rename '${account.ynabName}'`;
            logger3.groupEnd(methodName);
            return tooltip;
          },
          onClick: (account) => {
            logger3.group(methodName, "Handling name click", { accountId: account.id });
            const isEnabled2 = account.migrationStatus !== AccountMigrationStatus.COMPLETED;
            if (isEnabled2)
              this._openNameEditor(account);
            logger3.groupEnd(methodName);
          },
          mobileLabel: false,
          mobileClass: "mb-2"
        },
        {
          key: "type",
          type: "select",
          header: "Type",
          minWidth: "150px",
          getValue: (account) => account.monarchType,
          options: monarchAccountTypes_default.data.map((type) => ({
            value: type.typeName,
            label: type.typeDisplay
          })),
          disabled: (account) => {
            logger3.group(methodName, "Determining disabled state for type", { accountId: account.id });
            const isDisabled = account.migrationStatus === AccountMigrationStatus.COMPLETED;
            logger3.groupEnd(methodName);
            return isDisabled;
          },
          tooltip: (account) => {
            logger3.group(methodName, "Getting tooltip for type", { accountId: account.id });
            const tooltip = getAccountTypeByName(account.monarchType)?.typeDisplay || "";
            logger3.groupEnd(methodName);
            return tooltip;
          },
          onChange: async (account, value) => {
            logger3.group(methodName, "Handling type change", { accountId: account.id, newType: value });
            const selectedType = getAccountTypeByName(value);
            const newSubtype = selectedType?.subtypes[0]?.name || null;
            account.monarchType = selectedType?.typeName || null;
            account.monarchSubtype = newSubtype;
            requestAnimationFrame(() => this.accountsTable.updateRow(account.id));
            logger3.groupEnd(methodName);
          },
          mobileLabel: "Type"
        },
        {
          key: "subtype",
          type: "select",
          header: "Subtype",
          minWidth: "150px",
          getValue: (account) => account.monarchSubtype || "",
          options: (account) => {
            logger3.group(methodName, "Getting options for subtype", { accountId: account.id });
            const selectedType = getAccountTypeByName(account.monarchType);
            const options = (selectedType?.subtypes || []).map((sub) => ({
              value: sub.name,
              label: sub.display
            }));
            logger3.groupEnd(methodName);
            return options;
          },
          disabled: (account) => {
            logger3.group(methodName, "Determining disabled state for subtype", { accountId: account.id });
            const isDisabled = account.migrationStatus === AccountMigrationStatus.COMPLETED;
            logger3.groupEnd(methodName);
            return isDisabled;
          },
          tooltip: (account) => {
            logger3.group(methodName, "Getting tooltip for subtype", { accountId: account.id });
            const tooltip = getSubtypeByName(account.monarchType, account.monarchSubtype)?.display || "";
            logger3.groupEnd(methodName);
            return tooltip;
          },
          onChange: async (account, value) => {
            logger3.group(methodName, "Handling subtype change", { accountId: account.id, newSubtype: value });
            account.monarchSubtype = value;
            requestAnimationFrame(() => this.accountsTable.updateRow(account.id));
            logger3.groupEnd(methodName);
          },
          mobileLabel: "Subtype"
        },
        {
          key: "transactionCount",
          type: "text",
          header: "Transactions",
          minWidth: "100px",
          getValue: (account) => account.transactionCount,
          tooltip: (account) => {
            logger3.group(methodName, "Getting tooltip for transactionCount", { accountId: account.id });
            const tooltip = `${account.transactionCount} transaction${account.transactionCount !== 1 ? "s" : ""}`;
            logger3.groupEnd(methodName);
            return tooltip;
          },
          cellStyle: (account) => {
            logger3.group(methodName, "Determining cellStyle for transactionCount", { accountId: account.id });
            const style = account.migrationStatus === AccountMigrationStatus.COMPLETED ? { color: "#9ca3af" } : { color: "#727985ff" };
            logger3.groupEnd(methodName);
            return style;
          },
          mobileLabel: "Txns"
        },
        {
          key: "balance",
          type: "text",
          header: "Balance",
          minWidth: "120px",
          getValue: (account) => currencyFormatter.format(account.balance),
          tooltip: (account) => `Balance: ${currencyFormatter.format(account.balance)}`,
          cellStyle: (account) => {
            logger3.group(methodName, "Determining cellStyle for balance", { accountId: account.id });
            const style = account.migrationStatus === AccountMigrationStatus.COMPLETED ? { color: "#9ca3af" } : { color: "#727985ff" };
            logger3.groupEnd(methodName);
            return style;
          },
          mobileLabel: "Balance"
        },
        {
          key: "undo",
          type: "custom",
          header: "",
          width: "50px",
          render: (account) => {
            logger3.group(methodName, "Rendering 'undo' button for account", { accountId: account.id });
            const container = document.createElement("div");
            container.className = "flex items-center justify-center";
            if (account.isModified) {
              const button = document.createElement("button");
              button.className = "p-1.5 rounded hover:bg-amber-100 transition-colors";
              button.title = "Undo changes";
              button.innerHTML = `
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            `;
              button.addEventListener("click", () => this._undoRowChanges(account.id));
              container.appendChild(button);
            }
            logger3.groupEnd(methodName);
            return container;
          },
          mobileHidden: true
        },
        {
          key: "included",
          type: "button",
          header: "Migrate?",
          minWidth: "100px",
          render: (account) => {
            logger3.group(methodName, "Rendering 'included' button for account", { accountId: account.id });
            const isProcessed = account.migrationStatus === AccountMigrationStatus.COMPLETED;
            const result = {
              text: isProcessed ? "Migrated" : account.included ? "Included" : "Excluded",
              type: "outline",
              color: isProcessed ? "grey" : account.included ? "green" : "red",
              size: "small",
              disabled: isProcessed,
              tooltip: isProcessed ? "This account has already been processed" : account.included ? "Click to exclude" : "Click to include",
              onClick: async () => {
                await this.accounts.toggleInclusion(account.id);
                requestAnimationFrame(() => this.accountsTable.updateRow(account.id));
                this._updateMigrationControls();
              }
            };
            logger3.groupEnd(methodName);
            return result;
          },
          mobileLabel: "Migrate"
        }
      ];
      console.groupEnd(methodName);
    }
    async _renderTable() {
      logger3.group("_renderTable", "AccountReviewController._renderTable()");
      console.warn("Can you see me?");
      const visibleAccounts = this.accounts.getVisible(this.filters);
      logger3.debug("_renderTable", "visible accounts:", visibleAccounts);
      this.accountsTable.data = visibleAccounts;
      this._updateMigrationControls(visibleAccounts);
      this._updateChangesAlert();
      logger3.groupEnd("_renderTable");
    }
    _updateMigrationControls(visibleAccounts = null) {
      const visible = visibleAccounts ?? this.accounts.getVisible(this.filters);
      const total = this.accounts.length();
      this._updateAccountCountDisplay(visible.length, total);
      const includedCount = this.accounts.getIncludedAndUnprocessed().length;
      const hasIncludedAccounts = includedCount > 0;
      toggleDisabled(this.importBtn, !hasIncludedAccounts);
      this.importBtn.title = hasIncludedAccounts ? "" : "At least one account must be included to proceed";
      this.importBtn.textContent = `Migrate ${includedCount} of ${total} account${total !== 1 ? "s" : ""}`;
    }
    _openNameEditor(account) {
      logger3.group("_openNameEditor", "AccountReviewController._openNameEditor()");
      logger3.log("_openNameEditor", `Opening name editor for account ${account.id}: "${account.current.name}"`);
      try {
        const editor = new NameEditorModal(account, () => {
          logger3.debug("_openNameEditor", "Name editor closed, refreshing table");
          this.accountsTable.refresh();
        });
        editor.open();
        logger3.log("_openNameEditor", "Name editor opened successfully");
      } catch (error) {
        logger3.error("_openNameEditor", "Error opening name editor:", error);
      } finally {
        logger3.groupEnd("_openNameEditor");
      }
    }
    async _updateInclusion(include) {
      logger3.group("_updateInclusion", "AccountReviewController._updateInclusion()", { include });
      logger3.log("_updateInclusion", `Updating inclusion status to ${include ? "included" : "excluded"}`);
      const selectedAccounts = this.accounts.getSelected();
      if (selectedAccounts.length === 0) {
        logger3.warn("_updateInclusion", "No accounts selected for bulk inclusion update");
        logger3.groupEnd("_updateInclusion");
        return;
      }
      await this.accounts.setInclusionFor(selectedAccounts.map((acc) => acc.id), include);
      await this._renderTable();
      logger3.groupEnd("_updateInclusion");
    }
    async _updateAccountSelection(shouldSelect) {
      if (shouldSelect) {
        await this.accounts.selectAll();
        this.accountsTable.selectAll();
      } else {
        await this.accounts.deselectAll();
        this.accountsTable.clearSelection();
      }
      logger3.debug("_updateAccountSelection", `All accounts now ${shouldSelect ? "selected" : "deselected"}`);
      await this._renderTable();
    }
    async _undoAllChanges() {
      logger3.group("_undoAllChanges", "AccountReviewController._undoAllChanges()");
      logger3.log("_undoAllChanges", "Undoing all account changes");
      await this.accounts.undoAllChanges();
      await this._renderTable();
      logger3.groupEnd("_undoAllChanges");
    }
    async _undoRowChanges(accountId) {
      logger3.group("_undoRowChanges", "AccountReviewController._undoRowChanges()", { accountId });
      logger3.log("_undoRowChanges", `Undoing changes for account ${accountId}`);
      await this.accounts.undoAccountChanges(accountId);
      await this._renderTable();
      logger3.groupEnd("_undoRowChanges");
    }
    _onFiltersApplied() {
      logger3.group("_onFiltersApplied", "AccountReviewController._onFiltersApplied()");
      logger3.log("_onFiltersApplied", "Filters applied, re-rendering table");
      try {
        this._renderTable();
        this._updateFilterDisplay();
        logger3.log("_onFiltersApplied", "Filter display updated");
      } catch (error) {
        logger3.error("_onFiltersApplied", "Error applying filters:", error);
      } finally {
        logger3.groupEnd("_onFiltersApplied");
      }
    }
    _onFiltersReset() {
      logger3.group("_onFiltersReset", "AccountReviewController._onFiltersReset()");
      logger3.log("_onFiltersReset", "Filters reset, re-rendering table");
      try {
        this._renderTable();
        this._updateFilterDisplay();
        logger3.log("_onFiltersReset", "Filter display updated");
      } catch (error) {
        logger3.error("_onFiltersReset", "Error resetting filters:", error);
      } finally {
        logger3.groupEnd("_onFiltersReset");
      }
    }
    _updateFilterDisplay() {
      logger3.group("_updateFilterDisplay", "AccountReviewController._updateFilterDisplay()");
      try {
        const filterNotificationBadge = document.getElementById("filterNotificationBadge");
        const numberOfActiveFilters = this.filters.getNumberOfActiveFilters();
        logger3.log("_updateFilterDisplay", `Number of active filters: ${numberOfActiveFilters}`);
        filterNotificationBadge.classList.toggle("hidden", numberOfActiveFilters === 0);
        filterNotificationBadge.textContent = numberOfActiveFilters;
        logger3.debug("_updateFilterDisplay", "Filter badge updated");
      } catch (error) {
        logger3.error("_updateFilterDisplay", "Error updating filter display:", error);
      } finally {
        logger3.groupEnd("_updateFilterDisplay");
      }
    }
    _updateAccountCountDisplay(visibleCount, totalCount) {
      logger3.group("_updateAccountCountDisplay", "AccountReviewController._updateAccountCountDisplay()");
      try {
        logger3.log("_updateAccountCountDisplay", `Displaying ${visibleCount} visible accounts out of ${totalCount} total`);
        document.getElementById("visibleAccountCount").innerHTML = visibleCount;
        document.getElementById("totalAccountCount").innerHTML = totalCount;
        logger3.debug("_updateAccountCountDisplay", "Account count displays updated");
        const filterCount = this.filters.getNumberOfActiveFilters();
        const filterNotificationBadge = document.getElementById("filterNotificationBadge");
        filterNotificationBadge.textContent = filterCount;
        filterNotificationBadge.classList.toggle("hidden", filterCount === 0);
        logger3.debug("_updateAccountCountDisplay", `Filter count badge set to ${filterCount}`);
        const filterResultsSummary = document.getElementById("filterResultsSummary");
        filterResultsSummary.classList.toggle("filtered", filterCount > 0);
        logger3.debug("_updateAccountCountDisplay", `Filter results summary ${filterCount > 0 ? "marked" : "unmarked"} as filtered`);
      } catch (error) {
        logger3.error("_updateAccountCountDisplay", "Error updating account count display:", error);
      } finally {
        logger3.groupEnd("_updateAccountCountDisplay");
      }
    }
    async _updateChangesAlert() {
      logger3.group("_updateChangesAlert", "AccountReviewController._updateChangesAlert()");
      const undoAllContainer = document.getElementById("undoAllContainer");
      const hasChanges = await this.accounts.hasChanges();
      logger3.log("_updateChangesAlert", `Has changes: ${hasChanges}`);
      undoAllContainer.classList.toggle("hidden", !hasChanges);
      logger3.debug("_updateChangesAlert", `Undo all container ${hasChanges ? "shown" : "hidden"}`);
      logger3.groupEnd("_updateChangesAlert");
    }
  };

  // src/views/AccountReview/review.js
  var controller;
  function initAccountReviewView() {
    controller = new AccountReviewController();
    controller.init();
  }

  // src/views/AccountReview/review.html
  var review_default = `<div id="pageLayout"></div>
<!-- TODO: Fix the Filters modal, the content isn't loading. -->

<!-- Control Bar -->
<div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between 
                p-4 sm:p-6 gap-4 lg:gap-6 bg-white rounded-lg mb-4 sm:mb-6 
                border border-gray-100 shadow-sm">

  <!-- Filters, Search and Account Summary -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1">
    <!-- Filters Button -->
    <div class="flex-shrink-0">
      <ui-button id="filtersBtn" title="Open advanced filters" data-type="secondary" data-size="medium"
        onclick="window.openFiltersModal && window.openFiltersModal()">
        <!-- Notification Badge -->
        <div id="filterNotificationBadge" class="hidden"></div>

        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
        </svg>
        <span>Filters</span>
      </ui-button>
    </div>

    <!-- Search Input -->
    <div class="flex-1 max-w-md">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <!-- TODO: Reduce height to match the "Filters" button, and the width to be 100% on mobile -->
        <input id="searchInput" type="text" placeholder="Search accounts..." style="padding-left: 2.75rem !important;"
          class="block w-full pr-3 py-2 sm:py-3 text-sm sm:text-base
                          border border-gray-300 rounded-lg placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          transition-colors duration-200">
      </div>
    </div>

    <!-- Undo All Button (Hidden by default) -->
    <div id="undoAllContainer" class="hidden flex-shrink-0">
      <ui-button id="undoAllBtn" data-type="solid" data-size="medium" data-color="yellow" title="Undo all changes">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
        <span>Undo All Changes</span>
      </ui-button>
    </div>

  </div>
  <!-- Account Count Summary -->
  <div id="filterResultsSummary" class="text-sm text-gray-600 whitespace-nowrap">
    Showing <span id="visibleAccountCount" class="font-medium text-gray-900">0</span>
    of <span id="totalAccountCount" class="font-medium text-gray-900">0</span> accounts
  </div>
</div>

<!-- Table Container -->
<ui-table id="accountsTable" data-mobile-breakpoint="lg" data-enable-selection="true" data-row-id-key="id">
</ui-table>

<!-- Continue Button with Hint -->
<div class="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
  <!-- Label set programmatically -->
  <ui-button id="continueBtn"></ui-button>

  <!-- Hint Text -->
  <p class="text-xs sm:text-sm text-gray-600">
    <span class="inline-flex items-center gap-1.5">
      <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>At least one account must be included to continue</span>
    </span>
  </p>
</div>

<!-- Bulk Action Bar -->
<div id="bulkActionBar"
  class="hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">

  <!-- Mobile Bulk Actions (visible on mobile/tablet) -->
  <div
    class="block lg:hidden bg-blue-900 shadow-2xl rounded-xl border border-gray-200 w-[calc(100vw-2rem)] max-w-md mx-auto">
    <div class="p-4">
      <div class="flex flex-col gap-3">
        <!-- Selection Count -->
        <ui-button id="unselectAllBtnMobile" data-type="outline" data-color="transparent" title="Unselect all accounts">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span id="selectedCountMobile" class="mr-1">0</span> <span id="selectCountMobileLabel">Accounts</span>
        </ui-button>

        <!-- Action Buttons Grid -->
        <div class="grid grid-cols-2 gap-2">
          <ui-button id="bulkRenameBtnMobile" data-type="outline" data-color="transparent" title="Bulk rename accounts">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Rename</span>
          </ui-button>

          <ui-button id="bulkTypeBtnMobile" data-type="outline" data-color="transparent" title="Bulk edit account types">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Edit Type</span>
          </ui-button>

          <ui-button id="bulkIncludeBtnMobile" data-type="outline" data-color="transparent" title="Include selected accounts">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Include</span>
          </ui-button>

          <ui-button id="bulkExcludeBtnMobile" data-type="outline" data-color="transparent" title="Exclude selected accounts">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Exclude</span>
          </ui-button>
        </div>
      </div>
    </div>
  </div>

  <!-- Desktop Bulk Actions (visible on desktop) -->
  <div class="hidden lg:block bg-blue-900 shadow-2xl rounded-xl border border-gray-200">
    <div class="px-2 py-2">
      <div class="flex items-center gap-2">
        <!-- Selection Count -->
        <ui-button id="unselectAllBtnDesktop" data-type="solid" data-color="transparent" data-size="small" title="Unselect all accounts">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span id="selectedCountDesktop" class="mr-1">0</span> <span id="selectCountDesktopLabel">Accounts</span>
        </ui-button>

        <!-- Separator -->
        <div class="h-6 border-l border-gray-300"></div>

        <!-- Action Buttons -->
        <div class="flex items-center">

          <!-- Bulk Rename -->
          <ui-button id="bulkRenameBtnDesktop" data-type="solid" data-color="transparent" data-size="small" title="Bulk rename accounts">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Rename
          </ui-button>

          <!-- Bulk Edit Account Types -->
          <ui-button id="bulkTypeBtnDesktop" data-type="solid" data-color="transparent" data-size="small" title="Bulk edit account types">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Edit Type
          </ui-button>

          <!-- Bulk Include -->
          <ui-button id="bulkIncludeBtnDesktop" data-type="solid" data-color="transparent" data-size="small" title="Include selected accounts">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Include
          </ui-button>

          <!-- Bulk Exclude -->
          <ui-button id="bulkExcludeBtnDesktop" data-type="solid" data-color="transparent" data-size="small" title="Exclude selected accounts">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Exclude
          </ui-button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Bulk Rename Modal -->
<ui-modal id="bulkRenameModal" has-footer>
  <h3 slot="title">Bulk Rename Accounts</h3>
  <div slot="content" class="space-y-4">
    <div>
      <label for="renamePattern" class="font-medium text-sm block mb-2">Pattern:</label>
      <input id="renamePattern" name="renamePattern" type="text"
        class="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="e.g. {{YNAB}} - {{Index}}">
    </div>

    <!-- Token shortcuts -->
    <div>
      <label class="font-medium text-sm block mb-2">Token Shortcuts:</label>
      <div class="grid grid-cols-2 gap-2">
        <ui-button data-type="secondary" data-size="small" class="token-btn" data-token="{{YNAB}}">YNAB Name</ui-button>
        <ui-button data-type="secondary" data-size="small" class="token-btn" data-token="{{Index}}">Index</ui-button>
        <ui-button data-type="secondary" data-size="small" class="token-btn" data-token="{{Upper}}">
          Uppercase YNAB
        </ui-button>
        <ui-button data-type="secondary" data-size="small" class="token-btn" data-token="{{Date}}">
          Today (YYYY-MM-DD)
        </ui-button>
      </div>
    </div>

    <!-- Index start -->
    <div class="flex items-center gap-3">
      <label for="indexStart" class="text-sm">Index Start:</label>
      <input id="indexStart" type="number"
        class="border rounded px-3 py-2 w-20 sm:w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value="1" />
    </div>

    <!-- Preview -->
    <div class="border rounded p-3 bg-gray-50">
      <div class="font-medium text-sm mb-2">Preview:</div>
      <div id="renamePreview" class="text-xs sm:text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto"
        aria-live="polite"></div>
    </div>
  </div>
  <div slot="footer" class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
    <ui-button id="renameCancel" data-type="outline" data-color="black">Cancel</ui-button>
    <ui-button id="renameApply" data-type="solid">Apply</ui-button>
  </div>
</ui-modal>

<!-- Bulk Type Edit Modal -->
<ui-modal id="bulkTypeModal" has-footer>
  <h3 slot="title">Bulk Edit Account Type</h3>
  <div slot="content" class="space-y-4">
    <div>
      <label for="bulkTypeSelect" class="block mb-2 font-medium text-sm">Account Type</label>
      <select id="bulkTypeSelect" name="bulkSubtypeSelect"
        class="border rounded w-full px-3 py-2 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></select>
    </div>

    <div>
      <label for="bulkSubtypeSelect" class="block mb-2 font-medium text-sm">Subtype</label>
      <select id="bulkSubtypeSelect"
        class="border rounded w-full px-3 py-2 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></select>
    </div>
  </div>
  <div slot="footer" class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
    <ui-button id="bulkTypeCancel" data-type="outline" data-color="black">Cancel</ui-button>
    <ui-button id="bulkTypeApply" data-type="solid">Apply</ui-button>
  </div>
</ui-modal>

<!-- Advanced Filters Modal -->
<ui-modal id="filtersModal" has-footer>
  <h3 slot="title">Advanced Filters</h3>
  <div slot="content" class="divide-y divide-gray-200 space-y-6">

    <!-- Active Filters Display -->
    <div id="activeFiltersSection" class="hidden pb-3 mb-3 border-b border-gray-200">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-gray-700">Active Filters</h3>
        <!-- TODO: Move event handling into .js file -->
        <!-- TODO: Set color to red -->
        <ui-button id="clearAllFilters" data-type="text" onclick="window.clearAllFilters && window.clearAllFilters()">
          Clear All
        </ui-button>
      </div>
      <div id="activeFiltersContainer" class="flex flex-wrap gap-2"></div>
    </div>

    <!-- Account Name Filter -->
    <div class="space-y-3">
      <div class="space-y-3">
        <label for="filterAccountName" class="block text-sm font-medium text-gray-900">Account Name</label>
        <div class="relative">
          <input id="filterAccountName" name="filterAccountName" type="text" placeholder="Enter account name..."
            class="w-full px-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <button id="clearAccountNameBtn" type="button" 
            class="hidden absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150"
            aria-label="Clear account name filter"
            title="Clear">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex flex-wrap gap-4 items-center">
          <label class="flex items-center">
            <input id="nameMatchTypeContains" type="radio" name="nameMatchType" value="contains" checked
              class="w-4 h-4 border-gray-300" style="accent-color: #111827;">
            <span class="ml-2 text-sm text-gray-700">Contains</span>
          </label>
          <label class="flex items-center">
            <input id="nameMatchTypeExact" type="radio" name="nameMatchType" value="exact"
              class="w-4 h-4 border-gray-300" style="accent-color: #111827;">
            <span class="ml-2 text-sm text-gray-700">Exact match</span>
          </label>
          <div class="h-4 w-px bg-gray-300"></div>
          <label class="flex items-center">
            <input id="nameCaseSensitive" name="nameCaseSensitive" type="checkbox"
              class="w-4 h-4 border-gray-300 rounded" style="accent-color: #111827;">
            <span class="ml-2 text-sm text-gray-700">Case sensitive</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Account Type Filter -->
    <div class="pt-6 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-900">Account Type</h3>
        <div class="flex items-center gap-1">
          <ui-button id="accountTypeSelectAllBtn" data-type="text" data-size="small">Select All</ui-button>
          <div class="h-4 w-px bg-gray-300"></div>
          <ui-button id="accountTypeDeselectAllBtn" data-type="text" data-size="small">Deselect All</ui-button>
        </div>
      </div>
      <div class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
        <div id="typeFiltersContainer" class="space-y-2">
          <!-- Populated dynamically -->
        </div>
      </div>
    </div>

    <!-- Account Subtype Filter -->
    <div class="pt-6 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-900">Account Subtype</h3>
        <div class="flex items-center gap-1">
          <ui-button id="accountSubtypeSelectAllBtn" data-type="text" data-size="small">Select All</ui-button>
          <div class="h-4 w-px bg-gray-300"></div>
          <ui-button id="accountSubtypeDeselectAllBtn" data-type="text" data-size="small">Deselect All</ui-button>
        </div>
      </div>
      <div class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
        <div id="subtypeFiltersContainer" class="space-y-2">
          <!-- Populated dynamically -->
        </div>
      </div>
    </div>

    <!-- Transactions Count Filter -->
    <div class="pt-6 space-y-3">
      <h3 class="text-sm font-medium text-gray-900">Transaction Count</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label for="filterTransactionsMin" class="block text-xs text-gray-600 mb-1">Minimum</label>
          <input id="filterTransactionsMin" name="filterTransactionsMin" type="number" placeholder="0" min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="filterTransactionsMax" class="block text-xs text-gray-600 mb-1">Maximum</label>
          <input id="filterTransactionsMax" name="filterTransactionsMax" type="number" placeholder="999999" min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
      </div>
    </div>

    <!-- Balance Filter -->
    <div class="pt-6 space-y-3">
      <h3 class="text-sm font-medium text-gray-900">Balance</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label for="filterBalanceMin" class="block text-xs text-gray-600 mb-1">Minimum ($)</label>
          <input id="filterBalanceMin" name="filterBalanceMin" type="number" placeholder="0.00" step="0.01"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="filterBalanceMax" class="block text-xs text-gray-600 mb-1">Maximum ($)</label>
          <input id="filterBalanceMax" name="filterBalanceMax" type="number" placeholder="999999.99" step="0.01"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
      </div>
    </div>

    <!-- Inclusion Status Filter -->
    <div class="pt-6 pb-0 space-y-3">
      <h3 class="text-sm font-medium text-gray-900">Include Status</h3>
      <div class="flex flex-wrap gap-4">
        <label class="flex items-center">
          <input id="inclusionFilterAll" type="radio" name="inclusionFilter" value="all" checked
            class="w-4 h-4 border-gray-300" style="accent-color: #111827;">
          <span class="ml-2 text-sm text-gray-700">All accounts</span>
        </label>
        <label class="flex items-center">
          <input id="inclusionFilterIncluded" type="radio" name="inclusionFilter" value="included"
            class="w-4 h-4 border-gray-300" style="accent-color: #111827;">
          <span class="ml-2 text-sm text-gray-700">Included only</span>
        </label>
        <label class="flex items-center">
          <input id="inclusionFilterExcluded" type="radio" name="inclusionFilter" value="excluded"
            class="w-4 h-4 border-gray-300" style="accent-color: #111827;">
          <span class="ml-2 text-sm text-gray-700">Excluded only</span>
        </label>
      </div>
    </div>
  </div>

  <div slot="footer" class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
    <!-- TODO: Move logic into .js file -->
    <ui-button id="filtersResetBtn" data-type="outline" data-color="yellow">
      Remove All Filters
    </ui-button>
    <!-- TODO: Move logic into .js file -->
    <ui-button id="filtersApplyBtn" data-type="solid" onclick="window.applyFilters && window.applyFilters()">
      Apply Filters
    </ui-button>
  </div>
</ui-modal>

<style>
  /* Modified filter input styling */
  .filter-modified {
    border-color: #eab308 !important;
    border-width: 1px;
    background-color: rgba(250, 204, 21, 0.05);
  }

  .filter-modified:focus {
    outline: 2px solid #eab308;
    outline-offset: 2px;
  }

  /* Filter results summary styling */
  #filterResultsSummary {
    transition: all 0.3s ease;
  }

  /* Filter notification badge */
  #filtersBtn {
    position: relative;
  }

  #filterNotificationBadge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #dc2626;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
    z-index: 10;
  }

  #filterNotificationBadge.hidden {
    display: none;
  }

  /* Bulk action bar styling */
  #bulkActionBar {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  #bulkActionBar:not(.active) {
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
  }

  #bulkActionBar.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* Enhanced button hover effects */
  #bulkActionBar button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  #bulkActionBar button:active {
    transform: translateY(0);
  }

  /* Mobile grid button sizing */
  @media (max-width: 1024px) {
    #bulkActionBar .grid button {
      min-height: 48px;
    }
  }

  /* Mobile card styles for accounts */
  .mobile-account-card {
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .mobile-account-card:last-child {
    border-bottom: none;
  }

  .mobile-account-card .card-content {
    flex: 1;
    min-width: 0;
  }

  .mobile-account-card .account-name {
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.5rem;
    word-wrap: break-word;
  }

  .mobile-account-card .account-details {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .mobile-account-card .account-details>div {
    margin-bottom: 0.5rem;
  }

  .mobile-account-card .account-balance {
    font-weight: 500;
    text-align: right;
  }

  /* Custom checkbox styling */
  .custom-checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    position: relative;
  }

  .custom-checkbox-input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .custom-checkbox-visual {
    position: relative;
    height: 20px;
    width: 20px;
    background-color: #ffffff;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custom-checkbox-visual::after {
    content: "";
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .custom-checkbox-input:checked+.custom-checkbox-visual {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  .custom-checkbox-input:checked+.custom-checkbox-visual::after {
    display: block;
  }

  .custom-checkbox-input:indeterminate+.custom-checkbox-visual {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  .custom-checkbox-input:indeterminate+.custom-checkbox-visual::after {
    content: "";
    position: absolute;
    display: block;
    left: 4px;
    top: 50%;
    width: 12px;
    height: 2px;
    background-color: white;
    border: none;
    transform: translateY(-50%);
  }

  .custom-checkbox-input:focus+.custom-checkbox-visual {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    outline: none;
  }

  .custom-checkbox-input:disabled+.custom-checkbox-visual {
    background-color: #f3f4f6;
    border-color: #e5e7eb;
    cursor: not-allowed;
  }

  .custom-checkbox-container:hover .custom-checkbox-input:not(:disabled)+.custom-checkbox-visual {
    border-color: #3b82f6;
  }

  /* Disabled form controls styling */
  input[type="radio"]:disabled + span,
  input[type="checkbox"]:disabled + span {
    color: #9ca3af;
    cursor: not-allowed;
  }

  label:has(input:disabled) {
    cursor: not-allowed;
  }

  /* Mobile specific enhancements */
  @media (max-width: 1024px) {
    .custom-checkbox-visual {
      height: 24px;
      width: 24px;
      min-width: 24px;
      min-height: 24px;
    }

    .custom-checkbox-visual::after {
      left: 8px;
      top: 3px;
      width: 5px;
      height: 10px;
    }

    button,
    select {
      min-height: 44px;
      padding: 0.75rem;
    }

    .token-btn {
      min-height: 44px;
    }

    input[type="text"],
    input[type="number"] {
      min-height: 44px;
      padding: 0.75rem;
    }
  }
</style>`;

  // src/views/MethodSelect/method.js
  function initMethodSelectView() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Step 3: Choose Your Migration Method",
        description: "Either manually import your accounts into Monarch Money yourself or let us automate the process.",
        containerId: "pageHeader"
      }
    });
    const totalCount = state_default.accounts.length();
    const selectedCount = state_default.accounts._accounts.filter((acc) => acc.included).length;
    document.getElementById("totalCountDisplay").textContent = totalCount;
    document.getElementById("filesCountDisplay").textContent = selectedCount;
    document.getElementById("manualFileCount").textContent = selectedCount;
    document.getElementById("manualFileLabel").textContent = selectedCount === 1 ? "file" : "files";
    document.getElementById("manualImportCard").addEventListener("card-click", () => {
      navigate("/manual");
    });
    document.getElementById("autoImportCard").addEventListener("card-click", () => {
      navigate("/login");
    });
  }

  // src/views/MethodSelect/method.html
  var method_default = '<div id="pageLayout"></div>\n\n<!-- Summary Counts -->\n<div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10 \n          bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 md:p-8 \n          border border-blue-100 w-full max-w-2xl mx-auto shadow-sm mb-12">\n\n  <div class="text-center">\n    <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-500" id="totalCountDisplay">0</div>\n    <div class="text-gray-500 text-xs sm:text-sm md:text-base font-medium">Total Accounts</div>\n  </div>\n\n  <div class="hidden sm:block w-px h-12 bg-gray-300"></div>\n  <div class="sm:hidden w-full h-px bg-gray-300"></div>\n\n  <div class="text-center">\n    <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600" id="filesCountDisplay">0</div>\n    <div class="text-gray-600 text-xs sm:text-sm md:text-base font-medium">Accounts To Migrate</div>\n  </div>\n</div>\n\n<!-- Migration Options -->\n<div class="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl mx-auto">\n\n  <!-- Manual Import -->\n  <clickable-card id="manualImportCard" data-color="blue" data-width="full">\n    <svg slot="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />\n    </svg>\n    <svg slot="arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />\n    </svg>\n    <h3 slot="title">Manual Import</h3>\n    <p slot="description">\n      Download <span id="manualFileCount" class="font-semibold text-blue-600">0</span> CSV <span id="manualFileLabel">files</span> and upload them\n      into Monarch Money yourself, one by one.\n    </p>\n    <span slot="action">Select Manual Import</span>\n  </clickable-card>\n\n  <!-- Auto Import -->\n  <clickable-card id="autoImportCard" data-color="green" data-width="full">\n    <svg slot="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />\n    </svg>\n    <svg slot="arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />\n    </svg>\n    <h3 slot="title">Auto Import</h3>\n    <p slot="description">\n      Connect your Monarch Money account and automatically import your selected accounts.\n    </p>\n    <span slot="action">Select Auto Import</span>\n  </clickable-card>\n\n</div>';

  // src/views/ManualInstructions/manualInstructionsData.js
  var import_jszip = __toESM(require_jszip_min(), 1);

  // shared/generateCsv.js
  function generateCSV(accountName, transactions) {
    const headers = `"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"`;
    const rows = transactions.map((tx) => `"${tx.Date}","${tx.Merchant}","${tx.Category}","${accountName}","","${tx.Notes}","${tx.Amount}","${tx.Tags}"`);
    return [headers, ...rows].join("\n");
  }

  // src/views/ManualInstructions/manualInstructionsData.js
  async function generateAccountsZip({ maxRowsPerFile = 1e3 } = {}) {
    const includedAccounts = state_default.accounts._accounts.filter((acc) => acc.included);
    const zip = new import_jszip.default();
    includedAccounts.forEach((account) => {
      const safeName = (account.current.name || "").replace(/[\\/:*?"<>|]/g, "_");
      const transactions = account.transactions || [];
      const total = transactions.length;
      if (total <= maxRowsPerFile) {
        const csv = generateCSV(account.current.name, transactions);
        zip.file(`${safeName}.csv`, csv);
      } else {
        const chunks = Math.ceil(total / maxRowsPerFile);
        for (let i = 0; i < chunks; i++) {
          const start = i * maxRowsPerFile;
          const end = start + maxRowsPerFile;
          const chunk = transactions.slice(start, end);
          const chunkCsv = generateCSV(account.current.name, chunk);
          zip.file(`${safeName}_part${i + 1}.csv`, chunkCsv);
        }
      }
    });
    const content = await zip.generateAsync({ type: "blob" });
    return content;
  }

  // src/views/ManualInstructions/manualInstructions.js
  function initManualInstructionsView() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Step 4: Manual Migration",
        description: "A step-by-step guide to manually importing your YNAB data into Monarch Money.",
        containerId: "pageHeader"
      }
    });
    const downloadBtn = document.getElementById("downloadBtn");
    const switchBtn = document.getElementById("switchToAuto");
    downloadBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const content = await generateAccountsZip();
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(content);
        downloadLink.download = "accounts_export.zip";
        downloadLink.click();
      } catch (err) {
        console.error("\u274C ZIP generation failed", err);
        alert("Failed to generate ZIP file.");
      }
    });
    switchBtn.addEventListener("click", () => navigate("/login"));
  }

  // src/views/ManualInstructions/manualInstructions.html
  var manualInstructions_default = `<div id="pageLayout"></div>

<!-- Main Instructions Card -->
<section
  class="w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 md:p-10 space-y-8 sm:space-y-10 md:max-w-4xl mx-auto">

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

      <ui-button id="downloadBtn" data-type="solid" data-size="large">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 4v12" />
        </svg>
        Download CSV Bundle
      </ui-button>
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
        class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 text-blue-600 rounded-full font-bold text-sm sm:text-base mr-3 sm:mr-4">
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
              class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
              g
            </span>
            <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
              Enable <em>"Adjust account's balances based on these transactions"</em>
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
</section>

<!-- Auto Import Promotion -->
<section
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

  <ui-button id="switchToAuto" data-type="solid" data-size="large">
    Try Auto Import Instead
  </ui-button>

</section>`;

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
  var base = "/.netlify/functions/";
  var API = {
    login: base + "monarchLogin",
    fetchAccounts: base + "fetchMonarchAccounts",
    createAccounts: base + "createMonarchAccounts",
    generateStatements: base + "generateStatements",
    getUploadStatus: base + "getUploadStatus"
  };

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
    createAccounts: (token, accounts) => postJson(API.createAccounts, { token, accounts }),
    generateAccounts: (accounts) => fetch(API.generateStatements, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accounts })
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

  // src/views/MonarchCredentials/monarchCredentialsData.js
  function initCredentials() {
    const creds = state_default.credentials;
    const email = sessionStorage.getItem("monarch_email");
    const encryptedPassword = sessionStorage.getItem("monarch_pwd_enc");
    const token = sessionStorage.getItem("monarch_token");
    const uuid = sessionStorage.getItem("monarch_uuid");
    state_default.setCredentials({
      email: creds.email || email,
      encryptedPassword: creds.encryptedPassword || encryptedPassword,
      apiToken: creds.apiToken || token,
      deviceUuid: creds.deviceUuid || uuid,
      remember: false
    });
    if (!creds.deviceUuid || creds.deviceUuid === "") {
      creds.deviceUuid = v4_default();
      sessionStorage.setItem("monarch_uuid", creds.deviceUuid);
    }
    return { creds };
  }
  async function attemptLogin({ emailInput, passwordInput, creds, UI }) {
    const email = emailInput.trim() || sessionStorage.getItem("monarch_email");
    const plaintextPassword = passwordInput.trim();
    let encryptedPassword = creds.encryptedPassword || sessionStorage.getItem("monarch_pwd_enc");
    const uuid = creds.deviceUuid || sessionStorage.getItem("monarch_uuid");
    if (!encryptedPassword && plaintextPassword) {
      try {
        encryptedPassword = await encryptPassword(email, plaintextPassword);
      } catch (err) {
        return { error: "Failed to encrypt password." };
      }
    }
    try {
      const response = await monarchApi.login(email, encryptedPassword, uuid);
      if (response?.otpRequired) {
        state_default.saveToLocalStorage({
          email,
          encryptedPassword,
          uuid,
          remember: creds.remember,
          tempForOtp: !creds.remember
        });
        state_default.setCredentials({ awaitingOtp: true });
        return { otpRequired: true };
      }
      if (response?.token) {
        state_default.setCredentials({
          email,
          encryptedPassword,
          otp: "",
          remember: UI.rememberCheckbox.checked,
          apiToken: response.token,
          awaitingOtp: false
        });
        if (creds.remember) {
          state_default.saveToLocalStorage({ email, encryptedPassword, token: response.token, remember: true });
        }
        return { token: response.token };
      }
      const apiError = response?.detail || response?.error || "Unexpected login response.";
      return { error: apiError };
    } catch (err) {
      return { error: err.message || String(err) };
    }
  }
  function clearCredentialsAndReset() {
    state_default.clearLocalStorage();
    state_default.credentials.clear();
    state_default.credentials.deviceUuid = v4_default();
    state_default.saveToLocalStorage({ uuid: state_default.credentials.deviceUuid });
  }

  // src/views/MonarchCredentials/monarchCredentials.js
  async function initMonarchCredentialsView() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Step 4: Auto Migration",
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
    const { creds } = initCredentials(state_default);
    if (creds.email && creds.encryptedPassword) {
      UI.emailInput.value = creds.email;
      UI.passwordInput.value = "";
      UI.rememberedEmail.textContent = `Signed in as ${creds.email}`;
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
          UI.securityNoteMsg.innerHTML = 'Your credentials will be encrypted and saved to this device. <a href="#" data-nav="/data-management" class="text-blue-600 hover:text-blue-800 underline">Manage stored data</a>.';
          UI.securityNoteIcon.setAttribute("fill", COLOR.ORANGE);
          break;
        case "signed-in":
          UI.securityNoteMsg.innerHTML = 'Currently signed in. To use different credentials, click "Not you?" or <a href="#" data-nav="/data-management" class="text-blue-600 hover:text-blue-800 underline">manage your data</a>.';
          UI.securityNoteIcon.setAttribute("fill", COLOR.BLUE);
          break;
        default:
          UI.securityNoteMsg.textContent = "Your credentials will only be used for this session and will not be saved.";
          UI.securityNoteIcon.setAttribute("fill", COLOR.GREEN);
      }
      const links = UI.securityNoteMsg.querySelectorAll("[data-nav]");
      links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const path = e.target.getAttribute("data-nav");
          navigate(path);
        });
      });
    }
    function onSubmitForm(e) {
      e.preventDefault();
      UI.connectBtn.click();
    }
    async function handleLoginAttempt() {
      toggleDisabled(UI.connectBtn, true);
      UI.connectBtn.textContent = "Connecting\u2026";
      toggleElementVisibility(UI.errorContainer, false);
      const result = await attemptLogin({
        emailInput: UI.emailInput.value,
        passwordInput: UI.passwordInput.value,
        creds,
        UI
      });
      if (result.error) {
        showError(result.error);
        toggleDisabled(UI.connectBtn, false);
        UI.connectBtn.textContent = "Connect to Monarch";
        return;
      }
      if (result.otpRequired)
        return navigate("/otp");
      if (result.token)
        return navigate("/complete");
    }
    async function onClickConnect(e) {
      e.preventDefault();
      await handleLoginAttempt();
    }
    function onClickClearCredentials(e) {
      e.preventDefault();
      clearCredentialsAndReset(creds);
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
      <ui-button id="clearCredentialsBtn" data-type="text" data-size="small">
        Not You?
      </ui-button>
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
    <ui-button id="connectBtn" type="submit" data-type="solid" data-size="large">
      <span id="loginBtnText">Connect to Monarch</span>
      <svg id="loginSpinner" class="hidden animate-spin ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </ui-button>
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

  // src/views/MonarchOtp/monarchOtpData.js
  function initCredentialsFromStorage(state2) {
    const { credentials } = state2;
    const email = sessionStorage.getItem("monarch_email");
    const encryptedPassword = sessionStorage.getItem("monarch_pwd_enc");
    const uuid = sessionStorage.getItem("monarch_uuid");
    state2.setCredentials({
      email: credentials.email || email,
      encryptedPassword: credentials.encryptedPassword || encryptedPassword,
      deviceUuid: credentials.deviceUuid || uuid,
      remember: false
    });
    return { email, encryptedPassword, uuid };
  }
  async function submitOtp(credentials) {
    const response = await monarchApi.login(credentials.email, credentials.encryptedPassword, credentials.deviceUuid, credentials.otp);
    if (response?.token) {
      state_default.setCredentials({
        apiToken: response.token,
        awaitingOtp: false
      });
      sessionStorage.setItem("monarch_email", credentials.email);
      sessionStorage.setItem("monarch_pwd_enc", credentials.encryptedPassword);
      sessionStorage.setItem("monarch_uuid", credentials.deviceUuid);
      sessionStorage.setItem("monarch_token", response.token);
      return { success: true };
    }
    return { success: false };
  }
  function clearTempCredentialsIfNeeded() {
    sessionStorage.removeItem("monarch_email");
    sessionStorage.removeItem("monarch_pwd_enc");
    sessionStorage.removeItem("monarch_uuid");
    sessionStorage.removeItem("monarch_token");
    sessionStorage.removeItem("monarch_otp");
  }

  // src/views/MonarchOtp/monarchOtp.js
  function initMonarchOtpView() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Step 5: Enter Your Verification Code",
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
    const { storage, tempForOtp } = initCredentialsFromStorage(state_default);
    if (!credentials.email || !credentials.encryptedPassword) {
      console.warn("Missing credentials for OTP flow, redirecting to login");
      return navigate("/credentials", true);
    }
    async function onClickSubmitOtp(e) {
      console.group("MonarchOtpView");
      e.preventDefault();
      toggleElementVisibility(UI.otpError, false);
      credentials.otp = UI.otpInput.value;
      try {
        const result = await submitOtp(credentials);
        if (result.success) {
          console.groupEnd("MonarchOtpView");
          return navigate("/complete", true);
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
      clearTempCredentialsIfNeeded();
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
  <div class="w-full bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
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
  <ui-button id="submitOtpBtn" data-type="solid" data-size="large" disabled>
    <span id="submitOtpBtnText">Connect to Monarch</span>
    <svg id="submitOtpSpinner" class="hidden animate-spin ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
      </path>
    </svg>
  </ui-button>

</div>`;

  // src/views/MonarchComplete/monarchCompleteData.js
  function ensurePendingStatusForAccounts(state2) {
    state2.accounts.accounts.forEach((account) => {
      if (!account.status) {
        account.status = "pending";
      }
    });
  }
  function getIncludedAccountsToProcess(state2) {
    return state2.accounts.accounts.filter((account) => account.included && account.status !== "completed").map((account) => ({
      id: account.id,
      name: account.current.name,
      modifiedName: account.current.name,
      type: account.current.type,
      subtype: account.current.subtype,
      transactions: account.transactions,
      balance: account.balance,
      included: account.included,
      status: account.status
    }));
  }
  function splitIntoBatches(allAccounts, batchSize = 5) {
    const batches = [];
    for (let i = 0; i < allAccounts.length; i += batchSize) {
      batches.push(allAccounts.slice(i, i + batchSize));
    }
    return batches;
  }
  async function createAccountsBatch(token, batch) {
    return await monarchApi.createAccounts(token, batch);
  }
  function markBatchProcessing(state2, batch) {
    batch.forEach((batchAccount) => {
      const account = state2.accounts.accounts.find((acc) => acc.current.name === batchAccount.modifiedName);
      if (account)
        account.status = "processing";
    });
  }
  function markBatchFailedDueToApi(state2, batch, errorMessage) {
    batch.forEach((batchAccount) => {
      const account = state2.accounts.accounts.find((acc) => acc.current.name === batchAccount.modifiedName);
      if (account) {
        account.status = "failed";
        account.errorMessage = errorMessage;
      }
    });
  }
  function markUnprocessedAsFailed(state2, batch) {
    batch.forEach((batchAccount) => {
      const account = state2.accounts.accounts.find((acc) => acc.current.name === batchAccount.modifiedName);
      if (account && account.status === "processing") {
        account.status = "failed";
        account.errorMessage = "Account not processed by server";
      }
    });
  }
  function handleCreateResponse(state2, batch, response) {
    if (response.failed && response.failed.length > 0) {
      response.failed.forEach((result) => {
        const matchingBatchAccount = batch.find((acc) => acc.modifiedName === result.name);
        if (matchingBatchAccount) {
          const account = state2.accounts.accounts.find((acc) => acc.current.name === matchingBatchAccount.modifiedName);
          if (account) {
            account.status = "failed";
            account.errorMessage = result.error || "Account creation failed";
          }
        }
      });
    }
    if (response.success && response.success.length > 0) {
      response.success.forEach((result) => {
        const matchingBatchAccount = batch.find((acc) => acc.modifiedName === result.name);
        if (matchingBatchAccount) {
          const account = state2.accounts.accounts.find((acc) => acc.current.name === matchingBatchAccount.modifiedName);
          if (account) {
            account.status = "uploading";
            account.sessionKeys = result.sessionKeys || [];
          }
        }
      });
    }
  }

  // src/views/MonarchComplete/monarchComplete.js
  function initMonarchCompleteView() {
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
    document.getElementById("visitMonarchBtn").addEventListener("click", () => window.open("https://app.monarchmoney.com", "_blank"));
    document.getElementById("retryFailedBtn").addEventListener("click", () => retryFailedAccounts());
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
      ensurePendingStatusForAccounts(state_default);
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
        state_default.accounts._accounts.forEach((account) => {
          if (account.included) {
            account.status = "failed";
            account.errorMessage = "Authentication required. Please login again.";
          }
        });
        updateStatusOverview();
        updateAccountList();
        updateActionButtons();
        return;
      }
      const allAccountsToProcess = getIncludedAccountsToProcess(state_default);
      if (allAccountsToProcess.length === 0) {
        console.log("No accounts to process");
        updateStatusOverview();
        updateActionButtons();
        return;
      }
      const batches = splitIntoBatches(allAccountsToProcess, BATCH_SIZE);
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        markBatchProcessing(state_default, batch);
        updateStatusOverview();
        updateAccountList();
        await processBatch(token, batch);
        if (batchIndex < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1e3));
        }
      }
      updateStatusOverview();
      updateAccountList();
      updateActionButtons();
    }
    async function processBatch(token, batch) {
      try {
        const response = await createAccountsBatch(token, batch);
        if (response && (response.success || response.failed)) {
          handleCreateResponse(state_default, batch, response);
          if (response.success && response.success.length > 0) {
            updateStatusOverview();
            updateAccountList();
            await Promise.all(response.success.map(async (result) => {
              const matchingBatchAccount = batch.find((acc) => acc.modifiedName === result.name);
              if (matchingBatchAccount && result.sessionKeys) {
                const account = state_default.accounts._accounts.find((acc) => acc.current.name === matchingBatchAccount.modifiedName);
                if (account) {
                  try {
                    await monitorUploadStatus(token, matchingBatchAccount.modifiedName, result.sessionKeys);
                    account.status = "completed";
                  } catch (error) {
                    account.status = "failed";
                    account.errorMessage = error.message || "Transaction upload failed";
                  }
                }
              }
            }));
          }
          markUnprocessedAsFailed(state_default, batch);
        } else {
          const errorMessage = response.error || "Failed to create accounts in Monarch Money";
          markBatchFailedDueToApi(state_default, batch, errorMessage);
        }
      } catch (error) {
        batch.forEach((batchAccount) => {
          const account = state_default.accounts._accounts.find((acc) => acc.current.name === batchAccount.modifiedName);
          if (account) {
            account.status = "failed";
            account.errorMessage = "Network error. Please check your connection and try again.";
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
                const errorMessage = session.errorMessage || "Transaction upload failed";
                throw new Error(errorMessage);
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
      const accounts = state_default.accounts?._accounts || [];
      const includedAccounts = accounts.filter((acc) => acc.included);
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
      const accounts = state_default.accounts?._accounts || [];
      accountList.innerHTML = "";
      accounts.forEach((account) => {
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
        if (account.current.type) {
          const typeInfo = getAccountTypeByName(account.current.type);
          if (typeInfo) {
            accountTypeDisplay = typeInfo.typeDisplay || typeInfo.displayName || typeInfo.display;
            if (account.current.subtype) {
              const subtypeInfo = getSubtypeByName(account.current.type, account.current.subtype);
              if (subtypeInfo) {
                accountTypeDisplay = subtypeInfo.display || subtypeInfo.displayName;
              }
            }
          }
        } else {
          console.log(`Account ${account.id} has no type property`);
        }
        accountItem.innerHTML = `
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0 pr-4">
            <div class="font-medium text-gray-900 mb-1">${account.current.name || "Unknown Account"}</div>
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
      const accounts = state_default.accounts || {};
      const failedAccounts = accounts.filter((acc) => acc.included && acc.status === "failed");
      const completedAccounts = accounts.filter((acc) => acc.included && acc.status === "completed");
      document.getElementById("retryFailedBtn").hidden = failedAccounts.length === 0;
      document.getElementById("visitMonarchBtn").hidden = completedAccounts.length <= 0;
    }
    function retryFailedAccounts() {
      const failedAccounts = state_default.accounts._accounts.filter((acc) => acc.included && acc.status === "failed");
      if (failedAccounts.length === 0)
        return;
      failedAccounts.forEach((account) => {
        account.status = "pending";
        delete account.errorMessage;
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

<section class="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 mb-12">
  <ui-button id="visitMonarchBtn" data-type="secondary" data-size="large" hidden>
    <span class="inline-flex items-center gap-2 mr-1">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </span>
    Visit Monarch Money
  </ui-button>
  <ui-button id="retryFailedBtn" data-type="solid" data-size="large" hidden>Retry Failed Accounts</ui-button>
</section>`;

  // src/views/YnabOauthCallback/ynabOauthCallback.js
  async function initYnabOauthCallbackView() {
    renderPageLayout();
    const loadingSpinner = document.getElementById("loadingSpinner");
    const successIcon = document.getElementById("successIcon");
    const errorIcon = document.getElementById("errorIcon");
    const statusTitle = document.getElementById("statusTitle");
    const statusMessage = document.getElementById("statusMessage");
    const manualRedirectContainer = document.getElementById("manualRedirectContainer");
    const continueBtn = document.getElementById("continueBtn");
    try {
      statusTitle.textContent = "Processing...";
      statusMessage.innerHTML = "We're fetching your account data now.</br>You should be redirected automatically.";
      await ynabApi_default.handleOauthCallback();
      const ynabAccounts = await ynabApi_default.getAccounts();
      console.log("Fetched accounts after OAuth callback:", ynabAccounts);
      await ynabAccounts.saveToDb();
      loadingSpinner.hidden = true;
      successIcon.hidden = false;
      statusTitle.textContent = "We got your data!";
      statusMessage.innerHTML = "Still here? Sorry, sometimes redirections don't work.</br>Click the button below to select your accounts.";
      setTimeout(() => {
        navigate("/select-accounts", true);
      }, 1500);
      continueBtn.textContent = "Select Your Accounts";
      continueBtn.addEventListener("click", () => {
        navigate("/select-accounts", true);
      });
      setTimeout(() => {
        manualRedirectContainer.hidden = false;
      }, 1500);
    } catch (error) {
      console.error(error);
      loadingSpinner.hidden = true;
      errorIcon.hidden = false;
      statusTitle.textContent = "Connection Failed";
      statusMessage.textContent = "Try connecting to YNAB again.";
      continueBtn.textContent = "Try Again";
      continueBtn.setAttribute("data-color", "black");
      continueBtn.updateStyle();
      continueBtn.addEventListener("click", () => {
        navigate("/upload", true);
      });
      manualRedirectContainer.hidden = false;
    }
  }

  // src/views/YnabOauthCallback/ynabOauthCallback.html
  var ynabOauthCallback_default = '<div id="pageLayout"></div>\n\n<!-- Content -->\n<div class="flex flex-col items-center justify-center text-center space-y-6 py-12">\n\n  <!-- Loading Spinner (shown by default) -->\n  <div id="loadingSpinner" class="relative w-20 h-20">\n    <div class="absolute inset-0 border-4 border-blue-200 rounded-full"></div>\n    <div class="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>\n  </div>\n\n  <!-- Status Icons (hidden by default) -->\n  <div id="successIcon" hidden\n    class="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600">\n    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />\n    </svg>\n  </div>\n\n  <div id="errorIcon" hidden class="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600">\n    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />\n    </svg>\n  </div>\n\n  <!-- Status Message -->\n  <div class="space-y-2">\n    <h2 id="statusTitle" class="text-2xl sm:text-3xl font-bold text-gray-900">\n      Placeholder Title\n    </h2>\n    <p id="statusMessage" class="text-base sm:text-lg text-gray-600 max-w-md">\n      Placeholder message\n    </p>\n  </div>\n\n  <!-- Manual Redirect Button (hidden by default) -->\n  <div id="manualRedirectContainer" hidden>\n    <ui-button id="continueBtn" data-type="solid" data-size="large" data-color="blue">\n      Placeholder btn\n    </ui-button>\n  </div>\n</div>';

  // src/views/YnabAccountSelect/ynabAccountSelect.js
  var formatType = (type) => {
    if (!type)
      return "\u2014";
    return type.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
  };
  var formatBudget = (account) => account.isOnBudget ? "Budget" : "Tracking";
  var getAccountState = (account) => {
    if (account.isYnabClosed)
      return "closed";
    return "active";
  };
  async function initYnabAccountSelectView() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Step 2: Select Accounts to Migrate",
        description: "Choose which YNAB accounts should be included in the migration.",
        containerId: "pageHeader"
      }
    });
    const accounts = new Accounts();
    await accounts.loadFromDb();
    const accountsTable = document.getElementById("ynabAccountsTable");
    const continueBtn = document.getElementById("continueBtn");
    const selectAllBtn = document.getElementById("selectAllBtn");
    const deselectAllBtn = document.getElementById("deselectAllBtn");
    const showClosedToggle = document.getElementById("showClosedToggle");
    const showClosedToggleContainer = document.getElementById("showClosedToggleContainer");
    const selectedCount = document.getElementById("selectedCount");
    const totalCount = document.getElementById("totalCount");
    const sortState = { key: "status", direction: "desc" };
    const collator = new Intl.Collator(void 0, { numeric: true, sensitivity: "base" });
    const getVisibleAccounts = () => accounts.accounts.filter((account) => {
      if (!showClosedToggle.checked && account.isYnabClosed)
        return false;
      return true;
    });
    const getSortValue = (account, key) => {
      switch (key) {
        case "name":
          return account.name || "";
        case "type":
          return formatType(account.ynabType) || "";
        case "bankConnection":
          return account.isDirectImportLinked ? "Bank Linked" : "Manual";
        case "budget":
          return formatBudget(account) || "";
        case "balance":
          return account.balance ?? 0;
        case "status":
          return getAccountState(account);
        default:
          return "";
      }
    };
    const sortAccounts = (list) => {
      const { key, direction } = sortState;
      const multiplier = direction === "asc" ? 1 : -1;
      return [...list].sort((a, b) => {
        const aVal = getSortValue(a, key);
        const bVal = getSortValue(b, key);
        if (typeof aVal === "number" && typeof bVal === "number") {
          return (aVal - bVal) * multiplier;
        }
        return collator.compare(String(aVal), String(bVal)) * multiplier;
      });
    };
    const updateCounts = (visibleAccounts) => {
      const visible = visibleAccounts ?? getVisibleAccounts();
      const includedCount = visible.filter((account) => account.included).length;
      totalCount.textContent = visible.length;
      selectedCount.textContent = includedCount;
      toggleDisabled(continueBtn, includedCount === 0);
      continueBtn.textContent = includedCount > 0 ? `Continue with ${includedCount} account${includedCount !== 1 ? "s" : ""}` : "Select at least one account";
    };
    const columns = [
      {
        key: "included",
        type: "checkbox",
        header: "Migrate",
        minWidth: "90px",
        getValue: (account) => account.included,
        onChange: async (account, checked) => {
          await accounts.setInclusion(account.id, checked);
          requestAnimationFrame(() => accountsTable.updateRow(account.id));
          updateCounts();
        },
        mobileLabel: "Migrate",
        sortable: false
      },
      {
        key: "name",
        type: "text",
        header: "Account",
        minWidth: "220px",
        getValue: (account) => account.ynabName,
        tooltip: (account) => account.ynabName,
        mobileLabel: false,
        sortable: true
      },
      {
        key: "type",
        type: "text",
        header: "Type",
        minWidth: "140px",
        getValue: (account) => formatType(account.ynabType),
        mobileLabel: "Type",
        sortable: true
      },
      {
        key: "bankConnection",
        type: "custom",
        header: "Bank Link",
        minWidth: "140px",
        render: (account) => {
          const badge = document.createElement("span");
          badge.className = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border";
          if (account.isDirectImportLinked) {
            badge.classList.add("bg-green-50", "text-green-700", "border-green-200");
            badge.textContent = "Bank Linked";
          } else {
            badge.classList.add("bg-gray-50", "text-gray-600", "border-gray-200");
            badge.textContent = "Manual";
          }
          return badge;
        },
        mobileLabel: "Bank Link",
        sortable: true
      },
      {
        key: "budget",
        type: "text",
        header: "Budget",
        minWidth: "120px",
        getValue: (account) => formatBudget(account),
        mobileLabel: "Budget",
        sortable: true
      },
      {
        key: "balance",
        type: "text",
        header: "Balance",
        minWidth: "120px",
        getValue: (account) => currencyFormatter.format(account.balance),
        mobileLabel: "Balance",
        sortable: true
      },
      {
        key: "status",
        type: "custom",
        header: "Status",
        minWidth: "120px",
        render: (account) => {
          const state2 = getAccountState(account);
          const badge = document.createElement("span");
          badge.className = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border";
          if (state2 === "closed") {
            badge.classList.add("bg-amber-50", "text-amber-700", "border-amber-200");
            badge.textContent = "Closed";
          } else {
            badge.classList.add("bg-gray-50", "text-gray-600", "border-gray-200");
            badge.textContent = "Active";
          }
          return badge;
        },
        mobileLabel: "Status",
        sortable: true
      }
    ];
    const renderSortArrow = (direction) => {
      const rotation = direction === "asc" ? "rotate-180" : "";
      return `
      <svg class="w-3 h-3 ${rotation}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 14a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 14z" clip-rule="evenodd" />
      </svg>
    `;
    };
    const updateSortHeaders = () => {
      const headerCells = accountsTable.querySelectorAll("thead th");
      headerCells.forEach((th, index) => {
        const column = columns[index];
        if (!column || !column.sortable)
          return;
        const isActive = column.key === sortState.key;
        const label = column.header || "";
        th.classList.add("cursor-pointer", "select-none");
        th.innerHTML = isActive ? `<div class="inline-flex items-center gap-1">${label}${renderSortArrow(sortState.direction)}</div>` : `<div class="inline-flex items-center gap-1">${label}</div>`;
        th.onclick = () => {
          if (sortState.key === column.key) {
            sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
          } else {
            sortState.key = column.key;
            sortState.direction = "asc";
          }
          refreshTable();
        };
      });
    };
    const refreshTable = () => {
      const visible = getVisibleAccounts();
      const sorted = sortAccounts(visible);
      accountsTable.data = sorted;
      updateCounts(visible);
      requestAnimationFrame(updateSortHeaders);
    };
    accountsTable.columns = columns;
    refreshTable();
    const closedCount = accounts.accounts.filter((account) => account.isYnabClosed).length;
    if (showClosedToggleContainer && closedCount === 0) {
      showClosedToggle.checked = false;
      showClosedToggleContainer.classList.add("hidden");
    } else if (showClosedToggleContainer) {
      showClosedToggle.checked = true;
      refreshTable();
    }
    showClosedToggle.addEventListener("change", refreshTable);
    selectAllBtn.addEventListener("click", async () => {
      const visible = getVisibleAccounts();
      await accounts.setInclusionFor(visible.map((account) => account.id), true);
      accountsTable.refresh();
      updateCounts(visible);
    });
    deselectAllBtn.addEventListener("click", async () => {
      const visible = getVisibleAccounts();
      await accounts.setInclusionFor(visible.map((account) => account.id), false);
      accountsTable.refresh();
      updateCounts(visible);
    });
    continueBtn.addEventListener("click", async () => {
      try {
        LoadingOverlay_default.show("Fetching transaction data...");
        const visibleAccounts = getVisibleAccounts();
        const accountsToMigrate = visibleAccounts.filter((acc) => acc.included);
        const allAccountsNotVisible = accounts.accounts.filter((acc) => !visibleAccounts.includes(acc));
        const accountsToRemove = [...allAccountsNotVisible, ...visibleAccounts.filter((acc) => !acc.included)];
        if (accountsToRemove.length > 0) {
          LoadingOverlay_default.show(`Removing ${accountsToRemove.length} excluded accounts...`);
          await accounts.removeAccounts(accountsToRemove.map((acc) => acc.id));
        }
        let fetchedCount = 0;
        await Promise.all(accountsToMigrate.map(async (account) => {
          try {
            LoadingOverlay_default.show(`Fetching transactions for ${account.ynabName} (${++fetchedCount}/${accountsToMigrate.length})...`);
            const transactions = await getTransactions(account.id);
            account.transactions = Array.from(transactions);
            await accounts.updateAccount(account);
          } catch (error) {
            console.error(`Failed to fetch transactions for account ${account.ynabName}:`, error);
            throw error;
          }
        }));
        LoadingOverlay_default.hide();
        navigate("/map-accounts");
      } catch (error) {
        LoadingOverlay_default.hide();
        console.error("Failed to fetch transaction data:", error);
        alert("Failed to fetch transaction data. Please try again.");
      }
    });
  }

  // src/views/YnabAccountSelect/ynabAccountSelect.html
  var ynabAccountSelect_default = '<div id="pageLayout"></div>\n\n<div class="flex flex-col min-h-0 h-[calc(100dvh-220px)] max-h-[calc(100dvh-220px)] overflow-hidden">\n  <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4 sm:p-6 mb-4">\n    <div class="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">\n      <div class="flex flex-wrap items-center gap-3">\n        <label id="showClosedToggleContainer" class="inline-flex items-center gap-2 text-sm text-gray-700">\n          <input id="showClosedToggle" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">\n          Show Closed Accounts\n        </label>\n        <div class="flex items-center gap-2">\n          <ui-button id="selectAllBtn" data-type="secondary" data-size="small">Select All</ui-button>\n          <ui-button id="deselectAllBtn" data-type="secondary" data-size="small">Deselect All</ui-button>\n        </div>\n      </div>\n      <div class="text-sm text-gray-600">\n        Selected <span id="selectedCount" class="font-medium text-gray-900">0</span> of\n        <span id="totalCount" class="font-medium text-gray-900">0</span> accounts\n      </div>\n    </div>\n  </div>\n\n  <div class="flex-1 min-h-0 rounded-lg border border-gray-100 bg-white">\n    <ui-table id="ynabAccountsTable" data-mobile-breakpoint="lg" data-enable-selection="false" data-row-id-key="id" data-row-click-toggle="true" style="height: 100%; display: block;"></ui-table>\n  </div>\n\n  <div class="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">\n    <ui-button id="continueBtn"></ui-button>\n    <p class="text-xs sm:text-sm text-gray-600">\n      At least one account must be selected to continue\n    </p>\n  </div>\n</div>\n';

  // src/views/AccountMapping/accountMapping.js
  var normalize = (value) => String(value || "").toLowerCase();
  var guessMonarchMapping = (account) => {
    const name = normalize(account.ynabName);
    const ynabType = account.ynabType;
    let type = null;
    let subtype = null;
    let confidence = 0.5;
    switch (ynabType) {
      case AccountType.CHECKING:
        type = "depository";
        subtype = "checking";
        confidence = 0.9;
        break;
      case AccountType.SAVINGS:
        type = "depository";
        subtype = "savings";
        confidence = 0.9;
        break;
      case AccountType.CASH:
        type = "depository";
        subtype = "cash_management";
        confidence = 0.75;
        break;
      case AccountType.CREDIT_CARD:
        type = "credit";
        subtype = "credit_card";
        confidence = 0.9;
        break;
      case AccountType.LINE_OF_CREDIT:
        type = "loan";
        subtype = "line_of_credit";
        confidence = 0.85;
        break;
      case AccountType.MORTGAGE:
        type = "loan";
        subtype = "mortgage";
        confidence = 0.9;
        break;
      case AccountType.AUTO_LOAN:
        type = "loan";
        subtype = "auto";
        confidence = 0.85;
        break;
      case AccountType.STUDENT_LOAN:
        type = "loan";
        subtype = "student";
        confidence = 0.85;
        break;
      case AccountType.PERSONAL_LOAN:
      case AccountType.MEDICAL_DEBT:
      case AccountType.OTHER_DEBT:
        type = "loan";
        subtype = "consumer";
        confidence = 0.7;
        break;
      case AccountType.OTHER_ASSET:
        type = "other_asset";
        subtype = "other";
        confidence = 0.6;
        break;
      case AccountType.OTHER_LIABILITY:
        type = "other_liability";
        subtype = "other";
        confidence = 0.6;
        break;
      default:
        break;
    }
    if (name.includes("mortgage")) {
      type = "loan";
      subtype = "mortgage";
      confidence = Math.max(confidence, 0.85);
    }
    if (name.includes("line of credit") || name.includes("loc")) {
      type = "loan";
      subtype = "line_of_credit";
      confidence = Math.max(confidence, 0.8);
    }
    if (name.includes("auto") || name.includes("car")) {
      type = "loan";
      subtype = "auto";
      confidence = Math.max(confidence, 0.8);
    }
    if (name.includes("student")) {
      type = "loan";
      subtype = "student";
      confidence = Math.max(confidence, 0.8);
    }
    if (name.includes("credit") || name.includes("visa") || name.includes("amex") || name.includes("mastercard")) {
      type = "credit";
      subtype = "credit_card";
      confidence = Math.max(confidence, 0.8);
    }
    if (name.includes("checking")) {
      type = "depository";
      subtype = "checking";
      confidence = Math.max(confidence, 0.8);
    }
    if (name.includes("savings")) {
      type = "depository";
      subtype = "savings";
      confidence = Math.max(confidence, 0.8);
    }
    if (name.includes("ira") || name.includes("401k") || name.includes("brokerage") || name.includes("roth")) {
      type = "brokerage";
      if (name.includes("roth") && name.includes("401")) {
        subtype = "roth_401k";
      } else if (name.includes("401k")) {
        subtype = "st_401k";
      } else if (name.includes("ira")) {
        subtype = name.includes("roth") ? "roth" : "ira";
      } else if (name.includes("brokerage")) {
        subtype = "brokerage";
      }
      confidence = Math.max(confidence, 0.75);
    }
    return { type, subtype, confidence };
  };
  async function initAccountMappingView() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: true
      },
      header: {
        title: "Step 3: Review Monarch Account Details",
        description: "Approve the suggested Monarch mappings before continuing.",
        containerId: "pageHeader"
      }
    });
    const accounts = new Accounts();
    await accounts.loadFromDb();
    const mappingConfidence = /* @__PURE__ */ new Map();
    const cardsContainer = document.getElementById("accountMappingTable");
    const statusFilterSelect = document.getElementById("statusFilterSelect");
    const sortSelect = document.getElementById("sortSelect");
    const mappingContinueBtn = document.getElementById("mappingContinueBtn");
    const accountsToReview = accounts.accounts.filter((account) => account.included);
    const defaultMappingUpdates = accountsToReview.filter((account) => !account.monarchType || !account.monarchSubtype).map((account) => {
      const guess = guessMonarchMapping(account);
      mappingConfidence.set(account.id, guess.confidence);
      if (!account.monarchType && guess.type)
        account.monarchType = guess.type;
      if (!account.monarchSubtype && guess.subtype)
        account.monarchSubtype = guess.subtype;
      return accounts.updateAccount(account);
    });
    await Promise.all(defaultMappingUpdates);
    const sortState = { key: "ynab", direction: "asc" };
    const collator = new Intl.Collator(void 0, { numeric: true, sensitivity: "base" });
    const getStatus = (account) => {
      if (account.isUserApproved)
        return "approved";
      if (!String(account.monarchName).trim() || !account.monarchType || !account.monarchSubtype) {
        return "needs-review";
      }
      return "pending-approval";
    };
    const getSortValue = (account, key) => {
      switch (key) {
        case "approved":
          return account.isUserApproved ? 1 : 0;
        case "ynab":
          return account.ynabName || "";
        case "monarch":
          return account.monarchName || "";
        case "type":
          return account.monarchType || "";
        case "subtype":
          return account.monarchSubtype || "";
        case "status":
          return getStatus(account);
        default:
          return "";
      }
    };
    const sortAccounts = (list) => {
      const { key, direction } = sortState;
      const multiplier = direction === "asc" ? 1 : -1;
      return [...list].sort((a, b) => {
        const aVal = getSortValue(a, key);
        const bVal = getSortValue(b, key);
        if (typeof aVal === "number" && typeof bVal === "number") {
          return (aVal - bVal) * multiplier;
        }
        return collator.compare(String(aVal), String(bVal)) * multiplier;
      });
    };
    const getFilteredAccounts = () => {
      const statusFilter = statusFilterSelect.value;
      return accountsToReview.filter((account) => {
        const status = getStatus(account);
        const matchesStatus = statusFilter === "all" || statusFilter === status;
        return matchesStatus;
      });
    };
    const updateCounts = () => {
      const approvalComplete = accountsToReview.every((acc) => acc.isUserApproved);
      mappingContinueBtn.textContent = approvalComplete ? `Next Step` : "Approve All to Continue";
      mappingContinueBtn.disabled = !approvalComplete;
      if (!approvalComplete) {
        mappingContinueBtn.classList.add("opacity-50", "cursor-not-allowed", "pointer-events-none");
      } else {
        mappingContinueBtn.classList.remove("opacity-50", "cursor-not-allowed", "pointer-events-none");
      }
    };
    const renderCard = (account) => {
      const container = document.createElement("div");
      container.className = "bg-white border border-gray-200 rounded-lg p-6 mb-4";
      const isApproved = account.isUserApproved;
      const needsReview = !String(account.monarchName).trim() || !account.monarchType || !account.monarchSubtype;
      const ynabTypeName = Object.entries(AccountType).find(([, value]) => value === account.ynabType)?.[0]?.replace(/_/g, " ") || account.ynabType;
      const grid = document.createElement("div");
      grid.className = "space-y-4 mb-4";
      const createRow = (ynabLabel, ynabValue, monarchLabel, monarchField, showArrow = true) => {
        const row = document.createElement("div");
        row.className = "grid grid-cols-[1fr_60px_1fr] gap-4 items-start";
        const leftCell = document.createElement("div");
        leftCell.innerHTML = `
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">${ynabLabel}</label>
        <div class="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-gray-900 text-sm">${ynabValue}</div>
      `;
        const middleCell = document.createElement("div");
        middleCell.className = "flex justify-center items-start pt-7";
        middleCell.textContent = showArrow ? "\u2192" : "";
        middleCell.style.color = "#9ca3af";
        middleCell.style.fontSize = "18px";
        const rightCell = document.createElement("div");
        rightCell.appendChild(monarchField);
        row.appendChild(leftCell);
        row.appendChild(middleCell);
        row.appendChild(rightCell);
        grid.appendChild(row);
      };
      const nameField = document.createElement("div");
      nameField.innerHTML = `
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Monarch Name</label>
      <input type="text" value="${account.monarchName || ""}" ${isApproved ? "disabled" : ""} 
        class="w-full px-3 py-2 border rounded text-sm ${isApproved ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed" : "bg-white"} ${!String(account.monarchName || "").trim() ? "border-yellow-400" : "border-gray-300"}" 
        data-field="name">
    `;
      const nameInput = nameField.querySelector("input");
      nameInput.addEventListener("change", async (e) => {
        const nextName = String(e.target.value || "");
        if (!nextName.trim()) {
          account._monarchName = "";
        } else {
          account._monarchName = nextName;
        }
        await accounts.updateAccount(account);
        refreshCards();
      });
      createRow("YNAB Name", account.ynabName, "Monarch Name", nameField, true);
      const typeField = document.createElement("div");
      typeField.innerHTML = `
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Type</label>
      <select ${isApproved ? "disabled" : ""} 
        class="w-full px-3 py-2 border rounded text-sm ${isApproved ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed" : "bg-white"} ${!account.monarchType ? "border-yellow-400" : "border-gray-300"}" 
        data-field="type">
        <option value="">Select type...</option>
      </select>
    `;
      const typeSelect = typeField.querySelector("select");
      monarchAccountTypes_default.data.forEach((type) => {
        const option = document.createElement("option");
        option.value = type.typeName;
        option.textContent = type.typeDisplay;
        option.selected = account.monarchType === type.typeName;
        typeSelect.appendChild(option);
      });
      typeSelect.addEventListener("change", async (e) => {
        account.monarchType = e.target.value;
        account.monarchSubtype = "";
        updateSubtypes();
        await accounts.updateAccount(account);
        refreshCards();
      });
      createRow("YNAB Type", ynabTypeName, "Type", typeField, true);
      const subtypeRow = document.createElement("div");
      subtypeRow.className = "grid grid-cols-[1fr_60px_1fr] gap-4 items-start";
      const subtypeLeftCell = document.createElement("div");
      subtypeLeftCell.className = "";
      const subtypeMiddleCell = document.createElement("div");
      subtypeMiddleCell.className = "flex justify-center items-start pt-7";
      subtypeMiddleCell.textContent = "";
      subtypeMiddleCell.style.color = "#9ca3af";
      const subtypeField = document.createElement("div");
      subtypeField.innerHTML = `
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Subtype</label>
      <select ${isApproved ? "disabled" : ""} 
        class="w-full px-3 py-2 border rounded text-sm ${isApproved ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed" : "bg-white"} ${!account.monarchSubtype ? "border-yellow-400" : "border-gray-300"}" 
        data-field="subtype">
        <option value="">Select subtype...</option>
      </select>
    `;
      const subtypeSelect = subtypeField.querySelector("select");
      const updateSubtypes = () => {
        subtypeSelect.innerHTML = '<option value="">Select subtype...</option>';
        const selectedType = typeSelect.value;
        const typeData = monarchAccountTypes_default.data.find((t) => t.typeName === selectedType);
        if (typeData && typeData.subtypes) {
          typeData.subtypes.forEach((subtype) => {
            const option = document.createElement("option");
            option.value = subtype.name;
            option.textContent = subtype.display;
            option.selected = account.monarchSubtype === subtype.name;
            subtypeSelect.appendChild(option);
          });
        }
        account.monarchSubtype = subtypeSelect.value;
      };
      updateSubtypes();
      subtypeSelect.addEventListener("change", async (e) => {
        account.monarchSubtype = e.target.value;
        await accounts.updateAccount(account);
        refreshCards();
      });
      const subtypeRightCell = document.createElement("div");
      subtypeRightCell.appendChild(subtypeField);
      subtypeRow.appendChild(subtypeLeftCell);
      subtypeRow.appendChild(subtypeMiddleCell);
      subtypeRow.appendChild(subtypeRightCell);
      grid.appendChild(subtypeRow);
      const closedField = document.createElement("div");
      closedField.innerHTML = `
      <div class="flex items-center gap-2 mb-1">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Closed</label>
        <div class="group relative">
          <svg class="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <div class="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 w-48 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none z-10">
            <p class="break-words">Mark whether this Monarch account is closed or open.</p>
            <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button 
          type="button"
          class="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors border ${!account.isMonarchClosed ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"} ${isApproved ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}"
          data-field="open"
          ${isApproved ? "disabled" : ""}>
          Open
        </button>
        <button 
          type="button"
          class="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors border ${account.isMonarchClosed ? "bg-red-100 border-red-300 text-red-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"} ${isApproved ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}"
          data-field="closed"
          ${isApproved ? "disabled" : ""}>
          Closed
        </button>
      </div>
    `;
      const openBtn = closedField.querySelector('button[data-field="open"]');
      const closedBtn = closedField.querySelector('button[data-field="closed"]');
      openBtn.addEventListener("click", async () => {
        account.isMonarchClosed = false;
        await accounts.updateAccount(account);
        refreshCards();
      });
      closedBtn.addEventListener("click", async () => {
        account.isMonarchClosed = true;
        await accounts.updateAccount(account);
        refreshCards();
      });
      createRow("Closed", account.isYnabClosed ? "Closed" : "Open", "Closed", closedField, true);
      container.appendChild(grid);
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "flex justify-end gap-2";
      const confirmBtn = document.createElement("button");
      confirmBtn.className = `px-4 py-2 rounded-md text-sm font-medium border transition-colors ${needsReview ? "bg-yellow-50 text-yellow-800 border-yellow-300 cursor-not-allowed" : isApproved ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"}`;
      confirmBtn.textContent = needsReview ? "Needs Review" : isApproved ? "Modify" : "Approve";
      confirmBtn.disabled = needsReview;
      confirmBtn.addEventListener("click", async () => {
        if (!isApproved && (!account.monarchType || !account.monarchSubtype)) {
          alert("Please select both Type and Subtype before confirming");
          return;
        }
        account.isUserApproved = !account.isUserApproved;
        await accounts.updateAccount(account);
        refreshCards();
      });
      buttonContainer.appendChild(confirmBtn);
      container.appendChild(buttonContainer);
      return container;
    };
    const refreshCards = () => {
      const filtered = getFilteredAccounts();
      const sorted = sortAccounts(filtered);
      cardsContainer.innerHTML = "";
      if (sorted.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "flex flex-col items-center justify-center h-64 text-gray-500";
        emptyState.innerHTML = `
        <svg class="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-lg font-medium">No accounts found</p>
        <p class="text-sm">Try adjusting your filters or search terms</p>
      `;
        cardsContainer.appendChild(emptyState);
      } else {
        sorted.forEach((account) => {
          cardsContainer.appendChild(renderCard(account));
        });
      }
      updateCounts(sorted);
    };
    sortSelect.value = sortState.key;
    statusFilterSelect.addEventListener("change", refreshCards);
    sortSelect.addEventListener("change", () => {
      sortState.key = sortSelect.value;
      sortState.direction = "asc";
      refreshCards();
    });
    mappingContinueBtn.addEventListener("click", () => navigate("/review"));
    refreshCards();
  }

  // src/views/AccountMapping/accountMapping.html
  var accountMapping_default = '<div id="pageLayout"></div>\n\n<div class="flex flex-col min-h-0 h-[calc(100dvh-220px)] max-h-[calc(100dvh-220px)] overflow-hidden">\n    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 mb-4">\n        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">\n            <div class="flex items-center gap-2">\n                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>\n                </svg>\n                <select id="statusFilterSelect"\n                    class="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">\n                    <option value="all">All Statuses</option>\n                    <option value="approved">Approved</option>\n                    <option value="pending-approval">Pending Approval</option>\n                    <option value="needs-review">Needs Review</option>\n                </select>\n            </div>\n            <div class="flex items-center gap-2">\n                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M9 12h6m-6 6h6"></path>\n                </svg>\n                <select id="sortSelect"\n                    class="border rounded w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">\n                    <option value="ynab">Sort by YNAB</option>\n                    <option value="monarch">Sort by Monarch</option>\n                    <option value="type">Sort by Type</option>\n                    <option value="subtype">Sort by Subtype</option>\n                    <option value="status">Sort by Status</option>\n                    <option value="approved">Sort by Approved</option>\n                </select>\n            </div>\n        </div>\n    </div>\n\n    <div class="flex-1 min-h-0 overflow-y-auto space-y-3 sm:space-y-4">\n        <div id="accountMappingTable"></div>\n    </div>\n\n    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mt-4">\n        <ui-button id="mappingContinueBtn"></ui-button>\n    </div>\n</div>';

  // src/views/DataManagement/dataManagementData.js
  var YNAB_AUTH_STATUS_ENDPOINT = "/.netlify/functions/ynabAuthStatus";
  var DEFAULT_YNAB_AUTH_STATUS = Object.freeze({
    authenticated: false,
    hasAccessToken: false,
    hasRefreshToken: false
  });
  var ynabAuthStatusCache = null;
  var ynabAuthStatusPromise = null;
  async function fetchYnabAuthStatus() {
    if (ynabAuthStatusCache) {
      return ynabAuthStatusCache;
    }
    if (!ynabAuthStatusPromise) {
      ynabAuthStatusPromise = (async () => {
        try {
          const response = await fetch(YNAB_AUTH_STATUS_ENDPOINT, { headers: { "Cache-Control": "no-store" } });
          if (!response.ok) {
            throw new Error(`Status ${response.status}`);
          }
          const payload = await response.json();
          ynabAuthStatusCache = {
            authenticated: Boolean(payload.authenticated),
            hasAccessToken: Boolean(payload.hasAccessToken),
            hasRefreshToken: Boolean(payload.hasRefreshToken)
          };
        } catch (error) {
          console.warn("Unable to fetch YNAB auth status", error);
          ynabAuthStatusCache = DEFAULT_YNAB_AUTH_STATUS;
        } finally {
          ynabAuthStatusPromise = null;
        }
        return ynabAuthStatusCache;
      })();
    }
    return ynabAuthStatusPromise;
  }
  async function getStateSummary() {
    const accountCount = state_default.hasAccounts() ? state_default.getAccountsSingleton().length() : 0;
    const ynabAuth = await fetchYnabAuthStatus();
    const hasMonarchAuth = !!state_default.credentials?.apiToken;
    const hasData = accountCount > 0 || ynabAuth.authenticated || hasMonarchAuth;
    return { accountCount, hasYnabAuth: ynabAuth.authenticated, hasMonarchAuth, hasData };
  }
  async function getSessionStorageSummary() {
    const ynabAuth = await fetchYnabAuthStatus();
    const hasYnabAccounts = !!state_default.getPersistedAccounts();
    const hasMonarchAccounts = !!sessionStorage.getItem("monarch_accounts");
    const hasMonarchToken = !!sessionStorage.getItem("monarch_api_token");
    const hasMonarchUuid = !!sessionStorage.getItem("monarch_device_uuid");
    const hasExpectedState = !!sessionStorage.getItem("ynab_oauth_expected_state");
    const hasAnyData = hasYnabAccounts || hasMonarchAccounts || hasMonarchToken || hasMonarchUuid || hasExpectedState || ynabAuth.hasAccessToken || ynabAuth.hasRefreshToken;
    return {
      ynabAuth,
      hasYnabAccounts,
      hasMonarchAccounts,
      hasMonarchToken,
      hasMonarchUuid,
      hasExpectedState,
      hasAnyData
    };
  }
  function getLocalStorageSummary() {
    const hasMonarchEmail = !!sessionStorage.getItem("monarch_email");
    const hasMonarchPassword = !!sessionStorage.getItem("monarch_pwd_enc");
    const hasMonarchToken = !!sessionStorage.getItem("monarch_token");
    const hasMonarchUuid = !!sessionStorage.getItem("monarch_uuid");
    const rememberMe = false;
    const appState = state_default.loadAppState();
    let lastPath = null;
    let lastPathTimestamp = null;
    if (appState) {
      lastPath = appState.lastPath;
      lastPathTimestamp = appState.timestamp;
    }
    const hasCredentials = hasMonarchEmail || hasMonarchPassword || hasMonarchToken || hasMonarchUuid;
    const hasAnyData = hasCredentials || rememberMe || lastPath;
    return {
      hasMonarchEmail,
      hasMonarchPassword,
      hasMonarchToken,
      hasMonarchUuid,
      rememberMe,
      lastPath,
      lastPathTimestamp,
      hasCredentials,
      hasAnyData
    };
  }
  function collectExportData(state2) {
    const allData = {
      exportedAt: new Date().toISOString(),
      state: state2,
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
    const filename = `ynab-monarch-data-${Date.now()}.json`;
    return { blob, filename };
  }
  function clearAllData(state2) {
    state2.clearLocalStorage();
    clearAppState();
    sessionStorage.clear();
    state2.credentials.clear();
    state2.clearAccounts();
    state2.oauth.clear();
  }

  // src/views/DataManagement/dataManagement.js
  function initDataManagementView() {
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: false
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
    document.getElementById("exportDataBtn").addEventListener("click", handleExportData);
    document.getElementById("clearAllDataBtn").addEventListener("click", () => openModal("confirmClearModal"));
    window.toggleCollapse = toggleCollapse;
  }
  function openModal(id) {
    const modal = document.getElementById(id);
    modal.open();
    setTimeout(() => {
      const footerContainer = modal._modalOverlay?.querySelector(".ui-modal-footer");
      const cancelBtn = footerContainer?.querySelector("#cancelBtn");
      const applyBtn = footerContainer?.querySelector("#applyBtn");
      if (cancelBtn) {
        cancelBtn.onclick = () => modal.close();
      }
      if (applyBtn) {
        applyBtn.onclick = () => {
          handleClearAllData();
          displayStateData();
          displaySessionStorageData();
          displayLocalStorageData();
          modal.close();
        };
      }
    }, 100);
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
  async function displayStateData() {
    const container = document.getElementById("stateDataSection");
    if (!container)
      return;
    try {
      container.innerHTML = '<p class="text-gray-500 text-sm italic">Loading\u2026</p>';
      const { accountCount, monarchCount, hasYnabAuth, hasMonarchAuth, hasData } = await getStateSummary();
      if (!hasData) {
        container.innerHTML = '<p class="text-gray-500 text-sm italic">No application state data</p>';
        return;
      }
      const html = `
      <div class="space-y-3">
        <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-sm text-blue-800 font-medium">Data Summary</p>
        </div>
        
        <div class="space-y-2">
          ${accountCount > 0 ? `
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">YNAB Data</p>
            <p class="text-sm text-gray-600 mt-1">
              \u2713 ${accountCount} account${accountCount !== 1 ? "s" : ""} imported
            </p>
          </div>
          ` : ""}

          ${monarchCount > 0 ? `
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">Monarch Money Data</p>
            <p class="text-sm text-gray-600 mt-1">
              \u2713 ${monarchCount} account${monarchCount !== 1 ? "s" : ""} synced
            </p>
          </div>
          ` : ""}

          ${hasYnabAuth || hasMonarchAuth ? `
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">Authentication Status</p>
            <p class="text-sm text-gray-600 mt-1">
              ${hasYnabAuth ? "YNAB: \u2713 Connected<br/>" : ""}
              ${hasMonarchAuth ? "Monarch: \u2713 Connected" : ""}
            </p>
          </div>
          ` : ""}
        </div>
      </div>
    `;
      container.innerHTML = html;
    } catch (error) {
      console.error("Unable to render state data", error);
      container.innerHTML = '<p class="text-red-500 text-sm">Failed to load application state.</p>';
    }
  }
  async function displaySessionStorageData() {
    const container = document.getElementById("sessionStorageSection");
    if (!container)
      return;
    try {
      container.innerHTML = '<p class="text-gray-500 text-sm italic">Loading\u2026</p>';
      const summary = await getSessionStorageSummary();
      if (!summary.hasAnyData) {
        container.innerHTML = '<p class="text-gray-500 text-sm italic">No session storage data</p>';
        return;
      }
      const html = `
      <div class="space-y-3">
        <div class="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p class="text-sm text-purple-800 font-medium">Session Data Overview</p>
          <p class="text-xs text-purple-700 mt-1">Data in session storage is cleared when this tab closes</p>
        </div>

        <div class="space-y-2">
          ${summary.ynabAuth.hasAccessToken || summary.ynabAuth.hasRefreshToken ? `
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">YNAB Authentication</p>
            <p class="text-sm text-gray-600 mt-1">
              ${summary.ynabAuth.hasAccessToken ? "Access Token: \u2713 Active (HttpOnly cookie)<br/>" : "Access Token: Not Active<br/>"}
              ${summary.ynabAuth.hasRefreshToken ? "Refresh Token: \u2713 Active (HttpOnly cookie)" : "Refresh Token: Not Active"}
            </p>
            <p class="text-xs text-gray-500 mt-2">Tokens never enter sessionStorage\u2014they live in secure HttpOnly cookies managed by Netlify Functions.</p>
          </div>
          ` : ""}

          ${summary.hasYnabAccounts || summary.hasMonarchAccounts ? `
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">Account Data</p>
            <p class="text-sm text-gray-600 mt-1">
              ${summary.hasYnabAccounts ? "YNAB Accounts: \u2713 Cached<br/>" : ""}
              ${summary.hasMonarchAccounts ? "Monarch Accounts: \u2713 Cached" : ""}
            </p>
          </div>
          ` : ""}

          ${summary.hasMonarchToken || summary.hasMonarchUuid ? `
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">Monarch Authentication</p>
            <p class="text-sm text-gray-600 mt-1">
              ${summary.hasMonarchToken ? "API Token: \u2713 Stored<br/>" : ""}
              ${summary.hasMonarchUuid ? "Device UUID: \u2713 Stored" : ""}
            </p>
          </div>
          ` : ""}

          ${summary.hasExpectedState ? `
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">OAuth Flow</p>
            <p class="text-sm text-gray-600 mt-1">
              CSRF Token: \u2713 Stored
            </p>
          </div>
          ` : ""}
        </div>
      </div>
    `;
      container.innerHTML = html;
    } catch (error) {
      console.error("Unable to render session storage data", error);
      container.innerHTML = '<p class="text-red-500 text-sm">Failed to load session storage data.</p>';
    }
  }
  function displayLocalStorageData() {
    const container = document.getElementById("localStorageSection");
    if (!container)
      return;
    const summary = getLocalStorageSummary();
    if (!summary.hasAnyData) {
      container.innerHTML = '<p class="text-gray-500 text-sm italic">No local storage data</p>';
      return;
    }
    const html = `
    <div class="space-y-3">
      <div class="p-3 bg-green-50 rounded-lg border border-green-200">
        <p class="text-sm text-green-800 font-medium">Persistent Data Overview</p>
        <p class="text-xs text-green-700 mt-1">Data in local storage persists across browser sessions</p>
      </div>

      <div class="space-y-2">
        ${summary.hasCredentials ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">Monarch Authentication</p>
          <p class="text-sm text-gray-600 mt-1">
            ${summary.hasMonarchEmail ? "Email Address: \u2713 Stored<br/>" : ""}
            ${summary.hasMonarchPassword ? "Encrypted Password: \u2713 Stored<br/>" : ""}
            ${summary.hasMonarchToken ? "API Token: \u2713 Stored<br/>" : ""}
            ${summary.hasMonarchUuid ? "Device UUID: \u2713 Stored" : ""}
          </p>
        </div>
        ` : ""}

        ${summary.rememberMe ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">User Preferences</p>
          <p class="text-sm text-gray-600 mt-1">
            Remember Me: \u2713 Enabled
          </p>
        </div>
        ` : ""}

        ${summary.lastPath ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">Session Information</p>
          <p class="text-sm text-gray-600 mt-1">
            Last Page: ${escapeHtml2(summary.lastPath)}<br/>
            Last Visit: ${summary.lastPathTimestamp ? new Date(summary.lastPathTimestamp).toLocaleString() : "Not available"}
          </p>
        </div>
        ` : ""}
      </div>
    </div>
  `;
    container.innerHTML = html;
  }
  function handleExportData() {
    const { blob, filename } = collectExportData(state_default);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  function handleClearAllData() {
    try {
      clearAllData(state_default);
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("An error occurred while clearing data. Please try again.");
    }
  }
  function escapeHtml2(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // src/views/DataManagement/dataManagement.html
  var dataManagement_default = '<div id="pageLayout"></div>\n\n<!-- Warning Banner -->\n<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">\n  <div class="flex items-start">\n    <svg class="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">\n      <path fill-rule="evenodd"\n        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"\n        clip-rule="evenodd" />\n    </svg>\n    <div>\n      <h3 class="text-sm font-medium text-yellow-800 mb-1">Privacy Notice</h3>\n      <p class="text-sm text-yellow-700">\n        All data shown below is stored locally in your browser only. No data is sent to our servers or any third-party\n        services.\n      </p>\n    </div>\n  </div>\n</div>\n\n<!-- Data Sections Container -->\n<div class="space-y-6">\n\n  <!-- Application State Section -->\n  <div class="bg-white rounded-lg shadow-md overflow-hidden">\n    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">\n      <h2 class="text-xl font-semibold text-white flex items-center">\n        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />\n        </svg>\n        Application State\n      </h2>\n      <p class="text-blue-100 text-sm mt-1">Current session data and account information</p>\n    </div>\n    <div id="stateDataSection" class="p-6">\n      <!-- Populated by JavaScript -->\n    </div>\n  </div>\n\n  <!-- Session Storage Section -->\n  <div class="bg-white rounded-lg shadow-md overflow-hidden">\n    <div class="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">\n      <h2 class="text-xl font-semibold text-white flex items-center">\n        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />\n        </svg>\n        Session Storage\n      </h2>\n      <p class="text-purple-100 text-sm mt-1">Data cleared when browser tab is closed</p>\n    </div>\n    <div id="sessionStorageSection" class="p-6">\n      <!-- Populated by JavaScript -->\n    </div>\n  </div>\n\n  <!-- Local Storage Section -->\n  <div class="bg-white rounded-lg shadow-md overflow-hidden">\n    <div class="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">\n      <h2 class="text-xl font-semibold text-white flex items-center">\n        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />\n        </svg>\n        Local Storage\n      </h2>\n      <p class="text-green-100 text-sm mt-1">Persistent data saved across sessions</p>\n    </div>\n    <div id="localStorageSection" class="p-6">\n      <!-- Populated by JavaScript -->\n    </div>\n  </div>\n\n</div>\n\n<!-- Action Buttons -->\n<div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">\n  <ui-button id="exportDataBtn" data-type="outline" data-color="grey">\n    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />\n    </svg>\n    Export Data (JSON)\n  </ui-button>\n\n  <ui-button id="clearAllDataBtn" data-type="solid" data-color="red">\n    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />\n    </svg>\n    Clear All Data\n  </ui-button>\n</div>\n\n<!-- Confirmation Modal -->\n<ui-modal id="confirmClearModal" has-footer>\n  <div slot="title">\n    <svg class="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"\n        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />\n    </svg>\n    <h3>Clear All Data?</h3>\n  </div>\n  <div slot="content">\n    <p>\n      This action cannot be undone. All your YNAB accounts, Monarch credentials, and session data will be\n      permanently deleted from your browser.\n    </p>\n  </div>\n  <div slot="footer">\n    <ui-button id="cancelBtn" data-type="outline" data-color="grey">Cancel</ui-button>\n    <ui-button id="applyBtn" data-type="solid" data-color="red">Yes, wipe my data</ui-button>\n  </div>\n</ui-modal>';

  // src/components/FaqCard.js
  function createFaqCard({ question, body }, index) {
    const card = document.createElement("div");
    card.className = "faq-item w-full border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors";
    const button = document.createElement("button");
    button.className = "faq-toggle w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left";
    button.dataset.index = String(index);
    button.innerHTML = `
    <span class="font-semibold text-gray-900">${question}</span>
    <svg class="faq-icon w-5 h-5 text-gray-500 flex-shrink-0 ml-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
  `;
    card.appendChild(button);
    const content = document.createElement("div");
    content.className = "faq-content hidden overflow-hidden max-h-0 transition-all duration-300";
    content.dataset.index = String(index);
    content.innerHTML = `
    <div class="px-5 py-4 bg-gray-50 border-t border-gray-200 text-gray-700 text-sm space-y-2">
      ${body}
    </div>
  `;
    card.appendChild(content);
    return card;
  }

  // src/views/Faq/faq.js
  var FAQ_ITEMS = [
    {
      question: "Does this tool create bank-connected accounts in Monarch Money?",
      body: `<p>No, not directly; this tool can only create <strong>manual</strong> accounts in Monarch Money. However, there are two solutions:
            <br/><br/>(1) Migrate data to an <strong>existing</strong> bank-connected account.
            <br/><br/>(2) Use this tool to create a new manual account, then in Monarch Money, use their <strong>Transfer</strong> tool to migrate data from the manual account to the bank-connected account.</p>
          <p class="text-xs text-gray-600">Follow Monarch Money's official guide on their Transfer tool to migrate data between accounts: <a href="https://help.monarch.com/hc/en-us/articles/14329385694484-Transfer-Balance-and-or-Transaction-History-to-Another-Account" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">https://help.monarch.com/hc/en-us/articles/14329385694484-Transfer-Balance-and-or-Transaction-History-to-Another-Account</a></p>`
    },
    {
      question: "Is my data secure and private?",
      body: `<p>Yes, your data is completely secure. We use end-to-end encryption and never store your financial information on our servers. Your data is processed temporarily during migration and then permanently deleted.</p>
          <p class="text-xs text-gray-600">We comply with industry-standard security protocols and are committed to protecting your privacy.</p>`
    },
    {
      question: "How long does the migration process take?",
      body: `<p>The migration typically takes 5-15 minutes depending on the amount of data in your YNAB account. Most users complete the process in under 10 minutes.</p>
          <p class="text-xs text-gray-600">The actual data transfer is instantaneous; the time is mostly spent reviewing and customizing your accounts.</p>`
    },
    {
      question: "Will my transaction history be preserved?",
      body: `<p>Yes, all your transaction history, payees, categories, and account information are preserved during migration. You can choose to import historical data or start fresh.</p>
          <p class="text-xs text-gray-600">You have full control over which data to migrate during the review step.</p>`
    },
    {
      question: "Can I migrate only specific accounts?",
      body: `<p>Absolutely! During the review step, you can select which accounts to migrate and even rename them for Monarch Money. Unselected accounts will be ignored.</p>
          <p class="text-xs text-gray-600">This gives you complete flexibility to customize your migration to match your needs.</p>`
    },
    {
      question: "What if I encounter an error during migration?",
      body: `<p>If you encounter an error, try the following: refresh the page, clear your browser cache, or use a different browser. Most errors are temporary and resolve on retry.</p>
          <p class="text-xs text-gray-600">If the problem persists, contact our support team for assistance. Your data is always safe and you can restart at any time.</p>`
    }
  ];
  function initFaqView() {
    const layoutElement = document.getElementById("pageLayout");
    const backText = layoutElement?.dataset.backText || "Back to App";
    renderPageLayout({
      navbar: {
        showBackButton: true,
        showDataButton: false,
        backText
      },
      header: {
        title: "Frequently Asked Questions",
        description: "Find answers to common questions about the YNAB to Monarch migration process.",
        containerId: "pageHeader"
      }
    });
    const faqContainer = document.querySelector("#faqContainer");
    if (!faqContainer) {
      return;
    }
    faqContainer.innerHTML = "";
    FAQ_ITEMS.forEach((item, index) => {
      faqContainer.appendChild(createFaqCard(item, index));
    });
    faqContainer.querySelectorAll(".faq-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        toggleFaqItem(button);
      });
    });
  }
  function toggleFaqItem(button) {
    const index = button.dataset.index;
    const content = document.querySelector(`.faq-content[data-index="${index}"]`);
    const icon = button.querySelector(".faq-icon");
    const item = button.closest(".faq-item");
    if (!content || !icon || !item) {
      return;
    }
    const isOpen = content.classList.contains("open");
    if (isOpen) {
      content.classList.remove("open");
      content.classList.add("hidden");
      content.style.maxHeight = "0";
      icon.style.transform = "rotate(0deg)";
      item.classList.remove("border-blue-300", "bg-blue-50");
    } else {
      content.classList.remove("hidden");
      content.classList.add("open");
      const innerContent = content.querySelector("div");
      const scrollHeight = innerContent ? innerContent.scrollHeight : 0;
      content.style.maxHeight = scrollHeight + 16 + "px";
      icon.style.transform = "rotate(180deg)";
      item.classList.add("border-blue-300", "bg-blue-50");
    }
  }

  // src/views/Faq/faq.html
  var faq_default = '<div id="pageLayout" data-back-text="Back to App"></div>\n\n<section class="w-full mb-8">\n  <div id="faqContainer" class="space-y-3 w-full"></div>\n</section>\n';

  // src/router.js
  var routes = {
    "/": {
      template: home_default,
      init: initHomeView,
      scroll: true,
      title: "Home - YNAB to Monarch",
      requiresAuth: false,
      layoutType: "document"
    },
    "/upload": {
      template: upload_default,
      init: initUploadView,
      scroll: false,
      title: "Upload - YNAB to Monarch",
      requiresAuth: false,
      layoutType: "document"
    },
    "/review": {
      template: review_default,
      init: initAccountReviewView,
      scroll: true,
      title: "Review Accounts - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true,
      layoutType: "document"
    },
    "/method": {
      template: method_default,
      init: initMethodSelectView,
      scroll: false,
      title: "Select Method - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true,
      layoutType: "document"
    },
    "/manual": {
      template: manualInstructions_default,
      init: initManualInstructionsView,
      scroll: true,
      title: "Manual Import - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true,
      layoutType: "document"
    },
    "/login": {
      template: monarchCredentials_default,
      init: initMonarchCredentialsView,
      scroll: false,
      title: "Login to Monarch - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true,
      layoutType: "document"
    },
    "/otp": {
      template: monarchOtp_default,
      init: initMonarchOtpView,
      scroll: false,
      title: "Enter OTP - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true,
      layoutType: "document"
    },
    "/complete": {
      template: monarchComplete_default2,
      init: monarchComplete_default,
      scroll: false,
      title: "Migration Complete - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true,
      layoutType: "document"
    },
    "/oauth/ynab/callback": {
      template: ynabOauthCallback_default,
      init: initYnabOauthCallbackView,
      scroll: false,
      title: "Authorize YNAB - YNAB to Monarch",
      requiresAuth: false,
      layoutType: "document"
    },
    "/select-accounts": {
      template: ynabAccountSelect_default,
      init: initYnabAccountSelectView,
      scroll: false,
      title: "Select Accounts - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true,
      layoutType: "app"
    },
    "/map-accounts": {
      template: accountMapping_default,
      init: initAccountMappingView,
      scroll: false,
      title: "Review Monarch Details - YNAB to Monarch",
      requiresAuth: false,
      requiresAccounts: true,
      layoutType: "app"
    },
    "/data-management": {
      template: dataManagement_default,
      init: initDataManagementView,
      scroll: true,
      title: "Data Management - YNAB to Monarch",
      requiresAuth: false,
      layoutType: "document"
    },
    "/faq": {
      template: faq_default,
      init: initFaqView,
      scroll: true,
      title: "FAQ - YNAB to Monarch",
      requiresAuth: false,
      layoutType: "document"
    }
  };
  var isNavigating = false;
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
      const currentPath = getCurrentPath();
      const urlToSet = path === "/oauth/ynab/callback" ? window.location.href : path;
      if (replace) {
        history.replaceState({ path }, "", urlToSet);
      } else {
        if (currentPath && currentPath !== path) {
          navigationHistory.push(currentPath);
          if (navigationHistory.length > MAX_HISTORY_SIZE) {
            navigationHistory.shift();
          }
        }
        history.pushState({ path }, "", urlToSet);
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
    const layoutType = route.layoutType || "document";
    if (typeof window.setLayoutType === "function") {
      window.setLayoutType(layoutType);
    }
    const layoutRoot = document.querySelector("[data-layout-root]");
    if (layoutRoot) {
      layoutRoot.dataset.layoutType = layoutType;
    }
    const footerMount = document.querySelector("[data-footer]");
    if (footerMount) {
      footerMount.classList.toggle("hidden", layoutType === "app");
    }
    LoadingOverlay_default.reset();
    document.title = route.title;
    document.body.classList.toggle("always-scroll", route.scroll);
    document.body.style.overflowY = route.scroll ? "auto" : "hidden";
    window.scrollTo(0, 0);
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
  function getCurrentPath() {
    return window.location.pathname;
  }
  function isValidRoute(path) {
    return routes.hasOwnProperty(path);
  }
  function clearAppState() {
    try {
      localStorage.removeItem("app_state");
      state.clearAll();
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
          const urlToSet = path === "/oauth/ynab/callback" ? window.location.href : path;
          history.replaceState({ path }, "", urlToSet);
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

  // src/core/reactiveState.js
  var Signal = class {
    constructor(initialValue) {
      this._value = initialValue;
      this._subscribers = /* @__PURE__ */ new Set();
    }
    get value() {
      return this._value;
    }
    set value(newValue) {
      if (this._value !== newValue) {
        this._value = newValue;
        this._notify();
      }
    }
    subscribe(callback) {
      this._subscribers.add(callback);
      return () => this._subscribers.delete(callback);
    }
    _notify() {
      this._subscribers.forEach((callback) => {
        try {
          callback(this._value);
        } catch (error) {
          console.error("Signal callback error:", error);
        }
      });
    }
  };
  function signal(initialValue) {
    return new Signal(initialValue);
  }
  function computed(compute) {
    const result = new Signal(compute());
    const update = () => {
      result.value = compute();
    };
    return { ...result, update };
  }

  // src/components/ReusableModal.js
  var ReusableModal = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.isOpen = signal(false);
      this.isOpen.subscribe((open) => {
        this._updateModalState(open);
      });
    }
    connectedCallback() {
      this._render();
      this._setupEventListeners();
    }
    get hasFooter() {
      return this.hasAttribute("has-footer");
    }
    set hasFooter(value) {
      if (value) {
        this.setAttribute("has-footer", "");
      } else {
        this.removeAttribute("has-footer");
      }
    }
    _render() {
      this.shadowRoot.innerHTML = `
      <style>
        ::slotted([slot="trigger"]) {
          cursor: pointer;
        }
      </style>
      <slot name="trigger"></slot>
    `;
      this._modalOverlay = document.createElement("div");
      this._modalOverlay.className = "ui-modal-overlay";
      this._modalOverlay.setAttribute("role", "dialog");
      this._modalOverlay.setAttribute("aria-modal", "true");
      this._modalOverlay.innerHTML = `
      <style>
        .ui-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1);
          background-color: transparent;
        }

        .ui-modal-overlay.open {
          pointer-events: auto;
          opacity: 1;
        }

        .ui-modal-backdrop {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          transition: background-color 500ms cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .ui-modal-content {
          position: relative;
          z-index: 100;
          background-color: white;
          border-radius: 0.75rem;
          margin: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          max-width: 85vw;
          width: auto;
          min-width: min(85vw, 500px);
          transform: translateY(100%);
          transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        @media (min-width: 640px) {
          .ui-modal-content {
            padding: 0;
            max-width: 70vw;
            margin: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .ui-modal-content {
            max-width: 40vw;
            margin: 2rem;
          }
        }

        .ui-modal-header {
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .ui-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem 2rem 1.5rem; // Top, right, bottom, left
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        @media (min-width: 640px) {
          .ui-modal-body {
            padding: 1rem 2rem 2rem 2rem;
          }
        }

        .ui-modal-footer {
          padding: 1rem;
          display: none;
          justify-content: flex-end;
          gap: 0.75rem;
          border-top: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .ui-modal-footer.visible {
          display: flex;
        }

        .ui-modal-overlay.open .ui-modal-content {
          transform: translateY(0);
        }

        .ui-modal-title {
          flex: 1;
          padding-right: 1rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          line-height: 1.5;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        @media (min-width: 640px) {
          .ui-modal-title {
            font-size: 1.25rem;
          }
        }

        @media (min-width: 768px) {
          .ui-modal-title {
            font-size: 1.5rem;
          }
        }

        .ui-modal-close-btn {
          position: relative;
          padding: 0;
          width: 2rem;
          height: 2rem;
          min-width: 2rem;
          min-height: 2rem;
          max-width: 2rem;
          max-height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 9999px;
          transition: all 200ms;
          flex-shrink: 0;
        }

        .ui-modal-close-btn svg {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          object-fit: contain;
        }

        .ui-modal-close-btn:hover {
          background-color: #f3f4f6;
          color: #4b5563;
        }

        .ui-modal-close-btn:focus {
          outline: none;
          ring: 2px;
          ring-color: #3b82f6;
        }
      </style>
      
      <div class="ui-modal-backdrop"></div>
      
      <div class="ui-modal-content">
        <div class="ui-modal-header">
          <div class="ui-modal-title"></div>
          <button class="ui-modal-close-btn" aria-label="Close modal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="ui-modal-body"></div>
        <div class="ui-modal-footer"></div>
      </div>
    `;
      this._updateModalContent();
    }
    _updateModalContent() {
      const titleSlot = this.querySelector('[slot="title"]');
      const contentSlot = this.querySelector('[slot="content"]');
      const footerSlot = this.querySelector('[slot="footer"]');
      const titleContainer = this._modalOverlay.querySelector(".ui-modal-title");
      const bodyContainer = this._modalOverlay.querySelector(".ui-modal-body");
      const footerContainer = this._modalOverlay.querySelector(".ui-modal-footer");
      if (titleSlot && titleContainer) {
        titleContainer.innerHTML = titleSlot.innerHTML;
      }
      if (contentSlot && bodyContainer) {
        bodyContainer.innerHTML = contentSlot.innerHTML;
      }
      if (footerSlot && footerContainer) {
        footerContainer.innerHTML = Array.from(footerSlot.children).map((child) => child.outerHTML).join("");
        if (this.hasFooter) {
          footerContainer.classList.add("visible");
        }
      }
    }
    querySelector(selector) {
      const element = super.querySelector(selector);
      if (element)
        return element;
      if (this._modalOverlay) {
        return this._modalOverlay.querySelector(selector);
      }
      return null;
    }
    _setupEventListeners() {
      const backdrop = this._modalOverlay.querySelector(".ui-modal-backdrop");
      const closeBtn = this._modalOverlay.querySelector(".ui-modal-close-btn");
      const trigger = this.querySelector('[slot="trigger"]');
      if (trigger) {
        trigger.addEventListener("click", () => this.open());
      }
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.close());
      }
      if (backdrop) {
        backdrop.addEventListener("click", () => this.close());
      }
      this._handleEscape = (e) => {
        if (e.key === "Escape" && this.isOpen.value) {
          this.close();
        }
      };
    }
    _updateModalState(open) {
      if (open) {
        document.body.appendChild(this._modalOverlay);
        this._modalOverlay.offsetHeight;
        this._modalOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", this._handleEscape);
      } else {
        this._modalOverlay.classList.remove("open");
        setTimeout(() => {
          if (this._modalOverlay.parentNode) {
            this._modalOverlay.parentNode.removeChild(this._modalOverlay);
          }
        }, 500);
        document.body.style.overflow = "";
        document.removeEventListener("keydown", this._handleEscape);
      }
    }
    open() {
      this.isOpen.value = true;
    }
    close() {
      this.isOpen.value = false;
    }
    toggle() {
      this.isOpen.value = !this.isOpen.value;
    }
    disconnectedCallback() {
      document.removeEventListener("keydown", this._handleEscape);
      if (this._modalOverlay && this._modalOverlay.parentNode) {
        this._modalOverlay.parentNode.removeChild(this._modalOverlay);
      }
    }
  };
  if (!customElements.get("ui-modal")) {
    customElements.define("ui-modal", ReusableModal);
  }

  // src/components/ReusableTable.js
  var ReusableTable = class extends HTMLElement {
    constructor() {
      super();
      this._data = signal(new Accounts());
      this._columns = signal([]);
      this._selectedRows = signal(/* @__PURE__ */ new Set());
      this._visibleRows = signal([]);
      this._allSelected = computed(() => {
        const visible = this._visibleRows.value;
        const selected = this._selectedRows.value;
        return visible.length > 0 && visible.every((row) => selected.has(this._getRowId(row)));
      });
      this._someSelected = computed(() => {
        const visible = this._visibleRows.value;
        const selected = this._selectedRows.value;
        const selectedCount = visible.filter((row) => selected.has(this._getRowId(row))).length;
        return selectedCount > 0 && selectedCount < visible.length;
      });
      this._mobileBreakpoint = "lg";
      this._enableSelection = true;
      this._rowIdKey = "id";
      this._enableRowClickToggle = false;
      this._handleMasterCheckboxChange = this._handleMasterCheckboxChange.bind(this);
      this._handleRowCheckboxChange = this._handleRowCheckboxChange.bind(this);
    }
    connectedCallback() {
      this._mobileBreakpoint = this.getAttribute("data-mobile-breakpoint") || "lg";
      this._enableSelection = this.getAttribute("data-enable-selection") !== "false";
      this._rowIdKey = this.getAttribute("data-row-id-key") || "id";
      this._enableRowClickToggle = this.getAttribute("data-row-click-toggle") === "true";
      this._render();
      this._setupSubscriptions();
    }
    disconnectedCallback() {
      if (this._dataUnsubscribe)
        this._dataUnsubscribe();
      if (this._columnsUnsubscribe)
        this._columnsUnsubscribe();
      if (this._selectedUnsubscribe)
        this._selectedUnsubscribe();
      if (this._visibleUnsubscribe)
        this._visibleUnsubscribe();
    }
    _setupSubscriptions() {
      this._dataUnsubscribe = this._data.subscribe(() => this._updateTable());
      this._columnsUnsubscribe = this._columns.subscribe(() => this._updateTable());
      this._selectedUnsubscribe = this._selectedRows.subscribe(() => this._updateSelection());
      this._visibleUnsubscribe = this._visibleRows.subscribe(() => this._updateMasterCheckbox());
    }
    _render() {
      this.className = "ui-table-container bg-white rounded-lg shadow-sm overflow-hidden";
      this.innerHTML = `
      <!-- Mobile Card View -->
      <div class="mobile-view block ${this._mobileBreakpoint}:hidden bg-gray-50">
        ${this._enableSelection ? `
        <div class="border-b border-gray-200 bg-white p-3 sm:p-4">
          <div class="flex items-center justify-between">
            <label class="custom-checkbox-container flex items-center">
              <input id="masterCheckboxMobile" type="checkbox" class="master-checkbox-mobile custom-checkbox-input">
              <span class="custom-checkbox-visual"></span>
              <span class="text-sm font-medium text-gray-700 pl-2">Select All</span>
            </label>
            <div class="text-xs text-gray-500 font-semibold selection-count-mobile">0 selected</div>
          </div>
        </div>
        ` : ""}
        <div class="mobile-list space-y-2 p-3 sm:p-4"></div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="desktop-view hidden ${this._mobileBreakpoint}:block h-full overflow-auto">
        <table class="w-full min-w-[800px]" role="grid">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200" role="row"></tr>
          </thead>
          <tbody class="divide-y divide-gray-100"></tbody>
        </table>
      </div>
    `;
      this._updateTable();
    }
    _updateTable() {
      const data2 = this._getAccountRows();
      const columns = this._columns.value;
      this._visibleRows.value = data2;
      this._renderDesktopTable(data2, columns);
      this._renderMobileCards(data2, columns);
      const mobileMasterCheckbox = this.querySelector("#masterCheckboxMobile");
      if (mobileMasterCheckbox) {
        mobileMasterCheckbox.removeEventListener("change", this._handleMasterCheckboxChange);
        mobileMasterCheckbox.addEventListener("change", this._handleMasterCheckboxChange);
      }
      this._updateSelection();
    }
    _renderDesktopTable(accountList, columns) {
      const thead = this.querySelector("thead tr");
      const tbody = this.querySelector("tbody");
      if (!thead || !tbody)
        return;
      thead.innerHTML = "";
      columns.forEach((col) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.className = col.headerClass || "px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900";
        th.style.position = "sticky";
        th.style.top = "0";
        th.style.backgroundColor = "rgb(249 250 251)";
        th.style.zIndex = "10";
        if (col.width)
          th.style.width = col.width;
        if (col.minWidth)
          th.style.minWidth = col.minWidth;
        if (col.type === "checkbox" && col.masterCheckbox) {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "master-checkbox w-4 h-4 sm:w-5 sm:h-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2";
          checkbox.addEventListener("change", this._handleMasterCheckboxChange);
          th.appendChild(checkbox);
        } else {
          th.textContent = col.header || "";
        }
        thead.appendChild(th);
      });
      tbody.innerHTML = "";
      accountList.forEach((account) => {
        console.debug("Rendering row:", account);
        const tr = document.createElement("tr");
        tr.setAttribute("role", "row");
        tr.className = "border-t border-gray-100";
        if (account.migrationStatus === AccountMigrationStatus.COMPLETED) {
          tr.classList.add("bg-amber-50", "border-l-4", "border-l-amber-300");
        }
        tr.dataset.rowId = this._getRowId(account);
        if (this._enableRowClickToggle) {
          tr.classList.add("cursor-pointer", "hover:bg-gray-50", "transition-colors");
          tr.addEventListener("click", (event) => {
            const target = event.target;
            if (!target)
              return;
            const interactive = target.closest("input, select, button, ui-button, a, label");
            if (interactive)
              return;
            const checkbox = tr.querySelector('input[type="checkbox"]');
            if (!checkbox || checkbox.disabled)
              return;
            checkbox.click();
          });
        }
        columns.forEach((col) => {
          const td = document.createElement("td");
          td.className = col.cellClass || "px-3 sm:px-4 py-3 sm:py-4";
          this._renderCell(td, col, account);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
    _renderMobileCards(data2, columns) {
      const mobileList = this.querySelector(".mobile-list");
      if (!mobileList)
        return;
      mobileList.innerHTML = "";
      data2.forEach((row) => {
        const card = document.createElement("div");
        card.className = "mobile-card overflow-hidden";
        if (row.migrationStatus === AccountMigrationStatus.COMPLETED) {
          card.classList.add("bg-amber-50", "border-l-4", "border-l-amber-300");
        } else {
          card.classList.add("bg-white", "border", "border-gray-100");
        }
        card.dataset.rowId = this._getRowId(row);
        if (this._enableRowClickToggle) {
          card.classList.add("cursor-pointer", "hover:bg-gray-50", "transition-colors");
          card.addEventListener("click", (event) => {
            const target = event.target;
            if (!target)
              return;
            const interactive = target.closest("input, select, button, ui-button, a, label");
            if (interactive)
              return;
            const checkbox = card.querySelector('input[type="checkbox"]');
            if (!checkbox || checkbox.disabled)
              return;
            checkbox.click();
          });
        }
        const wrapper = document.createElement("div");
        wrapper.className = "p-3 sm:p-4";
        const headerDiv = document.createElement("div");
        headerDiv.className = "flex items-center gap-3 mb-3 pb-3 border-b border-gray-100";
        const selectCol = columns.find((c) => c.type === "checkbox" && c.masterCheckbox);
        if (selectCol && this._enableSelection) {
          const checkboxContainer = this._createMobileCheckbox(row);
          checkboxContainer.className = "flex-shrink-0";
          headerDiv.appendChild(checkboxContainer);
        }
        const primaryCol = columns.find((c) => c.key === "name");
        if (primaryCol && !primaryCol.mobileHidden) {
          const primaryDiv = document.createElement("div");
          primaryDiv.className = "flex-1 min-w-0";
          const nameValue = document.createElement("div");
          nameValue.className = "text-sm font-semibold text-gray-900 truncate";
          const displayValue = primaryCol.getValue ? primaryCol.getValue(row) : row[primaryCol.key];
          nameValue.textContent = displayValue || "";
          const isClickable = primaryCol.clickable ? typeof primaryCol.clickable === "function" ? primaryCol.clickable(row) : primaryCol.clickable : false;
          if (isClickable) {
            nameValue.className += " cursor-pointer hover:text-blue-600 transition-colors";
            if (primaryCol.onClick) {
              nameValue.addEventListener("click", () => primaryCol.onClick(row));
            }
          }
          primaryDiv.appendChild(nameValue);
          headerDiv.appendChild(primaryDiv);
        }
        wrapper.appendChild(headerDiv);
        const bodyDiv = document.createElement("div");
        bodyDiv.className = "grid grid-cols-2 gap-3 sm:gap-4 text-sm";
        let fieldCount = 0;
        columns.forEach((col) => {
          if (col.type === "checkbox" && col.masterCheckbox)
            return;
          if (col.key === "name")
            return;
          if (col.mobileHidden)
            return;
          if (col.type === "custom" && col.key === "undo")
            return;
          if (col.type === "button")
            return;
          if (col.mobileLayout === "full")
            return;
          fieldCount++;
          const fieldDiv = document.createElement("div");
          if (col.mobileLayout === "full") {
            fieldDiv.className = "col-span-2 flex flex-col gap-1";
          } else {
            fieldDiv.className = "flex flex-col gap-1";
          }
          if (col.mobileLabel !== false) {
            const label = document.createElement("span");
            label.className = "text-xs font-semibold text-gray-500 uppercase tracking-wide";
            label.textContent = col.mobileLabel || col.header;
            fieldDiv.appendChild(label);
          }
          const valueContainer = document.createElement("div");
          valueContainer.className = "min-w-0";
          this._renderCell(valueContainer, col, row, true);
          fieldDiv.appendChild(valueContainer);
          bodyDiv.appendChild(fieldDiv);
        });
        wrapper.appendChild(bodyDiv);
        let hasActions = false;
        const actionButtons = [];
        columns.forEach((col) => {
          if (col.type === "button" || col.type === "custom" && col.key === "undo") {
            hasActions = true;
            actionButtons.push(col);
          }
        });
        if (hasActions) {
          const footerDiv = document.createElement("div");
          footerDiv.className = "mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap";
          actionButtons.forEach((col) => {
            const container = document.createElement("div");
            if (col.type === "button") {
              container.className = "flex-1 min-w-[120px]";
            } else {
              container.className = "flex-shrink-0";
            }
            this._renderCell(container, col, row, true);
            footerDiv.appendChild(container);
          });
          wrapper.appendChild(footerDiv);
        }
        card.appendChild(wrapper);
        mobileList.appendChild(card);
      });
    }
    _createMobileCheckbox(row) {
      const container = document.createElement("label");
      container.className = "custom-checkbox-container flex-shrink-0";
      const checkbox = document.createElement("input");
      checkbox.id = "rowCheckboxMobile_" + this._getRowId(row);
      checkbox.type = "checkbox";
      checkbox.className = "row-checkbox custom-checkbox-input";
      checkbox.dataset.rowId = this._getRowId(row);
      checkbox.checked = this._selectedRows.value.has(this._getRowId(row));
      checkbox.addEventListener("change", this._handleRowCheckboxChange);
      const visual = document.createElement("span");
      visual.className = "custom-checkbox-visual";
      container.appendChild(checkbox);
      container.appendChild(visual);
      return container;
    }
    _renderCell(container, col, row, isMobile = false) {
      const isDisabled = col.disabled ? col.disabled(row) : false;
      switch (col.type) {
        case "checkbox":
          if (!col.masterCheckbox) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "w-5 h-5 rounded border-gray-300 cursor-pointer";
            checkbox.checked = col.getValue ? col.getValue(row) : row[col.key];
            checkbox.disabled = isDisabled;
            if (col.onChange) {
              checkbox.addEventListener("change", () => col.onChange(row, checkbox.checked));
            }
            container.appendChild(checkbox);
          } else {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "row-checkbox w-5 h-5 rounded border-gray-300 cursor-pointer";
            checkbox.dataset.rowId = this._getRowId(row);
            checkbox.checked = this._selectedRows.value.has(this._getRowId(row));
            checkbox.disabled = isDisabled;
            checkbox.addEventListener("change", this._handleRowCheckboxChange);
            container.appendChild(checkbox);
          }
          break;
        case "text":
          const text = col.getValue ? col.getValue(row) : row[col.key];
          container.textContent = text;
          container.className += " truncate";
          if (col.clickable && !isDisabled) {
            container.className += " cursor-pointer hover:text-blue-600 transition-colors duration-200";
            if (col.onClick) {
              container.addEventListener("click", () => col.onClick(row));
            }
          } else if (isDisabled) {
            container.className += " text-gray-400 cursor-default";
          }
          if (col.tooltip) {
            container.title = typeof col.tooltip === "function" ? col.tooltip(row) : col.tooltip;
          }
          break;
        case "select":
          const select = document.createElement("select");
          const baseClasses = "border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium";
          const mobileClasses = "text-xs px-2 py-1.5";
          const desktopClasses = "text-sm px-2 py-1";
          select.className = baseClasses + " " + (isMobile ? mobileClasses : desktopClasses);
          select.disabled = isDisabled;
          if (isDisabled) {
            select.className += " text-gray-400 bg-gray-50 cursor-not-allowed";
          } else {
            select.className += " cursor-pointer text-gray-900";
          }
          const currentValue = col.getValue ? col.getValue(row) : row[col.key];
          const options = col.options ? typeof col.options === "function" ? col.options(row) : col.options : [];
          options.forEach((opt) => {
            const option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.label;
            if (opt.value === currentValue)
              option.selected = true;
            select.appendChild(option);
          });
          if (col.onChange) {
            select.addEventListener("change", (e) => {
              try {
                if (e && e.target && row) {
                  col.onChange(row, select.value);
                }
              } catch (error) {
                console.error("Error in select onChange:", error);
              }
            });
          }
          if (col.tooltip) {
            select.title = typeof col.tooltip === "function" ? col.tooltip(row) : col.tooltip;
          }
          container.appendChild(select);
          break;
        case "button":
          const buttonConfig = col.render ? col.render(row) : {};
          const button = document.createElement("ui-button");
          button.className = "ui-button";
          button.dataset.type = buttonConfig.type || "solid";
          button.dataset.color = buttonConfig.color || "blue";
          button.dataset.size = buttonConfig.size || (isMobile ? "small" : "medium");
          button.textContent = buttonConfig.text || "";
          button.dataset.fullwidth = isMobile ? "true" : "false";
          button.disabled = isDisabled || buttonConfig.disabled;
          if (buttonConfig.onClick) {
            button.addEventListener("click", () => buttonConfig.onClick(row));
          }
          if (buttonConfig.tooltip || col.tooltip) {
            button.title = buttonConfig.tooltip || (typeof col.tooltip === "function" ? col.tooltip(row) : col.tooltip);
          }
          container.appendChild(button);
          break;
        case "custom":
          if (col.render) {
            const customContent = col.render(row, isMobile);
            if (typeof customContent === "string") {
              container.innerHTML = customContent;
            } else if (customContent instanceof HTMLElement) {
              container.appendChild(customContent);
            }
          }
          break;
        default:
          const value = col.getValue ? col.getValue(row) : row[col.key];
          container.textContent = value || "";
      }
      if (col.cellStyle) {
        const styles = typeof col.cellStyle === "function" ? col.cellStyle(row) : col.cellStyle;
        Object.assign(container.style, styles);
      }
    }
    _handleMasterCheckboxChange(e) {
      const visibleRows = this._visibleRows.value;
      const selected = new Set(this._selectedRows.value);
      const checkbox = e.target;
      const shouldSelectAll = checkbox.checked;
      visibleRows.forEach((row) => {
        const rowId = this._getRowId(row);
        if (shouldSelectAll) {
          selected.add(rowId);
        } else {
          selected.delete(rowId);
        }
      });
      this._selectedRows.value = selected;
      setTimeout(() => {
        this._emitSelectionChange();
      }, 0);
    }
    _handleRowCheckboxChange(e) {
      if (!e || !e.target)
        return;
      const target = e.target;
      const rowId = target.dataset.rowId;
      const checked = target.checked;
      const selected = new Set(this._selectedRows.value);
      if (checked) {
        selected.add(rowId);
      } else {
        selected.delete(rowId);
      }
      this._selectedRows.value = selected;
      this._emitSelectionChange();
    }
    _updateSelection() {
      const checkboxes = this.querySelectorAll(".row-checkbox");
      checkboxes.forEach((checkbox) => {
        const rowId = checkbox.dataset.rowId;
        checkbox.checked = this._selectedRows.value.has(rowId);
      });
      this._updateMasterCheckbox();
      this._updateSelectionCount();
    }
    _updateMasterCheckbox() {
      const masterCheckboxes = this.querySelectorAll(".master-checkbox, .master-checkbox-mobile");
      const visible = this._visibleRows.value;
      const selected = this._selectedRows.value;
      const selectedCount = visible.filter((row) => selected.has(this._getRowId(row))).length;
      const allSelected = visible.length > 0 && selectedCount === visible.length;
      const someSelected = selectedCount > 0 && selectedCount < visible.length;
      masterCheckboxes.forEach((checkbox) => {
        checkbox.checked = allSelected;
        checkbox.indeterminate = someSelected;
      });
    }
    _updateSelectionCount() {
      const countElements = this.querySelectorAll(".selection-count-mobile");
      const count = this._selectedRows.value.size;
      countElements.forEach((el) => {
        el.textContent = `${count} selected`;
      });
    }
    _emitSelectionChange() {
      const selected = Array.from(this._selectedRows.value);
      const visibleRows = this._visibleRows.value;
      const selectedRows = visibleRows.filter((row) => this._selectedRows.value.has(this._getRowId(row)));
      this.dispatchEvent(new CustomEvent("selectionchange", {
        detail: {
          selected,
          selectedRows,
          count: selected.length,
          allSelected: this._allSelected.value,
          someSelected: this._someSelected.value
        },
        bubbles: true
      }));
    }
    _getRowId(row) {
      return String(row[this._rowIdKey] || row.id || JSON.stringify(row));
    }
    _getAccountRows() {
      if (this._data.value instanceof Accounts) {
        return this._data.value.accounts;
      }
      return Array.isArray(this._data.value) ? this._data.value : [];
    }
    set data(value) {
      this._data.value = Accounts.from(value);
    }
    get data() {
      return this._getAccountRows();
    }
    set columns(value) {
      this._columns.value = Array.isArray(value) ? value : [];
    }
    get columns() {
      return this._columns.value;
    }
    set selectedRows(value) {
      this._selectedRows.value = new Set(value);
      this._updateSelection();
      this._emitSelectionChange();
    }
    get selectedRows() {
      return Array.from(this._selectedRows.value);
    }
    clearSelection() {
      this._selectedRows.value = /* @__PURE__ */ new Set();
      this._updateSelection();
      this._emitSelectionChange();
    }
    selectAll() {
      const selected = /* @__PURE__ */ new Set();
      this._visibleRows.value.forEach((row) => {
        selected.add(this._getRowId(row));
      });
      this._selectedRows.value = selected;
      this._updateSelection();
      this._emitSelectionChange();
    }
    refresh() {
      this._updateTable();
    }
    updateRow(rowId) {
      console.group(`Updating row with ID: ${rowId}`);
      const data2 = this._getAccountRows();
      const columns = this._columns.value;
      const row = data2.find((r) => this._getRowId(r) === rowId);
      if (!row) {
        console.warn(`Row with ID ${rowId} not found`);
        console.groupEnd();
        return;
      }
      const desktopRow = this.querySelector(`tr[data-row-id="${rowId}"]`);
      if (desktopRow) {
        this._updateTableRow(desktopRow, row, columns);
      }
      const mobileCard = this.querySelector(`[data-mobile-card-id="${rowId}"]`);
      if (mobileCard) {
        this._updateMobileCard(mobileCard, row, columns);
      }
      console.groupEnd();
    }
    _updateTableRow(tr, row, columns) {
      console.group(`Updating desktop table row for ID: ${this._getRowId(row)}`);
      const isModified = row.migrationStatus === AccountMigrationStatus.COMPLETED;
      tr.classList.toggle("bg-amber-50", isModified);
      tr.classList.toggle("border-l-4", isModified);
      tr.classList.toggle("border-l-amber-300", isModified);
      const cells = tr.querySelectorAll("td");
      columns.forEach((col, index) => {
        const td = cells[index];
        if (td) {
          td.innerHTML = "";
          this._renderCell(td, col, row);
        }
      });
      console.groupEnd();
    }
    _updateMobileCard(card, row, columns) {
      console.group(`Updating mobile card for ID: ${this._getRowId(row)}`);
      card.innerHTML = "";
      this._renderMobileCardContent(card, row, columns);
      console.groupEnd();
    }
    _renderMobileCardContent(card, row, columns) {
      console.group("Rendering mobile card content", { rowId: this._getRowId(row) });
      card.className = "bg-white rounded border border-gray-200 p-3 sm:p-4 space-y-2";
      if (row.migrationStatus === AccountMigrationStatus.COMPLETED) {
        card.classList.add("bg-amber-50", "border-l-4", "border-l-amber-300");
      }
      card.setAttribute("data-mobile-card-id", this._getRowId(row));
      columns.forEach((col) => {
        if (col.mobileHidden) {
          console.log(`Skipping mobile rendering for column: ${col.header || col.mobileLabel}`);
          return;
        }
        const field = document.createElement("div");
        field.className = "flex justify-between items-start text-sm";
        const label = document.createElement("span");
        label.className = "font-medium text-gray-700";
        label.textContent = col.mobileLabel || col.header || "";
        const value = document.createElement("div");
        value.className = "text-gray-900 text-right flex-1 ml-3";
        this._renderCell(value, col, row);
        field.appendChild(label);
        field.appendChild(value);
        card.appendChild(field);
      });
      console.groupEnd();
    }
  };
  customElements.define("ui-table", ReusableTable);
})();
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
