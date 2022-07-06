export interface UserRegistrationI {
  name: string
  email: string
  hash: string
  password: string
}

export interface UserI {
  _id: string
  name: string
  email: string
  about: string
  password: string
  posts: string[]
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
