var app = angular.module('myGraphApp',['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
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
			templateUrl: "partials/state1.list.html",
			controller: function($scope) {
				$scope.items = ["A", "List", "Of", "Items"];
			}
		})
		.state('state2', {
			url: "/state2",
			templateUrl: "partials/state2.html"
		})
		.state('state2.list', {
			url: "/list",
			templateUrl: "partials/state2.list.html",
			controller: function($scope) {
				$scope.things = ["A", "Set", "Of", "Things"];
			}
		})
});

app.directive('personInfoCard',['$http',function($http){
	return {
		scope:{
			href:'@'
		},
		templateUrl:'templates/personInfoCard.html',
		link:function(scope, element, attrs) {
			scope.getLabel = function(type){
				console.log(type);
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

app.directive('graphChart',['$compile',function($compile){
	return {
		replace: true,
		transclude: true,
		scope:{
			href:'@'
		},
		controller:'GraphController',
		template:'<div id="{{id}}"></div>',
		link:function(scope, element, attrs) {
			var colMd = 700;
			
			var color = d3.scale.category20();

			var width =  parseInt(d3.select(element[0]).style('width'), 10);
			var	height;
			
			
			if(width <= colMd){				
				height = width*2;
			}
			else{
				height = width/2;
			}

			
			var svg = d3.select(element[0]).append("svg")
				.attr("viewBox", "0 0 " + width + " " + height );
				//.attr("width", width)
				//.attr("height", height);
				
			
				/*
			var defs = svg.append("defs");

			// create filter with id #drop-shadow
			// height=130% so that the shadow is not clipped
			var filter = defs.append("filter")
				.attr("id", "drop-shadow")
				.attr("height", "130%");
			// SourceAlpha refers to opacity of graphic that this filter will be applied to
			// convolve that with a Gaussian with standard deviation 3 and store result
			// in blur
			filter.append("feGaussianBlur")
				.attr("in", "SourceAlpha")
				.attr("stdDeviation", 5)
				.attr("result", "blur");

			// translate output of Gaussian blur to the right and downwards with 2px
			// store result in offsetBlur
			filter.append("feOffset")
				.attr("in", "blur")
				.attr("dx", 5)
				.attr("dy", 5)
				.attr("result", "offsetBlur");
				
			var feMerge = filter.append("feMerge");

			feMerge.append("feMergeNode")
				.attr("in", "offsetBlur")
			feMerge.append("feMergeNode")
				.attr("in", "SourceGraphic");
*/
			var force = d3.layout.force()
				.gravity(0.05)
				.distance(100)
				.charge(-100)
				//.friction(0.5)
				.chargeDistance(800)
				.size([width, height]);				
				
			d3.json(scope.href, function(error, json) {
			  if (error) throw error;

			  force
				  .nodes(json.nodes)
				  .links(json.links)
				  .start();
				  
			  var tooltip = d3.select("body")
				.append("div")
				.style("position", "absolute")
				.style("z-index", "10")
				.style("visibility", "hidden");

			  var link = svg.selectAll(".link")
				  .data(json.links)
				  .enter().append("line")
				  .attr("class", "link")
				  .attr("title", "Sample")
				  .style("stroke-width", function(d) { return Math.sqrt(d.value); })
				  /*
				  .on("mousemove", function(){
						console.log(d3.select(this));
						d3.select(this).style("filter", "url(#drop-shadow)");
						 var m = d3.mouse(this);
						 //d3.select("#myPath").select("title").text(m[1]);
					})
				  .on("mouseout", function(){
					d3.select(this).style("filter", "");
				  })*/
				.on("mouseover", function(d){return tooltip.style("visibility", "visible").html( '<div class="well">'+d.text+'</div>'); })
				.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
				.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
				  .style("stroke", function(d) { return color(d.value); });
				  
				
			  var node = svg.selectAll(".node")
				  .data(json.nodes)
				.enter().append("g")
				  .attr("class", "node")
				  .call(force.drag);
				  
				
				  
				 node.on("mouseover", function(d){
					//scope.msg = 'Superhero';
					var resultElement = tooltip.style("visibility", "visible");
					
					scope.$apply(function() {
						var card = '<person-info-card href="'+d.thumbUrl+'"></person-info-card>';
						resultElement.html(card);
						$compile(resultElement[0])(scope)
					});
					
					return resultElement; 	
				})
				.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
				.on("mouseout", function(){return tooltip.style("visibility", "hidden");}) 
				.on("click", function(d){
					//scope.msg = 'Superhero';
					var card = angular.element('<person-info-card>x</person-info-card>');
					$compile(card)(scope);
					return tooltip.style("visibility", "visible").html( card.html()); 	
				})
				
				  
				node.append("circle")
				  .style("fill", function(d) { return color(d.group); })
				  .attr("class", "node glyphicon glyphicon-user")
				  .attr("x", -20)
				  .attr("y", -20)
				  .attr("r", 13)
				 /* 
			  node.append("image")
				  .attr("xlink:href", "https://github.com/favicon.ico")
				  .attr("x", -8)
				  .attr("y", -8)
				  .attr("width", 16)
				  .attr("height", 16);
				*/
			  node.append("text")
				  .attr("class", "text-node")
				  .attr("dx", 12)
				  .attr("dy", ".35em")
				  
				  
				  .append("a")
				  .attr("target", "_blank")
				  .attr("xlink:href", function (d) {
					return d.href;
				 })
				 .text(function(d) { return d.name })
				  ;
				 

			  force.on("tick", function() {
				link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
			  });
			});
			
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

app.controller('GraphController', ['$scope', function($scope) {
	$scope.getRandom = function(){
		return Math.floor((Math.random()*6)+1);
	}
	$scope.id = 'graph-' +$scope.getRandom();
   
  }]);