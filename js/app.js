window.onload = () => {
    getCovidCases();
    setupInterface();
};

/*

[0 … 99]
0:
Active: 25614
City: ""
CityCode: ""
Confirmed: 494605
Country: "Philippines"
CountryCode: "PH"
Date: "2021-01-14T00:00:00Z"
Deaths: 9739
ID: "345f0399-055a-48fa-bb68-5cf580f2c35a"
Lat: "12.88"
Lon: "121.77"
Province: ""
Recovered: 459252

*/

let covidDataLocations = [];
async function getCovidCases() {
    const API_URL =
        "https://api.covid19api.com/country/philippines/status/confirmed";

    const attributes = {
        method: "GET",
        redirect: "follow",
    };

    const res = await fetch(API_URL, attributes);
    const datas = await res.json();
    console.log(datas[datas.length - 1]);

    covidDataLocations.push({
        lat: datas[datas.length - 1].Lat,
        lon: datas[datas.length - 1].Lon,
        cases: `Cases: ${datas[datas.length - 1].Cases}`,
    });

    setLocations(covidDataLocations);
}
