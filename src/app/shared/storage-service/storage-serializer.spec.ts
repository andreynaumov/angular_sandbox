import { StorageSerializer } from './storage-serializer';

describe('StorageSerializer', () => {
  let serializer: StorageSerializer;

  beforeEach(() => {
    serializer = new StorageSerializer();
    spyOn(console, 'error');
  });

  it('should serialize and deserialize primitives', () => {
    expect(serializer.deserialize(serializer.serialize(123))).toBe(123);
    expect(serializer.deserialize(serializer.serialize('test'))).toBe('test');
    expect(serializer.deserialize(serializer.serialize(true))).toBe(true);
    expect(serializer.deserialize(serializer.serialize(null))).toBe(null);
    expect(serializer.deserialize(serializer.serialize(undefined))).toBe(undefined);
  });

  it('should serialize and deserialize Date objects', () => {
    const date = new Date('2024-01-01T10:00:00.000Z');
    const result = serializer.deserialize(serializer.serialize(date));

    expect(result).toBeInstanceOf(Date);
    expect(result).toEqual(date);
  });

  it('should serialize and deserialize objects with Date fields', () => {
    const obj = {
      name: 'John',
      age: 30,
      hasAnimals: true,
      weight: undefined,
      address: null,
      createdAt: new Date('2024-01-01'),
      metadata: {
        updatedAt: new Date('2024-02-01'),
      },
    };

    const result = serializer.deserialize(serializer.serialize(obj)) as typeof obj;

    expect(result.name).toBe('John');
    expect(result.age).toBe(30);
    expect(result.hasAnimals).toBe(true);
    expect(result.weight).toBe(undefined);
    expect(result.address).toBe(null);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt).toEqual(obj.createdAt);
    expect(result.metadata.updatedAt).toBeInstanceOf(Date);
    expect(result.metadata.updatedAt).toEqual(obj.metadata.updatedAt);
  });

  it('should serialize and deserialize arrays', () => {
    const arr = [1, 'two', true, null, new Date('2024-01-01')];
    const result = serializer.deserialize(serializer.serialize(arr)) as typeof arr;

    expect(result[0]).toBe(1);
    expect(result[1]).toBe('two');
    expect(result[2]).toBe(true);
    expect(result[3]).toBe(null);
    expect(result[4]).toBeInstanceOf(Date);
    expect(result[4]).toEqual(arr[4]);
  });

  it('should handle complex nested objects', () => {
    const obj = {
      users: [
        { name: 'Alice', joinedAt: new Date('2024-01-01') },
        { name: 'Bob', joinedAt: new Date('2024-02-01') },
      ],
      settings: {
        theme: 'dark',
        lastUpdated: new Date('2024-03-01'),
      },
    };

    const result = serializer.deserialize(serializer.serialize(obj)) as typeof obj;

    expect(result.users[0].joinedAt).toBeInstanceOf(Date);
    expect(result.users[1].joinedAt).toBeInstanceOf(Date);
    expect(result.settings.lastUpdated).toBeInstanceOf(Date);
    expect(result).toEqual(obj);
  });

  it('should return null for invalid JSON', () => {
    const result = serializer.deserialize('invalid json');
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });
});
