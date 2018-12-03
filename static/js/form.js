
var langset = new Set();
var topicset = new Set();
var cityset = new Set();
var tweet_id = "" ;

var id = -1;
var tweets ;

function userrelevance() {

  console.log("form 3 executed") ;
    $.ajax({
      data : {
        search_text: $('#search_text').val() ,
        topicset: Array.from(topicset).join(','),
        langset: Array.from(langset).join(','),
        cityset: Array.from(cityset).join(','),
        tweet_id: tweet_id
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



function filterCalls() {

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

    $("#tweets-div").html(htmlStr);
    $("#total-tweets").show();
    $("#chartContainer").show();
		$("#total-tweets").html("Tweets returned " + tweets.length);
		$("#chartContainer").CanvasJSChart(locationChart);

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
		$("#total-tweets").html("Tweets returned " +tweets.length);
		$("#chartContainer").CanvasJSChart(locationChart);
		$(".tweet-cont").on("click", function twitterHandle(e){
			var newTwitterURL = $(e.target).data("url");
      tweet_id = newTwitterURL ;
      newTwitterURL = "https://twitter.com/statuses/" + newTwitterURL
			window.open(newTwitterURL, "_blank");
		});

		// $('#show_paginator').bootpag({
		// 	total: 23,
		// 	page: 3,
		// 	maxVisible: 10
		// }).on('page', function(event, num)
		// {
		// 	console.log("Inside Debugger" +htmlStr);
		// 	$("#tweets-div .tweet-cont").html(htmlStr +num); // or some ajax content loading...
		// });

		// $('#page-selection').bootpag({
		// 	total: 23,
		// 	page: 1,
		// 	maxVisible: 10
		// }).on("page", function(event, num){
		// 	$("#tweets-div .tweet-cont").html(htmlStr);
		// 	//$(this).bootpag({total: 10, maxVisible: 50}); // some ajax content loading...
		// });

	
		//getPageList(totalPages, page, maxLength)

			// numberOfItems = $("#tweets-div .tweet-cont").length;
			// var limitPerPage = 8;
			// $('#tweets-div .tweet-cont:gt(' + (limitPerPage - 1) + ')').hide(); 
			// var totalPages = Math.round(numberOfItems / limitPerPage); 
			// $(".pagination").append("<li id='previous-page'><a href='javascript:void(0)' aria-label=Previous><span aria-hidden=true>&laquo;</span></a></li>");
			// $(".pagination").append("<li class='current-page active'> <a href='javascript:void(0)'>" + 1 + "</a></li>");
			// for (var i = 2; i <= totalPages; i++) {
			// 	$(".pagination").append("<li class='current-page'><a href='javascript:void(0)'>" + i + "</a></li>"); 
			// }
			// $(".pagination").append("<li id='next-page'><a href='javascript:void(0)' aria-label=Next><span aria-hidden=true>&raquo;</span></a></li>"); 
			// $(".pagination li.current-page").on("click", function() {	
			// 	if ($(this).hasClass('active'))
			// 	{
			// 		return false;
			// 	} else {
			// 		$("#submit").remove();
			// 		var currentPage = $(this).index();
			// 		$("#total-tweets").html("Page " +currentPage+" of about "+numberOfItems+ " results");
			// 		$(".pagination li").removeClass('active'); 
			// 		$(this).addClass('active');
			// 		$("#tweets-div .tweet-cont").hide(); 
			// 		var grandTotal = limitPerPage * currentPage; 
			// 		for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
			// 			$("#tweets-div .tweet-cont:eq(" + i + ")").show();
			// 		}
			// 	}
				
			// });

			// $("#next-page").on("click", function() {
			// 	$("#submit").remove();
			// 	var currentPage = $(".pagination li.active").index();
			// 	$("#total-tweets").html("Page " +currentPage+" of about "+numberOfItems+ " results"); // Identify the current active page
			// 	// Check to make sure that navigating to the next page will not exceed the total number of pages
			// 	if (currentPage === totalPages) {
			// 	return false; // Return false (i.e., cannot navigate any further, since it would exceed the maximum number of pages)
			// 	} else {
			// 	currentPage++; // Increment the page by one
			// 	$(".pagination li").removeClass('active'); // Remove the 'active' class status from the current page
			// 	$("#tweets-div .tweet-cont").hide(); // Hide all items in the pagination loop
			// 	var grandTotal = limitPerPage * currentPage; // Get the total number of items up to the page that was selected
			
			// 	// Loop through total items, selecting a new set of items based on page number
			// 	for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
			// 		$("#tweets-div .tweet-cont:eq(" + i + ")").show(); // Show items from the new page that was selected
			// 	}
			
			// 	$(".pagination li.current-page:eq(" + (currentPage - 1) + ")").addClass('active'); // Make new page number the 'active' page
			// 	}
			// });
			
			
			// $("#previous-page").on("click", function() {
			// 	var currentPage = $(".pagination li.active").index(); 
			// 	if (currentPage === 1) {
			// 		$("#submit").show();
			// 		$("#total-tweets").html("About " +tweets.length +" results");
			// 		return false; 
			// 	} else {
			// 	currentPage--; 
			// 	$("#total-tweets").html("Page " +currentPage+" of about "+numberOfItems+ " results");
			// 	$(".pagination li").removeClass('active'); 
			// 	$("#tweets-div .tweet-cont").hide(); 
			// 	var grandTotal = limitPerPage * currentPage; 
			
			// 	for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
			// 		$("#tweets-div .tweet-cont:eq(" + i + ")").show(); 
			// 	}
			
			// 	$(".pagination li.current-page:eq(" + (currentPage - 1) + ")").addClass('active'); 
			// 	}
			// });

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

filterCalls();

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
	}else if(value === "topics")
	{
		$("#chartContainer").CanvasJSChart(topicChart);
	}
}

function getSelected(getValue) {
	console.log(getValue)
	var topicList=document.getElementsByName('topic');
	var cityList=document.getElementsByName('city');
	var languageList=document.getElementsByName('language');
	var topicItems="";
	var cityItems="";
	var languageItems="";
	for(var i=0; i<topicList.length; i++){
		if(topicList[i].type=='checkbox' && topicList[i].checked==true) {
			topicItems+=topicList[i].id+",";
			console.log(topicList.length)
			console.log(topicItems.length)
		}
	}
	for(var i=0; i<cityList.length; i++){
		if(cityList[i].type=='checkbox' && cityList[i].checked==true) {
			cityItems+=cityList[i].id+",";
		}
	}
	for(var i=0; i<languageList.length; i++){
		if(languageList[i].type=='checkbox' && languageList[i].checked==true) {
			languageItems+=languageList[i].id+",";
		}
	}
}



// function getPageList(totalPages, page, maxLength) {
// 	debugger;
//     if (maxLength < 5) throw "maxLength must be at least 5";

//     function range(start, end) {
//         return Array.from(Array(end - start + 1), (_, i) => i + start); 
//     }

//     var sideWidth = maxLength < 9 ? 1 : 2;
//     var leftWidth = (maxLength - sideWidth*2 - 3) >> 1;
//     var rightWidth = (maxLength - sideWidth*2 - 2) >> 1;
//     if (totalPages <= maxLength) {
//         // no breaks in list
//         return range(1, totalPages);
//     }
//     if (page <= maxLength - sideWidth - 1 - rightWidth) {
//         // no break on left of page
//         return range(1, maxLength-sideWidth-1)
//             .concat([0])
//             .concat(range(totalPages-sideWidth+1, totalPages));
//     }
//     if (page >= totalPages - sideWidth - 1 - rightWidth) {
//         // no break on right of page
//         return range(1, sideWidth)
//             .concat([0])
//             .concat(range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
//     }
//     // Breaks on both sides
//     return range(1, sideWidth)
//         .concat([0])
//         .concat(range(page - leftWidth, page + rightWidth)) 
//         .concat([0])
//         .concat(range(totalPages-sideWidth+1, totalPages));
// }

// $(function () {
//     var numberOfItems = $("#tweets-div .tweet-cont").length;
//     var limitPerPage = 8;
//     var totalPages = Math.ceil(numberOfItems / limitPerPage);
//     var paginationSize = 7; 
//     var currentPage;

//     function showPage(whichPage) {
//         if (whichPage < 1 || whichPage > totalPages) return false;
//         currentPage = whichPage;
//         $("#tweets-div .tweet-cont").hide()
//             .slice((currentPage-1) * limitPerPage, 
//                     currentPage * limitPerPage).show();
//         // Replace the navigation items (not prev/next):            
//         $(".pagination li").slice(1, -1).remove();
//         getPageList(totalPages, currentPage, paginationSize).forEach( item => {
//             $("<li>").addClass("page-item")
//                      .addClass(item ? "current-page" : "disabled")
//                      .toggleClass("active", item === currentPage).append(
//                 $("<a>").addClass("page-link").attr({
//                     href: "javascript:void(0)"}).text(item || "...")
//             ).insertBefore("#next-page");
//         });
//         // Disable prev/next when at first/last page:
//         $("#previous-page").toggleClass("disabled", currentPage === 1);
//         $("#next-page").toggleClass("disabled", currentPage === totalPages);
//         return true;
//     }

//     // Include the prev/next buttons:
//     $(".pagination").append(
//         $("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
//             $("<a>").addClass("page-link").attr({
//                 href: "javascript:void(0)"}).text("Prev")
//         ),
//         $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
//             $("<a>").addClass("page-link").attr({
//                 href: "javascript:void(0)"}).text("Next")
//         )
//     );
//     // Show the page links
//     $("#tweets-div .tweet-cont").show();
//     showPage(1);

//     // Use event delegation, as these items are recreated later    
//     $(document).on("click", ".pagination li.current-page:not(.active)", function () {
//         return showPage(+$(this).text());
//     });
//     $("#next-page").on("click", function () {
//         return showPage(currentPage+1);
//     });

//     $("#previous-page").on("click", function () {
//         return showPage(currentPage-1);
//     });
// });



$(document).ready(function() {
    returnSearchResults();
    filterCalls();
    onclickchecker() ;
    userrelevance();
});
