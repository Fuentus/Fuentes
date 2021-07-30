const { validationResult } = require('express-validator');
const db = require('../models/');
const printLog = require('../util/log_utils');
const Projects = db.Projects;


exports.getProject = (req, res, next) => {
    printLog(`Projects : Inside getProject`);
    const getPagination = (page, size) => {
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        return { limit, offset };
      };
      const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: projects } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, projects, totalPages, currentPage };
      };
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);
      Projects.findAndCountAll({ where: null, limit, offset })
        .then((data) => {
          const response = getPagingData(data, page, limit);
          res.send(response);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Error occurred while retrieving",
          });
        });
    printLog(`Projects : Exit getProject`);
}

exports.getOneProject = (req, res, next) => {
    printLog(`Projects : Inside getOneProject`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: "Validation failed", data: errors.array()});
    }
    const { id } = req.params
    const project = Projects.findOne({where : {id : id}})
    .then((project) => {
        res.status(200).send(project)
    }).catch((err) => {
        console.log(err)
        res.status(404).send(err)
    })
    printLog(`Projects : Exit getOneProject`);
}

