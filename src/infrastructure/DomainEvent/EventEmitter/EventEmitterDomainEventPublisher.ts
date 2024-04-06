import { IDomainEventPublisher } from '@/domain/shared/DomainEvent/IDomainEventPublisher'
import EventEmitterClient from './EventEmitterClient'
import { DomainEvent } from '@/domain/shared/DomainEvent/DomainEvent'
import { container } from 'tsyringe'

export class EventEmitterDomainEventPublisher implements IDomainEventPublisher {
  public publish(domainEvent: DomainEvent): void {
    container
      .resolve(EventEmitterClient)
      .eventEmitter.emit(domainEvent.eventName, domainEvent)
  }
}
