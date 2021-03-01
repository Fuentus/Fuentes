exports.getMeasures = (req, res, next) => {
    Measures.findAll()
}