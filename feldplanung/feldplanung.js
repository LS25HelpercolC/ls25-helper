const months=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"]

const YEARS=5

let crops={}
let selectedCrop=null

let fields=JSON.parse(localStorage.getItem("ls25_fields"))||{}
let currentField=null

const cropIcons={
"Weizen":"wheat.png",
"Gerste":"barley.png",
"Hafer":"oats.png",
"Raps":"rapeseed.png",
"Mais (Korn)":"corn.png",
"Mais (Silomais)":"corn.png",
"Sojabohnen":"soybean.png",
"Sonnenblumen":"sunflower.png",
"Kartoffeln":"potato.png",
"Zuckerrüben":"sugarbeet.png",
"Erbsen":"pea.png",
"Karotten":"carrot.png",
"Pastinaken":"carrot.png",
"Reis":"rice.png",
"Sorghum":"sorghum.png",
"Trauben":"grape.png",
"Oliven":"olive.png",
"Pappel":"poplar.png",
"Ölrettich":"oilradish.png",
"Gras":"grass.png"
}

async function init(){

const res=await fetch("../assets/data/crops.json")
crops=await res.json()

buildCalendar()
buildCrops()
buildMonths()

if(Object.keys(fields).length===0){

fields["Feld 1"]={
name:"Feld 1",
size:10,
plans:[]
}

}

currentField=Object.keys(fields)[0]

drawFieldMenu()
drawTimeline()

}

function save(){
localStorage.setItem("ls25_fields",JSON.stringify(fields))
}

/* FELDER */

function drawFieldMenu(){

const menu=document.getElementById("fieldMenu")
menu.innerHTML=""

Object.keys(fields).forEach(id=>{

const field=fields[id]

const btn=document.createElement("button")

btn.innerText=field.name+" ("+field.size+" ha)"

if(id===currentField){
btn.style.background="#4CAF50"
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

let id="field_"+Date.now()

fields[id]={
name:name,
size:size,
plans:[]
}

currentField=id

save()

drawFieldMenu()
drawTimeline()

}

/* CROPS */

function buildCrops(){

const grid=document.getElementById("cropGrid")

Object.keys(crops).forEach(crop=>{

const el=document.createElement("div")
el.className="crop"

const icon=cropIcons[crop]||"wheat.png"

el.innerHTML=
`<img src="../assets/images/crops/${icon}">
<div>${crop}</div>`

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

/* MONATE */

function buildMonths(){

const bar=document.getElementById("monthBar")

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

/* PLANUNG */

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

save()

drawTimeline()

}

/* TIMELINE */

function drawTimeline(){

const box=document.getElementById("timeline")
box.innerHTML=""

const plans=fields[currentField].plans

for(let y=0;y<YEARS;y++){

const year=document.createElement("div")
year.className="timelineYear"

const label=document.createElement("div")
label.className="yearLabel"
label.innerText="Jahr "+(y+1)

year.appendChild(label)

const monthRow=document.createElement("div")
monthRow.className="timelineMonths"

months.forEach(m=>{
const d=document.createElement("div")
d.innerText=m
monthRow.appendChild(d)
})

year.appendChild(monthRow)

const row=document.createElement("div")
row.className="timelineBarRow"

plans.forEach(p=>{

const icon=cropIcons[p.crop]||"wheat.png"

let duration

if(p.start<=p.end){
duration=p.end-p.start+1
}else{
duration=12-p.start+p.end+1
}

const bar=document.createElement("div")
bar.className="timelineBar"

bar.style.left=(p.start/12*100)+"%"
bar.style.width=(duration/12*100)+"%"

bar.innerHTML=
`<img src="../assets/images/crops/${icon}">${p.crop}`

row.appendChild(bar)

})

year.appendChild(row)

box.appendChild(year)

}

}

/* KALENDER */

function buildCalendar(){

const list=document.getElementById("calendarList")

Object.keys(crops).forEach(name=>{

const item=document.createElement("div")
item.className="calendarItem"

item.innerHTML=
`<span>${name}</span>
<span>${crops[name].sow.join("-")}</span>
<span>${crops[name].harvest.join("-")}</span>`

list.appendChild(item)

})

}

window.onload=init
