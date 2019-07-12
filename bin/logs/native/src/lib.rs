#[macro_use]
extern crate neon;
extern crate chrono;

// crate
use neon::prelude::*;
use chrono::prelude::*;

// std
use std::fs;
use std::fs::File;
use std::fs::DirBuilder;
use std::path::Path;
use std::io::Write;
use std::io::SeekFrom;
use std::io::Read;
use std::io::Seek;


// 路径
#[derive(Debug)]
struct Paths {
    year: String,
    month: String, 
    date: String,
    now: String
}


// 路径方法
impl Paths {

    // 检查目录
    // 依次递归检查目录和文件
    // 如果不存在
    // 创建目录和文件
    fn censor (&self) {
        if !Path::new(&self.year).is_dir() { DirBuilder::new().recursive(true).create(&self.year).unwrap(); }
        if !Path::new(&self.month).is_dir() { DirBuilder::new().recursive(true).create(&self.month).unwrap(); }
        if !Path::new(&self.date).exists() { File::create(&self.date).unwrap(); }
    }
    
    // 日志格式
    fn format (&self, types: String, log: String) -> String {
        let uppercase_type = types.to_uppercase();
        format!("{:?} > {:?} >\r\n{:?}\r\n", &self.now, uppercase_type, log)
    }
}


// 获取路径
fn get_paths (dirname: String) -> Paths {
    let now = Local::now();
    let year = format!("{:?}", now.year());
    let month = format!("{:?}", now.month());
    let date = format!("{:?}.log", now.day());
    let year = Path::new(&dirname).join(year).to_string_lossy().to_string();
    let month = Path::new(&year).join(month).to_string_lossy().to_string();
    let date = Path::new(&month).join(date).to_string_lossy().to_string();
    let now = now.format("%H:%M:%S").to_string();
    let path = Paths { year, month, date, now };
    path.censor();
    path
}


// 写入日志
//
// @params {String} args[0] 根路径
// @params {String} args[1] 日志类型
// @params {String} args[2] 日志内容
// @params {String} args[3] 文件类型
// @returns {Boolean}
fn write (mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let dirname = cx.argument::<JsString>(0)?.value();
    let types = cx.argument::<JsString>(1)?.value();
    let log = cx.argument::<JsString>(2)?.value();
    let path = get_paths(dirname);
    let body = path.format(types, log);
    let mut file = fs::OpenOptions::new().read(true).append(true).open(&path.date).unwrap();
    file.write_all(&body.into_bytes()).unwrap();
    Ok(cx.boolean(true))
}


// 读取目录
// @params {String} args[0] 路径
// @returns {Array}
fn read_dir (mut cx: FunctionContext) -> JsResult<JsArray> {
    let dirname = cx.argument::<JsString>(0)?.value();
    let mut len: u32 = 0;
    let mut dirs: Vec<String> = Vec::new();
    for entry in fs::read_dir(dirname).unwrap() {
        let name = entry.unwrap().file_name().into_string().unwrap();
        &dirs.push(name);
        len += 1;
    }
    let arrays = JsArray::new(&mut cx, len);
    for (index, value) in dirs.iter().enumerate() {
        let jstr = cx.string(value);
        arrays.set(&mut cx, index as u32, jstr).unwrap();
    }
    Ok(arrays)
}


// 读取日志
//
// @params {String} args[0] 路径
// @params {String} args[1] skip
// @params {String} args[2] limit
// @returns {String}
fn read_file (mut cx: FunctionContext) -> JsResult<JsString> {
    let filename = cx.argument::<JsString>(0)?.value();
    let skip = cx.argument::<JsNumber>(1)?.value() as u64;
    let limit = cx.argument::<JsNumber>(2)?.value() as u64;
    assert!(limit > 0);
    let mut buf = vec![0u8; limit as usize];
    let mut file = File::open(filename).unwrap();
    file.seek(SeekFrom::Start(skip)).unwrap();
    file.take(limit).read(&mut buf).unwrap();
    Ok(cx.string(String::from_utf8_lossy(&mut buf)))
}


// export
register_module!(mut cx, {
    cx.export_function("write", write)?;
    cx.export_function("readFile", read_file)?;
    cx.export_function("readDir", read_dir)?;
    Ok(())
});