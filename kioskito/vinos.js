
window.listaVinos = [
    // === BLANCOS ===
    {
        id: "001",
        nombre: "La Bouteille",
        bodega: "Familia Cassone",
        variedades: "Chardonnay 60% – Viognier 30% – Torrontés 10%",
        region: "Luján de Cuyo, Mendoza",
        productor: "Federico Cassone",
        categoria: "Blancos",
        filter: "blancos",
        imagen: "img/kioskito/01-la bouteille.jpeg",
        detalle: "Familia Cassone —una bodega tradicional de Luján de Cuyo— lanzó su línea de vinos naturales con la mínima intervención posible, pensados por Federico Cassone, nieto de la primera generación de la familia que inició la producción vitivinícola. La Bouteille es un blanco proveniente de dicha región de Mendoza, compuesto por un 60% de Chardonnay, un 30% de Viognier y un 10% de Torrontés."
    },
    {
        id: "002",
        nombre: "Chacho Blanco",
        bodega: "Chacho Asensio",
        variedades: "Pedro Gimenez 65% - Moscatel Blanco 20%",
        region: "Villa Atuel, San Rafael, Mendoza",
        productor: "José Asensio",
        categoria: "Blancos",
        filter: "blancos",
        imagen: "img/kioskito/02-chacho criollas blancas.jpeg",
        detalle: "Chacho Blanco es un blanco de uvas criollas que tiene sabor a casa de la abuela. Es un vino sencillo, frutal y rico. No busca complejidad aromática ni de sabores. Es ATP."
    },

    // === NARANJOS ===
    {
        id: "003",
        nombre: "Galileo Naranjo",
        bodega: "Galileo",
        variedades: "Torrontés riojano 85% - Criollas 15%",
        region: "Chacras de Coria, Luján de Cuyo, Mendoza",
        productor: "Norberto Páez",
        categoria: "Naranjos",
        filter: "naranjos",
        imagen: "img/kioskito/03-galileo naranjo.jpeg",
        detalle: "Es un vino hecho a base de uvas criollas, mayormente Torrontés. Viene de Luján de Cuyo, una zona tradicional de Mendoza. Frutal y fácil de tomar. Fermenta en contacto con las pieles, lo que le da ese color naranja característico."
    },
    {
        id: "004",
        nombre: "Chacho Naranjas del Cielo",
        bodega: "Chacho Asensio",
        variedades: "Pedro Gimenez 65% - Moscatel Blanco 20%",
        region: "Villa Atuel, San Rafael, Mendoza",
        productor: "José Asensio",
        categoria: "Naranjos",
        filter: "naranjos",
        imagen: "img/kioskito/04-chacho naranjas del cielo.jpeg",
        detalle: "Vino hecho con uvas blancas. Tiene crianza oxidativa, lo que le aporta untuosidad en boca y más cuerpo, además de mucha versatilidad para combinar con comidas gracias al mayor cuerpo que le dan las pieles."
    },

    // === ROSADOS ===
    {
        id: "005",
        nombre: "Chacho Clarete de Criollas",
        bodega: "Chacho Asensio",
        variedades: "Cereza - Criolla Grande - Moscatel Rosado - Pedro Gimenez",
        region: "Villa Atuel, San Rafael, Mendoza",
        productor: "José Asensio",
        categoria: "Rosados",
        filter: "all",
        imagen: "img/kioskito/05-chacho clarete de criollas.jpeg",
        detalle: "Remite a las viejas épocas en las que se hacía vino mezclando uvas blancas y tintas, en este caso criollas, para lograr un vino jugoso y fácil de tomar."
    },

    // === TINTOS LIGEROS ===
    {
        id: "006",
        nombre: "La Grappe",
        bodega: "Familia Cassone",
        variedades: "Criolla Grande 90% - Tempranillo 10%",
        region: "Luján de Cuyo, Mendoza",
        productor: "Federico Cassone",
        categoria: "Tintos ligeros",
        filter: "tintos ligeros",
        imagen: "img/kioskito/06-la grappe criolla.jpeg",
        detalle: "Familia Cassone —una bodega tradicional de Luján de Cuyo— lanzó su línea de vinos naturales con la mínima intervención posible, pensados por Federico Cassone, nieto de la primera generación de la familia que inició la producción vitivinícola. La Grappe está compuesta por un 80% de Criolla y un 20% de Tempranillo para aportarle un poco de estructura."
    },
    {
        id: "007",
        nombre: "Les Astronautes Criolla",
        bodega: "",
        variedades: "Cereza 80% · Criolla Chica 20%",
        region: "Los Chacayes, Tunuyán, Mendoza",
        productor: "Emma Haas y Fredy Mestre",
        categoria: "Tintos ligeros",
        filter: "tintos ligeros",
        imagen: "img/kioskito/07 -les astronautes criolla.jpeg",
        detalle: "Criolla Grande, Chica y Cereza hacen a este blend de Criollas del Valle de Uco. Hechos por Emma y Fredy, una pareja anglofrancesa, que hacen vinos poco intervenidos."
    },
    {
        id: "008",
        nombre: "Rocamadre Criolla",
        bodega: "",
        variedades: "Criolla Chica y Criolla Grande",
        region: "Vista Flores, Tunuyán, Mendoza",
        productor: "Juanfa Suárez",
        categoria: "Tintos ligeros",
        filter: "tintos ligeros",
        imagen: "img/kioskito/08-rocamadre criolla tinta.jpeg",
        detalle: "La criolla más noble, fresca y jugosa que vas a tomar. Uno de nuestros favoritos, sin dudas. Viene de parrales viejos de más de 80 años de Vistaflores, Valle de Uco. Uno de los pocos que quedan en pie."
    },
    {
        id: "009",
        nombre: "La Cayetana Pinot Noir",
        bodega: "",
        variedades: "Pinot Noir",
        region: "Los Chacayes, Tunuyán, Mendoza",
        productor: "Eduardo Soler",
        categoria: "Tintos ligeros",
        filter: "tintos ligeros",
        imagen: "img/kioskito/09-la cayetana pinot noir.jpeg",
        detalle: "Con uva de Los Chacayes, Valle de Uco, este Pinot tiene la fruta roja típica de la variedad, racimo entero y crianza en barrica usada."
    },

    // === TINTOS CON CUERPO ===
    {
        id: "010",
        nombre: "Casa Ambrosía Malbec",
        bodega: "",
        variedades: "Malbec",
        region: "Gualtallary, Tupungato, Mendoza",
        productor: "Yono Thompson",
        categoria: "Tintos con cuerpo",
        filter: "tintos con cuerpo",
        imagen: "img/kioskito/10-casa ambrosía malbec.jpeg",
        detalle: "Casa Ambrosía Malbec es el típico triple B: Bueno, bonito, barato. Es ese amigue que nunca te deja tirado, es ese compañerx de laburo que siempre prepara el mate y trae facturas. Es el vino que jamás te va a dejar de gustar."
    },
    {
        id: "012",
        nombre: "Araucana Río de los Ciervos",
        bodega: "",
        variedades: "Malbec 97% - Merlot 3%",
        region: "Alto Valle de Río Negro, Patagonia",
        productor: "Ernesto Bajda",
        categoria: "Tintos con cuerpo",
        filter: "tintos con cuerpo",
        imagen: "img/kioskito/12-araucana río de los ciervos malbec.jpeg",
        detalle: "Vino de la bodega Ribera del Cuarzo, ubicada en el Valle de Río Negro. Lo que más lo destaca es que, al ser un Malbec de la Patagonia —una zona más fría—, tiene notas de ciruela que viran más hacia los frutos rojos, con algo ahumado y buena estructura, ya que son vinos más clásicos, con madera y 12 meses de contacto en barrica de roble. Son grandes vinos que aportan una visión distinta de lo que es un Malbec respecto de una zona tradicional como Mendoza."
    },
    {
        id: "013",
        nombre: "Luna Llena Blend",
        bodega: "Finca Ambrosía",
        variedades: "Malbec 50% - Cabernet Franc 50%",
        region: "Gualtallary, Tupungato, Mendoza",
        productor: "Yono Thompson",
        categoria: "Tintos con cuerpo",
        filter: "tintos con cuerpo",    
        imagen: "img/kioskito/13-luna llena cabernet franc - malbec.jpeg",
        detalle: "Le cae bien a todos. Es un 50/50 que proviene de Gualtallary y se cosecha en luna llena, momento en que la expresión de la fruta está en su mejor punto. Funciona tanto para gente más moderna que busca algo no tan corpulento, como para quienes son más conservadores y no salen del Malbec."
    },
    {
        id: "014",
        nombre: "La Coupe",
        bodega: "Familia Cassone",
        variedades: "Syrah",
        region: "Luján de Cuyo, Mendoza",
        productor: "Federico Cassone",
        categoria: "Tintos con cuerpo",
        filter: "tintos con cuerpo",
        imagen: "img/kioskito/14-la coupe syrah.jpeg",
        detalle: "Familia Cassone —una bodega tradicional de Luján de Cuyo— lanzó su línea de vinos naturales con la mínima intervención posible, pensados por Federico Cassone, nieto de la primera generación de la familia que inició la producción vitivinícola. La Coupe es un vino 100% syrah."
    },
    {
        id: "015",
        nombre: "Nodo Fuego",
        bodega: "",
        variedades: "Cabernet Franc",
        region: "Gualtallary, Tupungato, Mendoza",
        productor: "Matías Macías",
        categoria: "Tintos con cuerpo",
        filter: "tintos con cuerpo",
        imagen: "img/kioskito/15-nodo cabernet franc.jpeg",
        detalle: "Cabernet Franc de Gualtallary, Valle de Uco. Fluido en boca, con lo herbal característico del Franc, pero con la fruta más escondida por tratarse de vinos de clima frío."
    },
    {
        id: "016",
        nombre: "El Cabrito",
        bodega: "Santa Julia",
        variedades: "Cabernet Sauvignon",
        region: "Maipú, Mendoza",
        productor: "Ruben Ruffo",
        categoria: "Tintos con cuerpo",
        filter: "tintos con cuerpo",
        imagen: "img/kioskito/16-el cabrito cabernet sauvignon.jpeg",
        detalle: "Viene de Maipú, primera zona: poca altura y mucho calor. Es estructurado, con mucho carácter, pero por su vinificación resulta muy fluido y fácil de tomar. Un Cabernet Sauvignon fresco."
    },
    {
        id: "017",
        nombre: "Viña Única",
        bodega: "Finca Ambrosía",
        variedades: "Cabernet Sauvignon",
        region: "Gualtallary, Tupungato, Mendoza",
        productor: "Yono Thompson",
        categoria: "Tintos con cuerpo",
        filter: "Tintos con cuerpo",
        imagen: "img/kioskito/17-viña única cabernet sauvignon.jpeg",
        detalle: "El Cabernet Sauvignon de Ambrosía es famoso por ser de los mejores del Valle de Uco. Potencia típica de la variedad, pero sin embargo, un Cabernet suave y fresco."
    }
];

window.productos = window.listaVinos;








  // {
    //     id: "011",
    //     nombre: "Les Astronautes Malbec",
    //     bodega: "",
    //     variedades: "Malbec",
    //     region: "Barrancas, Maipú, Mendoza",
    //     productor: "Emma Haas y Fredy Mestre",
    //     categoria: "Tintos con cuerpo",
    //     filter: "tintos con cuerpo",
    //     imagen: "img/kioskito/11-les astronautes malbec.jpeg"
    // },