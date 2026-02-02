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
            "/assets/arthofit-capsules-box.png",
            "/assets/arthofit-capsules-front.png",
            "/assets/arthofit-capsules-back.png",
            "/assets/arthofit-capsules-front-tr.png"
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
            "/assets/product-placeholder.png",
            "/assets/product-placeholder.png",
            "/assets/product-placeholder.png",
            "/assets/product-placeholder-tr.png"
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
            "/assets/product-placeholder.png",
            "/assets/product-placeholder.png",
            "/assets/product-placeholder.png",
            "/assets/product-placeholder-tr.png"
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
            "/assets/garcinia-plus-capsules-box.png",
            "/assets/garcinia-plus-capsules-box.png",
            "/assets/garcinia-plus-capsules-box.png",
            "/assets/garcinia-plus-capsules-box-tr.png"
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
            "/assets/garcinia-plus-liquid.png",
            "/assets/garcinia-plus-liquid.png",
            "/assets/garcinia-plus-liquid-back.png",
            "/assets/garcinia-plus-liquid-tr.png"
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
            "/assets/livofit-liquid.png",
            "/assets/livofit-liquid-back.png",
            "/assets/livofit-liquid.png",
            "/assets/livofit-liquid-tr.png"
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
            "/assets/pilotox-capsules-front.png",
            "/assets/pilotox-capsules-back.png",
            "/assets/pilotox-capsules-box.png",
            "/assets/pilotox-capsules-front-tr.png"
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
            "/assets/pilotox-liquid-bottle.png",
            "/assets/pilotox-liquid-back.png",
            "/assets/pilotox-liquid-bottle.png",
            "/assets/pilotox-liquid-bottle-tr.png"
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
            "/assets/product-placeholder.png",
            "/assets/product-placeholder.png",
            "/assets/product-placeholder.png",
            "/assets/product-placeholder-tr.png"
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
            "/assets/diabofit-juice.jpeg",
            "/assets/diabofit-juice.jpeg",
            "/assets/diabofit-juice.jpeg",
            "/assets/diabofit-juice.jpeg"
        ],
        stock: 35,
    },
    {
        id: 11,
        name: "Skin Care",
        category: "Capsules",
        price: 878.52,
        Ingredients: ".",
        Benefits: [
        ],
        productType: "For Skin Problems",
        images: [
            "/assets/skin-care-capsule-front.png",
            "/assets/skin-care-capsules-box.png",
            "/assets/skin-care-capsules-front.png",
            "/assets/skin-care-capsule-front-tr.png"
        ],
        stock: 35,
    },
    {
        id: 12,
        name: "immuntity Booster",
        category: "Capsules",
        price: 878.52,
        Ingredients: ".",
        Benefits: [
            "Strengthens daily immunity",
            "Boosts energy without jitters",
            "Supports respiratory health",
            "Rich in natural antioxidants",
            "Helps manage stress and fatigue",
            "Reduces inflammation naturally",
        ],
        productType: "For Energy",
        images: [
            "/assets/immunity-booster-capsules-front.png",
            "/assets/immunity-booster-capsules-box.png",
            "/assets/immunity-booster-capsules-back.png",
            "/assets/immunity-booster-capsules-front-tr.png"
        ],
        stock: 35,
    },
     {
        id: 13,
        name: "immuntity Booster",
        category: "Liquid",
        price: 623.52,
        Ingredients: ".",
        Benefits: [
            "Strengthens daily immunity",
            "Boosts energy without jitters",
            "Supports respiratory health",
            "Rich in natural antioxidants",
            "Helps manage stress and fatigue",
            "Reduces inflammation naturally",
        ],
        productType: "For Energy",
        images: [
            "/assets/immunity-booster-liquid.png",
            "/assets/immunity-booster-liquid-back.png",
            "/assets/immunity-booster-liquid.png",
            "/assets/immunity-booster-liquid-tr.png"
        ],
        stock: 35,
    },
     {
        id: 14,
        name: "Heart Care",
        category: "Capsules",
        price: 878.52,
        Ingredients: ".",
        Benefits: [
            "Supports healthy heart function",
            "Helps maintain normal blood circulation",
            "Aids in balancing cholestrol levels",
            "Supports healthy blood pressure",
            "Helps reduce stress on heart"
        ],
        productType: "For Healthy Blood Circulation",
        images: [
            "/assets/heart-care-capsules-front.png",
            "/assets/heart-care-capsules-box.png",
            "/assets/heart-care-capsules-back.png",
            "/assets/heart-care-capsules-front-tr.png"
        ],
        stock: 35,
    },
     {
        id: 15,
        name: "Coffee",
        category: "Other",
        price: 0.0,
        Ingredients: "Arjun bark (100 gm), green cardamom (50 gm), desi garlic (50 gm), roasted soybean (200 gm), desi mint (50 gm), dry ginger (sonth) (50 gm), carom seeds (ajwain) (50 gm), fennel seeds (badisop) (50 gm), holy basil (tulsi) (50 gm), ashwagandha (50 gm), cinnamon (50 gm), dried lemon (50 gm).",
        Benefits: [
        ],
        productType: "Energy",
        images: [
            "/assets/coffee-pouch-front.png",
            "/assets/coffee-pouch-back.png",
            "/assets/coffee-pouch-front.png",
            "/assets/coffee-pouch-front-tr.png"
        ],
        stock: 35,
    }
];

export default products;
