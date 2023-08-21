const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    friendships :[{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Friendship'
    }]
}, {
    timestamps: true
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
         //".filename" refers to "avatar" field in Schema
        //"file.fieldname" means filename will be "avatar-date" eg-> avatar-1438433
        cb(null, file.fieldname + '-' + Date.now());
    }
});

//MULTER saves the image file weird format, ie without extension like '.jpg' in the 'uploads' folder
// Since, It would be trivial for anyone to overwrite any file on the server
// by sending that same file name up. Also, it would cause problems if a user happens
// to upload a file with the same name as another file. Eg-> a hacker can send a file with avatername.jpg
//Hence MULTER saves the image without extension
//If you want file saves with extension then write this code :
//
// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(__dirname, '..', AVATAR_PATH));
//     },
//     filename: function (req, file, cb) {
//         fileExtension = file.originalname.split('.')[1];
//         cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension);
//     }
// });


// static functions/methods
//".single" is to make sure only one file is uploaded for field name "avatar"
userSchema.statics.uploadedAvatar = multer({storage:  storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;



const User = mongoose.model('User', userSchema);

module.exports = User;