#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/
# v0.2.1
#

#
_UPDATE="BLOG"

#
realpath="$(realpath "$0")"
dirname="$(dirname "$realpath")"
blog="$(realpath "$dirname/../home/blog/")"
file="update.now"

#
echo -e "Updating $_UPDATE timestamp ...\n"

#
if [[ -r "${blog}/${file}" ]]; then
	echo "Old timestamp: $(cat "${blog}/${file}")"
else
	echo "Old timestamp: (none)"
fi

#
now="$((`date +'%s%N'`/1000000))"
echo -n "$now" >"${blog}/${file}"
echo "New timestamp: ${now}"

