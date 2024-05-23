const { getRepository } = require("typeorm");
const User = require("../models/User"); // Make sure to adjust this path to your User entity schema
const Intern = require('../models/Intern');
const Encadrant = require('../models/Encadrant');


let getUsersList = async () => {
    try {
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ['id', 'firstName', 'lastName', 'address', 'email', 'gender', 'role', 'relatedRoleId', 'resetToken']
        });

        const roleRepositoryMap = {
            intern: getRepository(Intern),
            encadrant: getRepository(Encadrant),
        };

        // Enrich each user with their related role
        const usersWithRelatedRoles = await Promise.all(users.map(async (user) => {
            const roleRepository = roleRepositoryMap[user.role];
            if (roleRepository) {
                const relatedRole = await roleRepository.findOne({
                    where: { id: user.relatedRoleId }
                });
                delete user.relatedRoleId;
                user.relatedRole = relatedRole || null; // Attach the related role or null if not found
            } else {
                delete user.relatedRoleId;
            }
            return user;
        }));

        return usersWithRelatedRoles;
    } catch (error) {
        throw new Error(error);
    }
};


let deleteUser = async (userId) => {
    try {
        const userRepository = getRepository(User);



        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found');
        }

        //first delete its related role
        const roleRepositoryMap = {
            intern: getRepository(Intern),
            encadrant: getRepository(Encadrant),
        };

        const roleRepository = roleRepositoryMap[user.role];
        if (roleRepository) {
            await roleRepository.delete({ user: userId });
        }


       

        await userRepository.delete(userId);

        return true;
    } catch (error) {
        throw new Error(error);
    }
};


let updateUser = async (userId, userData) => {
    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = await userRepository.save({
            ...user,
            ...userData
        });

        delete updatedUser.password; // Ensure password is not returned

        return updatedUser;
    } catch (error) {
        throw new Error(error);
    }
};

let updateUserRelatedRoleData = async (userId, relatedRoleData) => {
    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });
        console.log("User", user);
        if (!user) {
            throw new Error('User not found');
        }

        const roleRepositoryMap = {
            intern: getRepository(Intern),
            encadrant: getRepository(Encadrant),
        };

        const roleRepository = roleRepositoryMap[user.role];
        if (roleRepository) {
            const relatedRole = await roleRepository.findOne({ where: { id: user.relatedRoleId } });
            console.log("relatedRole", relatedRole);
            if (relatedRole) {
                await roleRepository.save({ ...relatedRole, ...relatedRoleData });
            } else {
                await roleRepository.save({ ...relatedRoleData, user: userId });
            }
        }

        return true;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// get user by id
let getUser = async (email) => {
    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { id } });
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

let getUserEmail = async (email) => {
    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { email }, select: ['id', 'firstName', 'lastName', 'email', 'role', 'address', 'CIN']});
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

// get user list by role
let getUserByRole = async (role) => {
    try {
        const userRepository = getRepository(User);
        // get all users with the specified role without their password
        const users = await userRepository.find({ where: { role }, select: ['id', 'firstName', 'lastName', 'email', 'role', 'address', 'CIN'] });
        //const users = await userRepository.find({ where: { role } });
        return users;
    } catch (error) {
        throw new Error(error);
    }
};


module.exports = {
    getUsersList,
    deleteUser,
    updateUser,
    updateUserRelatedRoleData,
    getUser,
    getUserByRole,
    getUserEmail
};