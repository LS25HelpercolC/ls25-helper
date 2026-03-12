let cropsData = {}

async function loadCrops(){

 const response = await fetch("../assets/data/crops.json")
 cropsData = await response.json()

 buildCalendar()

}

function buildCalendar(){

 const calendar = document.getElementById("calendar")

 if(!calendar) return

 calendar.innerHTML = ""

 Object.keys(cropsData).forEach(crop => {

  const item = document.createElement("div")
  item.className = "calendarItem"

  const sow = cropsData[crop].sow.join("-")
  const harvest = cropsData[crop].harvest.join("-")

  item.innerHTML = `
   <span>${crop}</span>
   <span>${sow}</span>
   <span>${harvest}</span>
  `

  calendar.appendChild(item)

 })

}

window.onload = loadCrops
