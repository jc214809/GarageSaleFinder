    angular.module('sample.search', [])
      .controller('SearchCtrl', function SearchController($scope, $http, $location) {
        $scope.zipcode = 43230;
        $scope.miles = "15";
        $scope.dates = [];
        $scope.listings = [];
        $scope.keywords = ["Garage Sale", "Yard Sale", "Community Sale", "Community Garage Sale", "Moving Sale", "Barn Sale"];
        $scope.secondaryKeywords = ["Tag Sale", "Estate Sale", "Rummage Sale"];
        var FRIDAY = 5;
        var SATURDAY = 6;
        var SUNDAY = 0;

        $scope.doesListingExists = function(listings) {
          for (var i = 0; i < $scope.listings.length; i++) {
            if ($scope.listings[i].link == listings.link && $scope.listings[i].pubdate == listings.pubdate) {
              return true;
            }
          }
          return false;
        }

        $scope.getIndex = function(listings) {
          for (var i = 0; i < $scope.listings.length; i++) {
            if ($scope.listings[i].link == listings.link && $scope.listings[i].pubdate == listings.pubdate) {
              return i;
            }
          }
          return null;
        }

        $scope.toggleKeywordSearch = function(word) {
          if ($scope.keywords.indexOf(word) > -1) {
            var wordToRemove = $scope.keywords.splice($scope.keywords.indexOf(word), 1);
            $scope.secondaryKeywords.push(wordToRemove[0]);
          } else {
            var wordToRemove = $scope.secondaryKeywords.splice($scope.secondaryKeywords.indexOf(word), 1);
            $scope.keywords.push(wordToRemove[0]);
          }
        };

        $scope.getFeed = function(date) {
          for (var k = 0; k < $scope.keywords.length; k++) {
            feednami.load("https%3A%2F%2Fcolumbus.craigslist.org%2Fsearch%2Fgms%3Fformat%3Drss%26postal%3D" + $scope.zipcode + "%26query%3D" + $scope.keywords[k] + "%26sale_date%3D" + date + "%26search_distance%3D" + $scope.miles,
              function(result) {
                var listings = result.feed.entries;
                if (result.error) {
                  console.log(result.error);
                } else {

                  for (var i in result.feed.entries) {
                    if ($scope.doesListingExists(listings[i])) {
                      var index = $scope.getIndex(listings[i]);
                      if (!$scope.listings[index].saleDates.includes(date)) {
                        $scope.$apply(function() {
                          $scope.listings[index].saleDates.push(date);
                        });
                      }
                    } else {
                      listings[i].saleDates = [];
                      listings[i].saleDates.push(date);
                      if (listings[i].hasOwnProperty('title')) {
                        $scope.$apply(function() {
                          $scope.listings.push(listings[i]);
                        });
                      }
                    }
                  }
                };
              })
          }
        };
        $scope.updateSearch = function() {
          $scope.listings = [];
          for (var i = $scope.dates.length - 1; i >= 0; i--) {
            $scope.getFeed($scope.dates[i]);
          }
        }

        $scope.getGarageSaleDates = function() {
          var date = new Date();
          if ([FRIDAY, SATURDAY, SUNDAY].indexOf(date.getDay()) > -1) {
            if (date.getDay() == FRIDAY) {
              $scope.dates.push(formatDate(date));
              for (var i = 0; i < 2; i++) {
                date.setDate(date.getDate() + 1);
                var arrayDate = formatDate(date);
                $scope.dates.push(arrayDate);
              }
            }
            if (date.getDay() == SATURDAY) {
              $scope.dates.push(formatDate(date));
              date.setDate(date.getDate() + 1);
              $scope.dates.push(formatDate(date));
            }
            if (date.getDay() == SUNDAY) {
              $scope.dates.push(formatDate(date));
            }
          } else {
            date.setDate(date.getDate() + (7 + FRIDAY - date.getDay()) % 7);
            $scope.dates.push(formatDate(date));
            for (var i = 0; i < 2; i++) {
              date.setDate(date.getDate() + 1);
              var arrayDate = formatDate(date);
              $scope.dates.push(arrayDate);
            }
          }
        }

        $scope.getCurrentUserLocation = function() {
          $scope.zipcode =null;
          $scope.listings = [];
          window.navigator.geolocation.getCurrentPosition(function(pos) {
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + pos.coords.latitude + ',' + pos.coords.longitude + '&sensor=true&key=AIzaSyCkk2guPfwd0SPhb93GJ-nUmb5Xy-Hgq3Q').then(function(res) {
              if (res.status == 200) {
                for (var i = res.data.results[0].address_components.length - 1; i >= 0; i--) {
                  if (res.data.results[0].address_components[i].types[0] == "postal_code") {
                    $scope.zipcode = parseInt(res.data.results[0].address_components[i].short_name);
                    console.log($scope.zipcode);
                    break;
                  }
                }
              } else {
                console.log("ERROR getting Zip Code");
              }
            })
          });
        }
        $scope.getZipCode = function() {
          $.getJSON('https://ipinfo.io?token=b2230bc6924ef2', function(response) {
            $scope.$apply(function() {
              $scope.ipData = response;
              var loc = response.loc.split(",");
              var latitude = loc[0];
              var longitude = loc[1];
              $scope.zipcode = parseInt(response.postal);
            });
          });
        }

        $scope.clear = function() {
          $scope.listings = [];
        }

        function formatDate(date) {
          var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          return [year, month, day].join('-');
        }
        $scope.getGarageSaleDates();
        $scope.listings = [];
        for (var i = $scope.dates.length - 1; i >= 0; i--) {
          $scope.getFeed($scope.dates[i]);
        }

      });