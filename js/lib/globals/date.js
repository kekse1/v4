/*
* Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
* https://kekse.biz/ https://github.com/kekse1/v4/
*/

//
const DEFAULT_FORMAT_HTML = !!BROWSER;
const DEFAULT_FORMAT_PARENTHESIS = true;
const DEFAULT_FORMAT_SMALLER_TIME = '0.8em';
const DEFAULT_EFFICIENT_LEAP_YEAR = true;

//
export default Date;

//
const moonPhaseIcon = [ '🌕', '🌔', '🌓', '🌒', '🌑', '🌑', '🌘', '🌗', '🌖', '🌕' ];
Reflect.defineProperty(Date, 'moonPhaseIcon', { get: () => [ ... moonPhaseIcon  ] });

const moonPhaseText = {
	en: [
		'New Moon',
		'Waxing Crescent',
		'First Quarter',
		'Waxing Gibbous',
		'Full Moon',
		'Waning Gibbous',
		'Last Quarter',
		'Waning Crescent'
	],
	de: [
		'Neumond',
		'Zunehmender Mond',
		'Halbmond',
		'Zunehmender Dreiviertelmond',
		'Vollmond',
		'Abnehmender Dreiviertelmond',
		'Halbmond',
		'Abnehmender Mond'
	]
};

Reflect.defineProperty(Date, 'moonPhaseText', {
	get: () => [ ... moonPhaseText ],
	set: (_lang) => { if(!String.isString(_lang, false)) return [ ... moonPhaseText ];
		else if((_lang = _lang.substr(0, 2).toLowerCase()) in moonPhaseText)
			return moonPhaseText[_lang];
		return [ ... moonPhaseText ]; }});

const SYNODIC_MONTH = 29.53058867;
Reflect.defineProperty(Date, 'moonDays', { get: () => SYNODIC_MONTH });
const KNOWN_NEW_MOON = new Date(2024, 1, 10, 0, 0, 0);

Reflect.defineProperty(Date, 'moonPhase', { value: (_date = new Date()) => {
{
	return (Date.moonAge(_date) / SYNODIC_MONTH);
}}});

Reflect.defineProperty(Date, 'moonAge', { value: (_date = new Date()) => {
	if(Number.isInt(_date)) _date = new Date(_date);
	else if(String.isString(_date, false) && !isNaN(_date)) _date = new Date(Number(_date));
	else if(!Reflect.is(_date, 'Date')) return error('Invalid % argument', null, '_date');
	const diffInMilliSec = (_date.getTime() - KNOWN_NEW_MOON.getTime());
	const diffInDays = (diffInMilliSec / (1000 * 60 * 60 * 24));
	const result = (diffInDays % SYNODIC_MONTH);
	if(result < 0) return (SYNODIC_MONTH + result);
	return result;
}});

Reflect.defineProperty(Date, 'moonLevel', { value: (_date = new Date()) => {
	const moonPhase = Date.moonPhase(_date);
	const fullMoonDiff = Math.abs(moonPhase - 0.5);
	const brightness = (1 - fullMoonDiff * 2);
	return Math.max(0, Math.min(brightness, 1));
}});

Reflect.defineProperty(Date.prototype, 'moonPhase', { get: function()
{
	return Date.moonPhase(this);
}});

Reflect.defineProperty(Date.prototype, 'moonAge', { get: function()
{
	return Date.moonAge(this);
}});

Reflect.defineProperty(Date.prototype, 'moonLevel', { get: function()
{
	return Date.moonLevel(this);
}});

