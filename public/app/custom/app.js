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
    //Instance variables
    $scope.invertedIndexMap = {};
    $scope.searchSpace = {};

    //This function is called whenever the file selector directive has successfully read and updated
    //the value of a new file on this scope with the data just read
    $scope.notifyLoad = function() {
        $timeout(function() {
            $scope.invertedIndexMap[$scope.file.name] = angular.copy($scope.file);
        });
    };

    //This function builds the index for a particular file
    $scope.createIndex = function(fileName) {
        var message  = InvertedIndex.createIndex($scope.invertedIndexMap[fileName]);
        
        if(message.status) {
            var rawIndexMap = InvertedIndex.getIndex(fileName);
            var docSize = rawIndexMap[fileName]._docSize;
            delete(rawIndexMap[fileName]._docSize);

            Object.keys(rawIndexMap).forEach(function(fileName) {
                $scope.invertedIndexMap[fileName] = {
                    index: rawIndexMap[fileName],
                    size: (function () {
                        var sizeArr  = [];
                        for(var i=0; i < docSize; i++) {
                            sizeArr.push(i);
                        }
                        return sizeArr;
                    }()),
                    visible: true
                };

            });
        }
        else {
            alert(message.text);
        }
    };

    //This function uses the search method in the InvertedIndex API to get Results
    //Based on the keywords entered by user
    $scope.searchFiles = function(query) {
        if (query && query.length > 0 && Object.keys($scope.searchSpace).length > 0) {
            $timeout(function() { 
                var snapshot = InvertedIndex.searchIndex(query , Object.keys($scope.searchSpace));
                if(snapshot.status) {
                    $scope.results = snapshot.val;
                }
                else {
                    alert(snapshot.text);
                }
                
            });   
        } 
        else {
            alert('Please add a file or enter a search query');
        }
    };

    //This section controls the search space
    $scope.searchAll = false;
    $scope.toggleSearchAll = function() {
        if ($scope.searchAll) {
            $scope.searchSpace = {};
        } 
        else {
            $scope.searchSpace = angular.copy($scope.invertedIndexMap);
        }

        $scope.searchAll = !$scope.searchAll;
    };

    //This function adds a files the search searchSpace
    $scope.addFile = function(fileName, docs) {
        $scope.searchAll = false;
        if ($scope.searchSpace[fileName]) {
            delete $scope.searchSpace[fileName];
        } 
        else {
            $scope.searchSpace[fileName] = docs;
        }
    };
});
