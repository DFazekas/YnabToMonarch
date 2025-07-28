(()=>{var tr=Object.create;var wt=Object.defineProperty;var rr=Object.getOwnPropertyDescriptor;var nr=Object.getOwnPropertyNames;var sr=Object.getPrototypeOf,ir=Object.prototype.hasOwnProperty;var Oe=(e=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(e,{get:(n,i)=>(typeof require!="undefined"?require:n)[i]}):e)(function(e){if(typeof require!="undefined")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var _t=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports);var ar=(e,n,i,a)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of nr(n))!ir.call(e,o)&&o!==i&&wt(e,o,{get:()=>n[o],enumerable:!(a=rr(n,o))||a.enumerable});return e};var $e=(e,n,i)=>(i=e!=null?tr(sr(e)):{},ar(n||!e||!e.__esModule?wt(i,"default",{value:e,enumerable:!0}):i,e));var kt=_t((qe,Ke)=>{((e,n)=>{typeof define=="function"&&define.amd?define([],n):typeof Ke=="object"&&typeof qe<"u"?Ke.exports=n():e.Papa=n()})(qe,function e(){var n=typeof self<"u"?self:typeof window<"u"?window:n!==void 0?n:{},i,a=!n.document&&!!n.postMessage,o=n.IS_PAPA_WORKER||!1,s={},c=0,h={};function w(g){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(u){var E=I(u);E.chunkSize=parseInt(E.chunkSize),u.step||u.chunk||(E.chunkSize=null),this._handle=new d(E),(this._handle.streamer=this)._config=E}.call(this,g),this.parseChunk=function(u,E){var M=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<M){let O=this._config.newline;O||(m=this._config.quoteChar||'"',O=this._handle.guessLineEndings(u,m)),u=[...u.split(O).slice(M)].join(O)}this.isFirstChunk&&B(this._config.beforeFirstChunk)&&(m=this._config.beforeFirstChunk(u))!==void 0&&(u=m),this.isFirstChunk=!1,this._halted=!1;var M=this._partialLine+u,m=(this._partialLine="",this._handle.parse(M,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(u=m.meta.cursor,M=(this._finished||(this._partialLine=M.substring(u-this._baseIndex),this._baseIndex=u),m&&m.data&&(this._rowCount+=m.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),o)n.postMessage({results:m,workerId:h.WORKER_ID,finished:M});else if(B(this._config.chunk)&&!E){if(this._config.chunk(m,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=m=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(m.data),this._completeResults.errors=this._completeResults.errors.concat(m.errors),this._completeResults.meta=m.meta),this._completed||!M||!B(this._config.complete)||m&&m.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),M||m&&m.meta.paused||this._nextChunk(),m}this._halted=!0},this._sendError=function(u){B(this._config.error)?this._config.error(u):o&&this._config.error&&n.postMessage({workerId:h.WORKER_ID,error:u,finished:!1})}}function x(g){var u;(g=g||{}).chunkSize||(g.chunkSize=h.RemoteChunkSize),w.call(this,g),this._nextChunk=a?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(E){this._input=E,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(u=new XMLHttpRequest,this._config.withCredentials&&(u.withCredentials=this._config.withCredentials),a||(u.onload=P(this._chunkLoaded,this),u.onerror=P(this._chunkError,this)),u.open(this._config.downloadRequestBody?"POST":"GET",this._input,!a),this._config.downloadRequestHeaders){var E,M=this._config.downloadRequestHeaders;for(E in M)u.setRequestHeader(E,M[E])}var m;this._config.chunkSize&&(m=this._start+this._config.chunkSize-1,u.setRequestHeader("Range","bytes="+this._start+"-"+m));try{u.send(this._config.downloadRequestBody)}catch(O){this._chunkError(O.message)}a&&u.status===0&&this._chunkError()}},this._chunkLoaded=function(){u.readyState===4&&(u.status<200||400<=u.status?this._chunkError():(this._start+=this._config.chunkSize||u.responseText.length,this._finished=!this._config.chunkSize||this._start>=(E=>(E=E.getResponseHeader("Content-Range"))!==null?parseInt(E.substring(E.lastIndexOf("/")+1)):-1)(u),this.parseChunk(u.responseText)))},this._chunkError=function(E){E=u.statusText||E,this._sendError(new Error(E))}}function k(g){(g=g||{}).chunkSize||(g.chunkSize=h.LocalChunkSize),w.call(this,g);var u,E,M=typeof FileReader<"u";this.stream=function(m){this._input=m,E=m.slice||m.webkitSlice||m.mozSlice,M?((u=new FileReader).onload=P(this._chunkLoaded,this),u.onerror=P(this._chunkError,this)):u=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var m=this._input,O=(this._config.chunkSize&&(O=Math.min(this._start+this._config.chunkSize,this._input.size),m=E.call(m,this._start,O)),u.readAsText(m,this._config.encoding));M||this._chunkLoaded({target:{result:O}})},this._chunkLoaded=function(m){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(m.target.result)},this._chunkError=function(){this._sendError(u.error)}}function l(g){var u;w.call(this,g=g||{}),this.stream=function(E){return u=E,this._nextChunk()},this._nextChunk=function(){var E,M;if(!this._finished)return E=this._config.chunkSize,u=E?(M=u.substring(0,E),u.substring(E)):(M=u,""),this._finished=!u,this.parseChunk(M)}}function y(g){w.call(this,g=g||{});var u=[],E=!0,M=!1;this.pause=function(){w.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){w.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(m){this._input=m,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){M&&u.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),u.length?this.parseChunk(u.shift()):E=!0},this._streamData=P(function(m){try{u.push(typeof m=="string"?m:m.toString(this._config.encoding)),E&&(E=!1,this._checkIsFinished(),this.parseChunk(u.shift()))}catch(O){this._streamError(O)}},this),this._streamError=P(function(m){this._streamCleanUp(),this._sendError(m)},this),this._streamEnd=P(function(){this._streamCleanUp(),M=!0,this._streamData("")},this),this._streamCleanUp=P(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function d(g){var u,E,M,m,O=Math.pow(2,53),r=-O,U=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,te=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,j=this,Q=0,D=0,J=!1,z=!1,L=[],W={data:[],errors:[],meta:{}};function G(K){return g.skipEmptyLines==="greedy"?K.join("").trim()==="":K.length===1&&K[0].length===0}function V(){if(W&&M&&(le("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+h.DefaultDelimiter+"'"),M=!1),g.skipEmptyLines&&(W.data=W.data.filter(function(ae){return!G(ae)})),ie()){let ae=function(oe,t){B(g.transformHeader)&&(oe=g.transformHeader(oe,t)),L.push(oe)};var ee=ae;if(W)if(Array.isArray(W.data[0])){for(var K=0;ie()&&K<W.data.length;K++)W.data[K].forEach(ae);W.data.splice(0,1)}else W.data.forEach(ae)}function X(ae,oe){for(var t=g.header?{}:[],N=0;N<ae.length;N++){var T=N,v=ae[N],v=((p,A)=>(F=>(g.dynamicTypingFunction&&g.dynamicTyping[F]===void 0&&(g.dynamicTyping[F]=g.dynamicTypingFunction(F)),(g.dynamicTyping[F]||g.dynamicTyping)===!0))(p)?A==="true"||A==="TRUE"||A!=="false"&&A!=="FALSE"&&((F=>{if(U.test(F)&&(F=parseFloat(F),r<F&&F<O))return 1})(A)?parseFloat(A):te.test(A)?new Date(A):A===""?null:A):A)(T=g.header?N>=L.length?"__parsed_extra":L[N]:T,v=g.transform?g.transform(v,T):v);T==="__parsed_extra"?(t[T]=t[T]||[],t[T].push(v)):t[T]=v}return g.header&&(N>L.length?le("FieldMismatch","TooManyFields","Too many fields: expected "+L.length+" fields but parsed "+N,D+oe):N<L.length&&le("FieldMismatch","TooFewFields","Too few fields: expected "+L.length+" fields but parsed "+N,D+oe)),t}var ne;W&&(g.header||g.dynamicTyping||g.transform)&&(ne=1,!W.data.length||Array.isArray(W.data[0])?(W.data=W.data.map(X),ne=W.data.length):W.data=X(W.data,0),g.header&&W.meta&&(W.meta.fields=L),D+=ne)}function ie(){return g.header&&L.length===0}function le(K,X,ne,ee){K={type:K,code:X,message:ne},ee!==void 0&&(K.row=ee),W.errors.push(K)}B(g.step)&&(m=g.step,g.step=function(K){W=K,ie()?V():(V(),W.data.length!==0&&(Q+=K.data.length,g.preview&&Q>g.preview?E.abort():(W.data=W.data[0],m(W,j))))}),this.parse=function(K,X,ne){var ee=g.quoteChar||'"',ee=(g.newline||(g.newline=this.guessLineEndings(K,ee)),M=!1,g.delimiter?B(g.delimiter)&&(g.delimiter=g.delimiter(K),W.meta.delimiter=g.delimiter):((ee=((ae,oe,t,N,T)=>{var v,p,A,F;T=T||[",","	","|",";",h.RECORD_SEP,h.UNIT_SEP];for(var H=0;H<T.length;H++){for(var R,Y=T[H],$=0,Z=0,q=0,se=(A=void 0,new f({comments:N,delimiter:Y,newline:oe,preview:10}).parse(ae)),re=0;re<se.data.length;re++)t&&G(se.data[re])?q++:(R=se.data[re].length,Z+=R,A===void 0?A=R:0<R&&($+=Math.abs(R-A),A=R));0<se.data.length&&(Z/=se.data.length-q),(p===void 0||$<=p)&&(F===void 0||F<Z)&&1.99<Z&&(p=$,v=Y,F=Z)}return{successful:!!(g.delimiter=v),bestDelimiter:v}})(K,g.newline,g.skipEmptyLines,g.comments,g.delimitersToGuess)).successful?g.delimiter=ee.bestDelimiter:(M=!0,g.delimiter=h.DefaultDelimiter),W.meta.delimiter=g.delimiter),I(g));return g.preview&&g.header&&ee.preview++,u=K,E=new f(ee),W=E.parse(u,X,ne),V(),J?{meta:{paused:!0}}:W||{meta:{paused:!1}}},this.paused=function(){return J},this.pause=function(){J=!0,E.abort(),u=B(g.chunk)?"":u.substring(E.getCharIndex())},this.resume=function(){j.streamer._halted?(J=!1,j.streamer.parseChunk(u,!0)):setTimeout(j.resume,3)},this.aborted=function(){return z},this.abort=function(){z=!0,E.abort(),W.meta.aborted=!0,B(g.complete)&&g.complete(W),u=""},this.guessLineEndings=function(ae,ee){ae=ae.substring(0,1048576);var ee=new RegExp(b(ee)+"([^]*?)"+b(ee),"gm"),ne=(ae=ae.replace(ee,"")).split("\r"),ee=ae.split(`
`),ae=1<ee.length&&ee[0].length<ne[0].length;if(ne.length===1||ae)return`
`;for(var oe=0,t=0;t<ne.length;t++)ne[t][0]===`
`&&oe++;return oe>=ne.length/2?`\r
`:"\r"}}function b(g){return g.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function f(g){var u=(g=g||{}).delimiter,E=g.newline,M=g.comments,m=g.step,O=g.preview,r=g.fastMode,U=null,te=!1,j=g.quoteChar==null?'"':g.quoteChar,Q=j;if(g.escapeChar!==void 0&&(Q=g.escapeChar),(typeof u!="string"||-1<h.BAD_DELIMITERS.indexOf(u))&&(u=","),M===u)throw new Error("Comment character same as delimiter");M===!0?M="#":(typeof M!="string"||-1<h.BAD_DELIMITERS.indexOf(M))&&(M=!1),E!==`
`&&E!=="\r"&&E!==`\r
`&&(E=`
`);var D=0,J=!1;this.parse=function(z,L,W){if(typeof z!="string")throw new Error("Input must be a string");var G=z.length,V=u.length,ie=E.length,le=M.length,K=B(m),X=[],ne=[],ee=[],ae=D=0;if(!z)return $();if(r||r!==!1&&z.indexOf(j)===-1){for(var oe=z.split(E),t=0;t<oe.length;t++){if(ee=oe[t],D+=ee.length,t!==oe.length-1)D+=E.length;else if(W)return $();if(!M||ee.substring(0,le)!==M){if(K){if(X=[],F(ee.split(u)),Z(),J)return $()}else F(ee.split(u));if(O&&O<=t)return X=X.slice(0,O),$(!0)}}return $()}for(var N=z.indexOf(u,D),T=z.indexOf(E,D),v=new RegExp(b(Q)+b(j),"g"),p=z.indexOf(j,D);;)if(z[D]===j)for(p=D,D++;;){if((p=z.indexOf(j,p+1))===-1)return W||ne.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:X.length,index:D}),R();if(p===G-1)return R(z.substring(D,p).replace(v,j));if(j===Q&&z[p+1]===Q)p++;else if(j===Q||p===0||z[p-1]!==Q){N!==-1&&N<p+1&&(N=z.indexOf(u,p+1));var A=H((T=T!==-1&&T<p+1?z.indexOf(E,p+1):T)===-1?N:Math.min(N,T));if(z.substr(p+1+A,V)===u){ee.push(z.substring(D,p).replace(v,j)),z[D=p+1+A+V]!==j&&(p=z.indexOf(j,D)),N=z.indexOf(u,D),T=z.indexOf(E,D);break}if(A=H(T),z.substring(p+1+A,p+1+A+ie)===E){if(ee.push(z.substring(D,p).replace(v,j)),Y(p+1+A+ie),N=z.indexOf(u,D),p=z.indexOf(j,D),K&&(Z(),J))return $();if(O&&X.length>=O)return $(!0);break}ne.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:X.length,index:D}),p++}}else if(M&&ee.length===0&&z.substring(D,D+le)===M){if(T===-1)return $();D=T+ie,T=z.indexOf(E,D),N=z.indexOf(u,D)}else if(N!==-1&&(N<T||T===-1))ee.push(z.substring(D,N)),D=N+V,N=z.indexOf(u,D);else{if(T===-1)break;if(ee.push(z.substring(D,T)),Y(T+ie),K&&(Z(),J))return $();if(O&&X.length>=O)return $(!0)}return R();function F(q){X.push(q),ae=D}function H(q){var se=0;return se=q!==-1&&(q=z.substring(p+1,q))&&q.trim()===""?q.length:se}function R(q){return W||(q===void 0&&(q=z.substring(D)),ee.push(q),D=G,F(ee),K&&Z()),$()}function Y(q){D=q,F(ee),ee=[],T=z.indexOf(E,D)}function $(q){if(g.header&&!L&&X.length&&!te){var se=X[0],re={},me=new Set(se);let ke=!1;for(let pe=0;pe<se.length;pe++){let ge=se[pe];if(re[ge=B(g.transformHeader)?g.transformHeader(ge,pe):ge]){let de,Ce=re[ge];for(;de=ge+"_"+Ce,Ce++,me.has(de););me.add(de),se[pe]=de,re[ge]++,ke=!0,(U=U===null?{}:U)[de]=ge}else re[ge]=1,se[pe]=ge;me.add(ge)}ke&&console.warn("Duplicate headers found and renamed."),te=!0}return{data:X,errors:ne,meta:{delimiter:u,linebreak:E,aborted:J,truncated:!!q,cursor:ae+(L||0),renamedHeaders:U}}}function Z(){m($()),X=[],ne=[]}},this.abort=function(){J=!0},this.getCharIndex=function(){return D}}function _(g){var u=g.data,E=s[u.workerId],M=!1;if(u.error)E.userError(u.error,u.file);else if(u.results&&u.results.data){var m={abort:function(){M=!0,S(u.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:C,resume:C};if(B(E.userStep)){for(var O=0;O<u.results.data.length&&(E.userStep({data:u.results.data[O],errors:u.results.errors,meta:u.results.meta},m),!M);O++);delete u.results}else B(E.userChunk)&&(E.userChunk(u.results,m,u.file),delete u.results)}u.finished&&!M&&S(u.workerId,u.results)}function S(g,u){var E=s[g];B(E.userComplete)&&E.userComplete(u),E.terminate(),delete s[g]}function C(){throw new Error("Not implemented.")}function I(g){if(typeof g!="object"||g===null)return g;var u,E=Array.isArray(g)?[]:{};for(u in g)E[u]=I(g[u]);return E}function P(g,u){return function(){g.apply(u,arguments)}}function B(g){return typeof g=="function"}return h.parse=function(g,u){var E=(u=u||{}).dynamicTyping||!1;if(B(E)&&(u.dynamicTypingFunction=E,E={}),u.dynamicTyping=E,u.transform=!!B(u.transform)&&u.transform,!u.worker||!h.WORKERS_SUPPORTED)return E=null,h.NODE_STREAM_INPUT,typeof g=="string"?(g=(M=>M.charCodeAt(0)!==65279?M:M.slice(1))(g),E=new(u.download?x:l)(u)):g.readable===!0&&B(g.read)&&B(g.on)?E=new y(u):(n.File&&g instanceof File||g instanceof Object)&&(E=new k(u)),E.stream(g);(E=(()=>{var M;return!!h.WORKERS_SUPPORTED&&(M=(()=>{var m=n.URL||n.webkitURL||null,O=e.toString();return h.BLOB_URL||(h.BLOB_URL=m.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",O,")();"],{type:"text/javascript"})))})(),(M=new n.Worker(M)).onmessage=_,M.id=c++,s[M.id]=M)})()).userStep=u.step,E.userChunk=u.chunk,E.userComplete=u.complete,E.userError=u.error,u.step=B(u.step),u.chunk=B(u.chunk),u.complete=B(u.complete),u.error=B(u.error),delete u.worker,E.postMessage({input:g,config:u,workerId:E.id})},h.unparse=function(g,u){var E=!1,M=!0,m=",",O=`\r
`,r='"',U=r+r,te=!1,j=null,Q=!1,D=((()=>{if(typeof u=="object"){if(typeof u.delimiter!="string"||h.BAD_DELIMITERS.filter(function(L){return u.delimiter.indexOf(L)!==-1}).length||(m=u.delimiter),typeof u.quotes!="boolean"&&typeof u.quotes!="function"&&!Array.isArray(u.quotes)||(E=u.quotes),typeof u.skipEmptyLines!="boolean"&&typeof u.skipEmptyLines!="string"||(te=u.skipEmptyLines),typeof u.newline=="string"&&(O=u.newline),typeof u.quoteChar=="string"&&(r=u.quoteChar),typeof u.header=="boolean"&&(M=u.header),Array.isArray(u.columns)){if(u.columns.length===0)throw new Error("Option columns is empty");j=u.columns}u.escapeChar!==void 0&&(U=u.escapeChar+r),u.escapeFormulae instanceof RegExp?Q=u.escapeFormulae:typeof u.escapeFormulae=="boolean"&&u.escapeFormulae&&(Q=/^[=+\-@\t\r].*$/)}})(),new RegExp(b(r),"g"));if(typeof g=="string"&&(g=JSON.parse(g)),Array.isArray(g)){if(!g.length||Array.isArray(g[0]))return J(null,g,te);if(typeof g[0]=="object")return J(j||Object.keys(g[0]),g,te)}else if(typeof g=="object")return typeof g.data=="string"&&(g.data=JSON.parse(g.data)),Array.isArray(g.data)&&(g.fields||(g.fields=g.meta&&g.meta.fields||j),g.fields||(g.fields=Array.isArray(g.data[0])?g.fields:typeof g.data[0]=="object"?Object.keys(g.data[0]):[]),Array.isArray(g.data[0])||typeof g.data[0]=="object"||(g.data=[g.data])),J(g.fields||[],g.data||[],te);throw new Error("Unable to serialize unrecognized input");function J(L,W,G){var V="",ie=(typeof L=="string"&&(L=JSON.parse(L)),typeof W=="string"&&(W=JSON.parse(W)),Array.isArray(L)&&0<L.length),le=!Array.isArray(W[0]);if(ie&&M){for(var K=0;K<L.length;K++)0<K&&(V+=m),V+=z(L[K],K);0<W.length&&(V+=O)}for(var X=0;X<W.length;X++){var ne=(ie?L:W[X]).length,ee=!1,ae=ie?Object.keys(W[X]).length===0:W[X].length===0;if(G&&!ie&&(ee=G==="greedy"?W[X].join("").trim()==="":W[X].length===1&&W[X][0].length===0),G==="greedy"&&ie){for(var oe=[],t=0;t<ne;t++){var N=le?L[t]:t;oe.push(W[X][N])}ee=oe.join("").trim()===""}if(!ee){for(var T=0;T<ne;T++){0<T&&!ae&&(V+=m);var v=ie&&le?L[T]:T;V+=z(W[X][v],T)}X<W.length-1&&(!G||0<ne&&!ae)&&(V+=O)}}return V}function z(L,W){var G,V;return L==null?"":L.constructor===Date?JSON.stringify(L).slice(1,25):(V=!1,Q&&typeof L=="string"&&Q.test(L)&&(L="'"+L,V=!0),G=L.toString().replace(D,U),(V=V||E===!0||typeof E=="function"&&E(L,W)||Array.isArray(E)&&E[W]||((ie,le)=>{for(var K=0;K<le.length;K++)if(-1<ie.indexOf(le[K]))return!0;return!1})(G,h.BAD_DELIMITERS)||-1<G.indexOf(m)||G.charAt(0)===" "||G.charAt(G.length-1)===" ")?r+G+r:G)}},h.RECORD_SEP=String.fromCharCode(30),h.UNIT_SEP=String.fromCharCode(31),h.BYTE_ORDER_MARK="\uFEFF",h.BAD_DELIMITERS=["\r",`
`,'"',h.BYTE_ORDER_MARK],h.WORKERS_SUPPORTED=!a&&!!n.Worker,h.NODE_STREAM_INPUT=1,h.LocalChunkSize=10485760,h.RemoteChunkSize=5242880,h.DefaultDelimiter=",",h.Parser=f,h.ParserHandle=d,h.NetworkStreamer=x,h.FileStreamer=k,h.StringStreamer=l,h.ReadableStreamStreamer=y,n.jQuery&&((i=n.jQuery).fn.parse=function(g){var u=g.config||{},E=[];return this.each(function(O){if(!(i(this).prop("tagName").toUpperCase()==="INPUT"&&i(this).attr("type").toLowerCase()==="file"&&n.FileReader)||!this.files||this.files.length===0)return!0;for(var r=0;r<this.files.length;r++)E.push({file:this.files[r],inputElem:this,instanceConfig:i.extend({},u)})}),M(),this;function M(){if(E.length===0)B(g.complete)&&g.complete();else{var O,r,U,te,j=E[0];if(B(g.before)){var Q=g.before(j.file,j.inputElem);if(typeof Q=="object"){if(Q.action==="abort")return O="AbortError",r=j.file,U=j.inputElem,te=Q.reason,void(B(g.error)&&g.error({name:O},r,U,te));if(Q.action==="skip")return void m();typeof Q.config=="object"&&(j.instanceConfig=i.extend(j.instanceConfig,Q.config))}else if(Q==="skip")return void m()}var D=j.instanceConfig.complete;j.instanceConfig.complete=function(J){B(D)&&D(J,j.file,j.inputElem),m()},h.parse(j.file,j.instanceConfig)}}function m(){E.splice(0,1),M()}}),o&&(n.onmessage=function(g){g=g.data,h.WORKER_ID===void 0&&g&&(h.WORKER_ID=g.workerId),typeof g.input=="string"?n.postMessage({workerId:h.WORKER_ID,results:h.parse(g.input,g.config),finished:!0}):(n.File&&g.input instanceof File||g.input instanceof Object)&&(g=h.parse(g.input,g.config))&&n.postMessage({workerId:h.WORKER_ID,results:g,finished:!0})}),(x.prototype=Object.create(w.prototype)).constructor=x,(k.prototype=Object.create(w.prototype)).constructor=k,(l.prototype=Object.create(l.prototype)).constructor=l,(y.prototype=Object.create(w.prototype)).constructor=y,h})});var Xe=_t((Ct,Je)=>{(function(e){typeof Ct=="object"&&typeof Je<"u"?Je.exports=e():typeof define=="function"&&define.amd?define([],e):(typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:this).JSZip=e()})(function(){return function e(n,i,a){function o(h,w){if(!i[h]){if(!n[h]){var x=typeof Oe=="function"&&Oe;if(!w&&x)return x(h,!0);if(s)return s(h,!0);var k=new Error("Cannot find module '"+h+"'");throw k.code="MODULE_NOT_FOUND",k}var l=i[h]={exports:{}};n[h][0].call(l.exports,function(y){var d=n[h][1][y];return o(d||y)},l,l.exports,e,n,i,a)}return i[h].exports}for(var s=typeof Oe=="function"&&Oe,c=0;c<a.length;c++)o(a[c]);return o}({1:[function(e,n,i){"use strict";var a=e("./utils"),o=e("./support"),s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";i.encode=function(c){for(var h,w,x,k,l,y,d,b=[],f=0,_=c.length,S=_,C=a.getTypeOf(c)!=="string";f<c.length;)S=_-f,x=C?(h=c[f++],w=f<_?c[f++]:0,f<_?c[f++]:0):(h=c.charCodeAt(f++),w=f<_?c.charCodeAt(f++):0,f<_?c.charCodeAt(f++):0),k=h>>2,l=(3&h)<<4|w>>4,y=1<S?(15&w)<<2|x>>6:64,d=2<S?63&x:64,b.push(s.charAt(k)+s.charAt(l)+s.charAt(y)+s.charAt(d));return b.join("")},i.decode=function(c){var h,w,x,k,l,y,d=0,b=0,f="data:";if(c.substr(0,f.length)===f)throw new Error("Invalid base64 input, it looks like a data url.");var _,S=3*(c=c.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(c.charAt(c.length-1)===s.charAt(64)&&S--,c.charAt(c.length-2)===s.charAt(64)&&S--,S%1!=0)throw new Error("Invalid base64 input, bad content length.");for(_=o.uint8array?new Uint8Array(0|S):new Array(0|S);d<c.length;)h=s.indexOf(c.charAt(d++))<<2|(k=s.indexOf(c.charAt(d++)))>>4,w=(15&k)<<4|(l=s.indexOf(c.charAt(d++)))>>2,x=(3&l)<<6|(y=s.indexOf(c.charAt(d++))),_[b++]=h,l!==64&&(_[b++]=w),y!==64&&(_[b++]=x);return _}},{"./support":30,"./utils":32}],2:[function(e,n,i){"use strict";var a=e("./external"),o=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),c=e("./stream/DataLengthProbe");function h(w,x,k,l,y){this.compressedSize=w,this.uncompressedSize=x,this.crc32=k,this.compression=l,this.compressedContent=y}h.prototype={getContentWorker:function(){var w=new o(a.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new c("data_length")),x=this;return w.on("end",function(){if(this.streamInfo.data_length!==x.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),w},getCompressedWorker:function(){return new o(a.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},h.createWorkerFrom=function(w,x,k){return w.pipe(new s).pipe(new c("uncompressedSize")).pipe(x.compressWorker(k)).pipe(new c("compressedSize")).withStreamInfo("compression",x)},n.exports=h},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,n,i){"use strict";var a=e("./stream/GenericWorker");i.STORE={magic:"\0\0",compressWorker:function(){return new a("STORE compression")},uncompressWorker:function(){return new a("STORE decompression")}},i.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,n,i){"use strict";var a=e("./utils"),o=function(){for(var s,c=[],h=0;h<256;h++){s=h;for(var w=0;w<8;w++)s=1&s?3988292384^s>>>1:s>>>1;c[h]=s}return c}();n.exports=function(s,c){return s!==void 0&&s.length?a.getTypeOf(s)!=="string"?function(h,w,x,k){var l=o,y=k+x;h^=-1;for(var d=k;d<y;d++)h=h>>>8^l[255&(h^w[d])];return-1^h}(0|c,s,s.length,0):function(h,w,x,k){var l=o,y=k+x;h^=-1;for(var d=k;d<y;d++)h=h>>>8^l[255&(h^w.charCodeAt(d))];return-1^h}(0|c,s,s.length,0):0}},{"./utils":32}],5:[function(e,n,i){"use strict";i.base64=!1,i.binary=!1,i.dir=!1,i.createFolders=!0,i.date=null,i.compression=null,i.compressionOptions=null,i.comment=null,i.unixPermissions=null,i.dosPermissions=null},{}],6:[function(e,n,i){"use strict";var a=null;a=typeof Promise<"u"?Promise:e("lie"),n.exports={Promise:a}},{lie:37}],7:[function(e,n,i){"use strict";var a=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Uint32Array<"u",o=e("pako"),s=e("./utils"),c=e("./stream/GenericWorker"),h=a?"uint8array":"array";function w(x,k){c.call(this,"FlateWorker/"+x),this._pako=null,this._pakoAction=x,this._pakoOptions=k,this.meta={}}i.magic="\b\0",s.inherits(w,c),w.prototype.processChunk=function(x){this.meta=x.meta,this._pako===null&&this._createPako(),this._pako.push(s.transformTo(h,x.data),!1)},w.prototype.flush=function(){c.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},w.prototype.cleanUp=function(){c.prototype.cleanUp.call(this),this._pako=null},w.prototype._createPako=function(){this._pako=new o[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var x=this;this._pako.onData=function(k){x.push({data:k,meta:x.meta})}},i.compressWorker=function(x){return new w("Deflate",x)},i.uncompressWorker=function(){return new w("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,n,i){"use strict";function a(l,y){var d,b="";for(d=0;d<y;d++)b+=String.fromCharCode(255&l),l>>>=8;return b}function o(l,y,d,b,f,_){var S,C,I=l.file,P=l.compression,B=_!==h.utf8encode,g=s.transformTo("string",_(I.name)),u=s.transformTo("string",h.utf8encode(I.name)),E=I.comment,M=s.transformTo("string",_(E)),m=s.transformTo("string",h.utf8encode(E)),O=u.length!==I.name.length,r=m.length!==E.length,U="",te="",j="",Q=I.dir,D=I.date,J={crc32:0,compressedSize:0,uncompressedSize:0};y&&!d||(J.crc32=l.crc32,J.compressedSize=l.compressedSize,J.uncompressedSize=l.uncompressedSize);var z=0;y&&(z|=8),B||!O&&!r||(z|=2048);var L=0,W=0;Q&&(L|=16),f==="UNIX"?(W=798,L|=function(V,ie){var le=V;return V||(le=ie?16893:33204),(65535&le)<<16}(I.unixPermissions,Q)):(W=20,L|=function(V){return 63&(V||0)}(I.dosPermissions)),S=D.getUTCHours(),S<<=6,S|=D.getUTCMinutes(),S<<=5,S|=D.getUTCSeconds()/2,C=D.getUTCFullYear()-1980,C<<=4,C|=D.getUTCMonth()+1,C<<=5,C|=D.getUTCDate(),O&&(te=a(1,1)+a(w(g),4)+u,U+="up"+a(te.length,2)+te),r&&(j=a(1,1)+a(w(M),4)+m,U+="uc"+a(j.length,2)+j);var G="";return G+=`
\0`,G+=a(z,2),G+=P.magic,G+=a(S,2),G+=a(C,2),G+=a(J.crc32,4),G+=a(J.compressedSize,4),G+=a(J.uncompressedSize,4),G+=a(g.length,2),G+=a(U.length,2),{fileRecord:x.LOCAL_FILE_HEADER+G+g+U,dirRecord:x.CENTRAL_FILE_HEADER+a(W,2)+G+a(M.length,2)+"\0\0\0\0"+a(L,4)+a(b,4)+g+U+M}}var s=e("../utils"),c=e("../stream/GenericWorker"),h=e("../utf8"),w=e("../crc32"),x=e("../signature");function k(l,y,d,b){c.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=y,this.zipPlatform=d,this.encodeFileName=b,this.streamFiles=l,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}s.inherits(k,c),k.prototype.push=function(l){var y=l.meta.percent||0,d=this.entriesCount,b=this._sources.length;this.accumulate?this.contentBuffer.push(l):(this.bytesWritten+=l.data.length,c.prototype.push.call(this,{data:l.data,meta:{currentFile:this.currentFile,percent:d?(y+100*(d-b-1))/d:100}}))},k.prototype.openedSource=function(l){this.currentSourceOffset=this.bytesWritten,this.currentFile=l.file.name;var y=this.streamFiles&&!l.file.dir;if(y){var d=o(l,y,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:d.fileRecord,meta:{percent:0}})}else this.accumulate=!0},k.prototype.closedSource=function(l){this.accumulate=!1;var y=this.streamFiles&&!l.file.dir,d=o(l,y,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(d.dirRecord),y)this.push({data:function(b){return x.DATA_DESCRIPTOR+a(b.crc32,4)+a(b.compressedSize,4)+a(b.uncompressedSize,4)}(l),meta:{percent:100}});else for(this.push({data:d.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},k.prototype.flush=function(){for(var l=this.bytesWritten,y=0;y<this.dirRecords.length;y++)this.push({data:this.dirRecords[y],meta:{percent:100}});var d=this.bytesWritten-l,b=function(f,_,S,C,I){var P=s.transformTo("string",I(C));return x.CENTRAL_DIRECTORY_END+"\0\0\0\0"+a(f,2)+a(f,2)+a(_,4)+a(S,4)+a(P.length,2)+P}(this.dirRecords.length,d,l,this.zipComment,this.encodeFileName);this.push({data:b,meta:{percent:100}})},k.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},k.prototype.registerPrevious=function(l){this._sources.push(l);var y=this;return l.on("data",function(d){y.processChunk(d)}),l.on("end",function(){y.closedSource(y.previous.streamInfo),y._sources.length?y.prepareNextSource():y.end()}),l.on("error",function(d){y.error(d)}),this},k.prototype.resume=function(){return!!c.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},k.prototype.error=function(l){var y=this._sources;if(!c.prototype.error.call(this,l))return!1;for(var d=0;d<y.length;d++)try{y[d].error(l)}catch{}return!0},k.prototype.lock=function(){c.prototype.lock.call(this);for(var l=this._sources,y=0;y<l.length;y++)l[y].lock()},n.exports=k},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,n,i){"use strict";var a=e("../compressions"),o=e("./ZipFileWorker");i.generateWorker=function(s,c,h){var w=new o(c.streamFiles,h,c.platform,c.encodeFileName),x=0;try{s.forEach(function(k,l){x++;var y=function(_,S){var C=_||S,I=a[C];if(!I)throw new Error(C+" is not a valid compression method !");return I}(l.options.compression,c.compression),d=l.options.compressionOptions||c.compressionOptions||{},b=l.dir,f=l.date;l._compressWorker(y,d).withStreamInfo("file",{name:k,dir:b,date:f,comment:l.comment||"",unixPermissions:l.unixPermissions,dosPermissions:l.dosPermissions}).pipe(w)}),w.entriesCount=x}catch(k){w.error(k)}return w}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,n,i){"use strict";function a(){if(!(this instanceof a))return new a;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var o=new a;for(var s in this)typeof this[s]!="function"&&(o[s]=this[s]);return o}}(a.prototype=e("./object")).loadAsync=e("./load"),a.support=e("./support"),a.defaults=e("./defaults"),a.version="3.10.1",a.loadAsync=function(o,s){return new a().loadAsync(o,s)},a.external=e("./external"),n.exports=a},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,n,i){"use strict";var a=e("./utils"),o=e("./external"),s=e("./utf8"),c=e("./zipEntries"),h=e("./stream/Crc32Probe"),w=e("./nodejsUtils");function x(k){return new o.Promise(function(l,y){var d=k.decompressed.getContentWorker().pipe(new h);d.on("error",function(b){y(b)}).on("end",function(){d.streamInfo.crc32!==k.decompressed.crc32?y(new Error("Corrupted zip : CRC32 mismatch")):l()}).resume()})}n.exports=function(k,l){var y=this;return l=a.extend(l||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:s.utf8decode}),w.isNode&&w.isStream(k)?o.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):a.prepareContent("the loaded zip file",k,!0,l.optimizedBinaryString,l.base64).then(function(d){var b=new c(l);return b.load(d),b}).then(function(d){var b=[o.Promise.resolve(d)],f=d.files;if(l.checkCRC32)for(var _=0;_<f.length;_++)b.push(x(f[_]));return o.Promise.all(b)}).then(function(d){for(var b=d.shift(),f=b.files,_=0;_<f.length;_++){var S=f[_],C=S.fileNameStr,I=a.resolve(S.fileNameStr);y.file(I,S.decompressed,{binary:!0,optimizedBinaryString:!0,date:S.date,dir:S.dir,comment:S.fileCommentStr.length?S.fileCommentStr:null,unixPermissions:S.unixPermissions,dosPermissions:S.dosPermissions,createFolders:l.createFolders}),S.dir||(y.file(I).unsafeOriginalName=C)}return b.zipComment.length&&(y.comment=b.zipComment),y})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,n,i){"use strict";var a=e("../utils"),o=e("../stream/GenericWorker");function s(c,h){o.call(this,"Nodejs stream input adapter for "+c),this._upstreamEnded=!1,this._bindStream(h)}a.inherits(s,o),s.prototype._bindStream=function(c){var h=this;(this._stream=c).pause(),c.on("data",function(w){h.push({data:w,meta:{percent:0}})}).on("error",function(w){h.isPaused?this.generatedError=w:h.error(w)}).on("end",function(){h.isPaused?h._upstreamEnded=!0:h.end()})},s.prototype.pause=function(){return!!o.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},n.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,n,i){"use strict";var a=e("readable-stream").Readable;function o(s,c,h){a.call(this,c),this._helper=s;var w=this;s.on("data",function(x,k){w.push(x)||w._helper.pause(),h&&h(k)}).on("error",function(x){w.emit("error",x)}).on("end",function(){w.push(null)})}e("../utils").inherits(o,a),o.prototype._read=function(){this._helper.resume()},n.exports=o},{"../utils":32,"readable-stream":16}],14:[function(e,n,i){"use strict";n.exports={isNode:typeof Buffer<"u",newBufferFrom:function(a,o){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(a,o);if(typeof a=="number")throw new Error('The "data" argument must not be a number');return new Buffer(a,o)},allocBuffer:function(a){if(Buffer.alloc)return Buffer.alloc(a);var o=new Buffer(a);return o.fill(0),o},isBuffer:function(a){return Buffer.isBuffer(a)},isStream:function(a){return a&&typeof a.on=="function"&&typeof a.pause=="function"&&typeof a.resume=="function"}}},{}],15:[function(e,n,i){"use strict";function a(I,P,B){var g,u=s.getTypeOf(P),E=s.extend(B||{},w);E.date=E.date||new Date,E.compression!==null&&(E.compression=E.compression.toUpperCase()),typeof E.unixPermissions=="string"&&(E.unixPermissions=parseInt(E.unixPermissions,8)),E.unixPermissions&&16384&E.unixPermissions&&(E.dir=!0),E.dosPermissions&&16&E.dosPermissions&&(E.dir=!0),E.dir&&(I=f(I)),E.createFolders&&(g=b(I))&&_.call(this,g,!0);var M=u==="string"&&E.binary===!1&&E.base64===!1;B&&B.binary!==void 0||(E.binary=!M),(P instanceof x&&P.uncompressedSize===0||E.dir||!P||P.length===0)&&(E.base64=!1,E.binary=!0,P="",E.compression="STORE",u="string");var m=null;m=P instanceof x||P instanceof c?P:y.isNode&&y.isStream(P)?new d(I,P):s.prepareContent(I,P,E.binary,E.optimizedBinaryString,E.base64);var O=new k(I,m,E);this.files[I]=O}var o=e("./utf8"),s=e("./utils"),c=e("./stream/GenericWorker"),h=e("./stream/StreamHelper"),w=e("./defaults"),x=e("./compressedObject"),k=e("./zipObject"),l=e("./generate"),y=e("./nodejsUtils"),d=e("./nodejs/NodejsStreamInputAdapter"),b=function(I){I.slice(-1)==="/"&&(I=I.substring(0,I.length-1));var P=I.lastIndexOf("/");return 0<P?I.substring(0,P):""},f=function(I){return I.slice(-1)!=="/"&&(I+="/"),I},_=function(I,P){return P=P!==void 0?P:w.createFolders,I=f(I),this.files[I]||a.call(this,I,null,{dir:!0,createFolders:P}),this.files[I]};function S(I){return Object.prototype.toString.call(I)==="[object RegExp]"}var C={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(I){var P,B,g;for(P in this.files)g=this.files[P],(B=P.slice(this.root.length,P.length))&&P.slice(0,this.root.length)===this.root&&I(B,g)},filter:function(I){var P=[];return this.forEach(function(B,g){I(B,g)&&P.push(g)}),P},file:function(I,P,B){if(arguments.length!==1)return I=this.root+I,a.call(this,I,P,B),this;if(S(I)){var g=I;return this.filter(function(E,M){return!M.dir&&g.test(E)})}var u=this.files[this.root+I];return u&&!u.dir?u:null},folder:function(I){if(!I)return this;if(S(I))return this.filter(function(u,E){return E.dir&&I.test(u)});var P=this.root+I,B=_.call(this,P),g=this.clone();return g.root=B.name,g},remove:function(I){I=this.root+I;var P=this.files[I];if(P||(I.slice(-1)!=="/"&&(I+="/"),P=this.files[I]),P&&!P.dir)delete this.files[I];else for(var B=this.filter(function(u,E){return E.name.slice(0,I.length)===I}),g=0;g<B.length;g++)delete this.files[B[g].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(I){var P,B={};try{if((B=s.extend(I||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:o.utf8encode})).type=B.type.toLowerCase(),B.compression=B.compression.toUpperCase(),B.type==="binarystring"&&(B.type="string"),!B.type)throw new Error("No output type specified.");s.checkSupport(B.type),B.platform!=="darwin"&&B.platform!=="freebsd"&&B.platform!=="linux"&&B.platform!=="sunos"||(B.platform="UNIX"),B.platform==="win32"&&(B.platform="DOS");var g=B.comment||this.comment||"";P=l.generateWorker(this,B,g)}catch(u){(P=new c("error")).error(u)}return new h(P,B.type||"string",B.mimeType)},generateAsync:function(I,P){return this.generateInternalStream(I).accumulate(P)},generateNodeStream:function(I,P){return(I=I||{}).type||(I.type="nodebuffer"),this.generateInternalStream(I).toNodejsStream(P)}};n.exports=C},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,n,i){"use strict";n.exports=e("stream")},{stream:void 0}],17:[function(e,n,i){"use strict";var a=e("./DataReader");function o(s){a.call(this,s);for(var c=0;c<this.data.length;c++)s[c]=255&s[c]}e("../utils").inherits(o,a),o.prototype.byteAt=function(s){return this.data[this.zero+s]},o.prototype.lastIndexOfSignature=function(s){for(var c=s.charCodeAt(0),h=s.charCodeAt(1),w=s.charCodeAt(2),x=s.charCodeAt(3),k=this.length-4;0<=k;--k)if(this.data[k]===c&&this.data[k+1]===h&&this.data[k+2]===w&&this.data[k+3]===x)return k-this.zero;return-1},o.prototype.readAndCheckSignature=function(s){var c=s.charCodeAt(0),h=s.charCodeAt(1),w=s.charCodeAt(2),x=s.charCodeAt(3),k=this.readData(4);return c===k[0]&&h===k[1]&&w===k[2]&&x===k[3]},o.prototype.readData=function(s){if(this.checkOffset(s),s===0)return[];var c=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,c},n.exports=o},{"../utils":32,"./DataReader":18}],18:[function(e,n,i){"use strict";var a=e("../utils");function o(s){this.data=s,this.length=s.length,this.index=0,this.zero=0}o.prototype={checkOffset:function(s){this.checkIndex(this.index+s)},checkIndex:function(s){if(this.length<this.zero+s||s<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+s+"). Corrupted zip ?")},setIndex:function(s){this.checkIndex(s),this.index=s},skip:function(s){this.setIndex(this.index+s)},byteAt:function(){},readInt:function(s){var c,h=0;for(this.checkOffset(s),c=this.index+s-1;c>=this.index;c--)h=(h<<8)+this.byteAt(c);return this.index+=s,h},readString:function(s){return a.transformTo("string",this.readData(s))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var s=this.readInt(4);return new Date(Date.UTC(1980+(s>>25&127),(s>>21&15)-1,s>>16&31,s>>11&31,s>>5&63,(31&s)<<1))}},n.exports=o},{"../utils":32}],19:[function(e,n,i){"use strict";var a=e("./Uint8ArrayReader");function o(s){a.call(this,s)}e("../utils").inherits(o,a),o.prototype.readData=function(s){this.checkOffset(s);var c=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,c},n.exports=o},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,n,i){"use strict";var a=e("./DataReader");function o(s){a.call(this,s)}e("../utils").inherits(o,a),o.prototype.byteAt=function(s){return this.data.charCodeAt(this.zero+s)},o.prototype.lastIndexOfSignature=function(s){return this.data.lastIndexOf(s)-this.zero},o.prototype.readAndCheckSignature=function(s){return s===this.readData(4)},o.prototype.readData=function(s){this.checkOffset(s);var c=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,c},n.exports=o},{"../utils":32,"./DataReader":18}],21:[function(e,n,i){"use strict";var a=e("./ArrayReader");function o(s){a.call(this,s)}e("../utils").inherits(o,a),o.prototype.readData=function(s){if(this.checkOffset(s),s===0)return new Uint8Array(0);var c=this.data.subarray(this.zero+this.index,this.zero+this.index+s);return this.index+=s,c},n.exports=o},{"../utils":32,"./ArrayReader":17}],22:[function(e,n,i){"use strict";var a=e("../utils"),o=e("../support"),s=e("./ArrayReader"),c=e("./StringReader"),h=e("./NodeBufferReader"),w=e("./Uint8ArrayReader");n.exports=function(x){var k=a.getTypeOf(x);return a.checkSupport(k),k!=="string"||o.uint8array?k==="nodebuffer"?new h(x):o.uint8array?new w(a.transformTo("uint8array",x)):new s(a.transformTo("array",x)):new c(x)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,n,i){"use strict";i.LOCAL_FILE_HEADER="PK",i.CENTRAL_FILE_HEADER="PK",i.CENTRAL_DIRECTORY_END="PK",i.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",i.ZIP64_CENTRAL_DIRECTORY_END="PK",i.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(e,n,i){"use strict";var a=e("./GenericWorker"),o=e("../utils");function s(c){a.call(this,"ConvertWorker to "+c),this.destType=c}o.inherits(s,a),s.prototype.processChunk=function(c){this.push({data:o.transformTo(this.destType,c.data),meta:c.meta})},n.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(e,n,i){"use strict";var a=e("./GenericWorker"),o=e("../crc32");function s(){a.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(s,a),s.prototype.processChunk=function(c){this.streamInfo.crc32=o(c.data,this.streamInfo.crc32||0),this.push(c)},n.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,n,i){"use strict";var a=e("../utils"),o=e("./GenericWorker");function s(c){o.call(this,"DataLengthProbe for "+c),this.propName=c,this.withStreamInfo(c,0)}a.inherits(s,o),s.prototype.processChunk=function(c){if(c){var h=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=h+c.data.length}o.prototype.processChunk.call(this,c)},n.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(e,n,i){"use strict";var a=e("../utils"),o=e("./GenericWorker");function s(c){o.call(this,"DataWorker");var h=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,c.then(function(w){h.dataIsReady=!0,h.data=w,h.max=w&&w.length||0,h.type=a.getTypeOf(w),h.isPaused||h._tickAndRepeat()},function(w){h.error(w)})}a.inherits(s,o),s.prototype.cleanUp=function(){o.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,a.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(a.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var c=null,h=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":c=this.data.substring(this.index,h);break;case"uint8array":c=this.data.subarray(this.index,h);break;case"array":case"nodebuffer":c=this.data.slice(this.index,h)}return this.index=h,this.push({data:c,meta:{percent:this.max?this.index/this.max*100:0}})},n.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(e,n,i){"use strict";function a(o){this.name=o||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}a.prototype={push:function(o){this.emit("data",o)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(o){this.emit("error",o)}return!0},error:function(o){return!this.isFinished&&(this.isPaused?this.generatedError=o:(this.isFinished=!0,this.emit("error",o),this.previous&&this.previous.error(o),this.cleanUp()),!0)},on:function(o,s){return this._listeners[o].push(s),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(o,s){if(this._listeners[o])for(var c=0;c<this._listeners[o].length;c++)this._listeners[o][c].call(this,s)},pipe:function(o){return o.registerPrevious(this)},registerPrevious:function(o){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=o.streamInfo,this.mergeStreamInfo(),this.previous=o;var s=this;return o.on("data",function(c){s.processChunk(c)}),o.on("end",function(){s.end()}),o.on("error",function(c){s.error(c)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var o=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),o=!0),this.previous&&this.previous.resume(),!o},flush:function(){},processChunk:function(o){this.push(o)},withStreamInfo:function(o,s){return this.extraStreamInfo[o]=s,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var o in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,o)&&(this.streamInfo[o]=this.extraStreamInfo[o])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var o="Worker "+this.name;return this.previous?this.previous+" -> "+o:o}},n.exports=a},{}],29:[function(e,n,i){"use strict";var a=e("../utils"),o=e("./ConvertWorker"),s=e("./GenericWorker"),c=e("../base64"),h=e("../support"),w=e("../external"),x=null;if(h.nodestream)try{x=e("../nodejs/NodejsStreamOutputAdapter")}catch{}function k(y,d){return new w.Promise(function(b,f){var _=[],S=y._internalType,C=y._outputType,I=y._mimeType;y.on("data",function(P,B){_.push(P),d&&d(B)}).on("error",function(P){_=[],f(P)}).on("end",function(){try{var P=function(B,g,u){switch(B){case"blob":return a.newBlob(a.transformTo("arraybuffer",g),u);case"base64":return c.encode(g);default:return a.transformTo(B,g)}}(C,function(B,g){var u,E=0,M=null,m=0;for(u=0;u<g.length;u++)m+=g[u].length;switch(B){case"string":return g.join("");case"array":return Array.prototype.concat.apply([],g);case"uint8array":for(M=new Uint8Array(m),u=0;u<g.length;u++)M.set(g[u],E),E+=g[u].length;return M;case"nodebuffer":return Buffer.concat(g);default:throw new Error("concat : unsupported type '"+B+"'")}}(S,_),I);b(P)}catch(B){f(B)}_=[]}).resume()})}function l(y,d,b){var f=d;switch(d){case"blob":case"arraybuffer":f="uint8array";break;case"base64":f="string"}try{this._internalType=f,this._outputType=d,this._mimeType=b,a.checkSupport(f),this._worker=y.pipe(new o(f)),y.lock()}catch(_){this._worker=new s("error"),this._worker.error(_)}}l.prototype={accumulate:function(y){return k(this,y)},on:function(y,d){var b=this;return y==="data"?this._worker.on(y,function(f){d.call(b,f.data,f.meta)}):this._worker.on(y,function(){a.delay(d,arguments,b)}),this},resume:function(){return a.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(y){if(a.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new x(this,{objectMode:this._outputType!=="nodebuffer"},y)}},n.exports=l},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,n,i){"use strict";if(i.base64=!0,i.array=!0,i.string=!0,i.arraybuffer=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u",i.nodebuffer=typeof Buffer<"u",i.uint8array=typeof Uint8Array<"u",typeof ArrayBuffer>"u")i.blob=!1;else{var a=new ArrayBuffer(0);try{i.blob=new Blob([a],{type:"application/zip"}).size===0}catch{try{var o=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);o.append(a),i.blob=o.getBlob("application/zip").size===0}catch{i.blob=!1}}}try{i.nodestream=!!e("readable-stream").Readable}catch{i.nodestream=!1}},{"readable-stream":16}],31:[function(e,n,i){"use strict";for(var a=e("./utils"),o=e("./support"),s=e("./nodejsUtils"),c=e("./stream/GenericWorker"),h=new Array(256),w=0;w<256;w++)h[w]=252<=w?6:248<=w?5:240<=w?4:224<=w?3:192<=w?2:1;h[254]=h[254]=1;function x(){c.call(this,"utf-8 decode"),this.leftOver=null}function k(){c.call(this,"utf-8 encode")}i.utf8encode=function(l){return o.nodebuffer?s.newBufferFrom(l,"utf-8"):function(y){var d,b,f,_,S,C=y.length,I=0;for(_=0;_<C;_++)(64512&(b=y.charCodeAt(_)))==55296&&_+1<C&&(64512&(f=y.charCodeAt(_+1)))==56320&&(b=65536+(b-55296<<10)+(f-56320),_++),I+=b<128?1:b<2048?2:b<65536?3:4;for(d=o.uint8array?new Uint8Array(I):new Array(I),_=S=0;S<I;_++)(64512&(b=y.charCodeAt(_)))==55296&&_+1<C&&(64512&(f=y.charCodeAt(_+1)))==56320&&(b=65536+(b-55296<<10)+(f-56320),_++),b<128?d[S++]=b:(b<2048?d[S++]=192|b>>>6:(b<65536?d[S++]=224|b>>>12:(d[S++]=240|b>>>18,d[S++]=128|b>>>12&63),d[S++]=128|b>>>6&63),d[S++]=128|63&b);return d}(l)},i.utf8decode=function(l){return o.nodebuffer?a.transformTo("nodebuffer",l).toString("utf-8"):function(y){var d,b,f,_,S=y.length,C=new Array(2*S);for(d=b=0;d<S;)if((f=y[d++])<128)C[b++]=f;else if(4<(_=h[f]))C[b++]=65533,d+=_-1;else{for(f&=_===2?31:_===3?15:7;1<_&&d<S;)f=f<<6|63&y[d++],_--;1<_?C[b++]=65533:f<65536?C[b++]=f:(f-=65536,C[b++]=55296|f>>10&1023,C[b++]=56320|1023&f)}return C.length!==b&&(C.subarray?C=C.subarray(0,b):C.length=b),a.applyFromCharCode(C)}(l=a.transformTo(o.uint8array?"uint8array":"array",l))},a.inherits(x,c),x.prototype.processChunk=function(l){var y=a.transformTo(o.uint8array?"uint8array":"array",l.data);if(this.leftOver&&this.leftOver.length){if(o.uint8array){var d=y;(y=new Uint8Array(d.length+this.leftOver.length)).set(this.leftOver,0),y.set(d,this.leftOver.length)}else y=this.leftOver.concat(y);this.leftOver=null}var b=function(_,S){var C;for((S=S||_.length)>_.length&&(S=_.length),C=S-1;0<=C&&(192&_[C])==128;)C--;return C<0||C===0?S:C+h[_[C]]>S?C:S}(y),f=y;b!==y.length&&(o.uint8array?(f=y.subarray(0,b),this.leftOver=y.subarray(b,y.length)):(f=y.slice(0,b),this.leftOver=y.slice(b,y.length))),this.push({data:i.utf8decode(f),meta:l.meta})},x.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:i.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},i.Utf8DecodeWorker=x,a.inherits(k,c),k.prototype.processChunk=function(l){this.push({data:i.utf8encode(l.data),meta:l.meta})},i.Utf8EncodeWorker=k},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,n,i){"use strict";var a=e("./support"),o=e("./base64"),s=e("./nodejsUtils"),c=e("./external");function h(d){return d}function w(d,b){for(var f=0;f<d.length;++f)b[f]=255&d.charCodeAt(f);return b}e("setimmediate"),i.newBlob=function(d,b){i.checkSupport("blob");try{return new Blob([d],{type:b})}catch{try{var f=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return f.append(d),f.getBlob(b)}catch{throw new Error("Bug : can't construct the Blob.")}}};var x={stringifyByChunk:function(d,b,f){var _=[],S=0,C=d.length;if(C<=f)return String.fromCharCode.apply(null,d);for(;S<C;)b==="array"||b==="nodebuffer"?_.push(String.fromCharCode.apply(null,d.slice(S,Math.min(S+f,C)))):_.push(String.fromCharCode.apply(null,d.subarray(S,Math.min(S+f,C)))),S+=f;return _.join("")},stringifyByChar:function(d){for(var b="",f=0;f<d.length;f++)b+=String.fromCharCode(d[f]);return b},applyCanBeUsed:{uint8array:function(){try{return a.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return a.nodebuffer&&String.fromCharCode.apply(null,s.allocBuffer(1)).length===1}catch{return!1}}()}};function k(d){var b=65536,f=i.getTypeOf(d),_=!0;if(f==="uint8array"?_=x.applyCanBeUsed.uint8array:f==="nodebuffer"&&(_=x.applyCanBeUsed.nodebuffer),_)for(;1<b;)try{return x.stringifyByChunk(d,f,b)}catch{b=Math.floor(b/2)}return x.stringifyByChar(d)}function l(d,b){for(var f=0;f<d.length;f++)b[f]=d[f];return b}i.applyFromCharCode=k;var y={};y.string={string:h,array:function(d){return w(d,new Array(d.length))},arraybuffer:function(d){return y.string.uint8array(d).buffer},uint8array:function(d){return w(d,new Uint8Array(d.length))},nodebuffer:function(d){return w(d,s.allocBuffer(d.length))}},y.array={string:k,array:h,arraybuffer:function(d){return new Uint8Array(d).buffer},uint8array:function(d){return new Uint8Array(d)},nodebuffer:function(d){return s.newBufferFrom(d)}},y.arraybuffer={string:function(d){return k(new Uint8Array(d))},array:function(d){return l(new Uint8Array(d),new Array(d.byteLength))},arraybuffer:h,uint8array:function(d){return new Uint8Array(d)},nodebuffer:function(d){return s.newBufferFrom(new Uint8Array(d))}},y.uint8array={string:k,array:function(d){return l(d,new Array(d.length))},arraybuffer:function(d){return d.buffer},uint8array:h,nodebuffer:function(d){return s.newBufferFrom(d)}},y.nodebuffer={string:k,array:function(d){return l(d,new Array(d.length))},arraybuffer:function(d){return y.nodebuffer.uint8array(d).buffer},uint8array:function(d){return l(d,new Uint8Array(d.length))},nodebuffer:h},i.transformTo=function(d,b){if(b=b||"",!d)return b;i.checkSupport(d);var f=i.getTypeOf(b);return y[f][d](b)},i.resolve=function(d){for(var b=d.split("/"),f=[],_=0;_<b.length;_++){var S=b[_];S==="."||S===""&&_!==0&&_!==b.length-1||(S===".."?f.pop():f.push(S))}return f.join("/")},i.getTypeOf=function(d){return typeof d=="string"?"string":Object.prototype.toString.call(d)==="[object Array]"?"array":a.nodebuffer&&s.isBuffer(d)?"nodebuffer":a.uint8array&&d instanceof Uint8Array?"uint8array":a.arraybuffer&&d instanceof ArrayBuffer?"arraybuffer":void 0},i.checkSupport=function(d){if(!a[d.toLowerCase()])throw new Error(d+" is not supported by this platform")},i.MAX_VALUE_16BITS=65535,i.MAX_VALUE_32BITS=-1,i.pretty=function(d){var b,f,_="";for(f=0;f<(d||"").length;f++)_+="\\x"+((b=d.charCodeAt(f))<16?"0":"")+b.toString(16).toUpperCase();return _},i.delay=function(d,b,f){setImmediate(function(){d.apply(f||null,b||[])})},i.inherits=function(d,b){function f(){}f.prototype=b.prototype,d.prototype=new f},i.extend=function(){var d,b,f={};for(d=0;d<arguments.length;d++)for(b in arguments[d])Object.prototype.hasOwnProperty.call(arguments[d],b)&&f[b]===void 0&&(f[b]=arguments[d][b]);return f},i.prepareContent=function(d,b,f,_,S){return c.Promise.resolve(b).then(function(C){return a.blob&&(C instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(C))!==-1)&&typeof FileReader<"u"?new c.Promise(function(I,P){var B=new FileReader;B.onload=function(g){I(g.target.result)},B.onerror=function(g){P(g.target.error)},B.readAsArrayBuffer(C)}):C}).then(function(C){var I=i.getTypeOf(C);return I?(I==="arraybuffer"?C=i.transformTo("uint8array",C):I==="string"&&(S?C=o.decode(C):f&&_!==!0&&(C=function(P){return w(P,a.uint8array?new Uint8Array(P.length):new Array(P.length))}(C))),C):c.Promise.reject(new Error("Can't read the data of '"+d+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,n,i){"use strict";var a=e("./reader/readerFor"),o=e("./utils"),s=e("./signature"),c=e("./zipEntry"),h=e("./support");function w(x){this.files=[],this.loadOptions=x}w.prototype={checkSignature:function(x){if(!this.reader.readAndCheckSignature(x)){this.reader.index-=4;var k=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+o.pretty(k)+", expected "+o.pretty(x)+")")}},isSignature:function(x,k){var l=this.reader.index;this.reader.setIndex(x);var y=this.reader.readString(4)===k;return this.reader.setIndex(l),y},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var x=this.reader.readData(this.zipCommentLength),k=h.uint8array?"uint8array":"array",l=o.transformTo(k,x);this.zipComment=this.loadOptions.decodeFileName(l)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var x,k,l,y=this.zip64EndOfCentralSize-44;0<y;)x=this.reader.readInt(2),k=this.reader.readInt(4),l=this.reader.readData(k),this.zip64ExtensibleData[x]={id:x,length:k,value:l}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var x,k;for(x=0;x<this.files.length;x++)k=this.files[x],this.reader.setIndex(k.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),k.readLocalPart(this.reader),k.handleUTF8(),k.processAttributes()},readCentralDir:function(){var x;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(x=new c({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(x);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var x=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(x<0)throw this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(x);var k=x;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===o.MAX_VALUE_16BITS||this.diskWithCentralDirStart===o.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===o.MAX_VALUE_16BITS||this.centralDirRecords===o.MAX_VALUE_16BITS||this.centralDirSize===o.MAX_VALUE_32BITS||this.centralDirOffset===o.MAX_VALUE_32BITS){if(this.zip64=!0,(x=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(x),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var l=this.centralDirOffset+this.centralDirSize;this.zip64&&(l+=20,l+=12+this.zip64EndOfCentralSize);var y=k-l;if(0<y)this.isSignature(k,s.CENTRAL_FILE_HEADER)||(this.reader.zero=y);else if(y<0)throw new Error("Corrupted zip: missing "+Math.abs(y)+" bytes.")},prepareReader:function(x){this.reader=a(x)},load:function(x){this.prepareReader(x),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},n.exports=w},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,n,i){"use strict";var a=e("./reader/readerFor"),o=e("./utils"),s=e("./compressedObject"),c=e("./crc32"),h=e("./utf8"),w=e("./compressions"),x=e("./support");function k(l,y){this.options=l,this.loadOptions=y}k.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(l){var y,d;if(l.skip(22),this.fileNameLength=l.readInt(2),d=l.readInt(2),this.fileName=l.readData(this.fileNameLength),l.skip(d),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((y=function(b){for(var f in w)if(Object.prototype.hasOwnProperty.call(w,f)&&w[f].magic===b)return w[f];return null}(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+o.pretty(this.compressionMethod)+" unknown (inner file : "+o.transformTo("string",this.fileName)+")");this.decompressed=new s(this.compressedSize,this.uncompressedSize,this.crc32,y,l.readData(this.compressedSize))},readCentralPart:function(l){this.versionMadeBy=l.readInt(2),l.skip(2),this.bitFlag=l.readInt(2),this.compressionMethod=l.readString(2),this.date=l.readDate(),this.crc32=l.readInt(4),this.compressedSize=l.readInt(4),this.uncompressedSize=l.readInt(4);var y=l.readInt(2);if(this.extraFieldsLength=l.readInt(2),this.fileCommentLength=l.readInt(2),this.diskNumberStart=l.readInt(2),this.internalFileAttributes=l.readInt(2),this.externalFileAttributes=l.readInt(4),this.localHeaderOffset=l.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");l.skip(y),this.readExtraFields(l),this.parseZIP64ExtraField(l),this.fileComment=l.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var l=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),l==0&&(this.dosPermissions=63&this.externalFileAttributes),l==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var l=a(this.extraFields[1].value);this.uncompressedSize===o.MAX_VALUE_32BITS&&(this.uncompressedSize=l.readInt(8)),this.compressedSize===o.MAX_VALUE_32BITS&&(this.compressedSize=l.readInt(8)),this.localHeaderOffset===o.MAX_VALUE_32BITS&&(this.localHeaderOffset=l.readInt(8)),this.diskNumberStart===o.MAX_VALUE_32BITS&&(this.diskNumberStart=l.readInt(4))}},readExtraFields:function(l){var y,d,b,f=l.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});l.index+4<f;)y=l.readInt(2),d=l.readInt(2),b=l.readData(d),this.extraFields[y]={id:y,length:d,value:b};l.setIndex(f)},handleUTF8:function(){var l=x.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=h.utf8decode(this.fileName),this.fileCommentStr=h.utf8decode(this.fileComment);else{var y=this.findExtraFieldUnicodePath();if(y!==null)this.fileNameStr=y;else{var d=o.transformTo(l,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(d)}var b=this.findExtraFieldUnicodeComment();if(b!==null)this.fileCommentStr=b;else{var f=o.transformTo(l,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(f)}}},findExtraFieldUnicodePath:function(){var l=this.extraFields[28789];if(l){var y=a(l.value);return y.readInt(1)!==1||c(this.fileName)!==y.readInt(4)?null:h.utf8decode(y.readData(l.length-5))}return null},findExtraFieldUnicodeComment:function(){var l=this.extraFields[25461];if(l){var y=a(l.value);return y.readInt(1)!==1||c(this.fileComment)!==y.readInt(4)?null:h.utf8decode(y.readData(l.length-5))}return null}},n.exports=k},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,n,i){"use strict";function a(y,d,b){this.name=y,this.dir=b.dir,this.date=b.date,this.comment=b.comment,this.unixPermissions=b.unixPermissions,this.dosPermissions=b.dosPermissions,this._data=d,this._dataBinary=b.binary,this.options={compression:b.compression,compressionOptions:b.compressionOptions}}var o=e("./stream/StreamHelper"),s=e("./stream/DataWorker"),c=e("./utf8"),h=e("./compressedObject"),w=e("./stream/GenericWorker");a.prototype={internalStream:function(y){var d=null,b="string";try{if(!y)throw new Error("No output type specified.");var f=(b=y.toLowerCase())==="string"||b==="text";b!=="binarystring"&&b!=="text"||(b="string"),d=this._decompressWorker();var _=!this._dataBinary;_&&!f&&(d=d.pipe(new c.Utf8EncodeWorker)),!_&&f&&(d=d.pipe(new c.Utf8DecodeWorker))}catch(S){(d=new w("error")).error(S)}return new o(d,b,"")},async:function(y,d){return this.internalStream(y).accumulate(d)},nodeStream:function(y,d){return this.internalStream(y||"nodebuffer").toNodejsStream(d)},_compressWorker:function(y,d){if(this._data instanceof h&&this._data.compression.magic===y.magic)return this._data.getCompressedWorker();var b=this._decompressWorker();return this._dataBinary||(b=b.pipe(new c.Utf8EncodeWorker)),h.createWorkerFrom(b,y,d)},_decompressWorker:function(){return this._data instanceof h?this._data.getContentWorker():this._data instanceof w?this._data:new s(this._data)}};for(var x=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],k=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},l=0;l<x.length;l++)a.prototype[x[l]]=k;n.exports=a},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,n,i){(function(a){"use strict";var o,s,c=a.MutationObserver||a.WebKitMutationObserver;if(c){var h=0,w=new c(y),x=a.document.createTextNode("");w.observe(x,{characterData:!0}),o=function(){x.data=h=++h%2}}else if(a.setImmediate||a.MessageChannel===void 0)o="document"in a&&"onreadystatechange"in a.document.createElement("script")?function(){var d=a.document.createElement("script");d.onreadystatechange=function(){y(),d.onreadystatechange=null,d.parentNode.removeChild(d),d=null},a.document.documentElement.appendChild(d)}:function(){setTimeout(y,0)};else{var k=new a.MessageChannel;k.port1.onmessage=y,o=function(){k.port2.postMessage(0)}}var l=[];function y(){var d,b;s=!0;for(var f=l.length;f;){for(b=l,l=[],d=-1;++d<f;)b[d]();f=l.length}s=!1}n.exports=function(d){l.push(d)!==1||s||o()}}).call(this,typeof global<"u"?global:typeof self<"u"?self:typeof window<"u"?window:{})},{}],37:[function(e,n,i){"use strict";var a=e("immediate");function o(){}var s={},c=["REJECTED"],h=["FULFILLED"],w=["PENDING"];function x(f){if(typeof f!="function")throw new TypeError("resolver must be a function");this.state=w,this.queue=[],this.outcome=void 0,f!==o&&d(this,f)}function k(f,_,S){this.promise=f,typeof _=="function"&&(this.onFulfilled=_,this.callFulfilled=this.otherCallFulfilled),typeof S=="function"&&(this.onRejected=S,this.callRejected=this.otherCallRejected)}function l(f,_,S){a(function(){var C;try{C=_(S)}catch(I){return s.reject(f,I)}C===f?s.reject(f,new TypeError("Cannot resolve promise with itself")):s.resolve(f,C)})}function y(f){var _=f&&f.then;if(f&&(typeof f=="object"||typeof f=="function")&&typeof _=="function")return function(){_.apply(f,arguments)}}function d(f,_){var S=!1;function C(B){S||(S=!0,s.reject(f,B))}function I(B){S||(S=!0,s.resolve(f,B))}var P=b(function(){_(I,C)});P.status==="error"&&C(P.value)}function b(f,_){var S={};try{S.value=f(_),S.status="success"}catch(C){S.status="error",S.value=C}return S}(n.exports=x).prototype.finally=function(f){if(typeof f!="function")return this;var _=this.constructor;return this.then(function(S){return _.resolve(f()).then(function(){return S})},function(S){return _.resolve(f()).then(function(){throw S})})},x.prototype.catch=function(f){return this.then(null,f)},x.prototype.then=function(f,_){if(typeof f!="function"&&this.state===h||typeof _!="function"&&this.state===c)return this;var S=new this.constructor(o);return this.state!==w?l(S,this.state===h?f:_,this.outcome):this.queue.push(new k(S,f,_)),S},k.prototype.callFulfilled=function(f){s.resolve(this.promise,f)},k.prototype.otherCallFulfilled=function(f){l(this.promise,this.onFulfilled,f)},k.prototype.callRejected=function(f){s.reject(this.promise,f)},k.prototype.otherCallRejected=function(f){l(this.promise,this.onRejected,f)},s.resolve=function(f,_){var S=b(y,_);if(S.status==="error")return s.reject(f,S.value);var C=S.value;if(C)d(f,C);else{f.state=h,f.outcome=_;for(var I=-1,P=f.queue.length;++I<P;)f.queue[I].callFulfilled(_)}return f},s.reject=function(f,_){f.state=c,f.outcome=_;for(var S=-1,C=f.queue.length;++S<C;)f.queue[S].callRejected(_);return f},x.resolve=function(f){return f instanceof this?f:s.resolve(new this(o),f)},x.reject=function(f){var _=new this(o);return s.reject(_,f)},x.all=function(f){var _=this;if(Object.prototype.toString.call(f)!=="[object Array]")return this.reject(new TypeError("must be an array"));var S=f.length,C=!1;if(!S)return this.resolve([]);for(var I=new Array(S),P=0,B=-1,g=new this(o);++B<S;)u(f[B],B);return g;function u(E,M){_.resolve(E).then(function(m){I[M]=m,++P!==S||C||(C=!0,s.resolve(g,I))},function(m){C||(C=!0,s.reject(g,m))})}},x.race=function(f){var _=this;if(Object.prototype.toString.call(f)!=="[object Array]")return this.reject(new TypeError("must be an array"));var S=f.length,C=!1;if(!S)return this.resolve([]);for(var I=-1,P=new this(o);++I<S;)B=f[I],_.resolve(B).then(function(g){C||(C=!0,s.resolve(P,g))},function(g){C||(C=!0,s.reject(P,g))});var B;return P}},{immediate:36}],38:[function(e,n,i){"use strict";var a={};(0,e("./lib/utils/common").assign)(a,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),n.exports=a},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,n,i){"use strict";var a=e("./zlib/deflate"),o=e("./utils/common"),s=e("./utils/strings"),c=e("./zlib/messages"),h=e("./zlib/zstream"),w=Object.prototype.toString,x=0,k=-1,l=0,y=8;function d(f){if(!(this instanceof d))return new d(f);this.options=o.assign({level:k,method:y,chunkSize:16384,windowBits:15,memLevel:8,strategy:l,to:""},f||{});var _=this.options;_.raw&&0<_.windowBits?_.windowBits=-_.windowBits:_.gzip&&0<_.windowBits&&_.windowBits<16&&(_.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new h,this.strm.avail_out=0;var S=a.deflateInit2(this.strm,_.level,_.method,_.windowBits,_.memLevel,_.strategy);if(S!==x)throw new Error(c[S]);if(_.header&&a.deflateSetHeader(this.strm,_.header),_.dictionary){var C;if(C=typeof _.dictionary=="string"?s.string2buf(_.dictionary):w.call(_.dictionary)==="[object ArrayBuffer]"?new Uint8Array(_.dictionary):_.dictionary,(S=a.deflateSetDictionary(this.strm,C))!==x)throw new Error(c[S]);this._dict_set=!0}}function b(f,_){var S=new d(_);if(S.push(f,!0),S.err)throw S.msg||c[S.err];return S.result}d.prototype.push=function(f,_){var S,C,I=this.strm,P=this.options.chunkSize;if(this.ended)return!1;C=_===~~_?_:_===!0?4:0,typeof f=="string"?I.input=s.string2buf(f):w.call(f)==="[object ArrayBuffer]"?I.input=new Uint8Array(f):I.input=f,I.next_in=0,I.avail_in=I.input.length;do{if(I.avail_out===0&&(I.output=new o.Buf8(P),I.next_out=0,I.avail_out=P),(S=a.deflate(I,C))!==1&&S!==x)return this.onEnd(S),!(this.ended=!0);I.avail_out!==0&&(I.avail_in!==0||C!==4&&C!==2)||(this.options.to==="string"?this.onData(s.buf2binstring(o.shrinkBuf(I.output,I.next_out))):this.onData(o.shrinkBuf(I.output,I.next_out)))}while((0<I.avail_in||I.avail_out===0)&&S!==1);return C===4?(S=a.deflateEnd(this.strm),this.onEnd(S),this.ended=!0,S===x):C!==2||(this.onEnd(x),!(I.avail_out=0))},d.prototype.onData=function(f){this.chunks.push(f)},d.prototype.onEnd=function(f){f===x&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=f,this.msg=this.strm.msg},i.Deflate=d,i.deflate=b,i.deflateRaw=function(f,_){return(_=_||{}).raw=!0,b(f,_)},i.gzip=function(f,_){return(_=_||{}).gzip=!0,b(f,_)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,n,i){"use strict";var a=e("./zlib/inflate"),o=e("./utils/common"),s=e("./utils/strings"),c=e("./zlib/constants"),h=e("./zlib/messages"),w=e("./zlib/zstream"),x=e("./zlib/gzheader"),k=Object.prototype.toString;function l(d){if(!(this instanceof l))return new l(d);this.options=o.assign({chunkSize:16384,windowBits:0,to:""},d||{});var b=this.options;b.raw&&0<=b.windowBits&&b.windowBits<16&&(b.windowBits=-b.windowBits,b.windowBits===0&&(b.windowBits=-15)),!(0<=b.windowBits&&b.windowBits<16)||d&&d.windowBits||(b.windowBits+=32),15<b.windowBits&&b.windowBits<48&&(15&b.windowBits)==0&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new w,this.strm.avail_out=0;var f=a.inflateInit2(this.strm,b.windowBits);if(f!==c.Z_OK)throw new Error(h[f]);this.header=new x,a.inflateGetHeader(this.strm,this.header)}function y(d,b){var f=new l(b);if(f.push(d,!0),f.err)throw f.msg||h[f.err];return f.result}l.prototype.push=function(d,b){var f,_,S,C,I,P,B=this.strm,g=this.options.chunkSize,u=this.options.dictionary,E=!1;if(this.ended)return!1;_=b===~~b?b:b===!0?c.Z_FINISH:c.Z_NO_FLUSH,typeof d=="string"?B.input=s.binstring2buf(d):k.call(d)==="[object ArrayBuffer]"?B.input=new Uint8Array(d):B.input=d,B.next_in=0,B.avail_in=B.input.length;do{if(B.avail_out===0&&(B.output=new o.Buf8(g),B.next_out=0,B.avail_out=g),(f=a.inflate(B,c.Z_NO_FLUSH))===c.Z_NEED_DICT&&u&&(P=typeof u=="string"?s.string2buf(u):k.call(u)==="[object ArrayBuffer]"?new Uint8Array(u):u,f=a.inflateSetDictionary(this.strm,P)),f===c.Z_BUF_ERROR&&E===!0&&(f=c.Z_OK,E=!1),f!==c.Z_STREAM_END&&f!==c.Z_OK)return this.onEnd(f),!(this.ended=!0);B.next_out&&(B.avail_out!==0&&f!==c.Z_STREAM_END&&(B.avail_in!==0||_!==c.Z_FINISH&&_!==c.Z_SYNC_FLUSH)||(this.options.to==="string"?(S=s.utf8border(B.output,B.next_out),C=B.next_out-S,I=s.buf2string(B.output,S),B.next_out=C,B.avail_out=g-C,C&&o.arraySet(B.output,B.output,S,C,0),this.onData(I)):this.onData(o.shrinkBuf(B.output,B.next_out)))),B.avail_in===0&&B.avail_out===0&&(E=!0)}while((0<B.avail_in||B.avail_out===0)&&f!==c.Z_STREAM_END);return f===c.Z_STREAM_END&&(_=c.Z_FINISH),_===c.Z_FINISH?(f=a.inflateEnd(this.strm),this.onEnd(f),this.ended=!0,f===c.Z_OK):_!==c.Z_SYNC_FLUSH||(this.onEnd(c.Z_OK),!(B.avail_out=0))},l.prototype.onData=function(d){this.chunks.push(d)},l.prototype.onEnd=function(d){d===c.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=d,this.msg=this.strm.msg},i.Inflate=l,i.inflate=y,i.inflateRaw=function(d,b){return(b=b||{}).raw=!0,y(d,b)},i.ungzip=y},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,n,i){"use strict";var a=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";i.assign=function(c){for(var h=Array.prototype.slice.call(arguments,1);h.length;){var w=h.shift();if(w){if(typeof w!="object")throw new TypeError(w+"must be non-object");for(var x in w)w.hasOwnProperty(x)&&(c[x]=w[x])}}return c},i.shrinkBuf=function(c,h){return c.length===h?c:c.subarray?c.subarray(0,h):(c.length=h,c)};var o={arraySet:function(c,h,w,x,k){if(h.subarray&&c.subarray)c.set(h.subarray(w,w+x),k);else for(var l=0;l<x;l++)c[k+l]=h[w+l]},flattenChunks:function(c){var h,w,x,k,l,y;for(h=x=0,w=c.length;h<w;h++)x+=c[h].length;for(y=new Uint8Array(x),h=k=0,w=c.length;h<w;h++)l=c[h],y.set(l,k),k+=l.length;return y}},s={arraySet:function(c,h,w,x,k){for(var l=0;l<x;l++)c[k+l]=h[w+l]},flattenChunks:function(c){return[].concat.apply([],c)}};i.setTyped=function(c){c?(i.Buf8=Uint8Array,i.Buf16=Uint16Array,i.Buf32=Int32Array,i.assign(i,o)):(i.Buf8=Array,i.Buf16=Array,i.Buf32=Array,i.assign(i,s))},i.setTyped(a)},{}],42:[function(e,n,i){"use strict";var a=e("./common"),o=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch{o=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{s=!1}for(var c=new a.Buf8(256),h=0;h<256;h++)c[h]=252<=h?6:248<=h?5:240<=h?4:224<=h?3:192<=h?2:1;function w(x,k){if(k<65537&&(x.subarray&&s||!x.subarray&&o))return String.fromCharCode.apply(null,a.shrinkBuf(x,k));for(var l="",y=0;y<k;y++)l+=String.fromCharCode(x[y]);return l}c[254]=c[254]=1,i.string2buf=function(x){var k,l,y,d,b,f=x.length,_=0;for(d=0;d<f;d++)(64512&(l=x.charCodeAt(d)))==55296&&d+1<f&&(64512&(y=x.charCodeAt(d+1)))==56320&&(l=65536+(l-55296<<10)+(y-56320),d++),_+=l<128?1:l<2048?2:l<65536?3:4;for(k=new a.Buf8(_),d=b=0;b<_;d++)(64512&(l=x.charCodeAt(d)))==55296&&d+1<f&&(64512&(y=x.charCodeAt(d+1)))==56320&&(l=65536+(l-55296<<10)+(y-56320),d++),l<128?k[b++]=l:(l<2048?k[b++]=192|l>>>6:(l<65536?k[b++]=224|l>>>12:(k[b++]=240|l>>>18,k[b++]=128|l>>>12&63),k[b++]=128|l>>>6&63),k[b++]=128|63&l);return k},i.buf2binstring=function(x){return w(x,x.length)},i.binstring2buf=function(x){for(var k=new a.Buf8(x.length),l=0,y=k.length;l<y;l++)k[l]=x.charCodeAt(l);return k},i.buf2string=function(x,k){var l,y,d,b,f=k||x.length,_=new Array(2*f);for(l=y=0;l<f;)if((d=x[l++])<128)_[y++]=d;else if(4<(b=c[d]))_[y++]=65533,l+=b-1;else{for(d&=b===2?31:b===3?15:7;1<b&&l<f;)d=d<<6|63&x[l++],b--;1<b?_[y++]=65533:d<65536?_[y++]=d:(d-=65536,_[y++]=55296|d>>10&1023,_[y++]=56320|1023&d)}return w(_,y)},i.utf8border=function(x,k){var l;for((k=k||x.length)>x.length&&(k=x.length),l=k-1;0<=l&&(192&x[l])==128;)l--;return l<0||l===0?k:l+c[x[l]]>k?l:k}},{"./common":41}],43:[function(e,n,i){"use strict";n.exports=function(a,o,s,c){for(var h=65535&a|0,w=a>>>16&65535|0,x=0;s!==0;){for(s-=x=2e3<s?2e3:s;w=w+(h=h+o[c++]|0)|0,--x;);h%=65521,w%=65521}return h|w<<16|0}},{}],44:[function(e,n,i){"use strict";n.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,n,i){"use strict";var a=function(){for(var o,s=[],c=0;c<256;c++){o=c;for(var h=0;h<8;h++)o=1&o?3988292384^o>>>1:o>>>1;s[c]=o}return s}();n.exports=function(o,s,c,h){var w=a,x=h+c;o^=-1;for(var k=h;k<x;k++)o=o>>>8^w[255&(o^s[k])];return-1^o}},{}],46:[function(e,n,i){"use strict";var a,o=e("../utils/common"),s=e("./trees"),c=e("./adler32"),h=e("./crc32"),w=e("./messages"),x=0,k=4,l=0,y=-2,d=-1,b=4,f=2,_=8,S=9,C=286,I=30,P=19,B=2*C+1,g=15,u=3,E=258,M=E+u+1,m=42,O=113,r=1,U=2,te=3,j=4;function Q(t,N){return t.msg=w[N],N}function D(t){return(t<<1)-(4<t?9:0)}function J(t){for(var N=t.length;0<=--N;)t[N]=0}function z(t){var N=t.state,T=N.pending;T>t.avail_out&&(T=t.avail_out),T!==0&&(o.arraySet(t.output,N.pending_buf,N.pending_out,T,t.next_out),t.next_out+=T,N.pending_out+=T,t.total_out+=T,t.avail_out-=T,N.pending-=T,N.pending===0&&(N.pending_out=0))}function L(t,N){s._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,N),t.block_start=t.strstart,z(t.strm)}function W(t,N){t.pending_buf[t.pending++]=N}function G(t,N){t.pending_buf[t.pending++]=N>>>8&255,t.pending_buf[t.pending++]=255&N}function V(t,N){var T,v,p=t.max_chain_length,A=t.strstart,F=t.prev_length,H=t.nice_match,R=t.strstart>t.w_size-M?t.strstart-(t.w_size-M):0,Y=t.window,$=t.w_mask,Z=t.prev,q=t.strstart+E,se=Y[A+F-1],re=Y[A+F];t.prev_length>=t.good_match&&(p>>=2),H>t.lookahead&&(H=t.lookahead);do if(Y[(T=N)+F]===re&&Y[T+F-1]===se&&Y[T]===Y[A]&&Y[++T]===Y[A+1]){A+=2,T++;do;while(Y[++A]===Y[++T]&&Y[++A]===Y[++T]&&Y[++A]===Y[++T]&&Y[++A]===Y[++T]&&Y[++A]===Y[++T]&&Y[++A]===Y[++T]&&Y[++A]===Y[++T]&&Y[++A]===Y[++T]&&A<q);if(v=E-(q-A),A=q-E,F<v){if(t.match_start=N,H<=(F=v))break;se=Y[A+F-1],re=Y[A+F]}}while((N=Z[N&$])>R&&--p!=0);return F<=t.lookahead?F:t.lookahead}function ie(t){var N,T,v,p,A,F,H,R,Y,$,Z=t.w_size;do{if(p=t.window_size-t.lookahead-t.strstart,t.strstart>=Z+(Z-M)){for(o.arraySet(t.window,t.window,Z,Z,0),t.match_start-=Z,t.strstart-=Z,t.block_start-=Z,N=T=t.hash_size;v=t.head[--N],t.head[N]=Z<=v?v-Z:0,--T;);for(N=T=Z;v=t.prev[--N],t.prev[N]=Z<=v?v-Z:0,--T;);p+=Z}if(t.strm.avail_in===0)break;if(F=t.strm,H=t.window,R=t.strstart+t.lookahead,Y=p,$=void 0,$=F.avail_in,Y<$&&($=Y),T=$===0?0:(F.avail_in-=$,o.arraySet(H,F.input,F.next_in,$,R),F.state.wrap===1?F.adler=c(F.adler,H,$,R):F.state.wrap===2&&(F.adler=h(F.adler,H,$,R)),F.next_in+=$,F.total_in+=$,$),t.lookahead+=T,t.lookahead+t.insert>=u)for(A=t.strstart-t.insert,t.ins_h=t.window[A],t.ins_h=(t.ins_h<<t.hash_shift^t.window[A+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[A+u-1])&t.hash_mask,t.prev[A&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=A,A++,t.insert--,!(t.lookahead+t.insert<u)););}while(t.lookahead<M&&t.strm.avail_in!==0)}function le(t,N){for(var T,v;;){if(t.lookahead<M){if(ie(t),t.lookahead<M&&N===x)return r;if(t.lookahead===0)break}if(T=0,t.lookahead>=u&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+u-1])&t.hash_mask,T=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),T!==0&&t.strstart-T<=t.w_size-M&&(t.match_length=V(t,T)),t.match_length>=u)if(v=s._tr_tally(t,t.strstart-t.match_start,t.match_length-u),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=u){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+u-1])&t.hash_mask,T=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,--t.match_length!=0;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else v=s._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(v&&(L(t,!1),t.strm.avail_out===0))return r}return t.insert=t.strstart<u-1?t.strstart:u-1,N===k?(L(t,!0),t.strm.avail_out===0?te:j):t.last_lit&&(L(t,!1),t.strm.avail_out===0)?r:U}function K(t,N){for(var T,v,p;;){if(t.lookahead<M){if(ie(t),t.lookahead<M&&N===x)return r;if(t.lookahead===0)break}if(T=0,t.lookahead>=u&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+u-1])&t.hash_mask,T=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=u-1,T!==0&&t.prev_length<t.max_lazy_match&&t.strstart-T<=t.w_size-M&&(t.match_length=V(t,T),t.match_length<=5&&(t.strategy===1||t.match_length===u&&4096<t.strstart-t.match_start)&&(t.match_length=u-1)),t.prev_length>=u&&t.match_length<=t.prev_length){for(p=t.strstart+t.lookahead-u,v=s._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-u),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=p&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+u-1])&t.hash_mask,T=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),--t.prev_length!=0;);if(t.match_available=0,t.match_length=u-1,t.strstart++,v&&(L(t,!1),t.strm.avail_out===0))return r}else if(t.match_available){if((v=s._tr_tally(t,0,t.window[t.strstart-1]))&&L(t,!1),t.strstart++,t.lookahead--,t.strm.avail_out===0)return r}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(v=s._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<u-1?t.strstart:u-1,N===k?(L(t,!0),t.strm.avail_out===0?te:j):t.last_lit&&(L(t,!1),t.strm.avail_out===0)?r:U}function X(t,N,T,v,p){this.good_length=t,this.max_lazy=N,this.nice_length=T,this.max_chain=v,this.func=p}function ne(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=_,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new o.Buf16(2*B),this.dyn_dtree=new o.Buf16(2*(2*I+1)),this.bl_tree=new o.Buf16(2*(2*P+1)),J(this.dyn_ltree),J(this.dyn_dtree),J(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new o.Buf16(g+1),this.heap=new o.Buf16(2*C+1),J(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new o.Buf16(2*C+1),J(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function ee(t){var N;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=f,(N=t.state).pending=0,N.pending_out=0,N.wrap<0&&(N.wrap=-N.wrap),N.status=N.wrap?m:O,t.adler=N.wrap===2?0:1,N.last_flush=x,s._tr_init(N),l):Q(t,y)}function ae(t){var N=ee(t);return N===l&&function(T){T.window_size=2*T.w_size,J(T.head),T.max_lazy_match=a[T.level].max_lazy,T.good_match=a[T.level].good_length,T.nice_match=a[T.level].nice_length,T.max_chain_length=a[T.level].max_chain,T.strstart=0,T.block_start=0,T.lookahead=0,T.insert=0,T.match_length=T.prev_length=u-1,T.match_available=0,T.ins_h=0}(t.state),N}function oe(t,N,T,v,p,A){if(!t)return y;var F=1;if(N===d&&(N=6),v<0?(F=0,v=-v):15<v&&(F=2,v-=16),p<1||S<p||T!==_||v<8||15<v||N<0||9<N||A<0||b<A)return Q(t,y);v===8&&(v=9);var H=new ne;return(t.state=H).strm=t,H.wrap=F,H.gzhead=null,H.w_bits=v,H.w_size=1<<H.w_bits,H.w_mask=H.w_size-1,H.hash_bits=p+7,H.hash_size=1<<H.hash_bits,H.hash_mask=H.hash_size-1,H.hash_shift=~~((H.hash_bits+u-1)/u),H.window=new o.Buf8(2*H.w_size),H.head=new o.Buf16(H.hash_size),H.prev=new o.Buf16(H.w_size),H.lit_bufsize=1<<p+6,H.pending_buf_size=4*H.lit_bufsize,H.pending_buf=new o.Buf8(H.pending_buf_size),H.d_buf=1*H.lit_bufsize,H.l_buf=3*H.lit_bufsize,H.level=N,H.strategy=A,H.method=T,ae(t)}a=[new X(0,0,0,0,function(t,N){var T=65535;for(T>t.pending_buf_size-5&&(T=t.pending_buf_size-5);;){if(t.lookahead<=1){if(ie(t),t.lookahead===0&&N===x)return r;if(t.lookahead===0)break}t.strstart+=t.lookahead,t.lookahead=0;var v=t.block_start+T;if((t.strstart===0||t.strstart>=v)&&(t.lookahead=t.strstart-v,t.strstart=v,L(t,!1),t.strm.avail_out===0)||t.strstart-t.block_start>=t.w_size-M&&(L(t,!1),t.strm.avail_out===0))return r}return t.insert=0,N===k?(L(t,!0),t.strm.avail_out===0?te:j):(t.strstart>t.block_start&&(L(t,!1),t.strm.avail_out),r)}),new X(4,4,8,4,le),new X(4,5,16,8,le),new X(4,6,32,32,le),new X(4,4,16,16,K),new X(8,16,32,32,K),new X(8,16,128,128,K),new X(8,32,128,256,K),new X(32,128,258,1024,K),new X(32,258,258,4096,K)],i.deflateInit=function(t,N){return oe(t,N,_,15,8,0)},i.deflateInit2=oe,i.deflateReset=ae,i.deflateResetKeep=ee,i.deflateSetHeader=function(t,N){return t&&t.state?t.state.wrap!==2?y:(t.state.gzhead=N,l):y},i.deflate=function(t,N){var T,v,p,A;if(!t||!t.state||5<N||N<0)return t?Q(t,y):y;if(v=t.state,!t.output||!t.input&&t.avail_in!==0||v.status===666&&N!==k)return Q(t,t.avail_out===0?-5:y);if(v.strm=t,T=v.last_flush,v.last_flush=N,v.status===m)if(v.wrap===2)t.adler=0,W(v,31),W(v,139),W(v,8),v.gzhead?(W(v,(v.gzhead.text?1:0)+(v.gzhead.hcrc?2:0)+(v.gzhead.extra?4:0)+(v.gzhead.name?8:0)+(v.gzhead.comment?16:0)),W(v,255&v.gzhead.time),W(v,v.gzhead.time>>8&255),W(v,v.gzhead.time>>16&255),W(v,v.gzhead.time>>24&255),W(v,v.level===9?2:2<=v.strategy||v.level<2?4:0),W(v,255&v.gzhead.os),v.gzhead.extra&&v.gzhead.extra.length&&(W(v,255&v.gzhead.extra.length),W(v,v.gzhead.extra.length>>8&255)),v.gzhead.hcrc&&(t.adler=h(t.adler,v.pending_buf,v.pending,0)),v.gzindex=0,v.status=69):(W(v,0),W(v,0),W(v,0),W(v,0),W(v,0),W(v,v.level===9?2:2<=v.strategy||v.level<2?4:0),W(v,3),v.status=O);else{var F=_+(v.w_bits-8<<4)<<8;F|=(2<=v.strategy||v.level<2?0:v.level<6?1:v.level===6?2:3)<<6,v.strstart!==0&&(F|=32),F+=31-F%31,v.status=O,G(v,F),v.strstart!==0&&(G(v,t.adler>>>16),G(v,65535&t.adler)),t.adler=1}if(v.status===69)if(v.gzhead.extra){for(p=v.pending;v.gzindex<(65535&v.gzhead.extra.length)&&(v.pending!==v.pending_buf_size||(v.gzhead.hcrc&&v.pending>p&&(t.adler=h(t.adler,v.pending_buf,v.pending-p,p)),z(t),p=v.pending,v.pending!==v.pending_buf_size));)W(v,255&v.gzhead.extra[v.gzindex]),v.gzindex++;v.gzhead.hcrc&&v.pending>p&&(t.adler=h(t.adler,v.pending_buf,v.pending-p,p)),v.gzindex===v.gzhead.extra.length&&(v.gzindex=0,v.status=73)}else v.status=73;if(v.status===73)if(v.gzhead.name){p=v.pending;do{if(v.pending===v.pending_buf_size&&(v.gzhead.hcrc&&v.pending>p&&(t.adler=h(t.adler,v.pending_buf,v.pending-p,p)),z(t),p=v.pending,v.pending===v.pending_buf_size)){A=1;break}A=v.gzindex<v.gzhead.name.length?255&v.gzhead.name.charCodeAt(v.gzindex++):0,W(v,A)}while(A!==0);v.gzhead.hcrc&&v.pending>p&&(t.adler=h(t.adler,v.pending_buf,v.pending-p,p)),A===0&&(v.gzindex=0,v.status=91)}else v.status=91;if(v.status===91)if(v.gzhead.comment){p=v.pending;do{if(v.pending===v.pending_buf_size&&(v.gzhead.hcrc&&v.pending>p&&(t.adler=h(t.adler,v.pending_buf,v.pending-p,p)),z(t),p=v.pending,v.pending===v.pending_buf_size)){A=1;break}A=v.gzindex<v.gzhead.comment.length?255&v.gzhead.comment.charCodeAt(v.gzindex++):0,W(v,A)}while(A!==0);v.gzhead.hcrc&&v.pending>p&&(t.adler=h(t.adler,v.pending_buf,v.pending-p,p)),A===0&&(v.status=103)}else v.status=103;if(v.status===103&&(v.gzhead.hcrc?(v.pending+2>v.pending_buf_size&&z(t),v.pending+2<=v.pending_buf_size&&(W(v,255&t.adler),W(v,t.adler>>8&255),t.adler=0,v.status=O)):v.status=O),v.pending!==0){if(z(t),t.avail_out===0)return v.last_flush=-1,l}else if(t.avail_in===0&&D(N)<=D(T)&&N!==k)return Q(t,-5);if(v.status===666&&t.avail_in!==0)return Q(t,-5);if(t.avail_in!==0||v.lookahead!==0||N!==x&&v.status!==666){var H=v.strategy===2?function(R,Y){for(var $;;){if(R.lookahead===0&&(ie(R),R.lookahead===0)){if(Y===x)return r;break}if(R.match_length=0,$=s._tr_tally(R,0,R.window[R.strstart]),R.lookahead--,R.strstart++,$&&(L(R,!1),R.strm.avail_out===0))return r}return R.insert=0,Y===k?(L(R,!0),R.strm.avail_out===0?te:j):R.last_lit&&(L(R,!1),R.strm.avail_out===0)?r:U}(v,N):v.strategy===3?function(R,Y){for(var $,Z,q,se,re=R.window;;){if(R.lookahead<=E){if(ie(R),R.lookahead<=E&&Y===x)return r;if(R.lookahead===0)break}if(R.match_length=0,R.lookahead>=u&&0<R.strstart&&(Z=re[q=R.strstart-1])===re[++q]&&Z===re[++q]&&Z===re[++q]){se=R.strstart+E;do;while(Z===re[++q]&&Z===re[++q]&&Z===re[++q]&&Z===re[++q]&&Z===re[++q]&&Z===re[++q]&&Z===re[++q]&&Z===re[++q]&&q<se);R.match_length=E-(se-q),R.match_length>R.lookahead&&(R.match_length=R.lookahead)}if(R.match_length>=u?($=s._tr_tally(R,1,R.match_length-u),R.lookahead-=R.match_length,R.strstart+=R.match_length,R.match_length=0):($=s._tr_tally(R,0,R.window[R.strstart]),R.lookahead--,R.strstart++),$&&(L(R,!1),R.strm.avail_out===0))return r}return R.insert=0,Y===k?(L(R,!0),R.strm.avail_out===0?te:j):R.last_lit&&(L(R,!1),R.strm.avail_out===0)?r:U}(v,N):a[v.level].func(v,N);if(H!==te&&H!==j||(v.status=666),H===r||H===te)return t.avail_out===0&&(v.last_flush=-1),l;if(H===U&&(N===1?s._tr_align(v):N!==5&&(s._tr_stored_block(v,0,0,!1),N===3&&(J(v.head),v.lookahead===0&&(v.strstart=0,v.block_start=0,v.insert=0))),z(t),t.avail_out===0))return v.last_flush=-1,l}return N!==k?l:v.wrap<=0?1:(v.wrap===2?(W(v,255&t.adler),W(v,t.adler>>8&255),W(v,t.adler>>16&255),W(v,t.adler>>24&255),W(v,255&t.total_in),W(v,t.total_in>>8&255),W(v,t.total_in>>16&255),W(v,t.total_in>>24&255)):(G(v,t.adler>>>16),G(v,65535&t.adler)),z(t),0<v.wrap&&(v.wrap=-v.wrap),v.pending!==0?l:1)},i.deflateEnd=function(t){var N;return t&&t.state?(N=t.state.status)!==m&&N!==69&&N!==73&&N!==91&&N!==103&&N!==O&&N!==666?Q(t,y):(t.state=null,N===O?Q(t,-3):l):y},i.deflateSetDictionary=function(t,N){var T,v,p,A,F,H,R,Y,$=N.length;if(!t||!t.state||(A=(T=t.state).wrap)===2||A===1&&T.status!==m||T.lookahead)return y;for(A===1&&(t.adler=c(t.adler,N,$,0)),T.wrap=0,$>=T.w_size&&(A===0&&(J(T.head),T.strstart=0,T.block_start=0,T.insert=0),Y=new o.Buf8(T.w_size),o.arraySet(Y,N,$-T.w_size,T.w_size,0),N=Y,$=T.w_size),F=t.avail_in,H=t.next_in,R=t.input,t.avail_in=$,t.next_in=0,t.input=N,ie(T);T.lookahead>=u;){for(v=T.strstart,p=T.lookahead-(u-1);T.ins_h=(T.ins_h<<T.hash_shift^T.window[v+u-1])&T.hash_mask,T.prev[v&T.w_mask]=T.head[T.ins_h],T.head[T.ins_h]=v,v++,--p;);T.strstart=v,T.lookahead=u-1,ie(T)}return T.strstart+=T.lookahead,T.block_start=T.strstart,T.insert=T.lookahead,T.lookahead=0,T.match_length=T.prev_length=u-1,T.match_available=0,t.next_in=H,t.input=R,t.avail_in=F,T.wrap=A,l},i.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,n,i){"use strict";n.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,n,i){"use strict";n.exports=function(a,o){var s,c,h,w,x,k,l,y,d,b,f,_,S,C,I,P,B,g,u,E,M,m,O,r,U;s=a.state,c=a.next_in,r=a.input,h=c+(a.avail_in-5),w=a.next_out,U=a.output,x=w-(o-a.avail_out),k=w+(a.avail_out-257),l=s.dmax,y=s.wsize,d=s.whave,b=s.wnext,f=s.window,_=s.hold,S=s.bits,C=s.lencode,I=s.distcode,P=(1<<s.lenbits)-1,B=(1<<s.distbits)-1;e:do{S<15&&(_+=r[c++]<<S,S+=8,_+=r[c++]<<S,S+=8),g=C[_&P];t:for(;;){if(_>>>=u=g>>>24,S-=u,(u=g>>>16&255)===0)U[w++]=65535&g;else{if(!(16&u)){if((64&u)==0){g=C[(65535&g)+(_&(1<<u)-1)];continue t}if(32&u){s.mode=12;break e}a.msg="invalid literal/length code",s.mode=30;break e}E=65535&g,(u&=15)&&(S<u&&(_+=r[c++]<<S,S+=8),E+=_&(1<<u)-1,_>>>=u,S-=u),S<15&&(_+=r[c++]<<S,S+=8,_+=r[c++]<<S,S+=8),g=I[_&B];r:for(;;){if(_>>>=u=g>>>24,S-=u,!(16&(u=g>>>16&255))){if((64&u)==0){g=I[(65535&g)+(_&(1<<u)-1)];continue r}a.msg="invalid distance code",s.mode=30;break e}if(M=65535&g,S<(u&=15)&&(_+=r[c++]<<S,(S+=8)<u&&(_+=r[c++]<<S,S+=8)),l<(M+=_&(1<<u)-1)){a.msg="invalid distance too far back",s.mode=30;break e}if(_>>>=u,S-=u,(u=w-x)<M){if(d<(u=M-u)&&s.sane){a.msg="invalid distance too far back",s.mode=30;break e}if(O=f,(m=0)===b){if(m+=y-u,u<E){for(E-=u;U[w++]=f[m++],--u;);m=w-M,O=U}}else if(b<u){if(m+=y+b-u,(u-=b)<E){for(E-=u;U[w++]=f[m++],--u;);if(m=0,b<E){for(E-=u=b;U[w++]=f[m++],--u;);m=w-M,O=U}}}else if(m+=b-u,u<E){for(E-=u;U[w++]=f[m++],--u;);m=w-M,O=U}for(;2<E;)U[w++]=O[m++],U[w++]=O[m++],U[w++]=O[m++],E-=3;E&&(U[w++]=O[m++],1<E&&(U[w++]=O[m++]))}else{for(m=w-M;U[w++]=U[m++],U[w++]=U[m++],U[w++]=U[m++],2<(E-=3););E&&(U[w++]=U[m++],1<E&&(U[w++]=U[m++]))}break}}break}}while(c<h&&w<k);c-=E=S>>3,_&=(1<<(S-=E<<3))-1,a.next_in=c,a.next_out=w,a.avail_in=c<h?h-c+5:5-(c-h),a.avail_out=w<k?k-w+257:257-(w-k),s.hold=_,s.bits=S}},{}],49:[function(e,n,i){"use strict";var a=e("../utils/common"),o=e("./adler32"),s=e("./crc32"),c=e("./inffast"),h=e("./inftrees"),w=1,x=2,k=0,l=-2,y=1,d=852,b=592;function f(m){return(m>>>24&255)+(m>>>8&65280)+((65280&m)<<8)+((255&m)<<24)}function _(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new a.Buf16(320),this.work=new a.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function S(m){var O;return m&&m.state?(O=m.state,m.total_in=m.total_out=O.total=0,m.msg="",O.wrap&&(m.adler=1&O.wrap),O.mode=y,O.last=0,O.havedict=0,O.dmax=32768,O.head=null,O.hold=0,O.bits=0,O.lencode=O.lendyn=new a.Buf32(d),O.distcode=O.distdyn=new a.Buf32(b),O.sane=1,O.back=-1,k):l}function C(m){var O;return m&&m.state?((O=m.state).wsize=0,O.whave=0,O.wnext=0,S(m)):l}function I(m,O){var r,U;return m&&m.state?(U=m.state,O<0?(r=0,O=-O):(r=1+(O>>4),O<48&&(O&=15)),O&&(O<8||15<O)?l:(U.window!==null&&U.wbits!==O&&(U.window=null),U.wrap=r,U.wbits=O,C(m))):l}function P(m,O){var r,U;return m?(U=new _,(m.state=U).window=null,(r=I(m,O))!==k&&(m.state=null),r):l}var B,g,u=!0;function E(m){if(u){var O;for(B=new a.Buf32(512),g=new a.Buf32(32),O=0;O<144;)m.lens[O++]=8;for(;O<256;)m.lens[O++]=9;for(;O<280;)m.lens[O++]=7;for(;O<288;)m.lens[O++]=8;for(h(w,m.lens,0,288,B,0,m.work,{bits:9}),O=0;O<32;)m.lens[O++]=5;h(x,m.lens,0,32,g,0,m.work,{bits:5}),u=!1}m.lencode=B,m.lenbits=9,m.distcode=g,m.distbits=5}function M(m,O,r,U){var te,j=m.state;return j.window===null&&(j.wsize=1<<j.wbits,j.wnext=0,j.whave=0,j.window=new a.Buf8(j.wsize)),U>=j.wsize?(a.arraySet(j.window,O,r-j.wsize,j.wsize,0),j.wnext=0,j.whave=j.wsize):(U<(te=j.wsize-j.wnext)&&(te=U),a.arraySet(j.window,O,r-U,te,j.wnext),(U-=te)?(a.arraySet(j.window,O,r-U,U,0),j.wnext=U,j.whave=j.wsize):(j.wnext+=te,j.wnext===j.wsize&&(j.wnext=0),j.whave<j.wsize&&(j.whave+=te))),0}i.inflateReset=C,i.inflateReset2=I,i.inflateResetKeep=S,i.inflateInit=function(m){return P(m,15)},i.inflateInit2=P,i.inflate=function(m,O){var r,U,te,j,Q,D,J,z,L,W,G,V,ie,le,K,X,ne,ee,ae,oe,t,N,T,v,p=0,A=new a.Buf8(4),F=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!m||!m.state||!m.output||!m.input&&m.avail_in!==0)return l;(r=m.state).mode===12&&(r.mode=13),Q=m.next_out,te=m.output,J=m.avail_out,j=m.next_in,U=m.input,D=m.avail_in,z=r.hold,L=r.bits,W=D,G=J,N=k;e:for(;;)switch(r.mode){case y:if(r.wrap===0){r.mode=13;break}for(;L<16;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}if(2&r.wrap&&z===35615){A[r.check=0]=255&z,A[1]=z>>>8&255,r.check=s(r.check,A,2,0),L=z=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&z)<<8)+(z>>8))%31){m.msg="incorrect header check",r.mode=30;break}if((15&z)!=8){m.msg="unknown compression method",r.mode=30;break}if(L-=4,t=8+(15&(z>>>=4)),r.wbits===0)r.wbits=t;else if(t>r.wbits){m.msg="invalid window size",r.mode=30;break}r.dmax=1<<t,m.adler=r.check=1,r.mode=512&z?10:12,L=z=0;break;case 2:for(;L<16;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}if(r.flags=z,(255&r.flags)!=8){m.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){m.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=z>>8&1),512&r.flags&&(A[0]=255&z,A[1]=z>>>8&255,r.check=s(r.check,A,2,0)),L=z=0,r.mode=3;case 3:for(;L<32;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}r.head&&(r.head.time=z),512&r.flags&&(A[0]=255&z,A[1]=z>>>8&255,A[2]=z>>>16&255,A[3]=z>>>24&255,r.check=s(r.check,A,4,0)),L=z=0,r.mode=4;case 4:for(;L<16;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}r.head&&(r.head.xflags=255&z,r.head.os=z>>8),512&r.flags&&(A[0]=255&z,A[1]=z>>>8&255,r.check=s(r.check,A,2,0)),L=z=0,r.mode=5;case 5:if(1024&r.flags){for(;L<16;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}r.length=z,r.head&&(r.head.extra_len=z),512&r.flags&&(A[0]=255&z,A[1]=z>>>8&255,r.check=s(r.check,A,2,0)),L=z=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(D<(V=r.length)&&(V=D),V&&(r.head&&(t=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),a.arraySet(r.head.extra,U,j,V,t)),512&r.flags&&(r.check=s(r.check,U,V,j)),D-=V,j+=V,r.length-=V),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(D===0)break e;for(V=0;t=U[j+V++],r.head&&t&&r.length<65536&&(r.head.name+=String.fromCharCode(t)),t&&V<D;);if(512&r.flags&&(r.check=s(r.check,U,V,j)),D-=V,j+=V,t)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(D===0)break e;for(V=0;t=U[j+V++],r.head&&t&&r.length<65536&&(r.head.comment+=String.fromCharCode(t)),t&&V<D;);if(512&r.flags&&(r.check=s(r.check,U,V,j)),D-=V,j+=V,t)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;L<16;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}if(z!==(65535&r.check)){m.msg="header crc mismatch",r.mode=30;break}L=z=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),m.adler=r.check=0,r.mode=12;break;case 10:for(;L<32;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}m.adler=r.check=f(z),L=z=0,r.mode=11;case 11:if(r.havedict===0)return m.next_out=Q,m.avail_out=J,m.next_in=j,m.avail_in=D,r.hold=z,r.bits=L,2;m.adler=r.check=1,r.mode=12;case 12:if(O===5||O===6)break e;case 13:if(r.last){z>>>=7&L,L-=7&L,r.mode=27;break}for(;L<3;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}switch(r.last=1&z,L-=1,3&(z>>>=1)){case 0:r.mode=14;break;case 1:if(E(r),r.mode=20,O!==6)break;z>>>=2,L-=2;break e;case 2:r.mode=17;break;case 3:m.msg="invalid block type",r.mode=30}z>>>=2,L-=2;break;case 14:for(z>>>=7&L,L-=7&L;L<32;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}if((65535&z)!=(z>>>16^65535)){m.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&z,L=z=0,r.mode=15,O===6)break e;case 15:r.mode=16;case 16:if(V=r.length){if(D<V&&(V=D),J<V&&(V=J),V===0)break e;a.arraySet(te,U,j,V,Q),D-=V,j+=V,J-=V,Q+=V,r.length-=V;break}r.mode=12;break;case 17:for(;L<14;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}if(r.nlen=257+(31&z),z>>>=5,L-=5,r.ndist=1+(31&z),z>>>=5,L-=5,r.ncode=4+(15&z),z>>>=4,L-=4,286<r.nlen||30<r.ndist){m.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;L<3;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}r.lens[F[r.have++]]=7&z,z>>>=3,L-=3}for(;r.have<19;)r.lens[F[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,T={bits:r.lenbits},N=h(0,r.lens,0,19,r.lencode,0,r.work,T),r.lenbits=T.bits,N){m.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;X=(p=r.lencode[z&(1<<r.lenbits)-1])>>>16&255,ne=65535&p,!((K=p>>>24)<=L);){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}if(ne<16)z>>>=K,L-=K,r.lens[r.have++]=ne;else{if(ne===16){for(v=K+2;L<v;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}if(z>>>=K,L-=K,r.have===0){m.msg="invalid bit length repeat",r.mode=30;break}t=r.lens[r.have-1],V=3+(3&z),z>>>=2,L-=2}else if(ne===17){for(v=K+3;L<v;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}L-=K,t=0,V=3+(7&(z>>>=K)),z>>>=3,L-=3}else{for(v=K+7;L<v;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}L-=K,t=0,V=11+(127&(z>>>=K)),z>>>=7,L-=7}if(r.have+V>r.nlen+r.ndist){m.msg="invalid bit length repeat",r.mode=30;break}for(;V--;)r.lens[r.have++]=t}}if(r.mode===30)break;if(r.lens[256]===0){m.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,T={bits:r.lenbits},N=h(w,r.lens,0,r.nlen,r.lencode,0,r.work,T),r.lenbits=T.bits,N){m.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,T={bits:r.distbits},N=h(x,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,T),r.distbits=T.bits,N){m.msg="invalid distances set",r.mode=30;break}if(r.mode=20,O===6)break e;case 20:r.mode=21;case 21:if(6<=D&&258<=J){m.next_out=Q,m.avail_out=J,m.next_in=j,m.avail_in=D,r.hold=z,r.bits=L,c(m,G),Q=m.next_out,te=m.output,J=m.avail_out,j=m.next_in,U=m.input,D=m.avail_in,z=r.hold,L=r.bits,r.mode===12&&(r.back=-1);break}for(r.back=0;X=(p=r.lencode[z&(1<<r.lenbits)-1])>>>16&255,ne=65535&p,!((K=p>>>24)<=L);){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}if(X&&(240&X)==0){for(ee=K,ae=X,oe=ne;X=(p=r.lencode[oe+((z&(1<<ee+ae)-1)>>ee)])>>>16&255,ne=65535&p,!(ee+(K=p>>>24)<=L);){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}z>>>=ee,L-=ee,r.back+=ee}if(z>>>=K,L-=K,r.back+=K,r.length=ne,X===0){r.mode=26;break}if(32&X){r.back=-1,r.mode=12;break}if(64&X){m.msg="invalid literal/length code",r.mode=30;break}r.extra=15&X,r.mode=22;case 22:if(r.extra){for(v=r.extra;L<v;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}r.length+=z&(1<<r.extra)-1,z>>>=r.extra,L-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;X=(p=r.distcode[z&(1<<r.distbits)-1])>>>16&255,ne=65535&p,!((K=p>>>24)<=L);){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}if((240&X)==0){for(ee=K,ae=X,oe=ne;X=(p=r.distcode[oe+((z&(1<<ee+ae)-1)>>ee)])>>>16&255,ne=65535&p,!(ee+(K=p>>>24)<=L);){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}z>>>=ee,L-=ee,r.back+=ee}if(z>>>=K,L-=K,r.back+=K,64&X){m.msg="invalid distance code",r.mode=30;break}r.offset=ne,r.extra=15&X,r.mode=24;case 24:if(r.extra){for(v=r.extra;L<v;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}r.offset+=z&(1<<r.extra)-1,z>>>=r.extra,L-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){m.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(J===0)break e;if(V=G-J,r.offset>V){if((V=r.offset-V)>r.whave&&r.sane){m.msg="invalid distance too far back",r.mode=30;break}ie=V>r.wnext?(V-=r.wnext,r.wsize-V):r.wnext-V,V>r.length&&(V=r.length),le=r.window}else le=te,ie=Q-r.offset,V=r.length;for(J<V&&(V=J),J-=V,r.length-=V;te[Q++]=le[ie++],--V;);r.length===0&&(r.mode=21);break;case 26:if(J===0)break e;te[Q++]=r.length,J--,r.mode=21;break;case 27:if(r.wrap){for(;L<32;){if(D===0)break e;D--,z|=U[j++]<<L,L+=8}if(G-=J,m.total_out+=G,r.total+=G,G&&(m.adler=r.check=r.flags?s(r.check,te,G,Q-G):o(r.check,te,G,Q-G)),G=J,(r.flags?z:f(z))!==r.check){m.msg="incorrect data check",r.mode=30;break}L=z=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;L<32;){if(D===0)break e;D--,z+=U[j++]<<L,L+=8}if(z!==(4294967295&r.total)){m.msg="incorrect length check",r.mode=30;break}L=z=0}r.mode=29;case 29:N=1;break e;case 30:N=-3;break e;case 31:return-4;case 32:default:return l}return m.next_out=Q,m.avail_out=J,m.next_in=j,m.avail_in=D,r.hold=z,r.bits=L,(r.wsize||G!==m.avail_out&&r.mode<30&&(r.mode<27||O!==4))&&M(m,m.output,m.next_out,G-m.avail_out)?(r.mode=31,-4):(W-=m.avail_in,G-=m.avail_out,m.total_in+=W,m.total_out+=G,r.total+=G,r.wrap&&G&&(m.adler=r.check=r.flags?s(r.check,te,G,m.next_out-G):o(r.check,te,G,m.next_out-G)),m.data_type=r.bits+(r.last?64:0)+(r.mode===12?128:0)+(r.mode===20||r.mode===15?256:0),(W==0&&G===0||O===4)&&N===k&&(N=-5),N)},i.inflateEnd=function(m){if(!m||!m.state)return l;var O=m.state;return O.window&&(O.window=null),m.state=null,k},i.inflateGetHeader=function(m,O){var r;return m&&m.state?(2&(r=m.state).wrap)==0?l:((r.head=O).done=!1,k):l},i.inflateSetDictionary=function(m,O){var r,U=O.length;return m&&m.state?(r=m.state).wrap!==0&&r.mode!==11?l:r.mode===11&&o(1,O,U,0)!==r.check?-3:M(m,O,U,U)?(r.mode=31,-4):(r.havedict=1,k):l},i.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,n,i){"use strict";var a=e("../utils/common"),o=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],s=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],c=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],h=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];n.exports=function(w,x,k,l,y,d,b,f){var _,S,C,I,P,B,g,u,E,M=f.bits,m=0,O=0,r=0,U=0,te=0,j=0,Q=0,D=0,J=0,z=0,L=null,W=0,G=new a.Buf16(16),V=new a.Buf16(16),ie=null,le=0;for(m=0;m<=15;m++)G[m]=0;for(O=0;O<l;O++)G[x[k+O]]++;for(te=M,U=15;1<=U&&G[U]===0;U--);if(U<te&&(te=U),U===0)return y[d++]=20971520,y[d++]=20971520,f.bits=1,0;for(r=1;r<U&&G[r]===0;r++);for(te<r&&(te=r),m=D=1;m<=15;m++)if(D<<=1,(D-=G[m])<0)return-1;if(0<D&&(w===0||U!==1))return-1;for(V[1]=0,m=1;m<15;m++)V[m+1]=V[m]+G[m];for(O=0;O<l;O++)x[k+O]!==0&&(b[V[x[k+O]]++]=O);if(B=w===0?(L=ie=b,19):w===1?(L=o,W-=257,ie=s,le-=257,256):(L=c,ie=h,-1),m=r,P=d,Q=O=z=0,C=-1,I=(J=1<<(j=te))-1,w===1&&852<J||w===2&&592<J)return 1;for(;;){for(g=m-Q,E=b[O]<B?(u=0,b[O]):b[O]>B?(u=ie[le+b[O]],L[W+b[O]]):(u=96,0),_=1<<m-Q,r=S=1<<j;y[P+(z>>Q)+(S-=_)]=g<<24|u<<16|E|0,S!==0;);for(_=1<<m-1;z&_;)_>>=1;if(_!==0?(z&=_-1,z+=_):z=0,O++,--G[m]==0){if(m===U)break;m=x[k+b[O]]}if(te<m&&(z&I)!==C){for(Q===0&&(Q=te),P+=r,D=1<<(j=m-Q);j+Q<U&&!((D-=G[j+Q])<=0);)j++,D<<=1;if(J+=1<<j,w===1&&852<J||w===2&&592<J)return 1;y[C=z&I]=te<<24|j<<16|P-d|0}}return z!==0&&(y[P+z]=m-Q<<24|64<<16|0),f.bits=te,0}},{"../utils/common":41}],51:[function(e,n,i){"use strict";n.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,n,i){"use strict";var a=e("../utils/common"),o=0,s=1;function c(p){for(var A=p.length;0<=--A;)p[A]=0}var h=0,w=29,x=256,k=x+1+w,l=30,y=19,d=2*k+1,b=15,f=16,_=7,S=256,C=16,I=17,P=18,B=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],g=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],u=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],E=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],M=new Array(2*(k+2));c(M);var m=new Array(2*l);c(m);var O=new Array(512);c(O);var r=new Array(256);c(r);var U=new Array(w);c(U);var te,j,Q,D=new Array(l);function J(p,A,F,H,R){this.static_tree=p,this.extra_bits=A,this.extra_base=F,this.elems=H,this.max_length=R,this.has_stree=p&&p.length}function z(p,A){this.dyn_tree=p,this.max_code=0,this.stat_desc=A}function L(p){return p<256?O[p]:O[256+(p>>>7)]}function W(p,A){p.pending_buf[p.pending++]=255&A,p.pending_buf[p.pending++]=A>>>8&255}function G(p,A,F){p.bi_valid>f-F?(p.bi_buf|=A<<p.bi_valid&65535,W(p,p.bi_buf),p.bi_buf=A>>f-p.bi_valid,p.bi_valid+=F-f):(p.bi_buf|=A<<p.bi_valid&65535,p.bi_valid+=F)}function V(p,A,F){G(p,F[2*A],F[2*A+1])}function ie(p,A){for(var F=0;F|=1&p,p>>>=1,F<<=1,0<--A;);return F>>>1}function le(p,A,F){var H,R,Y=new Array(b+1),$=0;for(H=1;H<=b;H++)Y[H]=$=$+F[H-1]<<1;for(R=0;R<=A;R++){var Z=p[2*R+1];Z!==0&&(p[2*R]=ie(Y[Z]++,Z))}}function K(p){var A;for(A=0;A<k;A++)p.dyn_ltree[2*A]=0;for(A=0;A<l;A++)p.dyn_dtree[2*A]=0;for(A=0;A<y;A++)p.bl_tree[2*A]=0;p.dyn_ltree[2*S]=1,p.opt_len=p.static_len=0,p.last_lit=p.matches=0}function X(p){8<p.bi_valid?W(p,p.bi_buf):0<p.bi_valid&&(p.pending_buf[p.pending++]=p.bi_buf),p.bi_buf=0,p.bi_valid=0}function ne(p,A,F,H){var R=2*A,Y=2*F;return p[R]<p[Y]||p[R]===p[Y]&&H[A]<=H[F]}function ee(p,A,F){for(var H=p.heap[F],R=F<<1;R<=p.heap_len&&(R<p.heap_len&&ne(A,p.heap[R+1],p.heap[R],p.depth)&&R++,!ne(A,H,p.heap[R],p.depth));)p.heap[F]=p.heap[R],F=R,R<<=1;p.heap[F]=H}function ae(p,A,F){var H,R,Y,$,Z=0;if(p.last_lit!==0)for(;H=p.pending_buf[p.d_buf+2*Z]<<8|p.pending_buf[p.d_buf+2*Z+1],R=p.pending_buf[p.l_buf+Z],Z++,H===0?V(p,R,A):(V(p,(Y=r[R])+x+1,A),($=B[Y])!==0&&G(p,R-=U[Y],$),V(p,Y=L(--H),F),($=g[Y])!==0&&G(p,H-=D[Y],$)),Z<p.last_lit;);V(p,S,A)}function oe(p,A){var F,H,R,Y=A.dyn_tree,$=A.stat_desc.static_tree,Z=A.stat_desc.has_stree,q=A.stat_desc.elems,se=-1;for(p.heap_len=0,p.heap_max=d,F=0;F<q;F++)Y[2*F]!==0?(p.heap[++p.heap_len]=se=F,p.depth[F]=0):Y[2*F+1]=0;for(;p.heap_len<2;)Y[2*(R=p.heap[++p.heap_len]=se<2?++se:0)]=1,p.depth[R]=0,p.opt_len--,Z&&(p.static_len-=$[2*R+1]);for(A.max_code=se,F=p.heap_len>>1;1<=F;F--)ee(p,Y,F);for(R=q;F=p.heap[1],p.heap[1]=p.heap[p.heap_len--],ee(p,Y,1),H=p.heap[1],p.heap[--p.heap_max]=F,p.heap[--p.heap_max]=H,Y[2*R]=Y[2*F]+Y[2*H],p.depth[R]=(p.depth[F]>=p.depth[H]?p.depth[F]:p.depth[H])+1,Y[2*F+1]=Y[2*H+1]=R,p.heap[1]=R++,ee(p,Y,1),2<=p.heap_len;);p.heap[--p.heap_max]=p.heap[1],function(re,me){var ke,pe,ge,de,Ce,Ge,we=me.dyn_tree,xt=me.max_code,Xt=me.stat_desc.static_tree,Qt=me.stat_desc.has_stree,er=me.stat_desc.extra_bits,vt=me.stat_desc.extra_base,Te=me.stat_desc.max_length,Fe=0;for(de=0;de<=b;de++)re.bl_count[de]=0;for(we[2*re.heap[re.heap_max]+1]=0,ke=re.heap_max+1;ke<d;ke++)Te<(de=we[2*we[2*(pe=re.heap[ke])+1]+1]+1)&&(de=Te,Fe++),we[2*pe+1]=de,xt<pe||(re.bl_count[de]++,Ce=0,vt<=pe&&(Ce=er[pe-vt]),Ge=we[2*pe],re.opt_len+=Ge*(de+Ce),Qt&&(re.static_len+=Ge*(Xt[2*pe+1]+Ce)));if(Fe!==0){do{for(de=Te-1;re.bl_count[de]===0;)de--;re.bl_count[de]--,re.bl_count[de+1]+=2,re.bl_count[Te]--,Fe-=2}while(0<Fe);for(de=Te;de!==0;de--)for(pe=re.bl_count[de];pe!==0;)xt<(ge=re.heap[--ke])||(we[2*ge+1]!==de&&(re.opt_len+=(de-we[2*ge+1])*we[2*ge],we[2*ge+1]=de),pe--)}}(p,A),le(Y,se,p.bl_count)}function t(p,A,F){var H,R,Y=-1,$=A[1],Z=0,q=7,se=4;for($===0&&(q=138,se=3),A[2*(F+1)+1]=65535,H=0;H<=F;H++)R=$,$=A[2*(H+1)+1],++Z<q&&R===$||(Z<se?p.bl_tree[2*R]+=Z:R!==0?(R!==Y&&p.bl_tree[2*R]++,p.bl_tree[2*C]++):Z<=10?p.bl_tree[2*I]++:p.bl_tree[2*P]++,Y=R,se=(Z=0)===$?(q=138,3):R===$?(q=6,3):(q=7,4))}function N(p,A,F){var H,R,Y=-1,$=A[1],Z=0,q=7,se=4;for($===0&&(q=138,se=3),H=0;H<=F;H++)if(R=$,$=A[2*(H+1)+1],!(++Z<q&&R===$)){if(Z<se)for(;V(p,R,p.bl_tree),--Z!=0;);else R!==0?(R!==Y&&(V(p,R,p.bl_tree),Z--),V(p,C,p.bl_tree),G(p,Z-3,2)):Z<=10?(V(p,I,p.bl_tree),G(p,Z-3,3)):(V(p,P,p.bl_tree),G(p,Z-11,7));Y=R,se=(Z=0)===$?(q=138,3):R===$?(q=6,3):(q=7,4)}}c(D);var T=!1;function v(p,A,F,H){G(p,(h<<1)+(H?1:0),3),function(R,Y,$,Z){X(R),Z&&(W(R,$),W(R,~$)),a.arraySet(R.pending_buf,R.window,Y,$,R.pending),R.pending+=$}(p,A,F,!0)}i._tr_init=function(p){T||(function(){var A,F,H,R,Y,$=new Array(b+1);for(R=H=0;R<w-1;R++)for(U[R]=H,A=0;A<1<<B[R];A++)r[H++]=R;for(r[H-1]=R,R=Y=0;R<16;R++)for(D[R]=Y,A=0;A<1<<g[R];A++)O[Y++]=R;for(Y>>=7;R<l;R++)for(D[R]=Y<<7,A=0;A<1<<g[R]-7;A++)O[256+Y++]=R;for(F=0;F<=b;F++)$[F]=0;for(A=0;A<=143;)M[2*A+1]=8,A++,$[8]++;for(;A<=255;)M[2*A+1]=9,A++,$[9]++;for(;A<=279;)M[2*A+1]=7,A++,$[7]++;for(;A<=287;)M[2*A+1]=8,A++,$[8]++;for(le(M,k+1,$),A=0;A<l;A++)m[2*A+1]=5,m[2*A]=ie(A,5);te=new J(M,B,x+1,k,b),j=new J(m,g,0,l,b),Q=new J(new Array(0),u,0,y,_)}(),T=!0),p.l_desc=new z(p.dyn_ltree,te),p.d_desc=new z(p.dyn_dtree,j),p.bl_desc=new z(p.bl_tree,Q),p.bi_buf=0,p.bi_valid=0,K(p)},i._tr_stored_block=v,i._tr_flush_block=function(p,A,F,H){var R,Y,$=0;0<p.level?(p.strm.data_type===2&&(p.strm.data_type=function(Z){var q,se=4093624447;for(q=0;q<=31;q++,se>>>=1)if(1&se&&Z.dyn_ltree[2*q]!==0)return o;if(Z.dyn_ltree[18]!==0||Z.dyn_ltree[20]!==0||Z.dyn_ltree[26]!==0)return s;for(q=32;q<x;q++)if(Z.dyn_ltree[2*q]!==0)return s;return o}(p)),oe(p,p.l_desc),oe(p,p.d_desc),$=function(Z){var q;for(t(Z,Z.dyn_ltree,Z.l_desc.max_code),t(Z,Z.dyn_dtree,Z.d_desc.max_code),oe(Z,Z.bl_desc),q=y-1;3<=q&&Z.bl_tree[2*E[q]+1]===0;q--);return Z.opt_len+=3*(q+1)+5+5+4,q}(p),R=p.opt_len+3+7>>>3,(Y=p.static_len+3+7>>>3)<=R&&(R=Y)):R=Y=F+5,F+4<=R&&A!==-1?v(p,A,F,H):p.strategy===4||Y===R?(G(p,2+(H?1:0),3),ae(p,M,m)):(G(p,4+(H?1:0),3),function(Z,q,se,re){var me;for(G(Z,q-257,5),G(Z,se-1,5),G(Z,re-4,4),me=0;me<re;me++)G(Z,Z.bl_tree[2*E[me]+1],3);N(Z,Z.dyn_ltree,q-1),N(Z,Z.dyn_dtree,se-1)}(p,p.l_desc.max_code+1,p.d_desc.max_code+1,$+1),ae(p,p.dyn_ltree,p.dyn_dtree)),K(p),H&&X(p)},i._tr_tally=function(p,A,F){return p.pending_buf[p.d_buf+2*p.last_lit]=A>>>8&255,p.pending_buf[p.d_buf+2*p.last_lit+1]=255&A,p.pending_buf[p.l_buf+p.last_lit]=255&F,p.last_lit++,A===0?p.dyn_ltree[2*F]++:(p.matches++,A--,p.dyn_ltree[2*(r[F]+x+1)]++,p.dyn_dtree[2*L(A)]++),p.last_lit===p.lit_bufsize-1},i._tr_align=function(p){G(p,2,3),V(p,S,M),function(A){A.bi_valid===16?(W(A,A.bi_buf),A.bi_buf=0,A.bi_valid=0):8<=A.bi_valid&&(A.pending_buf[A.pending++]=255&A.bi_buf,A.bi_buf>>=8,A.bi_valid-=8)}(p)}},{"../utils/common":41}],53:[function(e,n,i){"use strict";n.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,n,i){(function(a){(function(o,s){"use strict";if(!o.setImmediate){var c,h,w,x,k=1,l={},y=!1,d=o.document,b=Object.getPrototypeOf&&Object.getPrototypeOf(o);b=b&&b.setTimeout?b:o,c={}.toString.call(o.process)==="[object process]"?function(C){process.nextTick(function(){_(C)})}:function(){if(o.postMessage&&!o.importScripts){var C=!0,I=o.onmessage;return o.onmessage=function(){C=!1},o.postMessage("","*"),o.onmessage=I,C}}()?(x="setImmediate$"+Math.random()+"$",o.addEventListener?o.addEventListener("message",S,!1):o.attachEvent("onmessage",S),function(C){o.postMessage(x+C,"*")}):o.MessageChannel?((w=new MessageChannel).port1.onmessage=function(C){_(C.data)},function(C){w.port2.postMessage(C)}):d&&"onreadystatechange"in d.createElement("script")?(h=d.documentElement,function(C){var I=d.createElement("script");I.onreadystatechange=function(){_(C),I.onreadystatechange=null,h.removeChild(I),I=null},h.appendChild(I)}):function(C){setTimeout(_,0,C)},b.setImmediate=function(C){typeof C!="function"&&(C=new Function(""+C));for(var I=new Array(arguments.length-1),P=0;P<I.length;P++)I[P]=arguments[P+1];var B={callback:C,args:I};return l[k]=B,c(k),k++},b.clearImmediate=f}function f(C){delete l[C]}function _(C){if(y)setTimeout(_,0,C);else{var I=l[C];if(I){y=!0;try{(function(P){var B=P.callback,g=P.args;switch(g.length){case 0:B();break;case 1:B(g[0]);break;case 2:B(g[0],g[1]);break;case 3:B(g[0],g[1],g[2]);break;default:B.apply(s,g)}})(I)}finally{f(C),y=!1}}}}function S(C){C.source===o&&typeof C.data=="string"&&C.data.indexOf(x)===0&&_(+C.data.slice(x.length))}})(typeof self>"u"?a===void 0?this:a:self)}).call(this,typeof global<"u"?global:typeof self<"u"?self:typeof window<"u"?window:{})},{}]},{},[10])(10)})});var ce={credentials:{email:"",encryptedPassword:"",otp:"",remember:!1,apiToken:"",awaitingOtp:!1,deviceUuid:""},monarchAccounts:null,accounts:{}};var St=$e(kt(),1),At=$e(Xe(),1);function or(){return"id-"+Math.random().toString(36).slice(2,11)}function Et(e){if(!e)return 0;let n=e.replace(/[^0-9.-]+/g,"").trim(),i=parseFloat(n);return isNaN(i)?0:Math.round(i*100)}function lr(e){let n=e.toLowerCase();return n.includes("credit")?{type:"credit",subtype:"credit_card"}:n.includes("loan")||n.includes("mortgage")||n.includes("student loan")?{type:"loan",subtype:"loan"}:n.includes("savings")?{type:"depository",subtype:"savings"}:n.includes("checking")||n.includes("debit")?{type:"depository",subtype:"checking"}:{type:"depository",subtype:"checking"}}async function Qe(e,n){console.group("parseYNABCSV");let i=await At.default.loadAsync(e),a=Object.keys(i.files).find(s=>s.toLowerCase().includes("register")&&s.toLowerCase().endsWith(".csv"));if(!a)throw console.error("\u274C No register CSV found in the ZIP file"),console.groupEnd("parseYNABCSV"),new Error("No register CSV found in the ZIP file");let o=await i.files[a].async("string");return console.groupEnd("parseYNABCSV"),dr(o,n)}function dr(e,n){return console.group("parseCSV"),new Promise((i,a)=>{St.default.parse(e,{header:!0,skipEmptyLines:!0,complete:({data:o})=>{if(!o||o.length===0)return console.groupEnd("parseCSV"),a(new Error("\u274C CSV file appears to be empty or invalid."));let s=new Map;for(let c of o){let h=c.Account?.trim();if(!h){console.warn("\u274C Skipping row with missing account name:",c);continue}if(c.Date){let[y,d,b]=c.Date.split("/");y&&d&&b&&(c.Date=`${b}-${y.padStart(2,"0")}-${d.padStart(2,"0")}`)}let w=Et(c.Inflow),x=Et(c.Outflow),k=w-x;if(w>0?c.Amount=(w/100).toFixed(2):x>0?c.Amount=(-x/100).toFixed(2):c.Amount="0.00",!s.has(h)){let{type:y,subtype:d}=lr(h,n);s.set(h,{id:or(),name:h,modifiedName:h,type:y,subtype:d,transactions:[],transactionCount:0,balanceCents:0,included:!0,selected:!1,status:"unprocessed"})}let l=s.get(h);l.transactions.push({Date:c.Date,Merchant:c.Payee||"",Category:c.Category||"","Category Group":c["Category Group"]||"",Notes:c.Memo||"",Amount:c.Amount,Tags:c.Flag||""}),l.transactionCount+=1,l.balanceCents+=k}for(let c of s.values())c.balance=c.balanceCents/100,c.included=c.transactionCount>0;console.groupEnd("parseCSV"),i(Object.fromEntries(s))},error:o=>a(o)})})}function It(e){let n=document.getElementById(e),i=n.querySelector(".relative");n.classList.remove("pointer-events-none","opacity-0"),n.classList.add("pointer-events-auto","opacity-100"),requestAnimationFrame(()=>{i.classList.remove("translate-y-full"),i.classList.add("translate-y-0")})}function Bt(e){let n=document.getElementById(e),i=n.querySelector(".relative");i.classList.remove("translate-y-0"),i.classList.add("translate-y-full"),setTimeout(()=>{n.classList.add("pointer-events-none","opacity-0"),n.classList.remove("pointer-events-auto","opacity-100")},500)}function he(){document.querySelectorAll(".ui-button").forEach(e=>{let n=e.dataset.type||"primary",i=e.dataset.size||"medium",a=e.dataset.fixedWidth,o=e.hasAttribute("data-fullwidth"),s=e.hasAttribute("disabled")||e.disabled;switch(e.className="ui-button",e.type="button",e.classList.add("font-semibold","rounded-lg","transition-all","duration-200","ease-in-out"),e.style.transform="none",i){case"small":e.classList.add("px-2","py-1","text-xs","sm:px-3","sm:py-1.5","sm:text-sm");break;case"large":e.classList.add("px-4","py-2.5","text-sm","sm:px-6","sm:py-3","sm:text-base","md:px-8","md:py-4");break;case"medium":default:e.classList.add("px-3","py-2","text-sm","sm:px-5","sm:py-2","sm:text-sm");break}switch(s?(e.setAttribute("disabled",""),e.classList.add("opacity-50","cursor-not-allowed"),e.style.boxShadow="none"):(e.removeAttribute("disabled"),e.classList.add("cursor-pointer")),n){case"primary":e.classList.add("bg-[#1993e5]","text-white","border","border-[#1993e5]","shadow-sm"),s||e.classList.add("hover:bg-blue-600","hover:border-blue-600","hover:shadow-md","focus:ring-2","focus:ring-blue-500","focus:ring-offset-2","active:bg-blue-700","transform","hover:scale-105");break;case"secondary":e.classList.add("bg-white","text-gray-700","border","border-gray-300","shadow-sm"),s||e.classList.add("hover:bg-gray-50","hover:border-gray-400","hover:text-gray-800","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2","active:bg-gray-100");break;case"text":e.classList.remove("px-2","px-3","px-4","px-5","px-6","px-8","py-1","py-1.5","py-2","py-2.5","py-3","py-4","sm:px-3","sm:px-5","sm:px-6","sm:px-8","sm:py-1.5","sm:py-2","sm:py-3","sm:py-4","md:px-8","md:py-4"),e.classList.add("bg-transparent","text-blue-600","px-2","py-1","sm:px-3","sm:py-1.5"),s||e.classList.add("hover:underline","hover:text-blue-700","focus:ring-2","focus:ring-blue-500","focus:ring-offset-2");break;case"danger":e.classList.add("bg-red-500","text-white","border","border-red-500","shadow-sm"),s||e.classList.add("hover:bg-red-600","hover:border-red-600","hover:shadow-md","focus:ring-2","focus:ring-red-500","focus:ring-offset-2","active:bg-red-700","transform","hover:scale-105");break;case"warning":e.classList.add("bg-orange-500","text-white","border","border-orange-500","shadow-sm"),s||e.classList.add("hover:bg-orange-600","hover:border-orange-600","hover:shadow-md","focus:ring-2","focus:ring-orange-500","focus:ring-offset-2","active:bg-orange-700","transform","hover:scale-105");break}a&&(e.style.width=`${a}px`),o&&e.classList.add("w-full"),s||(e.classList.add("touch-manipulation","select-none"),e.style.minHeight="44px",e.style.minWidth="44px")})}function et(){let e=document.getElementById("browseButton"),n=document.getElementById("fileInput"),i=document.getElementById("uploadBox"),a=document.getElementById("errorMessage"),o=document.getElementById("howItWorksBtn"),s=document.getElementById("closeHowItWorksModal");he(),o.addEventListener("click",()=>{It("howItWorksModal")}),s.addEventListener("click",()=>{Bt("howItWorksModal")}),i.addEventListener("dragover",h=>{h.preventDefault(),i.classList.add("border-blue-400","bg-blue-50")}),i.addEventListener("dragleave",()=>{i.classList.remove("border-blue-400","bg-blue-50")}),i.addEventListener("drop",async h=>{h.preventDefault(),i.classList.remove("border-blue-400","bg-blue-50");let w=h.dataTransfer.files[0];w&&await c(w)}),e.addEventListener("click",()=>n.click()),n.addEventListener("change",async h=>{let w=h.target.files[0];w&&await c(w)});async function c(h){if(!h.name.endsWith(".zip")){a.textContent="Please upload a ZIP export from YNAB.",a.classList.remove("hidden");return}try{let x=await Qe(h);ce.accounts=x,ue("reviewView")}catch(x){a.textContent="Failed to parse ZIP file. Please ensure it includes a valid register.csv and plan.csv.",a.classList.remove("hidden"),console.error(x)}}}var Lt=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 min-h-[calc(100vh-200px)]">

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
`;var ur="2025-06-02T06:26:29.704Z",hr="tools/fetchMonarchAccountTypes.js",pr=[{typeName:"depository",typeDisplay:"Cash",group:"asset",subtypes:[{name:"cd",display:"CD"},{name:"checking",display:"Checking"},{name:"savings",display:"Savings"},{name:"money_market",display:"Money Market"},{name:"paypal",display:"Mobile Payment System"},{name:"prepaid",display:"Prepaid"},{name:"cash_management",display:"Cash Management"}]},{typeName:"brokerage",typeDisplay:"Investments",group:"asset",subtypes:[{name:"st_401a",display:"401a"},{name:"st_401k",display:"401k"},{name:"st_403b",display:"403b"},{name:"st_457b",display:"457b"},{name:"st_529",display:"529 Plan"},{name:"brokerage",display:"Brokerage (Taxable)"},{name:"cash_isa",display:"Individual Savings Account (ISA) - Cash"},{name:"cryptocurrency",display:"Cryptocurrency"},{name:"education_savings_account",display:"Coverdell Education Savings Account (ESA)"},{name:"gic",display:"Guaranteed Investment Certificate (GIC)"},{name:"fixed_annuity",display:"Fixed Annuity"},{name:"health_reimbursement_arrangement",display:"Health Reimbursement Arrangement (HRA)"},{name:"health_savings_account",display:"Health Savings Account (HSA)"},{name:"iso",display:"Incentive Stock Options (ISO)"},{name:"ira",display:"Individual Retirement Account (IRA)"},{name:"isa",display:"Individual Savings Account (ISA) - Non-cash"},{name:"lif",display:"Life Income Fund (LIF) Retirement Account"},{name:"lira",display:"Locked-in Retirement Account (LIRA)"},{name:"lrif",display:"Locked-in Retirement Income Fund (LRIF)"},{name:"lrsp",display:"Locked-in Retirement Savings Plan (LRSP)"},{name:"keogh_plan",display:"Keogh Plan"},{name:"mutual_fund",display:"Mutual Fund"},{name:"nso",display:"Non-qualified Stock Options (NSO)"},{name:"non_taxable_brokerage_account",display:"Brokerage (Non-taxable)"},{name:"other",display:"Other"},{name:"prif",display:"Prescribed Registered Retirement Income Fund (PRIF)"},{name:"rdsp",display:"Registered Disability Savings Plan (RDSP)"},{name:"resp",display:"Registered Education Savings Plan (RESP)"},{name:"rlif",display:"Restricted Life Income Fund (RLIF)"},{name:"rrif",display:"Registered Retirement Income Fund (RRIF)"},{name:"pension",display:"Pension"},{name:"profit_sharing_plan",display:"Profit Sharing Plan"},{name:"qualifying_share_account",display:"Qualifying Share Account"},{name:"retirement",display:"Retirement"},{name:"roth",display:"Roth IRA"},{name:"roth_401k",display:"Roth 401k"},{name:"rrsp",display:"Registered Retirement Savings Plan (RRSP)"},{name:"sarsep_pension",display:"Salary Reduction Simplified Employee Pension Plan (SARSEP)"},{name:"sep_ira",display:"Simplified Employee Pension IRA (SEP IRA)"},{name:"simple_ira",display:"Simple IRA"},{name:"sipp",display:"Self-Invested Personal Pension (SIPP)"},{name:"stock_plan",display:"Stock Plan"},{name:"thrift_savings_plan",display:"Thrift Savings Plan (TSP)"},{name:"trust",display:"Trust"},{name:"tfsa",display:"Tax-Free Savings Account (TFSA)"},{name:"ugma",display:"Uniform Gift to Minors Act (UGMA)"},{name:"utma",display:"Uniform Transfers to Minors Act (UTMA)"},{name:"variable_annuity",display:"Variable Annuity"},{name:"fhsa",display:"First Home Savings Account (FHSA)"}]},{typeName:"real_estate",typeDisplay:"Real Estate",group:"asset",subtypes:[{name:"primary_home",display:"Primary Home"},{name:"secondary_home",display:"Secondary Home"},{name:"rental_property",display:"Rental Property"}]},{typeName:"vehicle",typeDisplay:"Vehicles",group:"asset",subtypes:[{name:"car",display:"Car"},{name:"boat",display:"Boat"},{name:"motorcycle",display:"Motorcycle"},{name:"snowmobile",display:"Snowmobile"},{name:"bicycle",display:"Bicycle"},{name:"other",display:"Other"}]},{typeName:"valuables",typeDisplay:"Valuables",group:"asset",subtypes:[{name:"art",display:"Art"},{name:"jewelry",display:"Jewelry"},{name:"collectibles",display:"Collectibles"},{name:"furniture",display:"Furniture"},{name:"other",display:"Other"}]},{typeName:"credit",typeDisplay:"Credit Cards",group:"liability",subtypes:[{name:"credit_card",display:"Credit Card"}]},{typeName:"loan",typeDisplay:"Loans",group:"liability",subtypes:[{name:"auto",display:"Auto"},{name:"business",display:"Business"},{name:"commercial",display:"Commercial"},{name:"construction",display:"Construction"},{name:"consumer",display:"Consumer"},{name:"home",display:"Home"},{name:"home_equity",display:"Home Equity"},{name:"loan",display:"Loan"},{name:"mortgage",display:"Mortgage"},{name:"overdraft",display:"Overdraft"},{name:"line_of_credit",display:"Line of Credit"},{name:"student",display:"Student"}]},{typeName:"other_asset",typeDisplay:"Other Assets",group:"asset",subtypes:[{name:"other",display:"Other"}]},{typeName:"other_liability",typeDisplay:"Other Liabilities",group:"liability",subtypes:[{name:"other",display:"Other"}]}],Se={generatedAt:ur,generatedBy:hr,data:pr};function tt(e){return e.charAt(0).toUpperCase()+e.slice(1)}var He=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});function _e(e){return Se.data.find(n=>n.typeName===e)}function rt(e,n){return _e(e)?.subtypes.find(a=>a.name===n)}function zt(e,n){let i=["bg-blue-500","text-white"],a=["bg-transparent","text-gray-700","hover:bg-blue-100"];n?(e.classList.add(...i),e.classList.remove(...a)):(e.classList.remove(...i),e.classList.add(...a))}function ye(e,n){e.disabled=n,e.classList.toggle("cursor-default",n),e.classList.toggle("cursor-pointer",!n),e.classList.toggle("opacity-50",n)}function be(e,n){n?(e.classList.remove("hidden"),e.removeAttribute("aria-hidden"),e.removeAttribute("hidden")):(e.classList.add("hidden"),e.setAttribute("aria-hidden","true"),e.setAttribute("hidden","true"))}var st,Ae,Ve,nt,Ie="all",Re="";function it(){st=document.getElementById("reviewTableBody"),Ae=document.getElementById("mobileAccountList"),Ve=document.getElementById("continueBtn"),nt=document.getElementById("searchInput"),he(),xe(),document.getElementById("filterAll").classList.add("bg-blue-500","text-white");let e;nt.addEventListener("input",()=>{clearTimeout(e),e=setTimeout(()=>{Re=nt.value.toLowerCase(),xe()},200)}),["all","included","excluded"].forEach(i=>{document.getElementById(`filter${tt(i)}`).addEventListener("click",()=>fr(i))}),document.getElementById("unselectAllBtnMobile").addEventListener("click",()=>Tt(!1)),document.getElementById("unselectAllBtnDesktop").addEventListener("click",()=>Tt(!1)),document.getElementById("bulkIncludeBtnMobile").addEventListener("click",()=>We(!0)),document.getElementById("bulkIncludeBtnDesktop").addEventListener("click",()=>We(!0)),document.getElementById("bulkExcludeBtnMobile").addEventListener("click",()=>We(!1)),document.getElementById("bulkExcludeBtnDesktop").addEventListener("click",()=>We(!1)),document.getElementById("bulkRenameBtnMobile").addEventListener("click",Rt),document.getElementById("bulkRenameBtnDesktop").addEventListener("click",Rt),document.getElementById("bulkTypeBtnMobile").addEventListener("click",Nt),document.getElementById("bulkTypeBtnDesktop").addEventListener("click",Nt),document.getElementById("masterCheckbox").addEventListener("change",Ot);let n=document.getElementById("masterCheckboxMobile");n&&n.addEventListener("change",Ot),document.getElementById("continueBtn").addEventListener("click",()=>ue("methodView")),xe()}function fr(e){Ie=e,document.querySelectorAll(".filter-btn").forEach(n=>{let i=n.id===`filter${tt(Ie)}`;zt(n,i)}),xe()}function Tt(e){Object.values(ce.accounts).forEach(n=>{n.status!=="processed"&&(n.selected=e)}),xe()}function We(e){Object.values(ce.accounts).forEach(n=>{n.selected&&(n.included=e)}),xe()}function xe(){let e=document.createDocumentFragment(),n=document.createDocumentFragment(),i=Object.values(ce.accounts);st.innerHTML="",Ae&&(Ae.innerHTML="");for(let a of i)Ie==="included"&&!a.included||Ie==="excluded"&&a.included||Re&&!a.modifiedName.toLowerCase().includes(Re)||(e.appendChild(gr(a)),Ae&&n.appendChild(br(a)));st.appendChild(e),Ae&&Ae.appendChild(n),at(Ze()),lt(),ot(),ye(Ve,!i.some(mr)),Ve.title=Ve.disabled?"At least one account must be included to proceed":"",he()}function mr(e){return e.included&&e.status!=="processed"}function gr(e){let n=document.createElement("tr");n.setAttribute("role","row"),n.className="border-t border-[#dce1e5]";let i=e.status==="processed",a=e.status==="failed",o=document.createElement("td");o.className="px-2 py-2 text-center";let s=document.createElement("input");s.type="checkbox";let c=`account-checkbox-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;s.id=c,s.name=c,s.setAttribute("aria-label",`Select account: ${e.modifiedName}`),s.className="w-5 h-5",ye(s,i),s.checked=e.selected,s.addEventListener("change",()=>{e.selected=s.checked,lt(),at(Ze())}),o.appendChild(s),n.appendChild(o);let h=document.createElement("td");h.className="px-2 py-2 max-w-[300px] truncate",h.textContent=e.modifiedName,i?h.classList.add("text-gray-400","cursor-default"):(h.classList.add("cursor-pointer"),h.title=`Click to rename '${e.modifiedName}'`,h.addEventListener("click",()=>Dt(e,h))),n.appendChild(h);let w=document.createElement("td");w.className="px-2 py-2";let x=document.createElement("select"),k=`type-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;x.id=k,x.name=k,x.title=_e(e.type)?.typeDisplay||"",x.className="border rounded px-2 py-1 w-full",x.disabled=i,i?x.classList.add("text-gray-300","cursor-default"):x.classList.add("cursor-pointer"),Se.data.forEach(I=>{let P=document.createElement("option");P.value=I.typeName,P.textContent=I.typeDisplay,I.typeName===e.type&&(P.selected=!0),x.appendChild(P)}),x.addEventListener("change",()=>{e.type=x.value;let I=_e(e.type);e.subtype=I?.subtypes[0]?.name||null,xe()}),w.appendChild(x),n.appendChild(w);let l=document.createElement("td");l.className="px-2 py-2";let y=document.createElement("select"),d=`subtype-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;y.id=d,y.name=d,y.className="border rounded px-2 py-1 w-full",y.disabled=i,i?y.classList.add("text-gray-300","cursor-default"):y.classList.add("cursor-pointer");let b=_e(e.type);y.title=rt(e.type,e.subtype)?.display||"",(b?.subtypes||[]).forEach(I=>{let P=document.createElement("option");P.value=I.name,P.textContent=I.display,I.name===e.subtype&&(P.selected=!0),y.appendChild(P)}),y.addEventListener("change",()=>{e.subtype=y.value,xe()}),l.appendChild(y),n.appendChild(l);let f=document.createElement("td");f.className="px-2 py-2 text-center cursor-default",f.textContent=e.transactionCount,f.title=`${e.transactionCount} transaction${e.transactionCount!==1?"s":""}`,i&&f.classList.add("text-gray-400"),n.appendChild(f);let _=document.createElement("td");_.className="px-2 py-2 text-[#637988] cursor-default",_.textContent=He.format(e.balance),_.title=`Balance: ${He.format(e.balance)}`,i&&_.classList.add("text-gray-400"),n.appendChild(_);let S=document.createElement("td");S.className="px-2 py-2 flex items-center gap-2";let C=document.createElement("button");if(C.classList.add("ui-button"),C.dataset.type=e.included?"primary":"secondary",C.dataset.size="small",C.textContent=i?"Processed":e.included?"Included":"Excluded",C.disabled=i,C.title=i?"This account has already been processed":e.included?"Click to exclude this account":"Click to include this account",i||C.addEventListener("click",()=>{e.included=!e.included,xe()}),S.appendChild(C),a){let I=document.createElement("span");I.className="text-red-600 text-xl cursor-default",I.innerHTML="\u26A0\uFE0F",I.title="Previously failed to process",S.appendChild(I)}return n.appendChild(S),n}function br(e){let n=document.createElement("div");n.className="mobile-account-card";let i=e.status==="processed",a=e.status==="failed",o=document.createElement("label");o.className="custom-checkbox-container flex-shrink-0";let s=document.createElement("input");s.type="checkbox",s.className="custom-checkbox-input";let c=`mobile-account-checkbox-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;s.id=c,s.name=c,s.setAttribute("aria-label",`Select account: ${e.modifiedName}`),s.disabled=i,s.checked=e.selected||!1,s.addEventListener("change",()=>{e.selected=s.checked,lt(),at(Ze()),ot()});let h=document.createElement("span");h.className="custom-checkbox-visual",o.appendChild(s),o.appendChild(h),n.appendChild(o);let w=document.createElement("div");w.className="card-content";let x=document.createElement("div");x.className="account-name",x.textContent=e.modifiedName,i?x.classList.add("text-gray-400","cursor-default"):(x.classList.add("cursor-pointer","hover:text-blue-600","transition-colors","duration-200"),x.title=`Click to rename '${e.modifiedName}'`,x.addEventListener("click",()=>Dt(e,x))),w.appendChild(x);let k=document.createElement("div");k.className="account-details";let l=document.createElement("div");l.className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4";let y=document.createElement("div");y.className="flex items-center gap-2 flex-1 min-w-0";let d=document.createElement("span");d.textContent="Type:",d.className="text-xs font-medium text-gray-500 flex-shrink-0";let b=document.createElement("select"),f=`mobile-type-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;b.id=f,b.name=f,b.title=_e(e.type)?.typeDisplay||"",b.className="border border-gray-300 rounded-lg px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white",b.disabled=i,i?b.classList.add("text-gray-300","bg-gray-50","cursor-not-allowed"):b.classList.add("cursor-pointer"),Se.data.forEach(M=>{let m=document.createElement("option");m.value=M.typeName,m.textContent=M.typeDisplay,M.typeName===e.type&&(m.selected=!0),b.appendChild(m)}),b.addEventListener("change",()=>{e.type=b.value;let M=_e(e.type);e.subtype=M?.subtypes[0]?.name||null,xe()}),y.appendChild(d),y.appendChild(b),l.appendChild(y);let _=document.createElement("div");_.className="flex items-center gap-2 flex-1 min-w-0";let S=document.createElement("span");S.textContent="Sub:",S.className="text-xs font-medium text-gray-500 flex-shrink-0";let C=document.createElement("select"),I=`mobile-subtype-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;C.id=I,C.name=I,C.className="border border-gray-300 rounded-lg px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white",C.disabled=i,i?C.classList.add("text-gray-300","bg-gray-50","cursor-not-allowed"):C.classList.add("cursor-pointer");let P=_e(e.type);C.title=rt(e.type,e.subtype)?.display||"",(P?.subtypes||[]).forEach(M=>{let m=document.createElement("option");m.value=M.name,m.textContent=M.display,M.name===e.subtype&&(m.selected=!0),C.appendChild(m)}),C.addEventListener("change",()=>{e.subtype=C.value,xe()}),_.appendChild(S),_.appendChild(C),l.appendChild(_),k.appendChild(l);let B=document.createElement("div");B.className="flex justify-between items-center";let g=document.createElement("span");g.className=i?"text-gray-400":"text-gray-600",g.textContent=`${e.transactionCount} transaction${e.transactionCount!==1?"s":""}`;let u=document.createElement("span");u.className=`account-balance ${i?"text-gray-400":"text-gray-900"}`,u.textContent=He.format(e.balance),B.appendChild(g),B.appendChild(u),k.appendChild(B);let E=document.createElement("div");if(E.className="flex items-center justify-end pt-1",!i){let M=document.createElement("button");M.className=`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${e.included?"bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-500":"bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 focus:ring-green-500"}`,M.textContent=e.included?"Exclude":"Include",M.title=e.included?"Click to exclude this account":"Click to include this account",M.addEventListener("click",()=>{e.included=!e.included,xe()}),E.appendChild(M)}if(a){let M=document.createElement("span");M.className="text-red-600 text-lg cursor-default ml-2",M.innerHTML="\u26A0\uFE0F",M.title="Previously failed to process",E.appendChild(M)}return k.appendChild(E),w.appendChild(k),n.appendChild(w),n}function at(e){let n=document.getElementById("masterCheckbox"),i=document.getElementById("masterCheckboxMobile"),a=e.filter(c=>c.selected).length,o=a>0&&a===e.length,s=a>0&&a<e.length;n&&(n.checked=o,n.indeterminate=s),i&&(i.checked=o,i.indeterminate=s),ot()}function ot(){let e=document.getElementById("mobileSelectionCount");if(e){let n=Object.values(ce.accounts).filter(i=>i.selected).length;e.textContent=`${n} selected`}}function Ze(){return Object.values(ce.accounts).filter(e=>!(e.status==="processed"||Ie==="included"&&!e.included||Ie==="excluded"&&e.included||Re&&!e.modifiedName.toLowerCase().includes(Re)))}function Ot(e){let n=e.target.checked;Ze().forEach(i=>{i.selected=n}),xe()}function lt(){let e=document.getElementById("bulkActionBar"),n=Object.values(ce.accounts).filter(o=>o.selected).length,i=document.getElementById("selectedCountMobile");i&&(i.textContent=n);let a=document.getElementById("selectedCountDesktop");a&&(a.textContent=n),n>0?(e.classList.remove("hidden"),e.classList.add("active")):(e.classList.remove("active"),setTimeout(()=>{e.classList.contains("active")||e.classList.add("hidden")},300))}function Dt(e,n){let i=document.createElement("div");i.className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 opacity-0 transition-opacity duration-200",document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("opacity-100"));let a=document.createElement("div");a.className="bg-white rounded-lg shadow-lg p-5 w-[400px]";let o=document.createElement("h2");o.className="font-bold mb-3 text-lg",o.textContent="Edit Account Name",a.appendChild(o);let s=document.createElement("input");s.type="text",s.value=e.modifiedName,s.setAttribute("aria-label","Account name input"),s.className="border rounded w-full px-3 py-2 mb-4",a.appendChild(s);let c=document.createElement("div");c.className="flex justify-end gap-2";let h=document.createElement("button");h.textContent="Cancel",h.className="bg-gray-300 px-4 py-2 rounded",h.addEventListener("click",()=>x());let w=document.createElement("button");w.textContent="Save",w.className="bg-blue-500 text-white px-4 py-2 rounded font-bold",w.addEventListener("click",k),c.appendChild(h),c.appendChild(w),a.appendChild(c),i.appendChild(a),s.focus(),s.select(),i.addEventListener("keydown",l=>{l.key==="Escape"&&x(),l.key==="Enter"&&k()});function x(){i.classList.remove("opacity-100"),i.classList.add("opacity-0"),setTimeout(()=>document.body.removeChild(i),200)}function k(){e.modifiedName=s.value.trim(),n.textContent=e.modifiedName,n.title=`Click to rename '${e.modifiedName}'`,x()}}function Rt(){let e=document.getElementById("bulkRenameModal"),n=document.getElementById("renamePattern"),i=document.getElementById("indexStart"),a=document.getElementById("renamePreview"),o=document.getElementById("renameCancel"),s=document.getElementById("renameApply"),c=e.querySelectorAll(".token-btn");e.classList.remove("hidden"),n.focus();let h=Object.values(ce.accounts).filter(x=>x.selected);c.forEach(x=>{x.addEventListener("click",()=>{let k=x.dataset.token;n.value+=k,w()})}),n.addEventListener("input",w),i.addEventListener("input",w),w();function w(){a.innerHTML="";let x=n.value,k=parseInt(i.value,10)||1;h.slice(0,3).forEach((l,y)=>{let d=Mt(x,l,y+k),b=document.createElement("div");b.textContent=d,a.appendChild(b)})}o.onclick=()=>e.classList.add("hidden"),s.onclick=()=>{let x=n.value,k=parseInt(i.value,10)||1;h.forEach((l,y)=>{l.modifiedName=Mt(x,l,y+k)}),e.classList.add("hidden"),xe()}}function Mt(e,n,i){let a=new Date().toISOString().split("T")[0];return e.replace(/{{YNAB}}/g,n.originalYnabName?.trim()||n.name||"Account").replace(/{{Index}}/g,i).replace(/{{Upper}}/g,(n.originalYnabName?.trim()||n.name||"Account").toUpperCase()).replace(/{{Date}}/g,a)}function Nt(){let e=document.getElementById("bulkTypeModal"),n=document.getElementById("bulkTypeSelect"),i=document.getElementById("bulkSubtypeSelect"),a=document.getElementById("bulkTypeCancel"),o=document.getElementById("bulkTypeApply");e.classList.remove("hidden"),n.innerHTML="",Se.data.forEach(c=>{let h=document.createElement("option");h.value=c.typeName,h.textContent=c.typeDisplay,n.appendChild(h)});function s(){let c=_e(n.value);if(i.innerHTML="",(c?.subtypes||[]).forEach(h=>{let w=document.createElement("option");w.value=h.name,w.textContent=h.display,i.appendChild(w)}),(c?.subtypes||[]).length===0){let h=document.createElement("option");h.value="",h.textContent="-",i.appendChild(h)}}n.addEventListener("change",s),s(),a.onclick=()=>e.classList.add("hidden"),o.onclick=()=>{let c=n.value,h=i.value;Object.values(ce.accounts).filter(x=>x.selected).forEach(x=>{x.type=c,x.subtype=h||null}),e.classList.add("hidden"),xe()}}var Pt=`<div class="container-responsive flex flex-1 justify-center py-3 sm:py-5 md:py-6">
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
                p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 lg:gap-6 bg-white rounded-lg mb-4 sm:mb-6 
                border border-gray-100 shadow-sm">
      
      <!-- Search -->
      <div class="flex-1 lg:max-w-md">
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

      <!-- Filters -->
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="text-sm font-medium text-gray-700 hidden sm:inline">Filter:</span>
        <div class="flex bg-gray-100 rounded-lg p-1 space-x-1">
          <button id="filterAll" 
                  class="filter-btn px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm 
                         font-medium rounded-md transition-all duration-200 cursor-pointer
                         hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Show all accounts"
                  data-filter="all">
            All
          </button>

          <button id="filterIncluded" 
                  class="filter-btn px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm 
                         font-medium rounded-md transition-all duration-200 cursor-pointer
                         hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Show only included accounts" 
                  data-filter="included">
            <span class="hidden sm:inline">Included</span>
            <span class="sm:hidden">Inc.</span>
          </button>

          <button id="filterExcluded" 
                  class="filter-btn px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm 
                         font-medium rounded-md transition-all duration-200 cursor-pointer
                         hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Show only excluded accounts" 
                  data-filter="excluded">
            <span class="hidden sm:inline">Excluded</span>
            <span class="sm:hidden">Exc.</span>
          </button>
        </div>
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

    <!-- Navigation -->
    <div class="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 gap-4 sm:gap-6">
      <button class="ui-button order-2 sm:order-1 w-full sm:w-auto" data-type="secondary" data-size="large" onclick="history.back()">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      
      <button id="continueBtn" class="ui-button order-1 sm:order-2 w-full sm:w-auto" data-type="primary" data-size="large">
        <span class="hidden sm:inline">Continue to Method Selection</span>
        <span class="sm:hidden">Continue</span>
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
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

<style>
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
`;function dt(){he();let e=document.getElementById("manualImportBtn"),n=document.getElementById("autoImportBtn"),i=Object.keys(ce.accounts).length,a=Object.values(ce.accounts).filter(o=>o.included).length;document.getElementById("totalCountDisplay").textContent=i,document.getElementById("filesCountDisplay").textContent=a,document.getElementById("manualFileCount").textContent=a,e.addEventListener("click",()=>{ue("manualInstructionsView")}),n.addEventListener("click",()=>{ue("monarchCredentialsView")}),backBtn.addEventListener("click",()=>{ue("reviewView")})}var jt=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-6 sm:space-y-8 md:space-y-10 min-h-[calc(100vh-200px)]">

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

  </div>

  <!-- Back Button Container -->
  <div class="flex justify-center items-center w-full max-w-5xl">
    <button class="ui-button" data-type="secondary" data-size="large" onclick="history.back()">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  </div>

</div>
    <button id="backBtn" class="ui-button" data-type="secondary" data-size="large">
      \u2190 Back
    </button>
  </div>
</div>`;var Ft=$e(Xe(),1);function Ye(e,n){let i='"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"',a=n.map(o=>`"${o.Date}","${o.Merchant}","${o.Category}","${e}","","${o.Notes}","${o.Amount}","${o.Tags}"`);return[i,...a].join(`
`)}function ct(){let e=document.getElementById("accountCount"),n=document.getElementById("downloadBtn"),i=document.getElementById("switchToAuto"),a=document.getElementById("backBtn");he();let o=Object.values(ce.accounts).filter(s=>s.included);e.textContent=`${o.length} account${o.length!==1?"s":""}`,n.addEventListener("click",async()=>{let s=new Ft.default,c=1e3;o.forEach(h=>{let w=h.name.replace(/[\\/:*?"<>|]/g,"_"),x=h.transactions,k=x.length;if(k<=c){let l=Ye(h.name,x);s.file(`${w}.csv`,l)}else{let l=Math.ceil(k/c);for(let y=0;y<l;y++){let d=y*c,b=d+c,f=x.slice(d,b),_=Ye(h.name,f);s.file(`${w}_part${y+1}.csv`,_)}}});try{let h=await s.generateAsync({type:"blob"}),w=document.createElement("a");w.href=URL.createObjectURL(h),w.download="accounts_export.zip",w.click()}catch(h){console.error("\u274C ZIP generation failed",h),alert("Failed to generate ZIP file.")}}),i.addEventListener("click",()=>{ue("monarchCredentialsView")}),a.addEventListener("click",()=>{ue("methodView")})}var Ut=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-8 sm:space-y-10 md:space-y-12 min-h-[calc(100vh-200px)]">

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
      <button class="ui-button btn-responsive" data-type="primary" data-size="large" onclick="history.back()">
        Try Auto Import Instead
      </button>
      <button class="ui-button" data-type="secondary" data-size="large" onclick="window.location.reload()">
        Continue with Manual
      </button>
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex flex-col sm:flex-row justify-between items-center w-full max-w-4xl gap-4">
    <button class="ui-button order-2 sm:order-1" data-type="secondary" data-size="large" onclick="history.back()">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  </div>

</div>
    <h4 class="text-base sm:text-lg font-semibold text-[#111518]">Looking for the easiest way?</h4>
    <p class="text-xs sm:text-sm text-gray-600 max-w-lg">
      Our Auto Import tool transfers your accounts directly into Monarch with zero file handling.
    </p>

    <button id="switchToAuto" class="ui-button" data-size="large">Use Auto Import Instead</button>
  </div>

  <!-- Footer -->
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-2 w-full gap-3">
    <button id="backBtn" class="ui-button order-2 sm:order-1" data-type="secondary" data-size="large">
      \u2190 Back
    </button>

    <a href="https://app.monarchmoney.com" target="_blank" class="ui-button order-1 sm:order-2 inline-flex items-center justify-center" data-type="secondary" data-size="large">
      <svg xmlns="http://www.w3.org/2000/svg" class="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-2" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M14 3h7m0 0v7m0-7L10 14M5 5h14v14H5V5z" />
      </svg>Open Monarch
    </a>
  </div>

</div>`;var fe=[];for(let e=0;e<256;++e)fe.push((e+256).toString(16).slice(1));function Ht(e,n=0){return(fe[e[n+0]]+fe[e[n+1]]+fe[e[n+2]]+fe[e[n+3]]+"-"+fe[e[n+4]]+fe[e[n+5]]+"-"+fe[e[n+6]]+fe[e[n+7]]+"-"+fe[e[n+8]]+fe[e[n+9]]+"-"+fe[e[n+10]]+fe[e[n+11]]+fe[e[n+12]]+fe[e[n+13]]+fe[e[n+14]]+fe[e[n+15]]).toLowerCase()}var ut,wr=new Uint8Array(16);function ht(){if(!ut){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");ut=crypto.getRandomValues.bind(crypto)}return ut(wr)}var _r=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),pt={randomUUID:_r};function kr(e,n,i){if(pt.randomUUID&&!n&&!e)return pt.randomUUID();e=e||{};let a=e.random??e.rng?.()??ht();if(a.length<16)throw new Error("Random bytes length must be >= 16");if(a[6]=a[6]&15|64,a[8]=a[8]&63|128,n){if(i=i||0,i<0||i+16>n.length)throw new RangeError(`UUID byte range ${i}:${i+15} is out of buffer bounds`);for(let o=0;o<16;++o)n[i+o]=a[o];return n}return Ht(a)}var ft=kr;var Me=location.hostname==="localhost"?"http://localhost:3000/dev/":"/.netlify/functions/",Be={login:Me+"monarchLogin",fetchAccounts:Me+"fetchMonarchAccounts",createAccounts:Me+"createMonarchAccounts",generateStatements:Me+"generateStatements",getUploadStatus:Me+"getUploadStatus"};async function Ne(e,n){let i=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),a=await i.json();if(!i.ok)throw new Error(a.error||a.message||"API error");return a}var Ee={login:(e,n,i,a)=>Ne(Be.login,{email:e,encryptedPassword:n,deviceUuid:i,otp:a}),fetchMonarchAccounts:e=>Ne(Be.fetchAccounts,{token:e}),createAccounts:(e,n)=>Ne(Be.createAccounts,{token:e,accounts:n}),generateAccounts:e=>fetch(Be.generateStatements,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accounts:e})}),queryUploadStatus:(e,n)=>Ne(Be.getUploadStatus,{token:e,sessionKey:n})};var ve={EMAIL:"monarchEmail",ENCRYPTED_PASSWORD:"monarchPasswordBase64",TOKEN:"monarchApiToken",UUID:"monarchDeviceUuid",REMEMBER:"monarchRememberMe"};function je(){return{email:De(ve.EMAIL),encryptedPassword:De(ve.ENCRYPTED_PASSWORD),token:De(ve.TOKEN),uuid:De(ve.UUID),remember:De(ve.REMEMBER)==="true"}}function Le({email:e,encryptedPassword:n,token:i,uuid:a,remember:o}){e&&Pe(ve.EMAIL,e),n&&Pe(ve.ENCRYPTED_PASSWORD,n),i&&Pe(ve.TOKEN,i),a&&Pe(ve.UUID,a),typeof o=="boolean"&&Pe(ve.REMEMBER,o?"true":"false")}function Wt(){Object.values(ve).forEach(Cr)}function De(e){return localStorage.getItem(e)}function Pe(e,n){localStorage.setItem(e,n)}function Cr(e){localStorage.removeItem(e)}var Vt="monarch-app-salt";var mt="AES-GCM";var Zt="SHA-256";function Ar(...e){let n=e.reduce((o,s)=>o+s.length,0),i=new Uint8Array(n),a=0;for(let o of e)i.set(o,a),a+=o.length;return i}async function Gt(e,n){console.group("encryptPassword");try{let i=new TextEncoder,a=crypto.getRandomValues(new Uint8Array(12)),o=await crypto.subtle.importKey("raw",i.encode(e),{name:"PBKDF2"},!1,["deriveKey"]),s=await crypto.subtle.deriveKey({name:"PBKDF2",salt:i.encode(Vt),iterations:1e5,hash:Zt},o,{name:mt,length:256},!0,["encrypt"]),c=i.encode(n),h=await crypto.subtle.encrypt({name:mt,iv:a},s,c),w=new Uint8Array(h),x=w.slice(-16),k=w.slice(0,-16),l=Ar(a,k,x);return btoa(String.fromCharCode(...l))}catch(i){throw console.error("\u274C Error encrypting password:",i),console.groupEnd("encryptPassword"),new Error("Failed to encrypt password. Please try again.")}}function ze(e,n){if(!e||typeof e!="object")throw new Error("Target must be an object");Object.entries(n).forEach(([i,a])=>{e[i]=a})}function $t(e){if(!e||typeof e!="object")throw new Error("Target must be an object");Object.keys(e).forEach(n=>{let i=e[n];Array.isArray(i)?e[n]=[]:typeof i=="object"&&i!==null?e[n]={}:typeof i=="boolean"?e[n]=!1:e[n]=""})}async function gt(){let e=C=>document.getElementById(C),n={emailInput:e("email"),passwordInput:e("password"),connectBtn:e("connectBtn"),backBtn:e("backBtn"),form:e("credentialsForm"),errorBox:e("errorBox"),rememberCheckbox:e("rememberCredentials"),rememberMeContainer:e("rememberMe"),notYouContainer:e("notYouContainer"),rememberedEmail:e("rememberedEmail"),clearCredentialsBtn:e("clearCredentialsBtn"),toggleBtn:e("togglePassword"),eyeShow:e("eyeShow"),eyeHide:e("eyeHide"),securityNoteMsg:e("securityNote"),securityNoteIcon:e("securityNoteIcon")};he();let{credentials:i}=ce,{token:a,email:o,encryptedPassword:s,uuid:c,remember:h}=je();ze(i,{email:o,encryptedPassword:s,apiToken:i.apiToken||a,deviceUuid:i.deviceUuid||c,remember:h}),i.deviceUuid||(i.deviceUuid=ft(),Le({uuid:i.deviceUuid})),o&&s?(n.emailInput.value=o,n.passwordInput.value="",n.rememberedEmail.textContent=`Signed in as ${o}`,n.rememberCheckbox.checked=i.remember,ye(n.emailInput,!0),ye(n.passwordInput,!0),be(n.rememberMeContainer,!1),be(n.notYouContainer,!0),be(n.toggleBtn,!1),x("signed-in")):(be(n.notYouContainer,!1),x());function w(){let C=n.emailInput.value.trim(),I=n.passwordInput.value.trim()||i.encryptedPassword;ye(n.connectBtn,!(C&&I)),be(n.errorBox,!1),he()}function x(C){let I={GREEN:"#006400",BLUE:"#1993e5",ORANGE:"#ff8c00"};switch(C){case"remembered":n.securityNoteMsg.textContent="Your credentials will be stored securely on this device.",n.securityNoteIcon.setAttribute("fill",I.ORANGE);break;case"signed-in":n.securityNoteMsg.textContent='You are signed in. To use different credentials, click "Not you?".',n.securityNoteIcon.setAttribute("fill",I.BLUE);break;default:n.securityNoteMsg.textContent="Your credentials will not be stored.",n.securityNoteIcon.setAttribute("fill",I.GREEN)}}function k(C){C.preventDefault(),n.connectBtn.click()}async function l(){let C=je(),I=n.emailInput.value.trim()||C.email,P=n.passwordInput.value.trim(),B=i.encryptedPassword||C.encryptedPassword,g=i.deviceUuid||C.uuid;if(!B&&P)try{B=await Gt(I,P)}catch{S("Failed to encrypt password.");return}ye(n.connectBtn,!0),n.connectBtn.textContent="Connecting\u2026",be(n.errorBox,!1);try{let u=await Ee.login(I,B,g);if(u?.otpRequired)return i.remember&&Le({email:I,encryptedPassword:B,remember:!0}),i.awaitingOtp=!0,ue("monarchOtpView");if(u?.token)return ze(i,{email:I,encryptedPassword:B,otp:"",remember:n.rememberCheckbox.checked,apiToken:u.token,awaitingOtp:!1}),i.remember&&Le({email:I,encryptedPassword:B,token:u.token,remember:!0}),ue("monarchCompleteView");let E=u?.detail||u?.error||"Unexpected login response.";throw new Error(E)}catch(u){S(u.message)}finally{ye(n.connectBtn,!1),n.connectBtn.textContent="Connect to Monarch"}}async function y(C){C.preventDefault(),await l()}function d(C){C.preventDefault(),Wt(),$t(i),n.emailInput.value="",n.passwordInput.value="",n.rememberCheckbox.checked=!1,ye(n.emailInput,!1),ye(n.passwordInput,!1),ye(n.connectBtn,!0),be(n.toggleBtn,!0),be(n.notYouContainer,!1),be(n.rememberMeContainer,!0),x(),he(),n.emailInput.focus()}function b(){i.remember=n.rememberCheckbox.checked,x(i.remember?"remembered":"not-remembered"),(n.emailInput.value.trim()===""?n.emailInput:n.passwordInput.value.trim()===""?n.passwordInput:n.connectBtn).focus()}function f(){let C=n.passwordInput.type==="password";n.passwordInput.type=C?"text":"password",n.toggleBtn.setAttribute("aria-label",C?"Hide password":"Show password"),be(n.eyeShow,!C),be(n.eyeHide,C)}function _(){ue("methodView")}function S(C){n.errorBox.textContent=C,be(n.errorBox,!0)}n.form.addEventListener("submit",k),n.connectBtn.addEventListener("click",y),n.clearCredentialsBtn.addEventListener("click",d),n.rememberCheckbox.addEventListener("change",b),n.toggleBtn.addEventListener("click",f),n.backBtn.addEventListener("click",_),[n.emailInput,n.passwordInput].forEach(C=>{C.addEventListener("input",w),C.addEventListener("focus",()=>C.classList.add("ring-2","ring-blue-500","outline-none")),C.addEventListener("blur",()=>C.classList.remove("ring-2","ring-blue-500","outline-none"))}),w()}var qt=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-6 sm:space-y-8 min-h-[calc(100vh-200px)]">

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

      <!-- Error Message -->
      <div id="credentialsError" class="hidden bg-red-50 border border-red-200 rounded-lg p-3">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-red-800">Error message will appear here</p>
        </div>
      </div>

      <!-- Submit Button -->
      <button id="loginBtn" 
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
        <svg viewBox="0 0 24 24" fill="currentColor">
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

  <!-- Navigation -->
  <div class="flex flex-col sm:flex-row justify-between items-center w-full max-w-md gap-4">
    <button id="backBtn" class="ui-button order-2 sm:order-1" data-type="secondary" data-size="large">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  </div>

</div>
          session</label>
      </div>

      <!-- Not You? -->
      <div id="notYouContainer" class="mt-2 text-sm text-gray-500 hidden">
        <span id="rememberedEmail">"some@thing.com"</span>
        <button id="clearCredentialsBtn" class="ml-2 text-blue-600 cursor-pointer hover:underline">Not You?</button>
      </div>

      <div id="errorBox" class="hidden text-red-500 text-sm mt-4"></div>

    </form>

    <button id="connectBtn" class="ui-button" data-type="primary" data-size="large" data-fullWidth disabled>
      Connect & Start Import
    </button>

    <!-- Security Note -->
    <div class="flex items-start gap-2 mt-1">
      <div class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5">
        <svg id="securityNoteIcon" viewBox="0 0 24 24" fill="green">
          <path
            d="M12 1a11 11 0 100 22 11 11 0 000-22zm0 20a9 9 0 110-18 9 9 0 010 18zm-1-5h2v2h-2v-2zm0-10h2v8h-2V6z" />
        </svg>
      </div>
      <p id="securityNote" class="text-xs text-gray-500 leading-relaxed">
        <!-- Rendered dynamically -->
      </p>
    </div>

  </div>

  <div class="flex justify-between w-full max-w-md">
    <button id="backBtn" class="ui-button" data-type="secondary" data-size="large">\u2190 Back</button>
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

  #togglePassword, #clearCredentialsBtn {
    transition: none !important;
    box-shadow: none !important;
    transform: none !important;
  }
</style>
`;function bt(){let e=l=>document.getElementById(l),n={otpInput:e("otpInput"),submitOtpBtn:e("submitOtpBtn"),otpError:e("otpError"),backBtn:e("backBtn")};he();let{credentials:i}=ce,{email:a,encryptedPassword:o,uuid:s,remember:c}=je();ze(i,{email:i.email||a,encryptedPassword:i.encryptedPassword||o,deviceUuid:i.deviceUuid||s,remember:c});async function h(l){console.group("MonarchOtpView"),l.preventDefault(),be(n.otpError,!1),i.otp=n.otpInput.value;try{let y=await Ee.login(i.email,i.encryptedPassword,i.deviceUuid,i.otp);if(y?.token)return ze(i,{apiToken:y.token,awaitingOtp:!1}),i.remember&&Le({token:y.token}),console.groupEnd("MonarchOtpView"),ue("monarchCompleteView");throw new Error("Unknown login response.")}catch(y){be(n.otpError,!0),n.otpError.textContent="Invalid OTP. Please try again.",console.error("\u274C OTP verification error",y),console.groupEnd("MonarchOtpView")}}function w(){ue("monarchCredentialsView")}function x(){n.otpInput.value=n.otpInput.value.replace(/\D/g,"").slice(0,6),ye(n.submitOtpBtn,n.otpInput.value.length!==6),he()}function k(l){l.key==="Enter"&&n.otpInput.value.length===6&&n.submitOtpBtn.click()}n.otpInput.addEventListener("input",x),n.otpInput.addEventListener("keydown",k),n.submitOtpBtn.addEventListener("click",h),n.backBtn.addEventListener("click",w),ye(n.submitOtpBtn,!0)}var Kt=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-8 sm:space-y-10 md:space-y-12 min-h-[calc(100vh-200px)]">

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

    <!-- Resend Code -->
    <div class="text-center w-full">
      <p class="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
      <button id="resendCodeBtn" 
              class="text-sm text-blue-600 hover:text-blue-700 font-medium 
                     hover:underline transition-colors duration-200 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
        Resend verification code
      </button>
    </div>

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

  <!-- Navigation -->
  <div class="flex justify-center items-center w-full max-w-md">
    <button id="backBtn" class="ui-button" data-type="secondary" data-size="large">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  </div>

</div>
`;function yt(){let e=document.getElementById("accountList"),n=document.getElementById("restartBtn"),i=document.getElementById("retryAllBtn"),a=document.getElementById("openMonarchBtn"),o=document.getElementById("backBtn"),s=document.getElementById("header"),c=document.getElementById("subheader"),h=document.getElementById("overallStatus");he();let w=Object.values(ce.accounts).filter(B=>B.included),x=4,k={unprocessed:"queued",processed:"success",failed:"error"},l={success:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-green-500"><path d="M20 6L9 17l-5-5"></path></svg>',warning:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-orange-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',loading:'<svg class="w-full h-full animate-spin text-blue-500" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>'},y={queued:{text:"Queued",color:"bg-gray-200 text-gray-800"},processing:{text:"Processing",color:"bg-blue-100 text-blue-700 animate-pulse"},pending:{text:"Pending",color:"bg-yellow-100 text-yellow-700"},success:{text:"\u2714 Complete",color:"bg-green-100 text-green-700"},error:{text:"\u2716 Failed",color:"bg-red-100 text-red-700"}};w.forEach(B=>{let g=document.createElement("div");g.id=`status-${B.modifiedName}`,g.className="flex justify-between items-center py-2 border-b border-gray-100 text-base gap-3",g.setAttribute("aria-label",`Status for ${B.modifiedName}`);let u=document.createElement("span");u.className="font-medium truncate text-gray-900 max-w-[70%] cursor-default",u.textContent=B.modifiedName,u.title=B.modifiedName;let E=document.createElement("span");E.className=`status-indicator text-sm font-medium rounded-full px-3 py-1 ${y.queued.color} cursor-default`,E.textContent=y.queued.text,g.appendChild(u),g.appendChild(E),e.appendChild(g),C(B,k[B.status]||"queued")});let d=!1,b=w.every(B=>B.status==="unprocessed");I(),b&&!d&&(d=!0,s.textContent="Migration In Progress...",c.innerHTML="We are importing your accounts now. Please do not refresh the page.",h.innerHTML=l.loading,i.setAttribute("hidden",""),o.setAttribute("hidden",""),n.setAttribute("hidden",""),a.setAttribute("hidden",""),(async()=>(await _(f(w)),I()))());function f(B){return B.reduce((g,u,E)=>{let M=Math.floor(E/x);return(g[M]||=[]).push(u),g},[])}async function _(B){for(let g of B){g.forEach(M=>C(M,"processing"));let u=[],E=await Ee.createAccounts(ce.credentials.apiToken,g);for(let M of E.success){let m=w.find(O=>O.modifiedName===M.name);C(m,"pending");for(let O of M.sessionKeys)u.push(P(m,O))}E.failed.forEach(M=>{let m=ce.accounts[M.name];m.status="failed",C(m,"error",M.error)}),await Promise.all(u),await S(2e3)}}function S(B){return new Promise(g=>setTimeout(g,B))}function C(B,g,u=null){let E=document.getElementById(`status-${B.modifiedName}`);if(!E)return;let M=E.querySelector(".status-indicator"),m=y[g];m&&(M.textContent=m.text,M.className=`status-indicator text-sm font-medium rounded-full px-3 py-1 ${m.color}`),u?B.status="failed":g==="success"&&(B.status="processed",B.selected=!1)}function I(){let B=w.every(E=>E.status==="processed"),g=w.some(E=>E.status==="processing"),u=w.some(E=>E.status==="failed");if(g)s.textContent="Migration In Progress...",c.innerHTML="We are importing your accounts now. Please do not refresh the page.",h.innerHTML=l.loading,i.setAttribute("hidden",""),o.setAttribute("hidden",""),n.setAttribute("hidden",""),a.setAttribute("hidden","");else if(B)s.textContent="Migration Complete!",c.textContent="All accounts were successfully imported.",h.innerHTML=l.success,i.setAttribute("hidden",""),o.setAttribute("hidden",""),n.removeAttribute("hidden"),a.removeAttribute("hidden");else if(u){s.textContent="Migration Incomplete",c.textContent="Some accounts failed to import. You can retry them below.",h.innerHTML=l.warning,i.removeAttribute("hidden"),o.removeAttribute("hidden"),n.setAttribute("hidden",""),a.setAttribute("hidden","");let E=w.find(M=>M.status==="failed");E&&document.getElementById(`status-${E.modifiedName}`)?.scrollIntoView({behavior:"smooth"})}}async function P(B,g,u=30,E=3500){for(let M=0;M<u;M++){try{let O=(await Ee.queryUploadStatus(ce.credentials.apiToken,g)).data.uploadStatementSession;if(O.status==="completed"){C(B,"success");return}else if(O.status==="failed"||O.status==="errored"||O.errorMessage){C(B,"error",O.errorMessage||"Upload failed");return}}catch(m){C(B,"error",m.message);return}await new Promise(m=>setTimeout(m,E))}C(B,"error","Timeout waiting for Monarch to finish import.")}i.addEventListener("click",async()=>{i.disabled=!0,i.textContent="Retrying...";let B=w.filter(g=>g.status==="failed");await _(f(B)),i.disabled=!1,i.textContent="Retry All Failed Accounts",I()}),n.addEventListener("click",()=>{ue("uploadView")}),o.addEventListener("click",()=>{ue("reviewView")})}var Jt=`<div class="container-responsive flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-24 space-y-8 sm:space-y-10 md:space-y-12 min-h-[calc(100vh-200px)]">

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

</div>
    <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 px-4 py-6 mt-6 w-full">
      <button id="backBtn" class="ui-button order-4 sm:order-1" data-type="secondary" data-size="large" hidden>
        \u2190 Back
      </button>

      <button id="retryAllBtn" class="ui-button order-3 sm:order-2" data-type="warning" data-size="large" hidden>
        Retry All Failed Accounts
      </button>

      <button id="restartBtn" class="ui-button order-2 sm:order-3" data-type="secondary" data-size="large" hidden>
        Upload More Accounts
      </button>

      <a id="openMonarchBtn" href="https://app.monarchmoney.com" target="_blank" class="ui-button order-1 sm:order-4 inline-flex items-center justify-center" data-type="primary"
        data-size="large" hidden>
        <svg xmlns="http://www.w3.org/2000/svg" class="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M14 3h7m0 0v7m0-7L10 14M5 5h14v14H5V5z" />
        </svg>Open Monarch
      </a>
    </div>
  </div>

</div>`;var zr={uploadView:{template:Lt,init:et,scroll:!1},reviewView:{template:Pt,init:it,scroll:!0},methodView:{template:jt,init:dt,scroll:!1},manualInstructionsView:{template:Ut,init:ct,scroll:!0},monarchCredentialsView:{template:qt,init:gt,scroll:!1},monarchOtpView:{template:Kt,init:bt,scroll:!1},monarchCompleteView:{template:Jt,init:yt,scroll:!1}};async function ue(e){let n=document.getElementById("app");n.innerHTML="";let i=zr[e];if(!i){n.innerHTML="<p>404 - View not found</p>";return}i.scroll?document.body.classList.add("always-scroll"):document.body.classList.remove("always-scroll"),document.getElementById("app").innerHTML=i.template,i.init()}window.addEventListener("DOMContentLoaded",()=>{ue("uploadView")});})();
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
