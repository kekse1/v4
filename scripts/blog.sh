#!/usr/bin/env bash

# 
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/v4/
# v0.1.1
# 
# This will call the `blog.js` with my parameters.
#

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
root="$(realpath "${dir}/../")"
script="$(realpath "${dir}/blog.js")"
json="$(realpath "${root}/home/blog/main.json")"
blog="$(realpath "${root}/home/blog/main.txt")"
body="$(realpath "${root}/home/blog/body/")"

#
stop()
{
	case "$1" in
		1)
			echo "Unable to delete old backup directory." >&2
			;;
		2)
			echo "Unable to create backup." >&2
			;;
		3)
			echo "Unable to create output directory." >&2
			;;
		4)
			echo "The input .txt file is not existing (as file)!" >&2
			;;
		5)
			echo "Unable to backup original .json output file." >&2
			;;
		*)
			echo "ERROR" >&2
			;;
	esac

	exit $1
}

#
[[ -f "$blog" ]] || stop 4

#
if [[ -e "$body" ]]; then
	backup="${body}.ORIG"
	[[ -e "$backup" ]] && (rm -rf "$backup" || stop 1)
	mv "$body" "$backup" || stop 2
fi

[[ -e "$body" ]] || (mkdir -p "$body" || stop 3)

if [[ -e "$json" ]]; then
	backup="${json}.ORIG"
	mv "$json" "$backup" || stop 5
fi

#
cmd="${script} --blog '${blog}' --json '${json}' --body '${body}'"
#echo "'$cmd'"
eval "$cmd"

