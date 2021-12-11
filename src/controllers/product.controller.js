const express= require('express');

const router=express.Router();

const Product= require("../models/product.model")

const {createClient}=require('redis');
const client = createClient();
client.connect()

router.get("", async (req,res) => {
    client.on('error', (err) => console.log('Redis Client Error', err));
    try {
           const value= await client.get("products")

           if(value) return res.status(200).send(value);

           const product = await Product.find().lean().exec();

           client.set("products",JSON.stringify(product));

           res.status(200).send(product);
           
    } catch (err) {
        res.status(500).json({message: err.message, status:"Failed"});
    }
    
})

router.get("/:id", async (req,res) => {
    client.on('error', (err) => console.log('Redis Client Error', err));
    try {
        const value= JSON.parse(await client.get("products"));
    //    console.log('value:',value);
        let ans=null;
       
        value.forEach((product) => {
            if(product._id==req.params.id) {
                ans=product;
            }
        })
        
        console.log('ans:', ans);
        if(ans) return res.status(200).send(ans);


        const product = await Product.findById(req.params.id).lean().exec();

        res.status(200).send(product);
    }  catch (err) {
        res.status(500).json({message: err.message, status:"Failed"});
    }
})

router.post("", async (req, res) => {
    client.on('error', (err) => console.log('Redis Client Error', err));
    try {
        const product= await Product.create(req.body);
        const products = await Product.find().lean().exec();
        client.set("products",JSON.stringify(products));

        res.status(201).send(product);
    } catch (err) {
        res.status(500).json({message: err.message, status:"Failed"});
    }
})

router.patch("/:id" ,async(req,res) => {
    try {
        const product= await Product.findByIdAndUpdate(req.params.id, req.body, {new:1}).lean().exec();
        const products = await Product.find().lean().exec();
        client.set("products",JSON.stringify(products));

        res.status(200).send(product);
    } catch (err) {
        res.status(500).json({message: err.message, status:"Failed"});
    }
})

router.delete("/:id", async(req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id).lean().exec();
        const products = await Product.find().lean().exec();
        client.set("products",JSON.stringify(products));

        res.status(200).send(product);
    } catch (err) {
        res.status(500).json({message: err.message, status:"Failed"});
    }
})

module.exports= router;