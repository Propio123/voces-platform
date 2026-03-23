import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  private userRole$ = new BehaviorSubject<string | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (user) => {
      this.user$.next(user);
      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          this.userRole$.next(userSnap.data()['role']);
        } else {
          this.userRole$.next(null);
        }
      } else {
        this.userRole$.next(null);
      }
    });
  }

  getUser() {
    return this.user$.asObservable();
  }

  getUserRole() {
    return this.userRole$.asObservable();
  }

  async register(email: string, password: string, displayName: string, role: string = 'basic') {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const userRef = doc(this.firestore, `users/${cred.user.uid}`);
    await setDoc(userRef, { email, role, displayName });
    return cred.user;
  }

  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const userRef = doc(this.firestore, `users/${cred.user.uid}`);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      this.userRole$.next(userSnap.data()['role']);
    }
    return cred.user;
  }

  async logout() {
    await signOut(this.auth);
    this.user$.next(null);
    this.userRole$.next(null);
  }
}
