import { ITransactionManager } from '@/application/shared/ITransactionManager'
import { BookId } from '@/domain/models/Book/BookId/BookId'
import { IBookRepository } from '@/domain/models/Book/IBookRepository'
import { injectable, inject } from 'tsyringe'
import { IDomainEventPublisher } from '@/domain/shared/DomainEvent/IDomainEventPublisher'

export type DeleteBookCommand = {
  bookId: string
}

@injectable()
export class DeleteBookApplicationService {
  constructor(
    @inject('IBookRepository')
    private bookRepository: IBookRepository,
    @inject('ITransactionManager')
    private transactionManager: ITransactionManager,
    @inject('IDomainEventPublisher')
    private domainEventPublisher: IDomainEventPublisher
  ) {}

  async execute(command: DeleteBookCommand): Promise<void> {
    await this.transactionManager.begin(async () => {
      const book = await this.bookRepository.find(new BookId(command.bookId))

      if (!book) {
        throw new Error('書籍が存在しません')
      }

      await this.bookRepository.delete(book.bookId, this.domainEventPublisher)
    })
  }
}
