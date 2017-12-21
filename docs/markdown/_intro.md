# React & Redux in TypeScript - Static Typing Guide
**_"This guide is about to teach you how to leverage [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html), [Generics](https://www.typescriptlang.org/docs/handbook/generics.html) and other [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) as much as possible to write the minimal amount of type annotations needed for your JavaScript code to be completely Type Safe"_** - this will make sure you get all the benefits of Static Typing and your productivity won't be slowed down by adding excess type annotations.

> #### _Found it usefull? Want more updates?_ [**Give it a :star2:**](https://github.com/piotrwitek/react-redux-typescript-patterns/stargazers)  

### Goals
- Complete type safety with [`--strict`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) flag without failing to `any` type for the best static-typing experience
- Minimize amount of manually writing type declarations by leveraging [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- Reduce redux boilerplate and complexity of it's type annotations to a minimum with [simple utility functions](https://github.com/piotrwitek/react-redux-typescript) by extensive use of [Generics](https://www.typescriptlang.org/docs/handbook/generics.html) and [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) features

### Playground Project
You should check Playground Project located in the `/playground` folder. It is a source of all the code examples found in the guide. They are all tested with the most recent version of TypeScript and 3rd party type definitions (like `@types/react` or `@types/react-redux`) to ensure the examples are up-to-date and not broken with updated definitions.
> Playground was created is such a way, that you can simply clone the repository locally and immediately play around on your own to learn all the examples from this guide in a real project environment without the need to create some complicated environment setup by yourself.
