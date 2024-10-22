import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    price: {
        type: String,
        require: true
    },
/*     rating: {

    }, */
    text: {
        type: String,
        require: true
    }, 
    imageUrl: {
        type: [String]
    },
    typeId: {
        type: String,
        require: true
    },
    brandId: {
        type: String,
        requre: true
    }
})

export default mongoose.model("Device", DeviceSchema)