//
Reflect.defineProperty(Date, 'dayByYear', { value: (_date = new Date()) => { return _date.dayByYear; }});
Reflect.defineProperty(Date.prototype, 'dayByYear', { get: function()
{
	const start = new Date(this.getFullYear(), 0, 0);
	const diff = (this - start) + ((start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000);
	const oneDay = (1000 * 60 * 60 * 24);
	return (diff / oneDay);//Math.floor(diff / oneDay);//ohne nackomma siehe 'dayInYear' (w/ *In*!)!
}});

Reflect.defineProperty(Date, 'dayInYear', { value: (_date = new Date()) => { return Math.floor(_date.dayByYear); }});
Reflect.defineProperty(Date.prototype, 'dayInYear', { get: function() { return Math.floor(this.dayByYear); }});

//
Reflect.defineProperty(Date, 'daysInYear', { value: (_date = new Date()) => { return _date.daysInYear; }});
Reflect.defineProperty(Date.prototype, 'daysInYear', { get: function() {
	if(this.isLeapYear) return 366; return 365; }});

Reflect.defineProperty(Date, 'daysInMonth', { value: (_date = new Date()) => {
	const year = _date.getFullYear();
	const month = _date.getMonth();

	if(month === 1)
	{
		if(_date.isLeapYear)
		{
			return 29;
		}

		return 28;
	}

	const negate = (month >= 7);
	return ((month % 2) === 0 ? (negate ? 30 : 31) : (negate ? 31 : 30));
}});

Reflect.defineProperty(Date.prototype, 'daysInMonth', { get: function() { return Date.daysInMonth(this); }});

Reflect.defineProperty(Date, 'isLeapYear', { value: (_date = new Date()) => {
	//
	var year;

	if(Reflect.is(_date, 'Date'))
	{
		year = _date.getFullYear();
	}
	else if(Number.isInt(_date))
	{
		year = _date;
	}
	else if(typeof _date === 'bigint')
	{
		year = Number(_date);
	}
	else if(typeof _date === 'string' && !isNaN(_date))
	{
		year = Number(_date);
	}
	else
	{
		return error('Not a valid year or % object', null, 'Date');
	}

	//
	var result;

	if(DEFAULT_EFFICIENT_LEAP_YEAR === true)
	{
		result = (((year & 3) === 0) && (((year % 25) !== 0) || ((year & 15) === 0)));
	}
	else if(DEFAULT_EFFICIENT_LEAP_YEAR === false)
	{
		result = ((((year % 4) === 0) && ((year % 100) !== 0)) || (year % 400) === 0);
	}
	else if(DEFAULT_EFFICIENT_LEAP_YEAR === null)
	{
		return (new Date(year, 1, 29).getDate() === 29);
	}
	else
	{
		return error('Invalid % configuration (may only be %, % or %)', null, 'DEFAULT_EFFICIENT_LEAP_YEAR', true, false, null);
	}

	return result;
	/*** ORIGINAL version *** /
	if(year % 4 === 0)
	{
		if(year % 100 === 0)
		{
			if(year % 400 === 0)
			{
				return true;
			}

			return false;
		}

		return true;
	}

	return false;*/
}});

Reflect.defineProperty(Date.prototype, 'isLeapYear', { get: function() { return Date.isLeapYear(this); }});

//
Reflect.defineProperty(Date, 'yearPercent', { value: (_date = new Date()) => { return (_date.year * 100); }});
Reflect.defineProperty(Date.prototype, 'yearPercent', { get: function() { return (this.year * 100); }});

Reflect.defineProperty(Date, 'years', { value: (_date = new Date()) => { return _date.years; }});
Reflect.defineProperty(Date.prototype, 'years', { get: function() { return (this.getFullYear() + this.year); }});

Reflect.defineProperty(Date, 'year', { value: (_date = new Date()) => { return _date.year; }});
Reflect.defineProperty(Date.prototype, 'year', { get: function() { return ((this.months - 1) / 12); }});

Reflect.defineProperty(Date, 'months', { value: (_date = new Date()) => { return _date.months; }});
Reflect.defineProperty(Date.prototype, 'months', { get: function() { return (this.getMonth() + 1 + this.month); }});

Reflect.defineProperty(Date, 'month', { value: (_date = new Date()) => { return _date.month; }});
Reflect.defineProperty(Date.prototype, 'month', { get: function() { return (this.days / (this.daysInMonth + 1)); }});

Reflect.defineProperty(Date, 'weeks', { value: (_date = new Date()) => {
	const start = new Date(_date.getFullYear(), 0, 1);
	const today = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate());
	const dayInYear = ((today.getTime() - start.getTime() + 1) / 86400000);
	return ((dayInYear / 7) + 1);
}});

Reflect.defineProperty(Date.prototype, 'weeks', { get: function() { return Date.weeks(this); }});

Reflect.defineProperty(Date, 'week', { value: (_date = new Date()) => { return Math.floor(Date.weeks(_date)); }});
Reflect.defineProperty(Date.prototype, 'week', { get: function() { return Date.week(this); }});

Reflect.defineProperty(Date, 'days', { value: (_date = new Date()) => { return _date.days; }});
Reflect.defineProperty(Date.prototype, 'days', { get: function() { return (this.getDate() - 1 + this.day); }});

