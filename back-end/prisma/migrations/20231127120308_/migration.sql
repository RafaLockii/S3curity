-- DropIndex
DROP INDEX `Carrossel_empresa_id_fkey` ON `carrossel`;

-- DropIndex
DROP INDEX `Funcionario_empresa_id_fkey` ON `funcionario`;

-- DropIndex
DROP INDEX `Itens_menus_id_fkey` ON `itens`;

-- DropIndex
DROP INDEX `Menus_modulos_id_fkey` ON `menus`;

-- DropIndex
DROP INDEX `Relatorios_itens_id_fkey` ON `relatorios`;

-- AlterTable
ALTER TABLE `funcionario` MODIFY `ativo` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `TwoFactorAuth` ADD CONSTRAINT `TwoFactorAuth_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE `_FuncionarioModulos` ADD CONSTRAINT `_FuncionarioModulos_A_fkey` FOREIGN KEY (`A`) REFERENCES `Funcionario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FuncionarioModulos` ADD CONSTRAINT `_FuncionarioModulos_B_fkey` FOREIGN KEY (`B`) REFERENCES `Modulos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
