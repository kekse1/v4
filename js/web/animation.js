/*
* Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
* https://kekse.biz/ https://github.com/kekse1/v4/
*/

//
//TODO/ < https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats >
// < https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations >
// < https://developer.mozilla.org/en-US/docs/Web/API/Document/getAnimations >
//TODO/(b) 'functional styles' vervollstaendigen, v.a. mit 'css.js' (TODO: css.matrix.js!)!!!
//

//
const DEFAULT_PERSIST = true;//will end any (managed) animation with comitting the finish style state!
const DEFAULT_SMOOTH = true;//will start any (managed) animation with current style state!
const DEFAULT_INIT = true;//if element not already faded/toggled, it'll start this with suitable start styles!!
const DEFAULT_HARD_STOP = true;//after 'window.stop()/.stopped',set the styles w/o animation nevertheless, or do NOTHING at all!?
const DEFAULT_AXES = null;//see 'extractAxes()'!! 'xyz' seems not to work, btw. (scheint sich gegenseitig aufzuheben! x)~

//
const appendKeyframeStyle = (_style, _new = '') => {
	if(!_style) _style = _new; else if(_new && _style === 'none') _style = _new;
	else _style += ' ' + _new; return _style; };

//
Reflect.defineProperty(Animation, 'destroy', { value: (_func, ... _args) => { if(!String.isString(_func, false)) return error('Invalid % argument', null, '_func');
	const result = []; const real = [ ... document.realAnimations ]; for(var i = 0, j = 0; i < real.length; ++i) if(typeof real[i][_func] === 'function')
		result[j++] = real[i][_func](... _args); return result; }});
Reflect.defineProperty(Animation, 'stop', { value: (... _args) => Animation.destroy('stop', ... _args) });
Reflect.defineProperty(Animation, 'cancel', { value: (... _args) => Animation.destroy('cancel', ... _args) });
Reflect.defineProperty(Animation, 'finish', { value: (... _args) => Animation.destroy('finish', ... _args) });
Reflect.defineProperty(Animation, 'play', { value: (... _args) => Animation.destroy('play', ... _args) });
Reflect.defineProperty(Animation, 'pause', { value: (... _args) => Animation.destroy('pause', ... _args) });

//
Reflect.defineProperty(Animation, 'prepareKeyframes', { value: (_keyframes, _element, _options) => {
	if(Object._isObject(_keyframes)) return Animation.prepareKeyframes.object(_keyframes, _element, _options);
	else if(Array._isArray(_keyframes)) return Animation.prepareKeyframes.array(_keyframes, _element, _options);
	return error('Invalid % argument (no % nor %)', null, '_keyframes', 'Object', 'Array'); }});

Animation.prepareKeyframes.array = (_keyframes, _element, _options, _result) => {
	const computedStyle = getComputedStyle(_element);
	for(var i = 0; i < _keyframes.length; ++i) {
		if(Object._isObject(_keyframes[i])) for(const idx in _keyframes[i]) {
			if(_keyframes[i][idx] === null)
				_keyframes[i][idx] = computedStyle[idx]; }}
	return _keyframes; };

Animation.prepareKeyframes.object = (_keyframes, _element, _options, _result) => {
	const computedStyle = getComputedStyle(_element);
	for(const idx in _keyframes) {
		if(Array._isArray(_keyframes[idx])) for(var i = 0; i < _keyframes[idx].length; ++i) {
			if(_keyframes[idx][i] === null)
				_keyframes[idx][i] = computedStyle[idx]; }}
	return _keyframes; };

//
Reflect.defineProperty(Animation, 'validKeyframes', { value: (_keyframes) => {
	return (Object._isObject(_keyframes) || Array._isArray(_keyframes)); }});
Reflect.defineProperty(Animation, 'specialKeys', { get: () => { return [ 'offset', 'easing', 'composite' ]; }});
Reflect.defineProperty(Animation, 'getCSSStyleKey', { value: (_string) => {
	if(!String.isString(_string, false)) return null; else _string = camel.enable(_string);
	switch(_string) { case 'cssFloat': return 'float'; case 'cssOffset': return 'offset'; }
	if(! (_string in document.documentElement.style)) return null; return _string; }});
Reflect.defineProperty(Animation, 'getAnimationStyleKey', { value: (_string) => {
	if(!String.isString(_string, false)) return null; else _string = camel.enable(_string);
	switch(_string) { case 'float': case 'cssFloat': return 'cssFloat';
		case 'offset': case 'cssOffset': return 'cssOffset'; }
	if(! (_string in document.documentElement.style)) return null; return _string; }});
Reflect.defineProperty(Animation, 'manageKeyframes', { value: (_keyframes, _element, _options) => {
	const result = Object.create(null);
	if(Object._isObject(_keyframes)) Animation.manageKeyframes.object(_keyframes, _element, _options, result);
	else if(Array._isArray(_keyframes)) Animation.manageKeyframes.array(_keyframes, _element, _options, result);
	else return error('Invalid % argument (no % nor %)', null, '_keyframes', 'Object', 'Array');
	return result;
}});

//
Animation.manageKeyframes.array = (_keyframes, _element, _options, _result) => {
//
//TODO/< https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats#syntax >
//TODO/BEDENKE: 'animate()' ist momentan [eher] auf objekte eingestellt... EVTL. IMMER objekt-return?? //TODO/...
osd('TODO');
throw new Error('TODO: Animation.manageKeyframes.array()');
//
};

Animation.manageKeyframes.object = (_keyframes, _element, _options, _result) => {
	//
	if(!Object.isObject(_result)) _result = Object.create(null);
	if(!Object.isObject(_options)) _options = null;
	const computedStyle = (_element ? getComputedStyle(_element) : null);
	const specialKeys = new Set(Animation.specialKeys);
	const special = {};
	const keys = Object.keys(_keyframes);
	_keyframes = { ... _keyframes };

	for(var i = 0; i < keys.length; ++i)
		if(specialKeys.has(keys[i])) {
			special[keys[i]] = _keyframes[keys[i]];
			delete _keyframes[keys.splice(i--, 1)[0]]; }
	for(var i = 0; i < keys.length; ++i) {
		const cssKey = Animation.getCSSStyleKey(keys[i]);
		if(!cssKey) return error('Invalid keyframe key \'%\'', null, keys[i]);
		else if(!Array.isArray(_keyframes[keys[i]], true))
			_keyframes[keys[i]] = [ _keyframes[keys[i]] ];
		_result[cssKey] = { [Animation.getAnimationStyleKey(keys[i])]: _keyframes[keys[i]] }; }
	if(computedStyle) {
		for(const style in _result)
			for(const idx in _result[style])
				for(var i = 0; i < _result[style][idx].length; ++i)
					if(_result[style][idx][i] === null)
						_result[style][idx][i] = computedStyle[style];
		if(_options && _options.smooth) for(const style in _result)
			for(const idx in _result[style])
				if(computedStyle[style] !== _result[style][idx][0])
					_result[style][idx].unshift(computedStyle[style]);
	} for(const style in _result) for(const idx in _result[style])
		_result[style].targetValue = _result[style][idx][_result[style][idx].length - 1];
	for(const idx in _result) Object.assign(_result[idx], special);
	return _result;
};

//
const _animate = HTMLElement.prototype.animate;

//
document.realAnimations = [];
document.animations = 0;
document.animation = Object.create(null);

//
const callCallbacks = (_context, _options, _event, ... _args) => {
	var isError; switch(_event.type) {
		case 'cancel': case 'remove': case 'stop': case 'abort': isError = true; break;//'abort' is not clear..
		default: isError = false; break; } var callback = [], specific = [], error = []; const result = [];
	if(typeof _options.callback === 'function') callback.push(_options.callback);
	else if(Array.isArray(_options.callback, false)) callback.push(... _options.callback);
	if(isError) { if(typeof _options.error === 'function') error.push(_options.error);
		else if(Array.isArray(_options.error, false)) error.push(... _options.error); }
	if(typeof _options[_event.type] === 'function') specific = [ _options[_event.type] ];
	else if(Array.isArray(_options[_event.type], false)) specific = [ ... _options[_event.type] ];
	for(const cb of callback) { if(typeof _context === 'undefined') result.push(cb(_event, ... _args));
		else result.push(cb.call(_context, _event, ... _args)); }
	for(const cb of error) { if(typeof _context === 'undefined') result.push(cb(_event, ... _args));
		else result.push(cb.call(_context, _event, ... _args)); }
	for(const cb of specific) { if(typeof _context === 'undefined') result.push(cb(_event, ... _args));
		else result.push(cb.call(_context, _event, ... _args)); }
	return result; };

