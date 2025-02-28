import { Hono } from 'hono'
import userRoute from './routes/userRoute'
import blogRoute from './routes/blogRoute'

const app = new Hono()

app.route("/user", userRoute)
app.route("/blog", blogRoute)

app.all("*", (c) => {
   return c.text("Route not found")
})

app.onError( (err, c) => {
   console.log(err)
   return c.json({message: "Internal error", status: 500})
})

export default app
