import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

export const searchBlogs = async (c: Context) => {

    try {
        const query = c.req.param("query")
        if (!query) {
            return c.json({ message: "Enter valid search" }, 400)
        }
        const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
        const relatedBlogs = await prisma.blog.findMany({
            where: {
                OR: [{
                    title: {contains: query, mode: "insensitive"}
                }, {
                    description: {contains: query, mode: "insensitive"}
                }],
                deleted: false
            }
        })
        if(!relatedBlogs[0]) {
            return c.json({message: "There is no blog"}, 400)
        }
        return c.json({message: "Here is all blog", relatedBlogs})
    } catch (error) {
        return c.json({message: "Internal error occured"}, 500)
    }
}

export const searchBlogWithTag = async (c: Context) => {
    try {
    const {tag} = await c.req.json()
        if (!tag[0]) {
            return c.json({ message: "Enter valid Tag" }, 400)
        }
        const insensitiveTag = tag.map((tag:string) => tag.toLowerCase())
        const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
        const relatedTagBlogs = await prisma.blog.findMany({
            where: {
                tag: {
                    hasEvery: insensitiveTag
                },
                deleted: false
            }
        })
        if(!relatedTagBlogs[0]) {
            return c.json({message: "There is no blog"}, 400)
        }
        return c.json({message: "Here is all blog", relatedTagBlogs})
    } catch (error) {
        return c.json({message: "Internal error occured"}, 500)
    }
}