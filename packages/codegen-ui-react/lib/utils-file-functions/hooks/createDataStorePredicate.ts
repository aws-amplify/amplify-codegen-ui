/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
import {
  AllOperators,
  PersistentModel,
  RecursiveModelPredicateExtender,
  RecursiveModelPredicate,
  RecursiveModelPredicateAggregateExtender,
} from '@aws-amplify/datastore';
import { DataStorePredicateObject } from './datastore-action-types';

function isModelKey<Model>(field: unknown): field is keyof Model {
  return !!field;
}

const isOperatorKey = (operator: unknown): operator is keyof AllOperators => !!operator;

/**
 * Given an array of predicates, compose them in sequential order
 */
const mergePredicates = <Model extends PersistentModel>(
  predicates: RecursiveModelPredicateExtender<Model>[],
): RecursiveModelPredicateAggregateExtender<Model> => {
  return (model) => predicates.map((predicate) => predicate(model));
};

/**
 * Creates a DataStore compatible predicate function from an object representation
 * @internal
 */
export const createDataStorePredicate = <Model extends PersistentModel>(
  predicateObject: DataStorePredicateObject,
): RecursiveModelPredicateExtender<Model> => {
  const { and: groupAnd, or: groupOr, field, operator, operand } = predicateObject;

  if (Array.isArray(groupAnd)) {
    const predicates = groupAnd.map((condition) => createDataStorePredicate<Model>(condition));

    return (p: RecursiveModelPredicate<Model>) => p.and(mergePredicates(predicates));
  }

  if (Array.isArray(groupOr)) {
    const predicates = groupOr.map((condition) => createDataStorePredicate<Model>(condition));

    return (p: RecursiveModelPredicate<Model>) => p.or(mergePredicates(predicates));
  }

  return (p: RecursiveModelPredicate<Model>) => {
    if (isModelKey(field) && isOperatorKey(operator) && p?.[field]?.[operator]) {
      return (p[field][operator] as Function)(operand) as RecursiveModelPredicate<Model>;
    }

    return p;
  };
};

export const createDataStorePredicateString = `export const createDataStorePredicate = <Model extends PersistentModel>(
  predicateObject: DataStorePredicateObject
): RecursiveModelPredicateExtender<Model> => {
  const {
    and: groupAnd,
    or: groupOr,
    field,
    operator,
    operand,
  } = predicateObject;

  if (Array.isArray(groupAnd)) {
    const predicates = groupAnd.map((condition) =>
      createDataStorePredicate<Model>(condition)
    );

    return (p: RecursiveModelPredicate<Model>) =>
      p.and((model) => predicates.map((predicate) => predicate(model)));
  }

  if (Array.isArray(groupOr)) {
    const predicates = groupOr.map((condition) =>
      createDataStorePredicate<Model>(condition)
    );

    return (p: RecursiveModelPredicate<Model>) =>
      p.or((model) => predicates.map((predicate) => predicate(model)));
  }

  return (p: RecursiveModelPredicate<Model>) => {
    if (
      !!field &&
      !!operator &&
      p?.[field]?.[operator]
    ) {
      return (p[field][operator] as Function)(
        operand
      ) as RecursiveModelPredicate<Model>;
    }

    return p;
  };
};`;
