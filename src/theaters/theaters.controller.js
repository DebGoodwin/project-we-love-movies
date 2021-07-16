
const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function list(req, res, next) {
    const theaterList = await service.list();
    res.json({ data: theaterList });
}


module.exports = {
    list: [asyncErrorBoundary(list)],
}