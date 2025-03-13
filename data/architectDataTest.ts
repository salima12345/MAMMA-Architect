interface Architect {
    name: string;
    birthDate: string;
    deathDate?: string; 
    bio: string;
    education: {
        school: string;
        location: {
            lat: number;
            lng: number;
        };
    };
    projects: {
        city: string;
        location?: {
            lat: number;
            lng: number;
        };
        works: string[];
    }[];
    offices: {
        lat: number;
        lng: number;
    }[];
}

const architects: Architect[] = [
    {
        name: "Aziz Lazrak",
        birthDate: "1938-04-15",
        deathDate: "2014-06-10",
        bio: "One of Morocco's most renowned architects, known for integrating traditional Moroccan designs with modern architecture.",
        education: {
            school: "École Spéciale d'Architecture",
            location: { lat: 48.847015, lng: 2.314849 },
        },
        projects: [
            {
                city: "Casablanca",
                location: { lat: 33.573110, lng: -7.589843 },
                works: ["Twin Center"]
            },
            {
                city: "Rabat",
                location: { lat: 34.020882, lng: -6.841650 },
                works: ["National Library of Morocco"]
            }
        ],
        offices: [
            { lat: 33.573110, lng: -7.589843 }, // Casablanca
            { lat: 34.020882, lng: -6.841650 }  // Rabat
        ]
    },
    {
        name: "Abdelkader Fassi Fihri",
        birthDate: "1945-02-10",
        bio: "A Moroccan architect famous for his sustainable urban designs and restoration of historical landmarks.",
        education: {
            school: "Polytechnic School of Paris",
            location: { lat: 48.804833, lng: 2.229878 },
        },
        projects: [
            {
                city: "Fes",
                location: { lat: 34.033126, lng: -5.000548 },
                works: ["Restoration of Fes Medina"]
            },
            {
                city: "Marrakech",
                location: { lat: 31.629472, lng: -7.981084 },
                works: ["Sustainable Housing Project"]
            }
        ],
        offices: [
            { lat: 34.033126, lng: -5.000548 }, // Fes
            { lat: 31.629472, lng: -7.981084 }  // Marrakech
        ]
    },
    {
        name: "Rachid Andaloussi",
        birthDate: "1955-08-21",
        bio: "Known for blending modernist styles with Moroccan heritage, Rachid designed iconic buildings in Casablanca.",
        education: {
            school: "École Nationale Supérieure d'Architecture de Paris-Belleville",
            location: { lat: 48.866667, lng: 2.383333 },
        },
        projects: [
            {
                city: "Casablanca",
                location: { lat: 33.573110, lng: -7.589843 },
                works: ["Casa-Port Station", "Bank Al-Maghrib Headquarters"]
            }
        ],
        offices: [
            { lat: 33.573110, lng: -7.589843 } // Casablanca
        ]
    },
    {
        name: "Karim Chakor",
        birthDate: "1967-03-05",
        bio: "An architect who advocates for eco-friendly designs and specializes in residential and urban planning in Morocco.",
        education: {
            school: "Royal Danish Academy of Fine Arts",
            location: { lat: 55.682562, lng: 12.578544 },
        },
        projects: [
            {
                city: "Rabat",
                location: { lat: 34.020882, lng: -6.841650 },
                works: ["Eco-Quartier Hay Riad"]
            },
            {
                city: "Agadir",
                location: { lat: 30.427755, lng: -9.598107 },
                works: ["Green Valley Project"]
            }
        ],
        offices: [
            { lat: 34.020882, lng: -6.841650 }, // Rabat
            { lat: 30.427755, lng: -9.598107 }  // Agadir
        ]
    },
    {
        name: "Hassan El Glaoui",
        birthDate: "1940-07-12",
        bio: "Focused on public spaces and cultural centers, Hassan's designs are found across Morocco's urban landscapes.",
        education: {
            school: "École des Beaux-Arts",
            location: { lat: 48.846221, lng: 2.337160 },
        },
        projects: [
            {
                city: "Meknes",
                location: { lat: 33.895848, lng: -5.534712 },
                works: ["Cultural Center of Meknes"]
            },
            {
                city: "Tangier",
                location: { lat: 35.759465, lng: -5.833954 },
                works: ["Tangier Grand Theatre"]
            }
        ],
        offices: [
            { lat: 33.895848, lng: -5.534712 }, // Meknes
            { lat: 35.759465, lng: -5.833954 }  // Tangier
        ]
    },
    {
        name: "Fatima Zahra Lahlou",
        birthDate: "1980-11-30",
        bio: "One of the leading female architects in Morocco, she is celebrated for her innovative residential designs.",
        education: {
            school: "École Nationale d'Architecture de Rabat",
            location: { lat: 34.017809, lng: -6.849773 },
        },
        projects: [
            {
                city: "Casablanca",
                location: { lat: 33.573110, lng: -7.589843 },
                works: ["Luxury Villas Project"]
            },
            {
                city: "Rabat",
                location: { lat: 34.020882, lng: -6.841650 },
                works: ["Affordable Housing Units"]
            }
        ],
        offices: [
            { lat: 33.573110, lng: -7.589843 } // Casablanca
        ]
    },
    {
        name: "Yassine Benslimane",
        birthDate: "1978-02-20",
        bio: "A Moroccan architect who specializes in commercial spaces and urban regeneration.",
        education: {
            school: "Technische Universität Berlin",
            location: { lat: 52.512645, lng: 13.326820 },
        },
        projects: [
            {
                city: "Tangier",
                location: { lat: 35.759465, lng: -5.833954 },
                works: ["Tangier Marina Mall"]
            },
            {
                city: "Casablanca",
                location: { lat: 33.573110, lng: -7.589843 },
                works: ["City Center Mall"]
            }
        ],
        offices: [
            { lat: 33.573110, lng: -7.589843 } // Casablanca
        ]
    },
    {
        name: "Amine Tadlaoui",
        birthDate: "1985-09-14",
        bio: "Known for integrating technology into architectural designs, with several smart buildings in Morocco.",
        education: {
            school: "Massachusetts Institute of Technology",
            location: { lat: 42.360091, lng: -71.094160 },
        },
        projects: [
            {
                city: "Rabat",
                location: { lat: 34.020882, lng: -6.841650 },
                works: ["Smart Office Park"]
            },
            {
                city: "Casablanca",
                location: { lat: 33.573110, lng: -7.589843 },
                works: ["Tech Hub"]
            }
        ],
        offices: [
            { lat: 34.020882, lng: -6.841650 }, // Rabat
            { lat: 33.573110, lng: -7.589843 } // Casablanca
        ]
    }
];
