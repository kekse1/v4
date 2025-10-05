#!/usr/bin/env bash

real="$(realpath "$0")"
dir="$(dirname "$real")"
usr="$(realpath "$dir/../usr/")"
bin="$(realpath "$usr/bin/")"
sbin="$(realpath "$usr/sbin/")"
base="$(realpath "$dir/../")"
base="$(basename "$base")"

#
toGrep="export PATH=\"$bin:"
p=""
[[ -d "/data/data/com.termux/" ]] && p="/data/data/com.termux/files/usr"
grep "$toGrep" $p/etc/profile.d/*.sh >/dev/null 2>&1
testRootInstall=$?
grep "$toGrep" $HOME/*.sh >/dev/null 2>&1
testUserInstall=$?
installed=0

if [[ $testRootInstall -eq 0 ]]; then
	testRootInstall=1
	installed=1
else
	testRootInstall=0
fi

if [[ $testUserInstall -eq 0 ]]; then
	testUserInstall=1
	installed=1
else
	testUserInstall=0
fi

#
if [[ $installed -eq 0 ]]; then
	echo " >> NOT already installed, so we can continue. :-)"
else
	installed=" >> Already installed, so we abort here. ;-(
 >> Installed in"

 	if [[ $testRootInstall -ne 0 ]]; then
		installed="$installed 'root'"
		[[ $testUserInstall -ne 0 ]] && installed="$installed and 'user'"
	elif [[ $testUserInstall -ne 0 ]]; then
		installed="$installed 'user'"
	fi

 	installed="$installed mode, btw."

	echo "$installed" >&2
	exit 4
fi

#
COMMENT="< https://kekse.biz/ >"

#
FILE=""

if [[ -n "$base" ]]; then
	FILE="$base.sh"
else
	FILE="v4.sh"
fi

#
TARGET=""
REF=".bash_profile"

if [[ -d "/data/data/com.termux/" ]]; then
	TARGET="/data/data/com.termux/files/usr/etc/profile.d/${FILE}"
	REF=""
elif [[ `id -u` -ne 0 ]]; then
	echo " >> Are you sure you don't want to install only locally with user '`whoami`'?" >&2
	echo " >> This means the library can\'t be used system-wide (and is only below '$HOME').." >&2

	read -p '   Are you sure [Yes/No]? ' sure

	case "$sure" in
		y*|Y*) echo " >> OK, so we will continue here.";;
		*) echo " >> Fine, so we are aborting the installation now."; exit 1;;
	esac

	TARGET="$HOME/${FILE}"
else
	REF=""
	TARGET="/etc/profile.d/${FILE}"

	if [[ ! -d "/etc/profile.d/" ]]; then
		echo " >> Aborting installation, no '/etc/profile.d/' directory found!" >&2
		exit 3
	fi
fi

if [[ -e "$TARGET" ]]; then
	echo " >> Already installed ('$TARGET')." >&2
	exit 2
fi

echo "# ${COMMENT}" >"$TARGET"
echo "export PATH=\"${bin}:\${PATH}\"" >>"$TARGET"
echo "[[ \`id -u\` -eq 0 ]] && export PATH=\"${sbin}:\${PATH}\"" >>"$TARGET"
chmod +x "$TARGET"

[[ -n "$REF" ]] && for i in $REF; do
	ref="$HOME/$i"
	echo >>$ref
	echo "# ${COMMENT}" >>$ref
	echo ". ${TARGET}" >>$ref
done

[[ $? -eq 0 ]] && echo " >> Installed in '$TARGET':"
echo

while IFS= read line
do
	#[[ "${line}" = "" ]] && continue
	echo "	>> ${line}" >&2
done <"${TARGET}"
echo

if [[ -n $REF ]]; then
	echo " >> Referenced your new '$FILE' (via source '.') in:"

	[[ -n "$REF" ]] && for i in $REF; do
		echo "    >> '\$HOME/$i'"
	done

	echo
fi
