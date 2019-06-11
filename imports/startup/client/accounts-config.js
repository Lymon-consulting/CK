import { Accounts } from 'meteor/accounts-base';

/*
Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY', //Soporta USERNAME_AND_EMAIL, USERNAME_AND_OPTIONAL_EMAIL, USERNAME_ONLY y EMAIL_ONLY
});
*/

accountsUIBootstrap3.setLanguage('es'); // for Spanish

Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'name',
        fieldLabel: 'Nombre',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Escribe tu nombre");
            return false;
          } else {
            return true;
          }
        }
    }, {
        fieldName: 'lastname',
        fieldLabel: 'Apellido Paterno',
        inputType: 'text',
        visible: true,
    }, {
        fieldName: 'lastname2',
        fieldLabel: 'Apellido Materno',
        inputType: 'text',
        visible: true,
    }, {
        fieldName: 'gender',
        showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
        fieldLabel: 'Género',
        inputType: 'radio',
        radioLayout: 'vertical',    // It can be 'inline' or 'vertical'
        data: [{                    // Array of radio options, all properties are required
         id: 1,                  // id suffix of the radio element
            label: 'Masculino',          // label for the radio element
            value: 'm'              // value of the radio element, this will be saved.
          }, {
            id: 2,
            label: 'Femenino',
            value: 'f',
            checked: 'checked'
        }],
        visible: true
    }, 
    {
        fieldName: 'terms',
        fieldLabel: 'Acepto los términos y condiciones',
        inputType: 'checkbox',
        visible: true,
        saveToProfile: false,
        validate: function(value, errorFunction) {
            if (value) {
                return true;
            } else {
                errorFunction('Debes aceptar los términos y condiciones');
                return false;
            }
        }
    }]
});

accountsUIBootstrap3.logoutCallback = function(error) {
  if(error) {
    console.log("Error:" + error);
    Bert.alert({message: 'Se produjo un error durante el registro, contacte al administrador', type: 'error', icon: 'fa fa-times'});
  }
  else{
    FlowRouter.go('home');   
    Bert.alert({message: 'El usuario ha sido creado de forma exitosa', type: 'success', icon: 'fa fa-check'});
  }
}

/*
Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes'],
    github: ['user', 'repo']
  },
  requestOfflineToken: {
    google: true
  },
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});
*/