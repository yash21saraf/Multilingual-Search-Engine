var tweet_id = "" ;
var langset =[]
var topicset =[]
var cityset =[]
var pseudoRel = false;
var id = -1;
var tweets ;
var numtweets = 0 ;
var totaltimeseries = []
var totaltimeseries01 = []
var totaltimeseries02 = []
var totaltimeseries03 = []
var totaltimeseries04 = []
var totaltimeseries05 = []
var totaltimeseries11 = []
var totaltimeseries12 = []
var totaltimeseries13 = []
var totaltimeseries14 = []
var totaltimeseries15 = []
var totaltimeseries21 = []
var totaltimeseries22 = []
var totaltimeseries23 = []
var totaltimeseries24 = []
var totaltimeseries25 = []
var totaltimeseriescity = []
var totaltimeseriestopics = []
var totaltimeserieslanguage = []
var cityTweetsdata = []
var languageTweetsdata = []
var topicsTweetsdata = []
var data1 = []

function userrelevance() {
  console.log("form 3 executed") ;
    $.ajax({
      data : {
        search_text: $('#search_text').val() ,
        topicset: Array.from(topicset).join(','),
        langset: Array.from(langset).join(','),
        cityset: Array.from(cityset).join(','),
        tweet_id: tweet_id,
        pseudoRel: pseudoRel
      },
      type : 'POST',
      url : '/relevancelogs'
    })
    .done(function(data) {
    if(data.registered == "true"){
      console.log("User relevance for query stored")
    }
    else{
      console.log("User relevance for query failed")
    }
	});
}