Reflect.defineProperty(HTMLElement.prototype, 'noAnimation', { get: function()
{
	if(window.stopped) return 1;
	if(!this.isConnected) return 2;
	if(!document.parseVariable('animate')) return 3;
	if(this.hasAttribute('noanim')) return 4;
	if(!this.parseVariable('animate')) return 5;
	if(this.parseVariable('speed') <= 0) return 6;
	if(document.parseVariable('global') <= 0) return 7;
	return 0; }});

// should be checked everywhere where an animation is being started (but not in 'animate')!
const continueAnimation = (_element, _options) => {
	if(!(_element && _element.isConnected)) return false;
	if(_element.hasAttribute('ignanim')) return false;
	if(DEFAULT_HARD_STOP && (!_options || !_options.force)) {
		if(window.stopped) return false;
		if(_element.locked) return false; }
	return true; };

Reflect.defineProperty(HTMLElement.prototype, 'animate', { value: function(_keyframes, _options, ... _args) {
	//
	const earlyFinish = (_return) => {
		callCallbacks(this, _options, { type: 'finish', early: true });
		return _return; };
	
	//
	if(!Object.isObject(_options)) {
		if(Number.isNumber(_options)) _options = { duration: _options };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else _options = {}; }

	//
	if(this.hasAttribute('ignanim')) return earlyFinish(false);
	else if(DEFAULT_HARD_STOP && !_options.force) {
		if(window.stopped) return earlyFinish(false);
		else if(this.locked) return earlyFinish(false); }

	//
	if(!Animation.validKeyframes(_keyframes)) return error('Invalid % argument (needs to be % or %)', null, '_keyframes', 'Object', 'Array');

	//
	if(!Number.isInt(this._animations)) this._animations = 0;
	if(!Object.isObject(this._animation)) this._animation = Object.create(null);
	if(typeof _options.force !== 'boolean') _options.force = this.parseVariable('force-animation');

	//
	var noAnimation = (this.isConnected ? (_options.force ? false : !!this.noAnimation) : true);
	
	//
	if(!noAnimation) {
		if(_options.duration === false) _options.duration = 0;
		else if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
		if(Number.isNumber(_options.duration)) { const global = document.parseVariable('global');
			var speed = (this.parseVariable('speed') * global); if(speed <= 0) speed = 0;
			if((_options.duration = Math.round(_options.duration / (speed === 0 ? 1 : speed))) < 1) _options.duration = 0;
		} else _options.duration = 0; if(_options.duration <= 0) { _options.duration = 0; noAnimation = true; }}

	if(_options.delay === false) _options.delay = 0;
	else if(!Number.isNumber(_options.delay)) _options.delay = this.parseVariable('delay');
	if(Number.isNumber(_options.delay)) {
		_options.delay = Math.round(_options.delay);
		if(_options.delay < 0) _options.delay = 0;
	} else _options.delay = 0;

	//
	const abortSignal = (Reflect.is(_options.signal, 'AbortSignal') ? _options.signal : null);

	//
	if(!noAnimation) {
		//
		if(!String.isString(_options.easing, false)) _options.easing = this.getVariable('easing');
		if(typeof _options.managed !== 'boolean' && _options.managed !== null) _options.managed = true;
		//
		if(!_options.managed) { _keyframes = Animation.prepareKeyframes(_keyframes, this, _options);
			const result = _animate.call(this, _keyframes, _options, ... _args);
			if(!result) return null; else if(_options.managed === null) return result;
			const onabort = (... _args) => { if(String.isString(abortSignal.reason, false) && typeof result[abortSignal.reason] === 'function')
				return result[abortSignal.reason](... _args); else if(String.isString(_options.abortMethod, false) &&
					typeof result[_options.abortMethod] === 'function') return result[_options.abortMethod](... _args);
				const method = this.parseVariable('abort-method'); if(String.isString(method, false) &&
					typeof result[method] === 'function') return result[method](... _args);
				return error('Invalid abort method'); };
			Reflect.defineProperty(result, 'keyframes', { get: () => { return _keyframes; }});
			Reflect.defineProperty(result, 'options', { get: () => { return _options; }});
			Reflect.defineProperty(result, 'element', { get: () => { return this; }});
			Reflect.defineProperty(result, 'style', { get: () => { return ''; }});
			Reflect.defineProperty(result, 'isStopped', { get: () => { return null; }});
			Reflect.defineProperty(result, 'manager', { value: () => { return null; }});
			const callback = (_event, ... _a) => { document.realAnimations.remove(result);
				result.removeEventListener('finish', callback);
				result.removeEventListener('cancel', callback);
				result.removeEventListener('remove', callback);
				if(abortSignal) abortSignal.removeEventListener('abort', onabort);
				Reflect.defineProperty(_event, 'animation', { value: result });
				callCallbacks(this, _options, _event, result, ... _a); };
			result.addEventListener('finish', callback, { passive: true });
			result.addEventListener('cancel', callback, { passive: true });
			result.addEventListener('remove', callback, { passive: true });
			document.realAnimations.push(result);
			if(abortSignal) abortSignal.addEventListener('abort', onabort, { once: true, passive: true });
			return result; }

		//
		/*if(typeof _options.scale !== 'boolean' && !Number.isNumber(_options.scale))
			_options.scale = this.parseVariable('scale');*/
		//".duration = round(.duration * last.currentTime / last.duration);".. ^_^
		//
		if(typeof _options.persist !== 'boolean') _options.persist = DEFAULT_PERSIST;
		if(typeof _options.smooth !== 'boolean') _options.smooth = DEFAULT_SMOOTH;

		//
		_options.method = Callback.checkMethod(_options.method, true, this);
		
		//
		if(!Number.isInt(this._animations)) this._animations = 0;
		if(!Object.isObject(this._animation)) this._animation = Object.create(null); }

	//
	const keyframes = Animation.manageKeyframes(_keyframes, this, _options);
	const styles = Object.keys(keyframes);
	
	for(const style of styles) { if(style === 'opacity') {
		if(this.vibration && typeof this.vibration.animation === 'number') {
			this.vibration.animation = null; }}}

	//
	if(! Object.isObject(_options.sourceValues)) { _options.sourceValues = Object.create(null);
		for(const style of styles) _options.sourceValues[style] = this.style[style]; }

	if(! Object.isObject(_options.targetValues)) { _options.targetValues = Object.create(null);
		for(const style of styles) _options.targetValues[style] = keyframes[style].targetValue; }
	for(const style of styles) delete keyframes[style].targetValue;

	//
	if(!noAnimation && !_options.force) {
		var all = true; const computedStyle = getComputedStyle(this);
		for(const style in keyframes) for(const idx in keyframes[style]) {
			for(var i = 0; i < keyframes[style][idx].length; ++i)
				if(keyframes[style][idx][i] !== _options.targetValues[style]) {
					all = false; break; }}
		if(all) noAnimation = true; }

	//
	if(_options.duration <= 0 || (noAnimation && !_options.force)) {
		const finish = () => {
			for(const style in _options.targetValues) {
				if(this.hasAnimation(style, true)) this.stopAnimation(style);
					this.style[style] = _options.targetValues[style]; }
			callCallbacks(this, _options, { type: 'finish', element: this, animation: null }, null); };
		if(_options.delay > 0) return setTimeout(finish, _options.delay);
		else finish(); return true; }

	//
	const removeAnimation = (_animation, _force = false) => { if(! _animation._registered && !_force) return;
		else _animation._registered = null; --globalAnimations; --this._animations;
		delete this._animation[_animation.style]; document.realAnimations.remove(_animation);
		if(globalAnimation[_animation.style]) { globalAnimation[_animation.style].remove(this);
			if(globalAnimation[_animation.style].length === 0) delete globalAnimation[_animation.style]; }};
	const addAnimation = (_animation, _force = false) => { if(_animation._registered !== false && !_force) return;
		else _animation._registered = true; ++globalAnimations; ++this._animations;
		document.realAnimations.push(_animation); if(!globalAnimation[_animation.style]) globalAnimation[_animation.style] = [ this ];
		else globalAnimation[_animation.style].push(this); this._animation[_animation.style] = _animation; };

	//
	const manager = new ManagedAnimation({ options: _options, element: this, keyframes, styles, relays: (_options.relays || 0) });
	const managers = {}, relays = {}, relayCallbacks = [], callbacks = { callback: [], error: [], relay: [], finish: [], cancel: [], remove: [], stop: [] };

	for(const style of styles) { const originalAnimation = this._animation[style]; if(originalAnimation) {
		managers[style] = originalAnimation.manager; _options.sourceValues[style] = originalAnimation.sourceValue; }}

	for(var mgr in managers) { mgr = managers[mgr]; for(const idx in mgr.animation) if(!styles.includes(idx)) {
		relays[idx] = mgr.animation[idx]; ++_options.relays; ++manager.relays }
		if(_options.method === 'add') { for(const idx in callbacks)
			callbacks[idx].pushUnique(... mgr.callbacks.get(this, idx)); } relayCallbacks.pushUnique(
				... mgr.callbacks.get(this, 'callback'), ... mgr.callbacks.get(this, 'relay'));
		mgr.destroy(false); }

	for(const cb of relayCallbacks) cb.call(this, { type: 'relay', manager, element: this, styles, relays: _options.relays });
	
	for(const style in relays) { removeAnimation(relays[style], true); relays[style].hardStop();
		++relays[style].relays; ++relays[style].manager.relays;
		Reflect.defineProperty(relays[style], 'manager', { value: manager });
		Reflect.defineProperty(relays[style], 'managedKeyframes', { get: () => { return keyframes; }});
		Reflect.defineProperty(relays[style], 'originalKeyframes', { get: () => { return _keyframes; }});
		Reflect.defineProperty(relays[style], 'keyframes', { get: () => { return keyframes[style] }});
		manager.add(relays[style]); styles.remove(style); relays[style].play(); addAnimation(relays[style], true); }

	//
	const newAnimation = (_style, _style_keyframes, _opts) => {
		//
		/*var duration = _opts.duration; if(_relays) { if(_opts.scale === true) duration *= _progress;
			else if(Number.isNumber(_opts.scale)) duration = Math.max(duration * _progress, _opts.scale); }
		_opts.duration = duration;*/ const result = _animate.call(this, _style_keyframes, _opts, ... _args);
		if(!Reflect.is(result, 'Animation')) return result; else result._isStopped = false; result.relays = 0;
		Reflect.defineProperty(result, 'manager', { value: manager });
		Reflect.defineProperty(result, 'options', { get: () => { return result.manager.options; }});
		Reflect.defineProperty(result, 'managedKeyframes', { get: () => { return keyframes; }});
		Reflect.defineProperty(result, 'originalKeyframes', { get: () => { return _keyframes; }});
		Reflect.defineProperty(result, 'keyframes', { get: () => { return _style_keyframes; }});
		Reflect.defineProperty(result, 'element', { get: () => { return this; }});
		Reflect.defineProperty(result, 'style', { get: () => { return _style; }});
		Reflect.defineProperty(result, 'isStopped', { get: () => { return !!result._isStopped; }});
		Reflect.defineProperty(result, 'sourceValue', { get: () => { return result.manager.options.sourceValues[_style]; }});
		Reflect.defineProperty(result, 'targetValue', { get: () => { return result.manager.options.targetValues[_style]; }});

		//
		const onabort = (... _args) => { if(String.isString(abortSignal.reason, false) && typeof result[abortSignal.reason] === 'function')
			return result[abortSignal.reason](... _args); else if(String.isString(_options.abortMethod, false) &&
				typeof result[_options.abortMethod] === 'function') return result[_options.abortMethod](... _args);
			const method = this.parseVariable('abort-method'); if(String.isString(method, false) &&
				typeof result[method] === 'function') return result[method](... _args);
			return error('Invalid abort method'); };

		//
		result._registered = false;
		result._addAnimation = () => addAnimation(result);
		result._removeAnimation = () => removeAnimation(result);
		//
		result._addAnimation();
		
		//
		result.clear = () => result.manager.clear();

		//		
		result.clean = (_cancel = false) => { result._removeAnimation();
			result.removeEventListener('finish', callback);
			result.removeEventListener('cancel', callback);
			result.removeEventListener('remove', callback);
			if(abortSignal) abortSignal.removeEventListener('abort', onabort);
			if(_cancel) result.cancel(); };

		result.finishState = (_type) => { switch(_type) {
				case 'finish': case 'remove': if(result.options.persist) this.style[_style] = result.targetValue; break;
				case 'cancel': this.style[_style] = result.sourceValue; break; }
			if(_type === 'finish') result._currentTime = result.duration;
			else delete result._currentTime; };

		result._callback = (_event, _animation, ... _a) => {
			if(result.manager) return result.manager.callback(_event, _animation, ... _a); };
		const callback = (_event, ... _a) => { result.clean(false); result.finishState(_event.type); if(!result._callback) return _event;
			Reflect.defineProperty(_event, 'style', { get: () => { return _style; }});
			Reflect.defineProperty(_event, 'animation', { get: () => { return result; }});
			Reflect.defineProperty(_event, 'element', { get: () => { return this; }});
			Reflect.defineProperty(_event, 'manager', { get: () => { return result.manager; }});
			Reflect.defineProperty(_event, 'options', { get: () => { return result.options; }});
			Reflect.defineProperty(_event, 'sourceValue', { get: () => { return result.sourceValue; }});
			Reflect.defineProperty(_event, 'targetValue', { get: () => { return result.targetValue; }});
			Reflect.defineProperty(_event, 'persist', { get: () => { return result.options.persist; }});
			Reflect.defineProperty(_event, 'relays', { get: () => { return result.manager.relays; }});
			return result._callback(_event, result, ... _a); };

		result.addEventListener('finish', callback, { passive: true });
		result.addEventListener('cancel', callback, { passive: true });
		result.addEventListener('remove', callback, { passive: true });
		
		//
		if(abortSignal) abortSignal.addEventListener('abort', onabort, { once: true, passive: true });
		
		//
		manager.add(result);
		return result;
	};
	
	//
	if(_options.method === 'add') for(const idx in callbacks)
		manager.callbacks.add(this, idx, callbacks[idx]);
	const cbs = Animation.callbacks; for(const cb of cbs)
		manager.callbacks.add(this, cb, _options[cb]);
	
	//
	for(const style of styles)
		newAnimation(style, keyframes[style], _options);
	
	//
	return manager;
}});

