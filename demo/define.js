(function(d, w) {
    /**
     * 变量定义
     */
    var __xqueue = [];  // 存放文件自身的uri，及其依赖文件，回调函数等. 属性 name: uri, deps: deps, callback: callback
    var __scache = {};  // 存放script的加载状态，0 表示loading，1 表示waiting，2 表示define完成，即其依赖的js都加载执行完，自身也执行完得到返回结果
    var __rcache = {};  // 存放每个script的执行结果

    /**
     * 辅助功能方法
     */
    var _isTypeOf = function(_data,_type) {
        return Object.prototype.toString.call(_data)==='[object '+_type+']';
    };

    var _getElement = function(_event) {
        return !_event ? null : (_event.target || _event.srcElement);
    };

    var _isAbsoluteUri = function(uri) {
        return uri.charAt(0) != '.'
    }

    var _getAbsoluteUri = function(currentScriptUri, uri) {
        var link = d.createElement('a');
        var href = '';
        // 如果uri为绝对路径
        if(_isAbsoluteUri(uri)) {
            return location.origin + '/' + (uri.indexOf('/') === 0 ? uri.slice(1, uri.length) : uri);
            href = location.origin + uri;
        } else {
            var folderUri = currentScriptUri.slice(0, currentScriptUri.lastIndexOf('/') + 1);
            href = folderUri + uri;
        }
        link.href = href;
        return link.href;
    }

    /**
     * 业务相关方法
     */
    var _loadScript = function(uri) {
        // 防止重复加载脚本
        if(!uri || __scache[uri] != null) return;
        __scache[uri] = 0;
        var script = d.createElement('script');
        script.src = uri;
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        _addLisenter(script);
        d.body.appendChild(script);
    }

    var _clearScript = function(script) {
        if (!script || !script.parentNode) return;
        script.onload = null;
        script.onerror = null;
        script.onreadystatechange = null;
        script.parentNode.removeChild(script);
    }

    var _addLisenter = function(script) {
        script.onload = function(e) {_scriptLoaded(_getElement(e));}
        script.onerror = function(e) {_scriptLoaded(_getElement(e));}
    }

    // script加载完成回调函数
    var _scriptLoaded = function(script) {
        var uri = script.src;
        if(!uri) return;
        _clearScript(script);
        // 每当有script加载完成，都检查一遍，
        _checkLoading();
    }

    var _isAllDefined = function(deps) {
        if(!_isTypeOf(deps, 'Array')) return;
        return deps.every(function(uri) {
            return __scache[uri] == 2;
        })
    }

    var _execScript = function(xqueueItem) {
        var arr = xqueueItem.deps.map(function(uri) {
            return __rcache[uri];
        });

        var result = xqueueItem.callback.apply(w, arr);
        __scache[xqueueItem.name] = 2;
        __rcache[xqueueItem.name] = result;
    }

    // 检查是否有js其依赖的js都是defined，有就执行
    var _checkLoading = function() {
        if(!__xqueue.length) return;

        // 从后往前找更容易找到已经执行完成的。
        for(var i = __xqueue.length - 1; i > -1; i--) {
            var item = __xqueue[i];
            var item_deps = item.deps;
            if(item_deps === 0 || _isAllDefined(item_deps)) {
                __xqueue.splice(i, 1);
                _execScript(item);
            }
        }
    }

    var _doDefine = function(uri, deps, callback) {
        if(!deps) {
            return;
        }

        // 存放__scache
        if(__scache[uri] == 2) return;

        __scache[uri] = 1;

        // 将依赖都转换为绝对地址
        var deps = deps.map(function(item) {
            return _getAbsoluteUri(uri, item);
        })

        // 存放__xqueue
        __xqueue.push({
            name: uri,
            deps: deps,
            callback: callback
        })
        
        // 加载依赖
        _loadScript(uri);
        deps.forEach(function(item) {
            _loadScript(item);
        });
        
        _checkLoading();
    }

    w.define = function(uri, deps, callback) {
        if(!_isTypeOf(deps, 'Array') || !_isTypeOf(callback, 'Function')) {
            throw 'param of define error';
        }
        uri = _getAbsoluteUri('/', uri);
        _doDefine(uri, deps, callback);
    }

})(document, window)