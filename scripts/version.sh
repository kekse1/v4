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
now="$((`date +'%s%N'`/1000000))"
echo "$now"
echo -n "$now" >"${status}/${file}"