Reflect.defineProperty(Animation, 'callbacks', { get: () => [
	'callback', 'error', 'relay', 'finish', 'cancel', 'remove', 'stop'  ]});

HTMLElement.prototype.animate.__extended = true;

//
const ManagedAnimation = window.ManagedAnimation = Animation.ManagedAnimation = class ManagedAnimation// extends EventTarget
{
	constructor(_options)
	{
		this.animation = Object.create(null);
		this.isDestroyed = false;
		this.keyframes = null;
		this.options = null;
		this.element = null;
		this.manager = this;
		this.styles = null;
		this.relays = 0;
		this.original = [];
		this.callbacks = new Callback();
		this.relays = 0;

		if(Object.isObject(_options)) for(const idx in _options)
			if(!(idx in ManagedAnimation.prototype)) this[idx] = _options[idx];
	}

	get type()
	{
		return (this.options ? (this.options.type || '') : '');
	}
	
	forEach(_func)
	{
		if(typeof _func !== 'function') return error('Invalid % argument (no %)', null, '_func', 'Function');
		const keys = this.keys; const result = new Array(keys.length); for(var i = 0; i < keys.length; ++i)
			result[i] = _func(this.animation[keys[i]], keys[i], this.animation);
		return result;
	}

	destroy(... _args)
	{
		if(this.isDestroyed) return false; else this.isDestroyed = true; if(!_args[0])
			for(const idx in this.animation) this.animation[idx].clean(true);
		this.animation = Object.create(null); if(_args[0] !== null && _args[0] !== false)
			return this.call(... _args); if(_args[0] !== false)
				this.callbacks.clear(this.element); return false;
	}
	
	call(... _args)
	{
		this.callbacks.call(this.element, 'callback', ... _args);
		var isError; switch(_args[0].type) { case 'cancel': case 'remove': case 'stop': case 'abort': isError = true; break;
			default: isError = false; break; }
		if(isError) this.callbacks.call(this.element, 'error', ... _args);
		this.callbacks.call(this.element, _args[0].type, ... _args);
		this.clear();
	}
	
	clear(... _args)
	{
		return this.callbacks.clear(this.element, ... _args);
	}
	
	clearCallbacks(... _args)
	{
		return this.clear(... _args);
	}
	
	addCallback(... _args)
	{
		return this.callbacks.add(this.element, ... _args);
	}
	
	setCallback(... _args)
	{
		return this.callbacks.set(this.element, ... _args);
	}
	
	count(... _args)
	{
		return this.callbacks.count(this.element, ... _args);
	}
	
	getCallbacks(... _args)
	{
		return this.callbacks.get(this.element, ... _args);
	}

	//
	callback(_event, _animation, ... _args)
	{
		return this.remove(_animation.style, _event, _animation, ... _args);
	}
	
	get keys()
	{
		return Object.keys(this.animation);
	}
	
	get size()
	{
		return Object.keys(this.animation).length;
	}
	
	add(... _animations)
	{
		for(var i = 0; i < _animations.length; ++i) { if(!Reflect.is(_animations[i], 'Animation'))
				return error('Invalid %[%] (not an %)', null, '..._animations', i, 'Animation');
			else if(!String.isString(_animations[i].style, false)) return error('No %[%][%] (maybe unmanaged?)', null, '..._animations', i, 'style');
			else this.animation[_animations[i].style] = this.original[_animations[i].style] = _animations[i]; }
		return this.size;
	}

	remove(_param, ... _args)
	{
		if(Reflect.is(_param, 'Animation')) _param = _param.style; if(!String.isString(_param), false) return error('Invalid % argument', null, '_param');
		const animation = this.animation[_param]; delete this.animation[_param];
		if(this.size === 0 && _args.length > 0) this.destroy(... _args); return animation;
	}

	get(_style_animation)
	{
		if(typeof _style_animation === 'string') {
			if(this.animation[_style_animation]) return this.animation[_style_animation]; }
		else if(Reflect.is(_style_animation, 'Animation')) { for(const idx in this.animation)
			if(this.animation[idx] === _style_animation) return _style_animation; }
		else return error('Invalid % argument (no % nor %)', null, 'String', 'Animation');
		return null;
	}
	
	has(... _args)
	{
		if(_args.length === 0) return null; else for(var i = 0; i < _args.length; ++i)
			if(typeof _args[i] === 'string') { if(!this.animation[_args[i]]) return false; }
			else if(Reflect.is(_args[i], 'Animation')) { var has = false;
				for(const idx in this.animation) if(this.animation[idx] === _args[i]) { has = true; break; }
				if(!has) return false; }
		return true;
	}
	
	had(... _args)
	{
		if(_args.length === 0) return null; else for(var i = 0; i < _args.length; ++i)
			if(typeof _args[i] === 'string') { if(!this.original[_args[i]]) return false; }
			else if(Reflect.is(_args[i], 'Animation')) { var has = false;
				for(const idx in this.original) if(this.original[idx] === _args[i]) { has = true; break; }
				if(!has) return false; }
		return true;
	}

	finish(... _args)
	{
		const result = Object.create(null); for(const idx in this.animation)
			(result[this.animation[idx].style] = this.animation[idx]).finish(... _args);
		return result;
	}
	
	pause(... _args)
	{
		const result = Object.create(null); for(const idx in this.animation)
			(result[this.animation[idx].style] = this.animation[idx]).pause(... _args);
		return result;
	}
	
	cancel(... _args)
	{
		const result = Object.create(null); for(const idx in this.animation)
			(result[this.animation[idx].style] = this.animation[idx]).cancel(... _args);
		return result;
	}
	
	play(... _args)
	{
		const result = Object.create(null); for(const idx in this.animation)
			(result[this.animation[idx].style] = this.animation[idx]).play(... _args);
		return result;
	}
	
	stop(... _args)
	{
		const result = Object.create(null); for(const idx in this.animation)
			(result[this.animation[idx].style] = this.animation[idx]).stop(... _args);
		return result;
	}
	
	hardStop(... _args)
	{
		const result = Object.create(null); for(const idx in this.animation)
			(result[this.animation[idx].style] = this.animation[idx]).hardStop(... _args);
		return result;
	}
	
	get currentTime()
	{
		var size = 0; var result = 0; for(const idx in this.animation) {
			result += this.animation[idx].currentTime; ++size; }
		if(size === 0) return null; return (result / size);
	}

	get progress()
	{
		var size = 0; var result = 0; for(const idx in this.animation) {
			result += this.animation[idx].progress; ++size; }
		if(size === 0) return null; return (result / size);
	}

	get duration()
	{
		var size = 0; var result = 0; for(const idx in this.animation) {
			result += this.animation[idx].duration; ++size; }
		if(size === 0) return null; return (result / size);
	}
}

