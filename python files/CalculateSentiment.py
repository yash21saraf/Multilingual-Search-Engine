# -*- coding: utf-8 -*-
"""
Created on Wed Nov 28 18:48:44 2018

@author: Rox
"""

import re
from textblob import TextBlob 
import json
  

    
def clean_tweet(tweet):
    #Regex Utility function to clean tweet text by removing links, user mentions, special characters.
    return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split()) 
  
def getOnlySentimentFromSingleTweet(tweet): 
    
    #Utility function to classify sentiment of passed tweet using textblob's sentiment method 
    
    # create TextBlob object of passed tweet text 
    analysis = TextBlob(clean_tweet(tweet['tweet_text'])) 
    # set sentiment 
    if analysis.sentiment.polarity > 0: 
        return 1
    elif analysis.sentiment.polarity == 0: 
        return 0
    else: 
        return -1
    
def getSentimentListForTweetList(inputTweets):
    
    sentiments = []
    for tweet in inputTweets:
        
        sentiments.append(getOnlySentimentFromSingleTweet(tweet))
        
    return sentiments
    
    
def getTweetListWithSentiments(inputTweets):
    
    # empty list to store parsed tweets 
    tweets = []
    
    for tweet in inputTweets:
        
        tweets.append(getSingleTweetWithSentiment(tweet))
        
    return tweets
        
def getSingleTweetWithSentiment(tweet):
    
    sentiment = getOnlySentimentFromSingleTweet(tweet)
    
    tweet['sentiment']= sentiment
    
    return tweet


#%%
    
#with open('testfile.json', 'r') as freader:
    
    #inputtweetss=json.load(freader)
    #answers=getTweetListWithSentiments(inputtweetss)
    #answers=getSentimentListForTweetList(inputtweetss)
    
    
    
    