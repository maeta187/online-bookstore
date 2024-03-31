import { ITransactionManager } from '@/application/shared/ITransactionManager'
import { Book } from '@/domain/models/Book/Book'
import { BookId } from '@/domain/models/Book/BookId/BookId'
import { IBookRepository } from '@/domain/models/Book/IBookRepository'
import { Price } from '@/domain/models/Book/Price/Price'
import { Title } from '@/domain/models/Book/Title/Title'
import { ISBNDuplicationCheckDomainService } from '@/domain/services/Book/ISBNDuplicationCheckDomainService/ISBNDuplicationCheckDomainService'
import { injectable, inject } from 'tsyringe'

export type RegisterBookCommand = {
  isbn: string
  title: string
  priceAmount: number
}

@injectable()
export class RegisterBookApplicationService {
  constructor(
    @inject('IBookRepository')
    private bookRepository: IBookRepository,
    @inject('ITransactionManager')
    private transactionManager: ITransactionManager
  ) {}

  async execute(command: RegisterBookCommand): Promise<void> {
    await this.transactionManager.begin(async () => {
      const isDuplicateISBN = await new ISBNDuplicationCheckDomainService(
        this.bookRepository
      ).execute(new BookId(command.isbn))

      if (isDuplicateISBN) {
        throw new Error('既に存在する書籍です')
      }

      const book = Book.create(
        new BookId(command.isbn),
        new Title(command.title),
        new Price({ amount: command.priceAmount, currency: 'JPY' })
      )

      await this.bookRepository.save(book)
    })
  }
}
