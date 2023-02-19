// import dependencies
const mongoose = require('mongoose')

const wildAnimalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    isDangerous: {
        type: Boolean,
        required: true,
        default: false
    },
    danger: {
        type: String,
        // here we'll use enum, which means we can only use specific strings for this field.
        // enum is a validator on the type String that says "you can only use one of the values within this array"
        enum: ['unbothered', 'friendly', 'dangerous'],
        default: 'unbothered'
    }
}, { timestamps: true })

module.exports = wildAnimalSchema