var app = angular.module('app', ['ui.bootstrap']);

app.service('personService', function () {
  var persons = [];

  var addPerson = function(newPerson) {
    persons.push(newPerson);
  };

  var getPersons = function() {
    return persons;
  };

  var loadPersonsFromFile = function(){
    $http.get('persons.json')
          .then(function(res){
            this.persons = res.data;
          })
        };

  return {
    addPerson: addPerson,
    getPersons: getPersons,
    init: loadPersonsFromFile
  };

});

app.controller('indexController', ['$scope','$http','$uibModal', '$log', 'personService', function($scope, $http, $uibModal, $log, personService){
    $scope.persons = personService.getPersons();
    // $scope.items = ['item1', 'item2', 'item3'];
    $scope.animationsEnabled = true;
    $http.get('persons.json')
          .then(function(res){
            $scope.persons = res.data;
          });

    $scope.removePerson = function(person) {
      var removedPerson = $scope.persons.indexOf(person);
      $scope.persons.splice(removedPerson, 1);

    };

    $scope.open = function (size) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'addPersonModal.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          item: function () {
            return "hey";
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

    $scope.addPerson = function(){
        $scope.persons.push({
          newPerson
      });
      for(var prop in $scope.newPerson){
         if($scope.newPerson.hasOwnProperty(prop)){
           $scope.newPerson[prop] = '';
         }
       };
    };
    $scope.addName = function(){
        $scope.names.push($scope.newName.name);
      for(var prop in $scope.newName){
         if($scope.newName.hasOwnProperty(prop)){
           $scope.newName[prop] = '';
         }
       };
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };

    $scope.message = "hey all!";

    $scope.names = ['yolo', 'pocok', 'ilka'];

}]);


app.controller('ModalInstanceCtrl',['$scope', '$uibModalInstance', 'items', 'personService', function ($scope, $uibModalInstance, personService, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    console.log($scope.newPerson);
    personService.addPerson($scope.newPerson);
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);
