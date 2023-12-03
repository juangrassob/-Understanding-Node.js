const fs = require("node:fs/promises");

(async () => {
  const fileHandlerRead = await fs.open("src.txt", "r");
  const fileHandlerWrite = await fs.open("dest.txt", "w");

  const streamRead = fileHandlerRead.createReadStream();
  const streamWrite = fileHandlerWrite.createWriteStream();

  let split = "";

  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split("  ");

    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      if (split) {
        numbers[0] = split.trim() + numbers[0].trim();
      }
    }

    if (
      Number(numbers[numbers.length - 1]) !==
      Number(numbers[numbers.length - 2]) + 1
    ) {
      split = numbers.pop();
    }

    numbers.forEach((number) => {
      let n = Number(number);

      if (n % 2 === 0) {
        const availableToWrite = streamWrite.write(` ${n} `, "utf-8");

        if (!availableToWrite) {
          streamRead.pause();
        }
      }
    });
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });
})();
