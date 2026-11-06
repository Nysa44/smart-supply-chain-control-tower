const seed={
inventory:[
{id:"INV-1042",name:"Wireless sensor modules",category:"Electronics",location:"Dubai DC",stock:1280,reorder:500,status:"Healthy",value:38400},
{id:"INV-1038",name:"Packaging cartons - L",category:"Packaging",location:"Abu Dhabi DC",stock:210,reorder:300,status:"Low stock",value:1680},
{id:"INV-1031",name:"Hydraulic pump assembly",category:"Components",location:"Jebel Ali",stock:74,reorder:100,status:"Low stock",value:29600},
{id:"INV-1026",name:"Safety gloves (box)",category:"Safety",location:"Dubai DC",stock:860,reorder:250,status:"Healthy",value:4300},
{id:"INV-1019",name:"Control circuit boards",category:"Electronics",location:"Sharjah DC",stock:42,reorder:80,status:"Critical",value:12600}
],
suppliers:[
{id:"SUP-001",name:"GulfTech Components",category:"Electronics",onTime:96,lead:7,risk:"Low",contact:"ops@gulftech.example"},
{id:"SUP-002",name:"Emirates Packaging Co.",category:"Packaging",onTime:82,lead:12,risk:"Medium",contact:"orders@empack.example"},
{id:"SUP-003",name:"Nordic Industrial Parts",category:"Components",onTime:68,lead:21,risk:"High",contact:"supply@nordic.example"},
{id:"SUP-004",name:"Al Safa Safety Supplies",category:"Safety",onTime:94,lead:5,risk:"Low",contact:"sales@alsafa.example"}
],
shipments:[
{id:"SHP-9081",origin:"Shanghai, CN",destination:"Jebel Ali, UAE",supplier:"GulfTech Components",eta:"2026-11-08",mode:"Ocean",status:"In transit",delay:0},
{id:"SHP-9077",origin:"Hamburg, DE",destination:"Dubai DC, UAE",supplier:"Nordic Industrial Parts",eta:"2026-11-06",mode:"Air",status:"Delayed",delay:3},
{id:"SHP-9069",origin:"Mumbai, IN",destination:"Abu Dhabi DC, UAE",supplier:"Emirates Packaging Co.",eta:"2026-11-07",mode:"Road",status:"In transit",delay:0},
{id:"SHP-9054",origin:"Riyadh, SA",destination:"Sharjah DC, UAE",supplier:"Al Safa Safety Supplies",eta:"2026-11-05",mode:"Road",status:"Delivered",delay:0}
],
exceptions:[
{id:"EX-301",title:"Circuit board stock below safety threshold",type:"Inventory",severity:"Critical",owner:"M. Rahman",due:"2026-11-06",status:"Open",detail:"42 units remaining against a reorder point of 80. Expedite replenishment."},
{id:"EX-298",title:"Supplier delivery running 3 days late",type:"Shipment",severity:"High",owner:"A. Khan",due:"2026-11-07",status:"In progress",detail:"Nordic Industrial Parts shipment SHP-9077 delayed at origin."},
{id:"EX-295",title:"Packaging stock projected to run out",type:"Inventory",severity:"Medium",owner:"S. Ali",due:"2026-11-09",status:"Open",detail:"Current stock is 210 units, below reorder point of 300."},
{id:"EX-291",title:"Supplier quality documentation pending",type:"Supplier",severity:"Low",owner:"J. Thomas",due:"2026-11-10",status:"Resolved",detail:"Updated compliance documents requested from supplier."}
]};
let db;try{db=JSON.parse(localStorage.getItem("supplyops-db"))||seed}catch{db=seed}
const clone=x=>JSON.parse(JSON.stringify(x)); if(!localStorage.getItem("supplyops-db")) db=clone(seed);
const save=()=>localStorage.setItem("supplyops-db",JSON.stringify(db));
let currentView="overview", searchTerm="", filterValue="All";
const $=s=>document.querySelector(s);
const money=n=>"$"+Number(n).toLocaleString("en-US");
const statusClass=s=>({Healthy:"", "Low stock":"warning",Critical:"critical","In transit":"info",Delayed:"critical",Delivered:"",Open:"warning","In progress":"info",Resolved:"",Low:"",Medium:"warning",High:"critical"}[s]||"info");
const pill=s=>`<span class="status ${statusClass(s)}">${s}</span>`;
const setHeader=(title,sub,add)=>{$("#pageTitle").textContent=title;$("#pageSubtitle").textContent=sub;$("#crumb").textContent=title;$("#addLabel").textContent=add};
function render(){document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===currentView));$("#exceptionNavCount").textContent=db.exceptions.filter(e=>e.status!=="Resolved").length;
const views={overview:overview,inventory:()=>tableView("inventory"),suppliers:()=>tableView("suppliers"),shipments:()=>tableView("shipments"),exceptions:()=>tableView("exceptions"),analytics:analytics};views[currentView](); }
function overview(){setHeader("Supply chain overview","A real-time view of operational health across your supply chain.","Add exception");
const open=db.exceptions.filter(e=>e.status!=="Resolved").length, critical=db.exceptions.filter(e=>e.severity==="Critical"&&e.status!=="Resolved").length;
$("#viewContent").innerHTML=`
<div class="stats-grid">
<div class="stat-card"><div class="stat-top">Inventory health <span class="stat-icon">▤</span></div><div class="stat-value">94.2%</div><div class="stat-foot"><span class="positive">↑ 2.4%</span> vs. last month</div></div>
<div class="stat-card"><div class="stat-top">Supplier on-time rate <span class="stat-icon">♙</span></div><div class="stat-value">85.0%</div><div class="stat-foot"><span class="negative">↓ 1.2%</span> vs. last month</div></div>
<div class="stat-card"><div class="stat-top">Delayed shipments <span class="stat-icon">⇄</span></div><div class="stat-value">${db.shipments.filter(s=>s.status==="Delayed").length}</div><div class="stat-foot">Across ${db.shipments.length} tracked shipments</div></div>
<div class="stat-card"><div class="stat-top">Open exceptions <span class="stat-icon">⚑</span></div><div class="stat-value">${open}</div><div class="stat-foot"><span class="${critical?'negative':'positive'}">${critical} critical</span> require attention</div></div>
</div>
<div class="dashboard-grid"><div class="panel"><div class="panel-head"><div><h3>Supply chain performance</h3><div class="panel-sub">Operational score · last 6 months</div></div><div class="legend"><span>Service level</span><span>Target</span></div></div><div class="chart-wrap"><canvas id="performanceChart"></canvas></div></div>
<div class="panel"><div class="panel-head"><div><h3>Risk exposure</h3><div class="panel-sub">Exceptions by operational category</div></div><button class="link-btn" data-go="exceptions">View all ↗</button></div><div class="risk-list">
${riskBar("Inventory",db.exceptions.filter(x=>x.type==="Inventory").length,db.exceptions.length,"red")}
${riskBar("Supplier",db.exceptions.filter(x=>x.type==="Supplier").length,db.exceptions.length,"")}
${riskBar("Shipment",db.exceptions.filter(x=>x.type==="Shipment").length,db.exceptions.length,"green")}
${riskBar("Other",db.exceptions.filter(x=>!["Inventory","Supplier","Shipment"].includes(x.type)).length,db.exceptions.length,"")}
</div></div></div>
<div class="lower-grid"><div class="panel table-panel"><div class="panel-head"><div><h3>Shipment tracker</h3><div class="panel-sub">Latest logistics movements</div></div><button class="link-btn" data-go="shipments">View shipments ↗</button></div>${shipmentTable(db.shipments.slice(0,4))}</div>
<div class="panel"><div class="panel-head"><div><h3>Priority exceptions</h3><div class="panel-sub">Items requiring operational action</div></div><button class="link-btn" data-go="exceptions">Manage ↗</button></div>${db.exceptions.filter(e=>e.status!=="Resolved").slice(0,4).map(exceptionItem).join("")||'<div class="empty">No open exceptions. Great work!</div>'}</div></div>`;
drawChart(); }
function riskBar(name,n,total,color){return `<div class="risk-row"><b>${name}</b><small>${n} item${n===1?"":"s"}</small><div class="bar ${color}"><i style="width:${total?Math.max(4,n/total*100):0}%"></i></div></div>`}
function exceptionItem(e){return `<div class="exception-item"><div class="ex-mark">⚑</div><div style="min-width:0"><b>${esc(e.title)}</b><small>${e.id} · ${e.owner} · Due ${e.due}</small></div>${pill(e.severity)}</div>`}
function shipmentTable(rows){return `<div class="table-wrap"><table><thead><tr><th>SHIPMENT</th><th>ROUTE</th><th>ETA</th><th>STATUS</th></tr></thead><tbody>${rows.map(s=>`<tr><td><strong>${s.id}</strong></td><td>${esc(s.origin)} → ${esc(s.destination)}</td><td>${s.eta}</td><td>${pill(s.status)}</td></tr>`).join("")}</tbody></table></div>`}
function tableView(type){let config={
inventory:{title:"Inventory visibility",sub:"Monitor stock levels, reorder points and warehouse availability.",add:"Add inventory",cols:["SKU / ITEM","CATEGORY","LOCATION","ON HAND","REORDER POINT","STATUS","VALUE"],fields:["id","name","category","location","stock","reorder","status","value"]},
suppliers:{title:"Supplier performance",sub:"Track supplier reliability, lead times and exposure.",add:"Add supplier",cols:["SUPPLIER","CATEGORY","ON-TIME RATE","LEAD TIME","RISK","CONTACT"],fields:["id","name","category","onTime","lead","risk","contact"]},
shipments:{title:"Shipment tracking",sub:"Follow inbound and outbound logistics and delivery exceptions.",add:"Add shipment",cols:["SHIPMENT","ORIGIN","DESTINATION","SUPPLIER","ETA","MODE","STATUS"],fields:["id","origin","destination","supplier","eta","mode","status"]},
exceptions:{title:"Exception management",sub:"Prioritise disruptions, assign ownership and track resolution.",add:"Add exception",cols:["ID / ISSUE","TYPE","SEVERITY","OWNER","DUE DATE","STATUS","ACTION"],fields:["id","title","type","severity","owner","due","status"]}
}[type];setHeader(config.title,config.sub,config.add);
let rows=db[type].filter(r=>JSON.stringify(r).toLowerCase().includes(searchTerm.toLowerCase())&&(filterValue==="All"||[r.status,r.severity,r.risk,r.category].includes(filterValue)));
let body=rows.map(r=>`<tr>${config.fields.map(k=>`<td>${cell(k,r[k],r)}</td>`).join("")}${type==="exceptions"?`<td class="actions-cell"><button data-edit="${r.id}">Edit</button> · <button data-resolve="${r.id}">${r.status==="Resolved"?"Reopen":"Resolve"}</button></td>`:""}</tr>`).join("");
$("#viewContent").innerHTML=`<div class="toolbar"><input class="search" id="tableSearch" placeholder="⌕  Search ${type}..." value="${esc(searchTerm)}"><select class="filter" id="tableFilter"><option>All</option>${(type==="exceptions"?["Open","In progress","Resolved","Critical","High","Medium","Low"]:type==="inventory"?["Healthy","Low stock","Critical"]:type==="suppliers"?["Low","Medium","High"]:["In transit","Delayed","Delivered"]).map(v=>`<option ${filterValue===v?"selected":""}>${v}</option>`).join("")}</select><span class="panel-sub">${rows.length} records</span></div><div class="table-full"><div class="table-wrap"><table><thead><tr>${config.cols.map(c=>`<th>${c}</th>`).join("")}${type==="exceptions"?"<th></th>":""}</tr></thead><tbody>${body||`<tr><td colspan="${config.cols.length+1}" class="empty">No records match your search.</td></tr>`}</tbody></table></div></div>`;
$("#tableSearch").addEventListener("input",e=>{searchTerm=e.target.value;const pos=e.target.selectionStart;tableView(type);$("#tableSearch").focus();$("#tableSearch").setSelectionRange(pos,pos)});
$("#tableFilter").addEventListener("change",e=>{filterValue=e.target.value;tableView(type)});
}
function cell(k,v,r){if(k==="status"||k==="severity"||k==="risk")return pill(v);if(k==="value")return money(v);if(k==="onTime")return v+"%";if(k==="lead")return v+" days";if(k==="stock")return `<strong>${v.toLocaleString()}</strong>`;if(k==="id"||k==="name"||k==="title")return `<strong>${esc(v)}</strong>`;return esc(v??"—")}
function analytics(){setHeader("Performance analytics","A consolidated view of service, inventory and supplier performance.","Export report");$("#viewContent").innerHTML=`<div class="metric-grid"><div class="metric-box"><small>Inventory value on hand</small><b>${money(db.inventory.reduce((a,x)=>a+x.value,0))}</b><div class="progress"><i style="width:78%"></i></div></div><div class="metric-box"><small>Average supplier on-time</small><b>${Math.round(db.suppliers.reduce((a,x)=>a+x.onTime,0)/Math.max(1,db.suppliers.length))}%</b><div class="progress"><i style="width:85%"></i></div></div><div class="metric-box"><small>Shipment delivery performance</small><b>${Math.round(db.shipments.filter(x=>x.status!=="Delayed").length/Math.max(1,db.shipments.length)*100)}%</b><div class="progress"><i style="width:${db.shipments.filter(x=>x.status!=="Delayed").length/Math.max(1,db.shipments.length)*100}%"></i></div></div></div><div class="panel"><div class="panel-head"><div><h3>Operational performance trend</h3><div class="panel-sub">Illustrative monthly service-level trend</div></div></div><div class="chart-wrap"><canvas id="performanceChart"></canvas></div></div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Risk and action summary</h3></div>${db.exceptions.map(exceptionItem).join("")||'<div class="empty">No exceptions recorded.</div>'}</div>`;drawChart()}
function drawChart(){let c=$("#performanceChart");if(!c)return;let rect=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;c.width=rect.width*dpr;c.height=rect.height*dpr;let ctx=c.getContext("2d");ctx.scale(dpr,dpr);let w=rect.width,h=rect.height,p={l:32,r:12,t:15,b:27};let vals=[78,81,79,86,84,91],target=[85,85,85,85,85,85],labels=["Jun","Jul","Aug","Sep","Oct","Nov"];ctx.font="10px DM Sans";ctx.fillStyle="#96a1ae";ctx.strokeStyle="#edf0f4";for(let i=0;i<4;i++){let y=p.t+(h-p.t-p.b)*i/3;ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke();ctx.fillText((100-i*10)+"%",0,y+3)}function line(data,color,dash){ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=2;if(dash)ctx.setLineDash([5,4]);data.forEach((v,i)=>{let x=p.l+i*(w-p.l-p.r)/5,y=p.t+(100-v)/30*(h-p.t-p.b);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.setLineDash([])}line(target,"#e8ad53",true);line(vals,"#3677ed",false);labels.forEach((l,i)=>{ctx.fillStyle="#8995a4";ctx.fillText(l,p.l+i*(w-p.l-p.r)/5-8,h-6)})}
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const schemas={
exceptions:[["id","Exception ID","text"],["title","Issue title","text"],["type","Category","select",["Inventory","Supplier","Shipment","Quality","Other"]],["severity","Severity","select",["Critical","High","Medium","Low"]],["owner","Owner","text"],["due","Due date","date"],["status","Status","select",["Open","In progress","Resolved"]],["detail","Details","textarea"]],
inventory:[["id","SKU","text"],["name","Item name","text"],["category","Category","select",["Electronics","Packaging","Components","Safety","Other"]],["location","Warehouse","text"],["stock","On-hand quantity","number"],["reorder","Reorder point","number"],["status","Status","select",["Healthy","Low stock","Critical"]],["value","Inventory value ($)","number"]],
suppliers:[["id","Supplier ID","text"],["name","Supplier name","text"],["category","Category","text"],["onTime","On-time rate (%)","number"],["lead","Lead time (days)","number"],["risk","Risk level","select",["Low","Medium","High"]],["contact","Contact email","email"]],
shipments:[["id","Shipment ID","text"],["origin","Origin","text"],["destination","Destination","text"],["supplier","Supplier","text"],["eta","Estimated arrival","date"],["mode","Transport mode","select",["Ocean","Air","Road","Rail"]],["status","Status","select",["In transit","Delayed","Delivered"]],["delay","Delay (days)","number"]]
};
let editing=null;
function openForm(type,id=null){let record=id?db[type].find(x=>x.id===id):null;editing={type,id};$("#modalTitle").textContent=(record?"Edit ":"Add ")+type.slice(0,-1);$("#formFields").innerHTML=schemas[type].map(([key,label,kind,opts])=>`<div class="field ${kind==="textarea"?"full":""}"><label>${label}</label>${kind==="select"?`<select name="${key}">${opts.map(o=>`<option ${record?.[key]===o?"selected":""}>${o}</option>`).join("")}</select>`:kind==="textarea"?`<textarea name="${key}">${esc(record?.[key]||"")}</textarea>`:`<input name="${key}" type="${kind}" value="${esc(record?.[key]??"")}" ${key==="id"&&record?"readonly":""} required>`}</div>`).join("");$("#modalBackdrop").classList.add("open")}
function closeForm(){$("#modalBackdrop").classList.remove("open");editing=null}
$("#recordForm").addEventListener("submit",e=>{e.preventDefault();if(!editing)return;let {type,id}=editing,obj={};new FormData(e.target).forEach((v,k)=>obj[k]=["stock","reorder","value","onTime","lead","delay"].includes(k)?Number(v):v);if(id){let i=db[type].findIndex(x=>x.id===id);db[type][i]={...db[type][i],...obj}}else{if(!obj.id)obj.id=type.slice(0,-1).toUpperCase()+"-"+Date.now().toString().slice(-4);if(db[type].some(x=>x.id===obj.id)){toast("That ID already exists.");return}db[type].unshift(obj)}save();closeForm();render();toast("Record saved successfully.")});
$("#closeModal").onclick=closeForm;$("#cancelModal").onclick=closeForm;$("#modalBackdrop").onclick=e=>{if(e.target.id==="modalBackdrop")closeForm()};
$("#addBtn").onclick=()=>openForm(currentView==="overview"||currentView==="exceptions"?"exceptions":currentView);
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{currentView=b.dataset.view;searchTerm="";filterValue="All";render()});
document.addEventListener("click",e=>{let go=e.target.closest("[data-go]");if(go){currentView=go.dataset.go;render()}let edit=e.target.closest("[data-edit]");if(edit)openForm("exceptions",edit.dataset.edit);let resolve=e.target.closest("[data-resolve]");if(resolve){let r=db.exceptions.find(x=>x.id===resolve.dataset.resolve);r.status=r.status==="Resolved"?"Open":"Resolved";save();render();toast("Exception status updated.")}});
function toast(msg){let t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2600)}
$("#exportBtn").onclick=()=>exportCSV(currentView==="overview"?"exceptions":currentView);
function exportCSV(type){if(!db[type])type="exceptions";let rows=db[type],keys=Object.keys(rows[0]||{});let csv=[keys.join(","),...rows.map(r=>keys.map(k=>`"${String(r[k]??"").replace(/"/g,'""')}"`).join(","))].join("\n");let a=document.createElement("a"),url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.href=url;a.download=`supplyops-${type}.csv`;a.click();URL.revokeObjectURL(url);toast("CSV report exported.")}
$("#guideBtn").onclick=()=>{alert("Quick start\\n\\n1. Use the left navigation to explore inventory, suppliers, shipments and exceptions.\\n2. Add or edit records with the blue action button.\\n3. Search and filter tables to isolate operational issues.\\n4. Resolve exceptions when actions are complete.\\n5. Export any table as CSV.\\n\\nYour changes are saved in this browser using local storage.")};
$("#notifyBtn").onclick=()=>toast(`${db.exceptions.filter(x=>x.status!=="Resolved").length} unresolved exceptions need attention.`);
window.addEventListener("resize",()=>{if(currentView==="overview"||currentView==="analytics")drawChart()});
render();