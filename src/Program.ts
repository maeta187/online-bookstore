import { container, Lifecycle } from 'tsyringe'

import { PrismaBookRepository } from './infrastructure/Prisma/Book/PrismaBookRepository'
import { PrismaClientManager } from './infrastructure/Prisma/PrismaClientManager'
import { PrismaTransactionManager } from './infrastructure/Prisma/PrismaTransactionManager'

// repository
container.register('IBookRepository', {
  useClass: PrismaBookRepository
})

// transactionManager
container.register('ITransactionManager', {
  useClass: PrismaTransactionManager
})

// IDataAccessClientManager
container.register(
  'IDataAccessClientManager',
  {
    useClass: PrismaClientManager
  },
  // The same instance will be resolved for each resolution of this dependency during a single resolution chain
  { lifecycle: Lifecycle.ResolutionScoped }
)
