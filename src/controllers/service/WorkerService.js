const db = require("../../models");

const {Workers, project_workers: ProjectWorkers,Projects,Operations} = db;

const fetchWorkersByClause = async (whereClause) => {
    return (
        (await Workers.findOne({
            where: whereClause,
            attributes: ["name", "phone", "address", "email",
                "avail_per_day", "cost_per_hr", "total_avail_per_week", "createdAt", "updatedAt"],
        })) || {}
    );
};

const getAllWorkers = (obj, whereClause, success, failure) => {
    const {limit, offset} = obj;
    Workers.findAndCountAll({
        where: whereClause,
        attributes: ["name", "phone", "address", "email",
            "avail_per_day", "cost_per_hr", "total_avail_per_week", "createdAt", "updatedAt"],
        order: [["updatedAt", "DESC"]],
        limit,
        offset,
    })
        .then((data) => {
            success(data);
        })
        .catch((err) => {
            failure(err);
        });
};

const getAllProjects = (obj, whereClause, success, failure) => {
    const {limit, offset} = obj;
    ProjectWorkers.findAndCountAll({
        where: whereClause,
        attributes:["tag_workers_project_id","total_hrs"],
        include: [
            {
                model: Projects,
                as: "Projects",
                attributes:["id","name","start_date","end_date"]
            },
            {
                model: Operations,
                as: "Operations",
                attributes:["id","name"]
            }
        ],
        order: [["updatedAt", "DESC"]],
        limit,
        offset,
    }).then((data) => {
        success(data);
    })
        .catch((err) => {
            failure(err);
        });
}

module.exports = {
    fetchWorkersByClause: fetchWorkersByClause,
    getAllWorkers: getAllWorkers,
    getAllProjects: getAllProjects
};