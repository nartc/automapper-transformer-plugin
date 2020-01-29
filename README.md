# AutoMapper Transformer Plugin

This plugin is to support [@nartc/automapper](https://github.com/nartc/mapper) in order to enhance DX by reducing boilerplate code.

![travis](https://badgen.net/travis/nartc/automapper-transformer-plugin)
![bundlephobia](https://badgen.net/bundlephobia/minzip/@nartc/automapper-transformer-plugin)
![downloads](https://badgen.net/npm/dt/@nartc/automapper-transformer-plugin)
![npm](https://badgen.net/npm/v/@nartc/automaper-transformer-plugin)
![license](https://badgen.net/github/license/nartc/automapper-transformer-plugin)

### How it works

```typescript
class Profile {
  bio: string;
  age: number;
}

class User {
  firstName: string;
  lastName: string;
  profile: Profile;
}
```

The above TS code will be compiled to:

```javascript
class Profile {}
class User {}
```

We need to decorate the `field declarations` with `@AutoMap()` in order for `@nartc/automapper` to work properly.

```typescript
class Profile {
  @AutoMap()
  bio: string;
  @AutoMap()
  age: number;
}

class User {
  @AutoMap()
  firstName: string;
  @AutoMap()
  lastName: string;
  @AutoMap(() => Profile)
  profile: Profile;
}
```

That will get very verbose very soon. `@nartc/automapper-transformer-plugin` can help that.

This plugin utilizes **Abstract Syntax Tree** (**AST**) to run a `before` transformer.
The plugin will look at files that end with `*.model.ts` and `*.vm.ts` and keep the **metadata** of the `classes` in a form of a `static function`.
`@nartc/automapper-transformer-plugin` keeps the metadata as follow:

```javascript
class Profile {
  static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
    return { bio: null, age: null };
  }
}

class User {
  static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
    return { firstName: null, lastName: null, profile: Profile };
  }
}
```

This allows `@nartc/automapper` to look at these models and run the `static function` to hold the metadata for each model, exactly like what `@AutoMap()` would do for you. In fact, internally, `@nartc/automapper` calls the static function and iterates over the result then call `AutoMap()` directly.

### Limitations

**Transformers** bring great values to developers but they are an experimental feature in **TypeScript**. Hence, to use it, you'd need to modify your build steps directly and each build tool has different setup.

`@nartc/automapper-transformer-plugin` will only add the minimum amount of code relating to the `@AutoMap()` decorator. If you want to have extra options (options from `class-transformer` library), you'd want to still decorate the fields manually.

### Installation

```shell script
npm install @nartc/automapper-transformer-plugin --save-dev
# or shorthand version
npm i -D @nartc/automapper-transformer-plugin
```

### Usage

`@nartc/automapper-transformer-plugin` only has one configuration option for now

```typescript
interface TsAutoMapperPluginOptions {
  modelFileNameSuffix?: string[];
}
```

`modelFileNameSuffix` is default to `['.model.ts', '.vm.ts']`

#### Webpack

I hope you are using `ts-loader` or some form of `ts-loader forks`. Configure your `webpack.config.js` as follow to turn on the plugin

```javascript
...
const tsAutoMapperPlugin = require('@nartc/automapper-transformer-plugin');
const pluginOptions = {
  modelFileNameSuffix: [...]
};

module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          getCustomTransformers: program => ({
            before: [tsAutoMapperPlugin(program, pluginOptions).before]
          })
        }
      }
      ...
    ]
  }
  ...
};
```

#### Rollup

Use `rollup-plugin-typescript2` as it has `tranformers` capability.

```javascript
import tsAutomapperPlugin from '@nartc/automapper-transformer-plugin';
import typescript from 'rollup-plugin-typescript2';
const pluginOptions = {
  modelFileNameSuffix: [...]
};

export default {
  ...
  preserveModules: true, // <-- turn on preserveModules
  plugins: [
    ...
    typescript({
      transformers: [service => ({
        before: [tsAutomapperPlugin(service.getProgram(), pluginOptions).before]
      })]
    }),
    ...
  ]
}
```

#### ttypescript

`ttypescript` patches `typescript` in order to use `transformers` in `tsconfig.json`. See [ttypescript's README](https://github.com/cevek/ttypescript) for how to use this with module bundlers such as `webpack` or `Rollup`.


```javscript
{
  "compilerOptions": {
    ...,
    "plugins": [
        {
            "transform": "@nartc/automapper-transformer-plugin",
            "modelFileNameSuffix": [...]
        }
    ],
    ...
  }
}
```

Check out this [Examples Repo](https://github.com/nartc/automapper-transformer-plugin-examples) out.

### Contribution

All contributions of any kind are welcomed.

### License

MIT
