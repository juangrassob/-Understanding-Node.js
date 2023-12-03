const fs = require("node:fs/promises");

(async () => {
  const fileHandlerRead = await fs.open("src.txt", "r");
  const fileHandlerWrite = await fs.open("dest.txt", "w");

  const streamRead = fileHandlerRead.createReadStream();
  const streamWrite = fileHandlerWrite.createWriteStream();

  streamRead.on("data", (chunk) => {
    const availableToWrite = streamWrite.write(chunk);

    if (!availableToWrite) {
      streamRead.pause();
    }
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });
})();
