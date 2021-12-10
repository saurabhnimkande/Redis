const mongoose =require('mongoose');


const productSchema= new mongoose.Schema({
    product_name:{type:String, require:true},
    product_details:{type:String, require:true},
    product_price:{type:Number, require:true}
}, {
    versionKey:false,
    timestamps:true
})

module.exports = mongoose.model("product",productSchema);