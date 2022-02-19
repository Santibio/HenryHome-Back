// serv ['catering','shops ','room service','pool','gym','sauna']
// fac ['Wifi','smoke detector','TV','dishwasher','washing machine','Air conditioning ']
const housesArray = [
  {
    name: "Hotelaso de primera",
    pricePerNight: 200,
    numberOfPeople: 3,
    numberOfBeds: 3,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["catering", "shops", "room service"],
    facilities: ["tv", "wifi"],
    location: 20,
    status: "Accepted",
    images: [
      "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg",
    ],
  },
  {
    name: "Hotel del pantano",
    pricePerNight: 500,
    numberOfPeople: 6,
    numberOfBeds: 3,
    description:
      "Somebody once told me the world is gonna roll me, Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: [],
    facilities: [],
    location: 13,
    status: "Accepted",
    images: [
      "https://i.pinimg.com/originals/d9/13/9d/d9139d39431c863465b17c6fcc839ee2.png",
    ],
  },
  {
    name: "Castillo de Dracula",
    pricePerNight: 1400,
    numberOfPeople: 1,
    numberOfBeds: 3,
    description:
      "El dueño es medio ortiva pero salis con la dentadura renovada, Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["catering", "shops", "room service", "pool", "gym", "sauna"],
    facilities: ["tv", "wifi", "dishwasher"],
    status: "Accepted",
    location: 2,
    images: [
      "https://estaticos.muyinteresante.es/uploads/images/article/609a37625bafe8cb16548c37/castillo-dracula_0.jpg",
    ],
  },
  {
    name: "Hotel piolinga",
    pricePerNight: 160,
    numberOfPeople: 5,
    numberOfBeds: 3,
    description:
      "No se pero yo me quedaria a vivir la verdad encima 160 peso ta re barato, Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["catering", "shops", "room service"],
    facilities: ["tv", "wifi", "Air conditioning "],
    location: 3,
    status: "Accepted",
    images: [
      "https://www.hola.com/imagenes/viajes/20190208137104/mejores-hoteles-tripadvisor-2019/0-645-792/mejores-hoteles-del-mundo-tripadvisor-m.jpg",
    ],
  },
  {
    name: "Aldea Ewok",
    pricePerNight: 200,
    numberOfPeople: 10,
    numberOfBeds: 3,
    description:
      "A veces tratan de comerte pero son buena onda, Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["gym", "sauna"],
    facilities: ["Wifi", "smoke detector", "TV"],
    location: 5,
    status: "Accepted",
    images: [
      "https://media.contentapi.ea.com/content/dam/walrus/images/2018/05/mapvista-ewokvillage-nologo.png.adapt.crop16x9.575p.png",
    ],
  },
  {
    name: "Hobbiton",
    pricePerNight: 5,
    numberOfPeople: 3,
    numberOfBeds: 3,
    description:
      "Re humildes son aca, Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["pool"],
    facilities: ["tv", "wifi"],
    location: 7,
    status: "Accepted",
    images: [
      "https://farm6.staticflickr.com/5492/14576186774_c28c3e308c_z.jpg",
    ],
  },
  {
    name: "Hogwarts",
    pricePerNight: 700,
    numberOfPeople: 3,
    numberOfBeds: 3,
    description:
      "El tema de que hayan nenes dando vueltas 24/7 es medio molesto pero te regalan un elfo domestico, Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["catering", "shops", "room service"],
    facilities: ["dishwasher", "washing machine"],
    location: 20,
    status: "Accepted",
    images: [
      "https://static.wikia.nocookie.net/esharrypotter/images/2/23/Hogwartsmatte1c2_%282%29.jpg/revision/latest?cb=20110516235323",
    ],
  },
  {
    name: "Bates Hotel",
    pricePerNight: 230,
    numberOfPeople: 5,
    numberOfBeds: 3,
    description:
      "No recomendable ducharse en este hotel, Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["catering", "shops", "room service"],
    facilities: ["washing machine"],
    location: 8,
    images: ["https://www.ecartelera.com/images/sets/16500/16595.jpg"],
    status: "Accepted",
  },
  {
    name: "Fabrica de Chocolate",
    pricePerNight: 450,
    numberOfPeople: 7,
    numberOfBeds: 3,
    description:
      "EFECTOS SECUNDARIOS: salis violeta. Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["shops ", "room service"],
    facilities: ["tv", "wifi"],
    location: 9,
    images: ["https://img.ecartelera.com/noticias/fotos/40500/40521/2.jpg"],
    status: "Accepted",
  },
  {
    name: "demo10",
    pricePerNight: 200,
    numberOfPeople: 3,
    numberOfBeds: 3,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["catering", "shops", "room service"],
    facilities: ["tv", "wifi"],
    location: 20,
    images: [
      "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg",
    ],
    status: "Accepted",
  },
  {
    name: "demo11",
    pricePerNight: 200,
    numberOfPeople: 3,
    numberOfBeds: 3,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["catering", "shops", "room service"],
    facilities: ["tv", "wifi"],
    location: 15,
    images: [
      "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg",
    ],
    status: "Accepted",
  },
  {
    name: "demo12",
    pricePerNight: 200,
    numberOfPeople: 3,
    numberOfBeds: 3,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    houseRules:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aut facere et totam voluptas dolorum repellat ullam maxime architecto, obcaecati at maiores facilis minus recusandae perferendis tempore illum rem. Quia.",
    services: ["catering", "shops", "room service"],
    facilities: ["tv", "wifi"],
    location: 12,
    images: [
      "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg",
    ],
    status: "Accepted",
  },
];

module.exports = {
  housesArray,
};
