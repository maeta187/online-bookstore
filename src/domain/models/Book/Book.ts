import { BookId } from './BookId/BookId'
import { Price } from './Price/Price'
import { Status, StatusEnum } from './Stock/Status/Status'
import { Stock } from './Stock/Stock'
import { Title } from './Title/Title'
import { DomainEventStorable } from '@/domain/shared/DomainEvent/DomainEventStorable'
import {
  BOOK_EVENT_NAME,
  BookDomainEventFactory
} from '@/domain/shared/DomainEvent/Book/BookDomainEventFactory'
export class Book extends DomainEventStorable {
  private constructor(
    private readonly _bookId: BookId,
    private _title: Title,
    private _price: Price,
    private readonly _stock: Stock
  ) {
    super()
  }

  static create(bookId: BookId, title: Title, price: Price): Book {
    const book = new Book(bookId, title, price, Stock.create())
    book.addDomainEvent(
      new BookDomainEventFactory(book).createEvent(BOOK_EVENT_NAME.CREATED)
    )

    return book
  }

  static reconstruct(
    bookId: BookId,
    title: Title,
    price: Price,
    stocks: Stock
  ): Book {
    return new Book(bookId, title, price, stocks)
  }

  delete(): void {
    this._stock.delete()

    this.addDomainEvent(
      new BookDomainEventFactory(this).createEvent(BOOK_EVENT_NAME.DELETED)
    )
  }

  changeTitle(newTitle: Title): void {
    this._title = newTitle
  }

  changePrice(newPrice: Price): void {
    this._price = newPrice
  }

  // 販売可能かどうか
  isSaleable(): boolean {
    return (
      this._stock.quantityAvailable.value > 0 &&
      this._stock.status.value !== StatusEnum.OutOfStock
    )
  }

  incrementStock(amount: number): void {
    this._stock.increaseQuantity(amount)
  }

  decrementStock(amount: number): void {
    this._stock.decreaseQuantity(amount)

    // 在庫切れになったらイベントを生成する
    if (this.status.equals(new Status(StatusEnum.OutOfStock))) {
      this.addDomainEvent(
        new BookDomainEventFactory(this).createEvent(BOOK_EVENT_NAME.DEPLETED)
      )
    }
  }

  get bookId(): BookId {
    return this._bookId
  }

  get title(): Title {
    return this._title
  }

  get price(): Price {
    return this._price
  }

  get stockId() {
    return this._stock.stockId
  }

  get quantityAvailable() {
    return this._stock.quantityAvailable
  }

  get status() {
    return this._stock.status
  }
}