function pagination_function(page_no) {
  console.log("form 4 executed") ;
    $.ajax({
      data : {
        page_no: page_no
      },
      type : 'POST',
      url : '/pagination'
    })
    .done(function(data) {
      if(data.isquerynull == "true"){
        tweets = data.docs;
        console.log(tweets)
		    var htmlStr = "";
		    for (var i = 0; i <tweets.length; i++) {
			if(tweets[i].tweet_text != null){
				var tweetUrl = tweets[i].id;
				htmlStr = htmlStr + "<div class='tweet-cont' data-url='" + tweetUrl + "'>";
				if(tweets[i].hashtags != null)
					{htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"}
				htmlStr = htmlStr + "<div class='tweet_id' data-url='" + tweetUrl + "'> " + tweets[i].id + "</div>"
				htmlStr = htmlStr + "<div class='tweet_text' data-url='" + tweetUrl + "'> " + tweets[i].tweet_text + "</div>"
				if(tweets[i].hashtags !=null){
				htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"
			}
				htmlStr = htmlStr + "</div>"
        }
      }

		if(tweets.length > 0){
      console.log("length greater than 0 ")
      $("#tweets-div").empty();
      $("#tweets-div").html(htmlStr);
		 $(".tweet-cont").on("click", function twitterHandle(e){
			var newTwitterURL = $(e.target).data("url");
      tweet_id = newTwitterURL ;
      newTwitterURL = "https://twitter.com/statuses/" + newTwitterURL
      userrelevance() ;
			window.open(newTwitterURL, "_blank");
		});
		}
    else{
  		htmlStr = htmlStr + "<div class='error'> No search results.. please enter a relevant query!</div>"
			$("#tweets-div").html(htmlStr);
			$("#total-tweets").hide();
			$("#chartContainer").hide();
		}
  }
		});
}


function filterCalls() {
  console.log("form 2 executed") ;
    $.ajax({
      data : {
        search_text: $('#search_text').val() ,
        topicset: Array.from(topicset).join(','),
        langset: Array.from(langset).join(','),
        cityset: Array.from(cityset).join(','),
        pseudoRel: pseudoRel
      },
      type : 'POST',
      url : '/selectsearch'
    })
		.done(function(data) {
      if(data.isquerynull == "true"){
        console.log("Query was not null")
		tweets = data.docs;
    numtweets = data.numFound;
    		tweets = data.docs;
    numtweets = data.numFound
    timeseries = data.timeseries
    citytimeseries = data.citytimeseries
    languagetimeseries = data.languagetimeseries
    topicstimeseries = data.topictimeseries
    citysentimentseries = data.citysentimentseries
    languagesentimentseries = data.languagesentimentseries
    topicssentimentseries = data.topicssentimentseries
    citycount = data.countlist.citycount
    topicscount = data.countlist.topicscount
    languagecount = data.countlist.languagecount

    createdata() ;
    createtweetsdatacity() ;
    createtweetsdatalanguage() ;
    createtweetsdatatopics() ;
    createdata01();
    createdata02();
    createdata03();
    createdata04();
    createdata05();
    createdata11();
    createdata12();
    createdata13();
    createdata14();
    createdata15();
    createdata21();
    createdata22();
    createdata23();
    createdata24();
    createdata25();
    console.log(timeseries)

		var htmlStr = "";
		for (var i = 0; i <tweets.length; i++) {
			if(tweets[i].tweet_text != null){
				var tweetUrl = tweets[i].id;
				htmlStr = htmlStr + "<div class='tweet-cont' data-url='" + tweetUrl + "'>";
								if(tweets[i].hashtags != null)
					{htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"}
				htmlStr = htmlStr + "<div class='tweet_id' data-url='" + tweetUrl + "'> " + tweets[i].id + "</div>"
				htmlStr = htmlStr + "<div class='tweet_text' data-url='" + tweetUrl + "'> " + tweets[i].tweet_text + "</div>"
				if(tweets[i].hashtags !=null){
				htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"
			}
				htmlStr = htmlStr + "</div>"
			}
		}

		if(tweets.length >0){
		$("#tweets-div").html(htmlStr);
    $("#total-tweets").show();
    $("#chartContainer").show();
		$("#total-tweets").html("Tweets returned " + numtweets);
		$("#chartContainer").CanvasJSChart(totalTweetsChart);
		$(".tweet-cont").on("click", function twitterHandle(e){
			var newTwitterURL = $(e.target).data("url");
      tweet_id = newTwitterURL ;
      newTwitterURL = "https://twitter.com/statuses/" + newTwitterURL
			window.open(newTwitterURL, "_blank");
    });
    $('#page-selection').bootpag({
			total: Math.ceil(numtweets/10),
			page: 1,
			maxVisible: 10
		}).on("page", function(event, num){
      console.log(num)
      pagination_function(num);
		});
		}else{
		htmlStr = htmlStr + "<div class='error'>No results Found</div>"
		$("#tweets-div").html(htmlStr);
		$("#total-tweets").hide();
		$("#chartContainer").hide();
		}
  }
		});
	}

function returnSearchResults() {
  $('#form1').on('submit', function(event) {
  console.log("form1 executed") ;
		$.ajax({
			data : {
          search_text: $('#search_text').val() ,
          topicset: Array.from(topicset).join(','),
          langset: Array.from(langset).join(','),
          cityset: Array.from(cityset).join(','),
          pseudoRel: pseudoRel
			},
			type : 'POST',
			url : '/selectsearch'
		})
		.done(function(data) {
      if(data.isquerynull == "true"){
        console.log("Query was not null")
        console.log(data)
		tweets = data.docs;
    numtweets = data.numFound
    timeseries = data.timeseries
    citytimeseries = data.citytimeseries
    languagetimeseries = data.languagetimeseries
    topicstimeseries = data.topictimeseries
    citycount = data.countlist.citycount
    topicscount = data.countlist.topicscount
    languagecount = data.countlist.languagecount

    createdata() ;
    createtweetsdatacity() ;
    createtweetsdatalanguage() ;
    createtweetsdatatopics() ;
    createdata01();
    createdata02();
    createdata03();
    createdata04();
    createdata05();
    createdata11();
    createdata12();
    createdata13();
    createdata14();
    createdata15();
    createdata21();
    createdata22();
    createdata23();
    createdata24();
    createdata25();
    console.log(timeseries)
		var htmlStr = "";
		for (var i = 0; i <tweets.length; i++) {
			if(tweets[i].tweet_text != null){
				var tweetUrl = tweets[i].id;
				// "<div id='tweet-url'></div>"
				htmlStr = htmlStr + "<div class='tweet-cont' data-url='" + tweetUrl + "'>";
								if(tweets[i].hashtags != null)
					{htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"}
				htmlStr = htmlStr + "<div class='tweet_id' data-url='" + tweetUrl + "'> " + tweets[i].id + "</div>"
				htmlStr = htmlStr + "<div class='tweet_text' data-url='" + tweetUrl + "'> " + tweets[i].tweet_text + "</div>"
				if(tweets[i].hashtags !=null){
				htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"
			}

				htmlStr = htmlStr + "</div>"
			}
		}

		if(tweets.length >0){
		$("#tweets-div").html(htmlStr);
    $("#total-tweets").show();
    $("#chartContainer").show();
		$("#total-tweets").html("Tweets returned " + numtweets);
		$("#chartContainer").CanvasJSChart(totalTweetsChart);
		$(".tweet-cont").on("click", function twitterHandle(e){
			var newTwitterURL = $(e.target).data("url");
      tweet_id = newTwitterURL ;
      newTwitterURL = "https://twitter.com/statuses/" + newTwitterURL
			window.open(newTwitterURL, "_blank");
    });

    $('#page-selection').bootpag({
			total: Math.ceil(numtweets/10),
			page: 1,
			maxVisible: 10
		}).on("page", function(event, num){
      pagination_function(num);
			//$("#tweets-div .tweet-cont").html(htmlStr);
    });

		}else{
		htmlStr = htmlStr + "<div class='error'> No results Found</div>"
		$("#tweets-div").html(htmlStr);
		$("#total-tweets").hide();
		$("#chartContainer").hide();
		}
  }
		});
		event.preventDefault();
		});
}

function onclickchecker(getValue) {
  var languageSet = new Set();
  var topicsSet= new Set();
  var locationSet= new Set();
	var topicList=document.getElementsByName('topic');
	var cityList=document.getElementsByName('city');
  var languageList=document.getElementsByName('language');
	for(var i=0; i<topicList.length; i++){
		if(topicList[i].type=='checkbox' && topicList[i].checked==true) {
      console.log("topics")
      topicsSet.add(topicList[i].id);
      console.log("Added topics")
		}
	}
	for(var i=0; i<cityList.length; i++){
		if(cityList[i].type=='checkbox' && cityList[i].checked==true) {
      locationSet.add(cityList[i].id);

		}
	}
	for(var i=0; i<languageList.length; i++){
		if(languageList[i].type=='checkbox' && languageList[i].checked==true) {
      languageSet.add(languageList[i].id);
		}
  }

  if(pseudo.checked == true)
  {
    pseudoRel = true;
  }else{
    pseudoRel = false;

	}

	filterCalls();

  $("#mySelect").change(function() {
    updateCharts(location)
  });

  console.log(pseudoRel);
  langset = languageSet;
  topicset = topicsSet;
  cityset = locationSet;
}


// Charts Functions
var totalTweetsData = [{ y: 3, label: "Sweden" },
{ y: 7, label: "Taiwan" },
{ y: 5, label: "Russia" },
{ y: 9, label: "Spain" },
{ y: 7, label: "Brazil" },
{ y: 7, label: "India" },
{ y: 9, label: "Italy" }];
var totalTweetsChart = {
	animationEnabled: true,
	title: {
		text: "Tweets segregation based on Count"
	},
	axisX:{
		interval: 1
	},
	axisY2:{
		interlacedColor: "rgba(1,77,101,.2)",
		gridColor: "rgba(1,77,101,.1)",
		title: ""
	},
	data: [{
		type: "bar",
		name: "location",
		axisYType: "secondary",
		color: "#014D65",
		dataPoints: totalTweetsData
}]
};


// var languageData =  [{"label":"Hindi","y":"20"},{"label":"Thai","y":"50"},{"label":"English","y":"30"}];
var languageChart = {
	title: {
		text: "Tweets segregation based on Languages"
	},
	data: [{
			type: "pie",
			startAngle: 45,
			showInLegend: "true",
			legendText: "{label}",
			indexLabel: "{label}",
			yValueFormatString:"#,##0.#"%"",
			dataPoints: languageTweetsdata
	}]
};

var locationChart = {
	title: {
		text: "Tweets segregation based on Languages"
	},
	data: [{
			type: "pie",
			startAngle: 45,
			showInLegend: "true",
			legendText: "{label}",
			indexLabel: "{label}",
			yValueFormatString:"#,##0.#"%"",
			dataPoints: cityTweetsdata
	}]
};

var topicChart = {
	title: {
		text: "Tweets segregation based on Topics"
	},
	data: [{
			type: "pie",
			startAngle: 45,
			showInLegend: "true",
			legendText: "{label}",
			indexLabel: "{label}",
			yValueFormatString:"#,##0.#"%"",
			dataPoints: topicsTweetsdata
	}]
};
// var totaltimeseries = []
// var totaltimeseriescity = []
// var totaltimeseriestopics = []
// var totaltimeserieslanguage = []


//     numtweets = data.numFound
//     timeseries = data.timeseries
//     cityseries = data.citytimeseries
//     languageseries = data.languagetimeseries
//     topicsseries = data.topicstimeseries

function createdata(){
  totaltimeseries.length = 0
  for(i = 0 ; i < timeseries[0].length ; i++){
  var temp = {x: new Date(timeseries[0][i]), y: timeseries[1][i]}
  totaltimeseries.push(temp) ;
  }
}

function createdata01(){
	totaltimeseries01.length = 0
  for(i = 0 ; i < citytimeseries['bangkok'][0].length ; i++){
  var temp = {x: new Date(citytimeseries['bangkok'][0][i]), y: citytimeseries['bangkok'][1][i]}
  totaltimeseries01.push(temp) ;
  }
}

function createdata02(){
  totaltimeseries02.length = 0
  for(i = 0 ; i < citytimeseries['mexico city'][0].length ; i++){
  var temp = {x: new Date(citytimeseries['mexico city'][0][i]), y: citytimeseries['mexico city'][1][i]}
  totaltimeseries02.push(temp) ;
  }
}

function createdata03(){
  totaltimeseries03.length = 0
  for(i = 0 ; i < citytimeseries['delhi'][0].length ; i++){
  var temp = {x: new Date(citytimeseries['delhi'][0][i]), y: citytimeseries['delhi'][1][i]}
  totaltimeseries03.push(temp) ;
  }
}

function createdata04(){
  totaltimeseries04.length = 0
  for(i = 0 ; i < citytimeseries['paris'][0].length ; i++){
  var temp = {x: new Date(citytimeseries['paris'][0][i]), y: citytimeseries['paris'][1][i]}
  totaltimeseries04.push(temp) ;
  }
}

function createdata05(){
  totaltimeseries05.length = 0
  for(i = 0 ; i < citytimeseries['nyc'][0].length ; i++){
  var temp = {x: new Date(citytimeseries['nyc'][0][i]), y: citytimeseries['nyc'][1][i]}
  totaltimeseries05.push(temp) ;
  }
}

function createdata11(){
  totaltimeseries12.length = 0
  for(i = 0 ; i < languagetimeseries['es'][0].length ; i++){
  var temp = {x: new Date(languagetimeseries['es'][0][i]), y: languagetimeseries['es'][1][i]}
  totaltimeseries12.push(temp) ;
  }
}

function createdata12(){
totaltimeseries13.length = 0
  for(i = 0 ; i < languagetimeseries['hi'][0].length ; i++){
  var temp = {x: new Date(languagetimeseries['hi'][0][i]), y: languagetimeseries['hi'][1][i]}
  totaltimeseries13.push(temp) ;
  }
}

function createdata13(){
	totaltimeseries14.length = 0
  for(i = 0 ; i < languagetimeseries['fr'][0].length ; i++){
  var temp = {x: new Date(languagetimeseries['fr'][0][i]), y: languagetimeseries['fr'][1][i]}
  totaltimeseries14.push(temp) ;
  }
}

function createdata14(){
	totaltimeseries15.length = 0
  for(i = 0 ; i < languagetimeseries['th'][0].length ; i++){
  var temp = {x: new Date(languagetimeseries['th'][0][i]), y: languagetimeseries['th'][1][i]}
  totaltimeseries15.push(temp) ;
  }
}

function createdata15(){
	totaltimeseries11.length = 0
  for(i = 0 ; i < languagetimeseries['en'][0].length ; i++){
  var temp = {x: new Date(languagetimeseries['en'][0][i]), y: languagetimeseries['en'][1][i]}
  totaltimeseries11.push(temp) ;
  }
}
function createdata21(){
	totaltimeseries21.length = 0
  for(i = 0 ; i < topicstimeseries['environment'][0].length ; i++){
  var temp = {x: new Date(topicstimeseries['environment'][0][i]), y: topicstimeseries['environment'][1][i]}
  totaltimeseries21.push(temp) ;
  }
}
function createdata22(){
	totaltimeseries22.length = 0
  for(i = 0 ; i < topicstimeseries['social unrest'][0].length ; i++){
  var temp = {x: new Date(topicstimeseries['social unrest'][0][i]), y: topicstimeseries['social unrest'][1][i]}
  totaltimeseries22.push(temp) ;
  }
}
function createdata23(){
	totaltimeseries23.length = 0
  for(i = 0 ; i < topicstimeseries['infra'][0].length ; i++){
  var temp = {x: new Date(topicstimeseries['infra'][0][i]), y: topicstimeseries['infra'][1][i]}
  totaltimeseries23.push(temp) ;
  }
}
function createdata24(){
	totaltimeseries24.length = 0
  for(i = 0 ; i < topicstimeseries['politics'][0].length ; i++){
  var temp = {x: new Date(topicstimeseries['politics'][0][i]), y: topicstimeseries['politics'][1][i]}
  totaltimeseries24.push(temp) ;
  }
}
function createdata25(){
	totaltimeseries25.length = 0
  for(i = 0 ; i < topicstimeseries['crime'][0].length ; i++){
  var temp = {x: new Date(topicstimeseries['crime'][0][i]), y: topicstimeseries['crime'][1][i]}
  totaltimeseries25.push(temp) ;
  }
}

function createtweetsdatacity(){
  cityTweetsdata.length = 0
  for(i = 0 ; i < citycount[0].length ; i++){
  var temp = {"label" : ''+citycount[0][i], "y" : ''+citycount[1][i]}
  cityTweetsdata.push(temp) ;
  }
}

function createtweetsdatalanguage(){
  languageTweetsdata.length = 0
  for(i = 0 ; i < languagecount[0].length ; i++){
  var temp = {"label" : ''+languagecount[0][i], "y" : ''+languagecount[1][i]}
  languageTweetsdata.push(temp) ;
  }
}

function createtweetsdatatopics(){
  topicsTweetsdata.length = 0
  for(i = 0 ; i < topicscount[0].length ; i++){
  var temp = {"label" : ''+topicscount[0][i], "y" : ''+topicscount[1][i]}
  topicsTweetsdata.push(temp) ;
  }
}


var data1
var data2
var TimeSeriesChart = {
	title: {
		text: ""
	},
	axisX: {
		valueFormatString: "MMM YYYY"
	},
	axisY2: {
		title: "Tweet Counts"
	},
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: false,
		itemclick: toogleDataSeries
	},
	data: [
    {
      type:"line",
      axisYType: "secondary",
      name: "Complete Data",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries
      }]
};


var TimeSeriesChartLanguages = {
	title: {
		text: ""
	},
	axisX: {
		valueFormatString: "MMM YYYY"
	},
	axisY2: {
		title: "Tweet Languages"
	},
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: false,
		itemclick: toogleDataSeries
	},
	data: [
    {
      type:"line",
      axisYType: "secondary",
      name: "en",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries11
      },
      {
      type:"line",
      axisYType: "secondary",
      name: "es",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries12
      },{
      type:"line",
      axisYType: "secondary",
      name: "hi",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries13
      },{
      type:"line",
      axisYType: "secondary",
      name: "fr",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries14
      },{
      type:"line",
      axisYType: "secondary",
      name: "th",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries15
      }]
};

var TimeSeriesChartTopics = {
	title: {
		text: ""
	},
	axisX: {
		valueFormatString: "MMM YYYY"
	},
	axisY2: {
		title: "Tweet Topics"
	},
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: false,
		itemclick: toogleDataSeries
	},
	data: [
    {
      type:"line",
      axisYType: "secondary",
      name: "Environment",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries21
      },
      {
      type:"line",
      axisYType: "secondary",
      name: "Social unrest",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries22
      },{
      type:"line",
      axisYType: "secondary",
      name: "Infrastructure",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries23
      },{
      type:"line",
      axisYType: "secondary",
      name: "Politics",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries24
      },{
      type:"line",
      axisYType: "secondary",
      name: "Crime",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries25
      }]
};

