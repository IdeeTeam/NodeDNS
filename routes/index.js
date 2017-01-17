var express = require('express');
var router = express.Router();


var userController = require('..\\controllers\\user.js');
const authController = require('../controllers/authentication');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/createuser').post(userController.createUser);
router.route('/login').post(authController.login);


const redisController = require('../controllers/redis');


//router.use(authController.authenticate);

router.route('/verify/:link').get(redisController.verify);

router.route('/servercheckin').post(authController.authenticate, redisController.serverCheckIn);
router.route('/getip').post(redisController.getIP);



module.exports = router;
