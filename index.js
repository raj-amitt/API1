const express = require("express");
const users = require("./MOCK_DATA.json")
const fs = require("fs");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended: false}));//this middleware is required to make the data into json format and put it into req.body so it can be accessed and not undefined anymore

//we are making a kind of a hybrid server which if needs to return just a html document then it can do so by simply hitting the /users route and if some other react app etc is making a request to this server then it will return the data in json format by hitting the /api/users route


//routes

app.get('/users',(req,res)=>{
    
    //this will map every user and fetch the users first name, the join operator that i have used will make sure that the resultant document is not comma seperated, and be returned in an unordered list format
    const html  = `
    <ul> 
    ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})//this will return data in html format



//REST API

app.get('/api/users',(req,res)=>{
    return res.json(users);
})//this route will return the data in json format


//that :id below means it is a variable and it can be anything, i named it as id but it can be named anything and still work the same


app
.route('/api/users/:id')
.get((req,res)=>{
    const id = Number(req.params.id);//since by default it does not return a number

    const user = users.find(user => user.id === id);
    
    
    //storing a value in the variable user where we are finding a user whose id is equal to the id that we are passing in the url
    return res.json(user);
})
.patch((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    // Find the index of the user in the array
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ status: "User not found" });
    }

    // Update only the provided fields while keeping other fields unchanged
    users[userIndex] = { ...users[userIndex], ...body };

    // Write the updated data back to MOCK_DATA.json
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ status: "Error updating user" });
        }
        return res.json({ status: "success", updatedUser: users[userIndex] });
    });
})
.delete((req, res) => {
    const id = Number(req.params.id);

    // Filter out the user with the given ID
    const filteredUsers = users.filter(user => user.id !== id);

    if (filteredUsers.length === users.length) {
        return res.status(404).json({ status: "User not found" });
    }

    // Write the updated data back to MOCK_DATA.json
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(filteredUsers), (err) => {
        if (err) {
            return res.status(500).json({ status: "Error deleting user" });
        }
        return res.json({ status: "success", deletedUserId: id });
    });
});


//we are using fsmodule to append the data to the users array and then we are returning the data in json format, issue with the id is that we cant get it to the front end directly so we use the length of data +1 to return the id below
app.post('/api/users',(req,res)=>{
    const body = req.body;
    users.push({...body, id: users.length+1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users),(err,data)=>{
        return res.json({status : "success", id: users.length});
    });
});



app.listen(PORT,() => console.log(`Server has started at PORT:${PORT}`));