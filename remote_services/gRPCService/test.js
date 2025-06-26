const usersClient = require("./client");

usersClient.getAllUsers({}, (error, news) => {
  if (error) {
    console.error(error);
    //throw error;
  }
  console.log(news);
});