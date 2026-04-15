#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v0.1.3
#  
# This will call the `list.js` with my parameters (for `~downloads`);
#

#
_LOCK_HOST="kekse.biz"

#
_REFRESH=1000 # <=0 to disable!
_BUFFER=0 # <=0 for default (1024*64);
_PARALLEL=6 # 0 for Infinity, below for defaults
_SORT="on" # sort the progress bars..!?!
_COMPARE="yes" # better provide manual override "--compare no/off/false".
_EXT="gguf" # filter files by extension(s)? ':' as delim.

#
if [[ -n "$_LOCK_HOST" && "`hostname`" != "$_LOCK_HOST" ]]; then
	echo "Are you sure you want to run this script on this host!??" >&2
	echo "Try it on '${_LOCK_HOST}' again (or adapt this script)." >&2
	exit 112
fi

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
root="$(realpath "${dir}/../")"
home="$(realpath "${root}/home/models/")"
script="$(realpath "${dir}/list.js")"
output="$(realpath "${home}/main.json")"
search="$(realpath "${home}/gguf/")"
update="$(realpath "${home}/models.now")"

#
cmd="${script} --search '${search}' --output '${output}' --root '${root}' --home '${downloads}' --update '${update}' --buffer ${_BUFFER}"
[[ $_REFRESH -gt 0 ]] && cmd+=" --progress on --refresh ${_REFRESH}"
[[ $_PARALLEL -ge 0 ]] && cmd+=" --parallel ${_PARALLEL}"
[[ -n "$_SORT" ]] && cmd+=" --sort ${_SORT}"
[[ -n "$_COMPARE" ]] && cmd+=" --compare ${_COMPARE}"
[[ -n "$_EXT" ]] && cmd+=" --extension '${_EXT}'"

for i in "$@"; do
	cmd+=" '${i}'"
done

#echo "'$cmd'"
eval "$cmd"

