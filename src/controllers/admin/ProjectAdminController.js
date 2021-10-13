const { validationResult } = require('express-validator');
const db = require('../../models/');
const logger = require('../../util/log_utils');
const { fetchProjectByClause } = require('../service/ProjectService');
const {ProjectStatus} = require('../service/ProjectStatus');
const Projects = db.Projects;
const { project_workers: ProjectWorkers, Quotes, project_closed_logs: ProjectClosedLogs, project_workers_log: ProjectWorkersDate, Professions } = db;



exports.getProject = (req, res, next) => {
    logger.debug(`Projects : Inside getProjectOperation`);
    const getPagination = (page, size) => {
        const limit = size ? +size : 10;
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
    const whereClause = {id: id};
    fetchProjectByClause(whereClause).then(async (project) => {

      project.dataValues.ProjectWorkers.map((w) => w.Workers.dataValues.required_hrs = w.total_hrs)

      let worker = project.dataValues.ProjectWorkers.map((w) => w.Workers);
      project.dataValues.workers = worker

      // for (let i = 0; i < worker.length; i++) {
      //   const pId = worker[i].ProfessionId
      //   const p = await Professions.findOne({where: {id: pId}})
      //   worker[i].ProfessionId = p.name
      // }
















      
      // let workers = project.dataValues.ProjectWorkers.map((w) => w.Workers);
      // project.dataValues.workers = workers

      // let req_hrs = project.dataValues.ProjectWorkers.map((w) => w.total_hrs );


      // const len = workers.length === req_hrs.length

      // if (len) {
      //   console.log('true')
      // }
      // for (let i = 0; i < req_hrs.length; i++) {
            
      //       project.dataValues.workers.map((wkr) => wkr.dataValues.required_hrs = req_hrs[i])
      // }

      // req_hrs.forEach((hrs) => {
      //   console.log(hrs)
      //   project.dataValues.workers.map((wkr) => wkr.dataValues.required_hrs = hrs)
      // })

      // for (let i = 0; i < project.dataValues.workers.length; i++) {
      //   const pId = project.dataValues.workers[i].ProfessionId
      //   const p = await Professions.findOne({where: {id: pId}})
      //   project.dataValues.workers[i].ProfessionId = p.name
      // }


      // for (let i = 0; i < project.dataValues.ProjectWorkers.length; i++) {
      //   for (let j = 0; j < project.dataValues.workers.length; j++) {
      //     project.dataValues.workers[j].name = project.dataValues.ProjectWorkers[i].total_hrs
      //   }
        
      // }














      // let Arr = []
      // for (let i = 0; i <= project.dataValues.ProjectWorkers.length; i++) {
      //   Arr.push(project.dataValues.ProjectWorkers[i].Workers.dataValues)
      //   console.log(typeof project.dataValues.ProjectWorkers[i].Workers.dataValues);
      // }

      // console.log(Arr)

      


      // let req_hrs = project.dataValues.ProjectWorkers.map((w) => w.total_hrs );
      
     // console.log(req_hrs)


      
      //project.dataValues.workers.map((wkr) => wkr.dataValues.required_hrs = req_hrs)
      
      
      // for (let i = 0; i < req_hrs.length; i++) {
      //   project.dataValues.workers.map((wkr) => wkr.dataValues.required_hrs = req_hrs[i])
      // }


      // for(let i = 0; i < workersArr.length; i++) {
      //   for(let j = 0; j < req_hrs.length; j++) {
      //     workersArr[i].required_hrs = req_hrs[j]
      //   }
      // }

      // let newData = []
      // required_hrs.forEach(item => {
      //   project.dataValues.workers.push({["required_hrs"]: item})
      // })

      // console.log(newData)







      // for (let i = 0; i < project.dataValues.workers.length; i++) {
      //   console.log(project.dataValues.workers[i].dataValues);
      //   project.dataValues.workers[i].push(3)
      // }
     
      
      
     
      // project.dataValues.required_hrs = project.dataValues.ProjectWorkers.map((w) => w.total_hrs);
      
      // let pId = project.dataValues.workers.map((worker) => worker.ProfessionId)
      // let Proff = [];
      // for (let i =0; i< pId.length; i++) {
      //   const prof = await Professions.findOne({where: {id: pId[i]}})
      //   Proff.push(prof.dataValues.name)
      // }
      // console.log(Proff)
      res.status(200).send(project)
    }).catch((err) => {
        logger.error(err);
        next(err);
    });
    logger.debug(`Projects : Exit getOneProject`);
}


// exports.deleteProjectById = async (req, res, next) => {
//   logger.debug(`Projects : Inside deleteProjectById`);
//   const {id} = req.params;
//     const result = await db.sequelize.transaction(async (t) => {
//         return await Projects.destroy(
//             {where: {id: id}},
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
  let _self = this;
  _self.message = 'Project Updated!';
  const project = await Projects.findOne({where: {id : id }})
    if(project) {
          const result = await db.sequelize.transaction(async (t) => {
          let project = await Projects.update({
            name: name,
            desc: desc,
            start_date: startDate,
            end_date: endDate
          }, {where: {id : id }}, {transaction: t});
          if(workers) {
            const allWorkers = await ProjectWorkers.findAndCountAll({where: {project_id : id}})
            const workerDbId = allWorkers.rows.map((w) => {
                return w.dataValues.worker_id
            })
           
            const workerArray = [];
            // workers.map(async (worker) => {
            
            // })

            for( let i = 0; i< workers.length; i++) {
              let worker = workers[i]

              

              if (workerDbId.includes(worker.id)) {
                workerArray.push(worker.id)
                await ProjectWorkers.update({total_hrs: worker.required_hrs}, {where: {project_id :id, worker_id: worker.id}}, {transaction: t});
                _self.message = 'Project Updated!';
              } else {
                  let workerInProject = await ProjectWorkers.findAndCountAll({where: {worker_id: worker.id}}, {transaction: t})
                  workerInProject = workerInProject.rows.map((pjtWkr) => pjtWkr.dataValues.project_id)

                  if (workerInProject.length > 0) {
                    for (let i = 0; i < workerInProject.length; i++) {
                      let project = await Projects.findOne({where: {id: workerInProject[i]}})
                      let startDate = project.start_date;
                      let endDate = project.end_date;
                      let currentDate = new Date();
  
                      if (currentDate > startDate && currentDate < endDate) {
                        _self.message = 'Worker is already assigned to some Projects at Present Time'
                        break;
                      } else {
                        await ProjectWorkers.create({total_hrs: worker.required_hrs, project_id : id, operation_id: worker.operation_id, worker_id: worker.id});
                        _self.message = 'Project Updated!'
                      }
                    }
                  } else {
                    await ProjectWorkers.create({total_hrs: worker.required_hrs, project_id : id, operation_id: worker.operation_id, worker_id: worker.id});
                    _self.message = 'Project Updated!'
                  }
              }
            }

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
        console.log("message")
        console.log( _self.message)
          res.status(200).json({message: _self.message});
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
  let status  =  'CLOSED';
  const { id } = req.params;
  const { note } = req.body;
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
        ProjectClosedLogs.create({ note: note ? note: 'COMPLETED', ProjectId: id})
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

