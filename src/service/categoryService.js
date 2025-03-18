const CategorySchema = require("../schema/category")


let saveCategory = async(req,res) => {
    try {
        let data = req.body
    
        if(!data?.name){
            res.json({
                status: false,
                message: "Category name required"
            })
            return;
        }

        let category = await new CategorySchema({
            name: data?.name,
            parentId: data?.parentId || null
        }).save()
    
        res.json({
            status: true,
            id: category._id
        })
    } catch (error) {
        res.json({
            status: false,
            message: "Something went to wrong!"
        })
    }
    
}

let updateCategory = async(req,res) => {
    try {
        let data = req.body
    
        if(!data?.name){
            res.json({
                status: false,
                message: "Category name required"
            })
            return;
        }

        await CategorySchema.updateOne({ _id: data.id},{ $set: {
                name: data?.name
            }
        })
    
        res.json({
            status: true,
            message: "Category updated successfully"
        })
    } catch (error) {
        res.json({
            status: false,
            message: "Something went to wrong!"
        })
    }
}

let deleteCategory = async(req,res) => {
 
    try {
        const { id } = req.params;

        await CategorySchema.deleteOne({
            _id: id
        })
     
         res.json({
            status: true,
            message: "Category deleted successfully"
         })
     } catch (error) {
         res.json({
             status: false,
             message: "Something went to wrong!"
         })
     }
}

let getCategory = async(req,res) => {
 
    try {
       let categoryData =  await CategorySchema.find()
    
        res.json({
            status: true,
            data: categoryData
        })
    } catch (error) {
        res.json({
            status: false,
            message: "Something went to wrong!"
        })
    }
}

let getCategoryByParent = async(req,res) => {
 
    try {
        const { id } = req.params;

        let category = await CategorySchema.findById(id)

        let categorys = null;
        if(category){
            let categoryData =  await getNestedCategory(id);

            categorys = {
                name: category.name,
                subCategory : categoryData
            }
        }
        
         res.json({
             status: true,
             data: categorys
         })
     } catch (error) {
         res.json({
             status: false,
             message: "Something went to wrong!"
         })
     }
}

const getNestedCategory = async (parentId) => {
    const categories = await CategorySchema.find({ parentId: parentId }, { createdAt: 0, parentId: 0, updatedAt: 0 }).lean();

    for (let category of categories) {
        category.subCategory = await getNestedCategory(category._id);
    }

    return categories;
};
  

module.exports =  {
    saveCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategoryByParent
}



