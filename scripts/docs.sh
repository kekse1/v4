#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v0.1.0
# 
# This will call the `list.js` with my parameters (for `~docs`);
#

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
root="$(realpath "${dir}/../")"
home="$(realpath "${root}/home/docs/")"
script="$(realpath "${dir}/list.js")"
output="$(realpath "${home}/docs.json")"
search="$(realpath "${home}/files/")"

#
cmd="${script} --search '${search}' --output '${output}' --root '${root}' --home '${docs}'"
#echo "'$cmd'"
eval "$cmd"

