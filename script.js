const select = document.querySelector("select");
const searchbar = document.querySelector("#search");
const locationHeader = document.querySelector("#locationHeader");

let place = "Adams, Nebraska";

//display
const datas = ["Temp", "TempMax", "TempMin", "FeelsLike", "Humidity", "WindSpeed", "RainChance", "icon", "conditions"]

async function getWeather(place){
    try {
        const weather = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + place + "?key=36E856BDYTHQXCQ3T87HLYQNZ");
        const weatherData = await weather.json();
        updateDisplay(weatherData.days[0]);
    } catch (err) {
        console.log(err);
        searchbar.placeholder = "Not a Valid Location!!"
    }
}

function updateDisplay(wData){
    locationHeader.textContent = place;
    datas.forEach(data => {
        document.querySelector(`#${data}`).textContent =  data + ": " + dataSelection(data, wData);
    })
}

searchbar.addEventListener('keydown', (event) => {
    if(event.key == "Enter"){
        place = searchbar.value;
        getWeather(place);
        searchbar.value = "";
    }
});


if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        reverseGeocode(position.coords.latitude, position.coords.longitude);
    }, (err) => console.log(err));
} else {
    console.log("Geolocation is not supported by this browser.");
}

async function reverseGeocode(lat, lng){
    try {
        const geoDecoder = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=&key=AIzaSyCxROQLIro105JvccuS4yslrvH2kgxrOT0`);
        const geoLocation = await geoDecoder.json();
        place = geoLocation.results[0].formatted_address;
        await getWeather(place);
        locationHeader.textContent = "Your Location";

    } catch (err) {
        console.log(err);
    }
}





function dataSelection(dataType, wData){
    switch(dataType){
        case "Temp":
            return wData.temp;
            break;
        case "TempMax":
            return wData.tempmax;
            break;
        case "TempMin":
            return wData.tempmin;
            break;
        case "Humidity":
            return wData.humidity;
            break;
        case "FeelsLike":
            return wData.feelslike;
            break;
        case "conditions":
            return wData.conditions;
            break;
        case "WindSpeed":
            return wData.windspeed;
            break;
        case "RainChance":
            return wData.precipprob;
            break;
        case "icon":
            return wData.icon;
            break;
        default:
            return "not found"
    }
}