# define.js
学习nej的define模块后，自己写的一个简化版本。代码量大大减少，由1200行到现在的150行。简化了对define的理解。

> 去掉了对特殊文件的处理如text!../index.html, json!./vars.json。去掉了特殊变量的处理如pro、lib等。在define入口方法的逻辑上有差异，nej的define方法是直接给所有的script挂载监听函数，然后再执行正在的_doDefine，此处改为在define里就调用_doDefine。

##### Usage

```javascript

define('javascript/entry.js', ['./util/math.js','./util/filter.js'], function(math, filter) {
        var a = math.add(8, 2);
        var b = math.minus(8, 2);
        var c = filter.trim('  nice to meet you!  ');
        console.log(a, b, c);
    }
)
```

##### 参数说明
- 第一个参数是当前js的绝对地址
- 第二个是依赖的js，可以是绝对地址或相对地址
- 第三个是回调函数，依次注入依赖js的返回结果


##### Demo
在根目录下运行
```bash
npm run dev
```
访问 http://120.0.0.1:3000, 打开控制台看js输出结果。
