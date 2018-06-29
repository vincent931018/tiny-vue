/**
 * Created by caowencheng on 2018/6/29.
 */

"use strict";

import TinyVue from './core';

// 前端脚本中配置热更新处理逻辑
if (module.hot) {
    module.hot.accept();
}

new TinyVue({
    el: '#root',
    temple: `<div>Hello TinyVue!</div><input type="text" v-model="message" /><div v-bind="message"></div>`,
    data: {
        message: "TinyVue"
    }
});

