class ProjectStatus {
    static projectStatus = []

    constructor(status, priority) {
        this.status = status;
        this.priority = priority;
    }

    static defaultValue = () => {
        return PROJECT_STATUS.PROJECT_NEW.status;
    }

    static getAllProjectStatus = () => {
        if (this.projectStatus != null && this.projectStatus.length > 0) {
            return this.projectStatus;
        }
        for (let pState of Object.values(PROJECT_STATUS)) {
            this.projectStatus.push(pState.status);
        }
        return this.projectStatus;
    }
    static findProjectByStatus = (name) => {
        for (let key of Object.keys(PROJECT_STATUS)) {
            if (PROJECT_STATUS[key].status === name.toUpperCase()) {
                return PROJECT_STATUS[key];
            }
        }
    }

    static checkProjectStatusCanBeUpdated = (existingProjectStatus, newProjectStatus) => {
        const existingPStatus = this.findProjectByStatus(existingProjectStatus);
        const newPStatus = this.findProjectByStatus(newProjectStatus);
        if (!newPStatus) {
            return false;
        }
        return newPStatus.priority >= existingPStatus.priority;
    }

    static get = (name) => {
        const status = this.findProjectByStatus(name);
        return status.name;
    }
}

const PROJECT_STATUS = {
    PROJECT_NEW: new ProjectStatus("NEW", 1),
    CLOSED: new ProjectStatus("CLOSED", 2),
}

module.exports = {
    ProjectStatus: ProjectStatus
}