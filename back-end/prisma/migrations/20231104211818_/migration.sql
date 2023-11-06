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

-- CreateTable
CREATE TABLE `_EmpresaToMenus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EmpresaToMenus_AB_unique`(`A`, `B`),
    INDEX `_EmpresaToMenus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Menus` ADD CONSTRAINT `Menus_modulos_id_fkey` FOREIGN KEY (`modulos_id`) REFERENCES `Modulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Itens` ADD CONSTRAINT `Itens_menus_id_fkey` FOREIGN KEY (`menus_id`) REFERENCES `Menus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `relatorios` ADD CONSTRAINT `relatorios_itens_id_fkey` FOREIGN KEY (`itens_id`) REFERENCES `Itens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carrossel` ADD CONSTRAINT `Carrossel_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EmpresaToMenus` ADD CONSTRAINT `_EmpresaToMenus_A_fkey` FOREIGN KEY (`A`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EmpresaToMenus` ADD CONSTRAINT `_EmpresaToMenus_B_fkey` FOREIGN KEY (`B`) REFERENCES `Menus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
