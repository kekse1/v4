#!/usr/bin/env bash

# kuchen@kekse.biz
# https://kekse.biz/
#
# will call my `index.js` with my parameters..

#
INDEX="index.json"
SUMMARY="summary.json"
UPDATE="version.now"

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
script="$(realpath "${dir}/index.js")"

#
FORCE=0
[[ $# -gt 0 ]] && FORCE=1

#
INDEX="${dir}/${INDEX}"
SUMMARY="${dir}/${SUMMARY}"
UPDATE="${dir}/${UPDATE}"

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

if [[ $FORCE -ne 0 || "$_INDEX" != "$__INDEX" || "$_SUMMARY" != "$__SUMMARY" ]]; then
	now="$((`date +'%s%N'`/1000000))"
	echo -e " >> Sources \e[1mchanged\e[0m!"
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

