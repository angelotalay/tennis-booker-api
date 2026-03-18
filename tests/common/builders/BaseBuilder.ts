/******************************************************************************
Class
 ******************************************************************************/

type EntityWithId = {
  id: number;
};

abstract class BaseBuilder<T extends EntityWithId> {
  protected entity: T;

  protected constructor(entity: T) {
    this.entity = entity;
  }

  public withId(id: number): this {
    this.entity.id = id;
    return this;
  }

  public build(): T {
    return structuredClone(this.entity);
  }
}

/******************************************************************************
Export
 ******************************************************************************/

export default BaseBuilder;
