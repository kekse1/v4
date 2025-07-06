#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v0.0.1
# 
# This will call the `blog.js` with my parameters.
#

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
root="$(realpath "${dir}/../")"
script="$(realpath "${dir}/blog.js")"
json="$(realpath "${root}/home/blog/blog.json")"
blog="$(realpath "${root}/home/blog/main.txt")"
body="$(realpath "${root}/home/blog/body/")"

#
cmd="${script} --blog '${blog}' --json '${json}' --body '${body}'"
#echo "'$cmd'"
eval "$cmd"

