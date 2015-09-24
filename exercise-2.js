var Promise = require("bluebird");

// Create a function called getFirstChar that takes a string, and 
// returns a Promise that will be resolved with the first character of the passed string, 
// after 500 milliseconds. You may use the delay function from the previous exercise.

function delay(duration){
    return new Promise(function(resolve){
        setTimeout(resolve,duration);
    });
}

function getFirstChar(inputStr){
    return new Promise(function(resolve){
        resolve(inputStr[0]);
    });
}


delay(500).then(function(){
    return getFirstChar('hello')
}).then(console.log);

