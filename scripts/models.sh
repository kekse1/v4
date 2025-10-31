#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v0.1.0
# 
# This will call the `list.js` with my parameters (for `~downloads`);
#

_REFRESH=1000 # <=0 to disable!
_BUFFER=0 # <=0 for default (1024*64);

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
root="$(realpath "${dir}/../")"
home="$(realpath "${root}/home/models/")"
script="$(realpath "${dir}/list.js")"
output="$(realpath "${home}/main.json")"
search="$(realpath "${home}/files/")"
update="$(realpath "${home}/models.now")"

#
cmd="${script} --search '${search}' --output '${output}' --root '${root}' --home '${downloads}' --update '${update}' --buffer ${_BUFFER}"
[[ $_REFRESH -gt 0 ]] && cmd+=" --progress on --refresh ${_REFRESH}"

#echo "'$cmd'"
eval "$cmd"

