let key = config.US_API_KEY;
let url = "https://api.covidactnow.org/v2/country/US.timeseries.json?apiKey=" + key;

const daysToGenerate = 7;
const days = getDays();
let dates = [];
let country = null;
let cases = [];
let deaths = [];
async function fetchData(days) {
    fetch(url)
    .then(res => res.json())
    .then(data => extractData(data, days))
    .then(populateCells);
}

/**
 * Extracts the data for the amount of days passed in
 * @param {number} data to extract
 */
function extractData(data, daysToGenerate) {
    let offset = 1;
    for (let i = 0; i < daysToGenerate; i++) {
        // GET TODAY'S DATA FIRST
        if (i === 0) {
            dates.push(data.lastUpdatedDate);
            country = data.country;
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
    // grab the tbody
    const table = document.querySelector('#table-body');
    // grab each row
    const rows = Array.prototype.slice.call(table.children);

    // for every row, and for every td in that row, change its innerHTML according to its ID
    Array.from(rows).forEach((row, index) => {
        const cells = Array.prototype.slice.call(row.children);
        Array.from(cells).forEach(cell => {
            if (cell.id === 'row-' + index + '-date') {
                cell.innerHTML = dates[index];
            } else if (cell.id === 'row-' + index + '-country'){
                cell.innerHTML = country;
            } else if (cell.id === 'row-' + index + '-newCases') {
                cell.innerHTML = cases[index];
            } else if (cell.id === 'row-' + index + '-newDeaths') {
                cell.innerHTML = deaths[index];
            }
        });
    });
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

// START
fetchData(daysToGenerate)
.then(updateDayCounter)
.then(updateTable(daysToGenerate));