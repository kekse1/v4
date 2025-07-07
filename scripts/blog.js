#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.4.1
 *
 * Helper script for my v4 project @ https://github.com/kekse1/v4/.
 *
 * This *will* parse my 'BLOG.txt' and create:
 * 	(a) the 'blog.json' INDEX (for ~blog dynamics)
 * 	(b) every entry's 'body', each as '*.txt'
 *
 *
 * TODO!!1 ... and really untested atm..
 *
 */

//
const DEFAULT_BUFFER = (1024 * 512);
const DEFAULT_ENCODING = 'utf8';

//
import { ready } from '../js/lib.js';

//
// --blog (.txt)
// --json
// --body (dir 4 .txt)
//
var args = null, items = [];
ready(() => main(args = getopt()));

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
	stream.once('end', (... _a) => chunk(
		stream, null, ... _a));
	stream.on('data', (... _a) => chunk(
		stream, ... _a));
};

const finish = (_stream) => {
	console.dir({ items, length: items.length });
};

const chunk = (_stream, _chunk) => {
	if(_chunk === null)
	{
		if(state.sub)
		{
			line();
		}
	
		if(state.body)
		{
			pushItem();
		}
		
		return finish();
	}
	
	parse(_chunk);
};

const line = () => {
	var sub = state.sub.trim();
	state.sub = ''; var idx;

	if(sub.startsWith('### '))
	{
		pushItem();

		if((idx = (sub = sub.substr(4)).indexOf(' # ')) === -1)
		{
			state.time = sub;
		}
		else
		{
			state.time = sub.substr(
				0, idx);
			state.head = sub.substr(
				idx + 2);
		}
	}
	else if(sub[0] === '#')
	{
		return;
	}
	else
	{
		state.body += sub + EOL;
	}
};

const parse = (_chunk) => {
	loop: for(var i = 0, j = 0; i < _chunk.length; ++i)
	{
		if(state.esc)
		{
			state.sub += _chunk[i];
			state.esc = false;
		}
		else if(_chunk[i] === '\n')
		{
			if(_chunk[i + 1] === '\r')
			{
				++i;
			}

			line();
		}
		else if(_chunk[i] === '\r')
		{
			if(_chunk[i + 1] === '\n')
			{
				++i;
			}

			line();
		}
		else if(_chunk[i] === '\\')
		{
			state.esc = true;
		}
		else
		{
			state.sub += _chunk[i];
		}
	}
};

const pushItem = () => {
	if(!(state.body = state.body.trim()))
	{
		return false;
	}

	items.push({
		time: (state.time.trim() || '-/-'),
		head: (state.head.trim() || '-/-'),
		body: state.body });
	
	state.time = state.head = state.body = '';
	return true;
};

const state = {
	esc: false,
	sub: '',
	time: '',
	head: '',
	body: '',
};

//

