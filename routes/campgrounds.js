const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware.js');

router.get("/",catchAsync(async (req, res) => {
    const camp = await Campground.find({});
    res.render("campgrounds/index", { camp });
  })
);
router.get('/new',isLoggedIn, (req,res)=>{
    res.render('campgrounds/new');
})
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req,res,next)=>{
      const c = new Campground(req.body.campground);
      c.author = req.user._id;
      await c.save();
      req.flash('success','Successfully made a new campground');
      res.redirect(`/campgrounds/${c._id}`);
}))
router.get('/:id', catchAsync( async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}))
router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync( async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}))
router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync( async (req,res)=>{
    const c = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground})
    req.flash('success','Successfully updated campground');
    res.redirect(`/campgrounds/${c._id}`);
}))
router.delete('/:id',isLoggedIn, isAuthor, catchAsync( async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground');
    res.redirect('/campgrounds');
}))

module.exports = router;