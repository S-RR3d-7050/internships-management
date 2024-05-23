const { getRepository } = require("typeorm");
const SujetDeStage = require("../models/SujetDeStage");
const { getSpeceficSujetDeStageDocument } = require("./documentService");


let createSujetDeStage = async (data) => {
    try {
        const sujetDeStageRepository = getRepository(SujetDeStage);
        let sujetDeStage = sujetDeStageRepository.create(data);
        return await sujetDeStageRepository.save(sujetDeStage);
    } catch (error) {
        throw new Error(error);
    }
}

let getSujetDeStage = async (id) => {
    try {
        const sujetDeStageRepository = getRepository(SujetDeStage);
        //return await sujetDeStageRepository.findOne({ where: { id } , relations: ["documents"]});

        let sujetDeStage = await sujetDeStageRepository.findOne({ where: { id } });
        const doc = await getSpeceficSujetDeStageDocument(sujetDeStage.id);
        sujetDeStage.document = doc;
        return sujetDeStage;

    } catch (error) {
        throw new Error(error);
    }
}

let getSujetDeStagesList = async () => {
    try {
        const sujetDeStageRepository = getRepository(SujetDeStage);
        //return await sujetDeStageRepository.find();
        let sujetDeStages = await sujetDeStageRepository.find();
        const promises = sujetDeStages.map(async (sujetDeStage) => {
            const doc = await getSpeceficSujetDeStageDocument(sujetDeStage.id);
            sujetDeStage.document = doc;
            return sujetDeStage;
        }   );
        sujetDeStages = await Promise.all(promises);
        return sujetDeStages;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

let updateSujetDeStage = async (id, data) => {
    try {
        const sujetDeStageRepository = getRepository(SujetDeStage);
        await sujetDeStageRepository.update(id, data);
        return await sujetDeStageRepository.findOne({ where: { id } });
    } catch (error) {
        throw new Error(error);
    }
}


let deleteSujetDeStage = async (id) => {
    try {
        const sujetDeStageRepository = getRepository(SujetDeStage);
        await sujetDeStageRepository.delete(id);
    } catch (error) {
        throw new Error(error);
    }
}



let addDocumentToSujetDeStage = async (id, document) => {
        try {
            const sujetDeStageRepository = getRepository(SujetDeStage);
            const sujetDeStage = await sujetDeStageRepository.findOne({ where: { id } });
    
            if (!sujetDeStage) {
                throw new Error("sujetDeStage de stage not found");
            }
    
            sujetDeStage.document = document;
            return await sujetDeStageRepository.save(sujetDeStage);
        } catch (error) {
            throw new Error(error);
        }
}

// Create a new sujetDeStage and add a document to it in the same time
let createSujetDeStageAndAddDocument = async (sujetDeStageData, document) => {
    try {
        const sujetDeStageRepository = getRepository(SujetDeStage);
        let sujetDeStage = sujetDeStageRepository.create(sujetDeStageData);
        sujetDeStage.document = document;
        return await sujetDeStageRepository.save(sujetDeStage);
    } catch (error) {
        throw new Error(error);
    }
}


module.exports = {
    createSujetDeStage,
    getSujetDeStage,
    getSujetDeStagesList,
    updateSujetDeStage,
    deleteSujetDeStage,
    addDocumentToSujetDeStage,
    createSujetDeStageAndAddDocument
};

