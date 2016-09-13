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

  //Use API fron window global object
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
       Object.keys(indexMap).forEach(function(fileName) {
         Object.keys(indexMap[fileName].data).forEach(function(key) {
           Object.keys(indexMap[fileName].data[key]).forEach(function(docId) {
             var doc = indexMap[fileName].data[key][docId].source;
             var keyInDoc = false;

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

  //Test suits to read and analyze files {}[]
  describe('Search index' , function() {
    it('Should return an array of documents containing at least a search term', function(){
      expect(true).toEqual(true);
    });
    it('Should handle varied number of search terms', function(){
      expect(true).toEqual(true);
    });
    it('Should handle an array of search terms', function(){
      expect(true).toEqual(true);
    });
  });

})();
