let mongoose = require("mongoose");

let Schema = mongoose.Schema;

const category = new Schema({
    name: {
        type: String
    },
    parentId: {
        type: String,
        default: null
    }
},{timestamps: true});

category.index({parentId : 1});

module.exports = mongoose.model("category", category)