import { BookId } from '@/domain/models/Book/BookId/BookId'
import { IBookRepository } from '@/domain/models/Book/IBookRepository'

export class ISBNDuplicationCheckDomainService {
  constructor(private bookRepository: IBookRepository) {}

  async execute(isbn: BookId): Promise<boolean> {
    // データベースに問い居合わせて重複があるか確認する
    const duplicateISBNBook = await this.bookRepository.find(isbn)

    const isDuplicateISBN = !!duplicateISBNBook

    return isDuplicateISBN
  }
}
