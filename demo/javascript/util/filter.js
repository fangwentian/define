define('javascript/util/filter.js', [], function() {
    var p = {};

    p.trim = function(s) {
        return s.replace(/^(\s+)|(\s+)$/g, '');
    }

    return p;
})