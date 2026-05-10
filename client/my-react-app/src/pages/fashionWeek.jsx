import React from "react";
import { useState } from "react";
import "./fashionWeek.css";

//DATA ARRAY─────────────────────────────────
const SEASONS = [
  {id: "fall2026",   label: "Fall 2026" },
  {id: "spring2026", label: "Spring 2026" },
  {id: "fall2025",   label: "Fall 2025" },
  {id: "spring2025", label: "Spring 2025" },
  {id: "fall2024",   label: "Fall 2024" },
  {id: "spring2024", label: "Spring 2024" },
];

const CITIES = ["New York", "London", "Milan", "Paris"];

const CITY_INFO = {
  "New York":"Known for modern American sportswear and commercial-ready fashion.",
  "London":"Famous for experimental design and emerging talent.",
  "Milan":"Home of Italian luxury craftsmanship and tailoring.",
  "Paris":"The center of haute couture and historic fashion houses.",
};

const MAIN_CATEGORIES = [
  {id: "rtw",     label: "Ready-to-Wear" },
  {id: "resort",  label: "Resort (Cruise)" },
  {id: "couture", label: "Haute Couture" },
];

const SUB_CATEGORIES = [
  {id: "women", label: "Women's" },
  {id: "men",   label: "Men's" },
  {id: "kids",  label: "Children's" },
];

