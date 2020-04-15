import { Params } from '/imports/api/params.js';

export const getParam = function(param_name) {
  
  Meteor.subscribe("params");
  var result=null;
  var params = Params.find().fetch();
  if(params!=null && params.length>0){
    result = eval("params[0]."+param_name);
  }
  return result;
};