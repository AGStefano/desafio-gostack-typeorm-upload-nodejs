import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(transaction_id: string): Promise<void> {
    if (!transaction_id) {
      throw new AppError('Id not provided');
    }

    const transactionRepository = getRepository(Transaction);

    const transaction = await transactionRepository.findOne(transaction_id);

    if (!transaction) {
      throw new AppError('transaction not found');
    }

    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
