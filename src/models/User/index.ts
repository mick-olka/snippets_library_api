import { Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

import * as crypt from '@/utils/crypt'

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Posts', default: [] }],
  saved: [{ type: Schema.Types.ObjectId, ref: 'Posts', default: [] }],
  about: { type: String, default: 'I am Dominik de-Koku' },
})

//  do not use arrow func as it uses lexical this
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
userSchema.pre('findOneAndUpdate', async function (next) {
  const updated: any = this.getUpdate()
  if (updated.pass) updated.pass = await crypt.hash(updated.pass)
  if (updated.posts) throw new Error('Can not update posts with this route')
  if (updated.email) throw Error("You can't change your email")
  this.update(updated)
  return next()
})

userSchema.plugin(paginate)

export const User = model<any, PaginateModel<any>>('Users', userSchema)
export const selectArgsMinimized = 'name email about'

// User.updateMany({ saved: { $exists: false } }, { saved: [] }, (err: any, docs: any) => {
//   if (err) console.log(err)
//   else console.log(docs)
// })
