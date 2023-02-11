
const mongoose = require('mongoose')
const Tree = require('./tree')
const db = require('../../config/db')

const startTrees = [
    { name: 'Oak', type: 'deciduous', isCool: true},
    { name: 'Pine', type: 'evergreen', isCool: true},
    { name: 'Palm', type: 'deciduous', isCool: true},
    { name: 'Christmas', type: 'evergreen', isCool: true}
]

// first we connect to the db
// then remove all trees
// then add the start trees
// and always close the connection, whether its a success or failure

mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        Tree.deleteMany()
            .then(deletedTrees => {
                console.log('the deleted trees:', deletedTrees)
                // now we add our trees to the db
                Tree.create(startTrees)
                    .then(newTrees => {
                        console.log('the new trees', newTrees)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })