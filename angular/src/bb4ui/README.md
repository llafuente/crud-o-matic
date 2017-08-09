Usage:

```ts
import { BB4UIModule } from 'bb4-ui';

@NgModule({
    imports: [
      BB4UIModule,
    ],
    // optional
    exports: [
      BB4UIModule,
    ]
)}
//....

```

```scss
@import '../../../node_modules/bootstrap/scss/_mixins.scss';

@import '../../../node_modules/bb4-ui/pre-bb4ui.scss';
@import '../../../node_modules/bootstrap/scss/bootstrap.scss';
@import '../../../node_modules/bb4-ui/post-bb4ui.scss';

@import '../../../node_modules/ng2-toasty/style-bootstrap.css';
```
