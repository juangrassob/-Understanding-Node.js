const net = require("net");

const socket = net.createConnection({ host: "127.0.0.1", port: 3099 }, () => {
  const buff = Buffer.from("A simple message from a simple sender.", "utf-8");
  socket.write(buff);
});
