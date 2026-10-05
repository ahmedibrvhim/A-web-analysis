import * as E from './engine.mjs';
// synthetic frontal face, px. centre x=500, IPD=100
const P=(x,y)=>({x,y}); const mesh=Array.from({length:478},()=>P(500,500));
const set=(i,x,y)=>mesh[i]=P(x,y);
// midline
set(10,500,250);set(9,500,400);set(168,500,430);set(6,500,445);set(197,500,520);set(195,500,505);set(5,500,545);set(4,500,560);set(1,500,570);set(2,500,590);
set(0,500,640);set(13,500,655);set(14,500,659);set(17,500,690);set(152,500,760);
// eyes/iris
set(468,450,440);set(473,550,440);set(33,410,440);set(133,485,442);set(263,590,440);set(362,515,442);
set(159,445,430);set(145,445,450);set(386,555,430);set(374,555,450);
// pairs (L,R) symmetric about x=500
const sym=(a,b,dx,y)=>{set(a,500-dx,y);set(b,500+dx,y)};
sym(105,334,55,395);sym(129,358,28,585);sym(61,291,45,662);sym(234,454,150,470);sym(172,397,115,680);
// fill other points near centre to make bbox ok
for(let i=0;i<468;i++){ if(mesh[i].x===500&&mesh[i].y===500) mesh[i]=P(500+((i%7)-3)*20,500+((i%11)-5)*20)}
set(10,500,250);set(152,500,760);
const W=1000,H=1000;
const auto=E.autoPointsFromMesh(mesh);
const hair=E.resolveHairline({y:262,contrast:.5,spread:.03},250,auto.N.y,760,510);
auto.Tr={x:500,y:hair.y};
const base={mesh,W,H,points:{...auto},autoPoints:{...auto},pose:{yaw:2,pitch:1,roll:0},hair,
 blendshapes:[{categoryName:'mouthSmileLeft',score:.02},{categoryName:'jawOpen',score:.01}],
 quality:{score:.95,warnings:[]}};
for(const g of ['male','female']){const r=E.generateReport({...base,gender:g});
 console.log(g,'idx',r.overall.index.toFixed(1),'±',r.overall.uncertainty.toFixed(1),r.overall.confidenceLabel,r.tier,'stm',r.stomion.confidence.toFixed(2));
 console.log(' thirds',Object.values(r.measurements.facialThirds).map(v=>+v.toFixed(2)),'split',r.measurements.lowerThird.split.toFixed(3),'fwhr',r.measurements.facialWidthHeight.fwhr.toFixed(2),'sym',r.measurements.symmetry.value.toFixed(3));
 console.log(' fwhr dev',r.deviations.fwhr.z.toFixed(2),r.deviations.fwhr.band);}
console.log('consistency',JSON.stringify(E.consistencyTest({...base,gender:'male'},{trials:40}),(k,v)=>typeof v==='number'?+v.toFixed(4):v));
// proxy hairline lowers confidence & hair should not dominate:
const hp=E.resolveHairline(null,250,auto.N.y,760,510);
const rp=E.generateReport({...base,hair:hp,gender:'male'}); const rg=E.generateReport({...base,gender:'male'});
console.log('proxy hair → idx',rp.overall.index.toFixed(1),'±',rp.overall.uncertainty.toFixed(1),rp.overall.confidenceLabel,'| scan →',rg.overall.index.toFixed(1),'±',rg.overall.uncertainty.toFixed(1));
// smile & open mouth
const rs=E.generateReport({...base,gender:'male',blendshapes:[{categoryName:'mouthSmileLeft',score:.7},{categoryName:'jawOpen',score:.25}]});
console.log('smile conf',rs.overall.confidence.toFixed(2),'vs',rg.overall.confidence.toFixed(2),'stm',rs.stomion.confidence.toFixed(2));
// manual correction authoritative
const pts={...base.points,Tr:{x:500,y:300}}; const rc=E.generateReport({...base,points:pts,gender:'male'});
console.log('corrected Tr source',rc.landmarks.points.Tr.source,'y',rc.landmarks.points.Tr.y,'upper%',rc.measurements.facialThirds.upper.toFixed(1));
// asymmetric detection failure
const m2=mesh.map(p=>({...p})); m2[291].y+=60; const ra=E.generateReport({...base,mesh:m2,gender:'male'});
console.log('mouth corner failure → sym',ra.measurements.symmetry.value.toFixed(3),'pairs',ra.measurements.symmetry.pairsUsed+'/'+ra.measurements.symmetry.pairsTotal);
const rr=E.generateReport({...base,gender:'male'});
console.log('perPair',rr.measurements.symmetry.perPair.map(v=>+v.toFixed(3)));
const G=rr.validation.geometry; console.log('midSlope',G.midSlope,'midX(400)',G.midX(400),'bz',G.bz,'ipd',G.ipd);
console.log([33,263,133,362,105,334,129,358,61,291,234,454,172,397].map(i=>i+':'+mesh[i].x+','+mesh[i].y).join(' '));
