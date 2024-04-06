import { Book } from '@/domain/models/Book/Book'
import { BookId } from '@/domain/models/Book/BookId/BookId'
import { IBookRepository } from '@/domain/models/Book/IBookRepository'
import { Price } from '@/domain/models/Book/Price/Price'
import { QuantityAvailable } from '@/domain/models/Book/Stock/QuantityAvailable/QuantityAvailable'
import { Status, StatusEnum } from '@/domain/models/Book/Stock/Status/Status'
import { Stock } from '@/domain/models/Book/Stock/Stock'
import { StockId } from '@/domain/models/Book/Stock/StockId/StockId'
import { Title } from '@/domain/models/Book/Title/Title'
import { MockDomainEventPublisher } from '@/infrastructure/DomainEvent/Mock/MockDomainEventPublisyer'

export const bookTestDataCreator =
  (repository: IBookRepository) =>
  async ({
    bookId = '9784167158057',
    title = '吾輩は猫である',
    priceAmount = 770,
    stockId = 'test-stock-id',
    quantityAvailable = 0,
    status = StatusEnum.OutOfStock
  }): Promise<Book> => {
    const entity = Book.reconstruct(
      new BookId(bookId),
      new Title(title),
      new Price({ amount: priceAmount, currency: 'JPY' }),
      Stock.reconstruct(
        new StockId(stockId),
        new QuantityAvailable(quantityAvailable),
        new Status(status)
      )
    )

    await repository.save(entity, new MockDomainEventPublisher())

    return entity
  }
