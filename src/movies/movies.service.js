const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

function list() {
    return knex("movies").select("*");
}

function listShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .where({ "mt.is_showing": true })
        .select("m.*")
        .groupBy("m.movie_id");
}

function read(movieId) {
    return knex("movies")
    .where("movie_id", movieId)
    .select("*")
    .first();
}

function readTheaters(movieId) {
    return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ movie_id: movieId, is_showing: true });   
}

function readReviews(movieId) {
    return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where("r.movie_id", movieId)
    .then((result) => {
        const reviewList = [];
        result.forEach((review) => {
            const newObj = addCritic(review);
            reviewList.push(newObj);
        })
        return reviewList;
    });
}


module.exports = {
    list,
    listShowing,
    read, 
    readTheaters,
    readReviews,
};