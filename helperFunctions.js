const fs = require('fs');

const SortListingsByPrice = function(listings, highestFirst = false) {
    if (!listings)
        return console.error("Listings was empty");

    // Remove all entries of 'false'
    let listingsClean = listings.filter(listing => listing !== false)

    for (let i = 0; i < listingsClean.length; i++){
        for (let j = 0; j < (listingsClean.length - i - 1); j++){
            
           
            // Checking if the item at present iteration
            // is greater than the next iteration
            if (listingsClean[j].price > listingsClean[j+1].price) {
             
                // If the condition is true then swap them
                var temp = listingsClean[j];
                listingsClean[j] = listingsClean[j + 1];
                listingsClean[j + 1] = temp;
            }
        }
    }

    if (highestFirst)
        listingsClean = listingsClean.reverse();

    return listingsClean;
}

const NameCleanupRecursive = function(name) {
    let lastChar = name.slice(name.length - 1);

    if (lastChar == '.' || lastChar == ' ') {
        name = name.substring(0, name.length - 1);
        NameCleanupRecursive(name);
    }

    return name;
}

const WriteListingsToFile = function(allListings) {
    fs.writeFile('results.json', JSON.stringify(SortListingsByPrice(allListings, true)), err => {
        if (err)
            console.error(err);
    })
}

exports.SortListingsByPrice = SortListingsByPrice;
exports.NameCleanupRecursive = NameCleanupRecursive;
exports.WriteListingsToFile = WriteListingsToFile;