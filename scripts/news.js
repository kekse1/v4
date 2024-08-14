#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.1.6
 *
 * Helper script for my v4 project @ https://github.com/kekse1/v4/.
 *
 * This will feed the `~news` page on my private website: https://kekse.biz/.
 * Will check a bunch of files for updates, using SHA3-256 hashes ('hex' digest).
 */

const SOURCES = [
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
	'.js',
	'.now'
];

const INDEX = [
	'main'
];

const MODE = 0o666;
const HASH = 'sha3-256';
const DIGEST = 'hex';
const SPACE = null;
const BOOL = false;

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
var REST = 0;
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
	ARGS = getopt({
		config: { short: 'c', params: 0, help: 'Show the configuration for this script (see on top of this `.js` file itself)' },
		root: { short: 'r', params: 1, index: 0, parse: false, help: 'The directory to start the traversing' },
		output: { short: 'o', params: 1, index: 0, parse: false, help: 'The output path (a `.json` file)' },
		time: { short: 't', params: 1, index: 0, parse: true, help: 'Milliseconds since unix epoche, for the current time' }
	});
	
	if(ARGS.config)
	{
		console.warn('The paths (needs to be an existing directory) can end with a trailing slash,');
		console.warn('to dig recursively; otherwise it\'ll only look into this directory without');
		console.warn('any more depth.');
		console.log();
		console.dir({ sources: SOURCES, extensions: EXTENSIONS, root: (ARGS.root || undefined), output: (ARGS.output || undefined) });
		process.exit();
	}
	else if(ARGS.root && ARGS.output)
	{
		if(ARGS.root[ARGS.root.length - 1] !== path.sep)
		{
			ARGS.root += path.sep;
		}

		if(fs.existsSync(ARGS.root))
		{
			if(ARGS.output[ARGS.output.length - 1] === path.sep)
			{
				console.error('ERROR: `--output / -o` file may not be a directory. It should end with `.json`.');
				process.exit(3);
			}
			
			console.log('You started this script correctly.. so we continue here. Right now. :-)');
			
			if(!ARGS.output.endsWith('.json'))
			{
				console.warn('WARNING: `--output / -o` file doesn\'t end with `.json`.. changing this, now.');
				ARGS.output += '.json';
			}
			
			ARGS.output = path.resolve(ARGS.output);
			
			if(Number.isInt(ARGS.time) && ARGS.time)
			{
				TIME = new Date(ARGS.time);
			}
			else
			{
				TIME = new Date();
			}
			
			console.info('Using root path: `' + ARGS.root + '`');
			console.info('    Output file: `' + ARGS.output + '`');
			console.info('           Time:  ' + TIME.toGMTString());
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
	
	return start(ARGS, interprete);
};

//
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ready } from '../js/lib.js';

//
ready(prepare);

const start = (_args, _callback) => {
	for(var i = 0; i < SOURCES.length; ++i)
	{
		const p = path.join(_args.root, SOURCES[i]);
		fs.readdir(p, { encoding: 'utf8', withFileTypes: true, recursive: true },
			(... _a) => readdirCallback(_callback, p, ... _a));
	}
};

const readdirCallback = (_callback, _path, _error, _data) => {
	for(var i = 0; i < _data.length; ++i)
	{
		if(_data[i].name[0] !== '.' && _data[i].isFile() && EXTENSIONS.includes(path.extname(_data[i].name)))
		{
			++REST; addFile(path.join(_data[i].path, _data[i].name), _callback);
		}
	}
};

const addFile = (_path, _callback) => {
	const result = { path: _path };
	var bytes = 0;

	const fin = () => {
		//
		result.bytes = bytes;
		result.hash = hash.digest(DIGEST);
		result.time = TIME;
		
		//
		result.path = result.path.substr(ARGS.root.length);
		MAP.set(result.path, result);

		//
		if(--REST <= 0) _callback();
	};
	
	const hash = crypto.createHash(HASH);
	const stream = fs.createReadStream(_path, { autoClose: true, emitClose: true });
	stream.on('data', (_chunk) => { bytes += _chunk.length; hash.update(_chunk); });
	stream.once('end', fin);
};

const interprete = () => {
	var original = false;
	
	if(fs.existsSync(ARGS.output))
	{
		ORIG = new Map(); original = true;
		const orig = JSON.parse(fs.readFileSync(ARGS.output, { encoding: 'utf8' }));
		
		for(const item of orig)
		{
			ORIG.set(item.path, item);
		}
		
		console.info('Previous output file already exists.. so we also gonna compare them!');
	}
	else
	{
		console.info('No previous output file found, so all items are marked as updated.');
	}
	
	const result = compare(MAP, ORIG);
	
	const orig = [ ... ORIG.keys() ];
	for(const k of orig)
	{
		if(!MAP.has(k))
		{
			++DELETE;
		}
	}

	const data = JSON.stringify(result, null, SPACE);
	fs.writeFileSync(ARGS.output, data, { encoding: 'utf8', mode: MODE, flush: true });
	
	const stats = fs.statSync(ARGS.output, { bigint: false, throwIfNoEntry: false });

	if(stats)
	{
		console.info('Wrote output file: % bytes (`%`)', stats.size, fs.realpathSync(ARGS.output));
	}
	else
	{
		console.error('Unable to access the new output file (if really created..)!');
		process.exit(4);
	}

	console.log();	
	console.info('% items found in total.', result.length);
	if(original) console.info('% item' + (UPDATE === 1 ? '' : 's') + ' really updated, ' +
		'% deleted, % newly created.', UPDATE, DELETE, CREATE);
};

const compare = (_map, _orig) => {
	const keys = [ ... _map.keys() ];
	const result = [];
	var item;
	
	for(var i = 0, j = 0; i < keys.length; ++i)
	{
		if(_orig && _orig.has(keys[i]))
			item = withOrig(keys[i]);
		else
			item = withOutOrig(keys[i]);

		result[j++] = lastThings(item);
	}
	
	result.sort('bytes', false);
	result.sort('time', false);

	return result;
};

const withOrig = (_key) => {
	//
	const curr = MAP.get(_key);
	const orig = ORIG.get(_key);
	
	//
	if(curr.hash === orig.hash)
	{
		curr.time = new Date(orig.time);
		if(BOOL) curr.updated = false;
	}
	else
	{
		if(BOOL) curr.updated = true;
		++UPDATE;
	}
	
	//
	return curr;
};

const withOutOrig = (_key) => {
	const res = MAP.get(_key);
	if(BOOL) res.updated = null;
	++CREATE; return res;
};

const lastThings = (_item) => {
	_item.size = renderSize(_item.bytes);
	_item.date = _item.time.toGMTString();
	_item.time = _item.time.getTime();
	return _item;
};

//
