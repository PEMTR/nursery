// mod shared;
mod unix_server;

use std::error::Error;
use unix_server::Server;
use futures::sync::mpsc;

pub type Tx = mpsc::UnboundedSender<BytesMut>;
pub type Rx = mpsc::UnboundedReceiver<BytesMut>;

fn main () -> Result<(), Box<dyn Error>> {
    tokio::run(Server::new("/mnt/d/project/nursery/cluster/unix")?);
    Ok(())
}