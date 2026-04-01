import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Map.css'
import L from 'leaflet'

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

const Map = () => {
  const [mapType, setMapType] = useState('roadmap')

  // Tree data
  const treeData = [
    {
        "id": 632,
        "latitude": -29.86846928912922,
        "longitude": -50.15431523323059,
        "plantGroup": {
            "species": {
                "commonName": "Cedro",
                "scientificName": "Cedrela fissilis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 633,
        "latitude": -29.86667365213855,
        "longitude": -50.15468001365662,
        "plantGroup": {
            "species": {
                "commonName": "Cedro",
                "scientificName": "Cedrela fissilis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 634,
        "latitude": -29.86685973001158,
        "longitude": -50.15452980995179,
        "plantGroup": {
            "species": {
                "commonName": "Cedro",
                "scientificName": "Cedrela fissilis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 635,
        "latitude": -29.86703650366952,
        "longitude": -50.15439033508301,
        "plantGroup": {
            "species": {
                "commonName": "Cedro",
                "scientificName": "Cedrela fissilis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 636,
        "latitude": -29.86726910011067,
        "longitude": -50.1542615890503,
        "plantGroup": {
            "species": {
                "commonName": "Angico-vermelho",
                "scientificName": "Parapiptadenia rigida",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 637,
        "latitude": -29.86743656921256,
        "longitude": -50.15417575836182,
        "plantGroup": {
            "species": {
                "commonName": "Angico-vermelho",
                "scientificName": "Parapiptadenia rigida",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 638,
        "latitude": -29.86764125328866,
        "longitude": -50.15399336814881,
        "plantGroup": {
            "species": {
                "commonName": "Angico-vermelho",
                "scientificName": "Parapiptadenia rigida",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 639,
        "latitude": -29.86783663315141,
        "longitude": -50.15382170677186,
        "plantGroup": {
            "species": {
                "commonName": "Tarumã",
                "scientificName": "Vitex megapotamica",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 640,
        "latitude": -29.87021837595419,
        "longitude": -50.15339255332947,
        "plantGroup": {
            "species": {
                "commonName": "Tarumã",
                "scientificName": "Vitex megapotamica",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 544,
        "latitude": -29.86654339742095,
        "longitude": -50.15616059303284,
        "plantGroup": {
            "species": {
                "commonName": "Aroeira-vermelha",
                "scientificName": "Schinus terebinthifolius",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 545,
        "latitude": -29.86730631549093,
        "longitude": -50.15564560890198,
        "plantGroup": {
            "species": {
                "commonName": "Aroeira-vermelha",
                "scientificName": "Schinus terebinthifolius",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 546,
        "latitude": -29.86538970535638,
        "longitude": -50.15648245811463,
        "plantGroup": {
            "species": {
                "commonName": "Aroeira-vermelha",
                "scientificName": "Schinus terebinthifolius",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 547,
        "latitude": -29.86674808332942,
        "longitude": -50.15607476234437,
        "plantGroup": {
            "species": {
                "commonName": "Aroeira-vermelha",
                "scientificName": "Schinus terebinthifolius",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 548,
        "latitude": -29.86559439363158,
        "longitude": -50.15634298324586,
        "plantGroup": {
            "species": {
                "commonName": "Aroeira-vermelha",
                "scientificName": "Schinus terebinthifolius",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 549,
        "latitude": -29.8671016307277,
        "longitude": -50.15581727027894,
        "plantGroup": {
            "species": {
                "commonName": "Aroeira-vermelha",
                "scientificName": "Schinus terebinthifolius",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 550,
        "latitude": -29.86578977750255,
        "longitude": -50.15623569488525,
        "plantGroup": {
            "species": {
                "commonName": "Aroeira-vermelha",
                "scientificName": "Schinus terebinthifolius",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 551,
        "latitude": -29.86620845593773,
        "longitude": -50.15594601631165,
        "plantGroup": {
            "species": {
                "commonName": "Aroeira-vermelha",
                "scientificName": "Schinus terebinthifolius",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 552,
        "latitude": -29.86597585702396,
        "longitude": -50.15612840652467,
        "plantGroup": {
            "species": {
                "commonName": "Aroeira-vermelha",
                "scientificName": "Schinus terebinthifolius",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 553,
        "latitude": -29.8663759268199,
        "longitude": -50.15581727027894,
        "plantGroup": {
            "species": {
                "commonName": "Aroeira-vermelha",
                "scientificName": "Schinus terebinthifolius",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 554,
        "latitude": -29.86675738722436,
        "longitude": -50.15554904937745,
        "plantGroup": {
            "species": {
                "commonName": "Chal-chal",
                "scientificName": "Allophylus edulis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 555,
        "latitude": -29.86654339742095,
        "longitude": -50.1557207107544,
        "plantGroup": {
            "species": {
                "commonName": "Chal-chal",
                "scientificName": "Allophylus edulis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 556,
        "latitude": -29.86716675774337,
        "longitude": -50.15525937080384,
        "plantGroup": {
            "species": {
                "commonName": "Chal-chal",
                "scientificName": "Allophylus edulis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 557,
        "latitude": -29.8674086577151,
        "longitude": -50.15511989593507,
        "plantGroup": {
            "species": {
                "commonName": "Chal-chal",
                "scientificName": "Allophylus edulis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 558,
        "latitude": -29.86760403803332,
        "longitude": -50.15498042106628,
        "plantGroup": {
            "species": {
                "commonName": "Chal-chal",
                "scientificName": "Allophylus edulis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 559,
        "latitude": -29.86779011417118,
        "longitude": -50.15479803085328,
        "plantGroup": {
            "species": {
                "commonName": "Chal-chal",
                "scientificName": "Allophylus edulis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 560,
        "latitude": -29.86798549374241,
        "longitude": -50.1546585559845,
        "plantGroup": {
            "species": {
                "commonName": "Chal-chal",
                "scientificName": "Allophylus edulis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 561,
        "latitude": -29.86825530299747,
        "longitude": -50.15448689460754,
        "plantGroup": {
            "species": {
                "commonName": "Chal-chal",
                "scientificName": "Allophylus edulis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 562,
        "latitude": -29.86778081037252,
        "longitude": -50.1553237438202,
        "plantGroup": {
            "species": {
                "commonName": "Chal-chal",
                "scientificName": "Allophylus edulis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 563,
        "latitude": -29.86799479752197,
        "longitude": -50.15517354011536,
        "plantGroup": {
            "species": {
                "commonName": "Chal-chal",
                "scientificName": "Allophylus edulis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 564,
        "latitude": -29.86845068165773,
        "longitude": -50.15491604804993,
        "plantGroup": {
            "species": {
                "commonName": "Cambará",
                "scientificName": "Gochnatia polymorpha",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 565,
        "latitude": -29.86825530299747,
        "longitude": -50.15502333641053,
        "plantGroup": {
            "species": {
                "commonName": "Cambará",
                "scientificName": "Gochnatia polymorpha",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 566,
        "latitude": -29.86872048965477,
        "longitude": -50.15472292900086,
        "plantGroup": {
            "species": {
                "commonName": "Cambará",
                "scientificName": "Gochnatia polymorpha",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 567,
        "latitude": -29.86532457718078,
        "longitude": -50.15604257583618,
        "plantGroup": {
            "species": {
                "commonName": "Cambará",
                "scientificName": "Gochnatia polymorpha",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 568,
        "latitude": -29.86554787360591,
        "longitude": -50.15591382980347,
        "plantGroup": {
            "species": {
                "commonName": "Cambará",
                "scientificName": "Gochnatia polymorpha",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 569,
        "latitude": -29.86577116953132,
        "longitude": -50.15578508377076,
        "plantGroup": {
            "species": {
                "commonName": "Cambará",
                "scientificName": "Gochnatia polymorpha",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 570,
        "latitude": -29.86619915199159,
        "longitude": -50.15551686286926,
        "plantGroup": {
            "species": {
                "commonName": "Cambará",
                "scientificName": "Gochnatia polymorpha",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 571,
        "latitude": -29.86601307288661,
        "longitude": -50.15565633773804,
        "plantGroup": {
            "species": {
                "commonName": "Cambará",
                "scientificName": "Gochnatia polymorpha",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 572,
        "latitude": -29.86639453467833,
        "longitude": -50.15536665916443,
        "plantGroup": {
            "species": {
                "commonName": "Farinha-seca",
                "scientificName": "Albizia niopoides",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 573,
        "latitude": -29.86653409350605,
        "longitude": -50.15522718429566,
        "plantGroup": {
            "species": {
                "commonName": "Farinha-seca",
                "scientificName": "Albizia niopoides",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 574,
        "latitude": -29.86674808332942,
        "longitude": -50.15509843826295,
        "plantGroup": {
            "species": {
                "commonName": "Farinha-seca",
                "scientificName": "Albizia niopoides",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 575,
        "latitude": -29.86712023845079,
        "longitude": -50.15480875968933,
        "plantGroup": {
            "species": {
                "commonName": "Farinha-seca",
                "scientificName": "Albizia niopoides",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 576,
        "latitude": -29.86695276881796,
        "longitude": -50.15492677688599,
        "plantGroup": {
            "species": {
                "commonName": "Farinha-seca",
                "scientificName": "Albizia niopoides",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 577,
        "latitude": -29.86739935388087,
        "longitude": -50.15463709831238,
        "plantGroup": {
            "species": {
                "commonName": "Farinha-seca",
                "scientificName": "Albizia niopoides",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 578,
        "latitude": -29.86760403803332,
        "longitude": -50.15446543693542,
        "plantGroup": {
            "species": {
                "commonName": "Farinha-seca",
                "scientificName": "Albizia niopoides",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 579,
        "latitude": -29.86787384831998,
        "longitude": -50.15429377555847,
        "plantGroup": {
            "species": {
                "commonName": "Farinha-seca",
                "scientificName": "Albizia niopoides",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 580,
        "latitude": -29.86812505034474,
        "longitude": -50.15414357185364,
        "plantGroup": {
            "species": {
                "commonName": "Capororoca",
                "scientificName": "Myrsine spp.",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 581,
        "latitude": -29.86902751166036,
        "longitude": -50.15458345413209,
        "plantGroup": {
            "species": {
                "commonName": "Capororoca",
                "scientificName": "Myrsine spp.",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 582,
        "latitude": -29.8684041629638,
        "longitude": -50.15391826629639,
        "plantGroup": {
            "species": {
                "commonName": "Capororoca",
                "scientificName": "Myrsine spp.",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 583,
        "latitude": -29.86878561561369,
        "longitude": -50.15428304672241,
        "plantGroup": {
            "species": {
                "commonName": "Capororoca",
                "scientificName": "Myrsine spp.",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 584,
        "latitude": -29.86873909707592,
        "longitude": -50.15390753746033,
        "plantGroup": {
            "species": {
                "commonName": "Capororoca",
                "scientificName": "Myrsine spp.",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 585,
        "latitude": -29.86925079979826,
        "longitude": -50.15445470809937,
        "plantGroup": {
            "species": {
                "commonName": "Capororoca",
                "scientificName": "Myrsine spp.",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 586,
        "latitude": -29.86904611902428,
        "longitude": -50.15416502952576,
        "plantGroup": {
            "species": {
                "commonName": "Capororoca",
                "scientificName": "Myrsine spp.",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 587,
        "latitude": -29.8693252290665,
        "longitude": -50.15395045280457,
        "plantGroup": {
            "species": {
                "commonName": "Branquilho",
                "scientificName": "Sebastiania brasiliensis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 588,
        "latitude": -29.8689809932354,
        "longitude": -50.15390753746033,
        "plantGroup": {
            "species": {
                "commonName": "Branquilho",
                "scientificName": "Sebastiania brasiliensis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 589,
        "latitude": -29.86937174733094,
        "longitude": -50.15417575836182,
        "plantGroup": {
            "species": {
                "commonName": "Branquilho",
                "scientificName": "Sebastiania brasiliensis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 590,
        "latitude": -29.86953921290339,
        "longitude": -50.15435814857484,
        "plantGroup": {
            "species": {
                "commonName": "Branquilho",
                "scientificName": "Sebastiania brasiliensis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 591,
        "latitude": -29.86925079979826,
        "longitude": -50.15368223190308,
        "plantGroup": {
            "species": {
                "commonName": "Branquilho",
                "scientificName": "Sebastiania brasiliensis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 592,
        "latitude": -29.86948339107714,
        "longitude": -50.15366077423096,
        "plantGroup": {
            "species": {
                "commonName": "Branquilho",
                "scientificName": "Sebastiania brasiliensis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 593,
        "latitude": -29.86965085646217,
        "longitude": -50.15384316444398,
        "plantGroup": {
            "species": {
                "commonName": "Branquilho",
                "scientificName": "Sebastiania brasiliensis",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 594,
        "latitude": -29.86971598181376,
        "longitude": -50.15406847000123,
        "plantGroup": {
            "species": {
                "commonName": "Guajuvira",
                "scientificName": "Patagonula americana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 595,
        "latitude": -29.86998578638888,
        "longitude": -50.15408992767335,
        "plantGroup": {
            "species": {
                "commonName": "Guajuvira",
                "scientificName": "Patagonula americana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 596,
        "latitude": -29.87006021510877,
        "longitude": -50.1538646221161,
        "plantGroup": {
            "species": {
                "commonName": "Guajuvira",
                "scientificName": "Patagonula americana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 597,
        "latitude": -29.8699485720081,
        "longitude": -50.15361785888672,
        "plantGroup": {
            "species": {
                "commonName": "Guajuvira",
                "scientificName": "Patagonula americana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 598,
        "latitude": -29.86973458904927,
        "longitude": -50.15339255332947,
        "plantGroup": {
            "species": {
                "commonName": "Guajuvira",
                "scientificName": "Patagonula americana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 599,
        "latitude": -29.86854371898051,
        "longitude": -50.15452980995179,
        "plantGroup": {
            "species": {
                "commonName": "Guajuvira",
                "scientificName": "Patagonula americana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 600,
        "latitude": -29.86819017669237,
        "longitude": -50.15474438667298,
        "plantGroup": {
            "species": {
                "commonName": "Canjerana",
                "scientificName": "Cabralea canjerana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 601,
        "latitude": -29.86883213412974,
        "longitude": -50.15363931655884,
        "plantGroup": {
            "species": {
                "commonName": "Canjerana",
                "scientificName": "Cabralea canjerana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 602,
        "latitude": -29.86902751166036,
        "longitude": -50.15348911285401,
        "plantGroup": {
            "species": {
                "commonName": "Canjerana",
                "scientificName": "Cabralea canjerana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 603,
        "latitude": -29.86919497781064,
        "longitude": -50.15338182449342,
        "plantGroup": {
            "species": {
                "commonName": "Canjerana",
                "scientificName": "Cabralea canjerana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 604,
        "latitude": -29.86939965827921,
        "longitude": -50.15323162078858,
        "plantGroup": {
            "species": {
                "commonName": "Canjerana",
                "scientificName": "Cabralea canjerana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 605,
        "latitude": -29.86561300163577,
        "longitude": -50.15554904937745,
        "plantGroup": {
            "species": {
                "commonName": "Canjerana",
                "scientificName": "Cabralea canjerana",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 606,
        "latitude": -29.86578977750255,
        "longitude": -50.15539884567261,
        "plantGroup": {
            "species": {
                "commonName": "Pitanga",
                "scientificName": "Eugenia uniflora",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 607,
        "latitude": -29.86595724908745,
        "longitude": -50.15519499778748,
        "plantGroup": {
            "species": {
                "commonName": "Pitanga",
                "scientificName": "Eugenia uniflora",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 608,
        "latitude": -29.86624567171362,
        "longitude": -50.1550018787384,
        "plantGroup": {
            "species": {
                "commonName": "Pitanga",
                "scientificName": "Eugenia uniflora",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 609,
        "latitude": -29.86612472039124,
        "longitude": -50.15509843826295,
        "plantGroup": {
            "species": {
                "commonName": "Pitanga",
                "scientificName": "Eugenia uniflora",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 610,
        "latitude": -29.86649687783775,
        "longitude": -50.15483021736145,
        "plantGroup": {
            "species": {
                "commonName": "Pitanga",
                "scientificName": "Eugenia uniflora",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 611,
        "latitude": -29.86806922772723,
        "longitude": -50.15368223190308,
        "plantGroup": {
            "species": {
                "commonName": "Pitanga",
                "scientificName": "Eugenia uniflora",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 612,
        "latitude": -29.86828321425808,
        "longitude": -50.15358567237854,
        "plantGroup": {
            "species": {
                "commonName": "Guabiroba",
                "scientificName": "Campomanesia xanthocarpa",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 613,
        "latitude": -29.8684599853939,
        "longitude": -50.15339255332947,
        "plantGroup": {
            "species": {
                "commonName": "Guabiroba",
                "scientificName": "Campomanesia xanthocarpa",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 614,
        "latitude": -29.86867397108663,
        "longitude": -50.15324234962463,
        "plantGroup": {
            "species": {
                "commonName": "Guabiroba",
                "scientificName": "Campomanesia xanthocarpa",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 615,
        "latitude": -29.86896238585934,
        "longitude": -50.15301704406739,
        "plantGroup": {
            "species": {
                "commonName": "Guabiroba",
                "scientificName": "Campomanesia xanthocarpa",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 616,
        "latitude": -29.86911124477064,
        "longitude": -50.15289902687073,
        "plantGroup": {
            "species": {
                "commonName": "Uvaia",
                "scientificName": "Eugenia pyriformis",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 617,
        "latitude": -29.86934383637489,
        "longitude": -50.15282392501832,
        "plantGroup": {
            "species": {
                "commonName": "Uvaia",
                "scientificName": "Eugenia pyriformis",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 618,
        "latitude": -29.86967876733235,
        "longitude": -50.15295267105103,
        "plantGroup": {
            "species": {
                "commonName": "Uvaia",
                "scientificName": "Eugenia pyriformis",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 619,
        "latitude": -29.86972528543195,
        "longitude": -50.15313506126405,
        "plantGroup": {
            "species": {
                "commonName": "Uvaia",
                "scientificName": "Eugenia pyriformis",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 620,
        "latitude": -29.86988344680835,
        "longitude": -50.15324234962463,
        "plantGroup": {
            "species": {
                "commonName": "Araçá-amarelo",
                "scientificName": "Psidium cattleyanum",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 621,
        "latitude": -29.87029280450056,
        "longitude": -50.15377879142761,
        "plantGroup": {
            "species": {
                "commonName": "Araçá-amarelo",
                "scientificName": "Psidium cattleyanum",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 622,
        "latitude": -29.87016255450797,
        "longitude": -50.15296339988709,
        "plantGroup": {
            "species": {
                "commonName": "Araçá-amarelo",
                "scientificName": "Psidium cattleyanum",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 623,
        "latitude": -29.86955782017187,
        "longitude": -50.15262007713319,
        "plantGroup": {
            "species": {
                "commonName": "Araçá-amarelo",
                "scientificName": "Psidium cattleyanum",
                "category": "FRUIT_TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 624,
        "latitude": -29.86996717920023,
        "longitude": -50.1526951789856,
        "plantGroup": {
            "species": {
                "commonName": "Imbuia",
                "scientificName": "Ocotea porosa",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 625,
        "latitude": -29.86559439363158,
        "longitude": -50.15680432319642,
        "plantGroup": {
            "species": {
                "commonName": "Imbuia",
                "scientificName": "Ocotea porosa",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 626,
        "latitude": -29.86579908148686,
        "longitude": -50.15666484832764,
        "plantGroup": {
            "species": {
                "commonName": "Imbuia",
                "scientificName": "Ocotea porosa",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 627,
        "latitude": -29.86600376892224,
        "longitude": -50.15653610229493,
        "plantGroup": {
            "species": {
                "commonName": "Imbuia",
                "scientificName": "Ocotea porosa",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 628,
        "latitude": -29.86618054409671,
        "longitude": -50.15640735626221,
        "plantGroup": {
            "species": {
                "commonName": "Pau-ferro",
                "scientificName": "Libidibia ferrea",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 629,
        "latitude": -29.8663759268199,
        "longitude": -50.15632152557374,
        "plantGroup": {
            "species": {
                "commonName": "Pau-ferro",
                "scientificName": "Libidibia ferrea",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 630,
        "latitude": -29.86689694554455,
        "longitude": -50.15590310096741,
        "plantGroup": {
            "species": {
                "commonName": "Pau-ferro",
                "scientificName": "Libidibia ferrea",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 631,
        "latitude": -29.86691555330581,
        "longitude": -50.15542030334473,
        "plantGroup": {
            "species": {
                "commonName": "Pau-ferro",
                "scientificName": "Libidibia ferrea",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    },
    {
        "id": 641,
        "latitude": -29.86754821512431,
        "longitude": -50.15547394752503,
        "plantGroup": {
            "species": {
                "commonName": "Louro-pardo",
                "scientificName": "Cordia trichotoma",
                "category": "TREES"
            },
            "project": {
                "name": "Progetto pilota: Tekoá Kuaray Rese"
            }
        }
    }
  ]

  // Calculate center point
  const center = [-29.867, -50.154]

  // Tile layer URLs
  const tileLayerUrls = {
    roadmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  }

  return (
    <>
      {/* Hero Section */}
      <section className="map-hero">
        <div className="map-hero-content">
          <h1 className="map-hero-title">mapa das árvores</h1>
          <p className="map-hero-subtitle">
            Explore as árvores plantadas no projeto Tekoá Kuaray Rese
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-controls">
          <button
            className={`map-control-btn ${mapType === 'roadmap' ? 'active' : ''}`}
            onClick={() => setMapType('roadmap')}
          >
            Mapa
          </button>
          <button
            className={`map-control-btn ${mapType === 'satellite' ? 'active' : ''}`}
            onClick={() => setMapType('satellite')}
          >
            Satélite
          </button>
        </div>

        <MapContainer
          center={center}
          zoom={16}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileLayerUrls[mapType]}
          />
          {treeData.map((tree) => (
            <Marker
              key={tree.id}
              position={[tree.latitude, tree.longitude]}
            >
              <Popup>
                <div className="map-popup">
                  <h3 className="map-popup-title">{tree.plantGroup.species.commonName}</h3>
                  <p className="map-popup-scientific">{tree.plantGroup.species.scientificName}</p>
                  <span className="map-popup-category">{tree.plantGroup.species.category}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </>
  )
}

export default Map
