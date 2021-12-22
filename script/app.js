
let getAPI = async (date) => {
	const url = `http://127.0.0.1:5000/api/v1/solarsystem/${date}`
	const response = await get(url)
	console.log(response)
	drawUniverse(response)
};

const listeners = function(){
	document.querySelectorAll(".js-planet").forEach(planet => {
		planet.addEventListener('click', () => {
			paragraph = planet.getElementsByTagName("p")[0]
			planetName = paragraph.innerHTML
			displayInfo(planetName)
		})
	});

	HTMLDateElement = document.querySelector('.js-date')
	HTMLDateElement.addEventListener('input', () =>{
		getAPI(HTMLDateElement.value)
		universalCollapse()
	});
}

const universalCollapse = function(){
	console.log("test")
	tl = gsap.timeline({repeat: 0,})
	tl.to(".js-space", {duration: 0.4, scale: 0, ease: "power3.out"})
	.to(".js-space", {duration: 0.4, scale: 1, ease: "power3.in"})
}


const displayInfo = async function(planet){
	url = `https://api.le-systeme-solaire.net/rest/bodies/${planet}`
	data = await get(url)
	// html elements
	HTMLname = document.querySelector(".js-planet-info__name")
	HTMLimage = document.querySelector(".js-planet-info__image")
	HTMLmoons = document.querySelector(".js-planet-info__moons")
	HTMLorbit = document.querySelector(".js-planet-info__orbit")
	HTMLtemp = document.querySelector(".js-planet-info__temp")
	

	//planet name
	HTMLname.innerHTML = planet

	//image
	path = `img/pictures/${planet.toLowerCase()}.png`
	console.log(path)
	HTMLimage.src = path

	//moon
	moonList = data["moons"]
	if(data["moons"] == null){
		HTMLmoons.innerHTML = 'this planet has no moons'
	}else{
		HTMLstring = ""
		if(moonList.length == 1){
			HTMLstring = `moon: ${moonList[0]["moon"]}`
		}else if(moonList.length > 5){
			HTMLstring = `moons: ${moonList.length}`
		}else{
			HTMLstring = "moons:"
			moonList.forEach(moon => {
				HTMLstring += `<p>${moon["moon"]}</p>`
			});
		}
		HTMLmoons.innerHTML = HTMLstring
	}

	//orbit
	orbitYears = Math.round((data["sideralOrbit"]/365)*100)/100
	HTMLorbit.innerHTML = `orbital period: ${data["sideralOrbit"]} earth days \n 
		or ${orbitYears} year${((orbitYears == 1) ? '' : 's')}`
	
	//temp
	HTMLtemp.innerHTML = `average temperature: ${data["avgTemp"]} K or ${Math.round(data["avgTemp"]-273.15)}°C`

}

const CalcPosition = function(deg, index){
	let radius = 6.25 * (index+1) /* 6.25 = 50 / 8 => 50 = 50%, 8 = aantal planeten*/
	deg+= 270
	rad = deg*(Math.PI/180)
	x = (Math.cos(rad) * radius) + 50 
	y = (Math.sin(rad) * radius) + 50
	return [x,y]
}

const drawUniverse = function(planets){
	counter = 0
	planets.forEach(element => {
		let degrees = element["degrees past perihelion"]
		let positions = CalcPosition(degrees, counter)
		let planet = element["name"]
		PlotOnWebsite(positions, planet)
		counter++
		
	});
}

const PlotOnWebsite = function(pos, name){
	// console.log(name)
	let planet = document.querySelector(`.js-planet-${name}`)
	offsetX = planet.getBoundingClientRect().width / 2;
	planet.style.left = `calc(${pos[0]}% - ${offsetX}px)`
	offsetY = 10
	if (window.matchMedia("(min-width: 1200px").matches){
		offsetY = 12;
	}
	planet.style.top = `calc(${pos[1]}% - ${offsetY}px)`
}

const get = (url) => fetch(url).then((r)=> r.json()).catch((error) => console.log(error))

const getToday = function(){
	today =  new Date()
	day = today.getDate()
	month = today.getMonth()
	year = today.getFullYear()
	return `${year}-${month+1}-${day}`
}

/*the design of the page that can't be done in css*/
const designPage = function(){
	/*sets the value of the input to the current day*/
	DateInput = document.querySelector('.js-date')
	DateInput.value = getToday()

	/*adjust the orbit positions according the distance form the sun*/
	const planetnames = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"]
	index=0
	planetnames.forEach(planet => {
		index++
		let orbit = document.querySelector(`.js-orbit-${planet}`)
		let radius = 6.25 * (index)
		orbit.style.top = `${50 - radius}%`
		orbit.style.left = `${50 - radius}%`
		orbit.style.width = `${radius*2}%`
		orbit.style.height = `${radius*2}%`
		
	});

}

document.addEventListener('DOMContentLoaded', function() {
	console.log("Content loaded")
	// 1 We will query the API with longitude and latitude.
	getAPI(getToday())
	designPage()
	listeners()
});


//animation
// tn = TweenMax.to(
// 	$(".js-planet-mercury"), 
// 	1, 
// 	{
// 		bezier:
// 		{
// 			curviness:1.5, 
// 			values:
// 				[{x: 50, y:100}, {x:0, y:200}, {x:-100, y:100}, {x:0, y:0}]
// 		}/*bezier end*/, 
// 		ease:Linear.easeNone, paused:true})
