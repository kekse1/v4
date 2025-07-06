#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.0.1
 *
 * Helper script for my v4 project @ https://github.com/kekse1/v4/.
 *
 * This *will* parse my 'BLOG.txt' and create:
 * 	(a) the 'blog.json' INDEX (for ~blog dynamics)
 * 	(b) every entry's 'body', each as '*.txt'
 *
 * TODO!
 */

import { ready } from '../js/lib.js';
var args = null; ready(() => {
	args = getopt();
	console.dir({args});
	main(args);
});

const main = (_args = args) => {
	console.error('TODO');
};

