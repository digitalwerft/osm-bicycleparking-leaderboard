const got = require('got');

var overpassApi = 'https://overpass-api.de/api/interpreter';

const query = (area) => `
    [out:json][timeout:25];
    area[name="${area}"];
    (node["amenity"="bicycle_parking"](area);way["amenity"="bicycle_parking"](area););
    out count;
`;

var areas = ['Charlottenburg','Friedrichshain','Hellersdorf','Hohenschönhausen','Kreuzberg','Köpenick','Lichtenberg','Marzahn','Mitte','Neukölln','Pankow','Prenzlauer Berg','Reinickendorf','Schöneberg','Spandau','Steglitz','Tempelhof','Tiergarten','Treptow','Wedding','Weißensee','Wilmersdorf','Zehlendorf'];


async function getParkingCountForArea (area) {
    const body = await got.post(overpassApi, {body: query(area)}).json();
    var parkingCount = body.elements[0].tags.nodes;
    return parkingCount;
}


async function getForAreas (areas) {
    var parkingByArea = {};

    for (const area of areas) {
        parkingByArea[area] = await getParkingCountForArea(area);
        //console.log(area, parkingByArea[area]);
    };

    return parkingByArea;
}

async function getLeaderboard () {
    parkingCountByArea = await getForAreas(areas);

    const sortedAreas = Object.fromEntries(
        Object.entries(parkingCountByArea).sort(([,a],[,b]) => b-a)
    );

    var index = 1;
    for (var area in sortedAreas) {
        console.log(`${index}. ${area}  ${sortedAreas[area]}`);
        index++;
    }
}


getLeaderboard();
