"use strict";(self.webpackChunkgoji_js_org=self.webpackChunkgoji_js_org||[]).push([[649],{1433:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var r=n(7896),a=(n(2784),n(876));const o={sidebar_position:1},s="\u6837\u5f0f",i={unversionedId:"advanced/css",id:"advanced/css",title:"\u6837\u5f0f",description:"CSS\u6a21\u5757",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/advanced/css.md",sourceDirName:"advanced",slug:"/advanced/css",permalink:"/zh/docs/advanced/css",editUrl:"https://github.com/airbnb/goji-js/tree/main/packages/goji.js.org/docs/advanced/css.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"\u8de8\u5e73\u53f0",permalink:"/zh/docs/guide/cross-platform"},next:{title:"CSS-in-JS",permalink:"/zh/docs/advanced/css-in-js"}},p={},l=[{value:"CSS\u6a21\u5757",id:"css\u6a21\u5757",level:2},{value:"PostCSS",id:"postcss",level:2}],c={toc:l};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"\u6837\u5f0f"},"\u6837\u5f0f"),(0,a.kt)("h2",{id:"css\u6a21\u5757"},"CSS\u6a21\u5757"),(0,a.kt)("p",null,"Goji \u652f\u6301\u5e76\u5efa\u8bae\u4f7f\u7528 ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/css-modules/css-modules"},"CSS Module "),"\uff0c\u539f\u56e0\u5982\u4e0b\uff1a"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"CSS\u7c7b\u4f5c\u7528\u57df"),(0,a.kt)("li",{parentName:"ul"},"\u4f7f\u7528 ",(0,a.kt)("a",{parentName:"li",href:"https://github.com/webpack-contrib/mini-css-extract-plugin"},"mini-css-extract-plugin")," \u51cf\u5c11\u4e3b\u5305\u4f53\u79ef"),(0,a.kt)("li",{parentName:"ul"},"\u591a\u79cdCSS \u9884/\u540e\u7eed\u5904\u7406\u5668\uff0c\u5982 ",(0,a.kt)("a",{parentName:"li",href:"https://github.com/postcss/postcss"},"PostCSS"),", ",(0,a.kt)("a",{parentName:"li",href:"http://stylus-lang.com/"}," Stylus")," \u7b49\u3002")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"// comp.tsx\nimport React from 'react';\nimport { View } from '@goji/core';\nimport styles from './comp.css';\n\nexport const Comp = () => {\n  return <View className={styles.container} />;\n};\n")),(0,a.kt)("p",null,"\u5728\u751f\u4ea7\u6a21\u5f0f\u4e0b\uff0c\u6240\u6709\u7c7b\u540d\u79f0\u90fd\u88ab\u54c8\u5e0c\u5230\u968f\u673a\u5b57\u7b26\u4e32\u4e2d\uff0c\u9ed8\u8ba4\u957f\u5ea6\u662f ",(0,a.kt)("inlineCode",{parentName:"p"},"5"),"\u3002"),(0,a.kt)("p",null,"\u5728\u5f00\u53d1\u6a21\u5f0f\u4e0b\uff0c\u4e3a\u4e86\u66f4\u597d\u5730\u8c03\u8bd5\u4f53\u9a8c\uff0c\u7c7b\u540d\u5c06\u5305\u542b ",(0,a.kt)("inlineCode",{parentName:"p"},"path"),"\uff0c ",(0,a.kt)("inlineCode",{parentName:"p"},"name")," \u548c ",(0,a.kt)("inlineCode",{parentName:"p"},"local"),"\uff0c \u5728\u5f00\u53d1\u6a21\u5f0f\u4e0b\uff0c\u4e3a\u4e86\u66f4\u597d\u5730\u8c03\u8bd5\u4f53\u9a8c\uff0c\u7c7b\u540d\u5c06\u5305\u542b ",(0,a.kt)("inlineCode",{parentName:"p"},"path"),"\uff0c ",(0,a.kt)("inlineCode",{parentName:"p"},"name")," \u548c ",(0,a.kt)("inlineCode",{parentName:"p"},"local"),"\uff0c \u8be6\u60c5\u8bf7\u67e5\u770b ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/webpack-contrib/css-loader#localidentname"},"css-loader\u7684 localIdentname"),"\u3002"),(0,a.kt)("h2",{id:"postcss"},"PostCSS"),(0,a.kt)("p",null,"GojijS \u9009\u62e9\u5e38\u89c1\u7684 PostCSS \u4f5c\u4e3a CSS \u5904\u7406\u5668\uff0c\u5e76\u5f00\u542f\u4e86\u4ee5\u4e0b\u63d2\u4ef6\u3002"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/csstools/postcss-preset-env"},"postcss-preset-env"))),(0,a.kt)("p",null,"\u652f\u6301 ",(0,a.kt)("inlineCode",{parentName:"p"},"iOS >= 8")," \u548c ",(0,a.kt)("inlineCode",{parentName:"p"},"Android >= 4"),"\u3002"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/yingye/postcss-px2units"},"postcss-px2units"))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-css"},"/* input */\np {\n  margin: 0 0 20px;\n  font-size: 32px;\n  line-height: 1.2;\n  letter-spacing: 1px; /* no */\n}\n\n/* output */\np {\n  margin: 0 0 20rpx;\n  font-size: 32rpx;\n  line-height: 1.2;\n  letter-spacing: 1px;\n}\n")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/postcss/postcss-nested"},"postcss-nested"))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-css"},"/* input */\n.phone {\n  &_title {\n    width: 500px;\n  }\n  img {\n    display: block;\n  }\n}\n\n/* output */\n.phone_title {\n  width: 500px;\n}\n.phone img {\n  display: block;\n}\n")))}u.isMDXComponent=!0},876:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var r=n(2784);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=l(n),d=a,f=m["".concat(p,".").concat(d)]||m[d]||u[d]||o;return n?r.createElement(f,s(s({ref:t},c),{},{components:n})):r.createElement(f,s({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var l=2;l<o;l++)s[l]=n[l];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);