//BRAND NAME DESIGNERS ─ FILTER BY CITY ------------------------
const CITY_DESIGNERS = {

//NEW YORK COLLECTION  ------------------------
  "New York":{
  featured:[
    {initial: "A",
      name: "Area",
      link: "",
      categories:{"fall2026": ["rtw"],                    "spring2026": ["rtw"],
                  "fall2024": ["rtw","resort","couture"], "spring2024": ["rtw","resort"] },
      
      seasons:   ["fall2026", "spring2026", 
                  "fall2024", "spring2024"],
      
      subcategories:{
                  "fall2026/rtw":   ["women"],   "spring2026/rtw":["women"],
                  "fall2024/rtw":   ["women"],   "spring2024/rtw": ["women"],
                  "fall2024/resort":["women"],   "spring2024/resort":["women"],
                  "fall2024/couture":["women"],
        }
      },
  { initial: "A",
      name:"Altuzarra",
      link:"",
      categories:{"fall2026": ["rtw"],          "spring2026": ["rtw"], 
                  "fall2025": ["rtw"],          "spring2025": ["rtw"], 
                  "fall2024": ["rtw"],          "spring2024": ["rtw"] },

      seasons:   ["fall2026", "spring2026", 
                  "fall2025", "spring2025",
                  "fall2024", "spring2024"],

      subcategories:{
                  "fall2026/rtw": ["women"],   "spring2026/rtw": ["women"],
                  "fall2025/rtw": ["women"],   "spring2025/rtw": ["women"],
                  "fall2024/rtw": ["women"],   "spring2024/rtw": ["women"],
        }
    },

    {initial: "AS",
      name: "Anna Sui",
      link: "",
      categories:{"fall2026": ["rtw","resort"],     "spring2026": ["rtw","resort"], 
                  "fall2025": ["rtw","resort"],     "spring2025": ["rtw","resort"],
                  "fall2024": ["rtw","resort"],     "spring2024": ["rtw","resort"] },

      seasons:["fall2026", "spring2026", 
              "fall2025", "spring2025", 
              "fall2024", "spring2024"],
      subcategories: {
              "fall2026/rtw":   ["women"],      "spring2026/rtw":   ["women"],
              "fall2026/resort":["women"],      "spring2026/resort":["women"],
              "fall2025/rtw":   ["women"],      "spring2025/rtw":   ["women"], 
              "fall2025/resort":["women"],      "spring2025/resort":["women"],
              "fall2024/rtw":   ["women"],       "spring2024/rtw":   ["women"],
              "fall2024/resort":["women"],      "spring2024/resort":["women"],
        }
      },

    {initial: "C",
      name:"Coach",
      link:"",
      categories:{"fall2026":["rtw","resort"],   "spring2026": ["rtw","resort"], 
                  "fall2025":["rtw","resort"],   "spring2025": ["rtw","resort"], 
                  "fall2024":["rtw","resort"],   "spring2024": ["rtw","resort"] },

      seasons:   ["fall2026",                    "spring2026", 
                  "fall2025",                    "spring2025", 
                  "fall2024",                    "spring2024"],
      
      subcategories:{
                  "fall2026/rtw":   ["women"],   "spring2026/rtw":   ["women"], 
                  "fall2026/resort":["women"],   "spring2026/resort":["women"],
                  "fall2025/rtw":   ["women"],   "spring2025/rtw":   ["women"],
                  "fall2025/resort":["women"],   "spring2025/resort":["women"],
                  "fall2024/rtw":   ["women"],   "spring2024/rtw":   ["women"],
                  "fall2024/resort":["women"],   "spring2024/resort":["women"],
        }
      },

    {initial: "CH",
      name: "Carolina Herrera",
      link: "",
      categories:{"fall2026": ["rtw","resort"],     "spring2026": ["rtw","resort"], 
                  "fall2025": ["rtw","resort"],     "spring2025": ["rtw","resort"],
                  "fall2024": ["rtw","resort"],     "spring2024": ["rtw","resort"] },

      seasons:["fall2026", "spring2026", 
              "fall2025", "spring2025", 
              "fall2024", "spring2024"],
      subcategories: {
              "fall2026/rtw":   ["women"],      "spring2026/rtw":   ["women"],
              "fall2026/resort":["women"],      "spring2026/resort":["women"],
              "fall2025/rtw":   ["women"],      "spring2025/rtw":   ["women"], 
              "fall2025/resort":["women"],      "spring2025/resort":["women"],
              "fall2024/rtw":  ["women"],       "spring2024/rtw":   ["women"],
              "fall2024/resort":["women"],      "spring2024/resort":["women"],
        }
      },

      {initial: "CK",
        name: "Calvin Klein",
        link: "",
        categories:{"fall2026": ["rtw"],          "spring2026": ["rtw"], 
                    "fall2025": ["rtw"],          
                   },

        seasons:  ["fall2026", "spring2026", 
                  "fall2025"
                  ],

        subcategories:{
                  "fall2026/rtw": ["women"],   "spring2026/rtw": ["women"],
                  "fall2025/rtw": ["women"],   
          }
        },

        { initial: "CG",
          name:"Cult Gaia",
          link:"",
          categories:{"fall2026": ["rtw","resort"],        "spring2026": ["rtw","resort"], 
                      "fall2025": ["rtw","resort"],        "spring2025": ["rtw","resort"], 
                      "fall2024": ["rtw","resort"],        "spring2024": ["rtw","resort"] },
      
          seasons:   ["fall2026", "spring2026", 
                      "fall2025", "spring2025", 
                      "fall2024", "spring2024"],
          subcategories:{
                      "fall2026/rtw":   ["women"],      "spring2026/rtw":   ["women"],
                      "fall2026/resort": ["women"],     "spring2026/resort":["women"],
                      "fall2025/rtw":   ["women"],      "spring2025/rtw":   ["women"],
                      "fall2025/resort": ["women"],     "spring2025/resort":["women"],
                      "fall2024/rtw":   ["women"],      "spring2024/rtw":   ["women"],
                      "fall2024/resort": ["women"],     "spring2024/resort":["women"],
            }
          },

          {initial: "K",
            name:"Khaite",
            link:"",
            categories:{"fall2026": ["rtw","resort"],  "spring2026": ["rtw","resort"],
                        "fall2025": ["rtw","resort"],  "spring2025": ["rtw","resort"],
                        "fall2024": ["rtw","resort"],  "spring2024": ["rtw","resort"] },
          
            seasons:   ["fall2026",                    "spring2026", 
                        "fall2025",                    "spring2025", 
                        "fall2024",                    "spring2024"],
          
            subcategories: {
                        "fall2026/rtw":   ["women"],   "spring2026/rtw":["women"],
                        "fall2026/resort":["women"],   "spring2026/resort":["women"],
                        "fall2025/rtw":  ["women"],    "spring2025/rtw":   ["women"],
                        "fall2025/resort":["women"],   "spring2025/resort":["women"],
                        "fall2024/rtw":   ["women"],   "spring2024/rtw":   ["women"],
                        "fall2024/resort":["women"],   "spring2024/resort":["women"],
              }
            },


    {initial: "MM",
      name:"Maria McManus",
      link:"",
      categories:{"fall2026": ["rtw","resort"],  "spring2026": ["rtw","resort"],
                  "fall2025": ["rtw","resort"],  "spring2025": ["rtw","resort"],
                  "fall2024": ["rtw","resort"],  "spring2024": ["rtw","resort"] },
    
      seasons:   ["fall2026",                    "spring2026", 
                  "fall2025",                    "spring2025", 
                  "fall2024",                    "spring2024"],
    
      subcategories: {
                  "fall2026/rtw":   ["women"],   "spring2026/rtw":["women"],
                  "fall2026/resort":["women"],   "spring2026/resort":["women"],
                  "fall2025/rtw":  ["women"],    "spring2025/rtw":   ["women"],
                  "fall2025/resort":["women"],   "spring2025/resort":["women"],
                  "fall2024/rtw":   ["women"],   "spring2024/rtw":   ["women"],
                  "fall2024/resort":["women"],   "spring2024/resort":["women"],
        }
      },

    {initial: "MM",
      name:"Marina Moscone",
      link:"",
      categories:{"fall2026": ["rtw"],           "spring2026": ["rtw"], 
                  "fall2025": ["rtw"],           "spring2025": ["rtw"], 
                  "fall2024": ["rtw"],           "spring2024": ["rtw"] },

      seasons:   ["fall2026",                    "spring2026", 
                  "fall2025",                    "spring2025", 
                  "fall2024",                    "spring2024"],

      subcategories:{ 
                  "fall2026/rtw":["women"],      "spring2026/rtw":["women"],
                  "fall2025/rtw":["women"],      "spring2025/rtw":["women"],
                  "fall2024/rtw":["women"],      "spring2024/rtw":["women"],
      }
    },
  ],
  more: [
    { initial: "MK",
      name:"Michael Kors Collection",
      link:"",
      categories:{"fall2026": ["rtw"],          "spring2026": ["rtw"], 
                  "fall2025": ["rtw"],          "spring2025": ["rtw"], 
                  "fall2024": ["rtw"],          "spring2024": ["rtw"] },

      seasons:   ["fall2026", "spring2026", 
                  "fall2025", "spring2025",
                  "fall2024", "spring2024"],

      subcategories:{
                  "fall2026/rtw": ["women"],   "spring2026/rtw": ["women"],
                  "fall2025/rtw": ["women"],   "spring2025/rtw": ["women"],
                  "fall2024/rtw": ["women"],   "spring2024/rtw": ["women"],
      }
    },

    { initial: "PS",
      name:"Proenza Scholuer",
      link:"",
      categories:{"fall2026": ["rtw"],          "spring2026": ["rtw"], 
                  "fall2025": ["rtw"],          "spring2025": ["rtw"], 
                  "fall2024": ["rtw"],          "spring2024": ["rtw"] },

      seasons:   ["fall2026", "spring2026", 
                  "fall2025", "spring2025",
                  "fall2024", "spring2024"],

      subcategories:{
                  "fall2026/rtw": ["women"],   "spring2026/rtw": ["women"],
                  "fall2025/rtw": ["women"],   "spring2025/rtw": ["women"],
                  "fall2024/rtw": ["women"],   "spring2024/rtw": ["women"],
      }
    },

    { initial: "RL",
      name:"Ralph Lauren",
      link:"",
      categories:{"fall2026":["rtw","resort"],       "spring2026": ["rtw","resort"], 
                  "fall2025":["rtw"],                "spring2025": ["rtw"], 
                  "fall2024":["rtw","resort"],       "spring2024": ["rtw","resort"] },

      seasons:   ["fall2026", "spring2026", 
                  "fall2025", "spring2025", 
                  "fall2024", "spring2024"],

      subcategories: {
                  "fall2026/rtw":   ["women","men"], "spring2026/rtw":   ["women","men"],
                  "fall2026/resort":["women"],       "spring2026/resort":["women"],
                  "fall2025/rtw":   ["women","men"], "spring2025/rtw":   ["women","men"],
                  "fall2024/rtw":   ["women","men"], "fall2024/resort":  ["women"],
                  "spring2024/rtw": ["women","men"], "spring2024/resort":["women"],
      }
    },
  { initial: "TB",
    name:"Tory Burch",
    link:"",
    categories:{"fall2026": ["rtw","resort"],        "spring2026": ["rtw","resort"], 
                "fall2025": ["rtw","resort"],        "spring2025": ["rtw","resort"], 
                "fall2024": ["rtw","resort"],        "spring2024": ["rtw","resort"] },

    seasons:   ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],
    subcategories:{
                "fall2026/rtw":     ["women"],      "spring2026/rtw":   ["women"],
                "fall2026/resort":   ["women"],     "spring2026/resort":["women"],
                "fall2025/rtw":     ["women"],      "spring2025/rtw":   ["women"],
                "fall2025/resort":   ["women"],     "spring2025/resort":["women"],
                "fall2024/rtw":     ["women"],      "spring2024/rtw":   ["women"],
                "fall2024/resort":   ["women"],     "spring2024/resort":["women"],
      }
    },
    { initial: "TB",
      name:"Thom Browne",
      link:"",
      categories:{"fall2026": ["rtw","resort"],                "spring2026": ["rtw","resort"], 
                  "fall2025": ["rtw","resort"],                "spring2025": ["rtw","resort"], 
                  "fall2024": ["rtw","resort","couture"],      "spring2024": ["rtw","resort"] },
  
      seasons:   ["fall2026", "spring2026", 
                  "fall2025", "spring2025", 
                  "fall2024", "spring2024"],
      subcategories:{
                  "fall2026/rtw":     ["women","men"],      "spring2026/rtw":   ["women"],
                  "fall2026/resort":  ["women","men"],     "spring2026/resort":["women"],
                  "fall2025/rtw":     ["women"],      "spring2025/rtw":   ["women"],
                  "fall2025/resort":   ["women","men"],     "spring2025/resort":["women","men"],
                  "fall2024/rtw":     ["women"],      "spring2024/rtw":   ["women"],
                  "fall2024/resort":   ["women"],     "spring2024/resort":["women"],
                  "fall2024/couture":   ["women"],
        }
      },

      { initial: "TWP",
        name:"TWP",
        link:"",
        categories:{"fall2026": ["rtw","resort"],     "spring2026": ["rtw","resort"], 
                    "fall2025": ["rtw"] },
    
        seasons:   ["fall2026", "spring2026", 
                    "fall2025"],
        subcategories: {
                    "fall2026/rtw":   ["women"],      "spring2026/rtw":   ["women"],
                    "fall2026/resort":["women"],      "spring2026/resort":["women"],
                    "fall2025/rtw":   ["women"],
           }
        },

      {initial: "SL",
        name: "Sandy Liang",
        link: "",
        categories:{"fall2026": ["rtw","resort"],     "spring2026": ["rtw","resort"], 
                    "fall2025": ["rtw","resort"],     "spring2025": ["rtw","resort"],
                    "fall2024": ["rtw","resort"],     "spring2024": ["rtw","resort"] },
  
        seasons:["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],
        subcategories: {
                "fall2026/rtw":   ["women"],      "spring2026/rtw":   ["women"],
                "fall2026/resort":["women"],      "spring2026/resort":["women"],
                "fall2025/rtw":   ["women"],      "spring2025/rtw":   ["women"], 
                "fall2025/resort":["women"],      "spring2025/resort":["women"],
                "fall2024/rtw":   ["women"],       "spring2024/rtw":   ["women"],
                "fall2024/resort":["women"],      "spring2024/resort":["women"],
          }
        },

  { initial: "UJ",
    name:"Ulla Johnson",
    link:"",
    categories:{"fall2026": ["rtw","resort"],     "spring2026": ["rtw","resort"], 
                "fall2025": ["rtw","resort"],     "spring2025": ["rtw","resort"],
                "fall2024": ["rtw","resort"],     "spring2024": ["rtw","resort"] },

    seasons:   ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],
    subcategories: {
                "fall2026/rtw":   ["women"],      "spring2026/rtw":   ["women"],
                "fall2026/resort":["women"],      "spring2026/resort":["women"],
                "fall2025/rtw":   ["women"],      "spring2025/rtw":   ["women"], 
                "fall2025/resort":["women"],      "spring2025/resort":["women"],
                "fall2024/rtw":  ["women"],       "spring2024/rtw":   ["women"],
                "fall2024/resort":["women"],      "spring2024/resort":["women"],
       }
    },

  



  ],
},





