export const exists = <T>(v: T | null | undefined): v is T => {
  return v !== null && v !== undefined;
};

type Modifier<Styles extends CSSModuleClasses, Base extends string> = {
  [P in keyof Styles]: P extends `${Base}--${infer Modifier}`
    ? Modifier
    : never;
}[keyof Styles];

type InferBase<P> = P extends `${infer Base2}__${string}`
  ? Base2
  : P extends `${infer Base}--${string}`
    ? Base
    : P extends string
      ? P
      : never;

type BaseBase<Styles extends CSSModuleClasses> = {
  [P in keyof Styles]: InferBase<P>;
}[keyof Styles];

type ModifierMap<
  Styles extends CSSModuleClasses,
  Base extends string,
> = Partial<Record<Modifier<Styles, Base>, boolean>>;

export const modifiers = <
  Styles extends CSSModuleClasses,
  Base extends BaseBase<Styles>,
>(
  s: Styles,
  baseClass: Base,
  ...modifiers: (
    | Modifier<Styles, Base>
    | ModifierMap<Styles, Base>
    | undefined
  )[]
) => {
  const getModifierClasses = (arg: (typeof modifiers)[number]) => {
    if (arg === undefined) return;

    if (typeof arg === 'string') {
      return [s[`${baseClass}--${arg}`]];
    }

    return Object.entries(arg)
      .filter(([_, value]) => value)
      .map(([modifier]) => s[`${baseClass}--${modifier}`]);
  };

  const modifierClasses = modifiers.flatMap(getModifierClasses);
  const filteredModifierClasses = modifierClasses.filter(exists);

  return [s[baseClass], ...filteredModifierClasses].join(' ');
};
