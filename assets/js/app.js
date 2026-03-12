const months = [
"Jan","Feb","Mär","Apr","Mai","Jun",
"Jul","Aug","Sep","Okt","Nov","Dez"
];

let cropsData = {};
let timeline = [];

/* =========================
   INITIALISIERUNG
========================= */

async function init(){

 try{

  const res = await fetch("../assets/data/crops.json");
  cropsData = await res.json();

 }catch(e){

  console.error("crops.json konnte nicht geladen werden",e);

 }

 buildCalendar();
 buildMonthBar();

}

/* =========================
   PFLANZENKALENDER
========================= */

function buildCalendar(){

 const box = document.getElementById("calendar");
 if(!box) return;

 box.innerHTML = "";

 Object.keys(cropsData).forEach(crop=>{

  const row = document.createElement("div");
  row.className = "calendarItem";

  row.innerHTML =
  "<span>"+crop+"</span>"+
  "<span>"+cropsData[crop].sow.join("-")+"</span>"+
  "<span>"+cropsData[crop].harvest.join("-")+"</span>";

  box.appendChild(row);

 });

}

/* =========================
   MONATSLEISTE
========================= */

function buildMonthBar(){

 const container = document.getElementById("timelineMonths");
 if(!container) return;

 container.innerHTML = "";

 months.forEach((m,i)=>{

  const div = document.createElement("div");
  div.className = "month";
  div.innerText = m;

  div.onclick = ()=>monthClick(i);

  container.appendChild(div);

 });

}

/* =========================
   MONAT GEKLICKT
========================= */

function monthClick(monthIndex){

 const list = [];

 Object.keys(cropsData).forEach(crop=>{

  if(cropsData[crop].sow.includes(months[monthIndex])){
   list.push(crop);
  }

 });

 showCropSelection(monthIndex,list);

}

/* =========================
   PFLANZEN AUSWAHL
========================= */

function showCropSelection(monthIndex,crops){

 const box = document.getElementById("cropSelectBox");
 if(!box) return;

 box.innerHTML = "";

 crops.forEach(crop=>{

  const btn = document.createElement("button");
  btn.innerText = crop;

  btn.onclick = ()=>addCrop(monthIndex,crop);

  box.appendChild(btn);

 });

}

/* =========================
   PFLANZE HINZUFÜGEN
========================= */

function addCrop(monthIndex,crop){

 const firstSow = months.indexOf(cropsData[crop].sow[0]);
 const firstHarvest = months.indexOf(cropsData[crop].harvest[0]);

 let growth = firstHarvest - firstSow;

 if(growth < 0) growth += 12;

 const harvestMonth = monthIndex + growth;

 timeline.push({
  crop: crop,
  sow: monthIndex,
  harvest: harvestMonth
 });

 renderTimeline();

}

/* =========================
   TIMELINE ZEICHNEN
========================= */

function renderTimeline(){

 const box = document.getElementById("timelineRows");
 if(!box) return;

 box.innerHTML = "";

 timeline.forEach(item=>{

  const row = document.createElement("div");
  row.className = "timelineRow";

  for(let i=0;i<12;i++){

   const cell = document.createElement("span");

   if(i === item.sow % 12){

    cell.innerText = "A";

   }else if(i === item.harvest % 12){

    cell.innerText = "E";

   }else if(i > item.sow % 12 && i < item.harvest % 12){

    cell.innerText = "█";

   }else{

    cell.innerText = ".";

   }

   row.appendChild(cell);

  }

  box.appendChild(row);

 });

}

/* =========================
   START
========================= */

window.onload = init;
