// essa página controla os componentes, bibliotecas. Se eu criar uma nova página ela deve ser cadastrada aqui para que 
// o sistema todo saiba que ela existe

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService} from './auth.service';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { NgxMaskModule } from 'ngx-mask'

import { MyApp } from './app.component';
import { HomeUserPage } from '../pages/home-user/home-user';
import { RedefinirSenhaPage } from '../pages/redefinir-senha/redefinir-senha';
import { CadastroUsuarioPage } from '../pages/cadastro-usuario/cadastro-usuario';
import { CadastroMedicoPage } from '../pages/cadastro-medico/cadastro-medico';
import { CadastroRecepPage } from '../pages/cadastro-recep/cadastro-recep';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';
import { HomeRecepPageModule } from '../pages/home-recep/home-recep.module';
import { LoginPageModule } from '../pages/login/login.module';
import { HomeMedicoPage } from '../pages/home-medico/home-medico';
import { HomeAdmPage } from '../pages/home-adm/home-adm';
import { InformePage } from '../pages/informe/informe';
import { DetalheInformePage } from '../pages/detalhe-informe/detalhe-informe';

  var firebaseConfig = {
    apiKey: "AIzaSyCXDvkairLfvBwLtC63LqEWY4ZlS9JfrWc",
    authDomain: "acessaprontuario.firebaseapp.com",
    databaseURL: "https://acessaprontuario.firebaseio.com",
    projectId: "acessaprontuario",
    storageBucket: "acessaprontuario.appspot.com",
    messagingSenderId: "348606062347",
    appId: "1:348606062347:web:9ba967ebb7e87bd0af8c0e",
    measurementId: "G-BT7XLE32WN"
  };

@NgModule({
  declarations: [
    MyApp, 
    HomeUserPage,
    //HomeMedicoPage,
    //HomeAdmPage,
    //HomeRecepPage,
    // LoginPage,
    //RedefinirSenhaPage,
    //CadastroMedicoPage,
    //CadastroUsuarioPage,
    //CadastroRecepPage,
    //InformePage,
    DetalheInformePage
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HomeRecepPageModule,
    LoginPageModule,
    HttpModule,
    NgxMaskModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomeUserPage,
    HomeMedicoPage,
    HomeAdmPage,
    //HomeRecepPage,  
    // LoginPage, 
    RedefinirSenhaPage,
    CadastroUsuarioPage,
    CadastroMedicoPage,
    CadastroRecepPage,
    InformePage,
    DetalheInformePage
   
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    AngularFireDatabase,
    FirebaseServiceProvider
  ]
})
export class AppModule {}
