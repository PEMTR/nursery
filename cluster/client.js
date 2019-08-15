const net = require("net")
const socket = net.connect("/Users/quasipaa/Desktop/nursery/cluster/unix")
socket.on("connect", function () {
    socket.on("data", function (data) {
        console.log(data)
        console.log(data.toString())
    })

    setInterval(() => {
        socket.write("hello")
    }, 2000);
})