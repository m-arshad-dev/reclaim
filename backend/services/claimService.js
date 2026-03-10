const claimRepository = require('../repositories/claimRepository');

class ClaimService{

    async getClaimsByItem(itemId){
        return await claimRepository.getClaimsByItem(itemId);
    }

    // ADDED: this method handles business logic for creating a claim
    // It receives item_id, claimant_id and verification_answer from controller
    async createClaim(itemId, claimantId, verificationAnswer){

        // call repository to insert claim into database
        return await claimRepository.createClaim(
            itemId,
            claimantId,
            verificationAnswer
        );
    }

    async approveClaim(claimId){
        return await claimRepository.updateClaimStatus(claimId,'approved');
    }

    async rejectClaim(claimId){
        return await claimRepository.updateClaimStatus(claimId,'rejected');
    }
}

module.exports = new ClaimService();