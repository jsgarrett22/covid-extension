// api key 2a6b425b45eb4e788c7a9d60eac08669

let key = config.US_API_KEY;
let url = "https://api.covidactnow.org/v2/country/US.json?apiKey=" + key;

async function fetchData() {
    const res = await fetch(url);
    if (res.status != 200) {
        console.log("An error occurred with the response.");
    } else {
        const record = await res.json();
        document.querySelector('#date').innerHTML = record.lastUpdatedDate;
        document.querySelector('#state').innerHTML = record.country;
        document.querySelector('#newCases').innerHTML = record.actuals.newCases;
        document.querySelector('#newDeaths').innerHTML = record.actuals.newDeaths;
    }
}

fetchData();