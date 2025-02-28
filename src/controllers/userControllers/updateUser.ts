import { Context } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { hash } from "bcrypt-ts"
import { z } from "zod"
import jwt from "jsonwebtoken";

interface Credentials {
    username: string;
    id: number;
    firstName: string;
    lastName: string;
    iat?: number;
}

const passwordSchema = z.string().min(5)

export const updateUser = async (c: Context) => {
    try {
        
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
    
        const body = await c.req.json()
        // const { firstName, lastName, password } = body
        const {success} = passwordSchema.safeParse(body.password)
        if(!success) {
            return c.json({message: "Enter valid Password"})
        }
        const hashPassword = await hash(body.password, 10) 
        body.password = hashPassword
        
        const credentials = c.get("data") as Credentials
        const updatedData = await prisma.user.update({
            where: {
                id: credentials.id
            },
            data: {
                ...body
            },
            omit: {
                password: true
            }
        })
    
        const token = jwt.sign({ username: updatedData.username, id: updatedData.id, firstName: updatedData.firstName, lastName: updatedData.lastName }, c.env.SECRETKEY)
    
        return c.json({ message: "User Updated successfully", token })
    } catch (error) {
        c.json({message: "Internal error occured"})
    }
}
