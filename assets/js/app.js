const months = [
"Jan","Feb","Mär","Apr","Mai","Jun",
"Jul","Aug","Sep","Okt","Nov","Dez"
]

let cropsData = {}
let timeline = []
let timelineMonth = 0

async function loadData(){

 const res = await fetch("../assets/data/crops.json")
 cropsData = await res.json()

 renderMonths()

}

function renderMonths(){

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

function monthClick(monthIndex){

 const list = []

 Object.keys(cropsData).forEach(crop=>{

  if(cropsData[crop].sow.includes(months[monthIndex])){
   list.push(crop)
  }

 })

 showCropSelection(monthIndex,list)

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

 const sowMonth = monthIndex

 const firstSow = months.indexOf(cropsData[crop].sow[0])
 const firstHarvest = months.indexOf(cropsData[crop].harvest[0])

 let growth = firstHarvest-firstSow

 if(growth<0) growth+=12

 const harvestMonth = sowMonth + growth

 timeline.push({
  crop:crop,
  sow:sowMonth,
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

  let rowMonths=[]

  for(let i=0;i<12;i++){

   const globalMonth=i

   let char=" "

   if(globalMonth===item.sow%12) char="A"
   else if(globalMonth===item.harvest%12) char="E"
   else if(
    globalMonth>item.sow%12 &&
    globalMonth<item.harvest%12
   ) char="█"

   rowMonths.push(char)

  }

  row.innerText=rowMonths.join(" ")

  box.appendChild(row)

 })

}

window.onload=loadData
