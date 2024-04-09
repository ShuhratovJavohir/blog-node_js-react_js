// import libraries
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import {validationResult} from "express-validator";

// import function and files
import {registerValidation} from "./validations/auth.js";
import UserModel from "./Models/User.js";

// connect to the database
mongoose
    .connect('mongodb+srv://admin:admin@cluster0.kzlei7i.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to the database'))
    .catch((err) => console.log('Error connecting to the database: ', err))

// create an express app
const app = express()

// для того чтобы node js понимал json
app.use(express.json())

// post запрос по пути /auth/register
app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {
            expiresIn: '30d'
        })

        const { passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })

    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
})

app.listen(4444, (err) => {
    if (err) {
        return console.log('Error: ', err)
    }
    console.log('Server is listening on port 4444')
})