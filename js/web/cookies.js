/*
* Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
* https://kekse.biz/ https://github.com/kekse1/v4/
*/

//
//see also 'settings.js'. maybe..
//

//
const DEFAULT_PROXY_PREFIX = '';//'_';
//const DEFAULT_SAME_SITE_COOKIE = 'Strict';
const DEFAULT_HOURS = 17600;
const DEFAULT_OSD = 2600;
const DEFAULT_CLEAR = false;

//
const cookieTraps = {};

cookieTraps.defineProperty = (_target, _property, _descriptor) => {
	if(typeof _target[_property] === 'function') return _target[_property];
	if(Object.isObject(_descriptor) && ('value' in _descriptor)) try {
		return (typeof document.setCookie(_property, _descriptor.value)
			=== 'string'); } catch(_err) {}
	return false; };
cookieTraps.deleteProperty = (_target, _property) => {
	if(typeof _target[_property] === 'function') return false;
	try { return (document.removeCookie(_property) !== null); }
	catch(_err) {} return false; };
cookieTraps.get = (_target, _property) => {
	if(typeof _target[_property] === 'function') return _target[_property];
	try { return document.getCookie(_property); }
	catch(_err) {} return undefined; };
cookieTraps.getOwnPropertyDescriptor = (_target, _property) => {
	if(typeof _target[_property] === 'function') return undefined;
	try { if(! document.hasCookie(_property)) return undefined;
		return { value: document.getCookie(_property),
			writable: true, enumerable: true, configurable: true }; }
		catch(_err) {}; return undefined; };
cookieTraps.has = (_target, _property) => {
	if(typeof _target[_property] === 'function') return false;
	try { return document.hasCookie(_property); }
	catch(_err) {} return false; };
cookieTraps.isExtensible = (_target) => true;
cookieTraps.ownKeys = (_target) => Object.keys(document.getCookies());
cookieTraps.set = (_target, _property, _value) => {
	if(typeof _target[_property] === 'function') return false;
	try { document.setCookie(_property, _value); }
	catch(_err) { return false; } return true; };

//
document.COOKIES = null;

Reflect.defineProperty(document, 'setCookies', { value: (_true, _clear = DEFAULT_CLEAR, _osd = DEFAULT_OSD) => {
	if(typeof _true !== 'boolean')
	{
		return document.COOKIES;
	}

	const changed = (document.COOKIES !== _true);

	if(document.COOKIES = _true)
	{
		if(changed)
		{
			console.debug('Cookies enabled.');

			if(Number.isInt(_osd) && _osd > 0)
			{
				osd('<b class="aqua">Cookies</b> ' +
					'<span class="true">enabled</span>.',
					_osd, 'setCookies');
			}
		}
	}
	else
	{
		if(changed)
		{
			console.debug('Cookies disabled' + (_clear ?
				' and cleared' : '') + '.');

			if(Number.isInt(_osd) && _osd > 0)
			{
				osd('<b class="aqua">Cookies</b> ' +
					'<span class="false">disabled</span>.',
						_osd, 'setCookies');
			}
		}

		if(_clear)
		{
			document.clearCookies();
		}
	}

	document.COOKIES = true;
	document.setCookie('cookies', _true);
	document.COOKIES = _true;

	setTimeout(() => document.emit('cookies', {
		enabled: _true, disabled: !_true }));
	return _true;
}});

prepare(() => {
	if(document.hasBooleanCookie('cookies'))
	{
		document.setCookies(
			document.getCookie('cookies'));
	}
	else
	{
		document.setCookies(true, false, false);
	}
});

//
Reflect.defineProperty(document, 'clearCookies', { value: function(... _args)
{
	const cookies = document.listCookies(false, false); const result = [];
	for(const c of cookies) if(document.removeCookie(c[0], ... _args) !== null)
		result.push(c[0]);
	if(DEFAULT_OSD) osd('<span style="color: yellow;">' + result.length.toLocaleString() +
		'</span> cookies <span class="false">cleared</span>!', DEFAULT_OSD, 'clearCookies');
	setTimeout(() => document.emit('cookie', { method: 'clear' }));
	return result;
}});

Reflect.defineProperty(document, 'getCookie', { value: function(_name, _parse = true)
{
	if(! String.isString(_name, false))
	{
		return error('Invalid % argument (no non-empty %)', null, '_name', 'String');
	}

	const cookies = document.cookie.trim().split(';');

	for(var i = 0; i < cookies.length; ++i)
	{
		if((cookies[i] = cookies[i].trim().split('=')).length > 2)
		{
			return error('UNEXPECTED');
		}
		else for(var j = 0; j < cookies[i].length; ++j)
		{
			cookies[i][j] = decodeURIComponent(cookies[i][j].trim());
		}

		if(cookies[i][0] !== _name)
		{
			continue;
		}

		if(_parse)
		{
			return parseCookieValue(cookies[i][1]);
		}

		return cookies[i][1];
	}

	return null;
}});

const parseCookieValue = (_value) => {
	if(typeof _value !== 'string') return _value;
	if(!isNaN(_value)) return Number(_value);
	if(_value[_value.length - 1] === 'n' &&
			!isNaN(_value.slice(0, -1)))
		return BigInt(_value.slice(0, -1));
	switch(_value.toLowerCase()) {
		case 'true': return true;
		case 'false': return false; }
	return (_value.length < 2 ? '' : _value); };

Reflect.defineProperty(document, 'getCookies', { value: function(_parse = true)
{
	const cookies = document.listCookies(_parse, false); const result = Object.create(null);
	for(const c of cookies) result[c[0]] = c[1]; return result;
}});

