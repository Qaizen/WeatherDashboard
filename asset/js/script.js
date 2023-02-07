var cityForm = document.querySelector("#city-form");
var cityNameInput = document.querySelector("#city-name");       //form input
var cityContainer = document.querySelector("#city-container");
var dataSearchTerm = document.querySelector("#data-search-term"); //City: results

let city = document.getElementById('city-name').value;


//Get date only for javaScript
const date = new Date();
const month = date.getMonth()+1;
const day = date.getDate();
const year = date.getFullYear();
const fullYear = " " + "(" + month + "/" + day + "/" + year + ")";
console.log(fullYear);

var searchHistoryList = [];

//create handler to execute form upon submission
var formSubmitHandler = function(event) {
    event.preventDefault();

    domload();
    
    var cityName = cityNameInput.value.trim();
    if (cityName) {
        getCityData(cityName);
        cityNameInput.value = "";
    } else {
        alert("Please enter a city.");
    };

    if (!searchHistoryList.includes(cityName)) {
        searchHistoryList.push(cityName);
    };

    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
};


var getCityData = function(city) {
    // format the openweathermap api url
    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`;

    //make a request to the url for the lat/lon
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                const { lat, lon, name } = data[0];
                //  console.log(data[0]);  
                 
                     dataSearchTerm.innerHTML = `<h2 class="city-title">${name + fullYear}</h2>`;
  
                //make a 2nd url request for the weather data
                var apiUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${api_key}`;  
                
                fetch(apiUrl2).then(function(response){
                    response.json().then(function(data) {
                        // console.log(data);
                        displayData(data);  

                        for (i = 1; i <= 5; i++) {
                            var weatherData = {
                                temp:  data.daily[i].temp.day,
                                wind:  data.daily[i].wind_speed,
                                humidity: data.daily[i].humidity,
                                date: data.daily[i].dt,
                                icon: data.current.weather[0].icon
                            };
                            
                            var currentDate = moment.unix(weatherData.date).format("MM/DD/YYYY");
                            // console.log(currentDate);

                            document.getElementById("forecastDate"+ i).innerHTML = `<div>${currentDate}</div>`
                            
                            document.getElementById("card-date-" + i).innerHTML =
                                            `<div class="forecast">
                                                <div class="w-icon"><img src="https://openweathermap.org/img/w/${weatherData.icon}.png"></div>
                                                <div>Temp:   ${weatherData.temp}°F</div>
                                                <div>Wind:   ${weatherData.wind} MPH</div>
                                                <div>Humidity:   ${weatherData.humidity}%</div> 
                                            </div>`  
                        }
                    }); 
                });
            })
        } else {
            alert("Error");
        }
    }) 
}

// Show weather data
var displayData = function(data) {

    const { temp, wind_speed, humidity, uvi } = data.current;   
    const { icon } = data.current.weather[0]; 

    var colorBlock = ""
        if (uvi > 7) {
            colorBlock = "severe";
        } else if (uvi > 4 && uvi < 7) {
            colorBlock = "moderate";
        } else if (uvi < 4) {
            colorBlock = "favorable";
        }

    cityContainer.innerHTML = 
        `<div class="weatherInfo">
            <div class="w-icon"><img src="https://openweathermap.org/img/w/${icon}.png"></div>
            <div class="weatherInfo">
            <div>Temp:   ${temp}°F</div>
            <div>Wind:   ${wind_speed} MPH</div>
            <div>Humidity:   ${humidity}%</div>
            <div class="color ${colorBlock}">UV Index:   ${uvi}</div>
        </div>`;

}


// call the function
cityForm.addEventListener("submit", formSubmitHandler);


document.querySelector("#history-0").addEventListener("click", (event) => {
    console.log("button 1 clicked");
    var cityList = document.getElementById("history-0").innerHTML;
    console.log(cityList);
    getCityData(cityList);
})


function domload() { 

    var searchHistoryArray = JSON.parse(localStorage.getItem("city"));
    console.log("inside dom array " + searchHistoryArray);
    console.log(searchHistoryArray);

        var cityHistory = document.getElementById("history-0");
        
        if (!searchHistoryArray ) {
            console.log("inside if statement");
            cityHistory.value.innerText = "";
        } else {
            cityHistory.innerText = `${searchHistoryArray[0]}`;
            console.log(`${searchHistoryArray[0]}`); 
        }
};

domload();