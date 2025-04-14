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
        showInfo5days(data)

    } catch (error) {
        console.error(error);
    }
}


function showInfo5days(data) {
    const table = document.getElementById('weather5Days')
    table.innerHTML = ''

    const city = data.city.name
    const cityHeader = document.querySelector('header h1')
    cityHeader.textContent = `Погода у місті ${city}`

    const dailyData = {}

    data.list.forEach(el => {
        const dateKey = el.dt_txt.split(' ')[0]
        const tempMin = Number(el.main.temp_min.toFixed(0))
        const tempMax = Number(el.main.temp_max.toFixed(0))

        if (!dailyData[dateKey]) {
            dailyData[dateKey] = {
                min: tempMin,
                max: tempMax,
                icon: el.weather[0].icon,
                description: el.weather[0].description
            }
        } else {
            dailyData[dateKey].min = Math.min(dailyData[dateKey].min, tempMin)
            dailyData[dateKey].max = Math.max(dailyData[dateKey].max, tempMax)
        }
    })

    for (const dateKey in dailyData) {
        const day = dailyData[dateKey]

        // const img = `https://openweathermap.org/img/wn/${day.icon}@2x.png`
        const img = getCustomIconById(day.icon)


        const date = new Date(`${dateKey}`)
        const dayName = date.toLocaleString('uk-UA', {weekday: 'long'})
        const formattedDate = date.toLocaleString('uk-UA', {day: '2-digit', month: 'numeric'})

        const row = `
            <div class="day" data-date="${dateKey}">
                <p><strong>${dayName}</strong></p>
                <p><strong>${formattedDate}</strong></p>
                <p><img src="${img}" alt="${day.description}"></p>
                <p><strong>${day.description}</strong></p>
                <p>🌡 ${day.min}°C – ${day.max}°C</p>
            </div>
        `
        table.innerHTML += row
    }

    document.querySelectorAll('.day').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
            document.querySelectorAll('.day').forEach(el => el.classList.remove('selected-day'))
            dayEl.classList.add('selected-day')
            const selectedDate = dayEl.getAttribute('data-date')
            console.log('Натиснуто на дату:', selectedDate)
            showInfo3Hours(data, selectedDate)
        })
    })
}

function showInfo3Hours(data, selectedDate) {
    const container = document.getElementById('weather3Hours')
    container.innerHTML = ''

    const filtered = data.list.filter(item => item.dt_txt.startsWith(selectedDate))

    filtered.forEach(item => {
        const date = new Date(item.dt_txt)
        const time = date.toLocaleTimeString('uk-UA', {hour: '2-digit', minute: '2-digit'})

        const { temp, temp_min, temp_max, feels_like, humidity } = item.main
        const { icon, description } = item.weather[0]
        const { speed } = item.wind

        //const img = `https://openweathermap.org/img/wn/${icon}@2x.png`
        const img = getCustomIconById(icon)

        const block = `
            <div class="weatherBlock">
                <p><strong>${time}</strong></p>
                <img src="${img}" alt="${description}">
                <p><strong>${description}</strong></p>
                <p>🌡 ${temp.toFixed(0)}°C</p>
                <p>⬇ Мін: ${temp_min.toFixed(0)}°C <br> ⬆ Макс: ${temp_max.toFixed(0)}°C</p>
                <p>🤔 Відчувається як: ${feels_like.toFixed(0)}°C</p>
                <p>💧 ${humidity}%</p>
                <p>💨 ${speed} м/с</p>
            </div>
        `
        container.innerHTML += block
    })
}

function getCustomIconById(iconCode) {
    const map = {
        '01d': 'img/sun.png',
        '01n': 'img/sun.png',
        '02d': 'img/cloudy.png',
        '02n': 'img/cloudy.png',
        '03d': 'img/cloudy.png',
        '03n': 'img/cloudy.png',
        '04d': 'img/cloudy.png',
        '04n': 'img/cloudy.png',
        '09d': 'img/rain.png',
        '09n': 'img/rain.png',
        '10d': 'img/rain.png',
        '10n': 'img/rain.png',
        '11d': 'img/thunderstorm.png',
        '11n': 'img/thunderstorm.png',
        '13d': 'img/snow.png',
        '13n': 'img/snow.png',
        '50d': 'img/mist.png',
        '50n': 'img/mist.png',
    }

    return map[iconCode] || `https://openweathermap.org/img/wn/${iconCode}@2x.png`
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

