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
    return delay(500).then(function(){
        return inputStr[0];
    });
}


getFirstChar('hello').then(console.log);

// Create a function called getLastChar that takes a string, and 
// returns a Promise that will be resolved with the last character of the passed string, 
// after 500 milliseconds. You may use the delay function from the previous exercise.

function getLastChar(inputStr){
    return delay(500).then(function(){
        return inputStr[inputStr.length - 1];
    });
}

getLastChar('hello').then(console.log);

// Create a function called getFirstAndLastCharSeq that takes a string, 
// and returns a Promise that will be resolved with the first and last character 
// of the passed string. This function should use getFirstChar and getLastChar in sequence.

function getFirstAndLastCharSeq(inputStr){
    var firstChar;
    return getFirstChar(inputStr).then(function(res1){
        firstChar = res1;
        return getLastChar(inputStr);
    }).then(function(lastChar){
        return firstChar+lastChar;
        });
}

getFirstAndLastCharSeq('world').then(console.log);

// Create a function called getFirstAndLastCharParallel that takes a string, 
// and returns a Promise that will be resolved with the first and last character 
// of the passed string. This function should use getFirstChar and getLastChar in parallel, 
// using the Promise.join functionality of the Bluebird library.

function getFirstAndLastCharParallel(inputStr){
    var fistCharPromise = getFirstChar(inputStr);
    var lastCharPromise = getLastChar(inputStr);
    return Promise.join(fistCharPromise,lastCharPromise,function(firstChar,lastChar){
        return firstChar + lastChar;
        });
}

getFirstAndLastCharParallel('hello world').then(console.log);