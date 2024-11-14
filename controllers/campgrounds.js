const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
    const camp = await Campground.find({});
    res.render("campgrounds/index", { camp });
}
module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}
module.exports.createCampground = async (req,res,next)=>{
    const c = new Campground(req.body.campground);
    c.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    c.author = req.user._id;
    await c.save();
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${c._id}`);
}
module.exports.showCampground = async(req,res)=>{
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
}
module.exports.renderEditForm = async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}
module.exports.updateCampground = async (req,res)=>{
    const c = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground})
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    c.image.push(...imgs);
    if(req.body.deleteImages)
    {
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
        await c.updateOne({$pull:{image:{filename: {$in: req.body.deleteImages}}}});
    }
    await c.save();
    req.flash('success','Successfully updated campground');
    res.redirect(`/campgrounds/${c._id}`);
}
module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground');
    res.redirect('/campgrounds');
}