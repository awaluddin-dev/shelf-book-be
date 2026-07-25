import { NotFoundException } from '@nestjs/common';

export abstract class BaseCrudService {
  protected async getMany<T>(delegate: {
    findMany: (args?: any) => Promise<T[]>;
  }): Promise<T[]> {
    return delegate.findMany();
  }

  protected async getById<T extends { id: string }>(
    delegate: {
      findUnique: (args: { where: { id: string } }) => Promise<T | null>;
    },
    id: string,
  ): Promise<T> {
    const item = await delegate.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  protected async createOne<T, D>(
    delegate: { create: (args: { data: D }) => Promise<T> },
    data: D,
  ): Promise<T> {
    return delegate.create({ data });
  }

  protected async updateOne<T, D>(
    delegate: {
      update: (args: { where: { id: string }; data: D }) => Promise<T>;
    },
    id: string,
    data: D,
  ): Promise<T> {
    try {
      return await delegate.update({ where: { id }, data });
    } catch {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
  }

  protected async deleteOne<T>(
    delegate: { delete: (args: { where: { id: string } }) => Promise<T> },
    id: string,
  ): Promise<{ success: boolean }> {
    try {
      await delegate.delete({ where: { id } });
      return { success: true };
    } catch {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
  }
}
