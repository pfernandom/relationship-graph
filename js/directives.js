"use strict";
var app = angular.module('myGraphApp');

app.directive('personInfoCard',['$http','PersonService',function($http, PersonService){
	return {
		scope:{
			personId:'@'
		},
		templateUrl:'partials/personInfoCard.html',
		link:function(scope, element, attrs) {
			scope.getLabel = function(type){
				if(type === 1){
					return "label label-success"
				}
				else{
					return "label label-danger"
				}

			}

			PersonService.getPerson(scope.personId,function(data, status, headers, config) {
				scope.name = data.name;
				scope.imageUrl = data.imageUrl;
				scope.labels = data.labels;
			},function(data, status, headers, config) {
				alert("AJAX failed!");
			});
		}
	}

}]);

app.directive('personTable',['$http','PersonService',function($http, PersonService){
	return {
		scope:{
			personId:'@'
		},
		templateUrl:'partials/personTable.html',
		link:function(scope, element, attrs) {
			console.log(scope.personId);

			if(scope.personId  && 0 !== scope.personId.length){
				/*
				var getIncomingRelations = function(nodeNum, links){
					var relations = [];
					for(var link in links){
						if(link.target === nodeNum || link.source === nodeNum){
							relations.push(link);
						}
					}
					return relations;
				}
				*/
				PersonService.getPerson(scope.personId,function(data){
					scope.personData = data;
				},function(){
					alert("AJAX failed!");
				});

				scope.persons = [];

				PersonService.getRelationshipsForPerson(scope.personId,function(data, status, headers, config) {
					if(data){
						for(var link in data.links){
							link = data.links[link];
							console.log(link);
							var sourceNode = $.grep(data.nodes, function(e){ return e.nodeNum == link.source; });
							var targetNode = $.grep(data.nodes, function(e){ return e.nodeNum == link.target; });
								if(sourceNode[0].personId === scope.personId || targetNode[0].personId === scope.personId ){
								scope.persons.push({
									source:sourceNode[0],
									target:targetNode[0],
									relation:PersonService.getTypeOfRelationship(link.value)
								});
							}
						}
					}
					else{
						alert('No data!');
					}
				},function(data, status, headers, config) {
					alert("AJAX failed!");
				});

				scope.$watch("personId",function(newValue,oldValue) {
					console.log('Value changed!'+newValue);
				});
			}
			else{
				scope.isEmpty = true;
			}
		}
	}

}]);

app.controller('ItemController', ['$scope', function (scope) {

	scope.$parent.isopen = (scope.$parent.default === scope.item);

	scope.$watch('isopen', function (newvalue, oldvalue, scope) {
		scope.$parent.isopen = newvalue;
	});

}]);

app.directive('caseInfoCard',['$http',function($http){
	return {
		scope:{
			href:'@'
		},
		templateUrl:'partials/caseInfoCard.html',
		link:function(scope, element, attrs) {
			scope.getLabel = function(type){
				if(type === 1){
					return "label label-success"
				}
				else{
					return "label label-danger"
				}

			}

			var responsePromise = $http.get(scope.href);
			responsePromise.success(function(data, status, headers, config) {
				scope.caseId = data.caseId;
				scope.caseType = data.caseType;
				scope.date = data.date;
			});
			responsePromise.error(function(data, status, headers, config) {
				alert("AJAX failed!");
			});
		}
	}

}]);

app.directive('myHeader',['$http',function($http){
	return{
		templateUrl:'partials/header.html'
	}
}]);

app.directive('myFooter',['$http',function($http){
	return{
		templateUrl:'partials/footer.html'
	}
}]);


app.directive('graphChart',['$compile','GraphService','PersonService',function($compile, GraphService,PersonService){
	return {
		scope:{
			personId:'@'
		},
		controller:'GraphController',
		template:'<div id="{{id}}"><span class="btn btn-primary glyphicon glyphicon-refresh" ng-click="refresh()"></span></div>',
		link:function(scope, element, attrs) {

			var colMd = 700;
			console.log($(element[0]).width());
			var width =  parseInt($(element[0]).width(), 10);
			var	height;

			if(width <= colMd){
				height = width;
			}
			else{
				height = width;
			}





			var updateGraph = function(error, json) {
				if (error) throw error;

				force
					.nodes(json.nodes)
					.links(json.links)
					.start();


				var link = GraphService.createLinks(json);
				var node = GraphService.createNode(json);


				force.on("tick", function() {
					/*
					link.attr("x1", function(d) { return d.source.x; })
						.attr("y1", function(d) { return d.source.y; })
						.attr("x2", function(d) { return d.target.x; })
						.attr("y2", function(d) { return d.target.y; });
					*/
					link.attr("d", function(d) {
						var dx = d.target.x - d.source.x,
							dy = d.target.y - d.source.y,
							dr = Math.sqrt(dx * dx + dy * dy) + 15;
						return "M" +
							d.source.x + "," +
							d.source.y + "A" +
							dr + "," + dr + " 0 0,1 " +
							(d.target.x )  + "," +
							(d.target.y );
					});

					node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				});
			}
			var svg = GraphService.createSvg(element, width, height);
			var force = GraphService.createForce(width,height);


			//d3.json(scope.personId, updateGraph);
			PersonService.getRelationshipsForPerson(scope.personId,function(data){
				updateGraph(null,data);
			},function(){
				alert('Error retrieving JSON for relationships');
			});

			scope.refresh = function(){
				svg.remove();
				svg = GraphService.createSvg(element, width, height);
				force = GraphService.createForce(width,height);
				//d3.json(scope.personId, updateGraph);
				PersonService.getRelationshipsForPerson(scope.personId,function(data){
					updateGraph(null,data);
				},function(){
					alert('Error retrieving JSON for relationships');
				});
				force.start();
			}

			d3.select(window).on('resize', function() {
				// update width
				width =  parseInt(d3.select(element[0]).style('width'), 10);

				if(width <= colMd){
					height = width*2;
				}
				else{
					height = width/2;
				}


				// reset x range
				svg.attr("viewBox", "0 0 " + width + " " + height );
				force.size([width, height]);
				force.start();
				// do the actual resize...
			});
		}
	}

}])