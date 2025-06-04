import { config, createAdmin, databases } from "@/lib/appwrite";
import { ID } from "appwrite";

const COLLECTIONS = { 
  PLANTS: config.plantsCollectionID, 
  PLANT_LOCATIONS: config.plantLocationsCollectionID, 
};

const images = [
  "https://cloud.appwrite.io/v1/storage/buckets/67e3d9f100024fd1e4ca/files/67f4b198001228a6236a/view?project=67e3c7e5003d5bff22b3&mode=admin", // Acapulco
  "https://cloud.appwrite.io/v1/storage/buckets/67e3d9f100024fd1e4ca/files/67f4b1a500311d5a230e/view?project=67e3c7e5003d5bff22b3&mode=admin", // Basil
  "https://cloud.appwrite.io/v1/storage/buckets/67e3d9f100024fd1e4ca/files/67f4b1e300131821c5d1/view?project=67e3c7e5003d5bff22b3&mode=admin", // Aloe Vera
  "https://cloud.appwrite.io/v1/storage/buckets/67e3d9f100024fd1e4ca/files/67f4b1f800362bdcbfc3/view?project=67e3c7e5003d5bff22b3&mode=admin", // Bottle Plant
  "https://cloud.appwrite.io/v1/storage/buckets/67e3d9f100024fd1e4ca/files/67f4b1bb001f2bd16437/view?project=67e3c7e5003d5bff22b3&mode=admin", // Lemongrass
  "https://cloud.appwrite.io/v1/storage/buckets/67e3d9f100024fd1e4ca/files/67f4b1b30008a8e96faa/view?project=67e3c7e5003d5bff22b3&mode=admin", // False Oregano
  "https://cloud.appwrite.io/v1/storage/buckets/67e3d9f100024fd1e4ca/files/67f4b1f1000d483b8008/view?project=67e3c7e5003d5bff22b3&mode=admin", // Oregano
  "https://cloud.appwrite.io/v1/storage/buckets/67e3d9f100024fd1e4ca/files/67f4b1c50008af51202a/view?project=67e3c7e5003d5bff22b3&mode=admin", // Pandan
  "https://cloud.appwrite.io/v1/storage/buckets/67e3d9f100024fd1e4ca/files/67f4b1d2000a9deb3b80/view?project=67e3c7e5003d5bff22b3&mode=admin", // Turmeric
  "https://cloud.appwrite.io/v1/storage/buckets/67e3d9f100024fd1e4ca/files/67f4b2050000251dc110/view?project=67e3c7e5003d5bff22b3&mode=admin", // Goethe
];


