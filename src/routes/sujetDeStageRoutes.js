const express = require('express');
var router = express.Router();

const {
    addSujetDeStage,
    getSujetDeStageById,
    getSujetDeStages,
    updateSujetDeStageById,
    removeSujetDeStage,
    addDocumentToSuj
} = require('../controllers/sujetDeStageController');
const multerConfig = require('../config/multerConfig');

const upload = multerConfig.single('document');


router.post(`/sujets-de-stage`, addSujetDeStage);
router.get(`/sujets-de-stage/:id`, getSujetDeStageById);
router.get(`/sujets-de-stage`, getSujetDeStages);
router.put(`/sujets-de-stage/:id`, updateSujetDeStageById);
router.delete(`/sujets-de-stage/:id`, removeSujetDeStage);
router.post(`/sujets-de-stage/:id/documents`,upload,  addDocumentToSuj);

module.exports = router;
