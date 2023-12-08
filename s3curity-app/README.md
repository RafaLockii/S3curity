# Instalação

Execute o seguintes comando:

npm install

# Configuração

No arquivo .env insira o valor da variavel BASE_URL com base na url da api

Exemplo:

NEXT_PUBLIC_BASE_URL = http://localhost:3000

# Inicialização

Executes os seguintes comandos em ordem:

npm run dev

# Aplicação

A aplicação é composta pelas seguintes páginas:

## Login

Página onde o login é efetuado pelo usuário.

## Ativar

Página onde o usuário insere seu email e o token registrado para ativar sua conta.

## Esqueceu a senha

Página onde o usuário solicita a alteração de senha. O usuário insere o email da conta e recebe um link com um token para realizar a alteração.

## Home

Página acessível a todos os usuários, com um carrossel contendo imagens da empresa.

## Usuários

Página disponível para usuários com nível de acesso administrativo. Exibe uma tabela com todos os usuários da empresa. Os usuários da "s3curity" podem visualizar todos os usuários da aplicação. Nesta página, é possível criar, editar ou deletar outros usuários caso o usuário logado seja um administrador.

## Empresa

Acesso restrito a usuários com nível de acesso administrativo e registrados na "s3curity". Permite o cadastro, alteração e exclusão de empresas do sistema.

## Relatórios

Página disponível para todos os usuários. São relatórios específicos por usuário e variam de acordo com o que foi cadastrado para cada usuário.
