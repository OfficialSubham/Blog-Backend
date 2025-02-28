import { Hono } from "hono";
import { createBlog } from "../controllers/blogControllers/createBlog";
import { checkUserLoggedIn } from "../middlewares/checkUserLoggedIn";
import { getAllBlog } from "../controllers/blogControllers/getAllBlog";
import { updateBlog } from "../controllers/blogControllers/updateBlog";
import { deleteBlog } from "../controllers/blogControllers/deleteBlog";
import { getYourBlogs } from "../controllers/blogControllers/getYourBlogs";
import { searchBlogs, searchBlogWithTag } from "../controllers/blogControllers/searchBlog";
const blogRoute = new Hono()

//Create Blog

blogRoute.post("/createblog", checkUserLoggedIn, createBlog)

//Get all blog

blogRoute.get("/getallblogs", checkUserLoggedIn, getAllBlog)

//Update Blog

blogRoute.put("/updateblog/:id", checkUserLoggedIn, updateBlog)

//Delete Blog

blogRoute.delete("/deleteblog/:id", checkUserLoggedIn, deleteBlog)

//Get your blogs specifically 

blogRoute.get("/getyourblogs", checkUserLoggedIn, getYourBlogs)

//Search Specific Blog

blogRoute.get("/searchblogs/:query", checkUserLoggedIn, searchBlogs)

//Search Blog with tag

blogRoute.get("/searchblogwithtag", checkUserLoggedIn, searchBlogWithTag)

export default blogRoute