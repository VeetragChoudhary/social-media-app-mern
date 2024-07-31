import path from "path"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { v2 as cloudinary } from "cloudinary" // importing v2 object as cloudinary

import connectMongoDB from "./db/database.js"
import authRouters from "./routes/auth.routes.js" // we can import it by any name because we exported it using export default
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js"

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
const PORT = process.env.PORT || 5000
const __dirname = path.resolve()

app.use(express.json({ limit: "5mb" })) // to parser req.body // limit shouldn't be too high to prevent DoS
app.use(cookieParser())

app.use("/api/auth", authRouters)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)


app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectMongoDB()
})
