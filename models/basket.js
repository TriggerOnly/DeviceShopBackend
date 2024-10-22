import mongoose from "mongoose";

const BasketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    }
})

export default mongoose.model("Basket", BasketSchema)