## Documentação da API Usuário

# GET /user/:id
Obtém um usuário existente.

Parâmetros de URL:

id: ID do usuário

# GET /users/all/:empresa
Lista todos os usuários de uma empresa específica.

Parâmetros de URL:

empresa: ID da empresa

# POST /user/create
Cria um novo usuário.

Corpo da solicitação:

{
    "nome": "Nome do usuário",
    "email": "Email do usuário",
    "senha": "Senha do usuário",
    "empresa_id": "ID da empresa do usuário"
}

# POST /user/ativar
Ativa um usuário.

Corpo da solicitação:

{
    "id": "ID do usuário"
}

# PUT /user/edit/:id
Edita um usuário existente.

Parâmetros de URL:

id: ID do usuário

Corpo da solicitação:

{
    "nome": "Novo nome do usuário",
    "email": "Novo email do usuário",
    "senha": "Nova senha do usuário",
    "empresa_id": "Novo ID da empresa do usuário"
}

# DELETE /user/:id
Exclui um usuário existente.

Parâmetros de URL:

id: ID do usuário

## Documentação da API de Empresa

Rotas
# GET /empresas
Retorna uma lista de todas as empresas. Cada empresa inclui suas informações básicas, bem como uma lista de carrosséis associados a ela.

# GET /empresa/:id
Retorna uma empresa específica pelo seu ID. A resposta inclui as informações básicas da empresa, uma lista de carrosséis associados a ela e o número de funcionários associados a ela.

# POST /empresa/create
Cria uma nova empresa. O corpo da solicitação deve incluir:

nome: O nome da empresa.
razao_s: A razão social da empresa.
logo: O logo da empresa.
imagem_fundo: A imagem de fundo da empresa.
usuario_criacao: O usuário que criou a empresa.
carrosselImagens: Uma lista de imagens para o carrossel da empresa.

# PUT /empresa/edit/:id
Edita uma empresa existente. O corpo da solicitação deve incluir:

nome: O novo nome da empresa.
razao_s: A nova razão social da empresa.
logo: O novo logo da empresa.
imagem_fundo: A nova imagem de fundo da empresa.
usuario_criacao: O usuário que está editando a empresa.
carrosselImagens: Uma nova lista de imagens para o carrossel da empresa.
DELETE /empresa/:id
Deleta uma empresa existente pelo seu ID. A empresa, seus carrosséis associados e seus funcionários associados serão todos deletados.

## Documentação da API de Menu

Rotas
# POST /createmodulo
Cria um ou mais módulos.

Corpo da solicitação:

{
    "modulos": [
        {
            "nome": "OPERACIONAL"
        },
        {
            "nome": "ESTRATÉGICO"
        },
        {
            "nome": "GERENCIAL"
        }
    ]
}

# POST /menu/create
Cria um novo menu.

Corpo da solicitação:

{
    "nome": "Nome do Menu",
    "empresa_id": 1,
    "modulo_id": 1
}

# PUT /menu/edit/:id
Edita um menu existente, seus itens e relatórios.

Parâmetros de URL:

id: ID do menu
Corpo da solicitação:

{
    "nomeMenu": "Novo Nome do Menu",
    "itens": [
        {
            "id": 1,
            "nomeItem": "Novo Nome do Item 1",
            "relatorios": [
                {
                    "id": 1,
                    "nome": "Novo Nome do Relatório 1",
                    "relatorio": "Novo Relatório 1"
                },
                {
                    "id": 2,
                    "nome": "Novo Nome do Relatório 2",
                    "relatorio": "Novo Relatório 2"
                }
            ]
        },
        {
            "id": 2,
            "nomeItem": "Novo Nome do Item 2",
            "relatorios": [
                {
                    "id": 3,
                    "nome": "Novo Nome do Relatório 3",
                    "relatorio": "Novo Relatório 3"
                }
            ]
        }
    ]
}

# DELETE /menu/delete/:id
Exclui um menu existente, seus itens e relatórios.

Parâmetros de URL:

id: ID do menu

# GET /menu/:id
Obtém um menu existente, seus itens e relatórios.

Parâmetros de URL:

id: ID do menu

# GET /menu/:empresa_id/:modulo_id
Obtém todos os menus de uma empresa com base no módulo fornecido, incluindo o nome da empresa, o nome do módulo, os itens do menu e os relatórios associados a cada item.

Parâmetros de URL:

empresa_id: ID da empresa
modulo_id: ID do módulo

# GET /menus
Obtém todas as informações dos menus, incluindo a empresa associada, o módulo, os itens do menu e os relatórios associados a cada item.