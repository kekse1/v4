#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/
# v0.2.1
#

#
_UPDATE="LINKS"

#
echo -e "Updating $_UPDATE timestamp ...\n"

#
realpath="$(realpath "$0")"
dirname="$(dirname "$realpath")"
links="$(realpath "$dirname/../home/links/")"
file="update.now"

#
if [[ -r "${links}/${file}" ]]; then
	echo "Old timestamp: $(cat "${links}/${file}")"
else
	echo "Old timestamp: (none)"
fi

#
now="$((`date +'%s%N'`/1000000))"
echo -n "$now" >"${links}/${file}"
echo "New timestamp: ${now}"

