#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v1.0.1
#
# This will call the `index.js` with my parameters.
#

#
INDEX="main"
INDEX_EXT=( php html htm txt pdf js css )

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
script="$(realpath "${dir}/home.js")"
root="$(realpath "${dir}/../")"
home="$(realpath "${root}/home/")"

#
CMD="${script} --home '${home}' --index '${INDEX}' --index-ext '"

for i in "${INDEX_EXT[@]}"; do
	CMD+="$i,"
done

CMD="${CMD:: -1}'"

for i in "$@"; do
	CMD="${CMD} '$i'"
done

eval "$CMD"

