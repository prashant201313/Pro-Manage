const express = require("express");
const { userSignUp, userSignIn, userLogout, updateUser, userDetails, getAllUsersExceptCurrent, getAssigneeDetails } = require("../controller/user");
const { createTask, allTasks, getTaskDetails, updateTaskChecklist, getAssignedTasks, updateTaskCategory, deleteTask, updateTask  } = require("../controller/task");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/user/signup", userSignUp);
router.post("/user/login", userSignIn);
router.get("/user/user-details", authMiddleware, userDetails);
router.put("/user/update-user", authMiddleware, updateUser);
router.get("/user/logout", userLogout);
router.get('/user/all-users-except-current', authMiddleware, getAllUsersExceptCurrent);

router.get('/assignee/:id', getAssigneeDetails);
router.get('/assigned/:userId', getAssignedTasks);

router.post("/task/create", authMiddleware, createTask);
router.get("/task/all-tasks", authMiddleware, allTasks);
router.post("/task/task-details", getTaskDetails);
router.put('/task/:taskId/checklist', updateTaskChecklist);
router.put('/task/update-category', updateTaskCategory);
router.post("/task/delete-task", authMiddleware, deleteTask);
router.put("/task/:taskId", authMiddleware, updateTask);

module.exports = router