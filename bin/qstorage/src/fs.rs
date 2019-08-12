// QStorage
// Copyright 2019 Mr.Panda <xivistudios@gmail.com>
// MIT License

// use.
use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::io::Error;
use std::path::Path;
use std::fs::Metadata;
use std::fs::OpenOptions;


/// Attempts to open a file in read-only mode.
/// This function will return an error if `Path` does not already exist.
pub fn open (filename: &Path) -> Result<File, Error> {
    let mut option = OpenOptions::new();
    option.read(true);
    option.write(true);
    option.create(true);
    option.truncate(true);
    Ok(option.open(filename)?)
}


/// Attempts to write an entire buffer into this writer.
/// This function will return an error if `Path` does not already exist.
pub fn write (filename: &Path, data: &[u8]) -> Result<(), Error> {
    let mut file = open(filename)?;
    file.write_all(data)?;
    Ok(())
}


/// Read all bytes until EOF in this source, appending them to buf.
/// This function will return an error if `Path` does not already exist.
pub fn read (filename: &Path) -> Result<String, Error> {
    let mut file = open(filename)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

/// Queries metadata about the underlying file.
/// This function will return an error if `Path` does not already exist.
pub fn metadata (filename: &Path) -> Result<Metadata, Error> {
    let file = open(filename)?;
    Ok(file.metadata()?)
}