function descriptiveFunctionName() {

  $('#form2').on('submit', function(event) {
  console.log("form 2 executed") ;
    $.ajax({
      data : {
        content : $('#content').val(),
          topic_2 : $('#topic_2 option:selected').val()
      },
      type : 'POST',
      url : '/publisher'
    })
    .done(function(data) {

      if (data.error) {
        $('#errorAlert').text(data.error).show();
        $('#successAlert').hide();
      }
      else {
        $('#successAlert').text(data.content).show();
        $('#errorAlert').hide();
      }

    });

    event.preventDefault();

  });
}

var id = -1;
var tweets ;
function returnSearchResults() {
  $('#form1').on('submit', function(event) {
  console.log("form1 executed") ;
		$.ajax({
			data : {
                search_text: $('#search_text').val()
			},
			type : 'POST',
			url : '/selectsearch'
		})
		.done(function(data) {
		tweets = data;
		var htmlStr = "";
		for (var i = 0; i <tweets.length; i++) {
			if(tweets[i].tweet_text != null){
				htmlStr = htmlStr + "<div class='tweet_user'> " + tweets[i].hashtags + "</div>"	
				htmlStr = htmlStr + "<div class='tweet_id'> " + tweets[i].id + "</div>"	
				htmlStr = htmlStr + "<div class='tweet_text'> " + tweets[i].tweet_text + "</div>"	
			}				
		}

	// 	for(var i=0; i < tweets.length; i++){
	// 		var newDiv = document.createElement('div');
	// 		newDiv.id = 'r'+i;
	// 		newDiv.className = 'tweet_user';
	// 		newDiv.className = 'tweet_id';
	// 		newDiv.className = 'tweet_text';
	// 		toAdd.appendChild(newDiv);
	//  }

	//  for(var i=0; i < tweets.length; i++){
	// 	id = 'r'+i;
	// 	document.getElementById(id).innerHTML

		if(tweets.length >0){
		$("#tweets-div").html(htmlStr);
		$("#total-tweets").html("Tweets returned " +tweets.length);
		$("#chartContainer").CanvasJSChart(locationChart);
		}else{		
		htmlStr = htmlStr + "<div class='error'> Please enter a valid query!</div>" 
		$("#tweets-div").html(htmlStr);	
		$("#total-tweets").hide();
		}
		
		});
		event.preventDefault();
		
		});	
	
	$("#english").change(function() {
		if(this.checked) {
			var htmlStr = "";
			var no_of_tweets = 0;
			for (var i = 0; i < tweets.length; i++) {
				if(tweets[i].text_en != null){
					no_of_tweets++;
					htmlStr = htmlStr + "<div class='tweet_user'> " + tweets[i].hashtags + "</div>"	
					htmlStr = htmlStr + "<div class='tweet_id'> " + tweets[i].id + "</div>"	
					htmlStr = htmlStr + "<div class='tweet_text'> " + tweets[i].tweet_text[0] + "</div>"
					
				}				
			}
			$("#tweets-div").html(htmlStr);
			$("#total-tweets").html("Tweets returned " +no_of_tweets);
			$("#chartContainer").CanvasJSChart(locationChart);
		}
	});


	$("#mySelect").change(function() {
		var val = ""+location;
		updateCharts(location)
	});

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
});
