# Documentação da API de Menu

# Descrição
Esta API oferece funcionalidades para gerenciar menus, módulos e seus respectivos itens e relatórios.

# Endpoints

## 1. Criar Módulos
Descrição: Cria um ou mais módulos.
Rota: POST /createmodulo
Autenticação: Token JWT obrigatório

## 2. Criar Menu
Descrição: Cria um novo menu associado a um módulo, com seus respectivos itens e relatórios.
Rota: POST /menu/create
Autenticação: Token JWT obrigatório

## 3. Editar Menu
Descrição: Edita um menu existente.
Rota: PUT /menu/edit/:id
Parâmetros de Rota: id - ID do menu a ser editado
Autenticação: Token JWT obrigatório

## 4. Deletar Menu
Descrição: Deleta um menu existente, incluindo seus itens e relatórios associados.
Rota: DELETE /menu/delete/:id
Parâmetros de Rota: id - ID do menu a ser deletado
Autenticação: Token JWT obrigatório

## 5. Obter Menu por ID
Descrição: Obtém um menu específico por ID, incluindo seus itens e relatórios.
Rota: GET /menu/:id
Parâmetros de Rota: id - ID do menu a ser obtido
Autenticação: Token JWT obrigatório

## 6. Obter Todos os Menus
Descrição: Obtém todos os menus cadastrados, mostrando apenas informações básicas.
Rota: GET /menus
Autenticação: Token JWT obrigatório

## 7. Obter Menus para Interface do Usuário
Descrição: Obtém todos os menus cadastrados, mostrando apenas informações básicas e o módulo associado.
Rota: GET /menus_front
Autenticação: Token JWT obrigatório

## 8. Obter Itens
Descrição: Obtém todos os itens dos menus cadastrados, mostrando apenas informações básicas e o ID do menu associado.
Rota: GET /itens
Autenticação: Token JWT obrigatório

## 9. Obter Relatórios
Descrição: Obtém todos os relatórios dos itens dos menus cadastrados, mostrando apenas informações básicas e o ID do item associado.
Rota: GET /relatorios
Autenticação: Token JWT obrigatório

## 10. Obter Todos os Módulos
Descrição: Obtém todos os módulos cadastrados no sistema.
Rota: GET /modulos
Autenticação: Token JWT obrigatório