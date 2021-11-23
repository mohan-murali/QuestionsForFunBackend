import * as dotenv from 'dotenv';
import { Router } from 'express';
import { RequestWithBody } from '.';

dotenv.config();

const router = Router();


router.post('/test', async(req: RequestWithBody, res: Response) => {
    try{
        const { questions } = req.body;
    }
})