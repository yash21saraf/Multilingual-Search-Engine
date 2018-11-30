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
			console.log("started Execution") ;
        console.log(data) ;
		var htmlStr = "";
		for (var i = 0; i < data.length; i++) {
				console.log(data[i])
				htmlStr = htmlStr + "<div class='tweet_text'> " + data[i].text_en + "</div>"			
		}
		$("#tweets-div").html(htmlStr);
		});

	
		
		event.preventDefault();

	});
}

$(document).ready(function() {
    descriptiveFunctionName();
    anotherDescriptiveFunctionName();
});
