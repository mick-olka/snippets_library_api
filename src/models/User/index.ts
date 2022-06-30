import { Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Posts', default: [] }],
})

userSchema.plugin(paginate)

export const User = model<any, PaginateModel<any>>('Users', userSchema)

// User.updateMany({ enabled: { $exists: false } }, { posts: [] }, (err: any, docs: any) => {
//   if (err) console.log(err)
//   else console.log(docs)
// })
