import EventInterface from "./event/event.interface";

export default abstract class Aggregate {
  private _domainEvents: EventInterface[] = []; 

  get domainEvents(): EventInterface[] {
    return this._domainEvents;
  }

  public addDomainEvent(event: EventInterface): void {
    if (!this._domainEvents) {
      this._domainEvents = [];
    }
    this._domainEvents.push(event);
  }

  public removeDomainEvent(event: EventInterface): void {
    const index = this._domainEvents.indexOf(event);
    if (index > -1) {
      this._domainEvents.splice(index, 1);
    }
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}