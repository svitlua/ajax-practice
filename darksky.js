//https://api.darksky.net/forecast/ - darksky key

// 4c18fb1e591c293f15804f081558d51f
//
// GET https://api.darksky.net/forecast/0123456789abcdef9876543210fedcba/42.3601,-71.0589


var lat;
var lon;
var URL;
var user_location;
var defineLocale = "uk";
$('#weather-container').hide();
$('#loader').show();
var darksky_key = "4c18fb1e591c293f15804f081558d51f";
var google_key = "AIzaSyDolnAMkL0eXQAG2SQB8Er_rVGRtK51iUg";
var day;

getCoordinates();

function getCoordinates() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log("lat: "+lat+ ", longitude: "+ lon);
            $.ajax({
               type: "GET",
               url: "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&language=uk&key="+google_key,
               dataType: "json",
               success: function(result){
                 getAddress(result);
                 getWeather(lat, lon, day);
               },
               error: function(){
                 alert("Something went wrong with finding where you are");
               }
             });

        });
    } else {
      alert( "Geolocation is not supported by this browser.");
    }
}





function getWeather(lat, lon, day){
  if (!day || day===""){
    var DARKSKY_URL = "https://api.darksky.net/forecast/"+darksky_key+"/"+lat+","+lon+"?lang=uk&units=si";
  }else{
    var DARKSKY_URL = "https://api.darksky.net/forecast/"+darksky_key+"/"+lat+","+lon+","+day+"?lang=uk&units=si"
  }
  $.ajax({
     type: "GET",
     contentType: 'application/x-www-form-urlencoded',
     url: DARKSKY_URL,
     dataType: "jsonp",
     success: function(result){
       if (!day || day===""){
        day = result.currently.time; //if day is not defined but today
       }
       var time = moment.unix(day).format('LL');
       console.log(result);
       var summary = result.currently.summary;
       var temp = parseInt(result.currently.temperature);
       var temp_min = result.currently.temperatureMin;
       var temp_max = result.currently.temperatureMax;
       var windSpeed = result.currently.windSpeed;
       var humidity = parseInt(result.currently.humidity*100);
       var icon_path = "climacons/"+result.currently.icon+".png";
       var weather = "День: "+time+"Погода: "+summary+"\nTeмпература: "+temp+"\nШвидкість вітру: "+windSpeed+"\nВологість: "+humidity;
       console.log(weather);
       cleanContainers();
       $('#date').append(time);
       $('#climacon').attr("src", icon_path);
       $('#weather').append(summary);
       $('#temperature').append(temp+"&#8451;");
       $('#windSpeed').append("вітер: "+windSpeed+"км/год");
       $('#humidity').append("вологість: "+humidity+"%");
       var next_day = parseInt(day)+86400;
       var prev_day = parseInt(day)-86400;
       $('#nextDayBtn').attr("day", next_day);
       $('#prevDayBtn').attr("day", prev_day);
       $('#weather-container').show();
       $('#loader').hide();
     },
     error: function(){
       alert("Something went wrong with checking weather");
     }
   });
}

$( "#prevDayBtn" ).click(function() {
  day = $(this).attr('day');
  getWeather(lat, lon, day);
});

$( "#nextDayBtn" ).click(function() {
  day = $(this).attr('day');
  console.log(day);
  getWeather(lat, lon, day);
});

function getAddress(result){
  user_location = ((result.results[4].formatted_address).split(','))[0];
  console.log(user_location);
  $('#location').append(user_location);
}
function cleanContainers(){
  $('#weather').empty();
  $('#date').empty();
  $('#temperature').empty();
  $('#windSpeed').empty();
  $('#humidity').empty();
}
function renderIcon(icon){
  //+clear-day, +clear-night, +rain, +snow, +sleet, +wind, +fog, +cloudy, +partly-cloudy-day, +partly-cloudy-night
}
