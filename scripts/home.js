#!/usr/bin/env node

//
// Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
// https://kekse.biz/ https://github.com/kekse1/v4/
// v0.1.0
//
// Helper script for my v4 project @ https://github.com/kekse1/v4/.
//
// Because everything is JavaScript and Google (and others) can't
// index my dynamic contents, I'm creating a file index of all of
// my 'home/'ies.
//

//
import { ready } from '../js/lib.js';
var args, items, result, INDEX;

ready(() => {

	//
	args = getopt();

	//
	if(!path.isValid(args.home))
	{
		console.error('Invalid --home path argument!');
		process.exit(2);
	}

	if(!String.isString(args.index))
	{
		console.error('Invalid --index argument!');
		process.exit(3);
	}

	//
	INDEX = args.index;

	//
	start();
	
});

//
const start = () => {

	const list = fs.readdirSync(args.home, {
		encoding: 'utf8',
		withFileTypes: true,
		recursive: false });
	items = [];
	
	for(var i = 0, j = 0; i < list.length; ++i)
	{
		if(list[i][0] === '.')
		{
			continue;
		}
		
		if(!list[i].isDirectory())
		{
			continue;
		}
		
		items[j++] = {
			name: list[i].name,
			path: path.join(
				args.home,
				list[i].name),
			home: path.join(
				'home/',
				list[i].name) };
	}
	
	if(items.length === 0)
	{
		console.error('No items found!');
		process.exit(4);
	}
	
	findIndexFiles(items);

};

const findIndexFiles = (_items = items) => {

	result = [];
	var list, entry;
	
	for(var i = 0, l = 0; i < _items.length; ++i)
	{
		list = fs.readdirSync(_items[i].path, {
			encoding: 'utf8',
			withFileTypes: true,
			recursive: false });
		entry = [];
		
		for(var j = 0, k = 0; j < list.length; ++j)
		{
			if(!list[j].name.startsWith(INDEX + '.'))
			{
				continue;
			}
			
			if(!list[j].isFile())
			{
				continue;
			}
			
			entry[k++] = {
				name: list[j].name,
				ext: path.extname(list[j].name) };
		}
		
		if(entry.length > 0)
		{
			result[l++] = Object.assign(
				_items[i], { entry });
		}
	}
	
	generate(result);

};

const generate = (_result = result) => {
	const res = {};
	
	for(const idx in generate)
	{
		res[idx] = generate[idx](_result);
	}
		
	//
	var p; for(const idx in res)
	{
		p = (args.home + '/' + INDEX + '.' + idx);
		
		fs.writeFileSync(
			p, res[idx], { encoding: 'utf8' });
		console.info('Just wrote ' +
			res[idx].length.toLocaleString() + ' Bytes:');
		console.debug('\t' + p);
	}
};

generate.html = (_result = result) => {
	var res = '<ul>\n';

	for(var i = 0; i < _result.length; ++i)
	{
		res += '\t<li>\n';
		
		for(var j = 0; j < _result[i].entry.length; ++j)
		{
			res += '\t\t<a href=' + path.join(_result[i].name + '/' +
				_result[i].entry[j].name).quote('"', true) + '>' +
				_result[i].name + _result[i].entry[j].ext + '</a>\n';
		}

		res += '\t</li>\n';
	}
	
	return (res + '\n</ul>');
};

