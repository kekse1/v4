#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.2.2
 *
 * Helper script for my v4 project @ https://github.com/kekse1/v4/.
 * 
 * This will (re-)generate an index of files (depending on
 * the calling `.sh`-script or rather it's parameters). ..
 *
 */

//
const DEFAULT_DIRECTORIES = false;
const DEFAULT_PROGRESS = false;
const DEFAULT_PROGRESS_REFRESH = 1000;
const DEFAULT_BUFFER = (1024 * 64);
const DEFAULT_PARALLEL = 7;

//
const HASH = 'sha3-256';
const DIGEST = 'hex';
const MODE = 0o666;

//
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ready } from '../js/lib.js';

//
var PROGRESS = DEFAULT_PROGRESS;
var REFRESH = DEFAULT_PROGRESS_REFRESH;
var BUFFER = DEFAULT_BUFFER;
var PARALLEL = DEFAULT_PARALLEL;

//
const open = [];
const todo = [];

//
var TIME = null;
var ORIG = null;
var ARGS;

const prepare = () => {
	/*ARGS = getopt({
		root: { short: 'r', params: 1, index: 0, parse: false, help: 'Root path of the whole v4 project' },
		time: { short: 't', params: 1, index: 0, parse: true, help: 'Current time in milliseconds' },
		search: { short: 's', params: 1, index: 0, parse: false, help: 'The search path (for the documents)' },
		output: { short: 'o', params: 1, index: 0, parse: false, help: 'Output path (a `.json` file)' },
		home: { short: 'h', params: 1, index: 0, parse: false, help: 'The path below the ~home directory' },
		update: { short: 'u', params: 1, index: 0, parse: false, help: 'Update some `main.now` to get listed by `news`' }
	});*/
	ARGS = getopt();

	if(ARGS.get('search') && ARGS.get('output'))
	{
		if(ARGS.get('search')[ARGS.get('search').length - 1] !== path.sep)
		{
			ARGS.set('search', ARGS.get('search') + path.sep);
		}
		
		if(!ARGS.get('update'))
		{
			ARGS.set('update', null);
		}
		
		if(process.stdout.isTTY && process.stdout.columns > 0)
		{
			if(ARGS.has('refresh'))
			{
				PROGRESS = true;
				REFRESH = ARGS.get('refresh');
			}
			
			if(ARGS.has('progress'))
			{
				PROGRESS = ARGS.get('progress');
			}
		}
		else
		{
			PROGRESS = false;
		}
		
		if(ARGS.has('buffer'))
		{
			if(!Number.isInt(BUFFER = ARGS.get('buffer')))
			{
				throw new Error('Invalid --buffer argument');
			}
			else if(BUFFER < 1)
			{
				BUFFER = DEFAULT_BUFFER;
			}
		}

		if(ARGS.has('parallel'))
		{
			if(!Number.isInt(PARALLEL = ARGS.get('parallel')))
			{
				throw new Error('Invalid --parallel argument');
			}
			else if(PARALLEL < 0)
			{
				PARALLEL = DEFAULT_PARALLEL;
			}
		}

		if(!PARALLEL)
		{
			PARALLEL = Infinity;
		}

		if(fs.existsSync(ARGS.get('search')))
		{
			if(ARGS.get('output')[ARGS.get('output').length - 1] === path.sep)
			{
				console.error('ERROR: `--output / -o` file may not be a directory. It should end with `.json`.');
				process.exit(3);
			}
			else if(fs.existsSync(ARGS.get('output')))
			{
				const orig = JSON.parse(fs.readFileSync(ARGS.get('output'), { encoding: 'utf8' }));
				ORIG = new Map();
				
				for(const i of orig)
				{
					ORIG.set(i.file, i);
				}
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
				TIME = new Date(ARGS.get('time'));
			}
			else
			{
				TIME = new Date();
			}

			console.info('Using search path: `' + ARGS.get('search') + '`');
			console.info('      Output file: `' + ARGS.get('output') + '`');
			console.info('             Time:  ' + TIME.toGMTString());
			console.log();
		}
		else
		{
			console.error('Your `--search / -s` path doesn\'t exist! Stopping..');
			process.exit(2);
		}
	}
	else
	{
		console.error(`Syntax: ${path.basename(process.argv[0])} < --search / -s > < --output / -o >`);
		console.error(`	[ --help / -? ]`);
		process.exit(1);
	}
	
	start();
};

ready(prepare);

//
var FOUND = 0;
var ERR = 0;
var ADD = 0;
var REM = 0;
var CHG = 0;
var SIZE = 0;

