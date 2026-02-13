import prisma from "../utils/prismaClient.js";
import { Prisma } from "@prisma/client";

export const create = async (data) => {
  return await prisma.filme.create({
    data: {
      ...data,
      nota: new Prisma.Decimal(data.nota),
    },
  });
};

export const findByTitulo = async (titulo) => {
  return await prisma.filme.findFirst({
    where: { titulo },
  });
};

export const findAll = async (filters = {}) => {
  const { titulo, descricao, genero } = filters;
  const where = {};

  if (titulo) where.titulo = { contains: titulo, mode: "insensitive" };
  if (descricao) where.descricao = { contains: descricao, mode: "insensitive" };
  if (genero) where.genero = { contains: genero, mode: "insensitive" };

  return await prisma.filme.findMany({
    where,
    orderBy: { criadoEm: "desc" },
  });
};

export const findById = async (id) => {
  return await prisma.filme.findUnique({
    where: { id: parseInt(id) },
  });
};

export const update = async (id, data) => {
  return await prisma.filme.update({
    where: { id: parseInt(id) },
    data: {
      ...data,
      nota: data.nota ? new Prisma.Decimal(data.nota) : undefined,
    },
  });
};

export const remove = async (id) => {
  return await prisma.filme.delete({
    where: { id: parseInt(id) },
  });
};
