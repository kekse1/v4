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
//
//TODO/ausgaben generieren
//TODO/ausgabe*n* schreiben
//TODO/mehr formate!?!?
//
//

//
const WRITE = false;

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
	if(!WRITE)
	{
		console.warn('NO DATA WILL BE WRITTEN!' + EOL +
			'This is just a simulation (this time).');
	}
	
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
			
			entry[k++] = list[j].name;
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
		
		if(WRITE)
		{
			fs.writeFileSync(
				p, res[idx], { encoding: 'utf8' });
		}
		
		console.dir({p});
	}
};

generate.text = (_result = result) => {
	//
};

generate.json = (_result = result) => {
	//
};

generate.html = (_result = result) => {
	var res = '<ul>\n';

	for(var i = 0; i < _result.length; ++i)
	{
		//
	}
	
	return (res + '\n</ul>');
};

