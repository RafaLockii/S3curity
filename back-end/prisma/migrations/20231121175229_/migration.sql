/*
  Warnings:

  - You are about to drop the column `empresa_id` on the `menus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[funcionario_id]` on the table `Imagem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `funcionario_id` to the `Imagem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Carrossel_empresa_id_fkey` ON `carrossel`;

-- DropIndex
DROP INDEX `Funcionario_cargo_id_fkey` ON `funcionario`;

-- DropIndex
DROP INDEX `Funcionario_empresa_id_fkey` ON `funcionario`;

-- DropIndex
DROP INDEX `Funcionario_imagem_perfil_id_fkey` ON `funcionario`;

-- DropIndex
DROP INDEX `Itens_menus_id_fkey` ON `itens`;

-- DropIndex
DROP INDEX `Menus_empresa_id_fkey` ON `menus`;

-- DropIndex
DROP INDEX `Menus_modulos_id_fkey` ON `menus`;

-- DropIndex
DROP INDEX `relatorios_itens_id_fkey` ON `relatorios`;

-- AlterTable
ALTER TABLE `imagem` ADD COLUMN `funcionario_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `menus` DROP COLUMN `empresa_id`;

-- CreateTable
CREATE TABLE `_FuncionarioMenus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FuncionarioMenus_AB_unique`(`A`, `B`),
    INDEX `_FuncionarioMenus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FuncionarioItens` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FuncionarioItens_AB_unique`(`A`, `B`),
    INDEX `_FuncionarioItens_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FuncionarioRelatorios` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FuncionarioRelatorios_AB_unique`(`A`, `B`),
    INDEX `_FuncionarioRelatorios_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Imagem_funcionario_id_key` ON `Imagem`(`funcionario_id`);

-- AddForeignKey
ALTER TABLE `TwoFactorAuth` ADD CONSTRAINT `TwoFactorAuth_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_cargo_id_fkey` FOREIGN KEY (`cargo_id`) REFERENCES `Cargos`(`cargo_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imagem` ADD CONSTRAINT `Imagem_funcionario_id_fkey` FOREIGN KEY (`funcionario_id`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Menus` ADD CONSTRAINT `Menus_modulos_id_fkey` FOREIGN KEY (`modulos_id`) REFERENCES `Modulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Itens` ADD CONSTRAINT `Itens_menus_id_fkey` FOREIGN KEY (`menus_id`) REFERENCES `Menus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relatorios` ADD CONSTRAINT `Relatorios_itens_id_fkey` FOREIGN KEY (`itens_id`) REFERENCES `Itens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carrossel` ADD CONSTRAINT `Carrossel_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionarioMenus` ADD CONSTRAINT `_FuncionarioMenus_A_fkey` FOREIGN KEY (`A`) REFERENCES `Funcionario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionarioMenus` ADD CONSTRAINT `_FuncionarioMenus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Menus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionarioItens` ADD CONSTRAINT `_FuncionarioItens_A_fkey` FOREIGN KEY (`A`) REFERENCES `Funcionario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionarioItens` ADD CONSTRAINT `_FuncionarioItens_B_fkey` FOREIGN KEY (`B`) REFERENCES `Itens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionarioRelatorios` ADD CONSTRAINT `_FuncionarioRelatorios_A_fkey` FOREIGN KEY (`A`) REFERENCES `Funcionario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionarioRelatorios` ADD CONSTRAINT `_FuncionarioRelatorios_B_fkey` FOREIGN KEY (`B`) REFERENCES `Relatorios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
