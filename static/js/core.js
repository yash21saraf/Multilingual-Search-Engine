function baseLogger(level, message, value)
{
    var level = level.toUpperCase(),
        logFn = ("ERROR" == level) ? console.error : console.log;
    logFn([new(Date),
           "[" + level + "]",
           message].join(" "),
          value);
}

var _logger = baseLogger;

function setLogger(logger)
{
    _logger = logger;
}

function doLog(level, message, value)
{
    _logger(level, message + (value ? ":" : ""), value);
}

function logInfo(msg, value)
{
    doLog("INFO", msg, value);
}

function logDebug(msg, value)
{
    doLog("DEBUG", msg, value);
}

function logError(msg, value)
{
    doLog("ERROR", msg, value);
}

function asSet(seq)
{
    var set = {};
    for (var i = 0; i < seq.length; i++) {
        set[seq[i]] = seq[i];
    }
    return set;
}

function removeKeys(m, ks)
{
    var set = asSet(ks),
        result = {};
    for (var k in m) {
        if (m.hasOwnProperty(k) && !set[k])
            result[k] = m[k];
    }
    return result;
}

function selectKeys(m, ks)
{
    var r = {},
        kset = asSet(ks);
    for (var k in m) {
        if (m.hasOwnProperty(k) && kset[k]) {
            r[k] = m[k];
        }
    }
    return r;
}

function callIf(f, arg)
{
    if (f) f(arg);
}

function doGet(url, success, error)
{
    $.ajax({url: url,
            success: success,
            error: error});
}

function doPost(url, data, success, error, req)
{
    $.ajax($.extend(
        {
            type: "POST",
            url:  url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: success,
            error: error
        },
        req));
}

function doPostAuth(url, data, success, error, token)
{
    doPost(url, data, success, error,
           {headers: {"Authorization": "Bearer " + token}});
}

function makeDebugCallback(message, callback) {
    return function(data) {
        logDebug(message, data);
        callIf(callback, data);
    };
}

function currentURISansQuery()
{
    var qIndex = location.href.indexOf("?");
    if (0 < qIndex) {
        return location.href.slice(0, qIndex);
    }
    return location.href;
}

var _queryParams = null;
function params()
{
    if (null != _queryParams) return _queryParams;
    _queryParams = {};
    var kvPairs = window.location.search.slice(1).split("&");
    for (var i = 0; i < kvPairs.length; i++) {
        var kvPair = kvPairs[i].split("=");
        _queryParams[kvPair[0]] = kvPair[1];
    }
    return _queryParams;
}

function getParam(name)
{
    return params()[name];
}

function hasCookie(name)
{
    return (typeof Cookies.get(name) != "undefined");
}

function setCookie(name, value, opts)
{
    Cookies.set(name, JSON.stringify(value), opts || {path: "",expires:new Date(new Date().getTime() +30*24*3600*1000)});
}

function getCookie(name)
{
    if (hasCookie(name)) {
        return JSON.parse(Cookies.get(name));
    }
    return null;
}

function uuidv4()
{
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .replace(/[xy]/g,
                 function(c) {
                     var r = Math.random() * 16 | 0,
                         v = c == "x" ? r : (r & 0x3 | 0x8);
                     return v.toString(16);
                 });
}

// TODO: check if following is required
// var gensym = (function () {
//     var _gensymCounter = 1000;
//     return function () {
//         return "g" + _gensymCounter++;
//     };
// })();

// function isObject(x) { return "object" === typeof(x); }

// function isArray(x) { return (x instanceof Array); };

// function isString(x) { return typeof(x) == "string"; };

// function html(spec) {

//     function setAttributes (el, attribs) {
//         for (var key in attribs) {
//             el.setAttribute(key, attribs[key]);
//         }
//     }

//     if (undefined == spec) {
//         return document.createTextNode("");
//     } else if (isString(spec)) {
//         return document.createTextNode(spec);
//     } else if (isArray(spec)) {
//         var el = document.createElement(spec[0]),
//             i = 1;
//         if (isObject(spec[i]) && !isArray(spec[i])) {
//             setAttributes(el, spec[i]);
//             i++;
//         }
//         var subspec = spec.slice(i);
//         for (var j = 0; j < subspec.length; j++) {
//             var s = subspec[j];
//             el.appendChild(html(s));
//         }
//         return el;
//     }
//     return null;
// }