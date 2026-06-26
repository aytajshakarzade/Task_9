const { sql } = require('../config/db');

exports.getFaqs = async () => {
    const result = await sql.query(`SELECT id, question, answer, order_number FROM Faqs ORDER BY order_number ASC`);
    return result.recordset;
};