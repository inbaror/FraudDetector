var express = require('express');
var app = express();
var request = require('request');
var _ = require('lodash');
var nodemailer = require('nodemailer');
var moment = require('moment');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://fraud:q1w2e3e3@ds025399.mlab.com:25399/fraud_detector');
var Schema = mongoose.Schema;

var currentDate = new Date();
currentDate = moment(currentDate).format('YYYY-MM-DD');
var conversionsReportUrl = `https://api.hasoffers.com/Apiv3/json?NetworkId=amazecell&Target=Report&Method=getConversions&NetworkToken=NETnrEYg3AY7fEjr2tHgVzUgkv2p2Z&fields%5B%5D=Stat.advertiser_id&fields%5B%5D=Stat.affiliate_id&fields%5B%5D=Stat.offer_id&fields%5B%5D=Stat.ad_id&fields%5B%5D=Stat.session_ip&fields%5B%5D=Stat.country_code&fields%5B%5D=Stat.session_datetime&groups%5B%5D=Stat.advertiser_id&groups%5B%5D=Stat.affiliate_id&groups%5B%5D=Stat.offer_id&groups%5B%5D=Stat.country_code&data_start=${currentDate}&data_end=${currentDate}`;
var statsReportUrl = `https://api.hasoffers.com/Apiv3/json?NetworkId=amazecell&Target=Report&Method=getStats&NetworkToken=NETnrEYg3AY7fEjr2tHgVzUgkv2p2Z&fields%5B%5D=Stat.affiliate_id&fields%5B%5D=Stat.advertiser_id&fields%5B%5D=Stat.offer_id&fields%5B%5D=Stat.country_code&fields%5B%5D=Stat.gross_ctr&fields%5B%5D=Stat.unique_ctr&groups%5B%5D=Stat.affiliate_id&groups%5B%5D=Stat.advertiser_id&groups%5B%5D=Stat.offer_id&groups%5B%5D=Stat.country_code&data_start=${currentDate}&data_end=${currentDate}`;

// var options = {
//     host: 'www.pwm.co.il',
//     path: '/node/data.json'
//     //path: '/Apiv3/json?NetworkId=amazecell&Target=Report&Method=getConversions&NetworkToken=NETnrEYg3AY7fEjr2tHgVzUgkv2p2Z&fields%5B%5D=Stat.advertiser_id&fields%5B%5D=Stat.affiliate_id&fields%5B%5D=Stat.offer_id&fields%5B%5D=Stat.ad_id&fields%5B%5D=Stat.session_ip&fields%5B%5D=Stat.country_code&fields%5B%5D=Stat.session_datetime&groups%5B%5D=Stat.advertiser_id&groups%5B%5D=Stat.affiliate_id&groups%5B%5D=Stat.offer_id&groups%5B%5D=Stat.country_code&data_start=2016-03-01&data_end=2016-03-03'
// };

var BearSchema   = new Schema({
    name: String,
    title: String,
    body: String,
    update: Boolean,
    number: Number
});

var ConversionsReportSchema = new Schema({
    response: String,
    createdAt: {type: Date, default: Date.now}
});

var SessionApi = new Schema({
    name: String,
    title: String,
    updated_at: { type: Date, default: Date.now },
    user: {
        type: Schema.ObjectId,
        ref: 'users'
    }
});

var Bear = mongoose.model('Bear', BearSchema);
var Session = mongoose.model('Session', SessionApi);

var conversionsReport = ()=> {
    this.bodyData = '';
    this.data = '';
    var conversionsReportModel = mongoose.model('conversionsReport', ConversionsReportSchema);
    request.get(conversionsReportUrl, (error, response, body)=> {
        if (!error && response.statusCode == 200) {
            this.bodyData = JSON.parse(body);
            this.getResolved();
        }
    });
    this.getResolved = ()=>{
        this.data = new conversionsReportModel({
            response: JSON.stringify(this.bodyData.response.data)
        });
        this.data.save((err)=>{
            if(err)
                console.log(err);
            else
                console.log(session);
        });
    };
};

conversionsReport();

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

app.get('/saveSession', function (req, res) {
    var session = new Session({
        name: Math.random().toString(36).substring(7),
        title: "Cto"
    });
    session.save((err)=>{
        if(err)
            console.log(err);
        else
            console.log(session);
    });
    mongoose.model('Session').find((err, session)=>{
        res.send(session);
    })
});

app.get('/bla', function (req, res) {
    mongoose.model('Session').find((err, session)=>{
        res.send(session);
    })
});

app.get('/session/:userName', function (req, res) {
    mongoose.model('Session').find({name:req.params.userName},(err, bear)=>{
        res.send(bear);
    })
});

app.get('/', function (req, res) {
    res.send(req + '' + '' + res);
});

app.listen(3000, ()=> {
    console.log('Example app listening on port 3000!');
});
