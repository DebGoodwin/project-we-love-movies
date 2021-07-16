const service = require("./reviews.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
    const review = await service.read(reviewId);
    
    if(review) {
        res.locals.review = review;
        return next();
    }
    return next({ status: 404, message: `Review cannot be found`})
}

async function update(req, res, next) {
    const { reviewId } = req.params;

    const data = await service.update(reviewId, req.body.data);
    const updatedReview = await service.getUpdatedReview(reviewId);
    res.json({ data: updatedReview });
}

async function destroy(req, res) {
    const { reviewId } = req.params;
    
    await service.delete(reviewId);
    res.sendStatus(204);
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}