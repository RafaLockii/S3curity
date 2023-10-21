-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "Senha" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" INTEGER NOT NULL,
    "Modulo_Default" TEXT NOT NULL,
    "Imagem" TEXT NOT NULL,
    "Acesso_admin" TEXT NOT NULL,
    "Ativo" TEXT NOT NULL,
    "Data_cad_alt" DATETIME NOT NULL,
    "User_cad_alt" TEXT NOT NULL,
    "Empresa" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "Razao_S" TEXT NOT NULL,
    "Logo" TEXT NOT NULL,
    "Data_alt" DATETIME NOT NULL,
    "User_cad_alt" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
