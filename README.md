# React / Redux / TypeScript Patterns
Results of my research for best-practices & patterns for working with React / Redux / TypeScript.
I especially focused on:
- 100% type safety
- reduced boilerplate
- leverage type inferrence
- minimize types maintenance costs

### Table of Contents
- [Actions](#actions)
- [Reducers](#reducers)
- [Async Flow](#async-flow)
- [Store & RootState](#store--rootstate)
- [React Connected Components](#react-connected-components)
- [Project Examples](#project-examples)

---

## Actions
- 100% type safety

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
- 100% type safety
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

## React Connected Components
### WIP

```tsx

```

---

## Project Examples
https://github.com/piotrwitek/react-redux-typescript-starter-kit
