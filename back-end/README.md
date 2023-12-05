# Instalação de Dependencias

npm install

# Configuração do Prisma no .env com seu caminho do banco, antes faça a criação da database security: 

DATABASE_URL= "mysql://root:@localhost:3306/security"

# Envio do Prisma para o Banco

npx prisma generate

npx prisma db push

# Envio de E-mails pelo Mailtrap, deve ser criado uma conta, selecionado o Integrations como Node.js e inserido suas chaves no .env

SMTP_HOST = 
SMTP_PORT = 
SMTP_USER = 
SMTP_PASSWORD = 

# Configuração da porta do sistema no .env

PORT = 
HOST = 

# Por fim pode rodar o sistema 

npm run dev