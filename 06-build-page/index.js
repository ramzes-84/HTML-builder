const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

const stylesPath = path.join(__dirname, 'styles');
const targetProjPath = path.join(__dirname, 'project-dist');
const targetCSSPath = path.join(__dirname, 'project-dist', 'style.css');
const elemPath = path.join(__dirname, 'components');
const elemObj = {};

composeCSS();
composeHTML();
cloneDir('assets');

async function cloneDir(folder) {
  await fsPromises.mkdir(path.join(targetProjPath, folder), { recursive: true });
  const srcFiles = await fsPromises.readdir(path.join(targetProjPath, folder));

  for (let item of srcFiles) {
    await fsPromises.rm(path.join(targetProjPath, folder, item), { force: true, recursive: true });
  }

  const targetFiles = await fsPromises.readdir(path.join(__dirname, folder), {withFileTypes: true});

  for (let item of targetFiles) {
    if (item.isFile()) {
      await fsPromises.copyFile(path.join(__dirname, folder, item.name), path.join(targetProjPath, folder, item.name));
    } else {
      await cloneDir(path.join(folder, item.name));
    }
  }
}

async function composeHTML() {
  const elemList = await fsPromises.readdir(elemPath, {withFileTypes: true});
  const allFiles = elemList.filter((file) => (path.extname(file.name) === '.html') && (file.isFile()));
  const elemFiles = allFiles.map((file) => file.name);

  for (let item of elemFiles) {
    const contentHTML = await fsPromises.readFile(path.join(elemPath, item));
    elemObj[path.parse(item).name] = contentHTML.toString();
  }

  const buffer = await fsPromises.readFile(path.join(__dirname, 'template.html'), {encoding: 'utf8'});
  let result = buffer;

  for (let elem in elemObj) {
    const reg = new RegExp(`{{${elem}}}`, 'gi');
    result = result.replace(reg, elemObj[elem]);
  }

  await fsPromises.writeFile(path.join(targetProjPath, 'index.html'), result);
}

async function composeCSS() {
  let result;
  const filesList = await fsPromises.readdir(stylesPath, {withFileTypes: true});
  const allFiles = filesList.filter((file) => (path.extname(file.name) === '.css') && (file.isFile()));
  const onlyCSSFiles = allFiles.map((file) => file.name);

  await fsPromises.mkdir(targetProjPath, {recursive: true});

  for (let item of onlyCSSFiles) {
    const partOfCSS = await fsPromises.readFile(path.join(stylesPath, item), {encoding: 'utf8'});
    fs.appendFile(targetCSSPath, partOfCSS, (error) => {
      if (error) return console.error(error.message);
    });
  }
}
