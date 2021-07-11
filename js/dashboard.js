window.onload = () => {
    setup();
};
async function setup() {
    const type = ["Confirmed", "Active", "Deaths", "Recovered"];

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

    const date = data[data.length - 1].Date;

    const dateString = getProperDate(date);

    document.getElementById("latestRecordDateLabel").innerText = dateString;

    for (let i = 0; i < charts.length; i++) {
        createChart(
            data,
            charts[i],
            type[i],
            labels[i],
            loadingScreens[0],
            addedValuesLabel[i],
            prevDatesLabel[i]
        );
    }
}

function getProperDate(date) {
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

    var RAWdate = date.split("-");
    // var day = RAWdate[2].split("T");
    var dateString = ` ${months[RAWdate[1] - 1]} ${RAWdate[0]}`;
    return dateString;
}

async function getCovidData() {
    const API_URL = "https://api.covid19api.com/country/philippines";
    const attributes = {
        method: "GET",
        redirect: "follow",
    };

    const response = await fetch(API_URL, attributes);
    const datas = await response.json();
    return datas;
}

function createChart(
    datas,
    canvas,
    type,
    labels,
    loadingScreen,
    addedValuesLabel,
    addedPrevDatesLabel
) {
    const date = getYear(datas);
    const caseCount = getCaseCount(datas, type);

    if (labels) {
        const labelsValue = getFormattedNumber(caseCount[caseCount.length - 1]);
        labels.innerText = labelsValue;
    }
    if (addedValuesLabel) {
        const addedLabel = getFormattedNumber(
            caseCount[caseCount.length - 1] - caseCount[caseCount.length - 2]
        );
        addedValuesLabel.innerText = "+" + addedLabel;
    }

    if (addedPrevDatesLabel != undefined) {
        addedPrevDatesLabel.innerText = date[date.length - 2];
    }
    // console.log(caseCount);
    var myChart = new Chart(canvas, {
        type: "line",
        data: {
            labels: date,
            datasets: [
                {
                    label: "Cases",
                    data: caseCount,
                    lineTension: 0,
                    fill: true,
                    backgroundColor: "#58aeff8e",
                    pointRadius: 5,
                    borderColor: "#001eff",
                    borderWidth: 4,
                    pointBackgroundColor: "#001eff",
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: false,
                        },
                    },
                ],
            },
            legend: {
                display: true,
            },
        },
    });

    if (loadingScreen) {
        loadingScreen.setAttribute("class", "hide");
        setTimeout(() => {
            loadingScreen.setAttribute("class", "remove");
        }, 300);
    }
}

function getYear(datas) {
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

function getCaseCount(datas, type) {
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

function getFormattedNumber(number) {
    var str = number.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}
