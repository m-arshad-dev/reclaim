const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');

router.get('/item/:itemId',claimController.getClaimsByItem);

router.patch('/:id/approve', claimController.approveClaim);

router.patch('/:id/reject', claimController.rejectClaim);

module.exports = router;