/**
 * 封装一些常用的函数
 */

/**
 *
 * 获取 localStorage的数据
 * @param key 存储的key，注意唯一性
 * @param data 存储的data，使用JSON.stringify序列化，所以要注意data不能存在循环引用
 */
function saveLocal(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 *
 * 获取 localStorage的数据
 * @param key 存储的key，注意唯一性
 */
function getLocal(key: string) {
  let savedString = localStorage.getItem(key);
  return savedString ? JSON.parse(savedString) : null;
}

/**
 *
 * 移除 localStorage的数据
 * @param key 存储的key，注意唯一性
 */
function removeLocal(key: string) {
  return localStorage.removeItem(key);
}

/**
 *
 * 返回promise包装的setTimeout，适用于 async await
 * @param ms 传入setTimeout的毫秒数，
 */
function waitTime(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

type WindowEvent = keyof WindowEventMap;

const EventSubscribers: Map<WindowEvent, Function[]> = new Map();
const EventPublishers: Map<WindowEvent, (this: Window, ev: any) => any> = new Map();
const EventTimers: Map<WindowEvent, number> = new Map();
const DebounceDelay = 300; //ms

/**
 * 生成事件通知函数
 * debounce处理
 * @param event 具体事件名
 */
function getPublishEvent(event: WindowEvent) {
  let publisher = EventPublishers.get(event);
  if (!publisher) {
    publisher = function EventPublisher(this: Window, ev: any) {
      let subscribers = EventSubscribers.get(event);
      let timer = EventTimers.get(event);
      if (subscribers) {
        if (timer) {
          window.clearTimeout(timer);
          timer = 0;
        }
        timer = window.setTimeout(() => {
          subscribers &&
            subscribers.forEach(subscriber => {
              subscriber(window, ev);
            });
        }, DebounceDelay);
        EventTimers.set(event, timer);
      }
    };
    EventPublishers.set(event, publisher);
  }
  return publisher;
}

/**
 * 监听一些浏览器的全局事件
 * debounce处理
 * @param event 具体事件名
 * @param subscribor 事件触发时调用的函数
 */
function subscribeEvent(event: WindowEvent, subscriber: Function) {
  let subscribers = EventSubscribers.get(event);
  if (subscribers) {
    if (subscribers.indexOf(subscriber) === -1) subscribers.push(subscriber);
  } else {
    subscribers = [subscriber];
    EventSubscribers.set(event, subscribers);
    window.addEventListener(event, getPublishEvent(event));
  }
}

/**
 * 取消监听一些浏览器的全局事件
 * @param event 具体事件名
 * @param subscribor 事件触发时调用的函数
 */
function unSubscribeEvent(event: WindowEvent, subscriber: Function) {
  let subscribers = EventSubscribers.get(event);
  if (subscribers) {
    let idx = subscribers.findIndex(l => l === subscriber);
    if (idx !== -1) subscribers.splice(idx, 1);
  }
  if (subscribers && !subscribers.length) {
    window.removeEventListener(event, getPublishEvent(event));
  }
}

/**
 * 防抖函数
 * @param func 需要被防抖的函数
 * @param delay 防抖的时间，毫秒数
 */
function debounce(func: Function, delay: number) {
  let timer: number = 0;
  return function (args: any) {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      func(args);
      timer = 0;
    }, delay);
  };
}

function isArray(arr: any) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

function isObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

type ArrayOrObject = { [prop: string]: any } | any[];
/**
 * 深拷贝函数
 * { [prop: string]: any } | any[]
 * @param object 需要被深拷贝的对象，不能有循环引用
 */
function deepClone(object: ArrayOrObject): ArrayOrObject {
  if (isArray(object)) {
    const array = object as any[];
    return array.map(value => deepClone(value));
  } else if (isObject(object)) {
    const obj = object as { [prop: string]: any };
    let newObj: { [key: string]: any } = {};
    Object.keys(object).forEach(key => {
      if (isArray(obj[key])) {
        newObj[key] = obj[key].map((value: any) => deepClone(value));
      } else if (isObject(obj[key])) {
        newObj[key] = deepClone(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  } else {
    return object;
  }
}

/**
 * 获取对应字符串长度：中文计2，英文计1
 * @param str 需要计算长度的字符串
 */
function stringLength(str: string): number {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if ((charCode >= 0x0001 && charCode <= 0x007e) || (0xff60 <= charCode && charCode <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}

/**
 * 判断是否是空对象
 * @param obj 判断的对象
 */
function isEmptyObject(obj: {}): boolean {
  // console.log(Object.keys(obj));
  return !obj || Object.keys(obj).length === 0;
}

/**
 * 由对象转为urlquery
 * @param obj 转为query的对象
 */
function queryString(obj: { [prop: string]: any }): string {
  if (isEmptyObject(obj)) {
    return '';
  } else {
    let query = '?';
    Object.keys(obj).forEach((key, keyIndex) => {
      query += `${keyIndex !== 0 ? '&' : ''}${key}=${obj[key]}`;
    });
    return encodeURI(query);
  }
}

/**
 * 从对象取出特定的一些属性
 * @param obj 对象
 * @param keys 属性
 */
function pickAttr(obj: { [prop: string]: any }, keys: string[]): { [prop: string]: any } {
  let res: { [prop: string]: any } = {};
  (keys || []).forEach(key => {
    res[key] = obj[key];
  });
  return res;
}

export {
  saveLocal,
  getLocal,
  removeLocal,
  waitTime,
  subscribeEvent,
  unSubscribeEvent,
  debounce,
  deepClone,
  stringLength,
  isEmptyObject,
  queryString,
  pickAttr,
};
