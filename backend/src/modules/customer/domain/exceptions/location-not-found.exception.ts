export class LocationNotFoundException extends Error {
  constructor(id: string) {
    super(`Location with ID '${id}' not found`);
    this.name = 'LocationNotFoundException';
  }
}
