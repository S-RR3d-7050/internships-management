const express = require('express');
var router = express.Router();

const {
    addDemandeDeStage,
    getDemandeDeStageById,
    getDemandeDeStages,
    updateDemandeDeStageById,
    removeDemandeDeStage,
    addDocumentToDemandeDeStage,
    getDemandeDeStagesByStudentIdControll,
    getDemandeDeStagesListWithStudentDataControll,
    getDemandeDeStagesByStudentIdAndDataControll,
    getDemandeDeStagesListByEtatDemandeControll,
    getDemandeDeStagesByEncadrantIdControll,
    refuseDemandeDeStageControll,
    acceptDemandeDeStageControll
} = require('../controllers/demandeDeStageController');
const multerConfig = require('../config/multerConfig');

const upload = multerConfig.single('document');

router.post(`/demandes-de-stage`, addDemandeDeStage);
router.get(`/demandes-de-stage/:id`, getDemandeDeStageById);
router.get(`/demandes-de-stage`, getDemandeDeStages);
router.put(`/demandes-de-stage/:id`, updateDemandeDeStageById);
router.delete(`/demandes-de-stage/:id`, removeDemandeDeStage);
router.post(`/demandes-de-stage/:id/documents`, upload, addDocumentToDemandeDeStage);
router.get(`/demandes-de-stage/student/:id`, getDemandeDeStagesByStudentIdControll);
router.get(`/demandes-de-stage/list/student`, getDemandeDeStagesListWithStudentDataControll);
router.get(`/demandes-de-stage/student/:id/data`, getDemandeDeStagesByStudentIdAndDataControll);
router.get(`/demandes-de-stage/etat/:etatDemande`, getDemandeDeStagesListByEtatDemandeControll);
router.get(`/demandes-de-stage/encadrant/:id`, getDemandeDeStagesByEncadrantIdControll);
router.put(`/demandes-de-stage/:id/refuse`, refuseDemandeDeStageControll);
router.put(`/demandes-de-stage/:id/accept`, acceptDemandeDeStageControll);



module.exports = router;


