/*
  Warnings:

  - You are about to drop the column `imagem_1` on the `carrossel` table. All the data in the column will be lost.
  - You are about to drop the column `imagem_2` on the `carrossel` table. All the data in the column will be lost.
  - You are about to drop the column `imagem_3` on the `carrossel` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Carrossel` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE `carrossel` DROP COLUMN `imagem_1`,
    DROP COLUMN `imagem_2`,
    DROP COLUMN `imagem_3`,
    ADD COLUMN `nome` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TwoFactorAuth` ADD CONSTRAINT `TwoFactorAuth_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_imagem_perfil_id_fkey` FOREIGN KEY (`imagem_perfil_id`) REFERENCES `Imagem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_cargo_id_fkey` FOREIGN KEY (`cargo_id`) REFERENCES `Cargos`(`cargo_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Menus` ADD CONSTRAINT `Menus_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Menus` ADD CONSTRAINT `Menus_modulos_id_fkey` FOREIGN KEY (`modulos_id`) REFERENCES `Modulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Itens` ADD CONSTRAINT `Itens_menus_id_fkey` FOREIGN KEY (`menus_id`) REFERENCES `Menus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relatorios` ADD CONSTRAINT `relatorios_itens_id_fkey` FOREIGN KEY (`itens_id`) REFERENCES `Itens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carrossel` ADD CONSTRAINT `Carrossel_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
