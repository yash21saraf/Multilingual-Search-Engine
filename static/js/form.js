var headers = {};

var merchantDetails = {
  "BestBuy" : {
    "pantheonMerchantName": "bestbuy-test",
    "merchantId": "598740a8-ba1f-4366-a3de-73ebef1acbfc",
    "merchantApiKey": "46997a64fa11c82597bf86f53e58ba13",
    "merchantApiSecret": "2f4199f3b5d6bbb73cc406804b4cffd95c5a80a8da8ade13c320a1775c708ebf"
  },
  "Walmart" : {
    "pantheonMerchantName": "walmart-test",
    "merchantId": "6d69860d-5de8-44fb-9124-fd631fefa979",
    "merchantApiKey": "478791a5c24f4c92eb8fa252032aae7a",
    "merchantApiSecret": "90a8bf8b7d62bece7d0fae19b4a38c6dd4d6df30f6a2d093fb7f87d23e3c87a"
  }
};

var zbMerchantId, zbMerchantApiKey, zbMerchantApiSecret, zbMerchantName;
var merchantName, productsToFetch, offersToCreate, maxItemPrice;

function setOmnywayMerchantDetails(pantheonMerchantId, pantheonMerchantApiKey, pantheonMerchantApiSecret, pantheonMerchantName){
  zbMerchantId = pantheonMerchantId;
  zbMerchantApiKey = pantheonMerchantApiKey;
  zbMerchantApiSecret = pantheonMerchantApiSecret;
  zbMerchantName = pantheonMerchantName;
};

function makeAjaxCall(callType, apiPath, handleSuccess, handleError, payload) {
  
  if (callType.toUpperCase() == "POST") {
    $.ajax({
           url: apiPath,
           type: "POST",
           headers: headers,
           data: JSON.stringify(payload),
           dataType: "jsonp",
           contentType: "application/json",
           processData: false,
           success: handleSuccess,
           error: handleError,
		   useCors: false
		   
           });
  } else if (callType.toUpperCase() == "GET") {
    $.ajax({
           url: apiPath,
           type: "GET",
           headers: headers,
           success: handleSuccess,
           error: handleError,
		   useCors: false
           });
  }
}

$(document).ready(function() {
	
});

function displayMerchantDetails(merchantObj) {
  $("#merchant_name").val(merchantObj.pantheonMerchantName);
  $("#merchant_id").val(merchantObj.merchantId);
  $("#merchant_api_key").val(merchantObj.merchantApiKey);
  $("#merchant_api_secret").val(merchantObj.merchantApiSecret);
}

function search() {
  // document.getElementById("fetchBtn").disabled = true;
  searchText = document.getElementById("search_text").value;
  console.log("called -> " + searchText);

  if (searchText != null) {
	makeAjaxCall( 'GET', 
                    'http://localhost:8983/solr/VSM/select?indent=on&q=syria&wt=json', 
                    function (data) {
                      console.log('Search Text: ' + data);
                    }, 
                    function (error) {
                      console.log('Something went wrong: ' + error);
                    }
                  );
  } else {
    alert("Empty Search Text");
  }
}

function downloadOfferCSV() {
  if($("#resultant").text() == "") {
    alert("No offers to download...");
    return;
  }

  let offerList = $("#resultant").text().replace(/<br id>/g, "\r\n");
  download('offer-list.csv', offerList);
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  $("#downloadOfferBtn").attr("disabled", "true");
}

function addCatalogItems() {
  const skuCount = catalogItems.length;
  let itemIndex = 0;
  $("#uploadCatalogBtn").attr("disabled", "true");
  catalogItems.forEach((element, index) => {
      makeAjaxCall( 'POST', 
                    'http://localhost:8983/solr/VSM/select?indent=on&q=syria&wt=json', 
                    function (data) {
                      console.log('product uploaded: ' + data);
                    }, 
                    function (error) {
                      console.log('product upload FAILED: ' + error);
                      // alert('Something went wrong: ' + error);
                    }
                  );
  });
  $('#resultant').text(zbOffersText);
  $("#downloadOfferBtn").prop("disabled", "");
}