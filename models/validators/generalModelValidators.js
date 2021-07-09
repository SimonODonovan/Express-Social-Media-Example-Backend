import mongoose from "mongoose";

/**
 * Check the existence of an ObjectId in a given Model name.
 * @param {String} modelName    - Model name to lookup.
 * @param {ObjectId} refId      - ObjectId to find inside Model.
 * @returns {Promise}           - Boolean ObjectId exists in Model.
 */
const isValidRef = async (modelName, refId) => {
    const conn = mongoose.connection;
    const existingModels = conn.modelNames();
    if (!(existingModels.includes(modelName)))
        return false;
    const model = conn.model(modelName);
    const document = await model.findById(refId);
    return document ? true : false;
};

/**
 * Check the existence of all ObjectIds in a given Model name.
 * @param {String} modelName    - Model name to lookup.
 * @param {[ObjectId]} refIds   - ObjectId array to find inside Model.
 * @returns {Promise}           - Boolean all ObjectId exists in Model.
 */
const areValidRefs = async (modelName, refIds) => {
    for (const refId of refIds) {
        const validRef = await isValidRef(modelName, refId);
        if (!validRef)
            return false;
    }
    return true;
};

export { isValidRef, areValidRefs };