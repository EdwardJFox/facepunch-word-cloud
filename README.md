# Facepunch Word Cloud Generator
Using node and Python, a basic little word cloud generator for the Facepunch Forums

## Setup
In my usage, I used node v8.1.0 which can be found over at the [Node.js website](https://nodejs.org/en/). For Python I used 2.7.13, which can be found on the [Python website](https://www.python.org/downloads/).

Once this is done, load up CMD or powershell and cd to the directory you have this downloaded. Then run the following command:

Install the node modules
```
npm install
```

Install the word_cloud package
```
pip install wordcloud
```
If you have problems with pip not being installed, check [this guide](https://github.com/BurntSushi/nfldb/wiki/Python-&-pip-Windows-installation) for that, or if you have problems with the word cloud installation itself check the [installation notes](https://github.com/amueller/word_cloud#installation-notes) for word_cloud and see if that helps.

The last step, is getting your Facepunch cookie. This is to get passed cloudflare, and if you're logged in to restricted boards like Fast Threads or the Gold Members Forum. I recommend doing the following in Chrome:
1. Load up the Facepunch homepage so you see the list of forums
2. Press F12 to load the developer tools, and clicking on the 'Network' tab
3. Refresh the page
4. You should see a bunch of requests pop up. Scroll all the way to the top and click on 'forum.php'
5. Scroll down to the 'Request Headers' section, and copy the entire 'Cookie:' string, excluding the actual 'Cookie:' bit. It should start with '__cf..' and end with 'bb_lastactivity=0' or something similar.
6. Paste that into 'cookie.txt' in the root directory. The script will look there for your Cookie string.

## Usage
In powershell or cmd, the following command will scrape thread with id 1565895 (Nintendo Discussion), and save the word cloud as "nintendo.png"
```
node main.js -t 1565895 -i nintendo
```

This should result in the following, or similar:
![Nintendo thread word cloud](http://i.imgur.com/oVnUhmw.png)

## Extension
Feel free to expand on the this little project. The output is pruposefully verbose to allow for some deeper analysis into the mind of the forum users at Facepunch.

word_cloud also does a bunch of really cool stuff, and you can customise it to generate a word cloud within an image mask, a bunch of different colours and way more. Check out the github for it for examples, or check the [online reference](http://amueller.github.io/word_cloud/references.html) .

## Libraries used
node
* [request](https://github.com/request/request) most common http request client, used for initial request to get number of pages
* [x-ray](https://github.com/matthewmueller/x-ray) easy to use scraping framework
* [request-x-ray](https://github.com/Crazometer/request-x-ray) easy header editing for x-ray
* [cheerio](https://github.com/cheeriojs/cheerio) jQuery implementation in node, used for grabbing number of pages
* [async](https://github.com/caolan/async) organised the main script to do things in order
* [python-shell](https://github.com/extrabacon/python-shell) runs then python script from node

python
* [word_cloud](https://github.com/amueller/word_cloud) really neat and fast word cloud generator