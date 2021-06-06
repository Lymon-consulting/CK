export let catHeights = [
  {spec: "1.40 metros o menos"},
  {spec: "1.40 metros – 1.44 metros"},
  {spec: "1.45 metros – 1.49 metros"},
  {spec: "1.50 metros – 1.54 metros"},
  {spec: "1.55 metros – 1.59 metros"},
  {spec: "1.60 metros – 1.64 metros"},
  {spec: "1.65 metros – 1.69 metros"},
  {spec: "1.70 metros – 1.74 metros"},
  {spec: "1.75 metros – 1.79 metros"},
  {spec: "1.80 metros – 1.84 metros"},
  {spec: "1.85 metros – 1.89 metros"},
  {spec: "1.90 metros o mas"}
];

export let catAges = [
  {spec: "Recién nacido o que aparente pocos meses de nacido"},
  {spec: "3 meses a 1 año"},
  {spec: "1 a 3 años"},
  {spec: "3 a 5 años"},
  {spec: "5 a 10 años"},
  {spec: "10 a 15 años"},
  {spec: "15 a 20 años"},
  {spec: "20 a 30 años"},
  {spec: "30 a 40 años"},
  {spec: "40 a 50 años"},
  {spec: "50 a 60 años"},
  {spec: "60 a 70 años"},
  {spec: "Más de 70 años"}
];

export let catPhysical = [
  {spec: "Delgada"},
  {spec: "Esbelta"},
  {spec: "Estándar"},
  {spec: "Deportiva/Muscular"},
  {spec: "Corpulenta"},
  {spec: "Robusta"}
];


export let catEthnics = [
  {spec: "Caucasica"},
  {spec: "Latina"},
  {spec: "Indigena"},
  {spec: "Mulata"},
  {spec: "Afro-descendiente"},
  {spec: "Asiatica"},
  {spec: "Arabe – Oriente Medio"},
  {spec: "Sin definir"}
];

export let catEyes = [
  {spec: "Azules"},
  {spec: "Verdes"},
  {spec: "Marrones"},
  {spec: "Negros"},
  {spec: "Castaños"},
  {spec: "Otro"}
];

export let catHair = [
  {spec: "Rubio"},
  {spec: "Castaño"},
  {spec: "Pelirojo"},
  {spec: "Negro"},
  {spec: "Gris/ canoso"},
  {spec: "Blanco"},
  {spec: "Otro"}
];

export let catHairType = [
  {spec: "Calvo"},
  {spec: "Afro"},
  {spec: "Rizado"},
  {spec: "Lacio"},
  {spec: "Ondulado"},
  {spec: "Rastas"}
];

export let catLanguages = [
  {spec: "Lengua y/o dialecto indigena"},
  {spec: "Inglés"},
  {spec: "Francés"},
  {spec: "Alemán"},
  {spec: "Ruso"},
  {spec: "Portugués"},
  {spec: "Mandarín"},
  {spec: "Árabe"},
  {spec: "Otro"}
];

export let catCategories = [
  {spec: "Actor / Actriz"},
  {spec: "Locutor(a) / doblaje"},
  {spec: "Extra"},
  {spec: "Modelo"},
  {spec: "Bailarín(a)"},
  {spec: "Cantante"},
  
];

export let catTopCategories = [
  {spec: "Director", id: "1000"},
  {spec: "Productor", id:"2000"},
  {spec: "Dueño de negocio", id:"3000"},
  {spec: "Representante de negocio",id:"4000"}
];


/***Inician los objetos y funciones para el manejo de roles de cast*/