//
const FILE = [];
const DIR = [];

//
const start = () => {
	fs.readdir(ARGS.get('search'), { encoding: 'utf8', withFileTypes: true, recursive: false },
		(_err, _files) => readdirCallback(ARGS.get('search'), _err, _files));
};

const transform = () => {
	DIR.sort('name'); DIR.sort('time', false);
	FILE.sort('name', true); FILE.sort('size', false); FILE.sort('time', false);
	const result = [ ... DIR, ... FILE ];
	compare(result);
};

const compare = (_result) => {
	if(ORIG)
	{
		const NOW = new Set();
		for(const i of _result) NOW.add(i.file);
		ORIG = [ ... ORIG.keys() ];
		for(const o of ORIG) if(!NOW.has(o)) ++REM;
	}
	
	write(_result);
};

const write = (_result) => {
	if(ARGS.get('update') && (ADD || REM || CHG))
	{
		fs.writeFileSync(ARGS.get('update'), TIME.getTime().toString(), { encoding: 'utf8', mode: MODE, flush: true });
	}

	const result = JSON.stringify(_result);
	fs.writeFileSync(ARGS.get('output'), result, { encoding: 'utf8', mode: MODE, flush: true });

	return fin(_result, result);
};

const fin = (_result, _output) => {
	//
	const totalSize = Math.size.render(SIZE, null, 2, 1024, true, true);
	console.info(EOL + 'Total size of available documents: %' + (totalSize[3] === 0 ? '' : ' (' + SIZE.toLocaleString() + ' Bytes)') + '.', totalSize.toString());
	//
	console.info('Found % items in total (those without errors).', FOUND);
	if(ERR) console.warn('There ' + (ERR === 1 ? 'was' : 'were') + ' % error' +
		(ERR === 1 ? '' : 's') + ' when trying to stat files!', ERR);
	console.info('  Added: %', ADD);
	console.info('Removed: %', REM);
	console.info('Changed: %', CHG);
	console.log(2);
	//
	const wrote = Math.size.render(_output = _output.length, null, 2, 1024, true, true);
	console.info('Wrote %' + (wrote[3] === 0 ? '' : ' (' + _output.toLocaleString() + ' Bytes)') + '.', wrote.toString());
};

//
const readdirCallback = (_path, _error, _list) => {
	if(_error)
	{
		throw _error;
	}

	var rest = 0; const cb = (_file) => {
		if(_file)
		{
			if(_file.size === null) DIR.push(_file);
			else { FILE.push(_file); SIZE += _file.size; }
		}

		if(--rest <= 0) transform(); };
		
	const removeFromList = (_index) => {
		_list.splice(_index, 1);
		return (_index - 1); };

	var item; for(var i = 0; i < _list.length; ++i)
	{
		if((item = _list[i]).name[0] === '.')
		{
			i = removeFromList(i);
			continue;
		}

		if(item.isSymbolicLink())
		{
			i = removeFromList(i);
			continue;
		}
		
		if(item.isDirectory())
		{
			if(!DEFAULT_DIRECTORIES)
			{
				i = removeFromList(i);
				continue;
			}
		}
		else if(!item.isFile())
		{
			i = removeFromList(i);
			continue;
		}

		++rest; const p = path.join(_path, item.name);
		fs.stat(p, { bigint: false },
			(_err, _stats) => statCallback(
				p, _err, _stats, cb));
	}

	if(_list.length === 0)
	{
		cb(null);
	}
};

var	lastRefresh = null,
	maxLength = 0;
const	progressLines = [],
	progressItems = [],
	progressKeys = new Map();

const createProgressItem = (_item, _number = 0) => {
	var number;
	
	if(progressKeys.has(_item.file))
		number = (progressKeys.get(_item.file) + 1);
	else	number = 0;
	
	const result = Object.assign(_item, { number: 0,
		read: 0, progress: 0, percent: '  0%' });

	Reflect.defineProperty(result, 'key', { get: () => {
		var res = result.file;
		
		if(!result.number)
		{
			return res;
		}
		
		return (res + '(' + result.number + ')');
	}});

	maxLength = Math.max(maxLength, result.key.length);

	progressItems.push(result);
	process.stdout.write('\n');

	return result;
};

const ESC = String.fromCharCode(27); const clear = (_lines) => {
	const up = (ESC + '[' + _lines + 'A'); const clear = (ESC + '[0J');
	return (up + clear + '\r'); };

