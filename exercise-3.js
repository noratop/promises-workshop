var Promise = require("bluebird");
var request = Promise.promisify(require("request"));
var promptPromise = Promise.promisifyAll(require("prompt"));

//necessary function for distanceTo
Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
}


//Returns distance between point1 and point2;
function distanceTo(point1, point2, radius) {
    radius = (radius === undefined) ? 6371 : Number(radius);

    var R = radius;
    var φ1 = point1.lat.toRadians(),  λ1 = point1.lng.toRadians();
    var φ2 = point2.lat.toRadians(), λ2 = point2.lng.toRadians();
    var Δφ = φ2 - φ1;
    var Δλ = λ2 - λ1;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d;
};


var issPositionPromise = request('http://api.open-notify.org/iss-now.json').spread(function(result,body){
    //console.log(result);
    var issLatLong = JSON.parse(body).iss_position;
    issLatLong.lat = issLatLong.latitude;
    issLatLong.lng = issLatLong.longitude;
    return issLatLong;
});


console.log('What is your current location ?');

promptPromise.start();

var userLocationPromise = promptPromise.getAsync('location').then(function(result){
    //console.log(result);
    return request('https://maps.googleapis.com/maps/api/geocode/json?address='+result.location);
}).spread(function(result,body){
    var userData = JSON.parse(body).results[0];
    return userData.geometry.location;
});

Promise.join(issPositionPromise,userLocationPromise,function(iss,user){
//   console.log(iss);
//   console.log(user);
   return distanceTo(iss,user);
}).then(function(result){
    console.log('You are located '+ Math.round(result) + 'km from the ISS station');
}).catch(function(error){
    console.log('An error has occured: ' + error);
});




