
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = async  function(req ,res){

    try {
        let myUser =  await  User.findById(req.params.id);

        if(req.user){
            usersFriendships = await User.findById(req.user._id).populate({ 
               path : 'friendships',
               options :  { sort: { createdAt: -1 } },
               populate : {
                   path: 'from_user to_user'
               }})
           }
            let isFriend = false;
            for(Friendships of usersFriendships.friendships ){
                if(Friendships.from_user.id == myUser.id || Friendships.to_user.id == myUser.id ){
                    isFriend = true ;
                    break;
                }
            }

           return res.render('user_profile' , {
            title : "USER PROFILE",
            profile_user: myUser,
            myUser : usersFriendships ,
            isFriend : isFriend
         });

    } catch (err) {
        console.log(err);
        return;
    }

}

module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);

            //now our form is of type multipart so our body parser cannot automatically parse
            // the body contents -> for this we user multer

            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                //only update file if user is sending it   
                //check if a user avatar exists and also check if the avatar 
                //exist check if there is a file at the file location
                //delete the pre existing avatar ->

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.signUp = function(req, res) {
    // in case the user is already signed in this pages should not be assessable
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title : 'SocialCode | Sign Up'
    });
}

module.exports.signIn = function(req, res) {
    // in case the user is already signed in this pages should not be assessable
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title : 'SocialCode | Sign In'
    });
}

//Get User Sign Up Data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}

//Sign In and create a session for the user
module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged in Successfully!!');
    return res.redirect('/');
}

//Sign Out and destroy the session for the user
module.exports.destroySession = function(req, res, next) {
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        req.flash('success', 'You have Logged Out!!');
        return res.redirect('/');
    });
}