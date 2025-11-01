const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        // adding extra details of the error
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}
// Index Route
router.get("/",wrapAsync(async (_req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));

// New Route
router.get("/new", (_req,res) =>{
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id",wrapAsync(async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// Create Route
router.post("/",validateListing,wrapAsync(async (req,res,_next) => {
    const listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));

// Edit Route
router.get("/:id/edit" ,wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

// Update Route
router.put("/:id",validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    // const listing = req.body.listing;  //editted listing..
    // await Listing.findByIdAndUpdate(id , {title : listing.title, image : listing.image, price : listing.price, loaction : listing.location, country : listing.country});
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`); //redirected to show route..
}));

// Delete Route
router.delete("/:id" , wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;