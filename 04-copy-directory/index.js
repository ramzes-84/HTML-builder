const path = require('path');
const fs = require('fs/promises');
const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

cloneDir();

async function cloneDir() {
  await fs.mkdir(targetDir, {recursive: true});
  const fileList = await fs.readdir(sourceDir);
  const cloneList = await fs.readdir(targetDir);

  cloneList.forEach(async (file) => {
    if (!fileList.includes(file)) {
      await fs.unlink(path.join(targetDir, file));
    }
  });

  fileList.forEach(async (file) => {
    await fs.copyFile(path.join(sourceDir, file), path.join(targetDir, file));
  });
}
