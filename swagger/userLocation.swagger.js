/**
 * @swagger
 * tags:
 *   name: User Location
 *   description: APIs to manage user saved locations (multiple addresses)
 */

/**
 * @swagger
 * /api/user-settings:
 *   post:
 *     summary: Save user locations
 *     description: |
 *       Saves user locations array.
 *       If user exists → adds new locations to array.
 *       If not → creates new document.
 *     tags: [User Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, savedLocations]
 *             properties:
 *               customerId:
 *                 type: number
 *                 example: 3
 *               savedLocations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Home
 *                     location:
 *                       type: object
 *                       properties:
 *                         address:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               formatted_address:
 *                                 type: string
 *                                 example: Munnekollal, Bangalore
 *                         geometry:
 *                           type: object
 *                           properties:
 *                             location:
 *                               type: object
 *                               properties:
 *                                 lat:
 *                                   type: number
 *                                   example: 12.9716
 *                                 lng:
 *                                   type: number
 *                                   example: 77.6387
 *                         place_id:
 *                           type: string
 *                           example: manual_12345
 *     responses:
 *       201:
 *         description: Location saved
 */

/**
 * @swagger
 * /api/user-settings/{customerId}:
 *   get:
 *     summary: Get user locations
 *     tags: [User Location]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: number
 *         example: 3
 *     responses:
 *       200:
 *         description: User's saved locations as a JSON array
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No document for this customerId
 */

/**
 * @swagger
 * /api/user-settings:
 *   get:
 *     summary: Get all user locations
 *     tags: [User Location]
 *     responses:
 *       200:
 *         description: List of all users' locations
 */

/**
 * @swagger
 * /api/user-settings/{customerId}:
 *   put:
 *     summary: Update user saved locations
 *     description: Replace full savedLocations array
 *     tags: [User Location]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: number
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               savedLocations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Office
 *                     location:
 *                       type: object
 *                       properties:
 *                         geometry:
 *                           type: object
 *                           properties:
 *                             location:
 *                               type: object
 *                               properties:
 *                                 lat:
 *                                   type: number
 *                                   example: 13.0000
 *                                 lng:
 *                                   type: number
 *                                   example: 77.6000
 *     responses:
 *       200:
 *         description: Locations updated
 */

/**
 * @swagger
 * /api/user-settings/{customerId}:
 *   delete:
 *     summary: Delete user locations
 *     description: Deletes entire user document
 *     tags: [User Location]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: number
 *         example: 3
 *     responses:
 *       200:
 *         description: Locations deleted
 */