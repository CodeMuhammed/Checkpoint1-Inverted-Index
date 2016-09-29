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
  
  describe('Tests for Inverted-index API' , function() {

    describe('Read book data' , function() {
       //can't really test this suite'
    });

    describe('Populate Index' , function() {
      var indexMap; 

      //Reset indexMap before each run of this suite.
      beforeAll(function() {
        indexMap = {};
      });

      it('Maps the string keys to the correct objects in the JSON array', function() {
        InvertedIndex.createIndex({
          name: 'file1',
          docs: mockFiles[0]
        }); 

        indexMap = InvertedIndex.getIndex('file1')['file1'];
        delete(indexMap._docSize);

        //This checks the docs associated with  all key indices in the indexMap
        //and ensure that all docs contains a token (s) that is equal to the corresponding
        //key they are mapped to.
        Object.keys(indexMap).forEach(function(key) { //search all indexed keys (tokens or words)
          Object.keys(indexMap[key]).forEach(function(docId) {//search all docs that maps to this key
            var doc = indexMap[key][docId].source;

            //Merge the contents of the doc to one long string and create an
            //array of tokenized terms
            var mergedContentTokens  = (doc.title+' '+doc.text).split(' ').map(function(token) {
              return InvertedIndex._tokenize(token);
            });

            //check mergedContentTokens to see if key exists
            expect(mergedContentTokens.indexOf(key) >= 0).toBeTruthy();
          });
        });
        
      });

      it('Ensures index is not overwritten by a new JSON file' , function() {
         //Index a file
         InvertedIndex.createIndex({
            name: 'file1',
            docs: mockFiles[0]
         });

         //Check if the lenght is 1
         expect(Object.keys(InvertedIndex.getIndex('file1')).length === 1).toBeTruthy();

         //Index another file
         InvertedIndex.createIndex({
            name: 'file2',
            docs: mockFiles[1]
         });

         //Check if the length of the indexed files is now 2
         expect(Object.keys(InvertedIndex.getIndex()).length === 2).toBeTruthy();
         
      })

    });

    //Test suits populates the index and makes sure it's in the  desired state'
    describe('Get Index' , function() {
      InvertedIndex.createIndex({
        name: 'file1',
        docs: mockFiles[0]
      });

      it('Ensures getIndex returns the correct index', function() {
        expect(typeof InvertedIndex.getIndex('file1')['file1'] === 'object').toBeTruthy();
      });
      
    });

    //Test suits populates the index and makes sure it's in the  desired state'
    describe('Search Index' , function() {
      //Index a file
      InvertedIndex.createIndex({
        name: 'file1',
        docs: mockFiles[0]
      });

      var query = 'Hello #TIA';

      it('verifies that searching the index returns correct values', function(){
        var results = InvertedIndex.searchIndex(query , 'file1');
        var mergedContentTokens;
        //
        query.split(' ').forEach(function(word) {
          word = InvertedIndex._tokenize(word);

          results.val.forEach(function(result){
                mergedContentTokens  = (result.source.title+' '+result.source.text).split(' ').map(function(token) {
                return InvertedIndex._tokenize(token);
              });  
          });
          
          expect(mergedContentTokens.indexOf(word) >=0).toBeTruthy();
        });

        
      });

      it('Ensures search does not take too long to execute', function() {
        var MAX_TIME = 500; //milliseconds
        var query = 'Hello #TIA';
        var starTime;
        var stopTime;

        InvertedIndex.createIndex({
          name: 'file1',
          docs: mockFiles[0]
        });

        //Search files here
        startTime = Date.now();

        var result = InvertedIndex.searchIndex(query.split(' ') , 'file1');
        expect(result.status).toBeTruthy();

        stopTime = Date.now();

        expect(stopTime-startTime < MAX_TIME).toBeTruthy();

      });

      it('Ensure searchIndex can handle an array of search terms' , function() {
        var result = InvertedIndex.searchIndex(query.split(' ') , 'file1');
        expect(result.status).toBeTruthy();
      });

    });

  });
}());