//
export default ManagedAnimation;

//
const _cancel = Animation.prototype.cancel;
const _finish = Animation.prototype.finish;
const _pause = Animation.prototype.pause;
const _play = Animation.prototype.play;

Reflect.defineProperty(Animation.prototype, 'stop', { value: function(... _args) {
	this._currentTime = this.currentTime; var computed = null; this.pause();
	if(this.managed) computed = getComputedStyle(this.element)[this.style];
	const originalCallback = this._callback; this._callback = (_event, ... _args) => {
		this._isStopped = true; Reflect.defineProperty(_event, 'type', { get: () => { return 'stop'; }});
		if(computed !== null) this.element.style[this.style] = computed;
		else try { this.commitStyles(); } catch(_error) { return null; }
		if(originalCallback) (this._callback = originalCallback).call(this, _event, ... _args); };
	return _cancel.apply(this, _args);
}});

Reflect.defineProperty(Animation.prototype, 'hardStop', { value: function(... _args) {
	this._callback = this.clean; const result = this.stop(... _args);
	if(this.manager) this.manager.remove(this.style); return result; }});

Reflect.defineProperty(Animation.prototype, 'cancel', { value: function(... _args) {
	this.pause(); this._isStopped = false; this._currentTime = this.currentTime; return _cancel.apply(this, _args);
}});

Reflect.defineProperty(Animation.prototype, 'finish', { value: function(... _args) {
	delete this._currentTime; this._isStopped = false; return _finish.apply(this, _args);
}});

Reflect.defineProperty(Animation.prototype, 'pause', { value: function(... _args) {
	this._currentTime = this.currentTime; this._isStopped = false; return _pause.apply(this, _args);
}});

Reflect.defineProperty(Animation.prototype, 'play', { value: function(... _args) {
	delete this._currentTime; this._isStopped = false; return _play.apply(this, _args);
}});

Reflect.defineProperty(Animation.prototype, 'isIdle', { get: function() { return (this.playState === 'idle'); }});
Reflect.defineProperty(Animation.prototype, 'isRunning', { get: function() { return (this.playState === 'running'); }});
Reflect.defineProperty(Animation.prototype, 'isPaused', { get: function() { return (this.playState === 'paused'); }});
Reflect.defineProperty(Animation.prototype, 'isFinished', { get: function() { return (this.playState === 'finished'); }});
Reflect.defineProperty(Animation.prototype, 'isStopped', { get: function() { return !!this._isStopped; }});
Reflect.defineProperty(Animation.prototype, 'callbacks', { get: function() { if(!this.manager) return null; return this.manager.callbacks; }});

//
const _currentTime = Reflect.getOwnPropertyDescriptor(Animation.prototype, 'currentTime');
Reflect.defineProperty(Animation.prototype, 'currentTime', {
	get: function() {
		if(Number.isNumber(this._currentTime)) return this._currentTime;
		var result = _currentTime.get.call(this);
		if(!Number.isNumber(result)) result = (this.playState === 'finished' ? this.duration : 0);
		return Math.min(result, this.duration);
	}, set: function(_value) {
		delete this._currentTime; return _currentTime.set.call(this, _value);
	}});
Reflect.defineProperty(Animation.prototype, 'progress', { get: function()
{ return (this.playState === 'finished' ? 1 : Math.min(1, this.currentTime / this.duration)); }});
Reflect.defineProperty(Animation.prototype, 'duration', { get: function()
{ return this.options.duration; }});
Reflect.defineProperty(Animation.prototype, 'delay', { get: function()
{ return this.options.delay; }});
Reflect.defineProperty(Animation.prototype, 'managed', { get: function()
{ return !!this.manager; }});
Reflect.defineProperty(Animation.prototype, 'animations', { get: function()
{ return (this.manager ? this.manager.animation : null); }});

//
var globalAnimations = 0;
var globalAnimation = Object.create(null);

Reflect.defineProperty(document, 'animation', { get: () => { return globalAnimation; }});
Reflect.defineProperty(document, 'animations', { get: () => { return globalAnimations; }});
Reflect.defineProperty(HTMLElement.prototype, 'animations', { get: function() {
	return (this._animations = (Number.isInt(this._animations) ? this._animations : 0)); }});
Reflect.defineProperty(HTMLElement.prototype, 'animation', { get: function() {
	return (this._animation = (Object.isObject(this._animation) ? this._animation : Object.create(null))); }});

