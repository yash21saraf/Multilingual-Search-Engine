from flask import Flask, render_template, request, jsonify, make_response, current_app
from flask_cors import CORS, cross_origin
from flask import Response
import json
import urllib.request, urllib.error
import urllib
import re

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:5000"}})
# CORS(app, resources={r"/api/*": {"origins" : "*"}})

@app.route('/')
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def index():
	return render_template('form.html')

@app.route('/selectsearch', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def selectsearch():
	query = request.form['search_text']
	print(query)
	query = urllib.parse.quote_plus(query)
	url = 'http://localhost:8983/solr/1/select?indent=on&q='+ query + '&wt=json'
	data = urllib.request.urlopen(url)
	content = data.read()
	docs = json.loads(content.decode('utf-8'))
	docs = docs['response']['docs']
	print(str(docs).encode('utf-8'))
	return jsonify(docs)


@app.route('/publisher', methods=['POST'])
def publisher():
	content = request.form['content']
	topic = request.form['topic_2']
	return jsonify({'error' : 'Missing data!'})


if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0')
