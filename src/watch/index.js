/**
 * Created by caowencheng on 2018/6/29.
 */

export default class Watcher {
    constructor(el, vm, val, attr) {
        this.el = el;
        this.vm = vm;
        this.val = val;
        this.attr = attr;
        this.update();
    }

    update () {
        this.el[this.attr] = this.vm.$data[this.val]; // 获取data的最新值 赋值给dom 更新视图
    }
}