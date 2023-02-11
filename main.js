const ScrapeHandler = require('./scrapeHandler');
const HelperFunctions = require('./helperFunctions');

const ScrapeWebsites = async function(searchTerm) {
    foundListings = await ScrapeHandler.InitScraping(searchTerm);
    //console.log(foundListings);

    HelperFunctions.WriteListingsToFile(foundListings);
}

ScrapeWebsites("Corvette");

exports.ScrapeWebsites = ScrapeWebsites;