//LONDON COLLECTION
"London": {
featured: [
 {  initial:"BB",
    name: "Burberry",
    link:"",
    categories:{"fall2026": ["rtw"], "spring2026": ["rtw"], 
                "fall2025": ["rtw"], "spring2025": ["rtw"], 
                "fall2024": ["rtw"], "spring2024": ["rtw"] },

    seasons:   ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],
    subcategories: {
                "fall2026/rtw": ["women"], "spring2026/rtw": ["women"],
                "fall2025/rtw": ["women"], "spring2025/rtw": ["women"],
                "fall2024/rtw": ["women"], "spring2024/rtw": ["women"],
      }
    },

    { initial: "CL",
      name: "Chopova Lowena",
      link: "",
      categories:{"fall2026": ["rtw"], "spring2026": ["rtw"], 
                  "fall2025": ["rtw"], "spring2025": ["rtw"], 
                  "fall2024": ["rtw"], "spring2024": ["rtw"] },
  
      seasons:   ["fall2026", "spring2026", 
                  "fall2025", "spring2025", 
                  "fall2024", "spring2024"],
  
      subcategories: {
                  "fall2026/rtw": ["women"], "spring2026/rtw": ["women"],
                  "fall2025/rtw": ["women"], "spring2025/rtw": ["women"],
                  "fall2024/rtw": ["women"], "spring2024/rtw": ["women"],
      }
    },

  { initial: "EM",
    name: "Erdem",
    link:"",
    categories:{"fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"],
                "fall2025": ["rtw","resort"], "spring2025": ["rtw","resort"],
                "fall2024": ["rtw","resort"], "spring2024": ["rtw","resort"] },

    seasons:   ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

    subcategories:{
                "fall2026/rtw":  ["women"],   "spring2026/rtw":["women"],
                "fall2026/resort":["women"],  "spring2026/resort": ["women"],
                "fall2025/rtw":  ["women"],   "spring2025/rtw":["women"],
                "fall2025/resort": ["women"], "spring2025/resort": ["women"],
                "fall2024/rtw":  ["women"],   "spring2024/rtw": ["women"],
                "fall2024/resort": ["women"], "spring2024/resort": ["women"],
    }
  },

  { initial: "SR",
    name:"Simone Rocha",
    link: "",
    categories:{"fall2026": ["rtw"], "spring2026": ["rtw"], 
                "fall2025": ["rtw"], "spring2025": ["rtw"], 
                "fall2024": ["rtw"], "spring2024": ["rtw"] },

    seasons:   ["fall2026", "spring2026",
                "fall2025", "spring2025",
                "fall2024", "spring2024"],

    subcategories: {
                "fall2026/rtw": ["women"],       "spring2026/rtw": ["women","men"],
                "fall2025/rtw": ["women","men"], "spring2025/rtw": ["women"],
                "fall2024/rtw": ["women"],       "spring2024/rtw": ["women"],
    }
  },

  { initial: "JW",
    name: "JW Anderson",
    link: "",
    categories:{"fall2026": ["rtw","resort"], 
                                                 "spring2025": ["rtw"], 
                "fall2024": ["rtw","resort"],    "spring2024": ["rtw","resort"] },
    
    seasons:    ["fall2026", 
                                                 "spring2025", 
                "fall2024",                      "spring2024"],
    subcategories:{
                "fall2026/rtw":   ["women"],
                "fall2026/resort":["women"],
                                                "spring2025/rtw":   ["women","men"],
                "fall2024/rtw":["women","men"],"spring2024/rtw":   ["men","women"],
                "fall2024/resort":["women"],   "spring2024/resort":["women"],
    }
  },

  { initial: "J",
    name: "Joseph",
    link: "",
    categories: { "fall2026": ["rtw"] },

    seasons: ["fall2026"],

    subcategories: {
      "fall2026/rtw":["women"],    
    }
  },
],
more: [
  { initial: "R",
    name: "Roksanda",
    link: "",
    categories:{"fall2026": ["rtw"], "spring2026": ["rtw"], 
                "fall2025": ["rtw"], "spring2025": ["rtw"], 
                "fall2024": ["rtw"], "spring2024": ["rtw"] },

    seasons:   ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

    subcategories: {
                "fall2026/rtw": ["women"], "spring2026/rtw": ["women"],
                "fall2025/rtw": ["women"], "spring2025/rtw": ["women"],
                "fall2024/rtw": ["women"], "spring2024/rtw": ["women"],
    }
  },

  { initial: "VB",
    name:"Victoria Beckham",
    link: "",
    categories:{"fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"],
                "fall2025": ["rtw","resort"], "spring2025": ["rtw","resort"], 
                "fall2024": ["rtw","resort"], "spring2024": ["rtw","resort"] },

    seasons:   ["fall2026", "spring2026",
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

    subcategories: {
                "fall2026/rtw":   ["women"], "fall2026/resort":   ["women"],
                "spring2026/rtw": ["women"], "spring2026/resort": ["women"],
                "fall2025/rtw":   ["women"], "fall2025/resort":   ["women"],
                "spring2025/rtw": ["women"], "spring2025/resort": ["women"],
                "fall2024/rtw":   ["women"], "fall2024/resort":   ["women"],
                "spring2024/rtw": ["women"], "spring2024/resort": ["women"],
    }
  },
  { initial: "TL",
    name: "Temperley London",
    link:"",
    categories:{"fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"],
                "fall2025": ["rtw"], "spring2025": ["rtw"],
                "fall2024": ["rtw"], "spring2024": ["rtw"] },

    seasons:   ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

    subcategories:{
                "fall2026/rtw":  ["women"],   "spring2026/rtw":["women"],
                "fall2026/resort":["women"],  "spring2026/resort": ["women"],
                "fall2025/rtw":  ["women"],   "spring2025/rtw":["women"],
                "fall2024/rtw":  ["women"],   "spring2024/rtw": ["women"],
    }
  },
],
},







