"use strict";(self.webpackChunkgoji_js_org=self.webpackChunkgoji_js_org||[]).push([[786],{4630:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>p,toc:()=>c});var r=n(7896),a=(n(2784),n(876));const o={sidebar_position:1},i="App",p={unversionedId:"guide/app",id:"guide/app",title:"App",description:"App config",source:"@site/docs/guide/app.md",sourceDirName:"guide",slug:"/guide/app",permalink:"/docs/guide/app",editUrl:"https://github.com/airbnb/goji-js/tree/main/packages/goji.js.org/docs/guide/app.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Preparation",permalink:"/docs/get-started/preparation"},next:{title:"Page",permalink:"/docs/guide/page"}},l={},c=[{value:"App config",id:"app-config",level:2},{value:"App script",id:"app-script",level:2}],s={toc:c};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"app"},"App"),(0,a.kt)("h2",{id:"app-config"},"App config"),(0,a.kt)("p",null,"Each Mini Program has an ",(0,a.kt)("inlineCode",{parentName:"p"},"app.json")," as the main entry."),(0,a.kt)("p",null,"Here is a demo of ",(0,a.kt)("inlineCode",{parentName:"p"},"app.json"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "pages": ["pages/index/index", "pages/benchmark/index"],\n  "window": {\n    "backgroundTextStyle": "dark",\n    "navigationBarBackgroundColor": "#001935",\n    "navigationBarTitleText": "Goji",\n    "navigationBarTextStyle": "white"\n  }\n}\n')),(0,a.kt)("p",null,"For more fields, see\n",(0,a.kt)("a",{parentName:"p",href:"https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html"},"here")," ."),(0,a.kt)("p",null,"In addition, Goji provides a JavaScript-based config file called ",(0,a.kt)("inlineCode",{parentName:"p"},"app.config.js"),". You can use it for\nbetter ",(0,a.kt)("a",{parentName:"p",href:"/docs/guide/cross-platform"},"cross-platform")," support."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"module.exports = ({ target }) => ({\n  pages: ['pages/index/index', 'pages/benchmark/index'],\n  window: {\n    backgroundTextStyle: 'dark',\n    navigationBarBackgroundColor: '#001935',\n    navigationBarTitleText: `Goji on ${target}`,\n    navigationBarTextStyle: 'white',\n  },\n});\n")),(0,a.kt)("h2",{id:"app-script"},"App script"),(0,a.kt)("p",null,"Same as original\n",(0,a.kt)("a",{parentName:"p",href:"https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html"},"app.js"),". You can\nadd global polyfills in this file."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import 'core-js';\n\nApp({});\n")))}u.isMDXComponent=!0},876:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>g});var r=n(2784);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),d=c(n),g=a,m=d["".concat(l,".").concat(g)]||d[g]||u[g]||o;return n?r.createElement(m,i(i({ref:t},s),{},{components:n})):r.createElement(m,i({ref:t},s))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p.mdxType="string"==typeof e?e:a,i[1]=p;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);