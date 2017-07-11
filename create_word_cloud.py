# Basically the simple.py example from https://github.com/amueller/word_cloud
from os import path
from wordcloud import WordCloud, STOPWORDS
import sys
import json
import codecs

d = path.dirname(__file__)

print path.join(d, sys.argv[1])

json_data = codecs.open(path.join(d, sys.argv[1]), "r", "utf-8")
wordsDict = json.loads(json_data.read())

stopwords = set(STOPWORDS)
stopwords.add("posted")
stopwords.add("edited")
stopwords.add("just")
stopwords.add("like")

# Generate a word cloud image
wordcloud = WordCloud(width=1800, height=1200, margin=10, mode="RGBA", stopwords=stopwords).generate_from_frequencies(wordsDict)

# Display the generated image:
# the matplotlib way:
import matplotlib.pyplot as plt
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")

wordcloud.to_file('./' + sys.argv[2] + '.png')