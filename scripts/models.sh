#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v0.1.0
# 
# This will call the `list.js` with my parameters (for `~downloads`);
#

#
_REFRESH=1000 # <=0 to disable!
_BUFFER=0 # <=0 for default (1024*64);
_PARALLEL=6 # 0 for Infinity, below for defaults

#
if [[ "`hostname`" != "kekse.biz" ]]; then
	echo "Are you sure you want to run this script on this host!??" >&2
	exit 110
fi

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
[[ $_PARALLEL -ge 0 ]] && cmd+=" --parallel ${_PARALLEL}"

#echo "'$cmd'"
eval "$cmd"

