const ScrapeHandler = require('./scrapeHandler');
const HelperFunctions = require('./helperFunctions');

exports.ScrapeWebsites = async function(searchTerm) {
    foundListings = await ScrapeHandler.InitScraping(searchTerm);
    console.log(foundListings);

    HelperFunctions.WriteListingsToFile(foundListings);
}