const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
  
const { isLoggedIn , isOwner, validateListing} = require("../middleware.js"); 
const { listingSchema } = require("../schema.js"); 
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
 
 
const listingController = require("../controllers/listings.js"); 

const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });  
 
router.route("/") 
.get(wrapAsync(listingController.index)) 
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);
 
   
//index routes   
// router.get("/", wrapAsync(listingController.index)); 

//create routes
// router.post("/", isLoggedIn ,validateListing, wrapAsync(listingController.createListing)
// );

//new routes 
router.get("/new", isLoggedIn ,listingController.renderNewForm);


 
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  
  .put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)) 
  
    .delete(
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.destroyListing))



// //show routes 
// router.get("/:id", wrapAsync(listingController.showListing));     
 
//update routes  
// router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.updateListing));  
 
//delete routes 
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing)); 
 


//edit routes
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;  