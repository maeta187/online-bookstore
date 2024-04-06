import { DomainEvent } from './DomainEvent'

export interface IDomainEventPublisher {
  publish(event: DomainEvent): void
}
