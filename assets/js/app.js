function toggleWork(el){
el.classList.toggle("active")
}

function selectFert(el){

document.querySelectorAll(".fertBtn").forEach(btn=>{
btn.classList.remove("active")
})

el.classList.add("active")

}

function calc(){

let yieldHa=document.getElementById("crop").value
let size=document.getElementById("size").value
let price=document.getElementById("price").value

let fert=document.querySelector(".fertBtn.active").dataset.value

let bonus=1

if(document.getElementById("mulch").classList.contains("active")) bonus+=0.025
if(document.getElementById("roll").classList.contains("active")) bonus+=0.025
if(document.getElementById("lime").classList.contains("active")) bonus+=0.15
if(document.getElementById("weed").classList.contains("active")) bonus+=0.10
if(document.getElementById("pf").classList.contains("active")) bonus+=0.05

let totalYield=yieldHa*size*fert*bonus
let profit=(totalYield/1000)*price

document.getElementById("result").innerHTML =
"Ertrag: "+Math.round(totalYield)+" L<br>Gewinn: "+Math.round(profit)+" €"

}
