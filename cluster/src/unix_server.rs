use tokio::net::UnixListener;
use tokio::net::UnixStream;
use futures::sync::mpsc;
use std::error::Error;
use tokio::prelude::*;
use bytes::BytesMut;

pub type Tx = mpsc::UnboundedSender<BytesMut>;
pub type Rx = mpsc::UnboundedReceiver<BytesMut>;

struct Socket {
    stream: UnixStream,
    tx: Tx,
    rx: Rx
}

impl Socket {
    fn new (stream: UnixStream) -> Self {
        let (tx, rx) = mpsc::unbounded();
        Self { stream, tx, rx }
    }
}

impl Future for  Socket {
    type Item = ();
    type Error = ();

    fn poll (&mut self) -> Poll<Self::Item, Self::Error> {
        let mut buf = BytesMut::with_capacity(512);
        while let Ok(Async::Ready(len)) = self.stream.read_buf(&mut buf) {
            if len == 0 {
                return Ok(Async::Ready(()));
            } else {
                buf.truncate(len);
                self.tx.unbounded_send(buf.clone()).unwrap();
            }
        }

        Ok(Async::NotReady)
    }
}

pub struct Server {
    listener: UnixListener
}

impl Server {
    pub fn new  (path: &'static str) -> Result<Self, Box<dyn Error>> {
        let listener = UnixListener::bind(path)?;
        Ok(Self { listener })
    }
}

impl Future for Server {
    type Item = ();
    type Error = ();

    fn poll (&mut self) -> Poll<Self::Item, Self::Error> {
        while let Ok(Async::Ready((stream, _))) = self.listener.poll_accept() {
            tokio::spawn(Socket::new(stream));
        }

        Ok(Async::NotReady)
    }
}