(function(root){
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function similarity(a,b,metric='gower'){
 let x=Object.values(a.features),y=Object.values(b.features);
 if(metric==='pearson'){let mx=x.reduce((s,v)=>s+v,0)/x.length,my=y.reduce((s,v)=>s+v,0)/y.length;let num=0,dx=0,dy=0;x.forEach((v,i)=>{num+=(v-mx)*(y[i]-my);dx+=(v-mx)**2;dy+=(y[i]-my)**2});return dx*dy?num/Math.sqrt(dx*dy):0}
 if(metric==='materiali'){let split=s=>new Set(s.replace(/trapuntata|saffiano|intrecciata|traforata/g,'').split(/[+ ]+/).filter(Boolean));let A=split(a.material),B=split(b.material);return [...A].filter(z=>B.has(z)).length/new Set([...A,...B]).size}
 return 1-x.reduce((s,v,i)=>s+Math.abs(v-y[i])/4,0)/x.length;
}
function network(bags,metric='gower',threshold=.84,k=4){
 let candidates=[],by=Array.from({length:bags.length},()=>[]);for(let i=0;i<bags.length;i++)for(let j=i+1;j<bags.length;j++){let weight=similarity(bags[i],bags[j],metric);if(weight+1e-10>=threshold){let e={source:bags[i].id,target:bags[j].id,weight,i,j};candidates.push(e);by[i].push(e);by[j].push(e)}}
 let keep=new Set();by.forEach((es,i)=>es.sort((a,b)=>b.weight-a.weight||a.source.localeCompare(b.source)||a.target.localeCompare(b.target)).slice(0,k||Infinity).forEach(e=>keep.add(e)));return candidates.filter(e=>keep.has(e));
}
function exportsGraph(bags,edges,format='gexf',positions={},meta={}){
 const attrs=['brand','name','shape','material','dimensionStatus','category'];let desc=esc('FORME — rete di affinità; '+JSON.stringify(meta)+'; codifica editoriale, nessuna causalità implicata.');
 if(format==='gexf')return `<?xml version="1.0" encoding="UTF-8"?><gexf xmlns="http://www.gexf.net/1.2draft" xmlns:viz="http://www.gexf.net/1.2draft/viz" version="1.2"><meta><creator>FORME</creator><description>${desc}</description></meta><graph mode="static" defaultedgetype="undirected"><attributes class="node">${attrs.map(a=>`<attribute id="${a}" title="${a}" type="string"/>`).join('')}</attributes><nodes>${bags.map(b=>`<node id="${b.id}" label="${esc(b.brand+' · '+b.name)}"><attvalues>${attrs.map(a=>`<attvalue for="${a}" value="${esc(b[a])}"/>`).join('')}</attvalues>${positions[b.id]?`<viz:position x="${positions[b.id][0]}" y="${-positions[b.id][1]}" z="0"/>`:''}<viz:color r="${parseInt(b.color.slice(1,3),16)}" g="${parseInt(b.color.slice(3,5),16)}" b="${parseInt(b.color.slice(5,7),16)}"/></node>`).join('')}</nodes><edges>${edges.map((e,i)=>`<edge id="e${i}" source="${e.source}" target="${e.target}" weight="${e.weight.toFixed(6)}"/>`).join('')}</edges></graph></gexf>`;
 if(format==='graphml')return `<?xml version="1.0" encoding="UTF-8"?><graphml xmlns="http://graphml.graphdrawing.org/xmlns">${attrs.map(a=>`<key id="${a}" for="node" attr.name="${a}" attr.type="string"/>`).join('')}<key id="weight" for="edge" attr.name="weight" attr.type="double"/><graph id="FORME" edgedefault="undirected"><desc>${desc}</desc>${bags.map(b=>`<node id="${b.id}">${attrs.map(a=>`<data key="${a}">${esc(b[a])}</data>`).join('')}</node>`).join('')}${edges.map((e,i)=>`<edge id="e${i}" source="${e.source}" target="${e.target}"><data key="weight">${e.weight.toFixed(6)}</data></edge>`).join('')}</graph></graphml>`;
 return `<?xml version="1.0" encoding="UTF-8"?><gxl xmlns:xlink="http://www.w3.org/1999/xlink"><graph id="FORME" edgeids="true" edgemode="undirected"><attr name="description"><string>${desc}</string></attr>${bags.map(b=>`<node id="${b.id}">${attrs.map(a=>`<attr name="${a}"><string>${esc(b[a])}</string></attr>`).join('')}</node>`).join('')}${edges.map((e,i)=>`<edge id="e${i}" from="${e.source}" to="${e.target}"><attr name="weight"><float>${e.weight.toFixed(6)}</float></attr></edge>`).join('')}</graph></gxl>`;
}
root.BagAnalysis={similarity,network,exportsGraph};if(typeof module!=='undefined')module.exports=root.BagAnalysis;
})(typeof window==='undefined'?globalThis:window);
