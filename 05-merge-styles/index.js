const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const stylesPath = path.join(__dirname, 'styles');
const targetCSSPath = path.join(__dirname, 'project-dist', 'bundle.css');

composeCSS();

async function composeCSS() {
  let result;
  const filesList = await fsPromises.readdir(stylesPath, {withFileTypes: true});
  const allFiles = filesList.filter((file) => (path.extname(file.name) === '.css') && (file.isFile()));
  const onlyCSSFiles = allFiles.map((file) => file.name);

  for (let item of onlyCSSFiles) {
    const partOfCSS = await fsPromises.readFile(path.join(stylesPath, item), {encoding: 'utf8'})
    result += partOfCSS;
  }

  await fsPromises.writeFile(targetCSSPath, result)
}