import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

export const deleteBlog = async (c: Context) => {
    try {
        const { id } = c.req.param()
        const blogId = Number(id)
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const blog = await prisma.blog.findUnique({
            where: {
                id: blogId
            }
        })
        if(!blog) {
            return c.json({message: "Blog doesnot exits"})
        }       
        const user = c.get("data")
        if(user.id !== blog.userId) {
            return c.json({message: "This is not your blog"})
        }
        const deletedBlog = await prisma.blog.update({
            where: {
                id: blogId
            },
            data: {
                deleted: true
            }
        })

        return c.json({ message: "working", deletedBlog })

    } catch (error) {
        return c.json({message: "Internal Error"})
    }
}