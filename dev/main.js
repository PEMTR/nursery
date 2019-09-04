const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker({
  nodeID: "two",
  transporter: "amqp://nursery:MTMwOGJmZjZiOTJiYTFkZjh@server.local",
  logLevel: "debug",
  requestTimeout: 5 * 1000
})

broker.start()
    // Call service
    .then(() => broker.call("dev.add", { a: 5, b: 3 }, { nodeID: "one" }))
    .then(res => console.log("5 + 3 =", res))
    .catch(err => console.error(`Error occured! ${err.message}`));