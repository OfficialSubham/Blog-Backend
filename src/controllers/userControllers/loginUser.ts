import { Context } from "hono";
import { compare } from "bcrypt-ts"
import jwt from "jsonwebtoken";

export const loginUser = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { password } = body
        const user = c.get("data").user
        const matchPassword = await compare(password, user.password)
        if(!matchPassword) {
            return c.json({message: "Enter valid credentials"})
        }
        const token = jwt.sign({username: user.username, id: user.id, firstName: user.firstName, lastName: user.lastName}, c.env.SECRETKEY)

        return c.json({message: "login successfull", token})

    } catch (error) {
        return c.json({ error })
    }
}