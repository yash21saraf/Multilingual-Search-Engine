var id = -1;
var tweets;
function languageSearch() {
	$('#form1').on('submit', function (event) {
		console.log("form1 executed");
		$.ajax({
			data: {
				search_text: $('#search_text').val()
			},
			type: 'POST',
			url: '/selectsearch'
		})
			.done(function (data) {
				tweets = data;
				var htmlStr = "";
				for (var i = 0; i < tweets.length; i++) {
					if (tweets[i].tweet_text != null) {
						var tweetUrl = "https://twitter.com/statuses/" + tweets[i].id;
						// "<div id='tweet-url'></div>"	
						htmlStr = htmlStr + "<div class='tweet-cont' data-url='" + tweetUrl + "'>";
						htmlStr = htmlStr + "<div class='tweet_user' data-url='" + tweetUrl + "'> " + tweets[i].hashtags + "</div>"
						htmlStr = htmlStr + "<div class='tweet_id' data-url='" + tweetUrl + "'> " + tweets[i].id + "</div>"
						htmlStr = htmlStr + "<div class='tweet_text' data-url='" + tweetUrl + "'> " + tweets[i].tweet_text + "</div>"
						htmlStr = htmlStr + "</div>"
					}
				}

				if (tweets.length > 0) {
					$("#tweets-div").html(htmlStr);

					$("#total-tweets").html("Tweets returned " + tweets.length);
					$("#chartContainer").CanvasJSChart(locationChart);
					$(".tweet-cont").on("click", function twitterHandle(e) {
						var newTwitterURL = $(e.target).data("url");
						window.open(newTwitterURL, "_blank");
					});
				} else {
					htmlStr = htmlStr + "<div class='error'> Please enter a valid query!</div>"
					$("#tweets-div").html(htmlStr);
					$("#total-tweets").hide();
					$("#chartContainer").hide();
				}
			});
		event.preventDefault();

		$('#example').pagination();


	});

	$('#example').pagination({
			total: 1,
			current: 1,
			length: 10,
			size: 2,
			prev: "&lt;",
			next: "&gt;",
			click: function(e) { }

	});


	$('#example').pagination({

		ajax: function(options, refresh, $target){
			$.ajax({
				url: 'data.json',
				data:{
					current: options.current,
					length: options.length
				},
				dataType: 'json'
			}).done(function(res){
				console.log(res.data);
				refresh({
					total: res.total, // optional
					length: res.length // optional
				});
			}).fail(function(error){
	
			});
		}
	
	});


	$("#english").change(function () {
		if (this.checked) {
			var htmlStr = "";
			var no_of_tweets = 0;
			for (var i = 0; i < tweets.length; i++) {
				if (tweets[i].text_en != null) {
					no_of_tweets++;
					htmlStr = htmlStr + "<div class='tweet_user'> " + tweets[i].hashtags + "</div>"
					htmlStr = htmlStr + "<div class='tweet_id'> " + tweets[i].id + "</div>"
					htmlStr = htmlStr + "<div class='tweet_text'> " + tweets[i].tweet_text[0] + "</div>"
				}
			}
			$("#tweets-div").html(htmlStr);
			$("#total-tweets").html("Tweets returned " + no_of_tweets);
			$("#chartContainer").CanvasJSChart(locationChart);
		}
	});


	$("#mySelect").change(function () {
		var val = "" + location;
		updateCharts(location)
	});

}

// function twitterHandle(){	
// 	console.log("clicked")
// 	$("#tweet-url").attr("url");
// 	var te = $('#tweet-url').attr("url");
// 	console.log(te)
// }	


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
	axisX: {
		interval: 1
	},
	axisY2: {
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


var languageData = [{ "label": "Hindi", "y": "20" }, { "label": "Thai", "y": "50" }, { "label": "English", "y": "30" }];
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
		yValueFormatString: "#,##0.#" % "",
		dataPoints: languageData
	}]
};

function updateCharts(value) {
	console.log(value)
	if (value === "location") {
		$("#chartContainer").CanvasJSChart(locationChart);
	} else if (value === "language") {
		$("#chartContainer").CanvasJSChart(languageChart);
	}
}



$(document).ready(function () {
	returnSearchResults();
});
