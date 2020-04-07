import { Template } from 'meteor/templating';
import { Ocupation } from '../api/ocupations.js';
import { City } from '../api/city.js';
import { Project } from '../api/project.js';
import { Media } from '../api/media.js';
import { UsersIndex } from '/lib/common.js';

import './searchCastForProject.html';
import '/lib/common.js';

Template.searchCastForProject.rendered = function(){
  UsersIndex.getComponentMethods().addProps('profileType', 'cast');
  Session.set("selected_category",null);
}

Meteor.subscribe("otherUsers");
Template.searchCastForProject.helpers({
   usersIndex: () => UsersIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
       placeholder: 'Buscar', 
       id: 'searchBox'
     }; 
   },
   searchCount: () => {
    // index instanceof EasySearch.index
    let dict = UsersIndex.getComponentDict(/* optional name */);

    // get the total count of search results, useful when displaying additional information
    return dict.get('count')
   },
   getName(userId){
      var name = "";
      var user = Meteor.users.findOne({'_id':userId});
      if(user){
        if(user.showArtisticName){
          name = user.artistic;
        }
        else{
          if(user.profile.name!=null && user.profile.name!=""){
            name = user.profile.name;  
          }
          if(user.profile.lastname!=null && user.profile.lastname!=""){
            name = name + " " + user.profile.lastname;
          }
          if(user.profile.lastname2!=null && user.profile.lastname2!=""){
            name = name + " " + user.profile.lastname2;
          }
        }
      }
      return name;
    },
   getAllOcupations(){
    return Ocupation.find({},{sort:{"secondary":1}}).fetch();
  },
  categories(userId){
      var strResult = "";
      var user = Meteor.users.findOne({'_id': userId});
      var result = new Array();
      
      if(user && user.categories){
         result = user.categories;
         for (var i = 0; i < result.length; i++) {
           strResult = strResult + ", " + result[i];
         }
         strResult = strResult.substring(2,strResult.length);
      }
      return strResult;      
   },
  getAvailableYears(){
   var years = new Array();

   for(i=2018; i>1970; i--){
     years.push(i);
   }
   return years;
 },
 getCitiesFromCountries(){
  return City.find({'country': 'México'},{sort:{'city':1}}).fetch(); 
},
profilePicture(userId){
  return Images.find({'owner': userId});
},
notSameUser(userId){
  val = true;
  if(userId=== Meteor.userId()){
   val = false;
 }
 return val;
},
getCategories(){
   var data = Ocupation.find({},{sort:{'title':1}}).fetch();
   return _.uniq(data, false, function(transaction) {return transaction.title});
 },
 getOcupationsFromCategory(){
  var allOcupations;
  if(Session.get("selected_category")!=null){
    allOcupations = Ocupation.find({'title': Session.get("selected_category")}).fetch();
    if(Session.get("selected_category")==="Dirección"){
      allOcupations.push({'title':'Dirección', 'secondary':'Director'});
    }
    else if(Session.get("selected_category")==="Producción"){
      allOcupations.push({'title':'Producción', 'secondary':'Productor'});
    }
  }
  else{
    allOcupations = Ocupation.find({'title': "Animacion y arte digital"}).fetch();
  }
  return allOcupations;
},
getCountries(){
 var data = City.find().fetch();
 return _.uniq(data, false, function(transaction) {return transaction.country});
},
getStatesFromCountries(){
  var country;
  if(Session.get("selected_country")!=null){
    country = City.find({'country': Session.get("selected_country")}).fetch();
    return _.uniq(country, false, function(transaction) {return transaction.state});
  }
  else{
   country = City.find({'country': 'México'}).fetch(); 
   return _.uniq(country, false, function(transaction) {return transaction.state});
 }

},
getCitiesFromStates(){
  if(Session.get("selected_state")!=null){
    return City.find({'state': Session.get("selected_state")}).fetch();
  }
  else{
    if(Meteor.user() && Meteor.user().state){
      return City.find({'state': Meteor.user().state}).fetch();    
    }
    else{
      return City.find({'state': 'Aguascalientes'}).fetch();    
    }
  }
},
getProjectName(){
  var project = Project.findOne({'_id': FlowRouter.getParam('id')});
  var name = "";
  if(project!=null){
    name = project.project_title;
  }
  return name;
},
getProjectID(){
  return FlowRouter.getParam('id');
},
checkParticipation(userId){
    Meteor.subscribe('myProjects');
    var project = Project.findOne({'_id': FlowRouter.getParam('id')});
    var result="";
    if(project){
      var cast = project.project_cast;
      if(cast!=null && cast.length>0){
        for (var i = cast.length - 1; i >= 0; i--) {
          if(cast[i]._id === userId){
            result="checked";
            break;
          }
        }
      }

      if(userId === project.userId){
        result="checked";
      }
    }
    return result;
  },
  getRole(userId){
    Meteor.subscribe('myProjects');
    var project = Project.findOne({'_id': FlowRouter.getParam('id')});
    var result=false;
    if(project){
      var cast = project.project_cast;
      if(cast!=null && cast.length>0){
        for (var i = cast.length - 1; i >= 0; i--) {
          if(cast[i]._id === userId){
            result=true;
            break;
          }
        }
      }
      
    }
    return result;
  },
