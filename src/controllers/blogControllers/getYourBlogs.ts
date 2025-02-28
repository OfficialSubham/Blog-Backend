import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

export const getYourBlogs = async (c: Context) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const {id} = c.get("data")
        const blogs = await prisma.blog.findMany({
            where: {
                userId: id
            }
        })
        return c.json({message: "All blog", blogs})

    } catch (error) {
        return c.json({message: "Internal Error"})
    }
}