export let crewOcupations = [
  
  {
    category: 'Animación y arte digital',
    roles: [
      {roleId: 1, roleName: 'Animador(a) 2d'}, 
      {roleId: 2, roleName: 'Animador(a) 3d'}, 
      {roleId: 3, roleName: 'Artista conceptual'}, 
      {roleId: 4, roleName: 'Artista de composición'}, 
      {roleId: 5, roleName: 'Artista de iluminación'}, 
      {roleId: 6, roleName: 'Artista de layout'}, 
      {roleId: 7, roleName: 'Artista de modelado'}, 
      {roleId: 8, roleName: 'Artista de rigging'}, 
      {roleId: 9, roleName: 'Artista de storyboard (Animacion)'}, 
      {roleId: 10, roleName: 'Artista de textura y sombreado'}, 
      {roleId: 11, roleName: 'Artista matte painting'}, 
      {roleId: 12, roleName: 'Artista maya'}, 
      {roleId: 13, roleName: 'Cinematografo(a) animacion'}, 
      {roleId: 14, roleName: 'Director(a) animación'}, 
      {roleId: 15, roleName: 'Diseñador(a) de escenarios (Animación)'}, 
      {roleId: 16, roleName: 'Diseñador(a) de personajes (Animación)'}, 
      {roleId: 17, roleName: 'Motion capture'}, 
      {roleId: 18, roleName: 'Nuke compositor'}, 
      {roleId: 19, roleName: 'Operador(a) 3D'}, 
      {roleId: 20, roleName: 'Productor(a) animación'}, 
      {roleId: 21, roleName: 'Realidad virtual'}, 
      {roleId: 22, roleName: 'Render Wrangler'}, 
      {roleId: 23, roleName: 'Supervisor CG'}, 
      {roleId: 24, roleName: 'Supervisor(a) de animación'}
    ]
  }, 
  {
    category: 'Arte',
    roles: [
      {roleId: 25, roleName: 'Armero para cine y televisión'}, 
      {roleId: 26, roleName: 'Asistente de arte'}, 
      {roleId: 27, roleName: 'Asistente de coordinación de arte'}, 
      {roleId: 28, roleName: 'Asistente de Utilería'}, 
      {roleId: 29, roleName: 'Asistente decorador de set'}, 
      {roleId: 30, roleName: 'Asistente set designer'}, 
      {roleId: 31, roleName: 'Bodegero(a)'}, 
      {roleId: 32, roleName: 'Carpintero(a)'}, 
      {roleId: 33, roleName: 'Comprador(a)'}, 
      {roleId: 34, roleName: 'Constructor(a)'}, 
      {roleId: 35, roleName: 'Coordinador(a) de arte'}, 
      {roleId: 36, roleName: 'Decorador(a)'}, 
      {roleId: 37, roleName: 'Director(a) de arte'}, 
      {roleId: 38, roleName: 'Diseñador(a) de producción'}, 
      {roleId: 39, roleName: 'Diseñador(a) gráfico arte'}, 
      {roleId: 40, roleName: 'Ecónomo/ Estilista de alimentos'}, 
      {roleId: 41, roleName: 'Escultor(a)'}, 
      {roleId: 42, roleName: 'Herrero(a)'}, 
      {roleId: 43, roleName: 'Leadman'}, 
      {roleId: 44, roleName: 'On set arte'}, 
      {roleId: 45, roleName: 'Pintor(a)'}, 
      {roleId: 46, roleName: 'Prop master'}, 
      {roleId: 47, roleName: 'Set designer'}, 
      {roleId: 48, roleName: 'Swing'}, 
      {roleId: 49, roleName: 'Utilero(a)'}

    ]
  },
  {
    category: 'Casting',
    roles: [
      {roleId: 50, roleName: 'Director(a) de casting'}, 
      {roleId: 51, roleName: 'Casting Extras'}, 
      {roleId: 52, roleName: 'Coordinador(a) cast/ extras'}, 
      {roleId: 53, roleName: 'Asistente de casting'}

    ]
  },
  {
    category: 'Dirección',
    roles: [
      {roleId: 54, roleName: 'Director(a) de casting'}, 
      {roleId: 55, roleName: '1er asistente de dirección (AD)'}, 
      {roleId: 56, roleName: '2nd asistente de dirección (2nd AD)'}, 
      {roleId: 57, roleName: 'Artista storyboard'}, 
      {roleId: 58, roleName: 'Coach actoral'}, 
      {roleId: 59, roleName: 'Continuista/ Script'}, 
      {roleId: 60, roleName: 'Coreógrafo(a)'}, 
      {roleId: 61, roleName: 'Director(a)'}, 
      {roleId: 62, roleName: 'Director(a) creativo'}, 
      {roleId: 63, roleName: 'Director(a) de contenido'}

    ]
  },
  {
    category: 'Diseño',
    roles: [
      {roleId: 64, roleName: 'Director(a) de casting'}, 
      {roleId: 65, roleName: 'Diseñador(a) de títulos/ créditos cine'}, 
      {roleId: 66, roleName: 'Diseñador(a) gráfico cine'}, 
      {roleId: 67, roleName: 'Diseño web cine'}, 
      {roleId: 68, roleName: 'Ilustrador(a) cine'}

    ]
  },
  {
    category: 'Efectos especiales / On set',
    roles: [
      {roleId: 69, roleName: 'Animal wrangler'}, 
      {roleId: 70, roleName: 'Coordinador(a) Picture cars'}, 
      {roleId: 71, roleName: 'Coordinador(a) pirotecnia'}, 
      {roleId: 72, roleName: 'Coordinador(a) SFX'}, 
      {roleId: 73, roleName: 'Coreógrafo(a) peleas/ accion'}, 
      {roleId: 74, roleName: 'Doble/ Stunt'}, 
      {roleId: 75, roleName: 'Greensman/ Jardinero(a) cinematográfico'}, 
      {roleId: 76, roleName: 'Precision driver'}

    ]
  },
  {
    category: 'Fotografía',
    roles: [
      {roleId: 77, roleName: '1er asistente de cámara'}, 
      {roleId: 78, roleName: '2do asistente de cámara'}, 
      {roleId: 79, roleName: 'Data manager'}, 
      {roleId: 80, roleName: 'Director(a) de cámaras'}, 
      {roleId: 81, roleName: 'Director(a) de fotografía'}, 
      {roleId: 82, roleName: 'Director(a) de fotografía acuática/ aérea'}, 
      {roleId: 83, roleName: 'Encargado(a) de cámara'}, 
      {roleId: 84, roleName: 'Foquista'}, 
      {roleId: 85, roleName: 'Fotografía fija'}, 
      {roleId: 86, roleName: 'Fotógrafo(a) naturaleza'}, 
      {roleId: 87, roleName: 'Loader'}, 
      {roleId: 88, roleName: 'Making of'}, 
      {roleId: 89, roleName: 'Operador(a) de cámara'}, 
      {roleId: 90, roleName: 'Operador(a) de drone'}, 
      {roleId: 91, roleName: 'Operador(a) de steadicam'}, 
      {roleId: 92, roleName: 'Operador(a) de video assist'}, 
      {roleId: 93, roleName: 'Supervisor(a) DIT'}

    ]
  },
  {
    category: 'Guión',
    roles: [
      {roleId: 94, roleName: 'Copywriter'}, 
      {roleId: 95, roleName: 'Guionista'}, 
      {roleId: 96, roleName: 'Script doctor'}

    ]
  },
  {
    category: 'Locaciones',
    roles: [
      {roleId: 97, roleName: 'Asistente de locaciones'}, 
      {roleId: 98, roleName: 'Coordinador(a) de locaciones'}, 
      {roleId: 99, roleName: 'Gerente de locaciones'}, 
      {roleId: 100, roleName: 'Scouter'}

    ]
  },
  {
    category: 'Maquillaje / Peinado',
    roles: [
      {roleId: 101, roleName: 'Asistente de maquillaje'}, 
      {roleId: 102, roleName: 'Asistente de peinados'}, 
      {roleId: 103, roleName: 'Maquillaje VFX (Prótesis)'}, 
      {roleId: 104, roleName: 'Maquillista'}, 
      {roleId: 105, roleName: 'Peinador(a)'}

    ]
  },
  {
    category: 'Producción',
    roles: [
      {roleId: 106, roleName: 'Asistente de producción (P.A.)'}, 
      {roleId: 107, roleName: 'Contador(a) de cine'}, 
      {roleId: 108, roleName: 'Coordinador(a) Covid'}, 
      {roleId: 109, roleName: 'Coordinador(a) de producción'}, 
      {roleId: 110, roleName: 'Coordinador(a) de set'}, 
      {roleId: 111, roleName: 'Fixer'}, 
      {roleId: 112, roleName: 'Gerente de producción'}, 
      {roleId: 113, roleName: 'Jefe(a) de producción'}, 
      {roleId: 114, roleName: 'Key P.A.'}, 
      {roleId: 115, roleName: 'Productor(a)'}, 
      {roleId: 116, roleName: 'Productor(a) asociado'}, 
      {roleId: 117, roleName: 'Productor(a) ejecutivo(a)'}, 
      {roleId: 118, roleName: 'Productor(a) en línea'}, 
      {roleId: 119, roleName: 'Runner'}, 
      {roleId: 120, roleName: 'Showrunner'}, 
      {roleId: 121, roleName: 'Trainee'}, 
      {roleId: 122, roleName: 'Unit manager'}, 

    ]
  },
  {
    category: 'Post-producción Imagen',
    roles: [
      {roleId: 123, roleName: 'Asistente de edición'}, 
      {roleId: 124, roleName: 'Asistente de postproducción'}, 
      {roleId: 125, roleName: 'Colorista'}, 
      {roleId: 126, roleName: 'Compositor VFX'}, 
      {roleId: 127, roleName: 'Conformado DCP'}, 
      {roleId: 128, roleName: 'Data wrangler'}, 
      {roleId: 129, roleName: 'Editor(a)'}, 
      {roleId: 130, roleName: 'Postproductor(a)'}, 
      {roleId: 131, roleName: 'Subtitulaje'}, 
      {roleId: 132, roleName: 'Supervisor(a) de postproducción'}, 
      {roleId: 133, roleName: 'Supervisor(a) de VFX'}

    ]
  },
  {
    category: 'Post-producción Sonido',
    roles: [
      {roleId: 134, roleName: 'Artista foley'}, 
      {roleId: 135, roleName: 'Artista SFX'}, 
      {roleId: 136, roleName: 'Diseñador(a) sonoro'}, 
      {roleId: 137, roleName: 'Editor(a) de diálogos'}, 
      {roleId: 138, roleName: 'Editor(a) de sonido'}, 
      {roleId: 139, roleName: 'Ingeniero(a) de audio'}, 
      {roleId: 140, roleName: 'Mixer 5.1'}, 
      {roleId: 141, roleName: 'Musicalización/ Compositor(a)'}, 
      {roleId: 142, roleName: 'Operador(a) Atmos'}, 
      {roleId: 143, roleName: 'Operador(a) Dolby'}, 
      {roleId: 144, roleName: 'Operador(a) THX'}, 
      {roleId: 145, roleName: 'Supervisor(a) musical'}

    ]
  },
  {
    category: 'Sonido',
    roles: [
      {roleId:146, roleName: 'Microfonista'},
      {roleId:147, roleName: 'Operador de boom'},
      {roleId:148, roleName: 'Sonidista'}
    ]
  },
  {
    category: 'Staff',
    roles: [
      {roleId: 149, roleName: 'Eléctrico'}, 
      {roleId: 150, roleName: 'Encargado(a) de equipo especializado'}, 
      {roleId: 151, roleName: 'Encargado(a) de luces'}, 
      {roleId: 152, roleName: 'Encargado(a) de móvil'}, 
      {roleId: 153, roleName: 'Gaffer'}, 
      {roleId: 154, roleName: 'Grip'}, 
      {roleId: 155, roleName: 'Jefe(a) eléctricos'}, 
      {roleId: 156, roleName: 'Jefe(a) tramoya'}, 
      {roleId: 157, roleName: 'Key Grip'}, 
      {roleId: 158, roleName: 'Operador(a) de dolly'}, 
      {roleId: 159, roleName: 'Operador(a) grúa'}, 
      {roleId: 160, roleName: 'Operador(a) HMI'}, 
      {roleId: 161, roleName: 'Programador de iluminación'}, 
      {roleId: 162, roleName: 'Rigger'}, 
      {roleId: 163, roleName: 'Staff'}, 
      {roleId: 164, roleName: 'Tramoyista'}

    ]
  },
  {
    category: 'Vestuario',
    roles: [
      {roleId: 165, roleName: 'Ambientador(a)/ estilista'}, 
      {roleId: 166, roleName: 'Asistente de vestuario'}, 
      {roleId: 167, roleName: 'Comprador(a)'}, 
      {roleId: 168, roleName: 'Coordinador(a) de vestuario'}, 
      {roleId: 169, roleName: 'Costurero(a)'}, 
      {roleId: 170, roleName: 'Director(a) de vestuario'}, 
      {roleId: 171, roleName: 'On set vestuario'}, 
      {roleId: 172, roleName: 'Vestuarista'}

    ]
  },
  {
    category: 'Otro',
    roles: [
      {roleId: 173, roleName: 'Abogado(a) cine/medios '}, 
      {roleId: 174, roleName: 'Abogado(a) derecho de autor'}, 
      {roleId: 175, roleName: 'Agentes'}, 
      {roleId: 176, roleName: 'Asesoría financiera medios audiovisuales'}, 
      {roleId: 177, roleName: 'Catering'}, 
      {roleId: 178, roleName: 'Clearance/ product placement'}, 
      {roleId: 179, roleName: 'Community manager'}, 
      {roleId: 180, roleName: 'Contador(a) cine'}, 
      {roleId: 181, roleName: 'Crítico(a) / escritor(a) de cine'}, 
      {roleId: 182, roleName: 'Delegado(a) sindicato'}, 
      {roleId: 183, roleName: 'Distribución'}, 
      {roleId: 184, roleName: 'Doctor(a) set'}, 
      {roleId: 185, roleName: 'Driver/ transporte'}, 
      {roleId: 186, roleName: 'Empresario(a) empresa de cine/ medios'}, 
      {roleId: 187, roleName: 'Estudiante de cine'}, 
      {roleId: 188, roleName: 'Exhibición'}, 
      {roleId: 189, roleName: 'Gestor(a) cultural'}, 
      {roleId: 190, roleName: 'Limpieza'}, 
      {roleId: 191, roleName: 'Marketing cine'}, 
      {roleId: 192, roleName: 'Organizador(a) festival/ muestra de cine'}, 
      {roleId: 193, roleName: 'Otro'}, 
      {roleId: 194, roleName: 'Programador(a) festival/ muestra de cine'}, 
      {roleId: 195, roleName: 'Proveedor'}, 
      {roleId: 196, roleName: 'Publirrelacionista'}, 
      {roleId: 197, roleName: 'Renta de equipo/ foro'}, 
      {roleId: 198, roleName: 'Representante empresa/ organización'}, 
      {roleId: 199, roleName: 'Seguridad on set'}

    ]
  },
];

