#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.4.1
 *
 * Helper script for my v4 project @ https://github.com/kekse1/v4/.
 *
 * This will feed the `~news` page on my private website: https://kekse.biz/.
 * Will check a bunch of files for updates, using SHA3-256 hashes ('hex' digest).
 */

const SOURCE = [
	'js/lib/',
	'js/web/',
	'home',
	'css'
];

const EXTENSIONS = [
	'.txt',
	'.php',
	'.html',
	'.htm',
	'.css',
	'.js'
];

const INDEX = [
	'main'
];

const MODE = 0o666;
const HASH = 'sha3-256';
const DIGEST = 'hex';
const SPACE = null;

//
for(var i = 0; i < EXTENSIONS.length; ++i)
{
	if(EXTENSIONS[i][0] !== '.')
	{
		EXTENSIONS[i] = '.' + EXTENSIONS[i];
	}
}

//
var TIME;
var ARGS;
const MAP = new Map();
var ORIG = null;
var CREATE = 0;
var UPDATE = 0;
var DELETE = 0;

//
//const renderTime = (_value) => Math.time.render(_value, ', ', true, false, '0', false, true);//last (true) or (false), wg. (milliseconds)?
const renderSize = (_value) => Math.size.render(_value, null, 2, 1024, true).toString();

//
const prepare = () => {
	/*ARGS = getopt({
		config: { short: 'c', params: 0, help: 'Show the configuration for this script (see on top of this `.js` file itself)' },
		root: { short: 'r', params: 1, index: 0, parse: false, help: 'The directory to start the traversing' },
		output: { short: 'o', params: 1, index: 0, parse: false, help: 'The output path (a `.json` file)' },
		time: { short: 't', params: 1, index: 0, parse: true, help: 'Milliseconds since unix epoche, for the current time' }
	});*/
	ARGS = getopt();

	if(ARGS.get('config'))
	{
		console.warn('The paths (needs to be an existing directory) can end with a trailing slash,');
		console.warn('to dig recursively; otherwise it\'ll only look into this directory without');
		console.warn('any more depth.');
		console.log();
		console.dir({ source: SOURCE, extensions: EXTENSIONS, root: (ARGS.get('root') || undefined), output: (ARGS.get('output') || undefined) });
		process.exit();
	}
	else if(ARGS.get('root') && ARGS.get('output'))
	{
		if(ARGS.get('root')[ARGS.get('root').length - 1] !== path.sep)
		{
			ARGS.set('root', ARGS.get('root') + path.sep);
		}

		if(fs.existsSync(ARGS.get('root')))
		{
			if(ARGS.get('output')[ARGS.get('output').length - 1] === path.sep)
			{
				console.error('ERROR: `--output / -o` file may not be a directory. It should end with `.json`.');
				process.exit(3);
			}
			
			console.log('You started this script correctly.. so we continue here. Right now. :-)');
			
			if(!ARGS.get('output').endsWith('.json'))
			{
				console.warn('WARNING: `--output / -o` file doesn\'t end with `.json`.. changing this, now.');
				ARGS.set('output', ARGS.get('output') + '.json');
			}
			
			ARGS.set('output', path.resolve(ARGS.get('output')));
			
			if(Number.isInt(ARGS.get('time')) && ARGS.get('time'))
			{
				TIME = ARGS.get('time');
			}
			else
			{
				TIME = Date.now();
			}
			
			console.info('Using root path: `' + ARGS.get('root') + '`');
			console.info('    Output file: `' + ARGS.get('output') + '`');
			console.info('           Time:  ' + new Date(TIME).toString());
		}
		else
		{
			console.error('Your `--root / -r` path doesn\'t exist! Stopping here..');
			process.exit(2);
		}
	}
	else
	{
		console.error(`Syntax: ${path.basename(process.argv[0])} < --root / -r > < --output / -o >`);
		console.error(`	[ --help / -? ] / [ --config / -c ]`);
		process.exit(1);
	}

	return start(ARGS, proceed);
};

//
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ready } from '../js/lib.js';

//
ready(prepare);

