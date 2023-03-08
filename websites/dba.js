const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs');

const baseUrl = 'https://dba.dk';
const listingQuery = ' #content > div.sidebar-layout > section > table > tbody > tr > td.pictureColumn > div > a';

exports.BuildUrl = function(searchTerm, priceRange) {
    if (searchTerm == null)
        return console.error("A search term can't be null when building a URL.");
    
    searchTerm = searchTerm.replace(' ', '%20');

    priceQuery = '';
    if (typeof priceRange !== 'undefined') {
        if (priceRange[1] != null) {
            priceFrom = priceRange[0];
            priceTo = priceRange[1];
    
            priceQuery = `pris=(${priceFrom}-${priceTo})`;
        }
    }

    return `${baseUrl}/biler/?soeg=${searchTerm}&${priceQuery}`;
}

exports.ScrapeInformation = async function(url, index, searchTerm, userAgent) {
    const { data: listingData } = await axios.get(url, userAgent);
    const listingPage = cheerio.load(listingData);

    let carName = listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
    const imageLink = listingPage('#content > div.sidebar-layout > article > div.vip-picture-gallery.default-picture-gallery.clearfix > a.primary.svg-placeholder > img').attr('src');
    const price = parseInt(listingPage('.price-tag').text().replace('kr.', '').replace('.', ''))
    
    const informationTable = listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody');
    
    let productionYear, kilometers, fuelType = "";
    
    allInfo = informationTable.children().map(function() {

        saveValue = 0;
        listingPage(this).children().filter(function() {

            elementValue = listingPage(this).text().replace('<td>', '').replace('</td>', '');
            if (!(elementValue === "" || elementValue === "-/-")) {
                switch (saveValue) {
                    case 1:
                        productionYear = elementValue;
                        break;
                    case 2:
                        kilometers = elementValue;
                        break;
                    case 3:
                        fuelType = elementValue;
                        break;
                    default:
                        break;
                }

                switch (elementValue) {
                    case 'Modelår':
                        saveValue = 1;
                        break;
                    case 'Antal km':
                        saveValue = 2;
                        break;
                    case 'Brændstof':
                        saveValue = 3;
                        break;
                    default:
                        saveValue = 0;
                        break;
                }

                //return elementValue.replace('<td>', '').replace('</td>', '');
            }
        })
    })

    fs.writeFile('assshit.txt', String(allInfo), err => {
        if (err)
            console.error(err);
    })

    for (let index = 0; index < allInfo.length; index++) {
        const element = allInfo[index];
        switch (element) {
            case 'Modelår':
                productionYear = allInfo[index + 1];
                break;
            case 'Antal km':
                kilometers = allInfo[index + 1];
                break;
            case 'Brændstof':
                fuelType = allInfo[index + 1];
                break;
            default:
                break;
        }
    }

    /*informationTable.map((_, trContent) => {
        for (let index = 0; index < trContent.children.length; index++) {
            const element = trContent[index];
            console.log(element);
        }

        console.log(trContent);

        trContent.map((i, entry) => {
            entryValue = entry.text();


            
            }
        })
    })*/
    
    
    //const productionYear = parseInt(listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(1) > td:nth-child(5)').text().replace('km.', '').replace('.', ''));
    
    //const kilometers = parseInt(listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(5) > td:nth-child(2)').text());
    

    //const fuelTypeHeader = listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(2) > td:nth-child(1)').text();
    //let fuelType = listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();
    
    //if (fuelTypeHeader == 'Type')
    //    fuelType = listingPage('#content > div.sidebar-layout > article > div.vip-matrix-data > table > tbody > tr:nth-child(3) > td:nth-child(2)').text();

    return {
        id: index,
        name: carName,
        listingLink: url,
        imageLink,
        price,
        kilometers,
        productionYear,
        fuelType,
    }
}

exports.baseUrl = baseUrl;
exports.listingQuery = listingQuery;