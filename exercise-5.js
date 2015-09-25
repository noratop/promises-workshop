var Promise = require("bluebird");
var request = Promise.promisify(require("request"));
var colors = require('colors');

var APIKey = '814d0e373e7fe92fe71b94abdddd015b';

var synonymPromises = request('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
.spread(function(result,body){
    return JSON.parse(body);
}).map(function(item, index, arrayLength) {
    var word = item.word;
    return request('http://words.bighugelabs.com/api/2/'+ APIKey +'/'+item.word+'/json').spread(function(result, body){
        try {
            var response = JSON.parse(body);
            return {word: word, response: response};
        }
        catch (e) {
            return {word: word};
        }
    });
}).then(function(response) {
    console.log(response);
   
    response.forEach(function(elt){
        console.log()
        if (elt.response){
            console.log('Synonyms found for the word: '+elt.word);
            if (elt.response.adverb){
                console.log('As an adverb:'.bold.gray);
                elt.response.adverb.syn.forEach(function(elt){
                    console.log('- '.bold.magenta+elt.magenta);
                });
            }
            if (elt.response.adjective){
                console.log('As an adjective:'.bold.gray);
                elt.response.adjective.syn.forEach(function(elt){
                    console.log('- '.bold.magenta+elt.magenta);
                });
            }
            if (elt.response.noun){
                console.log('As a noun:'.bold.gray);
                elt.response.noun.syn.forEach(function(elt){
                    console.log('- '.bold.magenta+elt.magenta);
                });
            }
            if (elt.response.verb){
                console.log('As a verb:'.bold.gray);
                elt.response.verb.syn.forEach(function(elt){
                    console.log('- '.bold.magenta+elt.magenta);
                });   
            }
        }
        else {
            console.log('No result were found for the word: '+elt.word);
        }
    });
});