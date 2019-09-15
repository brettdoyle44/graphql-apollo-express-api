import mongoose from 'mongoose'
import { hash } from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    email: String,
    username: String,
    name: String,
    createdAt: String,
    password: String
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      this.password = await hash(this.password, 10)
    } catch (err) {
      next(err)
    }
  }
  next()
})

export default mongoose.model('User', userSchema)
