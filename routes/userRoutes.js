const controller = require("../controllers/userController");
const validateToken = require("../admin").validateToken;
module.exports = (app) => {
    app.get("/", (req, res) => {
        res.send({
            status: 200,
            message: "hello get"
        })
    });
    app.post("/signin", controller.add);
    app.post("/login", controller.login);
    app.put("/update", controller.updateUser);
    app.get("/user/:id?", validateToken, controller.getUser);
    app.get("/users/:id?", validateToken, controller.getUsers);
    app.delete("/delete", controller.deleteUser)
    
}

// :id? le point d'interogation  veut dire que l'id n'est pas obligatoire
// du coups tu peut faire un seul get 

// tu peut faire un seul get avec les querys