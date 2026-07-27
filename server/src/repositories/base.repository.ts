import { Types, type Document, type Model } from 'mongoose';

/**
 * Persistence-only base repository (Architecture 1.1 / Epic 01 M1).
 * No auth, authorization, or business orchestration.
 */
export abstract class BaseRepository<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  protected async insert(data: object): Promise<T> {
    const created = await this.model.create(data);
    return created as T;
  }

  async findById(id: string): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.model.findById(id).exec();
  }

  async findOne(filter: object): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findMany(
    filter: object,
    options?: { limit?: number; sort?: Record<string, 1 | -1> },
  ): Promise<T[]> {
    const query = this.model.find(filter);
    if (options?.sort) {
      query.sort(options.sort);
    }
    if (typeof options?.limit === 'number') {
      query.limit(options.limit);
    }
    return query.exec();
  }

  async updateById(id: string, update: object): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.model.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
  }

  async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async exists(filter: object): Promise<boolean> {
    const found = await this.model.exists(filter).exec();
    return found !== null;
  }

  async count(filter: object = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
