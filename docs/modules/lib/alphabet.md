<img src="https://kekse.biz/github.php?draw&text=`alphabet`&override=github:v4" />

# **`alphabet`**
This is the counter-part for my [`radix`.js](radix.md) extensions.. using bigger alphabets than the regular **36** maximum
in plain JavaScript; so even real 'bytecode' is possible with the **256** radix (or it's negation **-257**).

## Special alphabet(s)
There's also these both I call the 'whole' and the 'half' or 'full', which are represented as **0** and **1** radix.
They only contain letters, one only lower cases (the half **1**), the other one letters w/ both cases (the whole/full **0**).

## `DEFAULT_PREFER`
This is merely the only interesting **constant** in here: this is where you use a binary alphabet (above **62**, up to **256**);
to keep there the support of floating points and negative numbers, the `.` (decimal point), the `-` and the `+` will be kept out
of the alphabet as long as possible. So maybe you don't like to use the whole **256** radix for all bytes, instead either **255**
to keep support for floating points, or the **254** to also allow negative values, and maybe even **253** to also support `+`.

## (TODO)
(so more description, etc.)