/*   personalCover(userId){
      Meteor.subscribe("personalcover");
      return PersonalCover.find({'owner': userId});
    },*/
    showButtonFollow(follow){
      var following = Meteor.users.find({$and : [ {'_id' : Meteor.userId()} , {"follows": follow }]});

      var found = true;
      if(following.count() > 0){
       found = false;
     }
     return found;
   },
   getRoleSelected: function(value){
    var prole = "";
    if(Session.get("role_selected")!=null){
      prole = Session.get("role_selected");
    }
    else{
      prole = "cualquier";
    }
    return (prole === value) ? 'selected' : '' ;
  },
  getLocationSelected: function(value){
    var plocation = "";
    if(Session.get("location_selected")!=null){
      plocation = Session.get("location_selected");
    }
    else{
      plocation = "cualquier";
    }
    return (plocation === value) ? 'selected' : '' ;
  },
  getProfilePicture(userId, size) {
    Meteor.subscribe("allMedia");
    var user = Meteor.users.findOne({'_id':userId});
    if(user!=null && user.profilePictureID!=null){
      var profile = Media.findOne({'mediaId':user.profilePictureID});
      if(profile!=null){
        return Meteor.settings.public.CLOUDINARY_RES_URL + "/w_"+size+",h_"+size+",c_thumb,r_max/" + "/v" + profile.media_version + "/" + userId + "/" + user.profilePictureID;    
      }
      
    }
    /*
   var url = "";
   var user = Meteor.users.findOne({'_id':userId});
   if(user.profilePictureID!=null && user.profilePictureID!=""){
    url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",h_"+size+",c_thumb,r_max/" + user.profilePictureID;
  }
  return url;*/
},
getInitials(userId){
  var name = "";
  var lastname = "";
  var initials = "";      
  var user = Meteor.users.findOne({'_id':userId});
  if(user){
    name = user.profile.name;
    lastname = user.profile.lastname;
    initials = name.charAt(0) + lastname.charAt(0);  
  }
  return initials;
},
getCoverPicture(userId, size) {
 Meteor.subscribe("otherUsers");
 var url = "";
 var user = Meteor.users.findOne({'_id':userId});
 if(user.profileCoverID!=null && user.profileCoverID!="undefined"){
  url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_scale/" + user.profileCoverID;
}
return url;
}


});

