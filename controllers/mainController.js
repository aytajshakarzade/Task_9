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
        message: "Server Xətası",
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