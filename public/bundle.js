(()=>{var wr=Object.create;var fn=Object.defineProperty;var _r=Object.getOwnPropertyDescriptor;var kr=Object.getOwnPropertyNames;var Ar=Object.getPrototypeOf,Sr=Object.prototype.hasOwnProperty;var We=(o=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(o,{get:(e,t)=>(typeof require!="undefined"?require:e)[t]}):o)(function(o){if(typeof require!="undefined")return require.apply(this,arguments);throw new Error('Dynamic require of "'+o+'" is not supported')});var Cr=(o,e)=>()=>(e||o((e={exports:{}}).exports,e),e.exports);var Er=(o,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of kr(e))!Sr.call(o,r)&&r!==t&&fn(o,r,{get:()=>e[r],enumerable:!(n=_r(e,r))||n.enumerable});return o};var Ir=(o,e,t)=>(t=o!=null?wr(Ar(o)):{},Er(e||!o||!o.__esModule?fn(t,"default",{value:o,enumerable:!0}):t,o));var Mn=Cr((Tn,Jt)=>{(function(o){typeof Tn=="object"&&typeof Jt<"u"?Jt.exports=o():typeof define=="function"&&define.amd?define([],o):(typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:this).JSZip=o()})(function(){return function o(e,t,n){function r(c,b){if(!t[c]){if(!e[c]){var g=typeof We=="function"&&We;if(!b&&g)return g(c,!0);if(s)return s(c,!0);var x=new Error("Cannot find module '"+c+"'");throw x.code="MODULE_NOT_FOUND",x}var u=t[c]={exports:{}};e[c][0].call(u.exports,function(f){var d=e[c][1][f];return r(d||f)},u,u.exports,o,e,t,n)}return t[c].exports}for(var s=typeof We=="function"&&We,a=0;a<n.length;a++)r(n[a]);return r}({1:[function(o,e,t){"use strict";var n=o("./utils"),r=o("./support"),s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";t.encode=function(a){for(var c,b,g,x,u,f,d,m=[],h=0,p=a.length,w=p,A=n.getTypeOf(a)!=="string";h<a.length;)w=p-h,g=A?(c=a[h++],b=h<p?a[h++]:0,h<p?a[h++]:0):(c=a.charCodeAt(h++),b=h<p?a.charCodeAt(h++):0,h<p?a.charCodeAt(h++):0),x=c>>2,u=(3&c)<<4|b>>4,f=1<w?(15&b)<<2|g>>6:64,d=2<w?63&g:64,m.push(s.charAt(x)+s.charAt(u)+s.charAt(f)+s.charAt(d));return m.join("")},t.decode=function(a){var c,b,g,x,u,f,d=0,m=0,h="data:";if(a.substr(0,h.length)===h)throw new Error("Invalid base64 input, it looks like a data url.");var p,w=3*(a=a.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(a.charAt(a.length-1)===s.charAt(64)&&w--,a.charAt(a.length-2)===s.charAt(64)&&w--,w%1!=0)throw new Error("Invalid base64 input, bad content length.");for(p=r.uint8array?new Uint8Array(0|w):new Array(0|w);d<a.length;)c=s.indexOf(a.charAt(d++))<<2|(x=s.indexOf(a.charAt(d++)))>>4,b=(15&x)<<4|(u=s.indexOf(a.charAt(d++)))>>2,g=(3&u)<<6|(f=s.indexOf(a.charAt(d++))),p[m++]=c,u!==64&&(p[m++]=b),f!==64&&(p[m++]=g);return p}},{"./support":30,"./utils":32}],2:[function(o,e,t){"use strict";var n=o("./external"),r=o("./stream/DataWorker"),s=o("./stream/Crc32Probe"),a=o("./stream/DataLengthProbe");function c(b,g,x,u,f){this.compressedSize=b,this.uncompressedSize=g,this.crc32=x,this.compression=u,this.compressedContent=f}c.prototype={getContentWorker:function(){var b=new r(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),g=this;return b.on("end",function(){if(this.streamInfo.data_length!==g.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),b},getCompressedWorker:function(){return new r(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},c.createWorkerFrom=function(b,g,x){return b.pipe(new s).pipe(new a("uncompressedSize")).pipe(g.compressWorker(x)).pipe(new a("compressedSize")).withStreamInfo("compression",g)},e.exports=c},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(o,e,t){"use strict";var n=o("./stream/GenericWorker");t.STORE={magic:"\0\0",compressWorker:function(){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},t.DEFLATE=o("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(o,e,t){"use strict";var n=o("./utils"),r=function(){for(var s,a=[],c=0;c<256;c++){s=c;for(var b=0;b<8;b++)s=1&s?3988292384^s>>>1:s>>>1;a[c]=s}return a}();e.exports=function(s,a){return s!==void 0&&s.length?n.getTypeOf(s)!=="string"?function(c,b,g,x){var u=r,f=x+g;c^=-1;for(var d=x;d<f;d++)c=c>>>8^u[255&(c^b[d])];return-1^c}(0|a,s,s.length,0):function(c,b,g,x){var u=r,f=x+g;c^=-1;for(var d=x;d<f;d++)c=c>>>8^u[255&(c^b.charCodeAt(d))];return-1^c}(0|a,s,s.length,0):0}},{"./utils":32}],5:[function(o,e,t){"use strict";t.base64=!1,t.binary=!1,t.dir=!1,t.createFolders=!0,t.date=null,t.compression=null,t.compressionOptions=null,t.comment=null,t.unixPermissions=null,t.dosPermissions=null},{}],6:[function(o,e,t){"use strict";var n=null;n=typeof Promise<"u"?Promise:o("lie"),e.exports={Promise:n}},{lie:37}],7:[function(o,e,t){"use strict";var n=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Uint32Array<"u",r=o("pako"),s=o("./utils"),a=o("./stream/GenericWorker"),c=n?"uint8array":"array";function b(g,x){a.call(this,"FlateWorker/"+g),this._pako=null,this._pakoAction=g,this._pakoOptions=x,this.meta={}}t.magic="\b\0",s.inherits(b,a),b.prototype.processChunk=function(g){this.meta=g.meta,this._pako===null&&this._createPako(),this._pako.push(s.transformTo(c,g.data),!1)},b.prototype.flush=function(){a.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},b.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},b.prototype._createPako=function(){this._pako=new r[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var g=this;this._pako.onData=function(x){g.push({data:x,meta:g.meta})}},t.compressWorker=function(g){return new b("Deflate",g)},t.uncompressWorker=function(){return new b("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(o,e,t){"use strict";function n(u,f){var d,m="";for(d=0;d<f;d++)m+=String.fromCharCode(255&u),u>>>=8;return m}function r(u,f,d,m,h,p){var w,A,k=u.file,M=u.compression,I=p!==c.utf8encode,F=s.transformTo("string",p(k.name)),B=s.transformTo("string",c.utf8encode(k.name)),j=k.comment,K=s.transformTo("string",p(j)),_=s.transformTo("string",c.utf8encode(j)),N=B.length!==k.name.length,l=_.length!==j.length,R="",te="",U="",ne=k.dir,H=k.date,ee={crc32:0,compressedSize:0,uncompressedSize:0};f&&!d||(ee.crc32=u.crc32,ee.compressedSize=u.compressedSize,ee.uncompressedSize=u.uncompressedSize);var T=0;f&&(T|=8),I||!N&&!l||(T|=2048);var E=0,Q=0;ne&&(E|=16),h==="UNIX"?(Q=798,E|=function(V,de){var ye=V;return V||(ye=de?16893:33204),(65535&ye)<<16}(k.unixPermissions,ne)):(Q=20,E|=function(V){return 63&(V||0)}(k.dosPermissions)),w=H.getUTCHours(),w<<=6,w|=H.getUTCMinutes(),w<<=5,w|=H.getUTCSeconds()/2,A=H.getUTCFullYear()-1980,A<<=4,A|=H.getUTCMonth()+1,A<<=5,A|=H.getUTCDate(),N&&(te=n(1,1)+n(b(F),4)+B,R+="up"+n(te.length,2)+te),l&&(U=n(1,1)+n(b(K),4)+_,R+="uc"+n(U.length,2)+U);var G="";return G+=`
\0`,G+=n(T,2),G+=M.magic,G+=n(w,2),G+=n(A,2),G+=n(ee.crc32,4),G+=n(ee.compressedSize,4),G+=n(ee.uncompressedSize,4),G+=n(F.length,2),G+=n(R.length,2),{fileRecord:g.LOCAL_FILE_HEADER+G+F+R,dirRecord:g.CENTRAL_FILE_HEADER+n(Q,2)+G+n(K.length,2)+"\0\0\0\0"+n(E,4)+n(m,4)+F+R+K}}var s=o("../utils"),a=o("../stream/GenericWorker"),c=o("../utf8"),b=o("../crc32"),g=o("../signature");function x(u,f,d,m){a.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=f,this.zipPlatform=d,this.encodeFileName=m,this.streamFiles=u,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}s.inherits(x,a),x.prototype.push=function(u){var f=u.meta.percent||0,d=this.entriesCount,m=this._sources.length;this.accumulate?this.contentBuffer.push(u):(this.bytesWritten+=u.data.length,a.prototype.push.call(this,{data:u.data,meta:{currentFile:this.currentFile,percent:d?(f+100*(d-m-1))/d:100}}))},x.prototype.openedSource=function(u){this.currentSourceOffset=this.bytesWritten,this.currentFile=u.file.name;var f=this.streamFiles&&!u.file.dir;if(f){var d=r(u,f,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:d.fileRecord,meta:{percent:0}})}else this.accumulate=!0},x.prototype.closedSource=function(u){this.accumulate=!1;var f=this.streamFiles&&!u.file.dir,d=r(u,f,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(d.dirRecord),f)this.push({data:function(m){return g.DATA_DESCRIPTOR+n(m.crc32,4)+n(m.compressedSize,4)+n(m.uncompressedSize,4)}(u),meta:{percent:100}});else for(this.push({data:d.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},x.prototype.flush=function(){for(var u=this.bytesWritten,f=0;f<this.dirRecords.length;f++)this.push({data:this.dirRecords[f],meta:{percent:100}});var d=this.bytesWritten-u,m=function(h,p,w,A,k){var M=s.transformTo("string",k(A));return g.CENTRAL_DIRECTORY_END+"\0\0\0\0"+n(h,2)+n(h,2)+n(p,4)+n(w,4)+n(M.length,2)+M}(this.dirRecords.length,d,u,this.zipComment,this.encodeFileName);this.push({data:m,meta:{percent:100}})},x.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},x.prototype.registerPrevious=function(u){this._sources.push(u);var f=this;return u.on("data",function(d){f.processChunk(d)}),u.on("end",function(){f.closedSource(f.previous.streamInfo),f._sources.length?f.prepareNextSource():f.end()}),u.on("error",function(d){f.error(d)}),this},x.prototype.resume=function(){return!!a.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},x.prototype.error=function(u){var f=this._sources;if(!a.prototype.error.call(this,u))return!1;for(var d=0;d<f.length;d++)try{f[d].error(u)}catch{}return!0},x.prototype.lock=function(){a.prototype.lock.call(this);for(var u=this._sources,f=0;f<u.length;f++)u[f].lock()},e.exports=x},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(o,e,t){"use strict";var n=o("../compressions"),r=o("./ZipFileWorker");t.generateWorker=function(s,a,c){var b=new r(a.streamFiles,c,a.platform,a.encodeFileName),g=0;try{s.forEach(function(x,u){g++;var f=function(p,w){var A=p||w,k=n[A];if(!k)throw new Error(A+" is not a valid compression method !");return k}(u.options.compression,a.compression),d=u.options.compressionOptions||a.compressionOptions||{},m=u.dir,h=u.date;u._compressWorker(f,d).withStreamInfo("file",{name:x,dir:m,date:h,comment:u.comment||"",unixPermissions:u.unixPermissions,dosPermissions:u.dosPermissions}).pipe(b)}),b.entriesCount=g}catch(x){b.error(x)}return b}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(o,e,t){"use strict";function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var r=new n;for(var s in this)typeof this[s]!="function"&&(r[s]=this[s]);return r}}(n.prototype=o("./object")).loadAsync=o("./load"),n.support=o("./support"),n.defaults=o("./defaults"),n.version="3.10.1",n.loadAsync=function(r,s){return new n().loadAsync(r,s)},n.external=o("./external"),e.exports=n},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(o,e,t){"use strict";var n=o("./utils"),r=o("./external"),s=o("./utf8"),a=o("./zipEntries"),c=o("./stream/Crc32Probe"),b=o("./nodejsUtils");function g(x){return new r.Promise(function(u,f){var d=x.decompressed.getContentWorker().pipe(new c);d.on("error",function(m){f(m)}).on("end",function(){d.streamInfo.crc32!==x.decompressed.crc32?f(new Error("Corrupted zip : CRC32 mismatch")):u()}).resume()})}e.exports=function(x,u){var f=this;return u=n.extend(u||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:s.utf8decode}),b.isNode&&b.isStream(x)?r.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):n.prepareContent("the loaded zip file",x,!0,u.optimizedBinaryString,u.base64).then(function(d){var m=new a(u);return m.load(d),m}).then(function(d){var m=[r.Promise.resolve(d)],h=d.files;if(u.checkCRC32)for(var p=0;p<h.length;p++)m.push(g(h[p]));return r.Promise.all(m)}).then(function(d){for(var m=d.shift(),h=m.files,p=0;p<h.length;p++){var w=h[p],A=w.fileNameStr,k=n.resolve(w.fileNameStr);f.file(k,w.decompressed,{binary:!0,optimizedBinaryString:!0,date:w.date,dir:w.dir,comment:w.fileCommentStr.length?w.fileCommentStr:null,unixPermissions:w.unixPermissions,dosPermissions:w.dosPermissions,createFolders:u.createFolders}),w.dir||(f.file(k).unsafeOriginalName=A)}return m.zipComment.length&&(f.comment=m.zipComment),f})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(o,e,t){"use strict";var n=o("../utils"),r=o("../stream/GenericWorker");function s(a,c){r.call(this,"Nodejs stream input adapter for "+a),this._upstreamEnded=!1,this._bindStream(c)}n.inherits(s,r),s.prototype._bindStream=function(a){var c=this;(this._stream=a).pause(),a.on("data",function(b){c.push({data:b,meta:{percent:0}})}).on("error",function(b){c.isPaused?this.generatedError=b:c.error(b)}).on("end",function(){c.isPaused?c._upstreamEnded=!0:c.end()})},s.prototype.pause=function(){return!!r.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!r.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},e.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(o,e,t){"use strict";var n=o("readable-stream").Readable;function r(s,a,c){n.call(this,a),this._helper=s;var b=this;s.on("data",function(g,x){b.push(g)||b._helper.pause(),c&&c(x)}).on("error",function(g){b.emit("error",g)}).on("end",function(){b.push(null)})}o("../utils").inherits(r,n),r.prototype._read=function(){this._helper.resume()},e.exports=r},{"../utils":32,"readable-stream":16}],14:[function(o,e,t){"use strict";e.exports={isNode:typeof Buffer<"u",newBufferFrom:function(n,r){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(n,r);if(typeof n=="number")throw new Error('The "data" argument must not be a number');return new Buffer(n,r)},allocBuffer:function(n){if(Buffer.alloc)return Buffer.alloc(n);var r=new Buffer(n);return r.fill(0),r},isBuffer:function(n){return Buffer.isBuffer(n)},isStream:function(n){return n&&typeof n.on=="function"&&typeof n.pause=="function"&&typeof n.resume=="function"}}},{}],15:[function(o,e,t){"use strict";function n(k,M,I){var F,B=s.getTypeOf(M),j=s.extend(I||{},b);j.date=j.date||new Date,j.compression!==null&&(j.compression=j.compression.toUpperCase()),typeof j.unixPermissions=="string"&&(j.unixPermissions=parseInt(j.unixPermissions,8)),j.unixPermissions&&16384&j.unixPermissions&&(j.dir=!0),j.dosPermissions&&16&j.dosPermissions&&(j.dir=!0),j.dir&&(k=h(k)),j.createFolders&&(F=m(k))&&p.call(this,F,!0);var K=B==="string"&&j.binary===!1&&j.base64===!1;I&&I.binary!==void 0||(j.binary=!K),(M instanceof g&&M.uncompressedSize===0||j.dir||!M||M.length===0)&&(j.base64=!1,j.binary=!0,M="",j.compression="STORE",B="string");var _=null;_=M instanceof g||M instanceof a?M:f.isNode&&f.isStream(M)?new d(k,M):s.prepareContent(k,M,j.binary,j.optimizedBinaryString,j.base64);var N=new x(k,_,j);this.files[k]=N}var r=o("./utf8"),s=o("./utils"),a=o("./stream/GenericWorker"),c=o("./stream/StreamHelper"),b=o("./defaults"),g=o("./compressedObject"),x=o("./zipObject"),u=o("./generate"),f=o("./nodejsUtils"),d=o("./nodejs/NodejsStreamInputAdapter"),m=function(k){k.slice(-1)==="/"&&(k=k.substring(0,k.length-1));var M=k.lastIndexOf("/");return 0<M?k.substring(0,M):""},h=function(k){return k.slice(-1)!=="/"&&(k+="/"),k},p=function(k,M){return M=M!==void 0?M:b.createFolders,k=h(k),this.files[k]||n.call(this,k,null,{dir:!0,createFolders:M}),this.files[k]};function w(k){return Object.prototype.toString.call(k)==="[object RegExp]"}var A={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(k){var M,I,F;for(M in this.files)F=this.files[M],(I=M.slice(this.root.length,M.length))&&M.slice(0,this.root.length)===this.root&&k(I,F)},filter:function(k){var M=[];return this.forEach(function(I,F){k(I,F)&&M.push(F)}),M},file:function(k,M,I){if(arguments.length!==1)return k=this.root+k,n.call(this,k,M,I),this;if(w(k)){var F=k;return this.filter(function(j,K){return!K.dir&&F.test(j)})}var B=this.files[this.root+k];return B&&!B.dir?B:null},folder:function(k){if(!k)return this;if(w(k))return this.filter(function(B,j){return j.dir&&k.test(B)});var M=this.root+k,I=p.call(this,M),F=this.clone();return F.root=I.name,F},remove:function(k){k=this.root+k;var M=this.files[k];if(M||(k.slice(-1)!=="/"&&(k+="/"),M=this.files[k]),M&&!M.dir)delete this.files[k];else for(var I=this.filter(function(B,j){return j.name.slice(0,k.length)===k}),F=0;F<I.length;F++)delete this.files[I[F].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(k){var M,I={};try{if((I=s.extend(k||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:r.utf8encode})).type=I.type.toLowerCase(),I.compression=I.compression.toUpperCase(),I.type==="binarystring"&&(I.type="string"),!I.type)throw new Error("No output type specified.");s.checkSupport(I.type),I.platform!=="darwin"&&I.platform!=="freebsd"&&I.platform!=="linux"&&I.platform!=="sunos"||(I.platform="UNIX"),I.platform==="win32"&&(I.platform="DOS");var F=I.comment||this.comment||"";M=u.generateWorker(this,I,F)}catch(B){(M=new a("error")).error(B)}return new c(M,I.type||"string",I.mimeType)},generateAsync:function(k,M){return this.generateInternalStream(k).accumulate(M)},generateNodeStream:function(k,M){return(k=k||{}).type||(k.type="nodebuffer"),this.generateInternalStream(k).toNodejsStream(M)}};e.exports=A},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(o,e,t){"use strict";e.exports=o("stream")},{stream:void 0}],17:[function(o,e,t){"use strict";var n=o("./DataReader");function r(s){n.call(this,s);for(var a=0;a<this.data.length;a++)s[a]=255&s[a]}o("../utils").inherits(r,n),r.prototype.byteAt=function(s){return this.data[this.zero+s]},r.prototype.lastIndexOfSignature=function(s){for(var a=s.charCodeAt(0),c=s.charCodeAt(1),b=s.charCodeAt(2),g=s.charCodeAt(3),x=this.length-4;0<=x;--x)if(this.data[x]===a&&this.data[x+1]===c&&this.data[x+2]===b&&this.data[x+3]===g)return x-this.zero;return-1},r.prototype.readAndCheckSignature=function(s){var a=s.charCodeAt(0),c=s.charCodeAt(1),b=s.charCodeAt(2),g=s.charCodeAt(3),x=this.readData(4);return a===x[0]&&c===x[1]&&b===x[2]&&g===x[3]},r.prototype.readData=function(s){if(this.checkOffset(s),s===0)return[];var a=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,a},e.exports=r},{"../utils":32,"./DataReader":18}],18:[function(o,e,t){"use strict";var n=o("../utils");function r(s){this.data=s,this.length=s.length,this.index=0,this.zero=0}r.prototype={checkOffset:function(s){this.checkIndex(this.index+s)},checkIndex:function(s){if(this.length<this.zero+s||s<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+s+"). Corrupted zip ?")},setIndex:function(s){this.checkIndex(s),this.index=s},skip:function(s){this.setIndex(this.index+s)},byteAt:function(){},readInt:function(s){var a,c=0;for(this.checkOffset(s),a=this.index+s-1;a>=this.index;a--)c=(c<<8)+this.byteAt(a);return this.index+=s,c},readString:function(s){return n.transformTo("string",this.readData(s))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var s=this.readInt(4);return new Date(Date.UTC(1980+(s>>25&127),(s>>21&15)-1,s>>16&31,s>>11&31,s>>5&63,(31&s)<<1))}},e.exports=r},{"../utils":32}],19:[function(o,e,t){"use strict";var n=o("./Uint8ArrayReader");function r(s){n.call(this,s)}o("../utils").inherits(r,n),r.prototype.readData=function(s){this.checkOffset(s);var a=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,a},e.exports=r},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(o,e,t){"use strict";var n=o("./DataReader");function r(s){n.call(this,s)}o("../utils").inherits(r,n),r.prototype.byteAt=function(s){return this.data.charCodeAt(this.zero+s)},r.prototype.lastIndexOfSignature=function(s){return this.data.lastIndexOf(s)-this.zero},r.prototype.readAndCheckSignature=function(s){return s===this.readData(4)},r.prototype.readData=function(s){this.checkOffset(s);var a=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,a},e.exports=r},{"../utils":32,"./DataReader":18}],21:[function(o,e,t){"use strict";var n=o("./ArrayReader");function r(s){n.call(this,s)}o("../utils").inherits(r,n),r.prototype.readData=function(s){if(this.checkOffset(s),s===0)return new Uint8Array(0);var a=this.data.subarray(this.zero+this.index,this.zero+this.index+s);return this.index+=s,a},e.exports=r},{"../utils":32,"./ArrayReader":17}],22:[function(o,e,t){"use strict";var n=o("../utils"),r=o("../support"),s=o("./ArrayReader"),a=o("./StringReader"),c=o("./NodeBufferReader"),b=o("./Uint8ArrayReader");e.exports=function(g){var x=n.getTypeOf(g);return n.checkSupport(x),x!=="string"||r.uint8array?x==="nodebuffer"?new c(g):r.uint8array?new b(n.transformTo("uint8array",g)):new s(n.transformTo("array",g)):new a(g)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(o,e,t){"use strict";t.LOCAL_FILE_HEADER="PK",t.CENTRAL_FILE_HEADER="PK",t.CENTRAL_DIRECTORY_END="PK",t.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",t.ZIP64_CENTRAL_DIRECTORY_END="PK",t.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(o,e,t){"use strict";var n=o("./GenericWorker"),r=o("../utils");function s(a){n.call(this,"ConvertWorker to "+a),this.destType=a}r.inherits(s,n),s.prototype.processChunk=function(a){this.push({data:r.transformTo(this.destType,a.data),meta:a.meta})},e.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(o,e,t){"use strict";var n=o("./GenericWorker"),r=o("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}o("../utils").inherits(s,n),s.prototype.processChunk=function(a){this.streamInfo.crc32=r(a.data,this.streamInfo.crc32||0),this.push(a)},e.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(o,e,t){"use strict";var n=o("../utils"),r=o("./GenericWorker");function s(a){r.call(this,"DataLengthProbe for "+a),this.propName=a,this.withStreamInfo(a,0)}n.inherits(s,r),s.prototype.processChunk=function(a){if(a){var c=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=c+a.data.length}r.prototype.processChunk.call(this,a)},e.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(o,e,t){"use strict";var n=o("../utils"),r=o("./GenericWorker");function s(a){r.call(this,"DataWorker");var c=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,a.then(function(b){c.dataIsReady=!0,c.data=b,c.max=b&&b.length||0,c.type=n.getTypeOf(b),c.isPaused||c._tickAndRepeat()},function(b){c.error(b)})}n.inherits(s,r),s.prototype.cleanUp=function(){r.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!r.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var a=null,c=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":a=this.data.substring(this.index,c);break;case"uint8array":a=this.data.subarray(this.index,c);break;case"array":case"nodebuffer":a=this.data.slice(this.index,c)}return this.index=c,this.push({data:a,meta:{percent:this.max?this.index/this.max*100:0}})},e.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(o,e,t){"use strict";function n(r){this.name=r||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}n.prototype={push:function(r){this.emit("data",r)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(r){this.emit("error",r)}return!0},error:function(r){return!this.isFinished&&(this.isPaused?this.generatedError=r:(this.isFinished=!0,this.emit("error",r),this.previous&&this.previous.error(r),this.cleanUp()),!0)},on:function(r,s){return this._listeners[r].push(s),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(r,s){if(this._listeners[r])for(var a=0;a<this._listeners[r].length;a++)this._listeners[r][a].call(this,s)},pipe:function(r){return r.registerPrevious(this)},registerPrevious:function(r){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=r.streamInfo,this.mergeStreamInfo(),this.previous=r;var s=this;return r.on("data",function(a){s.processChunk(a)}),r.on("end",function(){s.end()}),r.on("error",function(a){s.error(a)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var r=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),r=!0),this.previous&&this.previous.resume(),!r},flush:function(){},processChunk:function(r){this.push(r)},withStreamInfo:function(r,s){return this.extraStreamInfo[r]=s,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var r in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,r)&&(this.streamInfo[r]=this.extraStreamInfo[r])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var r="Worker "+this.name;return this.previous?this.previous+" -> "+r:r}},e.exports=n},{}],29:[function(o,e,t){"use strict";var n=o("../utils"),r=o("./ConvertWorker"),s=o("./GenericWorker"),a=o("../base64"),c=o("../support"),b=o("../external"),g=null;if(c.nodestream)try{g=o("../nodejs/NodejsStreamOutputAdapter")}catch{}function x(f,d){return new b.Promise(function(m,h){var p=[],w=f._internalType,A=f._outputType,k=f._mimeType;f.on("data",function(M,I){p.push(M),d&&d(I)}).on("error",function(M){p=[],h(M)}).on("end",function(){try{var M=function(I,F,B){switch(I){case"blob":return n.newBlob(n.transformTo("arraybuffer",F),B);case"base64":return a.encode(F);default:return n.transformTo(I,F)}}(A,function(I,F){var B,j=0,K=null,_=0;for(B=0;B<F.length;B++)_+=F[B].length;switch(I){case"string":return F.join("");case"array":return Array.prototype.concat.apply([],F);case"uint8array":for(K=new Uint8Array(_),B=0;B<F.length;B++)K.set(F[B],j),j+=F[B].length;return K;case"nodebuffer":return Buffer.concat(F);default:throw new Error("concat : unsupported type '"+I+"'")}}(w,p),k);m(M)}catch(I){h(I)}p=[]}).resume()})}function u(f,d,m){var h=d;switch(d){case"blob":case"arraybuffer":h="uint8array";break;case"base64":h="string"}try{this._internalType=h,this._outputType=d,this._mimeType=m,n.checkSupport(h),this._worker=f.pipe(new r(h)),f.lock()}catch(p){this._worker=new s("error"),this._worker.error(p)}}u.prototype={accumulate:function(f){return x(this,f)},on:function(f,d){var m=this;return f==="data"?this._worker.on(f,function(h){d.call(m,h.data,h.meta)}):this._worker.on(f,function(){n.delay(d,arguments,m)}),this},resume:function(){return n.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(f){if(n.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new g(this,{objectMode:this._outputType!=="nodebuffer"},f)}},e.exports=u},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(o,e,t){"use strict";if(t.base64=!0,t.array=!0,t.string=!0,t.arraybuffer=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u",t.nodebuffer=typeof Buffer<"u",t.uint8array=typeof Uint8Array<"u",typeof ArrayBuffer>"u")t.blob=!1;else{var n=new ArrayBuffer(0);try{t.blob=new Blob([n],{type:"application/zip"}).size===0}catch{try{var r=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);r.append(n),t.blob=r.getBlob("application/zip").size===0}catch{t.blob=!1}}}try{t.nodestream=!!o("readable-stream").Readable}catch{t.nodestream=!1}},{"readable-stream":16}],31:[function(o,e,t){"use strict";for(var n=o("./utils"),r=o("./support"),s=o("./nodejsUtils"),a=o("./stream/GenericWorker"),c=new Array(256),b=0;b<256;b++)c[b]=252<=b?6:248<=b?5:240<=b?4:224<=b?3:192<=b?2:1;c[254]=c[254]=1;function g(){a.call(this,"utf-8 decode"),this.leftOver=null}function x(){a.call(this,"utf-8 encode")}t.utf8encode=function(u){return r.nodebuffer?s.newBufferFrom(u,"utf-8"):function(f){var d,m,h,p,w,A=f.length,k=0;for(p=0;p<A;p++)(64512&(m=f.charCodeAt(p)))==55296&&p+1<A&&(64512&(h=f.charCodeAt(p+1)))==56320&&(m=65536+(m-55296<<10)+(h-56320),p++),k+=m<128?1:m<2048?2:m<65536?3:4;for(d=r.uint8array?new Uint8Array(k):new Array(k),p=w=0;w<k;p++)(64512&(m=f.charCodeAt(p)))==55296&&p+1<A&&(64512&(h=f.charCodeAt(p+1)))==56320&&(m=65536+(m-55296<<10)+(h-56320),p++),m<128?d[w++]=m:(m<2048?d[w++]=192|m>>>6:(m<65536?d[w++]=224|m>>>12:(d[w++]=240|m>>>18,d[w++]=128|m>>>12&63),d[w++]=128|m>>>6&63),d[w++]=128|63&m);return d}(u)},t.utf8decode=function(u){return r.nodebuffer?n.transformTo("nodebuffer",u).toString("utf-8"):function(f){var d,m,h,p,w=f.length,A=new Array(2*w);for(d=m=0;d<w;)if((h=f[d++])<128)A[m++]=h;else if(4<(p=c[h]))A[m++]=65533,d+=p-1;else{for(h&=p===2?31:p===3?15:7;1<p&&d<w;)h=h<<6|63&f[d++],p--;1<p?A[m++]=65533:h<65536?A[m++]=h:(h-=65536,A[m++]=55296|h>>10&1023,A[m++]=56320|1023&h)}return A.length!==m&&(A.subarray?A=A.subarray(0,m):A.length=m),n.applyFromCharCode(A)}(u=n.transformTo(r.uint8array?"uint8array":"array",u))},n.inherits(g,a),g.prototype.processChunk=function(u){var f=n.transformTo(r.uint8array?"uint8array":"array",u.data);if(this.leftOver&&this.leftOver.length){if(r.uint8array){var d=f;(f=new Uint8Array(d.length+this.leftOver.length)).set(this.leftOver,0),f.set(d,this.leftOver.length)}else f=this.leftOver.concat(f);this.leftOver=null}var m=function(p,w){var A;for((w=w||p.length)>p.length&&(w=p.length),A=w-1;0<=A&&(192&p[A])==128;)A--;return A<0||A===0?w:A+c[p[A]]>w?A:w}(f),h=f;m!==f.length&&(r.uint8array?(h=f.subarray(0,m),this.leftOver=f.subarray(m,f.length)):(h=f.slice(0,m),this.leftOver=f.slice(m,f.length))),this.push({data:t.utf8decode(h),meta:u.meta})},g.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:t.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},t.Utf8DecodeWorker=g,n.inherits(x,a),x.prototype.processChunk=function(u){this.push({data:t.utf8encode(u.data),meta:u.meta})},t.Utf8EncodeWorker=x},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(o,e,t){"use strict";var n=o("./support"),r=o("./base64"),s=o("./nodejsUtils"),a=o("./external");function c(d){return d}function b(d,m){for(var h=0;h<d.length;++h)m[h]=255&d.charCodeAt(h);return m}o("setimmediate"),t.newBlob=function(d,m){t.checkSupport("blob");try{return new Blob([d],{type:m})}catch{try{var h=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return h.append(d),h.getBlob(m)}catch{throw new Error("Bug : can't construct the Blob.")}}};var g={stringifyByChunk:function(d,m,h){var p=[],w=0,A=d.length;if(A<=h)return String.fromCharCode.apply(null,d);for(;w<A;)m==="array"||m==="nodebuffer"?p.push(String.fromCharCode.apply(null,d.slice(w,Math.min(w+h,A)))):p.push(String.fromCharCode.apply(null,d.subarray(w,Math.min(w+h,A)))),w+=h;return p.join("")},stringifyByChar:function(d){for(var m="",h=0;h<d.length;h++)m+=String.fromCharCode(d[h]);return m},applyCanBeUsed:{uint8array:function(){try{return n.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return n.nodebuffer&&String.fromCharCode.apply(null,s.allocBuffer(1)).length===1}catch{return!1}}()}};function x(d){var m=65536,h=t.getTypeOf(d),p=!0;if(h==="uint8array"?p=g.applyCanBeUsed.uint8array:h==="nodebuffer"&&(p=g.applyCanBeUsed.nodebuffer),p)for(;1<m;)try{return g.stringifyByChunk(d,h,m)}catch{m=Math.floor(m/2)}return g.stringifyByChar(d)}function u(d,m){for(var h=0;h<d.length;h++)m[h]=d[h];return m}t.applyFromCharCode=x;var f={};f.string={string:c,array:function(d){return b(d,new Array(d.length))},arraybuffer:function(d){return f.string.uint8array(d).buffer},uint8array:function(d){return b(d,new Uint8Array(d.length))},nodebuffer:function(d){return b(d,s.allocBuffer(d.length))}},f.array={string:x,array:c,arraybuffer:function(d){return new Uint8Array(d).buffer},uint8array:function(d){return new Uint8Array(d)},nodebuffer:function(d){return s.newBufferFrom(d)}},f.arraybuffer={string:function(d){return x(new Uint8Array(d))},array:function(d){return u(new Uint8Array(d),new Array(d.byteLength))},arraybuffer:c,uint8array:function(d){return new Uint8Array(d)},nodebuffer:function(d){return s.newBufferFrom(new Uint8Array(d))}},f.uint8array={string:x,array:function(d){return u(d,new Array(d.length))},arraybuffer:function(d){return d.buffer},uint8array:c,nodebuffer:function(d){return s.newBufferFrom(d)}},f.nodebuffer={string:x,array:function(d){return u(d,new Array(d.length))},arraybuffer:function(d){return f.nodebuffer.uint8array(d).buffer},uint8array:function(d){return u(d,new Uint8Array(d.length))},nodebuffer:c},t.transformTo=function(d,m){if(m=m||"",!d)return m;t.checkSupport(d);var h=t.getTypeOf(m);return f[h][d](m)},t.resolve=function(d){for(var m=d.split("/"),h=[],p=0;p<m.length;p++){var w=m[p];w==="."||w===""&&p!==0&&p!==m.length-1||(w===".."?h.pop():h.push(w))}return h.join("/")},t.getTypeOf=function(d){return typeof d=="string"?"string":Object.prototype.toString.call(d)==="[object Array]"?"array":n.nodebuffer&&s.isBuffer(d)?"nodebuffer":n.uint8array&&d instanceof Uint8Array?"uint8array":n.arraybuffer&&d instanceof ArrayBuffer?"arraybuffer":void 0},t.checkSupport=function(d){if(!n[d.toLowerCase()])throw new Error(d+" is not supported by this platform")},t.MAX_VALUE_16BITS=65535,t.MAX_VALUE_32BITS=-1,t.pretty=function(d){var m,h,p="";for(h=0;h<(d||"").length;h++)p+="\\x"+((m=d.charCodeAt(h))<16?"0":"")+m.toString(16).toUpperCase();return p},t.delay=function(d,m,h){setImmediate(function(){d.apply(h||null,m||[])})},t.inherits=function(d,m){function h(){}h.prototype=m.prototype,d.prototype=new h},t.extend=function(){var d,m,h={};for(d=0;d<arguments.length;d++)for(m in arguments[d])Object.prototype.hasOwnProperty.call(arguments[d],m)&&h[m]===void 0&&(h[m]=arguments[d][m]);return h},t.prepareContent=function(d,m,h,p,w){return a.Promise.resolve(m).then(function(A){return n.blob&&(A instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(A))!==-1)&&typeof FileReader<"u"?new a.Promise(function(k,M){var I=new FileReader;I.onload=function(F){k(F.target.result)},I.onerror=function(F){M(F.target.error)},I.readAsArrayBuffer(A)}):A}).then(function(A){var k=t.getTypeOf(A);return k?(k==="arraybuffer"?A=t.transformTo("uint8array",A):k==="string"&&(w?A=r.decode(A):h&&p!==!0&&(A=function(M){return b(M,n.uint8array?new Uint8Array(M.length):new Array(M.length))}(A))),A):a.Promise.reject(new Error("Can't read the data of '"+d+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(o,e,t){"use strict";var n=o("./reader/readerFor"),r=o("./utils"),s=o("./signature"),a=o("./zipEntry"),c=o("./support");function b(g){this.files=[],this.loadOptions=g}b.prototype={checkSignature:function(g){if(!this.reader.readAndCheckSignature(g)){this.reader.index-=4;var x=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+r.pretty(x)+", expected "+r.pretty(g)+")")}},isSignature:function(g,x){var u=this.reader.index;this.reader.setIndex(g);var f=this.reader.readString(4)===x;return this.reader.setIndex(u),f},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var g=this.reader.readData(this.zipCommentLength),x=c.uint8array?"uint8array":"array",u=r.transformTo(x,g);this.zipComment=this.loadOptions.decodeFileName(u)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var g,x,u,f=this.zip64EndOfCentralSize-44;0<f;)g=this.reader.readInt(2),x=this.reader.readInt(4),u=this.reader.readData(x),this.zip64ExtensibleData[g]={id:g,length:x,value:u}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var g,x;for(g=0;g<this.files.length;g++)x=this.files[g],this.reader.setIndex(x.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),x.readLocalPart(this.reader),x.handleUTF8(),x.processAttributes()},readCentralDir:function(){var g;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(g=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(g);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var g=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(g<0)throw this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(g);var x=g;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===r.MAX_VALUE_16BITS||this.diskWithCentralDirStart===r.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===r.MAX_VALUE_16BITS||this.centralDirRecords===r.MAX_VALUE_16BITS||this.centralDirSize===r.MAX_VALUE_32BITS||this.centralDirOffset===r.MAX_VALUE_32BITS){if(this.zip64=!0,(g=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(g),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var u=this.centralDirOffset+this.centralDirSize;this.zip64&&(u+=20,u+=12+this.zip64EndOfCentralSize);var f=x-u;if(0<f)this.isSignature(x,s.CENTRAL_FILE_HEADER)||(this.reader.zero=f);else if(f<0)throw new Error("Corrupted zip: missing "+Math.abs(f)+" bytes.")},prepareReader:function(g){this.reader=n(g)},load:function(g){this.prepareReader(g),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},e.exports=b},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(o,e,t){"use strict";var n=o("./reader/readerFor"),r=o("./utils"),s=o("./compressedObject"),a=o("./crc32"),c=o("./utf8"),b=o("./compressions"),g=o("./support");function x(u,f){this.options=u,this.loadOptions=f}x.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(u){var f,d;if(u.skip(22),this.fileNameLength=u.readInt(2),d=u.readInt(2),this.fileName=u.readData(this.fileNameLength),u.skip(d),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((f=function(m){for(var h in b)if(Object.prototype.hasOwnProperty.call(b,h)&&b[h].magic===m)return b[h];return null}(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+r.pretty(this.compressionMethod)+" unknown (inner file : "+r.transformTo("string",this.fileName)+")");this.decompressed=new s(this.compressedSize,this.uncompressedSize,this.crc32,f,u.readData(this.compressedSize))},readCentralPart:function(u){this.versionMadeBy=u.readInt(2),u.skip(2),this.bitFlag=u.readInt(2),this.compressionMethod=u.readString(2),this.date=u.readDate(),this.crc32=u.readInt(4),this.compressedSize=u.readInt(4),this.uncompressedSize=u.readInt(4);var f=u.readInt(2);if(this.extraFieldsLength=u.readInt(2),this.fileCommentLength=u.readInt(2),this.diskNumberStart=u.readInt(2),this.internalFileAttributes=u.readInt(2),this.externalFileAttributes=u.readInt(4),this.localHeaderOffset=u.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");u.skip(f),this.readExtraFields(u),this.parseZIP64ExtraField(u),this.fileComment=u.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var u=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),u==0&&(this.dosPermissions=63&this.externalFileAttributes),u==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var u=n(this.extraFields[1].value);this.uncompressedSize===r.MAX_VALUE_32BITS&&(this.uncompressedSize=u.readInt(8)),this.compressedSize===r.MAX_VALUE_32BITS&&(this.compressedSize=u.readInt(8)),this.localHeaderOffset===r.MAX_VALUE_32BITS&&(this.localHeaderOffset=u.readInt(8)),this.diskNumberStart===r.MAX_VALUE_32BITS&&(this.diskNumberStart=u.readInt(4))}},readExtraFields:function(u){var f,d,m,h=u.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});u.index+4<h;)f=u.readInt(2),d=u.readInt(2),m=u.readData(d),this.extraFields[f]={id:f,length:d,value:m};u.setIndex(h)},handleUTF8:function(){var u=g.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=c.utf8decode(this.fileName),this.fileCommentStr=c.utf8decode(this.fileComment);else{var f=this.findExtraFieldUnicodePath();if(f!==null)this.fileNameStr=f;else{var d=r.transformTo(u,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(d)}var m=this.findExtraFieldUnicodeComment();if(m!==null)this.fileCommentStr=m;else{var h=r.transformTo(u,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(h)}}},findExtraFieldUnicodePath:function(){var u=this.extraFields[28789];if(u){var f=n(u.value);return f.readInt(1)!==1||a(this.fileName)!==f.readInt(4)?null:c.utf8decode(f.readData(u.length-5))}return null},findExtraFieldUnicodeComment:function(){var u=this.extraFields[25461];if(u){var f=n(u.value);return f.readInt(1)!==1||a(this.fileComment)!==f.readInt(4)?null:c.utf8decode(f.readData(u.length-5))}return null}},e.exports=x},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(o,e,t){"use strict";function n(f,d,m){this.name=f,this.dir=m.dir,this.date=m.date,this.comment=m.comment,this.unixPermissions=m.unixPermissions,this.dosPermissions=m.dosPermissions,this._data=d,this._dataBinary=m.binary,this.options={compression:m.compression,compressionOptions:m.compressionOptions}}var r=o("./stream/StreamHelper"),s=o("./stream/DataWorker"),a=o("./utf8"),c=o("./compressedObject"),b=o("./stream/GenericWorker");n.prototype={internalStream:function(f){var d=null,m="string";try{if(!f)throw new Error("No output type specified.");var h=(m=f.toLowerCase())==="string"||m==="text";m!=="binarystring"&&m!=="text"||(m="string"),d=this._decompressWorker();var p=!this._dataBinary;p&&!h&&(d=d.pipe(new a.Utf8EncodeWorker)),!p&&h&&(d=d.pipe(new a.Utf8DecodeWorker))}catch(w){(d=new b("error")).error(w)}return new r(d,m,"")},async:function(f,d){return this.internalStream(f).accumulate(d)},nodeStream:function(f,d){return this.internalStream(f||"nodebuffer").toNodejsStream(d)},_compressWorker:function(f,d){if(this._data instanceof c&&this._data.compression.magic===f.magic)return this._data.getCompressedWorker();var m=this._decompressWorker();return this._dataBinary||(m=m.pipe(new a.Utf8EncodeWorker)),c.createWorkerFrom(m,f,d)},_decompressWorker:function(){return this._data instanceof c?this._data.getContentWorker():this._data instanceof b?this._data:new s(this._data)}};for(var g=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],x=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},u=0;u<g.length;u++)n.prototype[g[u]]=x;e.exports=n},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(o,e,t){(function(n){"use strict";var r,s,a=n.MutationObserver||n.WebKitMutationObserver;if(a){var c=0,b=new a(f),g=n.document.createTextNode("");b.observe(g,{characterData:!0}),r=function(){g.data=c=++c%2}}else if(n.setImmediate||n.MessageChannel===void 0)r="document"in n&&"onreadystatechange"in n.document.createElement("script")?function(){var d=n.document.createElement("script");d.onreadystatechange=function(){f(),d.onreadystatechange=null,d.parentNode.removeChild(d),d=null},n.document.documentElement.appendChild(d)}:function(){setTimeout(f,0)};else{var x=new n.MessageChannel;x.port1.onmessage=f,r=function(){x.port2.postMessage(0)}}var u=[];function f(){var d,m;s=!0;for(var h=u.length;h;){for(m=u,u=[],d=-1;++d<h;)m[d]();h=u.length}s=!1}e.exports=function(d){u.push(d)!==1||s||r()}}).call(this,typeof global<"u"?global:typeof self<"u"?self:typeof window<"u"?window:{})},{}],37:[function(o,e,t){"use strict";var n=o("immediate");function r(){}var s={},a=["REJECTED"],c=["FULFILLED"],b=["PENDING"];function g(h){if(typeof h!="function")throw new TypeError("resolver must be a function");this.state=b,this.queue=[],this.outcome=void 0,h!==r&&d(this,h)}function x(h,p,w){this.promise=h,typeof p=="function"&&(this.onFulfilled=p,this.callFulfilled=this.otherCallFulfilled),typeof w=="function"&&(this.onRejected=w,this.callRejected=this.otherCallRejected)}function u(h,p,w){n(function(){var A;try{A=p(w)}catch(k){return s.reject(h,k)}A===h?s.reject(h,new TypeError("Cannot resolve promise with itself")):s.resolve(h,A)})}function f(h){var p=h&&h.then;if(h&&(typeof h=="object"||typeof h=="function")&&typeof p=="function")return function(){p.apply(h,arguments)}}function d(h,p){var w=!1;function A(I){w||(w=!0,s.reject(h,I))}function k(I){w||(w=!0,s.resolve(h,I))}var M=m(function(){p(k,A)});M.status==="error"&&A(M.value)}function m(h,p){var w={};try{w.value=h(p),w.status="success"}catch(A){w.status="error",w.value=A}return w}(e.exports=g).prototype.finally=function(h){if(typeof h!="function")return this;var p=this.constructor;return this.then(function(w){return p.resolve(h()).then(function(){return w})},function(w){return p.resolve(h()).then(function(){throw w})})},g.prototype.catch=function(h){return this.then(null,h)},g.prototype.then=function(h,p){if(typeof h!="function"&&this.state===c||typeof p!="function"&&this.state===a)return this;var w=new this.constructor(r);return this.state!==b?u(w,this.state===c?h:p,this.outcome):this.queue.push(new x(w,h,p)),w},x.prototype.callFulfilled=function(h){s.resolve(this.promise,h)},x.prototype.otherCallFulfilled=function(h){u(this.promise,this.onFulfilled,h)},x.prototype.callRejected=function(h){s.reject(this.promise,h)},x.prototype.otherCallRejected=function(h){u(this.promise,this.onRejected,h)},s.resolve=function(h,p){var w=m(f,p);if(w.status==="error")return s.reject(h,w.value);var A=w.value;if(A)d(h,A);else{h.state=c,h.outcome=p;for(var k=-1,M=h.queue.length;++k<M;)h.queue[k].callFulfilled(p)}return h},s.reject=function(h,p){h.state=a,h.outcome=p;for(var w=-1,A=h.queue.length;++w<A;)h.queue[w].callRejected(p);return h},g.resolve=function(h){return h instanceof this?h:s.resolve(new this(r),h)},g.reject=function(h){var p=new this(r);return s.reject(p,h)},g.all=function(h){var p=this;if(Object.prototype.toString.call(h)!=="[object Array]")return this.reject(new TypeError("must be an array"));var w=h.length,A=!1;if(!w)return this.resolve([]);for(var k=new Array(w),M=0,I=-1,F=new this(r);++I<w;)B(h[I],I);return F;function B(j,K){p.resolve(j).then(function(_){k[K]=_,++M!==w||A||(A=!0,s.resolve(F,k))},function(_){A||(A=!0,s.reject(F,_))})}},g.race=function(h){var p=this;if(Object.prototype.toString.call(h)!=="[object Array]")return this.reject(new TypeError("must be an array"));var w=h.length,A=!1;if(!w)return this.resolve([]);for(var k=-1,M=new this(r);++k<w;)I=h[k],p.resolve(I).then(function(F){A||(A=!0,s.resolve(M,F))},function(F){A||(A=!0,s.reject(M,F))});var I;return M}},{immediate:36}],38:[function(o,e,t){"use strict";var n={};(0,o("./lib/utils/common").assign)(n,o("./lib/deflate"),o("./lib/inflate"),o("./lib/zlib/constants")),e.exports=n},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(o,e,t){"use strict";var n=o("./zlib/deflate"),r=o("./utils/common"),s=o("./utils/strings"),a=o("./zlib/messages"),c=o("./zlib/zstream"),b=Object.prototype.toString,g=0,x=-1,u=0,f=8;function d(h){if(!(this instanceof d))return new d(h);this.options=r.assign({level:x,method:f,chunkSize:16384,windowBits:15,memLevel:8,strategy:u,to:""},h||{});var p=this.options;p.raw&&0<p.windowBits?p.windowBits=-p.windowBits:p.gzip&&0<p.windowBits&&p.windowBits<16&&(p.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new c,this.strm.avail_out=0;var w=n.deflateInit2(this.strm,p.level,p.method,p.windowBits,p.memLevel,p.strategy);if(w!==g)throw new Error(a[w]);if(p.header&&n.deflateSetHeader(this.strm,p.header),p.dictionary){var A;if(A=typeof p.dictionary=="string"?s.string2buf(p.dictionary):b.call(p.dictionary)==="[object ArrayBuffer]"?new Uint8Array(p.dictionary):p.dictionary,(w=n.deflateSetDictionary(this.strm,A))!==g)throw new Error(a[w]);this._dict_set=!0}}function m(h,p){var w=new d(p);if(w.push(h,!0),w.err)throw w.msg||a[w.err];return w.result}d.prototype.push=function(h,p){var w,A,k=this.strm,M=this.options.chunkSize;if(this.ended)return!1;A=p===~~p?p:p===!0?4:0,typeof h=="string"?k.input=s.string2buf(h):b.call(h)==="[object ArrayBuffer]"?k.input=new Uint8Array(h):k.input=h,k.next_in=0,k.avail_in=k.input.length;do{if(k.avail_out===0&&(k.output=new r.Buf8(M),k.next_out=0,k.avail_out=M),(w=n.deflate(k,A))!==1&&w!==g)return this.onEnd(w),!(this.ended=!0);k.avail_out!==0&&(k.avail_in!==0||A!==4&&A!==2)||(this.options.to==="string"?this.onData(s.buf2binstring(r.shrinkBuf(k.output,k.next_out))):this.onData(r.shrinkBuf(k.output,k.next_out)))}while((0<k.avail_in||k.avail_out===0)&&w!==1);return A===4?(w=n.deflateEnd(this.strm),this.onEnd(w),this.ended=!0,w===g):A!==2||(this.onEnd(g),!(k.avail_out=0))},d.prototype.onData=function(h){this.chunks.push(h)},d.prototype.onEnd=function(h){h===g&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=h,this.msg=this.strm.msg},t.Deflate=d,t.deflate=m,t.deflateRaw=function(h,p){return(p=p||{}).raw=!0,m(h,p)},t.gzip=function(h,p){return(p=p||{}).gzip=!0,m(h,p)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(o,e,t){"use strict";var n=o("./zlib/inflate"),r=o("./utils/common"),s=o("./utils/strings"),a=o("./zlib/constants"),c=o("./zlib/messages"),b=o("./zlib/zstream"),g=o("./zlib/gzheader"),x=Object.prototype.toString;function u(d){if(!(this instanceof u))return new u(d);this.options=r.assign({chunkSize:16384,windowBits:0,to:""},d||{});var m=this.options;m.raw&&0<=m.windowBits&&m.windowBits<16&&(m.windowBits=-m.windowBits,m.windowBits===0&&(m.windowBits=-15)),!(0<=m.windowBits&&m.windowBits<16)||d&&d.windowBits||(m.windowBits+=32),15<m.windowBits&&m.windowBits<48&&(15&m.windowBits)==0&&(m.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new b,this.strm.avail_out=0;var h=n.inflateInit2(this.strm,m.windowBits);if(h!==a.Z_OK)throw new Error(c[h]);this.header=new g,n.inflateGetHeader(this.strm,this.header)}function f(d,m){var h=new u(m);if(h.push(d,!0),h.err)throw h.msg||c[h.err];return h.result}u.prototype.push=function(d,m){var h,p,w,A,k,M,I=this.strm,F=this.options.chunkSize,B=this.options.dictionary,j=!1;if(this.ended)return!1;p=m===~~m?m:m===!0?a.Z_FINISH:a.Z_NO_FLUSH,typeof d=="string"?I.input=s.binstring2buf(d):x.call(d)==="[object ArrayBuffer]"?I.input=new Uint8Array(d):I.input=d,I.next_in=0,I.avail_in=I.input.length;do{if(I.avail_out===0&&(I.output=new r.Buf8(F),I.next_out=0,I.avail_out=F),(h=n.inflate(I,a.Z_NO_FLUSH))===a.Z_NEED_DICT&&B&&(M=typeof B=="string"?s.string2buf(B):x.call(B)==="[object ArrayBuffer]"?new Uint8Array(B):B,h=n.inflateSetDictionary(this.strm,M)),h===a.Z_BUF_ERROR&&j===!0&&(h=a.Z_OK,j=!1),h!==a.Z_STREAM_END&&h!==a.Z_OK)return this.onEnd(h),!(this.ended=!0);I.next_out&&(I.avail_out!==0&&h!==a.Z_STREAM_END&&(I.avail_in!==0||p!==a.Z_FINISH&&p!==a.Z_SYNC_FLUSH)||(this.options.to==="string"?(w=s.utf8border(I.output,I.next_out),A=I.next_out-w,k=s.buf2string(I.output,w),I.next_out=A,I.avail_out=F-A,A&&r.arraySet(I.output,I.output,w,A,0),this.onData(k)):this.onData(r.shrinkBuf(I.output,I.next_out)))),I.avail_in===0&&I.avail_out===0&&(j=!0)}while((0<I.avail_in||I.avail_out===0)&&h!==a.Z_STREAM_END);return h===a.Z_STREAM_END&&(p=a.Z_FINISH),p===a.Z_FINISH?(h=n.inflateEnd(this.strm),this.onEnd(h),this.ended=!0,h===a.Z_OK):p!==a.Z_SYNC_FLUSH||(this.onEnd(a.Z_OK),!(I.avail_out=0))},u.prototype.onData=function(d){this.chunks.push(d)},u.prototype.onEnd=function(d){d===a.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=d,this.msg=this.strm.msg},t.Inflate=u,t.inflate=f,t.inflateRaw=function(d,m){return(m=m||{}).raw=!0,f(d,m)},t.ungzip=f},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(o,e,t){"use strict";var n=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";t.assign=function(a){for(var c=Array.prototype.slice.call(arguments,1);c.length;){var b=c.shift();if(b){if(typeof b!="object")throw new TypeError(b+"must be non-object");for(var g in b)b.hasOwnProperty(g)&&(a[g]=b[g])}}return a},t.shrinkBuf=function(a,c){return a.length===c?a:a.subarray?a.subarray(0,c):(a.length=c,a)};var r={arraySet:function(a,c,b,g,x){if(c.subarray&&a.subarray)a.set(c.subarray(b,b+g),x);else for(var u=0;u<g;u++)a[x+u]=c[b+u]},flattenChunks:function(a){var c,b,g,x,u,f;for(c=g=0,b=a.length;c<b;c++)g+=a[c].length;for(f=new Uint8Array(g),c=x=0,b=a.length;c<b;c++)u=a[c],f.set(u,x),x+=u.length;return f}},s={arraySet:function(a,c,b,g,x){for(var u=0;u<g;u++)a[x+u]=c[b+u]},flattenChunks:function(a){return[].concat.apply([],a)}};t.setTyped=function(a){a?(t.Buf8=Uint8Array,t.Buf16=Uint16Array,t.Buf32=Int32Array,t.assign(t,r)):(t.Buf8=Array,t.Buf16=Array,t.Buf32=Array,t.assign(t,s))},t.setTyped(n)},{}],42:[function(o,e,t){"use strict";var n=o("./common"),r=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch{r=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{s=!1}for(var a=new n.Buf8(256),c=0;c<256;c++)a[c]=252<=c?6:248<=c?5:240<=c?4:224<=c?3:192<=c?2:1;function b(g,x){if(x<65537&&(g.subarray&&s||!g.subarray&&r))return String.fromCharCode.apply(null,n.shrinkBuf(g,x));for(var u="",f=0;f<x;f++)u+=String.fromCharCode(g[f]);return u}a[254]=a[254]=1,t.string2buf=function(g){var x,u,f,d,m,h=g.length,p=0;for(d=0;d<h;d++)(64512&(u=g.charCodeAt(d)))==55296&&d+1<h&&(64512&(f=g.charCodeAt(d+1)))==56320&&(u=65536+(u-55296<<10)+(f-56320),d++),p+=u<128?1:u<2048?2:u<65536?3:4;for(x=new n.Buf8(p),d=m=0;m<p;d++)(64512&(u=g.charCodeAt(d)))==55296&&d+1<h&&(64512&(f=g.charCodeAt(d+1)))==56320&&(u=65536+(u-55296<<10)+(f-56320),d++),u<128?x[m++]=u:(u<2048?x[m++]=192|u>>>6:(u<65536?x[m++]=224|u>>>12:(x[m++]=240|u>>>18,x[m++]=128|u>>>12&63),x[m++]=128|u>>>6&63),x[m++]=128|63&u);return x},t.buf2binstring=function(g){return b(g,g.length)},t.binstring2buf=function(g){for(var x=new n.Buf8(g.length),u=0,f=x.length;u<f;u++)x[u]=g.charCodeAt(u);return x},t.buf2string=function(g,x){var u,f,d,m,h=x||g.length,p=new Array(2*h);for(u=f=0;u<h;)if((d=g[u++])<128)p[f++]=d;else if(4<(m=a[d]))p[f++]=65533,u+=m-1;else{for(d&=m===2?31:m===3?15:7;1<m&&u<h;)d=d<<6|63&g[u++],m--;1<m?p[f++]=65533:d<65536?p[f++]=d:(d-=65536,p[f++]=55296|d>>10&1023,p[f++]=56320|1023&d)}return b(p,f)},t.utf8border=function(g,x){var u;for((x=x||g.length)>g.length&&(x=g.length),u=x-1;0<=u&&(192&g[u])==128;)u--;return u<0||u===0?x:u+a[g[u]]>x?u:x}},{"./common":41}],43:[function(o,e,t){"use strict";e.exports=function(n,r,s,a){for(var c=65535&n|0,b=n>>>16&65535|0,g=0;s!==0;){for(s-=g=2e3<s?2e3:s;b=b+(c=c+r[a++]|0)|0,--g;);c%=65521,b%=65521}return c|b<<16|0}},{}],44:[function(o,e,t){"use strict";e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(o,e,t){"use strict";var n=function(){for(var r,s=[],a=0;a<256;a++){r=a;for(var c=0;c<8;c++)r=1&r?3988292384^r>>>1:r>>>1;s[a]=r}return s}();e.exports=function(r,s,a,c){var b=n,g=c+a;r^=-1;for(var x=c;x<g;x++)r=r>>>8^b[255&(r^s[x])];return-1^r}},{}],46:[function(o,e,t){"use strict";var n,r=o("../utils/common"),s=o("./trees"),a=o("./adler32"),c=o("./crc32"),b=o("./messages"),g=0,x=4,u=0,f=-2,d=-1,m=4,h=2,p=8,w=9,A=286,k=30,M=19,I=2*A+1,F=15,B=3,j=258,K=j+B+1,_=42,N=113,l=1,R=2,te=3,U=4;function ne(i,O){return i.msg=b[O],O}function H(i){return(i<<1)-(4<i?9:0)}function ee(i){for(var O=i.length;0<=--O;)i[O]=0}function T(i){var O=i.state,L=O.pending;L>i.avail_out&&(L=i.avail_out),L!==0&&(r.arraySet(i.output,O.pending_buf,O.pending_out,L,i.next_out),i.next_out+=L,O.pending_out+=L,i.total_out+=L,i.avail_out-=L,O.pending-=L,O.pending===0&&(O.pending_out=0))}function E(i,O){s._tr_flush_block(i,0<=i.block_start?i.block_start:-1,i.strstart-i.block_start,O),i.block_start=i.strstart,T(i.strm)}function Q(i,O){i.pending_buf[i.pending++]=O}function G(i,O){i.pending_buf[i.pending++]=O>>>8&255,i.pending_buf[i.pending++]=255&O}function V(i,O){var L,v,y=i.max_chain_length,S=i.strstart,P=i.prev_length,$=i.nice_match,C=i.strstart>i.w_size-K?i.strstart-(i.w_size-K):0,q=i.window,Z=i.w_mask,Y=i.prev,X=i.strstart+j,le=q[S+P-1],oe=q[S+P];i.prev_length>=i.good_match&&(y>>=2),$>i.lookahead&&($=i.lookahead);do if(q[(L=O)+P]===oe&&q[L+P-1]===le&&q[L]===q[S]&&q[++L]===q[S+1]){S+=2,L++;do;while(q[++S]===q[++L]&&q[++S]===q[++L]&&q[++S]===q[++L]&&q[++S]===q[++L]&&q[++S]===q[++L]&&q[++S]===q[++L]&&q[++S]===q[++L]&&q[++S]===q[++L]&&S<X);if(v=j-(X-S),S=X-j,P<v){if(i.match_start=O,$<=(P=v))break;le=q[S+P-1],oe=q[S+P]}}while((O=Y[O&Z])>C&&--y!=0);return P<=i.lookahead?P:i.lookahead}function de(i){var O,L,v,y,S,P,$,C,q,Z,Y=i.w_size;do{if(y=i.window_size-i.lookahead-i.strstart,i.strstart>=Y+(Y-K)){for(r.arraySet(i.window,i.window,Y,Y,0),i.match_start-=Y,i.strstart-=Y,i.block_start-=Y,O=L=i.hash_size;v=i.head[--O],i.head[O]=Y<=v?v-Y:0,--L;);for(O=L=Y;v=i.prev[--O],i.prev[O]=Y<=v?v-Y:0,--L;);y+=Y}if(i.strm.avail_in===0)break;if(P=i.strm,$=i.window,C=i.strstart+i.lookahead,q=y,Z=void 0,Z=P.avail_in,q<Z&&(Z=q),L=Z===0?0:(P.avail_in-=Z,r.arraySet($,P.input,P.next_in,Z,C),P.state.wrap===1?P.adler=a(P.adler,$,Z,C):P.state.wrap===2&&(P.adler=c(P.adler,$,Z,C)),P.next_in+=Z,P.total_in+=Z,Z),i.lookahead+=L,i.lookahead+i.insert>=B)for(S=i.strstart-i.insert,i.ins_h=i.window[S],i.ins_h=(i.ins_h<<i.hash_shift^i.window[S+1])&i.hash_mask;i.insert&&(i.ins_h=(i.ins_h<<i.hash_shift^i.window[S+B-1])&i.hash_mask,i.prev[S&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=S,S++,i.insert--,!(i.lookahead+i.insert<B)););}while(i.lookahead<K&&i.strm.avail_in!==0)}function ye(i,O){for(var L,v;;){if(i.lookahead<K){if(de(i),i.lookahead<K&&O===g)return l;if(i.lookahead===0)break}if(L=0,i.lookahead>=B&&(i.ins_h=(i.ins_h<<i.hash_shift^i.window[i.strstart+B-1])&i.hash_mask,L=i.prev[i.strstart&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=i.strstart),L!==0&&i.strstart-L<=i.w_size-K&&(i.match_length=V(i,L)),i.match_length>=B)if(v=s._tr_tally(i,i.strstart-i.match_start,i.match_length-B),i.lookahead-=i.match_length,i.match_length<=i.max_lazy_match&&i.lookahead>=B){for(i.match_length--;i.strstart++,i.ins_h=(i.ins_h<<i.hash_shift^i.window[i.strstart+B-1])&i.hash_mask,L=i.prev[i.strstart&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=i.strstart,--i.match_length!=0;);i.strstart++}else i.strstart+=i.match_length,i.match_length=0,i.ins_h=i.window[i.strstart],i.ins_h=(i.ins_h<<i.hash_shift^i.window[i.strstart+1])&i.hash_mask;else v=s._tr_tally(i,0,i.window[i.strstart]),i.lookahead--,i.strstart++;if(v&&(E(i,!1),i.strm.avail_out===0))return l}return i.insert=i.strstart<B-1?i.strstart:B-1,O===x?(E(i,!0),i.strm.avail_out===0?te:U):i.last_lit&&(E(i,!1),i.strm.avail_out===0)?l:R}function re(i,O){for(var L,v,y;;){if(i.lookahead<K){if(de(i),i.lookahead<K&&O===g)return l;if(i.lookahead===0)break}if(L=0,i.lookahead>=B&&(i.ins_h=(i.ins_h<<i.hash_shift^i.window[i.strstart+B-1])&i.hash_mask,L=i.prev[i.strstart&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=i.strstart),i.prev_length=i.match_length,i.prev_match=i.match_start,i.match_length=B-1,L!==0&&i.prev_length<i.max_lazy_match&&i.strstart-L<=i.w_size-K&&(i.match_length=V(i,L),i.match_length<=5&&(i.strategy===1||i.match_length===B&&4096<i.strstart-i.match_start)&&(i.match_length=B-1)),i.prev_length>=B&&i.match_length<=i.prev_length){for(y=i.strstart+i.lookahead-B,v=s._tr_tally(i,i.strstart-1-i.prev_match,i.prev_length-B),i.lookahead-=i.prev_length-1,i.prev_length-=2;++i.strstart<=y&&(i.ins_h=(i.ins_h<<i.hash_shift^i.window[i.strstart+B-1])&i.hash_mask,L=i.prev[i.strstart&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=i.strstart),--i.prev_length!=0;);if(i.match_available=0,i.match_length=B-1,i.strstart++,v&&(E(i,!1),i.strm.avail_out===0))return l}else if(i.match_available){if((v=s._tr_tally(i,0,i.window[i.strstart-1]))&&E(i,!1),i.strstart++,i.lookahead--,i.strm.avail_out===0)return l}else i.match_available=1,i.strstart++,i.lookahead--}return i.match_available&&(v=s._tr_tally(i,0,i.window[i.strstart-1]),i.match_available=0),i.insert=i.strstart<B-1?i.strstart:B-1,O===x?(E(i,!0),i.strm.avail_out===0?te:U):i.last_lit&&(E(i,!1),i.strm.avail_out===0)?l:R}function ie(i,O,L,v,y){this.good_length=i,this.max_lazy=O,this.nice_length=L,this.max_chain=v,this.func=y}function ge(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=p,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new r.Buf16(2*I),this.dyn_dtree=new r.Buf16(2*(2*k+1)),this.bl_tree=new r.Buf16(2*(2*M+1)),ee(this.dyn_ltree),ee(this.dyn_dtree),ee(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new r.Buf16(F+1),this.heap=new r.Buf16(2*A+1),ee(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new r.Buf16(2*A+1),ee(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function ue(i){var O;return i&&i.state?(i.total_in=i.total_out=0,i.data_type=h,(O=i.state).pending=0,O.pending_out=0,O.wrap<0&&(O.wrap=-O.wrap),O.status=O.wrap?_:N,i.adler=O.wrap===2?0:1,O.last_flush=g,s._tr_init(O),u):ne(i,f)}function Ee(i){var O=ue(i);return O===u&&function(L){L.window_size=2*L.w_size,ee(L.head),L.max_lazy_match=n[L.level].max_lazy,L.good_match=n[L.level].good_length,L.nice_match=n[L.level].nice_length,L.max_chain_length=n[L.level].max_chain,L.strstart=0,L.block_start=0,L.lookahead=0,L.insert=0,L.match_length=L.prev_length=B-1,L.match_available=0,L.ins_h=0}(i.state),O}function Se(i,O,L,v,y,S){if(!i)return f;var P=1;if(O===d&&(O=6),v<0?(P=0,v=-v):15<v&&(P=2,v-=16),y<1||w<y||L!==p||v<8||15<v||O<0||9<O||S<0||m<S)return ne(i,f);v===8&&(v=9);var $=new ge;return(i.state=$).strm=i,$.wrap=P,$.gzhead=null,$.w_bits=v,$.w_size=1<<$.w_bits,$.w_mask=$.w_size-1,$.hash_bits=y+7,$.hash_size=1<<$.hash_bits,$.hash_mask=$.hash_size-1,$.hash_shift=~~(($.hash_bits+B-1)/B),$.window=new r.Buf8(2*$.w_size),$.head=new r.Buf16($.hash_size),$.prev=new r.Buf16($.w_size),$.lit_bufsize=1<<y+6,$.pending_buf_size=4*$.lit_bufsize,$.pending_buf=new r.Buf8($.pending_buf_size),$.d_buf=1*$.lit_bufsize,$.l_buf=3*$.lit_bufsize,$.level=O,$.strategy=S,$.method=L,Ee(i)}n=[new ie(0,0,0,0,function(i,O){var L=65535;for(L>i.pending_buf_size-5&&(L=i.pending_buf_size-5);;){if(i.lookahead<=1){if(de(i),i.lookahead===0&&O===g)return l;if(i.lookahead===0)break}i.strstart+=i.lookahead,i.lookahead=0;var v=i.block_start+L;if((i.strstart===0||i.strstart>=v)&&(i.lookahead=i.strstart-v,i.strstart=v,E(i,!1),i.strm.avail_out===0)||i.strstart-i.block_start>=i.w_size-K&&(E(i,!1),i.strm.avail_out===0))return l}return i.insert=0,O===x?(E(i,!0),i.strm.avail_out===0?te:U):(i.strstart>i.block_start&&(E(i,!1),i.strm.avail_out),l)}),new ie(4,4,8,4,ye),new ie(4,5,16,8,ye),new ie(4,6,32,32,ye),new ie(4,4,16,16,re),new ie(8,16,32,32,re),new ie(8,16,128,128,re),new ie(8,32,128,256,re),new ie(32,128,258,1024,re),new ie(32,258,258,4096,re)],t.deflateInit=function(i,O){return Se(i,O,p,15,8,0)},t.deflateInit2=Se,t.deflateReset=Ee,t.deflateResetKeep=ue,t.deflateSetHeader=function(i,O){return i&&i.state?i.state.wrap!==2?f:(i.state.gzhead=O,u):f},t.deflate=function(i,O){var L,v,y,S;if(!i||!i.state||5<O||O<0)return i?ne(i,f):f;if(v=i.state,!i.output||!i.input&&i.avail_in!==0||v.status===666&&O!==x)return ne(i,i.avail_out===0?-5:f);if(v.strm=i,L=v.last_flush,v.last_flush=O,v.status===_)if(v.wrap===2)i.adler=0,Q(v,31),Q(v,139),Q(v,8),v.gzhead?(Q(v,(v.gzhead.text?1:0)+(v.gzhead.hcrc?2:0)+(v.gzhead.extra?4:0)+(v.gzhead.name?8:0)+(v.gzhead.comment?16:0)),Q(v,255&v.gzhead.time),Q(v,v.gzhead.time>>8&255),Q(v,v.gzhead.time>>16&255),Q(v,v.gzhead.time>>24&255),Q(v,v.level===9?2:2<=v.strategy||v.level<2?4:0),Q(v,255&v.gzhead.os),v.gzhead.extra&&v.gzhead.extra.length&&(Q(v,255&v.gzhead.extra.length),Q(v,v.gzhead.extra.length>>8&255)),v.gzhead.hcrc&&(i.adler=c(i.adler,v.pending_buf,v.pending,0)),v.gzindex=0,v.status=69):(Q(v,0),Q(v,0),Q(v,0),Q(v,0),Q(v,0),Q(v,v.level===9?2:2<=v.strategy||v.level<2?4:0),Q(v,3),v.status=N);else{var P=p+(v.w_bits-8<<4)<<8;P|=(2<=v.strategy||v.level<2?0:v.level<6?1:v.level===6?2:3)<<6,v.strstart!==0&&(P|=32),P+=31-P%31,v.status=N,G(v,P),v.strstart!==0&&(G(v,i.adler>>>16),G(v,65535&i.adler)),i.adler=1}if(v.status===69)if(v.gzhead.extra){for(y=v.pending;v.gzindex<(65535&v.gzhead.extra.length)&&(v.pending!==v.pending_buf_size||(v.gzhead.hcrc&&v.pending>y&&(i.adler=c(i.adler,v.pending_buf,v.pending-y,y)),T(i),y=v.pending,v.pending!==v.pending_buf_size));)Q(v,255&v.gzhead.extra[v.gzindex]),v.gzindex++;v.gzhead.hcrc&&v.pending>y&&(i.adler=c(i.adler,v.pending_buf,v.pending-y,y)),v.gzindex===v.gzhead.extra.length&&(v.gzindex=0,v.status=73)}else v.status=73;if(v.status===73)if(v.gzhead.name){y=v.pending;do{if(v.pending===v.pending_buf_size&&(v.gzhead.hcrc&&v.pending>y&&(i.adler=c(i.adler,v.pending_buf,v.pending-y,y)),T(i),y=v.pending,v.pending===v.pending_buf_size)){S=1;break}S=v.gzindex<v.gzhead.name.length?255&v.gzhead.name.charCodeAt(v.gzindex++):0,Q(v,S)}while(S!==0);v.gzhead.hcrc&&v.pending>y&&(i.adler=c(i.adler,v.pending_buf,v.pending-y,y)),S===0&&(v.gzindex=0,v.status=91)}else v.status=91;if(v.status===91)if(v.gzhead.comment){y=v.pending;do{if(v.pending===v.pending_buf_size&&(v.gzhead.hcrc&&v.pending>y&&(i.adler=c(i.adler,v.pending_buf,v.pending-y,y)),T(i),y=v.pending,v.pending===v.pending_buf_size)){S=1;break}S=v.gzindex<v.gzhead.comment.length?255&v.gzhead.comment.charCodeAt(v.gzindex++):0,Q(v,S)}while(S!==0);v.gzhead.hcrc&&v.pending>y&&(i.adler=c(i.adler,v.pending_buf,v.pending-y,y)),S===0&&(v.status=103)}else v.status=103;if(v.status===103&&(v.gzhead.hcrc?(v.pending+2>v.pending_buf_size&&T(i),v.pending+2<=v.pending_buf_size&&(Q(v,255&i.adler),Q(v,i.adler>>8&255),i.adler=0,v.status=N)):v.status=N),v.pending!==0){if(T(i),i.avail_out===0)return v.last_flush=-1,u}else if(i.avail_in===0&&H(O)<=H(L)&&O!==x)return ne(i,-5);if(v.status===666&&i.avail_in!==0)return ne(i,-5);if(i.avail_in!==0||v.lookahead!==0||O!==g&&v.status!==666){var $=v.strategy===2?function(C,q){for(var Z;;){if(C.lookahead===0&&(de(C),C.lookahead===0)){if(q===g)return l;break}if(C.match_length=0,Z=s._tr_tally(C,0,C.window[C.strstart]),C.lookahead--,C.strstart++,Z&&(E(C,!1),C.strm.avail_out===0))return l}return C.insert=0,q===x?(E(C,!0),C.strm.avail_out===0?te:U):C.last_lit&&(E(C,!1),C.strm.avail_out===0)?l:R}(v,O):v.strategy===3?function(C,q){for(var Z,Y,X,le,oe=C.window;;){if(C.lookahead<=j){if(de(C),C.lookahead<=j&&q===g)return l;if(C.lookahead===0)break}if(C.match_length=0,C.lookahead>=B&&0<C.strstart&&(Y=oe[X=C.strstart-1])===oe[++X]&&Y===oe[++X]&&Y===oe[++X]){le=C.strstart+j;do;while(Y===oe[++X]&&Y===oe[++X]&&Y===oe[++X]&&Y===oe[++X]&&Y===oe[++X]&&Y===oe[++X]&&Y===oe[++X]&&Y===oe[++X]&&X<le);C.match_length=j-(le-X),C.match_length>C.lookahead&&(C.match_length=C.lookahead)}if(C.match_length>=B?(Z=s._tr_tally(C,1,C.match_length-B),C.lookahead-=C.match_length,C.strstart+=C.match_length,C.match_length=0):(Z=s._tr_tally(C,0,C.window[C.strstart]),C.lookahead--,C.strstart++),Z&&(E(C,!1),C.strm.avail_out===0))return l}return C.insert=0,q===x?(E(C,!0),C.strm.avail_out===0?te:U):C.last_lit&&(E(C,!1),C.strm.avail_out===0)?l:R}(v,O):n[v.level].func(v,O);if($!==te&&$!==U||(v.status=666),$===l||$===te)return i.avail_out===0&&(v.last_flush=-1),u;if($===R&&(O===1?s._tr_align(v):O!==5&&(s._tr_stored_block(v,0,0,!1),O===3&&(ee(v.head),v.lookahead===0&&(v.strstart=0,v.block_start=0,v.insert=0))),T(i),i.avail_out===0))return v.last_flush=-1,u}return O!==x?u:v.wrap<=0?1:(v.wrap===2?(Q(v,255&i.adler),Q(v,i.adler>>8&255),Q(v,i.adler>>16&255),Q(v,i.adler>>24&255),Q(v,255&i.total_in),Q(v,i.total_in>>8&255),Q(v,i.total_in>>16&255),Q(v,i.total_in>>24&255)):(G(v,i.adler>>>16),G(v,65535&i.adler)),T(i),0<v.wrap&&(v.wrap=-v.wrap),v.pending!==0?u:1)},t.deflateEnd=function(i){var O;return i&&i.state?(O=i.state.status)!==_&&O!==69&&O!==73&&O!==91&&O!==103&&O!==N&&O!==666?ne(i,f):(i.state=null,O===N?ne(i,-3):u):f},t.deflateSetDictionary=function(i,O){var L,v,y,S,P,$,C,q,Z=O.length;if(!i||!i.state||(S=(L=i.state).wrap)===2||S===1&&L.status!==_||L.lookahead)return f;for(S===1&&(i.adler=a(i.adler,O,Z,0)),L.wrap=0,Z>=L.w_size&&(S===0&&(ee(L.head),L.strstart=0,L.block_start=0,L.insert=0),q=new r.Buf8(L.w_size),r.arraySet(q,O,Z-L.w_size,L.w_size,0),O=q,Z=L.w_size),P=i.avail_in,$=i.next_in,C=i.input,i.avail_in=Z,i.next_in=0,i.input=O,de(L);L.lookahead>=B;){for(v=L.strstart,y=L.lookahead-(B-1);L.ins_h=(L.ins_h<<L.hash_shift^L.window[v+B-1])&L.hash_mask,L.prev[v&L.w_mask]=L.head[L.ins_h],L.head[L.ins_h]=v,v++,--y;);L.strstart=v,L.lookahead=B-1,de(L)}return L.strstart+=L.lookahead,L.block_start=L.strstart,L.insert=L.lookahead,L.lookahead=0,L.match_length=L.prev_length=B-1,L.match_available=0,i.next_in=$,i.input=C,i.avail_in=P,L.wrap=S,u},t.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(o,e,t){"use strict";e.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(o,e,t){"use strict";e.exports=function(n,r){var s,a,c,b,g,x,u,f,d,m,h,p,w,A,k,M,I,F,B,j,K,_,N,l,R;s=n.state,a=n.next_in,l=n.input,c=a+(n.avail_in-5),b=n.next_out,R=n.output,g=b-(r-n.avail_out),x=b+(n.avail_out-257),u=s.dmax,f=s.wsize,d=s.whave,m=s.wnext,h=s.window,p=s.hold,w=s.bits,A=s.lencode,k=s.distcode,M=(1<<s.lenbits)-1,I=(1<<s.distbits)-1;e:do{w<15&&(p+=l[a++]<<w,w+=8,p+=l[a++]<<w,w+=8),F=A[p&M];t:for(;;){if(p>>>=B=F>>>24,w-=B,(B=F>>>16&255)===0)R[b++]=65535&F;else{if(!(16&B)){if((64&B)==0){F=A[(65535&F)+(p&(1<<B)-1)];continue t}if(32&B){s.mode=12;break e}n.msg="invalid literal/length code",s.mode=30;break e}j=65535&F,(B&=15)&&(w<B&&(p+=l[a++]<<w,w+=8),j+=p&(1<<B)-1,p>>>=B,w-=B),w<15&&(p+=l[a++]<<w,w+=8,p+=l[a++]<<w,w+=8),F=k[p&I];n:for(;;){if(p>>>=B=F>>>24,w-=B,!(16&(B=F>>>16&255))){if((64&B)==0){F=k[(65535&F)+(p&(1<<B)-1)];continue n}n.msg="invalid distance code",s.mode=30;break e}if(K=65535&F,w<(B&=15)&&(p+=l[a++]<<w,(w+=8)<B&&(p+=l[a++]<<w,w+=8)),u<(K+=p&(1<<B)-1)){n.msg="invalid distance too far back",s.mode=30;break e}if(p>>>=B,w-=B,(B=b-g)<K){if(d<(B=K-B)&&s.sane){n.msg="invalid distance too far back",s.mode=30;break e}if(N=h,(_=0)===m){if(_+=f-B,B<j){for(j-=B;R[b++]=h[_++],--B;);_=b-K,N=R}}else if(m<B){if(_+=f+m-B,(B-=m)<j){for(j-=B;R[b++]=h[_++],--B;);if(_=0,m<j){for(j-=B=m;R[b++]=h[_++],--B;);_=b-K,N=R}}}else if(_+=m-B,B<j){for(j-=B;R[b++]=h[_++],--B;);_=b-K,N=R}for(;2<j;)R[b++]=N[_++],R[b++]=N[_++],R[b++]=N[_++],j-=3;j&&(R[b++]=N[_++],1<j&&(R[b++]=N[_++]))}else{for(_=b-K;R[b++]=R[_++],R[b++]=R[_++],R[b++]=R[_++],2<(j-=3););j&&(R[b++]=R[_++],1<j&&(R[b++]=R[_++]))}break}}break}}while(a<c&&b<x);a-=j=w>>3,p&=(1<<(w-=j<<3))-1,n.next_in=a,n.next_out=b,n.avail_in=a<c?c-a+5:5-(a-c),n.avail_out=b<x?x-b+257:257-(b-x),s.hold=p,s.bits=w}},{}],49:[function(o,e,t){"use strict";var n=o("../utils/common"),r=o("./adler32"),s=o("./crc32"),a=o("./inffast"),c=o("./inftrees"),b=1,g=2,x=0,u=-2,f=1,d=852,m=592;function h(_){return(_>>>24&255)+(_>>>8&65280)+((65280&_)<<8)+((255&_)<<24)}function p(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new n.Buf16(320),this.work=new n.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function w(_){var N;return _&&_.state?(N=_.state,_.total_in=_.total_out=N.total=0,_.msg="",N.wrap&&(_.adler=1&N.wrap),N.mode=f,N.last=0,N.havedict=0,N.dmax=32768,N.head=null,N.hold=0,N.bits=0,N.lencode=N.lendyn=new n.Buf32(d),N.distcode=N.distdyn=new n.Buf32(m),N.sane=1,N.back=-1,x):u}function A(_){var N;return _&&_.state?((N=_.state).wsize=0,N.whave=0,N.wnext=0,w(_)):u}function k(_,N){var l,R;return _&&_.state?(R=_.state,N<0?(l=0,N=-N):(l=1+(N>>4),N<48&&(N&=15)),N&&(N<8||15<N)?u:(R.window!==null&&R.wbits!==N&&(R.window=null),R.wrap=l,R.wbits=N,A(_))):u}function M(_,N){var l,R;return _?(R=new p,(_.state=R).window=null,(l=k(_,N))!==x&&(_.state=null),l):u}var I,F,B=!0;function j(_){if(B){var N;for(I=new n.Buf32(512),F=new n.Buf32(32),N=0;N<144;)_.lens[N++]=8;for(;N<256;)_.lens[N++]=9;for(;N<280;)_.lens[N++]=7;for(;N<288;)_.lens[N++]=8;for(c(b,_.lens,0,288,I,0,_.work,{bits:9}),N=0;N<32;)_.lens[N++]=5;c(g,_.lens,0,32,F,0,_.work,{bits:5}),B=!1}_.lencode=I,_.lenbits=9,_.distcode=F,_.distbits=5}function K(_,N,l,R){var te,U=_.state;return U.window===null&&(U.wsize=1<<U.wbits,U.wnext=0,U.whave=0,U.window=new n.Buf8(U.wsize)),R>=U.wsize?(n.arraySet(U.window,N,l-U.wsize,U.wsize,0),U.wnext=0,U.whave=U.wsize):(R<(te=U.wsize-U.wnext)&&(te=R),n.arraySet(U.window,N,l-R,te,U.wnext),(R-=te)?(n.arraySet(U.window,N,l-R,R,0),U.wnext=R,U.whave=U.wsize):(U.wnext+=te,U.wnext===U.wsize&&(U.wnext=0),U.whave<U.wsize&&(U.whave+=te))),0}t.inflateReset=A,t.inflateReset2=k,t.inflateResetKeep=w,t.inflateInit=function(_){return M(_,15)},t.inflateInit2=M,t.inflate=function(_,N){var l,R,te,U,ne,H,ee,T,E,Q,G,V,de,ye,re,ie,ge,ue,Ee,Se,i,O,L,v,y=0,S=new n.Buf8(4),P=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!_||!_.state||!_.output||!_.input&&_.avail_in!==0)return u;(l=_.state).mode===12&&(l.mode=13),ne=_.next_out,te=_.output,ee=_.avail_out,U=_.next_in,R=_.input,H=_.avail_in,T=l.hold,E=l.bits,Q=H,G=ee,O=x;e:for(;;)switch(l.mode){case f:if(l.wrap===0){l.mode=13;break}for(;E<16;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}if(2&l.wrap&&T===35615){S[l.check=0]=255&T,S[1]=T>>>8&255,l.check=s(l.check,S,2,0),E=T=0,l.mode=2;break}if(l.flags=0,l.head&&(l.head.done=!1),!(1&l.wrap)||(((255&T)<<8)+(T>>8))%31){_.msg="incorrect header check",l.mode=30;break}if((15&T)!=8){_.msg="unknown compression method",l.mode=30;break}if(E-=4,i=8+(15&(T>>>=4)),l.wbits===0)l.wbits=i;else if(i>l.wbits){_.msg="invalid window size",l.mode=30;break}l.dmax=1<<i,_.adler=l.check=1,l.mode=512&T?10:12,E=T=0;break;case 2:for(;E<16;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}if(l.flags=T,(255&l.flags)!=8){_.msg="unknown compression method",l.mode=30;break}if(57344&l.flags){_.msg="unknown header flags set",l.mode=30;break}l.head&&(l.head.text=T>>8&1),512&l.flags&&(S[0]=255&T,S[1]=T>>>8&255,l.check=s(l.check,S,2,0)),E=T=0,l.mode=3;case 3:for(;E<32;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}l.head&&(l.head.time=T),512&l.flags&&(S[0]=255&T,S[1]=T>>>8&255,S[2]=T>>>16&255,S[3]=T>>>24&255,l.check=s(l.check,S,4,0)),E=T=0,l.mode=4;case 4:for(;E<16;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}l.head&&(l.head.xflags=255&T,l.head.os=T>>8),512&l.flags&&(S[0]=255&T,S[1]=T>>>8&255,l.check=s(l.check,S,2,0)),E=T=0,l.mode=5;case 5:if(1024&l.flags){for(;E<16;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}l.length=T,l.head&&(l.head.extra_len=T),512&l.flags&&(S[0]=255&T,S[1]=T>>>8&255,l.check=s(l.check,S,2,0)),E=T=0}else l.head&&(l.head.extra=null);l.mode=6;case 6:if(1024&l.flags&&(H<(V=l.length)&&(V=H),V&&(l.head&&(i=l.head.extra_len-l.length,l.head.extra||(l.head.extra=new Array(l.head.extra_len)),n.arraySet(l.head.extra,R,U,V,i)),512&l.flags&&(l.check=s(l.check,R,V,U)),H-=V,U+=V,l.length-=V),l.length))break e;l.length=0,l.mode=7;case 7:if(2048&l.flags){if(H===0)break e;for(V=0;i=R[U+V++],l.head&&i&&l.length<65536&&(l.head.name+=String.fromCharCode(i)),i&&V<H;);if(512&l.flags&&(l.check=s(l.check,R,V,U)),H-=V,U+=V,i)break e}else l.head&&(l.head.name=null);l.length=0,l.mode=8;case 8:if(4096&l.flags){if(H===0)break e;for(V=0;i=R[U+V++],l.head&&i&&l.length<65536&&(l.head.comment+=String.fromCharCode(i)),i&&V<H;);if(512&l.flags&&(l.check=s(l.check,R,V,U)),H-=V,U+=V,i)break e}else l.head&&(l.head.comment=null);l.mode=9;case 9:if(512&l.flags){for(;E<16;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}if(T!==(65535&l.check)){_.msg="header crc mismatch",l.mode=30;break}E=T=0}l.head&&(l.head.hcrc=l.flags>>9&1,l.head.done=!0),_.adler=l.check=0,l.mode=12;break;case 10:for(;E<32;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}_.adler=l.check=h(T),E=T=0,l.mode=11;case 11:if(l.havedict===0)return _.next_out=ne,_.avail_out=ee,_.next_in=U,_.avail_in=H,l.hold=T,l.bits=E,2;_.adler=l.check=1,l.mode=12;case 12:if(N===5||N===6)break e;case 13:if(l.last){T>>>=7&E,E-=7&E,l.mode=27;break}for(;E<3;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}switch(l.last=1&T,E-=1,3&(T>>>=1)){case 0:l.mode=14;break;case 1:if(j(l),l.mode=20,N!==6)break;T>>>=2,E-=2;break e;case 2:l.mode=17;break;case 3:_.msg="invalid block type",l.mode=30}T>>>=2,E-=2;break;case 14:for(T>>>=7&E,E-=7&E;E<32;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}if((65535&T)!=(T>>>16^65535)){_.msg="invalid stored block lengths",l.mode=30;break}if(l.length=65535&T,E=T=0,l.mode=15,N===6)break e;case 15:l.mode=16;case 16:if(V=l.length){if(H<V&&(V=H),ee<V&&(V=ee),V===0)break e;n.arraySet(te,R,U,V,ne),H-=V,U+=V,ee-=V,ne+=V,l.length-=V;break}l.mode=12;break;case 17:for(;E<14;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}if(l.nlen=257+(31&T),T>>>=5,E-=5,l.ndist=1+(31&T),T>>>=5,E-=5,l.ncode=4+(15&T),T>>>=4,E-=4,286<l.nlen||30<l.ndist){_.msg="too many length or distance symbols",l.mode=30;break}l.have=0,l.mode=18;case 18:for(;l.have<l.ncode;){for(;E<3;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}l.lens[P[l.have++]]=7&T,T>>>=3,E-=3}for(;l.have<19;)l.lens[P[l.have++]]=0;if(l.lencode=l.lendyn,l.lenbits=7,L={bits:l.lenbits},O=c(0,l.lens,0,19,l.lencode,0,l.work,L),l.lenbits=L.bits,O){_.msg="invalid code lengths set",l.mode=30;break}l.have=0,l.mode=19;case 19:for(;l.have<l.nlen+l.ndist;){for(;ie=(y=l.lencode[T&(1<<l.lenbits)-1])>>>16&255,ge=65535&y,!((re=y>>>24)<=E);){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}if(ge<16)T>>>=re,E-=re,l.lens[l.have++]=ge;else{if(ge===16){for(v=re+2;E<v;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}if(T>>>=re,E-=re,l.have===0){_.msg="invalid bit length repeat",l.mode=30;break}i=l.lens[l.have-1],V=3+(3&T),T>>>=2,E-=2}else if(ge===17){for(v=re+3;E<v;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}E-=re,i=0,V=3+(7&(T>>>=re)),T>>>=3,E-=3}else{for(v=re+7;E<v;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}E-=re,i=0,V=11+(127&(T>>>=re)),T>>>=7,E-=7}if(l.have+V>l.nlen+l.ndist){_.msg="invalid bit length repeat",l.mode=30;break}for(;V--;)l.lens[l.have++]=i}}if(l.mode===30)break;if(l.lens[256]===0){_.msg="invalid code -- missing end-of-block",l.mode=30;break}if(l.lenbits=9,L={bits:l.lenbits},O=c(b,l.lens,0,l.nlen,l.lencode,0,l.work,L),l.lenbits=L.bits,O){_.msg="invalid literal/lengths set",l.mode=30;break}if(l.distbits=6,l.distcode=l.distdyn,L={bits:l.distbits},O=c(g,l.lens,l.nlen,l.ndist,l.distcode,0,l.work,L),l.distbits=L.bits,O){_.msg="invalid distances set",l.mode=30;break}if(l.mode=20,N===6)break e;case 20:l.mode=21;case 21:if(6<=H&&258<=ee){_.next_out=ne,_.avail_out=ee,_.next_in=U,_.avail_in=H,l.hold=T,l.bits=E,a(_,G),ne=_.next_out,te=_.output,ee=_.avail_out,U=_.next_in,R=_.input,H=_.avail_in,T=l.hold,E=l.bits,l.mode===12&&(l.back=-1);break}for(l.back=0;ie=(y=l.lencode[T&(1<<l.lenbits)-1])>>>16&255,ge=65535&y,!((re=y>>>24)<=E);){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}if(ie&&(240&ie)==0){for(ue=re,Ee=ie,Se=ge;ie=(y=l.lencode[Se+((T&(1<<ue+Ee)-1)>>ue)])>>>16&255,ge=65535&y,!(ue+(re=y>>>24)<=E);){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}T>>>=ue,E-=ue,l.back+=ue}if(T>>>=re,E-=re,l.back+=re,l.length=ge,ie===0){l.mode=26;break}if(32&ie){l.back=-1,l.mode=12;break}if(64&ie){_.msg="invalid literal/length code",l.mode=30;break}l.extra=15&ie,l.mode=22;case 22:if(l.extra){for(v=l.extra;E<v;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}l.length+=T&(1<<l.extra)-1,T>>>=l.extra,E-=l.extra,l.back+=l.extra}l.was=l.length,l.mode=23;case 23:for(;ie=(y=l.distcode[T&(1<<l.distbits)-1])>>>16&255,ge=65535&y,!((re=y>>>24)<=E);){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}if((240&ie)==0){for(ue=re,Ee=ie,Se=ge;ie=(y=l.distcode[Se+((T&(1<<ue+Ee)-1)>>ue)])>>>16&255,ge=65535&y,!(ue+(re=y>>>24)<=E);){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}T>>>=ue,E-=ue,l.back+=ue}if(T>>>=re,E-=re,l.back+=re,64&ie){_.msg="invalid distance code",l.mode=30;break}l.offset=ge,l.extra=15&ie,l.mode=24;case 24:if(l.extra){for(v=l.extra;E<v;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}l.offset+=T&(1<<l.extra)-1,T>>>=l.extra,E-=l.extra,l.back+=l.extra}if(l.offset>l.dmax){_.msg="invalid distance too far back",l.mode=30;break}l.mode=25;case 25:if(ee===0)break e;if(V=G-ee,l.offset>V){if((V=l.offset-V)>l.whave&&l.sane){_.msg="invalid distance too far back",l.mode=30;break}de=V>l.wnext?(V-=l.wnext,l.wsize-V):l.wnext-V,V>l.length&&(V=l.length),ye=l.window}else ye=te,de=ne-l.offset,V=l.length;for(ee<V&&(V=ee),ee-=V,l.length-=V;te[ne++]=ye[de++],--V;);l.length===0&&(l.mode=21);break;case 26:if(ee===0)break e;te[ne++]=l.length,ee--,l.mode=21;break;case 27:if(l.wrap){for(;E<32;){if(H===0)break e;H--,T|=R[U++]<<E,E+=8}if(G-=ee,_.total_out+=G,l.total+=G,G&&(_.adler=l.check=l.flags?s(l.check,te,G,ne-G):r(l.check,te,G,ne-G)),G=ee,(l.flags?T:h(T))!==l.check){_.msg="incorrect data check",l.mode=30;break}E=T=0}l.mode=28;case 28:if(l.wrap&&l.flags){for(;E<32;){if(H===0)break e;H--,T+=R[U++]<<E,E+=8}if(T!==(4294967295&l.total)){_.msg="incorrect length check",l.mode=30;break}E=T=0}l.mode=29;case 29:O=1;break e;case 30:O=-3;break e;case 31:return-4;case 32:default:return u}return _.next_out=ne,_.avail_out=ee,_.next_in=U,_.avail_in=H,l.hold=T,l.bits=E,(l.wsize||G!==_.avail_out&&l.mode<30&&(l.mode<27||N!==4))&&K(_,_.output,_.next_out,G-_.avail_out)?(l.mode=31,-4):(Q-=_.avail_in,G-=_.avail_out,_.total_in+=Q,_.total_out+=G,l.total+=G,l.wrap&&G&&(_.adler=l.check=l.flags?s(l.check,te,G,_.next_out-G):r(l.check,te,G,_.next_out-G)),_.data_type=l.bits+(l.last?64:0)+(l.mode===12?128:0)+(l.mode===20||l.mode===15?256:0),(Q==0&&G===0||N===4)&&O===x&&(O=-5),O)},t.inflateEnd=function(_){if(!_||!_.state)return u;var N=_.state;return N.window&&(N.window=null),_.state=null,x},t.inflateGetHeader=function(_,N){var l;return _&&_.state?(2&(l=_.state).wrap)==0?u:((l.head=N).done=!1,x):u},t.inflateSetDictionary=function(_,N){var l,R=N.length;return _&&_.state?(l=_.state).wrap!==0&&l.mode!==11?u:l.mode===11&&r(1,N,R,0)!==l.check?-3:K(_,N,R,R)?(l.mode=31,-4):(l.havedict=1,x):u},t.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(o,e,t){"use strict";var n=o("../utils/common"),r=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],s=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],a=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],c=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(b,g,x,u,f,d,m,h){var p,w,A,k,M,I,F,B,j,K=h.bits,_=0,N=0,l=0,R=0,te=0,U=0,ne=0,H=0,ee=0,T=0,E=null,Q=0,G=new n.Buf16(16),V=new n.Buf16(16),de=null,ye=0;for(_=0;_<=15;_++)G[_]=0;for(N=0;N<u;N++)G[g[x+N]]++;for(te=K,R=15;1<=R&&G[R]===0;R--);if(R<te&&(te=R),R===0)return f[d++]=20971520,f[d++]=20971520,h.bits=1,0;for(l=1;l<R&&G[l]===0;l++);for(te<l&&(te=l),_=H=1;_<=15;_++)if(H<<=1,(H-=G[_])<0)return-1;if(0<H&&(b===0||R!==1))return-1;for(V[1]=0,_=1;_<15;_++)V[_+1]=V[_]+G[_];for(N=0;N<u;N++)g[x+N]!==0&&(m[V[g[x+N]]++]=N);if(I=b===0?(E=de=m,19):b===1?(E=r,Q-=257,de=s,ye-=257,256):(E=a,de=c,-1),_=l,M=d,ne=N=T=0,A=-1,k=(ee=1<<(U=te))-1,b===1&&852<ee||b===2&&592<ee)return 1;for(;;){for(F=_-ne,j=m[N]<I?(B=0,m[N]):m[N]>I?(B=de[ye+m[N]],E[Q+m[N]]):(B=96,0),p=1<<_-ne,l=w=1<<U;f[M+(T>>ne)+(w-=p)]=F<<24|B<<16|j|0,w!==0;);for(p=1<<_-1;T&p;)p>>=1;if(p!==0?(T&=p-1,T+=p):T=0,N++,--G[_]==0){if(_===R)break;_=g[x+m[N]]}if(te<_&&(T&k)!==A){for(ne===0&&(ne=te),M+=l,H=1<<(U=_-ne);U+ne<R&&!((H-=G[U+ne])<=0);)U++,H<<=1;if(ee+=1<<U,b===1&&852<ee||b===2&&592<ee)return 1;f[A=T&k]=te<<24|U<<16|M-d|0}}return T!==0&&(f[M+T]=_-ne<<24|64<<16|0),h.bits=te,0}},{"../utils/common":41}],51:[function(o,e,t){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(o,e,t){"use strict";var n=o("../utils/common"),r=0,s=1;function a(y){for(var S=y.length;0<=--S;)y[S]=0}var c=0,b=29,g=256,x=g+1+b,u=30,f=19,d=2*x+1,m=15,h=16,p=7,w=256,A=16,k=17,M=18,I=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],F=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],B=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],j=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],K=new Array(2*(x+2));a(K);var _=new Array(2*u);a(_);var N=new Array(512);a(N);var l=new Array(256);a(l);var R=new Array(b);a(R);var te,U,ne,H=new Array(u);function ee(y,S,P,$,C){this.static_tree=y,this.extra_bits=S,this.extra_base=P,this.elems=$,this.max_length=C,this.has_stree=y&&y.length}function T(y,S){this.dyn_tree=y,this.max_code=0,this.stat_desc=S}function E(y){return y<256?N[y]:N[256+(y>>>7)]}function Q(y,S){y.pending_buf[y.pending++]=255&S,y.pending_buf[y.pending++]=S>>>8&255}function G(y,S,P){y.bi_valid>h-P?(y.bi_buf|=S<<y.bi_valid&65535,Q(y,y.bi_buf),y.bi_buf=S>>h-y.bi_valid,y.bi_valid+=P-h):(y.bi_buf|=S<<y.bi_valid&65535,y.bi_valid+=P)}function V(y,S,P){G(y,P[2*S],P[2*S+1])}function de(y,S){for(var P=0;P|=1&y,y>>>=1,P<<=1,0<--S;);return P>>>1}function ye(y,S,P){var $,C,q=new Array(m+1),Z=0;for($=1;$<=m;$++)q[$]=Z=Z+P[$-1]<<1;for(C=0;C<=S;C++){var Y=y[2*C+1];Y!==0&&(y[2*C]=de(q[Y]++,Y))}}function re(y){var S;for(S=0;S<x;S++)y.dyn_ltree[2*S]=0;for(S=0;S<u;S++)y.dyn_dtree[2*S]=0;for(S=0;S<f;S++)y.bl_tree[2*S]=0;y.dyn_ltree[2*w]=1,y.opt_len=y.static_len=0,y.last_lit=y.matches=0}function ie(y){8<y.bi_valid?Q(y,y.bi_buf):0<y.bi_valid&&(y.pending_buf[y.pending++]=y.bi_buf),y.bi_buf=0,y.bi_valid=0}function ge(y,S,P,$){var C=2*S,q=2*P;return y[C]<y[q]||y[C]===y[q]&&$[S]<=$[P]}function ue(y,S,P){for(var $=y.heap[P],C=P<<1;C<=y.heap_len&&(C<y.heap_len&&ge(S,y.heap[C+1],y.heap[C],y.depth)&&C++,!ge(S,$,y.heap[C],y.depth));)y.heap[P]=y.heap[C],P=C,C<<=1;y.heap[P]=$}function Ee(y,S,P){var $,C,q,Z,Y=0;if(y.last_lit!==0)for(;$=y.pending_buf[y.d_buf+2*Y]<<8|y.pending_buf[y.d_buf+2*Y+1],C=y.pending_buf[y.l_buf+Y],Y++,$===0?V(y,C,S):(V(y,(q=l[C])+g+1,S),(Z=I[q])!==0&&G(y,C-=R[q],Z),V(y,q=E(--$),P),(Z=F[q])!==0&&G(y,$-=H[q],Z)),Y<y.last_lit;);V(y,w,S)}function Se(y,S){var P,$,C,q=S.dyn_tree,Z=S.stat_desc.static_tree,Y=S.stat_desc.has_stree,X=S.stat_desc.elems,le=-1;for(y.heap_len=0,y.heap_max=d,P=0;P<X;P++)q[2*P]!==0?(y.heap[++y.heap_len]=le=P,y.depth[P]=0):q[2*P+1]=0;for(;y.heap_len<2;)q[2*(C=y.heap[++y.heap_len]=le<2?++le:0)]=1,y.depth[C]=0,y.opt_len--,Y&&(y.static_len-=Z[2*C+1]);for(S.max_code=le,P=y.heap_len>>1;1<=P;P--)ue(y,q,P);for(C=X;P=y.heap[1],y.heap[1]=y.heap[y.heap_len--],ue(y,q,1),$=y.heap[1],y.heap[--y.heap_max]=P,y.heap[--y.heap_max]=$,q[2*C]=q[2*P]+q[2*$],y.depth[C]=(y.depth[P]>=y.depth[$]?y.depth[P]:y.depth[$])+1,q[2*P+1]=q[2*$+1]=C,y.heap[1]=C++,ue(y,q,1),2<=y.heap_len;);y.heap[--y.heap_max]=y.heap[1],function(oe,ke){var qe,Ie,Ye,he,ht,_t,Me=ke.dyn_tree,pn=ke.max_code,yr=ke.stat_desc.static_tree,vr=ke.stat_desc.has_stree,xr=ke.stat_desc.extra_bits,mn=ke.stat_desc.extra_base,Ve=ke.stat_desc.max_length,pt=0;for(he=0;he<=m;he++)oe.bl_count[he]=0;for(Me[2*oe.heap[oe.heap_max]+1]=0,qe=oe.heap_max+1;qe<d;qe++)Ve<(he=Me[2*Me[2*(Ie=oe.heap[qe])+1]+1]+1)&&(he=Ve,pt++),Me[2*Ie+1]=he,pn<Ie||(oe.bl_count[he]++,ht=0,mn<=Ie&&(ht=xr[Ie-mn]),_t=Me[2*Ie],oe.opt_len+=_t*(he+ht),vr&&(oe.static_len+=_t*(yr[2*Ie+1]+ht)));if(pt!==0){do{for(he=Ve-1;oe.bl_count[he]===0;)he--;oe.bl_count[he]--,oe.bl_count[he+1]+=2,oe.bl_count[Ve]--,pt-=2}while(0<pt);for(he=Ve;he!==0;he--)for(Ie=oe.bl_count[he];Ie!==0;)pn<(Ye=oe.heap[--qe])||(Me[2*Ye+1]!==he&&(oe.opt_len+=(he-Me[2*Ye+1])*Me[2*Ye],Me[2*Ye+1]=he),Ie--)}}(y,S),ye(q,le,y.bl_count)}function i(y,S,P){var $,C,q=-1,Z=S[1],Y=0,X=7,le=4;for(Z===0&&(X=138,le=3),S[2*(P+1)+1]=65535,$=0;$<=P;$++)C=Z,Z=S[2*($+1)+1],++Y<X&&C===Z||(Y<le?y.bl_tree[2*C]+=Y:C!==0?(C!==q&&y.bl_tree[2*C]++,y.bl_tree[2*A]++):Y<=10?y.bl_tree[2*k]++:y.bl_tree[2*M]++,q=C,le=(Y=0)===Z?(X=138,3):C===Z?(X=6,3):(X=7,4))}function O(y,S,P){var $,C,q=-1,Z=S[1],Y=0,X=7,le=4;for(Z===0&&(X=138,le=3),$=0;$<=P;$++)if(C=Z,Z=S[2*($+1)+1],!(++Y<X&&C===Z)){if(Y<le)for(;V(y,C,y.bl_tree),--Y!=0;);else C!==0?(C!==q&&(V(y,C,y.bl_tree),Y--),V(y,A,y.bl_tree),G(y,Y-3,2)):Y<=10?(V(y,k,y.bl_tree),G(y,Y-3,3)):(V(y,M,y.bl_tree),G(y,Y-11,7));q=C,le=(Y=0)===Z?(X=138,3):C===Z?(X=6,3):(X=7,4)}}a(H);var L=!1;function v(y,S,P,$){G(y,(c<<1)+($?1:0),3),function(C,q,Z,Y){ie(C),Y&&(Q(C,Z),Q(C,~Z)),n.arraySet(C.pending_buf,C.window,q,Z,C.pending),C.pending+=Z}(y,S,P,!0)}t._tr_init=function(y){L||(function(){var S,P,$,C,q,Z=new Array(m+1);for(C=$=0;C<b-1;C++)for(R[C]=$,S=0;S<1<<I[C];S++)l[$++]=C;for(l[$-1]=C,C=q=0;C<16;C++)for(H[C]=q,S=0;S<1<<F[C];S++)N[q++]=C;for(q>>=7;C<u;C++)for(H[C]=q<<7,S=0;S<1<<F[C]-7;S++)N[256+q++]=C;for(P=0;P<=m;P++)Z[P]=0;for(S=0;S<=143;)K[2*S+1]=8,S++,Z[8]++;for(;S<=255;)K[2*S+1]=9,S++,Z[9]++;for(;S<=279;)K[2*S+1]=7,S++,Z[7]++;for(;S<=287;)K[2*S+1]=8,S++,Z[8]++;for(ye(K,x+1,Z),S=0;S<u;S++)_[2*S+1]=5,_[2*S]=de(S,5);te=new ee(K,I,g+1,x,m),U=new ee(_,F,0,u,m),ne=new ee(new Array(0),B,0,f,p)}(),L=!0),y.l_desc=new T(y.dyn_ltree,te),y.d_desc=new T(y.dyn_dtree,U),y.bl_desc=new T(y.bl_tree,ne),y.bi_buf=0,y.bi_valid=0,re(y)},t._tr_stored_block=v,t._tr_flush_block=function(y,S,P,$){var C,q,Z=0;0<y.level?(y.strm.data_type===2&&(y.strm.data_type=function(Y){var X,le=4093624447;for(X=0;X<=31;X++,le>>>=1)if(1&le&&Y.dyn_ltree[2*X]!==0)return r;if(Y.dyn_ltree[18]!==0||Y.dyn_ltree[20]!==0||Y.dyn_ltree[26]!==0)return s;for(X=32;X<g;X++)if(Y.dyn_ltree[2*X]!==0)return s;return r}(y)),Se(y,y.l_desc),Se(y,y.d_desc),Z=function(Y){var X;for(i(Y,Y.dyn_ltree,Y.l_desc.max_code),i(Y,Y.dyn_dtree,Y.d_desc.max_code),Se(Y,Y.bl_desc),X=f-1;3<=X&&Y.bl_tree[2*j[X]+1]===0;X--);return Y.opt_len+=3*(X+1)+5+5+4,X}(y),C=y.opt_len+3+7>>>3,(q=y.static_len+3+7>>>3)<=C&&(C=q)):C=q=P+5,P+4<=C&&S!==-1?v(y,S,P,$):y.strategy===4||q===C?(G(y,2+($?1:0),3),Ee(y,K,_)):(G(y,4+($?1:0),3),function(Y,X,le,oe){var ke;for(G(Y,X-257,5),G(Y,le-1,5),G(Y,oe-4,4),ke=0;ke<oe;ke++)G(Y,Y.bl_tree[2*j[ke]+1],3);O(Y,Y.dyn_ltree,X-1),O(Y,Y.dyn_dtree,le-1)}(y,y.l_desc.max_code+1,y.d_desc.max_code+1,Z+1),Ee(y,y.dyn_ltree,y.dyn_dtree)),re(y),$&&ie(y)},t._tr_tally=function(y,S,P){return y.pending_buf[y.d_buf+2*y.last_lit]=S>>>8&255,y.pending_buf[y.d_buf+2*y.last_lit+1]=255&S,y.pending_buf[y.l_buf+y.last_lit]=255&P,y.last_lit++,S===0?y.dyn_ltree[2*P]++:(y.matches++,S--,y.dyn_ltree[2*(l[P]+g+1)]++,y.dyn_dtree[2*E(S)]++),y.last_lit===y.lit_bufsize-1},t._tr_align=function(y){G(y,2,3),V(y,w,K),function(S){S.bi_valid===16?(Q(S,S.bi_buf),S.bi_buf=0,S.bi_valid=0):8<=S.bi_valid&&(S.pending_buf[S.pending++]=255&S.bi_buf,S.bi_buf>>=8,S.bi_valid-=8)}(y)}},{"../utils/common":41}],53:[function(o,e,t){"use strict";e.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(o,e,t){(function(n){(function(r,s){"use strict";if(!r.setImmediate){var a,c,b,g,x=1,u={},f=!1,d=r.document,m=Object.getPrototypeOf&&Object.getPrototypeOf(r);m=m&&m.setTimeout?m:r,a={}.toString.call(r.process)==="[object process]"?function(A){process.nextTick(function(){p(A)})}:function(){if(r.postMessage&&!r.importScripts){var A=!0,k=r.onmessage;return r.onmessage=function(){A=!1},r.postMessage("","*"),r.onmessage=k,A}}()?(g="setImmediate$"+Math.random()+"$",r.addEventListener?r.addEventListener("message",w,!1):r.attachEvent("onmessage",w),function(A){r.postMessage(g+A,"*")}):r.MessageChannel?((b=new MessageChannel).port1.onmessage=function(A){p(A.data)},function(A){b.port2.postMessage(A)}):d&&"onreadystatechange"in d.createElement("script")?(c=d.documentElement,function(A){var k=d.createElement("script");k.onreadystatechange=function(){p(A),k.onreadystatechange=null,c.removeChild(k),k=null},c.appendChild(k)}):function(A){setTimeout(p,0,A)},m.setImmediate=function(A){typeof A!="function"&&(A=new Function(""+A));for(var k=new Array(arguments.length-1),M=0;M<k.length;M++)k[M]=arguments[M+1];var I={callback:A,args:k};return u[x]=I,a(x),x++},m.clearImmediate=h}function h(A){delete u[A]}function p(A){if(f)setTimeout(p,0,A);else{var k=u[A];if(k){f=!0;try{(function(M){var I=M.callback,F=M.args;switch(F.length){case 0:I();break;case 1:I(F[0]);break;case 2:I(F[0],F[1]);break;case 3:I(F[0],F[1],F[2]);break;default:I.apply(s,F)}})(k)}finally{h(A),f=!1}}}}function w(A){A.source===r&&typeof A.data=="string"&&A.data.indexOf(g)===0&&p(+A.data.slice(g.length))}})(typeof self>"u"?n===void 0?this:n:self)}).call(this,typeof global<"u"?global:typeof self<"u"?self:typeof window<"u"?window:{})},{}]},{},[10])(10)})});var kt=class{constructor(){this.components=new Map,this.initialized=new WeakSet,this.observer=null}register(e,t){this.components.set(e,t)}start(){this.observer||(this.scanAndInit(document.body),this.observer=new MutationObserver(e=>{e.forEach(t=>{t.addedNodes.forEach(n=>{n.nodeType===Node.ELEMENT_NODE&&this.scanAndInit(n)})})}),this.observer.observe(document.body,{childList:!0,subtree:!0}))}stop(){this.observer&&(this.observer.disconnect(),this.observer=null)}scanAndInit(e){this.components.forEach((t,n)=>{(e.matches?.(n)?[e]:Array.from(e.querySelectorAll?.(n)||[])).forEach(s=>{if(!this.initialized.has(s))try{t(s),this.initialized.add(s)}catch(a){console.error(`Failed to initialize component ${n}:`,a)}})})}init(e){this.scanAndInit(e)}},gn=new kt;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>gn.start()):gn.start();var Ge={base:["font-semibold","rounded-lg","transition-all","duration-200","ease-in-out","flex","items-center","justify-center"],sizes:{small:["px-2","py-1","text-xs","sm:px-3","sm:py-1.5","sm:text-sm"],medium:["px-3","py-2","text-sm","sm:px-5","sm:py-2","sm:text-sm"],large:["px-4","py-2.5","text-sm","sm:px-6","sm:py-3","sm:text-base","md:px-8","md:py-4"]},colors:{blue:{solid:{base:["bg-[#1993e5]","text-white","shadow-sm"],hover:["hover:bg-blue-600","hover:shadow-md","focus:ring-2","focus:ring-blue-500","focus:ring-offset-2","active:bg-blue-700"]},outline:{base:["bg-transparent","text-blue-600","border","border-blue-600","shadow-none"],hover:["hover:bg-blue-50","hover:border-blue-700","hover:text-blue-700","focus:ring-2","focus:ring-blue-500","focus:ring-offset-2","active:bg-blue-100"]},text:{base:["bg-transparent","text-blue-600","border-none","shadow-none"],hover:["hover:underline","hover:text-blue-700","focus:ring-2","focus:ring-blue-500","focus:ring-offset-2"]}},red:{solid:{base:["bg-red-500","text-white","shadow-sm"],hover:["hover:bg-red-600","hover:shadow-md","focus:ring-2","focus:ring-red-500","focus:ring-offset-2","active:bg-red-700"]},outline:{base:["bg-transparent","text-red-600","border","border-red-600","shadow-none"],hover:["hover:bg-red-50","hover:border-red-700","hover:text-red-700","focus:ring-2","focus:ring-red-500","focus:ring-offset-2","active:bg-red-100"]},text:{base:["bg-transparent","text-red-600","border-none","shadow-none"],hover:["hover:underline","hover:text-red-700","focus:ring-2","focus:ring-red-500","focus:ring-offset-2"]}},black:{solid:{base:["bg-gray-800","text-white","shadow-sm"],hover:["hover:bg-gray-700","hover:shadow-md","focus:ring-2","focus:ring-black","focus:ring-offset-2","active:bg-gray-800"]},outline:{base:["bg-transparent","text-black","border","border-black","shadow-none"],hover:["hover:bg-gray-100","hover:border-gray-700","hover:text-gray-700","focus:ring-2","focus:ring-black","focus:ring-offset-2","active:bg-gray-200"]},text:{base:["bg-transparent","text-black","border-none","shadow-none"],hover:["hover:underline","hover:text-gray-700","focus:ring-2","focus:ring-black","focus:ring-offset-2"]}},yellow:{solid:{base:["bg-yellow-500","text-white","shadow-sm"],hover:["hover:bg-yellow-600","hover:shadow-md","focus:ring-2","focus:ring-yellow-500","focus:ring-offset-2","active:bg-yellow-700"]},outline:{base:["bg-transparent","text-yellow-600","border","border-yellow-600","shadow-none"],hover:["hover:bg-yellow-50","hover:border-yellow-700","hover:text-yellow-700","focus:ring-2","focus:ring-yellow-500","focus:ring-offset-2","active:bg-yellow-100"]},text:{base:["bg-transparent","text-yellow-600","border-none","shadow-none"],hover:["hover:underline","hover:text-yellow-700","focus:ring-2","focus:ring-yellow-500","focus:ring-offset-2"]}},grey:{solid:{base:["bg-gray-500","text-white","shadow-sm"],hover:["hover:bg-gray-600","hover:shadow-md","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2","active:bg-gray-700"]},outline:{base:["bg-transparent","text-gray-700","border","border-gray-300","shadow-none"],hover:["hover:bg-gray-50","hover:border-gray-400","hover:text-gray-800","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2","active:bg-gray-100"]},text:{base:["bg-transparent","text-gray-600","border-none","shadow-none"],hover:["hover:underline","hover:text-gray-700","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2"]}},white:{solid:{base:["bg-white","text-gray-700","border","border-gray-300","shadow-sm"],hover:["hover:bg-gray-50","hover:border-gray-400","hover:text-gray-800","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2","active:bg-gray-100"]},outline:{base:["bg-transparent","text-gray-700","border","border-gray-300","shadow-none"],hover:["hover:bg-gray-50","hover:border-gray-400","hover:text-gray-800","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2","active:bg-gray-100"]},text:{base:["bg-transparent","text-white","border-none","shadow-none"],hover:["hover:underline","hover:text-white","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2"]}},purple:{solid:{base:["bg-purple-500","text-white","shadow-sm"],hover:["hover:bg-purple-600","hover:shadow-md","focus:ring-2","focus:ring-purple-500","focus:ring-offset-2","active:bg-purple-700"]},outline:{base:["bg-transparent","text-purple-600","border","border-purple-600","shadow-none"],hover:["hover:bg-purple-50","hover:border-purple-700","hover:text-purple-700","focus:ring-2","focus:ring-purple-500","focus:ring-offset-2","active:bg-purple-100"]},text:{base:["bg-transparent","text-purple-600","border-none","shadow-none"],hover:["hover:underline","hover:text-purple-700","focus:ring-2","focus:ring-purple-500","focus:ring-offset-2"]}},green:{solid:{base:["bg-green-500","text-white","shadow-sm"],hover:["hover:bg-green-600","hover:shadow-md","focus:ring-2","focus:ring-green-500","focus:ring-offset-2","active:bg-green-700"]},outline:{base:["bg-transparent","text-green-600","border","border-green-600","shadow-none"],hover:["hover:bg-green-50","hover:border-green-700","hover:text-green-700","focus:ring-2","focus:ring-green-500","focus:ring-offset-2","active:bg-green-100"]},text:{base:["bg-transparent","text-green-600","border-none","shadow-none"],hover:["hover:underline","hover:text-green-700","focus:ring-2","focus:ring-green-500","focus:ring-offset-2"]}},amber:{solid:{base:["bg-amber-500","text-white","shadow-sm"],hover:["hover:bg-amber-600","hover:shadow-md","focus:ring-2","focus:ring-amber-500","focus:ring-offset-2","active:bg-amber-700"]},outline:{base:["bg-transparent","text-amber-600","border","border-amber-600","shadow-none"],hover:["hover:bg-amber-50","hover:border-amber-700","hover:text-amber-700","focus:ring-2","focus:ring-amber-500","focus:ring-offset-2","active:bg-amber-100"]},text:{base:["bg-transparent","text-amber-600","border-none","shadow-none"],hover:["hover:underline","hover:text-amber-700","focus:ring-2","focus:ring-amber-500","focus:ring-offset-2"]}},transparent:{solid:{base:["bg-transparent","text-white"],hover:["hover:bg-white/10","hover:shadow-md","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2","active:bg-gray-700"]},outline:{base:["bg-transparent","text-white","border","border-gray-300","shadow-none"],hover:["hover:bg-gray-50","hover:border-gray-400","hover:text-gray-800","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2","active:bg-gray-100"]},text:{base:["bg-transparent","text-gray-600","border-none","shadow-none"],hover:["hover:underline","hover:text-gray-700","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2"]}}}},At=class extends HTMLElement{constructor(){super(),this._initialized=!1}connectedCallback(){this._initialized||(this.applyStyles(),this._initialized=!0,this._observer=new MutationObserver(e=>{this._applyingStyles||this.applyStyles()}),this._observer.observe(this,{attributes:!0,attributeFilter:["data-type","data-color","data-size","disabled","data-fullwidth"]}),this._overrideDisabledProperty())}_overrideDisabledProperty(){Object.defineProperty(this,"disabled",{get(){return this.hasAttribute("disabled")},set(e){let t=this.hasAttribute("disabled"),n=Boolean(e);t!==n&&(n?this.setAttribute("disabled",""):this.removeAttribute("disabled"))},configurable:!0})}disconnectedCallback(){this._observer&&this._observer.disconnect()}applyStyles(){if(!this._applyingStyles){this._applyingStyles=!0;try{let e=this.dataset.type||"solid",t=this.dataset.color||"blue",n=this.dataset.size||"medium",r=this.hasAttribute("disabled"),s=this.hasAttribute("data-fullwidth");this.className="ui-button",this.classList.add(...Ge.base),e!=="text"&&this.classList.add(...Ge.sizes[n]||Ge.sizes.medium);let a=Ge.colors[t]||Ge.colors.blue,c=a[e]||a.solid;this.classList.add(...c.base),r?this.classList.add("opacity-50","cursor-not-allowed"):this.classList.add("cursor-pointer",...c.hover),s&&this.classList.add("w-full"),this.hasAttribute("type")||this.setAttribute("type","button")}finally{this._applyingStyles=!1}}}updateStyle(){this.applyStyles()}};customElements.define("ui-button",At);var St=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this._render()}static get observedAttributes(){return["data-color","data-width"]}attributeChangedCallback(){this.shadowRoot.innerHTML&&this._updateStyles()}_getColorClasses(){let e=this.getAttribute("data-color")||"blue",t={blue:{border:"#93c5fd",bg:"rgba(219, 234, 254, 0.3)",iconBg:"#bfdbfe",iconColor:"#1d4ed8",textColor:"#2563eb",decorBg:"#dbeafe"},green:{border:"#86efac",bg:"rgba(220, 252, 231, 0.3)",iconBg:"#bbf7d0",iconColor:"#16a34a",textColor:"#16a34a",decorBg:"#dcfce7"},purple:{border:"#c4b5fd",bg:"rgba(237, 233, 254, 0.3)",iconBg:"#ddd6fe",iconColor:"#7c3aed",textColor:"#7c3aed",decorBg:"#ede9fe"},red:{border:"#fca5a5",bg:"rgba(254, 226, 226, 0.3)",iconBg:"#fecaca",iconColor:"#dc2626",textColor:"#dc2626",decorBg:"#fee2e2"}};return t[e]||t.blue}_updateStyles(){let e=this._getColorClasses(),t=this.getAttribute("data-width")||"full",n={full:"width: 100%;",auto:"width: auto;",fixed:"width: 300px;"},r=this.shadowRoot.querySelector(".card-container");if(r&&(r.style.cssText=n[t]||n.full),this.shadowRoot.styleSheets[0]){let a=this.shadowRoot.styleSheets[0].cssRules[0];a&&a.style&&(a.style.setProperty("--card-border",e.border),a.style.setProperty("--card-bg",e.bg),a.style.setProperty("--icon-bg",e.iconBg),a.style.setProperty("--icon-color",e.iconColor),a.style.setProperty("--text-color",e.textColor),a.style.setProperty("--decor-bg",e.decorBg))}}_render(){let e=this._getColorClasses(),t=this.getAttribute("data-width")||"full",n={full:"width: 100%;",auto:"width: auto; min-width: 280px;",fixed:"width: 300px;"};this.shadowRoot.innerHTML=`
      <style>
        :host {
          --card-border: ${e.border};
          --card-bg: ${e.bg};
          --icon-bg: ${e.iconBg};
          --icon-color: ${e.iconColor};
          --text-color: ${e.textColor};
          --decor-bg: ${e.decorBg};
          --card-title-font-size: 1.125rem;
          --card-title-margin-bottom: 0;
          display: block;
        }

        .card-container {
          ${n[t]||n.full}
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
    `}};customElements.get("ui-card")||customElements.define("ui-card",St);var Ct=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this._render(),this._setupEventListeners()}static get observedAttributes(){return["data-color","data-width"]}attributeChangedCallback(){this.shadowRoot.innerHTML&&this._updateStyles()}_getColorClasses(){let e=this.getAttribute("data-color")||"blue",t={blue:{border:"#93c5fd",bg:"rgba(219, 234, 254, 0.3)",iconBg:"#dbeafe",iconBgHover:"#bfdbfe",iconColor:"#2563eb",textColor:"#2563eb",textColorHover:"#1d4ed8",decorBg:"#dbeafe"},green:{border:"#86efac",bg:"rgba(220, 252, 231, 0.3)",iconBg:"#dcfce7",iconBgHover:"#bbf7d0",iconColor:"#16a34a",textColor:"#16a34a",textColorHover:"#15803d",decorBg:"#dcfce7"},purple:{border:"#c4b5fd",bg:"rgba(237, 233, 254, 0.3)",iconBg:"#ede9fe",iconBgHover:"#ddd6fe",iconColor:"#7c3aed",textColor:"#7c3aed",textColorHover:"#6d28d9",decorBg:"#ede9fe"},red:{border:"#fca5a5",bg:"rgba(254, 226, 226, 0.3)",iconBg:"#fee2e2",iconBgHover:"#fecaca",iconColor:"#dc2626",textColor:"#dc2626",textColorHover:"#b91c1c",decorBg:"#fee2e2"}};return t[e]||t.blue}_updateStyles(){let e=this._getColorClasses(),t=this.getAttribute("data-width")||"full",n={full:"width: 100%;",auto:"width: auto;",fixed:"width: 300px;"},r=this.shadowRoot.querySelector(".card-container");if(r&&(r.style.cssText=n[t]||n.full),this.shadowRoot.styleSheets[0]){let a=this.shadowRoot.styleSheets[0].cssRules[0];a&&a.style&&(a.style.setProperty("--card-border",e.border),a.style.setProperty("--card-bg-hover",e.bg),a.style.setProperty("--icon-bg",e.iconBg),a.style.setProperty("--icon-bg-hover",e.iconBgHover),a.style.setProperty("--icon-color",e.iconColor),a.style.setProperty("--text-color",e.textColor),a.style.setProperty("--text-color-hover",e.textColorHover),a.style.setProperty("--decor-bg",e.decorBg))}}_render(){let e=this._getColorClasses(),t=this.getAttribute("data-width")||"full",n={full:"width: 100%;",auto:"width: auto; min-width: 280px;",fixed:"width: 300px;"};this.shadowRoot.innerHTML=`
      <style>
        :host {
          --card-border: ${e.border};
          --card-bg-hover: ${e.bg};
          --icon-bg: ${e.iconBg};
          --icon-bg-hover: ${e.iconBgHover};
          --icon-color: ${e.iconColor};
          --text-color: ${e.textColor};
          --text-color-hover: ${e.textColorHover};
          --decor-bg: ${e.decorBg};
          display: block;
        }

        .card-container {
          ${n[t]||n.full}
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
    `}_setupEventListeners(){this.shadowRoot.querySelector(".card-container").addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("card-click",{bubbles:!0,composed:!0}))})}};customElements.get("clickable-card")||customElements.define("clickable-card",Ct);var Et=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this._render()}static get observedAttributes(){return["data-color"]}attributeChangedCallback(){this.shadowRoot.innerHTML&&this._updateStyles()}_getColor(){let e=this.getAttribute("data-color")||"gray-400",t={"gray-300":"#d1d5db","gray-400":"#9ca3af","gray-500":"#6b7280","gray-600":"#4b5563","blue-400":"#60a5fa","purple-400":"#c084fc"};return t[e]||t["gray-400"]}_updateStyles(){let e=this._getColor();if(this.shadowRoot.styleSheets[0]){let n=this.shadowRoot.styleSheets[0].cssRules[0];n&&n.style&&n.style.setProperty("--divider-color",e)}}_render(){let e=this._getColor();this.shadowRoot.innerHTML=`
      <style>
        :host {
          --divider-color: ${e};
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
    `}};customElements.get("ui-divider")||customElements.define("ui-divider",Et);var It=class extends HTMLElement{constructor(){super(),this._message="",this._solution="",this._severity="error",this._autoDismissTimeout=null}static get observedAttributes(){return["data-severity"]}connectedCallback(){this._severity=this.getAttribute("data-severity")||"error",this._render(),this._attachEventListeners()}disconnectedCallback(){this._autoDismissTimeout&&clearTimeout(this._autoDismissTimeout)}attributeChangedCallback(e,t,n){e==="data-severity"&&t!==n&&(this._severity=n,this._updateSeverityStyles())}_render(){this.className="error-message-container hidden",this.setAttribute("role","alert"),this.setAttribute("aria-live","polite"),this.setAttribute("aria-atomic","true"),this.innerHTML=`
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
    `,this._updateSeverityStyles()}_updateSeverityStyles(){let e=this.querySelector(".error-message-content"),t=this.querySelector(".error-icon"),n=this.querySelector(".error-message-text"),r=this.querySelector(".error-solution-text"),s=this.querySelector(".error-close-btn");if(!!e)switch(e.classList.remove("bg-red-50","bg-yellow-50","bg-blue-50","border-red-200","border-yellow-200","border-blue-200"),t?.classList.remove("text-red-400","text-yellow-400","text-blue-400"),n?.classList.remove("text-red-800","text-yellow-800","text-blue-800"),r?.classList.remove("text-red-700","text-yellow-700","text-blue-700"),s?.classList.remove("text-red-500","text-yellow-500","text-blue-500","hover:bg-red-200","hover:bg-yellow-200","hover:bg-blue-200","focus:ring-red-400","focus:ring-yellow-400","focus:ring-blue-400"),this._severity){case"error":e.classList.add("bg-red-50","border-red-200"),t?.classList.add("text-red-400"),n?.classList.add("text-red-800"),r?.classList.add("text-red-700"),s?.classList.add("text-red-500","hover:bg-red-200","focus:ring-red-400");break;case"warning":e.classList.add("bg-yellow-50","border-yellow-200"),t?.classList.add("text-yellow-400"),n?.classList.add("text-yellow-800"),r?.classList.add("text-yellow-700"),s?.classList.add("text-yellow-500","hover:bg-yellow-200","focus:ring-yellow-400");break;case"info":e.classList.add("bg-blue-50","border-blue-200"),t?.classList.add("text-blue-400"),n?.classList.add("text-blue-800"),r?.classList.add("text-blue-700"),s?.classList.add("text-blue-500","hover:bg-blue-200","focus:ring-blue-400");break}}_attachEventListeners(){this.querySelector(".error-close-btn")?.addEventListener("click",()=>this.hide())}show(e,t="",n=0){this._message=e,this._solution=t;let r=this.querySelector(".error-message-text"),s=this.querySelector(".error-solution-text");r&&(r.textContent=e),s&&(t?(s.textContent=t,s.classList.remove("hidden")):s.classList.add("hidden")),this.classList.remove("hidden"),requestAnimationFrame(()=>{this.classList.add("visible")}),n>0&&(this._autoDismissTimeout&&clearTimeout(this._autoDismissTimeout),this._autoDismissTimeout=setTimeout(()=>this.hide(),n)),this.dispatchEvent(new CustomEvent("error-shown",{detail:{message:e,solution:t},bubbles:!0}))}hide(){this._autoDismissTimeout&&(clearTimeout(this._autoDismissTimeout),this._autoDismissTimeout=null),this.classList.remove("visible"),setTimeout(()=>{this.classList.add("hidden"),this._message="",this._solution="",this.dispatchEvent(new CustomEvent("error-hidden",{bubbles:!0}))},300)}get isVisible(){return this.classList.contains("visible")}get message(){return this._message}set severity(e){this._severity=e,this.setAttribute("data-severity",e)}get severity(){return this._severity}};customElements.define("error-message",It);var Bt=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}static get observedAttributes(){return["color","icon-type","has-border"]}connectedCallback(){this.render()}attributeChangedCallback(){this.shadowRoot.innerHTML&&this.render()}getColorClasses(){let e=this.getAttribute("color")||"green",t={green:{bg:"bg-green-50",border:"border-green-200",iconText:"text-green-600",textDark:"text-green-800",cssVar:"--banner-color: #166534"},blue:{bg:"bg-blue-50",border:"border-blue-200",iconText:"text-blue-600",textDark:"text-blue-800",cssVar:"--banner-color: #1e40af"},yellow:{bg:"bg-yellow-50",border:"border-yellow-200",iconText:"text-yellow-600",textDark:"text-yellow-800",cssVar:"--banner-color: #854d0e"},red:{bg:"bg-red-50",border:"border-red-200",iconText:"text-red-600",textDark:"text-red-800",cssVar:"--banner-color: #991b1b"},gray:{bg:"bg-gray-50",border:"border-gray-200",iconText:"text-gray-600",textDark:"text-gray-800",cssVar:"--banner-color: #1f2937"}};return t[e]||t.green}getIconSvg(){let e=this.getAttribute("icon-type")||"checkmark",t={checkmark:`
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      `,info:`
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      `,warning:`
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      `,lock:`
        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
      `,shield:`
        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      `};return t[e]||t.checkmark}render(){let e=this.getColorClasses(),t=this.getIconSvg(),n=this.hasAttribute("has-border");this.shadowRoot.innerHTML=`
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

      <div class="banner ${e.bg} ${n?`has-border ${e.border}`:""}" style="${e.cssVar}">
        <div class="banner-content">
          <svg class="icon ${e.iconText}" fill="currentColor" viewBox="0 0 20 20">
            ${t}
          </svg>
          <div class="content-wrapper">
            <div class="text ${e.textDark}">
              <slot></slot>
            </div>
            <div class="action-slot">
              <slot name="action"></slot>
            </div>
          </div>
        </div>
      </div>
    `,setTimeout(()=>{let r=this.getAttribute("color")||"green",s={green:"green",blue:"blue",yellow:"yellow",red:"red",gray:"grey"},a=this.shadowRoot.querySelector('slot[name="action"]');a&&a.assignedElements().forEach(b=>{if(b.tagName==="UI-BUTTON")b.setAttribute("data-color",s[r]),typeof b.applyStyles=="function"?b.applyStyles():typeof b.updateStyle=="function"&&b.updateStyle();else if(b.tagName==="UI-MODAL"){let g=b.querySelector('[slot="trigger"]');g&&g.tagName==="UI-BUTTON"&&(g.setAttribute("data-color",s[r]),typeof g.applyStyles=="function"?g.applyStyles():typeof g.updateStyle=="function"&&g.updateStyle())}})},0)}};customElements.define("info-banner",Bt);var Tt=class{constructor(){this.overlay=null,this.isVisible=!1,this.init()}init(){this.overlay=document.createElement("div"),this.overlay.id="loadingOverlay",this.overlay.className="loading-overlay",this.overlay.innerHTML=`
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
    `,document.body.appendChild(this.overlay)}show(e="Loading..."){if(this.overlay||this.init(),e){let t=this.overlay.querySelector(".spinner-text");t&&(t.textContent=e)}this.overlay.classList.add("show"),this.isVisible=!0,document.body.style.overflow="hidden"}hide(){!this.overlay||(this.overlay.classList.remove("show"),this.isVisible=!1,document.body.style.overflow="")}reset(){!this.overlay||(this.overlay.style.transition="none",this.overlay.classList.remove("show"),this.isVisible=!1,setTimeout(()=>{this.overlay&&(this.overlay.style.transition="opacity 200ms ease-out, background-color 200ms ease-out")},0),document.body.style.overflow="")}destroy(){this.overlay&&(this.overlay.remove(),this.overlay=null),document.body.style.overflow=""}},Br=new Tt,Fe=Br;var Tr={enabled:!0,levels:{log:!1,debug:!1,warn:!0,error:!0,group:!1,groupEnd:!1},namespaces:{},methods:{}};function Mt(){let o=globalThis;return o.__LOG_CFG||(o.__LOG_CFG={...Tr}),o.__LOG_CFG}function we(o){let e=Mt();globalThis.__LOG_CFG={...e,...o,levels:{...e.levels,...o?.levels||{}},namespaces:{...e.namespaces,...o?.namespaces||{}},methods:{...e.methods,...o?.methods||{}}}}function Ze(o){if(o===!0||o===!1)return o;if(typeof o=="number")return o!==0;if(typeof o=="string"){let e=o.trim().toLowerCase();return e==="false"||e==="0"||e==="off"||e==="no"?!1:e==="true"||e==="1"||e==="on"||e==="yes"?!0:Boolean(e)}return Boolean(o)}function Pe(o,e,t){let n=Mt();if(!n.enabled||!Ze(n.levels[o]))return!1;let s=t?`${e}.${t}`:e;return Object.prototype.hasOwnProperty.call(n.methods,s)?Ze(n.methods[s]):Object.prototype.hasOwnProperty.call(n.namespaces,e)?Ze(n.namespaces[e]):Object.prototype.hasOwnProperty.call(n.namespaces,"*")?Ze(n.namespaces["*"]):!0}function Ke(o){let e=String(o||"log"),t=n=>`[${e}${n?`.${n}`:""}]`;return{group(n,...r){!Pe("group",e,n)||console.group(t(n),...r)},groupEnd(n){let r=Mt();!r.enabled||(Pe("group",e,n)||Ze(r.levels.groupEnd))&&console.groupEnd()},log(n,...r){!Pe("log",e,n)||console.log(t(n),...r)},debug(n,...r){!Pe("debug",e,n)||console.debug(t(n),...r)},warn(n,...r){!Pe("warn",e,n)||console.warn(t(n),...r)},error(n,...r){!Pe("error",e,n)||console.error(t(n),...r)}}}var Be=Ke;var Lt=Object.freeze({CHECKING:"checking",SAVINGS:"savings",CASH:"cash",CREDIT_CARD:"creditCard",LINE_OF_CREDIT:"lineOfCredit",OTHER_ASSET:"otherAsset",OTHER_LIABILITY:"otherLiability",MORTGAGE:"mortgage",AUTO_LOAN:"autoLoan",STUDENT_LOAN:"studentLoan",PERSONAL_LOAN:"personalLoan",MEDICAL_DEBT:"medicalDebt",OTHER_DEBT:"otherDebt"}),bn=Object.freeze(Object.values(Lt));var pe=Object.freeze({UNPROCESSED:"unprocessed",IN_PROGRESS:"inProgress",COMPLETED:"completed",FAILED:"failed"}),Qo=Object.freeze(Object.values(pe));var Oe=Be("Currency");we({methods:{"Currency.parseCurrencyToCents":!1}});function Dt(o){if(Oe.group("parseCurrencyToCents",o),(o?.trim()||"").length===0)throw Oe.error("parseCurrencyToCents",`Invalid currency string -- Empty input: "${o}"`),Oe.groupEnd("parseCurrencyToCents"),new Error(`Invalid currency string -- Empty input: "${o}"`);let t=o.replace(/[^0-9.-]+/g,"").trim(),n=parseFloat(t);if(isNaN(n))throw Oe.error("parseCurrencyToCents",`Invalid currency string -- Not a number: "${o}"`),Oe.groupEnd("parseCurrencyToCents"),new Error(`Invalid currency string -- Not a number: "${o}"`);let r=Math.round(n*100);return Oe.debug("parseCurrencyToCents",`parseCurrencyToCents: '${o}' -> '${r}' cents`),Oe.groupEnd("parseCurrencyToCents"),r}function $e(o){if(o==null)return parseFloat(0 .toFixed(2));if(typeof o!="number"||isNaN(o))throw new Error(`Invalid cents value: ${o}`);return parseFloat((o/100).toFixed(2))}var je=Be("Date");we({methods:{"Date.parseDate":!1}});function Je(o){if(je.group("parseDate",o),!o)return je.groupEnd("parseDate"),null;let e=o.trim(),t=e.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(t){let[,n,r,s]=t,a=`${s}-${n.padStart(2,"0")}-${r.padStart(2,"0")}`;return je.debug("parseDate",`Date '${o}' parsed as MM/DD/YYYY -> ${a}`),je.groupEnd("parseDate"),a}return je.debug("parseDate",`parseDate: unrecognized format -> ${e}`),je.groupEnd("parseDate"),null}function Nt(){return"id-"+Math.random().toString(36).slice(2,11)}var Ot=Object.freeze({CLEARED:"cleared",UNCLEARED:"uncleared",RECONCILED:"reconciled"}),Rt=Object.freeze(Object.values(Ot));var Mr=Object.freeze({RED:"red",ORANGE:"orange",YELLOW:"yellow",GREEN:"green",BLUE:"blue",PURPLE:"purple"}),zt=Object.freeze(Object.values(Mr));var Lr=Object.freeze({PAYMENT:"payment",REFUND:"refund",FEE:"fee",INTEREST:"interest",ESCROW:"escrow",BALANCE_ADJUSTMENT:"balanceAdjustment",CREDIT:"credit",CHARGE:"charge"}),Ft=Object.freeze(Object.values(Lr));var W=Be("Transaction");we({namespaces:{Transaction:!1},methods:{},levels:{debug:!0,group:!0,groupEnd:!0}});var Le=class{constructor(e=null){this.id=e||Nt(),this._date=null,this._amountDollars=0,this._memo=null,this._clearedStatus=Ot.CLEARED,this._isApproved=!0,this._flagColor=null,this._flagName=null,this._accountId=null,this._payeeId=null,this._categoryId=null,this._transferAccountId=null,this._transferTransactionId=null,this._debtTransactionType=null,this._subtransactionIds=[]}get date(){return this._date}set date(e){let t="setDate";W.group(t);let n=Je(e);if(!n){W.error(t,"Attempted to set invalid date for transaction ID:",this.id,"Input date:",e),W.groupEnd(t);return}W.debug(t,`Setting date to '${n}'`),this._date=n,W.groupEnd(t)}get amount(){return this._amountDollars}set amount(e){let t="setAmount";if(W.group(t),typeof e!="number"||isNaN(e)){W.error(t,"Attempted to set invalid amount for transaction ID:",this.id,"Amount:",e),W.groupEnd(t);return}W.debug(t,`Setting amount to '${e}'`),this._amountDollars=e,W.groupEnd(t)}get memo(){return this._memo}set memo(e){let t="setMemo";W.group(t);let n=e?.trim()||null;if(!n||n.length===0){W.debug(t,"Setting empty memo for transaction ID:",this.id),this._memo=null,W.groupEnd(t);return}W.debug(t,`Setting memo to '${n}'`),this._memo=n,W.groupEnd(t)}get clearedStatus(){return this._clearedStatus}set clearedStatus(e){let t="setClearedStatus";W.group(t);let n=e.trim().toLowerCase();if(!Rt.includes(n)){W.warn(t,`Attempted to set invalid status for transaction ID: '${this.id}', Status: '${n}'. Valid values are: ${Rt.join(", ")}`),W.groupEnd(t);return}W.debug(t,`Setting status to '${n}'`),this._clearedStatus=n,W.groupEnd(t)}get isApproved(){return this._isApproved}set isApproved(e){let t="setIsApproved";if(W.group(t),typeof e!="boolean"){W.error(t,"Attempted to set invalid isApproved value for transaction ID:",this.id,"Value:",e),W.groupEnd(t);return}W.debug(t,`Setting isApproved to '${e}'`),this._isApproved=e,W.groupEnd(t)}get flagColor(){return this._flagColor}set flagColor(e){let t="setFlagColor";W.group(t);let n=e?.trim().toLowerCase()||null;if(!n){W.debug(t,"Setting empty flag color for transaction ID:",this.id),this._flagColor=null,W.groupEnd(t);return}if(!zt.includes(n)){W.warn(t,`Attempted to set invalid flag color for transaction ID: '${this.id}', Color: '${n}'. Valid values are: ${zt.join(", ")}`),W.groupEnd(t);return}W.debug(t,`Setting flag color to '${n}'`),this._flagColor=n,W.groupEnd(t)}get flagName(){return this._flagName}set flagName(e){let t="setFlagName";W.group(t);let n=e?.trim()||null;if(!n||n.length===0){W.debug(t,"Setting empty flag name for transaction ID:",this.id),this._flagName=null,W.groupEnd(t);return}W.debug(t,`Setting flag name to '${n}'`),this._flagName=n,W.groupEnd(t)}get accountId(){return this._accountId}set accountId(e){let t="setAccountId";if(W.group(t),!e||e.trim().length===0){W.warn(t,"Attempted to set empty account ID for transaction ID:",this.id),W.groupEnd(t);return}W.debug(t,`Setting account ID to '${e}'`),this._accountId=e,W.groupEnd(t)}get payeeId(){return this._payeeId}set payeeId(e){let t="setPayeeId";if(W.group(t),!e||e.trim().length===0){W.warn(t,"Attempted to set empty payee ID for transaction ID:",this.id),W.groupEnd(t);return}W.debug(t,`Setting payee ID to '${e}'`),this._payeeId=e,W.groupEnd(t)}get categoryId(){return this._categoryId}set categoryId(e){let t="setCategoryId";if(W.group(t),!e||e.trim().length===0){W.warn(t,"Attempted to set empty category ID for transaction ID:",this.id),W.groupEnd(t);return}W.debug(t,`Setting category ID to '${e}'`),this._categoryId=e,W.groupEnd(t)}get transferAccountId(){return this._transferAccountId}set transferAccountId(e){let t="setTransferAccountId";W.group(t),W.debug(t,`Setting transfer account ID to '${e}'`),this._transferAccountId=e,W.groupEnd(t)}get transferTransactionId(){return this._transferTransactionId}set transferTransactionId(e){let t="setTransferTransactionId";W.group(t),W.debug(t,`Setting transfer transaction ID to '${e}'`),this._transferTransactionId=e,W.groupEnd(t)}get debtTransactionType(){return this._debtTransactionType}set debtTransactionType(e){let t="setDebtTransactionType";W.group(t);let n=e?.trim().toLowerCase()||null;if(!n){W.debug(t,"Setting empty debt transaction type for transaction ID:",this.id),this._debtTransactionType=null,W.groupEnd(t);return}if(!Ft.includes(n)){W.warn(t,`Attempted to set invalid debt transaction type for transaction ID: '${this.id}', Type: '${n}'. Valid values are: ${Ft.join(", ")}`),W.groupEnd(t);return}W.debug(t,`Setting debt transaction type to '${n}'`),this._debtTransactionType=n,W.groupEnd(t)}get subtransactionIds(){return this._subtransactionIds}set subtransactionIds(e){let t="setSubtransactionIds";if(W.group(t),!Array.isArray(e)){W.error(t,"Attempted to set invalid subtransaction IDs for transaction ID:",this.id,"Value:",e),W.groupEnd(t);return}W.debug(t,`Setting subtransaction IDs to '${e.join(", ")}'`),this._subtransactionIds=e,W.groupEnd(t)}init(e){W.group("init"),this._setTransferAccount(e.Payee),this.setDate(e.Date),this.setPayee(e.Payee),this.setFlagName(e.Flag),this.setCategory(e.Category,e["Category Group"]),this.setMemo(e.Memo),this.setState(e.Cleared),this.setAccountId(e.Account);let t=Dt(e.Inflow),n=Dt(e.Outflow),r=(t-n)/100;this.setAmount(r),W.groupEnd("init")}initFromApiData(e){this.date=e.date,this.amount=$e(e.amount),this.memo=e.memo,this.clearedStatus=e.cleared,this.isApproved=e.approved,this.flagColor=e.flag_color,this.flagName=e.flag_name,this.accountId=e.account_id,this.payeeId=e.payee_id,this.categoryId=e.category_id,this.transferAccountId=e.transfer_account_id,this.transferTransactionId=e.transfer_transaction_id,this.matchedTransactionId=e.matched_transaction_id,this.importId=e.import_id,this.debtTransactionType=e.debt_transaction_type,this.subtransactionIds=e.subtransactions}toObject(){return{id:this.id,date:this._date,amountDollars:this._amountDollars,memo:this._memo,clearedStatus:this._clearedStatus,isApproved:this._isApproved,flagColor:this._flagColor,flagName:this._flagName,accountId:this._accountId,payeeId:this._payeeId,categoryId:this._categoryId,transferAccountId:this._transferAccountId,transferTransactionId:this._transferTransactionId,debtTransactionType:this._debtTransactionType,subtransactionIds:this._subtransactionIds}}};var z=Be("Account");we({namespaces:{Account:!0},methods:{},levels:{debug:!0,group:!0,groupEnd:!0}});var Te=class{constructor(e){this.id=e,this._name="",this._originalName="",this._balanceDollars=0,this._clearedBalanceDollars=0,this._unclearedBalanceDollars=0,this._isDirectImportLinked=!1,this._lastReconciledAt=null,this._ynabType=null,this._ynabOriginalType=null,this._monarchType=null,this._monarchOriginalType=null,this._monarchSubtype=null,this._monarchOriginalSubtype=null,this._transactions=new Map,this._migrationStatus=pe.UNPROCESSED,this._isSelected=!1,this._isIncluded=!0,this._isClosed=!1,this._note=null,this._isModified=!1,this._isOnBudget=!0,this._transferPayeeId=null}get name(){return this._name}set name(e){z.group("set name");let t=e.trim();if(t.length===0)throw z.error("set name","Attempted to set empty name for account ID:",this.id),z.groupEnd("set name"),new Error("Account name cannot be empty.");z.debug("set name",`Setting name to '${t}'`),this._name=t,this._originalName===null&&(this._originalName=t),z.groupEnd("set name")}get originalName(){return this._originalName}get ynabType(){return this._ynabType}set ynabType(e){let t="set ynab type";if(z.group(t),!Object.values(Lt).includes(e))throw z.error(t,`Invalid type '${e}' for account ID: '${this.id}'`),z.groupEnd(t),new Error(`Type must be one of: ${bn.join(", ")}`);z.debug(t,`Setting type to '${e}'`),this._ynabType=e,this._ynabOriginalType===null&&(this._ynabOriginalType=e),z.groupEnd(t)}get ynabOriginalType(){return this._ynabOriginalType}get monarchType(){return this._monarchType}set monarchType(e){let t="set monarch type";z.group(t),this._monarchType=e,this._monarchOriginalType===null&&(this._monarchOriginalType=e),z.groupEnd(t)}get monarchOriginalType(){return this._monarchOriginalType}get monarchSubtype(){return this._monarchSubtype}set monarchSubtype(e){let t="set monarch subtype";z.group(t),this._monarchSubtype=e,this._monarchOriginalSubtype===null&&(this._monarchOriginalSubtype=e),z.groupEnd(t)}get monarchOriginalSubtype(){return this._monarchOriginalSubtype}get categoryGroup(){return this._categoryGroup}set categoryGroup(e){if(z.group("set categoryGroup"),!e||e.trim().length===0)throw z.error("set categoryGroup","Attempted to set empty categoryGroup for account ID:",this.id),z.groupEnd("set categoryGroup"),new Error("Category group cannot be empty.");z.debug("set categoryGroup",`Setting categoryGroup to '${e}'`),this._categoryGroup=e,z.groupEnd("set categoryGroup")}get originalCategoryGroup(){return this._originalCategoryGroup}get balance(){return this._balanceDollars}set balance(e){if(z.group("set balance"),typeof e!="number"||isNaN(e))throw z.error("set balance",`Attempted to set invalid balance for account ID: '${this.id}', Amount: '${e}'`),z.groupEnd("set balance"),new Error("Account balance must be a valid number.");z.debug("set balance",`Setting balance to '${e}'`),this._balanceDollars=e,z.groupEnd("set balance")}addToBalance(e){if(z.group("addToBalance"),typeof e!="number"||isNaN(e))throw z.error("addToBalance",`Attempted to add invalid amount to balance for account ID: '${this.id}', Amount: '${e}'`),z.groupEnd("addToBalance"),new Error("Amount to add to account balance must be a valid number.");z.debug("addToBalance",`Adding '${e}' to current balance '${this._balanceDollars}'`),this._balanceDollars+=e,z.debug("addToBalance",`New balance is '${this._balanceDollars}'`),z.groupEnd("addToBalance")}set clearedBalance(e){if(z.group("set clearedBalance"),typeof e!="number"||isNaN(e))throw z.error("set clearedBalance",`Attempted to set invalid cleared balance for account ID: '${this.id}', Amount: '${e}'`),z.groupEnd("set clearedBalance"),new Error("Account cleared balance must be a valid number.");z.debug("set clearedBalance",`Setting cleared balance to '${e}'`),this._clearedBalanceDollars=e,z.groupEnd("set clearedBalance")}set unclearedBalance(e){if(z.group("set unclearedBalance"),typeof e!="number"||isNaN(e))throw z.error("set unclearedBalance",`Attempted to set invalid uncleared balance for account ID: '${this.id}', Amount: '${e}'`),z.groupEnd("set unclearedBalance"),new Error("Account uncleared balance must be a valid number.");z.debug("set unclearedBalance",`Setting uncleared balance to '${e}'`),this._unclearedBalanceDollars=e,z.groupEnd("set unclearedBalance")}get migrationStatus(){return this._migrationStatus}set migrationStatus(e){let t="set migrationStatus";if(z.group(t),!Object.values(pe).includes(e))throw z.error(t,`Attempted to set invalid migration status for account ID: '${this.id}', Status: '${e}'`),z.groupEnd(t),new Error(`Migration status must be one of: ${Object.values(pe).join(", ")}`);z.debug(t,`Setting migration status to '${e}'`),this._migrationStatus=e,z.groupEnd(t)}get included(){return this._isIncluded}set included(e){if(z.group("set included"),typeof e!="boolean")throw z.error("set included",`Attempted to set invalid included value for account ID: '${this.id}', Value: '${e}'`),new Error("Included value must be a boolean.");this._isIncluded=e,z.groupEnd("set included")}get selected(){return this._isSelected}set selected(e){if(z.group("set selected"),typeof e!="boolean")throw z.error("set selected",`Attempted to set invalid selected value for account ID: '${this.id}', Value: '${e}'`),new Error("Selected value must be a boolean.");this._isSelected=e,z.groupEnd("set selected")}get closed(){return this._isClosed==="closed"}set closed(e){if(z.group("set closed"),typeof e!="boolean")throw z.error("set closed",`Attempted to set invalid closed value for account ID: '${this.id}', Value: '${e}'`),new Error("Closed value must be a boolean.");this._isClosed=e,z.groupEnd("set closed")}get transactions(){return Array.from(this._transactions.values())}get transactionCount(){return this._transactions.size}set transactions(e){if(z.group("set transactions"),!Array.isArray(e))throw z.error("set transactions",`Attempted to set invalid transactions for account ID: '${this.id}'. Type '${typeof e}'. Transactions: '${e}'`),z.groupEnd("set transactions"),new Error("Transactions must be an array of Transaction objects.");e.forEach(t=>this._transactions.set(t.id,t)),z.groupEnd("set transactions")}addTransaction(e){if(z.group("addTransaction"),!(e instanceof Le))return z.error("addTransaction",`Attempted to add invalid transaction to account ID: '${this.id}', Transaction: ${e}`),z.groupEnd("addTransaction"),new Error(`Invalid transaction object for account ID: '${this.id}':`,e);z.debug("addTransaction",`Adding transaction ID '${e.id}' to account ID '${this.id}'`),this._transactions.set(e.id,e),z.groupEnd("addTransaction")}set isOnBudget(e){if(z.group("set isOnBudget"),typeof e!="boolean")throw z.error("set isOnBudget",`Attempted to set invalid isOnBudget value for account ID: '${this.id}', Value: '${e}'`),new Error("isOnBudget value must be a boolean.");this._isOnBudget=e,z.groupEnd("set isOnBudget")}set note(e){if(z.group("set note"),e!==null&&typeof e!="string")throw z.error("set note",`Attempted to set invalid note value for account ID: '${this.id}', Value: '${e}'`),new Error("Note value must be a string or null.");this._note=e,z.groupEnd("set note")}set debtOriginalBalance(e){if(z.group("set debtOriginalBalance"),e!==null&&typeof e!="number")throw z.error("set debtOriginalBalance",`Attempted to set invalid debtOriginalBalance value for account ID: '${this.id}', Value: '${e}'`),new Error("debtOriginalBalance value must be a number or null.");this._debtOriginalBalance=e,z.groupEnd("set debtOriginalBalance")}set debtInterestRates(e){if(z.group("set debtInterestRates"),e!==null&&(typeof e!="object"||Array.isArray(e)))throw z.error("set debtInterestRates",`Attempted to set invalid debtInterestRates value for account ID: '${this.id}', Value: '${e}'`),new Error("debtInterestRates value must be an object or null.");this._debtInterestRates=e,z.groupEnd("set debtInterestRates")}set debtMinimumPayments(e){if(z.group("set debtMinimumPayments"),e!==null&&(typeof e!="object"||Array.isArray(e)))throw z.error("set debtMinimumPayments",`Attempted to set invalid debtMinimumPayments value for account ID: '${this.id}', Value: '${e}'`),new Error("debtMinimumPayments value must be an object or null.");this._debtMinimumPayments=e,z.groupEnd("set debtMinimumPayments")}set debtEscrowAmounts(e){if(z.group("set debtEscrowAmounts"),e!==null&&(typeof e!="object"||Array.isArray(e)))throw z.error("set debtEscrowAmounts",`Attempted to set invalid debtEscrowAmounts value for account ID: '${this.id}', Value: '${e}'`),new Error("debtEscrowAmounts value must be an object or null.");this._debtEscrowAmounts=e,z.groupEnd("set debtEscrowAmounts")}set transferPayeeId(e){if(z.group("set transferPayeeId"),e!==null&&typeof e!="string")throw z.error("set transferPayeeId",`Attempted to set invalid transferPayeeId value for account ID: '${this.id}', Value: '${e}'`),new Error("transferPayeeId value must be a string or null.");this._transferPayeeId=e,z.groupEnd("set transferPayeeId")}set isDirectImportLinked(e){if(z.group("set isDirectImportLinked"),typeof e!="boolean")throw z.error("set isDirectImportLinked",`Attempted to set invalid isDirectImportLinked value for account ID: '${this.id}', Value: '${e}'`),new Error("isDirectImportLinked value must be a boolean.");this._isDirectImportLinked=e,z.groupEnd("set isDirectImportLinked")}set isDirectImportOnError(e){if(z.group("set isDirectImportOnError"),typeof e!="boolean")throw z.error("set isDirectImportOnError",`Attempted to set invalid isDirectImportOnError value for account ID: '${this.id}', Value: '${e}'`),new Error("isDirectImportOnError value must be a boolean.");this._isDirectImportOnError=e,z.groupEnd("set isDirectImportOnError")}set lastReconciledAt(e){if(z.group("set lastReconciledAt"),e!==null&&!(e instanceof Date))throw z.error("set lastReconciledAt",`Attempted to set invalid lastReconciledAt value for account ID: '${this.id}', Value: '${e}'`),new Error("lastReconciledAt value must be a Date object or null.");this._lastReconciledAt=e,z.groupEnd("set lastReconciledAt")}get isModified(){let e="get isModified";z.group(e);let t=this._name!==this._originalName,n=this._ynabType!==this._ynabOriginalType,r=this._subtype!==this._originalSubtype,s=t||n||r;return z.debug(e,`Account ID: '${this.id}', isModified: '${s}'`),z.groupEnd(e),s}set isModified(e){if(z.group("set modified"),typeof e!="boolean")throw z.error("set modified",`Attempted to set invalid modified value for account ID: '${this.id}', Value: '${e}'`),new Error("Modified value must be a boolean.");this._isModified=e,z.groupEnd("set modified")}async undoChanges(){z.group("undoChanges"),this._name=this._originalName,this._category=this._originalCategory,this._categoryGroup=this._originalCategoryGroup,this._isModified=!1,await ve.updateAccountModification(this.id,{name:this._name,type:this._category,subtype:this._categoryGroup,modified:this._isModified}),z.groupEnd("undoChanges")}async syncDbModifications(){z.group("syncDbModifications");let e=await ve.getAccount(this.id);if(!e)throw z.error("syncDbModifications",`Account ID '${this.id}' not found in database; cannot sync modifications.`),z.groupEnd("syncDbModifications"),new Error(`Account ID '${this.id}' not found in database.`);let t={};this._name!==this._originalName&&this._name!==e.name&&(t.name=this._name),this._ynabType!==this._ynabOriginalType&&this._ynabType!==e.type&&(t.type=this._ynabType),this._subtype!==this._originalSubtype&&this._subtype!==e.subtype&&(t.subtype=this._subtype),Object.keys(t).length>0?this._isModified===!1&&(t.modified=!0,this._isModified=!0):this._isModified===!0&&(t.modified=!1,this._isModified=!1),t.included=this._isIncluded,t.selected=this._isSelected,Object.keys(t).length>0?(z.debug("syncDbModifications",`Updating account ID '${this.id}' with modifications:`,t),await ve.updateAccountModification(this.id,t)):z.debug("syncDbModifications",`No modifications to sync for account ID '${this.id}'`),z.groupEnd("syncDbModifications")}initFromApiData(e){this._name=e.name,this.isOnBudget=e.on_budget,this.note=e.note,this.balance=$e(e.balance),this.clearedBalance=$e(e.cleared_balance),this.unclearedBalance=$e(e.uncleared_balance),this.transferPayeeId=e.transfer_payee_id,this.isDirectImportLinked=e.direct_import_linked,this.isDirectImportOnError=e.direct_import_in_error,this.lastReconciledAt=Je(e.last_reconciled_at),this.debtOriginalBalance=e.debt_original_balance,this.debtInterestRates=e.debt_interest_rates,this.debtMinimumPayments=e.debt_minimum_payments,this.debtEscrowAmounts=e.debt_escrow_amounts}toObject(){return{id:this.id,name:this._name,originalName:this._originalName,balanceDollars:this._balanceDollars,clearedBalanceDollars:this._clearedBalanceDollars,unclearedBalanceDollars:this._unclearedBalanceDollars,isDirectImportLinked:this._isDirectImportLinked,lastReconciledAt:this._lastReconciledAt,type:this._ynabType,originalType:this._ynabType,transactions:Array.from(this._transactions.values()).map(e=>e.id),migrationStatus:this._migrationStatus,isSelected:this._isSelected,isIncluded:this._isIncluded,isClosed:this._isClosed,note:this._note,isModified:this._isModified}}};var Dr="YnabToMonarchDB",Nr=2,Ae=typeof indexedDB<"u",Pt=class{constructor(){this.db=null}async init(){if(console.group("Initializing IndexedDB:"),!Ae){console.warn("IndexedDB not available in this environment"),console.groupEnd();return}if(this.db){console.log("\u2705 IndexedDB already initialized, skipping"),console.groupEnd();return}return new Promise((e,t)=>{let n=indexedDB.open(Dr,Nr);n.onerror=()=>{console.error("IndexedDB failed to open:",n.error),console.groupEnd(),t(n.error)},n.onsuccess=()=>{this.db=n.result,console.log("\u2705 IndexedDB initialized"),console.groupEnd(),e()},n.onupgradeneeded=r=>{let s=r.target.result,a;if(s.objectStoreNames.contains("accounts")?(a=r.target.transaction.objectStore("accounts"),console.log('Upgrading "accounts" object store')):(a=s.createObjectStore("accounts",{keyPath:"id"}),console.log('Created "accounts" object store')),a&&!a.indexNames.contains("name")&&a.createIndex("name","name",{unique:!1}),a&&!a.indexNames.contains("type")&&a.createIndex("type","type",{unique:!1}),a&&!a.indexNames.contains("included")&&a.createIndex("included","included",{unique:!1}),a&&!a.indexNames.contains("modified")&&a.createIndex("modified","modified",{unique:!1}),a&&!a.indexNames.contains("syncedAt")&&a.createIndex("syncedAt","syncedAt",{unique:!1}),!s.objectStoreNames.contains("transactions")){let c=s.createObjectStore("transactions",{keyPath:"id",autoIncrement:!0});c.createIndex("accountId","accountId",{unique:!1}),c.createIndex("date","date",{unique:!1}),console.log('Created "transactions" object store')}if(!s.objectStoreNames.contains("uploadStates")){let c=s.createObjectStore("uploadStates",{keyPath:"itemId"});c.createIndex("status","status",{unique:!1}),c.createIndex("timestamp","timestamp",{unique:!1}),console.log('Created "uploadStates" object store')}s.objectStoreNames.contains("metadata")||(s.createObjectStore("metadata",{keyPath:"key"}),console.log('Created "metadata" object store')),console.groupEnd()}})}async saveAccounts(e){if(console.group("saveAccounts:"),!(e instanceof fe))throw console.error("Invalid accountsData provided, expected Accounts instance"),console.groupEnd(),new Error("Invalid accountsData provided, expected Accounts instance");if(!Ae||!this.db){console.warn("IndexedDB not initialized, skipping save"),console.groupEnd();return}return console.log(`Saving ${e.accounts.length} accounts to IndexedDB`),new Promise((t,n)=>{let r=this.db.transaction(["accounts","transactions"],"readwrite"),s=r.objectStore("accounts"),a=r.objectStore("transactions");console.log("Clearing existing accounts and transactions..."),s.clear(),a.clear();for(let c of e.accounts){console.debug(`Account data for '${c.id}':`,c);let b=new Set;console.log(`Processing (${c.transactions.length}) transactions for account '${c.id}'`);for(let g of c.transactions)try{console.debug("Storing transaction:",g),a.put(g.toObject()),b.add(g.id)}catch(x){console.error(`Error storing transaction for account ${c.id}:`,x)}console.log(`Saving account '${c.name}' with ID '${c.id}' with (${b.size}) transaction IDs`),s.put(c.toObject())}r.oncomplete=()=>{console.log(`Saved (${e.accounts.length}) accounts to IndexedDB.`),console.groupEnd(),t()},r.onerror=()=>{console.error("Error saving accounts to IndexedDB:",r.error),console.groupEnd(),n(r.error)}})}async getAccounts(){if(console.group("getAccounts:"),!Ae||!this.db)throw console.warn("IndexedDB not initialized, returning empty Accounts"),console.groupEnd(),new Error("IndexedDB not initialized");return new Promise((e,t)=>{let n=this.db.transaction(["accounts","transactions"],"readonly"),r=n.objectStore("accounts"),s=n.objectStore("transactions"),a={},c=r.openCursor();c.onsuccess=async b=>{let g=b.target.result;if(!g){console.debug(`\u2705 Retrieved ${Object.keys(a).length} accounts from IndexedDB`);let m=new fe;await m.init(a),console.groupEnd(),e(m);return}let x=g.value,u=x.id,d=s.index("accountId").getAll(u);d.onsuccess=()=>{let{transactionIds:m,...h}=x;a[u]={...h,transactions:d.result.map(p=>{let{accountId:w,...A}=p;return A})},console.debug(`Retrieved account ${u} with ${d.result.length} transactions`),g.continue()},d.onerror=()=>{console.error("Error retrieving transactions:",d.error),console.groupEnd(),t(d.error)}},c.onerror=()=>{console.error("Error opening cursor:",c.error),console.groupEnd(),t(c.error)}})}async getAccount(e){return console.group("getAccount:"),!Ae||!this.db?(console.warn("IndexedDB not initialized"),console.groupEnd(),null):new Promise((t,n)=>{let r=this.db.transaction(["accounts","transactions"],"readonly"),s=r.objectStore("accounts"),a=r.objectStore("transactions"),c=s.get(e);c.onsuccess=()=>{let b=c.result;if(!b){console.warn(`Account ${e} not found`),console.groupEnd(),t(null);return}let x=a.index("accountId").getAll(e);x.onsuccess=()=>{let{transactionIds:u,...f}=b,d={...f,transactions:x.result.map(m=>{let{accountId:h,...p}=m;return p})};console.log(`\u2705 Retrieved account ${e} with ${x.result.length} transactions`),console.groupEnd(),t(d)},x.onerror=()=>{console.error("Error retrieving transactions:",x.error),console.groupEnd(),n(x.error)}},c.onerror=()=>{console.error("Error retrieving account:",c.error),console.groupEnd(),n(c.error)}})}async hasAccounts(){return console.group("hasAccounts:"),!Ae||!this.db?(console.warn("IndexedDB not initialized"),console.groupEnd(),!1):new Promise((e,t)=>{let s=this.db.transaction("accounts","readonly").objectStore("accounts").count();s.onsuccess=()=>{let a=s.result>0;console.log(`\u2705 Database has ${s.result} accounts`),console.groupEnd(),e(a)},s.onerror=()=>{console.error("Error checking accounts:",s.error),console.groupEnd(),e(!1)}})}async updateAccountModification(e,t={}){if(console.group("updateAccountModification:"),!Ae||!this.db){console.warn("IndexedDB not initialized"),console.groupEnd();return}let r=this.db.transaction("accounts","readwrite").objectStore("accounts");return new Promise((s,a)=>{console.log(`Updating account ${e} with`,t);let c=r.get(e);c.onsuccess=()=>{let b=c.result;if(console.log("Current account data:",b),!b){console.warn(`Account ${e} not found`),console.groupEnd(),s();return}let g=Date.now(),x={...b,..."included"in t?{included:t.included}:{},..."selected"in t?{selected:t.selected}:{},..."name"in t?{name:t.name}:{},..."type"in t?{type:t.type}:{},..."subtype"in t?{subtype:t.subtype}:{},modified:t.modified!==void 0?t.modified:!1,lastModified:g};console.log("Updated account data:",x);let u=r.put(x);u.onsuccess=()=>{console.log(`\u2705 Account ${e} updated successfully`),console.groupEnd(),s()},u.onerror=()=>{console.error("Error updating account modification:",u.error),console.groupEnd(),a(u.error)}},c.onerror=()=>{console.error("Error retrieving account:",c.error),console.groupEnd(),a(c.error)}})}async clearAccounts(){if(console.group("clearAccounts:"),!Ae||!this.db){console.warn("IndexedDB not initialized, nothing to clear"),console.groupEnd();return}return new Promise((e,t)=>{let n=this.db.transaction(["accounts","transactions"],"readwrite");n.objectStore("accounts").clear(),n.objectStore("transactions").clear(),n.oncomplete=()=>{console.log("\u2705 Cleared all accounts from IndexedDB"),console.groupEnd(),e()},n.onerror=()=>{console.error("Error clearing accounts:",n.error),console.groupEnd(),t(n.error)}})}async saveUploadState(e,t,n=null){if(console.group("saveUploadState:"),!Ae||!this.db){console.warn("IndexedDB not initialized, skipping upload state save"),console.groupEnd();return}return new Promise((r,s)=>{let c=this.db.transaction("uploadStates","readwrite").objectStore("uploadStates"),b=c.get(e);b.onsuccess=()=>{let g=b.result,x=g?(g.retryCount||0)+1:0,u=c.put({itemId:e,status:t,retryCount:x,lastError:n,timestamp:Date.now()});u.onsuccess=()=>{console.log(`\u2705 Upload state for item ${e} saved as "${t}"`),console.groupEnd(),r()},u.onerror=()=>{console.error("Error saving upload state:",u.error),console.groupEnd(),s(u.error)}},b.onerror=()=>{console.error("Error retrieving existing upload state:",b.error),console.groupEnd(),s(b.error)}})}async getUploadStatesByStatus(e){return console.group("getUploadStatesByStatus:"),!Ae||!this.db?(console.warn("IndexedDB not initialized, returning empty list"),console.groupEnd(),[]):new Promise((t,n)=>{let c=this.db.transaction("uploadStates","readonly").objectStore("uploadStates").index("status").getAll(e);c.onsuccess=()=>{console.log(`\u2705 Retrieved ${c.result.length} upload states with status "${e}"`),console.groupEnd(),t(c.result||[])},c.onerror=()=>{console.error("Error retrieving upload states:",c.error),console.groupEnd(),t([])}})}async clearUploadStates(){if(console.group("clearUploadStates:"),!Ae||!this.db){console.warn("IndexedDB not initialized, nothing to clear"),console.groupEnd();return}return new Promise((e,t)=>{let n=this.db.transaction("uploadStates","readwrite");n.objectStore("uploadStates").clear(),n.oncomplete=()=>{console.log("\u2705 Cleared upload states"),console.groupEnd(),e()},n.onerror=()=>{console.error("Error clearing upload states:",n.error),console.groupEnd(),t(n.error)}})}async saveMetadata(e,t){if(console.group("saveMetadata:"),!Ae||!this.db){console.warn("IndexedDB not initialized, skipping metadata save"),console.groupEnd();return}return new Promise((n,r)=>{let c=this.db.transaction("metadata","readwrite").objectStore("metadata").put({key:e,value:t,timestamp:Date.now()});c.onsuccess=()=>{console.log(`\u2705 Metadata for key "${e}" saved`),console.groupEnd(),n()},c.onerror=()=>{console.error("Error saving metadata:",c.error),console.groupEnd(),r(c.error)}})}async getMetadata(e){return console.group("getMetadata:"),!Ae||!this.db?(console.warn("IndexedDB not initialized, returning null"),console.groupEnd(),null):new Promise((t,n)=>{let a=this.db.transaction("metadata","readonly").objectStore("metadata").get(e);a.onsuccess=()=>{let c=a.result;console.log(`\u2705 Retrieved metadata for key "${e}":`,c),console.groupEnd(),t(c?c.value:null)},a.onerror=()=>{console.error("Error retrieving metadata:",a.error),console.groupEnd(),t(null)}})}close(){console.group("close IndexedDB:"),this.db?(this.db.close(),this.db=null,console.log("\u2705 IndexedDB connection closed")):console.log("IndexedDB was not open"),console.groupEnd()}},Or=new Pt,ve=Or;var me=Be("Accounts");we({namespaces:{Accounts:!1},methods:{"Accounts.getByName":!0},levels:{debug:!0,group:!0,groupEnd:!0}});var fe=class{static from(e){if(e instanceof fe)return e;let t=new fe;return Array.isArray(e)&&e.forEach(n=>{if(n instanceof Te){t._accounts.set(n.id,n);return}if(n&&typeof n=="object"){let r=new Te(n.id);t._populateAccount(r,n),t._accounts.set(r.id,r)}}),t}constructor(){this._accounts=new Map,this._transactionIds=new Set}async init(e){let t=new Map;return Array.isArray(e)?e.forEach(n=>{let r=new Te(n.id);this._populateAccount(r,n),t.set(r.id,r)}):e&&typeof e=="object"&&Object.values(e).forEach(n=>{let r=new Te(n.id);this._populateAccount(r,n),t.set(r.id,r)}),this._accounts=t,this}get accounts(){return Array.from(this._accounts.values())}_populateAccount(e,t){e._name=t.name,e._originalName=t.originalName||t.name,e._type=t.type,e._subtype=t.subtype,e._balanceDollars=t.balance||0,e._status=t.status||"unprocessed",e._included=t.included!==void 0?t.included:!0,e._selected=t.selected||!1,e._isModified=t.modified||!1,t.transactions&&Array.isArray(t.transactions)&&t.transactions.forEach(n=>{let r=new Le;Object.assign(r,{id:n.id,_accountId:n.accountId,_flagName:n.flagName,_date:n.date,_payee:n.payee,_categoryGroup:n.categoryGroup,_category:n.category,_memo:n.memo,_amountDollars:n.amountDollars,_state:n.state,_deleted:n.deleted,_transferAccountName:n.transferAccountName}),e._transactions.set(r.id,r)})}add(e){me.group("add"),this._accounts.has(e.id)?me.warn("add",`Account with ID ${e.id} already exists:
AccountData:`,e,`
Existing Account:`,this._accounts.get(e.id)):(me.debug("add",`Adding account with ID '${e.id}' to Accounts`),this._accounts.set(e.id,e)),me.groupEnd("add")}has(e){me.group("has");let t=e.trim();if(t.length===0)return me.warn("has","\u274C Attempted to check empty name in Accounts.has"),me.groupEnd("has"),!1;let n=Array.from(this._accounts.values()).some(r=>r.name===t);return me.debug("has",`Accounts.has: checking for "${t}" ->`,n),me.groupEnd("has"),n}getByName(e){me.group("getByName");let t=e.trim();if(t.length===0)throw me.error("getByName","Attempted to get empty name in Accounts.getByName"),me.groupEnd("getByName"),new Error("Account name cannot be empty.");let n=Array.from(this._accounts.values()).find(r=>r._name===t)||null;return me.debug("getByName",`Accounts.getByName: retrieving "${t}" ->`,n),me.groupEnd("getByName"),n}async loadFromDb(){await ve.init();let e=await ve.getAccounts();return this.init(e)}async saveToDb(){me.group("saveToDb"),await ve.init(),await ve.saveAccounts(this),me.log("saveToDb","\u2705 All accounts saved successfully"),me.groupEnd("saveToDb")}async forEach(e){for(let t of this._accounts.values())await e(t)}length(){return this._accounts.size}totalTransactionCount(){return this._transactionIds.size}async hasChanges(){return Array.from(this._accounts.values()).some(e=>e.isModified)}async isAccountModified(e){let t=this._accounts.get(e);return t?t.isModified:!1}async includeAll(){await Promise.all(Array.from(this._accounts.values()).map(e=>(e._included=!0,ve.updateAccountModification(e.id,{included:!0}))))}async excludeAll(){await Promise.all(Array.from(this._accounts.values()).map(e=>(e._included=!1,ve.updateAccountModification(e.id,{included:!1}))))}async bulkRename(e,t){let n=Array.from(this._accounts.values()).filter(r=>r.selected);await Promise.all(n.map((r,s)=>{let a=Rr(e,r,s+t);return r._name=a,r._isModified=!0,ve.updateAccountModification(r.id,{name:a})}))}async bulkEditType(e,t){let n=Array.from(this._accounts.values()).filter(r=>r.selected);await Promise.all(n.map(r=>(r._ynabType=e,r._subtype=t,r._isModified=!0,ve.updateAccountModification(r.id,{type:e,subtype:t}))))}getSelected(){return Array.from(this._accounts.values()).filter(e=>e.selected)}getVisible(e){return Array.from(this._accounts.values()).filter(n=>e.passesFilters(n))}getIncludedAndUnprocessed(){return Array.from(this._accounts.values()).filter(e=>e.included&&e.migrationStatus!=="processed")}async undoAccountChanges(e){let t=this._accounts.get(e);t&&await t.undoChanges()}async undoAllChanges(){await Promise.all(Array.from(this._accounts.values()).map(e=>e.undoChanges()))}async deselectAll(){await Promise.all(Array.from(this._accounts.values()).map(e=>(e._selected=!1,ve.updateAccountModification(e.id,{selected:!1}))))}async selectAll(){await Promise.all(Array.from(this._accounts.values()).map(e=>(e._selected=!0,ve.updateAccountModification(e.id,{selected:!0}))))}async clear(){await ve.clearAccounts(),this._accounts=new Map}addTransaction(e){if(me.group("addTransaction"),this._transactionIds.has(e)){me.warn("addTransaction","\u274C Attempted to add duplicate transaction ID to Accounts:",e),me.groupEnd("addTransaction");return}this._transactionIds.add(e),me.groupEnd("addTransaction")}};function Rr(o,e,t){return o.replace(/{name}/g,e.name).replace(/{type}/g,e.type).replace(/{index}/g,t)}var $t=class{constructor(){this.monarchCredentials={email:null,encryptedPassword:null,accessToken:null,uuid:null,otp:null},this.history=[],this.userPreferences={}}_lsGet(e){return localStorage.getItem(e)}_lsSet(e,t){localStorage.setItem(e,t)}_lsRemove(e){localStorage.removeItem(e)}_ssGet(e){return sessionStorage.getItem(e)}_ssSet(e,t){sessionStorage.setItem(e,t)}_ssRemove(e){sessionStorage.removeItem(e)}},zr=new $t,J=zr;function ce(o={}){let{containerId:e="pageLayout",navbar:t=null,header:n=null,className:r=""}=o,s=document.getElementById(e);if(!s){console.error(`Page layout container #${e} not found`);return}let a=[],c=s.nextElementSibling;for(;c;)a.push(c),c=c.nextElementSibling;s.className=`min-h-screen flex flex-col w-full max-w-full mx-auto ${r}`,s.innerHTML=`
    <main class="flex-1 w-full max-w-full mx-auto px-4 py-2 overflow-x-hidden">
      <div class="max-w-6xl mx-auto w-full min-w-0 flex flex-col space-y-6 ">
        <!-- Navigation Bar -->
        <div id="navigationBar" class="min-w-0"></div>

        <!-- Page Header -->
        <div id="pageHeader" class="min-w-0 mx-auto"></div>

        <!-- Page Content Slot -->
        <div id="pageContent" class="min-w-0 mx-auto w-full"></div>
      </div>
    </main>
  `,t!=null&&Fr(t),n!=null&&$r(n);let b=document.getElementById("pageContent");b&&a.forEach(g=>{b.appendChild(g)})}function Fr(o={}){let{showBackButton:e=!0,showDataButton:t=!0,backText:n="Back",containerId:r="navigationBar"}=o,s=document.getElementById(r);if(!s){console.warn(`Navigation container with id "${r}" not found`);return}let a=Pr(),c=a?"Manage your data":"No data currently stored",b='<div class="flex flex-wrap items-center justify-between gap-2 mb-4">';e?b+=`
      <ui-button 
        id="navBackBtn" 
        data-type="text"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        ${n}
      </ui-button>
    `:b+="<div></div>",t&&(b+=`
      <ui-button 
        id="navDataBtn" 
        data-type="text"
        ${a?"":'style="opacity: 0.6;"'}
      >
        ${c}
      </ui-button>
    `),b+="</div>",s.innerHTML=b,e&&document.getElementById("navBackBtn")?.addEventListener("click",()=>{Xe()}),t&&document.getElementById("navDataBtn")?.addEventListener("click",()=>{se("/data-management")})}function Pr(){let o=J.accounts&&J.accounts.length()>0,e=J.monarchAccounts!==null,t=!!sessionStorage.getItem("monarch_email"),n=!!sessionStorage.getItem("monarch_token");return o||e||t||n}function $r(o={}){let{title:e="",description:t="",containerId:n="pageHeader",className:r=""}=o,s=document.getElementById(n);if(!s){console.warn(`Page header container with id "${n}" not found`);return}let a=`
    <section class="text-center mb-2 ${r}">
      <div class="inline-flex items-center justify-center gap-2 mb-6">
        <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          ${yn(e)}
        </h2>
      </div>

      <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 leading-relaxed">
        ${yn(t)}
      </p>
    </section>
  `;s.innerHTML=a}function yn(o){let e=document.createElement("div");return e.textContent=o,e.innerHTML}function jt(){ce({header:{title:"YNAB to Monarch Migration",description:"Moving your financial data from YNAB to Monarch made simple and secure. We'll guide you through each step.",containerId:"pageHeader"}}),document.getElementById("getStartedButton")?.addEventListener("click",o=>{o.preventDefault(),se("/upload")})}var vn=`<div id="pageLayout"></div>

<section class="flex flex-col items-center mb-6 max-w-md mx-auto gap-2">

  <!-- Get Started Btn -->
  <ui-button id="getStartedButton" data-size="large">
    Start Migrating Your Data
  </ui-button>

  <!-- Migration Info Modal -->
  <ui-modal id="migrationInfoModal">
    <ui-button slot="trigger" data-type="text">
      How does this work?
    </ui-button>

    <h3 slot="title">How the Migration Process Works</h3>

    <div slot="content">
      <div class="space-y-4 text-sm text-gray-600">
        <div>
          <h4 class="text-gray-900 text-sm font-semibold mb-1">Step 1: Access Your Data</h4>
          <p class="text-gray-600 text-sm">Connect your YNAB account so we can retrieve your
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
  </ui-modal>
</section>

<!-- Privacy Info -->
<section class="max-w-3xl mx-auto mb-8">
  <info-banner color="green" icon-type="checkmark" has-border>
    <strong>Your data stays yours, always:</strong> We never store, sell, or share your financial information. You
    remain in control of your data from start to finish.
    <ui-modal slot="action" id="privacyInfoModal">
      <ui-button slot="trigger" data-type="text">
        Learn more about how we protect your privacy
      </ui-button>

      <h3 slot="title">Privacy is our top priority</h3>

      <div slot="content">
        <div class="space-y-4 text-sm text-gray-600">
          <div>
            <h4 class="text-gray-900 font-semibold mb-1">No Data Collection</h4>
            <p>We never collect, store, or share your financial data.</p>
          </div>
          <div>
            <h4 class="text-gray-900 font-semibold mb-1">Secure Connections</h4>
            <p>We use secure, encrypted, and read-only connections when accessing your YNAB data.</p>
          </div>
          <div>
            <h4 class="text-gray-900 font-semibold mb-1">You're in Control</h4>
            <p>At any point in time you have full control to wipe your data and stop the migration process.</p>
          </div>
          <div>
            <h4 class="text-gray-900 font-semibold mb-1">Open Source & Auditable</h4>
            <p>Everything is transparent and can be reviewed by security experts. We have nothing to hide because we
              keep no copies. See <a href="https://github.com/your-repo" class="text-blue-600 hover:underline">our
                source code</a>.</p>
          </div>
        </div>

        <div class="mt-6">
          <info-banner color="green" icon-type="checkmark" has-border>
            <strong>100% Private:</strong> Your financial data is sensitive, and we treat it that way. You remain the
            sole owner of every byte.
          </info-banner>
        </div>
      </div>
    </ui-modal>
  </info-banner>
</section>

<!-- FAQ -->
<section class="max-w-3xl mx-auto mb-8">
  <info-banner color="gray" icon-type="info" has-border>
    <strong>Have Questions?</strong> Take a look at our <a href="/faq" class="text-blue-600 hover:underline">FAQ</a> for more
    information about the migration process, supported data, and more.
  </info-banner>
</section>`;var Ur="https://app.ynab.com/oauth/authorize",Hr="/oauth/ynab/callback",Ut="ynab_oauth_expected_state",qr="Could not retrieve YNAB OAuth client ID. Please try again.",mt=null;function Yr(){return`${location.origin}${Hr}`}async function Vr(){if(mt)return mt;try{let o=await fetch("/.netlify/functions/config");if(!o.ok)throw new Error("Failed to fetch config");return mt=(await o.json()).ynabClientId,mt}catch(o){return console.error("Error fetching YNAB client ID:",o),null}}function Ht(){try{return window.sessionStorage}catch(o){return console.warn("Session storage unavailable:",o),null}}function Wr(o){let e=Ht();!e||e.setItem(Ut,o)}function Gr(){let o=Ht();return o?o.getItem(Ut):null}function Zr(){let o=Ht();!o||o.removeItem(Ut)}function Kr(){let o=window.crypto||window.msCrypto;if(o?.randomUUID)return o.randomUUID();if(o?.getRandomValues){let e=new Uint8Array(16);return o.getRandomValues(e),Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)}function Jr(o,e){let t=new URL(Ur);return t.searchParams.set("client_id",o),t.searchParams.set("response_type","code"),t.searchParams.set("redirect_uri",Yr()),t.searchParams.set("state",e),t.toString()}async function xn(){let o=await Vr();if(!o)return window.alert(qr),null;let e=Kr();Wr(e);let t=Jr(o,e);return window.location.assign(t),t}function wn(){return Gr()}function qt(){return Zr()}var Qe=!1,ft=null,ae=Ke("YnabTokens");we({namespaces:{YnabTokens:!1}});async function _n(o){let e="exchangeYnabToken";ae.group(e);try{let t=await fetch("/.netlify/functions/ynabTokenExchange",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({code:o})});if(!t.ok){let r=await t.json();return ae.error(e,"Token exchange failed:",r),ae.groupEnd(e),!1}let n=await t.json();return ae.log(e,"\u2705 YNAB tokens stored in HttpOnly cookies"),n.success}catch(t){return ae.error(e,"Token exchange error:",t),!1}finally{ae.groupEnd(e)}}async function Xr(){let o="refreshYnabToken";return ae.group(o),Qe?(ae.debug(o,"Refresh already in progress, waiting for result..."),ae.groupEnd(o),ft):(Qe=!0,ft=(async()=>{try{let e=await fetch("/.netlify/functions/ynabTokenRefresh",{method:"POST",credentials:"include"});if(!e.ok)return ae.error(o,"Token refresh failed - redirecting to login"),Qe=!1,ae.groupEnd(o),window.location.href="/",!1;let t=await e.json();return ae.log(o,"\u2705 YNAB tokens refreshed"),ae.groupEnd(o),t.success}catch(e){return ae.error(o,"Token refresh error:",e),Qe=!1,window.location.href="/",ae.groupEnd(o),!1}finally{Qe=!1,ft=null}})(),ae.groupEnd(o),ft)}async function et(o,e={}){let t="ynabApiCall";ae.group(t,`Endpoint: ${o}`);try{let n=`/.netlify/functions/ynabProxy?endpoint=${encodeURIComponent(o)}`,r=await fetch(n,{...e,credentials:"include",headers:{"Content-Type":"application/json",...e.headers}});if(r.status===401){let a=await r.json();if(a.error&&a.error.includes("No access token found"))return ae.warn(t,"No YNAB tokens found - user needs to authenticate"),ae.groupEnd(t),null;if(ae.log(t,"Access token expired, refreshing..."),!await Xr())return ae.error(t,"Token refresh failed"),ae.groupEnd(t),null;r=await fetch(n,{...e,credentials:"include",headers:{"Content-Type":"application/json",...e.headers}})}if(!r.ok){let a=await r.json();throw ae.error(t,`YNAB API error (${o}):`,a),ae.groupEnd(t),new Error(`YNAB API request failed: ${r.status}`)}let s=await r.json();return ae.log(t,"Response received"),ae.groupEnd(t),s}finally{ae.groupEnd(t)}}async function kn(){let o="isYnabAuthenticated";ae.group(o);try{let t=await et("/user")!==null;return t?ae.log(o,"YNAB authenticated"):ae.warn(o,"YNAB not authenticated"),ae.groupEnd(o),t}catch(e){return ae.warn(o,"YNAB authentication check failed:",e.message),ae.groupEnd(o),!1}}async function Yt(){await xn()}async function Qr(o=!1){let e=o?"/budgets?include_accounts=true":"/budgets";try{return(await et(e)).data.budgets}catch(t){return console.error("YNAB API call failed:",t),null}}async function An(){try{let o=await et("/budgets/default/accounts");if(o.error)throw new Error(o.error.id,o.error.name,o.error.detail);let e=o.data.accounts,t=new fe;return e.forEach(n=>{let r=new Te(n.id);r.initFromApiData(n),t.add(r)}),t}catch(o){throw console.error("YNAB API call (getAccounts) failed:",o),new Error("Failed to fetch accounts from YNAB API")}}async function Sn(o){try{let e=await et(`/budgets/default/accounts/${o}/transactions`);if(e.error)throw new Error(e.error.id,e.error.name,e.error.detail);let t=e.data.transactions,n=new Set;return t.forEach(r=>{let s=new Le(r.id);s.initFromApiData(r),n.add(s)}),n}catch(e){throw console.error(`YNAB API call (getTransactions) failed for account ${o}:`,e),new Error("Failed to fetch transactions from YNAB API")}}async function eo(){let o=await An();return await Promise.all(o.accounts.map(async e=>{let t=await Sn(e.id);console.log(`Fetched transactions for account '${e.id}':`,t),e.transactions=Array.from(t)})),o}async function to(){let o=new URLSearchParams(window.location.search),e=o.get("code"),t=o.get("state"),n=wn();if(!t||t!==n)throw console.error("Invalid CSRF token on OAuth callback.",{stateToken:t,storedState:n}),qt(),new Error("Invalid CSRF token on OAuth callback.");if(qt(),!e)throw console.error("OAuth callback did not contain an authorization code."),new Error("OAuth callback did not contain an authorization code.");if(!await _n(e))throw console.error("Failed to exchange authorization code for tokens."),new Error("Failed to exchange authorization code for tokens.");return console.table(J),"success"}var no={redirectToYnabOauth:Yt,getBudgets:Qr,getAccounts:An,getTransactions:Sn,handleOauthCallback:to,getAllData:eo},Vt=no;async function Wt(){let o=await ro();oo(),so(o),ao(o)}async function ro(){try{return await kn()}catch(o){return console.warn("Error checking YNAB authentication:",o),!1}}function oo(){ce({navbar:{showBackButton:!0,showDataButton:!0},header:{title:"Step 1: Import YNAB Data",description:"Start by bringing over your YNAB data. Next, you'll review the data, filter and edit as needed.",containerId:"pageHeader"}})}function so(o){let e=document.getElementById("continueWithYnabBtn"),t=document.getElementById("oauthError");e.hidden=!o,document.getElementById("automaticUploadDivider").hidden=!o,e?.addEventListener("click",async n=>{n.preventDefault(),t.hide(),Fe.show("Fetching accounts...");try{let r=await uploadController.fetchYnabAccountsAndTransactions();if(!r||Object.keys(r).length===0){Fe.hide(),t.show("No accounts found in your YNAB profile.","Make sure you have at least one account in your YNAB budget, then try again.");return}fe.init(r),se("/review",!1,!0)}catch(r){console.error("Error fetching YNAB accounts:",r),Fe.hide(),t.show("Could not fetch accounts from YNAB.","Your session may have expired. Try connecting to YNAB again below.")}})}function ao(o){let e=document.getElementById("connectYnabBtn"),t=document.getElementById("oauthError");e.textContent=o?"Connect new YNAB Profile":"Connect to YNAB",e.setAttribute("data-color",o?"white":"purple"),e.applyStyles(),e?.addEventListener("click",async n=>{n.preventDefault(),t.hide();try{await Yt()}catch(r){console.error("Error initiating YNAB OAuth:",r),t.show("Could not connect to YNAB.","Please check your internet connection and try again.")}})}var Cn=`<div id="pageLayout"></div>

<!-- Upload Options -->
<section class="mb-12 w-full">
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
</section>`;var Gt=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});var lo="2025-06-02T06:26:29.704Z",co="tools/fetchMonarchAccountTypes.js",uo=[{group:"asset",typeDisplay:"Cash",typeName:"depository",subtypes:[{name:"cd",display:"CD"},{name:"checking",display:"Checking"},{name:"savings",display:"Savings"},{name:"money_market",display:"Money Market"},{name:"paypal",display:"Mobile Payment System"},{name:"prepaid",display:"Prepaid"},{name:"cash_management",display:"Cash Management"}]},{typeName:"brokerage",typeDisplay:"Investments",group:"asset",subtypes:[{name:"st_401a",display:"401a"},{name:"st_401k",display:"401k"},{name:"st_403b",display:"403b"},{name:"st_457b",display:"457b"},{name:"st_529",display:"529 Plan"},{name:"brokerage",display:"Brokerage (Taxable)"},{name:"cash_isa",display:"Individual Savings Account (ISA) - Cash"},{name:"cryptocurrency",display:"Cryptocurrency"},{name:"education_savings_account",display:"Coverdell Education Savings Account (ESA)"},{name:"gic",display:"Guaranteed Investment Certificate (GIC)"},{name:"fixed_annuity",display:"Fixed Annuity"},{name:"health_reimbursement_arrangement",display:"Health Reimbursement Arrangement (HRA)"},{name:"health_savings_account",display:"Health Savings Account (HSA)"},{name:"iso",display:"Incentive Stock Options (ISO)"},{name:"ira",display:"Individual Retirement Account (IRA)"},{name:"isa",display:"Individual Savings Account (ISA) - Non-cash"},{name:"lif",display:"Life Income Fund (LIF) Retirement Account"},{name:"lira",display:"Locked-in Retirement Account (LIRA)"},{name:"lrif",display:"Locked-in Retirement Income Fund (LRIF)"},{name:"lrsp",display:"Locked-in Retirement Savings Plan (LRSP)"},{name:"keogh_plan",display:"Keogh Plan"},{name:"mutual_fund",display:"Mutual Fund"},{name:"nso",display:"Non-qualified Stock Options (NSO)"},{name:"non_taxable_brokerage_account",display:"Brokerage (Non-taxable)"},{name:"other",display:"Other"},{name:"prif",display:"Prescribed Registered Retirement Income Fund (PRIF)"},{name:"rdsp",display:"Registered Disability Savings Plan (RDSP)"},{name:"resp",display:"Registered Education Savings Plan (RESP)"},{name:"rlif",display:"Restricted Life Income Fund (RLIF)"},{name:"rrif",display:"Registered Retirement Income Fund (RRIF)"},{name:"pension",display:"Pension"},{name:"profit_sharing_plan",display:"Profit Sharing Plan"},{name:"qualifying_share_account",display:"Qualifying Share Account"},{name:"retirement",display:"Retirement"},{name:"roth",display:"Roth IRA"},{name:"roth_401k",display:"Roth 401k"},{name:"rrsp",display:"Registered Retirement Savings Plan (RRSP)"},{name:"sarsep_pension",display:"Salary Reduction Simplified Employee Pension Plan (SARSEP)"},{name:"sep_ira",display:"Simplified Employee Pension IRA (SEP IRA)"},{name:"simple_ira",display:"Simple IRA"},{name:"sipp",display:"Self-Invested Personal Pension (SIPP)"},{name:"stock_plan",display:"Stock Plan"},{name:"thrift_savings_plan",display:"Thrift Savings Plan (TSP)"},{name:"trust",display:"Trust"},{name:"tfsa",display:"Tax-Free Savings Account (TFSA)"},{name:"ugma",display:"Uniform Gift to Minors Act (UGMA)"},{name:"utma",display:"Uniform Transfers to Minors Act (UTMA)"},{name:"variable_annuity",display:"Variable Annuity"},{name:"fhsa",display:"First Home Savings Account (FHSA)"}]},{typeName:"real_estate",typeDisplay:"Real Estate",group:"asset",subtypes:[{name:"primary_home",display:"Primary Home"},{name:"secondary_home",display:"Secondary Home"},{name:"rental_property",display:"Rental Property"}]},{typeName:"vehicle",typeDisplay:"Vehicles",group:"asset",subtypes:[{name:"car",display:"Car"},{name:"boat",display:"Boat"},{name:"motorcycle",display:"Motorcycle"},{name:"snowmobile",display:"Snowmobile"},{name:"bicycle",display:"Bicycle"},{name:"other",display:"Other"}]},{typeName:"valuables",typeDisplay:"Valuables",group:"asset",subtypes:[{name:"art",display:"Art"},{name:"jewelry",display:"Jewelry"},{name:"collectibles",display:"Collectibles"},{name:"furniture",display:"Furniture"},{name:"other",display:"Other"}]},{typeName:"credit",typeDisplay:"Credit Cards",group:"liability",subtypes:[{name:"credit_card",display:"Credit Card"}]},{typeName:"loan",typeDisplay:"Loans",group:"liability",subtypes:[{name:"auto",display:"Auto"},{name:"business",display:"Business"},{name:"commercial",display:"Commercial"},{name:"construction",display:"Construction"},{name:"consumer",display:"Consumer"},{name:"home",display:"Home"},{name:"home_equity",display:"Home Equity"},{name:"loan",display:"Loan"},{name:"mortgage",display:"Mortgage"},{name:"overdraft",display:"Overdraft"},{name:"line_of_credit",display:"Line of Credit"},{name:"student",display:"Student"}]},{typeName:"other_asset",typeDisplay:"Other Assets",group:"asset",subtypes:[{name:"other",display:"Other"}]},{typeName:"other_liability",typeDisplay:"Other Liabilities",group:"liability",subtypes:[{name:"other",display:"Other"}]}],De={generatedAt:lo,generatedBy:co,data:uo};function Ce(o){return De.data.find(e=>e.typeName===o)}function Ue(o,e){return Ce(o)?.subtypes.find(n=>n.name===e)}function _e(o,e){o.disabled=e,o.classList.toggle("cursor-default",e),o.classList.toggle("cursor-pointer",!e),o.classList.toggle("opacity-50",e)}function xe(o,e){e?(o.classList.remove("hidden"),o.removeAttribute("aria-hidden"),o.removeAttribute("hidden")):(o.classList.add("hidden"),o.setAttribute("aria-hidden","true"),o.setAttribute("hidden","true"))}var nt=class{constructor(){this.pendingFilters=new tt,this.activeFilters=new tt,this.searchQuery=""}clearPendingFilters(){this.pendingFilters.clear()}clearActiveFilters(){this.activeFilters.clear()}applyPendingToActive(){this.activeFilters=Object.assign(new tt,this.pendingFilters)}getNumberOfActiveFilters(){let e=0;return this.activeFilters.accountName&&e++,this.activeFilters.types.size>0&&e++,this.activeFilters.subtypes.size>0&&e++,this.activeFilters.transactionsMin!==null&&e++,this.activeFilters.transactionsMax!==null&&e++,this.activeFilters.balanceMin!==null&&e++,this.activeFilters.balanceMax!==null&&e++,this.activeFilters.inclusion!=="all"&&e++,e}hasPendingChanges(){return this.accountNameHasPendingChange()||this.typesHavePendingChange()||this.subtypesHavePendingChange()||this.transactionMinHasPendingChange()||this.transactionMaxHasPendingChange()||this.balanceMinHasPendingChange()||this.balanceMaxHasPendingChange()||this.inclusionHasPendingChange()}passesFilters(e){if(this.activeFilters.accountName){let r=this.activeFilters.nameCaseSensitive?e.current.name:e.current.name.toLowerCase(),s=this.activeFilters.nameCaseSensitive?this.activeFilters.accountName:this.activeFilters.accountName.toLowerCase();if(this.activeFilters.nameMatchType==="exact"){if(r!==s)return!1}else if(!r.includes(s))return!1}if(this.activeFilters.types.size>0){let r=Ce(e.current.type),s=r?r.typeDisplay:e.current.type||"";if(!this.activeFilters.types.has(s))return!1}if(this.activeFilters.subtypes.size>0){let r=Ue(e.current.type,e.current.subtype),s=r?r.display:e.current.subtype||"";if(!this.activeFilters.subtypes.has(s))return!1}let t=e.transactionCount||0;if(this.activeFilters.transactionsMin!==null&&t<this.activeFilters.transactionsMin||this.activeFilters.transactionsMax!==null&&t>this.activeFilters.transactionsMax)return!1;let n=parseFloat(e.balance)||0;return!(this.activeFilters.balanceMin!==null&&n<this.activeFilters.balanceMin||this.activeFilters.balanceMax!==null&&n>this.activeFilters.balanceMax||this.activeFilters.inclusion==="included"&&!e.included||this.activeFilters.inclusion==="excluded"&&e.included)}accountNameHasPendingChange(){return this.activeFilters.accountName!==this.pendingFilters.accountName||this.activeFilters.nameMatchType!==this.pendingFilters.nameMatchType||this.activeFilters.nameCaseSensitive!==this.pendingFilters.nameCaseSensitive}transactionMinHasPendingChange(){return this.activeFilters.transactionsMin!==this.pendingFilters.transactionsMin}transactionMaxHasPendingChange(){return this.activeFilters.transactionsMax!==this.pendingFilters.transactionsMax}balanceMinHasPendingChange(){return this.activeFilters.balanceMin!==this.pendingFilters.balanceMin}balanceMaxHasPendingChange(){return this.activeFilters.balanceMax!==this.pendingFilters.balanceMax}typesHavePendingChange(){let e=this.activeFilters,t=this.pendingFilters;return e.types.size!==t.types.size?!0:![...t.types].every(n=>e.types.has(n))}subtypesHavePendingChange(){let e=this.activeFilters,t=this.pendingFilters;return e.subtypes.size!==t.subtypes.size?!0:![...t.subtypes].every(n=>e.subtypes.has(n))}inclusionHasPendingChange(){return this.activeFilters.inclusion!==this.pendingFilters.inclusion}setSearchQuery(e){this.searchQuery=e.toLowerCase()}},tt=class{constructor(){this.accountName="",this.nameMatchType="contains",this.nameCaseSensitive=!1,this.types=new Set,this.subtypes=new Set,this.transactionsMin=null,this.transactionsMax=null,this.balanceMin=null,this.balanceMax=null,this.inclusion="all"}clear(){this.accountName="",this.nameMatchType="contains",this.nameCaseSensitive=!1,this.types.clear(),this.subtypes.clear(),this.transactionsMin=null,this.transactionsMax=null,this.balanceMin=null,this.balanceMax=null,this.inclusion="all"}};var rt=class{constructor(e,t,n){this.filters=e,this.onApply=t,this.onReset=n,this.modal=null}open(){this.modal=document.getElementById("filtersModal"),this.modal.open(),setTimeout(()=>{this._setupEventListeners(),this._populateFilters(),this._updatePendingFilterStyles()},10)}_setupEventListeners(){let e=this.modal._modalOverlay,t=e.querySelector("#filtersResetBtn"),n=e.querySelector("#filtersApplyBtn");t.onclick=()=>this._handleReset(),n.onclick=()=>this._handleApply();let r=e.querySelector("#filterAccountName"),s=e.querySelector("#clearAccountNameBtn");r.addEventListener("input",()=>{this.filters.pendingFilters.accountName=r.value,s.classList.toggle("hidden",!r.value.trim()),this._updatePendingFilterStyles()}),s.addEventListener("click",()=>{r.value="",r.dispatchEvent(new Event("input"))}),e.querySelectorAll('input[name="nameMatchType"]').forEach(w=>{w.addEventListener("change",()=>{this.filters.pendingFilters.nameMatchType=w.value,this._updatePendingFilterStyles()})});let c=e.querySelector("#nameCaseSensitive");c.addEventListener("change",()=>{this.filters.pendingFilters.nameCaseSensitive=c.checked,this._updatePendingFilterStyles()});let b=e.querySelector("#accountTypeSelectAllBtn"),g=e.querySelector("#accountTypeDeselectAllBtn");b.onclick=()=>this._selectAllTypes(e),g.onclick=()=>this._deselectAllTypes(e);let x=e.querySelector("#accountSubtypeSelectAllBtn"),u=e.querySelector("#accountSubtypeDeselectAllBtn");x.onclick=()=>this._selectAllSubtypes(e),u.onclick=()=>this._deselectAllSubtypes(e),e.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(w=>{w.addEventListener("change",()=>{w.checked?this.filters.pendingFilters.types.add(w.value):this.filters.pendingFilters.types.delete(w.value),this._updatePendingFilterStyles()})}),e.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(w=>{w.addEventListener("change",()=>{w.checked?this.filters.pendingFilters.subtypes.add(w.value):this.filters.pendingFilters.subtypes.delete(w.value),this._updatePendingFilterStyles()})});let f=e.querySelector("#filterTransactionsMin"),d=e.querySelector("#filterTransactionsMax");f.addEventListener("input",()=>{this.filters.pendingFilters.transactionsMin=f.value?parseInt(f.value,10):null,this._updatePendingFilterStyles()}),d.addEventListener("input",()=>{this.filters.pendingFilters.transactionsMax=d.value?parseInt(d.value,10):null,this._updatePendingFilterStyles()});let m=e.querySelector("#filterBalanceMin"),h=e.querySelector("#filterBalanceMax");m.addEventListener("input",()=>{this.filters.pendingFilters.balanceMin=m.value?parseFloat(m.value):null,this._updatePendingFilterStyles()}),h.addEventListener("input",()=>{this.filters.pendingFilters.balanceMax=h.value?parseFloat(h.value):null,this._updatePendingFilterStyles()}),e.querySelectorAll('input[name="inclusionFilter"]').forEach(w=>{w.addEventListener("change",()=>{this.filters.pendingFilters.inclusion=w.value,this._updatePendingFilterStyles()})})}_populateFilters(){let e=this.modal._modalOverlay,t=e.querySelector("#filterAccountName");t.value=this.filters.activeFilters.accountName;let n=e.querySelector('input[name="nameMatchType"][value="contains"]'),r=e.querySelector('input[name="nameMatchType"][value="exact"]');n.checked=this.filters.activeFilters.nameMatchType==="contains",r.checked=this.filters.activeFilters.nameMatchType==="exact";let s=e.querySelector("#nameCaseSensitive");s.checked=this.filters.activeFilters.nameCaseSensitive;let a=!this.filters.activeFilters.accountName.trim();e.querySelectorAll('input[name="nameMatchType"]').forEach(d=>d.disabled=a),s.disabled=a,this._populateTypeFilters(e),this._populateSubtypeFilters(e);let b=e.querySelector("#filterTransactionsMin");b.value=this.filters.activeFilters.transactionsMin||"";let g=e.querySelector("#filterTransactionsMax");g.value=this.filters.activeFilters.transactionsMax||"";let x=e.querySelector("#filterBalanceMin");x.value=this.filters.activeFilters.balanceMin||"";let u=e.querySelector("#filterBalanceMax");u.value=this.filters.activeFilters.balanceMax||"",e.querySelectorAll('input[name="inclusionFilter"]').forEach(d=>{d.checked=d.value===this.filters.activeFilters.inclusion})}_populateTypeFilters(e){let t=e.querySelector("#typeFiltersContainer"),n=[...new Set(De.data.map(r=>r.typeDisplay))].sort();t.innerHTML="",n.forEach(r=>{let s=this.filters.activeFilters.types.has(r),a=this._createFilterCheckbox("type",r,r,s);t.appendChild(a)})}_populateSubtypeFilters(e){let t=e.querySelector("#subtypeFiltersContainer"),n=new Set;De.data.forEach(s=>{s.subtypes.forEach(a=>n.add(a.display))});let r=[...n].sort();t.innerHTML="",r.forEach(s=>{let a=this.filters.activeFilters.subtypes.has(s),c=this._createFilterCheckbox("subtype",s,s,a);t.appendChild(c)})}_createFilterCheckbox(e,t,n,r=!1){let s=document.createElement("div");s.className="flex items-center";let a=document.createElement("input");a.type="checkbox",a.id=`filter-${e}-${t.replace(/\s+/g,"-")}`,a.value=t,a.className="w-4 h-4 border-gray-300 rounded",a.style.accentColor="#111827",a.checked=r;let c=document.createElement("label");return c.htmlFor=a.id,c.className="ml-2 text-sm text-gray-700 cursor-pointer",c.textContent=n,s.appendChild(a),s.appendChild(c),s}_selectAllTypes(e){e.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(t=>{t.checked=!0,this.filters.pendingFilters.types.add(t.value)}),this._updatePendingFilterStyles()}_deselectAllTypes(e){e.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(t=>{t.checked=!1,this.filters.pendingFilters.types.delete(t.value)}),this._updatePendingFilterStyles()}_selectAllSubtypes(e){e.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(t=>{t.checked=!0,this.filters.pendingFilters.subtypes.add(t.value)}),this._updatePendingFilterStyles()}_deselectAllSubtypes(e){e.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(t=>{t.checked=!1,this.filters.pendingFilters.subtypes.delete(t.value)}),this._updatePendingFilterStyles()}_updatePendingFilterStyles(){let e=this.modal._modalOverlay;e.querySelector("#filterAccountName").classList.toggle("filter-modified",this.filters.accountNameHasPendingChange()),e.querySelector("#filterTransactionsMin").classList.toggle("filter-modified",this.filters.transactionMinHasPendingChange()),e.querySelector("#filterTransactionsMax").classList.toggle("filter-modified",this.filters.transactionMaxHasPendingChange()),e.querySelector("#filterBalanceMin").classList.toggle("filter-modified",this.filters.balanceMinHasPendingChange()),e.querySelector("#filterBalanceMax").classList.toggle("filter-modified",this.filters.balanceMaxHasPendingChange()),e.querySelector("#typeFiltersContainer").parentElement.classList.toggle("filter-modified",this.filters.typesHavePendingChange()),e.querySelector("#subtypeFiltersContainer").parentElement.classList.toggle("filter-modified",this.filters.subtypesHavePendingChange());let g=e.querySelector("#filtersResetBtn");g.disabled=!this.filters.hasPendingChanges()}_handleApply(){this.filters.applyPendingToActive(),this.modal.close(),this.onApply&&this.onApply()}_handleReset(){this.filters.clearPendingFilters(),this._populateFilters(),this._updatePendingFilterStyles(),this.onReset&&this.onReset()}};var ot=class{constructor(e,t){this.accounts=e,this.onApply=t,this.modal=null}open(){this.modal=document.getElementById("bulkRenameModal"),this.modal.open(),setTimeout(()=>{this._setupEventListeners(),this._updatePreview()},300)}_setupEventListeners(){let e=this.modal._modalOverlay,t=e.querySelector("#renamePattern"),n=e.querySelector("#indexStart"),r=e.querySelector("#renameCancel"),s=e.querySelector("#renameApply");e.querySelectorAll(".token-btn").forEach(c=>{c.onclick=b=>{b.preventDefault();let g=c.dataset.token,x=t.selectionStart,u=t.value.substring(0,x),f=t.value.substring(t.selectionEnd);t.value=u+g+f,t.selectionStart=t.selectionEnd=x+g.length,t.focus(),this._updatePreview()}}),t.oninput=()=>this._updatePreview(),n.oninput=()=>this._updatePreview(),r.onclick=c=>{c.preventDefault(),c.stopPropagation(),this.modal.close()},s.onclick=c=>{c.preventDefault(),c.stopPropagation(),this._handleApply(e)},t.focus()}_updatePreview(){let e=this.modal._modalOverlay,t=e.querySelector("#renamePreview"),n=e.querySelector("#renamePattern"),r=e.querySelector("#indexStart");t.innerHTML="";let s=n.value,a=parseInt(r.value,10)||1,c=this.accounts.getSelected();if(c.slice(0,3).forEach((b,g)=>{let x=this._applyPattern(s,b,a+g),u=document.createElement("div");u.className="p-2 bg-gray-50 rounded text-sm text-gray-700 border border-gray-200",u.textContent=x||"(empty)",t.appendChild(u)}),c.length>3){let b=document.createElement("div");b.className="p-2 text-xs text-gray-500 italic",b.textContent=`...and ${c.length-3} more`,t.appendChild(b)}}_applyPattern(e,t,n){let r=new Date().toISOString().split("T")[0];return e.replace(/{{YNAB}}/g,t.originalYnabName?.trim()||t.current.name||"Account").replace(/{{Index}}/g,n).replace(/{{Upper}}/g,(t.originalYnabName?.trim()||t.current.name||"Account").toUpperCase()).replace(/{{Date}}/g,r)}_handleApply(e){let t=e.querySelector("#renamePattern"),n=e.querySelector("#indexStart"),r=t.value,s=parseInt(n.value,10)||1;this.accounts.bulkRename(r,s),this.modal.close(),this.onApply&&this.onApply()}};var st=class{constructor(e,t){this.accounts=e,this.onApply=t,this.modal=null}open(){this.modal=document.getElementById("bulkTypeModal"),this.modal.open(),setTimeout(()=>{this._setupEventListeners(),this._populateTypeDropdown(),this._updateSubtypeOptions()},300)}_setupEventListeners(){let e=this.modal._modalOverlay,t=e.querySelector("#bulkTypeSelect"),n=e.querySelector("#bulkTypeCancel"),r=e.querySelector("#bulkTypeApply");t.onchange=()=>this._updateSubtypeOptions(),n.onclick=s=>{s.preventDefault(),s.stopPropagation(),this.modal.close()},r.onclick=s=>{s.preventDefault(),s.stopPropagation(),this._handleApply(e)}}_populateTypeDropdown(){let t=this.modal._modalOverlay.querySelector("#bulkTypeSelect");t.innerHTML="",De.data.forEach(n=>{let r=document.createElement("option");r.value=n.typeName,r.textContent=n.typeDisplay,t.appendChild(r)})}_updateSubtypeOptions(){let e=this.modal._modalOverlay,t=e.querySelector("#bulkTypeSelect"),n=e.querySelector("#bulkSubtypeSelect"),r=Ce(t.value);if(n.innerHTML="",(r?.subtypes||[]).forEach(s=>{let a=document.createElement("option");a.value=s.name,a.textContent=s.display,n.appendChild(a)}),(r?.subtypes||[]).length===0){let s=document.createElement("option");s.value="",s.textContent="(No subtypes available)",s.disabled=!0,s.selected=!0,n.appendChild(s)}}_handleApply(e){let t=e.querySelector("#bulkTypeSelect"),n=e.querySelector("#bulkSubtypeSelect"),r=t.value,s=n.value;this.accounts.bulkEditType(r,s),this.modal.close(),this.onApply&&this.onApply()}};var at=class{constructor(e,t){this.account=e,this.onSave=t,this.overlay=null,this.input=null}open(){this._createDOM(),this._setupEventListeners(),this._show(),this.input.focus(),this.input.select()}_createDOM(){this.overlay=document.createElement("div"),this.overlay.className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 opacity-0 transition-opacity duration-200",document.body.appendChild(this.overlay);let e=document.createElement("div");e.className="bg-white rounded-lg shadow-lg p-5 w-[400px]";let t=document.createElement("h2");t.className="font-bold mb-3 text-lg",t.textContent="Edit Account Name",e.appendChild(t),this.input=document.createElement("input"),this.input.type="text",this.input.value=this.account.current.name,this.input.setAttribute("aria-label","Account name input"),this.input.className="border rounded w-full px-3 py-2 mb-4",e.appendChild(this.input);let n=document.createElement("div");n.className="flex justify-end gap-2";let r=document.createElement("button");r.textContent="Cancel",r.className="bg-gray-300 px-4 py-2 rounded",r.addEventListener("click",()=>this.close());let s=document.createElement("button");s.textContent="Save",s.className="bg-blue-500 text-white px-4 py-2 rounded font-bold",s.addEventListener("click",()=>this._handleSave()),n.appendChild(r),n.appendChild(s),e.appendChild(n),this.overlay.appendChild(e)}_setupEventListeners(){this.overlay.addEventListener("keydown",e=>{e.key==="Escape"&&this.close(),e.key==="Enter"&&this._handleSave()})}_show(){requestAnimationFrame(()=>this.overlay.classList.add("opacity-100"))}_handleSave(){this.account.setName(this.input.value),this.onSave&&this.onSave(this.account),this.close()}close(){this.overlay.classList.remove("opacity-100"),this.overlay.classList.add("opacity-0"),setTimeout(()=>{this.overlay&&this.overlay.parentNode&&document.body.removeChild(this.overlay)},200)}};var D=Ke("AccountReviewController");we({namespaces:{AccountReviewController:!1}});var it=class{constructor(){this.filters=new nt,this.accounts=new fe,this.accountsTable=null,this.importBtn=null,this.searchInput=null,this.filtersModal=null,this.bulkRenameModal=null,this.bulkTypeModal=null}async init(){let e="init";D.group(e,"Initializing AccountReviewController"),await this.accounts.loadFromDb(),this._renderLayout(),this._cacheElements(),this._setupTableColumns(),this._initializeModals(),this._setupEventListeners(),this._renderTable(!0),D.groupEnd(e)}_renderLayout(){D.group("_renderLayout","AccountReviewController._renderLayout()");try{D.log("_renderLayout","Rendering page layout for Account Review"),ce({navbar:{showBackButton:!0,showDataButton:!0},header:{title:"Step 2: Review Accounts",description:"Review and adjust your accounts. Next, we'll choose how to migrate to Monarch.",containerId:"pageHeader"}}),D.log("_renderLayout","Page layout rendered successfully")}catch(e){D.error("_renderLayout","Error rendering layout:",e)}finally{D.groupEnd("_renderLayout")}}_cacheElements(){D.group("_cacheElements","AccountReviewController._cacheElements()");try{this.accountsTable=document.getElementById("accountsTable"),this.importBtn=document.getElementById("continueBtn"),this.searchInput=document.getElementById("searchInput"),D.debug("_cacheElements",`Cached elements: accountsTable=${!!this.accountsTable}, importBtn=${!!this.importBtn}, searchInput=${!!this.searchInput}`),D.log("_cacheElements","DOM elements cached successfully")}catch(e){D.error("_cacheElements","Error caching DOM elements:",e)}finally{D.groupEnd("_cacheElements")}}_initializeModals(){D.group("_initializeModals","AccountReviewController._initializeModals()");try{D.log("_initializeModals","Initializing modal instances"),this.filtersModal=new rt(this.filters,()=>this._onFiltersApplied(),()=>this._onFiltersReset()),D.debug("_initializeModals","FiltersModal initialized"),this.bulkRenameModal=new ot(this.accounts,()=>this._renderTable()),D.debug("_initializeModals","BulkRenameModal initialized"),this.bulkTypeModal=new st(this.accounts,()=>this._renderTable()),D.debug("_initializeModals","BulkTypeModal initialized"),D.log("_initializeModals","All modals initialized successfully")}catch(e){D.error("_initializeModals","Error initializing modals:",e)}finally{D.groupEnd("_initializeModals")}}_setupEventListeners(){D.group("_setupEventListeners","Setting up event listeners");let e;this.searchInput.addEventListener("input",()=>{clearTimeout(e),e=setTimeout(()=>{this.filters.searchQuery=this.searchInput.value.toLowerCase(),this._renderTable()},200)}),setTimeout(()=>{document.getElementById("filtersBtn")?.addEventListener("click",t=>{t.preventDefault(),this.filtersModal.open()})},100),this._setupBulkActionListeners(),this.accountsTable.addEventListener("selectionchange",t=>this._handleTableSelectionChange(t)),this.importBtn.addEventListener("click",()=>se("/method")),this._setupUndoListeners(),setTimeout(async()=>{this._updateFilterDisplay();let t=this.accounts.length();this._updateAccountCountDisplay(t,t)},100),D.groupEnd("_setupEventListeners")}_setupBulkActionListeners(){D.group("_setupBulkActionListeners","AccountReviewController._setupBulkActionListeners()");try{[{selectors:["#unselectAllBtnMobile","#unselectAllBtnDesktop"],handler:()=>this._updateAccountSelection(!1),name:"Unselect All"},{selectors:["#bulkIncludeBtnMobile","#bulkIncludeBtnDesktop"],handler:()=>this._updateInclusion(!0),name:"Bulk Include"},{selectors:["#bulkExcludeBtnMobile","#bulkExcludeBtnDesktop"],handler:()=>this._updateInclusion(!1),name:"Bulk Exclude"},{selectors:["#bulkRenameBtnMobile","#bulkRenameBtnDesktop"],handler:()=>this.bulkRenameModal.open(),name:"Bulk Rename"},{selectors:["#bulkTypeBtnMobile","#bulkTypeBtnDesktop"],handler:()=>this.bulkTypeModal.open(),name:"Bulk Type"}].forEach(t=>{t.selectors.forEach(n=>{let r=document.getElementById(n.slice(1));r&&(r.addEventListener("click",t.handler),D.debug("_setupBulkActionListeners",`Event listener attached to ${n}`))})}),D.log("_setupBulkActionListeners","All bulk action listeners set up successfully")}catch(e){D.error("_setupBulkActionListeners","Error setting up bulk action listeners:",e)}finally{D.groupEnd("_setupBulkActionListeners")}}_setupUndoListeners(){D.group("_setupUndoListeners","AccountReviewController._setupUndoListeners()");try{let e=document.getElementById("undoAllBtn");e&&(e.addEventListener("click",()=>{D.log("_setupUndoListeners","Undo all button clicked"),confirm("Are you sure you want to undo all changes? This action cannot be reversed.")?(D.debug("_setupUndoListeners","User confirmed undo all changes"),this._undoAllChanges()):D.debug("_setupUndoListeners","User cancelled undo all changes")}),D.debug("_setupUndoListeners","Undo all button listener attached")),this.accountsTable.addEventListener("click",t=>{let n=t.target.closest("[data-undo-button]");n&&(D.debug("_setupUndoListeners",`Undo button clicked for row ${n.dataset.rowId}`),this._undoRowChanges(n.dataset.rowId))}),D.log("_setupUndoListeners","Undo listeners set up successfully")}catch(e){D.error("_setupUndoListeners","Error setting up undo listeners:",e)}finally{D.groupEnd("_setupUndoListeners")}}_handleTableSelectionChange(e){D.group("_handleTableSelectionChange","AccountReviewController._handleTableSelectionChange()",{detail:e.detail});try{let t=e.detail.count,n=document.getElementById("bulkActionBar");D.log("_handleTableSelectionChange",`Selection changed: ${t} account(s) selected`),document.getElementById("selectedCountMobile").textContent=t,document.getElementById("selectCountMobileLabel").textContent=t===1?"Account":"Accounts",document.getElementById("selectedCountDesktop").textContent=t,document.getElementById("selectCountDesktopLabel").textContent=t===1?"Account":"Accounts",D.debug("_handleTableSelectionChange","Selection count displays updated"),this.accounts.forEach(r=>{r.selected=e.detail.selectedRows.some(s=>s.id===r.id)}),D.debug("_handleTableSelectionChange",`Account selected states updated: ${e.detail.selectedRows.map(r=>r.id).join(", ")||"none"}`),t>0?(n.classList.remove("hidden"),n.classList.add("flex"),D.debug("_handleTableSelectionChange","Bulk action bar shown")):(n.classList.add("hidden"),n.classList.remove("flex"),D.debug("_handleTableSelectionChange","Bulk action bar hidden"))}catch(t){D.error("_handleTableSelectionChange","Error handling selection change:",t)}finally{D.groupEnd("_handleTableSelectionChange")}}_setupTableColumns(){let e="_setupTableColumns";console.group(e),this.accountsTable.columns=[{key:"select",type:"checkbox",header:"",width:"60px",masterCheckbox:!0,disabled:t=>{D.group(e,"Determining disabled state for select checkbox",{accountId:t.id});let n=t.migrationStatus===pe.COMPLETED;return D.groupEnd(e),n},mobileHidden:!0},{key:"name",type:"text",header:"Account Name",minWidth:"200px",cellClass:"px-2 py-2 max-w-[300px]",disabled:t=>{D.group(e,"Determining disabled state for name",{accountId:t.id});let n=t.migrationStatus===pe.COMPLETED;return D.groupEnd(e),n},clickable:t=>{D.group(e,"Determining clickable state for name",{accountId:t.id});let n=t.migrationStatus!==pe.COMPLETED;return D.groupEnd(e),n},getValue:t=>t.name,tooltip:t=>{D.group(e,"Getting tooltip for name",{accountId:t.id});let n=t.migrationStatus===pe.COMPLETED?t.name:`Click to rename '${t.name}'`;return D.groupEnd(e),n},onClick:t=>{D.group(e,"Handling name click",{accountId:t.id}),t.migrationStatus!==pe.COMPLETED&&this._openNameEditor(t),D.groupEnd(e)},mobileLabel:!1,mobileClass:"mb-2"},{key:"type",type:"select",header:"Type",minWidth:"150px",getValue:t=>t.monarchType,options:De.data.map(t=>({value:t.typeName,label:t.typeDisplay})),disabled:t=>{D.group(e,"Determining disabled state for type",{accountId:t.id});let n=t.migrationStatus===pe.COMPLETED;return D.groupEnd(e),n},tooltip:t=>{D.group(e,"Getting tooltip for type",{accountId:t.id});let n=Ce(t.monarchType)?.typeDisplay||"";return D.groupEnd(e),n},onChange:async(t,n)=>{D.group(e,"Handling type change",{accountId:t.id,newType:n});let r=Ce(n),s=r?.subtypes[0]?.name||null;t.monarchType=r?.typeName||null,t.monarchSubtype=s,requestAnimationFrame(()=>this.accountsTable.updateRow(t.id)),D.groupEnd(e)},mobileLabel:"Type"},{key:"subtype",type:"select",header:"Subtype",minWidth:"150px",getValue:t=>t.monarchSubtype||"",options:t=>{D.group(e,"Getting options for subtype",{accountId:t.id});let r=(Ce(t.monarchType)?.subtypes||[]).map(s=>({value:s.name,label:s.display}));return D.groupEnd(e),r},disabled:t=>{D.group(e,"Determining disabled state for subtype",{accountId:t.id});let n=t.migrationStatus===pe.COMPLETED;return D.groupEnd(e),n},tooltip:t=>{D.group(e,"Getting tooltip for subtype",{accountId:t.id});let n=Ue(t.monarchType,t.monarchSubtype)?.display||"";return D.groupEnd(e),n},onChange:async(t,n)=>{D.group(e,"Handling subtype change",{accountId:t.id,newSubtype:n}),t.monarchSubtype=n,requestAnimationFrame(()=>this.accountsTable.updateRow(t.id)),D.groupEnd(e)},mobileLabel:"Subtype"},{key:"transactionCount",type:"text",header:"Transactions",minWidth:"100px",getValue:t=>t.transactionCount,tooltip:t=>{D.group(e,"Getting tooltip for transactionCount",{accountId:t.id});let n=`${t.transactionCount} transaction${t.transactionCount!==1?"s":""}`;return D.groupEnd(e),n},cellStyle:t=>{D.group(e,"Determining cellStyle for transactionCount",{accountId:t.id});let n=t.migrationStatus===pe.COMPLETED?{color:"#9ca3af"}:{color:"#727985ff"};return D.groupEnd(e),n},mobileLabel:"Txns"},{key:"balance",type:"text",header:"Balance",minWidth:"120px",getValue:t=>Gt.format(t.balance),tooltip:t=>`Balance: ${Gt.format(t.balance)}`,cellStyle:t=>{D.group(e,"Determining cellStyle for balance",{accountId:t.id});let n=t.migrationStatus===pe.COMPLETED?{color:"#9ca3af"}:{color:"#727985ff"};return D.groupEnd(e),n},mobileLabel:"Balance"},{key:"undo",type:"custom",header:"",width:"50px",render:t=>{D.group(e,"Rendering 'undo' button for account",{accountId:t.id});let n=document.createElement("div");if(n.className="flex items-center justify-center",t.isModified){let r=document.createElement("button");r.className="p-1.5 rounded hover:bg-amber-100 transition-colors",r.title="Undo changes",r.innerHTML=`
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            `,r.addEventListener("click",()=>this._undoRowChanges(t.id)),n.appendChild(r)}return D.groupEnd(e),n},mobileHidden:!0},{key:"included",type:"button",header:"Migrate?",minWidth:"100px",render:t=>{D.group(e,"Rendering 'included' button for account",{accountId:t.id});let n=t.migrationStatus===pe.COMPLETED,r={text:n?"Migrated":t.included?"Included":"Excluded",type:"outline",color:n?"grey":t.included?"green":"red",size:"small",disabled:n,tooltip:n?"This account has already been processed":t.included?"Click to exclude":"Click to include",onClick:s=>{s.included=!s.included,requestAnimationFrame(()=>this.accountsTable.updateRow(s.id))}};return D.groupEnd(e),r},mobileLabel:"Migrate"}],console.groupEnd(e)}async _renderTable(){D.group("_renderTable","AccountReviewController._renderTable()");let e=this.accounts.getVisible(this.filters);D.debug("_renderTable","visible accounts:",e),this.accountsTable.data=e,this._updateAccountCountDisplay(e.length,this.accounts.length());let t=this.accounts.getIncludedAndUnprocessed().length>0;_e(this.importBtn,!t),this.importBtn.title=this.importBtn.disabled?"At least one account must be included to proceed":"",t?this.importBtn.textContent=`Migrate ${this.accounts.getIncludedAndUnprocessed().length} of ${this.accounts.length()} account${this.accounts.length()!==1?"s":""}`:this.importBtn.textContent="Continue",this._updateChangesAlert(),D.groupEnd("_renderTable")}_openNameEditor(e){D.group("_openNameEditor","AccountReviewController._openNameEditor()"),D.log("_openNameEditor",`Opening name editor for account ${e.id}: "${e.current.name}"`);try{new at(e,()=>{D.debug("_openNameEditor","Name editor closed, refreshing table"),this.accountsTable.refresh()}).open(),D.log("_openNameEditor","Name editor opened successfully")}catch(t){D.error("_openNameEditor","Error opening name editor:",t)}finally{D.groupEnd("_openNameEditor")}}async _updateInclusion(e){D.group("_updateInclusion","AccountReviewController._updateInclusion()",{include:e}),D.log("_updateInclusion",`Updating inclusion status to ${e?"included":"excluded"}`),e?await this.accounts.includeAll():await this.accounts.excludeAll(),await this._renderTable(),D.groupEnd("_updateInclusion")}_updateAccountSelection(e){D.group("_updateAccountSelection","AccountReviewController._updateAccountSelection()",{shouldSelect:e});try{let t=e?"selecting":"deselecting";D.log("_updateAccountSelection",`${t.charAt(0).toUpperCase()+t.slice(1)} all ${this.accounts.length()} accounts`),e?this.accounts.selectAll():this.accounts.deselectAll(),D.debug("_updateAccountSelection",`All accounts now ${e?"selected":"deselected"}`),this._renderTable(),D.log("_updateAccountSelection","Account selection updated and table re-rendered")}catch(t){D.error("_updateAccountSelection","Error updating account selection:",t)}finally{D.groupEnd("_updateAccountSelection")}}async _undoAllChanges(){D.group("_undoAllChanges","AccountReviewController._undoAllChanges()"),D.log("_undoAllChanges","Undoing all account changes"),await this.accounts.undoAllChanges(),await this._renderTable(),D.groupEnd("_undoAllChanges")}async _undoRowChanges(e){D.group("_undoRowChanges","AccountReviewController._undoRowChanges()",{accountId:e}),D.log("_undoRowChanges",`Undoing changes for account ${e}`),await this.accounts.undoAccountChanges(e),await this._renderTable(),D.groupEnd("_undoRowChanges")}_onFiltersApplied(){D.group("_onFiltersApplied","AccountReviewController._onFiltersApplied()"),D.log("_onFiltersApplied","Filters applied, re-rendering table");try{this._renderTable(),this._updateFilterDisplay(),D.log("_onFiltersApplied","Filter display updated")}catch(e){D.error("_onFiltersApplied","Error applying filters:",e)}finally{D.groupEnd("_onFiltersApplied")}}_onFiltersReset(){D.group("_onFiltersReset","AccountReviewController._onFiltersReset()"),D.log("_onFiltersReset","Filters reset, re-rendering table");try{this._renderTable(),this._updateFilterDisplay(),D.log("_onFiltersReset","Filter display updated")}catch(e){D.error("_onFiltersReset","Error resetting filters:",e)}finally{D.groupEnd("_onFiltersReset")}}_updateFilterDisplay(){D.group("_updateFilterDisplay","AccountReviewController._updateFilterDisplay()");try{let e=document.getElementById("filterNotificationBadge"),t=this.filters.getNumberOfActiveFilters();D.log("_updateFilterDisplay",`Number of active filters: ${t}`),e.classList.toggle("hidden",t===0),e.textContent=t,D.debug("_updateFilterDisplay","Filter badge updated")}catch(e){D.error("_updateFilterDisplay","Error updating filter display:",e)}finally{D.groupEnd("_updateFilterDisplay")}}_updateAccountCountDisplay(e,t){D.group("_updateAccountCountDisplay","AccountReviewController._updateAccountCountDisplay()");try{D.log("_updateAccountCountDisplay",`Displaying ${e} visible accounts out of ${t} total`),document.getElementById("visibleAccountCount").innerHTML=e,document.getElementById("totalAccountCount").innerHTML=t,D.debug("_updateAccountCountDisplay","Account count displays updated");let n=this.filters.getNumberOfActiveFilters(),r=document.getElementById("filterNotificationBadge");r.textContent=n,r.classList.toggle("hidden",n===0),D.debug("_updateAccountCountDisplay",`Filter count badge set to ${n}`),document.getElementById("filterResultsSummary").classList.toggle("filtered",n>0),D.debug("_updateAccountCountDisplay",`Filter results summary ${n>0?"marked":"unmarked"} as filtered`)}catch(n){D.error("_updateAccountCountDisplay","Error updating account count display:",n)}finally{D.groupEnd("_updateAccountCountDisplay")}}async _updateChangesAlert(){D.group("_updateChangesAlert","AccountReviewController._updateChangesAlert()");let e=document.getElementById("undoAllContainer"),t=await this.accounts.hasChanges();D.log("_updateChangesAlert",`Has changes: ${t}`),e.classList.toggle("hidden",!t),D.debug("_updateChangesAlert",`Undo all container ${t?"shown":"hidden"}`),D.groupEnd("_updateChangesAlert")}};var En;function Zt(){En=new it,En.init()}var In=`<div id="pageLayout"></div>
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
</style>`;function Kt(){ce({navbar:{showBackButton:!0,showDataButton:!0},header:{title:"Step 3: Choose Your Migration Method",description:"Either manually import your accounts into Monarch Money yourself or let us automate the process.",containerId:"pageHeader"}});let o=J.accounts.length(),e=J.accounts._accounts.filter(t=>t.included).length;document.getElementById("totalCountDisplay").textContent=o,document.getElementById("filesCountDisplay").textContent=e,document.getElementById("manualFileCount").textContent=e,document.getElementById("manualFileLabel").textContent=e===1?"file":"files",document.getElementById("manualImportCard").addEventListener("card-click",()=>{se("/manual")}),document.getElementById("autoImportCard").addEventListener("card-click",()=>{se("/login")})}var Bn=`<div id="pageLayout"></div>

<!-- Summary Counts -->
<div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10 
          bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 md:p-8 
          border border-blue-100 w-full max-w-2xl mx-auto shadow-sm mb-12">

  <div class="text-center">
    <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-500" id="totalCountDisplay">0</div>
    <div class="text-gray-500 text-xs sm:text-sm md:text-base font-medium">Total Accounts</div>
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
  <clickable-card id="manualImportCard" data-color="blue" data-width="full">
    <svg slot="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
    <svg slot="arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
    <h3 slot="title">Manual Import</h3>
    <p slot="description">
      Download <span id="manualFileCount" class="font-semibold text-blue-600">0</span> CSV <span id="manualFileLabel">files</span> and upload them
      into Monarch Money yourself, one by one.
    </p>
    <span slot="action">Select Manual Import</span>
  </clickable-card>

  <!-- Auto Import -->
  <clickable-card id="autoImportCard" data-color="green" data-width="full">
    <svg slot="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    <svg slot="arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
    <h3 slot="title">Auto Import</h3>
    <p slot="description">
      Connect your Monarch Money account and automatically import your selected accounts.
    </p>
    <span slot="action">Select Auto Import</span>
  </clickable-card>

</div>`;var Ln=Ir(Mn(),1);function bt(o,e){let t='"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"',n=e.map(r=>`"${r.Date}","${r.Merchant}","${r.Category}","${o}","","${r.Notes}","${r.Amount}","${r.Tags}"`);return[t,...n].join(`
`)}async function Dn({maxRowsPerFile:o=1e3}={}){let e=J.accounts._accounts.filter(r=>r.included),t=new Ln.default;return e.forEach(r=>{let s=(r.current.name||"").replace(/[\\/:*?"<>|]/g,"_"),a=r.transactions||[],c=a.length;if(c<=o){let b=bt(r.current.name,a);t.file(`${s}.csv`,b)}else{let b=Math.ceil(c/o);for(let g=0;g<b;g++){let x=g*o,u=x+o,f=a.slice(x,u),d=bt(r.current.name,f);t.file(`${s}_part${g+1}.csv`,d)}}}),await t.generateAsync({type:"blob"})}function Xt(){ce({navbar:{showBackButton:!0,showDataButton:!0},header:{title:"Step 4: Manual Migration",description:"A step-by-step guide to manually importing your YNAB data into Monarch Money.",containerId:"pageHeader"}});let o=document.getElementById("downloadBtn"),e=document.getElementById("switchToAuto");o.addEventListener("click",async t=>{t.preventDefault();try{let n=await Dn(),r=document.createElement("a");r.href=URL.createObjectURL(n),r.download="accounts_export.zip",r.click()}catch(n){console.error("\u274C ZIP generation failed",n),alert("Failed to generate ZIP file.")}}),e.addEventListener("click",()=>se("/login"))}var Nn=`<div id="pageLayout"></div>

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

</section>`;var be=[];for(let o=0;o<256;++o)be.push((o+256).toString(16).slice(1));function On(o,e=0){return(be[o[e+0]]+be[o[e+1]]+be[o[e+2]]+be[o[e+3]]+"-"+be[o[e+4]]+be[o[e+5]]+"-"+be[o[e+6]]+be[o[e+7]]+"-"+be[o[e+8]]+be[o[e+9]]+"-"+be[o[e+10]]+be[o[e+11]]+be[o[e+12]]+be[o[e+13]]+be[o[e+14]]+be[o[e+15]]).toLowerCase()}var Qt,fo=new Uint8Array(16);function en(){if(!Qt){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");Qt=crypto.getRandomValues.bind(crypto)}return Qt(fo)}var go=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),tn={randomUUID:go};function bo(o,e,t){if(tn.randomUUID&&!e&&!o)return tn.randomUUID();o=o||{};let n=o.random??o.rng?.()??en();if(n.length<16)throw new Error("Random bytes length must be >= 16");if(n[6]=n[6]&15|64,n[8]=n[8]&63|128,e){if(t=t||0,t<0||t+16>e.length)throw new RangeError(`UUID byte range ${t}:${t+15} is out of buffer bounds`);for(let r=0;r<16;++r)e[t+r]=n[r];return e}return On(n)}var yt=bo;var lt="/.netlify/functions/",He={login:lt+"monarchLogin",fetchAccounts:lt+"fetchMonarchAccounts",createAccounts:lt+"createMonarchAccounts",generateStatements:lt+"generateStatements",getUploadStatus:lt+"getUploadStatus"};async function ct(o,e){let t=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),n=await t.json();if(!t.ok)throw new Error(n.error||n.message||"API error");return n}var Ne={login:(o,e,t,n)=>ct(He.login,{email:o,encryptedPassword:e,deviceUuid:t,otp:n}),fetchMonarchAccounts:o=>ct(He.fetchAccounts,{token:o}),createAccounts:(o,e)=>ct(He.createAccounts,{token:o,accounts:e}),generateAccounts:o=>fetch(He.generateStatements,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accounts:o})}),queryUploadStatus:(o,e)=>ct(He.getUploadStatus,{token:o,sessionKey:e})};var Rn="monarch-app-salt";var nn="AES-GCM";var zn="SHA-256";function xo(...o){let e=o.reduce((r,s)=>r+s.length,0),t=new Uint8Array(e),n=0;for(let r of o)t.set(r,n),n+=r.length;return t}async function Pn(o,e){console.group("encryptPassword");try{let t=new TextEncoder,n=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.importKey("raw",t.encode(o),{name:"PBKDF2"},!1,["deriveKey"]),s=await crypto.subtle.deriveKey({name:"PBKDF2",salt:t.encode(Rn),iterations:1e5,hash:zn},r,{name:nn,length:256},!0,["encrypt"]),a=t.encode(e),c=await crypto.subtle.encrypt({name:nn,iv:n},s,a),b=new Uint8Array(c),g=b.slice(-16),x=b.slice(0,-16),u=xo(n,x,g);return btoa(String.fromCharCode(...u))}catch(t){throw console.error("\u274C Error encrypting password:",t),console.groupEnd("encryptPassword"),new Error("Failed to encrypt password. Please try again.")}}function $n(){let o=J.credentials,e=sessionStorage.getItem("monarch_email"),t=sessionStorage.getItem("monarch_pwd_enc"),n=sessionStorage.getItem("monarch_token"),r=sessionStorage.getItem("monarch_uuid");return J.setCredentials({email:o.email||e,encryptedPassword:o.encryptedPassword||t,apiToken:o.apiToken||n,deviceUuid:o.deviceUuid||r,remember:!1}),(!o.deviceUuid||o.deviceUuid==="")&&(o.deviceUuid=yt(),sessionStorage.setItem("monarch_uuid",o.deviceUuid)),{creds:o}}async function jn({emailInput:o,passwordInput:e,creds:t,UI:n}){let r=o.trim()||sessionStorage.getItem("monarch_email"),s=e.trim(),a=t.encryptedPassword||sessionStorage.getItem("monarch_pwd_enc"),c=t.deviceUuid||sessionStorage.getItem("monarch_uuid");if(!a&&s)try{a=await Pn(r,s)}catch{return{error:"Failed to encrypt password."}}try{let b=await Ne.login(r,a,c);return b?.otpRequired?(J.saveToLocalStorage({email:r,encryptedPassword:a,uuid:c,remember:t.remember,tempForOtp:!t.remember}),J.setCredentials({awaitingOtp:!0}),{otpRequired:!0}):b?.token?(J.setCredentials({email:r,encryptedPassword:a,otp:"",remember:n.rememberCheckbox.checked,apiToken:b.token,awaitingOtp:!1}),t.remember&&J.saveToLocalStorage({email:r,encryptedPassword:a,token:b.token,remember:!0}),{token:b.token}):{error:b?.detail||b?.error||"Unexpected login response."}}catch(b){return{error:b.message||String(b)}}}function Un(){J.clearLocalStorage(),J.credentials.clear(),J.credentials.deviceUuid=yt(),J.saveToLocalStorage({uuid:J.credentials.deviceUuid})}async function rn(){ce({navbar:{showBackButton:!0,showDataButton:!0},header:{title:"Step 4: Auto Migration",description:"Authorize your Monarch account so we can directly import your accounts and transactions.",containerId:"pageHeader"}});let o=f=>document.getElementById(f),e={emailInput:o("email"),passwordInput:o("password"),connectBtn:o("connectBtn"),backBtn:o("backBtn"),form:o("credentialsForm"),errorBox:o("errorBox"),errorContainer:o("credentialsError"),rememberCheckbox:o("rememberCredentials"),rememberMeContainer:o("rememberMe"),notYouContainer:o("notYouContainer"),rememberedEmail:o("rememberedEmail"),clearCredentialsBtn:o("clearCredentialsBtn"),toggleBtn:o("togglePassword"),eyeShow:o("eyeShow"),eyeHide:o("eyeHide"),securityNoteMsg:o("securityNote"),securityNoteIcon:o("securityNoteIcon")},{creds:t}=$n(J);t.email&&t.encryptedPassword?(e.emailInput.value=t.email,e.passwordInput.value="",e.rememberedEmail.textContent=`Signed in as ${t.email}`,e.rememberCheckbox.checked=t.remember,_e(e.emailInput,!0),_e(e.passwordInput,!0),xe(e.rememberMeContainer,!1),xe(e.notYouContainer,!0),xe(e.toggleBtn,!1),r("signed-in")):(xe(e.notYouContainer,!1),r());function n(){let f=e.emailInput.value.trim(),d=e.passwordInput.value.trim()||t.encryptedPassword;_e(e.connectBtn,!(f&&d)),xe(e.errorContainer,!1)}function r(f){let d={GREEN:"#006400",BLUE:"#1993e5",ORANGE:"#ff8c00"};switch(f){case"remembered":e.securityNoteMsg.innerHTML='Your credentials will be encrypted and saved to this device. <a href="#" data-nav="/data-management" class="text-blue-600 hover:text-blue-800 underline">Manage stored data</a>.',e.securityNoteIcon.setAttribute("fill",d.ORANGE);break;case"signed-in":e.securityNoteMsg.innerHTML='Currently signed in. To use different credentials, click "Not you?" or <a href="#" data-nav="/data-management" class="text-blue-600 hover:text-blue-800 underline">manage your data</a>.',e.securityNoteIcon.setAttribute("fill",d.BLUE);break;default:e.securityNoteMsg.textContent="Your credentials will only be used for this session and will not be saved.",e.securityNoteIcon.setAttribute("fill",d.GREEN)}e.securityNoteMsg.querySelectorAll("[data-nav]").forEach(h=>{h.addEventListener("click",p=>{p.preventDefault();let w=p.target.getAttribute("data-nav");se(w)})})}function s(f){f.preventDefault(),e.connectBtn.click()}async function a(){_e(e.connectBtn,!0),e.connectBtn.textContent="Connecting\u2026",xe(e.errorContainer,!1);let f=await jn({emailInput:e.emailInput.value,passwordInput:e.passwordInput.value,creds:t,UI:e});if(f.error){u(f.error),_e(e.connectBtn,!1),e.connectBtn.textContent="Connect to Monarch";return}if(f.otpRequired)return se("/otp");if(f.token)return se("/complete")}async function c(f){f.preventDefault(),await a()}function b(f){f.preventDefault(),Un(t),e.emailInput.value="",e.passwordInput.value="",e.rememberCheckbox.checked=!1,_e(e.emailInput,!1),_e(e.passwordInput,!1),_e(e.connectBtn,!0),xe(e.toggleBtn,!0),xe(e.notYouContainer,!1),xe(e.rememberMeContainer,!0),r(),e.emailInput.focus()}function g(){t.remember=e.rememberCheckbox.checked,r(t.remember?"remembered":"not-remembered"),(e.emailInput.value.trim()===""?e.emailInput:e.passwordInput.value.trim()===""?e.passwordInput:e.connectBtn).focus()}function x(){let f=e.passwordInput.type==="password";e.passwordInput.type=f?"text":"password",e.toggleBtn.setAttribute("aria-label",f?"Hide password":"Show password"),xe(e.eyeShow,!f),xe(e.eyeHide,f)}function u(f){e.errorBox.textContent=f,xe(e.errorContainer,!0)}e.form.addEventListener("submit",s),e.connectBtn.addEventListener("click",c),e.clearCredentialsBtn.addEventListener("click",b),e.rememberCheckbox.addEventListener("change",g),e.toggleBtn.addEventListener("click",x),[e.emailInput,e.passwordInput].forEach(f=>{f.addEventListener("input",n),f.addEventListener("focus",()=>f.classList.add("ring-2","ring-blue-500","outline-none")),f.addEventListener("blur",()=>f.classList.remove("ring-2","ring-blue-500","outline-none"))}),n()}var Hn=`<div id="pageLayout"></div>

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
</style>`;function qn(o){let{credentials:e}=o,t=sessionStorage.getItem("monarch_email"),n=sessionStorage.getItem("monarch_pwd_enc"),r=sessionStorage.getItem("monarch_uuid");return o.setCredentials({email:e.email||t,encryptedPassword:e.encryptedPassword||n,deviceUuid:e.deviceUuid||r,remember:!1}),{email:t,encryptedPassword:n,uuid:r}}async function Yn(o){let e=await Ne.login(o.email,o.encryptedPassword,o.deviceUuid,o.otp);return e?.token?(J.setCredentials({apiToken:e.token,awaitingOtp:!1}),sessionStorage.setItem("monarch_email",o.email),sessionStorage.setItem("monarch_pwd_enc",o.encryptedPassword),sessionStorage.setItem("monarch_uuid",o.deviceUuid),sessionStorage.setItem("monarch_token",e.token),{success:!0}):{success:!1}}function Vn(){sessionStorage.removeItem("monarch_email"),sessionStorage.removeItem("monarch_pwd_enc"),sessionStorage.removeItem("monarch_uuid"),sessionStorage.removeItem("monarch_token"),sessionStorage.removeItem("monarch_otp")}function on(){ce({navbar:{showBackButton:!0,showDataButton:!0},header:{title:"Step 5: Enter Your Verification Code",description:"Monarch has sent a 6-digit verification code to your email address. Enter it below to continue with the secure import process.",containerId:"pageHeader"}});let o=g=>document.getElementById(g),e={otpInput:o("otpInput"),submitOtpBtn:o("submitOtpBtn"),otpError:o("otpError"),backBtn:o("backBtn")},{credentials:t}=J,{storage:n,tempForOtp:r}=qn(J);if(!t.email||!t.encryptedPassword)return console.warn("Missing credentials for OTP flow, redirecting to login"),se("/credentials",!0);async function s(g){console.group("MonarchOtpView"),g.preventDefault(),xe(e.otpError,!1),t.otp=e.otpInput.value;try{if((await Yn(t)).success)return console.groupEnd("MonarchOtpView"),se("/complete",!0);throw new Error("Unknown login response.")}catch(x){xe(e.otpError,!0),e.otpError.textContent="Invalid OTP. Please try again.",console.error("\u274C OTP verification error",x),console.groupEnd("MonarchOtpView")}}function a(){Vn(),Xe()}function c(){e.otpInput.value=e.otpInput.value.replace(/\D/g,"").slice(0,6),_e(e.submitOtpBtn,e.otpInput.value.length!==6)}function b(g){g.key==="Enter"&&e.otpInput.value.length===6&&e.submitOtpBtn.click()}e.otpInput.addEventListener("input",c),e.otpInput.addEventListener("keydown",b),e.submitOtpBtn.addEventListener("click",s),e.backBtn.addEventListener("click",a),_e(e.submitOtpBtn,!0)}var Wn=`<div id="pageLayout"></div>

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

</div>`;function Gn(o){o.accounts.accounts.forEach(e=>{e.status||(e.status="pending")})}function Zn(o){return o.accounts.accounts.filter(e=>e.included&&e.status!=="completed").map(e=>({id:e.id,name:e.current.name,modifiedName:e.current.name,type:e.current.type,subtype:e.current.subtype,transactions:e.transactions,balance:e.balance,included:e.included,status:e.status}))}function Kn(o,e=5){let t=[];for(let n=0;n<o.length;n+=e)t.push(o.slice(n,n+e));return t}async function Jn(o,e){return await Ne.createAccounts(o,e)}function Xn(o,e){e.forEach(t=>{let n=o.accounts.accounts.find(r=>r.current.name===t.modifiedName);n&&(n.status="processing")})}function Qn(o,e,t){e.forEach(n=>{let r=o.accounts.accounts.find(s=>s.current.name===n.modifiedName);r&&(r.status="failed",r.errorMessage=t)})}function er(o,e){e.forEach(t=>{let n=o.accounts.accounts.find(r=>r.current.name===t.modifiedName);n&&n.status==="processing"&&(n.status="failed",n.errorMessage="Account not processed by server")})}function tr(o,e,t){t.failed&&t.failed.length>0&&t.failed.forEach(n=>{let r=e.find(s=>s.modifiedName===n.name);if(r){let s=o.accounts.accounts.find(a=>a.current.name===r.modifiedName);s&&(s.status="failed",s.errorMessage=n.error||"Account creation failed")}}),t.success&&t.success.length>0&&t.success.forEach(n=>{let r=e.find(s=>s.modifiedName===n.name);if(r){let s=o.accounts.accounts.find(a=>a.current.name===r.modifiedName);s&&(s.status="uploading",s.sessionKeys=n.sessionKeys||[])}})}function ko(){ce({navbar:{showBackButton:!0,showDataButton:!0},header:{title:"Migration Status",containerId:"pageHeader"}});let o=document.getElementById("resultsContainer"),e=document.getElementById("accountList"),t=document.getElementById("actionButtonsContainer"),n=document.getElementById("header"),r=document.getElementById("subheader"),s=document.getElementById("overallStatus");document.getElementById("visitMonarchBtn").addEventListener("click",()=>window.open("https://app.monarchmoney.com","_blank")),document.getElementById("retryFailedBtn").addEventListener("click",()=>m());let a=document.getElementById("loadingContainer");a&&(a.style.display="none"),o&&(o.style.display="block",o.style.opacity="1"),c();function c(){Gn(J),u(),f(),d(),b()}async function b(){let p=J.credentials.apiToken;if(!p){console.error("No API token available"),J.accounts._accounts.forEach(k=>{k.included&&(k.status="failed",k.errorMessage="Authentication required. Please login again.")}),u(),f(),d();return}let w=Zn(J);if(w.length===0){console.log("No accounts to process"),u(),d();return}let A=Kn(w,5);for(let k=0;k<A.length;k++){let M=A[k];Xn(J,M),u(),f(),await g(p,M),k<A.length-1&&await new Promise(I=>setTimeout(I,1e3))}u(),f(),d()}async function g(h,p){try{let w=await Jn(h,p);if(w&&(w.success||w.failed))tr(J,p,w),w.success&&w.success.length>0&&(u(),f(),await Promise.all(w.success.map(async A=>{let k=p.find(M=>M.modifiedName===A.name);if(k&&A.sessionKeys){let M=J.accounts._accounts.find(I=>I.current.name===k.modifiedName);if(M)try{await x(h,k.modifiedName,A.sessionKeys),M.status="completed"}catch(I){M.status="failed",M.errorMessage=I.message||"Transaction upload failed"}}}))),er(J,p);else{let A=w.error||"Failed to create accounts in Monarch Money";Qn(J,p,A)}}catch{p.forEach(A=>{let k=J.accounts._accounts.find(M=>M.current.name===A.modifiedName);k&&(k.status="failed",k.errorMessage="Network error. Please check your connection and try again.")})}}async function x(h,p,w){await Promise.all(w.map(async A=>{let k=0,M=60;for(;k<M;)try{let I=await Ne.queryUploadStatus(h,A);if(I.data?.uploadStatementSession){let F=I.data.uploadStatementSession,B=F.status;if(B==="completed")return;if(B==="failed"||B==="error"){let j=F.errorMessage||"Transaction upload failed";throw new Error(j)}}await new Promise(F=>setTimeout(F,5e3)),k++}catch(I){if(k++,k>=M)throw I;await new Promise(F=>setTimeout(F,5e3))}throw new Error(`Upload status check timed out for account ${p}`)}))}function u(){let p=(J.accounts?._accounts||[]).filter(_=>_.included),w=p.length,A=p.filter(_=>_.status==="completed").length,k=p.filter(_=>_.status==="failed").length,M=p.filter(_=>_.status==="processing").length,I=p.filter(_=>_.status==="uploading").length,F=w-A-k-M-I,B="Processing...",j="Please wait while we process your accounts.",K="\u23F3";M>0?(B="Creating accounts...",j=`Creating ${M} account${M!==1?"s":""}. Please wait.`,K="\u23F3"):I>0?(B="Uploading transactions...",j=`Uploading transactions for ${I} account${I!==1?"s":""}. Please wait.`,K="\u{1F4E4}"):F===0&&(k===0?(B="All accounts migrated successfully!",j=`Successfully created ${A} account${A!==1?"s":""} in Monarch Money.`,K="\u2705"):A===0?(B="Migration failed for all accounts",j="None of your accounts could be migrated. Please try again.",K="\u274C"):(B="Migration completed with some failures",j=`${A} successful, ${k} failed. You can retry the failed accounts.`,K="\u26A0\uFE0F")),n&&(n.textContent=B),r&&(r.textContent=j),s&&(s.innerHTML=`<div class="text-6xl">${K}</div>`)}function f(){if(!e)return;let h=J.accounts?._accounts||[];e.innerHTML="",h.forEach(p=>{if(!p.included)return;let w=document.createElement("div");w.className="bg-white border border-gray-200 rounded-lg p-4";let A="",k="",M="";switch(p.status){case"completed":A="\u2705",k="text-green-600",M="Successfully migrated";break;case"failed":A="\u274C",k="text-red-600",M=p.errorMessage||"Migration failed";break;case"processing":A="\u23F3",k="text-blue-600",M="Creating account...";break;case"uploading":A="\u{1F4E4}",k="text-purple-600",M="Uploading transactions...";break;default:A="\u23F3",k="text-gray-600",M="Pending"}let I="Unknown Type";if(p.current.type){let F=Ce(p.current.type);if(F&&(I=F.typeDisplay||F.displayName||F.display,p.current.subtype)){let B=Ue(p.current.type,p.current.subtype);B&&(I=B.display||B.displayName)}}else console.log(`Account ${p.id} has no type property`);w.innerHTML=`
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0 pr-4">
            <div class="font-medium text-gray-900 mb-1">${p.current.name||"Unknown Account"}</div>
            <div class="text-sm text-gray-500">${I}</div>
            ${p.monarchAccountId?`<div class="text-xs text-gray-400 mt-1">Monarch ID: ${p.monarchAccountId}</div>`:""}
          </div>
          <div class="flex-shrink-0">
            <span class="text-2xl">${A}</span>
          </div>
        </div>
        <div class="pt-2 border-t border-gray-100">
          <div class="${k} text-sm font-medium leading-relaxed">${M}</div>
        </div>
      `,e.appendChild(w)})}function d(){if(!t)return;let h=J.accounts||{},p=h.filter(A=>A.included&&A.status==="failed"),w=h.filter(A=>A.included&&A.status==="completed");document.getElementById("retryFailedBtn").hidden=p.length===0,document.getElementById("visitMonarchBtn").hidden=w.length<=0}function m(){let h=J.accounts._accounts.filter(p=>p.included&&p.status==="failed");h.length!==0&&(h.forEach(p=>{p.status="pending",delete p.errorMessage}),u(),f(),d(),b())}}var nr=ko;var rr=`<div id="pageLayout"></div>

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
</section>`;async function sn(){ce();let o=document.getElementById("loadingSpinner"),e=document.getElementById("successIcon"),t=document.getElementById("errorIcon"),n=document.getElementById("statusTitle"),r=document.getElementById("statusMessage"),s=document.getElementById("manualRedirectContainer"),a=document.getElementById("continueBtn");try{n.textContent="Processing...",r.innerHTML="We're fetching your account data now.</br>You should be redirected automatically.",await Vt.handleOauthCallback();let c=await Vt.getAllData();console.log("Fetched accounts after OAuth callback:",c),await c.saveToDb(),o.hidden=!0,e.hidden=!1,n.textContent="We got your data!",r.innerHTML="Still here? Sorry, sometimes redirections don't work.</br>Click the button below to review your data.",setTimeout(()=>{se("/review",!0)},1500),a.textContent="Review your Data",a.addEventListener("click",()=>{se("/review",!0)}),setTimeout(()=>{s.hidden=!1},1500)}catch(c){console.error(c),o.hidden=!0,t.hidden=!1,n.textContent="Connection Failed",r.textContent="Try connecting to YNAB again.",a.textContent="Try Again",a.setAttribute("data-color","black"),a.updateStyle(),a.addEventListener("click",()=>{se("/upload",!0)}),s.hidden=!1}}var or=`<div id="pageLayout"></div>

<!-- Content -->
<div class="flex flex-col items-center justify-center text-center space-y-6 py-12">

  <!-- Loading Spinner (shown by default) -->
  <div id="loadingSpinner" class="relative w-20 h-20">
    <div class="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
    <div class="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
  </div>

  <!-- Status Icons (hidden by default) -->
  <div id="successIcon" hidden
    class="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600">
    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  </div>

  <div id="errorIcon" hidden class="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600">
    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </div>

  <!-- Status Message -->
  <div class="space-y-2">
    <h2 id="statusTitle" class="text-2xl sm:text-3xl font-bold text-gray-900">
      Placeholder Title
    </h2>
    <p id="statusMessage" class="text-base sm:text-lg text-gray-600 max-w-md">
      Placeholder message
    </p>
  </div>

  <!-- Manual Redirect Button (hidden by default) -->
  <div id="manualRedirectContainer" hidden>
    <ui-button id="continueBtn" data-type="solid" data-size="large" data-color="blue">
      Placeholder btn
    </ui-button>
  </div>
</div>`;var Co="/.netlify/functions/ynabAuthStatus",Eo=Object.freeze({authenticated:!1,hasAccessToken:!1,hasRefreshToken:!1}),dt=null,vt=null;async function sr(){return dt||(vt||(vt=(async()=>{try{let o=await fetch(Co,{headers:{"Cache-Control":"no-store"}});if(!o.ok)throw new Error(`Status ${o.status}`);let e=await o.json();dt={authenticated:Boolean(e.authenticated),hasAccessToken:Boolean(e.hasAccessToken),hasRefreshToken:Boolean(e.hasRefreshToken)}}catch(o){console.warn("Unable to fetch YNAB auth status",o),dt=Eo}finally{vt=null}return dt})()),vt)}async function ar(){let o=J.hasAccounts()?J.getAccountsSingleton().length():0,e=await sr(),t=!!J.credentials?.apiToken,n=o>0||e.authenticated||t;return{accountCount:o,hasYnabAuth:e.authenticated,hasMonarchAuth:t,hasData:n}}async function ir(){let o=await sr(),e=!!J.getPersistedAccounts(),t=!!sessionStorage.getItem("monarch_accounts"),n=!!sessionStorage.getItem("monarch_api_token"),r=!!sessionStorage.getItem("monarch_device_uuid"),s=!!sessionStorage.getItem("ynab_oauth_expected_state"),a=e||t||n||r||s||o.hasAccessToken||o.hasRefreshToken;return{ynabAuth:o,hasYnabAccounts:e,hasMonarchAccounts:t,hasMonarchToken:n,hasMonarchUuid:r,hasExpectedState:s,hasAnyData:a}}function lr(){let o=!!sessionStorage.getItem("monarch_email"),e=!!sessionStorage.getItem("monarch_pwd_enc"),t=!!sessionStorage.getItem("monarch_token"),n=!!sessionStorage.getItem("monarch_uuid"),r=!1,s=J.loadAppState(),a=null,c=null;s&&(a=s.lastPath,c=s.timestamp);let b=o||e||t||n;return{hasMonarchEmail:o,hasMonarchPassword:e,hasMonarchToken:t,hasMonarchUuid:n,rememberMe:r,lastPath:a,lastPathTimestamp:c,hasCredentials:b,hasAnyData:b||r||a}}function cr(o){let e={exportedAt:new Date().toISOString(),state:o,sessionStorage:{},localStorage:{}};for(let s=0;s<sessionStorage.length;s++){let a=sessionStorage.key(s);try{e.sessionStorage[a]=JSON.parse(sessionStorage.getItem(a))}catch{e.sessionStorage[a]=sessionStorage.getItem(a)}}for(let s=0;s<localStorage.length;s++){let a=localStorage.key(s);try{e.localStorage[a]=JSON.parse(localStorage.getItem(a))}catch{e.localStorage[a]=localStorage.getItem(a)}}let t=JSON.stringify(e,null,2),n=new Blob([t],{type:"application/json"}),r=`ynab-monarch-data-${Date.now()}.json`;return{blob:n,filename:r}}function dr(o){o.clearLocalStorage(),ur(),sessionStorage.clear(),o.credentials.clear(),o.clearAccounts(),o.oauth.clear()}function an(){ce({navbar:{showBackButton:!0,showDataButton:!1},header:{title:"Data Management",description:"View and manage all data stored in your browser. This includes session data, local storage, and application state.",containerId:"pageHeader"}}),hr(),pr(),mr(),document.getElementById("exportDataBtn").addEventListener("click",To),document.getElementById("clearAllDataBtn").addEventListener("click",()=>Io("confirmClearModal")),window.toggleCollapse=Bo}function Io(o){let e=document.getElementById(o);e.open(),setTimeout(()=>{let t=e._modalOverlay?.querySelector(".ui-modal-footer"),n=t?.querySelector("#cancelBtn"),r=t?.querySelector("#applyBtn");n&&(n.onclick=()=>e.close()),r&&(r.onclick=()=>{Mo(),hr(),pr(),mr(),e.close()})},100)}function Bo(o){let e=document.getElementById(o),n=e?.previousElementSibling?.querySelector(".collapse-icon");e&&n&&(e.classList.contains("hidden")?(e.classList.remove("hidden"),n.style.transform="rotate(90deg)"):(e.classList.add("hidden"),n.style.transform="rotate(0deg)"))}async function hr(){let o=document.getElementById("stateDataSection");if(!!o)try{o.innerHTML='<p class="text-gray-500 text-sm italic">Loading\u2026</p>';let{accountCount:e,monarchCount:t,hasYnabAuth:n,hasMonarchAuth:r,hasData:s}=await ar();if(!s){o.innerHTML='<p class="text-gray-500 text-sm italic">No application state data</p>';return}let a=`
      <div class="space-y-3">
        <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-sm text-blue-800 font-medium">Data Summary</p>
        </div>
        
        <div class="space-y-2">
          ${e>0?`
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">YNAB Data</p>
            <p class="text-sm text-gray-600 mt-1">
              \u2713 ${e} account${e!==1?"s":""} imported
            </p>
          </div>
          `:""}

          ${t>0?`
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">Monarch Money Data</p>
            <p class="text-sm text-gray-600 mt-1">
              \u2713 ${t} account${t!==1?"s":""} synced
            </p>
          </div>
          `:""}

          ${n||r?`
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">Authentication Status</p>
            <p class="text-sm text-gray-600 mt-1">
              ${n?"YNAB: \u2713 Connected<br/>":""}
              ${r?"Monarch: \u2713 Connected":""}
            </p>
          </div>
          `:""}
        </div>
      </div>
    `;o.innerHTML=a}catch(e){console.error("Unable to render state data",e),o.innerHTML='<p class="text-red-500 text-sm">Failed to load application state.</p>'}}async function pr(){let o=document.getElementById("sessionStorageSection");if(!!o)try{o.innerHTML='<p class="text-gray-500 text-sm italic">Loading\u2026</p>';let e=await ir();if(!e.hasAnyData){o.innerHTML='<p class="text-gray-500 text-sm italic">No session storage data</p>';return}let t=`
      <div class="space-y-3">
        <div class="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p class="text-sm text-purple-800 font-medium">Session Data Overview</p>
          <p class="text-xs text-purple-700 mt-1">Data in session storage is cleared when this tab closes</p>
        </div>

        <div class="space-y-2">
          ${e.ynabAuth.hasAccessToken||e.ynabAuth.hasRefreshToken?`
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">YNAB Authentication</p>
            <p class="text-sm text-gray-600 mt-1">
              ${e.ynabAuth.hasAccessToken?"Access Token: \u2713 Active (HttpOnly cookie)<br/>":"Access Token: Not Active<br/>"}
              ${e.ynabAuth.hasRefreshToken?"Refresh Token: \u2713 Active (HttpOnly cookie)":"Refresh Token: Not Active"}
            </p>
            <p class="text-xs text-gray-500 mt-2">Tokens never enter sessionStorage\u2014they live in secure HttpOnly cookies managed by Netlify Functions.</p>
          </div>
          `:""}

          ${e.hasYnabAccounts||e.hasMonarchAccounts?`
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">Account Data</p>
            <p class="text-sm text-gray-600 mt-1">
              ${e.hasYnabAccounts?"YNAB Accounts: \u2713 Cached<br/>":""}
              ${e.hasMonarchAccounts?"Monarch Accounts: \u2713 Cached":""}
            </p>
          </div>
          `:""}

          ${e.hasMonarchToken||e.hasMonarchUuid?`
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">Monarch Authentication</p>
            <p class="text-sm text-gray-600 mt-1">
              ${e.hasMonarchToken?"API Token: \u2713 Stored<br/>":""}
              ${e.hasMonarchUuid?"Device UUID: \u2713 Stored":""}
            </p>
          </div>
          `:""}

          ${e.hasExpectedState?`
          <div class="p-3 bg-gray-50 rounded border border-gray-200">
            <p class="text-sm font-medium text-gray-900">OAuth Flow</p>
            <p class="text-sm text-gray-600 mt-1">
              CSRF Token: \u2713 Stored
            </p>
          </div>
          `:""}
        </div>
      </div>
    `;o.innerHTML=t}catch(e){console.error("Unable to render session storage data",e),o.innerHTML='<p class="text-red-500 text-sm">Failed to load session storage data.</p>'}}function mr(){let o=document.getElementById("localStorageSection");if(!o)return;let e=lr();if(!e.hasAnyData){o.innerHTML='<p class="text-gray-500 text-sm italic">No local storage data</p>';return}let t=`
    <div class="space-y-3">
      <div class="p-3 bg-green-50 rounded-lg border border-green-200">
        <p class="text-sm text-green-800 font-medium">Persistent Data Overview</p>
        <p class="text-xs text-green-700 mt-1">Data in local storage persists across browser sessions</p>
      </div>

      <div class="space-y-2">
        ${e.hasCredentials?`
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">Monarch Authentication</p>
          <p class="text-sm text-gray-600 mt-1">
            ${e.hasMonarchEmail?"Email Address: \u2713 Stored<br/>":""}
            ${e.hasMonarchPassword?"Encrypted Password: \u2713 Stored<br/>":""}
            ${e.hasMonarchToken?"API Token: \u2713 Stored<br/>":""}
            ${e.hasMonarchUuid?"Device UUID: \u2713 Stored":""}
          </p>
        </div>
        `:""}

        ${e.rememberMe?`
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">User Preferences</p>
          <p class="text-sm text-gray-600 mt-1">
            Remember Me: \u2713 Enabled
          </p>
        </div>
        `:""}

        ${e.lastPath?`
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">Session Information</p>
          <p class="text-sm text-gray-600 mt-1">
            Last Page: ${Lo(e.lastPath)}<br/>
            Last Visit: ${e.lastPathTimestamp?new Date(e.lastPathTimestamp).toLocaleString():"Not available"}
          </p>
        </div>
        `:""}
      </div>
    </div>
  `;o.innerHTML=t}function To(){let{blob:o,filename:e}=cr(J),t=URL.createObjectURL(o),n=document.createElement("a");n.href=t,n.download=e,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(t)}function Mo(){try{dr(J)}catch(o){console.error("Error clearing data:",o),alert("An error occurred while clearing data. Please try again.")}}function Lo(o){let e=document.createElement("div");return e.textContent=o,e.innerHTML}var fr=`<div id="pageLayout"></div>

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
  <ui-button id="exportDataBtn" data-type="outline" data-color="grey">
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    Export Data (JSON)
  </ui-button>

  <ui-button id="clearAllDataBtn" data-type="solid" data-color="red">
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
    Clear All Data
  </ui-button>
</div>

<!-- Confirmation Modal -->
<ui-modal id="confirmClearModal" has-footer>
  <div slot="title">
    <svg class="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <h3>Clear All Data?</h3>
  </div>
  <div slot="content">
    <p>
      This action cannot be undone. All your YNAB accounts, Monarch credentials, and session data will be
      permanently deleted from your browser.
    </p>
  </div>
  <div slot="footer">
    <ui-button id="cancelBtn" data-type="outline" data-color="grey">Cancel</ui-button>
    <ui-button id="applyBtn" data-type="solid" data-color="red">Yes, wipe my data</ui-button>
  </div>
</ui-modal>`;function gr({question:o,body:e},t){let n=document.createElement("div");n.className="faq-item w-full border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors";let r=document.createElement("button");r.className="faq-toggle w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left",r.dataset.index=String(t),r.innerHTML=`
    <span class="font-semibold text-gray-900">${o}</span>
    <svg class="faq-icon w-5 h-5 text-gray-500 flex-shrink-0 ml-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
  `,n.appendChild(r);let s=document.createElement("div");return s.className="faq-content hidden overflow-hidden max-h-0 transition-all duration-300",s.dataset.index=String(t),s.innerHTML=`
    <div class="px-5 py-4 bg-gray-50 border-t border-gray-200 text-gray-700 text-sm space-y-2">
      ${e}
    </div>
  `,n.appendChild(s),n}var No=[{question:"Does this tool create bank-connected accounts in Monarch Money?",body:`<p>No, not directly; this tool can only create <strong>manual</strong> accounts in Monarch Money. However, there are two solutions:
            <br/><br/>(1) Migrate data to an <strong>existing</strong> bank-connected account.
            <br/><br/>(2) Use this tool to create a new manual account, then in Monarch Money, use their <strong>Transfer</strong> tool to migrate data from the manual account to the bank-connected account.</p>
          <p class="text-xs text-gray-600">Follow Monarch Money's official guide on their Transfer tool to migrate data between accounts: <a href="https://help.monarch.com/hc/en-us/articles/14329385694484-Transfer-Balance-and-or-Transaction-History-to-Another-Account" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">https://help.monarch.com/hc/en-us/articles/14329385694484-Transfer-Balance-and-or-Transaction-History-to-Another-Account</a></p>`},{question:"Is my data secure and private?",body:`<p>Yes, your data is completely secure. We use end-to-end encryption and never store your financial information on our servers. Your data is processed temporarily during migration and then permanently deleted.</p>
          <p class="text-xs text-gray-600">We comply with industry-standard security protocols and are committed to protecting your privacy.</p>`},{question:"How long does the migration process take?",body:`<p>The migration typically takes 5-15 minutes depending on the amount of data in your YNAB account. Most users complete the process in under 10 minutes.</p>
          <p class="text-xs text-gray-600">The actual data transfer is instantaneous; the time is mostly spent reviewing and customizing your accounts.</p>`},{question:"Will my transaction history be preserved?",body:`<p>Yes, all your transaction history, payees, categories, and account information are preserved during migration. You can choose to import historical data or start fresh.</p>
          <p class="text-xs text-gray-600">You have full control over which data to migrate during the review step.</p>`},{question:"Can I migrate only specific accounts?",body:`<p>Absolutely! During the review step, you can select which accounts to migrate and even rename them for Monarch Money. Unselected accounts will be ignored.</p>
          <p class="text-xs text-gray-600">This gives you complete flexibility to customize your migration to match your needs.</p>`},{question:"What if I encounter an error during migration?",body:`<p>If you encounter an error, try the following: refresh the page, clear your browser cache, or use a different browser. Most errors are temporary and resolve on retry.</p>
          <p class="text-xs text-gray-600">If the problem persists, contact our support team for assistance. Your data is always safe and you can restart at any time.</p>`}];function ln(){let e=document.getElementById("pageLayout")?.dataset.backText||"Back to App";ce({navbar:{showBackButton:!0,showDataButton:!1,backText:e},header:{title:"Frequently Asked Questions",description:"Find answers to common questions about the YNAB to Monarch migration process.",containerId:"pageHeader"}});let t=document.querySelector("#faqContainer");!t||(t.innerHTML="",No.forEach((n,r)=>{t.appendChild(gr(n,r))}),t.querySelectorAll(".faq-toggle").forEach(n=>{n.addEventListener("click",()=>{Oo(n)})}))}function Oo(o){let e=o.dataset.index,t=document.querySelector(`.faq-content[data-index="${e}"]`),n=o.querySelector(".faq-icon"),r=o.closest(".faq-item");if(!t||!n||!r)return;if(t.classList.contains("open"))t.classList.remove("open"),t.classList.add("hidden"),t.style.maxHeight="0",n.style.transform="rotate(0deg)",r.classList.remove("border-blue-300","bg-blue-50");else{t.classList.remove("hidden"),t.classList.add("open");let a=t.querySelector("div"),c=a?a.scrollHeight:0;t.style.maxHeight=c+16+"px",n.style.transform="rotate(180deg)",r.classList.add("border-blue-300","bg-blue-50")}}var br=`<div id="pageLayout" data-back-text="Back to App"></div>

<section class="w-full mb-8">
  <div id="faqContainer" class="space-y-3 w-full"></div>
</section>
`;var ut={"/":{template:vn,init:jt,scroll:!1,title:"Home - YNAB to Monarch",requiresAuth:!1},"/upload":{template:Cn,init:Wt,scroll:!1,title:"Upload - YNAB to Monarch",requiresAuth:!1},"/review":{template:In,init:Zt,scroll:!0,title:"Review Accounts - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/method":{template:Bn,init:Kt,scroll:!1,title:"Select Method - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/manual":{template:Nn,init:Xt,scroll:!0,title:"Manual Import - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/login":{template:Hn,init:rn,scroll:!1,title:"Login to Monarch - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/otp":{template:Wn,init:on,scroll:!1,title:"Enter OTP - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/complete":{template:rr,init:nr,scroll:!1,title:"Migration Complete - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/oauth/ynab/callback":{template:or,init:sn,scroll:!1,title:"Authorize YNAB - YNAB to Monarch",requiresAuth:!1},"/data-management":{template:fr,init:an,scroll:!0,title:"Data Management - YNAB to Monarch",requiresAuth:!1},"/faq":{template:br,init:ln,scroll:!0,title:"FAQ - YNAB to Monarch",requiresAuth:!1}},xt=!1,Re=[],zo=50;async function se(o,e=!1,t=!1){if(!xt){xt=!0;try{if(o.startsWith("/")||(o="/"+o),!ut[o])return console.error(`Route not found: ${o}`),o="/upload",se(o,e);let r=Fo(),s=o==="/oauth/ynab/callback"?window.location.href:o;e?history.replaceState({path:o},"",s):(r&&r!==o&&(Re.push(r),Re.length>zo&&Re.shift()),history.pushState({path:o},"",s)),await cn(o)}catch(n){if(console.error("Navigation error:",n),o!=="/upload")return se("/upload",!0)}finally{xt=!1}}}async function cn(o){let e=document.getElementById("app"),t=ut[o]||ut["/upload"];Fe.reset(),document.title=t.title,document.body.classList.toggle("always-scroll",t.scroll),window.scrollTo(0,0),e.innerHTML="",e.innerHTML=t.template;try{await t.init()}catch(n){console.error(`Error initializing route ${o}:`,n),o!=="/upload"&&se("/upload",!0)}}function Fo(){return window.location.pathname}function Po(o){return ut.hasOwnProperty(o)}function ur(){try{localStorage.removeItem("app_state"),state.clearAll()}catch(o){console.error("Error clearing app state:",o)}}function Xe(){if(Re.length>0){let o=Re.pop();if(Po(o)){se(o,!0);return}}se("/",!0)}window.addEventListener("popstate",async o=>{if(!xt){let e=o.state?.path||window.location.pathname;try{Re.length>0&&Re.pop(),await cn(e)}catch(t){console.error("Error handling popstate:",t),se("/upload",!0)}}});window.addEventListener("DOMContentLoaded",async()=>{let o=window.location.pathname,e=ut[o];try{if(e){if(!history.state){let t=o==="/oauth/ynab/callback"?window.location.href:o;history.replaceState({path:o},"",t)}await cn(o)}else se("/upload",!0)}catch(t){console.error("Error on initial load:",t),se("/upload",!0)}});var wt=class{constructor(e){this._value=e,this._subscribers=new Set}get value(){return this._value}set value(e){this._value!==e&&(this._value=e,this._notify())}subscribe(e){return this._subscribers.add(e),()=>this._subscribers.delete(e)}_notify(){this._subscribers.forEach(e=>{try{e(this._value)}catch(t){console.error("Signal callback error:",t)}})}};function ze(o){return new wt(o)}function dn(o){let e=new wt(o());return{...e,update:()=>{e.value=o()}}}var un=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.isOpen=ze(!1),this.isOpen.subscribe(e=>{this._updateModalState(e)})}connectedCallback(){this._render(),this._setupEventListeners()}get hasFooter(){return this.hasAttribute("has-footer")}set hasFooter(e){e?this.setAttribute("has-footer",""):this.removeAttribute("has-footer")}_render(){this.shadowRoot.innerHTML=`
      <style>
        ::slotted([slot="trigger"]) {
          cursor: pointer;
        }
      </style>
      <slot name="trigger"></slot>
    `,this._modalOverlay=document.createElement("div"),this._modalOverlay.className="ui-modal-overlay",this._modalOverlay.setAttribute("role","dialog"),this._modalOverlay.setAttribute("aria-modal","true"),this._modalOverlay.innerHTML=`
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
    `,this._updateModalContent()}_updateModalContent(){let e=this.querySelector('[slot="title"]'),t=this.querySelector('[slot="content"]'),n=this.querySelector('[slot="footer"]'),r=this._modalOverlay.querySelector(".ui-modal-title"),s=this._modalOverlay.querySelector(".ui-modal-body"),a=this._modalOverlay.querySelector(".ui-modal-footer");e&&r&&(r.innerHTML=e.innerHTML),t&&s&&(s.innerHTML=t.innerHTML),n&&a&&(a.innerHTML=Array.from(n.children).map(c=>c.outerHTML).join(""),this.hasFooter&&a.classList.add("visible"))}querySelector(e){let t=super.querySelector(e);return t||(this._modalOverlay?this._modalOverlay.querySelector(e):null)}_setupEventListeners(){let e=this._modalOverlay.querySelector(".ui-modal-backdrop"),t=this._modalOverlay.querySelector(".ui-modal-close-btn"),n=this.querySelector('[slot="trigger"]');n&&n.addEventListener("click",()=>this.open()),t&&t.addEventListener("click",()=>this.close()),e&&e.addEventListener("click",()=>this.close()),this._handleEscape=r=>{r.key==="Escape"&&this.isOpen.value&&this.close()}}_updateModalState(e){e?(document.body.appendChild(this._modalOverlay),this._modalOverlay.offsetHeight,this._modalOverlay.classList.add("open"),document.body.style.overflow="hidden",document.addEventListener("keydown",this._handleEscape)):(this._modalOverlay.classList.remove("open"),setTimeout(()=>{this._modalOverlay.parentNode&&this._modalOverlay.parentNode.removeChild(this._modalOverlay)},500),document.body.style.overflow="",document.removeEventListener("keydown",this._handleEscape))}open(){this.isOpen.value=!0}close(){this.isOpen.value=!1}toggle(){this.isOpen.value=!this.isOpen.value}disconnectedCallback(){document.removeEventListener("keydown",this._handleEscape),this._modalOverlay&&this._modalOverlay.parentNode&&this._modalOverlay.parentNode.removeChild(this._modalOverlay)}};customElements.get("ui-modal")||customElements.define("ui-modal",un);var hn=class extends HTMLElement{constructor(){super(),this._data=ze(new fe),this._columns=ze([]),this._selectedRows=ze(new Set),this._visibleRows=ze([]),this._allSelected=dn(()=>{let e=this._visibleRows.value,t=this._selectedRows.value;return e.length>0&&e.every(n=>t.has(this._getRowId(n)))}),this._someSelected=dn(()=>{let e=this._visibleRows.value,t=this._selectedRows.value,n=e.filter(r=>t.has(this._getRowId(r))).length;return n>0&&n<e.length}),this._mobileBreakpoint="lg",this._enableSelection=!0,this._rowIdKey="id",this._handleMasterCheckboxChange=this._handleMasterCheckboxChange.bind(this),this._handleRowCheckboxChange=this._handleRowCheckboxChange.bind(this)}connectedCallback(){this._mobileBreakpoint=this.getAttribute("data-mobile-breakpoint")||"lg",this._enableSelection=this.getAttribute("data-enable-selection")!=="false",this._rowIdKey=this.getAttribute("data-row-id-key")||"id",this._render(),this._setupSubscriptions()}disconnectedCallback(){this._dataUnsubscribe&&this._dataUnsubscribe(),this._columnsUnsubscribe&&this._columnsUnsubscribe(),this._selectedUnsubscribe&&this._selectedUnsubscribe(),this._visibleUnsubscribe&&this._visibleUnsubscribe()}_setupSubscriptions(){this._dataUnsubscribe=this._data.subscribe(()=>this._updateTable()),this._columnsUnsubscribe=this._columns.subscribe(()=>this._updateTable()),this._selectedUnsubscribe=this._selectedRows.subscribe(()=>this._updateSelection()),this._visibleUnsubscribe=this._visibleRows.subscribe(()=>this._updateMasterCheckbox())}_render(){this.className="ui-table-container bg-white rounded-lg shadow-sm overflow-hidden",this.innerHTML=`
      <!-- Mobile Card View -->
      <div class="mobile-view block ${this._mobileBreakpoint}:hidden bg-gray-50">
        ${this._enableSelection?`
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
        `:""}
        <div class="mobile-list space-y-2 p-3 sm:p-4"></div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="desktop-view hidden ${this._mobileBreakpoint}:block overflow-x-auto">
        <table class="w-full min-w-[800px]" role="grid">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200" role="row"></tr>
          </thead>
          <tbody class="divide-y divide-gray-100"></tbody>
        </table>
      </div>
    `,this._updateTable()}_updateTable(){let e=this._getAccountRows(),t=this._columns.value;this._visibleRows.value=e,this._renderDesktopTable(e,t),this._renderMobileCards(e,t);let n=this.querySelector("#masterCheckboxMobile");n&&(n.removeEventListener("change",this._handleMasterCheckboxChange),n.addEventListener("change",this._handleMasterCheckboxChange)),this._updateSelection()}_renderDesktopTable(e,t){let n=this.querySelector("thead tr"),r=this.querySelector("tbody");!n||!r||(n.innerHTML="",t.forEach(s=>{let a=document.createElement("th");if(a.scope="col",a.className=s.headerClass||"px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900",s.width&&(a.style.width=s.width),s.minWidth&&(a.style.minWidth=s.minWidth),s.type==="checkbox"&&s.masterCheckbox){let c=document.createElement("input");c.type="checkbox",c.className="master-checkbox w-4 h-4 sm:w-5 sm:h-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2",c.addEventListener("change",this._handleMasterCheckboxChange),a.appendChild(c)}else a.textContent=s.header||"";n.appendChild(a)}),r.innerHTML="",e.forEach(s=>{console.debug("Rendering row:",s);let a=document.createElement("tr");a.setAttribute("role","row"),a.className="border-t border-gray-100",s.migrationStatus===pe.COMPLETED&&a.classList.add("bg-amber-50","border-l-4","border-l-amber-300"),a.dataset.rowId=this._getRowId(s),t.forEach(c=>{let b=document.createElement("td");b.className=c.cellClass||"px-3 sm:px-4 py-3 sm:py-4",this._renderCell(b,c,s),a.appendChild(b)}),r.appendChild(a)}))}_renderMobileCards(e,t){let n=this.querySelector(".mobile-list");!n||(n.innerHTML="",e.forEach(r=>{let s=document.createElement("div");s.className="mobile-card overflow-hidden",r.migrationStatus===pe.COMPLETED?s.classList.add("bg-amber-50","border-l-4","border-l-amber-300"):s.classList.add("bg-white","border","border-gray-100"),s.dataset.rowId=this._getRowId(r);let a=document.createElement("div");a.className="p-3 sm:p-4";let c=document.createElement("div");if(c.className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100",t.find(m=>m.type==="checkbox"&&m.masterCheckbox)&&this._enableSelection){let m=this._createMobileCheckbox(r);m.className="flex-shrink-0",c.appendChild(m)}let g=t.find(m=>m.key==="name");if(g&&!g.mobileHidden){let m=document.createElement("div");m.className="flex-1 min-w-0";let h=document.createElement("div");h.className="text-sm font-semibold text-gray-900 truncate";let p=g.getValue?g.getValue(r):r[g.key];h.textContent=p||"",(g.clickable?typeof g.clickable=="function"?g.clickable(r):g.clickable:!1)&&(h.className+=" cursor-pointer hover:text-blue-600 transition-colors",g.onClick&&h.addEventListener("click",()=>g.onClick(r))),m.appendChild(h),c.appendChild(m)}a.appendChild(c);let x=document.createElement("div");x.className="grid grid-cols-2 gap-3 sm:gap-4 text-sm";let u=0;t.forEach(m=>{if(m.type==="checkbox"&&m.masterCheckbox||m.key==="name"||m.mobileHidden||m.type==="custom"&&m.key==="undo"||m.type==="button"||m.mobileLayout==="full")return;u++;let h=document.createElement("div");if(m.mobileLayout==="full"?h.className="col-span-2 flex flex-col gap-1":h.className="flex flex-col gap-1",m.mobileLabel!==!1){let w=document.createElement("span");w.className="text-xs font-semibold text-gray-500 uppercase tracking-wide",w.textContent=m.mobileLabel||m.header,h.appendChild(w)}let p=document.createElement("div");p.className="min-w-0",this._renderCell(p,m,r,!0),h.appendChild(p),x.appendChild(h)}),a.appendChild(x);let f=!1,d=[];if(t.forEach(m=>{(m.type==="button"||m.type==="custom"&&m.key==="undo")&&(f=!0,d.push(m))}),f){let m=document.createElement("div");m.className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap",d.forEach(h=>{let p=document.createElement("div");h.type==="button"?p.className="flex-1 min-w-[120px]":p.className="flex-shrink-0",this._renderCell(p,h,r,!0),m.appendChild(p)}),a.appendChild(m)}s.appendChild(a),n.appendChild(s)}))}_createMobileCheckbox(e){let t=document.createElement("label");t.className="custom-checkbox-container flex-shrink-0";let n=document.createElement("input");n.id="rowCheckboxMobile_"+this._getRowId(e),n.type="checkbox",n.className="row-checkbox custom-checkbox-input",n.dataset.rowId=this._getRowId(e),n.checked=this._selectedRows.value.has(this._getRowId(e)),n.addEventListener("change",this._handleRowCheckboxChange);let r=document.createElement("span");return r.className="custom-checkbox-visual",t.appendChild(n),t.appendChild(r),t}_renderCell(e,t,n,r=!1){let s=t.disabled?t.disabled(n):!1;switch(t.type){case"checkbox":if(t.masterCheckbox){let p=document.createElement("input");p.type="checkbox",p.className="row-checkbox w-5 h-5 rounded border-gray-300 cursor-pointer",p.dataset.rowId=this._getRowId(n),p.checked=this._selectedRows.value.has(this._getRowId(n)),p.disabled=s,p.addEventListener("change",this._handleRowCheckboxChange),e.appendChild(p)}else{let p=document.createElement("input");p.type="checkbox",p.className="w-5 h-5 rounded border-gray-300 cursor-pointer",p.checked=t.getValue?t.getValue(n):n[t.key],p.disabled=s,t.onChange&&p.addEventListener("change",()=>t.onChange(n,p.checked)),e.appendChild(p)}break;case"text":let a=t.getValue?t.getValue(n):n[t.key];e.textContent=a,e.className+=" truncate",t.clickable&&!s?(e.className+=" cursor-pointer hover:text-blue-600 transition-colors duration-200",t.onClick&&e.addEventListener("click",()=>t.onClick(n))):s&&(e.className+=" text-gray-400 cursor-default"),t.tooltip&&(e.title=typeof t.tooltip=="function"?t.tooltip(n):t.tooltip);break;case"select":let c=document.createElement("select"),b="border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium",g="text-xs px-2 py-1.5",x="text-sm px-2 py-1";c.className=b+" "+(r?g:x),c.disabled=s,s?c.className+=" text-gray-400 bg-gray-50 cursor-not-allowed":c.className+=" cursor-pointer text-gray-900";let u=t.getValue?t.getValue(n):n[t.key];(t.options?typeof t.options=="function"?t.options(n):t.options:[]).forEach(p=>{let w=document.createElement("option");w.value=p.value,w.textContent=p.label,p.value===u&&(w.selected=!0),c.appendChild(w)}),t.onChange&&c.addEventListener("change",p=>{try{p&&p.target&&n&&t.onChange(n,c.value)}catch(w){console.error("Error in select onChange:",w)}}),t.tooltip&&(c.title=typeof t.tooltip=="function"?t.tooltip(n):t.tooltip),e.appendChild(c);break;case"button":let d=t.render?t.render(n):{},m=document.createElement("ui-button");m.className="ui-button",m.dataset.type=d.type||"solid",m.dataset.color=d.color||"blue",m.dataset.size=d.size||(r?"small":"medium"),m.textContent=d.text||"",m.dataset.fullwidth=r?"true":"false",m.disabled=s||d.disabled,d.onClick&&m.addEventListener("click",()=>d.onClick(n)),(d.tooltip||t.tooltip)&&(m.title=d.tooltip||(typeof t.tooltip=="function"?t.tooltip(n):t.tooltip)),e.appendChild(m);break;case"custom":if(t.render){let p=t.render(n,r);typeof p=="string"?e.innerHTML=p:p instanceof HTMLElement&&e.appendChild(p)}break;default:let h=t.getValue?t.getValue(n):n[t.key];e.textContent=h||""}if(t.cellStyle){let a=typeof t.cellStyle=="function"?t.cellStyle(n):t.cellStyle;Object.assign(e.style,a)}}_handleMasterCheckboxChange(e){let t=this._visibleRows.value,n=new Set(this._selectedRows.value),s=e.target.checked;t.forEach(a=>{let c=this._getRowId(a);s?n.add(c):n.delete(c)}),this._selectedRows.value=n,setTimeout(()=>{this._emitSelectionChange()},0)}_handleRowCheckboxChange(e){if(!e||!e.target)return;let t=e.target,n=t.dataset.rowId,r=t.checked,s=new Set(this._selectedRows.value);r?s.add(n):s.delete(n),this._selectedRows.value=s,this._emitSelectionChange()}_updateSelection(){this.querySelectorAll(".row-checkbox").forEach(t=>{let n=t.dataset.rowId;t.checked=this._selectedRows.value.has(n)}),this._updateMasterCheckbox(),this._updateSelectionCount()}_updateMasterCheckbox(){let e=this.querySelectorAll(".master-checkbox, .master-checkbox-mobile"),t=this._visibleRows.value,n=this._selectedRows.value,r=t.filter(c=>n.has(this._getRowId(c))).length,s=t.length>0&&r===t.length,a=r>0&&r<t.length;e.forEach(c=>{c.checked=s,c.indeterminate=a})}_updateSelectionCount(){let e=this.querySelectorAll(".selection-count-mobile"),t=this._selectedRows.value.size;e.forEach(n=>{n.textContent=`${t} selected`})}_emitSelectionChange(){let e=Array.from(this._selectedRows.value),n=this._visibleRows.value.filter(r=>this._selectedRows.value.has(this._getRowId(r)));this.dispatchEvent(new CustomEvent("selectionchange",{detail:{selected:e,selectedRows:n,count:e.length,allSelected:this._allSelected.value,someSelected:this._someSelected.value},bubbles:!0}))}_getRowId(e){return String(e[this._rowIdKey]||e.id||JSON.stringify(e))}_getAccountRows(){return this._data.value instanceof fe?this._data.value.accounts:Array.isArray(this._data.value)?this._data.value:[]}set data(e){this._data.value=fe.from(e)}get data(){return this._getAccountRows()}set columns(e){this._columns.value=Array.isArray(e)?e:[]}get columns(){return this._columns.value}set selectedRows(e){this._selectedRows.value=new Set(e),this._updateSelection(),this._emitSelectionChange()}get selectedRows(){return Array.from(this._selectedRows.value)}clearSelection(){this._selectedRows.value=new Set,this._updateSelection(),this._emitSelectionChange()}selectAll(){let e=new Set;this._visibleRows.value.forEach(t=>{e.add(this._getRowId(t))}),this._selectedRows.value=e,this._updateSelection(),this._emitSelectionChange()}refresh(){this._updateTable()}updateRow(e){console.group(`Updating row with ID: ${e}`);let t=this._getAccountRows(),n=this._columns.value,r=t.find(c=>this._getRowId(c)===e);if(!r){console.warn(`Row with ID ${e} not found`),console.groupEnd();return}let s=this.querySelector(`tr[data-row-id="${e}"]`);s&&this._updateTableRow(s,r,n);let a=this.querySelector(`[data-mobile-card-id="${e}"]`);a&&this._updateMobileCard(a,r,n),console.groupEnd()}_updateTableRow(e,t,n){console.group(`Updating desktop table row for ID: ${this._getRowId(t)}`);let r=t.migrationStatus===pe.COMPLETED;e.classList.toggle("bg-amber-50",r),e.classList.toggle("border-l-4",r),e.classList.toggle("border-l-amber-300",r);let s=e.querySelectorAll("td");n.forEach((a,c)=>{let b=s[c];b&&(b.innerHTML="",this._renderCell(b,a,t))}),console.groupEnd()}_updateMobileCard(e,t,n){console.group(`Updating mobile card for ID: ${this._getRowId(t)}`),e.innerHTML="",this._renderMobileCardContent(e,t,n),console.groupEnd()}_renderMobileCardContent(e,t,n){console.group("Rendering mobile card content",{rowId:this._getRowId(t)}),e.className="bg-white rounded border border-gray-200 p-3 sm:p-4 space-y-2",t.migrationStatus===pe.COMPLETED&&e.classList.add("bg-amber-50","border-l-4","border-l-amber-300"),e.setAttribute("data-mobile-card-id",this._getRowId(t)),n.forEach(r=>{if(r.mobileHidden){console.log(`Skipping mobile rendering for column: ${r.header||r.mobileLabel}`);return}let s=document.createElement("div");s.className="flex justify-between items-start text-sm";let a=document.createElement("span");a.className="font-medium text-gray-700",a.textContent=r.mobileLabel||r.header||"";let c=document.createElement("div");c.className="text-gray-900 text-right flex-1 ml-3",this._renderCell(c,r,t),s.appendChild(a),s.appendChild(c),e.appendChild(s)}),console.groupEnd()}};customElements.define("ui-table",hn);})();
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
