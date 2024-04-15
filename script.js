const apiKey = "23ef1722dd6ffc1d3519f3ad20b81d9f";
let latitude;
let longitude;
let city = "Kyiv";
let isToday = true;

document.addEventListener("DOMContentLoaded", firstFunc);

async function firstFunc() {
  fiveDays.style.display = "none";
  today.style.display = "block";
  weatherTime.innerHTML = "";
  weatherImg.innerHTML = "";
  forecast.innerHTML = "";
  temp.innerHTML = "";
  wind.innerHTML = "";
  realFeelHourly.innerHTML = "";
  weatherDate.innerText = new Date().toDateString();

  getLatitudeAndLongitude(city).then(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    )
      .then((fetchResponse) => fetchResponse.json())
      .then((fetchRes) => {
        todayImg.src = `https://openweathermap.org/img/wn/${fetchRes.weather[0].icon}@4x.png`;
        todayIcon.innerText = fetchRes.weather[0].main;
        todayTemperature.innerText = `${Math.floor(fetchRes.main.temp)}ºC`;
        realFeel.innerText = `Real Feel ${Math.floor(
          fetchRes.main.feels_like
        )}ºC`;
        sunrise.innerText = formatTime(fetchRes.sys.sunrise * 1000);
        sunset.innerText = formatTime(fetchRes.sys.sunset * 1000);
        duration.innerText = getDuration(
          fetchRes.sys.sunrise * 1000,
          fetchRes.sys.sunset * 1000
        );
      })
      .then(getHourlyToday())
      .catch((error) => console.error(error));
  });
  await getNearbyPlacesWeather();
  isToday = true;
}

async function getNearbyPlacesWeather() {
  await getLatitudeAndLongitude("Chernihiv");
  let chernihivResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
  );
  let chernihivRes = await chernihivResponse.json();
  chernihivWeatherIcon.src = `https://openweathermap.org/img/wn/${chernihivRes.weather[0].icon}@4x.png`;
  chernihivTemp.innerText = `${Math.floor(chernihivRes.main.temp)}ºC`;

  await getLatitudeAndLongitude("Cherkasy");
  let cherkasyResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
  );
  let cherkasyRes = await cherkasyResponse.json();
  cherkasyWeatherIcon.src = `https://openweathermap.org/img/wn/${cherkasyRes.weather[0].icon}@4x.png`;
  cherkasyTemp.innerText = `${Math.floor(cherkasyRes.main.temp)}ºC`;

  await getLatitudeAndLongitude("Zhytomyr");
  let zhytomyrResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
  );
  let zhytomyrRes = await zhytomyrResponse.json();
  zhytomyrWeatherIcon.src = `https://openweathermap.org/img/wn/${zhytomyrRes.weather[0].icon}@4x.png`;
  zhytomyrTemp.innerText = `${Math.floor(zhytomyrRes.main.temp)}ºC`;

  await getLatitudeAndLongitude("Poltava");
  let poltavaResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
  );
  let poltavaRes = await poltavaResponse.json();
  poltavaWeatherIcon.src = `https://openweathermap.org/img/wn/${poltavaRes.weather[0].icon}@4x.png`;
  poltavaTemp.innerText = `${Math.floor(poltavaRes.main.temp)}ºC`;
}

async function getHourlyToday() {
  let day1 = new Date();
  let request = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
  );
  let response = await request.json();
  console.log(response);
  weatherTime.innerHTML = "";
  weatherImg.innerHTML = "";
  forecast.innerHTML = "";
  temp.innerHTML = "";
  wind.innerHTML = "";
  realFeelHourly.innerHTML = "";

  let day = document.createElement("th");
  day.innerText = "Today";
  weatherTime.appendChild(day);

  let emptyCell = document.createElement("td");
  weatherImg.appendChild(emptyCell);

  let forecastCell = document.createElement("td");
  forecastCell.innerText = "Forecast";
  forecast.appendChild(forecastCell);

  let tempCell = document.createElement("td");
  tempCell.innerText = "Temp(ºC)";
  temp.appendChild(tempCell);

  let realFeelCell = document.createElement("td");
  realFeelCell.innerText = "RealFeel";
  realFeelHourly.appendChild(realFeelCell);

  let windCell = document.createElement("td");
  windCell.innerText = "Wind";
  wind.appendChild(windCell);

  for (let i = 0; i < response.cnt; i++) {
    if (
      new Date(response.list[i].dt * 1000).getDate() === day1.getDate() &&
      new Date(response.list[i].dt * 1000).getMonth() === day1.getMonth() &&
      new Date(response.list[i].dt * 1000).getFullYear() === day1.getFullYear()
    ) {
      let header = document.createElement("th");
      header.innerText = formatTime(response.list[i].dt * 1000);

      weatherTime.appendChild(header);

      let iconRaw = document.createElement("td");
      let icon = document.createElement("img");
      icon.style.width = "80px";
      icon.src = `https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@4x.png`;
      iconRaw.appendChild(icon);
      weatherImg.appendChild(iconRaw);

      let forecastRaw = document.createElement("td");
      forecastRaw.innerText = `${response.list[i].weather[0].main}`;
      forecast.appendChild(forecastRaw);

      let tempRaw = document.createElement("td");
      tempRaw.innerText = `${Math.floor(response.list[i].main.temp)}º`;
      temp.appendChild(tempRaw);

      let realFeelRaw = document.createElement("td");
      realFeelRaw.innerText = `${Math.floor(
        response.list[i].main.feels_like
      )}º`;
      realFeelHourly.appendChild(realFeelRaw);

      let windRaw = document.createElement("td");
      windRaw.innerText = `${Math.floor(response.list[i].wind.speed)} ESE`;
      wind.appendChild(windRaw);
    }
  }
}

