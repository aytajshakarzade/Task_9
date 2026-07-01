const GenreModel = require('../models/GenreModel');
const FaqModel = require('../models/FaqModel');
const PlanModel = require('../models/PlanModel');
const DeviceModel = require('../models/DeviceModel');
const ContentModel = require('../models/ContentModel');

const sendResponse = (res, data, message = "OK") => {
    res.json({
        success: true,
        message,
        data
    });
};

const sendError = (res, error) => {
    console.error(error);

    res.status(500).json({
        success: false,
        message: "Server Error",
        data: null
    });
};

exports.getGenres = async (req, res) => {
    try {
        const type = req.query.type || "all";
        const genres = await GenreModel.getGenres(type);
        sendResponse(res, genres);
    } catch (err) {
        sendError(res, err);
    }
};

exports.getFaqs = async (req, res) => {
    try {
        const faqs = await FaqModel.getFaqs();
        sendResponse(res, faqs);
    } catch (err) {
        sendError(res, err);
    }
};

exports.getPlans = async (req, res) => {
    try {
        const billing = req.query.billing || "monthly";
        const plans = await PlanModel.getPlans(billing);
        sendResponse(res, plans);
    } catch (err) {
        sendError(res, err);
    }
};

exports.getDevices = async (req, res) => {
    try {
        const devices = await DeviceModel.getDevices();
        sendResponse(res, devices);
    } catch (err) {
        sendError(res, err);
    }
};

exports.getHero = async (req, res) => {
    try {
        const hero = await ContentModel.getHero();
        sendResponse(res, hero);
    } catch (err) {
        sendError(res, err);
    }
};

exports.getContentGenres = async (req, res) => {

    try {

        const { type } = req.query;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: "type parameter is required",
                data: null
            });
        }

        const genres = await ContentModel.getGenres(type);

        sendResponse(res, genres);

    } catch (err) {

        sendError(res, err);

    }

};

exports.getTopTen = async (req, res) => {

    try {

        const { type } = req.query;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: "type parameter is required",
                data: null
            });
        }

        const topTen = await ContentModel.getTopTen(type);

        sendResponse(res, topTen);

    } catch (err) {

        sendError(res, err);

    }

};

exports.getContent = async (req, res) => {

    try {

        const { type, filter } = req.query;

        const limit = req.query.limit || 10;

        if (!type || !filter) {
            return res.status(400).json({
                success: false,
                message: "type and filter are required",
                data: null
            });
        }

        const content = await ContentModel.getContent(type, filter, limit);

        sendResponse(res, content);

    } catch (err) {

        sendError(res, err);

    }

};


exports.getContentById = async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid id",
                data: null
            });
        }

        const content = await ContentModel.getContentById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found",
                data: null
            });
        }

        sendResponse(res, content);

    } catch (err) {

        sendError(res, err);

    }

};

exports.getSeasons = async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid id",
                data: null
            });
        }

        const content = await ContentModel.getContentById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found",
                data: null
            });
        }

        const seasons = await ContentModel.getSeasons(id);

        sendResponse(res, seasons);

    } catch (err) {

        sendError(res, err);

    }

};

exports.getReviews = async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid id",
                data: null
            });
        }

        const content = await ContentModel.getContentById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found",
                data: null
            });
        }

        const reviews = await ContentModel.getReviews(id);

        sendResponse(res, reviews);

    } catch (err) {

        sendError(res, err);

    }

};