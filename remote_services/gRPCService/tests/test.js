const usersClient = require("../client");

/*usersClient.getAllUsers({}, (error, users) => {
    if (error) {
      console.error(error);
      //throw error;
    }
    console.log(users);
});
*/
/*
usersClient.getUser({id:'user_2'}, (error, users) => {
    if (error) {
      console.error( error );
    }
    console.log(users);
});
*/
usersClient.upsertUser( {id:'user_2',name:'upserted user 2',email:'new@email.com', admin: true}, (error, users) => {
    if (error) {
      console.error(error);
      //throw error;
    }
    console.log(users);
});
