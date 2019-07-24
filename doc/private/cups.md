# 水杯路由
> 获取操作水杯列表信息以及关联信息.


### 获取用户水杯列表信息
> /private/cup/all

* `method` GET</br>
* `success`
```js
[
    {
        "_id": "5d352d74337dcc22f37d0a91",
        "cup": {
            "code": "51dd0294-2e72-4c94-81b3-0d4fa7bfa1ec",  // 编号
            "expires": 1595301832026,  // 到期时间
            "avatar": "/avatar.jpg",  // 头像
            "username": "王富贵"   // 水杯名
        },
        "water": {
            "number": 200,  // 饮水量
            "count": 2  // 饮水次数
        }
    }
]
```

### 用户设置水杯提醒
> /private/cup/:cups/notice/:boolean

* `method` PUT.</br>
* `success`
```js
true || false // 更新成功/失败
```