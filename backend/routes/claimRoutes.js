const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');

// ADDED: route to allow users to submit a claim for an item
// This connects POST /api/claims to claimController.createClaim()
router.post('/', claimController.createClaim);

router.get('/item/:itemId', claimController.getClaimsByItem);

router.patch('/:id/approve', claimController.approveClaim);

router.patch('/:id/reject', claimController.rejectClaim);

module.exports = router;