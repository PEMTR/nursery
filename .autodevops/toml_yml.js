"use strict"


// package
// @package
const fs = require("fs")
const toml = require("toml")
const yml = require("json-to-pretty-yaml")


// process
let _out = process.argv[3]
let _input = process.argv[2]
let _file = fs.readFileSync(_input)
let _obj = toml.parse(_file)
let _yml = yml.stringify(_obj)
fs.writeFileSync(_out, _yml)
console.log("OK!")