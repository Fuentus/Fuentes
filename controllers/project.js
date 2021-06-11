const db = require('../models/');
const printLog = require('../util/funetus_util');
const Projects = db.Projects;

exports.createProject = async (req, res, next) => {
    printLog(`Projects : Inside createProject`);
    const { p_name, p_desc, hours_commited, hours_left, start_date, end_date } = req.body
    try {
        let project = await Projects.create({
            p_name : p_name,
            p_desc : p_desc,
            hours_commited : hours_commited,
            hours_left : hours_left,
            start_date : start_date,
            end_date : end_date
        })
        res.status(201).json({ message : 'Project Created' })
        next()
    } catch (err) {
       console.log(err)
       next(err)
    }
    printLog(`Projects : Exit createProject`);
}

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

exports.deleteProject = (req, res, next) => {
    printLog(`Projects : Inside deleteProject`);
    const { id } = req.params
    const project = Projects.destroy({where : {id : id}})
    .then((project) => {
        res.sendStatus(200)
        next()
    }).catch((err) => {
        res.status(400).send(err)
        next(err)
    })
    printLog(`Projects : Exit deleteProject`);
}

exports.updateProject = (req, res, next) => {
    printLog(`Projects : Inside updateProject`);


    printLog(`Projects : Exit updateProject`);
}
