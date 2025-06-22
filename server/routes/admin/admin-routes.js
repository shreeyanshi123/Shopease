const express = require('express');
const router = express.Router();
const { addAdmin } = require('../../controllers/admin/admins-controller');

router.post('/add', addAdmin);

module.exports = router;
