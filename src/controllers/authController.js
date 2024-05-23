const { sendResponse } = require('../helpers/responseHelper');

const {
    validateUser,
    initializeUser,
    extractUserDataFromRequest,
    verifyEmailAddresUniqueness,
    assignModelBasedOnRole,
    generateResetToken
} = require('../helpers/authHelper');

const {
    createUser,
    getUser,
    // saveUserRefreshToken,
    // checkForUserRefreshTokenAndRemoveIt,
    // getUserWithIdAndRefreshToken,
    updateUserRelatedRoleId,
    returnUserWithItsRelatedRole,
    updateUserResetToken,
    updateUserPassword,
} = require('../services/authService');

const { getUserByResetToken } = require('../services/authService');

const {
    hashPassword,
    comparePassword
} = require('../helpers/encryptionHelper');

const {
    generateAccessToken,
    // generateRefreshToken,
    // isTokenExpired,
    // verifyToken
} = require('../helpers/tokenHelper');

const { sendResetPasswordEmail, passwordChangedEmail, RespondToContactUs } = require("../config/mailerConfig");

const signupUser = async (req, res) => {
    try {
        const userData = extractUserDataFromRequest(req);
        const { error } = validateUser(userData);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        const isEmailUnique = await verifyEmailAddresUniqueness(userData.email);
        if (!isEmailUnique) {
            return sendResponse(res, 400, false, 'Email already exists');
        }

        // Initialize user and hash password directly in the object to avoid re-assignment
        let user = {
            ...initializeUser(userData),
            password: await hashPassword(userData.password)
        };

        user = await createUser(user);

        // Simplify role handling and assignment model creation
        if (user.role !== "admin") {
            const assignedModel = await assignModelBasedOnRole(user.role, user.id);
            console.log(assignedModel);

            // Only update the user if an assigned model is created
            if (assignedModel) {
                user = await updateUserRelatedRoleId(user.id, assignedModel.id);
            }
        }

        user = await returnUserWithItsRelatedRole(user.id, user.role);
        delete user.password; // Ensure password is not returned

        return sendResponse(res, 201, true, 'User created successfully', user);
    } catch (err) {
        console.error(err); // Use console.error for errors
        return res.status(500).send({"Error": "Internal Server Error"});
    }
};

let loginUser = async (req, res) => {
    try {
        let user = await getUser(req.body.email);
        if (!user) {
            return sendResponse(res, 400, false, 'Invalid email or password');
        }

        const validPassword = await comparePassword(req.body.password, user.password);
        if (!validPassword) {
            return sendResponse(res, 400, false, 'Invalid email or password');
        }

        const accessToken = generateAccessToken(user);
        // const refreshToken = generateRefreshToken(user);

        // user = await saveUserRefreshToken(user._id, refreshToken);

        // remove the pass from user 
        delete user.password;

        return sendResponse(res, 200, true, { user, accessToken }, 'User logged in successfully');
    } catch (err) {
        console.log(err)
        res.status(500).send({"Error": "Internal Server Error"})
    }
}


let testIsAdmin = async (req, res) => {
    return sendResponse(res, 200, true, null, 'User is admin');
}

let testIsFormer = async (req, res) => {
    return sendResponse(res, 200, true, null, 'User is former');
}


// Create Reset Password Controller here
let resetPassword = async (req, res) => {
    try {
        const { token } = req.body;
        const { password } = req.body;

        const user = await getUserByResetToken(token);
        if (!user) {
            return sendResponse(res, 400, false, 'Invalid reset token');
        }
        // Hash the new password
        const hashedPassword = await hashPassword(password);

        // Update the user's password
        await updateUserPassword(user.id, hashedPassword);
        // Send email to user that password has been reset
        passwordChangedEmail(user.email);

        // Simulate resetting the password
        return sendResponse(res, 200, true, null, 'Password has been reset successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send({"Error": "Internal Server Error"});
    }
}

// Create Forgot Password Controller here
let forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await getUser(email);

        if (!user) {
            return sendResponse(res, 400, false, 'User not found');
        }

        const resetToken = await generateResetToken();
        await updateUserResetToken(user.id, resetToken);
        // Send email with reset token
        sendResetPasswordEmail(email, resetToken);

        // Simulate sending the reset token
        return sendResponse(res, 200, true, { resetToken }, 'Reset token sent successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send({"Error": "Internal Server Error"});
    }
}

// Controller for handling Contact Us form submission
 let contactUs = async (req, res) => {
    try {
        // Extract form data from request body
        const { name, email, subject, message } = req.body;

        // Simulate form submission
        RespondToContactUs(name, email);
        return sendResponse(res, 200, true, null, 'Your message has been sent successfully.');
    } catch (error) {
        console.log(error);
        res.status(500).send({"Error": "Internal Server Error"});
    }
}


module.exports = {
    signupUser,
    loginUser,
    // logoutUser,
    // handleRefreshAccessToken,
    testIsAdmin,
    testIsFormer,
    resetPassword,
    forgotPassword,
    contactUs
}