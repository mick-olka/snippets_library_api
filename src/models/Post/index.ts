import { Schema, model, PaginateModel } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const postSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  text: { type: String },
  public: { type: Boolean, default: true },
  tags: [{ type: String }],
})

postSchema.plugin(paginate)

export const Post = model<any, PaginateModel<any>>('Posts', postSchema)

// Post.updateMany({ tags: { $exists: false } }, { tags: [] }, (err: any, docs: any) => {
//   if (err) console.log(err)
//   else console.log(docs)
// })
