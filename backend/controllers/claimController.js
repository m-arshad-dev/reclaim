const claimService = require('../services/claimService');
class ClaimController{
    async getClaimsByItem(req, res){
        const {itemId} = req.params;
        try{
            const claims = await claimService.getClaimsByItem(itemId);
            res.status(200).json(claims);
        }catch(error){
            res.status(500).json({error: error.message});
        }
    }
    async approveClaim(req, res){
        const {id} = req.params;
        try{
            const updatedClaim = await claimService.approveClaim(id);
            res.status(200).json(updatedClaim);
        }
        catch(error){
            res.status(500).json({error: error.message});
        }
    }

    async rejectClaim(req, res){
        const {id} = req.params;
        try{
            const updatedClaim = await claimService.rejectClaim(id);
            res.status(200).json(updatedClaim);
        }
        catch(error){
            res.status(500).json({error: error.message});
        }
    }
}
module.exports = new ClaimController();

