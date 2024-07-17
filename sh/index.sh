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
INDEX="${dir}/${INDEX}"
SUMMARY="${dir}/${SUMMARY}"
UPDATE="${dir}/${UPDATE}"

#
_INDEX="$(sha512sum "$INDEX")"
_SUMMARY="$(sha512sum "$SUMMARY")"

#
CMD="${script} '$INDEX' '$SUMMARY'"
eval "$CMD"

#
__INDEX="$(sha512sum "$INDEX")"
__SUMMARY="$(sha512sum "$SUMMARY")"

#
echo

if [[ "$_INDEX" != "$__INDEX" || "$_SUMMARY" != "$__SUMMARY" ]]; then
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