const samplePlants = [
  {
    "name": "Acapulco",
    "scientific_name": "Cassia alata",
    "informations": "***Acapulco*** (*Cassia alata*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
    "how_to_use": "- **Tea/Infusion:** Turmeric can be brewed as a tea to help with digestion and inflammation. It is often combined with black pepper to improve curcumin absorption.\n- **Topical:** Turmeric powder can be mixed with water or milk to create a paste and applied to the skin for wound healing or skin brightening.\n- **Culinary:** Turmeric is a key ingredient in many Indian and Southeast Asian dishes, especially in curries, rice dishes, and soups. It adds both flavor and a bright yellow color to foods.\n- **Supplement:** Turmeric is available in capsules or tablets for internal use to manage inflammation or digestive issues.",
  },  
  {
    "name": "Basil",
    "scientific_name": "Ocimum basilicum",
    "informations": "***Basil*** (*Ocimum basilicum*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
    "how_to_use": "- **Tea/Infusion:** Fresh basil leaves can be brewed into tea to help with digestion and reduce stress.\n- **Topical:** Basil oil can be used topically for skin infections or as an insect repellent.\n- **Culinary:** Fresh or dried basil is commonly used in cooking, especially in Mediterranean and Southeast Asian cuisines.\n- **Supplement:** Basil extract supplements are available and may help in managing blood sugar levels and providing antioxidant support.",

  },  
  {
    "name": "Aloe Vera",
    "scientific_name": "Aloe barbadensis miller",
    "informations": "***Aloe Vera*** (*Aloe barbadensis miller*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
    "how_to_use": "- **Topical:** Aloe Vera gel can be directly applied to the skin for burns, cuts, and irritation.\n- **Culinary:** Aloe Vera juice is consumed for its digestive benefits and to relieve constipation.\n- **Supplement:** Aloe Vera capsules or tablets are commonly used to support digestive health.",
  },
  {
    "name": "Bottle Euphorbia",
    "scientific_name": "Jatropha Podagrica",
    "informations": "***Bottle Euphorbia*** (*Jatropha Podagrica*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
    "how_to_use": "- **Topical:** Leaves can be crushed and applied directly to wounds for relief and healing.\n- **Oral:** The latex from the plant is sometimes used in folk medicine, but it should be used with caution as it can be toxic when ingested.",
  },  
  {
    "name": "Lemongrass",
    "scientific_name": "Cymbopogon citratus",
    "informations": "***Lemongrass*** (*Cymbopogon citratus*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
    "how_to_use": "- **Tea/Infusion:** Brew fresh or dried lemongrass leaves as a tea to soothe digestion and reduce stress.\n- **Topical:** Lemongrass oil can be used for skin infections, headaches, and as a natural insect repellent.\n- **Culinary:** Lemongrass is often used in Southeast Asian dishes, particularly in soups and curries.\n- **Supplement:** Lemongrass capsules or oils are available for digestive support and anti-inflammatory benefits.",
  },  
  {
    "name": "False Oregano",
    "scientific_name": "Plectranthus amboinicus",
    "informations": "***False Oregano*** (*Plectranthus amboinicus*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
    "how_to_use": "- **Tea/Infusion:** Leaves can be brewed into a tea for cough and colds relief.\n- **Topical:** Crushed leaves are applied to insect bites, burns, or skin irritations.\n- **Culinary:** Often used as a spice or flavoring in soups and meat dishes.",
  },  
  {
    "name": "Oregano",
    "scientific_name": "Origanum vulgare",
    "informations": "***Oregano*** (*Origanum vulgare*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
    "how_to_use": "- **Tea/Infusion:** Oregano tea can help with colds, cough, and indigestion.\n- **Topical:** Oregano oil is applied for fungal infections or diluted for use on skin irritations.\n- **Culinary:** Widely used as a seasoning in Mediterranean cuisine.\n- **Aromatherapy:** The essential oil is used for respiratory issues and relaxation.",
  },  
  {
    "name": "Pandan",
    "scientific_name": "Pandanus amaryllifolius",
    "informations": "***Pandan*** (*Pandanus amaryllifolius*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
    "how_to_use": "- **Tea/Infusion:** Pandan leaves can be boiled into tea for pain relief and relaxation.\n- **Topical:** Used in poultices for headaches or joint pain.\n- **Culinary:** Popular for flavoring rice and desserts in Filipino and Southeast Asian dishes.",
  },  
  {
    "name": "Turmeric",
    "scientific_name": "Curcuma longa",
    "informations": "***Turmeric*** (*Curcuma longa*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
    "how_to_use": "- **Tea/Infusion:** Turmeric tea is consumed to support digestion and reduce inflammation.\n- **Topical:** A paste made from turmeric powder is applied to wounds and skin inflammations.\n- **Culinary:** Extensively used in curries, soups, and rice dishes for its color and medicinal value.\n- **Supplement:** Available in capsules or tinctures, often combined with black pepper for better absorption.",
  },  
  {
    "name": "Goethe Plant",
    "scientific_name": "Kalanchoe pinnata",
    "informations": "***Goethe Plant*** (*Kalanchoe pinnata*) is a medicinal plant traditionally used in herbal remedies. It is valued for its natural healing properties and is commonly found in various communities across tropical regions.",
    "how_to_use": "- **Topical:** Fresh leaf juice is applied to wounds, burns, and skin infections.\n- **Oral:** In traditional medicine, the leaves are chewed or made into a juice for urinary problems and cough.",
  }  
];


async function seed() {
  try {
    console.log("Creating admin user...");
    await createAdmin();
    console.log("Admin user created successfully.");

    const plants = [];

    for (let i = 0; i < samplePlants.length; i++) {
      const plant = samplePlants[i];
      const newPlant = await databases.createDocument(
        config.databasesID!,
        COLLECTIONS.PLANTS!,
        ID.unique(),
        {
          ...plant,
          image_url: images[i], 
        }
      );
      plants.push(newPlant);
    }

    console.log(`Seeded ${plants.length} plants.`);
    console.log("Data seeding completed.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}


export default seed;
