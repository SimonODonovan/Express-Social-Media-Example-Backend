/**
 * Create an object with various response variables and functions.
 * @returns {Object}    - The mock response object.
 */
const mockResponse = () => {
    const res = {};
    res.status = (code) => { res.status = code; return res; };
    res.json = (body) => { res.body = body; return res; };
    return res;
};

export { mockResponse };