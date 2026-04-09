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
 *             oneOf:
 *               - type: object
 *                 required: [customerId, savedLocations]
 *                 properties:
 *                   customerId:
 *                     type: number
 *                     example: 54
 *                   savedLocations:
 *                     type: array
 *                     items:
 *                       type: object
 *               - type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [customerId, savedLocations]
 *                   properties:
 *                     customerId:
 *                       type: number
 *                       example: 54
 *                     savedLocations:
 *                       type: array
 *                       items:
 *                         type: object
 *           examples:
 *             wrapped:
 *               summary: Array with one user-settings object (common client shape)
 *               value:
 *                 - customerId: 54
 *                   savedLocations:
 *                     - name: home
 *                       location:
 *                         address: []
 *                         lat: 26.8009375
 *                         lng: 88.33268749999999
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
 *         description: |
 *           Single-element array with the user document (`_id`, `customerId`, `savedLocations`).
 *           Preserves nested `location` objects (e.g. Google-style `address`, `lat`/`lng`) as stored.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               minItems: 1
 *               maxItems: 1
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   customerId:
 *                     type: number
 *                   savedLocations:
 *                     type: array
 *                     items:
 *                       type: object
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