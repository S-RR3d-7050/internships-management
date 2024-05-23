const { getRepository } = require("typeorm");
const DemandeDeStage = require("../models/DemandeDeStage"); // Make sure to adjust this path to your DemandeDeStage entity schema
const { getSpeceficDemandeDeStageDocument } = require("./documentService");
const { sendEmail } = require("../config/mailerConfig");

let createDemandeDeStage = async (data) => {

    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        let demandeDeStage = demandeDeStageRepository.create(data);
        return await demandeDeStageRepository.save(demandeDeStage);
    } catch (error) {
        throw new Error(error);
    }
}


let getDemandeDeStage = async (id) => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        let dem = await demandeDeStageRepository.findOne({ where: { id }, relations: ['stagiaire', 'sujetDeStage', 'encadrant'], });
        const doc = await getSpeceficDemandeDeStageDocument(id);
        dem.document = doc;
        return dem;
    } catch (error) {

        throw new Error(error);
    }
}
let getDemandeDeStagesList = async () => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        let demandeDeStages = await demandeDeStageRepository.find();

        const promises = demandeDeStages.map(async (demandeDeStage) => {
            const doc = await getSpeceficDemandeDeStageDocument(demandeDeStage.id);
            demandeDeStage.document = doc;
            return demandeDeStage;
        });

        demandeDeStages = await Promise.all(promises);

        return demandeDeStages;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

let updateDemandeDeStage = async (id, data) => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        await demandeDeStageRepository.update(id, data);
        return await demandeDeStageRepository.findOne({ where: { id } });
    } catch (error) {
        throw new Error(error);
    }
}

// Accept demande de stage
let acceptDemandeDeStage = async (id, data) => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        data = { ...data, etat: 'ACCEPTEE' };
        await demandeDeStageRepository.update(id, data);
        const updatedDemande = await demandeDeStageRepository.findOne({ where: { id },relations: ['stagiaire'] });
        const fullName = updatedDemande.stagiaire.firstName + ' ' + updatedDemande.stagiaire.lastName;
        sendEmail(updatedDemande.stagiaire.email, fullName, 'accepted');
        return updatedDemande;
    } catch (error) {
        throw new Error(error);
    }
}

// Refuse demande de stage
let refuseDemandeDeStage = async (id) => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        await demandeDeStageRepository.update(id, { etat: 'REFUSEE' });
        const updatedDemande = await demandeDeStageRepository.findOne({ where: { id }, relations: ['stagiaire'] });
        const fullName = updatedDemande.stagiaire.firstName + ' ' + updatedDemande.stagiaire.lastName;
        sendEmail(updatedDemande.stagiaire.email, fullName, 'rejected');
        return updatedDemande;
    } catch (error) {
        throw new Error(error);
    }
}



let deleteDemandeDeStage = async (id) => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        await demandeDeStageRepository.delete(id);
    } catch (error) {
        throw new Error(error);
    }
}

let demandeDeStageAddDocument = async (id, document) => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        const demandeDeStage = await demandeDeStageRepository.findOne({ where: { id } });

        if (!demandeDeStage) {
            throw new Error("Demande de stage not found");
        }

        demandeDeStage.document = document;
        return await demandeDeStageRepository.save(demandeDeStage);
    } catch (error) {
        throw new Error(error);
    }
}

// Get demandes de stage by student id
let getDemandeDeStagesByStudentId = async (stagiaireId) => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        let demandes =  await demandeDeStageRepository.find({ where : { etat: 'ACCEPTEE' },relations: ['encadrant', 'stagiaire', 'sujetDeStage'] });
        demandes = demandes.filter(demande => demande.stagiaire.id == stagiaireId);
        return demandes;
    } catch (error) {
        throw new Error(error);
    }
}

// Get demandes de stage and the student data also
let getDemandeDeStagesListWithStudentData = async () => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        let demandeDeStages = await demandeDeStageRepository.find({ relations: ['stagiaire'] });

        const promises = demandeDeStages.map(async (demandeDeStage) => {
            const doc = await getSpeceficDemandeDeStageDocument(demandeDeStage.id);
            demandeDeStage.document = doc;
            return demandeDeStage;
        });

        demandeDeStages = await Promise.all(promises);

        return demandeDeStages;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}
// Get demandes de stage of a specific student and include the student data
let getDemandeDeStagesByStudentIdandData = async (studentId) => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        return await demandeDeStageRepository.find({ where: { stagiaireId: studentId }, relations: ['stagiaire' , 'sujetDeStage'] });
    } catch (error) {
        throw new Error(error);
    }
}

//  Get demandes de stage and include the student data based on the EtatDemande
let getDemandeDeStagesListByEtatDemande = async (etatDemande) => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        return await demandeDeStageRepository.find({ where: { etat: etatDemande }, relations: ['stagiaire', 'sujetDeStage'],  });
    } catch (error) {
        throw new Error(error);
    }
}

// get demandes de stage by encadrant id
let getDemandeDeStagesByEncadrantId = async (encadrantId) => {
    try {
        const demandeDeStageRepository = getRepository(DemandeDeStage);
        // encadrantId is the id of the encadrant but he doesn't exist in the demandeDeStage model so we need to filter them manually
        let demandes =  await demandeDeStageRepository.find({ where: {etat: 'ACCEPTEE' }, relations: ['encadrant', 'stagiaire', 'sujetDeStage'] });
        // We need now to loop through the demandes and filter them by the encadrantId
        demandes = demandes.filter(demande => demande.encadrant.id == encadrantId);
        return demandes;

    } catch (error) {
        throw new Error(error);
    }
}


module.exports = {
    createDemandeDeStage,
    getDemandeDeStage,
    getDemandeDeStagesList,
    updateDemandeDeStage,
    deleteDemandeDeStage,
    demandeDeStageAddDocument,
    getDemandeDeStagesByStudentId,
    getDemandeDeStagesListWithStudentData,
    getDemandeDeStagesByStudentIdandData,
    getDemandeDeStagesListByEtatDemande,
    getDemandeDeStagesByEncadrantId,
    acceptDemandeDeStage,
    refuseDemandeDeStage

}