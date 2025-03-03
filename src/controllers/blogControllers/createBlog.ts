import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { blogSchema } from "@codersubham/validuser";


export const createBlog = async (c: Context)=>{
    try {
        const body = await c.req.json()
        const {success} = blogSchema.safeParse(body)
        if(!success) {
            return c.json({message: "Follow Minimum Criteria"})
        }
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const {id} = c.get("data")
        const insensitiveTag = body.tag.map((tag:string) => tag.toLowerCase())
        const blog = await prisma.blog.create({
            data: {
              ...body,
              ["tag"]: insensitiveTag,
              userId: id
            }
        }) 
        return c.json({message: "working", blog})
    } catch (error) {
        
    }
}