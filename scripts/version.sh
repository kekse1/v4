#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/
# v0.1.0
#

#realpath="$(realpath "$0")"
#dirname="$(dirname "$realpath")"
#status="$(realpath "$dirname/../status/")"

base="./"
file="version.now"
dir="status"


if [[ ! -d "$dir" ]]; then
	echo " >> The target directory '$dir' doesn\'t exist [as directory]!" >&2
	exit 1
fi

now="$((`date +'%s%N'`/1000000))"
echo "$now"
#echo "$now" >"$status/$file"
echo "$now" >"${base}/${dir}/${file}"

