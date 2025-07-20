import { collection, query, where, getDocs, addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export class DataService {
  static async getClientPlans(organizationId) {
    try {
      const plansRef = collection(db, `organizations/${organizationId}/clients`);
      const q = query(plansRef);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching client plans:', error);
      throw error;
    }
  }

  static async createClientPlan(organizationId, planData) {
    try {
      const plansRef = collection(db, `organizations/${organizationId}/clients`);
      return await addDoc(plansRef, planData);
    } catch (error) {
      console.error('Error creating client plan:', error);
      throw error;
    }
  }

  static async updateClientPlan(organizationId, planId, updates) {
    try {
      const planRef = doc(db, `organizations/${organizationId}/clients`, planId);
      return await updateDoc(planRef, updates);
    } catch (error) {
      console.error('Error updating client plan:', error);
      throw error;
    }
  }

  static async getUserData(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  static async createUser(uid, userData) {
    try {
      const userRef = doc(db, "users", uid);
      return await setDoc(userRef, userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}
