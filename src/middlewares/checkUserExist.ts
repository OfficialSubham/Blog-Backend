import { Context, Next } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const checkUserExists = async (c:Context, next: Next) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const {username} = body
    const lowerCaseUsername = username.toLowerCase()
    const existedUser = await prisma.user.findUnique({
        where: {
            username: lowerCaseUsername
        }
    })
    if(existedUser) {
       c.set("data", {"existedUser": true, user: existedUser})
    }
    else {
       c.set("data", {"existedUser": false})
    }
    await next()
}