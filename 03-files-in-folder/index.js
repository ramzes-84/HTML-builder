const fs = require('fs/promises');
const path = require('path');
const targetFolderPath = path.join(__dirname, 'secret-folder');

getFileList(targetFolderPath);

async function getFileList(folderPath) {
  const list = await fs.readdir(folderPath, { withFileTypes: true });
  for (let item of list) {
    if (item.isFile()) {
      const stats = await fs.stat(path.join(folderPath, item.name));
      const [name, extension, size] = [
        path.basename(item.name, path.extname(item.name)),
        path.extname(item.name).slice(1),
        stats.size,
      ];
      console.log(name + ' - ' + extension + ' - ' + size + 'b');
    }
  }
}
