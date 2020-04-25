// aqui é criado um modelo para o Informe. Isso facilita na hora de utilização. Por exemplo, eu sei que todo informe 
// tem que ter estado, horaVisita, etc. Quando eu for utilizar um informe em qualquer lugar do código, ao invés de 
// ficar procurando quais variáveis um informe deve ter, é só instanciar um informe. Se não tiver todas as variáveis,
// ele dá erro e informa quais variáveis estão faltando.
// Se tiver um '?' do lado da variávelé porque ela não é obrigatória.
export interface Informe{
    estado: string;
    horaVisita: string;
    prevAlta: string;
    dataAlta?: string;
    dataHora: string;
    loginMedico: string;
    outros?: string;
    usuarioKey: any;
}