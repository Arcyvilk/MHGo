export type EntityType =
  | 'items'
  | 'materials'
  | 'resources'
  | 'monsters'
  | 'biomes'
  | 'quests'
  | 'questDaily';

export type ChangeType = 'delete' | 'update';

export type ChangeReview = {
  /**
   * Date when the change was made
   */
  date: Date;
  /**
   * ID of the admin who made the change
   */
  adminId: string;
  /**
   * ID of the entity that was indirectly changed by changing other entity
   */
  affectedEntityId: string;
  /**
   * Type of the entity that was indirectly changed by changing other entity
   */
  affectedEntityType: EntityType;
  /**
   * ID of the entity that was changed
   */
  changedEntityId: string;
  /**
   * Type of the entity that was changed
   */
  changedEntityType: EntityType;
  /**
   * Name of the entity that was changed (used if original entity was deleted)
   */
  changedEntityName: string;
  /**
   * Type of change made to the entity
   */
  changeType: ChangeType;
  /**
   * Relation to the indirectly affected entity.
   * For example, we delete an "item".
   * Another "item" is affected by this deletion because it was its crafting ingridient.
   * Therefore, "relationAffected" is "itemCraft" because that's the name of the collection
   * where the deleted entity was referenced by the affected entity.
   */
  relation: string;
};
