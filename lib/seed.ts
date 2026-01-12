import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";
import * as FileSystemLegacy from 'expo-file-system/legacy';

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customization: string[]; 
}

interface DummyData {
  categories: Category[];
  customization: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await databases.listRows({ databaseId: appwriteConfig.databaseId, tableId: collectionId });

    await Promise.all(
        list.rows.map((doc) =>
            databases.deleteRow({
                databaseId: appwriteConfig.databaseId,
                tableId: collectionId,
                rowId: doc.$id,
            })
        )
    );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles({ bucketId: appwriteConfig.bucketId });

  await Promise.all(
      list.files.map((file: any) =>
          storage.deleteFile({ bucketId: appwriteConfig.bucketId, fileId: file.$id })
      )
  );
}

async function uploadImageToStorage(imageUrl: string) {
  try {
// 1. Define a local path where we will save the image temporarily
    const fileName = imageUrl.split("/").pop() || `file-${Date.now()}.png`;
    const localUri = `${FileSystemLegacy.cacheDirectory}${fileName}`;

    // 2. Download the image from the Web to the Device
    const downloadResult = await FileSystemLegacy.downloadAsync(imageUrl, localUri);

    if (downloadResult.status !== 200) {
        throw new Error("Failed to download image to device");
    }
    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: 'image/png',
        size: downloadResult.headers['Content-Length'] ? parseInt(downloadResult.headers['Content-Length'], 10) : 0,
        uri: downloadResult.uri,
    };
    const file = await storage.createFile({ bucketId: appwriteConfig.bucketId, fileId: ID.unique(), file: fileObj });
    return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
  } catch (error) {
    throw new Error("Failed to upload image to storage: " + (error as string));
  }
}

async function seed(): Promise<void> {
    // 1. Clear all
    await clearAll(appwriteConfig.categoryTableId);
    await clearAll(appwriteConfig.customizationTableId);
    await clearAll(appwriteConfig.menuTableId);
    await clearAll(appwriteConfig.menuCustomizationTableId);
    await clearStorage();

    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await databases.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.categoryTableId,
            rowId: ID.unique(),
            data: cat
          });
        categoryMap[cat.name] = doc.$id;
    }
    console.log("✅ Categories seeded.");
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customization) {
        const doc = await databases.createRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.customizationTableId,
          rowId: ID.unique(),
          data: {
              name: cus.name,
              price: cus.price,
              type: cus.type,
          }
        });
        customizationMap[cus.name] = doc.$id;
    }
    console.log("✅ Customizations seeded.");
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
      try {
        const uploadedImage = await uploadImageToStorage(item.image_url)
        console.log("Uploaded image for item:", item.name);
        console.log("Image URL:", uploadedImage);
        const menuDoc = await databases.createRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.menuTableId,
          rowId: ID.unique(),
          data: {
            name:  item.name,
            description: item.description,
            image_url: uploadedImage,
            price: item.price,
            rating: item.rating,
            calories: item.calories,
            protein: item.protein,
            categories: categoryMap[item.category_name]
          }
        })

        menuMap[item.name] = menuDoc.$id;

        for (const cusName of item.customization) {
          await databases.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.menuCustomizationTableId,
            rowId: ID.unique(),
            data: {
              menu: menuDoc.$id,
              customization: customizationMap[cusName],
            }
          })
        }

      } catch (error) {
        console.log("Error uploading image for item:", item.name, error);
        throw error;
      }
    }

    console.log("✅ Seeding complete.");
}

export default seed;