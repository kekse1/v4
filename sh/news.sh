#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v0.1.0
# 
# This will call the `news.js` with my parameters.
#

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
root="$(realpath "${dir}/../")"
script="$(realpath "${dir}/news.js")"
output="$(realpath "${root}/home/news/news.json")"

#
cmd="${script} --root '${root}' --output '${output}'"
#echo "'$cmd'"
eval "$cmd"

