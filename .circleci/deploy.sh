git config --global user.name "QC-L"
git config --global user.email "github@liqichang.com"
git remote set-url origin git@github.com:reactjs/zh-hans.reactjs.org.git

chmod -R 777 node_modules/gh-pages/
yarn build
yarn deploy
