const { connectDB, mssql } = require("../config/db");

exports.getHero = async () => {
    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT
            id,
            title,
            description,
            background_url,
            trailer_url,
            type
        FROM dbo.content
        WHERE is_featured = 1
    `);

    return result.recordset;
};

exports.getGenres = async (type) => {
    const pool = await connectDB();

    const result = await pool.request()
        .input("type", mssql.VarChar, type)
        .query(`
            SELECT
                id,
                name,
                slug,
                cover_image_1,
                cover_image_2,
                cover_image_3,
                cover_image_4
            FROM dbo.genres
            WHERE type = @type
        `);

    return result.recordset;
};

exports.getTopTen = async (type) => {
    const pool = await connectDB();

    const result = await pool.request()
        .input("type", mssql.VarChar, type)
        .query(`
            SELECT
                c.id,
                c.title,
                c.poster_url,
                c.top_ten_rank,
                g.id AS genre_id,
                g.name AS genre_name
            FROM dbo.content c
            INNER JOIN dbo.content_genres cg
                ON c.id = cg.content_id
            INNER JOIN dbo.genres g
                ON g.id = cg.genre_id
            WHERE c.type = @type
              AND c.top_ten_rank IS NOT NULL
            ORDER BY c.top_ten_rank ASC
        `);

    return result.recordset;
};

exports.getContent = async (type, filter, limit = 10) => {

    const pool = await connectDB();

    let column = "";

    if (filter === "trending")
        column = "is_trending";

    if (filter === "new-release")
        column = "is_new_release";

    if (filter === "must-watch")
        column = "is_must_watch";

    const result = await pool.request()
        .input("type", mssql.VarChar, type)
        .input("limit", mssql.Int, limit)
        .query(`
            SELECT TOP (@limit)
                id,
                title,
                poster_url,
                imdb_rating,
                streamvibe_rating,
                release_year,
                type
            FROM dbo.content
            WHERE type=@type
              AND ${column}=1
        `);

    return result.recordset;
};