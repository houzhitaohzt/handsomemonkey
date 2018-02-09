/*****
 * Desc:从后台读取数据
 * author:vince
 * Date:2016.11.12
 */
var express = require('express');
var router = express.Router();
//var request = require('request');
var fs = require('fs');
var path = require('path');

//同步
function getUsers(keyword) {
    var jsonPath = path.join(__dirname, 'user-data.json')
    let users = fs.readFileSync(jsonPath, 'utf-8');
    //不过滤
    return users;
}

//console.log(JSON.stringify(getUsers()));


router.get('/', function(req, res) {
    var keyword = req.query['keyword'] || '';
    var user = getUsers(keyword);
    /*
    var user = [
        { "id": 1, "name": "tom", "sex": "male", "age": 20 },
        { "id": 2, "name": "jery", "sex": "male", "age": 20 },
        { "id": 3, "name": "tony", "sex": "male", "age": 20 },
        { "id": 4, "name": "snoopy", "sex": "male", "age": 20 },
        { "id": 5, "name": "jerry", "sex": "male", "age": 20 },
        { "id": 6, "name": "toy", "sex": "male", "age": 20 },
        { "id": 7, "name": "nemo", "sex": "male", "age": 20 }
    ];
    */
    res.json(user);
});

router.post('/post',function(request,res){
    let keyword='';
    let user=getUsers(keyword);

    res.json(user);
})

module.exports = router;

//module.exports = router;