//MILAN CoLLECTION -------------------
"Milan": {
  featured: [
    { initial: "D",
      name: "Diesel",
      link:"",
      categories:{"fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"],
                  "fall2025": ["rtw","resort"], "spring2025": ["rtw","resort"],
                  "fall2024": ["rtw","resort"], "spring2024": ["rtw","resort"] },
  
      seasons:   ["fall2026", "spring2026", 
                  "fall2025", "spring2025", 
                  "fall2024", "spring2024"],
  
      subcategories:{
                  "fall2026/rtw":  ["women"],   "spring2026/rtw":["women"],
                  "fall2026/resort":["women"],  "spring2026/resort": ["women"],
                  "fall2025/rtw":  ["women"],   "spring2025/rtw":["women"],
                  "fall2025/resort": ["women"], "spring2025/resort": ["women"],
                  "fall2024/rtw":  ["women"],   "spring2024/rtw": ["women"],
                  "fall2024/resort": ["women"], "spring2024/resort": ["women"],
      }
    },
    { initial: "GA",
      name: "Giorgio Armani",
      link: "",
      categories: { "fall2026": ["rtw"], "spring2026": ["rtw"], 
                    "fall2025": ["rtw"], "spring2025": ["rtw"], 
                    "fall2024": ["rtw"], "spring2024": ["rtw"] },

      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
        "fall2026/rtw":["women","men"],     "spring2026/rtw": ["women","men"],
        "fall2025/rtw":["women","men"],     "spring2025/rtw": ["women","men"],
        "fall2024/rtw":["women","men"],     "spring2024/rtw": ["women","men"],
      }
    },
  

    { initial: "G",
      name: "Gucci",
      link: "",
      categories:{ "fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"],
                   "fall2025": ["rtw","resort"], "spring2025": ["rtw","resort"], 
                   "fall2024": ["rtw","resort"], "spring2024": ["rtw","resort"] },

      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
        "fall2026/rtw":  ["women"],       "spring2026/rtw":["women"], 
        "fall2026/resort":["women"],      "spring2026/resort": ["women"],
        "fall2025/rtw":  ["women","men"], "spring2025/rtw":["women","men"],
        "fall2025/resort":["women"],      "spring2025/resort": ["women"],
        "fall2024/rtw":  ["women","men"], "spring2024/rtw":["women","men"],
        "fall2024/resort":["women"],      "spring2024/resort": ["women"],
      }
    },
    { initial: "P",
      name: "Prada",
      link: "",
      categories: { "fall2026": ["rtw"], "spring2026": ["rtw"], 
                    "fall2025": ["rtw"], "spring2025": ["rtw"], 
                    "fall2024": ["rtw"], "spring2024": ["rtw"] },

      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
        "fall2026/rtw":["women","men"],     "spring2026/rtw": ["women","men"],
        "fall2025/rtw":["women","men"],     "spring2025/rtw": ["women","men"],
        "fall2024/rtw":["women","men"],     "spring2024/rtw": ["women","men"],
      }
    },
    { initial: "F",
      name: "Fendi",
      link: "",
      categories: { "fall2026":["rtw","resort"],"spring2026": ["rtw","resort"],
                    "fall2025":["rtw"],         "spring2025": ["rtw"], 
                    "fall2024":["rtw"],         "spring2024": ["rtw","couture","resort"] },

      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
        "fall2026/rtw":   ["women"],           "spring2026/rtw":   ["women"], 
        "fall2026/resort": ["women"],          "spring2026/resort": ["women"],
        "fall2025/rtw":    ["women"],          "spring2025/rtw":   ["women","men"],
        "fall2024/rtw":["women","men"],        "spring2024/rtw":   ["women"],
                                              "spring2024/couture":["women"], 
                                              "spring2024/resort":["women"],
      }
    },
    { initial: "F",
      name: "Ferragamo",
      link: "",
      categories: { "fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"], 
                    "fall2025": ["rtw","resort"], "spring2025": ["rtw","resort"], 
                    "fall2024": ["rtw","resort"], "spring2024": ["rtw","resort"] },

      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
              "fall2026/rtw":  ["women"],    "spring2026/rtw":   ["women"],    
              "fall2026/resort":["women"],   "spring2026/resort": ["women"],
              "fall2025/rtw": ["women"],     "spring2025/rtw":   ["women","men"],
              "fall2025/resort": ["women"],  "spring2025/resort": ["women"],
              "fall2024/rtw":["women"],      "spring2024/rtw":["women","men"],
              "fall2024/resort":["women"],   "spring2024/resort": ["women"],
      }
    },

    { initial: "BV",
      name: "Bottega Veneta",
      link: "",
      categories: { "fall2026": ["rtw"], "spring2026": ["rtw"], 
                                         "spring2025": ["rtw","resort"], 
                    "fall2024": ["rtw"], "spring2024": ["rtw","resort"] },

      seasons: ["fall2026", "spring2026", 
                            "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
        "fall2026/rtw":   ["women"], "spring2026/rtw": ["women"],
                                     "spring2025/rtw":  ["women"], 
                                    "spring2025/resort":["women"],
        "fall2024/rtw":   ["women"],"spring2024/rtw":   ["women"], 
        "fall2024/resort":["women"],"spring2024/resort":["women"],
      }
    },
    { initial: "M",
      name: "Marni",
      link: "",
      categories: { "fall2026":["rtw"], 
                    "fall2025":["rtw"],          "spring2025":["rtw"], 
                    "fall2024":["rtw","resort"], "spring2024":["rtw","resort"] },

      seasons:["fall2026", 
               "fall2025", "spring2025", 
               "fall2024", "spring2024"],
      subcategories: {
        "fall2026/rtw":["women"],     
        "fall2025/rtw":["women"],       "spring2025/rtw":["women"],
        "fall2024/rtw":["women"],       "spring2024/rtw":["women"],
        "fall2024/resort":["women"],    "spring2024/resort":["women"],
      }
    },
    { initial: "MM6",
      name: "MM6 Maison Margiela",
      link: "",
      categories: { "fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"], 
                    "fall2025": ["rtw","resort"], "spring2025": ["rtw","resort"], 
                    "fall2024": ["rtw","resort"], "spring2024": ["rtw","resort"] },

      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
              "fall2026/rtw":  ["women"],          "spring2026/rtw":   ["women"],    
              "fall2026/resort":["women","men"],   "spring2026/resort":["women","men"],
              "fall2025/rtw": ["women","men"],     "spring2025/rtw":   ["women","men"],
              "fall2025/resort": ["women","men"],  "spring2025/resort":["women","men"],
              "fall2024/rtw":["women"],            "spring2024/rtw":["women","men"],
              "fall2024/resort":["women"],         "spring2024/resort": ["women"],
      }
    },
  ],
  more: [
    { initial: "V",
      name: "Valentino",
      link: "",
      categories: {"fall2026": ["rtw","resort"], "spring2026": ["rtw","couture","resort"],
                   "fall2025": ["rtw","resort"], "spring2025": ["rtw","couture","resort"], 
                   "fall2024": ["rtw","resort"], "spring2024": ["rtw","couture","resort"] },

      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
        "fall2026/rtw":   ["women"],      "spring2026/rtw": ["women"],    
        "fall2026/resort":["women"],      "spring2026/resort":["women"],
                                          "spring2026/couture":["women"], 

        "fall2025/rtw":["women"],         "spring2025/rtw": ["women"],
        "fall2025/resort":["women"],      "spring2025/resort":["women"],
                                          "spring2025/couture":["women"], 

        "fall2024/rtw":["women","men"],   "spring2024/rtw":["women","men"],
        "fall2024/resort":   ["women"],   "spring2024/resort":["women"],
                                          "spring2024/couture":["women"],
      }
    },

    { initial: "D&B",
      name: "Dolce&Gabbana",
      link: "",
      categories: {"fall2026": ["rtw"], "spring2026": ["rtw"], 
                                        "spring2025": ["rtw"], 
                   "fall2024": ["rtw"], "spring2024": ["rtw"] },

      seasons: ["spring2026","fall2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
        "fall2026/rtw":["women","men"], "spring2026/rtw": ["women","men"],
        "fall2025/rtw":["women","men"], "spring2025/rtw": ["women","men"], 
        "fall2024/rtw":["women","men"], "spring2024/rtw": ["women","men"],
      }
    },
    { initial: "MM",
      name: "Max Mara",
      link: "",
      categories: { "fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"], 
                    "fall2025": ["rtw","resort"], "spring2025": ["rtw","resort"], 
                    "fall2024": ["rtw","resort"], "spring2024": ["rtw","resort"] },

      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
        "fall2026/rtw":["women"],    "spring2026/rtw":["women"],
        "fall2026/resort":["women"], "spring2026/resort":["women"],
        "fall2025/rtw":["women"],    "spring2025/rtw": [ "women"],
        "fall2025/resort":["women"], "spring2025/resort":["women"],
        "fall2024/rtw":["women"],    "spring2024/rtw":["women"],
        "fall2024/resort":["women"], "spring2024/resort":["women"],
      }
    },

    { initial: "M",
      name: "Missoni",
      link: "",
      categories: { "fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"], 
                    "fall2025": ["rtw","resort"], "spring2025": ["rtw","resort"], 
                    "fall2024": ["rtw","resort"], "spring2024": ["rtw","resort"] },

      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
              "fall2026/rtw":  ["women"],    "spring2026/rtw":   ["women"],    
              "fall2026/resort":["women"],   "spring2026/resort": ["women"],
              "fall2025/rtw": ["women"],     "spring2025/rtw":   ["women","men"],
              "fall2025/resort": ["women"],  "spring2025/resort": ["women"],
              "fall2024/rtw":["women"],      "spring2024/rtw":["women","men"],
              "fall2024/resort":["women"],   "spring2024/resort": ["women"],
      }
    },
  ],
},