function formatTime(time) {
  const newTime = new Date(time);
  const hours = newTime.getHours();
  const minutes = newTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${formattedHours}:${formattedMinutes}${ampm}`;
}

function getDuration(sunriseT, sunsetT) {
  const sunriseTime = new Date(sunriseT);
  const sunsetTime = new Date(sunsetT);

  const timeDuration = sunsetTime - sunriseTime;

  const hoursDuration = Math.floor(timeDuration / (1000 * 60 * 60));
  const minutesDuration = Math.floor(
    (timeDuration % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `${hoursDuration}:${
    minutesDuration < 10 ? "0" : ""
  }${minutesDuration} hr`;
}

function getLatitudeAndLongitude(city) {
  return fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  )
    .then((fetchResponse) => fetchResponse.json())
    .then((fetchRes) => {
      latitude = fetchRes[0].lat;
      longitude = fetchRes[0].lon;
    });
}

async function searchWeather() {
  city = searchInput.value;
  if (isToday) {
    await firstFunc();
  } else {
    tonight.style.border = "";
    tonight.style.backgroundColor = `rgb(233, 233, 233)`;
    day2.style.border = "";
    day2.style.backgroundColor = `rgb(233, 233, 233)`;
    day3.style.border = "";
    day3.style.backgroundColor = `rgb(233, 233, 233)`;
    day4.style.border = "";
    day4.style.backgroundColor = `rgb(233, 233, 233)`;
    day5.style.border = "";
    day5.style.backgroundColor = `rgb(233, 233, 233)`;
    await getFiveDayForecast();
  }
}

async function getFiveDayForecast() {
  tonight.innerHTML = "";
  day2.innerHTML = "";
  day3.innerHTML = "";
  day4.innerHTML = "";
  day5.innerHTML = "";
  isToday = false;

  today.style.display = "none";
  fiveDays.style.display = "block";

  await getLatitudeAndLongitude(city);
  let requsest = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
  );
  let response = await requsest.json();
  console.log(response);
  console.log(new Date(response.list[0].dt * 1000).getDate());

  let day = new Date();
  console.log(day.toDateString());

  let headerToday = document.createElement("h2");
  headerToday.innerText = "TONIGHT";
  let spanDateToday = document.createElement("span");
  spanDateToday.innerText = new Date().toLocaleDateString();
  let iconToday = document.createElement("img");
  iconToday.src = `https://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@4x.png`;
  let spanTempToday = document.createElement("span");
  spanTempToday.innerText = `${Math.floor(response.list[0].main.temp)}ºC`;
  spanTempToday.style.fontSize = "25px";
  let spanWeatherToday = document.createElement("span");
  spanWeatherToday.innerText = `${response.list[0].weather[0].main}`;

  tonight.appendChild(headerToday);
  tonight.appendChild(spanDateToday);
  tonight.appendChild(iconToday);
  tonight.appendChild(spanTempToday);
  tonight.appendChild(spanWeatherToday);

  for (let i = 0; i < 4; i++) {
    let newDay = new Date();
    newDay.setDate(day.getDate() + (i + 1));
    let headerNewDay = document.createElement("h2");
    headerNewDay.innerText = getDayOfWeek(newDay);
    let spanDateNewDay = document.createElement("span");
    spanDateNewDay.innerText = newDay.toLocaleDateString();
    let iconNewDay = document.createElement("img");

    let dayIndex;
    response.list.find((item, index) => {
      if (
        new Date(item.dt * 1000).getDate() === newDay.getDate() &&
        new Date(item.dt * 1000).getMonth() === newDay.getMonth() &&
        new Date(item.dt * 1000).getFullYear() === newDay.getFullYear()
      ) {
        dayIndex = index;
        return true;
      }
    });
    iconNewDay.src = `https://openweathermap.org/img/wn/${response.list[dayIndex].weather[0].icon}@4x.png`;
    let spanTempNewDay = document.createElement("span");
    spanTempNewDay.innerText = `${Math.floor(
      response.list[dayIndex].main.temp
    )}ºC`;
    spanTempNewDay.style.fontSize = "25px";
    let spanWeatherNewDay = document.createElement("span");
    spanWeatherNewDay.innerText = `${response.list[dayIndex].weather[0].main}`;

    let newDayDiv = document.getElementById(`day${i + 2}`);
    newDayDiv.appendChild(headerNewDay);
    newDayDiv.appendChild(spanDateNewDay);
    newDayDiv.appendChild(iconNewDay);
    newDayDiv.appendChild(spanTempNewDay);
    newDayDiv.appendChild(spanWeatherNewDay);
  }
  await getHourlyFiveDays(new Date());
}

