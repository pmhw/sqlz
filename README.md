# sqlite 链式操作



受到服务端thinkphp 等一些php语言的架构设计编写的sqlite链式操作


你可以不用编写任何sql语句更直观的管理你的数据库


# 安装

```bash

npm i sqlz

```


# 使用示例

```javascript

const { sqlz } = require('sqlz');
const path = require('path');

console.log(sqlz)


/** ...执行 sqlz 时如果不存在该 db 文件会自动进行新建哦！**/

/** 直接调用 传入完整路径 **/
let Db1 = sqlz(path.join(process.cwd(), '/db/sql.db'),'users');
// console.log(Db1)


/**  使用.db 前缀名 调用相应数据库文件 -> 数据库 文件需要存在node 执行目录 db 文件夹 **/
let Db2 = sqlz('sql','users'); 
// console.log(Db2)


/** 接下来可以使用 实例后的 db 进行链式操作了 **/

// 查询条件 
Db1.where('age > 18').where('gender = 1');

// 输出结果
Db1.select().then(res => {
    console.log(res); 
}).catch(err => {
    console.error(err);
});
Db1.clearQuery();

// 分页查询
Db1.page([2,2]);
Db1.select().then(res => {
    console.log(res);
}).catch(err => {
    console.error(err);
});
Db1.clearQuery();

// 查询数量
Db1.where('age > 18')
Db1.count().then(res => {
    console.log(`查询数量: ${res}`)
}).catch(err => {
    console.error(err);
});
Db1.clearQuery();



// 删除
Db1.where('id = 10')

// 执行删除
Db1.delete().then(res => {
    if(!res){
        console.log('删除失败')
    }else{
        console.log('删除成功')
    }
}).catch(err => {
    console.error(err);
});
Db1.clearQuery();



// 返回sql 语句
Db1.where('age > 18').where('gender = 1').page([2,2]);
Db1.sqls()
// 返回 sql 语句
console.log("sql:",Db1.sqls())
Db1.clearQuery();

```