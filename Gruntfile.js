	var jsVendor = [
                'bower_components/jquery/dist/jquery.js',
				'bower_components/bootstrap/dist/js/bootstrap.min.js',
				'bower_components/angular/angular.js',
				'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'bower_components/d3/d3.js',
				//'bower_components/angular-aria/angular-aria.js',
				'bower_components/angular-ui-router/release/angular-ui-router.js',
				//'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
	];	
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			build: {
				options: {
					style: 'expanded'
				},
				files: [{
					expand: true,
					cwd: 'sass/',
					src: ['**/*.scss'],
					dest: 'css/',
					ext: '.css'
				}]
			}
		},
		concat: {
		  vendor:{
				src : jsVendor,
                dest : 'js/vendor.js'
		  }
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass'],
				options: {
					interrupt: true,
					livereload: true
				}
			}
		},
		connect : {
			server : {
				options : {
					port : 9001,
					base : '.'
					//keepalive: true
					//livereload: true
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	
	grunt.registerTask('build',['sass','concat:vendor']);
	grunt.registerTask('default',['build']);
	grunt.registerTask('serve',['build','connect:server','watch']);
}