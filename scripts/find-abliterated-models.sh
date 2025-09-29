#!/usr/bin/env bash
#
# Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
# https://kekse.biz/ https://github.com/kekse1/
# v0.3.0
#
# Find all models over my root (model) directory and
# create a .tar of all of them (to be extracted on my
# server, to publish them alone, each one a file - see
# my < https://kekse.biz/?~models > web page. :-)
#
#
#
# TODO # ich koennte eher `tar -r` nutzen... statt alles in ein
# temporaeres verzeichnis zu kopieren.. spart diesen temporaeren
# speicher. .. aber vergiss `-C` nicht... ohne pfade also!
#
#

#
_target="$1"

if [[ -z "$_target" ]]; then
	echo -e "Syntax: \$0 < target >" >&2
	echo -e "\nIf <target> ends with '.tar', we'll also use \`tar\` here."
	exit 1
fi

_target="$(realpath "$_target" 2>/dev/null)"

if [[ $? -ne 0 ]]; then
	echo -e "ERROR: Invalid target archive file path!" >&2
	exit 2
elif [[ -e "$_target" ]]; then
	echo -e "ERROR: Target archive path already exists!" >&2
	exit 3
fi

_tar=0
_tmp_var="${_target,,}"
_tmp_var="${_tmp_var: -4}"

if [[ "$_tmp_var" != ".tar" ]]; then
	_tmpdir="$(realpath "$_target/" 2>/dev/null)"

	if [[ -e "$_tmpdir" ]]; then
		echo -e "ERROR: Target path already exists!" >&2
		exit 4
	fi
else
	_tar=1
	_tmpdir="$(realpath "./tmp.${RANDOM}${RANDOM}")"

	while [[ -e "$_tmpdir" ]]; do
		_tmpdir="$(realpath "./tmp.${RANDOM}${RANDOM}")"
	done
fi

mkdir "$_tmpdir"

if [[ $? -ne 0 ]]; then
	echo -n "ERROR: Unable to create "
	[[ $_tar -eq 0 ]] && echo "temporary directory!" || echo "target directory"
	exit 5
fi

#
_exit()
{
	[[ -d "$_tmpdir" ]] && rm -rf "$_tmpdir"
	exit $1
}

trap "rm -rf '$_tmpdir'" SIGINT

#
models=0

while read -r file; do
	name="$(basename "$file")"
	orig="$name"
	
	_count=0; while [[ -f "${_tmpdir}/${_name}" ]]; do
		((++_count))
		name="($_count) ${orig}"
	done

	cp "$file" "${_tmpdir}/${name}"
	res=$?

	if [[ $res -ne 0 ]]; then
		echo -e "ERROR: Unable to copy file (exit code = ${res})!" >&2
		echo -e "\t'${file}'" >&2
		_exit 6
	fi

	((++models))
done < <(find -type f -iname '*abliterated*.gguf' -not -path "$_tmpdir")

#
if [[ $models -eq 0 ]]; then
	echo -e "WARN: No GGUF models found! So we're aborting here.." >&2
	_exit 7
fi

#
if [[ $_tar -ne 0 ]]; then
	cd "$_tmpdir"
	tar -cf "$_target" ./
	res=$?

	if [[ $res -ne 0 ]]; then
		echo -e "ERROR: Unable to \`tar\` (exit code = ${res})!" >&2
		_exit 8
	fi

	rm -rf "$_tmpdir"
	res=$?

	if [[ $res -ne 0 ]]; then
		echo -e "ERROR: Unable to delete temporary directory (exit code = ${res})!" >&2
		echo -e "\t'${_tmpdir}'" >&2
		_exit 9
	fi
fi

echo -e "SUCCESS! :-)"

if [[ $_tar -eq 0 ]]; then
	echo -e "Your files are in '${_target}/':\n"
	ls -l "$_target"
else
	echo -e "Your files are packed into '${_target}'\n"
	tar -tf "$_target"
fi

