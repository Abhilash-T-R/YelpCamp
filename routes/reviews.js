const express = require('express');
const router = express.Router({mergeParams:true});

const Campground = require('../models/campground');
const Review = require('../models/review');
const {validateReview} = require('../middleware.js');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const {reviewSchema} = require('../schemas.js');

router.post('/', validateReview, catchAsync( async (req,res)=>{
    const c = await Campground.findById(req.params.id);
    const r  = new Review(req.body.review);
    c.reviews.push(r);
    await r.save();
    await c.save();
    req.flash('success','Created new review!');
    res.redirect(`/campgrounds/${c._id}`);
}))


router.delete('/:reviewid', catchAsync( async(req,res)=>{
    const {id,reviewid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findById(reviewid);
    req.flash('success','Successfully deleted a review!')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;