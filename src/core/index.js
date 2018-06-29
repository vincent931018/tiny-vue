/**
 * Created by caowencheng on 2018/6/29.
 */
import Watcher from '../watch'

export default class TinyVue {
    constructor(options) {
        this.$element = document.querySelector(options.el);
        this.$init(options);
        this.$data = options.data;
        this.$watcherTpl = {}; // watcher池
        this.$observer(this.$data); // 传入数据，执行函数，重写数据的get set
        this.$compile(this.$element);
    }

    /**
     * 页面初始化
     */
    $init(options) {
        this.$element.innerHTML = options.temple;
    }

    /**
     * 数据拦截 添加get set方法
     */
    $observer(obj) {
        const self = this;
        Object.keys(obj).forEach(key => { // 遍历数据
            self.$watcherTpl[key] = { // 每个数据的订阅池()
                $directives: []
            };
            let value = obj[key]; // 获取属性值
            let watcherTpl = self.$watcherTpl[key]; // 数据的订阅池
            Object.defineProperty(self.$data, key, { // 双向绑定最重要的部分 重写数据的set get
                configurable: true,  // 可以删除
                enumerable: true, // 可以遍历
                get() {
                    return value; // 获取值的时候 直接返回
                },
                set(newVal) { // 改变值的时候 触发set
                    if (value !== newVal) {
                        value = newVal;
                        watcherTpl.$directives.forEach(item => { // 遍历订阅池
                            // 遍历所有订阅的地方(v-model+v-bind+{{}}) 触发this._compile()中发布的订阅Watcher 更新视图
                            item.update();
                        });
                    }
                }
            })
        });
    }

    /**
     * 模版编译
     */
    $compile(el) {
        const self = this;
        let nodes = el.children; // 获取app的dom
        for (let i = 0, len = nodes.length; i < len; i++) { // 遍历dom节点
            let node = nodes[i];
            if (node.children.length) {
                self.$compile(node);  // 递归深度遍历 dom树
            }
            // 如果有v-model属性，并且元素是input，我们监听它的input事件
            if (node.hasAttribute('v-model') && node.tagName === 'INPUT') {
                node.addEventListener('input', (function (key) {
                    let attVal = node.getAttribute('v-model'); // 获取v-model绑定的值
                    self.$watcherTpl[attVal].$directives.push(new Watcher( // 将dom替换成属性的数据并发布订阅 在set的时候更新数据
                        node,
                        self,
                        attVal,
                        'value'
                    ));
                    return function () {
                        self.$data[attVal] = nodes[key].value;  // input值改变的时候 将新值赋给数据 触发set=>set触发watch 更新视图
                    }
                })(i));
            }
            if (node.hasAttribute('v-bind')) { // v-bind指令
                let attrVal = node.getAttribute('v-bind'); // 绑定的data
                self.$watcherTpl[attrVal].$directives.push(new Watcher( // 将dom替换成属性的数据并发布订阅 在set的时候更新数据
                    node,
                    self,
                    attrVal,
                    'innerHTML'
                ))
            }
            const reg = /\{\{\s*([^}]+\S)\s*\}\}/g;
            let txt = node.textContent;   // 正则匹配{{}}
            if (reg.test(txt)) {
                node.textContent = txt.replace(reg, (matched, placeholder) => {
                    // matched匹配的文本节点包括{{}}, placeholder 是{{}}中间的属性名
                    let getName = self.$watcherTpl; // 所有绑定watch的数据
                    getName = getName[placeholder];  // 获取对应watch 数据的值
                    if (!getName.$directives) { // 没有事件池 创建事件池
                        getName.$directives = [];
                    }
                    getName.$directives.push(new Watcher( // 将dom替换成属性的数据并发布订阅 在set的时候更新数据
                        node,
                        self,
                        placeholder,
                        'innerHTML'
                    ));
                    return placeholder.split('.').reduce((val, key) => {
                        return self.$data[key]; // 获取数据的值 触发get 返回当前值
                    }, self.$element);
                });
            }
        }
    }
}