"Paris": {
  featured: [
    { initial: "C",
      name: "Chanel",
      link: "",
      categories: { "fall2026":["rtw","resort"],           "spring2026": ["rtw","couture","resort"], 
                    "fall2025":["rtw","couture","resort"], "spring2025": ["rtw","couture","resort"], 
                    "fall2024":["rtw","couture","resort"], "spring2024": ["rtw","couture","resort"] },

      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
        "fall2026/rtw":   ["women"],  "spring2026/rtw":    ["women"],
        "fall2026/resort":["women"],  "spring2026/resort": ["women"],
                                      "spring2026/couture":["women"], 
        "fall2025/rtw":   ["women"],  "spring2025/rtw":    ["women"],
        "fall2025/couture":["women"], "spring2025/couture":["women"],
        "fall2025/resort":["women"],  "spring2025/resort": ["women"],

        "fall2024/rtw":    ["women"], "spring2024/rtw":    ["women"],
        "fall2024/couture":["women"], "spring2024/couture":["women"], 
        "fall2024/resort": ["women"], "spring2024/resort": ["women"],

      }
    },
    { initial: "LV",
      name: "Louis Vuitton",
      link: "",
      categories: { "fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"], 
                    "fall2025": ["rtw","resort"], "spring2025": ["rtw","resort"],
                    "fall2024": ["rtw","resort"], "spring2024": ["rtw","resort"] },
      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
        "fall2026/rtw":   ["women","men"],     "spring2026/rtw":["women","men"],
        "fall2026/resort":["women","men"],     "spring2026/resort": ["women","men"],

        "fall2025/rtw":  ["women","men"],      "spring2025/rtw":["women","men"],
        "fall2025/resort":   ["women","men"],  "spring2025/resort": ["women","men"],
        
        "fall2024/rtw":  ["women","men"],      "spring2024/rtw":["women","men"],
        "fall2024/resort":   ["women","men"],  "spring2024/resort": ["women","men"],
      }
    },
    { initial: "B",
      name: "Balenciaga",
      link: "",
      categories:{"fall2026":["rtw","resort"],           "spring2026":["rtw","resort"],
                  "fall2025":["rtw","resort","couture"], "spring2025":["rtw","resort"], 
                  "fall2024":["rtw","resort","couture"], "spring2024":["rtw","resort"] },

        seasons: ["fall2026", "spring2026", 
                  "fall2025", "spring2025", 
                  "fall2024", "spring2024"],

      subcategories: {
                  "fall2026/rtw":   ["women"],      "spring2026/rtw":   ["women"], 
                  "fall2026/resort":["women"],      "spring2026/resort":["women"],

                  "fall2025/rtw":   ["women"],      "spring2025/rtw":   ["women"],  
                  "fall2025/resort":["women"],      "spring2025/resort":["women"],      
                  "fall2025/couture":["women"],     

                  "fall2024/rtw":   ["women"],      "spring2024/rtw":   ["women"], 
                  "fall2024/resort":["women"],      "spring2024/resort":["women"],
                  "fall2024/couture":["women"],     
      }
    },
  ],
  more: [
    { initial: "GV",
      name: "Givenchy",
      link: "",
      categories:{"fall2026":["rtw"], "spring2026": ["rtw"], 
                  "fall2025":["rtw","resort"], "spring2025": ["rtw","resort"], 
                  "fall2024":["rtw","resort"], "spring2024": ["rtw","resort"] },
      seasons: ["fall2026", "spring2026", "fall2025", "spring2025", "fall2024", "spring2024"],
      subcategories: {
        "fall2026/rtw":     ["women"],      "spring2026/rtw":   ["women"],

        "fall2025/rtw":     ["women"],       
        "fall2025/resort":   ["women"],     "spring2025/resort": ["women"],

        "fall2024/rtw":     ["women","men"],"spring2024/rtw":   ["women","men"],
        "fall2024/resort":   ["women"],     "spring2024/resort": ["women"],
      }
    },

    { initial: "YSL",
      name: "Saint Laurent",
      link: "",
      categories: { "fall2026": ["rtw","resort"], "spring2026": ["rtw","resort"], 
                    "fall2025": ["rtw","resort"], "spring2025": ["rtw","resort"], 
                    "fall2024": ["rtw","resort"], "spring2024": ["rtw","resort"] },

      seasons:     ["fall2026", "spring2026", 
                    "fall2025", "spring2025", 
                    "fall2024", "spring2024"],

      subcategories: {
                  "fall2026/rtw":   ["women","men"], "spring2026/rtw":   ["women","men"],
                  "fall2026/resort":["women"],       "spring2026/resort": ["women"],
                  "fall2025/rtw":   ["women","men"], "spring2025/rtw":   ["women","men"],
                  "fall2025/resort":["women"],       "spring2025/resort": ["women"],
                  "fall2024/rtw":   ["women","men"], "spring2024/rtw": ["women","men"],
                  "fall2024/resort":["women"],       "spring2024/resort": ["women"],
      }
    },

    { initial: "D",
      name: "Christian Dior",
      link: "",
      categories:{ "fall2026":["rtw","resort"],           "spring2026":["rtw","resort","couture"],
                   "fall2025":["rtw","resort","couture"], "spring2025":["rtw","resort","couture"], 
                   "fall2024":["rtw","resort","couture"], "spring2024":["rtw","resort","couture"] },
     
      seasons: ["fall2026", "spring2026", 
                "fall2025", "spring2025", 
                "fall2024", "spring2024"],

      subcategories: {
                "fall2026/rtw":   ["women"],              "spring2026/rtw":["women"],   
                "fall2026/resort":["women"],              "spring2026/resort":["women"],      
                                                          "spring2026/couture":["women"],
                "fall2025/rtw":   ["women"],              "spring2025/rtw":["women"],      
                "fall2025/resort":["women"],              "spring2025/resort": ["women"],  
                "fall2025/couture":["women"],             "spring2025/couture":["women"],

                "fall2024/rtw":   ["women"],              "spring2024/rtw":["women"],    
                "fall2024/resort":["women"],              "spring2024/resort":["women"],    
                "fall2024/couture":["women"],             "spring2024/couture":["women"],
      }
    },
    { initial: "LW",
      name: "Loewe",
      link: "",
      categories: { "fall2026":["rtw"], "spring2026":["rtw"], 
                    "fall2025":["rtw"], "spring2025":["rtw"], 
                    "fall2024":["rtw"], "spring2024":["rtw"] },

      seasons:["fall2026", "spring2026",
               "fall2025", "spring2025", 
               "fall2024", "spring2024"],
      subcategories: {
        "fall2026/rtw":["women"],       "spring2026/rtw":["women"],
        "fall2025/rtw":["women"],       "spring2025/rtw":["women","men"],
        "fall2024/rtw":["women","men"], "spring2024/rtw":["women","men"],
      }
    },
  ],
},
};

