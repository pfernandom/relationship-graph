"use strict";
var app = angular.module('myGraphApp');

app.service('GraphService',['$rootScope','$compile',function($rootScope,$compile){
	return {
		svg:{},
		tooltip:{},
		color : d3.scale.category20(),
		createSvg: function(element, width, height){
			this.svg = d3.select(element[0]).append("svg")
				.attr("viewBox", "0 0 " + width + " " + height );
			return this.svg;
		},
		createForce: function(width, height){
			this.tooltip = this.createTooltip();
			this.force = d3.layout.force()
				.gravity(0.05)
				.distance(100)
				.charge(-100)
				//.friction(0.5)
				.chargeDistance(800)
				.size([width, height]);
			return this.force;
		},
		createTooltip : function(){
			this.tooltip =  d3.select("body")
				.append("div")
				.attr("class", "graph-tooltip");
			return this.tooltip;
		},

		createNode : function(json){
			var service = this;
			var tooltip = this.tooltip;
			var node = this.svg.selectAll(".node")
				.data(json.nodes)
				.enter().append("g")
				.attr("class", "node");


			node.append("circle")
				.style("fill", function(d) { return service.color(d.group); })
				.attr("class", "node glyphicon glyphicon-user")
				//.attr("x", -20)
				//.attr("y", -20)
				.attr("r", "1em")

			.on("mouseover", function(d){
				var scope = $rootScope.$new();
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
				var scope = $rootScope.$new();
				var resultElement = tooltip.style("visibility", "visible");

				scope.$apply(function() {
					var card = '<person-info-card href="'+d.thumbUrl+'"></person-info-card>';
					resultElement.html(card);
					$compile(resultElement[0])(scope)
				});

				var drag = d3.behavior.drag()
					.on('dragstart', function() { resultElement.style('fill', 'red'); })
					.on('drag', function() { resultElement.style('cx', d3.event.x)
						.attr('cy', d3.event.y).style("top", ( d3.event.y-10)+"px").style("left",( d3.event.x+10)+"px"); })
					.on('dragend', function() { resultElement.style('fill', 'black'); });


				resultElement.call(drag)
				//$(resultElement[0]).modal({});
				return resultElement;
			})
				.call(service.force.drag)


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
				//.attr("target", "_blank")
				.attr("xlink:href", function (d) {
					return d.href;
				})
				.text(function(d) { return d.name })
			;
			return node;
		},
		createLinks: function(json){
			var tooltip = this.tooltip;
			var service = this;

			this.svg.append("svg:defs").selectAll("marker")
				.data(["end"])      // Different link/path types can be defined here
				.enter().append("svg:marker")    // This section adds in the arrows
				.attr("id", String)
				.attr("viewBox", "0 -5 10 10")
				.attr("refX", 25)
				.attr("refY", -1.5)
				.attr("markerWidth", 6)
				.attr("markerHeight", 6)
				.attr("orient", "auto")
				.append("svg:path")
				.attr("d", "M0,-5L10,0L0,5");

			var link = this.svg
				.append("svg:g")
				.selectAll("path")
				.data(json.links)
				.enter()
				.append("svg:path")
				//    .attr("class", function(d) { return "link " + d.type; })
				.attr("class", "link")
				.attr("marker-end", "url(#end)")
			.on("mouseover", function(d){
				var scope = $rootScope.$new();
				var resultElement = tooltip.style("visibility", "visible");

				scope.$apply(function() {
					var card = '<case-info-card href="'+d.href+'"></case-info-card>';
					resultElement.html(card);
					$compile(resultElement[0])(scope)
				});

				return resultElement;
			})
				.on("click", function(d){
					var scope = $rootScope.$new();
					var resultElement = tooltip.style("visibility", "visible");

					scope.$apply(function() {
						var card = '<case-info-card href="'+d.href+'"></case-info-card>';
						resultElement.html(card);
						$compile(resultElement[0])(scope)
					});
					var drag = d3.behavior.drag()
						.on('dragstart', function() { resultElement.style('fill', 'red'); })
						.on('drag', function() { resultElement.style('cx', d3.event.x)
							.attr('cy', d3.event.y).style("top", ( d3.event.y-10)+"px").style("left",( d3.event.x+10)+"px"); })
						.on('dragend', function() { resultElement.style('fill', 'black'); });


					resultElement.call(drag)
					return resultElement;
				})
				.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
				.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
				.style("stroke", function(d) { return service.color(d.value); });
			return link;
		},
		createNoDirectionLinks : function(json){
			var tooltip = this.tooltip;
			var service = this;
			var link = this.svg.selectAll(".link")
				.data(json.links)
				.enter().append("line")
				.attr("class", "link")
				.attr("title", "Sample")
				.style("stroke-width", function(d) { return 3 })
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
				.on("mouseover", function(d){
					var scope = $rootScope.$new();
					var resultElement = tooltip.style("visibility", "visible");

					scope.$apply(function() {
						var card = '<case-info-card href="'+d.href+'"></case-info-card>';
						resultElement.html(card);
						$compile(resultElement[0])(scope)
					});

					return resultElement;
				})
				.on("click", function(d){
					var scope = $rootScope.$new();
					var resultElement = tooltip.style("visibility", "visible");

					scope.$apply(function() {
						var card = '<case-info-card href="'+d.href+'"></case-info-card>';
						resultElement.html(card);
						$compile(resultElement[0])(scope)
					});
					var drag = d3.behavior.drag()
						.on('dragstart', function() { resultElement.style('fill', 'red'); })
						.on('drag', function() { resultElement.style('cx', d3.event.x)
							.attr('cy', d3.event.y).style("top", ( d3.event.y-10)+"px").style("left",( d3.event.x+10)+"px"); })
						.on('dragend', function() { resultElement.style('fill', 'black'); });


					resultElement.call(drag)
					return resultElement;
				})
				.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
				.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
				.style("stroke", function(d) { return service.color(d.value); });
			return link;
		}
	}

}]);