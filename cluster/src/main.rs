mod unix_server;

use std::error::Error;
use unix_server::Server;

fn main () -> Result<(), Box<dyn Error>> {
    tokio::run(Server::new("/Users/quasipaa/Desktop/nursery/cluster/unix")?);
    Ok(())
}