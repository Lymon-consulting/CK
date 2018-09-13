import { Template } from 'meteor/templating';
 
import { People } from '../api/people.js';
 
import './person.html';
 
Template.person.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    People.update(this._id, {
      $set: { checked: ! this.checked },
    });
  },
  'click .delete'() {
    People.remove(this._id);
  },
});