"use strict"


// package
// @package
const express = require("lazy_mod/express")
const graphqlHTTP = require("express-graphql")
const { buildSchema } = require("graphql")
const router = express.Router()


// 获取用户信息
// @GraphQl
router.get("/", graphqlHTTP(async (req) => ({
  schema: buildSchema(req.crate.model.Resolver.User.template),
  rootValue: req.crate.model.Resolver.User
})))


// export.
module.exports = router