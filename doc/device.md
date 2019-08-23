## 消息队列
> 包含队列管道定义以及通信指令


### 取水完成
* `queue` `Devices`</br>
* `model` `produce`</br>
* `transfer` `false`</br>
* `message.type` `0`</br>
* `message.uid` `String` 水杯编号.</br>
* `message.count` `Int64`  饮水总量.</br>

### 更新水杯信息
* `queue` `DevicesCallback`</br>
* `model` `consume`</br>
* `transfer` `false`</br>
* `message.type` `2`</br>
* `message.uid` `String` 水杯编号.</br>
* `message.class` `Int32`</br>
`class == 0` `取水动画`</br>
`class == 1` `取水语音`</br>
`class == 2` `水杯头像`</br>
`class == 3` `水杯信息`</br>
* `message.name` `String` 水杯名称.</br>
* `message.gender` `Int32` 性别.</br>
`gender == 0` `女`</br>
`gender == 1` `男`</br>
`class == 4` `大红花`</br>
* `message.count` `Int32` 数量.</br>

### 