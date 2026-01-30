const products = [
    {
        id: 1,
        name: "Arthofit",
        category: "Capsules",
        price: 878.52,
        Ingredients: "Shallaki (Boswellia serrata)  Helps reduce swelling and pain, Nirgundi (Vitex negundo) Provides relief from stiffness, Methi Seeds  Strengthens bones, Triphala  Cleanses the body and improves digestion, Shuddha Guggul  Supports joint repair and care, Shuddha Laksha  Promotes bone health.Chopochini Extract  Helps manage diabetes",
        Benefits: [
            "Promotes Joint Flexibility and Comfort",
            "Reduces Inflammation and Relieves Joint Pain",
            "Strengthens Bones and Connective Tissues",
            "Enhances Mobility and Physical Well-Being",
            "Safe, Natural, and Gentle Ayurvedic Formulation"
        ],
        productType: "Herbal Joint Support",
        images: [
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder-2.png"
        ],
        stock: 50,
    },
    {
        id: 2,
        name: "Diabofit",
        category: "Capsules",
        price: 878.52,
        Ingredients: "Jamun seed, Paneerful, Triphala (E. officinalis, T.chebula, T. belerica), Karela (M. charantia), Guduchi (T. cordifolia), S. cumini, Methi (T. foenum graecum), Ginger (Z. officinale), Neem Leaves (A. indica), Kadu Chirayata (Swertia), Gudmar (G.sylvestre), Adulsa (J. Adhatoda), Shatawari (Asparagus racemosus), Water (DM), Ginseng (Panax quinquefolius L), Ashwagandha (Withania somnifera), and Kundru (Cephalandra indica). The excipients used include INS 211 and 330.",
        Benefits: [
            "Enhanced immunity",
            "Better blood purification",
            "Liver Protective, Improved digestion",
            "Reduced oxidative stress",
            "Maintain Wellness",
            "Good for Homeostasis ",
            "Helps Controlled Sugar Levels"
        ],
        productType: "Blood Sugar Support",
        images: [
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
             "/assets/product-placeholder-2.png"
        ],
        stock: 30,
    },
    {
        id: 3,
        name: "DigiFit",
        category: "Powder",
        price: 878.52,
        Ingredients: "Triphala Powder (Emblica officinalis, Terminalia chebula, Terminalia belerica) , Ajma (Carum copticum) , Jeera (Cuminum cyminum) , Indrajav (Wrightia tinctoria) tinctoria), Sunthi (Zingiber officinale), Harde (Terminalia chebula), Kutaj (Holarrhena antidysenterica) , Kala Namak, Badi Saunf (Foeniculum vulgare).",
        Benefits: [
            "Improves Digestion & Appetite",
            "Relieves Gas,  Bloating, & Acidity",
            "Aids in Smooth Bowel Movement",
            "Reduces Indigestion & Discomfort",
            "100% Natural & Safe Herbal Formula",
            "Stimulates Digestion and Reduces Bloating",
            "Supports Intestinal Health and Balance"
        ],
        productType: "Digestive Health Formula",
        images: [
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder-2.png"
        ],
        stock: 100,
    },
    {
        id: 4,
        name: "Garcinia Plus",
        category: "Capsules",
        price: 878.52,
        Ingredients: "Garcinia comogia (Vriksamla) Alma, Harde, Beheda, Sunthi, Miri, Pippali, Trimard, Orange Peel, Blac Salt etc.  **CONTAINS PERMITTED CLASS II PRESERVATIVE (INS211) CONTAINS NO COLOR, NO FLAVOUR AND NO SYNTHETIC VITAMINS & MINERALS. Benefits are non synthetic, therefore, slight variation in colour taste, viscosity and some sediments are natural.**",
        Benefits: [
            "Weight Loss: Prevents fat storage",
            "Appetite Control: Reduces cravings",
            "Metabolism Boost: Enhances fat burning",
            "Cholesterol Support: Improves cholesterol levels",
            "Blood Sugar Regulation Controls sugar levels"
        ],
        productType: "FOR WEIGHT LOSS",
        images: [
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder-2.png"
        ],
        stock: 20,
    },
    {
        id: 5,
        name: "Garcinia Plus",
        category: "Liquid",
        price: 623.52,
        Ingredients: "Garcinia comogia (Vriksamla) Alma, Harde, Beheda, Sunthi, Miri, Pippali, Trimard, Orange Peel, Blac Salt etc. CONTAINS PERMITTED CLASS II PRESERVATIVE (INS211) CONTAINS NO COLOR, NO FLAVOUR AND NO SYNTHETIC VITAMINS & MINERALS. Ingredients are non synthetic, therefore, slight variation in colour taste, viscosity and some sediments are natural.",
        Benefits: [
            "Weight Loss: Prevents fat storage",
            "Appetite Control: Reduces cravings",
            "Metabolism Boost: Enhances fat burning",
            "Cholesterol Support: Improves cholesterol levels",
            "Blood Sugar Regulation: Controls sugar levels"
        ],
        productType: "FOR WEIGHT LOSS",
        images: [
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder-2.png"
        ],
        stock: 80,
    },
    {
        id: 6,
        name: "LivoFit",
        category: "Liquid",
        price: 623.52,
        Ingredients: "Kutki (Picrorhiza curroa), Pippali (Piper longum) Kalmegh(Andrographis panniculanta) ,Triphala(Emblica officinalia, Terminalia chebula, Terminalia belerica), Punarnava (Boerhavia diffusa)Sharpunkha(Teprolosia purpura) Other ingredients: Sodium Benzoate IP, Citric Acid IP",
        Benefits: [
            "Supports Liver Health: Helps correct liver dysfunction and damage.",
            "Protects Against Toxins: Shields liver from harmful substances.",
            "Promotes Digestion: Stimulates appetite for better digestion.",
            "Boosts Growth: Supports healthy bodily growth.",
            "Natural Detox: Aids in natural detoxification of the liver"
        ],
        productType: "Liver Support Juice",
        images: [
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder-2.png"
        ],
        stock: 60,
    },
    {
        id: 7,
        name: "Pilotox",
        category: "Capsules",
        price: 878.52,
        Ingredients: "Patha Extract, Mustha Extract, Bilva Extract, Pipalimool & Nagkeshar Extracts, Jamikand & Khunkharaba Extracts, DesiKapoor, Kakmachi Extract.",
        Benefits: [
            "Helps Reduce Foin, Swelling & Inflammation to Piles.",
            "Aids in Shrinking Plies Moss Controlling Bleeding.",
            "Relieves itching Burning & Discomfort.",
            "Supports Smooth Bowel Movements & Digestive Heath.",
            "Promotes Natural Healing Without Side Effects."
        ],
        productType: "Natural Piles Solution",
        images: [
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder-2.png"
        ],
        stock: 45,
    },
    {
        id: 8,
        name: "Pilotox",
        category: "Liquid",
        price: 623.52,
        Ingredients: "Patha Extract, Dhamasa Extract, Mustha Extract, Bilva Extract, Pipalimool & Nagkeshar Extracts, Jamikand & Khunkharaba Extracts, Desi Kapoor, Kakmachi Extract.",
        Benefits: [
            "Helps Reduce Foin, Swelling & Inflammation to Piles.",
            "Aids in Shrinking Plies Moss Controlling Bleeding.",
            "Relieves itching Burning & Discomfort.",
            "Supports Smooth Bowel Movements & Digestive Heath.",
            "Promotes Natural Healing Without Side Effects."
        ],
        productType: "Natural Piles Solution",
        images: [
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder-2.png"
        ],
        stock: 35,
    },
    {
        id: 9,
        name: "ArthoFit",
        category: "Liquid",
        price: 623.52,
        Ingredients: "Shallaki (Boswellia serrata), Nirgundi (Vitex negundo) ,Methi Seeds, Triphala, Shuddha Guggul, Shuddha Laksha, Chopochini Extract.",
        Benefits: [
            "Promotes Joint Flexibility and Comfort",
            "Reduces Inflammation and Relieves Joint Pain",
            "Strengthens Bones and Connective Tissues",
            "Enhances Mobility and Physical Well-Being",
            "Safe, Natural, and Gentle Ayurvedic Formulation"
        ],
        productType: "Herbal Joint Support",
        images: [
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder-2.png"
        ],
        stock: 35,
    },
    {
        id: 10,
        name: "DiaboFit",
        category: "Liquid",
        price: 623.52,
        Ingredients: "Jamun seed, Paneerful, Triphala (E. officinalis, T.chebula, T. belerica), Karela (M. charantia), Guduchi (T. cordifolia), S. cumini, Methi (T. foenum graecum), Ginger (Z. officinale), Neem Leaves (A. indica), Kadu Chirayata (Swertia), Gudmar (G.sylvestre), Adulsa (J. Adhatoda), Shatawari (Asparagus racemosus), Water (DM), Ginseng (Panax quinquefolius L), Ashwagandha (Withania somnifera), and Kundru (Cephalandra indica). The excipients used include INS 211 and 330.",
        Benefits: [
            "Enhanced immunity",
            "Better blood purification",
            "Liver Protective, Improved digestion",
            "Reduced oxidative stress",
            "Maintain Wellness",
            "Good for Homeostasis ",
            "Helps Controlled Sugar Levels"
        ],
        productType: "Blood Sugar Support",
        images: [
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder.jpeg",
            "/assets/product-placeholder-2.png"
        ],
        stock: 35,
    }
];

export default products;
