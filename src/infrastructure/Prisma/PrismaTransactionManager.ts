import { ITransactionManager } from '@/application/shared/ITransactionManager'
import prisma from './prismaClient'
import { PrismaClientManager } from './PrismaClientManager'
import { injectable, inject } from 'tsyringe'

@injectable()
export class PrismaTransactionManager implements ITransactionManager {
  constructor(
    @inject('IDataAccessClientManager')
    private clientManager: PrismaClientManager
  ) {}

  async begin<T>(callback: () => Promise<T>): Promise<T | undefined> {
    return await prisma.$transaction(async (transaction) => {
      this.clientManager.setClient(transaction)

      const res = await callback()
      // リセット
      this.clientManager.setClient(prisma)

      return res
    })
  }
}
