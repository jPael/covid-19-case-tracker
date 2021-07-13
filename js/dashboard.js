window.onload = () => {
    setup();
};

async function setup() {
    const types = ["Confirmed", "Active", "Deaths", "Recovered"];

    const totalCasesCanvas = document.getElementById("totalCasesChart");
    const totalActiveCasesCanvas = document.getElementById(
        "totalActiveCasesChart"
    );
    const totalDeathCanvas = document.getElementById("totalDeathChart");
    const totalRecoveryCanvas = document.getElementById("totalRecoveryChart");
    const charts = [
        totalCasesCanvas,
        totalActiveCasesCanvas,
        totalDeathCanvas,
        totalRecoveryCanvas,
    ];

    const totalConfirmedCasesLabel =
        document.getElementById("confirmedCaseCount");
    const totalActiveCasesLabel = document.getElementById("activeCaseCount");
    const totalDeathCasesLabel = document.getElementById("deathCaseCount");
    const totalRecoveryCasesLabel =
        document.getElementById("recoveryCaseCount");
    const labels = [
        totalConfirmedCasesLabel,
        totalActiveCasesLabel,
        totalDeathCasesLabel,
        totalRecoveryCasesLabel,
    ];

    const addedConfirmedValuesLabel =
        document.getElementById("addedConfirmedCase");
    const addedActiveValuesLabel = document.getElementById("addedActiveCase");
    const addedDeathValuesLabel = document.getElementById("addedDeathCase");
    const addedRecoveryValuesLabel =
        document.getElementById("addedRecoveryCase");

    const addedValuesLabel = [
        addedConfirmedValuesLabel,
        addedActiveValuesLabel,
        addedDeathValuesLabel,
        addedRecoveryValuesLabel,
    ];

    const confirmedPrevDatesLabel = document.getElementById(
        "confirmedCasePrevDate"
    );
    const activePrevDatesLabel = document.getElementById("activeCasePrevDate");
    const deathPrevDatesLabel = document.getElementById("deathCasePrevDate");
    const recoveryPrevDatesLabel = document.getElementById(
        "recoveryCasePrevDate"
    );
    const prevDatesLabel = [
        confirmedPrevDatesLabel,
        activePrevDatesLabel,
        deathPrevDatesLabel,
        recoveryPrevDatesLabel,
    ];

    const loadingScreens = document.getElementsByClassName("show");

    const data = await getCovidData();

    const dateString = getProperDate(data, "today");

    document.getElementById("latestRecordDateLabel").innerText = dateString;

    const selectMode = document.getElementById("mode");
    const selectMonth = document.getElementById("monthLists");
    const selectContainer = document.getElementById("showHide");

    selectContainer.setAttribute("class", "hideMe");
    selectContainer.classList.add("col-auto");

    selectMode.addEventListener("change", () => {
        const mode = selectMode.value;
        if (mode == "Months") {
            selectContainer.setAttribute("class", "hideMe");
            selectContainer.classList.add("col-auto");

            chartPreReq(
                "monthly",
                data,
                charts,
                types,
                labels,
                loadingScreens,
                addedValuesLabel,
                prevDatesLabel
            );
        } else {
            selectContainer.setAttribute("class", "showMe");
            selectContainer.classList.add("col-auto");
        }
    });

    showMonthLists(dateString, getProperDate(data, "month"), selectMonth);

    selectMonth.addEventListener("change", () => {
        refreshData(
            selectMonth.value,
            data,
            charts,
            types,
            labels,
            loadingScreens,
            addedValuesLabel,
            prevDatesLabel
        );
    });

    chartPreReq(
        "monthly",
        data,
        charts,
        types,
        labels,
        loadingScreens,
        addedValuesLabel,
        prevDatesLabel
    );
}

