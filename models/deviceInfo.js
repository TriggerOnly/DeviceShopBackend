import mongoose from "mongoose";

const deviceInfoSchema = new mongoose.Schema({
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
        require: true
    },
    title: {
        type: String,
        requre: true
    },
    description: {
        type: String
    }
})

export default mongoose.model("DeviceInfo", deviceInfoSchema)