//! # QStorage.
//! 
//! > File system based object storage, can also be used as a persistent KV database.
//! 
//! * This is a file system based single-threaded object storage system. 
//! Currently, there is no multi-threading support, no read-write locks, 
//! and no isolation locks.
//! 
//! * The data is stored as a shard file in the file system. You can 
//! define the size of the shard. The fragment content is divided into 
//! blocks. Again, you can customize the block size.
//! 
//! * Equivalent to the file system, the data is divided into multiple 
//! blocks. When writing, the block index position is recorded. Deleting 
//! data marks only the block as invalid and does not delete the block 
//! data. When the next data arrives, it writes the failed block, 
//! overwriting the old data. The current version does not implement file 
//! defragmentation, so there may be invalid data fragmentation, but it 
//! does not affect normal use, but it wastes storage space.
//! 
//! * The system does not implement file information, just ordinary 
//! KV storage. Note that if you need to store file information, 
//! rely on other implementations to store file information.
//! 
//! ```
//! extern crate qstorage;
//! 
//! use qstorage::QStorage;
//! use std::io::Error;
//! 
//! fn main() -> Result<(), Error> {
//!     let dirname = String::from("./storage");
//!     let mut storage = QStorage::new(dirname, 10737418240, 1048576)?;
//! 
//!     storage.ready()?;
//! 
//!     let key = String::from("hello");
//!     let value = "word".as_bytes().to_vec();
//! 
//!     storage.insert(key.clone(), value)?;
//!     
//!     if let Some(data) = storage.get(key)? {
//!        println!("{}", String::from_utf8_lossy(data.as_slice()));
//!    }
//!
//!    storage.closed()?;
//!    Ok(())
//! }
//!```
//!

// mod.
mod storage;
mod engine;
mod util;
mod fs;


// use.
use std::io::Error;
use std::io::ErrorKind;
use std::path::Path;
use engine::Engine;
use engine::Index;
use storage::Chunk;


/// ## Object storage instance.
/// 
/// * `path_name` Storage root directory.
/// * `chunk_size` Slice file size.
/// * `block_size` Block size.
/// * `context` Options file descriptor.
/// * `db_context` Indexs file descriptor.
/// * `drop_context` Drop indexs file descriptor.
pub struct QStorage {
    pub path_name: String,
    pub chunk_size: u64,
    pub block_size: u64,
    pub engine: Engine,
    pub path: &'static str,
    pub db_path: &'static str,
    pub drop_path: &'static str
}


impl QStorage {

    /// ## Create an object storage instance.
    /// Initialize an instance with the given configuration.
    /// 
    /// ## example
    /// ```
    /// let dirname = String::from("./storage");
    /// QStorage::new(dirname, 10737418240, 1048576)?;
    /// ```
    pub fn new (dirname: String, chunk_size: u64, block_size: u64) -> Result<Self, Error> {
        let engine = Engine::new(dirname.clone(), chunk_size, block_size);

        Ok(QStorage {
            path_name: dirname,
            chunk_size: chunk_size,
            block_size: block_size,
            drop_path: "drop.index.qs",
            db_path: "db.index.qs",
            path: "index.qs",
            engine: engine
        })
    }

    /// ## Initialization instance.
    /// Preparation before work.
    /// 
    /// ## example
    /// ```
    /// let dirname = String::from("./storage");
    /// QStorage::new(dirname, 10737418240, 1048576)?.ready()?;
    /// ```
    pub fn ready (&mut self) -> Result<&mut Self, Error> {
        self.parse_core()?;
        self.parse_drop()?;
        self.parse_index()?;
        Ok(self)
    }

    /// ## Turn off the storage system.
    /// > Used for shutdown processing.
    /// 
    /// * This is a required operation. You must do the final cleanup 
    /// before each shutdown, save the state, you can also call this 
    /// function each time you need to save the state.
    /// * This operation will write the memory data to the file system.
    /// * For example, listen to the exit event of the process, and then 
    /// call this function. 
    /// 
    /// ## example
    /// ```
    /// let dirname = String::from("./storage");
    /// QStorage::new(dirname, 10737418240, 1048576)?.ready()?.closed()?;
    /// ```
    pub fn closed (&mut self) -> Result<(), Error> {
        self.sync_core()?;
        self.sync_drop()?;
        self.sync_index()?;
        Ok(())
    }

    /// ## Write data to file storage.
    /// Write key pair data to the file system.
    /// 
    /// ## example
    /// ```
    /// let dirname = String::from("./storage");
    /// let mut qstorage = QStorage::new(dirname, 10737418240, 1048576)?.ready()?;
    /// qstorage.insert(String::from("hello"), "word".as_bytes().to_vec())?;
    /// ```
    pub fn insert (&mut self, key: String, value: Vec<u8>) -> Result<(), Error> {
        self.engine.insert(key, value)
    }

    /// ## Retrieve data.
    /// Get data based on the specified key.
    ///
    /// ## example
    /// ```
    /// let dirname = String::from("./storage");
    /// let mut qstorage = QStorage::new(dirname, 10737418240, 1048576)?.ready()?;
    /// qstorage.insert(String::from("hello"), "word".as_bytes().to_vec())?;
    /// qstorage.get(String::from("hello"))?;
    /// ```
    pub fn get (&mut self, key: String) -> Result<Option<Vec<u8>>, Error> {
        self.engine.get(key)
    }

    /// ## Delete data.
    /// Remove data based on the specified key.
    /// 
    /// ## example
    /// ```
    /// let dirname = String::from("./storage");
    /// let mut qstorage = QStorage::new(dirname, 10737418240, 1048576)?.ready()?;
    /// qstorage.insert(String::from("hello"), "word".as_bytes().to_vec())?;
    /// qstorage.remove(String::from("hello"))?;
    /// ```
    pub fn remove (&mut self, key: String) -> bool {
        self.engine.remove(key)
    }

