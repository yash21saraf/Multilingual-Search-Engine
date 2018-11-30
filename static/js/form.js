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
function anotherDescriptiveFunctionName() {

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
		$("#total-tweets").html("Tweets returned " +data.length);
		tweets = data;
		var htmlStr = "";
		for (var i = 0; i < data.length; i++) {
			if(data[i].text_en != null){
				console.log(data[i].text_en[0])
				htmlStr = htmlStr + "<div class='tweet_user'> " + data[i].tweet_hashtags + "</div>"	
				htmlStr = htmlStr + "<div class='tweet_id'> " + data[i].id + "</div>"	
				htmlStr = htmlStr + "<div class='tweet_text'> " + data[i].text_en[0] + "</div>"	
			}				
		}
		$("#tweets-div").html(htmlStr);
		});
		event.preventDefault();

	});
	
	
	$("#english").change(function() {
    if(this.checked) {
		var htmlStr = "";
		var no_of_tweets = 0;
		for (var i = 0; i < tweets.length; i++) {
			if(tweets[i].text_ru != null){
				no_of_tweets++;
				htmlStr = htmlStr + "<div class='tweet_user'> " + tweets[i].tweet_hashtags + "</div>"	
				htmlStr = htmlStr + "<div class='tweet_id'> " + tweets[i].id + "</div>"	
				htmlStr = htmlStr + "<div class='tweet_text'> " + tweets[i].text_ru[0] + "</div>"
				
			}				
		}
		$("#tweets-div").html(htmlStr);
        $("#total-tweets").html("Tweets returned " +no_of_tweets);
    }
});
}


$(document).ready(function() {
    descriptiveFunctionName();
    anotherDescriptiveFunctionName();
});
