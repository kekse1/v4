#!/usr/bin/env bash

# kuchen@kekse.biz
# https://kekse.biz/
#
# will call my `index.js` with my parameters..

#
INDEX="index.json"
SUMMARY="summary.json"

#
real="$(realpath "$0")"
dir="$(dirname "$real")"
script="$(realpath "${dir}/index.js")"

INDEX="${dir}/${INDEX}"
SUMMARY="${dir}/${SUMMARY}"

#
CMD="${script} '$INDEX' '$SUMMARY'"
eval "$CMD"

