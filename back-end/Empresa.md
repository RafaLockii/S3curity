## Rotas da API
# 1. GET /empresas
Descrição: Obtém a lista de todas as empresas.
Autenticação: Requer um token de autenticação de administrador.
Middleware: autenticarToken, adminAuthMiddlewareS3curity.
Controlador: EmpresaController.listEmpresas.

# 2. GET /empresa/:id
Descrição: Obtém informações de uma empresa pelo ID.
Parâmetros: id (ID da empresa).
Autenticação: Requer um token de autenticação.
Middleware: autenticarToken.
Controlador: EmpresaController.getEmpresa.

# 3. GET /empresa_name/:nome
Descrição: Obtém informações de uma empresa pelo nome.
Parâmetros: nome (Nome da empresa).
Autenticação: Requer um token de autenticação.
Middleware: autenticarToken.
Controlador: EmpresaController.getEmpresaByName.

# 4. POST /empresa/create
Descrição: Cria uma nova empresa.
Autenticação: Requer um token de autenticação de administrador.
Middleware: autenticarToken, adminAuthMiddlewareS3curity.
Controlador: EmpresaController.createEmpresa.

# 5. PUT /empresa/edit/:id
Descrição: Edita informações de uma empresa existente pelo ID.
Parâmetros: id (ID da empresa).
Autenticação: Requer um token de autenticação de administrador.
Middleware: autenticarToken, adminAuthMiddlewareS3curity.
Controlador: EmpresaController.editEmpresa.

# 6. DELETE /empresa/:id
Descrição: Exclui uma empresa pelo ID, juntamente com seus carrosséis e funcionários associados.
Parâmetros: id (ID da empresa).
Autenticação: Requer um token de autenticação de administrador.
Middleware: autenticarToken, adminAuthMiddlewareS3curity.
Controlador: EmpresaController.deleteEmpresa.