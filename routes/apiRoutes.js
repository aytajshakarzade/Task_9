const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');

router.get('/genres', mainController.getGenres);
router.get('/faqs', mainController.getFaqs);
router.get('/plans', mainController.getPlans);
router.get('/devices', mainController.getDevices);

router.get('/content/hero', mainController.getHero);
router.get('/content/genres', mainController.getContentGenres);
router.get('/content/top-ten', mainController.getTopTen);
router.get('/content', mainController.getContent);

module.exports = router;