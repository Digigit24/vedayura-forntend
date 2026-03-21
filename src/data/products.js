const products = [
    {
        id: 1,
        name: "Diabocare Kit",
        category: "Kit",
        price: 0.0,
        Ingredients: "Bitter Gourd, Neem, Java Plum Seed, Colocynth, Giloy, Drumstick, Black Seed, Madagascar Periwinkle, Karanja Seed, Cinnamon, Bitter Almond, Fenugreek Seed, Tulsi, Arjuna Bark, Golden Shower leaf, Indian Rennet, Ginger, Bitter Chirata, Gymnema, Wild Asparagus, Ginseng, Ashwagandha, and Ivy Gourd.",
        Benefits: [
            "Improves the body's insulin response and helps maintain stable glucose levels.",
            "Supports better metabolism of sugar, carbohydrates & Digestive System.",
            "Helps reduce sugar cravings, Fat Metabolism & support Lifestyle eating habits."
        ],
        productType: "Blood Sugar Support Kit",
        productsInside: [
            "Diabocare Juice - 1000ml",
            "Diabocare Capsule - 120 capsules"
        ],
        servingSize: {
            liquid: "15 to 30 ml twice a day",
            capsule: "2 capsules twice a day"
        },
        images: [
            "/assets/diabocare-kit.png",
            "/assets/diabocare-kit-view.png",
            "/assets/diabocare-capsules.png",
            "/assets/diabocare-juice.png"
        ],
        stock: 50,
    },
    {
        id: 2,
        name: "Garcinia Plus",
        category: "Juice",
        price: 0.0,
        Ingredients: "Colocynth Fruit, Spreading Hogweed, Senna Leaves, Long Pepper, Cumin, Carom Seeds, Dry Ginger, Black Salt, Rock Salt, Borax, Flax Seed, Garcinia Cambogia, Soda, Black Seed, Elva, Garden Cress Seeds, Sakmuniya, Fennel Seeds, Black Pepper, Clove, Lemon, Cinnamon, Drumstick, Rhubarb Root, Qust-e-Shireen-Costus Root.",
        Benefits: [
            "Supports healthy weight management by helping control fat buildup.",
            "Helps reduce hunger and unnecessary cravings.",
            "Supports metabolism and helps to burn stored fat for energy.",
            "Improves digestion and supports natural body detox.",
            "Helps reduce sugar cravings, Fat Metabolism & support Lifestyle eating habits."
        ],
        productType: "For Weight Loss",
        servingSize: {
            liquid: "15 to 30 ml twice a day"
        },
        images: [
            "/assets/garcinia-plus-juice-box.png",
            "/assets/garcinia-plus-juice.png",
            "/assets/garcinia-plus-all.png"
        ],
        stock: 50,
    },
    {
        id: 3,
        name: "Garcinia Plus",
        category: "Capsules",
        price: 0.0,
        Ingredients: "Colocynth Fruit, Spreading Hogweed, Senna Leaves, Long Pepper, Cumin, Carom Seeds, Dry Ginger, Black Salt, Rock Salt, Borax, Flax Seed, Garcinia Cambogia, Soda, Black Seed, Elva, Garden Cress Seeds, Sakmuniya, Fennel Seeds, Black Pepper, Clove, Lemon, Cinnamon, Drumstick, Rhubarb Root, Qust-e-Shireen-Costus Root.",
        Benefits: [
            "Supports healthy weight management by helping control fat buildup.",
            "Helps reduce hunger and unnecessary cravings.",
            "Supports metabolism and helps to burn stored fat for energy.",
            "Improves digestion and supports natural body detox.",
            "Helps reduce sugar cravings, Fat Metabolism & support Lifestyle eating habits."
        ],
        productType: "For Weight Loss",
        servingSize: {
            capsule: "2 capsules twice a day"
        },
        images: [
            "/assets/garcinia-plus-capsules-box.png",
            "/assets/garcinia-plus-capsules.png",
            "/assets/garcinia-plus-all.png"
        ],
        stock: 50,
    },
    {
        id: 4,
        name: "Arthroplus",
        category: "Capsules",
        price: 0.0,
        Ingredients: "Ashwagandha, Black Nightshade, Giloy, Dodder, Mexican Poppy, Arjuna Bark, Suranjal Shirn, Extract Onion, Extract Garlic, Extract Ginger, Colocynth, Hardal Varkiya, Sangruf Rumi, Aloe Vera, Drumstick, Syrian Rue.",
        Benefits: [
            "Helps reduce joint pain and stiffness.",
            "Supports better joint flexibility and movement.",
            "Helps reduce inflammation in joints.",
            "Supports stronger bones and joint health."
        ],
        productType: "Herbal Joint Support",
        servingSize: {
            capsule: "2 capsules twice a day"
        },
        images: [
            "/assets/arthoplus-capsules-box.png",
            "/assets/arthoplus-capsules.png",
            "/assets/arthoplus-capsules-both.png"
        ],
        stock: 50,
    },
    {
        id: 5,
        name: "Digestive Churna",
        category: "Powder",
        price: 0.0,
        Ingredients: "Colocynth Fruit, Spreading Hogweed, Senna Leaves, Long Pepper, Cumin, Carom Seeds, Dry Ginger, Black Salt, Rock Salt, Borax, Flax Seed, Garcinia Cambogia, Soda, Black Seed, Elva, Garden Cress Seeds, Sakmuniya, Fennel Seeds, Black Pepper, Clove, Lemon, Cinnamon, Drumstick, Rhubarb Root, Licorice, Triphala, Mint, Kishti Shiri, Psyllium Husk, Qust-e-Shireen-Costus Root.",
        Benefits: [
            "Supports healthy digestion.",
            "Helps relieve gas and bloating.",
            "Improves metabolism & enzymes.",
            "Helps reduce acidity and indigestion.",
            "Supports overall gut health."
        ],
        productType: "Digestive Health Formula",
        servingSize: {
            powder: "1 teaspoon"
        },
        images: [
            "/assets/digestive-churna-box.webp",
            "/assets/digestive-churna.png",
            "/assets/digestive-churna-both.png"
        ],
        stock: 50,
    },
    {
        id: 6,
        name: "Immunity Booster Coffee",
        category: "Coffee",
        price: 0.0,
        Ingredients: "Tulsi, Soybean, Ginger, Cardamom, Lemon, Arjuna Bark, Fennel Seeds, Carom Seeds, Mint, Qust-e-Shireen-Costus Root.",
        Benefits: [
            "It has high protein intake.",
            "Boosts natural energy and reduces fatigue.",
            "Supports digestion and gut health.",
            "Helps improve focus and mental alertness.",
            "Rich in herbs that support overall wellness.",
            "Aids metabolism and daily vitality.",
            "Boosts immunity and helps the body fight viral infections."
        ],
        productType: "Immunity Booster",
        servingSize: {
            powder: "1 teaspoon"
        },
        images: [
            "/assets/immunity-booster-coffee-front.webp",
            "/assets/immunity-booster-coffee-back.png",
            "/assets/coffee-front-back.png"
        ],
        stock: 50,
    },
    {
        id: 7,
        name: "Apro-x",
        category: "Capsules",
        price: 0.0,
        Ingredients: "Ashwagandha, Wild Asparagus, Shilajit, White Musli, Velvet Bean Seeds, Hibiscus, Puncture Vine, Clove, Nutmeg, Salep Orchid, Pellitory Root, Indian Kudzu, Long Pepper, Saffron, Hygrophila Seeds.",
        Benefits: [
            "Boosts male energy and stamina.",
            "Helps reduce tiredness and fatigue.",
            "Supports physical strength and endurance.",
            "Improves male vitality and overall wellness.",
            "It has no side effect."
        ],
        productType: "Power Boost - For Male Vitality & Strength",
        servingSize: {
            capsule: "1 capsule a day"
        },
        images: [
            "/assets/aprox-capsules-box.png",
            "/assets/aprox-capsules.png",
            "/assets/aprox-capsules-both.png"
        ],
        stock: 50,
    },
    {
        id: 8,
        name: "H-Care",
        category: "Capsules",
        price: 0.0,
        Ingredients: "Arjuna Bark, Jawahar Mohra, Saffron, Black Pepper, Fennel Seeds, Guggul, Black Seed, Bay Leaf, Calcined Crab Preparation, Flax Seeds, Marigold Flower, Apple Vinegar, Giloy, Garlic, Greater Galangal, Indian Gooseberry, Fagonia, Nutmeg, Sandalwood, Desmostachya Grass.",
        Benefits: [
            "Supports healthy heart function and circulation.",
            "Helps maintain balanced cholesterol levels.",
            "Supports healthy blood pressure management.",
            "Helps improve overall cardiovascular health."
        ],
        productType: "For Healthy Blood Circulation",
        servingSize: {
            capsule: "2 capsules twice a day"
        },
        images: [
            "/assets/hcare-capsules-box.png",
            "/assets/hcare-capsules.png",
            "/assets/hcare-capsules-both.png"
        ],
        stock: 50,
    },
    {
        id: 9,
        name: "L-Care",
        category: "Juice",
        price: 0.0,
        Ingredients: "Colocynth Fruit, Spreading Hogweed, Senna Leaves, Long Pepper, Cumin, Carom Seeds, Dry Ginger, Black Salt, Rock Salt, Borax, Flax Seed, Garcinia Cambogia, Soda, Black Seed, Elva, Garden Cress Seeds, Convolvulus Scammonia, Fennel Seeds, Black Pepper, Clove, Lemon Cinnamon, Drumstick, Rhubarb Root, Licorice, Triphala, Mint, Psyllium Husk, Chicory, Tree Turmeric, Cubeb Pepper, Qust-e-Shireen-Costus Root, Ammonium Chloride, Bitter Chirata, Puncture.",
        Benefits: [
            "Supports healthy liver function and detoxification.",
            "Helps improve appetite and digestion naturally.",
            "Supports better metabolism and nutrient absorption.",
            "Helps boost overall energy and digestive health.",
            "Supports better absorption of nutrients from food.",
            "Helps maintain overall digestive balance and energy levels."
        ],
        productType: "Appetite Boost Juice",
        servingSize: {
            liquid: "15 to 30 ml twice a day"
        },
        images: [
            "/assets/lcare-juice-box.png",
            "/assets/lcare-juice.png",
            "/assets/lcare-all.png"
        ],
        stock: 50,
    },
    {
        id: 10,
        name: "L-Care",
        category: "Capsules",
        price: 0.0,
        Ingredients: "Colocynth Fruit, Spreading Hogweed, Senna Leaves, Long Pepper, Cumin, Carom Seeds, Dry Ginger, Black Salt, Rock Salt, Borax, Flax Seed, Garcinia Cambogia, Soda, Black Seed, Elva, Garden Cress Seeds, Convolvulus Scammonia, Fennel Seeds, Black Pepper, Clove, Lemon Cinnamon, Drumstick, Rhubarb Root, Licorice, Triphala, Mint, Psyllium Husk, Chicory, Tree Turmeric, Cubeb Pepper, Qust-e-Shireen-Costus Root, Ammonium Chloride, Bitter Chirata, Puncture.",
        Benefits: [
            "Supports healthy liver function and detoxification.",
            "Helps improve appetite and digestion naturally.",
            "Supports better metabolism and nutrient absorption.",
            "Helps boost overall energy and digestive health.",
            "Supports better absorption of nutrients from food.",
            "Helps maintain overall digestive balance and energy levels."
        ],
        productType: "Appetite Boost Capsule",
        servingSize: {
            capsule: "2 capsules twice a day"
        },
        images: [
            "/assets/lcare-capsules-box.png",
            "/assets/lcare-capsules.png",
            "/assets/lcare-all.png"
        ],
        stock: 50,
    },
    {
        id: 11,
        name: "Femveda - PCOD",
        category: "Juice",
        price: 0.0,
        Ingredients: "Arjuna Bark, Ashoka Bark, Mustard Seeds, Mountain Ebony, Punarnava, Cumin, Carom Seeds, Dry Ginger, Flax Seed, Black Seed, Elva, Fennel Seeds, Black Pepper, Clove, Lemon, Cinnamon, Fenugreek Seed, Alkanet Root, Cassia Seed, Heera Kashish, Majusab, Puncture Vine, Akki Ki Jad, Samar Musali-Fruit, Saffron, Zaffrl, Rue, Turmeric, Black Nightshade, Ashwagandha, Chicory, Alum.",
        Benefits: [
            "Supports PCOD/PCOS management.",
            "Helps regulate menstrual cycles.",
            "Supports hormonal balance.",
            "Promotes ovarian and reproductive health.",
            "Made with natural herbs (extract)."
        ],
        productType: "Femora Herbal Syrup - For Female Reproductive System",
        servingSize: {
            liquid: "15 to 30 ml twice a day"
        },
        images: [
            "/assets/femveda-juice-box.png",
            "/assets/femveda-juice.png",
            "/assets/femveda-juice-both.png"
        ],
        stock: 50,
    },
    {
        id: 12,
        name: "K-Care",
        category: "Juice",
        price: 0.0,
        Ingredients: "Gokhru Salt Extract, Makho Salt Extract, Radish Salt, Giloy Salt Extract, Harmal Salt Extract, Potash, Natural Alkali, Spreading Hogweed Salt Extract, Qust-e-Shireen-Costus Root, Turmeric, Carom Seeds, Fenugreek Seed, Kachnar, Black Nightshade, Badhiyan, Alum.",
        Benefits: [
            "Supports healthy kidney function.",
            "Helps flush toxins from the body.",
            "Supports urinary tract health.",
            "Helps reduce burning urination and discomfort.",
            "Made with natural herbs (extract)."
        ],
        productType: "For Kidney Care",
        servingSize: {
            liquid: "15 to 30 ml twice a day"
        },
        images: [
            "/assets/kcare-juice-box.png",
            "/assets/kcare-juice.png",
            "/assets/kcare-juice-both.png"
        ],
        stock: 50,
    },
    {
        id: 13,
        name: "Skin Care",
        category: "Juice",
        price: 0.0,
        Ingredients: "Soapberry, Black Pepper, Black Cumin, East Indian Globe Thistle, Sarsaparilla, China Root, Neem, Jujube, Surphukha, Fagonia, White Sandalwood, Cutch Tree, Cinnamon, Mahamnajistha, Orange Peel, Rose Flower, Shatra, Amla Extract, Tulsi, Rhubarb, Senna, Zedoary, Cassia Seed, Rock Sugar, Coffee Senna, Bitter Chirata, Red Sandalwood, Giloy, Indian Rosewood, Chebulic Myrobalan, Mountain Ebony.",
        Benefits: [
            "Helps reduce acne, pimples, and skin irritation.",
            "Supports natural skin glow and smoother texture.",
            "Helps detoxify the body and remove toxins.",
            "Nourishes skin from within for healthier skin.",
            "Skin Moisturizes."
        ],
        productType: "Derma Herb Plus - Skin Problems",
        servingSize: {
            liquid: "15 to 30 ml twice a day"
        },
        images: [
            "/assets/skin-care-juice-box.png",
            "/assets/skin-care-juice.png",
            "/assets/skin-care-all.png"
        ],
        stock: 50,
    },
    {
        id: 14,
        name: "Skin Care",
        category: "Capsules",
        price: 0.0,
        Ingredients: "Soapberry, Black Pepper, Black Cumin, East Indian Globe Thistle, Sarsaparilla, China Root, Neem, Jujube, Surphukha, Fagonia, White Sandalwood, Cutch Tree, Cinnamon, Mahamnajistha, Orange Peel, Rose Flower, Shatra, Amla Extract, Tulsi, Rhubarb, Senna, Zedoary, Cassia Seed, Rock Sugar, Coffee Senna, Bitter Chirata, Red Sandalwood, Giloy, Indian Rosewood, Chebulic Myrobalan, Mountain Ebony.",
        Benefits: [
            "Helps reduce acne, pimples, and skin irritation.",
            "Supports natural skin glow and smoother texture.",
            "Helps detoxify the body and remove toxins.",
            "Nourishes skin from within for healthier skin.",
            "Skin Moisturizes."
        ],
        productType: "Derma Herb Plus - Skin Problems",
        servingSize: {
            capsule: "2 capsules twice a day"
        },
        images: [
            "/assets/skin-care-capsules-box.png",
            "/assets/skin-care-capsules.png",
            "/assets/skin-care-all.png"
        ],
        stock: 50,
    },
    {
        id: 15,
        name: "Sanitary Pad",
        category: "Personal Care",
        price: 0.0,
        Ingredients: "",
        Benefits: [
            "Balances pH and hormone levels.",
            "Eliminates unwanted odour.",
            "Protects against germs in the air.",
            "Reduces inflammation.",
            "Fights against vaginal infections & irritations.",
            "Comfortable, breathable, and highly absorbent."
        ],
        productType: "FAR-IR-ANION Anti-bacterial Sanitary Pads",
        details: {
            quantity: "6 Pads",
            size: "XL / XXL (330mm)",
            technology: "Active Oxygen & Negative Ion and Far-IR",
            material: "100% Natural Organic Cotton"
        },
        images: [
            "/assets/sanitary-box.png"
        ],
        stock: 50,
    }
];

export default products;