//
Reflect.defineProperty(HTMLElement.prototype, 'fade', { value: function(_type, _options, ... _args)
{
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!String.isString(_type, false)) return error('Invalid % argument [ %, %, % ]', null, '_type', 'show', 'hide');
	else switch(_type) {
		case 'show': case 'hide': break;
		default: return error('Invalid % argument [ %, %, % ]', null, '_type', 'show', 'hide'); }
	if(!Object.isObject(_options)) {
		if(Number.isNumber(_options)) _options = { duration: _options };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else _options = {}; }
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('--duration-' + _type);
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('--duration');
	if(typeof _options.init !== 'boolean') _options.init = DEFAULT_INIT;
	if(typeof _options.type !== 'string') _options.type = _type;
	//_options.method = 'set';//better... even required here..!!
	_options.method = Callback.checkMethod(_options.method, true, this);
	_options.smooth = false;//is done in here!
	_options.relays = (_options.relays || 0);
	_options.persist = true;
	
	//
	if(this._fade)
	{
		this._fade.pause();
		++_options.relays;

		if(typeof _options.scale !== 'boolean' && !Number.isNumber(_options.scale))
			_options.scale = this.parseVariable('scale');

		if(_options.scale || _options.scale === 0 && Number.isNumber(this._fade.currentTime))
		{
			_options.duration = (_options.duration * this._fade.currentTime / this._fade.options.duration);
			
			if(typeof _options.scale === 'number')
			{
				_options.duration = Math.max(_options.duration, _options.scale);
			}

			_options.duration = Math.round(_options.duration);
		}
	}
	else
	{
		_options.relays = 0;
	}
	
	if(_options.init && typeof this.state !== 'boolean') switch(_type) {
		case 'show':
			if(!this.style.opacity) this.style.opacity = '0';
			if(!this.style.transform) this.style.transform = 'scale(0)';
			if(!this.style.filter) this.style.filter = 'blur(9px)';
			break;
		case 'hide':
			if(!this.style.opacity) this.style.opacity = '1';
			if(!this.style.transform) this.style.transform = 'scale(1)';
			if(!this.style.filter) this.style.filter = 'blur(0)';
			break; }
	//
	_options.styles = [ 'opacity', 'filter', 'transform' ];  const computedStyle = getComputedStyle(this);
	const keyframes = {}; if(_options.styles.includes('opacity')) {
			//var min
			//var max
		switch(_type) {
			case 'show':
				keyframes.opacity = [ computedStyle.opacity, '0.3', '1' ];
				if(_options.relays > 0) keyframes.opacity.splice(1, 1);
				break;
			case 'hide':
keyframes.opacity = [ computedStyle.opacity, '0.6', '0' ];
				if(_options.relays > 0) keyframes.opacity.splice(1, 1);
				break; }}
	if(_options.styles.includes('filter')) {
			var min = ((_options.min && ('filter' in _options.min)) ? _options.min.filter : '0'); if(typeof min === 'number') min = min.toString() + (min === 0 ? '' : 'px');
			var max = ((_options.max && ('filter' in _options.max)) ? _options.max.filter : '8px'); if(typeof max === 'number') max = max.toString() + (max === 0 ? '' : 'px');
		switch(_type) {
			case 'show':
				keyframes.filter = [ computedStyle.filter, 'blur(' + max + ')', 'blur(2px)', 'blur(' + min + ')' ];
				if(_options.relays > 0) keyframes.filter.splice(1, 1);
				break;
			case 'hide':
				keyframes.filter = [ computedStyle.filter, 'blur(' + min + ')', 'blur(2px)', 'blur(' + max + ')' ];
				if(_options.relays > 0) keyframes.filter.splice(1, 1);
				break; }}
	if(_options.styles.includes('transform')) {
			var min = ((_options.min && ('scale' in _options.min)) ? _options.min.scale : '0'); if(typeof min === 'number') min = min.toString();
			var max = ((_options.max && ('scale' in _options.max)) ? _options.max.scale : '1.2'); if(typeof max === 'number') max = max.toString();
		switch(_type) {
			case 'show':
				keyframes.transform = [ computedStyle.transform, 'scale(' + min + ')', 'scale(' + max + ')', 'scale(1)' ];
				if(_options.relays > 0) keyframes.transform.splice(1, 1);
				break;
			case 'hide':
				keyframes.transform = [ computedStyle.transform, 'scale(1)', 'scale(' + max + ')', 'scale(' + min + ')' ];
				if(_options.relays > 0) keyframes.transform.splice(1, 1);
				break; }}
	//
	switch(_type) {	case 'show': this.state = true; break;
			case 'hide': this.state = false; break; }
	//
	_options.type = _type; if(this._fade) this._fade.finish();
	if(typeof _options.callback === 'function') _options.callback = [ _options.callback ]; else if(!Array._isArray(_options.callback)) _options.callback = [];
	_options.callback.unshift(() => { delete this._fade; delete this['_' + _type]; delete this._blink; });
	const result = this.animate(keyframes, _options, ... _args); if(Reflect.is(result, 'ManagedAnimation')) {
		this._fade = this['_' + _type] = result; } return result;
}});

//
Reflect.defineProperty(HTMLElement.prototype, 'show', { value: function(_options, ... _args)
{ return this.fade('show', _options, ... _args); }});
Reflect.defineProperty(HTMLElement.prototype, 'hide', { value: function(_options, ... _args)
{ return this.fade('hide', _options, ... _args); }});

//since some classes override {fade,show,..} etc. .. for the .blink() to work again! ^_^
const _fade = HTMLElement.prototype.fade;
const _show = HTMLElement.prototype.show;
const _hide = HTMLElement.prototype.hide;

//
const blinkCallbacks = new Callback();
//
//FINALLY.. in it's best form ever. TODO is the same for '.toggle()' and '.blink()' (both below)!!!
//
Reflect.defineProperty(HTMLElement.prototype, 'blink', { value: function(_options, ... _args)
{
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!Object.isObject(_options)) { if(Number.isNumber(_options)) _options = { duration: Math.round(_options) };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else _options = {}; } if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration-blink');
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
	_options.duration = Math.round(_options.duration / 2); _options.method = Callback.checkMethod(_options.method, true, this);

	blinkCallbacks[_options.method](this, 'half', _options.half); delete _options.half;
	const cbs = Animation.callbacks; for(const cb of cbs)
	{
		blinkCallbacks[_options.method](this, cb, _options[cb]);
		delete _options[cb];
	}

	var halfReached = false;

	_options.callback = (_e, ... _a) => {
		this._blink = _a[0];

		if(_e.type !== 'finish')
		{
			blinkCallbacks.call(this, _e.type, _e, ... _a);
		}

		if(halfReached)
		{
			if(_e.type === 'finish')
			{
				blinkCallbacks.call(this, _e.type, _e, ... _a);
			}

			blinkCallbacks.clear(this);
			delete this._blink;
		}
		else if(_e.type === 'finish')
		{
			delete _options.type; delete _options.sourceValues; delete _options.targetValues;
			halfReached = true;
			Reflect.defineProperty(_e, 'type', { value: 'half' });
			blinkCallbacks.call(this, 'half', _e, ... _a);
			this._blink = this.show(_options, ... _args);
		}
		else if(_e.type !== 'relay')
		{
			blinkCallbacks.call(this, _e.type, _e, ... _a);
			blinkCallbacks.clear(this);
			delete this._blink;
		}
	};

	return this._blink = this.hide(_options, ... _args);
}});

//
//TODO/same as above @ '.blink()'!! and remove their implementation below!
//
/*const pulseCallbacks = new Callback();

Reflect.defineProperty(HTMLElement.prototype, 'pulse', { value: function(_options, ... _args)
{
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!Object.isObject(_options)) { if(Number.isNumber(_options)) _options = { duration: Math.round(_options) };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else _options = {}; } if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration-blink');
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
	_options.duration = Math.round(_options.duration / 2); _options.method = Callback.checkMethod(_options.method, true, this);

}});

//
const toggleCallbacks = new Callback();

Reflect.defineProperty(HTMLElement.prototype, 'toggle', { value: function(_options, ... _args)
{
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!Object.isObject(_options)) { if(Number.isNumber(_options)) _options = { duration: Math.round(_options) };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else _options = {}; } if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration-blink');
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
	_options.duration = Math.round(_options.duration / 2); _options.method = Callback.checkMethod(_options.method, true, this);

}});
 */

//
const pulseCallbacks = new Callback();

