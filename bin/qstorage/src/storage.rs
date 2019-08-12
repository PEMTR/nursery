//! # Chunk.
//! This is a management module for the shard file, 
//! including creating a shard file, initializing 
//! the shard file list, writing the shard file, and 
//! reading the shard file.
//! 

// QStorage
// Copyright 2019 Mr.Panda <xivistudios@gmail.com>
// MIT License

// use.
use super::util;
use std::fs::File;
use std::io::Error;
use std::path::Path;
use std::fs::OpenOptions;
use std::io::BufWriter;
use std::io::BufReader;
use std::io::SeekFrom;
use std::io::Write;
use std::io::Seek;
use std::io::Read;


/// # Chunk.
/// Represents specific information for a single shard file.
/// 
/// * `name` File name.
/// * `size` File size.
/// * `context` File descriptor.
pub struct Chunk {
    pub name: String,
    pub size: u64,
    pub context: Option<File>
}


/// # Storage.
/// Storage management engine for fragment files.
/// 
/// * `chunk_size` Restricted slice file size.
/// * `path_name` The root directory of the file store.
/// * `chunks` List of fragmented files that have been created.
/// * `size` The total bytes of the data that has been written.
pub struct Storage {
    pub chunk_size: u64,
    pub path_name: String,
    pub chunks: Vec<Chunk>,
    pub size: u64
}


impl Chunk {

    /// ## Create a shard instance.
    /// Create a shard instance with the given file name and file length.
    ///
    /// ## example
    /// ```
    /// let filename = String::from("chunk.0.qs");
    /// Chunk::new(filename, 0);
    /// ```
    pub fn new (name: String, size: u64) -> Self {
        Chunk { 
            context: None,
            name: name,
            size: size
        }
    }

    /// ## Create a shard instance.
    /// Create a fragment instance given all fragment structure information.
    /// 
    /// /// ## example
    /// ```
    /// let filename = String::from("chunk.0.qs");
    /// let path = Path::new(&filename);
    /// let mut context = File::open(path);
    /// let metadata = &context.metadata()?;
    /// Chunk::from(filename, *metadata.len(), context);
    /// ```
    pub fn from (name: String, size: u64, context: File) -> Self {
        Chunk {
            context: Some(context),
            name: name, 
            size: size
        }
    }
}


impl Storage {

    /// ## Create a storage instance.
    /// Create a storage instance for a given fragment size limit and file storage root directory.
    /// 
    /// ## example
    /// ```
    /// let chunk_size: u64 = 10737418240;
    /// let path_name = String::from("./storage");
    /// Storage::new(chunk_size, path_name);
    /// ```
    pub fn new (chunk_size: u64, path_name: String) -> Self {
        Storage {
            chunk_size: chunk_size,
            path_name: path_name,
            chunks: Vec::new(),
            size: 0
        }
    }

    /// ## Initialize the storage instance.
    /// Initialize a storage instance for a given fragment file list.
    /// 
    /// ## example
    /// ```
    /// let chunk_size: u64 = 10737418240;
    /// let path_name = String::from("./storage");
    /// let mut storage = Storage::new(chunk_size, path_name);
    /// 
    /// let chunks = vec![
    ///     Chunk::new(String::from("chunk.0.qs"), 0)
    /// ];
    /// 
    /// storage.from(chunks)?;
    /// ```
    pub fn from (&mut self, chunks: Vec<Chunk>) -> Result<(), Error> {
        let dirname = Path::new(&self.path_name);
        for chunk in chunks {
            let filename = dirname.join(&chunk.name);
            let mut options = OpenOptions::new();
            let context = options.read(true).write(true).open(filename)?;
            self.chunks.push(Chunk::from(chunk.name, chunk.size, context));
            self.size += chunk.size;
        }

        Ok(())
    }

    /// ## Create a new shard file.
    /// Create a new shard file based on the existing shard file list.
    /// 
    /// ## example
    /// ```
    /// let chunk_size: u64 = 10737418240;
    /// let path_name = String::from("./storage");
    /// let mut storage = Storage::new(chunk_size, path_name);
    /// 
    /// let chunks = vec![
    ///     Chunk::new(String::from("chunk.0.qs"), 0)
    /// ];
    /// 
    /// storage.from(chunks)?;
    /// storage.create()?;
    /// ```
    pub fn create (&mut self) -> Result<(), Error> {
        let dirname = Path::new(&self.path_name);
        let name = format!("chunk.{}.qs", self.chunks.len());
        let filename = dirname.join(&name);
        let mut options = OpenOptions::new();
        let context = options.read(true).write(true).create(true).open(filename)?;
        self.chunks.push(Chunk::from(name, 0, context));

        Ok(())
    }

    /// ## Write data to the storage file.
    /// Write the given data to the storage system and specify the offset of the write.
    /// 
    /// ## example
    /// ```
    /// let chunk_size: u64 = 10737418240;
    /// let path_name = String::from("./storage");
    /// let mut storage = Storage::new(chunk_size, path_name);
    /// storage.write(vec![0, 1, 2], 0)?;
    /// ```
    pub fn write (&mut self, data: Vec<u8>, start: u64) -> Result<(), Error> {
        let group = util::write_group(data.len() as u64, start, self.chunk_size);

        // Traverse the write group.
        // group write data to the file.
        for (i, p, o, s) in group {

            // Fragment does not exist.
            // Create a new shard.
            if let None = self.chunks.get(i as usize) {
                self.create()?;
            }

            // Write data to file.
            if let Some(chunk) = self.chunks.get(i as usize) {
                if let Some(context) = &chunk.context {
                    if let Some(slice) = data.get(p as usize..s as usize) {
                        let mut file = BufWriter::new(context);
                        file.seek(SeekFrom::Start(o))?;
                        file.write(slice)?;
                        file.flush()?;
                    }
                }
            }
        }

        // The total number of bytes in the global increase the 
        // number of data bytes written this time.
        self.size += data.len() as u64;

        Ok(())
    }

    /// ## Read data.
    /// Reads the specified length of data based on the specified offset.
    ///
    /// ## example
    /// ```
    /// let chunk_size: u64 = 10737418240;
    /// let path_name = String::from("./storage");
    /// let mut storage = Storage::new(chunk_size, path_name);
    /// storage.read(0, 100)?;
    /// ```
    pub fn read (&mut self, offset: u64, len: u64) -> Result<Vec<u8>, Error> {
        let group = util::read_group(self.chunk_size, offset, len);
        let mut bufs: Vec<u8> = Vec::new();
        
        // Traverse the read group, traverse each 
        // slice file by the read group.
        // and merge the read data.
        for (i, o, l) in group {
            if let Some(chunk) = self.chunks.get(i as usize) {
                if let Some(context) = &chunk.context {
                    let mut buf = vec![0u8; (l - o) as usize];
                    let mut file = BufReader::new(context);
                    file.seek(SeekFrom::Start(o))?;
                    file.take(l).read(&mut buf)?;
                    bufs.append(&mut buf);
                }
            }
        }

        // Only return the required length.
        let (left, _) = bufs.split_at(len as usize);
        Ok(left.to_vec())
    }
}