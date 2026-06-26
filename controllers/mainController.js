const GenreModel = require('../models/GenreModel');
const FaqModel = require('../models/FaqModel');
const PlanModel = require('../models/PlanModel');
const DeviceModel = require('../models/DeviceModel');

const sendResponse = (res, data, message = "OK") => {
    res.json({
        success: true,
        message: message,
        data: data
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
        const type = req.query.type || 'all';
        const genres = await GenreModel.getGenres(type);
        sendResponse(res, genres);
    } catch (err) { sendError(res, err); }
};

exports.getFaqs = async (req, res) => {
    try {
        const faqs = await FaqModel.getFaqs();
        sendResponse(res, faqs);
    } catch (err) { sendError(res, err); }
};

exports.getPlans = async (req, res) => {
    try {
        const billing = req.query.billing || 'monthly'; 
        const plans = await PlanModel.getPlans(billing);
        sendResponse(res, plans);
    } catch (err) { sendError(res, err); }
};

exports.getDevices = async (req, res) => {
    try {
        const devices = await DeviceModel.getDevices();
        sendResponse(res, devices);
    } catch (err) { sendError(res, err); }
};