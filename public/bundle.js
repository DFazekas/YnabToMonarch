(()=>{var Tn=Object.create;var jt=Object.defineProperty;var Ln=Object.getOwnPropertyDescriptor;var Nn=Object.getOwnPropertyNames;var zn=Object.getPrototypeOf,On=Object.prototype.hasOwnProperty;var Ze=(e=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(e,{get:(o,n)=>(typeof require!="undefined"?require:o)[n]}):e)(function(e){if(typeof require!="undefined")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var Ut=(e,o)=>()=>(o||e((o={exports:{}}).exports,o),o.exports);var Rn=(e,o,n,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let i of Nn(o))!On.call(e,i)&&i!==n&&jt(e,i,{get:()=>o[i],enumerable:!(r=Ln(o,i))||r.enumerable});return e};var ut=(e,o,n)=>(n=e!=null?Tn(zn(e)):{},Rn(o||!e||!e.__esModule?jt(n,"default",{value:e,enumerable:!0}):n,e));var Ht=Ut((ft,mt)=>{((e,o)=>{typeof define=="function"&&define.amd?define([],o):typeof mt=="object"&&typeof ft<"u"?mt.exports=o():e.Papa=o()})(ft,function e(){var o=typeof self<"u"?self:typeof window<"u"?window:o!==void 0?o:{},n,r=!o.document&&!!o.postMessage,i=o.IS_PAPA_WORKER||!1,s={},l=0,p={};function k(b){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(f){var B=x(f);B.chunkSize=parseInt(B.chunkSize),f.step||f.chunk||(B.chunkSize=null),this._handle=new d(B),(this._handle.streamer=this)._config=B}.call(this,b),this.parseChunk=function(f,B){var R=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<R){let O=this._config.newline;O||(h=this._config.quoteChar||'"',O=this._handle.guessLineEndings(f,h)),f=[...f.split(O).slice(R)].join(O)}this.isFirstChunk&&A(this._config.beforeFirstChunk)&&(h=this._config.beforeFirstChunk(f))!==void 0&&(f=h),this.isFirstChunk=!1,this._halted=!1;var R=this._partialLine+f,h=(this._partialLine="",this._handle.parse(R,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(f=h.meta.cursor,R=(this._finished||(this._partialLine=R.substring(f-this._baseIndex),this._baseIndex=f),h&&h.data&&(this._rowCount+=h.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),i)o.postMessage({results:h,workerId:p.WORKER_ID,finished:R});else if(A(this._config.chunk)&&!B){if(this._config.chunk(h,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=h=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(h.data),this._completeResults.errors=this._completeResults.errors.concat(h.errors),this._completeResults.meta=h.meta),this._completed||!R||!A(this._config.complete)||h&&h.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),R||h&&h.meta.paused||this._nextChunk(),h}this._halted=!0},this._sendError=function(f){A(this._config.error)?this._config.error(f):i&&this._config.error&&o.postMessage({workerId:p.WORKER_ID,error:f,finished:!1})}}function m(b){var f;(b=b||{}).chunkSize||(b.chunkSize=p.RemoteChunkSize),k.call(this,b),this._nextChunk=r?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(B){this._input=B,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(f=new XMLHttpRequest,this._config.withCredentials&&(f.withCredentials=this._config.withCredentials),r||(f.onload=L(this._chunkLoaded,this),f.onerror=L(this._chunkError,this)),f.open(this._config.downloadRequestBody?"POST":"GET",this._input,!r),this._config.downloadRequestHeaders){var B,R=this._config.downloadRequestHeaders;for(B in R)f.setRequestHeader(B,R[B])}var h;this._config.chunkSize&&(h=this._start+this._config.chunkSize-1,f.setRequestHeader("Range","bytes="+this._start+"-"+h));try{f.send(this._config.downloadRequestBody)}catch(O){this._chunkError(O.message)}r&&f.status===0&&this._chunkError()}},this._chunkLoaded=function(){f.readyState===4&&(f.status<200||400<=f.status?this._chunkError():(this._start+=this._config.chunkSize||f.responseText.length,this._finished=!this._config.chunkSize||this._start>=(B=>(B=B.getResponseHeader("Content-Range"))!==null?parseInt(B.substring(B.lastIndexOf("/")+1)):-1)(f),this.parseChunk(f.responseText)))},this._chunkError=function(B){B=f.statusText||B,this._sendError(new Error(B))}}function C(b){(b=b||{}).chunkSize||(b.chunkSize=p.LocalChunkSize),k.call(this,b);var f,B,R=typeof FileReader<"u";this.stream=function(h){this._input=h,B=h.slice||h.webkitSlice||h.mozSlice,R?((f=new FileReader).onload=L(this._chunkLoaded,this),f.onerror=L(this._chunkError,this)):f=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var h=this._input,O=(this._config.chunkSize&&(O=Math.min(this._start+this._config.chunkSize,this._input.size),h=B.call(h,this._start,O)),f.readAsText(h,this._config.encoding));R||this._chunkLoaded({target:{result:O}})},this._chunkLoaded=function(h){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(h.target.result)},this._chunkError=function(){this._sendError(f.error)}}function c(b){var f;k.call(this,b=b||{}),this.stream=function(B){return f=B,this._nextChunk()},this._nextChunk=function(){var B,R;if(!this._finished)return B=this._config.chunkSize,f=B?(R=f.substring(0,B),f.substring(B)):(R=f,""),this._finished=!f,this.parseChunk(R)}}function v(b){k.call(this,b=b||{});var f=[],B=!0,R=!1;this.pause=function(){k.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){k.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(h){this._input=h,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){R&&f.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),f.length?this.parseChunk(f.shift()):B=!0},this._streamData=L(function(h){try{f.push(typeof h=="string"?h:h.toString(this._config.encoding)),B&&(B=!1,this._checkIsFinished(),this.parseChunk(f.shift()))}catch(O){this._streamError(O)}},this),this._streamError=L(function(h){this._streamCleanUp(),this._sendError(h)},this),this._streamEnd=L(function(){this._streamCleanUp(),R=!0,this._streamData("")},this),this._streamCleanUp=L(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function d(b){var f,B,R,h,O=Math.pow(2,53),a=-O,j=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,ne=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,P=this,ee=0,D=0,Y=!1,M=!1,T=[],$={data:[],errors:[],meta:{}};function G(Q){return b.skipEmptyLines==="greedy"?Q.join("").trim()==="":Q.length===1&&Q[0].length===0}function W(){if($&&R&&(ue("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+p.DefaultDelimiter+"'"),R=!1),b.skipEmptyLines&&($.data=$.data.filter(function(le){return!G(le)})),oe()){let le=function(de,t){A(b.transformHeader)&&(de=b.transformHeader(de,t)),T.push(de)};var re=le;if($)if(Array.isArray($.data[0])){for(var Q=0;oe()&&Q<$.data.length;Q++)$.data[Q].forEach(le);$.data.splice(0,1)}else $.data.forEach(le)}function te(le,de){for(var t=b.header?{}:[],F=0;F<le.length;F++){var N=F,_=le[F],_=((g,I)=>(U=>(b.dynamicTypingFunction&&b.dynamicTyping[U]===void 0&&(b.dynamicTyping[U]=b.dynamicTypingFunction(U)),(b.dynamicTyping[U]||b.dynamicTyping)===!0))(g)?I==="true"||I==="TRUE"||I!=="false"&&I!=="FALSE"&&((U=>{if(j.test(U)&&(U=parseFloat(U),a<U&&U<O))return 1})(I)?parseFloat(I):ne.test(I)?new Date(I):I===""?null:I):I)(N=b.header?F>=T.length?"__parsed_extra":T[F]:N,_=b.transform?b.transform(_,N):_);N==="__parsed_extra"?(t[N]=t[N]||[],t[N].push(_)):t[N]=_}return b.header&&(F>T.length?ue("FieldMismatch","TooManyFields","Too many fields: expected "+T.length+" fields but parsed "+F,D+de):F<T.length&&ue("FieldMismatch","TooFewFields","Too few fields: expected "+T.length+" fields but parsed "+F,D+de)),t}var ie;$&&(b.header||b.dynamicTyping||b.transform)&&(ie=1,!$.data.length||Array.isArray($.data[0])?($.data=$.data.map(te),ie=$.data.length):$.data=te($.data,0),b.header&&$.meta&&($.meta.fields=T),D+=ie)}function oe(){return b.header&&T.length===0}function ue(Q,te,ie,re){Q={type:Q,code:te,message:ie},re!==void 0&&(Q.row=re),$.errors.push(Q)}A(b.step)&&(h=b.step,b.step=function(Q){$=Q,oe()?W():(W(),$.data.length!==0&&(ee+=Q.data.length,b.preview&&ee>b.preview?B.abort():($.data=$.data[0],h($,P))))}),this.parse=function(Q,te,ie){var re=b.quoteChar||'"',re=(b.newline||(b.newline=this.guessLineEndings(Q,re)),R=!1,b.delimiter?A(b.delimiter)&&(b.delimiter=b.delimiter(Q),$.meta.delimiter=b.delimiter):((re=((le,de,t,F,N)=>{var _,g,I,U;N=N||[",","	","|",";",p.RECORD_SEP,p.UNIT_SEP];for(var H=0;H<N.length;H++){for(var z,V=N[H],J=0,q=0,X=0,ae=(I=void 0,new u({comments:F,delimiter:V,newline:de,preview:10}).parse(le)),se=0;se<ae.data.length;se++)t&&G(ae.data[se])?X++:(z=ae.data[se].length,q+=z,I===void 0?I=z:0<z&&(J+=Math.abs(z-I),I=z));0<ae.data.length&&(q/=ae.data.length-X),(g===void 0||J<=g)&&(U===void 0||U<q)&&1.99<q&&(g=J,_=V,U=q)}return{successful:!!(b.delimiter=_),bestDelimiter:_}})(Q,b.newline,b.skipEmptyLines,b.comments,b.delimitersToGuess)).successful?b.delimiter=re.bestDelimiter:(R=!0,b.delimiter=p.DefaultDelimiter),$.meta.delimiter=b.delimiter),x(b));return b.preview&&b.header&&re.preview++,f=Q,B=new u(re),$=B.parse(f,te,ie),W(),Y?{meta:{paused:!0}}:$||{meta:{paused:!1}}},this.paused=function(){return Y},this.pause=function(){Y=!0,B.abort(),f=A(b.chunk)?"":f.substring(B.getCharIndex())},this.resume=function(){P.streamer._halted?(Y=!1,P.streamer.parseChunk(f,!0)):setTimeout(P.resume,3)},this.aborted=function(){return M},this.abort=function(){M=!0,B.abort(),$.meta.aborted=!0,A(b.complete)&&b.complete($),f=""},this.guessLineEndings=function(le,re){le=le.substring(0,1048576);var re=new RegExp(y(re)+"([^]*?)"+y(re),"gm"),ie=(le=le.replace(re,"")).split("\r"),re=le.split(`
`),le=1<re.length&&re[0].length<ie[0].length;if(ie.length===1||le)return`
`;for(var de=0,t=0;t<ie.length;t++)ie[t][0]===`
`&&de++;return de>=ie.length/2?`\r
`:"\r"}}function y(b){return b.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function u(b){var f=(b=b||{}).delimiter,B=b.newline,R=b.comments,h=b.step,O=b.preview,a=b.fastMode,j=null,ne=!1,P=b.quoteChar==null?'"':b.quoteChar,ee=P;if(b.escapeChar!==void 0&&(ee=b.escapeChar),(typeof f!="string"||-1<p.BAD_DELIMITERS.indexOf(f))&&(f=","),R===f)throw new Error("Comment character same as delimiter");R===!0?R="#":(typeof R!="string"||-1<p.BAD_DELIMITERS.indexOf(R))&&(R=!1),B!==`
`&&B!=="\r"&&B!==`\r
`&&(B=`
`);var D=0,Y=!1;this.parse=function(M,T,$){if(typeof M!="string")throw new Error("Input must be a string");var G=M.length,W=f.length,oe=B.length,ue=R.length,Q=A(h),te=[],ie=[],re=[],le=D=0;if(!M)return J();if(a||a!==!1&&M.indexOf(P)===-1){for(var de=M.split(B),t=0;t<de.length;t++){if(re=de[t],D+=re.length,t!==de.length-1)D+=B.length;else if($)return J();if(!R||re.substring(0,ue)!==R){if(Q){if(te=[],U(re.split(f)),q(),Y)return J()}else U(re.split(f));if(O&&O<=t)return te=te.slice(0,O),J(!0)}}return J()}for(var F=M.indexOf(f,D),N=M.indexOf(B,D),_=new RegExp(y(ee)+y(P),"g"),g=M.indexOf(P,D);;)if(M[D]===P)for(g=D,D++;;){if((g=M.indexOf(P,g+1))===-1)return $||ie.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:te.length,index:D}),z();if(g===G-1)return z(M.substring(D,g).replace(_,P));if(P===ee&&M[g+1]===ee)g++;else if(P===ee||g===0||M[g-1]!==ee){F!==-1&&F<g+1&&(F=M.indexOf(f,g+1));var I=H((N=N!==-1&&N<g+1?M.indexOf(B,g+1):N)===-1?F:Math.min(F,N));if(M.substr(g+1+I,W)===f){re.push(M.substring(D,g).replace(_,P)),M[D=g+1+I+W]!==P&&(g=M.indexOf(P,D)),F=M.indexOf(f,D),N=M.indexOf(B,D);break}if(I=H(N),M.substring(g+1+I,g+1+I+oe)===B){if(re.push(M.substring(D,g).replace(_,P)),V(g+1+I+oe),F=M.indexOf(f,D),g=M.indexOf(P,D),Q&&(q(),Y))return J();if(O&&te.length>=O)return J(!0);break}ie.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:te.length,index:D}),g++}}else if(R&&re.length===0&&M.substring(D,D+ue)===R){if(N===-1)return J();D=N+oe,N=M.indexOf(B,D),F=M.indexOf(f,D)}else if(F!==-1&&(F<N||N===-1))re.push(M.substring(D,F)),D=F+W,F=M.indexOf(f,D);else{if(N===-1)break;if(re.push(M.substring(D,N)),V(N+oe),Q&&(q(),Y))return J();if(O&&te.length>=O)return J(!0)}return z();function U(X){te.push(X),le=D}function H(X){var ae=0;return ae=X!==-1&&(X=M.substring(g+1,X))&&X.trim()===""?X.length:ae}function z(X){return $||(X===void 0&&(X=M.substring(D)),re.push(X),D=G,U(re),Q&&q()),J()}function V(X){D=X,U(re),re=[],N=M.indexOf(B,D)}function J(X){if(b.header&&!T&&te.length&&!ne){var ae=te[0],se={},ye=new Set(ae);let Be=!1;for(let he=0;he<ae.length;he++){let be=ae[he];if(se[be=A(b.transformHeader)?b.transformHeader(be,he):be]){let pe,Te=se[be];for(;pe=be+"_"+Te,Te++,ye.has(pe););ye.add(pe),ae[he]=pe,se[be]++,Be=!0,(j=j===null?{}:j)[pe]=be}else se[be]=1,ae[he]=be;ye.add(be)}Be&&console.warn("Duplicate headers found and renamed."),ne=!0}return{data:te,errors:ie,meta:{delimiter:f,linebreak:B,aborted:Y,truncated:!!X,cursor:le+(T||0),renamedHeaders:j}}}function q(){h(J()),te=[],ie=[]}},this.abort=function(){Y=!0},this.getCharIndex=function(){return D}}function w(b){var f=b.data,B=s[f.workerId],R=!1;if(f.error)B.userError(f.error,f.file);else if(f.results&&f.results.data){var h={abort:function(){R=!0,E(f.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:S,resume:S};if(A(B.userStep)){for(var O=0;O<f.results.data.length&&(B.userStep({data:f.results.data[O],errors:f.results.errors,meta:f.results.meta},h),!R);O++);delete f.results}else A(B.userChunk)&&(B.userChunk(f.results,h,f.file),delete f.results)}f.finished&&!R&&E(f.workerId,f.results)}function E(b,f){var B=s[b];A(B.userComplete)&&B.userComplete(f),B.terminate(),delete s[b]}function S(){throw new Error("Not implemented.")}function x(b){if(typeof b!="object"||b===null)return b;var f,B=Array.isArray(b)?[]:{};for(f in b)B[f]=x(b[f]);return B}function L(b,f){return function(){b.apply(f,arguments)}}function A(b){return typeof b=="function"}return p.parse=function(b,f){var B=(f=f||{}).dynamicTyping||!1;if(A(B)&&(f.dynamicTypingFunction=B,B={}),f.dynamicTyping=B,f.transform=!!A(f.transform)&&f.transform,!f.worker||!p.WORKERS_SUPPORTED)return B=null,p.NODE_STREAM_INPUT,typeof b=="string"?(b=(R=>R.charCodeAt(0)!==65279?R:R.slice(1))(b),B=new(f.download?m:c)(f)):b.readable===!0&&A(b.read)&&A(b.on)?B=new v(f):(o.File&&b instanceof File||b instanceof Object)&&(B=new C(f)),B.stream(b);(B=(()=>{var R;return!!p.WORKERS_SUPPORTED&&(R=(()=>{var h=o.URL||o.webkitURL||null,O=e.toString();return p.BLOB_URL||(p.BLOB_URL=h.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",O,")();"],{type:"text/javascript"})))})(),(R=new o.Worker(R)).onmessage=w,R.id=l++,s[R.id]=R)})()).userStep=f.step,B.userChunk=f.chunk,B.userComplete=f.complete,B.userError=f.error,f.step=A(f.step),f.chunk=A(f.chunk),f.complete=A(f.complete),f.error=A(f.error),delete f.worker,B.postMessage({input:b,config:f,workerId:B.id})},p.unparse=function(b,f){var B=!1,R=!0,h=",",O=`\r
`,a='"',j=a+a,ne=!1,P=null,ee=!1,D=((()=>{if(typeof f=="object"){if(typeof f.delimiter!="string"||p.BAD_DELIMITERS.filter(function(T){return f.delimiter.indexOf(T)!==-1}).length||(h=f.delimiter),typeof f.quotes!="boolean"&&typeof f.quotes!="function"&&!Array.isArray(f.quotes)||(B=f.quotes),typeof f.skipEmptyLines!="boolean"&&typeof f.skipEmptyLines!="string"||(ne=f.skipEmptyLines),typeof f.newline=="string"&&(O=f.newline),typeof f.quoteChar=="string"&&(a=f.quoteChar),typeof f.header=="boolean"&&(R=f.header),Array.isArray(f.columns)){if(f.columns.length===0)throw new Error("Option columns is empty");P=f.columns}f.escapeChar!==void 0&&(j=f.escapeChar+a),f.escapeFormulae instanceof RegExp?ee=f.escapeFormulae:typeof f.escapeFormulae=="boolean"&&f.escapeFormulae&&(ee=/^[=+\-@\t\r].*$/)}})(),new RegExp(y(a),"g"));if(typeof b=="string"&&(b=JSON.parse(b)),Array.isArray(b)){if(!b.length||Array.isArray(b[0]))return Y(null,b,ne);if(typeof b[0]=="object")return Y(P||Object.keys(b[0]),b,ne)}else if(typeof b=="object")return typeof b.data=="string"&&(b.data=JSON.parse(b.data)),Array.isArray(b.data)&&(b.fields||(b.fields=b.meta&&b.meta.fields||P),b.fields||(b.fields=Array.isArray(b.data[0])?b.fields:typeof b.data[0]=="object"?Object.keys(b.data[0]):[]),Array.isArray(b.data[0])||typeof b.data[0]=="object"||(b.data=[b.data])),Y(b.fields||[],b.data||[],ne);throw new Error("Unable to serialize unrecognized input");function Y(T,$,G){var W="",oe=(typeof T=="string"&&(T=JSON.parse(T)),typeof $=="string"&&($=JSON.parse($)),Array.isArray(T)&&0<T.length),ue=!Array.isArray($[0]);if(oe&&R){for(var Q=0;Q<T.length;Q++)0<Q&&(W+=h),W+=M(T[Q],Q);0<$.length&&(W+=O)}for(var te=0;te<$.length;te++){var ie=(oe?T:$[te]).length,re=!1,le=oe?Object.keys($[te]).length===0:$[te].length===0;if(G&&!oe&&(re=G==="greedy"?$[te].join("").trim()==="":$[te].length===1&&$[te][0].length===0),G==="greedy"&&oe){for(var de=[],t=0;t<ie;t++){var F=ue?T[t]:t;de.push($[te][F])}re=de.join("").trim()===""}if(!re){for(var N=0;N<ie;N++){0<N&&!le&&(W+=h);var _=oe&&ue?T[N]:N;W+=M($[te][_],N)}te<$.length-1&&(!G||0<ie&&!le)&&(W+=O)}}return W}function M(T,$){var G,W;return T==null?"":T.constructor===Date?JSON.stringify(T).slice(1,25):(W=!1,ee&&typeof T=="string"&&ee.test(T)&&(T="'"+T,W=!0),G=T.toString().replace(D,j),(W=W||B===!0||typeof B=="function"&&B(T,$)||Array.isArray(B)&&B[$]||((oe,ue)=>{for(var Q=0;Q<ue.length;Q++)if(-1<oe.indexOf(ue[Q]))return!0;return!1})(G,p.BAD_DELIMITERS)||-1<G.indexOf(h)||G.charAt(0)===" "||G.charAt(G.length-1)===" ")?a+G+a:G)}},p.RECORD_SEP=String.fromCharCode(30),p.UNIT_SEP=String.fromCharCode(31),p.BYTE_ORDER_MARK="\uFEFF",p.BAD_DELIMITERS=["\r",`
`,'"',p.BYTE_ORDER_MARK],p.WORKERS_SUPPORTED=!r&&!!o.Worker,p.NODE_STREAM_INPUT=1,p.LocalChunkSize=10485760,p.RemoteChunkSize=5242880,p.DefaultDelimiter=",",p.Parser=u,p.ParserHandle=d,p.NetworkStreamer=m,p.FileStreamer=C,p.StringStreamer=c,p.ReadableStreamStreamer=v,o.jQuery&&((n=o.jQuery).fn.parse=function(b){var f=b.config||{},B=[];return this.each(function(O){if(!(n(this).prop("tagName").toUpperCase()==="INPUT"&&n(this).attr("type").toLowerCase()==="file"&&o.FileReader)||!this.files||this.files.length===0)return!0;for(var a=0;a<this.files.length;a++)B.push({file:this.files[a],inputElem:this,instanceConfig:n.extend({},f)})}),R(),this;function R(){if(B.length===0)A(b.complete)&&b.complete();else{var O,a,j,ne,P=B[0];if(A(b.before)){var ee=b.before(P.file,P.inputElem);if(typeof ee=="object"){if(ee.action==="abort")return O="AbortError",a=P.file,j=P.inputElem,ne=ee.reason,void(A(b.error)&&b.error({name:O},a,j,ne));if(ee.action==="skip")return void h();typeof ee.config=="object"&&(P.instanceConfig=n.extend(P.instanceConfig,ee.config))}else if(ee==="skip")return void h()}var D=P.instanceConfig.complete;P.instanceConfig.complete=function(Y){A(D)&&D(Y,P.file,P.inputElem),h()},p.parse(P.file,P.instanceConfig)}}function h(){B.splice(0,1),R()}}),i&&(o.onmessage=function(b){b=b.data,p.WORKER_ID===void 0&&b&&(p.WORKER_ID=b.workerId),typeof b.input=="string"?o.postMessage({workerId:p.WORKER_ID,results:p.parse(b.input,b.config),finished:!0}):(o.File&&b.input instanceof File||b.input instanceof Object)&&(b=p.parse(b.input,b.config))&&o.postMessage({workerId:p.WORKER_ID,results:b,finished:!0})}),(m.prototype=Object.create(k.prototype)).constructor=m,(C.prototype=Object.create(k.prototype)).constructor=C,(c.prototype=Object.create(c.prototype)).constructor=c,(v.prototype=Object.create(k.prototype)).constructor=v,p})});var gt=Ut((Wt,ht)=>{(function(e){typeof Wt=="object"&&typeof ht<"u"?ht.exports=e():typeof define=="function"&&define.amd?define([],e):(typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:this).JSZip=e()})(function(){return function e(o,n,r){function i(p,k){if(!n[p]){if(!o[p]){var m=typeof Ze=="function"&&Ze;if(!k&&m)return m(p,!0);if(s)return s(p,!0);var C=new Error("Cannot find module '"+p+"'");throw C.code="MODULE_NOT_FOUND",C}var c=n[p]={exports:{}};o[p][0].call(c.exports,function(v){var d=o[p][1][v];return i(d||v)},c,c.exports,e,o,n,r)}return n[p].exports}for(var s=typeof Ze=="function"&&Ze,l=0;l<r.length;l++)i(r[l]);return i}({1:[function(e,o,n){"use strict";var r=e("./utils"),i=e("./support"),s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";n.encode=function(l){for(var p,k,m,C,c,v,d,y=[],u=0,w=l.length,E=w,S=r.getTypeOf(l)!=="string";u<l.length;)E=w-u,m=S?(p=l[u++],k=u<w?l[u++]:0,u<w?l[u++]:0):(p=l.charCodeAt(u++),k=u<w?l.charCodeAt(u++):0,u<w?l.charCodeAt(u++):0),C=p>>2,c=(3&p)<<4|k>>4,v=1<E?(15&k)<<2|m>>6:64,d=2<E?63&m:64,y.push(s.charAt(C)+s.charAt(c)+s.charAt(v)+s.charAt(d));return y.join("")},n.decode=function(l){var p,k,m,C,c,v,d=0,y=0,u="data:";if(l.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var w,E=3*(l=l.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(l.charAt(l.length-1)===s.charAt(64)&&E--,l.charAt(l.length-2)===s.charAt(64)&&E--,E%1!=0)throw new Error("Invalid base64 input, bad content length.");for(w=i.uint8array?new Uint8Array(0|E):new Array(0|E);d<l.length;)p=s.indexOf(l.charAt(d++))<<2|(C=s.indexOf(l.charAt(d++)))>>4,k=(15&C)<<4|(c=s.indexOf(l.charAt(d++)))>>2,m=(3&c)<<6|(v=s.indexOf(l.charAt(d++))),w[y++]=p,c!==64&&(w[y++]=k),v!==64&&(w[y++]=m);return w}},{"./support":30,"./utils":32}],2:[function(e,o,n){"use strict";var r=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),l=e("./stream/DataLengthProbe");function p(k,m,C,c,v){this.compressedSize=k,this.uncompressedSize=m,this.crc32=C,this.compression=c,this.compressedContent=v}p.prototype={getContentWorker:function(){var k=new i(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")),m=this;return k.on("end",function(){if(this.streamInfo.data_length!==m.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),k},getCompressedWorker:function(){return new i(r.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},p.createWorkerFrom=function(k,m,C){return k.pipe(new s).pipe(new l("uncompressedSize")).pipe(m.compressWorker(C)).pipe(new l("compressedSize")).withStreamInfo("compression",m)},o.exports=p},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,o,n){"use strict";var r=e("./stream/GenericWorker");n.STORE={magic:"\0\0",compressWorker:function(){return new r("STORE compression")},uncompressWorker:function(){return new r("STORE decompression")}},n.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,o,n){"use strict";var r=e("./utils"),i=function(){for(var s,l=[],p=0;p<256;p++){s=p;for(var k=0;k<8;k++)s=1&s?3988292384^s>>>1:s>>>1;l[p]=s}return l}();o.exports=function(s,l){return s!==void 0&&s.length?r.getTypeOf(s)!=="string"?function(p,k,m,C){var c=i,v=C+m;p^=-1;for(var d=C;d<v;d++)p=p>>>8^c[255&(p^k[d])];return-1^p}(0|l,s,s.length,0):function(p,k,m,C){var c=i,v=C+m;p^=-1;for(var d=C;d<v;d++)p=p>>>8^c[255&(p^k.charCodeAt(d))];return-1^p}(0|l,s,s.length,0):0}},{"./utils":32}],5:[function(e,o,n){"use strict";n.base64=!1,n.binary=!1,n.dir=!1,n.createFolders=!0,n.date=null,n.compression=null,n.compressionOptions=null,n.comment=null,n.unixPermissions=null,n.dosPermissions=null},{}],6:[function(e,o,n){"use strict";var r=null;r=typeof Promise<"u"?Promise:e("lie"),o.exports={Promise:r}},{lie:37}],7:[function(e,o,n){"use strict";var r=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Uint32Array<"u",i=e("pako"),s=e("./utils"),l=e("./stream/GenericWorker"),p=r?"uint8array":"array";function k(m,C){l.call(this,"FlateWorker/"+m),this._pako=null,this._pakoAction=m,this._pakoOptions=C,this.meta={}}n.magic="\b\0",s.inherits(k,l),k.prototype.processChunk=function(m){this.meta=m.meta,this._pako===null&&this._createPako(),this._pako.push(s.transformTo(p,m.data),!1)},k.prototype.flush=function(){l.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},k.prototype.cleanUp=function(){l.prototype.cleanUp.call(this),this._pako=null},k.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var m=this;this._pako.onData=function(C){m.push({data:C,meta:m.meta})}},n.compressWorker=function(m){return new k("Deflate",m)},n.uncompressWorker=function(){return new k("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,o,n){"use strict";function r(c,v){var d,y="";for(d=0;d<v;d++)y+=String.fromCharCode(255&c),c>>>=8;return y}function i(c,v,d,y,u,w){var E,S,x=c.file,L=c.compression,A=w!==p.utf8encode,b=s.transformTo("string",w(x.name)),f=s.transformTo("string",p.utf8encode(x.name)),B=x.comment,R=s.transformTo("string",w(B)),h=s.transformTo("string",p.utf8encode(B)),O=f.length!==x.name.length,a=h.length!==B.length,j="",ne="",P="",ee=x.dir,D=x.date,Y={crc32:0,compressedSize:0,uncompressedSize:0};v&&!d||(Y.crc32=c.crc32,Y.compressedSize=c.compressedSize,Y.uncompressedSize=c.uncompressedSize);var M=0;v&&(M|=8),A||!O&&!a||(M|=2048);var T=0,$=0;ee&&(T|=16),u==="UNIX"?($=798,T|=function(W,oe){var ue=W;return W||(ue=oe?16893:33204),(65535&ue)<<16}(x.unixPermissions,ee)):($=20,T|=function(W){return 63&(W||0)}(x.dosPermissions)),E=D.getUTCHours(),E<<=6,E|=D.getUTCMinutes(),E<<=5,E|=D.getUTCSeconds()/2,S=D.getUTCFullYear()-1980,S<<=4,S|=D.getUTCMonth()+1,S<<=5,S|=D.getUTCDate(),O&&(ne=r(1,1)+r(k(b),4)+f,j+="up"+r(ne.length,2)+ne),a&&(P=r(1,1)+r(k(R),4)+h,j+="uc"+r(P.length,2)+P);var G="";return G+=`
\0`,G+=r(M,2),G+=L.magic,G+=r(E,2),G+=r(S,2),G+=r(Y.crc32,4),G+=r(Y.compressedSize,4),G+=r(Y.uncompressedSize,4),G+=r(b.length,2),G+=r(j.length,2),{fileRecord:m.LOCAL_FILE_HEADER+G+b+j,dirRecord:m.CENTRAL_FILE_HEADER+r($,2)+G+r(R.length,2)+"\0\0\0\0"+r(T,4)+r(y,4)+b+j+R}}var s=e("../utils"),l=e("../stream/GenericWorker"),p=e("../utf8"),k=e("../crc32"),m=e("../signature");function C(c,v,d,y){l.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=v,this.zipPlatform=d,this.encodeFileName=y,this.streamFiles=c,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}s.inherits(C,l),C.prototype.push=function(c){var v=c.meta.percent||0,d=this.entriesCount,y=this._sources.length;this.accumulate?this.contentBuffer.push(c):(this.bytesWritten+=c.data.length,l.prototype.push.call(this,{data:c.data,meta:{currentFile:this.currentFile,percent:d?(v+100*(d-y-1))/d:100}}))},C.prototype.openedSource=function(c){this.currentSourceOffset=this.bytesWritten,this.currentFile=c.file.name;var v=this.streamFiles&&!c.file.dir;if(v){var d=i(c,v,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:d.fileRecord,meta:{percent:0}})}else this.accumulate=!0},C.prototype.closedSource=function(c){this.accumulate=!1;var v=this.streamFiles&&!c.file.dir,d=i(c,v,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(d.dirRecord),v)this.push({data:function(y){return m.DATA_DESCRIPTOR+r(y.crc32,4)+r(y.compressedSize,4)+r(y.uncompressedSize,4)}(c),meta:{percent:100}});else for(this.push({data:d.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},C.prototype.flush=function(){for(var c=this.bytesWritten,v=0;v<this.dirRecords.length;v++)this.push({data:this.dirRecords[v],meta:{percent:100}});var d=this.bytesWritten-c,y=function(u,w,E,S,x){var L=s.transformTo("string",x(S));return m.CENTRAL_DIRECTORY_END+"\0\0\0\0"+r(u,2)+r(u,2)+r(w,4)+r(E,4)+r(L.length,2)+L}(this.dirRecords.length,d,c,this.zipComment,this.encodeFileName);this.push({data:y,meta:{percent:100}})},C.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},C.prototype.registerPrevious=function(c){this._sources.push(c);var v=this;return c.on("data",function(d){v.processChunk(d)}),c.on("end",function(){v.closedSource(v.previous.streamInfo),v._sources.length?v.prepareNextSource():v.end()}),c.on("error",function(d){v.error(d)}),this},C.prototype.resume=function(){return!!l.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},C.prototype.error=function(c){var v=this._sources;if(!l.prototype.error.call(this,c))return!1;for(var d=0;d<v.length;d++)try{v[d].error(c)}catch{}return!0},C.prototype.lock=function(){l.prototype.lock.call(this);for(var c=this._sources,v=0;v<c.length;v++)c[v].lock()},o.exports=C},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,o,n){"use strict";var r=e("../compressions"),i=e("./ZipFileWorker");n.generateWorker=function(s,l,p){var k=new i(l.streamFiles,p,l.platform,l.encodeFileName),m=0;try{s.forEach(function(C,c){m++;var v=function(w,E){var S=w||E,x=r[S];if(!x)throw new Error(S+" is not a valid compression method !");return x}(c.options.compression,l.compression),d=c.options.compressionOptions||l.compressionOptions||{},y=c.dir,u=c.date;c._compressWorker(v,d).withStreamInfo("file",{name:C,dir:y,date:u,comment:c.comment||"",unixPermissions:c.unixPermissions,dosPermissions:c.dosPermissions}).pipe(k)}),k.entriesCount=m}catch(C){k.error(C)}return k}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,o,n){"use strict";function r(){if(!(this instanceof r))return new r;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var i=new r;for(var s in this)typeof this[s]!="function"&&(i[s]=this[s]);return i}}(r.prototype=e("./object")).loadAsync=e("./load"),r.support=e("./support"),r.defaults=e("./defaults"),r.version="3.10.1",r.loadAsync=function(i,s){return new r().loadAsync(i,s)},r.external=e("./external"),o.exports=r},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,o,n){"use strict";var r=e("./utils"),i=e("./external"),s=e("./utf8"),l=e("./zipEntries"),p=e("./stream/Crc32Probe"),k=e("./nodejsUtils");function m(C){return new i.Promise(function(c,v){var d=C.decompressed.getContentWorker().pipe(new p);d.on("error",function(y){v(y)}).on("end",function(){d.streamInfo.crc32!==C.decompressed.crc32?v(new Error("Corrupted zip : CRC32 mismatch")):c()}).resume()})}o.exports=function(C,c){var v=this;return c=r.extend(c||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:s.utf8decode}),k.isNode&&k.isStream(C)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):r.prepareContent("the loaded zip file",C,!0,c.optimizedBinaryString,c.base64).then(function(d){var y=new l(c);return y.load(d),y}).then(function(d){var y=[i.Promise.resolve(d)],u=d.files;if(c.checkCRC32)for(var w=0;w<u.length;w++)y.push(m(u[w]));return i.Promise.all(y)}).then(function(d){for(var y=d.shift(),u=y.files,w=0;w<u.length;w++){var E=u[w],S=E.fileNameStr,x=r.resolve(E.fileNameStr);v.file(x,E.decompressed,{binary:!0,optimizedBinaryString:!0,date:E.date,dir:E.dir,comment:E.fileCommentStr.length?E.fileCommentStr:null,unixPermissions:E.unixPermissions,dosPermissions:E.dosPermissions,createFolders:c.createFolders}),E.dir||(v.file(x).unsafeOriginalName=S)}return y.zipComment.length&&(v.comment=y.zipComment),v})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,o,n){"use strict";var r=e("../utils"),i=e("../stream/GenericWorker");function s(l,p){i.call(this,"Nodejs stream input adapter for "+l),this._upstreamEnded=!1,this._bindStream(p)}r.inherits(s,i),s.prototype._bindStream=function(l){var p=this;(this._stream=l).pause(),l.on("data",function(k){p.push({data:k,meta:{percent:0}})}).on("error",function(k){p.isPaused?this.generatedError=k:p.error(k)}).on("end",function(){p.isPaused?p._upstreamEnded=!0:p.end()})},s.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},o.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,o,n){"use strict";var r=e("readable-stream").Readable;function i(s,l,p){r.call(this,l),this._helper=s;var k=this;s.on("data",function(m,C){k.push(m)||k._helper.pause(),p&&p(C)}).on("error",function(m){k.emit("error",m)}).on("end",function(){k.push(null)})}e("../utils").inherits(i,r),i.prototype._read=function(){this._helper.resume()},o.exports=i},{"../utils":32,"readable-stream":16}],14:[function(e,o,n){"use strict";o.exports={isNode:typeof Buffer<"u",newBufferFrom:function(r,i){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(r,i);if(typeof r=="number")throw new Error('The "data" argument must not be a number');return new Buffer(r,i)},allocBuffer:function(r){if(Buffer.alloc)return Buffer.alloc(r);var i=new Buffer(r);return i.fill(0),i},isBuffer:function(r){return Buffer.isBuffer(r)},isStream:function(r){return r&&typeof r.on=="function"&&typeof r.pause=="function"&&typeof r.resume=="function"}}},{}],15:[function(e,o,n){"use strict";function r(x,L,A){var b,f=s.getTypeOf(L),B=s.extend(A||{},k);B.date=B.date||new Date,B.compression!==null&&(B.compression=B.compression.toUpperCase()),typeof B.unixPermissions=="string"&&(B.unixPermissions=parseInt(B.unixPermissions,8)),B.unixPermissions&&16384&B.unixPermissions&&(B.dir=!0),B.dosPermissions&&16&B.dosPermissions&&(B.dir=!0),B.dir&&(x=u(x)),B.createFolders&&(b=y(x))&&w.call(this,b,!0);var R=f==="string"&&B.binary===!1&&B.base64===!1;A&&A.binary!==void 0||(B.binary=!R),(L instanceof m&&L.uncompressedSize===0||B.dir||!L||L.length===0)&&(B.base64=!1,B.binary=!0,L="",B.compression="STORE",f="string");var h=null;h=L instanceof m||L instanceof l?L:v.isNode&&v.isStream(L)?new d(x,L):s.prepareContent(x,L,B.binary,B.optimizedBinaryString,B.base64);var O=new C(x,h,B);this.files[x]=O}var i=e("./utf8"),s=e("./utils"),l=e("./stream/GenericWorker"),p=e("./stream/StreamHelper"),k=e("./defaults"),m=e("./compressedObject"),C=e("./zipObject"),c=e("./generate"),v=e("./nodejsUtils"),d=e("./nodejs/NodejsStreamInputAdapter"),y=function(x){x.slice(-1)==="/"&&(x=x.substring(0,x.length-1));var L=x.lastIndexOf("/");return 0<L?x.substring(0,L):""},u=function(x){return x.slice(-1)!=="/"&&(x+="/"),x},w=function(x,L){return L=L!==void 0?L:k.createFolders,x=u(x),this.files[x]||r.call(this,x,null,{dir:!0,createFolders:L}),this.files[x]};function E(x){return Object.prototype.toString.call(x)==="[object RegExp]"}var S={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(x){var L,A,b;for(L in this.files)b=this.files[L],(A=L.slice(this.root.length,L.length))&&L.slice(0,this.root.length)===this.root&&x(A,b)},filter:function(x){var L=[];return this.forEach(function(A,b){x(A,b)&&L.push(b)}),L},file:function(x,L,A){if(arguments.length!==1)return x=this.root+x,r.call(this,x,L,A),this;if(E(x)){var b=x;return this.filter(function(B,R){return!R.dir&&b.test(B)})}var f=this.files[this.root+x];return f&&!f.dir?f:null},folder:function(x){if(!x)return this;if(E(x))return this.filter(function(f,B){return B.dir&&x.test(f)});var L=this.root+x,A=w.call(this,L),b=this.clone();return b.root=A.name,b},remove:function(x){x=this.root+x;var L=this.files[x];if(L||(x.slice(-1)!=="/"&&(x+="/"),L=this.files[x]),L&&!L.dir)delete this.files[x];else for(var A=this.filter(function(f,B){return B.name.slice(0,x.length)===x}),b=0;b<A.length;b++)delete this.files[A[b].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(x){var L,A={};try{if((A=s.extend(x||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=A.type.toLowerCase(),A.compression=A.compression.toUpperCase(),A.type==="binarystring"&&(A.type="string"),!A.type)throw new Error("No output type specified.");s.checkSupport(A.type),A.platform!=="darwin"&&A.platform!=="freebsd"&&A.platform!=="linux"&&A.platform!=="sunos"||(A.platform="UNIX"),A.platform==="win32"&&(A.platform="DOS");var b=A.comment||this.comment||"";L=c.generateWorker(this,A,b)}catch(f){(L=new l("error")).error(f)}return new p(L,A.type||"string",A.mimeType)},generateAsync:function(x,L){return this.generateInternalStream(x).accumulate(L)},generateNodeStream:function(x,L){return(x=x||{}).type||(x.type="nodebuffer"),this.generateInternalStream(x).toNodejsStream(L)}};o.exports=S},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,o,n){"use strict";o.exports=e("stream")},{stream:void 0}],17:[function(e,o,n){"use strict";var r=e("./DataReader");function i(s){r.call(this,s);for(var l=0;l<this.data.length;l++)s[l]=255&s[l]}e("../utils").inherits(i,r),i.prototype.byteAt=function(s){return this.data[this.zero+s]},i.prototype.lastIndexOfSignature=function(s){for(var l=s.charCodeAt(0),p=s.charCodeAt(1),k=s.charCodeAt(2),m=s.charCodeAt(3),C=this.length-4;0<=C;--C)if(this.data[C]===l&&this.data[C+1]===p&&this.data[C+2]===k&&this.data[C+3]===m)return C-this.zero;return-1},i.prototype.readAndCheckSignature=function(s){var l=s.charCodeAt(0),p=s.charCodeAt(1),k=s.charCodeAt(2),m=s.charCodeAt(3),C=this.readData(4);return l===C[0]&&p===C[1]&&k===C[2]&&m===C[3]},i.prototype.readData=function(s){if(this.checkOffset(s),s===0)return[];var l=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,l},o.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,o,n){"use strict";var r=e("../utils");function i(s){this.data=s,this.length=s.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(s){this.checkIndex(this.index+s)},checkIndex:function(s){if(this.length<this.zero+s||s<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+s+"). Corrupted zip ?")},setIndex:function(s){this.checkIndex(s),this.index=s},skip:function(s){this.setIndex(this.index+s)},byteAt:function(){},readInt:function(s){var l,p=0;for(this.checkOffset(s),l=this.index+s-1;l>=this.index;l--)p=(p<<8)+this.byteAt(l);return this.index+=s,p},readString:function(s){return r.transformTo("string",this.readData(s))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var s=this.readInt(4);return new Date(Date.UTC(1980+(s>>25&127),(s>>21&15)-1,s>>16&31,s>>11&31,s>>5&63,(31&s)<<1))}},o.exports=i},{"../utils":32}],19:[function(e,o,n){"use strict";var r=e("./Uint8ArrayReader");function i(s){r.call(this,s)}e("../utils").inherits(i,r),i.prototype.readData=function(s){this.checkOffset(s);var l=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,l},o.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,o,n){"use strict";var r=e("./DataReader");function i(s){r.call(this,s)}e("../utils").inherits(i,r),i.prototype.byteAt=function(s){return this.data.charCodeAt(this.zero+s)},i.prototype.lastIndexOfSignature=function(s){return this.data.lastIndexOf(s)-this.zero},i.prototype.readAndCheckSignature=function(s){return s===this.readData(4)},i.prototype.readData=function(s){this.checkOffset(s);var l=this.data.slice(this.zero+this.index,this.zero+this.index+s);return this.index+=s,l},o.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,o,n){"use strict";var r=e("./ArrayReader");function i(s){r.call(this,s)}e("../utils").inherits(i,r),i.prototype.readData=function(s){if(this.checkOffset(s),s===0)return new Uint8Array(0);var l=this.data.subarray(this.zero+this.index,this.zero+this.index+s);return this.index+=s,l},o.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,o,n){"use strict";var r=e("../utils"),i=e("../support"),s=e("./ArrayReader"),l=e("./StringReader"),p=e("./NodeBufferReader"),k=e("./Uint8ArrayReader");o.exports=function(m){var C=r.getTypeOf(m);return r.checkSupport(C),C!=="string"||i.uint8array?C==="nodebuffer"?new p(m):i.uint8array?new k(r.transformTo("uint8array",m)):new s(r.transformTo("array",m)):new l(m)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,o,n){"use strict";n.LOCAL_FILE_HEADER="PK",n.CENTRAL_FILE_HEADER="PK",n.CENTRAL_DIRECTORY_END="PK",n.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",n.ZIP64_CENTRAL_DIRECTORY_END="PK",n.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(e,o,n){"use strict";var r=e("./GenericWorker"),i=e("../utils");function s(l){r.call(this,"ConvertWorker to "+l),this.destType=l}i.inherits(s,r),s.prototype.processChunk=function(l){this.push({data:i.transformTo(this.destType,l.data),meta:l.meta})},o.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(e,o,n){"use strict";var r=e("./GenericWorker"),i=e("../crc32");function s(){r.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(s,r),s.prototype.processChunk=function(l){this.streamInfo.crc32=i(l.data,this.streamInfo.crc32||0),this.push(l)},o.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,o,n){"use strict";var r=e("../utils"),i=e("./GenericWorker");function s(l){i.call(this,"DataLengthProbe for "+l),this.propName=l,this.withStreamInfo(l,0)}r.inherits(s,i),s.prototype.processChunk=function(l){if(l){var p=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=p+l.data.length}i.prototype.processChunk.call(this,l)},o.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(e,o,n){"use strict";var r=e("../utils"),i=e("./GenericWorker");function s(l){i.call(this,"DataWorker");var p=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,l.then(function(k){p.dataIsReady=!0,p.data=k,p.max=k&&k.length||0,p.type=r.getTypeOf(k),p.isPaused||p._tickAndRepeat()},function(k){p.error(k)})}r.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,r.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(r.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var l=null,p=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":l=this.data.substring(this.index,p);break;case"uint8array":l=this.data.subarray(this.index,p);break;case"array":case"nodebuffer":l=this.data.slice(this.index,p)}return this.index=p,this.push({data:l,meta:{percent:this.max?this.index/this.max*100:0}})},o.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(e,o,n){"use strict";function r(i){this.name=i||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}r.prototype={push:function(i){this.emit("data",i)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(i){this.emit("error",i)}return!0},error:function(i){return!this.isFinished&&(this.isPaused?this.generatedError=i:(this.isFinished=!0,this.emit("error",i),this.previous&&this.previous.error(i),this.cleanUp()),!0)},on:function(i,s){return this._listeners[i].push(s),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(i,s){if(this._listeners[i])for(var l=0;l<this._listeners[i].length;l++)this._listeners[i][l].call(this,s)},pipe:function(i){return i.registerPrevious(this)},registerPrevious:function(i){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=i.streamInfo,this.mergeStreamInfo(),this.previous=i;var s=this;return i.on("data",function(l){s.processChunk(l)}),i.on("end",function(){s.end()}),i.on("error",function(l){s.error(l)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var i=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),i=!0),this.previous&&this.previous.resume(),!i},flush:function(){},processChunk:function(i){this.push(i)},withStreamInfo:function(i,s){return this.extraStreamInfo[i]=s,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var i in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,i)&&(this.streamInfo[i]=this.extraStreamInfo[i])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var i="Worker "+this.name;return this.previous?this.previous+" -> "+i:i}},o.exports=r},{}],29:[function(e,o,n){"use strict";var r=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),l=e("../base64"),p=e("../support"),k=e("../external"),m=null;if(p.nodestream)try{m=e("../nodejs/NodejsStreamOutputAdapter")}catch{}function C(v,d){return new k.Promise(function(y,u){var w=[],E=v._internalType,S=v._outputType,x=v._mimeType;v.on("data",function(L,A){w.push(L),d&&d(A)}).on("error",function(L){w=[],u(L)}).on("end",function(){try{var L=function(A,b,f){switch(A){case"blob":return r.newBlob(r.transformTo("arraybuffer",b),f);case"base64":return l.encode(b);default:return r.transformTo(A,b)}}(S,function(A,b){var f,B=0,R=null,h=0;for(f=0;f<b.length;f++)h+=b[f].length;switch(A){case"string":return b.join("");case"array":return Array.prototype.concat.apply([],b);case"uint8array":for(R=new Uint8Array(h),f=0;f<b.length;f++)R.set(b[f],B),B+=b[f].length;return R;case"nodebuffer":return Buffer.concat(b);default:throw new Error("concat : unsupported type '"+A+"'")}}(E,w),x);y(L)}catch(A){u(A)}w=[]}).resume()})}function c(v,d,y){var u=d;switch(d){case"blob":case"arraybuffer":u="uint8array";break;case"base64":u="string"}try{this._internalType=u,this._outputType=d,this._mimeType=y,r.checkSupport(u),this._worker=v.pipe(new i(u)),v.lock()}catch(w){this._worker=new s("error"),this._worker.error(w)}}c.prototype={accumulate:function(v){return C(this,v)},on:function(v,d){var y=this;return v==="data"?this._worker.on(v,function(u){d.call(y,u.data,u.meta)}):this._worker.on(v,function(){r.delay(d,arguments,y)}),this},resume:function(){return r.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(v){if(r.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new m(this,{objectMode:this._outputType!=="nodebuffer"},v)}},o.exports=c},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,o,n){"use strict";if(n.base64=!0,n.array=!0,n.string=!0,n.arraybuffer=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u",n.nodebuffer=typeof Buffer<"u",n.uint8array=typeof Uint8Array<"u",typeof ArrayBuffer>"u")n.blob=!1;else{var r=new ArrayBuffer(0);try{n.blob=new Blob([r],{type:"application/zip"}).size===0}catch{try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(r),n.blob=i.getBlob("application/zip").size===0}catch{n.blob=!1}}}try{n.nodestream=!!e("readable-stream").Readable}catch{n.nodestream=!1}},{"readable-stream":16}],31:[function(e,o,n){"use strict";for(var r=e("./utils"),i=e("./support"),s=e("./nodejsUtils"),l=e("./stream/GenericWorker"),p=new Array(256),k=0;k<256;k++)p[k]=252<=k?6:248<=k?5:240<=k?4:224<=k?3:192<=k?2:1;p[254]=p[254]=1;function m(){l.call(this,"utf-8 decode"),this.leftOver=null}function C(){l.call(this,"utf-8 encode")}n.utf8encode=function(c){return i.nodebuffer?s.newBufferFrom(c,"utf-8"):function(v){var d,y,u,w,E,S=v.length,x=0;for(w=0;w<S;w++)(64512&(y=v.charCodeAt(w)))==55296&&w+1<S&&(64512&(u=v.charCodeAt(w+1)))==56320&&(y=65536+(y-55296<<10)+(u-56320),w++),x+=y<128?1:y<2048?2:y<65536?3:4;for(d=i.uint8array?new Uint8Array(x):new Array(x),w=E=0;E<x;w++)(64512&(y=v.charCodeAt(w)))==55296&&w+1<S&&(64512&(u=v.charCodeAt(w+1)))==56320&&(y=65536+(y-55296<<10)+(u-56320),w++),y<128?d[E++]=y:(y<2048?d[E++]=192|y>>>6:(y<65536?d[E++]=224|y>>>12:(d[E++]=240|y>>>18,d[E++]=128|y>>>12&63),d[E++]=128|y>>>6&63),d[E++]=128|63&y);return d}(c)},n.utf8decode=function(c){return i.nodebuffer?r.transformTo("nodebuffer",c).toString("utf-8"):function(v){var d,y,u,w,E=v.length,S=new Array(2*E);for(d=y=0;d<E;)if((u=v[d++])<128)S[y++]=u;else if(4<(w=p[u]))S[y++]=65533,d+=w-1;else{for(u&=w===2?31:w===3?15:7;1<w&&d<E;)u=u<<6|63&v[d++],w--;1<w?S[y++]=65533:u<65536?S[y++]=u:(u-=65536,S[y++]=55296|u>>10&1023,S[y++]=56320|1023&u)}return S.length!==y&&(S.subarray?S=S.subarray(0,y):S.length=y),r.applyFromCharCode(S)}(c=r.transformTo(i.uint8array?"uint8array":"array",c))},r.inherits(m,l),m.prototype.processChunk=function(c){var v=r.transformTo(i.uint8array?"uint8array":"array",c.data);if(this.leftOver&&this.leftOver.length){if(i.uint8array){var d=v;(v=new Uint8Array(d.length+this.leftOver.length)).set(this.leftOver,0),v.set(d,this.leftOver.length)}else v=this.leftOver.concat(v);this.leftOver=null}var y=function(w,E){var S;for((E=E||w.length)>w.length&&(E=w.length),S=E-1;0<=S&&(192&w[S])==128;)S--;return S<0||S===0?E:S+p[w[S]]>E?S:E}(v),u=v;y!==v.length&&(i.uint8array?(u=v.subarray(0,y),this.leftOver=v.subarray(y,v.length)):(u=v.slice(0,y),this.leftOver=v.slice(y,v.length))),this.push({data:n.utf8decode(u),meta:c.meta})},m.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:n.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},n.Utf8DecodeWorker=m,r.inherits(C,l),C.prototype.processChunk=function(c){this.push({data:n.utf8encode(c.data),meta:c.meta})},n.Utf8EncodeWorker=C},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,o,n){"use strict";var r=e("./support"),i=e("./base64"),s=e("./nodejsUtils"),l=e("./external");function p(d){return d}function k(d,y){for(var u=0;u<d.length;++u)y[u]=255&d.charCodeAt(u);return y}e("setimmediate"),n.newBlob=function(d,y){n.checkSupport("blob");try{return new Blob([d],{type:y})}catch{try{var u=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return u.append(d),u.getBlob(y)}catch{throw new Error("Bug : can't construct the Blob.")}}};var m={stringifyByChunk:function(d,y,u){var w=[],E=0,S=d.length;if(S<=u)return String.fromCharCode.apply(null,d);for(;E<S;)y==="array"||y==="nodebuffer"?w.push(String.fromCharCode.apply(null,d.slice(E,Math.min(E+u,S)))):w.push(String.fromCharCode.apply(null,d.subarray(E,Math.min(E+u,S)))),E+=u;return w.join("")},stringifyByChar:function(d){for(var y="",u=0;u<d.length;u++)y+=String.fromCharCode(d[u]);return y},applyCanBeUsed:{uint8array:function(){try{return r.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return r.nodebuffer&&String.fromCharCode.apply(null,s.allocBuffer(1)).length===1}catch{return!1}}()}};function C(d){var y=65536,u=n.getTypeOf(d),w=!0;if(u==="uint8array"?w=m.applyCanBeUsed.uint8array:u==="nodebuffer"&&(w=m.applyCanBeUsed.nodebuffer),w)for(;1<y;)try{return m.stringifyByChunk(d,u,y)}catch{y=Math.floor(y/2)}return m.stringifyByChar(d)}function c(d,y){for(var u=0;u<d.length;u++)y[u]=d[u];return y}n.applyFromCharCode=C;var v={};v.string={string:p,array:function(d){return k(d,new Array(d.length))},arraybuffer:function(d){return v.string.uint8array(d).buffer},uint8array:function(d){return k(d,new Uint8Array(d.length))},nodebuffer:function(d){return k(d,s.allocBuffer(d.length))}},v.array={string:C,array:p,arraybuffer:function(d){return new Uint8Array(d).buffer},uint8array:function(d){return new Uint8Array(d)},nodebuffer:function(d){return s.newBufferFrom(d)}},v.arraybuffer={string:function(d){return C(new Uint8Array(d))},array:function(d){return c(new Uint8Array(d),new Array(d.byteLength))},arraybuffer:p,uint8array:function(d){return new Uint8Array(d)},nodebuffer:function(d){return s.newBufferFrom(new Uint8Array(d))}},v.uint8array={string:C,array:function(d){return c(d,new Array(d.length))},arraybuffer:function(d){return d.buffer},uint8array:p,nodebuffer:function(d){return s.newBufferFrom(d)}},v.nodebuffer={string:C,array:function(d){return c(d,new Array(d.length))},arraybuffer:function(d){return v.nodebuffer.uint8array(d).buffer},uint8array:function(d){return c(d,new Uint8Array(d.length))},nodebuffer:p},n.transformTo=function(d,y){if(y=y||"",!d)return y;n.checkSupport(d);var u=n.getTypeOf(y);return v[u][d](y)},n.resolve=function(d){for(var y=d.split("/"),u=[],w=0;w<y.length;w++){var E=y[w];E==="."||E===""&&w!==0&&w!==y.length-1||(E===".."?u.pop():u.push(E))}return u.join("/")},n.getTypeOf=function(d){return typeof d=="string"?"string":Object.prototype.toString.call(d)==="[object Array]"?"array":r.nodebuffer&&s.isBuffer(d)?"nodebuffer":r.uint8array&&d instanceof Uint8Array?"uint8array":r.arraybuffer&&d instanceof ArrayBuffer?"arraybuffer":void 0},n.checkSupport=function(d){if(!r[d.toLowerCase()])throw new Error(d+" is not supported by this platform")},n.MAX_VALUE_16BITS=65535,n.MAX_VALUE_32BITS=-1,n.pretty=function(d){var y,u,w="";for(u=0;u<(d||"").length;u++)w+="\\x"+((y=d.charCodeAt(u))<16?"0":"")+y.toString(16).toUpperCase();return w},n.delay=function(d,y,u){setImmediate(function(){d.apply(u||null,y||[])})},n.inherits=function(d,y){function u(){}u.prototype=y.prototype,d.prototype=new u},n.extend=function(){var d,y,u={};for(d=0;d<arguments.length;d++)for(y in arguments[d])Object.prototype.hasOwnProperty.call(arguments[d],y)&&u[y]===void 0&&(u[y]=arguments[d][y]);return u},n.prepareContent=function(d,y,u,w,E){return l.Promise.resolve(y).then(function(S){return r.blob&&(S instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(S))!==-1)&&typeof FileReader<"u"?new l.Promise(function(x,L){var A=new FileReader;A.onload=function(b){x(b.target.result)},A.onerror=function(b){L(b.target.error)},A.readAsArrayBuffer(S)}):S}).then(function(S){var x=n.getTypeOf(S);return x?(x==="arraybuffer"?S=n.transformTo("uint8array",S):x==="string"&&(E?S=i.decode(S):u&&w!==!0&&(S=function(L){return k(L,r.uint8array?new Uint8Array(L.length):new Array(L.length))}(S))),S):l.Promise.reject(new Error("Can't read the data of '"+d+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,o,n){"use strict";var r=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),l=e("./zipEntry"),p=e("./support");function k(m){this.files=[],this.loadOptions=m}k.prototype={checkSignature:function(m){if(!this.reader.readAndCheckSignature(m)){this.reader.index-=4;var C=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(C)+", expected "+i.pretty(m)+")")}},isSignature:function(m,C){var c=this.reader.index;this.reader.setIndex(m);var v=this.reader.readString(4)===C;return this.reader.setIndex(c),v},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var m=this.reader.readData(this.zipCommentLength),C=p.uint8array?"uint8array":"array",c=i.transformTo(C,m);this.zipComment=this.loadOptions.decodeFileName(c)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var m,C,c,v=this.zip64EndOfCentralSize-44;0<v;)m=this.reader.readInt(2),C=this.reader.readInt(4),c=this.reader.readData(C),this.zip64ExtensibleData[m]={id:m,length:C,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var m,C;for(m=0;m<this.files.length;m++)C=this.files[m],this.reader.setIndex(C.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),C.readLocalPart(this.reader),C.handleUTF8(),C.processAttributes()},readCentralDir:function(){var m;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(m=new l({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(m);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var m=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(m<0)throw this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(m);var C=m;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(m=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(m),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var c=this.centralDirOffset+this.centralDirSize;this.zip64&&(c+=20,c+=12+this.zip64EndOfCentralSize);var v=C-c;if(0<v)this.isSignature(C,s.CENTRAL_FILE_HEADER)||(this.reader.zero=v);else if(v<0)throw new Error("Corrupted zip: missing "+Math.abs(v)+" bytes.")},prepareReader:function(m){this.reader=r(m)},load:function(m){this.prepareReader(m),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},o.exports=k},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,o,n){"use strict";var r=e("./reader/readerFor"),i=e("./utils"),s=e("./compressedObject"),l=e("./crc32"),p=e("./utf8"),k=e("./compressions"),m=e("./support");function C(c,v){this.options=c,this.loadOptions=v}C.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(c){var v,d;if(c.skip(22),this.fileNameLength=c.readInt(2),d=c.readInt(2),this.fileName=c.readData(this.fileNameLength),c.skip(d),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((v=function(y){for(var u in k)if(Object.prototype.hasOwnProperty.call(k,u)&&k[u].magic===y)return k[u];return null}(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+i.pretty(this.compressionMethod)+" unknown (inner file : "+i.transformTo("string",this.fileName)+")");this.decompressed=new s(this.compressedSize,this.uncompressedSize,this.crc32,v,c.readData(this.compressedSize))},readCentralPart:function(c){this.versionMadeBy=c.readInt(2),c.skip(2),this.bitFlag=c.readInt(2),this.compressionMethod=c.readString(2),this.date=c.readDate(),this.crc32=c.readInt(4),this.compressedSize=c.readInt(4),this.uncompressedSize=c.readInt(4);var v=c.readInt(2);if(this.extraFieldsLength=c.readInt(2),this.fileCommentLength=c.readInt(2),this.diskNumberStart=c.readInt(2),this.internalFileAttributes=c.readInt(2),this.externalFileAttributes=c.readInt(4),this.localHeaderOffset=c.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");c.skip(v),this.readExtraFields(c),this.parseZIP64ExtraField(c),this.fileComment=c.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var c=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),c==0&&(this.dosPermissions=63&this.externalFileAttributes),c==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var c=r(this.extraFields[1].value);this.uncompressedSize===i.MAX_VALUE_32BITS&&(this.uncompressedSize=c.readInt(8)),this.compressedSize===i.MAX_VALUE_32BITS&&(this.compressedSize=c.readInt(8)),this.localHeaderOffset===i.MAX_VALUE_32BITS&&(this.localHeaderOffset=c.readInt(8)),this.diskNumberStart===i.MAX_VALUE_32BITS&&(this.diskNumberStart=c.readInt(4))}},readExtraFields:function(c){var v,d,y,u=c.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});c.index+4<u;)v=c.readInt(2),d=c.readInt(2),y=c.readData(d),this.extraFields[v]={id:v,length:d,value:y};c.setIndex(u)},handleUTF8:function(){var c=m.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=p.utf8decode(this.fileName),this.fileCommentStr=p.utf8decode(this.fileComment);else{var v=this.findExtraFieldUnicodePath();if(v!==null)this.fileNameStr=v;else{var d=i.transformTo(c,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(d)}var y=this.findExtraFieldUnicodeComment();if(y!==null)this.fileCommentStr=y;else{var u=i.transformTo(c,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(u)}}},findExtraFieldUnicodePath:function(){var c=this.extraFields[28789];if(c){var v=r(c.value);return v.readInt(1)!==1||l(this.fileName)!==v.readInt(4)?null:p.utf8decode(v.readData(c.length-5))}return null},findExtraFieldUnicodeComment:function(){var c=this.extraFields[25461];if(c){var v=r(c.value);return v.readInt(1)!==1||l(this.fileComment)!==v.readInt(4)?null:p.utf8decode(v.readData(c.length-5))}return null}},o.exports=C},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,o,n){"use strict";function r(v,d,y){this.name=v,this.dir=y.dir,this.date=y.date,this.comment=y.comment,this.unixPermissions=y.unixPermissions,this.dosPermissions=y.dosPermissions,this._data=d,this._dataBinary=y.binary,this.options={compression:y.compression,compressionOptions:y.compressionOptions}}var i=e("./stream/StreamHelper"),s=e("./stream/DataWorker"),l=e("./utf8"),p=e("./compressedObject"),k=e("./stream/GenericWorker");r.prototype={internalStream:function(v){var d=null,y="string";try{if(!v)throw new Error("No output type specified.");var u=(y=v.toLowerCase())==="string"||y==="text";y!=="binarystring"&&y!=="text"||(y="string"),d=this._decompressWorker();var w=!this._dataBinary;w&&!u&&(d=d.pipe(new l.Utf8EncodeWorker)),!w&&u&&(d=d.pipe(new l.Utf8DecodeWorker))}catch(E){(d=new k("error")).error(E)}return new i(d,y,"")},async:function(v,d){return this.internalStream(v).accumulate(d)},nodeStream:function(v,d){return this.internalStream(v||"nodebuffer").toNodejsStream(d)},_compressWorker:function(v,d){if(this._data instanceof p&&this._data.compression.magic===v.magic)return this._data.getCompressedWorker();var y=this._decompressWorker();return this._dataBinary||(y=y.pipe(new l.Utf8EncodeWorker)),p.createWorkerFrom(y,v,d)},_decompressWorker:function(){return this._data instanceof p?this._data.getContentWorker():this._data instanceof k?this._data:new s(this._data)}};for(var m=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],C=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},c=0;c<m.length;c++)r.prototype[m[c]]=C;o.exports=r},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,o,n){(function(r){"use strict";var i,s,l=r.MutationObserver||r.WebKitMutationObserver;if(l){var p=0,k=new l(v),m=r.document.createTextNode("");k.observe(m,{characterData:!0}),i=function(){m.data=p=++p%2}}else if(r.setImmediate||r.MessageChannel===void 0)i="document"in r&&"onreadystatechange"in r.document.createElement("script")?function(){var d=r.document.createElement("script");d.onreadystatechange=function(){v(),d.onreadystatechange=null,d.parentNode.removeChild(d),d=null},r.document.documentElement.appendChild(d)}:function(){setTimeout(v,0)};else{var C=new r.MessageChannel;C.port1.onmessage=v,i=function(){C.port2.postMessage(0)}}var c=[];function v(){var d,y;s=!0;for(var u=c.length;u;){for(y=c,c=[],d=-1;++d<u;)y[d]();u=c.length}s=!1}o.exports=function(d){c.push(d)!==1||s||i()}}).call(this,typeof global<"u"?global:typeof self<"u"?self:typeof window<"u"?window:{})},{}],37:[function(e,o,n){"use strict";var r=e("immediate");function i(){}var s={},l=["REJECTED"],p=["FULFILLED"],k=["PENDING"];function m(u){if(typeof u!="function")throw new TypeError("resolver must be a function");this.state=k,this.queue=[],this.outcome=void 0,u!==i&&d(this,u)}function C(u,w,E){this.promise=u,typeof w=="function"&&(this.onFulfilled=w,this.callFulfilled=this.otherCallFulfilled),typeof E=="function"&&(this.onRejected=E,this.callRejected=this.otherCallRejected)}function c(u,w,E){r(function(){var S;try{S=w(E)}catch(x){return s.reject(u,x)}S===u?s.reject(u,new TypeError("Cannot resolve promise with itself")):s.resolve(u,S)})}function v(u){var w=u&&u.then;if(u&&(typeof u=="object"||typeof u=="function")&&typeof w=="function")return function(){w.apply(u,arguments)}}function d(u,w){var E=!1;function S(A){E||(E=!0,s.reject(u,A))}function x(A){E||(E=!0,s.resolve(u,A))}var L=y(function(){w(x,S)});L.status==="error"&&S(L.value)}function y(u,w){var E={};try{E.value=u(w),E.status="success"}catch(S){E.status="error",E.value=S}return E}(o.exports=m).prototype.finally=function(u){if(typeof u!="function")return this;var w=this.constructor;return this.then(function(E){return w.resolve(u()).then(function(){return E})},function(E){return w.resolve(u()).then(function(){throw E})})},m.prototype.catch=function(u){return this.then(null,u)},m.prototype.then=function(u,w){if(typeof u!="function"&&this.state===p||typeof w!="function"&&this.state===l)return this;var E=new this.constructor(i);return this.state!==k?c(E,this.state===p?u:w,this.outcome):this.queue.push(new C(E,u,w)),E},C.prototype.callFulfilled=function(u){s.resolve(this.promise,u)},C.prototype.otherCallFulfilled=function(u){c(this.promise,this.onFulfilled,u)},C.prototype.callRejected=function(u){s.reject(this.promise,u)},C.prototype.otherCallRejected=function(u){c(this.promise,this.onRejected,u)},s.resolve=function(u,w){var E=y(v,w);if(E.status==="error")return s.reject(u,E.value);var S=E.value;if(S)d(u,S);else{u.state=p,u.outcome=w;for(var x=-1,L=u.queue.length;++x<L;)u.queue[x].callFulfilled(w)}return u},s.reject=function(u,w){u.state=l,u.outcome=w;for(var E=-1,S=u.queue.length;++E<S;)u.queue[E].callRejected(w);return u},m.resolve=function(u){return u instanceof this?u:s.resolve(new this(i),u)},m.reject=function(u){var w=new this(i);return s.reject(w,u)},m.all=function(u){var w=this;if(Object.prototype.toString.call(u)!=="[object Array]")return this.reject(new TypeError("must be an array"));var E=u.length,S=!1;if(!E)return this.resolve([]);for(var x=new Array(E),L=0,A=-1,b=new this(i);++A<E;)f(u[A],A);return b;function f(B,R){w.resolve(B).then(function(h){x[R]=h,++L!==E||S||(S=!0,s.resolve(b,x))},function(h){S||(S=!0,s.reject(b,h))})}},m.race=function(u){var w=this;if(Object.prototype.toString.call(u)!=="[object Array]")return this.reject(new TypeError("must be an array"));var E=u.length,S=!1;if(!E)return this.resolve([]);for(var x=-1,L=new this(i);++x<E;)A=u[x],w.resolve(A).then(function(b){S||(S=!0,s.resolve(L,b))},function(b){S||(S=!0,s.reject(L,b))});var A;return L}},{immediate:36}],38:[function(e,o,n){"use strict";var r={};(0,e("./lib/utils/common").assign)(r,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),o.exports=r},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,o,n){"use strict";var r=e("./zlib/deflate"),i=e("./utils/common"),s=e("./utils/strings"),l=e("./zlib/messages"),p=e("./zlib/zstream"),k=Object.prototype.toString,m=0,C=-1,c=0,v=8;function d(u){if(!(this instanceof d))return new d(u);this.options=i.assign({level:C,method:v,chunkSize:16384,windowBits:15,memLevel:8,strategy:c,to:""},u||{});var w=this.options;w.raw&&0<w.windowBits?w.windowBits=-w.windowBits:w.gzip&&0<w.windowBits&&w.windowBits<16&&(w.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new p,this.strm.avail_out=0;var E=r.deflateInit2(this.strm,w.level,w.method,w.windowBits,w.memLevel,w.strategy);if(E!==m)throw new Error(l[E]);if(w.header&&r.deflateSetHeader(this.strm,w.header),w.dictionary){var S;if(S=typeof w.dictionary=="string"?s.string2buf(w.dictionary):k.call(w.dictionary)==="[object ArrayBuffer]"?new Uint8Array(w.dictionary):w.dictionary,(E=r.deflateSetDictionary(this.strm,S))!==m)throw new Error(l[E]);this._dict_set=!0}}function y(u,w){var E=new d(w);if(E.push(u,!0),E.err)throw E.msg||l[E.err];return E.result}d.prototype.push=function(u,w){var E,S,x=this.strm,L=this.options.chunkSize;if(this.ended)return!1;S=w===~~w?w:w===!0?4:0,typeof u=="string"?x.input=s.string2buf(u):k.call(u)==="[object ArrayBuffer]"?x.input=new Uint8Array(u):x.input=u,x.next_in=0,x.avail_in=x.input.length;do{if(x.avail_out===0&&(x.output=new i.Buf8(L),x.next_out=0,x.avail_out=L),(E=r.deflate(x,S))!==1&&E!==m)return this.onEnd(E),!(this.ended=!0);x.avail_out!==0&&(x.avail_in!==0||S!==4&&S!==2)||(this.options.to==="string"?this.onData(s.buf2binstring(i.shrinkBuf(x.output,x.next_out))):this.onData(i.shrinkBuf(x.output,x.next_out)))}while((0<x.avail_in||x.avail_out===0)&&E!==1);return S===4?(E=r.deflateEnd(this.strm),this.onEnd(E),this.ended=!0,E===m):S!==2||(this.onEnd(m),!(x.avail_out=0))},d.prototype.onData=function(u){this.chunks.push(u)},d.prototype.onEnd=function(u){u===m&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=u,this.msg=this.strm.msg},n.Deflate=d,n.deflate=y,n.deflateRaw=function(u,w){return(w=w||{}).raw=!0,y(u,w)},n.gzip=function(u,w){return(w=w||{}).gzip=!0,y(u,w)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,o,n){"use strict";var r=e("./zlib/inflate"),i=e("./utils/common"),s=e("./utils/strings"),l=e("./zlib/constants"),p=e("./zlib/messages"),k=e("./zlib/zstream"),m=e("./zlib/gzheader"),C=Object.prototype.toString;function c(d){if(!(this instanceof c))return new c(d);this.options=i.assign({chunkSize:16384,windowBits:0,to:""},d||{});var y=this.options;y.raw&&0<=y.windowBits&&y.windowBits<16&&(y.windowBits=-y.windowBits,y.windowBits===0&&(y.windowBits=-15)),!(0<=y.windowBits&&y.windowBits<16)||d&&d.windowBits||(y.windowBits+=32),15<y.windowBits&&y.windowBits<48&&(15&y.windowBits)==0&&(y.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var u=r.inflateInit2(this.strm,y.windowBits);if(u!==l.Z_OK)throw new Error(p[u]);this.header=new m,r.inflateGetHeader(this.strm,this.header)}function v(d,y){var u=new c(y);if(u.push(d,!0),u.err)throw u.msg||p[u.err];return u.result}c.prototype.push=function(d,y){var u,w,E,S,x,L,A=this.strm,b=this.options.chunkSize,f=this.options.dictionary,B=!1;if(this.ended)return!1;w=y===~~y?y:y===!0?l.Z_FINISH:l.Z_NO_FLUSH,typeof d=="string"?A.input=s.binstring2buf(d):C.call(d)==="[object ArrayBuffer]"?A.input=new Uint8Array(d):A.input=d,A.next_in=0,A.avail_in=A.input.length;do{if(A.avail_out===0&&(A.output=new i.Buf8(b),A.next_out=0,A.avail_out=b),(u=r.inflate(A,l.Z_NO_FLUSH))===l.Z_NEED_DICT&&f&&(L=typeof f=="string"?s.string2buf(f):C.call(f)==="[object ArrayBuffer]"?new Uint8Array(f):f,u=r.inflateSetDictionary(this.strm,L)),u===l.Z_BUF_ERROR&&B===!0&&(u=l.Z_OK,B=!1),u!==l.Z_STREAM_END&&u!==l.Z_OK)return this.onEnd(u),!(this.ended=!0);A.next_out&&(A.avail_out!==0&&u!==l.Z_STREAM_END&&(A.avail_in!==0||w!==l.Z_FINISH&&w!==l.Z_SYNC_FLUSH)||(this.options.to==="string"?(E=s.utf8border(A.output,A.next_out),S=A.next_out-E,x=s.buf2string(A.output,E),A.next_out=S,A.avail_out=b-S,S&&i.arraySet(A.output,A.output,E,S,0),this.onData(x)):this.onData(i.shrinkBuf(A.output,A.next_out)))),A.avail_in===0&&A.avail_out===0&&(B=!0)}while((0<A.avail_in||A.avail_out===0)&&u!==l.Z_STREAM_END);return u===l.Z_STREAM_END&&(w=l.Z_FINISH),w===l.Z_FINISH?(u=r.inflateEnd(this.strm),this.onEnd(u),this.ended=!0,u===l.Z_OK):w!==l.Z_SYNC_FLUSH||(this.onEnd(l.Z_OK),!(A.avail_out=0))},c.prototype.onData=function(d){this.chunks.push(d)},c.prototype.onEnd=function(d){d===l.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=d,this.msg=this.strm.msg},n.Inflate=c,n.inflate=v,n.inflateRaw=function(d,y){return(y=y||{}).raw=!0,v(d,y)},n.ungzip=v},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,o,n){"use strict";var r=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";n.assign=function(l){for(var p=Array.prototype.slice.call(arguments,1);p.length;){var k=p.shift();if(k){if(typeof k!="object")throw new TypeError(k+"must be non-object");for(var m in k)k.hasOwnProperty(m)&&(l[m]=k[m])}}return l},n.shrinkBuf=function(l,p){return l.length===p?l:l.subarray?l.subarray(0,p):(l.length=p,l)};var i={arraySet:function(l,p,k,m,C){if(p.subarray&&l.subarray)l.set(p.subarray(k,k+m),C);else for(var c=0;c<m;c++)l[C+c]=p[k+c]},flattenChunks:function(l){var p,k,m,C,c,v;for(p=m=0,k=l.length;p<k;p++)m+=l[p].length;for(v=new Uint8Array(m),p=C=0,k=l.length;p<k;p++)c=l[p],v.set(c,C),C+=c.length;return v}},s={arraySet:function(l,p,k,m,C){for(var c=0;c<m;c++)l[C+c]=p[k+c]},flattenChunks:function(l){return[].concat.apply([],l)}};n.setTyped=function(l){l?(n.Buf8=Uint8Array,n.Buf16=Uint16Array,n.Buf32=Int32Array,n.assign(n,i)):(n.Buf8=Array,n.Buf16=Array,n.Buf32=Array,n.assign(n,s))},n.setTyped(r)},{}],42:[function(e,o,n){"use strict";var r=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch{i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{s=!1}for(var l=new r.Buf8(256),p=0;p<256;p++)l[p]=252<=p?6:248<=p?5:240<=p?4:224<=p?3:192<=p?2:1;function k(m,C){if(C<65537&&(m.subarray&&s||!m.subarray&&i))return String.fromCharCode.apply(null,r.shrinkBuf(m,C));for(var c="",v=0;v<C;v++)c+=String.fromCharCode(m[v]);return c}l[254]=l[254]=1,n.string2buf=function(m){var C,c,v,d,y,u=m.length,w=0;for(d=0;d<u;d++)(64512&(c=m.charCodeAt(d)))==55296&&d+1<u&&(64512&(v=m.charCodeAt(d+1)))==56320&&(c=65536+(c-55296<<10)+(v-56320),d++),w+=c<128?1:c<2048?2:c<65536?3:4;for(C=new r.Buf8(w),d=y=0;y<w;d++)(64512&(c=m.charCodeAt(d)))==55296&&d+1<u&&(64512&(v=m.charCodeAt(d+1)))==56320&&(c=65536+(c-55296<<10)+(v-56320),d++),c<128?C[y++]=c:(c<2048?C[y++]=192|c>>>6:(c<65536?C[y++]=224|c>>>12:(C[y++]=240|c>>>18,C[y++]=128|c>>>12&63),C[y++]=128|c>>>6&63),C[y++]=128|63&c);return C},n.buf2binstring=function(m){return k(m,m.length)},n.binstring2buf=function(m){for(var C=new r.Buf8(m.length),c=0,v=C.length;c<v;c++)C[c]=m.charCodeAt(c);return C},n.buf2string=function(m,C){var c,v,d,y,u=C||m.length,w=new Array(2*u);for(c=v=0;c<u;)if((d=m[c++])<128)w[v++]=d;else if(4<(y=l[d]))w[v++]=65533,c+=y-1;else{for(d&=y===2?31:y===3?15:7;1<y&&c<u;)d=d<<6|63&m[c++],y--;1<y?w[v++]=65533:d<65536?w[v++]=d:(d-=65536,w[v++]=55296|d>>10&1023,w[v++]=56320|1023&d)}return k(w,v)},n.utf8border=function(m,C){var c;for((C=C||m.length)>m.length&&(C=m.length),c=C-1;0<=c&&(192&m[c])==128;)c--;return c<0||c===0?C:c+l[m[c]]>C?c:C}},{"./common":41}],43:[function(e,o,n){"use strict";o.exports=function(r,i,s,l){for(var p=65535&r|0,k=r>>>16&65535|0,m=0;s!==0;){for(s-=m=2e3<s?2e3:s;k=k+(p=p+i[l++]|0)|0,--m;);p%=65521,k%=65521}return p|k<<16|0}},{}],44:[function(e,o,n){"use strict";o.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,o,n){"use strict";var r=function(){for(var i,s=[],l=0;l<256;l++){i=l;for(var p=0;p<8;p++)i=1&i?3988292384^i>>>1:i>>>1;s[l]=i}return s}();o.exports=function(i,s,l,p){var k=r,m=p+l;i^=-1;for(var C=p;C<m;C++)i=i>>>8^k[255&(i^s[C])];return-1^i}},{}],46:[function(e,o,n){"use strict";var r,i=e("../utils/common"),s=e("./trees"),l=e("./adler32"),p=e("./crc32"),k=e("./messages"),m=0,C=4,c=0,v=-2,d=-1,y=4,u=2,w=8,E=9,S=286,x=30,L=19,A=2*S+1,b=15,f=3,B=258,R=B+f+1,h=42,O=113,a=1,j=2,ne=3,P=4;function ee(t,F){return t.msg=k[F],F}function D(t){return(t<<1)-(4<t?9:0)}function Y(t){for(var F=t.length;0<=--F;)t[F]=0}function M(t){var F=t.state,N=F.pending;N>t.avail_out&&(N=t.avail_out),N!==0&&(i.arraySet(t.output,F.pending_buf,F.pending_out,N,t.next_out),t.next_out+=N,F.pending_out+=N,t.total_out+=N,t.avail_out-=N,F.pending-=N,F.pending===0&&(F.pending_out=0))}function T(t,F){s._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,F),t.block_start=t.strstart,M(t.strm)}function $(t,F){t.pending_buf[t.pending++]=F}function G(t,F){t.pending_buf[t.pending++]=F>>>8&255,t.pending_buf[t.pending++]=255&F}function W(t,F){var N,_,g=t.max_chain_length,I=t.strstart,U=t.prev_length,H=t.nice_match,z=t.strstart>t.w_size-R?t.strstart-(t.w_size-R):0,V=t.window,J=t.w_mask,q=t.prev,X=t.strstart+B,ae=V[I+U-1],se=V[I+U];t.prev_length>=t.good_match&&(g>>=2),H>t.lookahead&&(H=t.lookahead);do if(V[(N=F)+U]===se&&V[N+U-1]===ae&&V[N]===V[I]&&V[++N]===V[I+1]){I+=2,N++;do;while(V[++I]===V[++N]&&V[++I]===V[++N]&&V[++I]===V[++N]&&V[++I]===V[++N]&&V[++I]===V[++N]&&V[++I]===V[++N]&&V[++I]===V[++N]&&V[++I]===V[++N]&&I<X);if(_=B-(X-I),I=X-B,U<_){if(t.match_start=F,H<=(U=_))break;ae=V[I+U-1],se=V[I+U]}}while((F=q[F&J])>z&&--g!=0);return U<=t.lookahead?U:t.lookahead}function oe(t){var F,N,_,g,I,U,H,z,V,J,q=t.w_size;do{if(g=t.window_size-t.lookahead-t.strstart,t.strstart>=q+(q-R)){for(i.arraySet(t.window,t.window,q,q,0),t.match_start-=q,t.strstart-=q,t.block_start-=q,F=N=t.hash_size;_=t.head[--F],t.head[F]=q<=_?_-q:0,--N;);for(F=N=q;_=t.prev[--F],t.prev[F]=q<=_?_-q:0,--N;);g+=q}if(t.strm.avail_in===0)break;if(U=t.strm,H=t.window,z=t.strstart+t.lookahead,V=g,J=void 0,J=U.avail_in,V<J&&(J=V),N=J===0?0:(U.avail_in-=J,i.arraySet(H,U.input,U.next_in,J,z),U.state.wrap===1?U.adler=l(U.adler,H,J,z):U.state.wrap===2&&(U.adler=p(U.adler,H,J,z)),U.next_in+=J,U.total_in+=J,J),t.lookahead+=N,t.lookahead+t.insert>=f)for(I=t.strstart-t.insert,t.ins_h=t.window[I],t.ins_h=(t.ins_h<<t.hash_shift^t.window[I+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[I+f-1])&t.hash_mask,t.prev[I&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=I,I++,t.insert--,!(t.lookahead+t.insert<f)););}while(t.lookahead<R&&t.strm.avail_in!==0)}function ue(t,F){for(var N,_;;){if(t.lookahead<R){if(oe(t),t.lookahead<R&&F===m)return a;if(t.lookahead===0)break}if(N=0,t.lookahead>=f&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+f-1])&t.hash_mask,N=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),N!==0&&t.strstart-N<=t.w_size-R&&(t.match_length=W(t,N)),t.match_length>=f)if(_=s._tr_tally(t,t.strstart-t.match_start,t.match_length-f),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=f){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+f-1])&t.hash_mask,N=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,--t.match_length!=0;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else _=s._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(_&&(T(t,!1),t.strm.avail_out===0))return a}return t.insert=t.strstart<f-1?t.strstart:f-1,F===C?(T(t,!0),t.strm.avail_out===0?ne:P):t.last_lit&&(T(t,!1),t.strm.avail_out===0)?a:j}function Q(t,F){for(var N,_,g;;){if(t.lookahead<R){if(oe(t),t.lookahead<R&&F===m)return a;if(t.lookahead===0)break}if(N=0,t.lookahead>=f&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+f-1])&t.hash_mask,N=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=f-1,N!==0&&t.prev_length<t.max_lazy_match&&t.strstart-N<=t.w_size-R&&(t.match_length=W(t,N),t.match_length<=5&&(t.strategy===1||t.match_length===f&&4096<t.strstart-t.match_start)&&(t.match_length=f-1)),t.prev_length>=f&&t.match_length<=t.prev_length){for(g=t.strstart+t.lookahead-f,_=s._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-f),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=g&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+f-1])&t.hash_mask,N=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),--t.prev_length!=0;);if(t.match_available=0,t.match_length=f-1,t.strstart++,_&&(T(t,!1),t.strm.avail_out===0))return a}else if(t.match_available){if((_=s._tr_tally(t,0,t.window[t.strstart-1]))&&T(t,!1),t.strstart++,t.lookahead--,t.strm.avail_out===0)return a}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(_=s._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<f-1?t.strstart:f-1,F===C?(T(t,!0),t.strm.avail_out===0?ne:P):t.last_lit&&(T(t,!1),t.strm.avail_out===0)?a:j}function te(t,F,N,_,g){this.good_length=t,this.max_lazy=F,this.nice_length=N,this.max_chain=_,this.func=g}function ie(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=w,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new i.Buf16(2*A),this.dyn_dtree=new i.Buf16(2*(2*x+1)),this.bl_tree=new i.Buf16(2*(2*L+1)),Y(this.dyn_ltree),Y(this.dyn_dtree),Y(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new i.Buf16(b+1),this.heap=new i.Buf16(2*S+1),Y(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new i.Buf16(2*S+1),Y(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function re(t){var F;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=u,(F=t.state).pending=0,F.pending_out=0,F.wrap<0&&(F.wrap=-F.wrap),F.status=F.wrap?h:O,t.adler=F.wrap===2?0:1,F.last_flush=m,s._tr_init(F),c):ee(t,v)}function le(t){var F=re(t);return F===c&&function(N){N.window_size=2*N.w_size,Y(N.head),N.max_lazy_match=r[N.level].max_lazy,N.good_match=r[N.level].good_length,N.nice_match=r[N.level].nice_length,N.max_chain_length=r[N.level].max_chain,N.strstart=0,N.block_start=0,N.lookahead=0,N.insert=0,N.match_length=N.prev_length=f-1,N.match_available=0,N.ins_h=0}(t.state),F}function de(t,F,N,_,g,I){if(!t)return v;var U=1;if(F===d&&(F=6),_<0?(U=0,_=-_):15<_&&(U=2,_-=16),g<1||E<g||N!==w||_<8||15<_||F<0||9<F||I<0||y<I)return ee(t,v);_===8&&(_=9);var H=new ie;return(t.state=H).strm=t,H.wrap=U,H.gzhead=null,H.w_bits=_,H.w_size=1<<H.w_bits,H.w_mask=H.w_size-1,H.hash_bits=g+7,H.hash_size=1<<H.hash_bits,H.hash_mask=H.hash_size-1,H.hash_shift=~~((H.hash_bits+f-1)/f),H.window=new i.Buf8(2*H.w_size),H.head=new i.Buf16(H.hash_size),H.prev=new i.Buf16(H.w_size),H.lit_bufsize=1<<g+6,H.pending_buf_size=4*H.lit_bufsize,H.pending_buf=new i.Buf8(H.pending_buf_size),H.d_buf=1*H.lit_bufsize,H.l_buf=3*H.lit_bufsize,H.level=F,H.strategy=I,H.method=N,le(t)}r=[new te(0,0,0,0,function(t,F){var N=65535;for(N>t.pending_buf_size-5&&(N=t.pending_buf_size-5);;){if(t.lookahead<=1){if(oe(t),t.lookahead===0&&F===m)return a;if(t.lookahead===0)break}t.strstart+=t.lookahead,t.lookahead=0;var _=t.block_start+N;if((t.strstart===0||t.strstart>=_)&&(t.lookahead=t.strstart-_,t.strstart=_,T(t,!1),t.strm.avail_out===0)||t.strstart-t.block_start>=t.w_size-R&&(T(t,!1),t.strm.avail_out===0))return a}return t.insert=0,F===C?(T(t,!0),t.strm.avail_out===0?ne:P):(t.strstart>t.block_start&&(T(t,!1),t.strm.avail_out),a)}),new te(4,4,8,4,ue),new te(4,5,16,8,ue),new te(4,6,32,32,ue),new te(4,4,16,16,Q),new te(8,16,32,32,Q),new te(8,16,128,128,Q),new te(8,32,128,256,Q),new te(32,128,258,1024,Q),new te(32,258,258,4096,Q)],n.deflateInit=function(t,F){return de(t,F,w,15,8,0)},n.deflateInit2=de,n.deflateReset=le,n.deflateResetKeep=re,n.deflateSetHeader=function(t,F){return t&&t.state?t.state.wrap!==2?v:(t.state.gzhead=F,c):v},n.deflate=function(t,F){var N,_,g,I;if(!t||!t.state||5<F||F<0)return t?ee(t,v):v;if(_=t.state,!t.output||!t.input&&t.avail_in!==0||_.status===666&&F!==C)return ee(t,t.avail_out===0?-5:v);if(_.strm=t,N=_.last_flush,_.last_flush=F,_.status===h)if(_.wrap===2)t.adler=0,$(_,31),$(_,139),$(_,8),_.gzhead?($(_,(_.gzhead.text?1:0)+(_.gzhead.hcrc?2:0)+(_.gzhead.extra?4:0)+(_.gzhead.name?8:0)+(_.gzhead.comment?16:0)),$(_,255&_.gzhead.time),$(_,_.gzhead.time>>8&255),$(_,_.gzhead.time>>16&255),$(_,_.gzhead.time>>24&255),$(_,_.level===9?2:2<=_.strategy||_.level<2?4:0),$(_,255&_.gzhead.os),_.gzhead.extra&&_.gzhead.extra.length&&($(_,255&_.gzhead.extra.length),$(_,_.gzhead.extra.length>>8&255)),_.gzhead.hcrc&&(t.adler=p(t.adler,_.pending_buf,_.pending,0)),_.gzindex=0,_.status=69):($(_,0),$(_,0),$(_,0),$(_,0),$(_,0),$(_,_.level===9?2:2<=_.strategy||_.level<2?4:0),$(_,3),_.status=O);else{var U=w+(_.w_bits-8<<4)<<8;U|=(2<=_.strategy||_.level<2?0:_.level<6?1:_.level===6?2:3)<<6,_.strstart!==0&&(U|=32),U+=31-U%31,_.status=O,G(_,U),_.strstart!==0&&(G(_,t.adler>>>16),G(_,65535&t.adler)),t.adler=1}if(_.status===69)if(_.gzhead.extra){for(g=_.pending;_.gzindex<(65535&_.gzhead.extra.length)&&(_.pending!==_.pending_buf_size||(_.gzhead.hcrc&&_.pending>g&&(t.adler=p(t.adler,_.pending_buf,_.pending-g,g)),M(t),g=_.pending,_.pending!==_.pending_buf_size));)$(_,255&_.gzhead.extra[_.gzindex]),_.gzindex++;_.gzhead.hcrc&&_.pending>g&&(t.adler=p(t.adler,_.pending_buf,_.pending-g,g)),_.gzindex===_.gzhead.extra.length&&(_.gzindex=0,_.status=73)}else _.status=73;if(_.status===73)if(_.gzhead.name){g=_.pending;do{if(_.pending===_.pending_buf_size&&(_.gzhead.hcrc&&_.pending>g&&(t.adler=p(t.adler,_.pending_buf,_.pending-g,g)),M(t),g=_.pending,_.pending===_.pending_buf_size)){I=1;break}I=_.gzindex<_.gzhead.name.length?255&_.gzhead.name.charCodeAt(_.gzindex++):0,$(_,I)}while(I!==0);_.gzhead.hcrc&&_.pending>g&&(t.adler=p(t.adler,_.pending_buf,_.pending-g,g)),I===0&&(_.gzindex=0,_.status=91)}else _.status=91;if(_.status===91)if(_.gzhead.comment){g=_.pending;do{if(_.pending===_.pending_buf_size&&(_.gzhead.hcrc&&_.pending>g&&(t.adler=p(t.adler,_.pending_buf,_.pending-g,g)),M(t),g=_.pending,_.pending===_.pending_buf_size)){I=1;break}I=_.gzindex<_.gzhead.comment.length?255&_.gzhead.comment.charCodeAt(_.gzindex++):0,$(_,I)}while(I!==0);_.gzhead.hcrc&&_.pending>g&&(t.adler=p(t.adler,_.pending_buf,_.pending-g,g)),I===0&&(_.status=103)}else _.status=103;if(_.status===103&&(_.gzhead.hcrc?(_.pending+2>_.pending_buf_size&&M(t),_.pending+2<=_.pending_buf_size&&($(_,255&t.adler),$(_,t.adler>>8&255),t.adler=0,_.status=O)):_.status=O),_.pending!==0){if(M(t),t.avail_out===0)return _.last_flush=-1,c}else if(t.avail_in===0&&D(F)<=D(N)&&F!==C)return ee(t,-5);if(_.status===666&&t.avail_in!==0)return ee(t,-5);if(t.avail_in!==0||_.lookahead!==0||F!==m&&_.status!==666){var H=_.strategy===2?function(z,V){for(var J;;){if(z.lookahead===0&&(oe(z),z.lookahead===0)){if(V===m)return a;break}if(z.match_length=0,J=s._tr_tally(z,0,z.window[z.strstart]),z.lookahead--,z.strstart++,J&&(T(z,!1),z.strm.avail_out===0))return a}return z.insert=0,V===C?(T(z,!0),z.strm.avail_out===0?ne:P):z.last_lit&&(T(z,!1),z.strm.avail_out===0)?a:j}(_,F):_.strategy===3?function(z,V){for(var J,q,X,ae,se=z.window;;){if(z.lookahead<=B){if(oe(z),z.lookahead<=B&&V===m)return a;if(z.lookahead===0)break}if(z.match_length=0,z.lookahead>=f&&0<z.strstart&&(q=se[X=z.strstart-1])===se[++X]&&q===se[++X]&&q===se[++X]){ae=z.strstart+B;do;while(q===se[++X]&&q===se[++X]&&q===se[++X]&&q===se[++X]&&q===se[++X]&&q===se[++X]&&q===se[++X]&&q===se[++X]&&X<ae);z.match_length=B-(ae-X),z.match_length>z.lookahead&&(z.match_length=z.lookahead)}if(z.match_length>=f?(J=s._tr_tally(z,1,z.match_length-f),z.lookahead-=z.match_length,z.strstart+=z.match_length,z.match_length=0):(J=s._tr_tally(z,0,z.window[z.strstart]),z.lookahead--,z.strstart++),J&&(T(z,!1),z.strm.avail_out===0))return a}return z.insert=0,V===C?(T(z,!0),z.strm.avail_out===0?ne:P):z.last_lit&&(T(z,!1),z.strm.avail_out===0)?a:j}(_,F):r[_.level].func(_,F);if(H!==ne&&H!==P||(_.status=666),H===a||H===ne)return t.avail_out===0&&(_.last_flush=-1),c;if(H===j&&(F===1?s._tr_align(_):F!==5&&(s._tr_stored_block(_,0,0,!1),F===3&&(Y(_.head),_.lookahead===0&&(_.strstart=0,_.block_start=0,_.insert=0))),M(t),t.avail_out===0))return _.last_flush=-1,c}return F!==C?c:_.wrap<=0?1:(_.wrap===2?($(_,255&t.adler),$(_,t.adler>>8&255),$(_,t.adler>>16&255),$(_,t.adler>>24&255),$(_,255&t.total_in),$(_,t.total_in>>8&255),$(_,t.total_in>>16&255),$(_,t.total_in>>24&255)):(G(_,t.adler>>>16),G(_,65535&t.adler)),M(t),0<_.wrap&&(_.wrap=-_.wrap),_.pending!==0?c:1)},n.deflateEnd=function(t){var F;return t&&t.state?(F=t.state.status)!==h&&F!==69&&F!==73&&F!==91&&F!==103&&F!==O&&F!==666?ee(t,v):(t.state=null,F===O?ee(t,-3):c):v},n.deflateSetDictionary=function(t,F){var N,_,g,I,U,H,z,V,J=F.length;if(!t||!t.state||(I=(N=t.state).wrap)===2||I===1&&N.status!==h||N.lookahead)return v;for(I===1&&(t.adler=l(t.adler,F,J,0)),N.wrap=0,J>=N.w_size&&(I===0&&(Y(N.head),N.strstart=0,N.block_start=0,N.insert=0),V=new i.Buf8(N.w_size),i.arraySet(V,F,J-N.w_size,N.w_size,0),F=V,J=N.w_size),U=t.avail_in,H=t.next_in,z=t.input,t.avail_in=J,t.next_in=0,t.input=F,oe(N);N.lookahead>=f;){for(_=N.strstart,g=N.lookahead-(f-1);N.ins_h=(N.ins_h<<N.hash_shift^N.window[_+f-1])&N.hash_mask,N.prev[_&N.w_mask]=N.head[N.ins_h],N.head[N.ins_h]=_,_++,--g;);N.strstart=_,N.lookahead=f-1,oe(N)}return N.strstart+=N.lookahead,N.block_start=N.strstart,N.insert=N.lookahead,N.lookahead=0,N.match_length=N.prev_length=f-1,N.match_available=0,t.next_in=H,t.input=z,t.avail_in=U,N.wrap=I,c},n.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,o,n){"use strict";o.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,o,n){"use strict";o.exports=function(r,i){var s,l,p,k,m,C,c,v,d,y,u,w,E,S,x,L,A,b,f,B,R,h,O,a,j;s=r.state,l=r.next_in,a=r.input,p=l+(r.avail_in-5),k=r.next_out,j=r.output,m=k-(i-r.avail_out),C=k+(r.avail_out-257),c=s.dmax,v=s.wsize,d=s.whave,y=s.wnext,u=s.window,w=s.hold,E=s.bits,S=s.lencode,x=s.distcode,L=(1<<s.lenbits)-1,A=(1<<s.distbits)-1;e:do{E<15&&(w+=a[l++]<<E,E+=8,w+=a[l++]<<E,E+=8),b=S[w&L];t:for(;;){if(w>>>=f=b>>>24,E-=f,(f=b>>>16&255)===0)j[k++]=65535&b;else{if(!(16&f)){if((64&f)==0){b=S[(65535&b)+(w&(1<<f)-1)];continue t}if(32&f){s.mode=12;break e}r.msg="invalid literal/length code",s.mode=30;break e}B=65535&b,(f&=15)&&(E<f&&(w+=a[l++]<<E,E+=8),B+=w&(1<<f)-1,w>>>=f,E-=f),E<15&&(w+=a[l++]<<E,E+=8,w+=a[l++]<<E,E+=8),b=x[w&A];n:for(;;){if(w>>>=f=b>>>24,E-=f,!(16&(f=b>>>16&255))){if((64&f)==0){b=x[(65535&b)+(w&(1<<f)-1)];continue n}r.msg="invalid distance code",s.mode=30;break e}if(R=65535&b,E<(f&=15)&&(w+=a[l++]<<E,(E+=8)<f&&(w+=a[l++]<<E,E+=8)),c<(R+=w&(1<<f)-1)){r.msg="invalid distance too far back",s.mode=30;break e}if(w>>>=f,E-=f,(f=k-m)<R){if(d<(f=R-f)&&s.sane){r.msg="invalid distance too far back",s.mode=30;break e}if(O=u,(h=0)===y){if(h+=v-f,f<B){for(B-=f;j[k++]=u[h++],--f;);h=k-R,O=j}}else if(y<f){if(h+=v+y-f,(f-=y)<B){for(B-=f;j[k++]=u[h++],--f;);if(h=0,y<B){for(B-=f=y;j[k++]=u[h++],--f;);h=k-R,O=j}}}else if(h+=y-f,f<B){for(B-=f;j[k++]=u[h++],--f;);h=k-R,O=j}for(;2<B;)j[k++]=O[h++],j[k++]=O[h++],j[k++]=O[h++],B-=3;B&&(j[k++]=O[h++],1<B&&(j[k++]=O[h++]))}else{for(h=k-R;j[k++]=j[h++],j[k++]=j[h++],j[k++]=j[h++],2<(B-=3););B&&(j[k++]=j[h++],1<B&&(j[k++]=j[h++]))}break}}break}}while(l<p&&k<C);l-=B=E>>3,w&=(1<<(E-=B<<3))-1,r.next_in=l,r.next_out=k,r.avail_in=l<p?p-l+5:5-(l-p),r.avail_out=k<C?C-k+257:257-(k-C),s.hold=w,s.bits=E}},{}],49:[function(e,o,n){"use strict";var r=e("../utils/common"),i=e("./adler32"),s=e("./crc32"),l=e("./inffast"),p=e("./inftrees"),k=1,m=2,C=0,c=-2,v=1,d=852,y=592;function u(h){return(h>>>24&255)+(h>>>8&65280)+((65280&h)<<8)+((255&h)<<24)}function w(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function E(h){var O;return h&&h.state?(O=h.state,h.total_in=h.total_out=O.total=0,h.msg="",O.wrap&&(h.adler=1&O.wrap),O.mode=v,O.last=0,O.havedict=0,O.dmax=32768,O.head=null,O.hold=0,O.bits=0,O.lencode=O.lendyn=new r.Buf32(d),O.distcode=O.distdyn=new r.Buf32(y),O.sane=1,O.back=-1,C):c}function S(h){var O;return h&&h.state?((O=h.state).wsize=0,O.whave=0,O.wnext=0,E(h)):c}function x(h,O){var a,j;return h&&h.state?(j=h.state,O<0?(a=0,O=-O):(a=1+(O>>4),O<48&&(O&=15)),O&&(O<8||15<O)?c:(j.window!==null&&j.wbits!==O&&(j.window=null),j.wrap=a,j.wbits=O,S(h))):c}function L(h,O){var a,j;return h?(j=new w,(h.state=j).window=null,(a=x(h,O))!==C&&(h.state=null),a):c}var A,b,f=!0;function B(h){if(f){var O;for(A=new r.Buf32(512),b=new r.Buf32(32),O=0;O<144;)h.lens[O++]=8;for(;O<256;)h.lens[O++]=9;for(;O<280;)h.lens[O++]=7;for(;O<288;)h.lens[O++]=8;for(p(k,h.lens,0,288,A,0,h.work,{bits:9}),O=0;O<32;)h.lens[O++]=5;p(m,h.lens,0,32,b,0,h.work,{bits:5}),f=!1}h.lencode=A,h.lenbits=9,h.distcode=b,h.distbits=5}function R(h,O,a,j){var ne,P=h.state;return P.window===null&&(P.wsize=1<<P.wbits,P.wnext=0,P.whave=0,P.window=new r.Buf8(P.wsize)),j>=P.wsize?(r.arraySet(P.window,O,a-P.wsize,P.wsize,0),P.wnext=0,P.whave=P.wsize):(j<(ne=P.wsize-P.wnext)&&(ne=j),r.arraySet(P.window,O,a-j,ne,P.wnext),(j-=ne)?(r.arraySet(P.window,O,a-j,j,0),P.wnext=j,P.whave=P.wsize):(P.wnext+=ne,P.wnext===P.wsize&&(P.wnext=0),P.whave<P.wsize&&(P.whave+=ne))),0}n.inflateReset=S,n.inflateReset2=x,n.inflateResetKeep=E,n.inflateInit=function(h){return L(h,15)},n.inflateInit2=L,n.inflate=function(h,O){var a,j,ne,P,ee,D,Y,M,T,$,G,W,oe,ue,Q,te,ie,re,le,de,t,F,N,_,g=0,I=new r.Buf8(4),U=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!h||!h.state||!h.output||!h.input&&h.avail_in!==0)return c;(a=h.state).mode===12&&(a.mode=13),ee=h.next_out,ne=h.output,Y=h.avail_out,P=h.next_in,j=h.input,D=h.avail_in,M=a.hold,T=a.bits,$=D,G=Y,F=C;e:for(;;)switch(a.mode){case v:if(a.wrap===0){a.mode=13;break}for(;T<16;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}if(2&a.wrap&&M===35615){I[a.check=0]=255&M,I[1]=M>>>8&255,a.check=s(a.check,I,2,0),T=M=0,a.mode=2;break}if(a.flags=0,a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&M)<<8)+(M>>8))%31){h.msg="incorrect header check",a.mode=30;break}if((15&M)!=8){h.msg="unknown compression method",a.mode=30;break}if(T-=4,t=8+(15&(M>>>=4)),a.wbits===0)a.wbits=t;else if(t>a.wbits){h.msg="invalid window size",a.mode=30;break}a.dmax=1<<t,h.adler=a.check=1,a.mode=512&M?10:12,T=M=0;break;case 2:for(;T<16;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}if(a.flags=M,(255&a.flags)!=8){h.msg="unknown compression method",a.mode=30;break}if(57344&a.flags){h.msg="unknown header flags set",a.mode=30;break}a.head&&(a.head.text=M>>8&1),512&a.flags&&(I[0]=255&M,I[1]=M>>>8&255,a.check=s(a.check,I,2,0)),T=M=0,a.mode=3;case 3:for(;T<32;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}a.head&&(a.head.time=M),512&a.flags&&(I[0]=255&M,I[1]=M>>>8&255,I[2]=M>>>16&255,I[3]=M>>>24&255,a.check=s(a.check,I,4,0)),T=M=0,a.mode=4;case 4:for(;T<16;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}a.head&&(a.head.xflags=255&M,a.head.os=M>>8),512&a.flags&&(I[0]=255&M,I[1]=M>>>8&255,a.check=s(a.check,I,2,0)),T=M=0,a.mode=5;case 5:if(1024&a.flags){for(;T<16;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}a.length=M,a.head&&(a.head.extra_len=M),512&a.flags&&(I[0]=255&M,I[1]=M>>>8&255,a.check=s(a.check,I,2,0)),T=M=0}else a.head&&(a.head.extra=null);a.mode=6;case 6:if(1024&a.flags&&(D<(W=a.length)&&(W=D),W&&(a.head&&(t=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Array(a.head.extra_len)),r.arraySet(a.head.extra,j,P,W,t)),512&a.flags&&(a.check=s(a.check,j,W,P)),D-=W,P+=W,a.length-=W),a.length))break e;a.length=0,a.mode=7;case 7:if(2048&a.flags){if(D===0)break e;for(W=0;t=j[P+W++],a.head&&t&&a.length<65536&&(a.head.name+=String.fromCharCode(t)),t&&W<D;);if(512&a.flags&&(a.check=s(a.check,j,W,P)),D-=W,P+=W,t)break e}else a.head&&(a.head.name=null);a.length=0,a.mode=8;case 8:if(4096&a.flags){if(D===0)break e;for(W=0;t=j[P+W++],a.head&&t&&a.length<65536&&(a.head.comment+=String.fromCharCode(t)),t&&W<D;);if(512&a.flags&&(a.check=s(a.check,j,W,P)),D-=W,P+=W,t)break e}else a.head&&(a.head.comment=null);a.mode=9;case 9:if(512&a.flags){for(;T<16;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}if(M!==(65535&a.check)){h.msg="header crc mismatch",a.mode=30;break}T=M=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),h.adler=a.check=0,a.mode=12;break;case 10:for(;T<32;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}h.adler=a.check=u(M),T=M=0,a.mode=11;case 11:if(a.havedict===0)return h.next_out=ee,h.avail_out=Y,h.next_in=P,h.avail_in=D,a.hold=M,a.bits=T,2;h.adler=a.check=1,a.mode=12;case 12:if(O===5||O===6)break e;case 13:if(a.last){M>>>=7&T,T-=7&T,a.mode=27;break}for(;T<3;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}switch(a.last=1&M,T-=1,3&(M>>>=1)){case 0:a.mode=14;break;case 1:if(B(a),a.mode=20,O!==6)break;M>>>=2,T-=2;break e;case 2:a.mode=17;break;case 3:h.msg="invalid block type",a.mode=30}M>>>=2,T-=2;break;case 14:for(M>>>=7&T,T-=7&T;T<32;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}if((65535&M)!=(M>>>16^65535)){h.msg="invalid stored block lengths",a.mode=30;break}if(a.length=65535&M,T=M=0,a.mode=15,O===6)break e;case 15:a.mode=16;case 16:if(W=a.length){if(D<W&&(W=D),Y<W&&(W=Y),W===0)break e;r.arraySet(ne,j,P,W,ee),D-=W,P+=W,Y-=W,ee+=W,a.length-=W;break}a.mode=12;break;case 17:for(;T<14;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}if(a.nlen=257+(31&M),M>>>=5,T-=5,a.ndist=1+(31&M),M>>>=5,T-=5,a.ncode=4+(15&M),M>>>=4,T-=4,286<a.nlen||30<a.ndist){h.msg="too many length or distance symbols",a.mode=30;break}a.have=0,a.mode=18;case 18:for(;a.have<a.ncode;){for(;T<3;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}a.lens[U[a.have++]]=7&M,M>>>=3,T-=3}for(;a.have<19;)a.lens[U[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,N={bits:a.lenbits},F=p(0,a.lens,0,19,a.lencode,0,a.work,N),a.lenbits=N.bits,F){h.msg="invalid code lengths set",a.mode=30;break}a.have=0,a.mode=19;case 19:for(;a.have<a.nlen+a.ndist;){for(;te=(g=a.lencode[M&(1<<a.lenbits)-1])>>>16&255,ie=65535&g,!((Q=g>>>24)<=T);){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}if(ie<16)M>>>=Q,T-=Q,a.lens[a.have++]=ie;else{if(ie===16){for(_=Q+2;T<_;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}if(M>>>=Q,T-=Q,a.have===0){h.msg="invalid bit length repeat",a.mode=30;break}t=a.lens[a.have-1],W=3+(3&M),M>>>=2,T-=2}else if(ie===17){for(_=Q+3;T<_;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}T-=Q,t=0,W=3+(7&(M>>>=Q)),M>>>=3,T-=3}else{for(_=Q+7;T<_;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}T-=Q,t=0,W=11+(127&(M>>>=Q)),M>>>=7,T-=7}if(a.have+W>a.nlen+a.ndist){h.msg="invalid bit length repeat",a.mode=30;break}for(;W--;)a.lens[a.have++]=t}}if(a.mode===30)break;if(a.lens[256]===0){h.msg="invalid code -- missing end-of-block",a.mode=30;break}if(a.lenbits=9,N={bits:a.lenbits},F=p(k,a.lens,0,a.nlen,a.lencode,0,a.work,N),a.lenbits=N.bits,F){h.msg="invalid literal/lengths set",a.mode=30;break}if(a.distbits=6,a.distcode=a.distdyn,N={bits:a.distbits},F=p(m,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,N),a.distbits=N.bits,F){h.msg="invalid distances set",a.mode=30;break}if(a.mode=20,O===6)break e;case 20:a.mode=21;case 21:if(6<=D&&258<=Y){h.next_out=ee,h.avail_out=Y,h.next_in=P,h.avail_in=D,a.hold=M,a.bits=T,l(h,G),ee=h.next_out,ne=h.output,Y=h.avail_out,P=h.next_in,j=h.input,D=h.avail_in,M=a.hold,T=a.bits,a.mode===12&&(a.back=-1);break}for(a.back=0;te=(g=a.lencode[M&(1<<a.lenbits)-1])>>>16&255,ie=65535&g,!((Q=g>>>24)<=T);){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}if(te&&(240&te)==0){for(re=Q,le=te,de=ie;te=(g=a.lencode[de+((M&(1<<re+le)-1)>>re)])>>>16&255,ie=65535&g,!(re+(Q=g>>>24)<=T);){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}M>>>=re,T-=re,a.back+=re}if(M>>>=Q,T-=Q,a.back+=Q,a.length=ie,te===0){a.mode=26;break}if(32&te){a.back=-1,a.mode=12;break}if(64&te){h.msg="invalid literal/length code",a.mode=30;break}a.extra=15&te,a.mode=22;case 22:if(a.extra){for(_=a.extra;T<_;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}a.length+=M&(1<<a.extra)-1,M>>>=a.extra,T-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=23;case 23:for(;te=(g=a.distcode[M&(1<<a.distbits)-1])>>>16&255,ie=65535&g,!((Q=g>>>24)<=T);){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}if((240&te)==0){for(re=Q,le=te,de=ie;te=(g=a.distcode[de+((M&(1<<re+le)-1)>>re)])>>>16&255,ie=65535&g,!(re+(Q=g>>>24)<=T);){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}M>>>=re,T-=re,a.back+=re}if(M>>>=Q,T-=Q,a.back+=Q,64&te){h.msg="invalid distance code",a.mode=30;break}a.offset=ie,a.extra=15&te,a.mode=24;case 24:if(a.extra){for(_=a.extra;T<_;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}a.offset+=M&(1<<a.extra)-1,M>>>=a.extra,T-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){h.msg="invalid distance too far back",a.mode=30;break}a.mode=25;case 25:if(Y===0)break e;if(W=G-Y,a.offset>W){if((W=a.offset-W)>a.whave&&a.sane){h.msg="invalid distance too far back",a.mode=30;break}oe=W>a.wnext?(W-=a.wnext,a.wsize-W):a.wnext-W,W>a.length&&(W=a.length),ue=a.window}else ue=ne,oe=ee-a.offset,W=a.length;for(Y<W&&(W=Y),Y-=W,a.length-=W;ne[ee++]=ue[oe++],--W;);a.length===0&&(a.mode=21);break;case 26:if(Y===0)break e;ne[ee++]=a.length,Y--,a.mode=21;break;case 27:if(a.wrap){for(;T<32;){if(D===0)break e;D--,M|=j[P++]<<T,T+=8}if(G-=Y,h.total_out+=G,a.total+=G,G&&(h.adler=a.check=a.flags?s(a.check,ne,G,ee-G):i(a.check,ne,G,ee-G)),G=Y,(a.flags?M:u(M))!==a.check){h.msg="incorrect data check",a.mode=30;break}T=M=0}a.mode=28;case 28:if(a.wrap&&a.flags){for(;T<32;){if(D===0)break e;D--,M+=j[P++]<<T,T+=8}if(M!==(4294967295&a.total)){h.msg="incorrect length check",a.mode=30;break}T=M=0}a.mode=29;case 29:F=1;break e;case 30:F=-3;break e;case 31:return-4;case 32:default:return c}return h.next_out=ee,h.avail_out=Y,h.next_in=P,h.avail_in=D,a.hold=M,a.bits=T,(a.wsize||G!==h.avail_out&&a.mode<30&&(a.mode<27||O!==4))&&R(h,h.output,h.next_out,G-h.avail_out)?(a.mode=31,-4):($-=h.avail_in,G-=h.avail_out,h.total_in+=$,h.total_out+=G,a.total+=G,a.wrap&&G&&(h.adler=a.check=a.flags?s(a.check,ne,G,h.next_out-G):i(a.check,ne,G,h.next_out-G)),h.data_type=a.bits+(a.last?64:0)+(a.mode===12?128:0)+(a.mode===20||a.mode===15?256:0),($==0&&G===0||O===4)&&F===C&&(F=-5),F)},n.inflateEnd=function(h){if(!h||!h.state)return c;var O=h.state;return O.window&&(O.window=null),h.state=null,C},n.inflateGetHeader=function(h,O){var a;return h&&h.state?(2&(a=h.state).wrap)==0?c:((a.head=O).done=!1,C):c},n.inflateSetDictionary=function(h,O){var a,j=O.length;return h&&h.state?(a=h.state).wrap!==0&&a.mode!==11?c:a.mode===11&&i(1,O,j,0)!==a.check?-3:R(h,O,j,j)?(a.mode=31,-4):(a.havedict=1,C):c},n.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,o,n){"use strict";var r=e("../utils/common"),i=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],s=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],p=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];o.exports=function(k,m,C,c,v,d,y,u){var w,E,S,x,L,A,b,f,B,R=u.bits,h=0,O=0,a=0,j=0,ne=0,P=0,ee=0,D=0,Y=0,M=0,T=null,$=0,G=new r.Buf16(16),W=new r.Buf16(16),oe=null,ue=0;for(h=0;h<=15;h++)G[h]=0;for(O=0;O<c;O++)G[m[C+O]]++;for(ne=R,j=15;1<=j&&G[j]===0;j--);if(j<ne&&(ne=j),j===0)return v[d++]=20971520,v[d++]=20971520,u.bits=1,0;for(a=1;a<j&&G[a]===0;a++);for(ne<a&&(ne=a),h=D=1;h<=15;h++)if(D<<=1,(D-=G[h])<0)return-1;if(0<D&&(k===0||j!==1))return-1;for(W[1]=0,h=1;h<15;h++)W[h+1]=W[h]+G[h];for(O=0;O<c;O++)m[C+O]!==0&&(y[W[m[C+O]]++]=O);if(A=k===0?(T=oe=y,19):k===1?(T=i,$-=257,oe=s,ue-=257,256):(T=l,oe=p,-1),h=a,L=d,ee=O=M=0,S=-1,x=(Y=1<<(P=ne))-1,k===1&&852<Y||k===2&&592<Y)return 1;for(;;){for(b=h-ee,B=y[O]<A?(f=0,y[O]):y[O]>A?(f=oe[ue+y[O]],T[$+y[O]]):(f=96,0),w=1<<h-ee,a=E=1<<P;v[L+(M>>ee)+(E-=w)]=b<<24|f<<16|B|0,E!==0;);for(w=1<<h-1;M&w;)w>>=1;if(w!==0?(M&=w-1,M+=w):M=0,O++,--G[h]==0){if(h===j)break;h=m[C+y[O]]}if(ne<h&&(M&x)!==S){for(ee===0&&(ee=ne),L+=a,D=1<<(P=h-ee);P+ee<j&&!((D-=G[P+ee])<=0);)P++,D<<=1;if(Y+=1<<P,k===1&&852<Y||k===2&&592<Y)return 1;v[S=M&x]=ne<<24|P<<16|L-d|0}}return M!==0&&(v[L+M]=h-ee<<24|64<<16|0),u.bits=ne,0}},{"../utils/common":41}],51:[function(e,o,n){"use strict";o.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,o,n){"use strict";var r=e("../utils/common"),i=0,s=1;function l(g){for(var I=g.length;0<=--I;)g[I]=0}var p=0,k=29,m=256,C=m+1+k,c=30,v=19,d=2*C+1,y=15,u=16,w=7,E=256,S=16,x=17,L=18,A=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],b=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],f=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],B=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],R=new Array(2*(C+2));l(R);var h=new Array(2*c);l(h);var O=new Array(512);l(O);var a=new Array(256);l(a);var j=new Array(k);l(j);var ne,P,ee,D=new Array(c);function Y(g,I,U,H,z){this.static_tree=g,this.extra_bits=I,this.extra_base=U,this.elems=H,this.max_length=z,this.has_stree=g&&g.length}function M(g,I){this.dyn_tree=g,this.max_code=0,this.stat_desc=I}function T(g){return g<256?O[g]:O[256+(g>>>7)]}function $(g,I){g.pending_buf[g.pending++]=255&I,g.pending_buf[g.pending++]=I>>>8&255}function G(g,I,U){g.bi_valid>u-U?(g.bi_buf|=I<<g.bi_valid&65535,$(g,g.bi_buf),g.bi_buf=I>>u-g.bi_valid,g.bi_valid+=U-u):(g.bi_buf|=I<<g.bi_valid&65535,g.bi_valid+=U)}function W(g,I,U){G(g,U[2*I],U[2*I+1])}function oe(g,I){for(var U=0;U|=1&g,g>>>=1,U<<=1,0<--I;);return U>>>1}function ue(g,I,U){var H,z,V=new Array(y+1),J=0;for(H=1;H<=y;H++)V[H]=J=J+U[H-1]<<1;for(z=0;z<=I;z++){var q=g[2*z+1];q!==0&&(g[2*z]=oe(V[q]++,q))}}function Q(g){var I;for(I=0;I<C;I++)g.dyn_ltree[2*I]=0;for(I=0;I<c;I++)g.dyn_dtree[2*I]=0;for(I=0;I<v;I++)g.bl_tree[2*I]=0;g.dyn_ltree[2*E]=1,g.opt_len=g.static_len=0,g.last_lit=g.matches=0}function te(g){8<g.bi_valid?$(g,g.bi_buf):0<g.bi_valid&&(g.pending_buf[g.pending++]=g.bi_buf),g.bi_buf=0,g.bi_valid=0}function ie(g,I,U,H){var z=2*I,V=2*U;return g[z]<g[V]||g[z]===g[V]&&H[I]<=H[U]}function re(g,I,U){for(var H=g.heap[U],z=U<<1;z<=g.heap_len&&(z<g.heap_len&&ie(I,g.heap[z+1],g.heap[z],g.depth)&&z++,!ie(I,H,g.heap[z],g.depth));)g.heap[U]=g.heap[z],U=z,z<<=1;g.heap[U]=H}function le(g,I,U){var H,z,V,J,q=0;if(g.last_lit!==0)for(;H=g.pending_buf[g.d_buf+2*q]<<8|g.pending_buf[g.d_buf+2*q+1],z=g.pending_buf[g.l_buf+q],q++,H===0?W(g,z,I):(W(g,(V=a[z])+m+1,I),(J=A[V])!==0&&G(g,z-=j[V],J),W(g,V=T(--H),U),(J=b[V])!==0&&G(g,H-=D[V],J)),q<g.last_lit;);W(g,E,I)}function de(g,I){var U,H,z,V=I.dyn_tree,J=I.stat_desc.static_tree,q=I.stat_desc.has_stree,X=I.stat_desc.elems,ae=-1;for(g.heap_len=0,g.heap_max=d,U=0;U<X;U++)V[2*U]!==0?(g.heap[++g.heap_len]=ae=U,g.depth[U]=0):V[2*U+1]=0;for(;g.heap_len<2;)V[2*(z=g.heap[++g.heap_len]=ae<2?++ae:0)]=1,g.depth[z]=0,g.opt_len--,q&&(g.static_len-=J[2*z+1]);for(I.max_code=ae,U=g.heap_len>>1;1<=U;U--)re(g,V,U);for(z=X;U=g.heap[1],g.heap[1]=g.heap[g.heap_len--],re(g,V,1),H=g.heap[1],g.heap[--g.heap_max]=U,g.heap[--g.heap_max]=H,V[2*z]=V[2*U]+V[2*H],g.depth[z]=(g.depth[U]>=g.depth[H]?g.depth[U]:g.depth[H])+1,V[2*U+1]=V[2*H+1]=z,g.heap[1]=z++,re(g,V,1),2<=g.heap_len;);g.heap[--g.heap_max]=g.heap[1],function(se,ye){var Be,he,be,pe,Te,dt,Se=ye.dyn_tree,Dt=ye.max_code,An=ye.stat_desc.static_tree,In=ye.stat_desc.has_stree,Mn=ye.stat_desc.extra_bits,Pt=ye.stat_desc.extra_base,Ye=ye.stat_desc.max_length,Je=0;for(pe=0;pe<=y;pe++)se.bl_count[pe]=0;for(Se[2*se.heap[se.heap_max]+1]=0,Be=se.heap_max+1;Be<d;Be++)Ye<(pe=Se[2*Se[2*(he=se.heap[Be])+1]+1]+1)&&(pe=Ye,Je++),Se[2*he+1]=pe,Dt<he||(se.bl_count[pe]++,Te=0,Pt<=he&&(Te=Mn[he-Pt]),dt=Se[2*he],se.opt_len+=dt*(pe+Te),In&&(se.static_len+=dt*(An[2*he+1]+Te)));if(Je!==0){do{for(pe=Ye-1;se.bl_count[pe]===0;)pe--;se.bl_count[pe]--,se.bl_count[pe+1]+=2,se.bl_count[Ye]--,Je-=2}while(0<Je);for(pe=Ye;pe!==0;pe--)for(he=se.bl_count[pe];he!==0;)Dt<(be=se.heap[--Be])||(Se[2*be+1]!==pe&&(se.opt_len+=(pe-Se[2*be+1])*Se[2*be],Se[2*be+1]=pe),he--)}}(g,I),ue(V,ae,g.bl_count)}function t(g,I,U){var H,z,V=-1,J=I[1],q=0,X=7,ae=4;for(J===0&&(X=138,ae=3),I[2*(U+1)+1]=65535,H=0;H<=U;H++)z=J,J=I[2*(H+1)+1],++q<X&&z===J||(q<ae?g.bl_tree[2*z]+=q:z!==0?(z!==V&&g.bl_tree[2*z]++,g.bl_tree[2*S]++):q<=10?g.bl_tree[2*x]++:g.bl_tree[2*L]++,V=z,ae=(q=0)===J?(X=138,3):z===J?(X=6,3):(X=7,4))}function F(g,I,U){var H,z,V=-1,J=I[1],q=0,X=7,ae=4;for(J===0&&(X=138,ae=3),H=0;H<=U;H++)if(z=J,J=I[2*(H+1)+1],!(++q<X&&z===J)){if(q<ae)for(;W(g,z,g.bl_tree),--q!=0;);else z!==0?(z!==V&&(W(g,z,g.bl_tree),q--),W(g,S,g.bl_tree),G(g,q-3,2)):q<=10?(W(g,x,g.bl_tree),G(g,q-3,3)):(W(g,L,g.bl_tree),G(g,q-11,7));V=z,ae=(q=0)===J?(X=138,3):z===J?(X=6,3):(X=7,4)}}l(D);var N=!1;function _(g,I,U,H){G(g,(p<<1)+(H?1:0),3),function(z,V,J,q){te(z),q&&($(z,J),$(z,~J)),r.arraySet(z.pending_buf,z.window,V,J,z.pending),z.pending+=J}(g,I,U,!0)}n._tr_init=function(g){N||(function(){var I,U,H,z,V,J=new Array(y+1);for(z=H=0;z<k-1;z++)for(j[z]=H,I=0;I<1<<A[z];I++)a[H++]=z;for(a[H-1]=z,z=V=0;z<16;z++)for(D[z]=V,I=0;I<1<<b[z];I++)O[V++]=z;for(V>>=7;z<c;z++)for(D[z]=V<<7,I=0;I<1<<b[z]-7;I++)O[256+V++]=z;for(U=0;U<=y;U++)J[U]=0;for(I=0;I<=143;)R[2*I+1]=8,I++,J[8]++;for(;I<=255;)R[2*I+1]=9,I++,J[9]++;for(;I<=279;)R[2*I+1]=7,I++,J[7]++;for(;I<=287;)R[2*I+1]=8,I++,J[8]++;for(ue(R,C+1,J),I=0;I<c;I++)h[2*I+1]=5,h[2*I]=oe(I,5);ne=new Y(R,A,m+1,C,y),P=new Y(h,b,0,c,y),ee=new Y(new Array(0),f,0,v,w)}(),N=!0),g.l_desc=new M(g.dyn_ltree,ne),g.d_desc=new M(g.dyn_dtree,P),g.bl_desc=new M(g.bl_tree,ee),g.bi_buf=0,g.bi_valid=0,Q(g)},n._tr_stored_block=_,n._tr_flush_block=function(g,I,U,H){var z,V,J=0;0<g.level?(g.strm.data_type===2&&(g.strm.data_type=function(q){var X,ae=4093624447;for(X=0;X<=31;X++,ae>>>=1)if(1&ae&&q.dyn_ltree[2*X]!==0)return i;if(q.dyn_ltree[18]!==0||q.dyn_ltree[20]!==0||q.dyn_ltree[26]!==0)return s;for(X=32;X<m;X++)if(q.dyn_ltree[2*X]!==0)return s;return i}(g)),de(g,g.l_desc),de(g,g.d_desc),J=function(q){var X;for(t(q,q.dyn_ltree,q.l_desc.max_code),t(q,q.dyn_dtree,q.d_desc.max_code),de(q,q.bl_desc),X=v-1;3<=X&&q.bl_tree[2*B[X]+1]===0;X--);return q.opt_len+=3*(X+1)+5+5+4,X}(g),z=g.opt_len+3+7>>>3,(V=g.static_len+3+7>>>3)<=z&&(z=V)):z=V=U+5,U+4<=z&&I!==-1?_(g,I,U,H):g.strategy===4||V===z?(G(g,2+(H?1:0),3),le(g,R,h)):(G(g,4+(H?1:0),3),function(q,X,ae,se){var ye;for(G(q,X-257,5),G(q,ae-1,5),G(q,se-4,4),ye=0;ye<se;ye++)G(q,q.bl_tree[2*B[ye]+1],3);F(q,q.dyn_ltree,X-1),F(q,q.dyn_dtree,ae-1)}(g,g.l_desc.max_code+1,g.d_desc.max_code+1,J+1),le(g,g.dyn_ltree,g.dyn_dtree)),Q(g),H&&te(g)},n._tr_tally=function(g,I,U){return g.pending_buf[g.d_buf+2*g.last_lit]=I>>>8&255,g.pending_buf[g.d_buf+2*g.last_lit+1]=255&I,g.pending_buf[g.l_buf+g.last_lit]=255&U,g.last_lit++,I===0?g.dyn_ltree[2*U]++:(g.matches++,I--,g.dyn_ltree[2*(a[U]+m+1)]++,g.dyn_dtree[2*T(I)]++),g.last_lit===g.lit_bufsize-1},n._tr_align=function(g){G(g,2,3),W(g,E,R),function(I){I.bi_valid===16?($(I,I.bi_buf),I.bi_buf=0,I.bi_valid=0):8<=I.bi_valid&&(I.pending_buf[I.pending++]=255&I.bi_buf,I.bi_buf>>=8,I.bi_valid-=8)}(g)}},{"../utils/common":41}],53:[function(e,o,n){"use strict";o.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,o,n){(function(r){(function(i,s){"use strict";if(!i.setImmediate){var l,p,k,m,C=1,c={},v=!1,d=i.document,y=Object.getPrototypeOf&&Object.getPrototypeOf(i);y=y&&y.setTimeout?y:i,l={}.toString.call(i.process)==="[object process]"?function(S){process.nextTick(function(){w(S)})}:function(){if(i.postMessage&&!i.importScripts){var S=!0,x=i.onmessage;return i.onmessage=function(){S=!1},i.postMessage("","*"),i.onmessage=x,S}}()?(m="setImmediate$"+Math.random()+"$",i.addEventListener?i.addEventListener("message",E,!1):i.attachEvent("onmessage",E),function(S){i.postMessage(m+S,"*")}):i.MessageChannel?((k=new MessageChannel).port1.onmessage=function(S){w(S.data)},function(S){k.port2.postMessage(S)}):d&&"onreadystatechange"in d.createElement("script")?(p=d.documentElement,function(S){var x=d.createElement("script");x.onreadystatechange=function(){w(S),x.onreadystatechange=null,p.removeChild(x),x=null},p.appendChild(x)}):function(S){setTimeout(w,0,S)},y.setImmediate=function(S){typeof S!="function"&&(S=new Function(""+S));for(var x=new Array(arguments.length-1),L=0;L<x.length;L++)x[L]=arguments[L+1];var A={callback:S,args:x};return c[C]=A,l(C),C++},y.clearImmediate=u}function u(S){delete c[S]}function w(S){if(v)setTimeout(w,0,S);else{var x=c[S];if(x){v=!0;try{(function(L){var A=L.callback,b=L.args;switch(b.length){case 0:A();break;case 1:A(b[0]);break;case 2:A(b[0],b[1]);break;case 3:A(b[0],b[1],b[2]);break;default:A.apply(s,b)}})(x)}finally{u(S),v=!1}}}}function E(S){S.source===i&&typeof S.data=="string"&&S.data.indexOf(m)===0&&w(+S.data.slice(m.length))}})(typeof self>"u"?r===void 0?this:r:self)}).call(this,typeof global<"u"?global:typeof self<"u"?self:typeof window<"u"?window:{})},{}]},{},[10])(10)})});function ze(e){let o=document.getElementById(e),n=o.querySelector(".relative");o.classList.remove("pointer-events-none","opacity-0"),o.classList.add("pointer-events-auto","opacity-100"),requestAnimationFrame(()=>{n.classList.remove("translate-y-full"),n.classList.add("translate-y-0")})}function Oe(e){let o=document.getElementById(e),n=o.querySelector(".relative");n.classList.remove("translate-y-0"),n.classList.add("translate-y-full"),setTimeout(()=>{o.classList.add("pointer-events-none","opacity-0"),o.classList.remove("pointer-events-auto","opacity-100")},500)}function fe(){document.querySelectorAll(".ui-button").forEach(e=>{let o=e.dataset.type||"primary",n=e.dataset.size||"medium",r=e.dataset.fixedWidth,i=e.hasAttribute("data-fullwidth"),s=e.hasAttribute("disabled")||e.disabled;switch(e.className="ui-button",e.type="button",e.classList.add("font-semibold","rounded-lg","transition-all","duration-200","ease-in-out","flex","items-center","justify-center"),e.style.transform="none",n){case"small":e.classList.add("px-2","py-1","text-xs","sm:px-3","sm:py-1.5","sm:text-sm");break;case"large":e.classList.add("px-4","py-2.5","text-sm","sm:px-6","sm:py-3","sm:text-base","md:px-8","md:py-4");break;case"medium":default:e.classList.add("px-3","py-2","text-sm","sm:px-5","sm:py-2","sm:text-sm");break}switch(s?(e.setAttribute("disabled",""),e.classList.add("opacity-50","cursor-not-allowed"),e.style.boxShadow="none"):(e.removeAttribute("disabled"),e.classList.add("cursor-pointer")),o){case"primary":e.classList.add("bg-[#1993e5]","text-white","border","border-[#1993e5]","shadow-sm"),s||e.classList.add("hover:bg-blue-600","hover:border-blue-600","hover:shadow-md","focus:ring-2","focus:ring-blue-500","focus:ring-offset-2","active:bg-blue-700","transform","hover:scale-105");break;case"secondary":e.classList.add("bg-white","text-gray-700","border","border-gray-300","shadow-sm"),s||e.classList.add("hover:bg-gray-50","hover:border-gray-400","hover:text-gray-800","focus:ring-2","focus:ring-gray-500","focus:ring-offset-2","active:bg-gray-100");break;case"text":e.classList.remove("px-2","px-3","px-4","px-5","px-6","px-8","py-1","py-1.5","py-2","py-2.5","py-3","py-4","sm:px-3","sm:px-5","sm:px-6","sm:px-8","sm:py-1.5","sm:py-2","sm:py-3","sm:py-4","md:px-8","md:py-4"),e.classList.add("bg-transparent","text-blue-600","px-2","py-1","sm:px-3","sm:py-1.5"),s||e.classList.add("hover:underline","hover:text-blue-700","focus:ring-2","focus:ring-blue-500","focus:ring-offset-2");break;case"danger":e.classList.add("bg-red-500","text-white","border","border-red-500","shadow-sm"),s||e.classList.add("hover:bg-red-600","hover:border-red-600","hover:shadow-md","focus:ring-2","focus:ring-red-500","focus:ring-offset-2","active:bg-red-700","transform","hover:scale-105");break;case"warning":e.classList.add("bg-orange-500","text-white","border","border-orange-500","shadow-sm"),s||e.classList.add("hover:bg-orange-600","hover:border-orange-600","hover:shadow-md","focus:ring-2","focus:ring-orange-500","focus:ring-offset-2","active:bg-orange-700","transform","hover:scale-105");break}r&&(e.style.width=`${r}px`),i&&e.classList.add("w-full"),s||(e.classList.add("touch-manipulation","select-none"),e.style.minHeight="44px",e.style.minWidth="44px")})}function pt(){let e=document.getElementById("getStartedButton"),o=document.getElementById("privacyInfoModalButton"),n=document.getElementById("migrationInfoModalButton"),r=document.getElementById("closePrivacyInfoModal"),i=document.getElementById("closeMigrationInfoModal");fe(),e?.addEventListener("click",s=>{s.preventDefault(),ce("/upload")}),o?.addEventListener("click",()=>ze("privacyInfoModal")),r?.addEventListener("click",()=>Oe("privacyInfoModal")),n?.addEventListener("click",()=>ze("migrationInfoModal")),i?.addEventListener("click",()=>Oe("migrationInfoModal"))}var $t=`<div class="min-h-screen">
  <main class="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
    <section class="text-center mb-12 md:mb-16">
      <div class="inline-flex items-center justify-center gap-2 mb-6">
        <h1 class="text-3xl font-bold text-slate-900">YNAB to Monarch Migration</h1>
      </div>

      <p class="text-gray-600 max-w-2xl mx-auto mb-8">
        Moving your financial data from YNAB to Monarch made simple and secure. Choose the method that works best for
        you, and we'll guide you through each step.
      </p>

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

    <!-- Get Started Btn -->
    <section class="container-responsive flex flex-col items-center">
      <button id="getStartedButton" class="ui-button w-full" data-type="primary" data-size="large">
        Start Migrating Your Data
      </button>

      <a id="migrationInfoModalButton" class="ui-button mt-4 sm:mt-6 inline-block" data-type="text">
        How does this work?
      </a>
    </section>

  </main>

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
  </div>

</div>
`;var Z={credentials:{email:"",encryptedPassword:"",otp:"",remember:!1,apiToken:"",awaitingOtp:!1,deviceUuid:""},monarchAccounts:null,accounts:{},ynabOauth:{code:null,state:null,error:null}};var Zt=ut(Ht(),1),qt=ut(gt(),1);function Dn(){return"id-"+Math.random().toString(36).slice(2,11)}function Yt(e){if(!e)return 0;let o=e.replace(/[^0-9.-]+/g,"").trim(),n=parseFloat(o);return isNaN(n)?0:Math.round(n*100)}function Pn(e){let o=e.toLowerCase();return o.includes("credit")?{type:"credit",subtype:"credit_card"}:o.includes("loan")||o.includes("mortgage")||o.includes("student loan")?{type:"loan",subtype:"loan"}:o.includes("savings")?{type:"depository",subtype:"savings"}:o.includes("checking")||o.includes("debit")?{type:"depository",subtype:"checking"}:{type:"depository",subtype:"checking"}}async function yt(e,o){console.group("parseYNABCSV");let n=await qt.default.loadAsync(e),r=Object.keys(n.files).find(s=>s.toLowerCase().includes("register")&&s.toLowerCase().endsWith(".csv"));if(!r)throw console.error("\u274C No register CSV found in the ZIP file"),console.groupEnd("parseYNABCSV"),new Error("No register CSV found in the ZIP file");let i=await n.files[r].async("string");return console.groupEnd("parseYNABCSV"),jn(i,o)}function jn(e,o){return console.group("parseCSV"),new Promise((n,r)=>{Zt.default.parse(e,{header:!0,skipEmptyLines:!0,complete:({data:i})=>{if(!i||i.length===0)return console.groupEnd("parseCSV"),r(new Error("\u274C CSV file appears to be empty or invalid."));let s=new Map;for(let l of i){let p=l.Account?.trim();if(!p){console.warn("\u274C Skipping row with missing account name:",l);continue}if(l.Date){let[v,d,y]=l.Date.split("/");v&&d&&y&&(l.Date=`${y}-${v.padStart(2,"0")}-${d.padStart(2,"0")}`)}let k=Yt(l.Inflow),m=Yt(l.Outflow),C=k-m;if(k>0?l.Amount=(k/100).toFixed(2):m>0?l.Amount=(-m/100).toFixed(2):l.Amount="0.00",!s.has(p)){let{type:v,subtype:d}=Pn(p,o);s.set(p,{id:Dn(),name:p,modifiedName:p,type:v,subtype:d,transactions:[],transactionCount:0,balanceCents:0,included:!0,selected:!1,status:"unprocessed"})}let c=s.get(p);c.transactions.push({Date:l.Date,Merchant:l.Payee||"",Category:l.Category||"","Category Group":l["Category Group"]||"",Notes:l.Memo||"",Amount:l.Amount,Tags:l.Flag||""}),c.transactionCount+=1,c.balanceCents+=C}for(let l of s.values())l.balance=l.balanceCents/100,l.included=l.transactionCount>0;console.groupEnd("parseCSV"),n(Object.fromEntries(s))},error:i=>r(i)})})}var Un="https://app.youneedabudget.com/oauth/authorize",$n="/oauth/ynab/callback",bt="ynab_oauth_expected_state",Hn="Please provide your YNAB OAuth client ID via window.YNAB_OAUTH_CLIENT_ID before using the login button.";function Wn(){return`${location.origin}${$n}`}function Vt(){return(window.YNAB_OAUTH_CLIENT_ID||"").trim()}function xt(){try{return window.sessionStorage}catch(e){return console.warn("Session storage unavailable:",e),null}}function Yn(e){let o=xt();!o||o.setItem(bt,e)}function Zn(){let e=xt();return e?e.getItem(bt):null}function qn(){let e=xt();!e||e.removeItem(bt)}function Vn(){let e=window.crypto||window.msCrypto;if(e?.randomUUID)return e.randomUUID();if(e?.getRandomValues){let o=new Uint8Array(16);return e.getRandomValues(o),Array.from(o,n=>n.toString(16).padStart(2,"0")).join("")}return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)}function Gn(e){let o=new URL(Un);return o.searchParams.set("client_id",Vt()),o.searchParams.set("response_type","code"),o.searchParams.set("redirect_uri",Wn()),o.searchParams.set("state",e),o.toString()}function Gt(){if(!Vt())return window.alert(Hn),null;let o=Vn();Yn(o);let n=Gn(o);return window.location.assign(n),n}function Kt(){return Zn()}function Jt(){return qn()}function vt(){let e=document.getElementById("errorMessage"),o=document.getElementById("connectButton"),n=document.getElementById("manualUploadButton"),r=document.getElementById("manualFileInput"),i=document.getElementById("oauthInfoModalButton"),s=document.getElementById("manualImportInfoModalButton"),l=document.getElementById("closeOauthInfoModal"),p=document.getElementById("closeManualImportInfoModal");fe(),o?.addEventListener("click",m=>{m.preventDefault(),Gt()}),i?.addEventListener("click",()=>ze("oauthInfoModal")),s?.addEventListener("click",()=>ze("manualImportInfoModal")),l?.addEventListener("click",()=>Oe("oauthInfoModal")),p?.addEventListener("click",()=>Oe("manualImportInfoModal")),n?.addEventListener("click",m=>{m.preventDefault(),r?.click()}),r?.addEventListener("change",async m=>{let C=m.target.files[0];C&&await k(C)});async function k(m){let C=m.name.toLowerCase(),c=m.type.toLowerCase();console.log("File upload debug:",{name:m.name,type:m.type,size:m.size,fileName:C,fileType:c});let v=C.endsWith(".zip")||C.endsWith(".bin")||C.includes("ynab")||C.includes("register")||C.includes("export"),d=["application/zip","application/x-zip-compressed","application/octet-stream","application/x-zip","multipart/x-zip","application/x-compressed","application/binary"].includes(c),y=v||d||m.size>1e3;if(console.log("File validation debug:",{isZipByExtension:v,isZipByMimeType:d,isPotentialZip:y,fileSize:m.size}),!y){console.log("File rejected - not a potential ZIP"),e.textContent="Please upload a ZIP export from YNAB.",e.classList.remove("hidden");return}console.log("File accepted, attempting to parse...");try{let u=await yt(m);Z.accounts=u,Ce(),u&&Object.keys(u).length>0?ce("/review",!1,!0):(e.textContent="No accounts found in the uploaded file.",e.classList.remove("hidden"))}catch(u){e.textContent="Failed to parse file. Please ensure it's a valid YNAB ZIP export with register.csv and plan.csv.",e.classList.remove("hidden"),console.error(u)}}}var Xt=`<div class="min-h-screen">
  <main class="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
    <section class="text-center mb-12 md:mb-16">
      <div class="inline-flex items-center justify-center gap-2 mb-6">
        <h1 class="text-3xl font-bold text-slate-900">Step 1: Import YNAB Data</h1>
      </div>

      <p class="text-gray-600 max-w-2xl mx-auto mb-8">
        Choose how you'd like to bring your YNAB data into Monarch Money. You can either connect your YNAB account for a
        seamless transfer or manually upload a file.
      </p>
    </section>

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
            <button id="connectButton" class="ui-button w-full" data-type="primary" data-size="large"
              title="Coming soon" disabled>
              Connect YNAB Account
            </button>
            <p class="text-xs text-gray-400 text-center">Coming Soon</p>
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
  </main>
</div>

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
</div>

</div>`;var Jn="2025-06-02T06:26:29.704Z",Xn="tools/fetchMonarchAccountTypes.js",Qn=[{typeName:"depository",typeDisplay:"Cash",group:"asset",subtypes:[{name:"cd",display:"CD"},{name:"checking",display:"Checking"},{name:"savings",display:"Savings"},{name:"money_market",display:"Money Market"},{name:"paypal",display:"Mobile Payment System"},{name:"prepaid",display:"Prepaid"},{name:"cash_management",display:"Cash Management"}]},{typeName:"brokerage",typeDisplay:"Investments",group:"asset",subtypes:[{name:"st_401a",display:"401a"},{name:"st_401k",display:"401k"},{name:"st_403b",display:"403b"},{name:"st_457b",display:"457b"},{name:"st_529",display:"529 Plan"},{name:"brokerage",display:"Brokerage (Taxable)"},{name:"cash_isa",display:"Individual Savings Account (ISA) - Cash"},{name:"cryptocurrency",display:"Cryptocurrency"},{name:"education_savings_account",display:"Coverdell Education Savings Account (ESA)"},{name:"gic",display:"Guaranteed Investment Certificate (GIC)"},{name:"fixed_annuity",display:"Fixed Annuity"},{name:"health_reimbursement_arrangement",display:"Health Reimbursement Arrangement (HRA)"},{name:"health_savings_account",display:"Health Savings Account (HSA)"},{name:"iso",display:"Incentive Stock Options (ISO)"},{name:"ira",display:"Individual Retirement Account (IRA)"},{name:"isa",display:"Individual Savings Account (ISA) - Non-cash"},{name:"lif",display:"Life Income Fund (LIF) Retirement Account"},{name:"lira",display:"Locked-in Retirement Account (LIRA)"},{name:"lrif",display:"Locked-in Retirement Income Fund (LRIF)"},{name:"lrsp",display:"Locked-in Retirement Savings Plan (LRSP)"},{name:"keogh_plan",display:"Keogh Plan"},{name:"mutual_fund",display:"Mutual Fund"},{name:"nso",display:"Non-qualified Stock Options (NSO)"},{name:"non_taxable_brokerage_account",display:"Brokerage (Non-taxable)"},{name:"other",display:"Other"},{name:"prif",display:"Prescribed Registered Retirement Income Fund (PRIF)"},{name:"rdsp",display:"Registered Disability Savings Plan (RDSP)"},{name:"resp",display:"Registered Education Savings Plan (RESP)"},{name:"rlif",display:"Restricted Life Income Fund (RLIF)"},{name:"rrif",display:"Registered Retirement Income Fund (RRIF)"},{name:"pension",display:"Pension"},{name:"profit_sharing_plan",display:"Profit Sharing Plan"},{name:"qualifying_share_account",display:"Qualifying Share Account"},{name:"retirement",display:"Retirement"},{name:"roth",display:"Roth IRA"},{name:"roth_401k",display:"Roth 401k"},{name:"rrsp",display:"Registered Retirement Savings Plan (RRSP)"},{name:"sarsep_pension",display:"Salary Reduction Simplified Employee Pension Plan (SARSEP)"},{name:"sep_ira",display:"Simplified Employee Pension IRA (SEP IRA)"},{name:"simple_ira",display:"Simple IRA"},{name:"sipp",display:"Self-Invested Personal Pension (SIPP)"},{name:"stock_plan",display:"Stock Plan"},{name:"thrift_savings_plan",display:"Thrift Savings Plan (TSP)"},{name:"trust",display:"Trust"},{name:"tfsa",display:"Tax-Free Savings Account (TFSA)"},{name:"ugma",display:"Uniform Gift to Minors Act (UGMA)"},{name:"utma",display:"Uniform Transfers to Minors Act (UTMA)"},{name:"variable_annuity",display:"Variable Annuity"},{name:"fhsa",display:"First Home Savings Account (FHSA)"}]},{typeName:"real_estate",typeDisplay:"Real Estate",group:"asset",subtypes:[{name:"primary_home",display:"Primary Home"},{name:"secondary_home",display:"Secondary Home"},{name:"rental_property",display:"Rental Property"}]},{typeName:"vehicle",typeDisplay:"Vehicles",group:"asset",subtypes:[{name:"car",display:"Car"},{name:"boat",display:"Boat"},{name:"motorcycle",display:"Motorcycle"},{name:"snowmobile",display:"Snowmobile"},{name:"bicycle",display:"Bicycle"},{name:"other",display:"Other"}]},{typeName:"valuables",typeDisplay:"Valuables",group:"asset",subtypes:[{name:"art",display:"Art"},{name:"jewelry",display:"Jewelry"},{name:"collectibles",display:"Collectibles"},{name:"furniture",display:"Furniture"},{name:"other",display:"Other"}]},{typeName:"credit",typeDisplay:"Credit Cards",group:"liability",subtypes:[{name:"credit_card",display:"Credit Card"}]},{typeName:"loan",typeDisplay:"Loans",group:"liability",subtypes:[{name:"auto",display:"Auto"},{name:"business",display:"Business"},{name:"commercial",display:"Commercial"},{name:"construction",display:"Construction"},{name:"consumer",display:"Consumer"},{name:"home",display:"Home"},{name:"home_equity",display:"Home Equity"},{name:"loan",display:"Loan"},{name:"mortgage",display:"Mortgage"},{name:"overdraft",display:"Overdraft"},{name:"line_of_credit",display:"Line of Credit"},{name:"student",display:"Student"}]},{typeName:"other_asset",typeDisplay:"Other Assets",group:"asset",subtypes:[{name:"other",display:"Other"}]},{typeName:"other_liability",typeDisplay:"Other Liabilities",group:"liability",subtypes:[{name:"other",display:"Other"}]}],Ae={generatedAt:Jn,generatedBy:Xn,data:Qn};function er(){let e=et(),o=document.getElementById("backBtn");if(!o)return;let r={"/review":"Back to Upload","/method":"Back to Review","/manual":"Back to Method","/login":"Back to Method","/otp":"Back to Login","/complete":"Back to Review"}[e]||"Back";o.innerHTML=`
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    ${r}
  `}function Qe(){er();let e=document.getElementById("backToMethodBtn");e&&(e.innerHTML=`
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Method
    `)}function Qt(e={}){let{backText:o="Back",nextText:n="Continue",backId:r="backBtn",nextId:i="continueBtn",showBack:s=!0,showNext:l=!1,nextType:p="primary",nextDisabled:k=!1,containerClass:m=""}=e,C=s?`
    <button id="${r}" class="ui-button order-2 sm:order-1 w-full sm:w-auto whitespace-nowrap" data-type="secondary" data-size="large">
      <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      ${o}
    </button>
  `:"<div></div>",c=l?`
    <button id="${i}" 
            class="ui-button order-1 sm:order-2 w-full sm:w-auto whitespace-nowrap" 
            data-type="${p}" 
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
        <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center py-6 sm:py-8 gap-4 sm:gap-6 ${m}">
          ${C}
          ${c}
        </div>
      </div>
    </div>
  `}function Re(e={}){let{backText:o="Back",backId:n="backBtn",containerClass:r=""}=e;return`
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
  `}function en(e){return e.charAt(0).toUpperCase()+e.slice(1)}var tt=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});function ke(e){return Ae.data.find(o=>o.typeName===e)}function Fe(e,o){return ke(e)?.subtypes.find(r=>r.name===o)}function ve(e,o){e.disabled=o,e.classList.toggle("cursor-default",o),e.classList.toggle("cursor-pointer",!o),e.classList.toggle("opacity-50",o)}function xe(e,o){o?(e.classList.remove("hidden"),e.removeAttribute("aria-hidden"),e.removeAttribute("hidden")):(e.classList.add("hidden"),e.setAttribute("aria-hidden","true"),e.setAttribute("hidden","true"))}var kt,Pe,je,wt,K={accountName:"",nameMatchType:"contains",nameCaseSensitive:!1,types:new Set,subtypes:new Set,transactionsMin:null,transactionsMax:null,balanceMin:null,balanceMax:null,inclusion:"all"},qe="";function _t(){if(!Z.accounts||Object.keys(Z.accounts).length===0){ce("/upload",!0);return}let e=document.querySelector(".flex.flex-col.max-w-7xl"),o={backText:"Back",showBack:!0,showNext:!0,nextText:"Continue",nextId:"continueBtn",nextType:"primary"};e.insertAdjacentHTML("beforeend",Qt(o)),kt=document.getElementById("reviewTableBody"),Pe=document.getElementById("mobileAccountList"),je=document.getElementById("continueBtn"),wt=document.getElementById("searchInput"),fe(),Qe(),me(),setTimeout(()=>{sr();let i=Object.keys(Z.accounts).length;Bt(i,i)},100);let n;wt.addEventListener("input",()=>{clearTimeout(n),n=setTimeout(()=>{qe=wt.value.toLowerCase(),me(),Ce()},200)}),setTimeout(()=>{let i=document.getElementById("filtersBtn");i?(console.log("Adding click listener to filters button"),i.addEventListener("click",c=>{console.log("Filters button clicked!"),c.preventDefault(),cn()})):console.error("Filters button not found!");let s=document.getElementById("filtersModalClose");s&&s.addEventListener("click",Ie);let l=document.getElementById("filtersApply");l&&l.addEventListener("click",dn);let p=document.getElementById("filtersReset");p&&p.addEventListener("click",rt);let k=document.getElementById("clearAllFilters");k&&k.addEventListener("click",k);let m=document.getElementById("filtersModal");m&&m.addEventListener("click",c=>{c.target.id==="filtersModal"&&Ie()}),document.addEventListener("keydown",c=>{c.key==="Escape"&&m&&!m.classList.contains("hidden")&&Ie()});let C=document.getElementById("clearFiltersBtn");C&&C.addEventListener("click",()=>{rt(),Ie()})},100),document.getElementById("unselectAllBtnMobile").addEventListener("click",()=>tn(!1)),document.getElementById("unselectAllBtnDesktop").addEventListener("click",()=>tn(!1)),document.getElementById("bulkIncludeBtnMobile").addEventListener("click",()=>nt(!0)),document.getElementById("bulkIncludeBtnDesktop").addEventListener("click",()=>nt(!0)),document.getElementById("bulkExcludeBtnMobile").addEventListener("click",()=>nt(!1)),document.getElementById("bulkExcludeBtnDesktop").addEventListener("click",()=>nt(!1)),document.getElementById("bulkRenameBtnMobile").addEventListener("click",rn),document.getElementById("bulkRenameBtnDesktop").addEventListener("click",rn),document.getElementById("bulkTypeBtnMobile").addEventListener("click",an),document.getElementById("bulkTypeBtnDesktop").addEventListener("click",an),document.getElementById("masterCheckbox").addEventListener("change",nn);let r=document.getElementById("masterCheckboxMobile");r&&r.addEventListener("change",nn),document.getElementById("continueBtn").addEventListener("click",()=>ce("/method")),document.getElementById("backBtn").addEventListener("click",()=>_e()),me()}function tn(e){Object.values(Z.accounts).forEach(o=>{o.status!=="processed"&&(o.selected=e)}),Ce(),me()}function nt(e){Object.values(Z.accounts).forEach(o=>{o.selected&&(o.included=e)}),Ce(),me()}function me(){let e=document.createDocumentFragment(),o=document.createDocumentFragment(),n=Object.values(Z.accounts),r=0;kt.innerHTML="",Pe&&(Pe.innerHTML="");for(let l of n)!un(l)||qe&&!l.modifiedName.toLowerCase().includes(qe)||(r++,e.appendChild(nr(l)),Pe&&o.appendChild(rr(l)));kt.appendChild(e),Pe&&Pe.appendChild(o),Bt(r,n.length),Ct(st()),St(),Et();let i=n.filter(tr).length,s=i>0;ve(je,!s),je.title=je.disabled?"At least one account must be included to proceed":"",s?je.textContent=`Continue with ${i} account${i!==1?"s":""}`:je.textContent="Continue",fe()}function tr(e){return e.included&&e.status!=="processed"}function nr(e){let o=document.createElement("tr");o.setAttribute("role","row"),o.className="border-t border-[#dce1e5]";let n=e.status==="processed",r=e.status==="failed",i=document.createElement("td");i.className="px-2 py-2 text-center";let s=document.createElement("input");s.type="checkbox";let l=`account-checkbox-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;s.id=l,s.name=l,s.setAttribute("aria-label",`Select account: ${e.modifiedName}`),s.className="w-5 h-5",ve(s,n),s.checked=e.selected,s.addEventListener("change",()=>{e.selected=s.checked,St(),Ct(st())}),i.appendChild(s),o.appendChild(i);let p=document.createElement("td");p.className="px-2 py-2 max-w-[300px] truncate",p.textContent=e.modifiedName,n?p.classList.add("text-gray-400","cursor-default"):(p.classList.add("cursor-pointer"),p.title=`Click to rename '${e.modifiedName}'`,p.addEventListener("click",()=>on(e,p))),o.appendChild(p);let k=document.createElement("td");k.className="px-2 py-2";let m=document.createElement("select"),C=`type-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;m.id=C,m.name=C,m.title=ke(e.type)?.typeDisplay||"",m.className="border rounded px-2 py-1 w-full",m.disabled=n,n?m.classList.add("text-gray-300","cursor-default"):m.classList.add("cursor-pointer"),Ae.data.forEach(x=>{let L=document.createElement("option");L.value=x.typeName,L.textContent=x.typeDisplay,x.typeName===e.type&&(L.selected=!0),m.appendChild(L)}),m.addEventListener("change",()=>{e.type=m.value;let x=ke(e.type);e.subtype=x?.subtypes[0]?.name||null,me()}),k.appendChild(m),o.appendChild(k);let c=document.createElement("td");c.className="px-2 py-2";let v=document.createElement("select"),d=`subtype-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;v.id=d,v.name=d,v.className="border rounded px-2 py-1 w-full",v.disabled=n,n?v.classList.add("text-gray-300","cursor-default"):v.classList.add("cursor-pointer");let y=ke(e.type);v.title=Fe(e.type,e.subtype)?.display||"",(y?.subtypes||[]).forEach(x=>{let L=document.createElement("option");L.value=x.name,L.textContent=x.display,x.name===e.subtype&&(L.selected=!0),v.appendChild(L)}),v.addEventListener("change",()=>{e.subtype=v.value,me()}),c.appendChild(v),o.appendChild(c);let u=document.createElement("td");u.className="px-2 py-2 text-center cursor-default",u.textContent=e.transactionCount,u.title=`${e.transactionCount} transaction${e.transactionCount!==1?"s":""}`,n&&u.classList.add("text-gray-400"),o.appendChild(u);let w=document.createElement("td");w.className="px-2 py-2 text-[#637988] cursor-default",w.textContent=tt.format(e.balance),w.title=`Balance: ${tt.format(e.balance)}`,n&&w.classList.add("text-gray-400"),o.appendChild(w);let E=document.createElement("td");E.className="px-2 py-2 flex items-center gap-2";let S=document.createElement("button");if(S.classList.add("ui-button"),S.dataset.type=e.included?"primary":"secondary",S.dataset.size="small",S.textContent=n?"Processed":e.included?"Included":"Excluded",S.disabled=n,S.title=n?"This account has already been processed":e.included?"Click to exclude this account":"Click to include this account",n||S.addEventListener("click",()=>{e.included=!e.included,Ce(),me()}),E.appendChild(S),r){let x=document.createElement("span");x.className="text-red-600 text-xl cursor-default",x.innerHTML="\u26A0\uFE0F",x.title="Previously failed to process",E.appendChild(x)}return o.appendChild(E),o}function rr(e){let o=document.createElement("div");o.className="mobile-account-card";let n=e.status==="processed",r=e.status==="failed",i=document.createElement("label");i.className="custom-checkbox-container flex-shrink-0";let s=document.createElement("input");s.type="checkbox",s.className="custom-checkbox-input";let l=`mobile-account-checkbox-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;s.id=l,s.name=l,s.setAttribute("aria-label",`Select account: ${e.modifiedName}`),s.disabled=n,s.checked=e.selected||!1,s.addEventListener("change",()=>{e.selected=s.checked,Ce(),St(),Ct(st()),Et()});let p=document.createElement("span");p.className="custom-checkbox-visual",i.appendChild(s),i.appendChild(p),o.appendChild(i);let k=document.createElement("div");k.className="card-content";let m=document.createElement("div");m.className="account-name",m.textContent=e.modifiedName,n?m.classList.add("text-gray-400","cursor-default"):(m.classList.add("cursor-pointer","hover:text-blue-600","transition-colors","duration-200"),m.title=`Click to rename '${e.modifiedName}'`,m.addEventListener("click",()=>on(e,m))),k.appendChild(m);let C=document.createElement("div");C.className="account-details";let c=document.createElement("div");c.className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4";let v=document.createElement("div");v.className="flex items-center gap-2 flex-1 min-w-0";let d=document.createElement("span");d.textContent="Type:",d.className="text-xs font-medium text-gray-500 flex-shrink-0";let y=document.createElement("select"),u=`mobile-type-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;y.id=u,y.name=u,y.title=ke(e.type)?.typeDisplay||"",y.className="border border-gray-300 rounded-lg px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white",y.disabled=n,n?y.classList.add("text-gray-300","bg-gray-50","cursor-not-allowed"):y.classList.add("cursor-pointer"),Ae.data.forEach(R=>{let h=document.createElement("option");h.value=R.typeName,h.textContent=R.typeDisplay,R.typeName===e.type&&(h.selected=!0),y.appendChild(h)}),y.addEventListener("change",()=>{e.type=y.value;let R=ke(e.type);e.subtype=R?.subtypes[0]?.name||null,me()}),v.appendChild(d),v.appendChild(y),c.appendChild(v);let w=document.createElement("div");w.className="flex items-center gap-2 flex-1 min-w-0";let E=document.createElement("span");E.textContent="Sub:",E.className="text-xs font-medium text-gray-500 flex-shrink-0";let S=document.createElement("select"),x=`mobile-subtype-select-${e.id||e.modifiedName.replace(/\s+/g,"-")}`;S.id=x,S.name=x,S.className="border border-gray-300 rounded-lg px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white",S.disabled=n,n?S.classList.add("text-gray-300","bg-gray-50","cursor-not-allowed"):S.classList.add("cursor-pointer");let L=ke(e.type);S.title=Fe(e.type,e.subtype)?.display||"",(L?.subtypes||[]).forEach(R=>{let h=document.createElement("option");h.value=R.name,h.textContent=R.display,R.name===e.subtype&&(h.selected=!0),S.appendChild(h)}),S.addEventListener("change",()=>{e.subtype=S.value,me()}),w.appendChild(E),w.appendChild(S),c.appendChild(w),C.appendChild(c);let A=document.createElement("div");A.className="flex justify-between items-center";let b=document.createElement("span");b.className=n?"text-gray-400":"text-gray-600",b.textContent=`${e.transactionCount} transaction${e.transactionCount!==1?"s":""}`;let f=document.createElement("span");f.className=`account-balance ${n?"text-gray-400":"text-gray-900"}`,f.textContent=tt.format(e.balance),A.appendChild(b),A.appendChild(f),C.appendChild(A);let B=document.createElement("div");if(B.className="flex items-center justify-end pt-1",!n){let R=document.createElement("button");R.className=`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${e.included?"bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-500":"bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 focus:ring-green-500"}`,R.textContent=e.included?"Exclude":"Include",R.title=e.included?"Click to exclude this account":"Click to include this account",R.addEventListener("click",()=>{e.included=!e.included,me()}),B.appendChild(R)}if(r){let R=document.createElement("span");R.className="text-red-600 text-lg cursor-default ml-2",R.innerHTML="\u26A0\uFE0F",R.title="Previously failed to process",B.appendChild(R)}return C.appendChild(B),k.appendChild(C),o.appendChild(k),o}function Ct(e){let o=document.getElementById("masterCheckbox"),n=document.getElementById("masterCheckboxMobile"),r=e.filter(l=>l.selected).length,i=r>0&&r===e.length,s=r>0&&r<e.length;o&&(o.checked=i,o.indeterminate=s),n&&(n.checked=i,n.indeterminate=s),Et()}function Et(){let e=document.getElementById("mobileSelectionCount");if(e){let o=Object.values(Z.accounts).filter(n=>n.selected).length;e.textContent=`${o} selected`}}function st(){return Object.values(Z.accounts).filter(e=>!(e.status==="processed"||!un(e)||qe&&!e.modifiedName.toLowerCase().includes(qe)))}function nn(e){let o=e.target.checked;st().forEach(n=>{n.selected=o}),me()}function St(){let e=document.getElementById("bulkActionBar"),o=Object.values(Z.accounts).filter(i=>i.selected).length,n=document.getElementById("selectedCountMobile");n&&(n.textContent=o);let r=document.getElementById("selectedCountDesktop");r&&(r.textContent=o),o>0?(e.classList.remove("hidden"),e.classList.add("active")):(e.classList.remove("active"),setTimeout(()=>{e.classList.contains("active")||e.classList.add("hidden")},300))}function on(e,o){let n=document.createElement("div");n.className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 opacity-0 transition-opacity duration-200",document.body.appendChild(n),requestAnimationFrame(()=>n.classList.add("opacity-100"));let r=document.createElement("div");r.className="bg-white rounded-lg shadow-lg p-5 w-[400px]";let i=document.createElement("h2");i.className="font-bold mb-3 text-lg",i.textContent="Edit Account Name",r.appendChild(i);let s=document.createElement("input");s.type="text",s.value=e.modifiedName,s.setAttribute("aria-label","Account name input"),s.className="border rounded w-full px-3 py-2 mb-4",r.appendChild(s);let l=document.createElement("div");l.className="flex justify-end gap-2";let p=document.createElement("button");p.textContent="Cancel",p.className="bg-gray-300 px-4 py-2 rounded",p.addEventListener("click",()=>m());let k=document.createElement("button");k.textContent="Save",k.className="bg-blue-500 text-white px-4 py-2 rounded font-bold",k.addEventListener("click",C),l.appendChild(p),l.appendChild(k),r.appendChild(l),n.appendChild(r),s.focus(),s.select(),n.addEventListener("keydown",c=>{c.key==="Escape"&&m(),c.key==="Enter"&&C()});function m(){n.classList.remove("opacity-100"),n.classList.add("opacity-0"),setTimeout(()=>document.body.removeChild(n),200)}function C(){e.modifiedName=s.value.trim(),o.textContent=e.modifiedName,o.title=`Click to rename '${e.modifiedName}'`,m()}}function rn(){let e=document.getElementById("bulkRenameModal"),o=document.getElementById("renamePattern"),n=document.getElementById("indexStart"),r=document.getElementById("renamePreview"),i=document.getElementById("renameCancel"),s=document.getElementById("renameApply"),l=e.querySelectorAll(".token-btn");e.classList.remove("hidden"),o.focus();let p=Object.values(Z.accounts).filter(m=>m.selected);l.forEach(m=>{m.addEventListener("click",()=>{let C=m.dataset.token;o.value+=C,k()})}),o.addEventListener("input",k),n.addEventListener("input",k),k();function k(){r.innerHTML="";let m=o.value,C=parseInt(n.value,10)||1;p.slice(0,3).forEach((c,v)=>{let d=sn(m,c,v+C),y=document.createElement("div");y.textContent=d,r.appendChild(y)})}i.onclick=()=>e.classList.add("hidden"),s.onclick=()=>{let m=o.value,C=parseInt(n.value,10)||1;p.forEach((c,v)=>{c.modifiedName=sn(m,c,v+C)}),e.classList.add("hidden"),me()}}function sn(e,o,n){let r=new Date().toISOString().split("T")[0];return e.replace(/{{YNAB}}/g,o.originalYnabName?.trim()||o.name||"Account").replace(/{{Index}}/g,n).replace(/{{Upper}}/g,(o.originalYnabName?.trim()||o.name||"Account").toUpperCase()).replace(/{{Date}}/g,r)}function an(){let e=document.getElementById("bulkTypeModal"),o=document.getElementById("bulkTypeSelect"),n=document.getElementById("bulkSubtypeSelect"),r=document.getElementById("bulkTypeCancel"),i=document.getElementById("bulkTypeApply");e.classList.remove("hidden"),o.innerHTML="",Ae.data.forEach(l=>{let p=document.createElement("option");p.value=l.typeName,p.textContent=l.typeDisplay,o.appendChild(p)});function s(){let l=ke(o.value);if(n.innerHTML="",(l?.subtypes||[]).forEach(p=>{let k=document.createElement("option");k.value=p.name,k.textContent=p.display,n.appendChild(k)}),(l?.subtypes||[]).length===0){let p=document.createElement("option");p.value="",p.textContent="-",n.appendChild(p)}}o.addEventListener("change",s),s(),r.onclick=()=>e.classList.add("hidden"),i.onclick=()=>{let l=o.value,p=n.value;Object.values(Z.accounts).filter(m=>m.selected).forEach(m=>{m.type=l,m.subtype=p||null}),e.classList.add("hidden"),me()}}function sr(){console.log("Initializing filters modal...");try{ir(),ar(),Ee(),console.log("Filters modal initialized successfully")}catch(e){console.error("Error initializing filters modal:",e)}}function ir(){let e=document.getElementById("typeFiltersContainer");if(!e){console.error("typeFiltersContainer not found");return}let o=[...new Set(Ae.data.map(n=>n.typeDisplay))].sort();e.innerHTML="",o.forEach(n=>{let r=ln("type",n,n);e.appendChild(r)}),console.log(`Populated ${o.length} type filters`)}function ar(){let e=document.getElementById("subtypeFiltersContainer");if(!e){console.error("subtypeFiltersContainer not found");return}let o=new Set;Ae.data.forEach(r=>{r.subtypes.forEach(i=>{o.add(i.display)})});let n=[...o].sort();e.innerHTML="",n.forEach(r=>{let i=ln("subtype",r,r);e.appendChild(i)}),console.log(`Populated ${n.length} subtype filters`)}function ln(e,o,n){let r=document.createElement("div");r.className="flex items-center";let i=document.createElement("input");i.type="checkbox",i.id=`filter-${e}-${o.replace(/\s+/g,"-")}`,i.value=o,i.className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",i.addEventListener("change",Ee);let s=document.createElement("label");return s.htmlFor=i.id,s.className="ml-2 text-sm text-gray-700 cursor-pointer",s.textContent=n,r.appendChild(i),r.appendChild(s),r}function cn(){console.log("Opening filters modal...");try{let e=document.getElementById("filterAccountName");e&&(e.value=K.accountName);let o=document.querySelector(`input[name="nameMatchType"][value="${K.nameMatchType}"]`);o&&(o.checked=!0);let n=document.getElementById("nameCaseSensitive");n&&(n.checked=K.nameCaseSensitive),document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(m=>{m.checked=K.types.has(m.value)}),document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(m=>{m.checked=K.subtypes.has(m.value)});let r=document.getElementById("filterTransactionsMin");r&&(r.value=K.transactionsMin||"");let i=document.getElementById("filterTransactionsMax");i&&(i.value=K.transactionsMax||"");let s=document.getElementById("filterBalanceMin");s&&(s.value=K.balanceMin||"");let l=document.getElementById("filterBalanceMax");l&&(l.value=K.balanceMax||"");let p=document.querySelector(`input[name="inclusionFilter"][value="${K.inclusion}"]`);p&&(p.checked=!0);let k=document.getElementById("filtersModal");k?(console.log("Found modal, showing it..."),k.classList.remove("hidden"),setTimeout(()=>k.classList.add("show"),10)):console.error("Modal not found!")}catch(e){console.error("Error opening filters modal:",e)}}window.openFiltersModal=cn;function Ie(){let e=document.getElementById("filtersModal");e.classList.remove("show"),setTimeout(()=>e.classList.add("hidden"),300)}window.closeFiltersModal=Ie;function dn(){console.log("Apply filters button clicked!");try{let e=document.getElementById("filterAccountName");K.accountName=e?e.value.trim():"";let o=document.querySelector('input[name="nameMatchType"]:checked');K.nameMatchType=o?o.value:"contains";let n=document.getElementById("nameCaseSensitive");K.nameCaseSensitive=n?n.checked:!1,K.types.clear(),document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]:checked').forEach(k=>{K.types.add(k.value)}),K.subtypes.clear(),document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]:checked').forEach(k=>{K.subtypes.add(k.value)});let r=document.getElementById("filterTransactionsMin"),i=document.getElementById("filterTransactionsMax");K.transactionsMin=r&&r.value?parseInt(r.value):null,K.transactionsMax=i&&i.value?parseInt(i.value):null;let s=document.getElementById("filterBalanceMin"),l=document.getElementById("filterBalanceMax");K.balanceMin=s&&s.value?parseFloat(s.value):null,K.balanceMax=l&&l.value?parseFloat(l.value):null;let p=document.querySelector('input[name="inclusionFilter"]:checked');K.inclusion=p?p.value:"all",console.log("Applied filters:",K),Ie(),me(),Ee(),Ce()}catch(e){console.error("Error applying filters:",e)}}window.applyFilters=dn;function rt(){console.log("Reset filters button clicked!");try{let e=document.getElementById("filterAccountName");e&&(e.value="");let o=document.querySelector('input[name="nameMatchType"][value="contains"]');o&&(o.checked=!0);let n=document.getElementById("nameCaseSensitive");n&&(n.checked=!1),document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(k=>k.checked=!1),document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(k=>k.checked=!1);let r=document.getElementById("filterTransactionsMin");r&&(r.value="");let i=document.getElementById("filterTransactionsMax");i&&(i.value="");let s=document.getElementById("filterBalanceMin");s&&(s.value="");let l=document.getElementById("filterBalanceMax");l&&(l.value="");let p=document.querySelector('input[name="inclusionFilter"][value="all"]');p&&(p.checked=!0),K={accountName:"",nameMatchType:"contains",nameCaseSensitive:!1,types:new Set,subtypes:new Set,transactionsMin:null,transactionsMax:null,balanceMin:null,balanceMax:null,inclusion:"all"},me(),Ee(),Ce(),Ie(),console.log("Filters reset successfully")}catch(e){console.error("Error resetting filters:",e)}}window.resetFilters=rt;function or(){console.log("Clear all filters clicked!"),rt(),Ie()}window.clearAllFilters=or;function Ee(){let e=document.getElementById("filterCount"),o=document.getElementById("activeFiltersSection"),n=document.getElementById("activeFiltersContainer"),r=0,i=[];if(K.accountName&&(r++,i.push(De("Name",`${K.nameMatchType}: "${K.accountName}"`,()=>{K.accountName="",document.getElementById("filterAccountName").value="",me(),Ee()}))),K.types.size>0){r++;let s=[...K.types].join(", ");i.push(De("Types",s,()=>{K.types.clear(),document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(l=>l.checked=!1),me(),Ee()}))}if(K.subtypes.size>0){r++;let s=[...K.subtypes].join(", ");i.push(De("Subtypes",s,()=>{K.subtypes.clear(),document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(l=>l.checked=!1),me(),Ee()}))}if(K.transactionsMin!==null||K.transactionsMax!==null){r++;let s=K.transactionsMin||0,l=K.transactionsMax||"\u221E";i.push(De("Transactions",`${s} - ${l}`,()=>{K.transactionsMin=null,K.transactionsMax=null,document.getElementById("filterTransactionsMin").value="",document.getElementById("filterTransactionsMax").value="",me(),Ee()}))}if(K.balanceMin!==null||K.balanceMax!==null){r++;let s=K.balanceMin!==null?`$${K.balanceMin}`:"$0",l=K.balanceMax!==null?`$${K.balanceMax}`:"\u221E";i.push(De("Balance",`${s} - ${l}`,()=>{K.balanceMin=null,K.balanceMax=null,document.getElementById("filterBalanceMin").value="",document.getElementById("filterBalanceMax").value="",me(),Ee()}))}K.inclusion!=="all"&&(r++,i.push(De("Status",en(K.inclusion),()=>{K.inclusion="all",document.querySelector('input[name="inclusionFilter"][value="all"]').checked=!0,me(),Ee()}))),r>0?(e.textContent=r,e.classList.remove("hidden")):e.classList.add("hidden"),i.length>0?(o.classList.remove("hidden"),n.innerHTML="",i.forEach(s=>n.appendChild(s))):o.classList.add("hidden"),Bt(visibleCount,accounts.length)}function De(e,o,n){let r=document.createElement("div");r.className="filter-chip";let i=document.createElement("span");i.textContent=`${e}: ${o}`;let s=document.createElement("button");return s.onclick=n,s.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',r.appendChild(i),r.appendChild(s),r}function un(e){if(K.accountName){let r=K.nameCaseSensitive?e.modifiedName:e.modifiedName.toLowerCase(),i=K.nameCaseSensitive?K.accountName:K.accountName.toLowerCase();if(K.nameMatchType==="exact"){if(r!==i)return!1}else if(!r.includes(i))return!1}if(K.types.size>0){let r=ke(e.type),i=r?r.typeDisplay:e.type||"";if(!K.types.has(i))return!1}if(K.subtypes.size>0){let r=Fe(e.subtype),i=r?r.display:e.subtype||"";if(!K.subtypes.has(i))return!1}let o=e.transactionCount||0;if(K.transactionsMin!==null&&o<K.transactionsMin||K.transactionsMax!==null&&o>K.transactionsMax)return!1;let n=parseFloat(e.balance)||0;return!(K.balanceMin!==null&&n<K.balanceMin||K.balanceMax!==null&&n>K.balanceMax||K.inclusion==="included"&&!e.included||K.inclusion==="excluded"&&e.included)}function Bt(e,o){let n=document.getElementById("visibleAccountCount"),r=document.getElementById("totalAccountCount"),i=document.getElementById("filterResultsSummary"),s=document.getElementById("filterNotificationBadge"),l=document.getElementById("clearFiltersBtn");n&&(n.textContent=e),r&&(r.textContent=o);let p=lr(),k=cr();p&&k>0&&s?(s.textContent=k,s.classList.remove("hidden")):s&&s.classList.add("hidden"),p&&l?l.classList.remove("hidden"):l&&l.classList.add("hidden"),p&&i?i.classList.add("filtered"):i&&i.classList.remove("filtered")}function lr(){return K.accountName||K.types.size>0||K.subtypes.size>0||K.transactionsMin!==null||K.transactionsMax!==null||K.balanceMin!==null||K.balanceMax!==null||K.inclusion!=="all"}function cr(){let e=0;return K.accountName&&e++,K.types.size>0&&e++,K.subtypes.size>0&&e++,(K.transactionsMin!==null||K.transactionsMax!==null)&&e++,(K.balanceMin!==null||K.balanceMax!==null)&&e++,K.inclusion!=="all"&&e++,e}var pn=`<div class="container-responsive flex flex-1 justify-center py-3 sm:py-5 md:py-6">
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
`;function At(){if(!Z.accounts||Object.keys(Z.accounts).length===0){ce("/upload",!0);return}document.querySelector(".container-responsive").insertAdjacentHTML("beforeend",Re({backText:"Back"})),fe(),Qe();let o=document.getElementById("manualImportBtn"),n=document.getElementById("autoImportBtn"),r=document.getElementById("backBtn"),i=Object.keys(Z.accounts).length,s=Object.values(Z.accounts).filter(l=>l.included).length;document.getElementById("totalCountDisplay").textContent=i,document.getElementById("filesCountDisplay").textContent=s,document.getElementById("manualFileCount").textContent=s,o.addEventListener("click",()=>{ce("/manual")}),n.addEventListener("click",()=>{ce("/login")}),r.addEventListener("click",()=>{_e()})}var fn=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-6 sm:space-y-8 md:space-y-10 min-h-[calc(100vh-200px)]">

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

</div>`;var mn=ut(gt(),1);function it(e,o){let n='"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"',r=o.map(i=>`"${i.Date}","${i.Merchant}","${i.Category}","${e}","","${i.Notes}","${i.Amount}","${i.Tags}"`);return[n,...r].join(`
`)}function It(){if(!Z.accounts||Object.keys(Z.accounts).length===0){ce("/upload",!0);return}let e=document.getElementById("accountCount"),o=document.getElementById("downloadBtn"),n=document.getElementById("switchToAuto"),r=document.getElementById("backBtn");fe();let i=Object.values(Z.accounts).filter(s=>s.included);e.textContent=`${i.length} account${i.length!==1?"s":""}`,o.addEventListener("click",async s=>{s.preventDefault();let l=new mn.default,p=1e3;i.forEach(k=>{let m=k.name.replace(/[\\/:*?"<>|]/g,"_"),C=k.transactions,c=C.length;if(c<=p){let v=it(k.name,C);l.file(`${m}.csv`,v)}else{let v=Math.ceil(c/p);for(let d=0;d<v;d++){let y=d*p,u=y+p,w=C.slice(y,u),E=it(k.name,w);l.file(`${m}_part${d+1}.csv`,E)}}});try{let k=await l.generateAsync({type:"blob"}),m=document.createElement("a");m.href=URL.createObjectURL(k),m.download="accounts_export.zip",m.click()}catch(k){console.error("\u274C ZIP generation failed",k),alert("Failed to generate ZIP file.")}}),n.addEventListener("click",()=>{ce("/login")}),r.addEventListener("click",()=>{_e()}),document.getElementById("backToMethodBtn").addEventListener("click",()=>{_e()})}var hn=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-8 sm:space-y-10 md:space-y-12 min-h-[calc(100vh-200px)]">

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
`;var ge=[];for(let e=0;e<256;++e)ge.push((e+256).toString(16).slice(1));function gn(e,o=0){return(ge[e[o+0]]+ge[e[o+1]]+ge[e[o+2]]+ge[e[o+3]]+"-"+ge[e[o+4]]+ge[e[o+5]]+"-"+ge[e[o+6]]+ge[e[o+7]]+"-"+ge[e[o+8]]+ge[e[o+9]]+"-"+ge[e[o+10]]+ge[e[o+11]]+ge[e[o+12]]+ge[e[o+13]]+ge[e[o+14]]+ge[e[o+15]]).toLowerCase()}var Mt,fr=new Uint8Array(16);function Tt(){if(!Mt){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");Mt=crypto.getRandomValues.bind(crypto)}return Mt(fr)}var mr=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Lt={randomUUID:mr};function hr(e,o,n){if(Lt.randomUUID&&!o&&!e)return Lt.randomUUID();e=e||{};let r=e.random??e.rng?.()??Tt();if(r.length<16)throw new Error("Random bytes length must be >= 16");if(r[6]=r[6]&15|64,r[8]=r[8]&63|128,o){if(n=n||0,n<0||n+16>o.length)throw new RangeError(`UUID byte range ${n}:${n+15} is out of buffer bounds`);for(let i=0;i<16;++i)o[n+i]=r[i];return o}return gn(r)}var at=hr;var Ve=location.hostname==="localhost"?"http://localhost:3000/dev/":"/.netlify/functions/",Ue={login:Ve+"monarchLogin",fetchAccounts:Ve+"fetchMonarchAccounts",createAccounts:Ve+"createMonarchAccounts",generateStatements:Ve+"generateStatements",getUploadStatus:Ve+"getUploadStatus"};async function Ge(e,o){let n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),r=await n.json();if(!n.ok)throw new Error(r.error||r.message||"API error");return r}var Le={login:(e,o,n,r)=>Ge(Ue.login,{email:e,encryptedPassword:o,deviceUuid:n,otp:r}),fetchMonarchAccounts:e=>Ge(Ue.fetchAccounts,{token:e}),createAccounts:(e,o)=>Ge(Ue.createAccounts,{token:e,accounts:o}),generateAccounts:e=>fetch(Ue.generateStatements,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accounts:e})}),queryUploadStatus:(e,o)=>Ge(Ue.getUploadStatus,{token:e,sessionKey:o})};var we={EMAIL:"monarchEmail",ENCRYPTED_PASSWORD:"monarchPasswordBase64",TOKEN:"monarchApiToken",UUID:"monarchDeviceUuid",REMEMBER:"monarchRememberMe",TEMP_FOR_OTP:"monarchTempForOtp"};function Me(){return{email:$e(we.EMAIL),encryptedPassword:$e(we.ENCRYPTED_PASSWORD),token:$e(we.TOKEN),uuid:$e(we.UUID),remember:$e(we.REMEMBER)==="true",tempForOtp:$e(we.TEMP_FOR_OTP)==="true"}}function Ne({email:e,encryptedPassword:o,token:n,uuid:r,remember:i,tempForOtp:s}){e&&He(we.EMAIL,e),o&&He(we.ENCRYPTED_PASSWORD,o),n&&He(we.TOKEN,n),r&&He(we.UUID,r),typeof i=="boolean"&&He(we.REMEMBER,i?"true":"false"),typeof s=="boolean"&&He(we.TEMP_FOR_OTP,s?"true":"false")}function Ke(){Object.values(we).forEach(gr)}function $e(e){return localStorage.getItem(e)}function He(e,o){localStorage.setItem(e,o)}function gr(e){localStorage.removeItem(e)}var yn="monarch-app-salt";var Nt="AES-GCM";var bn="SHA-256";function xr(...e){let o=e.reduce((i,s)=>i+s.length,0),n=new Uint8Array(o),r=0;for(let i of e)n.set(i,r),r+=i.length;return n}async function vn(e,o){console.group("encryptPassword");try{let n=new TextEncoder,r=crypto.getRandomValues(new Uint8Array(12)),i=await crypto.subtle.importKey("raw",n.encode(e),{name:"PBKDF2"},!1,["deriveKey"]),s=await crypto.subtle.deriveKey({name:"PBKDF2",salt:n.encode(yn),iterations:1e5,hash:bn},i,{name:Nt,length:256},!0,["encrypt"]),l=n.encode(o),p=await crypto.subtle.encrypt({name:Nt,iv:r},s,l),k=new Uint8Array(p),m=k.slice(-16),C=k.slice(0,-16),c=xr(r,C,m);return btoa(String.fromCharCode(...c))}catch(n){throw console.error("\u274C Error encrypting password:",n),console.groupEnd("encryptPassword"),new Error("Failed to encrypt password. Please try again.")}}function We(e,o){if(!e||typeof e!="object")throw new Error("Target must be an object");Object.entries(o).forEach(([n,r])=>{e[n]=r})}function wn(e){if(!e||typeof e!="object")throw new Error("Target must be an object");Object.keys(e).forEach(o=>{let n=e[o];Array.isArray(n)?e[o]=[]:typeof n=="object"&&n!==null?e[o]={}:typeof n=="boolean"?e[o]=!1:e[o]=""})}async function zt(){document.querySelector(".container-responsive").insertAdjacentHTML("beforeend",Re({backText:"Back"}));let o=x=>document.getElementById(x),n={emailInput:o("email"),passwordInput:o("password"),connectBtn:o("connectBtn"),backBtn:o("backBtn"),form:o("credentialsForm"),errorBox:o("errorBox"),errorContainer:o("credentialsError"),rememberCheckbox:o("rememberCredentials"),rememberMeContainer:o("rememberMe"),notYouContainer:o("notYouContainer"),rememberedEmail:o("rememberedEmail"),clearCredentialsBtn:o("clearCredentialsBtn"),toggleBtn:o("togglePassword"),eyeShow:o("eyeShow"),eyeHide:o("eyeHide"),securityNoteMsg:o("securityNote"),securityNoteIcon:o("securityNoteIcon")};fe();let{credentials:r}=Z,{token:i,email:s,encryptedPassword:l,uuid:p,remember:k}=Me();We(r,{email:s,encryptedPassword:l,apiToken:r.apiToken||i,deviceUuid:r.deviceUuid||p,remember:k}),(!r.deviceUuid||r.deviceUuid==="")&&(r.deviceUuid=at(),Ne({uuid:r.deviceUuid})),s&&l?(n.emailInput.value=s,n.passwordInput.value="",n.rememberedEmail.textContent=`Signed in as ${s}`,n.rememberCheckbox.checked=r.remember,ve(n.emailInput,!0),ve(n.passwordInput,!0),xe(n.rememberMeContainer,!1),xe(n.notYouContainer,!0),xe(n.toggleBtn,!1),C("signed-in")):(xe(n.notYouContainer,!1),C());function m(){let x=n.emailInput.value.trim(),L=n.passwordInput.value.trim()||r.encryptedPassword;ve(n.connectBtn,!(x&&L)),xe(n.errorContainer,!1),fe()}function C(x){let L={GREEN:"#006400",BLUE:"#1993e5",ORANGE:"#ff8c00"};switch(x){case"remembered":n.securityNoteMsg.textContent="Your credentials will be stored securely on this device.",n.securityNoteIcon.setAttribute("fill",L.ORANGE);break;case"signed-in":n.securityNoteMsg.textContent='You are signed in. To use different credentials, click "Not you?".',n.securityNoteIcon.setAttribute("fill",L.BLUE);break;default:n.securityNoteMsg.textContent="Your credentials will not be stored.",n.securityNoteIcon.setAttribute("fill",L.GREEN)}}function c(x){x.preventDefault(),n.connectBtn.click()}async function v(){let x=Me(),L=n.emailInput.value.trim()||x.email,A=n.passwordInput.value.trim(),b=r.encryptedPassword||x.encryptedPassword,f=r.deviceUuid||x.uuid;if(!b&&A)try{b=await vn(L,A)}catch{S("Failed to encrypt password.");return}ve(n.connectBtn,!0),n.connectBtn.textContent="Connecting\u2026",xe(n.errorContainer,!1);try{let B=await Le.login(L,b,f);if(B?.otpRequired)return Ne({email:L,encryptedPassword:b,uuid:f,remember:r.remember,tempForOtp:!r.remember}),r.awaitingOtp=!0,ce("/otp");if(B?.token)return We(r,{email:L,encryptedPassword:b,otp:"",remember:n.rememberCheckbox.checked,apiToken:B.token,awaitingOtp:!1}),r.remember&&Ne({email:L,encryptedPassword:b,token:B.token,remember:!0}),ce("/complete");let R=B?.detail||B?.error||"Unexpected login response.";throw new Error(R)}catch(B){S(B.message)}finally{ve(n.connectBtn,!1),n.connectBtn.textContent="Connect to Monarch"}}async function d(x){x.preventDefault(),await v()}function y(x){x.preventDefault(),Ke(),wn(r),r.deviceUuid=at(),Ne({uuid:r.deviceUuid}),n.emailInput.value="",n.passwordInput.value="",n.rememberCheckbox.checked=!1,ve(n.emailInput,!1),ve(n.passwordInput,!1),ve(n.connectBtn,!0),xe(n.toggleBtn,!0),xe(n.notYouContainer,!1),xe(n.rememberMeContainer,!0),C(),fe(),n.emailInput.focus()}function u(){r.remember=n.rememberCheckbox.checked,C(r.remember?"remembered":"not-remembered"),(n.emailInput.value.trim()===""?n.emailInput:n.passwordInput.value.trim()===""?n.passwordInput:n.connectBtn).focus()}function w(){let x=n.passwordInput.type==="password";n.passwordInput.type=x?"text":"password",n.toggleBtn.setAttribute("aria-label",x?"Hide password":"Show password"),xe(n.eyeShow,!x),xe(n.eyeHide,x)}function E(){_e()}function S(x){n.errorBox.textContent=x,xe(n.errorContainer,!0)}n.form.addEventListener("submit",c),n.connectBtn.addEventListener("click",d),n.clearCredentialsBtn.addEventListener("click",y),n.rememberCheckbox.addEventListener("change",u),n.toggleBtn.addEventListener("click",w),n.backBtn.addEventListener("click",E),[n.emailInput,n.passwordInput].forEach(x=>{x.addEventListener("input",m),x.addEventListener("focus",()=>x.classList.add("ring-2","ring-blue-500","outline-none")),x.addEventListener("blur",()=>x.classList.remove("ring-2","ring-blue-500","outline-none"))}),m()}var kn=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-6 sm:space-y-8 min-h-[calc(100vh-200px)]">

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
`;function Ot(){document.querySelector(".container-responsive").insertAdjacentHTML("beforeend",Re({backText:"Back"}));let o=y=>document.getElementById(y),n={otpInput:o("otpInput"),submitOtpBtn:o("submitOtpBtn"),otpError:o("otpError"),backBtn:o("backBtn")};fe();let{credentials:r}=Z,i=Me(),{email:s,encryptedPassword:l,uuid:p,remember:k,tempForOtp:m}=i;if(We(r,{email:r.email||s,encryptedPassword:r.encryptedPassword||l,deviceUuid:r.deviceUuid||p,remember:k}),!r.email||!r.encryptedPassword)return console.warn("Missing credentials for OTP flow, redirecting to login"),ce("/credentials");async function C(y){console.group("MonarchOtpView"),y.preventDefault(),xe(n.otpError,!1),r.otp=n.otpInput.value;try{let u=await Le.login(r.email,r.encryptedPassword,r.deviceUuid,r.otp);if(u?.token)return We(r,{apiToken:u.token,awaitingOtp:!1}),r.remember?Ne({email:r.email,encryptedPassword:r.encryptedPassword,uuid:r.deviceUuid,token:u.token,remember:!0}):Ke(),console.groupEnd("MonarchOtpView"),ce("/complete");throw new Error("Unknown login response.")}catch(u){xe(n.otpError,!0),n.otpError.textContent="Invalid OTP. Please try again.",console.error("\u274C OTP verification error",u),console.groupEnd("MonarchOtpView")}}function c(){let y=Me();y.tempForOtp&&!y.remember&&Ke(),_e()}function v(){n.otpInput.value=n.otpInput.value.replace(/\D/g,"").slice(0,6),ve(n.submitOtpBtn,n.otpInput.value.length!==6),fe()}function d(y){y.key==="Enter"&&n.otpInput.value.length===6&&n.submitOtpBtn.click()}n.otpInput.addEventListener("input",v),n.otpInput.addEventListener("keydown",d),n.submitOtpBtn.addEventListener("click",C),n.backBtn.addEventListener("click",c),ve(n.submitOtpBtn,!0)}var _n=`<div class="container-responsive flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 space-y-8 sm:space-y-10 md:space-y-12 min-h-[calc(100vh-200px)]">

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
`;function kr(){if(console.log("MonarchComplete view initialized"),!Z.accounts||Object.keys(Z.accounts).length===0){ce("/upload",!0);return}let e=document.getElementById("resultsContainer"),o=document.getElementById("accountList"),n=document.getElementById("actionButtonsContainer"),r=document.getElementById("header"),i=document.getElementById("subheader"),s=document.getElementById("overallStatus"),l=document.getElementById("loadingContainer");l&&(l.style.display="none"),e&&(e.style.display="block",e.style.opacity="1"),p();function p(){console.log("Initializing processing with accounts:",Z.accounts),Object.keys(Z.accounts).forEach(u=>{Z.accounts[u].status||(Z.accounts[u].status="pending")}),c(),v(),d(),k()}async function k(){let w=Z.credentials.apiToken;if(console.log("Starting batch processing. Token available:",!!w),!w){console.error("No API token available"),Object.keys(Z.accounts).forEach(x=>{Z.accounts[x].included&&(Z.accounts[x].status="failed",Z.accounts[x].errorMessage="Authentication required. Please login again.")}),c(),v(),d();return}let E=Object.entries(Z.accounts).filter(([x,L])=>L.included&&L.status!=="completed").map(([x,L])=>({accountName:x,...L}));if(console.log("Total accounts to process:",E.length),E.length===0){console.log("No accounts to process"),c(),d();return}let S=[];for(let x=0;x<E.length;x+=5)S.push(E.slice(x,x+5));console.log(`Processing ${E.length} accounts in ${S.length} batches of ${5}`);for(let x=0;x<S.length;x++){let L=S[x];console.log(`Processing batch ${x+1}/${S.length} with ${L.length} accounts`),L.forEach(A=>{Z.accounts[A.accountName]&&(Z.accounts[A.accountName].status="processing")}),c(),v(),await m(w,L,x+1,S.length),x<S.length-1&&await new Promise(A=>setTimeout(A,1e3))}c(),v(),d()}async function m(u,w,E,S){try{console.log(`Calling API for batch ${E}/${S}...`);let x=await Le.createAccounts(u,w);if(console.log(`Batch ${E} create accounts response:`,x),x.success||x.failed)x.failed&&x.failed.length>0&&x.failed.forEach(L=>{let A=w.find(b=>b.name===L.name||b.modifiedName===L.name);A&&Z.accounts[A.accountName]&&(console.log(`Batch ${E}: Marking account as failed: ${A.accountName}, error: ${L.error}`),Z.accounts[A.accountName].status="failed",Z.accounts[A.accountName].errorMessage=L.error||"Account creation failed")}),x.success&&x.success.length>0&&(console.log(`Batch ${E}: Monitoring upload status for ${x.success.length} accounts...`),x.success.forEach(L=>{let A=w.find(b=>b.name===L.name||b.modifiedName===L.name);A&&Z.accounts[A.accountName]&&(Z.accounts[A.accountName].status="uploading",Z.accounts[A.accountName].sessionKeys=L.sessionKeys||[])}),c(),v(),await Promise.all(x.success.map(async L=>{let A=w.find(b=>b.name===L.name||b.modifiedName===L.name);if(A&&Z.accounts[A.accountName]&&L.sessionKeys)try{await C(u,A.accountName,L.sessionKeys),console.log(`Batch ${E}: Upload completed for account: ${A.accountName}`),Z.accounts[A.accountName].status="completed"}catch(b){console.error(`Batch ${E}: Upload failed for account: ${A.accountName}`,b),Z.accounts[A.accountName].status="failed",Z.accounts[A.accountName].errorMessage=b.message||"Transaction upload failed"}}))),w.forEach(L=>{Z.accounts[L.accountName]&&Z.accounts[L.accountName].status==="processing"&&(console.log(`Batch ${E}: Account not found in API response, marking as failed: ${L.accountName}`),Z.accounts[L.accountName].status="failed",Z.accounts[L.accountName].errorMessage="Account not processed by server")});else{let L=x.error||"Failed to create accounts in Monarch Money";console.log(`Batch ${E} failed, marking all as failed:`,L),w.forEach(A=>{Z.accounts[A.accountName]&&(Z.accounts[A.accountName].status="failed",Z.accounts[A.accountName].errorMessage=L)})}}catch(x){console.error(`Batch ${E} error:`,x),w.forEach(L=>{Z.accounts[L.accountName]&&(Z.accounts[L.accountName].status="failed",Z.accounts[L.accountName].errorMessage="Network error. Please check your connection and try again.")})}}async function C(u,w,E){console.log(`Monitoring upload status for account: ${w}, sessions: ${E.length}`),await Promise.all(E.map(async S=>{let x=0,L=60;for(;x<L;)try{let A=await Le.queryUploadStatus(u,S);if(console.log(`Upload status for ${w} session ${S}:`,A),A.data?.uploadStatementSession){let b=A.data.uploadStatementSession,f=b.status;if(f==="completed"){console.log(`Upload completed for ${w} session ${S}`);return}else if(f==="failed"||f==="error"){let B=b.errorMessage||"Transaction upload failed";throw console.error(`Upload failed for ${w} session ${S}:`,B),new Error(B)}}await new Promise(b=>setTimeout(b,5e3)),x++}catch(A){if(console.error(`Error checking upload status for ${w}:`,A),x++,x>=L)throw A;await new Promise(b=>setTimeout(b,5e3))}throw new Error(`Upload status check timed out for account ${w}`)}))}function c(){let u=Z.accounts||{},w=Object.values(u).filter(h=>h.included),E=w.length,S=w.filter(h=>h.status==="completed").length,x=w.filter(h=>h.status==="failed").length,L=w.filter(h=>h.status==="processing").length,A=w.filter(h=>h.status==="uploading").length,b=E-S-x-L-A,f="Processing...",B="Please wait while we process your accounts.",R="\u23F3";L>0?(f="Creating accounts...",B=`Creating ${L} account${L!==1?"s":""}. Please wait.`,R="\u23F3"):A>0?(f="Uploading transactions...",B=`Uploading transactions for ${A} account${A!==1?"s":""}. Please wait.`,R="\u{1F4E4}"):b===0&&(x===0?(f="All accounts migrated successfully!",B=`Successfully created ${S} account${S!==1?"s":""} in Monarch Money.`,R="\u2705"):S===0?(f="Migration failed for all accounts",B="None of your accounts could be migrated. Please try again.",R="\u274C"):(f="Migration completed with some failures",B=`${S} successful, ${x} failed. You can retry the failed accounts.`,R="\u26A0\uFE0F")),r&&(r.textContent=f),i&&(i.textContent=B),s&&(s.innerHTML=`<div class="text-6xl">${R}</div>`)}function v(){if(!o)return;let u=Z.accounts||{};o.innerHTML="",Object.entries(u).forEach(([w,E])=>{if(!E.included)return;let S=document.createElement("div");S.className="bg-white border border-gray-200 rounded-lg p-4";let x="",L="",A="";switch(E.status){case"completed":x="\u2705",L="text-green-600",A="Successfully migrated";break;case"failed":x="\u274C",L="text-red-600",A=E.errorMessage||"Migration failed";break;case"processing":x="\u23F3",L="text-blue-600",A="Creating account...";break;case"uploading":x="\u{1F4E4}",L="text-purple-600",A="Uploading transactions...";break;default:x="\u23F3",L="text-gray-600",A="Pending"}let b="Unknown Type";if(console.log(`Account ${w} type data:`,{type:E.type,subtype:E.subtype,accountObject:E}),E.type){let f=ke(E.type);if(console.log(`Type info for '${E.type}':`,f),f&&(b=f.typeDisplay||f.displayName||f.display,E.subtype)){let B=Fe(E.type,E.subtype);console.log(`Subtype info for '${E.type}' -> '${E.subtype}':`,B),B&&(b=B.display||B.displayName)}}else console.log(`Account ${w} has no type property`);S.innerHTML=`
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0 pr-4">
            <div class="font-medium text-gray-900 mb-1">${E.modifiedName||E.account_name||E.name||"Unknown Account"}</div>
            <div class="text-sm text-gray-500">${b}</div>
            ${E.monarchAccountId?`<div class="text-xs text-gray-400 mt-1">Monarch ID: ${E.monarchAccountId}</div>`:""}
          </div>
          <div class="flex-shrink-0">
            <span class="text-2xl">${x}</span>
          </div>
        </div>
        <div class="pt-2 border-t border-gray-100">
          <div class="${L} text-sm font-medium leading-relaxed">${A}</div>
        </div>
      `,o.appendChild(S)})}function d(){if(!n)return;let u=Z.accounts||{},w=Object.values(u).filter(x=>x.included&&x.status==="failed"),E=Object.values(u).filter(x=>x.included&&x.status==="completed");if(n.innerHTML="",w.length>0){let x=document.createElement("button");x.className="ui-button",x.dataset.type="primary",x.dataset.size="medium",x.textContent="Retry Failed Accounts",x.addEventListener("click",()=>y()),n.appendChild(x)}if(E.length>0){let x=document.createElement("button");x.className="ui-button",x.dataset.type="secondary",x.dataset.size="medium",x.textContent="View in Monarch Money",x.addEventListener("click",()=>window.open("https://app.monarchmoney.com","_blank")),n.appendChild(x)}let S=document.createElement("button");S.className="ui-button",S.dataset.type="secondary",S.dataset.size="medium",S.textContent="Start Over",S.addEventListener("click",()=>ce("/upload",!0)),n.appendChild(S),fe()}function y(){let u=Object.entries(Z.accounts).filter(([w,E])=>E.included&&E.status==="failed");u.length!==0&&(u.forEach(([w,E])=>{Z.accounts[w].status="pending",delete Z.accounts[w].errorMessage}),c(),v(),d(),k())}}var Cn=kr;var En=`<div class="container-responsive flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-24 space-y-8 sm:space-y-10 md:space-y-12 min-h-[calc(100vh-200px)]">

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

</div>`;async function Rt(){fe();let e=document.querySelector("[data-ynab-oauth-message]"),o=document.querySelector("[data-ynab-oauth-subtext]"),n=document.querySelector("[data-ynab-oauth-badge]"),r=document.querySelector("[data-ynab-oauth-callout]"),i=document.querySelector("[data-ynab-oauth-hero-icon]"),s=document.querySelector("[data-ynab-oauth-continue]"),l=document.querySelector("[data-ynab-oauth-code]"),p=document.querySelector("[data-ynab-oauth-copy]"),k=document.querySelector("[data-ynab-oauth-copy-status]"),m={request:document.querySelector('[data-ynab-oauth-step="request"]'),approval:document.querySelector('[data-ynab-oauth-step="approval"]'),storage:document.querySelector('[data-ynab-oauth-step="storage"]')},C=new URLSearchParams(window.location.search),c=C.get("code"),v=C.get("state"),d=C.get("error"),y=C.get("error_description"),u=Kt(),w=u&&v&&u!==v;Jt();let E=null,S={pending:{heroText:"Receiving the authorization code\u2026",subtext:"Hang tight while we confirm the details sent back from YNAB.",callout:"We are securely capturing the authorization code so you can continue without retyping credentials.",badgeText:"Pending",badgeType:"progress",icon:"pending"},success:{heroText:"Authorization captured",subtext:"Return to the app and keep migrating without entering credentials again.",callout:"The code was stored in sessionStorage and the SPA will pick it up automatically.",badgeText:"Complete",badgeType:"success",icon:"success"},cached:{heroText:"Authorization ready",subtext:"Looks like we already have a valid code from a previous attempt.",callout:"SessionStorage still contains your authorization code so you can continue where you left off.",badgeText:"Ready",badgeType:"success",icon:"success"}},x={neutral:["bg-gray-100","text-gray-600"],progress:["bg-blue-100","text-blue-700"],success:["bg-green-100","text-green-600"],error:["bg-red-50","text-red-600"]},L={pending:["bg-blue-50","text-blue-600"],success:["bg-green-50","text-green-600"],error:["bg-red-50","text-red-600"]},A={pending:'<svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-opacity="0.25"></circle><path stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M22 12a10 10 0 00-10-10"></path></svg>',success:'<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',error:'<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" /><circle cx="12" cy="12" r="9" /></svg>'};function b(Y,M){if(!n)return;n.textContent=M,n.className="rounded-full px-3 py-1 text-xs font-semibold";let T=x[Y]||x.neutral;n.classList.add(...T)}function f(Y){!i||(i.className="flex items-center justify-center w-12 h-12 rounded-2xl",i.classList.add(...L[Y]||L.pending),i.innerHTML=A[Y]||A.pending)}function B(Y){e&&(e.textContent=Y.heroText),o&&(o.textContent=Y.subtext),r&&(r.textContent=Y.callout),b(Y.badgeType,Y.badgeText),f(Y.icon)}let R=["border-blue-300","ring-2","ring-blue-100","border-green-200","bg-green-50","text-green-600","border-red-200","bg-red-50","text-red-600"];function h(Y,M){let T=m[Y];if(!T)return;let $=T.querySelector("[data-ynab-oauth-step-indicator]");switch(T.classList.remove(...R),$&&($.textContent=$.dataset.stepIndex||$.textContent),M){case"done":T.classList.add("border-green-200","bg-green-50","text-green-600"),$&&($.textContent="\u2714");break;case"active":T.classList.add("border-blue-300","ring-2","ring-blue-100");break;case"error":T.classList.add("border-red-200","bg-red-50","text-red-600"),$&&($.textContent="\u26A0");break;default:break}}function O(Y,M=""){let T=M||"";sessionStorage.setItem("ynab_oauth_code",Y),sessionStorage.setItem("ynab_oauth_state",T),Z.ynabOauth={code:Y,state:T,error:null}}function a(Y){l&&(l.value=Y||""),p&&(p.disabled=!Y,fe()),k&&k.classList.add("hidden")}function j(Y){!k||(k.textContent=Y,k.classList.remove("hidden"),E&&clearTimeout(E),E=window.setTimeout(()=>{k.classList.add("hidden")},2500))}function ne(Y,M=""){O(Y,M),B(S.success),h("approval","done"),h("storage","done"),a(Y)}function P(Y,M=""){O(Y,M),B(S.cached),h("approval","done"),h("storage","done"),a(Y)}function ee(Y,M){let T=Y||"code_missing",$=`Redirect error: ${T}`,G=M?`YNAB response: ${M}`:"We did not receive an authorization code. Please try again from YNAB.",W={heroText:$,subtext:"Close this tab, start the authorization again, or open YNAB to retry.",callout:G,badgeText:"Error",badgeType:"error",icon:"error"};e&&(e.textContent=W.heroText),o&&(o.textContent=W.subtext),r&&(r.textContent=W.callout),b(W.badgeType,W.badgeText),f(W.icon),a(""),Z.ynabOauth={code:null,state:null,error:M||T},h("approval","error"),h("storage","idle")}function D(Y){if(Y.preventDefault(),!l||!l.value)return;let M=navigator.clipboard;M?.writeText?M.writeText(l.value).then(()=>{j("Copied!")}).catch(()=>{l.select(),j("Select + copy manually")}):(l.select(),j("Select + copy manually"))}if(B(S.pending),h("request","done"),h("approval","active"),h("storage","active"),w){ee("state_mismatch","The authorization state returned from YNAB did not match the request. Please try again.");return}if(c)ne(c,v);else if(d)ee(d,y);else{let Y=sessionStorage.getItem("ynab_oauth_code"),M=sessionStorage.getItem("ynab_oauth_state");Y?P(Y,M):Z.ynabOauth={code:null,state:null,error:null}}s&&s.addEventListener("click",Y=>{Y.preventDefault(),ce("/upload",!0)}),p&&p.addEventListener("click",D)}var Sn=`<div class="container-responsive flex flex-col items-center justify-center space-y-6 py-8 sm:py-10 lg:py-14 min-h-[calc(100vh-220px)]">
  <section class="w-full max-w-4xl space-y-6">
    <header class="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-transparent rounded-3xl shadow-2xl p-6 sm:p-8">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-100 text-blue-600" data-ynab-oauth-icon>
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z" />
          </svg>
        </div>
        <div class="flex-1 space-y-2">
          <p class="text-xs sm:text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold">Authorization flow</p>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Finish connecting YNAB</h1>
          <p class="text-sm sm:text-base text-gray-600 leading-relaxed">We returned here immediately after you granted access inside YNAB. This page safely captures the authorization code so the app can continue.</p>
        </div>
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-white/70 text-blue-700 border border-blue-100">Secure</span>
      </div>
    </header>

    <article class="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600" data-ynab-oauth-hero-icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-3.866 0-7 1.79-7 4v1h14v-1c0-2.21-3.134-4-7-4z" />
            </svg>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold">Callback status</p>
            <p class="text-lg font-bold text-gray-900 leading-tight" data-ynab-oauth-message>Receiving the authorization code\u2026</p>
            <p class="text-sm text-gray-500 leading-relaxed" data-ynab-oauth-subtext aria-live="polite">Hang tight while we confirm the details sent back from YNAB.</p>
          </div>
        </div>
        <span class="rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600" data-ynab-oauth-badge>Pending</span>
      </div>

      <div class="rounded-2xl border border-dashed border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-800" data-ynab-oauth-callout>
        We are securely capturing the authorization code so you can continue the import without typing credentials again.
      </div>

      <div class="flex flex-wrap gap-3" aria-live="polite">
        <button class="ui-button btn-responsive" data-type="primary" data-size="large" data-ynab-oauth-continue>
          Return to the app
        </button>
        <a class="ui-button" data-type="text" data-size="medium" data-ynab-oauth-open href="https://app.youneedabudget.com" target="_blank" rel="noopener noreferrer">
          Open YNAB in a new tab
        </a>
      </div>

      <div class="space-y-2" aria-live="polite">
        <label for="ynabOauthCode" class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Authorization code</label>
        <div class="flex gap-3">
          <input id="ynabOauthCode" class="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700" type="text" value="" readonly placeholder="Awaiting code" data-ynab-oauth-code>
          <button class="ui-button" data-type="secondary" data-size="small" data-ynab-oauth-copy disabled>
            Copy code
          </button>
          <span class="text-xs font-semibold text-green-600 hidden" data-ynab-oauth-copy-status>Copied!</span>
        </div>
      </div>
    </article>

    <div class="grid gap-4 sm:grid-cols-3">
      <article class="border border-gray-200 rounded-3xl bg-white p-4 space-y-2" data-ynab-oauth-step="request">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600" data-ynab-oauth-step-indicator data-step-index="1">1</span>
          <h3 class="text-sm font-semibold text-gray-900">Request issued</h3>
        </div>
        <p class="text-xs text-gray-500 leading-relaxed">You clicked continue inside YNAB to begin the OAuth handshake.</p>
      </article>
      <article class="border border-gray-200 rounded-3xl bg-white p-4 space-y-2" data-ynab-oauth-step="approval">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600" data-ynab-oauth-step-indicator data-step-index="2">2</span>
          <h3 class="text-sm font-semibold text-gray-900">Authorization granted</h3>
        </div>
        <p class="text-xs text-gray-500 leading-relaxed">YNAB verified your identity and confirmed we can access your budget.</p>
      </article>
      <article class="border border-gray-200 rounded-3xl bg-white p-4 space-y-2" data-ynab-oauth-step="storage">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600" data-ynab-oauth-step-indicator data-step-index="3">3</span>
          <h3 class="text-sm font-semibold text-gray-900">Code captured</h3>
        </div>
        <p class="text-xs text-gray-500 leading-relaxed">We store the code in sessionStorage so the SPA can finalize the login flow.</p>
      </article>
    </div>
  </section>
</div>
`;var lt={"/":{template:$t,init:pt,scroll:!1,title:"Home - YNAB to Monarch",requiresAuth:!1},"/upload":{template:Xt,init:vt,scroll:!1,title:"Upload - YNAB to Monarch",requiresAuth:!1},"/review":{template:pn,init:_t,scroll:!0,title:"Review Accounts - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/method":{template:fn,init:At,scroll:!1,title:"Select Method - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/manual":{template:hn,init:It,scroll:!0,title:"Manual Import - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/login":{template:kn,init:zt,scroll:!1,title:"Login to Monarch - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/otp":{template:_n,init:Ot,scroll:!1,title:"Enter OTP - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/complete":{template:En,init:Cn,scroll:!1,title:"Migration Complete - YNAB to Monarch",requiresAuth:!1,requiresAccounts:!0},"/oauth/ynab/callback":{template:Sn,init:Rt,scroll:!1,title:"Authorize YNAB - YNAB to Monarch",requiresAuth:!1}},ot=!1,ct=!1;async function ce(e,o=!1,n=!1){if(!ot){ot=!0;try{e.startsWith("/")||(e="/"+e);let r=lt[e];if(!r)return console.error(`Route not found: ${e}`),e="/upload",ce(e,o);if(ct||(await Bn(),ct=!0),!n&&r.requiresAccounts&&!(Z.accounts&&Object.keys(Z.accounts).length>0))return console.warn(`Route ${e} requires accounts but none found. Redirecting to upload.`),ce("/upload",!0);o?history.replaceState({path:e},"",e):history.pushState({path:e},"",e),await Ft(e)}catch(r){if(console.error("Navigation error:",r),e!=="/upload")return ce("/upload",!0)}finally{ot=!1}}}async function Ft(e){let o=document.getElementById("app"),n=lt[e]||lt["/upload"];document.title=n.title,ct||(await Bn(),ct=!0),n.scroll?document.body.classList.add("always-scroll"):document.body.classList.remove("always-scroll"),o.innerHTML="",o.innerHTML=n.template;try{await n.init()}catch(r){console.error(`Error initializing route ${e}:`,r),e!=="/upload"&&ce("/upload",!0)}}function Ce(){try{Object.keys(Z.accounts).length>0&&sessionStorage.setItem("ynab_accounts",JSON.stringify(Z.accounts)),Z.monarchAccounts&&sessionStorage.setItem("monarch_accounts",JSON.stringify(Z.monarchAccounts));let e={lastPath:et(),timestamp:Date.now()};localStorage.setItem("app_state",JSON.stringify(e))}catch(e){console.error("Error persisting state:",e)}}async function Bn(){try{Z.accounts||(Z.accounts={});let e=Me();(e.email||e.token)&&(Z.credentials.email=e.email||Z.credentials.email,Z.credentials.encryptedPassword=e.encryptedPassword||Z.credentials.encryptedPassword,Z.credentials.apiToken=e.token||Z.credentials.apiToken,Z.credentials.deviceUuid=e.uuid||Z.credentials.deviceUuid,Z.credentials.remember=e.remember||Z.credentials.remember);let o=sessionStorage.getItem("ynab_accounts");if(o)try{let i=JSON.parse(o);i&&typeof i=="object"&&(Z.accounts=i)}catch(i){console.warn("Failed to parse accounts from sessionStorage:",i),sessionStorage.removeItem("ynab_accounts"),Z.accounts={}}let n=sessionStorage.getItem("monarch_accounts");if(n)try{let i=JSON.parse(n);i&&typeof i=="object"&&(Z.monarchAccounts=i)}catch(i){console.warn("Failed to parse monarch accounts from sessionStorage:",i),sessionStorage.removeItem("monarch_accounts"),Z.monarchAccounts=null}let r=localStorage.getItem("app_state");if(r)try{let i=JSON.parse(r);i.timestamp&&Date.now()-i.timestamp<24*60*60*1e3?console.log("Loaded recent app state from localStorage"):localStorage.removeItem("app_state")}catch(i){console.warn("Failed to parse app state from localStorage:",i),localStorage.removeItem("app_state")}}catch(e){console.error("Error loading persisted state:",e),Z.accounts={},Z.monarchAccounts=null}}function et(){return window.location.pathname}function _e(){let e=et(),n={"/review":"/upload","/method":"/review","/manual":"/method","/login":"/method","/otp":"/login","/complete":"/review"}[e]||"/upload";ce(n)}window.addEventListener("popstate",async e=>{if(!ot){let o=e.state?.path||window.location.pathname;try{await Ft(o)}catch(n){console.error("Error handling popstate:",n),ce("/upload",!0)}}});window.addEventListener("DOMContentLoaded",async()=>{let e=window.location.pathname,o=lt[e];try{o?await Ft(e):ce("/upload",!0)}catch(n){console.error("Error on initial load:",n),ce("/upload",!0)}});})();
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
