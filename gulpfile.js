'use strict';

var gulp = require('gulp');
var ghelp = require('gulp-showhelp');
var plugins = require('gulp-load-plugins')({
    lazy: true,
});
var del = require('del');
var path = require('path');
var yargs = require('yargs');
var express = require('express');
var stylish = require('jshint-stylish');
var streamqueue = require('streamqueue');
var runSequence = require('run-sequence');

/**
 * Parse arguments
 */
var args = yargs
    .boolean('release')
    .boolean('emulate')
    .alias('e', 'emulate')
    .boolean('run')
    .alias('r', 'run')
    .boolean('serve')
    .alias('s', 'serve')
    .boolean('live')
    .alias('l', 'live')
    .default('platform', 'android')
    .alias('p', 'platform')
    .boolean('proxy')
    .alias('x', 'proxy')
    .boolean('lab')
    .alias('b')
    .argv;

var config = {
    dist: 'www/',
    port: 8100,

    app: {
        src: 'app/',
        name: 'EcotechApp',
        concatName: 'app.js',
    },

    scss: {
        main: 'app/assets/scss/main.scss',
        src: ['app/components/**/*.scss', 'app/shared/**/*.scss'],

        concatName: 'main.css',
        dist: 'assets/css/',
    },

    templates: {
        src: ['components/**/*.html', 'shared/**/*.html'],
        concatName: 'templates.js',
        dist: 'app/',
    },

    js: {
        src: [
            'app.module.js',
            'app.config.js',
            '**/*.module.js',
            '**/*.config.js',
            '**/*.js',
            '!**/*.spec.js',
        ],
    },

    fonts: {
        src: ['app/assets/fonts/*.*', 'bower_components/ionic/release/fonts/*.*'],
        dist: 'assets/fonts/',
    },

    iconfont: {
        src: 'app/assets/icons/*.svg',
        name: 'sppicons',
        template: 'app/assets/icons/iconfont.template',
        targetPath: '../css/spp-icons.css',
        fontPath: '../fonts/',
        dist: 'assets/fonts/',
    },

    images: {
        src: 'app/assets/images/**/*.*',
        dist: 'assets/images/',
    },

    vendors: {
        concatName: 'vendor.js',
        configFile: './vendor.json',
        debugDist: 'vendor/',
    },
};

// Downloads the selenium webdriver
gulp.task('webdriver_update', plugins.protractor.webdriver_update);

// Setting up the test task
gulp.task('protractor', function() {
    gulp.src('**/*.spec.js', {cwd: config.app.src})
        .pipe(plugins.protractor.protractor({
            configFile: 'protractor.config.js',
        }));
});

gulp.task('express:serve', function() {
    express()
        .use(express.static(config.dist))
        .listen(config.port);
});

// Run server and test task
gulp.task('test', function(done) {
    runSequence(
        'build',
        'express:serve',
        'webdriver_update',
        'protractor',
        done);

}).helper = 'Build everything and run tests';

gulp.task('build:clean', function(done) {
    del([
        config.dist + '/**/*',
        '!' + config.dist + '/.gitkeep',
    ], done);

}).helper = 'Delete dist folder';

gulp.task('build:scss', function() {

    return gulp.src(config.scss.main)
        .pipe(plugins.inject(gulp.src(config.scss.src), {
            read: false,
            starttag: '//- inject:{{ext}}',
            endtag: '//- endinject',
            transform: function(filepath) {
                return '@import "' + filepath + '";';
            },
            addRootSlash: false,
        }))
        .pipe(plugins.sass({
            style: args.release ? 'compressed' : 'expanded',
        }).on('error', function(err) {
            plugins.util.beep();
            plugins.util.log('sass', err.message);
            this.emit('end');
        }))
        .pipe(plugins.plumber({
            inherit: true,
        }))
        .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
        .pipe(plugins.concat(config.scss.concatName))
        .pipe(plugins.if(args.release, plugins.stripCssComments()))
        .pipe(plugins.if(args.release && !args.emulate, plugins.rev()))
        .pipe(gulp.dest(path.join(config.dist, config.scss.dist)));

});

