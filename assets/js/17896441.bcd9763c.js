"use strict";(self.webpackChunkgoji_js_org=self.webpackChunkgoji_js_org||[]).push([[918],{5019:(e,t,a)=>{a.r(t),a.d(t,{default:()=>$});var n=a(2784),l=a(6277),s=a(7896),r=a(8004),i=a(7415);function c(e){const{previous:t,next:a}=e;return n.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,r.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages navigation",description:"The ARIA label for the docs pagination"})},n.createElement("div",{className:"pagination-nav__item"},t&&n.createElement(i.Z,(0,s.Z)({},t,{subLabel:n.createElement(r.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")}))),n.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},a&&n.createElement(i.Z,(0,s.Z)({},a,{subLabel:n.createElement(r.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next")}))))}var o=a(5837),m=a(2896),d=a(3384),u=a(2186);const v={unreleased:function(e){let{siteTitle:t,versionMetadata:a}=e;return n.createElement(r.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){let{siteTitle:t,versionMetadata:a}=e;return n.createElement(r.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function b(e){const t=v[e.versionMetadata.banner];return n.createElement(t,e)}function p(e){let{versionLabel:t,to:a,onClick:l}=e;return n.createElement(r.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:n.createElement("b",null,n.createElement(m.Z,{to:a,onClick:l},n.createElement(r.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function E(e){let{className:t,versionMetadata:a}=e;const{siteConfig:{title:s}}=(0,o.Z)(),{pluginId:r}=(0,d.gA)({failfast:!0}),{savePreferredVersionName:i}=(0,u.J)(r),{latestDocSuggestion:c,latestVersionSuggestion:m}=(0,d.Jo)(r),v=c??(E=m).docs.find((e=>e.id===E.mainDocId));var E;return n.createElement("div",{className:(0,l.Z)(t,u.kM.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},n.createElement("div",null,n.createElement(b,{siteTitle:s,versionMetadata:a})),n.createElement("div",{className:"margin-top--md"},n.createElement(p,{versionLabel:m.label,to:v.path,onClick:()=>i(m.name)})))}function g(e){let{className:t}=e;const a=(0,u.E6)();return a.banner?n.createElement(E,{className:t,versionMetadata:a}):null}function h(e){let{className:t}=e;const a=(0,u.E6)();return a.badge?n.createElement("span",{className:(0,l.Z)(t,u.kM.docs.docVersionBadge,"badge badge--secondary")},n.createElement(r.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:a.label}},"Version: {versionLabel}")):null}function f(e){let{lastUpdatedAt:t,formattedLastUpdatedAt:a}=e;return n.createElement(r.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:n.createElement("b",null,n.createElement("time",{dateTime:new Date(1e3*t).toISOString()},a))}}," on {date}")}function N(e){let{lastUpdatedBy:t}=e;return n.createElement(r.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:n.createElement("b",null,t)}}," by {user}")}function _(e){let{lastUpdatedAt:t,formattedLastUpdatedAt:a,lastUpdatedBy:l}=e;return n.createElement("span",{className:u.kM.common.lastUpdated},n.createElement(r.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&a?n.createElement(f,{lastUpdatedAt:t,formattedLastUpdatedAt:a}):"",byUser:l?n.createElement(N,{lastUpdatedBy:l}):""}},"Last updated{atDate}{byUser}"),!1)}var Z=a(4407),k=a(4155);const L="lastUpdated_twTl";function C(e){return n.createElement("div",{className:(0,l.Z)(u.kM.docs.docFooterTagsRow,"row margin-bottom--sm")},n.createElement("div",{className:"col"},n.createElement(k.Z,e)))}function T(e){let{editUrl:t,lastUpdatedAt:a,lastUpdatedBy:s,formattedLastUpdatedAt:r}=e;return n.createElement("div",{className:(0,l.Z)(u.kM.docs.docFooterEditMetaRow,"row")},n.createElement("div",{className:"col"},t&&n.createElement(Z.Z,{editUrl:t})),n.createElement("div",{className:(0,l.Z)("col",L)},(a||s)&&n.createElement(_,{lastUpdatedAt:a,formattedLastUpdatedAt:r,lastUpdatedBy:s})))}function U(e){const{content:t}=e,{metadata:a}=t,{editUrl:s,lastUpdatedAt:r,formattedLastUpdatedAt:i,lastUpdatedBy:c,tags:o}=a,m=o.length>0,d=!!(s||r||c);return m||d?n.createElement("footer",{className:(0,l.Z)(u.kM.docs.docFooter,"docusaurus-mt-lg")},m&&n.createElement(C,{tags:o}),d&&n.createElement(T,{editUrl:s,lastUpdatedAt:r,lastUpdatedBy:c,formattedLastUpdatedAt:i})):null}var y=a(8188);const w="tocCollapsible_XbgT",M="tocCollapsibleButton_ZKEy",A="tocCollapsibleContent_daJv",x="tocCollapsibleExpanded_HjLN";var H=a(9519);function B(e){let{toc:t,className:a,minHeadingLevel:s,maxHeadingLevel:i}=e;const{collapsed:c,toggleCollapsed:o}=(0,u.uR)({initialState:!0});return n.createElement("div",{className:(0,l.Z)(w,!c&&x,a)},n.createElement("button",{type:"button",className:(0,l.Z)("clean-btn",M),onClick:o},n.createElement(r.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component"},"On this page")),n.createElement(u.zF,{lazy:!0,className:A,collapsed:c},n.createElement(H.Z,{toc:t,minHeadingLevel:s,maxHeadingLevel:i})))}var S=a(4004);const I="docItemContainer_JwXb",P="docItemCol_lvEh",V="tocMobile_Pc5S",D={breadcrumbsContainer:"breadcrumbsContainer_Esks"};var F=a(4198);function O(e){let{children:t,href:a}=e;const l="breadcrumbs__link";return a?n.createElement(m.Z,{className:l,href:a,itemProp:"item"},n.createElement("span",{itemProp:"name"},t)):n.createElement("span",{className:l,itemProp:"item name"},t)}function j(e){let{children:t,active:a,index:s}=e;return n.createElement("li",{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem",className:(0,l.Z)("breadcrumbs__item",{"breadcrumbs__item--active":a})},t,n.createElement("meta",{itemProp:"position",content:String(s+1)}))}function R(){const e=(0,F.Z)("/");return n.createElement("li",{className:"breadcrumbs__item"},n.createElement(m.Z,{className:(0,l.Z)("breadcrumbs__link",D.breadcrumbsItemLink),href:e},"\ud83c\udfe0"))}function z(){const e=(0,u.s1)(),t=(0,u.Ns)();return e?n.createElement("nav",{className:(0,l.Z)(u.kM.docs.docBreadcrumbs,D.breadcrumbsContainer),"aria-label":"breadcrumbs"},n.createElement("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList"},t&&n.createElement(R,null),e.map(((t,a)=>n.createElement(j,{key:a,active:a===e.length-1,index:a},n.createElement(O,{href:a<e.length-1?t.href:void 0},t.label)))))):null}var J=a(5938);function q(e){const{content:t}=e,{metadata:a,frontMatter:l,assets:s}=t,{keywords:r}=l,{description:i,title:c}=a,o=s.image??l.image;return n.createElement(u.d,{title:c,description:i,keywords:r,image:o})}function X(e){const{content:t}=e,{metadata:a,frontMatter:s}=t,{hide_title:r,hide_table_of_contents:i,toc_min_heading_level:o,toc_max_heading_level:m}=s,{title:d}=a,v=!r&&void 0===t.contentTitle,b=(0,u.iP)(),p=!i&&t.toc&&t.toc.length>0,E=p&&("desktop"===b||"ssr"===b);return n.createElement("div",{className:"row"},n.createElement("div",{className:(0,l.Z)("col",!i&&P)},n.createElement(g,null),n.createElement("div",{className:I},n.createElement("article",null,n.createElement(z,null),n.createElement(h,null),p&&n.createElement(B,{toc:t.toc,minHeadingLevel:o,maxHeadingLevel:m,className:(0,l.Z)(u.kM.docs.docTocMobile,V)}),n.createElement("div",{className:(0,l.Z)(u.kM.docs.docMarkdown,"markdown")},v&&n.createElement("header",null,n.createElement(S.Z,{as:"h1"},d)),n.createElement(J.Z,null,n.createElement(t,null))),n.createElement(U,e)),n.createElement(c,{previous:a.previous,next:a.next}))),E&&n.createElement("div",{className:"col col--3"},n.createElement(y.Z,{toc:t.toc,minHeadingLevel:o,maxHeadingLevel:m,className:u.kM.docs.docTocDesktop})))}function $(e){const t=`docs-doc-id-${e.content.metadata.unversionedId}`;return n.createElement(u.FG,{className:t},n.createElement(q,e),n.createElement(X,e))}},4407:(e,t,a)=>{a.d(t,{Z:()=>m});var n=a(2784),l=a(8004),s=a(7896),r=a(6277);const i="iconEdit_xj76";function c(e){let{className:t,...a}=e;return n.createElement("svg",(0,s.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,r.Z)(i,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}var o=a(2186);function m(e){let{editUrl:t}=e;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:o.kM.common.editThisPage},n.createElement(c,null),n.createElement(l.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}},7415:(e,t,a)=>{a.d(t,{Z:()=>s});var n=a(2784),l=a(2896);function s(e){const{permalink:t,title:a,subLabel:s}=e;return n.createElement(l.Z,{className:"pagination-nav__link",to:t},s&&n.createElement("div",{className:"pagination-nav__sublabel"},s),n.createElement("div",{className:"pagination-nav__label"},a))}},8188:(e,t,a)=>{a.d(t,{Z:()=>c});var n=a(7896),l=a(2784),s=a(6277),r=a(9519);const i="tableOfContents_EtLs";function c(e){let{className:t,...a}=e;return l.createElement("div",{className:(0,s.Z)(i,"thin-scrollbar",t)},l.createElement(r.Z,(0,n.Z)({},a,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}},9519:(e,t,a)=>{a.d(t,{Z:()=>i});var n=a(7896),l=a(2784),s=a(2186);function r(e){let{toc:t,className:a,linkClassName:n,isChild:s}=e;return t.length?l.createElement("ul",{className:s?void 0:a},t.map((e=>l.createElement("li",{key:e.id},l.createElement("a",{href:`#${e.id}`,className:n??void 0,dangerouslySetInnerHTML:{__html:e.value}}),l.createElement(r,{isChild:!0,toc:e.children,className:a,linkClassName:n}))))):null}function i(e){let{toc:t,className:a="table-of-contents table-of-contents__left-border",linkClassName:i="table-of-contents__link",linkActiveClassName:c,minHeadingLevel:o,maxHeadingLevel:m,...d}=e;const u=(0,s.LU)(),v=o??u.tableOfContents.minHeadingLevel,b=m??u.tableOfContents.maxHeadingLevel,p=(0,s.b9)({toc:t,minHeadingLevel:v,maxHeadingLevel:b}),E=(0,l.useMemo)((()=>{if(i&&c)return{linkClassName:i,linkActiveClassName:c,minHeadingLevel:v,maxHeadingLevel:b}}),[i,c,v,b]);return(0,s.Si)(E),l.createElement(r,(0,n.Z)({toc:p,className:a,linkClassName:i},d))}},5381:(e,t,a)=>{a.d(t,{Z:()=>o});var n=a(2784),l=a(6277),s=a(2896);const r="tag_YCD2",i="tagRegular_gQaq",c="tagWithCount_v9T4";function o(e){const{permalink:t,name:a,count:o}=e;return n.createElement(s.Z,{href:t,className:(0,l.Z)(r,o?c:i)},a,o&&n.createElement("span",null,o))}},4155:(e,t,a)=>{a.d(t,{Z:()=>o});var n=a(2784),l=a(6277),s=a(8004),r=a(5381);const i="tags_oE6d",c="tag_uFUt";function o(e){let{tags:t}=e;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(s.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,l.Z)(i,"padding--none","margin-left--sm")},t.map((e=>{let{label:t,permalink:a}=e;return n.createElement("li",{key:a,className:c},n.createElement(r.Z,{name:t,permalink:a}))}))))}}}]);