Reflect.defineProperty(HTMLElement.prototype, 'pulse', { value: function(_options, ... _args)
{
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!Object.isObject(_options)) { if(Number.isNumber(_options)) _options = { duration: Math.round(_options) };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else _options = {}; } if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration-pulse');
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
	_options.duration = Math.round(_options.duration / 2); _options.method = Callback.checkMethod(_options.method, true, this);
	if(typeof _options.persist !== 'boolean') _options.persist = DEFAULT_PERSIST;
	if(String.isString(_options.colorization, false)) switch(_options.colorization = _options.colorization.toLowerCase()) { case 'contrast': case 'complement':
	break; default: return error('Invalid [%] option [ `contrast`, `complement` ]'); } else _options.colorization = this.parseVariable('pulse-colorization');
	pulseCallbacks[_options.method](this, 'half', _options.half); pulseCallbacks[_options.method](this, 'callback', _options.callback);
	pulseCallbacks[_options.method](this, 'finish', _options.finish); delete _options.finish; delete _options.half; delete _options.callback;
	if(!this._pulseOptions) { const computed = getComputedStyle(this);
	if(!(color.isValid(computed.backgroundColor) && color.isValid(computed.color))) return error('Invalid color(s)');
	this._pulseOptions = { color: computed.color, backgroundColor: computed.backgroundColor, wallpaper: this.gradientAnimation,
		original: { color: this.style.color, backgroundColor: this.style.backgroundColor }}; }
	if(this._pulseOptions.wallpaper) this._pulseOptions.wallpaper.pause();
	const pulseIn = () => { const keyframes = { color: [ this.style.color, color[_options.colorization](this._pulseOptions.color) ],
		backgroundColor: [ this.style.backgroundColor, color[_options.colorization](this._pulseOptions.backgroundColor) ] };
		_options.finish = (_e, ... _a) => { delete _options.sourceValues; Reflect.defineProperty(_e, 'type', { value: 'half' });
		pulseCallbacks.call(this, 'half', _e, ... _a); delete _options.targetValues; pulseCallbacks.call(this, 'callback', _e, ... _a);
		return this._pulse = pulseOut(); }; return this._pulse = this.animate(keyframes, _options, ... _args); };
	const pulseOut = () => { if(!this._pulseOptions) { delete this._pulse; return; } const keyframes = { color: this._pulseOptions.color,
		backgroundColor: this._pulseOptions.backgroundColor }; _options.finish = (... _a) => { pulseCallbacks.call(this, 'finish', ... _a);
			pulseCallbacks.call(this, 'callback', ... _a); };
		_options.callback = (... _a) => { if(!_options.persist && this._pulseOptions) for(const idx in this._pulseOptions.original)
			this.style[idx] = this._pulseOptions.original[idx]; if(this._pulseOptions && this._pulseOptions.wallpaper)
				this._pulseOptions.wallpaper.resume();
			delete this._pulse; delete this._pulseOptions;
			if(_a[0].type !== 'finish') { pulseCallbacks.call(this, 'callback', ... _a); }};
		return this._pulse = this.animate(keyframes, _options, ... _args); };
	if(this._pulse) return; return this._pulse = pulseIn();
}});

//
const toggleCallbacks = new Callback();

Reflect.defineProperty(HTMLElement.prototype, 'toggle', { value: function(_options, ... _args)
{
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!Object.isObject(_options)) { if(Number.isNumber(_options)) _options = { duration: Math.round(_options) };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else _options = {}; } if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration-toggle');
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
	_options.duration = Math.round(_options.duration / 2); _options.method = Callback.checkMethod(_options.method, true, this);
	if(typeof _options.init !== 'boolean') _options.init = DEFAULT_INIT; if(typeof _options.scale !== 'boolean') _options.scale = true;
	if('filter' in _options) { _options.blur = _options.filter; delete _options.filter; } _options.rotate = extractAxes(_options.rotate);
	if(typeof _options.blur !== 'boolean') _options.blur = true; if(typeof _options.persist !== 'boolean') _options.persist = DEFAULT_PERSIST;
	toggleCallbacks[_options.method](this, 'half', _options.half); toggleCallbacks[_options.method](this, 'callback', _options.callback);
	toggleCallbacks[_options.method](this, 'finish', _options.finish); delete _options.finish; delete _options.half; delete _options.callback;
	if(_options.init && !this._toggleOptions) { this.style.opacity = '1'; var transform; if(_options.scale) transform = appendKeyframeStyle(transform, 'scale(1)');
		for(const axis of _options.rotate) transform = appendKeyframeStyle(transform, 'rotate' + axis.toUpperCase() + '(0)');
		if(transform) this.style.transform = transform; if(_options.blur) this.style.filter = 'blur(0)'; }
	if(!this._toggleOptions) { this._toggleOptions = { source: {} }; this._toggleOptions.source.opacity = this.style.opacity;
		if(_options.scale || _options.rotate.length > 0) this._toggleOptions.source.transform = this.style.transform; if(_options.blur) this._toggleOptions.source.filter = this.style.filter; }
	const toggleIn = () => { const keyframes = { opacity: '0.4' }; var transform; if(_options.scale) transform = appendKeyframeStyle(transform, 'scale(0.4)');
		for(const axis of _options.rotate) transform = appendKeyframeStyle(transform, 'rotate' + axis.toUpperCase() + '(180deg)'); if(transform) keyframes.transform = transform;
		if(_options.blur) keyframes.filter = 'blur(3px)'; _options.finish = (_e, ... _a) => { delete _options.sourceValues;
			Reflect.defineProperty(_e, 'type', { value: 'half' }); toggleCallbacks.call(this, 'half', _e, ... _a);
			delete _options.targetValues; toggleCallbacks.call(this, 'callback', _e, ... _a); return this._toggle = toggleOut(); };
		_options.callback = (_e, ... _a) => { if(_e.type !== 'finish') { delete this._toggle; }};
		return this._toggle = this.animate(keyframes, _options, ... _args); };
	const toggleOut = () => { const keyframes = { opacity: '1' }; var transform; if(_options.scale) transform = appendKeyframeStyle(transform, 'scale(1)');
		for(const axis of _options.rotate) transform = appendKeyframeStyle(transform, 'rotate' + axis.toUpperCase() + '(359deg)');
		if(transform) keyframes.transform = transform; if(_options.blur) keyframes.filter = 'blur(0)'; _options.finish = (... _a) => {
			toggleCallbacks.call(this, 'finish', ... _a); }; _options.callback = (... _a) => {
				if(this._toggleOptions?.source && !_options.persist) for(const idx in this._toggleOptions.source)
					this.style[idx] = this._toggleOptions.source[idx]; else { this.style.transform = 'none';
						this.style.filter = 'none'; this.style.opacity = '1'; }
							delete this._toggle; delete this._toggleOptions;
		toggleCallbacks.call(this, 'callback', ... _a); };
	return this._toggle = this.animate(keyframes, _options, ... _args); }; return this._toggle = toggleIn();
}});

const extractAxes = (_value, _fallback = DEFAULT_AXES) => {
	if(_value === null) return (Math.random.bool() ? 'x' : 'y');
	if(typeof _value === 'boolean') { if(_value) return extractAxes(DEFAULT_AXES); return result; }
	else if(typeof _value === 'string') { if(_value.length === 0) return result; var value; for(var i = 0; i < _value.length; ++i)
		switch(value = _value[i].toLowerCase()) { case 'x': case 'y': case 'z': result.pushUnique(value); break; }}
	else if(Array.isArray(_value, true)) { for(var i = _value.length - 1; i >= 0; --i) { if(typeof _value[i] !== 'string')
		_value.splice(i, 1); else result.pushUnique(... extractAxes(_value[i])); }}
	else if(_fallback !== null && typeof _fallback !== 'string' && !Array.isArray(_fallback, true)) throw new Error('Invalid [%] option!', null, 'axes');
	else return extractAxes(_fallback, null); return result.sort();
};

//
Reflect.defineProperty(HTMLElement.prototype, 'hasAnimation', { value: function(... _args)
{
	const origArgs = _args.length; var ONE = true; var CAMEL = true; var arg;
	for(var i = 0; i < _args.length; ++i) if(arg = Animation.getCSSStyleKey(_args[i]))
		_args[i] = arg; else { if(typeof _args[i] === 'undefined') CAMEL = false;
			else if(typeof _args[i] === 'boolean') ONE = _args[i];
			_args.splice(i--, 1); } if(_args.length > 0) _args = _args.unique();
				else if(origArgs > 0) return null;
	const hasAnimObj = !!this._animation; var nonCamel;
	if(hasAnimObj && _args.length === 0) _args = Object.keys(this._animation);
	const result = Object.create(null); for(var i = 0; i < _args.length; ++i) {
		if(! (_args[i] in this.style)) continue;
		else if(CAMEL) nonCamel = camel.disable(_args[i]); else nonCamel = _args[i];
		if(!hasAnimObj) result[_args[i]] = result[nonCamel] = false;
		else result[_args[i]] = result[nonCamel] = (_args[i] in this._animation);
	} if(ONE && _args.length === 1 && origArgs === 1) return result[_args[0]]; return result;
}});

Reflect.defineProperty(HTMLElement.prototype, 'getAnimation', { value: function(... _args)
{
	var ONE = true; var CAMEL = true; var arg; for(var i = 0; i < _args.length; ++i)
		if(arg = Animation.getCSSStyleKey(_args[i])) _args[i] = arg; else {
			if(typeof _args[i] === 'undefined') CAMEL = false;
			else if(typeof _args[i] === 'boolean') ONE = _args[i];
			_args.splice(i--, 1); }
	const result = this.hasAnimation(... _args, undefined, false); var nonCamel;
	for(const idx in result) { if(CAMEL) nonCamel = camel.disable(idx); else nonCamel = idx;
		if(!result[idx]) result[idx] = result[nonCamel] = null;
		else result[idx] = result[nonCamel] = this._animation[idx];
	} if(ONE && _args.length === 1) return result[_args[0]]; return result;
}});

