use tokio::net::UnixDatagram;
use std::error::Error;

pub struct Client {
  socket: UnixDatagram
}

impl Client {
  pub fn new (path: &'static str) -> Result<Self, Box<dyn Error>> {
    let socket = UnixDatagram::unbound()?;
    &socket.connect(path);
    Ok(Self { socket })
  }
}