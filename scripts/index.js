#!/usr/bin/env node

//
// Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
// https://kekse.biz/ https://github.com/kekse1/v4/
// v1.0.0
//
// Helper script for my v4 project @ https://github.com/kekse1/v4/.
// Updated version (2024-10-13).
//

//
const PATH_SUB = [ 'lib', 'web' ];
const PATH_BASE = 'js';
var PATH = '../js/';

//
const DEFAULT_HASH = 'sha3-256';
const DEFAULT_DIGEST = 'hex';
const DEFAULT_MODE = 0o666;

//
// { base, name, hash, bytes, size, full, real };
var result = []; var resultIndex = 0; var summary = null;
//
var originalIndex = null; var args = null; var originalChanged = null;

//
import crypto from 'node:crypto';
import { ready } from '../js/lib.js';

//
ready(() => {

	//
	args = getopt();

	//
	if(args.debug)
	{
		console.warn('--debug mode enabled (so nothing will be written to disk)!');
	}
	else
	{
		if(! path.isValid(args.library))
		{
			console.error('Invalid --library path argument');
			process.exit(1);
		}
		
		if(! path.isValid(args.index))
		{
			console.error('Invalid --index path argument');
			process.exit(1);
		}
		
		if(! path.isValid(args.summary))
		{
			console.error('Invalid --summary path argument');
			process.exit(1);
		}
		
		if(!String.isString(args.update, false))
		{
			console.error('Invalid --update path argument');
			process.exit(1);
		}
		
		console.debug('  Summary: ' + args.summary.quote());
		console.debug('    Index: ' + args.index.quote());
		console.debug('Timestamp: ' + args.update.quote());
	}

	//
	if(fs.exists.file(args.index))
	{
		const orig = JSON.parse(fs.readFileSync(args.index, {
			encoding: 'utf8' })); originalIndex = new Map();
		for(const entry of orig) originalIndex.set(entry.name, entry);
		if(originalIndex.size === 0) originalIndex = null;
		else console.debug('Original index exists, so we\'ll compare the hashes.');
	}

	//
	console.eol();
	return proceed();
});

const proceed = () => {
	//
	var amount = 0; const cb = (_file) => { if(--amount <= 0) return handleResult(); };
	for(var sub of PATH_SUB) { sub = path.join(args.library, sub); fs.readdir(sub, { encoding: 'utf8', withFileTypes: true, recursive: true }, (_err, _files) => {
			if(_err) return error(_err); for(var i = 0; i < _files.length; ++i) { const subResult = {};
				if(_files[i].name[0] === '.' || !_files[i].name.endsWith('.js')) continue;
				++amount; const p = path.join(_files[i].path, _files[i].name);
				subResult.base = path.basename(_files[i].name, '.js');
				const pp = p.split(path.sep); for(var j = pp.length - 1; j >= 0; --j)
					if(pp[j] === PATH_BASE) {
						subResult.name = pp.slice(j - pp.length + 1).join(path.sep); break; }
				if(!subResult.name) return error('Unknown/invalid/.. path');
				handleFile(p, result[resultIndex++] = subResult, cb); }})};
};

const handleFile = (_path, _sub_result, _callback) => { var bytes = 0; var real = 0; var full = 0; var last = false;
	const hash = crypto.createHash(DEFAULT_HASH); const stream = fs.createReadStream(_path, { encoding: null, autoClose: true, emitClose: true });
	stream.on('data', (_chunk) => { bytes += _chunk.length; hash.update(_chunk);
		for(var i = 0; i < _chunk.length; ++i) {
			if(_chunk[i] === 10) {
				if(_chunk[i + 1] === 13) ++i;
				if(!last) ++real; ++full;
				last = true;
			} else if(_chunk[i] === 13) {
				if(_chunk[i + 1] === 10) ++i;
				if(!last) ++real; ++full;
				last = true;
			} else last = false; }});
	stream.once('end', () => {
		_sub_result.hash = hash.digest(DEFAULT_DIGEST);
		_sub_result.size = Math.size.render(_sub_result.bytes = bytes).toString();
		_sub_result.full = full; _sub_result.real = real; _callback(_sub_result, _path); });
};

const handleResult = () => { result.sort('bytes', false);
	const changes = checkForChanges(); makeSummary(changes);
	if(args.debug) console.dir(result); console.dir({ Summary: summary });
	if(!args.debug) writeResults(changes); process.exit();
};

const writeResults = (_changes) => {
	const stringIndex = JSON.stringify(result);
	const stringSummary = JSON.stringify(summary);
	const stringUpdate = Date.now().toString();
	fs.writeFileSync(args.index, stringIndex, { encoding: 'utf8', mode: DEFAULT_MODE, flush: true });
	console.debug('  Index bytes written: ' + stringIndex.length);
	fs.writeFileSync(args.summary, stringSummary, { encoding: 'utf8', mode: DEFAULT_MODE, flush: true });
	console.debug('Summary bytes written: ' + stringSummary.length);
	if(_changes > 0 || args.force) {
		if(_changes > 0) console.info('I found % changes, so we\'re updating the ' + path.basename(args.update).quote() + ' file.' + EOL + 'Don\'t forget to update your `VERSION.txt`! ;-)', _changes);
		else console.info('No changes found, but because of `--force` we nevertheless update the ' + path.basename(args.update).quote() + ' file.');
		if(fs.exists.file(args.update)) originalChanged = Number(fs.readFileSync(args.update, { encoding: 'utf8' }));
		if(originalChanged !== null) console.debug('Original timestamp: ' + originalChanged); console.debug('     New timestamp: ' + stringUpdate);
		fs.writeFileSync(args.update, stringUpdate, { encoding: 'utf8', mode: DEFAULT_MODE, flush: true }); }
	else console.info('No changes found. Timestamp left as it was before.'); };

const makeSummary = (_changes) => { summary = { files: 0, bytes: 0, full: 0, real: 0, size: null };
	for(var i = 0; i < result.length; ++i) { ++summary.files;
		summary.bytes += result[i].bytes; summary.full += result[i].full;
		summary.real += result[i].real; summary.changes = _changes; }
	summary.size = Math.size.render(summary.bytes).toString(); return summary;
};

const checkForChanges = () => { if(!originalIndex) return result.length; var changes = 0;
	for(var i = 0; i < result.length; ++i) {
		if(!originalIndex.has(result[i].name)) ++changes;
		else if(originalIndex.get(result[i].name).hash !== result[i].hash) ++changes; }
	return changes;
};

//
