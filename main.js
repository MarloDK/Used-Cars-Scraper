const axios = require('axios')
const cheerio = require('cheerio')
const helperFunctions = require('./helperFunctions')
const fs = require('fs')

const bilbasen = require('./websites/bilbasen')
const dba = require('./websites/dba')

const userAgent = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'}

class Listing {
    Id = 0

    price = 0
    kilometers = 0
    productionYear = 0
    imageLink = ''

    listingLink = ''

    constructor(listingLink, imageLink, price, kilometers, productionYear, Id) {
        this.price = price
        this.kilometers = kilometers
        this.productionYear = productionYear
        this.imageLink = imageLink
        this.listingLink = listingLink

        this.Id = Id;
    }
}





//searchUrl = dba.buildUrl("corvette", [0, 500000], 100);



const ScrapeUrl = async function(searchTerm, url) {
    try {
        const { data } = await axios.get(url, { headers: userAgent } )
        const $ = cheerio.load(data)

        const listingUrls = $('.bb-listing-clickable .listing-heading').map((_, listingUrl) => {
            return 'https://bilbasen.dk' + $(listingUrl).attr('href')
        }).get()

        const foundListings = await Promise.all(listingUrls.map(async (listingUrl, index) => {
            const { data: listingData } = await axios.get(listingUrl, { headers: userAgent })
            const listingPage = cheerio.load(listingData)

            let carName = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-headerAndPrice > div.bas-MuiVipPageComponent-headerAndRatings > h1').text()
            const modelName = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-headerAndPrice > div.bas-MuiVipPageComponent-headerAndRatings > h1 > spanas-MuiCarHeaderComponent-variant').text()
            const imageLink = listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div.bas-MuiVipPageComponent-mainGallery > a > div > img').attr('src')
            const price = parseInt(listingPage('.bas-MuiCarPriceComponent-value').text().replace('kr.', '').replace('.', ''))
            const kilometers = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(3) > td').text().replace('km.', '').replace('.', ''))
            const productionYear = parseInt(listingPage('#root > div.nmp-ads-layout__page > div.nmp-ads-layout__content > div.bas-Wrapper-wrapper > article > main > div:nth-child(5) > div > table > tbody > tr:nth-child(1) > td').text())

            //modelName = carName.substring(0, searchTerm)
            carName = carName.substring(searchTerm.length, 0)
            console.log(modelName + '\n' + carName)
            //carName = carName.substring(0, modelName.length)

            return {
                id: index,
                name: `${carName}`,
                listingLink: listingUrl,
                imageLink,
                price,
                kilometers,
                productionYear
            }
            //return new Listing(listingUrl, imageLink, price, kilometers, productionYear, index)
        }))


        fs.writeFile('results.json', JSON.stringify(helperFunctions.sortListingsByPrice(foundListings, true)), err => {
            if (err)
                console.error(err)
        })

        //return JSON.stringify(helperFunctions.sortListingsByPrice(foundListings, true), null, 2)
        //return helperFunctions.sortListingsByPrice(foundListings, true)
 
    } catch(error) {
        console.error(error)
    }
}

//var searchUrl = bilbasen.buildUrl("Corvette", [0, 500000])
//ScrapeUrl(searchUrl)

exports.ScrapeUrl = ScrapeUrl