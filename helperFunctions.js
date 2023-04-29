// Importerer filesystem (fs) biblioteket
const fs = require('fs');

// Opretter en funktion som variablet SortListingsByPrice, som senere bliver eksporteret
const SortListingsByPrice = function(listings, highestFirst = false) {
    // Hvis variablet 'listings' ikke er blevet modtaget, eller er null, stopper vi og giver en fejl
    if (!listings)
        return console.error("Listings was empty");

    // Fjerner alle 'false' værdier fundet i listen 'listings', så vi kun har opslag i listen
    let listingsClean = listings.filter(listing => listing !== false)

    // Looper gennem listen 'listingsClean'
    for (let i = 0; i < listingsClean.length; i++){
        // Looper gennem de resterende værdier i listen 'listingsClean'
        for (let j = 0; j < (listingsClean.length - i - 1); j++){
            // Tjekker om prisen på det nuværende opslag er højere end prisen på det næste 
            if (listingsClean[j].price > listingsClean[j+1].price) {
                // Hvis den er højere, bliver deres pladser skiftet
                var temp = listingsClean[j];
                listingsClean[j] = listingsClean[j + 1];
                listingsClean[j + 1] = temp;
            }
        }
    }

    // Hvis vi vil have højeste pris først, vender vi listen om
    if (highestFirst)
        listingsClean = listingsClean.reverse();

    // Returnerer til sidst den nye liste med opslag
    return listingsClean;
}

// Opretter en funktion som variablet NameCleanupRecursive, som senere bliver eksporteret
const NameCleanupRecursive = function(name) {
    // Fjerner alle karakterer fra string variablet 'name', udover det sidste
    let lastChar = name.slice(name.length - 1);

    // Hvis karakteren er et punktum eller mellemrum, fjerner vi bogstavet fra string variablet 'name'
    if (lastChar == '.' || lastChar == ' ') {
        name = name.substring(0, name.length - 1);
        NameCleanupRecursive(name);
    }

    return name;
}
// Opretter en funktion som variablet WriteListingsToFile, som senere bliver eksporteret
const WriteListingsToFile = function(allListings) {
    // Benytter biblioteket 'fs' til at lave en ny JSON fil ved navn 'results.json',
    // som indeholder en liste over alle opslag i JSON format
    fs.writeFile('results.json', JSON.stringify(SortListingsByPrice(allListings, true)), err => {
        // Hvis der sker en fejl, stopper vi og giver en fejl
        if (err)
            console.error(err);
    })
}

// Eksporterer funktionerne gemt som variabler så andre filer kan tilgå dem
exports.SortListingsByPrice = SortListingsByPrice;
exports.NameCleanupRecursive = NameCleanupRecursive;
exports.WriteListingsToFile = WriteListingsToFile;