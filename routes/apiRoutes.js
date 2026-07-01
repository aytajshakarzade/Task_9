const express = require("express");
const router = express.Router();

const mainController = require("../controllers/mainController");

// =====================
// Landing Page
// =====================

router.get("/genres", mainController.getGenres);
router.get("/faqs", mainController.getFaqs);
router.get("/plans", mainController.getPlans);
router.get("/devices", mainController.getDevices);

// =====================
// Movies & Shows
// =====================

// Hero
router.get("/content/hero", mainController.getHero);

// Genres
router.get("/content/genres", mainController.getContentGenres);

// Top 10
router.get("/content/top-ten", mainController.getTopTen);

// Trending / New Release / Must Watch
router.get("/content", mainController.getContent);

// =====================
// Detail Page
// Bunlar /content route-larından sonra,
// amma :id route-u seasons və reviews-dan sonra olmalıdır.
// =====================

// Seasons
router.get("/content/:id/seasons", mainController.getSeasons);

// Reviews
router.get("/content/:id/reviews", mainController.getReviews);

// Detail
router.get("/content/:id", mainController.getContentById);

module.exports = router;