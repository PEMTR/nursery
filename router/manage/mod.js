"use strict"


// package
// @package
const express = require("lazy_mod/express")
const graphqlHTTP = require("express-graphql")
const { buildSchema } = require("graphql")
const router = express.Router()


// 获取用户信息
// @GraphQl
router.use("/", graphqlHTTP(async (req) => ({
  schema: buildSchema(req.crate.model.graphql.User.template),
  rootValue: req.crate.model.graphql.User,
  graphiql: true
})))


// export.
module.exports = router