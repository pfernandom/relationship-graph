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
					template: '<person-table href="{{href}}"></person-table>',
					controller: ['$scope', '$stateParams', function($scope, $stateParams) {
						console.log('Ctrl:'+$stateParams.personId);
						$scope.href = $stateParams.personId;
					}]},
				"viewMain": { templateUrl: "partials/state1.html" }
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
					template: '<graph-chart href="{{href}}"></graph-chart>',
					controller: ['$scope', '$stateParams', function($scope, $stateParams) {
						$scope.href = "ajax/"+$stateParams.personId+".json";
					}],
				}
			}
		})

		.state('state2', {
			url: '/new/:personId',
			views: {
				"viewLeft": { template: "X" },
				"viewMain": {
					template: '<graph-chart href="{{href}}"></graph-chart>',
					controller: ['$scope', '$stateParams', function($scope, $stateParams) {
						$scope.href = "ajax/"+$stateParams.personId+".json";
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