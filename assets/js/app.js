const months = [
"Jan","Feb","Mär","Apr","Mai","Jun",
"Jul","Aug","Sep","Okt","Nov","Dez"
]

const YEARS = 5

let crops = {}
let timeline = []

async function initFeldplanung(){

 const res = await fetch("../assets/data/crops.json")
 crops = await res.json()

 buildMonths()
 buildCalendar()

}

function buildMonths(){

 const row = document.querySelector(".timelineMonths")
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

function monthClick(index){

 const possible=[]

 Object.keys(crops).forEach(c=>{

  if(crops[c].sow.includes(months[index])){
   possible.push(c)
  }

 })

 showCropOptions(index,possible)

}

function showCropOptions(monthIndex,list){

 const box=document.querySelector(".cropOptions")
 if(!box) return

 box.innerHTML=""

 list.forEach(crop=>{

  const btn=document.createElement("button")
  btn.innerText=crop
  btn.onclick=()=>addCrop(monthIndex,crop)

  box.appendChild(btn)

 })

}

function addCrop(startMonth,crop){

 const sowList=crops[crop].sow
 const harvestList=crops[crop].harvest

 let sowIndex=sowList.indexOf(months[startMonth])
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

function renderTimeline(){

 const rows=document.querySelector(".timelineRows")
 if(!rows) return

 rows.innerHTML=""

 timeline.forEach(t=>{

  const row=document.createElement("div")
  row.className="timelineRow"

  for(let y=0;y<YEARS;y++){

   for(let i=0;i<12;i++){

    const cell=document.createElement("span")

    const index=i

    if(index===t.start && y===0)
     cell.innerText="A"

    else if(index===t.end && (t.end>t.start ? y===0 : y===1))
     cell.innerText="E"

    else if(
     (t.start < t.end && y===0 && index>t.start && index<t.end) ||
     (t.start > t.end && (
       (y===0 && index>t.start) ||
       (y===1 && index<t.end)
     ))
    )
     cell.innerText="█"

    else
     cell.innerText="."

    row.appendChild(cell)

   }

  }

  rows.appendChild(row)

 })

}

document.addEventListener("DOMContentLoaded",initFeldplanung)
