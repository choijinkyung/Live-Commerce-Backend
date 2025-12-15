import { Router, Response, Request } from "express";
import liveRouter from "./live-session/live.controller";

const router = Router();


router.use('/live', liveRouter)
router.get('/', (req, res) => {
    res.json({message:'good'})
})
export default router;