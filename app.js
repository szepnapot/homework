var app = angular.module('app', ['ui.bootstrap', "googlechart"]);

app.controller('indexController', ['$scope','$http','$log', '$uibModal', function($scope, $http, $log, $uibModal){
    $scope.persons;
    $scope.sortType = 'name';
    $scope.sortReverse = false;
    $scope.search = '';
    $scope.showGraph = false;

   $scope.myChartObject = {};

   $scope.myChartObject.type = "ColumnChart";

   $scope.ageNamePairsData = [];

   $scope.fillAgeNamePairsData = function() {
     for (var i = 0; i < $scope.persons.length; i++) {
       $scope.ageNamePairsData.push(
         [{v: $scope.persons[i].name},
         {v: $scope.persons[i].age}]);
     }
    $scope.updateChart();
   }

   $scope.myChartObject.data = {"cols": [
       {id: "t", label: "Names", type: "string"},
       {id: "s", label: "Age", type: "number"}
   ], "rows": []};

   $scope.updateChart = function() {
     for (var i = 0; i < $scope.ageNamePairsData.length; i++) {
       $scope.myChartObject.data.rows.push(
         {c: [$scope.ageNamePairsData[i][0],
              $scope.ageNamePairsData[i][1]]}
       )
     }
   }

   $scope.myChartObject.options = {
       'title': 'Age distribution'
   };

    $http.get('persons.json')
          .then(function(res){
            $scope.persons = res.data;
            $scope.fillAgeNamePairsData();
          });

    $scope.removePerson = function(person) {
      var removedPerson = $scope.persons.indexOf(person);
      $scope.persons.splice(removedPerson, 1);

    };

    $scope.open = function (size) {

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'addPersonModal.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          newPerson: function () {
            return $scope.newPerson;
          }
        }
      });

      modalInstance.result.then(function (newPerson) {
        $scope.persons.push(newPerson);
        $scope.fillAgeNamePairsData();
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };
}]);


app.controller('ModalInstanceCtrl',['$scope', '$uibModalInstance', 'newPerson', function ($scope, $uibModalInstance, newPerson) {
  $scope.newPerson = newPerson;

  $scope.ok = function () {
    if (!$scope.newPerson.employee) {
      $scope.newPerson.employee = false;
    }
    $uibModalInstance.close($scope.newPerson);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);
