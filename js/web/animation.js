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
const DEFAULT_WARN = false;//sure, eh?! ;-)
const DEFAULT_PERSIST = true;//will end any (managed) animation with comitting the finish style state!
const DEFAULT_SMOOTH = true;//will start any (managed) animation with current style state!
const DEFAULT_INIT = true;//if element not already faded/toggled, it'll start this with suitable start styles!!
const DEFAULT_HARD_STOP = true;//after 'window.stop()/.stopped',set the styles w/o animation nevertheless, or do NOTHING at all!?
const DEFAULT_OSD = 1200;
const DEFAULT_VIBRATE_CHANGEABLE = true;//if content of elem is changed, vibration will stop if(false); ..
const DEFAULT_VIBRATE_DOTS = 8;

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
osd('TODO', null, 'todo');
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
	recheckKeyFrames(_result, _element);
	return _result;
};

const recheckKeyFrames = (_keyframes, _element = null) => {
	if(Array.isArray(_keyframes))
	{
		return recheckKeyFrames.array(_keyframes, _element, null);
	}
	
	if(Object.isObject(_keyframes))
	{
		return recheckKeyFrames.object(_keyframes, _element, null);
	}
	
	if(_throw)
	{
		return error('Invalid _keyframes argument');
	}
	
	return false;
};

recheckKeyFrames.array = (_keyframes, _element = null, _throw = DEFAULT_THROW) => {
	throw new Error('TODO');
	return null;
};

recheckKeyFrames.object = (_keyframes, _element = null, _throw = DEFAULT_THROW) => {
	for(const idx in _keyframes)
	{
		if(!Object.isObject(_keyframes[idx]))
		{
			if(_throw)
			{
				return error('Invalid _keyframes[' + idx + ']');
			}
			
			return false;
		}
		
		if(!Array.isArray(_keyframes[idx][idx], true))
		{
			if(_throw)
			{
				return error('Invalid _keyframes[' + idx + ']');
			}
			
			return false;
		}
		
		for(var i = 0; i < _keyframes[idx][idx].length; ++i)
		{
			if(!String.isString(_keyframes[idx][idx][i], false))
			{
				if(_element)
				{
					const orig = _keyframes[idx][idx][i];
					const curr = _keyframes[idx][idx][i] = _element.styles[idx];
					
					if(DEFAULT_WARN)
					{
						console.group('Animation KeyFrames re-check');
						console.warn('Changed non-allowed keyframe[' + idx + '][' + i + ']' +
							' value to the element\'s current styling');
						console.dir({ old: orig, new: curr });
						console.warn('This is only shown ONCE (in a session).. JFYI.');
						console.groupEnd();
					}
				}
				else if(_throw)
				{
					return error('Invalid _keyframes[' + idx + '][' + i + ']');
				}
				else if(_throw === null)
				{
					console.warn('Removed keyframe[' + idx + '][' + i + ']');
					//console.dir({ ['idx']: Reflect.clone(_keyframes[idx][idx]) });
					_keyframes[idx][idx].splice(i--, 1);
				}
				else
				{
					return false;
				}
			}
		}
	}
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
	if(typeof _options.callback === 'function') callback.pushUnique(_options.callback);
	else if(Array.isArray(_options.callback, false)) callback.pushUnique(... _options.callback);
	if(isError) { if(typeof _options.error === 'function') error.pushUnique(_options.error);
		else if(Array.isArray(_options.error, false)) error.pushUnique(... _options.error); }
	if(typeof _options[_event.type] === 'function') specific = [ _options[_event.type] ];
	else if(Array.isArray(_options[_event.type], false)) specific = [ ... _options[_event.type].unique() ];
	for(const cb of callback) { if(typeof _context === 'undefined') result.pushUnique(cb(_event, ... _args));
		else result.pushUnique(cb.call(_context, _event, ... _args)); }
	for(const cb of error) { if(typeof _context === 'undefined') result.pushUnique(cb(_event, ... _args));
		else result.pushUnique(cb.call(_context, _event, ... _args)); }
	for(const cb of specific) { if(typeof _context === 'undefined') result.pushUnique(cb(_event, ... _args));
		else result.pushUnique(cb.call(_context, _event, ... _args)); }
	return result; };

Reflect.defineProperty(HTMLElement.prototype, 'noAnimation', { get: function()
{
	if(window.stopped) return 1;
	if(!this.isConnected) return 2;
	if(!document.parseVariable('animate')) return 3;
	if(this.parseAttribute('noanim')) return 4;
	if(this.parseAttribute('ignanim')) return 5;
	if(!this.parseVariable('animate')) return 6;
	if(this.parseVariable('speed') <= 0) return 7;
	if(document.parseVariable('global') <= 0) return 8;
	return 0; }});

// should be checked everywhere where an animation is being started (but not in 'animate')!
const continueAnimation = (_element, _options) => {
	if(!(_element && _element.isConnected)) return false;
	if(_element.parseAttribute('ignanim')) return false;
	if(DEFAULT_HARD_STOP && (!_options || !_options.force)) {
		if(window.stopped) return false;
		if(_element.locked) return false; }
	return true; };

const isImmutable = (_element, _options) => {
	if(_element.parseAttribute('immutable'))
	{
		return true;
	}
	
	if(_options.immutable)
	{
		return true;
	}
	
	return false;
};

