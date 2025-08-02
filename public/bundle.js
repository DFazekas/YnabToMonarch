(()=>{var wn=Object.create;var Ot=Object.defineProperty;var kn=Object.getOwnPropertyDescriptor;var _n=Object.getOwnPropertyNames;var Cn=Object.getPrototypeOf,En=Object.prototype.hasOwnProperty;var We=(e=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(e,{get:(o,n)=>(typeof require!="undefined"?require:o)[n]}):e)(function(e){if(typeof require!="undefined")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var Rt=(e,o)=>()=>(o||e((o={exports:{}}).exports,o),o.exports);var Sn=(e,o,n,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let i of _n(o))!En.call(e,i)&&i!==n&&Ot(e,i,{get:()=>o[i],enumerable:!(r=kn(o,i))||r.enumerable});return e};var dt=(e,o,n)=>(n=e!=null?wn(Cn(e)):{},Sn(o||!e||!e.__esModule?Ot(n,"default",{value:e,enumerable:!0}):n,e));var Ft=Rt((ut,pt)=>{((e,o)=>{typeof define=="function"&&define.amd?define([],o):typeof pt=="object"&&typeof ut<"u"?pt.exports=o():e.Papa=o()})(ut,function e(){var o=typeof self<"u"?self:typeof window<"u"?window:o!==void 0?o:{},n,r=!o.document&&!!o.postMessage,i=o.IS_PAPA_WORKER||!1,s={},l=0,u={};function k(h){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(f){var B=v(f);B.chunkSize=parseInt(B.chunkSize),f.step||f.chunk||(B.chunkSize=null),this._handle=new d(B),(this._handle.streamer=this)._config=B}.call(this,h),this.parseChunk=function(f,B){var F=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<F){let O=this._config.newline;O||(b=this._config.quoteChar||'"',O=this._handle.guessLineEndings(f,b)),f=[...f.split(O).slice(F)].join(O)}this.isFirstChunk&&A(this._config.beforeFirstChunk)&&(b=this._config.beforeFirstChunk(f))!==void 0&&(f=b),this.isFirstChunk=!1,this._halted=!1;var F=this._partialLine+f,b=(this._partialLine="",this._handle.parse(F,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(f=b.meta.cursor,F=(this._finished||(this._partialLine=F.substring(f-this._baseIndex),this._baseIndex=f),b&&b.data&&(this._rowCount+=b.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),i)o.postMessage({results:b,workerId:u.WORKER_ID,finished:F});else if(A(this._config.chunk)&&!B){if(this._config.chunk(b,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=b=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(b.data),this._completeResults.errors=this._completeResults.errors.concat(b.errors),this._completeResults.meta=b.meta),this._completed||!F||!A(this._config.complete)||b&&b.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),F||b&&b.meta.paused||this._nextChunk(),b}this._halted=!0},this._sendError=function(f){A(this._config.error)?this._config.error(f):i&&this._config.error&&o.postMessage({workerId:u.WORKER_ID,error:f,finished:!1})}}function y(h){var f;(h=h||{}).chunkSize||(h.chunkSize=u.RemoteChunkSize),k.call(this,h),this._nextChunk=r?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(B){this._input=B,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(f=new XMLHttpRequest,this._config.withCredentials&&(f.withCredentials=this._config.withCredentials),r||(f.onload=M(this._chunkLoaded,this),f.onerror=M(this._chunkError,this)),f.open(this._config.downloadRequestBody?"POST":"GET",this._input,!r),this._config.downloadRequestHeaders){var B,F=this._config.downloadRequestHeaders;for(B in F)f.setRequestHeader(B,F[B])}var b;this._config.chunkSize&&(b=this._start+this._config.chunkSize-1,f.setRequestHeader("Range","bytes="+this._start+"-"+b));try{f.send(this._config.downloadRequestBody)}catch(O){this._chunkError(O.message)}r&&f.status===0&&this._chunkError()}},this._chunkLoaded=function(){f.readyState===4&&(f.status<200||400<=f.status?this._chunkError():(this._start+=this._config.chunkSize||f.responseText.length,this._finished=!this._config.chunkSize||this._start>=(B=>(B=B.getResponseHeader("Content-Range"))!==null?parseInt(B.substring(B.lastIndexOf("/")+1)):-1)(f),this.parseChunk(f.responseText)))},this._chunkError=function(B){B=f.statusText||B,this._sendError(new Error(B))}}function E(h){(h=h||{}).chunkSize||(h.chunkSize=u.LocalChunkSize),k.call(this,h);var f,B,F=typeof FileReader<"u";this.stream=function(b){this._input=b,B=b.slice||b.webkitSlice||b.mozSlice,F?((f=new FileReader).onload=M(this._chunkLoaded,this),f.onerror=M(this._chunkError,this)):f=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var b=this._input,O=(this._config.chunkSize&&(O=Math.min(this._start+this._config.chunkSize,this._input.size),b=B.call(b,this._start,O)),f.readAsText(b,this._config.encoding));F||this._chunkLoaded({target:{result:O}})},this._chunkLoaded=function(b){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(b.target.result)},this._chunkError=function(){this._sendError(f.error)}}function c(h){var f;k.call(this,h=h||{}),this.stream=function(B){return f=B,this._nextChunk()},this._nextChunk=function(){var B,F;if(!this._finished)return B=this._config.chunkSize,f=B?(F=f.substring(0,B),f.substring(B)):(F=f,""),this._finished=!f,this.parseChunk(F)}}function w(h){k.call(this,h=h||{});var f=[],B=!0,F=!1;this.pause=function(){k.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){k.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(b){this._input=b,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){F&&f.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),f.length?this.parseChunk(f.shift()):B=!0},this._streamData=M(function(b){try{f.push(typeof b=="string"?b:b.toString(this._config.encoding)),B&&(B=!1,this._checkIsFinished(),this.parseChunk(f.shift()))}catch(O){this._streamError(O)}},this),this._streamError=M(function(b){this._streamCleanUp(),this._sendError(b)},this),this._streamEnd=M(function(){this._streamCleanUp(),F=!0,this._streamData("")},this),this._streamCleanUp=M(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function d(h){var f,B,F,b,O=Math.pow(2,53),a=-O,U=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,re=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,P=this,te=0,D=0,Q=!1,L=!1,T=[],H={data:[],errors:[],meta:{}};function G(X){return h.skipEmptyLines==="greedy"?X.join("").trim()==="":X.length===1&&X[0].length===0}function W(){if(H&&F&&(de("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+u.DefaultDelimiter+"'"),F=!1),h.skipEmptyLines&&(H.data=H.data.filter(function(le){return!G(le)})),oe()){let le=function(ce,t){A(h.transformHeader)&&(ce=h.transformHeader(ce,t)),T.push(ce)};var ne=le;if(H)if(Array.isArray(H.data[0])){for(var X=0;oe()&&X<H.data.length;X++)H.data[X].forEach(le);H.data.splice(0,1)}else H.data.forEach(le)}function ee(le,ce){for(var t=h.header?{}:[],R=0;R<le.length;R++){var N=R,_=le[R],_=((m,I)=>(j=>(h.dynamicTypingFunction&&h.dynamicTyping[j]===void 0&&(h.dynamicTyping[j]=h.dynamicTypingFunction(j)),(h.dynamicTyping[j]||h.dynamicTyping)===!0))(m)?I==="true"||I==="TRUE"||I!=="false"&&I!=="FALSE"&&((j=>{if(U.test(j)&&(j=parseFloat(j),a<j&&j<O))return 1})(I)?parseFloat(I):re.test(I)?new Date(I):I===""?null:I):I)(N=h.header?R>=T.length?"__parsed_extra":T[R]:N,_=h.transform?h.transform(_,N):_);N==="__parsed_extra"?(t[N]=t[N]||[],t[N].push(_)):t[N]=_}return h.header&&(R>T.length?de("FieldMismatch","TooManyFields","Too many fields: expected "+T.length+" fields but parsed "+R,D+ce):R<T.length&&de("FieldMismatch","TooFewFields","Too few fields: expected "+T.length+" fields but parsed "+R,D+ce)),t}var ie;H&&(h.header||h.dynamicTyping||h.transform)&&(ie=1,!H.data.length||Array.isArray(H.data[0])?(H.data=H.data.map(ee),ie=H.data.length):H.data=ee(H.data,0),h.header&&H.meta&&(H.meta.fields=T),D+=ie)}function oe(){return h.header&&T.length===0}function de(X,ee,ie,ne){X={type:X,code:ee,message:ie},ne!==void 0&&(X.row=ne),H.errors.push(X)}A(h.step)&&(b=h.step,h.step=function(X){H=X,oe()?W():(W(),H.data.length!==0&&(te+=X.data.length,h.preview&&te>h.preview?B.abort():(H.data=H.data[0],b(H,P))))}),this.parse=function(X,ee,ie){var ne=h.quoteChar||'"',ne=(h.newline||(h.newline=this.guessLineEndings(X,ne)),F=!1,h.delimiter?A(h.delimiter)&&(h.delimiter=h.delimiter(X),H.meta.delimiter=h.delimiter):((ne=((le,ce,t,R,N)=>{var _,m,I,j;N=N||[",","	","|",";",u.RECORD_SEP,u.UNIT_SEP];for(var $=0;$<N.length;$++){for(var z,Y=N[$],K=0,Z=0,J=0,ae=(I=void 0,new p({comments:R,delimiter:Y,newline:ce,preview:10}).parse(le)),se=0;se<ae.data.length;se++)t&&G(ae.data[se])?J++:(z=ae.data[se].length,Z+=z,I===void 0?I=z:0<z&&(K+=Math.abs(z-I),I=z));0<ae.data.length&&(Z/=ae.data.length-J),(m===void 0||K<=m)&&(j===void 0||j<Z)&&1.99<Z&&(m=K,_=Y,j=Z)}return{successful:!!(h.delimiter=_),bestDelimiter:_}})(X,h.newline,h.skipEmptyLines,h.comments,h.delimitersToGuess)).successful?h.delimiter=ne.bestDelimiter:(F=!0,h.delimiter=u.DefaultDelimiter),H.meta.delimiter=h.delimiter),v(h));return h.preview&&h.header&&ne.preview++,f=X,B=new p(ne),H=B.parse(f,ee,ie),W(),Q?{meta:{paused:!0}}:H||{meta:{paused:!1}}},this.paused=function(){return Q},this.pause=function(){Q=!0,B.abort(),f=A(h.chunk)?"":f.substring(B.getCharIndex())},this.resume=function(){P.streamer._halted?(Q=!1,P.streamer.parseChunk(f,!0)):setTimeout(P.resume,3)},this.aborted=function(){return L},this.abort=function(){L=!0,B.abort(),H.meta.aborted=!0,A(h.complete)&&h.complete(H),f=""},this.guessLineEndings=function(le,ne){le=le.substring(0,1048576);var ne=new RegExp(g(ne)+"([^]*?)"+g(ne),"gm"),ie=(le=le.replace(ne,"")).split("\r"),ne=le.split(`
`),le=1<ne.length&&ne[0].length<ie[0].length;if(ie.length===1||le)return`
`;for(var ce=0,t=0;t<ie.length;t++)ie[t][0]===`
`&&ce++;return ce>=ie.length/2?`\r
`:"\r"}}function g(h){return h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function p(h){var f=(h=h||{}).delimiter,B=h.newline,F=h.comments,b=h.step,O=h.preview,a=h.fastMode,U=null,re=!1,P=h.quoteChar==null?'"':h.quoteChar,te=P;if(h.escapeChar!==void 0&&(te=h.escapeChar),(typeof f!="string"||-1<u.BAD_DELIMITERS.indexOf(f))&&(f=","),F===f)throw new Error("Comment character same as delimiter");F===!0?F="#":(typeof F!="string"||-1<u.BAD_DELIMITERS.indexOf(F))&&(F=!1),B!==`
`&&B!=="\r"&&B!==`\r
`&&(B=`
`);var D=0,Q=!1;this.parse=function(L,T,H){if(typeof L!="string")throw new Error("Input must be a string");var G=L.length,W=f.length,oe=B.length,de=F.length,X=A(b),ee=[],ie=[],ne=[],le=D=0;if(!L)return K();if(a||a!==!1&&L.indexOf(P)===-1){for(var ce=L.split(B),t=0;t<ce.length;t++){if(ne=ce[t],D+=ne.length,t!==ce.length-1)D+=B.length;else if(H)return K();if(!F||ne.substring(0,de)!==F){if(X){if(ee=[],j(ne.split(f)),Z(),Q)return K()}else j(ne.split(f));if(O&&O<=t)return ee=ee.slice(0,O),K(!0)}}return K()}for(var R=L.indexOf(f,D),N=L.indexOf(B,D),_=new RegExp(g(te)+g(P),"g"),m=L.indexOf(P,D);;)if(L[D]===P)for(m=D,D++;;){if((m=L.indexOf(P,m+1))===-1)return H||ie.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:ee.length,index:D}),z();if(m===G-1)return z(L.substring(D,m).replace(_,P));if(P===te&&L[m+1]===te)m++;else if(P===te||m===0||L[m-1]!==te){R!==-1&&R<m+1&&(R=L.indexOf(f,m+1));var I=$((N=N!==-1&&N<m+1?L.indexOf(B,m+1):N)===-1?R:Math.min(R,N));if(L.substr(m+1+I,W)===f){ne.push(L.substring(D,m).replace(_,P)),L[D=m+1+I+W]!==P&&(m=L.indexOf(P,D)),R=L.indexOf(f,D),N=L.indexOf(B,D);break}if(I=$(N),L.substring(m+1+I,m+1+I+oe)===B){if(ne.push(L.substring(D,m).replace(_,P)),Y(m+1+I+oe),R=L.indexOf(f,D),m=L.indexOf(P,D),X&&(Z(),Q))return K();if(O&&ee.length>=O)return K(!0);break}ie.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:ee.length,index:D}),m++}}else if(F&&ne.length===0&&L.substring(D,D+de)===F){if(N===-1)return K();D=N+oe,N=L.indexOf(B,D),R=L.indexOf(f,D)}else if(R!==-1&&(R<N||N===-1))ne.push(L.substring(D,R)),D=R+W,R=L.indexOf(f,D);else{if(N===-1)break;if(ne.push(L.substring(D,N)),Y(N+oe),X&&(Z(),Q))return K();if(O&&ee.length>=O)return K(!0)}return z();function j(J){ee.push(J),le=D}function $(J){var ae=0;return ae=J!==-1&&(J=L.substring(m+1,J))&&J.trim()===""?J.length:ae}function z(J){return H||(J===void 0&&(J=L.substring(D)),ne.push(J),D=G,j(ne),X&&Z()),K()}function Y(J){D=J,j(ne),ne=[],N=L.indexOf(B,D)}function K(J){if(h.header&&!T&&ee.length&&!re){var ae=ee[0],se={},ye=new Set(ae);let Be=!1;for(let he=0;he<ae.length;he++){let be=ae[he];if(se[be=A(h.transformHeader)?h.transformHeader(be,he):be]){let pe,Te=se[be];for(;pe=be+"_"+Te,Te++,ye.has(pe););ye.add(pe),ae[he]=pe,se[be]++,Be=!0,(U=U===null?{}:U)[pe]=be}else se[be]=1,ae[he]=be;ye.add(be)}Be&&console.warn("Duplicate headers found and renamed."),re=!0}return{data:ee,errors:ie,meta:{delimiter:f,linebreak:B,aborted:Q,truncated:!!J,cursor:le+(T||0),renamedHeaders:U}}}function Z(){b(K()),ee=[],ie=[]}},this.abort=function(){Q=!0},this.getCharIndex=function(){return D}}function x(h){var f=h.data,B=s[f.workerId],F=!1;if(f.error)B.userError(f.error,f.file);else if(f.results&&f.results.data){var b={abort:function(){F=!0,C(f.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:S,resume:S};if(A(B.userStep)){for(var O=0;O<f.results.data.length&&(B.userStep({data:f.results.data[O],errors:f.results.errors,meta:f.results.meta},b),!F);O++);delete f.results}else A(B.userChunk)&&(B.userChunk(f.results,b,f.file),delete f.results)}f.finished&&!F&&C(f.workerId,f.results)}function C(h,f){var B=s[h];A(B.userComplete)&&B.userComplete(f),B.terminate(),delete s[h]}function S(){throw new Error("Not implemented.")}function v(h){if(typeof h!="object"||h===null)return h;var f,B=Array.isArray(h)?[]:{};for(f in h)B[f]=v(h[f]);return B}function M(h,f){return function(){h.apply(f,arguments)}}function A(h){return typeof h=="function"}return u.parse=function(h,f){var B=(f=f||{}).dynamicTyping||!1;if(A(B)&&(f.dynamicTypingFunction=B,B={}),f.dynamicTyping=B,f.transform=!!A(f.transform)&&f.transform,!f.worker||!u.WORKERS_SUPPORTED)return B=null,u.NODE_STREAM_INPUT,typeof h=="string"?(h=(F=>F.charCodeAt(0)!==65279?F:F.slice(1))(h),B=new(f.download?y:c)(f)):h.readable===!0&&A(h.read)&&A(h.on)?B=new w(f):(o.File&&h instanceof File||h instanceof Object)&&(B=new E(f)),B.stream(h);(B=(()=>{var F;return!!u.WORKERS_SUPPORTED&&(F=(()=>{var b=o.URL||o.webkitURL||null,O=e.toString();return u.BLOB_URL||(u.BLOB_URL=b.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",O,")();"],{type:"text/javascript"})))})(),(F=new o.Worker(F)).onmessage=x,F.id=l++,s[F.id]=F)})()).userStep=f.step,B.userChunk=f.chunk,B.userComplete=f.complete,B.userError=f.error,f.step=A(f.step),f.chunk=A(f.chunk),f.complete=A(f.complete),f.error=A(f.error),delete f.worker,B.postMessage({input:h,config:f,workerId:B.id})},u.unparse=function(h,f){var B=!1,F=!0,b=",",O=`\r
`,a='"',U=a+a,re=!1,P=null,te=!1,D=((()=>{if(typeof f=="object"){if(typeof f.delimiter!="string"||u.BAD_DELIMITERS.filter(function(T){return f.delimiter.indexOf(T)!==-1}).length||(b=f.delimiter),typeof f.quotes!="boolean"&&typeof f.quotes!="function"&&!Array.isArray(f.quotes)||(B=f.quotes),typeof f.skipEmptyLines!="boolean"&&typeof f.skipEmptyLines!="string"||(re=f.skipEmptyLines),typeof f.newline=="string"&&(O=f.newline),typeof f.quoteChar=="string"&&(a=f.quoteChar),typeof f.header=="boolean"&&(F=f.header),Array.isArray(f.columns)){if(f.columns.length===0)throw new Error("Option columns is empty");P=f.columns}f.escapeChar!==void 0&&(U=f.escapeChar+a),f.escapeFormulae instanceof RegExp?te=f.escapeFormulae:typeof f.escapeFormulae=="boolean"&&f.escapeFormulae&&(te=/^[=+\-@\t\r].*$/)}})(),new RegExp(g(a),"g"));if(typeof h=="string"&&(h=JSON.parse(h)),Array.isArray(h)){if(!h.length||Array.isArray(h[0]))return Q(null,h,re);if(typeof h[0]=="object")return Q(P||Object.keys(h[0]),h,re)}else if(typeof h=="object")return typeof h.data=="string"&&(h.data=JSON.parse(h.data)),Array.isArray(h.data)&&(h.fields||(h.fields=h.meta&&h.meta.fields||P),h.fields||(h.fields=Array.isArray(h.data[0])?h.fields:typeof h.data[0]=="object"?Object.keys(h.data[0]):[]),Array.isArray(h.data[0])||typeof h.data[0]=="object"||(h.data=[h.data])),Q(h.fields||[],h.data||[],re);throw new Error("Unable to serialize unrecognized input");function Q(T,H,G){var W="",oe=(typeof T=="string"&&(T=JSON.parse(T)),typeof H=="string"&&(H=JSON.parse(H)),Array.isArray(T)&&0<T.length),de=!Array.isArray(H[0]);if(oe&&F){for(var X=0;X<T.length;X++)0<X&&(W+=b),W+=L(T[X],X);0<H.length&&(W+=O)}for(var ee=0;ee<H.length;ee++){var ie=(oe?T:H[ee]).length,ne=!1,le=oe?Object.keys(H[ee]).length===0:H[ee].length===0;if(G&&!oe&&(ne=G==="greedy"?H[ee].join("").trim()==="":H[ee].length===1&&H[ee][0].length===0),G==="greedy"&&oe){for(var ce=[],t=0;t<ie;t++){var R=de?T[t]:t;ce.push(H[ee][R])}ne=ce.join("").trim()===""}if(!ne){for(var N=0;N<ie;N++){0<N&&!le&&(W+=b);var _=oe&&de?T[N]:N;W+=L(H[ee][_],N)}ee<H.length-1&&(!G||0<ie&&!le)&&(W+=O)}}return W}function L(T,H){var G,W;return T==null?"":T.constructor===Date?JSON.stringify(T).slice(1,25):(W=!1,te&&typeof T=="string"&&te.test(T)&&(T="'"+T,W=!0),G=T.toString().replace(D,U),(W=W||B===!0||typeof B=="function"&&B(T,H)||Array.isArray(B)&&B[H]||((oe,de)=>{for(var X=0;X<de.length;X++)if(-1<oe.indexOf(de[X]))return!0;return!1})(G,u.BAD_DELIMITERS)||-1<G.indexOf(b)||G.charAt(0)===" "||G.charAt(G.length-1)===" ")?a+G+a:G)}},u.RECORD_SEP=String.fromCharCode(30),u.UNIT_SEP=String.fromCharCode(31),u.BYTE_ORDER_MARK="\uFEFF",u.BAD_DELIMITERS=["\r",`
`,'"',u.BYTE_ORDER_MARK],u.WORKERS_SUPPORTED=!r&&!!o.Worker,u.NODE_STREAM_INPUT=1,u.LocalChunkSize=10485760,u.RemoteChunkSize=5242880,u.DefaultDelimiter=",",u.Parser=p,u.ParserHandle=d,u.NetworkStreamer=y,u.FileStreamer=E,u.StringStreamer=c,u.ReadableStreamStreamer=w,o.jQuery&&((n=o.jQuery).fn.parse=function(h){var f=h.config||{},B=[];return this.each(function(O){if(!(n(this).prop("tagName").toUpperCase()==="INPUT"&&n(this).attr("type").toLowerCase()==="file"&&o.FileReader)||!this.files||this.files.length===0)return!0;for(var a=0;a<this.files.length;a++)B.push({file:this.files[a],inputElem:this,instanceConfig:n.extend({},f)})}),F(),this;function F(){if(B.length===0)A(h.complete)&&h.complete();else{var O,a,U,re,P=B[0];if(A(h.before)){var te=h.before(P.file,P.inputElem);if(typeof te=="object"){if(te.action==="abort")return O="AbortError",a=P.file,U=P.inputElem,re=te.reason,void(A(h.error)&&h.error({name:O},a,U,re));if(te.action==="skip")return void b();typeof te.config=="object"&&(P.instanceConfig=n.extend(P.instanceConfig,te.config))}else if(te==="skip")return void b()}var D=P.instanceConfig.complete;P.instanceConfig.complete=function(Q){A(D)&&D(Q,P.file,P.inputElem),b()},u.parse(P.file,P.instanceConfig)}}function b(){B.splice(0,1),F()}}),i&&(o.onmessage=function(h){h=h.data,u.WORKER_ID===void 0&&h&&(u.WORKER_ID=h.workerId),typeof h.input=="string"?o.postMessage({workerId:u.WORKER_ID,results:u.parse(h.input,h.config),finished:!0}):(o.File&&h.input instanceof File||h.input instanceof Object)&&(h=u.parse(h.input,h.config))&&o.postMessage({workerId:u.WORKER_ID,results:h,finished:!0})}),(y.prototype=Object.create(k.prototype)).constructor=y,(E.prototype=Object.create(k.prototype)).constructor=E,(c.prototype=Object.create(c.prototype)).constructor=c,(w.prototype=Object.create(k.prototype)).constructor=w,u})});var mt=Rt((Dt,ft)=>{(function(e){typeof Dt=="object"&&typeof ft<"u"?ft.exports=e():typeof define=="function"&&define.amd?define([],e):(typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:this).JSZip=e()})(function(){return function e(o,n,r){function i(u,k){if(!n[u]){if(!o[u]){var y=typeof We=="function"&&We;if(!k&&y)return y(u,!0);if(s)return s(u,!0);var E=new Error("Cannot find module '"+u+"'");throw E.code="MODULE_NOT_FOUND",E}var c=n[u]={exports:{}};o[u][0].call(c.exports,function(w){var d=o[u][1][w];return i(d||w)},c,c.exports,e,o,n,r)}return n[u].exports}for(var s=typeof We=="function"&&We,l=0;l<r.length;l++)i(r[l]);return i}({1:[function(e,o,n){"use strict";var r=e("./utils"),i=e("./support"),s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";n.encode=function(l){for(var u,k,y,E,c,w,d,g=[],p=0,x=l.length,C=x,S=r.getTypeOf(l)!=="string";p<l.length;)C=x-p,y=S?(u=l[p++],k=p<x?l[p++]:0,p<x?l[p++]:0):(u=l.charCodeAt(p++),k=p<x?l.charCodeAt(p++):0,p<x?l.charCodeAt(p++):0),E=u>>2,c=(3&u)<<4|k>>4,w=1<C?(15&k)<<2|y>>6:64,d=2<C?63&y:64,g.push(s.charAt(E)+s.charAt(c)+s.charAt(w)+s.charAt(d));return g.join("")},n.decode=function(l){var u,k,y,E,c,w,d=0,g=0,p="data:";if(l.substr(0,p.length)===p)throw new Error("Invalid base64 input, it looks like a data url.");var x,C=3*(l=l.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(l.charAt(l.length-1)===s.charAt(64)&&C--,l.charAt(l.length-2)===s.charAt(64)&&C--,C%1!=0)throw new Error("Invalid base64 input, bad content length.");for(x=i.uint8array?new Uint8Array(0|C):new Array(0|C);d<l.length;)u=s.indexOf(l.charAt(d++))<<2|(E=s.indexOf(l.charAt(d++)))>>4,k=(15&E)<<4|(c=s.indexOf(l.charAt(d++)))>>2,y=(3&c)<<6|(w=s.indexOf(l.charAt(d++))),x[g++]=u,c!==64&&(x[g++]=k),w!==64&&(x[g++]=y);return x}},{"./support":30,"./utils":32}],2:[function(e,o,n){"use strict";var r=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),l=e("./stream/DataLengthProbe");function u(k,y,E,c,w){this.compressedSize=k,this.uncompressedSize=y,this.crc32=E,this.compression=c,this.compressedContent=w}u.prototype={getContentWorker:function(){var k=new i(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")),y=this;return k.on("end",function(){if(this.streamInfo.data_length!==y.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),k},getCompressedWorker:function(){return new i(r.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},u.createWorkerFrom=function(k,y,E){return k.pipe(new s).pipe(new l("uncompressedSize")).pipe(y.compressWorker(E)).pipe(new l("compressedSize")).withStreamInfo("compression",y)},o.exports=u},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,o,n){"use strict";var r=e("./stream/GenericWorker");n.STORE={magic:"\0\0",compressWorker:function(){return new r("STORE compression")},uncompressWorker:function(){return new r("STORE decompression")}},n.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,o,n){"use strict";var r=e("./utils"),i=function(){for(var s,l=[],u=0;u<256;u++){s=u;for(var k=0;k<8;k++)s=1&s?3988292384^s>>>1:s>>>1;l[u]=s}return l}();o.exports=function(s,l){return s!==void 0&&s.length?r.getTypeOf(s)!=="string"?function(u,k,y,E){var c=i,w=E+y;u^=-1;for(var d=E;d<w;d++)u=u>>>8^c[255&(u^k[d])];return-1^u}(0|l,s,s.length,0):function(u,k,y,E){var c=i,w=E+y;u^=-1;for(var d=E;d<w;d++)u=u>>>8^c[255&(u^k.charCodeAt(d))];return-1^u}(0|l,s,s.length,0):0}},{"./utils":32}],5:[function(e,o,n){"use strict";n.base64=!1,n.binary=!1,n.dir=!1,n.createFolders=!0,n.date=null,n.compression=null,n.compressionOptions=null,n.comment=null,n.unixPermissions=null,n.dosPermissions=null},{}],6:[function(e,o,n){"use strict";var r=null;r=typeof Promise<"u"?Promise:e("lie"),o.exports={Promise:r}},{lie:37}],7:[function(e,o,n){"use strict";var r=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Uint32Array<"u",i=e("pako"),s=e("./utils"),l=e("./stream/GenericWorker"),u=r?"uint8array":"array";function k(y,E){l.call(this,"FlateWorker/"+y),this._pako=null,this._pakoAction=y,this._pakoOptions=E,this.meta={}}n.magic="\b\0",s.inherits(k,l),k.prototype.processChunk=function(y){this.meta=y.meta,this._pako===null&&this._createPako(),this._pako.push(s.transformTo(u,y.data),!1)},k.prototype.flush=function(){l.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},k.prototype.cleanUp=function(){l.prototype.cleanUp.call(this),this._pako=null},k.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var y=this;this._pako.onData=function(E){y.push({data:E,meta:y.meta})}},n.compressWorker=function(y){return new k("Deflate",y)},n.uncompressWorker=function(){return new k("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,o,n){"use strict";function r(c,w){var d,g="";for(d=0;d<w;d++)g+=String.fromCharCode(255&c),c>>>=8;return g}function i(c,w,d,g,p,x){var C,S,v=c.file,M=c.compression,A=x!==u.utf8encode,h=s.transformTo("string",x(v.name)),f=s.transformTo("string",u.utf8encode(v.name)),B=v.comment,F=s.transformTo("string",x(B)),b=s.transformTo("string",u.utf8encode(B)),O=f.length!==v.name.length,a=b.length!==B.length,U="",re="",P="",te=v.dir,D=v.date,Q={crc32:0,compressedSize:0,uncompressedSize:0};w&&!d||(Q.crc32=c.crc32,Q.compressedSize=c.compressedSize,Q.uncompressedSize=c.uncompressedSize);var L=0;w&&(L|=8),A||!O&&!a||(L|=2048);var T=0,H=0;te&&(T|=16),p==="UNIX"?(H=798,T|=function(W,oe){var de=W;return W||(de=oe?16893:33204),(65535&de)<<16}(v.unixPermissions,te)):(H=20,T|=function(W){return 63&(W||0)}(v.dosPermissions)),C=D.getUTCHours(),C<<=6,C|=D.getUTCMinutes(),C<<=5,C|=D.getUTCSeconds()/2,S=D.getUTCFullYear()-1980,S<<=4,S|=D.getUTCMonth()+1,S<<=5,S|=D.getUTCDate(),O&&(re=r(1,1)+r(k(h),4)+f,U+="up"+r(re.length,2)+re),a&&(P=r(1,1)+r(k(F),4)+b,U+="uc"+r(P.length,2)+P);var G="";return G+=`
\0`,G+=r(L,2),G+=M.magic,G+=r(C,2),G+=r(S,2),G+=r(Q.crc32,4),G+=r(Q.compressedSize,4),G+=r(Q.uncompressedSize,4),G+=r(h.length,2),G+=r(U.length,2),{fileRecord:y.LOCAL_FILE_HEADER+G+h+U,dirRecord:y.CENTRAL_FILE_HEADER+r(H,2)+G+r(F.length,2)+"\0\0\0\0"+r(T,4)+r(g,4)+h+U+F}}var s=e("../utils"),l=e("../stream/GenericWorker"),u=e("../utf8"),k=e("../crc32"),y=e("../signature");function E(c,w,d,g){l.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=w,this.zipPlatform=d,this.encodeFileName=g,this.streamFiles=c,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}s.inherits(E,l),E.prototype.push=function(c){var w=c.meta.percent||0,d=this.entriesCount,g=this._sources.length;this.accumulate?this.contentBuffer.push(c):(this.bytesWritten+=c.data.length,l.prototype.push.call(this,{data:c.data,meta:{currentFile:this.currentFile,percent:d?(w+100*(d-g-1))/d:100}}))},E.prototype.openedSource=function(c){this.currentSourceOffset=this.bytesWritten,this.currentFile=c.file.name;var w=this.streamFiles&&!c.file.dir;if(w){var d=i(c,w,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:d.fileRecord,meta:{percent:0}})}else this.accumulate=!0},E.prototype.closedSource=function(c){this.accumulate=!1;var w=this.streamFiles&&!c.file.dir,d=i(c,w,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(d.dirRecord),w)this.push({data:function(g){return y.DATA_DESCRIPTOR+r(g.crc32,4)+r(g.compressedSize,4)+r(g.uncompressedSize,4)}(c),meta:{percent:100}});else for(this.push({data:d.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},E.prototype.flush=function(){for(var c=this.bytesWritten,w=0;w<this.dirRecords.length;w++)this.push({data:this.dirRecords[w],meta:{percent:100}});var d=this.bytesWritten-c,g=function(p,x,C,S,v){var M=s.transformTo("string",v(S));return y.CENTRAL_DIRECTORY_END+"\0\0\0\0"+r(p,2)+r(p,2)+r(x,4)+r(C,4)+r(M.length,2)+M}(this.dirRecords.length,d,c,this.zipComment,this.encodeFileName);this.push({data:g,meta:{percent:100}})},E.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},E.prototype.registerPrevious=function(c){this._sources.push(c);var w=this;return c.on("data",function(d){w.processChunk(d)}),c.on("end",function(){w.closedSource(w.previous.streamInfo),w._sources.length?w.prepareNextSource():w.end()}),c.on("error",function(d){w.error(d)}),this},E.prototype.resume=function(){return!!l.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},E.prototype.error=function(c){var w=this._sources;if(!l.prototype.error.call(this,c))return!1;for(var d=0;d<w.length;d++)try{w[d].error(c)}catch{}return!0},E.prototype.lock=function(){l.prototype.lock.call(this);for(var c=this._sources,w=0;w<c.length;w++)c[w].lock()},o.exports=E},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,o,n){"use strict";var r=e("../compressions"),i=e("./ZipFileWorker");n.generateWorker=function(s,l,u){var k=new i(l.streamFiles,u,l.platform,l.encodeFileName),y=0;try{s.forEach(function(E,c){y++;var w=function(x,C){var S=x||C,v=r[S];if(!v)throw new Error(S+" is not a valid compression method !");return v}(c.options.compression,l.compression),d=c.options.compressionOptions||l.compressionOptions||{},g=c.dir,p=c.date;c._compressWorker(w,d).withStreamInfo("file",{name:E,dir:g,date:p,comment:c.comment||"",unixPermissions:c.unixPermissions,dosPermissions:c.dosPermissions}).pipe(k)}),k.entriesCount=y}catch(E){k.error(E)}return k}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,o,n){"use strict";function r(){if(!(this instanceof r))return new r;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var i=new r;for(var s in this)typeof this[s]!="function"&&(i[s]=this[s]);return i}}(r.prototype=e("./object")).loadAsync=e("./load"),r.support=e("./support"),r.defaults=e("./defaults"),r.version="3.10.1",r.loadAsync=function(i,s){return new r().loadAsync(i,s)},r.external=e("./external"),o.exports=r},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,o,n){"use strict";var r=e("./utils"),i=e("./external"),s=e("./utf8"),l=e("./zipEntries"),u=e("./stream/Crc32Probe"),k=e("./nodejsUtils");function y(E){return new i.Promise(function(c,w){var d=E.decompressed.getContentWorker().pipe(new u);d.on("error",function(g){w(g)}).on("end",function(){d.streamInfo.crc32!==E.decompressed.crc32?w(new Error("Corrupted zip : CRC32 mismatch")):c()}).resume()})}o.exports=function(E,c){var w=this;return c=r.extend(c||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:s.utf8decode}),k.isNode&&k.isStream(E)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):r.prepareContent("the loaded zip file",E,!0,c.optimizedBinaryString,c.base64).then(function(d){var g=new l(c);return g.load(d),g}).then(function(d){var g=[i.Promise.resolve(d)],p=d.files;if(c.checkCRC32)for(var x=0;x<p.length;x++)g.push(y(p[x]));return i.Promise.all(g)}).then(function(d){for(var g=d.shift(),p=g.files,x=0;x<p.length;x++){var C=p[x],S=C.fileNameStr,v=r.resolve(C.fileNameStr);w.file(v,C.decompressed,{binary:!0,optimizedBinaryString:!0,date:C.date,dir:C.dir,comment:C.fileCommentStr.length?C.fileCommentStr:null,unixPermissions:C.unixPermissions,dosPermissions:C.dosPermissions,createFolders:c.createFolders}),C.dir||(w.file(v).unsafeOriginalName=S)}return g.zipComment.length&&(w.comment=g.zipComment),w})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,o,n){"use strict";var r=e("../utils"),i=e("../stream/GenericWorker");function s(l,u){i.call(this,"Nodejs stream input adapter for "+l),this._upstreamEnded=!1,this._bindStream(u)}r.inherits(s,i),s.prototype._bindStream=function(l){var u=this;(this._stream=l).pause(),l.on("data",function(k){u.push({data:k,meta:{percent:0}})}).on("error",function(k){u.isPaused?this.generatedError=k:u.error(k)}).on("end",function(){u.isPaused?u._upstreamEnded=!0:u.end()})},s.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},o.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,o,n){"use strict";var r=e("readable-stream").Readable;function i(s,l,u){r.call(this,l),this._helper=s;var k=this;s.on("data",function(y,E){k.push(y)||k._helper.pause(),u&&u(E)}).on("error",function(y){k.emit("error",y)}).on("end",function(){k.push(null)})}e("../utils").inherits(i,r),i.prototype._read=function(){this._helper.resume()},o.exports=i},{"../utils":32,"readable-stream":16}],14:[function(e,o,n){"use strict";o.exports={isNode:typeof Buffer<"u",newBufferFrom:function(r,i){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(r,i);if(typeof r=="number")throw new Error('The "data" argument must not be a number');return new Buffer(r,i)},allocBuffer:function(r){if(Buffer.alloc)return Buffer.alloc(r);var i=new Buffer(r);return i.fill(0),i},isBuffer:function(r){return Buffer.isBuffer(r)},isStream:function(r){return r&&typeof r.on=="function"&&typeof r.pause=="function"&&typeof r.resume=="function"}}},{}],15:[function(e,o,n){"use strict";function r(v,M,A){var h,f=s.getTypeOf(M),B=s.extend(A||{},k);B.date=B.date||new Date,B.compression!==null&&(B.compression=B.compression.toUpperCase()),typeof B.unixPermissions=="string"&&(B.unixPermissions=parseInt(B.unixPermissions,8)),B.unixPermissions&&16384&B.unixPermissions&&(B.dir=!0),B.dosPermissions&&16&B.dosPermissions&&(B.dir=!0),B.dir&&(v=p(v)),B.createFolders&&(h=g(v))&&x.call(this,h,!0);var F=f==="string"&&B.binary===!1&&B.base64===!1;A&&A.binary!==void 0||(B.binary=!F),(M instanceof y&&M.uncompressedSize===0||B.dir||!M||M.length===0)&&(B.base64=!1,B.binary=!0,M="",B.compression="STORE",f="string");var b=null;b=M instanceof y||M instanceof l?M:w.isNode&&w.isStream(M)?new d(v,M):s.prepareContent(v,M,B.binary,B.optimizedBinaryString,B.base64);var O=new E(v,b,B);this.files[v]=O}var i=e("./utf8"),s=e("./utils"),l=e("./stream/GenericWorker"),u=e("./stream/StreamHelper"),k=e("./defaults"),y=e("./compressedObject"),E=e("./zipObject"),c=e("./generate"),w=e("./nodejsUtils"),d=e("./nodejs/NodejsStreamInputAdapter"),g=function(v){v.slice(-1)==="/"&&(v=v.substring(0,v.length-1));var M=v.lastIndexOf("/");return 0<M?v.substring(0,M):""},p=function(v){return v.slice(-1)!=="/"&&(v+="/"),v},x=function(v,M){return M=M!==void 0?M:k.createFolders,v=p(v),this.files[v]||r.call(this,v,null,{dir:!0,createFolders:M}),this.files[v]};function C(v){return Object.prototype.toString.call(v)==="[object RegExp]"}var S={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(v){var M,A,h;for(M in this.files)h=this.files[M],(A=M.slice(this.root.length,M.length))&&M.slice(0,this.root.length)===this.root&&v(A,h)},filter:function(v){var M=[];return this.forEach(function(A,h){v(A,h)&&M.push(h)}),M},file:function(v,M,A){if(arguments.length!==1)return v=this.root+v,r.call(this,v,M,A),this;if(C(v)){var h=v;return this.filter(function(B,F){return!F.dir&&h.test(B)})}var f=this.files[this.root+v];return f&&!f.dir?f:null},folder:function(v){if(!v)return this;if(C(v))return this.filter(function(f,B){return B.dir&&v.test(f)});var M=this.root+v,A=x.call(this,M),h=this.clone();return h.root=A.name,h},remove:function(v){v=this.root+v;var M=this.files[v];if(M||(v.slice(-1)!=="/"&&(v+="/"),M=this.files[v]),M&&!M.dir)delete this.files[v];else for(var A=this.filter(function(f,B){return B.name.slice(0,v.length)===v}),h=0;h<A.length;h++)delete this.files[A[h].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(v){var M,A={};try{if((A=s.extend(v||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=A.type.toLowerCase(),A.compression=A.compression.toUpperCase(),A.type==="binarystring"&&(A.type="string"),!A.type)throw new Error("No output type specified.");s.checkSupport(A.type),A.platform!=="darwin"&&A.platform!=="freebsd"&&A.platform!=="linux"&&A.platform!=="sunos"||(A.platform="UNIX"),A.platform==="win32"&&(A.platform="DOS");var h=A.comment||this.comment||"";M=c.generateWorker(this,A,h)}catch(f){(M=new l("error")).error(f)}return new u(M,A.type||"string",A.mimeType)},generateAsync:function(v,M){return this.generateInternalStream(v).accumulate(M)},generateNodeStream:function(v,M){return(v=v||{}).type||(v.type="nodebuffer"),this.generateInternalStream(v).toNodejsStream(M)}};o.exports=S},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,o,n){"use strict";o.exports=e("stream")},{stream:void 0}],17:[function(e,o,n){"use strict";var r=e("./DataReader");function i(s){r.call(this,s);for(var l=0;l<this.data.length;l++)s[l]=255&s[l]}e("../utils").inherits(i,r),i.prototype.byteAt=function(s){return this.data[this.zero+s]},i.prototype.lastIndexOfSignature=function(s){for(var l=s.charCodeAt(0),u=s.charCodeAt(1),k=s.charCodeAt(2),y=s.charCodeAt(3),E=this.length-4;0<=E;--E)if(this.data[E]===l&&this.data[E+1]===u&&this.data[E+2]===k&&this.data[E+3]===y)return E-this.zero;return-1},i.prototype.readAndCheckSignature=function(s){var l=s.charCodeAt(0),u=s.charCodeAt(1),k=s.charCodeAt(2),y=s.charCodeAt(3),E=this.readData(4);return l===E[0]&&u===E[1]&&k===E[2]&&y===E[3]},i.prototype.readData=function(s){if(this.checkOffset(s),s===0)return[];var l=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,l},o.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,o,n){"use strict";var r=e("../utils");function i(s){this.data=s,this.length=s.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(s){this.checkIndex(this.index+s)},checkIndex:function(s){if(this.length<this.zero+s||s<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+s+"). Corrupted zip ?")},setIndex:function(s){this.checkIndex(s),this.index=s},skip:function(s){this.setIndex(this.index+s)},byteAt:function(){},readInt:function(s){var l,u=0;for(this.checkOffset(s),l=this.index+s-1;l>=this.index;l--)u=(u<<8)+this.byteAt(l);return this.index+=s,u},readString:function(s){return r.transformTo("string",this.readData(s))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var s=this.readInt(4);return new Date(Date.UTC(1980+(s>>25&127),(s>>21&15)-1,s>>16&31,s>>11&31,s>>5&63,(31&s)<<1))}},o.exports=i},{"../utils":32}],19:[function(e,o,n){"use strict";var r=e("./Uint8ArrayReader");function i(s){r.call(this,s)}e("../utils").inherits(i,r),i.prototype.readData=function(s){this.checkOffset(s);var l=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,l},o.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,o,n){"use strict";var r=e("./DataReader");function i(s){r.call(this,s)}e("../utils").inherits(i,r),i.prototype.byteAt=function(s){return this.data.charCodeAt(this.zero+s)},i.prototype.lastIndexOfSignature=function(s){return this.data.lastIndexOf(s)-this.zero},i.prototype.readAndCheckSignature=function(s){return s===this.readData(4)},i.prototype.readData=function(s){this.checkOffset(s);var l=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,l},o.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,o,n){"use strict";var r=e("./ArrayReader");function i(s){r.call(this,s)}e("../utils").inherits(i,r),i.prototype.readData=function(s){if(this.checkOffset(s),s===0)return new Uint8Array(0);var l=this.data.subarray(this.zero+this.index,this.zero+this.index+s);return this.index+=s,l},o.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,o,n){"use strict";var r=e("../utils"),i=e("../support"),s=e("./ArrayReader"),l=e("./StringReader"),u=e("./NodeBufferReader"),k=e("./Uint8ArrayReader");o.exports=function(y){var E=r.getTypeOf(y);return r.checkSupport(E),E!=="string"||i.uint8array?E==="nodebuffer"?new u(y):i.uint8array?new k(r.transformTo("uint8array",y)):new s(r.transformTo("array",y)):new l(y)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,o,n){"use strict";n.LOCAL_FILE_HEADER="PK",n.CENTRAL_FILE_HEADER="PK",n.CENTRAL_DIRECTORY_END="PK",n.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",n.ZIP64_CENTRAL_DIRECTORY_END="PK",n.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(e,o,n){"use strict";var r=e("./GenericWorker"),i=e("../utils");function s(l){r.call(this,"ConvertWorker to "+l),this.destType=l}i.inherits(s,r),s.prototype.processChunk=function(l){this.push({data:i.transformTo(this.destType,l.data),meta:l.meta})},o.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(e,o,n){"use strict";var r=e("./GenericWorker"),i=e("../crc32");function s(){r.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(s,r),s.prototype.processChunk=function(l){this.streamInfo.crc32=i(l.data,this.streamInfo.crc32||0),this.push(l)},o.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,o,n){"use strict";var r=e("../utils"),i=e("./GenericWorker");function s(l){i.call(this,"DataLengthProbe for "+l),this.propName=l,this.withStreamInfo(l,0)}r.inherits(s,i),s.prototype.processChunk=function(l){if(l){var u=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=u+l.data.length}i.prototype.processChunk.call(this,l)},o.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(e,o,n){"use strict";var r=e("../utils"),i=e("./GenericWorker");function s(l){i.call(this,"DataWorker");var u=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,l.then(function(k){u.dataIsReady=!0,u.data=k,u.max=k&&k.length||0,u.type=r.getTypeOf(k),u.isPaused||u._tickAndRepeat()},function(k){u.error(k)})}r.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,r.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(r.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var l=null,u=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":l=this.data.substring(this.index,u);break;case"uint8array":l=this.data.subarray(this.index,u);break;case"array":case"nodebuffer":l=this.data.slice(this.index,u)}return this.index=u,this.push({data:l,meta:{percent:this.max?this.index/this.max*100:0}})},o.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(e,o,n){"use strict";function r(i){this.name=i||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}r.prototype={push:function(i){this.emit("data",i)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(i){this.emit("error",i)}return!0},error:function(i){return!this.isFinished&&(this.isPaused?this.generatedError=i:(this.isFinished=!0,this.emit("error",i),this.previous&&this.previous.error(i),this.cleanUp()),!0)},on:function(i,s){return this._listeners[i].push(s),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(i,s){if(this._listeners[i])for(var l=0;l<this._listeners[i].length;l++)this._listeners[i][l].call(this,s)},pipe:function(i){return i.registerPrevious(this)},registerPrevious:function(i){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=i.streamInfo,this.mergeStreamInfo(),this.previous=i;var s=this;return i.on("data",function(l){s.processChunk(l)}),i.on("end",function(){s.end()}),i.on("error",function(l){s.error(l)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var i=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),i=!0),this.previous&&this.previous.resume(),!i},flush:function(){},processChunk:function(i){this.push(i)},withStreamInfo:function(i,s){return this.extraStreamInfo[i]=s,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var i in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,i)&&(this.streamInfo[i]=this.extraStreamInfo[i])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var i="Worker "+this.name;return this.previous?this.previous+" -> "+i:i}},o.exports=r},{}],29:[function(e,o,n){"use strict";var r=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),l=e("../base64"),u=e("../support"),k=e("../external"),y=null;if(u.nodestream)try{y=e("../nodejs/NodejsStreamOutputAdapter")}catch{}function E(w,d){return new k.Promise(function(g,p){var x=[],C=w._internalType,S=w._outputType,v=w._mimeType;w.on("data",function(M,A){x.push(M),d&&d(A)}).on("error",function(M){x=[],p(M)}).on("end",function(){try{var M=function(A,h,f){switch(A){case"blob":return r.newBlob(r.transformTo("arraybuffer",h),f);case"base64":return l.encode(h);default:return r.transformTo(A,h)}}(S,function(A,h){var f,B=0,F=null,b=0;for(f=0;f<h.length;f++)b+=h[f].length;switch(A){case"string":return h.join("");case"array":return Array.prototype.concat.apply([],h);case"uint8array":for(F=new Uint8Array(b),f=0;f<h.length;f++)F.set(h[f],B),B+=h[f].length;return F;case"nodebuffer":return Buffer.concat(h);default:throw new Error("concat : unsupported type '"+A+"'")}}(C,x),v);g(M)}catch(A){p(A)}x=[]}).resume()})}function c(w,d,g){var p=d;switch(d){case"blob":case"arraybuffer":p="uint8array";break;case"base64":p="string"}try{this._internalType=p,this._outputType=d,this._mimeType=g,r.checkSupport(p),this._worker=w.pipe(new i(p)),w.lock()}catch(x){this._worker=new s("error"),this._worker.error(x)}}c.prototype={accumulate:function(w){return E(this,w)},on:function(w,d){var g=this;return w==="data"?this._worker.on(w,function(p){d.call(g,p.data,p.meta)}):this._worker.on(w,function(){r.delay(d,arguments,g)}),this},resume:function(){return r.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(w){if(r.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new y(this,{objectMode:this._outputType!=="nodebuffer"},w)}},o.exports=c},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,o,n){"use strict";if(n.base64=!0,n.array=!0,n.string=!0,n.arraybuffer=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u",n.nodebuffer=typeof Buffer<"u",n.uint8array=typeof Uint8Array<"u",typeof ArrayBuffer>"u")n.blob=!1;else{var r=new ArrayBuffer(0);try{n.blob=new Blob([r],{type:"application/zip"}).size===0}catch{try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(r),n.blob=i.getBlob("application/zip").size===0}catch{n.blob=!1}}}try{n.nodestream=!!e("readable-stream").Readable}catch{n.nodestream=!1}},{"readable-stream":16}],31:[function(e,o,n){"use strict";for(var r=e("./utils"),i=e("./support"),s=e("./nodejsUtils"),l=e("./stream/GenericWorker"),u=new Array(256),k=0;k<256;k++)u[k]=252<=k?6:248<=k?5:240<=k?4:224<=k?3:192<=k?2:1;u[254]=u[254]=1;function y(){l.call(this,"utf-8 decode"),this.leftOver=null}function E(){l.call(this,"utf-8 encode")}n.utf8encode=function(c){return i.nodebuffer?s.newBufferFrom(c,"utf-8"):function(w){var d,g,p,x,C,S=w.length,v=0;for(x=0;x<S;x++)(64512&(g=w.charCodeAt(x)))==55296&&x+1<S&&(64512&(p=w.charCodeAt(x+1)))==56320&&(g=65536+(g-55296<<10)+(p-56320),x++),v+=g<128?1:g<2048?2:g<65536?3:4;for(d=i.uint8array?new Uint8Array(v):new Array(v),x=C=0;C<v;x++)(64512&(g=w.charCodeAt(x)))==55296&&x+1<S&&(64512&(p=w.charCodeAt(x+1)))==56320&&(g=65536+(g-55296<<10)+(p-56320),x++),g<128?d[C++]=g:(g<2048?d[C++]=192|g>>>6:(g<65536?d[C++]=224|g>>>12:(d[C++]=240|g>>>18,d[C++]=128|g>>>12&63),d[C++]=128|g>>>6&63),d[C++]=128|63&g);return d}(c)},n.utf8decode=function(c){return i.nodebuffer?r.transformTo("nodebuffer",c).toString("utf-8"):function(w){var d,g,p,x,C=w.length,S=new Array(2*C);for(d=g=0;d<C;)if((p=w[d++])<128)S[g++]=p;else if(4<(x=u[p]))S[g++]=65533,d+=x-1;else{for(p&=x===2?31:x===3?15:7;1<x&&d<C;)p=p<<6|63&w[d++],x--;1<x?S[g++]=65533:p<65536?S[g++]=p:(p-=65536,S[g++]=55296|p>>10&1023,S[g++]=56320|1023&p)}return S.length!==g&&(S.subarray?S=S.subarray(0,g):S.length=g),r.applyFromCharCode(S)}(c=r.transformTo(i.uint8array?"uint8array":"array",c))},r.inherits(y,l),y.prototype.processChunk=function(c){var w=r.transformTo(i.uint8array?"uint8array":"array",c.data);if(this.leftOver&&this.leftOver.length){if(i.uint8array){var d=w;(w=new Uint8Array(d.length+this.leftOver.length)).set(this.leftOver,0),w.set(d,this.leftOver.length)}else w=this.leftOver.concat(w);this.leftOver=null}var g=function(x,C){var S;for((C=C||x.length)>x.length&&(C=x.length),S=C-1;0<=S&&(192&x[S])==128;)S--;return S<0||S===0?C:S+u[x[S]]>C?S:C}(w),p=w;g!==w.length&&(i.uint8array?(p=w.subarray(0,g),this.leftOver=w.subarray(g,w.length)):(p=w.slice(0,g),this.leftOver=w.slice(g,w.length))),this.push({data:n.utf8decode(p),meta:c.meta})},y.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:n.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},n.Utf8DecodeWorker=y,r.inherits(E,l),E.prototype.processChunk=function(c){this.push({data:n.utf8encode(c.data),meta:c.meta})},n.Utf8EncodeWorker=E},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,o,n){"use strict";var r=e("./support"),i=e("./base64"),s=e("./nodejsUtils"),l=e("./external");function u(d){return d}function k(d,g){for(var p=0;p<d.length;++p)g[p]=255&d.charCodeAt(p);return g}e("setimmediate"),n.newBlob=function(d,g){n.checkSupport("blob");try{return new Blob([d],{type:g})}catch{try{var p=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return p.append(d),p.getBlob(g)}catch{throw new Error("Bug : can't construct the Blob.")}}};var y={stringifyByChunk:function(d,g,p){var x=[],C=0,S=d.length;if(S<=p)return String.fromCharCode.apply(null,d);for(;C<S;)g==="array"||g==="nodebuffer"?x.push(String.fromCharCode.apply(null,d.slice(C,Math.min(C+p,S)))):x.push(String.fromCharCode.apply(null,d.subarray(C,Math.min(C+p,S)))),C+=p;return x.join("")},stringifyByChar:function(d){for(var g="",p=0;p<d.length;p++)g+=String.fromCharCode(d[p]);return g},applyCanBeUsed:{uint8array:function(){try{return r.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return r.nodebuffer&&String.fromCharCode.apply(null,s.allocBuffer(1)).length===1}catch{return!1}}()}};function E(d){var g=65536,p=n.getTypeOf(d),x=!0;if(p==="uint8array"?x=y.applyCanBeUsed.uint8array:p==="nodebuffer"&&(x=y.applyCanBeUsed.nodebuffer),x)for(;1<g;)try{return y.stringifyByChunk(d,p,g)}catch{g=Math.floor(g/2)}return y.stringifyByChar(d)}function c(d,g){for(var p=0;p<d.length;p++)g[p]=d[p];return g}n.applyFromCharCode=E;var w={};w.string={string:u,array:function(d){return k(d,new Array(d.length))},arraybuffer:function(d){return w.string.uint8array(d).buffer},uint8array:function(d){return k(d,new Uint8Array(d.length))},nodebuffer:function(d){return k(d,s.allocBuffer(d.length))}},w.array={string:E,array:u,arraybuffer:function(d){return new Uint8Array(d).buffer},uint8array:function(d){return new Uint8Array(d)},nodebuffer:function(d){return s.newBufferFrom(d)}},w.arraybuffer={string:function(d){return E(new Uint8Array(d))},array:function(d){return c(new Uint8Array(d),new Array(d.byteLength))},arraybuffer:u,uint8array:function(d){return new Uint8Array(d)},nodebuffer:function(d){return s.newBufferFrom(new Uint8Array(d))}},w.uint8array={string:E,array:function(d){return c(d,new Array(d.length))},arraybuffer:function(d){return d.buffer},uint8array:u,nodebuffer:function(d){return s.newBufferFrom(d)}},w.nodebuffer={string:E,array:function(d){return c(d,new Array(d.length))},arraybuffer:function(d){return w.nodebuffer.uint8array(d).buffer},uint8array:function(d){return c(d,new Uint8Array(d.length))},nodebuffer:u},n.transformTo=function(d,g){if(g=g||"",!d)return g;n.checkSupport(d);var p=n.getTypeOf(g);return w[p][d](g)},n.resolve=function(d){for(var g=d.split("/"),p=[],x=0;x<g.length;x++){var C=g[x];C==="."||C===""&&x!==0&&x!==g.length-1||(C===".."?p.pop():p.push(C))}return p.join("/")},n.getTypeOf=function(d){return typeof d=="string"?"string":Object.prototype.toString.call(d)==="[object Array]"?"array":r.nodebuffer&&s.isBuffer(d)?"nodebuffer":r.uint8array&&d instanceof Uint8Array?"uint8array":r.arraybuffer&&d instanceof ArrayBuffer?"arraybuffer":void 0},n.checkSupport=function(d){if(!r[d.toLowerCase()])throw new Error(d+" is not supported by this platform")},n.MAX_VALUE_16BITS=65535,n.MAX_VALUE_32BITS=-1,n.pretty=function(d){var g,p,x="";for(p=0;p<(d||"").length;p++)x+="\\x"+((g=d.charCodeAt(p))<16?"0":"")+g.toString(16).toUpperCase();return x},n.delay=function(d,g,p){setImmediate(function(){d.apply(p||null,g||[])})},n.inherits=function(d,g){function p(){}p.prototype=g.prototype,d.prototype=new p},n.extend=function(){var d,g,p={};for(d=0;d<arguments.length;d++)for(g in arguments[d])Object.prototype.hasOwnProperty.call(arguments[d],g)&&p[g]===void 0&&(p[g]=arguments[d][g]);return p},n.prepareContent=function(d,g,p,x,C){return l.Promise.resolve(g).then(function(S){return r.blob&&(S instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(S))!==-1)&&typeof FileReader<"u"?new l.Promise(function(v,M){var A=new FileReader;A.onload=function(h){v(h.target.result)},A.onerror=function(h){M(h.target.error)},A.readAsArrayBuffer(S)}):S}).then(function(S){var v=n.getTypeOf(S);return v?(v==="arraybuffer"?S=n.transformTo("uint8array",S):v==="string"&&(C?S=i.decode(S):p&&x!==!0&&(S=function(M){return k(M,r.uint8array?new Uint8Array(M.length):new Array(M.length))}(S))),S):l.Promise.reject(new Error("Can't read the data of '"+d+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,o,n){"use strict";var r=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),l=e("./zipEntry"),u=e("./support");function k(y){this.files=[],this.loadOptions=y}k.prototype={checkSignature:function(y){if(!this.reader.readAndCheckSignature(y)){this.reader.index-=4;var E=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(E)+", expected "+i.pretty(y)+")")}},isSignature:function(y,E){var c=this.reader.index;this.reader.setIndex(y);var w=this.reader.readString(4)===E;return this.reader.setIndex(c),w},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var y=this.reader.readData(this.zipCommentLength),E=u.uint8array?"uint8array":"array",c=i.transformTo(E,y);this.zipComment=this.loadOptions.decodeFileName(c)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var y,E,c,w=this.zip64EndOfCentralSize-44;0<w;)y=this.reader.readInt(2),E=this.reader.readInt(4),c=this.reader.readData(E),this.zip64ExtensibleData[y]={id:y,length:E,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var y,E;for(y=0;y<this.files.length;y++)E=this.files[y],this.reader.setIndex(E.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),E.readLocalPart(this.reader),E.handleUTF8(),E.processAttributes()},readCentralDir:function(){var y;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(y=new l({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(y);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var y=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(y<0)throw this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(y);var E=y;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(y=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(y),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var c=this.centralDirOffset+this.centralDirSize;this.zip64&&(c+=20,c+=12+this.zip64EndOfCentralSize);var w=E-c;if(0<w)this.isSignature(E,s.CENTRAL_FILE_HEADER)||(this.reader.zero=w);else if(w<0)throw new Error("Corrupted zip: missing "+Math.abs(w)+" bytes.")},prepareReader:function(y){this.reader=r(y)},load:function(y){this.prepareReader(y),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},o.exports=k},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,o,n){"use strict";var r=e("./reader/readerFor"),i=e("./utils"),s=e("./compressedObject"),l=e("./crc32"),u=e("./utf8"),k=e("./compressions"),y=e("./support");function E(c,w){this.options=c,this.loadOptions=w}E.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(c){var w,d;if(c.skip(22),this.fileNameLength=c.readInt(2),d=c.readInt(2),this.fileName=c.readData(this.fileNameLength),c.skip(d),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((w=function(g){for(var p in k)if(Object.prototype.hasOwnProperty.call(k,p)&&k[p].magic===g)return k[p];return null}(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+i.pretty(this.compressionMethod)+" unknown (inner file : "+i.transformTo("string",this.fileName)+")");this.decompressed=new s(this.compressedSize,this.uncompressedSize,this.crc32,w,c.readData(this.compressedSize))},readCentralPart:function(c){this.versionMadeBy=c.readInt(2),c.skip(2),this.bitFlag=c.readInt(2),this.compressionMethod=c.readString(2),this.date=c.readDate(),this.crc32=c.readInt(4),this.compressedSize=c.readInt(4),this.uncompressedSize=c.readInt(4);var w=c.readInt(2);if(this.extraFieldsLength=c.readInt(2),this.fileCommentLength=c.readInt(2),this.diskNumberStart=c.readInt(2),this.internalFileAttributes=c.readInt(2),this.externalFileAttributes=c.readInt(4),this.localHeaderOffset=c.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");c.skip(w),this.readExtraFields(c),this.parseZIP64ExtraField(c),this.fileComment=c.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var c=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),c==0&&(this.dosPermissions=63&this.externalFileAttributes),c==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var c=r(this.extraFields[1].value);this.uncompressedSize===i.MAX_VALUE_32BITS&&(this.uncompressedSize=c.readInt(8)),this.compressedSize===i.MAX_VALUE_32BITS&&(this.compressedSize=c.readInt(8)),this.localHeaderOffset===i.MAX_VALUE_32BITS&&(this.localHeaderOffset=c.readInt(8)),this.diskNumberStart===i.MAX_VALUE_32BITS&&(this.diskNumberStart=c.readInt(4))}},readExtraFields:function(c){var w,d,g,p=c.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});c.index+4<p;)w=c.readInt(2),d=c.readInt(2),g=c.readData(d),this.extraFields[w]={id:w,length:d,value:g};c.setIndex(p)},handleUTF8:function(){var c=y.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=u.utf8decode(this.fileName),this.fileCommentStr=u.utf8decode(this.fileComment);else{var w=this.findExtraFieldUnicodePath();if(w!==null)this.fileNameStr=w;else{var d=i.transformTo(c,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(d)}var g=this.findExtraFieldUnicodeComment();if(g!==null)this.fileCommentStr=g;else{var p=i.transformTo(c,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(p)}}},findExtraFieldUnicodePath:function(){var c=this.extraFields[28789];if(c){var w=r(c.value);return w.readInt(1)!==1||l(this.fileName)!==w.readInt(4)?null:u.utf8decode(w.readData(c.length-5))}return null},findExtraFieldUnicodeComment:function(){var c=this.extraFields[25461];if(c){var w=r(c.value);return w.readInt(1)!==1||l(this.fileComment)!==w.readInt(4)?null:u.utf8decode(w.readData(c.length-5))}return null}},o.exports=E},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,o,n){"use strict";function r(w,d,g){this.name=w,this.dir=g.dir,this.date=g.date,this.comment=g.comment,this.unixPermissions=g.unixPermissions,this.dosPermissions=g.dosPermissions,this._data=d,this._dataBinary=g.binary,this.options={compression:g.compression,compressionOptions:g.compressionOptions}}var i=e("./stream/StreamHelper"),s=e("./stream/DataWorker"),l=e("./utf8"),u=e("./compressedObject"),k=e("./stream/GenericWorker");r.prototype={internalStream:function(w){var d=null,g="string";try{if(!w)throw new Error("No output type specified.");var p=(g=w.toLowerCase())==="string"||g==="text";g!=="binarystring"&&g!=="text"||(g="string"),d=this._decompressWorker();var x=!this._dataBinary;x&&!p&&(d=d.pipe(new l.Utf8EncodeWorker)),!x&&p&&(d=d.pipe(new l.Utf8DecodeWorker))}catch(C){(d=new k("error")).error(C)}return new i(d,g,"")},async:function(w,d){return this.internalStream(w).accumulate(d)},nodeStream:function(w,d){return this.internalStream(w||"nodebuffer").toNodejsStream(d)},_compressWorker:function(w,d){if(this._data instanceof u&&this._data.compression.magic===w.magic)return this._data.getCompressedWorker();var g=this._decompressWorker();return this._dataBinary||(g=g.pipe(new l.Utf8EncodeWorker)),u.createWorkerFrom(g,w,d)},_decompressWorker:function(){return this._data instanceof u?this._data.getContentWorker():this._data instanceof k?this._data:new s(this._data)}};for(var y=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],E=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},c=0;c<y.length;c++)r.prototype[y[c]]=E;o.exports=r},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,o,n){(function(r){"use strict";var i,s,l=r.MutationObserver||r.WebKitMutationObserver;if(l){var u=0,k=new l(w),y=r.document.createTextNode("");k.observe(y,{characterData:!0}),i=function(){y.data=u=++u%2}}else if(r.setImmediate||r.MessageChannel===void 0)i="document"in r&&"onreadystatechange"in r.document.createElement("script")?function(){var d=r.document.createElement("script");d.onreadystatechange=function(){w(),d.onreadystatechange=null,d.parentNode.removeChild(d),d=null},r.document.documentElement.appendChild(d)}:function(){setTimeout(w,0)};else{var E=new r.MessageChannel;E.port1.onmessage=w,i=function(){E.port2.postMessage(0)}}var c=[];function w(){var d,g;s=!0;for(var p=c.length;p;){for(g=c,c=[],d=-1;++d<p;)g[d]();p=c.length}s=!1}o.exports=function(d){c.push(d)!==1||s||i()}}).call(this,typeof global<"u"?global:typeof self<"u"?self:typeof window<"u"?window:{})},{}],37:[function(e,o,n){"use strict";var r=e("immediate");function i(){}var s={},l=["REJECTED"],u=["FULFILLED"],k=["PENDING"];function y(p){if(typeof p!="function")throw new TypeError("resolver must be a function");this.state=k,this.queue=[],this.outcome=void 0,p!==i&&d(this,p)}function E(p,x,C){this.promise=p,typeof x=="function"&&(this.onFulfilled=x,this.callFulfilled=this.otherCallFulfilled),typeof C=="function"&&(this.onRejected=C,this.callRejected=this.otherCallRejected)}function c(p,x,C){r(function(){var S;try{S=x(C)}catch(v){return s.reject(p,v)}S===p?s.reject(p,new TypeError("Cannot resolve promise with itself")):s.resolve(p,S)})}function w(p){var x=p&&p.then;if(p&&(typeof p=="object"||typeof p=="function")&&typeof x=="function")return function(){x.apply(p,arguments)}}function d(p,x){var C=!1;function S(A){C||(C=!0,s.reject(p,A))}function v(A){C||(C=!0,s.resolve(p,A))}var M=g(function(){x(v,S)});M.status==="error"&&S(M.value)}function g(p,x){var C={};try{C.value=p(x),C.status="success"}catch(S){C.status="error",C.value=S}return C}(o.exports=y).prototype.finally=function(p){if(typeof p!="function")return this;var x=this.constructor;return this.then(function(C){return x.resolve(p()).then(function(){return C})},function(C){return x.resolve(p()).then(function(){throw C})})},y.prototype.catch=function(p){return this.then(null,p)},y.prototype.then=function(p,x){if(typeof p!="function"&&this.state===u||typeof x!="function"&&this.state===l)return this;var C=new this.constructor(i);return this.state!==k?c(C,this.state===u?p:x,this.outcome):this.queue.push(new E(C,p,x)),C},E.prototype.callFulfilled=function(p){s.resolve(this.promise,p)},E.prototype.otherCallFulfilled=function(p){c(this.promise,this.onFulfilled,p)},E.prototype.callRejected=function(p){s.reject(this.promise,p)},E.prototype.otherCallRejected=function(p){c(this.promise,this.onRejected,p)},s.resolve=function(p,x){var C=g(w,x);if(C.status==="error")return s.reject(p,C.value);var S=C.value;if(S)d(p,S);else{p.state=u,p.outcome=x;for(var v=-1,M=p.queue.length;++v<M;)p.queue[v].callFulfilled(x)}return p},s.reject=function(p,x){p.state=l,p.outcome=x;for(var C=-1,S=p.queue.length;++C<S;)p.queue[C].callRejected(x);return p},y.resolve=function(p){return p instanceof this?p:s.resolve(new this(i),p)},y.reject=function(p){var x=new this(i);return s.reject(x,p)},y.all=function(p){var x=this;if(Object.prototype.toString.call(p)!=="[object Array]")return this.reject(new TypeError("must be an array"));var C=p.length,S=!1;if(!C)return this.resolve([]);for(var v=new Array(C),M=0,A=-1,h=new this(i);++A<C;)f(p[A],A);return h;function f(B,F){x.resolve(B).then(function(b){v[F]=b,++M!==C||S||(S=!0,s.resolve(h,v))},function(b){S||(S=!0,s.reject(h,b))})}},y.race=function(p){var x=this;if(Object.prototype.toString.call(p)!=="[object Array]")return this.reject(new TypeError("must be an array"));var C=p.length,S=!1;if(!C)return this.resolve([]);for(var v=-1,M=new this(i);++v<C;)A=p[v],x.resolve(A).then(function(h){S||(S=!0,s.resolve(M,h))},function(h){S||(S=!0,s.reject(M,h))});var A;return M}},{immediate:36}],38:[function(e,o,n){"use strict";var r={};(0,e("./lib/utils/common").assign)(r,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),o.exports=r},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,o,n){"use strict";var r=e("./zlib/deflate"),i=e("./utils/common"),s=e("./utils/strings"),l=e("./zlib/messages"),u=e("./zlib/zstream"),k=Object.prototype.toString,y=0,E=-1,c=0,w=8;function d(p){if(!(this instanceof d))return new d(p);this.options=i.assign({level:E,method:w,chunkSize:16384,windowBits:15,memLevel:8,strategy:c,to:""},p||{});var x=this.options;x.raw&&0<x.windowBits?x.windowBits=-x.windowBits:x.gzip&&0<x.windowBits&&x.windowBits<16&&(x.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new u,this.strm.avail_out=0;var C=r.deflateInit2(this.strm,x.level,x.method,x.windowBits,x.memLevel,x.strategy);if(C!==y)throw new Error(l[C]);if(x.header&&r.deflateSetHeader(this.strm,x.header),x.dictionary){var S;if(S=typeof x.dictionary=="string"?s.string2buf(x.dictionary):k.call(x.dictionary)==="[object ArrayBuffer]"?new Uint8Array(x.dictionary):x.dictionary,(C=r.deflateSetDictionary(this.strm,S))!==y)throw new Error(l[C]);this._dict_set=!0}}function g(p,x){var C=new d(x);if(C.push(p,!0),C.err)throw C.msg||l[C.err];return C.result}d.prototype.push=function(p,x){var C,S,v=this.strm,M=this.options.chunkSize;if(this.ended)return!1;S=x===~~x?x:x===!0?4:0,typeof p=="string"?v.input=s.string2buf(p):k.call(p)==="[object ArrayBuffer]"?v.input=new Uint8Array(p):v.input=p,v.next_in=0,v.avail_in=v.input.length;do{if(v.avail_out===0&&(v.output=new i.Buf8(M),v.next_out=0,v.avail_out=M),(C=r.deflate(v,S))!==1&&C!==y)return this.onEnd(C),!(this.ended=!0);v.avail_out!==0&&(v.avail_in!==0||S!==4&&S!==2)||(this.options.to==="string"?this.onData(s.buf2binstring(i.shrinkBuf(v.output,v.next_out))):this.onData(i.shrinkBuf(v.output,v.next_out)))}while((0<v.avail_in||v.avail_out===0)&&C!==1);return S===4?(C=r.deflateEnd(this.strm),this.onEnd(C),this.ended=!0,C===y):S!==2||(this.onEnd(y),!(v.avail_out=0))},d.prototype.onData=function(p){this.chunks.push(p)},d.prototype.onEnd=function(p){p===y&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=p,this.msg=this.strm.msg},n.Deflate=d,n.deflate=g,n.deflateRaw=function(p,x){return(x=x||{}).raw=!0,g(p,x)},n.gzip=function(p,x){return(x=x||{}).gzip=!0,g(p,x)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,o,n){"use strict";var r=e("./zlib/inflate"),i=e("./utils/common"),s=e("./utils/strings"),l=e("./zlib/constants"),u=e("./zlib/messages"),k=e("./zlib/zstream"),y=e("./zlib/gzheader"),E=Object.prototype.toString;function c(d){if(!(this instanceof c))return new c(d);this.options=i.assign({chunkSize:16384,windowBits:0,to:""},d||{});var g=this.options;g.raw&&0<=g.windowBits&&g.windowBits<16&&(g.windowBits=-g.windowBits,g.windowBits===0&&(g.windowBits=-15)),!(0<=g.windowBits&&g.windowBits<16)||d&&d.windowBits||(g.windowBits+=32),15<g.windowBits&&g.windowBits<48&&(15&g.windowBits)==0&&(g.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var p=r.inflateInit2(this.strm,g.windowBits);if(p!==l.Z_OK)throw new Error(u[p]);this.header=new y,r.inflateGetHeader(this.strm,this.header)}function w(d,g){var p=new c(g);if(p.push(d,!0),p.err)throw p.msg||u[p.err];return p.result}c.prototype.push=function(d,g){var p,x,C,S,v,M,A=this.strm,h=this.options.chunkSize,f=this.options.dictionary,B=!1;if(this.ended)return!1;x=g===~~g?g:g===!0?l.Z_FINISH:l.Z_NO_FLUSH,typeof d=="string"?A.input=s.binstring2buf(d):E.call(d)==="[object ArrayBuffer]"?A.input=new Uint8Array(d):A.input=d,A.next_in=0,A.avail_in=A.input.length;do{if(A.avail_out===0&&(A.output=new i.Buf8(h),A.next_out=0,A.avail_out=h),(p=r.inflate(A,l.Z_NO_FLUSH))===l.Z_NEED_DICT&&f&&(M=typeof f=="string"?s.string2buf(f):E.call(f)==="[object ArrayBuffer]"?new Uint8Array(f):f,p=r.inflateSetDictionary(this.strm,M)),p===l.Z_BUF_ERROR&&B===!0&&(p=l.Z_OK,B=!1),p!==l.Z_STREAM_END&&p!==l.Z_OK)return this.onEnd(p),!(this.ended=!0);A.next_out&&(A.avail_out!==0&&p!==l.Z_STREAM_END&&(A.avail_in!==0||x!==l.Z_FINISH&&x!==l.Z_SYNC_FLUSH)||(this.options.to==="string"?(C=s.utf8border(A.output,A.next_out),S=A.next_out-C,v=s.buf2string(A.output,C),A.next_out=S,A.avail_out=h-S,S&&i.arraySet(A.output,A.output,C,S,0),this.onData(v)):this.onData(i.shrinkBuf(A.output,A.next_out)))),A.avail_in===0&&A.avail_out===0&&(B=!0)}while((0<A.avail_in||A.avail_out===0)&&p!==l.Z_STREAM_END);return p===l.Z_STREAM_END&&(x=l.Z_FINISH),x===l.Z_FINISH?(p=r.inflateEnd(this.strm),this.onEnd(p),this.ended=!0,p===l.Z_OK):x!==l.Z_SYNC_FLUSH||(this.onEnd(l.Z_OK),!(A.avail_out=0))},c.prototype.onData=function(d){this.chunks.push(d)},c.prototype.onEnd=function(d){d===l.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=d,this.msg=this.strm.msg},n.Inflate=c,n.inflate=w,n.inflateRaw=function(d,g){return(g=g||{}).raw=!0,w(d,g)},n.ungzip=w},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,o,n){"use strict";var r=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";n.assign=function(l){for(var u=Array.prototype.slice.call(arguments,1);u.length;){var k=u.shift();if(k){if(typeof k!="object")throw new TypeError(k+"must be non-object");for(var y in k)k.hasOwnProperty(y)&&(l[y]=k[y])}}return l},n.shrinkBuf=function(l,u){return l.length===u?l:l.subarray?l.subarray(0,u):(l.length=u,l)};var i={arraySet:function(l,u,k,y,E){if(u.subarray&&l.subarray)l.set(u.subarray(k,k+y),E);else for(var c=0;c<y;c++)l[E+c]=u[k+c]},flattenChunks:function(l){var u,k,y,E,c,w;for(u=y=0,k=l.length;u<k;u++)y+=l[u].length;for(w=new Uint8Array(y),u=E=0,k=l.length;u<k;u++)c=l[u],w.set(c,E),E+=c.length;return w}},s={arraySet:function(l,u,k,y,E){for(var c=0;c<y;c++)l[E+c]=u[k+c]},flattenChunks:function(l){return[].concat.apply([],l)}};n.setTyped=function(l){l?(n.Buf8=Uint8Array,n.Buf16=Uint16Array,n.Buf32=Int32Array,n.assign(n,i)):(n.Buf8=Array,n.Buf16=Array,n.Buf32=Array,n.assign(n,s))},n.setTyped(r)},{}],42:[function(e,o,n){"use strict";var r=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch{i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{s=!1}for(var l=new r.Buf8(256),u=0;u<256;u++)l[u]=252<=u?6:248<=u?5:240<=u?4:224<=u?3:192<=u?2:1;function k(y,E){if(E<65537&&(y.subarray&&s||!y.subarray&&i))return String.fromCharCode.apply(null,r.shrinkBuf(y,E));for(var c="",w=0;w<E;w++)c+=String.fromCharCode(y[w]);return c}l[254]=l[254]=1,n.string2buf=function(y){var E,c,w,d,g,p=y.length,x=0;for(d=0;d<p;d++)(64512&(c=y.charCodeAt(d)))==55296&&d+1<p&&(64512&(w=y.charCodeAt(d+1)))==56320&&(c=65536+(c-55296<<10)+(w-56320),d++),x+=c<128?1:c<2048?2:c<65536?3:4;for(E=new r.Buf8(x),d=g=0;g<x;d++)(64512&(c=y.charCodeAt(d)))==55296&&d+1<p&&(64512&(w=y.charCodeAt(d+1)))==56320&&(c=65536+(c-55296<<10)+(w-56320),d++),c<128?E[g++]=c:(c<2048?E[g++]=192|c>>>6:(c<65536?E[g++]=224|c>>>12:(E[g++]=240|c>>>18,E[g++]=128|c>>>12&63),E[g++]=128|c>>>6&63),E[g++]=128|63&c);return E},n.buf2binstring=function(y){return k(y,y.length)},n.binstring2buf=function(y){for(var E=new r.Buf8(y.length),c=0,w=E.length;c<w;c++)E[c]=y.charCodeAt(c);return E},n.buf2string=function(y,E){var c,w,d,g,p=E||y.length,x=new Array(2*p);for(c=w=0;c<p;)if((d=y[c++])<128)x[w++]=d;else if(4<(g=l[d]))x[w++]=65533,c+=g-1;else{for(d&=g===2?31:g===3?15:7;1<g&&c<p;)d=d<<6|63&y[c++],g--;1<g?x[w++]=65533:d<65536?x[w++]=d:(d-=65536,x[w++]=55296|d>>10&1023,x[w++]=56320|1023&d)}return k(x,w)},n.utf8border=function(y,E){var c;for((E=E||y.length)>y.length&&(E=y.length),c=E-1;0<=c&&(192&y[c])==128;)c--;return c<0||c===0?E:c+l[y[c]]>E?c:E}},{"./common":41}],43:[function(e,o,n){"use strict";o.exports=function(r,i,s,l){for(var u=65535&r|0,k=r>>>16&65535|0,y=0;s!==0;){for(s-=y=2e3<s?2e3:s;k=k+(u=u+i[l++]|0)|0,--y;);u%=65521,k%=65521}return u|k<<16|0}},{}],44:[function(e,o,n){"use strict";o.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,o,n){"use strict";var r=function(){for(var i,s=[],l=0;l<256;l++){i=l;for(var u=0;u<8;u++)i=1&i?3988292384^i>>>1:i>>>1;s[l]=i}return s}();o.exports=function(i,s,l,u){var k=r,y=u+l;i^=-1;for(var E=u;E<y;E++)i=i>>>8^k[255&(i^s[E])];return-1^i}},{}],46:[function(e,o,n){"use strict";var r,i=e("../utils/common"),s=e("./trees"),l=e("./adler32"),u=e("./crc32"),k=e("./messages"),y=0,E=4,c=0,w=-2,d=-1,g=4,p=2,x=8,C=9,S=286,v=30,M=19,A=2*S+1,h=15,f=3,B=258,F=B+f+1,b=42,O=113,a=1,U=2,re=3,P=4;function te(t,R){return t.msg=k[R],R}function D(t){return(t<<1)-(4<t?9:0)}function Q(t){for(var R=t.length;0<=--R;)t[R]=0}function L(t){var R=t.state,N=R.pending;N>t.avail_out&&(N=t.avail_out),N!==0&&(i.arraySet(t.output,R.pending_buf,R.pending_out,N,t.next_out),t.next_out+=N,R.pending_out+=N,t.total_out+=N,t.avail_out-=N,R.pending-=N,R.pending===0&&(R.pending_out=0))}function T(t,R){s._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,R),t.block_start=t.strstart,L(t.strm)}function H(t,R){t.pending_buf[t.pending++]=R}function G(t,R){t.pending_buf[t.pending++]=R>>>8&255,t.pending_buf[t.pending++]=255&R}function W(t,R){var N,_,m=t.max_chain_length,I=t.strstart,j=t.prev_length,$=t.nice_match,z=t.strstart>t.w_size-F?t.strstart-(t.w_size-F):0,Y=t.window,K=t.w_mask,Z=t.prev,J=t.strstart+B,ae=Y[I+j-1],se=Y[I+j];t.prev_length>=t.good_match&&(m>>=2),$>t.lookahead&&($=t.lookahead);do if(Y[(N=R)+j]===se&&Y[N+j-1]===ae&&Y[N]===Y[I]&&Y[++N]===Y[I+1]){I+=2,N++;do;while(Y[++I]===Y[++N]&&Y[++I]===Y[++N]&&Y[++I]===Y[++N]&&Y[++I]===Y[++N]&&Y[++I]===Y[++N]&&Y[++I]===Y[++N]&&Y[++I]===Y[++N]&&Y[++I]===Y[++N]&&I<J);if(_=B-(J-I),I=J-B,j<_){if(t.match_start=R,$<=(j=_))break;ae=Y[I+j-1],se=Y[I+j]}}while((R=Z[R&K])>z&&--m!=0);return j<=t.lookahead?j:t.lookahead}function oe(t){var R,N,_,m,I,j,$,z,Y,K,Z=t.w_size;do{if(m=t.window_size-t.lookahead-t.strstart,t.strstart>=Z+(Z-F)){for(i.arraySet(t.window,t.window,Z,Z,0),t.match_start-=Z,t.strstart-=Z,t.block_start-=Z,R=N=t.hash_size;_=t.head[--R],t.head[R]=Z<=_?_-Z:0,--N;);for(R=N=Z;_=t.prev[--R],t.prev[R]=Z<=_?_-Z:0,--N;);m+=Z}if(t.strm.avail_in===0)break;if(j=t.strm,$=t.window,z=t.strstart+t.lookahead,Y=m,K=void 0,K=j.avail_in,Y<K&&(K=Y),N=K===0?0:(j.avail_in-=K,i.arraySet($,j.input,j.next_in,K,z),j.state.wrap===1?j.adler=l(j.adler,$,K,z):j.state.wrap===2&&(j.adler=u(j.adler,$,K,z)),j.next_in+=K,j.total_in+=K,K),t.lookahead+=N,t.lookahead+t.insert>=f)for(I=t.strstart-t.insert,t.ins_h=t.window[I],t.ins_h=(t.ins_h<<t.hash_shift^t.window[I+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[I+f-1])&t.hash_mask,t.prev[I&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=I,I++,t.insert--,!(t.lookahead+t.insert<f)););}while(t.lookahead<F&&t.strm.avail_in!==0)}function de(t,R){for(var N,_;;){if(t.lookahead<F){if(oe(t),t.lookahead<F&&R===y)return a;if(t.lookahead===0)break}if(N=0,t.lookahead>=f&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+f-1])&t.hash_mask,N=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),N!==0&&t.strstart-N<=t.w_size-F&&(t.match_length=W(t,N)),t.match_length>=f)if(_=s._tr_tally(t,t.strstart-t.match_start,t.match_length-f),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=f){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+f-1])&t.hash_mask,N=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,--t.match_length!=0;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else _=s._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(_&&(T(t,!1),t.strm.avail_out===0))return a}return t.insert=t.strstart<f-1?t.strstart:f-1,R===E?(T(t,!0),t.strm.avail_out===0?re:P):t.last_lit&&(T(t,!1),t.strm.avail_out===0)?a:U}function X(t,R){for(var N,_,m;;){if(t.lookahead<F){if(oe(t),t.lookahead<F&&R===y)return a;if(t.lookahead===0)break}if(N=0,t.lookahead>=f&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+f-1])&t.hash_mask,N=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=f-1,N!==0&&t.prev_length<t.max_lazy_match&&t.strstart-N<=t.w_size-F&&(t.match_length=W(t,N),t.match_length<=5&&(t.strategy===1||t.match_length===f&&4096<t.strstart-t.match_start)&&(t.match_length=f-1)),t.prev_length>=f&&t.match_length<=t.prev_length){for(m=t.strstart+t.lookahead-f,_=s._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-f),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=m&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+f-1])&t.hash_mask,N=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),--t.prev_length!=0;);if(t.match_available=0,t.match_length=f-1,t.strstart++,_&&(T(t,!1),t.strm.avail_out===0))return a}else if(t.match_available){if((_=s._tr_tally(t,0,t.window[t.strstart-1]))&&T(t,!1),t.strstart++,t.lookahead--,t.strm.avail_out===0)return a}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(_=s._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<f-1?t.strstart:f-1,R===E?(T(t,!0),t.strm.avail_out===0?re:P):t.last_lit&&(T(t,!1),t.strm.avail_out===0)?a:U}function ee(t,R,N,_,m){this.good_length=t,this.max_lazy=R,this.nice_length=N,this.max_chain=_,this.func=m}function ie(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=x,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new i.Buf16(2*A),this.dyn_dtree=new i.Buf16(2*(2*v+1)),this.bl_tree=new i.Buf16(2*(2*M+1)),Q(this.dyn_ltree),Q(this.dyn_dtree),Q(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new i.Buf16(h+1),this.heap=new i.Buf16(2*S+1),Q(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new i.Buf16(2*S+1),Q(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function ne(t){var R;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=p,(R=t.state).pending=0,R.pending_out=0,R.wrap<0&&(R.wrap=-R.wrap),R.status=R.wrap?b:O,t.adler=R.wrap===2?0:1,R.last_flush=y,s._tr_init(R),c):te(t,w)}function le(t){var R=ne(t);return R===c&&function(N){N.window_size=2*N.w_size,Q(N.head),N.max_lazy_match=r[N.level].max_lazy,N.good_match=r[N.level].good_length,N.nice_match=r[N.level].nice_length,N.max_chain_length=r[N.level].max_chain,N.strstart=0,N.block_start=0,N.lookahead=0,N.insert=0,N.match_length=N.prev_length=f-1,N.match_available=0,N.ins_h=0}(t.state),R}function ce(t,R,N,_,m,I){if(!t)return w;var j=1;if(R===d&&(R=6),_<0?(j=0,_=-_):15<_&&(j=2,_-=16),m<1||C<m||N!==x||_<8||15<_||R<0||9<R||I<0||g<I)return te(t,w);_===8&&(_=9);var $=new ie;return(t.state=$).strm=t,$.wrap=j,$.gzhead=null,$.w_bits=_,$.w_size=1<<$.w_bits,$.w_mask=$.w_size-1,$.hash_bits=m+7,$.hash_size=1<<$.hash_bits,$.hash_mask=$.hash_size-1,$.hash_shift=~~(($.hash_bits+f-1)/f),$.window=new i.Buf8(2*$.w_size),$.head=new i.Buf16($.hash_size),$.prev=new i.Buf16($.w_size),$.lit_bufsize=1<<m+6,$.pending_buf_size=4*$.lit_bufsize,$.pending_buf=new i.Buf8($.pending_buf_size),$.d_buf=1*$.lit_bufsize,$.l_buf=3*$.lit_bufsize,$.level=R,$.strategy=I,$.method=N,le(t)}r=[new ee(0,0,0,0,function(t,R){var N=65535;for(N>t.pending_buf_size-5&&(N=t.pending_buf_size-5);;){if(t.lookahead<=1){if(oe(t),t.lookahead===0&&R===y)return a;if(t.lookahead===0)break}t.strstart+=t.lookahead,t.lookahead=0;var _=t.block_start+N;if((t.strstart===0||t.strstart>=_)&&(t.lookahead=t.strstart-_,t.strstart=_,T(t,!1),t.strm.avail_out===0)||t.strstart-t.block_start>=t.w_size-F&&(T(t,!1),t.strm.avail_out===0))return a}return t.insert=0,R===E?(T(t,!0),t.strm.avail_out===0?re:P):(t.strstart>t.block_start&&(T(t,!1),t.strm.avail_out),a)}),new ee(4,4,8,4,de),new ee(4,5,16,8,de),new ee(4,6,32,32,de),new ee(4,4,16,16,X),new ee(8,16,32,32,X),new ee(8,16,128,128,X),new ee(8,32,128,256,X),new ee(32,128,258,1024,X),new ee(32,258,258,4096,X)],n.deflateInit=function(t,R){return ce(t,R,x,15,8,0)},n.deflateInit2=ce,n.deflateReset=le,n.deflateResetKeep=ne,n.deflateSetHeader=function(t,R){return t&&t.state?t.state.wrap!==2?w:(t.state.gzhead=R,c):w},n.deflate=function(t,R){var N,_,m,I;if(!t||!t.state||5<R||R<0)return t?te(t,w):w;if(_=t.state,!t.output||!t.input&&t.avail_in!==0||_.status===666&&R!==E)return te(t,t.avail_out===0?-5:w);if(_.strm=t,N=_.last_flush,_.last_flush=R,_.status===b)if(_.wrap===2)t.adler=0,H(_,31),H(_,139),H(_,8),_.gzhead?(H(_,(_.gzhead.text?1:0)+(_.gzhead.hcrc?2:0)+(_.gzhead.extra?4:0)+(_.gzhead.name?8:0)+(_.gzhead.comment?16:0)),H(_,255&_.gzhead.time),H(_,_.gzhead.time>>8&255),H(_,_.gzhead.time>>16&255),H(_,_.gzhead.time>>24&255),H(_,_.level===9?2:2<=_.strategy||_.level<2?4:0),H(_,255&_.gzhead.os),_.gzhead.extra&&_.gzhead.extra.length&&(H(_,255&_.gzhead.extra.length),H(_,_.gzhead.extra.length>>8&255)),_.gzhead.hcrc&&(t.adler=u(t.adler,_.pending_buf,_.pending,0)),_.gzindex=0,_.status=69):(H(_,0),H(_,0),H(_,0),H(_,0),H(_,0),H(_,_.level===9?2:2<=_.strategy||_.level<2?4:0),H(_,3),_.status=O);else{var j=x+(_.w_bits-8<<4)<<8;j|=(2<=_.strategy||_.level<2?0:_.level<6?1:_.level===6?2:3)<<6,_.strstart!==0&&(j|=32),j+=31-j%31,_.status=O,G(_,j),_.strstart!==0&&(G(_,t.adler>>>16),G(_,65535&t.adler)),t.adler=1}if(_.status===69)if(_.gzhead.extra){for(m=_.pending;_.gzindex<(65535&_.gzhead.extra.length)&&(_.pending!==_.pending_buf_size||(_.gzhead.hcrc&&_.pending>m&&(t.adler=u(t.adler,_.pending_buf,_.pending-m,m)),L(t),m=_.pending,_.pending!==_.pending_buf_size));)H(_,255&_.gzhead.extra[_.gzindex]),_.gzindex++;_.gzhead.hcrc&&_.pending>m&&(t.adler=u(t.adler,_.pending_buf,_.pending-m,m)),_.gzindex===_.gzhead.extra.length&&(_.gzindex=0,_.status=73)}else _.status=73;if(_.status===73)if(_.gzhead.name){m=_.pending;do{if(_.pending===_.pending_buf_size&&(_.gzhead.hcrc&&_.pending>m&&(t.adler=u(t.adler,_.pending_buf,_.pending-m,m)),L(t),m=_.pending,_.pending===_.pending_buf_size)){I=1;break}I=_.gzindex<_.gzhead.name.length?255&_.gzhead.name.charCodeAt(_.gzindex++):0,H(_,I)}while(I!==0);_.gzhead.hcrc&&_.pending>m&&(t.adler=u(t.adler,_.pending_buf,_.pending-m,m)),I===0&&(_.gzindex=0,_.status=91)}else _.status=91;if(_.status===91)if(_.gzhead.comment){m=_.pending;do{if(_.pending===_.pending_buf_size&&(_.gzhead.hcrc&&_.pending>m&&(t.adler=u(t.adler,_.pending_buf,_.pending-m,m)),L(t),m=_.pending,_.pending===_.pending_buf_size)){I=1;break}I=_.gzindex<_.gzhead.comment.length?255&_.gzhead.comment.charCodeAt(_.gzindex++):0,H(_,I)}while(I!==0);_.gzhead.hcrc&&_.pending>m&&(t.adler=u(t.adler,_.pending_buf,_.pending-m,m)),I===0&&(_.status=103)}else _.status=103;if(_.status===103&&(_.gzhead.hcrc?(_.pending+2>_.pending_buf_size&&L(t),_.pending+2<=_.pending_buf_size&&(H(_,255&t.adler),H(_,t.adler>>8&255),t.adler=0,_.status=O)):_.status=O),_.pending!==0){if(L(t),t.avail_out===0)return _.last_flush=-1,c}else if(t.avail_in===0&&D(R)<=D(N)&&R!==E)return te(t,-5);if(_.status===666&&t.avail_in!==0)return te(t,-5);if(t.avail_in!==0||_.lookahead!==0||R!==y&&_.status!==666){var $=_.strategy===2?function(z,Y){for(var K;;){if(z.lookahead===0&&(oe(z),z.lookahead===0)){if(Y===y)return a;break}if(z.match_length=0,K=s._tr_tally(z,0,z.window[z.strstart]),z.lookahead--,z.strstart++,K&&(T(z,!1),z.strm.avail_out===0))return a}return z.insert=0,Y===E?(T(z,!0),z.strm.avail_out===0?re:P):z.last_lit&&(T(z,!1),z.strm.avail_out===0)?a:U}(_,R):_.strategy===3?function(z,Y){for(var K,Z,J,ae,se=z.window;;){if(z.lookahead<=B){if(oe(z),z.lookahead<=B&&Y===y)return a;if(z.lookahead===0)break}if(z.match_length=0,z.lookahead>=f&&0<z.strstart&&(Z=se[J=z.strstart-1])===se[++J]&&Z===se[++J]&&Z===se[++J]){ae=z.strstart+B;do;while(Z===se[++J]&&Z===se[++J]&&Z===se[++J]&&Z===se[++J]&&Z===se[++J]&&Z===se[++J]&&Z===se[++J]&&Z===se[++J]&&J<ae);z.match_length=B-(ae-J),z.match_length>z.lookahead&&(z.match_length=z.lookahead)}if(z.match_length>=f?(K=s._tr_tally(z,1,z.match_length-f),z.lookahead-=z.match_length,z.strstart+=z.match_length,z.match_length=0):(K=s._tr_tally(z,0,z.window[z.strstart]),z.lookahead--,z.strstart++),K&&(T(z,!1),z.strm.avail_out===0))return a}return z.insert=0,Y===E?(T(z,!0),z.strm.avail_out===0?re:P):z.last_lit&&(T(z,!1),z.strm.avail_out===0)?a:U}(_,R):r[_.level].func(_,R);if($!==re&&$!==P||(_.status=666),$===a||$===re)return t.avail_out===0&&(_.last_flush=-1),c;if($===U&&(R===1?s._tr_align(_):R!==5&&(s._tr_stored_block(_,0,0,!1),R===3&&(Q(_.head),_.lookahead===0&&(_.strstart=0,_.block_start=0,_.insert=0))),L(t),t.avail_out===0))return _.last_flush=-1,c}return R!==E?c:_.wrap<=0?1:(_.wrap===2?(H(_,255&t.adler),H(_,t.adler>>8&255),H(_,t.adler>>16&255),H(_,t.adler>>24&255),H(_,255&t.total_in),H(_,t.total_in>>8&255),H(_,t.total_in>>16&255),H(_,t.total_in>>24&255)):(G(_,t.adler>>>16),G(_,65535&t.adler)),L(t),0<_.wrap&&(_.wrap=-_.wrap),_.pending!==0?c:1)},n.deflateEnd=function(t){var R;return t&&t.state?(R=t.state.status)!==b&&R!==69&&R!==73&&R!==91&&R!==103&&R!==O&&R!==666?te(t,w):(t.state=null,R===O?te(t,-3):c):w},n.deflateSetDictionary=function(t,R){var N,_,m,I,j,$,z,Y,K=R.length;if(!t||!t.state||(I=(N=t.state).wrap)===2||I===1&&N.status!==b||N.lookahead)return w;for(I===1&&(t.adler=l(t.adler,R,K,0)),N.wrap=0,K>=N.w_size&&(I===0&&(Q(N.head),N.strstart=0,N.block_start=0,N.insert=0),Y=new i.Buf8(N.w_size),i.arraySet(Y,R,K-N.w_size,N.w_size,0),R=Y,K=N.w_size),j=t.avail_in,$=t.next_in,z=t.input,t.avail_in=K,t.next_in=0,t.input=R,oe(N);N.lookahead>=f;){for(_=N.strstart,m=N.lookahead-(f-1);N.ins_h=(N.ins_h<<N.hash_shift^N.window[_+f-1])&N.hash_mask,N.prev[_&N.w_mask]=N.head[N.ins_h],N.head[N.ins_h]=_,_++,--m;);N.strstart=_,N.lookahead=f-1,oe(N)}return N.strstart+=N.lookahead,N.block_start=N.strstart,N.insert=N.lookahead,N.lookahead=0,N.match_length=N.prev_length=f-1,N.match_available=0,t.next_in=$,t.input=z,t.avail_in=j,N.wrap=I,c},n.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,o,n){"use strict";o.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,o,n){"use strict";o.exports=function(r,i){var s,l,u,k,y,E,c,w,d,g,p,x,C,S,v,M,A,h,f,B,F,b,O,a,U;s=r.state,l=r.next_in,a=r.input,u=l+(r.avail_in-5),k=r.next_out,U=r.output,y=k-(i-r.avail_out),E=k+(r.avail_out-257),c=s.dmax,w=s.wsize,d=s.whave,g=s.wnext,p=s.window,x=s.hold,C=s.bits,S=s.lencode,v=s.distcode,M=(1<<s.lenbits)-1,A=(1<<s.distbits)-1;e:do{C<15&&(x+=a[l++]<<C,C+=8,x+=a[l++]<<C,C+=8),h=S[x&M];t:for(;;){if(x>>>=f=h>>>24,C-=f,(f=h>>>16&255)===0)U[k++]=65535&h;else{if(!(16&f)){if((64&f)==0){h=S[(65535&h)+(x&(1<<f)-1)];continue t}if(32&f){s.mode=12;break e}r.msg="invalid literal/length code",s.mode=30;break e}B=65535&h,(f&=15)&&(C<f&&(x+=a[l++]<<C,C+=8),B+=x&(1<<f)-1,x>>>=f,C-=f),C<15&&(x+=a[l++]<<C,C+=8,x+=a[l++]<<C,C+=8),h=v[x&A];n:for(;;){if(x>>>=f=h>>>24,C-=f,!(16&(f=h>>>16&255))){if((64&f)==0){h=v[(65535&h)+(x&(1<<f)-1)];continue n}r.msg="invalid distance code",s.mode=30;break e}if(F=65535&h,C<(f&=15)&&(x+=a[l++]<<C,(C+=8)<f&&(x+=a[l++]<<C,C+=8)),c<(F+=x&(1<<f)-1)){r.msg="invalid distance too far back",s.mode=30;break e}if(x>>>=f,C-=f,(f=k-y)<F){if(d<(f=F-f)&&s.sane){r.msg="invalid distance too far back",s.mode=30;break e}if(O=p,(b=0)===g){if(b+=w-f,f<B){for(B-=f;U[k++]=p[b++],--f;);b=k-F,O=U}}else if(g<f){if(b+=w+g-f,(f-=g)<B){for(B-=f;U[k++]=p[b++],--f;);if(b=0,g<B){for(B-=f=g;U[k++]=p[b++],--f;);b=k-F,O=U}}}else if(b+=g-f,f<B){for(B-=f;U[k++]=p[b++],--f;);b=k-F,O=U}for(;2<B;)U[k++]=O[b++],U[k++]=O[b++],U[k++]=O[b++],B-=3;B&&(U[k++]=O[b++],1<B&&(U[k++]=O[b++]))}else{for(b=k-F;U[k++]=U[b++],U[k++]=U[b++],U[k++]=U[b++],2<(B-=3););B&&(U[k++]=U[b++],1<B&&(U[k++]=U[b++]))}break}}break}}while(l<u&&k<E);l-=B=C>>3,x&=(1<<(C-=B<<3))-1,r.next_in=l,r.next_out=k,r.avail_in=l<u?u-l+5:5-(l-u),r.avail_out=k<E?E-k+257:257-(k-E),s.hold=x,s.bits=C}},{}],49:[function(e,o,n){"use strict";var r=e("../utils/common"),i=e("./adler32"),s=e("./crc32"),l=e("./inffast"),u=e("./inftrees"),k=1,y=2,E=0,c=-2,w=1,d=852,g=592;function p(b){return(b>>>24&255)+(b>>>8&65280)+((65280&b)<<8)+((255&b)<<24)}function x(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function C(b){var O;return b&&b.state?(O=b.state,b.total_in=b.total_out=O.total=0,b.msg="",O.wrap&&(b.adler=1&O.wrap),O.mode=w,O.last=0,O.havedict=0,O.dmax=32768,O.head=null,O.hold=0,O.bits=0,O.lencode=O.lendyn=new r.Buf32(d),O.distcode=O.distdyn=new r.Buf32(g),O.sane=1,O.back=-1,E):c}function S(b){var O;return b&&b.state?((O=b.state).wsize=0,O.whave=0,O.wnext=0,C(b)):c}function v(b,O){var a,U;return b&&b.state?(U=b.state,O<0?(a=0,O=-O):(a=1+(O>>4),O<48&&(O&=15)),O&&(O<8||15<O)?c:(U.window!==null&&U.wbits!==O&&(U.window=null),U.wrap=a,U.wbits=O,S(b))):c}function M(b,O){var a,U;return b?(U=new x,(b.state=U).window=null,(a=v(b,O))!==E&&(b.state=null),a):c}var A,h,f=!0;function B(b){if(f){var O;for(A=new r.Buf32(512),h=new r.Buf32(32),O=0;O<144;)b.lens[O++]=8;for(;O<256;)b.lens[O++]=9;for(;O<280;)b.lens[O++]=7;for(;O<288;)b.lens[O++]=8;for(u(k,b.lens,0,288,A,0,b.work,{bits:9}),O=0;O<32;)b.lens[O++]=5;u(y,b.lens,0,32,h,0,b.work,{bits:5}),f=!1}b.lencode=A,b.lenbits=9,b.distcode=h,b.distbits=5}function F(b,O,a,U){var re,P=b.state;return P.window===null&&(P.wsize=1<<P.wbits,P.wnext=0,P.whave=0,P.window=new r.Buf8(P.wsize)),U>=P.wsize?(r.arraySet(P.window,O,a-P.wsize,P.wsize,0),P.wnext=0,P.whave=P.wsize):(U<(re=P.wsize-P.wnext)&&(re=U),r.arraySet(P.window,O,a-U,re,P.wnext),(U-=re)?(r.arraySet(P.window,O,a-U,U,0),P.wnext=U,P.whave=P.wsize):(P.wnext+=re,P.wnext===P.wsize&&(P.wnext=0),P.whave<P.wsize&&(P.whave+=re))),0}n.inflateReset=S,n.inflateReset2=v,n.inflateResetKeep=C,n.inflateInit=function(b){return M(b,15)},n.inflateInit2=M,n.inflate=function(b,O){var a,U,re,P,te,D,Q,L,T,H,G,W,oe,de,X,ee,ie,ne,le,ce,t,R,N,_,m=0,I=new r.Buf8(4),j=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!b||!b.state||!b.output||!b.input&&b.avail_in!==0)return c;(a=b.state).mode===12&&(a.mode=13),te=b.next_out,re=b.output,Q=b.avail_out,P=b.next_in,U=b.input,D=b.avail_in,L=a.hold,T=a.bits,H=D,G=Q,R=E;e:for(;;)switch(a.mode){case w:if(a.wrap===0){a.mode=13;break}for(;T<16;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}if(2&a.wrap&&L===35615){I[a.check=0]=255&L,I[1]=L>>>8&255,a.check=s(a.check,I,2,0),T=L=0,a.mode=2;break}if(a.flags=0,a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&L)<<8)+(L>>8))%31){b.msg="incorrect header check",a.mode=30;break}if((15&L)!=8){b.msg="unknown compression method",a.mode=30;break}if(T-=4,t=8+(15&(L>>>=4)),a.wbits===0)a.wbits=t;else if(t>a.wbits){b.msg="invalid window size",a.mode=30;break}a.dmax=1<<t,b.adler=a.check=1,a.mode=512&L?10:12,T=L=0;break;case 2:for(;T<16;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}if(a.flags=L,(255&a.flags)!=8){b.msg="unknown compression method",a.mode=30;break}if(57344&a.flags){b.msg="unknown header flags set",a.mode=30;break}a.head&&(a.head.text=L>>8&1),512&a.flags&&(I[0]=255&L,I[1]=L>>>8&255,a.check=s(a.check,I,2,0)),T=L=0,a.mode=3;case 3:for(;T<32;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}a.head&&(a.head.time=L),512&a.flags&&(I[0]=255&L,I[1]=L>>>8&255,I[2]=L>>>16&255,I[3]=L>>>24&255,a.check=s(a.check,I,4,0)),T=L=0,a.mode=4;case 4:for(;T<16;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}a.head&&(a.head.xflags=255&L,a.head.os=L>>8),512&a.flags&&(I[0]=255&L,I[1]=L>>>8&255,a.check=s(a.check,I,2,0)),T=L=0,a.mode=5;case 5:if(1024&a.flags){for(;T<16;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}a.length=L,a.head&&(a.head.extra_len=L),512&a.flags&&(I[0]=255&L,I[1]=L>>>8&255,a.check=s(a.check,I,2,0)),T=L=0}else a.head&&(a.head.extra=null);a.mode=6;case 6:if(1024&a.flags&&(D<(W=a.length)&&(W=D),W&&(a.head&&(t=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Array(a.head.extra_len)),r.arraySet(a.head.extra,U,P,W,t)),512&a.flags&&(a.check=s(a.check,U,W,P)),D-=W,P+=W,a.length-=W),a.length))break e;a.length=0,a.mode=7;case 7:if(2048&a.flags){if(D===0)break e;for(W=0;t=U[P+W++],a.head&&t&&a.length<65536&&(a.head.name+=String.fromCharCode(t)),t&&W<D;);if(512&a.flags&&(a.check=s(a.check,U,W,P)),D-=W,P+=W,t)break e}else a.head&&(a.head.name=null);a.length=0,a.mode=8;case 8:if(4096&a.flags){if(D===0)break e;for(W=0;t=U[P+W++],a.head&&t&&a.length<65536&&(a.head.comment+=String.fromCharCode(t)),t&&W<D;);if(512&a.flags&&(a.check=s(a.check,U,W,P)),D-=W,P+=W,t)break e}else a.head&&(a.head.comment=null);a.mode=9;case 9:if(512&a.flags){for(;T<16;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}if(L!==(65535&a.check)){b.msg="header crc mismatch",a.mode=30;break}T=L=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),b.adler=a.check=0,a.mode=12;break;case 10:for(;T<32;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}b.adler=a.check=p(L),T=L=0,a.mode=11;case 11:if(a.havedict===0)return b.next_out=te,b.avail_out=Q,b.next_in=P,b.avail_in=D,a.hold=L,a.bits=T,2;b.adler=a.check=1,a.mode=12;case 12:if(O===5||O===6)break e;case 13:if(a.last){L>>>=7&T,T-=7&T,a.mode=27;break}for(;T<3;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}switch(a.last=1&L,T-=1,3&(L>>>=1)){case 0:a.mode=14;break;case 1:if(B(a),a.mode=20,O!==6)break;L>>>=2,T-=2;break e;case 2:a.mode=17;break;case 3:b.msg="invalid block type",a.mode=30}L>>>=2,T-=2;break;case 14:for(L>>>=7&T,T-=7&T;T<32;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}if((65535&L)!=(L>>>16^65535)){b.msg="invalid stored block lengths",a.mode=30;break}if(a.length=65535&L,T=L=0,a.mode=15,O===6)break e;case 15:a.mode=16;case 16:if(W=a.length){if(D<W&&(W=D),Q<W&&(W=Q),W===0)break e;r.arraySet(re,U,P,W,te),D-=W,P+=W,Q-=W,te+=W,a.length-=W;break}a.mode=12;break;case 17:for(;T<14;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}if(a.nlen=257+(31&L),L>>>=5,T-=5,a.ndist=1+(31&L),L>>>=5,T-=5,a.ncode=4+(15&L),L>>>=4,T-=4,286<a.nlen||30<a.ndist){b.msg="too many length or distance symbols",a.mode=30;break}a.have=0,a.mode=18;case 18:for(;a.have<a.ncode;){for(;T<3;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}a.lens[j[a.have++]]=7&L,L>>>=3,T-=3}for(;a.have<19;)a.lens[j[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,N={bits:a.lenbits},R=u(0,a.lens,0,19,a.lencode,0,a.work,N),a.lenbits=N.bits,R){b.msg="invalid code lengths set",a.mode=30;break}a.have=0,a.mode=19;case 19:for(;a.have<a.nlen+a.ndist;){for(;ee=(m=a.lencode[L&(1<<a.lenbits)-1])>>>16&255,ie=65535&m,!((X=m>>>24)<=T);){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}if(ie<16)L>>>=X,T-=X,a.lens[a.have++]=ie;else{if(ie===16){for(_=X+2;T<_;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}if(L>>>=X,T-=X,a.have===0){b.msg="invalid bit length repeat",a.mode=30;break}t=a.lens[a.have-1],W=3+(3&L),L>>>=2,T-=2}else if(ie===17){for(_=X+3;T<_;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}T-=X,t=0,W=3+(7&(L>>>=X)),L>>>=3,T-=3}else{for(_=X+7;T<_;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}T-=X,t=0,W=11+(127&(L>>>=X)),L>>>=7,T-=7}if(a.have+W>a.nlen+a.ndist){b.msg="invalid bit length repeat",a.mode=30;break}for(;W--;)a.lens[a.have++]=t}}if(a.mode===30)break;if(a.lens[256]===0){b.msg="invalid code -- missing end-of-block",a.mode=30;break}if(a.lenbits=9,N={bits:a.lenbits},R=u(k,a.lens,0,a.nlen,a.lencode,0,a.work,N),a.lenbits=N.bits,R){b.msg="invalid literal/lengths set",a.mode=30;break}if(a.distbits=6,a.distcode=a.distdyn,N={bits:a.distbits},R=u(y,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,N),a.distbits=N.bits,R){b.msg="invalid distances set",a.mode=30;break}if(a.mode=20,O===6)break e;case 20:a.mode=21;case 21:if(6<=D&&258<=Q){b.next_out=te,b.avail_out=Q,b.next_in=P,b.avail_in=D,a.hold=L,a.bits=T,l(b,G),te=b.next_out,re=b.output,Q=b.avail_out,P=b.next_in,U=b.input,D=b.avail_in,L=a.hold,T=a.bits,a.mode===12&&(a.back=-1);break}for(a.back=0;ee=(m=a.lencode[L&(1<<a.lenbits)-1])>>>16&255,ie=65535&m,!((X=m>>>24)<=T);){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}if(ee&&(240&ee)==0){for(ne=X,le=ee,ce=ie;ee=(m=a.lencode[ce+((L&(1<<ne+le)-1)>>ne)])>>>16&255,ie=65535&m,!(ne+(X=m>>>24)<=T);){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}L>>>=ne,T-=ne,a.back+=ne}if(L>>>=X,T-=X,a.back+=X,a.length=ie,ee===0){a.mode=26;break}if(32&ee){a.back=-1,a.mode=12;break}if(64&ee){b.msg="invalid literal/length code",a.mode=30;break}a.extra=15&ee,a.mode=22;case 22:if(a.extra){for(_=a.extra;T<_;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}a.length+=L&(1<<a.extra)-1,L>>>=a.extra,T-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=23;case 23:for(;ee=(m=a.distcode[L&(1<<a.distbits)-1])>>>16&255,ie=65535&m,!((X=m>>>24)<=T);){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}if((240&ee)==0){for(ne=X,le=ee,ce=ie;ee=(m=a.distcode[ce+((L&(1<<ne+le)-1)>>ne)])>>>16&255,ie=65535&m,!(ne+(X=m>>>24)<=T);){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}L>>>=ne,T-=ne,a.back+=ne}if(L>>>=X,T-=X,a.back+=X,64&ee){b.msg="invalid distance code",a.mode=30;break}a.offset=ie,a.extra=15&ee,a.mode=24;case 24:if(a.extra){for(_=a.extra;T<_;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}a.offset+=L&(1<<a.extra)-1,L>>>=a.extra,T-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){b.msg="invalid distance too far back",a.mode=30;break}a.mode=25;case 25:if(Q===0)break e;if(W=G-Q,a.offset>W){if((W=a.offset-W)>a.whave&&a.sane){b.msg="invalid distance too far back",a.mode=30;break}oe=W>a.wnext?(W-=a.wnext,a.wsize-W):a.wnext-W,W>a.length&&(W=a.length),de=a.window}else de=re,oe=te-a.offset,W=a.length;for(Q<W&&(W=Q),Q-=W,a.length-=W;re[te++]=de[oe++],--W;);a.length===0&&(a.mode=21);break;case 26:if(Q===0)break e;re[te++]=a.length,Q--,a.mode=21;break;case 27:if(a.wrap){for(;T<32;){if(D===0)break e;D--,L|=U[P++]<<T,T+=8}if(G-=Q,b.total_out+=G,a.total+=G,G&&(b.adler=a.check=a.flags?s(a.check,re,G,te-G):i(a.check,re,G,te-G)),G=Q,(a.flags?L:p(L))!==a.check){b.msg="incorrect data check",a.mode=30;break}T=L=0}a.mode=28;case 28:if(a.wrap&&a.flags){for(;T<32;){if(D===0)break e;D--,L+=U[P++]<<T,T+=8}if(L!==(4294967295&a.total)){b.msg="incorrect length check",a.mode=30;break}T=L=0}a.mode=29;case 29:R=1;break e;case 30:R=-3;break e;case 31:return-4;case 32:default:return c}return b.next_out=te,b.avail_out=Q,b.next_in=P,b.avail_in=D,a.hold=L,a.bits=T,(a.wsize||G!==b.avail_out&&a.mode<30&&(a.mode<27||O!==4))&&F(b,b.output,b.next_out,G-b.avail_out)?(a.mode=31,-4):(H-=b.avail_in,G-=b.avail_out,b.total_in+=H,b.total_out+=G,a.total+=G,a.wrap&&G&&(b.adler=a.check=a.flags?s(a.check,re,G,b.next_out-G):i(a.check,re,G,b.next_out-G)),b.data_type=a.bits+(a.last?64:0)+(a.mode===12?128:0)+(a.mode===20||a.mode===15?256:0),(H==0&&G===0||O===4)&&R===E&&(R=-5),R)},n.inflateEnd=function(b){if(!b||!b.state)return c;var O=b.state;return O.window&&(O.window=null),b.state=null,E},n.inflateGetHeader=function(b,O){var a;return b&&b.state?(2&(a=b.state).wrap)==0?c:((a.head=O).done=!1,E):c},n.inflateSetDictionary=function(b,O){var a,U=O.length;return b&&b.state?(a=b.state).wrap!==0&&a.mode!==11?c:a.mode===11&&i(1,O,U,0)!==a.check?-3:F(b,O,U,U)?(a.mode=31,-4):(a.havedict=1,E):c},n.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,o,n){"use strict";var r=e("../utils/common"),i=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],s=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],u=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];o.exports=function(k,y,E,c,w,d,g,p){var x,C,S,v,M,A,h,f,B,F=p.bits,b=0,O=0,a=0,U=0,re=0,P=0,te=0,D=0,Q=0,L=0,T=null,H=0,G=new r.Buf16(16),W=new r.Buf16(16),oe=null,de=0;for(b=0;b<=15;b++)G[b]=0;for(O=0;O<c;O++)G[y[E+O]]++;for(re=F,U=15;1<=U&&G[U]===0;U--);if(U<re&&(re=U),U===0)return w[d++]=20971520,w[d++]=20971520,p.bits=1,0;for(a=1;a<U&&G[a]===0;a++);for(re<a&&(re=a),b=D=1;b<=15;b++)if(D<<=1,(D-=G[b])<0)return-1;if(0<D&&(k===0||U!==1))return-1;for(W[1]=0,b=1;b<15;b++)W[b+1]=W[b]+G[b];for(O=0;O<c;O++)y[E+O]!==0&&(g[W[y[E+O]]++]=O);if(A=k===0?(T=oe=g,19):k===1?(T=i,H-=257,oe=s,de-=257,256):(T=l,oe=u,-1),b=a,M=d,te=O=L=0,S=-1,v=(Q=1<<(P=re))-1,k===1&&852<Q||k===2&&592<Q)return 1;for(;;){for(h=b-te,B=g[O]<A?(f=0,g[O]):g[O]>A?(f=oe[de+g[O]],T[H+g[O]]):(f=96,0),x=1<<b-te,a=C=1<<P;w[M+(L>>te)+(C-=x)]=h<<24|f<<16|B|0,C!==0;);for(x=1<<b-1;L&x;)x>>=1;if(x!==0?(L&=x-1,L+=x):L=0,O++,--G[b]==0){if(b===U)break;b=y[E+g[O]]}if(re<b&&(L&v)!==S){for(te===0&&(te=re),M+=a,D=1<<(P=b-te);P+te<U&&!((D-=G[P+te])<=0);)P++,D<<=1;if(Q+=1<<P,k===1&&852<Q||k===2&&592<Q)return 1;w[S=L&v]=re<<24|P<<16|M-d|0}}return L!==0&&(w[M+L]=b-te<<24|64<<16|0),p.bits=re,0}},{"../utils/common":41}],51:[function(e,o,n){"use strict";o.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,o,n){"use strict";var r=e("../utils/common"),i=0,s=1;function l(m){for(var I=m.length;0<=--I;)m[I]=0}var u=0,k=29,y=256,E=y+1+k,c=30,w=19,d=2*E+1,g=15,p=16,x=7,C=256,S=16,v=17,M=18,A=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],h=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],f=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],B=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],F=new Array(2*(E+2));l(F);var b=new Array(2*c);l(b);var O=new Array(512);l(O);var a=new Array(256);l(a);var U=new Array(k);l(U);var re,P,te,D=new Array(c);function Q(m,I,j,$,z){this.static_tree=m,this.extra_bits=I,this.extra_base=j,this.elems=$,this.max_length=z,this.has_stree=m&&m.length}function L(m,I){this.dyn_tree=m,this.max_code=0,this.stat_desc=I}function T(m){return m<256?O[m]:O[256+(m>>>7)]}function H(m,I){m.pending_buf[m.pending++]=255&I,m.pending_buf[m.pending++]=I>>>8&255}function G(m,I,j){m.bi_valid>p-j?(m.bi_buf|=I<<m.bi_valid&65535,H(m,m.bi_buf),m.bi_buf=I>>p-m.bi_valid,m.bi_valid+=j-p):(m.bi_buf|=I<<m.bi_valid&65535,m.bi_valid+=j)}function W(m,I,j){G(m,j[2*I],j[2*I+1])}function oe(m,I){for(var j=0;j|=1&m,m>>>=1,j<<=1,0<--I;);return j>>>1}function de(m,I,j){var $,z,Y=new Array(g+1),K=0;for($=1;$<=g;$++)Y[$]=K=K+j[$-1]<<1;for(z=0;z<=I;z++){var Z=m[2*z+1];Z!==0&&(m[2*z]=oe(Y[Z]++,Z))}}function X(m){var I;for(I=0;I<E;I++)m.dyn_ltree[2*I]=0;for(I=0;I<c;I++)m.dyn_dtree[2*I]=0;for(I=0;I<w;I++)m.bl_tree[2*I]=0;m.dyn_ltree[2*C]=1,m.opt_len=m.static_len=0,m.last_lit=m.matches=0}function ee(m){8<m.bi_valid?H(m,m.bi_buf):0<m.bi_valid&&(m.pending_buf[m.pending++]=m.bi_buf),m.bi_buf=0,m.bi_valid=0}function ie(m,I,j,$){var z=2*I,Y=2*j;return m[z]<m[Y]||m[z]===m[Y]&&$[I]<=$[j]}function ne(m,I,j){for(var $=m.heap[j],z=j<<1;z<=m.heap_len&&(z<m.heap_len&&ie(I,m.heap[z+1],m.heap[z],m.depth)&&z++,!ie(I,$,m.heap[z],m.depth));)m.heap[j]=m.heap[z],j=z,z<<=1;m.heap[j]=$}function le(m,I,j){var $,z,Y,K,Z=0;if(m.last_lit!==0)for(;$=m.pending_buf[m.d_buf+2*Z]<<8|m.pending_buf[m.d_buf+2*Z+1],z=m.pending_buf[m.l_buf+Z],Z++,$===0?W(m,z,I):(W(m,(Y=a[z])+y+1,I),(K=A[Y])!==0&&G(m,z-=U[Y],K),W(m,Y=T(--$),j),(K=h[Y])!==0&&G(m,$-=D[Y],K)),Z<m.last_lit;);W(m,C,I)}function ce(m,I){var j,$,z,Y=I.dyn_tree,K=I.stat_desc.static_tree,Z=I.stat_desc.has_stree,J=I.stat_desc.elems,ae=-1;for(m.heap_len=0,m.heap_max=d,j=0;j<J;j++)Y[2*j]!==0?(m.heap[++m.heap_len]=ae=j,m.depth[j]=0):Y[2*j+1]=0;for(;m.heap_len<2;)Y[2*(z=m.heap[++m.heap_len]=ae<2?++ae:0)]=1,m.depth[z]=0,m.opt_len--,Z&&(m.static_len-=K[2*z+1]);for(I.max_code=ae,j=m.heap_len>>1;1<=j;j--)ne(m,Y,j);for(z=J;j=m.heap[1],m.heap[1]=m.heap[m.heap_len--],ne(m,Y,1),$=m.heap[1],m.heap[--m.heap_max]=j,m.heap[--m.heap_max]=$,Y[2*z]=Y[2*j]+Y[2*$],m.depth[z]=(m.depth[j]>=m.depth[$]?m.depth[j]:m.depth[$])+1,Y[2*j+1]=Y[2*$+1]=z,m.heap[1]=z++,ne(m,Y,1),2<=m.heap_len;);m.heap[--m.heap_max]=m.heap[1],function(se,ye){var Be,he,be,pe,Te,ct,Se=ye.dyn_tree,Nt=ye.max_code,bn=ye.stat_desc.static_tree,vn=ye.stat_desc.has_stree,xn=ye.stat_desc.extra_bits,zt=ye.stat_desc.extra_base,He=ye.stat_desc.max_length,Ge=0;for(pe=0;pe<=g;pe++)se.bl_count[pe]=0;for(Se[2*se.heap[se.heap_max]+1]=0,Be=se.heap_max+1;Be<d;Be++)He<(pe=Se[2*Se[2*(he=se.heap[Be])+1]+1]+1)&&(pe=He,Ge++),Se[2*he+1]=pe,Nt<he||(se.bl_count[pe]++,Te=0,zt<=he&&(Te=xn[he-zt]),ct=Se[2*he],se.opt_len+=ct*(pe+Te),vn&&(se.static_len+=ct*(bn[2*he+1]+Te)));if(Ge!==0){do{for(pe=He-1;se.bl_count[pe]===0;)pe--;se.bl_count[pe]--,se.bl_count[pe+1]+=2,se.bl_count[He]--,Ge-=2}while(0<Ge);for(pe=He;pe!==0;pe--)for(he=se.bl_count[pe];he!==0;)Nt<(be=se.heap[--Be])||(Se[2*be+1]!==pe&&(se.opt_len+=(pe-Se[2*be+1])*Se[2*be],Se[2*be+1]=pe),he--)}}(m,I),de(Y,ae,m.bl_count)}function t(m,I,j){var $,z,Y=-1,K=I[1],Z=0,J=7,ae=4;for(K===0&&(J=138,ae=3),I[2*(j+1)+1]=65535,$=0;$<=j;$++)z=K,K=I[2*($+1)+1],++Z<J&&z===K||(Z<ae?m.bl_tree[2*z]+=Z:z!==0?(z!==Y&&m.bl_tree[2*z]++,m.bl_tree[2*S]++):Z<=10?m.bl_tree[2*v]++:m.bl_tree[2*M]++,Y=z,ae=(Z=0)===K?(J=138,3):z===K?(J=6,3):(J=7,4))}function R(m,I,j){var $,z,Y=-1,K=I[1],Z=0,J=7,ae=4;for(K===0&&(J=138,ae=3),$=0;$<=j;$++)if(z=K,K=I[2*($+1)+1],!(++Z<J&&z===K)){if(Z<ae)for(;W(m,z,m.bl_tree),--Z!=0;);else z!==0?(z!==Y&&(W(m,z,m.bl_tree),Z--),W(m,S,m.bl_tree),G(m,Z-3,2)):Z<=10?(W(m,v,m.bl_tree),G(m,Z-3,3)):(W(m,M,m.bl_tree),G(m,Z-11,7));Y=z,ae=(Z=0)===K?(J=138,3):z===K?(J=6,3):(J=7,4)}}l(D);var N=!1;function _(m,I,j,$){G(m,(u<<1)+($?1:0),3),function(z,Y,K,Z){ee(z),Z&&(H(z,K),H(z,~K)),r.arraySet(z.pending_buf,z.window,Y,K,z.pending),z.pending+=K}(m,I,j,!0)}n._tr_init=function(m){N||(function(){var I,j,$,z,Y,K=new Array(g+1);for(z=$=0;z<k-1;z++)for(U[z]=$,I=0;I<1<<A[z];I++)a[$++]=z;for(a[$-1]=z,z=Y=0;z<16;z++)for(D[z]=Y,I=0;I<1<<h[z];I++)O[Y++]=z;for(Y>>=7;z<c;z++)for(D[z]=Y<<7,I=0;I<1<<h[z]-7;I++)O[256+Y++]=z;for(j=0;j<=g;j++)K[j]=0;for(I=0;I<=143;)F[2*I+1]=8,I++,K[8]++;for(;I<=255;)F[2*I+1]=9,I++,K[9]++;for(;I<=279;)F[2*I+1]=7,I++,K[7]++;for(;I<=287;)F[2*I+1]=8,I++,K[8]++;for(de(F,E+1,K),I=0;I<c;I++)b[2*I+1]=5,b[2*I]=oe(I,5);re=new Q(F,A,y+1,E,g),P=new Q(b,h,0,c,g),te=new Q(new Array(0),f,0,w,x)}(),N=!0),m.l_desc=new L(m.dyn_ltree,re),m.d_desc=new L(m.dyn_dtree,P),m.bl_desc=new L(m.bl_tree,te),m.bi_buf=0,m.bi_valid=0,X(m)},n._tr_stored_block=_,n._tr_flush_block=function(m,I,j,$){var z,Y,K=0;0<m.level?(m.strm.data_type===2&&(m.strm.data_type=function(Z){var J,ae=4093624447;for(J=0;J<=31;J++,ae>>>=1)if(1&ae&&Z.dyn_ltree[2*J]!==0)return i;if(Z.dyn_ltree[18]!==0||Z.dyn_ltree[20]!==0||Z.dyn_ltree[26]!==0)return s;for(J=32;J<y;J++)if(Z.dyn_ltree[2*J]!==0)return s;return i}(m)),ce(m,m.l_desc),ce(m,m.d_desc),K=function(Z){var J;for(t(Z,Z.dyn_ltree,Z.l_desc.max_code),t(Z,Z.dyn_dtree,Z.d_desc.max_code),ce(Z,Z.bl_desc),J=w-1;3<=J&&Z.bl_tree[2*B[J]+1]===0;J--);return Z.opt_len+=3*(J+1)+5+5+4,J}(m),z=m.opt_len+3+7>>>3,(Y=m.static_len+3+7>>>3)<=z&&(z=Y)):z=Y=j+5,j+4<=z&&I!==-1?_(m,I,j,$):m.strategy===4||Y===z?(G(m,2+($?1:0),3),le(m,F,b)):(G(m,4+($?1:0),3),function(Z,J,ae,se){var ye;for(G(Z,J-257,5),G(Z,ae-1,5),G(Z,se-4,4),ye=0;ye<se;ye++)G(Z,Z.bl_tree[2*B[ye]+1],3);R(Z,Z.dyn_ltree,J-1),R(Z,Z.dyn_dtree,ae-1)}(m,m.l_desc.max_code+1,m.d_desc.max_code+1,K+1),le(m,m.dyn_ltree,m.dyn_dtree)),X(m),$&&ee(m)},n._tr_tally=function(m,I,j){return m.pending_buf[m.d_buf+2*m.last_lit]=I>>>8&255,m.pending_buf[m.d_buf+2*m.last_lit+1]=255&I,m.pending_buf[m.l_buf+m.last_lit]=255&j,m.last_lit++,I===0?m.dyn_ltree[2*j]++:(m.matches++,I--,m.dyn_ltree[2*(a[j]+y+1)]++,m.dyn_dtree[2*T(I)]++),m.last_lit===m.lit_bufsize-1},n._tr_align=function(m){G(m,2,3),W(m,C,F),function(I){I.bi_valid===16?(H(I,I.bi_buf),I.bi_buf=0,I.bi_valid=0):8<=I.bi_valid&&(I.pending_buf[I.pending++]=255&I.bi_buf,I.bi_buf>>=8,I.bi_valid-=8)}(m)}},{"../utils/common":41}],53:[function(e,o,n){"use strict";o.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,o,n){(function(r){(function(i,s){"use strict";if(!i.setImmediate){var l,u,k,y,E=1,c={},w=!1,d=i.document,g=Object.getPrototypeOf&&Object.getPrototypeOf(i);g=g&&g.setTimeout?g:i,l={}.toString.call(i.process)==="[object process]"?function(S){process.nextTick(function(){x(S)})}:function(){if(i.postMessage&&!i.importScripts){var S=!0,v=i.onmessage;return i.onmessage=function(){S=!1},i.postMessage("","*"),i.onmessage=v,S}}()?(y="setImmediate$"+Math.random()+"$",i.addEventListener?i.addEventListener("message",C,!1):i.attachEvent("onmessage",C),function(S){i.postMessage(y+S,"*")}):i.MessageChannel?((k=new MessageChannel).port1.onmessage=function(S){x(S.data)},function(S){k.port2.postMessage(S)}):d&&"onreadystatechange"in d.createElement("script")?(u=d.documentElement,function(S){var v=d.createElement("script");v.onreadystatechange=function(){x(S),v.onreadystatechange=null,u.removeChild(v),v=null},u.appendChild(v)}):function(S){setTimeout(x,0,S)},g.setImmediate=function(S){typeof S!="function"&&(S=new Function(""+S));for(var v=new Array(arguments.length-1),M=0;M<v.length;M++)v[M]=arguments[M+1];var A={callback:S,args:v};return c[E]=A,l(E),E++},g.clearImmediate=p}function p(S){delete c[S]}function x(S){if(w)setTimeout(x,0,S);else{var v=c[S];if(v){w=!0;try{(function(M){var A=M.callback,h=M.args;switch(h.length){case 0:A();break;case 1:A(h[0]);break;case 2:A(h[0],h[1]);break;case 3:A(h[0],h[1],h[2]);break;default:A.apply(s,h)}})(v)}finally{p(S),w=!1}}}}function C(S){S.source===i&&typeof S.data=="string"&&S.data.indexOf(y)===0&&x(+S.data.slice(y.length))}})(typeof self>"u"?r===void 0?this:r:self)}).call(this,typeof global<"u"?global:typeof self<"u"?self:typeof window<"u"?window:{})},{}]},{},[10])(10)})});var V={credentials:{email:"",encryptedPassword:"",otp:"",remember:!1,apiToken:"",awaitingOtp:!1,deviceUuid:""},monarchAccounts:null,accounts:{}};var jt=dt(Ft(),1),Ut=dt(mt(),1);function Bn(){return"id-"+Math.random().toString(36).slice(2,11)}function Pt(e){if(!e)return 0;let o=e.replace(/[^0-9.-]+/g,"").trim(),n=parseFloat(o);return isNaN(n)?0:Math.round(n*100)}function An(e){let o=e.toLowerCase();return o.includes("credit")?{type:"credit",subtype:"credit_card"}:o.includes("loan")||o.includes("mortgage")||o.includes("student loan")?{type:"loan",subtype:"loan"}:o.includes("savings")?{type:"depository",subtype:"savings"}:o.includes("checking")||o.includes("debit")?{type:"depository",subtype:"checking"}:{type:"depository",subtype:"checking"}}async function ht(e,o){console.group("parseYNABCSV");let n=await Ut.default.loadAsync(e),r=Object.keys(n.files).find(s=>s.toLowerCase().includes("register")&&s.toLowerCase().endsWith(".csv"));if(!r)throw console.error("\u274C No register CSV found in the ZIP file"),console.groupEnd("parseYNABCSV"),new Error("No register CSV found in the ZIP file");let i=await n.files[r].async("string");return console.groupEnd("parseYNABCSV"),In(i,o)}function In(e,o){return console.group("parseCSV"),new Promise((n,r)=>{jt.default.parse(e,{header:!0,skipEmptyLines:!0,complete:({data:i})=>{if(!i||i.length===0)return console.groupEnd("parseCSV"),r(new Error("\u274C CSV file appears to be empty or invalid."));let s=new Map;for(let l of i){let u=l.Account?.trim();if(!u){console.warn("\u274C Skipping row with missing account name:",l);continue}if(l.Date){let[w,d,g]=l.Date.split("/");w&&d&&g&&(l.Date=`${g}-${w.padStart(2,"0")}-${d.padStart(2,"0")}`)}let k=Pt(l.Inflow),y=Pt(l.Outflow),E=k-y;if(k>0?l.Amount=(k/100).toFixed(2):y>0?l.Amount=(-y/100).toFixed(2):l.Amount="0.00",!s.has(u)){let{type:w,subtype:d}=An(u,o);s.set(u,{id:Bn(),name:u,modifiedName:u,type:w,subtype:d,transactions:[],transactionCount:0,balanceCents:0,included:!0,selected:!1,status:"unprocessed"})}let c=s.get(u);c.transactions.push({Date:l.Date,Merchant:l.Payee||"",Category:l.Category||"","Category Group":l["Category Group"]||"",Notes:l.Memo||"",Amount:l.Amount,Tags:l.Flag||""}),c.transactionCount+=1,c.balanceCents+=E}for(let l of s.values())l.balance=l.balanceCents/100,l.included=l.transactionCount>0;console.groupEnd("parseCSV"),n(Object.fromEntries(s))},error:i=>r(i)})})}function $t(e){let o=document.getElementById(e),n=o.querySelector(".relative");o.classList.remove("pointer-events-none","opacity-0"),o.classList.add("pointer-events-auto","opacity-100"),requestAnimationFrame(()=>{n.classList.remove("translate-y-full"),n.classList.add("translate-y-0")})}function Ht(e){let o=document.getElementById(e),n=o.querySelector(".relative");n.classList.remove("translate-y-0"),n.classList.add("translate-y-full"),setTimeout(()=>{o.classList.add("pointer-events-none","opacity-0"),o.classList.remove("pointer-events-auto","opacity-100")},500)}function me(){document.querySelectorAll(".ui-button").forEach(e=>{let o=e.dataset.type||"primary",n=e.dataset.size||"medium",r=e.dataset.fixedWidth,i=e.hasAttribute("data-fullwidth"),s=e.hasAttribute("disabled")||e.disabled;switch(e.className="ui-button",e.type="button",e.classList.add("font-semibold","rounded-lg","transition-all","duration-200","ease-in-out","flex","items-center","justify-center"),e.style.transform="none",n){case"small":e.classList.add("px-2","py-1","text-xs","sm:px-3","sm:py-1.5","sm:text-sm");break;case"large":e.classList.add("px-4","py-2.5","text-sm","sm:px-6","sm:py-3","sm:text-base","md:px-8","md:py-4");break;case"medium":default:e.classList.add("px-3","py-2","text-sm","sm:px-5","sm:py-2","sm:text-sm");break}switch(s?(e.setAttribute("disabled",""),e.classList.add("opacity-50","cursor-not-allowed"),e.style.boxShadow="none"):(e.removeAttribute("disabled"),e.classList.add("cursor-pointer")),o){case"primary":e.classList.add("bg-[#1993e5]","text-white","border","border-[#1993e5]","shadow-sm"),s||e.classList.add("hover:bg-blue-600","hover:border-blue-600","hover:shadow-md","focus:ring-2","focus:ring-blue-500","focus:ring-offset-2","active:bg-blue-700","transform","hover:scale-105");break;case"secondary":e.classList.add("bg-white","text-gray-700","border","border-gray-300","shadow-sm"),s||e.classList.add("hover:bg-gray-50","hover:border-gray-400","hover:text-gray-800","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2","active:bg-gray-100");break;case"text":e.classList.remove("px-2","px-3","px-4","px-5","px-6","px-8","py-1","py-1.5","py-2","py-2.5","py-3","py-4","sm:px-3","sm:px-5","sm:px-6","sm:px-8","sm:py-1.5","sm:py-2","sm:py-3","sm:py-4","md:px-8","md:py-4"),e.classList.add("bg-transparent","text-blue-600","px-2","py-1","sm:px-3","sm:py-1.5"),s||e.classList.add("hover:underline","hover:text-blue-700","focus:ring-2","focus:ring-blue-500","focus:ring-offset-2");break;case"danger":e.classList.add("bg-red-500","text-white","border","border-red-500","shadow-sm"),s||e.classList.add("hover:bg-red-600","hover:border-red-600","hover:shadow-md","focus:ring-2","focus:ring-red-500","focus:ring-offset-2","active:bg-red-700","transform","hover:scale-105");break;case"warning":e.classList.add("bg-orange-500","text-white","border","border-orange-500","shadow-sm"),s||e.classList.add("hover:bg-orange-600","hover:border-orange-600","hover:shadow-md","focus:ring-2","focus:ring-orange-500","focus:ring-offset-2","active:bg-orange-700","transform","hover:scale-105");break}r&&(e.style.width=`${r}px`),i&&e.classList.add("w-full"),s||(e.classList.add("touch-manipulation","select-none"),e.style.minHeight="44px",e.style.minWidth="44px")})}function Ke(){let e=document.getElementById("browseButton"),o=document.getElementById("fileInput"),n=document.getElementById("uploadBox"),r=document.getElementById("errorMessage"),i=document.getElementById("howItWorksBtn"),s=document.getElementById("closeHowItWorksModal");me(),i.addEventListener("click",()=>{$t("howItWorksModal")}),s.addEventListener("click",()=>{Ht("howItWorksModal")}),n.addEventListener("dragover",u=>{u.preventDefault(),n.classList.add("border-blue-400","bg-blue-50")}),n.addEventListener("dragleave",()=>{n.classList.remove("border-blue-400","bg-blue-50")}),n.addEventListener("drop",async u=>{u.preventDefault(),n.classList.remove("border-blue-400","bg-blue-50");let k=u.dataTransfer.files[0];k&&await l(k)}),e.addEventListener("click",()=>o.click()),o.addEventListener("change",async u=>{let k=u.target.files[0];k&&await l(k)});async function l(u){if(!u.name.endsWith(".zip")){r.textContent="Please upload a ZIP export from YNAB.",r.classList.remove("hidden");return}try{let y=await ht(u);V.accounts=y,Ce(),y&&Object.keys(y).length>0?ue("/review",!1,!0):(r.textContent="No accounts found in the uploaded file.",r.classList.remove("hidden"))}catch(y){r.textContent="Failed to parse ZIP file. Please ensure it includes a valid register.csv and plan.csv.",r.classList.remove("hidden"),console.error(y)}}}var gt=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 min-h-[calc(100vh-200px)]">

  <div class="text-center w-full max-w-3xl mb-8 sm:mb-10 md:mb-12">
    <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 text-gray-900">
      Migrate your YNAB data
    </h2>
    <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
      Upload a YNAB ZIP file to begin the migration process into Monarch Money.
    </p>

    <a id="howItWorksBtn" class="ui-button mt-4 sm:mt-6 inline-block" data-type="text">
      How does this work?
    </a>
  </div>

  <!-- Upload Box -->
  <div id="uploadBox" 
       class="w-full max-w-sm sm:max-w-md md:max-w-lg border-2 border-dashed border-gray-300 rounded-xl 
              p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center gap-3 sm:gap-4 
              transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/30 
              cursor-pointer focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
    
    <div class="text-center space-y-2 sm:space-y-3">
      <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-2">
        <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
        </svg>
      </div>
      
      <p class="text-base sm:text-lg md:text-xl font-semibold text-gray-700">
        Drag & Drop your Register ZIP file
      </p>
      <p class="text-sm text-gray-500">or click to browse</p>
    </div>
    
    <input id="fileInput" type="file" accept=".csv,.zip" hidden>
    <button id="browseButton" class="ui-button btn-responsive" data-type="primary" data-size="large">
      Browse Files
    </button>

    <p class="text-xs sm:text-sm text-gray-400 text-center max-w-xs leading-relaxed">
      <span class="inline-flex items-center gap-1">
        <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Secure & Private
      </span>
      <br>
      Your file stays local. We never store or transmit your data.
    </p>
  </div>

  <div id="errorMessage" 
       class="hidden text-red-600 text-sm sm:text-base mt-4 sm:mt-6 text-center px-4 
              bg-red-50 border border-red-200 rounded-lg py-3 max-w-md mx-auto">
    Some error
  </div>

</div>

<!-- Modal -->
<div id="howItWorksModal" 
     class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none opacity-0 
            transition-opacity duration-300 p-3 sm:p-4 md:p-6">
  <!-- Overlay -->
  <div class="absolute inset-0 bg-black/30 transition-opacity duration-300"></div>

  <!-- Modal Content -->
  <div class="relative z-10 bg-white rounded-xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md md:max-w-lg w-full 
              shadow-2xl transform translate-y-full transition-transform duration-500 
              max-h-[90vh] overflow-y-auto">
    
    <button id="closeHowItWorksModal" 
            class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 
                   w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 
                   transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <h3 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 pr-8 text-gray-900">
      How does this work?
    </h3>
    
    <ol class="list-decimal pl-5 sm:pl-6 space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
      <li class="pl-2">
        <strong>Export your YNAB data</strong> by going to your YNAB budget settings and downloading the full export.
      </li>
      <li class="pl-2">
        <strong>Upload the YNAB ZIP file</strong> using the drag & drop area above or by clicking "Browse Files".
      </li>
      <li class="pl-2">
        <strong>Choose your import method</strong> - either manual CSV download or guided auto-import into Monarch Money.
      </li>
    </ol>
    
    <div class="mt-6 sm:mt-8 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-start gap-2 sm:gap-3">
        <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <p class="text-xs sm:text-sm text-green-800 leading-relaxed">
          <strong>100% Private:</strong> Your files are processed locally in your browser. 
          Nothing is uploaded to our servers or stored externally.
        </p>
      </div>
    </div>
  </div>
</div>
`;var Tn="2025-06-02T06:26:29.704Z",Ln="tools/fetchMonarchAccountTypes.js",Nn=[{typeName:"depository",typeDisplay:"Cash",group:"asset",subtypes:[{name:"cd",display:"CD"},{name:"checking",display:"Checking"},{name:"savings",display:"Savings"},{name:"money_market",display:"Money Market"},{name:"paypal",display:"Mobile Payment System"},{name:"prepaid",display:"Prepaid"},{name:"cash_management",display:"Cash Management"}]},{typeName:"brokerage",typeDisplay:"Investments",group:"asset",subtypes:[{name:"st_401a",display:"401a"},{name:"st_401k",display:"401k"},{name:"st_403b",display:"403b"},{name:"st_457b",display:"457b"},{name:"st_529",display:"529 Plan"},{name:"brokerage",display:"Brokerage (Taxable)"},{name:"cash_isa",display:"Individual Savings Account (ISA) - Cash"},{name:"cryptocurrency",display:"Cryptocurrency"},{name:"education_savings_account",display:"Coverdell Education Savings Account (ESA)"},{name:"gic",display:"Guaranteed Investment Certificate (GIC)"},{name:"fixed_annuity",display:"Fixed Annuity"},{name:"health_reimbursement_arrangement",display:"Health Reimbursement Arrangement (HRA)"},{name:"health_savings_account",display:"Health Savings Account (HSA)"},{name:"iso",display:"Incentive Stock Options (ISO)"},{name:"ira",display:"Individual Retirement Account (IRA)"},{name:"isa",display:"Individual Savings Account (ISA) - Non-cash"},{name:"lif",display:"Life Income Fund (LIF) Retirement Account"},{name:"lira",display:"Locked-in Retirement Account (LIRA)"},{name:"lrif",display:"Locked-in Retirement Income Fund (LRIF)"},{name:"lrsp",display:"Locked-in Retirement Savings Plan (LRSP)"},{name:"keogh_plan",display:"Keogh Plan"},{name:"mutual_fund",display:"Mutual Fund"},{name:"nso",display:"Non-qualified Stock Options (NSO)"},{name:"non_taxable_brokerage_account",display:"Brokerage (Non-taxable)"},{name:"other",display:"Other"},{name:"prif",display:"Prescribed Registered Retirement Income Fund (PRIF)"},{name:"rdsp",display:"Registered Disability Savings Plan (RDSP)"},{name:"resp",display:"Registered Education Savings Plan (RESP)"},{name:"rlif",display:"Restricted Life Income Fund (RLIF)"},{name:"rrif",display:"Registered Retirement Income Fund (RRIF)"},{name:"pension",display:"Pension"},{name:"profit_sharing_plan",display:"Profit Sharing Plan"},{name:"qualifying_share_account",display:"Qualifying Share Account"},{name:"retirement",display:"Retirement"},{name:"roth",display:"Roth IRA"},{name:"roth_401k",display:"Roth 401k"},{name:"rrsp",display:"Registered Retirement Savings Plan (RRSP)"},{name:"sarsep_pension",display:"Salary Reduction Simplified Employee Pension Plan (SARSEP)"},{name:"sep_ira",display:"Simplified Employee Pension IRA (SEP IRA)"},{name:"simple_ira",display:"Simple IRA"},{name:"sipp",display:"Self-Invested Personal Pension (SIPP)"},{name:"stock_plan",display:"Stock Plan"},{name:"thrift_savings_plan",display:"Thrift Savings Plan (TSP)"},{name:"trust",display:"Trust"},{name:"tfsa",display:"Tax-Free Savings Account (TFSA)"},{name:"ugma",display:"Uniform Gift to Minors Act (UGMA)"},{name:"utma",display:"Uniform Transfers to Minors Act (UTMA)"},{name:"variable_annuity",display:"Variable Annuity"},{name:"fhsa",display:"First Home Savings Account (FHSA)"}]},{typeName:"real_estate",typeDisplay:"Real Estate",group:"asset",subtypes:[{name:"primary_home",display:"Primary Home"},{name:"secondary_home",display:"Secondary Home"},{name:"rental_property",display:"Rental Property"}]},{typeName:"vehicle",typeDisplay:"Vehicles",group:"asset",subtypes:[{name:"car",display:"Car"},{name:"boat",display:"Boat"},{name:"motorcycle",display:"Motorcycle"},{name:"snowmobile",display:"Snowmobile"},{name:"bicycle",display:"Bicycle"},{name:"other",display:"Other"}]},{typeName:"valuables",typeDisplay:"Valuables",group:"asset",subtypes:[{name:"art",display:"Art"},{name:"jewelry",display:"Jewelry"},{name:"collectibles",display:"Collectibles"},{name:"furniture",display:"Furniture"},{name:"other",display:"Other"}]},{typeName:"credit",typeDisplay:"Credit Cards",group:"liability",subtypes:[{name:"credit_card",display:"Credit Card"}]},{typeName:"loan",typeDisplay:"Loans",group:"liability",subtypes:[{name:"auto",display:"Auto"},{name:"business",display:"Business"},{name:"commercial",display:"Commercial"},{name:"construction",display:"Construction"},{name:"consumer",display:"Consumer"},{name:"home",display:"Home"},{name:"home_equity",display:"Home Equity"},{name:"loan",display:"Loan"},{name:"mortgage",display:"Mortgage"},{name:"overdraft",display:"Overdraft"},{name:"line_of_credit",display:"Line of Credit"},{name:"student",display:"Student"}]},{typeName:"other_asset",typeDisplay:"Other Assets",group:"asset",subtypes:[{name:"other",display:"Other"}]},{typeName:"other_liability",typeDisplay:"Other Liabilities",group:"liability",subtypes:[{name:"other",display:"Other"}]}],Ae={generatedAt:Tn,generatedBy:Ln,data:Nn};function zn(){let e=Qe(),o=document.getElementById("backBtn");if(!o)return;let r={"/review":"Back to Upload","/method":"Back to Review","/manual":"Back to Method","/login":"Back to Method","/otp":"Back to Login","/complete":"Back to Review"}[e]||"Back";o.innerHTML=`
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    ${r}
  `}function Xe(){zn();let e=document.getElementById("backToMethodBtn");e&&(e.innerHTML=`
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Method
    `)}function Wt(e={}){let{backText:o="Back",nextText:n="Continue",backId:r="backBtn",nextId:i="continueBtn",showBack:s=!0,showNext:l=!1,nextType:u="primary",nextDisabled:k=!1,containerClass:y=""}=e,E=s?`
    <button id="${r}" class="ui-button order-2 sm:order-1 w-full sm:w-auto whitespace-nowrap" data-type="secondary" data-size="large">
      <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      ${o}
    </button>
  `:"<div></div>",c=l?`
    <button id="${i}" 
            class="ui-button order-1 sm:order-2 w-full sm:w-auto whitespace-nowrap" 
            data-type="${u}" 
            data-size="large"
            ${k?"disabled":""}>
      <span class="hidden sm:inline truncate">${n}</span>
      <span class="sm:hidden truncate">${n.split(" ")[0]}</span>
      <svg class="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  `:"<div></div>";return`
    <!-- Navigation Bar -->
    <div class="bg-white border-t border-gray-200 mt-8 sm:mt-12">
      <div class="container-responsive">
        <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center py-6 sm:py-8 gap-4 sm:gap-6 ${y}">
          ${E}
          ${c}
        </div>
      </div>
    </div>
  `}function ze(e={}){let{backText:o="Back",backId:n="backBtn",containerClass:r=""}=e;return`
    <!-- Navigation Bar -->
    <div class="bg-white border-t border-gray-200 mt-8 sm:mt-12">
      <div class="container-responsive">
        <div class="flex justify-center items-center py-6 sm:py-8 ${r}">
          <button id="${n}" class="ui-button w-full sm:w-auto sm:max-w-xs whitespace-nowrap" data-type="secondary" data-size="large">
            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            ${o}
          </button>
        </div>
      </div>
    </div>
  `}function Zt(e){return e.charAt(0).toUpperCase()+e.slice(1)}var et=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});function ke(e){return Ae.data.find(o=>o.typeName===e)}function Oe(e,o){return ke(e)?.subtypes.find(r=>r.name===o)}function xe(e,o){e.disabled=o,e.classList.toggle("cursor-default",o),e.classList.toggle("cursor-pointer",!o),e.classList.toggle("opacity-50",o)}function ve(e,o){o?(e.classList.remove("hidden"),e.removeAttribute("aria-hidden"),e.removeAttribute("hidden")):(e.classList.add("hidden"),e.setAttribute("aria-hidden","true"),e.setAttribute("hidden","true"))}var bt,Fe,De,yt,q={accountName:"",nameMatchType:"contains",nameCaseSensitive:!1,types:new Set,subtypes:new Set,transactionsMin:null,transactionsMax:null,balanceMin:null,balanceMax:null,inclusion:"all"},Ze="";function vt(){if(!V.accounts||Object.keys(V.accounts).length===0){ue("/upload",!0);return}let e=document.querySelector(".flex.flex-col.max-w-7xl"),o={backText:"Back",showBack:!0,showNext:!0,nextText:"Continue",nextId:"continueBtn",nextType:"primary"};e.insertAdjacentHTML("beforeend",Wt(o)),bt=document.getElementById("reviewTableBody"),Fe=document.getElementById("mobileAccountList"),De=document.getElementById("continueBtn"),yt=document.getElementById("searchInput"),me(),Xe(),fe(),setTimeout(()=>{Dn();let i=Object.keys(V.accounts).length;_t(i,i)},100);let n;yt.addEventListener("input",()=>{clearTimeout(n),n=setTimeout(()=>{Ze=yt.value.toLowerCase(),fe(),Ce()},200)}),setTimeout(()=>{let i=document.getElementById("filtersBtn");i?(console.log("Adding click listener to filters button"),i.addEventListener("click",c=>{console.log("Filters button clicked!"),c.preventDefault(),Qt()})):console.error("Filters button not found!");let s=document.getElementById("filtersModalClose");s&&s.addEventListener("click",Ie);let l=document.getElementById("filtersApply");l&&l.addEventListener("click",en);let u=document.getElementById("filtersReset");u&&u.addEventListener("click",nt);let k=document.getElementById("clearAllFilters");k&&k.addEventListener("click",k);let y=document.getElementById("filtersModal");y&&y.addEventListener("click",c=>{c.target.id==="filtersModal"&&Ie()}),document.addEventListener("keydown",c=>{c.key==="Escape"&&y&&!y.classList.contains("hidden")&&Ie()});let E=document.getElementById("clearFiltersBtn");E&&E.addEventListener("click",()=>{nt(),Ie()})},100),document.getElementById("unselectAllBtnMobile").addEventListener("click",()=>Vt(!1)),document.getElementById("unselectAllBtnDesktop").addEventListener("click",()=>Vt(!1)),document.getElementById("bulkIncludeBtnMobile").addEventListener("click",()=>tt(!0)),document.getElementById("bulkIncludeBtnDesktop").addEventListener("click",()=>tt(!0)),document.getElementById("bulkExcludeBtnMobile").addEventListener("click",()=>tt(!1)),document.getElementById("bulkExcludeBtnDesktop").addEventListener("click",()=>tt(!1)),document.getElementById("bulkRenameBtnMobile").addEventListener("click",qt),document.getElementById("bulkRenameBtnDesktop").addEventListener("click",qt),document.getElementById("bulkTypeBtnMobile").addEventListener("click",Kt),document.getElementById("bulkTypeBtnDesktop").addEventListener("click",Kt),document.getElementById("masterCheckbox").addEventListener("change",Yt);let r=document.getElementById("masterCheckboxMobile");r&&r.addEventListener("change",Yt),document.getElementById("continueBtn").addEventListener("click",()=>ue("/method")),document.getElementById("backBtn").addEventListener("click",()=>_e()),fe()}function Vt(e){Object.values(V.accounts).forEach(o=>{o.status!=="processed"&&(o.selected=e)}),Ce(),fe()}function tt(e){Object.values(V.accounts).forEach(o=>{o.selected&&(o.included=e)}),Ce(),fe()}function fe(){let e=document.createDocumentFragment(),o=document.createDocumentFragment(),n=Object.values(V.accounts),r=0;bt.innerHTML="",Fe&&(Fe.innerHTML="");for(let l of n)!tn(l)||Ze&&!l.modifiedName.toLowerCase().includes(Ze)||(r++,e.appendChild(Rn(l)),Fe&&o.appendChild(Fn(l)));bt.appendChild(e),Fe&&Fe.appendChild(o),_t(r,n.length),xt(rt()),kt(),wt();let i=n.filter(On).length,s=i>0;xe(De,!s),De.title=De.disabled?"At least one account must be included to proceed":"",s?De.textContent=`Continue with ${i} account${i!==1?"s":""}`:De.textContent="Continue",me()}function On(e){return e.included&&e.status!=="processed"}function Rn(e){let o=document.createElement("tr");o.setAttribute("role","row"),o.className="border-t border-[#dce1e5]";let n=e.status==="processed",r=e.status==="failed",i=document.createElement("td");i.className="px-2 py-2 text-center";let s=document.createElement("input");s.type="checkbox";let l=`account-checkbox-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;s.id=l,s.name=l,s.setAttribute("aria-label",`Select account: ${e.modifiedName}`),s.className="w-5 h-5",xe(s,n),s.checked=e.selected,s.addEventListener("change",()=>{e.selected=s.checked,kt(),xt(rt())}),i.appendChild(s),o.appendChild(i);let u=document.createElement("td");u.className="px-2 py-2 max-w-[300px] truncate",u.textContent=e.modifiedName,n?u.classList.add("text-gray-400","cursor-default"):(u.classList.add("cursor-pointer"),u.title=`Click to rename '${e.modifiedName}'`,u.addEventListener("click",()=>Jt(e,u))),o.appendChild(u);let k=document.createElement("td");k.className="px-2 py-2";let y=document.createElement("select"),E=`type-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;y.id=E,y.name=E,y.title=ke(e.type)?.typeDisplay||"",y.className="border rounded px-2 py-1 w-full",y.disabled=n,n?y.classList.add("text-gray-300","cursor-default"):y.classList.add("cursor-pointer"),Ae.data.forEach(v=>{let M=document.createElement("option");M.value=v.typeName,M.textContent=v.typeDisplay,v.typeName===e.type&&(M.selected=!0),y.appendChild(M)}),y.addEventListener("change",()=>{e.type=y.value;let v=ke(e.type);e.subtype=v?.subtypes[0]?.name||null,fe()}),k.appendChild(y),o.appendChild(k);let c=document.createElement("td");c.className="px-2 py-2";let w=document.createElement("select"),d=`subtype-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;w.id=d,w.name=d,w.className="border rounded px-2 py-1 w-full",w.disabled=n,n?w.classList.add("text-gray-300","cursor-default"):w.classList.add("cursor-pointer");let g=ke(e.type);w.title=Oe(e.type,e.subtype)?.display||"",(g?.subtypes||[]).forEach(v=>{let M=document.createElement("option");M.value=v.name,M.textContent=v.display,v.name===e.subtype&&(M.selected=!0),w.appendChild(M)}),w.addEventListener("change",()=>{e.subtype=w.value,fe()}),c.appendChild(w),o.appendChild(c);let p=document.createElement("td");p.className="px-2 py-2 text-center cursor-default",p.textContent=e.transactionCount,p.title=`${e.transactionCount} transaction${e.transactionCount!==1?"s":""}`,n&&p.classList.add("text-gray-400"),o.appendChild(p);let x=document.createElement("td");x.className="px-2 py-2 text-[#637988] cursor-default",x.textContent=et.format(e.balance),x.title=`Balance: ${et.format(e.balance)}`,n&&x.classList.add("text-gray-400"),o.appendChild(x);let C=document.createElement("td");C.className="px-2 py-2 flex items-center gap-2";let S=document.createElement("button");if(S.classList.add("ui-button"),S.dataset.type=e.included?"primary":"secondary",S.dataset.size="small",S.textContent=n?"Processed":e.included?"Included":"Excluded",S.disabled=n,S.title=n?"This account has already been processed":e.included?"Click to exclude this account":"Click to include this account",n||S.addEventListener("click",()=>{e.included=!e.included,Ce(),fe()}),C.appendChild(S),r){let v=document.createElement("span");v.className="text-red-600 text-xl cursor-default",v.innerHTML="\u26A0\uFE0F",v.title="Previously failed to process",C.appendChild(v)}return o.appendChild(C),o}function Fn(e){let o=document.createElement("div");o.className="mobile-account-card";let n=e.status==="processed",r=e.status==="failed",i=document.createElement("label");i.className="custom-checkbox-container flex-shrink-0";let s=document.createElement("input");s.type="checkbox",s.className="custom-checkbox-input";let l=`mobile-account-checkbox-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;s.id=l,s.name=l,s.setAttribute("aria-label",`Select account: ${e.modifiedName}`),s.disabled=n,s.checked=e.selected||!1,s.addEventListener("change",()=>{e.selected=s.checked,Ce(),kt(),xt(rt()),wt()});let u=document.createElement("span");u.className="custom-checkbox-visual",i.appendChild(s),i.appendChild(u),o.appendChild(i);let k=document.createElement("div");k.className="card-content";let y=document.createElement("div");y.className="account-name",y.textContent=e.modifiedName,n?y.classList.add("text-gray-400","cursor-default"):(y.classList.add("cursor-pointer","hover:text-blue-600","transition-colors","duration-200"),y.title=`Click to rename '${e.modifiedName}'`,y.addEventListener("click",()=>Jt(e,y))),k.appendChild(y);let E=document.createElement("div");E.className="account-details";let c=document.createElement("div");c.className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4";let w=document.createElement("div");w.className="flex items-center gap-2 flex-1 min-w-0";let d=document.createElement("span");d.textContent="Type:",d.className="text-xs font-medium text-gray-500 flex-shrink-0";let g=document.createElement("select"),p=`mobile-type-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;g.id=p,g.name=p,g.title=ke(e.type)?.typeDisplay||"",g.className="border border-gray-300 rounded-lg px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white",g.disabled=n,n?g.classList.add("text-gray-300","bg-gray-50","cursor-not-allowed"):g.classList.add("cursor-pointer"),Ae.data.forEach(F=>{let b=document.createElement("option");b.value=F.typeName,b.textContent=F.typeDisplay,F.typeName===e.type&&(b.selected=!0),g.appendChild(b)}),g.addEventListener("change",()=>{e.type=g.value;let F=ke(e.type);e.subtype=F?.subtypes[0]?.name||null,fe()}),w.appendChild(d),w.appendChild(g),c.appendChild(w);let x=document.createElement("div");x.className="flex items-center gap-2 flex-1 min-w-0";let C=document.createElement("span");C.textContent="Sub:",C.className="text-xs font-medium text-gray-500 flex-shrink-0";let S=document.createElement("select"),v=`mobile-subtype-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;S.id=v,S.name=v,S.className="border border-gray-300 rounded-lg px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white",S.disabled=n,n?S.classList.add("text-gray-300","bg-gray-50","cursor-not-allowed"):S.classList.add("cursor-pointer");let M=ke(e.type);S.title=Oe(e.type,e.subtype)?.display||"",(M?.subtypes||[]).forEach(F=>{let b=document.createElement("option");b.value=F.name,b.textContent=F.display,F.name===e.subtype&&(b.selected=!0),S.appendChild(b)}),S.addEventListener("change",()=>{e.subtype=S.value,fe()}),x.appendChild(C),x.appendChild(S),c.appendChild(x),E.appendChild(c);let A=document.createElement("div");A.className="flex justify-between items-center";let h=document.createElement("span");h.className=n?"text-gray-400":"text-gray-600",h.textContent=`${e.transactionCount} transaction${e.transactionCount!==1?"s":""}`;let f=document.createElement("span");f.className=`account-balance ${n?"text-gray-400":"text-gray-900"}`,f.textContent=et.format(e.balance),A.appendChild(h),A.appendChild(f),E.appendChild(A);let B=document.createElement("div");if(B.className="flex items-center justify-end pt-1",!n){let F=document.createElement("button");F.className=`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${e.included?"bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-500":"bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 focus:ring-green-500"}`,F.textContent=e.included?"Exclude":"Include",F.title=e.included?"Click to exclude this account":"Click to include this account",F.addEventListener("click",()=>{e.included=!e.included,fe()}),B.appendChild(F)}if(r){let F=document.createElement("span");F.className="text-red-600 text-lg cursor-default ml-2",F.innerHTML="\u26A0\uFE0F",F.title="Previously failed to process",B.appendChild(F)}return E.appendChild(B),k.appendChild(E),o.appendChild(k),o}function xt(e){let o=document.getElementById("masterCheckbox"),n=document.getElementById("masterCheckboxMobile"),r=e.filter(l=>l.selected).length,i=r>0&&r===e.length,s=r>0&&r<e.length;o&&(o.checked=i,o.indeterminate=s),n&&(n.checked=i,n.indeterminate=s),wt()}function wt(){let e=document.getElementById("mobileSelectionCount");if(e){let o=Object.values(V.accounts).filter(n=>n.selected).length;e.textContent=`${o} selected`}}function rt(){return Object.values(V.accounts).filter(e=>!(e.status==="processed"||!tn(e)||Ze&&!e.modifiedName.toLowerCase().includes(Ze)))}function Yt(e){let o=e.target.checked;rt().forEach(n=>{n.selected=o}),fe()}function kt(){let e=document.getElementById("bulkActionBar"),o=Object.values(V.accounts).filter(i=>i.selected).length,n=document.getElementById("selectedCountMobile");n&&(n.textContent=o);let r=document.getElementById("selectedCountDesktop");r&&(r.textContent=o),o>0?(e.classList.remove("hidden"),e.classList.add("active")):(e.classList.remove("active"),setTimeout(()=>{e.classList.contains("active")||e.classList.add("hidden")},300))}function Jt(e,o){let n=document.createElement("div");n.className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 opacity-0 transition-opacity duration-200",document.body.appendChild(n),requestAnimationFrame(()=>n.classList.add("opacity-100"));let r=document.createElement("div");r.className="bg-white rounded-lg shadow-lg p-5 w-[400px]";let i=document.createElement("h2");i.className="font-bold mb-3 text-lg",i.textContent="Edit Account Name",r.appendChild(i);let s=document.createElement("input");s.type="text",s.value=e.modifiedName,s.setAttribute("aria-label","Account name input"),s.className="border rounded w-full px-3 py-2 mb-4",r.appendChild(s);let l=document.createElement("div");l.className="flex justify-end gap-2";let u=document.createElement("button");u.textContent="Cancel",u.className="bg-gray-300 px-4 py-2 rounded",u.addEventListener("click",()=>y());let k=document.createElement("button");k.textContent="Save",k.className="bg-blue-500 text-white px-4 py-2 rounded font-bold",k.addEventListener("click",E),l.appendChild(u),l.appendChild(k),r.appendChild(l),n.appendChild(r),s.focus(),s.select(),n.addEventListener("keydown",c=>{c.key==="Escape"&&y(),c.key==="Enter"&&E()});function y(){n.classList.remove("opacity-100"),n.classList.add("opacity-0"),setTimeout(()=>document.body.removeChild(n),200)}function E(){e.modifiedName=s.value.trim(),o.textContent=e.modifiedName,o.title=`Click to rename '${e.modifiedName}'`,y()}}function qt(){let e=document.getElementById("bulkRenameModal"),o=document.getElementById("renamePattern"),n=document.getElementById("indexStart"),r=document.getElementById("renamePreview"),i=document.getElementById("renameCancel"),s=document.getElementById("renameApply"),l=e.querySelectorAll(".token-btn");e.classList.remove("hidden"),o.focus();let u=Object.values(V.accounts).filter(y=>y.selected);l.forEach(y=>{y.addEventListener("click",()=>{let E=y.dataset.token;o.value+=E,k()})}),o.addEventListener("input",k),n.addEventListener("input",k),k();function k(){r.innerHTML="";let y=o.value,E=parseInt(n.value,10)||1;u.slice(0,3).forEach((c,w)=>{let d=Gt(y,c,w+E),g=document.createElement("div");g.textContent=d,r.appendChild(g)})}i.onclick=()=>e.classList.add("hidden"),s.onclick=()=>{let y=o.value,E=parseInt(n.value,10)||1;u.forEach((c,w)=>{c.modifiedName=Gt(y,c,w+E)}),e.classList.add("hidden"),fe()}}function Gt(e,o,n){let r=new Date().toISOString().split("T")[0];return e.replace(/{{YNAB}}/g,o.originalYnabName?.trim()||o.name||"Account").replace(/{{Index}}/g,n).replace(/{{Upper}}/g,(o.originalYnabName?.trim()||o.name||"Account").toUpperCase()).replace(/{{Date}}/g,r)}function Kt(){let e=document.getElementById("bulkTypeModal"),o=document.getElementById("bulkTypeSelect"),n=document.getElementById("bulkSubtypeSelect"),r=document.getElementById("bulkTypeCancel"),i=document.getElementById("bulkTypeApply");e.classList.remove("hidden"),o.innerHTML="",Ae.data.forEach(l=>{let u=document.createElement("option");u.value=l.typeName,u.textContent=l.typeDisplay,o.appendChild(u)});function s(){let l=ke(o.value);if(n.innerHTML="",(l?.subtypes||[]).forEach(u=>{let k=document.createElement("option");k.value=u.name,k.textContent=u.display,n.appendChild(k)}),(l?.subtypes||[]).length===0){let u=document.createElement("option");u.value="",u.textContent="-",n.appendChild(u)}}o.addEventListener("change",s),s(),r.onclick=()=>e.classList.add("hidden"),i.onclick=()=>{let l=o.value,u=n.value;Object.values(V.accounts).filter(y=>y.selected).forEach(y=>{y.type=l,y.subtype=u||null}),e.classList.add("hidden"),fe()}}function Dn(){console.log("Initializing filters modal...");try{Pn(),jn(),Ee(),console.log("Filters modal initialized successfully")}catch(e){console.error("Error initializing filters modal:",e)}}function Pn(){let e=document.getElementById("typeFiltersContainer");if(!e){console.error("typeFiltersContainer not found");return}let o=[...new Set(Ae.data.map(n=>n.typeDisplay))].sort();e.innerHTML="",o.forEach(n=>{let r=Xt("type",n,n);e.appendChild(r)}),console.log(`Populated ${o.length} type filters`)}function jn(){let e=document.getElementById("subtypeFiltersContainer");if(!e){console.error("subtypeFiltersContainer not found");return}let o=new Set;Ae.data.forEach(r=>{r.subtypes.forEach(i=>{o.add(i.display)})});let n=[...o].sort();e.innerHTML="",n.forEach(r=>{let i=Xt("subtype",r,r);e.appendChild(i)}),console.log(`Populated ${n.length} subtype filters`)}function Xt(e,o,n){let r=document.createElement("div");r.className="flex items-center";let i=document.createElement("input");i.type="checkbox",i.id=`filter-${e}-${o.replace(/\s+/g,"-")}`,i.value=o,i.className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",i.addEventListener("change",Ee);let s=document.createElement("label");return s.htmlFor=i.id,s.className="ml-2 text-sm text-gray-700 cursor-pointer",s.textContent=n,r.appendChild(i),r.appendChild(s),r}function Qt(){console.log("Opening filters modal...");try{let e=document.getElementById("filterAccountName");e&&(e.value=q.accountName);let o=document.querySelector(`input[name="nameMatchType"][value="${q.nameMatchType}"]`);o&&(o.checked=!0);let n=document.getElementById("nameCaseSensitive");n&&(n.checked=q.nameCaseSensitive),document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(y=>{y.checked=q.types.has(y.value)}),document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(y=>{y.checked=q.subtypes.has(y.value)});let r=document.getElementById("filterTransactionsMin");r&&(r.value=q.transactionsMin||"");let i=document.getElementById("filterTransactionsMax");i&&(i.value=q.transactionsMax||"");let s=document.getElementById("filterBalanceMin");s&&(s.value=q.balanceMin||"");let l=document.getElementById("filterBalanceMax");l&&(l.value=q.balanceMax||"");let u=document.querySelector(`input[name="inclusionFilter"][value="${q.inclusion}"]`);u&&(u.checked=!0);let k=document.getElementById("filtersModal");k?(console.log("Found modal, showing it..."),k.classList.remove("hidden"),setTimeout(()=>k.classList.add("show"),10)):console.error("Modal not found!")}catch(e){console.error("Error opening filters modal:",e)}}window.openFiltersModal=Qt;function Ie(){let e=document.getElementById("filtersModal");e.classList.remove("show"),setTimeout(()=>e.classList.add("hidden"),300)}window.closeFiltersModal=Ie;function en(){console.log("Apply filters button clicked!");try{let e=document.getElementById("filterAccountName");q.accountName=e?e.value.trim():"";let o=document.querySelector('input[name="nameMatchType"]:checked');q.nameMatchType=o?o.value:"contains";let n=document.getElementById("nameCaseSensitive");q.nameCaseSensitive=n?n.checked:!1,q.types.clear(),document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]:checked').forEach(k=>{q.types.add(k.value)}),q.subtypes.clear(),document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]:checked').forEach(k=>{q.subtypes.add(k.value)});let r=document.getElementById("filterTransactionsMin"),i=document.getElementById("filterTransactionsMax");q.transactionsMin=r&&r.value?parseInt(r.value):null,q.transactionsMax=i&&i.value?parseInt(i.value):null;let s=document.getElementById("filterBalanceMin"),l=document.getElementById("filterBalanceMax");q.balanceMin=s&&s.value?parseFloat(s.value):null,q.balanceMax=l&&l.value?parseFloat(l.value):null;let u=document.querySelector('input[name="inclusionFilter"]:checked');q.inclusion=u?u.value:"all",console.log("Applied filters:",q),Ie(),fe(),Ee(),Ce()}catch(e){console.error("Error applying filters:",e)}}window.applyFilters=en;function nt(){console.log("Reset filters button clicked!");try{let e=document.getElementById("filterAccountName");e&&(e.value="");let o=document.querySelector('input[name="nameMatchType"][value="contains"]');o&&(o.checked=!0);let n=document.getElementById("nameCaseSensitive");n&&(n.checked=!1),document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(k=>k.checked=!1),document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(k=>k.checked=!1);let r=document.getElementById("filterTransactionsMin");r&&(r.value="");let i=document.getElementById("filterTransactionsMax");i&&(i.value="");let s=document.getElementById("filterBalanceMin");s&&(s.value="");let l=document.getElementById("filterBalanceMax");l&&(l.value="");let u=document.querySelector('input[name="inclusionFilter"][value="all"]');u&&(u.checked=!0),q={accountName:"",nameMatchType:"contains",nameCaseSensitive:!1,types:new Set,subtypes:new Set,transactionsMin:null,transactionsMax:null,balanceMin:null,balanceMax:null,inclusion:"all"},fe(),Ee(),Ce(),Ie(),console.log("Filters reset successfully")}catch(e){console.error("Error resetting filters:",e)}}window.resetFilters=nt;function Un(){console.log("Clear all filters clicked!"),nt(),Ie()}window.clearAllFilters=Un;function Ee(){let e=document.getElementById("filterCount"),o=document.getElementById("activeFiltersSection"),n=document.getElementById("activeFiltersContainer"),r=0,i=[];if(q.accountName&&(r++,i.push(Re("Name",`${q.nameMatchType}: "${q.accountName}"`,()=>{q.accountName="",document.getElementById("filterAccountName").value="",fe(),Ee()}))),q.types.size>0){r++;let s=[...q.types].join(", ");i.push(Re("Types",s,()=>{q.types.clear(),document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(l=>l.checked=!1),fe(),Ee()}))}if(q.subtypes.size>0){r++;let s=[...q.subtypes].join(", ");i.push(Re("Subtypes",s,()=>{q.subtypes.clear(),document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(l=>l.checked=!1),fe(),Ee()}))}if(q.transactionsMin!==null||q.transactionsMax!==null){r++;let s=q.transactionsMin||0,l=q.transactionsMax||"\u221E";i.push(Re("Transactions",`${s} - ${l}`,()=>{q.transactionsMin=null,q.transactionsMax=null,document.getElementById("filterTransactionsMin").value="",document.getElementById("filterTransactionsMax").value="",fe(),Ee()}))}if(q.balanceMin!==null||q.balanceMax!==null){r++;let s=q.balanceMin!==null?`$${q.balanceMin}`:"$0",l=q.balanceMax!==null?`$${q.balanceMax}`:"\u221E";i.push(Re("Balance",`${s} - ${l}`,()=>{q.balanceMin=null,q.balanceMax=null,document.getElementById("filterBalanceMin").value="",document.getElementById("filterBalanceMax").value="",fe(),Ee()}))}q.inclusion!=="all"&&(r++,i.push(Re("Status",Zt(q.inclusion),()=>{q.inclusion="all",document.querySelector('input[name="inclusionFilter"][value="all"]').checked=!0,fe(),Ee()}))),r>0?(e.textContent=r,e.classList.remove("hidden")):e.classList.add("hidden"),i.length>0?(o.classList.remove("hidden"),n.innerHTML="",i.forEach(s=>n.appendChild(s))):o.classList.add("hidden"),_t(visibleCount,accounts.length)}function Re(e,o,n){let r=document.createElement("div");r.className="filter-chip";let i=document.createElement("span");i.textContent=`${e}: ${o}`;let s=document.createElement("button");return s.onclick=n,s.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',r.appendChild(i),r.appendChild(s),r}function tn(e){if(q.accountName){let r=q.nameCaseSensitive?e.modifiedName:e.modifiedName.toLowerCase(),i=q.nameCaseSensitive?q.accountName:q.accountName.toLowerCase();if(q.nameMatchType==="exact"){if(r!==i)return!1}else if(!r.includes(i))return!1}if(q.types.size>0){let r=ke(e.type),i=r?r.typeDisplay:e.type||"";if(!q.types.has(i))return!1}if(q.subtypes.size>0){let r=Oe(e.subtype),i=r?r.display:e.subtype||"";if(!q.subtypes.has(i))return!1}let o=e.transactionCount||0;if(q.transactionsMin!==null&&o<q.transactionsMin||q.transactionsMax!==null&&o>q.transactionsMax)return!1;let n=parseFloat(e.balance)||0;return!(q.balanceMin!==null&&n<q.balanceMin||q.balanceMax!==null&&n>q.balanceMax||q.inclusion==="included"&&!e.included||q.inclusion==="excluded"&&e.included)}function _t(e,o){let n=document.getElementById("visibleAccountCount"),r=document.getElementById("totalAccountCount"),i=document.getElementById("filterResultsSummary"),s=document.getElementById("filterNotificationBadge"),l=document.getElementById("clearFiltersBtn");n&&(n.textContent=e),r&&(r.textContent=o);let u=$n(),k=Hn();u&&k>0&&s?(s.textContent=k,s.classList.remove("hidden")):s&&s.classList.add("hidden"),u&&l?l.classList.remove("hidden"):l&&l.classList.add("hidden"),u&&i?i.classList.add("filtered"):i&&i.classList.remove("filtered")}function $n(){return q.accountName||q.types.size>0||q.subtypes.size>0||q.transactionsMin!==null||q.transactionsMax!==null||q.balanceMin!==null||q.balanceMax!==null||q.inclusion!=="all"}function Hn(){let e=0;return q.accountName&&e++,q.types.size>0&&e++,q.subtypes.size>0&&e++,(q.transactionsMin!==null||q.transactionsMax!==null)&&e++,(q.balanceMin!==null||q.balanceMax!==null)&&e++,q.inclusion!=="all"&&e++,e}var nn=`<div class="container-responsive flex flex-1 justify-center py-3 sm:py-5 md:py-6">
  <div class="flex flex-col max-w-7xl flex-1 w-full">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 bg-white rounded-lg mb-4 sm:mb-6 border border-gray-100 shadow-sm">
      <div>
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">Review Accounts</h2>
        <p class="text-gray-600 text-sm sm:text-base">
          Review detected accounts and adjust their Monarch types before importing.
        </p>
      </div>
    </div>

    <!-- Control Bar -->
    <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between 
                p-4 sm:p-6 gap-4 lg:gap-6 bg-white rounded-lg mb-4 sm:mb-6 
                border border-gray-100 shadow-sm">
      
      <!-- Filters, Search and Account Summary -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1">
        <!-- Filters Button -->
        <div class="flex-shrink-0">
          <button id="filtersBtn" 
                  class="flex items-center gap-2 px-4 py-2 sm:py-3 text-sm sm:text-base
                         border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer 
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                         relative whitespace-nowrap"
                  title="Open advanced filters"
                  onclick="window.openFiltersModal && window.openFiltersModal()">
            <!-- Notification Badge -->
            <div id="filterNotificationBadge" class="hidden"></div>
            
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            <span>Filters</span>
          </button>
        </div>
        
        <!-- Search Input -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input id="searchInput" 
                   type="text" 
                   placeholder="Search accounts..." 
                   style="padding-left: 2.75rem !important;"
                   class="block w-full pr-3 py-2 sm:py-3 text-sm sm:text-base
                          border border-gray-300 rounded-lg placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          transition-colors duration-200">
          </div>
        </div>
        
        <!-- Account Count Summary -->
        <div id="filterResultsSummary" class="text-sm text-gray-600 whitespace-nowrap">
          Showing <span id="visibleAccountCount" class="font-medium text-gray-900">0</span> 
          of <span id="totalAccountCount" class="font-medium text-gray-900">0</span> accounts
        </div>
      </div>

      <!-- Clear Filter Controls -->
      <div class="flex items-center gap-3">
        <!-- Clear All Filters Button (only shown when filters are active) -->
        <button id="clearFiltersBtn" 
                class="hidden px-3 py-2 sm:py-3 text-sm text-red-600 hover:text-red-800 
                       hover:bg-red-50 rounded-lg transition-colors duration-200 
                       focus:outline-none focus:ring-2 focus:ring-red-500"
                title="Clear all filters"
                onclick="window.clearAllFilters && window.clearAllFilters()">
          Clear
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      
      <!-- Mobile Card View (hidden on larger screens) -->
      <div id="mobileView" class="block lg:hidden">
        <!-- Mobile Header with Master Checkbox -->
        <div class="border-b border-gray-200 bg-gray-50 p-4">
          <div class="flex items-center justify-between">
            <label class="custom-checkbox-container">
              <input type="checkbox" 
                     id="masterCheckboxMobile" 
                     class="custom-checkbox-input">
              <span class="custom-checkbox-visual"></span>
              <span class="text-sm font-medium text-gray-700 pl-2">Select All</span>
            </label>
            <div class="text-xs text-gray-500 font-medium" id="mobileSelectionCount">0 selected</div>
          </div>
        </div>
        
        <div id="mobileAccountList" class="divide-y divide-gray-100">
          <!-- populated dynamically for mobile -->
        </div>
      </div>

      <!-- Desktop Table View (hidden on mobile) -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full min-w-[800px]" role="grid">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200" role="row">
              <th class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 w-[50px] sm:w-[60px]">
                <input type="checkbox" 
                       id="masterCheckbox" 
                       class="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer rounded border-gray-300 
                              text-blue-600 focus:ring-blue-500 focus:ring-2">
              </th>
              <th scope="col" class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[200px]">
                Account Name
              </th>
              <th scope="col" class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[150px]">
                Type
              </th>
              <th scope="col" class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[150px]">
                Subtype
              </th>
              <th scope="col" class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[100px] text-center">
                Transactions
              </th>
              <th scope="col" class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[120px] text-right">
                Balance
              </th>
              <th scope="col" class="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[100px] text-center">
                Include
              </th>
            </tr>
          </thead>
          <tbody id="reviewTableBody" class="divide-y divide-gray-100">
            <!-- populated dynamically -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bulk Action Bar -->
    <div id="bulkActionBar"
         class="hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
      
      <!-- Mobile Bulk Actions (visible on mobile/tablet) -->
      <div class="block lg:hidden bg-white shadow-2xl rounded-xl border border-gray-200 w-[calc(100vw-2rem)] max-w-md mx-auto">
        <div class="p-4">
          <div class="flex flex-col gap-3">
            <!-- Selection Info -->
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900">
                <span id="selectedCountMobile">0</span> selected
              </span>
              <button id="unselectAllBtnMobile"
                      class="text-xs font-medium px-3 py-1.5 border border-gray-300 text-gray-700 
                             bg-white rounded-md hover:bg-gray-50 cursor-pointer transition-colors 
                             duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Unselect all accounts">
                Clear
              </button>
            </div>
            
            <!-- Action Buttons Grid -->
            <div class="grid grid-cols-2 gap-2">
              <button id="bulkRenameBtnMobile"
                      class="flex items-center justify-center gap-2 px-3 py-3 border border-gray-300 
                             bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors 
                             duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Bulk rename accounts">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span class="text-sm font-medium">Rename</span>
              </button>

              <button id="bulkTypeBtnMobile"
                      class="flex items-center justify-center gap-2 px-3 py-3 border border-gray-300 
                             bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors 
                             duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Bulk edit account types">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span class="text-sm font-medium">Edit Type</span>
              </button>

              <button id="bulkIncludeBtnMobile"
                      class="flex items-center justify-center gap-2 px-3 py-3 border border-green-300 
                             text-green-700 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer 
                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Include selected accounts">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm font-medium">Include</span>
              </button>

              <button id="bulkExcludeBtnMobile"
                      class="flex items-center justify-center gap-2 px-3 py-3 border border-red-300 
                             text-red-700 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer 
                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Exclude selected accounts">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-sm font-medium">Exclude</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Bulk Actions (visible on desktop) -->
      <div class="hidden lg:block bg-white shadow-2xl rounded-xl border border-gray-200">
        <div class="px-6 py-4">
          <div class="flex items-center gap-6">
            <!-- Selection Count -->
            <button id="unselectAllBtnDesktop"
                    class="text-sm font-medium px-4 py-2 border border-gray-300 
                           rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors 
                           duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Unselect all accounts">
              <span id="selectedCountDesktop">0</span> selected
            </button>

            <!-- Separator -->
            <div class="h-6 border-l border-gray-300"></div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3">
              <button id="bulkRenameBtnDesktop"
                      class="text-sm font-medium px-4 py-2 border border-gray-300 
                             rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Bulk rename accounts">
                Rename
              </button>

              <button id="bulkTypeBtnDesktop"
                      class="text-sm font-medium px-4 py-2 border border-gray-300 
                             rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Bulk edit account types">
                Edit Type
              </button>

              <button id="bulkIncludeBtnDesktop"
                      class="text-sm font-medium px-4 py-2 border border-green-300 
                             text-green-700 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer 
                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Include selected accounts">
                Include
              </button>

              <button id="bulkExcludeBtnDesktop"
                      class="text-sm font-medium px-4 py-2 border border-red-300 
                             text-red-700 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer 
                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Exclude selected accounts">
                Exclude
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation will be added here by JavaScript -->

  </div>
</div>

<div id="bulkRenameModal" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 hidden p-3 sm:p-4">
  <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">

    <h2 class="text-lg sm:text-xl font-bold mb-4">Bulk Rename Accounts</h2>

    <label for="renamePattern" class="font-medium text-sm">Pattern:</label>
    <input id="renamePattern" name="renamePattern" type="text" 
           class="border rounded w-full px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
           placeholder="e.g. {{YNAB}} - {{Index}}">

    <!-- Token shortcuts -->
    <div class="grid grid-cols-2 gap-2 mb-4">
      <button class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-xs sm:text-sm cursor-pointer transition-colors duration-200"
        data-token="{{YNAB}}">YNAB Name</button>
      <button class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-xs sm:text-sm cursor-pointer transition-colors duration-200"
        data-token="{{Index}}">Index</button>
      <button class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-xs sm:text-sm cursor-pointer transition-colors duration-200"
        data-token="{{Upper}}">Uppercase YNAB</button>
      <button class="token-btn bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-xs sm:text-sm cursor-pointer transition-colors duration-200"
        data-token="{{Date}}">Today (YYYY-MM-DD)</button>
    </div>

    <!-- Index start -->
    <div class="flex items-center gap-3 mb-4">
      <label for="indexStart" class="text-sm">Index Start:</label>
      <input id="indexStart" type="number" 
             class="border rounded px-3 py-2 w-20 sm:w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
             value="1" />
    </div>

    <!-- Preview -->
    <div class="border rounded p-3 bg-gray-50 mb-4">
      <div class="font-medium text-sm mb-2">Preview:</div>
      <div id="renamePreview" class="text-xs sm:text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto" aria-live="polite"></div>
    </div>

    <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
      <button id="renameCancel" class="ui-button order-2 sm:order-1 w-full sm:w-auto" data-type="secondary">Cancel</button>
      <button id="renameApply" class="ui-button order-1 sm:order-2 w-full sm:w-auto" data-type="primary">Apply</button>
    </div>

  </div>
</div>

<div id="bulkTypeModal" class="fixed inset-0 bg-black bg-opacity-40 hidden z-50 flex items-center justify-center p-3 sm:p-4">
  <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
    <h2 class="text-lg font-bold mb-4">Bulk Edit Account Type</h2>

    <div class="mb-4">
      <label for="bulkTypeSelect" class="block mb-2 font-medium text-sm">Account Type</label>
      <select id="bulkTypeSelect" name="bulkSubtypeSelect" 
              class="border rounded w-full px-3 py-2 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></select>
    </div>

    <div class="mb-6">
      <label for="bulkSubtypeSelect" class="block mb-2 font-medium text-sm">Subtype</label>
      <select id="bulkSubtypeSelect" 
              class="border rounded w-full px-3 py-2 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></select>
    </div>

    <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
      <button id="bulkTypeCancel" class="ui-button order-2 sm:order-1 w-full sm:w-auto" data-type="secondary">Cancel</button>
      <button id="bulkTypeApply" class="ui-button order-1 sm:order-2 w-full sm:w-auto" data-type="primary">Apply</button>
    </div>
  </div>
</div>

<!-- Advanced Filters Modal -->
<div id="filtersModal" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 hidden p-3 sm:p-4">
  <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col relative">
    
    <!-- Modal Header -->
    <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0 rounded-t-lg">
      <h2 class="text-lg sm:text-xl font-bold text-gray-900">Advanced Filters</h2>
      <button id="filtersModalClose" 
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              title="Close filters"
              onclick="window.closeFiltersModal && window.closeFiltersModal()">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Modal Content - Scrollable -->
    <div class="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
      
      <!-- Active Filters Display -->
      <div id="activeFiltersSection" class="hidden">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-medium text-gray-700">Active Filters</h3>
          <button id="clearAllFilters" 
                  class="text-xs text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  onclick="window.clearAllFilters && window.clearAllFilters()">
            Clear All
          </button>
        </div>
        <div id="activeFiltersContainer" class="flex flex-wrap gap-2"></div>
        <hr class="mt-4">
      </div>

      <!-- Account Name Filter -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-900">Account Name</h3>
        <div class="space-y-3">
          <input id="filterAccountName" 
                 type="text" 
                 placeholder="Enter account name..."
                 class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center">
              <input type="radio" name="nameMatchType" value="contains" checked 
                     class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">
              <span class="ml-2 text-sm text-gray-700">Contains</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="nameMatchType" value="exact" 
                     class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">
              <span class="ml-2 text-sm text-gray-700">Exact match</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" id="nameCaseSensitive" 
                     class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <span class="ml-2 text-sm text-gray-700">Case sensitive</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Account Type Filter -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-900">Account Type</h3>
        <div class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div id="typeFiltersContainer" class="space-y-2">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>

      <!-- Account Subtype Filter -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-900">Account Subtype</h3>
        <div class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div id="subtypeFiltersContainer" class="space-y-2">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>

      <!-- Transactions Count Filter -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-900">Transaction Count</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Minimum</label>
            <input id="filterTransactionsMin" 
                   type="number" 
                   placeholder="0"
                   min="0"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Maximum</label>
            <input id="filterTransactionsMax" 
                   type="number" 
                   placeholder="999999"
                   min="0"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>
      </div>

      <!-- Balance Filter -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-900">Balance</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-600 mb-1">Minimum ($)</label>
            <input id="filterBalanceMin" 
                   type="number" 
                   placeholder="0.00"
                   step="0.01"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Maximum ($)</label>
            <input id="filterBalanceMax" 
                   type="number" 
                   placeholder="999999.99"
                   step="0.01"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>
      </div>

      <!-- Inclusion Status Filter -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-900">Include Status</h3>
        <div class="flex flex-wrap gap-4">
          <label class="flex items-center">
            <input type="radio" name="inclusionFilter" value="all" checked 
                   class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">
            <span class="ml-2 text-sm text-gray-700">All accounts</span>
          </label>
          <label class="flex items-center">
            <input type="radio" name="inclusionFilter" value="included" 
                   class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">
            <span class="ml-2 text-sm text-gray-700">Included only</span>
          </label>
          <label class="flex items-center">
            <input type="radio" name="inclusionFilter" value="excluded" 
                   class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">
            <span class="ml-2 text-sm text-gray-700">Excluded only</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Modal Footer - Fixed at bottom -->
    <div class="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg flex-shrink-0">
      <button id="filtersReset" 
              class="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 
                     cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onclick="window.resetFilters && window.resetFilters()">
        Reset Filters
      </button>
      <button id="filtersApply" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer 
                     transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onclick="window.applyFilters && window.applyFilters()">
        Apply Filters
      </button>
    </div>
  </div>
</div>

<style>
  /* Filter chip styles */
  .filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #dbeafe;
    color: #1e40af;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    max-width: 250px;
  }

  .filter-chip span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Mini filter chips for status bar */
  .filter-chip-mini {
    display: inline-flex;
    align-items: center;
    background-color: #1e40af;
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.625rem;
    font-weight: 500;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Filter results summary styling */
  #filterResultsSummary {
    transition: all 0.3s ease;
  }

  #filterResultsSummary.filtered {
    color: #1e40af;
    font-weight: 500;
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

  /* Clear filters button animation */
  #clearFiltersBtn {
    transition: all 0.3s ease;
    transform: scale(0.95);
    opacity: 0;
  }

  #clearFiltersBtn:not(.hidden) {
    transform: scale(1);
    opacity: 1;
  }

  .filter-chip button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    margin-left: 0.25rem;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .filter-chip button:hover {
    background-color: rgba(59, 130, 246, 0.2);
  }

  .filter-chip svg {
    width: 0.75rem;
    height: 0.75rem;
  }

  /* Modal animation and layout */
  #filtersModal {
    transition: opacity 0.3s ease;
    opacity: 0;
  }

  #filtersModal.show {
    opacity: 1;
  }

  #filtersModal.hide {
    opacity: 0;
  }

  /* Ensure proper modal sizing and scrolling */
  #filtersModal .max-w-2xl {
    min-height: 300px;
  }

  /* Improve mobile modal experience */
  @media (max-width: 640px) {
    #filtersModal .max-w-2xl {
      max-width: calc(100vw - 1.5rem);
      margin: 0.75rem;
    }
    
    #filtersModal .max-h-\\[90vh\\] {
      max-height: calc(100vh - 1.5rem);
    }

    /* Ensure footer buttons are properly sized on mobile */
    #filtersModal .flex-col.sm\\:flex-row button {
      min-height: 44px;
    }
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

  .mobile-account-card .account-details > div {
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

  .custom-checkbox-input:checked + .custom-checkbox-visual {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  .custom-checkbox-input:checked + .custom-checkbox-visual::after {
    display: block;
  }

  .custom-checkbox-input:focus + .custom-checkbox-visual {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    outline: none;
  }

  .custom-checkbox-input:disabled + .custom-checkbox-visual {
    background-color: #f3f4f6;
    border-color: #e5e7eb;
    cursor: not-allowed;
  }

  .custom-checkbox-container:hover .custom-checkbox-input:not(:disabled) + .custom-checkbox-visual {
    border-color: #3b82f6;
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

    button, select {
      min-height: 44px;
      padding: 0.75rem;
    }
    
    .token-btn {
      min-height: 44px;
    }

    input[type="text"], input[type="number"] {
      min-height: 44px;
      padding: 0.75rem;
    }
  }
</style>
`;function Ct(){if(!V.accounts||Object.keys(V.accounts).length===0){ue("/upload",!0);return}document.querySelector(".container-responsive").insertAdjacentHTML("beforeend",ze({backText:"Back"})),me(),Xe();let o=document.getElementById("manualImportBtn"),n=document.getElementById("autoImportBtn"),r=document.getElementById("backBtn"),i=Object.keys(V.accounts).length,s=Object.values(V.accounts).filter(l=>l.included).length;document.getElementById("totalCountDisplay").textContent=i,document.getElementById("filesCountDisplay").textContent=s,document.getElementById("manualFileCount").textContent=s,o.addEventListener("click",()=>{ue("/manual")}),n.addEventListener("click",()=>{ue("/login")}),r.addEventListener("click",()=>{_e()})}var rn=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-6 sm:space-y-8 md:space-y-10 min-h-[calc(100vh-200px)]">

  <!-- Header -->
  <div class="text-center space-y-3 sm:space-y-4 max-w-4xl w-full">
    <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
      Choose Your Migration Method
    </h2>
    <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 leading-relaxed">
      You can either manually import your accounts into Monarch or let us automatically import your data.
    </p>
  </div>

  <!-- Summary Counts -->
  <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10 
              bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 md:p-8 
              border border-blue-100 w-full max-w-2xl shadow-sm">

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
  <div class="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl">

    <!-- Manual Import -->
    <div class="w-full lg:flex-1 group cursor-pointer" id="manualImportBtn">
      <div class="h-full p-4 sm:p-6 md:p-8 border-2 border-gray-200 rounded-xl shadow-sm 
                  hover:shadow-lg hover:border-blue-300 transition-all duration-300 
                  bg-white group-hover:bg-blue-50/30 relative overflow-hidden">
        
        <!-- Background decoration -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        
        <div class="relative z-10">
          <div class="flex items-start justify-between mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
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
            Download <span id="manualFileCount" class="font-semibold text-blue-600">0</span> CSV files and upload them directly
            into Monarch yourself. Perfect for users who prefer full control.
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
        
        <!-- Background decoration -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        
        <!-- "Recommended" badge -->
        <div class="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          Recommended
        </div>
        
        <div class="relative z-10 pt-6">
          <div class="flex items-start justify-between mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
            We'll connect to Monarch and automatically import your selected accounts on
            your behalf. Fast, secure, and hassle-free.
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

    <!-- Navigation will be added here by JavaScript -->

  </div>

</div>`;var sn=dt(mt(),1);function st(e,o){let n='"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"',r=o.map(i=>`"${i.Date}","${i.Merchant}","${i.Category}","${e}","","${i.Notes}","${i.Amount}","${i.Tags}"`);return[n,...r].join(`
`)}function Et(){if(!V.accounts||Object.keys(V.accounts).length===0){ue("/upload",!0);return}let e=document.getElementById("accountCount"),o=document.getElementById("downloadBtn"),n=document.getElementById("switchToAuto"),r=document.getElementById("backBtn");me();let i=Object.values(V.accounts).filter(s=>s.included);e.textContent=`${i.length} account${i.length!==1?"s":""}`,o.addEventListener("click",async s=>{s.preventDefault();let l=new sn.default,u=1e3;i.forEach(k=>{let y=k.name.replace(/[\\/:*?"<>|]/g,"_"),E=k.transactions,c=E.length;if(c<=u){let w=st(k.name,E);l.file(`${y}.csv`,w)}else{let w=Math.ceil(c/u);for(let d=0;d<w;d++){let g=d*u,p=g+u,x=E.slice(g,p),C=st(k.name,x);l.file(`${y}_part${d+1}.csv`,C)}}});try{let k=await l.generateAsync({type:"blob"}),y=document.createElement("a");y.href=URL.createObjectURL(k),y.download="accounts_export.zip",y.click()}catch(k){console.error("\u274C ZIP generation failed",k),alert("Failed to generate ZIP file.")}}),n.addEventListener("click",()=>{ue("/login")}),r.addEventListener("click",()=>{_e()}),document.getElementById("backToMethodBtn").addEventListener("click",()=>{_e()})}var an=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-8 sm:space-y-10 md:space-y-12 min-h-[calc(100vh-200px)]">

  <!-- Progress Header -->
  <div class="text-center space-y-3 sm:space-y-4 w-full max-w-3xl">
    <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4">
      <svg class="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">You're Ready to Import</h2>
    <p class="text-gray-600 text-sm sm:text-base md:text-lg">
      <span id="accountCount" class="font-semibold text-green-600">0 accounts</span> prepared for migration.
    </p>
  </div>

  <!-- Main Instructions Card -->
  <div class="w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 md:p-10 space-y-8 sm:space-y-10">

    <!-- Step 1: Download -->
    <div class="relative">
      <!-- Step Number -->
      <div class="flex items-center mb-4 sm:mb-6">
        <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 text-blue-600 rounded-full font-bold text-sm sm:text-base mr-3 sm:mr-4">
          1
        </div>
        <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Download Files</h3>
      </div>
      
      <div class="ml-11 sm:ml-14">
        <p class="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
          Download a ZIP file containing one CSV per account. Each CSV is formatted 
          specifically for Monarch Money import.
        </p>

        <a id="downloadBtn" 
           class="ui-button inline-flex items-center btn-responsive" 
           data-type="primary" 
           data-size="large" 
           href="#">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 4v12" />
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
        <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-100 text-green-600 rounded-full font-bold text-sm sm:text-base mr-3 sm:mr-4">
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
              <span class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                a
              </span>
              <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Go to <strong class="text-gray-900">Accounts \u2192 Add account</strong>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                b
              </span>
              <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Choose <strong class="text-gray-900">Add manual account</strong>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                c
              </span>
              <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Select your desired <strong class="text-gray-900">account type</strong>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                d
              </span>
              <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Give it a name and starting balance of <strong class="text-gray-900 bg-yellow-100 px-1 rounded">$0.00</strong>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                e
              </span>
              <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Go to <strong class="text-gray-900">Edit \u2192 Upload transactions</strong>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                f
              </span>
              <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Upload your account CSV file
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                g
              </span>
              <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong class="text-green-700">Enable</strong> 
                <em>"Adjust account's balances based on these transactions"</em>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                h
              </span>
              <div class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Click <strong class="text-gray-900">Add to account</strong>
              </div>
            </li>
            
            <li class="flex items-start gap-3">
              <span class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
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
  <div class="flex flex-col items-center text-center gap-4 sm:gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 md:p-10 border border-blue-100 w-full max-w-4xl shadow-sm">
    
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
  </div>

  <!-- Navigation will be added here by JavaScript -->

</div>
`;var ge=[];for(let e=0;e<256;++e)ge.push((e+256).toString(16).slice(1));function on(e,o=0){return(ge[e[o+0]]+ge[e[o+1]]+ge[e[o+2]]+ge[e[o+3]]+"-"+ge[e[o+4]]+ge[e[o+5]]+"-"+ge[e[o+6]]+ge[e[o+7]]+"-"+ge[e[o+8]]+ge[e[o+9]]+"-"+ge[e[o+10]]+ge[e[o+11]]+ge[e[o+12]]+ge[e[o+13]]+ge[e[o+14]]+ge[e[o+15]]).toLowerCase()}var St,Yn=new Uint8Array(16);function Bt(){if(!St){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");St=crypto.getRandomValues.bind(crypto)}return St(Yn)}var qn=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),At={randomUUID:qn};function Gn(e,o,n){if(At.randomUUID&&!o&&!e)return At.randomUUID();e=e||{};let r=e.random??e.rng?.()??Bt();if(r.length<16)throw new Error("Random bytes length must be >= 16");if(r[6]=r[6]&15|64,r[8]=r[8]&63|128,o){if(n=n||0,n<0||n+16>o.length)throw new RangeError(`UUID byte range ${n}:${n+15} is out of buffer bounds`);for(let i=0;i<16;++i)o[n+i]=r[i];return o}return on(r)}var it=Gn;var Ve=location.hostname==="localhost"?"http://localhost:3000/dev/":"/.netlify/functions/",Pe={login:Ve+"monarchLogin",fetchAccounts:Ve+"fetchMonarchAccounts",createAccounts:Ve+"createMonarchAccounts",generateStatements:Ve+"generateStatements",getUploadStatus:Ve+"getUploadStatus"};async function Ye(e,o){let n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),r=await n.json();if(!n.ok)throw new Error(r.error||r.message||"API error");return r}var Le={login:(e,o,n,r)=>Ye(Pe.login,{email:e,encryptedPassword:o,deviceUuid:n,otp:r}),fetchMonarchAccounts:e=>Ye(Pe.fetchAccounts,{token:e}),createAccounts:(e,o)=>Ye(Pe.createAccounts,{token:e,accounts:o}),generateAccounts:e=>fetch(Pe.generateStatements,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accounts:e})}),queryUploadStatus:(e,o)=>Ye(Pe.getUploadStatus,{token:e,sessionKey:o})};var we={EMAIL:"monarchEmail",ENCRYPTED_PASSWORD:"monarchPasswordBase64",TOKEN:"monarchApiToken",UUID:"monarchDeviceUuid",REMEMBER:"monarchRememberMe",TEMP_FOR_OTP:"monarchTempForOtp"};function Me(){return{email:je(we.EMAIL),encryptedPassword:je(we.ENCRYPTED_PASSWORD),token:je(we.TOKEN),uuid:je(we.UUID),remember:je(we.REMEMBER)==="true",tempForOtp:je(we.TEMP_FOR_OTP)==="true"}}function Ne({email:e,encryptedPassword:o,token:n,uuid:r,remember:i,tempForOtp:s}){e&&Ue(we.EMAIL,e),o&&Ue(we.ENCRYPTED_PASSWORD,o),n&&Ue(we.TOKEN,n),r&&Ue(we.UUID,r),typeof i=="boolean"&&Ue(we.REMEMBER,i?"true":"false"),typeof s=="boolean"&&Ue(we.TEMP_FOR_OTP,s?"true":"false")}function qe(){Object.values(we).forEach(Kn)}function je(e){return localStorage.getItem(e)}function Ue(e,o){localStorage.setItem(e,o)}function Kn(e){localStorage.removeItem(e)}var ln="monarch-app-salt";var It="AES-GCM";var cn="SHA-256";function Qn(...e){let o=e.reduce((i,s)=>i+s.length,0),n=new Uint8Array(o),r=0;for(let i of e)n.set(i,r),r+=i.length;return n}async function un(e,o){console.group("encryptPassword");try{let n=new TextEncoder,r=crypto.getRandomValues(new Uint8Array(12)),i=await crypto.subtle.importKey("raw",n.encode(e),{name:"PBKDF2"},!1,["deriveKey"]),s=await crypto.subtle.deriveKey({name:"PBKDF2",salt:n.encode(ln),iterations:1e5,hash:cn},i,{name:It,length:256},!0,["encrypt"]),l=n.encode(o),u=await crypto.subtle.encrypt({name:It,iv:r},s,l),k=new Uint8Array(u),y=k.slice(-16),E=k.slice(0,-16),c=Qn(r,E,y);return btoa(String.fromCharCode(...c))}catch(n){throw console.error("\u274C Error encrypting password:",n),console.groupEnd("encryptPassword"),new Error("Failed to encrypt password. Please try again.")}}function $e(e,o){if(!e||typeof e!="object")throw new Error("Target must be an object");Object.entries(o).forEach(([n,r])=>{e[n]=r})}function pn(e){if(!e||typeof e!="object")throw new Error("Target must be an object");Object.keys(e).forEach(o=>{let n=e[o];Array.isArray(n)?e[o]=[]:typeof n=="object"&&n!==null?e[o]={}:typeof n=="boolean"?e[o]=!1:e[o]=""})}async function Mt(){document.querySelector(".container-responsive").insertAdjacentHTML("beforeend",ze({backText:"Back"}));let o=v=>document.getElementById(v),n={emailInput:o("email"),passwordInput:o("password"),connectBtn:o("connectBtn"),backBtn:o("backBtn"),form:o("credentialsForm"),errorBox:o("errorBox"),errorContainer:o("credentialsError"),rememberCheckbox:o("rememberCredentials"),rememberMeContainer:o("rememberMe"),notYouContainer:o("notYouContainer"),rememberedEmail:o("rememberedEmail"),clearCredentialsBtn:o("clearCredentialsBtn"),toggleBtn:o("togglePassword"),eyeShow:o("eyeShow"),eyeHide:o("eyeHide"),securityNoteMsg:o("securityNote"),securityNoteIcon:o("securityNoteIcon")};me();let{credentials:r}=V,{token:i,email:s,encryptedPassword:l,uuid:u,remember:k}=Me();$e(r,{email:s,encryptedPassword:l,apiToken:r.apiToken||i,deviceUuid:r.deviceUuid||u,remember:k}),(!r.deviceUuid||r.deviceUuid==="")&&(r.deviceUuid=it(),Ne({uuid:r.deviceUuid})),s&&l?(n.emailInput.value=s,n.passwordInput.value="",n.rememberedEmail.textContent=`Signed in as ${s}`,n.rememberCheckbox.checked=r.remember,xe(n.emailInput,!0),xe(n.passwordInput,!0),ve(n.rememberMeContainer,!1),ve(n.notYouContainer,!0),ve(n.toggleBtn,!1),E("signed-in")):(ve(n.notYouContainer,!1),E());function y(){let v=n.emailInput.value.trim(),M=n.passwordInput.value.trim()||r.encryptedPassword;xe(n.connectBtn,!(v&&M)),ve(n.errorContainer,!1),me()}function E(v){let M={GREEN:"#006400",BLUE:"#1993e5",ORANGE:"#ff8c00"};switch(v){case"remembered":n.securityNoteMsg.textContent="Your credentials will be stored securely on this device.",n.securityNoteIcon.setAttribute("fill",M.ORANGE);break;case"signed-in":n.securityNoteMsg.textContent='You are signed in. To use different credentials, click "Not you?".',n.securityNoteIcon.setAttribute("fill",M.BLUE);break;default:n.securityNoteMsg.textContent="Your credentials will not be stored.",n.securityNoteIcon.setAttribute("fill",M.GREEN)}}function c(v){v.preventDefault(),n.connectBtn.click()}async function w(){let v=Me(),M=n.emailInput.value.trim()||v.email,A=n.passwordInput.value.trim(),h=r.encryptedPassword||v.encryptedPassword,f=r.deviceUuid||v.uuid;if(!h&&A)try{h=await un(M,A)}catch{S("Failed to encrypt password.");return}xe(n.connectBtn,!0),n.connectBtn.textContent="Connecting\u2026",ve(n.errorContainer,!1);try{let B=await Le.login(M,h,f);if(B?.otpRequired)return Ne({email:M,encryptedPassword:h,uuid:f,remember:r.remember,tempForOtp:!r.remember}),r.awaitingOtp=!0,ue("/otp");if(B?.token)return $e(r,{email:M,encryptedPassword:h,otp:"",remember:n.rememberCheckbox.checked,apiToken:B.token,awaitingOtp:!1}),r.remember&&Ne({email:M,encryptedPassword:h,token:B.token,remember:!0}),ue("/complete");let F=B?.detail||B?.error||"Unexpected login response.";throw new Error(F)}catch(B){S(B.message)}finally{xe(n.connectBtn,!1),n.connectBtn.textContent="Connect to Monarch"}}async function d(v){v.preventDefault(),await w()}function g(v){v.preventDefault(),qe(),pn(r),r.deviceUuid=it(),Ne({uuid:r.deviceUuid}),n.emailInput.value="",n.passwordInput.value="",n.rememberCheckbox.checked=!1,xe(n.emailInput,!1),xe(n.passwordInput,!1),xe(n.connectBtn,!0),ve(n.toggleBtn,!0),ve(n.notYouContainer,!1),ve(n.rememberMeContainer,!0),E(),me(),n.emailInput.focus()}function p(){r.remember=n.rememberCheckbox.checked,E(r.remember?"remembered":"not-remembered"),(n.emailInput.value.trim()===""?n.emailInput:n.passwordInput.value.trim()===""?n.passwordInput:n.connectBtn).focus()}function x(){let v=n.passwordInput.type==="password";n.passwordInput.type=v?"text":"password",n.toggleBtn.setAttribute("aria-label",v?"Hide password":"Show password"),ve(n.eyeShow,!v),ve(n.eyeHide,v)}function C(){_e()}function S(v){n.errorBox.textContent=v,ve(n.errorContainer,!0)}n.form.addEventListener("submit",c),n.connectBtn.addEventListener("click",d),n.clearCredentialsBtn.addEventListener("click",g),n.rememberCheckbox.addEventListener("change",p),n.toggleBtn.addEventListener("click",x),n.backBtn.addEventListener("click",C),[n.emailInput,n.passwordInput].forEach(v=>{v.addEventListener("input",y),v.addEventListener("focus",()=>v.classList.add("ring-2","ring-blue-500","outline-none")),v.addEventListener("blur",()=>v.classList.remove("ring-2","ring-blue-500","outline-none"))}),y()}var fn=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-6 sm:space-y-8 min-h-[calc(100vh-200px)]">

  <!-- Header -->
  <div class="text-center max-w-2xl w-full">
    <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
      Auto Import: Connect Your Monarch Account
    </h2>
    <p class="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
      Authorize your Monarch account so we can directly import your accounts and transactions.
    </p>
  </div>

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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input id="email" 
                 type="email" 
                 class="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base 
                        border border-gray-300 rounded-lg placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-colors duration-200" 
                 placeholder="you@email.com"
                 autocomplete="username"
                 required>
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input id="password" 
                 type="password" 
                 class="block w-full pl-9 sm:pl-10 pr-12 sm:pr-14 py-2.5 sm:py-3 text-sm sm:text-base 
                        border border-gray-300 rounded-lg placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-colors duration-200" 
                 placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" 
                 autocomplete="current-password"
                 required>

          <button type="button" 
                  id="togglePassword" 
                  aria-label="Toggle password visibility"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer 
                         text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 
                         transition-colors duration-200">
            <!-- Show Icon -->
            <svg id="eyeShow" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>

            <!-- Hide Icon -->
            <svg id="eyeHide" class="h-4 w-4 sm:h-5 sm:w-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.27-2.945-9.543-7a9.966 9.966 0 012.398-4.442M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1L17.9 17.9" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Remember Me Checkbox -->
      <div id="rememberMe" class="flex items-start gap-3">
        <div class="flex items-center h-5">
          <input id="rememberCredentials" 
                 type="checkbox" 
                 class="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer rounded border-gray-300 
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
        <button type="button" id="clearCredentialsBtn" class="ml-2 text-blue-600 cursor-pointer hover:underline">Not You?</button>
      </div>

      <!-- Error Message -->
      <div id="credentialsError" class="hidden bg-red-50 border border-red-200 rounded-lg p-3">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p id="errorBox" class="text-sm text-red-800">Error message will appear here</p>
        </div>
      </div>

      <!-- Submit Button -->
      <button id="connectBtn" 
              type="submit" 
              class="ui-button w-full btn-responsive" 
              data-type="primary" 
              data-size="large">
        <span id="loginBtnText">Connect to Monarch</span>
        <svg id="loginSpinner" class="hidden animate-spin ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </button>
    </form>

    <!-- Security Note -->
    <div class="flex items-start gap-3 mt-6 sm:mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
        <svg id="securityNoteIcon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
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

  <!-- Navigation will be added here by JavaScript -->

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

  #togglePassword, #clearCredentialsBtn {
    transition: none !important;
    box-shadow: none !important;
    transform: none !important;
  }
</style>
`;function Tt(){document.querySelector(".container-responsive").insertAdjacentHTML("beforeend",ze({backText:"Back"}));let o=g=>document.getElementById(g),n={otpInput:o("otpInput"),submitOtpBtn:o("submitOtpBtn"),otpError:o("otpError"),backBtn:o("backBtn")};me();let{credentials:r}=V,i=Me(),{email:s,encryptedPassword:l,uuid:u,remember:k,tempForOtp:y}=i;if($e(r,{email:r.email||s,encryptedPassword:r.encryptedPassword||l,deviceUuid:r.deviceUuid||u,remember:k}),!r.email||!r.encryptedPassword)return console.warn("Missing credentials for OTP flow, redirecting to login"),ue("/credentials");async function E(g){console.group("MonarchOtpView"),g.preventDefault(),ve(n.otpError,!1),r.otp=n.otpInput.value;try{let p=await Le.login(r.email,r.encryptedPassword,r.deviceUuid,r.otp);if(p?.token)return $e(r,{apiToken:p.token,awaitingOtp:!1}),r.remember?Ne({email:r.email,encryptedPassword:r.encryptedPassword,uuid:r.deviceUuid,token:p.token,remember:!0}):qe(),console.groupEnd("MonarchOtpView"),ue("/complete");throw new Error("Unknown login response.")}catch(p){ve(n.otpError,!0),n.otpError.textContent="Invalid OTP. Please try again.",console.error("\u274C OTP verification error",p),console.groupEnd("MonarchOtpView")}}function c(){let g=Me();g.tempForOtp&&!g.remember&&qe(),_e()}function w(){n.otpInput.value=n.otpInput.value.replace(/\D/g,"").slice(0,6),xe(n.submitOtpBtn,n.otpInput.value.length!==6),me()}function d(g){g.key==="Enter"&&n.otpInput.value.length===6&&n.submitOtpBtn.click()}n.otpInput.addEventListener("input",w),n.otpInput.addEventListener("keydown",d),n.submitOtpBtn.addEventListener("click",E),n.backBtn.addEventListener("click",c),xe(n.submitOtpBtn,!0)}var mn=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-8 sm:space-y-10 md:space-y-12 min-h-[calc(100vh-200px)]">

  <!-- Header -->
  <div class="text-center max-w-2xl w-full">
    <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full mb-4 sm:mb-6">
      <svg class="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
    
    <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
      Enter Your Verification Code
    </h2>
    <p class="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
      Monarch has sent a 6-digit verification code to your email address. 
      Enter it below to continue with the secure import process.
    </p>
  </div>

  <!-- OTP Input Section -->
  <div class="flex flex-col items-center space-y-6 sm:space-y-8 w-full max-w-sm mx-auto">

    <!-- OTP Input Field -->
    <div class="relative w-full">
      <input id="otpInput" 
             type="text" 
             maxlength="6" 
             pattern="[0-9]*" 
             inputmode="numeric"
             class="w-full px-4 py-4 sm:py-5 text-center text-xl sm:text-2xl md:text-3xl 
                    tracking-widest font-mono border-2 border-gray-300 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-colors duration-200 bg-gray-50 focus:bg-white"
             placeholder="\u2022 \u2022 \u2022 \u2022 \u2022 \u2022"
             autocomplete="one-time-code">
      
      <!-- Input hint -->
      <div class="absolute -bottom-6 left-0 right-0 text-center">
        <span class="text-xs sm:text-sm text-gray-500">6-digit code from your email</span>
      </div>
    </div>

    <!-- Error Message -->
    <div id="otpError" 
         class="hidden bg-red-50 border border-red-200 rounded-lg p-3 w-full">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-red-800">Invalid code. Please try again.</p>
      </div>
    </div>

    <!-- Important Warning -->
    <div class="w-full bg-amber-50 border border-amber-200 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
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
    <button id="submitOtpBtn"
            class="ui-button w-full btn-responsive" 
            data-type="primary" 
            data-size="large"
            disabled>
      <span id="submitOtpBtnText">Verify & Start Import</span>
      <svg id="submitOtpSpinner" class="hidden animate-spin ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </button>

  </div>

  <!-- Security Note -->
  <div class="w-full max-w-md mx-auto">
    <div class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
      <div>
        <p class="text-xs sm:text-sm text-blue-800 leading-relaxed">
          <strong>Security Notice:</strong> This verification step ensures your account's security. 
          The code expires in 10 minutes for your protection.
        </p>
      </div>
    </div>
  </div>

  <!-- Navigation will be added here by JavaScript -->

</div>
`;function nr(){if(console.log("MonarchComplete view initialized"),!V.accounts||Object.keys(V.accounts).length===0){ue("/upload",!0);return}let e=document.getElementById("resultsContainer"),o=document.getElementById("accountList"),n=document.getElementById("actionButtonsContainer"),r=document.getElementById("header"),i=document.getElementById("subheader"),s=document.getElementById("overallStatus"),l=document.getElementById("loadingContainer");l&&(l.style.display="none"),e&&(e.style.display="block",e.style.opacity="1"),u();function u(){console.log("Initializing processing with accounts:",V.accounts),Object.keys(V.accounts).forEach(p=>{V.accounts[p].status||(V.accounts[p].status="pending")}),c(),w(),d(),k()}async function k(){let x=V.credentials.apiToken;if(console.log("Starting batch processing. Token available:",!!x),!x){console.error("No API token available"),Object.keys(V.accounts).forEach(v=>{V.accounts[v].included&&(V.accounts[v].status="failed",V.accounts[v].errorMessage="Authentication required. Please login again.")}),c(),w(),d();return}let C=Object.entries(V.accounts).filter(([v,M])=>M.included&&M.status!=="completed").map(([v,M])=>({accountName:v,...M}));if(console.log("Total accounts to process:",C.length),C.length===0){console.log("No accounts to process"),c(),d();return}let S=[];for(let v=0;v<C.length;v+=5)S.push(C.slice(v,v+5));console.log(`Processing ${C.length} accounts in ${S.length} batches of ${5}`);for(let v=0;v<S.length;v++){let M=S[v];console.log(`Processing batch ${v+1}/${S.length} with ${M.length} accounts`),M.forEach(A=>{V.accounts[A.accountName]&&(V.accounts[A.accountName].status="processing")}),c(),w(),await y(x,M,v+1,S.length),v<S.length-1&&await new Promise(A=>setTimeout(A,1e3))}c(),w(),d()}async function y(p,x,C,S){try{console.log(`Calling API for batch ${C}/${S}...`);let v=await Le.createAccounts(p,x);if(console.log(`Batch ${C} create accounts response:`,v),v.success||v.failed)v.failed&&v.failed.length>0&&v.failed.forEach(M=>{let A=x.find(h=>h.name===M.name||h.modifiedName===M.name);A&&V.accounts[A.accountName]&&(console.log(`Batch ${C}: Marking account as failed: ${A.accountName}, error: ${M.error}`),V.accounts[A.accountName].status="failed",V.accounts[A.accountName].errorMessage=M.error||"Account creation failed")}),v.success&&v.success.length>0&&(console.log(`Batch ${C}: Monitoring upload status for ${v.success.length} accounts...`),v.success.forEach(M=>{let A=x.find(h=>h.name===M.name||h.modifiedName===M.name);A&&V.accounts[A.accountName]&&(V.accounts[A.accountName].status="uploading",V.accounts[A.accountName].sessionKeys=M.sessionKeys||[])}),c(),w(),await Promise.all(v.success.map(async M=>{let A=x.find(h=>h.name===M.name||h.modifiedName===M.name);if(A&&V.accounts[A.accountName]&&M.sessionKeys)try{await E(p,A.accountName,M.sessionKeys),console.log(`Batch ${C}: Upload completed for account: ${A.accountName}`),V.accounts[A.accountName].status="completed"}catch(h){console.error(`Batch ${C}: Upload failed for account: ${A.accountName}`,h),V.accounts[A.accountName].status="failed",V.accounts[A.accountName].errorMessage=h.message||"Transaction upload failed"}}))),x.forEach(M=>{V.accounts[M.accountName]&&V.accounts[M.accountName].status==="processing"&&(console.log(`Batch ${C}: Account not found in API response, marking as failed: ${M.accountName}`),V.accounts[M.accountName].status="failed",V.accounts[M.accountName].errorMessage="Account not processed by server")});else{let M=v.error||"Failed to create accounts in Monarch Money";console.log(`Batch ${C} failed, marking all as failed:`,M),x.forEach(A=>{V.accounts[A.accountName]&&(V.accounts[A.accountName].status="failed",V.accounts[A.accountName].errorMessage=M)})}}catch(v){console.error(`Batch ${C} error:`,v),x.forEach(M=>{V.accounts[M.accountName]&&(V.accounts[M.accountName].status="failed",V.accounts[M.accountName].errorMessage="Network error. Please check your connection and try again.")})}}async function E(p,x,C){console.log(`Monitoring upload status for account: ${x}, sessions: ${C.length}`),await Promise.all(C.map(async S=>{let v=0,M=60;for(;v<M;)try{let A=await Le.queryUploadStatus(p,S);if(console.log(`Upload status for ${x} session ${S}:`,A),A.data?.uploadStatementSession){let h=A.data.uploadStatementSession,f=h.status;if(f==="completed"){console.log(`Upload completed for ${x} session ${S}`);return}else if(f==="failed"||f==="error"){let B=h.errorMessage||"Transaction upload failed";throw console.error(`Upload failed for ${x} session ${S}:`,B),new Error(B)}}await new Promise(h=>setTimeout(h,5e3)),v++}catch(A){if(console.error(`Error checking upload status for ${x}:`,A),v++,v>=M)throw A;await new Promise(h=>setTimeout(h,5e3))}throw new Error(`Upload status check timed out for account ${x}`)}))}function c(){let p=V.accounts||{},x=Object.values(p).filter(b=>b.included),C=x.length,S=x.filter(b=>b.status==="completed").length,v=x.filter(b=>b.status==="failed").length,M=x.filter(b=>b.status==="processing").length,A=x.filter(b=>b.status==="uploading").length,h=C-S-v-M-A,f="Processing...",B="Please wait while we process your accounts.",F="\u23F3";M>0?(f="Creating accounts...",B=`Creating ${M} account${M!==1?"s":""}. Please wait.`,F="\u23F3"):A>0?(f="Uploading transactions...",B=`Uploading transactions for ${A} account${A!==1?"s":""}. Please wait.`,F="\u{1F4E4}"):h===0&&(v===0?(f="All accounts migrated successfully!",B=`Successfully created ${S} account${S!==1?"s":""} in Monarch Money.`,F="\u2705"):S===0?(f="Migration failed for all accounts",B="None of your accounts could be migrated. Please try again.",F="\u274C"):(f="Migration completed with some failures",B=`${S} successful, ${v} failed. You can retry the failed accounts.`,F="\u26A0\uFE0F")),r&&(r.textContent=f),i&&(i.textContent=B),s&&(s.innerHTML=`<div class="text-6xl">${F}</div>`)}function w(){if(!o)return;let p=V.accounts||{};o.innerHTML="",Object.entries(p).forEach(([x,C])=>{if(!C.included)return;let S=document.createElement("div");S.className="bg-white border border-gray-200 rounded-lg p-4";let v="",M="",A="";switch(C.status){case"completed":v="\u2705",M="text-green-600",A="Successfully migrated";break;case"failed":v="\u274C",M="text-red-600",A=C.errorMessage||"Migration failed";break;case"processing":v="\u23F3",M="text-blue-600",A="Creating account...";break;case"uploading":v="\u{1F4E4}",M="text-purple-600",A="Uploading transactions...";break;default:v="\u23F3",M="text-gray-600",A="Pending"}let h="Unknown Type";if(console.log(`Account ${x} type data:`,{type:C.type,subtype:C.subtype,accountObject:C}),C.type){let f=ke(C.type);if(console.log(`Type info for '${C.type}':`,f),f&&(h=f.typeDisplay||f.displayName||f.display,C.subtype)){let B=Oe(C.type,C.subtype);console.log(`Subtype info for '${C.type}' -> '${C.subtype}':`,B),B&&(h=B.display||B.displayName)}}else console.log(`Account ${x} has no type property`);S.innerHTML=`
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0 pr-4">
            <div class="font-medium text-gray-900 mb-1">${C.modifiedName||C.account_name||C.name||"Unknown Account"}</div>
            <div class="text-sm text-gray-500">${h}</div>
            ${C.monarchAccountId?`<div class="text-xs text-gray-400 mt-1">Monarch ID: ${C.monarchAccountId}</div>`:""}
          </div>
          <div class="flex-shrink-0">
            <span class="text-2xl">${v}</span>
          </div>
        </div>
        <div class="pt-2 border-t border-gray-100">
          <div class="${M} text-sm font-medium leading-relaxed">${A}</div>
        </div>
      `,o.appendChild(S)})}function d(){if(!n)return;let p=V.accounts||{},x=Object.values(p).filter(v=>v.included&&v.status==="failed"),C=Object.values(p).filter(v=>v.included&&v.status==="completed");if(n.innerHTML="",x.length>0){let v=document.createElement("button");v.className="ui-button",v.dataset.type="primary",v.dataset.size="medium",v.textContent="Retry Failed Accounts",v.addEventListener("click",()=>g()),n.appendChild(v)}if(C.length>0){let v=document.createElement("button");v.className="ui-button",v.dataset.type="secondary",v.dataset.size="medium",v.textContent="View in Monarch Money",v.addEventListener("click",()=>window.open("https://app.monarchmoney.com","_blank")),n.appendChild(v)}let S=document.createElement("button");S.className="ui-button",S.dataset.type="secondary",S.dataset.size="medium",S.textContent="Start Over",S.addEventListener("click",()=>ue("/upload",!0)),n.appendChild(S),me()}function g(){let p=Object.entries(V.accounts).filter(([x,C])=>C.included&&C.status==="failed");p.length!==0&&(p.forEach(([x,C])=>{V.accounts[x].status="pending",delete V.accounts[x].errorMessage}),c(),w(),d(),k())}}var hn=nr;var gn=`<div class="container-responsive flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-24 space-y-8 sm:space-y-10 md:space-y-12 min-h-[calc(100vh-200px)]">

  <!-- Results Container -->
  <div id="resultsContainer" 
       class="text-center transition-opacity duration-500 ease-in-out w-full max-w-5xl opacity-0">
    
    <!-- Status Icon -->
    <div id="overallStatus" 
         class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-6 sm:mb-8 
                transition-all duration-500 ease-in-out">
      <!-- Updated dynamically -->
    </div>

    <!-- Header -->
    <div class="mb-6 sm:mb-8 md:mb-10">
      <h2 id="header" 
          class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
        <!-- Updated dynamically -->
      </h2>
      <p id="subheader" 
         class="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
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
  <div id="loadingContainer" 
       class="text-center w-full max-w-md">
    
    <div class="mb-6 sm:mb-8">
      <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
        <svg class="animate-spin w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
        <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
          <div class="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
        </div>
        <span class="text-sm sm:text-base text-gray-600">Creating accounts</span>
      </div>
      
      <div id="step3" class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
        <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
          <div class="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
        </div>
        <span class="text-sm sm:text-base text-gray-600">Importing transactions</span>
      </div>
      
      <div id="step4" class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
        <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
          <div class="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300"></div>
        </div>
        <span class="text-sm sm:text-base text-gray-600">Finalizing import</span>
      </div>
    </div>

    <!-- Security Note -->
    <div class="mt-6 sm:mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <p class="text-xs sm:text-sm text-green-800 leading-relaxed">
          <strong>Secure Process:</strong> Your data is encrypted during transfer and we never store your Monarch credentials.
        </p>
      </div>
    </div>

  </div>

  <!-- Navigation will be added here by JavaScript -->

</div>`;var ot={"/":{template:gt,init:Ke,scroll:!1,title:"Upload - YNAB to Monarch",requiresAuth:!1},"/upload":{template:gt,init:Ke,scroll:!1,title:"Upload - YNAB to Monarch",requiresAuth:!1},"/review":{template:nn,init:vt,scroll:!0,title:"Review Accounts - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/method":{template:rn,init:Ct,scroll:!1,title:"Select Method - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/manual":{template:an,init:Et,scroll:!0,title:"Manual Import - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/login":{template:fn,init:Mt,scroll:!1,title:"Login to Monarch - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/otp":{template:mn,init:Tt,scroll:!1,title:"Enter OTP - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/complete":{template:gn,init:hn,scroll:!1,title:"Migration Complete - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0}},at=!1,lt=!1;async function ue(e,o=!1,n=!1){if(!at){at=!0;try{e.startsWith("/")||(e="/"+e);let r=ot[e];if(!r)return console.error(`Route not found: ${e}`),e="/upload",ue(e,o);if(lt||(await yn(),lt=!0),!n&&r.requiresAccounts&&!(V.accounts&&Object.keys(V.accounts).length>0))return console.warn(`Route ${e} requires accounts but none found. Redirecting to upload.`),ue("/upload",!0);o?history.replaceState({path:e},"",e):history.pushState({path:e},"",e),await Lt(e)}catch(r){if(console.error("Navigation error:",r),e!=="/upload")return ue("/upload",!0)}finally{at=!1}}}async function Lt(e){let o=document.getElementById("app"),n=ot[e]||ot["/upload"];document.title=n.title,lt||(await yn(),lt=!0),n.scroll?document.body.classList.add("always-scroll"):document.body.classList.remove("always-scroll"),o.innerHTML="",o.innerHTML=n.template;try{await n.init()}catch(r){console.error(`Error initializing route ${e}:`,r),e!=="/upload"&&ue("/upload",!0)}}function Ce(){try{Object.keys(V.accounts).length>0&&sessionStorage.setItem("ynab_accounts",JSON.stringify(V.accounts)),V.monarchAccounts&&sessionStorage.setItem("monarch_accounts",JSON.stringify(V.monarchAccounts));let e={lastPath:Qe(),timestamp:Date.now()};localStorage.setItem("app_state",JSON.stringify(e))}catch(e){console.error("Error persisting state:",e)}}async function yn(){try{V.accounts||(V.accounts={});let e=Me();(e.email||e.token)&&(V.credentials.email=e.email||V.credentials.email,V.credentials.encryptedPassword=e.encryptedPassword||V.credentials.encryptedPassword,V.credentials.apiToken=e.token||V.credentials.apiToken,V.credentials.deviceUuid=e.uuid||V.credentials.deviceUuid,V.credentials.remember=e.remember||V.credentials.remember);let o=sessionStorage.getItem("ynab_accounts");if(o)try{let i=JSON.parse(o);i&&typeof i=="object"&&(V.accounts=i)}catch(i){console.warn("Failed to parse accounts from sessionStorage:",i),sessionStorage.removeItem("ynab_accounts"),V.accounts={}}let n=sessionStorage.getItem("monarch_accounts");if(n)try{let i=JSON.parse(n);i&&typeof i=="object"&&(V.monarchAccounts=i)}catch(i){console.warn("Failed to parse monarch accounts from sessionStorage:",i),sessionStorage.removeItem("monarch_accounts"),V.monarchAccounts=null}let r=localStorage.getItem("app_state");if(r)try{let i=JSON.parse(r);i.timestamp&&Date.now()-i.timestamp<24*60*60*1e3?console.log("Loaded recent app state from localStorage"):localStorage.removeItem("app_state")}catch(i){console.warn("Failed to parse app state from localStorage:",i),localStorage.removeItem("app_state")}}catch(e){console.error("Error loading persisted state:",e),V.accounts={},V.monarchAccounts=null}}function Qe(){return window.location.pathname}function _e(){let e=Qe(),n={"/review":"/upload","/method":"/review","/manual":"/method","/login":"/method","/otp":"/login","/complete":"/review"}[e]||"/upload";ue(n)}window.addEventListener("popstate",async e=>{if(!at){let o=e.state?.path||window.location.pathname;try{await Lt(o)}catch(n){console.error("Error handling popstate:",n),ue("/upload",!0)}}});window.addEventListener("DOMContentLoaded",async()=>{let e=window.location.pathname,o=ot[e];try{o?await Lt(e):ue("/upload",!0)}catch(n){console.error("Error on initial load:",n),ue("/upload",!0)}});})();
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
