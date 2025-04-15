# Homework :

- Initialize git
- .gitignore
- create a remote repo on github
- push all code to remote origin
- play with routes and route extensions ex. /hello, /, hello/2
- order of the routes matter a lot..
- Install postman app and make a workspace /collection>test API call
- Write logic to handle GET, POST, PUT, PATCH, DELETE, API calls and test them on postman
- Explore routing and use of ?, :, +, (), * in the routes
- Use of regex in routes /a/ , /.*fly$/  
- Reading the query params in the routes
- Reading the dynamic routes

- Multiple routes handlers - play with the code
- next()
- next function and errors along with res.send()
- app.use("/route",rH,[rh2,rh3],rH4,rh5)
- Read about middleware and why do we need it ?
- How express JS basically handles requests behind the scenes
- Differences btw app.use() vs app.all() (IMP)
- Write a dummy auth middleware for admin (IMP)
- write a dummy auth middleware for all user routes, except /user/login
- Error Handling using app.use("/",(err,req,res.next)=>{});

- Create a free cluster on MongoDB official website (MongoDB Atlas)
- Install mongoose library.
- Connect your application to the database "<connection-url>"/devTinder
- Call the connectDB function and connect to database before starting application on 3000.
- create a userSchema & userModel.
- create POST/signup API to add data to database.
- push some documents using API calls from postman.
- Error Handling using try, catch - Always remember whenever you interact with database use try,catch.

- JS Object vs JSON (Differences between).
- Add the express.json middleware to your app.
- Make your signup API dynamic to recieve data from the end user(ex-postman or client side).
- User.findOne with dublicates emailID, which object returned.
- API - Get user by email.
- API - Feed API - Get/feed - get all the users from the database.
- create a delete user API.
- Differences between PATCH and PUT.
- API - Update a user.
- Explore the Mongoose Documention for model methods.
- What are options in a Model.findOneAndUpdate method, Explore more about it.
- API - update the user with email Id

- Explore Schema Type options from the Documention.
- add required, unique, lowercase, min, minLength, trim.
- Add default
- Create a custom validate function for gender.
- Improve the DB schema - PUT all appropriate validations on each field in schema. 
- Add timestamps to the useSchema.
- Add API level validation on Patch request & signup post api.
- Data Sanitizing - Add API validation for each field.
- Install validator
- Explore validator library function and Use validator funcs for pass,email,url.
- NEVER TRUST req.body 

- validate data in Signup API.
- Install bcrypt package. - bcrypt.hash and bcrypt.compare.
- Create PasswordHash using bcrypt.hash & save the user is encrupted password.
- Create login API.
- Compare passwords and throw errors if email or password is invalid.

- Install cookie-parser
- Just send a dummy cookie to user
- create GET /profile API and check if you get the cookie back.
- install JSONWEBTOKEN 
- In login API, after email and password validation, create a JWT token and send it to user in cookie.
- Read the cookie inside your profile API and find the logged in user.
- write userAuth middleware
- Add the userAuth middleware in profile API and a new sendConnectionRequest API.
- Set the expiry of JWT token and cookies to 7 Days.
- Create userSchema method to getJWT().(IMP)
- Create userSchema method to comparepassword(passwordInputByUser).

- Explore tinder APIs.
- Create a list of all APIs you can think of in devTinder.
- Group Multiple Routes under respective routers.(V.IMP)
- Read Documention for express.Router().
- Create routes folder for managing auth, profile, request routers.
- Create authRouter, profileRouter, requestRouter.
- Import these routers in app.js.
- Create POST   /logout API.
- Create PATCH /profile/edit.
- Create PATCH /profile/password API => forgot password API.
- Make sure you validate all data in every POST, PATCH, APIs.

- Create connection request schema.
- Send connection request API
- Proper validation of Data.
- Think about all corner cases.
- $or query $and query in mongoose. -  https://www.mongodb.com/docs/manual/reference/operator/query-logical/
- schema.pre("save",function(){}) function.
- Read more about indexes in MongoDB.(imp)
- Why do we need index in DB?
- What is the advantages and disadvantages of creating?
- Read this article about compound index : https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/
- ALWAYS THINK ABOUT CORNER CASES.  
- PUT EFFORTS TO LEARN MORE THAN WHAT YOU KNOW.

- Write code with Proper validation for POST /request/review/:status/:requestId
- Thought process - POST vs GET
- Read about ref and populate https://mongoosejs.com/docs/populate.html
- Create GET /user/requests/received with all the checks
- Create GET GET /user/connections

- Logic for GET /feed API.
- select, skip(), limit().
- Explore the $nin , $and, $ne and other query operators.

# Pagination

 //user should see all the user cards except
        //0. his own card
        //1. his connections
        //2. ignored people
        //3. already sent the connections request
        
        //Example : Rahul = [mark,donald,ms dhoni,virat]
        //R->akshay->rejected   R->Elon->Accepted
        //A ->cant see rahul
        //you can only see people whos card you have never seen before also u cant see yourself also.


# NOTES:

/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)

/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)

/feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)

/feed?page=4&limit=10 => 21-30 => .skip(20) & .limit(10)

skip = (page-1)*limit;