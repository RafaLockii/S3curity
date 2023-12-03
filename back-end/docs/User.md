# Rotas da API de Usuários

## 1. GET /user/:id
Descrição: Obtém informações de um usuário pelo ID.
Parâmetros: id (ID do usuário).
Autenticação: Requer um token de autenticação.
Middleware: autenticarToken.
Controlador: UserController.getUser.

## 2. GET /users/all/:empresa
Descrição: Obtém uma lista de todos os usuários de uma empresa específica.
Parâmetros: empresa (Nome da empresa).
Autenticação: Requer um token de autenticação e acesso de administrador ou a empresa específica.
Middleware: autenticarToken, adminEmpresaOrS3curity.
Controlador: UserController.listUsers.

## 3. POST /user/create
Descrição: Cria um novo usuário.
Autenticação: Requer um token de autenticação e acesso de administrador ou a empresa específica.
Middleware: autenticarToken, adminEmpresaOrS3curity.
Controlador: UserController.createUser.

## 4. POST /user/ativar
Descrição: Ativa um usuário verificado com um código/token.
Autenticação: Não requer autenticação.
Controlador: UserController.ativarUser.

## 5. PUT /user/edit/:id
Descrição: Edita informações de um usuário existente pelo ID.
Parâmetros: id (ID do usuário).
Autenticação: Requer um token de autenticação e acesso de administrador ou a empresa específica.
Middleware: autenticarToken, adminEmpresaOrS3curity.
Controlador: UserController.editUser.

## 6. DELETE /user/:id
Descrição: Exclui um usuário pelo ID, juntamente com suas informações associadas.
Parâmetros: id (ID do usuário).
Autenticação: Requer um token de autenticação e acesso de administrador ou a empresa específica.
Middleware: autenticarToken, adminEmpresaOrS3curity.
Controlador: UserController.deleteUser.

## 7. DELETE /delete-menu
Descrição: Remove um menu de usuário específico.
Autenticação: Requer um token de autenticação e acesso de administrador ou a empresa específica.
Middleware: autenticarToken, adminEmpresaOrS3curity.
Controlador: UserController.deleteMenuUser.

## 8. DELETE /delete-item
Descrição: Remove um item e seus relatórios associados para um usuário específico.
Autenticação: Requer um token de autenticação e acesso de administrador ou a empresa específica.
Middleware: autenticarToken, adminEmpresaOrS3curity.
Controlador: UserController.deleteItemWithReportsForUser.

## 9. DELETE /delete-relatorio
Descrição: Remove um relatório para um item específico de um usuário.
Autenticação: Requer um token de autenticação e acesso de administrador ou a empresa específica.
Middleware: autenticarToken, adminEmpresaOrS3curity.
Controlador: UserController.deleteReportForItem.