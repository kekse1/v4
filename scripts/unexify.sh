#!/usr/bin/env bash

header="  Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
    https://kekse.biz/
    https://github.com/kekse1/scripts/"
version="v0.1.3"
help="${header}
  ${version}

  Little helper script to recursively remove all headers from images.

  The primary intention is to secure *all* images in your web root.
  So e.g. when you take photos with your smartphone, they'll no longer
  contain the GPS coordinates, etc. ;-)

  Dependencies: The \`exiftool\` <https://exiftool.org/>
  Debian Linux packet is \`libimage-exiftool-perl\`.

  This script will also check if the tool is available/installed on your system.

        Usage: unexify.sh <directory> [ <optional exiftool parameters> ]
                          -h / --help
                          -V / --version

  So define *one* directory at first, then you *may* argue with all parameters
  the \`exiftool\` may have; they'll be appended to our regular command line. :)

  Directory may also be '.', to use the current working directory ('\$PWD').
  
  _HINT_: Append the '-overwrite_original' parameter to *not* create backup files
  of your images. This is a bit risk, but there'll be no files ('*_original') left
  which could be opened by web site visitors or so. ;-)

  So, that's all. Have phun! The cake."

helpMe()
{
	echo -e "$help"
}

showVersion()
{
	echo -e "${version}\n${header}"
	exit
}

# ask for help, etc..
for i in "$@"; do
	case "$i" in
		'-h'|'--help') helpMe; exit;;
		'-V'|'--version') showVersion;;
	esac
done

# abstraction is useful, mostly. ^_^
ZERO='exiftool'
NAME='libimage-exiftool-perl'
HTTP='https://exiftool.org/'
ARGS="-all= -r" # `exiftool -all= -r $DIR`

# check if `exiftool` is installed, otherwise only output error, etc.
zero="$(which "$ZERO" 2>/dev/null)"
# and prepare the target directory from cmdline
dir=
cmd=

# first test for valid target directory, and maybe do some rest..
if [[ -z "$zero" ]]; then
	echo " >> The '$ZERO' is not installed, so you can't use this tool." >&2
	echo " >> If you use Debian Linux, please \`apt install $NAME\`." >&2
	echo " >> Otherwise, you could take a look at '$HTTP'." >&2
	exit 1
elif [[ -z "$1" ]]; then
	echo " >> No valid directory to traverse for image files specified!" >&2
	echo " >> Take a look at the output of \`-h / --help\` parameter, please!" >&2
	exit 2
else
	dir="$(realpath "$1")"
	[[ "${dir:(-1)}" == '/' ]] || dir="${dir}/"

	if [[ ! -d "$dir" ]]; then
		echo " >> Target directory '$dir' doesn't exist! Exiting now.." >&2
		exit 3
	else
		echo
		echo " >> This tool will call \`$ZERO $ARGS\` to recursively remove all"
		echo -e " >> image file headers (to secure them, so e.g. removing GPS coords, etc..\n"
		echo " >> MAYBE you also want to add the '-overwrite_original' parameter,"
		echo " >> so _no_ '*_original' backup file would be viewable via web browser?!"
		echo
		shift
		cmd="$*"
		echo " >> The \`$ZERO\` is located here: '$zero'"
		echo " >> Target directory is: '$dir'"
		if [[ -z "$cmd" ]]; then
			echo " >> NO additional parameters for the \`$ZERO\` defined."
		else
			echo " >> Additional parameters: '$cmd'"
		fi
		echo
	fi
fi

# function to ask, see here below..
askToContinue()
{
	local cont; while true; do
		echo " >> Directory: '$dir'"
		read -p " >> Do you want to continue [Yes/No]? " cont

		case "${cont,,}" in
			y*) return 0;;
			n*) return 1;;
			*) echo -e "\n >> Invalid input, please try again (with 'y' or 'n')." >&2;;
		esac
	done
}

# ask if user is sure.. if so, create the $CMD line..
CMD=
askToContinue

if [[ $? -eq 0 ]]; then
	CMD="${zero} ${dir} ${ARGS} ${cmd}"
	echo -e "\n >> Great! \`$ZERO\` will continue, now. Here's your command line:"
	echo -e "    \`$CMD\`\n\n\n"
else
	echo -e "\n >> OK, we're aborting right here, script will do nothing else." >&2
	exit 255
fi

# DO IT!
eval "$CMD"
ret=$?
echo -en "\n\n.. returned ($ret). "
[[ $ret -eq 0 ]] && echo -e "... (0) \033[1m:-)\033[0m" || echo -e "... ($ret) \033[1m:-(\033[0m"

