import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
// 🌟 Cambiamos doc y getDoc por collection, query, where y getDocs
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore'; 
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  user$: Observable<User | null> = user(this.auth);
  private userRole$ = new BehaviorSubject<string | null>(null);

  constructor() {
    this.user$.pipe(
      switchMap(currentUser => {
        if (!currentUser) {
          this.userRole$.next(null);
          return of(null);
        }

        return runInInjectionContext(this.injector, () => {
          // 1. Apuntamos a la colección global 'users'
          const usersCollection = collection(this.firestore, 'users');
          
          // 2. Filtramos los documentos donde el atributo interno 'uid' coincida con el de la sesión
          const q = query(usersCollection, where('uid', '==', currentUser.uid));
          
          console.log('Consultando Firestore por campo interno uid:', currentUser.uid);
          
          return from(getDocs(q)).pipe(
            map(querySnapshot => {
              // 3. Verificamos si la consulta devolvió algún documento
              if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0]; // Tomamos el primer resultado encontrado
                const data = userDoc.data();
                
                console.log('¡Documento encontrado con éxito! ID de Base de Datos:', userDoc.id);
                console.log('Data cruda encontrada en Firestore:', data); // 👈 Aquí verás el objeto de Ximena
                
                // Retorna 'registered' o 'admin' según tu BDD, si no hay nada usa 'registered' por defecto
                return data && data['role'] ? data['role'] : 'registered';
              }
              
              console.warn('¡Ningún documento coincide con el campo uid:', currentUser.uid);
              return 'registered'; 
            }),
            catchError(err => {
              console.error("Error al leer la colección users mediante Query:", err);
              return of('registered');
            })
          );
        });
      })
    ).subscribe(role => {
      this.userRole$.next(role);
    });
  }

  getUser() { return this.user$; }
  getUserRole() { return this.userRole$.asObservable(); }

  async login(email: string, password: string) {
    return runInInjectionContext(this.injector, async () => {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      return cred.user;
    });
  }

  async logout() {
    return runInInjectionContext(this.injector, async () => {
      await signOut(this.auth);
      this.userRole$.next(null);
    });
  }
}