import { Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const postSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  text: { type: String },
  public: { type: Boolean, default: true },
  tags: [{ type: String }],
  upvoters: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  downvoters: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
})

//  do not use arrow func as it uses lexical this
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
postSchema.pre('findOneAndUpdate', async function (next) {
  const updated: any = this.getUpdate()
  if (updated.upvoters || updated.downvoters) throw new Error('Can not update votes directly')
  this.update(updated)
  return next()
})

postSchema.plugin(paginate)

export const Post = model<any, PaginateModel<any>>('Posts', postSchema)
export const selectArgsMinimized = 'title subtitle author tags upvoters downvoters'
// Post.updateMany(
//   { downvoters: { $exists: false } },
//   { downvoters: [], upvoters: [] },
//   (err: any, docs: any) => {
//     if (err) console.log(err)
//     else console.log(docs)
//   },
// )
