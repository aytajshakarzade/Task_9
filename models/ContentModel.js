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
            WHERE type=@type
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
            FROM content c
            INNER JOIN content_genres cg
                ON cg.content_id=c.id
            INNER JOIN genres g
                ON g.id=cg.genre_id
            WHERE c.type=@type
            AND c.top_ten_rank IS NOT NULL
            ORDER BY c.top_ten_rank
        `);

    const map = {};

    result.recordset.forEach(item => {

        if (!map[item.id]) {

            map[item.id] = {
                id: item.id,
                title: item.title,
                poster_url: item.poster_url,
                top_ten_rank: item.top_ten_rank,
                genres: []
            };

        }

        map[item.id].genres.push({
            id: item.genre_id,
            name: item.genre_name
        });

    });

    return Object.values(map);

};

exports.getContent = async (type, filter, limit = 10) => {

    const pool = await connectDB();

    let column = "";

    if (filter == "trending")
        column = "is_trending";

    if (filter == "new-release")
        column = "is_new_release";

    if (filter == "must-watch")
        column = "is_must_watch";

    const result = await pool.request()
        .input("type", mssql.VarChar, type)
        .input("limit", mssql.Int, limit)
        .query(`
            SELECT TOP(@limit)
                id,
                title,
                poster_url,
                imdb_rating,
                streamvibe_rating,
                release_year,
                type
            FROM content
            WHERE type=@type
            AND ${column}=1
        `);

    return result.recordset;

};


exports.getContentById = async (id) => {

    const pool = await connectDB();

    const content = await pool.request()
        .input("id", mssql.Int, id)
        .query(`
            SELECT *
            FROM content
            WHERE id=@id
        `);

    if (content.recordset.length == 0)
        return null;

    const item = content.recordset[0];

    const genres = await pool.request()
        .input("id", mssql.Int, id)
        .query(`
            SELECT
                g.id,
                g.name,
                g.slug
            FROM content_genres cg
            INNER JOIN genres g
            ON g.id=cg.genre_id
            WHERE cg.content_id=@id
        `);

    const languages = await pool.request()
        .input("id", mssql.Int, id)
        .query(`
            SELECT language
            FROM content_languages
            WHERE content_id=@id
        `);

    const cast = await pool.request()
        .input("id", mssql.Int, id)
        .query(`
            SELECT
                p.id,
                p.name,
                p.avatar_url,
                p.nationality,
                cp.character_name
            FROM content_people cp
            INNER JOIN people p
            ON p.id=cp.person_id
            WHERE cp.content_id=@id
            AND cp.role_type='cast'
        `);

    const directors = await pool.request()
        .input("id", mssql.Int, id)
        .query(`
            SELECT
                p.id,
                p.name,
                p.avatar_url,
                p.nationality
            FROM content_people cp
            INNER JOIN people p
            ON p.id=cp.person_id
            WHERE cp.content_id=@id
            AND cp.role_type='director'
        `);

    const music = await pool.request()
        .input("id", mssql.Int, id)
        .query(`
            SELECT
                p.id,
                p.name,
                p.avatar_url,
                p.nationality
            FROM content_people cp
            INNER JOIN people p
            ON p.id=cp.person_id
            WHERE cp.content_id=@id
            AND cp.role_type='music'
        `);

    return {

        id: item.id,
        title: item.title,
        description: item.description,
        poster_url: item.poster_url,
        background_url: item.background_url,
        trailer_url: item.trailer_url,
        type: item.type,
        release_year: item.release_year,
        imdb_rating: item.imdb_rating,
        streamvibe_rating: item.streamvibe_rating,

        genres: genres.recordset,

        languages: languages.recordset.map(x => x.language),

        cast: cast.recordset,

        directors: directors.recordset,

        music: music.recordset

    };

};

exports.getSeasons = async (id) => {

    const pool = await connectDB();

    const seasons = await pool.request()
        .input("id", mssql.Int, id)
        .query(`
            SELECT *
            FROM seasons
            WHERE content_id=@id
            ORDER BY season_number
        `);

    for (const season of seasons.recordset) {

        const episodes = await pool.request()
            .input("id", mssql.Int, season.id)
            .query(`
                SELECT
                    id,
                    episode_number,
                    title,
                    description,
                    thumbnail_url,
                    duration_minutes
                FROM episodes
                WHERE season_id=@id
                ORDER BY episode_number
            `);

        season.episodes = episodes.recordset;

    }

    return seasons.recordset;

};

exports.getReviews = async (id) => {

    const pool = await connectDB();

    const result = await pool.request()
        .input("id", mssql.Int, id)
        .query(`
            SELECT
                id,
                reviewer_name,
                reviewer_location,
                rating,
                review_text,
                created_at
            FROM reviews
            WHERE content_id=@id
            ORDER BY created_at DESC
        `);

    return result.recordset;

};