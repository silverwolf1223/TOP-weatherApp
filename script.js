const select = document.querySelector("select");
const searchbar = document.querySelector("#search");
const toggleSwitch = document.querySelector("#toggle");
const locationHeader = document.querySelector("#locationHeader");
const tableHours = document.querySelectorAll("#hours th");
const tableData = document.querySelectorAll("#hourlyData td");
const icon = document.querySelector("#icon");


let toCelcius = false;

let place = "Helotes, Texas";

let hourlyData = "hourTemp";

//display
const datas = ["Temp", "TempMax", "TempMin", "FeelsLike", "Humidity", "WindSpeed", "RainChance", "icon", "conditions"]

async function getWeather(place){
    try {
        const weather = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + place + "?key=36E856BDYTHQXCQ3T87HLYQNZ");
        const weatherData = await weather.json();

        updateHourly(weatherData.days[0]);
        updateDisplay(weatherData.days[0]);
    } catch (err) {
        console.log(err);
        searchbar.placeholder = "Not a Valid Location!!"
    }
}

function updateDisplay(wData){
    locationHeader.textContent = place;
    datas.forEach(data => {
        if(!document.querySelector(`#${data}`)){}
        else if(toCelcius && (data == "Temp" || data == "TempMax" || data == "TempMin" || data == "FeelsLike"))
        {
            document.querySelector(`#${data}`).textContent =  data + ": " + parseFloat(((dataSelection(data, wData) - 32) * (5/9)).toFixed(1)) + "°C";
        }
        else if(data == "Temp" || data == "TempMax" || data == "TempMin" || data == "FeelsLike")
        {
            document.querySelector(`#${data}`).textContent =  data + ": " + dataSelection(data, wData) + "°F";
        }
        else if(data == "RainChance" || data == "Humidity"){
            document.querySelector(`#${data}`).textContent =  data + ": " + dataSelection(data, wData) + "%";
        }
        else{
            document.querySelector(`#${data}`).textContent =  data + ": " + dataSelection(data, wData);
        }
    })

    icon.src = `./imgs/${wData.icon}.svg`
    
    hourlyDisplay(hourlyData);
}

function hourlyDisplay(displayType){

    times.forEach((time, index) => {
        if(time > 12){
            tableHours[index].textContent = time - 12 + "PM";
        }
        else{
            tableHours[index].textContent = time + "AM";
        }
    })

    switch(displayType){
        case "hourTemp":
            hourlyTemps.forEach((temp, index) => {
                if(!toCelcius){
                    tableData[index].textContent = temp + "°F";
                } else {
                    tableData[index].textContent = parseFloat(((temp - 32) * (5/9)).toFixed(1)) + "°C";
                }
            })
            break;
        case "hourPrecip":
            hourlyPrecips.forEach((precip, index) => {
                tableData[index].textContent = precip + "%";
            })
            break;
        case "hourWind":
            hourlyWind.forEach((wind, index) => {
                tableData[index].textContent = wind;
            })
            break;
    }
}

searchbar.addEventListener('keydown', (event) => {
    if(event.key == "Enter"){
        place = searchbar.value;
        getWeather(place);
        searchbar.value = "";
    }
});

toggleSwitch.addEventListener('input', () =>{
    if(toggleSwitch.checked){
        toCelcius = true;
    }
    else{
        toCelcius = false;
    }
    getWeather(place)
});


let hourlyTemps = [];
let hourlyPrecips = [];
let hourlyWind = [];
let times;

function updateHourly(data){
    const date = new Date();
    times = [date.getHours(), date.getHours() + 2, date.getHours() + 4, date.getHours() + 6, date.getHours() + 8];
    times = times.map((hour) => {
        if(hour > 24){
            return hour - 24;
        } else {
            return hour;
        }
    });

    times.forEach((hour, index) => {
        hourlyTemps[index] = data.hours[hour - 1].temp;
        hourlyPrecips[index] = data.hours[hour - 1].precipprob;
        hourlyWind[index] = data.hours[hour - 1].windspeed;
    })
}


if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        reverseGeocode(position.coords.latitude, position.coords.longitude);
    }, (err) => {console.log(err)
        place = "New York";
        getWeather(place);
    });
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

document.querySelector("#hourTemp").addEventListener('click', () => {
    hourlyData = "hourTemp";
    hourlyDisplay(hourlyData);
});

document.querySelector("#hourPrecip").addEventListener('click', () => {
    hourlyData = "hourPrecip";
    hourlyDisplay(hourlyData);
});

document.querySelector("#hourWind").addEventListener('click', () => {
    hourlyData = "hourWind";
    hourlyDisplay(hourlyData);
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