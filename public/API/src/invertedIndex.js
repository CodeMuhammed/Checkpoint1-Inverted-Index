/*
 * Implementation of the Inverted index API
 */
(function() {
    //This prevents multiple initialzation of the API
    var ensure = function(obj, name, factory) {
        if(obj[name]){
            throw new Error(name+' Already exists in global space');
        }
        else {
            obj[name] = factory();
            return;
        }
    };

    //Main logic here
    ensure(window, 'InvertedIndex', function() {
        //Instance variable to hold the indices.
        var indexMap = {};

        //
        var TITLE_SCORE = 2;
        var TEXT_SCORE = 1;

        /*
         * This method takes in a word with whitespaces, non-alphanumric characters and
         * Returns a clean version with all unecessary characters striped away
         * And may sometimes further break token down into smaller parts
         *
         * @param {string} dirtyToken
         * @return {string} clean token
         */
         function _tokenize(dirtyToken) {
           //Converts the dirtyToken into a normalized form
           return dirtyToken.trim().replace(/[^a-z0-9]+/gi, '').toLowerCase();
         }


        /*
         * This function takes in a fileObject and generates an inverted index for it
         *
         * @param {object} fileObj
         * @return {obj} message
         */
         function createIndex(fileObj) {
             var message = {
                 status: false,
                 text: ''
             };
             
             if(typeof fileObj !== 'object') {
                 message.text = 'Argument must be an object';
             }
             if( (typeof fileObj.name !== 'string' && fileObj.name !=='') || !(Array.isArray(fileObj.docs)) ) {
                 message.text = 'Invalid argument object: does not contain required properties';
             }
             else {
                 indexMap[fileObj.name] = {
                     _docSize:fileObj.docs.length
                 };

                 for(var i=0; i < fileObj.docs.length; i++) {
                    var currentDoc = fileObj.docs[i];


                    //Index only docs that are formatted correctly
                    if(typeof currentDoc.title === 'string' && typeof currentDoc.text === 'string') {
                        //index title
                        var rawTitleTokens = currentDoc.title.split(' ');
                        indexer(fileObj.name , rawTitleTokens, TITLE_SCORE, currentDoc, i);

                        //index text
                        var rawTextTokens = currentDoc.text.split(' ');
                        indexer(fileObj.name , rawTextTokens, TEXT_SCORE , currentDoc, i);
                    }
                }
                
                if(Object.keys(indexMap[fileObj.name]).length > 1) {
                    message.status = true;
                    message.text = 'Index created successfully';
                }
                else {
                    message.text = 'File does not contain any indexable docs';
                }
                
             }
             
             //
             return message;
         }

         /** 
         * This methods takes a document and adds its inverted index to the indexMap
         *
         * @param {string} fileName
         * @param {array} tokens
         * @param {number} score
         * @param {object} doc
         * @param {number} id
         * 
         */
         function indexer(fileName , tokens, score, doc, id) {

             tokens.forEach(function(token) {
                token = _tokenize(token);
                if (indexMap[fileName][token]) {
                    if (indexMap[fileName][token][id]) {
                        indexMap[fileName][token][id].score += score;
                    }
                    else {
                        indexMap[fileName][token][id] = {
                            score: score,
                            source: doc
                        };
                    }
                } 
                else {
                    indexMap[fileName][token] = {};
                    indexMap[fileName][token][id] = {
                        score: score,
                        source: doc
                    };
                }
            });
         }

        /*
         * This method returns the inverted index corresponding to the fileName
         * If a filename is not provided, it returns all the indeces
         *
         * @optional {string} filename
         * @return {object} invertedIndex
         */
         function getIndex(fileName) {
            if(fileName && typeof fileName === 'string' && indexMap[fileName]) {
                var obj = {};
                obj[fileName] = indexMap[fileName];

                return obj;
            }
            return indexMap;
         }

        /*
         * This mwthods searches through the inverted index for docs that matches the query
         * 
         * @param {string / array} query
         * @return {array} searchResults
         */
         function searchIndex(query , options) {
             var searchResults = [];
             var usedTokens = [];
             var fileNames = Object.keys(indexMap);

             var rawTokens;
             var message = {
                 status:false,
             };

             if(typeof query === 'string') {
               rawTokens = query.split(' ');
             }
             else if(typeof query[0] === 'string') {
               rawTokens = query;
             }
             else {
                 message.text = 'Invalid query provided';
                 return message;
             }

              //
             rawTokens.forEach(function(token) {
                 token = _tokenize(token);
                 if (usedTokens.indexOf(token) < 0) {
                     //Search through every file in the map
                     fileNames.forEach(function(name) {
                         //Iterate through id of documemts
                         if (indexMap[name][token]) {
                             Object.keys(indexMap[name][token]).forEach(function(id) {
                                 //Make sure to add unique doc only in result
                                 var doc = indexMap[name][token][id];
                                 var existsInResult = resultExists(doc , searchResults);
                                 if (existsInResult < 0) {
                                     searchResults.push(doc);
                                 }
                                 //update the score for that particular document
                                 else {
                                   searchResults[existsInResult].score+=doc.score;
                                 }
                             });
                         }
                     });

                     //Record used tokens
                     usedTokens.push(token);
                 }
             });
             
             message.status = true;
             message.val = searchResults;
             return message;
         };

         /*
         * This methods prevents search results from having duplicates
         * 
         * @param {array} results
         * @return {object} doc
         */
         function resultExists(results , doc) {
            var docIndexInResult = -1;
            for (var i = 0; i < results.length; i++) {
                if (results[i].source.title === doc.source.title && resultesults[i].source.text === doc.source.text) {
                    return i;
                }
            }
            return docIndexInResult;
         }

        //Public methods accessible by clients of this module
        return {
            createIndex:createIndex,
            getIndex:getIndex,
            searchIndex:searchIndex,
            _tokenize:_tokenize
        };
        
    });
}());
