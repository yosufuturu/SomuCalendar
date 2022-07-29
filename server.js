
const http = require('http');
const fs = require('fs');
const url = require('url');

const sqlite = require('sqlite3');
const port = 5005;
const host = '127.0.0.1';

let server = http.createServer();

server.on('request', function(req, res)
{

    let urlParam = new URLSearchParams(url.parse(req.url).query);
    let mode = urlParam.get("mode");

    if (/\?mode/.test(url.parse(req.url)["path"]))
    {
        
        const db = new sqlite.Database('./database/data.db', (error) =>
        {
            if (error)
            {
                console.log(error.message);
            }
            else
            {
                db.serialize(() => 
                {
                    db.run('create table if not exists tomoTable(id integer primary key, memo text, date integer)');

                    if ('load' == mode)
                    {
                        db.all('select id, memo from tomoTable where date='+ urlParam.get("dateid"), (err, rows) =>
                        {

                        if (err)
                        {
                            console.log(err.message);
                        }

                        res.writeHead(200, {'content-type': 'application/json'});

                        if (undefined === rows)
                        {
                            res.end(JSON.stringify('none'));
                        }
                        else
                        {
                            let idlist = [];
                            let memolist = [];

                            rows.map((row) => 
                            {
                                idlist.push(row.id);
                                memolist.push(row.memo);
                            });

                            let retData = {
                                id: idlist,
                                memo: memolist
                            };

                            res.end(JSON.stringify(retData));
                        }
    
                        });
    
                    }
                    else if ('delete' == mode)
                    {
                        db.run('delete from tomoTable where id=' + urlParam.get("itemid"));
                        res.end(JSON.stringify('SUCCESS'));
                    }
                    else if ('registed')
                    {
                        try
                        {
                            db.run('insert into tomoTable(memo, date) values("' + urlParam.get("text") + '","'+ urlParam.get("dateid") + '")');

                            db.get('select id from tomoTable where rowid = last_insert_rowid()', (err, rows) =>
                            {
                                if (err)
                                {
                                    console.log(err.message);
                                }
                                res.end(JSON.stringify(rows.id));
                                console.log(err);
                            });

                        }
                        catch (err)
                        {
                            res.end(JSON.stringify('failed'));
                            console.log(err);
                        }
                        
                    }
                });


            }
        });
    }
    else
    {
        let file = '.' + req.url;
        fs.readFile(file, 'utf-8', function(err, data)
        {
            if (err)
            {
                res.writeHead(404, {'Content-type': 'text/html'});
                res.write('<h1>Page Not Found</h1>');
                
                return res.end();
            }
            
            if (/\.html/.test(file))
            {
                res.writeHead(200, {'Content-type': 'text/html'});
            }
            else if (/\.js/.test(file))
            {
                res.writeHead(200, {'Content-type': 'text/javascript'});
            }

            res.write(data);
            res.end();
        
        });
    }

    


});

server.listen(port, host, () =>
{
    console.log("running Server...");
});