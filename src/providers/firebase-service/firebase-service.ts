// aqui serão colocadas todas as funções que podem ser utilizadas por vários fontes, para fazer 
// reaproveitamento de código
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Usuario } from '../../app/Modelo/usuario';
import * as firebase from 'firebase';
import { AlertController, LoadingController } from 'ionic-angular';

@Injectable()
export class FirebaseServiceProvider { 

  refUser = firebase.database().ref('/usuario');
  refInforme = firebase.database().ref('/informe');

  constructor(
    public db: AngularFireDatabase,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
    ) {

  }

  cadastraUsuario(usuario:Usuario){
    let keyUsuario = this.db.list('usuario').push(usuario).key;
    return keyUsuario;
  }

  geraLogin(nome: string, sobrenome: string){
    var meioNomeArray = nome.split("");
    var meioNome = (meioNomeArray[0]+
                    meioNomeArray[1]+
                    meioNomeArray[2]).toUpperCase();
    var meioSobrenomeArray= sobrenome.split("")
    var num = meioSobrenomeArray.length
    var meioSobrenome=(meioSobrenomeArray[num-2]+meioSobrenomeArray[num-1]).toUpperCase();
    var fimLogin = Math.round(Math.random() * 100);
    return meioNome + meioSobrenome + fimLogin;
  }

  geraRandom(){
    return Math.random().toString(36).slice(-10);
  }

  converteData(dtNasc: string){
    var dataNasc = dtNasc.split("");
    return dataNasc[8]+
           dataNasc[9]+"/"+ 
           dataNasc[5]+
           dataNasc[6]+"/"+
           dataNasc[0]+
           dataNasc[1]+
           dataNasc[2]+
           dataNasc[3];
  }

  editaUsuario(keyUsuario: any, usuario: any){

    if(usuario.prontuario != null){
      this.refUser.child('/'+keyUsuario).update({
        prontuario: usuario.prontuario
      })
    }
      if(usuario.nome != null){
        this.refUser.child('/'+keyUsuario).update({
          nome: usuario.nome
        })
      }
      if(usuario.sobrenome != null){
        this.refUser.child('/'+keyUsuario).update({
          sobrenome: usuario.sobrenome
        })
      }
      if(usuario.dtNasc != null){
        this.refUser.child('/'+keyUsuario).update({
          dtNasc: usuario.dtNasc
        })
      }
      if(usuario.login != null){
        this.refUser.child('/'+keyUsuario).update({
          login: usuario.login
        })
      }
      if(usuario.senha != null){
        this.refUser.child('/'+keyUsuario).update({
          senha: usuario.senha
        })
      }
    }

    cadastraInforme(informe: any){
      return this.db.list('informe').push(informe).key;
    }

}