var tweet_id = "" ;
var langset =[]
var topicset =[]
var cityset =[]
var pseudoRel = false;
var id = -1;
var tweets ;
var numtweets = 0 ;
var timeseries;

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

		var htmlStr = "";
		for (var i = 0; i <tweets.length; i++) {
			if(tweets[i].tweet_text != null){
				var tweetUrl = tweets[i].id;
				htmlStr = htmlStr + "<div class='tweet-cont' data-url='" + tweetUrl + "'>";
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
		htmlStr = htmlStr + "<div class='error'> No search results.. please enter a relevant query!</div>"
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
		tweets = data.docs;
    numtweets = data.numFound
    timeseries = data.timeseries
    console.log(timeseries)
		var htmlStr = "";
		for (var i = 0; i <tweets.length; i++) {
			if(tweets[i].tweet_text != null){
				var tweetUrl = tweets[i].id;
				// "<div id='tweet-url'></div>"
				htmlStr = htmlStr + "<div class='tweet-cont' data-url='" + tweetUrl + "'>";
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
		htmlStr = htmlStr + "<div class='error'> No search results.. please enter a relevant query!</div>"
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


var locationData =  [{"label":"Hindi","y":"20"},{"label":"Thai","y":"50"},{"label":"English","y":"30"}];
var locationChart = {
	title: {
		text: "Tweets segregation based on Location"
	},
	data: [{
			type: "pie",
			startAngle: 45,
			showInLegend: "true",
			legendText: "{label}",
			indexLabel: "{label}",
			yValueFormatString:"#,##0.#"%"",
			dataPoints: locationData
	}]
};

var languageData =  [{"label":"Hindi","y":"20"},{"label":"Thai","y":"50"},{"label":"English","y":"30"}];
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
			dataPoints: languageData
	}]
};


var topicData =  [{"label":"Hindi","y":"20"},{"label":"Thai","y":"50"},{"label":"English","y":"30"}];
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
			dataPoints: topicData
	}]
};


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
	data: [{
		type:"line",
		axisYType: "secondary",
		name: "",
		showInLegend: true,
		markerSize: 0,
		yValueFormatString: "######",
		dataPoints: data1 
    },
    {
      type:"line",
      axisYType: "secondary",
      name: "London",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "######",
      dataPoints: data2 
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
	}else if(value === "topics")
	{
		$("#chartContainer").CanvasJSChart(topicChart);
		$("#chartContainer").show();
  }
  else if(value === "timeSeriesCity")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChart);
		$("#chartContainer").show();
  }
  else if(value === "timeSeriesLanguage")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChart);
		$("#chartContainer").show();
  }
  else if(value === "timeSeriesTopic")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChart);
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
