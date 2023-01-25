exports.sortListingsByPrice = function(listings, highestFirst = false) {

    for (let i = 0; i < listings.length; i++){
        for (let j = 0; j < (listings.length - i - 1); j++){
           
            // Checking if the item at present iteration
            // is greater than the next iteration
            if (listings[j].price > listings[j+1].price){
             
                // If the condition is true then swap them
                var temp = listings[j]
                listings[j] = listings[j + 1]
                listings[j + 1] = temp
            }
        }
    }

    if (highestFirst)
        listings = listings.reverse()

    // Print the sorted array
    console.log(listings);
    return listings;
}