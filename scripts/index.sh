#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v0.4.0
#
# This will call the `index.js` with my parameters.
#

#
INDEX="index.json"
SUMMARY="summary.json"
UPDATE="version.now"

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
script="$(realpath "${dir}/index.js")"
root="$(realpath "${dir}/../")"
sources="$(realpath "${root}/home/sources/")"

#
FORCE=0
[[ $# -gt 0 ]] && FORCE=1

#
INDEX="${sources}/${INDEX}"
SUMMARY="${sources}/${SUMMARY}"
UPDATE="${sources}/${UPDATE}"

#
_INDEX=''
_SUMMARY=''
__INDEX=''
__SUMMARY=''

if [[ $FORCE -eq 0 ]]; then
	_INDEX="$(sha512sum "$INDEX")"
	_SUMMARY="$(sha512sum "$SUMMARY")"
fi

#
CMD="${script} '$INDEX' '$SUMMARY'"
eval "$CMD"

#
if [[ $FORCE -eq 0 ]]; then
	__INDEX="$(sha512sum "$INDEX")"
	__SUMMARY="$(sha512sum "$SUMMARY")"
fi

#
echo

if [[ $FORCE -ne 0 || "$_SUMMARY" != "$__SUMMARY" ]]; then
	now="$((`date +'%s%N'`/1000000))"

	if [[ "$_SUMMARY" != "$__SUMMARY" ]]; then
		echo -e " >> Sources \e[1mchanged\e[0m!"
	else
		echo -e " >> \e[1mForced\e[0m version update!"
	fi

	echo -n "$now" >"${UPDATE}"
	r=$?
	if [[ $r -eq 0 ]]; then
		echo " >> So I also updated: '$(basename "${UPDATE}")' (${now})"
	else
		echo " >> BUT writing file failed ($r): '$(basename "${UPDATE}")'"
	fi
else
	echo -e " >> \e[1mNothing\e[0m changed."
fi

