// Lav referencer til scrapeHandler og helperFunctions
const ScrapeHandler = require('./scrapeHandler');
const HelperFunctions = require('./helperFunctions');

// Gem funktionen ScrapeWebsites som variabel
const ScrapeWebsites = async function(searchTerm) {
    // Start scraping i scrapeHandler og afvent svar
    foundListings = await ScrapeHandler.InitScraping(searchTerm);

    // Benyt helperFunctions til at omskrive opslagene til en JSON fil
    HelperFunctions.WriteListingsToFile(foundListings);
}

// Eksporter funktionen ScrapeWebsites så andre filer kan tilgå den
exports.ScrapeWebsites = ScrapeWebsites;