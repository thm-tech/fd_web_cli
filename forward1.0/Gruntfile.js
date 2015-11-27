// Generated on 2015-04-08 using generator-angular-require 0.4.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/**/**/{,*/}*.js'],
//        files : ['*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
//        files: ['*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/**/**/{,*/}*.html',
//          '*.html',          
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 8989,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '115.28.143.67',
        livereload: 32563
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/**/**/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },



    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/app/styles/{,*/}*.css',
//          '<%= yeoman.dist %>/app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/app/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      css: '<%= yeoman.app %>/styles/{,*/}*.css',
      options: {
        dest: '<%= yeoman.dist %>/app'
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/app/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/app/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>/app',
          '<%= yeoman.dist %>/app/images',
          '<%= yeoman.dist %>/app/styles'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/app/styles/common.min.css':[
          	'<%= yeoman.app %>/styles/common.css'
          ],
          '<%= yeoman.dist %>/app/styles/customer/cmmain.min.css':[
          	'<%= yeoman.dist %>/app/styles/customer/cmmain.css'
          ],
          '<%= yeoman.dist %>/app/styles/merchant/mtmain.min.css':[
          	'<%= yeoman.dist %>/app/styles/merchant/mtmain.css'
          ]
        }
      }
    },
    
    uglify: {
    	 options:{
    	 	/*
    	 		compress: {
    	 				drop_console: true	
    	 		},*/
    	 		preserveComments: false	
    	 },
       dist: {
         files: [
         					{
                    expand:true,
                    cwd:'<%= yeoman.app %>/views',//viewsĿ¼??
                    src:'**/*.js',//????js?ļ?
                    dest: '<%= yeoman.dist %>/app/views'//???�?Ŀ¼??
                	},
                	{
                		expand:true,
                		cwd:'<%= yeoman.app %>/scripts',
                		src:'**/*.js',
                		dest: '<%= yeoman.dist %>/app/scripts'	
                	}
                ]
         }
       },
     concat: {
       dist: {
       		files:{
       			'<%= yeoman.dist %>/app/styles/customer/cmmain.css':[
       				'<%= yeoman.app %>/styles/customer/*.css'
       			],
       			'<%= yeoman.dist %>/app/styles/merchant/mtmain.css':[
       				'<%= yeoman.app %>/styles/merchant/*.css'
       			]	
       		}	
       }
     },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          // cwd: '<%= yeoman.app %>/scripts',
          src: ['<%= yeoman.app %>/scripts/**/*.js'],
          dest: '.tmp'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>/app',
          src: [
            '*.{ico,png,txt}',
//            '.htaccess',
            '*.html',
            'views/**/*.html',
            'images/*',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.',
          dest: '<%= yeoman.dist %>',
          src: ['bower_components/**/*']
        }, /*{
          expand: true,
          cwd: '.',
          dest: '<%= yeoman.dist %>',
          src: ['bower_components/requirejs/*']
        },*/ {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/app/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>/app'
        }, {
          expand: true,
          cwd: 'bower_components/font-awesome-less',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>/app'
        }, {
        	expand: true,
        	cwd: '<%= yeoman.app %>',
        	dest: '<%= yeoman.dist %>/app/',
        	src: 'rewebconfig.json',
        	rename: function(dest,src) {
        		return dest + src.replace('rewebconfig','webconfig');
        	}
        }, {
        	expand: true,
        	cwd: 'bower_components/angular-emoji-filter/dist',
        	dest: '<%= yeoman.dist %>/app/styles/',
        	src: 'emoji.png'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles'
//        'imagemin',
//        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    // Settings for grunt-bower-requirejs
    bower: {
      app: {
        rjsConfig: '<%= yeoman.app %>/scripts/main.js',
        options: {
          exclude: ['requirejs', 'json3', 'es5-shim']
        }
      }
    },

    replace: {
      test: {
        src: '<%= yeoman.app %>/../test/test-main.js',
        overwrite: true,
        replacements: [{
          from: /paths: {[^}]+}/,
          to: function() {
            return require('fs').readFileSync(grunt.template.process('<%= yeoman.app %>') + '/scripts/main.js').toString().match(/paths: {[^}]+}/);
          }
        }]
      }
    },

    // r.js compile config
    requirejs: {
      dist: {
        options: {
          dir: '<%= yeoman.dist %>/scripts/',
          modules: [{
            name: 'main'
          }],
          preserveLicenseComments: false, // remove all comments
          removeCombined: true,
          baseUrl: '.tmp/<%= yeoman.app %>/scripts',
          mainConfigFile: '.tmp/<%= yeoman.app %>/scripts/main.js',
          optimize: 'uglify2',
          uglify2: {
            mangle: false
          }
        }
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'bower:app',
    'replace:test',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
//    'bower:app',
    'replace:test',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
//    'cdnify',
    'cssmin',
    // Below task commented out as r.js (via grunt-contrib-requirejs) will take care of this
     'uglify',
    'filerev',
    'usemin',
//    'requirejs:dist',
//    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
