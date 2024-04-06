import { IDomainEventPublisher } from '@/domain/shared/DomainEvent/IDomainEventPublisher'
import { DomainEvent } from '@/domain/shared/DomainEvent/DomainEvent'

export class MockDomainEventPublisher implements IDomainEventPublisher {
  publish(domainEvent: DomainEvent) {
    domainEvent
  }
}
