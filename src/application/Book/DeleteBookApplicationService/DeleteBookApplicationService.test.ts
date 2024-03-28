import { InMemoryBookRepository } from '@/infrastructure/InMemory/Book/InMemoryBookRepository'
import { BookId } from '@/domain/models/Book/BookId/BookId'
import { MockTransactionManager } from '@/application/shared/MockTransactionManager'
import { bookTestDataCreator } from '@/infrastructure/shared/Book/bookTestDataCreator'
import {
  DeleteBookApplicationService,
  DeleteBookCommand
} from './DeleteBookApplicationService'

describe('DeleteBookApplicationService', () => {
  it('書籍を削除することができる', async () => {
    const repository = new InMemoryBookRepository()
    const mockTransactionManager = new MockTransactionManager()
    const deleteBookApplicationService = new DeleteBookApplicationService(
      repository,
      mockTransactionManager
    )

    // テスト用データ作成
    const bookId = '9784167158057'
    await bookTestDataCreator(repository)({
      bookId
    })

    const command: Required<DeleteBookCommand> = { bookId }
    await deleteBookApplicationService.execute(command)

    const deletedBook = await repository.find(new BookId(bookId))
    expect(deletedBook).toBeNull()
  })
})