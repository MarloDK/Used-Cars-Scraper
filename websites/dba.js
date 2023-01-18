
exports.buildUrl = function(searchTerm, priceRange, searchRadius) {
    baseURL = "https://www.dba.dk/soeg/?soegfra=7600"

    baseURL += `&soeg=${searchTerm}`

    if (searchTerm == null)
        return console.error("A search term can't be null when building a URL.");
    
    if (priceRange[1] != null) {
        priceFrom = priceRange[0];
        priceTo = priceRange[1];

        baseURL += `&pris=(${priceFrom}-${priceTo})`;
    }

    if (searchRadius != null)
        baseURL += `&radius=${searchRadius}`

    return baseURL;
}