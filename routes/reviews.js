const express = require('express');
const router = express.Router({mergeParams:true});

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const {reviewSchema} = require('../schemas.js');


const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

router.post('/', validateReview, catchAsync( async (req,res)=>{
    const c = await Campground.findById(req.params.id);
    const r  = new Review(req.body.review);
    c.reviews.push(r);
    await r.save();
    await c.save();
    res.redirect(`/campgrounds/${c._id}`);
}))


router.delete('/:reviewid', catchAsync( async(req,res)=>{
    const {id,reviewid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findById(reviewid);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;