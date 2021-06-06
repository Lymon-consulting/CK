import { Template } from 'meteor/templating';
import {termsLegalContent} from '/lib/termsLegalContent.js';
import {privacyLegalContent} from '/lib/privacyLegalContent.js';
import {cookiesLegalContent} from '/lib/cookiesLegalContent';

import './terms.html';


Template.terms.rendered = function(){
    this.autorun(function(){
      window.scrollTo(0,0);
    });
  }

Template.terms.helpers({
    getTerms(){
        return termsLegalContent.content;
    },
    getPrivacy(){
        return privacyLegalContent.content;
    },
    getCookies(){
        return cookiesLegalContent.content;
    }
});

