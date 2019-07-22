"use strict"


// package
// @package
const express = require("lazy_mod/express")
const graphqlHTTP = require("express-graphql")
const router = express.Router()


router.use("/graphql", graphqlHTTP(async (req) => {
  return req.crate.model.graphql.User.get()
}))


// export.
module.exports = router