// ── VOGUE URL BUILDER ─────────────────────────────────────────────────────────
// URL patterns:
// women's RTW:/fall-2026-ready-to-wear/brand
// women's Couture:/spring-2026-couture/brand
// women's Resort:/resort-2026/brand
// men's RTW/Couture:/fall-2026-menswear/brand
// men's Resort:/resort-2026-menswear/brand

const VOGUE_SEASON = {
  fall2026:   "fall-2026",
  spring2026: "spring-2026",
  fall2025:   "fall-2025",
  spring2025: "spring-2025",
  fall2024:   "fall-2024",
  spring2024: "spring-2024",

  fall2023:   "fall-2023",
  spring2023: "spring-2023",
  fall2022:   "fall-2022",
  spring2022: "spring-2022",
};

const VOGUE_SLUG = {
  //New York
  "Area":                    "area",
  "Coach":                   "coach",
  "Maria McManus":           "maria-mcmanus",
  "Marina Moscone":          "marina-moscone",
  "Michael Kors Collection": "michael-kors-collection",
  "Ralph Lauren":            "ralph-lauren",
  "Tory Burch":              "tory-burch",
  "Ulla Johnson":            "ulla-johnson",

  "Carolina Herrera":        "carolina-herrera",
  "Calvin Klein":            "calvin-klein-collection",
  "Cult Gaia":               "cult-gaia",
  "Proenza Scholuer":        "proenza-schouler",
  "Altuzarra":               "altuzarra",
  "Khaite":                  "khaite",
  "Thom Browne":             "thom-browne",
  "Anna Sui":                "anna-sui",
  "Sandy Liang":             "sandy-liang",
  "TWP":                     "twp",

  //London
  "Burberry":                "burberry-prorsum",
  "Erdem":                   "erdem",
  "Simone Rocha":            "simone-rocha",
  "JW Anderson":             "j-w-anderson",
  "Roksanda":                "roksanda",
  "Victoria Beckham":        "victoria-beckham",
  "Joseph":                  "joseph",
  "Temperley London":        "temperley-london",
  "Chopova Lowena":          "chopova-lowena",


  //Milan
  "Diesel":                   "diesel",
  "Gucci":                   "gucci",
  "Giorgio Armani":          "giorgio-armani",
  "Prada":                   "prada",
  "Fendi":                   "fendi",
  "Ferragamo":               "salvatore-ferragamo",
  "Bottega Veneta":          "bottega-veneta",
  "Valentino":               "valentino",
  "Dolce&Gabbana":           "dolce-gabbana",
  "Max Mara":                "max-mara",
  "Missoni":                 "missoni",
  "Marni":                   "marni",
  "MM6 Maison Margiela":     "mm6-maison-martin-margiela",


  // Paris
  "Chanel":                  "chanel",
  "Louis Vuitton":           "louis-vuitton",
  "Balenciaga":              "balenciaga",
  "Givenchy":                "givenchy",
  "Saint Laurent":           "saint-laurent",
  "Christian Dior":          "christian-dior",
  "Loewe":                   "loewe",
};

