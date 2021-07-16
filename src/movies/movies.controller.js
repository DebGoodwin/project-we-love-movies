const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function movieExists(req, res, next) {
    const { movieId } = req.params;
    const movie = await service.read(movieId);
    
    if(movie) {
        res.locals.movie = movie;
        return next();
    }
    return next({ status: 404, message: 'Movie cannot be found.' });
}

async function list(req, res, next) {
    const isShowing = req.query.is_showing;
    if(isShowing) {
        const showingList = await service.listShowing();
        res.json({ data: showingList })
    } else {
        const data = await service.list();
        res.json({ data });
    }
}

async function read(req, res) {
    const movie = res.locals.movie;
    res.json({ data: movie });
}

async function readTheaters(req, res, next) {
    const { movieId } = req.params;
    const theaters = await service.readTheaters(movieId);
    res.json({ data: theaters });
}

async function readReviews(req, res, next) {
    const { movieId } = req.params;
    const reviews = await service.readReviews(movieId);
    res.json({ data: reviews });
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    readTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readTheaters)],
    readReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readReviews)],
};