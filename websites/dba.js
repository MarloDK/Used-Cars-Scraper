// Importerer bibliotekerne Axios og Cheerio
const axios = require('axios');
const cheerio = require('cheerio');

// Sætter base URLet
const baseUrl = 'https://dba.dk';

// CSS selector til at få fat i opslag på hovedsiden
const listingQuery = ' #content > div.sidebar-layout > section > table > tbody > tr > td.pictureColumn > div > a';

// Exporterer funktionen BuildUrul så andre filer kan tilgå den
exports.BuildUrl = function(searchTerm, priceRange) {
    // Hvis searchTerm ikke er sat, returner en fejl
    if (searchTerm == null)
        return console.error("A search term can't be null when building a URL.");
    
    // Erstatter mellemrum med %20 for at få et funktionelt URL
    searchTerm = searchTerm.replace(' ', '%20');

    // Sætter querien til at være ingenting, da der ikke skal stå noget hvis man ikke har søgt under
    // specifikke pris filtre
    priceQuery = '';
    // Hvis der bliver søgt med prisfilter, lav en query til det
    if (typeof priceRange !== 'undefined') {
        if (priceRange[1] != null) {
            priceFrom = priceRange[0];
            priceTo = priceRange[1];
    
            priceQuery = `pris=(${priceFrom}-${priceTo})`;
        }
    }

    // Returnerer det sammensatte url med queries
    return `${baseUrl}/biler/?soeg=${searchTerm}&${priceQuery}`;
}

// Exporterer funktionen ScrapeInformation så andre filer kan tilgå den
exports.ScrapeInformation = async function(url, index, searchTerm, userAgent) {
    // Opret en GET request til hjemmesiden fra url variablet og benyt vores UserAgent
    const { data: listingData } = await axios.get(url, userAgent);
    // Konverterer data variblet til HTML vi kan processere som CSS
    const listingPage = cheerio.load(listingData);

    // Finder forskellige data ud fra deres CSS selectorer
    let carName = listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
    const imageLink = listingPage('#content > div.sidebar-layout > article > div.vip-picture-gallery.default-picture-gallery.clearfix > a.primary.svg-placeholder > img').attr('src');
    const price = parseInt(listingPage('.price-tag').text().replace('kr.', '').replace('.', ''))
    
    const informationTable = listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody');
    
    let productionYear, kilometers, fuelType = "";
    
    allInfo = informationTable.children().map(function() {

        saveValue = 0;
        listingPage(this).children().filter(function() {

            elementValue = listingPage(this).text().replace('<td>', '').replace('</td>', '').replace('.', '');
            if (!(elementValue === "" || elementValue === "-/-")) {
                switch (saveValue) {
                    case 1:
                        productionYear = elementValue;
                        break;
                    case 2:
                        kilometers = elementValue;
                        break;
                    case 3:
                        fuelType = elementValue;
                        break;
                    default:
                        break;
                }

                switch (elementValue) {
                    case 'Modelår':
                        saveValue = 1;
                        break;
                    case 'Antal km':
                        saveValue = 2;
                        break;
                    case 'Brændstof':
                        saveValue = 3;
                        break;
                    default:
                        saveValue = 0;
                        break;
                }
            }
        })
    })

    for (let index = 0; index < allInfo.length; index++) {
        const element = allInfo[index];
        switch (element) {
            case 'Modelår':
                productionYear = allInfo[index + 1];
                break;
            case 'Antal km':
                kilometers = allInfo[index + 1];
                break;
            case 'Brændstof':
                fuelType = allInfo[index + 1];
                break;
            default:
                break;
        }
    }

    // Returnerer datasættet med navne til variablerne der er lættere at læse.
    return {
        id: index,
        name: carName,
        listingLink: url,
        imageLink,
        price,
        kilometers,
        productionYear,
        fuelType,
    }
}

// Eksporter variablerne baseUrl og listingQuery så andre filer kan tilgå dem
exports.baseUrl = baseUrl;
exports.listingQuery = listingQuery;