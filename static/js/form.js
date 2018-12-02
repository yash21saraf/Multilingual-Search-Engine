
var langset = new Set();
var topicset = new Set();
var cityset = new Set();

var id = -1;
var tweets ;

function descriptiveFunctionName() {

  console.log("form 2 executed") ;
    $.ajax({
      data : {
        search_text: $('#search_text').val() ,
        topicset: Array.from(topicset).join(','),
        langset: Array.from(langset).join(','),
        cityset: Array.from(cityset).join(',')
      },
      type : 'POST',
      url : '/selectsearch'
    })
    .done(function(data) {
      if(data.isquerynull == "true"){
        console.log("Query was not null")
		    tweets = data.docs;
		    var htmlStr = "";
		    for (var i = 0; i <tweets.length; i++) {
			if(tweets[i].tweet_text != null){
				var tweetUrl = "https://twitter.com/statuses/"+tweets[i].id;
				htmlStr = htmlStr + "<div class='tweet-cont' data-url='" + tweetUrl + "'>";
				htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"
				htmlStr = htmlStr + "<div class='tweet_id' data-url='" + tweetUrl + "'> " + tweets[i].id + "</div>"
				htmlStr = htmlStr + "<div class='tweet_text' data-url='" + tweetUrl + "'> " + tweets[i].tweet_text + "</div>"
				htmlStr = htmlStr + "</div>"
			  }
		  }

		if(tweets.length > 0){
      console.log("length greater than 0 ")

    $("#tweets-div").html(htmlStr);
    $("#total-tweets").show();
    $("#chartContainer").show();
		$("#total-tweets").html("Tweets returned " + tweets.length);
		$("#chartContainer").CanvasJSChart(locationChart);

		$(".tweet-cont").on("click", function twitterHandle(e){
			var newTwitterURL = $(e.target).data("url");
			window.open(newTwitterURL, "_blank");
		});

		}
    else{
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
          cityset: Array.from(cityset).join(',')
			},
			type : 'POST',
			url : '/selectsearch'
		})
		.done(function(data) {
      if(data.isquerynull == "true"){
        console.log("Query was not null")
		tweets = data.docs;
		var htmlStr = "";
		for (var i = 0; i <tweets.length; i++) {
			if(tweets[i].tweet_text != null){
				var tweetUrl = "https://twitter.com/statuses/"+tweets[i].id;
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
		$("#total-tweets").html("Tweets returned " +tweets.length);
		$("#chartContainer").CanvasJSChart(locationChart);

		$(".tweet-cont").on("click", function twitterHandle(e){
			var newTwitterURL = $(e.target).data("url");
			window.open(newTwitterURL, "_blank");
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

function onclickchecker(){
  $("#english").change(function() {
    if(this.checked) {
      console.log("English Selected") ;
      updatelanguage("add" , "en", "lang") ;
    }
    else{
      console.log("English unelected") ;
      updatelanguage("remove" , "en", "lang") ;
    }
  });

  $("#hindi").change(function() {
    if(this.checked) {
      console.log("hindi Selected") ;
      updatelanguage("add" , "hi", "lang") ;
    }
    else{
      console.log("hindi unelected") ;
      updatelanguage("remove" , "hi", "lang") ;
    }
  });

  $("#french").change(function() {
    if(this.checked) {
      console.log("french Selected") ;
      updatelanguage("add" , "fr", "lang") ;
    }
    else{
      console.log("french unelected") ;
      updatelanguage("remove" , "fr", "lang") ;
    }
  });

  $("#spanish").change(function() {
    if(this.checked) {
      console.log("spanish Selected") ;
      updatelanguage("add" , "es", "lang") ;
    }
    else{
      console.log("spanish unelected") ;
      updatelanguage("remove" , "es", "lang") ;
    }
  });

  $("#thai").change(function() {
    if(this.checked) {
      console.log("thai Selected") ;
      updatelanguage("add" , "th", "lang") ;
    }
    else{
      console.log("thai unelected") ;
      updatelanguage("remove" , "th", "lang") ;
    }
  });

  $("#crime").change(function() {
    if(this.checked) {
      console.log("Crime Selected") ;
      updatelanguage("add" , "crime", "topic") ;
    }
    else{
      console.log("crime unelected") ;
      updatelanguage("remove" , "crime", "topic") ;
    }
  });

  $("#environment").change(function() {
    if(this.checked) {
      console.log("environment Selected") ;
      updatelanguage("add" , "environment", "topic") ;
    }
    else{
      console.log("environment unelected") ;
      updatelanguage("remove" , "environment", "topic") ;
    }
  });

  $("#infra").change(function() {
    if(this.checked) {
      console.log("infra Selected") ;
      updatelanguage("add" ,"infra", "topic") ;
    }
    else{
      console.log("infra unelected") ;
      updatelanguage("remove" ,"infra", "topic") ;
    }
  });

  $("#politics").change(function() {
    if(this.checked) {
      console.log("politics Selected") ;
      updatelanguage("add" ,"politics", "topic") ;
    }
    else{
      console.log("politics unelected") ;
      updatelanguage("remove", "politics", "topic") ;
    }
  });

  $("#unrest").change(function() {
    if(this.checked) {
      console.log("unrest Selected") ;
      updatelanguage("add","social unrest", "topic") ;
    }
    else{
      console.log("unrest unelected") ;
      updatelanguage("remove" ,"social unrest", "topic") ;
    }
  });


    $("#bangkok").change(function() {
      if(this.checked) {
        console.log("bangkok Selected") ;
        updatelanguage("add" , "bangkok", "place") ;
      }
      else{
        console.log("bangkok unelected") ;
        updatelanguage("remove" , "bangkok", "place") ;
      }
    });

    $("#delhi").change(function() {
      if(this.checked) {
        console.log("delhi Selected") ;
        updatelanguage("add" ,"delhi", "place") ;
      }
      else{
        console.log("delhi unelected") ;
        updatelanguage("remove" ,"delhi", "place") ;
      }
    });

    $("#mexico").change(function() {
      if(this.checked) {
        console.log("mexico Selected") ;
        updatelanguage("add" ,"mexico city", "place") ;
      }
      else{
        console.log("politics unelected") ;
        updatelanguage("remove", "mexico city", "place") ;
      }
    });

    $("#nyc").change(function() {
      if(this.checked) {
        console.log("nyc Selected") ;
        updatelanguage("add","nyc", "place") ;
      }
      else{
        console.log("nyc unelected") ;
        updatelanguage("remove" ,"nyc", "place") ;
      }
    });

    $("#paris").change(function() {
      if(this.checked) {
        console.log("paris Selected") ;
        updatelanguage("add","paris", "place") ;
      }
      else{
        console.log("paris unelected") ;
        updatelanguage("remove" ,"paris", "place") ;
      }
    });

    $("#mySelect").change(function() {
      var val = ""+location;
      updateCharts(location)
    });
}

function updatelanguage(operation, param, filter){

if(operation == "add"){
  if(filter == "lang"){
    langset.add(param);
  }
  if(filter == "topic"){
    topicset.add(param);
  }
  if(filter == "place"){
    cityset.add(param);
  }
}

if(operation == "remove"){
  if(filter == "lang"){
    langset.delete(param);
  }
  if(filter == "topic"){
    topicset.delete(param);
  }
  if(filter == "place"){
    cityset.delete(param);
  }
}

console.log(langset) ;
console.log(topicset) ;
console.log(cityset) ;

descriptiveFunctionName() ;

}

var dps = [{ y: 3, label: "Sweden" },
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
		dataPoints: dps
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

function updateCharts(value){
	console.log(value)
if(value === "location") {
$("#chartContainer").CanvasJSChart(locationChart);
}else if(value === "language")
{
	$("#chartContainer").CanvasJSChart(languageChart);
}
}



$(document).ready(function() {
    returnSearchResults();
    descriptiveFunctionName();
    onclickchecker() ;
});
