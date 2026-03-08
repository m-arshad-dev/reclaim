function validateSearch(req, res, next){
    const {query} = req.query;
    if(!query || query.trim() === ''){
        return res.status(400).json({message : 'Title is requires'});
    }
    const cleanedQuery = query.trim();
    if(cleanedQuery.length < 3){
        return res.status(400).json({message : 'Title must be at least 3 characters long'});
    }
    req.query.query = cleanedQuery;
    next();
}

module.exports = validateSearch;