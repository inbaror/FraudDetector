var express = require('express');
var router = express.Router();


router.get('/bear', function (req, res) {
    mongoose.model('Session').find((err, bear)=>{
        res.send(bear);
    })
});

module.exports = router;