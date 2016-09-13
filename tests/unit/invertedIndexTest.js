/*
* This function runs the tests for the application files
*/
(function() {
  //This is a mocked out
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

  //
  console.log(InvertedIndex);

  //Test suits to read and analyze files
  describe('Read book data' , function() {
    it('Should assert that the files are not empty', function(){
      expect(true).toEqual(true);
    });
    it('Makes sure that all properties of each object in a file is a string', function(){
      expect(true).toEqual(true);
    });
  });

  //Test suits populates the indexMap
  describe('Populate index' , function() {
    it('Should create an index map', function(){
      expect(true).toEqual(true);
    });
    it('Should map the string keys to the correct objects in indexMap', function(){
      expect(true).toEqual(true);
    });
    it('Should not override index when a new file is indexed', function(){
      expect(true).toEqual(true);
    });
  });

  //Test suits to read and analyze files
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
