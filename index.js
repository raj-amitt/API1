const express = require("express");
const users = require("./MOCK_DATA.json")

const app = express();
const PORT = 8000;

//routes



app.get('/api/users',(req,res)=>{
    return res.json(users);
})//this route will return the data in json format

app.get('/users',(req,res)=>{
    const html = `
    <ul> 
    ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})//this will return data in html format


app.listen(PORT,() => console.log(`Server has started at PORT:${PORT}`))