#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/
# v0.2.0
#

#
realpath="$(realpath "$0")"
dirname="$(dirname "$realpath")"
status="$(realpath "$dirname/../status/")"
file="version.now"

#
if [[ -r "${status}/${file}" ]]; then
	echo "Old timestamp: $(cat "${status}/${file}")"
else
	echo "Old timestamp: (none)"
fi

#
now="$((`date +'%s%N'`/1000000))"
echo -n "$now" >"${status}/${file}"
echo "New timestamp: ${now}"

