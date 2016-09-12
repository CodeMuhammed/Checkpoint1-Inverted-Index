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
            //@TODO
        }

        /*
         * This method takes in an array of objects in the format {title:'',text:''},
         * And creates a searchable index with the words or tokens at each key value.
         *
         * @param {object} file
         * @param {function} done
         */
        function buildIndex(file, done) {
            //@TODO
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
         * @return {array} search_results
         */
        function searchIndex(query, indexMap, done) {
            //@TODO
        }

        //Public methods accessible by clients of this module
        return {
            buildIndex: buildIndex,
            searchIndex: searchIndex
        };
    });
})();
