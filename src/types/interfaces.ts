export interface UserRegistrationI {
  alias: string
  email: string
  hash: string
  password: string
}

export interface UserI {
  _id: string
  name: string
  alias: string
  email: string
  about: string
  password: string
  posts: string[]
  saves: string[]
}

export interface PostI {
  _id: string
  title: string
  subtitle: string
  text: string
  author: string
  public: boolean
  upvoters: string[]
  downvoters: string[]
}
