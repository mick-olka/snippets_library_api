import mongoose, { Schema, model } from 'mongoose'

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Posts', default: [] }],
})

export const User = model('Users', userSchema)

// User.updateMany({ enabled: { $exists: false } }, { posts: [] }, (err: any, docs: any) => {
//   if (err) console.log(err)
//   else console.log(docs)
// })
