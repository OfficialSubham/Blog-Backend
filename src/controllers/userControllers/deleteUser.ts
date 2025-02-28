import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compare } from "bcrypt-ts"

type User = {
    username: string;
    id: number;
    firstName: string;
    lastName: string;
    password: string
}

export const deleteUser = async (c: Context) => {
    try {
        const { password } = await c.req.json()
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const { id } = c.get("data")
        console.log(id)
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        }) as User
        const checkValidPassword = await compare(password, user.password)
        if(!checkValidPassword) {
            return c.json({message: "Enter valid credentials"})
        }

        await prisma.user.delete({
            where: {
                id
            }
        })

        return c.json({ message: "User deleted successfully" })

    } catch (error) {
        return c.json({message: "Internal Error"})
    }
}