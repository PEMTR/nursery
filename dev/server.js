const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker({
  nodeID: "one",
  transporter: "amqp://nursery:MTMwOGJmZjZiOTJiYTFkZjh@server.local",
  logLevel: "debug",
  requestTimeout: 5 * 1000
})

broker.createService({
  name: "dev",
  actions: {
    add(ctx) {
      return Number(ctx.params.a) + Number(ctx.params.b)
    }
  }
})

broker.start()