const search = document.getElementById('search')

search.addEventListener('click', () => {
    fetchData(generateURL())
})

function generateURL() {
   const cityName =  document.querySelector('input').value
    const mainURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&lang=ua&appid=9c85e50b4fadb5b89a848e81555b62dc`
    return mainURL
}

async function fetchData(url) {
    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log('data --->', data);
        

    } catch (error) {
        console.error(error);
    }
}

