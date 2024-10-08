const fs = require('fs');
const path = require('path');

// ファイルまたはフォルダをコピーする関数
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    // 目的のディレクトリを作成
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    // ディレクトリ内のファイルをループして再帰的にコピー
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    // ファイルをコピー
    fs.copyFileSync(src, dest);
  }
}

// ソースファイルとターゲットファイルのパス
const sourceHtml = path.join(__dirname, 'index.html');
const destinationHtml = path.join(__dirname, 'dist', 'index.html');

const sourceImg = path.join(__dirname, 'img');
const destinationImg = path.join(__dirname, 'dist', 'img');

// distディレクトリが存在することを確認
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

// index.htmlファイルを読み込む
let htmlContent = fs.readFileSync(sourceHtml, 'utf8');

// ./distを./に置き換える
htmlContent = htmlContent.replace(/\.\/dist\//g, './');

// 修正された内容をdist/index.htmlに書き込む
fs.writeFileSync(destinationHtml, htmlContent);
console.log('index.htmlは更新されたパスでdistフォルダに正常にコピーされました。');

// imgフォルダをコピー
copyRecursiveSync(sourceImg, destinationImg);
console.log('imgフォルダは正常にdistフォルダにコピーされました。');
