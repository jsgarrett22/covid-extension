let key = config.US_API_KEY;
let url = "https://api.covidactnow.org/v2/country/US.timeseries.json?apiKey=" + key;

const dates = [];
const countries = [];
const cases = [];
const deaths = [];

async function fetchData() {
    const res = await fetch(url);
    if (res.status != 200) {
        console.log("An error occurred with the response.");
    } else {
        const record = await res.json();
        console.log(record.lastUpdatedDate);
        /*
        for (let index = 0; index < 7; index++) {
            console.log(record.actualsTimeseries[index].date);
        }
        document.querySelector('#date').innerHTML = record.lastUpdatedDate;
        document.querySelector('#country').innerHTML = record.country;
        document.querySelector('#newCases').innerHTML = record.actuals.newCases;
        document.querySelector('#newDeaths').innerHTML = record.actuals.newDeaths;

        document.querySelector('#date1').innerHTML = record.actualsTimeseries[857].date;
        document.querySelector('#country1').innerHTML = record.country;
        if (record.actualsTimeseries[857].newCases === null) {
            document.querySelector('#newCases1').innerHTML = record.actuals.newCases;
        } else {
            document.querySelector('#newCases1').innerHTML = record.actualsTimeseries[857].newCases;
        }
        if (record.actualsTimeseries[857].newDeaths === null) {
            document.querySelector('#newDeaths1').innerHTML = record.actuals.newDeaths;
        } else {
            document.querySelector('#newDeaths1').innerHTML = record.actualsTimeseries[857].newDeaths;
        } */
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
 * @param {*} rows 
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

function updateDayCounter() {
    const counter = document.querySelector('#day-counter');
    counter.textContent = getDays();
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

fetchData();

updateDayCounter();

updateTable(7);