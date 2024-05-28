const { sendResponse } = require('../helpers/responseHelper');

const {
    createDemandeDeStage,
    getDemandeDeStage,
    getDemandeDeStagesList,
    updateDemandeDeStage,
    deleteDemandeDeStage,
    demandeDeStageAddDocument,
    getDemandeDeStagesListWithStudentData,
    getDemandeDeStagesByStudentId,
    getDemandeDeStagesByStudentIdandData,
    getDemandeDeStagesListByEtatDemande,
    getDemandeDeStagesByEncadrantId,acceptDemandeDeStage,refuseDemandeDeStage,isStagiaire
} = require('../services/demandeDeStageService');


const { createDocument,
    updateDocument,
 } = require('../services/documentService');

const {
    getFileName
} = require('../helpers/formatHelper');

const addDemandeDeStage = async (req, res) => {
    try {
        const demandeDeStageData = req.body;
        const demandeDeStage = await createDemandeDeStage(demandeDeStageData);
        return sendResponse(res, 201, true, 'Demande de stage created successfully', demandeDeStage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const getDemandeDeStageById = async (req, res) => {
    try {
        const demandeDeStageId = req.params.id;
        const demandeDeStage = await getDemandeDeStage(demandeDeStageId);
        if (!demandeDeStage) {
            return sendResponse(res, 404, false, 'Demande de stage not found');
        }
        return sendResponse(res, 200, true, 'Demande de stage retrieved successfully', demandeDeStage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const getDemandeDeStages = async (req, res) => {
    try {
        const demandeDeStages = await getDemandeDeStagesList();
        console.log(demandeDeStages.length);
        return sendResponse(res, 200, true, 'Demande de stages retrieved successfully', demandeDeStages);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const updateDemandeDeStageById = async (req, res) => {
    try {
        const demandeDeStageId = req.params.id;
        const demandeDeStageData = req.body;

        const updatedDemandeDeStage = await updateDemandeDeStage(demandeDeStageId, demandeDeStageData);
        return sendResponse(res, 200, true, 'Demande de stage updated successfully', updatedDemandeDeStage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const acceptDemandeDeStageControll = async (req, res) => {
    try {
        const demandeDeStageId = req.params.id;
        const demandeDeStageData = req.body;
        const updatedDemandeDeStage = await acceptDemandeDeStage(demandeDeStageId, demandeDeStageData);
        return sendResponse(res, 200, true, 'Demande de stage accepted successfully', updatedDemandeDeStage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const refuseDemandeDeStageControll = async (req, res) => {
    try {
        const demandeDeStageId = req.params.id;
        const updatedDemandeDeStage = await refuseDemandeDeStage(demandeDeStageId);
        return sendResponse(res, 200, true, 'Demande de stage refused successfully', updatedDemandeDeStage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const removeDemandeDeStage = async (req, res) => {
    try {
        const demandeDeStageId = req.params.id;
        await deleteDemandeDeStage(demandeDeStageId);
        return sendResponse(res, 200, true, 'Demande de stage deleted successfully');
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const addDocumentToDemandeDeStage = async (req, res) => {
    try {
        const demandeDeStageId = req.params.id;
        
        // Build the document data including the URL
        const documentData = {
            nom: req.file.originalname,
            chemin: req.file.path,
            extension: req.file.mimetype,
            size: req.file.size,
            url: `http://localhost:8000/${req.file.filename}` // Construct the file URL
        };
        
        console.log(documentData);
        
        const addedDocument = await createDocument(documentData);
        const updatedDemandeDeStage = await demandeDeStageAddDocument(demandeDeStageId, documentData);
        
        console.log(updatedDemandeDeStage);
        
        addedDocument.relationShipId = updatedDemandeDeStage.id;
        addedDocument.relationShipType = "DemandeDeStage";
        
        updateDocument(addedDocument.id, addedDocument);
        
        return sendResponse(res, 200, true, 'Document added to demande de stage successfully', updatedDemandeDeStage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const getDemandeDeStagesByStudentIdControll = async (req, res) => {
    try {
        const studentId = req.params.id;
        const demandeDeStages = await getDemandeDeStagesByStudentId(studentId);
        return sendResponse(res, 200, true, 'Demande de stages retrieved successfully', demandeDeStages);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const getDemandeDeStagesListWithStudentDataControll = async (req, res) => {
    try {
        const demandeDeStages = await getDemandeDeStagesListWithStudentData();
        return sendResponse(res, 200, true, 'Demande de stages retrieved successfully', demandeDeStages);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const getDemandeDeStagesByStudentIdAndDataControll = async (req, res) => {
    try {
        const studentId = req.params.id;
        const demandeDeStages = await getDemandeDeStagesByStudentIdandData(studentId);
        return sendResponse(res, 200, true, 'Demande de stages retrieved successfully', demandeDeStages);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const getDemandeDeStagesListByEtatDemandeControll = async (req, res) => {
    try {
        const etatDemande = req.params.etatDemande;
        const demandeDeStages = await getDemandeDeStagesListByEtatDemande(etatDemande);
        return sendResponse(res, 200, true, 'Demande de stages retrieved successfully', demandeDeStages);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const getDemandeDeStagesByEncadrantIdControll = async (req, res) => {
    try {
        const encadrantId = req.params.id;
        const demandeDeStages = await getDemandeDeStagesByEncadrantId(encadrantId);
        return sendResponse(res, 200, true, 'Demande de stages retrieved successfully', demandeDeStages);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


const defineIsStagiaire = async (req, res ) => {
    try {
        const studentId = req.params.id;
        const demandeDeStages = await isStagiaire(studentId);
        //req.isStagiaire = demandeDeStages;
        //next();
        return sendResponse(res, 200, true, 'Demande de stages retrieved successfully', demandeDeStages);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


module.exports = {
    addDemandeDeStage,
    getDemandeDeStageById,
    getDemandeDeStages,
    updateDemandeDeStageById,
    removeDemandeDeStage,
    addDocumentToDemandeDeStage,
    getDemandeDeStagesListWithStudentDataControll,
    getDemandeDeStagesByStudentIdControll,
    getDemandeDeStagesByStudentIdAndDataControll,
    getDemandeDeStagesListByEtatDemandeControll,
    getDemandeDeStagesByEncadrantIdControll,
    acceptDemandeDeStageControll,
    refuseDemandeDeStageControll,
    defineIsStagiaire

};