"use strict";
var app = angular.module('myGraphApp');

app.directive('personInfoCard',['$http',function($http){
	return {
		scope:{
			href:'@'
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

			var responsePromise = $http.get(scope.href);
			responsePromise.success(function(data, status, headers, config) {
				scope.name = data.name;
				scope.imageUrl = data.imageUrl;
				scope.labels = data.labels;
			});
			responsePromise.error(function(data, status, headers, config) {
				alert("AJAX failed!");
			});
		}
	}

}]);

app.directive('personTable',['$http',function($http){
	return {
		scope:{
			href:'@'
		},
		templateUrl:'partials/personTable.html',
		link:function(scope, element, attrs) {
			console.log(scope.href+":"+scope.href.length);

			if(scope.href  && 0 !== scope.href.length){
				scope.href = "ajax/"+scope.href+".json";
				var responsePromise = $http.get(scope.href);
				responsePromise.success(function(data, status, headers, config) {
					scope.data = data;
				});
				responsePromise.error(function(data, status, headers, config) {
					alert("AJAX failed!");
				});

				scope.$watch("href",function(newValue,oldValue) {
					console.log('Value changed!'+newValue);
				});
			}
			else{
				scope.isEmpty = true;
			}
		}
	}

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


app.directive('graphChart',['$compile','GraphService',function($compile, GraphService){
	return {
		scope:{
			href:'@'
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

			d3.json(scope.href, updateGraph);

			scope.refresh = function(){
				svg.remove();
				svg = GraphService.createSvg(element, width, height);
				force = GraphService.createForce(width,height);
				d3.json(scope.href, updateGraph);
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