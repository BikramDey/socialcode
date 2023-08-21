const Post = require('../models/post');
const User = require('../models/user');



module.exports.home = async function(req, res){

    try{
        // CHANGE :: populate the likes of each post and comment
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('comments')
        .populate('likes');

    
        let users = await User.find({});

        let usersFriendships ;
            
        if(req.user){
            usersFriendships = await User.findById(req.user._id).populate({
            path : 'friendships',
            options :  { sort: { createdAt: -1 } },
            populate : {
                path: 'from_user to_user'
            }})
        }

        return res.render('home', {
            title: "SocialCode | Home",
            posts:  posts,
            all_users: users,
            myUser : usersFriendships
        });

    }catch(err){
        console.log('ERROR -> ', err);
        return;
    }
   
}