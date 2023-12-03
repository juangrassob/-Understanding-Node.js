// Create a buffer to allocate this exact amount of data
// 0100 1000 0110 1001 0010 0001

const { Buffer } = require("buffer");

const buffer = Buffer.alloc(3);

buffer[0] = 0x48;
buffer[1] = 0x69;
buffer[2] = 0x21;

console.log(buffer);

const decodedBuffer = buffer.toString("utf-8");

console.log(decodedBuffer);
