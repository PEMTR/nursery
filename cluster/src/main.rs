
use tokio::net::TcpListener;
use tokio::net::tcp::Incoming;
use std::net::SocketAddr;
use std::error::Error;
use futures::prelude::*;
use futures::try_ready;


struct Server {
    addr: SocketAddr,
    listener: Incoming
}


impl Server {
    fn new (address: &'static str) -> Result<Self, Box<dyn Error>> {
        let addr = address.parse()?;
        let listener = TcpListener::bind(&addr)?.incoming();
        Ok(Self { addr, listener })
    }
}


impl Future for Server {
    type Item = ();
    type Error = ();

    fn poll (&mut self) -> Poll<Self::Item, Self::Error> {
        while let Some(stream) = try_ready!(self.listener.poll().map_err(drop)) {
            
        }

        Ok(Async::Ready(()))
    }
}


fn main () -> Result<(), Box<dyn Error>> {
    tokio::run(Server::new("0.0.0.0:8096")?);
    Ok(())
}