function getDayOfWeek(date) {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

async function getHourlyFiveDays(selectedDay) {
  let day1 = selectedDay;
  let request = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
  );
  let response = await request.json();
  console.log(response);
  weatherTimeFiveDays.innerHTML = "";
  weatherImgFiveDays.innerHTML = "";
  forecastFiveDays.innerHTML = "";
  tempFiveDays.innerHTML = "";
  windFiveDays.innerHTML = "";
  realFeelHourlyFive.innerHTML = "";

  let day = document.createElement("th");
  day.innerText = "Today";
  weatherTimeFiveDays.appendChild(day);

  let emptyCell = document.createElement("td");
  weatherImgFiveDays.appendChild(emptyCell);

  let forecastCell = document.createElement("td");
  forecastCell.innerText = "Forecast";
  forecastFiveDays.appendChild(forecastCell);

  let tempCell = document.createElement("td");
  tempCell.innerText = "Temp(ºC)";
  tempFiveDays.appendChild(tempCell);

  let realFeelCell = document.createElement("td");
  realFeelCell.innerText = "RealFeel";
  realFeelHourlyFive.appendChild(realFeelCell);

  let windCell = document.createElement("td");
  windCell.innerText = "Wind";
  windFiveDays.appendChild(windCell);

  for (let i = 0; i < response.cnt; i++) {
    if (
      new Date(response.list[i].dt * 1000).getDate() === day1.getDate() &&
      new Date(response.list[i].dt * 1000).getMonth() === day1.getMonth() &&
      new Date(response.list[i].dt * 1000).getFullYear() === day1.getFullYear()
    ) {
      let header = document.createElement("th");
      header.innerText = formatTime(response.list[i].dt * 1000);

      weatherTimeFiveDays.appendChild(header);

      let iconRaw = document.createElement("td");
      let icon = document.createElement("img");
      icon.style.width = "80px";
      icon.src = `https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@4x.png`;
      iconRaw.appendChild(icon);
      weatherImgFiveDays.appendChild(iconRaw);

      let forecastRaw = document.createElement("td");
      forecastRaw.innerText = `${response.list[i].weather[0].main}`;
      forecastFiveDays.appendChild(forecastRaw);

      let tempRaw = document.createElement("td");
      tempRaw.innerText = `${Math.floor(response.list[i].main.temp)}º`;
      tempFiveDays.appendChild(tempRaw);

      let realFeelRaw = document.createElement("td");
      realFeelRaw.innerText = `${Math.floor(
        response.list[i].main.feels_like
      )}º`;
      realFeelHourlyFive.appendChild(realFeelRaw);

      let windRaw = document.createElement("td");
      windRaw.innerText = `${Math.floor(response.list[i].wind.speed)} ESE`;
      windFiveDays.appendChild(windRaw);
    }
  }
}
async function getHourlySelectedDay(dayIndex) {
  let selectedDay = document.getElementById(`day${dayIndex}`);
  if (dayIndex == 1) selectedDay = document.getElementById("tonight");
  selectedDay.style.border = "1px solid black";
  selectedDay.style.backgroundColor = "white";
  for (let i = 0; i < 5; i++) {
    if (tonight != selectedDay) {
      tonight.style.border = "";
      tonight.style.backgroundColor = `rgb(233, 233, 233)`;
    }
    if (day2 != selectedDay) {
      day2.style.border = "";
      day2.style.backgroundColor = `rgb(233, 233, 233)`;
    }
    if (day3 != selectedDay) {
      day3.style.border = "";
      day3.style.backgroundColor = `rgb(233, 233, 233)`;
    }
    if (day4 != selectedDay) {
      day4.style.border = "";
      day4.style.backgroundColor = `rgb(233, 233, 233)`;
    }
    if (day5 != selectedDay) {
      day5.style.border = "";
      day5.style.backgroundColor = `rgb(233, 233, 233)`;
    }
  }

  let todayD = new Date();
  let currentDay = new Date(todayD);
  currentDay.setDate(todayD.getDate() + dayIndex - 1);
  await getHourlyFiveDays(currentDay);
}
