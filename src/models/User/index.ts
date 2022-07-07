import { Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

import CONFIG from '@/config'
import * as crypt from '@/utils/crypt'

const preparePhotoLink = (photo: string | null) => {
  if (photo) return CONFIG.APP.BASE_URL + '/uploads/' + photo
  return null
}

const userSchema = new Schema(
  {
    alias: { type: String, required: true, unique: true, max: 64 },
    name: { type: String, default: null, max: 64 },
    email: { type: String, required: true, unique: true, max: 256 },
    password: { type: String, required: true },
    photo: { type: String, default: null, get: preparePhotoLink },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Posts', default: [] }],
    saves: [{ type: Schema.Types.ObjectId, ref: 'Posts', default: [] }],
    about: { type: String, default: null, max: 2048 },
    status: { type: String, default: null, max: 32 },
    contacts: {
      phone: { type: String, default: null, max: 32 },
      linkedin: { type: String, default: null, max: 256 },
      telegram: { type: String, default: null, max: 256 },
      instagram: { type: String, default: null, max: 256 },
      site: { type: String, default: null, max: 256 },
      other: { type: String, default: null, max: 2048 },
    },
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
export const selectArgsMinimized = 'alias name email photo status'
export const selectUserWithoutPosts = 'alias name email photo about contacts status'

// User.updateMany({ saves: { $exists: false } }, { saves: [] }, (err: any, docs: any) => {
//   if (err) console.log(err)
//   else console.log(docs)
// })
