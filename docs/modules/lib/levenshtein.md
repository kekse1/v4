<img src="https://kekse.biz/github.php?draw&text=`Levenshtein`&override=github:v4" />

# The `levenshtein distance`
An algorithm for word comparison.

Used partially e.g. when an invalid command was entered, then some software
checks against other possible commands. A **`distance`** will be calculated,
so the compared word with least distance is suggested as most possible command
you really wanted to call.

## My version
* (a) can also be non-case-sensitive (by boolean argument)
* (b) can return a (always sorted, asc.) list w/ or w/o distances
* (c) currently only implements matrix form; vector is TODO (but not really necessary)

## Implementation
* `levenshtein(_word, ... _compare)`
* `levenshtein.distance(_a, _b, _case_sensitive, _algorithm)`
* `levenshtein.distance.matrix(_a, _b)`
* `levenshtein.distance.vector(_a, _b)`

You only need the first base function, where you can define the e.g. entered word input,
and then a list of words to compare against (so e.g. the list of available commands).

If there's a boolean type in the `... _compare`, it'll count as true/false **case sensitive**,
and a `null` value will negate the `DEFAULT_WITH_DISTANCES = true`.

## Vector instead of Matrix
This is a somewhat 'optimized' version of the algorithm, where e.g. no special visualization
or so is necessary, so it works with less data and so in better time/power consumption, etc.

Therefore:
* `levenshtein.distance.vector(_a, _b)`

... **:-)**

Just use the `const DEFAULT_DISTANCE` on top of the `levenshtein.js` file to switch between
`matrix` and `vector` mode/usage.

