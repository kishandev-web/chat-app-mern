import mongoose, { Model, Document } from "mongoose";

export const findAll = async <T extends Document>(
  model: any,
  query: object = {},
  options: object = {},
) => {
  return await model.find(query, null, options);
};

export const findOne = async (model: any, query: object) => {
  return await model.findOne(query);
};
export const create = async (model: any, data: object) => {
  return await model.create(data);
};

export const findById = async (model: any, id: string) => {
  return await model.findById(id);
};


export const findOneAndUpdate = async(
  model: any,
  query: object,
  updateData: object,
  options: object = { new: true },
) => {
  return await model.findOneAndUpdate(query, updateData, options);
};


export const findByIdAndUpdate = async (
  model: any,
  id: string,
  data: object,
) => {
  return await model.findByIdAndUpdate(id, data, { new: true });
};

export const deleteById = async(
  model: any,
  id: string,
) => {
  return await model.findByIdAndDelete(id);
};


export const countDocuments = async (model: any, query: object = {}) => {
  return await model.countDocuments(query);
};

export const aggregate = async (model: any, pipeline: object[]) => {
  return await model.aggregate(pipeline);
};
