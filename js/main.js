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
        // show5days(data)
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
    ul.innerHTML = ''
    const elements =`
        <div id="infoWeather">
            <li><img src=${img}></li>   
            <li><strong>Дата і час:</strong> ${dt_txt}</li>
            <li><strong>Температура:</strong> ${temp.toFixed(0)}°C</li>
            <li><strong>Мінімальна температура:</strong> ${temp.toFixed(0)}°C</li>
            <li><strong>Максимальна температува:</strong> ${temp.toFixed(0)}°C</li>
            <li><strong>Відчувається як:</strong> ${feels_like.toFixed(0)}°C</li>
            <li><strong>Вологість:</strong> ${humidity}%</li>
            <li><strong>Тиск:</strong> ${pressure} hPa</li>
            <li><strong>Видимість:</strong> ${visibility} м</li>
            <li><strong>Вітер:</strong> ${speed} м/с, <strong> Пориви:</strong> ${gust || '—'} м/с, <strong> Напрям:</strong> ${deg}°</li>
            <li><strong>Опис:</strong> ${description}</li>
        </div> 
    `
    ul.innerHTML = elements
}

// function show5days(data) {
//     const table = document.getElementById('weather5Days')
//     table.innerHTML = ''
//     data.list.forEach(el => {
//     const {dt_txt, main, visibility, weather, wind} = el
//     const {feels_like, grnd_level, humidity, pressure, sea_level,temp, temp_kf, temp_max, temp_min} = main
//     const {description, icon} = weather[0]
//     const {deg, gust, speed} = wind
//     const img = `https://openweathermap.org/img/wn/${icon}@2x.png`
//     const elements =`
//             <div id="infoWeather">
//             <td><img src=${img}></td>   
//             <td><strong>Дата і час:</strong> ${dt_txt}</td>
//             <td><strong>Температура:</strong> ${temp.toFixed(0)}°C</td>
//             <td><strong>Мінімальна температура:</strong> ${temp.toFixed(0)}°C</td>
//             <td><strong>Максимальна температува:</strong> ${temp.toFixed(0)}°C</td>
//             <td><strong>Відчувається як:</strong> ${feels_like.toFixed(0)}°C</td>
//             <td><strong>Вологість:</strong> ${humidity}%</td>
//             <td><strong>Тиск:</strong> ${pressure} hPa</td>
//             <td><strong>Видимість:</strong> ${visibility} м</td>
//             <td><strong>Вітер:</strong> ${speed} м/с, <strong> Пориви:</strong> ${gust || '—'} м/с, <strong> Напрям:</strong> ${deg}°</td>
//             <td><strong>Опис:</strong> ${description}</td>
//         </div> 
//     `
//     const tr = document.createElement('tr')
//     tr.innerHTML = elements
//     table.appendChild(tr)
//     });
// }

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
            const row = `
            <div id="info5Day">
                <td><img src=${img}></td>
                <td><strong>Дата</strong> ${data.split('-')[2]}</td>
                <td><strong>Мінімальна температура:</strong> ${day.min}°C</td>
                <td><strong>Максимальна температува:</strong> ${day.max}°C</td>
                <td><strong>Опис:</strong> ${day.description}</td>
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

