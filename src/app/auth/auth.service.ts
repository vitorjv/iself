import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: firebase.User;

  constructor(public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  signInWithEmail(credentials): Promise<firebase.auth.UserCredential> {
    console.log('Sign in with email');
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.value.email,
      credentials.value.password);
  }

  sendVerificationMail(): Promise<void> {

    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  logout(): Promise<void> {

    return this.afAuth.auth.signOut();
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  register(credentials) {
    console.log('Registrando ...');
    console.log(credentials.value.email,
      credentials.value.password);
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.value.email,
      credentials.value.password);
  }

}
