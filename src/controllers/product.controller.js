const express= require('express');

const router=express.Router();

const Product= require("../models/product.model")
const redis=require('redis');

const client = redis.createClient();

router.get("", async (req,res) => {
    try {
            client.connect()
            client.get("products",async function (err,doc) {
            console.log(doc)
            if(err) console.log(err)

            if(doc) return res.status(200).send(doc);

            const products = await Product.find().lean().exec();

            res.status(200).send(products);
        })
    } catch (err) {
        res.status(500).json({message: err.message, status:"Failed"});
    }
    
})

router.get("/:id", async (req,res) => {
    try {
        const product = await Product.findById(req.params.id).lean().exec();

        res.status(200).send(product);
    }  catch (err) {
        res.status(500).json({message: err.message, status:"Failed"});
    }
})

router.post("", async (req, res) => {
    try {
        const product= await Product.create(req.body);

        res.status(201).send(product);
    } catch (err) {
        res.status(500).json({message: err.message, status:"Failed"});
    }
})

router.patch("/:id" ,async(req,res) => {
    try {
        const product= await Product.findByIdAndUpdate(req.params.id, req.body, {new:1}).lean().exec();

        res.status(200).send(product);
    } catch (err) {
        res.status(500).json({message: err.message, status:"Failed"});
    }
})

router.delete("/:id", async(req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id).lean().exec();

        res.status(200).send(product);
    } catch (err) {
        res.status(500).json({message: err.message, status:"Failed"});
    }
})

module.exports= router;