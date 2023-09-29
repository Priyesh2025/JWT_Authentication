require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken') 



app.use(express.json())

const posts = [
    {
        username : "Priyesh",
        title : "Sketch"
    },
    {
        
        username : "Mansi",
        title : "Guitar"
    }
]


const authenticateToken=(req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) res.sendStatus(401)

    jwt.verify(token,process.env.JWT_SECRET_TOKEN,(err,user)=>{

        if(err) res.sendStatus(403)
        req.user = user
        next()
    })
}

app.get('/posts',authenticateToken,(req,res)=>{
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login',(req,res)=>{
    // authenticate user 
    const username = req.body.username

    const user = { name : username}

    const accessToken = jwt.sign(user,process.env.JWT_SECRET_TOKEN)

    res.json({accessToken : accessToken})

})



app.listen(3000,()=>{console.log("server is listening on port 3000...")})