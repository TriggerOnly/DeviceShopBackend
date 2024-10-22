import mongoose from "mongoose";

const BasketDeviceSchema = new mongoose.Schema({
    device: {
        type: String,
        require: true
    },
    basket: {
        type: String,
        require: true
    },
    count: {
        type: Number,   
        default: 0 
    }
})

export default mongoose.model("BasketDevice", BasketDeviceSchema) 