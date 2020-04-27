import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoryModel from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();

      if (balance.total < value) {
        throw new AppError('Retirada maior que valor disponível');
      }
    }

    const categorieRepository = getRepository(CategoryModel);

    let categorie = await categorieRepository.findOne({
      where: { title: category },
    });

    if (!categorie) {
      categorie = categorieRepository.create({
        title: category,
      });
      await categorieRepository.save(categorie);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categorie.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
