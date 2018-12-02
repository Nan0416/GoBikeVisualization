const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
 
const port = 3000;
 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));
 
const router = express.Router();
router.route("/")
.post((req, res, next)=>{
    res.json();
});
 
////////////// Setup route /////////////////////////
app.use("/root", router);
app.use('/', express.static(__dirname + '/public'));
app.listen(port);