
exports.buildUrl = function(searchTerm, priceRange) {
    baseURL = "https://www.bilbasen.dk/brugt/bil?IncludeEngrosCVR=false&includeLeasing=false&IncludeCallForPrice=false&IncludeWithoutVehicleRegistrationTax=false"

    baseURL += `&free=${searchTerm}`

    if (searchTerm == null)
        return console.error("A search term can't be null when building a URL.");
    
    if (typeof priceRange !== 'undefined') {
        if (priceRange[1] != null) {
            priceFrom = priceRange[0];
            priceTo = priceRange[1];
    
            baseURL += `&PriceFrom=${priceFrom}${priceTo > 0 ? "&PriceTo=" + priceTo : ""}`;
        }
    }
    

    return baseURL;
}