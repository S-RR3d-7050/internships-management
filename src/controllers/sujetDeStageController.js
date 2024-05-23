const { sendResponse } = require('../helpers/responseHelper');

const {
    createSujetDeStage,
    getSujetDeStage,
    getSujetDeStagesList,
    updateSujetDeStage,
    deleteSujetDeStage,
    addDocumentToSujetDeStage,
    createSujetDeStageAndAddDocument
} = require('../services/sujetDeStageService');

const { createDocument,
    updateDocument,
 } = require('../services/documentService');

const addSujetDeStage = async (req, res) => {
    try {
        const sujetDeStageData = req.body;
        const sujetDeStage = await createSujetDeStage(sujetDeStageData);
        return sendResponse(res, 201, true, 'Sujet de stage created successfully', sujetDeStage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const getSujetDeStageById = async (req, res) => {
    try {
        const sujetDeStageId = req.params.id;
        const sujetDeStage = await getSujetDeStage(sujetDeStageId);
        if (!sujetDeStage) {
            return sendResponse(res, 404, false, 'Sujet de stage not found');
        }
        return sendResponse(res, 200, true, 'Sujet de stage retrieved successfully', sujetDeStage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const getSujetDeStages = async (req, res) => {
    try {
        const sujetDeStages = await getSujetDeStagesList();
        return sendResponse(res, 200, true, 'Sujet de stages retrieved successfully', sujetDeStages);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const updateSujetDeStageById = async (req, res) => {
    try {
        const sujetDeStageId = req.params.id;
        const sujetDeStageData = req.body;

        const updatedSujetDeStage = await updateSujetDeStage(sujetDeStageId, sujetDeStageData);
        return sendResponse(res, 200, true, 'Sujet de stage updated successfully', updatedSujetDeStage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const removeSujetDeStage = async (req, res) => {
    try {
        const sujetDeStageId = req.params.id;
        await deleteSujetDeStage(sujetDeStageId);
        return sendResponse(res, 200, true, 'Sujet de stage deleted successfully');
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

const addDocumentToSuj = async (req, res) => {
    //file upload logic, req.file contains the file
    try {
        const sujetDeStage = req.params.id;
        // console.log(req.file);
        // console.log(req.body);  
        try {
            const documentData = {
                nom: req.file.originalname,
                chemin: req.file.path,
                extension: req.file.mimetype,
                size: req.file.size,
                url: `http://localhost:8000/${req.file.filename}` // Construct the file URL

            }
            
            console.log(sujetDeStage);
            const addedDocument = await createDocument(documentData);
            // const documentData = req.body;
            const updatedSujetDeStage = await addDocumentToSujetDeStage(sujetDeStage, documentData);
            console.log(updatedSujetDeStage);
            addedDocument.relationShipId = updatedSujetDeStage.id;
            addedDocument.relationShipType = "SujetDeStage";

            updateDocument(addedDocument.id, addedDocument);
            
            return sendResponse(res, 200, true, 'Document added to demande de stage successfully', updatedSujetDeStage);
        } catch (error) {
            console.log(error);
        }
       
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}
/*
const createSujetDeStageAndAddDocument = async (req, res) => {
    try {
        const sujetDeStageData = req.body;
        const documentData = {
            nom: req.file.originalname,
            chemin: req.file.path,
            extension: req.file.mimetype,
            size: req.file.size
        }
        const sujetDeStage = await sujetDeStageService.createSujetDeStageAndAddDocument(sujetDeStageData, documentData);
        // RelationShip

        return sendResponse(res, 201, true, 'Sujet de stage created successfully', sujetDeStage);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}    
*/ 

module.exports = {
    addSujetDeStage,
    getSujetDeStageById,
    getSujetDeStages,
    updateSujetDeStageById,
    removeSujetDeStage,
    addDocumentToSuj
};