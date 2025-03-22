import { Context, Hono } from "hono";
import { z } from "zod"
import { createUser } from "../controllers/userControllers/createUser";
import { checkUserExists } from "../middlewares/checkUserExist";
import { loginUser } from "../controllers/userControllers/loginUser";
import { checkUserLoggedIn } from "../middlewares/checkUserLoggedIn";
import { updateUser } from "../controllers/userControllers/updateUser";
import { deleteUser } from "../controllers/userControllers/deleteUser";
import { userSchema, userSchemaType } from "@codersubham/validuser";

const userRoute = new Hono()

//Create user
userRoute.post("/createuser", checkUserExists,async (c:Context) => {
    if (c.get("data").existedUser) {
        return c.json({ message: "User already Existed with this username" }, 400)
    }
    const body: userSchemaType = await c.req.json()
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

userRoute.post("/isuserexist",checkUserExists, async (c:Context) => {
    return c.get("data")
})

export default userRoute;