const fs = require("fs/promises");

(async () => {
  const createFile = async (path) => {
    let existingFileHandler;
    try {
      existingFileHandler = await fs.open(path, "r");

      existingFileHandler.close();
      return console.log(`The file ${path} already exists.`);
    } catch (error) {
      // In case that there is an error, the file does not exists
      const newFileHandler = await fs.open(path, "w");
      console.log("A file has been created successfully created.");

      newFileHandler.close();
    }
  };

  const CREATE_FILE = "create a file";

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    const commandFileData = await commandFileHandler.stat();
    const commandFileSize = commandFileData.size;

    const buff = Buffer.alloc(commandFileSize);

    const offset = 0;
    const length = buff.byteLength;
    const position = 0;

    const content = await commandFileHandler.read(
      buff,
      offset,
      length,
      position,
    );

    const command = buff.toString("utf-8");

    if (command.includes(CREATE_FILE)) {
      const filePath = command.split(CREATE_FILE)[1].trim();

      createFile(filePath);
    }
  });

  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
