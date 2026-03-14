const months=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"]

let crops={}
let selectedCrop=null

let fields={}
let currentField=null

function iconName(name){
return name
.toLowerCase()
.replaceAll(" ","_")
.replaceAll("(","")
.replaceAll(")","")
.replaceAll("ä","ae")
.replaceAll("ö","oe")
.replaceAll("ü","ue")
.replaceAll("ß","ss")
}

async function init(){

const res=await fetch("../assets/data/crops.json")
crops=await res.json()

fields={
field1:{
name:"Feld 1",
size:10,
plans:[]
}
}

currentField="field1"

buildCalendar()
buildCrops()
buildMonths()

drawFieldMenu()
drawTimeline()

}

/* Felder */

function drawFieldMenu(){

const menu=document.getElementById("fieldMenu")
menu.innerHTML=""

Object.keys(fields).forEach(id=>{

const field=fields[id]

const btn=document.createElement("button")
btn.className="fieldButton"
btn.innerText=field.name+" ("+field.size+" ha)"

if(id===currentField){
btn.classList.add("active")
}

btn.onclick=()=>{
currentField=id
drawFieldMenu()
drawTimeline()
}

menu.appendChild(btn)

})

}

document.getElementById("addFieldBtn").onclick=()=>{

let name=prompt("Feldname?")
if(!name)return

let size=parseFloat(prompt("Feldgröße (ha)?"))
if(!size)size=1

let id="field"+Date.now()

fields[id]={
name:name,
size:size,
plans:[]
}

currentField=id

drawFieldMenu()
drawTimeline()

}

/* Crops */

function buildCrops(){

const grid=document.getElementById("cropGrid")
grid.innerHTML=""

Object.keys(crops).forEach(crop=>{

const icon=iconName(crop)

const el=document.createElement("div")
el.className="crop"

el.innerHTML=`
<img src="../assets/images/crops/${icon}.png">
<div>${crop}</div>
`

el.onclick=()=>{

selectedCrop=crop

document.querySelectorAll(".crop").forEach(c=>{
c.classList.remove("active")
})

el.classList.add("active")

highlightMonths()

}

grid.appendChild(el)

})

}

/* Monate */

function buildMonths(){

const bar=document.getElementById("monthBar")
bar.innerHTML=""

months.forEach((m,i)=>{

const el=document.createElement("div")
el.className="month"
el.innerText=m

el.onclick=()=>monthClick(i)

bar.appendChild(el)

})

}

function highlightMonths(){

document.querySelectorAll(".month").forEach((m,i)=>{

m.classList.remove("allowed")

if(selectedCrop && crops[selectedCrop].sow.includes(months[i])){
m.classList.add("allowed")
}

})

}

/* Planung */

function monthClick(index){

if(!selectedCrop)return
if(!crops[selectedCrop].sow.includes(months[index]))return

const sowIndex=crops[selectedCrop].sow.indexOf(months[index])
const harvestMonth=crops[selectedCrop].harvest[sowIndex]

const end=months.indexOf(harvestMonth)

fields[currentField].plans.push({
crop:selectedCrop,
start:index,
end:end
})

drawTimeline()

}

/* Timeline */

function drawTimeline(){

const box=document.getElementById("timeline")
box.innerHTML=""

const plans=fields[currentField].plans

let globalMonth=0

plans.forEach(plan=>{

let duration

if(plan.start<=plan.end){
duration=plan.end-plan.start+1
}else{
duration=12-plan.start+plan.end+1
}

let year=Math.floor(globalMonth/12)

let yearBox=document.getElementById("year_"+year)

if(!yearBox){

yearBox=document.createElement("div")
yearBox.className="timelineYear"
yearBox.id="year_"+year

const label=document.createElement("div")
label.className="yearLabel"
label.innerText="Jahr "+(year+1)

yearBox.appendChild(label)

const monthRow=document.createElement("div")
monthRow.className="timelineMonths"

months.forEach(m=>{
const d=document.createElement("div")
d.innerText=m
monthRow.appendChild(d)
})

yearBox.appendChild(monthRow)

const row=document.createElement("div")
row.className="timelineBarRow"
row.id="row_"+year

yearBox.appendChild(row)

box.appendChild(yearBox)

}

const row=document.getElementById("row_"+year)

const icon=iconName(plan.crop)

const bar=document.createElement("div")
bar.className="timelineBar"

bar.style.left=((globalMonth%12)/12*100)+"%"
bar.style.width=(duration/12*100)+"%"

bar.innerHTML=`<img src="../assets/images/crops/${icon}.png">${plan.crop}`

row.appendChild(bar)

globalMonth+=duration

})

}

/* Kalender */

function buildCalendar(){

const list=document.getElementById("calendarList")
list.innerHTML=""

Object.keys(crops).forEach(name=>{

const item=document.createElement("div")
item.className="calendarItem"

item.innerHTML=`
<span>${name}</span>
<span>${crops[name].sow.join("-")}</span>
<span>${crops[name].harvest.join("-")}</span>
`

list.appendChild(item)

})

}

window.onload=init
