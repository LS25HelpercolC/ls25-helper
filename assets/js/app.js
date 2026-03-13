const months = [
"Jan","Feb","Mär","Apr","Mai","Jun",
"Jul","Aug","Sep","Okt","Nov","Dez"
]

let crops = {}
let timeline = []

/* =========================================
   ICON MAPPING (Fix für kaputte Icons)
========================================= */

const cropIcons = {
"weizen":"wheat.png",
"gerste":"barley.png",
"hafer":"oats.png",
"raps":"rapeseed.png",
"mais (korn)":"corn.png",
"mais (silomais)":"corn.png",
"sojabohnen":"soybean.png",
"sonnenblumen":"sunflower.png",
"kartoffeln":"potato.png",
"zuckerrüben":"sugarbeet.png",
"erbsen":"pea.png",
"karotten":"carrot.png",
"pastinaken":"parsnip.png",
"reis":"rice.png",
"sorghum":"sorghum.png",
"trauben":"grape.png",
"oliven":"olive.png",
"pappel":"poplar.png",
"ölrettich":"oilradish.png",
"gras":"grass.png",
"brach":"fallow.png"
}

/* =========================================
   INIT
========================================= */

async function initFeldplanung(){

 const res = await fetch("../assets/data/crops.json")
 crops = await res.json()

 buildMonths()
 buildCalendar()

}

/* =========================================
   MONATSLEISTE
========================================= */

function buildMonths(){

 const row=document.querySelector(".timelineMonths")
 if(!row) return

 row.innerHTML=""

 months.forEach((m,i)=>{

  const div=document.createElement("div")
  div.className="month"
  div.innerText=m
  div.onclick=()=>monthClick(i)

  row.appendChild(div)

 })

}

/* =========================================
   PFLANZENKALENDER (bleibt unverändert)
========================================= */

function buildCalendar(){

 const cal=document.getElementById("calendar")
 if(!cal) return

 cal.innerHTML=""

 Object.keys(crops).forEach(name=>{

  const item=document.createElement("div")
  item.className="calendarItem"

  const sow=crops[name].sow.join("–")
  const harvest=crops[name].harvest.join("–")

  item.innerHTML=`
  <span>${name}</span>
  <span>${sow}</span>
  <span>${harvest}</span>
  `

  cal.appendChild(item)

 })

}

/* =========================================
   FELD BLOCKIERUNG
========================================= */

function getLastHarvestMonth(){

 if(timeline.length===0) return null
 return timeline[timeline.length-1].end

}

/* =========================================
   MONAT KLICK
========================================= */

function monthClick(index){

 const lastHarvest=getLastHarvestMonth()

 if(lastHarvest!==null){

  if(index!==lastHarvest){
   alert("Feld ist noch belegt bis zur Ernte.")
   return
  }

 }

 const possible=[]

 Object.keys(crops).forEach(c=>{

  if(crops[c].sow.includes(months[index])){
   possible.push(c)
  }

 })

 showCropOptions(index,possible)

}

/* =========================================
   CROP AUSWAHL
========================================= */

function showCropOptions(monthIndex,list){

 const box=document.querySelector(".cropSelectBox")
 if(!box) return

 box.innerHTML=""

 list.forEach(crop=>{

  const btn=document.createElement("button")
  btn.innerText=crop
  btn.onclick=()=>addCrop(monthIndex,crop)

  box.appendChild(btn)

 })

}

/* =========================================
   CROP HINZUFÜGEN
========================================= */

function addCrop(startMonth,crop){

 const sowList=crops[crop].sow
 const harvestList=crops[crop].harvest

 const sowIndex=sowList.indexOf(months[startMonth])
 if(sowIndex===-1) return

 const harvestMonthName=harvestList[sowIndex]
 const harvestIndex=months.indexOf(harvestMonthName)

 timeline.push({
  crop:crop,
  start:startMonth,
  end:harvestIndex
 })

 renderTimeline()

}

/* =========================================
   TIMELINE
========================================= */

function renderTimeline(){

 const container=document.querySelector(".timeline")
 if(!container) return

 container.innerHTML=""

 timeline.forEach(t=>{

  const row=document.createElement("div")
  row.className="timelineBarRow"

  const bar=document.createElement("div")
  bar.className="timelineBar"

  const duration = (t.end >= t.start)
  ? (t.end - t.start + 1)
  : (12 - t.start + t.end + 1)

  const left = (t.start / 12) * 100
  const width = (duration / 12) * 100

  bar.style.left = left + "%"
  bar.style.width = width + "%"

  const iconFile = cropIcons[t.crop.toLowerCase()]

  if(iconFile){
   bar.innerHTML = `<img src="../assets/images/crops/${iconFile}" style="height:20px;margin-right:6px;"> ${t.crop}`
  }else{
   bar.innerText = t.crop
  }

  row.appendChild(bar)
  container.appendChild(row)

 })

}

document.addEventListener("DOMContentLoaded",initFeldplanung)
