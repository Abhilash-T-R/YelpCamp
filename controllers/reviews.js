const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req,res)=>{
    const c = await Campground.findById(req.params.id);
    const r  = new Review(req.body.review);
    r.author = req.user._id;
    c.reviews.push(r);
    await r.save();
    await c.save();
    req.flash('success','Created new review!');
    res.redirect(`/campgrounds/${c._id}`);
}
module.exports.deleteReview = async(req,res)=>{
    const {id,reviewid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findById(reviewid);
    req.flash('success','Successfully deleted a review!')
    res.redirect(`/campgrounds/${id}`);
}