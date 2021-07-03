const mongoose = require('mongoose')

const PrefixSchema = new mongoose.Schema({
    guildID: {type: Number, required: true},
    guildPrefix: { type: String, required: true}
})

const model = mongoose.model('PrefixModel', PrefixSchema)

module.exports = model