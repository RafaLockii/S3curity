# Documentação da API de Menus do Usuário

# Descrição
Esta API oferece funcionalidades para recuperar menus, itens e relatórios associados a um usuário específico.

# Endpoints

## 1. Obter Menus do Usuário
Descrição: Obtém todos os menus associados a um usuário.
Rota: GET /menus/:userId
Parâmetros de Rota: userId - ID do usuário
Retorno: Lista de menus associados ao usuário

## 2. Obter Itens do Usuário
Descrição: Obtém todos os itens dos menus associados a um usuário.
Rota: GET /itens/:userId
Parâmetros de Rota: userId - ID do usuário
Retorno: Lista de itens dos menus associados ao usuário

## 3. Obter Relatórios do Usuário
Descrição: Obtém todos os relatórios dos itens dos menus associados a um usuário.
Rota: GET /relatorios/:userId
Parâmetros de Rota: userId - ID do usuário
Retorno: Lista de relatórios dos itens dos menus associados ao usuário

## 4. Obter Módulos por ID de Usuário
Descrição: Obtém todos os módulos associados a um usuário.
Rota: GET /modulos/user/:userId
Parâmetros de Rota: userId - ID do usuário
Retorno: Lista de módulos associados ao usuário

## 5. Obter Todos os Dados Separados
Descrição: Obtém todos os dados separados (módulos, menus, itens e relatórios) de todos os usuários.
Rota: GET /data/separated
Retorno: Lista de todos os módulos, menus, itens e relatórios

## 6. Obter Dados Separados por ID de Usuário
Descrição: Obtém dados separados (módulos, menus, itens e relatórios) associados a um usuário específico.
Rota: GET /data/user/:userId
Parâmetros de Rota: userId - ID do usuário
Retorno: Lista de módulos, menus, itens e relatórios associados ao usuário