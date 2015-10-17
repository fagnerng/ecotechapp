exports.config = {
    capabilities: {
        browserName: 'chrome',
    },

    allScriptsTimeout: 20000,

    framework: 'jasmine',

    onPrepare: function() {

        // The require statement must be down here, since jasmine-reporters@1.0
        // expects jasmine to be in the global and protractor does not guarantee
        // this until inside the onPrepare function.
        require('jasmine-reporters');

        jasmine.getEnv().addReporter(
            new jasmine.JUnitXmlReporter('build/tests/', true, true, 'junit-')
        );
    },
};

