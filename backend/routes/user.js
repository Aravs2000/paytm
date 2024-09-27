const { application } = require('express')
const express = require('express')
const z = require('zod')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../database')
const {JWT_SECRET} = require('../config')

const signupSchema = z.object({
    username: z.string().email(),
	firstName: z.string(),
	lastName: z.string(),
	password: z.string()
})

const signinSchema = z.object({
	username:z.string().email(),
	password:z.string()
})

const userInfoUpdateSchema = z.object({
	username: z.string().optional(),
	firstName: z.string().optional(),
	lastName:z.string().optional()
})

router.post('/signup',async (req,res)=>{
    const {success} = signupSchema.safeParse(req.body)
	if(!success){
		return res.status(411).json({ message: "Incorrect inputs"})
	}
	const existingUser = await User.findOne({username: req.body.username})
	if(existingUser){
		return res.status(411).json({message: "User already exists"})
	}
	const newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password
	})
	const userId = newUser._id
	const token = jwt.sign(
		{userId},
		JWT_SECRET
	)
	await newUser.save()
	res.status(200).json({message: "User created",userid:userId,token:token})

})

router.post('/signin',async(req,res)=>{
	const {success} = signupSchema.safeParse(req.body);
	if(!success){	
		return res.status(411).json({message: "Incorrect input format"})
	}
	const user = await User.findOne({username: req.body.username})
	if(!user){
		return res.status(411).json({message:"User doesnt exist please sign in"})
	}
	else{
		const token = jwt.sign({
			userId: user._id
		},JWT_SECRET);
		res.json({
			token:token
		})
		return res
	}
})


router.put('/',async(req,res)=>{
	const {success} = userInfoUpdateSchema.safeParse(req.body);

})


module.exports = router