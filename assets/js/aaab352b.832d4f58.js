"use strict";(self.webpackChunkgoji_js_org=self.webpackChunkgoji_js_org||[]).push([[903],{9284:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>p,contentTitle:()=>r,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var n=t(7896),o=(t(2784),t(876));const i={sidebar_position:5},r="Sub Packages",s={unversionedId:"advanced/sub-packages",id:"advanced/sub-packages",title:"Sub Packages",description:"Sub Packages is a common concept in most Mini Program platforms to improve load performance and code",source:"@site/docs/advanced/sub-packages.md",sourceDirName:"advanced",slug:"/advanced/sub-packages",permalink:"/docs/advanced/sub-packages",editUrl:"https://github.com/airbnb/goji-js/tree/main/packages/goji.js.org/docs/advanced/sub-packages.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Testing Library",permalink:"/docs/advanced/testing"},next:{title:"FAQ",permalink:"/docs/faq/"}},p={},l=[{value:"Problems",id:"problems",level:2},{value:"Hoist and nohoist",id:"hoist-and-nohoist",level:2},{value:"<code>nohoist.enable</code>",id:"nohoistenable",level:3},{value:"<code>nohoist.maxPackages</code>",id:"nohoistmaxpackages",level:3},{value:"<code>nohoist.test</code>",id:"nohoisttest",level:3},{value:"Independent packages",id:"independent-packages",level:2}],c={toc:l};function d(e){let{components:a,...t}=e;return(0,o.kt)("wrapper",(0,n.Z)({},c,t,{components:a,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"sub-packages"},"Sub Packages"),(0,o.kt)("p",null,"Sub Packages is a common concept in most Mini Program platforms to improve load performance and code\nstructure. It can be regarded as chunk split in Web development."),(0,o.kt)("p",null,"Here are some useful links to their official documents."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html"},"WeChat sub packages"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"https://q.qq.com/wiki/develop/miniprogram/frame/basic_ability/basic_pack.html"},"QQ sub packages"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"https://opendocs.alipay.com/mini/framework/subpackages"},"Alipay sub packages"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"https://smartprogram.baidu.com/docs/develop/framework/subpackages/"},"Baidu sub packages"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/subpackages/introduction"},"Toutiao sub packages")))),(0,o.kt)("h2",{id:"problems"},"Problems"),(0,o.kt)("p",null,"The original design of sub packages based code splitting result in several limitations. A sub\npackage cannot ",(0,o.kt)("inlineCode",{parentName:"p"},"require")," any module in the main package nor other sub packages."),(0,o.kt)("p",null,"Developers have to place shared code in main package manually, otherwise they will get a compile\nerror from the Mini Program dev tool. In another hand, if a module was only required by a sub\npackage, developers should move it into the sub package to reduce size of main package."),(0,o.kt)("h2",{id:"hoist-and-nohoist"},"Hoist and nohoist"),(0,o.kt)("p",null,"In GojiJS, we use ",(0,o.kt)("a",{parentName:"p",href:"https://webpack.js.org/"},"Webpack")," to analyze module dependencies and bundle the\ncode. With ",(0,o.kt)("a",{parentName:"p",href:"https://webpack.js.org/guides/code-splitting/"},"code splitting ")," we are able to import\ndependents in a sub package from anywhere we want, like the main package, node_modules or even other\nsub packages. GojiJS can ",(0,o.kt)("strong",{parentName:"p"},"hoist")," the shared code into a common chunk file ( usually\n",(0,o.kt)("inlineCode",{parentName:"p"},"_goji_commons.js")," ) in the main package."),(0,o.kt)("p",null,"Here is an example that has 5 pages, one is in the main package and others are in 2 sub packages (\n",(0,o.kt)("inlineCode",{parentName:"p"},"packageA")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"packageB")," )."),(0,o.kt)("p",null,(0,o.kt)("img",{parentName:"p",src:"https://user-images.githubusercontent.com/1812118/138204963-4829b600-ac1a-4273-89ab-cf36d5cd03da.png",alt:"sub packages example"})),(0,o.kt)("p",null,"GojiJS hoist modules to root common chunk. By doing this the dependencies can match Mini Program sub\npackages' limitations."),(0,o.kt)("p",null,(0,o.kt)("img",{parentName:"p",src:"https://user-images.githubusercontent.com/1812118/138205488-dddaf015-f752-4720-90ec-b216d6f7dc27.png",alt:"hoist example"})),(0,o.kt)("h3",{id:"nohoistenable"},(0,o.kt)("inlineCode",{parentName:"h3"},"nohoist.enable")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"boolean = true")," if in production mode, otherwise ",(0,o.kt)("inlineCode",{parentName:"p"},"false"),"."),(0,o.kt)("p",null,"In above example, ",(0,o.kt)("inlineCode",{parentName:"p"},"redux")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"date-fns")," are not shared code so they can be moved into sub packages\nto reduce size of main package. We call that optimization ",(0,o.kt)("strong",{parentName:"p"},"nohoist"),"."),(0,o.kt)("p",null,"You can change ",(0,o.kt)("inlineCode",{parentName:"p"},"nohoist.enable")," option in ",(0,o.kt)("inlineCode",{parentName:"p"},"goji.config.js")," to toggle this feature."),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},(0,o.kt)("inlineCode",{parentName:"p"},"nohoist.enable")," is set to false in development mode to speed up code bundling.")),(0,o.kt)("p",null,(0,o.kt)("img",{parentName:"p",src:"https://user-images.githubusercontent.com/1812118/138205001-0ea82de4-81b1-494c-9e30-f48d462611be.png",alt:"nohoist.enable example"})),(0,o.kt)("h3",{id:"nohoistmaxpackages"},(0,o.kt)("inlineCode",{parentName:"h3"},"nohoist.maxPackages")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"number = 1")),(0,o.kt)("p",null,"Some modules, like ",(0,o.kt)("inlineCode",{parentName:"p"},"lodash")," in the example, are shared only by sub packages. It is possible to\nforked them into sub packages. Although the size of total packages increases, it does reduce the\nsize of main package."),(0,o.kt)("p",null,"To enable this feature, you can set ",(0,o.kt)("inlineCode",{parentName:"p"},"nohoist.maxPackages")," to a number N above 1. A module shared\nless than or equal N will be forked into ",(0,o.kt)("inlineCode",{parentName:"p"},"packageName/_goji_nohoist_[contenthash].js"),"."),(0,o.kt)("p",null,(0,o.kt)("img",{parentName:"p",src:"https://user-images.githubusercontent.com/1812118/138208851-2c0c7fe3-6e55-4744-b4af-b74fca59228a.png",alt:"nohoist.maxPackages example"})),(0,o.kt)("p",null,"Although the code are duplicated, the runtime closure is still a singleton. For more details see\n",(0,o.kt)("a",{parentName:"p",href:"#independent-packages"},"Independent packages"),"."),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"Please note this feature may heart user lading time because more duplicated code are generated.\nYou should only use it if size of main package was exceeded or about to exceed.")),(0,o.kt)("h3",{id:"nohoisttest"},(0,o.kt)("inlineCode",{parentName:"h3"},"nohoist.test")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"function (module, chunks) => boolean")," ",(0,o.kt)("inlineCode",{parentName:"p"},"RegRex")," ",(0,o.kt)("inlineCode",{parentName:"p"},"string")),(0,o.kt)("p",null,"You can use this options to nohoist specific modules."),(0,o.kt)("h2",{id:"independent-packages"},"Independent packages"),(0,o.kt)("p",null,"An independent package is a special case of sub packages. Only\n",(0,o.kt)("a",{parentName:"p",href:"https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html"},"WeChat"),",\n",(0,o.kt)("a",{parentName:"p",href:"https://q.qq.com/wiki/develop/miniprogram/frame/basic_ability/basic_pack.html#%E7%8B%AC%E7%AB%8B%E5%88%86%E5%8C%85"},"QQ"),"\nand ",(0,o.kt)("a",{parentName:"p",href:"https://smartprogram.baidu.com/docs/develop/framework/subpackages_independent/"},"Baidu")," Mini\nProgram support this feature."),(0,o.kt)("p",null,"GojiJS support this feature in the similar way as nohoist."),(0,o.kt)("p",null,"First, GojiJS forks all deepened modules into ",(0,o.kt)("inlineCode",{parentName:"p"},"packageName/_goji_commons.js"),", Then GojiJS generates\na new ",(0,o.kt)("inlineCode",{parentName:"p"},"packageName/_goji_runtime.js")," to run load these code in the independent package and make sure\neach module should has a consistent runtime closure."),(0,o.kt)("p",null,"To create an independent package you should add ",(0,o.kt)("inlineCode",{parentName:"p"},"independent: true")," to ",(0,o.kt)("inlineCode",{parentName:"p"},"subPackages")," in\n",(0,o.kt)("inlineCode",{parentName:"p"},"app.config.ts"),"."))}d.isMDXComponent=!0},876:(e,a,t)=>{t.d(a,{Zo:()=>c,kt:()=>u});var n=t(2784);function o(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function i(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function r(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?i(Object(t),!0).forEach((function(a){o(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function s(e,a){if(null==e)return{};var t,n,o=function(e,a){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],a.indexOf(t)>=0||(o[t]=e[t]);return o}(e,a);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=n.createContext({}),l=function(e){var a=n.useContext(p),t=a;return e&&(t="function"==typeof e?e(a):r(r({},a),e)),t},c=function(e){var a=l(e.components);return n.createElement(p.Provider,{value:a},e.children)},d={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},m=n.forwardRef((function(e,a){var t=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=l(t),u=o,k=m["".concat(p,".").concat(u)]||m[u]||d[u]||i;return t?n.createElement(k,r(r({ref:a},c),{},{components:t})):n.createElement(k,r({ref:a},c))}));function u(e,a){var t=arguments,o=a&&a.mdxType;if("string"==typeof e||o){var i=t.length,r=new Array(i);r[0]=m;var s={};for(var p in a)hasOwnProperty.call(a,p)&&(s[p]=a[p]);s.originalType=e,s.mdxType="string"==typeof e?e:o,r[1]=s;for(var l=2;l<i;l++)r[l]=t[l];return n.createElement.apply(null,r)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"}}]);