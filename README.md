## Multilingual Search Engine - CSE-535

All the work is done as the part of the final project for CSE535. 

The goal of the project is to implement concepts learnt as a part of the course to create a end to end search engine and deploy it on public server.

**Experimentation Data -** 

Data for this project was collected from Twitter using the Twitter API. In
addition a GEO coding API was used in order to derive the country of origin
for some tweets. Approximately 2 Million tweets downloaded spread over a month. 

### Implementation Details-

- **Solr Backend** -    
  - BM25 Similarity Factory with k1 and b values as 2.4 and 0.2 respectively. 
  - Deduplication used to eliminate duplicates. 
- **Logs** -
  - Query logs were stored in Database. The query logs included the query, timestamp, and all the tweet IDs which were returned for that particular query. 
  - Relevance Logs were also stored in different collection. If user clicks on particular result then that result is considered relevent and can be used to return better results. So tweetID, and query also stored in Database. 
- **Frontend** - 
  - Interactive UI using Javascript, HTML, and Bootstrap to use solr's faceted query. 
  - Dynamic graphs which interacts with backend on the fly. 
  - Pagination to manage returned tweets. 
- **Analytics** -
  - Time Series Analysis - Per day basis time series analysis for entire data, along with filter wise time series analysis. 
  - Sentiment Analysis - Donut chart representing the average sentiment for the particular query. Time series graphs for sentiment also generated. 
  - HashTags and Mentions - Extracting top 10 hashtags and mentions for returned results. 
  - Pie Charts - Pie charts to represent count based analysis for all tweets across different filters. 
  - Google Highcharts - Google Highcharts to represent region wise count on world map based on origin location. 

***Please check the detailed version here in report*** -[Multilingual-Search-System - Report](https://github.com/yash21saraf/Multilingual-Search-System/tree/master/documents)

***Find the video for description for the same here*** -

[![Video Description of the Project](https://img.youtube.com/vi/emKR7mfoGds/0.jpg)](https://youtu.be/emKR7mfoGds)
