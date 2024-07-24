import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateToken.js"

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    const exisingUser = await User.findOne({ username })
    if (exisingUser) {
      return res.status(400).json({ error: "Username is already taken" })
    }

    const exisingEmail = await User.findOne({ email })
    if (exisingEmail) {
      return res.status(400).json({ error: "Email is already taken" })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    })

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save()

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        following: newUser.following,
        followers: newUser.followers,
        profilePic: newUser.profilePic,
        coverImg: newUser.coverImg,
      })
    } else {
      return res.status(400).json({ error: "Invalid user data" })
    }
  } catch (error) {
    console.log("Error in signup controller", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ error: "Invalid username" })
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password)
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" })
    }

    generateTokenAndSetCookie(user._id, res)

    return res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      following: user.following,
      followers: user.followers,
      profilePic: user.profilePic,
      coverImg: user.coverImg,
    })
  } catch (error) {
    console.log("Error in login controller", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.log("Error in logout controller", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.status(200).json(user)
  } catch (error) {
    console.log("Error in getMe controller", error)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
