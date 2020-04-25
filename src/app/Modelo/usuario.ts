// aqui é criado um modelo para o Usuário. Isso facilita na hora de utilização. Por exemplo, eu sei que todo informe 
// tem que ter nome, sobrenome, etc. Quando eu for utilizar um informe em qualquer lugar do código, ao invés de 
// ficar procurando quais variáveis um informe deve ter, é só instanciar um informe. Se não tiver todas as variáveis,
// ele dá erro e informa quais variáveis estão faltando.
// Se tiver um '?' do lado da variávelé porque ela não é obrigatória.

export interface Usuario{
    prontuario?: string;
    nome: string;
    sobrenome: string;
    dtNasc?: string;
    login: string;
    senha: string;
    tipo: string;
}