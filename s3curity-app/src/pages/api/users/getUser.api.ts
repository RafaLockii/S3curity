import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const datasExemplo = [
    {
      nome: 'Exemplo1',
      operacional: true,
      estrategico: false,
      gerencial: false,
      ativo: true,
      empresa: 'Empresa1',
    },
    {
      nome: 'Exemplo2',
      operacional: true,
      estrategico: false,
      gerencial: false,
      ativo: true,
      empresa: 'Empresa2',
    },
  ];
  if (req.method === 'GET') {
    // Datas de exemplo
    

    res.status(200).json({ datas: datasExemplo });
  }
}