function getDesignerLink(name, season, mainCat, subCat, directLink) {
  if (directLink?.trim()) return directLink.trim();

  const slug      = VOGUE_SLUG[name];
  const seasonSeg = VOGUE_SEASON[season];
  if (!slug || !seasonSeg) return "#";

  const year = seasonSeg.split("-")[1];

  if (mainCat === "resort") {
    // Men's resort and women's resort have different Vogue URLs
    return subCat === "men"
      ? `https://www.vogue.com/fashion-shows/resort-${year}-menswear/${slug}`
      : `https://www.vogue.com/fashion-shows/resort-${year}/${slug}`;
  }

  if (subCat === "men") {
    return `https://www.vogue.com/fashion-shows/${seasonSeg}-menswear/${slug}`;
  }

  // Women's & kids: rtw or couture
  const catSeg = mainCat === "couture" ? "couture" : "ready-to-wear";
  return `https://www.vogue.com/fashion-shows/${seasonSeg}-${catSeg}/${slug}`;
}




//Under Navbar content banner
function YouTubeBanner() {
  return (
    <div className="yt_banner">
      <div className="yt_track">
        <span className="yt_content">
          Watch full runway collections on YouTube •
          <a
            href="https://www.youtube.com/@FFChannel_Official"
            target="_blank"
            rel="noreferrer"
            className="yt_button"
          >
            Visit Channel →
          </a>
        </span>

        {/* duplicate for smooth loop */}
        <span className="yt_content">
          Watch full runway collections on YouTube •
          <a
            href="https://www.youtube.com/@FFChannel_Official"
            target="_blank"
            rel="noreferrer"
            className="yt_button"
          >
            Visit Channel →
          </a>
        </span>

        <span className="yt_content">
          Watch full runway collections on YouTube •
          <a
            href="https://www.youtube.com/@FFChannel_Official"
            target="_blank"
            rel="noreferrer"
            className="yt_button"
          >
            Visit Channel →
          </a>
        </span>
      </div>
    </div>
  );
}


