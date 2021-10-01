const db = require("../../models");
const { Projects, project_workers: ProjectWorkers, Workers } = db;

const fetchProjectByClause = async (whereClause) => {
    return (
        (await Projects.findOne({
            where: whereClause,
            attributes: ["id", "name", "desc", "status", "start_date", "end_date", "createdAt", "updatedAt", "deletedAt", "version", "QuoteId"],
            include: [
                {
                    model: ProjectWorkers,
                    as: "ProjectWorkers",
                    attributes: ["tag_workers_project_id", "total_hrs", "worker_id"],
                    include: [
                        {
                            model: Workers,
                            as: "Workers",
                            attributes: ["id", "name", "ProfessionId",
                            "avail_per_day", "cost_per_hr", "total_avail_per_week"]
                        }],
                    }
            ],
        })) || {}
    );
};


module.exports = {
    fetchProjectByClause: fetchProjectByClause
};

