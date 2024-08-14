#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/v4/
 * v0.1.0
 *
 * Helper script for my v4 project @ https://github.com/kekse1/v4/.
 * 
 * This will (re-)generate an index of files (depending on
 * the calling `.sh`-script or rather it's parameters). ..
 */

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
var TIME = null;
var ORIG = null;
var ARGS;

const prepare = () => {
	ARGS = getopt({
		root: { short: 'r', params: 1, index: 0, parse: false, help: 'Root path of the whole v4 project' },
		time: { short: 't', params: 1, index: 0, parse: true, help: 'Current time in milliseconds' },
		search: { short: 's', params: 1, index: 0, parse: false, help: 'The search path (for the documents)' },
		output: { short: 'o', params: 1, index: 0, parse: false, help: 'Output path (a `.json` file)' },
		home: { short: 'h', params: 1, index: 0, parse: false, help: 'The path below the ~home directory' }
	});

	if(ARGS.search && ARGS.output)
	{
		if(ARGS.search[ARGS.search.length - 1] !== path.sep)
		{
			ARGS.search += path.sep;
		}
		
		if(fs.existsSync(ARGS.search))
		{
			if(ARGS.output[ARGS.output.length - 1] === path.sep)
			{
				console.error('ERROR: `--output / -o` file may not be a directory. It should end with `.json`.');
				process.exit(3);
			}
			else if(fs.existsSync(ARGS.output))
			{
				const orig = JSON.parse(fs.readFileSync(ARGS.output, { encoding: 'utf8' }));
				ORIG = new Map();
				
				for(const i of orig)
				{
					ORIG.set(i.name, i);
				}
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

			console.info('Using search path: `' + ARGS.search + '`');
			console.info('      Output file: `' + ARGS.output + '`');
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
	fs.readdir(ARGS.search, { encoding: 'utf8', withFileTypes: true, recursive: false },
		(_err, _files) => readdirCallback(ARGS.search, _err, _files));
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
		for(const i of _result) NOW.add(i.name);
		ORIG = [ ... ORIG.keys() ];
		for(const o of ORIG) if(!NOW.has(o)) ++REM;
	}
	
	write(_result);
};

const write = (_result) => {
	const result = JSON.stringify(_result);
	fs.writeFileSync(ARGS.output, result, { encoding: 'utf8', mode: MODE, flush: true });
	fin(_result, result);
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

	var rest = 0; const cb = (_file) => { if(_file) {
		if(_file.size === null) DIR.push(_file);
		else { FILE.push(_file); SIZE += _file.size; }}
		if(--rest <= 0) transform(); };
	
	for(const item of _list)
	{
		if(item.name[0] === '.')
		{
			continue;
		}
		else if(! (item.isFile() || item.isDirectory()))
		{
			continue;
		}

		++rest; const p = path.join(_path, item.name);
		fs.stat(p, { bigint: false },
			(_err, _stats) => statCallback(p, _err, _stats, cb));
	}
};

const statCallback = (_path, _error, _stats, _callback) => {
	if(_error)
	{
		++ERR;
		return _callback(null);
	}
	else
	{
		++FOUND;
	}
	
	const result = Object.create(null);
	result.name = path.basename(_path);
	
	if(_stats.isFile())
	{
		result.size = _stats.size;

		const onEnd = () => {
			//
			result.hash = hash.digest(DIGEST);
			
			//
			if(ORIG && ORIG.has(result.name))
			{
				const orig = ORIG.get(result.name);
				
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
			_callback(result);
		};
		
		const hash = crypto.createHash(HASH);
		const stream = fs.createReadStream(_path, { autoClose: true, emitClose: true });
		stream.on('data', (_chunk) => hash.update(_chunk));
		stream.once('end', onEnd);
	}
	else
	{
		result.size = null;
		
		if(ORIG && ORIG.has(result.name))
		{
			result.time = ORIG.get(result.name).time;
		}
		else
		{
			result.time = TIME.getTime();
			++ADD;
		}
		
		_callback(result);
	}
};

//
