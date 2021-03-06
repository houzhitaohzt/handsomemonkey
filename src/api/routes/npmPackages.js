var express = require('express');
var router = express.Router();
var request = require("request");

var fs = require('fs');
var path = require('path');

function getPackages(keyword, cb) {

    /*
    var registryUrl = 'https://registry.npmjs.org';
    var dlCountUrl = 'https://api.npmjs.org/downloads/point/last-week';
    var viewsPath = '-/_view';
    var keywordView = 'byKeyword';
    var query = 'startkey=["' + keyword + '"]'
    query += '&endkey=["' + keyword + '",{}]'
    query += '&group_level=3'

    var url = [registryUrl, viewsPath, keywordView].join('/') + '?' + query

    request(url, function(error, response, body) {
        cb(error, response, body)
    });
    */
    var jsonPath = path.join(__dirname, 'packages-data.json')
    let data = require(jsonPath); // fs.readFileSync(jsonPath, 'utf-8');
    //不过滤

    cb(null, null, data);
}


router.get('/', function(req, res) {

    var keyword = req.query['keyword'] || '';

    getPackages(keyword, function(error, response, body) {

        if (error) {
            console.log("We’ve encountered an error: " + error);
        }
        res.json({ npmPackages: body })
    })

});

module.exports = router;
