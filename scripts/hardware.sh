#!/usr/bin/env bash

#
_TABS=0

#
if [[ ! -d ~/git/hardware/ ]]; then
	echo " >> No '~/git/hardware/' directory found." >&2
	exit 1
else
	echo " >> '~/git/hardware/' is the hardware I own."
fi

dirname="$(realpath ./)"
cd ~/git/

# -N ??
tree -d --charset=UTF-8 --nolinks --noreport -- hardware/ >"${dirname}/main.txt"
tree -d --charset=UTF-8 --nolinks --noreport -X -- hardware/ >"${dirname}/main.xml"
tree -d --charset=UTF-8 --nolinks --noreport -J -- hardware/ >"${dirname}/main.json"

if [[ $_TABS -gt 0 ]]; then
	sed -i '1d' "${dirname}/main.txt"
	tabs=""; for i in `seq 1 $_TABS`; do tabs+=$'\t'; done
	sed -i "s/^/$tabs/" "${dirname}/main.txt"
	echo " >> Inserted $_TABS tabs as line prefices in the 'main.txt'."
fi

echo " >> Just generated 'main.{txt,xml,json}'. :)~"
echo " >> Location is '$dirname' (./)."

