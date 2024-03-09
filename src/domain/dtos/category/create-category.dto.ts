



export class CreateCategoryDTO {

  private constructor(// private se puede colocar en las ultimas versiones de typescript
    public readonly name: string,
    public readonly available: boolean,
  ) {}

  static create( object: {[key:string]: any} ): [string?, CreateCategoryDTO?] {
    
    const {name, available = false} = object;
    let availableBoolean = available;

    if (!name) return ['Missing name'];
    if ( typeof available !== 'boolean' ) {
      availableBoolean = available === 'true';
    }

    return [undefined, new CreateCategoryDTO(name, availableBoolean)];

  }

}