Reflect.defineProperty(HTMLElement.prototype, 'getAnimations', { value: function(... _args)
{	const origArgs = _args.length;
	const result = []; if(! this._animation) return result; for(var i = 0; i < _args.length; ++i)
		if(! (_args[i] = Animation.getCSSStyleKey(_args[i]))) _args.splice(i--, 1);
	if(_args.length === 0) { if(origArgs === 0) _args = Object.keys(this._animation);
		else return []; } else _args = _args.unique(); for(const idx of _args)
			result.push(this._animation[idx] || null); return result;
}});

Reflect.defineProperty(HTMLElement.prototype, 'controlAnimation', { value: function(_func, ... _args)
{
	if(!String.isString(_func, false)) return error('Invalid % argument', null, '_func');
	else switch(_func = _func.toLowerCase()) {
		case 'stop': case 'cancel': case 'finish': case 'play': case 'pause': break;
		default: return error('Invalid % argument (%)', null, '_func', _func); }
	if(!this._animation) return 0; const result = this.getAnimations(... _args);
	for(var i = 0; i < result.length; ++i) if(result[i] !== null) result[i][_func]();
	return result;
}});

Reflect.defineProperty(HTMLElement.prototype, 'stopAnimation', { value: function(... _args)
{ return this.controlAnimation('stop', ... _args); }});

Reflect.defineProperty(HTMLElement.prototype, 'cancelAnimation', { value: function(... _args)
{ return this.controlAnimation('cancel', ... _args); }});

Reflect.defineProperty(HTMLElement.prototype, 'finishAnimation', { value: function(... _args)
{ return this.controlAnimation('finish', ... _args); }});

Reflect.defineProperty(HTMLElement.prototype, 'playAnimation', { value: function(... _args)
{ return this.controlAnimation('play', ... _args); }});

Reflect.defineProperty(HTMLElement.prototype, 'pauseAnimation', { value: function(... _args)
{ return this.controlAnimation('pause', ... _args); }});
//
Reflect.defineProperty(document, 'getAnimation', { value: (... _args) => {
	var CAMEL = true; var arg; for(var i = 0; i < _args.length; ++i)
		if(arg = Animation.getCSSStyleKey(_args[i])) _args[i] = arg;
		else { if(typeof _args[i] === 'undefined') CAMEL = false; _args.splice(i--, 1); }
	if(_args.length > 0) _args = _args.unique(); else _args = Object.keys(globalAnimation); var nonCamel;
	const result = Object.create(null); for(var i = 0; i < _args.length; ++i) { if(CAMEL) nonCamel = camel.disable(_args[i]);
		else nonCamel = _args[i]; if(!globalAnimation[_args[i]]) result[_args[i]] = result[nonCamel] = [];
		else result[_args[i]] = result[nonCamel] = [ ... globalAnimation[_args[i]] ];
	} return result;
}});

Reflect.defineProperty(document, 'getAnimations', { value: (... _args) => {
	const result = []; var arg; for(var i = 0; i < _args.length; ++i)
		if(arg = Animation.getCSSStyleKey(_args[i])) _args[i] = arg;
		else _args.splice(i--, 1);
	if(_args.length === 0) _args = Object.keys(globalAnimation); else _args = _args.unique();
	for(const idx of _args) if(globalAnimation[idx]) result.push(... globalAnimation[idx]);
	return result;
}});

Reflect.defineProperty(document, 'hasAnimation', { value: (... _args) => {
	var ONE = true; var arg; for(var i = 0; i < _args.length; ++i) if(arg = Animation.getCSSStyleKey(_args[i]))
		_args[i] = arg; else { if(typeof _args[i] === 'boolean') ONE = _args[i]; _args.splice(i--, 1); }
	const result = document.getAnimation(... _args, false);
	for(const idx in result) result[idx] = result[idx].length;
	if(ONE && _args.length === 1) return result[_args[0]]; return result;
}});

Reflect.defineProperty(document, 'controlAnimation', { value: (_func, ... _args) => {
	if(!String.isString(_func, false)) return error('Invalid % argument', null, '_func');
	else switch(_func = _func.toLowerCase()) {
		case 'stop': case 'cancel': case 'finish': case 'play': break;
		default: return error('Invalid % argument (%)', null, '_func', _func); }
	const result = document.getAnimations(... _args); for(var i = 0; i < result.length; ++i)
		result[i][_func](); return result;
}});

Reflect.defineProperty(document, 'stopAnimation', { value: (... _args) => {
	return document.controlAnimation('stop', ... _args); }});
Reflect.defineProperty(document, 'cancelAnimation', { value: (... _args) => {
	return document.controlAnimation('cancel', ... _args); }});
Reflect.defineProperty(document, 'finishAnimation', { value: (... _args) => {
	return document.controlAnimation('finish', ... _args); }});
Reflect.defineProperty(document, 'playAnimation', { value: (... _args) => {
	return document.controlAnimation('play', ... _args); }});
Reflect.defineProperty(document, 'pauseAnimation', { value: (... _args) => {
	return document.controlAnimation('pause', ... _args); }});

//
Reflect.defineProperty(HTMLElement.prototype, 'vibrate', { value: function(_enabled, _speed, _interval, _dots, _default_inner_html, _opacity, _dot)
{
	if(!Number.isNumber(_speed) || _speed <= 0)
	{
		if(this.vibration) _speed = this.vibration.speed;
		else _speed = this.parseVariable('vibration-speed');
	}
	
	if(!Number.isNumber(_interval) || _interval <= 0)
	{
		if(this.vibration) _interval = this.vibration.interval;
		else _interval = this.parseVariable('vibration-interval');
	}
	
	if(!String.isString(_dot))
	{
		if(this.vibration) _dot = this.vibration.dot;
		else _dot = this.parseVariable('vibration-dot');
	}

	if(!Number.isInt(_dots) || _dots < 0)
	{
		if(this.vibration) _dots = this.vibration.dots;
		else _dots = countDots(this.textContent, _dot);
	}
	
	if(Number.isNumber(_opacity))
	{
		_opacity %= 1;
	}
	else
	{
		if(this.vibration) _opacity = this.vibration.opacity;
		else _opacity = (this.parseVariable('vibration-opacity') % 1);
	}
	
	if(!this.vibration)
	{
		this.vibration = Object.null({ animation: null, last: null, dotCount: null, innerHTML: null, backupInnerHTML: null, psin: null, lastInnerHTML: null,
			speed: _speed, dots: _dots, interval: _interval, opacity: _opacity, dot: _dot });
		this.vibration.seconds = this.vibration.current = this.vibration.counter = 0;
	}
	else
	{
		this.vibration.speed = _speed;
		this.vibration.dots = _dots;
		this.vibration.dot = _dot;
		this.vibration.interval = _interval;
		this.vibration.opacity = _opacity;
	}
	
	if(typeof _enabled !== 'boolean')
	{
		if(typeof this.vibration.animation === 'number')
		{
			_enabled = false;
		}
		else if(this.vibration.animation === true)
		{
			_enabled = true;
		}
		else
		{
			_enabled = !this.vibration.animation;
		}
	}

	const endAnimation = () => {
		//
		if(typeof this.vibration.animation === 'number')
		{
			cancelAnimationFrame(this.vibration.animation);
		}
		else if(this.vibration.animation === false) return;
		else this.vibration.animation = false;
		
		//
		if(typeof this.vibration.backupInnerHTML === 'string')
		{
			if(this.innerHTML === this.vibration.lastInnerHTML)
			{
				this.innerHTML = this.vibration.backupInnerHTML;
			}
		}

		//
		this.style.opacity = '1';
		this.vibration = null;
	};

	if(_enabled)
	{
		if(this.hasAnimation('opacity'))
		{
			this.cancelAnimation('opacity');
		}
	
		this.vibration.last = Date.now();
		this.vibration.backupInnerHTML = this.innerHTML;
		
		if(typeof _default_inner_html === 'string')
		{
			this.vibration.innerHTML = this.innerHTML = _default_inner_html;
		}
		else
		{
			this.vibration.innerHTML = this.innerHTML = removeDots(this.innerHTML, _dot);
		}
		
		this.vibration.lastInnerHTML = this.innerHTML;
		
		//
		const animationFrame = () => {
			//
			if(this.vibration.animation === false)
			{
				return endAnimation();
			}
			else if(this.innerHTML !== this.vibration.lastInnerHTML)
			{
				return endAnimation();
			}
			
			//
			const now = Date.now();
			const origSeconds = this.vibration.seconds;
			this.vibration.seconds += ((now - this.vibration.last) / 1000);
			this.vibration.last = now;
			
			var newSecond;
			this.vibration.counter += (this.vibration.seconds - origSeconds);
			
			if(this.vibration.counter >= this.vibration.interval)
			{
				newSecond = true;
				this.vibration.counter %= this.vibration.interval;
			}
			else
			{
				newSecond = false;
			}
			
			//
			this.vibration.psin = Math.psin(this.vibration.seconds * this.vibration.speed);
			this.style.opacity = Math.scale(this.vibration.psin, 1, this.vibration.opacity);
			
			//
			if(newSecond)
			{
				if(this.vibration.dots > 0)
				{
					if(++this.vibration.dotCount > this.vibration.dots)
					{
						this.vibration.dotCount = 0;
					}
				
					this.innerHTML = this.vibration.innerHTML + ' ' + String.repeat(this.vibration.dotCount, this.vibration.dot);
					this.vibration.lastInnerHTML = this.innerHTML;
				}
				else
				{
					this.vibration.dotCount = 0;
					this.innerHTML = this.vibration.innerHTML;
				}
			}
			
			//
			if(this.vibration.animation !== false)
			{
				this.vibration.animation = requestAnimationFrame(animationFrame);
			}
		};
		
		//
		this.vibration.animation = requestAnimationFrame(animationFrame);
		return true;
	}
	else
	{
		if(typeof this.vibration.animation === 'number')
		{
			cancelAnimationFrame(this.vibration.animation);
		}
		
		endAnimation();
		return true;
	}

	return false;
}});

