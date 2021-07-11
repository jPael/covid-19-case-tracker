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

function displayWindowSize() {
    // Get width and height of the window excluding scrollbars
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;

    // Display result inside a div element
    document.getElementById("result").innerHTML =
        "Width: " + w + ", " + "Height: " + h;
}