Reflect.defineProperty(Date, 'day', { value: (_date = new Date()) => { return _date.day; }});
Reflect.defineProperty(Date.prototype, 'day', { get: function() { return (this.hours / 24); }});

Reflect.defineProperty(Date, 'hours', { value: (_date = new Date()) => { return _date.hours; }});
Reflect.defineProperty(Date.prototype, 'hours', { get: function() { return (this.getHours() + this.hour); }});

Reflect.defineProperty(Date, 'hour', { value: (_date = new Date()) => { return _date.hour; }});
Reflect.defineProperty(Date.prototype, 'hour', { get: function() { return (this.minutes / 60); }});

Reflect.defineProperty(Date, 'minutes', { value: (_date = new Date()) => { return _date.minutes; }});
Reflect.defineProperty(Date.prototype, 'minutes', { get: function() { return (this.getMinutes() + this.minute); }});

Reflect.defineProperty(Date, 'minute', { value: (_date = new Date()) => { return _date.minute; }});
Reflect.defineProperty(Date.prototype, 'minute', { get: function() { return (this.seconds / 60); }});

Reflect.defineProperty(Date, 'seconds', { value: (_date = new Date()) => { return _date.seconds; }});
Reflect.defineProperty(Date.prototype, 'seconds', { get: function() { return (this.getSeconds() + this.second); }});

Reflect.defineProperty(Date, 'second', { value: (_date = new Date()) => { return _date.second; }});
Reflect.defineProperty(Date.prototype, 'second', { get: function() { return (this.getMilliseconds() / 1000); }});

Reflect.defineProperty(Date, 'milliseconds', { value: (_date = new Date()) => { return _date.milliseconds; }});
Reflect.defineProperty(Date.prototype, 'milliseconds', { get: function() { return this.getMilliseconds(); }});

Reflect.defineProperty(Date, 'millisecond', { value: (_date = new Date()) => { return _date.millisecond; }});
Reflect.defineProperty(Date.prototype, 'millisecond', { get: function() { return (this.getMilliseconds() / 1000); }});

//
Reflect.defineProperty(Date, 'unix', { value: (_date = new Date()) => {
	try
	{
		return _date.unix;
	}
	catch(_error)
	{
		return error('Invalid % argument', null, '_date');
	}
	
	return null;
}});

Reflect.defineProperty(Date.prototype, 'unix', { get: function() { return Math.round(this.getTime() / 1000); }});

//
Reflect.defineProperty(Date, 'modifiers', { get: () => { return Array.from(Date.format.modifiers); }});

Reflect.defineProperty(Date, 'hasModifier', { value: (... _args) => {
	if(_args.length === 0) return null;
	var input = new Set();
	for(var i = 0; i < _args.length; ++i) if(typeof _args[i] === 'string' && _args[i].length > 0) for(const c of _args[i]) input.add(c);
	if(input.size === 0) return null;
	else input = Array.from(input).join('');
	for(const i of input) if(!Date.format.modifiers.has(i)) return false;
	return true;
}});

Reflect.defineProperty(Date.prototype, 'format', { value: function(_format = date.getDefaultDateFormat())
{
	//
	if(typeof _format !== 'string') _format = date.getDefaultDateFormat(true);
	else if(_format.length === 0) return '';
	else _format = date.getDateFormat(_format);

	//
	var result = '';
	var f;

	for(var i = 0; i < _format.length; i++)
	{
		if(_format[i] === '\\') { if(i < (_format.length - 1)) result += _format[++i]; }
		else if(_format[i] === '%')
		{
			if(i < (_format.length - 1))
			{
				if(Date.format.modifiers.has(f = _format[i + 1]))
					{ result += Date.format[f](this); ++i; }
				else result += '%';
			}
		}
		else result += _format[i];
	}

	//
	return result;
}});

Reflect.defineProperty(Date, 'format', { value: (_format = date.getDefaultDateFormat(), _date = new Date()) => {
	try
	{
		return _date.format(_format);
	}
	catch(_error)
	{
		return error('Invalid % argument', null, '_date');
	}
	
	return null;
}});

