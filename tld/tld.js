#!/usr/bin/env node

//
const	TXT = './tlds-alpha-by-domain.txt',
	//JSON = './tld.ovh.json',
	FILE = './tld.json';

//
import	fs from 'node:fs';
import	ovh from './tld.ovh.json' with { type: 'json' };

//
const	data = fs.readFileSync(TXT, { encoding: 'utf8' }).
		replaceAll('\r', '').split('\n'),
	set = new Set();
var	MAX = 0;

//
for(var i = 0; i < data.length; ++i)
{
	MAX = Math.max(MAX, data[i].split('.').length);
	set.add(data[i].toLowerCase());
}

set.delete('');
const	origSize = set.size;
console.info('The official TLD list contained ' +
	origSize.toLocaleString() + ' items.');

for(var i = 0; i < ovh.length; ++i)
{
	MAX = Math.max(MAX, ovh[i].split('.').length);
	set.add(ovh[i].toLowerCase());
}

set.delete('');
console.info('The OVH TLD list contained ' +
	ovh.length.toLocaleString() + ' items.');

const	diff = (set.size - origSize);

if(diff)
{
	console.info('So we collected ' + diff.toLocaleString() +
		' additional items, so our resulting item count' +
		' is ' + set.size.toLocaleString() + ' now.');
}

console.log('\nMAX = ' + MAX.toString() + '\n');

//
const	array = [ ... set ];
array.sort((_a, _b) => _a.
	localeCompare(_b, {
		sensitivity: 'base' }));

//
const	result = JSON.stringify(array);
fs.writeFileSync(FILE, result, { encoding: 'utf8' });
console.info('So I just wrote ' + result.length.toLocaleString() +
	' Bytes to your `' + FILE + '`. :-)');

//

