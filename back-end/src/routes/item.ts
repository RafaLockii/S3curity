import express from 'express';
import * as ItemController from '../controllers/itemController';

const itemRoutes = express.Router();

// itemRoutes.get('/itens/all', ItemController.getAllItens);
// itemRoutes.get('/itens/:id', ItemController.getItem);
itemRoutes.post('/itens/create', ItemController.createItem);
itemRoutes.get('/menu/:empresa_id/:modulo_id', ItemController.filterByEmpresaAndModulo);
// itemRoutes.put('/itens/:id', ItemController.updateItem);
// itemRoutes.delete('/itens/:id', ItemController.deleteItem);

export default itemRoutes;