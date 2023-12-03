const fs = require("fs/promises");

(async () => {
  console.time("Time");

  const fileHandler = await fs.open("./test.txt", "w");
  const stream = fileHandler.createWriteStream();

  let i = 0;
  let drainCount = 0;

  const writeMany = () => {
    while (i <= 1000000) {
      const buff = Buffer.from(` ${i} `, "utf8");

      if (i === 1000000) {
        stream.end(buff);
        break;
      }

      if (!stream.write(buff)) break;

      i++;
    }
  };

  writeMany();

  stream.on("drain", () => {
    drainCount++;
    writeMany();
  });

  stream.on("finish", () => {
    console.log("Total drains: ", drainCount);
    console.timeEnd("Time");
    fileHandler.close();
  });
})();
