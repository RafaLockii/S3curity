# Documentação da API de Autenticação de Dois Fatores (2FA)

Descrição
Esta API oferece funcionalidades para ativar e verificar a autenticação de dois fatores (2FA) para os usuários. Ela utiliza um código de autenticação gerado e enviado por e-mail para ativar o 2FA e, posteriormente, verificar o código para atualizar a senha.

# Endpoints

## 1. Ativar Autenticação de Dois Fatores (2FA)
Descrição: Ativa a autenticação de dois fatores para um usuário e envia o código 2FA por e-mail.
Rota: POST /activate-2fa
Corpo da Requisição: { "email": "example@example.com" }
Retorno: Mensagem de confirmação e envio do código 2FA por e-mail.

## 2. Verificar Autenticação de Dois Fatores (2FA)
Descrição: Verifica o código 2FA e atualiza a senha do usuário.
Rota: POST /verify-2fa
Corpo da Requisição: { "email": "example@example.com", "code": "2FA_CODE", "newPassword": "newPassword" }
Retorno: Mensagem de sucesso ao verificar o 2FA e atualizar a senha.