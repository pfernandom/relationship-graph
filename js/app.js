var app = angular.module('myGraphApp',['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	//
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/state1");
	//
	// Now set up the states
	$stateProvider
		.state('state1', {
			url: "/state1",
			templateUrl: "partials/state1.html"
		})
		.state('state1.list', {
			url: "/list",
			templateUrl: "partials/state2.list.html",
			controller: function($scope) {
				$scope.items = ["A", "List", "Of", "Items"];
			}
		})

		.state('state2', {
			url: '/new/:personId',
			template: '<graph-chart href="{{href}}"></graph-chart>',
			controller: ['$scope', '$stateParams', function($scope, $stateParams) {
				$scope.href = "ajax/"+$stateParams.personId+".json";
			}],
		})
		.state('state2.list', {
			url: "/list",
			templateUrl: "partials/state2.list.html",
			controller: function($scope) {
				$scope.things = ["A", "Set", "Of", "Things"];
			}
		})
}]);




app.controller('GraphController', ['$scope', function($scope) {
	$scope.getRandom = function(){
		return Math.floor((Math.random()*6)+1);
	}
	$scope.id = 'graph-' +$scope.getRandom();
   
  }]);