const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// const dbs = new sqlite3.Database(process.cwd() + '/pue.db');

// const file = '../module';
// const __FILES = [];
// fs.readdir(file, (err, res) => {
//     if (err) {
//         console.error(err);
//         return;
//     }

//     res.forEach(r => {
//         const filePath = path.join(file, r);
//         if (fs.statSync(filePath).isFile()) {
//             const name = path.parse(r).name;
//             // console.log(name);
//             __FILES.push(name);
//         }
//     });
// });

class Db {
    constructor(fileDb,tableName) {
        // if (__FILES.includes(tableName)) {
        //     throw new Error(` ${tableName} 表不存在`);
        // }

        this.dbs = '';
        const __FILES = [];

        let file = process.cwd() + '/db'

        if (path.isAbsolute(fileDb)) {
            // console.log(1)
            this.dbs = new sqlite3.Database(fileDb);
        } else {
            // console.log(2)
            fs.readdir(file, (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
    
                res.forEach(r => {
                    const filePath = path.join(file, r);
                    // console.log(filePath)
                    if (fs.statSync(filePath).isFile()) {
                        const name = path.parse(r).name;
                        if (name === fileDb) {
                         
                            this.dbs = new sqlite3.Database(file + `/${fileDb}.db`);
                        }
                    }
                });
            });
        }

        this.sql =  ``;
        this.query = {
            table: tableName,
            wheres: [],
            order: null,
            limit: null
        };
    }
    
    where = (wheres) => {
        this.query.wheres.push(wheres);
        return this;
    }

    order = (orderBy) => {
        this.query.order = orderBy;
        return this;
    }

    limit = (limit) => {
        this.query.limit = limit;
        return this;
    }

    page = (page) => {
        this.query.page = page;
        return this;
    }

    offset = (offset) => {
        this.query.offset = offset;
        return this;
    }

    delete = async () => {
        this.sql = `DELETE FROM ${this.query.table}`;

        if (this.query.wheres.length > 0) {
            this.sql += ` WHERE ${this.query.wheres.join(' AND ')}`;
        }  
        // console.log(`[SLQ]`,this.sql);
        return new Promise((resolve, reject) => {
            this.dbs.run(this.sql, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    count = async () => {
        this.sql = `SELECT count(*) FROM ${this.query.table}`;
    
        if (this.query.wheres.length > 0) {
            this.sql += ` WHERE ${this.query.wheres.join(' AND ')}`;
        }
    
        return new Promise((resolve, reject) => {
            this.dbs.get(this.sql, (err, row) => {
                console.log(this.sql, row); // 调试输出
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row['count(*)'] : 0); // 注意这里的字段名
                }
            });
        });
    }

    select =  async () => {

        this.sql = `SELECT * FROM ${this.query.table}`

        if (this.query.wheres.length > 0) {
            this.sql += ` WHERE ${this.query.wheres.join(' AND ')}`;
        }

        if (this.query.order) {
            this.sql += ` ORDER BY ${this.query.order}`;
        }

        if (this.query.limit) {
            this.sql += ` LIMIT ${this.query.limit}`;
        }

        if (this.query.offset !== undefined && this.query.offset !== null) {
            this.sql += ` OFFSET ${this.query.offset}`;
        } else if(this.query.page !== undefined && this.query.page.length === 2){
            let [page,pageSize] = this.query.page
            if(page > 0 && pageSize > 0){
                let offset = (page - 1) * pageSize
                this.sql +=` LIMIT ${pageSize} OFFSET ${offset}`;
            }
        }

        // console.log(`[SLQ]`,this.sql);
        // console.log("[dbs]",dbs)
        return new Promise((resolve, reject) => {
            this.dbs.all(this.sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
                // dbs.close();
            });
        });
    }

    sqls = () => {
        
        this.sql = `SELECT * FROM ${this.query.table}`

        if (this.query.wheres.length > 0) {
            this.sql += ` WHERE ${this.query.wheres.join(' AND ')}`;
        }

        if (this.query.order) {
            this.sql += ` ORDER BY ${this.query.order}`;
        }

        if (this.query.limit) {
            this.sql += ` LIMIT ${this.query.limit}`;
        }

        if (this.query.offset !== undefined  && this.query.offset !== null) {
            this.sql += ` OFFSET ${this.query.offset}`;
        } else if(this.query.page !== undefined && this.query.page.length === 2 ){
            let [page,pageSize] = this.query.page
            if(page > 0 && pageSize > 0){
                let offset = (page - 1) * pageSize
                this.sql +=` LIMIT ${pageSize} OFFSET ${offset}`;
            }
        }

        return this.sql;
    }

    clearQuery() {
        // this.sql = ''
        this.query.wheres = [];
        this.query.order = null;
        this.query.limit = null;
        this.query.offset = null;
        this.query.page = null;
    }
}

module.exports = Db;