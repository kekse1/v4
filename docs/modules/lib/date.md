<img src="https://kekse.biz/github.php?draw&text=`Date`&override=github:v4" />

# `date`.js
The [`format()`](#format) is maybe most interesting for you?

## Extensions
* `Date.toString(_date, _html, _parenthesis)`
* `Date.prototype.toString(_html, _parenthesis)`
* `Date.julianDate(_date)`
* `Date.prototype.julianDate`
* `Date.synodicPhase(_date)`
* `Date.prototype.synodicPhase`
* `Date.moonDistance(_date)`
* `Date.prototype.moonDistance`
* `Date.moonEclipticLatitude(_date)`
* `Date.prototype.moonEclipticLatitude`
* `Date.moonEclipticLongitude(_date)`
* `Date.prototype.moonEclipticLongitude`
* `Date.moonPhaseAngle(_date)`
* `Date.prototype.moonPhaseAngle`
* `Date.moonIlluminatedRatio(_date)`
* `Date.prototype.moonIlluminatedRatio`
* `Date.moonPhase(_date)`
* `Date.prototype.moonPhase`
* `Date.MOON(_value, _lang)`
* `Date.dayByYear(_date)`
* `Date.prototype.dayByYear`
* `Date.dayInYear(_date)`
* `Date.prototype.dayInYear`
* `Date.daysInYear(_date)`
* `Date.prototype.daysInYear`
* `Date.daysInMonth(_date)`
* `Date.prototype.daysInMonth`
* `Date.isLeapYear(_date)`
* `Date.prototype.isLeapYear`
* `Date.yearPercent(_date)`
* `Date.prototype.yearPercent`
* `Date.years(_date)`
* `Date.prototype.years`
* `Date.year(_date)`
* `Date.prototype.year`
* `Date.months(_date)`
* `Date.prototype.months`
* `Date.month(_date)`
* `Date.prototype.month`
* `Date.weeks(_date)`
* `Date.prototype.weeks`
* `Date.week(_date)`
* `Date.prototype.week`
* `Date.days(_date)`
* `Date.prototype.days`
* `Date.day(_date)`
* `Date.prototype.day`
* `Date.hours(_date)`
* `Date.prototype.hours`
* `Date.hour(_date)`
* `Date.prototype.hour`
* `Date.minutes(_date)`
* `Date.prototype.minutes`
* `Date.minute(_date)`
* `Date.prototype.minute`
* `Date.seconds(_date)`
* `Date.prototype.seconds`
* `Date.second(_date)`
* `Date.prototype.second`
* `Date.milliseconds(_date)`
* `Date.prototype.milliseconds`
* `Date.millisecond(_date)`
* `Date.prototype.millisecond`
* `Date.unix(_date)`
* `Date.prototype.unix`
* `Date.modifiers`
* `Date.hasModifier(... _args)`
* `Date.prototype.format(_format)`
* `Date.format(_format, _date)`
* `Date.format[*]`
* `Date.format.modifiers`
* `Date.WEEKDAY(_day, _short, _lang)`
* `Date.MONTH(_month, _short, _lang)`
* `[Date.]date(_which, _date)`
* `date.getDateFormat(_format)`
* `date.getDefaultDateFormat(_resolve)`

## `.format()`
You can use `new Date().format()` or `Date.format()`, maybe even the `date()` function.

### Modifiers
These are the **`%`** modifiers for format strings. I tried to make them one single char only
(plus the **`%`** prefix, as already known from other implementations of this feature).

| Modifier | Time component |
| -------: | :---------------------------------------------------------- |
|  **%d**  | Day in Year                                                 |
|  **%Y**  | Year (full 4 digits)                                        |
|  **%y**  | Year (2 digits only)                                        |
|  **%M**  | Month                                                       |
|  **%D**  | Day of Month                                                |
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
|  **%N**  | Name of Month (long)                                        |
|  **%n**  | Name of Month (short)                                       |
|  **%W**  | Name of Weekday (long)                                      |
|  **%w**  | Name of Weekday (short)                                     |
|  **%G**  | GMT format                                                  |
|  **%U**  | UTC format                                                  |

### Pre-defined formats (see `css/config.css`);
The names (after `--date-`) can be used for `.format()` etc. instead of real format strings. These are **pre-defined** formats.

```css
	--date-now: '%h:%m:%s.%S';
	--date-time: '%h:%m:%s';
	--date-date: '%Y-%M-%D';
	--date-default: '%Y-%M-%D (%h:%m:%s)';
	--date-best: '%Y-%M-%D (%h:%m:%s.%S)';
	--date-console: '%Y-%M-%D %h:%m:%s.%S';
	--date-full: '%W, %Y-%M-%D (%h:%m:%s)';
	--date-text: '%w, %D. %n %Y (%h:%m:%s)';
	--date-text-full: '%W, %D. %N %Y (%h:%m:%s.%S)';
	--date-year: '%d (%w)';
	--date-ms: '%X';
	--date-unix: '%x';
	--date-gmt: '%G';
	--date-utc: '%U';
```
