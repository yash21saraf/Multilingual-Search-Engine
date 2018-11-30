// This file contains all the helper functions
// The functions should not have any dependency on any of the variables used anywhere else
//    i.e. Functions should be self sufficient

var zbOffer;
var zbBasket;
var zbReceipt;
var clientSessionId;
var uaParserResult;
var showPromoNoticeOnce=false;


const monthNames = ["Jan ", "Feb ", "Mar ", "Apr ", "May ", "Jun ", "Jul ", "Aug ", "Sep ", "Oct ", "Nov ", "Dec "];
const osBrowserSupport = {
  "ios": ["safari", "mobile safari"],
  "android": ["chrome"]
};

function setZbOffer(offer) {
  zbOffer = offer;
  // get only unique SKUs; 
  //    using it as fallback as same catalog item is getting added mutliple times
  zbOffer["skus"] = getUniqueSkus(offer);
}

function getZbOffer() {
  return zbOffer;
}

function setBasket(basket) {
  zbBasket = basket;

}

function setReceipt(receipt) {
  zbReceipt = receipt["receipt"];
}

function getSessionToken() {
  if (zbOffer != null && zbOffer.session != null && zbOffer.session.token != null) {
    return zbOffer.session.token;
  }
  return null;
}

function displayTemplateInfo(displayInDiv, templateName, detailsObj, callbackFunction) {
  $(displayInDiv).load('js/templates.mst', function () {
    var template = $(templateName).html();
    Mustache.parse(template);
    var renderedTemplateInfo;
    if (detailsObj != null) {
      renderedTemplateInfo = Mustache.render(template, detailsObj);
    } else {
      renderedTemplateInfo = Mustache.render(template);
    }
    $(displayInDiv).html(renderedTemplateInfo);
    if (callbackFunction != null) {
      callbackFunction();
    }
  });
}

function isCookiesEnabled() {
  return navigator.cookieEnabled;
}

