// Importerer bibliotekerne Axios og Cheerio
const axios = require('axios');
const cheerio = require('cheerio');

// Sætter base URLet
const baseUrl = 'https://bilbasen.dk';

// CSS selector til at få fat i opslag på hovedsiden
const listingQuery = '.bb-listing-clickable .listing-heading';

// Eksporterer funktionen BuildUrul så andre filer kan tilgå den
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

            priceQuery = `PriceFrom=${priceFrom}${priceTo > 0 ? "&PriceTo=" + priceTo : ""}`;
        }
    }
    
    // Returnerer det sammensatte url med queries
    return `${baseUrl}/brugt/bil?IncludeEngrosCVR=false&${priceQuery}&includeLeasing=false&free=${searchTerm}&IncludeCallForPrice=false&IncludeWithoutVehicleRegistrationTax=false`;
}

// Eksporterer funktionen ScrapeInformation så andre filer kan tilgå den
exports.ScrapeInformation = async function(url, index, userAgent) {
    // Opret en GET request til hjemmesiden fra url variablet og benyt vores UserAgent
    const { data: listingData } = await axios.get(url, userAgent);
    // Konverterer data variblet til HTML vi kan processere som CSS
    const listingPage = cheerio.load(listingData);

    // Finder forskellige data ud fra deres CSS selectorer
    let carName = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-headerAndPrice > div.bas-MuiVipPageComponent-headerAndRatings > h1').attr('title');
    const imageLink = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-mainGallery > a > div > img').attr('src');
    const price = parseInt(listingPage('.bas-MuiCarPriceComponent-value').text().replace('kr.', '').replace('.', ''))
    let kilometers = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(3) > td').text().replace('km.', '').replace('.', ''));
    
    // Hvis kilometertallet er under 100, har vi fået et forkert felt.
    // Derfor skal vi prøve en ny CSS selector som er det andet sted kilometertallet kan stå
    if (kilometers < 100)
        kilometers = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(4) > td').text().replace('km.', '').replace('.', ''));
    
    // Og fortsætter med at finde forskellige data ud fra deres CSS selectorer
    const productionYear = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(1) > td').text());
    const fuelType = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(4) > div > table > tbody > tr:nth-child(4) > td').text();

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