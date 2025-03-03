import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { blogSchema } from "@codersubham/validuser"; 


export const updateBlog = async (c: Context) => {
    try {
        const id  = c.req.param("id")
        const blogId = Number(id)
        if (isNaN(blogId)) {
            return c.json({ message: "Invalid blog ID" }, 400);
        }
        const body = await c.req.json();
        const { success } = blogSchema.safeParse(body)
        if (!success) {
            return c.json({ message: "Enter with minimum letter requirements" })
        }
        const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())

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

        const updatedBlog = await prisma.blog.update({
            where: {
                id: blogId
            },
            data: {
                ...body
            }
        })

        return c.json({ message: "working", updatedBlog })

    } catch (error) {
        console.log(error)
        return c.json({ message: "Error while updating", error })
    }
}