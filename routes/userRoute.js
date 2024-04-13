const express = require("express");
const Router = express.Router();
const userContrl = require("../controllers/userCtrl");
const authCtrl = require("../controllers/authCtrl");

/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     security:
 *       - JWT: []
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user. Must be unique.
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the user.
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming successful user creation.
 */

Router.post("/user/signup", userContrl.signup);

Router.post("/user/login", userContrl.login);

// Router.route.post('/signup', userContrl.signup).post('/login', userContrl.login)

/**
 * @swagger
 * securityDefinitions:
 *   JWT:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *     description: Enter JWT token in the format 'Bearer {token}'
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     security:
 *       - JWT: []
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Returns all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the response.
 *                 result:
 *                   type: integer
 *                   description: The total number of users returned.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the user.
 *                       name:
 *                         type: string
 *                         description: The name of the user.
 *                       email:
 *                         type: string
 *                         description: The email address of the user.
 *                       register_at:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the user registered.
 */

Router.get("/user", authCtrl.verifyToken, userContrl.getUser);

/**
 * @swagger
 * /api/v1/user:
 *   put:
 *     security:
 *       - JWT: []
 *     description: Update user info
 *     responses:
 *       200:
 *         description: Returns all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the response.
 *                 result:
 *                   type: integer
 *                   description: The total number of users returned.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the user.
 *                       name:
 *                         type: string
 *                         description: The name of the user.
 *                       email:
 *                         type: string
 *                         description: The email address of the user.
 *                       register_at:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the user registered.
 */

Router.put("/user", authCtrl.verifyToken, userContrl.updateUser);

module.exports = Router;
