import { CreateUserPrams, GetMenuParams, SignInParams } from "@/type";
import {
 Account,
 Avatars,
 Client,
 ID,
 TablesDB,
 Query,
 Storage
} from "react-native-appwrite"

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  bucketId: '69648745003c0946b22a',
  platform: 'com.khudo.foodorder',
  databaseId: '6959d709001234d2f925',
  userTableId: 'user',
  categoryTableId: 'categories',
  menuTableId: 'menu',
  customizationTableId: 'customization',
  menuCustomizationTableId: 'menu_customization',
}

export const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new TablesDB(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

export const createUser = async ({email, password, name}: CreateUserPrams) => {
  try {
    const newAccount = await account.create({
      userId: ID.unique(),
      email,
      password,
      name
    });

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitialsURL(name)

    const newUser = await databases.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      data: { accountId: newAccount.$id, name, email, avatar: avatarUrl },
      rowId: ID.unique(),
    });

    return newUser;
  } catch (error) {
    throw new Error(error as string);
  }
}

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession({ email, password });
  } catch (error) {
    throw new Error(error as string);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    

    const users = await databases.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.userTableId,
      queries: [Query.equal('accountId', currentAccount.$id)],
    });

    if (users.total === 0) throw Error;
    return users.rows[0];
  } catch (error) {
    throw new Error(error as string);
  }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];
    if (category) queries.push(Query.equal('categories', category));
    if (query) queries.push(Query.search('name', query));

    const menus = await databases.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.menuTableId,
      queries,
    })

    return menus.rows;
  } catch (error) {
    throw new Error(error as string);
  }
}

export const getCategories = async () => {
  try {
    const categories = await databases.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.categoryTableId,
    })
    return categories.rows;
  } catch (error) {
    throw new Error(error as string);
  }
}