const claimRepository = require('../repositories/claimRepository');
class ClaimService{
    async getClaimsByItem(itemId){
        return await claimRepository.getClaimsByItem(itemId);
    }
    async approveClaim(claimId){
        return await claimRepository.updateClaimStatus(claimId,'approved');
    }
    async rejectClaim(claimId){
        return await claimRepository.updateClaimStatus(claimId,'rejected');
    }
}
module.exports = new ClaimService();