Reflect.defineProperty(document, 'hasCookie', { value: function(_name)
{
	return (document.getCookie(_name) !== null);
}});

Reflect.defineProperty(document, 'hasNumericCookie', { value: function(_name)
{
	var cookie = document.getCookie(_name); if(cookie === null) return null;
	cookie = parseCookieValue(cookie); return (typeof cookie === 'bigint' ||
		typeof cookie === 'number');
}});

Reflect.defineProperty(document, 'hasBooleanCookie', { value: function(_name)
{
	var cookie = document.getCookie(_name); if(cookie === null) return null;
	cookie = parseCookieValue(cookie); return (typeof cookie === 'boolean');
}});

Reflect.defineProperty(document, 'listCookies', { value: function(_parse = true, _associative = false)
{
	const cookies = document.cookie.trim().split(';');
	const result = [];

	var value; for(var i = 0, j = 0; i < cookies.length; ++i)
	{
		if((cookies[i] = cookies[i].trim().split('=')).length > 2) return error('UNEXPECTED');
		else if(! String.isString(cookies[i][0], false)) continue;
		else for(var k = 0; k < cookies[i].length; ++k) cookies[i][k] = decodeURIComponent(cookies[i][k].trim());

		value = cookies[i][1];

		if(_parse)
		{
			value = parseCookieValue(value);
		}

		if(_associative)
		{
			result[j] = Object.null({
				key: cookies[i][0],
				value: value });
		}
		else
		{
			result[j] = [
				cookies[i][0],
				value ];
		}

		++j;
	}

	return result;
}});

Reflect.defineProperty(document, 'removeCookie', { value: function(_name, _seconds_to_live = 0, _path = '/')
{
	if(String.isString(_name, false)) _name = encodeURIComponent(_name);
	else return error('Invalid % argument (not a non-empty %)', null, '_name', 'String');

	var result = document.getCookie(_name); if(result === null) return null;
	const value = result; if(typeof result !== 'string') result = result.toString();
	result = encodeURIComponent(result);

	if(!String.isString(_path, false)) _path = '/';
	if(!Number.isInt(_seconds_to_live)) _seconds_to_live = 0;

	const expires = new Date(Date.now() + (_seconds_to_live * 1000));
	document.cookie = (_name + '=' + result + '; Expires=' + expires.toUTCString() + '; Path=' + _path);
	
	setTimeout(() => document.emit('cookie', { method: 'remove', name: _name,
		value, string: result, result: (result = decodeURIComponent(result)) }));
	return decodeURIComponent(result);
}});

Reflect.defineProperty(document, 'setCookie', { value: function(_name, _value, _hours = DEFAULT_HOURS, _path = '/')//, _same_site = DEFAULT_SAME_SITE_COOKIE)
{
	if(!document.COOKIES) return;
	if(String.isString(_name, false)) _name = encodeURIComponent(_name);
	else return error('Invalid % argument (not a non-empty %)', null, '_name', 'String');
	if(typeof _value === 'undefined') return document.removeCookie(_name);
	const secure = (location.protocol === 'https:' ? ' Secure;' : '');
	//if(! String.isString(_same_site, false)) _same_site = DEFAULT_SAME_SITE_COOKIE;
	//_same_site = ' SameSite=' + _same_site + ';';
	const value = _value; if(typeof _value === 'string') _value = encodeURIComponent(_value);
	else if(Number.isNumber(_value)) _value = _value.toString();
	else if(typeof _value === 'bigint') _value = _value.toString();
	else if(typeof _value === 'boolean') _value = (_value ? 'true' : 'false');
	else if(Reflect.is(_value, 'Date')) _value = _value.getTime();
	else return error('Invalid % argument (neither a % nor % nor a % type, nor %)', null, '_value', 'String', 'numeric', 'Boolean', null);

	var expires;

	if(Reflect.is(_hours, 'Date'))
	{
		expires = ' Expires=' + _hours.toUTCString() + ';';
	}
	else if(Number.isNumber(_hours) && _hours >= 0)
	{
		expires = ' Expires=' + new Date(Math.ceil(Date.now() + (_hours * 3600000))).toUTCString() + ';';
	}
	else if(typeof _hours === 'bigint')
	{
		expires = ' Max-Age=' + _hours + ';';
	}
	else
	{
		expires = '';
	}

	if(! String.isString(_path, false))
	{
		_path = '/';
	}
	
	const result = document.cookie = (_name + '=' + _value + ';' + expires + ' Path=' + _path + ';' + secure);// _same_site + secure);
	setTimeout(() => document.emit('cookie', { method: 'set', name: _name, value, string: _value }));
	return result;
}});

//
const object = { _setCookie: document.setCookie,
	[DEFAULT_PROXY_PREFIX + 'removeCookie']: document.removeCookie,
	[DEFAULT_PROXY_PREFIX + 'getCookie']: document.getCookie,
	[DEFAULT_PROXY_PREFIX + 'hasCookie']: document.hasCookie,
	[DEFAULT_PROXY_PREFIX + 'hasNumericCookie']: document.hasNumericCookie,
	[DEFAULT_PROXY_PREFIX + 'hasBooleanCookie']: document.hasBooleanCookie,
	[DEFAULT_PROXY_PREFIX + 'clearCookies']: document.clearCookies,
	[DEFAULT_PROXY_PREFIX + 'getCookies']: document.getCookies,
	[DEFAULT_PROXY_PREFIX + 'listCookies']: document.listCookies };

document.cookies = window.cookies = new Proxy(object, cookieTraps);

//

