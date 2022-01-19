const http = require("http");
const fs = require("fs");
const port =process.pnv.PORT;
var requests = require("requests");

const homeFile= fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country);
    temperature=temperature.replace("{%tempstatus%}",orgVal.weather.main);
    return temperature;

}

const server=http.createServer((req,res)=>{
     if(req.url=="/"){
       requests(
           "http://api.openweathermap.org/data/2.5/weather?q=kanpur&units=metric&appid=166efe5fbbc66c1059854d689e96ce27",
        
        )
        .on("data",(chunk)=> {
            const objdata=JSON.parse(chunk);
            const arrData=[objdata];
            const realTimeData=arrData.map((val)=>
            replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
            console.log(arrData);
            
            })
        .on("end",(err)=>{
            if(err) return console.log("connection closed due to error",err); 
            res.end();
        });
     }
});
server.listen(port);