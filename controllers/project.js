const db = require('../models/');
const printLog = require('../util/fuentis_util');
const Projects = db.Projects;

exports.createProject = (req, res, next) => {
    printLog(`Projects : Inside createProject`);


    printLog(`Projects : Exit createProject`);
}

exports.getProject = (req, res, next) => {
    printLog(`Projects : Inside getProject`);


    printLog(`Projects : Exit getProject`);
}

exports.getOneProject = (req, res, next) => {
    printLog(`Projects : Inside getOneProject`);


    printLog(`Projects : Exit getOneProject`);
}

exports.deleteProject = (req, res, next) => {
    printLog(`Projects : Inside deleteProject`);


    printLog(`Projects : Exit deleteProject`);
}

exports.updateProject = (req, res, next) => {
    printLog(`Projects : Inside updateProject`);


    printLog(`Projects : Exit updateProject`);
}
