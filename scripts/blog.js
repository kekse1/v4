#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.2.0
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
	loop: for(var i = 0; i < _chunk.length; ++i)
	{
		if(state.comment)
		{
			if(_chunk[i] === '\n')
			{
				if(_chunk[i + 1] === '\r')
				{
					++i;
				}

				state.comment = false;
			}
			
			if(_chunk[i] === '\r')
			{
				if(_chunk[i + 1] === '\n')
				{
					++i;
				}

				state.comment = false;
			}

			continue;
		}

		if(_chunk[i] === '\\' && i < (_chunk.length - 1))
		{
			state[state.item] += _chunk[++i];
			continue;
		}

		if(_chunk[i] === '\n')
		{
			if(_chunk[i + 1] === '\r')
			{
				++i;
			}

			++state.newLines;
		}
		else if(_chunk[i] === '\r')
		{
			if(_chunk[i + 1] === '\n')
			{
				++i;
			}

			++state.newLines;
		}
		else
		{
			if(state.newLines > 0)
			{
				if(_chunk.at(i, '### '))
				{
					pushItem();
					state.item = '';
					i += 3;
					continue;
				}

				if(_chunk[i] === '#')
				{
					state.comment = true;
					--state.newLines;
					continue;
				}
			}

			state.newLines = 0;

			if(!state.item)
			{
				state.item = 'time';
			}
		}
		
		if(state.item) switch(state.item)
		{
			case 'time':
				if(state.newLines > 0)
				{
					state.item = 'body';
					continue loop;
				}
				
				if(_chunk.at(i, ' # '))
				{
					state.item = 'head';
					i += 2;
					continue loop;
				}
				break;
			case 'head':
				if(state.newLines >= 2)
				{
					state.item = 'body';
					continue loop;
				}
				break;
			case 'body':
				break;
		}

		if(state.item)
		{
			state[state.item] += _chunk[i];
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
	comment: false,
	newLines: 0,
	item: '',
	time: '',
	head: '',
	body: '',
};

//

