import { Context, Hono } from "hono";
import { z } from "zod"
import { createUser } from "../controllers/userControllers/createUser";
import { checkUserExists } from "../middlewares/checkUserExist";
import { loginUser } from "../controllers/userControllers/loginUser";
import { checkUserLoggedIn } from "../middlewares/checkUserLoggedIn";
import { updateUser } from "../controllers/userControllers/updateUser";
import { deleteUser } from "../controllers/userControllers/deleteUser";

const userRoute = new Hono()

const userSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(5),
    firstName: z.string().min(3),
    lastName: z.string().min(3)
}).strict()

type UserSchema = z.infer<typeof userSchema>;
//Create user
userRoute.post("/createuser", checkUserExists,async (c:Context) => {
    if (c.get("data").existedUser) {
        return c.json({ message: "User already Existed with this username" })
    }
    const body: UserSchema = await c.req.json()
    const { success } = userSchema.safeParse(body)

    if (success) {
        return createUser(c)
    }
    return c.text("Enter Valid Credentials")
})

//Login user

userRoute.post("/loginuser", checkUserExists, async (c:Context) => {
    
    if(!c.get("data").existedUser) {
        return c.json({message: "User doesnot exist Please sign up"})
    }
    
    return loginUser(c)

})

//Update User

userRoute.put("/updateuser", checkUserLoggedIn, updateUser)

// Delete User

userRoute.delete("/deleteuser", checkUserLoggedIn, deleteUser)

export default userRoute;