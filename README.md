# React / Redux / TypeScript - Patterns
Set of guidelines and patterns teaching how to fully leverage TypeScript features when working with React & Redux ecosystem.

## Relevant with TypeScript v2.2 (https://github.com/Microsoft/TypeScript/wiki/Roadmap)
> powered by github :star:, [star it please](https://github.com/piotrwitek/react-redux-typescript-patterns/stargazers) to keep me motivated and updated with added new TypeScript features :heart:

### Goals:
- Complete type safety, without failing to `any` type
- Minimize amount of manually typing declarations by leveraging Type Inference (https://www.typescriptlang.org/docs/handbook/type-inference.html)
- Reduce boilerplate using simple helper functions with generics (https://www.typescriptlang.org/docs/handbook/generics.html)

### Table of Contents
- [FAQ](#faq)
- React
  - [Components](#components)
  - [Stateless Components](#stateless-components)
  - [React Connected Components](#react-connected-components)
  - [Higher-Order Components](#higher-order-components)
- Redux
  - [Actions](#actions)
  - [Reducers](#reducers)
  - [Async Flow](#async-flow)
  - [Store & RootState](#store--rootstate)
  - [Types Selectors](#typed-selectors)
- Common
  - [Vendor Types Augumentation](#vendor-types-augmentation)
- [Project Examples](#project-examples)

---
## FAQ
- when to use `interface` and when `type`?
> Use `interface` when extending particular type or when expecting consumer of type to be extending. In every other case it's better to use `type`, to make it clear it is a struct to be used directly as type annotation.

- should I export my components as `default` or as `named` module export?
> Most flexible solution is to use module pattern, then you can have both approaches whenever you wish, e.g.
- create `components/` folder with `index.ts` file inside:
```ts
export { default as Select } from './select';
...
```
- create component file (`select.tsx`) in the same folder:
```tsx
...
const Select: React.StatelessComponent<Props> = (props) => {
...
export default Select;
...
```
- now you can import your components in both ways like this:
```tsx
import { Select } from '../../controls';
or
import Select from '../../controls/select';
```

---

## Actions

### KISS Approach
- more boilerplate
- classic const based types
- close to standard JS usage
- need to export both const type and action creator to use in multiple reducer files or redux-observable modules
- `returntypeof` helper abstraction to harvest action types - (reference)[https://github.com/piotrwitek/react-redux-typescript/issues/1]

In this case I focused on KISS, without introducing any abstractions to be as close as possible to common Redux Pattern used in JS.

```ts
// Action Creators
export const LOAD_CURRENCY_RATES = 'currencyRates/LOAD_CURRENCY_RATES';
export const loadCurrencyRates = () => ({
  type: LOAD_CURRENCY_RATES as typeof LOAD_CURRENCY_RATES,
});

export const LOAD_CURRENCY_RATES_SUCCESS = 'currencyRates/LOAD_CURRENCY_RATES_SUCCESS';
export const loadCurrencyRatesSuccess = (payload: IFixerServiceResponse) => ({
  type: LOAD_CURRENCY_RATES_SUCCESS as typeof LOAD_CURRENCY_RATES_SUCCESS,
  payload,
});

export const LOAD_CURRENCY_RATES_ERROR = 'currencyRates/LOAD_CURRENCY_RATES_ERROR';
export const loadCurrencyRatesError = (payload: string) => ({
  type: LOAD_CURRENCY_RATES_ERROR as typeof LOAD_CURRENCY_RATES_ERROR,
  payload,
});

// Action Types
const ActionTypes = {
  loadCurrencyRates: returntypeof(loadCurrencyRates),
  loadCurrencyRatesSuccess: returntypeof(loadCurrencyRatesSuccess),
  loadCurrencyRatesError: returntypeof(loadCurrencyRatesError),
};
type Action = typeof ActionTypes[keyof typeof ActionTypes];
```

### DRY Approach
- less boilerplate
- minimize repeated code
- `ActionCreator` helper factory function to create typed instances of actions - (reference)[https://github.com/piotrwitek/react-redux-typescript]
- easier to use in multiple reducer files or `redux-observable` modules (action creators have type property and also create function, no extra type constant)
- very easy to get all of action types

In this case I created a helper factory function to create typed actions, this way boilerplate and code repetition is highly reduced and it is easier to use action creators in multiple reducers or redux-observable modules.

```ts
// Action Creators
export const ActionCreators = {
  UpdateBaseCurrency: new ActionCreator<'UpdateBaseCurrency', string>('UpdateBaseCurrency'),
  UpdateBaseValue: new ActionCreator<'UpdateBaseValue', string>('UpdateBaseValue'),
};

// Action Types
type Action = typeof ActionCreators[keyof typeof ActionCreators];
```

---

## Reducers
- leveraging (Discriminated Union types)[https://www.typescriptlang.org/docs/handbook/advanced-types.html]
  - to guard type and get intellisense of Action payload
- using Partial from (Mapped types)[https://www.typescriptlang.org/docs/handbook/advanced-types.html]
  - to guard type of `partialState` and restrict superfluous or mismatched props when merging with State

### Switch Approach
- using classic const based types

```ts
// State
export type State = {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly lastUpdated: number | null;
  readonly base: string;
  readonly rates: any;
  readonly date: string;
};
export const initialState: State = {
  isLoading: false,
  error: null,
  lastUpdated: null,
  base: CACHE.base,
  rates: CACHE.rates,
  date: CACHE.date,
};

// Reducer
export default function reducer(state: State = initialState, action: Action): State {
  let partialState: Partial<State> | undefined;

  switch (action.type) {
    case LOAD_CURRENCY_RATES:
      partialState = {
        isLoading: true, error: null,
      };
      break;
    case LOAD_CURRENCY_RATES_SUCCESS:
      const { base, rates, date } = action.payload;
      partialState = {
        isLoading: false, lastUpdated: Date.now(), base, rates, date,
      };
      break;
    case LOAD_CURRENCY_RATES_ERROR:
      partialState = {
        isLoading: false, error: action.payload,
      };
      break;

    default: return state;
  }

  return { ...state, ...partialState };
}
```

### If Approach
- using `ActionCreator` helper types

```ts
// State
export type State = {
  readonly baseCurrency: string;
  readonly targetCurrency: string;
  readonly baseValue: string;
  readonly targetValue: string;
};
export const initialState: State = {
  baseCurrency: 'PLN',
  targetCurrency: 'SEK',
  baseValue: '0',
  targetValue: '0',
};

// Reducer
export default function reducer(state: State = initialState, action: Action): State {
  let partialState: Partial<State> | undefined;

  if (action.type === ActionCreators.UpdateBaseCurrency.type) {
    partialState = { baseCurrency: action.payload };
  }
  if (action.type === ActionCreators.UpdateBaseValue.type) {
    partialState = { baseValue: action.payload };
  }

  return partialState != null ? { ...state, ...partialState } : state;
}
```

---

## Async Flow
### WIP

```ts

```

---

## Store & RootState

`RootState` - to be imported in connected components providing type safety to Redux `connect` function
```ts
import {
  default as currencyRatesReducer, State as CurrencyRatesState,
} from './currency-rates/reducer';
import {
  default as currencyConverterReducer, State as CurrencyConverterState,
} from './currency-converter/reducer';

export type RootState = {
  currencyRates: CurrencyRatesState;
  currencyConverter: CurrencyConverterState;
};
```

Use `RootState` in `combineReducers` function and as rehydrated State object type guard to obtain strongly typed Store instance
```ts
import { combineReducers, createStore } from 'redux';

const rootReducer = combineReducers<RootState>({
  currencyRates: currencyRatesReducer,
  currencyConverter: currencyConverterReducer,
});

// rehydrating state on app start: implement here...
const recoverState = (): RootState => ({} as RootState);

export const store = createStore(
  rootReducer,
  recoverState(),
);
```

---

## Typed Selectors
### WIP

---

## React Connected Components
- This solution uses type inference to get Props types from `mapStateToProps` function
- Minimise manual effort to declare and maintain Props types injected from `connect` helper function
- Real project implementation example: https://github.com/piotrwitek/react-redux-typescript-starter-kit/blob/ef2cf6b5a2e71c55e18ed1e250b8f7cadea8f965/src/containers/currency-converter-container/index.tsx

```tsx
import { returntypeof } from 'react-redux-typescript';

import { RootState } from '../../store';
import { ActionCreators } from '../../store/currency-converter/reducer';
import * as CurrencyRatesSelectors from '../../store/currency-rates/selectors';

const mapStateToProps = (state: RootState) => ({
  currencies: CurrencyRatesSelectors.getCurrencies(state),
  currencyRates: storeState.currencyRates,
  currencyConverter: storeState.currencyConverter,
});

const dispatchToProps = {
  changeBaseCurrency: ActionCreators.changeBaseCurrency,
  changeTargetCurrency: ActionCreators.changeTargetCurrency,
  changeBaseValue: ActionCreators.changeBaseValue,
  changeTargetValue: ActionCreators.changeTargetValue,
};

const stateProps = returntypeof(mapStateToProps);
type Props = typeof stateProps & typeof dispatchToProps;
// if needed to extend Props you can add an union with regular props (not injected) like this:
// `type Props = typeof stateProps & typeof dispatchToProps & { className?: string, style?: object };`
type State = {};

class CurrencyConverterContainer extends React.Component<Props, State> {
  render() {
    // every destructured property below infer correct type from RootState!
    const { rates, base } = this.props.currencyRates;
    const { baseCurrency, targetCurrency, baseValue, targetValue } = this.props.currencyConverter;
    const {
      currencies, changeBaseCurrency, changeBaseValue, changeTargetCurrency, changeTargetValue,
    } = this.props;
    ...
  }
}

export default connect(mapStateToProps, dispatchToProps)(CurrencyConverterContainer);
```
---

## Higher-Order Components
- decorate or wraps a component into another component
- using Type Inference to automatically calculate Props interface for the resulting component
- demo application: coming soon...

```tsx
// button.tsx
import * as React from 'react';
import { Button } from 'antd';

interface Props {
  className?: string;
  htmlType?: typeof Button.prototype.props.htmlType;
  type?: typeof Button.prototype.props.type;
  autoFocus?: boolean;
}

const ButtonControl: React.StatelessComponent<Props> = (props) => {
  return (
    <Button
      className={props.className}
      htmlType={props.htmlType}
      type={props.type}
      autoFocus={props.autoFocus}
    >
      {props.children}
    </Button>
  );
};

export default ButtonControl;
```

```tsx
// with-form-item-decorator.tsx
import * as React from 'react';
import { Form } from 'antd';
const FormItem = Form.Item;

interface DecoratorProps {
  className?: string;
  label?: string;
  labelCol?: typeof FormItem.prototype.props.labelCol;
  wrapperCol?: typeof FormItem.prototype.props.wrapperCol;
  hasFeedback?: boolean;
}

export function withFormItemDecorator<Props>(
  Component: React.StatelessComponent<Props>,
) {
  const Decorator: React.StatelessComponent<DecoratorProps & Props> = (props) => {
    return (
      <FormItem
        label={props.label}
        labelCol={props.labelCol}
        wrapperCol={props.wrapperCol}
        hasFeedback={props.hasFeedback}
      >
        <Component {...props} />
      </FormItem>
    );
  };
  return Decorator;
}

// improve with filtering passThroughProps - type inference support coming in (v2.3), tracking issue: https://github.com/Microsoft/TypeScript/issues/10727
const { label, labelCol, wrapperCol, hasFeedback, ...passThroughProps } = props;
```

```tsx
// consumer-component.tsx
...
import Button from './button';
import { withFormItemDecorator } from './with-form-item-decorator';

// higher-order component using function composition
const DecoratedButton = withFormItemDecorator(Button);
...
<DecoratedButton type="primary" htmlType="submit" wrapperCol={{ offset: 4, span: 12 }} autoFocus >
  Next Step
</DecoratedButton>
...
```

---

## Vendor Types Augmentation
- Augmenting missing autoFocus Prop on `Input` and `Button` components in `antd` npm package (https://ant.design/)

```ts
declare module '../node_modules/antd/lib/input/Input' {
  export interface InputProps {
    autoFocus?: boolean;
  }
}

declare module '../node_modules/antd/lib/button/Button' {
  export interface ButtonProps {
    autoFocus?: boolean;
  }
}
```

---

## Project Examples
https://github.com/piotrwitek/react-redux-typescript-starter-kit
