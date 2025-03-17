const paginate = async (model, page = 1, limit = 10, query = {}, selectFields = '', sort = {}) => {
    try {
        const skip = (page - 1) * limit;
        const totalDocuments = await model.countDocuments(query);
        const totalPages = Math.ceil(totalDocuments / limit);

        const results = await model.find(query)
            .select(selectFields) 
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return {
            totalDocuments,
            currentPage: page,
            limit,
            totalPages,
            data: results
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = paginate;