function isMobileBrowser() {
  var check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

function getErrorDetailsHtml(errorObj, errType) {
  if (errorObj == null) {
    return null;
  }
  
  var errHtml = "";
  if(errType && (errType["type"] == "noSku" || errType["type"] == "noOffer" || errType["type"] == "noStock")) {
    if (getCartId() != null) {
      errHtml = errHtml + "zb-id: " + getCartId() + "<br>";
    } else {
      errHtml = "Offer id: " + getOfferID() + "<br>";
    }
    errHtml = errHtml + "Timestamp: " + getUTCTimeFormat() + "<br>";
    errHtml = errHtml + "Message: Zapbuy Offer not found";
    return errHtml;
  }

  errHtml = "Offer id: " + getOfferID() + "<br>";
  errHtml = errHtml + "Timestamp: " + getUTCTimeFormat() + "<br>";
  if (getCartId() != null) {
    errHtml = errHtml + "zb-id: " + getCartId() + "<br>";
  }
  if (errorObj.responseJSON != null) {
    if (errorObj.responseJSON.detail != null && errorObj.responseJSON.detail.status != null) {
      errHtml = errHtml + "Status: " + errorObj.responseJSON.detail.status + "<br>";
    }
    if (errorObj.responseJSON.detail != null && errorObj.responseJSON.detail.reason != null) {
      errHtml = errHtml + "Reason: " + errorObj.responseJSON.detail.reason + "<br>";
    }
    if (errorObj.responseJSON.message != null) {
      errHtml = errHtml + "Message: " + errorObj.responseJSON.message;
    }
  }
  return errHtml;
}

function getErrorDetailsToLog(generalMsg, errorObj, errType) {
  var obj = {};
  var errDtlsHtml = getErrorDetailsHtml(errorObj, errType);
  if (errDtlsHtml != null) {
    errDtlsHtml = errDtlsHtml.replace(/<br>/g, ";  ");
  } else {
    errDtlsHtml = "unavailable";
  }
  obj["error-type"] = getGenericErrorMsg(errType);
  obj["error-details"] = errDtlsHtml;
  return obj;
}

function getGenericErrorMsg(errType) {
  if(errType == null || errType["type"] == null) {
    return "unavailable";
  } else if (errType["type"] == "cookieDisabled") {
    return "Cookies are disabled";
  } else if (errType["type"] == "noStock") {
    return "No Stock";
  } else if (errType["type"] == "noSku") {
    return "No SKUs";
  } else if (errType["type"] == "noOffer") {
    return "No Offer";
  } else if (errType["type"] == "osBrowserNotSupported") {
    return "Browser not supported for OS";
  } else if (errType["type"] == "apiError") {
    return "API error";
  } else {
    return "unavailable";
  }
}

function getSkuFromSkuId(skuId) {
  if (skuId == null || skuId == 0) {
    return zbOffer["skus"][0];
  } else if (zbOffer != null && zbOffer.skus != null) {
    for (var i = 0; i < zbOffer.skus.length; i++) {
      var item = zbOffer.skus[i];
      if (item.sku == skuId) {
        return item;
      }
    }
  }
  return null;
}

function getBrandLogo() {
  var productOffer = zbOffer["offer"];
  if (productOffer["brand-image-url"] != null) {
    return productOffer["brand-image-url"];
  } else {
    // fallback logic if brand image url is not present
    var prodOffrDesc = productOffer["description"];
    // check if description field in product offer object is url: use it;
    if (prodOffrDesc.startsWith("https://") || prodOffrDesc.startsWith("http://")) {
      return prodOffrDesc;
    }
  }
  return "img/kohls-logo.svg";  // default brand image
}

function getMerchantName() {
  if (zbOffer != null &&
    zbOffer["offer"] != null &&
    zbOffer["offer"]["client-data"] != null &&
    zbOffer["offer"]["client-data"]["merchant-name"] != null &&
    zbOffer["offer"]["client-data"]["merchant-name"] != "") {
    return zbOffer["offer"]["client-data"]["merchant-name"];
  }
  // by default return Kohls as merchant name
  return "Kohl's";
}

function getBrandReturnPolicyUrl() {
  if (zbOffer != null &&
    zbOffer["offer"] != null &&
    zbOffer["offer"]["client-data"] != null &&
    zbOffer["offer"]["client-data"]["merchant-return-policy"] != null &&
    zbOffer["offer"]["client-data"]["merchant-return-policy"] != "") {
    return zbOffer["offer"]["client-data"]["merchant-return-policy"];
  }
  // by default return Kohl's return policy url
  return "https://cs.kohls.com/app/answers/detail/a_id/893/kw/returns";
}

function getBrandPhoneNo() {
  if (zbOffer != null &&
    zbOffer["offer"] != null &&
    zbOffer["offer"]["client-data"] != null &&
    zbOffer["offer"]["client-data"]["merchant-phone-no"] != null &&
    zbOffer["offer"]["client-data"]["merchant-phone-no"] != "") {
    return zbOffer["offer"]["client-data"]["merchant-phone-no"];
  }
  // by default return Kohl's phone number
  return "+1 (855) 564-5705";
}

function getproductChangePercentageFromBasket(){
  var percentOff = getPercentageChangeInPrice()
  if(percentOff && percentOff < 1)
    return "none";
  else
    return "Save "+getPercentageChangeInPrice()+"%";
}

function getproductChangePercentage(){
  if(zbOffer.offer["client-data"]["pctoff"])
  {
    return zbOffer.offer["client-data"]["pctoff"];
  }

  return getproductChangePercentageFromBasket();
	// var val=0;
	// val=zbOffer["basket"]["reconciled-total"][0]["discounted-total"];
  // return "Save "+val+"%";

}

function getSalePrice(skuPrice) {
  if (zbOffer == null) {
    return null;
  }
  if (zbOffer != null && zbBasket == null) {
    // get sale price for prePDP
    return getSaleDescription();
  } else if (zbBasket != null) {
    // get sale price for PDP
    var itemQty = parseInt(zbBasket.basket.items[0]["qty"]);
    var discountedTotal = parseInt(zbBasket.basket.summary["discounted-total"]);
    if (itemQty == 1) {
      return getCurrencyFormat(discountedTotal, "$");
    } else {
      var salePrice = parseInt(discountedTotal / itemQty);
      return getCurrencyFormat(salePrice, "$");
    }
  }
}

function getSaleDescription() {
  if(zbOffer != null && 
      zbOffer["basket"] != null && 
      zbOffer["basket"]["reconciled-total"] && 
      zbOffer["basket"]["reconciled-total"].length > 0 && 
      zbOffer["basket"]["reconciled-total"][0]["discounted-total"] > 0) {
    return getCurrencyFormat(zbOffer["basket"]["reconciled-total"][0]["discounted-total"], "$");
  }
  if (zbOffer != null && zbOffer["offer"] != null) {
    if (zbOffer["offer"]["zapbuy-offer-price-text"] != null) {
      return zbOffer["offer"]["zapbuy-offer-price-text"];
    } else if (zbOffer["offer"]["zapbuy-offer-price"] != null) {
      //return getCurrencyFormat(zbOffer["offer"]["zapbuy-offer-price"], "$");
      return getCurrencyFormat(zbOffer["offer"]["zapbuy-offer-price"] * 100, "$"); //TODO - Temp fix as Punit is entering this in $ and not cents
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function getCurrencyFormat(value, currencySymbol) {
  if (value == null || isNaN(parseInt(value))) {
    value = 0;
  }
  if (currencySymbol == null) {
    currencySymbol = "$";
  }
  return currencySymbol + getFormattedPrice(value, 100, 2);
}

function getProductRating() {
  var rating = "4";
  if (zbOffer["offer"] != null && zbOffer["offer"]["client-data"] != null && zbOffer["offer"]["client-data"]["rating"]) {
    rating = zbOffer["offer"]["client-data"]["rating"];
  }
  return rating;
}

function getProductRatingHtml(rating) {
  var countStars = 0;
  if (rating == null) {
    rating = getProductRating();
  }
  var fullRating = parseInt(rating);
  var ratingHtml = "";
  for (var i = fullRating - 1; i >= 0; i--) {
    ratingHtml = ratingHtml + '<img src="img/star-full.png" style="width: 12px;">';
    countStars++;
  }
  var halfRating = (parseFloat(rating) * 10) % 10
  if (halfRating >= 5) {
    ratingHtml = ratingHtml + '<img src="img/star-half.png" style="width: 12px;">';
    countStars++;
  }

  for (var i = 5; i > countStars; i--) {
    ratingHtml = ratingHtml + '<img src="img/star-empty.png" style="width: 12px;">';
  }

  return ratingHtml;
}

function getProductReviewCount() {
  var reviews = "4";
  if (zbOffer["offer"] != null && zbOffer["offer"]["client-data"] != null && zbOffer["offer"]["client-data"]["ratingcount"]) {
    reviews = zbOffer["offer"]["client-data"]["ratingcount"];
  }
  return reviews;
}

function getFormattedPrice(price, divider, decimalPlaces) {
  return (parseInt(price) / divider).toFixed(decimalPlaces);
}

function getFormattedPercentage(value, divider) {
  if (parseInt(value) % 100 == 0 || parseInt(value) % 10 == 0) {
    return (parseInt(value) / 100) + "%";
  } else {
    return (parseInt(value) / 100).toFixed(2) + "%";
  }
}

function getFormattedTimeFromSeconds(counter) {
  var minutes = Math.floor(counter / 60);
  var seconds = counter - minutes * 60;
  var finalTime = stringPaddedToLength(minutes, '0', 2) + ':' + stringPaddedToLength(seconds, '0', 2);
  return finalTime
}

function stringPaddedToLength(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

function getShippingArrival() {
  var fulfillment;
  if (zbReceipt != null && zbReceipt["fulfillment"] != null) {
    fulfillment = zbReceipt["fulfillment"];
  } else if (zbBasket["basket"]["fulfillment"] != null) {
    fulfillment = zbBasket["basket"]["fulfillment"];
  }
  if (fulfillment != null) {
    if (fulfillment["shipping-estimates"] != null && fulfillment["shipping-estimates"].length > 0) {
      var shippingEstimate = fulfillment["shipping-estimates"][0];
      if (shippingEstimate["start-date"] != null && shippingEstimate["start-date"] != shippingEstimate["end-date"]) {
        return getShippingArrivalEstimate(new Date(shippingEstimate["start-date"]), new Date(shippingEstimate["end-date"]));
      } else if (shippingEstimate["start-date"] != null) {
        var shippingDate = new Date(shippingEstimate["start-date"]);
        return monthNames[shippingDate.getUTCMonth()] + stringPaddedToLength(shippingDate.getUTCDate(), "0", 2);
      }
    }
  }
  return getShippingArrivalEstimate();
}

function getShippingArrivalEstimate(date1, date2) {
  var shipMinDate = date1;
  var shipMaxDate = date2;

  if (shipMinDate == null) {
    var today = new Date();
    shipMinDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
    shipMaxDate = new Date(shipMinDate.getFullYear(), shipMinDate.getMonth(), shipMinDate.getDate() + 3);
  }

  if (shipMinDate.getUTCMonth() != shipMaxDate.getUTCMonth()) {
    return monthNames[shipMinDate.getUTCMonth()] + stringPaddedToLength(shipMinDate.getUTCDate(), "0", 2) + " - " + monthNames[shipMaxDate.getUTCMonth()] + stringPaddedToLength(shipMaxDate.getUTCDate(), "0", 2);
  } else {
    return monthNames[shipMinDate.getUTCMonth()] + stringPaddedToLength(shipMinDate.getUTCDate(), "0", 2) + " - " + stringPaddedToLength(shipMaxDate.getUTCDate(), "0", 2);
  }
}

function getImagesForColor(color) {
  var products = zbOffer["skus"];
  var images = new Array();
  if (color == null) {
    $.each(products, function (index, item) {
      if (item["image-urls"] != null && item["image-urls"].length > 0) {
        images = images.concat(item["image-urls"]);
        
        
      } else if (item["image-url"] != null) {
        images.push(item["image-url"]);
      }
    });
  } else {
    $.each(products, function (index, item) {
      if (item["product-features"] != null && item["product-features"]["color"] == color) {
        if (item["image-urls"] != null && item["image-urls"].length > 0) {
          images = images.concat(item["image-urls"]);
          
        } else if (item["image-url"] != null) {
          images.push(item["image-url"]);
        }
      }
    });
  }
  // return only unique images
  
  return images.filter(onlyUnique);
}

// returns only unique values; can be thought of this like returning a Set;
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function notEmpty(s) {
  if (s && "" != s) {
    return s;
  } else {
    return null;
  }
}

function getProductDescription() {
  var clientData = zbOffer["offer"]["client-data"];
  if (null != clientData) {
    return notEmpty(clientData["long_description"])
      || notEmpty(clientData["productdescription"]);
  }
  return null;
}

// get the flow to use based on color and size availability
/*
  1 - only 1 product; hide color and size selections
  2 - only sizes available; show size selection & hide color selection
  3 - only colors available; show color selection & hide size selection
  4 - both sizes and colors available; display both size and color selections
*/
function getFlowToUse() {
  if (zbOffer["skus"].length == 1) {
    return 1;
  } else if (zbOffer["skus"][0]["product-features"]["color"] == null || zbOffer["skus"][0]["product-features"]["color"] == "" || zbOffer["skus"][0]["product-features"]["color"].toLowerCase() == "none" || zbOffer["skus"][0]["product-features"]["color"].toLowerCase() == "default") {
    return 2;
  } else if (zbOffer["skus"][0]["product-features"]["size"] == null || zbOffer["skus"][0]["product-features"]["size"] == "" || zbOffer["skus"][0]["product-features"]["size"].toLowerCase() == "none" || zbOffer["skus"][0]["product-features"]["size"].toLowerCase() == "default") {
    return 3;
  } else {
    return 4;
  }
}

// returns all available sizes; should be called only when sizes are available
function getAllAvailableSizes() {
  // todo: add validations
  var products = zbOffer["skus"];
  var sizes = [];
  var tmpSz = [];
  $.each(products, function (index, item) {
    if ($.inArray(item["product-features"]["size"], tmpSz) == -1) {
      sizes.push({ "size": item["product-features"]["size"] });
      tmpSz.push(item["product-features"]["size"]);
    }
  });
  return sizes;
}

// get the sku from the size passed
function getSkuFromSize(size) {
  var products = zbOffer["skus"];
  var sku = null;
  $.each(products, function (index, item) {
    if (item["product-features"]["size"] == size) {
      sku = item;
    }
  });
  return sku;
}

// get the sku using the color passed
function getSkuFromColor(color) {
  var products = zbOffer["skus"];
  var sku = null;
  $.each(products, function (index, item) {
    if (item["product-features"]["color"] == color) {
      sku = item;
    }
  });
  return sku;
}

// get the sku which has the passed color and size
function getSkuFromColorAndSize(color, size) {
  var products = zbOffer["skus"];
  var sku = null;
  $.each(products, function (index, item) {
    if (item["product-features"]["color"] == color && item["product-features"]["size"] == size) {
      sku = item;
    }
  });
  return sku;
}

// returns all available colors; should be called only when colors are available
function getAllAvailableColors() {
  // todo: add validations
  var products = zbOffer["skus"];
  var colors = [];
  var tmpCol = [];
  $.each(products, function (index, item) {
    if ($.inArray(item["product-features"]["color"], tmpCol) == -1) {
      colors.push({
        "color": item["product-features"]["color"],
        "swatchURL": getSwatchForSku(item),
        "displayDiv": function () {
          if (this.swatchURL) {
            return '<li onclick="setSelectedColor(\'' + this.color + '\', \'' + this.swatchURL + '\')">' +
              '<a style="display: table; padding-left: 10px;">' +
              '<img src="' + this.swatchURL + '" class="color-selection-item-img">' +
              '<div class="color-selection-item-txt">' + this.color + '</div>' +
              '</a>' +
              '</li>';
          } else {
            return '<li onclick="setSelectedColor(\'' + this.color + '\', null)">' +
              '<a style="display: table; padding-left: 10px;">' +
              '<div class="color-selection-item-div" style="background-color: ' + this.color + ';"></div>' +
              '<div class="color-selection-item-txt">' + this.color + '</div>' +
              '</a>' +
              '</li>';
          }
        }
      });
      tmpCol.push(item["product-features"]["color"]);
    }
  });
  // return only unique sizes
  return colors.filter(onlyUnique);
}

// return swatch image url if it exists for the sku
function getSwatchForSku(item) {
  if(item["swatch-image-urls"] != null && item["swatch-image-urls"].length > 0 && item["swatch-image-urls"][0] != "") {
    return item["swatch-image-urls"][0];
  } else if (item["swatch-image-url"] != null) {
    return item["swatch-image-url"];
  } else {
    return null;
  }
}

// return available sizes for a color
function getAvailableSizesForColor(color) {
  var sizes = [];
  $.each(zbOffer["skus"], function (index, item) {
    if (item["product-features"]["color"] == color) {
      sizes.push(item["product-features"]["size"]);
    }
  });
  // return unique colors only
  return sizes.filter(onlyUnique);
}

// return available colors for a size
function getAvailableColorsForSize(size) {
  var colors = [];
  $.each(zbOffer["skus"], function (index, item) {
    if (item["product-features"]["size"] == size) {
      colors.push(item["product-features"]["color"]);
    }
  });
  // return unique colors only
  return colors.filter(onlyUnique);
}

function getCartId() {
  if (zbOffer != null) {
    return zbOffer["zb-id"];
  } else {
    return null;
  }
}

function getShopperName(profile) {
  return profile["first-name"] + " " + profile["last-name"];
}

function getShippingAddress(profile) {
  var shopperAddr = profile["shipping-address"];
  var completeAddress = "";
  if (shopperAddr["addr1"] != "") {
    completeAddress = completeAddress + shopperAddr["addr1"];
  }
  if (shopperAddr["addr2"] != null && shopperAddr["addr2"] != "") {
    completeAddress = completeAddress + "<br>" + shopperAddr["addr2"];
  }
  if (shopperAddr["city"] != "") {
    completeAddress = completeAddress + "<br>" + shopperAddr["city"];
  }
  if (shopperAddr["state"] != "") {
    completeAddress = completeAddress + ", " + shopperAddr["state"];
  }
  if (shopperAddr["zipcode"] != "") {
    completeAddress = completeAddress + " " + shopperAddr["zipcode"];
  }
  return completeAddress;
}

function getPaypalEmail(profile) {
  return profile.email;
}

function getProductName(sku) {
  if(sku != null) {
    return sku.name;  
  }
  return null;
}

function getMerchantProductId() {
  if(zbOffer != null && zbOffer.offer && zbOffer.offer["product-id"]) {
    return zbOffer.offer["product-id"];
  }
  return null;
}

function getSelectedColor(sku) {
  if (sku["product-features"]["color"] != null &&
    sku["product-features"]["color"] != "" &&
    sku["product-features"]["color"].toLowerCase() != "none" &&
    sku["product-features"]["color"].toLowerCase() != "default") {
    return sku["product-features"]["color"];
  }
  return "None";
}

function getSelectedSize(sku) {
  if (sku["product-features"]["size"] != null &&
    sku["product-features"]["size"] != "" &&
    sku["product-features"]["size"].toLowerCase() != "none" &&
    sku["product-features"]["size"].toLowerCase() != "default") {
    return sku["product-features"]["size"];
  }
  return "None";
}

function getProductAmount() {
  var summaryObj;
  if (zbReceipt != null) {
    summaryObj = zbReceipt["summary"];
  } else if (zbBasket != null) {
    summaryObj = zbBasket.basket.summary;
  }
  return getCurrencyFormat(summaryObj["discounted-total"], "$");
}

function getShippingCost() {
  var summaryObj;
  if (zbReceipt != null) {
    summaryObj = zbReceipt["summary"];
  } else if (zbBasket != null) {
    summaryObj = zbBasket.basket.summary;
  }
  if (summaryObj["shipping-cents"] == 0) {
    return "FREE";
  } else {
    return getCurrencyFormat(summaryObj["shipping-cents"], "$");
  }
}

function getSalesTax() {
  var summaryObj;
  if (zbReceipt != null) {
    summaryObj = zbReceipt["summary"];
  } else if (zbBasket != null) {
    summaryObj = zbBasket.basket.summary;
  }
  if (summaryObj["tax-fee-total"] != null && summaryObj["tax-fee-total"] > summaryObj["tax"]) {
    return getCurrencyFormat(summaryObj["tax-fee-total"], "$");
  }
  return getCurrencyFormat(summaryObj["tax"], "$");
}

function getOrderTotal() {
  var summaryObj;
  if (zbReceipt != null) {
    summaryObj = zbReceipt["summary"];
  } else if (zbBasket != null) {
    summaryObj = zbBasket.basket.summary;
  }
  return getCurrencyFormat(summaryObj["payment-total"], "$");
}

function getSingleProductImage(sku) {
  if (sku["image-urls"] != null && sku["image-urls"].length > 0) {
    return sku["image-urls"][0];
  } else if (sku["image-url"] != null) {
    return sku["image-url"];
  }
}

function getOrderNo() {
  var orderNo = "";
  var transactionInfo = zbReceipt["receipt"]["transaction-info"];
  if (transactionInfo != null && transactionInfo["merchant-transaction-id"] != null && transactionInfo["merchant-transaction-id"] != "") {
    orderNo = transactionInfo["merchant-transaction-id"];
  } else {
    // using receipt id created by pantheon as fallback
    orderNo = zbReceipt["receipt"]["id"];
  }
  if (orderNo.length > 20) {
    orderNo = orderNo.slice(-20);
  }
  return orderNo;
}

function getOrderDetailsTitle() {
  if (zbReceipt != null) {
    return "REVIEW YOUR ORDER";
  } else {
    return "YOUR ORDER";
  }
}

function getProductQty() {
  if (zbReceipt != null) {
    return zbReceipt["receipt"]["items"][0]["qty"];
  }
  return 1;
}

function getOrderSizeOrColor(sizeOrColor) {
  if (sizeOrColor != null && sizeOrColor != "" && sizeOrColor != "Size" && sizeOrColor != "Color") {
    return sizeOrColor;
  } else {
    return "Select Above";
  }
}

function eventLogger(data) {
  if (clientSessionId == null) {
    clientSessionId = uuidv4();
  }
  if (uaParserResult == null) {
    uaParserResult = new UAParser().getResult();
  }

  data["source"] = (document.referrer != null && document.referrer != "") ? document.referrer : "unavailable";
  data["offer-id"] = getOfferID();
  data["client-session-id"] = clientSessionId;
  data["timestamp"] = getUTCTimeFormat();
  data["browser-name"] = getBrowserName();
  data["browser-version"] = uaParserResult.browser.version;
  data["os-name"] = getOsName();
  data["os-version"] = uaParserResult.os.version;
  data["device-model"] = uaParserResult.device.model != null ? uaParserResult.device.model : "unavailable";
  data["device-vendor"] = uaParserResult.device.vendor != null ? uaParserResult.device.vendor : "unavailable";
  data["device-type"] = uaParserResult.device.type != null ? uaParserResult.device.type : "desktop";
  data["app-name"] = "zapbuy";
  data["app-version"] = "1.2";
  data["payment-type"] = "paypal";
  data["locale"] = navigator.language;
  data["device-id"] = isCookiesEnabled() ? getDeviceID() : "unavailable";
  data["zb-id"] = getCartId() != null ? getCartId() : "unavailable";
  data["session-id"] = getSessionId() != null ? getSessionId() : "unavailable";
  data["host"] = document.location.host;

  data["prd-sale-type"] = (zbOffer != null && zbOffer["offer"] != null && zbOffer["offer"]["type"] != null) ? zbOffer["offer"]["type"] : "unavailable";
  data["prd-sale-value"] = (zbOffer != null && zbOffer["offer"] != null && zbOffer["offer"]["value"] != null) ? ("" + zbOffer["offer"]["value"]) : "unavailable";
  data["prd-sale-desc"] = getSaleDescription() != null ? getSaleDescription() : "unavailable";
  data["prd-sale-price"] = getSalePrice() != null ? getSalePrice() : "unavailable";

  data["prd-qty"] = data["prd-qty"] != null ? data["prd-qty"] : "1";
  data["prd-sku"] = data["prd-sku"] != null ? data["prd-sku"] : "unavailable";
  data["prd-size"] = data["prd-size"] != null ? data["prd-size"] : "unavailable";
  data["prd-price"] = data["prd-price"] != null ? data["prd-price"] : "unavailable";
  data["prd-color"] = data["prd-color"] != null ? data["prd-color"] : "unavailable";
  data["is-returning-user"] = "" + isReturningShopper;
  data["shopper-id"] = data["shopper-id"] != null ? data["shopper-id"] : "unavailable";
  data["product-id"] = getMerchantProductId() != null ? getMerchantProductId() : "unavailable";
  data["brand"] = getBrandName() != null ? getBrandName() : "unavailable";
  data["category"] = getProductCategoryName() != null ? getProductCategoryName() : "unavailable";
  data["departmentName"] = getDepartmentName() != null ? getDepartmentName() : "unavailable";
  data["categoryName"] = getCategoryName() != null ? getCategoryName() : "unavailable";
  data["subcategoryName"] = getSubCategoryName() != null ? getSubCategoryName() : "unavailable";
  data["referral-fee"] = getReferralFee() != null ? getReferralFee() : "unavailable";
  data["prd-name"] = data["prd-name"] != null ? data["prd-name"] : "unavailable";
  data["google-client-id"] = getGoogleClientId() != null ? getGoogleClientId() : "unavailable";

  // add events and respective details to google tag manager
  window.dataLayer = window.dataLayer || [];

  if((data["event-category"] == "pre-pdp" && data["event-name"] == "page-load-success") || 
    (data["event-category"] == "pdp" && data["event-name"] == "page-load-started" && isReturningShopper) || data["event-name"] == "sku-changed") {
    // offer view
    prdViewObj = data;
    var productDtls = getPrdDtlsForAnalytics(data);
    prdViewObj['event'] = 'ProductView';
    prdViewObj['ecommerce'] = {
      'detail': {
        'actionField': {'list': data["source"] == "unavailable" ? '' : data["source"]},
        'products': [getPipeFormattedObj(productDtls)]
      }
    };
    // add event ProductView to analytics dataLayer
    dataLayer.push(replaceUnavailableAndDollar(prdViewObj));
  } else if(data["event-name"] == "buy-now-clicked") {
    // add to cart
    addToCartObj = data;
    var productDtls = getPrdDtlsForAnalytics(data);
    productDtls['quantity'] = parseInt(data["prd-qty"]);
    addToCartObj['event'] = 'AddToCart';
    addToCartObj['ecommerce'] = {
      'currencyCode': 'US$', 
      'add': {
        'products': [getPipeFormattedObj(productDtls)]
      }
    }
    // add event AddToCart to analytics dataLayer
    dataLayer.push(replaceUnavailableAndDollar(addToCartObj));

    // checkout 
    data['event'] = 'CheckOut';
    data['ecommerce'] = {
      'checkout': {
        'products': [getPipeFormattedObj(productDtls)]
      }
    }
    // add event to analytics dataLayer
    dataLayer.push(replaceUnavailableAndDollar(data));
  } else if(data["event-category"] == "receipt" && data["event-name"] == "page-load-success") {
    // purchase 
    var productDtls = getPrdDtlsForAnalytics(data);
    productDtls['quantity'] = parseInt(data["prd-qty"]);
    var actionFieldObj = replaceUnavailableAndDollar(getActionFieldObj());
    actionFieldObj['coupon'] = getCouponCodes("applied");
    data['event'] = 'Purchase';
    data['ecommerce'] = {
      'purchase': {
        'actionField': actionFieldObj, 
        'products': [getPipeFormattedObj(productDtls)]
      }
    }
    // add event to analytics dataLayer
    dataLayer.push(replaceUnavailableAndDollar(data));
  } else {
    // add event to analytics dataLayer
    data["event"] = data["event-name"];
    dataLayer.push(replaceUnavailableAndDollar(data));
  } 

  

  // not making the api call to log events if running on local machine
  if (document.location.hostname == "localhost") {
    console.log(data);
  } else {
    // logging event details in console for QA; remove once testing is completed.
    console.log(data);
    var wrappedData = getWrappedData(data);
    // make the api call to log the event
    doPost(
      zapbuyApiUrl("zapbuy/client-events"),
      wrappedData,
      function (s) { console.log(data["event-category"] + " " + data["event-name"] + " success", s); },
      function (e) { console.log(data["event-category"] + " " + data["event-name"] + " failed", e); }
    );
  }
}

function getBrowserName() {
  if (uaParserResult == null) {
    uaParserResult = new UAParser().getResult();
  }
  return uaParserResult.browser.name;
}

function getOsName() {
  if (uaParserResult == null) {
    uaParserResult = new UAParser().getResult();
  }
  return uaParserResult.os.name;
}

function osBrowserSupported() {
  // todo: once the browser and os versions to support is final then remove following line;
  return true;
  if ($.inArray(getOsName().toLowerCase(), Object.keys(osBrowserSupport)) != -1) {
    var supportedBrowserForOs = osBrowserSupport[getOsName().toLowerCase()];
    if ($.inArray(getBrowserName().toLowerCase(), supportedBrowserForOs) != -1) {
      return true;
    }
  }
  return false;
}

function getUTCTimeFormat() {
  var d = new Date();
  var n = d.getTime();
  return d.toISO8601String();
}

Date.prototype.toISO8601String = function () {
  return this.getUTCFullYear() +
    '-' + stringPaddedToLength(this.getUTCMonth() + 1, "0", 2) +
    '-' + stringPaddedToLength(this.getUTCDate(), "0", 2) +
    'T' + stringPaddedToLength(this.getUTCHours(), "0", 2) +
    ':' + stringPaddedToLength(this.getUTCMinutes(), "0", 2) +
    ':' + stringPaddedToLength(this.getUTCSeconds(), "0", 2) +
    'Z';
};

function getSessionId() {
  if (zbOffer != null && zbOffer["session"] != null && zbOffer["session"]["id"] != null) {
    return zbOffer["session"]["id"];
  } else {
    return null;
  }
}

function closeWindow() {
  window.close();
}

function refreshPage() {
  window.location.reload();
}

function isProductOutOfStock() {
  if (zbOffer != null &&
    zbOffer["offer"] != null &&
    zbOffer["offer"]["client-data"] != null &&
    zbOffer["offer"]["client-data"]["availability"] != null &&
    (zbOffer["offer"]["client-data"]["availability"].toLowerCase() == "out of stock" ||
      zbOffer["offer"]["client-data"]["availability"].toLowerCase() == "not in stock")) {
    return true;
  } else {
    return false;
  }
}

function hasSkusForProduct() {
  if (zbOffer != null &&
    zbOffer.skus != null &&
    zbOffer.skus.length > 0) {
    return true;
  } else {
    return false;
  }
}

function openZbOffersPage() {
  var categoryName = getCategoryName();
  window.location = "https://app.zapbuy.it/offers.html" + (categoryName ? "?cn="+encodeURIComponent(categoryName).replace(/%20/g,'+') : "");
}

function getUniqueSkus(offer) {
  var skus = offer["skus"];
  if (skus == null || skus.length == 0) {
    return skus;
  }
  var newSkus = [];
  var skuIds = [];
  for (var i = 0; i < skus.length; i++) {
    if ($.inArray(skus[i].sku, skuIds) == -1) {
      newSkus.push(skus[i]);
      skuIds.push(skus[i].sku);
    }
  }
  return newSkus;
}

function getZapbuyWithBrandUrl() {
  // todo: replace with link when ready
  return "http://www.zapbuy.it/";
}

function getZapbuyLearnMoreUrl() {
  // todo: replace with link when ready
  return "http://www.zapbuy.it/";
}

// returns the shopper id if available
function getShopperId(profile) {
  if(profile && profile["shopper-id"]) {
    return profile["shopper-id"];
  }
  return null;
}

function getDefaultSKU() {
  var obj;
  if (typeof (zbOffer["default-sku"]) != "undefined") {
    obj = getSkuFromSkuId(data.offer["default-sku"]);
  }
  if(zbOffer != null &&
      zbOffer["basket"] != null &&
      zbOffer["basket"]["items"] != null &&
      zbOffer["basket"]["items"].length > 0 &&
      zbOffer["basket"]["items"][0]["sku"] != null) {
    obj = getSkuFromSkuId(zbOffer["basket"]["items"][0]["sku"]);
  }
  // using as a fallback in case basket is not present in load offer response
  if (obj == null) {
    obj = getSkuFromSkuId(0);
  }
  return obj;
}

function getSalePriceForPrePdp(basketObj,formatCurr) {
  if(basketObj && 
    basketObj.basket &&
    basketObj.basket["reconciled-total"] &&
    basketObj.basket["reconciled-total"].length > 0 &&
    basketObj.basket["reconciled-total"][0]["discounted-total"] >= 0) {
      if(formatCurr)
    return getCurrencyFormat(basketObj.basket["reconciled-total"][0]["discounted-total"], "$");
    else
    return basketObj.basket["reconciled-total"][0]["discounted-total"];
    

  }
  return true; //TODO: Why is this returning true
}

// returns the referal fee if available, else default value i.e. 8%
function getReferralFee() {
  if(zbOffer && zbOffer.offer && zbOffer.offer["client-data"] && zbOffer.offer["client-data"]["referral-fee"]) {
    return "" + zbOffer.offer["client-data"]["referral-fee"];
  } else if(zbOffer) {
    return "8.00";  
  }
  return null;
}

function getBrandName() {
  if(zbOffer && zbOffer.offer && zbOffer.offer["client-data"] && zbOffer.offer["client-data"]["brand"]) {
    return "" + zbOffer.offer["client-data"]["brand"];
  }
  return null;
}

function getProductCategoryName() {
  if(zbOffer && zbOffer.offer && zbOffer.offer["client-data"] && zbOffer.offer["client-data"]["product-category"]) {
    return "" + zbOffer.offer["client-data"]["product-category"];
  }
  return null;
}

function getDepartmentName() {
  if(zbOffer && zbOffer.offer && zbOffer.offer["client-data"] && zbOffer.offer["client-data"]["department-name"]) {
    return "" + zbOffer.offer["client-data"]["department-name"];
  }
  return null;
}

function getCategoryName() {
  if(zbOffer && zbOffer.offer && zbOffer.offer["client-data"] && zbOffer.offer["client-data"]["category-name"]) {
    return "" + zbOffer.offer["client-data"]["category-name"];
  }
  return null;  
}

function getSubCategoryName() {
  if(zbOffer && zbOffer.offer && zbOffer.offer["client-data"] && zbOffer.offer["client-data"]["subcategory-name"]) {
    return "" + zbOffer.offer["client-data"]["subcategory-name"];
  }
  return null;  
}

// replaces "unavailable" with empty string "" and removes "$" from the price fields
function replaceUnavailableAndDollar(obj) {
  var newObj = {};
  var objKeys = Object.keys(obj);
  objKeys.forEach(function(k){
    if(obj[k] == "unavailable") {
      newObj[k] = '';   // send empty string if value is unavailable
    } else if(typeof obj[k] == "string" && obj[k].includes("$")) {
      newObj[k] = obj[k].replace(/[$]/g, "");  // replace the $ sign
    } else {
      newObj[k] = obj[k];
    }
  });
  return newObj;
}

// for multiple values that are || separated, if it has "unavailable" it will replace it with one spaced string " "
function getPipeFormattedObj(obj) {
  var newObj = replaceUnavailableAndDollar(obj);
  newObj["variant"] = newObj["variant"].replace(/unavailable/g, " ");
  return newObj;
}

function getPrdDtlsForAnalytics(data) {
  return {  'name': data["prd-name"],
            'id': data["product-id"],
            'price': data["prd-price"],
            'brand': data["brand"],
            'category': data["category"],
            'variant': data["prd-sku"] + "||" + data["prd-size"] + "||" + data["prd-color"]
          };
}

function getPrdDtlsUsingSku(data) {
  var sku = data["previous-sku"];
  return {  'name': data["prd-name"],
            'id': data["product-id"],
            'price': getCurrencyFormat(sku.price, "$"),
            'brand': data["brand"],
            'category': data["category"],
            'variant': sku["sku"] + "||" + ($.inArray(getSelectedSize(sku), [null, "None"]) == -1 ? getSelectedSize(sku) : "unavailable") + "||" + ($.inArray(getSelectedColor(sku), [null, "None"]) == -1 ? getSelectedColor(sku) : "unavailable")
          };
}

function getActionFieldObj() {
  var obj = {};
  obj['affiliation'] = 'Online Store';
  obj['id'] = getOrderNo();
  obj['revenue'] = getOrderTotal();
  obj['tax'] = getSalesTax();
  obj['shipping'] = getShippingCost() == "FREE" ? "0.00" : getShippingCost();
  return obj;
}

// get list of applied / failed promo codes based on status for analytics as string where promo codes are separated by "||" 
// if no codes then return empty string
function getCouponCodes(promoStatus) {
  var promos = "";
  var promoArray;
  if(zbOffer.basket && zbOffer.basket["reconciled-total"] && zbOffer.basket["reconciled-total"].length > 0 &&
    zbOffer.basket["reconciled-total"][0]["promo-codes"] && zbOffer.basket["reconciled-total"][0]["promo-codes"].length > 0) {
    promoArray = zbOffer.basket["reconciled-total"][0]["promo-codes"]
                  .filter(function(o){ return o.status == promoStatus})
                  .map(function(o){ return o["promo-code"]});
    if(promoArray.length!=0)
      promos = promoArray.reduce(function(str, promo) { return str + "||" + promo});

  }
  if(zbBasket && zbBasket.basket && zbBasket.basket["reconciled-total"] && zbBasket.basket["reconciled-total"].length > 0 &&
    zbBasket.basket["reconciled-total"][0]["promo-codes"] && zbBasket.basket["reconciled-total"][0]["promo-codes"].length > 0) {
    promoArray=[];
    promoArray = zbBasket.basket["reconciled-total"][0]["promo-codes"]
                  .filter(function(o){ return o.status == promoStatus})
                  .map(function(o){ return o["promo-code"]});
    if(promoArray.length!=0)
      promos = promoArray.reduce(function(str, promo) { return str + "||" + promo});
  }
  return promos;
}

// Check if the there are any failed promo codes
function hasFailedCouponCodes() {
  var hasFailedPromoCodes = false;
  if(zbOffer.basket && zbOffer.basket["reconciled-total"] && zbOffer.basket["reconciled-total"].length > 0 &&
    zbOffer.basket["reconciled-total"][0]["promo-codes"] && zbOffer.basket["reconciled-total"][0]["promo-codes"].length > 0) {
    hasFailedPromoCodes =  zbOffer.basket["reconciled-total"][0]["promo-codes"]
      .filter(function(o){ return o.status == "failed"}).length > 0;
  }
  if(zbBasket && zbBasket.basket && zbBasket.basket["reconciled-total"] && zbBasket.basket["reconciled-total"].length > 0 &&
    zbBasket.basket["reconciled-total"][0]["promo-codes"] && zbBasket.basket["reconciled-total"][0]["promo-codes"].length > 0) {
    hasFailedPromoCodes = zbBasket.basket["reconciled-total"][0]["promo-codes"]
      .filter(function(o){ return o.status == "failed"}).length > 0;
  }
  return hasFailedPromoCodes;
}

function getWrappedData(data) {
  delete data["ecommerce"];
  delete data["previous-sku"];
  return { "events": [data] }
}

function getGoogleClientId() {
  var ga = window.ga;
  if(ga && ga.getAll && ga.getAll() && ga.getAll().length > 0 && ga.getAll()[0].get('clientId')) {
    return ga.getAll()[0].get('clientId');
  }
  return null;
}

function getPercentageChangeInPrice() {

  var salePrice;
  var regPrice=zbSelectedSku.price;
/*  if(zbBasket){
    salePrice=getSalePriceForPrePdp(zbBasket);
  }
  else{
    salePrice=getSalePriceForPrePdp(zbOffer["basket"]);
  } 
   var percent=Math.floor((regPrice-salePrice)/regPrice *100); */
   var discountedTotal;
   //Get the discounted price from zbbasket object - order calc but no address
   var basketObj = zbOffer["basket"];
   if(basketObj && basketObj["reconciled-total"] && 
     basketObj["reconciled-total"].length > 0 &&
     basketObj["reconciled-total"][0]["discounted-total"]>=0) {
       discountedTotal = basketObj["reconciled-total"][0]["discounted-total"];
   }
   //Get the discounted price from zbbasket- order calc with address
   if(zbBasket && zbBasket.basket && zbBasket.basket["reconciled-total"] && 
     zbBasket.basket["reconciled-total"].length > 0 &&
     zbBasket.basket["reconciled-total"][0]["discounted-total"]) {
     discountedTotal = zbBasket.basket["reconciled-total"][0]["discounted-total"];
   }
 // zbOffer.basket["reconciled-total"][0]["discounted-total"]
   /*var offerPrice;
   if (zbOffer["offer"]["zapbuy-offer-price"]) {
     var offerPriceInDollars;
     offerPriceInDollars = zbOffer["offer"]["zapbuy-offer-price"]; // Offer file imported is in dollars
     offerPrice = offerPriceInDollars*100;

   } */
   //return percent;
   if(discountedTotal>=0 && regPrice) {
     return Math.floor(((regPrice - discountedTotal)/regPrice) * 100); // price change percentage calc
   } else {
     return 0;
   }
  
}