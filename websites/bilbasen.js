
exports.buildUrl = function(searchTerm, priceRange) {
    //baseURL = "https://www.bilbasen.dk/brugt/bil?IncludeEngrosCVR=false&includeLeasing=false&IncludeCallForPrice=false&IncludeWithoutVehicleRegistrationTax=false"

    //baseURL += `&free=${searchTerm}`

    if (searchTerm == null)
        return console.error("A search term can't be null when building a URL.");
    



    priceQuery = ""
    if (typeof priceRange !== 'undefined') {
        if (priceRange[1] != null) {
            priceFrom = priceRange[0];
            priceTo = priceRange[1];
    
            priceQuery = `PriceFrom=${priceFrom}${priceTo > 0 ? "&PriceTo=" + priceTo : ""}`;
        }
    }
    

    return `https://bilbasen.dk/brugt/bil?IncludeEngrosCVR=false&${priceQuery}&includeLeasing=false&free=${searchTerm}&IncludeCallForPrice=false&IncludeWithoutVehicleRegistrationTax=false`;
}