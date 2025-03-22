import { Hono } from 'hono'
import userRoute from './routes/userRoute'
import blogRoute from './routes/blogRoute'
import { cors } from 'hono/cors'
const app = new Hono()
app.use(cors(
   {
      origin: "*", // Or specify your frontend domain: "http://localhost:3000"
      allowHeaders: ["Authorization", "Content-Type"],
      allowMethods: ["GET", "POST", "PUT", "DELETE"],
   }
))
app.route("/user", userRoute)
app.route("/blog", blogRoute)

app.all("*", (c) => {
   return c.text("Route not found")
})

app.onError((err, c) => {
   // console.log(err)
   return c.json({ message: "Internal error", status: 500 })
})

export default app
