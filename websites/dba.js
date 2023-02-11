const axios = require('axios');
const cheerio = require('cheerio');


const baseUrl = 'https://dba.dk';
const listingQuery = ' #content > div.sidebar-layout > section > table > tbody > tr > td.pictureColumn > div > a';

exports.BuildUrl = function(searchTerm, priceRange) {
    if (searchTerm == null)
        return console.error("A search term can't be null when building a URL.");
    
    searchTerm = searchTerm.replace(' ', '%20');

    priceQuery = '';
    if (typeof priceRange !== 'undefined') {
        if (priceRange[1] != null) {
            priceFrom = priceRange[0];
            priceTo = priceRange[1];
    
            priceQuery = `pris=(${priceFrom}-${priceTo})`;
        }
    }

    return `${baseUrl}/biler/?soeg=${searchTerm}&${priceQuery}`;
}

exports.ScrapeInformation = async function(url, index, searchTerm, userAgent) {
    const { data: listingData } = await axios.get(url, { headers: userAgent });
    const listingPage = cheerio.load(listingData);

    // Safe:
    // #content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(1) > td:nth-child(2)
    
    // Better if possible:
    // #content > div.vip-heading-bar.row-fluid > div.span8 > div > div:nth-child(1) > h1

    let carName = listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
    const imageLink = listingPage('#content > div.sidebar-layout > article > div.vip-picture-gallery.default-picture-gallery.clearfix > a.primary.svg-placeholder > img').attr('src');
    const price = parseInt(listingPage('.price-tag').text().replace('kr.', '').replace('.', ''))
    const kilometers = parseInt(listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(1) > td:nth-child(5)').text().replace('km.', '').replace('.', ''));
    const productionYear = parseInt(listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(5) > td:nth-child(2)').text());
    const fuelType = listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();

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