import mongoose from 'mongoose'

export async function connectDB(url){
    return mongoose.connect(url)
}