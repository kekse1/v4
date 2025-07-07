#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.3.0
 *
 * Helper script for my v4 project @ https://github.com/kekse1/v4/.
 *
 * This *will* parse my 'BLOG.txt' and create:
 * 	(a) the 'blog.json' INDEX (for ~blog dynamics)
 * 	(b) every entry's 'body', each as '*.txt'
 *
 *
 * TODO!!1 ...
 *
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
		if(state.body)
		{
			pushItem();
		}
		
		return finish();
	}
	
	parse(_chunk);
};

const parse = (_chunk) => {
	const lines = []; var sub = '';

	loop: for(var i = 0, j = 0; i < _chunk.length; ++i)
	{
		if(_chunk[i] === '\n')
		{
			if(_chunk[i + 1] === '\r')
			{
				++i;
			}

			lines[j++] = sub;
			sub = '';
		}
		else if(_chunk[i] === '\r')
		{
			if(_chunk[i + 1] === '\n')
			{
				++i;
			}

			lines[j++] = sub;
			sub = '';
		}
		else if(_chunk[i] === '\\' && i < (_chunk.length - 1))
		{
			sub += _chunk[++i];
		}
		else
		{
			sub += _chunk[i];
		}
	}

	var idx, line; for(var i = 0; i < lines.length; ++i)
	{
		if(lines[i].startsWith('### '))
		{
			pushItem();
			
			lines[i] = lines[i].substr(4);

			if((idx = lines[i].indexOf(' # ')) === -1)
			{
				state.time = lines[i];
			}
			else
			{
				state.time = lines[i].substr(
					0, idx);
				state.head = lines[i].substr(
					idx + 2);
			}
		}
		else if(lines[i][0] === '#')
		{
			continue;
		}
		else
		{
			state.body += lines[i] + EOL;
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
	time: '',
	head: '',
	body: '',
};

//

