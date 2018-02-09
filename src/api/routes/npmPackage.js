var express = require('express');
var router = express.Router();
var request = require("request");

var fs = require('fs');
var path = require('path');

function getPackage(packageName, cb) {
    /*
    var registryUrl = 'https://registry.npmjs.org';
    var url = [registryUrl, packageName].join('/');

    request(url, function (error, response, body) {
      cb(error, response, body)
    });*/
    let jsonPath = path.join(__dirname, 'packages-data.json')

    let packages = require(jsonPath); // JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    let current = packages.rows[3];
    let data = {};
    data.name = current.key[1];
    data.readme = current.key[2];
    data.author = { name: 'china fooding' };
    //current必须有值
    cb(null, null, data);
}


router.get('/', function(req, res) {

    var packageName = req.query['npmPackage'] || ''
    getPackage(packageName, function(error, response, body) {

        if (error) {
            console.log("We’ve encountered an error: " + error);
        }
        res.json({ npmPackage: body })
    })

});

module.exports = router;
