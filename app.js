var express = require('express');
var app = express();
var request = require('request');
var _ = require('lodash');
var nodemailer = require('nodemailer');
var moment = require('moment');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://fraud:q1w2e3e3@ds025399.mlab.com:25399/fraud_detector');
var Schema = mongoose.Schema;

var options = {
    host: 'www.pwm.co.il',
    path: '/node/data.json'
    //path: '/Apiv3/json?NetworkId=amazecell&Target=Report&Method=getConversions&NetworkToken=NETnrEYg3AY7fEjr2tHgVzUgkv2p2Z&fields%5B%5D=Stat.advertiser_id&fields%5B%5D=Stat.affiliate_id&fields%5B%5D=Stat.offer_id&fields%5B%5D=Stat.ad_id&fields%5B%5D=Stat.session_ip&fields%5B%5D=Stat.country_code&fields%5B%5D=Stat.session_datetime&groups%5B%5D=Stat.advertiser_id&groups%5B%5D=Stat.affiliate_id&groups%5B%5D=Stat.offer_id&groups%5B%5D=Stat.country_code&data_start=2016-03-01&data_end=2016-03-03'
};
var bodyData;


var BearSchema   = new Schema({
    name: String,
    title: String,
    body: String,
    update: Boolean,
    number: Number
});

var Bear = mongoose.model('Bear', BearSchema);

request.get('http://www.pwm.co.il/node/data.json', (error, response, body)=> {
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

var sendMailController = ()=>{
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
};

var todo = new Bear({
    name: "orel",
    title: "CEO",
    body: "{value:[{bla:bla},{da:da}]}",
    update: true,
    number: 15
});

todo.save((err)=>{
    if(err)
        console.log(err);
    else
        console.log(todo);
});

app.get('/bear', function (req, res) {
    mongoose.model('Bear').find((err, bear)=>{
        res.send(bear);
    })
});

app.get('/', function (req, res) {
    res.send(req + '' + '' + res);
});

app.listen(3000, ()=> {
    console.log('Example app listening on port 3000!');
});
