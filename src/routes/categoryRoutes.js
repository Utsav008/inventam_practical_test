let express = require("express");

let route = express.Router();
let categoryService = require("../service/categoryService");

route.post("/add",categoryService.saveCategory);
route.put("/update",categoryService.updateCategory);
route.get("/list",categoryService.getCategory);
route.get("/getByParentId/:id",categoryService.getCategoryByParent);
route.delete("/delete/:id",categoryService.deleteCategory);

module.exports = route;