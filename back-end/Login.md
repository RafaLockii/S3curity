# Documentação da API de Autenticação e Autorização

# Descrição
Esta API oferece funcionalidades para autenticação e autorização de usuários, incluindo a geração de tokens JWT e middleware para autorização baseada em funções.

# Endpoints

## 1. Login
Descrição: Autentica um usuário e gera um token JWT.
Rota: POST /login
Corpo da Requisição: { "email": "example@example.com", "senha": "password" }
Retorno: Token JWT e informações básicas do usuário

## 2. Middleware de Autenticação de Token
Descrição: Middleware para autenticar o token JWT enviado nas requisições.
Função: autenticarToken(req, res, next)
Funcionamento: Verifica se o token é válido e decodifica os dados do usuário.

## 3. Middleware de Autorização de Funcionário Administrador
Descrição: Middleware para autorizar apenas funcionários administradores.
Função: funcionarioAdminAuthMiddleware(req, res, next)
Funcionamento: Verifica se o usuário é um funcionário administrador.

## 4. Middleware de Autorização de Administrador S3curity
Descrição: Middleware para autorizar apenas administradores com permissões específicas.
Função: adminAuthMiddlewareS3curity(req, res, next)
Funcionamento: Verifica as permissões de administrador s3curity.

## 5. Middleware de Autorização de Administrador de Empresa ou S3curity
Descrição: Middleware para autorizar administradores de empresa ou s3curity.
Função: adminEmpresaOrS3curity(req, res, next)
Funcionamento: Verifica as permissões de administrador de empresa ou s3curity.