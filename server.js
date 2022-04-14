const http = require('http');
const fs = require('fs')
const path = require('path');
const csv = require('csv-parser')

const PORT = process.env.PORT || 8000;

// все файлы в папке csv
// их использую для запроса
const csvfolder = path.join(__dirname,'csv');
const valid_query = fs.readdirSync(csvfolder)

const server = http.createServer((req,res)=>{

    // проверка запроса
    if(!valid_query.find(file => file === path.basename(req.url)+'.csv')){
        res.writeHead(404,{
            'Content-type': 'application/json',
        });
        res.end(JSON.stringify({}));

    } else {
        let filepath = path.join(__dirname,'csv',path.basename(req.url)+'.csv');

        res.writeHead(200,{
            'Content-type': 'application/json',
        })
        const buffer = [];

        fs.createReadStream(filepath)
        .pipe(csv())
        .on('data', (data) => buffer.push(data))
        .on('end', () => {
            res.end(JSON.stringify(buffer));
        });
        
    }
    
})

server.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})