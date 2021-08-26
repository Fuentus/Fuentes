const { validationResult } = require('express-validator');
const db = require('../../models/');
const logger = require('../../util/log_utils');
const {ProjectStatus} = require('../service/ProjectStatus');
const Projects = db.Projects;
const { project_workers: ProjectWorkers, Quotes } = db;



exports.getProject = (req, res, next) => {
    logger.debug(`Projects : Inside getProjectOperation`);
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
      logger.debug(`Projects : Exit getProjectOperation`);
}

exports.getOneProject = (req, res, next) => {
   logger.debug(`Projects : Inside getOneProject`);
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
    logger.debug(`Projects : Exit getOneProject`);
}


// exports.deleteProjectById = async (req, res, next) => {
//   logger.debug(`Projects : Inside deleteProjectById`);
//   const {id} = req.params;
//     const result = await db.sequelize.transaction(async (t) => {
//         return await Projects.destroy(
//             {where: {id: id}, force: true},
//             {transaction: t}
//         );
//     });
//     const obj = {};
//     obj.message = "Project Deleted Successfully";
//     obj.updatedRecord = result;
//     res.status(200).send(obj);
//   logger.debug(`Projects : Exit deleteProjectById`);
// };

exports.updateProjectById = async (req, res, next) => {
  logger.debug(`Projects : Inside updateProjectById`);
  const {id} = req.params;
  let {name, desc, startDate, endDate, workers} = req.body;
  const project = await Projects.findOne({where: {id : id }})
    if(project) {
          const result = await db.sequelize.transaction(async (t) => {
          let project = await Projects.update({
            name: name,
            desc: desc,
            startDate: startDate,
            endDate: endDate
          }, {where: {id : id }}, {transaction: t});

          if(workers) {
            const allWorkers = await ProjectWorkers.findAndCountAll({where: {project_id : id}})
            const workerDbId = allWorkers.rows.map((w) => {
                return w.dataValues.worker_id
            })
            
            const workerArray = [];
            workers.map(async (worker) => {
                if (workerDbId.includes(worker.id)) {
                    workerArray.push(worker.id)
                    await ProjectWorkers.update({total_hrs: worker.required_hrs}, {where: {project_id :id, worker_id: worker.id}}, {transaction: t});
                } else {
                    await ProjectWorkers.create({total_hrs: worker.required_hrs, project_id :id, operation_id: worker.operation_id, worker_id: worker.id});
                }
            })

            const delWorkerId = workerDbId.filter(x => !workerArray.includes(x)) 
            for (let i = 0; i < delWorkerId.length; i++) {
                await ProjectWorkers.destroy({where: {project_id : id, worker_id: delWorkerId[i]}})
            }  
          }
          return project;
      })
      .catch ((error) => {
          logger.error(error)
          return null
      });
      if (result) {
          res.status(200).json({message: "Project updated!", data: req.body});
      } else {
          const err = new Error("Please try back Later");
          err.statusCode = 500;
          next(err);
      }
    } else {
      return res.status(400).json({message: 'Project Doesnot Exists'})
    }
  logger.debug(`Projects : Inside updateProjectById`);
};

exports.changeProjectStatus = async (req, res, next) => {
  logger.info(`Projects : Inside changeProjectStatus`);
  let { status } = req.body;
  const { id } = req.params;
  const project = await Projects.findOne({where : {id :id}})
  if (project) {
    const boolean = ProjectStatus.checkProjectStatusCanBeUpdated(project.status, status);
    if (!boolean) {
        return res.status(422).send({msg: `Please Choose Correct Status`});
    }
    const qid = project.QuoteId;
    Projects.update({status: status}, {where: {id: id}})
    .then((result) => {
        Quotes.update({status: 'CLOSED'}, {where: {id: qid}})
        const obj = {};
        obj.message = "Status Updated Successfully";
        obj.updatedRecord = result.length;
        res.status(200).send(obj);
    })
    .catch((err) => {
      res.status(422).send({msg: `Input Valid Project`});
      next(err)
    });
  } else {
    return res.status(422).send({msg: `Input Valid Project`});
  }
  logger.info(`Projects : Exit changeProjectStatus`);
};


