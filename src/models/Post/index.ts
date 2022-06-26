import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  text: { type: String },
})

export const Post = model('Posts', userSchema)
