import { Context, Next } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { loginSchema, loginSchemaType } from "@codersubham/validuser";

export const checkUserExists = async (c:Context, next: Next) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const {username, password}: loginSchemaType = await c.req.json()
    const isValid = loginSchema.safeParse({username, password})
    if(!isValid.success) return  c.json({message: "Enter Minimum Credentials"})
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