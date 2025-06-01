import { Router } from "express";
import { createPost, getPostDetails, getPosts } from "../controllers/post.js";

const router = Router();

router.post('/create-post', createPost)
router.get('/get-posts', getPosts)
router.get('/get-post-details/:id', getPostDetails)

export default router;