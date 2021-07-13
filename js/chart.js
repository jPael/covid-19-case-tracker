let FIRST_TIME = true;
var myChart = [];
function chartPreReq(
    mode,
    data,
    charts,
    types,
    labels,
    loadingScreens,
    addedValuesLabel,
    prevDatesLabel
) {
    for (let i = 0; i < charts.length; i++) {
        createChart(
            mode,
            data,
            charts[i],
            types[i],
            labels[i],
            loadingScreens[0],
            addedValuesLabel[i],
            prevDatesLabel[i],
            i
        );
    }

    FIRST_TIME = false;
}

const CHART_COLORS = {
    red: "rgb(255, 99, 132)",
    orange: "rgb(255, 159, 64)",
    yellow: "rgb(255, 205, 86)",
    green: "rgb(75, 192, 192)",
    blue: "rgb(54, 162, 235)",
    purple: "rgb(153, 102, 255)",
    grey: "rgb(201, 203, 207)",
};
function createChart(
    mode,
    datas,
    canvas,
    types,
    labels,
    loadingScreen,
    addedValuesLabel,
    addedPrevDatesLabel,
    i
) {
    const date = getYear(datas, mode);
    // console.log(date);
    const caseCount = getCaseCount(mode, datas, types);
    // console.log(caseCount);
    if (labels) {
        const labelsValue = getFormattedNumber(caseCount[caseCount.length - 1]);
        labels.innerText = labelsValue;
    }
    if (addedValuesLabel) {
        const addedLabel = getFormattedNumber(
            Math.abs(
                caseCount[caseCount.length - 1] -
                    caseCount[caseCount.length - 2]
            )
        );

        if (
            caseCount[caseCount.length - 1] - caseCount[caseCount.length - 2] <
            0
        ) {
            document.getElementsByClassName("addSub")[i].innerText = "reduced";
        } else {
            document.getElementsByClassName("addSub")[i].innerText = "added";
        }

        addedValuesLabel.innerText = addedLabel;
    }

    if (addedPrevDatesLabel != undefined) {
        addedPrevDatesLabel.innerText = date[date.length - 2];
    }

    const DISPLAY = true;
    const BORDER = false;
    const CHART_AREA = true;
    const TICKS = false;
    let ASPECT_RATIO;

    if (window.innerWidth > window.innerHeight) {
        ASPECT_RATIO = true;
    } else {
        ASPECT_RATIO = false;
    }

    const RESPONSIVE_FONT = Math.round(window.innerWidth / 60);
    const RESPONSIVE_PADDING = 10;
    const RESPONSIVE_POINT = Math.round(canvas.width / 80);
    // console.log(RESPONSIVE_FONT);
    const option = {
        plugins: {
            tooltip: {
                // backgroundColor: "rgb(255, 160, 122)",
                padding: RESPONSIVE_PADDING,
                bodyFont: {
                    size: RESPONSIVE_FONT,
                },
            },
        },
        spanGaps: true,
        responsive: true,
        maintainAspectRatio: ASPECT_RATIO,
        interaction: {
            mode: "index",
            intersect: false,
            axis: "x",
        },
        stacked: false,
        scales: {
            x: {
                grid: {
                    display: DISPLAY,
                    drawBorder: BORDER,
                    drawOnChartArea: CHART_AREA,
                    drawTicks: TICKS,
                },
            },
            y: {
                grid: {
                    drawBorder: false,
                    color: function (context) {
                        if (context.tick.value > 0) {
                            return CHART_COLORS.green;
                        } else if (context.tick.value < 0) {
                            return CHART_COLORS.red;
                        }

                        return "#000000";
                    },
                },
            },
        },
    };

    const data = {
        labels: date,
        datasets: [
            {
                label: " Cases",
                data: caseCount,
                lineTension: 0,
                fill: true,
                backgroundColor: "#58aeff5e",
                pointRadius: 5,
                pointBackgroundColor: "#001eff",
                borderColor: "#001eff",
                borderWidth: 4,
                hoverRadius: RESPONSIVE_POINT + 5,
            },
        ],
    };

    if (FIRST_TIME == false) {
        myChart[i].destroy();
    }

    myChart[i] = new Chart(canvas, {
        type: "line",
        data: data,
        options: option,
    });
    myChart[i].update();
    if (loadingScreen) {
        loadingScreen.setAttribute("class", "hide");
        setTimeout(() => {
            loadingScreen.setAttribute("class", "remove");
        }, 300);
    }
}
