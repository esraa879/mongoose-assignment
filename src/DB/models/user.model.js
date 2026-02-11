import mongoose from "mongoose";
import { providerEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema({


name:{
    type: String,
    required: true    
},

email:{
    type: String,
    required: true,
    unique: true
},

password:{
    type: String,
    required: true
},
phone:{
    type: String,
    required: true
},
age:{
    type: Number,
    required: true,
    min: 18,
    max : 60
},
confirmed:Boolean,
provider:{
    type: String,
    enum: Object.values(providerEnum),
    default: providerEnum.system
}
},{
    timestamps: true,
    strictQuery:true

}
);
const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel