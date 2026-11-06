/* Supply Chain Control Tower. All KPI values derive from the embedded demo data.
   Status updates persist in localStorage. No production system is connected. */
const exceptionsSeed = [
{id:"SC-1001",title:"Inventory below safety stock",sku:"SKU-A104",partner:"Apex Components",location:"Dubai DC",due_date:"2026-10-25",category:"Inventory",units_affected:420,severity:"Critical",status:"Open",delay_days:2,recommended_action:"Expedite replenishment and reserve remaining stock"},
{id:"SC-1002",title:"Port congestion delay",sku:"SKU-B211",partner:"Harborline Logistics",location:"Jebel Ali",due_date:"2026-10-26",category:"Shipment",units_affected:18,severity:"Critical",status:"Open",delay_days:3,recommended_action:"Confirm revised ETA and assess alternate lane"},
{id:"SC-1003",title:"Supplier short shipment",sku:"SKU-C037",partner:"Nova Industrial",location:"Abu Dhabi DC",due_date:"2026-10-25",category:"Supplier",units_affected:9,severity:"High",status:"In review",delay_days:1,recommended_action:"Allocate confirmed stock to priority orders"},
{id:"SC-1004",title:"Temperature excursion",sku:"SKU-D082",partner:"Polar Freight",location:"Dubai DC",due_date:"2026-10-25",category:"Shipment",units_affected:6,severity:"Critical",status:"Open",delay_days:2,recommended_action:"Place shipment on quality hold and request sensor log"},
{id:"SC-1005",title:"Purchase order mismatch",sku:"SKU-E054",partner:"Cedar Packaging",location:"Sharjah DC",due_date:"2026-10-27",category:"Supplier",units_affected:2,severity:"Medium",status:"Open",delay_days:1,recommended_action:"Reconcile ASN and purchase order quantities"},
{id:"SC-1006",title:"Late carrier handoff",sku:"SKU-F019",partner:"MetroLink Freight",location:"Dubai DC",due_date:"2026-10-26",category:"Shipment",units_affected:11,severity:"High",status:"Open",delay_days:2,recommended_action:"Escalate to carrier control desk"},
{id:"SC-1007",title:"Reorder threshold approaching",sku:"SKU-G510",partner:"Orion Retail Supply",location:"Abu Dhabi DC",due_date:"2026-10-28",category:"Inventory",units_affected:75,severity:"Low",status:"Resolved",delay_days:0,recommended_action:"Review reorder point during weekly planning"},
{id:"SC-1008",title:"Supplier confirmation overdue",sku:"SKU-H101",partner:"Vertex Trade",location:"Sharjah DC",due_date:"2026-10-27",category:"Supplier",units_affected:4,severity:"Medium",status:"Open",delay_days:1,recommended_action:"Request order acknowledgement and recovery date"},
{id:"SC-1009",title:"Inbound delivery rescheduled",sku:"SKU-J208",partner:"Harborline Logistics",location:"Jebel Ali",due_date:"2026-10-29",category:"Shipment",units_affected:24,severity:"Medium",status:"In review",delay_days:1,recommended_action:"Update receiving capacity and notify planner"},
{id:"SC-1010",title:"Cycle count discrepancy",sku:"SKU-K700",partner:"Apex Components",location:"Dubai DC",due_date:"2026-10-25",category:"Inventory",units_affected:32,severity:"High",status:"Open",delay_days:2,recommended_action:"Freeze affected bin and reconcile system quantity"},
{id:"SC-1011",title:"Carrier scan missing",sku:"SKU-L023",partner:"MetroLink Freight",location:"Abu Dhabi DC",due_date:"2026-10-26",category:"Shipment",units_affected:7,severity:"Low",status:"Open",delay_days:0,recommended_action:"Request proof of pickup and refresh tracking"},
{id:"SC-1012",title:"Supplier quality document missing",sku:"SKU-M640",partner:"Nova Industrial",location:"Sharjah DC",due_date:"2026-10-28",category:"Supplier",units_affected:3,severity:"High",status:"Open",delay_days:1,recommended_action:"Hold receipt until quality documentation is approved"}
];
const shipments = [
{shipment_id:"SH-501",partner:"Apex Components",planned_arrival:"2026-10-20",actual_arrival:"2026-10-20",status:"Delivered",units:120},
{shipment_id:"SH-502",partner:"Harborline Logistics",planned_arrival:"2026-10-20",actual_arrival:"2026-10-22",status:"Delivered",units:90},
{shipment_id:"SH-503",partner:"Nova Industrial",planned_arrival:"2026-10-21",actual_arrival:"2026-10-21",status:"Delivered",units:75},
{shipment_id:"SH-504",partner:"Polar Freight",planned_arrival:"2026-10-21",actual_arrival:"",status:"In transit",units:60},
{shipment_id:"SH-505",partner:"Cedar Packaging",planned_arrival:"2026-10-22",actual_arrival:"2026-10-22",status:"Delivered",units:85},
{shipment_id:"SH-506",partner:"MetroLink Freight",planned_arrival:"2026-10-22",actual_arrival:"2026-10-24",status:"Delivered",units:45},
{shipment_id:"SH-507",partner:"Orion Retail Supply",planned_arrival:"2026-10-23",actual_arrival:"2026-10-23",status:"Delivered",units:110},
{shipment_id:"SH-508",partner:"Vertex Trade",planned_arrival:"2026-10-23",actual_arrival:"",status:"In transit",units:50},
{shipment_id:"SH-509",partner:"Harborline Logistics",planned_arrival:"2026-10-24",actual_arrival:"",status:"In transit",units:95},
{shipment_id:"SH-510",partner:"Apex Components",planned_arrival:"2026-10-24",actual_arrival:"2026-10-24",status:"Delivered",units:130}
];
const STORAGE_KEY="northstar-control-tower-exceptions-v1";
const $=id=>document.getElementById(id);
let exceptions=loadState(), selectedId=null;
function loadState(){try{const saved=localStorage.getItem(STORAGE_KEY);if(saved){const parsed=JSON.parse(saved);if(Array.isArray(parsed)&&parsed.length===exceptionsSeed.length)return parsed;}}catch(e){}return structuredClone(exceptionsSeed);}
function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(exceptions));}catch(e){console.warn("Could not persist state",e);}}
function openItems(){return exceptions.filter(e=>e.status!=="Resolved");}
function severityRank(s){return ({Critical:4,High:3,Medium:2,Low:1})[s]||0;}
function esc(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function formatDate(value){return new Date(value+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short"});}
function calculateKpis(){
 const open=openItems(), delivered=shipments.filter(s=>s.status==="Delivered");
 const onTime=delivered.filter(s=>s.actual_arrival && s.actual_arrival<=s.planned_arrival).length;
 $("k-open").textContent=open.length;
 $("k-critical").textContent=open.filter(e=>e.severity==="Critical").length;
 $("k-otd").textContent=delivered.length?`${(onTime/delivered.length*100).toFixed(1)}%`:"—";
 $("k-units").textContent=open.reduce((sum,e)=>sum+Number(e.units_affected||0),0).toLocaleString();
 $("nav-open").textContent=open.length;
}
function renderMix(){
 const open=openItems(), categories=["Inventory","Supplier","Shipment"], colors={Inventory:"inv",Supplier:"sup",Shipment:"ship"};
 const counts=Object.fromEntries(categories.map(c=>[c,open.filter(e=>e.category===c).length]));
 const max=Math.max(1,...Object.values(counts));
 $("mix-chart").innerHTML=categories.map(c=>`<div class="bar-col"><b>${counts[c]}</b><div class="bar ${colors[c]}" style="height:${Math.max(4,counts[c]/max*100)}%"></div><span class="bar-label">${c}</span></div>`).join("");
}
function renderPriority(){
 const sorted=openItems().sort((a,b)=>severityRank(b.severity)-severityRank(a.severity)||Number(b.units_affected)-Number(a.units_affected)).slice(0,4);
 $("priority-total").textContent=sorted.length;
 $("priority-list").innerHTML=sorted.map(e=>`<div class="priority-item"><i class="priority-strip ${e.severity.toLowerCase()}"></i><div><b>${esc(e.title)}</b><p>${esc(e.partner)} · ${esc(e.recommended_action)}</p></div><time>${formatDate(e.due_date)}</time></div>`).join("")||"<p class='sub'>No open exceptions. Great work!</p>";
}
function matches(e){
 const q=$("search").value.trim().toLowerCase();
 return ($("severity").value==="All"||e.severity===$("severity").value)&&
 ($("status").value==="All"||e.status===$("status").value)&&
 ($("category").value==="All"||e.category===$("category").value)&&
 (!q||[e.id,e.title,e.sku,e.partner,e.location,e.category].some(v=>String(v).toLowerCase().includes(q)));
}
function renderTable(){
 const rows=exceptions.filter(matches);
 $("rows").innerHTML=rows.map(e=>`<tr><td><span class="ex-title">${esc(e.title)}</span><span class="ex-sub">${esc(e.id)} · ${esc(e.sku)}</span></td><td>${esc(e.partner)}<span class="ex-sub">${esc(e.location)}</span></td><td>${formatDate(e.due_date)}</td><td>${Number(e.units_affected).toLocaleString()} units<span class="ex-sub">${Number(e.delay_days)} delay day(s)</span></td><td><span class="tag sev-${esc(e.severity)}">${esc(e.severity)}</span></td><td><span class="tag status-${esc(e.status.replace(" ","-"))}">${esc(e.status)}</span></td><td><button class="small-btn" data-detail="${esc(e.id)}">Details ↗</button></td></tr>`).join("");
 $("result-count").textContent=`Showing ${rows.length} of ${exceptions.length} exceptions`;
 document.querySelectorAll("[data-detail]").forEach(btn=>btn.addEventListener("click",()=>showDetail(btn.dataset.detail)));
}
function renderDelivery(){
 const delivered=shipments.filter(s=>s.status==="Delivered"), onTime=delivered.filter(s=>s.actual_arrival<=s.planned_arrival).length;
 const late=delivered.length-onTime, transit=shipments.filter(s=>s.status==="In transit").length;
 const cards=[["Delivered on time",`${onTime} / ${delivered.length}`,`${(onTime/delivered.length*100).toFixed(1)}% of delivered shipments`],["Delivered late",String(late),"Arrival later than planned date"],["In transit",String(transit),"Excluded from on-time denominator"]];
 $("delivery-list").innerHTML=cards.map(c=>`<div class="delivery-card"><b>${c[0]}</b><span>${c[1]}</span><span>${c[2]}</span></div>`).join("");
}
function render(){calculateKpis();renderMix();renderPriority();renderTable();renderDelivery();}
function showDetail(id){
 const e=exceptions.find(x=>x.id===id);if(!e)return;selectedId=id;
 $("d-title").textContent=e.title;$("d-desc").textContent=`${e.id} · ${e.sku} · ${e.category}`;
 $("d-fields").innerHTML=[["Partner",e.partner],["Location",e.location],["Due date",formatDate(e.due_date)],["Units affected",e.units_affected],["Severity",e.severity],["Status",e.status]].map(([k,v])=>`<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("");
 $("d-action").textContent=e.recommended_action;$("details").showModal();
}
function updateStatus(status){const e=exceptions.find(x=>x.id===selectedId);if(!e)return;e.status=status;saveState();$("details").close();render();}
["search"].forEach(id=>$(id).addEventListener("input",renderTable));
["severity","status","category"].forEach(id=>$(id).addEventListener("change",renderTable));
$("review").addEventListener("click",()=>updateStatus("In review"));
$("resolve").addEventListener("click",()=>updateStatus("Resolved"));
$("reset").addEventListener("click",()=>{exceptions=structuredClone(exceptionsSeed);saveState();$("search").value="";$("severity").value="All";$("status").value="All";$("category").value="All";render();});
$("export").addEventListener("click",()=>{
 const cols=Object.keys(exceptionsSeed[0]),rows=exceptions.filter(matches);
 const csv=[cols.join(","),...rows.map(row=>cols.map(k=>`"${String(row[k]??"").replace(/"/g,'""')}"`).join(","))].join("\r\n");
 const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="supply-chain-exceptions.csv";a.click();URL.revokeObjectURL(url);
});
render();
