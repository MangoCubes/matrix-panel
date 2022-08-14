type PickByType<T, Type> = {[P in keyof T as T[P] extends Type ? P : never]: T[P]}

export type PseudoBooleanPropNames<T> = keyof PickByType<T, 0 | 1>;