const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Evaluation",
    tableName: "evaluations",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        comments: {
            type: "text",
            nullable: true
        },
        qualityOfStudentInternshipReport: {
            type: "varchar",
            nullable: true
        },
        experienceGained: {
            type: "varchar",
            nullable: true
        },
        presentation: {
            type: "varchar",
            nullable: true
        },
        visualPresentationAid: {
            type: "varchar",
            nullable: true
        },
        overall: {
            type: "varchar",
            nullable: true
        },
        note: {
            type: "int",
            nullable: true
        },
        createdAt: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP"
        },
    },

    relations: {
        stagiaire: {
            target: "User",
            type: "many-to-one",
            joinColumn: true,
            cascade: true,
            nullable: false
        },
        encadrant: {
            target: "Encadrant",
            type: "many-to-one",
            joinColumn: true,
            cascade: true,
            nullable: false
        },
    }

});
