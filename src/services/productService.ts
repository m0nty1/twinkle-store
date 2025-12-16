import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase"; // Hena e7na bn-import el db sa7
import { Product } from "../types";

const COLLECTION_NAME = "products";

export const getProducts = async (category?: string): Promise<Product[]> => {
  try {
    let q = collection(db, COLLECTION_NAME);
    
    // Low fi category, n3mel filter
    if (category) {
      // @ts-ignore
      q = query(q, where("category", "==", category));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, "id">) => {
  return await addDoc(collection(db, COLLECTION_NAME), product);
};

export const deleteProduct = async (id: string) => {
  return await deleteDoc(doc(db, COLLECTION_NAME, id));
};

export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};  