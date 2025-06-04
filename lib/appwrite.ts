import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "appwrite";
import * as ImagePicker from 'expo-image-picker';


interface PlantProps {
    name: string;
    scientific_name: string;
    informations?: string;
    how_to_use?: string;
    image_url: any;
}


export const config = {
    platform: 'com.nat0507.medgreen10',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databasesID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    plantsCollectionID: process.env.EXPO_PUBLIC_APPWRITE_PLANTS_COLLECTION_ID,
    plantLocationsCollectionID: process.env.EXPO_PUBLIC_APPWRITE_PLANT_LOCATIONS_COLLECTION_ID,
    bucketID: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
    adminsCollectionID: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID
}

export const client = new Client();

client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectID!)


export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client)

export async function createAdmin() {
  try {
    return await account.create(
      ID.unique(),
      "admin@example.com",
      "123123123",
      "Admin"
    );
  } catch (error) {
    throw new Error("Admin user creation failed");
  }
}

export async function loginAdmin(email: string, password: string) {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error("Invalid credentials");
  }
}


export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentAdmin() {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function getPlants({ query, limit }: { query?: string; limit?: number }) {
  try {
    const filters = [Query.orderDesc("$createdAt")];

    if (query) {
      filters.push(
        Query.or([
          Query.search("name", query),
          Query.search("scientific_name", query),
        ])
      );
    }

    if (limit) filters.push(Query.limit(limit));

    const result = await databases.listDocuments(config.databasesID!, config.plantsCollectionID!, filters);

    return result.documents;
  } catch (error) {
    console.error("Error fetching plants:", error);
    return [];
  }
}

export async function getPlantsByID({ id }: { id: string }) {
  try {
    
    const result = await databases.getDocument(
      config.databasesID!,
      config.plantsCollectionID!,
      id
    );
    return result;
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    return null;
  }
}

export async function getPlantLocations({ id }: { id?: string }) {
  try {
    const query = id ? [Query.equal("plant_id", id)] : [];

    const result = await databases.listDocuments(
      config.databasesID!,
      config.plantLocationsCollectionID!,
      query
    );

    return result.documents || [];
  } catch (error) {
    console.error("Error fetching plant locations:", error);
    return [];
  }
}

export async function uploadImageAsync(asset: ImagePicker.ImagePickerAsset) {
  try {
    console.log("[uploadImageAsync] Uploading asset:", asset);

    const response = await fetch(asset.uri);
    const blob = await response.blob();

    const file = new File([blob], asset.fileName || "upload.jpg", {
      type: asset.type || "image/jpeg",
    });

    const uploadResponse = await storage.createFile(
      config.bucketID!,
      ID.unique(),
      file
    );

    console.log("[file uploaded] ==>", uploadResponse);

    const fileUrl = storage.getFileView(config.bucketID!, uploadResponse.$id);
    console.log("[file url] ==>", fileUrl);

    return fileUrl;
  } catch (error) {
    console.error("[uploadImageAsync] error ==>", error);
    return Promise.reject(error);
  }
}


const prepareNativeFile = async (
  asset: ImagePicker.ImagePickerAsset
): Promise<{ name: string; type: string; size: number; uri: string }> => {
  console.log("[prepareNativeFile] asset ==>", asset);

  try {
    let fileSize = asset.fileSize ?? 0;

    // Fetch file size if not available
    if (fileSize === 0) {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      fileSize = blob.size;
    }

    return {
      name: asset.fileName ?? `upload-${Date.now()}.jpg`,
      size: fileSize,
      type: asset.mimeType ?? "image/jpeg",
      uri: asset.uri,
    };
  } catch (error) {
    console.error("[prepareNativeFile] error ==>", error);
    return Promise.reject(error);
  }
};

export async function createMedicinalPlant({ 
  name, 
  scientific_name, 
  how_to_use,
  informations,
  image_url, 
}: PlantProps) {
  try {
    const response = await databases.createDocument(
      config.databasesID!,
      config.plantsCollectionID!, 
      ID.unique(),
      {
        name,
        scientific_name,
        how_to_use: how_to_use || "",
        informations: how_to_use || "",
        image_url,
      }
    );

    console.log("Medicinal plant created in Appwrite:", response);
    return response;
  } catch (error) {
    console.error("Error creating medicinal plant in Appwrite:", error);
    throw error;
  }
}

export const createPlantLocation = async (data: {
  plant_id: any;
  latitude: number;
  longitude: number;
}) => {
  return databases.createDocument(
    config.databasesID!,
    config.plantLocationsCollectionID!,
    ID.unique(),
    data
  );
};

export const deletePlantWithLocations = async (plantId: string) => {
  try {
    // Step 1: Get all locations linked to the plant
    const locations = await databases.listDocuments(config.databasesID!, config.plantLocationsCollectionID!, [
      Query.equal("plant_id", plantId)
    ]);

    // Step 2: Delete each location
    const deleteLocationPromises = locations.documents.map(location =>
      databases.deleteDocument(config.databasesID!, config.plantLocationsCollectionID!, location.$id)
    );
    await Promise.all(deleteLocationPromises);

    // Step 3: Delete the plant
    await databases.deleteDocument(config.databasesID!, config.plantsCollectionID!, plantId);

    console.log("Plant and its locations deleted successfully");
    return true; 
  } catch (error) {
    console.error("Error deleting plant and locations:", error);
    return false;
  }
};

export const updatePlantLocation = async (plantId: string, locations: { latitude: number; longitude: number }[]) => {
  try {
    // Step 1: Fetch existing locations for the plant
    const existingLocations = await databases.listDocuments(
      config.databasesID!,
      config.plantLocationsCollectionID!,
      [Query.equal("plant_id", plantId)]
    );

    // Step 2: Delete all existing locations
    const deletePromises = existingLocations.documents.map(location =>
      databases.deleteDocument(config.databasesID!, config.plantLocationsCollectionID!, location.$id)
    );
    await Promise.all(deletePromises);

    // Step 3: Add the new locations
    for (const loc of locations) {
      await databases.createDocument(config.databasesID!, config.plantLocationsCollectionID!, "unique()", {
        plant_id: plantId,
        latitude: loc.latitude,
        longitude: loc.longitude,
      });
    }

    console.log("Plant locations updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating plant locations:", error);
    return false;
  }
};

export const updatePlant = async (
  plantId: string,
  infoText: string,
  usageText: string,
) => {
  try {
    await databases.updateDocument(
      config.databasesID!,
      config.plantsCollectionID!,
      plantId,
      {
        informations: infoText,
        how_to_use: usageText,
      }
    );

    console.log("Plant usage and information updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating plant usage and info:", error);
    return false;
  }
};
