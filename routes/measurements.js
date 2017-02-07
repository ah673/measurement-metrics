function postMeasurement (req, res) {
    console.log(req.body);
    res.status(201);
    res.json(req.body);
}

module.exports = { postMeasurement };