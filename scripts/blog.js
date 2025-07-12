#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.6.0
 *
 * Helper script for my v4 project @ https://github.com/kekse1/v4/.
 *
 * This *will* parse my 'BLOG.txt' and create:
 * 	(a) the 'blog.json' INDEX (for ~blog dynamics)
 * 	(b) every entry's 'body', each as '*.txt'
 *
 *
 * TODO!!1 ... write into (prepared) file system! :-)
 *
 */

//
const DEFAULT_BUFFER = (1024 * 512);
const DEFAULT_ENCODING = 'utf8';
const DEFAULT_HASH = 'sha3-256';
const DEFAULT_DIGEST = 'base64';

//
import { ready } from '../js/lib.js';
import crypto from 'node:crypto';

//
// --blog (.txt)
// --json
// --body (dir 4 .txt)
//
var args = null, items = [], stream;
ready(() => main(args = getopt()));

const main = (_args = args) => {
	//
	//todo/theor. sollte ich die argv[] genau pruefen;
	//	... gehe aber erstmal von korrektheit aus.
	//
	
	checkArgs(_args, true);

	stream = fs.createReadStream(
		_args.get('blog'), {
			encoding: DEFAULT_ENCODING,
			autoClose: true,
			emitClose: true,
			highWaterMark: DEFAULT_BUFFER });
	stream.once('end', (... _a) => chunk(
		null, ... _a));
	stream.on('data', (... _a) => chunk(
		... _a));
};

const checkArgs = (_args, _throw = true) => {
	const missing = [];

	if(!_args.has('blog'))
	{
		missing.push('blog');
	}

	if(!_args.has('json'))
	{
		missing.push('json');
	}

	if(!_args.has('body'))
	{
		missing.push('body');
	}
	
	if(_throw && missing.length > 0)
	{
		//
		//todo/
		// atm seems to be a mistake in the 'lib/console*' or so (@ EOLs)??
		//
		var msg = 'The following parameters are missing:' + eol(3);

		for(const m of missing)
		{
			msg += '\t--' + m + EOL;
		}
		
		msg += EOL + EOL + 'You *really* should use my `blog.sh` startup script,' +
			EOL + 'which also prepares the file system, btw.!';

		console.error(msg);
		process.exit(254);
	}

	return missing;
};

const finish = (_stream) => {
	console.dir({ items });
	console.info('Found % blog entries.',
		items.length.toLocaleString());
	//todo/write
};

const chunk = (_chunk) => {
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

		stream = null;
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
		for(var i = 0; i < sub.length; ++i)
		{
			if(sub[i] === '\\' && i < (sub.length - 1))
			{
				state.body += sub[++i];
			}
			else
			{
				state.body += sub[i];
			}
		}

		state.body += EOL;
	}
};

const parse = (_chunk) => {
	loop: for(var i = 0, j = 0; i < _chunk.length; ++i)
	{
		if(state.eol) switch(state.eol)
		{
			case '\n':
				state.eol = '';

				if(_chunk[i] === '\r')
				{
					++i;
				}

				line();
				break;
			case '\r':
				state.eol = '';

				if(_chunk[i] === '\n')
				{
					++i;
				}
				
				line();
				break;
		}
		else if(_chunk[i] === '\n')
		{
			if(i < (_chunk.length - 1))
			{
				if(_chunk[i + 1] === '\r')
				{
					++i;
				}

				line();
			}
			else
			{
				state.eol = '\n';
			}
		}
		else if(_chunk[i] === '\r')
		{
			if(i < (_chunk.length - 1))
			{
				if(_chunk[i + 1] === '\n')
				{
					++i;
				}

				line();
			}
			else
			{
				state.eol = '\r';
			}
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
	
	const item = {
		time: (state.time.trim() || '-/-'),
		head: (state.head.trim() || '-/-'),
		body: state.body,
		now: Date.now() };
	items.push(item);

	state.time = state.head = state.body = '';

	const hash = crypto.createHash(DEFAULT_HASH);
	hash.update(JSON.stringify(item));
	item.hash = hash.digest(DEFAULT_DIGEST);

	return true;
};

const state = {
	eol: '',
	sub: '',
	time: '',
	head: '',
	body: '',
};

//

