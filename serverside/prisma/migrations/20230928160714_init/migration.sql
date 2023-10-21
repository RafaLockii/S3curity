/*
  Warnings:

  - The primary key for the `Empresa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Data_alt` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `Logo` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `Razao_S` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `User_cad_alt` on the `Empresa` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Acesso_admin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Ativo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Data_cad_alt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Empresa` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Imagem` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Modulo_Default` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Senha` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `User_cad_alt` on the `User` table. All the data in the column will be lost.
  - Added the required column `data_alt` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razao_s` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_cad_alt` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acesso_admin` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ativo` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_cad_alt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresa_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagem` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modulo_default` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_cad_alt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Funcionario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    CONSTRAINT "Funcionario_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Funcionario_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Empresa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Empresa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "razao_s" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "data_alt" DATETIME NOT NULL,
    "user_cad_alt" TEXT NOT NULL
);
INSERT INTO "new_Empresa" ("id", "nome") SELECT "id", "nome" FROM "Empresa";
DROP TABLE "Empresa";
ALTER TABLE "new_Empresa" RENAME TO "Empresa";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" INTEGER NOT NULL,
    "modulo_default" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "acesso_admin" TEXT NOT NULL,
    "ativo" TEXT NOT NULL,
    "data_cad_alt" DATETIME NOT NULL,
    "user_cad_alt" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "nome", "telefone") SELECT "email", "id", "nome", "telefone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_empresa_id_key" ON "User"("empresa_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_user_id_key" ON "Funcionario"("user_id");
