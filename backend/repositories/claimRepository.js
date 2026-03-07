const db = require('../db');
class ClaimRepository{
    async getClaimsByItem(itemId){
        const result = await db.query(`
            select c.id as claim_id, u.full_name as claimant_name,c.verification_answer, c.status
            from claims c
            join users u on claimant_id = u.id
            where c.item_id = $1
            order by c.created_at asc
            `,
            [itemId]
        );
        return result.rows;
    }

    async updateClaimStatus(claimId, status){
        const result = await db.query(`
            update claims
            set status = $1,
            updated_at = current_timestamp
            where id = $2
            returning *`,
        [status, claimId]);
        return result.rows[0];    
    }
}

module.exports = new ClaimRepository();