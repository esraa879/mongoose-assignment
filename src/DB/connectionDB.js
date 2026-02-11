import mongoose from "mongoose"



const chechConnection = async () =>{
    await mongoose.connect(
        "mongodb://127.0.0.1:27017/mongooseAssignment"
    ).then(() =>{ console.log("Connected to DB")

    })
    .catch((err) => {
        console.log("DB connection error", err);
        
    })
}

export default chechConnection