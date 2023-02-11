// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Tree = require('../models/tree')

// custom middleware
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// ROUTES

// POST -> create a wildanimal(and give that wildanimal to a tree)
// POST /wildanimals/:treeId
// anybody should be able to give a tree a wildanimal
// so we wont requireToken
// our wildanimal schema, has some non-required fields, so let's use removeBlanks
router.post('/wildanimals/:treeId', removeBlanks, (req, res, next) => {
    // isolate our wildanimal from the request, and save to variable
    const wildanimal = req.body.wildanimal
    // isolate and save our tree's id for easy reference
    const treeId = req.params.treeId
    // find the tree and push the new wildanimal into the tree's array
    Tree.findById(treeId)
        // first step is to use our custom 404 middleware
        .then(handle404)
        // handle adding wildanimal to tree
        .then(tree => {
            console.log('the tree: ', tree)
            console.log('the wildanimal: ', wildanimal)
            // add wildanimal to wildanimals array
            tree.wildanimals.push(wildanimal)

            // save the tree
            return tree.save()
        })
        // send info after updating the tree
        .then(tree => res.status(201).json({ tree: tree }))
        // pass errors along to our error handler
        .catch(next)
})

// PATCH -> update a wildanimal
// PATCH /wildanimals/:treeId/:wildanimalId
router.patch('/wildanimals/:treeId/:wildanimalId', requireToken, removeBlanks, (req, res, next) => {
    // get and save the id's to variables
    const treeId = req.params.treeId
    const wildanimalId = req.params.wildanimalId

    // find our tree
    Tree.findById(treeId)
        .then(handle404)
        .then(tree => {
            // single out the wildanimal
            const theWildAnimal = tree.wildanimals.id(wildanimalId)
            // make sure the user is the tree's owner
            requireOwnership(req, tree)
            // update accordingly
            theWildAnimal.set(req.body.wildanimal)

            return tree.save()
        })
        // send a status
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DELETE -> destroy a wildanimal
// DELETE /wildanimals/:treeId/:wildanimalId
router.delete('/wildanimals/:treeId/:wildanimalId', requireToken, (req, res, next) => {
    const treeId = req.params.treeId
    const wildanimalId = req.params.wildanimalId

    // find the tree
    Tree.findById(treeId)
        .then(handle404)
        // grab the specific wildanimal using it's id
        .then(tree => {
            // isolate the wildanimal
            const theWildAnimal = tree.wildanimals.id(wildanimalId)
            // make sure the user is the owner of the tree
            requireOwnership(req, tree)
            // call remove on our wildanimal subdoc
            theWildAnimal.remove()
            // return the saved tree
            return tree.save()
        })
        // send a response
        .then(() => res.sendStatus(204))
        // pass errors to our error handler (using next)
        .catch(next)
})

// export our router
module.exports = router