import { Context, Next } from "hono";
// import { verify, } from "jsonwebtoken"
import { Credentials } from "@codersubham/validuser";
import { verify } from "hono/jwt";


export const checkUserLoggedIn = async (c: Context, next: Next) => {
    try {
        const token = c.req.header("Authorization")
        if (token) {
            const authCheck = await verify(token, c.env.SECRETKEY)
            c.set("data", authCheck)
            return await next()
        }
        return c.json({ message: "User not logged in please login" })

    } catch (error) {
        console.log(error)
        return c.json({ message: "Bad request" })
    }

}