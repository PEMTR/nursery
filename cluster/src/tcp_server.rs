use tokio::net::TcpListener;
use tokio::net::TcpStream;
use std::error::Error;
use tokio::prelude::*;
use bytes::BytesMut;

struct Socket {
    socket: TcpStream 
}

impl Future for Socket {
    type Item = ();
    type Error = ();
    fn poll (&mut self) -> Poll<Self::Item, Self::Error> {
        let mut buf = BytesMut::with_capacity(512);
        while let Ok(Async::Ready(len)) = self.socket.read_buf(&mut buf) {
            buf.truncate(len);
            println!("{:?}", String::from_utf8_lossy(&buf));
            let back = BytesMut::from("word");
            self.socket.poll_write(&back).unwrap();
        }

        Ok(Async::NotReady)
    }
}

fn from () -> Result<(), Box<dyn Error>> {
    let addr = "0.0.0.0:8088".parse()?;
    let server = TcpListener::bind(&addr)?
        .incoming()
        .map_err(|e| println!("accept failed = {:?}", e))
        .for_each(|socket| {
            tokio::spawn(Socket { socket });
            Ok(())
        });

    tokio::run(server);
    Ok(())
}