const updateProgressItem = (_item, _read, _force) => {
	if(Number.isInt(_read))
	{
		_item.percent = Math._round(
			(_item.progress = Math.min(1, (_item.
				read += _read) / _item.size)) * 100).
					toString().padStart(3, ' ') + '%';
	}
	else
	{
		_item.read = _item.size;
		_item.progress = 1;
		_item.percent = '100%';
	}

	if(_force)
	{
		_force = progressItems.length;
	}
	else
	{
		_force = 0;
	}
	
	return updateProgressLines(_force);
};

const endProgressLines = (_size) => {
	process.stdout.write(clear(_size));
	process.stdout.write('\n'); };

const updateProgressLines = (_force = 0) => {
	//
	const now = Date.now();
	
	if(lastRefresh === null)
	{
		lastRefresh = now;
	}
	else
	{
		const delta = (now - lastRefresh);
		if(!_force && delta < REFRESH) return 0;
		lastRefresh = now;
	}

	//
	process.stdout.write(clear((Number.isInt(_force) &&
		_force > 0) ? _force : progressItems.length));

	for(const item of progressItems)
	{
		process.stdout.write(
			getProgressLine(item) + '\n');
	}

	//
	return progressItems.length;
};

const getProgressLine = (_item) => {
	var result = (_item.key.padStart(
		maxLength, ' ') + ' ' +
		_item.percent + ' ');
	return (result + progressBar(
		_item, result.length + 2)).substr(
			0, process.stdout.columns);
};
	
const progressBar = (_item, _length) => {
	var width = process.stdout.columns;
	
	if((width -= _length) <= 0)
	{
		return '';
	}

	var done = Math._floor(_item.progress * width);
	var todo = (width - done);

	return ('[' + '#'.repeat(done) + '-'.repeat(todo) + ']');
};

const removeProgressItem = (_item) => {
	const size = progressItems.length; maxLength = 0;

	for(var i = 0; i < progressItems.length; ++i)
	{
		if(progressItems[i] === _item)
		{
			progressItems.splice(i--, 1);
		}
		else
		{
			if(progressItems[i].number > _item.number)
			{
				--progressItems[i].number;
			}
			
			maxLength = Math.max(maxLength,
				progressItems[i].key.length);
		}
	}
	
	if(progressItems.length === 0)
	{
		return endProgressLines(size);
	}
	
	return updateProgressLines(size);
};

//
const statCallback = (_path, _error, _stats, _callback) => {
	const check = () => {
		while(open.length < PARALLEL && todo.length > 0)
		{
			const item = todo.shift();
			const origCb = item[3];

			item[3] = (_res, ... _a) => {
				open.remove(_res);
				setImmediate(check);
				origCb(_res, ... _a);
			};

			open.push(handleFile(... item));
		}
	};

	todo.push([ _path, _error, _stats, _callback ]);
	setImmediate(check);
};

const handleFile = (_path, _error, _stats, _callback) => {
	if(_error)
	{
		++ERR;
		return _callback(null);
	}
	else	++FOUND;

	const result = Object.create(null);

	result.file = path.basename(_path);
	result.ext = path.extname(_path, 0);
	result.type = path.extname(_path, 1).substr(1);

	if(_stats.isFile())
	{
		result.size = _stats.size;

		const onEnd = () => {
			//
			result.hash = hash.digest(DIGEST);
			
			//
			if(ORIG && ORIG.has(result.file))
			{
				const orig = ORIG.get(result.file);
				
				if(orig.hash === result.hash)
				{
					result.time = orig.time;
				}
				else
				{
					result.time = TIME.getTime();
					++CHG;
				}
			}
			else
			{
				result.time = TIME.getTime();
				++ADD;
			}

			//
			if(PROGRESS)
			{
				removeProgressItem(result);
			}
			
			//
			_callback(result);
		};
		
		const onData = (_chunk) => {
			hash.update(_chunk); if(PROGRESS)
				updateProgressItem(result,
					_chunk.length); };
		
		const hash = crypto.createHash(HASH);
		const stream = fs.createReadStream(_path, {
			autoClose: true, emitClose: true,
			highWaterMark: BUFFER });

		stream.on('data', onData);
		stream.once('end', onEnd);
		
		if(PROGRESS) createProgressItem(result);
	}
	else
	{
		result.size = null;
		
		if(ORIG && ORIG.has(result.file))
		{
			result.time = ORIG.get(result.file).time;
		}
		else
		{
			result.time = TIME.getTime();
			++ADD;
		}
		
		_callback(result);
	}
	
	return result;
};

//

