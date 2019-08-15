const net = require("net")
const socket = net.connect("/mnt/d/project/nursery/cluster/unix")
socket.on("connect", function () {
    socket.on("data", function (data) {
        console.log(data)
        console.log(data.toString())
    })

    setInterval(() => {
        socket.write("hello")
    }, 2000);
})