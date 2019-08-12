extern crate qstorage;

use qstorage::QStorage;
use std::io::Error;

fn main() -> Result<(), Error> {
    let dirname = String::from("../storage");
    let mut storage = QStorage::new(dirname, 10737418240, 1048576)?;

    storage.ready()?;

    let key = String::from("hello");
    let value = "word".as_bytes().to_vec();

    storage.insert(key.clone(), value)?;
    
    if let Some(data) = storage.get(key)? {
        println!("{}", String::from_utf8_lossy(data.as_slice()));
    }

    storage.closed()?;
    Ok(())
}