import { DomainEvent } from '@/domain/shared/DomainEvent/DomainEvent'

export interface IDomainEventSubscriber {
  subscribe<T extends Record<string, unknown>>(
    enventName: string,
    callback: (event: DomainEvent<T>) => void
  ): void
}
