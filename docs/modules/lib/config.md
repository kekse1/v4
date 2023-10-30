<img src="https://kekse.biz/github.php?draw&text=`Configuration`&override=github:v4" />

# Configuration file(s)
In the future this will be a class for configuration files, with my own syntax.

Since I'll be using this `lib/` part in console apps etc. l8rs, this could
be as useful as my `getopt` module (which is also a future feature.. my old
version of this can be seen at [libjs.de](https://libjs.de/)).

## Example
This is still /TODO/ (currently being developed since my `httpz` needs it):

```
start = abc def;

eins
{
	zwei
	{
		pi: 3.14;
	};

    bool: yes;
    string: `yes`;
};

eins.zwei
{
	drei.vier
	{
        arr: eins, zwei, drei;
	};

    size: 1024MiB;
    regexp: /tmp/gi;
};

eins.zwei.drei.five = /abc/gi;
```

