({
    appDir: "../js",
    baseUrl: "./better/",
    dir: "../../webapp-build",
    //Comment out the optimize line if you want
    //the code minified by UglifyJS
    optimize: "none",

    paths: {
        "jquery": "empty:" //exclude jQUery from build 
                                   // build will fail without that line
    },

    modules: [
        //Optimize the application files. jQuery is not 
        //included since it is already in require-jquery.js
        {
            name: "better"
        }
    ]
})
