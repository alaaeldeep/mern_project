/* express */
import express from "express";

/* route */
import {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router
    .route("/users")
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser);

export default router;
