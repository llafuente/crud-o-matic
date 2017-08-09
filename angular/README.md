# BB4UI dev
=========


## publish new version


```bash
cd src\bb4ui
VERSION=$(npm version patch)
git commit -a -m "${VERSION}"
git tag "${VERSION}"
npm publish .
```
