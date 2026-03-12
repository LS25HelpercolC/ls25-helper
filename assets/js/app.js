const months=[
"Jan","Feb","Mär","Apr","Mai","Jun",
"Jul","Aug","Sep","Okt","Nov","Dez"
]

let cropsData={}
let timeline=[]

async function init(){

 const res=await fetch("../assets/data/crops.json")
 cropsData=await res.json()

 buildCalendar()
 buildMonthBar()

}

function buildCalendar(){

 const box=document.getElementById("calendar")
 box.innerHTML=""

 Object.keys(cropsData).forEach(crop=>{

  const item=document.createElement("div")
  item.className="calendarItem"

  const sow=cropsData[crop].sow.join("–")
  const harvest=cropsData[crop].harvest.join("–")

  item.innerHTML=`
  <span>${crop}</span>
  <span>${sow}</span>
  <span>${harvest}</span>
  `

  box.appendChild(item)

 })

}

function buildMonthBar(){

 const container=document.getElementById("timelineMonths")
 container.innerHTML=""

 months.forEach((m,i)=>{

  const div=document.createElement("div")
  div.className="month"
  div.innerText=m

  div.onclick=()=>monthClick(i)

  container.appendChild(div)

 })

}

function monthClick(monthIndex){

 const crops=[]

 Object.keys(cropsData).forEach(crop=>{

  if(cropsData[crop].sow.includes(months[monthIndex])){
   crops.push(crop)
  }

 })

 showCropSelection(monthIndex,crops)

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

  let row=document.createElement("div")
  row.className="timelineRow"

  for(let i=0;i<12;i++){

   const cell=document.createElement("span")

   if(i===item.sow%12) cell.innerText="A"
   else if(i===item.harvest%12) cell.innerText="E"
   else if(i>item.sow%12 && i<item.harvest%12) cell.innerText="█"
   else cell.innerText="."

   row.appendChild(cell)

  }

  box.appendChild(row)

 })

}

window.onload=init
