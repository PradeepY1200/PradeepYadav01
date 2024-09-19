if(process.env.NODE_ENV != "production") {
    require('dotenv').config(); 
}
 


// server.js
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const app = express();  
const path = require("path");  
const methodOverride = require("method-override"); 
const ejsmate = require("ejs-mate"); 
const wrapAsync = require("./utils/wrapAsync.js"); 
const ExpressError = require("./utils/ExpressError.js");  
const { wrap } = require("module");
const { listingSchema , reviewSchema } = require("./schema.js");  
const session = require("express-session");
const MongoStore = require('connect-mongo'); 
const flash = require("connect-flash"); 
const passport = require("passport");
const LocalStrategy = require("passport-local"); 
const User = require("./models/user.js"); 





// const Review = require("./models/review.js");  
// const Listing = require("../models/listing.js");  
  
 
const listingRouter = require("./routes/listing.js"); 
const reviewRouter = require("./routes/review.js"); 
const userRouter = require("./routes/user.js");  

  

    
    

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname, "views"));   
app.use(methodOverride("_method")); 
app.use(express.urlencoded({extended: true})); 
app.engine("ejs",ejsmate);  
app.use(express.static(path.join(__dirname, "/public"))); 
 



 
const dbUrl = process.env.ATLASDB_URL;
 
async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connection formed");
    } catch (err) {
        console.error(err);
    }
}

main();  

app.get("/", (req, res) => {
    res.redirect("/listings");
});   

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET ,
    },
    touchAfter: 24 * 3600,
})

store.on("error" , () => {
    console.log("error in mongo session " , err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET , 
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
    }
};





app.use(session(sessionOptions));  
app.use(flash());   

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req,res,next) => {
res.locals.success = req.flash("success"); 
res.locals.error = req.flash("error"); 
res.locals.currUser = req.user; 
next();
}); 

// app.get("/demouser" , async (req , res ) => {
//   let fakeuser = new User({
//     email: "kundan@gmail.com",
//     username: "kundanV760",
//   });

//   let registeredUser = await User.register(fakeuser, "kundan");
//   res.send(registeredUser); 
// });

app.use("/listings" , listingRouter); 
app.use("/listings/:id/reviews", reviewRouter );  
app.use("/", userRouter );   
 
 

 
   
// app.get("/testlisting", async (req, res) => {
//     try {
//         // Correct 
//         let sampleListing = new Listing({
//             title: "my new villa",
//             description: "my house",
//             price: 200,
//             location: "goa",
//             country: "india",
//             image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
//         }); 
  

//         await sampleListing.save();
//         console.log("Sample was created");
//         res.send("Successful working");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error occurred while creating listing");
//     }
// });

app.all("*" , (req ,res , next) => {
   next(new ExpressError(404 , "page not found saar")); 
});

app.use((err , req, res, next) => {
    let { statusCode = 500 , message="unknow occurse" } = err;
 
    // res.status(statusCode).send(message); 
    res.status(statusCode).render("error.ejs" , { message });   
});  
 
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
 