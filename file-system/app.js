const fs = require("fs/promises");

(async () => {
  const CREATE_FILE = "create the file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

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

  const deleteFile = async (path) => {
    await fs.unlink(path);
    console.log("The file has been successfully deleted");
  };
  const renameFile = async (path, newPath) => {
    fs.rename(path, newPath);
    console.log("File successfully renamed:", path, " to ", newPath);
  };
  const addToFile = async (path, content) => {
    const fileHandler = await fs.open(path, "a");
    fileHandler.write(content);
    fileHandler.close();
    console.log("Content successfully appended");
  };

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
      const filePath = command.substring(CREATE_FILE.length + 1).trim();

      createFile(filePath);
    }

    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1).trim();
      deleteFile(filePath);
    }
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf("to");
      const oldFilePath = command
        .substring(RENAME_FILE.length + 1, _idx)
        .trim();
      const newFilePath = command.substring(_idx + 3).trim();
      renameFile(oldFilePath, newFilePath);
    }
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf("this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx).trim();
      const content = command.substring(_idx + 14);
      addToFile(filePath, content);
    }
  });

  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
