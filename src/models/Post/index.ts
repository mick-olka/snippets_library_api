import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  text: { type: String },
  public: { type: Boolean, default: true },
})

export const Post = model('Posts', userSchema)

// Post.updateMany({ public: { $exists: false } }, { public: true }, (err: any, docs: any) => {
//   if (err) console.log(err)
//   else console.log(docs)
// })