function getProperDate(date, type) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    if (type == "today") {
        const currDate = date[date.length - 1].Date;
        var rawDate = currDate.split("-");
        // var day = RAWdate[2].split("T");
        var dateString = ` ${months[rawDate[1] - 1]} ${rawDate[0]}`;
        return dateString;
    }
    if (type == "monthYear") {
        const currDate = date;
        var rawDate = currDate.split("-");
        // var day = RAWdate[2].split("T");
        var dateString = `${months[rawDate[1] - 1]} ${rawDate[0]}`;
        return dateString;
    }
    let current;
    let monthYear_lists = [];
    if (type == "month") {
        date.forEach((e) => {
            const currDate = e.Date;
            const rawDate = currDate.split("-");
            const dateString = `${months[rawDate[1] - 1]} ${rawDate[0]}`;
            if (dateString != current) {
                monthYear_lists.push(dateString);
                current = `${months[rawDate[1] - 1]} ${rawDate[0]}`;
            }
        });
        return monthYear_lists;
    }
}

async function getCovidData() {
    const API_URL = "https://api.covid19api.com/country/philippines";
    // const API_URL = "js/temporary.json";
    const attributes = {
        method: "GET",
        redirect: "follow",
    };

    const response = await fetch(API_URL, attributes);
    const datas = await response.json();
    return datas;
}

function getYear(datas, type) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    if (type === "monthly") {
        let date = [];
        let current = "";
        datas.forEach((item) => {
            const rawDate = item.Date.split("-");

            const monthYear_STRING = `${months[parseInt(rawDate[1] - 1, 10)]} ${
                rawDate[0]
            }`;

            if (monthYear_STRING != current) {
                date.push(monthYear_STRING);
                current = monthYear_STRING;
            }
        });
        return date;
    }
    if (type === "daily") {
        let date = [];
        datas.forEach((e) => {
            const rawDate = e.Date.split("-");
            const month = months[rawDate[1] - 1];
            const day = rawDate[2].split("T");
            const dateString = `${day[0]} ${month} ${rawDate[0]}`;

            date.push(dateString);
        });
        console.log(date);
        return date;
    }
}

function getCaseCount(mode, datas, type) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    if (mode === "monthly") {
        let casesPerMonth = [];
        let count = 0;
        let current = "";
        datas.forEach((item) => {
            const rawDate = item.Date.split("-");
            const monthYear_STRING = `${months[parseInt(rawDate[1] - 1, 10)]} ${
                rawDate[0]
            }`;

            if (current == "") {
                const cases = item[type];
                count = cases;
                current = monthYear_STRING;
            } else {
                if (current == monthYear_STRING) {
                    const cases = item[type];
                    count = cases;
                } else {
                    casesPerMonth.push(count);
                    const cases = item[type];
                    count = cases;
                    current = monthYear_STRING;
                }
            }
        });
        casesPerMonth.push(count);
        // console.log(datas);
        // console.log(casesPerMonth);
        return casesPerMonth;
    }

    if (mode === "daily") {
        let cases = [];
        datas.forEach((e) => {
            cases.push(e[type]);
        });
        return cases;
    }
}

function getFormattedNumber(number) {
    var str = number.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}
function showMonthLists(date, month, selectMonth) {
    // const dateArr = date.split(" ");
    // console.log(`${date} ${month}`);
    month.forEach((e) => {
        if (date != ` ${e}`) {
            var option = document.createElement("option");
            option.text = e;
            selectMonth.appendChild(option);
        } else {
            var option = document.createElement("option");
            const selected = document.createAttribute("selected");
            option.text = e;
            option.setAttributeNode(selected);
            selectMonth.appendChild(option);
        }
    });
}
function refreshData(
    value,
    data,
    charts,
    types,
    labels,
    loadingScreens,
    addedValuesLabel,
    prevDatesLabel
) {
    const cases = [];

    data.forEach((e) => {
        const monthYear = getProperDate(e.Date, "monthYear");
        if (value == monthYear) {
            cases.push(e);
        }
    });

    chartPreReq(
        "daily",
        cases,
        charts,
        types,
        labels,
        loadingScreens,
        addedValuesLabel,
        prevDatesLabel
    );
}
