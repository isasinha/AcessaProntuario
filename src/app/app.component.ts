// Essa página serve para aplicar alguma lógica no app inteiro. O que tiver aqui vai esatr no app inteiro a menos
// que esteja sobrescrito em alguma página. É aqui que vão algumas instruções iniciais para quando o app iniciar,
// antes de carregar qualquer página, como a instrução de qual deve ser a primeira página a abrir, por exemplo


import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { AngularFireAuth } from '@angular/fire/auth';
import { AbstractControlDirective } from '@angular/forms'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = 'LoginPage';
  paginaAtiva: any;

  paginas: Array<{titulo: string, pagina: any, icon: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public firebaseauth: AngularFireAuth) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      this.paginas = [
        {titulo: 'Sair', pagina: LoginPage, icon:'log-out'}
      ];

      this.paginaAtiva = this.paginas[0];
    });
  }

  abrePagina(pagina){
    if (pagina.titulo == 'Sair'){
      this.firebaseauth.auth.signOut();
    }  
      this.nav.push(pagina.pagina);
      this.paginaAtiva = pagina;
  }

  veSeEstaAtivo(pagina){
    return pagina == this.paginaAtiva;
  }

}

