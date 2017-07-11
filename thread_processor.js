// Made by Edward Fox - @icemaz 08/07/2017
// Facepunch thread processor

class ThreadProcessor{
    constructor(data){
        // Data passed in from 
        this.data = data || [];
        this.words = {};
        this.ignoredWords = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "10", "i", "me", "my", "myself", "we", "us", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "whose", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "will", "would", "should", "can", "could", "ought", "i'm", "you're", "he's", "she's", "it's", "we're", "they're", "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd", "i'll", "you'll", "he'll", "she'll", "we'll", "they'll", "isn't", "aren't", "wasn't", "weren't", "hasn't", "haven't", "hadn't", "doesn't", "don't", "didn't", "won't", "wouldn't", "shan't", "shouldn't", "can't", "cannot", "couldn't", "mustn't", "let's", "that's", "who's", "what's", "here's", "there's", "when's", "where's", "why's", "how's", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "upon", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "say", "says", "said", "shall", "posted", "edited", "like", "just", "html", "support", "browser", "videos", "loading", "one", "get", ""]
    }

    getWordCount(callback){
        // First iterate through pages
        for(let i = 0; i < this.data.length; i++){
            // Now each post on that page
            for(let j = 0; j < this.data[i].posts.length; j++){
                if(this.data[i].posts[j].text){
                    let postWords = this.data[i].posts[j].text.split(' ');
                
                    // Over the words in the post
                    for(let k = 0; k < postWords.length; k++){
                        let curWord = postWords[k].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                        if(this.checkWord(curWord)){
                            this.words[curWord] = this.words[curWord] || 0;
                            this.words[curWord]++;
                        }
                    }
                }
            }
        }

        let wordsFormatted = [];

        for(let word in this.words){
            if (this.words.hasOwnProperty(word)){
                if(this.words[word]){
                    wordsFormatted.push({
                        text: word,
                        size: this.words[word]
                    });
                }
            }
        }

        console.log("Formated length: " + wordsFormatted.length);

        callback(wordsFormatted, this.words);
    }

    // Makes a big huge string of all the words repeated, used for some word cloud implementations, run after getWordCount
    getAllWords(callback){
        let toReturn = "";
        
        for(let word in this.words){
            if (this.words.hasOwnProperty(word)){
                toReturn += (word.trim() + ",").repeat(this.words[word]);
            }
        }

        callback(toReturn);
    }

    checkWord(word){
        for(let i = 0; i < this.ignoredWords.length; i++){
            if(word == this.ignoredWords[i]){
                return false;
            }
        }
        return true;
    }
}

module.exports = ThreadProcessor;