const mongoose = require('mongoose');

const hootSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        }, 
        text:{
            type: String, 
            required: true,
        },
        category: {
            type: String, 
            required: true, 
            enum: ['News', 'Sports', 'Games', 'Movies', 'Music', 'Television'],
        }, 
        author:{
            type: mongoose.Schema.Types.ObkectId, 
            ref: 'User'//teh ref property allows us to use .populate
            },
    }, { timestamps: true});

    const Hoot = mongoose.model('Hoot', hootSchema);

    module.export = Hoot;