const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    codeUrl:{
        type: String,
        required: true

    },
    platform:{
        type:String,
        required:true
    },
    author:{
        type: String,
        require: true
    },
    date: {
        type: String,
        required: true,
    }
});

const Solution = mongoose.model('Solution', SolutionSchema);

module.exports = Solution;
