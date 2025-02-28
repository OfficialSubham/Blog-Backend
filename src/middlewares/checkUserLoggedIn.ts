import { Context, Next } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify, } from "jsonwebtoken"


type Credentials = {
    username: string,
    id: number | string,
    firstName: string,
    lastName: string,
    iat?: number
}


export const checkUserLoggedIn = async (c: Context, next: Next) => {
    try {
        const token = c.req.header("Authorization")
        if (token) {
            const authCheck = verify(token, c.env.SECRETKEY) as Credentials
            c.set("data", authCheck)
            return await next()
        }
        return c.json({ message: "User not logged in please login" })

    } catch (error) {
        return c.json({ message: "Bad request" })
    }

}