//
Reflect.defineProperty(HTMLElement.prototype, '_animate', { value: _animate });
Reflect.defineProperty(HTMLElement.prototype, 'animate', { value: function(_keyframes, _options, ... _args) {
	//
	if(typeof document.documentElement.parseVariable !== 'function' ||
		typeof this.parseVariable !== 'function')
	{
		return undefined;
	}

	//
	const earlyFinish = (_return) => {
		callCallbacks(this, _options, { type: 'finish', early: true });
		return _return; };

	//
	if(!Object.isObject(_options)) {
		if(Number.isNumber(_options)) _options = { duration: _options };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else if(typeof _options === 'function') _options = { callback: _options };
		else if(Array.isArray(_options, false)) _options  = { callback: _options.unique() };
		else _options = {}; }

	//
	//if(this.parseAttribute('ignanim')) return earlyFinish(false);
	if(this.parseAttribute('ignanim')) return false;
	
	if(DEFAULT_HARD_STOP && !_options.force) {
		if(window.stopped) return earlyFinish(false);
		else if(this.locked) return earlyFinish(false); }

	//
	if(!Animation.validKeyframes(_keyframes))
		return error('Invalid % argument (needs to be % or %)', null, '_keyframes', 'Object', 'Array');

	//
	if(!Number.isInt(this._animations)) this._animations = 0;
	if(!Object.isObject(this._animation)) this._animation = Object.create(null);
	if(typeof _options.force !== 'boolean') _options.force = this.parseVariable('force-animation');

	//
	var noAnimation = (_options.force ? false : !!this.noAnimation);
	
	//
	var global = document.parseVariable('global'); if(global < 0) global = 0;
	var speed = this.parseVariable('speed'); if(speed < 0) speed = 0;
	var factor = (global * speed);
	
	//
	if(factor <= 0)
	{
		_options.duration = 0;
		_options.delay = 0;
	}
	else if(this.hasVariable('force'))
	{
		_options.duration = this.parseVariable('force');
	}
	else
	{
		if(_options.duration === false) _options.duration = 0;
		else if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
	}

	if(Number.isNumber(_options.duration) && _options.duration > 0)
	{
		_options.duration /= factor;
	}
	else if(_options.duration < 0)
	{
		_options.duration = 0;
	}

	if(!_options.delay) _options.delay = 0;
	else if(!Number.isNumber(_options.delay))
	{
		options.delay = this.parseVariable('delay');
	}
	
	if(Number.isNumber(_options.delay) && _options.delay > 0)
	{
		_options.delay /= factor;
	}
	else
	{
		_options.delay = 0;
	}

	//
	if(noAnimation || _options.duration <= 0)
	{
		_options.duration = 0;
		_options.delay = 0;
	}
	
	//
	var abortSignal;
	
	if(_options.immutable = isImmutable(this, _options))
	{
		abortSignal = null;
	}
	else if(Reflect.is(_options.signal, 'AbortSignal'))
	{
		abortSignal = _options.signal;
	}
	else
	{
		abortSignal = null;
	}

	//
	if(!String.isString(_options.easing, false)) _options.easing = this.getVariable('easing');
	if(typeof _options.managed !== 'boolean' && _options.managed !== null) _options.managed = true;

	//
	if(!_options.managed) { _keyframes = Animation.prepareKeyframes(_keyframes, this, _options);
		const result = _animate.call(this, _keyframes, _options, ... _args);
		if(!result) return null; else if(_options.managed === null) return result;
		result.options = _options; const onabort = (... _args) => { if(String.isString(abortSignal.reason, false) && typeof result[abortSignal.reason] === 'function')
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
		Reflect.defineProperty(result, 'immutable', { get: () => { return _options.immutable; }});
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
		if(abortSignal) abortSignal.addEventListener(
			'abort', onabort, { once: true, passive: true });
		return result; }

	//
	/*if(typeof _options.scale !== 'boolean' && !Number.isNumber(_options.scale))
		_options.scale = this.parseVariable('scale');*/
	//".duration = round(.duration * last.currentTime / last.duration);".. ^_^
	//
	if(typeof _options.persist !== 'boolean') _options.persist = DEFAULT_PERSIST;
	if(typeof _options.smooth !== 'boolean') _options.smooth = DEFAULT_SMOOTH;

	//.. false was true. checkmethod() erweitert..
	_options.method = Callback.checkMethod(_options.method, false, this);

	//
	if(!Number.isInt(this._animations)) this._animations = 0;
	if(!Object.isObject(this._animation)) this._animation = Object.create(null);

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
	if(noAnimation && !_options.force) {
		const finish = () => {
			for(const style in _options.targetValues) {
				if(this.hasAnimation(style, true)) this.stopAnimation(style);
					this.style[style] = _options.targetValues[style]; }
			callCallbacks(this, _options, { type: 'finish', element: this, animation: null }, null); };
		if(_options.delay > 0) return setTimeout(finish, -_options.delay);
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
		_opts.duration = duration;*/  const result = _animate.call(this, _style_keyframes, _opts, ... _args);
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
		Reflect.defineProperty(result, 'immutable', { get: () => { return result.manager.options.immutable; }});

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
			Reflect.defineProperty(_event, 'immutable', { get: () => { return result.manager.immutable; }});
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
	{
		newAnimation(style, keyframes[style], _options);
	}
	
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
		_options = Object.assign(_options);
		
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

		for(const idx in _options)
		{
			if(!(idx in ManagedAnimation.prototype))
			{
				this[idx] = _options[idx];
			}
		}
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
		const result = Object.create(null); for(const idx in this.animation) {
			if(this.animation[idx].immutable && !hasForceArgument(_args)) result[idx] = false;
			else (result[this.animation[idx].style] = this.animation[idx]).cancel(... _args); }
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
		const result = Object.create(null); for(const idx in this.animation) {
			if(this.animation[idx].immutable && !hasForceArgument(_args)) result[idx] = false;
			else (result[this.animation[idx].style] = this.animation[idx]).stop(... _args); }
		return result;
	}
	
	hardStop(... _args)
	{
		const result = Object.create(null); for(const idx in this.animation) {
			if(this.animation[idx].immutable && !hasForceArgument(_args)) result[idx] = false;
			else (result[this.animation[idx].style] = this.animation[idx]).hardStop(... _args); }
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

const hasForceArgument = (_args) => {
	var result = false;
	
	for(var i = 0; i < _args.length; ++i)
	{
		if(typeof _args[i] === 'boolean')
		{
			result = _args[i];
		}
	}
	
	return result;
};

//
export default ManagedAnimation;

//
const _cancel = Animation.prototype.cancel;
const _finish = Animation.prototype.finish;
const _pause = Animation.prototype.pause;
const _play = Animation.prototype.play;

Reflect.defineProperty(Animation.prototype, 'stop', { value: function(... _args) {
	if(this.immutable && !hasForceArgument(_args)) return false;
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
	if(this.immutable && !hasForceArgument(_args)) return false;
	try { this._callback = this.clean; const result = this.stop(... _args);
	if(this.manager) this.manager.remove(this.style); return result; }
	catch(_err) {} }});

Reflect.defineProperty(Animation.prototype, 'cancel', { value: function(... _args) {
	if(this.immutable && !hasForceArgument(_args)) return false;
	this.pause(); this._isStopped = false; this._currentTime = this.currentTime;
	try { return _cancel.apply(this, _args); } catch(_err) {}
}});

Reflect.defineProperty(Animation.prototype, 'finish', { value: function(... _args) {
	delete this._currentTime; this._isStopped = false; try { return _finish.apply(this, _args); } catch(_err) {}
}});

Reflect.defineProperty(Animation.prototype, 'pause', { value: function(... _args) {
	this._currentTime = this.currentTime; this._isStopped = false; try { return _pause.apply(this, _args); } catch(_err) {}
}});

Reflect.defineProperty(Animation.prototype, 'play', { value: function(... _args) {
	delete this._currentTime; this._isStopped = false; try { return _play.apply(this, _args); } catch(_err) {}
}});

Reflect.defineProperty(Animation.prototype, 'isIdle', { get: function() { return (this.playState === 'idle'); }});
Reflect.defineProperty(Animation.prototype, 'isPlaying', { get: function() { return (this.playState === 'running'); }});
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
{ return this.options?.duration; }});
Reflect.defineProperty(Animation.prototype, 'delay', { get: function()
{ return this.options?.delay; }});
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
function fade(_type, _options, ... _args)
{
	if(this.parseAttribute('ignanim')) return false;
	if(!Object.isObject(_options)) {
		if(Number.isNumber(_options)) _options = { duration: _options };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else if(typeof _options === 'function') _options = { callback: _options };
		else if(Array.isArray(_options, false)) _options = { callback: _options.unique() };
		else _options = {}; }
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!String.isString(_type, false)) return error('Invalid % argument [ %, %, % ]', null, '_type', 'show', 'hide');
	else switch(_type) {
		case 'show': case 'hide': break;
		default: return error('Invalid % argument [ %, %, % ]', null, '_type', 'show', 'hide'); }
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
				keyframes.opacity = [ computedStyle.opacity, '0.5', '1' ];
				if(_options.relays > 0) keyframes.opacity.splice(1, 1);
				break;
			case 'hide':
				keyframes.opacity = [ computedStyle.opacity, '0.5', '0' ];
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
	_options.type = _type; //if(this._fade) this._fade.finish();
	if(typeof _options.callback === 'function') _options.callback = [ _options.callback ];
	else if(Array.isArray(_options.callback, false)) _options.callback = [ ... _options.callback.unique() ];
	else _options.callback = []; _options.callback.unshift(() => { delete this._fade; delete this['_' + _type]; });
	const result = this.animate(keyframes, _options, ... _args);
	if(Reflect.is(result, 'ManagedAnimation')) { this._fade = this['_' + _type] = result; }
	return result;
}

//
Reflect.defineProperty(HTMLElement.prototype, 'show', { value: function(_options, ... _args)
{ return fade.call(this, 'show', _options, ... _args); }});
Reflect.defineProperty(HTMLElement.prototype, 'hide', { value: function(_options, ... _args)
{ return fade.call(this, 'hide', _options, ... _args); }});

//since some classes override {fade,show,..} etc. .. for the .blink() to work again! ^_^
const _fade = HTMLElement.prototype.fade;
const _show = HTMLElement.prototype.show;
const _hide = HTMLElement.prototype.hide;

//
//TODO/finish this; then remove the toggle stuff below it!
//
/*Reflect.defineProperty(HTMLElement.prototype, 'toggle', { value: function(_options, ... _args)
{
	if(!Object.isObject(_options)) {
		if(Number.isNumber(_options)) _options = { duration: _options };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else if(typeof _options === 'function') _options = { callback: _options };
		else if(Array.isArray(_options, false)) _options = { callback: _options.unique() };
		else _options = {}; }
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('--duration');
	_options.method = Callback.checkMethod(_options.method, true, this);
	_options.persist = false;
	_options.relays = (_options.relays || 0);
	
	//
	if(this._toggle)
	{
		this._toggle.pause();
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
	
	const keyframes = {};
	_options.type = 'toggle'; //if(this._toggle) this._toggle.finish();
	if(typeof _options.callback === 'function') _options.callback = [ _options.callback ];
	else if(Array.isArray(_options.callback, false)) _options.callback = [ ... _options.callback.unique() ];
	else _options.callback = []; _options.callback.unshift(() => delete this._toggle);
	const result = this.animate(keyframes, _options, ... _args);
	if(Reflect.is(result, 'ManagedAnimation')) this._toggle = result;
	return result;
}});*/

//
//TODO/finish the start above..!
//
const toggleCallbacks = new Callback();

Reflect.defineProperty(HTMLElement.prototype, 'toggle', { value: function(_options, ... _args)
{
	if(this.parseAttribute('ignanim')) return false;
	if(!Object.isObject(_options)) { if(Number.isNumber(_options)) _options = { duration: Math.round(_options) };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else if(typeof _options === 'function') _options = { callback: _options };
		else if(Array.isArray(_options, false)) _options = { callback: _options.unique() };
		else _options = {}; }
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration-toggle');
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
	const origDuration = _options.duration = Math.round(_options.duration / 1/*2*/); _options.method = Callback.checkMethod(_options.method, true, this);
	if(typeof _options.init !== 'boolean') _options.init = DEFAULT_INIT; if(typeof _options.scale !== 'boolean') _options.scale = true;
	if('filter' in _options) { _options.blur = _options.filter; delete _options.filter; }
	if(!('rotate' in _options)) _options.rotate = this.parseVariable('toggle-axes');  _options.rotate = extractAxes(_options.rotate);
	if(typeof _options.blur !== 'boolean') _options.blur = true; if(typeof _options.persist !== 'boolean') _options.persist = DEFAULT_PERSIST;
	toggleCallbacks[_options.method](this, 'half', _options.half); toggleCallbacks[_options.method](this, 'callback', _options.callback);
	toggleCallbacks[_options.method](this, 'finish', _options.finish); delete _options.finish; delete _options.half; delete _options.callback;
	if(_options.init && !this._toggleOptions) { this.style.opacity = '1'; var transform; if(_options.scale) transform = appendKeyframeStyle(transform, 'scale(1)');
		for(const axis of _options.rotate) transform = appendKeyframeStyle(transform, 'rotate' + axis.toUpperCase() + '(0)');
		if(transform) this.style.transform = transform; if(_options.blur) this.style.filter = 'blur(0)'; }
	if(!this._toggleOptions) { this._toggleOptions = { source: {} }; this._toggleOptions.source.opacity = this.styles.opacity;
		if(_options.scale || _options.rotate.length > 0) this._toggleOptions.source.transform = this.style.transform; if(_options.blur) this._toggleOptions.source.filter = this.style.filter; }
	const toggleIn = () => { const keyframes = { opacity: '0' }; var transform; if(_options.scale) transform = appendKeyframeStyle(transform, 'scale(0.4)');
		for(const axis of _options.rotate) transform = appendKeyframeStyle(transform, 'rotate' + axis.toUpperCase() + '(180deg)'); if(transform) keyframes.transform = transform;
		if(_options.blur) keyframes.filter = 'blur(3px)'; _options.finish = (_e, ... _a) => { delete _options.sourceValues;
			Reflect.defineProperty(_e, 'type', { value: 'half' }); toggleCallbacks.call(this, 'half', _e, ... _a);
			delete _options.targetValues; toggleCallbacks.call(this, 'callback', _e, ... _a); return this._toggle = toggleOut(); };
		_options.callback = (_e, ... _a) => { _options.duration = origDuration; if(_e.type !== 'finish') { delete this._toggle; }};
		_options.duration = Math._round(_options.duration / 2); return this._toggle = this.animate(keyframes, _options, ... _args); };
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

const extractAxes = global.axes = (_value) => {
	var result;
	
	if(String.isString(_value, false))
	{
		result = _value;
	}
	else if(Array.isArray(_value, false))
	{
		result = _value.getRandom(1);
	}
	else
	{
		result = null;
	}

	if(String.isString(result))
	{
		result = result.split('');
	}

	return result;
};

//
const blinkCallbacks = new Callback();

Reflect.defineProperty(HTMLElement.prototype, 'blink', { value: function(_options, ... _args)
{
	if(this.parseAttribute('ignanim')) return false;
	if(!Object.isObject(_options)) { if(Number.isNumber(_options)) _options = { duration: Math.round(_options) };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else if(typeof _options === 'function') _options = { callback: _options };
		else if(Array.isArray(_options, false)) _options = { callback: _options.unique() };
		else _options = {}; }
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration-blink');
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
	_options.duration = Math.round(_options.duration / 2); _options.method = Callback.checkMethod(_options.method, true, this);

	blinkCallbacks[_options.method](this, 'half', _options.half); delete _options.half;
	const cbs = Animation.callbacks; for(const cb of cbs)
	{
		blinkCallbacks[_options.method](this, cb, _options[cb]);
		delete _options[cb];
	}

	var halfReached = false;
	var result;

	_options.callback = (_e, ... _a) => {
		this._blink = _a[0];

		if(halfReached)
		{
			blinkCallbacks.call(this, 'callback', _e, ... _a);
			blinkCallbacks.call(this, _e.type, _e, ... _a);
			blinkCallbacks.clear(this);
			delete this._blink;
		}
		else
		{
			if(_e.type === 'finish')
			{
				delete _options.type; delete _options.sourceValues; delete _options.targetValues;
				halfReached = true;
				Reflect.defineProperty(_e, 'type', { value: 'half' });
				blinkCallbacks.call(this, 'half', _e, ... _a);
				const res = this.show(_options, ... _args);
				if(Reflect.is(result, 'ManagedAnimation'))
					this._blink = res;
				else
				{
					//TODO/blinkCallbacks.{call,clear}(...
					delete this._blink;
				}
			}
			else
			{
				blinkCallbacks.call(this, 'callback', _e, ... _a);
				blinkCallbacks.call(this, _e.type, _e, ... _a);
				
				if(_e.type !== 'relay')
				{
					blinkCallbacks.clear(this);
					delete this._blink;
				}
			}
		}
	};

	result = this.hide(_options, ... _args);
	if(Reflect.is(result, 'ManagedAnimation')) this._blink = result;
	//TODO/else blinkCallbacks.{call,clear}...
	return result;
}});

//
//TODO/same as above @ '.blink()'!! and remove their implementation below!
//
/*const pulseCallbacks = new Callback();

Reflect.defineProperty(HTMLElement.prototype, 'pulse', { value: function(_options, ... _args)
{
	if(!Object.isObject(_options)) { if(Number.isNumber(_options)) _options = { duration: Math.round(_options) };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else if(typeof _options === 'function') _options = { callback: _options };
		else if(Array.isArray(_options, false)) _options = { callback: _options.unique() };
		else _options = {}; }
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration-blink');
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
	_options.duration = Math.round(_options.duration / 2); _options.method = Callback.checkMethod(_options.method, true, this);

}});*/

//
const pulseCallbacks = new Callback();

Reflect.defineProperty(HTMLElement.prototype, 'pulse', { value: function(_options, ... _args)
{
	if(this.parseAttribute('ignanim')) return false;
	if(!Object.isObject(_options)) { if(Number.isNumber(_options)) _options = { duration: Math.round(_options) };
		else if(typeof _options === 'boolean') _options = { duration: _options };
		else if(typeof _options === 'function') _options = { callback: _options };
		else if(Array.isArray(_options, false)) _options = { callback: _options };
		else _options = {}; }
	const earlyFinish = (_return) => { callCallbacks(this, _options, { type: 'finish' }); return _return; };
	if(!continueAnimation(this, _options)) return earlyFinish(undefined);
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration-pulse');
	if(!Number.isNumber(_options.duration)) _options.duration = this.parseVariable('duration');
	_options.duration = Math.round(_options.duration / 2); _options.method = Callback.checkMethod(_options.method, true, this);
	if(typeof _options.persist !== 'boolean') _options.persist = DEFAULT_PERSIST; var opacity, withColor = true, withBackgroundColor = true;
	if(typeof _options.opacity === 'boolean') { if(_options.opacity) opacity = '0'; else opacity = null; }
	else if(String.isString(_options.opacity, false)) opacity = _options.opacity; else opacity = null;
	if(_options.color === false) withColor = false; if(_options.backgroundColor === false) withBackgroundColor = false;
	if(String.isString(_options.colorization, false)) switch(_options.colorization = _options.colorization.toLowerCase()) { case 'contrast': case 'complement':
	break; default: return error('Invalid [%] option [ `contrast`, `complement` ]'); } else _options.colorization = this.parseVariable('pulse-colorization');
	pulseCallbacks[_options.method](this, 'half', _options.half); pulseCallbacks[_options.method](this, 'callback', _options.callback);
	pulseCallbacks[_options.method](this, 'finish', _options.finish); delete _options.finish; delete _options.half; delete _options.callback;
	if(!this._pulseOptions) { const computed = getComputedStyle(this);
	if(!(color.isValid(computed.backgroundColor) && color.isValid(computed.color))) return error('Invalid color(s)');
	this._pulseOptions = { color: computed.color, backgroundColor: computed.backgroundColor, wallpaper: this.gradientAnimation,
		opacity: computed.opacity, original: { color: this.style.color, backgroundColor: this.style.backgroundColor }}; }
	if(this._pulseOptions.wallpaper) this._pulseOptions.wallpaper.pause();
	const pulseIn = () => { const keyframes = { color: [ this.style.color, color[_options.colorization](this._pulseOptions.color) ],
		backgroundColor: [ this.style.backgroundColor, color[_options.colorization](this._pulseOptions.backgroundColor) ] };
		if(opacity) keyframes.opacity = opacity; if(!withColor) delete keyframes.color; if(!withBackgroundColor) delete keyframes.backgroundColor;
		_options.finish = (_e, ... _a) => { delete _options.sourceValues; Reflect.defineProperty(_e, 'type', { value: 'half' });
		pulseCallbacks.call(this, 'half', _e, ... _a); delete _options.targetValues; pulseCallbacks.call(this, 'callback', _e, ... _a);
		return this._pulse = pulseOut(); }; return this._pulse = this.animate(keyframes, _options, ... _args); };
	const pulseOut = () => { if(!this._pulseOptions) { delete this._pulse; return; } const keyframes = { color: this._pulseOptions.color,
		backgroundColor: this._pulseOptions.backgroundColor }; if(opacity !== null) keyframes.opacity = this._pulseOptions.opacity;
		if(!withColor) delete keyframes.color; if(!withBackgroundColor) delete keyframes.backgroundColor;
		_options.finish = (... _a) => { pulseCallbacks.call(this, 'finish', ... _a); pulseCallbacks.call(this, 'callback', ... _a); };
		_options.callback = (... _a) => { if(!_options.persist && this._pulseOptions) for(const idx in this._pulseOptions.original)
			this.style[idx] = this._pulseOptions.original[idx]; if(this._pulseOptions && this._pulseOptions.wallpaper)
				this._pulseOptions.wallpaper.resume();
			delete this._pulse; delete this._pulseOptions;
			if(_a[0].type !== 'finish') { pulseCallbacks.call(this, 'callback', ... _a); }};
		return this._pulse = this.animate(keyframes, _options, ... _args); };
	if(this._pulse) return; return this._pulse = pulseIn();
}});

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
	for(var i = 0; i < result.length; ++i) if(result[i]) result[i][_func]();
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
Reflect.defineProperty(document, 'getAnimations', { value: (... _args) => {
	var CAMEL = true; var arg; for(var i = 0; i < _args.length; ++i)
		if(arg = Animation.getCSSStyleKey(_args[i])) _args[i] = arg;
		else { if(typeof _args[i] === 'undefined') CAMEL = false; _args.splice(i--, 1); }
	if(_args.length > 0) _args = _args.unique(); else _args = Object.keys(globalAnimation); var nonCamel;
	const result = Object.create(null); for(var i = 0; i < _args.length; ++i) { if(CAMEL) nonCamel = camel.disable(_args[i]);
		else nonCamel = _args[i]; if(!globalAnimation[_args[i]]) result[_args[i]] = result[nonCamel] = [];
		else result[_args[i]] = result[nonCamel] = [ ... globalAnimation[_args[i]] ];
	} return result;
}});

Reflect.defineProperty(document, 'getAnimation', { value: (... _args) => {
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
	const result = document.getAnimation(... _args); for(var i = 0; i < result.length; ++i)
		result[i][_func + 'Animation']();
	return result;
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
Reflect.defineProperty(HTMLElement.prototype, 'vibrate', { value: function(_enabled, _speed, _interval, _opacity, _changeable)
{
	//
	if(this.noAnimation)
	{
		return false;
	}

	//
	if(typeof _enabled !== 'boolean')
	{
		_enabled = !this.vibration;
	}

	if(!Number.isInt(_speed))
	{
		_speed = this.parseVariable('vibration-speed');
	}
	
	if(!Number.isInt(_interval))
	{
		_interval = this.parseVariable('vibration-interval');
	}
	
	if(!Number.isInt(_opacity))
	{
		_opacity = this.parseVariable('vibration-opacity');
	}
	
	if(!Number.isInt(_changeable) || _changeable < 0)
	{
		if(DEFAULT_VIBRATE_CHANGEABLE)
		{
			if(Number.isInt(DEFAULT_VIBRATE_DOTS) && DEFAULT_VIBRATE_DOTS >= 0)
			{
				_changeable = DEFAULT_VIBRATE_DOTS;
			}
			else
			{
				_changeable = 0;
			}
		}
		else
		{
			_changeable = false;
		}
	}
	
	_opacity %= 1;
	
	//
	const fin = (_success) => {
		if(this.vibration.animation)
		{
			cancelAnimationFrame(this.vibration.animation);
			this.vibration.animation = null;
		}
		
		if(this.vibration.dots && this.vibration.removeDots)
		{
			this.innerHTML = this.innerHTML.slice(
				0, -this.vibration.dots);
			this.vibration.dots = 0;
		}

		this.style.opacity = '1';
		
		delete this.vibration;
		return !!_success;
	};
	
	//
	if(this.vibration)
	{
		if(!_enabled)
		{
			return fin(true);
		}

		var result;

		if(this.innerHTML !== this.vibration.lastHTML)
		{
			if(this.vibration.animation)
			{
				cancelAnimationFrame(this.vibration.animation);
				this.vibration.animation = null;
			}

			result = null;
		}
		else
		{
			result = false;
		}

		const change = {
			speed: _speed,
			interval: _interval,
			opacity: _opacity,
			changeable: _changeable };

		for(const idx in change)
		{
			if(this.vibration[idx] !== change[idx])
			{
				this.vibration[idx] = change[idx];
				if(result === false) result = true;
			}
		}

		if(result !== null)
		{
			return result;
		}
	}
	else if(!_enabled)
	{
		return false;
	}
		
	this.vibration = {
		speed: _speed, interval: _interval, opacity: _opacity,
		last: null, animation: null, seconds: 0, counter: 0,
		dots: 0, psin: null, countedDots: countDots(this),
		changeable: _changeable, lastHTML: this.innerHTML };
		
	if(this.vibration.countedDots)
	{
		this.innerHTML = this.innerHTML.slice(
			0, -this.vibration.countedDots);
		this.vibration.lastHTML = this.innerHTML;
	}
	else if(Number.isInt(DEFAULT_VIBRATE_DOTS) && DEFAULT_VIBRATE_DOTS > 0)
	{
		this.vibration.countedDots = DEFAULT_VIBRATE_DOTS;
	}

	const animationFrame = () => {
		if(!this.vibration || !this.vibration.animation)
		{
			return fin(false);
		}

		if(this.innerHTML !== this.vibration.lastHTML)
		{
			if(this.vibration.changeable)
			{
				if((this.vibration.countedDots = countDots(this)) === 0)
				{
					this.vibration.countedDots = this.vibration.changeable;
				}
				else
				{
					this.innerHTML = this.innerHTML.
						slice(0, -this.vibration.countedDots);
				}
				
				this.vibration.dots = 0;
			}
			else
			{
				return fin(false);
			}
		}

		if(this.hasAnimation('opacity'))
		{
			this.cancelAnimation('opacity');
		}
		
		const now = Date.now();
		const origSeconds = this.vibration.seconds;
		this.vibration.seconds += ((now - this.vibration.last) / 1000);
		this.vibration.last = now;
		
		this.vibration.counter +=
			(this.vibration.seconds - origSeconds);
		var newSecond;
		
		if(this.vibration.counter >= this.vibration.interval)
		{
			newSecond = true;
			this.vibration.counter %= this.vibration.interval;
		}
		else
		{
			newSecond = false;
		}
		
		this.vibration.psin = Math.psin(this.vibration.seconds *
			this.vibration.speed);
		this.style.opacity = Math.scale(
			this.vibration.psin, 1, this.vibration.opacity);
		
		if(newSecond && this.vibration.countedDots)
		{
			if(this.vibration.countedDots)
			{
				if(this.vibration.dots)
				{
					this.innerHTML = this.innerHTML.
						slice(0, -this.vibration.dots);
				}
				
				if(++this.vibration.dots > this.vibration.countedDots)
				{
					this.vibration.dots = 0;
				}
				else
				{
					this.innerHTML += ('.').repeat(this.vibration.dots);
				}
			}

			this.vibration.lastHTML = this.innerHTML;
		}
		
		if(this.vibration && this.vibration.animation)
		{
			this.vibration.animation =
				requestAnimationFrame(
					animationFrame);
		}
	};
	
	this.vibration.last = Date.now();
	this.vibration.animation =
		requestAnimationFrame(
			animationFrame);
	return true;
}});

const countDots = (_elem) => {
	const data = _elem.innerHTML;
	var result = 0;

	for(var i = data.length - 1; i >= 0; --i)
	{
		if(data[i] === '.')
		{
			++result;
		}
		else
		{
			break;
		}
	}

	return result;
};

Reflect.defineProperty(HTMLElement.prototype, 'stopVibration', { value: function(_remove_dots = true)
{
	if(this.vibration)
	{
		this.vibration.removeDots = _remove_dots;
	}
	
	return this.vibrate(false);
}});

Reflect.defineProperty(HTMLElement.prototype, 'vibrating', {
	get: function()
	{
		return !!this.vibration;
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
		else if(this.element.noAnimation)
		{
			return null;
		}

		if(!String.isString(this.background, false))
		{
			this.background = GradientAnimation.
				getBackgroundLinearGradientString(
					this.element.getVariable('wallpaper-background'));
		}
		
		if(!Number.isNumber(this.speed) || this.speed <= 0)
		{
			this.speed = this.element.parseVariable('wallpaper-speed');
		}
		
		GradientAnimation.INDEX.push(this);
	}
	
	static getBackgroundLinearGradientString(_string)
	{
		return 'linear-gradient(var(--degrees), ' + _string + ')';
	}
	
	static get enabled()
	{
		return GradientAnimation.ENABLED;
	}
	
	static set enabled(_value)
	{
		if(typeof _value !== 'boolean')
		{
			return this.enabled;
		}
		
		if(_value === GradientAnimation.ENABLED)
		{
			return false;
		}
		
		if(GradientAnimation.ENABLED = _value)
		{
			this.enable();
			
			console.debug('Gradient Animations are ENABLED now.');
			osd('<b class="aqua">Gradient Animations</b> are ' +
				'<span class="true">enabled</span> now.',
					DEFAULT_OSD, 'GradientAnimationEnabled');
		}
		else
		{
			this.disable();
			
			console.debug('Gradient Animations are DISABLED now!');
			osd('<b class="aqua">Gradient Animations</b> are ' +
				'<span class="false">disabled</span> now!',
					DEFAULT_OSD, 'GradientAnimationEnabled');
		}

		if(document.COOKIES)
		{
			document.setCookie('gradientAnimations', _value);
		}

		window.emit('GradientAnimations', {
			enabled: _value, disabled: !_value });
		return true;
	}
	
	get element()
	{
		return (this._element || null);
	}
	
	get disabled()
	{
		return !this.enabled;
	}
	
	set disabled(_value)
	{
		if(typeof _value !== 'boolean')
		{
			return this.disabled;
		}
		
		return this.enabled = !_value;
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
			this.background = GradientAnimation.getBackgroundLinearGradientString(
				this.element.getVariable('wallpaper-background'));
			this.speed = this.element.parseVariable('wallpaper-speed');
		}
		
		this._pause = false;
		this._originalBackground = null;
		this.degrees = this.time = this.psin = 0;
		this._last = this._lastStyle = null;
	}
	
	get isPlaying()
	{
		return (typeof this.animation === 'number' && !this._pause);
	}
	
	start()
	{
		if(!this.constructor.enabled)
		{
			return null;
		}
		
		if(typeof this.animation === 'number')
		{
			return false;
		}
		
		if(this._pause)
		{
			return this.resume();
		}

		this._last = Date.now();
		this.time = this.degrees = 0;
		this._originalBackground = this.element.style.background;
		this.element.style.background = GradientAnimation.getBackgroundLinearGradientString(
			this.element.getVariable('wallpaper-background'));
		
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
		GradientAnimation.INDEX.remove(this);
		
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
		if(!this.constructor.enabled)
		{
			return;
		}
		
		//
		if(typeof this.animation !== 'number')
		{
			if(this.animation !== null)
			{
				this.destroy();
			}
			
			return;
		}
		
		if(this._pause)
		{
			return;
		}
		
		//
		const now = Date.now();
		this.time += (now - this._last);
		this._last = now;

		//
		this.element.setVariable('--degrees', this.getDegrees());

		//
		if(typeof this.animation === 'number')
		{
			this.animation = requestAnimationFrame(GradientAnimation.prototype.animationFrame.bind(this));
		}
	}
	
	getDegrees()
	{
		return (Math.scale(this.psin = Math.psin(this.time / 1000 * this.speed), 360, 0) + 'deg');
	}

	static disable(_pause = true)
	{
		const index = GradientAnimation.INDEX;
		
		for(const item of index)
		{
			if(_pause)
			{
				item.pause();
			}
			else
			{
				item.stop();
			}
		}
		
		return index.length;
	}
	
	static enable()
	{
		if(!this.enabled)
		{
			return -1;
		}

		const index = GradientAnimation.INDEX;
		
		for(const item of index)
		{
			if(item.isPaused)
			{
				item.resume();
			}
			else
			{
				item.start();
			}
		}
		
		return index.length;
	}
}

//
GradientAnimation.INDEX = [];
GradientAnimation.ENABLED = true;

ready(() => {
	var gradientAnimationsEnabled;

	if(document.COOKIES)
	{
		if(!document.hasBooleanCookie('gradientAnimations'))
		{
			document.setCookie('gradientAnimations',
				gradientAnimationsEnabled = true);
		}
		else
		{
			gradientAnimationsEnabled = document.
				getCookie('gradientAnimations');
		}
	}
	else
	{
		gradientAnimationsEnabled = true;
	}

	GradientAnimation.enabled = gradientAnimationsEnabled;
});

//
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
		_enabled = !this.gradientAnimation.isPlaying;
	}
	
	if(_enabled)
	{
		if(this.gradientAnimation.isPlaying)
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
		return !!(this.gradientAnimation && this.gradientAnimation.isPlaying);
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
Reflect.defineProperty(HTMLElement.prototype, 'fade', { value: function(_options, _items, _callback)
{
	if(this.parseAttribute('ignanim') || this.parseAttribute('noanim'))
	{
		return false;
	}
	
	const withItems = Array.isArray(_items, true);
	const items = (withItems ? _items : [ ... this.children ]);
	
	if(items.length === 0)
	{
		return 0;
	}
	
	if(!Object.isObject(_options))
	{
		_options = {};
	}
	
	if(typeof _callback !== 'function')
	{
		if(typeof _items === 'function')
		{
			_callback = _items;
			_items = null;
		}

		_callback = null;
	}
	
	var rest = items.length, total = items.length;
	const cb = (_item) => {
		if(_item && _item.style)
		{
			_item.style.opacity = '1';
		}

		//TODO/NICHT KORREKT (unten)!?
		if(--rest <= 0)
		{
			if(_callback)
			{
				_callback.call(this, delay, total);
			}
			
			this.emit('fade', { type: 'fade', delay, total, options: _options });
		}
	};
	
	var delay = 0;
	
	if(Number.isInt(_options.delayStart))
	{
		delay = _options.delayStart;
	}
	else if(Number.isInt(_options.delay))
	{
		delay = _options.delay;
	}
	else if(this.hasVariable('delay-start'))
	{
		delay = this.parseVariable('delay-start');
	}
	else
	{
		delay = this.parseVariable('delay');
	}

	var scroll;

	if('scroll' in _options)
	{
		if((scroll = _options.scroll) === true)
		{
			scroll = this;
		}
		else if(scroll === false)
		{
			scroll = null;
		}
	}
	else
	{
		//scroll = this;
		scroll = null;
	}

	var SCROLL; for(var i = 0; i < items.length; ++i)
	{
		const child = items[i];

		if(SCROLL = (child.style && scroll && HTMLElement.inScrollArea(child, scroll) && !child.parseAttribute('ignanim') && !child.parseAttribute('noanim')))
		{
			child.style.opacity = '0';
		}
		
		if(withItems)
		{
			this.appendChild(child);
		}
		
		if(SCROLL || !scroll)
		{
			if(child.tagName === 'UL' || child.tagName === 'OL' || child.tagName === 'TABLE')
			{
				child.style.opacity = '1';
				const children = [ ... child.children ];

				var localRest = children.length;
				const localCb = (_item) => { _item.style.opacity = '1';
					if(--localRest > 0) return; cb(child);
					child.emit('fade', { type: 'fade', children, parent: this, total: children.length, options: _options });
				};
				
				for(var j = 0; j < children.length; ++j)
				{
					const item = children[j];
					item.style.opacity = '0';
					
					if((HTMLElement.inScrollArea(item, scroll)) || !scroll)
					{
						const opts = { ... _options };
						
						if(!Number.isInt(opts.duration))
						{
							opts.duration = item.parseVariable('duration');
						}
						
						opts.delay = delay;
						opts.callback = () => localCb(item);
						
						item.show(opts);
						
						if(!Number.isInt(opts.delayEach))
						{
							if(item.hasVariable('delay-each'))
								delay += item.parseVariable('delay-each');
							else if(child.hasVariable('delay-each'))
								delay += child.parseVariable('delay-each');
							else
								delay += this.parseVariable('delay-each');
						}
						else
						{
							delay += opts.delayEach;
						}
					}
					else
					{
						localCb(item);
					}
				}
			}
			else if(typeof child.show === 'function')
			{
				const opts = { ... _options };
				
				if(!Number.isInt(opts.duration))
				{
					if(typeof child.parseVariable === 'function' && child.hasVariable('duration'))
					{
						opts.duration = child.parseVariable('duration');
					}
					else
					{
						opts.duration = this.parseVariable('duration');
					}
				}

				opts.delay = delay;
				opts.callback = () => cb(child);

				child.show(opts);
			}
			else
			{
				setTimeout(() => cb(child), -delay);
			}
			
			if(child.tagName !== 'UL' && child.tagName !== 'OL' && child.tagName !== 'TABLE')
			{
				if(!Number.isInt(_options.delayEach))
				{
					if(typeof child.parseVariable === 'function' && child.hasVariable('delay-each'))
					{
						delay += child.parseVariable('delay-each');
					}
					else
					{
						delay += this.parseVariable('delay-each');
					}
				}
				else
				{
					delay += _options.delayEach;
				}
			}
		}
		else
		{
			cb(child);
		}
	}
	
	return delay;
}});

//
const styles = {

	deleteProperty: (_target, _property) => {

		const anim = _target.animation[_property];
		if(anim) { anim.finish(); return true; }
		return false;
		
	},
	
	get: (_target, _property) => {
	
		if(_target.isConnected)
			return getComputedStyle(_target).getPropertyValue(_property);
		return _target.style.getPropertyValue(_property);
		
	},
	
	set: (_target, _property, _value) => {

		if(!(_property in _target.style))
		{
			return false;
		}

		const options = { callback: [] };

		if(Array._isArray(_value)) for(var i = 0; i < _value.length; ++i)
		{
			if(Object._isObject(_value[i]))
			{
				Object.assign(options, _value.splice(i--, 1)[0]);
			}
			else if(Number.isNumber(_value[i]))
			{
				options.duration = Math.trunc(_value.splice(i--, 1)[0]);
			}
			else if(typeof _value[i] === 'function')
			{
				options.callback.pushUnique(_value.splice(i--, 1)[0]);
			}
			else if(Array._isArray(_value[i]))
			{
				options.callback.pushUnique(... _value.splice(i--, 1)[0]);
			}
			else if(!String.isString(_value[i], false))
			{
				_value.splice(i--, 1);
			}
		}
		
		if(options.callback.length === 0)
		{
			delete options.callback;
		}

		return !!_target.animate({ [ _property ]: _value }, options);
	},
	
	has: (_target, _property) => {

		return (_property in _target.animation);

	},
	
	ownKeys: (_target) => {

		return Object.keys(_target.animation);

	}
	
};

Reflect.defineProperty(HTMLElement.prototype, 'styles', {
	get: function()
	{
		return new Proxy(this, styles);
	}
});

//
Reflect.defineProperty(Node.prototype, 'finishSetTextContent', { value: function()
{
	if(!this._setTextContent)
	{
		return this._setTextContent = null;
	}
	
	if(this._setTextContent.timeout)
	{
		clearTimeout(this._setTextContent.timeout);
		this._setTextContent.timeout = null;
	}

	const rest = [ ... this._setTextContent.lines ];

	if(this._setTextContent.animation)
	{
		cancelAnimationFrame(this._setTextContent.animation);
		this._setTextContent.animation = null;
	}

	this.textContent += rest.join(EOL);

	if(this._setTextContent.callbacks)
	{
		this._setTextContent.callbacks.call(
			this, null, result);
		this._setTextContent.callbacks.clear(this);
	}

	delete this._setTextContent;
	return this.textContent;
}});

Reflect.defineProperty(Node.prototype, 'addTextContent', { value: function(_text, _options)
{
	return this.setTextContent(_text,
		Object.assign(_options, {
			add: true }));
}});

//
//todo/bei frueherem return auch callback(s) beachten!?!
//todo/*evtl*(..!1) auch callbacks {,finish,...} dazu???
//
Reflect.defineProperty(Node.prototype, 'setTextContent', { value: function(_text, _options)
{
	if(!Array._isArray(_text) && typeof _text !== 'string')
	{
		if(this._setTextContent.lines)
		{
			return [ ... this._setTextContent.lines ];
		}
		
		return [];
	}

	if(typeof _text === 'string')
	{
		_text = _text.split(EOL);
	}
	else if(!Array._isArray(_text))
	{
		return null;
	}

	var empty = (_text.length === 0);

	if(!empty) for(var i = 0; i < _text.length; ++i)
	{
		if(_text[i].trim())
		{
			empty = false;
			break;
		}
	}

	if(!this.isConnected)
	{
		this.finishSetTextContent();
		return this.textContent = _text.join(EOL);
	}

	const finish = (_success = true) => {
		if(!this._setTextContent)
		{
			return;
		}

		if(typeof this._setTextContent.animation === 'function')
		{
			const anim = this._setTextContent.animation;
			setTimeout(() => anim());
		}
		
		const has = !!(this._setTextContent.callbacks);

		if(has)
		{
			this._setTextContent.callbacks.call(
				this, null, this.textContent);
			this._setTextContent.callbacks.clear(this);
		}

		if(!this._setTextContent.timeout)
		{
			this._setTextContent = null;
		}
		
		return !!has;
	};

	const earlyReturn = (_fin = true) => {
		if(_fin)
		{
			this.finishSetTextContent();
		}
		else
		{
			if(this._setTextContent?.animation)
			{
				cancelAnimationFrame(this._setTextContent.animation);
				this._setTextContent.animation = null;
			}

			if(this._setTextContent?.timeout)
			{
				clearTimeout(this._setTextContent.timeout);
				this._setTextContent.timeout = null;
			}
		}

		if(_options.delay) return setTimeout(() => {
			if(this._setTextContent?.timeout)
			{
				clearTimeout(this._setTextContent.timeout);
				this._setTextContent.timeout = null;
			}

			return this.textContent = _text.join(EOL);
		}, _options.delay);

		return this.textContent = _text.join(EOL);
	};

	_options = Object.assign({}, _options);

	if(typeof _options.add !== 'boolean')
	{
		_options.add = false;
	}

	if(!Number.isInt(_options.delay))
	{
		_options.delay = this.parseVariable('line-delay');
	}

	if(_options.delay < 0)
	{
		_options.delay = 0;
	}

	if(this._setTextContent)
	{
		if(_options.add || empty)
		{
			return this._setTextContent.lines.push(... _text);
		}
		else if(empty)
		{
			return earlyReturn(true);
		}
		
		this._setTextContent.lines = [ ... _text ];
		this._setTextContent.animation = false;
		this.textContent = '';
		
		if(this._setTextContent.timeout)
		{
			clearTimeout(this._setTextContent.timeout);
			this._setTextContent.timeout = null;
		}
	}
	else if(empty)
	{
		return earlyReturn(false);
	}
	else
	{
		this._setTextContent = {
			lines: [ ... _text ] };
	}

	_options = Object.assign({}, _options);

	if(!Number.isInt(_options.start) || _options.start < 0)
	{
		_options.start = 0;
	}
	
	if(!Number.isInt(_options.duration))
	{
		_options.duration = this.parseVariable('line-duration');
	}

	if(!Number.isInt(_options.lines))
	{
		if(!(_options.lines = this.visibleLines) || _options.lines <= 0)
		{
			_options.lines = this.parseVariable('line-count');
		}
	}
	
	if(_options.duration <= 0 || _options.lines <= 0)
	{
		finish();

		if(this._setTextContent)
		{
			this._setTextContent.lines.push(... _text);
			return this._setTextContent.lines.join(EOL);
		}

		return this.textContent = _text.join(EOL);
	}
	
	
	if(typeof _options.callback !== 'function')
	{
		_options.callback = null;
	}
	else
	{
		_options.method = CallbackController.checkMethod(_options.method);

		if(!this._setTextContent.callbacks)
		{
			this._setTextContent.callbacks = new Callback();
		}
		
		this._setTextContent.callbacks[_options.method](
			this, null, _options.callback);
	}

	if(typeof _options.add !== 'boolean')
	{
		_options.add = false;
	}

	if(_options.start > 0)
	{
		if(_options.start >= _text.length)
		{
			_options.start = _text.length;
		}
		
		while(--_options.start > 0)
		{
			this.textContent += _text.shift() + EOL;
		}
	}

	var	lastNow, time = 0, now, data, line, last = this.textContent;
	const	animationFrame = () => {
			//
			if(!this._setTextContent || !this._setTextContent.animation)
			{
				return finish(false);
			}
			
			if(this.textContent !== last)
			{
				return finish(false);
			}
			
			//
			now = Date.now();
			time += (now - lastNow);
			lastNow = now;
	
			if(time >= _options.duration)
			{
				var times = Math._ceil(time / _options.duration);
				data = ''; time = 0;

				while(this._setTextContent.lines.length > 0)
				{
					line = this._setTextContent.lines.shift();
					data += (line + EOL);

					if(!line.trim())
					{
						continue;
					}

					if(--_options.lines <= 0)
					{
						data += this._setTextContent.lines.join(EOL);
						break;
					}

					if(--times <= 0)
					{
						break;
					}
				}
				
				if(data)
				{
					last = (this.textContent += data);
				}
			}

			//
			if(_options.lines <= 0)
			{
				return finish(true);
			}
			else if(typeof this._setTextContent.animation === 'function')
			{
				return finish(false);
			}
			else if(this._setTextContent.lines.length === 0)
			{
				return finish(true);
			}
			else if(!this._setTextContent.animation)
			{
				return finish(false);
			}
			else
			{
				this._setTextContent.animation =
					requestAnimationFrame(animationFrame);
			}
		};

	return this._setTextContent.timeout =
		setTimeout(() => { if(!this._setTextContent) return;
			this._setTextContent.timeout = null; lastNow = Date.now();
			this._setTextContent.animation = requestAnimationFrame(
				animationFrame); }, _options.delay);
}});

//
ready(() => { setTimeout(() => {
	window.DEFAULT_GLOBAL_SPEED =
		document.parseVariable('global-default');

	if(!document.COOKIES)
	{
		return;
	}

	if(document.hasNumericCookie('speed'))
	{
		const speed = document.getCookie('speed');

		if(document.parseVariable('global') === speed)
		{
			return;
		}

		document.setVariable('global', speed);
		osd('Global <b class="aqua">animation speed</b> set to ' +
			'<b style="color: red;">' + speed.toLocaleString() +
			'</b>.', DEFAULT_OSD, 'globalSpeed');
		console.debug('Global animation speed set to ' +
			speed.toLocaleString() + '.');
	}
	else
	{
		document.setCookie('speed',
			document.parseVariable('global'));
	}
}, 1200); });

//
//TODO/bitte @ 'config.css' noch mehr variablen/settings/options/.. u.a. kegel-groesze, etc...!1 ^_^
//
Reflect.defineProperty(Element.prototype, 'spotlight', {
	get: function()
	{
		return !!this.SPOTLIGHT;
	},
	set: function(_value)
	{
		//
		if(typeof _value !== 'boolean')
		{
			_value = !this.spotlight;
		}
		
		//
		const removeSpotlight = () => {
			if(!this.SPOTLIGHT)
			{
				return false;
			}
			
			if(this.SPOTLIGHT.lerpEffectFrame)
			{
				cancelAnimationFrame(this.SPOTLIGHT.lerpEffectFrame);
				this.SPOTLIGHT.lerpEffectFrame = null;
			}
			
			if(this.SPOTLIGHT.onPointerMove)
			{
				this.removeEventListener(
					this.SPOTLIGHT.onPointerMove);
				this.SPOTLIGHT.onPointerMove = null;
			}
			
			this.classList.remove('spotlight');
			return !(this.SPOTLIGHT = null);
		};
		
		const calculateMouse = (_e) => {
			const rect = this.SPOTLIGHT.rectangle = this.getBoundingClientRect(); return [
				this.SPOTLIGHT.mouseX = (((_e.clientX - rect.left) / rect.width) * 100),
				this.SPOTLIGHT.mouseY = (((_e.clientY - rect.top) / rect.height) * 100) ]; };

		//
		if(!_value)
		{
			return removeSpotlight();
		}
		
		removeSpotlight();
		
		//
		this.classList.add('spotlight');

		//
		this.SPOTLIGHT = { lerpEffect: this.parseVariable('spotlight-lerp-effect'),
			mouseDown: null, mouseX: 0, mouseY: 0, currentX: 0, currentY: 0 };
			
		/* (0.1) = 10% annaeherung pro frame */
		if(!Number.isNumber(this.SPOTLIGHT.lerpEffect) || this.SPOTLIGHT.lerpEffect <= 0)
		{
			this.SPOTLIGHT.lerpEffect = 0;
		}
		
		this.SPOTLIGHT.onPointerMove = this.on('pointermove', (_e) => {
			const [ mx, my ] = calculateMouse(_e);
			
			if(!this.SPOTLIGHT.lerpEffect)
			{
				this.style.setProperty('--spot-x', mx + '%');
				this.style.setProperty('--spot-y', my + '%');
			}
		}, { passive: true });
		
		this.SPOTLIGHT.lerpEffectHandler = () => {
			this.SPOTLIGHT.currentX += ((this.SPOTLIGHT.mouseX -
				this.SPOTLIGHT.currentX) * this.SPOTLIGHT.lerpEffect);
			this.SPOTLIGHT.currentY += ((this.SPOTLIGHT.mouseY -
				this.SPOTLIGHT.currentY) * this.SPOTLIGHT.lerpEffect);
			
			this.style.setProperty('--spot-x', this.SPOTLIGHT.currentX + '%');
			this.style.setProperty('--spot-y', this.SPOTLIGHT.currentY + '%');

			if(this.SPOTLIGHT.lerpEffectFrame)
			{
				this.SPOTLIGHT.lerpEffectFrame = requestAnimationFrame(
					this.SPOTLIGHT.lerpEffectHandler);
			}
		};
		
		if(this.SPOTLIGHT.lerpEffect)
		{
			this.SPOTLIGHT.lerpEffectFrame = requestAnimationFrame(
				this.SPOTLIGHT.lerpEffectHandler);
		}
		
		return true;
	}
});

//

