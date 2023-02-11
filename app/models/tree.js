const mongoose = require('mongoose')
const wildAnimalSchema = require('./wild_animal')

const treeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		isCool: {
			type: Boolean,
			required: true
		},
		animal: [wildAnimalSchema],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	}
)
treeSchema.virtual('fullTitle').get(function () {
	return `${this.name} trees are a type of ${this.type} tree.`
})

treeSchema.virtual("danger").get(function () {
	if (this.animal.danger == 'unbothered') {
		return "Oh it's minding it business"
	} else if (this.animal.danger == 'friendly') {
		return "Aww I wanna pet it"
	} else {
		"Stay away from it, I think it is dangerous"
	}
})

module.exports = mongoose.model('Tree', treeSchema)
