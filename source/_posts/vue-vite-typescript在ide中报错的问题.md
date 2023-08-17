---
title: vue+vite+typescript在ide中报错的问题
date: 2023-08-17 14:08:26
tags:
---

用脚手架创建Vue+vite+ts项目后，在IDE中可能会出现报错的情况，主要是ts导致的一些问题，例如ts只能解析`.ts`文件，不能解析`.vue`文件，需要进行一些配置。  

## 1.路径配置  
vite.config.js
```javascript
{
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}
```

ts.config.json
```json
{
    "extends": "@vue/tsconfig/tsconfig.dom.json",
    "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
    "exclude": ["src/**/__tests__/*"],
    "compilerOptions": {
    "composite": true,
        "baseUrl": "./",
        "paths": {
        "@/*": ["./src/*"]
    }
}
}
```

## 2. 声明模块  
env.d.ts  
```typescript
declare module "vue-router"

declare module '*.vue' {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}
```