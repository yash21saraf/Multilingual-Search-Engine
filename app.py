from flask import Flask, render_template, request, jsonify, make_response, current_app
from flask_cors import CORS, cross_origin
from flask import Response
import json
import urllib.request, urllib.error
import urllib
from datetime import datetime
from datetime import timedelta
from pymongo import MongoClient

import re
docspage = []

client = MongoClient('localhost', 27017)

db = client.irdb
alllogs = db.alllogs
relevance = db.relevance


emoji_pattern = re.compile("["
				   u"\U0001F600-\U0001F64F"  # emoticons
				   u"\U0001F300-\U0001F5FF"  # symbols & pictographs
				   u"\U0001F680-\U0001F6FF"  # transport & map symbols
				   u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
				   u"\U00002702-\U000027B0"
				   u"\U000024C2-\U0001F251"
				   u"\U0001f926-\U0001f937"
				   u"\U0001F900-\U0001F992"
				   u"\u200d"
				   u"\u2640-\u2642"
				   u"\u2600-\u26FF"
				   "]+", flags=re.UNICODE)

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:5000"}})
# CORS(app, resources={r"/api/*": {"origins" : "*"}})

@app.route('/')
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def index():
	return render_template('form.html')

@app.route('/pagination', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def pagination():
	page_no = request.form['page_no']
	print("Page Number" +page_no);
	numFound = len(docspage)
	endpage = 10*int(page_no) - 1
	startpage = endpage - 10
	if(page_no == '1'):
		startpage = endpage-9
	print(startpage)
	print(endpage)
	final = {
			'numFound': numFound,
			'isquerynull': 'true',
			'docs': docspage[startpage:endpage]}
	return jsonify(final)

@app.route('/selectsearch', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def selectsearch():
	query = request.form['search_text']
	langset = request.form['langset']
	topicset = request.form['topicset']
	cityset = request.form['cityset']
	pseudoRel = request.form['pseudoRel']

	print(pseudoRel)
	langset = langset.split(',')
	topicset = topicset.split(',')
	cityset = cityset.split(',')

	print(langset)
	print(topicset)
	print(cityset)

	if(query == ""):
		final = {
				'isquerynull': 'false'
		}
	else:
		url = createfacetedquery(query, langset, topicset, cityset)
		url = url.replace(" ", "%20")
		data = urllib.request.urlopen(url)
		print(url)
		content = data.read()
		docs = json.loads(content.decode('utf-8'))
		numcount = docs['response']['numFound']
		docs = docs['response']['docs']
		if(pseudoRel == 'true'):
			print("pseudoRel Executed")
			alpha = docs[1]['tweet_text'][0]
			print(alpha)
			newq = emoji_pattern.sub(r'', alpha) # no emoji
			newq = " ".join(filter(lambda x:x[0]!='@', newq.split()))
			newq = re.sub(r'^https?:\/\/.*[\r\n]*', '', newq, flags=re.MULTILINE)
			newq = re.sub(r"http\S+", "", newq)
			newq = re.sub(r'[^\w\s]','',newq)
			newq = query + " " + newq
			url = createfacetedquery(newq, langset, topicset, cityset)
			url = url.replace(" ", "%20")
			ndata = urllib.request.urlopen(url)
			ncontent = ndata.read()
			ndocs = json.loads(ncontent.decode('utf-8'))
			ndocs = ndocs['response']['docs']
			docs = ndocs
		numFound = len(docs)
		sendvar = min(9, numFound)
		global docspage
		docspage = docs
		final = {
				'isquerynull': 'true',
				'docs': docs[0:sendvar],
				'numFound' : numFound}
		response = []
		response = [d['id'] for d in docs if 'id' in d]
		logfile = {'timestamp' : datetime.now(),
				'query' : query,
				'location_filters' : cityset,
				'topic_filters' : topicset,
				'language_filters' : langset,
				'response' : response}
		dbreturn = alllogs.insert_one(logfile)
		# print(str(docs).encode('utf-8'))
	return jsonify(final)

@app.route('/relevancelogs', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def relevancelogs():
	query = request.form['search_text']
	tweet_id = request.form['tweet_id']
	langset = request.form['langset']
	topicset = request.form['topicset']
	cityset = request.form['cityset']

	langset = langset.split(',')
	topicset = topicset.split(',')
	cityset = cityset.split(',')

	if(query == ""):
		final = {'registered': 'false'}
	else:
		final = {'registered': 'true'}
		logfile = {'timestamp' : datetime.now(),
				'query' : query,
				'location_filters' : cityset,
				'topic_filters' : topicset,
				'language_filters' : langset,
				'tweet_id' : tweet_id}
		dbreturn = relevance.insert_one(logfile)
	return jsonify(final)


def createfacetedquery(query, langset, topicset, cityset):
	query = urllib.parse.quote_plus(query)
	if(langset[0] == ''):
		langset = []
	if(topicset[0] == ''):
		topicset = []
	if(cityset[0] == ''):
		cityset = []
	url = 'http://localhost:8983/solr/1/select?'
	if((len(langset) != 0 and len(langset) != 5) or (len(topicset) != 0 and len(topicset) != 5) or (len(cityset) != 0 and len(cityset) != 5)):
		url = url + 'fq='
		if(len(langset) != 0 and len(langset) != 5):
			languages = ""
			for lang in langset:
				languages = languages + lang + " OR "
			languages = languages[:-4]
			url = url + 'tweet_lang:(' + languages + ')' + ' AND '
		if(len(topicset) != 0 and len(topicset) != 5):
			topics = ""
			for topic in topicset:
				topics = topics + topic + " OR "
			topics = topics[:-4]
			url = url + 'topic:(' + topics + ')' + ' AND '
		if(len(cityset) != 0 and len(cityset) != 5):
			cities = ""
			for city in cityset:
				cities = cities + city + " OR "
			cities = cities[:-4]
			url = url + 'city:(' + cities + ')'
		else:
			url = url[:-4]
	url = url + '&indent=on&q=' + query + '&wt=json&rows=1000'
	return url
if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0')
