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
  {spec: "Delgado"},
  {spec: "Esbelto"},
  {spec: "Estándar"},
  {spec: "Deportivo/Muscular"},
  {spec: "Corpulento"},
  {spec: "Robusto"}
];


export let catEthnics = [
  {spec: "Caucasica- Blanca"},
  {spec: "Latina"},
  {spec: "Indigena"},
  {spec: "Mulato"},
  {spec: "Afro-descendiente"},
  {spec: "Asiatico"},
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
  {spec: "Modelo"},
  {spec: "Actor"},
  {spec: "Bailarín"},
  {spec: "Cantante"},
  {spec: "Extra"},
  {spec: "Doble"}
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
      {roleId: 1, roleName: 'Animador 2d'}, 
      {roleId: 2, roleName: 'Animador 3d'}, 
      {roleId: 3, roleName: 'Artista de composición'}, 
      {roleId: 4, roleName: 'Artista de Iluminacion'},
      {roleId: 5, roleName: 'Artista de layout'},  
      {roleId: 6, roleName: 'Artista de textura y sombreado'}, 
      {roleId: 7, roleName: 'Diseñador de escenarios (Animacion)'}, 
      {roleId: 8, roleName: 'Diseñador de personaje (Animacion)'}, 
      {roleId: 9, roleName: 'Matte painting'}, 
      {roleId:10, roleName: 'Modelador'}, 
      {roleId:11, roleName: 'Operador 3d'},
      {roleId:12, roleName: 'Supervisor de animacion'}
    ]
  }, 
  {
    category: 'Arte',
    roles: [
      {roleId:13, roleName: 'Asistente de dirección de arte'},
      {roleId:14, roleName: 'Asistente de escenografía'},
      {roleId:15, roleName: 'Asistente decorador de set'},
      {roleId:16, roleName: 'Carpintero'},
      {roleId:17, roleName: 'Constructor'},
      {roleId:18, roleName: 'Decorador'},
      {roleId:19, roleName: 'Dirección de arte'}, 
      {roleId:20, roleName: 'Diseño de escenografía'},
      {roleId:21, roleName: 'Diseño de producción'},
      {roleId:22, roleName: 'Estilista de alimentos / Ecónomo'},
      {roleId:23, roleName: 'Escultor'},
      {roleId:24, roleName: 'Herrero'},
      {roleId:25, roleName: 'Prop master'},
      {roleId:26, roleName: 'Swing'}
    ]
  },
  {
    category: 'Casting',
    roles: [
      {roleId:27, roleName: 'Casing extras'},
      {roleId:28, roleName: 'Director de casting'}
    ]
  },
  {
    category: 'Dirección',
    roles: [
      {roleId:29, roleName: '1er asistente de dirección'},
      {roleId:30, roleName: '2o asistente de dirección'}, 
      {roleId:31, roleName: 'Artista Story Board'}, 
      {roleId:32, roleName: 'Coach actoral'}, 
      {roleId:33, roleName: 'Continuista / script'}, 
      {roleId:34, roleName: 'Coreógrafo'},
      {roleId:1000, roleName: 'Director'}
    ]
  },
  {
    category: 'Diseño',
    roles: [
      {roleId:36, roleName: 'Diseñador gráfico cine'},
      {roleId:37, roleName: 'Diseño web cine'},
      {roleId:38, roleName: 'Ilustrador cine'}
    ]
  },
  {
    category: 'Efectos especiales / On set',
    roles: [
      {roleId:39, roleName: 'Doble / Stunt'},
      {roleId:40, roleName: 'Pirotecnia'},
      {roleId:41, roleName: 'VFX'}
    ]
  },
  {
    category: 'Fotografía',
    roles: [
      {roleId:42, roleName: '1er asistente de cámara'},
      {roleId:43, roleName: '2o asistente de cámara'},
      {roleId:44, roleName: 'Director de Fotografía'}, 
      {roleId:45, roleName: 'Director de Fotografía acuática / aérea'},
      {roleId:46, roleName: 'Data manager'},
      {roleId:47, roleName: 'DIT'},
      {roleId:48, roleName: 'Fotografía fija'},
      {roleId:49, roleName: 'Gaffer'},
      {roleId:50, roleName: 'Jefe eléctricos'},
      {roleId:51, roleName: 'Jefe tramoya'},
      {roleId:52, roleName: 'Making of'},
      {roleId:53, roleName: 'Operador de cámara'},
      {roleId:54, roleName: 'Operador de dolly'},
      {roleId:55, roleName: 'Operador de drone'},
      {roleId:56, roleName: 'Operador de grúa'},
      {roleId:57, roleName: 'Operador de stedycam'},
      {roleId:58, roleName: 'Staff'},
      {roleId:59, roleName: 'Tramoyista'},
      {roleId:60, roleName: 'Video assist'}
    ]
  },
  {
    category: 'Guión',
    roles: [
      {roleId:61, roleName: 'Copywriter'},
      {roleId:62, roleName: 'Guionista'}
    ]
  },
  {
    category: 'Locaciones',
    roles: [
      {roleId:63, roleName: 'Gerente de Locaciones'},
      {roleId:64, roleName: 'Scout'}
    ]
  },
  {
    category: 'Maquillaje / Peinado',
    roles: [
      {roleId:65, roleName: 'Maquillaje y peinados'}
    ]
  },
  {
    category: 'Producción',
    roles: [
      {roleId:66, roleName: 'Asistente de producción'},
      {roleId:67, roleName: 'Contador de cine'},
      {roleId:68, roleName: 'Coordinador de producción'},
      {roleId:69, roleName: 'Fixer'},
      {roleId:70, roleName: 'Gerente de producción'},
      {roleId:71, roleName: 'Jefe de producción'},
      {roleId:2000, roleName: 'Productor'},
      {roleId:73, roleName: 'Productor asociado'},
      {roleId:74, roleName: 'Productor ejecutivo'},
      {roleId:75, roleName: 'Productor en línea'},
      {roleId:76, roleName: 'Runner'}
    ]
  },
  {
    category: 'Post-producción Imagen',
    roles: [
      {roleId:77, roleName: 'Asistente de edición'},
      {roleId:78, roleName: 'Asistente de post-producción'},
      {roleId:79, roleName: 'Colorista'},
      {roleId:80, roleName: 'Compositor de VFX'},
      {roleId:81, roleName: 'Conformado DCP'},
      {roleId:82, roleName: 'Data Wrangler'},
      {roleId:83, roleName: 'Diseñador de títulos / créditos'},
      {roleId:84, roleName: 'Editor'},
      {roleId:85, roleName: 'Post productor'},
      {roleId:86, roleName: 'Supervisor de VFX'}
    ]
  },
  {
    category: 'Post-producción Sonido',
    roles: [
      {roleId:87, roleName: 'Artista foley'},
      {roleId:88, roleName: 'Diseñador sonoro'},
      {roleId:89, roleName: 'Editor de diálogos'},
      {roleId:90, roleName: 'Editor de sonido'},
      {roleId:91, roleName: 'Ingeniero de audio'},
      {roleId:92, roleName: 'Mixer 5.1'},
      {roleId:93, roleName: 'Musicalización / Compositor'},
      {roleId:94, roleName: 'Operador THX'},
      {roleId:95, roleName: 'Supervisor musical'}
    ]
  },
  {
    category: 'Sonido',
    roles: [
      {roleId:96, roleName: 'Microfonista'},
      {roleId:97, roleName: 'Operador de boom'},
      {roleId:98, roleName: 'Sonidista'}
    ]
  },
  {
    category: 'Vestuario',
    roles: [
      {roleId:99,  roleName: 'Asistente de vestuario'},
      {roleId:100, roleName: 'Costurera'},
      {roleId:101, roleName: 'Vestuarista'}
    ]
  },
  {
    category: 'Otros',
    roles: [
      {roleId:102, roleName: 'Abogado de derechos de autor'},
      {roleId:103, roleName: 'Abogado de cine'},
      {roleId:104, roleName: 'Agentes'},
      {roleId:105, roleName: 'Broker Cine'},
      {roleId:106, roleName: 'Catering'},
      {roleId:107, roleName: 'Estudiante de cine'},
      {roleId:108, roleName: 'Marketing cine'},
      {roleId:109, roleName: 'Org. Festivales de Cine / Muestra'},
      {roleId:110, roleName: 'Publirrelacionista'},
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