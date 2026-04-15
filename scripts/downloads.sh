#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v0.1.2
# 
# This will call the `list.js` with my parameters (for `~downloads`);
#

#
_REFRESH=0 # <=0 to disable!
_BUFFER=0 # <=0 for default (1024*64);
_PARALLEL=16 # 0 for Infinity, below for defaults
_SORT="off" # don't sort the progres bars!?
_COMPARE="" # better provide manual override "--compare no/off/false".
_EXT="" # filter files by extension(s)? ':' as delim.

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
root="$(realpath "${dir}/../")"
home="$(realpath "${root}/home/downloads/")"
script="$(realpath "${dir}/list.js")"
output="$(realpath "${home}/main.json")"
search="$(realpath "${home}/files/")"
update="$(realpath "${home}/downloads.now")"

#
cmd="${script} --search '${search}' --output '${output}' --root '${root}' --home '${downloads}' --update '${update}' --buffer ${_BUFFER}"

[[ $_REFRESH -gt 0 ]] && cmd+=" --progress on --refresh ${_REFRESH}"
[[ $_PARALLEL -ge 0 ]] && cmd+=" --parallel ${_PARALLEL}"
[[ -n "$_SORT" ]] && cmd+=" --sort $_SORT"
[[ -n "$_COMPARE" ]] && cmd+=" --compare ${_COMPARE}"
[[ -n "$_EXT" ]] && cmd+=" --extension '${_EXT}'"

for i in "$@"; do
	cmd+=" '${i}'"
done

#echo "'$cmd'"
eval "$cmd"

