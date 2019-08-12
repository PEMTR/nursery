//! Util
//! Tool module.
//! Provide a method for assigning read and write groups.
//! 

// QStorage
// Copyright 2019 Mr.Panda <xivistudios@gmail.com>
// MIT License

// use.
use std::io::Error;
use std::io::ErrorKind;


// types.
pub type WriteGroup = Vec<(u64, u64, u64, u64)>;
pub type ReadGroup = Vec<(u64, u64, u64)>;


/// ## Assign write group.
/// Calculate the slice group that needs to be allocated 
/// by the given limit and the number of bytes skipped. 
pub fn write_group (len: u64, skip: u64, limit: u64) -> WriteGroup {
    let mut group: WriteGroup = Vec::new();
    let mut index = skip / limit;
    let mut postion: u64 = 0;
    let mut len = len.clone();
    let offset = match skip >= limit {
        true => skip - limit,
        false => skip
    };

    // Consider the classification of the first place.
    // If the first bit appears offset.
    // assign an offset to the first bit.
    if offset > 0 {
        let lenght = limit - offset;
        let end = std::cmp::min(len, lenght);
        group.push((index, postion, offset, end));
        postion += lenght;
        index += 1;
        if len >= lenght {
            len -= lenght;
        }
    }

    // loop.
    // Continuous allocation.
    // until the assignment is complete.
    loop {

        // if the remaining number is less than the limit.
        // and the tail is not empty.
        // then think the assignment is complete.
        // all the remaining numbers are assigned to the tail.
        if len < limit && len > 0 {
            group.push((index, postion, 0, len));
        }

        // allocation is complete.
        // end the loop.
        if len < limit {
            break;
        }

        // No other situation.
        // by average distribution.
        // total consumption.
        // offset increases.
        group.push((index, postion, 0, limit));
        postion += limit;
        len -= limit;
        index += 1;
    }

    // return.
    // assigned offset data set.
    group
}


/// ## Assign read group.
/// Calculate the slice group that should be read 
/// with the given limits and offsets.
pub fn read_group (limit: u64, offset: u64, len: u64) -> ReadGroup {
    let mut group: ReadGroup = Vec::new();
    let mut index = offset / limit;
    let mut len = len.clone();
    let start = match offset >= limit {
        true => offset % limit,
        false => offset
    };

    // Consider the first place.
    // If the first bit appears offset.
    // assign an offset to the first bit.
    if start > 0 {
        let lenght = limit - offset;
        let end = std::cmp::min(len, lenght);
        group.push((index, start, end));
        index += 1;
        if len >= lenght {
            len -= lenght;
        }
    }

    // loop.
    // Continuous allocation.
    // until the assignment is complete.
    loop {

        // if the remaining number is less than the limit.
        // and the tail is not empty.
        // then think the assignment is complete.
        // all the remaining numbers are assigned to the tail.
        if len < limit && len > 0 {
            group.push((index, 0, len));
        }

        // allocation is complete.
        // end the loop.
        if len < limit {
            break;
        }

        // No other situation.
        // by average distribution.
        // total consumption.
        // offset increases.
        group.push((index, 0, limit));
        len -= limit;
        index += 1;
    }

    // return.
    // assigned offset data set.
    group
}


/// ## Flattens a slice of T into a single value String, 
/// placing a given separator between each.
/// 
/// ## example
/// ```
/// join(vec![0_u64, 1_u64, 2_u64]);
/// ```
pub fn join (arr: Vec<u64>, split: &'static str) -> String {
    let mut data = String::new();
    let len = arr.len();
    let mut i = 1;
    for value in arr {
        let opt = match i == len {

            // If you go to the end, 
            // you don't need a separator.
            false => format!("{}{}", value, split),
            true => format!("{}", value)
        };

        // Write to the String cache.
        data.push_str(opt.as_str());
        i += 1;
    }

    data
}


/// ## Convert Vec<&str> to Vec<u64>.
/// 
/// ## example
/// ```
/// join("1+2+3".solit("+").collect());
/// ``` 
pub fn parse (arr: Vec<&str>) -> Result<Vec<u64>, Error> {
    let mut data: Vec<u64> = Vec::new();
    for value in arr {
        data.push(match value.parse::<u64>() {
            Err(_) => return Err(Error::new(ErrorKind::InvalidInput, "parse error")),
            Ok(x) => x   
        });
    }

    Ok(data)
}