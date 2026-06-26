const { sql } = require('../config/db');

exports.getPlans = async (billing) => {
    const request = new sql.Request();
    const priceColumn = billing === 'yearly' ? 'price_yearly' : 'price_monthly';

    const query = `SELECT id, name, description, ${priceColumn} as price, is_popular FROM Plans`;
    const result = await request.query(query);
    return result.recordset;
};