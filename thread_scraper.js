// Made by Edward Fox - @icemaz 08/07/2017
// Facepunch thread scrape

var cheerio = require('cheerio'),
    Xray = require('x-ray'),
    makeDriver = require('request-x-ray'),
    request = require('request'),
    fs = require('fs');

const options = {
	method: "GET",
	jar: true,
    encoding: 'binary',
	headers: {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
    }
}

var x = Xray({
  filters: {
    trim: function (value) {
        return typeof value === 'string' ? value.trim() : value
    },
    whitespace: function (value) {
        return typeof value === 'string' ? value.replace(/\r|\n|\t|\"/g,' ') : value
    },
    urlFilter: function (value){
        return typeof value === 'string' ? value.replace(/\\\\/g,'') : value
    }
  }
});

const driver = makeDriver(options);

x.driver(driver);

class ThreadScraper {
    constructor(id, cookie){
        this.id = id;
        options.headers["Cookie"] = cookie;
        options.url = "https://facepunch.com/showthread.php?t=" + id;
    }

    get thread_id(){
        return this.id;
    }

    scrapeThread(callback){
        var curPage = 1;
        var threadId = this.id;

        request(options, function(err, res, body){
            var $ = cheerio.load(body);

            // Grab the page count, so we know how much we should be scraping
            var pageCount = 1;
            if($('#pagination_top').length > 0){
                pageCount = parseInt($('#pagination_top .first_last a').attr('href').split('page=')[1]);
            }

            x('https://facepunch.com/showthread.php?t=' + this.id,
            {
                id: 'input[name=t]@value',
                title: '#lastelement',
                nextpage: '#pagination_top a[rel=next]@href',
                posts: x('.posts li', [{
                    post: '@html',
                    username: '.username | trim | whitespace',
                    text: 'blockquote | trim | whitespace',
                    date: '.date | trim | whitespace',
                    //edit: '.postdate span:not(.date)@title | trim | whitespace',
                    ratings: x('.rating_results', ['span | trim | whitespace'])
                }])
            })
            .paginate(function(){
                console.log("Current: " + "https://facepunch.com/showthread.php?t=" + threadId + "&page=" + curPage);
                curPage++;
                return "https://facepunch.com/showthread.php?t=" + threadId + "&page=" + curPage;
            })
            .limit(pageCount)
            (function(err,data){
                if(err){
                    console.log(err);
                }else{
                    callback(data);
                }
            });
        }.bind(this));

        
        
    }
}

module.exports = ThreadScraper;