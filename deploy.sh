#!/usr/bin/env sh

# abort on errors
set -e

# bulid
npm run build

# navigate into the build output directory
cd dist

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/r000tmnt/My-vue-IG-interface.git master:gh-pages

cd -