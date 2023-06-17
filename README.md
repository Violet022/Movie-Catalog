# Movie-Catalog
Суть проекта - реализовать каталог фильмов, где пользователь может просматривать информацию о фильмах, добавлять их к себе в избранное, оставлять отзывы с оценкой.
## Требования, макеты и функционал 
Документация API - https://react-midterm.kreosoft.space/swagger/index.html
## Страницы
### Стартовая страница (movies.html) 
Открывая сайт по стандартному пути появляется страница со списком фильмов, получаемых с сервера.
#### Структура страницы
На рисунке 1 представлена структура страницы, а именно:
- Навигационная панель с основными элементами навигации по сайту, кнопками для работы с авторизацией пользователя. Варианты панели для авторизованного и неавторизованного пользователя представлены на рисунках 2.1 и 2.2.
- Список фильмов, в котором отображены основные данные о фильме, такие как:
  - название;
  - год выпуска;
  - жанры;
  - средняя оценка, которая вычисляется самостоятельно на основании массива отзывов от пользователей;
  - постер.
- Элемент пагинации, который отображает текущую страницу и ссылки, при клике на которые будут открываться новые страницы с фильмами.

Элемент списка является кликабельным. При клике на фильм открывается страница с деталями фильма. 

![Главный экран](https://github.com/Violet022/Movie-Catalog/assets/80825993/a1999d12-7f28-40fb-8b0a-1d9e60af040b)<br>
_Рисунок 1 - Страница каталога фильмов_

![Меню авторизованного пользователя](https://github.com/Violet022/Movie-Catalog/assets/80825993/3a62ad35-b7cd-42b0-8220-dca94ebb2e5d)<br>
_Рисунок 2.1 - Навигационное меню для авторизованного пользователя_ 

![image](https://user-images.githubusercontent.com/80825993/217491274-63478846-07eb-4221-a0bd-9ed7359b7713.png)<br>
_Рисунок 2.2 - Навигационное меню для неавторизованного пользователя_ 
### Страница деталей фильма (details.html) 
Страница, открывающаяся при клике на фильм из каталога.
Внешний вид страницы фильма для авторизованного и неавторизованного пользователя представлен на рисунках 3.1 и 3.2 ниже.

Важно отметить, что для неавторизованного пользователя доступен лишь просмотр деталей фильма и отзывов о фильме от других пользователей.<br> 

Для авторизованного пользователя доступен следующий функционал:
-	добавить фильм в коллекцию своих избранных фильмов (Если фильм уже есть в списке избранного, кнопка не отображается);
-	добавить отзыв о фильме с оценкой от 1 до 10. При этом пользователь может оставить только один отзыв из чего следует, что, если авторизованный пользователь уже оставлял отзыв на фильм, то форма добавления отзыва не отображается;
-	редактировать или удалить свой отзыв.

Также цвет текста и границы элемента отзыва зависят от оценки в отзыве: больше 5 - зеленый цвет, иначе - красный.

![image](https://user-images.githubusercontent.com/80825993/217494128-8d921b4c-9753-4fb2-9536-ad3c665acc69.png)<br>
_Рисунок 3.1 - Страница деталей фильма для авторизованного пользователя_

![image](https://user-images.githubusercontent.com/80825993/217494278-bb4baac7-1413-4753-acbf-b7082b21c12a.png)<br>
_Рисунок 3.2 - Страница деталей фильма для неавторизованного пользователя_
### Страница избранных фильмов авторизованного пользователя (favorites.html) 
Данная страница доступна только для авторизованных пользователей. Если по этому адресу перейдет неавторизованный пользователь, то его переадресовывает на страницу авторизации.<br>
Единственный функционал, который доступен на текущей странице - удаление фильма из списка избранных фильмов.

![Избранное](https://github.com/Violet022/Movie-Catalog/assets/80825993/d8ca404c-46dc-465b-b072-040aab42433e)<br>
_Рисунок 4 - Страница избранных фильмов пользователя_
### Страницы регистрации и авторизации (registration.html и login.html) 
Поскольку множество функционала сайта завязано на пользователе, необходима возможность регистрации пользователей и их дальнейшей авторизации.<br> 
Внешний вид страниц регистрации и авторизации представлены на рисунках 5.1 и 5.2.

![image](https://user-images.githubusercontent.com/80825993/217495293-6f540c05-a5ec-4cbf-b940-fdc0c38cfe07.png)<br>
_Рисунок 5.1 - Страница регистрации пользователя_

![image](https://user-images.githubusercontent.com/80825993/217495383-72495ad2-bdd5-43db-a667-c67968709d03.png)<br>
_Рисунок 5.2 - Страница авторизации пользователя_

Важно заметить, что токен, используемый для идентификации пользователя, имеет определенное время жизни, которое может истечь во время работы с приложением, поэтому предусмотрена следующая работа с механизмами авторизации: если токен истек пользователь разлогинивается и переадресовывается на страницу авторизации.
### Страница профиля (profile.html) 
Позволяет просмотреть детальную информацию об авторизованном пользователе, а также отредактировать ее.

![Профиль](https://github.com/Violet022/Movie-Catalog/assets/80825993/198b75af-edee-44df-ae27-0ae9ddd3fd0d)<br>
_Рисунок 6 - Страница профиля пользователя_
