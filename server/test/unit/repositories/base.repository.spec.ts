import { Types } from 'mongoose';
import { BaseRepository } from '../../../src/repositories/base.repository';
import type { Document, Model } from 'mongoose';

interface StubDoc extends Document {
  name: string;
}

describe('BaseRepository', () => {
  const id = new Types.ObjectId().toHexString();

  function createRepo(model: Partial<Model<StubDoc>>): BaseRepository<StubDoc> {
    abstract class TestRepo extends BaseRepository<StubDoc> {
      constructor() {
        super(model as Model<StubDoc>);
      }
    }
    return new (class extends TestRepo {})();
  }

  it('should_return_null_for_invalid_object_id_on_findById', async () => {
    const findById = jest.fn();
    const repo = createRepo({ findById });
    await expect(repo.findById('not-an-id')).resolves.toBeNull();
    expect(findById).not.toHaveBeenCalled();
  });

  it('should_delegate_findById_for_valid_id', async () => {
    const exec = jest.fn().mockResolvedValue({ _id: id, name: 'x' });
    const findById = jest.fn().mockReturnValue({ exec });
    const repo = createRepo({ findById });
    await expect(repo.findById(id)).resolves.toEqual({ _id: id, name: 'x' });
    expect(findById).toHaveBeenCalledWith(id);
  });

  it('should_return_false_when_deleteById_misses', async () => {
    const exec = jest.fn().mockResolvedValue(null);
    const findByIdAndDelete = jest.fn().mockReturnValue({ exec });
    const repo = createRepo({ findByIdAndDelete });
    await expect(repo.deleteById(id)).resolves.toBe(false);
  });

  it('should_count_via_model', async () => {
    const exec = jest.fn().mockResolvedValue(3);
    const countDocuments = jest.fn().mockReturnValue({ exec });
    const repo = createRepo({ countDocuments });
    await expect(repo.count({})).resolves.toBe(3);
  });
});
