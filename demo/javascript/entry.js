define('javascript/entry.js', ['./util/math.js','./util/filter.js'], function(math, filter) {
        var a = math.add(8, 2);
        var b = math.minus(8, 2);
        var c = filter.trim('  nice to meet you!  ');
        console.log(a, b, c);
    }
)