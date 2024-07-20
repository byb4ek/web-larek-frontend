# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Продукт

```
export interface IProductItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
}
```

Интерфейс описывает данные частей приложения: каталог, превью, корзина, форма заказа,

```
export interface IAppState {
  catalog: IProductItem[];
  preview: string;
  basket: string[];
  order: IOrder;
  total: string | number;
  loading: boolean;
}
```

Список продуктов

```
export interface IProductsList {
  products: IProductItem[];
}
```

Данные формы заказа

```
export interface IOrderForm {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
}
```

Данные покупки

```
export interface IOrder extends IOrderForm {
  items: string[];
}
```

Интерфейс успешного заказа

```
export interface IOrderResult {
  id: string;
}
```

Тип ошибки заказа

```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Хранит основные поля и методы, необходимые при работе с сервером.\
В конструктор передается базовый url (baseUrl) и опции запроса (options).

Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс Model

Абстрактный класс дженерик, обощающий в себе конструктор и метод привязки события.

Конструктор:

- принимает на вход объект данных неявного типа и объект события типа IEvent.
- производит слияние входящего объекта с родительским

Методы:

- emmitChanges — регистрирует входящее событие в EventEmitter

#### Component

Абстрактный класс дженерик, обобщающий в себе конструктор и основные методы работы с компонентами отображения.

Конструктор:
-принимает на вход `container` типа HTMLElement

Методы:

- toggleClass - метод переключения классов
- setText - метод установки текстового содержимого
- setDisabled - метод сменить статус блокировки
- setHidden - метод скрытия
- setVisible - метод показать
- setImage - метод установить изображения с алтернативным текстом
- render - метод возвращения корневого DOM-элемента

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс ProductItem

Принимает и хранит в себе данные об одном продукте: идентифекатор, заголовок, описание, категория, изображение, цену.

Расширяем базовым классом Model, копируя свойства объекта в текущий экземпляр класса и методом для уведомления об изменениях в модели.

#### Класс AppDate

Содержит в себе основные данные и методы для работы с моделью данных в целом. 

Поля класса:
- `catalog` - для данных списка товаров 
- `preview` - для данных выбранного товара (попап) 
- `bascket` - для данных корзины покупок
- `order` - для данных заказа, который отправляется на сервер 

Методы:
- `addProductBasket` -
- `setOrder` -
- `` -
- `` -
- `` -
- `` -
- `` -
- `` -
- `` -




#### Класс AppAPI

Основной класс работы с API. Расширяется базовым классом Api.

Конструктор принимает:
- принимает и передает в родительский конструктор `baseUrl` и `options`
-	записывает в поле `api` текущий URL

Методы класса:
- `getProductList` - метод запроса списка товаров с сервера 
- `orderProducts` - метод отправки данных заказа на сервер 