export const getCrewCategories = function(){
  var categories = new Array();
  crewOcupations.forEach(function(doc, index){
    categories.push(doc.category);
  });
  return categories;
};

export const getCrewRoleFromCategory = function(category){
  var roles = new Array();
  var result = new Array();
  crewOcupations.forEach(function(doc, index){
    if(doc.category===category){
      roles = doc.roles;
      for (var i = 0; i < roles.length; i++) {
        result.push(roles[i]);
      }
    }
  });
  return result;
};

export const getCrewRoleFromCategoryIncludeTopRoles = function(category){
  var roles = new Array();
  var result = new Array();
  crewOcupations.forEach(function(doc, index){
    if(doc.category===category){
      roles = doc.roles;
      for (var i = 0; i < roles.length; i++) {
        result.push(roles[i]);
      }
      if(category==="Dirección"){
        result.push({roleId:1000, roleName: 'Director'});
      }
      else if(category==="Producción"){
        result.push({roleId:2000, roleName: 'Productor'});
      }
    }
  });
  return result;
};

export const getRoleById = function(roleId){
  //console.log("En getRoleById");
  var role = "";
  var roles = new Array();
  var result = new Array();
  var id = parseInt(roleId);

  if(id===1000){
    role = {roleId: id, roleName: 'Director'}
    
  }
  else if(id===2000){
    role = {roleId: id, roleName: 'Productor'}
  }
  else{
    crewOcupations.forEach(function(doc, index){
      roles = doc.roles;
      for (var i = 0; i < roles.length; i++) {
        if(roles[i].roleId===id){
          role = roles[i];
          break;
        }
      }
    });
  }
  return role;  
  
};

/*Terminan los objetos y funciones para el manejo de roles de cast***/