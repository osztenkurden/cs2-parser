declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;

export const generateEnum = <BrandName extends string, const T extends Record<string, any>>(map: T, _: BrandName) => {
	return map as { [K in keyof T]: Branded<T[K], BrandName> };
};

export type GetEnumType<T extends ReturnType<typeof generateEnum>> = T[keyof T];
export type GetEnum<T extends ReturnType<typeof generateEnum>> = T;
