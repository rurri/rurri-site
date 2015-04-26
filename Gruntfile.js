'use strict';

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('web-component-tester');
  grunt.loadNpmTasks('grunt-aws-s3');

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true
      },
      default: {
        files: [
          '<%= yeoman.app %>/*.html',
          '<%= yeoman.app %>/elements/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/elements/{,*/}*.{css,js}',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint']
      },
      styles: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.css',
          '<%= yeoman.app %>/fonts/{,*/}*.ttf',
          '<%= yeoman.app %>/elements/{,*/}*.css'
        ],
        tasks: ['copy:styles', 'autoprefixer:server']
      },
      content: {
        files: ['content/**/*.md'],
        tasks: ['metalsmith', 'copy:content']
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      server: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: '**/*.css',
          dest: '.tmp'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['**/*.css', '!bower_components/**/*.css'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    browserSync: {
      options: {
        notify: false,
        port: 9000,
        open: true
      },
      app: {
        options: {
          watchTask: true,
          injectChanges: false, // can't inject Shadow DOM
          server: {
            baseDir: ['.tmp', '<%= yeoman.app %>'],
            routes: {
              '/bower_components': 'bower_components'
            }
          }
        },
        src: [
          '.tmp/**/*.{css,html,js}',
          '.tmp/content/**/*.{md,json}',
          '<%= yeoman.app %>/**/*.{css,html,js}'
        ]
      },
      dist: {
        options: {
          server: {
            baseDir: 'dist'
          }
        },
        src: [
          '<%= yeoman.dist %>/**/*.{css,html,js,md,json}',
          '<%= yeoman.dist %>/content/**/*.{md,json}',
          '!<%= yeoman.dist %>/bower_components/**/*'
        ]
      }
    },
    clean: {
      dist: ['.tmp', '<%= yeoman.dist %>/*'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [{
            match: /elements\/elements\.html/g,
            replacement: 'elements/elements.vulcanized.html'
          }]
        },
        files: {
          '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/index.html']
        }
      }
    },
    vulcanize: {
      default: {
        options: {
          strip: true,
          inline: true
        },
        files: {
          '<%= yeoman.dist %>/elements/elements.vulcanized.html': [
            '<%= yeoman.dist %>/elements/elements.html'
          ]
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,svg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      main: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '.tmp/concat/styles/{,*/}*.css'
          ]
        }
      },
      elements: {
        files: [{
          expand: true,
          cwd: '.tmp/elements',
          src: '{,*/}*.css',
          dest: '<%= yeoman.dist %>/elements'
        }]
      }
    },
    minifyHtml: {
      options: {
        quotes: true,
        empty: true,
        spare: true
      },
      app: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    /****
     * COPY
     * *****/
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            '*.html',
            'elements/**',
            '!elements/**/*.css',
            'images/{,*/}*.{webp,gif}',
            'fonts/**/*.ttf'
          ]
        }, {
          expand: true,
          dot: true,
          dest: '<%= yeoman.dist %>',
          src: ['bower_components/**']
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '.tmp',
          src: ['{fonts,styles,elements}/{,*/}*.{css,ttf}']
        }]
      },
      content: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          dest: '.tmp',
          src: ['content/**', 'fonts/**']
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          dest: '.tmp',
          src: ['images/**']
        }]
      }
    },
    'wct-test': {
      local: {
        options: {remote: false}
      },
      remote: {
        options: {remote: true}
      }
    },
    // See this tutorial if you'd like to run PageSpeed
    // against localhost: http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/
    pagespeed: {
      options: {
        // By default, we use the PageSpeed Insights
        // free (no API key) tier. You can use a Google
        // Developer API key if you have one. See
        // http://goo.gl/RkN0vE for info
        nokey: true
      },
      // Update `url` below to the public URL for your site
      mobile: {
        options: {
          url: "https://developers.google.com/web/fundamentals/",
          locale: "en_GB",
          strategy: "mobile",
          threshold: 80
        }
      }
    },


    curl: {
      'grab-avatar': {
        src: 'http://graph.facebook.com/v2.3/533081609/picture?redirect=true&width=150&height=150',
        dest: '<%= yeoman.dist %>/images/avatar.jpg'
      }
    },

    //

    metalsmith: {
      articles: {
        options: {
          metadata: {
            hello: 'world'
          },
          plugins: {

            "metalsmith-filepath": {
              "absolute": false,
              "permalinks": false
            },

            'metalsmith-collections' : {
              articles: {
                pattern: 'articles/*.md',
                sortBy: 'posted',
                reverse: true
              },
              last5articles: {
                pattern: 'articles/*.md',
                sortBy: 'posted',
                reverse: true,
                limit: 5
              }
            },


            'metalsmith-markdown' : {

            },

            "metalsmith-excerpts": {

            },

            'metalsmith-writemetadata' : {
              pattern: ['**/*.md', '**/*.html'],
              bufferencoding: 'utf8',
              ignorekeys: ['stats', 'mode'],

              collections: {
                articles: {
                  output: {
                    path: 'articles.json',
                    asObject: true,
                    metadata: {
                      "type": "list"
                    }
                  },
                  ignorekeys: ['contents', 'next', 'previous', 'collection', 'mode', 'stats']
                },
                last5articles: {
                  output: {
                    path: 'last5articles.json',
                    asObject: true,
                    metadata: {
                      "type": "list"
                    }
                  },
                  ignorekeys: ['collection', 'mode', 'stats']
                }
              }

            }
          }
        },
        src: 'content',
        dest: '<%= yeoman.dist %>/content'
      }
    },


    //S3

    aws_s3 : {
      dist: {
        options: {
          bucket : 'rurri.com',
          maxRetries : 3,
          uploadConcurrency : 10,
          downloadConcurrency : 10,
          copyConcurrency : 10,
          differential : true,
          displayChangesOnly : true,
          progress : 'progressBar',

        },
        files: [
          {expand: true, cwd: '<%= yeoman.dist %>', src: ['**'], dest: '/', action:'upload'},
          {cwd: '<%= yeoman.dist %>', src: ['**'], dest: '/', action:'delete'}
        ]
      }
    }


  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }

    grunt.task.run([
      'clean:server',
      'copy:styles',
      'curl',
      'copy:content',
      'metalsmith',
      'autoprefixer:server',
      'browserSync:app',
      'watch'
    ]);
  });

  
  grunt.registerTask('test:local', ['wct-test:local']);
  grunt.registerTask('test:remote', ['wct-test:remote']);

  grunt.registerTask('sandbox', ['copy:images']);

  grunt.registerTask('build', [
    'clean:dist',
    'curl',
    'copy',
    'metalsmith',
    'useminPrepare',
    'imagemin',
    'concat',
    'autoprefixer',
    'uglify',
    'cssmin',
    'vulcanize',
    'usemin',
    'replace',
    'minifyHtml'
  ]);

  grunt.registerTask('deploy', [
    'aws_s3:dist'
  ]);

  grunt.registerTask('default', [
    'jshint',
    // 'test'
    'build'
  ]);
};
