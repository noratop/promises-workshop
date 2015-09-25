var Promise = require("bluebird");
var request = Promise.promisify(require("request"));
var Table = require('cli-table');
var colors = require('colors');

var BHT_APIKey = '814d0e373e7fe92fe71b94abdddd015b';
// var wordnikAPIKey = '814d0e373e7fe92fe71b94abdddd015b';
// never received my API Key for wordnik

function getSynonymsTwoWord(type) { // type can be 'noun', 'verb', 'adjective'
    return request('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech='+type+'&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=20&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
    .spread(function(result,body){
        try {
            return JSON.parse(body);
        }
        catch (err){
            console.log("Error: the words couldn't be retrieved");
        }
    }).map(function(item, index, arrayLength) {
        var word = item.word;
        return request('http://words.bighugelabs.com/api/2/'+ BHT_APIKey +'/'+item.word+'/json').spread(function(result, body){
            try {
                var response = JSON.parse(body);
                return {word: word, type: type, value: response};
            }
            catch (e) {
                return {word: word, type: type};
            }
        });
    });
}

function getAllSynonyms(){
    var nounsSyn = getSynonymsTwoWord('noun');
    var verbsSyn = getSynonymsTwoWord('verb');
    var adjectivesSyn = getSynonymsTwoWord('adjective');
    
    return Promise.join(nounsSyn,verbsSyn,adjectivesSyn, function(nouns,verbs,adjectives){
        return {
            nouns: nouns,
            verbs: verbs,
            adjectives: adjectives,
        };
    })   
}



getAllSynonyms().then(function(allResult){
    var table = new Table();

    //console.log(allResult);
    for (var wordCouple in allResult){
        table.push([wordCouple.bold.random]);
        
        var word0 = allResult[wordCouple][0];
        var word1 = allResult[wordCouple][1];
        
        if (word0.value) {
            var row0 = [word0.word.bold.trap];

            if (word0.value[word0.type]) {
                if (word0.value[word0.type].syn) row0.push(word0.value[word0.type].syn.join('\n').rainbow);
            }
            table.push(row0);
        }
        if (word1.value) {
            var row1 = [word1.word.bold.trap];

            if (word1.value[word1.type]) {
                if (word1.value[word1.type].syn) row1.push(word1.value[word1.type].syn.join('\n').america);
            }
            table.push(row1);
        }
        
    }
    console.log(table.toString());
});
