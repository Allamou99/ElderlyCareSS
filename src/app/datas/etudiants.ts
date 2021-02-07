export interface etudiant {
    firstname:string,
    lastname:string,
    Cin:string,
    email:string,
    field:string
}


export const ETUDIANTS : etudiant[] = [
    {
        firstname:'Ali',
        lastname:'Alaoui',
        Cin:'48549BE',
        email:'Ali99@outlook.fr',
        field:'Informatique'
    },
    {
        firstname:'Hiba',
        lastname:'Oudghiri',
        Cin:'485DJJ83',
        email:'Hiba@outlook.fr',
        field:'Informatique'
    },
    {
        firstname:'Saad',
        lastname:'Hakimi',
        Cin:'24949BEKD',
        email:'Saad@outlook.fr',
        field:'Industriel'
    },

];

export const url = "http://localhost:3000/";


/*{
    "etudiants": [
      {
        "id": 0,
        "firstname": "Ali",
        "lastname": "Alaoui",
        "cin": "48549BE",
        "email": "Ali99@outlook.fr",
        "field": "Informatique"
      },
      {
        "id": 1,
        "firstname": "Hiba",
        "lastname": "Oudghiri",
        "cin": "485DJJ83",
        "email": "Hiba@outlook.fr",
        "field": "Informatique"
      },
      {
        "id": 2,
        "firstname": "Saad",
        "lastname": "Hakimi",
        "cin": "24949BEKD",
        "email": "Saad@outlook.fr",
        "field": "Industriel"
      },
      {
        "firstname": "Soufiane",
        "lastname": "Allamou",
        "email": "soufianeallamou99@outlook.fr",
        "cin": "BE489311",
        "field": "Info",
        "moyenne": "16",
        "id": 3
      },
      {
        "firstname": "Imad",
        "lastname": "Barraho²",
        "email": "Imad99@outlook.fr",
        "cin": "BEJDD322",
        "field": "Info",
        "moyenne": "19",
        "id": 4
      }
    ]
  }*/