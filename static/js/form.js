var tweet_id = "" ;
var langset =[]
var topicset =[]
var cityset =[]
var pseudoRel = false;
var id = -1;
var tweets ;
var numtweets = 0 ;

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
				htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"
				htmlStr = htmlStr + "<div class='tweet_id' data-url='" + tweetUrl + "'> " + tweets[i].id + "</div>"
				htmlStr = htmlStr + "<div class='tweet_text' data-url='" + tweetUrl + "'> " + tweets[i].tweet_text + "</div>"
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
  		htmlStr = htmlStr + "<div class='error'> Please enter a valid query!</div>"
  		$("#tweets-div").html(htmlStr);
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
    numtweets = data.numFound
		var htmlStr = "";
		for (var i = 0; i <tweets.length; i++) {
			if(tweets[i].tweet_text != null){
				var tweetUrl = tweets[i].id;
				htmlStr = htmlStr + "<div class='tweet-cont' data-url='" + tweetUrl + "'>";
				htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"
				htmlStr = htmlStr + "<div class='tweet_id' data-url='" + tweetUrl + "'> " + tweets[i].id + "</div>"
				htmlStr = htmlStr + "<div class='tweet_text' data-url='" + tweetUrl + "'> " + tweets[i].tweet_text + "</div>"
				htmlStr = htmlStr + "</div>"
			}
		}

		if(tweets.length >0){
		$("#tweets-div").html(htmlStr);
    $("#total-tweets").show();
    $("#chartContainer").show();
		$("#total-tweets").html("Tweets returned " + numtweets);
		$("#chartContainer").CanvasJSChart(locationChart);
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
			//$("#tweets-div .tweet-cont").html(htmlStr);
		});
		}else{
		htmlStr = htmlStr + "<div class='error'> Please enter a valid query!</div>"
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
		var htmlStr = "";
		for (var i = 0; i <tweets.length; i++) {
			if(tweets[i].tweet_text != null){
				var tweetUrl = tweets[i].id;
				// "<div id='tweet-url'></div>"
				htmlStr = htmlStr + "<div class='tweet-cont' data-url='" + tweetUrl + "'>";
				htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"
				htmlStr = htmlStr + "<div class='tweet_id' data-url='" + tweetUrl + "'> " + tweets[i].id + "</div>"
				htmlStr = htmlStr + "<div class='tweet_text' data-url='" + tweetUrl + "'> " + tweets[i].tweet_text + "</div>"
				htmlStr = htmlStr + "</div>"
			}
		}

		if(tweets.length >0){
		$("#tweets-div").html(htmlStr);
    $("#total-tweets").show();
    $("#chartContainer").show();
		$("#total-tweets").html("Tweets returned " + numtweets);
		$("#chartContainer").CanvasJSChart(locationChart);
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
		htmlStr = htmlStr + "<div class='error'> Please enter a valid query!</div>"
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
  // var pseudo=document.getElementsByName('pseudo');
	for(var i=0; i<topicList.length; i++){
		if(topicList[i].type=='checkbox' && topicList[i].checked==true) {
      console.log("topics")
      topicsSet.add(topicList[i].id);
      console.log("Added topics")
		}
	}
	for(var i=0; i<cityList.length; i++){
		if(cityList[i].type=='checkbox' && cityList[i].checked==true) {
      // locationSet+=cityList[i].id;
      locationSet.add(cityList[i].id);
      
		}
	}
	for(var i=0; i<languageList.length; i++){
		if(languageList[i].type=='checkbox' && languageList[i].checked==true) {
      // languageSet+=languageList[i].id;
      languageSet.add(languageList[i].id);
		}
  }

  if(pseudo.checked)
  {
    pseudoRel = true;
  }else{
    pseudoRel =false;
  }

  console.log(languageSet);
  langset = languageSet;
  topicset = topicsSet;
  cityset = locationSet;
  filterCalls();
  
  $("#mySelect").change(function() {
    var val = ""+location;
    updateCharts(location)
  });
}


// Charts Functions
var locationData = [{ y: 3, label: "Sweden" },
{ y: 7, label: "Taiwan" },
{ y: 5, label: "Russia" },
{ y: 9, label: "Spain" },
{ y: 7, label: "Brazil" },
{ y: 7, label: "India" },
{ y: 9, label: "Italy" }];
var locationChart = {
	animationEnabled: true,
	title: {
		text: "Tweets segregation bar "
	},
	axisX:{
		interval: 1
	},
	axisY2:{
		interlacedColor: "rgba(1,77,101,.2)",
		gridColor: "rgba(1,77,101,.1)",
		title: "Number of Companies"
	},
	data: [{
		type: "bar",
		name: "companies",
		axisYType: "secondary",
		color: "#014D65",
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
		text: "Tweets segregation based on Languages"
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


var data1= [		
  { x: new Date(2014, 00, 01), y: 850 },
  { x: new Date(2014, 01, 01), y: 889 },
  { x: new Date(2014, 02, 01), y: 890 },
  { x: new Date(2014, 03, 01), y: 899 },
  { x: new Date(2014, 05, 02), y: 1170 },
  { x: new Date(2014, 06, 03), y: 1170 },
  { x: new Date(2014, 07, 04), y: 1170 },
  { x: new Date(2014, 08, 05), y: 1170 }] ;

  var data2= [	
    { x: new Date(2014, 00, 01), y: 1000 },
    { x: new Date(2014, 01, 01), y: 1010 },
    { x: new Date(2014, 02, 01), y: 1020 },
    { x: new Date(2014, 03, 01), y: 1030 },	
    { x: new Date(2014, 04, 01), y: 1040 },
    { x: new Date(2014, 05, 01), y: 889 },
    { x: new Date(2014, 06, 01), y: 890 },
    { x: new Date(2014, 07, 01), y: 899 },
    { x: new Date(2014, 08, 01), y: 1170 }] ;

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
		name: "San Fransisco",
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
	if(value === "location") {
	$("#chartContainer").CanvasJSChart(locationChart);
	}else if(value === "language")
	{
		$("#chartContainer").CanvasJSChart(languageChart);
	}else if(value === "topics")
	{
		$("#chartContainer").CanvasJSChart(topicChart);
  }
  else if(value === "timeSeriesCity")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChart);
  }
  else if(value === "timeSeriesLanguage")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChart);
  }
  else if(value === "timeSeriesTopic")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChart);
  }
  else if(value === "timeSeriesSentiments")
	{
		$("#chartContainer").CanvasJSChart(TimeSeriesChart);
	}
}


$(document).ready(function() {
    returnSearchResults();
    filterCalls();
    onclickchecker() ;
    userrelevance();
});