Date.format['d'] = (_date = new Date()) => { return Date.dayInYear(_date).toString(); };
Date.format['Y'] = (_date = new Date()) => { return _date.getFullYear().toString(); };
Date.format['y'] = (_date = new Date()) => { return _date.getFullYear().toString().substr(2); };
Date.format['M'] = (_date = new Date()) => { return (_date.getMonth() + 1).toString().padStart(2, '0'); };
Date.format['D'] = (_date = new Date()) => { return _date.getDate().toString().padStart(2, '0'); };
Date.format['k'] = (_date = new Date()) => { return Date.week(_date).toString(); };
Date.format['h'] = (_date = new Date()) => { return _date.getHours().toString().padStart(2, '0'); };
Date.format['H'] = (_date = new Date()) => {
	var twelve = _date.getHours() % 12;
	if(twelve === 0) twelve = 12;
	return twelve.toString().padStart(2, '0');
};

Date.format['m'] = (_date = new Date()) => { return _date.getMinutes().toString().padStart(2, '0'); };
Date.format['s'] = (_date = new Date()) => { return _date.getSeconds().toString().padStart(2, '0'); };
Date.format['S'] = (_date = new Date()) => { return _date.getMilliseconds().toString().padStart(3, '0'); };
Date.format['x'] = (_date = new Date()) => { return Math.round(_date.getTime() / 1000).toString(); };
Date.format['X'] = (_date = new Date()) => { return _date.getTime().toString(); };
Date.format['t'] = (_date = new Date()) => {
	if(_date.getHours() < 12) return 'am';
	return 'pm'; };
Date.format['T'] = (_date = new Date()) => {
	if(_date.getHours() < 12) return 'AM';
	return 'PM'; };
Date.format['N'] = (_date = new Date()) => { return Date.MONTH(_date, false); };
Date.format['n'] = (_date = new Date()) => { return Date.MONTH(_date, true); };
Date.format['W'] = (_date = new Date()) => { return Date.WEEKDAY(_date, false); };
Date.format['w'] = (_date = new Date()) => { return Date.WEEKDAY(_date, true); };
Date.format['G'] = (_date = new Date()) => { return _date.toGMTString(); };
Date.format['U'] = (_date = new Date()) => { return _date.toUTCString(); };

//
Date.format.modifiers = new Set();
const modifiers = Reflect.ownKeys(Date.format).sort();
for(const mod of modifiers) if(typeof mod === 'string' && mod.length === 1) Date.format.modifiers.add(mod);

//
Reflect.defineProperty(Date, 'WEEKDAY', { value: (_day, _short = false, _lang = navigator.language) => {
	if(typeof _short !== 'boolean')
	{
		return error('Invalid % argument (not a %)', null, '_short', 'Boolean');
	}
	else if(Array.isArray(_lang, false))
	{
		for(var i = 0; i < _lang.length; ++i)
		{
			if(String.isString(_lang[i], false))
			{
				_lang = _lang[i];
				break;
			}
		}
	}

	if(! String.isString(_lang, false))
	{
		_lang = navigator.language;
	}

	if(Number.isNumber(_day))
	{
		//_day = Math.floor(_day) % 7;
		_day = Math.getIndex(_day, 7);
	}
	else if(Reflect.is(_day, 'Date'))
	{
		_day = _day.getDay();
	}
	else if(_day !== null)
	{
		_day = new Date().getDay();
	}

	const dtf = intl(_lang, 'DateTimeFormat', { weekday: (_short ? 'short' : 'long') });

	if(_day !== null)
	{
		return dtf.format(new Date(86400000*(3+_day)));
	}

	const result = new Array(7);

	for(var i = 0, j = 3; i < 7; ++i, ++j)
	{
		result[i] = dtf.format(new Date(86400000 * j));
	}

	return result;
}});

Reflect.defineProperty(Date, 'MONTH', { value: (_month, _short = false, _lang = navigator.language) => {
	if(typeof _short !== 'boolean')
	{
		return error('Invalid % argument (not a %)', null, '_short', 'Boolean');
	}
	else if(Array.isArray(_lang, false))
	{
		for(var i = 0; i < _lang.length; ++i)
		{
			if(String.isString(_lang[i], false))
			{
				_lang = _lang[i];
				break;
			}
		}
	}

	if(! String.isString(_lang, false))
	{
		_lang = navigator.language;
	}

	if(Number.isNumber(_month))
	{
		//_month = Math.floor(_month) % 12;
		_month = Math.getIndex(_month, 12);
	}
	else if(Reflect.is(_month, 'Date'))
	{
		_month = _month.getMonth();
	}
	else if(_month !== null)
	{
		_month = new Date().getMonth();
	}

	const dtf = intl(_lang, 'DateTimeFormat', { month: (_short ? 'short' : 'long') });

	if(_month !== null)
	{
		return dtf.format(new Date(2419200000*(_month+1)));
	}

	const result = new Array(12);

	for(var i = 0; i < 12; ++i)
	{
		result[i] = dtf.format(new Date(2419200000*(i+1)));
	}

	return result;
}});

