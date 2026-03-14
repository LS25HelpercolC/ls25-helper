const months=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"]

let crops={}
let selectedCrop=null

let fields={}
let currentField=null

const YEARS=5

async function init(){

localStorage.removeItem("ls25_fields")

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

function drawFieldMenu(){

const menu=document.getElementById("fieldMenu")
menu.innerHTML=""

Object.keys(fields).forEach(id=>{

const field=fields[id]

const btn=document.createElement("button")
btn.innerText=field.name+" ("+field.size+" ha)"

btn.onclick=()=>{
currentField=id
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

fields[id]={name:name,size:size,plans:[]}

currentField=id

drawFieldMenu()
drawTimeline()

}

function buildCrops(){

const grid=document.getElementById("cropGrid")

Object.keys(crops).forEach(crop=>{

const el=document.createElement("div")
el.className="crop"

el.innerHTML=`<div>${crop}</div>`

el.onclick=()=>{

selectedCrop=crop

highlightMonths()

}

grid.appendChild(el)

})

}

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

function monthClick(index){

if(!selectedCrop)return

const sowIndex=crops[selectedCrop].sow.indexOf(months[index])
if(sowIndex==-1)return

const harvestMonth=crops[selectedCrop].harvest[sowIndex]

const end=months.indexOf(harvestMonth)

fields[currentField].plans.push({
crop:selectedCrop,
start:index,
end:end
})

drawTimeline()

}

function drawTimeline(){

const box=document.getElementById("timeline")
box.innerHTML=""

let globalMonth=0

fields[currentField].plans.forEach(plan=>{

let duration

if(plan.start<=plan.end){
duration=plan.end-plan.start+1
}else{
duration=12-plan.start+plan.end+1
}

let year=Math.floor(globalMonth/12)

let yearRow=document.getElementById("year"+year)

if(!yearRow){

yearRow=document.createElement("div")
yearRow.id="year"+year

const label=document.createElement("div")
label.innerText="Jahr "+(year+1)

yearRow.appendChild(label)

const row=document.createElement("div")
row.className="timelineBarRow"
row.id="row"+year

yearRow.appendChild(row)

box.appendChild(yearRow)

}

const row=document.getElementById("row"+year)

const bar=document.createElement("div")
bar.className="timelineBar"

bar.style.left=((globalMonth%12)/12*100)+"%"
bar.style.width=(duration/12*100)+"%"

bar.innerText=plan.crop

row.appendChild(bar)

globalMonth+=duration

})

}

function buildCalendar(){

const list=document.getElementById("calendarList")

Object.keys(crops).forEach(name=>{

const item=document.createElement("div")

item.innerHTML=`${name} | ${crops[name].sow.join("-")} | ${crops[name].harvest.join("-")}`

list.appendChild(item)

})

}

window.onload=init