Template.searchCastForProject.events({
 'click input': function(event) {
    if(event.target.checked){
      $("#sel_"+event.target.value).removeAttr('disabled');
      $("#but_"+event.target.value).removeAttr('disabled');
      $("#but_"+event.target.value).css('background','#ED1567');
    }
    else{
     //console.log("false");
     $("#sel_"+event.target.value).attr('disabled', 'disabled');
     $("#but_"+event.target.value).attr('disabled', 'disabled');
     $("#but_"+event.target.value).css('background','#666');
   }
 },
 'click #pushFollow': function(event, template) {
  event.preventDefault();


      //console.log("Intentando seguir a "+ Session.get('userID'));
      var user = $("#thisUser").val();
      Meteor.users.update(
       {'_id': Meteor.userId()},
       { $push: { 'follows': user } }
       );

      $("#pushFollow").attr("disabled", true);
    },
    'click .pushCollaborator': function(event, template) {
      event.preventDefault();
      var user = event.target.id;
      Session.set("collaborator",user);
      FlowRouter.go('/addCollaborator');
    },
    'click #buscarBtn': function(event, template) {
      //event.preventDefault();
      console.log("Si entra");
      var e = jQuery.Event("keyup");
      e.keyCode = $.ui.keyCode.ENTER;
      $("#searchBox").trigger(e);

    },
    'change #location': function (e) {
      if($(e.target).val()!="cualquier"){
       UsersIndex.getComponentMethods().addProps('city', $(e.target).val());
       Session.set("location_selected",$(e.target).val());
     }
     else{
       UsersIndex.getComponentMethods().removeProps('city');  
       Session.set("role_selected",null);
     }
   },
   'change #role': function (e) {
    if($(e.target).val()!="cualquier"){
     UsersIndex.getComponentMethods().addProps('role', $(e.target).val());
     Session.set("role_selected",$(e.target).val());
   }
   else{
     UsersIndex.getComponentMethods().removeProps('role');  
     Session.set("role_selected",null);
   }
 },
 'click .add_collaborator' : function(e, template, doc){
  e.preventDefault();

  var rol = $( "select#sel_"+e.target.value+" option:checked" ).val();
  var projectId = FlowRouter.getParam('id');
  var userId = e.target.value;

  var user = Meteor.users.findOne({'_id':userId});
  if(user){
    var email="";
    user.emails.forEach(function(element) {
      if(element.address != ""){ 
        email=element.address;
      }
    });

    var name="";
    if(user.profile.name!=null && user.profile.name!=""){
      name = user.profile.name;  
    }
    if(user.profile.lastname!=null && user.profile.lastname!=""){
      name = name + " " + user.profile.lastname;
    }
    if(user.profile.lastname2!=null && user.profile.lastname2!=""){
      name = name + " " + user.profile.lastname2;
    }
    console.log("el colaborador se va a armar con los datos siguientes:");

    var collaborator = {
      "_id" : user._id,
      "email": email,
      "role": rol,
      "name" : name,
      "confirmed": true, /*Cambiar esto para activar las notificaciones*/
      "invite_sent": true /*Cambiar esto para activar las notificaciones*/
    };
    console.log(collaborator);

    var exists = Project.find({$and:[{"_id":projectId},{ project_staff: {$elemMatch:{"email":email,"role":rol}}}]});
    if(exists.count()===0){
      console.log("SE va a agregar al colaborador en el proyecto "+projectId);

      Project.upsert(
       {'_id': projectId},
       { $push: { project_staff: collaborator }
     });
      $("#but_"+e.target.value).html('Invitación enviada');
      $("#but_"+e.target.value).attr('disabled', 'disabled');
      $("#sel_"+e.target.value).attr('disabled', 'disabled');
      $("#chk_"+e.target.value).attr('disabled', 'disabled');
      $("#rem_"+e.target.value).show();
    }
  }
},
 'click .remove_collaborator' : function(e, template, doc){
  e.preventDefault();
  var projectId = FlowRouter.getParam('id');
  var userId = e.target.value;
  var user = Meteor.users.findOne({'_id': userId});
  var name="";
  if(user.profile.name!=null && user.profile.name!=""){
    name = user.profile.name;  
  }
  if(user.profile.lastname!=null && user.profile.lastname!=""){
    name = name + " " + user.profile.lastname;
  }
  if(user.profile.lastname2!=null && user.profile.lastname2!=""){
    name = name + " " + user.profile.lastname2;
  }
  if(confirm("¿Eliminar la colaboración de " + name + " de este proyecto?")){

      var email="";
      user.emails.forEach(function(element) {
        if(element.address != ""){ 
          email=element.address;
        }
      });


      var project = Project.findOne({'_id': projectId});
      var rol="";
      if(project){
        var staff = project.project_staff;
        if(staff!=null && staff!=""){
          for (var i = staff.length - 1; i >= 0; i--) {
            if(staff[i]._id === userId){
              rol=staff[i].role;
              break;
            }
          }
        }
      }

      var collaborator = {
       "email": email,
       "role": rol,
       "name" : name
     };

     Project.upsert(
      {'_id': projectId},
      { $pull: { project_staff: collaborator }
    });

     $("#but_"+e.target.value).html('Enviar invitación');
     $("#sel_"+e.target.value).prop('selectedIndex',0);
     $("#chk_"+e.target.value).prop( "checked", false );
     $("#chk_"+e.target.value).removeAttr('disabled');
     $("#rem_"+e.target.value).hide();
   }


 },
 'click .add_cast' : function(e, template, doc){
  e.preventDefault();

  var projectId = FlowRouter.getParam('id');
  var userId = e.target.value;

  var user = Meteor.users.findOne({'_id':userId});
  if(user){
    var email="";
    user.emails.forEach(function(element) {
      if(element.address != ""){ 
        email=element.address;
      }
    });

    var name="";
    if(user.profile.name!=null && user.profile.name!=""){
      name = user.profile.name;  
    }
    if(user.profile.lastname!=null && user.profile.lastname!=""){
      name = name + " " + user.profile.lastname;
    }
    if(user.profile.lastname2!=null && user.profile.lastname2!=""){
      name = name + " " + user.profile.lastname2;
    }
    console.log("el colaborador se va a armar con los datos siguientes:");

    var collaborator = {
      "_id" : user._id,
      "email": email,
      "name" : name,
      "confirmed": true, /*Cambiar esto para activar las notificaciones*/
      "invite_sent": true /*Cambiar esto para activar las notificaciones*/
    };
    console.log(collaborator);

    var exists = Project.find({$and:[{"_id":projectId},{ project_cast: {$elemMatch:{"email":email}}}]});
    if(exists.count()===0){
      console.log("SE va a agregar al colaborador en el proyecto "+projectId);

      Project.upsert(
       {'_id': projectId},
       { $push: { project_cast: collaborator }
     });
      $("#but_"+e.target.value).html('Invitación enviada');
      $("#but_"+e.target.value).attr('disabled', 'disabled');
      $("#chk_"+e.target.value).attr('disabled', 'disabled');
      $("#rem_"+e.target.value).show();
    }
  }
},
'click .remove_cast' : function(e, template, doc){
  e.preventDefault();
  var projectId = FlowRouter.getParam('id');
  var userId = e.target.value;
  var user = Meteor.users.findOne({'_id': userId});
  var name="";
  if(user.profile.name!=null && user.profile.name!=""){
    name = user.profile.name;  
  }
  if(user.profile.lastname!=null && user.profile.lastname!=""){
    name = name + " " + user.profile.lastname;
  }
  if(user.profile.lastname2!=null && user.profile.lastname2!=""){
    name = name + " " + user.profile.lastname2;
  }
  if(confirm("¿Eliminar la colaboración de " + name + " de este proyecto?")){

      var email="";
      user.emails.forEach(function(element) {
        if(element.address != ""){ 
          email=element.address;
        }
      });

/*
      var project = Project.findOne({'_id': projectId});
      var rol="";
      if(project){
        var cast = project.project_cast;
        if(cast!=null && cast!=""){
          for (var i = cast.length - 1; i >= 0; i--) {
            if(cast[i]._id === userId){
              rol=cast[i].role;
              break;
            }
          }
        }
      }*/

      var collaborator = {
       "email": email,
       "name" : name
     };

     Project.upsert(
      {'_id': projectId},
      { $pull: { project_cast: collaborator }
    });

     $("#but_"+e.target.value).html('Enviar invitación');
     $("#chk_"+e.target.value).prop( "checked", false );
     $("#chk_"+e.target.value).removeAttr('disabled');
     $("#rem_"+e.target.value).hide();
   }


 },
 'change #country': function (e) {
      Session.set("selected_country", e.target.value);
      if($(e.target).val()!="cualquier"){
       UsersIndex.getComponentMethods().addProps('country', $(e.target).val());
       Session.set("country_selected",$(e.target).val());
     }
     else{
       UsersIndex.getComponentMethods().removeProps('country');  
       UsersIndex.getComponentMethods().removeProps('state');  
       UsersIndex.getComponentMethods().removeProps('city'); 
       Session.set("country_selected",null);
     }
   },
   'change #state': function (e) {
    Session.set("selected_state", e.target.value);
    if($(e.target).val()!="cualquier"){
     UsersIndex.getComponentMethods().addProps('state', $(e.target).val());
     Session.set("state_selected",$(e.target).val());
   }
   else{
     UsersIndex.getComponentMethods().removeProps('state');  
     UsersIndex.getComponentMethods().removeProps('city'); 
     Session.set("state_selected",null);
   }
 },
 'change #city': function (e) {
  if($(e.target).val()!="cualquier"){
   UsersIndex.getComponentMethods().addProps('city', $(e.target).val());
   Session.set("city_selected",$(e.target).val());
 }
 else{
   UsersIndex.getComponentMethods().removeProps('city');  
   Session.set("city_selected",null);
 }
},
'change #role': function (e) {
  if($(e.target).val()!="cualquier"){
   UsersIndex.getComponentMethods().addProps('role', $(e.target).val());
   Session.set("role_selected",$(e.target).val());
 }
 else{
   UsersIndex.getComponentMethods().removeProps('role');  
   Session.set("role_selected",null);
 }
},
'change #category':function(e, template){
 e.preventDefault();
 if($(e.target).val()!="cualquier"){
   Session.set("selected_category", $(e.target).val()); 
 }
 else{
   Session.set("selected_category", null);
   UsersIndex.getComponentMethods().removeProps('role');  
   Session.set("role_selected",null);
 }

},

});

