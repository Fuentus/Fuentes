const db = require('../models/');
const printLog = require('../util/funetus_util');
const Inventory = db.Inventory;

exports.createInventory = (req, res, next) => {
    printLog(`Inventory : Inside createInventory`);
    const { item_name, item_desc, availability, cost } = req.body
    try {
        const inventory = Inventory.create({
            item_name : item_name,
            item_desc : item_desc,
            availability : availability,
            cost : cost
        })
        res.status(200).json({ message : 'Inventory Created' })
        next()
    } catch (err) {
        console.log(err)
        next(err)
    }
    printLog(`Inventory : Exit createInventory`);
}

exports.getInventory = (req, res, next) => {
    printLog(`Inventory : Inside getInventory`);
    const getPagination = (page, size) => {
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        return { limit, offset };
      };
      const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: inventory } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, inventory, totalPages, currentPage };
      };
      const { page, size } = req.query;
      const { limit, offset } = getPagination(page, size);
      Inventory.findAndCountAll({ where: null, limit, offset })
        .then((data) => {
          const response = getPagingData(data, page, limit);
          res.send(response);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Error occurred while retrieving",
          });
        });
    printLog(`Inventory : Exit getInventory`);
}

exports.getOneInventory = (req, res, next) => {
    printLog(`Inventory : Inside getOneInventory`);
    const { id } = req.params
    const inventory = Inventory.findOne({where : { id:id }})
    .then((inventory) => {
        res.status(200).send(inventory)
    }).catch((err) => {
        console.log(err)
    })
    printLog(`Inventory : Exit getOneInventory`);
}

exports.deleteInventory = (req, res, next) => {
    printLog(`Inventory : Inside deleteInventory`);
    const { id } = req.params
    try {
        const inventory = Inventory.destroy({where : {id : id}})
        res.sendStatus(200)
        next()
    } catch (err) {
        console.log(err)
        next(err)
    }
    printLog(`Inventory : Exit deleteInventory`);
}

exports.updateInventory = (req, res, next) => {
    printLog(`Inventory : Inside updateInventory`);


    printLog(`Inventory : Exit updateInventory`);
}
