import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
})

export const User = model('Users', userSchema)
