/**
 * Created by Stefan on 1/8/2017.
 */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authentication');

router.use(authController.authenticate);


module.exports = router;