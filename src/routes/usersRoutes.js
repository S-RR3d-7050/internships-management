const express = require('express');
var router = express.Router();

const {
    getUsers ,
    removeUser,
    editUser,
    editUserRelatedRole,
    getUserById,
    getUserListByRole,
    getUserByEmail
} = require('../controllers/usersController');


router.get(`/users`, getUsers);
router.delete(`/users/:id`, removeUser);
router.put(`/users/:id`, editUser);
router.put(`/users/:id/related-role`, editUserRelatedRole);
router.get(`/users/:id`, getUserById);
router.get(`/users/role/:role`, getUserListByRole);
router.get(`/users/email/:email`, getUserByEmail)


module.exports = router;