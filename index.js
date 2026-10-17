import express from 'express';
import {connectDB} from './connect.js'
import router from './routes/url.js'
import { redirectUrl } from './controllers/url.js'
// import {router as urlRoute} from './routes/url.js'
// app.use('/url',urlRoute)
const app=express();
app.use(express.json())
const PORT=8001;
connectDB('mongodb+srv://umair:umair@cluster0.vpd8g8y.mongodb.net/MehakUmair').then(()=>console. log("Mongo db connected."))
app.use('/url',router)
app.get('/:shortId', redirectUrl)
app.listen(PORT,()=> console.log(`Server started at PORT ${PORT}`));
