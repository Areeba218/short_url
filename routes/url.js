import express from 'express'
import {shorturl} from '../controllers/url.js'


 const router=express.Router();

router.post('/',shorturl)

 export default router;