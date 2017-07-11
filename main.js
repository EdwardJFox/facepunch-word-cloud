// Made by Edward Fox - @icemaz 08/07/2017
// Facepunch thread scrape
var fs = require('fs');
var Scraper = require('./thread_scraper.js');
var Analyser = require('./thread_processor.js');
var async = require('Async');
var PythonShell = require('python-shell');

// Global variables
let scrapeResult, wordCount, fileName, imageName, threadId, cookie;

// Grab the arguments
if(process.argv.indexOf("-t") != -1){
    threadId = process.argv[process.argv.indexOf("-t") + 1]; //grab the next item
} else {
    throw new Error('Please include the thread id with the flag -t');
}

if(process.argv.indexOf("-i") != -1){
    imageName = process.argv[process.argv.indexOf("-i") + 1]; //grab the next item
} else {
    throw new Error('Please include the image filename you want with the flag -i without file extension (the script saves as png no matter what)');
}

async.series([
    // Scrape thread
    function(callback){
        // Load up the cookie file
        fs.readFile('cookie.txt', 'utf8', function (err,data){
            if(err){
                return console.log(err);
            }

            cookie = data;
            callback();
        });
    },
    function(callback){
        let threadScraper = new Scraper(threadId, cookie);
        threadScraper.scrapeThread(function(res){
            // Put into global
            scrapeResult = res;

            // Save the data in a file
            // Check a threads data folder exists
            if (!fs.existsSync('./threads')){
                fs.mkdirSync('./threads');
            }
            var dir = './threads/' + threadId;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }

            fs.writeFile('./threads/' + threadId + '/' +  Date.now() + '.json', JSON.stringify(scrapeResult), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("Thread data saved");
            }); 

            callback();
        });
    },
    // Analyse result
    function(callback){
        let threadAnalysis = new Analyser(scrapeResult);
        
        // Returns it as JSON
        threadAnalysis.getWordCount(function(res, dict){
            wordCount = res;
            
            dictFileName = './threads/' + threadId + '/' +  Date.now() + '_dict.json';
            fs.writeFile(dictFileName, JSON.stringify(dict), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("Dict JSON data saved");
            }); 
            
            // Unused
            // Save the words in a big file with each word repeated for the number of times mentioned
            threadAnalysis.getAllWords(function(res){
                fileName = './threads/' + threadId + '/' +  Date.now() + '_all.txt';
                fs.writeFile(fileName, JSON.stringify(res), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("Word data saved");
                    callback();
                }); 
            })
        });
    },
    // Create the word cloud
    function(callback){
        var options = {
            mode: 'text',
            args: [dictFileName, imageName]
        };

        PythonShell.run('create_word_cloud.py', options, function (err, results) {
            if (err) throw err;
        });
    }
]);