//
const date = Date.date = global.date = (_which = date.getDefaultDateFormat(), _date = new Date()) => {
	if(! String.isString(_which, false)) _which = date.getDefaultDateFormat(false);
	if(Number.isInt(_date)) _date = new Date(_date);
	else if(! Reflect.is(_date, 'Date')) _date = new Date();
	return _date.format(date.getDateFormat(_which));
};

//
date.getDateFormat = (_format = date.getDefaultDateFormat(false)) => {
	if(typeof _format !== 'string') _format = date.getDefaultDateFormat(false);
	if(_format.includes('%')) return _format;
	const result = document.parseVariable('date-' + _format.toLowerCase());	
	if(result.length > 0) return result; return _format;
};

date.getDefaultDateFormat = (_resolve = false) => {
	const result = document.parseVariable('date');
	if(_resolve) return document.parseVariable('date-' + result);
	return result;
};

//
Reflect.defineProperty(Date, 'toString', { value: function(_date = new Date(), _html = DEFAULT_FORMAT_HTML, _parenthesis = DEFAULT_FORMAT_PARENTHESIS, _smaller_time = DEFAULT_FORMAT_SMALLER_TIME)
{
	if(typeof _html !== 'boolean')
	{
		_html = DEFAULT_FORMAT_HTML;
	}

	if(typeof _parenthesis !== 'boolean')
	{
		_parenthesis = DEFAULT_FORMAT_PARENTHESIS;
	}

	if(! Reflect.is(_date, 'Date'))
	{
		_date = new Date();
	}

	var result = (_html ? '<span class="date">' : '');

	result += _date.getFullYear() + '-';
	result += (_date.getMonth() + 1).toString().padStart(2, '0') + '-';
	result += _date.getDate().toString().padStart(2, '0') + ' ';

	if(!String.isString(_smaller_time, false))
	{
		if(_smaller_time) _smaller_time = DEFAULT_FORMAT_SMALLER_TIME;
		else _smaller_time = null;
	}

	if(_smaller_time)
	{
		result += '<span style="font-size: ' + _smaller_time + ';">';
	}

	if(_parenthesis)
	{
		result += '(';
	}

	result += _date.getHours().toString().padStart(2, '0') + ':';
	result += _date.getMinutes().toString().padStart(2, '0') + ':';
	result += _date.getSeconds().toString().padStart(2, '0');

	if(_parenthesis)
	{
		result += ')';
	}

	if(_smaller_time)
	{
		result += '</span>';
	}

	return (result + (_html ? '</span>' : ''));
}});

const _toString = Date.prototype.toString;

Reflect.defineProperty(Date.prototype, 'toString', { value: function(_html = DEFAULT_FORMAT_HTML, _parenthesis = DEFAULT_FORMAT_PARENTHESIS)
{
	if(typeof _html !== 'boolean') return _toString.call(this);
	return Date.toString(this, _html, _parenthesis);
}});

//
//FIXME/
/*
Reflect.defineProperty(Date, 'age', { value: function(_year, _month, _day, _hour, _minute, _second, _millisecond)
{
	if(typeof _month === 'number')
	{
		_month--;
	}

	const result = Object.create(null);

	const now = new Date();
	const bday = new Date(... arguments);
	var rest = false, oldRest = false;
	var diff;

	for(var i = 0; i < Date.age.units.length; i++)
	{
		const [ unit, base ] = Date.age.units[i];
		diff = (now[unit] - bday[unit]);

		/*if(diff < 0 && base !== 1)
		{
			diff = (base + diff);
		}*//*

		result[unit] = diff;
	}

	return result;
}});

Date.age.units = [
	[ 'years', 1 ],
	[ 'months', 12 ],
	[ 'days', 1 ],
	[ 'hours', 24 ],
	[ 'minutes', 60 ],
	[ 'seconds', 60 ]
];*/

//

