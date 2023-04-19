// Importerer bibliotekerne Axios og Cheerio
const axios = require('axios');
const cheerio = require('cheerio');

// Lav reference til helperFunctions
const helperFunctions = require('./helperFunctions');

// Lav reference til bilbasen og dba
const bilbasen = require('./websites/bilbasen');
const dba = require('./websites/dba');

// Opret en UserAgent for at skjule os som en reel browser
const userAgent = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
    "Referer": "https://www.google.com/",
	"Referrer-Policy": "strict-origin-when-cross-origin"
};

// Gem funktionen InitScraping som variabel
const InitScraping = async function(searchTerm, priceRange = [0, 1000000]) {
    // Lav både et URL til bilbasen og dba
    let bilbasenUrl = bilbasen.BuildUrl(searchTerm, priceRange);
    let dbaUrl = dba.BuildUrl(searchTerm, priceRange);

    console.log('ScrapeHandler 17, URLS:\n\nBilbasen: ' + bilbasenUrl + "\nDBA: " + dbaUrl);

    // Kald funktionen ScrapeURL og afvent svar
    let dbaListings = await ScrapeUrl(dba, dbaUrl, searchTerm);
    let bilbasenListings = await ScrapeUrl(bilbasen, bilbasenUrl, searchTerm);
    
    // Kombiner de to lister til en stor liste
    let allListings = [...dbaListings, ...bilbasenListings];

    console.log(`${allListings}\n\nFound ${allListings.length} listings`)

    // Returnér opslagene
    return allListings;
}

// Gem funktionen som et variabel
const ScrapeUrl = async function(scrapedSite, url, searchTerm) {
    // Hvis variablet url eller searchTerm ikke er blevet sat, stop og send en advarsel
    if (!url || !searchTerm)
        return console.error("Url or Search term isn't set.");

    // Try for at undgå et crash hvis noget går galt
    try {
        // Opret en GET request til hjemmesiden fra url variablet og benyt vores UserAgent
        const { data } = await axios.get(url, { headers: userAgent } );
        // Konverterer data variblet til HTML vi kan processere som CSS
        const $ = cheerio.load(data);

        // Find alle opslag på hovedsiden, og gå igennem dem en for en
        const listingUrls = $(scrapedSite.listingQuery).map((_, listingUrl) => {
            // Hvis hjemmesiden er bilbasen, så tilføj baseUrl til URLet, da de ikke har det som standard
            if (scrapedSite == bilbasen)
                return scrapedSite.baseUrl + $(listingUrl).attr('href');
            // Returner urlet til opslaget
            return $(listingUrl).attr('href');
        }).get();

        // Sæt den sidste listing lig med ingenting
        let lastListing = null;

        // Gå igennem alle de URLs vi fandt fra loopet før
        let foundListings = await Promise.all(listingUrls.map(async (listingUrl, index) => {
            // Find informationen vi skal bruge fra funktionen 
            // ScrapeInformation som er i bilbasen.js og dba.js
            let listingInfo = await scrapedSite.ScrapeInformation(listingUrl, index, userAgent);

            // Hvis opslagets navn ikke er sat, er anderledes end vores searchTerm, 
            // eller prisen er under 10000 (Undgår leasing), gå til næste entry
            if (typeof listingInfo.name === 'undefined' || !listingInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) || listingInfo.price < 10000)
                return false;

            // Hvis sidste listing ikke er lig med ingenting
            if (lastListing !== null) {
                // Hvis sidste opslag har samme navn som dette opslag, 
                // eller har samme pris, så gå til næste entry
                if (lastListing.name == listingInfo.name || lastListing.price == listingInfo.price)
                    return false;
            }
                
            // Sæt lastListing til det nuværende opslag
            lastListing = Object.assign({}, listingInfo);

            // Hvis opslagets navn er længere end 29 tegn
            if (listingInfo.name.length > 29) {
                // Fjern alle tegn efter det 27.
                listingInfo.name = listingInfo.name.substring(0, 27);
                // Fjern specielle karakterer fra navnet (" ,./:#")
                listingInfo.name = helperFunctions.NameCleanupRecursive(listingInfo.name);
                
                // Tilføj "..." til slutningen af navnet
                listingInfo.name += '...';
            }
            // Returner informationen
            return listingInfo;
        }));
        // Sortér opslagene baseret på pris og returner dataen.
        return helperFunctions.SortListingsByPrice(foundListings, true);
    } catch(error) {
        console.error(error);
    }
}

// Eksporter funktionerne InitScraping og ScrapeUrl så andre filer kan tilgå dem
exports.InitScraping = InitScraping;
exports.ScrapeUrl = ScrapeUrl;