gulp.task('build:templates', function() {
    // prepare angular template cache from html templates
    // (remember to change appName var to desired module name)
    return gulp.src(config.templates.src, {cwd: config.app.src})
        .pipe(plugins.angularTemplatecache(config.templates.concatName, {
            module: config.app.name,
        }))
        .pipe(gulp.dest(config.dist + config.templates.dist));
});

gulp.task('build:js:release', function() {

    var minifyConfig = {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeComments: true,
    };

    var filterTemplate = plugins.filter('!template.js');

    // prepare angular template cache from html templates
    // (remember to change appName var to desired module name)
    var templateStream = gulp
        .src(config.templates.src, {cwd: config.app.src})
        .pipe(plugins.angularTemplatecache(config.templates.concatName, {
            module: config.app.name,
            htmlmin: args.release && minifyConfig,
        }));

    var scriptStream = gulp.src(config.js.src, {cwd: config.app.src});

    return streamqueue({objectMode: true}, scriptStream, templateStream)
        .pipe(plugins.plumber())
        .pipe(filterTemplate)
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter(stylish))
        .pipe(filterTemplate.restore())
        .pipe(plugins.replace(/(\/\/ gulp-inject-debug-mode)/g, 'DEBUG_MODE = false;'))
        .pipe(plugins.if(args.proxy, plugins.replace(/(\/\/ gulp-inject-proxy-mode)/g, 'PROXY_MODE = true;')))
        .pipe(plugins.babel())
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.stripDebug())
        .pipe(plugins.concat(config.app.concatName))
        .pipe(plugins.uglify())
        .pipe(plugins.if(!args.emulate, plugins.rev()))
        .pipe(gulp.dest(config.dist));

}).help = {
    '': 'Build templatecache & compile javascript sources.',
    '[--release]': 'Dont add sourcemaps, Strip logs from javascript, set DEBUG_MODE to false.',
    '[--proxy|-x]': 'Set PROXY_MODE to true.',
};

gulp.task('build:fonts', function() {
    return gulp.src(config.fonts.src)
        .pipe(plugins.plumber())
        .pipe(gulp.dest(config.dist + config.fonts.dist));
});

gulp.task('build:iconfont', function() {
    return gulp.src(config.iconfont.src, { buffer: false })
        .pipe(plugins.plumber())
        .pipe(plugins.iconfontCss({
            fontName: config.iconfont.name,
            path: config.iconfont.template,
            targetPath: config.iconfont.targetPath,
            fontPath: config.iconfont.fontPath,
        }))
        .pipe(plugins.iconfont({
            fontName: config.iconfont.name,
            normalize: true,
        }))
        .pipe(gulp.dest(config.dist + config.iconfont.dist));
});

gulp.task('build:images', function() {
    return gulp.src(config.images.src)
        .pipe(plugins.plumber())
        .pipe(gulp.dest(config.dist + config.images.dist));
});

gulp.task('build:vendor', function() {
    var vendorFiles = require(config.vendors.configFile);

    if (args.release) {
        return gulp.src(vendorFiles)
            .pipe(plugins.plumber())
            .pipe(plugins.concat(config.vendors.concatName))
            .pipe(plugins.uglify())
            .pipe(plugins.rev())
            .pipe(gulp.dest(config.dist));

    } else {
        return gulp.src(vendorFiles)
            .pipe(plugins.plumber())
            .pipe(gulp.dest(config.dist + config.vendors.debugDist));
    }
});

