import mongoose from "mongoose";

const practicalSchema = new mongoose.Schema({
    labId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lab",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    instructions: {
        type: String,
        default: ""
    },
    materials: [{
        name: String,
        url: String
    }],
    deadline: {
        type: Date
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Practical", practicalSchema);