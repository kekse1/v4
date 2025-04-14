#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v1.0.0
#
# This will call the `index.js` with my parameters.
#

#
GOOGLE="main"

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
script="$(realpath "${dir}/google.js")"
root="$(realpath "${dir}/../")"
library="$(realpath "${root}/js")"
home="$(realpath "${root}/home/")"
google="$(realpath "${home}/${GOOGLE}")"

#
CMD="${script} --home '${home}' --google '${google}'"

for i in "$@"; do
	CMD="${CMD} '$i'"
done

eval "$CMD"

