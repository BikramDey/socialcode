{
$(document).on('click', '#friend-toggle', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    let self = this;

    $.ajax({
        type: 'GET',
        url: $(self).attr('href'),
        success: function(data){
            let theMessage;
            if(data.data.friendshipStatus){
                theMessage = "Friend Added !";
                $('#friend-toggle').html('Remove Friend');
            }else{
                theMessage = "Friend Removed !";
                $('#friend-toggle').html('Add Friend');

            }
            new Noty({
                theme : 'relax' , 
                text: theMessage,
                type: 'success',
                layout : 'topRight',
                timeout : 1500
                
            }).show();

        }, error: function(err){
            console.log("error in toggling friend !" , err);
            new Noty({
                theme : 'mint' , 
                text: "Cant Update Friend !",
                type: 'error',
                layout : "topRight",
                timeout : 1500
                
            }).show();
        }
        
    });
})

}