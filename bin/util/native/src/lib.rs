#[macro_use]
extern crate neon;
extern crate neon_serde;
extern crate crypto;
extern crate base64;
extern crate toml;
extern crate regex;
extern crate chrono;
extern crate lazy_static;

// crate
use neon::prelude::*;
use crypto::digest::Digest;
use crypto::sha2::Sha256;
use crypto::md5::Md5;
use crypto::aes;
use base64::encode;
use toml::Value;
use regex::Regex;
use chrono::prelude::*;
use lazy_static::lazy_static;

// std
use std::fs::File;
use std::io::Read;
use std::io::Write;


// 正则常量
lazy_static! {
    static ref IS_EMAIL: Regex = Regex::new(r"^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$").unwrap();
    static ref IS_IP: Regex = Regex::new(r"^(\d+)\.(\d+)\.(\d+)\.(\d+)$").unwrap();
    static ref IS_PHONE: Regex = Regex::new(r"^[1][3,4,5,7,8][0-9]{9}$").unwrap();
}


// SHA256摘要
// 
// @params {String} args[0] 文本
// @returns {String} 加密摘要
fn sign (mut cx: FunctionContext) -> JsResult<JsString> {
    let text = cx.argument::<JsString>(0)?.value();
    let mut hasher = Sha256::new();
    hasher.input_str(&format!("{:?}", text));
    let hex = hasher.result_str();
    Ok(cx.string(encode(&hex)))
}


// MD5摘要
//
// @params {String} args[0] 文本
// @returns {String} 加密摘要
fn md5 (mut cx: FunctionContext) -> JsResult<JsString> {
    let text = cx.argument::<JsString>(0)?.value();
    let mut md5er = Md5::new();
    md5er.input_str(&format!("{:?}", text));
    let hex = md5er.result_str();
    Ok(cx.string(&hex))
}


// 读取TOML配置文件
//
// @params {String} args[0] 配置文件路径
// @returns {Object} 配置文件对象
fn read_toml (mut cx: FunctionContext) -> JsResult<JsValue> {
    let path = cx.argument::<JsString>(0)?.value();
    let mut file = File::open(&path).unwrap();
    let mut buffer = String::new();
    file.read_to_string(&mut buffer).unwrap();
    let toml = buffer.parse::<Value>().unwrap();
    let values = neon_serde::to_value(&mut cx, &toml)?;
    Ok(values)
}


// 加密
//
// @params {String} args[0] 密钥
// @params {String} args[1] 初始化向量
// @params {String} args[2] 明文
// @returns {String}
fn decrypt (mut cx: FunctionContext) -> JsResult<JsString> {
    let key = cx.argument::<JsString>(0)?.value().into_bytes();
    let iv = cx.argument::<JsString>(1)?.value().into_bytes();
    let text = cx.argument::<JsString>(2)?.value().into_bytes();
    let mut dec = aes::ctr(aes::KeySize::KeySize256, &key, &iv);
    let mut output = vec!(0u8; text.len());
    dec.process(&text, &mut output.as_mut_slice());
    Ok(cx.string(encode(&mut output)))
}


// 检查IP
// 
// @params {String} args[0] ip地址
// @returns {Boolean}
fn is_valid_ip (mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let ip = cx.argument::<JsString>(0)?.value();
    Ok(cx.boolean(IS_IP.is_match(&ip)))
}


// 检查是否超时
//
// @params {Number} args[0] 开始时间
// @params {Number} args[1] 结束时间
// @returns {Boolean}
fn is_timeout (mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let start = cx.argument::<JsNumber>(0)?.value();
    let end = cx.argument::<JsNumber>(1)?.value();
    let dt = Local::now();
    let now = dt.timestamp_millis() as f64;
    let bol: bool = start >= (now - end);
    Ok(cx.boolean(bol))
}


// 检查手机号码
// 
// @params {String} args[0] 手机号
// @returns {Boolean}
fn is_phone_available (mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let phone = cx.argument::<JsString>(0)?.value();
    Ok(cx.boolean(IS_PHONE.is_match(&phone)))
}


// 检查邮箱
// 
// @params {String} args[0] 邮箱
// @returns {Boolean}
fn is_email (mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let email = cx.argument::<JsString>(0)?.value();
    Ok(cx.boolean(IS_EMAIL.is_match(&email)))
}


// 分页
//
// @params {String} args[0] 页号
// @params {String} args[1] 限制
// @returns {Object}
fn pagination (mut cx: FunctionContext) -> JsResult<JsObject> {
    let page = cx.argument::<JsString>(0)?.value();
    let limit = cx.argument::<JsString>(1)?.value();
    let page: u32 = page.trim().parse().unwrap();
    let limit: u32 = limit.trim().parse().unwrap();
    let page = page as f64;
    let limit = limit as f64;
    assert!(limit <= 100.0);
    let skip = (page - 1.0) * limit;
    let obj = JsObject::new(&mut cx);
    let value_skip = cx.number(skip);
    let value_limit = cx.number(limit);
    obj.set(&mut cx, "skip", value_skip)?;
    obj.set(&mut cx, "limit", value_limit)?;
    Ok(obj)
}


// 导出方法
// 将函数导出到Node.JS中
register_module!(mut cx, {
    cx.export_function("sign", sign)?;
    cx.export_function("md5", md5)?;
    cx.export_function("readToml", read_toml)?;
    cx.export_function("decrypt", decrypt)?;
    cx.export_function("isIP", is_valid_ip)?;
    cx.export_function("isTimeOut", is_timeout)?;
    cx.export_function("isPhone", is_phone_available)?;
    cx.export_function("pagination", pagination)?;
    cx.export_function("isEmail", is_email)?;
    Ok(())
});