function Welcome({ season, setSeason, city, setCity, mainCat, setMainCat, subCat, setSubCat }) {
  const seasonLabel = SEASONS.find(s => s.id === season)?.label;
  const mainLabel   = MAIN_CATEGORIES.find(c => c.id === mainCat)?.label;
  const subLabel    = SUB_CATEGORIES.find(c => c.id === subCat)?.label;

  return (
    <header className="welcome_header">
      
      <h1 className="welcome_title">FASHION WEEK</h1>

      <div className="welcome_filters">
        <div className="welcome_filter_word">
          <label className="welcome_filter_label">Season</label>
          <select className="welcome_select_word" value={season} onChange={e => setSeason(e.target.value)}>
            {SEASONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        <div className="welcome_filter_word">
          <label className="welcome_filter_label">City</label>
          <select className="welcome_select_word" value={city} onChange={e => setCity(e.target.value)}>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="welcome_filter_word">
          <label className="welcome_filter_label">Category</label>
          <select className="welcome_select_word" value={mainCat} onChange={e => setMainCat(e.target.value)}>
            {MAIN_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        <div className="welcome_filter_word">
          <label className="welcome_filter_label">Collection</label>
          <select className="welcome_select_word" value={subCat} onChange={e => setSubCat(e.target.value)}>
            {SUB_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <p className="welcome_selected_word">
        <span>{seasonLabel}</span> -- {city} -- {mainLabel} -- {subLabel}
      </p>
    </header>
  );
}

function DesignerCard({ initial, name, link, season, mainCat, subCat, index = 0 }) {
  const resolvedLink = getDesignerLink(name, season, mainCat, subCat, link);
  return (
    <a
      href={resolvedLink}
      target="_blank"
      rel="noreferrer"
      className="designer_card"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <span className="designer_initial">{initial}</span>
      <p className="designer_name">{name}</p>
    </a>
  );
}

function Designers({ season, city, mainCat, subCat }) {
  const { featured, more } = CITY_DESIGNERS[city];

  const allDesigners = [...featured, ...more].filter(d =>
    d.seasons.includes(season) &&
    (d.categories[season] || []).includes(mainCat) &&
    (d.subcategories[`${season}/${mainCat}`] || []).includes(subCat)
  );

  const seasonLabel   = SEASONS.find(s => s.id === season)?.label;
  const categoryLabel = MAIN_CATEGORIES.find(c => c.id === mainCat)?.label;
  const subLabel      = SUB_CATEGORIES.find(c => c.id === subCat)?.label;

  const gridKey = `${season}-${city}-${mainCat}-${subCat}`;

  return (
    <section className="designers">
      <div className="designer_header">
        <span className="designer_label">Presenting</span>
        <h2 className="designer_title">Featured Designers</h2>
        <p className="designer_sublabel">{CITY_INFO[city]}</p>
      </div>

      {allDesigners.length === 0 ? (
        <p className="no-results" key={gridKey}>
          No {city} brands have a {subLabel} {categoryLabel} collection for {seasonLabel}.
        </p>
      ) : (
        <div key={gridKey} className="designers_grid">
          {allDesigners.map((d, i) => (
            <DesignerCard key={d.name} season={season} mainCat={mainCat} subCat={subCat} index={i} {...d} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default function FashionPage() {
  const [season,  setSeason]  = useState(SEASONS[0].id);
  const [city,    setCity]    = useState(CITIES[0]);
  const [mainCat, setMainCat] = useState(MAIN_CATEGORIES[0].id);
  const [subCat,  setSubCat]  = useState(SUB_CATEGORIES[0].id);

  return (
    <div>
      <YouTubeBanner />
      <Welcome
        season={season}   setSeason={setSeason}
        city={city}       setCity={setCity}
        mainCat={mainCat} setMainCat={setMainCat}
        subCat={subCat}   setSubCat={setSubCat}
      />
      <Designers season={season} city={city} mainCat={mainCat} subCat={subCat} />
    </div>
  );
}
