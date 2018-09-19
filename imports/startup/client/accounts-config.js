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
        fieldName: 'first-name',
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
        fieldName: 'last-name',
        fieldLabel: 'Apellido Paterno',
        inputType: 'text',
        visible: true,
    }, {
        fieldName: 'last-name2',
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
    }, {
        fieldName: 'country',
        fieldLabel: 'País',
        inputType: 'select',
        showFieldLabel: true,
        empty: 'Por favor selecciona tu país',
        data: [{
            id: 1,
            label: 'México',
            value: 'mx'
          }, {
            id: 2,
            label: 'Estados Unidos',
            value: 'us',
        }],
        visible: true
    }, {
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
  if(error) console.log("Error:" + error);
  FlowRouter.go('home');
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