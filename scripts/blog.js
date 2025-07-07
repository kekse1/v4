#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.1.0
 *
 * Helper script for my v4 project @ https://github.com/kekse1/v4/.
 *
 * This *will* parse my 'BLOG.txt' and create:
 * 	(a) the 'blog.json' INDEX (for ~blog dynamics)
 * 	(b) every entry's 'body', each as '*.txt'
 *
 * TODO!
 */

//
const DEFAULT_BUFFER = (1024 * 256);
const DEFAULT_ENCODING = 'utf8';

//
import { ready } from '../js/lib.js';

//
// --blog (.txt)
// --json
// --body (dir 4 .txt)
//
var args = null; ready(() => main(args = getopt()));

const main = (_args = args) => {
	//
	//todo/theor. sollte ich die argv[] genau pruefen;
	//	... gehe aber erstmal von korrektheit aus.
	//
	
	const stream = fs.createReadStream(
		_args.get('blog'), {
			encoding: DEFAULT_ENCODING,
			autoClose: true,
			emitClose: true,
			highWaterMark: DEFAULT_BUFFER });
	stream.once('end', (... _a) => finish(
		stream, ... _a));
	stream.on('data', (... _a) => chunk(
		stream, ... _a));
};

const finish = (_stream) => {
	console.dir('fin');
};

const chunk = (_stream, _chunk) => {
	console.dir(_chunk.length);
	parse(_chunk);
};

const parse = (_chunk) => {
	//
};

const state = {};

//

