const months = [
"Jan","Feb","Mär","Apr","Mai","Jun",
"Jul","Aug","Sep","Okt","Nov","Dez"
]

let cropsData = {}
let timeline = []

async function init(){

 const res = await fetch("../assets/data/crops.json")
 cropsData = await res.json()

 buildMonthBar()
 buildCalendar()

}

function buildMonthBar(){

 const container = document.getElementById("timelineMonths")
 container.innerHTML=""

 months.forEach((m,i)=>{

  const div=document.createElement("div")
  div.className="month"
  div.innerText=m

  div.onclick=()=>monthClick(i)

  container.appendChild(div)

 })

}

function buildCalendar(){

 const box=document.getElementById("calendar")
 if(!box) return

 box.innerHTML=""

 Object.keys(cropsData).forEach(crop=>{

  const row=document.createElement("div")
  row.className="calendarItem"

  row.innerHTML=
  "<span>"+crop+"</span>"+
  "<span>"+cropsData[crop].sow.join("-")+"</span>"+
  "<span>"+cropsData[crop].harvest.join("-")+"</span>"

  box.appendChild(row)

 })

}

function monthClick(monthIndex){

 const possible=[]

 Object.keys(cropsData).forEach(crop=>{

  if(cropsData[crop].sow.includes(months[monthIndex])){
   possible.push(crop)
  }

 })

 showCropSelection(monthIndex,possible)

}

function showCropSelection(monthIndex,crops){

 const box=document.getElementById("cropSelectBox")
 box.innerHTML=""

 crops.forEach(crop=>{

  const btn=document.createElement("button")
  btn.innerText=crop

  btn.onclick=()=>addCrop(monthIndex,crop)

  box.appendChild(btn)

 })

}

function addCrop(monthIndex,crop){

 const firstSow=months.indexOf(cropsData[crop].sow[0])
 const firstHarvest=months.indexOf(cropsData[crop].harvest[0])

 let growth=firstHarvest-firstSow
 if(growth<0) growth+=12

 const harvestMonth=monthIndex+growth

 timeline.push({
  crop:crop,
  sow:monthIndex,
  harvest:harvestMonth
 })

 renderTimeline()

}

function renderTimeline(){

 const box=document.getElementById("timelineRows")
 box.innerHTML=""

 timeline.forEach(item=>{

  const row=document.createElement("div")
  row.className="timelineBarRow"

  const bar=document.createElement("div")
  bar.className="timelineBar"

  const start=(item.sow%12)*8.33
  const width=((item.harvest-item.sow)%12)*8.33

  bar.style.left=start+"%"
  bar.style.width=width+"%"

  bar.innerText=item.crop

  row.appendChild(bar)

  box.appendChild(row)

 })

}

window.onload=init
