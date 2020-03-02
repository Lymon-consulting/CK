import { Template } from 'meteor/templating';
import { Industry } from '../api/industry.js';
import { IndustryIndex } from '/lib/common.js';

import './industryList.html';
import '/lib/common.js';

Meteor.subscribe("otherUsers");
Template.industryResults.helpers({
   industryIndex: () => IndustryIndex, // instanceof EasySearch.Index
   inputAttributes: function () {
     return { 
         placeholder: 'Buscar', 
         id: 'searchBox'
      }; 
   },
   logoPicture: function (companyId, size) {
    Meteor.subscribe("allIndustries");
      var url = "";
      var data = Industry.findOne({'_id' : companyId});
      if(data!=null && data.companyLogoID!=null){
        url = Meteor.settings.public.CLOUDINARY_RES_URL + "w_"+size+",c_limit/" + data.companyLogoID;
      }
     return url;
    },
   getIndustryType(){
        var type = new Array();
        type.push("Agencia de Casting");
        type.push("Casa Productora");
        type.push("Festival");
        type.push("Renta de Equipo");
        return type;
     },
     getIndustryYear(){
        var years = new Array();

        for(i=2018; i>1970; i--){
          years.push(i);
        }
        return years;
     },
     typeSelected: function(value){
        var ptype = "";
        if(Session.get("type_selected")!=null){
           ptype = Session.get("type_selected");
        }
        else{
          ptype = "cualquier";
        }
        return (ptype === value) ? 'selected' : '' ;
      },
      yearSelected: function(value){
        var pyear = "";
        if(Session.get("year_selected")!=null){
          pyear = Session.get("year_selected");
        }
        else{
          pyear = "cualquier";
        }
        return (pyear === value) ? 'selected' : '' ;
      }

   
});

Template.industryResults.events({
   'click #buscarBtn': function(event, template) {
      //event.preventDefault();
      console.log("Si entra");
      var e = jQuery.Event("keyup");
      e.keyCode = $.ui.keyCode.ENTER;
      $("#searchBox").trigger(e);

   },
   'change #tipoPersona': function(event,template){
      event.preventDefault();
      var newValue = $(event.target).val();
      if(newValue==="Personas"){
        FlowRouter.go('/peopleList');
      }
      else if(newValue==="Proyectos"){
        FlowRouter.go('/projList');
      }
   },
   'change #type': function (e) {
      if($(e.target).val()!="cualquier"){
         IndustryIndex.getComponentMethods().addProps('company_type', $(e.target).val());
         Session.set("type_selected",$(e.target).val());
      }
      else{
         IndustryIndex.getComponentMethods().removeProps('company_type');  
         Session.set("type_selected",null);
      }
  },
  'change #year': function (e) {
      if($(e.target).val()!="cualquier"){
         IndustryIndex.getComponentMethods().addProps('company_year', $(e.target).val());
         Session.set("year_selected",$(e.target).val());
      }
      else{
         ProjectIndex.getComponentMethods().removeProps('company_year');  
         Session.set("year_selected",null);
      }
  }
   
});

