var express = require('express');
var app = express();
var http = require('http');
var _ = require('lodash');
var apiUrl = 'https://api.hasoffers.com/Apiv3/json?NetworkId=amazecell&Target=Report&Method=getConversions&NetworkToken=NETnrEYg3AY7fEjr2tHgVzUgkv2p2Z&fields%5B%5D=Stat.advertiser_id&fields%5B%5D=Stat.affiliate_id&fields%5B%5D=Stat.offer_id&fields%5B%5D=Stat.ad_id&fields%5B%5D=Stat.session_ip&fields%5B%5D=Stat.country_code&fields%5B%5D=Stat.session_datetime&groups%5B%5D=Stat.advertiser_id&groups%5B%5D=Stat.affiliate_id&groups%5B%5D=Stat.offer_id&groups%5B%5D=Stat.country_code&data_start=YYYY-MM-DD&data_end=YYYY-MM-DD';

var options = {
    host: 'www.pwm.co.il',
    path: '/node/data.json'
    //path: '/Apiv3/json?NetworkId=amazecell&Target=Report&Method=getConversions&NetworkToken=NETnrEYg3AY7fEjr2tHgVzUgkv2p2Z&fields%5B%5D=Stat.advertiser_id&fields%5B%5D=Stat.affiliate_id&fields%5B%5D=Stat.offer_id&fields%5B%5D=Stat.ad_id&fields%5B%5D=Stat.session_ip&fields%5B%5D=Stat.country_code&fields%5B%5D=Stat.session_datetime&groups%5B%5D=Stat.advertiser_id&groups%5B%5D=Stat.affiliate_id&groups%5B%5D=Stat.offer_id&groups%5B%5D=Stat.country_code&data_start=2016-03-01&data_end=2016-03-03'
};
var body = '';
var req = http.get(options, function(res) {

    // Buffer the body entirely for processing as a whole.
    res.setEncoding('utf8');

    res.on('data', function(chunk) {
        // You can process streamed parts here...
        body += chunk;
    }).on('end', function() {
        body = JSON.parse(body);
        checkSessionIp(body);
    })
});

var checkSessionIp = function(data){
    var sessionIpArr = [];
    for(var i = 0; i < data.response.data.data.length;i++){
        sessionIpArr.push({session_ip:data.response.data.data[i].Stat.session_ip,ad_id:data.response.data.data[i].Stat.ad_id});
    }
    console.log(sessionIpArr);
};

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
