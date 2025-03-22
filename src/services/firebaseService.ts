import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { 
  AuditBase, 
  AirConditioningEquipment, 
  LightingEquipment, 
  OtherEquipment, 
  AuditData 
} from '@/types';
import { 
  deleteUser as deleteAuthUser,
  updateProfile,
  getAuth,
  User as FirebaseUser,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth as getAuthFirebase, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  createdAt: Date;
}

// Collections
const AUDITS_COLLECTION = 'audits';
const AIR_CONDITIONING_COLLECTION = 'airConditioning';
const LIGHTING_COLLECTION = 'lighting';
const OTHER_EQUIPMENT_COLLECTION = 'otherEquipment';

// Audit functions
export async function createAudit(auditData: Omit<AuditBase, 'id' | 'createdAt' | 'updatedAt'> & { createdAt: Date, updatedAt: Date }) {
  try {
    console.log("Creating audit in Firestore:", auditData);
    const auditRef = collection(db, AUDITS_COLLECTION);
    
    // Convert Date objects to Firestore Timestamps
    const firestoreData = {
      ...auditData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log("Prepared Firestore data:", firestoreData);
    const docRef = await addDoc(auditRef, firestoreData);
    console.log("Audit created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating audit:', error);
    throw error;
  }
}

export async function getAudits(userId: string) {
  try {
    const auditsRef = collection(db, AUDITS_COLLECTION);
    const q = query(auditsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data as Omit<AuditBase, 'id' | 'createdAt' | 'updatedAt'>,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
      };
    });
  } catch (error) {
    console.error('Error getting audits:', error);
    throw error;
  }
}

export async function getAudit(auditId: string) {
  try {
    const auditRef = doc(db, AUDITS_COLLECTION, auditId);
    const auditDoc = await getDoc(auditRef);
    
    if (!auditDoc.exists()) {
      throw new Error('Audit not found');
    }
    
    const auditData = auditDoc.data();
    return {
      id: auditDoc.id,
      ...auditData as Omit<AuditBase, 'id' | 'createdAt' | 'updatedAt'>,
      createdAt: auditData.createdAt instanceof Timestamp ? auditData.createdAt.toDate() : new Date(),
      updatedAt: auditData.updatedAt instanceof Timestamp ? auditData.updatedAt.toDate() : new Date()
    };
  } catch (error) {
    console.error('Error getting audit:', error);
    throw error;
  }
}

// Equipment functions - Air Conditioning
export async function addAirConditioningEquipment(equipment: Omit<AirConditioningEquipment, 'id'>) {
  try {
    const equipmentRef = collection(db, AIR_CONDITIONING_COLLECTION);
    const docRef = await addDoc(equipmentRef, equipment);
    return docRef.id;
  } catch (error) {
    console.error('Error adding air conditioning equipment:', error);
    throw error;
  }
}

export async function getAirConditioningEquipment(auditId: string) {
  try {
    const equipmentRef = collection(db, AIR_CONDITIONING_COLLECTION);
    const q = query(equipmentRef, where('auditId', '==', auditId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<AirConditioningEquipment, 'id'>
    }));
  } catch (error) {
    console.error('Error getting air conditioning equipment:', error);
    throw error;
  }
}

// Equipment functions - Lighting
export async function addLightingEquipment(equipment: Omit<LightingEquipment, 'id'>) {
  try {
    const equipmentRef = collection(db, LIGHTING_COLLECTION);
    const docRef = await addDoc(equipmentRef, equipment);
    return docRef.id;
  } catch (error) {
    console.error('Error adding lighting equipment:', error);
    throw error;
  }
}

export async function getLightingEquipment(auditId: string) {
  try {
    const equipmentRef = collection(db, LIGHTING_COLLECTION);
    const q = query(equipmentRef, where('auditId', '==', auditId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<LightingEquipment, 'id'>
    }));
  } catch (error) {
    console.error('Error getting lighting equipment:', error);
    throw error;
  }
}

// Equipment functions - Other Equipment
export async function addOtherEquipment(equipment: Omit<OtherEquipment, 'id'>) {
  try {
    const equipmentRef = collection(db, OTHER_EQUIPMENT_COLLECTION);
    const docRef = await addDoc(equipmentRef, equipment);
    return docRef.id;
  } catch (error) {
    console.error('Error adding other equipment:', error);
    throw error;
  }
}

export async function getOtherEquipment(auditId: string) {
  try {
    const equipmentRef = collection(db, OTHER_EQUIPMENT_COLLECTION);
    const q = query(equipmentRef, where('auditId', '==', auditId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<OtherEquipment, 'id'>
    }));
  } catch (error) {
    console.error('Error getting other equipment:', error);
    throw error;
  }
}