//
const start = (_args, _callback) => {
	const result = [];
	var req = 0;
	
	const readdirCallback = (_path, _source, _error, _files) => {
		if(_error) throw _error;
		
		for(var i = 0, j = result.length; i < _files.length; ++i)
		{
			if(_files[i].name[0] === '.')
			{
				continue;
			}
			else if(_files[i].isSymbolicLink())
			{
				continue;
			}
			
			const p = path.join(_path, _files[i].name);
			const n = path.join(_source, _files[i].name);
			
			if(_files[i].isFile())
			{
				if(EXTENSIONS.includes(
						path.extname(_files[i].name)))
				{
					result[j++] = [ p, n ];
				}
			}
			else if(_files[i].isDirectory())
			{
				++req;
				fs.readdir(p, { encoding: 'utf8',
					withFileTypes: true,
					recursive: false }, (... _a) => {
						readdirCallback(p, n, ... _a); });
			}
		}
		
		if(--req <= 0)
		{
			_callback(result);
		}
	};
	
	for(const source of SOURCE)
	{
		++req;
		const p = path.join(_args.get('root'), source);
		fs.readdir(p, { encoding: 'utf8',
			withFileTypes: true,
			recursive: false }, (... _a) => {
				readdirCallback(p, source, ... _a); });
	}
};

//
const proceed = (_result) => {
	const result = [];
	
	var rest = _result.length;
	const callback = (_item, _path, _name) => {
		result.push(_item);
		if(--rest <= 0)
			finish(result); };
	
	for(var i = 0; i < _result.length; ++i)
	{
		addFile(_result[i][0],
			_result[i][1],
			callback);
	}
};

const finish = (_result) => {
	const orig = readOriginal();

	if(orig)
	{
		ORIG = new Map();
		
		for(const item of orig)
		{
			ORIG.set(item.path, item);
		}
		
		console.info('Previous output file already exists.. so we also gonna compare them!');
	}
	else
	{
		console.info('No previous output file found, so all items are marked as updated.');
		ORIG = null;
	}
	
	const result = compare(_result, MAP, ORIG);
	const data = JSON.stringify(result, null, SPACE);
	
	fs.writeFileSync(ARGS.get('output'), data, { encoding: 'utf8', mode: MODE, flush: true });
	
	const stats = fs.statSync(ARGS.get('output'), { bigint: false, throwIfNoEntry: false });
	
	if(stats)
	{
		console.info('Wrote output file: % bytes (`%`)', stats.size, fs.realpathSync(ARGS.get('output')));
	}
	else
	{
		console.error('Unable to access the new output file (if really created..)!');
		process.exit(4);
	}

	console.log();	
	console.info('% items found in total.', result.length);
	if(orig) console.info('% item' + (UPDATE === 1 ? '' : 's') + ' really updated, ' +
		'% deleted, % newly created.', UPDATE, DELETE, CREATE);
};

const readOriginal = () => {
	if(!fs.existsSync(ARGS.get('output'))) return null;
	return JSON.parse(
		fs.readFileSync(
			ARGS.get('output'), {
				encoding: 'utf8' }));
};

const addFile = (_path, _name, _callback) => {
	const result = { bytes: 0, path: _name, time: TIME };
	const hash = crypto.createHash(HASH);
	const stream = fs.createReadStream(_path, {
		autoClose: true, emitClose: true });
	stream.on('data', (_chunk) => {
		result.bytes += _chunk.length;
		hash.update(_chunk); });
	stream.once('end', () => {
		result.hash = hash.digest(DIGEST);
		MAP.set(result.path, result);
		_callback(result, _path, _name); });
	return result;
};

const compare = (_result, _map, _orig) => {
	const mapKeys = [ ... _map.keys() ];
	const result = [];
	
	if(_orig)
	{
		const origKeys = [ ... _orig.keys() ];
		
		for(const k of origKeys)
		{
			if(!_map.has(k))
			{
				++DELETE;
			}
		}
		
		var item; for(var i = 0; i < mapKeys.length; ++i)
		{
			if(_orig.has(mapKeys[i]))
			{
				item = withOriginal(mapKeys[i]);
			}
			else
			{
				item = withoutOriginal(mapKeys[i]);
			}
			
			result[i] = lastThings(item);
		}
	}
	else for(var i = 0; i < mapKeys.length; ++i)
	{
		result[i] = lastThings(_map.get(mapKeys[i]));
	}
	
	result.sort('bytes', false);
	result.sort('time', false);

	return result;
};

const withOriginal = (_key) => {
	const curr = MAP.get(_key);
	const orig = ORIG.get(_key);
	
	if(curr.hash === orig.hash)
	{
		curr.time = orig.time;
		return curr;
	}
	else
	{
		++UPDATE;
	}
	
	curr.time = TIME;
	return curr;
};

const withoutOriginal = (_key) => {
	++CREATE;
	const curr = MAP.get(_key);
	curr.time = TIME;
	return curr;
};

const lastThings = (_item) => {
	_item.size = renderSize(_item.bytes);
	_item.date = new Date(_item.time).toString();
	return _item;
};

//
