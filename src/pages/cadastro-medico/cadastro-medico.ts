
/**************************************************** 
// ESSE CADASTRO É DE USO EXCLUSIVO PARA IMPLANTAÇÃO
****************************************************/

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { Usuario } from '../../app/Modelo/usuario';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, Validators } from '@angular/forms';
import { HomeAdmPage } from '../home-adm/home-adm';

//esse trecho é padrão para identificar quem é esta página ( já é criado junto com a página )
@IonicPage()
@Component({
  selector: 'page-cadastro-medico',
  templateUrl: 'cadastro-medico.html',
})
export class CadastroMedicoPage {

  //instância do modelo Usuário. Todos sem valor, pois será atribuído depois, quando for criado. Somente senha e tipo
  //pois essas informações são fixas
  usuario: Usuario = {
    prontuario: '',
    nome: '', 
    sobrenome: '',
    dtNasc: '',
    login: '',
    senha: '12345678',
    tipo: 'Medico'
  }
  
  //criação de variáveis. Vejam que não é necessário tipar a variável
  keyUsuario;
  usuarioSelecionado = [];
  user = [];
  usuarioKey;
  temUsuario = false;
  //essa variável recebe o caminho para acesso ao banco de dados
  refUser = firebase.database().ref('/usuario/');
  public usuarioForm: any;
  messageNome = '';
  erroNome = false;
  messageSobrenome = '';
  erroSobrenome = false;

  //construtor recebe como parâmetros as instâncias dos imports feitos acima
  constructor( 
    public navCtrl: NavController, 
    public navParams: NavParams,
    // private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public dbService: FirebaseServiceProvider,
    public db: AngularFireDatabase,
    public fb: FormBuilder
    ) {
      //crio um form para cadatro de um novo médico
      this.usuarioForm = fb.group({
        //validação, pois esses campos são de preenchimento obrigatório
        nome: ['', Validators.required],
        sobrenome: ['', Validators.required]
      })
  }
  
  //função do ciclo de vida da página. Não é obrigatória, posso informar aqui alguma coisa que quero que aconteça  
  // assim que a página terminar de carregar
  ionViewDidLoad() {

  }

  selecionaUsuario(usuarioNome: any, usuarioSobrenome: any){
    this.user = [];
    //maneira que encontrei para criar um FOR, para buscar informações no banco. Nâo é a melhor maneira e não é 
    //caso o banco não seja no firebase
    const snapshotToArrayUsuarioProntuario = snapshot => {
      snapshot.forEach(element => {
        let usuarioBanco = element.val();
        usuarioBanco.key = element.key;
        if(usuarioBanco.tipo == 'Medico'){
          if(usuarioNome == usuarioBanco.nome && usuarioSobrenome == usuarioBanco.sobrenome){
            this.user = usuarioBanco;
            this.usuarioKey = usuarioBanco.key;
            this.temUsuario = true;
          }
        }
      });
      return this.user;
    }
    this.refUser.on('value', resp => {
      this.usuarioSelecionado = [];
      this.temUsuario = false;
      //após fazer a busca no banco, vai trazer o usuário encontrado
      this.usuarioSelecionado = snapshotToArrayUsuarioProntuario(resp);
    })
  }

  
  addUsuario(usuario: Usuario){
    //cria tela de loading...
    const loading = this.loadingCtrl.create({
      content: 'Cadastrando...'
    }); 
    //devo usar o this. sempre a função for do mesmo fonte
    //aqui ele busca o usuário com base no nome e sobrenome
    this.selecionaUsuario(usuario.nome, usuario.sobrenome);
    //se não encontrar, realiza o cadastro de um novo
    if(!this.temUsuario){
      //aqui controlo o form criado lá em cima. Se for válido, ele pula.  
      //Neste caso a única regra é de ser obrigatório, mas poderia ter uma validação de ser só número, ou algo assim)
      //Se algum campo não respeitar a regra criada, ele não permite acionar o botão e exibe a mensagem com o erro
      let {nome, sobrenome} = this.usuarioForm.controls;
      if(!this.usuarioForm.valid){
        if(!nome.valid){
          this.erroNome = true;
          this.messageNome = 'NOME DEVE SER PREENCHIDO';
        }else{
          this.messageNome = '';
        }
        if(!sobrenome.valid){
          this.erroSobrenome = true;
          this.messageSobrenome = 'SOBRENOME DEVE SER PREENCHIDO';
        }else{
          this.messageSobrenome = '';
        }
      }else{
        //chama a função responsável por criar um login randômico e atribui ao login do novo usuário
        this.usuario.login = this.dbService.geraLogin(this.usuario.nome, this.usuario.sobrenome);
        //cadastra o novo usuário na base
        this.keyUsuario = this.dbService.cadastraUsuario(this.usuario);
        //exibe a tela de loading, criada acima
        loading.present().then((data) => {loading.dismiss(); 
          //cria um alerta informando que foi tudo ok e exibindo o login e senha criados ou exibindo que houve um erro
          const alert = this.alertCtrl.create({
              title:this.usuario.nome + ' ' + this.usuario.sobrenome,
              subTitle: 'LOGIN: '+this.usuario.login, 
              message: 'SENHA PROVISÓRIA: '+this.usuario.senha,
              buttons: ['Ok']});
            alert.present().then(r => this.navCtrl.setRoot(HomeAdmPage))}) //assim que fechar o alerta, ele vai para a home
          .catch((error) => {
            loading.dismiss();
            const alert = this.alertCtrl.create({
              subTitle: 'Cadastro de médico falhou',
              message: 'Tente novamente',
              buttons: ['Ok']});
            alert.present();})
      
      }
    }else{
      const alert = this.alertCtrl.create({
        subTitle: 'Cadastro de médico falhou',
        message: 'Já existe um médico cadastrado com esse nome',
        buttons: ['Ok']});
      alert.present();
    }
    
  }

  //informo para qual página deve ser encaminhada a aplicação caso seja clicado em voltar
  voltar(){
    this.navCtrl.setRoot(HomeAdmPage);
  }

}
