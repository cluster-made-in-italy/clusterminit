/* Geometrie originali di studio. Coordinate in millimetri; nessun CAD del produttore è incluso. */
(function(root){
'use strict';
function components(p,scale=1,section=1){
 const [w,h,d]=p.dims.map(v=>v*scale),out=[],g=p.geometry,mm=p.materials[0],t=Math.min(w,d)*.055*section;
 const wood=p.materials.find(m=>['legno','frassino','faggio','rovere','ciliegio','cedro','hemlock','kauri','multistrato','MDF','bambu'].includes(m))||mm;
 const metal=p.materials.find(m=>['acciaio','alluminio','ferro','ottone','ghisa'].includes(m))||mm;
 const soft=p.materials.find(m=>['tessuto','pelle','cuoio','feltro','poliuretano'].includes(m))||mm;
 function add(kind,name,size,pos,mat=mm,rotation=[0,0,0],extra={}){out.push({kind,name,size,pos,mat,rotation,...extra,explode:[pos[0]*.7,(out.length%4-1.5)*h*.18,pos[2]*.65]});return out.at(-1)}
 function box(n,s,pos,mat=wood,rot){return add('box',n,s,pos,mat,rot)}
 function ell(n,s,pos,mat=soft){return add('ellipsoid',n,s,pos,mat)}
 function cyl(n,r,y,pos,mat=metal){return add('cylinder',n,[r*2,y,r*2],pos,mat)}
 function beam(n,a,b,r=t/2,mat=metal){let delta=b.map((v,i)=>v-a[i]),len=Math.hypot(...delta);return add('beam',n,[r*2,len,r*2],a.map((v,i)=>(v+b[i])/2),mat,[0,0,0],{a,b,r})}
 function path(n,pts,r=t/2,mat=metal){return add('tube',n,[r*2,r*2,r*2],[0,0,0],mat,[0,0,0],{points:pts,r})}
 function legs(y=h*.52,material=wood,n=4){
  const pts=n===3?[[-w*.34,-d*.3],[w*.34,-d*.3],[0,d*.33]]:[[-w*.36,-d*.36],[w*.36,-d*.36],[-w*.36,d*.36],[w*.36,d*.36]];
  pts.forEach(([x,z],i)=>beam('Supporto '+(i+1),[x,y,z],[x*1.13,t*.3,z*1.13],t*.5,material));
 }
 function table(round=false){let ph=g==='roundtable'?h:h*.96;if(round)add('cylinder','Piano circolare',[w,t,d],[0,ph,0],mm);else box('Piano',[w,t,d],[0,ph,0],mm);legs(ph-t/2,metal)}
 function chair(arms=false,thin=false){
  const sy=h*.53,st=thin?t*.6:t*1.6;legs(sy,wood,g==='tripod'?3:4);
  box('Sedile',[w*.92,st,d*.86],[0,sy,0],soft);
  beam('Traverso anteriore',[-w*.36,sy-t,-d*.36],[w*.36,sy-t,-d*.36],t*.45,wood);
  [-1,1].forEach(s=>beam('Montante posteriore '+s,[s*w*.36,sy,d*.36],[s*w*.37,h-t,d*.39],t*.42,wood));
  box('Schienale',[w*.88,h*.23,st],[0,h*.84,d*.38],wood,[-.08,0,0]);
  if(arms)[-1,1].forEach(s=>{beam('Bracciolo '+s,[s*w*.47,sy+h*.2,-d*.25],[s*w*.47,sy+h*.2,d*.3],t*.55,wood);beam('Sostegno bracciolo '+s,[s*w*.47,sy,-d*.25],[s*w*.47,sy+h*.2,-d*.25],t*.45,wood)})
  if(p.name==='699 Superleggera'||p.name==='Carimate')out.find(x=>x.name==='Sedile').mat=p.materials.find(x=>['canna','paglia'].includes(x))||mm;
  if(p.name.includes('Cab')){out.filter(x=>/Supporto|Schienale|Sedile/.test(x.name)).forEach(x=>x.mat='cuoio')}
 }
 function club(){let sy=h*.35;box('Telaio inferiore',[w*.85,t,d*.85],[0,h*.19,0],wood);ell('Cuscino sedile',[w*.7,h*.24,d*.76],[0,sy,0]);ell('Schienale',[w*.8,h*.61,d*.26],[0,h*.66,d*.32]);[-1,1].forEach(s=>ell('Bracciolo '+s,[w*.2,h*.48,d*.9],[s*w*.4,h*.43,0]));legs(h*.2,metal);if(['LC2','LC3'].includes(p.name)){out.splice(0,out.length);box('Cuscino sedile',[w*.65,h*.25,d*.84],[0,h*.39,0],soft);box('Cuscino schiena',[w*.65,h*.5,d*.2],[0,h*.75,d*.35],soft);[-1,1].forEach(s=>{box('Cuscino braccio '+s,[w*.17,h*.48,d*.85],[s*w*.43,h*.56,0],soft);path('Gabbia esterna '+s,[[s*w*.48,0,-d*.46],[s*w*.48,h*.72,-d*.46],[s*w*.48,h*.72,d*.44],[s*w*.48,0,d*.44]],t*.32,metal)});beam('Traverso posteriore',[-w*.48,h*.7,d*.44],[w*.48,h*.7,d*.44],t*.32,metal)}}
 function shell(){legs(h*.4,metal,g==='shell'?4:3);ell('Seduta',[w*.9,h*.2,d*.9],[0,h*.45,0]);ell('Guscio schienale',[w,h*.57,d*.28],[0,h*.71,d*.3]);[-1,1].forEach(s=>ell('Ala laterale '+s,[w*.18,h*.4,d*.66],[s*w*.41,h*.56,d*.02]));if(p.name==='Papilio'||p.name==='Take a Line for a Walk'||p.name==='Ruff'){out.filter(x=>x.name.includes('Ala')).forEach(x=>{x.size[1]=h*.75;x.pos[1]=h*.67})}}
 function sofa(modular=false){const n=modular?3:2,sw=w/n;box('Piattaforma',[w,t,d*.9],[0,h*.24,0],wood);for(let i=0;i<n;i++){let x=-w/2+sw*(i+.5);ell('Seduta modulo '+(i+1),[sw*.95,h*.32,d*.86],[x,h*.46,-d*.06]);ell('Schienale modulo '+(i+1),[sw*.95,h*.49,d*.28],[x,h*.74,d*.34]);if(modular){for(let j=0;j<3;j++)beam('Cucitura modulo '+(i+1)+'-'+j,[x-sw*.36+j*sw*.36,h*.63,-d*.38],[x-sw*.36+j*sw*.36,h*.63,d*.22],1.5,'tessuto')}}if(!modular)[-1,1].forEach(s=>ell('Bracciolo '+s,[w*.1,h*.55,d*.94],[s*w*.45,h*.55,0]));legs(h*.23,metal);if(p.name==='Groundpiece'||p.name==='Pianura')box('Vassoio laterale',[w*.16,t,d*.6],[w*.42,h*.59,0],wood)}
 function shelving(irregular=false){box('Fianco sinistro',[t,h,d],[-w/2+t/2,h/2,0]);box('Fianco destro',[t,h,d],[w/2-t/2,h/2,0]);for(let i=0;i<6;i++)box('Ripiano '+(i+1),[w,t,d],[0,t/2+(h-t)*i/5,0]);for(let j=1;j<4;j++){if(irregular){for(let i=0;i<5;i++)box('Divisorio '+j+'-'+i,[t,h/5,d],[-w/2+w*(j+(i%2)*.25)/4,h*(i+.5)/5,0])}else box('Divisorio '+j,[t,h,d],[-w/2+w*j/4,h/2,0])}}
 switch(g){
 case 'chair':case 'tripod':chair(p.type==='Poltrona',p.name.includes('Superleggera')||p.name==='Frida');break;
 case 'club':club();break;
 case 'shell':shell();break;
 case 'sofa':sofa();break;
 case 'camaleonda':sofa(true);break;
 case 'bambole':sofa(p.type==='Divano');break;
 case 'stool':{legs(h*.87,metal,3);add('cylinder','Sedile',[w,t*2,d],[0,h-t,0],soft);break}
 case 'ribbon':{add('cylinder','Sedile',[w,t*.7,d],[0,h-t/2,0],metal);for(let i=0;i<4;i++){let a=i*Math.PI/2;path('Nastro piegato '+i,[[Math.cos(a)*w*.26,h-t,Math.sin(a)*d*.26],[Math.cos(a+.6)*w*.3,h*.55,Math.sin(a+.6)*d*.3],[Math.cos(a+1.2)*w*.4,0,Math.sin(a+1.2)*d*.4]],t*.4,metal)}break}
 case 'table':case 'roundtable':table(g==='roundtable');break;
 case 'trestle':{box('Piano trasparente',[w,t*.5,d],[0,h-t,0],'vetro');[-1,1].forEach(s=>{for(let z of [-d*.35,d*.35])beam('Cavalletto '+s+' '+z,[s*w*.3,0,z],[s*w*.12,h*.9,0],t*.6,wood);beam('Tirante '+s,[s*w*.3,h*.3,-d*.35],[s*w*.3,h*.3,d*.35],t*.4,wood)});beam('Trave centrale',[-w*.3,h*.82,0],[w*.3,h*.82,0],t*.6,wood);break}
 case 'airtable':box('Piano',[w,t,d],[0,h-t/2,0],mm);[-1,1].forEach(s=>box('Lastra sostegno '+s,[t*.35,h-t,d*.8],[s*w*.3,(h-t)/2,0],'vetro'));break;
 case 'tobi':box('Piano ovale',[w,t*2,d],[0,h-t,0],mm);[-1,1].forEach((s,i)=>box('Pietra base '+i,[w*.22,h-t*2,d*.62],[s*w*.26,(h-t*2)/2,0],mm,[0,i*Math.PI/2,0]));break;
 case 'skorpio':box('Piano',[w,t,d],[0,h-t/2,0],mm);for(let s of [-1,1])for(let z of [-1,1])beam('Diagonale '+s+'-'+z,[s*w*.33,0,z*d*.32],[-s*w*.2,h-t,-z*d*.18],t*.65,metal);break;
 case 'clay':add('cone','Base conica',[w*.42,h*.56,d*.6],[0,h*.28,0],mm,[0,0,0],{top:.08});add('cone','Sostegno rovesciato',[w*.35,h*.4,d*.55],[0,h*.74,0],mm,[Math.PI,0,0],{top:.08});add('cylinder','Piano',[w,t,d],[0,h-t/2,0],mm);break;
 case 'element':box('Base',[w*.52,t,d*.54],[0,t/2,0],metal);box('Diagonale',[w*.1,h*.8,t*2],[0,h*.45,0],metal,[0,0,-.5]);box('Piano',[w,t,d],[0,h-t/2,0],mm);break;
 case 'vidun':add('cone','Base a tre appoggi',[w*.48,h*.65,d*.48],[0,h*.325,0],wood,[0,0,0],{top:.28});cyl('Vite centrale',w*.055,h*.55,[0,h*.64,0],wood);for(let i=0;i<10;i++)cyl('Filetto '+i,w*.07,t*.4,[0,h*.45+i*h*.035,0],wood);add('cylinder','Piano in vetro',[w,t*.4,d],[0,h-t/2,0],'vetro');break;
 case 'glassbend':box('Piano in vetro',[w,t*.35,d],[0,h-t/2,0],'vetro');[-1,1].forEach(s=>box('Fianco curvato '+s,[t*.4,h-t,d],[s*(w/2-t),(h-t)/2,0],'vetro'));break;
 case 'shelf':case 'random':shelving(g==='random');break;
 case 'cabinet':{box('Scocca',[w,h*.85,d],[0,h*.54,0],wood);for(let i=0;i<3;i++)box('Frontale '+(i+1),[w/3-t,t*1.1,h*.79],[-w/3+i*w/3,h*.54,-d/2-t/2],mm,[Math.PI/2,0,0]);legs(h*.14,metal);break}
 case 'graduate':{box('Ripiano portante',[w,t*2,d],[0,h-t,0],metal);for(let i=0;i<5;i++)box('Ripiano sospeso '+i,[w,t,d],[0,h*.13+i*h*.16,0],wood);[-1,1].forEach(s=>{for(let z of [-d*.4,d*.4])beam('Tirante '+s+' '+z,[s*w*.37,h*.1,z],[s*w*.37,h-t,z],3,metal)});break}
 case 'joy':cyl('Perno',t*.55,h,[0,h/2,0],metal);for(let i=0;i<6;i++)box('Vano orientabile '+i,[w*.62,t*1.4,d],[Math.sin(i*.7)*w*.14,h*(i+.5)/6,0],wood,[0,i*.38,0]);break;
 case 'componibili':for(let i=0;i<3;i++){add('cylinder','Corpo modulo '+(i+1),[w,h/3,d],[0,h*(i+.5)/3,0],'ABS');box('Anta scorrevole '+(i+1),[w*.72,h*.22,t*.4],[0,h*(i+.5)/3,-d*.49],'ABS');cyl('Presa circolare '+(i+1),w*.035,t,[0,h*(i+.5)/3,-d*.515],'ABS').rotation=[Math.PI/2,0,0]}break;
 case 'bookworm':{let pts=[];for(let i=0;i<33;i++){let u=i/32,a=u*Math.PI*2.5;pts.push([Math.cos(a)*w*(.44-u*.2),h*.5+Math.sin(a)*h*(.45-u*.24),0])}path('Nastro flessibile',pts,t,mm);for(let i=0;i<10;i++){let a=i/9*Math.PI*2.5,u=i/9;box('Fermalibro '+i,[t,h*.08,d],[Math.cos(a)*w*(.44-u*.2),h*.5+Math.sin(a)*h*(.45-u*.24),0],mm)}break}
 case 'cloud':{for(let i=0;i<3;i++)for(let j=0;j<4;j++){let x=(j-1.5)*w/4,y=(i+.5)*h/3;for(let k=0;k<6;k++){let a=k*Math.PI/3,b=(k+1)*Math.PI/3;beam('Cella '+i+'-'+j+' lato '+k,[x+Math.cos(a)*w/8,y+Math.sin(a)*h/6,0],[x+Math.cos(b)*w/8,y+Math.sin(b)*h/6,0],t*.55,mm)}}break}
 case 'carlton':{box('Zoccolo',[w*.75,h*.1,d],[0,h*.05,0],wood);for(let i=0;i<4;i++)box('Ripiano '+i,[w*(.8-i*.12),t,d],[0,h*(.2+i*.22),0],wood);for(let i=0;i<6;i++)box('Piano inclinato '+i,[t,h*.36,d],[(i%2?1:-1)*w*(.18+(i%3)*.1),h*(.25+Math.floor(i/2)*.24),0],wood,[0,0,(i%2?1:-1)*.55]);break}
 case 'bed':box('Giroletto',[w,t*3,d],[0,h*.35,0],wood);box('Materasso',[w*.96,h*.27,d*.9],[0,h*.51,-d*.02],'tessuto');box('Testiera',[w,h*.65,t*3],[0,h*.67,d*.46],soft);legs(h*.3,metal);break;
 case 'kitchen':for(let i=0;i<5;i++){let cw=w/5,x=-w/2+cw*(i+.5);box('Cassa modulo '+i,[cw-t,h*.43,d*.6],[x,h*.22,0],wood);box('Anta '+i,[cw-t,h*.4,t],[x,h*.22,-d*.31],mm);if(i!==2)box('Pensile '+i,[cw-t,h*.3,d*.35],[x,h*.82,d*.13],wood)}box('Piano di lavoro',[w,t,d*.68],[0,h*.45,0],mm);box('Vano lavello',[w*.16,t*.8,d*.38],[-w*.2,h*.46,0],'acciaio');break;
 case 'desk':table();box('Cassettiera',[w*.25,h*.65,d*.72],[w*.33,h*.46,0],wood);break;
 case 'mirror':box('Superficie specchiante',[w,t*.25,h],[0,h/2,0],'vetro',[Math.PI/2,0,0]);break;
 case 'screen':for(let i=0;i<3;i++)box('Pannello '+i,[w/3,t*.35,h],[w*(i-1)/3,h/2,0],'vetro',[Math.PI/2,0,(i-1)*.22]);break;
 case 'bench':box('Piano seduta',[w,t*2,d],[0,h-t,0],mm);[-1,1].forEach(s=>box('Sostegno '+s,[t,h-t,d*.8],[s*w*.37,(h-t)/2,0],mm));break;
 case 'molletta':box('Braccio superiore',[w,t*3,d*.78],[0,h*.72,0],wood,[0,0,.08]);box('Braccio inferiore',[w,t*3,d*.78],[0,h*.31,0],wood,[0,0,-.08]);add('cylinder','Molla',[h*.42,d*.82,h*.42],[0,h*.51,0],metal,[Math.PI/2,0,0]);break;
 case 'zigzag':{box('Base',[w,t,d*.8],[0,t/2,0],wood);beam('Diagonale',[0,t,-d*.35],[0,h*.52,d*.32],w*.065,wood);box('Piano diagonale',[w*.9,h*.61,t],[0,h*.26,0],wood,[-.75,0,0]);box('Sedile',[w,t,d*.83],[0,h*.52,0],wood);box('Schienale',[w,h*.45,t],[0,h*.78,d*.39],wood);break}
 case 'redblue':{let sy=h*.42;for(let s of [-1,1]){beam('Montante '+s,[s*w*.35,0,d*.17],[s*w*.35,h*.65,d*.17],t*.5,wood);beam('Listello sedile '+s,[s*w*.35,sy,-d*.47],[s*w*.35,sy,d*.45],t*.5,wood);beam('Bracciolo '+s,[s*w*.5,h*.62,-d*.44],[s*w*.5,h*.62,d*.35],t*.5,wood)}box('Piano sedile',[w*.8,t,d*.78],[0,sy,-d*.06],wood,[-.14,0,0]);box('Piano schienale',[w*.64,h*.6,t],[0,h*.7,d*.26],wood,[-.24,0,0]);beam('Traverso',[-w*.5,sy*.6,0],[w*.5,sy*.6,0],t*.5,wood);break}
 case 'sling':case 'wirechair':{chair(p.type==='Poltrona');out.filter(x=>x.kind==='beam').forEach(x=>x.mat=metal);if(g==='wirechair'){let sy=h*.53;out.splice(out.findIndex(x=>x.name==='Sedile'),1);for(let i=0;i<11;i++){let x=(i/10-.5)*w*.88;path('Filo '+i,[[x,sy,-d*.4],[x,sy,d*.36],[x,h*.9,d*.39]],t*.1,metal)}}break}
 case 'chairone':{chair();out.splice(out.findIndex(x=>x.name==='Schienale'),1);for(let i=0;i<5;i++)for(let j=0;j<3;j++){let x=(i/4-.5)*w*.84,y=h*.62+j*h*.12;beam('Reticolo '+i+' '+j,[x,y,d*.34],[x+w*.14,y+h*.14,d*.39],t*.16,metal)}break}
 case 'ghost':chair(p.type==='Poltrona');out.forEach(x=>x.mat=mm);out.splice(out.findIndex(x=>x.name==='Schienale'),1);ell('Schienale ovale',[w*.76,h*.4,t],[0,h*.8,d*.38],mm);break;
 case 'ghostglass':{out.length=0;box('Lastra sedile',[w*.95,t*.35,d*.66],[0,h*.42,0],'vetro');box('Lastra schienale',[w*.85,h*.53,t*.35],[0,h*.73,d*.31],'vetro',[-.14,0,0]);[-1,1].forEach(s=>path('Curva laterale '+s,[[s*w*.42,0,-d*.32],[s*w*.42,h*.52,-d*.32],[s*w*.42,h*.62,d*.26],[s*w*.42,0,d*.4]],t*.35,'vetro'));break}
 case 'chaise':{let pts=[[0,h*.22,-d*.48],[0,h*.42,-d*.25],[0,h*.32,0],[0,h*.56,d*.24],[0,h*.9,d*.44]];for(let s of [-1,1])path('Longherone curvo '+s,pts.map(a=>[s*w*.4,a[1],a[2]]),t*.45,metal);for(let i=0;i<17;i++){let u=i/16,idx=Math.min(3,Math.floor(u*4)),v=u*4-idx,a=pts[idx],b=pts[idx+1];beam('Listello '+i,[-w*.43,a[1]*(1-v)+b[1]*v,a[2]*(1-v)+b[2]*v],[w*.43,a[1]*(1-v)+b[1]*v,a[2]*(1-v)+b[2]*v],t*.7,mm)}legs(h*.28,metal);break}
 case 'threepieces':{legs(h*.35,metal);ell('Appoggio bacino',[w*.8,h*.18,d*.7],[0,h*.43,-d*.12]);ell('Appoggio lombare',[w*.92,h*.28,d*.17],[0,h*.7,d*.23]);ell('Appoggio testa',[w*.72,h*.21,d*.17],[0,h*.91,d*.31]);[-1,1].forEach(s=>path('Telaio laterale '+s,[[s*w*.35,0,-d*.32],[s*w*.35,h*.58,-d*.32],[s*w*.35,h*.61,d*.3],[s*w*.35,0,d*.4]],t*.4,metal));break}
 case 'utrecht':box('Sedile',[w*.69,h*.2,d*.73],[0,h*.35,0],soft,[-.1,0,0]);box('Schienale',[w*.65,h*.7,d*.18],[0,h*.62,d*.26],soft,[-.23,0,0]);[-1,1].forEach(s=>box('Bracciolo-piede '+s,[w*.17,h*.74,d*.77],[s*w*.41,h*.37,0],soft));break;
 case 'soriana':ell('Volume imbottito',[w,h*.83,d],[0,h*.51,0]);ell('Cuscino',[w*.86,h*.21,d*.74],[0,h*.42,-d*.14]);path('Pinza metallica',[[-w*.47,h*.58,d*.35],[-w*.47,h*.26,-d*.38],[0,h*.23,-d*.45],[w*.47,h*.26,-d*.38],[w*.47,h*.58,d*.35]],t*.25,metal);break;
 case 'up':ell('Seduta',[w,h*.47,d],[0,h*.35,0]);ell('Schienale',[w*.83,h*.59,d*.5],[0,h*.7,d*.2]);[-1,1].forEach(s=>ell('Bracciolo '+s,[w*.3,h*.45,d*.64],[s*w*.35,h*.54,-d*.12]));ell('Pouf sferico',[w*.45,w*.45,w*.45],[w*.68,w*.225,-d*.5]);path('Cordone',[[w*.43,h*.2,0],[w*.56,t,-d*.22],[w*.68,w*.225,-d*.5]],4,'tessuto');break;
 case 'sacco':ell('Involucro con granuli',[w,h,d],[0,h*.45,0]);ell('Invito seduta',[w*.73,h*.23,d*.71],[0,h*.55,-d*.13]);break;
 case 'mezzadro':box('Pattino ligneo',[w*.75,t,d*.19],[0,t/2,d*.25],wood);path('Balestra',[[0,t,d*.25],[0,h*.15,d*.17],[0,h*.6,-d*.2],[0,h*.88,0]],t*.38,'acciaio');ell('Sedile trattore',[w,h*.17,d],[0,h*.94,0],'acciaio');break;
 case 'sella':ell('Base emisferica',[w,h*.14,d],[0,h*.07,0],'ghisa');cyl('Asta',t*.35,h*.79,[0,h*.49,0],'acciaio');ell('Sella',[w*.56,h*.14,d*.67],[0,h*.94,0],'cuoio');break;
 case 'shanghai':for(let i=0;i<8;i++){let a=i*Math.PI/4;beam('Asta '+(i+1),[Math.cos(a)*w*.43,0,Math.sin(a)*d*.43],[-Math.cos(a)*w*.34,h,-Math.sin(a)*d*.34],t*.6,wood)}break;
 case 'allunaggio':ell('Sedile',[w*.28,h*.1,d*.28],[0,h*.91,0],'alluminio');for(let i=0;i<3;i++){let a=i*Math.PI*2/3;beam('Gamba '+i,[0,h*.87,0],[Math.cos(a)*w*.45,0,Math.sin(a)*d*.45],t*.25,'acciaio')}break;
 case 'spun':add('lathe','Corpo di rivoluzione',[w,h,d],[0,0,0],mm,[0,0,0],{profile:[[0,0],[.18,.05],[.27,.2],[.15,.45],[.45,.9],[.5,1],[.38,.9],[.12,.55],[0,.5]]});break;
 case 'roly':ell('Bacino',[w,h*.46,d],[0,h*.61,0]);for(let x of [-1,1])for(let z of [-1,1])cyl('Gamba '+x+' '+z,w*.11,h*.49,[x*w*.32,h*.245,z*d*.29],mm);break;
 case 'nemo':ell('Guscio volto',[w,h,d],[0,h/2,0],mm);ell('Sedile interno',[w*.72,h*.13,d*.7],[0,h*.35,-d*.27],mm);ell('Naso',[w*.12,h*.22,d*.22],[0,h*.6,-d*.46],mm);break;
 case 'puppy':ell('Corpo',[w*.67,h*.51,d*.6],[0,h*.44,0],mm);ell('Testa',[w*.36,h*.5,d*.51],[w*.26,h*.73,0],mm);for(let x of [-1,1])for(let z of [-1,1])cyl('Zampa '+x+' '+z,w*.06,h*.3,[x*w*.24,h*.15,z*d*.24],mm);break;
 case 'bocca':ell('Labbro inferiore',[w,h*.45,d],[0,h*.29,0]);ell('Labbro superiore sinistro',[w*.58,h*.59,d*.53],[-w*.21,h*.65,d*.17]);ell('Labbro superiore destro',[w*.58,h*.59,d*.53],[w*.21,h*.65,d*.17]);break;
 case 'pratone':box('Base',[w,t*3,d],[0,t*1.5,0],mm);for(let i=0;i<7;i++)for(let j=0;j<6;j++){let x=(i/6-.5)*w*.9,z=(j/5-.5)*d*.9;path('Stelo '+i+'-'+j,[[x,t*3,z],[x,h*.45,z],[x+w*.025*Math.sin(i+j),h*(.8+.2*Math.cos(i*j)),z+d*.025*Math.cos(i-j)]],Math.min(w/7,d/6)*.22,mm)}break;
 case 'cactus':cyl('Tronco',w*.13,h,[0,h/2,0],mm);for(let s of [-1,1])path('Ramo '+s,[[0,h*.43,0],[s*w*.34,h*.43,0],[s*w*.37,h*.62,0],[s*w*.37,h*(s>0?.79:.91),0]],w*.11,mm);break;
 case 'capitello':cyl('Fusto',w*.29,h*.66,[0,h*.33,0],mm);box('Abaco',[w,h*.16,d],[0,h*.9,0],mm);for(let s of [-1,1])ell('Voluta '+s,[w*.3,h*.31,d*.85],[s*w*.34,h*.72,0],mm);break;
 case 'first':{legs(h*.51,'acciaio');add('cylinder','Sedile disco',[w,t*1.5,d*.82],[0,h*.52,0],wood);beam('Stelo schiena',[0,h*.51,d*.28],[0,h*.85,d*.28],t*.3,'acciaio');add('cylinder','Disco schienale',[w*.61,t,h*.34],[0,h*.81,d*.28],wood,[Math.PI/2,0,0]);for(let s of [-1,1])ell('Sfera '+s,[t*2,t*2,t*2],[s*w*.38,h*.85,d*.28],wood);break}
 case 'ring':box('Piattaforma imbottita',[w,h*.27,d],[0,h*.135,0],soft);for(let x of [-1,1])for(let z of [-1,1])cyl('Montante '+x+' '+z,t,h,[x*w*.46,h/2,z*d*.46],wood);for(let i=0;i<3;i++)for(let s of [-1,1]){beam('Corda laterale '+i+s,[s*w*.46,h*(.38+i*.21),-d*.46],[s*w*.46,h*(.38+i*.21),d*.46],t*.16,'corda');beam('Corda frontale '+i+s,[-w*.46,h*(.38+i*.21),s*d*.46],[w*.46,h*(.38+i*.21),s*d*.46],t*.16,'corda')}break;
 case 'flower':shell();for(let i=0;i<5;i++){let a=i*Math.PI*2/5;ell('Petalo '+i,[w*.43,h*.55,d*.26],[Math.cos(a)*w*.32,h*.64+Math.sin(a)*h*.2,d*.3]);}break;
 case 'boa':{let pts=[];for(let i=0;i<65;i++){let u=i/64,a=u*Math.PI*10;pts.push([(u-.5)*w*.75,h*.4+Math.sin(a)*h*.24,Math.cos(a)*d*.35])}path('Tubo imbottito intrecciato',pts,Math.min(h*.16,d*.13),soft);break}
 case 'rocks':for(let i=0;i<4;i++){let x=(i%2-.5)*w*.48,z=(Math.floor(i/2)-.5)*d*.46;box('Isola poligonale '+i,[w*.46,h*.45,d*.43],[x,h*.225,z],soft,[0,i*.12,0]);}ell('Schienale mobile',[w*.57,h*.57,d*.19],[0,h*.66,d*.38]);break;
 default:chair();
 }
 return out.map((part,i)=>({...part,id:i+1,join:part.kind==='beam'?'Nodo di studio: connessione meccanica o incastro da verificare':part.mat==='vetro'?'Appoggio e fissaggio della lastra da verificare':/Cuscino|Seduta|Schienale|Volume/.test(part.name)?'Appoggio, imbottitura e cuciture da sviluppare':'Connessione e tolleranze da verificare',confidence:'Ricostruzione di studio'}));
}
function mesh(part,THREE){
 let geo;
 if(part.kind==='ellipsoid')geo=new THREE.SphereGeometry(.5,12,8);
 else if(part.kind==='cylinder'||part.kind==='beam')geo=new THREE.CylinderGeometry(.5,.5,1,12);
 else if(part.kind==='cone')geo=new THREE.CylinderGeometry((part.top||.1)*.5,.5,1,20);
 else if(part.kind==='tube')geo=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(part.points.map(a=>new THREE.Vector3(...a))),Math.min(64,part.points.length*4),part.r,6,false);
 else if(part.kind==='lathe')geo=new THREE.LatheGeometry(part.profile.map(([r,y])=>new THREE.Vector2(r*part.size[0],y*part.size[1])),24);
 else geo=new THREE.BoxGeometry(1,1,1);
 const obj=new THREE.Mesh(geo);
 if(!['tube','lathe'].includes(part.kind)){obj.scale.set(...part.size);obj.position.set(...part.pos);obj.rotation.set(...part.rotation)}
 if(part.kind==='beam'){let a=new THREE.Vector3(...part.a),b=new THREE.Vector3(...part.b);obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize())}
 obj.updateMatrixWorld();return obj;
}
root.AtlasGeometry={components,mesh};
})(typeof window==='undefined'?globalThis:window);
