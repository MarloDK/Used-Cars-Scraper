
exports.buildUrl = async function(searchTerm, priceRange) {
    if (searchTerm == null)
        return console.error("A search term can't be null when building a URL.");
    
    searchTerm = searchTerm.replace(' ', '%20');

    
    priceQuery = "";
    if (typeof priceRange !== 'undefined') {
        if (priceRange[1] != null) {
            priceFrom = priceRange[0];
            priceTo = priceRange[1];
    
            priceQuery = `PriceFrom=${priceFrom}${priceTo > 0 ? "&PriceTo=" + priceTo : ""}`;
        }
    }
    
    url = `https://bilbasen.dk/brugt/bil?IncludeEngrosCVR=false&${priceQuery}&includeLeasing=false&free=${searchTerm}&IncludeCallForPrice=false&IncludeWithoutVehicleRegistrationTax=false`;
    scrapeResults = await ScrapeUrl(url);
}

const ScrapeUrl = async function(url) {
    try {
        const { data } = await axios.get(url, { headers: userAgent } );
        const $ = cheerio.load(data);

        const listingUrls = $('.bb-listing-clickable .listing-heading').map((_, listingUrl) => {
            return 'https://bilbasen.dk' + $(listingUrl).attr('href');
        }).get();

        const foundListings = await Promise.all(listingUrls.map(async (listingUrl, index) => {
            const { data: listingData } = await axios.get(listingUrl, { headers: userAgent });
            const listingPage = cheerio.load(listingData);

            let carName = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-headerAndPrice > div.bas-MuiVipPageComponent-headerAndRatings > h1').attr('title');
            const imageLink = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-mainGallery > a > div > img').attr('src');
            const price = parseInt(listingPage('.bas-MuiCarPriceComponent-value').text().replace('kr.', '').replace('.', ''));
            const kilometers = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(3) > td').text().replace('km.', '').replace('.', ''));
            const productionYear = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(1) > td').text());

            if (carName.length > 27) {
                carName = carName.substring(0, 27);

                carName = nameCleanupRecursive();
                
                carName += '...';
            }

            return {
                id: index,
                name: `${carName}`,
                listingLink: listingUrl,
                imageLink,
                price,
                kilometers,
                productionYear,
            }
        }));


        fs.writeFile('results.json', JSON.stringify(helperFunctions.sortListingsByPrice(foundListings, true)), err => {
            if (err)
                console.error(err);
        });
 
    } catch(error) {
        console.error(error);
    }
}