Reflect.defineProperty(HTMLElement.prototype, 'vibrating', {
	get: function()
	{
		return !!(this.vibration && this.vibration.animation);
	},
	set: function(_value)
	{
		if(typeof _value !== 'boolean')
		{
			return this.vibrating;
		}

		return this.vibrate(_value);
	}
});

const countDots = (_text_content, _dot) => { if((_text_content = _text_content.trim()).length === 0) return 0;
	var result = 0, byte; for(var i = _text_content.length - 1; i >= 0; --i) {
		if((byte = _text_content.charCodeAt(i)) <= 32 || byte === 127) continue;
		else if(_text_content[i] === _dot) ++result; else break; } return result; };
const removeDots = (_inner_html, _dot) => { if((_inner_html = _inner_html.trim()).length === 0) return '';
	var result = '', ended = false, byte; for(var i = _inner_html.length - 1; i >= 0; --i) {
		if(!ended) { if((byte = _inner_html.charCodeAt(i)) > 32 && byte !== 127 && _inner_html[i] !== _dot) ended = true;
			else if(_inner_html[i] === _dot) continue; }
		result = _inner_html[i] + result; };
	return result; };

//
const GradientAnimation = Animation.GradientAnimation = HTMLElement.GradientAnimation = class GradientAnimation
{
	constructor(... _args)
	{
		this._element = null;
		this.reset(false);
		
		for(var i = 0; i < _args.length; ++i)
		{
			if(String.isString(_args[i], false))
			{
				this.background = _args.splice(i--, 1)[0];
			}
			else if(Number.isNumber(_args[i]) && _args[i] > 0)
			{
				this.speed = _args.splice(i--, 1)[0];
			}
			else if(Reflect.was(_args[i], 'HTMLElement'))
			{
				this._element = _args.splice(i--, 1)[0];
			}
		}
		
		if(!this.element)
		{
			return error('No valid `HTMLElement` specified.');
		}

		if(!String.isString(this.background, false))
		{
			this.background = this.element.getVariable('wallpaper-background');
		}
		
		if(!Number.isNumber(this.speed) || this.speed <= 0)
		{
			this.speed = this.element.parseVariable('wallpaper-speed');
		}
	}
	
	get element()
	{
		return (this._element || null);
	}
	
	reset(_get = true)
	{
		if(typeof this.animation === 'number')
		{
			cancelAnimationFrame(this.animation);
		}
		
		this.animation = null;
		
		if(_get)
		{
			this.background = this.element.getVariable('wallpaper-background');
			this.speed = this.element.parseVariable('wallpaper-speed');
		}
		
		this._pause = false;
		this._originalBackground = null;
		this.degrees = this.time = this.psin = 0;
		this._last = this._lastStyle = null;
	}
	
	get isRunning()
	{
		return (typeof this.animation === 'number' && !this._pause);
	}
	
	start()
	{
		if(typeof this.animation === 'number')
		{
			return false;
		}
		else if(this._pause)
		{
			return this.resume();
		}
		else
		{
			this._last = Date.now();
			this._originalBackground = this.element.style.background;
			this.element.style.background = this.getBackgroundStyle(this.time = this.degrees = 0);
			this._lastBackground = this.element.style.background;
		}
		
		this.animation = requestAnimationFrame(GradientAnimation.prototype.animationFrame.bind(this));
		return true;
	}

	destroy(_callback, _elem = true)
	{
		//
		if(this._originalBackground !== null)
		{
			this.element.style.background = this._originalBackground;
		}

		//
		this.reset();
		
		//
		if(_elem)
		{
			this.element.gradientAnimation = null;
		}
		
		//
		if(typeof _callback === 'function')
		{
			_callback(this);
		}
	}
		
	stop(_callback, _elem = true)
	{
		if(this._originalBackground !== null)
		{
			this.style.background = this._originalBackground;
			this._originalBackground = null;
		}

		if(typeof this.animation !== 'number')
		{
			if(typeof _callback === 'number')
			{
				_callback(this);
			}
			
			return false;
		}
		else
		{
			cancelAnimationFrame(this.animation);
		}

		this._pause = false;
		this.destroy();
		
		return true;
	}
	
	pause()
	{
		if(typeof this.animation === 'number')
		{
			if(!this._background) this._background = this.element.style.background;
			this.element.style.background = this._originalBackground;
			cancelAnimationFrame(this.animation);
			return this._pause = true;
		}
		
		return false;
	}
	
	get isPaused()
	{
		return (typeof this.animation === 'number' && !!this._pause);
	}
	
	resume()
	{
		if(!this._pause) return false;
		if(this._background) this.element.style.background = this._background;
		delete this._background;
		this.animation = requestAnimationFrame(GradientAnimation.prototype.animationFrame.bind(this));
		return !(this._pause = false);
	}
	
	animationFrame()
	{
		//
		if(typeof this.animation !== 'number')
		{
			if(this.animation !== null) this.destroy();
			return;
		}
		else if(this._lastBackground !== this.element.style.background)
		{
			return this.destroy();
		}
		else if(this._pause)
		{
			return;
		}
		
		//
		const now = Date.now();
		this.time += (now - this._last);
		this._last = now;

		//
		this.element.style.background = GradientAnimation.getBackgroundStyle(this.degrees = Math.scale(this.psin = Math.psin(this.time / 1000 * this.speed), 360, 0), this.background);
		this._lastBackground = this.element.style.background;
		
		//
		if(typeof this.animation === 'number')
		{
			this.animation = requestAnimationFrame(GradientAnimation.prototype.animationFrame.bind(this));
		}
	}
	
	getBackgroundStyle(_degrees = this.degrees, _background = this.background)
	{
		return GradientAnimation.getBackgroundStyle(_degrees, _background);
	}
	
	static getBackgroundStyle(_degrees, _background)
	{
		if(!String.isString(_background, false))
		{
			return error('Invalid % argument (not a %)', null, '_background', 'String');
		}
		
		if(!Number.isNumber(_degrees))
		{
			_degrees = 0;
		}
		else if((_degrees %= 360) < 0)
		{
			_degrees = (360 + _degrees);
		}

		return `linear-gradient(${_degrees}deg, ${_background})`;
	}
}

Reflect.defineProperty(HTMLElement.prototype, 'wallpaperAnimation', { value: function(_enabled, _speed, _background)
{
	if(!this.gradientAnimation)
	{
		if(_enabled === false)
		{
			return false;
		}

		this.gradientAnimation = new GradientAnimation(this, _speed, _background);
	}
	
	if(typeof _enabled !== 'boolean')
	{
		_enabled = !this.gradientAnimation.isRunning;
	}
	
	if(_enabled)
	{
		if(this.gradientAnimation.isRunning)
		{
			return false;
		}
		else if(this.gradientAnimation.isPaused)
		{
			this.gradientAnimation.resume();
		}
		else
		{
			this.gradientAnimation.start();
		}
	}
	else
	{
		this.gradientAnimation.destroy(() => this.gradientAnimation = null);
	}
	
	return true;
}});

Reflect.defineProperty(HTMLElement.prototype, 'wallpaper', {
	get: function()
	{
		return !!(this.gradientAnimation && this.gradientAnimation.isRunning);
	},
	set: function(_value)
	{
		if(typeof _value !== 'boolean')
		{
			return this.wallpaper;
		}
		
		return this.wallpaperAnimation(_value);
	}
});

//

