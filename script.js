const select = document.querySelector("select");
const searchbar = document.querySelector("#search");

let place = "Adams, Nebraska";

//display
const datas = ["Temp", "TempMax", "TempMin", "FeelsLike", "Humidity", "WindSpeed", "RainChance", "icon"]

getWeather(place);

async function getWeather(place){
    try {
        const weather = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + place + "?key=36E856BDYTHQXCQ3T87HLYQNZ");
        const weatherData = await weather.json();
        updateDisplay(weatherData.days[0]);
    } catch (err) {
        console.log(err);
    }
}

function updateDisplay(wData){
    const locationHeader = document.querySelector("#locationHeader");
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