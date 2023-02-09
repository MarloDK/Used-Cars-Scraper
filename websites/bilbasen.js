const axios = require('axios');
const cheerio = require('cheerio');


const baseUrl = 'https://bilbasen.dk';
const listingQuery = '.bb-listing-clickable .listing-heading';

exports.BuildUrl = function(searchTerm, priceRange) {
    if (searchTerm == null)
        return console.error("A search term can't be null when building a URL.");
    
    searchTerm = searchTerm.replace(' ', '%20');

    priceQuery = '';
    if (typeof priceRange !== 'undefined') {
        if (priceRange[1] != null) {
            priceFrom = priceRange[0];
            priceTo = priceRange[1];
    
            priceQuery = `PriceFrom=${priceFrom}${priceTo > 0 ? "&PriceTo=" + priceTo : ""}`;
        }
    }
    
    return `${baseUrl}/brugt/bil?IncludeEngrosCVR=false&${priceQuery}&includeLeasing=false&free=${searchTerm}&IncludeCallForPrice=false&IncludeWithoutVehicleRegistrationTax=false`;
}

exports.ScrapeInformation = async function(url, index, searchTerm, userAgent) {
    const { data: listingData } = await axios.get(url, { headers: userAgent });
    const listingPage = cheerio.load(listingData);

    let carName = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-headerAndPrice > div.bas-MuiVipPageComponent-headerAndRatings > h1').attr('title');
    const imageLink = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-mainGallery > a > div > img').attr('src');
    const price = parseInt(listingPage('.bas-MuiCarPriceComponent-value').text().replace('kr.', '').replace('.', ''))
    const kilometers = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(3) > td').text().replace('km.', '').replace('.', ''));
    const productionYear = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(1) > td').text());
    const fuelType = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(4) > div > table > tbody > tr:nth-child(4) > td').text();

    return {
        id: index,
        name: `${carName}`,
        listingLink: url,
        imageLink,
        price,
        kilometers,
        productionYear,
        fuelType,
    }
}

exports.baseUrl = baseUrl;
exports.listingQuery = listingQuery;