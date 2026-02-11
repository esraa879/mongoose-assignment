import express from 'express';
import chechConnection from './DB/connectionDB.js';
import userRouter from './modules/users/user.controller.js';
import noteRouter from './modules/notes/notes.controller.js';
const app = express();
const port = 3000;

const bootstrap = () =>{

   chechConnection();
app.use(express.json())


 app.use("/users", userRouter)
 app.use("/notes", noteRouter)
 

app.get("/",(req,res) => {
        res.status(200).json({
            message:"welcome on my app"
        })
    });

app.use("{/*demo}",(req,res,next)=>{
res.status(404).json({
    message:`url ${req.originalUrl} is Not Found...`
})
})

    app.listen(port, () => {
        console.log(`app is running on port ${port}`)
    })

}

export default bootstrap;