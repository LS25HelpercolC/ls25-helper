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

  const sow = cropsData[crop].sow.join("–")
  const harvest = cropsData[crop].harvest.join("–")

  item.innerHTML = `
  <span>${crop}</span>
  <span>${sow}</span>
  <span>${harvest}</span>
  `

  calendar.appendChild(item)

 })

}

function buildTimeline(crop){

 const data = cropsData[crop]

 if(!data) return

 const timeline = document.getElementById("timeline")

 const row = document.createElement("div")
 row.className = "timelineRow"

 row.innerHTML = `
 <div class="timelineLabel">${crop}</div>
 <div class="timelineBar"></div>
 `

 timeline.appendChild(row)

}

window.onload = loadCrops
