import mongoose from "mongoose";

const TypeSchema = new mongoose.Schema({
    typeName: {
        type: String
    }
})

export default mongoose.model("Type", TypeSchema)