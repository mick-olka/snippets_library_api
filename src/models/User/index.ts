import { Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

import CONFIG from '@/config'
import * as crypt from '@/utils/crypt'

const preparePhotoLink = (photo: string) => {
  return CONFIG.APP.BASE_URL + '/uploads/' + photo
}

const userSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String, default: null, get: preparePhotoLink },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Posts', default: [] }],
    about: { type: String, default: 'I am Dominik de-Koku' },
  },
  {
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  },
)

//  do not use arrow func as it uses lexical this
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
userSchema.pre('findOneAndUpdate', async function (next) {
  const updated: any = this.getUpdate()
  if (updated.password) updated.password = await crypt.hash(updated.password)
  if (updated.posts) throw new Error('Can not update posts with this route')
  if (updated.email) throw Error("You can't change your email")
  this.update(updated)
  return next()
})

userSchema.plugin(paginate)

export const User = model<any, PaginateModel<any>>('Users', userSchema)
export const selectArgsMinimized = 'name email photo'
export const selectUserWithoutPosts = 'name email about photo'

// User.updateMany({}, { $rename: { password: 'pass' } }, (err: any, docs: any) => {
//   if (err) console.log(err)
//   else console.log(docs)
// })
