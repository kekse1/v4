#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v1.0.0
#
# This will call the `index.js` with my parameters.
#

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
script="$(realpath "${dir}/index.js")"
root="$(realpath "${dir}/../")"
library="$(realpath "${root}/js")"
sources="$(realpath "${root}/home/sources/")"
update="$(realpath "${sources}/version.now")"
index="$(realpath "${sources}/sources.json")"
summary="$(realpath "${sources}/summary.json")"

#
CMD="${script} --index '${index}' --summary '${summary}' --update '${update}' --root '${root}' --library '${library}'"

for i in "$@"; do
	CMD="${CMD} '$i'"
done

eval "$CMD"

