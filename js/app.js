var app = angular.module('myGraphApp',['ui.router','ui.bootstrap']);

app.constant('appProperties',{
	urls:{
		listOfPersons:'ajax/listOfPersons.json',
		getPerson:'ajax/personCard.json',
		getRelationshipsForPerson:'ajax/miserables.json',
		getRelationshipTypeMap:'ajax/relationsMap.json'
	}
})

app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	//
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/state1");
	//
	// Now set up the states
	$stateProvider
		.state('state1', {
			url: "/state1",
			//resolve: { title: 'My Contacts' },
			params:{personId:""},
			onEnter: ['$stateParams',function($stateParams){
				console.log("On enter "+$stateParams.personId);
			}],
			onExit: ['$stateParams',function($stateParams){
				console.log("On exit "+$stateParams.personId);
			}],
			views: {
				"viewLeft": {
					template: '<person-table person-id="{{personId}}"></person-table>',
					controller: ['$scope', '$stateParams', function($scope, $stateParams) {
						console.log($stateParams);

						$scope.personId = $stateParams.personId;
						console.log('Ctrl:'+$stateParams.personId);
					}]},
				"viewMain": {
					templateUrl: "partials/state1.html",
					controller: ['$scope', '$stateParams','PersonService', function($scope, $stateParams, PersonService) {
						$scope.search = "";
						$scope.showAll = false;
						$scope.query = {name:$scope.search};
						PersonService.getListOfPersons(function(data, status, headers, config) {
							//$scope.data = data;
							$scope.persons = data.persons;
						},function(data, status, headers, config) {
							alert("AJAX failed!");
						});

						/*
						$scope.frameworks = [
							{name: 'Django', language: 'Python'},
							{name: 'AngularJS', language: 'Javascritp'}
						];
						*/

					}]
				}
			}

		})

		.state('state1.list', {
			url: '/new/:personId',
			onEnter: ['$stateParams',function($stateParams){
				console.log("On enter sub state "+$stateParams.personId);
			}],
			onExit: ['$stateParams',function($stateParams){
				console.log("On exit sub state "+$stateParams.personId);
				$stateParams.personId = "";
			}],
			views: {
				"viewSub": {
					template: '<graph-chart personId="{{personId}}"></graph-chart>',
					controller: ['$scope', '$stateParams', function($scope, $stateParams) {
						$scope.personId = $stateParams.personId;
					}]
				}
			}
		})

		.state('state2', {
			url: '/new/:personId',
			views: {
				"viewLeft": { template: "X" },
				"viewMain": {
					template: '<graph-chart personId="{{personId}}"></graph-chart>',
					controller: ['$scope', '$stateParams', function($scope, $stateParams) {
						$scope.personId = $stateParams.personId;
					}],
				}
			}

		})
		.state('state2.list', {
			url: "/list",
			views: {
				"viewLeft": { template: "X" },
				"viewMain": {
					templateUrl: "partials/state2.list.html",
					controller: ['$scope',function($scope) {
						$scope.things = ["A", "Set", "Of", "Things"];
					}] }
			}

		})
}]);




app.controller('GraphController', ['$scope', function($scope) {
	$scope.getRandom = function(){
		return Math.floor((Math.random()*6)+1);
	}
	$scope.id = 'graph-' +$scope.getRandom();
   
  }]);