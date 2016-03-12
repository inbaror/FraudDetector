var express = require('express');
var app = express();
var http = require('http');
var request = require('request');
var _ = require('lodash');
var nodemailer = require('nodemailer');
var moment = require('moment');
var apiUrl = 'https://api.hasoffers.com/Apiv3/json?NetworkId=amazecell&Target=Report&Method=getConversions&NetworkToken=NETnrEYg3AY7fEjr2tHgVzUgkv2p2Z&fields%5B%5D=Stat.advertiser_id&fields%5B%5D=Stat.affiliate_id&fields%5B%5D=Stat.offer_id&fields%5B%5D=Stat.ad_id&fields%5B%5D=Stat.session_ip&fields%5B%5D=Stat.country_code&fields%5B%5D=Stat.session_datetime&groups%5B%5D=Stat.advertiser_id&groups%5B%5D=Stat.affiliate_id&groups%5B%5D=Stat.offer_id&groups%5B%5D=Stat.country_code&data_start=YYYY-MM-DD&data_end=YYYY-MM-DD';

var options = {
    host: 'www.pwm.co.il',
    path: '/node/data.json'
    //path: '/Apiv3/json?NetworkId=amazecell&Target=Report&Method=getConversions&NetworkToken=NETnrEYg3AY7fEjr2tHgVzUgkv2p2Z&fields%5B%5D=Stat.advertiser_id&fields%5B%5D=Stat.affiliate_id&fields%5B%5D=Stat.offer_id&fields%5B%5D=Stat.ad_id&fields%5B%5D=Stat.session_ip&fields%5B%5D=Stat.country_code&fields%5B%5D=Stat.session_datetime&groups%5B%5D=Stat.advertiser_id&groups%5B%5D=Stat.affiliate_id&groups%5B%5D=Stat.offer_id&groups%5B%5D=Stat.country_code&data_start=2016-03-01&data_end=2016-03-03'
};
var bodyData;
request.get('http://www.pwm.co.il/node/data.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        bodyData = JSON.parse(body);
        checkSessionIp(bodyData);
    }
});

var checkSessionIp = function(data){
    var sessionIpArr = [];
    for(var i = 0; i < data.response.data.data.length;i++){
        sessionIpArr.push(data.response.data.data[i].Stat.session_ip);
    }
    console.log(sessionIpArr);
    checkIfIpExist(sessionIpArr);
};

var checkIfIpExist = function (data) {
    var sortedData = _.countBy( data );
    console.log(sortedData);
    adFullDetails(sortedData);
};

var adFullDetails = function(data){
    var ipList = [];
    _.forOwn(data, function(value, key) {
        if(value > 3){
            ipList.push(key)
        }
    });
    console.log(ipList);
    createMatchIpObj(ipList);
};

var createMatchIpObj = function(data){
    _.findKey(bodyData, function(o) {
        return o.age < 40;
    });
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service:'Gmail',
    auth: {
        user:'frauddetectorapp@gmail.com',
        pass:'ioherfij1234'
    }
});
var htmlEmail = '<div style="color:red;font-size:22px">Hello World this is the end of you</div>';
// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Fraud Sevice 👥" <orel@pwm.co.il>', // sender address
    to: 'orel.ohayon@hibob.io', // list of receivers
    subject: 'Fraud alert ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: htmlEmail // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/bla', function (req, res) {
    res.send(req + '' + '' + res);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
