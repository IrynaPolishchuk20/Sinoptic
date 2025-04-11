const search = document.getElementById('search')

window.addEventListener('keypress', e => {if(e.key === 'Enter')fetchData(generateURL())})
search.addEventListener('click', () => {fetchData(generateURL())})

function generateURL() {
    const cityName =  document.querySelector('input').value
    const mainURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&lang=ua&appid=9c85e50b4fadb5b89a848e81555b62dc`
    return mainURL
}

async function fetchData(url) {
    try {
        const response = await fetch(url)
        const data = await response.json()
        if(data.cod === '404'){
            console.log(data.message);
            return
        }
        console.log(data);
        showInfo(data)
        showInfo5days(data)

    } catch (error) {
        console.error(error);
    }
}

function showInfo(data) {
    const all = data.list[0]
    const {dt_txt, main, visibility, weather, wind} = all
    const {feels_like, grnd_level, humidity, pressure, sea_level,temp, temp_kf, temp_max, temp_min} = main
    const {description, icon} = weather[0]
    const {deg, gust, speed} = wind
    const img = `https://openweathermap.org/img/wn/${icon}@2x.png`
    const ul = document.getElementById('weatherNaw')

    const date = new Date(dt_txt)
    const dayName = date.toLocaleString('uk-UA', {weekday: 'long'})
    const formattedDate = date.toLocaleString('uk-UA', {day: '2-digit', month: 'numeric'})
    const tempMin = temp_min.toFixed(0)
    const tempMax = temp_max.toFixed(0)


    ul.innerHTML = ''
    const elements =`
        <div id="infoWeather">
            <li><strong> ${dayName}</strong></li>
            <li><strong>${formattedDate}</strong></li>
            <li><img src=${img}></li>   
            <li><strong>Температура:</strong> ${temp.toFixed(0)}°C</li>
            <li><strong>Мінімальна температура:</strong> ${tempMin}°C</li>
            <li><strong>Максимальна температува:</strong> ${tempMax}°C</li>
            <li><strong>Відчувається як:</strong> ${feels_like.toFixed(0)}°C</li>
            <li><strong>Вологість:</strong> ${humidity}%</li>
            <li><strong>Тиск:</strong> ${pressure} hPa</li>
            <li><strong>Вітер:</strong> ${speed} м/с, <strong> Пориви:</strong> ${gust || '—'} м/с</li>
            <li><strong>${description}</strong> </li>
        </div> 
    `
    ul.innerHTML = elements
}

function showInfo5days(data) {
    const table = document.getElementById('weather5Days')
    table.innerHTML = ''

    const dailyData ={}

    data.list.forEach(el => {
        const data = el.dt_txt.split(' ')[0]
        const tempMin = (el.main.temp_min).toFixed(0)
        const tempMax = (el.main.temp_max).toFixed(0)

        if(!dailyData[data]){
            dailyData[data]={
                min: tempMin,
                max: tempMax,
                icon: el.weather[0].icon,
                description: el.weather[0].description
            }
        }else{
                dailyData[data].min = (dailyData[data], tempMin)
                dailyData[data].max = (dailyData[data], tempMax)

            }
        
        })

        for(const data in dailyData){

            const day = dailyData[data]
            const img = `https://openweathermap.org/img/wn/${day.icon}@2x.png`

            const date = new Date(`${data}T12:00:00`)
            const dayName = date.toLocaleString('uk-UA', {weekday: 'long'})
            const formattedDate = date.toLocaleString('uk-UA', {day: '2-digit', month: 'numeric'})

            const row = `
            <div id="info5Day">
                <p><strong> ${dayName}</strong></з>   
                <p><strong>${formattedDate}</strong></з>  
                <p><img src=${img}></p>
                <p><strong>Дата</strong> ${data.split('-')[2]}</p
                <p><strong>Температура:</strong> ${day.min}°C – ${day.max}°C</p>
                <p><strong>${day.description}</strong> </p>
            </div>
            `
            table.innerHTML += row
        }
}

document.getElementById('locationBtn').addEventListener('click', weatherByLocation)

function weatherByLocation() {
    if ('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const url = URLByLocation(lat, lon)
        
        fetchData(url)


        console.log('lat:', position.coords.latitude);
        console.log('lon:', position.coords.longitude);
    })
}
}

function URLByLocation(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ua&appid=9c85e50b4fadb5b89a848e81555b62dc`
}

