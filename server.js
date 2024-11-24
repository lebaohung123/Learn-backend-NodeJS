const app = require("./src/app");

const PORT = process.env.PORT || 4000

const server = app.listen(PORT, () => {
    console.log("WSV ecommerce server listening on port " + PORT)
});


// process.on("SIGINT", () =>{
//     console.log('Server is destroyed')
// })