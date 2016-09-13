/*
* This function runs the tests for the application files
*/
(function() {

  //This is a mocked out files
  var mockFiles = [
    [
      {
        title: 'Hello world',
        text: 'This is the very first post'
      },
      {
        title: 'Hello Andela',
        text: '#TIA is awesome'
      }
    ],
    [
      {
        title: 'The third wave',
        text: 'A book on entrepreneurship'
      },
      {
        title: 'The art of the start',
        text: 'An awesome book written by a good guy'
      },
      {
        title: 'Jerry colemann',
        text: 'The president of nothing'
      }
    ]
  ];

  //Use API from window global object
  console.log(InvertedIndex);

  //Test suits to read and analyze files
  describe('Read book data' , function() {
    it('Should assert that the files are not empty', function(){
      mockFiles.forEach(function(file) {
        expect(file.length>0).toBeTruthy();
      });
    });

    it('Makes sure that all properties of each object in a file is a string', function(){
      mockFiles.forEach(function(file) {
        file.forEach(function(doc) {
          expect(typeof doc.title === 'string').toBeTruthy();
          expect(typeof doc.text === 'string').toBeTruthy();
        });
      });
    });
  });

  //Test suits populates the indexMap
  describe('Populate index' , function() {
    //This holds the indexMap for files
    var indexMap = {};

    //Reset indexMap before each run of this suite.
    beforeAll(function() {
      indexMap = {};
    });

    it('Should create an index map', function(done){
      //
      var file = {
        name: 'file1',
        docs: mockFiles[0]
      };

      InvertedIndex.buildIndex(file , function(err , index) {
        indexMap[index.fileName] = index;
        expect(index.fileName === 'file1').toBeTruthy();
        expect(Object.keys(index.data).length>0).toBeTruthy();
        done();
      });
    });

    it('Should map the string keys to the correct objects in indexMap', function(){
      //This checks the docs associated with  all key indices in the indexMap
      //and ensure that all docs contains a token (s) that is equal to the corresponding
      //key they are mapped to.
       Object.keys(indexMap).forEach(function(fileName) {//search all files
         Object.keys(indexMap[fileName].data).forEach(function(key) { //search all indexed keys (tokens or words)
           Object.keys(indexMap[fileName].data[key]).forEach(function(docId) {//search all docs that maps to this key
             var doc = indexMap[fileName].data[key][docId].source;

             //Merge the contents of the doc to one long string and create an
             //array of tokenized terms
             var mergedContentTokens  = (doc.title+' '+doc.text).split(' ').map(function(token) {
               return InvertedIndex._tokenize(token);
             });

             //check mergedContentTokens to see if key exists
             expect(mergedContentTokens.indexOf(key)>=0).toBeTruthy();
           });
         });
       });

    });

    it('Should not override index when a new file is indexed', function(done){
      //
      var file1 = {
        name: 'file1',
        docs: mockFiles[0]
      };

      //
      var file2 = {
        name: 'file2',
        docs: mockFiles[1]
      };

      //Index the first file
      InvertedIndex.buildIndex(file1 , function(err , index) {
        indexMap[index.fileName] = index;
        //asserts that only one file was indexed
        expect(Object.keys(indexMap).length === 1).toBeTruthy();

        //Index the second file
        InvertedIndex.buildIndex(file2 , function(err , index) {
          indexMap[index.fileName] = index;
          //asserts that two files are now indexed
          expect(Object.keys(indexMap).length === 2).toBeTruthy();
          done();
        });
      });
    });
  });

  //Test suits to read and analyze files
  describe('Search index' , function() {
    //This holds the indexMap for files
    var indexMap = {};

    //
    var file = {
      name: 'file1',
      docs: mockFiles[0]
    };

    InvertedIndex.buildIndex(file , function(err , result) {
      indexMap[result.fileName] = {
          index: result.data,
          size: (function getArr() {
              arr = [];
              for (var i = 0; i < file.docs.length; i++) {
                  arr.push(i);
              }
              return arr;
          })(),
          visible: true
      };
    });

    it('Should return an array of documents that has at least a search term in the text or title', function(done){
      //search for documents that have "hello" or "#TIA" in them  {}[]
      var query = 'hello #TIA';

      InvertedIndex.searchIndex(query , indexMap , function(results) {
        //checks to make sure that the results returned have at least a keyword in them
        results.forEach(function(doc) {

          //Merge the contents of the doc to one long string and create an
          //array of tokenized terms
          var mergedContentTokens  = (doc.source.title+' '+doc.source.text).split(' ').map(function(token) {
            return InvertedIndex._tokenize(token);
          });

          //check if any of the queryTokens exists in mergedContentTokens
          var tokenExists = false;
          query.split(' ').forEach(function(token) {
            if(mergedContentTokens.indexOf(InvertedIndex._tokenize(token))>=0) {
              tokenExists = true;
            }
          });

          //Asserts that token actually exists
          expect(tokenExists).toBeTruthy();

          //
          done();
        });
      });
    });

    it('Should handle varied number of search terms', function(){
      //expect(true).toEqual(true);
    });

    it('Should handle an array of search terms', function(){
      //search for documents that have "hello" or "#TIA" in them
      var query = 'hello #TIA';

      //Instead of passing a string query into searchIndex method, we pass it an
      //array of search terms or tkens
      InvertedIndex.searchIndex(query.split(' ') , indexMap , function(results) {
          expect(results.length>0).toBeTruthy();
      });
    });
  });

})();
