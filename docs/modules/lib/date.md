<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# `date.js`
Here's atm only one feature of my `Date` extensions. There are more, but this is one of the most important ones.

## `.format()`
You can use `new Date().format()` or `Date.format()`, maybe even the `date()` function.

### Modifiers
These are the **`%`** modifiers for format strings. I tried to make them one single char only
(plus the **`%`** prefix, as already known from other implementations of this feature).

| Modifier | Time component |
| -------: | :---------------------------------------------------------- |
|  **%D**  | Day in Year                                                 |
|  **%y**  | Year (full 4 digits)                                        |
|  **%Y**  | Year (2 digits only)                                        |
|  **%M**  | Month                                                       |
|  **%d**  | Day of Month                                                |
|  **%k**  | Week of Year                                                |
|  **%h**  | Hours (24)                                                  |
|  **%H**  | Hours (12)                                                  |
|  **%m**  | Minutes                                                     |
|  **%s**  | Seconds                                                     |
|  **%S**  | Milliseconds                                                |
|  **%x**  | UNIX timestamp (UNIX epoche, so seconds since January 1970) |
|  **%X**  | Milliseconds since UNIX epoche (JavaScript's `Date.now()`)  |
|  **%t**  | `am` or `pm`                                                |
|  **%T**  | `AM` or `PM`                                                |
|  **%n**  | Name of Month (long)                                        |
|  **%N**  | Name of Month (short)                                       |
|  **%w**  | Name of Weekday (long)                                      |
|  **%W**  | Name of Weekday (short)                                     |

### Pre-defined formats (see `css/config.css`);
The names (after `--date-`) can be used for `.format()` etc. instead of real format strings. These are **pre-defined** formats.

```css
	--date-now: '%h:%m:%s.%S';
	--date-time: '%h:%m:%s';
	--date-date: '%y-%m-%d';
	--date-default: '%y-%m-%d (%h:%m:%s)';
	--date-best: '%y-%m-%d (%h:%m:%s.%S)';
	--date-console: '%y-%m-%d %H:%M:%S.%s';
	--date-full: '%w, %y-%m-%d (%h:%m:%s)';
	--date-text: '%w, %d. %n %y (%h:%m:%s)';
	--date-text-full: '%w, %d. %n %y (%h:%m:%s.%S)';
	--date-year: '%D (%W)';
	--date-ms: '%X';
	--date-unix: '%x';
```
