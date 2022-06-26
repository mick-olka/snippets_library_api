import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
  author: { type: String, required: true },
  text: { type: String },
})

export const Post = model('Posts', userSchema)
