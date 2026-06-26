const { sql } = require('../config/db');

exports.getDevices = async () => {
    const result = await sql.query(`SELECT id, name, description, icon_name FROM Devices`);
    return result.recordset;
};