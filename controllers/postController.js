import Post from '../models/postModel.js';
import RESPONSE_CODES from '../constants/responseCodes.js';

const getUserPosts = (req, res) => {
    const uid = req.params.uid;
    console.log(uid);
}

const createUserPost = (req, res) => {

}

export { getUserPosts, createUserPost }