    /// ## Synchronization core configuration.
    /// This function is mainly used to write the list of fragment files 
    /// opened by the current engine to the file system. After persistence, 
    /// it is used as the basis for the next open.
    fn sync_core (&mut self) -> Result<(), Error> {
        let mut data: String = String::new();

        // Traversing the slice group.
        let mut i: usize = 1;
        let len = &self.engine.storage.chunks.len();
        for value in &self.engine.storage.chunks {
            if let Some(context) = &value.context {
                let metadata = context.metadata()?;
                let opt = match i == *len {

                    // Check if the tail is reached, 
                    // if the tail is reached, 
                    // no separator is needed.
                    false => format!("{}-{}+", value.name, metadata.len()),
                    true => format!("{}-{}", value.name, metadata.len())
                };
                
                // Add a spliced unit.
                data.push_str(opt.as_str());
            }

            // Used to record the position 
            // of the current loop.
            i += 1;
        }

        // Write fragmentation information to 
        // the configuration file.
        let dirname = Path::new(&self.path_name);
        fs::write(&dirname.join(&self.path), data.as_bytes())?;

        Ok(())
    }

    /// ## Synchronous index.
    /// The index inside the synchronization engine is cached 
    /// in memory, and the in-memory index is persisted in 
    /// the file system.
    fn sync_index (&mut self) -> Result<(), Error> {
        let mut data: String = String::new();

        // Traverse internal index.
        // Splicing into a String unit.
        let mut i: usize = 1;
        let len = &self.engine.indexs.len();
        for (key, value) in &self.engine.indexs {
            let indexs = util::join(value.blocks.clone(), "+");
            let head = format!("{}-{}", key, value.count);
            let index = match i == *len {

                // Check if the tail is reached, 
                // if the tail is reached, 
                // no separator is needed.
                false => format!("{}|{}/", head, indexs),
                true => format!("{}|{}", head, indexs)
            };

            // Add a spliced unit.
            data.push_str(index.as_str());
            i += 1;
        }

        // Write all String units to the file system.
        let dirname = Path::new(&self.path_name);
        fs::write(&dirname.join(&self.db_path), data.as_bytes())?;

        Ok(())
    }

    /// ## Parsing stored index files.
    /// Read the contents of the stored index file, 
    /// format it as index data, and cache it in memory.
    fn parse_index (&mut self) -> Result<(), Error> {
        let dirname = Path::new(&self.path_name);
        let data = fs::read(&dirname.join(&self.db_path))?;
        let values: Vec<&str> = data.split("/").collect();

        // Traversing the indexed String 
        // unit that has been split,
        // Write HashMap.
        for value in values {
            if value.len() > 0 {
                let head_and_indexs: Vec<&str> = value.split("|").collect();
                let head = head_and_indexs[0];
                let index = head_and_indexs[1];
                let name_and_count: Vec<&str> = head.split("-").collect();
                let name = name_and_count[0];
                let count = name_and_count[1];
                let index_str: Vec<&str> = index.split("+").collect();
                let indexs = util::parse(index_str)?; 
                self.engine.indexs.insert(name.to_string(), Index {
                    blocks: indexs,
                    count: match count.parse::<u64>() {
                        Err(_) => return Err(Error::new(ErrorKind::InvalidInput, "parse index error")),
                        Ok(x) => x
                    }
                });
            }
        }

        Ok(())
    }

    /// ## Synchronous invalidation index.
    /// Transfer the invalid fragment index stored in 
    /// memory to the file system for storage.
    fn sync_drop (&mut self) -> Result<(), Error> {
        let dirname = Path::new(&self.path_name);
        let data = util::join(self.engine.drop_blocks.clone(), "+");
        fs::write(&dirname.join(&self.drop_path), data.as_bytes())?;

        Ok(())

    }

    /// ## Parsing invalid fragment index.
    /// Transfer the invalid fragment index stored in 
    /// the file system to the memory.
    fn parse_drop (&mut self) -> Result<(), Error> {
        let dirname = Path::new(&self.path_name);
        let data = fs::read(&dirname.join(&self.drop_path))?;
        if data.len() > 0 {
            let index_arr: Vec<&str> = data.split("+").collect();
            let drops = util::parse(index_arr)?;
            self.engine.drop_blocks = drops;
        }

        Ok(())
    }

    /// ## Analyze core configuration.
    /// Read the list of fragment files stored in the 
    /// file system and details, and transfer them 
    /// to memory.
    fn parse_core (&mut self) -> Result<(), Error> {
        let dirname = Path::new(&self.path_name);
        if fs::metadata(&dirname.join(&self.path))?.len() <= 4 {

            // If the core has not been initialized.
            // Initialize the core.
            self.engine.storage.create()?;
            self.sync_core()?;
        } else {

            // The core has been initialized.
            // read the core configuration.
            let mut chunks: Vec<Chunk> = Vec::new();
            let data = fs::read(&dirname.join(&self.path))?;
            let chunk_arr: Vec<&str> = data.split("+").collect();

            // Traversing the fragment file 
            // String unit.
            for value in chunk_arr {
                let name_and_count: Vec<&str> = value.split("-").collect();
                let name = name_and_count[0];
                let size = match name_and_count[1].parse::<u64>() {
                    Err(_) => return Err(Error::new(ErrorKind::InvalidInput, "parse core error")),
                    Ok(x) => x
                };

                chunks.push(Chunk {
                    name: name.to_string(),
                    context: None,
                    size
                });
            }

            // Initialize the fragment list of the 
            // core storage module.
            self.engine.storage.from(chunks)?;
        }

        Ok(())
    }
}