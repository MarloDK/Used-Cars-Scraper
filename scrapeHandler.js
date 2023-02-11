const axios = require('axios');
const cheerio = require('cheerio');
const helperFunctions = require('./helperFunctions');


const bilbasen = require('./websites/bilbasen');
const dba = require('./websites/dba');

const userAgent = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'};

const InitScraping = async function(searchTerm, priceRange = [0, 1000000]) {
    console.warn('Add price search options!');

    let bilbasenUrl = bilbasen.BuildUrl(searchTerm, priceRange);
    let dbaUrl = dba.BuildUrl(searchTerm, priceRange);

    console.log('ScrapeHandler 17, URLS:\n\nBilbasen: ' + bilbasenUrl + "\nDBA: " + dbaUrl);

    let dbaListings = await ScrapeUrl(dba, dbaUrl, searchTerm);
    let bilbasenListings = await ScrapeUrl(bilbasen, bilbasenUrl, searchTerm);
    
    console.log(bilbasenListings);

    //let allListings = [...dbaListings, ...bilbasenListings];
    return bilbasenListings;
}

const ScrapeUrl = async function(scrapedSite, url, searchTerm) {
    if (!url || !searchTerm)
        return console.error("Url or Search term isn't set.");

    try {
        const { data } = await axios.get(url, { headers: userAgent } );
        const $ = cheerio.load(data);

        const listingUrls = $(scrapedSite.listingQuery).map((_, listingUrl) => {
            if (scrapedSite == bilbasen)
                return scrapedSite.baseUrl + $(listingUrl).attr('href');

            return $(listingUrl).attr('href');
        }).get();

        let foundListings = await Promise.all(listingUrls.map(async (listingUrl, index) => {
            let listingInfo = await scrapedSite.ScrapeInformation(listingUrl, index, userAgent);

            if (typeof listingInfo.name === 'undefined' || !listingInfo.name.includes(searchTerm))
                return false;

            if (listingInfo.name.length > 29) {
                listingInfo.name = listingInfo.name.substring(0, 27);
                listingInfo.name = helperFunctions.NameCleanupRecursive(listingInfo.name);
                
                listingInfo.name += '...';
            }

            return listingInfo;
        }));

        return helperFunctions.SortListingsByPrice(foundListings, true);
    } catch(error) {
        console.error(error);
    }
}

exports.InitScraping = InitScraping;
exports.ScrapeUrl = ScrapeUrl;