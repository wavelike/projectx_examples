#!/usr/bin/env bash

# The scss folder is searched for files with '.scss' extension, that do not start with "_" (partial file).
# Then, the node-sass preprocessor is used on them to create new css files in the css directory

for filename in client/scss/*.scss; do
    echo "\n"
    echo $filename
    echo ${filename:12:1}
    if [ ${filename:12:1} != "_" ]; then
        echo ${filename:12:-5}
        node_modules/node-sass/bin/node-sass $filename client/css/${filename:12:-5}.css
    fi
done