var Promise = require("bluebird");
var request = Promise.promisify(require("request"));
var promptPromise = Promise.promisifyAll(require("prompt"));
var colors = require('colors');

var APIKey = '814d0e373e7fe92fe71b94abdddd015b';

console.log('Looking for synonyms? type your word below:');

promptPromise.start();

promptPromise.getAsync('word').then(function(result){
    return request('http://words.bighugelabs.com/api/2/'+ APIKey +'/'+result.word+'/json');
}).spread(function(result,body){
    var data = JSON.parse(body);
    return data;
}).then(function(data){
    if (data.adverb){
        console.log('As an adverb:'.bold.gray);
        data.adverb.syn.forEach(function(elt){
            console.log('- '.bold.magenta+elt.magenta);
        });
    }
    if (data.adjective){
        console.log('As an adjective:'.bold.gray);
        data.adjective.syn.forEach(function(elt){
            console.log('- '.bold.magenta+elt.magenta);
        });
    }
    if (data.noun){
        console.log('As a noun:'.bold.gray);
        data.noun.syn.forEach(function(elt){
            console.log('- '.bold.magenta+elt.magenta);
        });
    }
    if (data.verb){
        console.log('As a verb:'.bold.gray);
        data.verb.syn.forEach(function(elt){
            console.log('- '.bold.magenta+elt.magenta);
        });
    }
});