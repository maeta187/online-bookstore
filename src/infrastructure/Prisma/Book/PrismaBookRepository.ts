import { $Enums } from '@prisma/client'
import { Book } from '@/domain/models/Book/Book'
import { BookId } from '@/domain/models/Book/BookId/BookId'
import { IBookRepository } from '@/domain/models/Book/IBookRepository'
import { Price } from '@/domain/models/Book/Price/Price'
import { QuantityAvailable } from '@/domain/models/Book/Stock/QuantityAvailable/QuantityAvailable'
import { Status, StatusEnum } from '@/domain/models/Book/Stock/Status/Status'
import { Stock } from '@/domain/models/Book/Stock/Stock'
import { StockId } from '@/domain/models/Book/Stock/StockId/StockId'
import { Title } from '@/domain/models/Book/Title/Title'
import { PrismaClientManager } from '../PrismaClientManager'
import { injectable, inject } from 'tsyringe'
import { IDomainEventPublisher } from '@/domain/shared/DomainEvent/IDomainEventPublisher'

@injectable()
export class PrismaBookRepository implements IBookRepository {
  // ClientManagerをDIする
  constructor(
    @inject('IDataAccessClientManager')
    private clientManager: PrismaClientManager
  ) {}

  // DBのstatusの型とドメイン層のStatusの型が異なるので変換する
  private statusDataMapper(
    status: StatusEnum
  ): 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' {
    switch (status) {
      case StatusEnum.InStock:
        return 'IN_STOCK'
      case StatusEnum.LowStock:
        return 'LOW_STOCK'
      case StatusEnum.OutOfStock:
        return 'OUT_OF_STOCK'
    }
  }

  private statusEnumMapper(status: $Enums.Status): Status {
    switch (status) {
      case 'IN_STOCK':
        return new Status(StatusEnum.InStock)
      case 'LOW_STOCK':
        return new Status(StatusEnum.LowStock)
      case 'OUT_OF_STOCK':
        return new Status(StatusEnum.OutOfStock)
    }
  }

  async save(book: Book, domainEventPublisher: IDomainEventPublisher) {
    const client = this.clientManager.getClient()
    await client.book.create({
      data: {
        bookId: book.bookId.value,
        title: book.title.value,
        priceAmount: book.price.value.amount,
        stock: {
          create: {
            stockId: book.stockId.value,
            quantityAvailable: book.quantityAvailable.value,
            status: this.statusDataMapper(book.status.value)
          }
        }
      }
    })
    // ここでイベントをパブリッシュする
    book.getDomainEvents().forEach((event) => {
      domainEventPublisher.publish(event)
    })
    book.clearDomainEvents()
  }

  async update(book: Book) {
    const client = this.clientManager.getClient()
    await client.book.update({
      where: {
        bookId: book.bookId.value
      },
      data: {
        title: book.title.value,
        priceAmount: book.price.value.amount,
        stock: {
          update: {
            quantityAvailable: book.quantityAvailable.value,
            status: this.statusDataMapper(book.status.value)
          }
        }
      }
    })
  }

  async delete(bookId: BookId) {
    const client = this.clientManager.getClient()
    await client.book.delete({
      where: {
        bookId: bookId.value
      }
    })
  }

  async find(bookId: BookId): Promise<Book | null> {
    const client = this.clientManager.getClient()
    const data = await client.book.findUnique({
      where: {
        bookId: bookId.value
      },
      include: {
        stock: true
      }
    })

    if (!data || !data.stock) {
      return null
    }

    return Book.reconstruct(
      new BookId(data.bookId),
      new Title(data.title),
      new Price({ amount: data.priceAmount, currency: 'JPY' }),
      Stock.reconstruct(
        new StockId(data.stock.stockId),
        new QuantityAvailable(data.stock.quantityAvailable),
        this.statusEnumMapper(data.stock.status)
      )
    )
  }
}
