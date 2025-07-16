#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v0.2.0
# 
# This will call the `news.js` with my parameters.
#

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
root="$(realpath "${dir}/../")"
script="$(realpath "${dir}/news.js")"
json="home/news/news.json"
output="$(realpath "${root}/${json}")"
root="$(realpath "${root}/htdocs/")"
exclude=( "home/sources/sources.json" "home/sources/summary.json" )

#
cmd="${script} --root '${root}' --output '${output}' --self '${json}'"

for i in "${exclude[@]}"; do
	cmd+=" --exclude '$i'"
done

#echo "'$cmd'"
eval "$cmd"

