#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# 

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
#
cd "$dir"

#
_GIT_DATE_FORMAT='%s'
_GIT_UPDATE_MESSAGE='' #Global github://kekse1/ update'

if [[ $# -eq 0 ]]; then
	echo -e " >> Global update without add/commit/push! :-)"
else
	_GIT_UPDATE_DATE="`date +\"${_GIT_DATE_FORMAT}\"`"
	_GIT_UPDATE_MESSAGE="$*"
	echo " >> Global update with commit message (${_GIT_UPDATE_DATE}):"
	echo "    '$*'"
	_GIT_UPDATE_MESSAGE="[${_GIT_UPDATE_DATE}] ${_GIT_UPDATE_MESSAGE}"
fi

echo -e "\n\n" 
count=0
errors=0

for i in *; do
	[[ -d $i ]] || continue
	[[ -d $i/.git ]] || continue
	let count=$count+1
	cd $i/

	if [[ $? -eq 0 ]]; then
		echo -e "\n\n >> '$i'\n\n"
	else
		cd ../
		let errors=$errors+1
		echo -e "\n\nError #${errors}! :-(\n\n"
		continue
	fi

	git pull

	if [[ $? -ne 0 ]]; then
		cd ../
		let errors=$errors+1
		echo -e "\n\nError #${errors}! :-(\n\n"
		continue
	fi

	if [[ $# -eq 0 ]]; then
		cd ../
		continue
	fi

	git add --all
	git commit -m "$_txt"
	git push

	if [[ $? -ne 0 ]]; then
		let errors=$errors+1
		echo -e "\n\nError #${errors}! :-/"
	fi

	echo
	echo
	cd ../
done

echo; echo; echo;
echo -e " >> Totally $count repositories updated! :-)"
[[ $errors -gt 0 ]] && echo -e " >> But there were $errors errors!" >&2

