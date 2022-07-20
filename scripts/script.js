let key = config.US_API_KEY;
let url = "https://api.covidactnow.org/v2/country/US.timeseries.json?apiKey=" + key;

const days = getDays();
let dates = [];
let countries = [];
let cases = [];
let deaths = [];

async function fetchData() {
    fetch(url)
    .then(res => res.json())
    .then(data => extractData(data));
}

/**
 * Extracts the data
 * @param {number} data to extract
 */
function extractData(data) {
    let offset = 1;
    for (let i = 0; i < 7; i++) {
        // GET TODAY'S DATA FIRST
        if (i === 0) {
            dates.push(data.lastUpdatedDate);
            countries.push(data.country);
            cases.push(data.actuals.newCases);
            deaths.push(data.actuals.newDeaths);
            continue;
        } else if (i === 1) {
            dates.push(data.actualsTimeseries[days].date);
            cases.push(data.actualsTimeseries[days].newCases);
            deaths.push(data.actualsTimeseries[days].newDeaths);
            continue;
        } else {
            dates.push(data.actualsTimeseries[days - offset].date);
            cases.push(data.actualsTimeseries[days - offset].newCases);
            deaths.push(data.actualsTimeseries[days - offset].newDeaths);
            offset++;
        }
    }
    // LOG OUR DATA ARRAYS
    console.log(dates);
    console.log(countries);
    console.log(cases);
    console.log(deaths);
}

/**
 * @returns days since the covid outbreak began in the United States
 */
function getDays() {
    const covidStartDate = new Date(2020,02,09);
    const now = new Date();
    const range = now - covidStartDate;
    return Math.floor((range / 86400000) - 1);
}

/**
 * Updates the table element with a specified number of generated rows with unique ids
 * @param {*} rows to be inserted into the table body
 */
function updateTable(rows) {
    const numberOfRows = rows;
    const table = document.querySelector('#table-body');

    // CREATE / ADD ROWS to TABLE BODY
    for (let index = 0; index < numberOfRows; index++) {
        table.appendChild(createRow(index));
    }

    const tableRows = Array.prototype.slice.call(table.children);

    tableRows.forEach(row => {
        const props = getProperties();
        const rowIndex = row.id.slice(4);
        for (let i = 0; i < props.length; i++) {
            const newCell = createDataCell(rowIndex, props[i]);
            if (props[i] === 'date') {
                newCell.innerHTML = 'June';
            } else if (props[i] === 'country') {
                newCell.innerHTML = 'US';
            } else if (props[i] === 'newCases') {
                newCell.innerHTML = '1000';
            } else if (props[i] === 'newDeaths') {
                newCell.innerHTML = '0';
            }
            row.appendChild(newCell);
        }
    });
}

function populateCells() {
    // for each row in table-body
    const table = document.querySelector('#table-body');
    // for each td in row
    const tableRows = Array.prototype.slice.call(table.children);
    // if td.id.slice row-#-date then innerHTML = record.lastUpdatedDate;
    // if td.id.slice row-#-country then innerHTML = record.country;
    // if td.id.slice row-#-newCases then innerHTML = record.actuals.newCases;
    // if td.id.slice row-#-newDeaths then innerHTML = record.actuals.newDeaths;
}

/**
 * Updates the day-counter element with the number of days since the beginning of Covid in the US
 */
function updateDayCounter() {
    document.querySelector('#day-counter').textContent = days;
}

/**
 * Creates a table row and gives it an appropriate id given a specific index
 * @param {*} index used for new row's id attribute
 * @returns a <tr> element with a unique id given an index argument
 */
function createRow(index) {
    const max = index;
    const newElement = document.createElement('tr');
    newElement.id = "row-" + index;
    return newElement;
}

/**
 * Creates data cells given an array of table data
 */
function createDataCell(index, propertyName) {
    const prop = propertyName;
    const i = index;
    const newElement = document.createElement('td');
    newElement.id = "row-" + i + "-" + prop;
    return newElement;
}

/**
 * @returns array of properties
 */
function getProperties() {
    const props = ['date', 'country', 'newCases', 'newDeaths'];
    return props;
}

fetchData()
.then(updateDayCounter)
.then(updateTable(7))

