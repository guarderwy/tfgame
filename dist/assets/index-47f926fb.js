(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Wt=40,tn=24,nn=15,br=tn*Wt,Tr=nn*Wt,Fi=[22,7],di={infantry:{name:"步兵",hp:42,speed:46,armor:0,bounty:8,damage:1,color:"#d9c27a",kind:"ground",size:7},truck:{name:"装甲车",hp:105,speed:62,armor:3,bounty:14,damage:2,color:"#b58b4d",kind:"ground",size:10},tank:{name:"坦克",hp:340,speed:30,armor:12,bounty:34,damage:4,color:"#8f9a6a",kind:"ground",size:13},plane:{name:"飞机",hp:78,speed:96,armor:1,bounty:18,damage:2,color:"#9fc4d8",kind:"air",size:10},ship:{name:"舰船",hp:420,speed:26,armor:9,bounty:38,damage:5,color:"#7fa7b8",kind:"water",size:15},mech:{name:"机甲",hp:520,speed:38,armor:18,bounty:56,damage:5,color:"#a89a72",kind:"ground",size:16},drone:{name:"无人机",hp:62,speed:112,armor:2,bounty:16,damage:2,color:"#bcd8e8",kind:"air",size:8},hovercraft:{name:"气垫船",hp:280,speed:54,armor:6,bounty:30,damage:4,color:"#8fc9cf",kind:"water",size:14},strider:{name:"步行者",hp:920,speed:25,armor:24,bounty:82,damage:8,color:"#c3aad9",kind:"ground",size:18},bomber:{name:"轰炸机",hp:320,speed:58,armor:8,bounty:48,damage:7,color:"#b9a6c8",kind:"air",size:14},helicopter:{name:"武装直升机",hp:210,speed:74,armor:5,bounty:36,damage:5,color:"#9dbf9a",kind:"air",size:12},destroyer:{name:"驱逐舰",hp:640,speed:32,armor:14,bounty:58,damage:7,color:"#8fa8c0",kind:"water",size:18},submarine:{name:"潜艇",hp:380,speed:42,armor:10,bounty:44,damage:6,color:"#6e8fa8",kind:"water",size:13}},en={machinegun:{name:"机枪炮台",desc:"射速快，克制步兵与轻甲",cost:65,damage:10,range:112,fireRate:4,color:"#e0b34d",targets:["ground"],splash:0,projectileSpeed:520},howitzer:{name:"榴弹炮",desc:"范围爆炸，克制集群与坦克",cost:95,damage:42,range:158,fireRate:.9,color:"#d9794a",targets:["ground"],splash:44,projectileSpeed:300},aa:{name:"防空炮",desc:"专门拦截空中单位",cost:95,damage:16,range:138,fireRate:3.4,color:"#69b6c9",targets:["air"],splash:0,projectileSpeed:600},coastal:{name:"岸防炮",desc:"重炮，专门攻击水路舰船",cost:115,damage:52,range:176,fireRate:1,color:"#8fa3c4",targets:["water"],splash:22,projectileSpeed:340},laser:{name:"激光炮",desc:"高频能量束，可打地面与空中",cost:130,damage:11,range:146,fireRate:7.5,color:"#79e2d6",targets:["ground","air"],splash:0,projectileSpeed:1e3},flak:{name:"防空爆破炮",desc:"空中范围爆炸，克制机群",cost:140,damage:38,range:168,fireRate:1.5,color:"#f0a95c",targets:["air"],splash:58,projectileSpeed:460},railgun:{name:"电磁轨道炮",desc:"超远射程，无视护甲",cost:190,damage:120,range:246,fireRate:.6,color:"#c9d6f0",targets:["ground","water"],splash:0,projectileSpeed:1200,pierceArmor:!0},tesla:{name:"电弧塔",desc:"闪电连锁，最多命中 3 个地面目标",cost:165,damage:40,range:136,fireRate:1.7,color:"#b48cf0",targets:["ground"],splash:0,projectileSpeed:800,chain:3},mine:{name:"水雷布设器",desc:"建于水边陆地，定时向水路布雷；舰船触碰引爆，1级3颗起，满级5颗",cost:95,damage:32,range:130,fireRate:.4,color:"#e4695d",targets:["water"],splash:52,projectileSpeed:0,minelayer:!0}},Ts={damage:1.45,range:1.12,fireRate:1.12,cost:.9},Do=.6,As=3;function No(s){return 1+(s-1)*.045}function Qa(s,e){return{x:s*Wt+Wt/2,y:e*Wt+Wt/2}}const Uo=(s,e,t=.8,n=0,i=0,r=1,a=!1)=>({type:s,count:e,interval:t,delay:n,lane:i,hpScale:r,boss:a}),th=(...s)=>({groups:s}),Rs=new Set([3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20]),Fo={infantry:1,truck:2,tank:5,ship:4,plane:2.5,mech:7,drone:2.5,hovercraft:5,strider:11,bomber:8.5,helicopter:6,destroyer:10,submarine:7},Mi={infantry:1,truck:2,ship:3,tank:4,plane:5,mech:11,drone:12,hovercraft:13,strider:16,bomber:9,helicopter:7,destroyer:14,submarine:10};function nh(s){const e=["infantry"];return s>=2&&e.push("truck"),s>=4&&e.push("tank"),s>=3&&Rs.has(s)&&e.push("ship"),s>=5&&e.push("plane"),s>=7&&e.push("helicopter"),s>=11&&e.push("mech"),s>=12&&e.push("drone"),s>=9&&e.push("bomber"),s>=10&&Rs.has(s)&&e.push("submarine"),s>=13&&Rs.has(s)&&e.push("hovercraft"),s>=14&&Rs.has(s)&&e.push("destroyer"),s>=16&&e.push("strider"),e}function yt(s){const e=Math.min(12,4+Math.floor(s/2)),t=nh(s),n=[];for(let i=0;i<e;i++){const r=i===e-1,a=Math.round((3+s*.32)*(1+i*.1)*(r?1.25:1)),o=t.filter(p=>di[p].kind==="ground").sort((p,m)=>Mi[p]-Mi[m]),c=t.filter(p=>di[p].kind==="water").sort((p,m)=>Mi[p]-Mi[m]),l=t.filter(p=>di[p].kind==="air").sort((p,m)=>Mi[p]-Mi[m]),h=p=>Math.min(p.length,1+Math.floor(s/6)+(i>=e*.6&&!r?1:0)),u=p=>{if(!p.length)return[];const m=p.slice(0,h(p));if(i<2)return[m[0]];const x=(i+s)%m.length;return[m[x]]};let d=[...u(o),...u(c),...u(l)];if(i>=4&&o.length>1&&!r){const p=o[(i+s+1)%Math.max(1,h(o))];p&&!d.includes(p)&&d.push(p)}const f=Math.max(2,Math.min(4,1+Math.floor(s/6))),g=d.map(p=>di[p].kind==="ground"?Math.max(3,Math.round(a*.5)):f),M=d.map((p,m)=>{const x=g[m],w=p==="ship"||p==="hovercraft"||p==="destroyer"?1.5:p==="submarine"?1.2:p==="strider"||p==="mech"||p==="bomber"?2.1:p==="tank"?1.8:p==="drone"?.6:.8,v=r?1.3+s*.015:1+i*.015;return Uo(p,x,w,m*1.1,m%2,v)});if(r){const p=[...t].sort((w,v)=>Fo[v]-Fo[w])[0],m=Math.max(...M.map(w=>w.delay+(w.count-1)*w.interval)),x=(1.15+s*.05)*(1.3+s*.015);M.push(Uo(p,1,1,m+1.6,0,x,!0))}n.push(th(...M))}return n}const wt=s=>s,$i=[{id:1,name:"前线哨所",desc:"草原前哨，S 形路线适合熟悉炮台射程。",gold:280,lives:20,theme:wt({ground:"#36472d",path:"#756746",water:"#235d78",sky:"#1b2619",fog:"#1b2619",deco:"trees",ambient:1.05,sun:1.15}),ground:[[[0,7],[10,7],[10,6],[22,6],[22,7]]],water:[],waves:yt(1)},{id:2,name:"山谷回廊",desc:"岩壁山谷，长折线拉长敌人暴露时间。",gold:300,lives:20,theme:wt({ground:"#424137",path:"#847352",water:"#22576f",sky:"#22231d",fog:"#22231d",deco:"rocks",ambient:1,sun:1.2}),ground:[[[0,7],[6,7],[6,3],[14,3],[14,11],[22,11],[22,7]]],water:[],waves:yt(2)},{id:3,name:"河畔防线",desc:"河网地带，地面与水路首次并行推进。",gold:320,lives:20,theme:wt({ground:"#344c36",path:"#726346",water:"#1e6c8a",sky:"#182821",fog:"#182821",deco:"reeds",ambient:1.05,sun:1.1}),ground:[[[0,6],[6,6],[6,10],[13,10],[13,4],[20,4],[20,7],[22,7]]],water:[[[0,13],[22,13]]],waves:yt(3)},{id:4,name:"丛林绕行",desc:"密林回环，多层弯道与坦克威胁并存。",gold:345,lives:22,theme:wt({ground:"#29452e",path:"#5f5339",water:"#1d6479",sky:"#14231a",fog:"#14231a",deco:"forest",ambient:1.15,sun:.95}),ground:[[[0,7],[4,7],[4,3],[9,3],[9,12],[15,12],[15,5],[20,5],[20,10],[22,10],[22,7]]],water:[[[0,13],[8,13],[8,11],[16,11],[16,13],[22,13]]],waves:yt(4)},{id:5,name:"港口城市",desc:"港区街区，地面、水路、空中三线交汇。",gold:370,lives:22,theme:wt({ground:"#414038",path:"#786d56",water:"#1c607c",sky:"#22262b",fog:"#22262b",deco:"crates",ambient:.95,sun:1.05}),ground:[[[0,5],[5,5],[5,11],[10,11],[10,3],[15,3],[15,10],[20,10],[20,6],[22,6],[22,7]]],water:[[[0,13],[9,13],[9,10],[17,10],[17,13],[22,13]]],waves:yt(5)},{id:6,name:"铁路枢纽",desc:"交错轨道，高速折线考验火力覆盖。",gold:395,lives:22,theme:wt({ground:"#454137",path:"#7c6b49",water:"#235c74",sky:"#23241e",fog:"#23241e",deco:"rails",ambient:1,sun:1.15}),ground:[[[0,8],[4,8],[4,2],[9,2],[9,12],[14,12],[14,5],[19,5],[19,13],[22,13],[22,7]]],water:[[[0,13],[6,13],[6,9],[12,9],[12,14],[18,14],[18,11],[22,11],[22,13]]],waves:yt(6)},{id:7,name:"分岔河口",desc:"双地面路线加水路，敌人从三个方向推进。",gold:420,lives:24,theme:wt({ground:"#384e3a",path:"#746647",water:"#206a84",sky:"#1a2a25",fog:"#1a2a25",deco:"reeds",ambient:1.05,sun:1.05}),ground:[[[0,3],[5,3],[5,9],[10,9],[10,2],[15,2],[15,10],[20,10],[20,7],[22,7]],[[0,11],[5,11],[5,5],[10,5],[10,13],[16,13],[16,7],[22,7]]],water:[[[0,13],[8,13],[8,10],[14,10],[14,13],[22,13]]],waves:yt(7)},{id:8,name:"夜间突袭",desc:"夜色长蛇阵，视野与火力分配同样重要。",gold:445,lives:24,theme:wt({ground:"#2b3a33",path:"#696349",water:"#20566e",sky:"#111a1f",fog:"#111a1f",deco:"rocks",ambient:.72,sun:.68,night:!0}),ground:[[[0,7],[3,7],[3,13],[8,13],[8,3],[13,3],[13,12],[18,12],[18,4],[21,4],[21,7],[22,7]]],water:[[[0,12],[6,12],[6,9],[12,9],[12,12],[18,12],[18,14],[22,14],[22,13]]],waves:yt(8)},{id:9,name:"要塞外围",desc:"石砌要塞迷宫，首领级单位压轴登场。",gold:470,lives:24,theme:wt({ground:"#413b33",path:"#806e4c",water:"#1e5b72",sky:"#26221d",fog:"#26221d",deco:"ruins",ambient:.95,sun:1.1}),ground:[[[0,6],[3,6],[3,2],[7,2],[7,11],[12,11],[12,3],[16,3],[16,12],[20,12],[20,5],[22,5],[22,7]]],water:[[[0,13],[9,13],[9,10],[15,10],[15,13],[20,13],[20,12],[22,12],[22,13]]],waves:yt(9)},{id:10,name:"最终防线",desc:"三线并行决战，全部兵种与首领混编。",gold:500,lives:26,theme:wt({ground:"#46382f",path:"#8c6c47",water:"#225f7d",sky:"#2b1d19",fog:"#2b1d19",deco:"ruins",ambient:1,sun:1.25}),ground:[[[0,2],[4,2],[4,8],[9,8],[9,1],[14,1],[14,9],[19,9],[19,6],[22,6],[22,7]],[[0,12],[4,12],[4,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],water:[[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]]],waves:yt(10)},{id:11,name:"荒漠前线",desc:"沙海双线，机甲首次登场。",gold:530,lives:26,theme:wt({ground:"#5a4a33",path:"#8c7348",water:"#2a6a80",sky:"#3a2a1c",fog:"#3a2a1c",deco:"desert",ambient:1.15,sun:1.3}),ground:[[[0,4],[5,4],[5,10],[10,10],[10,2],[15,2],[15,9],[20,9],[20,6],[22,6],[22,7]],[[0,12],[4,12],[4,6],[9,6],[9,13],[14,13],[14,8],[19,8],[19,12],[22,12],[22,7]]],water:[],waves:yt(11)},{id:12,name:"密林深处",desc:"密林与溪流，无人机群开始骚扰。",gold:560,lives:26,theme:wt({ground:"#2e4a33",path:"#67583c",water:"#1f6a7e",sky:"#16271d",fog:"#16271d",deco:"forest",ambient:1.1,sun:1}),ground:[[[0,3],[4,3],[4,9],[9,9],[9,2],[14,2],[14,10],[19,10],[19,6],[22,6],[22,7]],[[0,11],[5,11],[5,5],[10,5],[10,13],[16,13],[16,8],[21,8],[21,11],[22,11],[22,7]]],water:[[[0,13],[7,13],[7,10],[13,10],[13,13],[19,13],[22,13]]],waves:yt(12)},{id:13,name:"滨海新城",desc:"城市街区，气垫船沿水道突进。",gold:590,lives:28,theme:wt({ground:"#484947",path:"#7d7768",water:"#226884",sky:"#2b3138",fog:"#2b3138",deco:"city",ambient:1,sun:1.05}),ground:[[[0,4],[5,4],[5,10],[10,10],[10,2],[15,2],[15,9],[20,9],[20,6],[22,6],[22,7]],[[0,12],[4,12],[4,6],[8,6],[8,13],[13,13],[13,7],[18,7],[18,11],[22,11],[22,7]]],water:[[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]],[[0,12],[3,12],[3,9],[9,9],[9,13],[14,13],[14,11],[22,11],[22,13]]],waves:yt(13)},{id:14,name:"深水航道",desc:"三条水道并行，舰船与气垫船混合推进。",gold:620,lives:28,theme:wt({ground:"#33505a",path:"#6d745f",water:"#1b78a0",sky:"#17303e",fog:"#17303e",deco:"reeds",ambient:1.05,sun:1.1}),ground:[[[0,7],[4,7],[4,13],[9,13],[9,4],[14,4],[14,12],[19,12],[19,7],[22,7]]],water:[[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]],[[0,12],[4,12],[4,9],[9,9],[9,14],[14,14],[14,11],[22,11],[22,13]],[[0,11],[3,11],[3,8],[8,8],[8,12],[13,12],[13,10],[22,10],[22,13]]],waves:yt(14)},{id:15,name:"峡谷要塞",desc:"狭长峡谷，电磁轨道炮的理想战场。",gold:650,lives:28,theme:wt({ground:"#514433",path:"#927449",water:"#215f73",sky:"#2e2018",fog:"#2e2018",deco:"rocks",ambient:1,sun:1.25}),ground:[[[0,2],[4,2],[4,8],[9,8],[9,1],[14,1],[14,7],[19,7],[19,3],[22,3],[22,7]],[[0,12],[4,12],[4,5],[9,5],[9,14],[14,14],[14,8],[19,8],[19,12],[22,12],[22,7]]],water:[[[0,13],[6,13],[6,9],[12,9],[12,14],[18,14],[18,11],[22,11],[22,13]]],waves:yt(15)},{id:16,name:"极寒边境",desc:"雪原三线，步行者踏雪而来。",gold:680,lives:28,theme:wt({ground:"#6b7b7d",path:"#a39c86",water:"#3d7f96",sky:"#3b4a55",fog:"#3b4a55",deco:"snow",ambient:1.2,sun:1}),ground:[[[0,2],[4,2],[4,7],[9,7],[9,1],[14,1],[14,8],[19,8],[19,5],[22,5],[22,7]],[[0,8],[4,8],[4,12],[9,12],[9,6],[14,6],[14,13],[19,13],[19,9],[22,9],[22,7]],[[0,13],[3,13],[3,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],water:[[[0,14],[6,14],[6,11],[12,11],[12,14],[18,14],[18,12],[22,12],[22,13]]],waves:yt(16)},{id:17,name:"陨石荒原",desc:"陨坑密布，机械与空中单位混编。",gold:710,lives:30,theme:wt({ground:"#4a3f3a",path:"#8a6d50",water:"#2a6076",sky:"#30211d",fog:"#30211d",deco:"space",ambient:.95,sun:1.1}),ground:[[[0,3],[5,3],[5,9],[10,9],[10,2],[15,2],[15,10],[20,10],[20,6],[22,6],[22,7]],[[0,11],[5,11],[5,5],[10,5],[10,13],[16,13],[16,8],[21,8],[21,12],[22,12],[22,7]]],water:[[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]],[[0,12],[4,12],[4,8],[9,8],[9,13],[14,13],[14,10],[22,10],[22,13]]],waves:yt(17)},{id:18,name:"轨道空间站",desc:"未来战场，无人机与步行者高密度来袭。",gold:740,lives:30,theme:wt({ground:"#3d4150",path:"#7b7f92",water:"#2c6f9a",sky:"#1c2133",fog:"#1c2133",deco:"space",ambient:.95,sun:1.05}),ground:[[[0,2],[4,2],[4,7],[9,7],[9,1],[14,1],[14,8],[19,8],[19,5],[22,5],[22,7]],[[0,8],[4,8],[4,12],[9,12],[9,5],[14,5],[14,13],[19,13],[19,9],[22,9],[22,7]],[[0,13],[3,13],[3,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],water:[[[0,14],[6,14],[6,11],[12,11],[12,14],[18,14],[18,12],[22,12],[22,13]],[[0,12],[3,12],[3,9],[9,9],[9,13],[14,13],[14,11],[22,11],[22,13]]],waves:yt(18)},{id:19,name:"星门守卫",desc:"星门前哨，首领级步行者压轴。",gold:770,lives:30,theme:wt({ground:"#423a4f",path:"#8b7896",water:"#356f9c",sky:"#241d33",fog:"#241d33",deco:"space",ambient:1,sun:1.15}),ground:[[[0,3],[4,3],[4,10],[9,10],[9,2],[14,2],[14,9],[19,9],[19,4],[22,4],[22,7]],[[0,12],[4,12],[4,5],[9,5],[9,14],[14,14],[14,7],[19,7],[19,12],[22,12],[22,7]]],water:[[[0,13],[6,13],[6,9],[12,9],[12,14],[18,14],[18,11],[22,11],[22,13]],[[0,14],[4,14],[4,10],[10,10],[10,13],[16,13],[16,12],[22,12],[22,13]]],waves:yt(19)},{id:20,name:"终极防线",desc:"三地面三水道、全兵种首领混编的最终决战。",gold:800,lives:32,theme:wt({ground:"#4a2f3a",path:"#9a6f57",water:"#3a7ba6",sky:"#341824",fog:"#341824",deco:"space",ambient:1.05,sun:1.3}),ground:[[[0,2],[4,2],[4,8],[9,8],[9,1],[14,1],[14,9],[19,9],[19,5],[22,5],[22,7]],[[0,8],[4,8],[4,12],[9,12],[9,5],[14,5],[14,13],[19,13],[19,9],[22,9],[22,7]],[[0,13],[3,13],[3,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],water:[[[0,14],[6,14],[6,11],[12,11],[12,14],[18,14],[18,12],[22,12],[22,13]],[[0,12],[3,12],[3,9],[9,9],[9,13],[14,13],[14,10],[22,10],[22,13]],[[0,11],[5,11],[5,8],[11,8],[11,12],[17,12],[17,10],[22,10],[22,13]]],waves:yt(20)}];/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ja="187",ih=0,Oo=1,sh=2,as=1,rh=2,is=3,fi=0,Kt=1,At=2,Bi=0,os=1,Yt=2,Bo=3,zo=4,ah=5,Ui=100,oh=101,lh=102,ch=103,hh=104,uh=200,dh=201,fh=202,ph=203,$l=204,Jl=205,mh=206,gh=207,_h=208,xh=209,vh=210,Mh=211,Sh=212,yh=213,wh=214,aa=0,oa=1,la=2,ds=3,ca=4,ha=5,ua=6,da=7,Zl=0,Eh=1,bh=2,kn=0,Kl=1,Ql=2,jl=3,ec=4,tc=5,nc=6,ic=7,sc=300,Gi=301,fs=302,Ar=303,Rr=304,lr=1e3,Gn=1001,fa=1002,Bt=1003,Th=1004,Cs=1005,Zt=1006,Cr=1007,jn=1008,sn=1009,rc=1010,ac=1011,ps=1012,eo=1013,Cn=1014,Sn=1015,Pn=1016,to=1017,no=1018,ki=1020,oc=35902,lc=35899,cc=1021,hc=1022,An=1023,ii=1026,ei=1027,io=1028,so=1029,pi=1030,ro=1031,ao=1033,nr=33776,ir=33777,sr=33778,rr=33779,pa=35840,ma=35841,ga=35842,_a=35843,xa=36196,va=37492,Ma=37496,Sa=37488,ya=37489,cr=37490,wa=37491,Ea=37808,ba=37809,Ta=37810,Aa=37811,Ra=37812,Ca=37813,Pa=37814,La=37815,Ia=37816,Da=37817,Na=37818,Ua=37819,Fa=37820,Oa=37821,Ba=36492,za=36494,Ga=36495,ka=36283,Ha=36284,hr=36285,Va=36286,Ah=3200,Wa=0,Rh=1,Qn="",un="srgb",ur="srgb-linear",dr="linear",it="srgb",Pr=7680,Ch=519,Ph=512,Lh=513,Ih=514,uc=515,Dh=516,Nh=517,dc=518,fc=519,Uh=35044,Go="300 es",yn=2e3,ms=2001;function Fh(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function fr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Oh(){const s=fr("canvas");return s.style.display="block",s}const ko={};function Ho(...s){const e="THREE."+s.shift();console.log(e,...s)}function pc(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Oe(...s){s=pc(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function je(...s){s=pc(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function ar(...s){const e=s.join(" ");e in ko||(ko[e]=!0,Oe(...s))}function Bh(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const zh={[aa]:aa,[la]:ua,[ca]:ca,[ds]:ha,[oa]:oa,[ua]:la,[da]:da,[ha]:ds};class _i{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Lr=Math.PI/180,Xa=180/Math.PI;function Xi(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(kt[s&255]+kt[s>>8&255]+kt[s>>16&255]+kt[s>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]).toLowerCase()}function qe(s,e,t){return Math.max(e,Math.min(t,s))}function Gh(s,e){return(s%e+e)%e}function Ir(s,e,t){return(1-t)*s+t*e}function kh(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function oo(s){switch(s.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Hh(s,e){if(e.constructor===Float32Array)return s;const t=oo(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(s/t,-1)}function Vh(s,e){if(e.constructor===Float32Array)return s;const t=oo(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(s*t)}const _o=class _o{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};_o.prototype.isVector2=!0;let ye=_o;class xi{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3],d=r[a+0],f=r[a+1],g=r[a+2],M=r[a+3];if(u!==M||c!==d||l!==f||h!==g){let p=c*d+l*f+h*g+u*M;p<0&&(d=-d,f=-f,g=-g,M=-M,p=-p);let m=1-o;if(p<.9995){const x=Math.acos(p),w=Math.sin(x);m=Math.sin(m*x)/w,o=Math.sin(o*x)/w,c=c*m+d*o,l=l*m+f*o,h=h*m+g*o,u=u*m+M*o}else{c=c*m+d*o,l=l*m+f*o,h=h*m+g*o,u=u*m+M*o;const x=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=x,l*=x,h*=x,u*=x}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*u+c*f-l*d,e[t+1]=c*g+h*d+l*u-o*f,e[t+2]=l*g+h*f+o*d-c*u,e[t+3]=h*g-o*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),u=o(r/2),d=c(n/2),f=c(i/2),g=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:Oe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-l)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+i*l-r*c,this._y=i*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const xo=class xo{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Vo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Vo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=i+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Dr.copy(this).projectOnVector(e),this.sub(Dr)}reflect(e){return this.sub(Dr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};xo.prototype.isVector3=!0;let D=xo;const Dr=new D,Vo=new xi,vo=class vo{constructor(e,t,n,i,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l)}set(e,t,n,i,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],M=i[0],p=i[3],m=i[6],x=i[1],w=i[4],v=i[7],T=i[2],b=i[5],_=i[8];return r[0]=a*M+o*x+c*T,r[3]=a*p+o*w+c*b,r[6]=a*m+o*v+c*_,r[1]=l*M+h*x+u*T,r[4]=l*p+h*w+u*b,r[7]=l*m+h*v+u*_,r[2]=d*M+f*x+g*T,r[5]=d*p+f*w+g*b,r[8]=d*m+f*v+g*_,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+i*r*l-i*a*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,g=t*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return e[0]=u*M,e[1]=(i*l-h*n)*M,e[2]=(o*n-i*a)*M,e[3]=d*M,e[4]=(h*t-i*c)*M,e[5]=(i*r-o*t)*M,e[6]=f*M,e[7]=(n*c-l*t)*M,e[8]=(a*t-n*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-i*l,i*c,-i*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return ar("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Nr.makeScale(e,t)),this}rotate(e){return ar("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Nr.makeRotation(-e)),this}translate(e,t){return ar("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Nr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};vo.prototype.isMatrix3=!0;let ze=vo;const Nr=new ze,Wo=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xo=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Wh(){const s={enabled:!0,workingColorSpace:ur,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===it&&(i.r=Hn(i.r),i.g=Hn(i.g),i.b=Hn(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===it&&(i.r=zi(i.r),i.g=zi(i.g),i.b=zi(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Qn?dr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[ur]:{primaries:e,whitePoint:n,transfer:dr,toXYZ:Wo,fromXYZ:Xo,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:un},outputColorSpaceConfig:{drawingBufferColorSpace:un}},[un]:{primaries:e,whitePoint:n,transfer:it,toXYZ:Wo,fromXYZ:Xo,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:un}}}),s}const Ke=Wh();function Hn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function zi(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Si;class Xh{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Si===void 0&&(Si=fr("canvas")),Si.width=e.width,Si.height=e.height;const i=Si.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Si}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=fr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Hn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Hn(t[n]/255)*255):t[n]=Hn(t[n]);return{data:t,width:e.width,height:e.height}}else return Oe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let qh=0;class lo{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:qh++}),this.uuid=Xi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Ur(i[a].image)):r.push(Ur(i[a]))}else r=Ur(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Ur(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Xh.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Oe("Texture: Unable to serialize Texture."),{})}let Yh=0;const Fr=new D;class Xt extends _i{constructor(e=Xt.DEFAULT_IMAGE,t=Xt.DEFAULT_MAPPING,n=Gn,i=Gn,r=Zt,a=jn,o=An,c=sn,l=Xt.DEFAULT_ANISOTROPY,h=Qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yh++}),this.uuid=Xi(),this.name="",this.source=new lo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Fr).x}get height(){return this.source.getSize(Fr).y}get depth(){return this.source.getSize(Fr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Oe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Oe(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==sc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case lr:e.x=e.x-Math.floor(e.x);break;case Gn:e.x=e.x<0?0:1;break;case fa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case lr:e.y=e.y-Math.floor(e.y);break;case Gn:e.y=e.y<0?0:1;break;case fa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Xt.DEFAULT_IMAGE=null;Xt.DEFAULT_MAPPING=sc;Xt.DEFAULT_ANISOTROPY=1;const Mo=class Mo{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],M=c[2],p=c[6],m=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-M)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+M)<.1&&Math.abs(g+p)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(l+1)/2,v=(f+1)/2,T=(m+1)/2,b=(h+d)/4,_=(u+M)/4,E=(g+p)/4;return w>v&&w>T?w<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(w),i=b/n,r=_/n):v>T?v<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(v),n=b/i,r=E/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=_/r,i=E/r),this.set(n,i,r,t),this}let x=Math.sqrt((p-g)*(p-g)+(u-M)*(u-M)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(p-g)/x,this.y=(u-M)/x,this.z=(d-h)/x,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Mo.prototype.isVector4=!0;let gt=Mo;class $h extends _i{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Zt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new gt(0,0,e,t),this.scissorTest=!1,this.viewport=new gt(0,0,e,t),this.textures=[];const i=n.count;for(let r=0;r<i;r++)this.textures[r]=new Xt({width:e,height:t,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Zt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new lo(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Rn extends $h{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class mc extends Xt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Jh extends Xt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Mr=class Mr{constructor(e,t,n,i,r,a,o,c,l,h,u,d,f,g,M,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l,h,u,d,f,g,M,p)}set(e,t,n,i,r,a,o,c,l,h,u,d,f,g,M,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=g,m[11]=M,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Mr().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/yi.setFromMatrixColumn(e,0).length(),r=1/yi.setFromMatrixColumn(e,1).length(),a=1/yi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,g=o*h,M=o*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+g*l,t[5]=d-M*l,t[9]=-o*c,t[2]=M-d*l,t[6]=g+f*l,t[10]=a*c}else if(e.order==="YXZ"){const d=c*h,f=c*u,g=l*h,M=l*u;t[0]=d+M*o,t[4]=g*o-f,t[8]=a*l,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=M+d*o,t[10]=a*c}else if(e.order==="ZXY"){const d=c*h,f=c*u,g=l*h,M=l*u;t[0]=d-M*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=M-d*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const d=a*h,f=a*u,g=o*h,M=o*u;t[0]=c*h,t[4]=g*l-f,t[8]=d*l+M,t[1]=c*u,t[5]=M*l+d,t[9]=f*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const d=a*c,f=a*l,g=o*c,M=o*l;t[0]=c*h,t[4]=M-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*u+g,t[10]=d-M*u}else if(e.order==="XZY"){const d=a*c,f=a*l,g=o*c,M=o*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+M,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=M*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Zh,e,Kh)}lookAt(e,t,n){const i=this.elements;return Qt.subVectors(e,t),Qt.lengthSq()===0&&(Qt.z=1),Qt.normalize(),Xn.crossVectors(n,Qt),Xn.lengthSq()===0&&(Math.abs(n.z)===1?Qt.x+=1e-4:Qt.z+=1e-4,Qt.normalize(),Xn.crossVectors(n,Qt)),Xn.normalize(),Ps.crossVectors(Qt,Xn),i[0]=Xn.x,i[4]=Ps.x,i[8]=Qt.x,i[1]=Xn.y,i[5]=Ps.y,i[9]=Qt.y,i[2]=Xn.z,i[6]=Ps.z,i[10]=Qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],M=n[6],p=n[10],m=n[14],x=n[3],w=n[7],v=n[11],T=n[15],b=i[0],_=i[4],E=i[8],L=i[12],C=i[1],N=i[5],O=i[9],X=i[13],R=i[2],B=i[6],V=i[10],z=i[14],ie=i[3],q=i[7],j=i[11],ne=i[15];return r[0]=a*b+o*C+c*R+l*ie,r[4]=a*_+o*N+c*B+l*q,r[8]=a*E+o*O+c*V+l*j,r[12]=a*L+o*X+c*z+l*ne,r[1]=h*b+u*C+d*R+f*ie,r[5]=h*_+u*N+d*B+f*q,r[9]=h*E+u*O+d*V+f*j,r[13]=h*L+u*X+d*z+f*ne,r[2]=g*b+M*C+p*R+m*ie,r[6]=g*_+M*N+p*B+m*q,r[10]=g*E+M*O+p*V+m*j,r[14]=g*L+M*X+p*z+m*ne,r[3]=x*b+w*C+v*R+T*ie,r[7]=x*_+w*N+v*B+T*q,r[11]=x*E+w*O+v*V+T*j,r[15]=x*L+w*X+v*z+T*ne,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],M=e[7],p=e[11],m=e[15],x=c*f-l*d,w=o*f-l*u,v=o*d-c*u,T=a*f-l*h,b=a*d-c*h,_=a*u-o*h;return t*(M*x-p*w+m*v)-n*(g*x-p*T+m*b)+i*(g*w-M*T+m*_)-r*(g*v-M*b+p*_)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return t*(a*h-o*l)-n*(r*h-o*c)+i*(r*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],M=e[13],p=e[14],m=e[15],x=t*o-n*a,w=t*c-i*a,v=t*l-r*a,T=n*c-i*o,b=n*l-r*o,_=i*l-r*c,E=h*M-u*g,L=h*p-d*g,C=h*m-f*g,N=u*p-d*M,O=u*m-f*M,X=d*m-f*p,R=x*X-w*O+v*N+T*C-b*L+_*E;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/R;return e[0]=(o*X-c*O+l*N)*B,e[1]=(i*O-n*X-r*N)*B,e[2]=(M*_-p*b+m*T)*B,e[3]=(d*b-u*_-f*T)*B,e[4]=(c*C-a*X-l*L)*B,e[5]=(t*X-i*C+r*L)*B,e[6]=(p*v-g*_-m*w)*B,e[7]=(h*_-d*v+f*w)*B,e[8]=(a*O-o*C+l*E)*B,e[9]=(n*C-t*O-r*E)*B,e[10]=(g*b-M*v+m*x)*B,e[11]=(u*v-h*b-f*x)*B,e[12]=(o*L-a*N-c*E)*B,e[13]=(t*N-n*L+i*E)*B,e[14]=(M*w-g*T-p*x)*B,e[15]=(h*T-u*w+d*x)*B,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,g=r*u,M=a*h,p=a*u,m=o*u,x=c*l,w=c*h,v=c*u,T=n.x,b=n.y,_=n.z;return i[0]=(1-(M+m))*T,i[1]=(f+v)*T,i[2]=(g-w)*T,i[3]=0,i[4]=(f-v)*b,i[5]=(1-(d+m))*b,i[6]=(p+x)*b,i[7]=0,i[8]=(g+w)*_,i[9]=(p-x)*_,i[10]=(1-(d+M))*_,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=yi.set(i[0],i[1],i[2]).length();const o=yi.set(i[4],i[5],i[6]).length(),c=yi.set(i[8],i[9],i[10]).length();r<0&&(a=-a),pn.copy(this);const l=1/a,h=1/o,u=1/c;return pn.elements[0]*=l,pn.elements[1]*=l,pn.elements[2]*=l,pn.elements[4]*=h,pn.elements[5]*=h,pn.elements[6]*=h,pn.elements[8]*=u,pn.elements[9]*=u,pn.elements[10]*=u,t.setFromRotationMatrix(pn),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,i,r,a,o=yn,c=!1){const l=this.elements,h=2*r/(t-e),u=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let g,M;if(c)g=r/(a-r),M=a*r/(a-r);else if(o===yn)g=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===ms)g=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=yn,c=!1){const l=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i);let g,M;if(c)g=1/(a-r),M=a/(a-r);else if(o===yn)g=-2/(a-r),M=-(a+r)/(a-r);else if(o===ms)g=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Mr.prototype.isMatrix4=!0;let st=Mr;const yi=new D,pn=new st,Zh=new D(0,0,0),Kh=new D(1,1,1),Xn=new D,Ps=new D,Qt=new D,qo=new st,Yo=new xi;class si{constructor(e=0,t=0,n=0,i=si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(qe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-qe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(qe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Oe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return qo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(qo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Yo.setFromEuler(this),this.setFromQuaternion(Yo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}si.DEFAULT_ORDER="XYZ";class co{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Qh=0;const $o=new D,wi=new xi,Dn=new st,Ls=new D,Ji=new D,jh=new D,eu=new xi,Jo=new D(1,0,0),Zo=new D(0,1,0),Ko=new D(0,0,1),Qo={type:"added"},tu={type:"removed"},Ei={type:"childadded",child:null},Or={type:"childremoved",child:null};class Nt extends _i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qh++}),this.uuid=Xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Nt.DEFAULT_UP.clone();const e=new D,t=new si,n=new xi,i=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new st},normalMatrix:{value:new ze}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=Nt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new co,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return wi.setFromAxisAngle(e,t),this.quaternion.multiply(wi),this}rotateOnWorldAxis(e,t){return wi.setFromAxisAngle(e,t),this.quaternion.premultiply(wi),this}rotateX(e){return this.rotateOnAxis(Jo,e)}rotateY(e){return this.rotateOnAxis(Zo,e)}rotateZ(e){return this.rotateOnAxis(Ko,e)}translateOnAxis(e,t){return $o.copy(e).applyQuaternion(this.quaternion),this.position.add($o.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Jo,e)}translateY(e){return this.translateOnAxis(Zo,e)}translateZ(e){return this.translateOnAxis(Ko,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ls.copy(e):Ls.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(Ji,Ls,this.up):Dn.lookAt(Ls,Ji,this.up),this.quaternion.setFromRotationMatrix(Dn),i&&(Dn.extractRotation(i.matrixWorld),wi.setFromRotationMatrix(Dn),this.quaternion.premultiply(wi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Qo),Ei.child=e,this.dispatchEvent(Ei),Ei.child=null):je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(tu),Or.child=e,this.dispatchEvent(Or),Or.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Qo),Ei.child=e,this.dispatchEvent(Ei),Ei.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,e,jh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,eu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Nt.DEFAULT_UP=new D(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class mt extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const nu={type:"move"};class Br{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new mt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new mt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new mt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const M of e.hand.values()){const p=t.getJointPose(M,n),m=this._getHandJoint(l,M);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.quaternion,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(nu)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new mt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const gc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qn={h:0,s:0,l:0},Is={h:0,s:0,l:0};function zr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ie{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=un){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ke.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Ke.workingColorSpace){if(e=Gh(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=zr(a,r,e+1/3),this.g=zr(a,r,e),this.b=zr(a,r,e-1/3)}return Ke.colorSpaceToWorking(this,i),this}setStyle(e,t=un){function n(r){r!==void 0&&parseFloat(r)<1&&Oe("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Oe("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Oe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=un){const n=gc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Oe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Hn(e.r),this.g=Hn(e.g),this.b=Hn(e.b),this}copyLinearToSRGB(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=un){return Ke.workingToColorSpace(Ht.copy(this),e),Math.round(qe(Ht.r*255,0,255))*65536+Math.round(qe(Ht.g*255,0,255))*256+Math.round(qe(Ht.b*255,0,255))}getHexString(e=un){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.workingToColorSpace(Ht.copy(this),t);const n=Ht.r,i=Ht.g,r=Ht.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Ke.workingColorSpace){return Ke.workingToColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=un){Ke.workingToColorSpace(Ht.copy(this),e);const t=Ht.r,n=Ht.g,i=Ht.b;return e!==un?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(qn),this.setHSL(qn.h+e,qn.s+t,qn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(qn),e.getHSL(Is);const n=Ir(qn.h,Is.h,t),i=Ir(qn.s,Is.s,t),r=Ir(qn.l,Is.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new Ie;Ie.NAMES=gc;class pr{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ie(e),this.near=t,this.far=n}clone(){return new pr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class iu extends Nt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new si,this.environmentIntensity=1,this.environmentRotation=new si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const mn=new D,Nn=new D,Gr=new D,Un=new D,bi=new D,Ti=new D,jo=new D,kr=new D,Hr=new D,Vr=new D,Wr=new gt,Xr=new gt,qr=new gt;class Mn{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),mn.subVectors(e,t),i.cross(mn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){mn.subVectors(i,t),Nn.subVectors(n,t),Gr.subVectors(e,t);const a=mn.dot(mn),o=mn.dot(Nn),c=mn.dot(Gr),l=Nn.dot(Nn),h=Nn.dot(Gr),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,g=(a*h-o*c)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(e,t,n,i,r,a,o,c){return this.getBarycoord(e,t,n,i,Un)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Un.x),c.addScaledVector(a,Un.y),c.addScaledVector(o,Un.z),c)}static getInterpolatedAttribute(e,t,n,i,r,a){return Wr.setScalar(0),Xr.setScalar(0),qr.setScalar(0),Wr.fromBufferAttribute(e,t),Xr.fromBufferAttribute(e,n),qr.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Wr,r.x),a.addScaledVector(Xr,r.y),a.addScaledVector(qr,r.z),a}static isFrontFacing(e,t,n,i){return mn.subVectors(n,t),Nn.subVectors(e,t),mn.cross(Nn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return mn.subVectors(this.c,this.b),Nn.subVectors(this.a,this.b),mn.cross(Nn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Mn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Mn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return Mn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Mn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Mn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;bi.subVectors(i,n),Ti.subVectors(r,n),kr.subVectors(e,n);const c=bi.dot(kr),l=Ti.dot(kr);if(c<=0&&l<=0)return t.copy(n);Hr.subVectors(e,i);const h=bi.dot(Hr),u=Ti.dot(Hr);if(h>=0&&u<=h)return t.copy(i);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0&&c-h>0)return a=c/(c-h),t.copy(n).addScaledVector(bi,a);Vr.subVectors(e,r);const f=bi.dot(Vr),g=Ti.dot(Vr);if(g>=0&&f<=g)return t.copy(r);const M=f*l-c*g;if(M<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(Ti,o);const p=h*g-f*u;if(p<=0&&u-h>=0&&f-g>=0)return jo.subVectors(r,i),o=(u-h)/(u-h+(f-g)),t.copy(i).addScaledVector(jo,o);const m=1/(p+M+d);return a=M*m,o=d*m,t.copy(n).addScaledVector(bi,a).addScaledVector(Ti,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class vi{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(gn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(gn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=gn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,gn):gn.fromBufferAttribute(r,a),gn.applyMatrix4(e.matrixWorld),this.expandByPoint(gn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ds.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ds.copy(n.boundingBox)),Ds.applyMatrix4(e.matrixWorld),this.union(Ds)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,gn),gn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Zi),Ns.subVectors(this.max,Zi),Ai.subVectors(e.a,Zi),Ri.subVectors(e.b,Zi),Ci.subVectors(e.c,Zi),Yn.subVectors(Ri,Ai),$n.subVectors(Ci,Ri),li.subVectors(Ai,Ci);let t=[0,-Yn.z,Yn.y,0,-$n.z,$n.y,0,-li.z,li.y,Yn.z,0,-Yn.x,$n.z,0,-$n.x,li.z,0,-li.x,-Yn.y,Yn.x,0,-$n.y,$n.x,0,-li.y,li.x,0];return!Yr(t,Ai,Ri,Ci,Ns)||(t=[1,0,0,0,1,0,0,0,1],!Yr(t,Ai,Ri,Ci,Ns))?!1:(Us.crossVectors(Yn,$n),t=[Us.x,Us.y,Us.z],Yr(t,Ai,Ri,Ci,Ns))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,gn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(gn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Fn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Fn=[new D,new D,new D,new D,new D,new D,new D,new D],gn=new D,Ds=new vi,Ai=new D,Ri=new D,Ci=new D,Yn=new D,$n=new D,li=new D,Zi=new D,Ns=new D,Us=new D,ci=new D;function Yr(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){ci.fromArray(s,r);const o=i.x*Math.abs(ci.x)+i.y*Math.abs(ci.y)+i.z*Math.abs(ci.z),c=e.dot(ci),l=t.dot(ci),h=n.dot(ci);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Et=new D,Fs=new ye;let su=0;class ni extends _i{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:su++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Uh,this.updateRanges=[],this.gpuType=Sn,this.version=0,this._normalizationScale=e!==void 0?oo(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Fs.fromBufferAttribute(this,t),Fs.applyMatrix3(e),this.setXY(t,Fs.x,Fs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix3(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix4(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyNormalMatrix(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.transformDirection(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),i=this._normalize(i),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Hh(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Vh(e,this.array)}}class _c extends ni{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class xc extends ni{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Xe extends ni{constructor(e,t,n){super(new Float32Array(e),t,n)}}const ru=new vi,Ki=new D,$r=new D;class Ms{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):ru.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ki.subVectors(e,this.center);const t=Ki.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ki,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($r.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ki.copy(e.center).add($r)),this.expandByPoint(Ki.copy(e.center).sub($r))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let au=0;const cn=new st,Jr=new Nt,Pi=new D,jt=new vi,Qi=new vi,Dt=new D;class Ut extends _i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:au++}),this.uuid=Xi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Fh(e)?xc:_c)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ze().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return cn.makeRotationFromQuaternion(e),this.applyMatrix4(cn),this}rotateX(e){return cn.makeRotationX(e),this.applyMatrix4(cn),this}rotateY(e){return cn.makeRotationY(e),this.applyMatrix4(cn),this}rotateZ(e){return cn.makeRotationZ(e),this.applyMatrix4(cn),this}translate(e,t,n){return cn.makeTranslation(e,t,n),this.applyMatrix4(cn),this}scale(e,t,n){return cn.makeScale(e,t,n),this.applyMatrix4(cn),this}lookAt(e){return Jr.lookAt(e),Jr.updateMatrix(),this.applyMatrix4(Jr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pi).negate(),this.translate(Pi.x,Pi.y,Pi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Xe(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&Oe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new vi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];jt.setFromBufferAttribute(r),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,jt.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,jt.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(jt.min),this.boundingBox.expandByPoint(jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ms);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(jt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Qi.setFromBufferAttribute(o),this.morphTargetsRelative?(Dt.addVectors(jt.min,Qi.min),jt.expandByPoint(Dt),Dt.addVectors(jt.max,Qi.max),jt.expandByPoint(Dt)):(jt.expandByPoint(Qi.min),jt.expandByPoint(Qi.max))}jt.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Dt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Dt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Dt.fromBufferAttribute(o,l),c&&(Pi.fromBufferAttribute(e,l),Dt.add(Pi)),i=Math.max(i,n.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new ni(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],c=[],l=new Uint8Array(n.count);for(let L=0;L<n.count;L++)o[L]=new D,c[L]=new D;const h=new D,u=new D,d=new D,f=new ye,g=new ye,M=new ye,p=new D,m=new D;function x(L,C,N){l[L]=l[C]=l[N]=1,h.fromBufferAttribute(n,L),u.fromBufferAttribute(n,C),d.fromBufferAttribute(n,N),f.fromBufferAttribute(r,L),g.fromBufferAttribute(r,C),M.fromBufferAttribute(r,N),u.sub(h),d.sub(h),g.sub(f),M.sub(f);const O=1/(g.x*M.y-M.x*g.y);isFinite(O)&&(p.copy(u).multiplyScalar(M.y).addScaledVector(d,-g.y).multiplyScalar(O),m.copy(d).multiplyScalar(g.x).addScaledVector(u,-M.x).multiplyScalar(O),o[L].add(p),o[C].add(p),o[N].add(p),c[L].add(m),c[C].add(m),c[N].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let L=0,C=w.length;L<C;++L){const N=w[L],O=N.start,X=N.count;for(let R=O,B=O+X;R<B;R+=3)x(e.getX(R+0),e.getX(R+1),e.getX(R+2))}const v=new D,T=new D,b=new D,_=new D;function E(L){b.fromBufferAttribute(i,L),_.copy(b);const C=o[L];v.copy(C),v.sub(b.multiplyScalar(b.dot(C))).normalize(),T.crossVectors(_,C);const O=T.dot(c[L])<0?-1:1;a.setXYZW(L,v.x,v.y,v.z,O)}for(let L=0,C=n.count;L<C;++L)l[L]&&E(L);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new ni(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new D,r=new D,a=new D,o=new D,c=new D,l=new D,h=new D,u=new D;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),M=e.getX(d+1),p=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,p),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,M),l.fromBufferAttribute(n,p),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(M,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let M=0,p=c.length;M<p;M++){o.isInterleavedBufferAttribute?f=c[M]*o.data.stride+o.offset:f=c[M]*h;for(let m=0;m<h;m++)d[g++]=l[f++]}return new ni(d,h,u)}if(this.index===null)return Oe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ut,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(i[c]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zr=new D,ou=new D,lu=new ze;class Kn{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Zr.subVectors(n,t).cross(ou.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(Zr),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||lu.getNormalMatrix(e),i=this.coplanarPoint(Zr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let cu=0;class Ss extends _i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cu++}),this.uuid=Xi(),this.name="",this.type="Material",this.blending=os,this.side=fi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$l,this.blendDst=Jl,this.blendEquation=Ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ie(0,0,0),this.blendAlpha=0,this.depthFunc=ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ch,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pr,this.stencilZFail=Pr,this.stencilZPass=Pr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Oe(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Oe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ie().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Kn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ye().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ye().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const On=new D,Kr=new D,Os=new D,Bs=new D;class vc{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,On)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=On.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(On.copy(this.origin).addScaledVector(this.direction,t),On.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Kr.copy(e).add(t).multiplyScalar(.5),Os.copy(t).sub(e).normalize(),Bs.copy(this.origin).sub(Kr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Os),o=Bs.dot(this.direction),c=-Bs.dot(Os),l=Bs.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*c-o,d=a*o-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const M=1/h;u*=M,d*=M,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Kr).addScaledVector(Os,d),f}intersectSphere(e,t){if(e.radius<0)return null;On.subVectors(e.center,this.origin);const n=On.dot(this.direction),i=On.dot(On)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,i=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,i=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,On)!==null}intersectTriangle(e,t,n,i,r){const a=this.origin,o=this.direction,c=o.x,l=o.y,h=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,g=t.x-a.x,M=t.y-a.y,p=t.z-a.z,m=n.x-a.x,x=n.y-a.y,w=n.z-a.z,v=Math.abs(c),T=Math.abs(l),b=Math.abs(h);let _,E,L,C,N,O,X,R,B,V,z,ie;if(v>=T&&v>=b?(L=c,O=u,B=g,ie=m,c>=0?(_=l,E=h,C=d,N=f,X=M,R=p,V=x,z=w):(_=h,E=l,C=f,N=d,X=p,R=M,V=w,z=x)):T>=b?(L=l,O=d,B=M,ie=x,l>=0?(_=h,E=c,C=f,N=u,X=p,R=g,V=w,z=m):(_=c,E=h,C=u,N=f,X=g,R=p,V=m,z=w)):(L=h,O=f,B=p,ie=w,h>=0?(_=c,E=l,C=u,N=d,X=g,R=M,V=m,z=x):(_=l,E=c,C=d,N=u,X=M,R=g,V=x,z=m)),L===0)return null;const q=_/L,j=E/L,ne=1/L,we=C-q*O,Ue=N-j*O,Z=X-q*B,ve=R-j*B,be=V-q*ie,De=z-j*ie,Me=be*ve-De*Z,ke=we*De-Ue*be,Mt=Z*Ue-ve*we;if(i){if(Me<0||ke<0||Mt<0)return null}else if((Me<0||ke<0||Mt<0)&&(Me>0||ke>0||Mt>0))return null;const Fe=Me+ke+Mt;if(Fe===0)return null;const tt=ne*(Me*O+ke*B+Mt*ie);return(Fe>0?tt<0:tt>0)?null:this.at(tt/Fe,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class lt extends Ss{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.combine=Zl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const el=new st,hi=new vc,zs=new Ms,tl=new D,Gs=new D,ks=new D,Hs=new D,Qr=new D,Vs=new D,nl=new D,Ws=new D;class F extends Nt{constructor(e=new Ut,t=new lt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){Vs.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(Qr.fromBufferAttribute(u,e),a?Vs.addScaledVector(Qr,h):Vs.addScaledVector(Qr.sub(t),h))}t.add(Vs)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zs.copy(n.boundingSphere),zs.applyMatrix4(r),hi.copy(e.ray).recast(e.near),!(zs.containsPoint(hi.origin)===!1&&(hi.intersectSphere(zs,tl)===null||hi.origin.distanceToSquared(tl)>(e.far-e.near)**2))&&(el.copy(r).invert(),hi.copy(e.ray).applyMatrix4(el),!(n.boundingBox!==null&&hi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,hi)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,M=d.length;g<M;g++){const p=d[g],m=a[p.materialIndex],x=Math.max(p.start,f.start),w=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let v=x,T=w;v<T;v+=3){const b=o.getX(v),_=o.getX(v+1),E=o.getX(v+2);i=Xs(this,m,e,n,l,h,u,b,_,E),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),M=Math.min(o.count,f.start+f.count);for(let p=g,m=M;p<m;p+=3){const x=o.getX(p),w=o.getX(p+1),v=o.getX(p+2);i=Xs(this,a,e,n,l,h,u,x,w,v),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,M=d.length;g<M;g++){const p=d[g],m=a[p.materialIndex],x=Math.max(p.start,f.start),w=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let v=x,T=w;v<T;v+=3){const b=v,_=v+1,E=v+2;i=Xs(this,m,e,n,l,h,u,b,_,E),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),M=Math.min(c.count,f.start+f.count);for(let p=g,m=M;p<m;p+=3){const x=p,w=p+1,v=p+2;i=Xs(this,a,e,n,l,h,u,x,w,v),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function hu(s,e,t,n,i,r,a,o){let c;if(e.side===Kt?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,e.side===fi,o),c===null)return null;Ws.copy(o),Ws.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(Ws);return l<t.near||l>t.far?null:{distance:l,point:Ws.clone(),object:s}}function Xs(s,e,t,n,i,r,a,o,c,l){s.getVertexPosition(o,Gs),s.getVertexPosition(c,ks),s.getVertexPosition(l,Hs);const h=hu(s,e,t,n,Gs,ks,Hs,nl);if(h){const u=new D;Mn.getBarycoord(nl,Gs,ks,Hs,u),i&&(h.uv=Mn.getInterpolatedAttribute(i,o,c,l,u,new ye)),r&&(h.uv1=Mn.getInterpolatedAttribute(r,o,c,l,u,new ye)),a&&(h.normal=Mn.getInterpolatedAttribute(a,o,c,l,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new D,materialIndex:0};Mn.getNormal(Gs,ks,Hs,d.normal),h.face=d,h.barycoord=u}return h}class Mc extends Xt{constructor(e=null,t=1,n=1,i,r,a,o,c,l=Bt,h=Bt,u,d){super(null,a,o,c,l,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class il extends ni{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Li=new st,sl=new st,qs=[],rl=new vi,uu=new st,ji=new F,es=new Ms;class Bn extends F{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new il(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,uu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new vi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Li),rl.copy(e.boundingBox).applyMatrix4(Li),this.boundingBox.union(rl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ms),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Li),es.copy(e.boundingSphere).applyMatrix4(Li),this.boundingSphere.union(es)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(ji.geometry=this.geometry,ji.material=this.material,ji.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),es.copy(this.boundingSphere),es.applyMatrix4(n),e.ray.intersectsSphere(es)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Li),sl.multiplyMatrices(n,Li),ji.matrixWorld=sl,ji.raycast(e,qs);for(let a=0,o=qs.length;a<o;a++){const c=qs[a];c.instanceId=r,c.object=this,t.push(c)}qs.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new il(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Mc(new Float32Array(i*this.count),i,this.count,io,Sn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=i*e;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ui=new Ms,du=new ye(.5,.5),Ys=new D;class gs{constructor(e=new Kn,t=new Kn,n=new Kn,i=new Kn,r=new Kn,a=new Kn){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=yn,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],M=r[9],p=r[10],m=r[11],x=r[12],w=r[13],v=r[14],T=r[15];if(i[0].setComponents(l-a,f-h,m-g,T-x).normalize(),i[1].setComponents(l+a,f+h,m+g,T+x).normalize(),i[2].setComponents(l+o,f+u,m+M,T+w).normalize(),i[3].setComponents(l-o,f-u,m-M,T-w).normalize(),n)i[4].setComponents(c,d,p,v).normalize(),i[5].setComponents(l-c,f-d,m-p,T-v).normalize();else if(i[4].setComponents(l-c,f-d,m-p,T-v).normalize(),t===yn)i[5].setComponents(l+c,f+d,m+p,T+v).normalize();else if(t===ms)i[5].setComponents(c,d,p,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(e){ui.center.set(0,0,0);const t=du.distanceTo(e.center);return ui.radius=.7071067811865476+t,ui.applyMatrix4(e.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Ys.x=i.normal.x>0?e.max.x:e.min.x,Ys.y=i.normal.y>0?e.max.y:e.min.y,Ys.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ys)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const al=new st;class ho{constructor(){this.coordinateSystem=yn,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,n=this._frustums;for(let i=0;i<t.length;i++){const r=t[i];al.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[i]===void 0&&(n[i]=new gs),n[i].setFromProjectionMatrix(al,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,n=e._frustums;for(let i=0;i<e._count;i++)t[i]===void 0&&(t[i]=new gs),t[i].copy(n[i]);return this._count=e._count,this}clone(){return new ho().copy(this)}}class Sc extends Xt{constructor(e=[],t=Gi,n,i,r,a,o,c,l,h){super(e,t,n,i,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class fu extends Xt{constructor(e,t,n,i,r,a,o,c,l){super(e,t,n,i,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Hi extends Xt{constructor(e,t,n=Cn,i,r,a,o=Bt,c=Bt,l,h=ii,u=1){if(h!==ii&&h!==ei)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,i,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new lo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class yc extends Hi{constructor(e,t=Cn,n=Gi,i,r,a=Bt,o=Bt,c,l=ii){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,r,a,o,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class wc extends Xt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ge extends Ut{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new Xe(l,3)),this.setAttribute("normal",new Xe(h,3)),this.setAttribute("uv",new Xe(u,2));function g(M,p,m,x,w,v,T,b,_,E,L){const C=v/_,N=T/E,O=v/2,X=T/2,R=b/2,B=_+1,V=E+1;let z=0,ie=0;const q=new D;for(let j=0;j<V;j++){const ne=j*N-X;for(let we=0;we<B;we++){const Ue=we*C-O;q[M]=Ue*x,q[p]=ne*w,q[m]=R,l.push(q.x,q.y,q.z),q[M]=0,q[p]=0,q[m]=b>0?1:-1,h.push(q.x,q.y,q.z),u.push(we/_),u.push(1-j/E),z+=1}}for(let j=0;j<E;j++)for(let ne=0;ne<_;ne++){const we=d+ne+B*j,Ue=d+ne+B*(j+1),Z=d+(ne+1)+B*(j+1),ve=d+(ne+1)+B*j;c.push(we,Ue,ve),c.push(Ue,Z,ve),ie+=6}o.addGroup(f,ie,L),f+=ie,d+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ge(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Oi extends Ut{constructor(e=1,t=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:i,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const a=[],o=[],c=[],l=[],h=t/2,u=Math.PI/2*e,d=t,f=2*u+d,g=n*2+r,M=i+1,p=new D,m=new D;for(let x=0;x<=g;x++){let w=0,v=0,T=0,b=0;if(x<=n){const L=x/n,C=L*Math.PI/2;v=-h-e*Math.cos(C),T=e*Math.sin(C),b=-e*Math.cos(C),w=L*u}else if(x<=n+r){const L=(x-n)/r;v=-h+L*t,T=e,b=0,w=u+L*d}else{const L=(x-n-r)/n,C=L*Math.PI/2;v=h+e*Math.sin(C),T=e*Math.cos(C),b=e*Math.sin(C),w=u+d+L*u}const _=Math.max(0,Math.min(1,w/f));let E=0;x===0?E=.5/i:x===g&&(E=-.5/i);for(let L=0;L<=i;L++){const C=L/i,N=C*Math.PI*2,O=Math.sin(N),X=Math.cos(N);m.x=-T*X,m.y=v,m.z=T*O,o.push(m.x,m.y,m.z),p.set(-T*X,b,T*O),p.normalize(),c.push(p.x,p.y,p.z),l.push(C+E,_)}if(x>0){const L=(x-1)*M;for(let C=0;C<i;C++){const N=L+C,O=L+C+1,X=x*M+C,R=x*M+C+1;a.push(N,O,X),a.push(O,R,X)}}}this.setIndex(a),this.setAttribute("position",new Xe(o,3)),this.setAttribute("normal",new Xe(c,3)),this.setAttribute("uv",new Xe(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Oi(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class mr extends Ut{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new D,h=new ye;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=n+u/t*i;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Xe(a,3)),this.setAttribute("normal",new Xe(o,3)),this.setAttribute("uv",new Xe(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mr(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Re extends Ut{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const M=[],p=n/2;let m=0;x(),a===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new Xe(u,3)),this.setAttribute("normal",new Xe(d,3)),this.setAttribute("uv",new Xe(f,2));function x(){const v=new D,T=new D;let b=0;const _=(t-e)/n;for(let E=0;E<=r;E++){const L=[],C=E/r,N=C*(t-e)+e;for(let O=0;O<=i;O++){const X=O/i,R=X*c+o,B=Math.sin(R),V=Math.cos(R);T.x=N*B,T.y=-C*n+p,T.z=N*V,u.push(T.x,T.y,T.z),v.set(B,_,V).normalize(),d.push(v.x,v.y,v.z),f.push(X,1-C),L.push(g++)}M.push(L)}for(let E=0;E<i;E++)for(let L=0;L<r;L++){const C=M[L][E],N=M[L+1][E],O=M[L+1][E+1],X=M[L][E+1];(e>0||L!==0)&&(h.push(C,N,X),b+=3),(t>0||L!==r-1)&&(h.push(N,O,X),b+=3)}l.addGroup(m,b,0),m+=b}function w(v){const T=g,b=new ye,_=new D;let E=0;const L=v===!0?e:t,C=v===!0?1:-1;for(let O=1;O<=i;O++)u.push(0,p*C,0),d.push(0,C,0),f.push(.5,.5),g++;const N=g;for(let O=0;O<=i;O++){const R=O/i*c+o,B=Math.cos(R),V=Math.sin(R);_.x=L*V,_.y=p*C,_.z=L*B,u.push(_.x,_.y,_.z),d.push(0,C,0),b.x=B*.5+.5,b.y=V*.5*C+.5,f.push(b.x,b.y),g++}for(let O=0;O<i;O++){const X=T+O,R=N+O;v===!0?h.push(R,R+1,X):h.push(R+1,R,X),E+=3}l.addGroup(m,E,v===!0?1:2),m+=E}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Re(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Vt extends Re{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Vt(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ys extends Ut{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),l(n),h(),this.setAttribute("position",new Xe(r,3)),this.setAttribute("normal",new Xe(r.slice(),3)),this.setAttribute("uv",new Xe(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const w=new D,v=new D,T=new D;for(let b=0;b<t.length;b+=3)f(t[b+0],w),f(t[b+1],v),f(t[b+2],T),c(w,v,T,x)}function c(x,w,v,T){const b=T+1,_=[];for(let E=0;E<=b;E++){_[E]=[];const L=x.clone().lerp(v,E/b),C=w.clone().lerp(v,E/b),N=b-E;for(let O=0;O<=N;O++)O===0&&E===b?_[E][O]=L:_[E][O]=L.clone().lerp(C,O/N)}for(let E=0;E<b;E++)for(let L=0;L<2*(b-E)-1;L++){const C=Math.floor(L/2);L%2===0?(d(_[E][C+1]),d(_[E+1][C]),d(_[E][C])):(d(_[E][C+1]),d(_[E+1][C+1]),d(_[E+1][C]))}}function l(x){const w=new D;for(let v=0;v<r.length;v+=3)w.x=r[v+0],w.y=r[v+1],w.z=r[v+2],w.normalize().multiplyScalar(x),r[v+0]=w.x,r[v+1]=w.y,r[v+2]=w.z}function h(){const x=new D;for(let w=0;w<r.length;w+=3){x.x=r[w+0],x.y=r[w+1],x.z=r[w+2];const v=p(x)/2/Math.PI+.5,T=m(x)/Math.PI+.5;a.push(v,1-T)}g(),u()}function u(){for(let x=0;x<a.length;x+=6){const w=a[x+0],v=a[x+2],T=a[x+4],b=Math.max(w,v,T),_=Math.min(w,v,T);b>.9&&_<.1&&(w<.2&&(a[x+0]+=1),v<.2&&(a[x+2]+=1),T<.2&&(a[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function f(x,w){const v=x*3;w.x=e[v+0],w.y=e[v+1],w.z=e[v+2]}function g(){const x=new D,w=new D,v=new D,T=new D,b=new ye,_=new ye,E=new ye;for(let L=0,C=0;L<r.length;L+=9,C+=6){x.set(r[L+0],r[L+1],r[L+2]),w.set(r[L+3],r[L+4],r[L+5]),v.set(r[L+6],r[L+7],r[L+8]),b.set(a[C+0],a[C+1]),_.set(a[C+2],a[C+3]),E.set(a[C+4],a[C+5]),T.copy(x).add(w).add(v).divideScalar(3);const N=p(T);M(b,C+0,x,N),M(_,C+2,w,N),M(E,C+4,v,N)}}function M(x,w,v,T){T<0&&x.x===1&&(a[w]=x.x-1),v.x===0&&v.z===0&&(a[w]=T/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ys(e.vertices,e.indices,e.radius,e.detail)}}class vn extends ys{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new vn(e.radius,e.detail)}}class Ln{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Oe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(i=Math.floor(o+(c-o)/2),l=n[i]-a,l<0)o=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===a)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),c=t||(a.isVector2?new ye:new D);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new D,i=[],r=[],a=[],o=new D,c=new st;for(let f=0;f<=e;f++){const g=f/e;i[f]=this.getTangentAt(g,new D)}r[0]=new D,a[0]=new D;let l=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(qe(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(qe(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(i[g],f*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}}class uo extends Ln{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new ye){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class pu extends uo{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function fo(){let s=0,e=0,t=0,n=0;function i(r,a,o,c){s=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){i(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const ol=new D,ll=new D,jr=new fo,ea=new fo,ta=new fo;class Ec extends Ln{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new D){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=i[(o-1)%r]:(ll.subVectors(i[0],i[1]).add(i[0]),l=ll);const u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(ol.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=ol),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),M=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(h),f);M<1e-4&&(M=1),g<1e-4&&(g=M),p<1e-4&&(p=M),jr.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,M,p),ea.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,M,p),ta.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,M,p)}else this.curveType==="catmullrom"&&(jr.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),ea.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),ta.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(jr.calc(c),ea.calc(c),ta.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new D().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function cl(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,c=s*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*s+t}function mu(s,e){const t=1-s;return t*t*e}function gu(s,e){return 2*(1-s)*s*e}function _u(s,e){return s*s*e}function ls(s,e,t,n){return mu(s,e)+gu(s,t)+_u(s,n)}function xu(s,e){const t=1-s;return t*t*t*e}function vu(s,e){const t=1-s;return 3*t*t*s*e}function Mu(s,e){return 3*(1-s)*s*s*e}function Su(s,e){return s*s*s*e}function cs(s,e,t,n,i){return xu(s,e)+vu(s,t)+Mu(s,n)+Su(s,i)}class bc extends Ln{constructor(e=new ye,t=new ye,n=new ye,i=new ye){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new ye){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(cs(e,i.x,r.x,a.x,o.x),cs(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class yu extends Ln{constructor(e=new D,t=new D,n=new D,i=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new D){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(cs(e,i.x,r.x,a.x,o.x),cs(e,i.y,r.y,a.y,o.y),cs(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Tc extends Ln{constructor(e=new ye,t=new ye){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ye){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ye){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class wu extends Ln{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ac extends Ln{constructor(e=new ye,t=new ye,n=new ye){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ye){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(ls(e,i.x,r.x,a.x),ls(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Rc extends Ln{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(ls(e,i.x,r.x,a.x),ls(e,i.y,r.y,a.y),ls(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Cc extends Ln{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ye){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,c=i[a===0?a:a-1],l=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(cl(o,c.x,l.x,h.x,u.x),cl(o,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new ye().fromArray(i))}return this}}var qa=Object.freeze({__proto__:null,ArcCurve:pu,CatmullRomCurve3:Ec,CubicBezierCurve:bc,CubicBezierCurve3:yu,EllipseCurve:uo,LineCurve:Tc,LineCurve3:wu,QuadraticBezierCurve:Ac,QuadraticBezierCurve3:Rc,SplineCurve:Cc});class Eu extends Ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new qa[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new qa[i.type]().fromJSON(i))}return this.cacheLengths=null,this}}class hl extends Eu{constructor(e){super(),this.type="Path",this.currentPoint=new ye,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Tc(this.currentPoint.clone(),new ye(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new Ac(this.currentPoint.clone(),new ye(e,t),new ye(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new bc(this.currentPoint.clone(),new ye(e,t),new ye(n,i),new ye(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Cc(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,i,r,a,o,c),this}absellipse(e,t,n,i,r,a,o,c){const l=new uo(e,t,n,i,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Pc extends hl{constructor(e){super(e),this.uuid=Xi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new hl().fromJSON(i))}return this}}function bu(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=Lc(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Pu(s,e,r,t)),s.length>80*t){o=s[0],c=s[1];let h=o,u=c;for(let d=t;d<i;d+=t){const f=s[d],g=s[d+1];f<o&&(o=f),g<c&&(c=g),f>h&&(h=f),g>u&&(u=g)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return _s(r,a,t,o,c,l,0),a}function Lc(s,e,t,n,i){let r;if(i===ku(s,e,t,n)>0)for(let a=e;a<t;a+=n)r=ul(a/n|0,s[a],s[a+1],r);else for(let a=t-n;a>=e;a-=n)r=ul(a/n|0,s[a],s[a+1],r);return r&&Vi(r,r.next)&&(vs(r),r=r.next),r}function mi(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(Vi(t,t.next)||_t(t.prev,t,t.next)===0)){if(vs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function _s(s,e,t,n,i,r,a){if(!s)return;!a&&r&&Uu(s,n,i,r);let o=s;for(;s.prev!==s.next;){const c=s.prev,l=s.next;if(r?Au(s,n,i,r):Tu(s)){e.push(c.i,s.i,l.i),vs(s),s=l.next,o=l.next;continue}if(s=l,s===o){a?a===1?(s=Ru(mi(s),e),_s(s,e,t,n,i,r,2)):a===2&&Cu(s,e,t,n,i,r):_s(mi(s),e,t,n,i,r,1);break}}}function Tu(s){const e=s.prev,t=s,n=s.next;if(_t(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=Math.min(i,r,a),u=Math.min(o,c,l),d=Math.max(i,r,a),f=Math.max(o,c,l);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&ss(i,o,r,c,a,l,g.x,g.y)&&_t(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Au(s,e,t,n){const i=s.prev,r=s,a=s.next;if(_t(i,r,a)>=0)return!1;const o=i.x,c=r.x,l=a.x,h=i.y,u=r.y,d=a.y,f=Math.min(o,c,l),g=Math.min(h,u,d),M=Math.max(o,c,l),p=Math.max(h,u,d),m=Ya(f,g,e,t,n),x=Ya(M,p,e,t,n);let w=s.prevZ,v=s.nextZ;for(;w&&w.z>=m&&v&&v.z<=x;){if(w.x>=f&&w.x<=M&&w.y>=g&&w.y<=p&&w!==i&&w!==a&&ss(o,h,c,u,l,d,w.x,w.y)&&_t(w.prev,w,w.next)>=0||(w=w.prevZ,v.x>=f&&v.x<=M&&v.y>=g&&v.y<=p&&v!==i&&v!==a&&ss(o,h,c,u,l,d,v.x,v.y)&&_t(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;w&&w.z>=m;){if(w.x>=f&&w.x<=M&&w.y>=g&&w.y<=p&&w!==i&&w!==a&&ss(o,h,c,u,l,d,w.x,w.y)&&_t(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;v&&v.z<=x;){if(v.x>=f&&v.x<=M&&v.y>=g&&v.y<=p&&v!==i&&v!==a&&ss(o,h,c,u,l,d,v.x,v.y)&&_t(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Ru(s,e){let t=s;do{const n=t.prev,i=t.next.next;!Vi(n,i)&&Dc(n,t,t.next,i)&&xs(n,i)&&xs(i,n)&&(e.push(n.i,t.i,i.i),vs(t),vs(t.next),t=s=i),t=t.next}while(t!==s);return mi(t)}function Cu(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Bu(a,o)){let c=Nc(a,o);a=mi(a,a.next),c=mi(c,c.next),_s(a,e,t,n,i,r,0),_s(c,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function Pu(s,e,t,n){const i=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,c=r<a-1?e[r+1]*n:s.length,l=Lc(s,o,c,n,!1);l===l.next&&(l.steiner=!0),i.push(Ou(l))}i.sort(Lu);for(let r=0;r<i.length;r++)t=Iu(i[r],t);return t}function Lu(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function Iu(s,e){const t=Du(s,e);if(!t)return e;const n=Nc(t,s);return mi(n,n.next),mi(t,t.next)}function Du(s,e){let t=e;const n=s.x,i=s.y;let r=-1/0,a;if(Vi(s,t))return t;do{if(Vi(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Ic(i<l?n:r,i,c,l,i<l?r:n,i,t.x,t.y)){const u=Math.abs(i-t.y)/(n-t.x);xs(t,s)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Nu(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Nu(s,e){return _t(s.prev,s,e.prev)<0&&_t(e.next,s,s.next)<0}function Uu(s,e,t,n){let i=s;do i.z===0&&(i.z=Ya(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Fu(i)}function Fu(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,t*=2}while(e>1);return s}function Ya(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function Ou(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function Ic(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function ss(s,e,t,n,i,r,a,o){return!(s===a&&e===o)&&Ic(s,e,t,n,i,r,a,o)}function Bu(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!zu(s,e)&&(xs(s,e)&&xs(e,s)&&Gu(s,e)&&(_t(s.prev,s,e.prev)||_t(s,e.prev,e))||Vi(s,e)&&_t(s.prev,s,s.next)>0&&_t(e.prev,e,e.next)>0)}function _t(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Vi(s,e){return s.x===e.x&&s.y===e.y}function Dc(s,e,t,n){const i=Js(_t(s,e,t)),r=Js(_t(s,e,n)),a=Js(_t(t,n,s)),o=Js(_t(t,n,e));return!!(i!==r&&a!==o||i===0&&$s(s,t,e)||r===0&&$s(s,n,e)||a===0&&$s(t,s,n)||o===0&&$s(t,e,n))}function $s(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Js(s){return s>0?1:s<0?-1:0}function zu(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Dc(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function xs(s,e){return _t(s.prev,s,s.next)<0?_t(s,e,s.next)>=0&&_t(s,s.prev,e)>=0:_t(s,e,s.prev)<0||_t(s,s.next,e)<0}function Gu(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function Nc(s,e){const t=$a(s.i,s.x,s.y),n=$a(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function ul(s,e,t,n){const i=$a(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function vs(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function $a(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ku(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class Hu{static triangulate(e,t,n=2){return bu(e,t,n)}}class hs{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return hs.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];dl(e),fl(n,e);let a=e.length;t.forEach(dl);for(let c=0;c<t.length;c++)i.push(a),a+=t[c].length,fl(n,t[c]);const o=Hu.triangulate(n,i);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function dl(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function fl(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class po extends ys{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new po(e.radius,e.detail)}}class gr extends ys{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new gr(e.radius,e.detail)}}class ti extends Ut{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,u=e/o,d=t/c,f=[],g=[],M=[],p=[];for(let m=0;m<h;m++){const x=m*d-a;for(let w=0;w<l;w++){const v=w*u-r;g.push(v,-x,0),M.push(0,0,1),p.push(w/o),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let x=0;x<o;x++){const w=x+l*m,v=x+l*(m+1),T=x+1+l*(m+1),b=x+1+l*m;f.push(w,v,b),f.push(v,T,b)}this.setIndex(f),this.setAttribute("position",new Xe(g,3)),this.setAttribute("normal",new Xe(M,3)),this.setAttribute("uv",new Xe(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ti(e.width,e.height,e.widthSegments,e.heightSegments)}}class us extends Ut{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],c=[],l=[],h=[];let u=e;const d=(t-e)/i,f=new D,g=new ye;for(let M=0;M<=i;M++){for(let p=0;p<=n;p++){const m=r+p/n*a;f.x=u*Math.cos(m),f.y=u*Math.sin(m),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let M=0;M<i;M++){const p=M*(n+1);for(let m=0;m<n;m++){const x=m+p,w=x,v=x+n+1,T=x+n+2,b=x+1;o.push(w,v,b),o.push(v,T,b)}}this.setIndex(o),this.setAttribute("position",new Xe(c,3)),this.setAttribute("normal",new Xe(l,3)),this.setAttribute("uv",new Xe(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new us(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class _r extends Ut{constructor(e=new Pc([new ye(0,.5),new ye(-.5,-.5),new ye(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new Xe(i,3)),this.setAttribute("normal",new Xe(r,3)),this.setAttribute("uv",new Xe(a,2));function l(h){const u=i.length/3,d=h.extractPoints(t);let f=d.shape;const g=d.holes;hs.isClockWise(f)===!1&&(f=f.reverse());for(let p=0,m=g.length;p<m;p++){const x=g[p];hs.isClockWise(x)===!0&&(g[p]=x.reverse())}const M=hs.triangulateShape(f,g);for(let p=0,m=g.length;p<m;p++){const x=g[p];f=f.concat(x)}for(let p=0,m=f.length;p<m;p++){const x=f[p];i.push(x.x,x.y,0),r.push(0,0,1),a.push(x.x,x.y)}for(let p=0,m=M.length;p<m;p++){const x=M[p],w=x[0]+u,v=x[1]+u,T=x[2]+u;n.push(w,v,T),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Vu(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const a=t[e.shapes[i]];n.push(a)}return new _r(n,e.curveSegments)}}function Vu(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class Ze extends Ut{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new D,d=new D,f=[],g=[],M=[],p=[];for(let m=0;m<=n;m++){const x=[],w=m/n,v=a+w*o,T=e*Math.cos(v),b=Math.sqrt(e*e-T*T);let _=0;m===0&&a===0?_=.5/t:m===n&&c===Math.PI&&(_=-.5/t);for(let E=0;E<=t;E++){const L=E/t,C=i+L*r;u.x=-b*Math.cos(C),u.y=T,u.z=b*Math.sin(C),g.push(u.x,u.y,u.z),d.copy(u).normalize(),M.push(d.x,d.y,d.z),p.push(L+_,1-w),x.push(l++)}h.push(x)}for(let m=0;m<n;m++)for(let x=0;x<t;x++){const w=h[m][x+1],v=h[m][x],T=h[m+1][x],b=h[m+1][x+1];(m!==0||a>0)&&f.push(w,v,b),(m!==n-1||c<Math.PI)&&f.push(v,T,b)}this.setIndex(f),this.setAttribute("position",new Xe(g,3)),this.setAttribute("normal",new Xe(M,3)),this.setAttribute("uv",new Xe(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ze(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class hn extends Ut{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const c=[],l=[],h=[],u=[],d=new D,f=new D,g=new D;for(let M=0;M<=n;M++){const p=a+M/n*o;for(let m=0;m<=i;m++){const x=m/i*r;f.x=(e+t*Math.cos(p))*Math.cos(x),f.y=(e+t*Math.cos(p))*Math.sin(x),f.z=t*Math.sin(p),l.push(f.x,f.y,f.z),d.x=e*Math.cos(x),d.y=e*Math.sin(x),g.subVectors(f,d).normalize(),h.push(g.x,g.y,g.z),u.push(m/i),u.push(M/n)}}for(let M=1;M<=n;M++)for(let p=1;p<=i;p++){const m=(i+1)*M+p-1,x=(i+1)*(M-1)+p-1,w=(i+1)*(M-1)+p,v=(i+1)*M+p;c.push(m,x,v),c.push(x,w,v)}this.setIndex(c),this.setAttribute("position",new Xe(l,3)),this.setAttribute("normal",new Xe(h,3)),this.setAttribute("uv",new Xe(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hn(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}class xr extends Ut{constructor(e=new Rc(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:r};const a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new D,c=new D,l=new ye;let h=new D;const u=[],d=[],f=[],g=[];M(),this.setIndex(g),this.setAttribute("position",new Xe(u,3)),this.setAttribute("normal",new Xe(d,3)),this.setAttribute("uv",new Xe(f,2));function M(){for(let w=0;w<t;w++)p(w);p(r===!1?t:0),x(),m()}function p(w){h=e.getPointAt(w/t,h);const v=a.normals[w],T=a.binormals[w];for(let b=0;b<=i;b++){const _=b/i*Math.PI*2,E=Math.sin(_),L=-Math.cos(_);c.x=L*v.x+E*T.x,c.y=L*v.y+E*T.y,c.z=L*v.z+E*T.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function m(){for(let w=1;w<=t;w++)for(let v=1;v<=i;v++){const T=(i+1)*(w-1)+(v-1),b=(i+1)*w+(v-1),_=(i+1)*w+v,E=(i+1)*(w-1)+v;g.push(T,b,E),g.push(b,_,E)}}function x(){for(let w=0;w<=t;w++)for(let v=0;v<=i;v++)l.x=w/t,l.y=v/i,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new xr(new qa[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}function Wi(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];if(pl(i))i.isRenderTargetTexture?(Oe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(pl(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function $t(s){const e={};for(let t=0;t<s.length;t++){const n=Wi(s[t]);for(const i in n)e[i]=n[i]}return e}function pl(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Wu(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Uc(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}const Xu={clone:Wi,merge:$t};var qu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Yu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class gi extends Ss{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=qu,this.fragmentShader=Yu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wi(e.uniforms),this.uniformsGroups=Wu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Ie().setHex(i.value);break;case"v2":this.uniforms[n].value=new ye().fromArray(i.value);break;case"v3":this.uniforms[n].value=new D().fromArray(i.value);break;case"v4":this.uniforms[n].value=new gt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new ze().fromArray(i.value);break;case"m4":this.uniforms[n].value=new st().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class $u extends gi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ju extends Ss{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ie(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wa,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Zu extends Ss{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ah,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ku extends Ss{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class mo extends Nt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ie(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Qu extends mo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ie(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const na=new st,ml=new D,gl=new D;class Fc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.mapType=sn,this.map=null,this.mapPass=null,this.matrix=new st,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new gs,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new gt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;ml.setFromMatrixPosition(e.matrixWorld),t.position.copy(ml),gl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(gl),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){na.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(na,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,c=i?i.x/r.x:0,l=i?i.y/r.y:0;e.coordinateSystem===ms||e.reversedDepth?t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply(na)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Zs=new D,Ks=new xi,En=new D;class Oc extends Nt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=yn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Zs,Ks,En),En.x===1&&En.y===1&&En.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zs,Ks,En.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Zs,Ks,En),En.x===1&&En.y===1&&En.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zs,Ks,En.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Jn=new D,_l=new ye,xl=new ye;class dn extends Oc{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Xa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Lr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Xa*2*Math.atan(Math.tan(Lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Jn.x,Jn.y).multiplyScalar(-e/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jn.x,Jn.y).multiplyScalar(-e/Jn.z)}getViewSize(e,t){return this.getViewBounds(e,_l,xl),t.subVectors(xl,_l)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Lr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,t-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class ju extends Fc{constructor(){super(new dn(90,1,.5,500)),this.isPointLightShadow=!0}}class ed extends mo{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new ju}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Bc extends Oc{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class td extends Fc{constructor(){super(new Bc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class nd extends mo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.target=new Nt,this.shadow=new td}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const Ii=-90,Di=1;class Ja extends Nt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new dn(Ii,Di,e,t);i.layers=this.layers,this.add(i);const r=new dn(Ii,Di,e,t);r.layers=this.layers,this.add(r);const a=new dn(Ii,Di,e,t);a.layers=this.layers,this.add(a);const o=new dn(Ii,Di,e,t);o.layers=this.layers,this.add(o);const c=new dn(Ii,Di,e,t);c.layers=this.layers,this.add(c);const l=new dn(Ii,Di,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===yn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ms)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.mipmapsAutoUpdate=M,e.setRenderTarget(n,5,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class id extends dn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}const vl=new st;class sd{constructor(e,t,n=0,i=1/0){this.ray=new vc(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new co,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):je("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return vl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(vl),this}intersectObject(e,t=!0,n=[]){return Za(e,this,n,t),n.sort(Ml),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Za(e[i],this,n,t);return n.sort(Ml),n}}function Ml(s,e){return s.distance-e.distance}function Za(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)Za(r[a],e,t,!0)}}const So=class So{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};So.prototype.isMatrix2=!0;let Sl=So;function yl(s,e,t,n){const i=rd(n);switch(t){case cc:return s*e;case io:return s*e/i.components*i.byteLength;case so:return s*e/i.components*i.byteLength;case pi:return s*e*2/i.components*i.byteLength;case ro:return s*e*2/i.components*i.byteLength;case hc:return s*e*3/i.components*i.byteLength;case An:return s*e*4/i.components*i.byteLength;case ao:return s*e*4/i.components*i.byteLength;case nr:case ir:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case sr:case rr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ma:case _a:return Math.max(s,16)*Math.max(e,8)/4;case pa:case ga:return Math.max(s,8)*Math.max(e,8)/2;case xa:case va:case Sa:case ya:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Ma:case cr:case wa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ea:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ba:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Ta:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Aa:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Ra:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Ca:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Pa:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case La:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Ia:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Da:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Na:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Ua:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Fa:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Oa:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Ba:case za:case Ga:return Math.ceil(s/4)*Math.ceil(e/4)*16;case ka:case Ha:return Math.ceil(s/4)*Math.ceil(e/4)*8;case hr:case Va:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function rd(s){switch(s){case sn:case rc:return{byteLength:1,components:1};case ps:case ac:case Pn:return{byteLength:2,components:1};case to:case no:return{byteLength:2,components:4};case Cn:case eo:case Sn:return{byteLength:4,components:1};case oc:case lc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ja}}));typeof window<"u"&&(window.__THREE__?Oe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ja);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function zc(){let s=null,e=!1,t=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function ad(s){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(s.bindBuffer(l,o),u.length===0)s.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],M=u[f];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++d,u[d]=M)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const M=u[f];s.bufferSubData(l,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(s.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:r,update:a}}var od=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ld=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,cd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ud=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,pd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,md=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,gd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_d=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Md=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Sd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,yd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,wd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ed=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,bd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Td=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Ad=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Rd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Cd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Pd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ld=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Id=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Nd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ud=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Od=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Bd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,zd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Gd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,kd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Hd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Vd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,$d=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Kd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Qd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,jd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ef=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,rf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,af=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,of=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cf=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,hf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,uf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,df=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ff=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,_f=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sf=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ef=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Tf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Af=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Pf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Lf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,If=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Df=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Uf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ff=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Of=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Wf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Xf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,qf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Yf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$f=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Jf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Kf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ep=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,tp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,np=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ip=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,sp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ap=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const op=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hp=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,pp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,mp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,gp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,_p=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Mp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,yp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ep=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Tp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ap=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Rp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Cp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Pp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ip=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Np=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Up=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Fp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Op=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,We={alphahash_fragment:od,alphahash_pars_fragment:ld,alphamap_fragment:cd,alphamap_pars_fragment:hd,alphatest_fragment:ud,alphatest_pars_fragment:dd,aomap_fragment:fd,aomap_pars_fragment:pd,batching_pars_vertex:md,batching_vertex:gd,begin_vertex:_d,beginnormal_vertex:xd,bsdfs:vd,iridescence_fragment:Md,bumpmap_pars_fragment:Sd,clipping_planes_fragment:yd,clipping_planes_pars_fragment:wd,clipping_planes_pars_vertex:Ed,clipping_planes_vertex:bd,color_fragment:Td,color_pars_fragment:Ad,color_pars_vertex:Rd,color_vertex:Cd,common:Pd,defaultnormal_vertex:Ld,displacementmap_pars_vertex:Id,displacementmap_vertex:Dd,emissivemap_fragment:Nd,emissivemap_pars_fragment:Ud,colorspace_fragment:Fd,colorspace_pars_fragment:Od,envmap_fragment:Bd,envmap_common_pars_fragment:zd,envmap_pars_fragment:Gd,envmap_pars_vertex:kd,envmap_physical_pars_fragment:Qd,envmap_vertex:Hd,fog_vertex:Vd,fog_pars_vertex:Wd,fog_fragment:Xd,fog_pars_fragment:qd,gradientmap_pars_fragment:Yd,lightmap_pars_fragment:$d,lights_lambert_fragment:Jd,lights_lambert_pars_fragment:Zd,lights_pars_begin:Kd,lights_toon_fragment:jd,lights_toon_pars_fragment:ef,lights_phong_fragment:tf,lights_phong_pars_fragment:nf,lights_physical_fragment:sf,lights_physical_pars_fragment:rf,lights_fragment_begin:af,lights_fragment_maps:of,lights_fragment_end:lf,lightprobes_pars_fragment:cf,logdepthbuf_fragment:hf,logdepthbuf_pars_fragment:uf,logdepthbuf_pars_vertex:df,logdepthbuf_vertex:ff,map_fragment:pf,map_pars_fragment:mf,map_particle_fragment:gf,map_particle_pars_fragment:_f,metalnessmap_fragment:xf,metalnessmap_pars_fragment:vf,morphinstance_vertex:Mf,morphcolor_vertex:Sf,morphnormal_vertex:yf,morphtarget_pars_vertex:wf,morphtarget_vertex:Ef,normal_fragment_begin:bf,normal_fragment_maps:Tf,normal_pars_fragment:Af,normal_pars_vertex:Rf,normal_vertex:Cf,normalmap_pars_fragment:Pf,clearcoat_normal_fragment_begin:Lf,clearcoat_normal_fragment_maps:If,clearcoat_pars_fragment:Df,iridescence_pars_fragment:Nf,opaque_fragment:Uf,packing:Ff,premultiplied_alpha_fragment:Of,project_vertex:Bf,dithering_fragment:zf,dithering_pars_fragment:Gf,roughnessmap_fragment:kf,roughnessmap_pars_fragment:Hf,shadowmap_pars_fragment:Vf,shadowmap_pars_vertex:Wf,shadowmap_vertex:Xf,shadowmask_pars_fragment:qf,skinbase_vertex:Yf,skinning_pars_vertex:$f,skinning_vertex:Jf,skinnormal_vertex:Zf,specularmap_fragment:Kf,specularmap_pars_fragment:Qf,tonemapping_fragment:jf,tonemapping_pars_fragment:ep,transmission_fragment:tp,transmission_pars_fragment:np,uv_pars_fragment:ip,uv_pars_vertex:sp,uv_vertex:rp,worldpos_vertex:ap,background_vert:op,background_frag:lp,backgroundCube_vert:cp,backgroundCube_frag:hp,cube_vert:up,cube_frag:dp,depth_vert:fp,depth_frag:pp,distance_vert:mp,distance_frag:gp,equirect_vert:_p,equirect_frag:xp,linedashed_vert:vp,linedashed_frag:Mp,meshbasic_vert:Sp,meshbasic_frag:yp,meshlambert_vert:wp,meshlambert_frag:Ep,meshmatcap_vert:bp,meshmatcap_frag:Tp,meshnormal_vert:Ap,meshnormal_frag:Rp,meshphong_vert:Cp,meshphong_frag:Pp,meshphysical_vert:Lp,meshphysical_frag:Ip,meshtoon_vert:Dp,meshtoon_frag:Np,points_vert:Up,points_frag:Fp,shadow_vert:Op,shadow_frag:Bp,sprite_vert:zp,sprite_frag:Gp},xe={common:{diffuse:{value:new Ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Ie(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},Tn={basic:{uniforms:$t([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:$t([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Ie(0)},envMapIntensity:{value:1}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:$t([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Ie(0)},specular:{value:new Ie(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:$t([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new Ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:$t([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new Ie(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:$t([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:$t([xe.points,xe.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:$t([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:$t([xe.common,xe.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:$t([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:$t([xe.sprite,xe.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distance:{uniforms:$t([xe.common,xe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distance_vert,fragmentShader:We.distance_frag},shadow:{uniforms:$t([xe.lights,xe.fog,{color:{value:new Ie(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};Tn.physical={uniforms:$t([Tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new ze},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Ie(0)},specularColor:{value:new Ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};const Qs={r:0,b:0,g:0},kp=new st,Gc=new ze;Gc.set(-1,0,0,0,1,0,0,0,1);function Hp(s,e,t,n,i,r){const a=new Ie(0);let o=i===!0?0:1,c,l,h=null,u=0,d=null;function f(x){let w=x.isScene===!0?x.background:null;if(w&&w.isTexture){const v=x.backgroundBlurriness>0;w=e.get(w,v)}return w}function g(x){let w=!1;const v=f(x);v===null?p(a,o):v&&v.isColor&&(p(v,1),w=!0);const T=s.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function M(x,w){const v=f(w);v&&v.isCubeTexture?(l===void 0&&(l=new F(new ge(1,1,1),new gi({name:"BackgroundCubeMaterial",uniforms:Wi(Tn.backgroundCube.uniforms),vertexShader:Tn.backgroundCube.vertexShader,fragmentShader:Tn.backgroundCube.fragmentShader,side:Kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,b,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(kp.makeRotationFromEuler(w.backgroundRotation)).transpose(),v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Gc),l.material.toneMapped=Ke.getTransfer(v.colorSpace)!==it,(h!==v||u!==v.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new F(new ti(2,2),new gi({name:"BackgroundMaterial",uniforms:Wi(Tn.background.uniforms),vertexShader:Tn.background.vertexShader,fragmentShader:Tn.background.fragmentShader,side:fi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=Ke.getTransfer(v.colorSpace)!==it,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,w){x.getRGB(Qs,Uc(s)),t.buffers.color.setClear(Qs.r,Qs.g,Qs.b,w,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,w=1){a.set(x),o=w,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,p(a,o)},render:g,addToRenderList:M,dispose:m}}function Vp(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(N,O,X,R,B){let V=!1;const z=u(N,R,X,O);r!==z&&(r=z,l(r.object)),V=f(N,R,X,B),V&&g(N,R,X,B),B!==null&&e.update(B,s.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,v(N,O,X,R),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function c(){return s.createVertexArray()}function l(N){return s.bindVertexArray(N)}function h(N){return s.deleteVertexArray(N)}function u(N,O,X,R){const B=R.wireframe===!0;let V=n[O.id];V===void 0&&(V={},n[O.id]=V);const z=N.isInstancedMesh===!0?N.id:0;let ie=V[z];ie===void 0&&(ie={},V[z]=ie);let q=ie[X.id];q===void 0&&(q={},ie[X.id]=q);let j=q[B];return j===void 0&&(j=d(c()),q[B]=j),j}function d(N){const O=[],X=[],R=[];for(let B=0;B<t;B++)O[B]=0,X[B]=0,R[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:X,attributeDivisors:R,object:N,attributes:{},index:null}}function f(N,O,X,R){const B=r.attributes,V=O.attributes;let z=0;const ie=X.getAttributes();for(const q in ie)if(ie[q].location>=0){const ne=B[q];let we=V[q];if(we===void 0&&(q==="instanceMatrix"&&N.instanceMatrix&&(we=N.instanceMatrix),q==="instanceColor"&&N.instanceColor&&(we=N.instanceColor)),ne===void 0||ne.attribute!==we||we&&ne.data!==we.data)return!0;z++}return r.attributesNum!==z||r.index!==R}function g(N,O,X,R){const B={},V=O.attributes;let z=0;const ie=X.getAttributes();for(const q in ie)if(ie[q].location>=0){let ne=V[q];ne===void 0&&(q==="instanceMatrix"&&N.instanceMatrix&&(ne=N.instanceMatrix),q==="instanceColor"&&N.instanceColor&&(ne=N.instanceColor));const we={};we.attribute=ne,ne&&ne.data&&(we.data=ne.data),B[q]=we,z++}r.attributes=B,r.attributesNum=z,r.index=R}function M(){const N=r.newAttributes;for(let O=0,X=N.length;O<X;O++)N[O]=0}function p(N){m(N,0)}function m(N,O){const X=r.newAttributes,R=r.enabledAttributes,B=r.attributeDivisors;X[N]=1,R[N]===0&&(s.enableVertexAttribArray(N),R[N]=1),B[N]!==O&&(s.vertexAttribDivisor(N,O),B[N]=O)}function x(){const N=r.newAttributes,O=r.enabledAttributes;for(let X=0,R=O.length;X<R;X++)O[X]!==N[X]&&(s.disableVertexAttribArray(X),O[X]=0)}function w(N,O,X,R,B,V,z){z===!0?s.vertexAttribIPointer(N,O,X,B,V):s.vertexAttribPointer(N,O,X,R,B,V)}function v(N,O,X,R){M();const B=R.attributes,V=X.getAttributes(),z=O.defaultAttributeValues;for(const ie in V){const q=V[ie];if(q.location>=0){let j=B[ie];if(j===void 0&&(ie==="instanceMatrix"&&N.instanceMatrix&&(j=N.instanceMatrix),ie==="instanceColor"&&N.instanceColor&&(j=N.instanceColor)),j!==void 0){const ne=j.normalized,we=j.itemSize,Ue=e.get(j);if(Ue===void 0)continue;const Z=Ue.buffer,ve=Ue.type,be=Ue.bytesPerElement,De=ve===s.INT||ve===s.UNSIGNED_INT||j.gpuType===eo;if(j.isInterleavedBufferAttribute){const Me=j.data,ke=Me.isInterleavedBuffer===!0?Me.stride:Me.itemSize,Mt=j.offset;if(Me.isInstancedInterleavedBuffer||Me.isInstancedBufferAttribute){for(let Fe=0;Fe<q.locationSize;Fe++)m(q.location+Fe,Me.meshPerAttribute);N.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=Me.meshPerAttribute*Me.count)}else for(let Fe=0;Fe<q.locationSize;Fe++)p(q.location+Fe);s.bindBuffer(s.ARRAY_BUFFER,Z);for(let Fe=0;Fe<q.locationSize;Fe++)w(q.location+Fe,we/q.locationSize,ve,ne,ke*be,(Mt+we/q.locationSize*Fe)*be,De)}else{if(j.isInstancedBufferAttribute){for(let Me=0;Me<q.locationSize;Me++)m(q.location+Me,j.meshPerAttribute);N.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Me=0;Me<q.locationSize;Me++)p(q.location+Me);s.bindBuffer(s.ARRAY_BUFFER,Z);for(let Me=0;Me<q.locationSize;Me++)w(q.location+Me,we/q.locationSize,ve,ne,we*be,we/q.locationSize*Me*be,De)}}else if(z!==void 0){const ne=z[ie];if(ne!==void 0)switch(ne.length){case 2:s.vertexAttrib2fv(q.location,ne);break;case 3:s.vertexAttrib3fv(q.location,ne);break;case 4:s.vertexAttrib4fv(q.location,ne);break;default:s.vertexAttrib1fv(q.location,ne)}}}}x()}function T(){L();for(const N in n){const O=n[N];for(const X in O){const R=O[X];for(const B in R){const V=R[B];for(const z in V)h(V[z].object),delete V[z];delete R[B]}}delete n[N]}}function b(N){if(n[N.id]===void 0)return;const O=n[N.id];for(const X in O){const R=O[X];for(const B in R){const V=R[B];for(const z in V)h(V[z].object),delete V[z];delete R[B]}}delete n[N.id]}function _(N){for(const O in n){const X=n[O];for(const R in X){const B=X[R];if(B[N.id]===void 0)continue;const V=B[N.id];for(const z in V)h(V[z].object),delete V[z];delete B[N.id]}}}function E(N){for(const O in n){const X=n[O],R=N.isInstancedMesh===!0?N.id:0,B=X[R];if(B!==void 0){for(const V in B){const z=B[V];for(const ie in z)h(z[ie].object),delete z[ie];delete B[V]}delete X[R],Object.keys(X).length===0&&delete n[O]}}}function L(){C(),a=!0,r!==i&&(r=i,l(r.object))}function C(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:L,resetDefaultState:C,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfObject:E,releaseStatesOfProgram:_,initAttributes:M,enableAttribute:p,disableUnusedAttributes:x}}function Wp(s,e,t){let n;function i(c){n=c}function r(c,l){s.drawArrays(n,c,l),t.update(l,n,1)}function a(c,l,h){h!==0&&(s.drawArraysInstanced(n,c,l,h),t.update(l,n,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let d=0;for(let f=0;f<h;f++)d+=l[f];t.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Xp(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(_){return!(_!==An&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const E=_===Pn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==sn&&_!==Sn&&!E&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function c(_){if(_==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Oe("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&Oe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&Oe("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),w=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=s.getParameter(s.MAX_SAMPLES),b=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:x,maxVaryings:w,maxFragmentUniforms:v,maxSamples:T,samples:b}}function qp(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Kn,o=new ze,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,M=u.clipIntersection,p=u.clipShadows,m=s.get(u);if(!i||g===null||g.length===0||r&&!p)r?h(null):l();else{const x=r?0:n,w=x*4;let v=m.clippingState||null;c.value=v,v=h(g,d,w,f);for(let T=0;T!==w;++T)v[T]=t[T];m.clippingState=v,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const M=u!==null?u.length:0;let p=null;if(M!==0){if(p=c.value,g!==!0||p===null){const m=f+M*4,x=d.matrixWorldInverse;o.getNormalMatrix(x),(p===null||p.length<m)&&(p=new Float32Array(m));for(let w=0,v=f;w!==M;++w,v+=4)a.copy(u[w]).applyMatrix4(x,o),a.normal.toArray(p,v),p[v+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,p}}class go extends Rn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Sc(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ge(5,5,5),r=new gi({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Kt,blending:Bi});r.uniforms.tEquirect.value=t;const a=new F(i,r),o=t.minFilter;return t.minFilter===jn&&(t.minFilter=Zt),new Ja(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}const wl=256,Yp=3,$p=20,kc=256,Hc=16,Jp=3,Zp=new D,Kp=new Ie;class vr{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Ja(1,10,null),this._boxMesh=new F(new ge(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=Zp}=r,c=this._renderer;this._setSize(a);const l=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);const u=c.autoClear,d=c.autoClearColor,f=c.autoClearDepth,g=c.autoClearStencil,M=e.background;c.autoClear=!0,c.autoClearColor=!0,c.autoClearDepth=!0,c.autoClearStencil=!0,M===null&&(e.background=c.getClearColor(Kp));const p=new Ja(n,i,h);return p.position.copy(o),p.update(c,e),c.autoClear=u,c.autoClearColor=d,c.autoClearDepth=f,c.autoClearStencil=g,e.background=M,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(l,t)),this._applyPMREM(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(wl,kh(e))}_fromTexture(e,t){e.mapping===Gi||e.mapping===fs?this._setSize(e.image.length===0?wl:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){const e=this._cubeSize,t=El(e,!1,!1),n=Math.log2(e)-Yp;for(let i=0;i<=n;i++)t.texture.mipmaps.push({width:e>>i,height:e>>i});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=El(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){const i=this._boxMesh,r=this._cubeCamera;i.material=n,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,i),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===Gi||e.mapping===fs?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tl()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=bl()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=Qp(),this._integrationMaterial=jp());const t=this._cubeSize,n=e.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/Hc);for(let a=0;a<=n;a++){const o=vr.lodToRoughness(a,n);if(a>n-Jp)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const c=o>0?Math.log2(t)+.5*Math.log2(6/(kc*Math.pow(o,4)))+.5:0;i.roughness.value=o,i.lodBias.value=c,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=em());const n=this._blurMaterial,i=n.uniforms,r=this._sourceTarget;i.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,i.envMap.value=r.texture,this._renderCube(e,0,n),i.envMap.value=e.texture,this._renderCube(r,0,n)}}function El(s,e,t){return new go(s,{minFilter:jn,generateMipmaps:e,type:Pn,colorSpace:ur,depthBuffer:t})}function ws(s,e,t){return new gi({name:s,uniforms:e,vertexShader:We.cube_vert,fragmentShader:t,side:Kt,blending:Bi,depthTest:!1,depthWrite:!1})}function Qp(){return ws("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${kc}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function jp(){return ws("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Hc}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function em(){return ws("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${$p}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function bl(){return ws("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Tl(){return ws("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function tm(s){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Ar||f===Rr)if(e.has(d)){const g=e.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const M=new go(g.height);return M.fromEquirectangularTexture(s,d),e.set(d,M),d.addEventListener("dispose",l),o(M.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){const f=d.mapping,g=f===Ar||f===Rr,M=f===Gi||f===fs;if(g||M){let p=t.get(d);const m=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return n===null&&(n=new vr(s)),p=g?n.fromEquirectangular(d,p):n.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),p.texture;if(p!==void 0)return p.texture;{const x=d.image;return g&&x&&x.height>0||M&&x&&c(x)?(n===null&&(n=new vr(s)),p=g?n.fromEquirectangular(d):n.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),d.addEventListener("dispose",h),p.texture):null}}}return d}function o(d,f){return f===Ar?d.mapping=Gi:f===Rr&&(d.mapping=fs),d}function c(d){let f=0;const g=6;for(let M=0;M<g;M++)d[M]!==void 0&&f++;return f===g}function l(d){const f=d.target;f.removeEventListener("dispose",l);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function nm(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&ar("WebGLRenderer: "+n+" extension not supported."),i}}}function im(s,e,t,n){const i={},r=new WeakMap,a=new FinalizationRegistry(g=>delete i[g]);function o(g){c(g.target)}function c(g){g.index!==null&&e.remove(g.index);for(const p in g.attributes)e.remove(g.attributes[p]);g.removeEventListener("dispose",o),delete i[g.id],a.unregister(g);const M=r.get(g);M&&(e.remove(M),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function l(g,M){return i[M.id]!==void 0||(M.addEventListener("dispose",o),i[M.id]=new WeakRef(M),a.register(M,M.id,M),t.memory.geometries++),M}function h(g){const M=g.attributes;for(const p in M)e.update(M[p],s.ARRAY_BUFFER)}function u(g){const M=g.index,p=g.attributes.position;let m=0;if(p===void 0)return;const x=M!==null?M.array.length:p.array.length/3-1,w=p.count>=65535?xc:_c,v=new w(Math.ceil(x/3)*6,1),T=v.array;if(M!==null){const _=M.array;m=M.version;for(let E=0,L=0;E<x;E+=3){const C=_[E+0],N=_[E+1],O=_[E+2];T[L++]=C,T[L++]=N,T[L++]=N,T[L++]=O,T[L++]=O,T[L++]=C}}else{m=p.version;for(let _=0,E=0;_<x;_+=3){const L=_+0,C=_+1,N=_+2;T[E++]=L,T[E++]=C,T[E++]=C,T[E++]=N,T[E++]=N,T[E++]=L}}v.version=m;const b=r.get(g);b&&e.remove(b),r.set(g,v)}function d(g){const M=r.get(g);if(M){const p=g.index;p!==null&&M.version<p.version&&u(g)}else u(g);return r.get(g)}function f(){for(const g in i){const M=i[g].deref();M!==void 0&&c(M)}}return{get:l,update:h,getWireframeAttribute:d,dispose:f}}function sm(s,e,t){let n;function i(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,d){s.drawElements(n,d,r,u*a),t.update(d,n,1)}function l(u,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let M=0;for(let p=0;p<f;p++)M+=d[p];t.update(M,n,1)}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function rm(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:je("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function am(s,e,t){const n=new WeakMap,i=new gt;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let C=function(){E.dispose(),n.delete(o),o.removeEventListener("dispose",C)};var f=C;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),M===!0&&(v=2),p===!0&&(v=3);let T=o.attributes.position.count*v,b=1;T>e.maxTextureSize&&(b=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const _=new Float32Array(T*b*4*u),E=new mc(_,T,b,u);E.type=Sn,E.needsUpdate=!0;const L=v*4;for(let N=0;N<u;N++){const O=m[N],X=x[N],R=w[N],B=T*b*4*N;for(let V=0;V<O.count;V++){const z=V*L;g===!0&&(i.fromBufferAttribute(O,V),_[B+z+0]=i.x,_[B+z+1]=i.y,_[B+z+2]=i.z,_[B+z+3]=0),M===!0&&(i.fromBufferAttribute(X,V),_[B+z+4]=i.x,_[B+z+5]=i.y,_[B+z+6]=i.z,_[B+z+7]=0),p===!0&&(i.fromBufferAttribute(R,V),_[B+z+8]=i.x,_[B+z+9]=i.y,_[B+z+10]=i.z,_[B+z+11]=R.itemSize===4?i.w:1)}}d={count:u,texture:E,size:new ye(T,b)},n.set(o,d),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const M=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(s,"morphTargetBaseInfluence",M),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function om(s,e,t,n,i){let r=new WeakMap;function a(l){const h=i.render.frame,u=l.geometry,d=e.get(l,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const lm={[Kl]:"LINEAR_TONE_MAPPING",[Ql]:"REINHARD_TONE_MAPPING",[jl]:"CINEON_TONE_MAPPING",[ec]:"ACES_FILMIC_TONE_MAPPING",[nc]:"AGX_TONE_MAPPING",[ic]:"NEUTRAL_TONE_MAPPING",[tc]:"CUSTOM_TONE_MAPPING"};function cm(s,e,t,n,i,r){const a=new Rn(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,c=null,l=null;const h=new Ut;h.setAttribute("position",new Xe([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Xe([0,2,0,0,2,0],2));const u=new $u({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new F(h,u),f=new Bc(-1,1,1,-1,0,1);let g=null,M=null,p=!1,m,x=null,w=[],v=!1;this.setSize=function(T,b){a.setSize(T,b),o!==null&&o.setSize(T,b),c!==null&&c.setSize(T,b);for(let _=0;_<w.length;_++){const E=w[_];E.setSize&&E.setSize(T,b)}},this.setEffects=function(T){w=T,v=w.length>0&&w[0].isRenderPass===!0;const b=a.width,_=a.height;w.length>0&&o===null&&(o=new Rn(b,_,{type:Pn,depthBuffer:!1,stencilBuffer:!1}),c=new Rn(b,_,{type:Pn,depthBuffer:!1,stencilBuffer:!1}));const E=i===!0&&w.some(L=>L.needsDepthTexture===!0);E!==(a.depthTexture!==null)&&(E===!0&&l===null&&(l=new Hi(b,_),r===!0&&(l.format=ei,l.type=ki)),a.dispose(),a.depthTexture=E?l:null,a.resolveDepthBuffer=E,a.storeMultisampledDepthBuffer=E);for(let L=0;L<w.length;L++){const C=w[L];C.setSize&&C.setSize(b,_),E&&C.needsDepthTexture===!0&&C.setDepthTexture&&C.setDepthTexture(l)}},this.begin=function(T,b){if(p||T.toneMapping===kn&&w.length===0)return!1;if(x=b,b!==null){const _=b.width,E=b.height;(a.width!==_||a.height!==E)&&this.setSize(_,E)}return v===!1&&T.setRenderTarget(a),m=T.toneMapping,T.toneMapping=kn,!0},this.hasRenderPass=function(){return v},this.end=function(T,b){T.toneMapping=m,p=!0;let _=a,E=o;for(let L=0;L<w.length;L++){const C=w[L];C.enabled!==!1&&(C.render(T,E,_,b),C.needsSwap!==!1&&(_=E,E=E===o?c:o))}if(g!==T.outputColorSpace||M!==T.toneMapping){g=T.outputColorSpace,M=T.toneMapping,u.defines={},Ke.getTransfer(g)===it&&(u.defines.SRGB_TRANSFER="");const L=lm[M];L&&(u.defines[L]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=_.texture,T.setRenderTarget(x),T.render(d,f),x=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),h.dispose(),u.dispose()}}const Vc=new Xt,Wc=new Hi(1,1),Xc=new yc(1),qc=new mc,Yc=new Jh,$c=new Sc,Al=[],Rl=[],Cl=new Float32Array(16),Pl=new Float32Array(9),Ll=new Float32Array(4);function qi(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Al[i];if(r===void 0&&(r=new Float32Array(i),Al[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Rt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Ct(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Sr(s,e){let t=Rl[e];t===void 0&&(t=new Int32Array(e),Rl[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function hm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function um(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2fv(this.addr,e),Ct(t,e)}}function dm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Rt(t,e))return;s.uniform3fv(this.addr,e),Ct(t,e)}}function fm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4fv(this.addr,e),Ct(t,e)}}function pm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Ll.set(n),s.uniformMatrix2fv(this.addr,!1,Ll),Ct(t,n)}}function mm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Pl.set(n),s.uniformMatrix3fv(this.addr,!1,Pl),Ct(t,n)}}function gm(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Cl.set(n),s.uniformMatrix4fv(this.addr,!1,Cl),Ct(t,n)}}function _m(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function xm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2iv(this.addr,e),Ct(t,e)}}function vm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;s.uniform3iv(this.addr,e),Ct(t,e)}}function Mm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4iv(this.addr,e),Ct(t,e)}}function Sm(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function ym(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;s.uniform2uiv(this.addr,e),Ct(t,e)}}function wm(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;s.uniform3uiv(this.addr,e),Ct(t,e)}}function Em(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;s.uniform4uiv(this.addr,e),Ct(t,e)}}function yr(s){return s.version===0&&(s.compareFunction=fc,s.needsUpdate=!0),s}function bm(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?r=yr(Wc):r=Vc,t.setTexture2D(e||r,i)}function Tm(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Yc,i)}function Am(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_CUBE_SHADOW?r=yr(Xc):r=$c,t.setTextureCube(e||r,i)}function Rm(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||qc,i)}function Cm(s){switch(s){case 5126:return hm;case 35664:return um;case 35665:return dm;case 35666:return fm;case 35674:return pm;case 35675:return mm;case 35676:return gm;case 5124:case 35670:return _m;case 35667:case 35671:return xm;case 35668:case 35672:return vm;case 35669:case 35673:return Mm;case 5125:return Sm;case 36294:return ym;case 36295:return wm;case 36296:return Em;case 35678:case 36198:case 36298:case 36306:case 35682:return bm;case 35679:case 36299:case 36307:return Tm;case 35680:case 36300:case 36308:case 36293:return Am;case 36289:case 36303:case 36311:case 36292:return Rm}}function Pm(s,e){s.uniform1fv(this.addr,e)}function Lm(s,e){const t=qi(e,this.size,2);s.uniform2fv(this.addr,t)}function Im(s,e){const t=qi(e,this.size,3);s.uniform3fv(this.addr,t)}function Dm(s,e){const t=qi(e,this.size,4);s.uniform4fv(this.addr,t)}function Nm(s,e){const t=qi(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Um(s,e){const t=qi(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Fm(s,e){const t=qi(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Om(s,e){s.uniform1iv(this.addr,e)}function Bm(s,e){s.uniform2iv(this.addr,e)}function zm(s,e){s.uniform3iv(this.addr,e)}function Gm(s,e){s.uniform4iv(this.addr,e)}function km(s,e){s.uniform1uiv(this.addr,e)}function Hm(s,e){s.uniform2uiv(this.addr,e)}function Vm(s,e){s.uniform3uiv(this.addr,e)}function Wm(s,e){s.uniform4uiv(this.addr,e)}function Xm(s,e,t){const n=this.cache,i=e.length,r=Sr(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=yr(Wc):a=Vc;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function qm(s,e,t){const n=this.cache,i=e.length,r=Sr(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Yc,r[a])}function Ym(s,e,t){const n=this.cache,i=e.length,r=Sr(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));let a;this.type===s.SAMPLER_CUBE_SHADOW?a=yr(Xc):a=$c;for(let o=0;o!==i;++o)t.setTextureCube(e[o]||a,r[o])}function $m(s,e,t){const n=this.cache,i=e.length,r=Sr(t,i);Rt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||qc,r[a])}function Jm(s){switch(s){case 5126:return Pm;case 35664:return Lm;case 35665:return Im;case 35666:return Dm;case 35674:return Nm;case 35675:return Um;case 35676:return Fm;case 5124:case 35670:return Om;case 35667:case 35671:return Bm;case 35668:case 35672:return zm;case 35669:case 35673:return Gm;case 5125:return km;case 36294:return Hm;case 36295:return Vm;case 36296:return Wm;case 35678:case 36198:case 36298:case 36306:case 35682:return Xm;case 35679:case 36299:case 36307:return qm;case 35680:case 36300:case 36308:case 36293:return Ym;case 36289:case 36303:case 36311:case 36292:return $m}}class Zm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Cm(t.type)}}class Km{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Jm(t.type)}}class Qm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const ia=/(\w+)(\])?(\[|\.)?/g;function Il(s,e){s.seq.push(e),s.map[e.id]=e}function jm(s,e,t){const n=s.name,i=n.length;for(ia.lastIndex=0;;){const r=ia.exec(n),a=ia.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){Il(t,l===void 0?new Zm(o,s,e):new Km(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new Qm(o),Il(t,u)),t=u}}}class or{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);jm(o,c,this)}const i=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Dl(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const e0=37297;let t0=0;function n0(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Nl=new ze;function i0(s){Ke._getMatrix(Nl,Ke.workingColorSpace,s);const e=`mat3( ${Nl.elements.map(t=>t.toFixed(4))} )`;switch(Ke.getTransfer(s)){case dr:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return Oe("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Ul(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+n0(s.getShaderSource(e),o)}else return r}function s0(s,e){const t=i0(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const r0={[Kl]:"Linear",[Ql]:"Reinhard",[jl]:"Cineon",[ec]:"ACESFilmic",[nc]:"AgX",[ic]:"Neutral",[tc]:"Custom"};function a0(s,e){const t=r0[e];return t===void 0?(Oe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const js=new D;function o0(){Ke.getLuminanceCoefficients(js);const s=js.x.toFixed(4),e=js.y.toFixed(4),t=js.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function l0(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(rs).join(`
`)}function c0(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function h0(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function rs(s){return s!==""}function Fl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Ol(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const u0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ka(s){return s.replace(u0,d0)}function d0(s,e){const t=We[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Ka(t)}const f0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bl(s){return s.replace(f0,p0)}function p0(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function zl(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const m0={[as]:"SHADOWMAP_TYPE_PCF",[is]:"SHADOWMAP_TYPE_VSM"};function g0(s){return m0[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const _0={[fs]:"ENVMAP_MODE_REFRACTION"};function x0(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":_0[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const v0={[Zl]:"ENVMAP_BLENDING_MULTIPLY",[Eh]:"ENVMAP_BLENDING_MIX",[bh]:"ENVMAP_BLENDING_ADD"};function M0(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":v0[s.combine]||"ENVMAP_BLENDING_NONE"}function S0(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=g0(t),l=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=x0(t),u=M0(t),d=l0(t),f=c0(r),g=i.createProgram();let M,p,m=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(M=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(rs).join(`
`),M.length>0&&(M+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(rs).join(`
`),p.length>0&&(p+=`
`)):(M=[zl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(rs).join(`
`),p=[zl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==kn?"#define TONE_MAPPING":"",t.toneMapping!==kn?We.tonemapping_pars_fragment:"",t.toneMapping!==kn?a0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,s0("linearToOutputTexel",t.outputColorSpace),o0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(rs).join(`
`)),a=Ka(a),a=Fl(a,t),a=Ol(a,t),o=Ka(o),o=Fl(o,t),o=Ol(o,t),a=Bl(a),o=Bl(o),t.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,M=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+M,p=["#define varying in",t.glslVersion===Go?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Go?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=m+M+a,w=m+p+o,v=Dl(i,i.VERTEX_SHADER,x),T=Dl(i,i.FRAGMENT_SHADER,w);i.attachShader(g,v),i.attachShader(g,T),t.index0AttributeName!==void 0?i.bindAttribLocation(g,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function b(C){if(s.debug.checkShaderErrors){const N=i.getProgramInfoLog(g)||"",O=i.getShaderInfoLog(v)||"",X=i.getShaderInfoLog(T)||"",R=N.trim(),B=O.trim(),V=X.trim();let z=!0,ie=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,v,T);else{const q=Ul(i,v,"vertex"),j=Ul(i,T,"fragment");je("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+R+`
`+q+`
`+j)}else R!==""?Oe("WebGLProgram: Program Info Log:",R):(B===""||V==="")&&(ie=!1);ie&&(C.diagnostics={runnable:z,programLog:R,vertexShader:{log:B,prefix:M},fragmentShader:{log:V,prefix:p}})}i.deleteShader(v),i.deleteShader(T),_=new or(i,g),E=h0(i,g)}let _;this.getUniforms=function(){return _===void 0&&b(this),_};let E;this.getAttributes=function(){return E===void 0&&b(this),E};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=i.getProgramParameter(g,e0)),L},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=t0++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=v,this.fragmentShader=T,this}let y0=0;class w0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new E0(e),t.set(e,n)),n}}class E0{constructor(e){this.id=y0++,this.code=e,this.usedTimes=0}}function b0(s){return s===pi||s===cr||s===hr}function T0(s,e,t,n,i,r){const a=new co,o=new w0,c=new Set,l=[],h=new Map,u=n.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(_){return c.add(_),_===0?"uv":`uv${_}`}function g(_,E,L,C,N,O){const X=C.fog,R=N.geometry,B=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?C.environment:null,V=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,z=e.get(_.envMap||B,V),ie=d[_.type];let q=n.precision;_.precision!==null&&(q=n.getMaxPrecision(_.precision),q!==_.precision&&Oe("WebGLProgram.getParameters:",_.precision,"not supported, using",q,"instead."));const j=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,ne=j!==void 0?j.length:0;let we=0;R.morphAttributes.position!==void 0&&(we=1),R.morphAttributes.normal!==void 0&&(we=2),R.morphAttributes.color!==void 0&&(we=3);let Ue,Z,ve,be;if(ie){const _e=Tn[ie];Ue=_e.vertexShader,Z=_e.fragmentShader}else{Ue=_.vertexShader,Z=_.fragmentShader;const _e=o.getVertexShaderStage(_),nt=o.getFragmentShaderStage(_);o.update(_,_e,nt),ve=_e.id,be=nt.id}const De=s.getRenderTarget(),Me=s.state.buffers.depth.getReversed(),ke=N.isInstancedMesh===!0,Mt=N.isBatchedMesh===!0,Fe=!!_.map,tt=!!_.matcap,rt=!!z,Ye=rt&&z.isPMREMTexture===!0,Ft=!!_.aoMap,bt=!!_.lightMap,Jt=!!_.bumpMap&&_.wireframe===!1,dt=!!_.normalMap,wn=!!_.displacementMap,Pt=!!_.emissiveMap,rn=!!_.metalnessMap,an=!!_.roughnessMap,on=_.anisotropy>0,U=_.clearcoat>0,ln=_.diffuseRoughness>0,ct=_.dispersion>0,ht=_.retroreflectivity>0,me=_.iridescence>0,Tt=_.sheen>0,Ne=_.transmission>0,Be=on&&!!_.anisotropyMap,A=U&&!!_.clearcoatMap,S=U&&!!_.clearcoatNormalMap,k=U&&!!_.clearcoatRoughnessMap,se=ln&&!!_.diffuseRoughnessMap,Q=me&&!!_.iridescenceMap,le=me&&!!_.iridescenceThicknessMap,fe=Tt&&!!_.sheenColorMap,$=Tt&&!!_.sheenRoughnessMap,J=!!_.specularMap,he=!!_.specularColorMap,P=!!_.specularIntensityMap,K=Ne&&!!_.transmissionMap,Y=Ne&&!!_.thicknessMap,ue=!!_.gradientMap,ae=!!_.alphaMap,ce=_.alphaTest>0,Pe=!!_.alphaHash,Ve=!!_.extensions;let re=kn;_.toneMapped&&(De===null||De.isXRRenderTarget===!0)&&(re=s.toneMapping);const Le=Ye?z.isCompressedCubeTexture?z.image[0].mipmaps:z.mipmaps:null,He={shaderID:ie,shaderType:_.type,shaderName:_.name,vertexShader:Ue,fragmentShader:Z,defines:_.defines,customVertexShaderID:ve,customFragmentShaderID:be,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:q,batching:Mt,batchingColor:Mt&&N._colorsTexture!==null,instancing:ke,instancingColor:ke&&N.instanceColor!==null,instancingMorph:ke&&N.morphTexture!==null,outputColorSpace:De===null?s.outputColorSpace:De.isXRRenderTarget===!0?De.texture.colorSpace:Ke.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Fe,matcap:tt,envMap:rt,envMapMode:rt&&z.mapping,envMapPMREM:Ye,envMapMaxLod:Ye?Le.length-1:null,envMapSize:Ye?Le[0].width:null,aoMap:Ft,lightMap:bt,bumpMap:Jt,normalMap:dt,displacementMap:wn,emissiveMap:Pt,normalMapObjectSpace:dt&&_.normalMapType===Rh,normalMapTangentSpace:dt&&_.normalMapType===Wa,packedNormalMap:dt&&_.normalMapType===Wa&&b0(_.normalMap.format),metalnessMap:rn,roughnessMap:an,anisotropy:on,anisotropyMap:Be,clearcoat:U,clearcoatMap:A,clearcoatNormalMap:S,clearcoatRoughnessMap:k,diffuseRoughness:ln,diffuseRoughnessMap:se,dispersion:ct,retroreflection:ht,iridescence:me,iridescenceMap:Q,iridescenceThicknessMap:le,sheen:Tt,sheenColorMap:fe,sheenRoughnessMap:$,specularMap:J,specularColorMap:he,specularIntensityMap:P,transmission:Ne,transmissionMap:K,thicknessMap:Y,gradientMap:ue,opaque:_.transparent===!1&&_.blending===os&&_.alphaToCoverage===!1,alphaMap:ae,alphaTest:ce,alphaHash:Pe,combine:_.combine,mapUv:Fe&&f(_.map.channel),aoMapUv:Ft&&f(_.aoMap.channel),lightMapUv:bt&&f(_.lightMap.channel),bumpMapUv:Jt&&f(_.bumpMap.channel),normalMapUv:dt&&f(_.normalMap.channel),displacementMapUv:wn&&f(_.displacementMap.channel),emissiveMapUv:Pt&&f(_.emissiveMap.channel),metalnessMapUv:rn&&f(_.metalnessMap.channel),roughnessMapUv:an&&f(_.roughnessMap.channel),anisotropyMapUv:Be&&f(_.anisotropyMap.channel),clearcoatMapUv:A&&f(_.clearcoatMap.channel),clearcoatNormalMapUv:S&&f(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:k&&f(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:se&&f(_.diffuseRoughnessMap.channel),iridescenceMapUv:Q&&f(_.iridescenceMap.channel),iridescenceThicknessMapUv:le&&f(_.iridescenceThicknessMap.channel),sheenColorMapUv:fe&&f(_.sheenColorMap.channel),sheenRoughnessMapUv:$&&f(_.sheenRoughnessMap.channel),specularMapUv:J&&f(_.specularMap.channel),specularColorMapUv:he&&f(_.specularColorMap.channel),specularIntensityMapUv:P&&f(_.specularIntensityMap.channel),transmissionMapUv:K&&f(_.transmissionMap.channel),thicknessMapUv:Y&&f(_.thicknessMap.channel),alphaMapUv:ae&&f(_.alphaMap.channel),vertexTangents:!!R.attributes.tangent&&(dt||on),vertexNormals:!!R.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!R.attributes.color&&R.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!R.attributes.uv&&(Fe||ae),fog:!!X,useFog:_.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||R.attributes.normal===void 0&&dt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Me,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:R.attributes.position!==void 0,morphTargets:R.morphAttributes.position!==void 0,morphNormals:R.morphAttributes.normal!==void 0,morphColors:R.morphAttributes.color!==void 0,morphTargetsCount:ne,morphTextureStride:we,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:O.filter(_e=>_e.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:re,decodeVideoTexture:Fe&&_.map.isVideoTexture===!0&&Ke.getTransfer(_.map.colorSpace)===it,decodeVideoTextureEmissive:Pt&&_.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(_.emissiveMap.colorSpace)===it,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===At,flipSided:_.side===Kt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Ve&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ve&&_.extensions.multiDraw===!0||Mt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return He.vertexUv1s=c.has(1),He.vertexUv2s=c.has(2),He.vertexUv3s=c.has(3),c.clear(),He}function M(_){const E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(const L in _.defines)E.push(L),E.push(_.defines[L]);return _.isRawShaderMaterial===!1&&(p(E,_),m(E,_),E.push(s.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function p(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapPMREM),_.push(E.envMapMaxLod),_.push(E.envMapSize),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.diffuseRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.numSunLights),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numSunLightShadows),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.numLightProbeGrids),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function m(_,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.diffuseRoughness&&a.enable(25),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function x(_){const E=d[_.type];let L;if(E){const C=Tn[E];L=Xu.clone(C.uniforms)}else L=_.uniforms;return L}function w(_,E){let L=h.get(E);return L!==void 0?++L.usedTimes:(L=new S0(s,E,_,i),l.push(L),h.set(E,L)),L}function v(_){if(--_.usedTimes===0){const E=l.indexOf(_);l[E]=l[l.length-1],l.pop(),h.delete(_.cacheKey),_.destroy()}}function T(_){o.remove(_)}function b(){o.dispose()}return{getParameters:g,getProgramCacheKey:M,getUniforms:x,acquireProgram:w,releaseProgram:v,releaseShaderCache:T,programs:l,dispose:b}}function A0(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,c){s.get(a)[o]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function R0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function Gl(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function kl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,g,M,p,m){let x=s[e];return x===void 0?(x={id:d.id,object:d,geometry:f,material:g,materialVariant:a(d),groupOrder:M,renderOrder:d.renderOrder,z:p,group:m},s[e]=x):(x.id=d.id,x.object=d,x.geometry=f,x.material=g,x.materialVariant=a(d),x.groupOrder=M,x.renderOrder=d.renderOrder,x.z=p,x.group=m),e++,x}function c(d,f,g,M,p,m,x){x.reversedDepth===!0&&(p=-p);const w=o(d,f,g,M,p,m);g.transmission>0?n.push(w):g.transparent===!0?i.push(w):t.push(w)}function l(d,f,g,M,p,m){const x=o(d,f,g,M,p,m);g.transmission>0?n.unshift(x):g.transparent===!0?i.unshift(x):t.unshift(x)}function h(d,f){t.length>1&&t.sort(d||R0),n.length>1&&n.sort(f||Gl),i.length>1&&i.sort(f||Gl)}function u(){for(let d=e,f=s.length;d<f;d++){const g=s[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:c,unshift:l,finish:u,sort:h}}function C0(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new kl,s.set(n,[a])):i>=r.length?(a=new kl,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function P0(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new D,color:new Ie};break;case"SpotLight":t={position:new D,direction:new D,color:new Ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Ie,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Ie,groundColor:new Ie};break;case"RectAreaLight":t={color:new Ie,position:new D,halfWidth:new D,halfHeight:new D};break}return s[e.id]=t,t}}}function L0(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let I0=0;function D0(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function N0(s){const e=new P0,t=L0(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new D);const i=new D,r=new st,a=new st;function o(l){let h=0,u=0,d=0;for(let O=0;O<9;O++)n.probe[O].set(0,0,0);let f=0,g=0,M=0,p=0,m=0,x=0,w=0,v=0,T=0,b=0,_=0,E=0,L=0,C=0;l.sort(D0);for(let O=0,X=l.length;O<X;O++){const R=l[O],B=R.color,V=R.intensity,z=R.distance;let ie=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===pi?ie=R.shadow.map.texture:ie=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=B.r*V,u+=B.g*V,d+=B.b*V;else if(R.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(R.sh.coefficients[q],V);C++}else if(R.isSunLight){const q=e.get(R);if(q.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const j=R.shadow,ne=t.get(R);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),n.sunShadow[g]=ne,n.sunShadowMap[g]=ie;const we=j.getViewportCount();for(let Ue=0;Ue<we;Ue++)n.sunShadowMatrix[M+Ue]=j.getMatrix(Ue),n.sunShadowCascade[M+Ue]=j._cascadeData[Ue];M+=we,g++}n.sun[f]=q,f++}else if(R.isDirectionalLight){const q=e.get(R);if(q.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const j=R.shadow,ne=t.get(R);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize=j.mapSize,n.directionalShadow[p]=ne,n.directionalShadowMap[p]=ie,n.directionalShadowMatrix[p]=R.shadow.matrix,T++}n.directional[p]=q,p++}else if(R.isSpotLight){const q=e.get(R);q.position.setFromMatrixPosition(R.matrixWorld),q.color.copy(B).multiplyScalar(V),q.distance=z,q.coneCos=Math.cos(R.angle),q.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),q.decay=R.decay,n.spot[x]=q;const j=R.shadow;if(R.map&&(n.spotLightMap[E]=R.map,E++,j.updateMatrices(R),R.castShadow&&L++),n.spotLightMatrix[x]=j.matrix,R.castShadow){const ne=t.get(R);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize=j.mapSize,n.spotShadow[x]=ne,n.spotShadowMap[x]=ie,_++}x++}else if(R.isRectAreaLight){const q=e.get(R);q.color.copy(B).multiplyScalar(V),q.halfWidth.set(R.width*.5,0,0),q.halfHeight.set(0,R.height*.5,0),n.rectArea[w]=q,w++}else if(R.isPointLight){const q=e.get(R);if(q.color.copy(R.color).multiplyScalar(R.intensity),q.distance=R.distance,q.decay=R.decay,R.castShadow){const j=R.shadow,ne=t.get(R);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize=j.mapSize,ne.shadowCameraNear=j.camera.near,ne.shadowCameraFar=j.camera.far,n.pointShadow[m]=ne,n.pointShadowMap[m]=ie,n.pointShadowMatrix[m]=R.shadow.matrix,b++}n.point[m]=q,m++}else if(R.isHemisphereLight){const q=e.get(R);q.skyColor.copy(R.color).multiplyScalar(V),q.groundColor.copy(R.groundColor).multiplyScalar(V),n.hemi[v]=q,v++}}w>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xe.LTC_FLOAT_1,n.rectAreaLTC2=xe.LTC_FLOAT_2):(n.rectAreaLTC1=xe.LTC_HALF_1,n.rectAreaLTC2=xe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const N=n.hash;(N.sunLength!==f||N.directionalLength!==p||N.pointLength!==m||N.spotLength!==x||N.rectAreaLength!==w||N.hemiLength!==v||N.numSunShadows!==g||N.numDirectionalShadows!==T||N.numPointShadows!==b||N.numSpotShadows!==_||N.numSpotMaps!==E||N.numLightProbes!==C)&&(n.sun.length=f,n.directional.length=p,n.spot.length=x,n.rectArea.length=w,n.point.length=m,n.hemi.length=v,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=M,n.sunShadowCascade.length=M,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=b,n.pointShadowMap.length=b,n.pointShadowMatrix.length=b,n.spotShadow.length=_,n.spotShadowMap.length=_,n.spotLightMatrix.length=_+E-L,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=L,n.numLightProbes=C,N.sunLength=f,N.directionalLength=p,N.pointLength=m,N.spotLength=x,N.rectAreaLength=w,N.hemiLength=v,N.numSunShadows=g,N.numDirectionalShadows=T,N.numPointShadows=b,N.numSpotShadows=_,N.numSpotMaps=E,N.numLightProbes=C,n.version=I0++)}function c(l,h){let u=0,d=0,f=0,g=0,M=0,p=0;const m=h.matrixWorldInverse;for(let x=0,w=l.length;x<w;x++){const v=l[x];if(v.isSunLight){const T=n.sun[u];T.direction.setFromMatrixPosition(v.matrixWorld),T.direction.transformDirection(m),u++}else if(v.isDirectionalLight){const T=n.directional[d];T.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(m),d++}else if(v.isSpotLight){const T=n.spot[g];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(m),T.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(m),g++}else if(v.isRectAreaLight){const T=n.rectArea[M];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(m),a.identity(),r.copy(v.matrixWorld),r.premultiply(m),a.extractRotation(r),T.halfWidth.set(v.width*.5,0,0),T.halfHeight.set(0,v.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),M++}else if(v.isPointLight){const T=n.point[f];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){const T=n.hemi[p];T.direction.setFromMatrixPosition(v.matrixWorld),T.direction.transformDirection(m),p++}}}return{setup:o,setupView:c,state:n}}function Hl(s){const e=new N0(s),t=[],n=[],i=[];function r(u){h.camera=u,t.length=0,n.length=0,i.length=0}function a(u){u.isLightProbeGrid?i.push(u):t.push(u)}function o(u){n.push(u)}function c(){e.setup(t),i.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function l(u){e.setupView(t,u)}const h={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function U0(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new Hl(s),e.set(i,[o])):r>=a.length?(o=new Hl(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const F0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,O0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,B0=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],z0=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)],Vl=new st,ts=new D,sa=new D;function G0(s,e,t){let n=new gs;const i=new ye,r=new ye,a=new gt,o=new Zu,c=new Ku,l={},h=t.maxTextureSize,u={[fi]:Kt,[Kt]:fi,[At]:At},d=new gi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:F0,fragmentShader:O0}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ut;g.setAttribute("position",new ni(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new F(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=as;let m=this.type;this.render=function(b,_,E){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;this.type===rh&&(Oe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=as);const L=s.getRenderTarget(),C=s.getActiveCubeFace(),N=s.getActiveMipmapLevel(),O=s.state;O.setBlending(Bi),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const X=m!==this.type;X&&_.traverse(function(R){R.material&&(Array.isArray(R.material)?R.material.forEach(B=>B.needsUpdate=!0):R.material.needsUpdate=!0)});for(let R=0,B=b.length;R<B;R++){const V=b[R],z=V.shadow;if(z===void 0){Oe("WebGLShadowMap:",V,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;i.copy(z.mapSize);const ie=z.getFrameExtents();i.multiply(ie),r.copy(z.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/ie.x),i.x=r.x*ie.x,z.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/ie.y),i.y=r.y*ie.y,z.mapSize.y=r.y));const q=s.state.buffers.depth.getReversed();if(z.camera._reversedDepth=q,z.map===null||X===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===is){if(V.isPointLight){Oe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new Rn(i.x,i.y,{format:pi,type:Pn,minFilter:Zt,magFilter:Zt,generateMipmaps:!1}),z.map.texture.name=V.name+".shadowMap",z.map.depthTexture=new Hi(i.x,i.y,Sn),z.map.depthTexture.name=V.name+".shadowMapDepth",z.map.depthTexture.format=ii,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Bt,z.map.depthTexture.magFilter=Bt}else V.isPointLight?(z.map=new go(i.x),z.map.depthTexture=new yc(i.x,Cn)):(z.map=new Rn(i.x,i.y),z.map.depthTexture=new Hi(i.x,i.y,Cn)),z.map.depthTexture.name=V.name+".shadowMap",z.map.depthTexture.format=ii,this.type===as?(z.map.depthTexture.compareFunction=q?dc:uc,z.map.depthTexture.minFilter=Zt,z.map.depthTexture.magFilter=Zt):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Bt,z.map.depthTexture.magFilter=Bt);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==i.x||z.map.height!==i.y)&&z.map.setSize(i.x,i.y);const j=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();V.isPointLight!==!0&&z.updateMatrices(V,E);const ne=z.camera.layers.mask&4294967294?z.camera.layers:E.layers;for(let we=0;we<j;we++){const Ue=z.getCamera(we);if(V.isPointLight){const Z=z.camera,ve=z.matrix,be=V.distance||Z.far;be!==Z.far&&(Z.far=be,Z.updateProjectionMatrix()),ts.setFromMatrixPosition(V.matrixWorld),Z.position.copy(ts),sa.copy(Z.position),sa.add(B0[we]),Z.up.copy(z0[we]),Z.lookAt(sa),Z.updateMatrixWorld(),ve.makeTranslation(-ts.x,-ts.y,-ts.z),Vl.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Vl,Z.coordinateSystem,Z.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)s.setRenderTarget(z.map,we),s.clear();else{we===0&&(s.setRenderTarget(z.map),s.clear());const Z=z.getViewport(we);a.set(r.x*Z.x,r.y*Z.y,r.x*Z.z,r.y*Z.w),O.viewport(a)}n=z.getFrustum(we),v(_,E,Ue,V,ne,this.type)}z.isPointLightShadow!==!0&&this.type===is&&x(z,E),z.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(L,C,N)};function x(b,_){const E=e.update(M);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null?b.mapPass=new Rn(i.x,i.y,{format:pi,type:Pn}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value.set(b.map.width,b.map.height),d.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(_,null,E,d,M,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value.set(b.map.width,b.map.height),f.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(_,null,E,f,M,null)}function w(b,_,E,L){let C=null;const N=E.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(N!==void 0)C=N;else if(C=E.isPointLight===!0?c:o,s.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){const O=C.uuid,X=_.uuid;let R=l[O];R===void 0&&(R={},l[O]=R);let B=R[X];B===void 0&&(B=C.clone(),R[X]=B,_.addEventListener("dispose",T)),C=B}if(C.visible=_.visible,C.wireframe=_.wireframe,L===is?C.side=_.shadowSide!==null?_.shadowSide:_.side:C.side=_.shadowSide!==null?_.shadowSide:u[_.side],C.alphaMap=_.alphaMap,C.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,C.map=_.map,C.clipShadows=_.clipShadows,C.clippingPlanes=_.clippingPlanes,C.clipIntersection=_.clipIntersection,C.displacementMap=_.displacementMap,C.displacementScale=_.displacementScale,C.displacementBias=_.displacementBias,C.wireframeLinewidth=_.wireframeLinewidth,C.linewidth=_.linewidth,E.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const O=s.properties.get(C);O.light=E}return C}function v(b,_,E,L,C,N){if(b.visible===!1)return;if(b.layers.test(C)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&N===is)&&(!b.frustumCulled||b.intersectsFrustum(n))){b.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,b.matrixWorld);const R=e.update(b),B=b.material;if(Array.isArray(B)){const V=R.groups;for(let z=0,ie=V.length;z<ie;z++){const q=V[z],j=B[q.materialIndex];if(j&&j.visible){const ne=w(b,j,L,N);b.onBeforeShadow(s,b,_,E,R,ne,q),s.renderBufferDirect(E,null,R,ne,b,q),b.onAfterShadow(s,b,_,E,R,ne,q)}}}else if(B.visible){const V=w(b,B,L,N);b.onBeforeShadow(s,b,_,E,R,V,null),s.renderBufferDirect(E,null,R,V,b,null),b.onAfterShadow(s,b,_,E,R,V,null)}}const X=b.children;for(let R=0,B=X.length;R<B;R++)v(X[R],_,E,L,C,N)}function T(b){b.target.removeEventListener("dispose",T);for(const E in l){const L=l[E],C=b.target.uuid;C in L&&(L[C].dispose(),delete L[C])}}}function k0(s,e){function t(){let P=!1;const K=new gt;let Y=null;const ue=new gt(0,0,0,0);return{setMask:function(ae){Y!==ae&&!P&&(s.colorMask(ae,ae,ae,ae),Y=ae)},setLocked:function(ae){P=ae},setClear:function(ae,ce,Pe,Ve,re){re===!0&&(ae*=Ve,ce*=Ve,Pe*=Ve),K.set(ae,ce,Pe,Ve),ue.equals(K)===!1&&(s.clearColor(ae,ce,Pe,Ve),ue.copy(K))},reset:function(){P=!1,Y=null,ue.set(-1,0,0,0)}}}function n(){let P=!1,K=!1,Y=null,ue=null,ae=null;return{setReversed:function(ce){if(K!==ce){const Pe=e.get("EXT_clip_control");ce?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),K=ce;const Ve=ae;ae=null,this.setClear(Ve)}},getReversed:function(){return K},setTest:function(ce){ce?Me(s.DEPTH_TEST):ke(s.DEPTH_TEST)},setMask:function(ce){Y!==ce&&!P&&(s.depthMask(ce),Y=ce)},setFunc:function(ce){if(K&&(ce=zh[ce]),ue!==ce){switch(ce){case aa:s.depthFunc(s.NEVER);break;case oa:s.depthFunc(s.ALWAYS);break;case la:s.depthFunc(s.LESS);break;case ds:s.depthFunc(s.LEQUAL);break;case ca:s.depthFunc(s.EQUAL);break;case ha:s.depthFunc(s.GEQUAL);break;case ua:s.depthFunc(s.GREATER);break;case da:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ue=ce}},setLocked:function(ce){P=ce},setClear:function(ce){ae!==ce&&(ae=ce,K&&(ce=1-ce),s.clearDepth(ce))},reset:function(){P=!1,Y=null,ue=null,ae=null,K=!1}}}function i(){let P=!1,K=null,Y=null,ue=null,ae=null,ce=null,Pe=null,Ve=null,re=null;return{setTest:function(Le){P||(Le?Me(s.STENCIL_TEST):ke(s.STENCIL_TEST))},setMask:function(Le){K!==Le&&!P&&(s.stencilMask(Le),K=Le)},setFunc:function(Le,He,_e){(Y!==Le||ue!==He||ae!==_e)&&(s.stencilFunc(Le,He,_e),Y=Le,ue=He,ae=_e)},setOp:function(Le,He,_e){(ce!==Le||Pe!==He||Ve!==_e)&&(s.stencilOp(Le,He,_e),ce=Le,Pe=He,Ve=_e)},setLocked:function(Le){P=Le},setClear:function(Le){re!==Le&&(s.clearStencil(Le),re=Le)},reset:function(){P=!1,K=null,Y=null,ue=null,ae=null,ce=null,Pe=null,Ve=null,re=null}}}const r=new t,a=new n,o=new i;let c={};const l=new WeakMap;let h={},u={},d={},f=new WeakMap,g=[],M=null,p=!1,m=null,x=null,w=null,v=null,T=null,b=null,_=null,E=new Ie(0,0,0),L=0,C=!1,N=null,O=null,X=null,R=null,B=null;const V=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,ie=0;const q=s.getParameter(s.VERSION);q.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(q)[1]),z=ie>=1):q.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),z=ie>=2);let j=null,ne={};const we=s.getParameter(s.SCISSOR_BOX),Ue=s.getParameter(s.VIEWPORT),Z=new gt().fromArray(we),ve=new gt().fromArray(Ue);function be(P,K,Y,ue){const ae=new Uint8Array(4),ce=s.createTexture();s.bindTexture(P,ce),s.texParameteri(P,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(P,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Pe=0;Pe<Y;Pe++)P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY?s.texImage3D(K,0,s.RGBA,1,1,ue,0,s.RGBA,s.UNSIGNED_BYTE,ae):s.texImage2D(K+Pe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ae);return ce}const De={};De[s.TEXTURE_2D]=be(s.TEXTURE_2D,s.TEXTURE_2D,1),De[s.TEXTURE_CUBE_MAP]=be(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),De[s.TEXTURE_2D_ARRAY]=be(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),De[s.TEXTURE_3D]=be(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Me(s.DEPTH_TEST),a.setFunc(ds),Jt(!1),dt(Oo),Me(s.CULL_FACE),Ft(Bi);function Me(P){h[P]!==!0&&(s.enable(P),h[P]=!0)}function ke(P){h[P]!==!1&&(s.disable(P),h[P]=!1)}function Mt(P,K){return d[P]!==K?(s.bindFramebuffer(P,K),d[P]=K,P===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=K),P===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=K),!0):!1}function Fe(P,K){let Y=g,ue=!1;if(P){Y=f.get(K),Y===void 0&&(Y=[],f.set(K,Y));const ae=P.textures;if(Y.length!==ae.length||Y[0]!==s.COLOR_ATTACHMENT0){for(let ce=0,Pe=ae.length;ce<Pe;ce++)Y[ce]=s.COLOR_ATTACHMENT0+ce;Y.length=ae.length,ue=!0}}else Y[0]!==s.BACK&&(Y[0]=s.BACK,ue=!0);ue&&s.drawBuffers(Y)}function tt(P){return M!==P?(s.useProgram(P),M=P,!0):!1}const rt={[Ui]:s.FUNC_ADD,[oh]:s.FUNC_SUBTRACT,[lh]:s.FUNC_REVERSE_SUBTRACT};rt[ch]=s.MIN,rt[hh]=s.MAX;const Ye={[uh]:s.ZERO,[dh]:s.ONE,[fh]:s.SRC_COLOR,[$l]:s.SRC_ALPHA,[vh]:s.SRC_ALPHA_SATURATE,[_h]:s.DST_COLOR,[mh]:s.DST_ALPHA,[ph]:s.ONE_MINUS_SRC_COLOR,[Jl]:s.ONE_MINUS_SRC_ALPHA,[xh]:s.ONE_MINUS_DST_COLOR,[gh]:s.ONE_MINUS_DST_ALPHA,[Mh]:s.CONSTANT_COLOR,[Sh]:s.ONE_MINUS_CONSTANT_COLOR,[yh]:s.CONSTANT_ALPHA,[wh]:s.ONE_MINUS_CONSTANT_ALPHA};function Ft(P,K,Y,ue,ae,ce,Pe,Ve,re,Le){if(P===Bi){p===!0&&(ke(s.BLEND),p=!1);return}if(p===!1&&(Me(s.BLEND),p=!0),P!==ah){if(P!==m||Le!==C){if((x!==Ui||T!==Ui)&&(s.blendEquation(s.FUNC_ADD),x=Ui,T=Ui),Le)switch(P){case os:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Yt:s.blendFunc(s.ONE,s.ONE);break;case Bo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case zo:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:je("WebGLState: Invalid blending: ",P);break}else switch(P){case os:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Yt:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Bo:je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case zo:je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:je("WebGLState: Invalid blending: ",P);break}w=null,v=null,b=null,_=null,E.set(0,0,0),L=0,m=P,C=Le}return}ae=ae||K,ce=ce||Y,Pe=Pe||ue,(K!==x||ae!==T)&&(s.blendEquationSeparate(rt[K],rt[ae]),x=K,T=ae),(Y!==w||ue!==v||ce!==b||Pe!==_)&&(s.blendFuncSeparate(Ye[Y],Ye[ue],Ye[ce],Ye[Pe]),w=Y,v=ue,b=ce,_=Pe),(Ve.equals(E)===!1||re!==L)&&(s.blendColor(Ve.r,Ve.g,Ve.b,re),E.copy(Ve),L=re),m=P,C=!1}function bt(P,K){P.side===At?ke(s.CULL_FACE):Me(s.CULL_FACE);let Y=P.side===Kt;K&&(Y=!Y),Jt(Y),P.blending===os&&P.transparent===!1?Ft(Bi):Ft(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),a.setFunc(P.depthFunc),a.setTest(P.depthTest),a.setMask(P.depthWrite),r.setMask(P.colorWrite);const ue=P.stencilWrite;o.setTest(ue),ue&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),Pt(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?Me(s.SAMPLE_ALPHA_TO_COVERAGE):ke(s.SAMPLE_ALPHA_TO_COVERAGE)}function Jt(P){N!==P&&(P?s.frontFace(s.CW):s.frontFace(s.CCW),N=P)}function dt(P){P!==ih?(Me(s.CULL_FACE),P!==O&&(P===Oo?s.cullFace(s.BACK):P===sh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ke(s.CULL_FACE),O=P}function wn(P){P!==X&&(z&&s.lineWidth(P),X=P)}function Pt(P,K,Y){P?(Me(s.POLYGON_OFFSET_FILL),(R!==K||B!==Y)&&(R=K,B=Y,a.getReversed()&&(K=-K,Y=-Y),s.polygonOffset(K,Y))):ke(s.POLYGON_OFFSET_FILL)}function rn(P){P?Me(s.SCISSOR_TEST):ke(s.SCISSOR_TEST)}function an(P){P===void 0&&(P=s.TEXTURE0+V-1),j!==P&&(s.activeTexture(P),j=P)}function on(P,K,Y){Y===void 0&&(j===null?Y=s.TEXTURE0+V-1:Y=j);let ue=ne[Y];ue===void 0&&(ue={type:void 0,texture:void 0},ne[Y]=ue),(ue.type!==P||ue.texture!==K)&&(j!==Y&&(s.activeTexture(Y),j=Y),s.bindTexture(P,K||De[P]),ue.type=P,ue.texture=K)}function U(){const P=ne[j];P!==void 0&&P.type!==void 0&&(s.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function ln(){try{s.compressedTexImage2D(...arguments)}catch(P){je("WebGLState:",P)}}function ct(){try{s.compressedTexImage3D(...arguments)}catch(P){je("WebGLState:",P)}}function ht(){try{s.texSubImage2D(...arguments)}catch(P){je("WebGLState:",P)}}function me(){try{s.texSubImage3D(...arguments)}catch(P){je("WebGLState:",P)}}function Tt(){try{s.compressedTexSubImage2D(...arguments)}catch(P){je("WebGLState:",P)}}function Ne(){try{s.compressedTexSubImage3D(...arguments)}catch(P){je("WebGLState:",P)}}function Be(){try{s.texStorage2D(...arguments)}catch(P){je("WebGLState:",P)}}function A(){try{s.texStorage3D(...arguments)}catch(P){je("WebGLState:",P)}}function S(){try{s.texImage2D(...arguments)}catch(P){je("WebGLState:",P)}}function k(){try{s.texImage3D(...arguments)}catch(P){je("WebGLState:",P)}}function se(P){return u[P]!==void 0?u[P]:s.getParameter(P)}function Q(P,K){u[P]!==K&&(s.pixelStorei(P,K),u[P]=K)}function le(P){Z.equals(P)===!1&&(s.scissor(P.x,P.y,P.z,P.w),Z.copy(P))}function fe(P){ve.equals(P)===!1&&(s.viewport(P.x,P.y,P.z,P.w),ve.copy(P))}function $(P,K){let Y=l.get(K);Y===void 0&&(Y=new WeakMap,l.set(K,Y));let ue=Y.get(P);ue===void 0&&(ue=s.getUniformBlockIndex(K,P.name),s.uniformBlockBinding(K,ue,ue),Y.set(P,ue))}function J(P,K,Y){const ae=l.get(K).get(P);c[ae]!==Y&&(s.bindBufferBase(s.UNIFORM_BUFFER,ae,Y),c[ae]=Y)}function he(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},u={},j=null,ne={},d={},c={},f=new WeakMap,g=[],M=null,p=!1,m=null,x=null,w=null,v=null,T=null,b=null,_=null,E=new Ie(0,0,0),L=0,C=!1,N=null,O=null,X=null,R=null,B=null,Z.set(0,0,s.canvas.width,s.canvas.height),ve.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Me,disable:ke,bindFramebuffer:Mt,drawBuffers:Fe,useProgram:tt,setBlending:Ft,setMaterial:bt,setFlipSided:Jt,setCullFace:dt,setLineWidth:wn,setPolygonOffset:Pt,setScissorTest:rn,activeTexture:an,bindTexture:on,unbindTexture:U,compressedTexImage2D:ln,compressedTexImage3D:ct,texImage2D:S,texImage3D:k,pixelStorei:Q,getParameter:se,updateUBOMapping:$,uniformBlockBinding:J,texStorage2D:Be,texStorage3D:A,texSubImage2D:ht,texSubImage3D:me,compressedTexSubImage2D:Tt,compressedTexSubImage3D:Ne,scissor:le,viewport:fe,reset:he}}function H0(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ye,h=new WeakMap,u=new Set;let d;const f=new WeakMap,g=new Set,M=new FinalizationRegistry(A=>g.delete(A));let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,S){return p?new OffscreenCanvas(A,S):fr("canvas")}function x(A,S,k){let se=1;const Q=Be(A);if((Q.width>k||Q.height>k)&&(se=k/Math.max(Q.width,Q.height)),se<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const le=Math.floor(se*Q.width),fe=Math.floor(se*Q.height);d===void 0&&(d=m(le,fe));const $=S?m(le,fe):d;return $.width=le,$.height=fe,$.getContext("2d").drawImage(A,0,0,le,fe),Oe("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+le+"x"+fe+")."),$}else return"data"in A&&Oe("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),A;return A}function w(A){return A.generateMipmaps}function v(A){s.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function b(A,S,k,se,Q,le=!1){if(A!==null){if(s[A]!==void 0)return s[A];Oe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let fe;se&&(fe=e.get("EXT_texture_norm16"),fe||Oe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=S;if(S===s.RED&&(k===s.FLOAT&&($=s.R32F),k===s.HALF_FLOAT&&($=s.R16F),k===s.UNSIGNED_BYTE&&($=s.R8),k===s.UNSIGNED_SHORT&&fe&&($=fe.R16_EXT),k===s.SHORT&&fe&&($=fe.R16_SNORM_EXT)),S===s.RED_INTEGER&&(k===s.UNSIGNED_BYTE&&($=s.R8UI),k===s.UNSIGNED_SHORT&&($=s.R16UI),k===s.UNSIGNED_INT&&($=s.R32UI),k===s.BYTE&&($=s.R8I),k===s.SHORT&&($=s.R16I),k===s.INT&&($=s.R32I)),S===s.RG&&(k===s.FLOAT&&($=s.RG32F),k===s.HALF_FLOAT&&($=s.RG16F),k===s.UNSIGNED_BYTE&&($=s.RG8),k===s.UNSIGNED_SHORT&&fe&&($=fe.RG16_EXT),k===s.SHORT&&fe&&($=fe.RG16_SNORM_EXT)),S===s.RG_INTEGER&&(k===s.UNSIGNED_BYTE&&($=s.RG8UI),k===s.UNSIGNED_SHORT&&($=s.RG16UI),k===s.UNSIGNED_INT&&($=s.RG32UI),k===s.BYTE&&($=s.RG8I),k===s.SHORT&&($=s.RG16I),k===s.INT&&($=s.RG32I)),S===s.RGB_INTEGER&&(k===s.UNSIGNED_BYTE&&($=s.RGB8UI),k===s.UNSIGNED_SHORT&&($=s.RGB16UI),k===s.UNSIGNED_INT&&($=s.RGB32UI),k===s.BYTE&&($=s.RGB8I),k===s.SHORT&&($=s.RGB16I),k===s.INT&&($=s.RGB32I)),S===s.RGBA_INTEGER&&(k===s.UNSIGNED_BYTE&&($=s.RGBA8UI),k===s.UNSIGNED_SHORT&&($=s.RGBA16UI),k===s.UNSIGNED_INT&&($=s.RGBA32UI),k===s.BYTE&&($=s.RGBA8I),k===s.SHORT&&($=s.RGBA16I),k===s.INT&&($=s.RGBA32I)),S===s.RGB&&(k===s.UNSIGNED_SHORT&&fe&&($=fe.RGB16_EXT),k===s.SHORT&&fe&&($=fe.RGB16_SNORM_EXT),k===s.UNSIGNED_INT_5_9_9_9_REV&&($=s.RGB9_E5),k===s.UNSIGNED_INT_10F_11F_11F_REV&&($=s.R11F_G11F_B10F)),S===s.RGBA){const J=le?dr:Ke.getTransfer(Q);k===s.FLOAT&&($=s.RGBA32F),k===s.HALF_FLOAT&&($=s.RGBA16F),k===s.UNSIGNED_BYTE&&($=J===it?s.SRGB8_ALPHA8:s.RGBA8),k===s.UNSIGNED_SHORT&&fe&&($=fe.RGBA16_EXT),k===s.SHORT&&fe&&($=fe.RGBA16_SNORM_EXT),k===s.UNSIGNED_SHORT_4_4_4_4&&($=s.RGBA4),k===s.UNSIGNED_SHORT_5_5_5_1&&($=s.RGB5_A1)}return($===s.R16F||$===s.R32F||$===s.RG16F||$===s.RG32F||$===s.RGBA16F||$===s.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function _(A,S){let k;return A?S===null||S===Cn||S===ki?k=s.DEPTH24_STENCIL8:S===Sn?k=s.DEPTH32F_STENCIL8:S===ps&&(k=s.DEPTH24_STENCIL8,Oe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Cn||S===ki?k=s.DEPTH_COMPONENT24:S===Sn?k=s.DEPTH_COMPONENT32F:S===ps&&(k=s.DEPTH_COMPONENT16),k}function E(A,S){return w(A)===!0||A.isFramebufferTexture&&A.minFilter!==Bt&&A.minFilter!==Zt?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function L(A){const S=new WeakRef(A);n.get(A).__ref=S,g.add(S),M.register(A,S,S)}function C(A){const S=n.get(A).__ref;S!==void 0&&(g.delete(S),M.unregister(S))}function N(A){X(A.target)}function O(A){R(A.target)}function X(A){A.removeEventListener("dispose",N),C(A),V(A),A.isVideoTexture&&h.delete(A),A.isHTMLTexture&&u.delete(A)}function R(A){A.removeEventListener("dispose",O),C(A),ie(A)}function B(){for(const A of g){const S=A.deref();S!==void 0&&(S.isRenderTarget===!0?R(S):X(S))}g.clear(),u.clear()}function V(A){const S=n.get(A);if(S.__webglInit===void 0)return;const k=A.source,se=f.get(k);if(se){const Q=se[S.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&z(A),Object.keys(se).length===0&&f.delete(k)}n.remove(A)}function z(A){const S=n.get(A);s.deleteTexture(S.__webglTexture);const k=A.source,se=f.get(k);delete se[S.__cacheKey],a.memory.textures--}function ie(A){const S=n.get(A);S.__depthDisposeCallback&&S.__depthDisposeCallback();const k=A.depthTexture;if(k&&k.renderTarget===A&&X(k),A.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(S.__webglFramebuffer[Q]))for(let le=0;le<S.__webglFramebuffer[Q].length;le++)s.deleteFramebuffer(S.__webglFramebuffer[Q][le]);else s.deleteFramebuffer(S.__webglFramebuffer[Q]);S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer[Q])}else{if(Array.isArray(S.__webglFramebuffer))for(let Q=0;Q<S.__webglFramebuffer.length;Q++)s.deleteFramebuffer(S.__webglFramebuffer[Q]);else s.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&s.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&s.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Q=0;Q<S.__webglColorRenderbuffer.length;Q++)S.__webglColorRenderbuffer[Q]&&s.deleteRenderbuffer(S.__webglColorRenderbuffer[Q]);S.__webglDepthRenderbuffer&&s.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const se=A.textures;for(let Q=0,le=se.length;Q<le;Q++){const fe=n.get(se[Q]);fe.__webglTexture&&(s.deleteTexture(fe.__webglTexture),a.memory.textures--),n.remove(se[Q])}n.remove(A)}let q=0;function j(){q=0}function ne(){return q}function we(A){q=A}function Ue(){const A=q;return A>=i.maxTextures&&Oe("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+i.maxTextures),q+=1,A}function Z(A){const S=[];return S.push(A.wrapS),S.push(A.wrapT),S.push(A.wrapR||0),S.push(A.magFilter),S.push(A.minFilter),S.push(A.anisotropy),S.push(A.internalFormat),S.push(A.format),S.push(A.type),S.push(A.generateMipmaps),S.push(A.mipmapsAutoUpdate),S.push(A.premultiplyAlpha),S.push(A.flipY),S.push(A.unpackAlignment),S.push(A.colorSpace),S.join()}function ve(A,S){const k=n.get(A);if(A.isVideoTexture&&Tt(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&k.__version!==A.version){const se=A.image;if(se===null)Oe("WebGLRenderer: Texture marked for update but no image data found.");else if(se.complete===!1)Oe("WebGLRenderer: Texture marked for update but image is incomplete");else{bt(k,A,S);return}}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,k.__webglTexture,s.TEXTURE0+S)}function be(A,S){const k=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){bt(k,A,S);return}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,k.__webglTexture,s.TEXTURE0+S)}function De(A,S){const k=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){bt(k,A,S);return}t.bindTexture(s.TEXTURE_3D,k.__webglTexture,s.TEXTURE0+S)}function Me(A,S){const k=n.get(A);if(A.version>0&&k.__version!==A.version){Jt(k,A,S);return}t.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture,s.TEXTURE0+S)}const ke={[lr]:s.REPEAT,[Gn]:s.CLAMP_TO_EDGE,[fa]:s.MIRRORED_REPEAT},Mt={[Bt]:s.NEAREST,[Th]:s.NEAREST_MIPMAP_NEAREST,[Cs]:s.NEAREST_MIPMAP_LINEAR,[Zt]:s.LINEAR,[Cr]:s.LINEAR_MIPMAP_NEAREST,[jn]:s.LINEAR_MIPMAP_LINEAR},Fe={[Ph]:s.NEVER,[fc]:s.ALWAYS,[Lh]:s.LESS,[uc]:s.LEQUAL,[Ih]:s.EQUAL,[dc]:s.GEQUAL,[Dh]:s.GREATER,[Nh]:s.NOTEQUAL};function tt(A,S){if(S.type===Sn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Zt||S.magFilter===Cr||S.magFilter===Cs||S.magFilter===jn||S.minFilter===Zt||S.minFilter===Cr||S.minFilter===Cs||S.minFilter===jn)&&Oe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,ke[S.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,ke[S.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,ke[S.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,Mt[S.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,Mt[S.minFilter]),S.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,Fe[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Bt||S.minFilter!==Cs&&S.minFilter!==jn||S.type===Sn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");s.texParameterf(A,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,i.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function rt(A,S){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",N),L(S));const se=S.source;let Q=f.get(se);Q===void 0&&(Q={},f.set(se,Q));const le=Z(S);if(le!==A.__cacheKey){Q[le]===void 0&&(Q[le]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,k=!0),Q[le].usedTimes++;const fe=Q[A.__cacheKey];fe!==void 0&&(Q[A.__cacheKey].usedTimes--,fe.usedTimes===0&&z(S)),A.__cacheKey=le,A.__webglTexture=Q[le].texture}return k}function Ye(A,S,k){return Math.floor(Math.floor(A/k)/S)}function Ft(A,S,k,se){const le=A.updateRanges;if(le.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,S.width,S.height,k,se,S.data);else{le.sort((P,K)=>P.start-K.start);let fe=0;for(let P=1;P<le.length;P++){const K=le[fe],Y=le[P],ue=K.start+K.count,ae=Ye(Y.start,S.width,4),ce=Ye(K.start,S.width,4);Y.start<=ue+1&&ae===ce&&Ye(Y.start+Y.count-1,S.width,4)===ae?K.count=Math.max(K.count,Y.start+Y.count-K.start):(++fe,le[fe]=Y)}le.length=fe+1;const $=t.getParameter(s.UNPACK_ROW_LENGTH),J=t.getParameter(s.UNPACK_SKIP_PIXELS),he=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,S.width);for(let P=0,K=le.length;P<K;P++){const Y=le[P],ue=Math.floor(Y.start/4),ae=Math.ceil(Y.count/4),ce=ue%S.width,Pe=Math.floor(ue/S.width),Ve=ae,re=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,ce),t.pixelStorei(s.UNPACK_SKIP_ROWS,Pe),t.texSubImage2D(s.TEXTURE_2D,0,ce,Pe,Ve,re,k,se,S.data)}A.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,$),t.pixelStorei(s.UNPACK_SKIP_PIXELS,J),t.pixelStorei(s.UNPACK_SKIP_ROWS,he)}}function bt(A,S,k){let se=s.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(se=s.TEXTURE_2D_ARRAY),S.isData3DTexture&&(se=s.TEXTURE_3D);const Q=rt(A,S),le=S.source;t.bindTexture(se,A.__webglTexture,s.TEXTURE0+k);const fe=n.get(le);if(le.version!==fe.__version||Q===!0){if(t.activeTexture(s.TEXTURE0+k),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){const re=Ke.getPrimaries(Ke.workingColorSpace),Le=S.colorSpace===Qn?null:Ke.getPrimaries(S.colorSpace),He=S.colorSpace===Qn||re===Le?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,He)}t.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment);let J=x(S.image,!1,i.maxTextureSize);J=Ne(S,J);const he=r.convert(S.format,S.colorSpace),P=r.convert(S.type);let K=b(S.internalFormat,he,P,S.normalized,S.colorSpace,S.isVideoTexture);tt(se,S);let Y;const ue=S.mipmaps,ae=S.isVideoTexture!==!0,ce=fe.__version===void 0||Q===!0,Pe=le.dataReady,Ve=E(S,J);if(S.isDepthTexture)K=_(S.format===ei,S.type),ce&&(ae?t.texStorage2D(s.TEXTURE_2D,1,K,J.width,J.height):t.texImage2D(s.TEXTURE_2D,0,K,J.width,J.height,0,he,P,null));else if(S.isDataTexture)if(ue.length>0){ae&&ce&&t.texStorage2D(s.TEXTURE_2D,Ve,K,ue[0].width,ue[0].height);for(let re=0,Le=ue.length;re<Le;re++)Y=ue[re],ae?Pe&&t.texSubImage2D(s.TEXTURE_2D,re,0,0,Y.width,Y.height,he,P,Y.data):t.texImage2D(s.TEXTURE_2D,re,K,Y.width,Y.height,0,he,P,Y.data);S.generateMipmaps=!1}else ae?(ce&&t.texStorage2D(s.TEXTURE_2D,Ve,K,J.width,J.height),Pe&&Ft(S,J,he,P)):t.texImage2D(s.TEXTURE_2D,0,K,J.width,J.height,0,he,P,J.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){ae&&ce&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ve,K,ue[0].width,ue[0].height,J.depth);for(let re=0,Le=ue.length;re<Le;re++)if(Y=ue[re],S.format!==An)if(he!==null)if(ae){if(Pe)if(S.layerUpdates.size>0){const He=yl(Y.width,Y.height,S.format,S.type);for(const _e of S.layerUpdates){const nt=Y.data.subarray(_e*He/Y.data.BYTES_PER_ELEMENT,(_e+1)*He/Y.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,re,0,0,_e,Y.width,Y.height,1,he,nt)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,re,0,0,0,Y.width,Y.height,J.depth,he,Y.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,re,K,Y.width,Y.height,J.depth,0,Y.data,0,0);else Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ae?Pe&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,re,0,0,0,Y.width,Y.height,J.depth,he,P,Y.data):t.texImage3D(s.TEXTURE_2D_ARRAY,re,K,Y.width,Y.height,J.depth,0,he,P,Y.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{ae&&ce&&t.texStorage2D(s.TEXTURE_2D,Ve,K,ue[0].width,ue[0].height);for(let re=0,Le=ue.length;re<Le;re++)Y=ue[re],S.format!==An?he!==null?ae?Pe&&t.compressedTexSubImage2D(s.TEXTURE_2D,re,0,0,Y.width,Y.height,he,Y.data):t.compressedTexImage2D(s.TEXTURE_2D,re,K,Y.width,Y.height,0,Y.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?Pe&&t.texSubImage2D(s.TEXTURE_2D,re,0,0,Y.width,Y.height,he,P,Y.data):t.texImage2D(s.TEXTURE_2D,re,K,Y.width,Y.height,0,he,P,Y.data)}else if(S.isDataArrayTexture)if(ae){if(ce&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ve,K,J.width,J.height,J.depth),Pe)if(S.layerUpdates.size>0){const re=yl(J.width,J.height,S.format,S.type);for(const Le of S.layerUpdates){const He=J.data.subarray(Le*re/J.data.BYTES_PER_ELEMENT,(Le+1)*re/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Le,J.width,J.height,1,he,P,He)}S.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,he,P,J.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,K,J.width,J.height,J.depth,0,he,P,J.data);else if(S.isData3DTexture)ae?(ce&&t.texStorage3D(s.TEXTURE_3D,Ve,K,J.width,J.height,J.depth),Pe&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,he,P,J.data)):t.texImage3D(s.TEXTURE_3D,0,K,J.width,J.height,J.depth,0,he,P,J.data);else if(S.isFramebufferTexture){if(ce)if(ae)t.texStorage2D(s.TEXTURE_2D,Ve,K,J.width,J.height);else{let re=J.width,Le=J.height;for(let He=0;He<Ve;He++)t.texImage2D(s.TEXTURE_2D,He,K,re,Le,0,he,P,null),re>>=1,Le>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in s){const re=s.canvas;if(re.hasAttribute("layoutsubtree")||re.setAttribute("layoutsubtree","true"),J.parentNode!==re){re.appendChild(J),u.add(S),re.onpaint=Le=>{const He=Le.changedElements;for(const _e of u)He.includes(_e.image)&&(_e.needsUpdate=!0)},re.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,J);else{const He=s.RGBA,_e=s.RGBA,nt=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,He,_e,nt,J)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(ue.length>0){if(ae&&ce){const re=Be(ue[0]);t.texStorage2D(s.TEXTURE_2D,Ve,K,re.width,re.height)}for(let re=0,Le=ue.length;re<Le;re++)Y=ue[re],ae?Pe&&t.texSubImage2D(s.TEXTURE_2D,re,0,0,he,P,Y):t.texImage2D(s.TEXTURE_2D,re,K,he,P,Y);S.generateMipmaps=!1}else if(ae){if(ce){const re=Be(J);t.texStorage2D(s.TEXTURE_2D,Ve,K,re.width,re.height)}Pe&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,he,P,J)}else t.texImage2D(s.TEXTURE_2D,0,K,he,P,J);w(S)&&S.mipmapsAutoUpdate===!0&&v(se),fe.__version=le.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function Jt(A,S,k){if(S.image.length!==6)return;const se=rt(A,S),Q=S.source;t.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+k);const le=n.get(Q);if(Q.version!==le.__version||se===!0){t.activeTexture(s.TEXTURE0+k);const fe=Ke.getPrimaries(Ke.workingColorSpace),$=S.colorSpace===Qn?null:Ke.getPrimaries(S.colorSpace),J=S.colorSpace===Qn||fe===$?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,J);const he=S.isCompressedTexture||S.image[0].isCompressedTexture,P=S.image[0]&&S.image[0].isDataTexture,K=[];for(let _e=0;_e<6;_e++)!he&&!P?K[_e]=x(S.image[_e],!0,i.maxCubemapSize):K[_e]=P?S.image[_e].image:S.image[_e],K[_e]=Ne(S,K[_e]);const Y=K[0],ue=r.convert(S.format,S.colorSpace),ae=r.convert(S.type);let ce=b(S.internalFormat,ue,ae,S.normalized,S.colorSpace);const Pe=S.isVideoTexture!==!0,Ve=le.__version===void 0||se===!0,re=Q.dataReady;let Le=E(S,Y);tt(s.TEXTURE_CUBE_MAP,S);let He;if(S.isDepthTexture){if(ce=_(S.format===ei,S.type),Ve)if(Pe)t.texStorage2D(s.TEXTURE_CUBE_MAP,1,ce,Y.width,Y.height);else for(let _e=0;_e<6;_e++)t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,ce,Y.width,Y.height,0,ue,ae,null)}else if(he){Pe&&Ve&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Le,ce,Y.width,Y.height);for(let _e=0;_e<6;_e++){He=K[_e].mipmaps;for(let nt=0;nt<He.length;nt++){const Lt=He[nt];S.format!==An?ue!==null?Pe?re&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,nt,0,0,Lt.width,Lt.height,ue,Lt.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,nt,ce,Lt.width,Lt.height,0,Lt.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pe?re&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,nt,0,0,Lt.width,Lt.height,ue,ae,Lt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,nt,ce,Lt.width,Lt.height,0,ue,ae,Lt.data)}}}else{if(He=S.mipmaps,Pe&&Ve){He.length>0&&Le++;const _e=Be(K[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Le,ce,_e.width,_e.height)}for(let _e=0;_e<6;_e++)if(P){Pe?re&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,K[_e].width,K[_e].height,ue,ae,K[_e].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,ce,K[_e].width,K[_e].height,0,ue,ae,K[_e].data);for(let nt=0;nt<He.length;nt++){const Vn=He[nt].image[_e].image;Pe?re&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,nt+1,0,0,Vn.width,Vn.height,ue,ae,Vn.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,nt+1,ce,Vn.width,Vn.height,0,ue,ae,Vn.data)}}else{Pe?re&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,ue,ae,K[_e]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,ce,ue,ae,K[_e]);for(let nt=0;nt<He.length;nt++){const Lt=He[nt];Pe?re&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,nt+1,0,0,ue,ae,Lt.image[_e]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,nt+1,ce,ue,ae,Lt.image[_e])}}}w(S)&&S.mipmapsAutoUpdate===!0&&v(s.TEXTURE_CUBE_MAP),le.__version=Q.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function dt(A,S,k,se,Q,le){const fe=r.convert(k.format,k.colorSpace),$=r.convert(k.type),J=b(k.internalFormat,fe,$,k.normalized,k.colorSpace),he=n.get(S),P=n.get(k);if(P.__renderTarget=S,!he.__hasExternalTextures){const K=Math.max(1,S.width>>le),Y=Math.max(1,S.height>>le);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?t.texImage3D(Q,le,J,K,Y,S.depth,0,fe,$,null):t.texImage2D(Q,le,J,K,Y,0,fe,$,null)}t.bindFramebuffer(s.FRAMEBUFFER,A),me(S)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,se,Q,P.__webglTexture,0,ht(S)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,se,Q,P.__webglTexture,le),t.bindFramebuffer(s.FRAMEBUFFER,null)}function wn(A,S,k){if(s.bindRenderbuffer(s.RENDERBUFFER,A),S.depthBuffer){const se=S.depthTexture,Q=se&&se.isDepthTexture?se.type:null,le=_(S.stencilBuffer,Q),fe=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;me(S)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ht(S),le,S.width,S.height):k?s.renderbufferStorageMultisample(s.RENDERBUFFER,ht(S),le,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,le,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,fe,s.RENDERBUFFER,A)}else{const se=S.textures;for(let Q=0;Q<se.length;Q++){const le=se[Q],fe=r.convert(le.format,le.colorSpace),$=r.convert(le.type),J=b(le.internalFormat,fe,$,le.normalized,le.colorSpace);me(S)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ht(S),J,S.width,S.height):k?s.renderbufferStorageMultisample(s.RENDERBUFFER,ht(S),J,S.width,S.height):s.renderbufferStorage(s.RENDERBUFFER,J,S.width,S.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Pt(A,S,k){const se=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Q=n.get(S.depthTexture);Q.__renderTarget=S;const le=se?S.depthTexture.image[0]:S.depthTexture.image;(!Q.__webglTexture||le.width!==S.width||le.height!==S.height)&&(le.width=S.width,le.height=S.height,S.depthTexture.needsUpdate=!0),se?Me(S.depthTexture,0):ve(S.depthTexture,0);const fe=Q.__webglTexture,$=ht(S),J=se?s.TEXTURE_CUBE_MAP_POSITIVE_X+k:s.TEXTURE_2D,he=S.depthTexture.format===ei?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(S.depthTexture.format===ii)me(S)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,he,J,fe,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,he,J,fe,0);else if(S.depthTexture.format===ei)me(S)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,he,J,fe,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,he,J,fe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function rn(A){const S=n.get(A),k=A.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==A.depthTexture){const se=A.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),se){const Q=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,se.removeEventListener("dispose",Q)};se.addEventListener("dispose",Q),S.__depthDisposeCallback=Q}S.__boundDepthTexture=se}if(A.depthTexture&&!S.__autoAllocateDepthBuffer)if(k)for(let se=0;se<6;se++)Pt(S.__webglFramebuffer[se],A,se);else A.texture.mipmaps.length>0?Pt(S.__webglFramebuffer[0],A,0):Pt(S.__webglFramebuffer,A,0);else if(k){S.__webglDepthbuffer=[];for(let se=0;se<6;se++)if(t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[se]),S.__webglDepthbuffer[se]===void 0)S.__webglDepthbuffer[se]=s.createRenderbuffer(),wn(S.__webglDepthbuffer[se],A,!1);else{const Q=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=S.__webglDepthbuffer[se];s.bindRenderbuffer(s.RENDERBUFFER,le),s.framebufferRenderbuffer(s.FRAMEBUFFER,Q,s.RENDERBUFFER,le)}}else if(A.texture.mipmaps.length>0?t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=s.createRenderbuffer(),wn(S.__webglDepthbuffer,A,!1);else{const Q=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=S.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,le),s.framebufferRenderbuffer(s.FRAMEBUFFER,Q,s.RENDERBUFFER,le)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function an(A,S,k){const se=n.get(A);S!==void 0&&dt(se.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),k!==void 0&&rn(A)}function on(A){const S=A.texture,k=n.get(A),se=n.get(S);A.addEventListener("dispose",O),L(A);const Q=A.textures,le=A.isWebGLCubeRenderTarget===!0,fe=Q.length>1;if(fe||(se.__webglTexture===void 0&&(se.__webglTexture=s.createTexture()),se.__version=S.version,a.memory.textures++),le){k.__webglFramebuffer=[];for(let $=0;$<6;$++)if(S.mipmaps.length>0){k.__webglFramebuffer[$]=[];for(let J=0;J<S.mipmaps.length;J++)k.__webglFramebuffer[$][J]=s.createFramebuffer()}else k.__webglFramebuffer[$]=s.createFramebuffer()}else{if(S.mipmaps.length>0){k.__webglFramebuffer=[];for(let $=0;$<S.mipmaps.length;$++)k.__webglFramebuffer[$]=s.createFramebuffer()}else k.__webglFramebuffer=s.createFramebuffer();if(fe)for(let $=0,J=Q.length;$<J;$++){const he=n.get(Q[$]);he.__webglTexture===void 0&&(he.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&me(A)===!1){k.__webglMultisampledFramebuffer=s.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let $=0;$<Q.length;$++){const J=Q[$];k.__webglColorRenderbuffer[$]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,k.__webglColorRenderbuffer[$]);const he=r.convert(J.format,J.colorSpace),P=r.convert(J.type),K=b(J.internalFormat,he,P,J.normalized,J.colorSpace,A.isXRRenderTarget===!0),Y=ht(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,Y,K,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+$,s.RENDERBUFFER,k.__webglColorRenderbuffer[$])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=s.createRenderbuffer(),wn(k.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(le){t.bindTexture(s.TEXTURE_CUBE_MAP,se.__webglTexture),tt(s.TEXTURE_CUBE_MAP,S);for(let $=0;$<6;$++)if(S.mipmaps.length>0)for(let J=0;J<S.mipmaps.length;J++)dt(k.__webglFramebuffer[$][J],A,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+$,J);else dt(k.__webglFramebuffer[$],A,S,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);w(S)?v(s.TEXTURE_CUBE_MAP):S.mipmaps.length>0&&s.texParameteri(s.TEXTURE_CUBE_MAP,s.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}else if(fe){for(let $=0,J=Q.length;$<J;$++){const he=Q[$],P=n.get(he);let K=s.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(K=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(K,P.__webglTexture),tt(K,he),dt(k.__webglFramebuffer,A,he,s.COLOR_ATTACHMENT0+$,K,0),w(he)&&v(K)}t.unbindTexture()}else{let $=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&($=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture($,se.__webglTexture),tt($,S),S.mipmaps.length>0)for(let J=0;J<S.mipmaps.length;J++)dt(k.__webglFramebuffer[J],A,S,s.COLOR_ATTACHMENT0,$,J);else dt(k.__webglFramebuffer,A,S,s.COLOR_ATTACHMENT0,$,0);w(S)?v($):S.mipmaps.length>0&&s.texParameteri($,s.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}A.depthBuffer&&rn(A)}function U(A){const S=A.textures;for(let k=0,se=S.length;k<se;k++){const Q=S[k];if(w(Q)&&Q.mipmapsAutoUpdate===!0){const le=T(A),fe=n.get(Q).__webglTexture;t.bindTexture(le,fe),v(le),t.unbindTexture()}}}const ln=[];function ct(A){if(A.samples>0){if(me(A)===!1){const S=A.textures,k=A.width,se=A.height;let Q=s.COLOR_BUFFER_BIT;const le=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,fe=n.get(A),$=S.length>1;if($)for(let he=0;he<S.length;he++)t.bindFramebuffer(s.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+he,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,fe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+he,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer),A.texture.mipmaps.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,fe.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let he=0;he<S.length;he++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),$){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,fe.__webglColorRenderbuffer[he]);const P=n.get(S[he]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,P,0)}s.blitFramebuffer(0,0,k,se,0,0,k,se,Q,s.NEAREST),c===!0&&(ln.length=0,ln.push(s.COLOR_ATTACHMENT0+he),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&ln.push(le),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ln))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),$)for(let he=0;he<S.length;he++){t.bindFramebuffer(s.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+he,s.RENDERBUFFER,fe.__webglColorRenderbuffer[he]);const P=n.get(S[he]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,fe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+he,s.TEXTURE_2D,P,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&c){const S=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[S])}}}function ht(A){return Math.min(i.maxSamples,A.samples)}function me(A){const S=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Tt(A){const S=a.render.frame;h.get(A)!==S&&(h.set(A,S),A.update())}function Ne(A,S){const k=A.colorSpace,se=A.format,Q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||k!==ur&&k!==Qn&&(Ke.getTransfer(k)===it?(se!==An||Q!==sn)&&Oe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):je("WebGLTextures: Unsupported texture color space:",k)),S}function Be(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=Ue,this.resetTextureUnits=j,this.getTextureUnits=ne,this.setTextureUnits=we,this.setTexture2D=ve,this.setTexture2DArray=be,this.setTexture3D=De,this.setTextureCube=Me,this.rebindTextures=an,this.setupRenderTarget=on,this.updateRenderTargetMipmap=U,this.updateMultisampleRenderTarget=ct,this.setupDepthRenderbuffer=rn,this.setupFrameBufferTexture=dt,this.useMultisampledRTT=me,this.dispose=B}function V0(s,e){function t(n,i=Qn){let r;const a=Ke.getTransfer(i);if(n===sn)return s.UNSIGNED_BYTE;if(n===to)return s.UNSIGNED_SHORT_4_4_4_4;if(n===no)return s.UNSIGNED_SHORT_5_5_5_1;if(n===oc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===lc)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===rc)return s.BYTE;if(n===ac)return s.SHORT;if(n===ps)return s.UNSIGNED_SHORT;if(n===eo)return s.INT;if(n===Cn)return s.UNSIGNED_INT;if(n===Sn)return s.FLOAT;if(n===Pn)return s.HALF_FLOAT;if(n===cc)return s.ALPHA;if(n===hc)return s.RGB;if(n===An)return s.RGBA;if(n===ii)return s.DEPTH_COMPONENT;if(n===ei)return s.DEPTH_STENCIL;if(n===io)return s.RED;if(n===so)return s.RED_INTEGER;if(n===pi)return s.RG;if(n===ro)return s.RG_INTEGER;if(n===ao)return s.RGBA_INTEGER;if(n===nr||n===ir||n===sr||n===rr)if(a===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===nr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ir)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===nr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ir)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===sr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===rr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===pa||n===ma||n===ga||n===_a)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===pa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ma)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ga)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===_a)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===xa||n===va||n===Ma||n===Sa||n===ya||n===cr||n===wa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===xa||n===va)return a===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ma)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Sa)return r.COMPRESSED_R11_EAC;if(n===ya)return r.COMPRESSED_SIGNED_R11_EAC;if(n===cr)return r.COMPRESSED_RG11_EAC;if(n===wa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ea||n===ba||n===Ta||n===Aa||n===Ra||n===Ca||n===Pa||n===La||n===Ia||n===Da||n===Na||n===Ua||n===Fa||n===Oa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ea)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ba)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ta)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Aa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ra)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ca)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Pa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===La)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ia)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Da)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Na)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ua)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Fa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Oa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ba||n===za||n===Ga)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ba)return a===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===za)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ga)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ka||n===Ha||n===hr||n===Va)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ka)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ha)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===hr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Va)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ki?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const W0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,X0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class q0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new wc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new gi({vertexShader:W0,fragmentShader:X0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new F(new ti(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Y0 extends _i{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const M=typeof XRWebGLBinding<"u",p=new q0,m={},x=t.getContextAttributes();let w=null,v=null;const T=[],b=[],_=new ye;let E=null,L=null;const C=new dn;C.viewport=new gt;const N=new dn;N.viewport=new gt;const O=[C,N],X=new id;let R=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ve=T[Z];return ve===void 0&&(ve=new Br,T[Z]=ve),ve.getTargetRaySpace()},this.getControllerGrip=function(Z){let ve=T[Z];return ve===void 0&&(ve=new Br,T[Z]=ve),ve.getGripSpace()},this.getHand=function(Z){let ve=T[Z];return ve===void 0&&(ve=new Br,T[Z]=ve),ve.getHandSpace()};function V(Z){const ve=b.indexOf(Z.inputSource);if(ve===-1)return;const be=T[ve];be!==void 0&&(be.update(Z.inputSource,Z.frame,l||a),be.dispatchEvent({type:Z.type,data:Z.inputSource}))}function z(){i.removeEventListener("select",V),i.removeEventListener("selectstart",V),i.removeEventListener("selectend",V),i.removeEventListener("squeeze",V),i.removeEventListener("squeezestart",V),i.removeEventListener("squeezeend",V),i.removeEventListener("end",z),i.removeEventListener("inputsourceschange",ie);for(let Z=0;Z<T.length;Z++){const ve=b[Z];ve!==null&&(b[Z]=null,T[Z].disconnect(ve))}R=null,B=null,p.reset();for(const Z in m)delete m[Z];if(e.setRenderTarget(w),f=null,d=null,u=null,i=null,v=null,Ue.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(_.width,_.height,!1),L!==null){const Z=L.camera;Z.fov=L.fov,Z.zoom=L.zoom,Z.updateProjectionMatrix(),L=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Oe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&Oe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Z){if(i=Z,i!==null){if(w=e.getRenderTarget(),i.addEventListener("select",V),i.addEventListener("selectstart",V),i.addEventListener("selectend",V),i.addEventListener("squeeze",V),i.addEventListener("squeezestart",V),i.addEventListener("squeezeend",V),i.addEventListener("end",z),i.addEventListener("inputsourceschange",ie),x.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(_),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let be=null,De=null,Me=null;x.depth&&(Me=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,be=x.stencil?ei:ii,De=x.stencil?ki:Cn);const ke={colorFormat:t.RGBA8,depthFormat:Me,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(ke),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Rn(d.textureWidth,d.textureHeight,{format:An,type:sn,depthTexture:new Hi(d.textureWidth,d.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,be),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const be={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,be),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Rn(f.framebufferWidth,f.framebufferHeight,{format:An,type:sn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),Ue.setContext(i),Ue.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function ie(Z){for(let ve=0;ve<Z.removed.length;ve++){const be=Z.removed[ve],De=b.indexOf(be);De>=0&&(b[De]=null,T[De].disconnect(be))}for(let ve=0;ve<Z.added.length;ve++){const be=Z.added[ve];let De=b.indexOf(be);if(De===-1){for(let ke=0;ke<T.length;ke++)if(ke>=b.length){b.push(be),De=ke;break}else if(b[ke]===null){b[ke]=be,De=ke;break}if(De===-1)break}const Me=T[De];Me&&Me.connect(be)}}function q(Z,ve){ve===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ve.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(i===null)return;let ve=Z.near,be=Z.far;p.texture!==null&&(p.depthNear>0&&(ve=p.depthNear),p.depthFar>0&&(be=p.depthFar)),X.near=N.near=C.near=ve,X.far=N.far=C.far=be,(R!==X.near||B!==X.far)&&(i.updateRenderState({depthNear:X.near,depthFar:X.far}),R=X.near,B=X.far),X.layers.mask=Z.layers.mask|6,C.layers.mask=X.layers.mask&-5,N.layers.mask=X.layers.mask&-3;const De=Z.parent,Me=X.cameras;q(X,De);for(let ke=0;ke<Me.length;ke++)q(Me[ke],De);X.projectionMatrix.copy(C.projectionMatrix),X.projectionMatrixInverse.copy(C.projectionMatrixInverse),L===null&&Z.isPerspectiveCamera&&(L={camera:Z,fov:Z.fov,zoom:Z.zoom}),j(Z,X,De)};function j(Z,ve,be){be===null?Z.matrix.copy(ve.matrixWorld):(Z.matrix.copy(be.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ve.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ve.projectionMatrix),Z.projectionMatrixInverse.copy(ve.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Xa*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return X},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(Z){c=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(X)},this.getCameraTexture=function(Z){return m[Z]};let ne=null;function we(Z,ve){if(h=ve.getViewerPose(l||a),g=ve,h!==null){const be=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let De=!1;be.length!==X.cameras.length&&(X.cameras.length=0,De=!0);for(let Fe=0;Fe<be.length;Fe++){const tt=be[Fe];let rt=null;if(f!==null)rt=f.getViewport(tt);else{const Ft=u.getViewSubImage(d,tt);rt=Ft.viewport,Fe===0&&(e.setRenderTargetTextures(v,Ft.colorTexture,Ft.depthStencilTexture),e.setRenderTarget(v))}let Ye=O[Fe];Ye===void 0&&(Ye=new dn,Ye.layers.enable(Fe),Ye.viewport=new gt,O[Fe]=Ye),Ye.matrix.fromArray(tt.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray(tt.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(rt.x,rt.y,rt.width,rt.height),Fe===0&&(X.matrix.copy(Ye.matrix),X.matrix.decompose(X.position,X.quaternion,X.scale)),De===!0&&X.cameras.push(Ye)}const Me=i.enabledFeatures;if(Me&&Me.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&M){u=n.getBinding();const Fe=u.getDepthInformation(be[0]);Fe&&Fe.isValid&&Fe.texture&&p.init(Fe,i.renderState)}if(Me&&Me.includes("camera-access")&&M){e.state.unbindTexture(),u=n.getBinding();for(let Fe=0;Fe<be.length;Fe++){const tt=be[Fe].camera;if(tt){let rt=m[tt];rt||(rt=new wc,m[tt]=rt);const Ye=u.getCameraImage(tt);rt.sourceTexture=Ye}}}}for(let be=0;be<T.length;be++){const De=b[be],Me=T[be];De!==null&&Me!==void 0&&Me.update(De,ve,l||a)}ne&&ne(Z,ve),ve.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ve}),g=null}const Ue=new zc;Ue.setAnimationLoop(we),this.setAnimationLoop=function(Z){ne=Z},this.dispose=function(){}}}const $0=new st,Jc=new ze;Jc.set(-1,0,0,0,1,0,0,0,1);function J0(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Uc(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,x,w,v){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),u(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,v)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),M(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?c(p,m,x,w):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Kt&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Kt&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const x=e.get(m),w=x.envMap,v=x.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4($0.makeRotationFromEuler(v)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Jc),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,x,w){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*x,p.scale.value=w*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,x){p.ior.value=m.ior,m.diffuseRoughness>0&&(p.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=m.diffuseRoughnessMap,t(m.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Kt&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function M(p,m){const x=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Z0(s,e,t,n){let i={},r={};function a(x,w){const v=w.program;n.uniformBlockBinding(x,v,i[x.id])}function o(x,w){let v=i[x.id];v===void 0&&(g(x),v=c(x),i[x.id]=v,x.addEventListener("dispose",p));const T=w.program;n.updateUBOMapping(x,T);const b=e.render.frame;r[x.id]!==b&&(l(x),r[x.id]=b)}function c(x){const w=s.createBuffer(),v=x.__size,T=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,w),s.bufferData(s.UNIFORM_BUFFER,v,T),s.bindBuffer(s.UNIFORM_BUFFER,null),w}function l(x){const w=i[x.id],v=x.uniforms,T=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,w);for(let b=0,_=v.length;b<_;b++){const E=v[b];if(Array.isArray(E))for(let L=0,C=E.length;L<C;L++)h(E[L],b,L,T);else h(E,b,0,T)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function h(x,w,v,T){if(d(x,w,v,T)===!0){const b=x.__offset,_=x.value;if(Array.isArray(_)){let E=0;for(let L=0;L<_.length;L++){const C=_[L],N=M(C,!0);u(C,x.__data,E),E+=N.storage/Float32Array.BYTES_PER_ELEMENT}}else u(_,x.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,b,x.__data)}}function u(x,w,v){typeof x=="number"||typeof x=="boolean"?w[v]=x:x.isMatrix3?(w[v]=x.elements[0],w[v+1]=x.elements[1],w[v+2]=x.elements[2],w[v+3]=0,w[v+4]=x.elements[3],w[v+5]=x.elements[4],w[v+6]=x.elements[5],w[v+7]=0,w[v+8]=x.elements[6],w[v+9]=x.elements[7],w[v+10]=x.elements[8],w[v+11]=0):ArrayBuffer.isView(x)?w.set(x.subarray(0,w.length-v),v):x.toArray(w,v)}function d(x,w,v,T){const b=x.value,_=w+"_"+v;if(Array.isArray(b)){T[_]===void 0&&(T[_]=[]);const E=T[_];let L=!1;for(let C=0;C<b.length;C++)f(b[C],E,C)===!0&&(L=!0);return L}return f(b,T,_)}function f(x,w,v){if(w[v]===void 0)return typeof x=="number"||typeof x=="boolean"?w[v]=x:ArrayBuffer.isView(x)?w[v]=x.slice():w[v]=x.clone(),!0;{const T=w[v];if(typeof x=="number"||typeof x=="boolean"){if(T!==x)return w[v]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(T.equals(x)===!1)return T.copy(x),!0}}return!1}function g(x){const w=x.uniforms;let v=0;const T=16;for(let _=0,E=w.length;_<E;_++){const L=Array.isArray(w[_])?w[_]:[w[_]];for(let C=0,N=L.length;C<N;C++){const O=L[C],X=Array.isArray(O.value)?O.value:[O.value],R=Array.isArray(w[_])||Array.isArray(O.value);let B=v;for(let z=0,ie=X.length;z<ie;z++){const q=X[z],j=M(q,R),ne=v%T,we=ne%j.boundary,Ue=ne+we;v+=we,Ue!==0&&T-Ue<j.storage&&(v+=T-Ue),z===0&&(B=v),v+=j.storage}const V=O.type==="int"?Int32Array:O.type==="uint"?Uint32Array:Float32Array;O.__data=new V((v-B)/Float32Array.BYTES_PER_ELEMENT),O.__offset=B}}const b=v%T;return b>0&&(v+=T-b),x.__size=v,x.__cache={},this}function M(x,w){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=16,v.storage=48):x.isMatrix4?(v.boundary=16,v.storage=64):x.isTexture?Oe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(v.boundary=16,v.storage=x.byteLength):Oe("WebGLRenderer: Unsupported uniform value type.",x),w===!0&&(v.boundary=16,v.storage=Math.ceil(v.storage/16)*16),v}function p(x){const w=x.target;w.removeEventListener("dispose",p),s.deleteBuffer(i[w.id]),delete i[w.id],delete r[w.id]}function m(){for(const x in i)s.deleteBuffer(i[x]);i={},r={}}return{bind:a,update:o,dispose:m}}const K0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let bn=null;function Q0(){return bn===null&&(bn=new Mc(K0,16,16,pi,Pn),bn.name="DFG_LUT",bn.minFilter=Zt,bn.magFilter=Zt,bn.wrapS=Gn,bn.wrapT=Gn,bn.generateMipmaps=!1,bn.needsUpdate=!0),bn}class j0{constructor(e={}){const{canvas:t=Oh(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=sn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const M=f,p=new Set([ao,ro,so]),m=new Set([sn,Cn,ps,ki,to,no]),x=new Uint32Array(4),w=new Int32Array(4),v={textures:[],min:[],max:[],resolution:[]};let T=null,b=null;const _=[],E=[];let L=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=kn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let N=!1,O=null,X=null,R=null,B=null;this._outputColorSpace=un;let V=0,z=0,ie=null,q=-1,j=null;const ne=new gt,we=new gt;let Ue=null;const Z=new Ie(0);let ve=0,be=t.width,De=t.height,Me=1,ke=null,Mt=null;const Fe=new gt(0,0,be,De),tt=new gt(0,0,be,De);let rt=!1;const Ye=new gs,Ft=new ho;let bt=!1,Jt=!1;const dt=new st,wn=new D,Pt=new gt,rn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let an=!1;function on(){return ie===null?Me:1}let U=n;function ln(y,I){return t.getContext(y,I)}let ct,ht,me,Tt,Ne,Be,A,S,k,se,Q,le,fe,$,J,he,P,K,Y,ue,ae,ce,Pe;try{const y={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ja}`),t.addEventListener("webglcontextlost",Le,!1),t.addEventListener("webglcontextrestored",He,!1),t.addEventListener("webglcontextcreationerror",_e,!1),U===null){const I="webgl2";if(U=ln(I,y),U===null)throw ln(I)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ve()}catch(y){throw t.removeEventListener("webglcontextlost",Le,!1),t.removeEventListener("webglcontextrestored",He,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),je("WebGLRenderer: "+y.message),y}function Ve(){ct=new nm(U),ct.init(),ae=new V0(U,ct),ht=new Xp(U,ct,e,ae),me=new k0(U,ct),ht.reversedDepthBuffer&&d&&me.buffers.depth.setReversed(!0),X=U.createFramebuffer(),R=U.createFramebuffer(),B=U.createFramebuffer(),Tt=new rm(U),Ne=new A0,Be=new H0(U,ct,me,Ne,ht,ae,Tt),A=new tm(C),S=new ad(U),ce=new Vp(U,S),k=new im(U,S,Tt,ce),se=new om(U,k,S,ce,Tt),K=new am(U,ht,Be),J=new qp(Ne),Q=new T0(C,A,ct,ht,ce,J),le=new J0(C,Ne),fe=new C0,$=new U0(ct),P=new Hp(C,A,me,se,g,c),he=new G0(C,se,ht),Pe=new Z0(U,Tt,ht,me),Y=new Wp(U,ct,Tt),ue=new sm(U,ct,Tt),Tt.programs=Q.programs,C.capabilities=ht,C.extensions=ct,C.properties=Ne,C.renderLists=fe,C.shadowMap=he,C.state=me,C.info=Tt}M!==sn&&(L=new cm(M,t.width,t.height,o,i,r));const re=new Y0(C,U);this.xr=re,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const y=ct.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=ct.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return Me},this.setPixelRatio=function(y){y!==void 0&&(Me=y,this.setSize(be,De,!1))},this.getSize=function(y){return y.set(be,De)},this.setSize=function(y,I,W=!0){if(re.isPresenting){Oe("WebGLRenderer: Can't change size while VR device is presenting.");return}be=y,De=I,t.width=Math.floor(y*Me),t.height=Math.floor(I*Me),W===!0&&(t.style.width=y+"px",t.style.height=I+"px"),L!==null&&L.setSize(t.width,t.height),this.setViewport(0,0,y,I)},this.getDrawingBufferSize=function(y){return y.set(be*Me,De*Me).floor()},this.setDrawingBufferSize=function(y,I,W){be=y,De=I,Me=W,t.width=Math.floor(y*W),t.height=Math.floor(I*W),this.setViewport(0,0,y,I)},this.setEffects=function(y){if(M===sn){je("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let I=0;I<y.length;I++)if(y[I].isOutputPass===!0){Oe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}L.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(ne)},this.getViewport=function(y){return y.copy(Fe)},this.setViewport=function(y,I,W,G){y.isVector4?Fe.set(y.x,y.y,y.z,y.w):Fe.set(y,I,W,G),me.viewport(ne.copy(Fe).multiplyScalar(on()).round())},this.getScissor=function(y){return y.copy(tt)},this.setScissor=function(y,I,W,G){y.isVector4?tt.set(y.x,y.y,y.z,y.w):tt.set(y,I,W,G),me.scissor(we.copy(tt).multiplyScalar(on()).round())},this.getScissorTest=function(){return rt},this.setScissorTest=function(y){me.setScissorTest(rt=y)},this.setOpaqueSort=function(y){ke=y},this.setTransparentSort=function(y){Mt=y},this.getClearColor=function(y){return y.copy(P.getClearColor())},this.setClearColor=function(){P.setClearColor(...arguments)},this.getClearAlpha=function(){return P.getClearAlpha()},this.setClearAlpha=function(){P.setClearAlpha(...arguments)},this.clear=function(y=!0,I=!0,W=!0){let G=0;if(y){let H=!1;if(ie!==null){const pe=ie.texture.format;H=p.has(pe)}if(H){const pe=ie.texture.type,Ee=m.has(pe),de=P.getClearColor(),Se=P.getClearAlpha(),Ce=de.r,Ge=de.g,$e=de.b;Ee?(x[0]=Ce,x[1]=Ge,x[2]=$e,x[3]=Se,U.clearBufferuiv(U.COLOR,0,x)):(w[0]=Ce,w[1]=Ge,w[2]=$e,w[3]=Se,U.clearBufferiv(U.COLOR,0,w))}else G|=U.COLOR_BUFFER_BIT}I&&(G|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(G|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&U.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),O=y},this.dispose=function(){t.removeEventListener("webglcontextlost",Le,!1),t.removeEventListener("webglcontextrestored",He,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),P.dispose(),fe.dispose(),$.dispose(),Be.dispose(),Ne.dispose(),A.dispose(),se.dispose(),k.dispose(),ce.dispose(),Pe.dispose(),Q.dispose(),re.dispose(),re.removeEventListener("sessionstart",wo),re.removeEventListener("sessionend",Eo),ri.stop()};function Le(y){y.preventDefault(),Ho("WebGLRenderer: Context Lost."),N=!0}function He(){Ho("WebGLRenderer: Context Restored."),N=!1;const y=Tt.autoReset,I=he.enabled,W=he.autoUpdate,G=he.needsUpdate,H=he.type;Ve(),Tt.autoReset=y,he.enabled=I,he.autoUpdate=W,he.needsUpdate=G,he.type=H}function _e(y){je("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function nt(y){const I=y.target;I.removeEventListener("dispose",nt),Lt(I)}function Lt(y){Vn(y),Ne.remove(y)}function Vn(y){const I=Ne.get(y).programs;I!==void 0&&(I.forEach(function(W){Q.releaseProgram(W)}),y.isShaderMaterial&&Q.releaseShaderCache(y))}this.renderBufferDirect=function(y,I,W,G,H,pe){I===null&&(I=rn);const Ee=H.isMesh&&H.matrixWorld.determinantAffine()<0,de=Qc(y,I,W,G,H);me.setMaterial(G,Ee);let Se=W.index,Ce=1;if(G.wireframe===!0){if(Se=k.getWireframeAttribute(W),Se===void 0)return;Ce=2}const Ge=W.drawRange,$e=W.attributes.position;let Te=Ge.start*Ce,Je=(Ge.start+Ge.count)*Ce;pe!==null&&(Te=Math.max(Te,pe.start*Ce),Je=Math.min(Je,(pe.start+pe.count)*Ce)),Se!==null?(Te=Math.max(Te,0),Je=Math.min(Je,Se.count)):$e!=null&&(Te=Math.max(Te,0),Je=Math.min(Je,$e.count));const St=Je-Te;if(St<0||St===1/0)return;ce.setup(H,G,de,W,Se);let ot,at=Y;if(Se!==null&&(ot=S.get(Se),at=ue,at.setIndex(ot)),H.isMesh)G.wireframe===!0?(me.setLineWidth(G.wireframeLinewidth*on()),at.setMode(U.LINES)):at.setMode(U.TRIANGLES);else if(H.isLine){let zt=G.linewidth;zt===void 0&&(zt=1),me.setLineWidth(zt*on()),H.isLineSegments?at.setMode(U.LINES):H.isLineLoop?at.setMode(U.LINE_LOOP):at.setMode(U.LINE_STRIP)}else H.isPoints?at.setMode(U.POINTS):H.isSprite&&at.setMode(U.TRIANGLES);if(H.isBatchedMesh)if(ct.get("WEBGL_multi_draw"))at.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const zt=H._multiDrawStarts,Ae=H._multiDrawCounts,qt=H._multiDrawCount,et=Se?S.get(Se).bytesPerElement:1,ai=Ne.get(G).currentProgram.getUniforms();for(let Gt=0;Gt<qt;Gt++)ai.setValue(U,"_gl_DrawID",Gt),at.render(zt[Gt]/et,Ae[Gt])}else if(H.isInstancedMesh)at.renderInstances(Te,St,H.count);else if(W.isInstancedBufferGeometry){const zt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Ae=Math.min(W.instanceCount,zt);at.renderInstances(Te,St,Ae)}else at.render(Te,St)};function yo(y,I,W,G){O!==null&&y.isNodeMaterial&&O.setObject(G,y),bt===!0&&J.setState(y,W,!1),y.transparent===!0&&y.side===At&&y.forceSinglePass===!1?(y.side=Kt,y.needsUpdate=!0,Yi(y,I,G),y.side=fi,y.needsUpdate=!0,Yi(y,I,G),y.side=At):Yi(y,I,G)}this.compile=function(y,I,W=null){W===null&&(W=y),O!==null&&O.renderStart(y,I,W),b=$.get(W),b.init(I),E.push(b),W.traverseVisible(function(H){H.isLight&&H.layers.test(I.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),y!==W&&y.traverseVisible(function(H){H.isLight&&H.layers.test(I.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),b.setupLights(),O!==null&&O.updateLights(b.state.lightsArray),Jt=this.localClippingEnabled,bt=J.init(this.clippingPlanes,Jt),bt===!0&&J.setGlobalState(this.clippingPlanes,I),O!==null&&he.render(b.state.shadowsArray,W,I);const G=new Set;return y.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const pe=H.material;if(pe)if(Array.isArray(pe))for(let Ee=0;Ee<pe.length;Ee++){const de=pe[Ee];yo(de,W,I,H),G.add(de)}else yo(pe,W,I,H),G.add(pe)}),b=E.pop(),O!==null&&O.renderEnd(),G},this.compileAsync=function(y,I,W=null){const G=this.compile(y,I,W);return new Promise(H=>{function pe(){if(G.forEach(function(Ee){const Se=Ne.get(Ee).currentProgram;(Se===void 0||Se.isReady())&&G.delete(Ee)}),G.size===0){H(y);return}setTimeout(pe,10)}ct.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let wr=null;function Zc(y){wr&&wr(y)}function wo(){ri.stop()}function Eo(){ri.start()}const ri=new zc;ri.setAnimationLoop(Zc),typeof self<"u"&&ri.setContext(self),this.setAnimationLoop=function(y){wr=y,re.setAnimationLoop(y),y===null?ri.stop():ri.start()},re.addEventListener("sessionstart",wo),re.addEventListener("sessionend",Eo),this.render=function(y,I){if(I!==void 0&&I.isCamera!==!0){je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;O!==null&&O.renderStart(y,I);const W=re.enabled===!0&&re.isPresenting===!0,G=L!==null&&(ie===null||W)&&L.begin(C,ie);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),re.enabled===!0&&re.isPresenting===!0&&(L===null||L.isCompositing()===!1)&&(re.cameraAutoUpdate===!0&&re.updateCamera(I),I=re.getCamera()),y.isScene===!0&&y.onBeforeRender(C,y,I,ie),b=$.get(y,E.length),b.init(I),b.state.textureUnits=Be.getTextureUnits(),E.push(b),dt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),I.isArrayCamera?Ft.setFromArrayCamera(I):Ye.setFromProjectionMatrix(dt,yn,I.reversedDepth),Jt=this.localClippingEnabled,bt=J.init(this.clippingPlanes,Jt),T=fe.get(y,_.length),T.init(),_.push(T),this.info.render.frame++,re.enabled===!0&&re.isPresenting===!0){const Ee=C.xr.getDepthSensingMesh();Ee!==null&&Er(Ee,I,-1/0,C.sortObjects)}Er(y,I,0,C.sortObjects),T.finish(),O!==null&&O.updateLights(b.state.lightsArray),C.sortObjects===!0&&T.sort(ke,Mt),an=re.enabled===!1||re.isPresenting===!1||re.hasDepthSensing()===!1,an&&P.addToRenderList(T,y),this.info.autoReset===!0&&this.info.reset(),bt===!0&&J.beginShadows();const H=b.state.shadowsArray;if(he.render(H,y,I),bt===!0&&J.endShadows(),(G&&L.hasRenderPass())===!1){const Ee=T.opaque,de=T.transmissive;if(b.setupLights(),I.isArrayCamera){const Se=I.cameras;if(de.length>0)for(let Ce=0,Ge=Se.length;Ce<Ge;Ce++){const $e=Se[Ce];To(Ee,de,y,$e)}an&&P.render(y);for(let Ce=0,Ge=Se.length;Ce<Ge;Ce++){const $e=Se[Ce];bo(T,y,$e,$e.viewport)}}else de.length>0&&To(Ee,de,y,I),an&&P.render(y),bo(T,y,I)}ie!==null&&z===0&&(Be.updateMultisampleRenderTarget(ie),Be.updateRenderTargetMipmap(ie)),G&&L.end(C),y.isScene===!0&&y.onAfterRender(C,y,I),ce.resetDefaultState(),q=-1,j=null,E.pop(),E.length>0?(b=E[E.length-1],Be.setTextureUnits(b.state.textureUnits),bt===!0&&J.setGlobalState(C.clippingPlanes,b.state.camera)):b=null,_.pop(),_.length>0?T=_[_.length-1]:T=null,O!==null&&O.renderEnd()};function Er(y,I,W,G){if(y.visible===!1)return;if(y.layers.test(I.layers)){if(y.isGroup)W=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(I);else if(y.isLight)b.pushLight(y),y.castShadow&&b.pushShadow(y);else if(y.isSprite){const Ee=I.isArrayCamera?Ft:Ye;if(!y.frustumCulled||y.intersectsFrustum(Ee)){G&&Pt.setFromMatrixPosition(y.matrixWorld).applyMatrix4(dt);const de=se.update(y),Se=y.material;Se.visible&&T.push(y,de,Se,W,Pt.z,null,I)}}else if(y.isMesh||y.isLine||y.isPoints){const Ee=I.isArrayCamera?Ft:Ye;if(!y.frustumCulled||y.intersectsFrustum(Ee)){const de=se.update(y),Se=y.material;if(G&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Pt.copy(y.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),Pt.copy(de.boundingSphere.center)),Pt.applyMatrix4(y.matrixWorld).applyMatrix4(dt)),Array.isArray(Se)){const Ce=de.groups;for(let Ge=0,$e=Ce.length;Ge<$e;Ge++){const Te=Ce[Ge],Je=Se[Te.materialIndex];Je&&Je.visible&&T.push(y,de,Je,W,Pt.z,Te,I)}}else Se.visible&&T.push(y,de,Se,W,Pt.z,null,I)}}}const pe=y.children;for(let Ee=0,de=pe.length;Ee<de;Ee++)Er(pe[Ee],I,W,G)}function bo(y,I,W,G){const{opaque:H,transmissive:pe,transparent:Ee}=y;b.setupLightsView(W),bt===!0&&J.setGlobalState(C.clippingPlanes,W),G&&me.viewport(ne.copy(G)),H.length>0&&Es(H,I,W),pe.length>0&&Es(pe,I,W),Ee.length>0&&Es(Ee,I,W),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function To(y,I,W,G){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[G.id]===void 0){const Te=ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[G.id]=new Rn(1,1,{generateMipmaps:!0,type:Te?Pn:sn,minFilter:jn,samples:Math.max(4,ht.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ke.workingColorSpace})}const pe=b.state.transmissionRenderTarget[G.id],Ee=G.viewport||ne;pe.setSize(Ee.z*C.transmissionResolutionScale,Ee.w*C.transmissionResolutionScale);const de=C.getRenderTarget(),Se=C.getActiveCubeFace(),Ce=C.getActiveMipmapLevel();C.setRenderTarget(pe),C.getClearColor(Z),ve=C.getClearAlpha(),ve<1&&C.setClearColor(16777215,.5),C.clear(),an&&P.render(W);const Ge=C.toneMapping;C.toneMapping=kn;const $e=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),b.setupLightsView(G),bt===!0&&J.setGlobalState(C.clippingPlanes,G),Es(y,W,G),Be.updateMultisampleRenderTarget(pe),Be.updateRenderTargetMipmap(pe),ct.has("WEBGL_multisampled_render_to_texture")===!1){let Te=!1;for(let Je=0,St=I.length;Je<St;Je++){const ot=I[Je],{object:at,geometry:zt,material:Ae,group:qt}=ot;if(Ae.side===At&&at.layers.test(G.layers)){const et=Ae.side;Ae.side=Kt,Ae.needsUpdate=!0,Ao(at,W,G,zt,Ae,qt),Ae.side=et,Ae.needsUpdate=!0,Te=!0}}Te===!0&&(Be.updateMultisampleRenderTarget(pe),Be.updateRenderTargetMipmap(pe))}C.setRenderTarget(de,Se,Ce),C.setClearColor(Z,ve),$e!==void 0&&(G.viewport=$e),C.toneMapping=Ge}function Es(y,I,W){const G=I.isScene===!0?I.overrideMaterial:null;for(let H=0,pe=y.length;H<pe;H++){const Ee=y[H],{object:de,geometry:Se,group:Ce}=Ee;let Ge=Ee.material;Ge.allowOverride===!0&&G!==null&&(Ge=G),de.layers.test(W.layers)&&Ao(de,I,W,Se,Ge,Ce)}}function Ao(y,I,W,G,H,pe){O!==null&&H.isNodeMaterial&&O.setObject(y,H),y.onBeforeRender(C,I,W,G,H,pe),y.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),H.onBeforeRender(C,I,W,G,y,pe),H.transparent===!0&&H.side===At&&H.forceSinglePass===!1?(H.side=Kt,H.needsUpdate=!0,C.renderBufferDirect(W,I,G,H,y,pe),H.side=fi,H.needsUpdate=!0,C.renderBufferDirect(W,I,G,H,y,pe),H.side=At):C.renderBufferDirect(W,I,G,H,y,pe),y.onAfterRender(C,I,W,G,H,pe)}function Ro(y){let I=0;for(const W of y)W.texture!==null&&I++;return I}function Yi(y,I,W){I.isScene!==!0&&(I=rn);const G=Ne.get(y),H=b.state.lights,pe=b.state.shadowsArray,Ee=H.state.version,de=Q.getParameters(y,H.state,pe,I,W,b.state.lightProbeGridArray),Se=Q.getProgramCacheKey(de);let Ce=G.programs;G.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?I.environment:null,G.fog=I.fog;const Ge=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;G.envMap=A.get(y.envMap||G.environment,Ge),G.envMapRotation=G.environment!==null&&y.envMap===null?I.environmentRotation:y.envMapRotation,Ce===void 0&&(y.addEventListener("dispose",nt),Ce=new Map,G.programs=Ce,G.programVariants=new Map);let $e=Ce.get(Se);if($e!==void 0){if(G.currentProgram===$e&&G.lightsStateVersion===Ee)return Po(y,de),$e}else de.uniforms=Q.getUniforms(y),O!==null&&y.isNodeMaterial&&O.build(y,W,de),y.onBeforeCompile(de,C),$e=Q.acquireProgram(de,Se),Ce.set(Se,$e),G.uniforms=de.uniforms;const Te=G.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Te.clippingPlanes=J.uniform),Po(y,de),G.needsLights=eh(y),G.lightsStateVersion=Ee,G.needsLights&&(Te.ambientLightColor.value=H.state.ambient,Te.lightProbe.value=H.state.probe,Te.sunLights.value=H.state.sun,Te.sunLightShadows.value=H.state.sunShadow,Te.directionalLights.value=H.state.directional,Te.directionalLightShadows.value=H.state.directionalShadow,Te.spotLights.value=H.state.spot,Te.spotLightShadows.value=H.state.spotShadow,Te.rectAreaLights.value=H.state.rectArea,Te.ltc_1.value=H.state.rectAreaLTC1,Te.ltc_2.value=H.state.rectAreaLTC2,Te.pointLights.value=H.state.point,Te.pointLightShadows.value=H.state.pointShadow,Te.hemisphereLights.value=H.state.hemi,Te.sunShadowMatrix.value=H.state.sunShadowMatrix,Te.sunShadowCascade.value=H.state.sunShadowCascade,Te.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Te.spotLightMatrix.value=H.state.spotLightMatrix,Te.spotLightMap.value=H.state.spotLightMap,Te.pointShadowMatrix.value=H.state.pointShadowMatrix),G.numLightProbeGrids=Ro(b.state.lightProbeGridArray),G.currentProgram=$e,G.uniformsList=null,$e}function Kc(y,I,W,G,H){const pe=Ne.get(y),Ee=pe.currentProgram.id+","+G+","+H;let de=pe.programVariants.get(Ee);return de===void 0?(de=Yi(y,I,W),pe.programVariants.set(Ee,de)):(pe.currentProgram=de,pe.uniformsList=null,pe.outputColorSpace=G,pe.toneMapping=H),de}function Co(y){if(y.uniformsList===null){const I=y.currentProgram.getUniforms();y.uniformsList=or.seqWithValue(I.seq,y.uniforms)}return y.uniformsList}function Po(y,I){const W=Ne.get(y);W.outputColorSpace=I.outputColorSpace,W.batching=I.batching,W.batchingColor=I.batchingColor,W.instancing=I.instancing,W.instancingColor=I.instancingColor,W.instancingMorph=I.instancingMorph,W.skinning=I.skinning,W.morphTargets=I.morphTargets,W.morphNormals=I.morphNormals,W.morphColors=I.morphColors,W.morphTargetsCount=I.morphTargetsCount,W.numClippingPlanes=I.numClippingPlanes,W.numIntersection=I.numClipIntersection,W.vertexAlphas=I.vertexAlphas,W.vertexTangents=I.vertexTangents,W.toneMapping=I.toneMapping}function Qc(y,I,W,G,H){I.isScene!==!0&&(I=rn),Be.resetTextureUnits();const pe=I.fog,Ee=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?I.environment:null,de=ie===null?C.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Ke.workingColorSpace,Se=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Ce=A.get(G.envMap||Ee,Se),Ge=G.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,$e=!!W.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Te=!!W.morphAttributes.position,Je=!!W.morphAttributes.normal,St=!!W.morphAttributes.color;let ot=kn;G.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(ot=C.toneMapping);const at=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,zt=at!==void 0?at.length:0,Ae=Ne.get(G),qt=b.state.lights;if(bt===!0&&(Jt===!0||y!==j)){const ft=y===j&&G.id===q;J.setState(G,y,ft)}let et=!1,ai=!1;G.version===Ae.__version?Ae.needsLights&&Ae.lightsStateVersion!==qt.state.version||H.isBatchedMesh&&Ae.batching===!1||!H.isBatchedMesh&&Ae.batching===!0||H.isBatchedMesh&&Ae.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&Ae.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&Ae.instancing===!1||!H.isInstancedMesh&&Ae.instancing===!0||H.isSkinnedMesh&&Ae.skinning===!1||!H.isSkinnedMesh&&Ae.skinning===!0||H.isInstancedMesh&&Ae.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ae.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ae.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ae.instancingMorph===!1&&H.morphTexture!==null||Ae.envMap!==Ce||G.fog===!0&&Ae.fog!==pe||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==J.numPlanes||Ae.numIntersection!==J.numIntersection)||Ae.vertexAlphas!==Ge||Ae.vertexTangents!==$e||Ae.morphTargets!==Te||Ae.morphNormals!==Je||Ae.morphColors!==St||Ae.morphTargetsCount!==zt||Ae.numLightProbeGrids!==Ro(b.state.lightProbeGridArray)?et=!0:(Ae.outputColorSpace!==de||Ae.toneMapping!==ot)&&(ai=!0):(et=!0,Ae.__version=G.version);let Gt=Ae.currentProgram;(et===!0||ai===!0)&&(Gt=ai===!0?Kc(G,I,H,de,ot):Yi(G,I,H),O&&G.isNodeMaterial&&O.onUpdateProgram(G,Gt,Ae));let bs=!1,Wn=!1,oi=!1;const Qe=Gt.getUniforms(),Ot=Ae.uniforms;if(me.useProgram(Gt.program)&&(bs=!0,Wn=!0,oi=!0),G.id!==q&&(q=G.id,Wn=!0),bs||j!==y){me.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),Qe.setValue(U,"projectionMatrix",y.projectionMatrix),Qe.setValue(U,"viewMatrix",y.matrixWorldInverse);const It=Qe.map.cameraPosition;It!==void 0&&It.setValue(U,wn.setFromMatrixPosition(y.matrixWorld)),ht.logarithmicDepthBuffer&&Qe.setValue(U,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Qe.setValue(U,"isOrthographic",y.isOrthographicCamera===!0),j!==y&&(j=y,Wn=!0,oi=!0)}if(Ae.needsLights&&(qt.state.sunShadowMap.length>0&&Qe.setValue(U,"sunShadowMap",qt.state.sunShadowMap,Be),qt.state.directionalShadowMap.length>0&&Qe.setValue(U,"directionalShadowMap",qt.state.directionalShadowMap,Be),qt.state.spotShadowMap.length>0&&Qe.setValue(U,"spotShadowMap",qt.state.spotShadowMap,Be),qt.state.pointShadowMap.length>0&&Qe.setValue(U,"pointShadowMap",qt.state.pointShadowMap,Be)),H.isSkinnedMesh){Qe.setOptional(U,H,"bindMatrix"),Qe.setOptional(U,H,"bindMatrixInverse");const ft=H.skeleton;ft&&(ft.boneTexture===null&&ft.computeBoneTexture(),Qe.setValue(U,"boneTexture",ft.boneTexture,Be))}H.isBatchedMesh&&(Qe.setOptional(U,H,"batchingTexture"),Qe.setValue(U,"batchingTexture",H._matricesTexture,Be),Qe.setOptional(U,H,"batchingIdTexture"),Qe.setValue(U,"batchingIdTexture",H._indirectTexture,Be),Qe.setOptional(U,H,"batchingColorTexture"),H._colorsTexture!==null&&Qe.setValue(U,"batchingColorTexture",H._colorsTexture,Be));const fn=W.morphAttributes;if((fn.position!==void 0||fn.normal!==void 0||fn.color!==void 0)&&K.update(H,W,Gt),(Wn||Ae.receiveShadow!==H.receiveShadow)&&(Ae.receiveShadow=H.receiveShadow,Qe.setValue(U,"receiveShadow",H.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&I.environment!==null&&(Ot.envMapIntensity.value=I.environmentIntensity),Ot.dfgLUT!==void 0&&(Ot.dfgLUT.value=Q0()),Wn){if(Qe.setValue(U,"toneMappingExposure",C.toneMappingExposure),Ae.needsLights&&jc(Ot,oi),pe&&G.fog===!0&&le.refreshFogUniforms(Ot,pe),le.refreshMaterialUniforms(Ot,G,Me,De,b.state.transmissionRenderTarget[y.id]),Ae.needsLights&&Ae.numLightProbeGrids>0){const ft=v;let It=0;for(const In of b.state.lightProbeGridArray)In.texture!==null&&(ft.textures[It]=In.texture,ft.min[It]=In.boundingBox.min,ft.max[It]=In.boundingBox.max,ft.resolution[It]=In.resolution,It++);for(const In in ft)ft[In].length=It;Ot.probesSH.value=ft.textures,Ot.probesMin.value=ft.min,Ot.probesMax.value=ft.max,Ot.probesResolution.value=ft.resolution}or.upload(U,Co(Ae),Ot,Be)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(or.upload(U,Co(Ae),Ot,Be),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Qe.setValue(U,"center",H.center),Qe.setValue(U,"modelViewMatrix",H.modelViewMatrix),Qe.setValue(U,"normalMatrix",H.normalMatrix),Qe.setValue(U,"modelMatrix",H.matrixWorld),G.uniformsGroups!==void 0){const ft=G.uniformsGroups;for(let It=0,In=ft.length;It<In;It++){const Io=ft[It];Pe.update(Io,Gt),Pe.bind(Io,Gt)}}return Gt}function jc(y,I){y.ambientLightColor.needsUpdate=I,y.lightProbe.needsUpdate=I,y.sunLights.needsUpdate=I,y.sunLightShadows.needsUpdate=I,y.directionalLights.needsUpdate=I,y.directionalLightShadows.needsUpdate=I,y.pointLights.needsUpdate=I,y.pointLightShadows.needsUpdate=I,y.spotLights.needsUpdate=I,y.spotLightShadows.needsUpdate=I,y.rectAreaLights.needsUpdate=I,y.hemisphereLights.needsUpdate=I}function eh(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return ie},this.setRenderTargetTextures=function(y,I,W){const G=Ne.get(y);G.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),Ne.get(y.texture).__webglTexture=I,Ne.get(y.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:W,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,I){const W=Ne.get(y);W.__webglFramebuffer=I,W.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(y,I=0,W=0){ie=y,V=I,z=W;let G=null,H=!1,pe=!1;if(y){const de=Ne.get(y);if(de.__useDefaultFramebuffer!==void 0){me.bindFramebuffer(U.FRAMEBUFFER,de.__webglFramebuffer),ne.copy(y.viewport),we.copy(y.scissor),Ue=y.scissorTest,me.viewport(ne),me.scissor(we),me.setScissorTest(Ue),q=-1;return}else if(de.__webglFramebuffer===void 0)Be.setupRenderTarget(y);else if(de.__hasExternalTextures)Be.rebindTextures(y,Ne.get(y.texture).__webglTexture,Ne.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Ge=y.depthTexture;if(de.__boundDepthTexture!==Ge){if(Ge!==null&&Ne.has(Ge)&&(y.width!==Ge.image.width||y.height!==Ge.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Be.setupDepthRenderbuffer(y)}}const Se=y.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(pe=!0);const Ce=Ne.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ce[I])?G=Ce[I][W]:G=Ce[I],H=!0):y.samples>0&&Be.useMultisampledRTT(y)===!1?G=Ne.get(y).__webglMultisampledFramebuffer:Array.isArray(Ce)?G=Ce[W]:G=Ce,ne.copy(y.viewport),we.copy(y.scissor),Ue=y.scissorTest}else ne.copy(Fe).multiplyScalar(Me).floor(),we.copy(tt).multiplyScalar(Me).floor(),Ue=rt;if(W!==0&&(G=X),me.bindFramebuffer(U.FRAMEBUFFER,G)&&me.drawBuffers(y,G),me.viewport(ne),me.scissor(we),me.setScissorTest(Ue),H){const de=Ne.get(y.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+I,de.__webglTexture,W)}else if(pe){const de=I;for(let Se=0;Se<y.textures.length;Se++){const Ce=Ne.get(y.textures[Se]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Se,Ce.__webglTexture,W,de)}}else if(y!==null&&W!==0){const de=Ne.get(y.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,de.__webglTexture,W)}q=-1};function Lo(y){const I=Ne.get(y);return(I.__readFormat!==y.format||I.__readType!==y.type)&&(I.__readFormat=y.format,I.__readType=y.type,I.__formatReadable=ht.textureFormatReadable(y.format),I.__typeReadable=ht.textureTypeReadable(y.type)),I}this.readRenderTargetPixels=function(y,I,W,G,H,pe,Ee,de=0){if(!(y&&y.isWebGLRenderTarget)){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ne.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ee!==void 0&&(Se=Se[Ee],Array.isArray(Se)&&(Se=Se[0])),Se){me.bindFramebuffer(U.FRAMEBUFFER,Se);try{const Ce=y.textures[de],Ge=Ce.format,$e=Ce.type;y.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+de);const Te=Lo(Ce);if(Te.__formatReadable===!1){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Te.__typeReadable===!1){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=y.width-G&&W>=0&&W<=y.height-H&&U.readPixels(I,W,G,H,ae.convert(Ge),ae.convert($e),pe)}finally{const Ce=ie!==null?Ne.get(ie).__webglFramebuffer:null;me.bindFramebuffer(U.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(y,I,W,G,H,pe,Ee,de=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Ne.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ee!==void 0&&(Se=Se[Ee],Array.isArray(Se)&&(Se=Se[0])),Se)if(I>=0&&I<=y.width-G&&W>=0&&W<=y.height-H){me.bindFramebuffer(U.FRAMEBUFFER,Se);const Ce=y.textures[de],Ge=Ce.format,$e=Ce.type;y.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+de);const Te=Lo(Ce);if(Te.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Te.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Je=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Je),U.bufferData(U.PIXEL_PACK_BUFFER,pe.byteLength,U.STREAM_READ),U.readPixels(I,W,G,H,ae.convert(Ge),ae.convert($e),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);const St=ie!==null?Ne.get(ie).__webglFramebuffer:null;me.bindFramebuffer(U.FRAMEBUFFER,St);const ot=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Bh(U,ot,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Je),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,pe),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(Je),U.deleteSync(ot),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,I=null,W=0){const G=Math.pow(2,-W),H=Math.floor(y.image.width*G),pe=Math.floor(y.image.height*G),Ee=I!==null?I.x:0,de=I!==null?I.y:0;Be.setTexture2D(y,0),U.copyTexSubImage2D(U.TEXTURE_2D,W,0,0,Ee,de,H,pe),me.unbindTexture()},this.copyTextureToTexture=function(y,I,W=null,G=null,H=0,pe=0){let Ee,de,Se,Ce,Ge,$e,Te,Je,St;const ot=y.isCompressedTexture?y.mipmaps[pe]:y.image;if(W!==null)Ee=W.max.x-W.min.x,de=W.max.y-W.min.y,Se=W.isBox3?W.max.z-W.min.z:1,Ce=W.min.x,Ge=W.min.y,$e=W.isBox3?W.min.z:0;else{const Qe=Math.pow(2,-H);Ee=Math.floor(ot.width*Qe),de=Math.floor(ot.height*Qe),y.isDataArrayTexture?Se=ot.depth:y.isData3DTexture?Se=Math.floor(ot.depth*Qe):Se=1,Ce=0,Ge=0,$e=0}G!==null?(Te=G.x,Je=G.y,St=G.z):(Te=0,Je=0,St=0);const at=ae.convert(I.format),zt=ae.convert(I.type);let Ae;I.isData3DTexture?(Be.setTexture3D(I,0),Ae=U.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(Be.setTexture2DArray(I,0),Ae=U.TEXTURE_2D_ARRAY):(Be.setTexture2D(I,0),Ae=U.TEXTURE_2D),me.activeTexture(U.TEXTURE0),me.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,I.flipY),me.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),me.pixelStorei(U.UNPACK_ALIGNMENT,I.unpackAlignment);const qt=me.getParameter(U.UNPACK_ROW_LENGTH),et=me.getParameter(U.UNPACK_IMAGE_HEIGHT),ai=me.getParameter(U.UNPACK_SKIP_PIXELS),Gt=me.getParameter(U.UNPACK_SKIP_ROWS),bs=me.getParameter(U.UNPACK_SKIP_IMAGES);me.pixelStorei(U.UNPACK_ROW_LENGTH,ot.width),me.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ot.height),me.pixelStorei(U.UNPACK_SKIP_PIXELS,Ce),me.pixelStorei(U.UNPACK_SKIP_ROWS,Ge),me.pixelStorei(U.UNPACK_SKIP_IMAGES,$e);const Wn=y.isDataArrayTexture||y.isData3DTexture,oi=I.isDataArrayTexture||I.isData3DTexture;if(y.isDepthTexture){const Qe=Ne.get(y),Ot=Ne.get(I),fn=Ne.get(Qe.__renderTarget),ft=Ne.get(Ot.__renderTarget);me.bindFramebuffer(U.READ_FRAMEBUFFER,fn.__webglFramebuffer),me.bindFramebuffer(U.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let It=0;It<Se;It++)Wn&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ne.get(y).__webglTexture,H,$e+It),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ne.get(I).__webglTexture,pe,St+It)),U.blitFramebuffer(Ce,Ge,Ce+Ee,Ge+de,Te,Je,Te+Ee,Je+de,U.DEPTH_BUFFER_BIT,U.NEAREST);me.bindFramebuffer(U.READ_FRAMEBUFFER,null),me.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(H!==0||y.isRenderTargetTexture||Ne.has(y)){const Qe=Ne.get(y),Ot=Ne.get(I);me.bindFramebuffer(U.READ_FRAMEBUFFER,R),me.bindFramebuffer(U.DRAW_FRAMEBUFFER,B);for(let fn=0;fn<Se;fn++)Wn?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Qe.__webglTexture,H,$e+fn):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Qe.__webglTexture,H),oi?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ot.__webglTexture,pe,St+fn):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ot.__webglTexture,pe),H!==0?U.blitFramebuffer(Ce,Ge,Ce+Ee,Ge+de,Te,Je,Te+Ee,Je+de,U.COLOR_BUFFER_BIT,U.NEAREST):oi?U.copyTexSubImage3D(Ae,pe,Te,Je,St+fn,Ce,Ge,Ee,de):U.copyTexSubImage2D(Ae,pe,Te,Je,Ce,Ge,Ee,de);me.bindFramebuffer(U.READ_FRAMEBUFFER,null),me.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else oi?y.isDataTexture||y.isData3DTexture?U.texSubImage3D(Ae,pe,Te,Je,St,Ee,de,Se,at,zt,ot.data):I.isCompressedArrayTexture?U.compressedTexSubImage3D(Ae,pe,Te,Je,St,Ee,de,Se,at,ot.data):U.texSubImage3D(Ae,pe,Te,Je,St,Ee,de,Se,at,zt,ot):y.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,pe,Te,Je,Ee,de,at,zt,ot.data):y.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,pe,Te,Je,ot.width,ot.height,at,ot.data):U.texSubImage2D(U.TEXTURE_2D,pe,Te,Je,Ee,de,at,zt,ot);me.pixelStorei(U.UNPACK_ROW_LENGTH,qt),me.pixelStorei(U.UNPACK_IMAGE_HEIGHT,et),me.pixelStorei(U.UNPACK_SKIP_PIXELS,ai),me.pixelStorei(U.UNPACK_SKIP_ROWS,Gt),me.pixelStorei(U.UNPACK_SKIP_IMAGES,bs),pe===0&&I.generateMipmaps===!0&&I.mipmapsAutoUpdate===!0&&U.generateMipmap(Ae),me.unbindTexture()},this.initRenderTarget=function(y){Ne.get(y).__webglFramebuffer===void 0&&Be.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Be.setTextureCube(y,0):y.isData3DTexture?Be.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Be.setTexture2DArray(y,0):Be.setTexture2D(y,0),me.unbindTexture()},this.resetState=function(){V=0,z=0,ie=null,me.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}}const xt=s=>s/Wt-tn/2,vt=s=>s/Wt-nn/2,_n=s=>s+.5-tn/2,xn=s=>s+.5-nn/2,Wl=s=>s/Wt,eg=new D(0,1,0),er=(s,e,t)=>{const n=Math.hypot(e,t)||.001;return s.quaternion.setFromUnitVectors(eg,new D(e/n,0,t/n)),n};function tg(s,e=Wt*.32){if(s.length<3)return s;const t=[s[0]];for(let n=1;n<s.length-1;n++){const i=s[n-1],r=s[n],a=s[n+1],o=Math.hypot(r.x-i.x,r.y-i.y),c=Math.hypot(a.x-r.x,a.y-r.y);if(o<1||c<1){t.push(r);continue}const l=(r.x-i.x)/o,h=(r.y-i.y)/o,u=(a.x-r.x)/c,d=(a.y-r.y)/c;if(Math.abs(l*d-h*u)<.05){t.push(r);continue}const f=Math.min(e,o*.45),g=Math.min(e,c*.45);t.push({x:r.x-l*f,y:r.y-h*f}),t.push({x:r.x+u*g,y:r.y+d*g})}return t.push(s[s.length-1]),t}function tr(s,e,t){const n=tg(s),i=[],r=[],a=[];for(let c=0;c<n.length;c++){const l=n[Math.max(0,c-1)],h=n[Math.min(n.length-1,c+1)];let u=h.x-l.x,d=h.y-l.y;const f=Math.hypot(u,d)||1;u/=f,d/=f;const g=-d*e*.5,M=u*e*.5,p=xt(n[c].x),m=vt(n[c].y);i.push(p+g,t,m+M,p-g,t,m-M),r.push(0,c,1,c)}for(let c=0;c<n.length-1;c++){const l=c*2,h=c*2+1,u=(c+1)*2,d=(c+1)*2+1;a.push(l,h,u,h,d,u)}const o=new Ut;return o.setAttribute("position",new Xe(i,3)),o.setAttribute("uv",new Xe(r,2)),o.setIndex(a),o.computeVertexNormals(),o}function ut(s){const e=Math.sin(s*127.1+311.7)*43758.5453;return e-Math.floor(e)}function zn(s,e){const n=document.createElement("canvas");n.width=n.height=256;const i=n.getContext("2d");i.fillStyle=s,i.fillRect(0,0,256,256);for(let a=0;a<90;a++){const o=ut(a*1.7)*256,c=ut(a*2.3+7)*256,l=12+ut(a*3.1)*46;i.globalAlpha=.05+ut(a*4.7)*.1,i.fillStyle=e.blotches[a%e.blotches.length],i.beginPath(),i.ellipse(o,c,l,l*(.5+ut(a*5.9)*.7),ut(a)*6.28,0,6.28),i.fill()}i.globalAlpha=1;for(let a=0;a<1300;a++){const o=ut(a*6.1+3)*256,c=ut(a*7.3+11)*256;i.globalAlpha=.1+ut(a*8.9)*.24,i.fillStyle=e.speckles[a%e.speckles.length];const l=.6+ut(a*9.7)*2.4;i.fillRect(o,c,l,l)}if(e.streaks){i.globalAlpha=.12,i.strokeStyle=e.speckles[0],i.lineWidth=1;for(let a=0;a<40;a++){const o=ut(a*10.1)*256;i.beginPath(),i.moveTo(0,o),i.bezierCurveTo(256*.3,o+ut(a)*8-4,256*.7,o+ut(a+1)*8-4,256,o),i.stroke()}}i.globalAlpha=1;const r=new fu(n);return r.wrapS=r.wrapT=lr,r.repeat.set(...e.repeat),r.anisotropy=4,r}function ng(s){const e=s.deco,t=s.ground;return e==="desert"?zn(t,{repeat:[8,5],blotches:["#c8a06a","#7c623d","#e0c08a"],speckles:["#e8cf9a","#6b5433"],streaks:!0}):e==="snow"?zn(t,{repeat:[8,5],blotches:["#ffffff","#9fb8c4","#dceaf0"],speckles:["#ffffff","#8ba6b4"]}):e==="city"||e==="rails"||e==="space"?zn(t,{repeat:[10,6],blotches:["#6b6f76","#3d4048","#8f939c"],speckles:["#a9adb6","#2b2e33"]}):e==="reeds"?zn(t,{repeat:[8,5],blotches:["#5a7645","#2d4a36","#7a8f52"],speckles:["#9db55f","#27402d"],streaks:!0}):zn(t,{repeat:[8,5],blotches:["#5c7747","#25402c","#778a4e"],speckles:["#9cb25c","#223a28"]})}function ig(s){const e=s.deco;return e==="city"||e==="space"||e==="rails"?zn(s.path,{repeat:[1,.16],blotches:["#9aa0a8","#5a5d64"],speckles:["#c8ccd2","#43464c"]}):e==="snow"?zn(s.path,{repeat:[1,.16],blotches:["#c9cfc9","#8e9a92"],speckles:["#e6ece8","#78847c"]}):zn(s.path,{repeat:[1,.16],blotches:["#9a8256","#5a4a2e"],speckles:["#c4ac72","#4c3d24"],streaks:!0})}function sg(s){return zn(s,{repeat:[1,.2],blotches:["#6fb4cf","#0e4258"],speckles:["#cfeaf4","#12506a"],streaks:!0})}function te(s,e={}){return new Ju({color:s,roughness:.75,metalness:.12,...e})}function ee(s){return s.castShadow=!0,s.receiveShadow=!0,s}function ra(s,e,t,n){const i=[{z:-s*.5,w:e*.38},{z:-s*.32,w:e*.78},{z:-s*.05,w:e},{z:s*.22,w:e*.95},{z:s*.4,w:e*.62},{z:s*.5,w:e*.1}],r=[],a=[],o=7;i.forEach(l=>{const h=l.w*.5;[[-h,n],[-h*.86,n-t*.52],[-h*.5,n-t],[h*.5,n-t],[h*.86,n-t*.52],[h,n],[0,n]].forEach(([d,f])=>r.push(d,f,l.z))});for(let l=0;l<i.length-1;l++)for(let h=0;h<o-1;h++){const u=l*o+h,d=u+1,f=(l+1)*o+h,g=f+1;a.push(u,f,d,d,f,g)}const c=new Ut;return c.setAttribute("position",new Xe(r,3)),c.setIndex(a),c.computeVertexNormals(),c}function Xl(s,e){const t=new Pc;return t.moveTo(-e*.5,-s*.42),t.lineTo(-e*.42,-s*.5),t.lineTo(e*.42,-s*.5),t.lineTo(e*.5,-s*.42),t.lineTo(e*.48,s*.3),t.lineTo(e*.2,s*.5),t.lineTo(-e*.2,s*.5),t.lineTo(-e*.48,s*.3),t.closePath(),t}function Zn(s){s.traverse(e=>{const t=e;t.geometry&&t.geometry.dispose();const n=t.material;Array.isArray(n)?n.forEach(i=>i.dispose()):n&&n.dispose()})}class rg{constructor(e){this.scene=new iu,this.camera=new dn(40,1,.1,200),this.raycaster=new sd,this.mouse=new ye,this.waterTex=null,this.roadTex=null,this.staticGroup=new mt,this.entityGroup=new mt,this.fxGroup=new mt,this.helperGroup=new mt,this.towerMeshes=new Map,this.mineMeshes=new Map,this.enemyMeshes=new Map,this.barMeshes=new Map,this.projMeshes=new Map,this.effectMeshes=new Map,this.particleMeshes=new Map,this.ripples=[],this.clock=0,this.zoom=1,this.cameraAngle=0,this.canvas=e,this.scene.background=new Ie("#1a2418"),this.scene.fog=new pr("#1a2418",30,70),this.updateCamera(),this.renderer=new j0({canvas:e,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=as,this.hemi=new Qu(13623480,2634527,1.05),this.scene.add(this.hemi),this.sun=new nd(16771524,1.15),this.sun.position.set(12,22,10),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(1024,1024),this.sun.shadow.camera.left=-18,this.sun.shadow.camera.right=18,this.sun.shadow.camera.top=14,this.sun.shadow.camera.bottom=-14,this.scene.add(this.sun),this.groundMat=te("#2f3d29"),this.groundPlane=new F(new ti(tn,nn),this.groundMat),this.groundPlane.rotation.x=-Math.PI/2,this.groundPlane.receiveShadow=!0,this.scene.add(this.groundPlane),this.waterMat=te("#235d78",{emissive:new Ie("#0a3348"),emissiveIntensity:.15,metalness:.25,roughness:.4}),this.scene.add(this.staticGroup,this.entityGroup,this.fxGroup,this.helperGroup),this.rangeMesh=new F(new us(.97,1,64),new lt({color:"#ffffff",transparent:!0,opacity:.42,side:At,depthWrite:!1})),this.rangeMesh.rotation.x=-Math.PI/2,this.rangeMesh.visible=!1,this.helperGroup.add(this.rangeMesh),this.hoverMesh=new F(new ge(.94,.04,.94),new lt({color:"#7ac47a",transparent:!0,opacity:.38,depthWrite:!1})),this.hoverMesh.visible=!1,this.helperGroup.add(this.hoverMesh),window.addEventListener("resize",()=>this.resize()),e.addEventListener("wheel",t=>{t.preventDefault(),this.zoomBy(t.deltaY>0?1.09:.91)},{passive:!1}),this.resize()}zoomBy(e){this.zoom=Math.max(.65,Math.min(1.8,this.zoom*e)),this.updateCamera()}rotateBy(e){this.cameraAngle+=e,this.updateCamera()}resetCamera(){this.zoom=1,this.cameraAngle=0,this.updateCamera()}updateCamera(){const e=14*this.zoom;this.camera.position.set(Math.sin(this.cameraAngle)*e,18*this.zoom,Math.cos(this.cameraAngle)*e),this.camera.lookAt(0,0,0)}resize(){const e=this.canvas.clientWidth||960,t=this.canvas.clientHeight||600;this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}getTileFromEvent(e){const t=this.canvas.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const n=this.raycaster.intersectObject(this.groundPlane)[0];if(!n)return null;const i=Math.floor(n.point.x+tn/2),r=Math.floor(n.point.z+nn/2);return i<0||i>=tn||r<0||r>=nn?null:[i,r]}buildLevel(e,t,n,i){this.clearGroup(this.staticGroup),this.clearGroup(this.entityGroup),this.clearGroup(this.fxGroup),this.towerMeshes.clear(),this.mineMeshes.clear(),this.enemyMeshes.clear(),this.barMeshes.clear(),this.projMeshes.clear(),this.effectMeshes.clear(),this.particleMeshes.clear(),this.ripples=[],this.scene.background=new Ie(i.sky),this.scene.fog=new pr(i.fog,28,68),this.groundMat.map&&this.groundMat.map.dispose(),this.groundMat.map=ng(i),this.groundMat.color.set("#ffffff"),this.groundMat.needsUpdate=!0,this.waterTex&&this.waterTex.dispose(),this.roadTex&&this.roadTex.dispose(),this.waterTex=sg(i.water),this.roadTex=ig(i),this.waterMat.map=this.waterTex,this.waterMat.color.set("#ffffff"),this.waterMat.emissive.set(i.water).multiplyScalar(.3),this.waterMat.needsUpdate=!0,this.hemi.intensity=i.ambient,this.hemi.color.set(i.night?"#8ba1bd":"#cfe0b8"),this.hemi.groundColor.set(i.night?"#131a1c":"#28331f"),this.sun.intensity=i.sun,this.sun.color.set(i.night?"#a9c2e0":"#ffe9c4");const r=new Nt,a={side:At},o=te("#ffffff",{...a,map:this.roadTex,roughness:.95,metalness:.02}),c=te(new Ie(i.path).multiplyScalar(.5).getStyle(),{...a,roughness:1}),l=new lt({color:new Ie(i.path).multiplyScalar(.72),transparent:!0,opacity:.28,side:At,depthWrite:!1}),h=te(new Ie(i.water).multiplyScalar(.5).getStyle(),{...a,roughness:.5}),u=(R,B,V,z,ie,q)=>{if(R.points.length<2)return;if(q){const we=new F(tr(R.points,z+.5,ie-.02),q);this.staticGroup.add(we)}const j=new F(tr(R.points,z+.2,ie-.008),B),ne=new F(tr(R.points,z,ie),V);j.receiveShadow=!0,ne.receiveShadow=!0,this.staticGroup.add(j,ne)};e.forEach(R=>u(R,c,o,.82,.035,l)),t.forEach(R=>u(R,h,this.waterMat,.92,.028));const d=[];if(e.forEach(R=>R.points.forEach((B,V)=>{V%3===0&&d.push(B)})),d.length){const R=i.deco==="city"||i.deco==="rails"||i.deco==="space"?new ge(.18,.012,.06):new vn(.09,0),B=te(i.deco==="space"?"#c9d6f0":new Ie(i.path).multiplyScalar(1.25).getStyle()),V=new Bn(R,B,d.length);d.forEach((z,ie)=>{r.position.set(xt(z.x)+(ie%3-1)*.16,.055,vt(z.y)+(ie%2-.5)*.22),r.rotation.set(0,ie*1.7,0),r.scale.setScalar(.6+ie%4*.12),r.updateMatrix(),V.setMatrixAt(ie,r.matrix)}),V.instanceMatrix.needsUpdate=!0,this.staticGroup.add(V)}t.forEach(R=>{for(let B=3;B<R.points.length-1;B+=5){const V=new F(new us(.12,.17,18),new lt({color:"#d6f0f8",transparent:!0,opacity:.5,side:At,depthWrite:!1}));V.rotation.x=-Math.PI/2,V.position.set(xt(R.points[B].x),.062,vt(R.points[B].y)),this.ripples.push({mesh:V,phase:B*.7%(Math.PI*2)}),this.staticGroup.add(V)}});const f=new Set;t.forEach(R=>R.tiles.forEach(([B,V])=>f.add(`${B},${V}`)));const g=[];if(e.forEach(R=>R.tiles.forEach(([B,V])=>{f.has(`${B},${V}`)&&g.push([B,V])})),g.length){const R=te(i.deco==="space"||i.deco==="city"?"#8d929a":"#7a705c"),B=te(i.deco==="space"||i.deco==="city"?"#b9c0c8":"#a89a79"),V=new Bn(new ge(.98,.22,.98),R,g.length),z=new Bn(new ge(.98,.16,.09),B,g.length),ie=new Bn(new ge(.09,.16,.98),B,g.length);g.forEach(([q,j],ne)=>{const we=_n(q),Ue=xn(j);r.scale.setScalar(1),r.rotation.set(0,0,0),r.position.set(we,.09,Ue),r.updateMatrix(),V.setMatrixAt(ne,r.matrix),r.position.set(we,.28,Ue-.44),r.updateMatrix(),z.setMatrixAt(ne,r.matrix),r.position.set(we,.28,Ue+.44),r.updateMatrix(),z.setMatrixAt(ne+g.length,r.matrix),r.position.set(we-.44,.28,Ue),r.updateMatrix(),ie.setMatrixAt(ne,r.matrix),r.position.set(we+.44,.28,Ue),r.updateMatrix(),ie.setMatrixAt(ne+g.length,r.matrix)}),[V,z,ie].forEach(q=>{q.instanceMatrix.needsUpdate=!0,q.castShadow=q.receiveShadow=!0,this.staticGroup.add(q)})}const M=new lt({color:new Ie(i.water).multiplyScalar(.7),transparent:!0,opacity:.35,side:At,depthWrite:!1});t.forEach(R=>{const B=new F(tr(R.points,1.55,.012),M);this.staticGroup.add(B)});const p=te(i.deco==="ruins"?"#5c5548":"#4c4b3b"),m=new Bn(new ge(.96,.35,.18),p,tn*2),x=new Bn(new ge(.18,.35,.96),p,nn*2);let w=0,v=0;const T=(R,B,V,z)=>{r.position.set(V,.17,z),r.rotation.set(0,0,0),r.scale.setScalar(1),r.updateMatrix(),R.setMatrixAt(B,r.matrix)};for(let R=0;R<tn;R++)T(m,w++,_n(R),xn(0)-.42),T(m,w++,_n(R),xn(nn-1)+.42);for(let R=0;R<nn;R++)T(x,v++,_n(0)-.42,xn(R)),T(x,v++,_n(tn-1)+.42,xn(R));m.instanceMatrix.needsUpdate=!0,x.instanceMatrix.needsUpdate=!0,m.castShadow=m.receiveShadow=!0,x.castShadow=x.receiveShadow=!0,this.staticGroup.add(m,x),this.addGroundPatchwork(n,f,i,r),this.addPathVerge(e,t,i,r);const b=i.deco==="forest"?34:i.deco==="trees"?22:i.deco==="reeds"?26:18,_=[];for(let R=1;R<tn-1;R++)for(let B=1;B<nn-1;B++){const V=Math.abs(R*73856093^B*19349663)%100;V>b||n.has(`${R},${B}`)||R===Fi[0]&&B===Fi[1]||_.push([R,B,V])}this.addDeco(_,n,f,i,r);const E=new mt,L=ee(new F(new Re(.52,.58,.22,8),te("#3c4632")));L.position.y=.12;const C=ee(new F(new ge(.62,.55,.62),te("#b85446")));C.position.y=.5;const N=ee(new F(new Vt(.48,.3,4),te("#d6b070")));N.position.y=.92,N.rotation.y=Math.PI/4;const O=ee(new F(new Re(.025,.025,.65,6),te("#e8e0c8")));O.position.set(.4,.9,-.4);const X=new F(new ti(.4,.24),te("#e0b34d",{side:At}));if(X.position.set(.61,1.06,-.4),E.add(L,C,N,O,X),i.night){const R=new ed(16763274,2.2,11);R.position.set(0,1.6,0),E.add(R)}E.position.set(_n(Fi[0]),0,xn(Fi[1])),this.staticGroup.add(E)}addGroundPatchwork(e,t,n,i){const r=[];for(let o=0;o<tn;o++)for(let c=0;c<nn;c++){if(e.has(`${o},${c}`)||t.has(`${o},${c}`))continue;const l=ut(o*31+c*17);l<.34&&r.push([o,c,l])}if(!r.length)return;const a=n.deco==="desert"?["#b39261","#d2b483","#8d7248"]:n.deco==="snow"?["#e4eef0","#c3d6dd","#f2f7f8"]:n.deco==="city"||n.deco==="rails"||n.deco==="space"?["#565b62","#6c7178","#454950"]:["#476138","#5c7646","#385234"];a.forEach((o,c)=>{const l=r.filter(([,,u])=>Math.floor(u*100)%a.length===c);if(!l.length)return;const h=new Bn(new mr(.5,7),new lt({color:o,transparent:!0,opacity:.32,side:At,depthWrite:!1}),l.length);l.forEach(([u,d,f],g)=>{i.position.set(_n(u)+(ut(g*3.3)-.5)*.4,.018+c*.001,xn(d)+(ut(g*5.1)-.5)*.4),i.rotation.set(-Math.PI/2,0,ut(g*2.2)*6.28),i.scale.set(.6+ut(g*7.7)*.6,.5+ut(g*9.1)*.5,1),i.updateMatrix(),h.setMatrixAt(g,i.matrix)}),h.instanceMatrix.needsUpdate=!0,this.staticGroup.add(h)})}addPathVerge(e,t,n,i){const r=[],a=(h,u,d)=>{const f=Math.round(h/Wt-.5),g=Math.round(u/Wt-.5),M=ut(d*1.37+f*13+g*7);M>.5&&r.push([xt(h),vt(u),M])};if([...e,...t].forEach(h=>{h.points.forEach((u,d)=>{if(d%2!==0)return;const f=h.points[Math.max(0,d-1)],g=h.points[Math.min(h.points.length-1,d+1)];let M=g.x-f.x,p=g.y-f.y;const m=Math.hypot(M,p)||1;M/=m,p/=m;const x=-p*(Wt*.9),w=M*(Wt*.9);a(u.x+x,u.y+w,d+1),a(u.x-x,u.y-w,d+40)})}),!r.length)return;const o=n.deco==="desert"||n.deco==="snow"?new vn(.07,0):new Vt(.08,.26,5),c=te(n.deco==="desert"?"#a08a5e":n.deco==="snow"?"#dbe7ea":n.deco==="space"||n.deco==="city"?"#7d8590":"#688049"),l=new Bn(o,c,r.length);r.forEach(([h,u,d],f)=>{i.position.set(h,.06,u),i.rotation.set(0,ut(f*3.1)*6.28,(ut(f*4.3)-.5)*.4),i.scale.setScalar(.6+d*.7),i.updateMatrix(),l.setMatrixAt(f,i.matrix)}),l.instanceMatrix.needsUpdate=!0,l.castShadow=!0,this.staticGroup.add(l)}addDeco(e,t,n,i,r){if(!e.length)return;const a=(l,h,u,d,f)=>{const g=f?e.filter(([,,p])=>f(p)):e;if(!g.length){l.dispose(),h.dispose();return}const M=new Bn(l,h,g.length);g.forEach(([p,m,x],w)=>{const v=(ut(x+w*1.3)-.5)*.34,T=(ut(x+w*2.7)-.5)*.34;r.position.set(_n(p)+v,u,xn(m)+T),r.rotation.set(0,x*.063,0),r.scale.setScalar(d?d(x):1),r.updateMatrix(),M.setMatrixAt(w,r.matrix)}),M.instanceMatrix.needsUpdate=!0,M.castShadow=!0,M.receiveShadow=!0,this.staticGroup.add(M)},o=l=>l%2===0,c=l=>l%4===0;switch(i.deco){case"trees":case"forest":{const l=i.deco==="forest";a(new Re(.05,.07,.24,6),te("#5a4630"),.12),a(new Vt(.24,.58,7),te(l?"#35603a":"#497245"),.5,h=>.75+h*.006),a(new Ze(.14,7,6),te(l?"#2b7a45":"#5b8a50"),.34,h=>.7+h*.008,o),a(new Vt(.1,.3,6),te("#7a9e56"),.16,h=>.6+h*.01,c),a(new vn(.09,0),te("#8b8870"),.07,h=>.6+h*.012,h=>h%3===0);break}case"rocks":a(new vn(.27,0),te("#6d6d5f"),.16,l=>.7+l*.008),a(new vn(.14,0),te("#848478"),.08,l=>.6+l*.012,o),a(new Vt(.09,.32,5),te("#738a5c"),.16,l=>.6+l*.01,c);break;case"reeds":a(new Vt(.09,.5,5),te("#779249"),.25,l=>.7+l*.009),a(new Re(.015,.02,.7,5),te("#93ad63"),.35,l=>.7+l*.01,o),a(new Ze(.06,6,5),te("#b9a05c"),.7,l=>.8+l*.006,c),a(new vn(.1,0),te("#7b7d6c"),.06,l=>.6+l*.012,l=>l%3===0);break;case"crates":a(new ge(.36,.36,.36),te("#8d6c45"),.18,l=>.8+l*.008),a(new Re(.16,.16,.36,10),te("#6d5638"),.18,l=>.8+l*.008,o),a(new ge(.14,.14,.14),te("#a98454"),.08,l=>.7+l*.012,c);break;case"rails":a(new ge(.12,.06,.9),te("#7d7d6d"),.05),a(new Re(.03,.04,.5,6),te("#9c9c8c"),.25,l=>.8+l*.01,o),a(new ge(.1,.1,.1),te("#b1a377"),.05,l=>.6+l*.012,c);break;case"ruins":a(new ge(.34,.5,.28),te("#7c715f"),.25,l=>.7+l*.01),a(new ge(.5,.18,.4),te("#91856e"),.09,l=>.7+l*.01,o),a(new Re(.07,.09,.44,8),te("#6f6555"),.22,l=>.8+l*.008,c),a(new vn(.09,0),te("#a99a80"),.05,l=>.6+l*.012,l=>l%3===0);break;case"desert":a(new Re(.05,.08,.36,6),te("#6f8a4b"),.18,l=>.7+l*.01,o),a(new Ze(.11,7,6),te("#4f7d42"),.4,l=>.7+l*.01,o),a(new vn(.23,0),te("#9c8059"),.14,l=>.7+l*.008),a(new hn(.14,.05,5,10,Math.PI),te("#b99a68"),.06,l=>.6+l*.01,c);break;case"snow":a(new Re(.04,.06,.2,6),te("#5d5144"),.1,l=>.7+l*.01,o),a(new Vt(.26,.64,7),te("#d8e6e8"),.46,l=>.75+l*.006,o),a(new vn(.15,0),te("#eef5f6"),.1,l=>.7+l*.012,c),a(new gr(.09,0),te("#a9cbd6",{metalness:.2,roughness:.3}),.18,l=>.6+l*.012,l=>l%3===0);break;case"city":a(new ge(.38,.8,.38),te("#6f7377"),.4,l=>.8+l*.006),a(new ge(.14,.14,.14),te("#c4ad74"),.86,l=>.8+l*.008,o),a(new Re(.02,.03,.5,6),te("#9fa6ad"),.25,l=>.8+l*.01,c),a(new Ze(.07,7,6),te("#6f8f5a"),.14,l=>.7+l*.012,l=>l%3===0);break;case"space":a(new gr(.28,0),te("#8fa2c4",{metalness:.35,roughness:.35}),.24,l=>.7+l*.01),a(new Re(.02,.02,.3,5),te("#c9d6f0"),.5,l=>.8+l*.006,o),a(new Ze(.09,8,6),te("#a9c8ff",{emissive:new Ie("#5b8fd8"),emissiveIntensity:.7}),.3,l=>.7+l*.01,c),a(new hn(.16,.025,5,12),te("#b9c8e0",{metalness:.5,roughness:.3}),.06,l=>.6+l*.012,l=>l%3===0);break}}clearGroup(e){[...e.children].forEach(t=>{e.remove(t),Zn(t)})}createNavalMineMesh(e){const t=new mt,n=te("#3c4248",{metalness:.5,roughness:.55}),i=ee(new F(new Ze(.3,16,12),n));i.position.y=.06,t.add(i);const r=new F(new Ze(.085,10,8),te(e,{emissive:new Ie(e),emissiveIntensity:1.3}));return r.position.y=.34,t.add(r),[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[.7,.55,0],[-.7,.55,0],[0,.55,.7],[0,.55,-.7]].forEach(([o,c,l])=>{const h=ee(new F(new Vt(.065,.2,6),n)),u=new D(o,c,l).normalize();h.position.set(u.x*.38,.06+u.y*.38,u.z*.38),h.quaternion.setFromUnitVectors(new D(0,1,0),u),t.add(h)}),t}createMineLayerMesh(e){const t=new mt,n=te("#4a545c",{metalness:.55,roughness:.5}),i=te("#242c33",{metalness:.4,roughness:.6}),r=te("#e9b23c"),a=te(e,{emissive:new Ie(e),emissiveIntensity:.9}),o=ee(new F(new Re(.46,.5,.1,6),i));o.position.y=.06,t.add(o);const c=ee(new F(new Re(.38,.44,.12,6),n));c.position.y=.17,t.add(c);for(let T=0;T<6;T++){const b=T/6*Math.PI*2,_=new F(new ge(.12,.11,.05),r);_.position.set(Math.cos(b)*.41,.17,Math.sin(b)*.41),_.rotation.y=-b,t.add(_)}const l=ee(new F(new Re(.27,.32,.3,10),n));l.position.y=.38,t.add(l);const h=new F(new Re(.3,.3,.06,10),i);h.position.y=.54,t.add(h),[-1,1].forEach(T=>{const b=ee(new F(new ge(.06,.2,.3),i));b.position.set(T*.28,.38,0),b.rotation.z=T*.18,t.add(b)});const u=new mt;u.position.y=.56,t.add(u);const d=ee(new F(new Re(.2,.24,.12,10),i));d.position.y=.03,u.add(d);const f=ee(new F(new ge(.11,.34,.11),n));f.position.set(0,.2,.05),f.rotation.x=-.35,u.add(f);const g=new F(new Ze(.09,10,8),a);g.position.set(0,.37,.11),u.add(g);const M=ee(new F(new ge(.1,.1,.46),n));M.position.set(0,.42,.32),M.rotation.x=.5,u.add(M);const p=ee(new F(new hn(.15,.04,6,14,Math.PI*1.4),a));p.rotation.x=Math.PI/2,p.rotation.z=Math.PI*.3,p.position.set(0,.5,.55),u.add(p);const m=ee(new F(new po(.12,0),i));m.position.set(0,.5,.55),u.add(m);for(let T=0;T<6;T++){const b=T/6*Math.PI*2,_=new F(new Vt(.035,.1,5),n);_.position.set(Math.cos(b)*.13,.5,.55+Math.sin(b)*.13),_.rotation.z=-b,u.add(_)}const x=new F(new Re(.02,.02,.14,6),i);x.position.set(0,.15,-.16),u.add(x);const w=new F(new Ze(.075,10,8),a);w.position.set(0,.24,-.16),u.add(w);const v=[];for(let T=0;T<3;T++){const b=new F(new Ze(.05,8,6),te("#fff1c8"));b.position.set(-.14+T*.14,.46,.16),t.add(b),v.push(b)}return t.userData={pivot:u,pips:v},t}createTower(e){const t=en[e.type];if(e.type==="mine")return this.createMineLayerMesh(t.color);const n=new mt,i=ee(new F(new Re(.36,.42,.25,12),te("#2b3327")));i.position.y=.15;const r=ee(new F(new ge(.52,.3,.52),te(t.color)));r.position.y=.39;const a=new mt;a.position.y=.4;const o=e.type==="railgun"?1.1:e.type==="howitzer"?.85:e.type==="flak"?.62:.7,c=ee(new F(new Re(.075,.095,o,8),te("#3a3a32")));if(c.rotation.x=Math.PI/2,c.position.z=o*.52,e.type==="howitzer"){const h=ee(new F(new Re(.12,.12,.14,8),te(t.color)));h.rotation.x=Math.PI/2,h.position.z=o,a.add(h)}if(e.type==="flak"&&[-.18,.18].forEach(h=>{const u=ee(new F(new Re(.045,.055,o*.85,6),te("#3a3a32")));u.rotation.x=Math.PI/2,u.position.set(h,0,o*.44),a.add(u)}),e.type==="railgun"){const h=new F(new ge(.05,.04,o*1.15),te(t.color,{emissive:new Ie(t.color),emissiveIntensity:.5}));[-.16,.16].forEach(u=>{const d=h.clone();d.position.set(u,0,o*.55),a.add(d)})}if(e.type==="laser"){const h=new F(new Ze(.13,10,8),te(t.color,{emissive:new Ie(t.color),emissiveIntensity:.9}));h.position.z=o*.92,a.add(h)}if(e.type==="tesla"){for(let u=0;u<3;u++){const d=new F(new hn(.19-u*.03,.025,6,12),te(t.color,{emissive:new Ie(t.color),emissiveIntensity:.55}));d.rotation.x=Math.PI/2,d.position.set(0,.3+u*.14,0),n.add(d)}const h=new F(new Ze(.11,10,8),te("#e6d4ff",{emissive:new Ie(t.color),emissiveIntensity:1}));h.position.set(0,.7,0),n.add(h)}a.add(c),n.add(i,r,a);const l=[];for(let h=0;h<3;h++){const u=new F(new Ze(.05,8,6),te("#fff1c8"));u.position.set(-.16+h*.16,.29,.42),n.add(u),l.push(u)}return n.userData={pivot:a,pips:l},n}createEnemy(e){const t=new mt,n=te(e.color),i=te("#2c3028"),r=te("#9fc0c8",{metalness:.4,roughness:.3});if(e.type==="infantry"){const a=new ge(.1,.32,.1),o=[];[-.08,.08].forEach(M=>{const p=ee(new F(a,te("#4a4a3a")));p.position.set(M,.16,0),o.push(p),t.add(p)});const c=ee(new F(new Re(.14,.17,.42,8),n));c.position.y=.5;const l=ee(new F(new ge(.3,.26,.12),te("#6b6a4d")));l.position.set(0,.52,.11);const h=ee(new F(new ge(.26,.3,.14),te("#5f5b42")));h.position.set(0,.52,-.16);const u=ee(new F(new Ze(.12,10,8),te("#d8bd97")));u.position.y=.8;const d=ee(new F(new Ze(.14,10,8,0,Math.PI*2,0,Math.PI/2),n));d.position.y=.83;const f=ee(new F(new Re(.16,.16,.03,10),n));f.position.y=.8,[-.19,.19].forEach(M=>{const p=ee(new F(new ge(.08,.3,.08),n));p.position.set(M,.5,.03),p.rotation.x=-.5,t.add(p)});const g=ee(new F(new ge(.06,.06,.5),i));g.position.set(.16,.5,.28),t.add(o[0],o[1],c,l,h,u,d,f,g),t.userData={legs:o}}else if(e.type==="truck"){const a=ee(new F(new ge(.62,.26,1),n));a.position.y=.38;const o=ee(new F(new ge(.56,.34,.42),n));o.position.set(0,.64,.26);const c=new F(new ge(.5,.16,.03),r);c.position.set(0,.68,.48);const l=ee(new F(new ge(.58,.16,.44),te("#6c6249")));l.position.set(0,.59,-.28);const h=ee(new F(new ge(.66,.1,.08),i));h.position.set(0,.3,.55),[-.24,.24].forEach(f=>{const g=new F(new Ze(.055,8,6),te("#ffe6a8",{emissive:new Ie("#ffcc66"),emissiveIntensity:.8}));g.position.set(f,.42,.53),t.add(g)});const u=[],d=new Re(.16,.16,.1,10);[[-.35,-.32],[.35,-.32],[-.35,.32],[.35,.32]].forEach(([f,g])=>{const M=ee(new F(d,te("#242822")));M.rotation.z=Math.PI/2,M.position.set(f,.18,g),M.userData.baseQuat=M.quaternion.clone(),u.push(M),t.add(M)}),t.add(a,o,c,l,h),t.userData={wheels:u}}else if(e.type==="tank"){const a=ee(new F(new ge(.86,.36,1.16),n));a.position.y=.4;const o=ee(new F(new ge(.86,.14,.4),n));o.position.set(0,.5,.62),o.rotation.x=-.5;const c=new ge(.22,.3,1.3);[-.52,.52].forEach(p=>{const m=ee(new F(c,te("#33382d")));m.position.set(p,.23,0),t.add(m)});const l=ee(new F(new Re(.34,.38,.26,10),n));l.position.y=.72;const h=ee(new F(new Re(.13,.15,.08,8),i));h.position.set(.12,.88,-.06);const u=ee(new F(new Re(.055,.07,.78,8),i));u.rotation.x=Math.PI/2,u.position.set(0,.74,.48);const d=ee(new F(new Re(.08,.08,.12,8),te("#4b5042")));d.rotation.x=Math.PI/2,d.position.set(0,.74,.88);const f=ee(new F(new Re(.008,.008,.4,5),te("#c8c4a8")));f.position.set(-.26,1,-.14);const g=[],M=new Re(.12,.12,.08,8);[-.45,-.15,.15,.45].forEach(p=>{[-.52,.52].forEach(m=>{const x=ee(new F(M,te("#4b5042")));x.rotation.z=Math.PI/2,x.position.set(m,.19,p),x.userData.baseQuat=x.quaternion.clone(),g.push(x),t.add(x)})}),t.add(a,o,l,h,u,d,f),t.userData={wheels:g}}else if(e.type==="plane"){const a=ee(new F(new ge(.2,.2,1.15),n)),o=new ge(.7,.05,.28);[-.36,.36].forEach(g=>{const M=ee(new F(o,n));M.position.set(g,.02,0),M.rotation.z=g>0?-.08:.08,t.add(M);const p=ee(new F(new ge(.1,.12,.2),te(e.color)));p.position.set(g*1.9,.04,0),t.add(p)});const c=ee(new F(new Ze(.12,10,8),r));c.scale.set(.8,.55,1.4),c.position.set(0,.13,.2);const l=ee(new F(new ge(.6,.05,.18),n));l.position.z=-.5;const h=ee(new F(new ge(.05,.3,.24),n));h.position.set(0,.15,-.5);const u=ee(new F(new Vt(.12,.34,8),te("#d8e3e8")));u.rotation.x=Math.PI/2,u.position.z=.72;const d=new F(new ge(.68,.05,.05),i);d.position.z=.92;const f=ee(new F(new Vt(.07,.16,8),te("#e8e0c8")));f.rotation.x=Math.PI/2,f.position.z=.96,t.add(a,c,l,h,u,d,f),t.userData={propeller:d}}else if(e.type==="ship"){const a=te(e.color,{roughness:.62,metalness:.28}),o=te("#8a948f",{roughness:.85}),c=te("#e6d8a8",{roughness:.5,metalness:.35}),l=te("#39434a",{roughness:.6,metalness:.4}),h=ee(new F(ra(1.6,.78,.3,.3),a));t.add(h);const u=new _r(Xl(1.6,.78));u.rotateX(-Math.PI/2);const d=ee(new F(u,o));d.position.y=.3,t.add(d);const f=ee(new F(new ge(.8,.035,1.35),l));f.position.y=.06,t.add(f);const g=ee(new F(new ge(.42,.24,.56),a));g.position.set(0,.43,-.22);const M=ee(new F(new ge(.32,.2,.28),a));M.position.set(0,.63,-.12);const p=ee(new F(new ge(.38,.03,.34),c));p.position.set(0,.75,-.12),t.add(g,M,p);for(let L=0;L<3;L++){const C=new F(new ge(.06,.07,.012),r);C.position.set(-.1+L*.1,.65,.025),t.add(C)}[-.23,.23].forEach(L=>{const C=new F(new ge(.012,.05,.4),r);C.position.set(L,.45,-.22),t.add(C)});const m=ee(new F(new Re(.09,.11,.26,10),l));m.position.set(0,.47,-.5);const x=ee(new F(new Re(.1,.1,.04,10),c));x.position.set(0,.61,-.5),t.add(m,x);const w=ee(new F(new Re(.014,.022,.46,6),c));w.position.set(0,1,-.14);const v=ee(new F(new ge(.36,.018,.018),c));v.position.set(0,1.16,-.14);const T=new F(new hn(.12,.016,6,14),te("#dce6e8",{metalness:.5}));T.position.set(0,1.26,-.14),T.rotation.x=.55,t.add(w,v,T);const b=ee(new F(new Re(.11,.13,.08,10),a));b.position.set(0,.37,.42);const _=ee(new F(new Ze(.11,10,8,0,Math.PI*2,0,Math.PI/2),a));_.position.set(0,.41,.42);const E=ee(new F(new Re(.026,.032,.42,8),l));E.rotation.x=Math.PI/2,E.position.set(0,.45,.65),t.add(b,_,E),[-.28,.28].forEach(L=>{const C=ee(new F(new ge(.02,.1,.5),l));C.position.set(L,.35,.1),t.add(C)}),t.userData={radar:T,barrel:E}}else if(e.type==="mech"){const a=[];[-.28,.28].forEach(l=>{const h=ee(new F(new Re(.1,.13,.55,8),i));h.position.set(l,.3,0);const u=ee(new F(new ge(.22,.1,.38),i));u.position.set(l,.05,.1),a.push(h),t.add(h,u)});const o=ee(new F(new ge(.62,.5,.4),n));o.position.y=.78;const c=ee(new F(new Ze(.16,10,8),r));c.scale.set(1,.7,.8),c.position.set(0,1,.16),[-.42,.42].forEach(l=>{const h=ee(new F(new ge(.2,.24,.34),n));h.position.set(l,.88,0);const u=ee(new F(new Re(.06,.07,.5,8),i));u.rotation.x=Math.PI/2,u.position.set(l,.78,.32),t.add(h,u)}),t.add(o,c),t.userData={legs:a}}else if(e.type==="drone"){const a=ee(new F(new Ze(.16,10,8),n)),o=ee(new F(new hn(.22,.025,6,14),te(e.color)));o.rotation.x=Math.PI/2;const c=new F(new Ze(.06,8,6),te("#2a3a48",{emissive:new Ie("#66d0ff"),emissiveIntensity:.8}));c.position.z=.16;const l=[];[[-.32,-.32],[.32,-.32],[-.32,.32],[.32,.32]].forEach(([h,u])=>{const d=ee(new F(new ge(.04,.04,.42),i));d.position.set(h*.5,0,u*.5),d.rotation.y=h*u>0?Math.PI/4:-Math.PI/4;const f=new F(new ge(.3,.02,.04),te("#d8e4ec"));f.position.set(h,.04,u),l.push(f),t.add(d,f)}),t.add(a,o,c),t.userData={rotors:l}}else if(e.type==="hovercraft"){const a=te(e.color,{roughness:.58,metalness:.3}),o=te("#3a4649",{roughness:.9}),c=te("#d8c88e",{roughness:.5,metalness:.3}),l=ee(new F(ra(1.4,.8,.22,.3),a));l.position.y=.06,t.add(l);const h=ee(new F(new Re(.5,.56,.14,14),o));h.scale.z=1.5,h.position.y=.02;const u=ee(new F(new hn(.5,.035,6,18),c));u.rotation.x=Math.PI/2,u.scale.y=1.5,u.position.y=.08,t.add(h,u);const d=ee(new F(new Ze(.22,12,8),r));d.scale.set(.85,.62,1.2),d.position.set(0,.42,.22);const f=ee(new F(new hn(.2,.014,5,12),c));f.rotation.y=Math.PI/2,f.scale.set(1,.7,1),f.position.set(0,.42,.22),t.add(d,f);const g=[];[-.3,.3].forEach(m=>{const x=ee(new F(new Re(.14,.14,.1,12),a));x.rotation.x=Math.PI/2,x.position.set(m,.4,-.5);const w=ee(new F(new hn(.12,.016,5,14),c));w.position.set(m,.4,-.56);const v=new F(new ge(.2,.02,.05),te("#e0eaf0"));v.position.set(m,.4,-.56),g.push(v),t.add(x,w,v)});const M=ee(new F(new Re(.1,.12,.1,10),a));M.position.set(0,.38,.52);const p=ee(new F(new Re(.028,.034,.4,8),i));p.rotation.x=Math.PI/2,p.position.set(0,.42,.72),t.add(M,p),t.userData={rotors:g}}else if(e.type==="bomber"){const a=ee(new F(new Re(.16,.13,1.1,10),n));a.rotation.x=Math.PI/2;const o=ee(new F(new Vt(.15,.36,10),te("#c8c4b4")));o.rotation.x=Math.PI/2,o.position.z=.68;const c=ee(new F(new Vt(.13,.4,8),n));c.rotation.x=-Math.PI/2,c.position.z=-.7,[-.55,.55].forEach(f=>{const g=ee(new F(new ge(.95,.06,.34),n));g.position.set(f,0,.05),g.rotation.z=f>0?-.08:.08;const M=ee(new F(new Re(.1,.11,.36,8),i));M.rotation.x=Math.PI/2,M.position.set(f*1.05,-.02,.05),t.add(g,M)});const l=ee(new F(new ge(.5,.04,.22),n));l.position.z=-.65;const h=ee(new F(new ge(.04,.26,.3),n));h.position.set(0,.14,-.66);const u=new F(new ge(.18,.06,.4),i);u.position.set(0,-.16,0);const d=new F(new Ze(.1,8,6),r);d.scale.set(.8,.6,1.3),d.position.set(0,.13,.42),t.add(a,o,c,l,h,u,d)}else if(e.type==="helicopter"){const a=ee(new F(new Ze(.22,12,8),n));a.scale.set(.85,.85,1.35);const o=new F(new Ze(.17,10,8),r);o.scale.set(.85,.7,1),o.position.set(0,.02,.22);const c=ee(new F(new Re(.05,.07,.7,8),n));c.rotation.x=Math.PI/2,c.position.z=-.45;const l=ee(new F(new ge(.03,.2,.16),n));l.position.set(0,.1,-.76);const h=new F(new Re(.02,.02,.16,6),i);h.position.y=.28;const u=[],d=new F(new ge(1.1,.02,.06),te("#d8e4ec"));d.position.y=.36;const f=new F(new ge(.04,.26,.02),te("#d8e4ec"));f.position.set(.06,.1,-.76),u.push(d,f),[-.26,.26].forEach(M=>{ee(new F(new ge(.14,.14,.3),i)).position.set(M,-.06,0)});const g=te("#4a5055");[-.16,.16].forEach(M=>{const p=ee(new F(new Re(.02,.02,.8,6),g));p.rotation.x=Math.PI/2,p.position.set(M,-.28,0),t.add(p)}),t.add(a,o,c,l,h,d,f),t.userData={rotors:u}}else if(e.type==="destroyer"){const a=ee(new F(ra(1.9,.82,.34,.34),n)),o=te("#8a948f"),c=new _r(Xl(1.9,.82));c.rotateX(-Math.PI/2);const l=ee(new F(c,o));l.position.y=.34;const h=ee(new F(new ge(.44,.3,.62),n));h.position.set(0,.5,-.28);const u=ee(new F(new ge(.34,.22,.3),n));u.position.set(0,.74,-.18);const d=ee(new F(new ge(.16,.24,.2),i));d.position.set(0,.55,-.62);const f=te("#e6d8a8",{roughness:.5,metalness:.35}),g=ee(new F(new Re(.014,.022,.5,6),f));g.position.set(0,1.08,-.2);const M=new F(new hn(.14,.016,6,14),te("#dce6e8",{metalness:.5}));M.position.set(0,1.34,-.2),M.rotation.x=.5;const p=ee(new F(new Ze(.13,10,8,0,Math.PI*2,0,Math.PI/2),n));p.position.set(0,.42,.5);const m=ee(new F(new Re(.03,.038,.5,8),i));m.rotation.x=Math.PI/2,m.position.set(0,.46,.75);const x=ee(new F(new Ze(.1,8,6,0,Math.PI*2,0,Math.PI/2),n));x.position.set(0,.4,-.75);for(let w=0;w<3;w++){const v=new F(new ge(.06,.06,.012),r);v.position.set(-.1+w*.1,.76,-.02),t.add(v)}t.add(a,l,h,u,d,g,M,p,m,x),t.userData={radar:M}}else if(e.type==="submarine"){const a=ee(new F(new Oi(.24,.7,6,12),n));a.rotation.x=Math.PI/2;const o=ee(new F(new ge(.16,.24,.28),n));o.position.set(0,.24,-.05);const c=ee(new F(new Re(.016,.016,.24,6),i));c.position.set(0,.46,-.05),[-.5,.5].forEach(u=>{const d=ee(new F(new ge(.5,.04,.16),n));d.position.set(0,0,u),t.add(d)});const l=ee(new F(new ge(.04,.26,.2),n));l.position.set(0,.12,-.72);const h=[];for(let u=0;u<3;u++){const d=new F(new mr(.035,8),r);d.position.set(.235,.02,-.3+u*.3),d.rotation.y=Math.PI/2,h.push(d)}t.add(a,o,c,l,...h)}else{const a=[];[[-.34,-.34],[.34,-.34],[-.34,.34],[.34,.34]].forEach(([u,d])=>{const f=ee(new F(new Re(.06,.09,.75,6),i));f.position.set(u,.38,d),f.rotation.z=u>0?.18:-.18,a.push(f),t.add(f)});const o=ee(new F(new ge(.7,.46,.7),n));o.position.y=.95;const c=ee(new F(new Ze(.24,12,8,0,Math.PI*2,0,Math.PI/2),r));c.position.y=1.18;const l=new F(new Ze(.13,10,8),te("#d9c2ff",{emissive:new Ie(e.color),emissiveIntensity:1}));l.position.set(0,.98,.36);const h=ee(new F(new Re(.012,.012,.5,5),te("#d8d2e8")));h.position.set(0,1.55,-.1),t.add(o,c,l,h),t.userData={legs:a}}if(e.boss){const a=new mt,o=te("#f2c66a",{metalness:.7,roughness:.25,emissive:new Ie("#8a5a12"),emissiveIntensity:.35}),c=new F(new Re(.2,.22,.12,8),o);a.add(c);for(let l=0;l<5;l++){const h=l/5*Math.PI*2,u=new F(new Vt(.06,.2,5),o);u.position.set(Math.cos(h)*.19,.14,Math.sin(h)*.19),a.add(u)}a.position.y=e.kind==="air"?.62:e.type==="strider"?1.65:e.type==="tank"||e.type==="mech"?1.5:1,t.add(a),t.scale.setScalar(1.18)}return t}createBar(e=!1){const t=e?1.25:.72,n=new mt,i=new F(new ti(t,e?.14:.09),new lt({color:"#4a1f1a",depthTest:!1})),r=new F(new ti(t,e?.14:.09),new lt({color:e?"#f2c66a":"#8fd18a",depthTest:!1}));return r.position.z=.002,r.name="fg",n.add(i,r),n.renderOrder=10,n}syncTowers(e){const t=new Set(e);[...this.towerMeshes.keys()].forEach(n=>{t.has(n)||(this.entityGroup.remove(this.towerMeshes.get(n)),Zn(this.towerMeshes.get(n)),this.towerMeshes.delete(n))}),e.forEach(n=>{let i=this.towerMeshes.get(n);i||(i=this.createTower(n),this.towerMeshes.set(n,i),this.entityGroup.add(i)),i.position.set(_n(n.tx),0,xn(n.ty)),i.userData.pivot.rotation.y=Math.PI/2-n.angle,i.userData.pips.forEach((r,a)=>{r.visible=a<n.level})})}syncMines(e){const t=new Set(e);[...this.mineMeshes.keys()].forEach(n=>{t.has(n)||(this.entityGroup.remove(this.mineMeshes.get(n)),Zn(this.mineMeshes.get(n)),this.mineMeshes.delete(n))}),e.forEach(n=>{let i=this.mineMeshes.get(n);i||(i=this.createNavalMineMesh(n.color),this.mineMeshes.set(n,i),this.entityGroup.add(i)),i.position.set(xt(n.x),Math.sin(this.clock*2+n.id)*.03,vt(n.y)),i.rotation.y=this.clock*.6+n.id})}syncEnemies(e){const t=new Set(e),n=new xi,i=new D(0,1,0);[...this.enemyMeshes.keys()].forEach(r=>{if(!t.has(r)){this.entityGroup.remove(this.enemyMeshes.get(r)),Zn(this.enemyMeshes.get(r)),this.enemyMeshes.delete(r);const a=this.barMeshes.get(r);a&&(this.fxGroup.remove(a),Zn(a),this.barMeshes.delete(r))}}),e.forEach(r=>{let a=this.enemyMeshes.get(r);if(!a){a=this.createEnemy(r),this.enemyMeshes.set(r,a),this.entityGroup.add(a);const g=this.createBar(r.boss);this.barMeshes.set(r,g),this.fxGroup.add(g)}const o=r.type==="submarine"?-.12:r.type==="bomber"?1.6:r.type==="helicopter"?1.35:r.kind==="air"?1.25:r.type==="ship"||r.type==="destroyer"?.08:0,c=r.type==="infantry"?Math.sin(this.clock*9+r.id)*.035:r.kind==="air"?Math.sin(this.clock*3+r.id)*.04:0;a.position.set(xt(r.x),o+c,vt(r.y)),a.rotation.y=Math.PI/2-r.angle,a.userData.wheels&&(n.setFromAxisAngle(i,r.traveled*2.2),a.userData.wheels.forEach(g=>{g.quaternion.copy(g.userData.baseQuat).multiply(n)})),a.userData.propeller&&(a.userData.propeller.rotation.z=this.clock*28),a.userData.rotors&&a.userData.rotors.forEach((g,M)=>{g.rotation.z=this.clock*(26+M*2)}),a.userData.radar&&(a.userData.radar.rotation.z=this.clock*1.5),a.userData.legs&&a.userData.legs.forEach((g,M)=>{g.rotation.x=Math.sin(this.clock*8+M*Math.PI)*.32});const l=this.barMeshes.get(r),h=r.type==="drone"?.72:r.type==="helicopter"?.65:r.kind==="air"||r.type==="strider"?1.9:r.type==="mech"?1.4:r.type==="destroyer"?1.1:r.type==="ship"?.82:r.type==="submarine"?.55:r.type==="hovercraft"?.72:r.type==="tank"?1.05:.95;l.position.set(xt(r.x),h+(r.boss?.55:0),vt(r.y)),l.quaternion.copy(this.camera.quaternion);const u=Math.max(0,r.hp/r.maxHp),d=l.getObjectByName("fg"),f=r.boss?1.25:.72;d.scale.x=u,d.position.x=-f/2*(1-u),d.material.color.setHex(!r.boss&&u<=.4||r.boss&&u<=.25?14707549:r.boss?15910506:9425290)})}createProjectileMesh(e){const t=e.color;if(e.type==="laser"){const o=new mt,c=new F(new Re(.026,.026,1,8),new lt({color:"#ffffff",transparent:!0,opacity:.95,blending:Yt,depthWrite:!1})),l=new F(new Re(.085,.085,1,10),new lt({color:t,transparent:!0,opacity:.42,blending:Yt,depthWrite:!1,side:At}));return o.add(l,c),o}if(e.type==="tesla"){const o=new mt,c=new F(new Re(.03,.03,1,6),new lt({color:"#ffffff",blending:Yt,depthWrite:!1})),l=new F(new Re(.09,.09,1,6),new lt({color:t,transparent:!0,opacity:.5,blending:Yt,depthWrite:!1}));return o.add(l,c),o}if(e.type==="railgun"){const o=new mt,c=new F(new Oi(.04,.24,4,8),new lt({color:"#ffffff",blending:Yt,depthWrite:!1})),l=new F(new Oi(.1,.3,4,8),new lt({color:t,transparent:!0,opacity:.4,blending:Yt,depthWrite:!1}));return o.add(l,c),o}if(e.type==="machinegun"||e.type==="aa")return new F(new Oi(.035,.16,4,6),new lt({color:"#fff4cc",blending:Yt,depthWrite:!1}));const n=e.type==="coastal"?.15:e.type==="flak"?.14:.12,i=new mt,r=new F(new Ze(n,10,8),new lt({color:t})),a=new F(new Ze(n*1.6,8,6),new lt({color:t,transparent:!0,opacity:.24,blending:Yt,depthWrite:!1}));return i.add(a,r),i}syncProjectiles(e){const t=new Set(e);[...this.projMeshes.keys()].forEach(n=>{t.has(n)||(this.fxGroup.remove(this.projMeshes.get(n)),Zn(this.projMeshes.get(n)),this.projMeshes.delete(n))}),e.forEach(n=>{var a;let i=this.projMeshes.get(n);i||(i=this.createProjectileMesh(n),this.projMeshes.set(n,i),this.fxGroup.add(i));const r=((a=n.target)==null?void 0:a.kind)==="air"?1.3:.55;if(n.type==="laser"){const o=xt(n.originX),c=vt(n.originY),l=xt(n.x),h=vt(n.y);i.position.set((o+l)/2,r,(c+h)/2);const u=er(i,l-o,h-c);i.scale.set(1,u,1)}else if(n.type==="tesla"){const o=xt(n.originX),c=vt(n.originY),l=xt(n.x),h=vt(n.y);i.position.set((o+l)/2,r,(c+h)/2);const u=er(i,l-o,h-c);i.scale.set(1,u,1)}else n.type==="railgun"||n.type==="machinegun"||n.type==="aa"?(i.position.set(xt(n.x),r,vt(n.y)),er(i,n.vx,n.vy)):(i.position.set(xt(n.x),r,vt(n.y)),i.rotation.x+=.2)})}createBeamEffect(e){const t=new mt,n=e.color2??e.color,i=new F(new Re((e.width??.08)*2.2,(e.width??.08)*2.2,1,10),new lt({color:n,transparent:!0,opacity:.35,blending:Yt,depthWrite:!1,side:At})),r=new F(new Re(e.width??.08,e.width??.08,1,8),new lt({color:e.color,transparent:!0,opacity:1,blending:Yt,depthWrite:!1}));return t.add(i,r),t}createArcEffect(e){const t=new mt,n=e.color2??e.color,i=e.points??[];if(i.length>=2){const r=[];for(let h=0;h<i.length-1;h++){const u=i[h],d=i[h+1],f=xt(u.x),g=vt(u.y),M=xt(d.x),p=vt(d.y),m=7;for(let x=0;x<m;x++){const w=x/m,v=x===0?0:(Math.random()-.5)*.34;r.push(new D(f+(M-f)*w+v,e.z+(Math.random()-.5)*.16,g+(p-g)*w+v))}}const a=i[i.length-1];r.push(new D(xt(a.x),e.z,vt(a.y)));const o=new Ec(r),c=new xr(o,Math.min(120,r.length*4),e.width??.05,6,!1);t.add(new F(c,new lt({color:n,transparent:!0,opacity:.45,blending:Yt,depthWrite:!1})));const l=new xr(o,Math.min(120,r.length*4),(e.width??.05)*.4,5,!1);t.add(new F(l,new lt({color:"#ffffff",transparent:!0,opacity:1,blending:Yt,depthWrite:!1})))}return t}syncEffects(e){const t=new Set(e);[...this.effectMeshes.keys()].forEach(n=>{t.has(n)||(this.fxGroup.remove(this.effectMeshes.get(n)),Zn(this.effectMeshes.get(n)),this.effectMeshes.delete(n))}),e.forEach(n=>{let i=this.effectMeshes.get(n);i||(n.kind==="beam"?i=this.createBeamEffect(n):n.kind==="arc"?i=this.createArcEffect(n):n.kind==="flash"?i=new F(new Ze(1,12,8),new lt({color:n.color,transparent:!0,opacity:.9,blending:Yt,depthWrite:!1})):(i=new F(new us(.82,1,28),new lt({color:n.color,transparent:!0,opacity:.8,side:At,depthWrite:!1})),i.rotation.x=-Math.PI/2),this.effectMeshes.set(n,i),this.fxGroup.add(i));const r=1-n.life/n.maxLife;if(n.kind==="beam"){const a=n.points??[];if(a.length>=2){const o=xt(a[0].x),c=vt(a[0].y),l=xt(a[1].x),h=vt(a[1].y),u=l-o,d=h-c;i.position.set((o+l)/2,n.z,(c+h)/2);const f=er(i,u,d);i.scale.set(1,f*(1-r*.15),1)}i.traverse(o=>{const c=o.material;c&&(c.opacity=Math.max(0,1-r)*(c.color.getHexString()==="ffffff"?1:.45))})}else if(n.kind==="arc")i.visible=Math.sin(r*Math.PI*9)>-.4,i.traverse(a=>{const o=a.material;o&&(o.opacity=(o.color.getHexString()==="ffffff"?1:.5)*(1-r*.4))});else if(n.kind==="flash"){const a=Math.max(.05,(n.r+(n.maxR-n.r)*r)/Wt*.5);i.position.set(xt(n.x),n.z,vt(n.y)),i.scale.setScalar(a*(.4+r*.6)),i.material&&(i.material.opacity=.9*(1-r))}else{const a=(n.r+(n.maxR-n.r)*r)/Wt;i.position.set(xt(n.x),.09,vt(n.y)),i.scale.setScalar(Math.max(.05,a)),i.material.opacity=.8*(1-r)}})}syncParticles(e){const t=new Set(e);[...this.particleMeshes.keys()].forEach(n=>{t.has(n)||(this.fxGroup.remove(this.particleMeshes.get(n)),Zn(this.particleMeshes.get(n)),this.particleMeshes.delete(n))}),e.forEach(n=>{let i=this.particleMeshes.get(n);i||(i=new F(new Ze(1,6,4),new lt({color:n.color,transparent:!0,depthWrite:!1})),this.particleMeshes.set(n,i),this.fxGroup.add(i));const r=Math.max(0,n.life/n.maxLife);i.position.set(xt(n.x),n.z,vt(n.y)),i.scale.setScalar(n.size*r),i.material.opacity=r})}syncHelpers(e){const t=new Set(e.towers.map(o=>`${o.tx},${o.ty}`));let n=0,i=0,r=0,a="#ffffff";if(this.hoverMesh.visible=!1,e.buildType&&e.hoverTile){const[o,c]=e.hoverTile,l=en[e.buildType];n=_n(o),i=xn(c),r=Wl(l.range),a=o>=0&&o<tn&&c>=0&&c<nn&&!e.pathTiles.has(`${o},${c}`)&&!t.has(`${o},${c}`)&&e.gold>=l.cost?"#9fe09f":"#e78a7a",this.hoverMesh.visible=!0,this.hoverMesh.position.set(n,.06,i),this.hoverMesh.material.color.set(a)}else e.selected&&(n=_n(e.selected.tx),i=xn(e.selected.ty),r=Wl(e.selected.range),a="#ffffff");this.rangeMesh.visible=r>0,r>0&&(this.rangeMesh.position.set(n,.07,i),this.rangeMesh.scale.setScalar(r),this.rangeMesh.material.color.set(a))}render(e){this.clock=performance.now()/1e3,this.syncTowers(e.towers),this.syncMines(e.mines),this.syncEnemies(e.enemies),this.syncProjectiles(e.projectiles),this.syncEffects(e.effects),this.syncParticles(e.particles),this.syncHelpers(e),this.waterMat.emissiveIntensity=.12+.08*Math.sin(this.clock*2.2),this.waterTex&&(this.waterTex.offset.y=this.clock*.012%1),this.ripples.forEach(({mesh:t,phase:n})=>{const i=(this.clock*.55+n/(Math.PI*2))%1;t.scale.setScalar(.6+i*1.5),t.material.opacity=.5*(1-i)}),this.renderer.render(this.scene,this.camera)}}const ns=[{name:"前线进行曲",root:110,bpm:100,bass:[0,null,0,null,3,null,5,null,0,null,0,null,7,null,5,null],lead:[12,null,15,19,null,15,12,null,10,null,12,15,null,19,15,null],bassType:"triangle",leadType:"square"},{name:"霓虹脉冲",root:98,bpm:128,bass:[0,0,null,0,7,null,0,null,0,0,null,3,5,null,3,null],lead:[12,16,19,16,12,16,19,23,22,19,16,19,15,12,15,19],bassType:"sawtooth",leadType:"square"},{name:"深空回响",root:82.4,bpm:76,bass:[0,null,null,null,5,null,null,null,3,null,null,null,7,null,null,null],lead:[12,null,19,null,15,null,22,null,12,null,19,null,17,null,15,null],bassType:"sine",leadType:"triangle"}];class ag{constructor(){this.ctx=null,this.master=null,this.musicBus=null,this.sfxBus=null,this.musicTimer=null,this.musicStep=0,this.nextNoteTime=0,this.currentTrack=-1,this.muted=!1,this.musicMuted=!1,this.disposed=!1}ensure(){return this.disposed||typeof AudioContext>"u"?null:(this.ctx||(this.ctx=new AudioContext,this.master=this.ctx.createGain(),this.master.gain.value=.22,this.master.connect(this.ctx.destination),this.musicBus=this.ctx.createGain(),this.musicBus.gain.value=this.musicMuted?0:.9,this.musicBus.connect(this.master),this.sfxBus=this.ctx.createGain(),this.sfxBus.gain.value=this.muted?0:1,this.sfxBus.connect(this.master)),this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx)}unlock(){const e=!this.ctx||this.ctx.state==="suspended";this.ensure(),e&&this.currentTrack>=0&&this.playMusic(this.currentTrack)}musicNote(e,t,n,i,r){if(!this.ctx||!this.musicBus)return;const a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type=n,a.frequency.setValueAtTime(e,r),o.gain.setValueAtTime(1e-4,r),o.gain.linearRampToValueAtTime(i,r+.015),o.gain.exponentialRampToValueAtTime(1e-4,r+t),a.connect(o).connect(this.musicBus),a.start(r),a.stop(r+t+.02)}scheduleMusic(){const e=this.ctx;if(!e||this.currentTrack<0||this.musicMuted)return;this.nextNoteTime<e.currentTime-.1&&(this.nextNoteTime=e.currentTime+.03);const t=ns[this.currentTrack],n=60/t.bpm/2;for(;this.nextNoteTime<e.currentTime+.12;){const i=this.musicStep%16,r=t.bass[i],a=t.lead[i];r!==null&&this.musicNote(t.root*Math.pow(2,r/12),n*1.8,t.bassType,.28,this.nextNoteTime),a!==null&&this.musicNote(t.root*2*Math.pow(2,a/12),n*.9,t.leadType,.14,this.nextNoteTime),this.musicStep++,this.nextNoteTime+=n}}playMusic(e){const t=this.ensure();t&&(this.currentTrack=(e%ns.length+ns.length)%ns.length,this.musicStep=0,this.nextNoteTime=t.currentTime+.05,this.musicTimer!==null&&window.clearInterval(this.musicTimer),this.musicTimer=window.setInterval(()=>this.scheduleMusic(),25),this.scheduleMusic())}stopMusic(){this.musicTimer!==null&&window.clearInterval(this.musicTimer),this.musicTimer=null}playMusicForLevel(e){this.playMusic(Math.floor(Math.random()*ns.length))}dispose(){this.stopMusic(),this.disposed=!0,this.ctx&&this.ctx.close(),this.ctx=null,this.master=null,this.musicBus=null,this.sfxBus=null}setMuted(e){this.muted=e,this.sfxBus&&this.ctx&&this.sfxBus.gain.setTargetAtTime(e?0:1,this.ctx.currentTime,.02)}setMusicMuted(e){this.musicMuted=e,this.musicBus&&this.ctx&&this.musicBus.gain.setTargetAtTime(e?0:.9,this.ctx.currentTime,.03),!e&&this.currentTrack>=0&&(this.musicStep=0,this.nextNoteTime=this.ctx?this.ctx.currentTime+.05:0,this.scheduleMusic())}tone(e,t,n,i,r){if(this.muted)return;const a=this.ensure();if(!a||!this.sfxBus)return;const o=a.createOscillator(),c=a.createGain(),l=a.currentTime;o.type=n,o.frequency.setValueAtTime(e,l),r&&o.frequency.exponentialRampToValueAtTime(Math.max(1,r),l+t),c.gain.setValueAtTime(i,l),c.gain.exponentialRampToValueAtTime(.001,l+t),o.connect(c).connect(this.sfxBus),o.start(l),o.stop(l+t+.02)}noise(e,t,n,i){if(this.muted)return;const r=this.ensure();if(!r||!this.sfxBus)return;const a=Math.floor(r.sampleRate*e),o=r.createBuffer(1,a,r.sampleRate),c=o.getChannelData(0);for(let f=0;f<a;f++)c[f]=Math.random()*2-1;const l=r.createBufferSource();l.buffer=o;const h=r.createBiquadFilter();h.type="lowpass";const u=r.currentTime;h.frequency.setValueAtTime(n,u),i&&h.frequency.exponentialRampToValueAtTime(Math.max(60,i),u+e);const d=r.createGain();d.gain.setValueAtTime(t,u),d.gain.exponentialRampToValueAtTime(.001,u+e),l.connect(h).connect(d).connect(this.sfxBus),l.start(u),l.stop(u+e+.02)}build(){this.tone(320,.08,"square",.18),this.tone(480,.12,"square",.12)}upgrade(){this.tone(420,.1,"triangle",.16),this.tone(630,.14,"triangle",.14),this.tone(840,.18,"triangle",.1)}fire(e){e==="machinegun"||e==="aa"?(this.noise(.06,.12,2600,900),this.tone(180,.05,"square",.06,90)):e==="howitzer"?(this.noise(.22,.28,1200,180),this.tone(90,.2,"sine",.16,45)):(this.noise(.16,.24,1500,240),this.tone(110,.16,"sine",.14,55))}explode(e=!1){this.noise(e?.42:.24,e?.34:.2,e?900:1400,90),this.tone(e?70:100,e?.32:.18,"sine",.12,40)}leak(){this.tone(220,.3,"sawtooth",.2,80),this.noise(.25,.16,700,200)}wave(){this.tone(330,.12,"square",.12),this.tone(440,.12,"square",.12),this.tone(550,.2,"square",.1)}win(){[392,494,587,784].forEach((e,t)=>setTimeout(()=>this.tone(e,.3,"triangle",.16),t*130))}lose(){[330,262,196].forEach((e,t)=>setTimeout(()=>this.tone(e,.4,"sawtooth",.16),t*180))}}const oe=s=>document.getElementById(s),pt=s=>`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${s}</svg>`,ql={machinegun:pt('<rect x="18" y="43" width="28" height="11" rx="3"/><path d="M26 43V32h10v11"/><rect x="35" y="25" width="21" height="5" rx="2"/><rect x="35" y="33" width="21" height="5" rx="2"/>'),howitzer:pt('<rect x="12" y="44" width="40" height="10" rx="3"/><circle cx="21" cy="49" r="3.5"/><circle cx="43" cy="49" r="3.5"/><path d="M28 44L45 20"/><rect x="41" y="14" width="11" height="9" rx="2" transform="rotate(-35 46.5 18.5)"/>'),aa:pt('<rect x="18" y="44" width="28" height="10" rx="3"/><path d="M32 44L45 16"/><rect x="41" y="10" width="10" height="9" rx="2" transform="rotate(-22 46 14.5)"/><path d="M22 44V34h9"/>'),coastal:pt('<rect x="10" y="44" width="44" height="10" rx="3"/><path d="M24 44L46 22"/><rect x="42" y="15" width="14" height="9" rx="2"/><path d="M14 44V30h11"/>'),laser:pt('<rect x="16" y="43" width="32" height="11" rx="3"/><rect x="28" y="29" width="11" height="14" rx="2"/><path d="M39 36h12"/><path d="M56 36l-7-4v8z" fill="currentColor" stroke="none"/>'),flak:pt('<rect x="16" y="44" width="32" height="10" rx="3"/><path d="M27 44l9-20M35 44l7-18"/><circle cx="47" cy="17" r="7" stroke-dasharray="3 3"/>'),railgun:pt('<rect x="12" y="44" width="36" height="10" rx="3"/><rect x="24" y="32" width="32" height="4" rx="1"/><rect x="24" y="40" width="32" height="4" rx="1"/><path d="M30 36v4M38 36v4M46 36v4"/><path d="M58 34l5 4-5 4"/>'),tesla:pt('<path d="M23 54h18l-4-24H27z"/><path d="M32 30V18"/><circle cx="32" cy="14" r="4"/><path d="M26 12l-6-6M38 12l6-6M32 10V3"/>'),mine:pt('<rect x="10" y="42" width="44" height="11" rx="3"/><rect x="20" y="30" width="24" height="12" rx="2"/><path d="M32 30V14h16"/><circle cx="50" cy="14" r="5"/><path d="M8 56c6-3 12-3 18 0s12 3 18 0 12-3 14 0"/><circle cx="50" cy="14" r="2" fill="currentColor" stroke="none"/>'),infantry:pt('<circle cx="32" cy="17" r="7"/><path d="M32 24v19M22 31l10 5 10-5M26 43l-4 12M38 43l4 12"/>'),truck:pt('<rect x="8" y="30" width="32" height="17" rx="3"/><path d="M40 35h9l7 8v4H40z"/><circle cx="19" cy="49" r="4.5"/><circle cx="45" cy="49" r="4.5"/><path d="M14 35h18"/>'),tank:pt('<rect x="7" y="38" width="50" height="12" rx="6"/><circle cx="18" cy="44" r="3"/><circle cx="32" cy="44" r="3"/><circle cx="46" cy="44" r="3"/><path d="M19 38l4-12h18l4 12"/><path d="M32 26V14h16"/>'),plane:pt('<path d="M32 7l4 20 22 8v5l-22-3-2 11 6 4v3l-8-2-8 2v-3l6-4-2-11-22 3v-5l22-8z"/>'),ship:pt('<path d="M7 37h50l-9 15H16z"/><path d="M20 37V23h24v14"/><path d="M28 23V15h8v8"/><path d="M12 55h40"/>'),mech:pt('<rect x="22" y="13" width="20" height="14" rx="3"/><path d="M18 27h28l4 16H40l-2-9H26l-2 9H14z"/><path d="M24 43l-4 12M40 43l4 12"/><path d="M28 20h2M34 20h2"/>'),drone:pt('<rect x="26" y="26" width="12" height="10" rx="3"/><path d="M26 30H13M38 30h13M32 26V14"/><circle cx="11" cy="30" r="5"/><circle cx="53" cy="30" r="5"/><circle cx="32" cy="12" r="4"/>'),hovercraft:pt('<path d="M9 33h46l-7 12H16z"/><path d="M22 33V21h20v12"/><path d="M12 50c8 4 32 4 40 0"/><path d="M20 17h24"/>'),strider:pt('<path d="M32 9l12 12-4 19H24l-4-19z"/><path d="M24 40l-10 15M40 40l10 15M32 40v15"/><circle cx="32" cy="22" r="4"/>'),bomber:pt('<path d="M32 6l3 18 24 10v5l-24-4-2 14 7 5v3l-8-2-8 2v-3l7-5-2-14-24 4v-5l24-10z"/><rect x="27" y="30" width="10" height="5"/><path d="M22 22h20"/>'),helicopter:pt('<path d="M8 18h48"/><path d="M32 18v8"/><circle cx="32" cy="32" r="10"/><path d="M22 32H12M42 32h10M32 42v8"/><path d="M26 48h12"/><circle cx="32" cy="32" r="3"/>'),destroyer:pt('<path d="M6 36h52l-8 14H14z"/><path d="M18 36V24h20v12"/><path d="M26 24v-8h6"/><path d="M40 36V28h8v8"/><path d="M12 55h40"/><path d="M30 20h8"/>'),submarine:pt('<path d="M10 34c8-9 36-9 44 0-8 9-36 9-44 0z"/><path d="M26 25v-6h10v6"/><path d="M30 19v-5h6"/><circle cx="22" cy="34" r="2"/><circle cx="32" cy="34" r="2"/><circle cx="42" cy="34" r="2"/><path d="M54 34h6"/>'),default:pt('<circle cx="32" cy="32" r="18"/><path d="M32 20v24M20 32h24"/>')};function Ni(s,e){return`${s},${e}`}function og(s){const e=[],t=(n,i)=>{e.some(r=>r[0]===n&&r[1]===i)||e.push([n,i])};t(s[0][0],s[0][1]);for(let n=0;n<s.length-1;n++){const[i,r]=s[n],[a,o]=s[n+1],c=Math.max(Math.abs(a-i),Math.abs(o-r));for(let l=1;l<=c;l++)t(Math.round(i+(a-i)*l/c),Math.round(r+(o-r)*l/c))}return e}function Yl(s){const e=og(s),t=e.map(([i,r])=>Qa(i,r));let n=0;for(let i=1;i<t.length;i++)n+=Math.hypot(t[i].x-t[i-1].x,t[i].y-t[i-1].y);return{tiles:e,points:t,length:n}}function lg(){const s={x:-40,y:70+Math.random()*320},e=Qa(Fi[0],Fi[1]);return{tiles:[],points:[s,e],length:Math.hypot(e.x-s.x,e.y-s.y)}}class cg{constructor(e){this.audio=new ag,this.levelIndex=0,this.gold=0,this.lives=0,this.waveIndex=-1,this.status="ready",this.towers=[],this.enemies=[],this.projectiles=[],this.mines=[],this.effects=[],this.particles=[],this.schedule=[],this.waveTime=0,this.countdown=0,this.speed=1,this.paused=!1,this.buildType=null,this.selected=null,this.hoverTile=null,this.towerAt=new Map,this.groundPaths=[],this.waterPaths=[],this.pathTiles=new Set,this.id=0,this.lastTime=0,this.bannerTimer=0,this.destroy=()=>{this.audio.dispose()},this.loop=t=>{const n=Math.min(.05,(t-this.lastTime)/1e3);this.lastTime=t,this.update(n),this.render(),this.syncUI(),requestAnimationFrame(this.loop)},this.canvas=e,this.view=new rg(e),this.buildTowerList(),this.buildEnemyCodex(),this.fillLevelSelect(),this.bindTabs(),this.bindEvents(),this.loadLevel(1),this.lastTime=performance.now(),requestAnimationFrame(this.loop),window.addEventListener("pagehide",this.destroy),window.addEventListener("beforeunload",this.destroy)}get level(){return $i[this.levelIndex]}burst(e,t,n,i,r,a=70,o=.09,c=.5){this.particles.length>320&&this.particles.splice(0,this.particles.length-280);for(let l=0;l<i;l++){const h=Math.random()*Math.PI*2,u=a*(.4+Math.random()*.8);this.particles.push({id:++this.id,x:e,y:t,z:n,vx:Math.cos(h)*u,vy:40+Math.random()*90,vz:Math.sin(h)*u,life:c*(.7+Math.random()*.6),maxLife:c,color:r,size:o*(.6+Math.random()*.8)})}}dust(e,t,n,i=3){this.particles.length>320&&this.particles.splice(0,this.particles.length-280);for(let r=0;r<i;r++){const a=Math.random()*Math.PI*2,o=6+Math.random()*16;this.particles.push({id:++this.id,x:e,y:t,z:.1+Math.random()*.08,vx:Math.cos(a)*o,vy:4+Math.random()*10,vz:Math.sin(a)*o,life:.5+Math.random()*.3,maxLife:.8,color:n,size:.08+Math.random()*.08})}}fillLevelSelect(){const e=oe("level-select");e.innerHTML=$i.map(t=>`<option value="${t.id}">第 ${t.id} 关 · ${t.name}</option>`).join(""),e.addEventListener("change",()=>this.loadLevel(Number(e.value)))}buildTowerList(){const e=oe("tower-list"),t=["machinegun","howitzer","aa","coastal","laser","flak","railgun","tesla","mine"];e.innerHTML=t.map((n,i)=>{const r=en[n],a=r.targets.map(c=>c==="ground"?"地面":c==="air"?"空中":"水路").join("/"),o=[r.pierceArmor?"穿甲":"",r.splash?`溅射${r.splash}`:"",r.chain?`连锁${r.chain}`:"",r.minelayer?"定时布雷":""].filter(Boolean).join("·");return`<button class="tower-card" data-type="${n}" style="--swatch:${r.color}">
        <span class="tower-swatch"></span>
        <span class="tower-main">
          <span class="tower-title"><strong>${r.name}</strong><span class="tower-cost">${r.cost}</span></span>
          <span class="tower-desc">${r.desc}</span>
          <span class="tower-stats">伤害 ${r.damage} · 射程 ${r.range} · ${r.fireRate.toFixed(1)}/秒</span>
          <span class="tower-tags"><span class="minitag">${a}</span>${o?`<span class="minitag alt">${o}</span>`:""}</span>
        </span>
        <span class="tower-key">${i+1}</span>
      </button>`}).join(""),e.querySelectorAll(".tower-card").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.type;this.buildType=this.buildType===i?null:i,this.buildType&&(this.selected=null),this.syncTowerList(),this.syncInfo()}),n.addEventListener("mouseenter",()=>{!this.selected&&!this.buildType&&this.showWeaponPreview(n.dataset.type)})})}showTab(e){document.querySelectorAll(".build-panel .tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===e)),oe("tab-build").classList.toggle("hidden",e!=="build"),oe("tab-codex").classList.toggle("hidden",e!=="codex")}setInfoIcon(e,t,n){const i=oe("info-gallery");i.style.setProperty("--icon-color",t),i.style.setProperty("--icon-glow",`${t}33`),oe("info-icon").innerHTML=ql[e]??ql.default,oe("info-kind").textContent=n}showWeaponPreview(e){const t=en[e];this.setInfoIcon(e,t.color,"武器图鉴"),oe("info-empty").classList.add("hidden"),oe("info-detail").classList.remove("hidden"),(t.minelayer?["等级","伤害","爆炸半径","布雷周期","探测范围"]:["等级","伤害","射程","射速","目标"]).forEach((i,r)=>{oe(`info-k${r+1}`).textContent=i}),oe("info-desc").classList.remove("counter"),oe("info-name").textContent=t.name,oe("info-tags").innerHTML=`<span class="tag">造价 ${t.cost}</span>${t.pierceArmor?'<span class="tag alt">穿甲</span>':""}${t.chain?`<span class="tag alt">连锁 ${t.chain}</span>`:""}${t.minelayer?'<span class="tag alt">定时布雷</span>':""}`,oe("info-level").textContent=t.minelayer?"3~5 颗":"-",oe("info-damage").textContent=String(t.damage),oe("info-range").textContent=t.minelayer?String(t.splash):String(t.range),oe("info-rate").textContent=t.minelayer?`${(1/t.fireRate).toFixed(1)} 秒`:`${t.fireRate.toFixed(1)} /秒`,oe("info-target").textContent=t.minelayer?String(t.range):t.targets.map(i=>i==="ground"?"地面":i==="air"?"空中":"水路").join("/"),oe("info-desc").textContent=t.desc,oe("info-actions").classList.add("hidden")}bindTabs(){document.querySelectorAll(".build-panel .tab").forEach(e=>{e.addEventListener("click",()=>this.showTab(e.dataset.tab))})}buildEnemyCodex(){const e=oe("enemy-codex"),t=["infantry","truck","tank","mech","strider","plane","drone","helicopter","bomber","ship","hovercraft","submarine","destroyer"],n=i=>i==="ground"?"地面":i==="air"?"空中":"水路";e.innerHTML=t.map((i,r)=>{const a=di[i],o=a.bounty>=60?"首领级":a.bounty>=30?"重装":a.bounty>=15?"进阶":"基础";return`<button class="enemy-card" data-type="${i}" style="--swatch:${a.color}">
        <span class="enemy-swatch"></span>
        <span class="enemy-main">
          <span class="enemy-title"><strong>${a.name}</strong><span class="enemy-bounty">${a.bounty}</span></span>
          <span class="enemy-desc">${n(a.kind)}目标 · 对基地伤害 ${a.damage}</span>
          <span class="enemy-stats">生命 ${a.hp} · 速 ${a.speed} · 甲 ${a.armor}</span>
          <span class="enemy-tags"><span class="minitag">${n(a.kind)}</span><span class="minitag alt">${o}</span></span>
        </span>
        <span class="enemy-key">${r+1}</span>
      </button>`}).join(""),e.querySelectorAll(".enemy-card").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.type;e.querySelectorAll(".enemy-card").forEach(a=>a.classList.toggle("active",a===i)),this.showEnemyDetail(r)})})}showEnemyDetail(e){const t=di[e],n=t.kind==="ground"?"地面":t.kind==="air"?"空中":"水路",i=t.bounty>=60?"首领级":t.bounty>=30?"重装":t.bounty>=15?"进阶":"基础";this.setInfoIcon(e,t.color,"敌军图鉴"),oe("info-empty").classList.add("hidden"),oe("info-detail").classList.remove("hidden");const r=["类型","生命","速度","护甲","对基地伤害"],a=[n,String(t.hp),String(t.speed),String(t.armor),String(t.damage)];r.forEach((o,c)=>{oe(`info-k${c+1}`).textContent=o}),oe("info-name").textContent=t.name,oe("info-tags").innerHTML=`<span class="tag">赏金 ${t.bounty} 金</span><span class="tag alt">${i}</span>`,["info-level","info-damage","info-range","info-rate","info-target"].forEach((o,c)=>{oe(o).textContent=a[c]}),oe("info-desc").textContent=this.enemyCounterNote(e),oe("info-desc").classList.add("counter"),oe("info-actions").classList.add("hidden")}enemyCounterNote(e){return{infantry:"轻甲或无甲，机枪炮台与激光炮可高效清理。",truck:"轻装甲，机枪可压制，榴弹炮群伤更省。",tank:"厚重装甲，优先电磁轨道炮穿甲或榴弹炮集火。",plane:"高速空中单位，需防空炮、防空爆破炮或激光炮拦截。",ship:"高生命水路单位，使用岸防炮或电磁轨道炮攻击。",mech:"重甲地面单位，电磁轨道炮无视护甲效果最佳。",drone:"极快空中目标，防空炮与激光炮的高射速更可靠。",hovercraft:"高速水路单位，岸防炮配合电磁轨道炮拦截。",strider:"超高生命的终极地面单位，集中穿甲与连锁火力。",bomber:"重装轰炸机，生命厚且伤害高，需多台防空炮与激光炮集火。",helicopter:"灵活直升机，速度较快，防空爆破炮的范围伤害尤为有效。",destroyer:"重型驱逐舰，装甲厚实，优先电磁轨道炮穿甲与岸防炮集火。",submarine:"高速潜艇，岸防炮射速与电磁轨道炮穿甲可有效拦截。"}[e]||"根据类型选择合适的武器拦截。"}syncTowerList(){document.querySelectorAll(".tower-card").forEach(e=>{e.classList.toggle("active",e.dataset.type===this.buildType),e.classList.toggle("unaffordable",Number(en[e.dataset.type].cost)>this.gold)})}bindEvents(){this.canvas.addEventListener("mousemove",e=>{this.hoverTile=this.view.getTileFromEvent(e)}),this.canvas.addEventListener("mouseleave",()=>{this.hoverTile=null}),this.canvas.addEventListener("click",e=>{const t=this.view.getTileFromEvent(e);if(!t)return;const[n,i]=t;if(this.buildType){this.tryBuild(n,i,this.buildType);return}const r=this.towerAt.get(Ni(n,i));this.selected=r??null,this.syncInfo()}),this.canvas.addEventListener("contextmenu",e=>{e.preventDefault(),this.buildType=null,this.syncTowerList()}),oe("btn-start").addEventListener("click",()=>this.startWave(!0)),oe("btn-speed").addEventListener("click",()=>{this.speed=this.speed===1?2:1,oe("btn-speed").textContent=`速度 ${this.speed}x`}),oe("btn-pause").addEventListener("click",()=>{this.paused=!this.paused,oe("btn-pause").textContent=this.paused?"继续":"暂停",oe("btn-pause").classList.toggle("active",this.paused)}),oe("btn-rot-left").addEventListener("click",()=>this.view.rotateBy(-Math.PI/8)),oe("btn-rot-right").addEventListener("click",()=>this.view.rotateBy(Math.PI/8)),oe("btn-cam-reset").addEventListener("click",()=>this.view.resetCamera()),oe("btn-music").addEventListener("click",()=>{const e=!this.audio.musicMuted;this.audio.setMusicMuted(e),oe("btn-music").textContent=e?"音乐 关":"音乐 开",oe("btn-music").classList.toggle("active",e),e||this.audio.unlock()}),oe("btn-audio").addEventListener("click",()=>{const e=!this.audio.muted;this.audio.setMuted(e),oe("btn-audio").textContent=e?"音效 关":"音效 开",oe("btn-audio").classList.toggle("active",e),e||this.audio.unlock()}),document.addEventListener("click",()=>this.audio.unlock(),{once:!0}),oe("btn-upgrade").addEventListener("click",()=>this.upgradeSelected()),oe("btn-sell").addEventListener("click",()=>this.sellSelected()),oe("btn-retry").addEventListener("click",()=>this.loadLevel(this.level.id)),oe("btn-next").addEventListener("click",()=>this.loadLevel(Math.min($i.length,this.level.id+1))),window.addEventListener("keydown",e=>{const t={1:"machinegun",2:"howitzer",3:"aa",4:"coastal",5:"laser",6:"flak",7:"railgun",8:"tesla",9:"mine"};t[e.key]&&(this.buildType=t[e.key],this.showTab("build"),this.syncTowerList()),e.key==="Escape"&&(this.buildType=null,this.selected=null,this.syncTowerList(),this.syncInfo()),(e.key==="q"||e.key==="Q")&&this.view.rotateBy(-Math.PI/8),(e.key==="e"||e.key==="E")&&this.view.rotateBy(Math.PI/8),e.code==="Space"&&(e.preventDefault(),this.status!=="wave"&&this.startWave(!0))})}loadLevel(e){this.levelIndex=Math.max(0,Math.min($i.length-1,e-1));const t=this.level;this.groundPaths=t.ground.map(Yl),this.waterPaths=t.water.map(Yl),this.pathTiles=new Set,[...this.groundPaths,...this.waterPaths].forEach(n=>n.tiles.forEach(([i,r])=>this.pathTiles.add(Ni(i,r)))),this.gold=t.gold,this.lives=t.lives,this.waveIndex=-1,this.status="ready",this.towers=[],this.enemies=[],this.projectiles=[],this.mines=[],this.effects=[],this.particles=[],this.schedule=[],this.towerAt.clear(),this.selected=null,this.buildType=null,this.countdown=0,this.paused=!1,oe("btn-pause").textContent="暂停",oe("btn-pause").classList.remove("active"),oe("level-select").value=String(t.id),oe("result").classList.add("hidden"),this.view.buildLevel(this.groundPaths,this.waterPaths,this.pathTiles,t.theme),this.audio.playMusicForLevel(t.id),this.showBanner(`第 ${t.id} 关 · ${t.name}`,t.desc),this.syncAll()}showBanner(e,t){const n=oe("banner");n.innerHTML=`<strong>${e}</strong><span>${t}</span>`,n.classList.remove("hidden"),this.bannerTimer=3.2}canBuild(e,t){return e>=0&&e<tn&&t>=0&&t<nn&&!this.pathTiles.has(Ni(e,t))&&!this.towerAt.has(Ni(e,t))}tryBuild(e,t,n){const i=en[n];if(!this.canBuild(e,t)){this.flash("此处无法建造");return}if(i.minelayer&&this.waterPaths.length===0){this.flash("本关没有水路，无法布设水雷");return}if(this.gold<i.cost){this.flash("金币不足");return}const r=Qa(e,t),a={id:++this.id,type:n,level:1,tx:e,ty:t,x:r.x,y:r.y,damage:i.damage,range:i.range,fireRate:i.fireRate,cooldown:0,totalCost:i.cost,angle:-Math.PI/2};this.towers.push(a),this.towerAt.set(Ni(e,t),a),this.gold-=i.cost,this.selected=a,this.audio.build(),this.burst(r.x,r.y,.3,8,i.color,45,.08,.45),this.syncAll()}upgradeCost(e){return Math.round(en[e.type].cost*(Ts.cost+.6*(e.level-1)))}upgradeSelected(){const e=this.selected;if(!e||e.level>=As)return;const t=this.upgradeCost(e);if(this.gold<t){this.flash("金币不足");return}this.gold-=t,e.totalCost+=t,e.level+=1,e.damage*=Ts.damage,e.range*=Ts.range,e.fireRate*=Ts.fireRate,this.audio.upgrade(),this.burst(e.x,e.y,.6,12,"#ffe9a8",55,.08,.6),this.syncAll()}sellSelected(){const e=this.selected;e&&(this.gold+=Math.round(e.totalCost*Do),this.towers=this.towers.filter(t=>t.id!==e.id),this.mines=this.mines.filter(t=>t.ownerId!==e.id),this.towerAt.delete(Ni(e.tx,e.ty)),this.selected=null,this.syncAll())}flash(e){const t=oe("banner");t.innerHTML=`<strong>${e}</strong>`,t.classList.remove("hidden"),this.bannerTimer=1.2}startWave(e){if(this.status==="wave"||this.status==="won"||this.status==="lost")return;e&&this.status==="cleared"&&(this.gold+=8,this.flash("提前出击 +8 金币")),this.waveIndex+=1;const t=this.level.waves[this.waveIndex];if(!t)return;const n=[];t.groups.forEach(i=>{for(let r=0;r<i.count;r++)n.push({time:i.delay+r*i.interval,group:i})}),n.sort((i,r)=>i.time-r.time),this.schedule=n,this.waveTime=0,this.status="wave",this.audio.wave(),this.syncAll()}spawn(e){const t=di[e.type];let n;if(t.kind==="ground"?n=this.groundPaths[e.lane%this.groundPaths.length]:t.kind==="water"?n=this.waterPaths[e.lane%this.waterPaths.length]:n=lg(),!n)return;const i=t.hp*e.hpScale*No(this.level.id);this.enemies.push({id:++this.id,type:e.type,kind:t.kind,x:n.points[0].x,y:n.points[0].y,hp:i,maxHp:i,armor:t.armor,speed:t.speed,bounty:Math.round(t.bounty*(.55+.22*Math.sqrt(e.hpScale*No(this.level.id)-1))),damage:t.damage,size:t.size*(e.boss?1.5:1),color:t.color,boss:!!e.boss,path:n,index:0,traveled:0,angle:0,dead:!1})}findTarget(e){let t=null,n=1/0;for(const i of this.enemies){if(i.dead||i.x<0||i.x>br||i.y<0||i.y>Tr||!en[e.type].targets.includes(i.kind)||Math.hypot(i.x-e.x,i.y-e.y)>e.range)continue;const r=i.path.length-i.traveled;r<n&&(n=r,t=i)}return t}fire(e,t){const n=en[e.type],i=t.x-e.x,r=t.y-e.y,a=Math.hypot(i,r)||1,o=n.projectileSpeed;e.angle=Math.atan2(r,i);const c=i>0?(br-e.x)*a/i:i<0?-e.x*a/i:1/0,l=r>0?(Tr-e.y)*a/r:r<0?-e.y*a/r:1/0,h=Math.min(a+6,Math.min(c,l)+2);this.projectiles.push({x:e.x,y:e.y,target:t,lastX:e.x,lastY:e.y,vx:i/a,vy:r/a,distance:0,maxDistance:h,speed:o,damage:e.damage,splash:n.splash,pierceArmor:!!n.pierceArmor,chain:n.chain||0,color:n.color,alive:!0,type:e.type,originX:e.x,originY:e.y}),this.audio.fire(e.type);const u=e.x+Math.cos(e.angle)*16,d=e.y+Math.sin(e.angle)*16;this.burst(u,d,.55,e.type==="machinegun"||e.type==="aa"?2:5,n.color,40,.07,.22)}damageEnemy(e,t,n=!1){if(e.dead)return;const i=50;e.hp-=n?t:t*(1-e.armor/(e.armor+i)),e.hp<=0&&(e.dead=!0,this.gold+=e.bounty,this.effects.push({x:e.x,y:e.y,z:.5,r:4,maxR:e.size*2.4,life:.35,maxLife:.35,color:"#ffd08a",kind:"ring"}),this.burst(e.x,e.y,.35,e.size>12?12:5,"#ffcf82",65,.1,.45),e.size>12&&this.audio.explode(!0))}segmentHits(e,t,n,i,r,a,o){const c=n-e,l=i-t,h=c*c+l*l;let u=h>0?((r-e)*c+(a-t)*l)/h:0;u=Math.max(0,Math.min(1,u));const d=e+c*u,f=t+l*u;return(r-d)*(r-d)+(a-f)*(a-f)<=o*o}nearestWaterPoint(e,t,n){let i=null,r=n;for(const a of this.waterPaths)for(const o of a.points){const c=Math.hypot(o.x-e,o.y-t);c<r&&(r=c,i=o)}return i}layMines(e){const t=en[e.type],n=this.mines.filter(u=>u.ownerId===e.id).length,r=e.level+2-n;if(r<=0)return;const a=e.initialized?1:r;e.initialized=!0;const o=this.nearestWaterPoint(e.x,e.y,e.range);if(!o)return;const c=o.x-e.x,l=o.y-e.y,h=Math.hypot(c,l)||1;e.angle=Math.atan2(l,c);for(let u=0;u<a;u++){const d=(u-(a-1)/2)*22;this.mines.push({id:++this.id,ownerId:e.id,x:o.x-l/h*d,y:o.y+c/h*d,damage:e.damage,splash:t.splash,color:t.color})}this.burst(o.x,o.y,.3,6,t.color,55,.1,.4),this.audio.fire("coastal")}detonateMine(e){let t=!1;for(const n of this.enemies)n.dead||n.kind!=="water"||Math.hypot(n.x-e.x,n.y-e.y)<=e.splash&&(this.damageEnemy(n,e.damage),t=!0);t&&(this.effects.push({x:e.x,y:e.y,z:.45,r:6,maxR:e.splash,life:.42,maxLife:.42,color:e.color,kind:"ring"}),this.effects.push({x:e.x,y:e.y,z:.45,r:2,maxR:Math.min(e.splash*.5,18),life:.2,maxLife:.2,color:"#fff0c8",kind:"flash"}),this.burst(e.x,e.y,.45,16,e.color,95,.12,.5),this.audio.explode(!1))}hit(e){var a;const t=e.lastX,n=e.lastY,i=((a=e.target)==null?void 0:a.kind)==="air"?1.3:.5;e.type==="laser"&&this.effects.push({x:t,y:n,z:i,r:0,maxR:0,life:.14,maxLife:.14,color:"#ffffff",color2:"#79e2d6",kind:"beam",points:[{x:e.originX,y:e.originY},{x:t,y:n}],width:.1});const r=e.type==="tesla"?[{x:e.originX,y:e.originY},{x:t,y:n}]:[];if(e.splash>0){for(const o of this.enemies)!o.dead&&Math.hypot(o.x-t,o.y-n)<=e.splash&&this.damageEnemy(o,e.damage,e.pierceArmor);this.effects.push({x:t,y:n,z:i,r:4,maxR:e.splash,life:.32,maxLife:.32,color:e.color,kind:"ring"}),this.effects.push({x:t,y:n,z:i,r:2,maxR:Math.min(e.splash*.45,16),life:.16,maxLife:.16,color:"#fff3d6",kind:"flash"}),this.burst(t,n,i,10,e.color,80,.1,.4),this.audio.explode(!1)}else{let o=!1;if(e.target&&!e.target.dead&&Math.hypot(e.target.x-t,e.target.y-n)<=18&&(this.damageEnemy(e.target,e.damage,e.pierceArmor),o=!0),e.chain>0&&(this.enemies.filter(l=>!l.dead&&l!==e.target&&Math.hypot(l.x-t,l.y-n)<=95).sort((l,h)=>Math.hypot(l.x-t,l.y-n)-Math.hypot(h.x-t,h.y-n)).slice(0,e.chain).forEach(l=>{this.damageEnemy(l,e.damage*.7,e.pierceArmor),r.length&&r.push({x:l.x,y:l.y})}),o=!0),r.length>1)this.effects.push({x:t,y:n,z:i,r:0,maxR:0,life:.3,maxLife:.3,color:"#f0e6ff",color2:e.color,kind:"arc",points:r,width:.07}),this.burst(t,n,i,8,e.color,60,.07,.3);else if(o){const c=e.type==="railgun"?"#dff0ff":e.type==="laser"?"#ffffff":e.type==="machinegun"||e.type==="aa"?"#fff0b0":"#ffffff";this.effects.push({x:t,y:n,z:i,r:2,maxR:e.type==="railgun"?16:10,life:.16,maxLife:.16,color:c,kind:"flash"}),this.burst(t,n,i,e.type==="railgun"?8:4,e.color,55,.07,.24)}}e.alive=!1}reachBase(e){e.dead=!0,this.lives-=e.damage,this.effects.push({x:e.x,y:e.y,z:.5,r:6,maxR:30,life:.5,maxLife:.5,color:"#e35d5d",kind:"ring"}),this.burst(e.x,e.y,.5,10,"#e35d5d",80,.12,.6),this.audio.leak(),this.lives<=0&&(this.lives=0,this.status="lost",this.showResult(!1))}update(e){const t=e*this.speed;if(this.bannerTimer>0&&(this.bannerTimer-=e,this.bannerTimer<=0&&oe("banner").classList.add("hidden")),!this.paused){if(this.status==="cleared"&&(this.countdown-=t,this.countdown<=0&&this.startWave(!1)),this.status==="wave"){for(this.waveTime+=t;this.schedule.length&&this.schedule[0].time<=this.waveTime;)this.spawn(this.schedule.shift().group);const n=this.level.theme.deco,i=n==="space"?"#9fb6d8":n==="city"||n==="rails"?"#9a9a92":n==="snow"?"#e2edf0":n==="desert"?"#c6a878":"#8c795c";for(const a of this.enemies){if(a.dead)continue;const o=a.traveled,c=a.path.points[a.index+1];if(!c){this.reachBase(a);continue}const l=c.x-a.x,h=c.y-a.y,u=Math.hypot(l,h),d=a.speed*t;a.angle=Math.atan2(h,l),u<=d?(a.x=c.x,a.y=c.y,a.traveled+=u,a.index+=1,a.index>=a.path.points.length-1&&this.reachBase(a)):(a.x+=l/u*d,a.y+=h/u*d,a.traveled+=d),a.kind==="ground"&&a.type!=="infantry"&&Math.floor(a.traveled/11)!==Math.floor(o/11)?this.dust(a.x,a.y,i,3):a.kind==="water"&&Math.floor(a.traveled/14)!==Math.floor(o/14)&&this.dust(a.x,a.y,"#bfe6f2",2)}for(const a of this.towers){if(a.cooldown-=t,a.cooldown>0)continue;if(en[a.type].minelayer){this.layMines(a),a.cooldown=1/a.fireRate;continue}const c=this.findTarget(a);c&&(this.fire(a,c),a.cooldown=1/a.fireRate)}const r=new Set;for(const a of this.mines)for(const o of this.enemies)if(!(o.dead||o.kind!=="water")&&Math.hypot(o.x-a.x,o.y-a.y)<=Math.max(12,o.size*.6)){this.detonateMine(a),r.add(a.id);break}r.size&&(this.mines=this.mines.filter(a=>!r.has(a.id)));for(const a of this.projectiles){if(!a.alive)continue;const o=a.speed*t,c=a.x,l=a.y;if(a.x+=a.vx*o,a.y+=a.vy*o,a.distance+=o,a.lastX=a.x,a.lastY=a.y,a.x<0||a.x>br||a.y<0||a.y>Tr){a.alive=!1;continue}let h=!1;for(const u of this.enemies){if(u.dead)continue;const d=Math.max(9,u.size*.6+3);if(this.segmentHits(c,l,a.x,a.y,u.x,u.y,d)){a.target=u,h=!0;break}}(h||a.distance>=a.maxDistance)&&this.hit(a)}this.enemies=this.enemies.filter(a=>!a.dead),this.projectiles=this.projectiles.filter(a=>a.alive),this.status==="wave"&&this.schedule.length===0&&this.enemies.length===0&&(this.waveIndex+1>=this.level.waves.length?(this.status="won",this.showResult(!0)):(this.status="cleared",this.countdown=6,this.gold+=15))}this.effects=this.effects.filter(n=>(n.life-=t,n.life>0)),this.particles=this.particles.filter(n=>(n.life-=t,n.x+=n.vx*t,n.y+=n.vz*t,n.z+=n.vy*t,n.vy-=190*t,n.vx*=.97,n.vz*=.97,n.z<0&&(n.z=0,n.vy*=-.25),n.life>0))}}render(){this.view.render({towers:this.towers,enemies:this.enemies,projectiles:this.projectiles,effects:this.effects,particles:this.particles,selected:this.selected,buildType:this.buildType,hoverTile:this.hoverTile,pathTiles:this.pathTiles,mines:this.mines,gold:this.gold})}showResult(e){oe("result-title").textContent=e?"防线守住了":"基地失守",oe("result-desc").textContent=e?`第 ${this.level.id} 关「${this.level.name}」完成，剩余基地生命 ${this.lives}。`:`第 ${this.level.id} 关作战失败，调整部署后再试一次。`,oe("btn-next").style.display=e&&this.level.id<$i.length?"":"none",oe("result").classList.remove("hidden"),e?this.audio.win():this.audio.lose(),this.syncAll()}syncAll(){this.syncTowerList(),this.syncInfo(),this.syncUI()}syncInfo(){const e=this.selected;if(!e){this.buildType?this.showWeaponPreview(this.buildType):(oe("info-empty").classList.remove("hidden"),oe("info-detail").classList.add("hidden"));return}oe("info-empty").classList.add("hidden"),oe("info-detail").classList.remove("hidden");const t=en[e.type];(t.minelayer?["等级","伤害","爆炸半径","布雷周期","探测范围"]:["等级","伤害","射程","射速","目标"]).forEach((a,o)=>{oe(`info-k${o+1}`).textContent=a}),oe("info-desc").classList.remove("counter"),oe("info-actions").classList.remove("hidden"),this.setInfoIcon(e.type,t.color,"防御塔图鉴"),oe("info-name").textContent=`${t.name} Lv.${e.level}`,oe("info-tags").innerHTML=`<span class="tag">造价 ${e.totalCost}</span>${t.minelayer?`<span class="tag alt">每次布雷 ${e.level+2} 颗</span>`:""}${t.pierceArmor?'<span class="tag alt">穿甲</span>':""}${t.chain?`<span class="tag alt">连锁 ${t.chain}</span>`:""}${t.splash&&!t.minelayer?`<span class="tag alt">溅射 ${t.splash}</span>`:""}`,oe("info-level").textContent=`${e.level} / ${As}`,oe("info-damage").textContent=Math.round(e.damage).toString(),oe("info-range").textContent=t.minelayer?Math.round(en.mine.splash).toString():Math.round(e.range).toString(),oe("info-rate").textContent=t.minelayer?`${(1/e.fireRate).toFixed(1)} 秒`:`${e.fireRate.toFixed(1)} /秒`,oe("info-target").textContent=t.minelayer?Math.round(e.range).toString():t.targets.map(a=>a==="ground"?"地面":a==="air"?"空中":"水路").join("/"),oe("info-desc").textContent=t.desc;const i=oe("btn-upgrade"),r=this.upgradeCost(e);i.textContent=e.level>=As?"已满级":`升级 ${r}`,i.disabled=e.level>=As||this.gold<r,oe("btn-sell").textContent=`出售 +${Math.round(e.totalCost*Do)}`}syncUI(){oe("stat-level").textContent=String(this.level.id),oe("stat-gold").textContent=String(this.gold),oe("stat-lives").textContent=String(this.lives),oe("stat-wave").textContent=`${Math.max(0,this.waveIndex+1)} / ${this.level.waves.length}`;const e=this.level.waves[this.waveIndex],t=e?e.groups.reduce((o,c)=>o+c.count,0):0;let n=0;if(this.status==="wave"&&t>0){const o=this.enemies.length+this.schedule.length;n=(this.waveIndex+1-o/t)/this.level.waves.length}else this.status==="cleared"||this.status==="won"?n=(this.waveIndex+1)/this.level.waves.length:this.status==="lost"&&(n=this.waveIndex/this.level.waves.length);oe("wave-progress-bar").style.width=`${Math.max(0,Math.min(100,n*100))}%`;const i={ready:"待命",wave:"作战中",cleared:"整备",won:"胜利",lost:"失败"};oe("stage-hud").setAttribute("data-state",this.status),oe("hud-status").textContent=i[this.status];const r=oe("wave-info"),a=oe("btn-start");this.status==="wave"?(r.textContent=`第 ${this.waveIndex+1} 波进行中 · 剩余敌人 ${this.enemies.length+this.schedule.length}`,a.textContent="作战中",a.disabled=!0):this.status==="cleared"?(r.textContent=`本波清空 · ${Math.ceil(this.countdown)} 秒后自动开始下一波`,a.textContent="提前开始 +8",a.disabled=!1):this.status==="won"?(r.textContent="全部波次完成，防线守住了",a.disabled=!0):this.status==="lost"?(r.textContent="基地失守，作战失败",a.disabled=!0):(r.textContent="准备部署，点击「开始波次」",a.textContent="开始波次",a.disabled=!1),this.syncTowerList()}}const hg=document.getElementById("game");new cg(hg);
