const nodeMailer = require('../config/nodemailer');

module.exports.passResetToken = function(token){

    let htmlString = nodeMailer.renderTemplate({token:token} , '/accounts/reset_password.ejs');

    nodeMailer.transporter.sendMail({
        from:"socialcode@development.in",
        to : token.user.email,
        subject: "CODIAL PASSWORD RESET",
        html :htmlString
    }, function(err , info){
        if(err){
            console.log("error in sending password reset mail : " ,err);
            return;
        }

        console.log("Message Sent !" , info);
        return;
    });

}