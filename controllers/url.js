import { nanoid } from 'nanoid';
import {URL} from '../models/url.js';


export async function shorturl(req,res){
    const body=req.body;
    if(!body.url) return res.status(400).json({error:"url is required"})
const shortId=nanoid(8);

await URL.create({
    shortId:shortId,
    redirectURL:body.url,
    visitHistory:[]
})
    return res.json({id:shortId,message:"short url created"})
}

export async function redirectUrl(req, res) {
  const entry = await URL.findOneAndUpdate(
    { shortId: req.params.shortId },
    { $push: { visitHistory: { timeStamp: Date.now() } } }
  );
  if (!entry) return res.status(404).json({ error: 'link not found' });
  res.redirect(entry.redirectURL);
}