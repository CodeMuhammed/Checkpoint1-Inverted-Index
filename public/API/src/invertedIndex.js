/*
 * Implementation of the Inverted index API
 */
(function() {
    //This prevents multiple initialzation of the API
    var ensure = function(obj, name, factory) {
        return obj[name] || (obj[name] = factory());
    };
    //Main logic here
    ensure(window, 'InvertedIndex', function() {
        /*
         * This method takes in a word with whitespaces, non-alphanumric characters and
         * Returns a clean version with all those unecessary characters striped away
         * And may sometimes further break tokens down into smaller parts
         *
         * @param {string} dirtyToken
         * @return {string} clean token
         */
         function _tokenize(dirtyToken) {
           //Converts the dirtyToken into a normalized form
           //@TODO add rules for words transformations, sysnonyms and other special cases
           return dirtyToken.trim().replace(/[^a-z0-9]+/gi, '').toLowerCase();
         }

        /*
         * This method takes in an array of objects in the format {title:'',text:''},
         * And creates a searchable index with the words or tokens at each key value.
         *
         * @param {object} file
         * @param {function} done
         */
         function buildIndex(file, done) {
               var index = {};

               //Worker function for creating word indeces
               var indexer = function(tokens, score, doc, id) {
                   tokens.forEach(function(token) {

                       token = _tokenize(token);
                       if (index[token]) {
                           if (index[token][id]) {
                               index[token][id].score += score;
                           } else {
                               index[token][id] = {
                                   score: score,
                                   source: doc
                               };
                           }
                       } else {
                           index[token] = {};
                           index[token][id] = {
                               score: score,
                               source: doc
                           };
                       }
                   });
               };

               //
               for (var i = 0; i < file.docs.length; i++) {
                   var currentDoc = file.docs[i];

                   //index title
                   var rawTitleTokens = currentDoc.title.split(' ');
                   indexer(rawTitleTokens, 2, currentDoc, i);

                   //index text
                   var rawTextTokens = currentDoc.text.split(' ');
                   indexer(rawTextTokens, 1, currentDoc, i);
               }

               done(null, {
                   fileName: file.name,
                   data: index
               });
           }

        /*
         * This method takes in a query containing keywords such that when normalized
         * Tallys with the indexed tokens.
         * Search Results are then aggregated by searching through the wordMapIndex with each tokens
         * From the query
         *
         * @param {string} query
         * @param {object} indexMap
         * @param {function} done
         * @return {array} search_results.
         */
         function searchIndex(query, indexMap, done) {
             //
             var searchResults = [];
             var fileNames = Object.keys(indexMap);
             var tokens = [];

             //This function checks the list of results for a given doc to see if it has already been added
             var resultExists = function(doc) {
                 for (var i = 0; i < searchResults.length; i++) {
                     if (searchResults[i].source.title === doc.source.title && searchResults[i].source.text === doc.source.text) {
                         return true;
                     }
                 }
                 return false;
             };

             //Generate tokens from query
             query.split(' ').forEach(function(token) {
                 token = _tokenize(token);

                 //
                 if (tokens.indexOf(token) < 0) {
                     //Search through every file in the map
                     fileNames.forEach(function(name) {
                         //Iterate through id of documemts
                         if (indexMap[name].index[token]) {
                             Object.keys(indexMap[name].index[token]).forEach(function(id) {
                                 //Make sure to add unique doc only in result
                                 var doc = indexMap[name].index[token][id];
                                 if (!resultExists(doc)) {
                                     searchResults.push(doc);
                                 }
                             });
                         }
                     });

                     //Record used tokens
                     tokens.push(token);
                 }
             });
             //
             //After the whole searching is done.
             done(searchResults);
         }

        //Public methods accessible by clients of this module
        return {
            buildIndex: buildIndex,
            searchIndex: searchIndex
        };
    });
})();
