#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.6.3
 *
 * Helper script for my v4 project @ https://github.com/kekse1/v4/.
 * 
 * This will (re-)generate an index of files (depending on
 * the calling `.sh`-script or rather it's parameters). ..
 *
 * Here's an example how to use the `.json` output files:
 * 	https://kekse.biz/home/downloads/downloads.js
 *
 */

//
const DEFAULT_DIRECTORIES = false;
const DEFAULT_PROGRESS = false;
const DEFAULT_PROGRESS_REFRESH = 1000;
const DEFAULT_BUFFER = (1024 * 64);
const DEFAULT_PARALLEL = 7;
const DEFAULT_SORT = true;
const DEFAULT_CUT = true;
const DEFAULT_CMP = true;
const DEFAULT_CHAR = '#';

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
var SORT = DEFAULT_SORT;
const EXT = [];

//
const open = [];
const todo = [];

//
var TIME = null;
var ORIG = null;
var ARGS;
var CMP = DEFAULT_CMP;

const mathSize = (_value) => Math.size.render(
	_value, null, 2, 1024, true, true);

const prepare = () => {
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
			else if(PARALLEL < 1)
			{
				PARALLEL = DEFAULT_PARALLEL;
			}
		}

		if(!PARALLEL)
		{
			PARALLEL = Infinity;
		}

		if(ARGS.has('sort'))
		{
			SORT = ARGS.get('sort');
		}

		if(ARGS.has('compare', 'bool'))
		{
			CMP = ARGS.get('compare');
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
			
			if(!ARGS.get('output').endsWith('.json'))
			{
				console.warn('WARNING: `--output / -o` file doesn\'t end with `.json`.. changing this, now.');
				ARGS.set('output', ARGS.get('output') + '.json');
			}
			
			ARGS.set('output', path.resolve(ARGS.get('output')));
			
			if(ARGS.has('time', 'int'))
			{
				TIME = new Date(ARGS.get('time'));
			}
			else
			{
				TIME = null;
			}

			var ext;
			
			if(ARGS.has('extension', 'string'))
			{
				ext = ARGS.get('extension').trim();
			}

			if(ext)
			{
				ext = ext.split(path.delimiter);

				for(var i = 0, j = 0; i < ext.length; ++i)
				{
					if(ext[i] = ext[i].trim())
					{
						if(ext[i][0] !== '.')
						{
							ext[i] = '.' + ext[i];
						}

						EXT[j++] = ext[i].toLowerCase();
					}
				}
			}

			console.info('Using search path: `' + ARGS.get('search') + '`');
			console.info('      Output file: `' + ARGS.get('output') + '`');
			
			if(TIME !== null)
			{
				console.info('             Time:  ' + TIME.toGMTString());
			}

			if(EXT.length > 0)
			{
				console.info('       Extensions: ' + EXT.length);
			}
			
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
	
	if(PROGRESS)
	{
		resetMaxLength();
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
	const _update = ARGS.get('update');
	const _output = ARGS.get('output');

	if(TIME === null)
	{
		TIME = new Date();
	}

	if(ARGS.get('update') && (ADD || REM || CHG))
	{
		fs.writeFileSync(_update, TIME.getTime().toString(), {
			encoding: 'utf8', mode: MODE, flush: true });
	}

	const result = JSON.stringify(_result);
	fs.writeFileSync(_output, result, {
		encoding: 'utf8', mode: MODE, flush: true });

	return fin(_result, result);
};

const fin = (_result, _output) => {
	//
	const totalSize = mathSize(SIZE);
	console.info(EOL + 'Total size of available files: %' +
		(totalSize[3] === 0 ? '' : ' (' + SIZE.toLocaleString() +
			' Bytes)') + '.', totalSize.toString());
	//
	console.info('Found % items in total (those without errors).', FOUND);
	if(ERR) console.warn('There ' + (ERR === 1 ? 'was' : 'were') + ' % error' +
		(ERR === 1 ? '' : 's') + ' when trying to stat files!', ERR);
	console.info('  Added: %', ADD);
	console.info('Removed: %', REM);
	console.info('Changed: %', CHG);
	console.log(2);
	//
	const wrote = mathSize(_output = _output.length);
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

	const withExt = (EXT.length > 0); const checkExt = (_file) => {
		for(const ext of EXT)
		{
			if(_file.toLowerCase().endsWith(ext))
			{
				return (_file.length > ext.length);
			}
		}

		return false; };

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

		if(withExt && !checkExt(_list[i].name))
		{
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

const getTotalString = () => ('  ' + mathSize(doneSize) + ' / ' + mathSize(totalSize) + ' (' +
		doneItems.toLocaleString() + ' / ' + totalItems.toLocaleString() + ')  ');

const resetMaxLength = () => {
	return maxLength = getTotalString().length;
};

var	lastRefresh = null,
	totalSize = 0,
	doneSize = 0,
	totalItems = 0,
	doneItems = 0;
const	progressLines = [],
	progressItems = [],
	progressKeys = new Map();
var	maxLength = 0;

const createProgressItem = (_item, _number) => {
	if(progressItems.length === 0)
	{
		console.eol(2);
	}
	
	var number;
	
	if(progressKeys.has(_item.file))
		number = (progressKeys.get(_item.file) + 1);
	else	number = 0;
	
	const result = Object.assign(_item, { progress: {
		number: 0, read: 0, value: 0, percent: '  0%' }});
	const width = process.stdout.columns;
	const half = (width ? Math._round(width / 2) : null);
	const cut = '...'; const cutLen = cut.length;
	
	Reflect.defineProperty(result.progress, 'key', { get: () => {
		var res = result.file;

		if(width && res.length > half)
		{
			if(DEFAULT_CUT)
			{
				res = cut + res.substr(res.length - half + cutLen);
			}
			else
			{
				res = res.substr(0, half - cutLen) + cut;
			}
		}
		
		if(!result.progress.number)
		{
			return res;
		}
		
		return (res + '(' + result.progress.number + ')');
	}});

	maxLength = Math.max(maxLength, result.progress.key.length);

	progressItems.push(result);
	process.stdout.write('\n');

	return result;
};

const ESC = String.fromCharCode(27); const clear = (_lines) => {
	const up = (ESC + '[' + (_lines + 2) + 'A'); const clear = (ESC + '[0J');
	return (up + clear + '\r'); };

const updateProgressItem = (_item, _read, _force) => {
	if(Number.isInt(_read))
	{
		_item.progress.percent = Math._round(
			(_item.progress.value = Math.min(1, (_item.
				progress.read += _read) / _item.size)) * 100).
					toString().padStart(3, ' ') + '%';
	}
	else
	{
		_item.progress.read = _item.size;
		_item.progress.value = 1;
		_item.progress.percent = '100%';
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

	process.stdout.write(totalProgressBar() + '\n\n');

	if(SORT) progressItems.sort('progress.value', false);
	for(const item of progressItems)
	{
		process.stdout.write(
			getProgressLine(item) + '\n');
	}

	//
	return progressItems.length;
};

const getProgressLine = (_item) => {
	var result = (_item.progress.key.padStart(
		maxLength, ' ') + ' ' +
		_item.progress.percent + ' ');
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

	var done = Math._round(_item.progress.value * width);
	var todo = (width - done);

	return ('[' + DEFAULT_CHAR.repeat(done) + '-'.repeat(todo) + ']');
};

const removeProgressItem = (_item) => {
	const size = progressItems.length;
	resetMaxLength();

	for(var i = 0; i < progressItems.length; ++i)
	{
		if(progressItems[i] === _item)
		{
			progressItems.splice(i--, 1);
		}
		else
		{
			if(progressItems[i].progress.number > _item.progress.number)
			{
				--progressItems[i].progress.number;
			}
			
			maxLength = Math.max(maxLength,
				progressItems[i].progress.key.length);
		}
	}
	
	if(progressItems.length === 0)
	{
		return endProgressLines(size);
	}
	
	return updateProgressLines(size);
};

const totalProgressBar = () => {
	var result = getTotalString();
	const progress = (doneSize / totalSize);
	var result = getTotalString() + '    ' + Math._round(
		progress * 100).toString().padStart(3, ' ') + '%';
	const width = (process.stdout.columns - result.length - 3);
	if(width < 4) return result.substr(0, process.stdout.columns);
	const done = Math._round(progress * width);
	const todo = (width - done);
	result += ' [' + '#'.repeat(done) + '-'.repeat(todo) + ']';
	return result.substr(0, process.stdout.columns);
};

//
const statCallback = (_path, _error, _stats, _callback) => {
	++totalItems; totalSize += _stats.size;
	todo.push([ _path, _error, _stats, _callback ]);
	setImmediate(checkQueue);
};

const checkQueue = () => {
	var result = 0;

	while(open.length < PARALLEL && todo.length > 0)
	{
		const item = todo.shift();
		const orig = item[3];

		item[3] = (_res, ... _a) => setImmediate(() => {
			open.remove(_res);
			setImmediate(checkQueue);
			orig(_res, ... _a);
		});

		open.push(handleFile(... item));
		++result;
	}

	return result;
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

		var hash;

		if(CMP || !ORIG || !ORIG.has(result.file))
		{
			hash = true;
		}
		else
		{
			const orig = ORIG.get(result.file);
			
			if(orig.size !== result.size)
			{
				hash = true;
			}
			else
			{
				hash = !orig.hash;
			}
		}

		const onEnd = () => {
			//
			if(hash)
			{
				result.hash = result.hash.digest(DIGEST);

				if(PROGRESS)
				{
					removeProgressItem(result);
				}
			}
			else
			{
				result.hash = null;
			}
			
			//
			++doneItems;

			//
			if(ORIG && ORIG.has(result.file))
			{
				const orig = ORIG.get(result.file);
				
				if(!hash || orig.hash === result.hash)
				{
					result.time = orig.time;
					result.hash = orig.hash;
				}
				else
				{
					if(TIME === null)
					{
						result.time = Date.now();
					}
					else
					{
						result.time = TIME.getTime();
					}

					++CHG;
				}
			}
			else
			{
				if(TIME === null)
				{
					result.time = Date.now();
				}
				else
				{
					result.time = TIME.getTime();
				}

				++ADD;
			}

			//
			delete result.progress;
			
			//
			_callback(result);
		};
		
		if(hash)
		{
			const onData = (_chunk) => {
				doneSize += _chunk.length;
				result.hash.update(_chunk);
				if(PROGRESS)
					updateProgressItem(result,
						_chunk.length); };
		
			result.hash = crypto.createHash(HASH);
			const stream = fs.createReadStream(_path, {
				autoClose: true, emitClose: true,
				highWaterMark: BUFFER });

			stream.on('data', onData);
			stream.once('end', onEnd);
		
			if(PROGRESS)
			{
				createProgressItem(result);
			}
		}
		else
		{
			doneSize += result.size;
			onEnd();
		}
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
			if(TIME === null)
			{
				result.time = Date.now();
			}
			else
			{
				result.time = TIME.getTime();
			}

			++ADD;
		}
		
		_callback(result);
	}
	
	return result;
};

//

