const { getServices } = require('./getService');
const { createService } = require('./createService');
const { updateServiceInfoById } = require('./updateService');
const { deleteServices } = require('./deleteService');

module.exports = {
    getServices,
    createService,
    updateServiceInfoById,
    deleteServices,
};
