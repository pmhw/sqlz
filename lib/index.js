
const Db = require('./db');

/**
 * sqlz  初始化Db
 * 
 * @name 表名
 * @file 路径名
 * 
 */

function sqlz(name,file = '') {
    return new Db(name, file);
}



module.exports = {
    sqlz
};