// Get complete audit data
export async function getFullAuditData(auditId: string): Promise<AuditData> {
  try {
    const audit = await getAudit(auditId);
    const airConditioning = await getAirConditioningEquipment(auditId);
    const lighting = await getLightingEquipment(auditId);
    const otherEquipment = await getOtherEquipment(auditId);
    
    return {
      audit,
      airConditioning,
      lighting,
      otherEquipment
    };
  } catch (error) {
    console.error('Error getting full audit data:', error);
    throw error;
  }
}

// Update functions
export async function updateAudit(auditId: string, auditData: Partial<Omit<AuditBase, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    const auditRef = doc(db, AUDITS_COLLECTION, auditId);
    await updateDoc(auditRef, {
      ...auditData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating audit:', error);
    throw error;
  }
}

export async function updateAirConditioningEquipment(equipmentId: string, data: Omit<AirConditioningEquipment, 'id'>) {
  try {
    const equipmentRef = doc(db, AIR_CONDITIONING_COLLECTION, equipmentId);
    await updateDoc(equipmentRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating air conditioning equipment:', error);
    throw error;
  }
}

export async function updateLightingEquipment(equipmentId: string, data: Partial<Omit<LightingEquipment, 'id'>>) {
  try {
    const equipmentRef = doc(db, LIGHTING_COLLECTION, equipmentId);
    await updateDoc(equipmentRef, data);
  } catch (error) {
    console.error('Error updating lighting equipment:', error);
    throw error;
  }
}

export async function updateOtherEquipment(equipmentId: string, data: Partial<Omit<OtherEquipment, 'id'>>) {
  try {
    const equipmentRef = doc(db, OTHER_EQUIPMENT_COLLECTION, equipmentId);
    await updateDoc(equipmentRef, data);
  } catch (error) {
    console.error('Error updating other equipment:', error);
    throw error;
  }
}

// Delete functions
export async function deleteAirConditioningEquipment(equipmentId: string) {
  try {
    const equipmentRef = doc(db, AIR_CONDITIONING_COLLECTION, equipmentId);
    await deleteDoc(equipmentRef);
  } catch (error) {
    console.error('Error deleting air conditioning equipment:', error);
    throw error;
  }
}

export async function deleteLightingEquipment(equipmentId: string) {
  try {
    const equipmentRef = doc(db, LIGHTING_COLLECTION, equipmentId);
    await deleteDoc(equipmentRef);
  } catch (error) {
    console.error('Error deleting lighting equipment:', error);
    throw error;
  }
}

export async function deleteOtherEquipment(equipmentId: string) {
  try {
    const equipmentRef = doc(db, OTHER_EQUIPMENT_COLLECTION, equipmentId);
    await deleteDoc(equipmentRef);
  } catch (error) {
    console.error('Error deleting other equipment:', error);
    throw error;
  }
}

export async function deleteAudit(auditId: string) {
  try {
    // First get and delete all related equipment
    const airConditioning = await getAirConditioningEquipment(auditId);
    const lighting = await getLightingEquipment(auditId);
    const otherEquipment = await getOtherEquipment(auditId);
    
    // Delete in parallel
    const deletePromises = [
      ...airConditioning.map(item => deleteAirConditioningEquipment(item.id!)),
      ...lighting.map(item => deleteLightingEquipment(item.id!)),
      ...otherEquipment.map(item => deleteOtherEquipment(item.id!))
    ];
    
    await Promise.all(deletePromises);
    
    // Then delete the audit itself
    const auditRef = doc(db, AUDITS_COLLECTION, auditId);
    await deleteDoc(auditRef);
  } catch (error) {
    console.error('Error deleting audit:', error);
    throw error;
  }
}

export const getAllAudits = async (): Promise<AuditBase[]> => {
  try {
    const auditsRef = collection(db, "audits");
    const q = query(auditsRef, orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data as Omit<AuditBase, 'id' | 'createdAt' | 'updatedAt'>,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
      };
    });
  } catch (error) {
    console.error("Error fetching all audits:", error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email || '',
      role: (doc.data().role as UserRole) || 'user',
      displayName: doc.data().displayName || '',
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    await updateDoc(userRef, {
      role: newRole,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    // Delete from Firestore
    await deleteDoc(userRef);

    // Delete from userRoles collection if exists
    const userRoleRef = doc(db, 'userRoles', userId);
    const userRoleDoc = await getDoc(userRoleRef);
    if (userRoleDoc.exists()) {
      await deleteDoc(userRoleRef);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, displayName: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    await updateDoc(userRef, {
      displayName,
      updatedAt: serverTimestamp()
    });

    // Update Firebase Auth profile
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, { displayName });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const createUser = async (email: string, password: string, role: UserRole, displayName: string): Promise<string> => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name in Firebase Auth
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email,
      role,
      displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return user.uid;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
