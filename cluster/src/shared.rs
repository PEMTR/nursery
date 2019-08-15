use crate::{ Tx, Rx };
use std::collections::HashMap;

struct Shared {
  unix: Vec<(Tx, Rx)>,
  tcp: Vec<(Tx, Rx)>
}