var TimeSeriesChartCity = {
	title: {
		text: ""
	},
	axisX: {
		valueFormatString: "MMM YYYY"
	},
	axisY2: {
		title: "Tweet City"
	},
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: false,
		itemclick: toogleDataSeries
	},
	data: [
    {
      type:"line",
      axisYType: "secondary",
      name: "Bangkok",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries01
      },
      {
      type:"line",
      axisYType: "secondary",
      name: "Mexico City",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries02
      },{
      type:"line",
      axisYType: "secondary",
      name: "Delhi",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries03
      },{
      type:"line",
      axisYType: "secondary",
      name: "Paris",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries04
      },{
      type:"line",
      axisYType: "secondary",
      name: "NYC",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: totaltimeseries05
      }]
};

function toogleDataSeries(e){
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else{
		e.dataSeries.visible = true;
	}
	chart.render();
}

function updateCharts(value){
	console.log(value)
	if(value === "totalTweet") {
		$("#chartContainer").CanvasJSChart(totalTweetsChart);
		$("#chartContainer").show();
		}
	else if(value === "location") {
	$("#chartContainer").CanvasJSChart(locationChart);
	$("#chartContainer").show();
	}else if(value === "language")
	{
		$("#chartContainer").CanvasJSChart(languageChart);
		$("#chartContainer").show();
	}else if(value === "topics")
	{
		$("#chartContainer").CanvasJSChart(topicChart);
		$("#chartContainer").show();
  }
  else if(value === "timeSeriesCity")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChartCity);
		$("#chartContainer").show();
  }
  else if(value === "timeSeriesLanguage")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChartLanguages);
		$("#chartContainer").show();
  }
  else if(value === "timeSeriesTopic")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChartTopics);
		$("#chartContainer").show();
  }
  else if(value === "timeSeriesSentiments")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChart);
		$("#chartContainer").show();
	}
}


$(document).ready(function() {
    returnSearchResults();
    filterCalls();
    onclickchecker() ;
    userrelevance();
});
