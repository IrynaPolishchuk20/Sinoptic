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
        // showInfo5days(data)

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

// function showInfo5days(data) {
//     const table = document.getElementById('weather5Days')
//     data.list.forEach(el => {
//     const {dt_txt, main, visibility, weather, wind} = el
//     const {feels_like, grnd_level, humidity, pressure, sea_level,temp, temp_kf, temp_max, temp_min} = main
//     const {description, icon} = weather[0]
//     const {deg, gust, speed} = wind
//     const img = `https://openweathermap.org/img/wn/${icon}@2x.png`
//     const elements =`
//     <td>dt_txt:${dt_txt}</td>
//     <td>visibility:${visibility}</td>
//     <td>feels_like:${feels_like}</td>
//     <td>grnd_level:${grnd_level}</td>
//     <td>humidity:${humidity}</td>
//     <td>pressure:${pressure}</td>
//     <td>sea_level:${sea_level}</td>
//     <td>temp:${temp}</td>
//     <td>temp_kf:${temp_kf}</td>
//     <td>temp_max:${temp_max}</td>
//     <td>temp_min:${temp_min}</td>
//     <td>description:${description}</td>
//     <td><img src=${img}></td>
//     <td>deg:${deg}</td>
//     <td>gust:${gust}</td>
//     <td>speed:${speed}</td>
//     `
//     const tr = document.createElement('tr')
//     tr.innerHTML = elements
//     table.appendChild(tr)
//     });

// }