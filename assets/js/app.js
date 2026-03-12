let cropsData = {}

async function loadCrops(){

 try{

  const response = await fetch("../assets/data/crops.json")
  cropsData = await response.json()

  buildCalendar()

 }catch(e){

  console.error("Crops konnten nicht geladen werden",e)

 }

}

function buildCalendar(){

 const calendar = document.getElementById("calendar")

 if(!calendar) return

 calendar.innerHTML=""

 const crops = Object.keys(cropsData).sort()

 crops.forEach(crop=>{

  const item=document.createElement("div")
  item.className="calendarItem"

  const sow=cropsData[crop].sow.length ? cropsData[crop].sow.join("–") : "-"
  const harvest=cropsData[crop].harvest.length ? cropsData[crop].harvest.join("–") : "-"

  item.innerHTML=`
  <span>${crop}</span>
  <span>${sow}</span>
  <span>${harvest}</span>
  `

  calendar.appendChild(item)

 })

}

window.addEventListener("DOMContentLoaded",loadCrops)