gulp.task('build:inject', function() {

    // build has a '-versionnumber' suffix
    var cssNaming = 'assets/css/*.css';

    // injects 'src' into index.html at position 'tag'
    var _inject = function(src, tag) {
        return plugins.inject(src, {
            starttag: '<!-- inject:' + tag + ':{{ext}} -->',
            read: false,
            addRootSlash: false,
        });
    };

    if (args.release) {
        return gulp.src('app/index.html')
            .pipe(plugins.plumber())

            // inject css
            .pipe(_inject(gulp.src(cssNaming, {cwd: config.dist}), 'app-styles'))

            // inject vendors
            .pipe(_inject(gulp.src('vendor*.js', {cwd: config.dist}), 'vendor'))

            // inject app.js
            .pipe(_inject(gulp.src('app*.js', {cwd: config.dist}), 'app'))

            // inject cordova.js
            .pipe(plugins.if(!args.live && !args.serve, plugins.injectString.after(
                '<!-- inject:cordova:js -->',
                '\n<script type="text/javascript" src="cordova.js"></script>')))

            .pipe(gulp.dest(config.dist));
    } else {
        var vendorFiles = require('./vendor.json');

        var vendorsBasename = vendorFiles.map(function(vendor) {
            return 'vendor/' + path.basename(vendor);
        });

        var scriptFiles = config.js.src.map(function(file) {
            return 'app/' + file;
        });

        var scriptStream = gulp.src(scriptFiles.concat(config.templates.dist + config.templates.concatName),
            {cwd: 'www'});

        return gulp.src('app/index.html')
            .pipe(plugins.plumber())

            // inject css
            .pipe(_inject(gulp.src(cssNaming, {cwd: config.dist}), 'app-styles'))

            // inject vendors
            .pipe(_inject(gulp.src(vendorsBasename, {cwd: config.dist}), 'vendor'))

            // inject app.js
            .pipe(_inject(scriptStream, 'app'))

            // inject cordova.js
            .pipe(plugins.if(!args.live && !args.serve, plugins.injectString.after(
                    '<!-- inject:cordova:js -->',
                    '\n<script type="text/javascript" src="cordova.js"></script>')))
            .pipe(gulp.dest(config.dist));
    }
});

gulp.task('ionic:emulate', plugins.shell.task([
    'ionic emulate ' + args.platform + ' ' + (args.live ? '--livereload --consolelogs --serverlogs' : ''),
]));

gulp.task('ionic:run', plugins.shell.task([
    'ionic run ' +
    args.platform +
    (args.live ? ' --livereload --consolelogs --serverlogs' : '') +
    (args.proxy ? '' : ' --noproxy'),
]));

gulp.task('ionic:serve', plugins.shell.task([
    'ionic serve' +
    (args.lab ? ' --lab' : '') +
    (args.proxy ? '' : ' --noproxy'),
]));

gulp.task('lint:jscs', function() {
    return gulp.src(config.js.src, {cwd: config.app.src})
        .pipe(plugins.jscs())
        .on('error', function() {})
        .pipe(plugins.jscsStylish())
        .pipe(plugins.jscsStylish.combineWithHintResults())
        .pipe(plugins.jshint.reporter('gulp-checkstyle-jenkins-reporter', {
            filename: 'build/reports/jscs/jscs-checkstyle.xml',
            level: 'ewi',
        }));
});

gulp.task('lint:jshint', function() {
    return gulp.src(config.js.src, {cwd: config.app.src})
        .pipe(plugins.plumber())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
        //.pipe(plugins.jshint.reporter('gulp-checkstyle-jenkins-reporter', {
        //    filename: 'build/reports/jshint-checkstyle.xml',
        //    level: 'ewi',
        //}));
});

gulp.task('docs', function() {
    var command = [
        'jsdoc',
        '--configure node_modules/angular-jsdoc/conf.json',   // config file
        '--template node_modules/angular-jsdoc/template',     // template file
        '--destination build/docs/',                          // output directory
        '--recurse app/',                                     // source code directory
        '--package ./package.json',                           // package.json file
        '--readme ./README.md',                               // to include README.md as index contents
    ].join(' ');

    return gulp.src('')
        .pipe(plugins.plumber())
        .pipe(plugins.shell(command));
}).help = 'Gerar documentação da aplicação.';

gulp.task('build:js:debug', function() {
    return gulp.src(config.js.src, {cwd: config.app.src})
        .pipe(plugins.plumber())
        .pipe(plugins.changed(config.dist + config.app.src))
        .pipe(plugins.if(args.proxy, plugins.replace(/(\/\/ gulp-inject-proxy-mode)/g, 'PROXY_MODE = true;')))
        .pipe(plugins.babel())
        .pipe(plugins.ngAnnotate())
        .pipe(gulp.dest(config.dist + config.app.src));
});

