/*
 * This is the app that consumes the reverseIndex API and cotrols the UI/UX
 */
angular.module('InvertedIndexApp', [])

//A directive for reading txt files
.directive('fileSelect', ['$window', function($window) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, el, attrs, ngModel) {
            //Init new file reader object here
            var fileReader = new $window.FileReader();
            var fileName;

            //Listens for when user selects file (s)
            el.bind('change', function(e) {
                //
                if (e.target.files[0].name.indexOf('json') >= 0) {
                    fileName = e.target.files[0].name;
                    fileReader.readAsText(e.target.files[0]);

                } else {
                    //
                    alert('File not a json');
                }
            });

            fileReader.onload = function() {
                //Sets the file property of the ngModel scope
                ngModel.$setViewValue({
                    name: fileName,
                    docs: scope.$eval(fileReader.result)
                });

                //Call the callback
                if (attrs.fileLoaded) {
                    scope.$eval(attrs.fileLoaded);
                }
            };

            fileReader.onerror = function() {
                //@TODO
            };
        }
    };
}])

.controller('appController', function($scope, $timeout) {
    //This objects maps filenames to the corresponding inverted-index of the documents
    //contained within them
    $scope.invertedIndexMap = {};

    //This object holds the map of files to be included while searching
    $scope.searchSpace = {};

    //This object holds search Results
    $scope.searchResults = [];

    //This function is called whenever the file selector directive has successfully read and updated
    //the value of a new file on this scope with the data just read
    $scope.notifyLoad = function() {
        $timeout(function() {
            $scope.invertedIndexMap[$scope.file.name] = angular.copy($scope.file);
        });
    };

    //This function builds the index for a particular file
    $scope.buildIndex = function(fileName) {
        InvertedIndex.buildIndex($scope.invertedIndexMap[fileName], function(err, result) {
            if (err) {
                alert('invalid file');
            } else {
                //Add it to the invertedIndexmap
                //@TODO check to see if file name conflicts to avoid overwriting
                $timeout(function() {
                    $scope.invertedIndexMap[result.fileName] = {
                        index: result.data,
                        size: (function getArr() {
                            arr = [];
                            for (var i = 0; i < $scope.file.docs.length; i++) {
                                arr.push(i);
                            }
                            return arr;
                        })(),
                        visible: true
                    };
                });
            }
        });
    };

    //This function uses the search method in the InvertedIndex API to get Results
    //Based on the keywords entered by user
    $scope.searchFiles = function(query) {
        if (query && query.length > 0 && Object.keys($scope.searchSpace).length > 0) {
            InvertedIndex.searchIndex(query, $scope.searchSpace, function(results) {
                $timeout(function() {
                    $scope.results = results;
                });

            });
        } else {
            alert('Please add a file or enter a search query');
        }
    };

    //This section controls the search space {}[]
    $scope.searchAll = false;
    $scope.toggleSearchAll = function() {
        if ($scope.searchAll) {
            $scope.searchSpace = {};
        } else {
            $scope.searchSpace = angular.copy($scope.invertedIndexMap);
        }
        $scope.searchAll = !$scope.searchAll;
    };

    //This function adds a files the search searchSpace
    $scope.addFile = function(fileName, docs) {
        $scope.searchAll = false;
        if ($scope.searchSpace[fileName]) {
            delete $scope.searchSpace[fileName];
        } else {
            $scope.searchSpace[fileName] = docs;
        }
    };
});
