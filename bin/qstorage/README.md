File system based object storage, can also be used as a persistent KV database.


## Overview

* This is a file system based single-threaded object storage system. Currently, there is no multi-threading support, no read-write locks, and no isolation locks.</br>
* The data is stored as a shard file in the file system. You can define the size of the shard. The fragment content is divided into blocks. Again, you can customize the block size.</br>
* Equivalent to the file system, the data is divided into multiple blocks. When writing, the block index position is recorded. Deleting data marks only the block as invalid and does not delete the block data. When the next data arrives, it writes the failed block, overwriting the old data. The current version does not implement file defragmentation, so there may be invalid data fragmentation, but it does not affect normal use, but it wastes storage space.</br>
* The system does not implement file information, just ordinary KV storage. Note that if you need to store file information, rely on other implementations to store file information.</br>


## Version

* 0.1.0


## Quick start
```rust
extern crate qstorage;

use qstorage::QStorage;
use std::io::Error;

fn main() -> Result<(), Error> {
    let dirname = String::from("./storage");
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
```


## Note
> `closed` Clean up before shutdown.</br>
> This is a required operation. You must do the final cleanup before each shutdown, save the state, you can also call this function each time you need to save the state.</br>
> This operation will write the memory data to the file system.</br>
> For example, listen to the exit event of the process, and then call this function.</br>


## License
[MIT](./LICENSE)
Copyright (c) 2019 Mr.Panda.