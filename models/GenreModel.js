const { sql } = require('../config/db');

exports.getGenres = async (type) => {
    const request = new sql.Request();
    let query = `SELECT id, name, slug, type, cover_image_1, cover_image_2, cover_image_3, cover_image_4 FROM Genres`;

    if (type !== 'all') {
        query += ` WHERE type = @type`;
        request.input('type', sql.VarChar, type);
    }

    const result = await request.query(query);
    return result.recordset;
};