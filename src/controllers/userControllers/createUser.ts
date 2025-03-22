import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { hash } from "bcrypt-ts"
import { sign } from "hono/jwt";


export const createUser = async (c: Context) => {
    try {
        const DATABASE_URL = c.env.DATABASE_URL
        const salt = Number(c.env.SALT)
        const prisma = new PrismaClient({
            datasourceUrl: DATABASE_URL
        }).$extends(withAccelerate())
        const body = await c.req.json()
        const { username, password, firstName, lastName } = body
        const lowerCaseUsername = username.toLowerCase()
        const hashPassword = await hash(password, salt)

        const res = await prisma.user.create({
            data: {
                username: lowerCaseUsername,
                password: hashPassword,
                firstName,
                lastName
            },
            omit: {
                password: true
            }
        })

        const token = await sign(res, c.env.SECRETKEY)

        return c.json({ message: "user created successfully", token })

    } catch (error) {

        return c.json({ message: "Some error occured", error })
    }

}