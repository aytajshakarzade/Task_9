const express = require('express');
const router = express.Router();
const { connectDB, mssql } = require('../config/db');

const sendResponse = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({ success, message, data });
};



router.get('/genres', async (req, res) => {
    try {
        const type = req.query.type || 'all';
        const pool = await connectDB();
        let query = 'SELECT id, name, slug, type, cover_image_1, cover_image_2, cover_image_3, cover_image_4 FROM dbo.genres';
        const request = pool.request();
        if (type === 'movie' || type === 'show') {
            query += ' WHERE type = @type';
            request.input('type', mssql.VarChar, type);
        }
        const result = await request.query(query);
        return sendResponse(res, 200, true, 'OK', result.recordset);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});



router.get('/faqs', async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT id, question, answer, order_number FROM dbo.faqs ORDER BY order_number ASC');
        return sendResponse(res, 200, true, 'OK', result.recordset);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});



router.get('/plans', async (req, res) => {
    try {
        const billing = req.query.billing || 'monthly';
        const pool = await connectDB();
        let priceField = billing === 'yearly' ? 'price_yearly' : 'price_monthly';
        const query = `SELECT id, name, description, ${priceField} AS price, is_popular FROM dbo.pricing_plans`;
        const result = await pool.request().query(query);
        return sendResponse(res, 200, true, 'OK', result.recordset);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});



router.get('/devices', async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT id, name, description, icon_name FROM dbo.devices');
        return sendResponse(res, 200, true, 'OK', result.recordset);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});

module.exports = router;