gulp.task('debug:watchers', function() {
    gulp.watch(config.app.src + '**/*.scss', ['build:scss']);
    gulp.watch(config.app.src + 'assets/fonts/**', ['build:fonts']);
    gulp.watch(config.app.src + 'assets/icons/*.svg', ['build:iconfont']);
    gulp.watch(config.app.src + 'assets/images/**', ['build:images']);
    gulp.watch(config.app.src + '**/*.js', ['build:js:debug', 'lint:jshint', 'lint:jscs']);
    gulp.watch('./vendor.json', ['build:vendor']);
    gulp.watch([config.app.src + '**/*.html',
        '!' + config.app.src + '/index.html',
    ], plugins.if(args.release, ['build:js:release'], ['build:templates']));
    gulp.watch(config.app.src + 'index.html', ['build:inject']);
});

gulp.task('debug:js&template', ['build:js:debug', 'build:templates'], function() {});

gulp.task('build', function(done) {
    runSequence(
        'build:clean',
        'build:iconfont',
        'build:fonts',
        'build:scss',
        'build:images',
        'build:vendor',
        plugins.if(args.release, 'build:js:release', 'debug:js&template'),
        'lint:jshint',
        'lint:jscs',
        'build:inject',
        done);
}).help = {
    '': 'Executa toda a série de tarefas para compilar o código, sass, html, etc.',
    '[ --release ]': 'Compila o projeto para release e desativa o DEBUG_MODE.',
    '[ --proxy | -x ]': 'Seta PROXY_MODE para verdadeiro.',
};

gulp.task('debug', ['build'], function() {

    if (args.emulate) {
        gulp.start('ionic:emulate');
    } else if (args.run) {
        gulp.start('ionic:run');
    } else if (args.serve) {
        gulp.start('ionic:serve');
    }

    gulp.start('debug:watchers');

}).help = {
    '': 'Executa a tarefa build e em seguida inicia watchers para compilar o código quando os arquivos forem alterados. Assim o desenvolvedor pode deixar esse processo executando enquando desenvolve a aplicação.',
    '[ --emulate | -e ]': 'Executa a aplicação no emulador.',
    '[ --run | -r ]': 'Executa a aplicação no celular.',
    '[ --platform=PLATFORM | -p=PLATFORM ]': 'Seleciona a plataforma desejada (ios, android). android é a plataforma padrão.',
    '[ --live | -l ]': 'Adiciona livereload a aplicação, assim, qualquer alteração no código, será refletida na aplicação automaticamente.',
    '[ --serve | -s ]': 'Inicia servidor para debugar a aplicação no browser.',
    '[ --lab | -b ]': 'Adiciona modo lab em ionic:serve (mostrar ios e android no browser).',
    '[ --release ]': 'Compila o projeto para release e desativa o DEBUG_MODE.',
    '[ --proxy | -x ]': 'Seta PROXY_MODE para verdadeiro.',
};

gulp.task('install', ['build'], function() {
    return gulp.src('')
        .pipe(plugins.shell(['ionic run ' + args.platform]));
}).help = {
    '': 'Executa a tarefa build e em seguida instala a aplicação no celular.',
    '[ --platform=PLATFORM | -p=PLATFORM ]': 'Seleciona a plataforma desejada (ios, android). android é a plataforma padrão.',
    '[ --release ]': 'Compila o projeto para release e desativa o DEBUG_MODE.',
    '[ --proxy | -x ]': 'Seta PROXY_MODE para verdadeiro.',
};

gulp.task('package', ['build'], function() {
    return gulp.src('')
        .pipe(plugins.shell(['ionic build ' + args.platform]));
});

gulp.task('help', function() {
    var task = ghelp.getArgv('task', 't');

    if (task != null) {
        ghelp.show(task);
    } else {
        ghelp.show('build', '', 'debug', '', 'install', '', 'build:scss', 'build:js', '', 'help');
    }
}).help = {
    '': 'Mostra esse guia.',
    '[ --task=task | -t=task ]': 'Mostra o guia especifico de uma tarefa.',
};

gulp.task('default', function() {
    gulp.start('help');
});
