// QStorage
// Copyright 2019 Mr.Panda <xivistudios@gmail.com>
// MIT License

// use.
use std::collections::HashMap;
use super::storage::Storage;
use std::io::Error;


/// ## Index information.
/// 
/// * `count` Total index data.
/// * `blocks` Fragment index list.
pub struct Index {
    pub count: u64,
    pub blocks: Vec<u64>
}


/// ## Core storage engine.
/// 
/// * `block_size` Block size.
/// * `drop_blocks` Failed fragment index list.
/// * `indexs` Key value cache.
pub struct Engine {
    pub block_size: u64,
    pub storage: Storage,
    pub drop_blocks: Vec<u64>,
    pub indexs: HashMap<String, Index>
}


impl Engine {

    /// ## Create a core storage engine.
    /// Create an instance with a given slice size.
    /// 
    /// ## example
    /// ```
    /// let dirname = String::from("./storage");
    /// Engine::new(dirname, 10737418240, 1048576);
    /// ```
    pub fn new (dirname: String, chunk_size: u64, size: u64) -> Self {
        let storage = Storage::new(chunk_size, dirname);

        Engine {
            drop_blocks: Vec::new(),
            indexs: HashMap::new(),
            storage: storage,
            block_size: size
        }
    }

    /// ## Write data to file storage.
    /// Write key pair data to the file system.
    /// 
    /// ## example
    /// ```
    /// let dirname = String::from("./storage");
    /// let mut engine = Engine::new(dirname, 10737418240, 1048576);
    /// engine.insert(String::from("hello"), "word".as_bytes().to_vec())?;
    /// ```
    pub fn insert (&mut self, key: String, value: Vec<u8>) -> Result<(), Error> {
        let f_size = value.len() as f64 / self.block_size as f64;
        let block_size = f_size.ceil() as u64;
        let mut value_copy = value.clone();
        let mut block_indexs = Vec::new();
        let mut blocks = Vec::new();
        let mut block_index = 0;
        
        // Split data into individual slices.
        // Split by slice size.
        // Insufficient fragment size default 0 padding.
        let mut i: u64 = 0;
        while i < block_size {
            let mut bufs = Vec::new();

            // Check if the remaining data waiting to be allocated 
            // is already smaller than the slice size.
            if self.block_size <= value_copy.len() as u64 {
                let (left, right) = value_copy.split_at(self.block_size as usize);
                bufs.append(&mut left.to_vec());
                value_copy = right.to_vec();
            } else {
                bufs.append(&mut value_copy);
                bufs.resize(self.block_size as usize, 0);
            }

            // Index overlay.
            // Write the allocated piece of data.
            i += 1;
            blocks.push(bufs);

            // If there is no data to assign.
            // jump out of the loop.
            if value_copy.len() == 0 {
                break;
            }
        }

        // Check if there are invalid fragments.
        // If there is implementation fragmentation.
        // Write failed fragment first.
        // traversing the failed fragmentation iterator.
        let mut iterator = blocks.iter();
        for value in self.drop_blocks.clone().iter() {
            let block = iterator.next();

            // Check if the assignment has ended.
            // If the failed fragment is larger than the written fragment.
            // jump out of the loop.
            if block == None {
                break;
            }

            // increase the index.
            // Increase the index offset.
            if let Some(data) = block {

                // write by byte.
                // If the end has been written.
                // Now empty all unfilled bits to 0.
                self.storage.write(data.clone(), *value)?;
                block_indexs.push(*value);
                block_index += 1;
            }
        }


        // End of fragmentation allocation.
        // Delete the filled invalidation index.
        if block_indexs.len() > 0 {
            let mut atom_drop = Vec::new();
            for value in &self.drop_blocks {
                if !block_indexs.contains(&value) {
                    atom_drop.push(*value);
                }
            }
            
            // Rewriting the failed slice heap.
            self.drop_blocks = atom_drop;
        }

        // Processed failure fragmentation.
        // append to the end of the data area.
        let mut x = block_index as u64;
        while x < blocks.len() as u64 {
            let offset = self.storage.size as u64;
            if let Some(block) = iterator.next() {
                self.storage.write(block.clone(), offset)?;
                block_indexs.push(offset);
            }
            
            x += 1;
        }

        // Cache segmentation information.
        // Cache key pair information.
        self.indexs.insert(key, Index {
            count: value.len() as u64,
            blocks: block_indexs
        });

        Ok(())
    }

    /// ## Retrieve data.
    /// Get data based on the specified key.
    ///
    /// ## example
    /// ```
    /// let dirname = String::from("./storage");
    /// let mut engine = Engine::new(dirname, 10737418240, 1048576);
    /// engine.insert(String::from("hello"), "word".as_slice().to_vec())?;
    /// engine.get(String::from("hello"))?;
    /// ```
    pub fn get (&mut self, key: String) -> Result<Option<Vec<u8>>, Error> {
        let mut black = None;

        // take the shard.
        // Extract data.
        if let Some(option) = self.indexs.get(&key) {
            let count = option.count;
            let blocks = &option.blocks;
            let mut bufs = Vec::new();
            for offset in blocks.iter() {
                let skip = *offset;
                let end = skip + self.block_size;;
                let mut value = self.storage.read(skip, end)?; 
                bufs.append(&mut value);
            }

            // Crop the length of the data, 
            // discard the remaining data.
            let (left, _) = bufs.split_at(count as usize);
            black = Some(left.to_vec());
        }

        Ok(black)
    }

    /// ## Delete data.
    /// Remove data based on the specified key.
    /// 
    /// ## example
    /// ```
    /// let dirname = String::from("./storage");
    /// let mut engine = Engine::new(dirname, 10737418240, 1048576);
    /// engine.insert(String::from("hello"), "word".as_slice().to_vec())?;
    /// engine.remove(String::from("hello"))?;
    /// ```
    pub fn remove (&mut self, key: String) -> bool {
        let mut black = false;
        if let Some(option) = self.indexs.get(&key) {
            for value in option.blocks.iter() {
                self.drop_blocks.push(*value);
            }
            
            // Delete key pair.
            self.indexs.remove(&key);
            black = true;
        }

        black
    }
}
